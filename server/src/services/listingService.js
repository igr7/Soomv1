import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a new listing
 */
export const createListing = async ({
  sellerId,
  title,
  description,
  gameCategory,
  startPrice,
  buyNowPrice,
  duration, // in hours
  images
}) => {
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + duration);

  const listing = await prisma.listing.create({
    data: {
      sellerId,
      title,
      description,
      gameCategory,
      startPrice,
      buyNowPrice,
      currentBid: startPrice,
      status: 'ACTIVE',
      endTime,
      images: {
        create: images.map(url => ({ url }))
      }
    },
    include: {
      seller: {
        select: {
          id: true,
          username: true
        }
      },
      images: true
    }
  });

  return listing;
};

/**
 * Get listing by ID
 */
export const getListingById = async (listingId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      seller: {
        select: {
          id: true,
          username: true,
          createdAt: true
        }
      },
      images: true,
      bids: {
        include: {
          bidder: {
            select: {
              id: true,
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });

  if (!listing) {
    throw new Error('LISTING_NOT_FOUND');
  }

  return listing;
};

/**
 * Get all listings with filters
 */
export const getListings = async ({
  gameCategory,
  status = 'ACTIVE',
  minPrice,
  maxPrice,
  search,
  page = 1,
  limit = 20
}) => {
  const where = {
    status,
    ...(gameCategory && { gameCategory }),
    ...(minPrice && { startPrice: { gte: minPrice } }),
    ...(maxPrice && { startPrice: { lte: maxPrice } }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            username: true
          }
        },
        images: {
          take: 1
        },
        _count: {
          select: { bids: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.listing.count({ where })
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

/**
 * Get user's listings
 */
export const getUserListings = async (userId) => {
  const listings = await prisma.listing.findMany({
    where: { sellerId: userId },
    include: {
      images: {
        take: 1
      },
      _count: {
        select: { bids: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return listings;
};

/**
 * Update listing
 */
export const updateListing = async (listingId, sellerId, updates) => {
  // Verify ownership
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new Error('LISTING_NOT_FOUND');
  }

  if (listing.sellerId !== sellerId) {
    throw new Error('UNAUTHORIZED');
  }

  if (listing.status !== 'PENDING') {
    throw new Error('CANNOT_UPDATE_ACTIVE_LISTING');
  }

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: updates,
    include: {
      seller: {
        select: {
          id: true,
          username: true
        }
      },
      images: true
    }
  });

  return updated;
};

/**
 * Delete listing
 */
export const deleteListing = async (listingId, sellerId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new Error('LISTING_NOT_FOUND');
  }

  if (listing.sellerId !== sellerId) {
    throw new Error('UNAUTHORIZED');
  }

  if (listing.status === 'ACTIVE' && listing.currentBid > listing.startPrice) {
    throw new Error('CANNOT_DELETE_LISTING_WITH_BIDS');
  }

  await prisma.listing.delete({
    where: { id: listingId }
  });

  return { success: true };
};

/**
 * Check and update expired listings
 */
export const updateExpiredListings = async () => {
  const now = new Date();

  const expiredListings = await prisma.listing.findMany({
    where: {
      status: 'ACTIVE',
      endTime: {
        lte: now
      }
    },
    include: {
      bids: {
        orderBy: {
          amount: 'desc'
        },
        take: 1,
        include: {
          bidder: true
        }
      }
    }
  });

  for (const listing of expiredListings) {
    if (listing.bids.length > 0) {
      // Mark as sold
      await prisma.listing.update({
        where: { id: listing.id },
        data: { status: 'SOLD' }
      });
    } else {
      // No bids, mark as pending
      await prisma.listing.update({
        where: { id: listing.id },
        data: { status: 'PENDING' }
      });
    }
  }

  return expiredListings.length;
};

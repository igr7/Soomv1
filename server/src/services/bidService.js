import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Place a bid on a listing
 */
export const placeBid = async ({ listingId, bidderId, amount }) => {
  // Get listing with current bids
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        orderBy: { amount: 'desc' },
        take: 1
      }
    }
  });

  if (!listing) {
    throw new Error('LISTING_NOT_FOUND');
  }

  // Validation checks
  if (listing.status !== 'ACTIVE') {
    throw new Error('LISTING_NOT_ACTIVE');
  }

  if (listing.sellerId === bidderId) {
    throw new Error('CANNOT_BID_OWN_LISTING');
  }

  if (new Date() > listing.endTime) {
    throw new Error('AUCTION_ENDED');
  }

  const currentHighestBid = listing.currentBid || listing.startPrice;
  const minimumBid = currentHighestBid + 1; // Minimum increment of 1 SAR

  if (amount < minimumBid) {
    throw new Error('BID_TOO_LOW');
  }

  // Check user wallet balance
  const user = await prisma.user.findUnique({
    where: { id: bidderId }
  });

  if (user.walletBalance < amount) {
    throw new Error('INSUFFICIENT_FUNDS');
  }

  // Create bid and update listing in transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the bid
    const bid = await tx.bid.create({
      data: {
        listingId,
        bidderId,
        amount
      },
      include: {
        bidder: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    // Update listing current bid
    await tx.listing.update({
      where: { id: listingId },
      data: { currentBid: amount }
    });

    // Create escrow hold transaction
    await tx.transaction.create({
      data: {
        userId: bidderId,
        amount,
        type: 'ESCROW_HOLD',
        status: 'PENDING',
        reference: listingId
      }
    });

    return bid;
  });

  return result;
};

/**
 * Buy now - instant purchase at buy now price
 */
export const buyNow = async ({ listingId, buyerId }) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId }
  });

  if (!listing) {
    throw new Error('LISTING_NOT_FOUND');
  }

  if (listing.status !== 'ACTIVE') {
    throw new Error('LISTING_NOT_ACTIVE');
  }

  if (!listing.buyNowPrice) {
    throw new Error('BUY_NOW_NOT_AVAILABLE');
  }

  if (listing.sellerId === buyerId) {
    throw new Error('CANNOT_BUY_OWN_LISTING');
  }

  // Check buyer wallet balance
  const buyer = await prisma.user.findUnique({
    where: { id: buyerId }
  });

  if (buyer.walletBalance < listing.buyNowPrice) {
    throw new Error('INSUFFICIENT_FUNDS');
  }

  // Process buy now transaction
  const result = await prisma.$transaction(async (tx) => {
    // Update listing status
    await tx.listing.update({
      where: { id: listingId },
      data: {
        status: 'SOLD',
        currentBid: listing.buyNowPrice
      }
    });

    // Create winning bid
    const bid = await tx.bid.create({
      data: {
        listingId,
        bidderId: buyerId,
        amount: listing.buyNowPrice
      }
    });

    // Deduct from buyer wallet
    await tx.user.update({
      where: { id: buyerId },
      data: {
        walletBalance: {
          decrement: listing.buyNowPrice
        }
      }
    });

    // Add to seller wallet (minus platform fee - 5%)
    const platformFee = listing.buyNowPrice * 0.05;
    const sellerAmount = listing.buyNowPrice - platformFee;

    await tx.user.update({
      where: { id: listing.sellerId },
      data: {
        walletBalance: {
          increment: sellerAmount
        }
      }
    });

    // Create transactions
    await tx.transaction.create({
      data: {
        userId: buyerId,
        amount: listing.buyNowPrice,
        type: 'ESCROW_HOLD',
        status: 'COMPLETED',
        reference: listingId
      }
    });

    await tx.transaction.create({
      data: {
        userId: listing.sellerId,
        amount: sellerAmount,
        type: 'ESCROW_RELEASE',
        status: 'COMPLETED',
        reference: listingId
      }
    });

    return bid;
  });

  return result;
};

/**
 * Get bids for a listing
 */
export const getListingBids = async (listingId) => {
  const bids = await prisma.bid.findMany({
    where: { listingId },
    include: {
      bidder: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: {
      amount: 'desc'
    }
  });

  return bids;
};

/**
 * Get user's bids
 */
export const getUserBids = async (userId) => {
  const bids = await prisma.bid.findMany({
    where: { bidderId: userId },
    include: {
      listing: {
        include: {
          images: {
            take: 1
          },
          seller: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return bids;
};

/**
 * Process auction completion
 */
export const completeAuction = async (listingId) => {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      bids: {
        orderBy: { amount: 'desc' },
        take: 1,
        include: {
          bidder: true
        }
      }
    }
  });

  if (!listing || listing.bids.length === 0) {
    return null;
  }

  const winningBid = listing.bids[0];
  const platformFee = winningBid.amount * 0.05;
  const sellerAmount = winningBid.amount - platformFee;

  await prisma.$transaction(async (tx) => {
    // Update listing
    await tx.listing.update({
      where: { id: listingId },
      data: { status: 'SOLD' }
    });

    // Transfer funds
    await tx.user.update({
      where: { id: winningBid.bidderId },
      data: {
        walletBalance: {
          decrement: winningBid.amount
        }
      }
    });

    await tx.user.update({
      where: { id: listing.sellerId },
      data: {
        walletBalance: {
          increment: sellerAmount
        }
      }
    });

    // Create transaction records
    await tx.transaction.create({
      data: {
        userId: winningBid.bidderId,
        amount: winningBid.amount,
        type: 'ESCROW_HOLD',
        status: 'COMPLETED',
        reference: listingId
      }
    });

    await tx.transaction.create({
      data: {
        userId: listing.sellerId,
        amount: sellerAmount,
        type: 'ESCROW_RELEASE',
        status: 'COMPLETED',
        reference: listingId
      }
    });
  });

  return winningBid;
};

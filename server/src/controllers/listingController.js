import * as listingService from '../services/listingService.js';

/**
 * Create a new listing
 * POST /api/listings
 */
export const createListing = async (req, res) => {
  try {
    const { title, description, gameCategory, startPrice, buyNowPrice, duration, images } = req.body;
    const sellerId = req.user.userId;

    const listing = await listingService.createListing({
      sellerId,
      title,
      description,
      gameCategory,
      startPrice: parseFloat(startPrice),
      buyNowPrice: buyNowPrice ? parseFloat(buyNowPrice) : null,
      duration: parseInt(duration),
      images: images || []
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create listing'
    });
  }
};

/**
 * Get all listings with filters
 * GET /api/listings
 */
export const getListings = async (req, res) => {
  try {
    const {
      gameCategory,
      status,
      minPrice,
      maxPrice,
      search,
      page,
      limit
    } = req.query;

    const result = await listingService.getListings({
      gameCategory,
      status,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20
    });

    res.json(result);
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch listings'
    });
  }
};

/**
 * Get listing by ID
 * GET /api/listings/:id
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await listingService.getListingById(id);

    res.json({ listing });
  } catch (error) {
    console.error('Get listing error:', error);

    if (error.message === 'LISTING_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch listing'
    });
  }
};

/**
 * Get user's listings
 * GET /api/listings/my
 */
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const listings = await listingService.getUserListings(userId);

    res.json({ listings });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch listings'
    });
  }
};

/**
 * Update listing
 * PUT /api/listings/:id
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const updates = req.body;

    const listing = await listingService.updateListing(id, userId, updates);

    res.json({
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    console.error('Update listing error:', error);

    if (error.message === 'LISTING_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found'
      });
    }

    if (error.message === 'UNAUTHORIZED') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only update your own listings'
      });
    }

    if (error.message === 'CANNOT_UPDATE_ACTIVE_LISTING') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot update active listing'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update listing'
    });
  }
};

/**
 * Delete listing
 * DELETE /api/listings/:id
 */
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await listingService.deleteListing(id, userId);

    res.json({
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    console.error('Delete listing error:', error);

    if (error.message === 'LISTING_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found'
      });
    }

    if (error.message === 'UNAUTHORIZED') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own listings'
      });
    }

    if (error.message === 'CANNOT_DELETE_LISTING_WITH_BIDS') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Cannot delete listing with active bids'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete listing'
    });
  }
};

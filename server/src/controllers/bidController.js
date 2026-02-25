import * as bidService from '../services/bidService.js';

/**
 * Place a bid on a listing
 * POST /api/bids
 */
export const placeBid = async (req, res) => {
  try {
    const { listingId, amount } = req.body;
    const bidderId = req.user.userId;

    const bid = await bidService.placeBid({
      listingId,
      bidderId,
      amount: parseFloat(amount)
    });

    res.status(201).json({
      message: 'Bid placed successfully',
      bid
    });
  } catch (error) {
    console.error('Place bid error:', error);

    if (error.message === 'LISTING_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found'
      });
    }

    if (error.message === 'LISTING_NOT_ACTIVE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Listing is not active'
      });
    }

    if (error.message === 'CANNOT_BID_OWN_LISTING') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot bid on your own listing'
      });
    }

    if (error.message === 'AUCTION_ENDED') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Auction has ended'
      });
    }

    if (error.message === 'BID_TOO_LOW') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Bid amount is too low'
      });
    }

    if (error.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Insufficient wallet balance'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to place bid'
    });
  }
};

/**
 * Buy now - instant purchase
 * POST /api/bids/buy-now
 */
export const buyNow = async (req, res) => {
  try {
    const { listingId } = req.body;
    const buyerId = req.user.userId;

    const result = await bidService.buyNow({ listingId, buyerId });

    res.json({
      message: 'Purchase completed successfully',
      bid: result
    });
  } catch (error) {
    console.error('Buy now error:', error);

    if (error.message === 'LISTING_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Listing not found'
      });
    }

    if (error.message === 'LISTING_NOT_ACTIVE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Listing is not active'
      });
    }

    if (error.message === 'BUY_NOW_NOT_AVAILABLE') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Buy now option is not available for this listing'
      });
    }

    if (error.message === 'CANNOT_BUY_OWN_LISTING') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'You cannot buy your own listing'
      });
    }

    if (error.message === 'INSUFFICIENT_FUNDS') {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Insufficient wallet balance'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to complete purchase'
    });
  }
};

/**
 * Get bids for a listing
 * GET /api/bids/listing/:listingId
 */
export const getListingBids = async (req, res) => {
  try {
    const { listingId } = req.params;

    const bids = await bidService.getListingBids(listingId);

    res.json({ bids });
  } catch (error) {
    console.error('Get listing bids error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch bids'
    });
  }
};

/**
 * Get user's bids
 * GET /api/bids/my
 */
export const getMyBids = async (req, res) => {
  try {
    const userId = req.user.userId;

    const bids = await bidService.getUserBids(userId);

    res.json({ bids });
  } catch (error) {
    console.error('Get my bids error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch bids'
    });
  }
};

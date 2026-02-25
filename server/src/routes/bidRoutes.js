import express from 'express';
import * as bidController from '../controllers/bidController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validatePlaceBid, validateBuyNow } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/bids
 * @desc    Place a bid on a listing
 * @access  Private
 */
router.post('/', authenticateToken, validatePlaceBid, bidController.placeBid);

/**
 * @route   POST /api/bids/buy-now
 * @desc    Buy now - instant purchase
 * @access  Private
 */
router.post('/buy-now', authenticateToken, validateBuyNow, bidController.buyNow);

/**
 * @route   GET /api/bids/my
 * @desc    Get current user's bids
 * @access  Private
 */
router.get('/my', authenticateToken, bidController.getMyBids);

/**
 * @route   GET /api/bids/listing/:listingId
 * @desc    Get all bids for a listing
 * @access  Public
 */
router.get('/listing/:listingId', bidController.getListingBids);

export default router;

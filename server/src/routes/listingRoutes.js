import express from 'express';
import * as listingController from '../controllers/listingController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateCreateListing, validateUpdateListing } from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   GET /api/listings
 * @desc    Get all listings with filters
 * @access  Public
 */
router.get('/', listingController.getListings);

/**
 * @route   GET /api/listings/my
 * @desc    Get current user's listings
 * @access  Private
 */
router.get('/my', authenticateToken, listingController.getMyListings);

/**
 * @route   GET /api/listings/:id
 * @desc    Get listing by ID
 * @access  Public
 */
router.get('/:id', listingController.getListingById);

/**
 * @route   POST /api/listings
 * @desc    Create new listing
 * @access  Private
 */
router.post('/', authenticateToken, validateCreateListing, listingController.createListing);

/**
 * @route   PUT /api/listings/:id
 * @desc    Update listing
 * @access  Private
 */
router.put('/:id', authenticateToken, validateUpdateListing, listingController.updateListing);

/**
 * @route   DELETE /api/listings/:id
 * @desc    Delete listing
 * @access  Private
 */
router.delete('/:id', authenticateToken, listingController.deleteListing);

export default router;

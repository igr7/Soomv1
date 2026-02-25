/**
 * Validation middleware for request data
 */

/**
 * Validate registration data
 */
export const validateRegister = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  // Username validation
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.length > 20) {
    errors.push('Username must be less than 20 characters');
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, and underscores');
  }

  // Email validation
  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Invalid email format');
  }

  // Password validation
  if (!password || password.length === 0) {
    errors.push('Password is required');
  } else if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
};

/**
 * Validate login data
 */
export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!password || password.length === 0) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
};

/**
 * Validate refresh token request
 */
export const validateRefreshToken = (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken || refreshToken.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Refresh token is required'
    });
  }

  next();
};

/**
 * Validate create listing data
 */
export const validateCreateListing = (req, res, next) => {
  const { title, gameCategory, startPrice, duration } = req.body;
  const errors = [];

  if (!title || title.trim().length === 0) {
    errors.push('Title is required');
  } else if (title.length < 5) {
    errors.push('Title must be at least 5 characters');
  } else if (title.length > 100) {
    errors.push('Title must be less than 100 characters');
  }

  if (!gameCategory || gameCategory.trim().length === 0) {
    errors.push('Game category is required');
  }

  if (!startPrice) {
    errors.push('Start price is required');
  } else if (isNaN(startPrice) || parseFloat(startPrice) < 1) {
    errors.push('Start price must be at least 1 SAR');
  }

  if (!duration) {
    errors.push('Duration is required');
  } else if (isNaN(duration) || parseInt(duration) < 1 || parseInt(duration) > 168) {
    errors.push('Duration must be between 1 and 168 hours (7 days)');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
};

/**
 * Validate update listing data
 */
export const validateUpdateListing = (req, res, next) => {
  const { title, description } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (title.trim().length === 0) {
      errors.push('Title cannot be empty');
    } else if (title.length < 5) {
      errors.push('Title must be at least 5 characters');
    } else if (title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }
  }

  if (description !== undefined && description.length > 1000) {
    errors.push('Description must be less than 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
};

/**
 * Validate place bid data
 */
export const validatePlaceBid = (req, res, next) => {
  const { listingId, amount } = req.body;
  const errors = [];

  if (!listingId || listingId.trim().length === 0) {
    errors.push('Listing ID is required');
  }

  if (!amount) {
    errors.push('Bid amount is required');
  } else if (isNaN(amount) || parseFloat(amount) < 1) {
    errors.push('Bid amount must be at least 1 SAR');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation Error',
      messages: errors
    });
  }

  next();
};

/**
 * Validate buy now data
 */
export const validateBuyNow = (req, res, next) => {
  const { listingId } = req.body;

  if (!listingId || listingId.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Listing ID is required'
    });
  }

  next();
};


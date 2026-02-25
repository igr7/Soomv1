import * as authService from '../services/authService.js';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const result = await authService.registerUser({
      username,
      email,
      password
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.message === 'EMAIL_EXISTS') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Email already registered'
      });
    }

    if (error.message === 'USERNAME_EXISTS') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Username already taken'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to register user'
    });
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    res.json({
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);

    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to login'
    });
  }
};

/**
 * Refresh access token
 * POST /api/auth/refresh
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshAccessToken(refreshToken);

    res.json({
      message: 'Token refreshed successfully',
      accessToken: result.accessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    if (error.message === 'INVALID_REFRESH_TOKEN') {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired refresh token'
      });
    }

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to refresh token'
    });
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
export const getProfile = async (req, res) => {
  try {
    const user = await authService.getUserById(req.user.userId);

    res.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get user profile'
    });
  }
};

/**
 * Logout user (client-side token removal)
 * POST /api/auth/logout
 */
export const logout = async (req, res) => {
  // In a stateless JWT system, logout is handled client-side
  // by removing the tokens from storage
  res.json({
    message: 'Logout successful'
  });
};

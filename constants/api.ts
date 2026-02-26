import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://loving-inspiration-production-278a.up.railway.app';

/**
 * Get stored access token
 */
const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem('accessToken');
  } catch (error) {
    return null;
  }
};

/**
 * Make API request with error handling
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.message || data.error || 'Request failed',
        errors: data.messages || [],
        response: { data }
      };
    }

    return data;
  } catch (error) {
    if (error.status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error. Please check your connection.',
      errors: [],
    };
  }
};

/**
 * Auth API
 */
export const authAPI = {
  register: async (username, email, password) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email, password) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  refresh: async (refreshToken) => {
    return apiRequest('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  getProfile: async (accessToken) => {
    return apiRequest('/api/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  logout: async (accessToken) => {
    return apiRequest('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

/**
 * General API client with automatic authentication
 */
export const api = {
  get: async (endpoint) => {
    const token = await getAccessToken();
    return apiRequest(endpoint, {
      method: 'GET',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },

  post: async (endpoint, data) => {
    const token = await getAccessToken();
    return apiRequest(endpoint, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  put: async (endpoint, data) => {
    const token = await getAccessToken();
    return apiRequest(endpoint, {
      method: 'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify(data),
    });
  },

  delete: async (endpoint) => {
    const token = await getAccessToken();
    return apiRequest(endpoint, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
};

export default apiRequest;

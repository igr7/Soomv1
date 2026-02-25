import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../constants/api';

const AuthContext = createContext(null);

const ACCESS_TOKEN_KEY = '@soom_access_token';
const REFRESH_TOKEN_KEY = '@soom_refresh_token';
const USER_KEY = '@soom_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [storedAccessToken, storedRefreshToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(ACCESS_TOKEN_KEY),
        AsyncStorage.getItem(REFRESH_TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (storedAccessToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAuthData = async (accessToken, refreshToken, user) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken),
        AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken),
        AsyncStorage.setItem(USER_KEY, JSON.stringify(user)),
      ]);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setUser(user);
    } catch (error) {
      console.error('Failed to save auth data:', error);
      throw error;
    }
  };

  const clearAuthData = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);
      await saveAuthData(response.accessToken, response.refreshToken, response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message, errors: error.errors };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      await saveAuthData(response.accessToken, response.refreshToken, response.user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      if (accessToken) {
        await authAPI.logout(accessToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await clearAuthData();
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      const response = await authAPI.refresh(refreshToken);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
      setAccessToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await clearAuthData();
      throw error;
    }
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

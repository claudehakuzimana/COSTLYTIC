import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore.js';

export const useAuth = () => {
  const authStore = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !authStore.user) {
      // Verify token and load user
      authStore.verifyToken(token);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        authStore.setUser(data.user);
        authStore.setToken(data.token);
      }
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    authStore.clearAuth();
  };

  return {
    user: authStore.user,
    token: authStore.token,
    isAuthenticated: !!authStore.token,
    login,
    logout
  };
};

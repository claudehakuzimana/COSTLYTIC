import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

// Safe localStorage for persist (avoids throw in private/incognito or when disabled)
function getStorage() {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch (_) {}
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
}

// Auth store with persistence to localStorage
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setUser: (user) => {
        set({ user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },

      setToken: (token) => {
        set({ token });
        if (token) {
          localStorage.setItem('authToken', token);
        } else {
          localStorage.removeItem('authToken');
        }
      },

      login: async (email, password) => {
        const response = await authAPI.login({ email, password });
        const data = response.data;
        const userWithSubscription = {
          ...data.user,
          subscriptionTier: data.user.subscriptionTier || 'free',
          subscriptionStatus: data.user.subscriptionStatus || 'trial'
        };
        set({ user: userWithSubscription, token: data.token });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(userWithSubscription));
        return { ...data, user: userWithSubscription };
      },

      register: async (userInfo) => {
        const response = await authAPI.register(userInfo);
        const data = response.data;
        const userWithSubscription = {
          ...data.user,
          subscriptionTier: data.user.subscriptionTier || 'free',
          subscriptionStatus: data.user.subscriptionStatus || 'trial'
        };
        set({ user: userWithSubscription, token: data.token });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(userWithSubscription));
        return { ...data, user: userWithSubscription };
      },

      loginWithToken: async (token) => {
        set({ token });
        localStorage.setItem('authToken', token);

        const response = await authAPI.getProfile();
        const profileUser = response.data?.user;

        const userWithSubscription = {
          ...profileUser,
          subscriptionTier: profileUser?.subscriptionTier || 'free',
          subscriptionStatus: profileUser?.subscriptionStatus || 'trial'
        };

        set({ user: userWithSubscription });
        localStorage.setItem('user', JSON.stringify(userWithSubscription));
        return userWithSubscription;
      },

      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }),
    {
      name: 'auth-store',
      getStorage,
      partialize: (state) => ({
        user: state.user,
        token: state.token
      })
    }
  )
);

export default useAuthStore;

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import apiClient from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, role?: 'admin' | 'user') => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User, token: string) => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.login({ email, password });
          set({
            user: response.data.user,
            token: response.data.token,
            isLoading: false,
            error: null,
          });
          // Store in localStorage for persistence
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      signup: async (email: string, password: string, role: 'admin' | 'user' = 'user') => {
        set({ isLoading: true, error: null });
        try {
          const response = await apiClient.signup({ email, password, role });
          set({
            user: response.data.user,
            token: response.data.token,
            isLoading: false,
            error: null,
          });
          // Store in localStorage for persistence
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Signup failed';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await apiClient.logout();
        } catch (error) {
          // Continue with logout even if API call fails
          console.error('Logout API error:', error);
        } finally {
          set({
            user: null,
            token: null,
            isLoading: false,
            error: null,
          });
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      },

      getCurrentUser: async () => {
        console.log('🔄 getCurrentUser called');
        
        // Skip if no token
        const currentToken = get().token;
        if (!currentToken) {
          console.log('🔄 No token, skipping getCurrentUser');
          set({ isLoading: false });
          return;
        }

        console.log('🔄 Making API call to /auth/me');
        set({ isLoading: true });
        try {
          const response = await apiClient.getCurrentUser();
          console.log('🔄 getCurrentUser success:', response.data.user.email);
          set({
            user: response.data.user,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          console.log('🔄 getCurrentUser failed:', error instanceof Error ? error.message : 'Unknown error');
          // Don't clear localStorage or log out user on getCurrentUser failure
          // Just set loading to false and keep existing user state
          set({
            isLoading: false,
            error: null, // Don't show error for background user fetch
          });
          console.warn('Failed to refresh user data:', error instanceof Error ? error.message : 'Unknown error');
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setUser: (user: User, token: string) => {
        set({ user, token });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      },

      initialize: () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({ user, token });
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            set({ user: null, token: null });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
); 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  // Actions
  setAuth: (user: User, access_token: string, refresh_token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      refresh_token: null,
      isAuthenticated: false,
      hasHydrated: false,
      setAuth: (user, access_token, refresh_token) => {
        // Also write to localStorage so the Axios interceptor can read it
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        set({ user, access_token, refresh_token, isAuthenticated: true });
      },

      updateUser: (updatedFields) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        })),

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        set({
          user: null,
          access_token: null,
          refresh_token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'healthcare-auth', // key in localStorage
      // Only persist the user object — tokens are managed separately
     partialize: (state) => ({
    user: state.user,
    access_token: state.access_token,
    refresh_token: state.refresh_token,
    isAuthenticated: state.isAuthenticated,
    }),
    }
  )
);
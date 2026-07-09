'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { AuthResponse, LoginInput, RegisterInput } from '@/types';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();

  // ── Login ─────────────────────────────────────────────────────────────────
  const loginMutation = useMutation({
    mutationFn: async (input: LoginInput) => {
      const response = await api.post<{ data: AuthResponse }>('/auth/login', input);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      // Redirect based on role
      if (data.user.role === 'doctor') {
        router.push('/dashboard/doctors');
      } else {
        router.push('/dashboard/patient');
      }
    },
  });

  // ── Register ──────────────────────────────────────────────────────────────
  const registerMutation = useMutation({
    mutationFn: async (input: RegisterInput) => {
      const response = await api.post<{ data: AuthResponse }>('/auth/register', input);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access_token, data.refresh_token);
      if (data.user.role === 'doctor') {
        router.push('/dashboard/doctors');
      } else {
        router.push('/dashboard/patient');
      }
    },
  });

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    storeLogout();
    queryClient.clear(); // clear all cached queries on logout
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerAsync: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout,
  };
};

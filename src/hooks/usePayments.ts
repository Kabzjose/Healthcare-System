'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import {api, apiGet, apiPost } from '@/lib/api';
import { Payment, PaginatedResponse, PaginationMeta } from '@/types';

// ── Patient payment history ───────────────────────────────────────────────────
export const useMyPayments = (filters: { status?: string; page?: number } = {}) => {
  return useQuery({
    queryKey: ['payments', 'my', filters],
    queryFn: async () => {
      const response = await api.get('/payments/my', { params: filters });
      return {
        data: response.data.data as Payment[],
        meta: response.data.meta as PaginationMeta,
      };
    },
  });
};

// ── Create Stripe checkout session ────────────────────────────────────────────
export const useCreateCheckoutSession = () => {
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const data = await apiPost<{ checkout_url: string; payment_id: string }>(
        '/payments/checkout',
        { appointment_id: appointmentId }
      );
      return data;
    },
    onSuccess: (data) => {
      // Redirect to Stripe hosted checkout page
      window.location.href = data.checkout_url;
    },
  });
};

// ── Initiate M-Pesa STK push ──────────────────────────────────────────────────
export const useInitiateMpesa = () => {
  return useMutation({
    mutationFn: ({ appointmentId, phone }: { appointmentId: string; phone: string }) =>
      apiPost<{ checkoutRequestId: string; message: string }>('/payments/mpesa/initiate', {
        appointment_id: appointmentId,
        phone,
      }),
  });
};
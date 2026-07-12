'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import {
  DoctorProfile,
  AvailabilitySlot,
  PaginatedResponse,
  PaginationMeta,
  CreateDoctorProfileInput,
  CreateAvailabilitySlotsInput,
} from '@/types';

// ── Query keys — centralised so invalidations are consistent ──────────────────
export const doctorKeys = {
  all: ['doctors'] as const,
  lists: () => [...doctorKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...doctorKeys.lists(), filters] as const,
  detail: (id: string) => [...doctorKeys.all, id] as const,
  availability: (id: string) => [...doctorKeys.detail(id), 'availability'] as const,
  myProfile: () => [...doctorKeys.all, 'me'] as const,
  myAvailability: () => [...doctorKeys.all, 'me', 'availability'] as const,
};

// ── Browse all doctors (public) ───────────────────────────────────────────────
export const useDoctors = (filters: { specialization?: string; page?: number } = {}) => {
  return useQuery({
    queryKey: doctorKeys.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await api.get('/doctors', { params: filters });
      return {
        data: response.data.data as DoctorProfile[],
        meta: response.data.meta as PaginationMeta,
      };
    },
  });
};

// ── Single doctor (public) ────────────────────────────────────────────────────
export const useDoctor = (profileId: string) => {
  return useQuery({
    queryKey: doctorKeys.detail(profileId),
    queryFn: () => apiGet<DoctorProfile>(`/doctors/${profileId}`),
    enabled: !!profileId,
  });
};

// ── Doctor's availability (public) ────────────────────────────────────────────
export const useDoctorAvailability = (profileId: string) => {
  return useQuery({
    queryKey: doctorKeys.availability(profileId),
    queryFn: () => apiGet<AvailabilitySlot[]>(`/doctors/${profileId}/availability`),
    enabled: !!profileId,
  });
};

// ── My profile (doctor dashboard) ─────────────────────────────────────────────
export const useMyDoctorProfile = () => {
  return useQuery({
    queryKey: doctorKeys.myProfile(),
    queryFn: () => apiGet<DoctorProfile>('/doctors/profile/me'),
    retry: false, // don't retry if profile doesn't exist yet
  });
};

// ── My availability (doctor dashboard) ────────────────────────────────────────
export const useMyAvailability = () => {
  return useQuery({
    queryKey: doctorKeys.myAvailability(),
    queryFn: () => apiGet<AvailabilitySlot[]>('/doctors/availability/me'),
  });
};

// ── Create doctor profile ─────────────────────────────────────────────────────
export const useCreateDoctorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDoctorProfileInput) =>
      apiPost<DoctorProfile>('/doctors/profile', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myProfile() });
    },
  });
};

// ── Update doctor profile ─────────────────────────────────────────────────────
export const useUpdateDoctorProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Partial<CreateDoctorProfileInput>) =>
      apiPatch<DoctorProfile>('/doctors/profile', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myProfile() });
    },
  });
};

// ── Create availability slots ─────────────────────────────────────────────────
export const useCreateAvailabilitySlots = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAvailabilitySlotsInput) =>
      apiPost<AvailabilitySlot[]>('/doctors/availability', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myAvailability() });
    },
  });
};

// ── Toggle slot ───────────────────────────────────────────────────────────────
export const useToggleSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slotId, is_active }: { slotId: string; is_active: boolean }) =>
      apiPatch<AvailabilitySlot>(`/doctors/availability/${slotId}`, { is_active }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myAvailability() });
    },
  });
};

// ── Delete slot ───────────────────────────────────────────────────────────────
export const useDeleteSlot = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slotId: string) => apiDelete(`/doctors/availability/${slotId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorKeys.myAvailability() });
    },
  });
};

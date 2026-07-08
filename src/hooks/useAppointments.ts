'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPatch } from '@/lib/api';
import { Appointment, BookAppointmentInput, PaginatedResponse } from '@/types';

export const appointmentKeys = {
  all: ['appointments'] as const,
  myPatient: (filters: Record<string, unknown>) =>
    [...appointmentKeys.all, 'patient', filters] as const,
  myDoctor: (filters: Record<string, unknown>) =>
    [...appointmentKeys.all, 'doctor', filters] as const,
  detail: (id: string) => [...appointmentKeys.all, id] as const,
};

// ── Patient's appointments ────────────────────────────────────────────────────
export const usePatientAppointments = (
  filters: { status?: string; page?: number } = {}
) => {
  return useQuery({
    queryKey: appointmentKeys.myPatient(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Appointment>>('/appointments/my', filters as Record<string, unknown>),
  });
};

// ── Doctor's appointments ─────────────────────────────────────────────────────
export const useDoctorAppointments = (
  filters: { status?: string; date?: string; page?: number } = {}
) => {
  return useQuery({
    queryKey: appointmentKeys.myDoctor(filters as Record<string, unknown>),
    queryFn: () =>
      apiGet<PaginatedResponse<Appointment>>(
        '/appointments/doctor/my',
        filters as Record<string, unknown>
      ),
  });
};

// ── Single appointment ────────────────────────────────────────────────────────
export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: appointmentKeys.detail(appointmentId),
    queryFn: () => apiGet<Appointment>(`/appointments/${appointmentId}`),
    enabled: !!appointmentId,
  });
};

// ── Book appointment ──────────────────────────────────────────────────────────
export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: BookAppointmentInput) =>
      apiPost<Appointment>('/appointments', input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// ── Cancel appointment (patient) ──────────────────────────────────────────────
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, reason }: { appointmentId: string; reason?: string }) =>
      apiPatch<Appointment>(`/appointments/${appointmentId}/cancel`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};

// ── Update appointment status (doctor) ───────────────────────────────────────
export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      status,
      notes,
    }: {
      appointmentId: string;
      status: 'confirmed' | 'completed' | 'no_show';
      notes?: string;
    }) => apiPatch<Appointment>(`/appointments/${appointmentId}/status`, { status, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.all });
    },
  });
};
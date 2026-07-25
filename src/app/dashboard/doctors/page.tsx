'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, Users, CheckCircle2, ArrowRight, Stethoscope, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { useDoctorAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export default function DoctorDashboardPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { data: pendingData, isLoading: loadingPending } = useDoctorAppointments({ status: 'pending' });
  const { data: confirmedData } = useDoctorAppointments({ status: 'confirmed' });
  const { data: completedData } = useDoctorAppointments({ status: 'completed' });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();

  const pendingAppointments = (pendingData?.data ?? []).slice(0, 3);
  const confirmedAppointments = (confirmedData?.data ?? []).slice(0, 3);

  const handleUpdateStatus = (id: string, status: 'confirmed' | 'completed' | 'no_show') => {
    updateStatus(
      { appointmentId: id, status },
      {
        onSuccess: () => toast({ title: `Appointment status updated to ${status}` }),
        onError: (err: unknown) => {
          const apiError = err as AxiosError<{ message?: string }>;
          toast({
            title: 'Update failed',
            description: apiError.response?.data?.message ?? apiError.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const pendingCount = pendingData?.meta?.total ?? 0;
  const confirmedCount = confirmedData?.meta?.total ?? 0;
  const completedCount = completedData?.meta?.total ?? 0;
  const totalPatients = pendingCount + confirmedCount + completedCount;

  return (
    <div className="space-y-8 font-sans">
      {/* Doctor Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-900 via-primary-800 to-teal-800 p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Doctor Dashboard
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, Dr. {user?.last_name ?? user?.first_name} 👋
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Manage patient bookings, confirm consultation requests, and update your weekly practice schedule.
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button asChild size="lg" className="rounded-2xl bg-white text-primary-900 hover:bg-primary-50 font-bold shadow-card">
              <Link href="/dashboard/doctors/availability">
                <Clock className="mr-1.5 h-4 w-4 text-teal-600" /> Manage Schedule
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Approval</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{pendingCount}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Needs confirmation</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Confirmed</span>
            <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{confirmedCount}</p>
          <span className="text-[11px] text-primary-600 font-semibold mt-1 block">Scheduled visits</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{completedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Finished consultations</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Patients</span>
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{totalPatients}</p>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">Patient engagements</span>
        </div>
      </div>

      {/* Quick Action Navigation Buttons */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button asChild className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold text-xs gap-1.5">
          <Link href="/dashboard/doctors/appointments">
            <Calendar className="h-4 w-4" /> View All Appointments ({totalPatients})
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl border-border text-xs font-bold gap-1.5">
          <Link href="/dashboard/doctors/availability">
            <Clock className="h-4 w-4 text-teal-600" /> Availability & Slots
          </Link>
        </Button>
        <Button variant="outline" asChild className="rounded-xl border-border text-xs font-bold gap-1.5">
          <Link href="/dashboard/doctors/me">
            <Stethoscope className="h-4 w-4 text-primary-600" /> Doctor Profile & Fees
          </Link>
        </Button>
      </div>

      {/* Pending Requests Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">Awaiting Your Confirmation</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Incoming patient appointment requests</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-primary-600">
            <Link href="/dashboard/doctors/appointments">
              Manage All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>

        {loadingPending ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : pendingAppointments.length === 0 ? (
          <EmptyState
            type="appointments"
            title="No pending requests"
            description="You are all caught up! New appointment bookings will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                role="doctor"
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Appointments Section */}
      {confirmedAppointments.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-foreground">Upcoming Confirmed Visits</h2>
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-primary-600">
              <Link href="/dashboard/doctors/appointments">View Schedule →</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {confirmedAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                role="doctor"
                onUpdateStatus={handleUpdateStatus}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

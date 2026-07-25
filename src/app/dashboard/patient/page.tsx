'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CreditCard, Search, Clock, CheckCircle2, Plus, ArrowRight, HeartPulse, ShieldAlert, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { usePatientAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { useCreateCheckoutSession } from '@/hooks/usePayments';
import { MpesaModal } from '@/components/payments/MpesaModal';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export default function PatientDashboardPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [mpesaAppt, setMpesaAppt] = useState<Appointment | null>(null);

  const { data: upcomingData, isLoading } = usePatientAppointments({ status: 'confirmed' });
  const { data: pendingData } = usePatientAppointments({ status: 'pending' });
  const { data: completedData } = usePatientAppointments({ status: 'completed' });

  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  const { mutate: stripeCheckout, isPending: isCheckingOut } = useCreateCheckoutSession();

  const upcomingAppointments = [
    ...(pendingData?.data ?? []),
    ...(upcomingData?.data ?? []),
  ].slice(0, 3);

  const handleCancel = (id: string) => {
    cancelAppointment(
      { appointmentId: id },
      {
        onSuccess: () => toast({ title: 'Appointment cancelled' }),
        onError: (err: unknown) => {
          const apiError = err as AxiosError<{ message?: string }>;
          toast({
            title: 'Could not cancel',
            description: apiError.response?.data?.message ?? apiError.message,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handlePay = (appt: Appointment) => {
    stripeCheckout(appt.id);
  };

  const totalAppts = (upcomingData?.meta?.total ?? 0) + (pendingData?.meta?.total ?? 0) + (completedData?.meta?.total ?? 0);
  const upcomingCount = (upcomingData?.meta?.total ?? 0) + (pendingData?.meta?.total ?? 0);
  const pendingPaymentCount = pendingData?.data?.filter((a) => a.payment_status === 'pending').length ?? 0;
  const completedCount = completedData?.meta?.total ?? 0;

  return (
    <div className="space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-700 via-primary-600 to-teal-600 p-6 sm:p-8 text-white shadow-card relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              Patient Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {user?.first_name} 👋
            </h1>
            <p className="text-sm text-primary-100 max-w-xl leading-relaxed">
              Here&apos;s an overview of your upcoming appointments, medical history, and health recommendations.
            </p>
          </div>
          <Button asChild size="lg" className="rounded-2xl bg-white text-primary-700 hover:bg-primary-50 font-bold shrink-0 shadow-card">
            <Link href="/doctors">
              <Plus className="mr-1.5 h-5 w-5" /> Book Appointment
            </Link>
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Visits</span>
            <div className="h-9 w-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{totalAppts}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">Lifetime appointments</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Upcoming</span>
            <div className="h-9 w-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{upcomingCount}</p>
          <span className="text-[11px] text-teal-600 font-semibold mt-1 block">Scheduled visits</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pending Payment</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{pendingPaymentCount}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Action required</span>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Completed</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-foreground mt-3">{completedCount}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Past consultations</span>
        </div>
      </div>

      {/* 3 Quick Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/doctors"
          className="stat-card hover:border-primary-300 hover:shadow-card-hover transition-all flex items-center gap-4 group"
        >
          <div className="h-12 w-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Search className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-primary-600 transition-colors text-sm">Find Specialists</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Browse 25+ verified doctors</p>
          </div>
        </Link>

        <Link
          href="/dashboard/patient/appointments"
          className="stat-card hover:border-primary-300 hover:shadow-card-hover transition-all flex items-center gap-4 group"
        >
          <div className="h-12 w-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-teal-600 transition-colors text-sm">My Appointments</h3>
            <p className="text-xs text-muted-foreground mt-0.5">View and manage schedule</p>
          </div>
        </Link>

        <Link
          href="/dashboard/patient/payments"
          className="stat-card hover:border-primary-300 hover:shadow-card-hover transition-all flex items-center gap-4 group"
        >
          <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-foreground group-hover:text-amber-600 transition-colors text-sm">Payment Records</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Invoices & M-Pesa receipts</p>
          </div>
        </Link>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-foreground">Upcoming Appointments</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Your next scheduled consultation slots</p>
          </div>
          <Button variant="ghost" size="sm" asChild className="text-xs font-bold text-primary-600 hover:text-primary-700">
            <Link href="/dashboard/patient/appointments">
              View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <EmptyState
            type="appointments"
            title="No upcoming appointments"
            description="You don't have any scheduled appointments right now."
            action={
              <Button asChild className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold">
                <Link href="/doctors">Find a Doctor</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingAppointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
                role="patient"
                onCancel={handleCancel}
                onPay={() => handlePay(appt)}
                isUpdating={isCancelling || isCheckingOut}
              />
            ))}
          </div>
        )}
      </div>

      {/* Health Tips & Articles */}
      <div className="space-y-4 pt-4 border-t border-border/60">
        <h2 className="text-xl font-extrabold text-foreground">Wellness & Health Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="stat-card space-y-3 bg-teal-50/40 border-teal-100">
            <div className="h-9 w-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
              <HeartPulse className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Hydration & Heart Health</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Drinking 2.5 liters of water daily supports cardiovascular efficiency and blood pressure regulation.
            </p>
          </div>

          <div className="stat-card space-y-3 bg-primary-50/40 border-primary-100">
            <div className="h-9 w-9 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Annual Screenings</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Regular health checkups catch potential metabolic conditions early before symptoms manifest.
            </p>
          </div>

          <div className="stat-card space-y-3 bg-amber-50/40 border-amber-100">
            <div className="h-9 w-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">Sleep Hygiene Essentials</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Maintaining 7 to 8 hours of consistent sleep improves immune response and mental clarity.
            </p>
          </div>
        </div>
      </div>

      {mpesaAppt && (
        <MpesaModal
          isOpen={!!mpesaAppt}
          onClose={() => setMpesaAppt(null)}
          appointmentId={mpesaAppt.id}
          amount={mpesaAppt.consultation_fee}
        />
      )}
    </div>
  );
}

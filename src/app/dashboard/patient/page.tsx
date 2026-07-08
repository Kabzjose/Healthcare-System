'use client';

import Link from 'next/link';
import { Calendar, CreditCard, Search, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useAuthStore } from '@/store/authStore';
import { usePatientAppointments } from '@/hooks/useAppointments';
import { useCancelAppointment } from '@/hooks/useAppointments';
import { useCreateCheckoutSession } from '@/hooks/usePayments';
import { useState } from 'react';
import { MpesaModal } from '@/components/payments/MpesaModal';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function PatientDashboardPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [mpesaAppt, setMpesaAppt] = useState<Appointment | null>(null);

  // Fetch upcoming appointments (pending + confirmed)
  const { data: upcomingData, isLoading } = usePatientAppointments({ status: 'confirmed' });
  const { data: pendingData } = usePatientAppointments({ status: 'pending' });

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
        onError: (err: any) =>
          toast({
            title: 'Could not cancel',
            description: err?.response?.data?.message,
            variant: 'destructive',
          }),
      }
    );
  };

  const handlePay = (appt: Appointment) => {
    // Show payment choice — for simplicity use Stripe by default
    // In a real app you'd show a modal asking Stripe vs M-Pesa
    stripeCheckout(appt.id);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Good morning, {user?.first_name} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s an overview of your health appointments
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {(upcomingData?.meta?.total ?? 0) + (pendingData?.meta?.total ?? 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending payment
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {pendingData?.data?.filter((a) => a.payment_status === 'pending').length ?? 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next appointment
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">
              {upcomingAppointments[0]
                ? upcomingAppointments[0].appointment_date
                : '—'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick action */}
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/doctors">
            <Search className="mr-2 h-4 w-4" />
            Find a Doctor
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/patient/appointments">View All Appointments</Link>
        </Button>
      </div>

      {/* Upcoming appointments */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Upcoming Appointments</h2>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming appointments"
            description="Book an appointment with one of our doctors to get started"
            action={
              <Button asChild>
                <Link href="/doctors">Browse Doctors</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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

      {/* M-Pesa modal */}
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
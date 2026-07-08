'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { MpesaModal } from '@/components/payments/MpesaModal';
import { usePatientAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { useCreateCheckoutSession } from '@/hooks/usePayments';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AxiosError } from 'axios';

const tabs = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export default function PatientAppointmentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [mpesaAppt, setMpesaAppt] = useState<Appointment | null>(null);

  const { data, isLoading } = usePatientAppointments({ status: activeTab });
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  const { mutate: stripeCheckout, isPending: isCheckingOut } = useCreateCheckoutSession();

  const appointments = data?.data ?? [];

  const handleCancel = (id: string) => {
    cancelAppointment(
      { appointmentId: id },
      {
        onSuccess: () => toast({ title: 'Appointment cancelled successfully' }),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all your appointments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title={`No ${tab.label.toLowerCase()} appointments`}
                description={
                  tab.value === 'pending'
                    ? 'Book an appointment to get started'
                    : undefined
                }
                action={
                  tab.value === 'pending' ? (
                    <Button asChild>
                      <Link href="/doctors">Find a Doctor</Link>
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {appointments.map((appt) => (
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
          </TabsContent>
        ))}
      </Tabs>

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

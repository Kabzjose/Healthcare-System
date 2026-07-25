'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useDoctorAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

import { useAuthStore } from '@/store/authStore';

const tabs = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
] as const;

export default function DoctorAppointmentsPage() {
  const { user } = useAuthStore();
  const isDoctor = user?.role === 'doctor';
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('pending');

  const { data, isLoading } = useDoctorAppointments({ status: activeTab }, { enabled: isDoctor });
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();

  const appointments = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleUpdateStatus = (
    id: string,
    status: 'confirmed' | 'completed' | 'no_show'
  ) => {
    updateStatus(
      { appointmentId: id, status },
      {
        onSuccess: () => toast({ title: `Appointment marked as ${status}` }),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Manage and update the status of your patient appointments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
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
                    ? 'New bookings from patients will appear here'
                    : tab.value === 'confirmed'
                    ? 'Confirmed appointments awaiting completion'
                    : undefined
                }
              />
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  {total} appointment{total !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {appointments.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appointment={appt}
                      role="doctor"
                      onUpdateStatus={handleUpdateStatus}
                      isUpdating={isUpdating}
                    />
                  ))}
                </div>
              </>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

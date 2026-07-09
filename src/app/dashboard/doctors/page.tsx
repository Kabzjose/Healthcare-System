'use client';

import Link from 'next/link';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const { data: pendingData, isLoading: loadingPending } = useDoctorAppointments({
    status: 'pending',
  });
  const { data: confirmedData } = useDoctorAppointments({ status: 'confirmed' });
  const { data: completedData } = useDoctorAppointments({ status: 'completed' });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAppointmentStatus();

  const pendingAppointments = (pendingData?.data ?? []).slice(0, 3);

  const handleUpdateStatus = (
    id: string,
    status: 'confirmed' | 'completed' | 'no_show'
  ) => {
    updateStatus(
      { appointmentId: id, status },
      {
        onSuccess: () =>
          toast({ title: `Appointment marked as ${status}` }),
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome, Dr. {user?.last_name} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your practice overview for today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{pendingData?.meta?.total ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{confirmedData?.meta?.total ?? 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{completedData?.meta?.total ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <Button asChild>
          <Link href="/dashboard/doctors">
            <Clock className="mr-2 h-4 w-4" />
            Manage Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/doctors">View All Appointments</Link>
        </Button>
      </div>

      {/* Pending appointments needing action */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Awaiting Your Confirmation</h2>
        {loadingPending ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : pendingAppointments.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No pending appointments"
            description="New bookings from patients will appear here"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
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
    </div>
  );
}

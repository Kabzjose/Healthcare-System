'use client';

import { Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentStatusBadge, PaymentStatusBadge } from './StatusBadge';
import { Appointment, UserRole } from '@/types';
import { formatDate, formatTime, formatCurrency } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  role: UserRole;
  onCancel?: (id: string) => void;
  onUpdateStatus?: (id: string, status: 'confirmed' | 'completed' | 'no_show') => void;
  onPay?: (id: string) => void;
  isUpdating?: boolean;
}

export const AppointmentCard = ({
  appointment,
  role,
  onCancel,
  onUpdateStatus,
  onPay,
  isUpdating,
}: AppointmentCardProps) => {
  const isPending = appointment.status === 'pending';
  const isConfirmed = appointment.status === 'confirmed';
  const isCancellable = isPending || isConfirmed;
  const needsPayment =
    appointment.payment_status === 'pending' && appointment.status !== 'cancelled';

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-foreground">
              {role === 'patient'
                ? `Dr. ${appointment.doctor_first_name} ${appointment.doctor_last_name}`
                : `${appointment.patient_first_name} ${appointment.patient_last_name}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {role === 'patient'
                ? appointment.specialization
                : appointment.patient_email}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <AppointmentStatusBadge status={appointment.status} />
            <PaymentStatusBadge status={appointment.payment_status ?? 'pending'} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pb-3">
        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(appointment.appointment_date)}</span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
          </span>
        </div>

        {/* Reason (patient view) or specialization (doctor view) */}
        {appointment.reason && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 shrink-0 mt-0.5" />
            <span className="line-clamp-2">{appointment.reason}</span>
          </div>
        )}

        {/* Fee */}
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Stethoscope className="h-4 w-4 shrink-0" />
          <span>{formatCurrency(appointment.consultation_fee)}</span>
        </div>

        {/* Doctor notes (shown after appointment) */}
        {appointment.notes && (
          <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
            <span className="font-medium">Notes: </span>
            {appointment.notes}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap pt-0">
        {/* Patient actions */}
        {role === 'patient' && (
          <>
            {needsPayment && onPay && (
              <Button
                size="sm"
                onClick={() => onPay(appointment.id)}
                disabled={isUpdating}
              >
                Pay Now
              </Button>
            )}
            {isCancellable && onCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCancel(appointment.id)}
                disabled={isUpdating}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Cancel
              </Button>
            )}
          </>
        )}

        {/* Doctor actions */}
        {role === 'doctor' && (
          <>
            {isPending && onUpdateStatus && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                disabled={isUpdating}
              >
                Confirm
              </Button>
            )}
            {isConfirmed && onUpdateStatus && (
              <>
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(appointment.id, 'completed')}
                  disabled={isUpdating}
                >
                  Mark Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, 'no_show')}
                  disabled={isUpdating}
                  className="text-gray-600"
                >
                  No Show
                </Button>
              </>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
};
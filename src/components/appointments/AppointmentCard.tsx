'use client';

import React from 'react';
import { Calendar, Clock, User, Stethoscope, Check, X, CreditCard, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AppointmentStatusBadge } from './StatusBadge';
import { Appointment, UserRole } from '@/types';
import { formatDate, formatTime, formatCurrency, cn } from '@/lib/utils';
import { useAuthStore, isDemoAccount } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useAuthStore();
  const { toast } = useToast();
  const isDemo = isDemoAccount(user?.email);

  const isPending = appointment.status === 'pending';
  const isConfirmed = appointment.status === 'confirmed';
  const isCompleted = appointment.status === 'completed';
  const isCancelled = appointment.status === 'cancelled';
  const isCancellable = isPending || isConfirmed;
  
  const isPaid =
    appointment.payment_status?.toLowerCase() === 'succeeded' ||
    appointment.payment_status?.toLowerCase() === 'paid' ||
    appointment.payment_status?.toLowerCase() === 'completed';

  // Pay button only shows for confirmed + not yet paid
  const needsPayment = appointment.status === 'confirmed' && !isPaid && appointment.payment_status !== 'refunded';

  const statusBorderColor = isConfirmed
    ? 'border-l-blue-500'
    : isPending
    ? 'border-l-yellow-500'
    : isCompleted
    ? 'border-l-green-500'
    : isCancelled
    ? 'border-l-red-400'
    : 'border-l-gray-300';

  const statusHoverBg = isConfirmed
    ? 'hover:bg-blue-50/40'
    : isPending
    ? 'hover:bg-yellow-50/40'
    : isCompleted
    ? 'hover:bg-green-50/40'
    : isCancelled
    ? 'hover:bg-red-50/30'
    : 'hover:bg-slate-50';

  const name =
    role === 'patient'
      ? `Dr. ${appointment.doctor_name} ${appointment.doctor_last_name ?? ''}`
      : `${appointment.patient_name ?? '—'} ${appointment.patient_last_name ?? ''}`;

  const initials = name
    .replace('Dr. ', '')
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className={cn('transition-all border-l-4 rounded-xl overflow-hidden', statusBorderColor, statusHoverBg, 'hover:shadow-card-hover')}>
      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary-50 text-primary-700 font-bold flex items-center justify-center text-sm shrink-0 border border-primary-100">
              {initials || 'MC'}
            </div>
            <div>
              <p className="font-bold text-foreground text-base leading-tight">
                {name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {role === 'patient'
                  ? appointment.specialization
                  : appointment.patient_email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
           <AppointmentStatusBadge status={appointment.status} />

          {/* Only show payment badge if payment needs attention */}
          {appointment.payment_status === 'pending' && appointment.status === 'confirmed' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-orange-100 text-orange-700">
              <CreditCard className="h-3 w-3" />
              Payment due
            </span>
          )}

          {appointment.payment_status === 'succeeded' && (
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
              <CheckCircle2 className="h-3 w-3" />
              Paid
            </span>
          )}

          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 text-sm pb-4 pt-1">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary-500 shrink-0" />
          <span className="font-medium text-foreground">{formatDate(appointment.appointment_date)}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 text-teal-600 shrink-0" />
          <span>
            {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
          </span>
        </div>

        {appointment.reason && (
          <div className="flex items-start gap-2 text-muted-foreground bg-muted/40 p-2 rounded-lg">
            <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-xs">{appointment.reason}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 border-t border-border/50">
          <span className="text-xs text-muted-foreground">Consultation Fee</span>
          <span className="font-bold text-foreground text-sm">{formatCurrency(appointment.consultation_fee)}</span>
        </div>

        {appointment.notes && (
          <div className="rounded-lg bg-primary-50/50 p-2.5 text-xs text-primary-900 border border-primary-100">
            <span className="font-semibold text-primary-700">Doctor Notes: </span>
            {appointment.notes}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 flex-wrap pt-0 pb-4">
        {role === 'patient' && (
          <>
            {needsPayment && onPay && (
              <Button
                size="sm"
                onClick={() => onPay(appointment.id)}
                disabled={isUpdating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium gap-1.5 shadow-sm"
              >
                <CreditCard className="h-3.5 w-3.5" />
                Pay {formatCurrency(appointment.consultation_fee)}
              </Button>
            )}
            {isCancellable && onCancel && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (isDemo) {
                    toast({
                      title: 'Demo account',
                      description: 'Cancelling is disabled in demo mode to keep sample data intact for other visitors.',
                    });
                    return;
                  }
                  onCancel(appointment.id);
                }}
                disabled={isUpdating}
                className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
              >
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
            )}
          </>
        )}

        {role === 'doctor' && (
          <>
            {isPending && onUpdateStatus && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(appointment.id, 'confirmed')}
                disabled={isUpdating}
                className="bg-primary-600 hover:bg-primary-700 gap-1"
              >
                <Check className="h-3.5 w-3.5" />
                Confirm
              </Button>
            )}
            {isConfirmed && onUpdateStatus && (
              <>
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(appointment.id, 'completed')}
                  disabled={isUpdating}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  Mark Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateStatus(appointment.id, 'no_show')}
                  disabled={isUpdating}
                  className="text-gray-600 hover:bg-gray-100"
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
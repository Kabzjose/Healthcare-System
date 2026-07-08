'use client';

import { cn, capitalize, appointmentStatusColor, paymentStatusColor } from '@/lib/utils';
import { AppointmentStatus, PaymentStatus } from '@/types';

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export const AppointmentStatusBadge = ({ status }: AppointmentStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        appointmentStatusColor[status]
      )}
    >
      {capitalize(status)}
    </span>
  );
};

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        paymentStatusColor[status]
      )}
    >
      {capitalize(status)}
    </span>
  );
};
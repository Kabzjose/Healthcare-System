'use client';

import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message?: string;
  className?: string;
}

export const ErrorMessage = ({
  message = 'Something went wrong. Please try again.',
  className,
}: ErrorMessageProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700',
        className
      )}
    >
      <AlertCircle className="h-5 w-5 shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};
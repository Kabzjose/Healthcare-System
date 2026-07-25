'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export default function PaymentSuccessPage() {
  const queryClient = useQueryClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Wait 3 seconds for the webhook to fire and update the DB
    // then invalidate all cached queries so fresh data loads
    const timer = setTimeout(async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await queryClient.invalidateQueries({ queryKey: ['payments'] });
      setChecking(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-md">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground mt-2 mb-6">
          Your payment has been received. You will receive an SMS confirmation shortly.
        </p>

        {checking ? (
          <div className="flex flex-col items-center gap-3 mb-6">
            <LoadingSpinner size="sm" />
            <p className="text-sm text-muted-foreground">
              Confirming your payment...
            </p>
          </div>
        ) : (
          <p className="text-sm text-green-600 font-medium mb-6">
            ✓ Payment confirmed
          </p>
        )}

        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/patient">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/patient/appointments">View Appointments</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-md">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment Successful</h1>
        <p className="text-muted-foreground mt-2 mb-8">
          Your payment has been received. You will receive an SMS confirmation shortly.
        </p>
        <Button asChild>
          <Link href="/dashboard/patient/appointments">View Appointments</Link>
        </Button>
      </div>
    </div>
  );
}
'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
      <div className="text-center max-w-md">
        <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Payment Cancelled</h1>
        <p className="text-muted-foreground mt-2 mb-8">
          Your payment was cancelled. Your appointment is still booked — you can pay later
          from your appointments page.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link href="/dashboard/patient">Dashboard</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/patient/appointments">My Appointments</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
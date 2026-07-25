'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  // If user is not an admin, show Access Restricted screen
  if (user && user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground">Access Restricted</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          You do not have administrative privileges to view this portal.
        </p>
        <Button asChild className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold">
          <Link href={user.role === 'doctor' ? '/dashboard/doctors' : '/dashboard/patient'}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Return to My Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return <div className="space-y-6">{children}</div>;
}

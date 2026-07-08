'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return <LoadingSpinner fullPage />;
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Navbar />
      <div className="flex">
        <Sidebar role={user.role} />
        <main className="flex-1 p-6 lg:p-8 max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}
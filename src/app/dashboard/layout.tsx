'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  // Wait until Zustand rehydrates before making any auth decision
  if (!hasHydrated) {
    return <LoadingSpinner fullPage />;
  }

  // After hydration, if not authenticated, keep showing loading while redirect happens
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

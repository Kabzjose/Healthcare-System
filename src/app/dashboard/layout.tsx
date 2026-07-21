'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  // Track whether Zustand has finished hydrating from localStorage
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // This runs after first render 
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Only redirect after hydration — never on the first render
    if (hydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  // Still waiting for Zustand to load from localStorage
  if (!hydrated) {
    return <LoadingSpinner fullPage />;
  }

  // Hydrated but not authenticated — redirect is in progress
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
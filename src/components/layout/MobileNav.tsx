'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, CreditCard, Stethoscope, Clock, User, Users, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  if (!user) return null;

  const role = user.role;

  let links = [
    { href: '/dashboard/patient', label: 'Home', icon: LayoutDashboard },
    { href: '/dashboard/patient/appointments', label: 'Appointments', icon: Calendar },
    { href: '/dashboard/patient/payments', label: 'Payments', icon: CreditCard },
    { href: '/doctors', label: 'Doctors', icon: Stethoscope },
  ];

  if (role === 'doctor') {
    links = [
      { href: '/dashboard/doctors', label: 'Home', icon: LayoutDashboard },
      { href: '/dashboard/doctors/appointments', label: 'Appointments', icon: Calendar },
      { href: '/dashboard/doctors/availability', label: 'Schedule', icon: Clock },
      { href: '/dashboard/doctors/me', label: 'Profile', icon: User },
    ];
  } else if (role === 'admin') {
    links = [
      { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
      { href: '/dashboard/admin/users', label: 'Users', icon: Users },
      { href: '/dashboard/admin/doctors', label: 'Doctors', icon: Stethoscope },
      { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
    ];
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-border shadow-card-strong px-2 py-2">
      <div className="flex items-center justify-around">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all',
                isActive
                  ? 'text-primary-600 bg-primary-50 font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CreditCard,
  Home,
  Stethoscope,
  Clock,
  User,
  LogOut,
  Plus,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials, cn } from '@/lib/utils';
import { UserRole } from '@/types';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ElementType;
}

const patientLinks: SidebarLink[] = [
  { href: '/dashboard/patient', label: 'Overview', icon: Home },
  { href: '/dashboard/patient/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/patient/payments', label: 'Payments', icon: CreditCard },
];

const doctorLinks: SidebarLink[] = [
  { href: '/dashboard/doctors', label: 'Overview', icon: Home },
  { href: '/dashboard/doctors/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/doctors/availability', label: 'Schedule', icon: Clock },
  { href: '/dashboard/doctors/me', label: 'Profile', icon: User },
];

const adminLinks: SidebarLink[] = [
  { href: '/dashboard/admin', label: 'Overview', icon: Home },
  { href: '/dashboard/admin/users', label: 'Users', icon: Users },
  { href: '/dashboard/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/dashboard/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard },
];

interface SidebarProps {
  role: UserRole;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { logout } = useAuth();

  let links = patientLinks;
  if (role === 'doctor') links = doctorLinks;
  if (role === 'admin') links = adminLinks;

  const initials = user ? getInitials(user.first_name, user.last_name) : 'MC';

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-border/80 bg-white min-h-[calc(100vh-4rem)] shadow-card">
      {/* Brand Header */}
      <div className="px-6 py-5 border-b border-border/60">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
            <Plus className="h-5 w-5 stroke-[3]" />
          </div>
          <span className="font-extrabold text-lg text-primary-900 tracking-tight">
            MediCare<span className="text-primary-600">+</span>
          </span>
        </Link>
      </div>

      {/* User Info Box */}
      {user && (
        <div className="p-4 mx-3 my-3 rounded-2xl bg-primary-50/60 border border-primary-100 flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-primary-200 shadow-xs">
            <AvatarFallback className="bg-primary-600 text-white font-bold text-xs">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground truncate">
              {user.first_name} {user.last_name}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[11px] font-semibold text-primary-700 capitalize">
                {user.role}
              </span>
              <CheckCircle2 className="h-3 w-3 text-primary-600 fill-primary-100" />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href ||
            (link.href !== `/dashboard/${role === 'doctor' ? 'doctors' : role === 'admin' ? 'admin' : 'patient'}` &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold transition-all rounded-xl relative',
                isActive
                  ? 'bg-primary-50 text-primary-700 font-bold border-l-4 border-l-primary-600 shadow-xs'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-600' : 'text-muted-foreground')} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-border/60 space-y-1">
        {role === 'patient' && (
          <Link
            href="/doctors"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-primary-50/50 hover:text-primary-600 rounded-xl transition-colors"
          >
            <Stethoscope className="h-4 w-4 text-primary-500 shrink-0" />
            <span>Find Doctors</span>
          </Link>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

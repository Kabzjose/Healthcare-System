'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calendar,
  CreditCard,
  Home,
  Stethoscope,
  Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
];

interface SidebarProps {
  role: UserRole;
}

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const links = role === 'doctor' ? doctorLinks : patientLinks;

  return (
    <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r bg-background min-h-[calc(100vh-4rem)]">
      {/* Brand */}
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <Activity className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">
          {role === 'doctor' ? 'Doctor Portal' : 'Patient Portal'}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          // Mark as active if exact match OR if it starts with the path (for sub-routes)
          const isActive =
            pathname === link.href ||
            (link.href !== `/dashboard/${role === 'doctor' ? 'doctors' : 'patient'}` &&
              pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom — find doctors link for patients */}
      {role === 'patient' && (
        <div className="px-3 pb-4">
          <Link
            href="/doctors"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Stethoscope className="h-4 w-4 shrink-0" />
            Find Doctors
          </Link>
        </div>
      )}
    </aside>
  );
};

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationBell } from './NotificationBell';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { getInitials, cn } from '@/lib/utils';

export const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/doctors', label: 'Doctors' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300 w-full',
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-card border-b border-border/80 py-2.5'
          : 'bg-transparent py-4'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-card group-hover:scale-105 transition-transform">
              <Plus className="h-6 w-6 stroke-[3]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-primary-900">
              MediCare<span className="text-primary-600">+</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-semibold transition-colors relative py-1',
                    isActive
                      ? 'text-primary-600 font-bold'
                      : 'text-muted-foreground hover:text-primary-600'
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full animate-in fade-in zoom-in-95 duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border border-primary-100 shadow-xs">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-50 text-primary-700 text-sm font-bold">
                          {getInitials(user.first_name, user.last_name)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-card-strong">
                    <div className="px-3 py-2 bg-primary-50/50 rounded-xl mb-1">
                      <p className="text-sm font-bold text-foreground">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize font-medium">{user.role}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                      <Link
                        href={
                          user.role === 'admin'
                            ? '/dashboard/admin'
                            : user.role === 'doctor'
                            ? '/dashboard/doctors'
                            : '/dashboard/patient'
                        }
                      >
                        Dashboard Overview
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="rounded-lg text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" asChild size="sm" className="font-semibold text-primary-700 hover:text-primary-800">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="rounded-full px-5 bg-primary-600 hover:bg-primary-700 shadow-card font-semibold">
                  <Link href="/doctors">
                    <Calendar className="mr-1.5 h-4 w-4" />
                    Book Appointment
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile drawer toggle */}
            <button
              className="md:hidden p-2.5 rounded-xl bg-muted/60 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileOpen && (
          <div className="md:hidden mt-3 p-4 rounded-2xl bg-white shadow-card-strong border border-border/60 space-y-3 animate-in slide-in-from-top-3 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-muted-foreground hover:bg-muted/50'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!isAuthenticated && (
              <div className="pt-2 border-t flex flex-col gap-2">
                <Button variant="outline" asChild size="sm" className="w-full rounded-xl font-semibold">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild size="sm" className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 font-semibold">
                  <Link href="/doctors" onClick={() => setMobileOpen(false)}>Book Appointment</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

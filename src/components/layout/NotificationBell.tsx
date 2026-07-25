'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Calendar, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  read: boolean;
  type: 'appointment' | 'payment' | 'system';
}

const initialNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'Appointment Status',
    message: 'Your appointment details are updated in your dashboard.',
    read: false,
    type: 'appointment',
  },
  {
    id: '2',
    title: 'Payment Receipt',
    message: 'Digital receipts for consultations are available in billing.',
    read: false,
    type: 'payment',
  },
  {
    id: '3',
    title: 'System Notice',
    message: 'Welcome to MediCare+ online appointment system.',
    read: true,
    type: 'system',
  },
];

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: NotificationItem['type']) => {
    if (type === 'payment') return <CreditCard className="h-4 w-4 text-emerald-600" />;
    if (type === 'appointment') return <Calendar className="h-4 w-4 text-primary-600" />;
    return <Info className="h-4 w-4 text-blue-600" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 rounded-2xl shadow-card-strong bg-white dark:bg-slate-900 border border-border/80 opacity-100 z-50">
        <div className="flex items-center justify-between border-b px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-auto p-0 text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={`flex items-start gap-3 p-3 text-xs focus:bg-muted/50 cursor-pointer ${
                  !n.read ? 'bg-primary-50/40' : ''
                }`}
              >
                <div className="rounded-full bg-white p-2 shadow-xs border shrink-0">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-foreground">{n.title}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">{n.message}</p>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </div>

        <div className="border-t p-2 text-center bg-muted/20">
          <Button variant="ghost" size="sm" asChild className="w-full text-xs text-primary-600 font-medium">
            <Link href="/dashboard/patient/appointments">View All Activity</Link>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

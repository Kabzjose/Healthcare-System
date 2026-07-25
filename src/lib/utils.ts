import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO } from 'date-fns';

// ── shadcn className helper ───────────────────────────────────────────────────
// Merges Tailwind classes safely — handles conflicts like "p-2 p-4" → "p-4"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Date formatters ───────────────────────────────────────────────────────────
export const formatDate = (date: string): string => {
  return format(parseISO(date), 'EEE, MMM d yyyy');
  // e.g. "Mon, Jul 7 2026"
};

export const formatTime = (time: string): string => {
  // time comes as "09:00:00" from postgres — parse just HH:MM
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return format(date, 'h:mm a'); // e.g. "9:00 AM"
};

export const formatCurrency = (amount: number, currency = 'KES'): string => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
  // e.g. "KES 3,500"
};

export const formatDateTime = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy h:mm a');
};

// ── String helpers ────────────────────────────────────────────────────────────
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getMinBookingDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 3); // minimum 3 days from today
  return date.toISOString().split('T')[0]; // returns YYYY-MM-DD
};

// ── Day of week helpers ───────────────────────────────────────────────────────
// Given a day name like "monday", return the next date that falls on that day (at least 3 days away)
export const getNextDateForDay = (dayName: string): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const targetDay = days.indexOf(dayName.toLowerCase());
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 3); // start searching from 3 days ahead
  
  // Find the next occurrence of targetDay that is at least 3 days away
  const current = new Date(minDate);
  while (current.getDay() !== targetDay) {
    current.setDate(current.getDate() + 1);
  }
  return current.toISOString().split('T')[0];
};

// ── Status colour maps — used in StatusBadge ─────────────────────────────────
export const appointmentStatusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  no_show: 'bg-gray-100 text-gray-800',
};

export const paymentStatusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  succeeded: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-purple-100 text-purple-800',
};
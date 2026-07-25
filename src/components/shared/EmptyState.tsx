'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EmptyStateType = 'appointments' | 'payments' | 'doctors' | 'generic';

interface EmptyStateProps {
  type?: EmptyStateType;
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const CalendarIllustration = () => (
  <svg className="w-24 h-24 text-primary-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="25" width="60" height="55" rx="8" fill="#EBF4FB" stroke="#2385D4" strokeWidth="3" />
    <path d="M20 40H80" stroke="#2385D4" strokeWidth="3" />
    <rect x="32" y="15" width="6" height="15" rx="3" fill="#1A6EBD" />
    <rect x="62" y="15" width="6" height="15" rx="3" fill="#1A6EBD" />
    <circle cx="38" cy="52" r="3" fill="#91C3EA" />
    <circle cx="50" cy="52" r="3" fill="#91C3EA" />
    <circle cx="62" cy="52" r="3" fill="#91C3EA" />
    <path d="M40 64L60 76" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
    <path d="M60 64L40 76" stroke="#EF4444" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

const WalletIllustration = () => (
  <svg className="w-24 h-24 text-teal-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="15" y="30" width="70" height="50" rx="10" fill="#CCFBF1" stroke="#0D9488" strokeWidth="3" />
    <path d="M15 45H85" stroke="#0D9488" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M65 52C65 48.6863 67.6863 46 71 46H85V64H71C67.6863 64 65 61.3137 65 58V52Z" fill="#0D9488" />
    <circle cx="73" cy="55" r="3" fill="#FFFFFF" />
  </svg>
);

const SearchIllustration = () => (
  <svg className="w-24 h-24 text-primary-400" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="45" cy="45" r="25" fill="#EBF4FB" stroke="#2385D4" strokeWidth="4" />
    <path d="M63 63L82 82" stroke="#1A6EBD" strokeWidth="6" strokeLinecap="round" />
    <path d="M37 45H53" stroke="#91C3EA" strokeWidth="3" strokeLinecap="round" />
    <circle cx="45" cy="37" r="2" fill="#2385D4" />
  </svg>
);

export const EmptyState = ({
  type = 'generic',
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => {
  const renderIllustration = () => {
    if (type === 'appointments') return <CalendarIllustration />;
    if (type === 'payments') return <WalletIllustration />;
    if (type === 'doctors') return <SearchIllustration />;
    
    if (Icon) {
      return (
        <div className="mb-4 rounded-full bg-primary-50 p-4">
          <Icon className="h-10 w-10 text-primary-600" />
        </div>
      );
    }
    return <CalendarIllustration />;
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted p-12 text-center bg-white/50 backdrop-blur-xs',
        className
      )}
    >
      <div className="mb-4 flex items-center justify-center">
        {renderIllustration()}
      </div>
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
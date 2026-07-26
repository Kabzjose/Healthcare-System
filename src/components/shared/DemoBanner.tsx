'use client';

import { useState } from 'react';
import { Info, X } from 'lucide-react';
import { useAuthStore, isDemoAccount } from '@/store/authStore';

export const DemoBanner = () => {
  const { user } = useAuthStore();
  const [dismissed, setDismissed] = useState(false);

  if (!user || !isDemoAccount(user.email) || dismissed) return null;

  return (
    <div className="bg-primary/10 border-b border-primary/20 px-4 py-2">
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-primary">
          <Info className="h-4 w-4 shrink-0" />
          <span>
            You&apos;re viewing a <strong>demo account</strong> with sample data.
            Feel free to explore — changes won&apos;t affect real users.
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss demo banner"
          className="text-primary/60 hover:text-primary shrink-0 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

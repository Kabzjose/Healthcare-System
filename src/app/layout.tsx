import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'MediCare+ — Quality Healthcare You Can Trust',
    template: '%s | MediCare+',
  },
  description: 'Book appointments with top doctors, manage payments, and access healthcare easily.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground">
        <Providers>
          <div className="animate-in fade-in duration-300">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
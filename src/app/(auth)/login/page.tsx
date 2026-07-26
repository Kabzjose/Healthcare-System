'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, CheckCircle2, ShieldCheck, ArrowRight, Stethoscope, UserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Inner component that uses useSearchParams (must be wrapped in Suspense)
function LoginForm() {
  const { loginAsync, isLoggingIn, loginError } = useAuth();
  const searchParams = useSearchParams();
  const isDemoIntent = searchParams.get('demo') === 'true';

  const [demoLoading, setDemoLoading] = useState<'patient' | 'doctor' | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    await loginAsync(values).catch(() => {});
  };

  const handleDemoLogin = async (role: 'patient' | 'doctor') => {
    setDemoLoading(role);
    const credentials =
      role === 'patient'
        ? { email: 'demo.patient@medicare.com', password: 'Demo1234' }
        : { email: 'jane.wangui@medicare.com', password: 'Demo1234' };

    try {
      await loginAsync(credentials);
    } catch {
      // Error display handled by loginError state below
    } finally {
      setDemoLoading(null);
    }
  };

  const apiError = loginError as AxiosError<{ message: string }> | null;
  const errorMessage = apiError?.response?.data?.message ?? apiError?.message;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-background">
      {/* Left Column Brand Overlay */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-primary-900 text-white flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <OptimizedImage
            src="/images/auth-bg.jpg"
            alt="Healthcare Background"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="relative z-10 space-y-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white text-primary-600 flex items-center justify-center font-bold">
              <Plus className="h-6 w-6 stroke-[3]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              MediCare<span className="text-primary-300">+</span>
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <blockquote className="text-2xl font-bold leading-relaxed text-white">
            &ldquo;Managing doctor appointments and patient health records has never been this seamless and reliable.&rdquo;
          </blockquote>

          <div className="space-y-3">
            {[
              'Real-time doctor appointment booking',
              'Instant M-Pesa digital payments',
              'Verified board-certified specialists',
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-sm font-medium text-primary-100">
                <div className="h-6 w-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-primary-300 border-t border-primary-800 pt-6">
          <p>© {new Date().getFullYear()} MediCare+. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-teal-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Right Column Form Card */}
      <div className="lg:col-span-6 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-50/50">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-card border border-border/60">
          <div className="text-center space-y-2">
            <div className="flex lg:hidden justify-center items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
                <Plus className="h-6 w-6 stroke-[3]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-primary-900">
                MediCare<span className="text-primary-600">+</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Welcome Back</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Sign in to access your healthcare portal</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                className="rounded-xl"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="rounded-xl"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <Button type="submit" size="lg" className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 font-bold gap-2" disabled={isLoggingIn || demoLoading !== null}>
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or explore with a demo account
              </span>
            </div>
          </div>

          {/* Demo login buttons */}
          <div
            id="demo-buttons"
            className={cn(
              'grid grid-cols-2 gap-3 rounded-lg transition-all',
              isDemoIntent && 'ring-2 ring-primary ring-offset-2 animate-pulse'
            )}
          >
            <Button
              type="button"
              variant="outline"
              id="demo-patient-btn"
              className="flex-col h-auto py-3 gap-1.5 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => handleDemoLogin('patient')}
              disabled={isLoggingIn || demoLoading !== null}
            >
              {demoLoading === 'patient' ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <UserRound className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">View as Patient</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              id="demo-doctor-btn"
              className="flex-col h-auto py-3 gap-1.5 hover:border-primary/50 hover:bg-primary/5 transition-colors"
              onClick={() => handleDemoLogin('doctor')}
              disabled={isLoggingIn || demoLoading !== null}
            >
              {demoLoading === 'doctor' ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Stethoscope className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium">View as Doctor</span>
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground -mt-4">
            No signup needed — instantly explore the platform with pre-loaded sample data
          </p>

          <div className="pt-4 text-center border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary-600 font-bold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <LoginForm />
    </Suspense>
  );
}
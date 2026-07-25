'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, CheckCircle2, ShieldCheck, Eye, EyeOff, User, Stethoscope, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useAuth } from '@/hooks/useAuth';
import { AxiosError } from 'axios';
import { cn } from '@/lib/utils';

const registerSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^(254|0)[17]\d{8}$/,
        'Enter a valid Kenyan number e.g. 0712345678 or 254712345678'
      ),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[0-9]/, 'Must contain a number'),
    confirm_password: z.string().min(1, 'Please confirm your password'),
    role: z.enum(['patient', 'doctor']),
  })
  .refine((values) => values.password === values.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { registerAsync, isRegistering, registerError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'patient' },
  });

  const selectedRole = watch('role');

  const onSubmit = async ({ confirm_password, ...values }: RegisterFormValues) => {
    void confirm_password;
    await registerAsync(values).catch(() => {});
  };

  const apiError = registerError as AxiosError<{ message: string }> | null;
  const errorMessage = apiError?.response?.data?.message ?? apiError?.message;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 font-sans bg-background">
      {/* Left Column Brand Overlay */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-primary-900 text-white flex-col justify-between p-12 overflow-hidden">
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
          <h2 className="text-3xl font-extrabold leading-tight text-white">
            Join Thousands of Patients and Board-Certified Doctors Today
          </h2>

          <div className="space-y-4">
            {[
              'Direct access to top medical specialists',
              'Automated appointment status updates & SMS reminders',
              'Secure digital payment via M-Pesa & cards',
              'Centralized health record history',
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
            <span>HIPAA Compliant Security</span>
          </div>
        </div>
      </div>

      {/* Right Column Form Card */}
      <div className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-50/50">
        <div className="w-full max-w-lg space-y-6 bg-white p-8 rounded-3xl shadow-card border border-border/60">
          <div className="text-center space-y-2">
            <div className="flex lg:hidden justify-center items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-bold">
                <Plus className="h-6 w-6 stroke-[3]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-primary-900">
                MediCare<span className="text-primary-600">+</span>
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">Create Your Account</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Select your account type to get started</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Role Selector Toggle Buttons */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">Account Type</Label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-muted/40 rounded-2xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setValue('role', 'patient')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all',
                    selectedRole === 'patient'
                      ? 'bg-white text-primary-700 shadow-xs border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <User className="h-4 w-4 text-primary-600" />
                  <span>Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setValue('role', 'doctor')}
                  className={cn(
                    'flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all',
                    selectedRole === 'doctor'
                      ? 'bg-white text-teal-700 shadow-xs border border-border/50'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Stethoscope className="h-4 w-4 text-teal-600" />
                  <span>Doctor / Practitioner</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-xs font-bold text-foreground">First Name</Label>
                <Input
                  id="first_name"
                  placeholder="John"
                  className="rounded-xl"
                  {...register('first_name')}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-600 mt-1">{errors.first_name.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-xs font-bold text-foreground">Last Name</Label>
                <Input
                  id="last_name"
                  placeholder="Kamau"
                  className="rounded-xl"
                  {...register('last_name')}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-600 mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="rounded-xl"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-foreground">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  autoComplete="tel"
                  className="rounded-xl"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold text-foreground">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10 rounded-xl"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password" className="text-xs font-bold text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="pr-10 rounded-xl"
                    {...register('confirm_password')}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirm_password && (
                  <p className="text-xs text-red-600 mt-1">{errors.confirm_password.message}</p>
                )}
              </div>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <Button type="submit" size="lg" className="w-full rounded-xl bg-primary-600 hover:bg-primary-700 font-bold gap-2" disabled={isRegistering}>
              {isRegistering ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Creating account...
                </span>
              ) : (
                <>
                  Complete Registration <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="pt-4 text-center border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 font-bold hover:underline">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

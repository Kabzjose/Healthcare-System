import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowRight,
  CalendarCheck,
  HeartPulse,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn how HealthCare helps patients and doctors manage appointments in Kenya.',
};

const values = [
  {
    icon: ShieldCheck,
    title: 'Reliable access',
    description: 'Patients can find care options and request appointments without waiting on calls or office hours.',
  },
  {
    icon: Stethoscope,
    title: 'Doctor-focused tools',
    description: 'Doctors get a focused dashboard for managing profiles, availability, and incoming bookings.',
  },
  {
    icon: CalendarCheck,
    title: 'Clear next steps',
    description: 'Appointments, payments, and visit details stay organized from booking through confirmation.',
  },
];

const stats = [
  { label: 'Booking access', value: '24/7' },
  { label: 'Core user paths', value: '2' },
  { label: 'Local payment support', value: 'KES' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950">
      <Navbar />

      <main>
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800">
                <HeartPulse className="h-4 w-4" />
                About HealthCare
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Making doctor appointments simpler for patients and providers.
              </h1>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                HealthCare connects patients with qualified doctors through a clean
                booking experience built around availability, appointment tracking,
                and local payment workflows.
              </p>

              <p className="mt-4 text-base leading-7 text-slate-600">
                The platform keeps the care journey practical: patients can browse
                specialists and reserve open slots, while doctors manage their
                profiles and appointment requests from one dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/doctors">
                    Find a Doctor
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-11 border-slate-300 bg-white">
                  <Link href="/register">Join HealthCare</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 shadow-sm">
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Built for both sides of care</p>
                    <h2 className="text-xl font-semibold text-slate-950">Patient and doctor workflows</h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  <div className="rounded-lg border border-slate-200 bg-[#f7faf9] p-4">
                    <p className="text-sm font-semibold text-slate-950">For patients</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Search by specialization, review doctor details, book appointments,
                      and follow payment status from a personal dashboard.
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#f7faf9] p-4">
                    <p className="text-sm font-semibold text-slate-950">For doctors</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Maintain a professional profile, manage availability, and keep
                      appointment requests organized in one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-white p-4 text-center shadow-sm">
                    <p className="text-xl font-bold text-slate-950">{stat.value}</p>
                    <p className="mt-1 text-xs font-medium leading-5 text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950">What guides the platform</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              HealthCare is designed around the everyday details that make appointment
              booking smoother, clearer, and easier to manage.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

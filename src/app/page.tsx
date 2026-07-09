import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CalendarCheck,
  CreditCard,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Search,
    title: 'Find specialists fast',
    description: 'Search available doctors by specialization and compare their consultation details.',
  },
  {
    icon: CalendarCheck,
    title: 'Book open slots',
    description: 'Pick a doctor, choose an available time, and keep every visit organized.',
  },
  {
    icon: CreditCard,
    title: 'Handle payments',
    description: 'Track payment status from the same dashboard as your appointments.',
  },
];

const appointmentSteps = [
  { label: 'Search doctor', status: 'Ready' },
  { label: 'Select slot', status: 'Next' },
  { label: 'Confirm visit', status: 'Secure' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f7faf9] text-slate-950">
      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_left,#d9fbef_0,#f7faf9_36%,#ffffff_78%)]">
          <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-sm font-medium text-emerald-800 shadow-sm">
                <ShieldCheck className="h-4 w-4" />
                Trusted healthcare scheduling
              </div>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Book doctors, manage visits, and stay ahead of care.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                HealthCare gives patients a simple way to find qualified doctors and
                reserve appointments, while doctors manage incoming bookings from a
                focused dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 bg-emerald-700 hover:bg-emerald-800">
                  <Link href="/doctors">
                    Find a Doctor
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-11 border-slate-300 bg-white">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-950">24/7</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Booking access</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-950">3</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Simple steps</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-2xl font-bold text-slate-950">KES</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">Local payments</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Today&apos;s care</p>
                    <h2 className="mt-1 text-xl font-semibold text-slate-950">Appointment Flow</h2>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-3 text-emerald-700">
                    <Activity className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {appointmentSteps.map((step, index) => (
                    <div
                      key={step.label}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-800">{step.label}</span>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-cyan-50 p-4">
                    <Users className="h-5 w-5 text-cyan-700" />
                    <p className="mt-3 text-sm font-semibold text-slate-950">Patient dashboard</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      View appointments and payments at a glance.
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-50 p-4">
                    <Stethoscope className="h-5 w-5 text-amber-700" />
                    <p className="mt-3 text-sm font-semibold text-slate-950">Doctor dashboard</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Review new booking requests quickly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
          {features.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-base font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}

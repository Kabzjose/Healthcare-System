'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Stethoscope, Calendar, DollarSign, TrendingUp, ArrowUpRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export default function AdminOverviewPage() {
  const stats = [
    { title: 'Total Registered Users', value: '1,248', growth: '+12%', icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
    { title: 'Active Doctors', value: '28', growth: '+4', icon: Stethoscope, color: 'text-teal-600', bg: 'bg-teal-50' },
    { title: 'Total Appointments', value: '3,890', growth: '+18%', icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total System Revenue', value: formatCurrency(1450000), growth: '+24%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentActivity = [
    { id: '1', type: 'appointment', text: 'Patient Amina M. booked Dr. Jane Kamau', time: '5m ago', status: 'confirmed' },
    { id: '2', type: 'payment', text: 'M-Pesa payment KES 3,000 received for Appt #942', time: '18m ago', status: 'paid' },
    { id: '3', type: 'doctor', text: 'Dr. David Ochieng updated consultation fees', time: '1h ago', status: 'updated' },
    { id: '4', type: 'appointment', text: 'Patient Grace W. cancelled Appt #939', time: '2h ago', status: 'cancelled' },
  ];

  const topDoctors = [
    { name: 'Dr. Jane Kamau', spec: 'Cardiology', appts: 142, revenue: 426000, rating: '4.9★' },
    { name: 'Dr. David Ochieng', spec: 'General Medicine', appts: 118, revenue: 295000, rating: '4.8★' },
    { name: 'Dr. Sarah Wambui', spec: 'Dermatology', appts: 96, revenue: 336000, rating: '4.9★' },
    { name: 'Dr. Peter Njuguna', spec: 'Paediatrics', appts: 88, revenue: 220000, rating: '4.7★' },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Admin Overview</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            System performance metrics, revenue analytics, and activity log.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold text-xs">
            <Link href="/dashboard/admin/users">Manage Users</Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
            <Link href="/dashboard/admin/payments">View Financials</Link>
          </Button>
        </div>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="stat-card">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{s.title}</span>
                <div className={`h-9 w-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline justify-between mt-3">
                <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="h-3.5 w-3.5" /> {s.growth}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual SVG Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Trend Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl shadow-card border border-border/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h3 className="font-bold text-base text-foreground">Appointment Booking Trends</h3>
              <p className="text-xs text-muted-foreground">Monthly volume over the past 6 months</p>
            </div>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
              +18% growth
            </span>
          </div>

          <div className="h-52 w-full pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A6EBD" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#1A6EBD" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#E2E8F0" strokeDasharray="4 4" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#E2E8F0" strokeDasharray="4 4" />

              {/* Area Under Line */}
              <polygon points="0,120 80,95 160,105 240,65 320,50 400,35 480,20 480,140 0,140" fill="url(#chartGradient)" />

              {/* Trend Line */}
              <polyline
                points="0,120 80,95 160,105 240,65 320,50 400,35 480,20"
                fill="none"
                stroke="#1A6EBD"
                strokeWidth="4"
                strokeLinecap="round"
              />

              {/* Data Points */}
              <circle cx="80" cy="95" r="4" fill="#1A6EBD" />
              <circle cx="160" cy="105" r="4" fill="#1A6EBD" />
              <circle cx="240" cy="65" r="4" fill="#1A6EBD" />
              <circle cx="320" cy="50" r="4" fill="#1A6EBD" />
              <circle cx="400" cy="35" r="4" fill="#1A6EBD" />
              <circle cx="480" cy="20" r="5" fill="#0D9488" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
            <div className="flex justify-between text-[11px] text-muted-foreground font-semibold px-2">
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
            </div>
          </div>
        </div>

        {/* Appointment Status Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-card border border-border/60 space-y-4 flex flex-col justify-between">
          <div className="border-b border-border/40 pb-3">
            <h3 className="font-bold text-base text-foreground">Status Distribution</h3>
            <p className="text-xs text-muted-foreground">Current system breakdown</p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-700 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Completed (62%)</span>
                <span>2,411</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[62%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-primary-700 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Confirmed (24%)</span>
                <span>933</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-primary-600 h-full rounded-full w-[24%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-700 flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> Pending (9%)</span>
                <span>350</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full w-[9%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-red-700 flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> Cancelled (5%)</span>
                <span>196</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-[5%]" />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border/40 text-center">
            <Link href="/dashboard/admin/appointments" className="text-xs font-bold text-primary-600 hover:underline">
              View All Appointments →
            </Link>
          </div>
        </div>
      </div>

      {/* Activity Feed & Top Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity Log */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl shadow-card border border-border/60 space-y-4">
          <h3 className="font-bold text-base text-foreground border-b border-border/40 pb-3">Recent Activity Feed</h3>
          <div className="divide-y divide-border/40">
            {recentActivity.map((act) => (
              <div key={act.id} className="py-3 flex items-start justify-between text-xs gap-3">
                <div className="space-y-0.5">
                  <p className="font-semibold text-foreground">{act.text}</p>
                  <span className="text-[10px] text-muted-foreground">{act.time}</span>
                </div>
                <span className="capitalize px-2 py-0.5 rounded-full bg-slate-100 font-bold text-[10px] text-slate-700 shrink-0">
                  {act.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Doctors Table */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl shadow-card border border-border/60 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h3 className="font-bold text-base text-foreground">Top Performing Doctors</h3>
            <Link href="/dashboard/admin/doctors" className="text-xs font-bold text-primary-600 hover:underline">
              Manage All
            </Link>
          </div>

          <div className="divide-y divide-border/40">
            {topDoctors.map((doc) => (
              <div key={doc.name} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-foreground">{doc.name}</p>
                  <span className="text-[11px] text-teal-600 font-medium">{doc.spec} • {doc.rating}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{formatCurrency(doc.revenue)}</p>
                  <span className="text-[10px] text-muted-foreground">{doc.appts} visits</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

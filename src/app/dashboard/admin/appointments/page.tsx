'use client';

import React, { useState } from 'react';
import { Search, Download, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, formatTime } from '@/lib/utils';
import { toast } from 'sonner';

interface MasterAppointment {
  id: string;
  patient_name: string;
  doctor_name: string;
  specialization: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  fee: number;
}

const mockAppointments: MasterAppointment[] = [
  { id: 'apt-501', patient_name: 'Amina Mohamed', doctor_name: 'Dr. Jane Kamau', specialization: 'Cardiology', appointment_date: '2026-07-28', start_time: '09:00:00', end_time: '10:00:00', status: 'confirmed', payment_status: 'succeeded', fee: 3000 },
  { id: 'apt-502', patient_name: 'David Ochieng', doctor_name: 'Dr. David Ochieng', specialization: 'General Consultation', appointment_date: '2026-07-28', start_time: '11:00:00', end_time: '12:00:00', status: 'pending', payment_status: 'pending', fee: 2500 },
  { id: 'apt-503', patient_name: 'Grace Wambui', doctor_name: 'Dr. Sarah Wambui', specialization: 'Dermatology', appointment_date: '2026-07-27', start_time: '14:00:00', end_time: '15:00:00', status: 'completed', payment_status: 'succeeded', fee: 3500 },
  { id: 'apt-504', patient_name: 'Kevin Otieno', doctor_name: 'Dr. Peter Njuguna', specialization: 'Paediatrics', appointment_date: '2026-07-26', start_time: '10:00:00', end_time: '11:00:00', status: 'cancelled', payment_status: 'failed', fee: 2500 },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<MasterAppointment[]>(mockAppointments);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
      a.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    toast.success('Appointments CSV exported successfully.');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Master Appointment Logs</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor system-wide consultation bookings across all clinics.
          </p>
        </div>
        <Button onClick={exportCSV} className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold text-xs gap-2">
          <Download className="h-4 w-4" /> Export CSV Report
        </Button>
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-card border border-border/60">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((st) => (
            <Button
              key={st}
              variant={statusFilter === st ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl text-xs font-bold capitalize ${
                statusFilter === st ? 'bg-primary-600 hover:bg-primary-700' : ''
              }`}
            >
              {st}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-card border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor & Specialty</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4 text-right">Consultation Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No appointments match your filter criteria
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[11px] text-muted-foreground">{appt.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{appt.patient_name}</td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{appt.doctor_name}</p>
                      <span className="text-[10px] text-teal-600 font-semibold">{appt.specialization}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{formatDate(appt.appointment_date)}</p>
                      <span className="text-[10px] text-muted-foreground">{formatTime(appt.start_time)} – {formatTime(appt.end_time)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        appt.status === 'confirmed'
                          ? 'bg-blue-100 text-blue-800'
                          : appt.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : appt.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        appt.payment_status === 'succeeded' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {appt.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">{formatCurrency(appt.fee)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

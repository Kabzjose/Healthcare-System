'use client';

import React, { useState } from 'react';
import { Search, Stethoscope, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface DoctorRecord {
  id: string;
  name: string;
  specialization: string;
  license: string;
  experience: number;
  fee: number;
  verified: boolean;
  status: 'active' | 'suspended';
}

const mockDoctorRecords: DoctorRecord[] = [
  { id: 'doc-101', name: 'Dr. Jane Kamau', specialization: 'Cardiology', license: 'KMPDC-8842', experience: 12, fee: 3000, verified: true, status: 'active' },
  { id: 'doc-102', name: 'Dr. David Ochieng', specialization: 'General Consultation', license: 'KMPDC-9104', experience: 8, fee: 2500, verified: true, status: 'active' },
  { id: 'doc-103', name: 'Dr. Sarah Wambui', specialization: 'Dermatology', license: 'KMPDC-7731', experience: 10, fee: 3500, verified: true, status: 'active' },
  { id: 'doc-104', name: 'Dr. Peter Njuguna', specialization: 'Paediatrics', license: 'KMPDC-6620', experience: 6, fee: 2500, verified: false, status: 'active' },
  { id: 'doc-105', name: 'Dr. Lucy Njeri', specialization: 'Orthopaedics', license: 'KMPDC-5519', experience: 15, fee: 4000, verified: true, status: 'suspended' },
];

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<DoctorRecord[]>(mockDoctorRecords);
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState<string>('all');

  const specializations = ['all', 'Cardiology', 'General Consultation', 'Dermatology', 'Paediatrics', 'Orthopaedics'];

  const filteredDoctors = doctors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase()) ||
      d.license.toLowerCase().includes(search.toLowerCase());
    const matchesSpec = specFilter === 'all' || d.specialization === specFilter;
    return matchesSearch && matchesSpec;
  });

  const toggleVerify = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextState = !d.verified;
          toast.success(`${d.name} verification status: ${nextState ? 'Verified' : 'Unverified'}`);
          return { ...d, verified: nextState };
        }
        return d;
      })
    );
  };

  const toggleStatus = (id: string) => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'active' ? 'suspended' : 'active';
          toast.success(`${d.name} is now ${nextStatus}`);
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Doctor Verification & Directory</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Verify licenses, check practice credentials, and manage doctor availability.
          </p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-card border border-border/60">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by doctor name or license..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {specializations.map((s) => (
            <Button
              key={s}
              variant={specFilter === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSpecFilter(s)}
              className={`rounded-xl text-xs font-bold ${
                specFilter === s ? 'bg-primary-600 hover:bg-primary-700' : ''
              }`}
            >
              {s}
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
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Specialization</th>
                <th className="px-6 py-4">License No.</th>
                <th className="px-6 py-4">Fee / Visit</th>
                <th className="px-6 py-4">Verification</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No doctor profiles found
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-teal-50 text-teal-700 font-bold flex items-center justify-center border border-teal-100">
                          {doc.name.replace('Dr. ', '')[0]}
                        </div>
                        <div>
                          <p>{doc.name}</p>
                          <span className="text-[10px] text-muted-foreground font-normal">{doc.experience} Years Exp.</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-teal-700">{doc.specialization}</td>
                    <td className="px-6 py-4 font-mono text-[11px]">{doc.license}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{formatCurrency(doc.fee)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {doc.verified ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
                        {doc.verified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        doc.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleVerify(doc.id)}
                          className="rounded-xl text-[11px] h-7 font-bold border-teal-200 text-teal-700 hover:bg-teal-50"
                        >
                          {doc.verified ? 'Unverify' : 'Verify License'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(doc.id)}
                          className={`rounded-xl text-[11px] h-7 font-bold ${
                            doc.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {doc.status === 'active' ? 'Suspend' : 'Unsuspend'}
                        </Button>
                      </div>
                    </td>
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

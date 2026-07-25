'use client';

import React, { useState } from 'react';
import { CreditCard, DollarSign, ArrowUpRight, Search, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  patient_name: string;
  doctor_name: string;
  provider: 'mpesa' | 'stripe';
  reference: string;
  amount: number;
  status: 'succeeded' | 'pending' | 'refunded';
  created_at: string;
}

const mockTransactions: Transaction[] = [
  { id: 'tx-901', patient_name: 'Amina Mohamed', doctor_name: 'Dr. Jane Kamau', provider: 'mpesa', reference: 'QW89234KL', amount: 3000, status: 'succeeded', created_at: '2026-07-25 14:30' },
  { id: 'tx-902', patient_name: 'David Ochieng', doctor_name: 'Dr. David Ochieng', provider: 'mpesa', reference: 'QW89235MN', amount: 2500, status: 'pending', created_at: '2026-07-25 15:10' },
  { id: 'tx-903', patient_name: 'Grace Wambui', doctor_name: 'Dr. Sarah Wambui', provider: 'stripe', reference: 'pi_3M001923', amount: 3500, status: 'succeeded', created_at: '2026-07-24 10:15' },
  { id: 'tx-904', patient_name: 'Kevin Otieno', doctor_name: 'Dr. Peter Njuguna', provider: 'stripe', reference: 're_3M001999', amount: 2500, status: 'refunded', created_at: '2026-07-23 16:45' },
];

export default function AdminPaymentsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.patient_name.toLowerCase().includes(search.toLowerCase()) ||
      t.doctor_name.toLowerCase().includes(search.toLowerCase()) ||
      t.reference.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === 'all' || t.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  const exportReport = () => {
    toast.success('Financial transactions report exported.');
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">System Payments & Revenue</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Audit digital transactions, M-Pesa receipts, card settlements, and processed refunds.
          </p>
        </div>
        <Button onClick={exportReport} className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold text-xs gap-2">
          <Download className="h-4 w-4" /> Download Statement
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Settlement</span>
          <p className="text-3xl font-extrabold text-foreground mt-3">{formatCurrency(1450000)}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">+24% vs last month</span>
        </div>

        <div className="stat-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">M-Pesa Revenue</span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-3">{formatCurrency(1100000)}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">76% of all transactions</span>
        </div>

        <div className="stat-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Stripe Card Revenue</span>
          <p className="text-3xl font-extrabold text-primary-700 mt-3">{formatCurrency(350000)}</p>
          <span className="text-[11px] text-muted-foreground mt-1 block">24% of all transactions</span>
        </div>

        <div className="stat-card">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Refunded</span>
          <p className="text-3xl font-extrabold text-red-600 mt-3">{formatCurrency(15000)}</p>
          <span className="text-[11px] text-red-600 font-semibold mt-1 block">4 processed refunds</span>
        </div>
      </div>

      {/* Search & Provider Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-card border border-border/60">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reference or patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'mpesa', 'stripe'].map((p) => (
            <Button
              key={p}
              variant={providerFilter === p ? 'default' : 'outline'}
              size="sm"
              onClick={() => setProviderFilter(p)}
              className={`rounded-xl text-xs font-bold uppercase ${
                providerFilter === p ? 'bg-primary-600 hover:bg-primary-700' : ''
              }`}
            >
              {p}
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
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Doctor</th>
                <th className="px-6 py-4">Gateway Provider</th>
                <th className="px-6 py-4">Reference No.</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-muted-foreground">
                    No payment records found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-[11px] text-muted-foreground">{tx.id}</td>
                    <td className="px-6 py-4 font-bold text-foreground">{tx.patient_name}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{tx.doctor_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        tx.provider === 'mpesa' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                      }`}>
                        {tx.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px]">{tx.reference}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        tx.status === 'succeeded'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-foreground">{formatCurrency(tx.amount)}</td>
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

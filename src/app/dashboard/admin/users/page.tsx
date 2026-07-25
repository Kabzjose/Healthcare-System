'use client';

import React, { useState } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle2, User, MoreHorizontal, UserX, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  status: 'active' | 'suspended';
  created_at: string;
}

const mockUsers: AdminUser[] = [
  { id: 'usr-1', name: 'Amina Mohamed', email: 'amina@example.com', phone: '0712345678', role: 'patient', status: 'active', created_at: '2026-01-15' },
  { id: 'usr-2', name: 'Dr. Jane Kamau', email: 'dr.jane@medicare.co.ke', phone: '0722111333', role: 'doctor', status: 'active', created_at: '2025-11-20' },
  { id: 'usr-3', name: 'David Ochieng', email: 'david.o@example.com', phone: '0733444555', role: 'patient', status: 'active', created_at: '2026-02-04' },
  { id: 'usr-4', name: 'Grace Wambui', email: 'grace.w@example.com', phone: '0788999000', role: 'patient', status: 'suspended', created_at: '2026-03-10' },
  { id: 'usr-5', name: 'Admin System', email: 'admin@medicare.co.ke', phone: '0700000000', role: 'admin', status: 'active', created_at: '2025-01-01' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          toast.success(`User ${u.name} is now ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const deleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove user ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success(`User ${name} removed.`);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">User Management</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage user accounts, roles, suspensions, and registration details.
          </p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-card border border-border/60">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl text-xs"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'patient', 'doctor', 'admin'].map((r) => (
            <Button
              key={r}
              variant={roleFilter === r ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRoleFilter(r)}
              className={`rounded-xl text-xs font-bold capitalize ${
                roleFilter === r ? 'bg-primary-600 hover:bg-primary-700' : ''
              }`}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white rounded-3xl shadow-card border border-border/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-border/60 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-muted-foreground">
                    No users match your criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-50 text-primary-700 font-bold flex items-center justify-center">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <span className="text-[10px] text-muted-foreground">{u.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{u.email}</p>
                      <p className="text-[11px] text-muted-foreground">{u.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.role === 'doctor' ? 'bg-teal-100 text-teal-800' : u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-medium">{u.created_at}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStatus(u.id)}
                          className={`rounded-xl text-[11px] h-7 font-bold ${
                            u.status === 'active' ? 'text-amber-700 border-amber-200 hover:bg-amber-50' : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUser(u.id, u.name)}
                          className="h-7 w-7 p-0 text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="h-4 w-4" />
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

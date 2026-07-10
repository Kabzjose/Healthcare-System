'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash, ToggleLeft, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import {
  useMyAvailability,
  useCreateAvailabilitySlots,
  useToggleSlot,
  useDeleteSlot,
} from '@/hooks/useDoctors';
import { useToast } from '@/hooks/use-toast';
import { DayOfWeek, AvailabilitySlot } from '@/types';

const DAYS: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const groupByDay = (slots: AvailabilitySlot[]) =>
  slots.reduce<Record<string, AvailabilitySlot[]>>((acc, s) => {
    acc[s.day_of_week] = acc[s.day_of_week] || [];
    acc[s.day_of_week].push(s);
    return acc;
  }, {});

export default function AvailabilityPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { data: slots = [], isLoading, error } = useMyAvailability();

  const createSlots = useCreateAvailabilitySlots();
  const toggleSlot = useToggleSlot();
  const deleteSlot = useDeleteSlot();

  const [newSlot, setNewSlot] = useState({ day_of_week: 'monday', start_time: '', end_time: '' });
  const [pendingQueue, setPendingQueue] = useState<{ day_of_week: DayOfWeek; start_time: string; end_time: string }[]>([]);

  const grouped = useMemo(() => groupByDay(slots), [slots]);

  // If doctor has no slots, show creation UI prominently.
  useEffect(() => {
    // Optional: if you want to force redirect from another page, handle it there.
  }, []);

  const handleAddToQueue = () => {
    if (!newSlot.start_time || !newSlot.end_time) {
      toast({ title: 'Start and end time are required', variant: 'destructive' });
      return;
    }
    if (newSlot.end_time <= newSlot.start_time) {
      toast({ title: 'End time must be after start time', variant: 'destructive' });
      return;
    }
    setPendingQueue((q) => [...q, { ...(newSlot as any) }]);
    setNewSlot({ day_of_week: 'monday', start_time: '', end_time: '' });
  };

  const handleSubmit = async () => {
    if (pendingQueue.length === 0) {
      toast({ title: 'Add at least one slot first', variant: 'destructive' });
      return;
    }

    try {
      await createSlots.mutateAsync({ slots: pendingQueue });
      toast({ title: 'Availability saved' });
      setPendingQueue([]);
      // stay on page so doctor can see slots; optionally navigate elsewhere
    } catch (err) {
      // mutation hook will invalidate and surface errors via toast if needed
    }
  };

  const handleToggle = async (slotId: string, is_active: boolean) => {
    try {
      await toggleSlot.mutateAsync({ slotId, is_active });
      toast({ title: 'Slot updated' });
    } catch {}
  };

  const handleDelete = async (slotId: string) => {
    if (!confirm('Delete this slot?')) return;
    try {
      await deleteSlot.mutateAsync(slotId);
      toast({ title: 'Slot deleted' });
    } catch {}
  };

  if (isLoading) return <div className="py-10"><LoadingSpinner fullPage={false} /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Availability</h1>
        <p className="text-sm text-muted-foreground">Create and manage your weekly availability slots</p>
      </div>

      {error && <ErrorMessage message="Could not load availability" />}

      {/* If no slots exist, show prominent call-to-action + creation form */}
      {slots.length === 0 ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">No availability set</CardTitle>
            <CardDescription>Patients won't be able to book you until you add availability.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Add one or more weekly slots below. You can add multiple slots before saving.</p>
            <div className="grid grid-cols-3 gap-3 items-end">
              <div>
                <Label>Day</Label>
                <select
                  className="w-full rounded border p-2"
                  value={newSlot.day_of_week}
                  onChange={(e) => setNewSlot((s) => ({ ...s, day_of_week: e.target.value }))}
                >
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Start</Label>
                <Input type="time" value={newSlot.start_time} onChange={(e) => setNewSlot((s) => ({ ...s, start_time: e.target.value }))} />
              </div>

              <div>
                <Label>End</Label>
                <Input type="time" value={newSlot.end_time} onChange={(e) => setNewSlot((s) => ({ ...s, end_time: e.target.value }))} />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={handleAddToQueue} variant="outline"><PlusCircle className="mr-2" /> Add Slot</Button>
              <Button onClick={handleSubmit} disabled={createSlots.isPending || pendingQueue.length === 0}>{createSlots.isPending ? 'Saving...' : 'Save Slots'}</Button>
            </div>

            {pendingQueue.length > 0 && (
              <div className="mt-4">
                <Separator className="mb-2" />
                <h3 className="font-medium mb-2">Pending slots</h3>
                <ul className="space-y-2">
                  {pendingQueue.map((s, i) => (
                    <li key={`${s.day_of_week}-${s.start_time}-${i}`} className="flex items-center justify-between">
                      <div>{s.day_of_week} — {s.start_time} – {s.end_time}</div>
                      <Button variant="ghost" size="sm" onClick={() => setPendingQueue((q) => q.filter((_, idx) => idx !== i))}><Trash /></Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Existing slots view
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Clock className="h-4 w-4" /> Your Weekly Availability</CardTitle>
              <CardDescription>Toggle slots to activate/deactivate, or delete them.</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(grouped).length === 0 ? (
                <p className="text-sm text-muted-foreground">No availability slots set.</p>
              ) : (
                <div className="space-y-4">
                  {DAYS.map((day) => (
                    <div key={day}>
                      <h4 className="text-sm font-semibold capitalize mb-2">{day}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(grouped[day] || []).map((slot) => (
                          <div key={slot.id} className="rounded-md border px-3 py-2 flex items-center gap-3">
                            <div className="text-sm">{slot.start_time} – {slot.end_time}</div>
                            <Button variant="ghost" size="sm" onClick={() => handleToggle(slot.id, !slot.is_active)}>
                              <ToggleLeft className={`transform ${slot.is_active ? 'text-green-500' : 'text-muted-foreground'}`} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(slot.id)}>
                              <Trash />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick add small form below list */}
          <Card>
            <CardHeader>
              <CardTitle>Add More Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3 items-end">
                <div>
                  <Label>Day</Label>
                  <select className="w-full rounded border p-2" value={newSlot.day_of_week} onChange={(e) => setNewSlot((s) => ({ ...s, day_of_week: e.target.value }))}>
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Start</Label>
                  <Input type="time" value={newSlot.start_time} onChange={(e) => setNewSlot((s) => ({ ...s, start_time: e.target.value }))} />
                </div>
                <div>
                  <Label>End</Label>
                  <Input type="time" value={newSlot.end_time} onChange={(e) => setNewSlot((s) => ({ ...s, end_time: e.target.value }))} />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleAddToQueue} variant="outline"><PlusCircle className="mr-2" /> Add</Button>
                <Button onClick={handleSubmit} disabled={createSlots.isPending || pendingQueue.length === 0}>{createSlots.isPending ? 'Saving...' : 'Save'}</Button>
              </div>

              {pendingQueue.length > 0 && (
                <div className="mt-4">
                  <Separator className="mb-2" />
                  <h3 className="font-medium mb-2">Pending slots</h3>
                  <ul className="space-y-2">
                    {pendingQueue.map((s, i) => (
                      <li key={`${s.day_of_week}-${s.start_time}-${i}`} className="flex items-center justify-between">
                        <div>{s.day_of_week} — {s.start_time} – {s.end_time}</div>
                        <Button variant="ghost" size="sm" onClick={() => setPendingQueue((q) => q.filter((_, idx) => idx !== i))}><Trash /></Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

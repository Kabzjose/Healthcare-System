'use client';

import { useMemo, useState } from 'react';
import { Stethoscope, Clock, Pencil } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useMyDoctorProfile, useMyAvailability } from '@/hooks/useDoctors';
import { formatCurrency, formatTime, getInitials, capitalize } from '@/lib/utils';
import { AvailabilitySlot, DayOfWeek } from '@/types';

const groupByDay = (slots: AvailabilitySlot[] = []) =>
  slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    const day = slot.day_of_week as string;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

export default function MyProfilePage() {
  const { data: profile, isLoading: loadingProfile, error: profileError } = useMyDoctorProfile();
  const { data: slots = [], isLoading: loadingSlots, error: slotsError } = useMyAvailability();
  const [selectedDay] = useState<string | null>(null);

  const grouped = useMemo(() => groupByDay(slots), [slots]);
  const days = Object.keys(grouped);

  if (loadingProfile || loadingSlots) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (profileError) return <ErrorMessage message="Could not load profile" />;
  if (slotsError) return <ErrorMessage message="Could not load availability" />;

  if (!profile) {
    return (
      <div className="py-20">
        <ErrorMessage message="No profile found. Complete your profile first." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {getInitials(profile.first_name, profile.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Dr. {profile.first_name} {profile.last_name}</h1>
            <p className="text-primary font-medium mt-1">{profile.specialization}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild>
            <a href="/dashboard/doctors/profile"><Pencil className="mr-2 h-4 w-4" />Edit Profile</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard/doctors/availability">Manage Availability</a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope className="h-4 w-4" /> About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{profile.bio ?? 'No bio provided.'}</p>
            <div className="text-sm">
              <p><strong>Experience:</strong> {profile.years_of_experience} years</p>
              <p><strong>Consultation Fee:</strong> <span className="text-primary font-medium">{formatCurrency(profile.consultation_fee)}</span></p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4" /> Availability</CardTitle>
              <CardDescription>Weekly slots shown below. Use Manage Availability to edit.</CardDescription>
            </CardHeader>
            <CardContent>
              {days.length === 0 ? (
                <p className="text-sm text-muted-foreground">You have no availability slots. Add some in Manage Availability.</p>
              ) : (
                <div className="space-y-4">
                  {days.map((day) => (
                    <div key={day}>
                      <h4 className="text-sm font-semibold capitalize mb-2">{capitalize(day)}</h4>
                      <div className="flex flex-wrap gap-2">
                        {(grouped[day] || []).map((slot) => (
                          <div key={slot.id} className="rounded-md border px-3 py-2">
                            <div className="text-sm">{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

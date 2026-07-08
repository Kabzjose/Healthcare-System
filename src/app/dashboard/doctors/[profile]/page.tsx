'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Stethoscope, Star, Phone, Mail, Clock } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { BookingModal } from '@/components/doctors/BookingModal';
import { useDoctor, useDoctorAvailability } from '@/hooks/useDoctors';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency, formatTime, getInitials, capitalize } from '@/lib/utils';

// Group slots by day for the display
const groupByDay = (slots: { day_of_week: string; start_time: string; end_time: string; id: string; is_active: boolean; doctor_id: string; created_at: string }[]) => {
  return slots.reduce<Record<string, typeof slots>>((acc, slot) => {
    if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {});
};

export default function DoctorProfilePage() {
  const { profileId } = useParams<{ profileId: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: doctor, isLoading: loadingDoctor, error } = useDoctor(profileId);
  const { data: slots = [], isLoading: loadingSlots } = useDoctorAvailability(profileId);

  const groupedSlots = groupByDay(slots);
  const days = Object.keys(groupedSlots);

  if (loadingDoctor) return (
    <div className="min-h-screen">
      <Navbar />
      <LoadingSpinner fullPage />
    </div>
  );

  if (error || !doctor) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-20">
        <ErrorMessage message="Doctor not found or an error occurred." />
      </div>
    </div>
  );

  const canBook = isAuthenticated && user?.role === 'patient';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Profile header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <Avatar className="h-20 w-20 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                  {getInitials(doctor.first_name, doctor.last_name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h1>
                <p className="text-primary font-medium mt-0.5">{doctor.specialization}</p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {doctor.years_of_experience} years experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4" />
                    {doctor.specialization}
                  </span>
                  {doctor.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      {doctor.email}
                    </span>
                  )}
                  {doctor.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {doctor.phone}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-4">
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(doctor.consultation_fee)}
                    <span className="text-sm font-normal text-muted-foreground"> / consultation</span>
                  </p>

                  {canBook && (
                    <Button onClick={() => setBookingOpen(true)} disabled={slots.length === 0}>
                      {slots.length === 0 ? 'No slots available' : 'Book Appointment'}
                    </Button>
                  )}

                  {!isAuthenticated && (
                    <Button asChild>
                      <a href="/login">Login to Book</a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        {doctor.bio && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About Dr. {doctor.last_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingSlots ? (
              <LoadingSpinner size="sm" />
            ) : days.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No availability slots set yet.
              </p>
            ) : (
              <div className="space-y-4">
                {days.map((day, idx) => (
                  <div key={day}>
                    {idx > 0 && <Separator className="mb-4" />}
                    <div className="flex items-start gap-4">
                      <p className="text-sm font-semibold capitalize w-24 shrink-0 pt-0.5">
                        {capitalize(day)}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {groupedSlots[day].map((slot) => (
                          <span
                            key={slot.id}
                            className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium"
                          >
                            {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking modal */}
      {canBook && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          doctor={doctor}
          slots={slots}
        />
      )}
    </div>
  );
}
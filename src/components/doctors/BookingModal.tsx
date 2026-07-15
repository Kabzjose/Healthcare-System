'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarDays, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useBookAppointment } from '@/hooks/useAppointments';
import { AvailabilitySlot, DoctorProfile } from '@/types';
import { formatTime, formatCurrency, getNextDateForDay, cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

const bookingSchema = z.object({
  reason: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;

      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    },
    z.string().min(5, 'Please describe your reason for the visit').optional()
  ),
});

type BookingFormValues = z.input<typeof bookingSchema>;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorProfile;
  slots: AvailabilitySlot[];
}

// Group slots by day of week
const groupSlotsByDay = (slots: AvailabilitySlot[]) => {
  return slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    if (!acc[slot.day_of_week]) acc[slot.day_of_week] = [];
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {});
};

export const BookingModal = ({
  isOpen,
  onClose,
  doctor,
  slots,
}: BookingModalProps) => {
  const { toast } = useToast();
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const { mutateAsync: bookAppointment, isPending, error } = useBookAppointment();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues, unknown, z.output<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });

  const groupedSlots = groupSlotsByDay(slots);
  const days = Object.keys(groupedSlots);

  const handleSlotSelect = (slot: AvailabilitySlot) => {
    setSelectedSlot(slot);
    // Auto-set the next available date for that day
    setSelectedDate(getNextDateForDay(slot.day_of_week));
  };

  const handleClose = () => {
    setSelectedSlot(null);
    setSelectedDate('');
    reset();
    onClose();
  };

  const onSubmit = async (values: z.output<typeof bookingSchema>) => {
    if (!selectedSlot || !selectedDate) return;

    try {
      await bookAppointment({
        doctor_id: doctor.profile_id,
        availability_slot_id: selectedSlot.id,
        appointment_date: selectedDate,
        reason: values.reason,
      });

      toast({
        title: 'Appointment booked',
        description: `Your appointment with Dr. ${doctor.last_name} has been booked.`,
      });

      handleClose();
    } catch {
      // Error is shown via the error state below
    }
  };

  const apiError = error as AxiosError<{ message: string }> | null;
  const errorMessage = apiError?.response?.data?.message ?? apiError?.message;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Book with Dr. {doctor.first_name} {doctor.last_name}
          </DialogTitle>
          <DialogDescription>
            {doctor.specialization} · {formatCurrency(doctor.consultation_fee)} per visit
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
          {/* Step 1 — pick a slot */}
          <div>
            <Label className="text-sm font-medium mb-3 block">
              Select a day and time
            </Label>

            {days.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This doctor has no available slots yet.
              </p>
            ) : (
              <div className="space-y-4">
                {days.map((day) => (
                  <div key={day}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 capitalize">
                      {day}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {groupedSlots[day].map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSlotSelect(slot)}
                          className={cn(
                            'flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-colors',
                            selectedSlot?.id === slot.id
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border bg-background hover:border-primary hover:text-primary'
                          )}
                        >
                          <Clock className="h-3.5 w-3.5" />
                          {formatTime(slot.start_time)}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2 — confirm or change date */}
          {selectedSlot && (
            <div>
              <Label htmlFor="date" className="text-sm font-medium mb-1.5 block">
                Appointment date
              </Label>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  id="date"
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This slot is available on {selectedSlot.day_of_week}s
              </p>
            </div>
          )}

          {/* Step 3 — reason */}
          <div>
            <Label htmlFor="reason" className="text-sm font-medium mb-1.5 block">
              Reason for visit{' '}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Briefly describe your symptoms or reason for the visit..."
              rows={3}
              {...register('reason')}
              className="resize-none"
            />
            {errors.reason && (
              <p className="text-xs text-red-600 mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Error */}
          {errorMessage && <ErrorMessage message={errorMessage} />}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!selectedSlot || !selectedDate || isPending}
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Booking...
                </span>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

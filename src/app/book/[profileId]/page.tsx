'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDoctor, useDoctorAvailability } from '@/hooks/useDoctors';
import { useBookAppointment } from '@/hooks/useAppointments';
import { DayOfWeek } from '@/types';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatCurrency, formatDate, formatTime, getInitials } from '@/lib/utils';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Stethoscope,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { toast } from 'sonner';
import { AxiosError } from 'axios';

export default function BookAppointmentWizardPage() {
  const params = useParams<{ profileId: string }>();
  const profileId = params?.profileId;
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ start: string; end: string } | null>(null);
  const [reason, setReason] = useState<string>('');

  const { data: doctor, isLoading: doctorLoading } = useDoctor(profileId ?? '');
  const { data: availability, isLoading: availLoading } = useDoctorAvailability(profileId ?? '');
  const { mutate: bookAppointment, isPending: isBooking } = useBookAppointment();

  if (doctorLoading || availLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
          <h1 className="text-xl font-bold">Doctor profile not found</h1>
          <Button asChild className="rounded-xl">
            <Link href="/doctors">Back to Doctors</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Filter active slots
  const activeSlots = availability?.filter((s) => s.is_active) ?? [];

  // Group slots by day or list them
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Helper date generation for next 14 days starting at least 3 days in advance
  const upcomingDates = Array.from({ length: 14 }).map((_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() + idx + 3);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}-${mm}-${dd}`;
    const dayName = daysOfWeek[d.getDay()];
    const dayNumber = d.getDay(); // 0 is Sun, 1 is Mon...
    return { dateStr, dayName, dayNumber, formatted: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' }) };
  });

  const dayNamesMap: Record<number, DayOfWeek> = {
    0: 'sunday',
    1: 'monday',
    2: 'tuesday',
    3: 'wednesday',
    4: 'thursday',
    5: 'friday',
    6: 'saturday',
  };

  useEffect(() => {
    if (!selectedDate && activeSlots.length > 0 && upcomingDates.length > 0) {
      const firstAvailableDate = upcomingDates.find((d) =>
        activeSlots.some((s) => s.day_of_week === dayNamesMap[d.dayNumber])
      );
      if (firstAvailableDate) {
        setSelectedDate(firstAvailableDate.dateStr);
      }
    }
  }, [activeSlots, selectedDate]);

  const selectedDateObj = upcomingDates.find((d) => d.dateStr === selectedDate);
  const slotsForSelectedDay = activeSlots.filter(
    (s) => selectedDateObj && s.day_of_week === dayNamesMap[selectedDateObj.dayNumber]
  );

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTimeSlot || !selectedSlotId) {
      toast.error('Please select date and time slot first.');
      return;
    }

    bookAppointment(
      {
        doctor_id: doctor.profile_id,
        availability_slot_id: selectedSlotId,
        appointment_date: selectedDate,
        reason: reason || 'General Consultation',
      },
      {
        onSuccess: (data) => {
          toast.success('Appointment booked successfully!');
          router.push('/dashboard/patient/appointments');
        },
        onError: (err: unknown) => {
          const apiError = err as AxiosError<{ message?: string }>;
          toast.error(apiError.response?.data?.message ?? 'Booking failed. Please try again.');
        },
      }
    );
  };

  const steps = [
    { num: 1, label: 'Select Date' },
    { num: 2, label: 'Time Slot' },
    { num: 3, label: 'Visit Reason' },
    { num: 4, label: 'Confirm' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 text-foreground flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="section-container max-w-4xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
              Book Appointment
            </h1>
            <p className="text-sm text-muted-foreground">
              Follow 4 simple steps to schedule your consultation with Dr. {doctor.first_name} {doctor.last_name}
            </p>
          </div>

          {/* 4-Step Progress Indicator Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-card border border-border/60">
            <div className="grid grid-cols-4 gap-2">
              {steps.map((s) => {
                const isActive = step === s.num;
                const isDone = step > s.num;
                return (
                  <div
                    key={s.num}
                    onClick={() => {
                      if (isDone) setStep(s.num);
                    }}
                    className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold transition-all ${
                      isDone ? 'cursor-pointer' : ''
                    } ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border border-primary-200 shadow-xs'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
                    </div>
                    <span className="hidden sm:inline tracking-tight">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Doctor Summary Header Card */}
          <div className="bg-white p-6 rounded-3xl shadow-card border border-border/60 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-primary-600 text-white font-extrabold text-xl flex items-center justify-center shadow-card">
                {getInitials(doctor.first_name, doctor.last_name)}
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground">
                  Dr. {doctor.first_name} {doctor.last_name}
                </h3>
                <p className="text-xs font-bold text-teal-600 uppercase tracking-wide">
                  {doctor.specialization}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doctor.years_of_experience} Years Experience
                </p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-xs text-muted-foreground block">Consultation Fee</span>
              <span className="text-xl font-extrabold text-primary-700">
                {formatCurrency(doctor.consultation_fee)}
              </span>
            </div>
          </div>

          {/* STEP 1: Select Date */}
          {step === 1 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-border/60 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Step 1: Choose Appointment Date</h2>
                <p className="text-xs text-muted-foreground mt-1">Select an available day for your consultation</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {upcomingDates.map((item) => {
                  const isSelected = selectedDate === item.dateStr;
                  const dayHasSlots = activeSlots.some(
                    (s) => s.day_of_week === dayNamesMap[item.dayNumber]
                  );
                  return (
                    <button
                      key={item.dateStr}
                      type="button"
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedSlotId('');
                        setSelectedTimeSlot(null);
                      }}
                      className={`p-3 rounded-2xl text-center border transition-all flex flex-col items-center justify-center space-y-1 ${
                        isSelected
                          ? 'bg-primary-600 text-white border-primary-600 shadow-card font-bold scale-105'
                          : dayHasSlots
                          ? 'bg-white border-primary-200 hover:border-primary-400 text-foreground'
                          : 'bg-slate-50 border-border/50 text-muted-foreground opacity-70'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                        {item.dayName.slice(0, 3)}
                      </span>
                      <span className="text-lg font-extrabold">{item.dateStr.slice(8)}</span>
                      <span className="text-[10px] opacity-75">{item.formatted.split(',')[0]}</span>
                      {dayHasSlots ? (
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-800'
                        }`}>
                          Available
                        </span>
                      ) : (
                        <span className="text-[9px] text-muted-foreground mt-1">No slots</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button
                  disabled={!selectedDate}
                  onClick={() => setStep(2)}
                  className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold px-6 gap-2"
                >
                  Continue to Time Slot <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Time Slot */}
          {step === 2 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-border/60 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Step 2: Choose Available Time Slot</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Selected Date: <strong className="text-foreground">{formatDate(selectedDate)}</strong> ({selectedDateObj?.dayName})
                </p>
              </div>

              {slotsForSelectedDay.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {slotsForSelectedDay.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => {
                          setSelectedSlotId(slot.id);
                          setSelectedTimeSlot({ start: slot.start_time, end: slot.end_time });
                        }}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-center gap-2 font-semibold text-xs ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-card font-bold scale-105'
                            : 'bg-white border-border/70 hover:border-teal-400 text-foreground'
                        }`}
                      >
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(slot.start_time)} – {formatTime(slot.end_time)}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 text-center space-y-2">
                  <p className="font-bold text-sm">No Available Time Slots</p>
                  <p className="text-xs text-amber-700 max-w-md mx-auto">
                    Dr. {doctor.first_name} {doctor.last_name} has no active consultation slots on {selectedDateObj?.dayName}s. Please go back to Step 1 and select an available day.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl font-bold">
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={!selectedTimeSlot || !selectedSlotId || slotsForSelectedDay.length === 0}
                  onClick={() => setStep(3)}
                  className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold px-6 gap-2"
                >
                  Continue to Details <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Visit Details */}
          {step === 3 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-border/60 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Step 3: Reason for Consultation</h2>
                <p className="text-xs text-muted-foreground mt-1">Briefly describe your symptoms or medical concern</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground">Reason / Symptoms (Optional)</label>
                <Textarea
                  rows={4}
                  placeholder="e.g. Regular health check-up, persistent headaches, or skin rash consultation..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="rounded-2xl resize-none text-xs"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl font-bold">
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  className="rounded-xl bg-primary-600 hover:bg-primary-700 font-bold px-6 gap-2"
                >
                  Review & Confirm <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Confirmation */}
          {step === 4 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-card border border-border/60 space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl font-extrabold text-foreground">Step 4: Review & Final Confirmation</h2>
                <p className="text-xs text-muted-foreground mt-1">Please confirm your appointment details before finalizing</p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-6 space-y-4 border border-border/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-medium">Doctor</span>
                    <strong className="text-foreground text-sm">Dr. {doctor.first_name} {doctor.last_name}</strong>
                    <span className="text-teal-600 block font-semibold">{doctor.specialization}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium">Consultation Fee</span>
                    <strong className="text-foreground text-base">{formatCurrency(doctor.consultation_fee)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium">Appointment Date</span>
                    <strong className="text-foreground">{formatDate(selectedDate)}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium">Time Slot</span>
                    <strong className="text-foreground">
                      {selectedTimeSlot ? `${formatTime(selectedTimeSlot.start)} – ${formatTime(selectedTimeSlot.end)}` : '—'}
                    </strong>
                  </div>
                </div>

                {reason && (
                  <div className="pt-3 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground block font-medium">Notes / Reason</span>
                    <p className="text-foreground italic mt-0.5">&ldquo;{reason}&rdquo;</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <Button variant="outline" onClick={() => setStep(3)} className="rounded-xl font-bold">
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
                </Button>
                <Button
                  disabled={isBooking}
                  onClick={handleConfirmBooking}
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 h-12 shadow-card gap-2"
                >
                  {isBooking ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" /> Booking...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-5 w-5" /> Confirm Appointment
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

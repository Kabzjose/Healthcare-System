'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentCard } from '@/components/appointments/AppointmentCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { MpesaModal } from '@/components/payments/MpesaModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { usePatientAppointments, useCancelAppointment } from '@/hooks/useAppointments';
import { useCreateCheckoutSession } from '@/hooks/usePayments';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { CreditCard, Smartphone } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

const tabs = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;

export default function PatientAppointmentsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('pending');
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showPaymentChoice, setShowPaymentChoice] = useState(false);
  const [showMpesa, setShowMpesa] = useState(false);

  const { data, isLoading } = usePatientAppointments(
  { status: activeTab },
  { refetchInterval: activeTab === 'confirmed' ? 10000 : undefined }
);
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  const { mutate: stripeCheckout, isPending: isCheckingOut } = useCreateCheckoutSession();

  const appointments = data?.data ?? [];

  const handleCancel = (id: string) => {
    cancelAppointment(
      { appointmentId: id },
      {
        onSuccess: () => toast({ title: 'Appointment cancelled successfully' }),
        onError: (err: any) =>
          toast({
            title: 'Could not cancel',
            description: err?.response?.data?.message,
            variant: 'destructive',
          }),
      }
    );
  };

  // Open payment choice modal
  const handlePay = (appt: Appointment) => {
    setSelectedAppt(appt);
    setShowPaymentChoice(true);
  };

  const handleStripe = () => {
    if (!selectedAppt) return;
    setShowPaymentChoice(false);
    stripeCheckout(selectedAppt.id);
  };

  const handleMpesa = () => {
    setShowPaymentChoice(false);
    setShowMpesa(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
        <p className="text-muted-foreground mt-1">
          Manage and track all your appointments
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex gap-1 bg-transparent p-0 h-auto border-b border-border/60 w-full rounded-none">
          {([
            { value: 'pending',   label: 'Pending',   activeColor: 'border-yellow-500 text-yellow-700 bg-yellow-50 font-extrabold' },
            { value: 'confirmed', label: 'Confirmed',  activeColor: 'border-blue-500 text-blue-700 bg-blue-50 font-extrabold' },
            { value: 'completed', label: 'Completed',  activeColor: 'border-green-500 text-green-700 bg-green-50 font-extrabold' },
            { value: 'cancelled', label: 'Cancelled',  activeColor: 'border-red-400 text-red-600 bg-red-50 font-extrabold' },
          ] as const).map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-all whitespace-nowrap -mb-px',
                activeTab === tab.value
                  ? tab.activeColor
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : appointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title={`No ${tab.label.toLowerCase()} appointments`}
                description={
                  tab.value === 'pending'
                    ? 'Book an appointment to get started'
                    : tab.value === 'confirmed'
                    ? 'Confirmed appointments will appear here — pay to secure your slot'
                    : undefined
                }
                action={
                  tab.value === 'pending' ? (
                    <Button asChild>
                      <Link href="/doctors">Find a Doctor</Link>
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {appointments.map((appt) => (
                  <AppointmentCard
                    key={appt.id}
                    appointment={appt}
                    role="patient"
                    onCancel={handleCancel}
                    onPay={() => handlePay(appt)}
                    isUpdating={isCancelling || isCheckingOut}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Payment choice modal */}
      <Dialog open={showPaymentChoice} onOpenChange={setShowPaymentChoice}>
        <DialogContent className="sm:max-w-sm bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-3xl p-6 opacity-100">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Choose Payment Method</DialogTitle>
            <DialogDescription className="text-slate-600 text-sm">
              {selectedAppt && (
                <>
                  Pay <strong className="text-slate-900 font-bold">{formatCurrency(selectedAppt.consultation_fee)}</strong> for your
                  appointment with Dr. {selectedAppt.doctor_last_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-2">
            <Button
              className="w-full justify-start gap-3 h-14"
              variant="outline"
              onClick={handleStripe}
              disabled={isCheckingOut}
            >
              <CreditCard className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <p className="font-medium">Card Payment</p>
                <p className="text-xs text-muted-foreground">
                  Visa, Mastercard via Stripe
                </p>
              </div>
            </Button>

            <Button
              className="w-full justify-start gap-3 h-14"
              variant="outline"
              onClick={handleMpesa}
            >
              <Smartphone className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">M-Pesa</p>
                <p className="text-xs text-muted-foreground">
                  Pay via Safaricom M-Pesa STK push
                </p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* M-Pesa modal */}
      {selectedAppt && (
        <MpesaModal
          isOpen={showMpesa}
          onClose={() => {
            setShowMpesa(false);
            setSelectedAppt(null);
          }}
          appointmentId={selectedAppt.id}
          amount={selectedAppt.consultation_fee}
        />
      )}
    </div>
  );
}
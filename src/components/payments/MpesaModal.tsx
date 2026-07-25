'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Smartphone, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { useInitiateMpesa } from '@/hooks/usePayments';
import { AxiosError } from 'axios';

const mpesaSchema = z.object({
  phone: z
    .string({ error: 'Phone number is required' })
    .regex(
      /^(254|0)[17]\d{8}$/,
      'Enter a valid Kenyan number e.g. 0712345678 or 254712345678'
    ),
});

type MpesaFormValues = z.infer<typeof mpesaSchema>;

interface MpesaModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
  amount: number;
}

export const MpesaModal = ({
  isOpen,
  onClose,
  appointmentId,
  amount,
}: MpesaModalProps) => {
  const [pushed, setPushed] = useState(false);
  const { mutateAsync: initiateMpesa, isPending, error } = useInitiateMpesa();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MpesaFormValues>({ resolver: zodResolver(mpesaSchema) });

  const handleClose = () => {
    reset();
    setPushed(false);
    onClose();
  };

  const onSubmit = async (values: MpesaFormValues) => {
    await initiateMpesa({ appointmentId, phone: values.phone });
    setPushed(true);
  };

  const apiError = error as AxiosError<{ message: string }> | null;
  const errorMessage = apiError?.response?.data?.message ?? apiError?.message;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-3xl p-6 sm:p-8 opacity-100 z-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-slate-900">
            <div className="h-9 w-9 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
              <Smartphone className="h-5 w-5" />
            </div>
            Pay with M-Pesa
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm mt-1">
            Total Amount: <strong className="text-emerald-700 font-extrabold text-base">KES {amount.toLocaleString()}</strong>
          </DialogDescription>
        </DialogHeader>

        {pushed ? (
          // Success state — STK push sent
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <p className="font-extrabold text-lg text-slate-900">STK Push Sent!</p>
              <p className="text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                Check your phone and enter your <strong className="text-slate-900">M-Pesa PIN</strong> to complete payment.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl h-11">
              Close Window
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-3">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-bold text-slate-800">
                M-Pesa Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                className="bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 h-11 rounded-xl font-medium focus-visible:ring-emerald-500"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs font-semibold text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-slate-500">
                Enter your Safaricom number to receive the payment prompt
              </p>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl h-11 border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 rounded-xl h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-sm"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Sending STK...
                  </span>
                ) : (
                  'Send STK Push'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
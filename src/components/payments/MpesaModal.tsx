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
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            Pay with M-Pesa
          </DialogTitle>
          <DialogDescription>
            Amount: KES {amount.toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {pushed ? (
          // Success state — STK push sent
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <div>
              <p className="font-semibold">STK push sent to your phone</p>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your M-Pesa PIN on your phone to complete payment.
                This page will update once payment is confirmed.
              </p>
            </div>
            <Button variant="outline" onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
            <div>
              <Label htmlFor="phone" className="mb-1.5 block">
                M-Pesa phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="0712 345 678"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                You will receive a payment prompt on this number
              </p>
            </div>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Sending...
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
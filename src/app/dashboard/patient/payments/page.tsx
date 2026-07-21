'use client';

import { useState } from 'react';
import { CreditCard, Smartphone, Calendar, Hash } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { PaymentStatusBadge } from '@/components/appointments/StatusBadge';
import { useMyPayments } from '@/hooks/usePayments';
import { Payment } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { PaginationMeta } from '@/types';

// ── Single payment row ────────────────────────────────────────────────────────
const PaymentRow = ({ payment }: { payment: Payment }) => {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          {/* Left — provider icon + details */}
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-muted p-2 shrink-0">
              {payment.provider === 'mpesa' ? (
                <Smartphone className="h-4 w-4 text-green-600" />
              ) : (
                <CreditCard className="h-4 w-4 text-blue-600" />
              )}
            </div>

            <div className="space-y-1">
              <p className="font-medium capitalize">
                {payment.provider === 'mpesa' ? 'M-Pesa' : 'Card'} Payment
              </p>

              {payment.provider_reference && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Hash className="h-3 w-3" />
                  <span className="font-mono">{payment.provider_reference}</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{formatDateTime(payment.created_at)}</span>
              </div>

              {payment.paid_at && (
                <p className="text-xs text-green-600">
                  Paid on {formatDateTime(payment.paid_at)}
                </p>
              )}
            </div>
          </div>

          {/* Right — amount + status */}
          <div className="text-right shrink-0 space-y-1.5">
            <p className="font-bold text-lg">
              {formatCurrency(payment.amount, payment.currency)}
            </p>
            <PaymentStatusBadge status={payment.status} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ── Payment list with pagination ──────────────────────────────────────────────
const PaymentList = ({
  status,
}: {
  status?: 'pending' | 'succeeded' | 'failed' | 'refunded';
}) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPayments({ status, page });

  const payments = data?.data ?? [];
  const meta = data?.meta as PaginationMeta | undefined;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <EmptyState
        icon={CreditCard}
        title="No payments found"
        description={
          status
            ? `You have no ${status} payments`
            : 'Your payment history will appear here'
        }
      />
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => (
        <PaymentRow key={payment.id} payment={payment} />
      ))}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PatientPaymentsPage() {
  const { data: allData } = useMyPayments();
  const payments = allData?.data ?? [];

  // Summary counts
  const succeeded = payments.filter((p) => p.status === 'succeeded').length;
  const pending = payments.filter((p) => p.status === 'pending').length;
  const failed = payments.filter((p) => p.status === 'failed').length;
  const totalSpent = payments
    .filter((p) => p.status === 'succeeded')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground mt-1">
          All your consultation payments in one place
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Total Spent
            </p>
            <p className="text-xl font-bold mt-1 text-primary">
              {formatCurrency(totalSpent)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Successful
            </p>
            <p className="text-xl font-bold mt-1 text-green-600">{succeeded}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Pending
            </p>
            <p className="text-xl font-bold mt-1 text-yellow-600">{pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
              Failed
            </p>
            <p className="text-xl font-bold mt-1 text-red-600">{failed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs by status */}
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="succeeded">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <PaymentList />
        </TabsContent>

        <TabsContent value="succeeded" className="mt-6">
          <PaymentList status="succeeded" />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <PaymentList status="pending" />
        </TabsContent>

        <TabsContent value="failed" className="mt-6">
          <PaymentList status="failed" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
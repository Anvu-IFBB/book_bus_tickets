import React from 'react';
import { BookingStatus, BookingPaymentStatus } from '@/types/booking';
import { VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import {
  BOOKING_STATUS_CONFIG,
  VEHICLE_STATUS_CONFIG,
  DRIVER_STATUS_CONFIG,
  TRIP_STATUS_CONFIG,
} from '@/lib/constants/config';
import { cn } from '@/lib/utils/cn';

export function BookingStatusBadge({
  status,
  className,
}: {
  status: BookingStatus;
  className?: string;
}) {
  const config = BOOKING_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {config.label}
    </span>
  );
}

export function VehicleStatusBadge({
  status,
  className,
}: {
  status: VehicleStatus;
  className?: string;
}) {
  const config = VEHICLE_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function DriverStatusBadge({
  status,
  className,
}: {
  status: DriverStatus;
  className?: string;
}) {
  const config = DRIVER_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function TripStatusBadge({
  status,
  className,
}: {
  status: TripStatus;
  className?: string;
}) {
  const config = TRIP_STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-slate-100 text-slate-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export function PaymentStatusBadge({
  status,
  className,
}: {
  status?: BookingPaymentStatus;
  className?: string;
}) {
  const configs: Record<BookingPaymentStatus, { label: string; badgeClass: string }> = {
    UNPAID: { label: 'Chưa thanh toán', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' },
    DEPOSIT_PAID: { label: 'Đã đặt cọc', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' },
    PAID: { label: 'Đã thanh toán đủ', badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    REFUNDED: { label: 'Đã hoàn tiền', badgeClass: 'bg-rose-50 text-rose-800 border-rose-200' },
  };

  const config = (status && configs[status]) || {
    label: status || 'Chưa thanh toán',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap',
        config.badgeClass,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />
      {config.label}
    </span>
  );
}


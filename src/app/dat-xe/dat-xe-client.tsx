'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingWizard } from '@/components/booking';
import { BookingServiceType } from '@/types/booking';

export default function DatXeClient() {
  const searchParams = useSearchParams();

  const serviceParam = searchParams.get('service')?.toUpperCase();
  const departureParam = searchParams.get('from');
  const destinationParam = searchParams.get('to');

  let initialService: BookingServiceType = 'LIMOUSINE';
  if (serviceParam === 'CONTRACT' || serviceParam === 'THUE-XE') {
    initialService = 'CONTRACT';
  } else if (serviceParam === 'CARGO' || serviceParam === 'GUI-HANG') {
    initialService = 'CARGO';
  } else if (serviceParam === 'TOUR' || serviceParam === 'DU-LICH') {
    initialService = 'TOUR';
  }

  return (
    <BookingWizard
      initialService={initialService}
      initialDeparture={departureParam || undefined}
      initialDestination={destinationParam || undefined}
    />
  );
}

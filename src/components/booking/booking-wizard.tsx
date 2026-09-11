'use client';

import React, { useState } from 'react';
import { BookingFormData, WizardStep, BookingWizardProps } from './types';
import { Booking, BookingServiceType, CreateBookingDTO } from '@/types/booking';
import { StepIndicator } from './steps/step-indicator';
import { Step1Service } from './steps/step1-service';
import { Step2Trip } from './steps/step2-trip';
import { Step3Customer } from './steps/step3-customer';
import { Step4Review } from './steps/step4-review';
import { Step5Success } from './steps/step5-success';
import { bookingService } from '@/services/bookingService';
import {
  limousineBookingSchema,
  contractBookingSchema,
  cargoBookingSchema,
  tourBookingSchema,
} from '@/lib/validation/bookingSchema';

const INITIAL_FORM_DATA: BookingFormData = {
  serviceType: 'LIMOUSINE',
  departure: 'Quảng Ninh',
  destination: 'Ninh Bình',
  travelDate: '',
  travelTime: '07:00',
  isRoundTrip: false,
  passengerCount: 1,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  pickupAddress: '',
  dropoffAddress: '',
  seatCount: 11,
  durationDays: 1,
  cargoQuantity: 1,
};

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialService = 'LIMOUSINE',
  initialDeparture,
  initialDestination,
  onSuccess,
}) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<BookingFormData>({
    ...INITIAL_FORM_DATA,
    serviceType: initialService,
    departure: initialDeparture || INITIAL_FORM_DATA.departure,
    destination: initialDestination || INITIAL_FORM_DATA.destination,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);

  const updateFormData = (patch: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const handleReset = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      serviceType: initialService,
    });
    setCreatedBooking(null);
    setError(undefined);
    setStep(1);
  };

  const handleConfirmBooking = async () => {
    setError(undefined);
    setIsLoading(true);

    try {
      // 1. Validate based on selected service type
      if (formData.serviceType === 'LIMOUSINE') {
        const validation = limousineBookingSchema.safeParse({
          serviceType: 'LIMOUSINE',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          departure: formData.departure,
          destination: formData.destination,
          travelDate: formData.travelDate,
          travelTime: formData.travelTime,
          returnDate: formData.returnDate || undefined,
          isRoundTrip: formData.isRoundTrip || false,
          passengerCount: formData.passengerCount,
          pickupAddress: formData.pickupAddress,
          dropoffAddress: formData.dropoffAddress,
          note: formData.note,
        });

        if (!validation.success) {
          setError(validation.error.issues[0]?.message || 'Thông tin đặt vé Limousine không hợp lệ');
          setIsLoading(false);
          return;
        }
      } else if (formData.serviceType === 'CONTRACT') {
        const validation = contractBookingSchema.safeParse({
          serviceType: 'CONTRACT',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          seatCount: formData.seatCount || 11,
          durationDays: formData.durationDays || 1,
          departure: formData.departure,
          destination: formData.destination,
          travelDate: formData.travelDate,
          travelTime: formData.travelTime,
          pickupAddress: formData.pickupAddress,
          dropoffAddress: formData.dropoffAddress,
          note: formData.note,
        });

        if (!validation.success) {
          setError(validation.error.issues[0]?.message || 'Thông tin thuê xe hợp đồng không hợp lệ');
          setIsLoading(false);
          return;
        }
      } else if (formData.serviceType === 'CARGO') {
        const validation = cargoBookingSchema.safeParse({
          serviceType: 'CARGO',
          senderName: formData.senderName || formData.customerName,
          senderPhone: formData.senderPhone || formData.customerPhone,
          receiverName: formData.receiverName || '',
          receiverPhone: formData.receiverPhone || '',
          departure: formData.departure,
          destination: formData.destination,
          pickupAddress: formData.pickupAddress,
          dropoffAddress: formData.dropoffAddress,
          cargoType: formData.cargoType || '',
          quantity: formData.cargoQuantity || 1,
          estimatedWeightKg: formData.cargoWeightKg,
          travelDate: formData.travelDate,
          note: formData.note,
        });

        if (!validation.success) {
          setError(validation.error.issues[0]?.message || 'Thông tin gửi hàng hóa không hợp lệ');
          setIsLoading(false);
          return;
        }
      } else if (formData.serviceType === 'TOUR') {
        const validation = tourBookingSchema.safeParse({
          serviceType: 'TOUR',
          customerName: formData.customerName,
          customerPhone: formData.customerPhone,
          customerEmail: formData.customerEmail || undefined,
          tourDestination: formData.tourDestination || formData.destination,
          departure: formData.departure,
          travelDate: formData.travelDate,
          returnDate: formData.returnDate || undefined,
          travelTime: formData.travelTime,
          passengerCount: formData.passengerCount,
          pickupAddress: formData.pickupAddress,
          note: formData.note,
        });

        if (!validation.success) {
          setError(validation.error.issues[0]?.message || 'Thông tin xe du lịch không hợp lệ');
          setIsLoading(false);
          return;
        }
      }

      // 2. Prepare CreateBookingDTO for BookingService
      const dto: CreateBookingDTO = {
        serviceType: formData.serviceType,
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim(),
        customerEmail: formData.customerEmail?.trim() || undefined,
        departure: formData.departure,
        destination: formData.destination,
        travelDate: formData.travelDate,
        travelTime: formData.travelTime,
        returnDate: formData.returnDate,
        isRoundTrip: formData.isRoundTrip,
        passengerCount: formData.passengerCount,
        pickupAddress: formData.pickupAddress.trim(),
        dropoffAddress: formData.dropoffAddress.trim(),
        note: formData.note?.trim(),
      };

      if (formData.serviceType === 'CONTRACT') {
        dto.contractDetails = {
          seatCount: formData.seatCount || 11,
          durationDays: formData.durationDays || 1,
          specialRequests: formData.note,
        };
        dto.vehicleType = `Xe ${formData.seatCount || 11} chỗ`;
      } else if (formData.serviceType === 'CARGO') {
        dto.cargoDetails = {
          senderName: (formData.senderName || formData.customerName).trim(),
          senderPhone: (formData.senderPhone || formData.customerPhone).trim(),
          receiverName: (formData.receiverName || '').trim(),
          receiverPhone: (formData.receiverPhone || '').trim(),
          pickupPoint: formData.pickupAddress.trim(),
          dropoffPoint: formData.dropoffAddress.trim(),
          cargoType: (formData.cargoType || '').trim(),
          quantity: formData.cargoQuantity || 1,
          estimatedWeightKg: formData.cargoWeightKg,
        };
      } else if (formData.serviceType === 'TOUR') {
        dto.tourDetails = {
          tourDestination: (formData.tourDestination || formData.destination).trim(),
          returnDate: formData.returnDate,
          specialRequests: formData.note,
        };
      }

      // 3. Call BookingService to create booking in repository
      const created = await bookingService.createBooking(dto);

      setCreatedBooking(created);
      setStep(5);

      if (onSuccess) {
        onSuccess(created);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Đã xảy ra lỗi không xác định khi tạo đặt chỗ';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      {step < 5 && <StepIndicator currentStep={step} />}

      <div className="p-4 sm:p-8 lg:p-10">
        {step === 1 && (
          <Step1Service
            selectedService={formData.serviceType}
            onSelectService={(service: BookingServiceType) => updateFormData({ serviceType: service })}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <Step2Trip
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <Step3Customer
            formData={formData}
            updateFormData={updateFormData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}

        {step === 4 && (
          <Step4Review
            formData={formData}
            isLoading={isLoading}
            error={error}
            onConfirm={handleConfirmBooking}
            onBack={() => setStep(3)}
          />
        )}

        {step === 5 && createdBooking && (
          <Step5Success booking={createdBooking} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

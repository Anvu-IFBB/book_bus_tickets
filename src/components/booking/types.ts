import { BookingServiceType, Booking } from '@/types/booking';

export type WizardStep = 1 | 2 | 3 | 4 | 5;

export interface BookingFormData {
  // Service
  serviceType: BookingServiceType;

  // Trip details
  departure: string;
  destination: string;
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  isRoundTrip?: boolean;
  passengerCount: number;

  // Contract specific
  seatCount?: 5 | 7 | 11 | 16 | 29;
  durationDays?: number;

  // Cargo specific
  senderName?: string;
  senderPhone?: string;
  receiverName?: string;
  receiverPhone?: string;
  cargoType?: string;
  cargoQuantity?: number;
  cargoWeightKg?: number;

  // Tour specific
  tourDestination?: string;

  // Customer details
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupAddress: string;
  dropoffAddress: string;
  note?: string;
}

export interface BookingWizardProps {
  initialService?: BookingServiceType;
  initialDeparture?: string;
  initialDestination?: string;
  onSuccess?: (booking: Booking) => void;
}

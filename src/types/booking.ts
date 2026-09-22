export type BookingServiceType = 'LIMOUSINE' | 'CONTRACT' | 'CARGO' | 'TOUR';

export type BookingStatus =
  | 'NEW'
  | 'CONTACTING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'DEPOSIT_PAID'
  | 'PAID'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type BookingPaymentStatus = 'UNPAID' | 'DEPOSIT_PAID' | 'PAID' | 'REFUNDED';

export interface BookingFilter {
  status?: BookingStatus;
  serviceType?: BookingServiceType;
  date?: string;
  search?: string;
}

export interface BookingStatusHistoryItem {
  status: BookingStatus;
  changedAt: string; // ISO string
  changedBy: string; // 'SYSTEM' | 'CUSTOMER' | user email
  note?: string;
}

export interface CargoDetails {
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  pickupPoint: string;
  dropoffPoint: string;
  cargoType: string;
  quantity?: number;
  estimatedWeightKg?: number;
}

export interface ContractVehicleDetails {
  seatCount: 5 | 7 | 11 | 16 | 29;
  durationDays: number;
  specialRequests?: string;
}

export interface TourBookingDetails {
  tourDestination: string;
  returnDate?: string;
  specialRequests?: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // BKYYYYMMDDXXXX or HGYYYYMMDDXXXX
  customerId: string;
  serviceType: BookingServiceType;
  departure: string;
  destination: string;
  travelDate: string; // YYYY-MM-DD
  travelTime: string; // HH:mm
  returnDate?: string; // YYYY-MM-DD (for round trip)
  isRoundTrip?: boolean;
  passengerCount: number;
  pickupAddress: string;
  dropoffAddress: string;
  vehicleType?: string;
  vehicleId?: string;
  driverId?: string;
  tripId?: string;
  price: number; // VNĐ
  deposit: number; // VNĐ
  paymentStatus: BookingPaymentStatus;
  bookingStatus: BookingStatus;
  note?: string;

  // Type-specific details
  cargoDetails?: CargoDetails;
  contractDetails?: ContractVehicleDetails;
  tourDetails?: TourBookingDetails;

  // Metadata
  statusHistory: BookingStatusHistoryItem[];
  feedbackSent?: boolean;
  feedbackAvailableAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  completedAt?: string; // ISO string
}

export interface CreateBookingDTO {
  serviceType: BookingServiceType;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  departure: string;
  destination: string;
  travelDate: string;
  travelTime: string;
  returnDate?: string;
  isRoundTrip?: boolean;
  passengerCount?: number;
  pickupAddress: string;
  dropoffAddress: string;
  vehicleType?: string;
  note?: string;
  cargoDetails?: CargoDetails;
  contractDetails?: ContractVehicleDetails;
  tourDetails?: TourBookingDetails;
  idempotencyKey: string;
}

export type VehicleStatus = 'AVAILABLE' | 'ASSIGNED' | 'IN_SERVICE' | 'MAINTENANCE' | 'INACTIVE';

export interface Vehicle {
  id: string;
  name: string;
  licensePlate: string;
  seatCount: 5 | 7 | 11 | 16 | 29;
  vehicleType: string; // e.g. "Limousine DCar President", "Hyundai Solati Limousine"
  status: VehicleStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type DriverStatus = 'AVAILABLE' | 'ACTIVE' | 'ASSIGNED' | 'ON_TRIP' | 'OFF' | 'OFF_DUTY' | 'INACTIVE';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  vehicleId?: string;
  status: DriverStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Route {
  id: string;
  departure: string;
  destination: string;
  distanceKm?: number;
  estimatedDurationHours?: number;
  basePrice: number; // Giá vé tham khảo VNĐ
  active: boolean;
  scheduleDescription?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export type TripStatus =
  | 'PLANNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'CONFIRMED'
  | 'DEPARTED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Trip {
  id: string;
  routeId: string;
  route?: string; // Tên tuyến đường hiển thị nhanh (vd: Quảng Ninh - Ninh Bình)
  vehicleId?: string;
  driverId?: string;
  departureDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm
  arrivalTime?: string;
  departureAt?: string; // ISO datetime or formatted time
  estimatedArrivalAt?: string; // ISO datetime or formatted time
  status: TripStatus;
  bookingIds: string[];
  maxSeats: number;
  bookedSeats: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

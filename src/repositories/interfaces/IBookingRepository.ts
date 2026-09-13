import { Booking, BookingFilter } from '@/types/booking';

export type { BookingFilter };

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByCode(code: string): Promise<Booking | null>;
  findByCodeAndPhone(code: string, phone: string): Promise<Booking | null>;
  findByCustomerId(customerId: string): Promise<Booking[]>;
  update(id: string, updates: Partial<Booking>): Promise<Booking>;
  list(filter?: BookingFilter): Promise<Booking[]>;
  getNextSequenceForDate(dateStr: string): Promise<number>;
}

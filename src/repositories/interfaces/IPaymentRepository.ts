import { Payment, PaymentStatus } from '@/types/payment';

export interface IPaymentRepository {
  createPayment(payment: Payment): Promise<Payment>;
  getPaymentById(id: string): Promise<Payment | null>;
  getPaymentByBookingId(bookingId: string): Promise<Payment | null>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment>;
  listPayments(filters?: { status?: PaymentStatus; bookingCode?: string }, limit?: number): Promise<Payment[]>;
}

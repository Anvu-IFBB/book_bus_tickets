import { IPaymentRepository } from '../interfaces/IPaymentRepository';
import { Payment, PaymentStatus } from '@/types/payment';

class MemoryPaymentRepository implements IPaymentRepository {
  private payments: Payment[] = [];

  async createPayment(payment: Payment): Promise<Payment> {
    this.payments.push(payment);
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.payments.find((p) => p.id === id) || null;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    return this.payments.find((p) => p.bookingId === bookingId) || null;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const idx = this.payments.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Payment with id ${id} not found`);
    
    this.payments[idx] = { ...this.payments[idx], ...updates, updatedAt: new Date().toISOString() };
    return this.payments[idx];
  }

  async listPayments(filters?: { status?: PaymentStatus; bookingCode?: string }, limit: number = 50): Promise<Payment[]> {
    let result = [...this.payments];
    
    if (filters?.status) {
      result = result.filter((p) => p.status === filters.status);
    }
    if (filters?.bookingCode) {
      const q = filters.bookingCode.toLowerCase();
      result = result.filter((p) => p.bookingCode.toLowerCase().includes(q));
    }
    
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result.slice(0, limit);
  }
}

// Singleton instance
let instance: MemoryPaymentRepository | null = null;
export function getMemoryPaymentRepository(): IPaymentRepository {
  if (!instance) {
    instance = new MemoryPaymentRepository();
  }
  return instance;
}

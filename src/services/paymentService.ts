import { getPaymentRepository, getBookingRepository, getSettingsRepository } from '@/repositories';
import { Payment, PaymentStatus } from '@/types/payment';
import { Booking } from '@/types/booking';

function generateId(): string {
  return 'PAY' + Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

export const paymentService = {
  async createPaymentRequest(booking: Booking, actorEmail: string = 'SYSTEM'): Promise<Payment> {
    const paymentRepo = getPaymentRepository();
    
    // Check if one already exists
    const existing = await paymentRepo.getPaymentByBookingId(booking.id);
    if (existing) return existing;

    const newPayment: Payment = {
      id: generateId(),
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      totalAmount: booking.price,
      depositAmount: booking.deposit,
      paidAmount: 0,
      remainingAmount: booking.price,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = await paymentRepo.createPayment(newPayment);

    // Audit
    await getSettingsRepository().createAuditLog({
      id: 'AUD' + Date.now(),
      userId: actorEmail,
      userEmail: actorEmail,
      action: 'PAYMENT_CREATED',
      entityType: 'PAYMENT',
      entityId: saved.id,
      toState: 'PENDING',
      createdAt: new Date().toISOString()
    });

    return saved;
  },

  async confirmDeposit(paymentId: string, actorEmail: string, actorRole: string, transactionCode?: string): Promise<Payment> {
    const paymentRepo = getPaymentRepository();
    const payment = await paymentRepo.getPaymentById(paymentId);
    if (!payment) throw new Error('Payment not found');
    
    if (payment.status !== 'PENDING' && payment.status !== 'FAILED') {
      throw new Error(`Cannot confirm deposit from status: ${payment.status}`);
    }

    const updates: Partial<Payment> = {
      status: 'DEPOSITED',
      paidAmount: payment.depositAmount,
      remainingAmount: payment.totalAmount - payment.depositAmount,
      confirmedBy: actorEmail,
      confirmedByRole: actorRole,
      paidAt: new Date().toISOString()
    };
    if (transactionCode) updates.transactionCode = transactionCode;

    const updated = await paymentRepo.updatePayment(paymentId, updates);
    
    // Update booking
    const bookingRepo = getBookingRepository();
    await bookingRepo.update(payment.bookingId, { paymentStatus: 'DEPOSIT_PAID' });

    // Audit
    await getSettingsRepository().createAuditLog({
      id: 'AUD' + Date.now(),
      userId: actorEmail,
      userEmail: actorEmail,
      actorRole,
      action: 'PAYMENT_DEPOSIT_CONFIRMED',
      entityType: 'PAYMENT',
      entityId: paymentId,
      fromState: payment.status,
      toState: 'DEPOSITED',
      createdAt: new Date().toISOString()
    });

    return updated;
  },

  async confirmPayment(paymentId: string, actorEmail: string, actorRole: string, transactionCode?: string): Promise<Payment> {
    const paymentRepo = getPaymentRepository();
    const payment = await paymentRepo.getPaymentById(paymentId);
    if (!payment) throw new Error('Payment not found');
    
    if (payment.status !== 'PENDING' && payment.status !== 'DEPOSITED' && payment.status !== 'FAILED') {
      throw new Error(`Cannot confirm full payment from status: ${payment.status}`);
    }

    const updates: Partial<Payment> = {
      status: 'PAID',
      paidAmount: payment.totalAmount,
      remainingAmount: 0,
      confirmedBy: actorEmail,
      confirmedByRole: actorRole,
      paidAt: new Date().toISOString()
    };
    if (transactionCode) updates.transactionCode = transactionCode;

    const updated = await paymentRepo.updatePayment(paymentId, updates);
    
    // Update booking
    const bookingRepo = getBookingRepository();
    await bookingRepo.update(payment.bookingId, { paymentStatus: 'PAID' });

    // Audit
    await getSettingsRepository().createAuditLog({
      id: 'AUD' + Date.now(),
      userId: actorEmail,
      userEmail: actorEmail,
      actorRole,
      action: 'PAYMENT_FULL_CONFIRMED',
      entityType: 'PAYMENT',
      entityId: paymentId,
      fromState: payment.status,
      toState: 'PAID',
      createdAt: new Date().toISOString()
    });

    return updated;
  },

  async refundPayment(paymentId: string, actorEmail: string, actorRole: string, note?: string): Promise<Payment> {
    const paymentRepo = getPaymentRepository();
    const payment = await paymentRepo.getPaymentById(paymentId);
    if (!payment) throw new Error('Payment not found');
    
    if (payment.status !== 'PAID' && payment.status !== 'DEPOSITED') {
      throw new Error(`Cannot refund from status: ${payment.status}`);
    }

    const updates: Partial<Payment> = {
      status: 'REFUNDED',
      paidAmount: 0,
      remainingAmount: payment.totalAmount,
      confirmedBy: actorEmail,
      confirmedByRole: actorRole
    };
    if (note) updates.note = note;

    const updated = await paymentRepo.updatePayment(paymentId, updates);
    
    // Update booking
    const bookingRepo = getBookingRepository();
    await bookingRepo.update(payment.bookingId, { paymentStatus: 'REFUNDED' });

    // Audit
    await getSettingsRepository().createAuditLog({
      id: 'AUD' + Date.now(),
      userId: actorEmail,
      userEmail: actorEmail,
      actorRole,
      action: 'PAYMENT_REFUNDED',
      entityType: 'PAYMENT',
      entityId: paymentId,
      fromState: payment.status,
      toState: 'REFUNDED',
      createdAt: new Date().toISOString()
    });

    return updated;
  },

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const paymentRepo = getPaymentRepository();
    return paymentRepo.getPaymentByBookingId(bookingId);
  },

  async listPayments(filters?: { status?: PaymentStatus; bookingCode?: string }, limit: number = 50): Promise<Payment[]> {
    const paymentRepo = getPaymentRepository();
    return paymentRepo.listPayments(filters, limit);
  },
  
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    const paymentRepo = getPaymentRepository();
    return paymentRepo.getPaymentById(paymentId);
  }
};

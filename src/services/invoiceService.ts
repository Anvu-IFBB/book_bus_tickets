import { getInvoiceRepository, getPaymentRepository, getBookingRepository, getSettingsRepository } from '@/repositories';
import { Invoice } from '@/types/invoice';

function generateInvoiceId(): string {
  return 'INV' + Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

export const invoiceService = {
  async generateInvoice(paymentId: string, actorEmail: string, actorRole: string): Promise<Invoice> {
    const paymentRepo = getPaymentRepository();
    const payment = await paymentRepo.getPaymentById(paymentId);
    if (!payment) throw new Error('Payment not found');
    
    if (payment.status !== 'PAID' && payment.status !== 'DEPOSITED') {
      throw new Error('Invoice can only be generated for PAID or DEPOSITED payments');
    }

    const bookingRepo = getBookingRepository();
    const booking = await bookingRepo.findById(payment.bookingId);
    if (!booking) throw new Error('Booking not found');

    const customerRepo = (await import('@/repositories')).getCustomerRepository();
    const customer = await customerRepo.findById(booking.customerId);

    const invoiceRepo = getInvoiceRepository();
    
    // Check if invoice already exists
    const existing = await invoiceRepo.getInvoiceByBookingId(payment.bookingId);
    if (existing) return existing;

    const newInvoice: Invoice = {
      id: generateInvoiceId(),
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      paymentId: payment.id,
      customerName: customer ? customer.name : 'Khách Hàng',
      customerPhone: customer ? customer.phone : '',
      customerEmail: customer?.email,
      service: booking.serviceType,
      route: `${booking.departure} - ${booking.destination}`,
      subtotal: booking.price,
      deposit: payment.depositAmount,
      paid: payment.paidAmount,
      remaining: payment.remainingAmount,
      total: payment.totalAmount,
      issuedAt: new Date().toISOString(),
      issuedBy: actorEmail,
      issuedByRole: actorRole
    };

    const saved = await invoiceRepo.createInvoice(newInvoice);

    // Audit
    await getSettingsRepository().createAuditLog({
      id: 'AUD' + Date.now(),
      userId: actorEmail,
      userEmail: actorEmail,
      actorRole,
      action: 'INVOICE_GENERATED',
      entityType: 'PAYMENT', // Or Invoice
      entityId: saved.id,
      createdAt: new Date().toISOString()
    });

    return saved;
  },

  async getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
    const invoiceRepo = getInvoiceRepository();
    return invoiceRepo.getInvoiceByBookingId(bookingId);
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const invoiceRepo = getInvoiceRepository();
    return invoiceRepo.getInvoiceById(id);
  }
};

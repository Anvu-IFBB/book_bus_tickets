
'use server';

import { getActiveRepositoryMode } from '@/repositories';
import { invoiceService } from '@/services/invoiceService';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Invoice } from '@/types/invoice';
import { Payment } from '@/types/payment';
import { Booking } from '@/types/booking';
import { Customer } from '@/types/customer';
import { z } from 'zod';
import { handleActionError } from '@/lib/server/action-error';
const generateInvoiceSchema = z.object({
  paymentId: z.string().min(1),
});

function generateInvoiceId(): string {
  return 'INV' + Date.now().toString() + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
}

export async function generateInvoiceAction(paymentId: string): Promise<{ success: boolean; data?: Invoice; error?: string }> {
  try {
    const parsed = generateInvoiceSchema.safeParse({ paymentId });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const user = await requirePermission(Permissions.canManageInvoices);

    if (getActiveRepositoryMode() === 'memory') {
      const generated = await invoiceService.generateInvoice(paymentId, user.email, user.role);
      return { success: true, data: generated };
    }

    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');

    const result = await db.runTransaction(async (transaction) => {
      // Get Payment
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) throw new Error('Payment not found');
      const payment = paymentDoc.data() as Payment;

      if (payment.status !== 'PAID' && payment.status !== 'DEPOSITED') {
        throw new Error('Invoice can only be generated for PAID or DEPOSITED payments');
      }

      // Check existing invoice
      const invoiceQuery = await transaction.get(db.collection('invoices').where('bookingId', '==', payment.bookingId).limit(1));
      if (!invoiceQuery.empty) {
        return invoiceQuery.docs[0].data() as Invoice;
      }

      // Get Booking
      const bookingRef = db.collection('bookings').doc(payment.bookingId);
      const bookingDoc = await transaction.get(bookingRef);
      if (!bookingDoc.exists) throw new Error('Booking not found');
      const booking = bookingDoc.data() as Booking;

      // Get Customer
      let customerName = 'Khách Hàng';
      let customerPhone = '';
      let customerEmail = undefined;

      if (booking.customerId) {
        const customerRef = db.collection('customers').doc(booking.customerId);
        const customerDoc = await transaction.get(customerRef);
        if (customerDoc.exists) {
          const customer = customerDoc.data() as Customer;
          customerName = customer.name;
          customerPhone = customer.phone;
          customerEmail = customer.email;
        }
      }

      const nowIso = new Date().toISOString();
      const invoiceId = generateInvoiceId();
      const invoiceRef = db.collection('invoices').doc(invoiceId);

      const newInvoice: Invoice = {
        id: invoiceId,
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        paymentId: payment.id,
        customerName,
        customerPhone,
        customerEmail,
        service: booking.serviceType,
        route: `${booking.departure} - ${booking.destination}`,
        subtotal: booking.price,
        deposit: payment.depositAmount,
        paid: payment.paidAmount,
        remaining: payment.remainingAmount,
        total: payment.totalAmount,
        issuedAt: nowIso,
        issuedBy: user.email,
        issuedByRole: user.role,
      };

      transaction.set(invoiceRef, newInvoice);

      // Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'INVOICE_GENERATED',
        entityType: 'INVOICE',
        entityId: invoiceId,
        createdAt: nowIso,
      });

      return newInvoice;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'generateInvoiceAction');
  }
}

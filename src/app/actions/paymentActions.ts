
'use server';

import { getActiveRepositoryMode } from '@/repositories';
import { paymentService } from '@/services/paymentService';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Payment } from '@/types/payment';
import { z } from 'zod';
import { handleActionError } from '@/lib/server/action-error';

const paymentActionSchema = z.object({
  paymentId: z.string().min(1),
  transactionCode: z.string().optional(),
  note: z.string().optional(),
});

export async function confirmDepositAction(paymentId: string, transactionCode?: string): Promise<{ success: boolean; data?: Payment; error?: string }> {
  try {
    const parsed = paymentActionSchema.safeParse({ paymentId, transactionCode });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };
    
    const user = await requirePermission(Permissions.canManagePayments);

    if (getActiveRepositoryMode() === 'memory') {
      const updated = await paymentService.confirmDeposit(paymentId, user.email, user.role, transactionCode);
      return { success: true, data: updated };
    }

    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');

    const result = await db.runTransaction(async (transaction) => {
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) throw new Error('Payment not found');
      
      const payment = paymentDoc.data() as Payment;

      if (payment.status !== 'PENDING' && payment.status !== 'FAILED') {
        throw new Error(`Không thể xác nhận cọc từ trạng thái: ${payment.status}`);
      }

      const nowIso = new Date().toISOString();
      const depositAmt = payment.depositAmount || 0;

      const updates: Partial<Payment> = {
        status: 'DEPOSITED',
        paidAmount: depositAmt,
        remainingAmount: payment.totalAmount - depositAmt,
        confirmedBy: user.email,
        confirmedByRole: user.role,
        paidAt: nowIso,
        updatedAt: nowIso,
      };
      if (transactionCode) updates.transactionCode = transactionCode;

      transaction.update(paymentRef, updates);

      // Cập nhật booking
      const bookingRef = db.collection('bookings').doc(payment.bookingId);
      transaction.update(bookingRef, { paymentStatus: 'DEPOSIT_PAID', updatedAt: nowIso });

      // Ghi Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'PAYMENT_DEPOSIT_CONFIRMED',
        entityType: 'PAYMENT',
        entityId: paymentId,
        fromState: payment.status,
        toState: 'DEPOSITED',
        createdAt: nowIso,
      });

      return { ...payment, ...updates } as Payment;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'confirmDepositAction');
  }
}

export async function confirmPaymentAction(paymentId: string, transactionCode?: string): Promise<{ success: boolean; data?: Payment; error?: string }> {
  try {
    const parsed = paymentActionSchema.safeParse({ paymentId, transactionCode });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const user = await requirePermission(Permissions.canManagePayments);

    if (getActiveRepositoryMode() === 'memory') {
      const updated = await paymentService.confirmPayment(paymentId, user.email, user.role, transactionCode);
      return { success: true, data: updated };
    }

    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');

    const result = await db.runTransaction(async (transaction) => {
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) throw new Error('Payment not found');
      
      const payment = paymentDoc.data() as Payment;

      if (payment.status !== 'PENDING' && payment.status !== 'DEPOSITED' && payment.status !== 'FAILED') {
        throw new Error(`Không thể xác nhận thanh toán từ trạng thái: ${payment.status}`);
      }

      const nowIso = new Date().toISOString();

      const updates: Partial<Payment> = {
        status: 'PAID',
        paidAmount: payment.totalAmount,
        remainingAmount: 0,
        confirmedBy: user.email,
        confirmedByRole: user.role,
        paidAt: nowIso,
        updatedAt: nowIso,
      };
      if (transactionCode) updates.transactionCode = transactionCode;

      transaction.update(paymentRef, updates);

      // Cập nhật booking
      const bookingRef = db.collection('bookings').doc(payment.bookingId);
      transaction.update(bookingRef, { paymentStatus: 'PAID', updatedAt: nowIso });

      // Ghi Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'PAYMENT_FULL_CONFIRMED',
        entityType: 'PAYMENT',
        entityId: paymentId,
        fromState: payment.status,
        toState: 'PAID',
        createdAt: nowIso,
      });

      return { ...payment, ...updates } as Payment;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'confirmPaymentAction');
  }
}

export async function refundPaymentAction(paymentId: string, note?: string): Promise<{ success: boolean; data?: Payment; error?: string }> {
  try {
    const parsed = paymentActionSchema.safeParse({ paymentId, note });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const user = await requirePermission(Permissions.canManagePayments);

    if (getActiveRepositoryMode() === 'memory') {
      const updated = await paymentService.refundPayment(paymentId, user.email, user.role, note);
      return { success: true, data: updated };
    }

    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');

    const result = await db.runTransaction(async (transaction) => {
      const paymentRef = db.collection('payments').doc(paymentId);
      const paymentDoc = await transaction.get(paymentRef);
      if (!paymentDoc.exists) throw new Error('Payment not found');
      
      const payment = paymentDoc.data() as Payment;

      if (payment.status !== 'PAID' && payment.status !== 'DEPOSITED') {
        throw new Error(`Không thể hoàn tiền từ trạng thái: ${payment.status}`);
      }

      const nowIso = new Date().toISOString();

      const updates: Partial<Payment> = {
        status: 'REFUNDED',
        paidAmount: 0,
        remainingAmount: payment.totalAmount, // Hoàn lại thì còn nợ toàn bộ
        confirmedBy: user.email,
        confirmedByRole: user.role,
        updatedAt: nowIso,
      };

      transaction.update(paymentRef, updates);

      // Cập nhật booking
      const bookingRef = db.collection('bookings').doc(payment.bookingId);
      transaction.update(bookingRef, { paymentStatus: 'REFUNDED', updatedAt: nowIso });

      // Ghi Audit Log
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'PAYMENT_REFUNDED',
        entityType: 'PAYMENT',
        entityId: paymentId,
        fromState: payment.status,
        toState: 'REFUNDED',
        metadata: { note: note || 'Hoàn tiền' },
        createdAt: nowIso,
      });

      return { ...payment, ...updates } as Payment;
    });

    return { success: true, data: result };
  } catch (error: unknown) {
    return handleActionError(error, 'refundPaymentAction');
  }
}

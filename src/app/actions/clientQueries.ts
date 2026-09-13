'use server';

import { paymentService } from '@/services/paymentService';
import { getSettingsRepository } from '@/repositories';
import { handleActionError } from '@/lib/server/action-error';

export interface PublicPaymentSummary {
  totalAmount: number;
  depositAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
}

export async function getPaymentByBookingIdAction(bookingId: string): Promise<{ success: boolean; data?: PublicPaymentSummary; error?: string }> {
  try {
    const payment = await paymentService.getPaymentByBookingId(bookingId);
    if (!payment) {
      return { success: false, error: 'Không tìm thấy thông tin thanh toán' };
    }
    
    // EXPLICIT MAPPING (Whitelist) - Prevent Data Leakage
    const publicPayment: PublicPaymentSummary = {
      totalAmount: payment.totalAmount,
      depositAmount: payment.depositAmount,
      paidAmount: payment.paidAmount,
      remainingAmount: payment.remainingAmount,
      status: payment.status,
    };

    return { success: true, data: publicPayment };
  } catch (error) {
    return handleActionError(error, 'getPaymentByBookingIdAction');
  }
}

export async function getSystemSettingsAction() {
  try {
    const settings = await getSettingsRepository().getSettings();
    return { success: true, data: settings };
  } catch (error) {
    return handleActionError(error, 'getSystemSettingsAction');
  }
}

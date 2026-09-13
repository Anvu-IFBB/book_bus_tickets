'use server';

import { paymentService } from '@/services/paymentService';

export async function getPaymentByIdAction(id: string) {
  return paymentService.getPaymentById(id);
}

export async function listPaymentsAction() {
  return paymentService.listPayments();
}

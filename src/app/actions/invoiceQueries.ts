'use server';

import { invoiceService } from '@/services/invoiceService';

export async function getInvoiceByIdAction(id: string) {
  return invoiceService.getInvoiceById(id);
}

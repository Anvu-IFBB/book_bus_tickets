import { Invoice } from '@/types/invoice';

export interface IInvoiceRepository {
  createInvoice(invoice: Invoice): Promise<Invoice>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  getInvoiceByBookingId(bookingId: string): Promise<Invoice | null>;
  listInvoices(filters?: { bookingCode?: string }, limit?: number): Promise<Invoice[]>;
}

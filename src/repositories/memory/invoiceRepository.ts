import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';
import { Invoice } from '@/types/invoice';

class MemoryInvoiceRepository implements IInvoiceRepository {
  private invoices: Invoice[] = [];

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    this.invoices.push(invoice);
    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    return this.invoices.find((inv) => inv.id === id) || null;
  }

  async getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
    return this.invoices.find((inv) => inv.bookingId === bookingId) || null;
  }

  async listInvoices(filters?: { bookingCode?: string }, limit: number = 50): Promise<Invoice[]> {
    let result = [...this.invoices];
    
    if (filters?.bookingCode) {
      const q = filters.bookingCode.toLowerCase();
      result = result.filter((inv) => inv.bookingCode.toLowerCase().includes(q));
    }
    
    result.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    return result.slice(0, limit);
  }
}

let instance: MemoryInvoiceRepository | null = null;
export function getMemoryInvoiceRepository(): IInvoiceRepository {
  if (!instance) {
    instance = new MemoryInvoiceRepository();
  }
  return instance;
}

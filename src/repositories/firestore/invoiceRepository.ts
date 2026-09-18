import { Firestore } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';
import { Invoice } from '@/types/invoice';

export class FirestoreInvoiceRepository implements IInvoiceRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firestore is not initialized');
    return firestore;
  }

  private collectionName = 'invoices';

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const docRef = this.db.collection(this.collectionName).doc(invoice.id);
    await docRef.set(invoice);
    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return snap.data() as Invoice;
  }

  async getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
    const q = this.db.collection(this.collectionName)
      .where('bookingId', '==', bookingId)
      .limit(1);
    const snap = await q.get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Invoice;
  }

  async listInvoices(filters?: { bookingCode?: string }, limit: number = 50): Promise<Invoice[]> {
    let q: FirebaseFirestore.Query = this.db.collection(this.collectionName);
    
    if (filters?.bookingCode) {
      q = q.where('bookingCode', '==', filters.bookingCode);
    }
    
    q = q.orderBy('issuedAt', 'desc').limit(limit);
    
    const snap = await q.get();
    
    return snap.docs.map(doc => doc.data() as Invoice);
  }
}

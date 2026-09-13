import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy, limit as firestoreLimit, Firestore, QueryConstraint } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { IInvoiceRepository } from '../interfaces/IInvoiceRepository';
import { Invoice } from '@/types/invoice';

export class FirestoreInvoiceRepository implements IInvoiceRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) throw new Error('Firestore is not initialized');
    return firestore;
  }

  private collectionName = 'invoices';

  async createInvoice(invoice: Invoice): Promise<Invoice> {
    const docRef = doc(this.db, this.collectionName, invoice.id);
    await setDoc(docRef, invoice);
    return invoice;
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Invoice;
  }

  async getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
    const q = query(
      collection(this.db, this.collectionName),
      where('bookingId', '==', bookingId),
      firestoreLimit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Invoice;
  }

  async listInvoices(filters?: { bookingCode?: string }, limit: number = 50): Promise<Invoice[]> {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.bookingCode) {
      constraints.push(where('bookingCode', '==', filters.bookingCode));
    }
    
    constraints.push(orderBy('issuedAt', 'desc'));
    constraints.push(firestoreLimit(limit));
    
    const q = query(collection(this.db, this.collectionName), ...constraints);
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => doc.data() as Invoice);
  }
}

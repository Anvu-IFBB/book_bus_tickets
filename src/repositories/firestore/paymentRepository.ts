import { Firestore } from 'firebase-admin/firestore';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { IPaymentRepository } from '../interfaces/IPaymentRepository';
import { Payment, PaymentStatus } from '@/types/payment';

export class FirestorePaymentRepository implements IPaymentRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firestore is not initialized');
    return firestore;
  }

  private collectionName = 'payments';

  async createPayment(payment: Payment): Promise<Payment> {
    const docRef = this.db.collection(this.collectionName).doc(payment.id);
    await docRef.set(payment);
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return snap.data() as Payment;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const q = this.db.collection(this.collectionName)
      .where('bookingId', '==', bookingId)
      .limit(1);
    const snap = await q.get();
    if (snap.empty) return null;
    return snap.docs[0].data() as Payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const finalUpdates = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await docRef.update(finalUpdates);
    
    // Fetch updated
    const snap = await docRef.get();
    return snap.data() as Payment;
  }

  async listPayments(filters?: { status?: PaymentStatus; bookingCode?: string }, limit: number = 50): Promise<Payment[]> {
    let q: FirebaseFirestore.Query = this.db.collection(this.collectionName);
    
    if (filters?.status) {
      q = q.where('status', '==', filters.status);
    }
    if (filters?.bookingCode) {
      q = q.where('bookingCode', '==', filters.bookingCode);
    }
    
    q = q.orderBy('createdAt', 'desc').limit(limit);
    
    const snap = await q.get();
    
    return snap.docs.map(doc => doc.data() as Payment);
  }
}

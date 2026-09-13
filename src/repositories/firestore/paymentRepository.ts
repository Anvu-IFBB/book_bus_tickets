import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where, orderBy, limit as firestoreLimit, Firestore, QueryConstraint } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { IPaymentRepository } from '../interfaces/IPaymentRepository';
import { Payment, PaymentStatus } from '@/types/payment';

export class FirestorePaymentRepository implements IPaymentRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) throw new Error('Firestore is not initialized');
    return firestore;
  }

  private collectionName = 'payments';

  async createPayment(payment: Payment): Promise<Payment> {
    const docRef = doc(this.db, this.collectionName, payment.id);
    await setDoc(docRef, payment);
    return payment;
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Payment;
  }

  async getPaymentByBookingId(bookingId: string): Promise<Payment | null> {
    const q = query(
      collection(this.db, this.collectionName),
      where('bookingId', '==', bookingId),
      firestoreLimit(1)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs[0].data() as Payment;
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const docRef = doc(this.db, this.collectionName, id);
    const finalUpdates = {
      ...updates,
      updatedAt: new Date().toISOString()
    };
    await updateDoc(docRef, finalUpdates);
    
    // Fetch updated
    const snap = await getDoc(docRef);
    return snap.data() as Payment;
  }

  async listPayments(filters?: { status?: PaymentStatus; bookingCode?: string }, limit: number = 50): Promise<Payment[]> {
    const constraints: QueryConstraint[] = [];
    
    if (filters?.status) {
      constraints.push(where('status', '==', filters.status));
    }
    if (filters?.bookingCode) {
      constraints.push(where('bookingCode', '==', filters.bookingCode));
    }
    
    constraints.push(orderBy('createdAt', 'desc'));
    constraints.push(firestoreLimit(limit));
    
    const q = query(collection(this.db, this.collectionName), ...constraints);
    const snap = await getDocs(q);
    
    return snap.docs.map(doc => doc.data() as Payment);
  }
}

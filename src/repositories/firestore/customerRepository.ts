import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  increment,
  Firestore,
} from 'firebase/firestore';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { Customer } from '@/types/customer';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreCustomerRepository implements ICustomerRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return firestore;
  }

  private get collectionRef() {
    return collection(this.db, 'customers');
  }

  async findById(id: string): Promise<Customer | null> {
    const docRef = doc(this.db, 'customers', id);
    const snap = await getDoc(docRef);
    return docToEntity<Customer>(snap);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const q = query(this.collectionRef, where('phone', '==', phone.trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return docToEntity<Customer>(snap.docs[0]);
  }

  async create(customer: Customer): Promise<Customer> {
    const docRef = doc(this.db, 'customers', customer.id);
    const cleaned = cleanUndefined(customer as unknown as Record<string, unknown>);
    await setDoc(docRef, cleaned);
    return customer;
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const docRef = doc(this.db, 'customers', id);
    const cleaned = cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>);

    await updateDoc(docRef, cleaned);
    const updated = await getDoc(docRef);
    const entity = docToEntity<Customer>(updated);
    if (!entity) {
      throw new Error(`Customer ${id} not found after update`);
    }
    return entity;
  }

  async list(search?: string): Promise<Customer[]> {
    const snap = await getDocs(this.collectionRef);
    let results = snap.docs.map((d) => docToEntity<Customer>(d)!);

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }

    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async incrementStats(
    id: string,
    bookingCountDelta: number,
    completedDelta: number,
    cancelledDelta: number,
    spentDelta: number
  ): Promise<Customer> {
    const docRef = doc(this.db, 'customers', id);
    await updateDoc(docRef, {
      totalBookings: increment(bookingCountDelta),
      completedBookings: increment(completedDelta),
      cancelledBookings: increment(cancelledDelta),
      totalSpent: increment(spentDelta),
      updatedAt: new Date().toISOString(),
    });

    const updated = await getDoc(docRef);
    const entity = docToEntity<Customer>(updated);
    if (!entity) {
      throw new Error(`Customer ${id} not found`);
    }
    return entity;
  }
}

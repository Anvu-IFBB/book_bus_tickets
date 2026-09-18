/* eslint-disable @typescript-eslint/no-explicit-any */
import { Firestore, FieldValue } from 'firebase-admin/firestore';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { Customer } from '@/types/customer';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreCustomerRepository implements ICustomerRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) {
      throw new Error('Firebase Admin Firestore is not initialized.');
    }
    return firestore;
  }

  private get collectionRef() {
    return this.db.collection('customers');
  }

  async findById(id: string): Promise<Customer | null> {
    const docRef = this.collectionRef.doc(id);
    const snap = await docRef.get();
    return docToEntity<Customer>(snap as any);
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const q = this.collectionRef.where('phone', '==', phone.trim());
    const snap = await q.get();
    if (snap.empty) return null;
    return docToEntity<Customer>(snap.docs[0] as any);
  }

  async create(customer: Customer): Promise<Customer> {
    const docRef = this.collectionRef.doc(customer.id);
    const cleaned = cleanUndefined(customer as unknown as Record<string, unknown>);
    await docRef.set(cleaned);
    return customer;
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const docRef = this.collectionRef.doc(id);
    const cleaned = cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>);

    await docRef.update(cleaned);
    const updated = await docRef.get();
    const entity = docToEntity<Customer>(updated as any);
    if (!entity) {
      throw new Error(`Customer ${id} not found after update`);
    }
    return entity;
  }

  async list(search?: string): Promise<Customer[]> {
    const snap = await this.collectionRef.get();
    let results = snap.docs.map((d) => docToEntity<Customer>(d as any)!);

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
    const docRef = this.collectionRef.doc(id);
    await docRef.update({
      totalBookings: FieldValue.increment(bookingCountDelta),
      completedBookings: FieldValue.increment(completedDelta),
      cancelledBookings: FieldValue.increment(cancelledDelta),
      totalSpent: FieldValue.increment(spentDelta),
      updatedAt: new Date().toISOString(),
    });

    const updated = await docRef.get();
    const entity = docToEntity<Customer>(updated as any);
    if (!entity) {
      throw new Error(`Customer ${id} not found`);
    }
    return entity;
  }
}

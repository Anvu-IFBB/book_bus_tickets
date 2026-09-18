/* eslint-disable @typescript-eslint/no-explicit-any */
import { Firestore } from 'firebase-admin/firestore';
import { IBookingRepository, BookingFilter } from '../interfaces/IBookingRepository';
import { Booking } from '@/types/booking';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreBookingRepository implements IBookingRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) {
      throw new Error('Firebase Admin Firestore is not initialized. Check your environment variables.');
    }
    return firestore;
  }

  private get collectionRef() {
    return this.db.collection('bookings');
  }

  async create(booking: Booking): Promise<Booking> {
    const docRef = this.collectionRef.doc(booking.id);
    const cleaned = cleanUndefined(booking as unknown as Record<string, unknown>);
    await docRef.set(cleaned);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const docRef = this.collectionRef.doc(id);
    const snap = await docRef.get();
    return docToEntity<Booking>(snap as any);
  }

  async findByCode(code: string): Promise<Booking | null> {
    const q = this.collectionRef.where('bookingCode', '==', code.trim());
    const snap = await q.get();
    if (snap.empty) return null;
    return docToEntity<Booking>(snap.docs[0] as any);
  }

  async findByCodeAndPhone(code: string, phone: string): Promise<Booking | null> {
    const q = this.collectionRef.where('bookingCode', '==', code.trim());
    const snap = await q.get();
    if (snap.empty) return null;

    const matched = snap.docs.find((d) => {
      const data = d.data();
      // Kiá»ƒm tra phone tá»« cargoDetails náº¿u cÃ³, hoáº·c customerId / customerPhone
      const cargoSenderPhone = data.cargoDetails?.senderPhone;
      const cargoReceiverPhone = data.cargoDetails?.receiverPhone;
      return (
        cargoSenderPhone === phone ||
        cargoReceiverPhone === phone ||
        data.customerPhone === phone
      );
    });

    if (matched) {
      return docToEntity<Booking>(matched as any);
    }

    // Náº¿u khÃ´ng khá»›p trá»±c tiáº¿p, tráº£ vá»  entity Ä‘áº§u tiÃªn Ä‘á»ƒ Service xÃ¡c thá»±c vá»›i customer repo
    return docToEntity<Booking>(snap.docs[0] as any);
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    const q = this.collectionRef.where('customerId', '==', customerId);
    const snap = await q.get();
    return snap.docs.map((d) => docToEntity<Booking>(d as any)!);
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking> {
    const docRef = this.collectionRef.doc(id);
    const cleaned = cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>);

    await docRef.update(cleaned);
    const updatedSnap = await docRef.get();
    const entity = docToEntity<Booking>(updatedSnap as any);
    if (!entity) {
      throw new Error(`Booking ${id} not found after update`);
    }
    return entity;
  }

  async list(filter?: BookingFilter): Promise<Booking[]> {
    let q: FirebaseFirestore.Query = this.collectionRef;

    if (filter?.status) {
      q = q.where('bookingStatus', '==', filter.status);
    }
    if (filter?.serviceType) {
      q = q.where('serviceType', '==', filter.serviceType);
    }
    if (filter?.date) {
      q = q.where('travelDate', '==', filter.date);
    }

    const snap = await q.get();
    let results = snap.docs.map((d) => docToEntity<Booking>(d as any)!);

    // Lá» c theo search term náº¿u cÃ³
    if (filter?.search) {
      const s = filter.search.toLowerCase();
      results = results.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(s) ||
          b.departure.toLowerCase().includes(s) ||
          b.destination.toLowerCase().includes(s) ||
          (b.pickupAddress && b.pickupAddress.toLowerCase().includes(s))
      );
    }

    // Sáº¯p xáº¿p theo ngÃ y táº¡o má»›i nháº¥t
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Sinh sá»‘ thá»© tá»± tuáº§n tá»± trong ngÃ y sá»­ dá»¥ng Firestore Atomic Transaction
   */
  async getNextSequenceForDate(dateStr: string): Promise<number> {
    const seqDocRef = this.db.collection('systemSequences').doc(`daily_${dateStr}`);

    return await this.db.runTransaction(async (transaction) => {
      const seqDoc = await transaction.get(seqDocRef);
      if (!seqDoc.exists) {
        transaction.set(seqDocRef, {
          dateStr,
          currentSequence: 1,
          updatedAt: new Date().toISOString(),
        });
        return 1;
      }

      const current = (seqDoc.data()?.currentSequence as number) || 0;
      const next = current + 1;
      transaction.update(seqDocRef, {
        currentSequence: next,
        updatedAt: new Date().toISOString(),
      });
      return next;
    });
  }
}

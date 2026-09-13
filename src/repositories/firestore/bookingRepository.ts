import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  runTransaction,
  Firestore,
} from 'firebase/firestore';
import { IBookingRepository, BookingFilter } from '../interfaces/IBookingRepository';
import { Booking } from '@/types/booking';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreBookingRepository implements IBookingRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not initialized. Check your environment variables.');
    }
    return firestore;
  }

  private get collectionRef() {
    return collection(this.db, 'bookings');
  }

  async create(booking: Booking): Promise<Booking> {
    const docRef = doc(this.db, 'bookings', booking.id);
    const cleaned = cleanUndefined(booking as unknown as Record<string, unknown>);
    await setDoc(docRef, cleaned);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    const docRef = doc(this.db, 'bookings', id);
    const snap = await getDoc(docRef);
    return docToEntity<Booking>(snap);
  }

  async findByCode(code: string): Promise<Booking | null> {
    const q = query(this.collectionRef, where('bookingCode', '==', code.trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return docToEntity<Booking>(snap.docs[0]);
  }

  async findByCodeAndPhone(code: string, phone: string): Promise<Booking | null> {
    const q = query(this.collectionRef, where('bookingCode', '==', code.trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const matched = snap.docs.find((d) => {
      const data = d.data();
      // Kiểm tra phone từ cargoDetails nếu có, hoặc customerId / customerPhone
      const cargoSenderPhone = data.cargoDetails?.senderPhone;
      const cargoReceiverPhone = data.cargoDetails?.receiverPhone;
      return (
        cargoSenderPhone === phone ||
        cargoReceiverPhone === phone ||
        data.customerPhone === phone
      );
    });

    if (matched) {
      return docToEntity<Booking>(matched);
    }

    // Nếu không khớp trực tiếp, trả về entity đầu tiên để Service xác thực với customer repo
    return docToEntity<Booking>(snap.docs[0]);
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    const q = query(this.collectionRef, where('customerId', '==', customerId));
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToEntity<Booking>(d)!);
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking> {
    const docRef = doc(this.db, 'bookings', id);
    const cleaned = cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>);

    await updateDoc(docRef, cleaned);
    const updatedSnap = await getDoc(docRef);
    const entity = docToEntity<Booking>(updatedSnap);
    if (!entity) {
      throw new Error(`Booking ${id} not found after update`);
    }
    return entity;
  }

  async list(filter?: BookingFilter): Promise<Booking[]> {
    let q = query(this.collectionRef);

    if (filter?.status) {
      q = query(q, where('bookingStatus', '==', filter.status));
    }
    if (filter?.serviceType) {
      q = query(q, where('serviceType', '==', filter.serviceType));
    }
    if (filter?.date) {
      q = query(q, where('travelDate', '==', filter.date));
    }

    const snap = await getDocs(q);
    let results = snap.docs.map((d) => docToEntity<Booking>(d)!);

    // Lọc theo search term nếu có
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

    // Sắp xếp theo ngày tạo mới nhất
    return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Sinh số thứ tự tuần tự trong ngày sử dụng Firestore Atomic Transaction
   */
  async getNextSequenceForDate(dateStr: string): Promise<number> {
    const seqDocRef = doc(this.db, 'systemSequences', `daily_${dateStr}`);

    return await runTransaction(this.db, async (transaction) => {
      const seqDoc = await transaction.get(seqDocRef);
      if (!seqDoc.exists()) {
        transaction.set(seqDocRef, {
          dateStr,
          currentSequence: 1,
          updatedAt: new Date().toISOString(),
        });
        return 1;
      }

      const current = (seqDoc.data().currentSequence as number) || 0;
      const next = current + 1;
      transaction.update(seqDocRef, {
        currentSequence: next,
        updatedAt: new Date().toISOString(),
      });
      return next;
    });
  }
}

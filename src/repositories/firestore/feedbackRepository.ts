import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  Firestore,
} from 'firebase/firestore';
import { IFeedbackRepository, FeedbackFilter } from '../interfaces/IFeedbackRepository';
import { Feedback } from '@/types/feedback';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreFeedbackRepository implements IFeedbackRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return firestore;
  }

  private get collectionRef() {
    return collection(this.db, 'feedbacks');
  }

  async create(feedback: Feedback): Promise<Feedback> {
    const docRef = doc(this.db, 'feedbacks', feedback.id);
    await setDoc(docRef, cleanUndefined(feedback as unknown as Record<string, unknown>));
    return feedback;
  }

  async findById(id: string): Promise<Feedback | null> {
    const snap = await getDoc(doc(this.db, 'feedbacks', id));
    return docToEntity<Feedback>(snap);
  }

  async findByBookingCode(code: string): Promise<Feedback | null> {
    const q = query(this.collectionRef, where('bookingCode', '==', code.trim()));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return docToEntity<Feedback>(snap.docs[0]);
  }

  async list(filter?: FeedbackFilter): Promise<Feedback[]> {
    let q = query(this.collectionRef);

    if (filter?.rating !== undefined) {
      q = query(q, where('rating', '==', filter.rating));
    }
    if (filter?.status) {
      q = query(q, where('negativeStatus', '==', filter.status));
    }
    if (filter?.isPublishedTestimonial !== undefined) {
      q = query(q, where('isPublishedTestimonial', '==', filter.isPublishedTestimonial));
    }

    const snap = await getDocs(q);
    const results = snap.docs.map((d) => docToEntity<Feedback>(d)!);
    return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    const docRef = doc(this.db, 'feedbacks', id);
    await updateDoc(docRef, cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>));
    const snap = await getDoc(docRef);
    return docToEntity<Feedback>(snap)!;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Firestore } from 'firebase-admin/firestore';
import { IFeedbackRepository, FeedbackFilter } from '../interfaces/IFeedbackRepository';
import { Feedback } from '@/types/feedback';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreFeedbackRepository implements IFeedbackRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) {
      throw new Error('Firebase Admin Firestore is not initialized.');
    }
    return firestore;
  }

  private get collectionRef() {
    return this.db.collection('feedbacks');
  }

  async create(feedback: Feedback): Promise<Feedback> {
    const docRef = this.collectionRef.doc(feedback.id);
    await docRef.set(cleanUndefined(feedback as unknown as Record<string, unknown>));
    return feedback;
  }

  async findById(id: string): Promise<Feedback | null> {
    const snap = await this.collectionRef.doc(id).get();
    return docToEntity<Feedback>(snap as any);
  }

  async findByBookingCode(code: string): Promise<Feedback | null> {
    const q = this.collectionRef.where('bookingCode', '==', code.trim());
    const snap = await q.get();
    if (snap.empty) return null;
    return docToEntity<Feedback>(snap.docs[0] as any);
  }

  async list(filter?: FeedbackFilter): Promise<Feedback[]> {
    let q: FirebaseFirestore.Query = this.collectionRef;

    if (filter?.rating !== undefined) {
      q = q.where('rating', '==', filter.rating);
    }
    if (filter?.status) {
      q = q.where('negativeStatus', '==', filter.status);
    }
    if (filter?.isPublishedTestimonial !== undefined) {
      q = q.where('isPublishedTestimonial', '==', filter.isPublishedTestimonial);
    }

    const snap = await q.get();
    const results = snap.docs.map((d) => docToEntity<Feedback>(d as any)!);
    return results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    const docRef = this.collectionRef.doc(id);
    await docRef.update(cleanUndefined({
      ...updates,
      updatedAt: new Date().toISOString(),
    } as unknown as Record<string, unknown>));
    const snap = await docRef.get();
    return docToEntity<Feedback>(snap as any)!;
  }
}

import { IFeedbackRepository, FeedbackFilter } from '../interfaces/IFeedbackRepository';
import { Feedback } from '@/types/feedback';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { docToEntity } from './helpers';

export class FirestoreFeedbackRepository implements IFeedbackRepository {
  private get collectionRef() {
    return collection(getFirebaseFirestore()!, 'feedbacks');
  }

  async create(feedback: Feedback): Promise<Feedback> {
    const docRef = doc(this.collectionRef, feedback.id);
    await setDoc(docRef, feedback);
    return feedback;
  }

  async findById(id: string): Promise<Feedback | null> {
    const docRef = doc(this.collectionRef, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return docToEntity<Feedback>(snapshot);
  }

  async findByBookingCode(code: string): Promise<Feedback | null> {
    const q = query(this.collectionRef, where('bookingCode', '==', code));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return docToEntity<Feedback>(snapshot.docs[0]);
  }

  async list(filter?: FeedbackFilter): Promise<Feedback[]> {
    const constraints: QueryConstraint[] = [];
    
    if (filter) {
      if (filter.rating) constraints.push(where('rating', '==', filter.rating));
      if (filter.status) constraints.push(where('status', '==', filter.status));
      if (filter.isPublishedTestimonial !== undefined) {
        constraints.push(where('isPublishedTestimonial', '==', filter.isPublishedTestimonial));
      }
    }

    // Always sort by latest
    constraints.push(orderBy('createdAt', 'desc'));
    
    const q = query(this.collectionRef, ...constraints);
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(d => docToEntity<Feedback>(d)) as Feedback[];
  }

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    const docRef = doc(this.collectionRef, id);
    await updateDoc(docRef, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error(`Feedback ${id} not found after update`);
    return updated;
  }
}

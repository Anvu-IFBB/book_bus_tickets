import { IAnalyticsSummaryRepository } from '../interfaces/IAnalyticsSummaryRepository';
import { DailyAnalyticsSummary } from '@/types/analyticsSummary';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';

export class FirestoreAnalyticsSummaryRepository implements IAnalyticsSummaryRepository {
  private get collectionName() {
    return 'analytics_summary';
  }

  async getByDate(dateKey: string): Promise<DailyAnalyticsSummary | null> {
    const db = getFirebaseFirestore();
    if (!db) throw new Error('Firebase Firestore không khả dụng');

    const docRef = doc(db, this.collectionName, dateKey);
    const snap = await getDoc(docRef);
    
    if (snap.exists()) {
      return snap.data() as DailyAnalyticsSummary;
    }
    return null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<DailyAnalyticsSummary[]> {
    const db = getFirebaseFirestore();
    if (!db) throw new Error('Firebase Firestore không khả dụng');

    const ref = collection(db, this.collectionName);
    const q = query(
      ref,
      where('dateKey', '>=', startDate),
      where('dateKey', '<=', endDate)
    );
    
    const snap = await getDocs(q);
    const results = snap.docs.map(d => d.data() as DailyAnalyticsSummary);
    return results.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }

  async upsert(summary: DailyAnalyticsSummary): Promise<void> {
    // Admin SDK is strictly required for writing to bypass `allow write: if false`
    const { getAdminFirestore } = await import('@/lib/firebase/admin');
    const adminDb = getAdminFirestore();
    if (!adminDb) {
      throw new Error('Firebase Admin Firestore is not available for upsert operation.');
    }

    const docRef = adminDb.collection(this.collectionName).doc(summary.dateKey);
    
    const now = new Date().toISOString();
    await adminDb.runTransaction(async (transaction) => {
      const doc = await transaction.get(docRef);
      
      const payload: DailyAnalyticsSummary = {
        ...summary,
        id: summary.dateKey,
        createdAt: doc.exists ? (doc.data() as DailyAnalyticsSummary).createdAt : now,
        updatedAt: now,
      };
      
      transaction.set(docRef, payload, { merge: true });
    });
  }

  async delete(dateKey: string): Promise<void> {
    const { getAdminFirestore } = await import('@/lib/firebase/admin');
    const adminDb = getAdminFirestore();
    if (!adminDb) {
      throw new Error('Firebase Admin Firestore is not available for delete operation.');
    }

    await adminDb.collection(this.collectionName).doc(dateKey).delete();
  }
}

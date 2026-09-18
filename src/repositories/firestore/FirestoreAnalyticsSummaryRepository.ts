import { IAnalyticsSummaryRepository } from '../interfaces/IAnalyticsSummaryRepository';
import { DailyAnalyticsSummary } from '@/types/analyticsSummary';
import { getAdminFirestore } from '@/lib/firebase/admin';

export class FirestoreAnalyticsSummaryRepository implements IAnalyticsSummaryRepository {
  private get collectionName() {
    return 'analytics_summary';
  }

  private get db() {
    const adminDb = getAdminFirestore();
    if (!adminDb) throw new Error('Firebase Admin Firestore is not available.');
    return adminDb;
  }

  async getByDate(dateKey: string): Promise<DailyAnalyticsSummary | null> {
    const docRef = this.db.collection(this.collectionName).doc(dateKey);
    const snap = await docRef.get();
    
    if (snap.exists) {
      return snap.data() as DailyAnalyticsSummary;
    }
    return null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<DailyAnalyticsSummary[]> {
    const q = this.db.collection(this.collectionName)
      .where('dateKey', '>=', startDate)
      .where('dateKey', '<=', endDate);
    
    const snap = await q.get();
    const results = snap.docs.map(d => d.data() as DailyAnalyticsSummary);
    return results.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }

  async upsert(summary: DailyAnalyticsSummary): Promise<void> {
    const docRef = this.db.collection(this.collectionName).doc(summary.dateKey);
    
    const now = new Date().toISOString();
    await this.db.runTransaction(async (transaction) => {
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
    await this.db.collection(this.collectionName).doc(dateKey).delete();
  }
}

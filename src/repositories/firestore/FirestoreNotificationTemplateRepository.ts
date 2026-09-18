import { getAdminFirestore } from '@/lib/firebase/admin';
import { Firestore } from 'firebase-admin/firestore';
import { INotificationTemplateRepository, TemplateFilter } from '../interfaces/INotificationTemplateRepository';
import { NotificationTemplate } from '@/types/notification';

export class FirestoreNotificationTemplateRepository implements INotificationTemplateRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firebase Admin Firestore is not initialized.');
    return firestore;
  }
  
  private collectionName = 'notificationTemplates';

  async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    const collRef = this.db.collection(this.collectionName);
    const docRef = collRef.doc();
    const newTemplate: NotificationTemplate = {
      ...templateData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await docRef.set(newTemplate);
    return newTemplate;
  }

  async findById(id: string): Promise<NotificationTemplate | null> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    return docSnap.data() as NotificationTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Omit<NotificationTemplate, 'id'>>): Promise<NotificationTemplate> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(updatedData);
    const updatedDoc = await docRef.get();
    return updatedDoc.data() as NotificationTemplate;
  }

  async listTemplates(filter?: TemplateFilter): Promise<NotificationTemplate[]> {
    let q: FirebaseFirestore.Query = this.db.collection(this.collectionName);
    
    if (filter?.channel) {
      q = q.where('channel', '==', filter.channel);
    }
    if (filter?.enabled !== undefined) {
      q = q.where('enabled', '==', filter.enabled);
    }

    q = q.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    
    return snapshot.docs.map(doc => doc.data() as NotificationTemplate);
  }

  async deleteTemplate(id: string): Promise<void> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    await docRef.delete();
  }
}

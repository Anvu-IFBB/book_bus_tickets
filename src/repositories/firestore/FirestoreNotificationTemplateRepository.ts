import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { INotificationTemplateRepository, TemplateFilter } from '../interfaces/INotificationTemplateRepository';
import { NotificationTemplate } from '@/types/notification';

export class FirestoreNotificationTemplateRepository implements INotificationTemplateRepository {
  private get db() {
    return getFirebaseFirestore()!;
  }
  private collectionName = 'notificationTemplates';

  async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    const collRef = collection(this.db, this.collectionName);
    const docRef = doc(collRef);
    const newTemplate: NotificationTemplate = {
      ...templateData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, newTemplate);
    return newTemplate;
  }

  async findById(id: string): Promise<NotificationTemplate | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as NotificationTemplate;
  }

  async updateTemplate(id: string, updates: Partial<Omit<NotificationTemplate, 'id'>>): Promise<NotificationTemplate> {
    const docRef = doc(this.db, this.collectionName, id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updatedData);
    const updatedDoc = await getDoc(docRef);
    return updatedDoc.data() as NotificationTemplate;
  }

  async listTemplates(filter?: TemplateFilter): Promise<NotificationTemplate[]> {
    let q = query(collection(this.db, this.collectionName));
    
    if (filter?.channel) {
      q = query(q, where('channel', '==', filter.channel));
    }
    if (filter?.enabled !== undefined) {
      q = query(q, where('enabled', '==', filter.enabled));
    }

    q = query(q, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as NotificationTemplate);
  }

  async deleteTemplate(id: string): Promise<void> {
    const docRef = doc(this.db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}

import { getAdminFirestore } from '@/lib/firebase/admin';
import { Firestore } from 'firebase-admin/firestore';
import { INotificationDeliveryRepository, DeliveryFilter } from '../interfaces/INotificationDeliveryRepository';
import { NotificationDelivery } from '@/types/notification';

export class FirestoreNotificationDeliveryRepository implements INotificationDeliveryRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firebase Admin Firestore is not initialized.');
    return firestore;
  }
  
  private collectionName = 'notificationDeliveries';

  async createDelivery(deliveryData: Omit<NotificationDelivery, 'id' | 'createdAt'>): Promise<NotificationDelivery> {
    const collRef = this.db.collection(this.collectionName);
    const docRef = collRef.doc();
    const newDelivery: NotificationDelivery = {
      ...deliveryData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await docRef.set(newDelivery);
    return newDelivery;
  }

  async findById(id: string): Promise<NotificationDelivery | null> {
    const docRef = this.db.collection(this.collectionName).doc(id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return null;
    return docSnap.data() as NotificationDelivery;
  }

  async listDeliveries(filter?: DeliveryFilter): Promise<NotificationDelivery[]> {
    let q: FirebaseFirestore.Query = this.db.collection(this.collectionName);
    
    if (filter?.notificationId) {
      q = q.where('notificationId', '==', filter.notificationId);
    }
    if (filter?.status) {
      q = q.where('status', '==', filter.status);
    }

    q = q.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    
    return snapshot.docs.map(doc => doc.data() as NotificationDelivery);
  }
}

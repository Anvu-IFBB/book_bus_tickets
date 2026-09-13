import { collection, doc, getDoc, getDocs, setDoc, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { INotificationDeliveryRepository, DeliveryFilter } from '../interfaces/INotificationDeliveryRepository';
import { NotificationDelivery } from '@/types/notification';

export class FirestoreNotificationDeliveryRepository implements INotificationDeliveryRepository {
  private get db() {
    return getFirebaseFirestore()!;
  }
  private collectionName = 'notificationDeliveries';

  async createDelivery(deliveryData: Omit<NotificationDelivery, 'id' | 'createdAt'>): Promise<NotificationDelivery> {
    const collRef = collection(this.db, this.collectionName);
    const docRef = doc(collRef);
    const newDelivery: NotificationDelivery = {
      ...deliveryData,
      id: docRef.id,
      createdAt: new Date().toISOString(),
    };
    await setDoc(docRef, newDelivery);
    return newDelivery;
  }

  async findById(id: string): Promise<NotificationDelivery | null> {
    const docRef = doc(this.db, this.collectionName, id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as NotificationDelivery;
  }

  async listDeliveries(filter?: DeliveryFilter): Promise<NotificationDelivery[]> {
    let q = query(collection(this.db, this.collectionName));
    
    if (filter?.notificationId) {
      q = query(q, where('notificationId', '==', filter.notificationId));
    }
    if (filter?.status) {
      q = query(q, where('status', '==', filter.status));
    }

    q = query(q, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => doc.data() as NotificationDelivery);
  }
}

import { INotificationRepository, NotificationFilter } from '../interfaces/INotificationRepository';
import { Notification } from '@/types/notification';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where, orderBy, QueryConstraint } from 'firebase/firestore';

export class FirestoreNotificationRepository implements INotificationRepository {
  private get collectionRef() {
    return collection(getFirebaseFirestore()!, 'notifications');
  }

  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const docId = `notif-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const docRef = doc(this.collectionRef, docId);

    const newNotif: Notification = {
      ...data,
      id: docId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setDoc(docRef, newNotif);
    return newNotif;
  }

  async createIfNotExist(idempotencyKey: string, data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const q = query(this.collectionRef, where('idempotencyKey', '==', idempotencyKey));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as Notification;
    }
    return this.createNotification({ ...data, idempotencyKey });
  }

  async findById(id: string): Promise<Notification | null> {
    const docRef = doc(this.collectionRef, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as Notification;
  }

  async updateNotification(id: string, updates: Partial<Omit<Notification, 'id'>>): Promise<Notification> {
    const docRef = doc(this.collectionRef, id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await updateDoc(docRef, updatedData);
    const snap = await getDoc(docRef);
    return snap.data() as Notification;
  }

  async listNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    const constraints: QueryConstraint[] = [];
    if (filter?.status) constraints.push(where('status', '==', filter.status));
    if (filter?.channel) constraints.push(where('channel', '==', filter.channel));
    if (filter?.jobId) constraints.push(where('jobId', '==', filter.jobId));
    if (filter?.bookingId) constraints.push(where('bookingId', '==', filter.bookingId));

    constraints.push(orderBy('createdAt', 'desc'));

    const q = query(this.collectionRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => doc.data() as Notification);
  }
}

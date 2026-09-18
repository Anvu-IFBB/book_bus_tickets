import { INotificationRepository, NotificationFilter } from '../interfaces/INotificationRepository';
import { Notification } from '@/types/notification';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Firestore } from 'firebase-admin/firestore';

export class FirestoreNotificationRepository implements INotificationRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) throw new Error('Firebase Admin Firestore is not initialized.');
    return firestore;
  }

  private get collectionRef() {
    return this.db.collection('notifications');
  }

  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const docId = `notif-${crypto.randomUUID()}`;
    const docRef = this.collectionRef.doc(docId);

    const newNotif: Notification = {
      ...data,
      id: docId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await docRef.set(newNotif);
    return newNotif;
  }

  async createIfNotExist(idempotencyKey: string, data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const q = this.collectionRef.where('idempotencyKey', '==', idempotencyKey);
    const snap = await q.get();
    if (!snap.empty) {
      return snap.docs[0].data() as Notification;
    }
    return this.createNotification({ ...data, idempotencyKey });
  }

  async findById(id: string): Promise<Notification | null> {
    const docRef = this.collectionRef.doc(id);
    const snap = await docRef.get();
    if (!snap.exists) return null;
    return snap.data() as Notification;
  }

  async updateNotification(id: string, updates: Partial<Omit<Notification, 'id'>>): Promise<Notification> {
    const docRef = this.collectionRef.doc(id);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await docRef.update(updatedData);
    const snap = await docRef.get();
    return snap.data() as Notification;
  }

  async listNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    let q: FirebaseFirestore.Query = this.collectionRef;
    
    if (filter?.status) q = q.where('status', '==', filter.status);
    if (filter?.channel) q = q.where('channel', '==', filter.channel);
    if (filter?.jobId) q = q.where('jobId', '==', filter.jobId);
    if (filter?.bookingId) q = q.where('bookingId', '==', filter.bookingId);

    q = q.orderBy('createdAt', 'desc');

    const snap = await q.get();
    return snap.docs.map(doc => doc.data() as Notification);
  }
}

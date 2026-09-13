import { Notification, NotificationStatus, NotificationChannel } from '@/types/notification';

export interface NotificationFilter {
  status?: NotificationStatus;
  channel?: NotificationChannel;
  jobId?: string;
  bookingId?: string;
}

export interface INotificationRepository {
  createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification>;
  createIfNotExist(idempotencyKey: string, data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  updateNotification(id: string, updates: Partial<Omit<Notification, 'id'>>): Promise<Notification>;
  listNotifications(filter?: NotificationFilter): Promise<Notification[]>;
}

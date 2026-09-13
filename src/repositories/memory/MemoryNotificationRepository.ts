import { INotificationRepository, NotificationFilter } from '../interfaces/INotificationRepository';
import { Notification } from '@/types/notification';

const generateId = (prefix: string) => `${prefix}${Date.now()}-${Math.floor(Math.random() * 1000)}`;

export class MemoryNotificationRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  async createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const id = generateId('notif-');
    const now = new Date().toISOString();
    const notification: Notification = {
      ...data,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.notifications.push(notification);
    return notification;
  }

  async createIfNotExist(idempotencyKey: string, data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const existing = this.notifications.find(n => n.idempotencyKey === idempotencyKey);
    if (existing) return existing;
    return this.createNotification({ ...data, idempotencyKey });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.notifications.find(n => n.id === id) || null;
  }

  async updateNotification(id: string, updates: Partial<Omit<Notification, 'id'>>): Promise<Notification> {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx === -1) throw new Error(`Notification not found: ${id}`);
    
    const updated = {
      ...this.notifications[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.notifications[idx] = updated;
    return updated;
  }

  async listNotifications(filter?: NotificationFilter): Promise<Notification[]> {
    let result = [...this.notifications];
    if (filter) {
      if (filter.status) result = result.filter(n => n.status === filter.status);
      if (filter.channel) result = result.filter(n => n.channel === filter.channel);
      if (filter.jobId) result = result.filter(n => n.jobId === filter.jobId);
      if (filter.bookingId) result = result.filter(n => n.bookingId === filter.bookingId);
    }
    // Sort by createdAt descending
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

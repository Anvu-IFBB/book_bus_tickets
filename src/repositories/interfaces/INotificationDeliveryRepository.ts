import { NotificationDelivery, NotificationStatus } from '@/types/notification';

export interface DeliveryFilter {
  notificationId?: string;
  status?: NotificationStatus;
}

export interface INotificationDeliveryRepository {
  createDelivery(delivery: Omit<NotificationDelivery, 'id' | 'createdAt'>): Promise<NotificationDelivery>;
  findById(id: string): Promise<NotificationDelivery | null>;
  listDeliveries(filter?: DeliveryFilter): Promise<NotificationDelivery[]>;
}

import { INotificationDeliveryRepository, DeliveryFilter } from '../interfaces/INotificationDeliveryRepository';
import { NotificationDelivery } from '@/types/notification';

export class MemoryNotificationDeliveryRepository implements INotificationDeliveryRepository {
  private deliveries: NotificationDelivery[] = [];

  async createDelivery(deliveryData: Omit<NotificationDelivery, 'id' | 'createdAt'>): Promise<NotificationDelivery> {
    const newDelivery: NotificationDelivery = {
      ...deliveryData,
      id: `del-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.deliveries.push(newDelivery);
    return newDelivery;
  }

  async findById(id: string): Promise<NotificationDelivery | null> {
    return this.deliveries.find((d) => d.id === id) || null;
  }

  async listDeliveries(filter?: DeliveryFilter): Promise<NotificationDelivery[]> {
    let result = [...this.deliveries];
    if (filter?.notificationId) {
      result = result.filter(d => d.notificationId === filter.notificationId);
    }
    if (filter?.status) {
      result = result.filter(d => d.status === filter.status);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

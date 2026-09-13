import { NotificationTemplate, NotificationChannel } from '@/types/notification';

export interface TemplateFilter {
  channel?: NotificationChannel;
  enabled?: boolean;
}

export interface INotificationTemplateRepository {
  createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate>;
  findById(id: string): Promise<NotificationTemplate | null>;
  updateTemplate(id: string, updates: Partial<Omit<NotificationTemplate, 'id'>>): Promise<NotificationTemplate>;
  listTemplates(filter?: TemplateFilter): Promise<NotificationTemplate[]>;
  deleteTemplate(id: string): Promise<void>;
}

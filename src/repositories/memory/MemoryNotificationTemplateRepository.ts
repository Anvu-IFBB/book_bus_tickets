import { INotificationTemplateRepository, TemplateFilter } from '../interfaces/INotificationTemplateRepository';
import { NotificationTemplate } from '@/types/notification';
import { INITIAL_NOTIFICATION_TEMPLATES } from './mockData';

export class MemoryNotificationTemplateRepository implements INotificationTemplateRepository {
  private templates: NotificationTemplate[] = [...INITIAL_NOTIFICATION_TEMPLATES];

  async createTemplate(templateData: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<NotificationTemplate> {
    const newTemplate: NotificationTemplate = {
      ...templateData,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  async findById(id: string): Promise<NotificationTemplate | null> {
    return this.templates.find((t) => t.id === id) || null;
  }

  async updateTemplate(id: string, updates: Partial<Omit<NotificationTemplate, 'id'>>): Promise<NotificationTemplate> {
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Template not found');

    const updatedTemplate = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.templates[index] = updatedTemplate;
    return updatedTemplate;
  }

  async listTemplates(filter?: TemplateFilter): Promise<NotificationTemplate[]> {
    let result = [...this.templates];
    if (filter?.channel) {
      result = result.filter(t => t.channel === filter.channel);
    }
    if (filter?.enabled !== undefined) {
      result = result.filter(t => t.enabled === filter.enabled);
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async deleteTemplate(id: string): Promise<void> {
    this.templates = this.templates.filter(t => t.id !== id);
  }
}

'use server';

import { requireAuth } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { getNotificationTemplateRepository } from '@/repositories';
import { TemplateFilter } from '@/repositories/interfaces/INotificationTemplateRepository';
import { NotificationTemplate } from '@/types/notification';
import { handleActionError } from '@/lib/server/action-error';

export async function listTemplatesAction(filter?: TemplateFilter) {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) throw new Error('Unauthorized');
    
    const repo = getNotificationTemplateRepository();
    const templates = await repo.listTemplates(filter);
    return { success: true, templates };
  } catch (error) {
    return handleActionError(error, 'listTemplatesAction');
  }
}

export async function getTemplateAction(id: string) {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) throw new Error('Unauthorized');
    
    const repo = getNotificationTemplateRepository();
    const template = await repo.findById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    return { success: true, template };
  } catch (error) {
    return handleActionError(error, 'getTemplateAction');
  }
}

export async function createTemplateAction(data: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) throw new Error('Unauthorized');
    
    const repo = getNotificationTemplateRepository();
    const template = await repo.createTemplate(data);
    return { success: true, template };
  } catch (error) {
    return handleActionError(error, 'createTemplateAction');
  }
}

export async function updateTemplateAction(id: string, updates: Partial<Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) throw new Error('Unauthorized');
    
    const repo = getNotificationTemplateRepository();
    const template = await repo.updateTemplate(id, updates);
    return { success: true, template };
  } catch (error) {
    return handleActionError(error, 'updateTemplateAction');
  }
}

export async function deleteTemplateAction(id: string) {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) throw new Error('Unauthorized');
    
    const repo = getNotificationTemplateRepository();
    await repo.deleteTemplate(id);
    return { success: true };
  } catch (error) {
    return handleActionError(error, 'deleteTemplateAction');
  }
}

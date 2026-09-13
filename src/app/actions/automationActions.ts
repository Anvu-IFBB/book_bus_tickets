'use server';

import { getAutomationRepository, getNotificationRepository } from '@/repositories';
import { requireAuth } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { AutomationJob, AutomationExecution } from '@/types/automation';
import { Notification } from '@/types/notification';
import { handleActionError } from '@/lib/server/action-error';
export async function getAutomationJobsAction(): Promise<{ jobs: AutomationJob[]; error?: string }> {
  try {
    const session = await requireAuth();
    if (!Permissions.canManageAutomation(session.role)) {
      return { jobs: [], error: 'Không có quyền truy cập' };
    }

    const repo = getAutomationRepository();
    const jobs = await repo.listJobs();
    return { jobs };
  } catch (error: unknown) {
    return { jobs: [], error: handleActionError(error, 'getAutomationJobsAction').error };
  }
}

export async function getJobExecutionsAction(jobId: string): Promise<{ executions: AutomationExecution[]; error?: string }> {
  try {
    const session = await requireAuth();
    if (!Permissions.canViewAutomationLogs(session.role)) {
      return { executions: [], error: 'Không có quyền truy cập' };
    }

    const repo = getAutomationRepository();
    const executions = await repo.getExecutionsByJobId(jobId);
    return { executions };
  } catch (error: unknown) {
    return { executions: [], error: handleActionError(error, 'getJobExecutionsAction').error };
  }
}

export async function getNotificationsAction(): Promise<{ notifications: Notification[]; error?: string }> {
  try {
    const session = await requireAuth();
    if (!Permissions.canViewAutomationLogs(session.role)) {
      return { notifications: [], error: 'Không có quyền truy cập' };
    }

    const repo = getNotificationRepository();
    const notifications = await repo.listNotifications();
    return { notifications };
  } catch (error: unknown) {
    return { notifications: [], error: handleActionError(error, 'getNotificationsAction').error };
  }
}

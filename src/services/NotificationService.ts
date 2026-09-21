import { getNotificationRepository, getNotificationDeliveryRepository, getAutomationRepository } from '@/repositories';
import { Notification } from '@/types/notification';
import { templateEngine } from '@/lib/notifications/templates/engine';
import { ProviderFactory } from './notification/ProviderFactory';

export class NotificationService {
  private get notificationRepo() { return getNotificationRepository(); }
  private get deliveryRepo() { return getNotificationDeliveryRepository(); }
  private get automationRepo() { return getAutomationRepository(); }

  /**
   * Process a notification by ID. Evaluate its template and send it via the correct provider.
   */
  async processNotification(notificationId: string, executionId?: string): Promise<void> {
    const notification = await this.notificationRepo.findById(notificationId);
    if (!notification) {
      throw new Error(`Notification ${notificationId} not found`);
    }

    if (notification.status === 'SENT' || notification.status === 'SKIPPED') {
      return;
    }

    const provider = ProviderFactory.getProvider(notification.channel);
    if (!provider) {
      throw new Error(`No provider configured for channel ${notification.channel}`);
    }

    try {
      await this.notificationRepo.updateNotification(notification.id, { status: 'SENDING' });
      
      const content = await templateEngine.evaluateTemplate(notification.templateId, notification.payload);
      const result = await provider.send(notification, content);
      
      if (result.success) {
        await this.notificationRepo.updateNotification(notification.id, { 
          status: 'SENT', 
          sentAt: new Date().toISOString(),
          providerMessageId: result.providerMessageId
        });
        
        await this.deliveryRepo.createDelivery({
          notificationId: notification.id,
          provider: provider.constructor.name,
          providerResponse: result.providerMessageId || 'OK',
          status: 'SENT',
          attemptNumber: notification.attempts + 1,
        });

        if (executionId) {
          await this.automationRepo.addExecutionLog(executionId, `Notification ${notification.id} sent successfully via ${notification.channel}`);
        }
      } else {
        // Failed
        const errorMessage = result.errorMessage || 'Unknown provider error';
        
        if (result.isPermanentFailure) {
          await this.notificationRepo.updateNotification(notification.id, { status: 'FAILED', errorMessage, errorCode: result.errorCode });
        } else {
          // Leave it in a state that can be retried by the job, or throw so the job fails and retries
          // The job engine retries FAILED jobs, but we must mark the notification FAILED as well
          // Wait, if it's temporary, we mark it FAILED but throw an error so AutomationService knows the job failed and schedules a retry.
          // If it's permanent, we mark it FAILED and do NOT throw an error, so the job continues and considers this notification "done" (won't retry).
          await this.notificationRepo.updateNotification(notification.id, { status: 'FAILED', errorMessage, errorCode: result.errorCode });
        }

        await this.deliveryRepo.createDelivery({
          notificationId: notification.id,
          provider: provider.constructor.name,
          providerResponse: errorMessage,
          errorCode: result.errorCode,
          status: 'FAILED',
          attemptNumber: notification.attempts + 1,
        });

        if (executionId) {
          await this.automationRepo.addExecutionLog(executionId, `Failed to send notification ${notification.id}: ${errorMessage}`);
        }

        if (!result.isPermanentFailure) {
          // Throw so AutomationService knows it's temporary and retries the job
          throw new Error(`Temporary failure sending notification ${notification.id}: ${errorMessage}`);
        }
      }

    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      if (errMessage.startsWith('Temporary failure')) {
        throw error; // Already handled above
      }

      await this.notificationRepo.updateNotification(notification.id, { status: 'FAILED', errorMessage: errMessage });
      if (executionId) {
        await this.automationRepo.addExecutionLog(executionId, `Unexpected error in notification ${notification.id}: ${errMessage}`);
      }

      await this.deliveryRepo.createDelivery({
        notificationId: notification.id,
        provider: provider.constructor.name,
        providerResponse: errMessage,
        status: 'FAILED',
        attemptNumber: notification.attempts + 1,
      });

      // Unexpected errors are treated as temporary (throw them to trigger job retry)
      throw error;
    }
  }

  /**
   * Queue a new notification
   */
  async queueNotification(data: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'>): Promise<Notification> {
    const payload = { ...data, status: 'QUEUED' as const };
    if (data.idempotencyKey) {
      return this.notificationRepo.createIfNotExist(data.idempotencyKey, payload);
    }
    return this.notificationRepo.createNotification(payload);
  }
}

export const notificationService = new NotificationService();

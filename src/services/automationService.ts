import { getAutomationRepository, getBookingRepository, getFeedbackRepository, getNotificationRepository, getSettingsRepository } from '@/repositories';
import { AutomationJob } from '@/types/automation';
import { Notification, NotificationChannel } from '@/types/notification';
import { notificationService } from './NotificationService';

export class AutomationService {
  private get automationRepo() { return getAutomationRepository(); }
  private get notificationRepo() { return getNotificationRepository(); }
  private get bookingRepo() { return getBookingRepository(); }
  private get feedbackRepo() { return getFeedbackRepository(); }
  private get settingsRepo() { return getSettingsRepository(); }

  /**
   * Scan completed bookings and create feedback reminder jobs.
   */
  async scanAndCreateFeedbackJobs(): Promise<void> {
    const settings = await this.settingsRepo.getSettings();
    if (!settings.automationEnabled || !settings.autoSendFeedbackReminder) {
      console.log('Automation or Auto Feedback Reminder is disabled.');
      return;
    }

    const delayHours = settings.feedbackDelayHours || 2;
    const now = new Date();

    // In a real DB, we would query `status == 'COMPLETED'` and `completedAt <= X`
    // For Memory/Firestore list(), we fetch COMPLETED bookings and filter.
    const allCompleted = await this.bookingRepo.list({ status: 'COMPLETED' });

    for (const booking of allCompleted) {
      if (!booking.completedAt) continue;

      const completedTime = new Date(booking.completedAt);
      const diffHours = (now.getTime() - completedTime.getTime()) / (1000 * 60 * 60);

      if (diffHours >= delayHours) {
        const idempotencyKey = `FEEDBACK_REMINDER:${booking.id}`;
        
        const jobData: Omit<AutomationJob, 'id' | 'createdAt' | 'updatedAt'> = {
          type: 'FEEDBACK_REMINDER',
          idempotencyKey,
          entityId: booking.id,
          status: 'PENDING',
          scheduledAt: now.toISOString(),
          attempts: 0,
          maxAttempts: settings.maxRetryAttempts || 3,
        };

        const job = await this.automationRepo.createJobIfNotExist(idempotencyKey, jobData);
        if (job) {
          console.log(`Created new automation job ${job.id} for booking ${booking.bookingCode}`);
        }
      }
    }
  }

  /**
   * Process all pending and retryable jobs
   */
  async processJobs(): Promise<void> {
    const allJobs = await this.automationRepo.listJobs();
    const now = new Date();

    const jobsToProcess = allJobs.filter(job => 
      job.status === 'PENDING' || 
      (job.status === 'FAILED' && job.attempts < job.maxAttempts && job.nextRetryAt && new Date(job.nextRetryAt) <= now)
    );

    for (const job of jobsToProcess) {
      await this.runJob(job);
    }
  }

  private async runJob(job: AutomationJob): Promise<void> {
    // 1. Mark as RUNNING atomically to prevent concurrent processing
    const runningJob = await this.automationRepo.claimJob(job.id);
    if (!runningJob) {
      console.log(`Job ${job.id} already claimed or running`);
      return;
    }

    // 2. Create Execution
    const execution = await this.automationRepo.createExecution({
      jobId: job.id,
      status: 'RUNNING',
      logs: [`Started execution attempt ${runningJob.attempts + 1}`]
    });

    try {
      if (job.type === 'FEEDBACK_REMINDER') {
        await this.handleFeedbackReminder(job, execution.id);
      } else {
        throw new Error(`Unknown job type: ${job.type}`);
      }

      // Success
      await this.automationRepo.updateExecution(execution.id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
      });
      await this.automationRepo.addExecutionLog(execution.id, 'Execution completed successfully');

      await this.automationRepo.updateJob(job.id, {
        status: 'COMPLETED',
        completedAt: new Date().toISOString(),
        attempts: runningJob.attempts + 1,
      });

    } catch (error: unknown) {
      const errMessage = error instanceof Error ? error.message : String(error);
      // Failure
      await this.automationRepo.addExecutionLog(execution.id, `Error: ${errMessage}`);
      await this.automationRepo.updateExecution(execution.id, {
        status: 'FAILED',
        error: errMessage,
        completedAt: new Date().toISOString(),
      });

      const attempts = runningJob.attempts + 1;
      const hasMoreAttempts = attempts < runningJob.maxAttempts;
      
      const nextRetryAt = hasMoreAttempts 
        ? new Date(Date.now() + 15 * 60 * 1000).toISOString() // retry in 15 mins
        : undefined;

      await this.automationRepo.updateJob(job.id, {
        status: 'FAILED',
        error: errMessage,
        attempts,
        nextRetryAt,
      });
    }
  }

  private async handleFeedbackReminder(job: AutomationJob, executionId: string): Promise<void> {
    const booking = await this.bookingRepo.findById(job.entityId);
    if (!booking) {
      throw new Error(`Booking ${job.entityId} not found`);
    }

    // Business check: Has feedback already been submitted?
    const existingFeedback = await this.feedbackRepo.findByBookingCode(booking.bookingCode);
    if (existingFeedback) {
      await this.automationRepo.addExecutionLog(executionId, `Feedback already exists for booking ${booking.bookingCode}. Skipping.`);
      // Update job directly to skipped to bypass the outer success marking if we wanted to, 
      // but marking it completed is also fine because the goal was reached.
      // We will throw a special error or just return. Returning means success.
      return; 
    }

    await this.automationRepo.addExecutionLog(executionId, `Sending SMS and Email to customer ID: ${booking.customerId}`);

    // Create Notification Records
    const settings = await this.settingsRepo.getSettings();
    const channels: NotificationChannel[] = ['SMS'];
    if (settings.notifications?.emailEnabled) channels.push('EMAIL');

    const errors: Error[] = [];

    for (const channel of channels) {
      const idempotencyKey = `${job.id}_${channel}`;
      
      const notifData: Omit<Notification, 'id' | 'createdAt' | 'updatedAt'> = {
        jobId: job.id,
        idempotencyKey,
        bookingId: booking.id,
        channel,
        recipient: booking.customerId || 'GUEST',
        templateId: 'FEEDBACK_REMINDER_TPL',
        payload: { 
          bookingCode: booking.bookingCode, 
          customerName: 'Quý khách',
          feedbackUrl: `https://example.com/feedback/${booking.bookingCode}`
        },
        status: 'PENDING',
        attempts: 0,
        maxAttempts: 3,
        scheduledAt: new Date().toISOString(),
      };

      const notification = await notificationService.queueNotification(notifData);
      
      try {
        await notificationService.processNotification(notification.id, executionId);
      } catch (err: unknown) {
        errors.push(err instanceof Error ? err : new Error(String(err)));
      }
    }

    if (errors.length > 0) {
      throw new Error(`Errors occurred while processing notifications: ${errors.map(e => e.message).join(', ')}`);
    }
  }
}

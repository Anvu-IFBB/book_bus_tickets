import { Notification, NotificationChannel } from '@/types/notification';

export interface EvaluatedNotification {
  subject?: string;
  body: string;
}

export interface ProviderResult {
  success: boolean;
  providerMessageId?: string;
  errorCode?: string;
  errorMessage?: string;
  isPermanentFailure?: boolean;
}

export interface INotificationProvider {
  /**
   * The channel this provider handles.
   */
  readonly channel: NotificationChannel;

  /**
   * Send the evaluated notification to the recipient.
   */
  send(notification: Notification, content: EvaluatedNotification): Promise<ProviderResult>;
}

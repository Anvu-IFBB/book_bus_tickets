import { INotificationProvider, EvaluatedNotification, ProviderResult } from './INotificationProvider';
import { Notification, NotificationChannel } from '@/types/notification';

export class MockNotificationProvider implements INotificationProvider {
  constructor(public readonly channel: NotificationChannel) {}

  async send(notification: Notification, content: EvaluatedNotification): Promise<ProviderResult> {
    console.log(`[MockNotificationProvider - ${this.channel}] Sending to ${notification.recipient}`);
    console.log(`Subject: ${content.subject || 'N/A'}`);
    console.log(`Body: ${content.body}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate random failure (e.g., 5% chance)
    if (Math.random() < 0.05) {
      console.log(`[MockNotificationProvider - ${this.channel}] Simulated failure`);
      return {
        success: false,
        errorCode: 'MOCK_ERROR',
        errorMessage: 'Simulated random failure',
        isPermanentFailure: false,
      };
    }

    console.log(`[MockNotificationProvider - ${this.channel}] Sent successfully`);
    return {
      success: true,
      providerMessageId: `mock-msg-${Date.now()}`,
    };
  }
}

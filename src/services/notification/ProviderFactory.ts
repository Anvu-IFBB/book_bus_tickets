import { NotificationChannel } from '@/types/notification';
import { INotificationProvider } from './INotificationProvider';
import { MockNotificationProvider } from './MockNotificationProvider';
import { ResendEmailProvider } from './providers/ResendEmailProvider';

export class ProviderFactory {
  static getProvider(channel: NotificationChannel): INotificationProvider {
    switch (channel) {
      case 'EMAIL':
        return this.getEmailProvider();
      case 'SMS':
      case 'ZALO':
      case 'IN_APP':
      default:
        // SMS and Zalo are not implemented yet, default to Mock
        return new MockNotificationProvider(channel);
    }
  }

  private static getEmailProvider(): INotificationProvider {
    const providerName = process.env.EMAIL_PROVIDER?.toLowerCase() || 'mock';
    
    if (providerName === 'resend') {
      return new ResendEmailProvider();
    }
    
    // Default to mock for 'mock' or unknown
    return new MockNotificationProvider('EMAIL');
  }
}

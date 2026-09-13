import { INotificationProvider, EvaluatedNotification, ProviderResult } from '../INotificationProvider';
import { Notification } from '@/types/notification';

export class ResendEmailProvider implements INotificationProvider {
  readonly channel = 'EMAIL';

  async send(notification: Notification, content: EvaluatedNotification): Promise<ProviderResult> {
    const apiKey = process.env.EMAIL_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    const replyTo = process.env.EMAIL_REPLY_TO;

    if (!apiKey || !fromEmail) {
      return {
        success: false,
        errorCode: 'MISSING_CONFIG',
        errorMessage: 'EMAIL_API_KEY or EMAIL_FROM is not configured',
        isPermanentFailure: true,
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [notification.recipient],
          subject: content.subject || 'Notification',
          html: content.body,
          reply_to: replyTo || undefined,
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Handle Resend specific errors
        // 429 Too Many Requests -> Temporary
        // 500 Internal Server Error -> Temporary
        // 400 Bad Request, 401 Unauthorized, 403 Forbidden -> Permanent
        const isTemporary = response.status === 429 || response.status >= 500;
        
        return {
          success: false,
          errorCode: data?.name || `HTTP_${response.status}`,
          errorMessage: data?.message || response.statusText,
          isPermanentFailure: !isTemporary,
        };
      }

      return {
        success: true,
        providerMessageId: data.id,
      };

    } catch (error: unknown) {
      // Network errors like fetch timeout or connection refused -> Temporary
      const errMessage = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        errorCode: 'NETWORK_ERROR',
        errorMessage: errMessage || 'Unknown network error',
        isPermanentFailure: false,
      };
    }
  }
}

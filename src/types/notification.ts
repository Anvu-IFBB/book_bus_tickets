export type NotificationChannel = 'SMS' | 'EMAIL' | 'ZALO' | 'IN_APP';

export type NotificationStatus =
  | 'PENDING'
  | 'QUEUED'
  | 'SENDING'
  | 'SENT'
  | 'FAILED'
  | 'SKIPPED';

export interface Notification {
  id: string;
  jobId?: string; // Liên kết với Automation Job nếu được trigger từ Job
  idempotencyKey?: string; // Dùng để tránh duplicate notification
  bookingId?: string;
  customerId?: string;
  channel: NotificationChannel;
  templateId: string;
  recipient: string; // Phone or Email depending on channel
  payload: Record<string, string>; // Replace variables
  status: NotificationStatus;
  attempts: number;
  maxAttempts: number;
  provider?: string;
  providerMessageId?: string;
  scheduledAt: string;
  sentAt?: string;
  failedAt?: string;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject?: string; // Usually for Email
  body: string; // Contains variables like {{customerName}}
  enabled: boolean;
  requiredVariables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  status: NotificationStatus; // SENDING, SENT, FAILED
  provider: string;
  providerResponse?: string;
  errorCode?: string;
  errorMessage?: string;
  attemptNumber: number;
  createdAt: string;
}

export interface NotificationPreference {
  customerId: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  zaloEnabled: boolean;
  inAppEnabled: boolean;
}

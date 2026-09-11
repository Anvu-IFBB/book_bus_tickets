export type NotificationChannel = 'WEB' | 'EMAIL' | 'SMS' | 'ZALO';

export type NotificationType =
  | 'BOOKING_RECEIVED'
  | 'BOOKING_CONFIRMED'
  | 'BOOKING_CANCELLED'
  | 'FEEDBACK_REQUEST'
  | 'TRIP_REMINDER';

export type NotificationStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SENT'
  | 'FAILED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface NotificationTask {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerId: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string; // Email or Phone number
  status: NotificationStatus;
  scheduledAt: string; // ISO string when the notification should be dispatched
  sentAt?: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string; // e.g. "BOOKING_STATUS_CHANGED", "VEHICLE_ASSIGNED", "ADMIN_LOGIN"
  entityType: 'BOOKING' | 'CUSTOMER' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'PAYMENT' | 'FEEDBACK' | 'SETTINGS';
  entityId: string;
  fromState?: string;
  toState?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SystemSettings {
  hotline1: string;
  hotline2: string;
  facebookUrl: string;
  zaloUrl: string;
  companyName: string;
  address: string;
  workingHours: string;
  feedbackDelayHours: number; // Mặc định 2 giờ sau khi hoàn thành
  autoSendFeedbackReminder: boolean;
  emailNotificationsEnabled: boolean;
  updatedAt: string;
}

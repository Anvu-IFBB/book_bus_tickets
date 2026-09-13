// Notifications logic moved to @/types/notification
// Keeping other automation-related types here.

export type AutomationType = 'FEEDBACK_REMINDER';

export type AutomationJobStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export interface AutomationJob {
  id: string;
  type: AutomationType;
  idempotencyKey: string;
  entityId: string; // e.g. bookingId
  status: AutomationJobStatus;
  scheduledAt: string; // ISO string
  startedAt?: string;
  completedAt?: string;
  error?: string;
  attempts: number;
  maxAttempts: number;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationExecution {
  id: string;
  jobId: string;
  status: AutomationJobStatus;
  startedAt: string;
  completedAt?: string;
  error?: string;
  logs: string[];
}



export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  actorRole?: string;
  action: string;
  entityType: 'BOOKING' | 'CUSTOMER' | 'VEHICLE' | 'DRIVER' | 'TRIP' | 'PAYMENT' | 'FEEDBACK' | 'SETTINGS' | 'AUTOMATION';
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
  
  notifications: {
    enabled: boolean;
    smsEnabled: boolean;
    emailEnabled: boolean;
    zaloEnabled: boolean;
    inAppEnabled: boolean;
  };

  eventToggles: {
    bookingCreated: boolean;
    bookingConfirmed: boolean;
    bookingCancelled: boolean;
    depositConfirmed: boolean;
    paymentConfirmed: boolean;
    vehicleAssigned: boolean;
    driverAssigned: boolean;
    tripReminder: boolean;
    feedbackReminder: boolean;
  };
  
  // Banking Configuration for QR Code
  bankCode?: string; // e.g., 'VCB', 'TCB', 'MB'
  bankAccountNumber?: string;
  bankAccountName?: string;
  
  automationEnabled: boolean;
  maxRetryAttempts: number;
  
  updatedAt: string;
}

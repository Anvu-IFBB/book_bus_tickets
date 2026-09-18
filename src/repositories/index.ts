import { IBookingRepository } from './interfaces/IBookingRepository';
import { ICustomerRepository } from './interfaces/ICustomerRepository';
import { IFleetRepository } from './interfaces/IFleetRepository';
import { IFeedbackRepository } from './interfaces/IFeedbackRepository';
import { ISettingsRepository } from './interfaces/ISettingsRepository';
import { IPaymentRepository } from './interfaces/IPaymentRepository';
import { IInvoiceRepository } from './interfaces/IInvoiceRepository';
import { IAutomationRepository } from './interfaces/IAutomationRepository';
import { INotificationRepository } from './interfaces/INotificationRepository';
import { INotificationTemplateRepository } from './interfaces/INotificationTemplateRepository';
import { INotificationDeliveryRepository } from './interfaces/INotificationDeliveryRepository';
import { IAnalyticsRepository } from './interfaces/analyticsRepository';

import {
  MemoryBookingRepository,
  MemoryCustomerRepository,
  MemoryFleetRepository,
  MemoryFeedbackRepository,
  MemorySettingsRepository,
  getMemoryPaymentRepository,
  getMemoryInvoiceRepository,
  MemoryAutomationRepository,
  MemoryNotificationRepository,
  MemoryNotificationTemplateRepository,
  MemoryNotificationDeliveryRepository,
  MemoryAnalyticsRepository,
  MemoryAnalyticsSummaryRepository,
} from './memory';

import {
  getFirestoreBookingRepository,
  getFirestoreCustomerRepository,
  getFirestoreFleetRepository,
  getFirestoreFeedbackRepository,
  getFirestoreSettingsRepository,
  getFirestorePaymentRepository,
  getFirestoreInvoiceRepository,
  getFirestoreAutomationRepository,
  getFirestoreNotificationRepository,
  FirestoreNotificationTemplateRepository,
  FirestoreNotificationDeliveryRepository,
  FirestoreAnalyticsRepository,
  FirestoreAnalyticsSummaryRepository,
} from './firestore';

import { isFirebaseAdminConfigured } from '@/lib/firebase/config';

// Global state caching across module reloads
const globalRepoState = globalThis as unknown as {
  _memoryBookingRepo?: IBookingRepository;
  _memoryCustomerRepo?: ICustomerRepository;
  _memoryFleetRepo?: IFleetRepository;
  _memoryFeedbackRepo?: IFeedbackRepository;
  _memorySettingsRepo?: ISettingsRepository;
  _memoryPaymentRepo?: IPaymentRepository;
  _memoryInvoiceRepo?: IInvoiceRepository;
  _memoryAutomationRepo?: IAutomationRepository;
  _memoryNotificationRepo?: INotificationRepository;
  _memoryNotificationTemplateRepo?: INotificationTemplateRepository;
  _memoryNotificationDeliveryRepo?: INotificationDeliveryRepository;
  _memoryAnalyticsRepo?: IAnalyticsRepository;
  _memoryAnalyticsSummaryRepo?: import('./interfaces/IAnalyticsSummaryRepository').IAnalyticsSummaryRepository;
  _testOverrideMode?: 'memory' | 'firestore' | null;
};

/**
 * Cho phép override mode phục vụ kiểm thử tự động
 */
export function setRepositoryModeForTesting(mode: 'memory' | 'firestore' | null) {
  globalRepoState._testOverrideMode = mode;
}

/**
 * Xác định repository mode đang hoạt động
 */
export function getActiveRepositoryMode(): 'memory' | 'firestore' {
  if (globalRepoState._testOverrideMode) {
    return globalRepoState._testOverrideMode;
  }
  const envMode = process.env.REPOSITORY_MODE?.toLowerCase();
  
  if (envMode === 'firestore') {
    if (!isFirebaseAdminConfigured()) {
      throw new Error('CRITICAL: REPOSITORY_MODE is set to "firestore" but Firebase Admin SDK is missing required environment variables (FIREBASE_ADMIN_PRIVATE_KEY, etc). Cannot start application.');
    }
    return 'firestore';
  }
  return 'memory';
}

export function getBookingRepository(): IBookingRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreBookingRepository();
  }
  if (!globalRepoState._memoryBookingRepo) {
    globalRepoState._memoryBookingRepo = new MemoryBookingRepository();
  }
  return globalRepoState._memoryBookingRepo;
}

export function getCustomerRepository(): ICustomerRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreCustomerRepository();
  }
  if (!globalRepoState._memoryCustomerRepo) {
    globalRepoState._memoryCustomerRepo = new MemoryCustomerRepository();
  }
  return globalRepoState._memoryCustomerRepo;
}

export function getFleetRepository(): IFleetRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreFleetRepository();
  }
  if (!globalRepoState._memoryFleetRepo) {
    globalRepoState._memoryFleetRepo = new MemoryFleetRepository();
  }
  return globalRepoState._memoryFleetRepo;
}

export function getFeedbackRepository(): IFeedbackRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreFeedbackRepository();
  }
  if (!globalRepoState._memoryFeedbackRepo) {
    globalRepoState._memoryFeedbackRepo = new MemoryFeedbackRepository();
  }
  return globalRepoState._memoryFeedbackRepo;
}

export function getSettingsRepository(): ISettingsRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreSettingsRepository();
  }
  if (!globalRepoState._memorySettingsRepo) {
    globalRepoState._memorySettingsRepo = new MemorySettingsRepository();
  }
  return globalRepoState._memorySettingsRepo;
}

export function getPaymentRepository(): IPaymentRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestorePaymentRepository();
  }
  if (!globalRepoState._memoryPaymentRepo) {
    globalRepoState._memoryPaymentRepo = getMemoryPaymentRepository();
  }
  return globalRepoState._memoryPaymentRepo;
}

export function getInvoiceRepository(): IInvoiceRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreInvoiceRepository();
  }
  if (!globalRepoState._memoryInvoiceRepo) {
    globalRepoState._memoryInvoiceRepo = getMemoryInvoiceRepository();
  }
  return globalRepoState._memoryInvoiceRepo!;
}

export function getAutomationRepository(): IAutomationRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreAutomationRepository();
  }
  if (!globalRepoState._memoryAutomationRepo) {
    globalRepoState._memoryAutomationRepo = new MemoryAutomationRepository();
  }
  return globalRepoState._memoryAutomationRepo;
}

export function getNotificationRepository(): INotificationRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return getFirestoreNotificationRepository();
  }
  if (!globalRepoState._memoryNotificationRepo) {
    globalRepoState._memoryNotificationRepo = new MemoryNotificationRepository();
  }
  return globalRepoState._memoryNotificationRepo;
}

export function getNotificationTemplateRepository(): INotificationTemplateRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return new FirestoreNotificationTemplateRepository();
  }
  if (!globalRepoState._memoryNotificationTemplateRepo) {
    globalRepoState._memoryNotificationTemplateRepo = new MemoryNotificationTemplateRepository();
  }
  return globalRepoState._memoryNotificationTemplateRepo;
}

export function getNotificationDeliveryRepository(): INotificationDeliveryRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return new FirestoreNotificationDeliveryRepository();
  }
  if (!globalRepoState._memoryNotificationDeliveryRepo) {
    globalRepoState._memoryNotificationDeliveryRepo = new MemoryNotificationDeliveryRepository();
  }
  return globalRepoState._memoryNotificationDeliveryRepo;
}

export function getAnalyticsRepository(): IAnalyticsRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return new FirestoreAnalyticsRepository();
  }
  if (!globalRepoState._memoryAnalyticsRepo) {
    globalRepoState._memoryAnalyticsRepo = new MemoryAnalyticsRepository();
  }
  return globalRepoState._memoryAnalyticsRepo;
}

export function getAnalyticsSummaryRepository(): import('./interfaces/IAnalyticsSummaryRepository').IAnalyticsSummaryRepository {
  if (getActiveRepositoryMode() === 'firestore') {
    return new FirestoreAnalyticsSummaryRepository();
  }
  if (!globalRepoState._memoryAnalyticsSummaryRepo) {
    globalRepoState._memoryAnalyticsSummaryRepo = new MemoryAnalyticsSummaryRepository();
  }
  return globalRepoState._memoryAnalyticsSummaryRepo!;
}

// Re-export interfaces and memory implementations for direct testing
export * from './interfaces/IBookingRepository';
export * from './interfaces/ICustomerRepository';
export * from './interfaces/IFleetRepository';
export * from './interfaces/IFeedbackRepository';
export * from './interfaces/ISettingsRepository';
export * from './interfaces/IAutomationRepository';
export * from './interfaces/INotificationRepository';
export * from './interfaces/INotificationTemplateRepository';
export * from './interfaces/INotificationDeliveryRepository';
export * from './interfaces/analyticsRepository';
export * from './interfaces/IAnalyticsSummaryRepository';
export * from './memory';
export * from './firestore';

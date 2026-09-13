import { FirestoreBookingRepository } from './bookingRepository';
import { FirestoreCustomerRepository } from './customerRepository';
import { FirestoreFleetRepository } from './fleetRepository';
import { FirestoreFeedbackRepository } from './feedbackRepository';
import { FirestoreSettingsRepository } from './settingsRepository';
import { FirestorePaymentRepository } from './paymentRepository';
import { FirestoreInvoiceRepository } from './invoiceRepository';
import { FirestoreAutomationRepository } from './FirestoreAutomationRepository';
import { FirestoreNotificationRepository } from './FirestoreNotificationRepository';
import { FirestoreAnalyticsRepository } from './FirestoreAnalyticsRepository';

export {
  FirestoreBookingRepository,
  FirestoreCustomerRepository,
  FirestoreFleetRepository,
  FirestoreFeedbackRepository,
  FirestoreSettingsRepository,
  FirestorePaymentRepository,
  FirestoreInvoiceRepository,
  FirestoreAutomationRepository,
  FirestoreNotificationRepository,
  FirestoreAnalyticsRepository,
};

let firestoreBookingRepo: FirestoreBookingRepository | null = null;
let firestoreCustomerRepo: FirestoreCustomerRepository | null = null;
let firestoreFleetRepo: FirestoreFleetRepository | null = null;
let firestoreFeedbackRepo: FirestoreFeedbackRepository | null = null;
let firestoreSettingsRepo: FirestoreSettingsRepository | null = null;
let firestorePaymentRepo: FirestorePaymentRepository | null = null;
let firestoreInvoiceRepo: FirestoreInvoiceRepository | null = null;
let firestoreAutomationRepo: FirestoreAutomationRepository | null = null;
let firestoreNotificationRepo: FirestoreNotificationRepository | null = null;

export function getFirestoreAutomationRepository(): FirestoreAutomationRepository {
  if (!firestoreAutomationRepo) {
    firestoreAutomationRepo = new FirestoreAutomationRepository();
  }
  return firestoreAutomationRepo;
}

export function getFirestoreNotificationRepository(): FirestoreNotificationRepository {
  if (!firestoreNotificationRepo) {
    firestoreNotificationRepo = new FirestoreNotificationRepository();
  }
  return firestoreNotificationRepo;
}

export function getFirestorePaymentRepository(): FirestorePaymentRepository {
  if (!firestorePaymentRepo) {
    firestorePaymentRepo = new FirestorePaymentRepository();
  }
  return firestorePaymentRepo;
}

export function getFirestoreInvoiceRepository(): FirestoreInvoiceRepository {
  if (!firestoreInvoiceRepo) {
    firestoreInvoiceRepo = new FirestoreInvoiceRepository();
  }
  return firestoreInvoiceRepo;
}
export function getFirestoreBookingRepository(): FirestoreBookingRepository {
  if (!firestoreBookingRepo) {
    firestoreBookingRepo = new FirestoreBookingRepository();
  }
  return firestoreBookingRepo;
}

export function getFirestoreCustomerRepository(): FirestoreCustomerRepository {
  if (!firestoreCustomerRepo) {
    firestoreCustomerRepo = new FirestoreCustomerRepository();
  }
  return firestoreCustomerRepo;
}

export function getFirestoreFleetRepository(): FirestoreFleetRepository {
  if (!firestoreFleetRepo) {
    firestoreFleetRepo = new FirestoreFleetRepository();
  }
  return firestoreFleetRepo;
}

export function getFirestoreFeedbackRepository(): FirestoreFeedbackRepository {
  if (!firestoreFeedbackRepo) {
    firestoreFeedbackRepo = new FirestoreFeedbackRepository();
  }
  return firestoreFeedbackRepo;
}

export function getFirestoreSettingsRepository(): FirestoreSettingsRepository {
  if (!firestoreSettingsRepo) {
    firestoreSettingsRepo = new FirestoreSettingsRepository();
  }
  return firestoreSettingsRepo;
}
export * from './FirestoreNotificationTemplateRepository';
export * from './FirestoreNotificationDeliveryRepository';
export * from './FirestoreAnalyticsRepository';
export * from './FirestoreAnalyticsSummaryRepository';

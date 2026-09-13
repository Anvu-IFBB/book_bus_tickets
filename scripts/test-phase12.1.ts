/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '../src/repositories/index';
import { getBookingRepository, getSettingsRepository, getAutomationRepository, getNotificationRepository, getNotificationDeliveryRepository } from '../src/repositories/index';
import { AutomationService } from '../src/services/automationService';

async function runTests() {
  console.log('--- STARTING PHASE 12.1 HARDENING AUDIT TESTS (MEMORY MODE) ---\n');
  setRepositoryModeForTesting('memory');

  const settingsRepo = getSettingsRepository();
  const automationRepo = getAutomationRepository();
  const notificationRepo = getNotificationRepository();
  const bookingRepo = getBookingRepository();
  
  const automationService = new AutomationService();

  // 1. Setup Data
  await settingsRepo.updateSettings({
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      enabled: true,
      zaloEnabled: false,
      inAppEnabled: true,
    }
  });

  const booking = await bookingRepo.create({
    id: 'book-audit-12',
    bookingCode: 'AUDIT123',
    customerId: 'cust-123',
    serviceType: 'LIMOUSINE',
    departure: 'Quảng Ninh',
    destination: 'Hà Nội',
    travelDate: '2026-09-12',
    travelTime: '10:00',
    passengerCount: 1,
    paymentStatus: 'PAID',
    bookingStatus: 'COMPLETED',
    price: 300000,
    deposit: 300000,
    pickupAddress: 'Hạ Long',
    dropoffAddress: 'Hà Nội',
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log('1. Testing Scan Idempotency');
  await automationService.scanAndCreateFeedbackJobs();
  const jobsAfterFirstScan = await automationRepo.listJobs();
  console.log(`- Jobs created after first scan: ${jobsAfterFirstScan.length}`);
  
  await automationService.scanAndCreateFeedbackJobs();
  const jobsAfterSecondScan = await automationRepo.listJobs();
  console.log(`- Jobs created after second scan: ${jobsAfterSecondScan.length}`);

  if (jobsAfterFirstScan.length === 1 && jobsAfterSecondScan.length === 1) {
    console.log('✅ PASS: Job creation is idempotent.\n');
  } else {
    console.log('❌ FAIL: Job creation is not idempotent.\n');
  }

  console.log('2. Testing Concurrent Processing');
  // Attempt to run processJobs concurrently
  await Promise.all([
    automationService.processJobs(),
    automationService.processJobs(),
    automationService.processJobs()
  ]);

  const executions = await automationRepo.getExecutionsByJobId(jobsAfterFirstScan[0].id);
  console.log(`- Executions created: ${executions.length}`);
  if (executions.length === 1) {
    console.log('✅ PASS: Only one execution created despite concurrent processing.\n');
  } else {
    console.log('❌ FAIL: Race condition in processing jobs.\n');
  }

  console.log('3. Testing Notification Idempotency (Simulating Job Retry)');
  // We simulate a retry by forcing the job back to pending and running processJobs again
  const job = jobsAfterFirstScan[0];
  await automationRepo.updateJob(job.id, { status: 'PENDING' });
  
  // Also delete executions to keep it clean
  // But wait, the previous run should have created 2 notifications (SMS, EMAIL)
  const notifsBeforeRetry = await notificationRepo.listNotifications({ jobId: job.id });
  console.log(`- Notifications before retry: ${notifsBeforeRetry.length}`);

  await automationService.processJobs();

  const notifsAfterRetry = await notificationRepo.listNotifications({ jobId: job.id });
  console.log(`- Notifications after retry: ${notifsAfterRetry.length}`);

  if (notifsBeforeRetry.length === 2 && notifsAfterRetry.length === 2) {
    console.log('✅ PASS: Notifications were not duplicated on job retry.\n');
  } else {
    console.log('❌ FAIL: Notifications duplicated!\n');
  }

  console.log('\n--- PHASE 12.1 TESTS COMPLETED ---');
}

runTests().catch(console.error);

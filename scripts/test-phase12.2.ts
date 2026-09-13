/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '../src/repositories/index';
import { getSettingsRepository, getAutomationRepository, getNotificationRepository, getNotificationDeliveryRepository, getBookingRepository } from '../src/repositories/index';
import { AutomationService } from '../src/services/automationService';

async function runTests() {
  console.log('--- STARTING PHASE 12.2 NOTIFICATION PROVIDER TESTS ---\n');
  setRepositoryModeForTesting('memory');

  const settingsRepo = getSettingsRepository();
  const automationRepo = getAutomationRepository();
  const notificationRepo = getNotificationRepository();
  const bookingRepo = getBookingRepository();
  const deliveryRepo = getNotificationDeliveryRepository();
  
  const automationService = new AutomationService();

  // Test setup
  process.env.EMAIL_PROVIDER = 'resend'; // Act as if we are using Resend
  process.env.EMAIL_API_KEY = 'mock_api_key';
  process.env.EMAIL_FROM = 'test@example.com';
  
  // Disable native fetch and replace with our mock for testing ResendEmailProvider
  const originalFetch = global.fetch;
  
  // Create test booking
  await bookingRepo.create({
    id: 'book-audit-122',
    bookingCode: 'AUDIT122',
    customerId: 'cust-122',
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
    completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Test 3: Missing Config -> Permanent Failure (Fail-Safe)
  console.log('Test 1: Missing API Key -> Permanent Failure');
  delete process.env.EMAIL_API_KEY;
  await settingsRepo.updateSettings({
    notifications: { emailEnabled: true, smsEnabled: false, enabled: true, zaloEnabled: false, inAppEnabled: false },
    automationEnabled: true, autoSendFeedbackReminder: true
  });
  await automationService.scanAndCreateFeedbackJobs();
  await automationService.processJobs();

  let notifs = await notificationRepo.listNotifications({ channel: 'EMAIL' });
  let emailNotif = notifs[0];
  if (emailNotif && emailNotif.status === 'FAILED' && emailNotif.errorCode === 'MISSING_CONFIG') {
    console.log('✅ PASS: Missing config caused permanent failure, no throw for job to loop indefinitely.');
  } else {
    console.log('❌ FAIL: Missing config test failed', emailNotif);
  }

  // Clear data
  ((notificationRepo as any).notifications as any[]).length = 0;
  ((automationRepo as any).jobs as any[]).length = 0;
  process.env.EMAIL_API_KEY = 'valid_key'; // Restore

  // Test 4: Provider Success
  console.log('\nTest 2: Provider Success -> providerMessageId stored');
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ id: 'resend-msg-1234' })
  } as any);

  await automationService.scanAndCreateFeedbackJobs();
  await automationService.processJobs();
  
  notifs = await notificationRepo.listNotifications({ channel: 'EMAIL' });
  emailNotif = notifs[0];
  if (emailNotif && emailNotif.status === 'SENT' && emailNotif.providerMessageId === 'resend-msg-1234') {
    console.log('✅ PASS: Provider success saved message ID.');
  } else {
    console.log('❌ FAIL: Provider success test failed', emailNotif);
  }

  // Clear data
  ((notificationRepo as any).notifications as any[]).length = 0;
  ((automationRepo as any).jobs as any[]).length = 0;

  // Test 5: Provider Temporary Failure -> Retry
  console.log('\nTest 3: Provider Temporary Failure -> Throws error to trigger job retry');
  global.fetch = async () => ({
    ok: false,
    status: 429,
    statusText: 'Too Many Requests',
    json: async () => ({ message: 'Rate limited' })
  } as any);

  await automationService.scanAndCreateFeedbackJobs();
  await automationService.processJobs();

  notifs = await notificationRepo.listNotifications({ channel: 'EMAIL' });
  emailNotif = notifs[0];
  const jobs = await automationRepo.listJobs();
  const job = jobs[0];

  if (emailNotif && emailNotif.status === 'FAILED' && job.status === 'FAILED' && job.attempts === 1 && job.nextRetryAt) {
    console.log('✅ PASS: Temporary failure correctly failed the job and scheduled a retry.');
  } else {
    console.log('❌ FAIL: Temporary failure test failed', emailNotif, job);
  }

  // Test 9: SMS success + Email failure -> Job retries only Email
  console.log('\nTest 4: SMS success + Email failure -> Job retries only Email');
  ((notificationRepo as any).notifications as any[]).length = 0;
  ((automationRepo as any).jobs as any[]).length = 0;
  await settingsRepo.updateSettings({
    notifications: { emailEnabled: true, smsEnabled: true, enabled: true, zaloEnabled: false, inAppEnabled: false }
  });

  // First run: Email fails (429), SMS succeeds (mock provider)
  await automationService.scanAndCreateFeedbackJobs();
  await automationService.processJobs(); // This will process job attempt 1

  notifs = await notificationRepo.listNotifications();
  const sms1 = notifs.find(n => n.channel === 'SMS');
  const email1 = notifs.find(n => n.channel === 'EMAIL');

  if (sms1?.status === 'SENT' && email1?.status === 'FAILED') {
    console.log('- Run 1 OK: SMS sent, Email failed.');
  } else {
    console.log('❌ FAIL: Run 1 state incorrect');
  }

  // Second run (Retry): Email succeeds
  global.fetch = async () => ({
    ok: true,
    json: async () => ({ id: 'resend-msg-retry' })
  } as any);
  
  // Force job to pending to simulate time passing for retry
  const retryJob = (await automationRepo.listJobs())[0];
  await automationRepo.updateJob(retryJob.id, { status: 'PENDING' });
  
  await automationService.processJobs(); // Process job attempt 2

  notifs = await notificationRepo.listNotifications();
  const smsNotifs = notifs.filter(n => n.channel === 'SMS');
  const emailNotifs = notifs.filter(n => n.channel === 'EMAIL');

  if (smsNotifs.length === 1 && emailNotifs.length === 1 && emailNotifs[0].status === 'SENT') {
    console.log('✅ PASS: SMS was not duplicated. Email was successfully sent on retry.');
  } else {
    console.log('❌ FAIL: Retry duplication issue!', smsNotifs.length, emailNotifs.length);
  }

  // Restore fetch
  global.fetch = originalFetch;
  console.log('\n--- PHASE 12.2 TESTS COMPLETED ---');
}

runTests().catch(console.error);

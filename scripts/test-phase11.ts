/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '../src/repositories/index';
import { getBookingRepository, getSettingsRepository, getAutomationRepository, getNotificationRepository, getNotificationDeliveryRepository, getNotificationTemplateRepository } from '../src/repositories/index';
import { AutomationService } from '../src/services/automationService';
import { notificationService } from '../src/services/NotificationService';
import { INITIAL_NOTIFICATION_TEMPLATES } from '../src/repositories/memory/mockData';

async function runTests() {
  console.log('--- STARTING PHASE 11 NOTIFICATION TESTS (MEMORY MODE) ---\n');
  setRepositoryModeForTesting('memory');

  const settingsRepo = getSettingsRepository();
  const automationRepo = getAutomationRepository();
  const notificationRepo = getNotificationRepository();
  const deliveryRepo = getNotificationDeliveryRepository();
  const bookingRepo = getBookingRepository();
  
  const automationService = new AutomationService();

  console.log('1. Verifying Settings Update');
  const settings = await settingsRepo.getSettings();
  console.log('Initial Notification Settings:', JSON.stringify(settings.notifications));
  
  // Turn off email but keep SMS
  await settingsRepo.updateSettings({
    notifications: {
      ...settings.notifications,
      emailEnabled: false,
      smsEnabled: true,
      enabled: true,
      zaloEnabled: false,
      inAppEnabled: true,
    }
  });
  console.log('Updated Settings to disable EMAIL notifications globally\n');

  console.log('2. Creating Mock Booking for Feedback Reminder');
  const booking = await bookingRepo.create({
    id: 'book-test-11',
    bookingCode: 'TESTBK999',
    customerId: 'cust-999',
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

  console.log('3. Running Automation Scanner');
  await automationService.scanAndCreateFeedbackJobs();
  
  const jobs = await automationRepo.listJobs();
  console.log(`Found ${jobs.length} automation jobs`);
  
  console.log('4. Processing Automation Jobs (Should trigger notifications)');
  await automationService.processJobs();

  console.log('\n5. Verifying Notifications');
  const notifications = await notificationRepo.listNotifications({ bookingId: booking.id });
  console.log(`Total notifications created: ${notifications.length}`);

  for (const notif of notifications) {
    console.log(`- Notif ID: ${notif.id} | Channel: ${notif.channel} | Status: ${notif.status}`);
  }

  const emailNotif = notifications.find(n => n.channel === 'EMAIL');
  const smsNotif = notifications.find(n => n.channel === 'SMS');

  if (emailNotif?.status === 'SKIPPED') {
    console.log('✅ PASS: Email notification was SKIPPED due to global settings.');
  } else {
    console.log('❌ FAIL: Email notification was not skipped.');
  }

  if (smsNotif?.status === 'SENT') {
    console.log('✅ PASS: SMS notification was SENT successfully.');
  } else {
    console.log('❌ FAIL: SMS notification was not sent.');
  }

  console.log('\n6. Verifying Delivery Logs');
  const deliveries = await deliveryRepo.listDeliveries();
  console.log(`Total delivery logs: ${deliveries.length}`);
  if (deliveries.length === 1 && deliveries[0].status === 'SENT') {
    console.log('✅ PASS: Exactly 1 delivery log recorded for the SMS.');
  } else {
    console.log('❌ FAIL: Incorrect delivery logs count or status.');
  }

  console.log('\n7. Verifying Templates Engine');
  try {
    const tplRepo = getNotificationTemplateRepository();
    const allTpl = await tplRepo.listTemplates();
    console.log(`Total templates loaded: ${allTpl.length}`);

    if (allTpl.length === INITIAL_NOTIFICATION_TEMPLATES.length) {
      console.log('✅ PASS: Templates loaded correctly from Memory mock data.');
    } else {
      console.log('❌ FAIL: Templates failed to load.');
    }
  } catch (err: any) {
    console.log('❌ FAIL: Template repo failed', err);
  }

  console.log('\n--- PHASE 11 TESTS COMPLETED ---');
}

runTests().catch(console.error);

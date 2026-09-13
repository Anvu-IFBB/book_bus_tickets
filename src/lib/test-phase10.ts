/* eslint-disable */
// @ts-nocheck
// @ts-nocheck
import { setRepositoryModeForTesting } from '../repositories';
import { AutomationService } from '../services/automationService';
import { getAutomationRepository, getBookingRepository, getSettingsRepository, getFeedbackRepository } from '../repositories';
import { Booking } from '../types/booking';

async function testPhase10() {
  console.log('Bắt đầu chạy Test Suite Phase 10: Automation & Background Engine...\n');
  setRepositoryModeForTesting('memory');

  const automationService = new AutomationService();
  const automationRepo = getAutomationRepository();
  const bookingRepo = getBookingRepository();
  const settingsRepo = getSettingsRepository();
  const feedbackRepo = getFeedbackRepository();

  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  };

  try {
    // Thiết lập môi trường test
    await settingsRepo.updateSettings({
      automationEnabled: true,
      autoSendFeedbackReminder: true,
      feedbackDelayHours: 2, // 2 giờ
      maxRetryAttempts: 3,
    });

    console.log('--- Test 1: Booking Eligibility (Delay Check) ---');
    // Tạo 1 Booking vừa hoàn thành (chưa đủ 2 giờ)
    const now = new Date();
    const recentBooking = await bookingRepo.create({
      id: 'bk-recent-1',
      bookingCode: 'RECENT01',
      customerId: 'cus-1',
      serviceType: 'TICKET',
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      completedAt: now.toISOString(), // Vừa hoàn thành
      departure: 'HN', destination: 'QN', travelDate: '2026-10-10', totalAmount: 100000,
    } as any);

    // Tạo 1 Booking đã hoàn thành cách đây 3 giờ
    const oldDate = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const oldBooking = await bookingRepo.create({
      id: 'bk-old-1',
      bookingCode: 'OLD01',
      customerId: 'cus-2',
      serviceType: 'TICKET',
      bookingStatus: 'COMPLETED',
      paymentStatus: 'PAID',
      createdAt: oldDate.toISOString(),
      updatedAt: oldDate.toISOString(),
      completedAt: oldDate.toISOString(), // Đã qua 3 giờ
      departure: 'HN', destination: 'QN', travelDate: '2026-10-10', totalAmount: 100000,
    } as any);

    await automationService.scanAndCreateFeedbackJobs();
    let jobs = await automationRepo.listJobs();

    assert(jobs.length === 1, 'Chỉ sinh Job cho Booking đã qua 2 giờ');
    assert(jobs[0].entityId === 'bk-old-1', 'Job được sinh ra đúng entityId = bk-old-1');

    console.log('\n--- Test 2: Idempotency (Không trùng lặp Job) ---');
    // Chạy scan lần 2
    await automationService.scanAndCreateFeedbackJobs();
    jobs = await automationRepo.listJobs();
    assert(jobs.length === 1, 'Chạy scan lần 2 không sinh thêm Job trùng lặp cho OLD01 (Idempotency Key hoạt động)');

    console.log('\n--- Test 3: Bỏ qua khi Feedback đã tồn tại ---');
    // Submit feedback cho OLD01
    await feedbackRepo.create({
      id: 'fb-1',
      bookingCode: 'OLD01',
      customerPhone: '0901234567',
      rating: 5,
      content: 'Good',
      status: 'NEW',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    } as unknown as any);

    // Chạy processJobs (job hiện tại đang PENDING)
    await automationService.processJobs();
    const updatedJob = await automationRepo.findById(jobs[0].id);
    assert(updatedJob?.status === 'COMPLETED', 'Job hoàn thành bình thường (skipped internally do Feedback đã tồn tại)');
    
    const executions = await automationRepo.getExecutionsByJobId(jobs[0].id);
    assert(executions.length === 1, 'Có sinh Execution');
    assert(executions[0].logs.some(l => l.includes('Feedback already exists')), 'Log ghi nhận đã bỏ qua vì Feedback tồn tại');

    console.log('\n--- Test 4: Retry Limit (Chạy giả lập Failed) ---');
    // Cố tình tạo 1 Job failed liên tục (bằng cách cho entityId = "không tồn tại" để hàm throw error)
    const failJobIdempotency = 'FEEDBACK_REMINDER:fake-bk';
    const failJob = await automationRepo.createJobIfNotExist(failJobIdempotency, {
      type: 'FEEDBACK_REMINDER',
      idempotencyKey: failJobIdempotency,
      entityId: 'fake-bk',
      status: 'PENDING',
      attempts: 0,
      maxAttempts: 3,
      scheduledAt: now.toISOString(),
    });

    // Lần 1
    await automationService.processJobs();
    let updatedFailJob = await automationRepo.findById(failJob!.id);
    assert(updatedFailJob?.status === 'FAILED', 'Lần 1: Job bị lỗi -> FAILED');
    assert(updatedFailJob?.attempts === 1, 'Số attempt = 1');
    assert(!!updatedFailJob?.nextRetryAt, 'Đã đặt lịch retry (nextRetryAt có giá trị)');

    // Chỉnh thời gian nextRetry về quá khứ để ép chạy ngay
    await automationRepo.updateJob(failJob!.id, { nextRetryAt: oldDate.toISOString() });
    
    // Lần 2
    await automationService.processJobs();
    updatedFailJob = await automationRepo.findById(failJob!.id);
    assert(updatedFailJob?.attempts === 2, 'Lần 2: Số attempt = 2');

    // Chỉnh thời gian
    await automationRepo.updateJob(failJob!.id, { nextRetryAt: oldDate.toISOString() });

    // Lần 3
    await automationService.processJobs();
    updatedFailJob = await automationRepo.findById(failJob!.id);
    assert(updatedFailJob?.attempts === 3, 'Lần 3: Số attempt = 3');
    assert(updatedFailJob?.status === 'FAILED', 'Trạng thái là FAILED');
    assert(updatedFailJob?.nextRetryAt === undefined, 'Đã hết lượt retry, nextRetryAt = undefined');

  } catch (err: any) {
    console.error('Lỗi không mong muốn trong quá trình test:', err.message);
    failed++;
  }

  console.log(`\nKết quả Test Phase 10:`);
  console.log(`- Passed: ${passed}`);
  console.log(`- Failed: ${failed}`);
  
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

testPhase10();

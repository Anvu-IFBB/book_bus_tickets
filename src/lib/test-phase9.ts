/* eslint-disable */
// @ts-nocheck
import { feedbackService } from '@/services/feedbackService';
import { getBookingRepository, getCustomerRepository } from '@/repositories';
import { CreateFeedbackDTO } from '@/types/feedback';

// Force Memory Repo for safe testing without touching Prod Firestore
process.env.NEXT_PUBLIC_USE_FIRESTORE = 'false';

async function runTests() {
  console.log('=== BẮT ĐẦU TEST PHASE 9: FEEDBACK SYSTEM ===');
  const bookingRepo = getBookingRepository();
  const customerRepo = getCustomerRepository();

  // 1. Setup mock data
  const customer = await customerRepo.create({
    id: 'cus-1',
    name: 'Test Customer',
    phone: '0987654321',
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalSpent: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await bookingRepo.create({
    id: 'bk-1',
    bookingCode: 'TEST99',
    customerId: customer.id,
    serviceType: 'LIMOUSINE',
    departure: 'Hanoi',
    destination: 'Halong',
    travelDate: '2026-10-10',
    travelTime: '10:00',
    passengerCount: 1,
    pickupAddress: 'Office A',
    dropoffAddress: 'Office B',
    price: 100000,
    deposit: 0,
    paymentStatus: 'UNPAID',
    bookingStatus: 'NEW',
    statusHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Test 1: Đánh giá khi chuyến đi chưa hoàn thành
  try {
    console.log('Test 1: Submit feedback cho chuyến đi chưa hoàn thành');
    const dto: CreateFeedbackDTO = {
      bookingCode: 'TEST99',
      customerPhone: '0987654321',
      rating: 5,
      content: 'Rất tốt'
    };
    await feedbackService.submitFeedback(dto);
    console.error('❌ LỖI: Đáng lẽ phải chặn vì chưa hoàn thành');
  } catch (error: unknown) {
    console.log('✅ Pass: Bị chặn thành công -', error instanceof Error ? error.message : String(error));
  }

  // Update booking to COMPLETED
  await bookingRepo.update('bk-1', { bookingStatus: 'COMPLETED' });

  // Test 2: Sai số điện thoại
  try {
    console.log('Test 2: Sai số điện thoại');
    const dto: CreateFeedbackDTO = {
      bookingCode: 'TEST99',
      customerPhone: '0999999999',
      rating: 5,
      content: 'Rất tốt'
    };
    await feedbackService.submitFeedback(dto);
    console.error('❌ LỖI: Đáng lẽ phải chặn vì sai SĐT');
  } catch (error: unknown) {
    console.log('✅ Pass: Bị chặn thành công -', error instanceof Error ? error.message : String(error));
  }

  // Test 3: Đánh giá hợp lệ (1 sao -> NEEDS_REVIEW)
  try {
    console.log('Test 3: Gửi feedback hợp lệ (1 sao)');
    const dto: CreateFeedbackDTO = {
      bookingCode: 'TEST99',
      customerPhone: '0987654321',
      rating: 1,
      content: 'Tài xế đi ẩu'
    };
    const saved = await feedbackService.submitFeedback(dto);
    if (saved.category === 'NEEDS_REVIEW' && saved.status === 'NEW') {
      console.log('✅ Pass: Ghi nhận thành công, trạng thái là NEEDS_REVIEW (NEW). ID:', saved.id);
    } else {
      console.error('❌ LỖI: Phân loại sai. Expected NEEDS_REVIEW, got', saved.category);
    }
  } catch (error: unknown) {
    console.error('❌ LỖI KHÔNG MONG MUỐN:', error instanceof Error ? error.message : String(error));
  }

  // Test 4: Chặn đánh giá lần 2
  try {
    console.log('Test 4: Chặn đánh giá trùng lặp');
    const dto: CreateFeedbackDTO = {
      bookingCode: 'TEST99',
      customerPhone: '0987654321',
      rating: 5,
      content: 'Cập nhật lại thành 5 sao'
    };
    await feedbackService.submitFeedback(dto);
    console.error('❌ LỖI: Đáng lẽ phải chặn vì Idempotency');
  } catch (error: unknown) {
    console.log('✅ Pass: Bị chặn thành công -', error instanceof Error ? error.message : String(error));
  }

  // Test 5: Admin Update Status
  try {
    console.log('Test 5: Admin xử lý khiếu nại');
    const list = await feedbackService.getAdminFeedbacks();
    const fb = list[0];
    const updated = await feedbackService.processNegativeFeedback(
      fb.id,
      'RESOLVED',
      'Đã gọi xin lỗi và bồi thường',
      'admin@limousine.vn'
    );
    if (updated.status === 'RESOLVED') {
      console.log('✅ Pass: Admin cập nhật trạng thái thành công.');
    } else {
      console.error('❌ LỖI: Trạng thái không đổi');
    }
  } catch (error: unknown) {
    console.error('❌ LỖI KHÔNG MONG MUỐN:', error instanceof Error ? error.message : String(error));
  }

  console.log('=== TEST HOÀN TẤT ===');
}

runTests().then(() => process.exit(0)).catch(e => {
  console.error(e);
  process.exit(1);
});

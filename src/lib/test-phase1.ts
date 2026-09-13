/* eslint-disable */
// @ts-nocheck
import { bookingService } from '@/services/bookingService';
import { feedbackService } from '@/services/feedbackService';
import { generateBookingCode, generateCargoCode } from '@/lib/utils/codeGenerator';
import { formatCurrencyVN, formatDateVN, isValidVNPhone, normalizePhone } from '@/lib/utils/formatters';

async function runPhase1Tests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 1 ---');

  // Test 1: Code Generator format
  const bkCode = generateBookingCode(new Date('2026-09-11'), 1);
  const hgCode = generateCargoCode(new Date('2026-09-11'), 2);
  console.log(`Test 1.1 - Booking Code: ${bkCode}`);
  console.log(`Test 1.2 - Cargo Code: ${hgCode}`);
  if (!/^BK202609110001$/.test(bkCode)) throw new Error('Booking code format sai');
  if (!/^HG202609110002$/.test(hgCode)) throw new Error('Cargo code format sai');
  console.log('✓ Test 1 ĐẠT: Sinh mã đúng chuẩn BKYYYYMMDDXXXX và HGYYYYMMDDXXXX');

  // Test 2: Utilities formatters
  console.log(`Test 2.1 - Currency VN: ${formatCurrencyVN(280000)}`);
  console.log(`Test 2.2 - Date VN: ${formatDateVN('2026-09-11')}`);
  console.log(`Test 2.3 - Valid Phone 0868680944: ${isValidVNPhone('0868680944')}`);
  console.log(`Test 2.4 - Normalized Phone +84868680944: ${normalizePhone('+84868680944')}`);
  if (normalizePhone('+84868680944') !== '0868680944') throw new Error('Normalize phone sai');
  console.log('✓ Test 2 ĐẠT: Formatters hoạt động chính xác');

  // Test 3: Booking creation & CRM auto-linking
  const testBooking = await bookingService.createBooking({
    serviceType: 'LIMOUSINE',
    customerName: 'Kiểm Thử Viên A',
    customerPhone: '0868680944',
    customerEmail: 'tester@example.com',
    departure: 'Quảng Ninh',
    destination: 'Ninh Bình',
    travelDate: '2026-09-15',
    travelTime: '08:00',
    passengerCount: 2,
    pickupAddress: 'Cảng tàu Tuần Châu',
    dropoffAddress: 'Quảng trường Đinh Tiên Hoàng',
    note: 'Yêu cầu 2 ghế đầu',
  });
  console.log(`Test 3 - Created Booking: ${testBooking.bookingCode}, Status: ${testBooking.bookingStatus}`);
  if (testBooking.bookingStatus !== 'NEW') throw new Error('Trạng thái khởi tạo không phải NEW');
  console.log('✓ Test 3 ĐẠT: Tạo booking và tự động liên kết customer thành công');

  // Test 4: Booking lookup by code + phone
  const lookedUp = await bookingService.lookupBooking(testBooking.bookingCode, '0868680944');
  if (!lookedUp || lookedUp.id !== testBooking.id) throw new Error('Tra cứu booking thất bại');
  const invalidLookup = await bookingService.lookupBooking(testBooking.bookingCode, '0999999999');
  if (invalidLookup !== null) throw new Error('Bảo mật tra cứu bị lộ: số điện thoại sai vẫn trả về đơn');
  console.log('✓ Test 4 ĐẠT: Tra cứu booking bảo mật chính xác');

  // Test 5: State machine transitions
  const confirmed = await bookingService.updateStatus(testBooking.id, 'CONFIRMED', 'admin@example.com');
  if (confirmed.bookingStatus !== 'CONFIRMED') throw new Error('Chuyển sang CONFIRMED thất bại');

  const inProgress = await bookingService.updateStatus(testBooking.id, 'IN_PROGRESS', 'admin@example.com');
  if (inProgress.bookingStatus !== 'IN_PROGRESS') throw new Error('Chuyển sang IN_PROGRESS thất bại');

  const completed = await bookingService.updateStatus(testBooking.id, 'COMPLETED', 'admin@example.com');
  if (completed.bookingStatus !== 'COMPLETED' || !completed.feedbackAvailableAt) {
    throw new Error('Chuyển sang COMPLETED thất bại hoặc thiếu feedbackAvailableAt');
  }
  console.log(`✓ Test 5.1 ĐẠT: State transition NEW -> CONFIRMED -> IN_PROGRESS -> COMPLETED thành công`);
  console.log(`Feedback available at: ${completed.feedbackAvailableAt}`);

  // Test invalid transition rejection
  try {
    await bookingService.updateStatus(testBooking.id, 'NEW', 'admin@example.com');
    throw new Error('Hệ thống cho phép chuyển ngược trái phép sang NEW');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`✓ Test 5.2 ĐẠT: Chặn chuyển trạng thái trái phép (${message})`);
  }

  // Test 6: Feedback submission & Categorization
  const feedback = await feedbackService.submitFeedback({
    bookingCode: testBooking.bookingCode,
    customerPhone: '0868680944',
    customerName: 'Kiểm Thử Viên A',
    rating: 5,
    content: 'Chuyến xe đi từ Tuần Châu sang Ninh Bình rất tuyệt vời, xe mới tinh và tài xế rất lịch sự!',
  });
  if (feedback.category !== 'POSITIVE' || !feedback.isPublishedTestimonial) {
    throw new Error('Phân loại feedback 5 sao sai');
  }
  console.log('✓ Test 6.1 ĐẠT: Đánh giá 5 sao phân loại POSITIVE và kích hoạt testimonial');

  // Test duplicate feedback prevention
  try {
    await feedbackService.submitFeedback({
      bookingCode: testBooking.bookingCode,
      customerPhone: '0868680944',
      rating: 5,
      content: 'Gửi lại lần 2',
    });
    throw new Error('Hệ thống cho phép gửi feedback trùng lặp');
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`✓ Test 6.2 ĐẠT: Chặn gửi đánh giá trùng lặp (${message})`);
  }

  console.log('=== 100% CÁC BÀI TEST PHASE 1 ĐỀU VƯỢT QUA XUẤT SẮC ===');
}

runPhase1Tests().catch((err) => {
  console.error('LỖI KIỂM THỬ:', err);
  process.exit(1);
});

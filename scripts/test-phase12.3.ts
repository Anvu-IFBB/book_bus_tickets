/* eslint-disable */
// @ts-nocheck
import { createBookingAction, updateBookingStatusAction } from '../src/app/actions/bookingActions';
import { lookupBookingAction } from '../src/app/actions/lookupActions';
import { confirmDepositAction } from '../src/app/actions/paymentActions';

process.env.REPOSITORY_MODE = 'memory';

async function runTests() {
  console.log('--- BẮT ĐẦU TEST PHASE 12.3 (SECURITY HARDENING) ---');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    console.log('\n1. Kiểm tra Zod Validation (Booking)');
    // Gửi data thiếu trường để trigger Zod
    const res1 = await createBookingAction({
      serviceType: 'LIMOUSINE',
      // @ts-ignore
      customerName: 'A', // Qúa ngắn
      customerPhone: '123', // Sai định dạng
    } as any);
    assert(res1.success === false && res1.error!.includes('hợp lệ'), 'Zod chặn CreateBookingDTO không hợp lệ');

    const res2 = await updateBookingStatusAction('book-1', 'INVALID_STATUS' as any);
    assert(res2.success === false && res2.error!.includes('hợp lệ'), 'Zod chặn updateBookingStatusAction status sai');

    console.log('\n2. Kiểm tra Zod Validation (Payment)');
    const res3 = await confirmDepositAction('');
    assert(res3.success === false && res3.error!.includes('hợp lệ'), 'Zod chặn paymentId rỗng');

    console.log('\n3. Kiểm tra Public Data Leakage');
    // Mock 1 booking hợp lệ
    const validBooking = await createBookingAction({
      serviceType: 'LIMOUSINE',
      customerName: 'John Doe',
      customerPhone: '0987654321',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      travelDate: '2029-12-31',
      travelTime: '10:00',
      pickupAddress: 'HN',
      dropoffAddress: 'HP',
      note: 'INTERNAL_NOTE_123'
    } as any);
    
    if (validBooking.success && validBooking.data) {
      const lookupRes = await lookupBookingAction(validBooking.data.bookingCode, '0987654321');
      assert(lookupRes.success === true, 'Tra cứu thành công');
      if (lookupRes.success && lookupRes.data) {
        assert((lookupRes.data as any).note === undefined, 'Trường note nội bộ đã bị ẩn');
        assert((lookupRes.data as any).customerId === undefined, 'Trường customerId đã bị ẩn');
      }
    } else {
      assert(false, 'Không thể tạo booking để test leakage');
    }

    console.log('\n4. Kiểm tra Cron Route Authentication');
    const { GET } = await import('../src/app/api/cron/automation/route');
    process.env.CRON_SECRET = 'my-secret';
    const fakeRequest = {
      headers: {
        get: (key: string) => (key === 'authorization' ? 'Bearer wrong-secret' : null)
      }
    } as any;
    
    const res4 = await GET(fakeRequest);
    assert(res4.status === 401, 'Cron endpoint chặn request sai secret');

    console.log('\n--- KẾT QUẢ TEST ---');
    console.log(`PASS: ${passed}`);
    console.log(`FAIL: ${failed}`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test script failed:', error);
    process.exit(1);
  }
}

runTests();

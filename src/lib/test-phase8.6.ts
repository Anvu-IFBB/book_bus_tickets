/* eslint-disable */
// @ts-nocheck
// @ts-nocheck
import { setRepositoryModeForTesting } from '@/repositories';
import { bookingService } from '@/services/bookingService';
import { lookupBookingAction } from '@/app/actions/lookupActions';
import { Booking } from '@/types/booking';

export async function runPhase8_6Tests() {
  console.log('=== BẮT ĐẦU TEST PHASE 8.6: SECURITY VERIFICATION ===\n');

  try {
    setRepositoryModeForTesting('memory');
    console.log('✅ [Mode] Đã thiết lập Repository về Memory Mode\n');

    // TEST 1: Khởi tạo Booking có chứa dữ liệu nhạy cảm
    console.log('--- TEST 1: Chuẩn bị dữ liệu ---');
    const booking = await bookingService.createBooking({
      serviceType: 'LIMOUSINE',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      travelDate: '2026-10-10',
      travelTime: '08:00',
      customerName: 'Test Security',
      customerPhone: '0911223344',
      pickupAddress: 'HN',
      dropoffAddress: 'HP'
    });
    
    // Gán dữ liệu nhạy cảm
    const fleetRepo = (await import('@/repositories')).getFleetRepository();
    const vehicle = await fleetRepo.createVehicle({
      id: 'v1', licensePlate: '29A-12345', name: 'Ford Transit', seatCount: 16, status: 'AVAILABLE',
      vehicleType: 'LIMOUSINE',
      createdAt: '', updatedAt: ''
    });
    const driver = await fleetRepo.createDriver({
      id: 'd1', name: 'Nguyen Van Tai', phone: '0912345678', licenseNumber: 'B2-123', status: 'AVAILABLE',
      createdAt: '', updatedAt: ''
    });

    const opsService = (await import('@/services/operationsService')).operationsService;
    await opsService.assignVehicle(booking.id, vehicle.id, 'admin@limousine.vn', 'Test xe', 'ADMIN');
    await opsService.assignDriver(booking.id, driver.id, 'admin@limousine.vn', 'Test tài', 'ADMIN');

    const updatedBooking = await (await import('@/repositories')).getBookingRepository().findById(booking.id);
    console.log('✅ Đã tạo booking và phân công tài/xe. Mã:', updatedBooking?.bookingCode);

    // TEST 2: Lookup Public Booking - Kiểm tra Information Leakage
    console.log('\n--- TEST 2: Sanitize Public Lookup ---');
    const res = await lookupBookingAction(updatedBooking!.bookingCode, '0911223344');
    
    if (!res.success || !res.data) {
      throw new Error('Tra cứu thất bại');
    }

    const publicData = res.data as unknown as Record<string, unknown>; // Cast để truy cập các field đã xóa
    
    console.log('[DEBUG] Dữ liệu trả về:', JSON.stringify(publicData, null, 2));

    if (publicData.customerId) throw new Error('CẢNH BÁO: Rò rỉ customerId');
    if (publicData.driverId) throw new Error('CẢNH BÁO: Rò rỉ driverId');
    if (publicData.vehicleId) throw new Error('CẢNH BÁO: Rò rỉ vehicleId');
    
    let isEmailLeaked = false;
    if (publicData.statusHistory && Array.isArray(publicData.statusHistory)) {
      publicData.statusHistory.forEach((h: Record<string, string>) => {
        if (h.changedBy.includes('@')) {
          isEmailLeaked = true;
        }
      });
    }
    if (isEmailLeaked) throw new Error('CẢNH BÁO: Rò rỉ email quản trị viên trong statusHistory');

    console.log('✅ PASS: lookupBookingAction đã sanitize dữ liệu nhạy cảm (Information Leakage = FIX).');

    console.log('\n🎉 TẤT CẢ TEST PHASE 8.6 ĐỀU PASS!\n');
  } catch (error) {
    console.error('\n❌ TEST THẤT BẠI:', error);
    process.exit(1);
  }
}

// Chạy trực tiếp nếu execute qua ts-node
if (require.main === module) {
  runPhase8_6Tests();
}

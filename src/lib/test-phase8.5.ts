/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '@/repositories';
import { bookingService } from '@/services/bookingService';
import { paymentService } from '@/services/paymentService';
import { operationsService } from '@/services/operationsService';
import { invoiceService } from '@/services/invoiceService';

export async function runPhase8_5Tests() {
  console.log('=== BẮT ĐẦU TEST PHASE 8.5: SECURITY & SERVER-SIDE HARDENING ===\n');

  try {
    setRepositoryModeForTesting('memory');
    console.log('✅ [Mode] Đã thiết lập Repository về Memory Mode\n');

    // TEST 1: Khởi tạo Booking thông qua Service (Đại diện cho Fallback Mode)
    console.log('--- TEST 1: Khởi tạo Booking ---');
    const booking = await bookingService.createBooking({
      serviceType: 'LIMOUSINE',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      travelDate: '2026-10-10',
      travelTime: '08:00',
      customerName: 'Security Test',
      customerPhone: '0987123456',
      pickupAddress: 'Nội thành HN',
      dropoffAddress: 'Trung tâm HP'
    });
    
    console.log('✅ Khởi tạo Booking thành công:', booking.bookingCode);

    // TEST 2: Phân xe, phân tài (Operations Service)
    console.log('\n--- TEST 2: Phân Xe & Tài Xế ---');
    // Fake a vehicle and driver directly since we are in memory mode
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

    await operationsService.assignVehicle(booking.id, vehicle.id, 'admin@test.com', 'Test xe', 'ADMIN');
    await operationsService.assignDriver(booking.id, driver.id, 'admin@test.com', 'Test tài xế', 'ADMIN');

    const updatedBooking = await (await import('@/repositories')).getBookingRepository().findById(booking.id);
    if (updatedBooking?.vehicleId !== vehicle.id) throw new Error('Assign Vehicle thất bại');
    if (updatedBooking?.driverId !== driver.id) throw new Error('Assign Driver thất bại');
    console.log('✅ Phân xe & tài xế thành công');

    // TEST 3: Payment
    console.log('\n--- TEST 3: Xác nhận cọc ---');
    let payment = await paymentService.getPaymentByBookingId(booking.id);
    if (!payment) throw new Error('Payment chưa được tạo');

    // Set deposit amount
    const paymentRepo = (await import('@/repositories')).getPaymentRepository();
    await paymentRepo.updatePayment(payment.id, { depositAmount: 100000, totalAmount: 300000, remainingAmount: 300000 });
    
    payment = await paymentService.confirmDeposit(payment.id, 'admin@test.com', 'ADMIN', 'BANK-TEST');
    if (payment.status !== 'DEPOSITED') throw new Error('Trạng thái không đúng');
    console.log('✅ Xác nhận cọc thành công');

    // TEST 4: Generate Invoice
    console.log('\n--- TEST 4: Khởi tạo Hóa đơn ---');
    const invoice = await invoiceService.generateInvoice(payment.id, 'admin@test.com', 'ADMIN');
    if (!invoice) throw new Error('Hóa đơn không tạo được');
    console.log('✅ Hóa đơn tạo thành công:', invoice.id);

    // Tắt memory mode
    setRepositoryModeForTesting(null);
    console.log('\n=== TẤT CẢ TEST PHASE 8.5 PASS ✅ ===');
  } catch (error) {
    console.error('\n❌ TEST THẤT BẠI:', error);
    setRepositoryModeForTesting(null);
    process.exit(1);
  }
}

if (require.main === module) {
  runPhase8_5Tests();
}

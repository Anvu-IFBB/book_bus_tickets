/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '@/repositories';
import { bookingService } from '@/services/bookingService';
import { paymentService } from '@/services/paymentService';
import { invoiceService } from '@/services/invoiceService';

export async function runPhase8Tests() {
  console.log('=== BẮT ĐẦU TEST PHASE 8: PAYMENTS & DEPOSIT ===\n');

  try {
    // 1. Chạy trên Memory Mode để không ảnh hưởng dữ liệu thật
    setRepositoryModeForTesting('memory');
    console.log('✅ [Mode] Đã thiết lập Repository về Memory Mode\n');

    // TEST 1: Tạo Booking và kiểm tra Payment PENDING
    console.log('--- TEST 1: Khởi tạo Booking & Payment ---');
    const booking = await bookingService.createBooking({
      serviceType: 'LIMOUSINE',
      departure: 'Hà Nội',
      destination: 'Hải Phòng',
      travelDate: '2026-10-10',
      travelTime: '08:00',
      customerName: 'Nguyễn Văn Test',
      customerPhone: '0987123456',
      pickupAddress: 'Nội thành HN',
      dropoffAddress: 'Trung tâm HP'
    });
    
    // Giả lập Admin đặt giá và cọc
    const bookingRepo = (await import('@/repositories')).getBookingRepository();
    await bookingRepo.update(booking.id, { price: 300000, deposit: 100000 });
    booking.price = 300000;
    booking.deposit = 100000;
    
    // Update payment request that was auto-generated
    let payment = await paymentService.getPaymentByBookingId(booking.id);
    if (!payment) throw new Error('Không tạo được Payment khi tạo Booking');
    if (payment.status !== 'PENDING') throw new Error('Payment không ở trạng thái PENDING');
    
    // Sync payment with new price (since we updated price after creation)
    const paymentRepo = (await import('@/repositories')).getPaymentRepository();
    await paymentRepo.updatePayment(payment.id, { 
      totalAmount: 300000, 
      depositAmount: 100000, 
      remainingAmount: 300000 
    });
    payment = await paymentService.getPaymentByBookingId(booking.id);

    console.log('✅ Khởi tạo Payment thành công. Mã:', payment?.id);
    console.log('✅ Trạng thái:', payment?.status);

    // TEST 2: Xác nhận cọc
    console.log('\n--- TEST 2: Xác nhận tiền cọc ---');
    payment = await paymentService.confirmDeposit(payment!.id, 'admin@test.com', 'ADMIN', 'BANK-123');
    if (payment.status !== 'DEPOSITED') throw new Error('Trạng thái không chuyển sang DEPOSITED');
    if (payment.paidAmount !== 100000) throw new Error('Số tiền đã trả (cọc) sai');
    if (payment.remainingAmount !== 200000) throw new Error('Số tiền còn lại sai');
    
    let updatedBooking = await bookingRepo.findById(booking.id);
    if (updatedBooking?.paymentStatus !== 'DEPOSIT_PAID') throw new Error('Booking paymentStatus chưa đồng bộ');
    console.log('✅ Xác nhận cọc thành công. Đã đồng bộ sang Booking.');

    // TEST 3: Xác nhận thanh toán đủ
    console.log('\n--- TEST 3: Xác nhận thanh toán toàn bộ ---');
    payment = await paymentService.confirmPayment(payment.id, 'admin@test.com', 'ADMIN', 'BANK-456');
    if (payment.status !== 'PAID') throw new Error('Trạng thái không chuyển sang PAID');
    if (payment.paidAmount !== 300000) throw new Error('Số tiền đã trả sai');
    if (payment.remainingAmount !== 0) throw new Error('Số tiền còn lại sai');
    
    updatedBooking = await bookingRepo.findById(booking.id);
    if (updatedBooking?.paymentStatus !== 'PAID') throw new Error('Booking paymentStatus chưa đồng bộ');
    console.log('✅ Xác nhận thanh toán đủ thành công.');

    // TEST 4: Khởi tạo Hóa đơn (Invoice)
    console.log('\n--- TEST 4: Khởi tạo Hóa đơn ---');
    const invoice = await invoiceService.generateInvoice(payment.id, 'admin@test.com', 'ADMIN');
    if (!invoice) throw new Error('Không tạo được Hóa đơn');
    if (invoice.total !== 300000) throw new Error('Tổng tiền Hóa đơn sai');
    console.log('✅ Tạo Hóa đơn thành công. Mã:', invoice.id);

    // TEST 5: Refund
    console.log('\n--- TEST 5: Hoàn tiền (Refund) ---');
    payment = await paymentService.refundPayment(payment.id, 'admin@test.com', 'ADMIN', 'Khách hủy chuyến');
    if (payment.status !== 'REFUNDED') throw new Error('Trạng thái không chuyển sang REFUNDED');
    if (payment.paidAmount !== 0) throw new Error('Sau khi refund, paidAmount phải về 0 (hoặc logic khác tùy nghiệp vụ)');
    
    updatedBooking = await bookingRepo.findById(booking.id);
    if (updatedBooking?.paymentStatus !== 'REFUNDED') throw new Error('Booking paymentStatus chưa đồng bộ REFUNDED');
    console.log('✅ Hoàn tiền thành công.');

    // 6. Dọn dẹp
    setRepositoryModeForTesting(null);
    console.log('\n=== TẤT CẢ TEST PHASE 8 PASS ✅ ===');
  } catch (error) {
    console.error('\n❌ TEST THẤT BẠI:', error);
    setRepositoryModeForTesting(null);
    process.exit(1);
  }
}

// Chạy trực tiếp nếu execute file này bằng tsx
if (require.main === module) {
  runPhase8Tests();
}

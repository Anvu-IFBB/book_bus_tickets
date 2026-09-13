/* eslint-disable */
// @ts-nocheck
import { bookingService } from '@/services/bookingService';
import {
  limousineBookingSchema,
  contractBookingSchema,
  cargoBookingSchema,
  tourBookingSchema,
} from '@/lib/validation/bookingSchema';

async function runPhase4Tests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 4 (BOOKING ENGINE & CLIENT FLOW) ===');

  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // 1. Test Limousine Flow
  console.log('\n--- Test 1: Flow Đặt Vé Limousine VIP ---');
  const limoLimoData = {
    serviceType: 'LIMOUSINE' as const,
    customerName: 'Nguyễn Văn An',
    customerPhone: '0868680944',
    departure: 'Quảng Ninh',
    destination: 'Ninh Bình',
    travelDate: todayStr,
    travelTime: '07:00',
    passengerCount: 2,
    pickupAddress: 'Cổng Tuần Châu, Hạ Long',
    dropoffAddress: 'Khách sạn The Reed, TP Ninh Bình',
  };

  const limoValidation = limousineBookingSchema.safeParse(limoLimoData);
  if (!limoValidation.success) {
    throw new Error(`Validation Limousine thất bại: ${JSON.stringify(limoValidation.error)}`);
  }
  console.log('✓ 1.1 Validation Limousine đạt chuẩn');

  const limoBooking = await bookingService.createBooking(limoLimoData);
  if (!limoBooking.bookingCode.startsWith('BK')) {
    throw new Error(`Mã booking Limousine không hợp lệ: ${limoBooking.bookingCode}`);
  }
  if (limoBooking.bookingStatus !== 'NEW' || limoBooking.passengerCount !== 2) {
    throw new Error('Dữ liệu Booking Limousine không khớp');
  }
  console.log(`✓ 1.2 Tạo booking Limousine thành công: Mã ${limoBooking.bookingCode}, Trạng thái ${limoBooking.bookingStatus}`);

  // 2. Test Contract Vehicle Flow
  console.log('\n--- Test 2: Flow Thuê Xe Hợp Đồng 5-29 Chỗ ---');
  const contractData = {
    serviceType: 'CONTRACT' as const,
    customerName: 'Công ty Du Lịch Á Châu',
    customerPhone: '0866834442',
    seatCount: 16 as const,
    durationDays: 2,
    departure: 'Hải Phòng',
    destination: 'Ninh Bình',
    travelDate: tomorrowStr,
    travelTime: '08:00',
    pickupAddress: 'Nhà hát lớn Hải Phòng',
    dropoffAddress: 'Khu du lịch Tràng An',
  };

  const contractValidation = contractBookingSchema.safeParse(contractData);
  if (!contractValidation.success) {
    throw new Error(`Validation Hợp đồng thất bại: ${JSON.stringify(contractValidation.error)}`);
  }
  console.log('✓ 2.1 Validation Xe Hợp Đồng đạt chuẩn');

  const contractBooking = await bookingService.createBooking({
    ...contractData,
    contractDetails: {
      seatCount: contractData.seatCount,
      durationDays: contractData.durationDays,
    },
    vehicleType: `Xe ${contractData.seatCount} chỗ`,
  });

  if (!contractBooking.bookingCode.startsWith('BK')) {
    throw new Error(`Mã booking hợp đồng không hợp lệ: ${contractBooking.bookingCode}`);
  }
  if (contractBooking.contractDetails?.seatCount !== 16) {
    throw new Error('Dữ liệu số chỗ xe hợp đồng không khớp');
  }
  console.log(`✓ 2.2 Tạo booking Hợp đồng thành công: Mã ${contractBooking.bookingCode}, Dòng xe ${contractBooking.contractDetails?.seatCount} chỗ`);

  // 3. Test Cargo Flow (HG Code)
  console.log('\n--- Test 3: Flow Gửi Hàng Hóa Hỏa Tốc (Mã HG) ---');
  const cargoData = {
    serviceType: 'CARGO' as const,
    customerName: 'Người gửi Hạ Long',
    customerPhone: '0868680944',
    departure: 'Quảng Ninh',
    destination: 'Nam Định',
    travelDate: todayStr,
    travelTime: '06:00',
    pickupAddress: 'Bến xe Bãi Cháy',
    dropoffAddress: 'Số 10 Quang Trung, TP Nam Định',
    cargoDetails: {
      senderName: 'Trần Văn Gửi',
      senderPhone: '0868680944',
      receiverName: 'Lê Thị Nhận',
      receiverPhone: '0912345678',
      pickupPoint: 'Bến xe Bãi Cháy',
      dropoffPoint: 'Số 10 Quang Trung, TP Nam Định',
      cargoType: 'Thùng hải sản tươi sống bảo quản lạnh',
      quantity: 2,
    },
  };

  const cargoValidation = cargoBookingSchema.safeParse({
    serviceType: 'CARGO',
    senderName: cargoData.cargoDetails.senderName,
    senderPhone: cargoData.cargoDetails.senderPhone,
    receiverName: cargoData.cargoDetails.receiverName,
    receiverPhone: cargoData.cargoDetails.receiverPhone,
    departure: cargoData.departure,
    destination: cargoData.destination,
    pickupAddress: cargoData.pickupAddress,
    dropoffAddress: cargoData.dropoffAddress,
    cargoType: cargoData.cargoDetails.cargoType,
    quantity: cargoData.cargoDetails.quantity,
    travelDate: cargoData.travelDate,
  });

  if (!cargoValidation.success) {
    throw new Error(`Validation Gửi hàng thất bại: ${JSON.stringify(cargoValidation.error)}`);
  }
  console.log('✓ 3.1 Validation Gửi Hàng đạt chuẩn');

  const cargoBooking = await bookingService.createBooking(cargoData);
  if (!cargoBooking.bookingCode.startsWith('HG')) {
    throw new Error(`Mã gửi hàng phải bắt đầu bằng HG, nhận được: ${cargoBooking.bookingCode}`);
  }
  console.log(`✓ 3.2 Tạo đơn gửi hàng thành công: Mã ${cargoBooking.bookingCode}`);

  // 4. Test Tour Flow
  console.log('\n--- Test 4: Flow Xe Đi Khu Du Lịch ---');
  const tourData = {
    serviceType: 'TOUR' as const,
    customerName: 'Đoàn Khách Hà Nội',
    customerPhone: '0868680944',
    departure: 'Quảng Ninh',
    destination: 'Chùa Tam Chúc',
    travelDate: tomorrowStr,
    travelTime: '07:30',
    passengerCount: 8,
    pickupAddress: 'Khách sạn Mường Thanh, Bãi Cháy',
    dropoffAddress: 'Cổng Chùa Tam Chúc, Hà Nam',
    tourDetails: {
      tourDestination: 'Chùa Tam Chúc',
    },
  };

  const tourValidation = tourBookingSchema.safeParse({
    serviceType: 'TOUR',
    customerName: tourData.customerName,
    customerPhone: tourData.customerPhone,
    tourDestination: 'Chùa Tam Chúc',
    departure: tourData.departure,
    travelDate: tourData.travelDate,
    travelTime: tourData.travelTime,
    passengerCount: tourData.passengerCount,
    pickupAddress: tourData.pickupAddress,
  });

  if (!tourValidation.success) {
    throw new Error(`Validation Tour thất bại: ${JSON.stringify(tourValidation.error)}`);
  }
  console.log('✓ 4.1 Validation Tour đạt chuẩn');

  const tourBooking = await bookingService.createBooking(tourData);
  if (!tourBooking.bookingCode.startsWith('BK')) {
    throw new Error(`Mã booking Tour không hợp lệ: ${tourBooking.bookingCode}`);
  }
  console.log(`✓ 4.2 Tạo booking Tour thành công: Mã ${tourBooking.bookingCode}`);

  // 5. Test Past Date Rejection
  console.log('\n--- Test 5: Kiểm Tra Chặn Ngày Trong Quá Khứ ---');
  const pastDateResult = limousineBookingSchema.safeParse({
    ...limoLimoData,
    travelDate: '2020-01-01',
  });
  if (pastDateResult.success) {
    throw new Error('Hệ thống cho phép đặt ngày trong quá khứ 2020-01-01');
  }
  console.log('✓ 5 ĐẠT: Chặn thành công ngày khởi hành trong quá khứ');

  // 6. Test Lookup Integration
  console.log('\n--- Test 6: Tra Cứu Booking Vừa Tạo Bằng Mã + SĐT ---');
  // Lookup Limousine
  const foundLimo = await bookingService.lookupBooking(limoBooking.bookingCode, '0868680944');
  if (!foundLimo || foundLimo.id !== limoBooking.id) {
    throw new Error(`Tra cứu thất bại cho đơn Limousine ${limoBooking.bookingCode}`);
  }
  console.log(`✓ 6.1 Tra cứu đơn Limousine thành công: ${foundLimo.bookingCode} khớp SĐT`);

  // Lookup Cargo by Sender Phone
  const foundCargoBySender = await bookingService.lookupBooking(cargoBooking.bookingCode, '0868680944');
  if (!foundCargoBySender || foundCargoBySender.id !== cargoBooking.id) {
    throw new Error('Tra cứu hàng hóa theo SĐT người gửi thất bại');
  }

  // Lookup Cargo by Receiver Phone
  const foundCargoByReceiver = await bookingService.lookupBooking(cargoBooking.bookingCode, '0912345678');
  if (!foundCargoByReceiver || foundCargoByReceiver.id !== cargoBooking.id) {
    throw new Error('Tra cứu hàng hóa theo SĐT người nhận thất bại');
  }
  console.log(`✓ 6.2 Tra cứu đơn gửi hàng ${cargoBooking.bookingCode} thành công cả người gửi và người nhận`);

  // Lookup rejection on wrong phone
  const wrongPhoneLookup = await bookingService.lookupBooking(limoBooking.bookingCode, '0999999999');
  if (wrongPhoneLookup !== null) {
    throw new Error('Hệ thống cho phép tra cứu sai số điện thoại');
  }
  console.log('✓ 6.3 Bảo mật tra cứu: Chặn trả về thông tin khi số điện thoại không khớp');

  console.log('\n=== TẤT CẢ CÁC BÀI TEST PHASE 4 ĐỀU VƯỢT QUA 100% XUẤT SẮC! ===\n');
}

runPhase4Tests().catch((err) => {
  console.error('❌ LỖI TEST PHASE 4:', err);
  process.exit(1);
});

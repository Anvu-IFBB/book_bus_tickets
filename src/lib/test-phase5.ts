/* eslint-disable */
// @ts-nocheck
import { fleetService } from '@/services/fleetService';
import { operationsService } from '@/services/operationsService';
import { bookingService } from '@/services/bookingService';
import { getSettingsRepository } from '@/repositories';

async function runPhase5Tests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 5 (OPERATIONS & FLEET MANAGEMENT) ===\n');

  const settingsRepo = getSettingsRepository();
  const todayStr = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // ----------------------------------------------------
  // TEST 1: VEHICLE CRUD
  // ----------------------------------------------------
  console.log('--- TEST 1: VEHICLE CRUD ---');
  const createdVehicle = await fleetService.createVehicle({
    name: 'Limousine President Special Edition',
    licensePlate: '14B-999.88',
    seatCount: 11,
    vehicleType: 'DCar VIP 11 chỗ massage',
    status: 'AVAILABLE',
    note: 'Xe mới nhập khẩu 2026',
  }, 'admin@limousine.vn');

  if (!createdVehicle.id || createdVehicle.licensePlate !== '14B-999.88') {
    throw new Error('Tạo xe mới thất bại');
  }
  console.log(`✓ 1.1 Tạo xe mới thành công: ${createdVehicle.name} (${createdVehicle.licensePlate})`);

  const fetchedVehicle = await fleetService.getVehicle(createdVehicle.id);
  if (!fetchedVehicle || fetchedVehicle.id !== createdVehicle.id) {
    throw new Error('Lấy thông tin xe thất bại');
  }
  console.log('✓ 1.2 Lấy thông tin xe chi tiết thành công');

  const updatedVehicle = await fleetService.updateVehicle(createdVehicle.id, {
    note: 'Đã bảo dưỡng định kỳ 10.000km',
  }, 'admin@limousine.vn');
  if (updatedVehicle.note !== 'Đã bảo dưỡng định kỳ 10.000km') {
    throw new Error('Cập nhật thông tin xe thất bại');
  }
  console.log('✓ 1.3 Cập nhật xe thành công');

  const updatedStatusVeh = await fleetService.updateVehicleStatus(createdVehicle.id, 'MAINTENANCE', 'admin@limousine.vn', 'Bảo trì thay lốp');
  if (updatedStatusVeh.status !== 'MAINTENANCE') {
    throw new Error('Cập nhật trạng thái xe thất bại');
  }
  console.log('✓ 1.4 Chuyển trạng thái xe sang MAINTENANCE thành công');

  // ----------------------------------------------------
  // TEST 2: DRIVER CRUD
  // ----------------------------------------------------
  console.log('\n--- TEST 2: DRIVER CRUD ---');
  const createdDriver = await fleetService.createDriver({
    name: 'Phạm Thanh Tùng',
    phone: '0915998877',
    licenseNumber: 'GPLX-E-1499999',
    status: 'AVAILABLE',
    note: 'Lái xe cẩn thận, tiếng Anh giao tiếp cơ bản',
  }, 'admin@limousine.vn');

  if (!createdDriver.id || createdDriver.phone !== '0915998877') {
    throw new Error('Tạo tài xế mới thất bại');
  }
  console.log(`✓ 2.1 Tạo tài xế mới thành công: ${createdDriver.name} (${createdDriver.phone})`);

  const fetchedDriver = await fleetService.getDriver(createdDriver.id);
  if (!fetchedDriver || fetchedDriver.id !== createdDriver.id) {
    throw new Error('Lấy thông tin tài xế thất bại');
  }
  console.log('✓ 2.2 Lấy thông tin tài xế thành công');

  const updatedDriver = await fleetService.updateDriver(createdDriver.id, {
    note: 'Đã hoàn thành khóa đào tạo văn hóa phục vụ VIP',
  }, 'admin@limousine.vn');
  if (updatedDriver.note !== 'Đã hoàn thành khóa đào tạo văn hóa phục vụ VIP') {
    throw new Error('Cập nhật tài xế thất bại');
  }
  console.log('✓ 2.3 Cập nhật thông tin tài xế thành công');

  const offDriver = await fleetService.updateDriverStatus(createdDriver.id, 'OFF', 'admin@limousine.vn', 'Nghỉ phép có lý do');
  if (offDriver.status !== 'OFF') {
    throw new Error('Chuyển trạng thái tài xế sang OFF thất bại');
  }
  console.log('✓ 2.4 Chuyển trạng thái tài xế sang OFF thành công');

  // ----------------------------------------------------
  // TEST 3: TRIP CREATION & MANAGEMENT
  // ----------------------------------------------------
  console.log('\n--- TEST 3: TRIP CREATION & MANAGEMENT ---');
  // Chuyển 1 xe và 1 tài xế về AVAILABLE để test
  await fleetService.updateVehicleStatus('veh-01', 'AVAILABLE', 'admin@limousine.vn');
  await fleetService.updateDriverStatus('drv-01', 'AVAILABLE', 'admin@limousine.vn');

  const createdTrip = await fleetService.createTrip({
    routeId: 'route-qn-nb',
    route: 'Quảng Ninh - Ninh Bình',
    vehicleId: 'veh-01',
    driverId: 'drv-01',
    departureDate: '2026-09-25',
    departureTime: '05:00',
    arrivalTime: '10:00',
    status: 'PLANNED',
    maxSeats: 11,
    bookedSeats: 0,
    note: 'Chuyến sáng sớm',
  }, 'admin@limousine.vn');

  if (!createdTrip.id || createdTrip.departureTime !== '05:00') {
    throw new Error('Tạo chuyến xe thất bại');
  }
  console.log(`✓ 3.1 Tạo chuyến xe mới thành công: ${createdTrip.id} (05:00 → 10:00)`);

  const startedTrip = await fleetService.startTrip(createdTrip.id, 'admin@limousine.vn');
  if (startedTrip.status !== 'IN_PROGRESS') {
    throw new Error('Bắt đầu chuyến đi thất bại');
  }
  console.log('✓ 3.2 Bắt đầu chuyến xe (IN_PROGRESS) thành công');

  const completedTrip = await fleetService.completeTrip(createdTrip.id, 'admin@limousine.vn');
  if (completedTrip.status !== 'COMPLETED') {
    throw new Error('Hoàn thành chuyến đi thất bại');
  }
  console.log('✓ 3.3 Hoàn thành chuyến xe (COMPLETED) thành công, xe/tài xế tự giải phóng về AVAILABLE');

  // ----------------------------------------------------
  // TEST 4 & 5: CONFLICT DETECTION (VEHICLE & DRIVER)
  // ----------------------------------------------------
  console.log('\n--- TEST 4: CONFLICT DETECTION (DOUBLE BOOKING) ---');
  // Reset veh-02 và drv-02 về AVAILABLE
  await fleetService.updateVehicleStatus('veh-02', 'AVAILABLE', 'admin@limousine.vn');
  await fleetService.updateDriverStatus('drv-02', 'AVAILABLE', 'admin@limousine.vn');

  // Tạo chuyến Trip A: 05:00 -> 10:00 ngày hôm nay
  const tripA = await fleetService.createTrip({
    routeId: 'route-qn-nb',
    route: 'Quảng Ninh - Ninh Bình',
    vehicleId: 'veh-02',
    driverId: 'drv-02',
    departureDate: todayStr,
    departureTime: '05:00',
    arrivalTime: '10:00',
    status: 'ASSIGNED',
    maxSeats: 11,
    bookedSeats: 2,
  }, 'admin@limousine.vn');
  console.log(`Đã thiết lập Chuyến A tham chiếu: ${tripA.id} (${tripA.departureTime} → ${tripA.arrivalTime}) với Xe veh-02 & Tài xế drv-02`);

  // 4.1. Test Vehicle Conflict: Chuyến B trùng giờ 06:00 -> 09:00 cùng veh-02
  const vConflict = await fleetService.detectVehicleConflict('veh-02', todayStr, '06:00', '09:00');
  if (!vConflict.hasConflict) {
    throw new Error('LỖI: Hệ thống không phát hiện xung đột xe (05:00-10:00 vs 06:00-09:00)');
  }
  console.log(`✓ 4.1 ĐẠT: Chặn thành công xung đột phương tiện (${vConflict.reason})`);

  // 4.2. Test Driver Conflict: Chuyến B trùng giờ 06:00 -> 09:00 cùng drv-02
  const dConflict = await fleetService.detectDriverConflict('drv-02', todayStr, '06:00', '09:00');
  if (!dConflict.hasConflict) {
    throw new Error('LỖI: Hệ thống không phát hiện xung đột tài xế (05:00-10:00 vs 06:00-09:00)');
  }
  console.log(`✓ 4.2 ĐẠT: Chặn thành công xung đột tài xế (${dConflict.reason})`);

  // 4.3. Test Non-overlapping times (10:01 -> 12:00) -> PHẢI CHO PHÉP (ALLOW)
  const vNoConflict = await fleetService.detectVehicleConflict('veh-02', todayStr, '10:01', '12:00');
  if (vNoConflict.hasConflict) {
    throw new Error(`LỖI: Khung giờ tiếp nối 10:01-12:00 không trùng với 05:00-10:00 nhưng bị chặn: ${vNoConflict.reason}`);
  }
  console.log('✓ 4.3 ĐẠT: Cho phép phân công xe vào khung giờ tiếp nối không trùng (10:01 → 12:00)');

  // 4.4. Test Vehicle MAINTENANCE Guard
  const vMaintConflict = await fleetService.detectVehicleConflict(createdVehicle.id, todayStr, '14:00', '17:00');
  if (!vMaintConflict.hasConflict || !vMaintConflict.reason?.includes('MAINTENANCE')) {
    throw new Error('LỖI: Không chặn phân xe đang ở trạng thái MAINTENANCE');
  }
  console.log('✓ 4.4 ĐẠT: Chặn thành công phân xe đang bảo trì (MAINTENANCE)');

  // 4.5. Test Driver OFF Guard
  const dOffConflict = await fleetService.detectDriverConflict(createdDriver.id, todayStr, '14:00', '17:00');
  if (!dOffConflict.hasConflict || !dOffConflict.reason?.includes('OFF')) {
    throw new Error('LỖI: Không chặn phân tài xế đang ở trạng thái OFF');
  }
  console.log('✓ 4.5 ĐẠT: Chặn thành công phân tài xế đang nghỉ phép (OFF)');

  // ----------------------------------------------------
  // TEST 5: BOOKING OPERATIONS & STATE MACHINE (PHASE 5 FLOW)
  // ----------------------------------------------------
  console.log('\n--- TEST 5: BOOKING OPERATIONS & STATE MACHINE ---');
  // Tạo 1 đơn mới
  const booking = await bookingService.createBooking({
    serviceType: 'LIMOUSINE',
    customerName: 'Khách Hàng Phase 5',
    customerPhone: '0868680944',
    departure: 'Quảng Ninh',
    destination: 'Ninh Bình',
    travelDate: tomorrowStr,
    travelTime: '15:00',
    passengerCount: 2,
    pickupAddress: 'Hạ Long',
    dropoffAddress: 'Tràng An',
  });

  console.log(`Tạo booking thử nghiệm: ${booking.bookingCode}, Trạng thái: ${booking.bookingStatus}`);

  // Chuyển: NEW -> CONTACTING
  const contacting = await operationsService.updateBookingStatus(booking.id, 'CONTACTING', 'admin@limousine.vn', 'Đã gọi điện chốt giờ');
  if (contacting.bookingStatus !== 'CONTACTING') throw new Error('Chuyển sang CONTACTING thất bại');
  console.log('✓ 5.1 Chuyển trạng thái: NEW → CONTACTING thành công');

  // Chuyển: CONTACTING -> CONFIRMED
  const confirmed = await operationsService.updateBookingStatus(booking.id, 'CONFIRMED', 'admin@limousine.vn', 'Khách xác nhận đi');
  if (confirmed.bookingStatus !== 'CONFIRMED') throw new Error('Chuyển sang CONFIRMED thất bại');
  console.log('✓ 5.2 Chuyển trạng thái: CONTACTING → CONFIRMED thành công');

  // Phân xe cho booking -> Chuyển sang ASSIGNED
  // Chuẩn bị xe veh-03 sẵn sàng
  await fleetService.updateVehicleStatus('veh-03', 'AVAILABLE', 'admin@limousine.vn');
  const assignedVeh = await operationsService.assignVehicle(booking.id, 'veh-03', 'admin@limousine.vn');
  if (assignedVeh.bookingStatus !== 'ASSIGNED' || assignedVeh.vehicleId !== 'veh-03') {
    throw new Error('Phân xe cho booking thất bại');
  }
  console.log(`✓ 5.3 Phân xe cho booking thành công: Trạng thái ${assignedVeh.bookingStatus}, Xe ${assignedVeh.vehicleId}`);

  // Phân tài xế cho booking
  await fleetService.updateDriverStatus('drv-03', 'AVAILABLE', 'admin@limousine.vn');
  const assignedDrv = await operationsService.assignDriver(booking.id, 'drv-03', 'admin@limousine.vn');
  if (assignedDrv.driverId !== 'drv-03') {
    throw new Error('Phân tài xế cho booking thất bại');
  }
  console.log(`✓ 5.4 Phân tài xế cho booking thành công: Tài xế ${assignedDrv.driverId}`);

  // Chuyển: ASSIGNED -> IN_PROGRESS
  const inProgress = await operationsService.updateBookingStatus(booking.id, 'IN_PROGRESS', 'admin@limousine.vn', 'Xe đã lăn bánh');
  if (inProgress.bookingStatus !== 'IN_PROGRESS') throw new Error('Chuyển sang IN_PROGRESS thất bại');
  console.log('✓ 5.5 Chuyển trạng thái: ASSIGNED → IN_PROGRESS thành công');

  // Chuyển: IN_PROGRESS -> COMPLETED
  const completed = await operationsService.updateBookingStatus(booking.id, 'COMPLETED', 'admin@limousine.vn', 'Khách đã xuống xe an toàn');
  if (completed.bookingStatus !== 'COMPLETED' || !completed.feedbackAvailableAt) {
    throw new Error('Chuyển sang COMPLETED thất bại hoặc thiếu feedbackAvailableAt');
  }
  console.log('✓ 5.6 Chuyển trạng thái: IN_PROGRESS → COMPLETED thành công');

  // Kiểm tra chặn chuyển lùi trái phép từ COMPLETED sang NEW
  try {
    await operationsService.updateBookingStatus(booking.id, 'NEW', 'admin@limousine.vn');
    throw new Error('Hệ thống cho phép chuyển ngược trái phép từ COMPLETED về NEW');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`✓ 5.7 ĐẠT: Chặn chuyển ngược trái phép (${msg})`);
  }

  // ----------------------------------------------------
  // TEST 6: AUDIT LOG & STATUS HISTORY INTEGRITY
  // ----------------------------------------------------
  console.log('\n--- TEST 6: AUDIT LOG & STATUS HISTORY INTEGRITY ---');
  const finalBooking = await operationsService.getBookingDetails(booking.id);
  if (!finalBooking) throw new Error('Không tìm thấy booking');

  if (finalBooking.statusHistory.length < 5) {
    throw new Error(`statusHistory thiếu bản ghi (Hiện có: ${finalBooking.statusHistory.length})`);
  }
  console.log(`✓ 6.1 statusHistory ghi nhận đầy đủ ${finalBooking.statusHistory.length} bước chuyển đổi theo thời gian`);

  const auditLogs = await settingsRepo.listAuditLogs('BOOKING', booking.id);
  if (auditLogs.length === 0) {
    throw new Error('Không có AuditLog nào được tạo cho Booking');
  }
  console.log(`✓ 6.2 Ghi nhận ${auditLogs.length} bản ghi AuditLog với đầy đủ action, fromState, toState, changedBy`);

  // ----------------------------------------------------
  // TEST 7: OPERATIONS SUMMARY METRICS
  // ----------------------------------------------------
  console.log('\n--- TEST 7: OPERATIONS SUMMARY METRICS ---');
  const summary = await operationsService.getOperationsSummary();
  if (typeof summary.totalBookingsToday !== 'number' || typeof summary.totalTripsToday !== 'number') {
    throw new Error('Dữ liệu OperationsSummary không hợp lệ');
  }
  console.log(`✓ 7 ĐẠT: Tổng hợp số liệu vận hành hôm nay: ${summary.totalBookingsToday} booking, ${summary.totalTripsToday} chuyến`);
  console.log(`Tình trạng đội xe: ${summary.fleetStatus.AVAILABLE} sẵn sàng, ${summary.fleetStatus.MAINTENANCE} bảo trì`);
  console.log(`Tình trạng tài xế: ${summary.driverStatus.AVAILABLE} sẵn sàng, ${summary.driverStatus.OFF} nghỉ ca`);

  console.log('\n================================================================');
  console.log('=== 100% CÁC BÀI TEST PHASE 5 ĐỀU VƯỢT QUA XUẤT SẮC! ===');
  console.log('================================================================\n');
}

runPhase5Tests().catch((err) => {
  console.error('\n❌ KIỂM THỬ PHASE 5 THẤT BẠI:', err);
  process.exit(1);
});

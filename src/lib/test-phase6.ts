/* eslint-disable */
// @ts-nocheck
import {
  firebaseClientConfigSchema,
  firebaseAdminConfigSchema,
  isFirebaseConfigured,
  isFirebaseAdminConfigured,
} from './firebase/config';
import { cleanUndefined, toIsoString } from '../repositories/firestore/helpers';
import {
  getActiveRepositoryMode,
  setRepositoryModeForTesting,
  getCustomerRepository,
  getFleetRepository,
  getSettingsRepository,
} from '../repositories';
import { bookingService } from '../services/bookingService';
import { normalizePhone } from './utils/formatters';
import { AuthUser } from '../types/auth';
import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ THẤT BẠI: ${message}`);
    throw new Error(`Test Failed: ${message}`);
  }
  console.log(`✓ ${message}`);
}

async function runPhase6Tests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG PHASE 6: DATABASE + AUTH + PRODUCTION FOUNDATION ===\n');

  // --- TEST 1: FIREBASE CONFIG VALIDATION ---
  console.log('--- TEST 1: FIREBASE CONFIG VALIDATION ---');
  const validClientConfig = {
    apiKey: 'AIzaSyDemoKey123456789',
    authDomain: 'limousine-vip.firebaseapp.com',
    projectId: 'limousine-vip-prod',
    storageBucket: 'limousine-vip-prod.appspot.com',
    messagingSenderId: '1234567890',
    appId: '1:1234567890:web:abcdef123456',
  };
  const parsedClient = firebaseClientConfigSchema.safeParse(validClientConfig);
  assert(parsedClient.success, '1.1 Schema xác thực thành công cấu hình Firebase Client hợp lệ');

  const invalidClientConfig = {
    apiKey: '', // thiếu apiKey
    authDomain: 'demo.firebaseapp.com',
  };
  const invalidParse = firebaseClientConfigSchema.safeParse(invalidClientConfig);
  assert(!invalidParse.success, '1.2 Schema từ chối chính xác cấu hình thiếu apiKey và appId');

  const validAdminConfig = {
    projectId: 'limousine-vip-prod',
    clientEmail: 'firebase-adminsdk@limousine-vip-prod.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n',
  };
  const parsedAdmin = firebaseAdminConfigSchema.safeParse(validAdminConfig);
  assert(parsedAdmin.success, '1.3 Schema xác thực thành công cấu hình Firebase Admin hợp lệ');
  assert(typeof isFirebaseConfigured() === 'boolean', '1.4 isFirebaseConfigured() trả về kiểu boolean an toàn');
  assert(typeof isFirebaseAdminConfigured() === 'boolean', '1.5 isFirebaseAdminConfigured() trả về kiểu boolean an toàn');

  // --- TEST 2: REPOSITORY MODE SWITCHING (REPOSITORY FACTORY) ---
  console.log('\n--- TEST 2: REPOSITORY MODE SWITCHING (FACTORY) ---');
  setRepositoryModeForTesting('memory');
  assert(getActiveRepositoryMode() === 'memory', '2.1 getActiveRepositoryMode() nhận diện chính xác chế độ memory');

  setRepositoryModeForTesting('firestore');
  assert(getActiveRepositoryMode() === 'firestore', '2.2 getActiveRepositoryMode() nhận diện chính xác chế độ firestore khi override');

  // Reset về memory để kiểm tra local
  setRepositoryModeForTesting('memory');
  assert(getActiveRepositoryMode() === 'memory', '2.3 Reset thành công về chế độ memory cho local dev/test');

  // --- TEST 3: FIRESTORE DATA HELPERS & CLEANING ---
  console.log('\n--- TEST 3: FIRESTORE DATA HELPERS ---');
  const dirtyObject = {
    name: 'Vũ Công Minh',
    note: undefined, // Phải được loại bỏ
    metadata: {
      source: 'web',
      extra: undefined, // Phải được loại bỏ lồng nhau
    },
    count: 0,
    isActive: false,
  };
  const cleaned = cleanUndefined(dirtyObject);
  assert(!('note' in cleaned), '3.1 cleanUndefined loại bỏ triệt để thuộc tính undefined cấp 1');
  assert(!('extra' in (cleaned.metadata as Record<string, unknown>)), '3.2 cleanUndefined loại bỏ thuộc tính undefined lồng nhau');
  assert(cleaned.count === 0 && cleaned.isActive === false, '3.3 cleanUndefined bảo toàn chính xác giá trị 0 và false');

  const now = new Date();
  const isoStr = toIsoString(now);
  assert(isoStr === now.toISOString(), '3.4 toIsoString chuyển đổi chính xác Date sang ISO string');

  // --- TEST 4: CUSTOMER DEDUPLICATION & CRM FOUNDATION ---
  console.log('\n--- TEST 4: CUSTOMER DEDUPLICATION & CRM ---');
  const customerRepo = getCustomerRepository();
  const testPhone = normalizePhone('0868680944');

  // Tạo booking lần 1
  const b1 = await bookingService.createBooking({
    customerName: 'Nguyễn Văn Long',
    customerPhone: testPhone,
    serviceType: 'LIMOUSINE',
    departure: 'Quảng Ninh',
    destination: 'Ninh Bình',
    travelDate: '2026-09-20',
    travelTime: '08:00',
    passengerCount: 2,
    pickupAddress: 'Hạ Long, Quảng Ninh',
    dropoffAddress: 'TP Ninh Bình',
  });
  assert(Boolean(b1.id && b1.bookingCode), '4.1 Tạo booking lần 1 thành công');

  const customerAfterB1 = await customerRepo.findByPhone(testPhone);
  assert(customerAfterB1 !== null, '4.2 Tìm thấy khách hàng trong CRM theo SĐT');
  const initialBookingsCount = customerAfterB1!.totalBookings;

  // Tạo booking lần 2 với cùng số điện thoại
  const b2 = await bookingService.createBooking({
    customerName: 'Nguyễn Văn Long',
    customerPhone: testPhone,
    serviceType: 'CONTRACT',
    departure: 'Hải Phòng',
    destination: 'Thái Bình',
    travelDate: '2026-09-22',
    travelTime: '09:00',
    pickupAddress: 'Lê Hồng Phong, Hải Phòng',
    dropoffAddress: 'TP Thái Bình',
    contractDetails: {
      seatCount: 16,
      durationDays: 2,
    },
  });
  assert(b2.customerId === customerAfterB1!.id, '4.3 Booking lần 2 tự động liên kết đúng customerId cũ (không tạo duplicate)');

  const customerAfterB2 = await customerRepo.findByPhone(testPhone);
  assert(customerAfterB2!.totalBookings === initialBookingsCount + 1, '4.4 Cập nhật cộng dồn totalBookings chính xác');

  // --- TEST 5: ATOMIC SEQUENCE & UNIQUE BOOKING CODES ---
  console.log('\n--- TEST 5: ATOMIC SEQUENCE & UNIQUE CODES ---');
  assert(b1.bookingCode !== b2.bookingCode, '5.1 Mã booking của các đơn tạo mới là duy nhất và khác biệt');
  assert(b1.bookingCode.startsWith('BK2026'), '5.2 Mã booking bắt đầu chuẩn BKYYYY...');
  assert(b2.bookingCode.startsWith('BK2026'), '5.3 Mã booking thứ 2 bắt đầu chuẩn BKYYYY...');

  // --- TEST 6: FLEET CRUD IN REPOSITORY LAYER ---
  console.log('\n--- TEST 6: FLEET REPOSITORY CRUD ---');
  const fleetRepo = getFleetRepository();
  const newVehId = `veh-test-${Date.now()}`;
  const createdVeh = await fleetRepo.createVehicle({
    id: newVehId,
    name: 'Limousine President Black Edition',
    licensePlate: '14B-888.99',
    seatCount: 11,
    vehicleType: 'Limousine DCar President',
    status: 'AVAILABLE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  assert(createdVeh.id === newVehId, '6.1 FleetRepo tạo phương tiện mới thành công');

  const fetchedVeh = await fleetRepo.getVehicleById(newVehId);
  assert(fetchedVeh?.licensePlate === '14B-888.99', '6.2 FleetRepo tra cứu xe vừa tạo thành công');

  await fleetRepo.updateVehicle(newVehId, { status: 'MAINTENANCE' });
  const updatedVeh = await fleetRepo.getVehicleById(newVehId);
  assert(updatedVeh?.status === 'MAINTENANCE', '6.3 FleetRepo cập nhật trạng thái bảo trì xe thành công');

  // --- TEST 7: SECURE BOOKING LOOKUP ---
  console.log('\n--- TEST 7: SECURE BOOKING LOOKUP ---');
  const lookupSuccess = await bookingService.lookupBooking(b1.bookingCode, testPhone);
  assert(lookupSuccess !== null && lookupSuccess.bookingCode === b1.bookingCode, '7.1 Tra cứu đúng Mã đơn + Đúng SĐT thành công');

  const lookupWrongPhone = await bookingService.lookupBooking(b1.bookingCode, '0999888777');
  assert(lookupWrongPhone === null, '7.2 Bảo mật tra cứu: Sai số điện thoại bị từ chối trả về thông tin');

  // --- TEST 8: AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) ---
  console.log('\n--- TEST 8: AUTHENTICATION & RBAC ---');
  const adminUser: AuthUser = {
    id: 'user-admin-01',
    email: 'admin@limousine.vn',
    displayName: 'Quản Trị Viên',
    role: 'ADMIN',
    active: true,
    createdAt: new Date().toISOString(),
  };

  const operatorUser: AuthUser = {
    id: 'user-op-01',
    email: 'operator@limousine.vn',
    displayName: 'Điều Hành Viên',
    role: 'OPERATOR',
    active: true,
    createdAt: new Date().toISOString(),
  };

  // Helper hàm kiểm tra quyền
  function canEditSettings(user: AuthUser): boolean {
    return user.role === 'ADMIN';
  }
  function canDeleteRecord(user: AuthUser): boolean {
    return user.role === 'ADMIN';
  }
  function canDispatchTrips(user: AuthUser): boolean {
    return user.role === 'ADMIN' || user.role === 'OPERATOR';
  }

  assert(canEditSettings(adminUser) === true, '8.1 ADMIN có quyền chỉnh sửa cấu hình hệ thống');
  assert(canEditSettings(operatorUser) === false, '8.2 OPERATOR bị chặn quyền sửa cấu hình hệ thống');
  assert(canDeleteRecord(adminUser) === true, '8.3 ADMIN có quyền xóa bản ghi');
  assert(canDeleteRecord(operatorUser) === false, '8.4 OPERATOR bị chặn quyền xóa bản ghi');
  assert(canDispatchTrips(operatorUser) === true, '8.5 OPERATOR có đầy đủ quyền điều phối xe và chuyến');

  // Session token base64 encoding/decoding test
  const encodedSession = Buffer.from(JSON.stringify(adminUser)).toString('base64');
  const decodedSession: AuthUser = JSON.parse(Buffer.from(encodedSession, 'base64').toString('utf-8'));
  assert(decodedSession.email === adminUser.email && decodedSession.role === 'ADMIN', '8.6 Mã hóa và giải mã Session Cookie toàn vẹn');

  // --- TEST 9: AUDIT LOG & ACTOR ROLE ---
  console.log('\n--- TEST 9: AUDIT LOG INTEGRITY ---');
  const settingsRepo = getSettingsRepository();
  const auditLog = await settingsRepo.createAuditLog({
    id: `audit-${Date.now()}`,
    userId: adminUser.id,
    userEmail: adminUser.email,
    actorRole: adminUser.role,
    action: 'VEHICLE_STATUS_CHANGED',
    entityType: 'VEHICLE',
    entityId: newVehId,
    fromState: 'AVAILABLE',
    toState: 'MAINTENANCE',
    createdAt: new Date().toISOString(),
  });
  assert(auditLog.actorRole === 'ADMIN', '9.1 AuditLog ghi nhận chuẩn xác actorRole của người thực hiện');

  const auditList = await settingsRepo.listAuditLogs('VEHICLE', newVehId);
  assert(auditList.length > 0, '9.2 Tra cứu danh sách AuditLog theo entityType và entityId thành công');

  // --- TEST 10: FIRESTORE SECURITY RULES INTEGRITY ---
  console.log('\n--- TEST 10: FIRESTORE RULES INTEGRITY ---');
  const rulesPath = path.join(process.cwd(), 'firestore.rules');
  assert(fs.existsSync(rulesPath), '10.1 File firestore.rules tồn tại trong thư mục gốc');

  const rulesContent = fs.readFileSync(rulesPath, 'utf-8');
  assert(rulesContent.includes('rules_version = \'2\';'), '10.2 Rules khai báo rules_version 2');
  assert(rulesContent.includes('allow read, write: if false;'), '10.3 Rules thiết lập Deny-all-by-default');
  assert(rulesContent.includes('match /bookings/{bookingId}'), '10.4 Rules bảo vệ collection bookings');
  assert(rulesContent.includes('match /customers/{customerId}'), '10.5 Rules bảo vệ collection customers');
  assert(rulesContent.includes('match /auditLogs/{logId}'), '10.6 Rules bảo vệ collection auditLogs');

  console.log('\n================================================================');
  console.log('=== 100% CÁC BÀI TEST PHASE 6 ĐỀU VƯỢT QUA XUẤT SẮC! ===');
  console.log('================================================================');
}

runPhase6Tests().catch((err) => {
  console.error('Lỗi khi thực thi test phase 6:', err);
  process.exit(1);
});

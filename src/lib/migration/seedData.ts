import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_TRIPS,
  INITIAL_SETTINGS,
} from '@/repositories/memory/mockData';
import { getFirestoreFleetRepository, getFirestoreSettingsRepository } from '@/repositories/firestore';
import { isFirebaseConfigured } from '@/lib/firebase/config';

export async function seedFirestore() {
  console.log('=== BẮT ĐẦU SEED DỮ LIỆU BAN ĐẦU VÀO FIRESTORE ===');

  if (!isFirebaseConfigured()) {
    console.warn('⚠️ Firebase chưa được cấu hình biến môi trường trong .env.local.');
    console.warn('Vui lòng kiểm tra NEXT_PUBLIC_FIREBASE_API_KEY, PROJECT_ID, etc.');
    return;
  }

  const fleetRepo = getFirestoreFleetRepository();
  const settingsRepo = getFirestoreSettingsRepository();

  // 1. Seed Routes
  console.log('1. Đang nạp danh mục tuyến xe...');
  for (const r of INITIAL_ROUTES) {
    const existing = await fleetRepo.getRouteById(r.id);
    if (!existing) {
      await fleetRepo.createRoute(r);
      console.log(`  + Đã thêm tuyến: ${r.departure} → ${r.destination}`);
    } else {
      console.log(`  . Tuyến ${r.id} đã tồn tại, bỏ qua.`);
    }
  }

  // 2. Seed Vehicles
  console.log('2. Đang nạp danh mục đội xe...');
  for (const v of INITIAL_VEHICLES) {
    const existing = await fleetRepo.getVehicleById(v.id);
    if (!existing) {
      await fleetRepo.createVehicle(v);
      console.log(`  + Đã thêm xe: ${v.name} (${v.licensePlate})`);
    } else {
      console.log(`  . Xe ${v.id} đã tồn tại, bỏ qua.`);
    }
  }

  // 3. Seed Drivers
  console.log('3. Đang nạp danh mục tài xế...');
  for (const d of INITIAL_DRIVERS) {
    const existing = await fleetRepo.getDriverById(d.id);
    if (!existing) {
      await fleetRepo.createDriver(d);
      console.log(`  + Đã thêm tài xế: ${d.name} (${d.phone})`);
    } else {
      console.log(`  . Tài xế ${d.id} đã tồn tại, bỏ qua.`);
    }
  }

  // 4. Seed Trips
  console.log('4. Đang nạp các chuyến xe mẫu...');
  for (const t of INITIAL_TRIPS) {
    const existing = await fleetRepo.getTripById(t.id);
    if (!existing) {
      await fleetRepo.createTrip(t);
      console.log(`  + Đã thêm chuyến: ${t.id} (${t.departureDate} ${t.departureTime})`);
    } else {
      console.log(`  . Chuyến ${t.id} đã tồn tại, bỏ qua.`);
    }
  }

  // 5. Seed System Settings
  console.log('5. Đang nạp cấu hình hệ thống...');
  await settingsRepo.updateSettings(INITIAL_SETTINGS);
  console.log('  + Cấu hình hệ thống đã cập nhật thành công.');

  console.log('=== SEED DỮ LIỆU FIRESTORE HOÀN TẤT THÀNH CÔNG ===');
}

// Chạy trực tiếp nếu script được gọi qua tsx CLI
if (require.main === module) {
  seedFirestore().catch((err) => {
    console.error('Lỗi khi seed dữ liệu:', err);
    process.exit(1);
  });
}

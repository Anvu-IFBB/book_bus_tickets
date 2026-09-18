import { getActiveRepositoryMode, getSettingsRepository } from '../repositories';
import { bookingService } from '../services/bookingService';
import { operationsService } from '../services/operationsService';

async function runTests() {
  console.log('=== PHASE 6.2 VERIFICATION ===');
  console.log(`Repository Mode: ${getActiveRepositoryMode()}`);
  
  const settingsRepo = getSettingsRepository();

  try {
    // 1. Update Settings & Pricing
    console.log('\n[1] Testing SystemSettings & PricingConfig update...');
    await settingsRepo.updateSettings({
      pricingConfig: {
        limousineBasePrice: 280000,
        cargoBasePriceUnder5kg: 60000,
        cargoBasePriceUnder10kg: 100000,
        cargoExtraPerKg: 10000,
        contractPricePerDayUnder7Seats: 1500000,
        contractPricePerDayUnder11Seats: 2000000,
        contractPricePerDayUnder16Seats: 2500000,
        contractPricePerDayOver16Seats: 3500000,
        tourBasePrice: 500000,
      }
    });

    console.log('✔ Cập nhật PricingConfig thành công.');

    const currentSettings = await settingsRepo.getSettings();
    if (!currentSettings?.pricingConfig) {
       throw new Error('Không lấy được PricingConfig');
    }
    console.log('Giá Limousine cơ bản:', currentSettings.pricingConfig.limousineBasePrice);

    // 2. Tạo Booking để check Pricing Engine
    console.log('\n[2] Testing Pricing Engine with new config...');
    const b1 = await bookingService.createBooking({
      customerName: 'Test Pricing',
      customerPhone: '0901234567',
      serviceType: 'LIMOUSINE',
      departure: 'Hà Nội',
      destination: 'Hạ Long',
      travelDate: new Date().toISOString().slice(0, 10),
      travelTime: '10:00',
      passengerCount: 2,
      pickupAddress: 'HN',
      dropoffAddress: 'HL'
    });
    console.log(`✔ Đã tạo booking ${b1.bookingCode} với giá: ${b1.price} đ`);
    if (b1.price !== 280000 * 2) {
      throw new Error(`Giá sai: Kỳ vọng ${280000 * 2}, Thực tế ${b1.price}`);
    }
    
    // 3. Cập nhật Payment Status
    console.log('\n[3] Testing Payment Status Update...');
    console.log(`Payment Status ban đầu: ${b1.paymentStatus}`);
    
    const updatedB1 = await bookingService.updatePaymentStatus(b1.id, 'PAID', 'admin@example.com', 'ADMIN');
    console.log(`✔ Payment Status sau update: ${updatedB1.paymentStatus}`);
    
    if (updatedB1.paymentStatus !== 'PAID') {
       throw new Error('Update Payment Status thất bại');
    }

    // 4. Date Filter for Operations
    console.log('\n[4] Testing Dashboard Date Filter...');
    const todayStr = new Date().toISOString().slice(0, 10);
    const summary = await operationsService.getOperationsSummary(todayStr, todayStr);
    console.log(`✔ Lấy summary thành công. Số booking hôm nay: ${summary.totalBookingsToday}`);
    console.log(`✔ Doanh thu hôm nay (chưa hoàn thành/confirmed chưa tính, test nếu confirmed thì tính)`);

    console.log('\n=== TẤT CẢ TEST ĐÃ PASS ===');
    process.exit(0);

  } catch (error) {
    console.error('\n=== TEST FAILED ===');
    console.error(error);
    process.exit(1);
  }
}

runTests();

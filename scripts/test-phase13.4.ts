/* eslint-disable */
// @ts-nocheck
import { AnalyticsAggregationService } from '../src/services/analyticsAggregationService';
import { analyticsService } from '../src/services/analyticsService';
import { getAnalyticsSummaryRepository, getAnalyticsRepository } from '../src/repositories';
import { formatInTimeZone } from 'date-fns-tz';

const VN_TZ = 'Asia/Ho_Chi_Minh';

async function run() {
  console.log('=== STARTING PHASE 13.4 AGGREGATION TESTS ===\n');

  try {
    const aggregationService = new AnalyticsAggregationService();
    const summaryRepo = getAnalyticsSummaryRepository();

    const today = new Date();
    const todayStr = formatInTimeZone(today, VN_TZ, 'yyyy-MM-dd');
    
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = formatInTimeZone(yesterdayDate, VN_TZ, 'yyyy-MM-dd');

    console.log(`[1] Running aggregation for ${yesterdayStr} and ${todayStr}...`);
    
    // We execute the aggregation service which will read from Memory Repositories (they have mocked data logic now, but maybe no items actually unless we seeded them).
    // Actually, Memory Repositories start empty in a script unless seeded. 
    // BUT our `MemoryAnalyticsRepository` returns deterministic mock data for REAL-TIME. 
    // Wait! `MemoryAnalyticsRepository` returns data based on `getBookingRepository().list()`. Since they are empty, it will return zeros.
    // Let's seed some data.
    
    const { getBookingRepository, getPaymentRepository, getFleetRepository, getFeedbackRepository } = await import('../src/repositories');
    
    const bookingRepo = getBookingRepository();
    const paymentRepo = getPaymentRepository();
    
    // Seed Bookings
    await bookingRepo.create({
      id: 'B1',
      bookingCode: 'BK001',
      customerId: 'C1',
      departure: 'Hà Nội',
      destination: 'Quảng Ninh',
      travelTime: '08:00',
      travelDate: todayStr,
      passengerCount: 1,
      price: 250000,
      deposit: 0,
      paymentStatus: 'UNPAID',
      bookingStatus: 'COMPLETED',
      serviceType: 'LIMOUSINE',
      pickupAddress: 'HN',
      dropoffAddress: 'QN',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await bookingRepo.create({
      id: 'B2',
      bookingCode: 'BK002',
      customerId: 'C2',
      departure: 'Quảng Ninh',
      destination: 'Hà Nội',
      travelTime: '14:00',
      travelDate: yesterdayStr,
      passengerCount: 2,
      price: 500000,
      deposit: 0,
      paymentStatus: 'PAID',
      bookingStatus: 'COMPLETED',
      serviceType: 'LIMOUSINE',
      pickupAddress: 'QN',
      dropoffAddress: 'HN',
      statusHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Seed Payments
    await paymentRepo.createPayment({
      id: 'P1',
      bookingId: 'B2',
      bookingCode: 'BK002',
      customerId: 'C2',
      totalAmount: 500000,
      paidAmount: 500000,
      depositAmount: 0,
      remainingAmount: 0,
      status: 'PAID',
      paymentMethod: 'BANK_TRANSFER',
      createdAt: `${yesterdayStr}T14:00:00+07:00`,
      updatedAt: `${yesterdayStr}T14:00:00+07:00`
    });
    
    // Run aggregation
    await aggregationService.aggregateDateRange(yesterdayStr, todayStr);
    
    console.log('[2] Checking AnalyticsSummaryRepository...');
    const yesterdaySummary = await summaryRepo.getByDate(yesterdayStr);
    console.log('Yesterday Summary:', JSON.stringify(yesterdaySummary?.booking, null, 2));

    const todaySummary = await summaryRepo.getByDate(todayStr);
    console.log('Today Summary:', JSON.stringify(todaySummary?.booking, null, 2));

    console.log('\n[3] Testing AnalyticsService Fallback (LAST_7_DAYS)...');
    // LAST_7_DAYS should merge yesterday and today (and 5 empty days)
    const result = await analyticsService.getSummaryByFilter('LAST_7_DAYS');
    
    console.log('Merged Bookings:', result.booking.totalBookings);
    console.log('Merged Completed Bookings:', result.booking.completedBookings);
    console.log('Merged Revenue:', result.revenue.totalRevenue);
    console.log('Merged Avg Booking Value:', result.revenue.averageBookingValue);
    
    console.log('\n[4] Output Matches Expectation?');
    if (result.booking.totalBookings === 4 && result.revenue.totalRevenue === 500000) {
      console.log('✅ PASS: Aggregation and Merge works perfectly.');
    } else {
      console.error('❌ FAIL: Data mismatch.');
    }

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

run();

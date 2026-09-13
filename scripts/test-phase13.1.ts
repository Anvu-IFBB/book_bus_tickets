/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '../src/repositories';
import { analyticsService } from '../src/services/analyticsService';
import { GetAnalyticsSchema } from '../src/types/analytics';
import assert from 'assert';

setRepositoryModeForTesting('memory');

async function testPhase13_1() {
  console.log('Bắt đầu test Phase 13.1 - Analytics Foundation');
  let passedCount = 0;
  let failedCount = 0;

  try {
    console.log('1. Kiểm tra Service Layer với filter YESTERDAY');
    const summary = await analyticsService.getSummaryByFilter('YESTERDAY');
    assert(summary.dateRange.startDate === summary.dateRange.endDate); 
    assert(summary.booking.totalBookings === 100); 
    assert(summary.revenue.totalRevenue === 50000000);
    console.log('✅ Service Layer hoạt động tốt.');
    passedCount++;

    console.log('2. Kiểm tra Zod Validation hợp lệ');
    const valid = GetAnalyticsSchema.safeParse({ filter: 'LAST_7_DAYS' });
    assert(valid.success === true);
    console.log('✅ Zod validation cho filter chuẩn hoạt động tốt.');
    passedCount++;

    console.log('3. Kiểm tra Zod Validation với Payload không hợp lệ (CUSTOM)');
    const invalidResult = GetAnalyticsSchema.safeParse({ filter: 'CUSTOM' });
    assert(invalidResult.success === false);
    assert(invalidResult.error.issues[0].message === 'customRange is required when filter is CUSTOM');
    console.log('✅ Zod validation chặn filter CUSTOM không kèm range.');
    passedCount++;

  } catch (err: any) {
    console.error(`❌ Lỗi Test Phase 13.1:`, err);
    failedCount++;
  }

  console.log(`\nKết quả Phase 13.1: Passed ${passedCount}, Failed ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

testPhase13_1().catch((e) => {
  console.error('Unhandled Rejection:', e);
  process.exit(1);
});

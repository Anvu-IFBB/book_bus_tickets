/* eslint-disable */
// @ts-nocheck
import { setRepositoryModeForTesting } from '../src/repositories';
import { GetAnalyticsSchema } from '../src/types/analytics';
import { Permissions } from '../src/lib/server/auth/permissions';
import { UserRole } from '../src/types/auth';
import assert from 'assert';

setRepositoryModeForTesting('memory');

async function testPhase13_2() {
  console.log('Bắt đầu test Phase 13.2 - Analytics Dashboard RBAC & Validation');
  let passedCount = 0;
  let failedCount = 0;

  try {
    console.log('1. Kiểm tra RBAC - ADMIN có quyền xem Analytics');
    const adminCanView = Permissions.canViewAnalytics('ADMIN' as UserRole);
    assert(adminCanView === true, 'ADMIN nên được quyền truy cập');
    console.log('✅ ADMIN có quyền hợp lệ.');
    passedCount++;

    console.log('2. Kiểm tra RBAC - OPERATOR có quyền xem Analytics');
    const opCanView = Permissions.canViewAnalytics('OPERATOR' as UserRole);
    assert(opCanView === true, 'OPERATOR nên được quyền truy cập');
    console.log('✅ OPERATOR có quyền hợp lệ.');
    passedCount++;

    console.log('3. Kiểm tra RBAC - DRIVER KHÔNG CÓ quyền xem Analytics');
    const driverCanView = Permissions.canViewAnalytics('DRIVER' as UserRole);
    assert(driverCanView === false, 'DRIVER không nên có quyền truy cập');
    console.log('✅ Hệ thống chặn DRIVER hợp lệ.');
    passedCount++;

    console.log('4. Kiểm tra Zod - Chặn filter không hợp lệ');
    const invalidParsed = GetAnalyticsSchema.safeParse({ filter: 'INVALID_FILTER' });
    assert(invalidParsed.success === false);
    console.log('✅ Zod chặn filter không hợp lệ.');
    passedCount++;

    console.log('5. Kiểm tra Zod - CUSTOM filter cần customRange');
    const invalidCustomParsed = GetAnalyticsSchema.safeParse({ filter: 'CUSTOM' });
    assert(invalidCustomParsed.success === false);
    console.log('✅ Zod chặn CUSTOM filter không có customRange.');
    passedCount++;

    console.log('6. Kiểm tra Zod - CUSTOM filter với customRange hợp lệ');
    const validCustomParsed = GetAnalyticsSchema.safeParse({ 
      filter: 'CUSTOM', 
      customRange: { startDate: '2023-10-01', endDate: '2023-10-31' } 
    });
    assert(validCustomParsed.success === true);
    console.log('✅ Zod cho phép CUSTOM filter hợp lệ.');
    passedCount++;

  } catch (err: unknown) {
    console.error(`❌ Lỗi Test Phase 13.2:`, err);
    failedCount++;
  }

  console.log(`\nKết quả Phase 13.2: Passed ${passedCount}, Failed ${failedCount}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

testPhase13_2().catch((e) => {
  console.error('Unhandled Rejection:', e);
  process.exit(1);
});

/* eslint-disable */
// @ts-nocheck
import { z } from 'zod';
import { formatInTimeZone } from 'date-fns-tz';

const GetAnalyticsSchema = z.object({
  filter: z.enum([
    'TODAY', 
    'YESTERDAY', 
    'LAST_7_DAYS', 
    'LAST_30_DAYS', 
    'THIS_MONTH', 
    'PREVIOUS_MONTH', 
    'CUSTOM'
  ]),
  customRange: z.object({
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD"),
  }).optional()
}).refine(data => {
  if (data.filter === 'CUSTOM') {
    if (!data.customRange) return false;
    
    // Ensure startDate <= endDate
    const start = new Date(data.customRange.startDate).getTime();
    const end = new Date(data.customRange.endDate).getTime();
    if (start > end) return false;
  }
  return true;
}, {
  message: "Invalid CUSTOM range: customRange is required and startDate must be <= endDate"
});

async function runTests() {
  console.log('=== PHASE 13.3 TESTS ===');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Test Zod Validation for CUSTOM range
  console.log('\n--- Test 1: Zod Validation ---');
  
  const validCustom = GetAnalyticsSchema.safeParse({
    filter: 'CUSTOM',
    customRange: { startDate: '2023-09-01', endDate: '2023-09-15' }
  });
  assert(validCustom.success, 'Valid CUSTOM range is accepted');

  const invalidCustomMissing = GetAnalyticsSchema.safeParse({
    filter: 'CUSTOM'
  });
  assert(!invalidCustomMissing.success, 'Missing customRange for CUSTOM filter is rejected');

  const invalidCustomFormat = GetAnalyticsSchema.safeParse({
    filter: 'CUSTOM',
    customRange: { startDate: '2023/09/01', endDate: '2023-09-15' }
  });
  assert(!invalidCustomFormat.success, 'Invalid date format is rejected');

  const invalidCustomLogic = GetAnalyticsSchema.safeParse({
    filter: 'CUSTOM',
    customRange: { startDate: '2023-09-15', endDate: '2023-09-01' }
  });
  assert(!invalidCustomLogic.success, 'startDate > endDate is rejected');

  // 2. Test Timezone VN Logic
  console.log('\n--- Test 2: Timezone Logic ---');
  const VN_TZ = 'Asia/Ho_Chi_Minh';
  
  // Test how standard date converts
  // We want to ensure that if a date is 2023-09-15 in VN, the startIso logic yields 2023-09-14T17:00:00.000Z
  const startDate = '2023-09-15';
  const startIso = new Date(`${startDate}T00:00:00.000+07:00`).toISOString();
  assert(startIso === '2023-09-14T17:00:00.000Z', `VN Midnight string converts correctly to UTC ISO (${startIso})`);

  const endDate = '2023-09-15';
  const endIso = new Date(`${endDate}T23:59:59.999+07:00`).toISOString();
  assert(endIso === '2023-09-15T16:59:59.999Z', `VN end of day string converts correctly to UTC ISO (${endIso})`);

  // Test current month string formatting for timezone edge cases
  const specificDate = new Date('2023-09-14T23:00:00.000Z'); // This is 06:00 15/09 in VN
  const vnFormatted = formatInTimeZone(specificDate, VN_TZ, 'yyyy-MM-dd HH:mm:ss');
  assert(vnFormatted === '2023-09-15 06:00:00', `Timezone format correctly shifts UTC to VN (${vnFormatted})`);

  console.log(`\nTests Completed: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
}

runTests();

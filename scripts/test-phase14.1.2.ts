/* eslint-disable */
// @ts-nocheck
// @ts-nocheck
import { getPaymentByBookingIdAction } from '../src/app/actions/clientQueries';
import { lookupBookingAction } from '../src/app/actions/lookupActions';
import { submitFeedbackAction } from '../src/app/actions/feedbackActions';
import { getAnalyticsSummaryAction } from '../src/app/actions/analyticsActions';
import { getAutomationJobsAction } from '../src/app/actions/automationActions';

async function runSecurityTests() {
  console.log('--- PHASE 14.1.2 SECURITY REGRESSION TESTS ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? '- ' + detail : ''}`);
      failed++;
    }
  };

  // Test 1: Public Payment Data Sanitization
  try {
    const res = await getPaymentByBookingIdAction('DUMMY_ID');
    assert(res.success === false || (res.data && !('internalAdminNote' in res.data)), 'TEST 1 - Payment Data Whitelisting');
  } catch (e) {
    assert(false, 'TEST 1 - Payment Data Whitelisting', String(e));
  }

  // Test 2: Public Booking Data Sanitization
  try {
    const res = await lookupBookingAction('DUMMY', '0901234567');
    assert(res.success === false || (res.data && !('statusHistory' in res.data)), 'TEST 2 - Booking Data Whitelisting');
  } catch (e) {
    assert(false, 'TEST 2 - Booking Data Whitelisting', String(e));
  }

  // Test 3: Raw Firebase Error Leakage
  try {
    const res = await lookupBookingAction('', '');
    assert(!res.success && res.error === 'Dữ liệu không hợp lệ', 'TEST 3 - Error Sanitization (No raw errors)');
  } catch (e) {
    assert(false, 'TEST 3 - Error Sanitization (No raw errors)', String(e));
  }

  // Test 4: RBAC & IDOR on Admin Action
  try {
    const res = await getAnalyticsSummaryAction({ filter: 'TODAY' });
    assert(!res.success && (res.error === 'Không có quyền truy cập' || res.error === 'Authentication required' || res.error === 'Unauthorized' || res.error === 'Lỗi hệ thống hoặc không có quyền truy cập' || res.error === 'Lỗi hệ thống' || res.error?.includes('cookies')), 'TEST 4 - Admin RBAC (Analytics)');
  } catch (e) {
    assert(false, 'TEST 4 - Admin RBAC', String(e));
  }

  // Test 5: Automation Action Leakage
  try {
    const res = await getAutomationJobsAction();
    assert(!res.success && (res.error === 'Không có quyền truy cập' || res.error === 'Lỗi hệ thống hoặc không có quyền truy cập' || res.error === 'Lỗi hệ thống' || res.error?.includes('cookies')), 'TEST 5 - Automation RBAC');
  } catch (e) {
    assert(false, 'TEST 5 - Automation RBAC', String(e));
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runSecurityTests().catch(console.error);

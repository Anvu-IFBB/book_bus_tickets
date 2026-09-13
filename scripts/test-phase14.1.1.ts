/* eslint-disable */
// @ts-nocheck
// @ts-nocheck
import { getPaymentByBookingIdAction } from '@/app/actions/clientQueries';
import { lookupBookingAction } from '@/app/actions/lookupActions';
import { getAdminFirestore } from '@/lib/firebase/admin';

async function runTests() {
  console.log('--- PHASE 14.1.1 REMEDIATION TESTS ---');
  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passCount++;
    } else {
      console.error(`❌ FAIL: ${msg}`);
      failCount++;
    }
  }

  // 1. Test getPaymentByBookingIdAction Data Leakage
  try {
    console.log('\n1. Testing getPaymentByBookingIdAction (Public Payment Summary)');
    // Try looking up a non-existent payment
    const res = await getPaymentByBookingIdAction('FAKE_BOOKING_ID_123', '0987654321');
    assert(res.success === false, 'Should fail gracefully on not found');

    // Create a mock booking & payment via firestore directly
    const db = getAdminFirestore();
    const testBookingId = `test-book-${Date.now()}`;
    const testCode = `TST${Date.now()}`;
    const testPhone = '0988777666';

    await db.collection('bookings').doc(testBookingId).set({
      id: testBookingId,
      bookingCode: testCode,
      customerId: 'cust-123',
      serviceType: 'TICKET',
      bookingStatus: 'NEW',
    });

    await db.collection('customers').doc('cust-123').set({
      id: 'cust-123',
      phone: testPhone,
      name: 'Test Customer'
    });

    await db.collection('payments').doc(`pay-${testBookingId}`).set({
      id: `pay-${testBookingId}`,
      bookingId: testBookingId,
      bookingCode: testCode,
      customerId: 'cust-123',
      status: 'PAID',
      totalAmount: 500000,
      paymentMethod: 'CASH',
      // Internal sensitive field
      internalAdminNote: 'This should not be exposed',
    });

    const successRes = await getPaymentByBookingIdAction(testBookingId, testPhone);
    assert(successRes.success === true, 'Should find the payment');
    if (successRes.data) {
      const dataKeys = Object.keys(successRes.data);
      assert(!dataKeys.includes('customerId'), 'customerId should be removed');
      assert(!dataKeys.includes('internalAdminNote'), 'internal notes should be removed');
      assert(dataKeys.includes('status'), 'status should be present');
      assert(dataKeys.includes('totalAmount'), 'totalAmount should be present');
    }

  } catch (e) {
    console.error('Error in Test 1:', e);
    failCount++;
  }

  // 2. Test lookupBookingAction Masking
  try {
    console.log('\n2. Testing lookupBookingAction (Public Booking Summary)');
    
    const db = getAdminFirestore();
    const testBookingId = `test-book-lookup-${Date.now()}`;
    const testCode = `LUK${Date.now()}`;
    const testPhone = '0911222333';

    await db.collection('bookings').doc(testBookingId).set({
      id: testBookingId,
      bookingCode: testCode,
      customerId: 'cust-456',
      serviceType: 'TICKET',
      bookingStatus: 'NEW',
      driverId: 'drv-001',
      vehicleId: 'veh-001',
      statusHistory: [
        { status: 'NEW', changedBy: 'admin@system.local', changedAt: '2023-01-01' }
      ]
    });

    await db.collection('customers').doc('cust-456').set({
      id: 'cust-456',
      phone: testPhone,
      name: 'Test Customer Lookup'
    });

    const res = await lookupBookingAction(testCode, testPhone);
    assert(res.success === true, 'Should find the booking');
    if (res.data) {
      const dataKeys = Object.keys(res.data);
      assert(!dataKeys.includes('driverId'), 'driverId should be removed');
      assert(!dataKeys.includes('vehicleId'), 'vehicleId should be removed');
      assert(!dataKeys.includes('customerId'), 'customerId should be removed');
      
      const maskedActor = res.data.statusHistory?.[0].changedBy;
      assert(maskedActor === 'SYSTEM_ADMIN', `Actor should be masked as SYSTEM_ADMIN, got: ${maskedActor}`);
    }

  } catch (e) {
    console.error('Error in Test 2:', e);
    failCount++;
  }

  // 3. Test handleActionError raw message protection
  try {
    console.log('\n3. Testing Raw Error Leakage Protection');
    const { getPaymentByBookingIdAction } = await import('@/app/actions/clientQueries');
    
    // Pass null deliberately to cause a type error/internal error if possible, or we can just mock an error
    // For this, we can test lookupBookingAction with invalid firebase config if possible, or just mock the call.
    // Instead, let's just create a new function in action-error and test it directly.
    const { handleActionError } = await import('@/lib/server/action-error');
    
    const firestoreError = new Error('7 PERMISSION_DENIED: Missing or insufficient permissions.');
    const result = handleActionError(firestoreError, 'testFunction');
    
    assert(result.success === false, 'Error handler should return success: false');
    assert(result.error === 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.', 'Error handler should mask raw firestore messages');
    
  } catch (e) {
    console.error('Error in Test 3:', e);
    failCount++;
  }

  console.log(`\nTests completed: ${passCount} passed, ${failCount} failed.`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests().catch(console.error);

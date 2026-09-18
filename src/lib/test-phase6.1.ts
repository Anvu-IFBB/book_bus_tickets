import { createBookingAction } from '@/app/actions/bookingActions';
import { bookingService } from '@/services/bookingService';
import { listBookingsWithDetailsAction, getBookingDetailsWithEnrichmentAction } from '@/app/actions/operationsQueries';
import { setRepositoryModeForTesting } from '@/repositories';
import { CreateBookingDTO } from '@/types/booking';

async function runPhase61Tests() {
  console.log('--- STARTING PHASE 6.1 INTEGRATION TESTS ---');
  // Ép chế độ firestore để test Firestore persistence
  setRepositoryModeForTesting('firestore');

  const testPhone = '0988777666';
  const dto: CreateBookingDTO = {
    serviceType: 'LIMOUSINE',
    departure: 'Hà Nội',
    destination: 'Hạ Long',
    travelDate: '2026-10-15',
    travelTime: '08:00',
    passengerCount: 2,
    customerName: 'Nguyễn Văn Test',
    customerPhone: testPhone,
    pickupAddress: 'Trần Duy Hưng',
    dropoffAddress: 'Bãi Cháy',
  };

  console.log('\n1. Creating public booking...');
  const createRes = await createBookingAction(dto);
  if (!createRes.success || !createRes.data) {
    console.error('Failed to create booking:', createRes.error);
    process.exit(1);
  }
  const bookingId = createRes.data.id;
  const bookingCode = createRes.data.bookingCode;
  console.log(`✅ Booking created successfully. ID: ${bookingId}, Code: ${bookingCode}`);

  console.log('\n2. Testing Admin List Action (Simulate /admin/bookings)...');
  const listRes = await listBookingsWithDetailsAction({ search: bookingCode }, 1, 10);
  if (!listRes || !listRes.items) {
    console.error('Failed to list bookings or malformed response');
    process.exit(1);
  }
  const foundInList = listRes.items.find(b => b.bookingCode === bookingCode);
  if (!foundInList) {
    console.error(`Booking ${bookingCode} not found in the Admin list!`);
    process.exit(1);
  }
  console.log(`✅ Admin list properly fetched booking from Firestore. Status: ${foundInList.bookingStatus}`);

  console.log('\n3. Testing Admin Detail Action (Simulate /admin/bookings/[id])...');
  const detailRes = await getBookingDetailsWithEnrichmentAction(bookingId);
  if (!detailRes) {
    console.error(`Failed to fetch detail for booking ${bookingId}`);
    process.exit(1);
  }
  console.log(`✅ Admin detail fetched successfully. Customer: ${detailRes.customerName}`);

  console.log('\n4. Testing Update Status to CONFIRMED...');
  const updatedBooking = await bookingService.updateStatus(bookingId, 'CONFIRMED', 'admin@example.com', 'Đã xác nhận với khách', 'SUPER_ADMIN');
  console.log(`✅ Status updated to ${updatedBooking.bookingStatus}`);

  console.log('\n5. Verifying Update Persistence in Firestore...');
  const detailResAfter = await getBookingDetailsWithEnrichmentAction(bookingId);
  if (detailResAfter?.bookingStatus !== 'CONFIRMED') {
    console.error(`Status did not persist! Expected CONFIRMED, got ${detailResAfter?.bookingStatus}`);
    process.exit(1);
  }
  const history = detailResAfter.statusHistory;
  if (!history || history.length < 2) {
    console.error('Status history was not appended correctly');
    process.exit(1);
  }
  console.log(`✅ Persistence verified. Status is ${detailResAfter.bookingStatus}. History length: ${history.length}`);

  console.log('\n6. Testing Cancel Booking...');
  await bookingService.updateStatus(bookingId, 'CANCELLED', 'admin@example.com', 'Khách báo hủy', 'SUPER_ADMIN');
  console.log(`✅ Booking cancelled successfully.`);

  const detailResFinal = await getBookingDetailsWithEnrichmentAction(bookingId);
  if (detailResFinal?.bookingStatus !== 'CANCELLED') {
    console.error(`Cancel did not persist!`);
    process.exit(1);
  }
  console.log(`✅ Final status is ${detailResFinal.bookingStatus}. Test completed successfully.`);
}

runPhase61Tests().catch(console.error);

import { createBookingAction } from '../app/actions/bookingActions';
import { lookupBookingAction } from '../app/actions/lookupActions';

async function runBookingTest() {
  console.log('=== BOOKING RUNTIME TEST ===');
  try {
    const b1 = await createBookingAction({
      customerName: 'Test Booking Public',
      customerPhone: '0909999999',
      serviceType: 'LIMOUSINE',
      departure: 'Hà Nội',
      destination: 'Hạ Long',
      travelDate: new Date().toISOString().slice(0, 10),
      travelTime: '10:00',
      passengerCount: 2,
      pickupAddress: 'HN Test',
      dropoffAddress: 'HL Test'
    });
    
    if (!b1.success || !b1.data) {
      console.error('Lỗi khi tạo booking:', b1.error);
      process.exit(1);
    }
    
    console.log(`✔ Đã tạo booking thành công: ${b1.data.bookingCode}`);
    
    console.log('Testing booking lookup...');
    const lookup = await lookupBookingAction(b1.data.bookingCode, '0909999999');
    if (!lookup.success) {
      console.error('Lỗi khi tra cứu booking:', lookup.error);
      process.exit(1);
    }
    
    console.log(`✔ Lookup thành công cho booking ${lookup.data?.bookingCode}`);
    console.log('=== TEST PASS ===');
    process.exit(0);
  } catch (error) {
    console.error('Lỗi Server Action:', error);
    process.exit(1);
  }
}

runBookingTest();

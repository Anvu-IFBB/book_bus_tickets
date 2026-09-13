import { IAnalyticsRepository } from '../interfaces/analyticsRepository';
import { AnalyticsDateRange, AnalyticsSummary, BookingAnalytics, RevenueAnalytics, FleetAnalytics, FeedbackAnalytics } from '@/types/analytics';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { Booking } from '@/types/booking';
import { Payment } from '@/types/payment';
import { Trip } from '@/types/fleet';
import { Feedback } from '@/types/feedback';

export class FirestoreAnalyticsRepository implements IAnalyticsRepository {
  async getAnalyticsSummary(dateRange: AnalyticsDateRange): Promise<AnalyticsSummary> {
    const db = getFirebaseFirestore();
    if (!db) throw new Error('Firebase Firestore không khả dụng');

    const { startDate, endDate } = dateRange;
    
    // startDate and endDate are 'YYYY-MM-DD' representing days in Vietnam (Asia/Ho_Chi_Minh).
    // We append the +07:00 offset to represent VN Midnight, then convert to ISOString (UTC Z)
    // to correctly query Firestore timestamp fields which are stored as UTC ISO strings.
    const startIso = new Date(`${startDate}T00:00:00.000+07:00`).toISOString();
    const endIso = new Date(`${endDate}T23:59:59.999+07:00`).toISOString();

    // 1. Bookings (Filtered by travelDate for operational analytics)
    const bookingsRef = collection(db, 'bookings');
    const qBookings = query(bookingsRef, where('travelDate', '>=', startDate), where('travelDate', '<=', endDate));
    const bookingsSnapshot = await getDocs(qBookings);
    const bookings = bookingsSnapshot.docs.map(d => d.data() as Booking);

    // 2. Payments (Filtered by createdAt for financial analytics)
    const paymentsRef = collection(db, 'payments');
    const qPayments = query(paymentsRef, where('createdAt', '>=', startIso), where('createdAt', '<=', endIso));
    const paymentsSnapshot = await getDocs(qPayments);
    const payments = paymentsSnapshot.docs.map(d => d.data() as Payment);

    // 3. Fleet/Trips (Filtered by departureDate)
    const tripsRef = collection(db, 'trips');
    const qTrips = query(tripsRef, where('departureDate', '>=', startDate), where('departureDate', '<=', endDate));
    const tripsSnapshot = await getDocs(qTrips);
    const trips = tripsSnapshot.docs.map(d => d.data() as Trip);

    // 4. Feedbacks (Filtered by submittedAt)
    const feedbacksRef = collection(db, 'feedbacks');
    const qFeedbacks = query(feedbacksRef, where('submittedAt', '>=', startIso), where('submittedAt', '<=', endIso));
    const feedbacksSnapshot = await getDocs(qFeedbacks);
    const feedbacks = feedbacksSnapshot.docs.map(d => d.data() as Feedback);

    return {
      dateRange,
      booking: this.aggregateBookings(bookings),
      revenue: this.aggregateRevenue(payments),
      fleet: this.aggregateFleet(trips),
      feedback: this.aggregateFeedback(feedbacks),
    };
  }

  private aggregateBookings(bookings: Booking[]): BookingAnalytics {
    const totalBookings = bookings.length;
    let completedBookings = 0;
    let cancelledBookings = 0;
    const statusDistribution: Record<string, number> = {};
    const serviceTypeDistribution: Record<string, number> = {};
    const routeDistribution: Record<string, number> = {};

    bookings.forEach(b => {
      if (b.bookingStatus === 'COMPLETED') completedBookings++;
      if (b.bookingStatus === 'CANCELLED') cancelledBookings++;

      statusDistribution[b.bookingStatus] = (statusDistribution[b.bookingStatus] || 0) + 1;
      serviceTypeDistribution[b.serviceType] = (serviceTypeDistribution[b.serviceType] || 0) + 1;
      
      const route = `${b.departure} - ${b.destination}`;
      routeDistribution[route] = (routeDistribution[route] || 0) + 1;
    });

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0,
      statusDistribution,
      serviceTypeDistribution,
      routeDistribution,
    };
  }

  private aggregateRevenue(payments: Payment[]): RevenueAnalytics {
    let totalRevenue = 0;
    let totalDeposit = 0;
    let totalRemaining = 0;
    const dailyMap: Record<string, number> = {};

    payments.forEach(p => {
      // Only count PAID or DEPOSITED for revenue
      if (p.status === 'PAID' || p.status === 'DEPOSITED') {
        totalRevenue += p.paidAmount || 0;
        totalDeposit += p.depositAmount || 0;
        totalRemaining += p.remainingAmount || 0;

        const date = p.createdAt.split('T')[0];
        dailyMap[date] = (dailyMap[date] || 0) + (p.paidAmount || 0);
      }
    });

    const dailyRevenue = Object.keys(dailyMap).sort().map(date => ({
      date,
      amount: dailyMap[date]
    }));

    // Find average booking value by dividing total revenue by count of successful payments
    const successfulPaymentsCount = payments.filter(p => p.status === 'PAID' || p.status === 'DEPOSITED').length;

    return {
      totalRevenue,
      totalDeposit,
      totalRemaining,
      dailyRevenue,
      averageBookingValue: successfulPaymentsCount > 0 ? totalRevenue / successfulPaymentsCount : 0,
    };
  }

  private aggregateFleet(trips: Trip[]): FleetAnalytics {
    let completedTrips = 0;
    let totalBookedSeats = 0;
    let totalMaxSeats = 0;

    trips.forEach(t => {
      if (t.status === 'COMPLETED') completedTrips++;
      
      // Calculate utilization only for non-cancelled trips
      if (t.status !== 'CANCELLED') {
        totalBookedSeats += t.bookedSeats || 0;
        totalMaxSeats += t.maxSeats || 0;
      }
    });

    return {
      totalTrips: trips.length,
      completedTrips,
      fleetUtilization: totalMaxSeats > 0 ? (totalBookedSeats / totalMaxSeats) * 100 : 0,
    };
  }

  private aggregateFeedback(feedbacks: Feedback[]): FeedbackAnalytics {
    let totalRating = 0;
    const categoryDistribution: Record<string, number> = {};

    feedbacks.forEach(f => {
      totalRating += f.rating;
      categoryDistribution[f.category] = (categoryDistribution[f.category] || 0) + 1;
    });

    return {
      totalFeedback: feedbacks.length,
      averageRating: feedbacks.length > 0 ? totalRating / feedbacks.length : 0,
      categoryDistribution,
    };
  }
}

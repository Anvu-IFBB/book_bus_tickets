import { IAnalyticsRepository } from '../interfaces/analyticsRepository';
import { AnalyticsDateRange, AnalyticsSummary, BookingAnalytics, RevenueAnalytics, FleetAnalytics, FeedbackAnalytics } from '@/types/analytics';
import { getBookingRepository, getPaymentRepository, getFleetRepository, getFeedbackRepository } from '@/repositories';
import { Booking } from '@/types/booking';
import { Payment } from '@/types/payment';
import { Trip } from '@/types/fleet';
import { Feedback } from '@/types/feedback';
import { formatInTimeZone } from 'date-fns-tz';

export class MemoryAnalyticsRepository implements IAnalyticsRepository {
  async getAnalyticsSummary(dateRange: AnalyticsDateRange): Promise<AnalyticsSummary> {
    const { startDate, endDate } = dateRange;
    const startIso = new Date(`${startDate}T00:00:00.000+07:00`).toISOString();
    const endIso = new Date(`${endDate}T23:59:59.999+07:00`).toISOString();

    const bookingRepo = getBookingRepository();
    const paymentRepo = getPaymentRepository();
    const fleetRepo = getFleetRepository();
    const feedbackRepo = getFeedbackRepository();

    // 1. Fetch
    const allBookings = await bookingRepo.list();
    const bookings = allBookings.filter(b => b.travelDate >= startDate && b.travelDate <= endDate);

    const allPayments = await paymentRepo.listPayments();
    const payments = allPayments.filter(p => p.createdAt >= startIso && p.createdAt <= endIso);

    const allTrips = await fleetRepo.listTrips();
    const trips = allTrips.filter(t => t.departureDate >= startDate && t.departureDate <= endDate);

    const allFeedbacks = await feedbackRepo.list();
    const feedbacks = allFeedbacks.filter(f => f.submittedAt >= startIso && f.submittedAt <= endIso);

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
      if (p.status === 'PAID' || p.status === 'DEPOSITED') {
        totalRevenue += p.paidAmount || 0;
        totalDeposit += p.depositAmount || 0;
        totalRemaining += p.remainingAmount || 0;

        const date = formatInTimeZone(new Date(p.createdAt), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
        dailyMap[date] = (dailyMap[date] || 0) + (p.paidAmount || 0);
      }
    });

    const dailyRevenue = Object.keys(dailyMap).sort().map(date => ({
      date,
      amount: dailyMap[date]
    }));

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

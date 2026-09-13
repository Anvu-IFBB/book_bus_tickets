import { DailyAnalyticsSummary } from '@/types/analyticsSummary';
import { BookingAnalytics, RevenueAnalytics, FleetAnalytics, FeedbackAnalytics } from '@/types/analytics';
import { 
  getBookingRepository, 
  getPaymentRepository, 
  getFleetRepository, 
  getFeedbackRepository,
  getAnalyticsSummaryRepository
} from '@/repositories';
import { Booking } from '@/types/booking';
import { Payment } from '@/types/payment';
import { Trip } from '@/types/fleet';
import { Feedback } from '@/types/feedback';
import { formatInTimeZone } from 'date-fns-tz';

export class AnalyticsAggregationService {
  private readonly TIMEZONE = 'Asia/Ho_Chi_Minh';

  /**
   * Aggregate data for a specific day and save it to the summary repository.
   * @param dateKey The date in YYYY-MM-DD format (VN Timezone)
   */
  async aggregateDay(dateKey: string): Promise<DailyAnalyticsSummary> {
    // Determine the ISO bounds for this date in VN timezone
    // Start: dateKey 00:00:00+07:00
    // End: dateKey 23:59:59.999+07:00
    const startIso = new Date(`${dateKey}T00:00:00.000+07:00`).toISOString();
    const endIso = new Date(`${dateKey}T23:59:59.999+07:00`).toISOString();

    const bookingRepo = getBookingRepository();
    const paymentRepo = getPaymentRepository();
    const fleetRepo = getFleetRepository();
    const feedbackRepo = getFeedbackRepository();

    // 1. Fetch raw data
    // Bookings filter by travelDate (which is YYYY-MM-DD)
    const bookings = await bookingRepo.list({ date: dateKey });

    // Payments filter by createdAt (ISO string). The repository list method might not support 
    // date range filtering out of the box, so we fetch all and filter in memory if needed,
    // OR we need to add date range to PaymentFilter. Let's see if PaymentFilter has dateRange.
    // Actually, in the real-time aggregation, we query Firestore directly. 
    // Here we should use the repository interfaces.
    // Wait, IPaymentRepository.list(filter) might not support start/end date.
    // We can just fetch all payments for now, but that's inefficient.
    // Let's check IPaymentRepository first.
    // If it doesn't support it, we'll fetch all and filter.
    const allPayments = await paymentRepo.listPayments();
    const payments = allPayments.filter(p => p.createdAt >= startIso && p.createdAt <= endIso);

    // Trips filter by departureDate (YYYY-MM-DD)
    const trips = await fleetRepo.listTrips(dateKey);

    // Feedbacks filter by submittedAt (ISO string)
    const allFeedbacks = await feedbackRepo.list();
    const feedbacks = allFeedbacks.filter(f => f.submittedAt >= startIso && f.submittedAt <= endIso);

    const bookingResult = this.aggregateBookings(bookings);
    const revenueResult = this.aggregateRevenue(payments);
    const fleetResult = this.aggregateFleet(trips);
    const feedbackResult = this.aggregateFeedback(feedbacks);

    const summary: DailyAnalyticsSummary = {
      id: dateKey,
      dateKey,
      dateRange: { startDate: dateKey, endDate: dateKey },
      booking: bookingResult.analytics,
      revenue: revenueResult.analytics,
      fleet: fleetResult.analytics,
      feedback: feedbackResult.analytics,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      _successfulPaymentsCount: revenueResult.successfulPaymentsCount,
      _totalBookedSeats: fleetResult.totalBookedSeats,
      _totalMaxSeats: fleetResult.totalMaxSeats,
      _totalRatingSum: feedbackResult.totalRatingSum,
    };

    // 3. Save to summary repository
    const summaryRepo = getAnalyticsSummaryRepository();
    await summaryRepo.upsert(summary);

    return summary;
  }

  /**
   * Aggregate multiple days
   */
  async aggregateDateRange(startDate: string, endDate: string): Promise<void> {
    const current = new Date(`${startDate}T00:00:00.000+07:00`);
    const end = new Date(`${endDate}T00:00:00.000+07:00`);

    while (current <= end) {
      const dateKey = formatInTimeZone(current, this.TIMEZONE, 'yyyy-MM-dd');
      await this.aggregateDay(dateKey);
      current.setDate(current.getDate() + 1);
    }
  }

  private aggregateBookings(bookings: Booking[]): { analytics: BookingAnalytics } {
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
      analytics: {
        totalBookings,
        completedBookings,
        cancelledBookings,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
        cancellationRate: totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0,
        statusDistribution,
        serviceTypeDistribution,
        routeDistribution,
      }
    };
  }

  private aggregateRevenue(payments: Payment[]): { analytics: RevenueAnalytics, successfulPaymentsCount: number } {
    let totalRevenue = 0;
    let totalDeposit = 0;
    let totalRemaining = 0;
    const dailyMap: Record<string, number> = {};

    payments.forEach(p => {
      if (p.status === 'PAID' || p.status === 'DEPOSITED') {
        totalRevenue += p.paidAmount || 0;
        totalDeposit += p.depositAmount || 0;
        totalRemaining += p.remainingAmount || 0;

        // Ensure date is correctly mapped to VN timezone
        const date = formatInTimeZone(new Date(p.createdAt), this.TIMEZONE, 'yyyy-MM-dd');
        dailyMap[date] = (dailyMap[date] || 0) + (p.paidAmount || 0);
      }
    });

    const dailyRevenue = Object.keys(dailyMap).sort().map(date => ({
      date,
      amount: dailyMap[date]
    }));

    const successfulPaymentsCount = payments.filter(p => p.status === 'PAID' || p.status === 'DEPOSITED').length;

    return {
      analytics: {
        totalRevenue,
        totalDeposit,
        totalRemaining,
        dailyRevenue,
        averageBookingValue: successfulPaymentsCount > 0 ? totalRevenue / successfulPaymentsCount : 0,
      },
      successfulPaymentsCount
    };
  }

  private aggregateFleet(trips: Trip[]): { analytics: FleetAnalytics, totalBookedSeats: number, totalMaxSeats: number } {
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
      analytics: {
        totalTrips: trips.length,
        completedTrips,
        fleetUtilization: totalMaxSeats > 0 ? (totalBookedSeats / totalMaxSeats) * 100 : 0,
      },
      totalBookedSeats,
      totalMaxSeats
    };
  }

  private aggregateFeedback(feedbacks: Feedback[]): { analytics: FeedbackAnalytics, totalRatingSum: number } {
    let totalRatingSum = 0;
    const categoryDistribution: Record<string, number> = {};

    feedbacks.forEach(f => {
      totalRatingSum += f.rating;
      categoryDistribution[f.category] = (categoryDistribution[f.category] || 0) + 1;
    });

    return {
      analytics: {
        totalFeedback: feedbacks.length,
        averageRating: feedbacks.length > 0 ? totalRatingSum / feedbacks.length : 0,
        categoryDistribution,
      },
      totalRatingSum
    };
  }
}

import { AnalyticsDateRange, AnalyticsSummary, AnalyticsFilter, BookingAnalytics, RevenueAnalytics, FleetAnalytics, FeedbackAnalytics } from '@/types/analytics';
import { subDays, subMonths } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

const VN_TZ = 'Asia/Ho_Chi_Minh';

export class AnalyticsService {
  /**
   * Retrieves analytics summary based on a given filter preset.
   */
  async getSummaryByFilter(filter: AnalyticsFilter, customRange?: AnalyticsDateRange): Promise<AnalyticsSummary> {
    let dateRange: AnalyticsDateRange;

    // Use current time, but format dates strictly in VN Timezone
    const now = new Date();

    switch (filter) {
      case 'TODAY':
        dateRange = {
          startDate: formatInTimeZone(now, VN_TZ, 'yyyy-MM-dd'),
          endDate: formatInTimeZone(now, VN_TZ, 'yyyy-MM-dd'),
        };
        break;
      case 'YESTERDAY': {
        const yesterday = subDays(now, 1);
        dateRange = {
          startDate: formatInTimeZone(yesterday, VN_TZ, 'yyyy-MM-dd'),
          endDate: formatInTimeZone(yesterday, VN_TZ, 'yyyy-MM-dd'),
        };
        break;
      }
      case 'LAST_7_DAYS': {
        dateRange = {
          startDate: formatInTimeZone(subDays(now, 6), VN_TZ, 'yyyy-MM-dd'), // 6 days ago + today = 7 days
          endDate: formatInTimeZone(now, VN_TZ, 'yyyy-MM-dd'),
        };
        break;
      }
      case 'LAST_30_DAYS': {
        dateRange = {
          startDate: formatInTimeZone(subDays(now, 29), VN_TZ, 'yyyy-MM-dd'), // 29 days ago + today = 30 days
          endDate: formatInTimeZone(now, VN_TZ, 'yyyy-MM-dd'),
        };
        break;
      }
      case 'THIS_MONTH': {
        // Because startOfMonth uses local system timezone, we first need to get the "local" equivalent of VN time
        // The safest way is to parse the YYYY-MM of VN time and append -01
        const currentMonthStr = formatInTimeZone(now, VN_TZ, 'yyyy-MM');
        dateRange = {
          startDate: `${currentMonthStr}-01`,
          endDate: formatInTimeZone(now, VN_TZ, 'yyyy-MM-dd'),
        };
        break;
      }
      case 'PREVIOUS_MONTH': {
        const prevMonthDate = subMonths(now, 1);
        const prevMonthStr = formatInTimeZone(prevMonthDate, VN_TZ, 'yyyy-MM');
        // calculate the last day of the previous month
        // We can create a date at day 1 of the *current* month in UTC, and subtract 1 day.
        const currentMonthStr = formatInTimeZone(now, VN_TZ, 'yyyy-MM');
        const firstDayCurrentMonth = new Date(`${currentMonthStr}-01T00:00:00Z`);
        const lastDayPrevMonth = subDays(firstDayCurrentMonth, 1);
        
        dateRange = {
          startDate: `${prevMonthStr}-01`,
          endDate: lastDayPrevMonth.toISOString().split('T')[0],
        };
        break;
      }
      case 'CUSTOM': {
        if (!customRange) {
          throw new Error('Custom range requires startDate and endDate');
        }
        if (customRange.startDate > customRange.endDate) {
          throw new Error('startDate cannot be after endDate');
        }
        dateRange = customRange;
        break;
      }
      default:
        throw new Error(`Unsupported filter: ${filter}`);
    }

    const { getAnalyticsSummaryRepository, getAnalyticsRepository } = await import('@/repositories');
    
    // Try to read from Summary Repository first (works in both Memory and Firestore modes)
    try {
      const summaryRepo = getAnalyticsSummaryRepository();
      
      if (dateRange.startDate === dateRange.endDate) {
        const daySummary = await summaryRepo.getByDate(dateRange.startDate);
        if (daySummary) return daySummary;
      } else {
        const summaries = await summaryRepo.getByDateRange(dateRange.startDate, dateRange.endDate);
        
        // Calculate expected number of days
        const start = new Date(`${dateRange.startDate}T00:00:00Z`);
        const end = new Date(`${dateRange.endDate}T00:00:00Z`);
        const expectedDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        
        if (summaries.length === expectedDays && expectedDays > 0) {
          return this.mergeSummaries(summaries, dateRange);
        }
      }
    } catch (err: unknown) {
      console.warn('Analytics summary fallback failed, using real-time computation:', err);
    }

    // Fallback to real-time computation if summary missing or in memory mode
    const repo = getAnalyticsRepository();
    return await repo.getAnalyticsSummary(dateRange);
  }

  private mergeSummaries(summaries: (AnalyticsSummary & { _successfulPaymentsCount?: number; _totalMaxSeats?: number; _totalBookedSeats?: number; _totalRatingSum?: number })[], dateRange: AnalyticsDateRange): AnalyticsSummary {
    const booking: BookingAnalytics = {
      totalBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      completionRate: 0,
      cancellationRate: 0,
      statusDistribution: {},
      serviceTypeDistribution: {},
      routeDistribution: {}
    };

    const revenue: RevenueAnalytics = {
      totalRevenue: 0,
      totalDeposit: 0,
      totalRemaining: 0,
      dailyRevenue: [],
      averageBookingValue: 0
    };

    const fleet: FleetAnalytics = {
      totalTrips: 0,
      completedTrips: 0,
      fleetUtilization: 0
    };

    const feedback: FeedbackAnalytics = {
      totalFeedback: 0,
      averageRating: 0,
      categoryDistribution: {}
    };

    let totalMaxSeats = 0;
    let totalBookedSeats = 0;
    let totalRatingSum = 0;
    let successfulPaymentsCount = 0;

    for (const s of summaries) {
      // Booking
      booking.totalBookings += s.booking.totalBookings;
      booking.completedBookings += s.booking.completedBookings;
      booking.cancelledBookings += s.booking.cancelledBookings;
      this.mergeRecord(booking.statusDistribution, s.booking.statusDistribution);
      this.mergeRecord(booking.serviceTypeDistribution, s.booking.serviceTypeDistribution);
      this.mergeRecord(booking.routeDistribution, s.booking.routeDistribution);

      // Revenue
      revenue.totalRevenue += s.revenue.totalRevenue;
      revenue.totalDeposit += s.revenue.totalDeposit;
      revenue.totalRemaining += s.revenue.totalRemaining;
      revenue.dailyRevenue.push(...s.revenue.dailyRevenue);
      successfulPaymentsCount += s._successfulPaymentsCount || 0;

      // Fleet
      fleet.totalTrips += s.fleet.totalTrips;
      fleet.completedTrips += s.fleet.completedTrips;
      totalMaxSeats += s._totalMaxSeats || 0;
      totalBookedSeats += s._totalBookedSeats || 0;

      // Feedback
      feedback.totalFeedback += s.feedback.totalFeedback;
      totalRatingSum += s._totalRatingSum || 0;
      this.mergeRecord(feedback.categoryDistribution, s.feedback.categoryDistribution);
    }

    // Recalculate Averages
    booking.completionRate = booking.totalBookings > 0 ? (booking.completedBookings / booking.totalBookings) * 100 : 0;
    booking.cancellationRate = booking.totalBookings > 0 ? (booking.cancelledBookings / booking.totalBookings) * 100 : 0;
    
    revenue.averageBookingValue = successfulPaymentsCount > 0 ? revenue.totalRevenue / successfulPaymentsCount : 0;
    
    fleet.fleetUtilization = totalMaxSeats > 0 ? (totalBookedSeats / totalMaxSeats) * 100 : 0;
    
    feedback.averageRating = feedback.totalFeedback > 0 ? totalRatingSum / feedback.totalFeedback : 0;

    return {
      dateRange,
      booking,
      revenue,
      fleet,
      feedback
    };
  }

  private mergeRecord(target: Record<string, number>, source: Record<string, number>) {
    for (const [key, value] of Object.entries(source)) {
      target[key] = (target[key] || 0) + value;
    }
  }
}

export const analyticsService = new AnalyticsService();

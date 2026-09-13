import { z } from 'zod';

export interface AnalyticsDateRange {
  startDate: string; // ISO string (YYYY-MM-DD)
  endDate: string; // ISO string (YYYY-MM-DD)
}

export type AnalyticsFilter = 'TODAY' | 'YESTERDAY' | 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'THIS_MONTH' | 'PREVIOUS_MONTH' | 'CUSTOM';

export const GetAnalyticsSchema = z.object({
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

export interface BookingAnalytics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  completionRate: number; // Percentage 0-100
  cancellationRate: number; // Percentage 0-100
  statusDistribution: Record<string, number>;
  serviceTypeDistribution: Record<string, number>;
  routeDistribution: Record<string, number>; // Based on departure - destination
}

export interface RevenueAnalytics {
  totalRevenue: number; // Paid amount
  totalDeposit: number; // Deposit amount
  totalRemaining: number; // Remaining amount
  dailyRevenue: { date: string; amount: number }[];
  averageBookingValue: number;
}

export interface FleetAnalytics {
  totalTrips: number;
  completedTrips: number;
  fleetUtilization: number; // Percentage of bookedSeats / maxSeats across trips
}

export interface FeedbackAnalytics {
  totalFeedback: number;
  averageRating: number;
  categoryDistribution: Record<string, number>;
}

export interface AnalyticsSummary {
  dateRange: AnalyticsDateRange;
  booking: BookingAnalytics;
  revenue: RevenueAnalytics;
  fleet: FleetAnalytics;
  feedback: FeedbackAnalytics;
}

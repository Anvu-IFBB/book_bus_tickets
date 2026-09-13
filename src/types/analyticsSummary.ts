import { AnalyticsSummary } from './analytics';

export interface DailyAnalyticsSummary extends AnalyticsSummary {
  id: string; // Document ID (YYYY-MM-DD)
  dateKey: string; // YYYY-MM-DD in VN timezone
  createdAt: string; // ISO String
  updatedAt: string; // ISO String
  
  // Internal fields for accurate math during multi-day aggregation
  _successfulPaymentsCount: number;
  _totalBookedSeats: number;
  _totalMaxSeats: number;
  _totalRatingSum: number;
}

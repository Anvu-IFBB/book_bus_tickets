import { AnalyticsDateRange, AnalyticsSummary } from '@/types/analytics';

export interface IAnalyticsRepository {
  getAnalyticsSummary(dateRange: AnalyticsDateRange): Promise<AnalyticsSummary>;
}

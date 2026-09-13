import { DailyAnalyticsSummary } from '@/types/analyticsSummary';

export interface IAnalyticsSummaryRepository {
  getByDate(dateKey: string): Promise<DailyAnalyticsSummary | null>;
  getByDateRange(startDate: string, endDate: string): Promise<DailyAnalyticsSummary[]>;
  upsert(summary: DailyAnalyticsSummary): Promise<void>;
  delete(dateKey: string): Promise<void>;
}

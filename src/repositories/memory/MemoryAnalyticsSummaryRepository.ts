import { IAnalyticsSummaryRepository } from '../interfaces/IAnalyticsSummaryRepository';
import { DailyAnalyticsSummary } from '@/types/analyticsSummary';

export class MemoryAnalyticsSummaryRepository implements IAnalyticsSummaryRepository {
  private summaries: Map<string, DailyAnalyticsSummary> = new Map();

  async getByDate(dateKey: string): Promise<DailyAnalyticsSummary | null> {
    return this.summaries.get(dateKey) || null;
  }

  async getByDateRange(startDate: string, endDate: string): Promise<DailyAnalyticsSummary[]> {
    const result: DailyAnalyticsSummary[] = [];
    for (const summary of this.summaries.values()) {
      if (summary.dateKey >= startDate && summary.dateKey <= endDate) {
        result.push(summary);
      }
    }
    // Sort by dateKey ascending
    return result.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  }

  async upsert(summary: DailyAnalyticsSummary): Promise<void> {
    const now = new Date().toISOString();
    const existing = this.summaries.get(summary.dateKey);
    this.summaries.set(summary.dateKey, {
      ...summary,
      id: summary.dateKey, // Enforce ID = dateKey
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
    });
  }

  async delete(dateKey: string): Promise<void> {
    this.summaries.delete(dateKey);
  }
}

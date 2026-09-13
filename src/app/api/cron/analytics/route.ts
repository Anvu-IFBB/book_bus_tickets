import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAggregationService } from '@/services/analyticsAggregationService';
import { formatInTimeZone } from 'date-fns-tz';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 });
    }

    const service = new AnalyticsAggregationService();
    
    // Default: aggregate for yesterday and today to ensure no late-night bookings/payments are missed
    const TIMEZONE = 'Asia/Ho_Chi_Minh';
    const now = new Date();
    const today = formatInTimeZone(now, TIMEZONE, 'yyyy-MM-dd');
    
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = formatInTimeZone(yesterdayDate, TIMEZONE, 'yyyy-MM-dd');

    // Optionally allow passing a specific date via query params for manual backfill
    const searchParams = request.nextUrl.searchParams;
    const targetDate = searchParams.get('date');

    if (targetDate) {
      await service.aggregateDay(targetDate);
    } else {
      await service.aggregateDateRange(yesterday, today);
    }

    return NextResponse.json({ success: true, message: 'Analytics aggregated successfully' });
  } catch (error: unknown) {
    console.error('Analytics Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

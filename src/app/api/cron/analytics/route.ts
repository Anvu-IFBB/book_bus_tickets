import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAggregationService } from '@/services/analyticsAggregationService';
import { formatInTimeZone } from 'date-fns-tz';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { Firestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function cleanupIdempotencyLocks(db: Firestore | null): Promise<number> {
  let cleanupCount = 0;
  try {
    if (!db) return 0;
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 7);
    const thresholdIso = thresholdDate.toISOString();

    const locksRef = db.collection('idempotencyLocks');
    const staleQuery = locksRef.where('createdAt', '<', thresholdIso).limit(500);
    const snapshot = await staleQuery.get();

    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      cleanupCount = snapshot.size;
    }
  } catch (cleanupError) {
    console.error('Idempotency Cleanup Error:', cleanupError);
    // We log but do not fail the overall cron if cleanup fails,
    // preserving existing analytics semantics.
  }
  return cleanupCount;
}

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

    // --- Phase 7.5.9I: Free-Tier Idempotency Cleanup ---
    const db = getAdminFirestore();
    const cleanupCount = await cleanupIdempotencyLocks(db);

    return NextResponse.json({ success: true, message: 'Analytics aggregated successfully', cleanupCount });
  } catch (error: unknown) {
    console.error('Analytics Cron Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

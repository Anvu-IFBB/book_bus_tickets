import { NextRequest } from 'next/server';
import { GET, cleanupIdempotencyLocks } from '@/app/api/cron/analytics/route';
import { Firestore } from 'firebase-admin/firestore';

// --- Mocks ---
let deletedDocs: string[] = [];
let queryThrowError = false;
let batchCommitThrowError = false;
let mockSnapshotDocs: unknown[] = [];
let mockDb: Firestore | null = null;

const createMockDb = () => ({
  collection: (col: string) => {
    if (col !== 'idempotencyLocks') throw new Error('Wrong collection');
    return {
      where: (field: string, op: string, val: string) => ({
        limit: (limit: number) => ({
          get: async () => {
            if (queryThrowError) throw new Error('Simulated Query Error');
            const filtered = mockSnapshotDocs.filter(d => {
              const doc = d as { data: () => { createdAt: string } };
              const docDate = doc.data().createdAt;
              return docDate < val;
            });
            return {
              empty: filtered.length === 0,
              size: filtered.length,
              docs: filtered
            };
          }
        })
      })
    };
  },
  batch: () => {
    const operations: string[] = [];
    return {
      delete: (ref: { id: string }) => {
        operations.push(ref.id);
      },
      commit: async () => {
        if (batchCommitThrowError) throw new Error('Simulated Batch Commit Error');
        deletedDocs.push(...operations);
      }
    };
  }
});

// --- Test Helpers ---
async function runTests() {
  console.log('--- STARTING PHASE 7.5.9I CLEANUP TESTS ---\n');
  let allPassed = true;

  process.env.CRON_SECRET = 'test-secret';

  const check = (name: string, condition: boolean) => {
    if (condition) {
      console.log(`[PASS] ${name}`);
    } else {
      console.log(`[FAIL] ${name}`);
      allPassed = false;
    }
  };

  const setupMock = (docs: unknown[]) => {
    mockDb = createMockDb() as unknown as Firestore;
    mockSnapshotDocs = docs;
    deletedDocs = [];
    queryThrowError = false;
    batchCommitThrowError = false;
  };

  const createDoc = (id: string, ageDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() - ageDays);
    return {
      ref: { id },
      data: () => ({ createdAt: d.toISOString() })
    };
  };

  // 1. No stale locks
  setupMock([]);
  let count = await cleanupIdempotencyLocks(mockDb);
  check('1. No stale locks -> zero deletions', deletedDocs.length === 0 && count === 0);

  // 2. One stale lock
  setupMock([createDoc('stale1', 8)]);
  count = await cleanupIdempotencyLocks(mockDb);
  check('2. One stale lock -> exactly one deletion', deletedDocs.length === 1 && deletedDocs.includes('stale1') && count === 1);

  // 3. Multiple stale locks
  setupMock([createDoc('stale1', 8), createDoc('stale2', 9)]);
  count = await cleanupIdempotencyLocks(mockDb);
  check('3. Multiple stale locks -> all returned locks are deleted', deletedDocs.length === 2 && deletedDocs.includes('stale1') && deletedDocs.includes('stale2') && count === 2);

  // 4. Recent lock
  setupMock([createDoc('recent1', 2)]);
  count = await cleanupIdempotencyLocks(mockDb);
  check('4. Recent lock -> never deleted', deletedDocs.length === 0 && count === 0);

  // 5. Exactly 7-day boundary
  setupMock([
    createDoc('stale_boundary', 7.01),
    createDoc('recent_boundary', 6.99)
  ]);
  count = await cleanupIdempotencyLocks(mockDb);
  check('5. Exactly 7-day boundary -> strict less than logic verified', deletedDocs.length === 1 && deletedDocs[0] === 'stale_boundary');

  // 6. Mixed stale/recent locks
  setupMock([createDoc('stale1', 10), createDoc('recent1', 1)]);
  count = await cleanupIdempotencyLocks(mockDb);
  check('6. Mixed stale/recent locks -> only stale locks deleted', deletedDocs.length === 1 && deletedDocs[0] === 'stale1' && count === 1);

  // 7. Firestore query failure
  setupMock([createDoc('stale1', 10)]);
  queryThrowError = true;
  count = await cleanupIdempotencyLocks(mockDb);
  check('7. Firestore query failure -> error handled safely', count === 0 && deletedDocs.length === 0);

  // 8. Batch commit failure
  setupMock([createDoc('stale1', 10)]);
  batchCommitThrowError = true;
  count = await cleanupIdempotencyLocks(mockDb);
  check('8. Batch commit failure -> error handled safely', count === 0 && deletedDocs.length === 0);

  // 9. Missing CRON_SECRET
  const reqNoAuth = new NextRequest('http://localhost:3000/api/cron/analytics');
  const resNoAuth = await GET(reqNoAuth);
  const dataNoAuth = await resNoAuth.json();
  check('9. Missing CRON_SECRET -> endpoint remains unauthorized', dataNoAuth.error === 'Unauthorized cron request' && resNoAuth.status === 401);

  // 10. Valid CRON_SECRET
  // Note: we can't fully run GET because without FIREBASE_PROJECT_ID it might crash, but actually getAdminFirestore returns null and the route succeeds
  const reqAuth = new NextRequest('http://localhost:3000/api/cron/analytics', { headers: { authorization: 'Bearer test-secret' } });
  // Mock AnalyticsAggregationService globally using simple prototype overwrite to prevent it from failing without db
  const { AnalyticsAggregationService } = await import('@/services/analyticsAggregationService');
  (AnalyticsAggregationService.prototype as unknown as { aggregateDateRange: () => Promise<void> }).aggregateDateRange = async () => {};
  const resAuth = await GET(reqAuth);
  const dataAuth = await resAuth.json();
  check('10. Valid CRON_SECRET -> route can execute', dataAuth.success === true);

  if (allPassed) {
    console.log('\n✅ ALL CLEANUP TESTS PASSED');
    process.exit(0);
  } else {
    console.log('\n❌ SOME CLEANUP TESTS FAILED');
    process.exit(1);
  }
}

runTests().catch(e => {
  console.error(e);
  process.exit(1);
});

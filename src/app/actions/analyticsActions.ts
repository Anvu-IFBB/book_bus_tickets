'use server';

import { z } from 'zod';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { handleActionError } from '@/lib/server/action-error';
import { analyticsService } from '@/services/analyticsService';
import { AnalyticsSummary, GetAnalyticsSchema } from '@/types/analytics';

export async function getAnalyticsSummaryAction(
  payload: z.infer<typeof GetAnalyticsSchema>
): Promise<{ success: boolean; data?: AnalyticsSummary; error?: string }> {
  try {
    await requirePermission(Permissions.canViewAnalytics);

    const parsed = GetAnalyticsSchema.safeParse(payload);
    if (!parsed.success) {
      return { success: false, error: 'Invalid input parameters' };
    }

    const summary = await analyticsService.getSummaryByFilter(parsed.data.filter, parsed.data.customRange);
    return { success: true, data: summary };
  } catch (err: unknown) {
    return handleActionError(err, 'getAnalyticsSummaryAction');
  }
}

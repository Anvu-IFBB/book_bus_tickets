'use server';

import { feedbackService } from '@/services/feedbackService';
import { CreateFeedbackDTO, Feedback, NegativeFeedbackStatus } from '@/types/feedback';
import { z } from 'zod';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { handleActionError } from '@/lib/server/action-error';

const createFeedbackSchema = z.object({
  bookingCode: z.string().min(5),
  customerPhone: z.string().min(9),
  customerName: z.string().optional(),
  rating: z.number().min(1).max(5),
  content: z.string().max(1000),
  serviceAspects: z.object({
    driverAttitude: z.number().min(1).max(5).optional(),
    vehicleCleanliness: z.number().min(1).max(5).optional(),
    punctuality: z.number().min(1).max(5).optional()
  }).optional()
});

/**
 * Public action to submit feedback. Does not require auth.
 */
export async function submitFeedbackAction(data: CreateFeedbackDTO): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = createFeedbackSchema.parse(data);
    await feedbackService.submitFeedback(validated as CreateFeedbackDTO);
    return { success: true };
  } catch (error: unknown) {
    return handleActionError(error, 'submitFeedbackAction');
  }
}

/**
 * Admin action to update feedback status
 */
export async function processNegativeFeedbackAction(feedbackId: string, status: NegativeFeedbackStatus, adminNote: string): Promise<{ success: boolean; feedback?: Feedback; error?: string }> {
  try {
    const session = await requirePermission(Permissions.canManageFeedback);
    
    const updated = await feedbackService.processNegativeFeedback(
      feedbackId,
      status,
      adminNote,
      session.email
    );
    
    return { success: true, feedback: updated };
  } catch (error: unknown) {
    return handleActionError(error, 'processNegativeFeedbackAction');
  }
}

/**
 * Admin action to list feedbacks
 */
export async function getAdminFeedbacksAction(filter?: { rating?: number; status?: NegativeFeedbackStatus }): Promise<{ success: boolean; feedbacks?: Feedback[]; error?: string }> {
  try {
    await requirePermission(Permissions.canManageFeedback);
    const feedbacks = await feedbackService.getAdminFeedbacks(filter);
    return { success: true, feedbacks };
  } catch (error: unknown) {
    return handleActionError(error, 'getAdminFeedbacksAction');
  }
}

/**
 * Admin action to get a specific feedback
 */
export async function getFeedbackByIdAction(id: string): Promise<{ success: boolean; feedback?: Feedback; error?: string }> {
  try {
    await requirePermission(Permissions.canManageFeedback);
    
    // Using a dynamic import for repositories to avoid client-side bundling issues if any
    const { getFeedbackRepository } = await import('@/repositories');
    const repo = getFeedbackRepository();
    const feedback = await repo.findById(id);
    
    if (!feedback) {
      return { success: false, error: 'Không tìm thấy đánh giá' };
    }
    
    return { success: true, feedback };
  } catch (error: unknown) {
    return handleActionError(error, 'getFeedbackByIdAction');
  }
}

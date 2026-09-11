import { Feedback, FeedbackRating, NegativeFeedbackStatus } from '@/types/feedback';

export interface FeedbackFilter {
  rating?: FeedbackRating;
  status?: NegativeFeedbackStatus;
  isPublishedTestimonial?: boolean;
}

export interface IFeedbackRepository {
  create(feedback: Feedback): Promise<Feedback>;
  findById(id: string): Promise<Feedback | null>;
  findByBookingCode(code: string): Promise<Feedback | null>;
  list(filter?: FeedbackFilter): Promise<Feedback[]>;
  update(id: string, updates: Partial<Feedback>): Promise<Feedback>;
}

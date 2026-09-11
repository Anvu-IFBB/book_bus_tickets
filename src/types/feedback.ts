export type FeedbackRating = 1 | 2 | 3 | 4 | 5;

export type FeedbackCategory = 'POSITIVE' | 'NEUTRAL' | 'NEEDS_REVIEW';

export type NegativeFeedbackStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'CONTACTED'
  | 'RESOLVED'
  | 'IGNORED';

export interface Feedback {
  id: string;
  bookingId: string;
  bookingCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  rating: FeedbackRating;
  content: string;
  serviceAspects?: {
    driverAttitude?: number; // 1-5
    vehicleCleanliness?: number; // 1-5
    punctuality?: number; // 1-5
  };
  category: FeedbackCategory; // Computed from rating
  status: NegativeFeedbackStatus; // Workflow for negative/neutral feedback
  isPublishedTestimonial: boolean; // Only true for 4-5 stars approved by admin
  adminNote?: string;
  resolvedBy?: string;
  submittedAt: string; // ISO string
  processedAt?: string; // ISO string
}

export interface CreateFeedbackDTO {
  bookingCode: string;
  customerPhone: string;
  customerName?: string;
  rating: FeedbackRating;
  content: string;
  serviceAspects?: {
    driverAttitude?: number;
    vehicleCleanliness?: number;
    punctuality?: number;
  };
}

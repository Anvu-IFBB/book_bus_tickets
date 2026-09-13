import { IFeedbackRepository, FeedbackFilter } from '../interfaces/IFeedbackRepository';
import { Feedback } from '@/types/feedback';

export class MemoryFeedbackRepository implements IFeedbackRepository {
  private feedbacks: Map<string, Feedback> = new Map();

  async create(feedback: Feedback): Promise<Feedback> {
    const newFeedback = {
      ...feedback,
      id: feedback.id || `fb-${Date.now()}`
    };
    this.feedbacks.set(newFeedback.id, newFeedback);
    return newFeedback;
  }

  async findById(id: string): Promise<Feedback | null> {
    return this.feedbacks.get(id) || null;
  }

  async findByBookingCode(code: string): Promise<Feedback | null> {
    for (const fb of this.feedbacks.values()) {
      if (fb.bookingCode === code) {
        return fb;
      }
    }
    return null;
  }

  async list(filter?: FeedbackFilter): Promise<Feedback[]> {
    let result = Array.from(this.feedbacks.values());

    if (filter) {
      if (filter.rating) {
        result = result.filter(f => f.rating === filter.rating);
      }
      if (filter.status) {
        result = result.filter(f => f.status === filter.status);
      }
      if (filter.isPublishedTestimonial !== undefined) {
        result = result.filter(f => f.isPublishedTestimonial === filter.isPublishedTestimonial);
      }
    }

    return result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    const fb = await this.findById(id);
    if (!fb) {
      throw new Error(`Feedback ${id} not found`);
    }
    const updated = { ...fb, ...updates };
    this.feedbacks.set(id, updated);
    return updated;
  }
}

import {
  Feedback,
  FeedbackCategory,
  CreateFeedbackDTO,
  NegativeFeedbackStatus,
} from '@/types/feedback';
import { getFeedbackRepository, getBookingRepository, getSettingsRepository, getCustomerRepository } from '@/repositories';
import { normalizePhone } from '@/lib/utils/formatters';
import { FeedbackFilter } from '@/repositories/interfaces/IFeedbackRepository';

export class FeedbackService {
  private get feedbackRepo() { return getFeedbackRepository(); }
  private get bookingRepo() { return getBookingRepository(); }
  private get settingsRepo() { return getSettingsRepository(); }

  /**
   * Khách hàng gửi đánh giá sau khi hoàn thành chuyến đi
   */
  async submitFeedback(dto: CreateFeedbackDTO): Promise<Feedback> {
    const cleanPhone = normalizePhone(dto.customerPhone);
    const booking = await this.bookingRepo.findByCode(dto.bookingCode);

    if (!booking) {
      throw new Error(`Không tìm thấy mã chuyến đi: ${dto.bookingCode}`);
    }

    if (booking.bookingStatus !== 'COMPLETED') {
      throw new Error('Chuyến đi chưa hoàn thành, chưa thể gửi đánh giá');
    }

    let hasAccess = false;
    if (booking.cargoDetails) {
      const sender = normalizePhone(booking.cargoDetails.senderPhone);
      const receiver = normalizePhone(booking.cargoDetails.receiverPhone);
      if (sender === cleanPhone || receiver === cleanPhone) {
        hasAccess = true;
      }
    }

    if (!hasAccess && booking.customerId) {
      const customerRepo = getCustomerRepository();
      const customer = await customerRepo.findById(booking.customerId);
      if (customer && normalizePhone(customer.phone) === cleanPhone) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      throw new Error('Xác thực số điện thoại không hợp lệ cho chuyến đi này');
    }

    // Kiểm tra xem booking đã có feedback chưa (Idempotency)
    const existing = await this.feedbackRepo.findByBookingCode(dto.bookingCode);
    if (existing) {
      throw new Error(`Chuyến đi ${dto.bookingCode} đã được gửi đánh giá trước đó`);
    }

    // Phân loại đánh giá theo quy chuẩn nghiệp vụ
    let category: FeedbackCategory;
    let status: NegativeFeedbackStatus;
    let isPublishedTestimonial = false;

    if (dto.rating >= 4) {
      category = 'POSITIVE';
      status = 'RESOLVED';
      isPublishedTestimonial = true; // 4-5 sao được hiển thị vào mục testimonial
    } else if (dto.rating === 3) {
      category = 'NEUTRAL';
      status = 'NEW';
      isPublishedTestimonial = false;
    } else {
      // 1 - 2 sao: Phản hồi tiêu cực cần xử lý
      category = 'NEEDS_REVIEW';
      status = 'NEW';
      isPublishedTestimonial = false;
    }

    const nowIso = new Date().toISOString();
    const feedback: Feedback = {
      id: `fb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerId: booking.customerId,
      customerName: dto.customerName?.trim() || 'Hành khách',
      customerPhone: cleanPhone,
      rating: dto.rating,
      content: dto.content.trim(),
      serviceAspects: dto.serviceAspects,
      category,
      status,
      isPublishedTestimonial,
      submittedAt: nowIso,
    };

    const saved = await this.feedbackRepo.create(feedback);

    // Ghi audit log nếu là feedback tiêu cực cần chú ý
    if (category === 'NEEDS_REVIEW') {
      await this.settingsRepo.createAuditLog({
        id: `log-${Date.now()}`,
        userId: booking.customerId,
        userEmail: cleanPhone,
        action: 'NEGATIVE_FEEDBACK_SUBMITTED',
        entityType: 'FEEDBACK',
        entityId: saved.id,
        metadata: { rating: dto.rating, bookingCode: dto.bookingCode },
        createdAt: nowIso,
      });
    }

    return saved;
  }

  /**
   * Lấy danh sách đánh giá 5 sao nổi bật để hiển thị công khai trên website
   */
  async getPublicTestimonials(): Promise<Feedback[]> {
    return this.feedbackRepo.list({
      isPublishedTestimonial: true,
      rating: 5,
    });
  }

  /**
   * Quản trị viên xử lý phản hồi tiêu cực (NEW -> IN_REVIEW -> CONTACTED -> RESOLVED)
   */
  async processNegativeFeedback(
    feedbackId: string,
    status: NegativeFeedbackStatus,
    adminNote: string,
    resolvedBy: string
  ): Promise<Feedback> {
    const feedback = await this.feedbackRepo.findById(feedbackId);
    if (!feedback) {
      throw new Error(`Không tìm thấy đánh giá ID: ${feedbackId}`);
    }

    const updated = await this.feedbackRepo.update(feedbackId, {
      status,
      adminNote,
      resolvedBy,
      processedAt: new Date().toISOString(),
    });

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: resolvedBy,
      userEmail: resolvedBy,
      action: 'FEEDBACK_PROCESSED',
      entityType: 'FEEDBACK',
      entityId: feedbackId,
      fromState: feedback.status,
      toState: status,
      metadata: { adminNote },
      createdAt: new Date().toISOString(),
    });

    return updated;
  }

  /**
   * Lấy danh sách đánh giá cho Admin
   */
  async getAdminFeedbacks(filter?: { rating?: number; status?: NegativeFeedbackStatus }): Promise<Feedback[]> {
    return this.feedbackRepo.list(filter as FeedbackFilter);
  }
}

export const feedbackService = new FeedbackService();

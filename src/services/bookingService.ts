import {
  Booking,
  BookingStatus,
  CreateBookingDTO,
  BookingStatusHistoryItem,
} from '@/types/booking';
import { Customer } from '@/types/customer';
import { getBookingRepository, getCustomerRepository, getSettingsRepository } from '@/repositories';
import { generateBookingCode, generateCargoCode } from '@/lib/utils/codeGenerator';
import { normalizePhone } from '@/lib/utils/formatters';
import { paymentService } from './paymentService';

// Quy tắc chuyển đổi trạng thái hợp lệ
const VALID_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  NEW: ['CONTACTING', 'CONFIRMED', 'CANCELLED'],
  CONTACTING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['ASSIGNED', 'DEPOSIT_PAID', 'PAID', 'IN_PROGRESS', 'CANCELLED'],
  ASSIGNED: ['CONFIRMED', 'IN_PROGRESS', 'CANCELLED'],
  DEPOSIT_PAID: ['ASSIGNED', 'PAID', 'IN_PROGRESS', 'CANCELLED'],
  PAID: ['ASSIGNED', 'IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [], // Trạng thái kết thúc
  CANCELLED: [], // Trạng thái kết thúc
};

export class BookingService {
  private bookingRepo = getBookingRepository();
  private customerRepo = getCustomerRepository();
  private settingsRepo = getSettingsRepository();

  /**
   * Tạo booking mới (Vé Limousine, Hợp đồng xe, Gửi hàng hóa, Tour du lịch)
   */
  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    const cleanPhone = normalizePhone(dto.customerPhone);
    const nowIso = new Date().toISOString();
    const todayYmd = nowIso.slice(0, 10).replace(/-/g, '');

    // 1. Tìm hoặc tạo hồ sơ khách hàng
    let customer = await this.customerRepo.findByPhone(cleanPhone);
    if (!customer) {
      const newCustomer: Customer = {
        id: `cust-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        name: dto.customerName.trim(),
        phone: cleanPhone,
        email: dto.customerEmail?.trim(),
        address: dto.pickupAddress,
        totalBookings: 1,
        completedBookings: 0,
        cancelledBookings: 0,
        totalSpent: 0,
        favoritePickupAddress: dto.pickupAddress,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      customer = await this.customerRepo.create(newCustomer);
    } else {
      // Cập nhật thống kê khách hàng
      await this.customerRepo.incrementStats(customer.id, 1, 0, 0, 0);
    }

    // 2. Sinh mã Booking an toàn
    const seq = await this.bookingRepo.getNextSequenceForDate(todayYmd);
    const bookingCode =
      dto.serviceType === 'CARGO'
        ? generateCargoCode(new Date(), seq)
        : generateBookingCode(new Date(), seq);

    // 3. Khởi tạo lịch sử trạng thái
    const initialHistory: BookingStatusHistoryItem = {
      status: 'NEW',
      changedAt: nowIso,
      changedBy: 'CUSTOMER',
      note: 'Khách gửi yêu cầu từ website',
    };

    // 4. Tạo thực thể Booking
    const booking: Booking = {
      id: `book-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      bookingCode,
      customerId: customer.id,
      serviceType: dto.serviceType,
      departure: dto.departure,
      destination: dto.destination,
      travelDate: dto.travelDate,
      travelTime: dto.travelTime,
      returnDate: dto.returnDate,
      isRoundTrip: dto.isRoundTrip || false,
      passengerCount: dto.passengerCount || 1,
      pickupAddress: dto.pickupAddress,
      dropoffAddress: dto.dropoffAddress,
      vehicleType: dto.vehicleType,
      price: 0, // Admin sẽ xác nhận hoặc hệ thống tính theo bảng giá
      deposit: 0,
      paymentStatus: 'UNPAID',
      bookingStatus: 'NEW',
      note: dto.note,
      cargoDetails: dto.cargoDetails,
      contractDetails: dto.contractDetails,
      tourDetails: dto.tourDetails,
      statusHistory: [initialHistory],
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.bookingRepo.create(booking);

    // Ghi audit log
    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: customer.id,
      userEmail: customer.email || customer.phone,
      action: 'BOOKING_CREATED',
      entityType: 'BOOKING',
      entityId: saved.id,
      toState: 'NEW',
      metadata: { bookingCode: saved.bookingCode, serviceType: saved.serviceType },
      createdAt: nowIso,
    });

    // Khởi tạo dòng Payment PENDING
    await paymentService.createPaymentRequest(saved, customer.email || customer.phone);

    return saved;
  }

  /**
   * Tra cứu booking theo Mã Booking và Số điện thoại (Bảo mật cho khách hàng)
   */
  async lookupBooking(code: string, phone: string): Promise<Booking | null> {
    const cleanPhone = normalizePhone(phone);
    const booking = await this.bookingRepo.findByCode(code);
    if (!booking) return null;

    // Kiểm tra số điện thoại khách hàng hoặc người gửi/nhận hàng
    if (booking.cargoDetails) {
      const sender = normalizePhone(booking.cargoDetails.senderPhone);
      const receiver = normalizePhone(booking.cargoDetails.receiverPhone);
      if (sender === cleanPhone || receiver === cleanPhone) {
        return booking;
      }
    }

    const customer = await this.customerRepo.findById(booking.customerId);
    if (customer && normalizePhone(customer.phone) === cleanPhone) {
      return booking;
    }

    return null;
  }

  /**
   * Cập nhật trạng thái Booking với kiểm tra State Transition hợp lệ
   */
  async updateStatus(
    bookingId: string,
    newStatus: BookingStatus,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new Error(`Không tìm thấy đơn booking ID: ${bookingId}`);
    }

    const currentStatus = booking.bookingStatus;
    if (currentStatus === newStatus) {
      return booking;
    }

    // Kiểm tra tính hợp lệ của bước chuyển đổi
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed || !allowed.includes(newStatus)) {
      throw new Error(
        `Không thể chuyển trạng thái từ "${currentStatus}" sang "${newStatus}". Các trạng thái hợp lệ: ${allowed.join(', ') || 'Không còn bước chuyển'}`
      );
    }

    const nowIso = new Date().toISOString();
    const historyItem: BookingStatusHistoryItem = {
      status: newStatus,
      changedAt: nowIso,
      changedBy,
      note: note || `Chuyển trạng thái sang ${newStatus}`,
    };

    const updates: Partial<Booking> = {
      bookingStatus: newStatus,
      statusHistory: [...booking.statusHistory, historyItem],
      updatedAt: nowIso,
    };

    // Khi hoàn thành chuyến đi -> Tính toán thời điểm xin feedback
    if (newStatus === 'COMPLETED') {
      const settings = await this.settingsRepo.getSettings();
      const delayMs = (settings.feedbackDelayHours || 2) * 60 * 60 * 1000;
      const feedbackAvailableAt = new Date(Date.now() + delayMs).toISOString();

      updates.completedAt = nowIso;
      updates.feedbackAvailableAt = feedbackAvailableAt;

      // Cập nhật số chuyến hoàn thành của khách hàng và chi tiêu
      await this.customerRepo.incrementStats(
        booking.customerId,
        0,
        1,
        0,
        booking.price || 0
      );
    } else if (newStatus === 'CANCELLED') {
      await this.customerRepo.incrementStats(booking.customerId, 0, 0, 1, 0);
    }

    const updated = await this.bookingRepo.update(bookingId, updates);

    // Ghi audit log
    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      actorRole: actorRole || 'OPERATOR',
      action: 'BOOKING_STATUS_CHANGED',
      entityType: 'BOOKING',
      entityId: bookingId,
      fromState: currentStatus,
      toState: newStatus,
      metadata: { note },
      createdAt: nowIso,
    });

    return updated;
  }
}

export const bookingService = new BookingService();

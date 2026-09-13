import { Booking, BookingStatus, BookingFilter } from '@/types/booking';
import { Customer } from '@/types/customer';
import { Vehicle, Driver, Trip } from '@/types/fleet';
import {
  getBookingRepository,
  getFleetRepository,
  getSettingsRepository,
  getCustomerRepository,
} from '@/repositories';
import { bookingService } from './bookingService';
import { fleetService } from './fleetService';

export interface EnrichedBooking extends Booking {
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicleName?: string;
  vehiclePlate?: string;
  vehicleSeats?: number;
  driverName?: string;
  driverPhone?: string;
}

export interface OperationsAlert {
  id: string;
  type: 'MAINTENANCE' | 'OFF_DUTY' | 'CONFLICT' | 'SYSTEM';
  message: string;
  severity: 'WARNING' | 'INFO' | 'DANGER';
}

export interface OperationsSummary {
  today: string;
  totalBookingsToday: number;
  totalRevenue: number;
  bookingsByStatus: {
    NEW: number;
    CONTACTING: number;
    CONFIRMED: number;
    ASSIGNED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
    [key: string]: number;
  };
  fleetStatus: {
    AVAILABLE: number;
    ASSIGNED: number;
    IN_SERVICE: number;
    MAINTENANCE: number;
    INACTIVE: number;
  };
  driverStatus: {
    AVAILABLE: number;
    ASSIGNED: number;
    ON_TRIP: number;
    OFF: number;
    INACTIVE: number;
  };
  totalTripsToday: number;
  upcomingTrips: Trip[];
  bookingsNeedingAttention: EnrichedBooking[];
  activeAlerts: OperationsAlert[];
}

export interface ListBookingsFilter extends BookingFilter {
  route?: string;
  sortBy?: 'date_desc' | 'date_asc' | 'created_desc';
}

export interface ListBookingsResult {
  items: EnrichedBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export class OperationsService {
  private bookingRepo = getBookingRepository();
  private fleetRepo = getFleetRepository();
  private settingsRepo = getSettingsRepository();
  private customerRepo = getCustomerRepository();

  /**
   * Bổ sung thông tin khách hàng, xe, tài xế cho một booking
   */
  private async enrichBooking(
    booking: Booking,
    customerMap?: Map<string, Customer>,
    vehicleMap?: Map<string, Vehicle>,
    driverMap?: Map<string, Driver>
  ): Promise<EnrichedBooking> {
    let customer: Customer | null = null;
    if (customerMap?.has(booking.customerId)) {
      customer = customerMap.get(booking.customerId) || null;
    } else if (booking.customerId) {
      customer = await this.customerRepo.findById(booking.customerId);
      if (customer && customerMap) customerMap.set(booking.customerId, customer);
    }

    let vehicle: Vehicle | null = null;
    if (booking.vehicleId) {
      if (vehicleMap?.has(booking.vehicleId)) {
        vehicle = vehicleMap.get(booking.vehicleId) || null;
      } else {
        vehicle = await this.fleetRepo.getVehicleById(booking.vehicleId);
        if (vehicle && vehicleMap) vehicleMap.set(booking.vehicleId, vehicle);
      }
    }

    let driver: Driver | null = null;
    if (booking.driverId) {
      if (driverMap?.has(booking.driverId)) {
        driver = driverMap.get(booking.driverId) || null;
      } else {
        driver = await this.fleetRepo.getDriverById(booking.driverId);
        if (driver && driverMap) driverMap.set(booking.driverId, driver);
      }
    }

    const customerName =
      booking.cargoDetails?.senderName ||
      customer?.name ||
      'Khách đặt trực tuyến';
    const customerPhone =
      booking.cargoDetails?.senderPhone ||
      customer?.phone ||
      '';
    const customerEmail = customer?.email;

    return {
      ...booking,
      customerName,
      customerPhone,
      customerEmail,
      vehicleName: vehicle?.name,
      vehiclePlate: vehicle?.licensePlate,
      vehicleSeats: vehicle?.seatCount,
      driverName: driver?.name,
      driverPhone: driver?.phone,
    };
  }

  /**
   * Lấy dữ liệu tổng quan cho Operations Dashboard
   */
  async getOperationsSummary(): Promise<OperationsSummary> {
    const todayStr = new Date().toISOString().slice(0, 10);
    const allBookings = await this.bookingRepo.list();
    const allVehicles = await this.fleetRepo.listVehicles();
    const allDrivers = await this.fleetRepo.listDrivers();
    const tripsToday = await this.fleetRepo.listTrips(todayStr);

    const bookingsToday = allBookings.filter(
      (b) => b.travelDate === todayStr || b.createdAt.slice(0, 10) === todayStr
    );

    const bookingsByStatus: OperationsSummary['bookingsByStatus'] = {
      NEW: 0,
      CONTACTING: 0,
      CONFIRMED: 0,
      ASSIGNED: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };

    let totalRevenue = 0;

    allBookings.forEach((b) => {
      const st = b.bookingStatus;
      if (bookingsByStatus[st] !== undefined) {
        bookingsByStatus[st]++;
      } else {
        bookingsByStatus[st] = 1;
      }

      // Doanh thu tính từ các đơn đã xác nhận, đã cọc, thanh toán hoặc hoàn thành
      if (
        b.bookingStatus === 'CONFIRMED' ||
        b.bookingStatus === 'ASSIGNED' ||
        b.bookingStatus === 'DEPOSIT_PAID' ||
        b.bookingStatus === 'PAID' ||
        b.bookingStatus === 'IN_PROGRESS' ||
        b.bookingStatus === 'COMPLETED'
      ) {
        totalRevenue += b.price || 0;
      }
    });

    const fleetStatus: OperationsSummary['fleetStatus'] = {
      AVAILABLE: 0,
      ASSIGNED: 0,
      IN_SERVICE: 0,
      MAINTENANCE: 0,
      INACTIVE: 0,
    };

    const activeAlerts: OperationsAlert[] = [];

    allVehicles.forEach((v) => {
      if (fleetStatus[v.status] !== undefined) {
        fleetStatus[v.status]++;
      }
      if (v.status === 'MAINTENANCE') {
        activeAlerts.push({
          id: `veh-maint-${v.id}`,
          type: 'MAINTENANCE',
          message: `Xe ${v.name} (${v.licensePlate}) đang bảo dưỡng định kỳ`,
          severity: 'WARNING',
        });
      }
    });

    const driverStatus: OperationsSummary['driverStatus'] = {
      AVAILABLE: 0,
      ASSIGNED: 0,
      ON_TRIP: 0,
      OFF: 0,
      INACTIVE: 0,
    };

    allDrivers.forEach((d) => {
      if (d.status === 'AVAILABLE' || d.status === 'ACTIVE') {
        driverStatus.AVAILABLE++;
      } else if (d.status === 'ASSIGNED') {
        driverStatus.ASSIGNED++;
      } else if (d.status === 'ON_TRIP') {
        driverStatus.ON_TRIP++;
      } else if (d.status === 'OFF' || d.status === 'OFF_DUTY') {
        driverStatus.OFF++;
        activeAlerts.push({
          id: `drv-off-${d.id}`,
          type: 'OFF_DUTY',
          message: `Tài xế ${d.name} (${d.phone}) đang trong ca nghỉ`,
          severity: 'INFO',
        });
      } else if (d.status === 'INACTIVE') {
        driverStatus.INACTIVE++;
      }
    });

    // Đơn cần xử lý gấp (NEW, CONTACTING)
    const rawAttention = allBookings
      .filter((b) => b.bookingStatus === 'NEW' || b.bookingStatus === 'CONTACTING')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);

    const bookingsNeedingAttention = await Promise.all(
      rawAttention.map((b) => this.enrichBooking(b))
    );

    // Chuyến xe hôm nay chưa hoàn thành
    const upcomingTrips = tripsToday
      .filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
      .slice(0, 6);

    return {
      today: todayStr,
      totalBookingsToday: bookingsToday.length,
      totalRevenue,
      bookingsByStatus,
      fleetStatus,
      driverStatus,
      totalTripsToday: tripsToday.length,
      upcomingTrips,
      bookingsNeedingAttention,
      activeAlerts,
    };
  }

  /**
   * Danh sách đơn booking có phân trang, tìm kiếm và join chi tiết
   */
  async listBookingsWithDetails(
    filter?: ListBookingsFilter,
    page = 1,
    pageSize = 10
  ): Promise<ListBookingsResult> {
    const rawList = await this.bookingRepo.list({
      status: filter?.status,
      serviceType: filter?.serviceType,
      date: filter?.date,
    });

    const customerMap = new Map<string, Customer>();
    const vehicleMap = new Map<string, Vehicle>();
    const driverMap = new Map<string, Driver>();

    const enrichedList = await Promise.all(
      rawList.map((b) => this.enrichBooking(b, customerMap, vehicleMap, driverMap))
    );

    let filtered = enrichedList;

    // Lọc theo search term đa trường (Code, Tên, SĐT, Lộ trình, Điểm đón trả)
    if (filter?.search?.trim()) {
      const q = filter.search.trim().toLowerCase();
      const qClean = q.replace(/\D/g, '');

      filtered = filtered.filter((b) => {
        const matchCode = b.bookingCode.toLowerCase().includes(q);
        const matchDeparture = b.departure.toLowerCase().includes(q);
        const matchDestination = b.destination.toLowerCase().includes(q);
        const matchPickup = (b.pickupAddress || '').toLowerCase().includes(q);
        const matchDropoff = (b.dropoffAddress || '').toLowerCase().includes(q);
        const matchCustomerName = (b.customerName || '').toLowerCase().includes(q);
        const matchCustomerPhone = qClean ? (b.customerPhone || '').replace(/\D/g, '').includes(qClean) : false;
        const matchSenderName = b.cargoDetails?.senderName?.toLowerCase().includes(q);
        const matchReceiverName = b.cargoDetails?.receiverName?.toLowerCase().includes(q);
        const matchSenderPhone = qClean && b.cargoDetails?.senderPhone ? b.cargoDetails.senderPhone.replace(/\D/g, '').includes(qClean) : false;
        const matchReceiverPhone = qClean && b.cargoDetails?.receiverPhone ? b.cargoDetails.receiverPhone.replace(/\D/g, '').includes(qClean) : false;

        return (
          matchCode ||
          matchDeparture ||
          matchDestination ||
          matchPickup ||
          matchDropoff ||
          matchCustomerName ||
          matchCustomerPhone ||
          matchSenderName ||
          matchReceiverName ||
          matchSenderPhone ||
          matchReceiverPhone
        );
      });
    }

    // Lọc theo tuyến đường (departure hoặc destination)
    if (filter?.route?.trim() && filter.route !== 'ALL') {
      const r = filter.route.trim().toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.departure.toLowerCase().includes(r) ||
          b.destination.toLowerCase().includes(r)
      );
    }

    // Sắp xếp
    const sortBy = filter?.sortBy || 'created_desc';
    if (sortBy === 'date_desc') {
      filtered.sort((a, b) => (b.travelDate + b.travelTime).localeCompare(a.travelDate + a.travelTime));
    } else if (sortBy === 'date_asc') {
      filtered.sort((a, b) => (a.travelDate + a.travelTime).localeCompare(b.travelDate + b.travelTime));
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const total = filtered.length;
    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const totalPages = Math.max(1, Math.ceil(total / safePageSize));
    const startIndex = (safePage - 1) * safePageSize;
    const items = filtered.slice(startIndex, startIndex + safePageSize);

    return {
      items,
      total,
      page: safePage,
      pageSize: safePageSize,
      totalPages,
    };
  }

  /**
   * Danh sách đơn booking đơn giản (giữ nguyên cho tương thích ngược)
   */
  async listBookings(filter?: BookingFilter): Promise<Booking[]> {
    return this.bookingRepo.list(filter);
  }

  /**
   * Lấy chi tiết đơn booking theo ID (giữ nguyên cho tương thích ngược)
   */
  async getBookingDetails(id: string): Promise<Booking | null> {
    return this.bookingRepo.findById(id);
  }

  /**
   * Lấy chi tiết đơn booking có đầy đủ thông tin Khách hàng, Xe, Tài xế
   */
  async getBookingDetailsWithEnrichment(idOrCode: string): Promise<EnrichedBooking | null> {
    let booking = await this.bookingRepo.findById(idOrCode);
    if (!booking) {
      booking = await this.bookingRepo.findByCode(idOrCode);
    }
    if (!booking) return null;
    return this.enrichBooking(booking);
  }

  /**
   * Cập nhật trạng thái booking theo State Machine
   */
  async updateBookingStatus(
    bookingId: string,
    newStatus: BookingStatus,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    return bookingService.updateStatus(bookingId, newStatus, changedBy, note, actorRole);
  }

  /**
   * Phân xe cho Booking (kèm kiểm tra Conflict Engine)
   */
  async assignVehicle(
    bookingId: string,
    vehicleId: string,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error(`Không tìm thấy đơn booking ID: ${bookingId}`);

    // Kiểm tra xung đột phương tiện
    const conflict = await fleetService.detectVehicleConflict(
      vehicleId,
      booking.travelDate,
      booking.travelTime
    );

    if (conflict.hasConflict) {
      throw new Error(conflict.reason || 'Phương tiện bị trùng lịch hoặc không sẵn sàng');
    }

    const nowIso = new Date().toISOString();
    const currentStatus = booking.bookingStatus;
    const shouldUpdateStatusToAssigned =
      currentStatus === 'CONFIRMED' ||
      currentStatus === 'NEW' ||
      currentStatus === 'CONTACTING';
    const nextStatus: BookingStatus = shouldUpdateStatusToAssigned ? 'ASSIGNED' : currentStatus;

    const historyItem = {
      status: nextStatus,
      changedAt: nowIso,
      changedBy,
      note: note || `Phân xe: ${vehicleId}`,
    };

    const updated = await this.bookingRepo.update(bookingId, {
      vehicleId,
      bookingStatus: nextStatus,
      statusHistory: [...booking.statusHistory, historyItem],
      updatedAt: nowIso,
    });

    // Cập nhật trạng thái xe sang ASSIGNED
    await fleetService.updateVehicleStatus(vehicleId, 'ASSIGNED', changedBy, `Phân cho booking ${booking.bookingCode}`);

    // Ghi AuditLog
    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      actorRole: actorRole || 'OPERATOR',
      action: 'VEHICLE_ASSIGNED',
      entityType: 'BOOKING',
      entityId: bookingId,
      fromState: currentStatus,
      toState: nextStatus,
      metadata: { vehicleId, bookingCode: booking.bookingCode, note },
      createdAt: nowIso,
    });

    return updated;
  }

  /**
   * Phân tài xế cho Booking (kèm kiểm tra Conflict Engine)
   */
  async assignDriver(
    bookingId: string,
    driverId: string,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error(`Không tìm thấy đơn booking ID: ${bookingId}`);

    // Kiểm tra xung đột tài xế
    const conflict = await fleetService.detectDriverConflict(
      driverId,
      booking.travelDate,
      booking.travelTime
    );

    if (conflict.hasConflict) {
      throw new Error(conflict.reason || 'Tài xế bị trùng lịch hoặc đang nghỉ phép');
    }

    const nowIso = new Date().toISOString();
    const currentStatus = booking.bookingStatus;
    const shouldUpdateStatusToAssigned =
      currentStatus === 'CONFIRMED' ||
      currentStatus === 'NEW' ||
      currentStatus === 'CONTACTING';
    const nextStatus: BookingStatus = shouldUpdateStatusToAssigned ? 'ASSIGNED' : currentStatus;

    const historyItem = {
      status: nextStatus,
      changedAt: nowIso,
      changedBy,
      note: note || `Phân tài xế: ${driverId}`,
    };

    const updated = await this.bookingRepo.update(bookingId, {
      driverId,
      bookingStatus: nextStatus,
      statusHistory: [...booking.statusHistory, historyItem],
      updatedAt: nowIso,
    });

    // Cập nhật trạng thái tài xế sang ASSIGNED
    await fleetService.updateDriverStatus(driverId, 'ASSIGNED', changedBy, `Phân cho booking ${booking.bookingCode}`);

    // Ghi AuditLog
    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      actorRole: actorRole || 'OPERATOR',
      action: 'DRIVER_ASSIGNED',
      entityType: 'BOOKING',
      entityId: bookingId,
      fromState: currentStatus,
      toState: nextStatus,
      metadata: { driverId, bookingCode: booking.bookingCode, note },
      createdAt: nowIso,
    });

    return updated;
  }

  /**
   * Hủy phân xe khỏi Booking
   */
  async unassignVehicle(
    bookingId: string,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error(`Không tìm thấy đơn booking ID: ${bookingId}`);

    const prevVehicleId = booking.vehicleId;
    const nowIso = new Date().toISOString();

    const historyItem = {
      status: booking.bookingStatus,
      changedAt: nowIso,
      changedBy,
      note: note || `Hủy phân xe ${prevVehicleId}`,
    };

    const updated = await this.bookingRepo.update(bookingId, {
      vehicleId: undefined,
      statusHistory: [...booking.statusHistory, historyItem],
      updatedAt: nowIso,
    });

    if (prevVehicleId) {
      await fleetService.updateVehicleStatus(prevVehicleId, 'AVAILABLE', changedBy, `Hủy phân khỏi đơn ${booking.bookingCode}`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      actorRole: actorRole || 'OPERATOR',
      action: 'VEHICLE_UNASSIGNED',
      entityType: 'BOOKING',
      entityId: bookingId,
      metadata: { prevVehicleId, bookingCode: booking.bookingCode },
      createdAt: nowIso,
    });

    return updated;
  }

  /**
   * Hủy phân tài xế khỏi Booking
   */
  async unassignDriver(
    bookingId: string,
    changedBy: string,
    note?: string,
    actorRole?: string
  ): Promise<Booking> {
    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) throw new Error(`Không tìm thấy đơn booking ID: ${bookingId}`);

    const prevDriverId = booking.driverId;
    const nowIso = new Date().toISOString();

    const historyItem = {
      status: booking.bookingStatus,
      changedAt: nowIso,
      changedBy,
      note: note || `Hủy phân tài xế ${prevDriverId}`,
    };

    const updated = await this.bookingRepo.update(bookingId, {
      driverId: undefined,
      statusHistory: [...booking.statusHistory, historyItem],
      updatedAt: nowIso,
    });

    if (prevDriverId) {
      await fleetService.updateDriverStatus(prevDriverId, 'AVAILABLE', changedBy, `Hủy phân khỏi đơn ${booking.bookingCode}`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      actorRole: actorRole || 'OPERATOR',
      action: 'DRIVER_UNASSIGNED',
      entityType: 'BOOKING',
      entityId: bookingId,
      metadata: { prevDriverId, bookingCode: booking.bookingCode },
      createdAt: nowIso,
    });

    return updated;
  }
}

export const operationsService = new OperationsService();

import { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { getFleetRepository, getSettingsRepository } from '@/repositories';
import {
  vehicleSchema,
  updateVehicleSchema,
  driverSchema,
  updateDriverSchema,
  tripSchema,
  updateTripSchema,
} from '@/lib/validation/fleetSchema';

export interface ConflictResult {
  hasConflict: boolean;
  reason?: string;
  conflictingTrip?: Trip;
}

export class FleetService {
  private fleetRepo = getFleetRepository();
  private settingsRepo = getSettingsRepository();

  // Helper chuyển đổi giờ "HH:mm" thành phút từ 00:00
  private parseMinutes(timeStr: string): number {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  // ==========================================
  // 1. VEHICLE MANAGEMENT
  // ==========================================

  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    return this.fleetRepo.listVehicles(status);
  }

  async getVehicle(id: string): Promise<Vehicle | null> {
    return this.fleetRepo.getVehicleById(id);
  }

  async createVehicle(data: unknown, changedBy: string = 'SYSTEM'): Promise<Vehicle> {
    const validated = vehicleSchema.parse(data);
    const nowIso = new Date().toISOString();
    const vehicle: Vehicle = {
      id: `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: validated.name,
      licensePlate: validated.licensePlate,
      seatCount: validated.seatCount,
      vehicleType: validated.vehicleType,
      status: validated.status,
      note: validated.note,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.fleetRepo.createVehicle(vehicle);

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'VEHICLE_CREATED',
      entityType: 'VEHICLE',
      entityId: saved.id,
      toState: saved.status,
      metadata: { licensePlate: saved.licensePlate, name: saved.name },
      createdAt: nowIso,
    });

    return saved;
  }

  async updateVehicle(id: string, updates: unknown, changedBy: string = 'SYSTEM'): Promise<Vehicle> {
    const validated = updateVehicleSchema.parse(updates);
    const existing = await this.fleetRepo.getVehicleById(id);
    if (!existing) throw new Error(`Phương tiện với ID ${id} không tồn tại`);

    const updated = await this.fleetRepo.updateVehicle(id, validated);
    const nowIso = new Date().toISOString();

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'VEHICLE_UPDATED',
      entityType: 'VEHICLE',
      entityId: id,
      fromState: existing.status,
      toState: updated.status,
      metadata: { updates: validated },
      createdAt: nowIso,
    });

    return updated;
  }

  async updateVehicleStatus(id: string, newStatus: VehicleStatus, changedBy: string = 'SYSTEM', note?: string): Promise<Vehicle> {
    const existing = await this.fleetRepo.getVehicleById(id);
    if (!existing) throw new Error(`Phương tiện với ID ${id} không tồn tại`);

    const updated = await this.fleetRepo.updateVehicle(id, { status: newStatus });
    const nowIso = new Date().toISOString();

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'VEHICLE_STATUS_CHANGED',
      entityType: 'VEHICLE',
      entityId: id,
      fromState: existing.status,
      toState: newStatus,
      metadata: { note },
      createdAt: nowIso,
    });

    return updated;
  }

  async deleteVehicle(id: string, changedBy: string = 'SYSTEM'): Promise<boolean> {
    const existing = await this.fleetRepo.getVehicleById(id);
    if (!existing) return false;

    const result = await this.fleetRepo.deleteVehicle(id);
    if (result) {
      await this.settingsRepo.createAuditLog({
        id: `log-${Date.now()}`,
        userId: changedBy,
        userEmail: changedBy,
        action: 'VEHICLE_DELETED',
        entityType: 'VEHICLE',
        entityId: id,
        fromState: existing.status,
        metadata: { licensePlate: existing.licensePlate },
        createdAt: new Date().toISOString(),
      });
    }
    return result;
  }

  // ==========================================
  // 2. DRIVER MANAGEMENT
  // ==========================================

  async listDrivers(status?: DriverStatus): Promise<Driver[]> {
    return this.fleetRepo.listDrivers(status);
  }

  async getDriver(id: string): Promise<Driver | null> {
    return this.fleetRepo.getDriverById(id);
  }

  async createDriver(data: unknown, changedBy: string = 'SYSTEM'): Promise<Driver> {
    const validated = driverSchema.parse(data);
    const nowIso = new Date().toISOString();
    const driver: Driver = {
      id: `drv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: validated.name,
      phone: validated.phone,
      licenseNumber: validated.licenseNumber,
      vehicleId: validated.vehicleId,
      status: validated.status,
      note: validated.note,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.fleetRepo.createDriver(driver);

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'DRIVER_CREATED',
      entityType: 'DRIVER',
      entityId: saved.id,
      toState: saved.status,
      metadata: { name: saved.name, phone: saved.phone },
      createdAt: nowIso,
    });

    return saved;
  }

  async updateDriver(id: string, updates: unknown, changedBy: string = 'SYSTEM'): Promise<Driver> {
    const validated = updateDriverSchema.parse(updates);
    const existing = await this.fleetRepo.getDriverById(id);
    if (!existing) throw new Error(`Tài xế với ID ${id} không tồn tại`);

    const updated = await this.fleetRepo.updateDriver(id, validated);
    const nowIso = new Date().toISOString();

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'DRIVER_UPDATED',
      entityType: 'DRIVER',
      entityId: id,
      fromState: existing.status,
      toState: updated.status,
      metadata: { updates: validated },
      createdAt: nowIso,
    });

    return updated;
  }

  async updateDriverStatus(id: string, newStatus: DriverStatus, changedBy: string = 'SYSTEM', note?: string): Promise<Driver> {
    const existing = await this.fleetRepo.getDriverById(id);
    if (!existing) throw new Error(`Tài xế với ID ${id} không tồn tại`);

    const updated = await this.fleetRepo.updateDriver(id, { status: newStatus });
    const nowIso = new Date().toISOString();

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'DRIVER_STATUS_CHANGED',
      entityType: 'DRIVER',
      entityId: id,
      fromState: existing.status,
      toState: newStatus,
      metadata: { note },
      createdAt: nowIso,
    });

    return updated;
  }

  async deleteDriver(id: string, changedBy: string = 'SYSTEM'): Promise<boolean> {
    const existing = await this.fleetRepo.getDriverById(id);
    if (!existing) return false;

    const result = await this.fleetRepo.deleteDriver(id);
    if (result) {
      await this.settingsRepo.createAuditLog({
        id: `log-${Date.now()}`,
        userId: changedBy,
        userEmail: changedBy,
        action: 'DRIVER_DELETED',
        entityType: 'DRIVER',
        entityId: id,
        fromState: existing.status,
        metadata: { name: existing.name },
        createdAt: new Date().toISOString(),
      });
    }
    return result;
  }

  // ==========================================
  // 3. CONFLICT DETECTION ENGINE
  // ==========================================

  /**
   * Phát hiện xung đột lịch chạy của Phương Tiện (Double Booking)
   * Thuật toán: S_new < E_i && S_i < E_new
   */
  async detectVehicleConflict(
    vehicleId: string,
    date: string,
    startTime: string,
    endTime?: string,
    excludeTripId?: string
  ): Promise<ConflictResult> {
    const vehicle = await this.fleetRepo.getVehicleById(vehicleId);
    if (!vehicle) {
      return { hasConflict: true, reason: `Phương tiện ${vehicleId} không tồn tại` };
    }

    // 1. Kiểm tra trạng thái xe
    if (vehicle.status === 'MAINTENANCE') {
      return {
        hasConflict: true,
        reason: `Xe ${vehicle.licensePlate} đang bảo trì (MAINTENANCE), không thể phân công`,
      };
    }
    if (vehicle.status === 'INACTIVE') {
      return {
        hasConflict: true,
        reason: `Xe ${vehicle.licensePlate} đang ngưng hoạt động (INACTIVE), không thể phân công`,
      };
    }

    // 2. Tính toán khoảng thời gian cần kiểm tra
    const sNew = this.parseMinutes(startTime);
    // Nếu không có endTime, ước tính thời lượng trung bình là 3.5 giờ (210 phút)
    const eNew = endTime ? this.parseMinutes(endTime) : sNew + 210;

    if (sNew >= eNew) {
      return { hasConflict: true, reason: 'Thời gian kết thúc phải sau thời gian khởi hành' };
    }

    // 3. Lấy tất cả các chuyến của cùng ngày
    const tripsOnDate = await this.fleetRepo.listTrips(date);

    for (const trip of tripsOnDate) {
      if (trip.id === excludeTripId) continue;
      // Bỏ qua chuyến đã hủy hoặc đã hoàn thành
      if (trip.status === 'CANCELLED' || trip.status === 'COMPLETED') continue;
      // Chỉ xét chuyến cùng phương tiện
      if (trip.vehicleId !== vehicleId) continue;

      const sTrip = this.parseMinutes(trip.departureTime);
      const eTrip = trip.arrivalTime ? this.parseMinutes(trip.arrivalTime) : sTrip + 210;

      // Điều kiện giao thoa thời gian
      if (sNew < eTrip && sTrip < eNew) {
        return {
          hasConflict: true,
          reason: `Xe ${vehicle.licensePlate} bị trùng lịch với Chuyến ${trip.id} (${trip.departureTime} → ${trip.arrivalTime || 'kết thúc'})`,
          conflictingTrip: trip,
        };
      }
    }

    return { hasConflict: false };
  }

  /**
   * Phát hiện xung đột lịch chạy của Tài Xế (Double Booking)
   * Thuật toán: S_new < E_i && S_i < E_new
   */
  async detectDriverConflict(
    driverId: string,
    date: string,
    startTime: string,
    endTime?: string,
    excludeTripId?: string
  ): Promise<ConflictResult> {
    const driver = await this.fleetRepo.getDriverById(driverId);
    if (!driver) {
      return { hasConflict: true, reason: `Tài xế ${driverId} không tồn tại` };
    }

    // 1. Kiểm tra trạng thái tài xế
    if (driver.status === 'OFF' || driver.status === 'OFF_DUTY') {
      return {
        hasConflict: true,
        reason: `Tài xế ${driver.name} đang nghỉ phép (OFF), không thể phân công`,
      };
    }
    if (driver.status === 'INACTIVE') {
      return {
        hasConflict: true,
        reason: `Tài xế ${driver.name} đang ngưng làm việc (INACTIVE), không thể phân công`,
      };
    }

    // 2. Tính toán khoảng thời gian cần kiểm tra
    const sNew = this.parseMinutes(startTime);
    const eNew = endTime ? this.parseMinutes(endTime) : sNew + 210;

    if (sNew >= eNew) {
      return { hasConflict: true, reason: 'Thời gian kết thúc phải sau thời gian khởi hành' };
    }

    // 3. Lấy tất cả các chuyến của cùng ngày
    const tripsOnDate = await this.fleetRepo.listTrips(date);

    for (const trip of tripsOnDate) {
      if (trip.id === excludeTripId) continue;
      if (trip.status === 'CANCELLED' || trip.status === 'COMPLETED') continue;
      if (trip.driverId !== driverId) continue;

      const sTrip = this.parseMinutes(trip.departureTime);
      const eTrip = trip.arrivalTime ? this.parseMinutes(trip.arrivalTime) : sTrip + 210;

      // Điều kiện giao thoa thời gian
      if (sNew < eTrip && sTrip < eNew) {
        return {
          hasConflict: true,
          reason: `Tài xế ${driver.name} bị trùng lịch với Chuyến ${trip.id} (${trip.departureTime} → ${trip.arrivalTime || 'kết thúc'})`,
          conflictingTrip: trip,
        };
      }
    }

    return { hasConflict: false };
  }

  // ==========================================
  // 4. TRIP MANAGEMENT
  // ==========================================

  async listTrips(date?: string, status?: TripStatus): Promise<Trip[]> {
    return this.fleetRepo.listTrips(date, status);
  }

  async getTrip(id: string): Promise<Trip | null> {
    return this.fleetRepo.getTripById(id);
  }

  async createTrip(data: unknown, changedBy: string = 'SYSTEM'): Promise<Trip> {
    const validated = tripSchema.parse(data);

    // Kiểm tra xung đột xe nếu đã chọn xe
    if (validated.vehicleId) {
      const vConflict = await this.detectVehicleConflict(
        validated.vehicleId,
        validated.departureDate,
        validated.departureTime,
        validated.arrivalTime
      );
      if (vConflict.hasConflict) {
        throw new Error(vConflict.reason || 'Xung đột lịch phương tiện');
      }
    }

    // Kiểm tra xung đột tài xế nếu đã chọn tài xế
    if (validated.driverId) {
      const dConflict = await this.detectDriverConflict(
        validated.driverId,
        validated.departureDate,
        validated.departureTime,
        validated.arrivalTime
      );
      if (dConflict.hasConflict) {
        throw new Error(dConflict.reason || 'Xung đột lịch tài xế');
      }
    }

    const nowIso = new Date().toISOString();
    const trip: Trip = {
      id: `trip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      routeId: validated.routeId,
      route: validated.route,
      vehicleId: validated.vehicleId,
      driverId: validated.driverId,
      departureDate: validated.departureDate,
      departureTime: validated.departureTime,
      arrivalTime: validated.arrivalTime,
      status: validated.status,
      bookingIds: validated.bookingIds || [],
      maxSeats: validated.maxSeats,
      bookedSeats: validated.bookedSeats,
      note: validated.note,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.fleetRepo.createTrip(trip);

    // Cập nhật trạng thái xe và tài xế sang ASSIGNED nếu đã phân công
    if (saved.vehicleId) {
      await this.updateVehicleStatus(saved.vehicleId, 'ASSIGNED', changedBy, `Gán vào chuyến ${saved.id}`);
    }
    if (saved.driverId) {
      await this.updateDriverStatus(saved.driverId, 'ASSIGNED', changedBy, `Gán vào chuyến ${saved.id}`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'TRIP_CREATED',
      entityType: 'TRIP',
      entityId: saved.id,
      toState: saved.status,
      metadata: { routeId: saved.routeId, departureDate: saved.departureDate, departureTime: saved.departureTime },
      createdAt: nowIso,
    });

    return saved;
  }

  async updateTrip(id: string, updates: unknown, changedBy: string = 'SYSTEM'): Promise<Trip> {
    const validated = updateTripSchema.parse(updates);
    const existing = await this.fleetRepo.getTripById(id);
    if (!existing) throw new Error(`Chuyến xe với ID ${id} không tồn tại`);

    const targetDate = validated.departureDate || existing.departureDate;
    const targetStartTime = validated.departureTime || existing.departureTime;
    const targetEndTime = validated.arrivalTime || existing.arrivalTime;

    if (validated.vehicleId && validated.vehicleId !== existing.vehicleId) {
      const vConflict = await this.detectVehicleConflict(
        validated.vehicleId,
        targetDate,
        targetStartTime,
        targetEndTime,
        id
      );
      if (vConflict.hasConflict) throw new Error(vConflict.reason);
    }

    if (validated.driverId && validated.driverId !== existing.driverId) {
      const dConflict = await this.detectDriverConflict(
        validated.driverId,
        targetDate,
        targetStartTime,
        targetEndTime,
        id
      );
      if (dConflict.hasConflict) throw new Error(dConflict.reason);
    }

    const updated = await this.fleetRepo.updateTrip(id, validated);
    const nowIso = new Date().toISOString();

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'TRIP_UPDATED',
      entityType: 'TRIP',
      entityId: id,
      fromState: existing.status,
      toState: updated.status,
      metadata: { updates: validated },
      createdAt: nowIso,
    });

    return updated;
  }

  async startTrip(tripId: string, changedBy: string = 'SYSTEM'): Promise<Trip> {
    const existing = await this.fleetRepo.getTripById(tripId);
    if (!existing) throw new Error(`Chuyến xe ${tripId} không tồn tại`);

    const updated = await this.fleetRepo.updateTrip(tripId, { status: 'IN_PROGRESS' });
    const nowIso = new Date().toISOString();

    if (updated.vehicleId) {
      await this.updateVehicleStatus(updated.vehicleId, 'IN_SERVICE', changedBy, `Chuyến ${tripId} khởi hành`);
    }
    if (updated.driverId) {
      await this.updateDriverStatus(updated.driverId, 'ON_TRIP', changedBy, `Chuyến ${tripId} khởi hành`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'TRIP_STARTED',
      entityType: 'TRIP',
      entityId: tripId,
      fromState: existing.status,
      toState: 'IN_PROGRESS',
      createdAt: nowIso,
    });

    return updated;
  }

  async completeTrip(tripId: string, changedBy: string = 'SYSTEM'): Promise<Trip> {
    const existing = await this.fleetRepo.getTripById(tripId);
    if (!existing) throw new Error(`Chuyến xe ${tripId} không tồn tại`);

    const updated = await this.fleetRepo.updateTrip(tripId, { status: 'COMPLETED' });
    const nowIso = new Date().toISOString();

    // Giải phóng xe và tài xế về AVAILABLE
    if (updated.vehicleId) {
      await this.updateVehicleStatus(updated.vehicleId, 'AVAILABLE', changedBy, `Hoàn thành chuyến ${tripId}`);
    }
    if (updated.driverId) {
      await this.updateDriverStatus(updated.driverId, 'AVAILABLE', changedBy, `Hoàn thành chuyến ${tripId}`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'TRIP_COMPLETED',
      entityType: 'TRIP',
      entityId: tripId,
      fromState: existing.status,
      toState: 'COMPLETED',
      createdAt: nowIso,
    });

    return updated;
  }

  async cancelTrip(tripId: string, changedBy: string = 'SYSTEM', note?: string): Promise<Trip> {
    const existing = await this.fleetRepo.getTripById(tripId);
    if (!existing) throw new Error(`Chuyến xe ${tripId} không tồn tại`);

    const updated = await this.fleetRepo.updateTrip(tripId, { status: 'CANCELLED' });
    const nowIso = new Date().toISOString();

    if (updated.vehicleId) {
      await this.updateVehicleStatus(updated.vehicleId, 'AVAILABLE', changedBy, `Hủy chuyến ${tripId}`);
    }
    if (updated.driverId) {
      await this.updateDriverStatus(updated.driverId, 'AVAILABLE', changedBy, `Hủy chuyến ${tripId}`);
    }

    await this.settingsRepo.createAuditLog({
      id: `log-${Date.now()}`,
      userId: changedBy,
      userEmail: changedBy,
      action: 'TRIP_CANCELLED',
      entityType: 'TRIP',
      entityId: tripId,
      fromState: existing.status,
      toState: 'CANCELLED',
      metadata: { note },
      createdAt: nowIso,
    });

    return updated;
  }

  async deleteTrip(id: string, changedBy: string = 'SYSTEM'): Promise<boolean> {
    const existing = await this.fleetRepo.getTripById(id);
    if (!existing) return false;

    const result = await this.fleetRepo.deleteTrip(id);
    if (result) {
      await this.settingsRepo.createAuditLog({
        id: `log-${Date.now()}`,
        userId: changedBy,
        userEmail: changedBy,
        action: 'TRIP_DELETED',
        entityType: 'TRIP',
        entityId: id,
        fromState: existing.status,
        createdAt: new Date().toISOString(),
      });
    }
    return result;
  }
}

export const fleetService = new FleetService();

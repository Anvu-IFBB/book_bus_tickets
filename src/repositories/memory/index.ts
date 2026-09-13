import { Booking } from '@/types/booking';
import { Customer } from '@/types/customer';
import { Route, Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { Feedback } from '@/types/feedback';
import { SystemSettings, AuditLog } from '@/types/automation';

import { IBookingRepository, BookingFilter } from '../interfaces/IBookingRepository';
import { ICustomerRepository } from '../interfaces/ICustomerRepository';
import { IFleetRepository } from '../interfaces/IFleetRepository';
import { IFeedbackRepository, FeedbackFilter } from '../interfaces/IFeedbackRepository';
import { ISettingsRepository } from '../interfaces/ISettingsRepository';

import {
  INITIAL_BOOKINGS,
  INITIAL_CUSTOMERS,
  INITIAL_ROUTES,
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_TRIPS,
  INITIAL_FEEDBACK,
  INITIAL_SETTINGS,
} from './mockData';

// Memory Booking Repository
export class MemoryBookingRepository implements IBookingRepository {
  private bookings: Booking[] = [...INITIAL_BOOKINGS];

  async create(booking: Booking): Promise<Booking> {
    this.bookings.unshift(booking);
    return { ...booking };
  }

  async findById(id: string): Promise<Booking | null> {
    const item = this.bookings.find((b) => b.id === id);
    return item ? { ...item } : null;
  }

  async findByCode(code: string): Promise<Booking | null> {
    const item = this.bookings.find(
      (b) => b.bookingCode.toUpperCase() === code.toUpperCase()
    );
    return item ? { ...item } : null;
  }

  async findByCodeAndPhone(code: string, phone: string): Promise<Booking | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    const item = this.bookings.find((b) => {
      if (b.bookingCode.toUpperCase() !== code.toUpperCase()) return false;
      if (b.cargoDetails) {
        const sender = b.cargoDetails.senderPhone.replace(/\D/g, '');
        const receiver = b.cargoDetails.receiverPhone.replace(/\D/g, '');
        return sender === cleanPhone || receiver === cleanPhone;
      }
      return true; // customer phone will be checked in service layer with customerId
    });
    return item ? { ...item } : null;
  }

  async findByCustomerId(customerId: string): Promise<Booking[]> {
    return this.bookings
      .filter((b) => b.customerId === customerId)
      .map((b) => ({ ...b }));
  }

  async update(id: string, updates: Partial<Booking>): Promise<Booking> {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new Error(`Booking với ID ${id} không tồn tại`);
    }
    const updated = {
      ...this.bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.bookings[index] = updated;
    return { ...updated };
  }

  async list(filter?: BookingFilter): Promise<Booking[]> {
    let result = [...this.bookings];
    if (filter?.status) {
      result = result.filter((b) => b.bookingStatus === filter.status);
    }
    if (filter?.serviceType) {
      result = result.filter((b) => b.serviceType === filter.serviceType);
    }
    if (filter?.date) {
      result = result.filter((b) => b.travelDate === filter.date);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.bookingCode.toLowerCase().includes(q) ||
          b.departure.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getNextSequenceForDate(dateStr: string): Promise<number> {
    const cleanDate = dateStr.replace(/\D/g, '');
    const count = this.bookings.filter((b) => {
      const bDate = b.createdAt.slice(0, 10).replace(/\D/g, '');
      return bDate === cleanDate || b.bookingCode.includes(cleanDate);
    }).length;
    return count + 1;
  }
}

// Memory Customer Repository
export class MemoryCustomerRepository implements ICustomerRepository {
  private customers: Customer[] = [...INITIAL_CUSTOMERS];

  async findById(id: string): Promise<Customer | null> {
    const item = this.customers.find((c) => c.id === id);
    return item ? { ...item } : null;
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    const cleanPhone = phone.replace(/\D/g, '');
    const item = this.customers.find(
      (c) => c.phone.replace(/\D/g, '') === cleanPhone
    );
    return item ? { ...item } : null;
  }

  async create(customer: Customer): Promise<Customer> {
    this.customers.push(customer);
    return { ...customer };
  }

  async update(id: string, updates: Partial<Customer>): Promise<Customer> {
    const index = this.customers.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Khách hàng với ID ${id} không tồn tại`);
    }
    const updated = {
      ...this.customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.customers[index] = updated;
    return { ...updated };
  }

  async list(search?: string): Promise<Customer[]> {
    if (!search) return [...this.customers];
    const q = search.toLowerCase();
    return this.customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    );
  }

  async incrementStats(
    id: string,
    bookingCountDelta: number,
    completedDelta: number,
    cancelledDelta: number,
    spentDelta: number
  ): Promise<Customer> {
    const customer = await this.findById(id);
    if (!customer) throw new Error(`Customer ${id} not found`);

    const updated = await this.update(id, {
      totalBookings: Math.max(0, customer.totalBookings + bookingCountDelta),
      completedBookings: Math.max(0, customer.completedBookings + completedDelta),
      cancelledBookings: Math.max(0, customer.cancelledBookings + cancelledDelta),
      totalSpent: Math.max(0, customer.totalSpent + spentDelta),
      isVip: customer.totalSpent + spentDelta >= 3000000 || customer.totalBookings + bookingCountDelta >= 5,
    });
    return updated;
  }
}

// Memory Fleet Repository
export class MemoryFleetRepository implements IFleetRepository {
  private routes: Route[] = [...INITIAL_ROUTES];
  private vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  private drivers: Driver[] = [...INITIAL_DRIVERS];
  private trips: Trip[] = [...INITIAL_TRIPS];

  // Routes
  async listRoutes(activeOnly: boolean = false): Promise<Route[]> {
    if (activeOnly) {
      return this.routes.filter((r) => r.active);
    }
    return [...this.routes];
  }

  async getRouteById(id: string): Promise<Route | null> {
    const item = this.routes.find((r) => r.id === id);
    return item ? { ...item } : null;
  }

  async createRoute(route: Route): Promise<Route> {
    this.routes.push(route);
    return { ...route };
  }

  async updateRoute(id: string, updates: Partial<Route>): Promise<Route> {
    const index = this.routes.findIndex((r) => r.id === id);
    if (index === -1) throw new Error(`Tuyến ${id} không tồn tại`);
    this.routes[index] = { ...this.routes[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.routes[index] };
  }

  // Vehicles
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    if (status) return this.vehicles.filter((v) => v.status === status);
    return [...this.vehicles];
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const item = this.vehicles.find((v) => v.id === id);
    return item ? { ...item } : null;
  }

  async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    this.vehicles.push(vehicle);
    return { ...vehicle };
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const index = this.vehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error(`Xe ${id} không tồn tại`);
    this.vehicles[index] = { ...this.vehicles[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.vehicles[index] };
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const prevLen = this.vehicles.length;
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    return this.vehicles.length < prevLen;
  }

  // Drivers
  async listDrivers(status?: DriverStatus): Promise<Driver[]> {
    if (status) return this.drivers.filter((d) => d.status === status);
    return [...this.drivers];
  }

  async getDriverById(id: string): Promise<Driver | null> {
    const item = this.drivers.find((d) => d.id === id);
    return item ? { ...item } : null;
  }

  async createDriver(driver: Driver): Promise<Driver> {
    this.drivers.push(driver);
    return { ...driver };
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    const index = this.drivers.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`Tài xế ${id} không tồn tại`);
    this.drivers[index] = { ...this.drivers[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.drivers[index] };
  }

  async deleteDriver(id: string): Promise<boolean> {
    const prevLen = this.drivers.length;
    this.drivers = this.drivers.filter((d) => d.id !== id);
    return this.drivers.length < prevLen;
  }

  // Trips
  async listTrips(date?: string, status?: TripStatus): Promise<Trip[]> {
    let result = [...this.trips];
    if (date) result = result.filter((t) => t.departureDate === date);
    if (status) result = result.filter((t) => t.status === status);
    return result;
  }

  async getTripById(id: string): Promise<Trip | null> {
    const item = this.trips.find((t) => t.id === id);
    return item ? { ...item } : null;
  }

  async createTrip(trip: Trip): Promise<Trip> {
    this.trips.push(trip);
    return { ...trip };
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const index = this.trips.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`Chuyến ${id} không tồn tại`);
    this.trips[index] = { ...this.trips[index], ...updates, updatedAt: new Date().toISOString() };
    return { ...this.trips[index] };
  }

  async deleteTrip(id: string): Promise<boolean> {
    const prevLen = this.trips.length;
    this.trips = this.trips.filter((t) => t.id !== id);
    return this.trips.length < prevLen;
  }
}

// Memory Feedback Repository
export class MemoryFeedbackRepository implements IFeedbackRepository {
  private feedbacks: Feedback[] = [...INITIAL_FEEDBACK];

  async create(feedback: Feedback): Promise<Feedback> {
    this.feedbacks.unshift(feedback);
    return { ...feedback };
  }

  async findById(id: string): Promise<Feedback | null> {
    const item = this.feedbacks.find((f) => f.id === id);
    return item ? { ...item } : null;
  }

  async findByBookingCode(code: string): Promise<Feedback | null> {
    const item = this.feedbacks.find(
      (f) => f.bookingCode.toUpperCase() === code.toUpperCase()
    );
    return item ? { ...item } : null;
  }

  async list(filter?: FeedbackFilter): Promise<Feedback[]> {
    let result = [...this.feedbacks];
    if (filter?.rating) result = result.filter((f) => f.rating === filter.rating);
    if (filter?.status) result = result.filter((f) => f.status === filter.status);
    if (filter?.isPublishedTestimonial !== undefined) {
      result = result.filter((f) => f.isPublishedTestimonial === filter.isPublishedTestimonial);
    }
    return result;
  }

  async update(id: string, updates: Partial<Feedback>): Promise<Feedback> {
    const index = this.feedbacks.findIndex((f) => f.id === id);
    if (index === -1) throw new Error(`Feedback ${id} không tồn tại`);
    this.feedbacks[index] = { ...this.feedbacks[index], ...updates };
    return { ...this.feedbacks[index] };
  }
}

// Memory Settings Repository
export class MemorySettingsRepository implements ISettingsRepository {
  private settings: SystemSettings = { ...INITIAL_SETTINGS };
  private auditLogs: AuditLog[] = [];

  async getSettings(): Promise<SystemSettings> {
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<SystemSettings>): Promise<SystemSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return { ...this.settings };
  }

  async createAuditLog(log: AuditLog): Promise<AuditLog> {
    this.auditLogs.unshift(log);
    return { ...log };
  }

  async listAuditLogs(entityType?: string, entityId?: string): Promise<AuditLog[]> {
    let result = [...this.auditLogs];
    if (entityType) result = result.filter((l) => l.entityType === entityType);
    if (entityId) result = result.filter((l) => l.entityId === entityId);
    return result;
  }
}

export * from './paymentRepository';
export * from './invoiceRepository';
export * from './MemoryAutomationRepository';
export * from './MemoryNotificationRepository';
export * from './MemoryNotificationTemplateRepository';
export * from './MemoryNotificationDeliveryRepository';
export * from './MemoryAnalyticsRepository';
export * from './MemoryAnalyticsSummaryRepository';

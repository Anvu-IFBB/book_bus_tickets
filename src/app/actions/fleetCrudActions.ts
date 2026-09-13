/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getActiveRepositoryMode } from '@/repositories';
import { fleetService } from '@/services/fleetService';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { requirePermission } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { Vehicle, Driver, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { vehicleSchema, driverSchema, tripSchema } from '@/lib/validation/fleetSchema';
import { handleActionError } from '@/lib/server/action-error';

export async function listVehiclesAction(status?: VehicleStatus): Promise<{ success: boolean; data?: Vehicle[]; error?: string }> {
  try {
    await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const data = await fleetService.listVehicles(status);
      return { success: true, data };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    let q: any = db.collection('vehicles');
    if (status) {
      q = q.where('status', '==', status);
    }
    const snapshot = await q.get();
    const data = snapshot.docs.map((doc: any) => doc.data() as Vehicle);
    return { success: true, data };
  } catch (error: unknown) {
    return handleActionError(error, 'listVehiclesAction');
  }
}

export async function createVehicleAction(data: any): Promise<{ success: boolean; data?: Vehicle; error?: string }> {
  try {
    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const result = await fleetService.createVehicle(data, user.email);
      return { success: true, data: result };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const validated = vehicleSchema.parse(data);
    const nowIso = new Date().toISOString();
    const vehicle = {
      id: `veh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...validated,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('vehicles').doc(vehicle.id);
      transaction.set(docRef, vehicle);
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'VEHICLE_CREATED',
        entityType: 'VEHICLE',
        entityId: vehicle.id,
        toState: vehicle.status,
        metadata: { licensePlate: vehicle.licensePlate, name: vehicle.name },
        createdAt: nowIso,
      });
    });
    return { success: true, data: vehicle as Vehicle };
  } catch (error: unknown) {
    return handleActionError(error, 'createVehicleAction');
  }
}

import { z } from 'zod';

const updateStatusSchema = z.object({
  id: z.string().min(1),
  newStatus: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']).or(z.enum(['ACTIVE', 'INACTIVE', 'ON_LEAVE'])).or(z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])),
  note: z.string().optional(),
});

export async function updateVehicleStatusAction(id: string, newStatus: VehicleStatus, note?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = updateStatusSchema.safeParse({ id, newStatus, note });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };
    
    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      await fleetService.updateVehicleStatus(id, newStatus, user.email, note);
      return { success: true };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const nowIso = new Date().toISOString();
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('vehicles').doc(id);
      const doc = await transaction.get(docRef);
      if (!doc.exists) throw new Error('Không tìm thấy phương tiện');
      const oldStatus = doc.data()?.status;
      transaction.update(docRef, { status: newStatus, updatedAt: nowIso });
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'VEHICLE_STATUS_CHANGED',
        entityType: 'VEHICLE',
        entityId: id,
        fromState: oldStatus,
        toState: newStatus,
        metadata: { note },
        createdAt: nowIso,
      });
    });
    return { success: true };
  } catch (error: unknown) {
    return handleActionError(error, 'updateVehicleStatusAction');
  }
}

export async function listDriversAction(status?: DriverStatus): Promise<{ success: boolean; data?: Driver[]; error?: string }> {
  try {
    await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const data = await fleetService.listDrivers(status);
      return { success: true, data };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    let q: any = db.collection('drivers');
    if (status) {
      q = q.where('status', '==', status);
    }
    const snapshot = await q.get();
    const data = snapshot.docs.map((doc: any) => doc.data() as Driver);
    return { success: true, data };
  } catch (error: unknown) {
    return handleActionError(error, 'listDriversAction');
  }
}

export async function createDriverAction(data: any): Promise<{ success: boolean; data?: Driver; error?: string }> {
  try {
    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const result = await fleetService.createDriver(data, user.email);
      return { success: true, data: result };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const validated = driverSchema.parse(data);
    const nowIso = new Date().toISOString();
    const driver = {
      id: `drv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...validated,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('drivers').doc(driver.id);
      transaction.set(docRef, driver);
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'DRIVER_CREATED',
        entityType: 'DRIVER',
        entityId: driver.id,
        toState: driver.status,
        metadata: { name: driver.name, phone: driver.phone },
        createdAt: nowIso,
      });
    });
    return { success: true, data: driver as Driver };
  } catch (error: unknown) {
    return handleActionError(error, 'createDriverAction');
  }
}

export async function updateDriverStatusAction(id: string, newStatus: DriverStatus, note?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = updateStatusSchema.safeParse({ id, newStatus, note });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      await fleetService.updateDriverStatus(id, newStatus, user.email, note);
      return { success: true };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const nowIso = new Date().toISOString();
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('drivers').doc(id);
      const doc = await transaction.get(docRef);
      if (!doc.exists) throw new Error('Không tìm thấy tài xế');
      const oldStatus = doc.data()?.status;
      transaction.update(docRef, { status: newStatus, updatedAt: nowIso });
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'DRIVER_STATUS_CHANGED',
        entityType: 'DRIVER',
        entityId: id,
        fromState: oldStatus,
        toState: newStatus,
        metadata: { note },
        createdAt: nowIso,
      });
    });
    return { success: true };
  } catch (error: unknown) {
    return handleActionError(error, 'updateDriverStatusAction');
  }
}

export async function listTripsAction(status?: TripStatus): Promise<{ success: boolean; data?: Trip[]; error?: string }> {
  try {
    await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const data = await fleetService.listTrips(status);
      return { success: true, data };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    let q: any = db.collection('trips');
    if (status) {
      q = q.where('status', '==', status);
    }
    const snapshot = await q.orderBy('departureTime', 'desc').get();
    const data = snapshot.docs.map((doc: any) => doc.data() as Trip);
    return { success: true, data };
  } catch (error: unknown) {
    return handleActionError(error, 'listTripsAction');
  }
}

export async function createTripAction(data: any): Promise<{ success: boolean; data?: Trip; error?: string }> {
  try {
    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      const result = await fleetService.createTrip(data, user.email);
      return { success: true, data: result };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const validated = tripSchema.parse(data);
    const nowIso = new Date().toISOString();
    const trip = {
      id: `trip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...validated,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('trips').doc(trip.id);
      transaction.set(docRef, trip);
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'TRIP_CREATED',
        entityType: 'TRIP',
        entityId: trip.id,
        toState: trip.status,
        metadata: { routeId: trip.routeId },
        createdAt: nowIso,
      });
    });
    return { success: true, data: trip as Trip };
  } catch (error: unknown) {
    return handleActionError(error, 'createTripAction');
  }
}

export async function updateTripStatusAction(id: string, newStatus: TripStatus, note?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const parsed = updateStatusSchema.safeParse({ id, newStatus, note });
    if (!parsed.success) return { success: false, error: 'Dữ liệu không hợp lệ' };

    const user = await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      if (newStatus === 'IN_PROGRESS') {
        await fleetService.startTrip(id, user.email);
      } else if (newStatus === 'COMPLETED') {
        await fleetService.completeTrip(id, user.email);
      } else if (newStatus === 'CANCELLED') {
        await fleetService.cancelTrip(id, user.email, note);
      }
      return { success: true };
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const nowIso = new Date().toISOString();
    await db.runTransaction(async (transaction) => {
      const docRef = db.collection('trips').doc(id);
      const doc = await transaction.get(docRef);
      if (!doc.exists) throw new Error('Không tìm thấy chuyến đi');
      const oldStatus = doc.data()?.status;
      transaction.update(docRef, { status: newStatus, updatedAt: nowIso });
      const auditLogId = `log-${Date.now()}`;
      const auditRef = db.collection('auditLogs').doc(auditLogId);
      transaction.set(auditRef, {
        id: auditLogId,
        userId: user.id,
        userEmail: user.email,
        actorRole: user.role,
        action: 'TRIP_STATUS_CHANGED',
        entityType: 'TRIP',
        entityId: id,
        fromState: oldStatus,
        toState: newStatus,
        metadata: { note },
        createdAt: nowIso,
      });
    });
    return { success: true };
  } catch (error: unknown) {
    return handleActionError(error, 'updateTripStatusAction');
  }
}

export async function detectVehicleConflictAction(
  vehicleId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<{ hasConflict: boolean; reason?: string }> {
  try {
    await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      return fleetService.detectVehicleConflict(vehicleId, date, startTime, endTime);
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const q = db.collection('trips')
      .where('vehicleId', '==', vehicleId)
      .where('departureDate', '==', date)
      .where('status', 'not-in', ['COMPLETED', 'CANCELLED']);
    const snapshot = await q.get();
    const trips = snapshot.docs.map(d => d.data() as Trip);
    const parseMins = (t: string) => { const [h,m]=t.split(':').map(Number); return (h||0)*60+(m||0); };
    const s1 = parseMins(startTime);
    const e1 = parseMins(endTime);
    for (const t of trips) {
      if (!t.arrivalTime) continue;
      const s2 = parseMins(t.departureTime);
      const e2 = parseMins(t.arrivalTime);
      if (Math.max(s1, s2) < Math.min(e1, e2)) {
        return { hasConflict: true, reason: `Xe đã được xếp chuyến lúc ${t.departureTime} - ${t.arrivalTime}` };
      }
    }
    return { hasConflict: false };
  } catch (error: unknown) {
    handleActionError(error, 'detectVehicleConflictAction'); // Log it server-side
    return { hasConflict: true, reason: 'Lỗi hệ thống khi kiểm tra' };
  }
}

export async function detectDriverConflictAction(
  driverId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<{ hasConflict: boolean; reason?: string }> {
  try {
    await requirePermission(Permissions.canAssignFleet);
    if (getActiveRepositoryMode() === 'memory') {
      return fleetService.detectDriverConflict(driverId, date, startTime, endTime);
    }
    const db = getAdminFirestore();
    if (!db) throw new Error('Firebase Admin SDK không khả dụng');
    const q = db.collection('trips')
      .where('driverId', '==', driverId)
      .where('departureDate', '==', date)
      .where('status', 'not-in', ['COMPLETED', 'CANCELLED']);
    const snapshot = await q.get();
    const trips = snapshot.docs.map(d => d.data() as Trip);
    const parseMins = (t: string) => { const [h,m]=t.split(':').map(Number); return (h||0)*60+(m||0); };
    const s1 = parseMins(startTime);
    const e1 = parseMins(endTime);
    for (const t of trips) {
      if (!t.arrivalTime) continue;
      const s2 = parseMins(t.departureTime);
      const e2 = parseMins(t.arrivalTime);
      if (Math.max(s1, s2) < Math.min(e1, e2)) {
        return { hasConflict: true, reason: `Tài xế đã có chuyến lúc ${t.departureTime} - ${t.arrivalTime}` };
      }
    }
    return { hasConflict: false };
  } catch (error: unknown) {
    handleActionError(error, 'detectDriverConflictAction');
    return { hasConflict: true, reason: 'Lỗi hệ thống khi kiểm tra' };
  }
}

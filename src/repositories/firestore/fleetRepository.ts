/* eslint-disable @typescript-eslint/no-explicit-any */
import { Firestore } from 'firebase-admin/firestore';
import { IFleetRepository } from '../interfaces/IFleetRepository';
import { Vehicle, Driver, Route, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { getAdminFirestore } from '@/lib/firebase/admin';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreFleetRepository implements IFleetRepository {
  private get db(): Firestore {
    const firestore = getAdminFirestore();
    if (!firestore) {
      throw new Error('Firebase Admin Firestore is not initialized.');
    }
    return firestore;
  }

  // --- ROUTES ---
  async listRoutes(activeOnly?: boolean): Promise<Route[]> {
    let q: FirebaseFirestore.Query = this.db.collection('routes');
    if (activeOnly) {
      q = q.where('active', '==', true);
    }
    const snap = await q.get();
    return snap.docs.map((d) => docToEntity<Route>(d as any)!);
  }

  async getRouteById(id: string): Promise<Route | null> {
    const snap = await this.db.collection('routes').doc(id).get();
    return docToEntity<Route>(snap as any);
  }

  async createRoute(route: Route): Promise<Route> {
    const docRef = this.db.collection('routes').doc(route.id);
    await docRef.set(cleanUndefined(route as unknown as Record<string, unknown>));
    return route;
  }

  async updateRoute(id: string, updates: Partial<Route>): Promise<Route> {
    const docRef = this.db.collection('routes').doc(id);
    await docRef.update(cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await docRef.get();
    return docToEntity<Route>(snap as any)!;
  }

  // --- VEHICLES ---
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    let q: FirebaseFirestore.Query = this.db.collection('vehicles');
    if (status) {
      q = q.where('status', '==', status);
    }
    const snap = await q.get();
    return snap.docs.map((d) => docToEntity<Vehicle>(d as any)!);
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const snap = await this.db.collection('vehicles').doc(id).get();
    return docToEntity<Vehicle>(snap as any);
  }

  async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const docRef = this.db.collection('vehicles').doc(vehicle.id);
    await docRef.set(cleanUndefined(vehicle as unknown as Record<string, unknown>));
    return vehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const docRef = this.db.collection('vehicles').doc(id);
    await docRef.update(cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await docRef.get();
    return docToEntity<Vehicle>(snap as any)!;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    await this.db.collection('vehicles').doc(id).delete();
    return true;
  }

  // --- DRIVERS ---
  async listDrivers(status?: DriverStatus): Promise<Driver[]> {
    let q: FirebaseFirestore.Query = this.db.collection('drivers');
    if (status) {
      q = q.where('status', '==', status);
    }
    const snap = await q.get();
    return snap.docs.map((d) => docToEntity<Driver>(d as any)!);
  }

  async getDriverById(id: string): Promise<Driver | null> {
    const snap = await this.db.collection('drivers').doc(id).get();
    return docToEntity<Driver>(snap as any);
  }

  async createDriver(driver: Driver): Promise<Driver> {
    const docRef = this.db.collection('drivers').doc(driver.id);
    await docRef.set(cleanUndefined(driver as unknown as Record<string, unknown>));
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    const docRef = this.db.collection('drivers').doc(id);
    await docRef.update(cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await docRef.get();
    return docToEntity<Driver>(snap as any)!;
  }

  async deleteDriver(id: string): Promise<boolean> {
    await this.db.collection('drivers').doc(id).delete();
    return true;
  }

  // --- TRIPS ---
  async listTrips(date?: string, status?: TripStatus): Promise<Trip[]> {
    let q: FirebaseFirestore.Query = this.db.collection('trips');
    if (date) {
      q = q.where('departureDate', '==', date);
    }
    if (status) {
      q = q.where('status', '==', status);
    }
    const snap = await q.get();
    const trips = snap.docs.map((d) => docToEntity<Trip>(d as any)!);
    return trips.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  async getTripById(id: string): Promise<Trip | null> {
    const snap = await this.db.collection('trips').doc(id).get();
    return docToEntity<Trip>(snap as any);
  }

  async createTrip(trip: Trip): Promise<Trip> {
    const docRef = this.db.collection('trips').doc(trip.id);
    await docRef.set(cleanUndefined(trip as unknown as Record<string, unknown>));
    return trip;
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const docRef = this.db.collection('trips').doc(id);
    await docRef.update(cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await docRef.get();
    return docToEntity<Trip>(snap as any)!;
  }

  async deleteTrip(id: string): Promise<boolean> {
    await this.db.collection('trips').doc(id).delete();
    return true;
  }
}

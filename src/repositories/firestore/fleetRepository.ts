import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Firestore,
} from 'firebase/firestore';
import { IFleetRepository } from '../interfaces/IFleetRepository';
import { Vehicle, Driver, Route, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { getFirebaseFirestore } from '@/lib/firebase/client';
import { cleanUndefined, docToEntity } from './helpers';

export class FirestoreFleetRepository implements IFleetRepository {
  private get db(): Firestore {
    const firestore = getFirebaseFirestore();
    if (!firestore) {
      throw new Error('Firebase Firestore is not initialized.');
    }
    return firestore;
  }

  // --- ROUTES ---
  async listRoutes(activeOnly?: boolean): Promise<Route[]> {
    let q = query(collection(this.db, 'routes'));
    if (activeOnly) {
      q = query(q, where('active', '==', true));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToEntity<Route>(d)!);
  }

  async getRouteById(id: string): Promise<Route | null> {
    const snap = await getDoc(doc(this.db, 'routes', id));
    return docToEntity<Route>(snap);
  }

  async createRoute(route: Route): Promise<Route> {
    const docRef = doc(this.db, 'routes', route.id);
    await setDoc(docRef, cleanUndefined(route as unknown as Record<string, unknown>));
    return route;
  }

  async updateRoute(id: string, updates: Partial<Route>): Promise<Route> {
    const docRef = doc(this.db, 'routes', id);
    await updateDoc(docRef, cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await getDoc(docRef);
    return docToEntity<Route>(snap)!;
  }

  // --- VEHICLES ---
  async listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
    let q = query(collection(this.db, 'vehicles'));
    if (status) {
      q = query(q, where('status', '==', status));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToEntity<Vehicle>(d)!);
  }

  async getVehicleById(id: string): Promise<Vehicle | null> {
    const snap = await getDoc(doc(this.db, 'vehicles', id));
    return docToEntity<Vehicle>(snap);
  }

  async createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const docRef = doc(this.db, 'vehicles', vehicle.id);
    await setDoc(docRef, cleanUndefined(vehicle as unknown as Record<string, unknown>));
    return vehicle;
  }

  async updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const docRef = doc(this.db, 'vehicles', id);
    await updateDoc(docRef, cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await getDoc(docRef);
    return docToEntity<Vehicle>(snap)!;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    await deleteDoc(doc(this.db, 'vehicles', id));
    return true;
  }

  // --- DRIVERS ---
  async listDrivers(status?: DriverStatus): Promise<Driver[]> {
    let q = query(collection(this.db, 'drivers'));
    if (status) {
      q = query(q, where('status', '==', status));
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => docToEntity<Driver>(d)!);
  }

  async getDriverById(id: string): Promise<Driver | null> {
    const snap = await getDoc(doc(this.db, 'drivers', id));
    return docToEntity<Driver>(snap);
  }

  async createDriver(driver: Driver): Promise<Driver> {
    const docRef = doc(this.db, 'drivers', driver.id);
    await setDoc(docRef, cleanUndefined(driver as unknown as Record<string, unknown>));
    return driver;
  }

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    const docRef = doc(this.db, 'drivers', id);
    await updateDoc(docRef, cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await getDoc(docRef);
    return docToEntity<Driver>(snap)!;
  }

  async deleteDriver(id: string): Promise<boolean> {
    await deleteDoc(doc(this.db, 'drivers', id));
    return true;
  }

  // --- TRIPS ---
  async listTrips(date?: string, status?: TripStatus): Promise<Trip[]> {
    let q = query(collection(this.db, 'trips'));
    if (date) {
      q = query(q, where('departureDate', '==', date));
    }
    if (status) {
      q = query(q, where('status', '==', status));
    }
    const snap = await getDocs(q);
    const trips = snap.docs.map((d) => docToEntity<Trip>(d)!);
    return trips.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }

  async getTripById(id: string): Promise<Trip | null> {
    const snap = await getDoc(doc(this.db, 'trips', id));
    return docToEntity<Trip>(snap);
  }

  async createTrip(trip: Trip): Promise<Trip> {
    const docRef = doc(this.db, 'trips', trip.id);
    await setDoc(docRef, cleanUndefined(trip as unknown as Record<string, unknown>));
    return trip;
  }

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    const docRef = doc(this.db, 'trips', id);
    await updateDoc(docRef, cleanUndefined(updates as unknown as Record<string, unknown>));
    const snap = await getDoc(docRef);
    return docToEntity<Trip>(snap)!;
  }

  async deleteTrip(id: string): Promise<boolean> {
    await deleteDoc(doc(this.db, 'trips', id));
    return true;
  }
}

import { Vehicle, Driver, Route, Trip, VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';

export interface IFleetRepository {
  // Routes
  listRoutes(activeOnly?: boolean): Promise<Route[]>;
  getRouteById(id: string): Promise<Route | null>;
  createRoute(route: Route): Promise<Route>;
  updateRoute(id: string, updates: Partial<Route>): Promise<Route>;

  // Vehicles
  listVehicles(status?: VehicleStatus): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | null>;
  createVehicle(vehicle: Vehicle): Promise<Vehicle>;
  updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle>;

  // Drivers
  listDrivers(status?: DriverStatus): Promise<Driver[]>;
  getDriverById(id: string): Promise<Driver | null>;
  createDriver(driver: Driver): Promise<Driver>;
  updateDriver(id: string, updates: Partial<Driver>): Promise<Driver>;

  // Trips
  listTrips(date?: string, status?: TripStatus): Promise<Trip[]>;
  getTripById(id: string): Promise<Trip | null>;
  createTrip(trip: Trip): Promise<Trip>;
  updateTrip(id: string, updates: Partial<Trip>): Promise<Trip>;
}

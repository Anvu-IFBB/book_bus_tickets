'use server';

import { fleetService } from '@/services/fleetService';

export async function listVehiclesAction() {
  return fleetService.listVehicles();
}

export async function listDriversAction() {
  return fleetService.listDrivers();
}

export async function detectVehicleConflictAction(vehicleId: string, travelDate: string, travelTime: string) {
  return fleetService.detectVehicleConflict(vehicleId, travelDate, travelTime);
}

export async function detectDriverConflictAction(driverId: string, travelDate: string, travelTime: string) {
  return fleetService.detectDriverConflict(driverId, travelDate, travelTime);
}

'use server';

import { operationsService } from '@/services/operationsService';

export async function getOperationsSummaryAction() {
  return operationsService.getOperationsSummary();
}

import { ListBookingsFilter } from '@/services/operationsService';

export async function listBookingsWithDetailsAction(filter: ListBookingsFilter, page: number, pageSize: number) {
  return operationsService.listBookingsWithDetails(filter, page, pageSize);
}

export async function getBookingDetailsWithEnrichmentAction(id: string) {
  return operationsService.getBookingDetailsWithEnrichment(id);
}

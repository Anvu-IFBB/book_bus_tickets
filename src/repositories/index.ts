import { IBookingRepository } from './interfaces/IBookingRepository';
import { ICustomerRepository } from './interfaces/ICustomerRepository';
import { IFleetRepository } from './interfaces/IFleetRepository';
import { IFeedbackRepository } from './interfaces/IFeedbackRepository';
import { ISettingsRepository } from './interfaces/ISettingsRepository';

import {
  MemoryBookingRepository,
  MemoryCustomerRepository,
  MemoryFleetRepository,
  MemoryFeedbackRepository,
  MemorySettingsRepository,
} from './memory';

// Singleton instances for In-Memory repositories (giữ state trong quá trình dev/test)
const globalRepoState = globalThis as unknown as {
  _bookingRepo?: IBookingRepository;
  _customerRepo?: ICustomerRepository;
  _fleetRepo?: IFleetRepository;
  _feedbackRepo?: IFeedbackRepository;
  _settingsRepo?: ISettingsRepository;
};

export function getBookingRepository(): IBookingRepository {
  if (!globalRepoState._bookingRepo) {
    globalRepoState._bookingRepo = new MemoryBookingRepository();
  }
  return globalRepoState._bookingRepo;
}

export function getCustomerRepository(): ICustomerRepository {
  if (!globalRepoState._customerRepo) {
    globalRepoState._customerRepo = new MemoryCustomerRepository();
  }
  return globalRepoState._customerRepo;
}

export function getFleetRepository(): IFleetRepository {
  if (!globalRepoState._fleetRepo) {
    globalRepoState._fleetRepo = new MemoryFleetRepository();
  }
  return globalRepoState._fleetRepo;
}

export function getFeedbackRepository(): IFeedbackRepository {
  if (!globalRepoState._feedbackRepo) {
    globalRepoState._feedbackRepo = new MemoryFeedbackRepository();
  }
  return globalRepoState._feedbackRepo;
}

export function getSettingsRepository(): ISettingsRepository {
  if (!globalRepoState._settingsRepo) {
    globalRepoState._settingsRepo = new MemorySettingsRepository();
  }
  return globalRepoState._settingsRepo;
}

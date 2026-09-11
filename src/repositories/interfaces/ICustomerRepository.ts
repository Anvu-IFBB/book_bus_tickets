import { Customer } from '@/types/customer';

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  create(customer: Customer): Promise<Customer>;
  update(id: string, updates: Partial<Customer>): Promise<Customer>;
  list(search?: string): Promise<Customer[]>;
  incrementStats(
    id: string,
    bookingCountDelta: number,
    completedDelta: number,
    cancelledDelta: number,
    spentDelta: number
  ): Promise<Customer>;
}

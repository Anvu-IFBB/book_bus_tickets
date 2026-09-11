export type PaymentType = 'DEPOSIT' | 'FULL' | 'REMAINDER' | 'REFUND';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'QR' | 'OTHER';

export type PaymentRecordStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

export interface Payment {
  id: string;
  bookingId: string;
  customerId: string;
  amount: number; // VNĐ
  type: PaymentType;
  method: PaymentMethod;
  status: PaymentRecordStatus;
  transactionCode?: string;
  paidAt: string; // ISO string
  note?: string;
  createdBy: string;
  createdAt: string;
}

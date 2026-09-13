export type PaymentStatus = 'PENDING' | 'DEPOSITED' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentMethod = 'CASH' | 'BANK_TRANSFER' | 'QR' | 'OTHER';

export interface Payment {
  id: string; // paymentId
  bookingId: string;
  bookingCode: string;
  customerId: string;
  
  totalAmount: number; // VNĐ
  depositAmount: number; // VNĐ
  paidAmount: number; // VNĐ
  remainingAmount: number; // VNĐ
  
  status: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionCode?: string;
  
  confirmedBy?: string; // email of the actor
  confirmedByRole?: string; // e.g. ADMIN, OPERATOR
  
  note?: string;
  
  paidAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

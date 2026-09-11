export interface Customer {
  id: string;
  name: string;
  phone: string; // Unique primary phone number
  email?: string;
  address?: string;
  note?: string;
  isVip?: boolean;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalSpent: number; // VNĐ
  favoritePickupAddress?: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface CustomerSummary {
  id: string;
  name: string;
  phone: string;
  totalBookings: number;
  totalSpent: number;
  isVip: boolean;
}

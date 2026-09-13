export interface Invoice {
  id: string; // invoiceId
  bookingId: string;
  bookingCode: string;
  paymentId: string;
  
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  service: string; // Tên dịch vụ, ví dụ "Xe Limousine 9 Chỗ", "Gửi Hàng Hỏa Tốc"
  route?: string; // Ví dụ "Quảng Ninh - Hà Nội"
  
  subtotal: number; // Tiền hàng/dịch vụ
  deposit: number;  // Cọc đã đóng
  paid: number;     // Tổng đã thanh toán (bao gồm cọc)
  remaining: number; // Còn lại
  total: number;    // Tổng tiền
  
  issuedAt: string; // ISO string
  issuedBy: string; // email of the actor
  issuedByRole: string;
}

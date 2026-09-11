/**
 * Sinh mã Booking duy nhất theo chuẩn BKYYYYMMDDXXXX
 * Ví dụ: BK202609110001
 * 
 * @param date Ngày tạo booking (mặc định là thời điểm hiện tại)
 * @param sequence Số thứ tự trong ngày (1 -> 9999). Nếu không truyền, sinh số ngẫu nhiên 4 chữ số an toàn.
 */
export function generateBookingCode(date: Date = new Date(), sequence?: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let seqStr: string;
  if (sequence !== undefined && sequence > 0) {
    seqStr = String(sequence).padStart(4, '0');
  } else {
    // Khi chưa có database atomic counter, sinh 4 ký tự ngẫu nhiên số
    const rand = Math.floor(1000 + Math.random() * 9000);
    seqStr = String(rand);
  }

  return `BK${year}${month}${day}${seqStr}`;
}

/**
 * Sinh mã đơn hàng gửi theo chuẩn HGYYYYMMDDXXXX
 * Ví dụ: HG202609110001
 */
export function generateCargoCode(date: Date = new Date(), sequence?: number): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  let seqStr: string;
  if (sequence !== undefined && sequence > 0) {
    seqStr = String(sequence).padStart(4, '0');
  } else {
    const rand = Math.floor(1000 + Math.random() * 9000);
    seqStr = String(rand);
  }

  return `HG${year}${month}${day}${seqStr}`;
}

/**
 * Định dạng số tiền sang chuẩn Việt Nam Đồng (VD: 250.000 ₫)
 */
export function formatCurrencyVN(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0 ₫';
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Định dạng chuỗi ngày YYYY-MM-DD sang chuẩn Việt Nam (DD/MM/YYYY)
 */
export function formatDateVN(dateStr: string | undefined | null): string {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

/**
 * Định dạng ngày giờ đầy đủ (HH:mm DD/MM/YYYY)
 */
export function formatDateTimeVN(isoStr: string | undefined | null): string {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  } catch {
    return isoStr;
  }
}

/**
 * Định dạng số điện thoại Việt Nam dễ đọc (VD: 0868 680 944)
 */
export function formatPhoneVN(phone: string | undefined | null): string {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
}

/**
 * Chuẩn hóa số điện thoại về 10 chữ số (VD: +84868680944 -> 0868680944)
 */
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('84') && cleaned.length === 11) {
    cleaned = '0' + cleaned.slice(2);
  }
  return cleaned;
}

/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ (đầu 03, 05, 07, 08, 09 với 10 số)
 */
export function isValidVNPhone(phone: string): boolean {
  const normalized = normalizePhone(phone);
  const regex = /^(03|05|07|08|09)\d{8}$/;
  return regex.test(normalized);
}

/**
 * Làm sạch chuỗi văn bản, loại bỏ các thẻ HTML nguy hiểm chống XSS
 */
export function sanitizeInput(input: string | undefined | null): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/[<>]/g, '') // Loại bỏ dấu < và >
    .replace(/javascript:/gi, '')
    .slice(0, 1000); // Giới hạn độ dài an toàn
}

/**
 * Làm sạch và chuẩn hóa chuỗi ghi chú
 */
export function sanitizeNote(note: string | undefined | null): string {
  if (!note) return '';
  return sanitizeInput(note).slice(0, 500);
}

import { ZodError } from 'zod';

/**
 * Xử lý lỗi tập trung cho Server Actions, ngăn chặn việc lộ lọt (leakage) 
 * raw error message từ Firebase / System ra ngoài Client.
 * 
 * @param error Error object bị catch trong try...catch
 * @param actionName Tên của action để log server-side
 * @returns { success: false, error: string } an toàn cho client
 */
export function handleActionError(error: unknown, actionName: string): { success: false; error: string } {
  // 1. Luôn log chi tiết lỗi ở phía Server để phục vụ Debugging/Monitoring
  console.error(`[${actionName}] Error:`, error);

  // 2. Phân loại lỗi và trả về thông báo an toàn
  if (error instanceof ZodError) {
    return { success: false, error: 'Thông tin nhập vào không hợp lệ' };
  }

  if (error instanceof Error) {
    const errMessage = error.message.toLowerCase();
    
    // Nếu là lỗi liên quan tới permission, infrastructure, hoặc network (thường gặp từ Firebase/Firestore)
    if (
      errMessage.includes('firebase') || 
      errMessage.includes('permission_denied') ||
      errMessage.includes('unauthenticated') ||
      errMessage.includes('deadline_exceeded') ||
      errMessage.includes('resource_exhausted') ||
      errMessage.includes('unavailable') ||
      errMessage.includes('internal') ||
      (errMessage.includes('not found') && errMessage.includes('document')) // Firestore doc not found error
    ) {
      return { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.' };
    }

    const errWithCode = error as Error & { code?: string };
    if (errWithCode.code && typeof errWithCode.code === 'string') {
      // Firebase error codes typically have prefixes like 'auth/', 'firestore/', or are numeric strings
      return { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.' };
    }

    // Các lỗi nghiệp vụ (Business Errors) do chính chúng ta throw
    // (VD: throw new Error('Không thể hoàn tiền ở trạng thái hiện tại'))
    return { success: false, error: error.message };
  }

  // Trường hợp unknown (throw string, object, v.v...)
  return { success: false, error: 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại.' };
}

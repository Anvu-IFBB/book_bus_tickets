import { z } from 'zod';
import { isValidVNPhone } from '@/lib/utils/formatters';

export const trackingSchema = z.object({
  bookingCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(BK|HG)\d{12}$/, 'Mã tra cứu không hợp lệ (Định dạng: BK2026... hoặc HG2026...)'),
  phone: z
    .string()
    .trim()
    .refine(isValidVNPhone, {
      message: 'Số điện thoại không đúng định dạng (VD: 0868680944)',
    }),
});

export type TrackingFormData = z.infer<typeof trackingSchema>;

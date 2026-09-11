import { z } from 'zod';
import { isValidVNPhone } from '@/lib/utils/formatters';

export const feedbackSchema = z.object({
  bookingCode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^(BK|HG)\d{12}$/, 'Mã chuyến đi không hợp lệ'),
  customerPhone: z
    .string()
    .trim()
    .refine(isValidVNPhone, {
      message: 'Số điện thoại không đúng định dạng',
    }),
  customerName: z.string().trim().optional(),
  rating: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  content: z
    .string()
    .trim()
    .min(5, 'Vui lòng chia sẻ ít nhất 5 ký tự về trải nghiệm của bạn')
    .max(1000, 'Nội dung nhận xét tối đa 1000 ký tự'),
  driverAttitude: z.number().min(1).max(5).optional(),
  vehicleCleanliness: z.number().min(1).max(5).optional(),
  punctuality: z.number().min(1).max(5).optional(),
});

export type FeedbackFormData = z.infer<typeof feedbackSchema>;

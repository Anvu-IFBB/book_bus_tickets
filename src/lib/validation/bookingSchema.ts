import { z } from 'zod';
import { isValidVNPhone } from '@/lib/utils/formatters';

const phoneValidator = z
  .string()
  .min(10, 'Số điện thoại phải có ít nhất 10 số')
  .max(12, 'Số điện thoại không quá 12 ký tự')
  .refine(isValidVNPhone, {
    message: 'Số điện thoại không đúng định dạng Việt Nam (VD: 0868680944)',
  });

// Schema đặt vé Limousine liên tỉnh
export const limousineBookingSchema = z
  .object({
    serviceType: z.literal('LIMOUSINE').default('LIMOUSINE'),
    customerName: z.string().trim().min(2, 'Vui lòng nhập họ và tên của bạn'),
    customerPhone: phoneValidator,
    customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
    departure: z.string().min(1, 'Vui lòng chọn điểm xuất phát'),
    destination: z.string().min(1, 'Vui lòng chọn điểm đến'),
    travelDate: z.string().min(1, 'Vui lòng chọn ngày khởi hành'),
    travelTime: z.string().min(1, 'Vui lòng chọn khung giờ đón'),
    returnDate: z.string().optional(),
    isRoundTrip: z.boolean().default(false),
    passengerCount: z
      .number({ message: 'Số lượng khách phải là số' })
      .int()
      .min(1, 'Tối thiểu 1 hành khách')
      .max(29, 'Tối đa 29 hành khách'),
    pickupAddress: z.string().trim().min(3, 'Vui lòng nhập địa chỉ đón cụ thể'),
    dropoffAddress: z.string().trim().min(3, 'Vui lòng nhập địa chỉ trả cụ thể'),
    note: z.string().max(500, 'Ghi chú không quá 500 ký tự').optional(),
  })
  .refine((data) => data.departure !== data.destination, {
    message: 'Điểm đón và điểm đến không được trùng nhau',
    path: ['destination'],
  });

// Schema đặt xe hợp đồng 5-29 chỗ
export const contractBookingSchema = z.object({
  serviceType: z.literal('CONTRACT').default('CONTRACT'),
  customerName: z.string().trim().min(2, 'Vui lòng nhập họ và tên'),
  customerPhone: phoneValidator,
  customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  seatCount: z.union([
    z.literal(5),
    z.literal(7),
    z.literal(11),
    z.literal(16),
    z.literal(29),
  ]),
  durationDays: z.number().int().min(1, 'Tối thiểu 1 ngày thuê').max(30, 'Tối đa 30 ngày'),
  departure: z.string().min(1, 'Vui lòng chọn tỉnh/thành xuất phát'),
  destination: z.string().min(1, 'Vui lòng nhập điểm đến'),
  travelDate: z.string().min(1, 'Vui lòng chọn ngày đón xe'),
  travelTime: z.string().min(1, 'Vui lòng chọn giờ đón'),
  pickupAddress: z.string().trim().min(3, 'Vui lòng nhập địa chỉ đón cụ thể'),
  dropoffAddress: z.string().trim().min(3, 'Vui lòng nhập địa chỉ trả/lộ trình'),
  note: z.string().max(500).optional(),
});

// Schema tạo đơn gửi hàng hóa
export const cargoBookingSchema = z.object({
  serviceType: z.literal('CARGO').default('CARGO'),
  senderName: z.string().trim().min(2, 'Vui lòng nhập tên người gửi'),
  senderPhone: phoneValidator,
  receiverName: z.string().trim().min(2, 'Vui lòng nhập tên người nhận'),
  receiverPhone: phoneValidator,
  departure: z.string().min(1, 'Vui lòng chọn nơi gửi'),
  destination: z.string().min(1, 'Vui lòng chọn nơi nhận'),
  pickupAddress: z.string().trim().min(3, 'Địa chỉ giao hàng cho xe'),
  dropoffAddress: z.string().trim().min(3, 'Địa chỉ nhận hàng'),
  cargoType: z.string().trim().min(2, 'Vui lòng ghi rõ loại hàng gửi'),
  quantity: z.number().min(1).default(1),
  estimatedWeightKg: z.number().min(0.1, 'Khối lượng phải lớn hơn 0').optional(),
  travelDate: z.string().min(1, 'Vui lòng chọn ngày gửi'),
  note: z.string().max(500).optional(),
});

// Schema đặt xe tour du lịch
export const tourBookingSchema = z.object({
  serviceType: z.literal('TOUR').default('TOUR'),
  customerName: z.string().trim().min(2, 'Vui lòng nhập họ và tên'),
  customerPhone: phoneValidator,
  customerEmail: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  tourDestination: z.string().trim().min(2, 'Vui lòng nhập khu du lịch (VD: Hạ Long, Tràng An)'),
  departure: z.string().min(1, 'Vui lòng chọn nơi xuất phát'),
  travelDate: z.string().min(1, 'Vui lòng chọn ngày đi'),
  returnDate: z.string().optional(),
  travelTime: z.string().min(1, 'Vui lòng chọn giờ đón'),
  passengerCount: z.number().int().min(1, 'Tối thiểu 1 hành khách'),
  pickupAddress: z.string().trim().min(3, 'Vui lòng nhập địa chỉ đón'),
  note: z.string().max(500).optional(),
});

export type LimousineBookingFormData = z.infer<typeof limousineBookingSchema>;
export type ContractBookingFormData = z.infer<typeof contractBookingSchema>;
export type CargoBookingFormData = z.infer<typeof cargoBookingSchema>;
export type TourBookingFormData = z.infer<typeof tourBookingSchema>;

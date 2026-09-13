import { z } from 'zod';
import { isValidVNPhone } from '@/lib/utils/formatters';

const phoneValidator = z
  .string()
  .min(10, 'Số điện thoại phải có ít nhất 10 số')
  .max(12, 'Số điện thoại không quá 12 ký tự')
  .refine(isValidVNPhone, {
    message: 'Số điện thoại không đúng định dạng Việt Nam (VD: 0912345678)',
  });

// Schema Biển số xe Việt Nam (VD: 14B-088.99, 14A-777.66, 29B-12345)
const licensePlateValidator = z
  .string()
  .trim()
  .min(7, 'Biển số xe quá ngắn (VD: 14B-088.99)')
  .max(15, 'Biển số xe quá dài')
  .regex(/^[0-9]{2}[A-Z]{1,2}-[0-9]{3,5}(\.[0-9]{2})?$/, 'Biển số xe không hợp lệ (VD: 14B-088.99, 14A-123.45)');

export const vehicleSchema = z.object({
  name: z.string().trim().min(3, 'Tên phương tiện tối thiểu 3 ký tự'),
  licensePlate: licensePlateValidator,
  seatCount: z.union([
    z.literal(5),
    z.literal(7),
    z.literal(11),
    z.literal(16),
    z.literal(29),
  ], { message: 'Số chỗ ngồi phải thuộc: 5, 7, 11, 16 hoặc 29 chỗ' }),
  vehicleType: z.string().trim().min(2, 'Vui lòng nhập loại xe (VD: DCar Limousine VIP)'),
  status: z.enum(['AVAILABLE', 'ASSIGNED', 'IN_SERVICE', 'MAINTENANCE', 'INACTIVE']).default('AVAILABLE'),
  note: z.string().trim().optional(),
});

export const updateVehicleSchema = vehicleSchema.partial();

export const driverSchema = z.object({
  name: z.string().trim().min(2, 'Họ tên tài xế tối thiểu 2 ký tự'),
  phone: phoneValidator,
  licenseNumber: z.string().trim().min(6, 'Số giấy phép lái xe tối thiểu 6 ký tự'),
  vehicleId: z.string().optional(),
  status: z.enum(['AVAILABLE', 'ACTIVE', 'ASSIGNED', 'ON_TRIP', 'OFF', 'OFF_DUTY', 'INACTIVE']).default('AVAILABLE'),
  note: z.string().trim().optional(),
});

export const updateDriverSchema = driverSchema.partial();

export const tripSchema = z.object({
  routeId: z.string().min(1, 'Vui lòng chọn tuyến đường'),
  route: z.string().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày khởi hành định dạng YYYY-MM-DD'),
  departureTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ khởi hành định dạng HH:mm'),
  arrivalTime: z.string().regex(/^\d{2}:\d{2}$/, 'Giờ đến dự kiến định dạng HH:mm').optional(),
  status: z.enum(['PLANNED', 'ASSIGNED', 'IN_PROGRESS', 'CONFIRMED', 'DEPARTED', 'COMPLETED', 'CANCELLED']).default('PLANNED'),
  bookingIds: z.array(z.string()).default([]),
  maxSeats: z.number().int().positive().default(11),
  bookedSeats: z.number().int().nonnegative().default(0),
  note: z.string().trim().optional(),
});

export const updateTripSchema = tripSchema.partial();

export const assignVehicleSchema = z.object({
  bookingId: z.string().min(1, 'Mã booking là bắt buộc'),
  vehicleId: z.string().min(1, 'Vui lòng chọn phương tiện'),
  changedBy: z.string().min(1, 'Thông tin người thao tác là bắt buộc'),
  note: z.string().optional(),
});

export const assignDriverSchema = z.object({
  bookingId: z.string().min(1, 'Mã booking là bắt buộc'),
  driverId: z.string().min(1, 'Vui lòng chọn tài xế'),
  changedBy: z.string().min(1, 'Thông tin người thao tác là bắt buộc'),
  note: z.string().optional(),
});

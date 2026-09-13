import { BookingStatus, BookingPaymentStatus } from '@/types/booking';
import { VehicleStatus, DriverStatus, TripStatus } from '@/types/fleet';
import { NegativeFeedbackStatus } from '@/types/feedback';

export const APP_CONFIG = {
  name: 'Limousine VIP Quảng Ninh - Ninh Bình',
  shortName: 'Limousine VIP',
  tagline: 'Chuyên nghiệp - Đúng giờ - Đón trả tận nơi',
  description:
    'Dịch vụ xe Limousine cao cấp tuyến Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình và ngược lại. Nhận gửi hàng hóa liên tỉnh, xe hợp đồng 5-29 chỗ, xe tour du lịch.',
  hotlines: ['0868680944', '0866834442'],
  hotlineDisplay: '0868.680.944 - 0866.834.442',
  primaryHotline: '0868680944',
  facebookName: 'Vũ Công Minh',
  facebookUrl: 'https://www.facebook.com',
  zaloUrl: 'https://zalo.me/0868680944',
  address: 'Bến xe Bãi Cháy - Hạ Long - Quảng Ninh',
  workingHours: '04:00 - 22:00 hàng ngày',
  feedbackDelayHours: 2,
};

export const PROVINCES = [
  'Quảng Ninh',
  'Hải Phòng',
  'Thái Bình',
  'Nam Định',
  'Ninh Bình',
  'Hà Nội',
  'Hải Dương',
  'Hưng Yên',
] as const;

export const DEFAULT_ROUTES = [
  {
    departure: 'Quảng Ninh',
    destination: 'Ninh Bình',
    distanceKm: 180,
    estimatedDurationHours: 3.5,
    basePrice: 280000,
  },
  {
    departure: 'Ninh Bình',
    destination: 'Quảng Ninh',
    distanceKm: 180,
    estimatedDurationHours: 3.5,
    basePrice: 280000,
  },
  {
    departure: 'Quảng Ninh',
    destination: 'Hải Phòng',
    distanceKm: 60,
    estimatedDurationHours: 1.2,
    basePrice: 150000,
  },
  {
    departure: 'Hải Phòng',
    destination: 'Thái Bình',
    distanceKm: 70,
    estimatedDurationHours: 1.5,
    basePrice: 160000,
  },
  {
    departure: 'Thái Bình',
    destination: 'Nam Định',
    distanceKm: 30,
    estimatedDurationHours: 0.8,
    basePrice: 120000,
  },
  {
    departure: 'Nam Định',
    destination: 'Ninh Bình',
    distanceKm: 40,
    estimatedDurationHours: 0.9,
    basePrice: 130000,
  },
];

export const VEHICLE_SEAT_OPTIONS = [
  { seats: 5, label: 'Xe 5 chỗ (Sedan/CUV sang trọng)' },
  { seats: 7, label: 'Xe 7 chỗ (MPV/SUV cao cấp)' },
  { seats: 11, label: 'Xe Limousine 11 chỗ VIP' },
  { seats: 16, label: 'Xe Limousine / Transit 16 chỗ' },
  { seats: 29, label: 'Xe du lịch 29 chỗ Universe' },
] as const;

export const BOOKING_STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; badgeClass: string; stepIndex: number }
> = {
  NEW: {
    label: 'Mới tiếp nhận',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    stepIndex: 1,
  },
  CONTACTING: {
    label: 'Đang liên hệ',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    stepIndex: 2,
  },
  CONFIRMED: {
    label: 'Đã xác nhận',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    stepIndex: 3,
  },
  ASSIGNED: {
    label: 'Đã phân xe & tài xế',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    stepIndex: 4,
  },
  DEPOSIT_PAID: {
    label: 'Đã đặt cọc',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    stepIndex: 4,
  },
  PAID: {
    label: 'Đã thanh toán',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    stepIndex: 5,
  },
  IN_PROGRESS: {
    label: 'Đang thực hiện',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    stepIndex: 6,
  },
  COMPLETED: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    stepIndex: 7,
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    stepIndex: 0,
  },
};

export const PAYMENT_STATUS_CONFIG: Record<
  BookingPaymentStatus,
  { label: string; badgeClass: string }
> = {
  UNPAID: { label: 'Chưa thanh toán', badgeClass: 'bg-slate-100 text-slate-700' },
  DEPOSIT_PAID: { label: 'Đã cọc một phần', badgeClass: 'bg-amber-100 text-amber-800' },
  PAID: { label: 'Đã thanh toán đủ', badgeClass: 'bg-emerald-100 text-emerald-800' },
  REFUNDED: { label: 'Đã hoàn tiền', badgeClass: 'bg-purple-100 text-purple-800' },
};

export const VEHICLE_STATUS_CONFIG: Record<
  VehicleStatus,
  { label: string; badgeClass: string }
> = {
  AVAILABLE: { label: 'Sẵn sàng đón khách', badgeClass: 'bg-emerald-100 text-emerald-800' },
  ASSIGNED: { label: 'Đã phân công', badgeClass: 'bg-blue-100 text-blue-800' },
  IN_SERVICE: { label: 'Đang chạy trên đường', badgeClass: 'bg-indigo-100 text-indigo-800' },
  MAINTENANCE: { label: 'Đang bảo dưỡng định kỳ', badgeClass: 'bg-amber-100 text-amber-800' },
  INACTIVE: { label: 'Ngừng hoạt động', badgeClass: 'bg-slate-200 text-slate-600' },
};

export const DRIVER_STATUS_CONFIG: Record<
  DriverStatus,
  { label: string; badgeClass: string }
> = {
  AVAILABLE: { label: 'Sẵn sàng nhận chuyến', badgeClass: 'bg-emerald-100 text-emerald-800' },
  ACTIVE: { label: 'Sẵn sàng nhận chuyến', badgeClass: 'bg-emerald-100 text-emerald-800' },
  ASSIGNED: { label: 'Đã phân công', badgeClass: 'bg-blue-100 text-blue-800' },
  ON_TRIP: { label: 'Đang trên hành trình', badgeClass: 'bg-indigo-100 text-indigo-800' },
  OFF: { label: 'Nghỉ ca / Nghỉ phép', badgeClass: 'bg-slate-100 text-slate-700' },
  OFF_DUTY: { label: 'Nghỉ ca / Nghỉ phép', badgeClass: 'bg-slate-100 text-slate-700' },
  INACTIVE: { label: 'Tạm ngừng công tác', badgeClass: 'bg-rose-100 text-rose-700' },
};

export const TRIP_STATUS_CONFIG: Record<
  TripStatus,
  { label: string; badgeClass: string }
> = {
  PLANNED: { label: 'Lên kế hoạch', badgeClass: 'bg-slate-100 text-slate-700' },
  ASSIGNED: { label: 'Đã phân xe & tài xế', badgeClass: 'bg-purple-100 text-purple-800' },
  IN_PROGRESS: { label: 'Đang di chuyển', badgeClass: 'bg-indigo-100 text-indigo-800' },
  CONFIRMED: { label: 'Đã chốt danh sách', badgeClass: 'bg-blue-100 text-blue-800' },
  DEPARTED: { label: 'Đã xuất bến', badgeClass: 'bg-cyan-100 text-cyan-800' },
  COMPLETED: { label: 'Đã đến nơi an toàn', badgeClass: 'bg-emerald-100 text-emerald-800' },
  CANCELLED: { label: 'Đã hủy chuyến', badgeClass: 'bg-rose-100 text-rose-700' },
};

export const FEEDBACK_STATUS_CONFIG: Record<
  NegativeFeedbackStatus,
  { label: string; badgeClass: string }
> = {
  NEW: { label: 'Chờ xử lý', badgeClass: 'bg-rose-100 text-rose-800' },
  IN_REVIEW: { label: 'Đang kiểm tra', badgeClass: 'bg-amber-100 text-amber-800' },
  CONTACTED: { label: 'Đã gọi điện xin lỗi/trao đổi', badgeClass: 'bg-blue-100 text-blue-800' },
  RESOLVED: { label: 'Đã giải quyết thỏa đáng', badgeClass: 'bg-emerald-100 text-emerald-800' },
  IGNORED: { label: 'Bỏ qua (Đánh giá spam)', badgeClass: 'bg-slate-200 text-slate-700' },
};

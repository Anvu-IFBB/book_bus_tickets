import React from 'react';
import { BookingFormData } from '../types';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Alert } from '@/components/ui';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Car,
  Package,
  FileText,
  ShieldCheck,
  Send,
} from 'lucide-react';

export interface Step4ReviewProps {
  formData: BookingFormData;
  isLoading: boolean;
  error?: string;
  onConfirm: () => void;
  onBack: () => void;
}

const SERVICE_LABELS: Record<string, string> = {
  LIMOUSINE: 'Vé Xe Ghép Limousine VIP',
  CONTRACT: 'Thuê Xe Hợp Đồng Riêng',
  CARGO: 'Gửi Hàng Hóa Hỏa Tốc',
  TOUR: 'Xe Đi Khu Du Lịch',
};

export const Step4Review: React.FC<Step4ReviewProps> = ({
  formData,
  isLoading,
  error,
  onConfirm,
  onBack,
}) => {
  const isCargo = formData.serviceType === 'CARGO';

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Bước 4: Kiểm Tra & Xác Nhận Đặt Chỗ
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Vui lòng rà soát lại toàn bộ thông tin trước khi gửi yêu cầu đến tổng đài điều hành
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Không thể tạo đặt chỗ">
          {error}
        </Alert>
      )}

      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-navy-950 text-white p-5 flex flex-row items-center justify-between">
          <div>
            <span className="text-[11px] text-gold-400 font-semibold uppercase tracking-wider block">
              Loại hình dịch vụ
            </span>
            <CardTitle className="text-lg sm:text-xl text-white mt-0.5">
              {SERVICE_LABELS[formData.serviceType] || formData.serviceType}
            </CardTitle>
          </div>
          <Badge variant="gold" size="sm">
            Chờ Tiếp Nhận
          </Badge>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6 text-sm divide-y divide-slate-100">
          {/* LỘ TRÌNH & THỜI GIAN */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Lộ Trình & Thời Gian Di Chuyển
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Tuyến hành trình:</span>
                  <span className="font-bold text-navy-950 text-base">
                    {formData.departure} ⇄ {formData.destination}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-slate-500 block">Thời gian đón dự kiến:</span>
                  <span className="font-bold text-navy-950">
                    {formData.travelTime} — Ngày {formData.travelDate}
                  </span>
                </div>
              </div>

              {formData.isRoundTrip && formData.returnDate && (
                <div className="flex items-start gap-2.5 sm:col-span-2 p-2.5 rounded-lg bg-slate-50 text-xs">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-800">Chuyến khứ hồi:</span> Ngày về dự kiến {formData.returnDate}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CHI TIẾT DỊCH VỤ */}
          <div className="space-y-3 pt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Chi Tiết Phương Tiện & Hành Khách
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {formData.serviceType === 'LIMOUSINE' && (
                <div className="flex items-center gap-2.5">
                  <Car className="w-4 h-4 text-navy-800 shrink-0" />
                  <div>
                    <span className="text-xs text-slate-500 block">Số lượng vé ghế VIP:</span>
                    <span className="font-bold text-navy-950">{formData.passengerCount} hành khách</span>
                  </div>
                </div>
              )}

              {formData.serviceType === 'CONTRACT' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <Car className="w-4 h-4 text-navy-800 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Loại xe hợp đồng:</span>
                      <span className="font-bold text-navy-950">Xe {formData.seatCount} chỗ</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-navy-800 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Thời hạn hợp đồng:</span>
                      <span className="font-bold text-navy-950">{formData.durationDays} ngày</span>
                    </div>
                  </div>
                </>
              )}

              {formData.serviceType === 'CARGO' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Mặt hàng vận chuyển:</span>
                      <span className="font-bold text-navy-950">{formData.cargoType}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Số lượng kiện:</span>
                      <span className="font-bold text-navy-950">{formData.cargoQuantity || 1} kiện</span>
                    </div>
                  </div>
                </>
              )}

              {formData.serviceType === 'TOUR' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Khu du lịch tham quan:</span>
                      <span className="font-bold text-navy-950">{formData.tourDestination}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-gold-600 shrink-0" />
                    <div>
                      <span className="text-xs text-slate-500 block">Số người tham gia đoàn:</span>
                      <span className="font-bold text-navy-950">{formData.passengerCount} người</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ĐỊA CHỈ & THÔNG TIN LIÊN HỆ */}
          <div className="space-y-3 pt-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isCargo ? '3. Thông Tin Giao Nhận Bưu Kiện' : '3. Thông Tin Khách Hàng & Điểm Đón Tận Nơi'}
            </div>

            {isCargo ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-navy-950">Người gửi: {formData.senderName}</div>
                  <div>SĐT: <strong>{formData.senderPhone}</strong></div>
                  <div>Địa chỉ đón hàng: {formData.pickupAddress}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-navy-950">Người nhận: {formData.receiverName}</div>
                  <div>SĐT: <strong>{formData.receiverPhone}</strong></div>
                  <div>Địa chỉ trả hàng: {formData.dropoffAddress}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Họ và tên khách:</span>
                    <span className="font-bold text-navy-950">{formData.customerName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Số điện thoại:</span>
                    <span className="font-bold text-navy-950">{formData.customerPhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Điểm đón tận nơi:</span>
                    <span className="font-medium text-slate-800">{formData.pickupAddress}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-500 block">Điểm trả tận nơi:</span>
                    <span className="font-medium text-slate-800">{formData.dropoffAddress}</span>
                  </div>
                </div>
              </div>
            )}

            {formData.note && (
              <div className="pt-2 text-xs text-slate-600 flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-navy-950">Ghi chú:</span> {formData.note}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong>Cam kết giữ chỗ:</strong> Ngay sau khi bấm xác nhận, hệ thống sẽ tự động tạo đơn và chuyển đến điều hành viên để bảo lưu chỗ ngồi cho bạn. Lái xe sẽ gọi điện xác nhận trước giờ đón.
        </div>
      </div>

      <div className="pt-2 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          disabled={isLoading}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Quay Lại Sửa
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onConfirm}
          isLoading={isLoading}
          rightIcon={<Send className="w-4 h-4" />}
        >
          {isLoading ? 'Đang Xử Lý Đặt Chỗ...' : 'Xác Nhận Đặt Ngay'}
        </Button>
      </div>
    </div>
  );
};

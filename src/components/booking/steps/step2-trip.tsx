import React, { useState } from 'react';
import { BookingFormData } from '../types';
import { Input, Select, Button, Alert, Checkbox } from '@/components/ui';
import { PROVINCES, VEHICLE_SEAT_OPTIONS } from '@/lib/constants/config';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Users, Package, Car } from 'lucide-react';

export interface Step2TripProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TIME_OPTIONS = [
  { value: '04:00', label: '04:00 Sáng (Chuyến sớm)' },
  { value: '05:00', label: '05:00 Sáng' },
  { value: '06:00', label: '06:00 Sáng' },
  { value: '07:00', label: '07:00 Sáng' },
  { value: '08:00', label: '08:00 Sáng' },
  { value: '09:00', label: '09:00 Sáng' },
  { value: '10:00', label: '10:00 Sáng' },
  { value: '11:00', label: '11:00 Trưa' },
  { value: '12:00', label: '12:00 Trưa' },
  { value: '13:00', label: '13:00 Chiều' },
  { value: '14:00', label: '14:00 Chiều' },
  { value: '15:00', label: '15:00 Chiều' },
  { value: '16:00', label: '16:00 Chiều' },
  { value: '17:00', label: '17:00 Chiều' },
  { value: '18:00', label: '18:00 Tối' },
  { value: '19:00', label: '19:00 Tối' },
  { value: '20:00', label: '20:00 Tối' },
  { value: '21:00', label: '21:00 Tối (Chuyến muộn)' },
];

export const Step2Trip: React.FC<Step2TripProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState('');
  const todayStr = new Date().toISOString().slice(0, 10);

  const provinceOptions = PROVINCES.map((p) => ({ value: p, label: p }));

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Common validations
    if (!formData.departure) {
      setError('Vui lòng chọn nơi xuất phát');
      return;
    }

    if (!formData.destination && formData.serviceType !== 'TOUR') {
      setError('Vui lòng chọn hoặc nhập nơi đến');
      return;
    }

    if (formData.departure === formData.destination) {
      setError('Nơi xuất phát và nơi đến không được trùng nhau');
      return;
    }

    if (!formData.travelDate) {
      setError('Vui lòng chọn ngày khởi hành');
      return;
    }

    if (formData.travelDate < todayStr) {
      setError('Ngày khởi hành không được ở trong quá khứ');
      return;
    }

    if (!formData.travelTime) {
      setError('Vui lòng chọn giờ khởi hành');
      return;
    }

    // Service specific validations
    if (formData.serviceType === 'CARGO') {
      if (!formData.cargoType || formData.cargoType.trim().length < 2) {
        setError('Vui lòng nhập rõ loại hàng hóa cần gửi');
        return;
      }
    }

    if (formData.serviceType === 'TOUR') {
      if (!formData.tourDestination || formData.tourDestination.trim().length < 2) {
        setError('Vui lòng nhập điểm tham quan / khu du lịch cần đến');
        return;
      }
    }

    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Bước 2: Thông Tin Lộ Trình & Thời Gian
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {formData.serviceType === 'LIMOUSINE' && 'Đăng ký tuyến đường và thời gian đón xe Limousine VIP'}
          {formData.serviceType === 'CONTRACT' && 'Chọn dòng xe từ 5 đến 29 chỗ và lộ trình thuê hợp đồng'}
          {formData.serviceType === 'CARGO' && 'Khai báo lộ trình vận chuyển và thông tin kiện hàng hóa'}
          {formData.serviceType === 'TOUR' && 'Chọn địa điểm xuất phát và khu du lịch bạn muốn ghé thăm'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Lưu ý thông tin">
          {error}
        </Alert>
      )}

      {/* 1. CONTRACT SPECIFIC: VEHICLE SELECTION */}
      {formData.serviceType === 'CONTRACT' && (
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Car className="w-4 h-4 text-navy-800" />
            Dòng Xe Hợp Đồng Mong Muốn *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {VEHICLE_SEAT_OPTIONS.map((opt) => {
              const isSelected = formData.seatCount === opt.seats;
              return (
                <div
                  key={opt.seats}
                  onClick={() => updateFormData({ seatCount: opt.seats as 5 | 7 | 11 | 16 | 29 })}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-gold-500 bg-gold-50/60 font-bold text-navy-950 ring-2 ring-gold-400/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-lg font-black">{opt.seats} Chỗ</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{opt.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ROUTE: DEPARTURE & DESTINATION */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Điểm xuất phát *"
          value={formData.departure}
          onChange={(e) => updateFormData({ departure: e.target.value })}
          options={provinceOptions}
          required
        />

        {formData.serviceType === 'TOUR' ? (
          <Input
            label="Khu du lịch / Điểm đến mong muốn *"
            placeholder="Ví dụ: Vịnh Hạ Long, Tràng An, Tam Chúc..."
            value={formData.tourDestination || ''}
            onChange={(e) =>
              updateFormData({
                tourDestination: e.target.value,
                destination: e.target.value,
              })
            }
            required
            leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
          />
        ) : (
          <Select
            label="Điểm đến *"
            value={formData.destination}
            onChange={(e) => updateFormData({ destination: e.target.value })}
            options={provinceOptions}
            required
          />
        )}
      </div>

      {/* 3. DATE & TIME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Ngày khởi hành *"
          type="date"
          min={todayStr}
          value={formData.travelDate}
          onChange={(e) => updateFormData({ travelDate: e.target.value })}
          required
          leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
        />

        <Select
          label="Khung giờ đón mong muốn *"
          value={formData.travelTime}
          onChange={(e) => updateFormData({ travelTime: e.target.value })}
          options={TIME_OPTIONS}
          required
        />
      </div>

      {/* 4. SERVICE-SPECIFIC EXTRA FIELDS */}
      {formData.serviceType === 'LIMOUSINE' && (
        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Số lượng ghế đặt *"
              value={String(formData.passengerCount)}
              onChange={(e) => updateFormData({ passengerCount: Number(e.target.value) })}
              options={[
                { value: '1', label: '1 Hành khách (1 ghế)' },
                { value: '2', label: '2 Hành khách (2 ghế)' },
                { value: '3', label: '3 Hành khách (3 ghế)' },
                { value: '4', label: '4 Hành khách' },
                { value: '5', label: '5 Hành khách' },
                { value: '6', label: '6 Hành khách' },
                { value: '7', label: '7 Hành khách' },
                { value: '8', label: '8 Hành khách' },
                { value: '9', label: 'Bao cả khoang 9-11 ghế VIP' },
              ]}
            />

            <div className="flex items-center pt-6">
              <Checkbox
                label="Đăng ký chuyến khứ hồi (Cả đi và về)"
                checked={formData.isRoundTrip || false}
                onChange={(e) => updateFormData({ isRoundTrip: e.target.checked })}
              />
            </div>
          </div>

          {formData.isRoundTrip && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <Input
                label="Ngày về dự kiến"
                type="date"
                min={formData.travelDate || todayStr}
                value={formData.returnDate || ''}
                onChange={(e) => updateFormData({ returnDate: e.target.value })}
                leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
              />
            </div>
          )}
        </div>
      )}

      {/* CONTRACT EXTRAS */}
      {formData.serviceType === 'CONTRACT' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số ngày thuê dự kiến *"
            type="number"
            min={1}
            max={30}
            value={String(formData.durationDays || 1)}
            onChange={(e) => updateFormData({ durationDays: Number(e.target.value) })}
            required
          />
          <Input
            label="Ngày kết thúc hợp đồng (tùy chọn)"
            type="date"
            min={formData.travelDate || todayStr}
            value={formData.returnDate || ''}
            onChange={(e) => updateFormData({ returnDate: e.target.value })}
          />
        </div>
      )}

      {/* CARGO EXTRAS */}
      {formData.serviceType === 'CARGO' && (
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5">
            <Package className="w-4 h-4 text-gold-600" />
            Chi Tiết Kiện Hàng Vận Chuyển
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <Input
                label="Loại hàng hóa *"
                placeholder="Ví dụ: Hồ sơ giấy tờ, Thùng hải sản, Hàng gia dụng..."
                value={formData.cargoType || ''}
                onChange={(e) => updateFormData({ cargoType: e.target.value })}
                required
              />
            </div>
            <div>
              <Input
                label="Số lượng kiện"
                type="number"
                min={1}
                value={String(formData.cargoQuantity || 1)}
                onChange={(e) => updateFormData({ cargoQuantity: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
      )}

      {/* TOUR EXTRAS */}
      {formData.serviceType === 'TOUR' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Số lượng khách tham gia tour *"
            type="number"
            min={1}
            max={100}
            value={String(formData.passengerCount)}
            onChange={(e) => updateFormData({ passengerCount: Number(e.target.value) })}
            required
            leftIcon={<Users className="w-4 h-4 text-slate-400" />}
          />
          <Input
            label="Ngày về dự kiến (Tour trọn gói)"
            type="date"
            min={formData.travelDate || todayStr}
            value={formData.returnDate || ''}
            onChange={(e) => updateFormData({ returnDate: e.target.value })}
            leftIcon={<Calendar className="w-4 h-4 text-slate-400" />}
          />
        </div>
      )}

      <div className="p-3.5 rounded-xl bg-gold-50/80 border border-gold-200 text-xs text-slate-700">
        * Giá cước sẽ được xác nhận cụ thể theo vị trí đón/trả tận nơi thực tế khi điều hành viên liên hệ.
      </div>

      <div className="pt-4 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
        >
          Quay Lại
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Tiếp Tục Điền Người Đặt
        </Button>
      </div>
    </form>
  );
};

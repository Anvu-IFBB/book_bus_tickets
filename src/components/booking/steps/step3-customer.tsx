import React, { useState } from 'react';
import { BookingFormData } from '../types';
import { Input, Textarea, Button, Alert } from '@/components/ui';
import { isValidVNPhone } from '@/lib/utils/formatters';
import { ArrowLeft, ArrowRight, User, Phone, Mail, MapPin, Package } from 'lucide-react';

export interface Step3CustomerProps {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const Step3Customer: React.FC<Step3CustomerProps> = ({
  formData,
  updateFormData,
  onNext,
  onBack,
}) => {
  const [error, setError] = useState('');

  const isCargo = formData.serviceType === 'CARGO';

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isCargo) {
      if (!formData.senderName || formData.senderName.trim().length < 2) {
        setError('Vui lòng điền họ tên người gửi hàng');
        return;
      }
      if (!formData.senderPhone || !isValidVNPhone(formData.senderPhone)) {
        setError('Số điện thoại người gửi không đúng định dạng Việt Nam (VD: 0868680944)');
        return;
      }
      if (!formData.pickupAddress || formData.pickupAddress.trim().length < 3) {
        setError('Vui lòng nhập địa chỉ gửi hàng chi tiết');
        return;
      }

      if (!formData.receiverName || formData.receiverName.trim().length < 2) {
        setError('Vui lòng điền họ tên người nhận hàng');
        return;
      }
      if (!formData.receiverPhone || !isValidVNPhone(formData.receiverPhone)) {
        setError('Số điện thoại người nhận không đúng định dạng Việt Nam (VD: 0868680944)');
        return;
      }
      if (!formData.dropoffAddress || formData.dropoffAddress.trim().length < 3) {
        setError('Vui lòng nhập địa chỉ nhận hàng chi tiết');
        return;
      }

      // Sync customerName and customerPhone to sender
      updateFormData({
        customerName: formData.senderName,
        customerPhone: formData.senderPhone,
      });
    } else {
      if (!formData.customerName || formData.customerName.trim().length < 2) {
        setError('Vui lòng điền họ và tên của bạn');
        return;
      }
      if (!formData.customerPhone || !isValidVNPhone(formData.customerPhone)) {
        setError('Số điện thoại liên hệ không hợp lệ (VD: 0868680944)');
        return;
      }
      if (!formData.pickupAddress || formData.pickupAddress.trim().length < 3) {
        setError('Vui lòng nhập địa chỉ đón cụ thể (Số nhà, tên đường, khu vực)');
        return;
      }
      if (!formData.dropoffAddress || formData.dropoffAddress.trim().length < 3) {
        setError('Vui lòng nhập địa chỉ trả / điểm đến cụ thể');
        return;
      }
    }

    onNext();
  };

  return (
    <form onSubmit={handleContinue} className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          {isCargo ? 'Bước 3: Thông Tin Người Gửi & Người Nhận' : 'Bước 3: Thông Tin Khách Hàng & Điểm Đón'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          {isCargo
            ? 'Vui lòng cung cấp chính xác số điện thoại và địa chỉ để giao nhận bưu phẩm'
            : 'Tổng đài viên và lái xe sẽ liên hệ trước khi đến đón theo thông tin này'}
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Vui lòng kiểm tra lại">
          {error}
        </Alert>
      )}

      {isCargo ? (
        /* CARGO SENDER & RECEIVER COLUMNS */
        <div className="space-y-6">
          {/* SENDER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Package className="w-4 h-4 text-gold-600" />
              1. Thông Tin Người Gửi Hàng
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên người gửi *"
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.senderName || ''}
                onChange={(e) => updateFormData({ senderName: e.target.value })}
                required
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="Số điện thoại người gửi *"
                type="tel"
                placeholder="Ví dụ: 0868680944"
                value={formData.senderPhone || ''}
                onChange={(e) => updateFormData({ senderPhone: e.target.value })}
                required
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <Input
              label="Địa chỉ giao hàng cho xe *"
              placeholder="Ví dụ: Cổng Bến xe Bãi Cháy, số 12 Lê Thánh Tông..."
              value={formData.pickupAddress}
              onChange={(e) => updateFormData({ pickupAddress: e.target.value })}
              required
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {/* RECEIVER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Package className="w-4 h-4 text-blue-600" />
              2. Thông Tin Người Nhận Hàng
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Họ và tên người nhận *"
                placeholder="Ví dụ: Trần Thị B"
                value={formData.receiverName || ''}
                onChange={(e) => updateFormData({ receiverName: e.target.value })}
                required
                leftIcon={<User className="w-4 h-4 text-slate-400" />}
              />
              <Input
                label="Số điện thoại người nhận *"
                type="tel"
                placeholder="Ví dụ: 0866834442"
                value={formData.receiverPhone || ''}
                onChange={(e) => updateFormData({ receiverPhone: e.target.value })}
                required
                leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <Input
              label="Địa chỉ nhận hàng *"
              placeholder="Ví dụ: Số 45 Trần Hưng Đạo, TP Ninh Bình..."
              value={formData.dropoffAddress}
              onChange={(e) => updateFormData({ dropoffAddress: e.target.value })}
              required
              leftIcon={<MapPin className="w-4 h-4 text-slate-400" />}
            />
          </div>
        </div>
      ) : (
        /* PASSENGER / CONTRACT / TOUR CUSTOMER FIELDS */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Họ và tên khách hàng *"
              placeholder="Ví dụ: Nguyễn Văn A"
              value={formData.customerName}
              onChange={(e) => updateFormData({ customerName: e.target.value })}
              required
              leftIcon={<User className="w-4 h-4 text-slate-400" />}
            />
            <Input
              label="Số điện thoại liên hệ *"
              type="tel"
              placeholder="Ví dụ: 0868680944"
              value={formData.customerPhone}
              onChange={(e) => updateFormData({ customerPhone: e.target.value })}
              required
              leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <Input
            label="Email nhận xác nhận (không bắt buộc)"
            type="email"
            placeholder="email@example.com"
            value={formData.customerEmail || ''}
            onChange={(e) => updateFormData({ customerEmail: e.target.value })}
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <Input
              label="Địa chỉ đón tận nơi cụ thể *"
              placeholder="Số nhà, ngõ/đường, khách sạn, phường..."
              value={formData.pickupAddress}
              onChange={(e) => updateFormData({ pickupAddress: e.target.value })}
              required
              leftIcon={<MapPin className="w-4 h-4 text-emerald-600" />}
            />
            <Input
              label="Địa chỉ trả tận nơi cụ thể *"
              placeholder="Số nhà, đường, điểm du lịch, resort..."
              value={formData.dropoffAddress}
              onChange={(e) => updateFormData({ dropoffAddress: e.target.value })}
              required
              leftIcon={<MapPin className="w-4 h-4 text-blue-600" />}
            />
          </div>
        </div>
      )}

      {/* ADDITIONAL NOTES */}
      <Textarea
        label="Ghi chú thêm cho lái xe & điều hành viên (tùy chọn)"
        placeholder="Ví dụ: Có người già đi cùng, cần xe ghế đầu, mang vali to, cần xuất hóa đơn VAT..."
        rows={3}
        value={formData.note || ''}
        onChange={(e) => updateFormData({ note: e.target.value })}
      />

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
          Xem Lại Thông Tin
        </Button>
      </div>
    </form>
  );
};

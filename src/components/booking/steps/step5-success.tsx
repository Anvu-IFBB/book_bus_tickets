import React, { useState } from 'react';
import Link from 'next/link';
import { Booking } from '@/types/booking';

import { SystemSettings } from '@/types/automation';
import { getPaymentByBookingIdAction, getSystemSettingsAction, PublicPaymentSummary } from '@/app/actions/clientQueries';
import { Card, CardContent, Button, Badge } from '@/components/ui';
import { APP_CONFIG, BOOKING_STATUS_CONFIG } from '@/lib/constants/config';
import {
  CheckCircle2,
  Copy,
  Check,
  Search,
  Phone,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

export interface Step5SuccessProps {
  booking: Booking;
  onReset: () => void;
}

export const Step5Success: React.FC<Step5SuccessProps> = ({ booking, onReset }) => {
  const [copied, setCopied] = useState(false);
  const [payment, setPayment] = useState<PublicPaymentSummary | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isNotifying, setIsNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [payRes, setRes] = await Promise.all([
          getPaymentByBookingIdAction(booking.id),
          getSystemSettingsAction()
        ]);
        if (payRes.success && payRes.data) {
          setPayment(payRes.data);
        }
        if (setRes.success && setRes.data) {
          setSettings(setRes.data as SystemSettings);
        }
      } catch (err) {
        console.error('Failed to load payment or settings', err);
      }
    };
    fetchData();
  }, [booking.id]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.bookingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isCargo = booking.serviceType === 'CARGO';

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* SUCCESS HEADER */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <Badge variant="navy" size="md">
          Đặt Yêu Cầu Thành Công
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
          Cảm Ơn Quý Khách Đã Đặt Chuyến!
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Yêu cầu của bạn đã được ghi nhận trên hệ thống. Nhân viên điều hành xe sẽ gọi điện tới số điện thoại đăng ký trong ít phút để xác nhận lại.
        </p>
      </div>

      {/* REAL BOOKING CODE CARD */}
      <Card className="border-gold-500/40 shadow-lg bg-gradient-to-b from-white to-gold-50/20">
        <CardContent className="p-6 text-center space-y-4">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold block">
              MÃ ĐƠN XE CHÍNH THỨC
            </span>
            <div className="text-2xl sm:text-4xl font-black text-navy-950 tracking-wider mt-1 select-all font-mono">
              {booking.bookingCode}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              (Lưu lại mã này để tra cứu lộ trình hoặc thông báo cho điều hành viên khi cần hỗ trợ)
            </p>
          </div>

          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Đã Sao Chép Mã' : 'Sao Chép Mã Booking'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* BOOKING DETAILS SUMMARY */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 text-xs sm:text-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-slate-500">Trạng thái tiếp nhận:</span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
              BOOKING_STATUS_CONFIG[booking.bookingStatus]?.badgeClass || 'bg-slate-100 text-slate-700'
            }`}
          >
            {BOOKING_STATUS_CONFIG[booking.bookingStatus]?.label || booking.bookingStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">Lộ trình:</span>
              <span className="font-bold text-navy-950">
                {booking.departure} ⇄ {booking.destination}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">Thời gian:</span>
              <span className="font-bold text-navy-950">
                {booking.travelTime} — Ngày {booking.travelDate}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">
                {isCargo ? 'Người gửi hàng:' : 'Khách hàng:'}
              </span>
              <span className="font-bold text-navy-950">
                {isCargo && booking.cargoDetails
                  ? `${booking.cargoDetails.senderName} (${booking.cargoDetails.senderPhone})`
                  : `${booking.pickupAddress ? 'Đã liên kết tài khoản' : ''}`}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">Dịch vụ:</span>
              <span className="font-bold text-navy-950">{booking.serviceType}</span>
            </div>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">Điểm đón:</span>
              <span className="font-medium text-slate-800">{booking.pickupAddress}</span>
            </div>
          </div>

          <div className="sm:col-span-2 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-slate-500 block">Điểm trả:</span>
              <span className="font-medium text-slate-800">{booking.dropoffAddress}</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAYMENT & QR SECTION */}
      {payment && settings?.bankCode && settings?.bankAccountNumber && (
        <Card className="border-emerald-500/30 shadow-md overflow-hidden">
          <div className="bg-emerald-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
            <h3 className="font-bold text-emerald-800 flex items-center gap-2">
              Thông Tin Thanh Toán
            </h3>
            <Badge variant="navy">{payment.status}</Badge>
          </div>
          <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tổng tiền:</span>
                <span className="font-bold">{payment.totalAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Đã thanh toán (Cọc):</span>
                <span className="font-bold text-emerald-600">{payment.paidAmount.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-700 font-medium">Số tiền cần thanh toán:</span>
                <span className="font-black text-lg text-red-600">
                  {payment.remainingAmount > 0 ? payment.remainingAmount.toLocaleString() : 0} VNĐ
                </span>
              </div>

              {payment.remainingAmount > 0 && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm space-y-2">
                  <p><span className="text-slate-500">Ngân hàng:</span> <strong className="ml-1">{settings.bankCode}</strong></p>
                  <p><span className="text-slate-500">Số tài khoản:</span> <strong className="ml-1">{settings.bankAccountNumber}</strong></p>
                  <p><span className="text-slate-500">Chủ tài khoản:</span> <strong className="ml-1">{settings.bankAccountName}</strong></p>
                  <p><span className="text-slate-500">Nội dung CK:</span> <strong className="ml-1">{booking.bookingCode}</strong></p>
                </div>
              )}

              {payment.remainingAmount > 0 && (
                <Button 
                  variant={notified ? "outline" : "primary"}
                  fullWidth
                  disabled={isNotifying || notified}
                  onClick={() => {
                    setIsNotifying(true);
                    setTimeout(() => {
                      setIsNotifying(false);
                      setNotified(true);
                      alert('Cảm ơn bạn! Chúng tôi đã ghi nhận thông báo chuyển khoản và sẽ kiểm tra trong ít phút.');
                    }, 800);
                  }}
                >
                  {isNotifying ? 'Đang gửi...' : (notified ? 'Đã Gửi Thông Báo' : 'Tôi Đã Chuyển Khoản')}
                </Button>
              )}
            </div>

            {payment.remainingAmount > 0 && (
              <div className="flex flex-col items-center justify-center space-y-2 border-l-0 md:border-l md:border-slate-100 md:pl-6">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Quét mã QR để thanh toán</p>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={`https://img.vietqr.io/image/${settings.bankCode}-${settings.bankAccountNumber}-compact.png?amount=${payment.remainingAmount}&addInfo=${booking.bookingCode}&accountName=${encodeURIComponent(settings.bankAccountName || '')}`} 
                    alt="VietQR"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  Mở ứng dụng ngân hàng và quét mã để điền tự động số tiền & nội dung
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <Link href="/tra-cuu" className="flex-1">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            leftIcon={<Search className="w-4 h-4" />}
          >
            Tra Cứu Lại Đơn Xe
          </Button>
        </Link>

        <a href={`tel:${APP_CONFIG.primaryHotline}`} className="flex-1">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<Phone className="w-4 h-4 text-gold-600" />}
          >
            Tổng Đài: {APP_CONFIG.hotlines[0]}
          </Button>
        </a>

        <Button
          variant="ghost"
          size="lg"
          onClick={onReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          Đặt Thêm Chuyến Khác
        </Button>
      </div>
    </div>
  );
};

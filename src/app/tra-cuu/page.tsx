'use client';

import React, { useState } from 'react';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import {
  Container,
  Section,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Button,
  Alert,
  Badge,
} from '@/components/ui';
import {
  Search,
  Phone,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Car,
} from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';
import { BOOKING_STATUS_CONFIG, PAYMENT_STATUS_CONFIG, APP_CONFIG } from '@/lib/constants/config';
import { formatCurrencyVN } from '@/lib/utils/formatters';

type SearchState = 'idle' | 'loading' | 'success' | 'notFound' | 'invalid' | 'error';

export default function TrackingPage() {
  const [bookingCode, setBookingCode] = useState('');
  const [phone, setPhone] = useState('');
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setBookingResult(null);

    const cleanCode = bookingCode.trim().toUpperCase();
    const cleanPhone = phone.trim();

    // Validation
    if (!cleanCode || !cleanPhone) {
      setSearchState('invalid');
      setErrorMessage('Vui lòng nhập đầy đủ cả Mã booking và Số điện thoại đăng ký.');
      return;
    }

    if (cleanPhone.length < 9 || cleanPhone.length > 11) {
      setSearchState('invalid');
      setErrorMessage('Số điện thoại không hợp lệ. Vui lòng nhập số từ 9 đến 11 chữ số.');
      return;
    }

    setSearchState('loading');

    try {
      // Safe call via BookingService (Phase 1 architecture)
      const found = await bookingService.lookupBooking(cleanCode, cleanPhone);

      if (!found) {
        setSearchState('notFound');
        setErrorMessage(
          'Không tìm thấy thông tin đơn hoặc số điện thoại không khớp với mã đơn. Vui lòng kiểm tra lại chính xác!'
        );
      } else {
        setBookingResult(found);
        setSearchState('success');
      }
    } catch {
      setSearchState('error');
      setErrorMessage('Đã xảy ra lỗi trong quá trình kết nối tra cứu. Vui lòng thử lại sau giây lát!');
    }
  };

  const handleReset = () => {
    setBookingCode('');
    setPhone('');
    setBookingResult(null);
    setSearchState('idle');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="md" className="relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="md" className="relative z-10 space-y-3">
            <Badge variant="gold">Tra Cứu Trực Tuyến</Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Kiểm Tra Lịch Trình & Tiến Trình Đơn Xe
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Nhập mã đặt chỗ (BK...) hoặc mã vận đơn chuyển phát (HG...) cùng số điện thoại đăng ký để xem chi tiết trạng thái chuyến đi.
            </p>
          </Container>
        </Section>

        {/* Search Container */}
        <Section spacing="lg">
          <Container size="md">
            <Card className="max-w-xl mx-auto shadow-xl border-slate-200">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center mx-auto mb-2">
                  <Search className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-navy-950">
                  Thông Tin Tra Cứu
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-slate-500">
                  Hệ thống bảo mật thông tin hành khách qua 2 yếu tố xác thực (Mã đơn + Số điện thoại)
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5">
                <form onSubmit={handleSearch} className="space-y-4">
                  <Input
                    label="Mã đặt chỗ / Vận đơn (BK... hoặc HG...)"
                    placeholder="Ví dụ: BK202609110001"
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    required
                    leftIcon={<Car className="w-4 h-4 text-slate-400" />}
                  />

                  <Input
                    label="Số điện thoại đăng ký đặt chỗ"
                    type="tel"
                    placeholder="Ví dụ: 0868680944"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    leftIcon={<Phone className="w-4 h-4 text-slate-400" />}
                  />

                  {/* Invalid / Not Found / Error States */}
                  {(searchState === 'invalid' ||
                    searchState === 'notFound' ||
                    searchState === 'error') && (
                    <Alert
                      variant="danger"
                      title={
                        searchState === 'notFound'
                          ? 'Không tìm thấy dữ liệu'
                          : searchState === 'invalid'
                          ? 'Dữ liệu không hợp lệ'
                          : 'Lỗi hệ thống'
                      }
                    >
                      {errorMessage}
                    </Alert>
                  )}

                  <div className="flex gap-2.5 pt-1">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      isLoading={searchState === 'loading'}
                      leftIcon={<Search className="w-4 h-4" />}
                    >
                      {searchState === 'loading' ? 'Đang Kiểm Tra...' : 'Tra Cứu Tiến Trình'}
                    </Button>
                    {(bookingResult || searchState !== 'idle') && (
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={handleReset}
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                      >
                        Nhập Lại
                      </Button>
                    )}
                  </div>
                </form>

                {/* Idle State Guidance */}
                {searchState === 'idle' && (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                    <div className="font-bold text-navy-950 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-gold-600" />
                      Làm thế nào để lấy mã tra cứu?
                    </div>
                    <ul className="space-y-1 list-disc list-inside text-slate-500">
                      <li>Mã đặt chỗ (bắt đầu bằng BK...) được nhân viên tổng đài cung cấp qua tin nhắn xác nhận.</li>
                      <li>Mã gửi hàng (bắt đầu bằng HG...) được ghi trên biên nhận khi gửi bưu phẩm.</li>
                      <li>Nếu quên mã, vui lòng gọi trực tiếp hotline để được hỗ trợ nhanh nhất.</li>
                    </ul>
                  </div>
                )}

                {/* Success State Result Display */}
                {searchState === 'success' && bookingResult && (
                  <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                          Mã Đơn
                        </span>
                        <div className="text-xl font-black text-navy-950">
                          {bookingResult.bookingCode}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">Trạng thái</span>
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${
                            BOOKING_STATUS_CONFIG[bookingResult.bookingStatus]?.badgeClass ||
                            'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {BOOKING_STATUS_CONFIG[bookingResult.bookingStatus]?.label ||
                            bookingResult.bookingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-xs">Loại dịch vụ</span>
                        <span className="font-bold text-navy-950">{bookingResult.serviceType}</span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-xs">Thời gian khởi hành</span>
                        <span className="font-bold text-navy-950">
                          {bookingResult.travelTime} ngày {bookingResult.travelDate}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 sm:col-span-2">
                        <span className="text-slate-500 block text-xs">Lộ trình di chuyển</span>
                        <span className="font-bold text-navy-950 text-base">
                          {bookingResult.departure} ⇄ {bookingResult.destination}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200 sm:col-span-2">
                        <span className="text-slate-500 block text-xs">Điểm đón / trả thỏa thuận</span>
                        <span className="font-medium text-slate-700">
                          Đón: {bookingResult.pickupAddress || 'Đang cập nhật'} <br />
                          Trả: {bookingResult.dropoffAddress || 'Đang cập nhật'}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-xs">Số lượng khách / kiện</span>
                        <span className="font-bold text-navy-950">
                          {bookingResult.passengerCount} hành khách
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-white border border-slate-200">
                        <span className="text-slate-500 block text-xs">Cước phí / Thanh toán</span>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-gold-600">
                            {formatCurrencyVN(bookingResult.price)}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {PAYMENT_STATUS_CONFIG[bookingResult.paymentStatus]?.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Chuyến xe đã được ghi nhận trên hệ thống điều hành. Lái xe sẽ liên hệ trước giờ khởi hành 30-45 phút.
                      </span>
                    </div>

                    <div className="pt-2 text-center">
                      <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Phone className="w-3.5 h-3.5" />}
                        >
                          Cần Đổi Giờ Hoặc Hỗ Trợ: {APP_CONFIG.hotlines[0]}
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Tổng đài trực máy: 04:00 - 22:00</span>
                <a href={`tel:${APP_CONFIG.primaryHotline}`} className="text-gold-600 font-bold hover:underline">
                  Hotline: {APP_CONFIG.hotlines[0]}
                </a>
              </CardFooter>
            </Card>
          </Container>
        </Section>
      </main>

      <Footer />
      <FloatingQuickActions />
    </div>
  );
}

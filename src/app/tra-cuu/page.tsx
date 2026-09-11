'use client';

import React, { useState } from 'react';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Button, Alert } from '@/components/ui';
import { Search } from 'lucide-react';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types/booking';

export default function TrackingPage() {
  const [bookingCode, setBookingCode] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!bookingCode.trim() || !phone.trim()) {
      setError('Vui lòng nhập cả Mã đơn và Số điện thoại');
      return;
    }

    setIsLoading(true);
    try {
      const found = await bookingService.lookupBooking(bookingCode.trim().toUpperCase(), phone.trim());
      if (!found) {
        setError('Không tìm thấy thông tin đơn hoặc số điện thoại không khớp. Vui lòng kiểm tra lại!');
      } else {
        setResult(found);
      }
    } catch {
      setError('Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <Container size="md">
          <Card className="max-w-xl mx-auto shadow-xl">
            <CardHeader className="text-center pb-2">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mx-auto mb-2">
                <Search className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">Tra Cứu Tiến Trình Đơn Xe</CardTitle>
              <CardDescription>
                Nhập mã đặt vé (BK...) hoặc mã gửi hàng (HG...) cùng số điện thoại đăng ký
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <Input
                  label="Mã đặt vé / Vận đơn"
                  placeholder="Ví dụ: BK202609110001"
                  value={bookingCode}
                  onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                  required
                />

                <Input
                  label="Số điện thoại đặt vé"
                  placeholder="Ví dụ: 0868680944"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />

                {error && (
                  <Alert variant="danger" title="Không tìm thấy">
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  leftIcon={<Search className="w-5 h-5" />}
                >
                  Tra Cứu Ngay
                </Button>
              </form>

              {result && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-sm animate-in fade-in">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs text-slate-500">Mã booking:</span>
                    <span className="font-extrabold text-navy-950 text-base">{result.bookingCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Dịch vụ:</span>
                    <span className="font-semibold text-navy-900">{result.serviceType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lộ trình:</span>
                    <span className="font-semibold text-navy-900">
                      {result.departure} ⇄ {result.destination}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời gian:</span>
                    <span className="font-semibold text-navy-900">
                      {result.travelTime} ngày {result.travelDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Trạng thái:</span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gold-100 text-gold-800 border border-gold-300">
                      {result.bookingStatus}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Container>
      </main>

      <Footer />
      <FloatingQuickActions />
    </div>
  );
}

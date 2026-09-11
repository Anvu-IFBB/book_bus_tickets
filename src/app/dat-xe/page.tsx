import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Section, Badge } from '@/components/ui';
import { APP_CONFIG } from '@/lib/constants/config';
import { Phone, ShieldCheck, Clock, MapPin } from 'lucide-react';
import DatXeClient from './dat-xe-client';

export const metadata: Metadata = {
  title: 'Đặt Vé Limousine & Thuê Xe Hợp Đồng Trực Tuyến | Giữ Chỗ 100%',
  description:
    'Hệ thống đặt vé xe Limousine cao tốc Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình, thuê xe hợp đồng 5-29 chỗ, gửi hàng hỏa tốc trong ngày. Giữ chỗ uy tín, xác nhận nhanh.',
  keywords: [
    'dat ve limousine quang ninh ninh binh',
    'dat xe limousine truc tuyen',
    'thue xe hop dong online',
    'gui hang xe limousine',
  ],
};

export default function DatXePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Top Hero Banner */}
        <Section variant="navy" spacing="md" className="relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="md" className="relative z-10 space-y-3">
            <Badge variant="gold">Hệ Thống Đặt Chỗ Trực Tuyến</Badge>
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Đăng Ký Đặt Xe & Gửi Hàng Nhanh Chóng
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Nhận xác nhận giữ chỗ sau 5 phút. Xe đón trả tận nơi, chạy 100% cao tốc, phục vụ 04:00 - 22:00 hàng ngày.
            </p>

            <div className="pt-3 flex items-center justify-center gap-6 text-xs text-slate-300 flex-wrap">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Giữ chỗ 100%
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-400" />
                Đúng giờ xuất bến
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-400" />
                Đón trả tận nhà
              </span>
            </div>
          </Container>
        </Section>

        {/* Booking Wizard Section */}
        <Section spacing="lg" className="pt-6 sm:pt-10">
          <Container size="lg">
            <Suspense fallback={<div className="p-12 text-center text-slate-500">Đang nạp hệ thống đặt chỗ...</div>}>
              <DatXeClient />
            </Suspense>

            {/* Hotline banner below wizard */}
            <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-600 space-y-1">
              <div>
                Cần đặt xe gấp trong vòng 1 - 2 tiếng tới hoặc cần thay đổi lịch trình gấp?
              </div>
              <div className="font-bold text-navy-950 flex items-center justify-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-600" />
                <span>Gọi trực tiếp tổng đài:</span>
                <a href={`tel:${APP_CONFIG.primaryHotline}`} className="text-gold-600 hover:underline">
                  {APP_CONFIG.hotlines[0]}
                </a>
                <span>-</span>
                <a href={`tel:${APP_CONFIG.hotlines[1]}`} className="text-gold-600 hover:underline">
                  {APP_CONFIG.hotlines[1]}
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <FloatingQuickActions />
    </div>
  );
}

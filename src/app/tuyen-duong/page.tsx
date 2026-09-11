import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Section, Badge, Button } from '@/components/ui';
import { RouteCard, RouteTable } from '@/components/routes';
import { DEFAULT_ROUTES, APP_CONFIG } from '@/lib/constants/config';
import {
  ShieldCheck,
  Phone,
  Search,
  Info,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lộ Trình & Tuyến Đường Limousine Quảng Ninh - Ninh Bình | Chạy Cao Tốc',
  description:
    'Chi tiết lộ trình xe Limousine: Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình và ngược lại. Chạy 100% cao tốc, đón trả tận nơi, thời gian rút ngắn tối đa.',
  keywords: [
    'tuyen duong limousine quang ninh ninh binh',
    'lo trinh xe limousine hai phong thai binh',
    'xe nam dinh ninh binh quang ninh',
    'di xe limousine tu quang ninh ve ninh binh',
  ],
};

const CORRIDOR_STOPS = [
  { name: 'Quảng Ninh', note: 'Bãi Cháy, Hòn Gai, Cẩm Phả, Uông Bí' },
  { name: 'Hải Phòng', note: 'Nút giao cao tốc, Nội thành, Sân bay Cát Bi' },
  { name: 'Thái Bình', note: 'TP Thái Bình, Hưng Hà, Đông Hưng' },
  { name: 'Nam Định', note: 'TP Nam Định, Nút giao Cao Bồ' },
  { name: 'Ninh Bình', note: 'TP Ninh Bình, Tam Cốc, Tràng An, Bái Đính' },
];

export default function RoutesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-1/3 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="xl" className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold">Mạng Lưới Tuyến Đường Toàn Tuyến</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Lộ Trình Xe Limousine Cao Tốc <br />
              <span className="text-gradient-gold">Quảng Ninh ⇄ Ninh Bình</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Hành trình kết nối liên tục 5 tỉnh vùng duyên hải và đồng bằng Bắc Bộ. Di chuyển êm ái trên các trục đường cao tốc hiện đại nhất.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                <Button variant="primary" size="lg" leftIcon={<Phone className="w-5 h-5" />}>
                  Hotline Đặt Vé: {APP_CONFIG.hotlines[0]}
                </Button>
              </a>
              <Link href="/tra-cuu">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-400 text-white hover:bg-white/10"
                  leftIcon={<Search className="w-5 h-5 text-gold-400" />}
                >
                  Tra Cứu Chuyến Xe
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* Route Corridor Visual Timeline */}
        <Section spacing="md">
          <Container size="xl">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="text-center max-w-xl mx-auto space-y-2">
                <Badge variant="navy">Trục Cao Tốc Kết Nối</Badge>
                <h2 className="text-2xl font-black text-navy-950">
                  Hành Trình 5 Tỉnh Thành Trọng Điểm
                </h2>
                <p className="text-xs sm:text-sm text-slate-600">
                  Phục vụ cả hai chiều xuất phát liên tục từ 04:00 sáng đến tối muộn hàng ngày.
                </p>
              </div>

              {/* Corridor Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative">
                {CORRIDOR_STOPS.map((stop, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center text-center p-4 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-sm mb-2">
                      {index + 1}
                    </div>
                    <div className="font-extrabold text-navy-950 text-base">{stop.name}</div>
                    <div className="text-xs text-slate-500 mt-1 leading-snug">{stop.note}</div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-gold-50/70 border border-gold-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-gold-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Lưu ý đón trả:</strong> Tại các khu vực nội thành trung tâm, xe Limousine hỗ trợ đón trả tận nhà. Đối với các điểm xa trung tâm hoặc ngoài phạm vi, tổng đài sẽ hướng dẫn quý khách điểm hẹn thuận tiện nhất trên trục đường xe chạy.
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Detailed Route Cards Grid */}
        <Section variant="slate" spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="gold">Danh Sách Tuyến Xe</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Lộ Trình Từng Chặng Cụ Thể
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Chọn chặng di chuyển phù hợp để xem thời gian dự kiến và liên hệ nhận tư vấn đón trả.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_ROUTES.map((route, idx) => (
                <RouteCard
                  key={idx}
                  departure={route.departure}
                  destination={route.destination}
                  distanceKm={route.distanceKm}
                  estimatedDurationHours={route.estimatedDurationHours}
                  basePrice={route.basePrice}
                  isPopular={idx === 0 || idx === 1}
                  stops={
                    route.departure === 'Quảng Ninh'
                      ? ['Uông Bí', 'Hải Phòng', 'Thái Bình', 'Nam Định']
                      : ['Nam Định', 'Thái Bình', 'Hải Phòng', 'Quảng Ninh']
                  }
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Route Table Comparison */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="navy">Bảng Tra Cứu Nhanh</Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                  Tổng Hợp Tuyến Đường & Cự Ly
                </h2>
                <p className="text-sm text-slate-600">
                  Mức giá niêm yết tham khảo tính theo từng ghế; liên hệ tổng đài để nhận báo giá chính xác theo vị trí đón trả cụ thể.
                </p>
              </div>

              <RouteTable showAction={true} />

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-navy-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Quy Định Đón Trả Khách Hàng:
                </div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Khách hàng nên chuẩn bị hành lý trước giờ hẹn 10-15 phút để tài xế đón đúng khung giờ.</li>
                  <li>Xe Limousine chạy đúng tuyến đường quy định, không chạy vòng vèo, đảm bảo thời gian di chuyển nhanh nhất.</li>
                  <li>Nếu quý khách mang theo thú cưng hoặc kiện hàng quá khổ, vui lòng báo trước với nhân viên tổng đài khi đặt vé.</li>
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        {/* Bottom Booking CTA */}
        <Section variant="navy" spacing="md">
          <Container size="xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Bạn Đã Chọn Được Tuyến Đường Phù Hợp?
                </h3>
                <p className="text-sm text-slate-300">
                  Gọi điện trực tiếp tổng đài để đăng ký vị trí ghế ngồi ưu thích và điểm đón tận nơi.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                  <Button variant="primary" size="lg" leftIcon={<Phone className="w-5 h-5" />}>
                    Gọi: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>
                <Link href="/lien-he">
                  <Button variant="outline" size="lg" className="border-slate-400 text-white hover:bg-white/10">
                    Gửi Yêu Cầu Đặt Chỗ
                  </Button>
                </Link>
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

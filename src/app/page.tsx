import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Button, Badge, Container, Section, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { RouteCard, RouteTable } from '@/components/routes';
import { ReviewList } from '@/components/feedback';
import { APP_CONFIG, DEFAULT_ROUTES } from '@/lib/constants/config';
import { PUBLIC_SERVICES } from '@/lib/constants/publicContent';
import {
  Phone,
  Search,
  Star,
  ShieldCheck,
  Clock,
  Car,
  Truck,
  MapPin,
  ArrowRight,
  Compass,
  Headphones,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Limousine Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình | Xe VIP Đón Tận Nơi',
  description:
    'Dịch vụ xe Limousine cao cấp kết nối 5 tỉnh thành: Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình. Ghế VIP massage, chạy cao tốc, đón trả tận nơi, xuất bến đúng giờ. Hotline: 0868.680.944 - 0866.834.442.',
  keywords: [
    'limousine quang ninh ninh binh',
    'xe limousine hai phong thai binh nam dinh',
    'dat ve limousine',
    'gui hang hoa hoa toc',
    'thue xe hop dong 5 29 cho',
  ],
  openGraph: {
    title: 'Limousine VIP Quảng Ninh ⇄ Ninh Bình | Đón Trả Tận Nơi',
    description:
      'Chuyên tuyến Limousine cao tốc Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình. Cam kết giữ chỗ, chạy đúng giờ, nội thất ghế thương gia VIP.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

          <Container size="xl" className="relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/90 border border-gold-500/40 text-gold-400 text-xs font-semibold tracking-wide">
                <Star className="w-3.5 h-3.5 fill-gold-400" />
                <span>CHUYÊN TUYẾN CAO TỐC LIÊN TỈNH CAO CẤP</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Limousine VIP <br />
                <span className="text-gradient-gold">Quảng Ninh ⇄ Ninh Bình</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                Hành trình kết nối thông suốt 5 tỉnh thành: <strong>Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình</strong> và ngược lại.
                Chạy 100% đường cao tốc, đón trả tận nơi, ghế massage thương gia thư giãn.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <a href={`tel:${APP_CONFIG.primaryHotline}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<Phone className="w-5 h-5" />}
                  >
                    Gọi Đặt Vé: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>

                <Link href="/tra-cuu" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="border-slate-400 text-white hover:bg-navy-900 hover:text-gold-400"
                    leftIcon={<Search className="w-5 h-5 text-gold-400" />}
                  >
                    Tra Cứu Đơn Xe
                  </Button>
                </Link>

                <Link href="/dich-vu" className="w-full sm:w-auto">
                  <Button
                    variant="ghost"
                    size="lg"
                    fullWidth
                    className="text-slate-300 hover:text-white hover:bg-navy-900/50"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Khám Phá Dịch Vụ
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-navy-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Giữ chỗ 100%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Xuất bến đúng giờ</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Đón trả tận nơi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>Ghế VIP massage</span>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* 2. Service Highlights */}
        <Section id="dich-vu-noi-bat" spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <Badge variant="navy">Dịch Vụ Toàn Diện</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Giải Pháp Vận Tải Toàn Diện & Uy Tín
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Đáp ứng trọn vẹn từ vé lẻ hàng ngày, gửi hàng bưu kiện hỏa tốc đến dịch vụ thuê trọn chuyến xe hợp đồng và tour du lịch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {PUBLIC_SERVICES.map((svc) => (
                <Card key={svc.id} hover className="flex flex-col justify-between border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-3">
                      {svc.id === 've-limousine' && <Car className="w-6 h-6" />}
                      {svc.id === 'thue-xe-hop-dong' && <Calendar className="w-6 h-6" />}
                      {svc.id === 'gui-hang-hoa' && <Truck className="w-6 h-6" />}
                      {svc.id === 'xe-du-lich' && <Compass className="w-6 h-6" />}
                    </div>
                    <Badge variant="navy" size="sm" className="w-fit mb-2">
                      {svc.badge}
                    </Badge>
                    <CardTitle className="text-lg font-black text-navy-950">{svc.title}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm line-clamp-3 mt-1">
                      {svc.shortDesc}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-2.5">
                    <div className="text-xs text-slate-600 font-medium">Đặc điểm chính:</div>
                    <ul className="text-xs text-slate-600 space-y-1.5">
                      {svc.highlights.slice(0, 2).map((hl, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link href={`/dich-vu#${svc.id}`} className="w-full">
                      <Button variant="outline" size="sm" fullWidth rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                        Tìm Hiểu Thêm
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/dich-vu">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Xem Chi Tiết Toàn Bộ 4 Dịch Vụ
                </Button>
              </Link>
            </div>
          </Container>
        </Section>

        {/* 3. Popular Routes */}
        <Section id="tuyen-chinh" variant="slate" spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="gold">Lộ Trình Trọng Điểm</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Các Tuyến Xe Kết Nối Hàng Ngày
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Các chuyến xe xuất phát liên tục trong ngày giữa Quảng Ninh, Hải Phòng, Thái Bình, Nam Định và Ninh Bình.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {DEFAULT_ROUTES.slice(0, 3).map((r, idx) => (
                <RouteCard
                  key={idx}
                  departure={r.departure}
                  destination={r.destination}
                  distanceKm={r.distanceKm}
                  estimatedDurationHours={r.estimatedDurationHours}
                  basePrice={r.basePrice}
                  isPopular={idx === 0 || idx === 1}
                  stops={['Cao tốc Hải Phòng', 'Thái Bình', 'Nam Định']}
                />
              ))}
            </div>

            {/* Comprehensive Table */}
            <div className="max-w-4xl mx-auto space-y-4">
              <h3 className="text-lg font-bold text-navy-950 text-center">
                Bảng Tổng Hợp Tuyến Đường & Thời Gian Dự Kiến
              </h3>
              <RouteTable limit={6} />
              <div className="text-center pt-2">
                <Link href="/tuyen-duong">
                  <Button variant="outline" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Xem Toàn Bộ Lộ Trình Tuyến Chi Tiết
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </Section>

        {/* 4. Why Choose Us */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <Badge variant="navy">Giá Trị Cốt Lõi</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Tại Sao Khách Hàng Tin Chọn Chúng Tôi?
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Chúng tôi tập trung vào trải nghiệm thực tế của từng hành khách với sự tận tâm, an toàn và minh bạch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Giữ Chỗ Đã Xác Nhận</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Khi tổng đài đã xác nhận giữ vé, chúng tôi đảm bảo vị trí ghế của bạn và không tự ý hủy chuyến.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Xuất Bến Đúng Lịch Trình</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Xe khởi hành theo khung giờ đã thỏa thuận, không dừng đỗ đón khách dọc đường làm lỡ thời gian của quý khách.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Đón Trả Tận Nơi</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hỗ trợ đón tận nhà, khách sạn tại các trung tâm thành phố theo cam kết phạm vi phục vụ của nhà xe.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">Hỗ Trợ Nhanh Chóng</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hai số hotline luôn sẵn sàng hỗ trợ tư vấn lộ trình, tiếp nhận chuyển hàng và tra cứu hành trình chuyến xe.
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* 5. Booking CTA Banner */}
        <Section variant="default" spacing="md" className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 text-navy-950">
          <Container size="xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center lg:text-left">
                <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                  Bạn Cần Đặt Vé Hoặc Thuê Xe Chuyến Sắp Tới?
                </h2>
                <p className="text-sm sm:text-base text-navy-900 font-medium">
                  Liên hệ tổng đài để giữ chỗ ngay. Đội ngũ tổng đài viên sẵn sàng hỗ trợ bạn 04:00 - 22:00 hàng ngày.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                  <Button
                    variant="secondary"
                    size="lg"
                    leftIcon={<Phone className="w-5 h-5 text-gold-400" />}
                  >
                    Hotline: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>
                <a href={`tel:${APP_CONFIG.hotlines[1]}`}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-navy-950 text-navy-950 hover:bg-navy-950 hover:text-white"
                  >
                    Hotline 2: {APP_CONFIG.hotlines[1]}
                  </Button>
                </a>
              </div>
            </div>
          </Container>
        </Section>

        {/* 6. Customer Reviews Architecture (No fake reviews) */}
        <Section variant="slate" spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="navy">Đánh Giá Dịch Vụ</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Ý Kiến Đóng Góp Từ Hành Khách
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Mọi phản hồi từ khách hàng sau chuyến đi là động lực giúp chúng tôi hoàn thiện chất lượng dịch vụ mỗi ngày.
              </p>
            </div>

            {/* Reusable ReviewList with empty state ready for FeedbackService */}
            <ReviewList reviews={[]} />
          </Container>
        </Section>

        {/* 7. Contact & Social CTA */}
        <Section spacing="lg">
          <Container size="md">
            <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-3 relative z-10">
                <Badge variant="gold">Kết Nối Với Chúng Tôi</Badge>
                <h2 className="text-2xl sm:text-3xl font-black">
                  Bạn Cần Thêm Thông Tin Chi Tiết?
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
                  Tổng đài viên trực máy từ 04:00 đến 22:00 hàng ngày. Đừng ngần ngại gọi điện hoặc nhắn tin để nhận giải đáp ngay.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 relative z-10">
                <a href={`tel:${APP_CONFIG.primaryHotline}`} className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    leftIcon={<Phone className="w-5 h-5" />}
                  >
                    Gọi: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>
                <Link href="/lien-he" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="border-slate-400 text-white hover:bg-white/10"
                  >
                    Trang Thông Tin Liên Hệ
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

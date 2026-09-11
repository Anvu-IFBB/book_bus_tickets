import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Section, Badge, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { PUBLIC_SERVICES } from '@/lib/constants/publicContent';
import { APP_CONFIG } from '@/lib/constants/config';
import {
  Car,
  Calendar,
  Truck,
  Compass,
  Phone,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Info,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dịch Vụ Vận Tải Limousine & Xe Hợp Đồng 5 - 29 Chỗ | Uy Tín, Đúng Giờ',
  description:
    'Chi tiết 4 dịch vụ vận chuyển: Vé xe Limousine Quảng Ninh - Ninh Bình, Thuê xe hợp đồng 5-29 chỗ, Nhận gửi hàng hóa hỏa tốc trong ngày, Xe du lịch trọn gói.',
  keywords: [
    'dich vu xe limousine',
    've xe quang ninh ninh binh',
    'thue xe hop dong 5 7 11 16 29 cho',
    'gui hang hoa hoa toc',
    'xe du lich ha long trang an',
  ],
};

const serviceIcons: Record<string, React.ReactNode> = {
  've-limousine': <Car className="w-8 h-8 text-gold-500" />,
  'thue-xe-hop-dong': <Calendar className="w-8 h-8 text-gold-500" />,
  'gui-hang-hoa': <Truck className="w-8 h-8 text-gold-500" />,
  'xe-du-lich': <Compass className="w-8 h-8 text-gold-500" />,
};

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="xl" className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold">Danh Mục Dịch Vụ Chính Thức</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Hệ Thống Dịch Vụ Vận Tải <br />
              <span className="text-gradient-gold">Limousine & Xe Hợp Đồng VIP</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Chuyên nghiệp trên từng chặng đường kết nối Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình.
              Cam kết dịch vụ chất lượng, minh bạch và an toàn tuyệt đối.
            </p>

            {/* Quick Service Anchor Navigation */}
            <div className="flex flex-wrap justify-center gap-2 pt-4">
              {PUBLIC_SERVICES.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="px-3.5 py-1.5 rounded-full bg-navy-900/80 border border-slate-700 text-xs sm:text-sm font-medium text-slate-200 hover:border-gold-400 hover:text-gold-400 transition-colors"
                >
                  {s.title}
                </a>
              ))}
            </div>
          </Container>
        </Section>

        {/* In-depth Service Details */}
        <Section spacing="lg">
          <Container size="xl" className="space-y-16">
            {PUBLIC_SERVICES.map((svc, index) => {
              const isEven = index % 2 === 1;

              return (
                <div
                  key={svc.id}
                  id={svc.id}
                  className="scroll-mt-24 p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Main Information */}
                    <div className={`lg:col-span-7 space-y-5 ${isEven ? 'lg:order-2' : ''}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-navy-950 flex items-center justify-center shrink-0">
                          {serviceIcons[svc.id]}
                        </div>
                        <div>
                          <Badge variant="navy" size="sm">
                            {svc.badge}
                          </Badge>
                          <h2 className="text-2xl sm:text-3xl font-black text-navy-950 mt-1">
                            {svc.title}
                          </h2>
                        </div>
                      </div>

                      <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        {svc.fullDesc}
                      </p>

                      <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          Đặc Quyền & Lợi Ích Khách Hàng:
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {svc.highlights.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                        <a href={`tel:${APP_CONFIG.primaryHotline}`} className="w-full sm:w-auto">
                          <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            leftIcon={<Phone className="w-4 h-4" />}
                          >
                            Gọi Đặt Dịch Vụ Ngay
                          </Button>
                        </a>
                        <Link href="/lien-he" className="w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="md"
                            fullWidth
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                          >
                            Gửi Yêu Cầu Tư Vấn
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Specification Card */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : ''}`}>
                      <Card className="bg-slate-50/70 border-slate-200 shadow-none">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-bold text-navy-950 flex items-center gap-2">
                            <Info className="w-4 h-4 text-gold-600" />
                            Thông Tin Vận Hành & Xe
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          <div>
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                              Dòng Xe Phục Vụ
                            </div>
                            <div className="space-y-1.5">
                              {svc.vehicleOptions.map((opt, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2 text-xs sm:text-sm font-medium text-navy-950 bg-white px-3 py-2 rounded-lg border border-slate-200/80"
                                >
                                  <Car className="w-4 h-4 text-gold-600 shrink-0" />
                                  <span>{opt}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Chính Sách Giá Cước
                            </div>
                            <div className="p-3 rounded-xl bg-white border border-gold-300 text-xs text-slate-700 leading-relaxed">
                              {svc.pricingNote}
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-200">
                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                              Tuyến Phục Vụ
                            </div>
                            <div className="text-xs text-slate-600 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              );
            })}
          </Container>
        </Section>

        {/* Bottom Consultation Banner */}
        <Section variant="slate" spacing="md">
          <Container size="xl">
            <div className="p-8 rounded-3xl bg-navy-950 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-xl sm:text-2xl font-black">
                  Cần Báo Giá Xe Hợp Đồng Hoặc Lịch Trình Đặc Biệt?
                </h3>
                <p className="text-sm text-slate-300 max-w-xl">
                  Nhà xe nhận phục vụ đưa đón đoàn gia đình, đám cưới, hội nghị và công tác với mức chi phí tối ưu nhất.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                  <Button variant="primary" size="lg" leftIcon={<Phone className="w-4 h-4" />}>
                    Hotline: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>
                <Link href="/lien-he">
                  <Button variant="outline" size="lg" className="border-slate-400 text-white hover:bg-white/10">
                    Liên Hệ Chúng Tôi
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

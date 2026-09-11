import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Section, Badge, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { APP_CONFIG, VEHICLE_SEAT_OPTIONS } from '@/lib/constants/config';
import {
  ShieldCheck,
  Clock,
  Users,
  Compass,
  HeartHandshake,
  CheckCircle2,
  Phone,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới Thiệu Về Chúng Tôi | Limousine VIP Quảng Ninh - Ninh Bình',
  description:
    'Tìm hiểu về dịch vụ xe Limousine cao cấp tuyến Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình. Định hướng phục vụ văn minh, an toàn, tôn trọng thời gian của hành khách.',
  keywords: [
    'gioi thieu limousine quang ninh ninh binh',
    'nha xe limousine uy tin',
    'xe limousine chat luong cao',
    'doi xe 5 7 11 16 29 cho',
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="xl" className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold">Về Chúng Tôi</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Đồng Hành Cùng Hành Khách <br />
              <span className="text-gradient-gold">Trên Mọi Nẻo Đường Cao Tốc</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Xây dựng trải nghiệm di chuyển văn minh, tôn trọng thời gian và mang lại sự an tâm tuyệt đối cho khách hàng trên tuyến Quảng Ninh - Ninh Bình.
            </p>
          </Container>
        </Section>

        {/* Brand Mission & Philosophy */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <Badge variant="navy">Sứ Mệnh Phục Vụ</Badge>
                <h2 className="text-2xl sm:text-4xl font-black text-navy-950 leading-tight">
                  Tận Tâm - Chu Đáo - An Toàn Trên Từng Km Di Chuyển
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Dịch vụ xe Limousine Quảng Ninh - Ninh Bình được xây dựng nhằm đáp ứng nhu cầu đi lại ngày càng cao của người dân, chuyên gia, khách du lịch giữa 5 tỉnh thành trọng điểm duyên hải Bắc Bộ.
                </p>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  Chúng tôi hiểu rằng mỗi chuyến đi đều gắn liền với một kế hoạch quan trọng của quý khách: một buổi làm việc, một chuyến du lịch sum họp gia đình, hay một cuộc hẹn cần đúng giờ. Do đó, toàn bộ quy trình vận hành được thiết kế để hạn chế tối đa sự mệt mỏi và chờ đợi.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-navy-950 text-base">Tôn Trọng Thời Gian</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Xe chạy đúng giờ hẹn, không bắt khách dọc đường, tận dụng mạng lưới cao tốc để rút ngắn thời gian.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div className="font-bold text-navy-950 text-base">Lái Xe Điềm Đạm</div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Đội ngũ bác tài có nhiều năm kinh nghiệm, lịch sự, không phóng nhanh vượt ẩu và không hút thuốc trên xe.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="p-6 sm:p-8 rounded-3xl bg-navy-950 text-white space-y-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl" />
                  <div className="space-y-2 relative z-10">
                    <div className="inline-flex items-center gap-1.5 text-gold-400 text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      Thông Tin Nhận Diện
                    </div>
                    <div className="text-xl font-bold text-white">{APP_CONFIG.name}</div>
                    <p className="text-xs text-slate-300">{APP_CONFIG.tagline}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-navy-800 text-xs text-slate-200 relative z-10">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Đại diện phụ trách:</span>
                      <span className="font-semibold text-white">{APP_CONFIG.facebookName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hotline trực tiếp:</span>
                      <span className="font-semibold text-gold-400">{APP_CONFIG.hotlines[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hotline hỗ trợ:</span>
                      <span className="font-semibold text-gold-400">{APP_CONFIG.hotlines[1]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Thời gian làm việc:</span>
                      <span className="font-semibold text-white">{APP_CONFIG.workingHours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trụ sở điều hành:</span>
                      <span className="font-semibold text-white">{APP_CONFIG.address}</span>
                    </div>
                  </div>

                  <a href={`tel:${APP_CONFIG.primaryHotline}`} className="block relative z-10">
                    <Button variant="primary" size="md" fullWidth leftIcon={<Phone className="w-4 h-4" />}>
                      Gọi Hotline Tư Vấn
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Vehicle Fleet Overview */}
        <Section variant="slate" spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="gold">Hệ Thống Phương Tiện</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                Đội Xe Hiện Đại & Đa Dạng
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Chúng tôi cung cấp đầy đủ các loại xe từ 5 đến 29 chỗ đời mới, phục vụ linh hoạt cho từng nhu cầu cá nhân hoặc đoàn thể.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {VEHICLE_SEAT_OPTIONS.map((fleet, i) => (
                <Card key={i} hover className="border-slate-200">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center mb-2 font-black text-lg">
                      {fleet.seats} <span className="text-xs font-normal ml-0.5">chỗ</span>
                    </div>
                    <CardTitle className="text-lg font-bold text-navy-950">
                      {fleet.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs sm:text-sm text-slate-600">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Xe đời mới, trang bị điều hòa mát sâu, nội thất da cao cấp.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Bảo dưỡng định kỳ, kiểm tra an toàn kỹ thuật nghiêm ngặt trước khi xuất bến.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Vệ sinh khử khuẩn sạch sẽ sau mỗi chuyến hành trình.</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Service Values Commitment */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="navy">Giá Trị Cốt Lõi</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                3 Trụ Cột Trong Hoạt Động Của Chúng Tôi
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">1. Tận Tụy Phục Vụ</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lắng nghe nhu cầu của hành khách để sắp xếp điểm đón thuận tiện nhất. Sẵn sàng hỗ trợ xách hành lý và hỗ trợ người cao tuổi, trẻ nhỏ.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">2. Tuyến Đường Minh Bạch</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Lộ trình chạy đường cao tốc rõ ràng. Cung cấp mã vận đơn cho hàng hóa và mã đặt chỗ cho vé xe giúp hành khách chủ động tra cứu 24/7.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-navy-950">3. Cải Tiến Liên Tục</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hệ thống tiếp nhận phản hồi sau chuyến đi để kịp thời ghi nhận ý kiến đóng góp và nâng cao chất lượng dịch vụ ngày một tốt hơn.
                </p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link href="/cam-ket">
                <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Xem Chi Tiết Các Cam Kết Chất Lượng
                </Button>
              </Link>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
      <FloatingQuickActions />
    </div>
  );
}

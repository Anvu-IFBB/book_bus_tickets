import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Container, Section, Badge, Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { SERVICE_COMMITMENTS, FAQ_ITEMS } from '@/lib/constants/publicContent';
import { APP_CONFIG } from '@/lib/constants/config';
import {
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Phone,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cam Kết Chất Lượng Dịch Vụ | Limousine VIP Quảng Ninh - Ninh Bình',
  description:
    'Cam kết chất lượng phục vụ của Limousine VIP: Giữ chỗ uy tín, đón trả tận nơi, minh bạch cước phí, lắng nghe và xử lý mọi phản hồi của khách hàng.',
  keywords: [
    'cam ket nha xe limousine',
    'chinh sach ho tro khach hang',
    'chinh sach dat ve xe limousine',
    'uy tin xe limousine quang ninh ninh binh',
  ],
};

export default function CommitmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="xl" className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold">Trách Nhiệm & Uy Tín</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Cam Kết Chất Lượng Dịch Vụ <br />
              <span className="text-gradient-gold">Bảo Vệ Quyền Lợi Hành Khách</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Uy tín tạo nên thương hiệu. Chúng tôi cam kết mang lại sự an tâm cao nhất qua từng hành động cụ thể và minh bạch trong chính sách phục vụ.
            </p>
          </Container>
        </Section>

        {/* 6 Core Commitments */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <Badge variant="navy">Chính Sách Phục Vụ</Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-950">
                6 Cam Kết Cốt Lõi Với Khách Hàng
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Mỗi hành khách khi sử dụng dịch vụ của chúng tôi đều được đảm bảo các quyền lợi cơ bản dưới đây.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SERVICE_COMMITMENTS.map((com, idx) => (
                <Card key={idx} hover className="border-slate-200 flex flex-col justify-between">
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-3">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg sm:text-xl font-bold text-navy-950">
                      {idx + 1}. {com.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {com.description}
                    </p>
                  </CardContent>
                  <div className="p-4 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Áp dụng trên toàn tuyến</span>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </Section>

        {/* Support & Dispute Resolution Policy */}
        <Section variant="slate" spacing="lg">
          <Container size="xl">
            <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <Badge variant="gold">Quy Trình Tiếp Nhận</Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                  Chính Sách Xử Lý Ý Kiến & Khiếu Nại
                </h2>
                <p className="text-sm text-slate-600">
                  Mọi phản ánh của quý khách đều được ban điều hành ghi nhận và giải quyết theo quy trình minh bạch.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div className="font-bold text-navy-950 text-base">Tiếp Nhận Phản Hồi</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Khách hàng có thể phản ánh trực tiếp qua số hotline hoặc để lại đánh giá dịch vụ sau khi kết thúc chuyến đi.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div className="font-bold text-navy-950 text-base">Xác Minh Thực Tế</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Bộ phận điều hành kiểm tra hành trình xe, camera hoặc ghi nhận từ lái xe liên quan để nắm rõ sự việc.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-navy-950 text-gold-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div className="font-bold text-navy-950 text-base">Phản Hồi & Giải Quyết</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Liên hệ lại với quý khách để gửi lời xin lỗi và đưa ra giải pháp bồi hoàn, hỗ trợ thỏa đáng và minh bạch.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* FAQ Section */}
        <Section spacing="lg">
          <Container size="md">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <Badge variant="navy">Giải Đáp Thắc Mắc</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                Câu Hỏi Thường Gặp Về Dịch Vụ
              </h2>
              <p className="text-sm text-slate-600">
                Một số câu hỏi phổ biến của hành khách trước khi đặt chuyến xe hoặc gửi hàng hóa.
              </p>
            </div>

            <div className="space-y-4">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2"
                >
                  <div className="flex items-start gap-2.5 font-bold text-navy-950 text-base">
                    <HelpCircle className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                    <span>{item.q}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 pl-7 leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-6 mt-8 rounded-2xl bg-gold-50 border border-gold-200 text-center space-y-3">
              <div className="text-sm font-bold text-navy-950">
                Bạn còn câu hỏi hoặc thắc mắc nào khác chưa được giải đáp?
              </div>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Hãy gọi trực tiếp tới tổng đài hỗ trợ để được nhân viên tư vấn chi tiết và tận tình nhất.
              </p>
              <div className="flex justify-center gap-3 pt-1">
                <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                  <Button variant="primary" size="sm" leftIcon={<Phone className="w-4 h-4" />}>
                    Gọi: {APP_CONFIG.hotlines[0]}
                  </Button>
                </a>
                <Link href="/lien-he">
                  <Button variant="outline" size="sm">
                    Gửi Câu Hỏi
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

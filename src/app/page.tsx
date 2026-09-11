import React from 'react';
import Link from 'next/link';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Container, Section } from '@/components/ui';
import { APP_CONFIG, DEFAULT_ROUTES } from '@/lib/constants/config';
import {
  Phone,
  Compass,
  Star,
  ShieldCheck,
  Clock,
  Car,
  Truck,
  ArrowRight,
  Layers,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-navy-700/30 rounded-full blur-3xl pointer-events-none" />

          <Container size="xl" className="relative z-10">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-900/90 border border-gold-500/40 text-gold-400 text-xs font-semibold tracking-wide">
                <Star className="w-3.5 h-3.5 fill-gold-400" />
                <span>DỊCH VỤ VẬN TẢI HÀNG THƯƠNG GIA 5 SAO</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                Limousine VIP <br />
                <span className="text-gradient-gold">Quảng Ninh ⇄ Ninh Bình</span>
              </h1>

              <p className="text-base sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                Kết nối thông suốt cao tốc 5 tỉnh thành: <strong>Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình</strong>.
                Đón trả tận nhà, cam kết đúng giờ, xe ghế massage cao cấp.
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

                <Link href="/ui-preview" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    fullWidth
                    className="border-slate-400 text-white hover:bg-navy-900 hover:text-gold-400"
                    leftIcon={<Layers className="w-5 h-5 text-gold-400" />}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Xem UI Component Showcase
                  </Button>
                </Link>
              </div>

              {/* Highlights */}
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

        {/* 4 Core Services Grid */}
        <Section id="dich-vu" spacing="md">
          <Container size="xl">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <Badge variant="navy">Dịch vụ toàn diện</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                Đáp Ứng Mọi Nhu Cầu Di Chuyển Của Bạn
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Từ đặt vé lẻ theo ghế đến thuê trọn chuyến xe hợp đồng cho gia đình, đoàn thể và vận chuyển hàng bưu kiện.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Service 1 */}
              <Card hover>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gold-500/10 text-gold-600 flex items-center justify-center mb-2">
                    <Car className="w-6 h-6" />
                  </div>
                  <CardTitle>Vé Xe Limousine VIP</CardTitle>
                  <CardDescription>
                    Chạy liên tục từ 05:00 đến 21:00 hàng ngày. Ghế thương gia ngả lưng 180 độ có massage thư giãn.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-extrabold text-navy-950">
                    Từ 120.000 <span className="text-xs font-normal text-slate-500">₫/vé</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-emerald-600 font-medium">Chạy cao tốc êm ái</span>
                  <Link href="/ui-preview">
                    <Button variant="primary" size="sm">Đặt Vé</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Service 2 */}
              <Card hover>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-navy-900/10 text-navy-900 flex items-center justify-center mb-2">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <CardTitle>Thuê Xe Hợp Đồng</CardTitle>
                  <CardDescription>
                    Đầy đủ các dòng xe 5, 7, 11, 16, 29 chỗ đời mới. Đưa đón chuyên gia, gia đình, đám cưới, sự kiện.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-extrabold text-navy-950">
                    Xe 5 - 29 chỗ <span className="text-xs font-normal text-slate-500">riêng tư</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-slate-500">Lộ trình linh hoạt</span>
                  <Link href="/ui-preview">
                    <Button variant="secondary" size="sm">Báo Giá</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Service 3 */}
              <Card hover>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2">
                    <Truck className="w-6 h-6" />
                  </div>
                  <CardTitle>Nhận Gửi Hàng Hóa</CardTitle>
                  <CardDescription>
                    Vận chuyển hỏa tốc giấy tờ, hồ sơ, bưu phẩm, hải sản tươi sống bảo quản lạnh giao nhận trong ngày.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-extrabold text-navy-950">
                    Giao trong 2-4h <span className="text-xs font-normal text-slate-500">siêu tốc</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-gold-600 font-medium">Có mã vận đơn HG</span>
                  <Link href="/ui-preview">
                    <Button variant="outline" size="sm">Gửi Hàng</Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Service 4 */}
              <Card hover>
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-2">
                    <Compass className="w-6 h-6" />
                  </div>
                  <CardTitle>Xe Đi Khu Du Lịch</CardTitle>
                  <CardDescription>
                    Đón tiễn các điểm danh thắng nổi tiếng: Vịnh Hạ Long, Yên Tử, Cát Bà, Chùa Tam Chúc, Tràng An, Bái Đính.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-extrabold text-navy-950">
                    Trọn gói tour <span className="text-xs font-normal text-slate-500">khứ hồi</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-slate-500">Tài xế kiêm hướng dẫn</span>
                  <Link href="/ui-preview">
                    <Button variant="outline" size="sm">Tư Vấn</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </Container>
        </Section>

        {/* Major Routes Table Showcase */}
        <Section id="tuyen-duong" variant="slate" spacing="md">
          <Container size="xl">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="gold">Lộ trình & Bảng giá</Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                  Lộ Trình Các Chặng Trọng Điểm
                </h2>
                <p className="text-sm text-slate-600">
                  Thời gian chạy nhanh nhờ 100% đường cao tốc Hạ Long - Hải Phòng - Ninh Bình
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-navy-950 text-white text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5 font-semibold">Tuyến xe</th>
                        <th className="px-5 py-3.5 font-semibold">Thời gian dự kiến</th>
                        <th className="px-5 py-3.5 font-semibold">Khoảng cách</th>
                        <th className="px-5 py-3.5 font-semibold text-right">Giá vé tham khảo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {DEFAULT_ROUTES.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 font-bold text-navy-950">
                            {r.departure} ⇄ {r.destination}
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">
                            ~{r.estimatedDurationHours} giờ
                          </td>
                          <td className="px-5 py-3.5 text-slate-600">{r.distanceKm} km</td>
                          <td className="px-5 py-3.5 text-right font-black text-gold-600">
                            {r.basePrice.toLocaleString('vi-VN')} ₫
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link href="/ui-preview">
                  <Button variant="primary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Mở Trang Thử Nghiệm UI & Form Component
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

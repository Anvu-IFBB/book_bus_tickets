'use client';

import React, { useState } from 'react';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import {
  Container,
  Section,
  Badge,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Textarea,
  Select,
  Alert,
} from '@/components/ui';
import { APP_CONFIG } from '@/lib/constants/config';
import {
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Headphones,
  MessageCircle,
} from 'lucide-react';

export default function ContactPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceType, setServiceType] = useState('ve-limousine');
  const [route, setRoute] = useState('Quảng Ninh - Ninh Bình');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !phone.trim()) {
      setError('Vui lòng điền đầy đủ Họ tên và Số điện thoại liên hệ.');
      return;
    }

    if (phone.trim().length < 9 || phone.trim().length > 11) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập từ 9 đến 11 số.');
      return;
    }

    // In Phase 3, this captures client inquiry and presents clear confirmation
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFullName('');
    setPhone('');
    setServiceType('ve-limousine');
    setRoute('Quảng Ninh - Ninh Bình');
    setNote('');
    setIsSubmitted(false);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <Section variant="navy" spacing="lg" className="relative overflow-hidden text-center">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container size="md" className="relative z-10 space-y-4">
            <Badge variant="gold">Hỗ Trợ Khách Hàng</Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Liên Hệ Đặt Xe & Tư Vấn
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Tổng đài trực máy liên tục từ 04:00 đến 22:00 hàng ngày. Hãy liên hệ qua hotline, Zalo hoặc gửi yêu cầu tư vấn nhanh dưới đây.
            </p>
          </Container>
        </Section>

        {/* Contact Information & Channels */}
        <Section spacing="lg">
          <Container size="xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Channels Column */}
              <div className="lg:col-span-5 space-y-4">
                <div className="space-y-2">
                  <Badge variant="navy">Kênh Trực Tiếp</Badge>
                  <h2 className="text-2xl font-black text-navy-950">
                    Kết Nối Nhanh Với Nhà Xe
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Bấm để gọi điện hoặc nhắn tin trực tiếp tới đội ngũ điều hành viên.
                  </p>
                </div>

                {/* Hotline 1 Card */}
                <Card hover className="border-gold-500/30 shadow-md">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gold-500/10 text-gold-600 flex items-center justify-center font-bold">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                          Hotline Chính (Tổng đài 1)
                        </span>
                        <span className="text-lg sm:text-xl font-black text-navy-950">
                          {APP_CONFIG.hotlines[0]}
                        </span>
                      </div>
                    </div>
                    <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                      <Button variant="primary" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Gọi Ngay
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Hotline 2 Card */}
                <Card hover className="border-slate-200">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-navy-950/10 text-navy-900 flex items-center justify-center font-bold">
                        <Headphones className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                          Hotline Phụ (Tổng đài 2)
                        </span>
                        <span className="text-lg sm:text-xl font-black text-navy-950">
                          {APP_CONFIG.hotlines[1]}
                        </span>
                      </div>
                    </div>
                    <a href={`tel:${APP_CONFIG.hotlines[1]}`}>
                      <Button variant="outline" size="sm" leftIcon={<Phone className="w-3.5 h-3.5" />}>
                        Gọi Ngay
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Zalo Card */}
                <Card hover className="border-blue-200 bg-blue-50/40">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-xs text-blue-700 font-semibold uppercase tracking-wider block">
                          Nhắn Tin Zalo
                        </span>
                        <span className="text-sm font-bold text-navy-950">
                          Zalo: {APP_CONFIG.hotlines[0]}
                        </span>
                      </div>
                    </div>
                    <a href={APP_CONFIG.zaloUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" size="sm">
                        Chat Zalo
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Facebook Card */}
                <Card hover className="border-slate-200">
                  <CardContent className="p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center font-black text-lg">
                        f
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
                          Trang Facebook
                        </span>
                        <span className="text-sm font-bold text-navy-950">
                          {APP_CONFIG.facebookName}
                        </span>
                      </div>
                    </div>
                    <a href={APP_CONFIG.facebookUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        Truy Cập
                      </Button>
                    </a>
                  </CardContent>
                </Card>

                {/* Office Info Card */}
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <div className="font-bold text-navy-950 flex items-center gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-gold-600" />
                    Địa Chỉ Văn Phòng & Giờ Phục Vụ
                  </div>
                  <div>
                    <strong>Địa chỉ:</strong> {APP_CONFIG.address}
                  </div>
                  <div>
                    <strong>Thời gian nhận khách & gửi hàng:</strong> {APP_CONFIG.workingHours}
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    * Xe đón trả khách tận nơi tại nội thành theo thỏa thuận khi đặt vé.
                  </div>
                </div>
              </div>

              {/* Inquiry Form Column */}
              <div className="lg:col-span-7">
                <Card className="shadow-lg border-slate-200">
                  <CardHeader>
                    <Badge variant="gold" size="sm" className="w-fit mb-1">
                      Tiếp Nhận 24/7
                    </Badge>
                    <CardTitle className="text-2xl text-navy-950">
                      Gửi Yêu Cầu Tư Vấn Hoặc Báo Giá
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-500">
                      Điền thông tin chuyến đi của bạn, điều hành viên sẽ gọi lại sau 5 - 10 phút để xác nhận.
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {isSubmitted ? (
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-in fade-in">
                        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-navy-950">
                            Tiếp Nhận Thông Tin Thành Công!
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                            Cảm ơn bạn <strong>{fullName}</strong>. Chúng tôi đã nhận được yêu cầu tư vấn cho tuyến <strong>{route}</strong>. Tổng đài viên sẽ gọi tới số <strong>{phone}</strong> trong ít phút!
                          </p>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" size="sm" onClick={handleReset}>
                            Gửi Thêm Yêu Cầu Khác
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Input
                            label="Họ và tên của bạn *"
                            placeholder="Ví dụ: Nguyễn Văn A"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />

                          <Input
                            label="Số điện thoại liên hệ *"
                            type="tel"
                            placeholder="Ví dụ: 0868680944"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Select
                            label="Dịch vụ cần tư vấn"
                            value={serviceType}
                            onChange={(e) => setServiceType(e.target.value)}
                            options={[
                              { value: 've-limousine', label: 'Vé Xe Ghép Limousine VIP' },
                              { value: 'thue-xe-hop-dong', label: 'Thuê Xe Hợp Đồng 5 - 29 Chỗ' },
                              { value: 'gui-hang-hoa', label: 'Gửi Hàng Hóa Hỏa Tốc' },
                              { value: 'xe-du-lich', label: 'Xe Đi Khu Du Lịch' },
                            ]}
                          />

                          <Select
                            label="Tuyến đường dự kiến"
                            value={route}
                            onChange={(e) => setRoute(e.target.value)}
                            options={[
                              { value: 'Quảng Ninh - Ninh Bình', label: 'Quảng Ninh ⇄ Ninh Bình' },
                              { value: 'Quảng Ninh - Nam Định', label: 'Quảng Ninh ⇄ Nam Định' },
                              { value: 'Quảng Ninh - Thái Bình', label: 'Quảng Ninh ⇄ Thái Bình' },
                              { value: 'Quảng Ninh - Hải Phòng', label: 'Quảng Ninh ⇄ Hải Phòng' },
                              { value: 'Hải Phòng - Ninh Bình', label: 'Hải Phòng ⇄ Ninh Bình' },
                              { value: 'Thái Bình - Ninh Bình', label: 'Thái Bình ⇄ Ninh Bình' },
                              { value: 'Tuyến khác', label: 'Tuyến đường khác theo yêu cầu' },
                            ]}
                          />
                        </div>

                        <Textarea
                          label="Ghi chú chi tiết (Điểm đón trả cụ thể, ngày giờ, số lượng người/hàng)"
                          placeholder="Ví dụ: Đón tại Bãi Cháy lúc 07:00 sáng ngày mai về TP Ninh Bình, có 2 người lớn..."
                          rows={3}
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                        />

                        {error && (
                          <Alert variant="danger" title="Lưu ý">
                            {error}
                          </Alert>
                        )}

                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          fullWidth
                          leftIcon={<Send className="w-4 h-4" />}
                        >
                          Gửi Yêu Cầu Tư Vấn Ngay
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
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

'use client';

import React, { useState } from 'react';
import {
  Button,
  IconButton,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Alert,
  Spinner,
  Skeleton,
  Divider,
  Container,
  Section,
  ToastProvider,
  useToast,
} from '@/components/ui';
import { Header, Footer, FloatingQuickActions } from '@/components/layout';
import {
  Calendar,
  Phone,
  Search,
  ArrowRight,
  Shield,
  Star,
  Car,
  Bell,
} from 'lucide-react';

function UIPreviewContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [selectedRadio, setSelectedRadio] = useState('limousine');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { success, error, info, warning } = useToast();

  const handleSimulateLoading = () => {
    setIsLoadingButton(true);
    setTimeout(() => {
      setIsLoadingButton(false);
      success('Thao tác giả lập đã hoàn thành thành công!', 'Thành công');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1">
        {/* Page Banner */}
        <Section variant="navy" spacing="sm">
          <Container>
            <div className="space-y-2 py-4">
              <div className="flex items-center gap-2">
                <Badge variant="gold" size="sm">
                  Design System V1.0
                </Badge>
                <span className="text-xs text-slate-400">• Phase 2 Verification</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                UI Foundation & Component Showcase
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Thư viện các thành phần giao diện chuẩn nhận diện thương hiệu Limousine VIP (Navy{' '}
                <code className="text-gold-400">#071A2B</code> & Gold{' '}
                <code className="text-gold-400">#D4AF37</code>). Đảm bảo chuẩn responsive từ 320px
                đến 1920px và accessibility.
              </p>
            </div>
          </Container>
        </Section>

        {/* 1. Color Palette Tokens */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                1. Bảng màu thương hiệu (Brand Color Tokens)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                <div className="p-3.5 rounded-xl bg-navy-900 text-white shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                    Navy 900
                  </div>
                  <div className="text-sm font-bold">#071A2B</div>
                  <div className="text-[11px] text-slate-400">Màu chủ đạo thương hiệu</div>
                </div>

                <div className="p-3.5 rounded-xl bg-gold-500 text-navy-950 shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-navy-900">
                    Gold 500
                  </div>
                  <div className="text-sm font-bold">#D4AF37</div>
                  <div className="text-[11px] text-navy-800">Màu nhấn hoàng gia</div>
                </div>

                <div className="p-3.5 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Surface White
                  </div>
                  <div className="text-sm font-bold">#FFFFFF</div>
                  <div className="text-[11px] text-slate-500">Nền Card & Modal</div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    Success
                  </div>
                  <div className="text-sm font-bold">#16A34A</div>
                  <div className="text-[11px] text-emerald-700">Hoàn thành, Xác nhận</div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-amber-600">
                    Warning
                  </div>
                  <div className="text-sm font-bold">#D97706</div>
                  <div className="text-[11px] text-amber-700">Đang liên hệ, Chờ cọc</div>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 shadow-sm space-y-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                    Danger
                  </div>
                  <div className="text-sm font-bold">#DC2626</div>
                  <div className="text-[11px] text-rose-700">Đã hủy, Khiếu nại</div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 2. Typography Scale */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                2. Hệ thống kiểu chữ (Typography System)
              </h2>
              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-5">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                    Display / Hero Title
                  </span>
                  <p className="text-2xl sm:text-4xl lg:text-5xl font-black text-navy-950 tracking-tight leading-tight">
                    Limousine Quảng Ninh - Ninh Bình
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                    H1 Heading
                  </span>
                  <p className="text-xl sm:text-3xl font-extrabold text-navy-950 tracking-tight">
                    Đặt Xe Trực Tuyến & Nhận Mã Tức Thì
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                    H2 Section Title
                  </span>
                  <p className="text-lg sm:text-2xl font-bold text-navy-900">
                    Dịch Vụ Xe Hợp Đồng 5 - 7 - 11 - 16 - 29 Chỗ
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                    Body Regular
                  </span>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                    Chuyên cung cấp dịch vụ vận chuyển hành khách cao cấp, đón trả tận nơi tại Bãi
                    Cháy, Hòn Gai, Cẩm Phả, Hải Phòng, Thái Bình, Nam Định, Tràng An, Tam Cốc. Xe
                    đời mới, ghế massage, wifi miễn phí, tài xế lịch sự.
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
                    Caption & Helpers
                  </span>
                  <p className="text-xs text-slate-500">
                    * Giá vé đã bao gồm bảo hiểm hành khách, nước suối và khăn lạnh suốt hành trình.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 3. Button Component Matrix */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                3. Nút bấm tương tác (Button Variants & Sizes)
              </h2>

              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">Các Biến Thể (Variants)</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="primary" leftIcon={<Calendar className="w-4 h-4" />}>
                      Primary Gold
                    </Button>
                    <Button variant="secondary" leftIcon={<Car className="w-4 h-4" />}>
                      Secondary Navy
                    </Button>
                    <Button variant="outline">Outline Slate</Button>
                    <Button variant="goldOutline">Outline Gold</Button>
                    <Button variant="ghost">Ghost Button</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">Kích thước (Sizes - Touch Friendly)</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button size="sm">Small (36px)</Button>
                    <Button size="md">Medium (44px min-touch)</Button>
                    <Button size="lg">Large (48px)</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-slate-700">Trạng thái (States)</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="primary"
                      isLoading={isLoadingButton}
                      onClick={handleSimulateLoading}
                    >
                      Bấm Thử Nghiệm Loading
                    </Button>
                    <Button variant="primary" disabled>
                      Disabled State
                    </Button>
                    <IconButton aria-label="Gọi điện" variant="primary">
                      <Phone className="w-5 h-5" />
                    </IconButton>
                    <IconButton aria-label="Tìm kiếm" variant="outline">
                      <Search className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 4. Form Components */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                4. Thành phần nhập liệu (Form Elements)
              </h2>

              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl">
                  <Input
                    label="Họ và tên hành khách"
                    placeholder="Ví dụ: Nguyễn Văn A"
                    required
                    helperText="Họ tên để tài xế gọi đón"
                  />

                  <Input
                    label="Số điện thoại"
                    placeholder="0868680944"
                    required
                    leftIcon={<Phone className="w-4 h-4" />}
                    error="Số điện thoại phải có 10 chữ số hợp lệ"
                  />

                  <Select
                    label="Điểm xuất phát"
                    required
                    options={[
                      { value: 'qn', label: 'Quảng Ninh (Hạ Long, Cẩm Phả, Uông Bí)' },
                      { value: 'hp', label: 'Hải Phòng (Nội thành, Đồ Sơn, Cát Hải)' },
                      { value: 'tb', label: 'Thái Bình' },
                      { value: 'nd', label: 'Nam Định' },
                      { value: 'nb', label: 'Ninh Bình (TP Ninh Bình, Tràng An, Tam Cốc)' },
                    ]}
                  />

                  <Select
                    label="Loại xe yêu cầu"
                    options={[
                      { value: '11', label: 'Limousine VIP 11 chỗ' },
                      { value: '7', label: 'Xe 7 chỗ MPV cao cấp' },
                      { value: '16', label: 'Xe Transit 16 chỗ' },
                      { value: '29', label: 'Xe Universe 29 chỗ' },
                    ]}
                  />

                  <div className="md:col-span-2">
                    <Textarea
                      label="Địa chỉ đón & ghi chú"
                      placeholder="Nhập số nhà, tên khách sạn hoặc địa danh cụ thể cần xe đến đón..."
                      helperText="Nhà xe hỗ trợ đón trả miễn phí tận nơi trong bán kính 5km nội thành"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3 pt-2">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-700 uppercase">Hình thức dịch vụ</p>
                      <div className="flex flex-wrap gap-4">
                        <Radio
                          id="opt-limo"
                          name="service"
                          label="Vé xe ghép Limousine"
                          checked={selectedRadio === 'limousine'}
                          onChange={() => setSelectedRadio('limousine')}
                        />
                        <Radio
                          id="opt-contract"
                          name="service"
                          label="Thuê xe nguyên chuyến hợp đồng"
                          checked={selectedRadio === 'contract'}
                          onChange={() => setSelectedRadio('contract')}
                        />
                        <Radio
                          id="opt-cargo"
                          name="service"
                          label="Gửi hàng hóa hỏa tốc"
                          checked={selectedRadio === 'cargo'}
                          onChange={() => setSelectedRadio('cargo')}
                        />
                      </div>
                    </div>

                    <Checkbox
                      id="terms"
                      label="Tôi đồng ý với chính sách và quy định đón trả của nhà xe"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      description="Nhà xe cam kết đúng giờ và không phụ thu thêm bất kỳ chi phí phát sinh."
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 5. Badges & Status Indicators */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                5. Huy hiệu trạng thái (Badges & Tags)
              </h2>

              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-wrap gap-2.5">
                  <Badge variant="navy">Navy VIP</Badge>
                  <Badge variant="gold" dot>
                    Gold Sang Trọng
                  </Badge>
                  <Badge variant="success" dot>
                    Đã Hoàn Thành
                  </Badge>
                  <Badge variant="warning" dot>
                    Đang Liên Hệ
                  </Badge>
                  <Badge variant="danger" dot>
                    Đã Hủy
                  </Badge>
                  <Badge variant="info">Mới Tiếp Nhận</Badge>
                  <Badge variant="outline">Bảo Dưỡng Định Kỳ</Badge>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 6. Cards & Containers */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                6. Bố cục Card (Cards & Surfaces)
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card hover>
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-700 flex items-center justify-center mb-2">
                      <Star className="w-5 h-5 fill-gold-500 text-gold-500" />
                    </div>
                    <CardTitle>Limousine VIP 11 Chỗ</CardTitle>
                    <CardDescription>
                      Dòng xe DCar President đẳng cấp với ghế ngả massage 180 độ, cổng sạc Type-C,
                      nước suối khăn lạnh.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-navy-950">
                      280.000 <span className="text-sm font-semibold text-slate-500">₫/vé</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-emerald-600 font-medium">● Còn 5 chỗ chuyến 08:00</span>
                    <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      Chọn Chuyến
                    </Button>
                  </CardFooter>
                </Card>

                <Card hover>
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                      <Car className="w-5 h-5" />
                    </div>
                    <CardTitle>Thuê Xe Hợp Đồng</CardTitle>
                    <CardDescription>
                      Phục vụ trọn gói từ 5 đến 29 chỗ đi sự kiện, cưới hỏi, đón tiễn sân bay Cát Bi
                      - Vân Đồn - Nội Bài.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-navy-950">
                      Báo giá nhanh <span className="text-sm font-semibold text-slate-500">theo lộ trình</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-slate-500">Đón tận nhà 24/7</span>
                    <Button variant="secondary" size="sm">
                      Tư Vấn Ngay
                    </Button>
                  </CardFooter>
                </Card>

                <Card hover>
                  <CardHeader>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5" />
                    </div>
                    <CardTitle>Vận Chuyển Hàng Hóa</CardTitle>
                    <CardDescription>
                      Nhận gửi bưu phẩm, tài liệu, hải sản tươi sống bảo quản lạnh giao trong ngày
                      tại các văn phòng tuyến xe.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-black text-navy-950">
                      Từ 80.000 <span className="text-sm font-semibold text-slate-500">₫/kiện</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <span className="text-xs text-gold-600 font-medium">Bảo hiểm 100% hàng</span>
                    <Button variant="outline" size="sm">
                      Gửi Hàng
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 7. Alerts & Notification Feedback */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                7. Thông báo trạng thái (Alerts & Toast)
              </h2>

              <div className="space-y-3 max-w-3xl">
                <Alert
                  variant="info"
                  title="Lưu ý đón khách tại Bãi Cháy"
                  onDismiss={() => {}}
                >
                  Xe xuất bến đúng 08:00. Quý khách vui lòng có mặt tại điểm hẹn trước 10 phút để
                  tài xế hỗ trợ sắp xếp hành lý.
                </Alert>

                <Alert variant="success" title="Đặt cọc thành công">
                  Chúng tôi đã nhận được thanh toán cọc 200.000đ cho mã đơn BK202609110001.
                </Alert>

                <Alert variant="warning" title="Thời tiết mưa bão">
                  Tuyến cao tốc Hạ Long - Hải Phòng có thể di chuyển chậm hơn 15 phút do trời mưa.
                </Alert>

                <Alert variant="danger" title="Mã đơn không tồn tại">
                  Không tìm thấy thông tin chuyến xe với số điện thoại đã cung cấp. Vui lòng kiểm tra lại.
                </Alert>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Bell className="w-4 h-4" />}
                    onClick={() => success('Đã gửi mã xác nhận qua Zalo thành công!', 'Thông báo')}
                  >
                    Kích Hoạt Toast Success
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => error('Không thể kết nối máy chủ dữ liệu!', 'Lỗi mạng')}
                  >
                    Kích Hoạt Toast Error
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => warning('Chuyến xe chỉ còn 1 ghế trống duy nhất!', 'Cảnh báo')}
                  >
                    Kích Hoạt Toast Warning
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => info('Hotline hỗ trợ trực tuyến: 0868680944', 'Trợ giúp')}
                  >
                    Kích Hoạt Toast Info
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 8. Skeletons & Loading */}
        <Section spacing="sm">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                8. Trạng thái chờ tải (Skeletons & Spinners)
              </h2>

              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200 space-y-6 max-w-2xl">
                <div className="flex items-center gap-6">
                  <Spinner size="sm" variant="gold" />
                  <Spinner size="md" variant="gold" />
                  <Spinner size="lg" variant="navy" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circular" className="w-10 h-10" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton variant="text" className="w-1/3" />
                      <Skeleton variant="text" className="w-1/2" />
                    </div>
                  </div>
                  <Skeleton variant="rectangular" className="h-20 w-full" />
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Divider />

        {/* 9. Modal / Dialog Showcase */}
        <Section spacing="md">
          <Container>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-navy-950">
                9. Cửa sổ bật lên (Modal / Dialog)
              </h2>

              <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200">
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Mở Cửa Sổ Modal Thử Nghiệm
                </Button>

                <Modal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  title="Xác nhận thông tin đặt vé Limousine"
                  description="Vui lòng kiểm tra lại thông tin trước khi hoàn tất đặt vé"
                  footer={
                    <>
                      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                        Quay Lại
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setIsModalOpen(false);
                          success('Yêu cầu đặt vé của bạn đã được tiếp nhận!', 'Thành công');
                        }}
                      >
                        Xác Nhận Đặt Vé
                      </Button>
                    </>
                  }
                >
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tuyến đường:</span>
                        <span className="font-bold text-navy-950">Quảng Ninh ⇄ Ninh Bình</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Giờ khởi hành:</span>
                        <span className="font-bold text-navy-950">08:00 - Ngày 15/09/2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Số lượng khách:</span>
                        <span className="font-bold text-navy-950">2 hành khách</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2">
                        <span className="text-slate-500 font-medium">Tổng tiền dự kiến:</span>
                        <span className="font-black text-gold-600 text-base">560.000 ₫</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Nhà xe sẽ liên hệ xác nhận điểm đón chính xác trong vòng 5-10 phút qua số điện
                      thoại bạn cung cấp.
                    </p>
                  </div>
                </Modal>
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

export default function UIPreviewPage() {
  return (
    <ToastProvider>
      <UIPreviewContent />
    </ToastProvider>
  );
}

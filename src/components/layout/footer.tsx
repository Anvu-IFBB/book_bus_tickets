import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/ui/container';
import { APP_CONFIG, DEFAULT_ROUTES } from '@/lib/constants/config';
import {
  Phone,
  MapPin,
  Clock,
  Compass,
  ExternalLink,
  ShieldCheck,
  Truck,
  Car,
  Lock,
} from 'lucide-react';

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 text-sm">
      {/* Top Banner Feature Bar */}
      <div className="border-b border-navy-800/80 bg-navy-900/50 py-6">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Đón Trả Tận Nơi</h4>
                <p className="text-xs text-slate-400">Nội thành các tỉnh và điểm du lịch</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Đúng Giờ Tuyệt Đối</h4>
                <p className="text-xs text-slate-400">Không bắt khách dọc đường</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Xe VIP Ghế Massage</h4>
                <p className="text-xs text-slate-400">DCar President 11 - 16 - 29 chỗ</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Chuyển Hàng Siêu Tốc</h4>
                <p className="text-xs text-slate-400">Giao nhận hỏa tốc trong ngày</p>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Footer Links */}
      <div className="py-12 sm:py-16">
        <Container size="xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shrink-0">
                  <Compass className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-lg font-black text-white tracking-wider block">
                    LIMOUSINE <span className="text-gold-400">VIP</span>
                  </span>
                  <span className="text-[11px] text-slate-400">Vận tải hành khách cao cấp</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Chuyên tuyến limousine cao tốc Quảng Ninh - Hải Phòng - Thái Bình - Nam Định - Ninh Bình.
                Cam kết phục vụ tận tâm, văn minh, tiện nghi chuẩn 5 sao.
              </p>

              <div className="space-y-2 pt-1 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <span>{APP_CONFIG.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{APP_CONFIG.workingHours}</span>
                </div>
              </div>
            </div>

            {/* Column 2: Major Routes */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider">
                Tuyến Xe Trọng Điểm
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                {DEFAULT_ROUTES.slice(0, 5).map((route, i) => (
                  <li key={i} className="flex items-center justify-between hover:text-gold-400 transition-colors">
                    <span>
                      {route.departure} ⇄ {route.destination}
                    </span>
                    <span className="text-xs text-gold-500/90 font-medium">Từ {route.basePrice / 1000}k</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-slate-500 italic pt-1">
                * Có xe đưa đón trả tận nơi tại các khu resort, khách sạn, điểm du lịch.
              </p>
            </div>

            {/* Column 3: Services */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider">
                Dịch Vụ Cung Cấp
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-400">
                <li>
                  <Link href="/dich-vu#ve-limousine" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span>•</span> Vé xe Limousine VIP hàng ngày
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu#thue-xe-hop-dong" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span>•</span> Thuê xe hợp đồng 5 - 29 chỗ
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu#gui-hang-hoa" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span>•</span> Nhận gửi hàng hóa hỏa tốc
                  </Link>
                </li>
                <li>
                  <Link href="/dich-vu#xe-du-lich" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span>•</span> Xe đưa đón các khu du lịch
                  </Link>
                </li>
                <li>
                  <Link href="/cam-ket" className="hover:text-gold-400 transition-colors flex items-center gap-1.5">
                    <span>•</span> Cam kết chất lượng dịch vụ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Hotline */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-sm sm:text-base uppercase tracking-wider">
                Tổng Đài Đặt Vé 24/7
              </h3>

              <div className="space-y-2">
                <a
                  href={`tel:${APP_CONFIG.hotlines[0]}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block leading-tight">Hotline chính:</span>
                    <span className="text-base font-extrabold text-gold-400 group-hover:text-gold-300">
                      {APP_CONFIG.hotlines[0]}
                    </span>
                  </div>
                </a>

                <a
                  href={`tel:${APP_CONFIG.hotlines[1]}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-navy-900 border border-navy-800 hover:border-gold-500/50 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block leading-tight">Hotline phụ xe:</span>
                    <span className="text-base font-extrabold text-gold-400 group-hover:text-gold-300">
                      {APP_CONFIG.hotlines[1]}
                    </span>
                  </div>
                </a>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href={APP_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-900 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 border border-navy-800 transition-colors"
                >
                  <FacebookIcon className="w-4 h-4 text-blue-400" />
                  <span>Facebook: {APP_CONFIG.facebookName}</span>
                </a>

                <a
                  href={APP_CONFIG.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-900 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-800 border border-navy-800 transition-colors"
                >
                  <span>Zalo</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-900 py-6 text-xs text-slate-500">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <p>
              © {currentYear} {APP_CONFIG.name}. Bản quyền thuộc về nhà xe.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/gioi-thieu" className="hover:text-gold-400 transition-colors">
                Giới thiệu
              </Link>
              <span>•</span>
              <Link href="/cam-ket" className="hover:text-gold-400 transition-colors">
                Cam kết chất lượng
              </Link>
              <span>•</span>
              <Link href="/tra-cuu" className="hover:text-gold-400 transition-colors">
                Tra cứu đơn
              </Link>
              <span>•</span>
              <Link href="/ui-preview" className="hover:text-slate-400 transition-colors">
                UI Showcase
              </Link>
              <span>•</span>
              <Link
                href="/admin/login"
                className="hover:text-gold-400 transition-colors flex items-center gap-1"
              >
                <Lock className="w-3 h-3" />
                <span>Quản trị viên</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

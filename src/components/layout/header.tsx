'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { APP_CONFIG } from '@/lib/constants/config';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Container } from '@/components/ui/container';
import {
  Phone,
  Menu,
  X,
  Compass,
  Search,
  MessageSquare,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ' },
  { href: '/#tuyen-duong', label: 'Tuyến đường' },
  { href: '/#dich-vu', label: 'Dịch vụ' },
  { href: '/tra-cuu', label: 'Tra cứu đơn' },
  { href: '/#danh-gia', label: 'Đánh giá' },
  { href: '/#lien-he', label: 'Liên hệ' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Khóa scroll khi mở menu mobile
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-200 border-b',
        isScrolled
          ? 'bg-navy-950/95 backdrop-blur-md border-navy-800 shadow-md py-2.5 sm:py-3'
          : 'bg-navy-950 border-navy-900 py-3 sm:py-4'
      )}
    >
      <Container size="xl">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" aria-hidden="true" />
            </div>

            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-wider text-white uppercase leading-tight group-hover:text-gold-400 transition-colors">
                LIMOUSINE <span className="text-gold-400">VIP</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide truncate max-w-[170px] sm:max-w-none">
                Quảng Ninh ⇄ Ninh Bình
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Điều hướng chính"
            className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-300"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-lg transition-colors hover:text-gold-400 hover:bg-navy-900/80',
                    isActive ? 'text-gold-400 font-semibold' : 'text-slate-300'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Hotline Call button on desktop */}
            <a
              href={`tel:${APP_CONFIG.primaryHotline}`}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-900 text-gold-400 hover:bg-navy-800 transition-colors border border-navy-700/60 text-xs sm:text-sm font-bold tracking-wide"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-400 animate-pulse" aria-hidden="true" />
              <span>{APP_CONFIG.hotlines[0]}</span>
            </a>

            {/* Quick Booking CTA on desktop */}
            <Link href="/#dat-xe" className="hidden md:inline-flex">
              <Button variant="primary" size="sm" leftIcon={<Calendar className="w-4 h-4" />}>
                Đặt Vé Nhanh
              </Button>
            </Link>

            {/* Mobile Hotline Quick Action */}
            <a
              href={`tel:${APP_CONFIG.primaryHotline}`}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-gold-500 text-navy-950 shadow-sm"
              aria-label={`Gọi ngay tổng đài ${APP_CONFIG.primaryHotline}`}
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <IconButton
              aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu điều hướng'}
              aria-expanded={isMobileMenuOpen}
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-slate-300 hover:text-white hover:bg-navy-900"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </IconButton>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[61px] sm:top-[69px] bottom-0 z-50 bg-navy-950/98 backdrop-blur-xl border-t border-navy-800 overflow-y-auto flex flex-col justify-between p-5 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2">
              Danh mục dịch vụ
            </p>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-medium text-slate-200 hover:text-gold-400 hover:bg-navy-900 transition-colors"
                >
                  <span>{link.label}</span>
                  <span className="text-slate-500">→</span>
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-navy-800 space-y-2">
              <Link
                href="/tra-cuu"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-navy-900"
              >
                <Search className="w-4 h-4 text-gold-400" />
                <span>Tra cứu tình trạng đơn vé</span>
              </Link>
              <Link
                href="/#danh-gia"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-navy-900"
              >
                <MessageSquare className="w-4 h-4 text-gold-400" />
                <span>Xem phản hồi hành khách</span>
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-navy-800 space-y-3">
            <div className="bg-navy-900/90 rounded-xl p-4 border border-navy-800 text-center space-y-1">
              <p className="text-xs text-slate-400 font-medium">Tổng đài đặt vé & gửi hàng 24/7</p>
              <a
                href={`tel:${APP_CONFIG.primaryHotline}`}
                className="text-lg font-extrabold text-gold-400 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                {APP_CONFIG.hotlineDisplay}
              </a>
            </div>

            <Link href="/#dat-xe" onClick={() => setIsMobileMenuOpen(false)} className="block w-full">
              <Button variant="primary" size="lg" fullWidth leftIcon={<Calendar className="w-5 h-5" />}>
                Đặt Vé Limousine Ngay
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Cam kết giữ chỗ 100% - Không tăng giá vé</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Bus,
  Users,
  Route,
  ArrowLeft,
  X,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { APP_CONFIG } from '@/lib/constants/config';
import { useAdminAuth } from './admin-auth-context';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, role, logout } = useAdminAuth();
  
  // Note: Since this is a client component, we use the role from context
  // The actual data is protected server-side
  const NAV_ITEMS = [
    {
      label: 'Tổng Quan Vận Hành',
      href: '/admin',
      icon: LayoutDashboard,
      show: true,
    },
    {
      label: 'Báo Cáo Thống Kê',
      href: '/admin/analytics',
      icon: LayoutDashboard, // Use LayoutDashboard or BarChart if imported
      show: role ? ['ADMIN', 'OPERATOR'].includes(role) : false,
    },
    {
      label: 'Quản Lý Booking',
      href: '/admin/bookings',
      icon: CalendarCheck,
      show: true,
    },
    {
      label: 'Quản Lý Đội Xe',
      href: '/admin/vehicles',
      icon: Bus,
      show: true,
    },
    {
      label: 'Quản Lý Tài Xế',
      href: '/admin/drivers',
      icon: Users,
      show: true,
    },
    {
      label: 'Điều Phối Chuyến Xe',
      href: '/admin/trips',
      icon: Route,
      show: true,
    },
  ];

  const roleLabel =
    role === 'ADMIN'
      ? 'Quản Trị Viên'
      : role === 'OPERATOR'
      ? 'Điều Hành Viên'
      : role === 'MANAGER'
      ? 'Quản Lý'
      : role === 'STAFF'
      ? 'Nhân Viên'
      : 'Hệ Thống';

  const navContent = (
    <div className="flex flex-col h-full bg-navy-950 text-slate-200 border-r border-navy-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-navy-800 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3 group focus:outline-none">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold font-serif shadow-goldGlow shrink-0">
            L
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base tracking-wider text-white group-hover:text-gold-400 transition-colors">
              LIMOUSINE VIP
            </span>
            <span className="text-[10px] text-gold-400 tracking-widest font-semibold uppercase">
              Hệ Thống Điều Hành
            </span>
          </div>
        </Link>

        {/* Close Button Mobile */}
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          aria-label="Đóng thanh điều hướng"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Menu quản trị">
        {NAV_ITEMS.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose()}
              className={cn(
                'flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px]',
                isActive
                  ? 'bg-gold-500 text-navy-950 font-semibold shadow-goldGlow'
                  : 'text-slate-300 hover:text-white hover:bg-navy-900/80'
              )}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-navy-950' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile & Public Site Link */}
      <div className="p-4 border-t border-navy-800 space-y-3 bg-navy-950/60">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-navy-900/80 border border-navy-800">
          <div className="w-9 h-9 rounded-full bg-navy-800 border border-gold-500/30 flex items-center justify-center text-gold-400 shrink-0 shadow-inner">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-white truncate">
                {user?.displayName || 'Trực Ban Điều Hành'}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                {roleLabel}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                {user?.email || APP_CONFIG.primaryHotline}
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg border border-navy-700 text-xs font-medium text-slate-300 hover:text-white hover:bg-navy-900 transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Xem Website Khách</span>
        </Link>

        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-red-900/40 text-xs font-medium text-red-400 hover:text-white hover:bg-red-950/60 transition-colors min-h-[38px] cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng Xuất</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (Slide in) */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 lg:hidden transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </div>
    </>
  );
}

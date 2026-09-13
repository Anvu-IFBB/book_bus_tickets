import type { Metadata } from 'next';
import { AdminLayoutShell } from './admin-layout-shell';

export const metadata: Metadata = {
  title: {
    template: '%s | Điều Hành Vận Tải Limousine VIP',
    default: 'Trung Tâm Điều Hành & Quản Lý Đội Xe | Limousine VIP',
  },
  description: 'Hệ thống quản lý booking, điều phối xe, tài xế và giám sát hành trình Limousine Quảng Ninh - Ninh Bình',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}

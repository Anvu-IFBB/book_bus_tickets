import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/lib/constants/config';

const inter = Inter({
  subsets: ['vietnamese', 'latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_CONFIG.name}`,
    default: `${APP_CONFIG.name} - Đón Trả Tận Nơi, Đúng Giờ, Uy Tín`,
  },
  description: APP_CONFIG.description,
  keywords: [
    'limousine quảng ninh ninh bình',
    'xe limousine hải phòng thái bình',
    'đặt vé limousine nam định',
    'thuê xe hợp đồng 5 7 11 16 29 chỗ',
    'gửi hàng limousine bắc trung',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#071A2B',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-gold-500/20 selection:text-navy-900">
        {children}
      </body>
    </html>
  );
}

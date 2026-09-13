import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Chỉ áp dụng middleware cho các đường dẫn quản trị /admin/*
  if (pathname.startsWith('/admin')) {
    // Không chặn trang đăng nhập
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Kiểm tra session cookie
    const sessionCookie = request.cookies.get('admin_session');

    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

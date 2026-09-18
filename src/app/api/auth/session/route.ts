import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminAuth } from '@/lib/firebase/admin';
import { isFirebaseAdminConfigured } from '@/lib/firebase/config';
import { AuthUser, UserRole } from '@/types/auth';
import { signSession, verifySession } from '@/lib/server/auth/getServerUser';

const SESSION_COOKIE_NAME = 'admin_session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { idToken, email, devBypass, password } = body;

    let user: AuthUser;

    // 1. Trường hợp sử dụng Firebase ID Token thật
    if (idToken && isFirebaseAdminConfigured()) {
      const adminAuth = getAdminAuth();
      if (!adminAuth) {
        return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
      }

      const decoded = await adminAuth.verifyIdToken(idToken);
      const role: UserRole = (decoded.role as UserRole) || (decoded.email === 'admin@limousine.vn' ? 'ADMIN' : 'OPERATOR');

      user = {
        id: decoded.uid,
        email: decoded.email || '',
        displayName: decoded.name || decoded.email?.split('@')[0] || 'Admin',
        role,
        active: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    } else if (process.env.NODE_ENV !== 'production' && (devBypass || !isFirebaseAdminConfigured())) {
      // 2. Chế độ Local Dev / Fallback khi chưa có credentials Firebase
      // Kiểm tra mật khẩu demo cơ bản
      if (password && password !== 'admin123' && password !== 'operator123') {
        return NextResponse.json({ error: 'Mật khẩu không chính xác (Thử: admin123)' }, { status: 401 });
      }

      const role: UserRole = email === 'operator@limousine.vn' || password === 'operator123' ? 'OPERATOR' : 'ADMIN';
      user = {
        id: `dev-user-${Date.now()}`,
        email: email || 'admin@limousine.vn',
        displayName: role === 'ADMIN' ? 'Quản Trị Viên (Dev)' : 'Điều Hành Viên (Dev)',
        role,
        active: true,
        lastLoginAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: 'Invalid authentication request' }, { status: 400 });
    }

    // Thiết lập HttpOnly Cookie
    const cookieStore = await cookies();
    const sessionPayload = signSession(user);

    cookieStore.set(SESSION_COOKIE_NAME, sessionPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie || !sessionCookie.value) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  const user = verifySession(sessionCookie.value);
  if (!user) {
    return NextResponse.json({ isAuthenticated: false, user: null });
  }

  return NextResponse.json({ isAuthenticated: true, user });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return NextResponse.json({ success: true });
}

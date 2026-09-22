'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Bus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, Button, Input } from '@/components/ui';
import { getFirebaseAuth } from '@/lib/firebase/client';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const firebaseReady = isFirebaseConfigured();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let idToken: string | undefined;

      // 1. Nếu Firebase Client được cấu hình, thử đăng nhập qua Firebase Auth
      if (firebaseReady) {
        const auth = getFirebaseAuth();
        if (auth) {
          try {
            const userCred = await signInWithEmailAndPassword(auth, email, password);
            idToken = await userCred.user.getIdToken();
          } catch (authErr: unknown) {
            const msg = authErr instanceof Error ? authErr.message : String(authErr);
            // Nếu lỗi Firebase, hiển thị thông báo thân thiện
            if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password') || msg.includes('auth/user-not-found')) {
              throw new Error('Email hoặc mật khẩu không chính xác.');
            }
            throw new Error(`Lỗi xác thực Firebase: ${msg}`);
          }
        }
      }

      // 2. Gửi token hoặc credentials lên Session API Server
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          idToken,
          devBypass: !firebaseReady,
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        await res.text(); // Consume the body but ignore it
        if (!res.ok) {
          throw new Error(`Đăng nhập thất bại (HTTP ${res.status}). Server không trả về JSON hợp lệ.`);
        }
        throw new Error('Lỗi phản hồi từ server: Không phải định dạng JSON.');
      }

      if (!res.ok) {
        throw new Error(data?.error || `Đăng nhập thất bại (HTTP ${res.status}). Vui lòng thử lại.`);
      }

      setSuccessMessage(`Đăng nhập thành công với vai trò ${data.user.role}! Đang chuyển hướng...`);
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDevLogin = async (role: 'ADMIN' | 'OPERATOR') => {
    setLoading(true);
    setErrorMessage(null);
    const devEmail = role === 'ADMIN' ? 'admin@limousine.vn' : 'operator@limousine.vn';
    const devPass = role === 'ADMIN' ? 'admin123' : 'operator123';

    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: devEmail,
          password: devPass,
          devBypass: true,
        }),
      });

      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        await res.text(); // Consume the body but ignore it
        if (!res.ok) {
          throw new Error(`Đăng nhập nhanh thất bại (HTTP ${res.status}). Server không trả về JSON hợp lệ.`);
        }
        throw new Error('Lỗi phản hồi từ server: Không phải định dạng JSON.');
      }

      if (!res.ok) throw new Error(data?.error || `Đăng nhập nhanh thất bại (HTTP ${res.status})`);

      setSuccessMessage(`Đăng nhập thành công với tài khoản ${role}!`);
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-950 via-navy-900 to-slate-950 flex flex-col justify-center items-center px-4 sm:px-6 py-12 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-950 shadow-lg shadow-gold-500/20 mb-2">
            <Bus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
            Cổng Điều Hành Limousine VIP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Hệ thống quản trị & điều phối xe tuyến Quảng Ninh - Ninh Bình
          </p>
        </div>

        {/* Login Card */}
        <Card className="p-6 sm:p-8 bg-white/95 backdrop-blur-md shadow-2xl border-slate-200/80 rounded-2xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-gold-600" />
              <span>Đăng Nhập Quản Trị</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {firebaseReady ? 'Firebase Production' : 'Chế độ Test / Cục bộ'}
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2 text-xs text-emerald-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Quản Trị
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@limousine.vn"
                leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mật Khẩu
              </label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
                className="text-sm"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full text-sm font-semibold tracking-wide justify-center h-11"
              disabled={loading}
            >
              {loading ? (
                'Đang Xác Thực...'
              ) : (
                <>
                  Đăng Nhập Vào Hệ Thống
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </Button>
          </form>

          {/* Dev Quick Login Box */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
              Đăng Nhập Nhanh Môi Trường Test / Dev
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDevLogin('ADMIN')}
                disabled={loading}
                className="text-xs h-9 justify-center border-slate-200 hover:border-gold-500 hover:bg-gold-50/50"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-600 mr-1" />
                Admin Full
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickDevLogin('OPERATOR')}
                disabled={loading}
                className="text-xs h-9 justify-center border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 mr-1" />
                Điều Hành Viên
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-gold-400 transition-colors inline-flex items-center gap-1"
          >
            ← Quay lại trang chủ khách hàng
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-navy-950 flex items-center justify-center text-gold-400 text-sm">Đang tải cổng đăng nhập...</div>}>
      <LoginForm />
    </Suspense>
  );
}

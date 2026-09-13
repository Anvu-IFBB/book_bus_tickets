'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthUser, UserRole } from '@/types/auth';

export interface AdminAuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  canManageBookings: boolean;
  canAssignFleet: boolean;
  canModifySettings: boolean;
  canDeleteData: boolean;
  canManagePayments: boolean;
  canManageInvoices: boolean;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const defaultAuthContext: AdminAuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
  canManageBookings: false,
  canAssignFleet: false,
  canModifySettings: false,
  canDeleteData: false,
  canManagePayments: false,
  canManageInvoices: false,
  logout: async () => {},
  refreshSession: async () => {},
};

const AdminAuthContext = createContext<AdminAuthContextType>(defaultAuthContext);

export const useAdminAuth = () => useContext(AdminAuthContext);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.isAuthenticated && data.user ? data.user : null);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Lỗi kiểm tra phiên admin:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetch('/api/auth/session', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : { isAuthenticated: false, user: null }))
      .then((data) => {
        if (!ignore) {
          setUser(data.isAuthenticated && data.user ? data.user : null);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi kiểm tra phiên admin:', err);
        if (!ignore) {
          setUser(null);
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      setUser(null);
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
  }, [router]);

  const role: UserRole | null = user?.role || null;
  const isAdmin = role === 'ADMIN';
  const isOperator = role === 'OPERATOR';
  const isManager = role === 'MANAGER';
  const isStaff = role === 'STAFF';

  const canManageBookings = isAdmin || isOperator || isManager || isStaff;
  const canAssignFleet = isAdmin || isOperator || isManager;
  const canModifySettings = isAdmin; // Chỉ ADMIN được sửa cấu hình
  const canDeleteData = isAdmin; // Chỉ ADMIN được xóa dữ liệu cốt lõi
  const canManagePayments = isAdmin || isOperator;
  const canManageInvoices = isAdmin || isOperator;

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        role,
        canManageBookings,
        canAssignFleet,
        canModifySettings,
        canDeleteData,
        canManagePayments,
        canManageInvoices,
        logout,
        refreshSession: fetchSession,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

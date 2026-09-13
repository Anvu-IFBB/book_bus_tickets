'use client';

import React, { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminAuthProvider } from '@/components/admin/admin-auth-context';
import { ToastProvider } from '@/components/ui';

interface AdminLayoutContextType {
  openSidebar: () => void;
  closeSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType>({
  openSidebar: () => {},
  closeSidebar: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Không hiển thị sidebar trong trang đăng nhập
  if (pathname === '/admin/login') {
    return <ToastProvider>{children}</ToastProvider>;
  }

  return (
    <ToastProvider>
      <AdminAuthProvider>
        <AdminLayoutContext.Provider
          value={{
            openSidebar: () => setIsSidebarOpen(true),
            closeSidebar: () => setIsSidebarOpen(false),
          }}
        >
          <div className="min-h-screen flex bg-slate-50 text-slate-900 w-full max-w-full">
            <AdminSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 flex flex-col min-w-0 min-h-screen max-w-full">
              {children}
            </main>
          </div>
        </AdminLayoutContext.Provider>
      </AdminAuthProvider>
    </ToastProvider>
  );
}

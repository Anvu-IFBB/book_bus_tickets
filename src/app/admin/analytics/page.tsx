import React from 'react';
import { AdminHeader } from '@/components/admin/admin-header';
import { AnalyticsDashboard } from '@/components/admin/analytics/analytics-dashboard';
import { getAnalyticsSummaryAction } from '@/app/actions/analyticsActions';
import { requireAuth } from '@/lib/server/auth/requireAuth';
import { Permissions } from '@/lib/server/auth/permissions';
import { redirect } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Analytics Dashboard - Admin',
};

export default async function AnalyticsPage() {
  // 1. RBAC Check at Page Level
  const user = await requireAuth();
  if (!Permissions.canViewAnalytics(user.role)) {
    redirect('/admin'); // Or render a 403 page
  }

  // 2. Fetch initial data for SSR (THIS_MONTH by default)
  const initialFilter = 'THIS_MONTH';
  const res = await getAnalyticsSummaryAction({ filter: initialFilter });

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full">
      <AdminHeader
        title="Báo Cáo Thống Kê"
        description="Tổng quan doanh thu, đơn hàng, phản hồi và hiệu suất vận hành"
        onMenuClick={() => {}}
      />

      <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
        {!res.success ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-red-900 mb-2">Lỗi Tải Dữ Liệu</h3>
            <p className="text-red-700">{res.error || 'Có lỗi xảy ra khi tải báo cáo.'}</p>
          </div>
        ) : (
          <AnalyticsDashboard initialSummary={res.data} initialFilter={initialFilter} />
        )}
      </div>
    </div>
  );
}

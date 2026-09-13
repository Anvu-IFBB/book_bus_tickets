'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  AlertTriangle,
  CheckCircle2,
  Bus,
  Users,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Clock,
  RefreshCw,
  Ban,
  DollarSign,
  Info,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { KpiStatCard } from '@/components/admin/kpi-stat-card';
import { BookingStatusBadge } from '@/components/admin/status-badges';
import { useAdminLayout } from './admin-layout-shell';
import { useAdminAuth } from '@/components/admin/admin-auth-context';
import type { OperationsSummary } from '@/services/operationsService';
import { getOperationsSummaryAction } from '@/app/actions/operationsQueries';
import { formatCurrencyVN } from '@/lib/utils/formatters';
import { Card, Button } from '@/components/ui';

export default function AdminDashboardPage() {
  const { openSidebar } = useAdminLayout();
  const { user, role } = useAdminAuth();

  const [summary, setSummary] = useState<OperationsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    getOperationsSummaryAction()
      .then((sum) => {
        if (!ignore) {
          setSummary(sum);
          setErrorMsg(null);
          setLoading(false);
          setRefreshing(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error('Lỗi khi tải dữ liệu dashboard:', err);
          const msg = err instanceof Error ? err.message : 'Không thể kết nối cơ sở dữ liệu vận hành';
          setErrorMsg(msg);
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
  };

  const hasAnyData =
    summary &&
    (summary.totalBookingsToday > 0 ||
      Object.values(summary.bookingsByStatus).some((v) => v > 0) ||
      summary.totalTripsToday > 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full">
      <AdminHeader
        title="Tổng Quan Vận Hành"
        description="Giám sát tình trạng booking, trạng thái đội xe và điều phối chuyến theo thời gian thực"
        onMenuClick={openSidebar}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Banner Chào Mừng & Quyền Quản Trị */}
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-800 rounded-2xl p-5 sm:p-6 text-white border border-navy-800 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span>
                Ca Trực: {user?.displayName || 'Trực Ban'} ({role || 'OPERATOR'})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight">
              Trung Tâm Điều Hành Xe Limousine
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Hệ thống kết nối tuyến 5 tỉnh: Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/admin/bookings">
              <Button variant="primary" size="md" className="shadow-goldGlow text-xs sm:text-sm min-h-[44px]">
                Xử Lý Booking
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Error State */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="text-xs shrink-0">
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              Thử Lại
            </Button>
          </div>
        )}

        {/* Active Alerts Banner (Xe bảo dưỡng, Tài xế nghỉ ca) */}
        {summary && summary.activeAlerts.length > 0 && (
          <div className="space-y-2">
            {summary.activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium">{alert.message}</span>
                </div>
                <Link
                  href={alert.type === 'MAINTENANCE' ? '/admin/vehicles' : '/admin/drivers'}
                  className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline shrink-0"
                >
                  Xem chi tiết
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-28 bg-slate-200/80 rounded-2xl" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-56 bg-slate-200/80 rounded-2xl" />
              <div className="h-56 bg-slate-200/80 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {!loading && (
          <>
            {/* KPI Grid: 8 Chỉ Số Booking + Doanh Thu Thực Tế */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-700 font-serif flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-gold-600" />
                  Chỉ Số Booking & Doanh Thu Hôm Nay
                </h3>
                <span className="text-xs text-slate-500">Dữ liệu thực tế</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                {/* 1. Tổng đơn hôm nay */}
                <KpiStatCard
                  title="Tổng Đơn Hôm Nay"
                  value={summary?.totalBookingsToday ?? 0}
                  subtitle="Đặt vé, hợp đồng & gửi hàng"
                  icon={<CalendarCheck className="w-5 h-5" />}
                  variant="navy"
                />

                {/* 2. Đơn mới tiếp nhận */}
                <KpiStatCard
                  title="Đơn Mới Tiếp Nhận (NEW)"
                  value={summary?.bookingsByStatus.NEW ?? 0}
                  subtitle="Cần tiếp nhận & liên hệ"
                  icon={<Sparkles className="w-5 h-5" />}
                  variant="amber"
                />

                {/* 3. Đang liên hệ */}
                <KpiStatCard
                  title="Đang Liên Hệ (CONTACTING)"
                  value={summary?.bookingsByStatus.CONTACTING ?? 0}
                  subtitle="CSKH đang gọi tư vấn"
                  icon={<PhoneCall className="w-5 h-5" />}
                  variant="amber"
                />

                {/* 4. Đã xác nhận */}
                <KpiStatCard
                  title="Đã Xác Nhận (CONFIRMED)"
                  value={summary?.bookingsByStatus.CONFIRMED ?? 0}
                  subtitle="Chờ điều phối xe & tài xế"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  variant="blue"
                />

                {/* 5. Đã phân xe */}
                <KpiStatCard
                  title="Đã Phân Xe (ASSIGNED)"
                  value={summary?.bookingsByStatus.ASSIGNED ?? 0}
                  subtitle="Đã có xe & tài xế trực"
                  icon={<Bus className="w-5 h-5" />}
                  variant="blue"
                />

                {/* 6. Đang chạy */}
                <KpiStatCard
                  title="Đang Di Chuyển (IN_PROGRESS)"
                  value={summary?.bookingsByStatus.IN_PROGRESS ?? 0}
                  subtitle="Đang trên lộ trình 5 tỉnh"
                  icon={<Clock className="w-5 h-5" />}
                  variant="blue"
                />

                {/* 7. Hoàn thành */}
                <KpiStatCard
                  title="Đã Hoàn Thành (COMPLETED)"
                  value={summary?.bookingsByStatus.COMPLETED ?? 0}
                  subtitle="Hành khách đã tới đích"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                  variant="emerald"
                />

                {/* 8. Đã hủy */}
                <KpiStatCard
                  title="Đã Hủy (CANCELLED)"
                  value={summary?.bookingsByStatus.CANCELLED ?? 0}
                  subtitle="Hủy do khách/sự cố"
                  icon={<Ban className="w-5 h-5" />}
                  variant="rose"
                />
              </div>

              {/* Thẻ Doanh Thu Vận Hành Thực Tế */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-950 text-white border border-gold-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                      Tổng Doanh Thu Đơn Xác Nhận & Hoàn Thành
                    </p>
                    <p className="text-xl sm:text-2xl font-bold font-serif text-white mt-0.5">
                      {summary?.totalRevenue ? formatCurrencyVN(summary.totalRevenue) : '0 ₫'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  <span>Tính từ các đơn CONFIRMED, ASSIGNED, IN_PROGRESS & COMPLETED</span>
                </div>
              </div>
            </div>

            {/* Empty State nếu database hoàn toàn trống */}
            {!hasAnyData && (
              <Card className="p-8 text-center border-slate-200 space-y-3">
                <Info className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold font-serif text-navy-950">
                  Chưa Có Dữ Liệu Vận Hành Hôm Nay
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Hiện chưa có đơn đặt vé hoặc chuyến xe nào được ghi nhận trong ngày. Dữ liệu sẽ tự động hiển thị ngay khi có booking mới từ khách hàng.
                </p>
                <div className="pt-2">
                  <Link href="/dat-xe">
                    <Button variant="outline" size="sm" className="text-xs">
                      Tạo Booking Mẫu Thử Nghiệm
                    </Button>
                  </Link>
                </div>
              </Card>
            )}

            {/* Grid 2: Tình Trạng Đội Xe & Tài Xế */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card Đội Xe */}
              <Card className="p-5 border-slate-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center">
                      <Bus className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-navy-950 font-serif">Tình Trạng Đội Xe</h4>
                      <p className="text-xs text-slate-500">Đội xe 5-29 chỗ (DCar, Solati VIP)</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/vehicles"
                    className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
                  >
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-emerald-800">Sẵn Sàng</p>
                    <p className="text-2xl font-bold font-serif text-emerald-900 mt-1">
                      {summary?.fleetStatus.AVAILABLE ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-blue-800">Đã Phân</p>
                    <p className="text-2xl font-bold font-serif text-blue-900 mt-1">
                      {summary?.fleetStatus.ASSIGNED ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-indigo-800">Đang Chạy</p>
                    <p className="text-2xl font-bold font-serif text-indigo-900 mt-1">
                      {summary?.fleetStatus.IN_SERVICE ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-amber-800">Bảo Dưỡng</p>
                    <p className="text-2xl font-bold font-serif text-amber-900 mt-1">
                      {summary?.fleetStatus.MAINTENANCE ?? 0}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Card Tài Xế */}
              <Card className="p-5 border-slate-200/80">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-navy-950 font-serif">Tình Trạng Tài Xế</h4>
                      <p className="text-xs text-slate-500">Trực ca & phục vụ hành khách</p>
                    </div>
                  </div>
                  <Link
                    href="/admin/drivers"
                    className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
                  >
                    Chi tiết <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-emerald-800">Sẵn Sàng Nhận</p>
                    <p className="text-2xl font-bold font-serif text-emerald-900 mt-1">
                      {summary?.driverStatus.AVAILABLE ?? 0}
                    </p>
                  </div>
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-indigo-800">Trên Chuyến</p>
                    <p className="text-2xl font-bold font-serif text-indigo-900 mt-1">
                      {(summary?.driverStatus.ASSIGNED ?? 0) + (summary?.driverStatus.ON_TRIP ?? 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center">
                    <p className="text-[11px] font-semibold text-slate-700">Nghỉ Ca</p>
                    <p className="text-2xl font-bold font-serif text-slate-900 mt-1">
                      {summary?.driverStatus.OFF ?? 0}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Grid 3: Đơn Cần Xử Lý Gấp & Chuyến Sắp Chạy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Khối Đơn Cần Xử Lý Gấp (NEW / CONTACTING) */}
              <Card className="p-5 border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <h4 className="font-bold text-sm text-navy-950 font-serif">
                        Đơn Cần Xử Lý Gấp ({summary?.bookingsNeedingAttention.length ?? 0})
                      </h4>
                    </div>
                    <Link
                      href="/admin/bookings?status=NEW"
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
                    >
                      Lọc đơn mới <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {!summary?.bookingsNeedingAttention || summary.bookingsNeedingAttention.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">
                        Tuyệt vời! Không có đơn nào đang chờ xử lý gấp.
                      </p>
                    ) : (
                      summary.bookingsNeedingAttention.map((b) => (
                        <div key={b.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-navy-950">{b.bookingCode}</span>
                              <BookingStatusBadge status={b.bookingStatus} className="text-[10px] py-0 px-1.5" />
                            </div>
                            <p className="text-slate-600 truncate mt-0.5">
                              {b.customerName} - {b.departure} → {b.destination}
                            </p>
                          </div>
                          <Link href={`/admin/bookings/${b.id}`} className="shrink-0">
                            <Button variant="primary" size="sm" className="text-[11px] h-7 px-2.5">
                              Xử Lý
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>

              {/* Khối Chuyến Xe Hôm Nay */}
              <Card className="p-5 border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-bold text-sm text-navy-950 font-serif">
                        Chuyến Xe Hôm Nay ({summary?.upcomingTrips.length ?? 0})
                      </h4>
                    </div>
                    <Link
                      href="/admin/trips"
                      className="text-xs text-gold-600 hover:text-gold-700 font-medium flex items-center gap-1"
                    >
                      Quản lý chuyến <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {!summary?.upcomingTrips || summary.upcomingTrips.length === 0 ? (
                      <p className="py-6 text-center text-xs text-slate-400">
                        Hôm nay chưa có chuyến xe nào được xếp lịch.
                      </p>
                    ) : (
                      summary.upcomingTrips.map((t) => (
                        <div key={t.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-navy-950">{t.departureTime}</span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                {t.status}
                              </span>
                            </div>
                            <p className="text-slate-600 truncate mt-0.5">
                              Xe: {t.vehicleId || 'Chưa gán'} • TX: {t.driverId || 'Chưa gán'}
                            </p>
                          </div>
                          <Link href="/admin/trips" className="shrink-0">
                            <Button variant="outline" size="sm" className="text-[11px] h-7 px-2.5">
                              Điều Phối
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

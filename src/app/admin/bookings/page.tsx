'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Eye,
  Clock,
  MapPin,
  RefreshCw,
  AlertTriangle,
  ArrowRight,
  FilterX,
  Phone,
  User,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { BookingStatusBadge } from '@/components/admin/status-badges';
import { BookingDetailDrawer } from '@/components/admin/booking-detail-drawer';
import { AssignVehicleModal, AssignDriverModal } from '@/components/admin/assign-modals';

import type { EnrichedBooking, ListBookingsFilter } from '@/services/operationsService';
import { listBookingsWithDetailsAction } from '@/app/actions/operationsQueries';
import { Booking, BookingStatus, BookingServiceType } from '@/types/booking';
import { Card, Input, Select, Button } from '@/components/ui';

function BookingsContent() {

  const searchParams = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  const initialStatus = searchParams.get('status') || 'ALL';

  const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>(initialCode);
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [serviceFilter, setServiceFilter] = useState<string>('ALL');
  const [routeFilter, setRouteFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'created_desc' | 'date_desc' | 'date_asc'>('created_desc');

  // Selected booking for Drawer & Modals
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAssignVehicleOpen, setIsAssignVehicleOpen] = useState(false);
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    let ignore = false;
    const filter: ListBookingsFilter = {};
    if (statusFilter !== 'ALL') {
      filter.status = statusFilter as BookingStatus;
    }
    if (serviceFilter !== 'ALL') {
      filter.serviceType = serviceFilter as BookingServiceType;
    }
    if (routeFilter !== 'ALL') {
      filter.route = routeFilter;
    }
    if (dateFilter) {
      filter.date = dateFilter;
    }
    if (searchQuery.trim()) {
      filter.search = searchQuery.trim();
    }
    filter.sortBy = sortBy;

    listBookingsWithDetailsAction(filter, page, pageSize)
      .then((res) => {
        if (!ignore) {
          setBookings(res.items);
          setTotal(res.total);
          setTotalPages(res.totalPages);
          setErrorMsg(null);
          setLoading(false);
          setRefreshing(false);

          if (initialCode) {
            const matched = res.items.find((b) => b.bookingCode === initialCode);
            if (matched) {
              setSelectedBooking(matched);
              setIsDrawerOpen(true);
            }
          }
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error('Lỗi khi tải danh sách booking:', err);
          const msg = err instanceof Error ? err.message : 'Không thể tải danh sách booking';
          setErrorMsg(msg);
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [statusFilter, serviceFilter, routeFilter, dateFilter, searchQuery, sortBy, page, initialCode, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
  };

  // Reset trang về 1 khi thay đổi bộ lọc
  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setServiceFilter('ALL');
    setRouteFilter('ALL');
    setDateFilter('');
    setSortBy('created_desc');
    setPage(1);
  };

  const handleOpenDetail = (b: Booking) => {
    setSelectedBooking(b);
    setIsDrawerOpen(true);
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBookings((prev) =>
      prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
    );
    setSelectedBooking(updated);
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== 'ALL' ||
    serviceFilter !== 'ALL' ||
    routeFilter !== 'ALL' ||
    dateFilter ||
    sortBy !== 'created_desc';

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full">
      <AdminHeader
        title="Quản Lý Đơn Booking"
        description="Tìm kiếm theo mã, SĐT, tên khách; lọc trạng thái, dịch vụ và điều phối xe/tài xế"
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Bộ Lọc & Tìm Kiếm */}
        <Card className="p-4 sm:p-5 border-slate-200/80 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tìm kiếm (Mã đơn, SĐT, Tên khách)
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                placeholder="VD: BK2026, 0912..., Nguyễn Văn A"
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trạng thái
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái' },
                  { value: 'NEW', label: 'Mới tiếp nhận (NEW)' },
                  { value: 'CONTACTING', label: 'Đang liên hệ' },
                  { value: 'CONFIRMED', label: 'Đã xác nhận' },
                  { value: 'ASSIGNED', label: 'Đã phân xe' },
                  { value: 'IN_PROGRESS', label: 'Đang di chuyển' },
                  { value: 'COMPLETED', label: 'Đã hoàn thành' },
                  { value: 'CANCELLED', label: 'Đã hủy' },
                ]}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Service Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Dịch vụ
              </label>
              <Select
                value={serviceFilter}
                onChange={(e) => handleFilterChange(setServiceFilter, e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả dịch vụ' },
                  { value: 'LIMOUSINE', label: 'Vé Limousine VIP' },
                  { value: 'CONTRACT', label: 'Thuê xe hợp đồng' },
                  { value: 'CARGO', label: 'Gửi hàng hỏa tốc' },
                  { value: 'TOUR', label: 'Xe khu du lịch' },
                ]}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Route Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tỉnh / Tuyến
              </label>
              <Select
                value={routeFilter}
                onChange={(e) => handleFilterChange(setRouteFilter, e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả các tỉnh' },
                  { value: 'Quảng Ninh', label: 'Quảng Ninh' },
                  { value: 'Hải Phòng', label: 'Hải Phòng' },
                  { value: 'Thái Bình', label: 'Thái Bình' },
                  { value: 'Nam Định', label: 'Nam Định' },
                  { value: 'Ninh Bình', label: 'Ninh Bình' },
                ]}
                className="text-xs sm:text-sm"
              />
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Ngày di chuyển
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => handleFilterChange(setDateFilter, e.target.value)}
                className="w-full text-xs sm:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              />
            </div>
          </div>

          {/* Sắp xếp & Nút reset bộ lọc */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'created_desc' | 'date_desc' | 'date_asc')}
                className="rounded-lg border border-slate-300 px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
              >
                <option value="created_desc">Tạo mới nhất trước</option>
                <option value="date_desc">Ngày đi gần nhất trước</option>
                <option value="date_asc">Ngày đi xa nhất trước</option>
              </select>
            </div>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <FilterX className="w-3.5 h-3.5 mr-1" />
                Xóa bộ lọc
              </Button>
            )}
          </div>
        </Card>

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

        {/* Danh Sách Kết Quả */}
        <Card className="border-slate-200/80 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <div>
              <h3 className="text-xs sm:text-sm font-bold font-serif text-navy-950 uppercase tracking-wider">
                Danh Sách Booking ({total} kết quả)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Trang {page} / {totalPages}
              </p>
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="p-6 space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-lg" />
              ))}
            </div>
          )}

          {/* Desktop & Tablet Table (Anti-overflow với overflow-x-auto cục bộ) */}
          {!loading && (
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/90">
                    <th className="py-3 px-3">Mã Đơn</th>
                    <th className="py-3 px-3">Khách Hàng</th>
                    <th className="py-3 px-3">Dịch Vụ</th>
                    <th className="py-3 px-3">Lộ Trình</th>
                    <th className="py-3 px-3">Khởi Hành</th>
                    <th className="py-3 px-3">Xe / Tài Xế</th>
                    <th className="py-3 px-3">Trạng Thái</th>
                    <th className="py-3 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <div className="space-y-2">
                          <p>Không tìm thấy đơn booking nào phù hợp với bộ lọc.</p>
                          {hasActiveFilters && (
                            <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs">
                              Xóa tất cả bộ lọc
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Mã đơn */}
                        <td className="py-3 px-3 font-bold text-navy-950">
                          <Link
                            href={`/admin/bookings/${b.id}`}
                            className="hover:text-gold-600 transition-colors flex items-center gap-1"
                          >
                            <span>{b.bookingCode}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </Link>
                        </td>

                        {/* Khách hàng & SĐT */}
                        <td className="py-3 px-3">
                          <p className="font-semibold text-slate-900 truncate max-w-[150px]">
                            {b.customerName}
                          </p>
                          {b.customerPhone && (
                            <a
                              href={`tel:${b.customerPhone}`}
                              className="text-[11px] text-gold-700 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{b.customerPhone}</span>
                            </a>
                          )}
                        </td>

                        {/* Dịch vụ */}
                        <td className="py-3 px-3">
                          <span className="font-medium text-slate-800">
                            {b.serviceType === 'LIMOUSINE'
                              ? 'Limousine VIP'
                              : b.serviceType === 'CARGO'
                              ? 'Hàng Hóa HG'
                              : b.serviceType === 'CONTRACT'
                              ? 'Hợp Đồng'
                              : 'Tour Du Lịch'}
                          </span>
                        </td>

                        {/* Lộ trình */}
                        <td className="py-3 px-3 text-slate-700">
                          <span className="font-medium">{b.departure}</span> → <span>{b.destination}</span>
                        </td>

                        {/* Khởi hành */}
                        <td className="py-3 px-3 text-slate-600">
                          <div>{b.travelDate}</div>
                          <div className="text-[11px] text-slate-400">{b.travelTime}</div>
                        </td>

                        {/* Xe & Tài xế */}
                        <td className="py-3 px-3 text-slate-600">
                          <div>
                            Xe: <span className="font-medium text-slate-900">{b.vehiclePlate || b.vehicleName || '—'}</span>
                          </div>
                          <div>
                            TX: <span className="font-medium text-slate-900">{b.driverName || '—'}</span>
                          </div>
                        </td>

                        {/* Trạng thái */}
                        <td className="py-3 px-3">
                          <BookingStatusBadge status={b.bookingStatus} />
                        </td>

                        {/* Thao tác */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDetail(b)}
                              className="text-xs h-8 px-2 text-slate-700 hover:text-navy-950"
                              title="Xem nhanh drawer"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Nhanh
                            </Button>
                            <Link href={`/admin/bookings/${b.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs h-8 px-2 text-gold-700 border-gold-400/50 hover:bg-gold-50"
                                title="Trang chi tiết đầy đủ"
                              >
                                Chi Tiết
                                <ArrowRight className="w-3 h-3 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Mobile Card Layout (Stacking hoàn toàn, không horizontal overflow) */}
          {!loading && (
            <div className="md:hidden divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <p>Không tìm thấy đơn booking nào.</p>
                  {hasActiveFilters && (
                    <Button variant="outline" size="sm" onClick={handleClearFilters} className="text-xs">
                      Xóa bộ lọc
                    </Button>
                  )}
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 space-y-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/admin/bookings/${b.id}`}
                        className="font-bold text-navy-950 text-sm hover:text-gold-600 flex items-center gap-1"
                      >
                        <span>{b.bookingCode}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <BookingStatusBadge status={b.bookingStatus} />
                    </div>

                    <div className="text-xs text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span className="font-semibold">{b.customerName}</span>
                      {b.customerPhone && (
                        <a href={`tel:${b.customerPhone}`} className="text-gold-700 underline ml-1">
                          ({b.customerPhone})
                        </a>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span>{b.departure} → {b.destination}</span>
                    </div>

                    <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{b.travelDate} ({b.travelTime})</span>
                      </div>
                      <span className="font-medium text-gold-700">{b.serviceType}</span>
                    </div>

                    <div className="text-xs text-slate-600 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <div className="truncate max-w-[180px]">
                        Xe: <span className="font-medium text-slate-900">{b.vehiclePlate || '—'}</span> • TX:{' '}
                        <span className="font-medium text-slate-900">{b.driverName || '—'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(b)}
                          className="text-xs h-7 px-2"
                        >
                          Nhanh
                        </Button>
                        <Link href={`/admin/bookings/${b.id}`}>
                          <Button variant="primary" size="sm" className="text-xs h-7 px-2">
                            Chi Tiết
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Phân Trang (Pagination Controls) */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-500">
                Hiển thị {bookings.length} trên tổng số {total} đơn
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="h-8 px-2.5 text-xs"
                  aria-label="Trang trước"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                  Trước
                </Button>
                <span className="px-3 py-1 font-semibold text-slate-700 bg-slate-100 rounded-lg">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="h-8 px-2.5 text-xs"
                  aria-label="Trang tiếp theo"
                >
                  Sau
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Drawer Xem Nhanh Chi Tiết Booking */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onStatusUpdated={handleBookingUpdated}
        onOpenAssignVehicle={() => setIsAssignVehicleOpen(true)}
        onOpenAssignDriver={() => setIsAssignDriverOpen(true)}
      />

      {/* Modal Phân Xe (Tích hợp Conflict Engine) */}
      <AssignVehicleModal
        isOpen={isAssignVehicleOpen}
        onClose={() => setIsAssignVehicleOpen(false)}
        booking={selectedBooking}
        onSuccess={handleBookingUpdated}
      />

      {/* Modal Phân Tài Xế (Tích hợp Conflict Engine) */}
      <AssignDriverModal
        isOpen={isAssignDriverOpen}
        onClose={() => setIsAssignDriverOpen(false)}
        booking={selectedBooking}
        onSuccess={handleBookingUpdated}
      />
    </div>
  );
}

export default function AdminBookingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Đang tải trang quản lý booking...</div>}>
      <BookingsContent />
    </Suspense>
  );
}

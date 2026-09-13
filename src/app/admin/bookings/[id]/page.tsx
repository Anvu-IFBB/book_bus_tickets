'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  Bus,
  Users,
  Package,
  CheckCircle2,
  PhoneCall,
  Check,
  Play,
  XCircle,
  History,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  Building,
  Compass,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { BookingStatusBadge, PaymentStatusBadge } from '@/components/admin/status-badges';
import { AssignVehicleModal, AssignDriverModal } from '@/components/admin/assign-modals';
import { useAdminLayout } from '../../admin-layout-shell';
import { useAdminAuth } from '@/components/admin/admin-auth-context';
import type { EnrichedBooking } from '@/services/operationsService';
import { getBookingDetailsWithEnrichmentAction } from '@/app/actions/operationsQueries';
import { Booking, BookingStatus } from '@/types/booking';
import { formatCurrencyVN } from '@/lib/utils/formatters';
import { Card, Button, useToast } from '@/components/ui';
import { releaseVehicleAction, releaseDriverAction } from '@/app/actions/fleetActions';
import { updateBookingStatusAction } from '@/app/actions/bookingActions';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.id;

  const { openSidebar } = useAdminLayout();
  useAdminAuth();
  const { success, error } = useToast();

  const [booking, setBooking] = useState<EnrichedBooking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Modals state
  const [isAssignVehicleOpen, setIsAssignVehicleOpen] = useState<boolean>(false);
  const [isAssignDriverOpen, setIsAssignDriverOpen] = useState<boolean>(false);

  useEffect(() => {
    let ignore = false;
    getBookingDetailsWithEnrichmentAction(bookingId)
      .then((data) => {
        if (!ignore) {
          if (!data) {
            setErrorMsg(`Không tìm thấy đơn booking với mã/ID: "${bookingId}"`);
          } else {
            setBooking(data);
            setErrorMsg(null);
          }
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          console.error('Lỗi khi tải chi tiết đơn booking:', err);
          const msg = err instanceof Error ? err.message : 'Không thể tải thông tin đơn';
          setErrorMsg(msg);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [bookingId, refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((k) => k + 1);
  };

  const handleUpdateStatus = async (newStatus: BookingStatus, defaultNote: string) => {
    if (!booking) return;

    if (newStatus === 'CANCELLED') {
      const confirmed = window.confirm(`Bạn có chắc chắn muốn hủy đơn booking ${booking.bookingCode} không?`);
      if (!confirmed) return;
    }

    setSubmitting(true);
    try {
      const res = await updateBookingStatusAction(booking.id, newStatus, defaultNote);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      
      success(`Đã chuyển trạng thái sang "${newStatus}"`);
      setBooking((prev) => (prev ? { ...prev, ...res.data } : null));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Chuyển Trạng Thái');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassignVehicle = async () => {
    if (!booking || !booking.vehicleId) return;
    setSubmitting(true);
    try {
      const res = await releaseVehicleAction(booking.id);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      success('Đã hủy phân xe cho đơn');
      setBooking((prev) => (prev ? { ...prev, ...res.data, vehiclePlate: undefined, vehicleName: undefined } : null));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hủy Phân Xe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassignDriver = async () => {
    if (!booking || !booking.driverId) return;
    setSubmitting(true);
    try {
      const res = await releaseDriverAction(booking.id);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      success('Đã hủy phân tài xế cho đơn');
      setBooking((prev) => (prev ? { ...prev, ...res.data, driverName: undefined, driverPhone: undefined } : null));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hủy Phân Tài Xế');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookingUpdated = (updated: Booking) => {
    setBooking((prev) => (prev ? { ...prev, ...updated } : null));
    setRefreshKey((k) => k + 1);
  };

  const currentStatus = booking?.bookingStatus;

  return (
    <div className="flex-1 flex flex-col min-w-0 w-full">
      <AdminHeader
        title={booking ? `Đơn ${booking.bookingCode}` : 'Chi Tiết Booking'}
        description="Xem toàn bộ lịch sử, thông tin lộ trình và thao tác điều phối xe/tài xế"
        onMenuClick={openSidebar}
        onRefresh={handleRefresh}
        isRefreshing={loading}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl w-full mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/admin" className="hover:text-navy-950">
            Tổng Quan
          </Link>
          <span>/</span>
          <Link href="/admin/bookings" className="hover:text-navy-950">
            Quản Lý Booking
          </Link>
          <span>/</span>
          <span className="font-semibold text-navy-950 truncate max-w-[200px]">
            {booking?.bookingCode || bookingId}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-6 animate-pulse">
            <div className="h-32 bg-slate-200/80 rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200/80 rounded-2xl" />
              <div className="h-64 bg-slate-200/80 rounded-2xl" />
            </div>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && errorMsg && (
          <Card className="p-8 text-center border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-serif text-navy-950">
              Không Tìm Thấy Đơn Booking
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              {errorMsg}. Vui lòng kiểm tra lại mã hoặc ID đơn hàng trong hệ thống.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link href="/admin/bookings">
                <Button variant="outline" size="sm" className="text-xs">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Về Danh Sách Booking
                </Button>
              </Link>
              <Button variant="primary" size="sm" onClick={handleRefresh} className="text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Thử Lại
              </Button>
            </div>
          </Card>
        )}

        {/* Main Booking Details */}
        {!loading && booking && (
          <>
            {/* Header Card: Mã Đơn + Trạng Thái + Action Bar */}
            <div className="bg-navy-950 text-white p-5 sm:p-6 rounded-2xl border border-navy-800 shadow-card space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight text-white">
                      {booking.bookingCode}
                    </h2>
                    <BookingStatusBadge status={booking.bookingStatus} className="text-xs px-2.5 py-0.5" />
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      {booking.serviceType === 'LIMOUSINE'
                        ? 'Vé Limousine VIP'
                        : booking.serviceType === 'CARGO'
                        ? 'Gửi Hàng Hỏa Tốc (HG)'
                        : booking.serviceType === 'CONTRACT'
                        ? 'Hợp Đồng Xe'
                        : 'Tour Du Lịch'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Thời gian tạo: {new Date(booking.createdAt).toLocaleString('vi-VN')}
                    {booking.updatedAt && (
                      <span className="ml-2">
                        • Cập nhật: {new Date(booking.updatedAt).toLocaleTimeString('vi-VN')}
                      </span>
                    )}
                  </p>
                </div>

                <Link href="/admin/bookings">
                  <Button variant="outline" size="sm" className="text-xs text-slate-200 border-navy-700 hover:bg-navy-900">
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Về Danh Sách
                  </Button>
                </Link>
              </div>

              {/* Action Buttons theo State Machine */}
              <div className="pt-4 border-t border-navy-800/80 space-y-2">
                <p className="text-xs uppercase tracking-wider text-gold-400 font-semibold">
                  Thao Tác Điều Hành Khả Dụng (Trạng thái hiện tại: {currentStatus})
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* NEW -> CONTACTING */}
                  {currentStatus === 'NEW' && (
                    <Button
                      variant="goldOutline"
                      size="sm"
                      onClick={() => handleUpdateStatus('CONTACTING', 'Bắt đầu liên hệ tư vấn khách hàng')}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <PhoneCall className="w-3.5 h-3.5 mr-1.5" />
                      Bắt Đầu Liên Hệ
                    </Button>
                  )}

                  {/* CONTACTING / NEW -> CONFIRMED */}
                  {(currentStatus === 'CONTACTING' || currentStatus === 'NEW') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus('CONFIRMED', 'Đã xác nhận chốt đơn với khách')}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" />
                      Xác Nhận Đơn Hàng
                    </Button>
                  )}

                  {/* CONFIRMED / ASSIGNED -> ASSIGN VEHICLE */}
                  {(currentStatus === 'CONFIRMED' || currentStatus === 'ASSIGNED') && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAssignVehicleOpen(true)}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <Bus className="w-3.5 h-3.5 mr-1.5" />
                      {booking.vehicleId ? 'Đổi Xe Phục Vụ' : 'Phân Xe Cho Đơn'}
                    </Button>
                  )}

                  {/* CONFIRMED / ASSIGNED -> ASSIGN DRIVER */}
                  {(currentStatus === 'CONFIRMED' || currentStatus === 'ASSIGNED') && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setIsAssignDriverOpen(true)}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      {booking.driverId ? 'Đổi Tài Xế' : 'Phân Tài Xế'}
                    </Button>
                  )}

                  {/* ASSIGNED / CONFIRMED -> IN_PROGRESS */}
                  {(currentStatus === 'ASSIGNED' || currentStatus === 'CONFIRMED') && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus('IN_PROGRESS', 'Xe bắt đầu khởi hành đón khách')}
                      disabled={submitting}
                      className="text-xs bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" />
                      Khởi Hành Chuyến Đi
                    </Button>
                  )}

                  {/* IN_PROGRESS -> COMPLETED */}
                  {currentStatus === 'IN_PROGRESS' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUpdateStatus('COMPLETED', 'Khách đã tới nơi an toàn')}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Hoàn Thành Chuyến Đi
                    </Button>
                  )}

                  {/* CANCEL ACTION (Cho phép ở mọi trạng thái trừ COMPLETED và CANCELLED) */}
                  {currentStatus !== 'COMPLETED' && currentStatus !== 'CANCELLED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleUpdateStatus('CANCELLED', 'Hủy theo yêu cầu khách hoặc sự cố')}
                      disabled={submitting}
                      className="text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                      Hủy Đơn Booking
                    </Button>
                  )}

                  {/* Thông báo trạng thái kết thúc */}
                  {(currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') && (
                    <span className="text-xs text-slate-400 italic">
                      Đơn booking đã ở trạng thái kết thúc ({currentStatus}). Không còn bước chuyển đổi trạng thái tiếp theo.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Grid 2 Cột: Thông Tin Lộ Trình & Khách Hàng */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cột 1: Thông Tin Lộ Trình & Điểm Đón Trả */}
              <Card className="p-5 border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  <h3 className="font-bold text-sm text-navy-950 font-serif">
                    Lộ Trình & Thời Gian Di Chuyển
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-slate-500">Tuyến đường:</p>
                      <p className="font-bold text-navy-950 text-sm mt-0.5">
                        {booking.departure} → {booking.destination}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-slate-500">Thời gian:</p>
                      <p className="font-bold text-navy-950 text-sm mt-0.5">
                        {booking.travelDate} ({booking.travelTime})
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-slate-500 font-medium">Điểm đón tận nơi:</p>
                    <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium text-slate-900 mt-1">
                      {booking.pickupAddress}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500 font-medium">Điểm trả tận nơi:</p>
                    <p className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-medium text-slate-900 mt-1">
                      {booking.dropoffAddress}
                    </p>
                  </div>

                  {booking.isRoundTrip && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-900">
                      <span className="font-semibold">Vé Khứ Hồi:</span> Ngày về dự kiến {booking.returnDate}
                    </div>
                  )}
                </div>
              </Card>

              {/* Cột 2: Thông Tin Khách Hàng & Liên Hệ */}
              <Card className="p-5 border-slate-200/80 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <User className="w-4 h-4 text-gold-600" />
                  <h3 className="font-bold text-sm text-navy-950 font-serif">
                    Thông Tin Khách Hàng & Liên Hệ
                  </h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Họ và tên khách hàng:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.customerName || 'Khách đặt trực tuyến'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-slate-500">Số điện thoại:</p>
                      {booking.customerPhone ? (
                        <a
                          href={`tel:${booking.customerPhone}`}
                          className="font-bold text-gold-700 hover:underline text-sm flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{booking.customerPhone}</span>
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-slate-500">Số lượng:</p>
                      <p className="font-bold text-navy-950 text-sm mt-0.5">
                        {booking.serviceType === 'CARGO'
                          ? `${booking.cargoDetails?.quantity || 1} kiện`
                          : `${booking.passengerCount} hành khách`}
                      </p>
                    </div>
                  </div>

                  {booking.customerEmail && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-800">{booking.customerEmail}</span>
                    </div>
                  )}

                  {booking.note && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                      <p className="text-slate-500 font-medium">Ghi chú từ khách hàng:</p>
                      <p className="italic text-slate-800 mt-0.5">&ldquo;{booking.note}&rdquo;</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Chi Tiết Đặc Thù Của Từng Loại Dịch Vụ */}
            {booking.cargoDetails && (
              <Card className="p-5 border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Package className="w-4 h-4 text-gold-600" />
                  <h4 className="font-bold text-sm text-navy-950 font-serif">
                    Chi Tiết Kiện Hàng Hỏa Tốc (HG)
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Loại hàng hóa:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">{booking.cargoDetails.cargoType}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Số lượng & Trọng lượng:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.cargoDetails.quantity || 1} kiện • {booking.cargoDetails.estimatedWeightKg || '—'} kg
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Người gửi:</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{booking.cargoDetails.senderName}</p>
                    <a href={`tel:${booking.cargoDetails.senderPhone}`} className="text-gold-700 hover:underline">
                      {booking.cargoDetails.senderPhone}
                    </a>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Người nhận:</p>
                    <p className="font-semibold text-slate-900 mt-0.5">{booking.cargoDetails.receiverName}</p>
                    <a href={`tel:${booking.cargoDetails.receiverPhone}`} className="text-gold-700 hover:underline">
                      {booking.cargoDetails.receiverPhone}
                    </a>
                  </div>
                </div>
              </Card>
            )}

            {booking.contractDetails && (
              <Card className="p-5 border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building className="w-4 h-4 text-gold-600" />
                  <h4 className="font-bold text-sm text-navy-950 font-serif">
                    Chi Tiết Hợp Đồng Thuê Xe
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Dòng xe yêu cầu:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.contractDetails.seatCount} chỗ VIP
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Thời gian thuê:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.contractDetails.durationDays} ngày
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Yêu cầu đặc biệt:</p>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {booking.contractDetails.specialRequests || 'Không có'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {booking.tourDetails && (
              <Card className="p-5 border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Compass className="w-4 h-4 text-gold-600" />
                  <h4 className="font-bold text-sm text-navy-950 font-serif">
                    Chi Tiết Chuyến Xe Đi Khu Du Lịch
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Điểm đến tham quan:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.tourDetails.tourDestination}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Ngày về:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.tourDetails.returnDate || 'Theo thỏa thuận'}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Yêu cầu thêm:</p>
                    <p className="font-medium text-slate-800 mt-0.5">
                      {booking.tourDetails.specialRequests || 'Không có'}
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Grid 2 Cột: Điều Phối Xe/Tài Xế & Tài Chính */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Điều phối xe & tài xế */}
              <Card className="p-5 border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-gold-600" />
                    <h3 className="font-bold text-sm text-navy-950 font-serif">
                      Phương Tiện & Tài Xế Phụ Trách
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Xe */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-500 font-medium">Phương tiện được gán:</p>
                      <p className="font-bold text-navy-950 text-sm mt-1">
                        {booking.vehiclePlate || booking.vehicleName || 'Chưa phân xe'}
                      </p>
                      {booking.vehicleSeats && (
                        <p className="text-[11px] text-slate-500 mt-0.5">Số ghế: {booking.vehicleSeats} chỗ</p>
                      )}
                    </div>
                    <div className="pt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAssignVehicleOpen(true)}
                        className="text-xs h-7 px-2"
                      >
                        {booking.vehicleId ? 'Đổi Xe' : 'Phân Xe'}
                      </Button>
                      {booking.vehicleId && (
                        <button
                          type="button"
                          onClick={handleUnassignVehicle}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          Hủy phân
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tài xế */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <div>
                      <p className="text-slate-500 font-medium">Tài xế phụ trách:</p>
                      <p className="font-bold text-navy-950 text-sm mt-1">
                        {booking.driverName || 'Chưa phân tài xế'}
                      </p>
                      {booking.driverPhone && (
                        <a href={`tel:${booking.driverPhone}`} className="text-[11px] text-gold-700 hover:underline block mt-0.5">
                          SĐT: {booking.driverPhone}
                        </a>
                      )}
                    </div>
                    <div className="pt-3 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsAssignDriverOpen(true)}
                        className="text-xs h-7 px-2"
                      >
                        {booking.driverId ? 'Đổi Tài Xế' : 'Phân Tài Xế'}
                      </Button>
                      {booking.driverId && (
                        <button
                          type="button"
                          onClick={handleUnassignDriver}
                          className="text-[11px] text-rose-600 hover:underline"
                        >
                          Hủy phân
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

              {/* Tài Chính & Thanh Toán */}
              <Card className="p-5 border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gold-600" />
                    <h3 className="font-bold text-sm text-navy-950 font-serif">
                      Tài Chính & Thanh Toán
                    </h3>
                  </div>
                  <PaymentStatusBadge status={booking.paymentStatus} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Giá cước đơn hàng:</p>
                    <p className="font-bold text-navy-950 text-base mt-1">
                      {booking.price ? formatCurrencyVN(booking.price) : '0 ₫'}
                    </p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-slate-500">Tiền cọc đã nhận:</p>
                    <p className="font-bold text-emerald-800 text-base mt-1">
                      {booking.deposit ? formatCurrencyVN(booking.deposit) : '0 ₫'}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1">
                  <p>
                    <span className="font-semibold">Còn lại cần thu:</span>{' '}
                    <span className="font-bold text-navy-950">
                      {formatCurrencyVN(Math.max(0, (booking.price || 0) - (booking.deposit || 0)))}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Tài xế có thể thu tiền mặt hoặc hướng dẫn khách chuyển khoản khi lên xe.
                  </p>
                </div>
              </Card>
            </div>

            {/* Lịch Sử Trạng Thái (Timeline Stepper) */}
            <Card className="p-5 border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <History className="w-4 h-4 text-gold-600" />
                <h3 className="font-bold text-sm text-navy-950 font-serif">
                  Nhật Ký Luân Chuyển Trạng Thái (Status History Timeline)
                </h3>
              </div>

              <div className="border-l-2 border-slate-200 pl-4 space-y-4 ml-2 text-xs">
                {booking.statusHistory.map((h, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gold-500 border-2 border-white shadow-xs" />
                    <div className="flex items-center gap-2">
                      <BookingStatusBadge status={h.status} className="text-[10px] px-2 py-0" />
                      <span className="text-slate-400">
                        {new Date(h.changedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} -{' '}
                        {new Date(h.changedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium mt-1">{h.note}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">Thực hiện bởi: {h.changedBy}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Modal Phân Xe */}
            <AssignVehicleModal
              isOpen={isAssignVehicleOpen}
              onClose={() => setIsAssignVehicleOpen(false)}
              booking={booking}
              onSuccess={handleBookingUpdated}
            />

            {/* Modal Phân Tài Xế */}
            <AssignDriverModal
              isOpen={isAssignDriverOpen}
              onClose={() => setIsAssignDriverOpen(false)}
              booking={booking}
              onSuccess={handleBookingUpdated}
            />
          </>
        )}
      </div>
    </div>
  );
}

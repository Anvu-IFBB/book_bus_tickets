'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  MapPin,
  Bus,
  Users,
  History,
  CheckCircle,
  Play,
  XCircle,
  PhoneCall,
  Check,
  Package,
} from 'lucide-react';
import { Booking, BookingStatus } from '@/types/booking';
import { Button, useToast } from '@/components/ui';
import { BookingStatusBadge } from './status-badges';
import { useAdminAuth } from './admin-auth-context';
import { updateBookingStatusAction } from '@/app/actions/bookingActions';
import { releaseVehicleAction, releaseDriverAction } from '@/app/actions/fleetActions';

interface BookingDetailDrawerProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updated: Booking) => void;
  onOpenAssignVehicle: () => void;
  onOpenAssignDriver: () => void;
}

export function BookingDetailDrawer({
  booking,
  isOpen,
  onClose,
  onStatusUpdated,
  onOpenAssignVehicle,
  onOpenAssignDriver,
}: BookingDetailDrawerProps) {
  useAdminAuth();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const currentStatus = booking.bookingStatus;


  const handleUpdateStatus = async (newStatus: BookingStatus, note: string) => {
    setSubmitting(true);
    try {
      const res = await updateBookingStatusAction(
        booking.id,
        newStatus,
        note
      );
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      success(`Đã chuyển trạng thái sang "${newStatus}"`);
      onStatusUpdated(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Chuyển Trạng Thái');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassignVehicle = async () => {
    setSubmitting(true);
    try {
      const res = await releaseVehicleAction(booking.id);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      success('Đã hủy phân xe cho đơn');
      onStatusUpdated(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hủy Phân Xe');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnassignDriver = async () => {
    setSubmitting(true);
    try {
      const res = await releaseDriverAction(booking.id);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      success('Đã hủy phân tài xế cho đơn');
      onStatusUpdated(res.data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hủy Phân Tài Xế');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="booking-detail-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col h-full border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 id="booking-detail-title" className="text-lg font-bold font-serif text-navy-950 tracking-tight">
                  {booking.bookingCode}
                </h2>
                <BookingStatusBadge status={booking.bookingStatus} />
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Ngày tạo: {new Date(booking.createdAt).toLocaleString('vi-VN')}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
              aria-label="Đóng chi tiết booking"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-700">
            {/* Action Bar (State Machine valid actions) */}
            <div className="p-4 bg-navy-900 rounded-2xl text-white space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold-400">
                Thao Tác Điều Hành Khả Dụng
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {/* NEW -> CONTACTING */}
                {currentStatus === 'NEW' && (
                  <Button
                    variant="goldOutline"
                    size="sm"
                    onClick={() => handleUpdateStatus('CONTACTING', 'Bắt đầu liên hệ khách hàng')}
                    disabled={submitting}
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
                    onClick={() => handleUpdateStatus('CONFIRMED', 'Đã xác nhận chốt đơn')}
                    disabled={submitting}
                  >
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                    Xác Nhận Đơn
                  </Button>
                )}

                {/* CONFIRMED / ASSIGNED -> ASSIGN VEHICLE */}
                {(currentStatus === 'CONFIRMED' || currentStatus === 'ASSIGNED') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onOpenAssignVehicle}
                    disabled={submitting}
                  >
                    <Bus className="w-3.5 h-3.5 mr-1.5" />
                    {booking.vehicleId ? 'Đổi Xe Phục Vụ' : 'Phân Xe'}
                  </Button>
                )}

                {/* CONFIRMED / ASSIGNED -> ASSIGN DRIVER */}
                {(currentStatus === 'CONFIRMED' || currentStatus === 'ASSIGNED') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onOpenAssignDriver}
                    disabled={submitting}
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
                    onClick={() => handleUpdateStatus('IN_PROGRESS', 'Bắt đầu hành trình đón khách')}
                    disabled={submitting}
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5" />
                    Khởi Hành (Bắt Đầu)
                  </Button>
                )}

                {/* IN_PROGRESS -> COMPLETED */}
                {currentStatus === 'IN_PROGRESS' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleUpdateStatus('COMPLETED', 'Khách đã đến nơi an toàn')}
                    disabled={submitting}
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Hoàn Thành Chuyến Đi
                  </Button>
                )}

                {/* ANY EXCEPT COMPLETED / CANCELLED -> CANCELLED */}
                {currentStatus !== 'COMPLETED' && currentStatus !== 'CANCELLED' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      if (confirm('Bạn có chắc chắn muốn hủy đơn booking này không?')) {
                        handleUpdateStatus('CANCELLED', 'Hủy theo yêu cầu khách hoặc sự cố');
                      }
                    }}
                    disabled={submitting}
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Hủy Đơn
                  </Button>
                )}
              </div>
            </div>

            {/* Thông Tin Lộ Trình & Thời Gian */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold-600" />
                Lộ Trình & Điểm Đón Trả
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Tuyến đường:</p>
                  <p className="font-bold text-navy-950 text-sm">{booking.departure} → {booking.destination}</p>
                </div>
                <div>
                  <p className="text-slate-500">Thời gian khởi hành:</p>
                  <p className="font-bold text-navy-950 text-sm">{booking.travelDate} lúc {booking.travelTime}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-500">Điểm đón tận nơi:</p>
                  <p className="font-medium text-slate-900 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                    {booking.pickupAddress}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-slate-500">Điểm trả tận nơi:</p>
                  <p className="font-medium text-slate-900 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                    {booking.dropoffAddress}
                  </p>
                </div>
              </div>
            </div>

            {/* Thông Tin Khách Hàng / Hàng Hóa */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-gold-600" />
                Thông Tin Khách Hàng & Dịch Vụ
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-500">Loại dịch vụ:</p>
                  <p className="font-semibold text-slate-900">{booking.serviceType}</p>
                </div>
                <div>
                  <p className="text-slate-500">Số lượng:</p>
                  <p className="font-semibold text-slate-900">
                    {booking.serviceType === 'CARGO'
                      ? `${booking.cargoDetails?.quantity || 1} kiện hàng`
                      : `${booking.passengerCount} hành khách`}
                  </p>
                </div>

                {/* Chi tiết hàng hóa nếu có */}
                {booking.cargoDetails && (
                  <div className="sm:col-span-2 p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <p className="font-semibold text-slate-800 flex items-center gap-1">
                      <Package className="w-3.5 h-3.5 text-gold-600" />
                      Chi tiết kiện hàng: {booking.cargoDetails.cargoType}
                    </p>
                    <p className="text-slate-600">
                      Người gửi: {booking.cargoDetails.senderName} ({booking.cargoDetails.senderPhone})
                    </p>
                    <p className="text-slate-600">
                      Người nhận: {booking.cargoDetails.receiverName} ({booking.cargoDetails.receiverPhone})
                    </p>
                  </div>
                )}

                {/* Ghi chú */}
                {booking.note && (
                  <div className="sm:col-span-2">
                    <p className="text-slate-500">Ghi chú từ khách hàng:</p>
                    <p className="italic text-slate-800 bg-amber-50/60 p-2 rounded border border-amber-200/70 mt-1">
                      &ldquo;{booking.note}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Phân Công Phương Tiện & Tài Xế */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif flex items-center gap-1.5">
                <Bus className="w-3.5 h-3.5 text-gold-600" />
                Điều Phối Xe & Tài Xế
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 font-medium">Xe được phân công:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.vehicleId || 'Chưa phân xe'}
                    </p>
                  </div>
                  {booking.vehicleId && (
                    <button
                      type="button"
                      onClick={handleUnassignVehicle}
                      className="text-[11px] text-rose-600 hover:underline mt-2 text-left"
                    >
                      Hủy phân xe này
                    </button>
                  )}
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div>
                    <p className="text-slate-500 font-medium">Tài xế phụ trách:</p>
                    <p className="font-bold text-navy-950 text-sm mt-0.5">
                      {booking.driverId || 'Chưa phân tài xế'}
                    </p>
                  </div>
                  {booking.driverId && (
                    <button
                      type="button"
                      onClick={handleUnassignDriver}
                      className="text-[11px] text-rose-600 hover:underline mt-2 text-left"
                    >
                      Hủy phân tài xế này
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Lịch Sử Trạng Thái (Status History Timeline) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-serif flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-gold-600" />
                Lịch Sử Trạng Thái & Nhật Ký Vận Hành
              </h3>
              <div className="border-l-2 border-slate-200 pl-4 space-y-3 ml-2 text-xs">
                {booking.statusHistory.map((h, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-gold-500 border-2 border-white shadow-xs" />
                    <div className="flex items-center gap-2">
                      <BookingStatusBadge status={h.status} className="text-[10px] px-2 py-0" />
                      <span className="text-slate-400">
                        {new Date(h.changedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(h.changedAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-slate-700 font-medium mt-0.5">{h.note}</p>
                    <p className="text-slate-400 text-[10px]">Bởi: {h.changedBy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Button, Select, Input, Alert, useToast } from '@/components/ui';
import { Booking } from '@/types/booking';
import { Vehicle, Driver } from '@/types/fleet';
import { useAdminAuth } from './admin-auth-context';
import { Bus, Users, CheckCircle2 } from 'lucide-react';
import { assignVehicleAction, assignDriverAction } from '@/app/actions/fleetActions';
import { listVehiclesAction, listDriversAction, detectVehicleConflictAction, detectDriverConflictAction } from '@/app/actions/fleetQueries';

// ==========================================
// 1. ASSIGN VEHICLE MODAL
// ==========================================

interface AssignVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess: (updatedBooking: Booking) => void;
}

export function AssignVehicleModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: AssignVehicleModalProps) {
  useAdminAuth();
  const { success, error } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [conflictReason, setConflictReason] = useState<string | null>(null);
  const [checkingConflict, setCheckingConflict] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    listVehiclesAction().then((list) => {
      if (ignore) return;
      setVehicles(list);
      if (booking?.vehicleId) {
        setSelectedVehicleId(booking.vehicleId);
      } else if (list.length > 0) {
        setSelectedVehicleId(list[0].id);
      }
    });
    return () => {
      ignore = true;
    };
  }, [isOpen, booking]);

  // Kiểm tra conflict khi chọn xe
  useEffect(() => {
    if (!booking || !selectedVehicleId || !isOpen) return;

    let ignore = false;
    detectVehicleConflictAction(selectedVehicleId, booking.travelDate, booking.travelTime)
      .then((res) => {
        if (!ignore) {
          setConflictReason(res.hasConflict ? res.reason || 'Xung đột phương tiện' : null);
          setCheckingConflict(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setConflictReason(err.message);
          setCheckingConflict(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [booking, selectedVehicleId, isOpen]);

  const handleAssign = async () => {
    if (!booking || !selectedVehicleId) return;
    setSubmitting(true);

    try {
      const res = await assignVehicleAction(booking.id, selectedVehicleId, note);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');
      
      success(`Đã phân xe thành công cho đơn ${booking.bookingCode}`);
      onSuccess(res.data);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Phân Xe');
      setConflictReason(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  const vehicleOptions = vehicles.map((v) => ({
    value: v.id,
    label: `${v.licensePlate} — ${v.name} (${v.seatCount} chỗ) [${v.status}]`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phân Xe Cho Đơn ${booking.bookingCode}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <p>
            <span className="font-semibold text-slate-700">Lộ trình:</span> {booking.departure} → {booking.destination}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Thời gian:</span> {booking.travelDate} lúc {booking.travelTime}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Số khách:</span> {booking.passengerCount} người
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Bus className="w-4 h-4 text-gold-600" />
            Chọn Phương Tiện Phục Vụ
          </label>
          <Select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            options={vehicleOptions}
            className="text-sm"
          />
        </div>

        {checkingConflict && (
          <p className="text-xs text-slate-500 italic animate-pulse">
            Đang kiểm tra lịch chạy và bảo dưỡng của xe...
          </p>
        )}

        {conflictReason && (
          <Alert variant="danger" title="Cảnh Báo Xung Đột (Conflict Detected)">
            {conflictReason}
          </Alert>
        )}

        {!conflictReason && !checkingConflict && selectedVehicleId && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Xe hoàn toàn sẵn sàng và không bị trùng lịch chạy!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ghi chú điều phối (tùy chọn)
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Xe đã rửa sạch, chuẩn bị 2 chai nước suối"
            className="text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssign}
            disabled={submitting || !!conflictReason || checkingConflict || !selectedVehicleId}
            isLoading={submitting}
          >
            Xác Nhận Phân Xe
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ==========================================
// 2. ASSIGN DRIVER MODAL
// ==========================================

interface AssignDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess: (updatedBooking: Booking) => void;
}

export function AssignDriverModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}: AssignDriverModalProps) {
  useAdminAuth();
  const { success, error } = useToast();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [conflictReason, setConflictReason] = useState<string | null>(null);
  const [checkingConflict, setCheckingConflict] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;
    let ignore = false;
    listDriversAction().then((list) => {
      if (ignore) return;
      setDrivers(list);
      if (booking?.driverId) {
        setSelectedDriverId(booking.driverId);
      } else if (list.length > 0) {
        setSelectedDriverId(list[0].id);
      }
    });
    return () => {
      ignore = true;
    };
  }, [isOpen, booking]);

  // Kiểm tra conflict khi chọn tài xế
  useEffect(() => {
    if (!booking || !selectedDriverId || !isOpen) return;

    let ignore = false;
    detectDriverConflictAction(selectedDriverId, booking.travelDate, booking.travelTime)
      .then((res) => {
        if (!ignore) {
          setConflictReason(res.hasConflict ? res.reason || 'Xung đột tài xế' : null);
          setCheckingConflict(false);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setConflictReason(err.message);
          setCheckingConflict(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [booking, selectedDriverId, isOpen]);

  const handleAssign = async () => {
    if (!booking || !selectedDriverId) return;
    setSubmitting(true);

    try {
      const res = await assignDriverAction(booking.id, selectedDriverId, note);
      if (!res.success || !res.data) throw new Error(res.error || 'Lỗi hệ thống');

      success(`Đã phân tài xế thành công cho đơn ${booking.bookingCode}`);
      onSuccess(res.data);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Phân Tài Xế');
      setConflictReason(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  const driverOptions = drivers.map((d) => ({
    value: d.id,
    label: `${d.name} — ${d.phone} (GPLX: ${d.licenseNumber}) [${d.status}]`,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Phân Tài Xế Cho Đơn ${booking.bookingCode}`}
      size="md"
    >
      <div className="space-y-4">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
          <p>
            <span className="font-semibold text-slate-700">Khách hàng:</span> {booking.bookingCode}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Lộ trình:</span> {booking.departure} → {booking.destination}
          </p>
          <p>
            <span className="font-semibold text-slate-700">Thời gian đón:</span> {booking.travelDate} lúc {booking.travelTime}
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gold-600" />
            Chọn Tài Xế Phụ Trách
          </label>
          <Select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            options={driverOptions}
            className="text-sm"
          />
        </div>

        {checkingConflict && (
          <p className="text-xs text-slate-500 italic animate-pulse">
            Đang kiểm tra ca trực và lịch chạy của tài xế...
          </p>
        )}

        {conflictReason && (
          <Alert variant="danger" title="Cảnh Báo Trùng Lịch / Nghỉ Phép">
            {conflictReason}
          </Alert>
        )}

        {!conflictReason && !checkingConflict && selectedDriverId && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tài xế sẵn sàng nhận lệnh và không bị trùng giờ!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Dặn dò tài xế (tùy chọn)
          </label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Đón đúng giờ, hỗ trợ xách vali cho khách"
            className="text-sm"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAssign}
            disabled={submitting || !!conflictReason || checkingConflict || !selectedDriverId}
            isLoading={submitting}
          >
            Xác Nhận Phân Tài Xế
          </Button>
        </div>
      </div>
    </Modal>
  );
}

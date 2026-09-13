'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Bus,
  Users,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { TripStatusBadge } from '@/components/admin/status-badges';
import { useAdminLayout } from '../admin-layout-shell';
import { listTripsAction, createTripAction, updateTripStatusAction, listVehiclesAction, listDriversAction, detectVehicleConflictAction, detectDriverConflictAction } from '@/app/actions/fleetCrudActions';
import { Trip, Vehicle, Driver } from '@/types/fleet';
import { Card, Button, Input, Select, Modal, useToast } from '@/components/ui';

export default function AdminTripsPage() {
  const { openSidebar } = useAdminLayout();
  const { success, error } = useToast();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('');

  // Create Trip Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    routeId: 'route-qn-nb',
    route: 'Quảng Ninh - Ninh Bình',
    departureDate: new Date().toISOString().slice(0, 10),
    departureTime: '08:00',
    arrivalTime: '11:30',
    vehicleId: '',
    driverId: '',
    maxSeats: 11,
    note: '',
  });

  const [vConflictReason, setVConflictReason] = useState<string | null>(null);
  const [dConflictReason, setDConflictReason] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      listTripsAction(),
      listVehiclesAction(),
      listDriversAction(),
    ])
      .then(([tripRes, vRes, dRes]) => {
        if (!ignore) {
          if (tripRes.success && tripRes.data) {
            setTrips(tripRes.data);
          } else {
            console.error('Lỗi khi tải danh sách chuyến đi:', tripRes.error);
          }
          if (vRes.success && vRes.data) {
            setVehicles(vRes.data);
          }
          if (dRes.success && dRes.data) {
            setDrivers(dRes.data);
          }
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách chuyến:', err);
        if (!ignore) {
          setRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [dateFilter, refreshKey]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
  };

  // Kiểm tra conflict phương tiện khi form modal thay đổi
  useEffect(() => {
    let isMounted = true;
    if (!formData.vehicleId || !isModalOpen) {
      Promise.resolve().then(() => {
        if (isMounted) setVConflictReason(null);
      });
      return () => {
        isMounted = false;
      };
    }
    detectVehicleConflictAction(
        formData.vehicleId,
        formData.departureDate,
        formData.departureTime,
        formData.arrivalTime
      )
      .then((res) => {
        if (!isMounted) return;
        setVConflictReason(res.hasConflict ? res.reason || 'Xung đột xe' : null);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.vehicleId, formData.departureDate, formData.departureTime, formData.arrivalTime, isModalOpen]);

  // Kiểm tra conflict tài xế khi form modal thay đổi
  useEffect(() => {
    let isMounted = true;
    if (!formData.driverId || !isModalOpen) {
      Promise.resolve().then(() => {
        if (isMounted) setDConflictReason(null);
      });
      return () => {
        isMounted = false;
      };
    }
    detectDriverConflictAction(
        formData.driverId,
        formData.departureDate,
        formData.departureTime,
        formData.arrivalTime
      )
      .then((res) => {
        if (!isMounted) return;
        setDConflictReason(res.hasConflict ? res.reason || 'Xung đột tài xế' : null);
      });

    return () => {
      isMounted = false;
    };
  }, [formData.driverId, formData.departureDate, formData.departureTime, formData.arrivalTime, isModalOpen]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (vConflictReason || dConflictReason) {
      error('Vui lòng giải quyết cảnh báo xung đột lịch trước khi lên chuyến');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createTripAction({
        ...formData,
        status: formData.vehicleId && formData.driverId ? 'ASSIGNED' : 'PLANNED',
        bookingIds: [],
        bookedSeats: 0,
      });
      if (res && !res.success) throw new Error(res.error);
      success('Đã khởi tạo chuyến xe mới thành công');
      setIsModalOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Tạo Chuyến');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartTrip = async (tripId: string) => {
    try {
      const res = await updateTripStatusAction(tripId, 'IN_PROGRESS', 'Xuất bến');
      if (res && !res.success) throw new Error(res.error);
      success(`Chuyến xe ${tripId} đã chính thức xuất bến (IN_PROGRESS)`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Khởi Hành');
    }
  };

  const handleCompleteTrip = async (tripId: string) => {
    try {
      const res = await updateTripStatusAction(tripId, 'COMPLETED', 'Hoàn thành chuyến');
      if (res && !res.success) throw new Error(res.error);
      success(`Chuyến xe ${tripId} đã hoàn thành an toàn`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hoàn Thành');
    }
  };

  const handleCancelTrip = async (tripId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy chuyến xe này không?')) return;
    try {
      const res = await updateTripStatusAction(tripId, 'CANCELLED', 'Hủy theo yêu cầu điều hành');
      if (res && !res.success) throw new Error(res.error);
      success(`Đã hủy chuyến ${tripId}`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Hủy Chuyến');
    }
  };

  const filteredTrips = trips.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Điều Phối Chuyến Xe"
        description="Lập lịch trình, ghép xe, phân tài xế và kiểm soát thời gian di chuyển toàn tuyến"
        onMenuClick={openSidebar}
        onRefresh={handleRefresh}
        isRefreshing={refreshing}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Lên Lịch Chuyến Mới
          </Button>
        }
      />

      <div className="p-4 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Bộ Lọc Ngày & Trạng Thái */}
        <Card className="p-4 border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Lọc theo ngày
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full text-xs lg:text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
                />
                {dateFilter && (
                  <Button variant="ghost" size="sm" onClick={() => setDateFilter('')} className="text-xs">
                    Tất cả
                  </Button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Trạng thái chuyến
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái' },
                  { value: 'PLANNED', label: 'Lên kế hoạch (PLANNED)' },
                  { value: 'ASSIGNED', label: 'Đã phân xe & tài xế (ASSIGNED)' },
                  { value: 'IN_PROGRESS', label: 'Đang chạy (IN_PROGRESS)' },
                  { value: 'COMPLETED', label: 'Hoàn thành (COMPLETED)' },
                  { value: 'CANCELLED', label: 'Đã hủy (CANCELLED)' },
                ]}
                className="text-xs lg:text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Danh Sách Chuyến Xe */}
        <div className="space-y-4">
          {filteredTrips.length === 0 ? (
            <Card className="p-12 text-center text-slate-400 text-sm">
              Không có chuyến xe nào được lên lịch cho điều kiện lọc này.
            </Card>
          ) : (
            filteredTrips.map((trip) => {
              const assignedVehicle = vehicles.find((v) => v.id === trip.vehicleId);
              const assignedDriver = drivers.find((d) => d.id === trip.driverId);

              return (
                <Card
                  key={trip.id}
                  className="p-5 border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-navy-950 font-serif text-base">
                        {trip.route || trip.routeId}
                      </span>
                      <TripStatusBadge status={trip.status} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gold-600 shrink-0" />
                        <span>
                          {trip.departureDate} | <strong>{trip.departureTime}</strong> → {trip.arrivalTime || 'Chưa định'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Bus className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          Xe: {assignedVehicle ? `${assignedVehicle.licensePlate} (${assignedVehicle.name})` : trip.vehicleId || 'Chưa phân'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>
                          Tài xế: {assignedDriver ? `${assignedDriver.name} (${assignedDriver.phone})` : trip.driverId || 'Chưa phân'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hành Động */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    {trip.status === 'ASSIGNED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartTrip(trip.id)}
                        className="text-xs h-8"
                      >
                        <Play className="w-3.5 h-3.5 mr-1" />
                        Khởi Hành
                      </Button>
                    )}

                    {trip.status === 'IN_PROGRESS' && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleCompleteTrip(trip.id)}
                        className="text-xs h-8"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Hoàn Thành
                      </Button>
                    )}

                    {trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED' && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCancelTrip(trip.id)}
                        className="text-xs h-8"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" />
                        Hủy
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Lên Lịch Chuyến Mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Lên Lịch Trình Chuyến Xe Mới"
        size="lg"
      >
        <form onSubmit={handleCreateTrip} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tuyến đường phục vụ *
              </label>
              <Select
                value={formData.routeId}
                onChange={(e) => {
                  const rId = e.target.value;
                  const label =
                    rId === 'route-qn-nb'
                      ? 'Quảng Ninh - Ninh Bình'
                      : rId === 'route-nb-qn'
                      ? 'Ninh Bình - Quảng Ninh'
                      : rId === 'route-qn-hp'
                      ? 'Quảng Ninh - Hải Phòng'
                      : rId === 'route-hp-tb'
                      ? 'Hải Phòng - Thái Bình'
                      : 'Thái Bình - Nam Định';
                  setFormData({ ...formData, routeId: rId, route: label });
                }}
                options={[
                  { value: 'route-qn-nb', label: 'Quảng Ninh ⇄ Ninh Bình' },
                  { value: 'route-nb-qn', label: 'Ninh Bình ⇄ Quảng Ninh' },
                  { value: 'route-qn-hp', label: 'Quảng Ninh ⇄ Hải Phòng' },
                  { value: 'route-hp-tb', label: 'Hải Phòng ⇄ Thái Bình' },
                  { value: 'route-tb-nd', label: 'Thái Bình ⇄ Nam Định' },
                ]}
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Ngày khởi hành *
              </label>
              <input
                type="date"
                value={formData.departureDate}
                onChange={(e) => setFormData({ ...formData, departureDate: e.target.value })}
                required
                className="w-full text-sm rounded-lg border border-slate-300 px-3 py-2 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/30 focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giờ xuất bến (HH:mm) *
              </label>
              <Input
                value={formData.departureTime}
                onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                placeholder="08:00"
                required
                className="text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Giờ đến dự kiến (HH:mm) *
              </label>
              <Input
                value={formData.arrivalTime}
                onChange={(e) => setFormData({ ...formData, arrivalTime: e.target.value })}
                placeholder="11:30"
                required
                className="text-sm font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gán xe phục vụ (tùy chọn)
              </label>
              <Select
                value={formData.vehicleId}
                onChange={(e) => setFormData({ ...formData, vehicleId: e.target.value })}
                options={[
                  { value: '', label: '— Chưa phân xe —' },
                  ...vehicles.map((v) => ({
                    value: v.id,
                    label: `${v.licensePlate} (${v.name}) [${v.status}]`,
                  })),
                ]}
                className="text-sm"
              />
              {vConflictReason && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  ⚠️ {vConflictReason}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Gán tài xế phụ trách (tùy chọn)
              </label>
              <Select
                value={formData.driverId}
                onChange={(e) => setFormData({ ...formData, driverId: e.target.value })}
                options={[
                  { value: '', label: '— Chưa phân tài xế —' },
                  ...drivers.map((d) => ({
                    value: d.id,
                    label: `${d.name} (${d.phone}) [${d.status}]`,
                  })),
                ]}
                className="text-sm"
              />
              {dConflictReason && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  ⚠️ {dConflictReason}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú lộ trình / Đón khách
            </label>
            <Input
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="VD: Đón các điểm trung tâm Bãi Cháy trước 30 phút"
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              disabled={submitting || !!vConflictReason || !!dConflictReason}
              isLoading={submitting}
            >
              Lên Lịch Chuyến Xe
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

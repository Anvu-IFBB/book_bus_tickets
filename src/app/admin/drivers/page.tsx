'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Phone,
  CheckCircle2,
  Coffee,
  Search,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { DriverStatusBadge } from '@/components/admin/status-badges';

import { listDriversAction, createDriverAction, updateDriverStatusAction } from '@/app/actions/fleetCrudActions';
import { Driver, DriverStatus } from '@/types/fleet';
import { Card, Button, Input, Select, Modal, useToast } from '@/components/ui';

export default function AdminDriversPage() {

  const { success, error } = useToast();

  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    licenseNumber: '',
    status: 'AVAILABLE' as DriverStatus,
    note: '',
  });

  useEffect(() => {
    let ignore = false;
    listDriversAction()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setDrivers(res.data);
          } else {
            console.error('Lỗi khi tải danh sách tài xế:', res.error);
          }
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách tài xế:', err);
        if (!ignore) {
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

  const handleQuickStatusChange = async (driverId: string, newStatus: DriverStatus) => {
    try {
      const res = await updateDriverStatusAction(driverId, newStatus, 'Thay đổi trạng thái nhanh');
      if (res && !res.success) throw new Error(res.error);
      success(`Đã cập nhật trạng thái tài xế sang "${newStatus}"`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi cập nhật');
    }
  };

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createDriverAction(formData);
      if (res && !res.success) throw new Error(res.error);
      success(`Đã thêm tài xế ${formData.name}`);
      setIsModalOpen(false);
      setFormData({
        name: '',
        phone: '',
        licenseNumber: '',
        status: 'AVAILABLE',
        note: '',
      });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Thêm Tài Xế');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    if (statusFilter !== 'ALL' && d.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.phone.includes(q) ||
        d.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Quản Lý Tài Xế"
        description="Đội ngũ lái xe giàu kinh nghiệm, ca trực và phân công nhiệm vụ an toàn"
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
            Thêm Tài Xế
          </Button>
        }
      />

      <div className="p-4 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Bộ Lọc & Tìm Kiếm */}
        <Card className="p-4 border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tìm kiếm tài xế
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo họ tên, số điện thoại, số GPLX..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                className="text-xs lg:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tình trạng ca trực
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả trạng thái' },
                  { value: 'AVAILABLE', label: 'Sẵn sàng (AVAILABLE)' },
                  { value: 'ASSIGNED', label: 'Đã phân công (ASSIGNED)' },
                  { value: 'ON_TRIP', label: 'Đang chạy chuyến (ON_TRIP)' },
                  { value: 'OFF', label: 'Nghỉ ca / Nghỉ phép (OFF)' },
                  { value: 'INACTIVE', label: 'Ngừng làm việc (INACTIVE)' },
                ]}
                className="text-xs lg:text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Danh Sách Tài Xế */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((d) => (
            <Card key={d.id} className="p-5 border-slate-200/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold font-serif flex items-center justify-center text-sm shrink-0">
                      {d.name.slice(0, 1)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-950 font-serif">
                        {d.name}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gold-600" />
                        <span className="font-mono">{d.phone}</span>
                      </p>
                    </div>
                  </div>
                  <DriverStatusBadge status={d.status} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Số GPLX:</span>
                    <span className="font-mono font-semibold text-slate-800">{d.licenseNumber}</span>
                  </div>
                  {d.vehicleId && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Xe phụ trách:</span>
                      <span className="font-medium text-gold-600">{d.vehicleId}</span>
                    </div>
                  )}
                  {d.note && (
                    <div className="mt-2 p-2 bg-slate-50 rounded text-slate-600 text-[11px] italic">
                      &ldquo;{d.note}&rdquo;
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Ca trực:</span>
                <div className="flex items-center gap-1.5">
                  {d.status !== 'AVAILABLE' && d.status !== 'ACTIVE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickStatusChange(d.id, 'AVAILABLE')}
                      className="text-[11px] h-7 px-2"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Nhận Chuyến
                    </Button>
                  )}
                  {d.status !== 'OFF' && d.status !== 'OFF_DUTY' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickStatusChange(d.id, 'OFF')}
                      className="text-[11px] h-7 px-2"
                    >
                      <Coffee className="w-3 h-3 mr-1 text-slate-500" />
                      Nghỉ Ca
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Thêm Tài Xế */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Tài Xế Mới"
        size="md"
      >
        <form onSubmit={handleCreateDriver} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Họ và tên tài xế *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Nguyễn Văn Cường"
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số điện thoại liên lạc *
              </label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="VD: 0912345678"
                required
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số GPLX (Hạng D, E) *
              </label>
              <Input
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="VD: GPLX-E-1400293"
                required
                className="text-sm font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Kinh nghiệm / Ghi chú
            </label>
            <Input
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="VD: 8 năm tuyến Quảng Ninh - Ninh Bình, không hút thuốc"
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Lưu Tài Xế
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

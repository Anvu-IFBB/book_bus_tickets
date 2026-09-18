'use client';

import React, { useState, useEffect } from 'react';
import {
  Bus,
  Plus,
  Wrench,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/admin-header';
import { VehicleStatusBadge } from '@/components/admin/status-badges';

import { listVehiclesAction, createVehicleAction, updateVehicleStatusAction } from '@/app/actions/fleetCrudActions';
import { Vehicle, VehicleStatus } from '@/types/fleet';
import { Card, Button, Input, Select, Modal, useToast } from '@/components/ui';

export default function AdminVehiclesPage() {

  const { success, error } = useToast();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Add/Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    licensePlate: '',
    seatCount: 11 as 5 | 7 | 11 | 16 | 29,
    vehicleType: 'Limousine DCar President',
    status: 'AVAILABLE' as VehicleStatus,
    note: '',
  });

  useEffect(() => {
    let ignore = false;
    listVehiclesAction()
      .then((res) => {
        if (!ignore) {
          if (res.success && res.data) {
            setVehicles(res.data);
          } else {
            console.error('Lỗi khi tải danh sách xe:', res.error);
          }
          setRefreshing(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách xe:', err);
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

  const handleQuickStatusChange = async (vehicleId: string, newStatus: VehicleStatus) => {
    try {
      const res = await updateVehicleStatusAction(vehicleId, newStatus, 'Thay đổi trạng thái nhanh');
      if (res && !res.success) throw new Error(res.error);
      success(`Đã cập nhật trạng thái xe sang "${newStatus}"`);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi cập nhật');
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await createVehicleAction(formData);
      if (res && !res.success) throw new Error(res.error);
      success(`Đã thêm xe mới biển số ${formData.licensePlate}`);
      setIsModalOpen(false);
      setFormData({
        name: '',
        licensePlate: '',
        seatCount: 11,
        vehicleType: 'Limousine DCar President',
        status: 'AVAILABLE',
        note: '',
      });
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      error(msg, 'Lỗi Thêm Xe');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.licensePlate.toLowerCase().includes(q) ||
        v.name.toLowerCase().includes(q) ||
        v.vehicleType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <AdminHeader
        title="Quản Lý Đội Xe"
        description="Danh mục phương tiện 5 - 7 - 11 - 16 - 29 chỗ và theo dõi bảo dưỡng định kỳ"
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
            Thêm Xe Mới
          </Button>
        }
      />

      <div className="p-4 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Bộ Lọc & Tìm Kiếm */}
        <Card className="p-4 border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tìm kiếm phương tiện
              </label>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm theo biển số (14B-...), tên xe..."
                leftIcon={<Search className="w-4 h-4 text-slate-400" />}
                className="text-xs lg:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Tình trạng hoạt động
              </label>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'ALL', label: 'Tất cả tình trạng' },
                  { value: 'AVAILABLE', label: 'Sẵn sàng (AVAILABLE)' },
                  { value: 'ASSIGNED', label: 'Đã phân chuyến (ASSIGNED)' },
                  { value: 'IN_SERVICE', label: 'Đang chạy (IN_SERVICE)' },
                  { value: 'MAINTENANCE', label: 'Bảo dưỡng (MAINTENANCE)' },
                  { value: 'INACTIVE', label: 'Ngừng hoạt động (INACTIVE)' },
                ]}
                className="text-xs lg:text-sm"
              />
            </div>
          </div>
        </Card>

        {/* Danh Sách Phương Tiện */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((veh) => (
            <Card key={veh.id} className="p-5 border-slate-200/80 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-navy-950 font-serif">
                        {veh.name}
                      </h3>
                      <p className="text-xs font-bold text-gold-600 font-mono">
                        {veh.licensePlate}
                      </p>
                    </div>
                  </div>
                  <VehicleStatusBadge status={veh.status} />
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">Số ghế:</span>{' '}
                    <span className="font-semibold text-slate-800">{veh.seatCount} chỗ</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dòng xe:</span>{' '}
                    <span className="font-medium text-slate-800 truncate block">{veh.vehicleType}</span>
                  </div>
                  {veh.note && (
                    <div className="col-span-2 mt-1 p-2 bg-slate-50 rounded text-slate-600 text-[11px] italic">
                      {veh.note}
                    </div>
                  )}
                </div>
              </div>

              {/* Thao Tác Nhanh */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">Chuyển trạng thái:</span>
                <div className="flex items-center gap-1.5">
                  {veh.status !== 'AVAILABLE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickStatusChange(veh.id, 'AVAILABLE')}
                      className="text-[11px] h-7 px-2"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                      Sẵn Sàng
                    </Button>
                  )}
                  {veh.status !== 'MAINTENANCE' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickStatusChange(veh.id, 'MAINTENANCE')}
                      className="text-[11px] h-7 px-2"
                    >
                      <Wrench className="w-3 h-3 mr-1 text-amber-600" />
                      Bảo Trì
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Modal Thêm Xe Mới */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thêm Phương Tiện Mới Vào Đội Xe"
        size="md"
      >
        <form onSubmit={handleCreateVehicle} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tên định danh phương tiện *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Limousine DCar President VIP 5"
              required
              className="text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Biển số xe (Chuẩn VN) *
              </label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="VD: 14B-088.99"
                required
                className="text-sm font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Số lượng ghế *
              </label>
              <Select
                value={String(formData.seatCount)}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seatCount: Number(e.target.value) as 5 | 7 | 11 | 16 | 29,
                  })
                }
                options={[
                  { value: '5', label: '5 chỗ' },
                  { value: '7', label: '7 chỗ MPV' },
                  { value: '11', label: '11 chỗ Limousine VIP' },
                  { value: '16', label: '16 chỗ Solati/Transit' },
                  { value: '29', label: '29 chỗ Universe Tour' },
                ]}
                className="text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phân loại xe *
            </label>
            <Input
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              placeholder="VD: DCar Limousine VIP 11 chỗ massage"
              required
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ghi chú trang bị & bảo dưỡng
            </label>
            <Input
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="VD: Ghế massage toàn thân, cổng Type-C"
              className="text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={submitting}>
              Lưu Phương Tiện
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

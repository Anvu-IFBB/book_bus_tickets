'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Alert } from '@/components/ui';
import { getSettingsAction, updateSettingsAction } from '@/app/actions/settingsActions';
import { SystemSettings, PricingConfig } from '@/types/automation';
import { Loader2, Save } from 'lucide-react';

export default function SettingsClient() {
  const [settingsForm, setSettingsForm] = useState<Partial<SystemSettings> | null>(null);
  const [pricingForm, setPricingForm] = useState<PricingConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    const res = await getSettingsAction();
    if (res.success && res.data) {
      setSettingsForm(res.data);
      if (res.data.pricingConfig) {
        setPricingForm(res.data.pricingConfig);
      }
    } else {
      setError(res.error || 'Lỗi khi tải cấu hình');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSettings();
  }, []);

  const handleSettingsChange = (field: keyof SystemSettings, value: string) => {
    if (!settingsForm) return;
    setSettingsForm({ ...settingsForm, [field]: value });
  };

  const handlePriceChange = (field: keyof PricingConfig, value: string) => {
    if (!pricingForm) return;
    setPricingForm({ ...pricingForm, [field]: parseInt(value) || 0 });
  };

  const handleSave = async () => {
    if (!settingsForm) return;
    setError(null);
    setSuccessMsg(null);
    setIsSaving(true);
    const updates: Partial<SystemSettings> = { ...settingsForm };
    if (pricingForm) {
      updates.pricingConfig = pricingForm;
    }
    const res = await updateSettingsAction(updates);
    if (res.success && res.data) {
      setSuccessMsg('Đã lưu cấu hình thành công!');
      setSettingsForm(res.data);
    } else {
      setError(res.error || 'Lỗi khi lưu cấu hình');
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cấu Hình Hệ Thống & Bảng Giá</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý giá vé và các thông số chung</p>
        </div>
        <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="w-4 h-4" />}>
          Lưu Thay Đổi
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMsg && <Alert variant="success">{successMsg}</Alert>}

      {settingsForm && (
        <Card>
          <CardHeader>
            <CardTitle>Thông Tin Hệ Thống & Liên Hệ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Tên Công Ty</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.companyName || ''}
                  onChange={(e) => handleSettingsChange('companyName', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Địa chỉ</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.address || ''}
                  onChange={(e) => handleSettingsChange('address', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Hotline 1</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.hotline1 || ''}
                  onChange={(e) => handleSettingsChange('hotline1', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Hotline 2</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.hotline2 || ''}
                  onChange={(e) => handleSettingsChange('hotline2', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Facebook URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.facebookUrl || ''}
                  onChange={(e) => handleSettingsChange('facebookUrl', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Zalo URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.zaloUrl || ''}
                  onChange={(e) => handleSettingsChange('zaloUrl', e.target.value)}
                />
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 border-b pb-2 pt-4">Cấu Hình Thanh Toán (Chuyển Khoản)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Mã Ngân Hàng (BIN / Tên tắt)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.bankCode || ''}
                  onChange={(e) => handleSettingsChange('bankCode', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Số Tài Khoản</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.bankAccountNumber || ''}
                  onChange={(e) => handleSettingsChange('bankAccountNumber', e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Tên Chủ Tài Khoản</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={settingsForm.bankAccountName || ''}
                  onChange={(e) => handleSettingsChange('bankAccountName', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pricingForm && (
        <Card>
          <CardHeader>
            <CardTitle>Bảng Giá Dịch Vụ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Vé Limousine & Tour</h3>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Giá vé Limousine cơ bản (VND)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={pricingForm.limousineBasePrice}
                    onChange={(e) => handlePriceChange('limousineBasePrice', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Giá vé Tour cơ bản (VND)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={pricingForm.tourBasePrice}
                    onChange={(e) => handlePriceChange('tourBasePrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Gửi Hàng Hóa</h3>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Giá cơ bản dưới 5kg (VND)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={pricingForm.cargoBasePriceUnder5kg}
                    onChange={(e) => handlePriceChange('cargoBasePriceUnder5kg', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Giá cơ bản dưới 10kg (VND)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={pricingForm.cargoBasePriceUnder10kg}
                    onChange={(e) => handlePriceChange('cargoBasePriceUnder10kg', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Phụ phí vượt kg (VND/kg)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md"
                    value={pricingForm.cargoExtraPerKg}
                    onChange={(e) => handlePriceChange('cargoExtraPerKg', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Thuê Xe Hợp Đồng (Theo Ngày)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Dưới 7 chỗ (VND)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      value={pricingForm.contractPricePerDayUnder7Seats}
                      onChange={(e) => handlePriceChange('contractPricePerDayUnder7Seats', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Dưới 11 chỗ (VND)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      value={pricingForm.contractPricePerDayUnder11Seats}
                      onChange={(e) => handlePriceChange('contractPricePerDayUnder11Seats', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Dưới 16 chỗ (VND)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      value={pricingForm.contractPricePerDayUnder16Seats}
                      onChange={(e) => handlePriceChange('contractPricePerDayUnder16Seats', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Trên 16 chỗ (VND)</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border rounded-md"
                      value={pricingForm.contractPricePerDayOver16Seats}
                      onChange={(e) => handlePriceChange('contractPricePerDayOver16Seats', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

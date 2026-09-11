import React from 'react';
import { DEFAULT_ROUTES, APP_CONFIG } from '@/lib/constants/config';
import { Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export interface RouteTableProps {
  showAction?: boolean;
  limit?: number;
}

export const RouteTable: React.FC<RouteTableProps> = ({ showAction = true, limit }) => {
  const routes = limit ? DEFAULT_ROUTES.slice(0, limit) : DEFAULT_ROUTES;

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[560px]">
          <thead className="bg-navy-950 text-white text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Tuyến Lộ Trình</th>
              <th className="px-4 py-3.5 font-semibold">Thời Gian Dự Kiến</th>
              <th className="px-4 py-3.5 font-semibold">Khoảng Cách</th>
              <th className="px-5 py-3.5 font-semibold text-right">Giá Vé Tham Khảo</th>
              {showAction && <th className="px-5 py-3.5 font-semibold text-center">Đặt Vé</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {routes.map((route, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="font-bold text-navy-950 flex items-center gap-1.5 flex-wrap">
                    <span>{route.departure}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                    <span>{route.destination}</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-medium">Chạy đường cao tốc</span>
                </td>
                <td className="px-4 py-3.5 text-slate-600 font-medium">
                  ~{route.estimatedDurationHours} giờ
                </td>
                <td className="px-4 py-3.5 text-slate-500">
                  {route.distanceKm} km
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="font-black text-gold-600 text-base">
                    {route.basePrice.toLocaleString('vi-VN')} ₫
                  </div>
                  <div className="text-[10px] text-slate-400">tùy điểm đón</div>
                </td>
                {showAction && (
                  <td className="px-5 py-3.5 text-center">
                    <a href={`tel:${APP_CONFIG.primaryHotline}`}>
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Phone className="w-3.5 h-3.5" />}
                      >
                        Gọi Ngay
                      </Button>
                    </a>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
        * Bảng giá vé trên là mức tham khảo theo các điểm trung tâm. Vui lòng gọi hotline {APP_CONFIG.hotlines[0]} để nhận báo giá đón tận nơi chính xác.
      </div>
    </div>
  );
};

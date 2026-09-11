import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Badge, Button } from '@/components/ui';
import { MapPin, Clock, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants/config';

export interface RouteCardProps {
  departure: string;
  destination: string;
  distanceKm?: number;
  estimatedDurationHours?: number;
  basePrice?: number;
  highlight?: string;
  isPopular?: boolean;
  stops?: string[];
}

export const RouteCard: React.FC<RouteCardProps> = ({
  departure,
  destination,
  distanceKm,
  estimatedDurationHours,
  basePrice,
  highlight = 'Chạy cao tốc êm ái - Đón trả tận nơi',
  isPopular = false,
  stops = [],
}) => {
  return (
    <Card hover className="h-full flex flex-col justify-between border-slate-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={isPopular ? 'gold' : 'navy'} size="sm">
            {isPopular ? 'Tuyến Trọng Điểm' : 'Tuyến Hàng Ngày'}
          </Badge>
          {estimatedDurationHours && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-gold-600" />
              ~{estimatedDurationHours} giờ
            </span>
          )}
        </div>

        <CardTitle className="text-lg sm:text-xl font-black text-navy-950 flex items-center gap-2 flex-wrap">
          <span>{departure}</span>
          <ArrowRight className="w-4 h-4 text-gold-500 shrink-0" />
          <span>{destination}</span>
        </CardTitle>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{distanceKm ? `Khoảng cách: ~${distanceKm} km` : 'Lộ trình liên tỉnh'}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{highlight}</span>
          </div>
          {stops.length > 0 && (
            <div className="text-slate-500">
              Đi qua: {stops.join(' → ')}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs text-slate-500">Giá vé tham khảo:</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            {basePrice ? (
              <>
                <span className="text-2xl font-black text-gold-600">
                  {basePrice.toLocaleString('vi-VN')}
                </span>
                <span className="text-xs text-slate-600 font-semibold">₫/ghế</span>
              </>
            ) : (
              <span className="text-base font-bold text-navy-900">Liên hệ báo giá</span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 mt-0.5">
            * Báo giá chính xác phụ thuộc điểm đón/trả tận nơi cụ thể.
          </p>
        </div>
      </CardContent>

      <CardFooter className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
        <a href={`tel:${APP_CONFIG.primaryHotline}`} className="flex-1">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            leftIcon={<Phone className="w-3.5 h-3.5" />}
          >
            Gọi Đặt Vé
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
};

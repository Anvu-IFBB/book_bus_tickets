import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Badge, Button } from '@/components/ui';
import { ServiceDetail } from '@/lib/constants/publicContent';
import { CheckCircle2, Phone, Car, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '@/lib/constants/config';
import Link from 'next/link';

export interface ServiceCardProps {
  service: ServiceDetail;
  isFeatured?: boolean;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, isFeatured = false }) => {
  return (
    <Card
      hover
      className={`h-full flex flex-col justify-between ${
        isFeatured ? 'border-gold-500/40 shadow-lg ring-1 ring-gold-500/20' : 'border-slate-200'
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge variant={isFeatured ? 'gold' : 'navy'}>{service.badge}</Badge>
          <span className="text-xs text-slate-400 font-mono">Dịch vụ chính thức</span>
        </div>
        <CardTitle className="text-xl sm:text-2xl font-black text-navy-950">
          {service.title}
        </CardTitle>
        <CardDescription className="text-sm leading-relaxed text-slate-600">
          {service.shortDesc}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Ưu điểm nổi bật:
          </div>
          <ul className="space-y-2 text-sm text-slate-700">
            {service.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{h}</span>
              </li>
            ))}
          </ul>
        </div>

        {service.vehicleOptions.length > 0 && (
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-navy-800" />
              Dòng xe áp dụng:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {service.vehicleOptions.map((v, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-3 rounded-lg bg-gold-50/70 border border-gold-200 text-xs text-slate-700">
          <span className="font-semibold text-gold-900">Chi phí & Giá cước: </span>
          {service.pricingNote}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <a href={`tel:${APP_CONFIG.primaryHotline}`} className="flex-1">
          <Button
            variant="primary"
            size="md"
            fullWidth
            leftIcon={<Phone className="w-4 h-4" />}
          >
            Tư Vấn Hotline
          </Button>
        </a>
        <Link href={`/dich-vu#${service.id}`} className="flex-1">
          <Button
            variant="outline"
            size="md"
            fullWidth
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Chi Tiết
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

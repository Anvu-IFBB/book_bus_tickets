import React from 'react';
import { BookingServiceType } from '@/types/booking';
import { Button, Badge } from '@/components/ui';
import { Car, Calendar, Truck, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface Step1ServiceProps {
  selectedService: BookingServiceType;
  onSelectService: (service: BookingServiceType) => void;
  onNext: () => void;
}

const SERVICES_CONFIG = [
  {
    type: 'LIMOUSINE' as BookingServiceType,
    title: 'Vé Xe Ghép Limousine VIP',
    badge: 'Chạy Hàng Ngày',
    desc: 'Ghế VIP ngả massage, chạy cao tốc liên tục Quảng Ninh ⇄ Hải Phòng ⇄ Thái Bình ⇄ Nam Định ⇄ Ninh Bình.',
    icon: <Car className="w-6 h-6" />,
  },
  {
    type: 'CONTRACT' as BookingServiceType,
    title: 'Thuê Xe Hợp Đồng 5 - 29 Chỗ',
    badge: 'Linh Hoạt Lịch Trình',
    desc: 'Bao trọn xe cho gia đình, cơ quan, đám cưới, đón tiễn sân bay với các dòng 5, 7, 11, 16, 29 chỗ đời mới.',
    icon: <Calendar className="w-6 h-6" />,
  },
  {
    type: 'CARGO' as BookingServiceType,
    title: 'Gửi Hàng Hóa Hỏa Tốc',
    badge: 'Giao Nhận Trong Ngày',
    desc: 'Vận chuyển tài liệu, bưu kiện, thực phẩm tươi sống bảo quản lạnh, giao nhận siêu tốc 2 - 4 tiếng.',
    icon: <Truck className="w-6 h-6" />,
  },
  {
    type: 'TOUR' as BookingServiceType,
    title: 'Xe Đi Các Khu Du Lịch',
    badge: 'Tour Trọn Gói',
    desc: 'Đưa đón tận nơi các điểm danh thắng: Vịnh Hạ Long, Yên Tử, Cát Bà, Tam Chúc, Tràng An, Bái Đính.',
    icon: <Compass className="w-6 h-6" />,
  },
];

export const Step1Service: React.FC<Step1ServiceProps> = ({
  selectedService,
  onSelectService,
  onNext,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl sm:text-2xl font-black text-navy-950">
          Bước 1: Chọn Loại Dịch Vụ Bạn Cần
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Vui lòng chọn loại hình dịch vụ phù hợp với nhu cầu di chuyển hoặc vận tải của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICES_CONFIG.map((svc) => {
          const isSelected = selectedService === svc.type;

          return (
            <div
              key={svc.type}
              onClick={() => onSelectService(svc.type)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-gold-500 bg-gold-50/40 shadow-md ring-2 ring-gold-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectService(svc.type);
                }
              }}
              aria-pressed={isSelected}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-navy-950 text-gold-400' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {svc.icon}
                  </div>
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-gold-600 fill-gold-100" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div>
                  <Badge variant={isSelected ? 'gold' : 'navy'} size="sm" className="mb-1.5">
                    {svc.badge}
                  </Badge>
                  <h3 className="font-extrabold text-navy-950 text-base sm:text-lg">{svc.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{svc.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          rightIcon={<ArrowRight className="w-4 h-4" />}
        >
          Tiếp Tục Nhập Thông Tin
        </Button>
      </div>
    </div>
  );
};

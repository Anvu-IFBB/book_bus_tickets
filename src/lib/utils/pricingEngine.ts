import { CreateBookingDTO } from '@/types/booking';

import { PricingConfig } from '@/types/automation';

const DEFAULT_PRICING: PricingConfig = {
  limousineBasePrice: 250000,
  cargoBasePriceUnder5kg: 100000,
  cargoBasePriceUnder10kg: 150000,
  cargoExtraPerKg: 10000,
  contractPricePerDayUnder7Seats: 1500000,
  contractPricePerDayUnder11Seats: 2500000,
  contractPricePerDayUnder16Seats: 3500000,
  contractPricePerDayOver16Seats: 5000000,
  tourBasePrice: 350000,
};

/**
 * Tính giá cước dự kiến dựa trên dữ liệu booking và cấu hình bảng giá (System Settings)
 */
export function calculateEstimatedPrice(
  dto: Partial<CreateBookingDTO>,
  config?: PricingConfig
): number {
  const pConfig = config || DEFAULT_PRICING;
  let basePrice = 0;

  switch (dto.serviceType) {
    case 'LIMOUSINE':
      basePrice = (dto.passengerCount || 1) * pConfig.limousineBasePrice;
      if (dto.isRoundTrip) {
        basePrice *= 2; // Khứ hồi x2
      }
      break;

    case 'CONTRACT':
      const seatCount = dto.contractDetails?.seatCount || 11;
      const days = dto.contractDetails?.durationDays || 1;
      let pricePerDay = pConfig.contractPricePerDayUnder11Seats;
      if (seatCount <= 7) pricePerDay = pConfig.contractPricePerDayUnder7Seats;
      else if (seatCount <= 11) pricePerDay = pConfig.contractPricePerDayUnder11Seats;
      else if (seatCount <= 16) pricePerDay = pConfig.contractPricePerDayUnder16Seats;
      else pricePerDay = pConfig.contractPricePerDayOver16Seats;
      basePrice = pricePerDay * days;
      break;

    case 'CARGO':
      const weight = dto.cargoDetails?.estimatedWeightKg || 1;
      if (weight <= 5) basePrice = pConfig.cargoBasePriceUnder5kg;
      else if (weight <= 10) basePrice = pConfig.cargoBasePriceUnder10kg;
      else basePrice = pConfig.cargoBasePriceUnder10kg + (weight - 10) * pConfig.cargoExtraPerKg;
      break;

    case 'TOUR':
      basePrice = (dto.passengerCount || 1) * pConfig.tourBasePrice;
      break;

    default:
      basePrice = 0;
  }

  return basePrice;
}

import React from 'react';
import { WizardStep } from '../types';
import { Check } from 'lucide-react';

export interface StepIndicatorProps {
  currentStep: WizardStep;
}

const STEPS: { step: WizardStep; label: string; shortLabel: string }[] = [
  { step: 1, label: 'Chọn Dịch Vụ', shortLabel: 'Dịch vụ' },
  { step: 2, label: 'Thông Tin Chuyến', shortLabel: 'Chuyến đi' },
  { step: 3, label: 'Thông Tin Liên Hệ', shortLabel: 'Liên hệ' },
  { step: 4, label: 'Kiểm Tra Xác Nhận', shortLabel: 'Xác nhận' },
  { step: 5, label: 'Hoàn Tất Đặt Chỗ', shortLabel: 'Hoàn tất' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full py-4 border-b border-slate-200">
      <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
        {STEPS.map((s, idx) => {
          const isCompleted = currentStep > s.step;
          const isCurrent = currentStep === s.step;

          return (
            <React.Fragment key={s.step}>
              <div className="flex flex-col items-center gap-1.5 z-10">
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-200'
                      : isCurrent
                      ? 'bg-navy-950 text-gold-400 ring-4 ring-gold-400/30'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-semibold text-center hidden sm:block ${
                    isCurrent ? 'text-navy-950 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`text-[10px] font-semibold text-center sm:hidden ${
                    isCurrent ? 'text-navy-950 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  {s.shortLabel}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1.5 sm:mx-2.5 transition-colors ${
                    currentStep > s.step ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

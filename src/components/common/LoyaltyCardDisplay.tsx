import React from 'react';
import { Check, Sparkles, QrCode as QrIcon } from 'lucide-react';
import { LoyaltyProgram, CustomerCard, Merchant } from '../../types';

interface LoyaltyCardDisplayProps {
  merchant: Merchant;
  program: LoyaltyProgram;
  card?: CustomerCard;
  customerName?: string;
  customerPhone?: string;
  onOpenQr?: () => void;
}

export const LoyaltyCardDisplay: React.FC<LoyaltyCardDisplayProps> = ({
  merchant,
  program,
  card,
  customerName,
  customerPhone,
  onOpenQr,
}) => {
  const currentVisits = card ? card.currentVisits : 0;
  const targetVisits = program.targetVisits || 5;
  const remaining = Math.max(0, targetVisits - currentVisits);
  const isRewardEarned = remaining === 0;

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-900 text-white p-6 shadow-lg shadow-emerald-950/15 border border-emerald-700/60 relative overflow-hidden">
      {/* Subtle background ambient light */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header: Merchant Name & City */}
      <div className="relative z-10 flex items-start justify-between gap-3 pb-5 border-b border-white/10">
        <div>
          <span className="text-[11px] font-semibold tracking-wider text-emerald-200">
            بطاقة ولاء رقمية
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5 tracking-tight">
            {merchant.businessName}
          </h3>
          <p className="text-xs text-emerald-100/75 mt-0.5">
            {merchant.city}
          </p>
        </div>

        {onOpenQr && (
          <button
            type="button"
            onClick={onOpenQr}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium transition-colors cursor-pointer border border-white/10"
            title="رمز QR"
          >
            <QrIcon className="w-3.5 h-3.5" />
            <span>الرمز</span>
          </button>
        )}
      </div>

      {/* Center: Stamp Circles */}
      <div className="relative z-10 my-6">
        <div className="flex items-center justify-between text-xs text-emerald-100/90 mb-3 font-medium">
          <span>الزيارات المسجلة</span>
          <span className="font-bold text-white">
            {currentVisits} من {targetVisits} {program.unitName}
          </span>
        </div>

        {/* Stamps Row */}
        <div className="grid grid-cols-5 gap-2.5">
          {Array.from({ length: targetVisits }).map((_, index) => {
            const isCompleted = index < currentVisits;
            const isRewardSlot = index === targetVisits - 1;

            return (
              <div
                key={index}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                  isCompleted
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : isRewardSlot
                    ? 'bg-emerald-600/40 border border-amber-300/80 text-amber-200'
                    : 'bg-emerald-900/60 border border-white/15 text-emerald-200/60'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
                ) : isRewardSlot ? (
                  <Sparkles className="w-4 h-4 text-amber-300" />
                ) : (
                  <span className="text-xs font-semibold">{index + 1}</span>
                )}
                <span className="text-[9px] mt-0.5 font-medium opacity-80">
                  {isRewardSlot ? 'الهدية' : index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer: Reward Title & Remaining notice */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-emerald-200/80 block">المكافأة</span>
          <p className="font-semibold text-white truncate mt-0.5">
            {program.rewardTitle}
          </p>
        </div>

        <div className="shrink-0">
          {isRewardEarned ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[11px] font-bold">
              مستحقة الآن!
            </span>
          ) : (
            <span className="text-emerald-100/80 text-[11px] font-medium bg-white/10 px-2.5 py-1 rounded-lg">
              متبقي {remaining}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useWafa } from '../../context/WafaContext';
import { LoyaltyCardDisplay } from '../common/LoyaltyCardDisplay';
import { ArrowLeft, Plus } from 'lucide-react';
import { CustomerCard } from '../../types';

interface HeroProps {
  onOpenRegisterModal: () => void;
  onOpenLoginModal: (tab: 'customer' | 'staff' | 'merchant') => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenRegisterModal, onOpenLoginModal }) => {
  const { merchants, programs } = useWafa();

  // Representative merchant & program
  const sampleMerchant = merchants.find((m) => m.id === 'm-kharj-wash') || merchants[0];
  const sampleProgram = programs.find((p) => p.merchantId === sampleMerchant.id) || programs[0];

  // Subtle interactive stamp state
  const [demoVisits, setDemoVisits] = useState(4); // 4 of 5

  const handleSimulateStamp = () => {
    if (demoVisits < sampleProgram.targetVisits - 1) {
      setDemoVisits((v) => v + 1);
    } else if (demoVisits === sampleProgram.targetVisits - 1) {
      setDemoVisits(sampleProgram.targetVisits);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#059669', '#10b981', '#f59e0b'],
      });
    } else {
      setDemoVisits(1);
    }
  };

  const demoCard: CustomerCard = {
    id: 'hero-preview-card',
    customerId: 'cust-demo',
    merchantId: sampleMerchant.id,
    currentVisits: demoVisits,
    totalLifetimeVisits: 9,
    rewardsEarnedCount: demoVisits >= sampleProgram.targetVisits ? 1 : 0,
    rewardsRedeemedCount: 0,
    unclaimedRewards: [],
    joinedAt: '2025-01-01',
  };

  return (
    <section className="bg-white pt-14 pb-18 md:pt-20 md:pb-24 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Right Column (RTL): Short, punchy copy & 2 clear buttons */}
          <div className="lg:col-span-7 text-right space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              بطاقات ولاء رقمية{' '}
              <span className="text-emerald-600">تضمن عودة عملائك</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
              ساعد عملاء محلك التجاري على جمع الزيارات وكسب المكافآت مباشرة من متصفح الجوال بدون تحميل أي تطبيق.
            </p>

            {/* Exactly Two Clear Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onOpenRegisterModal}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>انضم كتاجر</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onOpenLoginModal('merchant')}
                className="px-6 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-sm transition-colors cursor-pointer"
              >
                تسجيل الدخول
              </button>
            </div>

            {/* Quiet reassurance line */}
            <div className="pt-3 text-xs text-slate-400 font-medium flex items-center gap-3">
              <span>بدون تطبيق للعميل</span>
              <span>•</span>
              <span>إعداد فوري في دقيقتين</span>
              <span>•</span>
              <span>تبدأ من 79 ر.س / شهرياً</span>
            </div>
          </div>

          {/* Left Column: One Single Sleek Loyalty Card Display */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm">
              <LoyaltyCardDisplay
                merchant={sampleMerchant}
                program={sampleProgram}
                card={demoCard}
              />

              {/* Minimalist interactive toggle to try stamping */}
              <div className="mt-3.5 text-center">
                <button
                  type="button"
                  onClick={handleSimulateStamp}
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {demoVisits >= sampleProgram.targetVisits
                      ? 'اكتملت البطاقة! انقر لإعادة التجربة'
                      : 'انقر لتجربة تسجيل زيارة (+1)'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

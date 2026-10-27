import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import { Check, ArrowLeft, Building2 } from 'lucide-react';
import { PricingPlan } from '../../types';

interface PricingSectionProps {
  onSelectPlan: (plan: PricingPlan) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const { plans } = useWafa();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <section id="pricing" className="py-20 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
            الباقات والأسعار
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            أسعار واضحة وبسيطة تناسب حجم نشاطك
          </h2>
          <p className="text-sm text-slate-600">
            بدون عقود ملزمة أو عمولات خفية على زيارات ومشتريات العملاء.
          </p>

          {/* Billing toggle */}
          <div className="pt-3 flex items-center justify-center gap-3 text-xs font-semibold">
            <span className={billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}>
              شهري
            </span>
            <button
              type="button"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="w-11 h-6 rounded-full bg-slate-200 p-0.5 border border-slate-300 relative transition-colors cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-emerald-600 transition-transform ${
                  billingCycle === 'annual' ? '-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={billingCycle === 'annual' ? 'text-slate-900 flex items-center gap-1.5' : 'text-slate-400 flex items-center gap-1.5'}>
              سنوي
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                شهرين مجاناً
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isPopular = plan.popular;
            const price = billingCycle === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12);

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-7 flex flex-col justify-between transition-all bg-white border ${
                  isPopular
                    ? 'border-emerald-600 ring-1 ring-emerald-600 shadow-md relative'
                    : 'border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[11px]">
                    الأكثر طلباً
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {plan.maxBranches === 'unlimited' ? 'فروع غير محدودة' : `${plan.maxBranches} فرع`}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed mb-5 min-h-[36px]">
                    {plan.description}
                  </p>

                  <div className="pb-5 mb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-slate-900 font-mono">{price}</span>
                      <span className="text-xs font-semibold text-slate-500">ر.س / شهرياً</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-7">
                    {plan.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan)}
                  className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isPopular
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>اختيار الباقة</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Note on manual trial setup */}
        <p className="text-center text-xs text-slate-400 mt-8">
          فترة تجربة مجانية لكافة الباقات • تفعيل فوري مع فريق وفاء دون الحاجة لبطاقة بنكية
        </p>
      </div>
    </section>
  );
};

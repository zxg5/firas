import React from 'react';
import { Store, Smartphone, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'أنشئ بطاقتك وحدد المكافأة',
      description: 'أدخل اسم محلك، وحدد عدد الزيارات المطلوبة والمكافأة التي تناسب طبيعة نشاطك التجاري.',
      icon: Store,
    },
    {
      number: '2',
      title: 'العميل يمسح الرمز من جواله',
      description: 'يفتح العميل بطاقة الولاء على متصفح هاتفه برقم جواله فوراً دون تحميل أي تطبيق.',
      icon: Smartphone,
    },
    {
      number: '3',
      title: 'الموظف يسجل الزيارة ويعتمد الهدية',
      description: 'يسجل الكاشير الزيارة المؤهلة بعد تقديم الخدمة، ويصرف المكافأة برمز أمان لمرة واحدة.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/60 border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-14">
          <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
            آلية العمل
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            كيف تعمل وفاء في محلك التجاري؟
          </h2>
          <p className="text-sm text-slate-600">
            خطوات بسيطة وسريعة لا تعطل حركة المحاسبة ولا تزعج عميلك.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold text-slate-300 font-mono">
                      0{step.number}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

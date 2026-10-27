import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface RoiCalculatorProps {
  onOpenRegisterModal: () => void;
}

export const RoiCalculator: React.FC<RoiCalculatorProps> = ({ onOpenRegisterModal }) => {
  const [businessType, setBusinessType] = useState<'car-wash' | 'barber' | 'salon' | 'chalet' | 'cafe'>('car-wash');
  const [dailyCustomers, setDailyCustomers] = useState<number>(45);
  const [avgTicket, setAvgTicket] = useState<number>(35);

  const handleTypeChange = (type: 'car-wash' | 'barber' | 'salon' | 'chalet' | 'cafe') => {
    setBusinessType(type);
    if (type === 'car-wash') {
      setDailyCustomers(45);
      setAvgTicket(35);
    } else if (type === 'barber') {
      setDailyCustomers(30);
      setAvgTicket(50);
    } else if (type === 'salon') {
      setDailyCustomers(20);
      setAvgTicket(120);
    } else if (type === 'chalet') {
      setDailyCustomers(4);
      setAvgTicket(650);
    } else if (type === 'cafe') {
      setDailyCustomers(90);
      setAvgTicket(24);
    }
  };

  const monthlyTotalCustomers = dailyCustomers * 30;
  const repeatBoostRate = 0.22;
  const additionalVisits = Math.round(monthlyTotalCustomers * repeatBoostRate);
  const additionalRevenue = Math.round(additionalVisits * avgTicket);

  return (
    <section id="calculator" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
            حاسبة العائد
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            تقدير العائد المالي لنشاطك
          </h2>
          <p className="text-sm text-slate-600">
            شاهد الأثر المالي المتوقع لزيادة ولاء العملاء وتكرار زياراتهم.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Inputs Column */}
            <div className="lg:col-span-7 space-y-5 text-right">
              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  نوع النشاط:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-xs font-medium">
                  {[
                    { id: 'car-wash', label: 'مغسلة' },
                    { id: 'barber', label: 'حلاق' },
                    { id: 'salon', label: 'مشغل' },
                    { id: 'chalet', label: 'شاليه' },
                    { id: 'cafe', label: 'كافيه' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleTypeChange(t.id as any)}
                      className={`py-2 rounded-lg text-center transition-colors cursor-pointer ${
                        businessType === t.id
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1 */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                  <span className="text-slate-700">
                    {businessType === 'chalet' ? 'الحجوزات شهرياً' : 'متوسط العملاء يومياً'}
                  </span>
                  <span className="font-bold text-slate-900 font-mono">
                    {dailyCustomers} {businessType === 'chalet' ? 'حجز' : 'عميل'}
                  </span>
                </div>
                <input
                  type="range"
                  min={businessType === 'chalet' ? 2 : 5}
                  max={businessType === 'chalet' ? 30 : 200}
                  value={dailyCustomers}
                  onChange={(e) => setDailyCustomers(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Slider 2 */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1.5">
                  <span className="text-slate-700">متوسط قيمة الخدمة</span>
                  <span className="font-bold text-slate-900 font-mono">
                    {avgTicket} ر.س
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={businessType === 'chalet' ? 2000 : 300}
                  step={5}
                  value={avgTicket}
                  onChange={(e) => setAvgTicket(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-6 text-center space-y-3 shadow-2xs">
              <span className="text-xs font-medium text-slate-500 block">
                مبيعات إضافية تقديرية شهرياً
              </span>
              <div className="text-3xl font-black text-emerald-700 font-mono">
                +{additionalRevenue.toLocaleString('ar-SA')} <span className="text-base font-semibold">ر.س</span>
              </div>
              <p className="text-[11px] text-slate-500">
                مبني على زيادة متوقعة بنسبة 22% في عودة العملاء (+{additionalVisits} زيارة)
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenRegisterModal}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>ابدأ برنامج الولاء</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

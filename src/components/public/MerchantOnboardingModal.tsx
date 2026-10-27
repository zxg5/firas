import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import { X, Store, Check, ArrowLeft, Sparkles, Building2 } from 'lucide-react';
import { PricingPlan } from '../../types';

interface MerchantOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan?: PricingPlan;
}

export const MerchantOnboardingModal: React.FC<MerchantOnboardingModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const { categories, registerMerchant } = useWafa();

  const [businessName, setBusinessName] = useState('');
  const [commercialReg, setCommercialReg] = useState('');
  const [categoryId, setCategoryId] = useState('car-wash');
  const [city, setCity] = useState('الخرج');
  const [phone, setPhone] = useState('055');
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState<'basic' | 'plus' | 'pro'>(selectedPlan?.id || 'plus');
  const [firstBranchName, setFirstBranchName] = useState('الفرع الرئيسي');
  const [targetVisits, setTargetVisits] = useState(5);
  const [unitName, setUnitName] = useState('غسلة');
  const [rewardTitle, setRewardTitle] = useState('غسلة VIP مجانية شاملة التلميع والشمع');

  if (!isOpen) return null;

  // When category changes, auto-suggest defaults
  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    const cat = categories.find((c) => c.id === newCatId);
    if (cat) {
      setTargetVisits(cat.defaultTarget);
      setUnitName(cat.defaultUnit);
      setRewardTitle(cat.defaultReward);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !phone.trim()) return;

    registerMerchant(
      {
        businessName,
        commercialReg: commercialReg || '1010' + Math.floor(100000 + Math.random() * 900000),
        categoryId,
        city,
        phone,
        email: email || `contact@${businessName.replace(/\s+/g, '').toLowerCase()}.sa`,
        planId,
      },
      firstBranchName,
      {
        targetVisits: Number(targetVisits),
        unitName,
        rewardTitle,
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 shadow-2xl text-slate-900 p-6 sm:p-8 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700">تسجيل نشاط تجاري جديد</span>
              <h3 className="text-xl font-black text-slate-900">انضم لمنصة WAFA | وفاء</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-right">
          {/* Business Details */}
          <div>
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              1. بيانات المنشأة التجارية
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  اسم المنشأة أو المحل *
                </label>
                <input
                  type="text"
                  placeholder="مثال: مغسلة الواحة الحديثة"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  القطاع التجاري *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  المدينة *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                >
                  <option value="الخرج">الخرج</option>
                  <option value="الرياض">الرياض</option>
                  <option value="الدلم">الدلم</option>
                  <option value="الدمام">الدمام</option>
                  <option value="جدة">جدة</option>
                  <option value="القصيم">القصيم</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  رقم السجل التجاري أو وثيقة العمل الحر
                </label>
                <input
                  type="text"
                  placeholder="1010XXXXXX"
                  value={commercialReg}
                  onChange={(e) => setCommercialReg(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  رقم الجوال للتواصل *
                </label>
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="05XXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  اسم الفرع الأول
                </label>
                <input
                  type="text"
                  placeholder="مثال: الفرع الرئيسي - طريق الملك عبدالله"
                  value={firstBranchName}
                  onChange={(e) => setFirstBranchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Loyalty Program Config */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              2. إعداد بطاقة الولاء والمكافأة
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  العدد المطلوب لاستحقاق الهدية
                </label>
                <input
                  type="number"
                  min={2}
                  max={15}
                  value={targetVisits}
                  onChange={(e) => setTargetVisits(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  تسمية العملية / الوحدة
                </label>
                <input
                  type="text"
                  placeholder="غسلة، حلاقة، حجز، زيارة"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  الباقة المختارة
                </label>
                <select
                  value={planId}
                  onChange={(e) => setPlanId(e.target.value as 'basic' | 'plus' | 'pro')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-emerald-800 font-bold focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="basic">وفاء الأساسية (79 ر.س/ش)</option>
                  <option value="plus">وفاء بلس (119 ر.س/ش) - الأفضل</option>
                  <option value="pro">وفاء برو (179 ر.س/ش) - فروع متعددة</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  عنوان المكافأة المستحقة للعميل *
                </label>
                <input
                  type="text"
                  placeholder="مثال: غسلة VIP مجانية شاملة التلميع والشمع"
                  value={rewardTitle}
                  onChange={(e) => setRewardTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-bold"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium">
              فترة تجربة مجانية 14 يوماً بدون بطاقة بنكية.
            </span>
            <button
              type="submit"
              className="py-3.5 px-6 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>إنشاء بطاقة الولاء والدخول للوحة التحكم</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

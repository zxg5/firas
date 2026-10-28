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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [categoryId, setCategoryId] = useState('car-wash');
  const [city, setCity] = useState('الخرج');
  const [phone, setPhone] = useState('055');
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState<'basic' | 'plus' | 'pro'>(selectedPlan?.id || 'plus');
  const [firstBranchName, setFirstBranchName] = useState('الفرع الرئيسي');
  const [targetVisits, setTargetVisits] = useState(5);
  const [unitName, setUnitName] = useState('غسلة');
  const [rewardTitle, setRewardTitle] = useState('غسلة VIP مجانية شاملة التلميع والشمع');
  const [isSubmitted, setIsSubmitted] = useState(false);

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

    const cleanUsername = (username || email.split('@')[0] || businessName.replace(/\s+/g, '_')).toLowerCase().replace(/[^a-z0-9_]/g, '');

    registerMerchant(
      {
        businessName,
        username: cleanUsername,
        password: password || 'Merchant@123456',
        categoryId,
        city,
        phone,
        email: email || `contact@${cleanUsername || 'store'}.sa`,
        planId,
      },
      firstBranchName,
      {
        targetVisits: Number(targetVisits),
        unitName,
        rewardTitle,
      }
    );

    setIsSubmitted(true);
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

        {isSubmitted ? (
          <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Sparkles className="w-8 h-8 animate-pulse text-amber-600" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                تم استلام طلب تسجيل المنشأة بنجاح
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                الحساب بانتظار موافقة واعتماد الإدارة
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                شكراً لانضمامك إلى منصة وفاء ({businessName}). بحسب أنظمة المنصة المعتمدة، تخضع حسابات التجار الجديدة للتدقيق الأمني والموافقة من قِبل إدارة المنصة قبل تفعيل صلاحية الدخول.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-right space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">اسم المستخدم (اليوزر):</span>
                <span className="font-mono font-bold text-emerald-800" dir="ltr">@{username || email.split('@')[0]}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">البريد الإلكتروني:</span>
                <span className="font-mono text-slate-800" dir="ltr">{email || '—'}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <span className="text-slate-500">حالة الحساب:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                  ⏳ قيد مراجعة واعتماد الإدارة
                </span>
              </div>
            </div>

            <div className="max-w-md mx-auto p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 text-right space-y-3">
              <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-600" />
                <span>للتفعيل الفوري والاستعجال:</span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed">
                يمكنك التواصل المباشر مع مسؤول اعتماد المتاجر في إدارة المنصة لاعتماد وتفعيل حسابك فوراً:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://wa.me/966534067866?text=${encodeURIComponent(
                    `السلام عليكم، قمت بتسجيل منشأة جديدة في منصة وفاء (${businessName}) باسم مستخدم (@${username || email.split('@')[0]}) وأرغب في اعتماد وتفعيل الحساب فوراً.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <span>محادثة واتساب للاعتماد الفوري</span>
                </a>
                <a
                  href="tel:0534067866"
                  dir="ltr"
                  className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 font-mono"
                >
                  0534067866
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق والعودة للرئيسية
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-right">
            {/* Notice */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 leading-relaxed font-medium">
              🛡️ <strong>ملاحظة هامة للمنشآت الجديدة:</strong> عند تسجيل المنشأة لأول مرة، يرجى تزويدنا ببيانات الدخول المطلوبة (الإيميل، اليوزر، كلمة المرور). يتم إرسال طلبكم لإدارة منصة وفاء للمراجعة والاعتماد، ولا يقبل تسجيل الدخول إلا بعد الموافقة الرسمية.
            </div>

            {/* Business Details */}
            <div>
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                1. بيانات المنشأة وحساب الدخول
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
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      اسم المستخدم (اليوزر) للدخول *
                    </label>
                    <span className="text-[10px] text-emerald-700 font-mono font-bold">
                      فريد باللغة الإنجليزية
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="مثال: alwaha_wash"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    البريد الإلكتروني للتاجر *
                  </label>
                  <input
                    type="email"
                    placeholder="info@store.sa"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    dir="ltr"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    كلمة المرور للدخول *
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    dir="ltr"
                    required
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


                <div className="sm:col-span-2">
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
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500 font-medium">
                فترة تجربة مجانية 14 يوماً • بالطلب أنت توافق على <span className="text-emerald-700 font-bold">الشروط والأحكام وسياسة الخصوصية</span>.
              </span>
              <button
                type="submit"
                className="py-3.5 px-6 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>إرسال طلب تسجيل المنشأة للاعتماد</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

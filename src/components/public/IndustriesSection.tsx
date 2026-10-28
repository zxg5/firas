import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import {
  Car,
  Home,
  Sparkles,
  Scissors,
  Coffee,
  Smile,
  ArrowLeft,
  CheckCircle,
} from 'lucide-react';

interface IndustriesSectionProps {
  onOpenRegisterModal: () => void;
}

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({
  onOpenRegisterModal,
}) => {
  const { categories, submitIndustrySuggestion } = useWafa();
  const [selectedCatId, setSelectedCatId] = useState<string>('car-wash');
  const [showRequestNew, setShowRequestNew] = useState<boolean>(false);
  const [customIndustryName, setCustomIndustryName] = useState<string>('');
  const [customProposerName, setCustomProposerName] = useState<string>('');
  const [customPhone, setCustomPhone] = useState<string>('');
  const [customCity, setCustomCity] = useState<string>('الخرج');
  const [customUnit, setCustomUnit] = useState<string>('زيارة');
  const [customReward, setCustomReward] = useState<string>('');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customIndustrySuccess, setCustomIndustrySuccess] = useState<boolean>(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return Car;
      case 'Home':
        return Home;
      case 'Sparkles':
        return Sparkles;
      case 'Scissors':
        return Scissors;
      case 'Coffee':
        return Coffee;
      case 'Smile':
        return Smile;
      default:
        return Sparkles;
    }
  };

  const selectedCat = categories.find((c) => c.id === selectedCatId) || categories[0];
  const SelectedIcon = getIcon(selectedCat.iconName);

  const handleCustomRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIndustryName.trim()) return;

    setIsSubmitting(true);
    try {
      await submitIndustrySuggestion({
        categoryName: customIndustryName.trim(),
        proposerName: customProposerName.trim() || undefined,
        phone: customPhone.trim() || undefined,
        city: customCity.trim() || 'الخرج',
        suggestedUnit: customUnit.trim() || 'زيارة',
        suggestedReward: customReward.trim() || undefined,
        notes: customNotes.trim() || undefined,
      });

      setCustomIndustrySuccess(true);
      setTimeout(() => {
        setCustomIndustrySuccess(false);
        setShowRequestNew(false);
        setCustomIndustryName('');
        setCustomProposerName('');
        setCustomPhone('');
        setCustomReward('');
        setCustomNotes('');
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="industries" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-12">
          <span className="text-xs font-semibold text-emerald-700 tracking-wide uppercase">
            القطاعات
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            أنشطة تجارية يدعمها نظام وفاء
          </h2>
          <p className="text-sm text-slate-600">
            مصممة بمرونة لتناسب طبيعة كل قطاع: من مغاسل السيارات بالخرج إلى الشاليهات والمشاغل والكافيهات.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => {
            const Icon = getIcon(cat.iconName);
            const isSelected = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCatId(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Sector Details Box */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-slate-50/70 border border-slate-200/80 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200/60">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <SelectedIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCat.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  الوحدة المعتمدة: {selectedCat.defaultUnit}
                </p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[11px] text-slate-400 block font-medium">الهدف المقترح</span>
              <span className="text-sm font-bold text-emerald-700 font-mono">
                {selectedCat.defaultTarget} {selectedCat.defaultUnit}ات
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-600 leading-relaxed my-5 font-normal">
            {selectedCat.description}
          </p>

          <div className="p-4 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-3 text-xs mb-6">
            <div>
              <span className="text-slate-400 block text-[10px]">المكافأة المقترحة</span>
              <span className="font-semibold text-slate-900 mt-0.5 block">{selectedCat.defaultReward}</span>
            </div>
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>ابدأ بهذا النشاط</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowRequestNew(true)}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              هل نشاطك غير مدرج؟ اضغط هنا لطلبه
            </button>
          </div>
        </div>

        {/* Modal: Request New Industry */}
        {showRequestNew && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">هل نشاطك غير مدرج؟ اقترح نشاطك الآن</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    سيصل اقتراحك مباشرة إلى لوحة إدارة المنصة لمراجعته واعتماده فوراً.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRequestNew(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {customIndustrySuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-center space-y-2 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-emerald-900">وصل اقتراحك إلى لوحة الإدارة بنجاح!</h4>
                  <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                    تم توثيق اقتراح النشاط ({customIndustryName}) وإرسال إشعار فوري لإدارة منصة وفاء لتجهيز بطاقة الولاء المخصصة.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCustomRequest} className="space-y-3.5">
                  <div>
                    <label className="text-xs text-slate-700 font-bold block mb-1">
                      اسم النشاط التجاري المقترح <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مغاسل السجاد، مجمع عيادات أسنان، نادي فروسية..."
                      value={customIndustryName}
                      onChange={(e) => setCustomIndustryName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        اسمك الكريم / اسم المتجر
                      </label>
                      <input
                        type="text"
                        placeholder="محمد السبيعي"
                        value={customProposerName}
                        onChange={(e) => setCustomProposerName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        رقم الجوال للتواصل وتفعيل النظام
                      </label>
                      <input
                        type="tel"
                        placeholder="0534067866"
                        dir="ltr"
                        value={customPhone}
                        onChange={(e) => setCustomPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        المدينة
                      </label>
                      <input
                        type="text"
                        placeholder="الخرج / الرياض..."
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-700 font-bold block mb-1">
                        وحدة الاحتساب المقترحة
                      </label>
                      <input
                        type="text"
                        placeholder="زيارة، حجز، فحص، جلسة..."
                        value={customUnit}
                        onChange={(e) => setCustomUnit(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-700 font-bold block mb-1">
                      مقترح المكافأة أو ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="مثال: بعد كل 4 زيارات يحصل العميل على خصم 50% أو غسيل مجاني..."
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none leading-relaxed"
                    />
                  </div>

                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || !customIndustryName.trim()}
                      className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                    >
                      {isSubmitting ? 'جاري إرسال الاقتراح للوحة الإدارة...' : 'إرسال الاقتراح لإدارة المنصة'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestNew(false)}
                      className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

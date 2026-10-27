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
  const { categories } = useWafa();
  const [selectedCatId, setSelectedCatId] = useState<string>('car-wash');
  const [showRequestNew, setShowRequestNew] = useState<boolean>(false);
  const [customIndustryName, setCustomIndustryName] = useState<string>('');
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

  const handleCustomRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customIndustryName.trim()) return;
    setCustomIndustrySuccess(true);
    setTimeout(() => {
      setCustomIndustrySuccess(false);
      setShowRequestNew(false);
      setCustomIndustryName('');
    }, 2000);
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl">
              <h3 className="text-base font-bold text-slate-900">طلب إضافة نشاط تجاري جديد</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                يسعدنا تخصيص نموذج وفاء فوراً لنشاطك التجاري.
              </p>

              {customIndustrySuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs text-center font-bold">
                  تم استلام طلبك بنجاح! سيتواصل معك فريق وفاء لإضافة النشاط.
                </div>
              ) : (
                <form onSubmit={handleCustomRequest} className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-700 font-medium block mb-1">
                      اسم النشاط التجاري
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: مغاسل ملابس، أكاديمية، مجمع طبي..."
                      value={customIndustryName}
                      onChange={(e) => setCustomIndustryName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      إرسال الطلب
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowRequestNew(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
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

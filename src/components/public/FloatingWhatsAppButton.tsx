import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const supportPhone = '966551234567'; // Merchant sales contact

  const handleStartChat = (presetMessage: string) => {
    const encoded = encodeURIComponent(presetMessage);
    window.open(`https://wa.me/${supportPhone}?text=${encoded}`, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Expanded Popup Menu */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 text-slate-900 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">مستشار وفاء للأعمال</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>متواجدون لخدمتك عبر الواتساب</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-slate-600 my-3 leading-relaxed">
            مرحباً بك! هل تود استشارة سريعة لتطبيق بطاقات الولاء في نشاطك التجاري أو بدء فترة تجريبية مجانية؟
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() =>
                handleStartChat(
                  'السلام عليكم، أود تجربة منصة وفاء والاستفسار عن باقات الأنشطة التجارية لمغسلة / كافيه / مشغل.'
                )
              }
              className="w-full text-right p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-xs text-slate-800 transition-colors flex items-center justify-between group"
            >
              <span>أود الاستفسار عن باقات التجار وتفعيل التجربة</span>
              <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleStartChat(
                  'مرحباً وفاء، لدي استفسار حول كيفية عمل بطاقة الولاء مع كاشير المحل والأمان ضد التلاعب.'
                )
              }
              className="w-full text-right p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-xs text-slate-800 transition-colors flex items-center justify-between group"
            >
              <span>كيف تعمل البطاقة مع الكاشير؟</span>
              <Send className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-700/30 transition-all hover:scale-105 cursor-pointer font-bold text-xs"
        title="تحدث مع مستشار وفاء عبر الواتساب"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-emerald-600"></span>
        </div>
        <span className="hidden sm:inline">تواصل واتساب</span>
      </button>
    </div>
  );
};

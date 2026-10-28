import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Smartphone, Share2, PlusSquare, X } from 'lucide-react';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'nav' | 'hero' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'nav',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone PWA mode, don't show prompt
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'hero') {
      return (
        <button
          onClick={install}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-slate-800 transition-all cursor-pointer ${className}`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>تثبيت تطبيق وفاء على هاتفك</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20 text-xs font-bold transition-all cursor-pointer border border-emerald-200/60 ${className}`}
        title="تثبيت منصة وفاء كتطبيق سريع على هاتفك"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span>تثبيت التطبيق</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/10 text-emerald-800 hover:bg-emerald-600/20 text-xs font-bold transition-all cursor-pointer border border-emerald-200/60 ${className}`}
          title="تثبيت المنصة على آيفون / آيباد"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>تثبيت على الآيفون</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" dir="rtl">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 text-right">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    و
                  </div>
                  <h3 className="text-base font-bold text-slate-900">تثبيت وفاء على الآيفون</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <Share2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">1. اضغط زر المشاركة (Share)</p>
                    <p className="text-[11px] text-slate-500">في شريط متصفح سفاري بالأسفل أو بالأعلى.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                  <PlusSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900">2. اختر «إضافة إلى الصفحة الرئيسية»</p>
                    <p className="text-[11px] text-slate-500">Add to Home Screen ليعمل التطبيق بشاشة كاملة وبأعلى سرعة.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition"
              >
                فهمت ذلك، تم
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};

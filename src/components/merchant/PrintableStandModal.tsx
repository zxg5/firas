import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Merchant, LoyaltyProgram } from '../../types';
import {
  Printer,
  X,
  Sparkles,
  Download,
  Palette,
  Check,
  Smartphone,
  Gift,
  Award,
  Store,
  QrCode as QrIcon,
} from 'lucide-react';

interface PrintableStandModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant;
  program: LoyaltyProgram;
}

export const PrintableStandModal: React.FC<PrintableStandModalProps> = ({
  isOpen,
  onClose,
  merchant,
  program,
}) => {
  const [standTheme, setStandTheme] = useState<'emerald' | 'dark' | 'minimal'>('emerald');
  const [standSize, setStandSize] = useState<'a5' | 'a6' | 'square'>('a5');
  const [customSlogan, setCustomSlogan] = useState('امسح الكود بكاميرا جوالك واجمع زياراتك لتحصل على مكافأتك!');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const printAreaRef = useRef<HTMLDivElement>(null);

  // Generate real QR pointing to customer registration/card URL
  useEffect(() => {
    if (merchant) {
      const targetUrl = `${window.location.origin}/?join=${merchant.id}`;
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: standTheme === 'dark' ? '#064e3b' : '#047857',
          light: '#ffffff',
        },
      }).then(setQrDataUrl);
    }
  }, [merchant, standTheme]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Styles for print isolation */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #wafa-printable-stand-target, #wafa-printable-stand-target * {
            visibility: visible !important;
          }
          #wafa-printable-stand-target {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            margin: 0 !important;
            padding: 24px !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">ستاند الكاشير الجاهز للطباعة</h3>
              <p className="text-xs text-slate-500">اطبعه وضعه على طاولة المحاسب ليتمكن العملاء من مسح الـ QR فوراً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-4">
            {/* Theme Picker */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-600" />
                طابع التصميم:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStandTheme('emerald')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standTheme === 'emerald'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  أخضر وفاء
                </button>
                <button
                  type="button"
                  onClick={() => setStandTheme('dark')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standTheme === 'dark'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  أسود فاخر
                </button>
                <button
                  type="button"
                  onClick={() => setStandTheme('minimal')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standTheme === 'minimal'
                      ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  أبيض هادئ
                </button>
              </div>
            </div>

            {/* Size Picker */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700">حجم الستاند:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStandSize('a5')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standSize === 'a5'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  A5 (ستاند أكريليك)
                </button>
                <button
                  type="button"
                  onClick={() => setStandSize('a6')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standSize === 'a6'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  A6 (ملصق صغير)
                </button>
                <button
                  type="button"
                  onClick={() => setStandSize('square')}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                    standSize === 'square'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  مربع كاونتر
                </button>
              </div>
            </div>

            {/* Custom Slogan */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700">العبارة التحفيزية للزبون:</label>
              <textarea
                value={customSlogan}
                onChange={(e) => setCustomSlogan(e.target.value)}
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            {/* Quick Tips */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-emerald-950 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                نصيحة نجاح لزيادة اشتراكات العملاء:
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                ضع الستاند في متناول عين العميل مباشرة عند جهاز الدفع (مدى)، واطلب من الكاشير أن يقول: "امسح الكود لتبدأ بجمع أختامك!"
              </p>
            </div>

            {/* Print Action Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة الستاند الآن (Print)</span>
            </button>
          </div>

          {/* Stand Live Preview Area */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-100 p-6 rounded-2xl border border-slate-200">
            <div className="text-[11px] font-bold text-slate-500 mb-3 flex items-center gap-1">
              <span>معاينة حية بالحجم الواقعي</span>
              <span>•</span>
              <span>جاهز للطباعة على ورق مقوى أو ستاند أكريليك</span>
            </div>

            {/* The Actual Printable Canvas */}
            <div
              id="wafa-printable-stand-target"
              ref={printAreaRef}
              className={`w-full max-w-sm rounded-3xl p-7 text-center shadow-xl transition-all border ${
                standTheme === 'emerald'
                  ? 'bg-gradient-to-b from-emerald-800 via-emerald-900 to-slate-950 text-white border-emerald-700/40'
                  : standTheme === 'dark'
                  ? 'bg-gradient-to-b from-slate-900 via-slate-950 to-black text-white border-slate-800'
                  : 'bg-white text-slate-900 border-slate-300'
              }`}
            >
              {/* Brand Top Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-2 text-right">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white font-black text-lg border border-white/20">
                    {merchant.businessName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm leading-tight">{merchant.businessName}</h4>
                    <span className="text-[10px] opacity-75">برنامج ولاء العملاء الرقمي</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-[10px] tracking-wider font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    وفاء | WAFA
                  </span>
                </div>
              </div>

              {/* Reward Badge */}
              <div className="my-3 py-2 px-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-[11px] font-semibold opacity-85">مكافأتك بعد {program.targetVisits} {program.unitName}:</div>
                <div className="text-base font-black text-amber-300 mt-0.5 flex items-center justify-center gap-1.5">
                  <Gift className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{program.rewardTitle}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="my-5 flex flex-col items-center">
                <div className="p-3.5 bg-white rounded-3xl shadow-2xl inline-block border-4 border-emerald-400/40">
                  {qrDataUrl ? (
                    <img src={qrDataUrl} alt="QR Code" className="w-48 h-48 rounded-xl object-contain" />
                  ) : (
                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center">
                      <QrIcon className="w-12 h-12 text-slate-400 animate-pulse" />
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[10px] font-mono opacity-60">كود المحل: {merchant.id}</div>
              </div>

              {/* Punchy Customer Instructions */}
              <div className="space-y-2">
                <p className="text-xs font-bold leading-relaxed px-2">
                  {customSlogan}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-[10px]">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold">1</div>
                    <span className="opacity-80">وجّه الكاميرا</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                    <span className="opacity-80">احصل على بطاقتك</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold">3</div>
                    <span className="opacity-80">استلم مكافأتك</span>
                  </div>
                </div>

                <div className="text-[9px] opacity-60 pt-2">
                  * بدون تحميل تطبيق • تعمل مباشرة من متصفح جوالك في ثوانٍ
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

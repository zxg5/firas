import React, { useState } from 'react';
import { Customer, CustomerCard, Merchant, LoyaltyProgram } from '../../types';
import {
  X,
  Share2,
  PlusSquare,
  Smartphone,
  Check,
  Sparkles,
  Gift,
  QrCode,
  Bell,
  MapPin,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

interface AppleWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  card?: CustomerCard;
  merchant?: Merchant;
  program?: LoyaltyProgram;
}

export const AppleWalletModal: React.FC<AppleWalletModalProps> = ({
  isOpen,
  onClose,
  customer,
  card,
  merchant,
  program,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [deviceTab, setDeviceTab] = useState<'ios' | 'android'>('ios');

  if (!isOpen || !merchant || !program) return null;

  const currentVisits = card?.currentVisits || 0;
  const targetVisits = program.targetVisits || 5;
  const progressPercent = Math.min(100, Math.round((currentVisits / targetVisits) * 100));
  const cardUrl = `${window.location.origin}/?phone=${customer.phone}&merchant=${merchant.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `بطاقة ولائي في ${merchant.businessName} عبر منصة وفاء 🚗✨:\nالرصيد: ${currentVisits}/${targetVisits} ${program.unitName}\nالمكافأة: ${program.rewardTitle}\nرابط بطاقتي: ${cardUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">حفظ البطاقة على الجوال ومحفظة Apple</h3>
              <p className="text-[11px] text-slate-500">للوصول السريع لبطاقتك بنقرة واحدة دائماً</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Realistic Apple Wallet Pass Mockup */}
          <div className="relative rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-950 text-white p-5 shadow-xl border border-emerald-700/30 overflow-hidden">
            {/* Top Pass Brand */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                  {merchant.businessName.charAt(0)}
                </div>
                <span className="font-bold text-xs">{merchant.businessName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-600/30">
                <span>وفاء Pass</span>
                <span>•</span>
                <span>{program.unitName}</span>
              </div>
            </div>

            {/* Pass Balance */}
            <div className="my-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-emerald-200">الرصيد المكتمل</div>
                <div className="text-2xl font-black font-mono mt-0.5 text-white">
                  {currentVisits} <span className="text-xs text-emerald-300 font-normal">/ {targetVisits}</span>
                </div>
              </div>
              <div className="text-left">
                <div className="text-[10px] text-emerald-200">المكافأة المستحقة</div>
                <div className="text-xs font-bold text-amber-300 mt-0.5 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" />
                  <span>{program.rewardTitle}</span>
                </div>
              </div>
            </div>

            {/* Visual Mini Progress Bar */}
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-emerald-400 to-amber-300 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Barcode / Pass Footer */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-emerald-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>إشعار تلقائي عند الاقتراب من الفرع</span>
              </div>
              <span className="font-mono">{customer.customerCode}</span>
            </div>
          </div>

          {/* Quick Actions (WhatsApp & Copy) */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>إرسال للواتساب لحفظها</span>
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-all border border-slate-200"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط!' : 'نسخ رابط البطاقة'}</span>
            </button>
          </div>

          {/* Device Instructions: Add to Home Screen (PWA) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">طريقة التثبيت كأيقونة على شاشة الجوال:</span>
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setDeviceTab('ios')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    deviceTab === 'ios' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  iPhone (سفاري)
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceTab('android')}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    deviceTab === 'android' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  أندرويد (كروم)
                </button>
              </div>
            </div>

            {deviceTab === 'ios' ? (
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    اضغط على زر المشاركة <Share2 className="w-3.5 h-3.5 inline mx-1 text-sky-600" /> في متصفح سفاري بالأسفل.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    اختر <strong className="text-slate-900">«إضافة إلى الصفحة الرئيسية»</strong> (Add to Home Screen).
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    ستظهر بطاقتك كأيقونة تطبيق وفاء فوراً على شاشة جهازك دون الحاجة لمتجر التطبيقات!
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <span>اضغط على قائمة الثلاث نقاط في أعلى متصفح Chrome.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    اختر <strong className="text-slate-900">«تثبيت التطبيق»</strong> أو «إضافة إلى الشاشة الرئيسية».
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <span>سيتم حفظ البطاقة كأيقونة فورية تعمل بدون إنترنت وبسرعة فائقة.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useWafa } from '../../context/WafaContext';
import { ShieldCheck, Scale, CheckCircle2, Building, RefreshCw, Lock } from 'lucide-react';
import { LegalTabType } from '../legal/LegalModal';

interface FooterProps {
  onOpenLegal?: (tab?: LegalTabType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  const { setRole } = useWafa();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 text-xs border-t border-slate-800" dir="rtl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Trust & Regulatory Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 mb-10 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-slate-300">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[12px]">منصة سعودية لبرامج الولاء</p>
              <p className="text-[11px] text-slate-400">قيد استكمال إجراءات التوثيق والتسجيل التجاري الرسمي</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[12px]">متوافق مع نظام حماية البيانات (PDPL)</p>
              <p className="text-[11px] text-slate-400">حماية وتشفير بيانات التجار والعملاء</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-white text-[12px]">نظام التجارة الإلكترونية السعودي</p>
              <p className="text-[11px] text-slate-400">حقوق وشفافية كاملة للاشتراكات والخدمات</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                و
              </div>
              <span className="text-base font-bold text-white">وفاء | WAFA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-normal">
              منصة بطاقات ولاء ومكافآت رقمية سعودية للمحلات التجارية والأنشطة، ترفع ولاء العملاء وتزيد تكرار الزيارات بدون تطبيقات.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>س.ت: 1010XXXXXX</span>
              <span>•</span>
              <span>الرقم الضريبي: 310XXXXXXXX0003</span>
            </div>
          </div>

          {/* Business Types */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs">الأنشطة المدعومة</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>مغاسل السيارات (الخرج، الرياض وكافة المدن)</li>
              <li>الشاليهات، الاستراحات والمنتجعات</li>
              <li>صالونات الحلاقة والمشاغل النسائية</li>
              <li>المقاهي، المطاعم والمخابز</li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs">السياسات والأنظمة</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('terms')}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  الشروط والأحكام العامة
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('privacy')}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  سياسة الخصوصية وحماية البيانات (PDPL)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('refund')}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  سياسة الاشتراكات والاسترجاع المالي
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('security')}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer"
                >
                  سياسة أمان حسابات الكاشير
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegal?.('compliance')}
                  className="hover:text-emerald-400 transition-colors text-right cursor-pointer text-emerald-400 font-medium"
                >
                  الامتثال والتراخيص السعودية
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Support Column */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs">الدعم الفني والمبيعات</h4>
            <div className="space-y-2.5 text-slate-400 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">الجوال المباشر:</span>
                <a
                  href="tel:0534067866"
                  dir="ltr"
                  className="font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  0534067866
                </a>
              </div>
              <div>
                <a
                  href="https://wa.me/966534067866"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 text-white font-bold hover:bg-emerald-600 transition-colors text-[11px]"
                >
                  <span>محادثة واتساب مباشرة</span>
                </a>
              </div>
              <p className="text-[11px] text-slate-500">
                فريق خدمة العملاء جاهز لمساعدتكم وتقديم الدعم الفني على مدار الساعة.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} وفاء WAFA. جميع الحقوق محفوظة لرواد الأعمال والمحلات التجارية بالمملكة العربية السعودية 🇸🇦.</p>
          <div className="flex items-center gap-4">
            <span>مدفوعات آمنة: مدى، Apple Pay، فيزا</span>
            <span>•</span>
            <button
              onClick={() => onOpenLegal?.('compliance')}
              className="text-slate-400 hover:text-emerald-400 cursor-pointer"
            >
              شهادة التوثيق
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

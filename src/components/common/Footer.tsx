import React from 'react';
import { useWafa } from '../../context/WafaContext';

export const Footer: React.FC = () => {
  const { setRole } = useWafa();

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 text-xs border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                و
              </div>
              <span className="text-base font-bold text-white">وفاء | WAFA</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-normal">
              منصة بطاقات ولاء رقمية مخصصة للمحلات والأنشطة التجارية في السعودية لتشجيع العملاء على العودة وزيادة المبيعات بدون تطبيقات.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs">الأنشطة</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>مغاسل السيارات (الخرج والرياض)</li>
              <li>الشاليهات والاستراحات</li>
              <li>المشاغل وصالونات الحلاقة</li>
              <li>المطاعم والكافيهات</li>
            </ul>
          </div>

          {/* Roles Quick Access */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs">البوابات</h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className="hover:text-white transition-colors"
                >
                  لوحة العميل
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className="hover:text-white transition-colors"
                >
                  لوحة الموظف (الكاشير)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setRole('merchant')}
                  className="hover:text-white transition-colors"
                >
                  لوحة التاجر
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setRole('super_admin')}
                  className="hover:text-white transition-colors"
                >
                  إدارة المنصة
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} وفاء WAFA. جميع الحقوق محفوظة.</p>
          <p>مصممة للمحلات التجارية ورواد الأعمال في المملكة العربية السعودية.</p>
        </div>
      </div>
    </footer>
  );
};

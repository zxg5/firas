import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import { UserRole } from '../../types';
import { Users, Store, ShieldAlert, Smartphone, Globe, RotateCcw, ChevronDown, Check, Sparkles } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    activeRole,
    setRole,
    merchants,
    activeMerchantId,
    setActiveMerchantId,
    staff,
    activeStaffId,
    setActiveStaffId,
    customers,
    activeCustomerId,
    setActiveCustomerId,
    resetAllData,
  } = useWafa();

  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const rolesList: { role: UserRole; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      role: 'public',
      title: 'واجهة المنصة (الزائر)',
      subtitle: 'الصفحة الرئيسية، الباقات، الأنشطة والحاسبة',
      icon: Globe,
    },
    {
      role: 'customer',
      title: 'لوحة العميل (الجوال)',
      subtitle: 'بطاقة الولاء، الأختام، المكافآت المستحقة',
      icon: Smartphone,
    },
    {
      role: 'staff',
      title: 'لوحة الموظف (الكاشير)',
      subtitle: 'مسح QR، تسجيل الزيارة، تسليم المكافأة',
      icon: Users,
    },
    {
      role: 'merchant',
      title: 'لوحة التاجر (النشاط)',
      subtitle: 'إعداد البطاقة، الموظفين، الفروع، التقارير',
      icon: Store,
    },
    {
      role: 'super_admin',
      title: 'لوحة إدارة منصة وفاء',
      subtitle: 'إدارة التجار، الباقات والأسعار، سجل الرقابة',
      icon: ShieldAlert,
    },
  ];

  const currentRoleInfo = rolesList.find((r) => r.role === activeRole) || rolesList[0];
  const IconComponent = currentRoleInfo.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="mb-2 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-slate-700 shadow-2xl p-3 text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 px-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مبدل الأدوار التجريبي (Sandbox)</span>
            </div>
            <button
              onClick={() => setShowConfirmReset(true)}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800"
              title="إعادة ضبط البيانات إلى الوضع الافتراضي"
            >
              <RotateCcw className="w-3 h-3" />
              إعادة ضبط البيانات
            </button>
          </div>
          <div className="px-2 py-1 bg-slate-800/60 rounded-lg text-[10px] text-slate-400 mt-1 mb-1 border border-slate-800">
            مخصص للاختبار والمراجعة السريعة. في الإنتاج، تُطبق سياسات RLS والمصادقة الصارمة برمز SMS عبر الخادم.
          </div>

          {/* Roles Selector */}
          <div className="mt-2 space-y-1.5">
            {rolesList.map((item) => {
              const ItemIcon = item.icon;
              const isSelected = activeRole === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => {
                    setRole(item.role);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-right p-2.5 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                      : 'hover:bg-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">{item.subtitle}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Context specifics */}
          {activeRole === 'merchant' && (
            <div className="mt-3 pt-2 border-t border-slate-800 px-1">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                اختر المتجر لتجربته:
              </label>
              <select
                value={activeMerchantId}
                onChange={(e) => setActiveMerchantId(e.target.value)}
                className="w-full bg-slate-800 text-xs text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.businessName} ({m.city})
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeRole === 'staff' && (
            <div className="mt-3 pt-2 border-t border-slate-800 px-1">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                اختر الموظف النشط:
              </label>
              <select
                value={activeStaffId}
                onChange={(e) => {
                  const s = staff.find((item) => item.id === e.target.value);
                  if (s) {
                    setActiveStaffId(s.id);
                    setActiveMerchantId(s.merchantId);
                  }
                }}
                className="w-full bg-slate-800 text-xs text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {staff.map((s) => {
                  const m = merchants.find((mch) => mch.id === s.merchantId);
                  return (
                    <option key={s.id} value={s.id}>
                      {s.name} - ({m?.businessName || 'المتجر'})
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {activeRole === 'customer' && (
            <div className="mt-3 pt-2 border-t border-slate-800 px-1">
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                اختر حساب العميل:
              </label>
              <select
                value={activeCustomerId}
                onChange={(e) => setActiveCustomerId(e.target.value)}
                className="w-full bg-slate-800 text-xs text-white rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-emerald-500"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-900/90 text-white border border-slate-700/80 shadow-2xl backdrop-blur-md hover:border-emerald-500/60 transition-all hover:scale-[1.02] cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <IconComponent className="w-3.5 h-3.5" />
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400 leading-none">الأدوار المباشرة</div>
          <div className="text-xs font-bold text-white leading-tight mt-0.5">{currentRoleInfo.title}</div>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Confirm Reset Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-5 text-center shadow-2xl">
            <h3 className="text-base font-bold text-white">إعادة ضبط البيانات التجريبية؟</h3>
            <p className="text-xs text-slate-400 mt-2">
              سيتم استعادة البيانات الأصلية لجميع المتاجر، الزيارات، والمكافآت وإلغاء أي تغييرات أجريتها أثناء التجربة.
            </p>
            <div className="flex gap-2 mt-5">
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setShowConfirmReset(false);
                  setIsOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                تأكيد الإعادة
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

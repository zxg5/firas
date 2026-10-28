import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import { Menu, X, ArrowLeft, LogIn, Store, ShieldAlert } from 'lucide-react';
import { LoginModal } from './LoginModal';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  onOpenRegisterModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegisterModal }) => {
  const { activeRole, setRole, currentMerchant, currentCustomer, currentStaff, session, logout } = useWafa();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'customer' | 'staff' | 'merchant' | 'admin'>('merchant');

  const openLogin = (tab: 'customer' | 'staff' | 'merchant' | 'admin' = 'merchant') => {
    setLoginTab(tab);
    setLoginModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleNavClick = (sectionId: string) => {
    if (activeRole !== 'public') {
      setRole('public');
    }
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-6">
          {/* Logo & Brand */}
          <div
            onClick={() => setRole('public')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
              و
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900">وفاء</span>
              <span className="text-xs font-medium text-slate-400">WAFA</span>
            </div>
          </div>

          {/* Desktop Minimal Nav Links (Only 3 essential links) */}
          {activeRole === 'public' && (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                كيف تعمل
              </button>
              <button
                onClick={() => handleNavClick('industries')}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                الأنشطة
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="hover:text-emerald-700 transition-colors cursor-pointer"
              >
                الأسعار
              </button>
            </nav>
          )}

          {/* Action Buttons & Support */}
          <div className="hidden sm:flex items-center gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton />

            {/* Direct Support Hotline */}
            <a
              href="https://wa.me/966534067866"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              title="تواصل مباشر مع الدعم الفني عبر واتساب"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>الدعم الفني:</span>
              <span dir="ltr" className="font-mono font-black">0534067866</span>
            </a>

            {activeRole === 'public' ? (
              <>
                <button
                  type="button"
                  onClick={() => openLogin('merchant')}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  تسجيل الدخول
                </button>

                <button
                  type="button"
                  onClick={() => openLogin('admin')}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  title="بوابة إدارة المنصة والتحكم المركزي"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>الإدارة</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-700 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
                  {activeRole === 'merchant' && (currentMerchant?.businessName || 'لوحة التاجر')}
                  {activeRole === 'customer' && (currentCustomer?.name || 'لوحة العميل')}
                  {activeRole === 'staff' && (currentStaff?.name ? `كاشير: ${currentStaff.name}` : (session?.name ? `كاشير: ${session.name}` : 'لوحة الكاشير'))}
                  {activeRole === 'super_admin' && 'مدير المنصة (سعود الفيفي)'}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                  title="تسجيل الخروج والعودة للرئيسية"
                >
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-3 shadow-lg">
            {activeRole === 'public' && (
              <div className="flex flex-col gap-1 text-sm font-medium text-slate-700 pb-3 border-b border-slate-100">
                <button
                  onClick={() => handleNavClick('how-it-works')}
                  className="text-right py-2 px-2 hover:bg-slate-50 rounded-lg"
                >
                  كيف تعمل
                </button>
                <button
                  onClick={() => handleNavClick('industries')}
                  className="text-right py-2 px-2 hover:bg-slate-50 rounded-lg"
                >
                  الأنشطة
                </button>
                <button
                  onClick={() => handleNavClick('pricing')}
                  className="text-right py-2 px-2 hover:bg-slate-50 rounded-lg"
                >
                  الأسعار
                </button>
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <PWAInstallButton className="w-full justify-center py-2" />
              <a
                href="https://wa.me/966534067866"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-2"
              >
                <span>الدعم الفني المباشر (واتساب):</span>
                <span dir="ltr" className="font-mono font-black">0534067866</span>
              </a>
              <button
                onClick={() => openLogin('admin')}
                className="w-full py-2.5 rounded-xl bg-purple-700 text-white text-sm font-bold text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>دخول وتسجيل الإدارة</span>
              </button>
              <button
                onClick={() => openLogin('merchant')}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold text-center hover:bg-slate-50"
              >
                تسجيل الدخول
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginTab}
      />
    </>
  );
};

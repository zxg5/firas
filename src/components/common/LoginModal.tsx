import React, { useState, useEffect } from 'react';
import { useWafa } from '../../context/WafaContext';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageCircle,
  Building2,
  Store,
  User,
  Users,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Clock,
} from 'lucide-react';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'customer' | 'staff' | 'merchant' | 'admin';
}

type AuthMode = 'password' | 'email_otp' | 'register';

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'merchant',
}) => {
  const {
    loginWithEmail,
    loginAsCashier,
    sendEmailOtp,
    verifyEmailOtp,
    registerWithEmail,
    supportContact,
    merchants,
  } = useWafa();

  const [activeTab, setActiveTab] = useState<'customer' | 'staff' | 'merchant' | 'admin'>(defaultTab);
  const [authMode, setAuthMode] = useState<AuthMode>('password');

  // Input states - clean production inputs without dummy presets
  const [email, setEmail] = useState('');
  const [cashierUsername, setCashierUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [unconfiguredNotice, setUnconfiguredNotice] = useState<string | null>(null);

  // Registration inputs
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCity, setRegCity] = useState('الخرج');
  const [pendingMerchantInfo, setPendingMerchantInfo] = useState<{
    isPending: boolean;
    name?: string;
    username?: string;
    phone?: string;
  } | null>(null);

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Countdown for OTP
  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // Clean form when active tab changes
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpCode('');
    setUnconfiguredNotice(null);
    if (activeTab === 'staff') {
      setAuthMode('password');
    }
  }, [activeTab]);

  if (!isOpen) return null;

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    // تسجيل دخول الكاشير المستقل باسم المستخدم وكلمة المرور
    if (activeTab === 'staff') {
      if (!cashierUsername.trim()) {
        setErrorMsg('يرجى إدخال اسم مستخدم الكاشير.');
        setIsLoading(false);
        return;
      }
      try {
        const result = await loginAsCashier(cashierUsername, password);
        if (result.success) {
          setSuccessMsg(result.message || 'تم تسجيل دخول الكاشير بنجاح!');
          setTimeout(() => {
            onClose();
          }, 600);
        } else {
          setErrorMsg(result.message || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
        }
      } catch {
        setErrorMsg('تعذر الاتصال بالخادم. يرجى المحاولة مجدداً.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const targetRole: UserRole = activeTab === 'admin' ? 'super_admin' : activeTab;

    try {
      const result = await loginWithEmail(email, password, targetRole);
      if (result.success) {
        setSuccessMsg(result.message || 'تم تسجيل الدخول بنجاح!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        const msg = result.message || 'بيانات الدخول غير صحيحة.';
        if (msg.includes('مراجعة') || msg.includes('موافقة') || msg.includes('الاعتماد')) {
          setPendingMerchantInfo({
            isPending: true,
            username: email,
          });
        }
        setErrorMsg(msg);
      }
    } catch (err: any) {
      setErrorMsg('تعذر الاتصال بالخادم. يرجى المحاولة مجدداً.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Send Email OTP Handler
  const handleSendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('يرجى إدخال البريد الإلكتروني أولاً.');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setUnconfiguredNotice(null);
    setIsLoading(true);

    try {
      const result = await sendEmailOtp(email, 'login');
      if (result.success) {
        setSuccessMsg(result.message || 'تم إرسال رمز التحقق.');
        setCountdown(60);
        if (result.fallbackCode) {
          setUnconfiguredNotice(result.fallbackCode);
          setOtpCode(result.fallbackCode);
        }
      } else {
        setErrorMsg(result.message || 'فشل إرسال رمز التحقق.');
      }
    } catch (err: any) {
      setErrorMsg('تعذر إرسال الرمز.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Verify Email OTP Handler
  const handleVerifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const targetRole: UserRole = activeTab === 'admin' ? 'super_admin' : activeTab;

    try {
      const result = await verifyEmailOtp(email, otpCode, targetRole);
      if (result.success) {
        setSuccessMsg('تم التحقق بنجاح وتأكيد الهوية!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMsg(result.message || 'رمز التحقق غير صحيح.');
      }
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء التحقق.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    if (activeTab === 'merchant' && !regUsername.trim()) {
      setErrorMsg('يرجى تحديد اسم المستخدم (اليوزر) للتاجر.');
      setIsLoading(false);
      return;
    }

    try {
      const targetRole: UserRole = activeTab === 'admin' ? 'super_admin' : (activeTab === 'merchant' ? 'merchant' : 'customer');
      const result = await registerWithEmail({
        email,
        username: regUsername.trim().toLowerCase(),
        password,
        name: regName || (activeTab === 'merchant' ? regBusinessName : (activeTab === 'admin' ? 'مسؤول إدارة المنصة' : 'مستخدم وفاء')),
        phone: regPhone,
        role: targetRole,
        businessName: regBusinessName,
        city: regCity,
      });

      if (result.success) {
        if (activeTab === 'merchant' || (result as any).pending) {
          setPendingMerchantInfo({
            isPending: true,
            name: regBusinessName || regName,
            username: regUsername || email,
            phone: regPhone,
          });
          setSuccessMsg(result.message || 'تم تقديم طلب تسجيل المنشأة بنجاح! حسابكم بانتظار موافقة واعتماد إدارة المنصة.');
        } else {
          setSuccessMsg('تم إنشاء الحساب بنجاح! تم تسجيل دخولك تلقائياً.');
          setTimeout(() => {
            onClose();
          }, 700);
        }
      } else {
        setErrorMsg(result.message || 'فشل إنشاء الحساب.');
      }
    } catch (err) {
      setErrorMsg('حدث خطأ أثناء إنشاء الحساب.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden text-slate-900 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm">
              و
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>دخول آمن بالبريد وكلمة المرور</span>
              </div>
              <h3 className="text-base font-black text-slate-900">منصة WAFA | وفاء</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Roles Tabs */}
        <div className="grid grid-cols-4 p-1.5 bg-slate-100/90 border-b border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('merchant')}
            className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'merchant'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span>التاجر</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'staff'
                ? 'bg-white text-blue-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>الكاشير</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'customer'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 shrink-0" />
            <span>العميل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-1 rounded-xl text-center font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 ${
              activeTab === 'admin'
                ? 'bg-white text-purple-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>المنصة</span>
          </button>
        </div>

        {/* Security & Multi-Tenancy Banner */}
        <div className="px-6 py-2 bg-emerald-50/70 border-b border-emerald-100/60 flex items-center justify-between text-[11px] text-emerald-900">
          <div className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>
              {activeTab === 'merchant' && 'بيانات كل متجر وعملائه معزولة بالكامل ومحمية في الخادم'}
              {activeTab === 'staff' && 'صلاحيات الموظف مقتصرة حصرياً على الفرع والنشاط التابع له'}
              {activeTab === 'customer' && 'بياناتك ونقاط ولائك خاصة ومحمية بحسابك الشخصي'}
              {activeTab === 'admin' && 'لوحة التحكم المركزية محصورة حصرياً بالبريد المعتمد'}
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-800 shrink-0">
            RBAC + Server Isolation
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Alerts */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div className="leading-relaxed font-semibold">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <div className="leading-relaxed font-semibold">{successMsg}</div>
            </div>
          )}

          {/* Real Authentication Header Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-800">تسجيل الدخول بالبيانات الرسمية المعتمدة</span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold border border-emerald-200">
              نظام محمي ومعزول
            </span>
          </div>

          {/* Form 1: Password Login (Default) */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-3.5">
              {activeTab === 'staff' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      اسم مستخدم الكاشير
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      بدون حاجة لبريد إلكتروني
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={cashierUsername}
                      onChange={(e) => setCashierUsername(e.target.value)}
                      required
                      placeholder="اسم المستخدم المحدد من قِبل التاجر (مثال: cashier_wash)"
                      dir="ltr"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    يتم تزويدك باسم المستخدم وكلمة المرور مباشرة بواسطة التاجر صاحب المنشأة.
                  </span>
                </div>
              ) : activeTab === 'merchant' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      اسم المستخدم (اليوزر) أو البريد الإلكتروني
                    </label>
                    <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      دخول فوري مباشر
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="اليوزر (مثال: kharj_wash) أو البريد"
                      dir="ltr"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                    />
                    <Store className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <span className="text-[10px] text-emerald-800 mt-1 block font-medium">
                    ⚡ للتاجر المسجل مسبقاً: دخول فوري باسم المستخدم وكلمة المرور دون طلب اسم المنشأة أو انتظار الموافقة.
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@business.sa"
                      dir="ltr"
                      className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">كلمة المرور</label>
                  {activeTab === 'staff' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('في حال نسيان كلمة المرور، يرجى مراجعة التاجر صاحب المنشأة ليقوم بتحديثها فوراً من تبويب (فريق العمل والكاشير) في لوحة تحكمه.');
                      }}
                      className="text-[11px] font-semibold text-blue-700 hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('email_otp');
                        setErrorMsg('');
                        setSuccessMsg('');
                      }}
                      className="text-[11px] font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      نسيت كلمة المرور؟ إرسال رمز للإيميل
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 absolute left-1.5 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                  activeTab === 'staff'
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جاري التحقق من الهوية...</span>
                  </>
                ) : (
                  <>
                    <span>تسجيل الدخول</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {activeTab === 'staff' ? (
                <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
                  <div className="text-[11px] text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed font-medium">
                    🔒 <strong>تنبيه أمني:</strong> لا يوجد تسجيل ذاتي لحسابات الكاشير. يتم إنشاء الحساب ومنح الصلاحيات حصرياً بواسطة التاجر صاحب المنشأة من لوحة تحكمه.
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('email_otp');
                      setErrorMsg('');
                    }}
                    className="hover:text-emerald-700 font-semibold cursor-pointer"
                  >
                    دخول عبر رمز تحقق الإيميل (Email OTP)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register');
                      setErrorMsg('');
                    }}
                    className={`font-bold hover:underline cursor-pointer ${
                      activeTab === 'admin' ? 'text-purple-700' : 'text-emerald-700'
                    }`}
                  >
                    {activeTab === 'admin' ? 'تسجيل مسؤول إدارة جديد' : 'إنشاء حساب جديد'}
                  </button>
                </div>
              )}
            </form>
          )}

          {/* Form 2: Email OTP Login / Verification */}
          {authMode === 'email_otp' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 leading-relaxed">
                يتم إرسال رمز تحقق صالح لمرة واحدة (6 أرقام) إلى بريدك الإلكتروني لتأكيد هويتك دون الحاجة لكلمة المرور.
              </div>

              <form onSubmit={handleSendEmailOtp} className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  البريد الإلكتروني لاستلام رمز التحقق
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="name@business.sa"
                      dir="ltr"
                      className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all font-mono"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || countdown > 0}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {countdown > 0 ? `${countdown} ثانية` : 'إرسال الرمز'}
                  </button>
                </div>
              </form>

              {/* تنبيه توضيحي شفاف في حال عدم ربط مزود بريد معتمد على الخادم */}
              {unconfiguredNotice && (
                <div className="p-3.5 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>توضيح تقني: لماذا لم تصل الرسالة إلى بريدك في Gmail؟</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    خوادم Google تتطلب ربط مزوّد بريد معتمد (مثل كلمة مرور تطبيقات Gmail أو مفتاح Resend) لاستلام الإيميلات في صندوق الوارد الفعلي، وحتى لا تُحظر الرسائل أمنياً.
                  </p>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-amber-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-700">رمز التحقق لتسجيل دخولك الآن:</span>
                    <span className="font-mono font-black text-sm text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                      {unconfiguredNotice}
                    </span>
                  </div>
                </div>
              )}

              <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رمز التحقق المرسل (6 أرقام)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    placeholder="123456"
                    dir="ltr"
                    className="w-full py-2.5 text-center text-xl font-mono tracking-widest rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !otpCode}
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز والدخول'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('password');
                    setErrorMsg('');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  ← العودة لتسجيل الدخول بكلمة المرور
                </button>
              </div>
            </div>
          )}

          {/* Pending Approval Screen for Merchant */}
          {pendingMerchantInfo?.isPending ? (
            <div className="space-y-4 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-right animate-in fade-in">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>

              <div className="text-center space-y-1">
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-3 py-1 rounded-full border border-amber-200 inline-block">
                  حساب بانتظار الاعتماد والموافقة الرسمية
                </span>
                <h4 className="text-base font-black text-slate-950">
                  طلب تسجيل المنشأة قيد المراجعة
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                  تم استلام طلبك بنجاح. بحسب معايير منصة وفاء، لا يقبل حساب التاجر الدخول لأول مرة إلا بعد تدقيق واعتماد إدارة المنصة.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-amber-200/80 text-xs space-y-2 text-slate-700 shadow-2xs">
                {pendingMerchantInfo.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">اسم المنشأة:</span>
                    <span className="font-bold text-slate-900">{pendingMerchantInfo.name}</span>
                  </div>
                )}
                {pendingMerchantInfo.username && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">اسم المستخدم (اليوزر):</span>
                    <span className="font-mono font-bold text-emerald-800" dir="ltr">@{pendingMerchantInfo.username}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-slate-500">حالة الطلب:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                    ⏳ قيد مراجعة الإدارة
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>للتفعيل الفوري والاستعجال:</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  تواصل مباشرة مع مسؤول اعتماد التجار في إدارة منصة وفاء لإتمام التفعيل خلال دقائق:
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <a
                    href={`https://wa.me/966534067866?text=${encodeURIComponent(
                      `السلام عليكم، قمت بطلب تسجيل متجر جديد في منصة وفاء (${pendingMerchantInfo.name || ''}) باسم مستخدم (@${pendingMerchantInfo.username || ''}) وأرغب في الاعتماد والتفعيل.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة واتساب للاعتماد الفوري</span>
                  </a>
                  <a
                    href={`tel:${supportContact.phone}`}
                    dir="ltr"
                    className="py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 transition-all font-mono"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{supportContact.phone}</span>
                  </a>
                </div>
              </div>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPendingMerchantInfo(null);
                    setAuthMode('password');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  ← العودة لتسجيل الدخول بحساب معتمد
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Form 3: Register New Account */}
              {authMode === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3">
                  <div className={`p-3 border rounded-2xl text-xs leading-relaxed font-medium ${
                    activeTab === 'admin'
                      ? 'bg-purple-50 border-purple-200 text-purple-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    {activeTab === 'admin' ? (
                      <div>
                        <div className="font-bold text-purple-950 flex items-center gap-1.5 mb-0.5">
                          <ShieldAlert className="w-4 h-4 text-purple-700 shrink-0" />
                          <span>تسجيل مسؤول جديد في إدارة المنصة (سوبر أدمن)</span>
                        </div>
                        <p className="text-[11px] text-purple-800">
                          يتم إنشاء الحساب الإداري مع منحه كامل الصلاحيات لإدارة التجار، الباقات، الفروع، والتقارير الرقابية.
                        </p>
                      </div>
                    ) : activeTab === 'merchant' ? (
                      <div>
                        <div className="font-bold text-emerald-950 flex items-center gap-1.5 mb-0.5">
                          <Building2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>تسجيل تاجر جديد لأول مرة بالخدمة</span>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          يرجى تسجيل إيميل ويوزر وباسوورد للمنشأة. يتم إرسال الطلب لإدارة المنصة ولا يقبل الدخول إلا بعد الموافقة والاعتماد.
                        </p>
                      </div>
                    ) : (
                      <span>إنشاء حساب عميل جديد للاستفادة من بطاقات الولاء والمكافآت</span>
                    )}
                  </div>

                  {activeTab === 'merchant' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          اسم النشاط أو المتجر *
                        </label>
                        <input
                          type="text"
                          value={regBusinessName}
                          onChange={(e) => setRegBusinessName(e.target.value)}
                          required
                          placeholder="مثال: مغسلة النخبة، مقهى أروق..."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-xs font-bold text-slate-700">
                              اسم المستخدم (اليوزر) *
                            </label>
                            <span className="text-[10px] text-emerald-700 font-mono font-bold">
                              فريد للدخول
                            </span>
                          </div>
                          <input
                            type="text"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            required
                            placeholder="kharj_wash"
                            dir="ltr"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">المدينة *</label>
                          <select
                            value={regCity}
                            onChange={(e) => setRegCity(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-white"
                          >
                            <option value="الخرج">الخرج</option>
                            <option value="الرياض">الرياض</option>
                            <option value="الدلم">الدلم</option>
                            <option value="الدمام">الدمام</option>
                            <option value="جدة">جدة</option>
                            <option value="القصيم">القصيم</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          البريد الإلكتروني للتاجر *
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="owner@store.sa"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          رقم جوال التواصل *
                        </label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          required
                          placeholder="055XXXXXXX"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          كلمة المرور للدخول *
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </>
                  ) : activeTab === 'admin' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">اسم المسؤول الإداري *</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          placeholder="مثال: سعود بن فهد الفيفي"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني للإدارة *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="admin@wafa.sa أو personal@gmail.com"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال *</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          required
                          placeholder="0534067866"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">كلمة مرور الإدارة *</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-purple-600"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل *</label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          required
                          placeholder="محمد بن عبدالعزيز"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="user@example.sa"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم الجوال (اختياري)</label>
                        <input
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          placeholder="0551234567"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور *</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          dir="ltr"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-sm text-white active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                      activeTab === 'admin'
                        ? 'bg-purple-700 hover:bg-purple-800'
                        : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    {isLoading ? (
                      <span>جاري المعالجة...</span>
                    ) : activeTab === 'merchant' ? (
                      <span>إرسال طلب تسجيل المنشأة للاعتماد والموافقة</span>
                    ) : activeTab === 'admin' ? (
                      <span>إنشاء حساب الإدارة وتفعيله بجميع الصلاحيات</span>
                    ) : (
                      <span>إنشاء الحساب وبدء الاستخدام</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('password');
                        setErrorMsg('');
                      }}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                    >
                      لديك حساب معتمد بالفعل؟ تسجيل الدخول الفوري
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

          {/* Technical Support Direct Contact Section */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>الدعم الفني المباشر:</span>
              <a
                href={`tel:${supportContact.phone}`}
                dir="ltr"
                className="font-mono font-bold text-slate-900 hover:text-emerald-700"
              >
                {supportContact.phone}
              </a>
            </div>
            <a
              href={supportContact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shrink-0"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>محادثة واتساب</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

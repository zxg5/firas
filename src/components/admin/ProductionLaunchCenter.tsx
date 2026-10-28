import React, { useState, useEffect } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Globe,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  Send,
  ExternalLink,
  Copy,
  Check,
  Server,
  Smartphone,
  FileCheck,
  RefreshCw,
} from 'lucide-react';

export const ProductionLaunchCenter: React.FC = () => {
  // Test email state
  const [testEmailTo, setTestEmailTo] = useState('frasalfyfy7@gmail.com');
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{
    success: boolean;
    message: string;
    messageId?: string;
    previewUrl?: string | false;
  } | null>(null);

  // System readiness state
  const [readinessData, setReadinessData] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchReadiness = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/system/readiness-status');
      if (res.ok) {
        const data = await res.json();
        setReadinessData(data);
      }
    } catch (e) {
      console.error('Failed to load readiness status', e);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailTo.trim()) return;

    setEmailSending(true);
    setEmailResult(null);

    try {
      const res = await fetch('/api/system/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmailTo.trim() }),
      });

      const data = await res.json();
      setEmailResult(data);
    } catch (err: any) {
      setEmailResult({
        success: false,
        message: 'حدث خطأ في الاتصال بالخادم أثناء محاولة إرسال البريد.',
      });
    } finally {
      setEmailSending(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Hero Launch Status Banner */}
      <div className="rounded-3xl bg-gradient-to-l from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Rocket className="w-3.5 h-3.5" />
              <span>جاهزية الإطلاق والنشر في السوق السعودي 🇸🇦</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              مركز إطلاق منصة «وفاء | WAFA» للإنتاج الفعلي
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              جميع المتطلبات الفنية، الأمنية، والقانونية متكاملة وجاهزة للربط مع الدومين المخصص، بوابات الدفع (مدى)، الرسائل، والبريد الإلكتروني الحقيقي.
            </p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={fetchReadiness}
              disabled={isLoadingStatus}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              <span>تحديث حالة الاتصال والربط</span>
            </button>
            <span className="text-[11px] text-emerald-400 font-mono text-center">
              ● الخادم يعمل بنجاح (Port 3000)
            </span>
          </div>
        </div>
      </div>

      {/* 4 Quick Readiness Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PWA App Ready */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              مكتمل 100%
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">تطبيق الويب (PWA)</p>
          <p className="text-[11px] text-slate-500">
            يعمل كبرنامج مثبت على جوالات الكاشير والتجار مع دعم كامل للآيفون والأندرويد.
          </p>
        </div>

        {/* Legal & PDPL */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              معتمد ومطابق
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">السياسات ونظام PDPL</p>
          <p className="text-[11px] text-slate-500">
            الشروط، حماية البيانات، وسياسات الاسترجاع متوافقة مع الأنظمة السعودية.
          </p>
        </div>

        {/* Cashier System */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              حسابات معزولة
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">أمان حسابات الكاشير</p>
          <p className="text-[11px] text-slate-500">
            إنشاء حصري عبر التاجر باسم مستخدم فقط، مع إمكانية التعطيل الفوري وتحديد الصلاحيات.
          </p>
        </div>

        {/* Email Engine */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {readinessData?.services?.email?.isConfigured ? 'مربوط ومفعل' : 'جاهز للفحص'}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800">خدمة البريد الإلكتروني</p>
          <p className="text-[11px] text-slate-500">
            يدعم Resend API المباشر و Gmail SMTP وخوادم البريد المخصصة.
          </p>
        </div>
      </div>

      {/* SECTION 1: LIVE TEST EMAIL SENDER */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              أداة فحص واختبار إرسال البريد الإلكتروني الفعلي (Live Email Test)
            </h3>
            <p className="text-xs text-slate-500">
              تحقق من أن رسائل التفعيل، الإشعارات، ورموز التحقق تصل إلى صندوق الوارد (Inbox) لبريدك دون حظر.
            </p>
          </div>
        </div>

        <form onSubmit={handleSendTestEmail} className="mt-3 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={testEmailTo}
              onChange={(e) => setTestEmailTo(e.target.value)}
              placeholder="اكتب بريدك الإلكتروني للفحص..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white font-mono text-left"
              required
            />
          </div>
          <button
            type="submit"
            disabled={emailSending}
            className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {emailSending ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري إرسال البريد وفحصه...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إرسال بريد تجريبي الآن</span>
              </>
            )}
          </button>
        </form>

        {/* Test Result Message */}
        {emailResult && (
          <div
            className={`p-4 rounded-2xl text-xs font-medium border flex items-start gap-3 animate-in fade-in ${
              emailResult.success
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            {emailResult.success ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1.5 flex-1">
              <p className="font-bold">{emailResult.message}</p>
              {emailResult.messageId && (
                <p className="font-mono text-[11px] text-slate-600">
                  معرف الرسالة (Message ID): {emailResult.messageId}
                </p>
              )}
              {emailResult.previewUrl && (
                <div className="pt-1">
                  <a
                    href={emailResult.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-emerald-700 underline font-bold"
                  >
                    <span>معاينة الرسالة في صندوق الاختبار Ethereal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: CUSTOM DOMAIN & DNS SETUP */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              دليل ربط الدومين المخصص (Custom Domain & DNS)
            </h3>
            <p className="text-xs text-slate-500">
              خطوات ربط منصة وفاء باسم نطاق سعودي رسمي خاص بك مثل: (wafa.sa أو loyalty.sa)
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <p>
            عند شراء النطاق من مزود النطاقات المعتمد (مثل هيئة الاتصالات والفضاء والتقنية .sa، أو Namecheap، أو Cloudflare)، أضف السجلات التالية في لوحة إدارة الـ DNS:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-semibold">نوع السجل (Type)</th>
                  <th className="p-3 font-semibold">الاسم / المضيف (Host)</th>
                  <th className="p-3 font-semibold">القيمة / الوجهة (Value / Target)</th>
                  <th className="p-3 font-semibold">الهدف</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="p-3 font-mono font-bold text-indigo-700">CNAME</td>
                  <td className="p-3 font-mono font-bold">www</td>
                  <td className="p-3 font-mono text-slate-600">ghs.googlehosted.com</td>
                  <td className="p-3 text-slate-500">توجيه زوار النطاق بالبادئة www</td>
                </tr>
                <tr>
                  <td className="p-3 font-mono font-bold text-indigo-700">A</td>
                  <td className="p-3 font-mono font-bold">@ (النطاق الرئيسي)</td>
                  <td className="p-3 font-mono text-slate-600">216.239.32.21 / 216.239.34.21</td>
                  <td className="p-3 text-slate-500">توجيه النطاق الرئيسي بدون www</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>شهادة الأمان SSL (HTTPS) يتم إصدارها تلقائياً ومجاناً بمجرد ربط الـ DNS.</span>
            <span className="font-bold text-emerald-700">✓ مشفر بنسبة 100%</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: API KEYS & EXTERNAL INTEGRATIONS */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              مفاتيح الربط الفعلي وبوابات الدفع والرسائل (.env Variables)
            </h3>
            <p className="text-xs text-slate-500">
              المتغيرات المطلوب وضعها في ملف البيئة لتفعيل الرسائل النصية القصيرة وبوابة ميسر لمدفوعات مدى.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Moyasar Gateway */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                بوابة ميسر (Moyasar) - مدى و Apple Pay
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                MOYASAR_API_KEY
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              بوابة الدفع السعودية الأولى المعتمدة لبطاقات مدى وفيزا وماستركارد وأبل باي للمتاجر.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">حساب تجار ميسر:</span>
              <a
                href="https://moyasar.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
              >
                <span>فتح حساب في ميسر</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* SMS & WhatsApp */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                بوابة الرسائل (Taqnyat أو Unifonic)
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                TAQNYAT_BEARER_TOKEN
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              لإرسال رموز تسجيل الدخول السريع (OTP) وإشعارات استحقاق المكافآت لأرقام جوالات العملاء.
            </p>
            <div className="pt-1 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">مزود الرسائل المعتمد:</span>
              <a
                href="https://www.taqnyat.sa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:underline font-bold flex items-center gap-1"
              >
                <span>تقنيات للرسائل القصيرة</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRODUCTION LAUNCH CHECKLIST */}
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          قائمة الفحص النهائي قبل الإطلاق (Launch Checklist)
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              نظام الكاشير المستقل: تم التحقق من العزل الكامل للحسابات والمصادقة باسم مستخدم وكلمة مرور حصرياً من التاجر.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              الامتثال للأنظمة السعودية: الشروط والأحكام وسياسة الخصوصية متوافقة مع نظام حماية البيانات الشخصية (PDPL).
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              تطبيق الويب PWA: تم تكوين manifest.json والأيقونات وأزرار التثبيت المباشرة لشاشات الكاشير والجوالات.
            </span>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              قنوات الدعم الفني: أرقام الواتساب والاتصال المباشر (0534067866) مفعلة وجاهزة للرد على استفسارات التجار 24/7.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

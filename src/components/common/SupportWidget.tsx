import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Headphones,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Mail,
  User,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cashier' | 'subscription' | 'customer'>('all');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ id: string; message: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const supportPhone = '0534067866';
  const supportWhatsapp = 'https://wa.me/966534067866?text=' + encodeURIComponent('السلام عليكم، أحتاج مساعدة أو دعم فني بخصوص منصة وفاء');

  const categoryLabels: Record<string, string> = {
    all: 'استفسار عام',
    cashier: 'مشكلة فنية في الكاشير / مسح QR',
    subscription: 'الاشتراكات وتفعيل المتاجر',
    customer: 'استفسار عميل / مكافآت',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/support/send-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || supportPhone,
          category: categoryLabels[activeCategory] || 'عام',
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessTicket({
          id: data.ticketId || `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
          message: data.message || 'تم إرسال تذكرتك بنجاح، ووصلتك رسالة تأكيد على بريدك الإلكتروني.',
        });
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        setErrorMessage(data.message || 'تعذر إرسال التذكرة. يرجى الاتصال بنا مباشرة على 0534067866.');
      }
    } catch (err: any) {
      setErrorMessage('تعذر الاتصال بالخادم. يرجى التواصل هاتفياً على 0534067866 أو عبر واتساب.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Support Button */}
      <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            setSuccessTicket(null);
            setErrorMessage('');
          }}
          className="group relative flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 active:scale-95 border border-emerald-400/30 cursor-pointer"
          aria-label="التواصل مع الدعم الفني"
        >
          {/* Pulsing online badge */}
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>

          <Headphones className="w-5 h-5 transition-transform group-hover:scale-110" />

          <div className="text-right">
            <div className="text-xs font-black tracking-tight leading-none">الدعم الفني</div>
            <div className="text-[10px] text-emerald-100 font-mono font-bold leading-tight mt-0.5" dir="ltr">
              0534067866
            </div>
          </div>
        </button>
      </div>

      {/* Support Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full sm:w-[440px] max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in slide-in-from-bottom-6 sm:slide-in-from-left-6 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                    <span>فريق الدعم الفني متصل الآن</span>
                  </div>
                  <h3 className="text-sm font-black text-white">منصة WAFA | خدمة العملاء</h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Quick Direct Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Direct Phone Call */}
                <a
                  href={`tel:${supportPhone}`}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-all text-center group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform shadow-xs">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">اتصال مباشر</div>
                  <div className="text-[11px] font-mono font-bold text-emerald-700 mt-0.5" dir="ltr">
                    {supportPhone}
                  </div>
                </a>

                {/* 2. Direct WhatsApp */}
                <a
                  href={supportWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all text-center group cursor-pointer shadow-xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold">محادثة واتساب</div>
                  <div className="text-[10px] text-emerald-100 mt-0.5">رد فوري ومباشر</div>
                </a>
              </div>

              {/* Service SLA Info */}
              <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>ساعات الخدمة: 24/7 طوال الأسبوع</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>دعم رسمي معتمد</span>
                </div>
              </div>

              {/* Success Message Banner */}
              {successTicket && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>تم استلام طلبك بنجاح!</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{successTicket.message}</p>
                  <div className="p-2 rounded-xl bg-white border border-emerald-200 font-mono text-center font-bold text-emerald-800 text-xs">
                    رقم التذكرة: {successTicket.id}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSuccessTicket(null)}
                    className="w-full py-1.5 text-center text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                  >
                    إرسال استفسار آخر
                  </button>
                </div>
              )}

              {/* Error Message Banner */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed font-semibold">{errorMessage}</div>
                </div>
              )}

              {/* Support Ticket Submission Form */}
              {!successTicket && (
                <form onSubmit={handleSubmit} className="space-y-3 pt-1 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>إرسال استفسار أو طلب دعم فني:</span>
                    </label>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setActiveCategory('all')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        activeCategory === 'all'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      عام
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('cashier')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        activeCategory === 'cashier'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      الكاشير والـ QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('subscription')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        activeCategory === 'subscription'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      الاشتراكات
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('customer')}
                      className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-medium ${
                        activeCategory === 'customer'
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      العملاء
                    </button>
                  </div>

                  {/* Name Input */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="اسمك الكريم"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Contact Inputs */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="البريد الإلكتروني"
                        dir="ltr"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0534067866"
                        dir="ltr"
                        className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Message Input */}
                  <div>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      placeholder="صف استفسارك أو المشكلة الفنية بالتفصيل ليقوم الدعم بحلها..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 resize-none leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !email || !message}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري إرسال التذكرة...</span>
                      </>
                    ) : (
                      <>
                        <span>إرسال التذكرة لفريق الدعم</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Bottom Assurance */}
              <div className="text-center text-[10px] text-slate-400 pt-1">
                منصة وفاء • مسجلة ومعتمدة لخدمة المنشآت في المملكة العربية السعودية
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

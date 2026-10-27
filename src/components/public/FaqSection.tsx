import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Smartphone, Sparkles, Store } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'merchant' | 'customer' | 'security';
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'هل يحتاج متجري لشراء أجهزة كاشير جديدة أو تابلت مخصص؟',
      answer:
        'أبداً! منصة وفاء مصممة لتعمل بسلاسة وخفة على أي جهاز يتوفر لديك حالياً: جوال المحاسب الشخصي، شاشة الكاشير الموجودة، أو أي تابلت عادي متصل بالإنترنت دون أي تكاليف عتاد إضافية.',
      category: 'merchant',
    },
    {
      question: 'هل يلزم زبائن المحل تحميل تطبيق ثقيل من App Store أو Google Play؟',
      answer:
        'لا، وهذا هو سر نجاح المنصة. يفتح العميل بطاقة ولائه فوراً بمجرد مسح كود QR الكاشير بكاميرا جواله العادية، وتفتح في أجزاء من الثانية. كما يمكنه حفظها بنقرة واحدة كأيقونة على الشاشة الرئيسية أو في Apple Wallet.',
      category: 'customer',
    },
    {
      question: 'كيف تحميني وفاء من تلاعب العمال وسرقة الأختام أو تسجيل زيارات وهمية؟',
      answer:
        'نظام وفاء مزود بحماية خوارزمية ذكية تتضمن: نظام "فترة التهدئة الزمنية (Cooldown)" يمنع تسجيل أكثر من زيارة لنفس العميل في وقت قصير، ونظام توثيق العمليات بحساب كل موظف (PIN)، بالإضافة لأكواد استرداد رقمية للمكافآت لمرة واحدة فقط.',
      category: 'security',
    },
    {
      question: 'ما هي الأنشطة التجارية التي تستفيد من بطاقات وفاء؟',
      answer:
        'تدعم وفاء جميع الأنشطة القائمة على الزيارات المتكررة: مغاسل السيارات (تسجيل باللوحة)، المشاغل وصالونات الحلاقة (حسب الخدمة)، الشاليهات والاستراحات (برقم الحجز)، والمقاهي والمطاعم (برقم الفاتورة أو الجوال)، مع تخصيص تلقائي لشروط كل نشاط.',
      category: 'merchant',
    },
    {
      question: 'كم يستغرق إطلاق وتجهيز منصة وفاء داخل محلي التجاري؟',
      answer:
        'أقل من 3 دقائق! بعد تسجيل حساب التاجر، تحدد عدد الزيارات المطلوبة ومكافأتك، ثم تطبع "ستاند الكاشير الجاهز" وتضعه على طاولة المحاسب، ويبدأ عملاؤك بالانضمام فوراً.',
      category: 'merchant',
    },
    {
      question: 'هل يمكنني تجربة المنصة مجاناً قبل الالتزام بأي اشتراك؟',
      answer:
        'نعم، توفر وفاء فترة تجريبية مجانية كاملة لجميع الأنشطة لتجربة المنصة مع عملائك وموظفيك وقياس أثر زيادة عودة الزبائن قبل دفع أي اشتراك.',
      category: 'merchant',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>إجابات واضحة لجميع تساؤلاتك</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            الأسئلة الشائعة حول منصة وفاء
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            كل ما يهمك معرفته كتاجر أو عميل حول آلية العمل، الأمان، والتجربة
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-right p-5 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-emerald-600 text-white rotate-180'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-emerald-100/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

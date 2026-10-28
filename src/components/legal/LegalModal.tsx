import React, { useState } from 'react';
import { X, ShieldCheck, FileText, RefreshCw, Lock, Building, CheckCircle, Scale, AlertCircle, Clock } from 'lucide-react';

export type LegalTabType = 'privacy' | 'terms' | 'refund' | 'security' | 'compliance';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: LegalTabType;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTabType>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden text-right"
        dir="rtl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                الوثائق القانونية وسياسات الاستخدام لمنصة وفاء (WAFA)
              </h2>
              <p className="text-xs text-slate-500">
                متوافقة مع نظام التجارة الإلكترونية ونظام حماية البيانات الشخصية (PDPL) في المملكة العربية السعودية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-2 bg-slate-100/80 border-b border-slate-200/80 overflow-x-auto text-xs font-medium no-scrollbar">
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white text-emerald-800 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            الشروط والأحكام العامة
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white text-emerald-800 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            سياسة الخصوصية (PDPL)
          </button>

          <button
            onClick={() => setActiveTab('refund')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'refund'
                ? 'bg-white text-emerald-800 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            الاشتراكات والاسترجاع
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'security'
                ? 'bg-white text-emerald-800 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Lock className="w-4 h-4 text-emerald-600" />
            أمان الكاشير والبيانات
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'compliance'
                ? 'bg-white text-emerald-800 font-bold shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Building className="w-4 h-4 text-emerald-600" />
            الامتثال والتراخيص السعودية
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          
          {/* TAB 1: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-emerald-900 space-y-1">
                  <p className="font-bold">اتفاقية استخدام منصة وفاء (WAFA) للولاء الرقمي</p>
                  <p className="text-emerald-800/90 leading-relaxed">
                    تحكم هذه الاتفاقية استخدام كافة خدمات منصة وفاء، والمقدمة للتجار والمحلات التجارية والمستهلكين داخل المملكة العربية السعودية، وفقًا للأنظمة واللوائح السارية.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  1. طبيعة الخدمة والمنصة
                </h3>
                <p>
                  منصة «وفاء» هي منصة برمجيات كخدمة (SaaS) سحابية تُمكن المنشآت والمحلات والأنشطة التجارية (مغاسل السيارات، الشاليهات، صالونات الحلاقة والمشاغل، المطاعم والمقاهي وغيرها) من إنشاء وإدارة بطاقات ولاء رقمية مخصصة، وتسجيل زيارات العملاء، وصرف المكافآت الترويجية بسهولة وأمان عبر المتصفح دون الحاجة لتحميل تطبيقات ثقيلة.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  2. شروط أهلية حساب التاجر
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm pr-2">
                  <li>أن يكون لدى المنشأة سجل تجاري سارٍ أو وثيقة عمل حر معتمدة صادرة من وزارة الموارد البشرية والتنمية الاجتماعية بالمملكة العربية السعودية.</li>
                  <li>أن يقدم التاجر بيانات صحيحة ومحدثة تشمل الاسم التجاري، رقم الجوال، العنوان الوطني، والبريد الإلكتروني المعتمد.</li>
                  <li>يتحمل التاجر كامل المسؤولية النظامية عن دقة العروض والمكافآت الترويجية التي يُنشئها لعملائه والوفاء بها.</li>
                  <li>يُمنع استخدام المنصة في أي نشاط يخالف الشريعة الإسلامية أو الأنظمة المعمول بها داخل المملكة العربية السعودية.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  3. شروط استخدام العملاء (حاملي بطاقات الولاء)
                </h3>
                <p>
                  يتم إصدار بطاقة الولاء الرقمية للعميل برقم جواله، وتكون المكافآت والزيارات خاصة بالعميل شخصياً ولا يحق له التنازل عنها بمقابل نقدي إلا بموافقة التاجر الصريحة. تنتهي صلاحية المكافآت أو شروط استبدالها وفقاً لسياسة كل متجر معلن عنها داخل بطاقته الرقمية.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  4. الملكية الفكرية وحقوق العلامة التجارية
                </h3>
                <p>
                  تعد جميع البرمجيات، الواجهات، التصاميم، والشعارات الخاصة بـ «وفاء» أو «WAFA» ملكية حصرية للمنصة ومحمية بموجب نظام حماية حقوق المؤلف ونظام العلامات التجارية السعودي. لا يجوز نسخ أو هندسة عكسية لأي كود أو جزء من المنصة.
                </p>
              </section>
            </div>
          )}

          {/* TAB 2: PRIVACY POLICY (PDPL) */}
          {activeTab === 'privacy' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-blue-900 space-y-1">
                  <p className="font-bold">الامتثال لنظام حماية البيانات الشخصية السعودي (PDPL)</p>
                  <p className="text-blue-800/90 leading-relaxed">
                    تلتزم منصة وفاء بحماية خصوصية كافة المستخدمين والامتثال الكامل للمرسوم الملكي رقم (م/19) وتعديلاته بالمرسوم الملكي رقم (م/148) ولوائحه التنفيذية الصادرة عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا).
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  1. ما هي البيانات التي نجمعها؟
                </h3>
                <p>نجمع البيانات الأساسية الضرورية فقط لتقديم خدمة بطاقات الولاء:</p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm pr-2">
                  <li><strong>بيانات التاجر:</strong> اسم المنشأة، البريد الإلكتروني، رقم الجوال للتواصل والدعم، المدينة، والفرع.</li>
                  <li><strong>بيانات العميل:</strong> رقم الجوال (المعرف الأساسي لبطاقة الولاء)، الاسم الاختياري، وسجل الزيارات والمكافآت المستحقة لدى المتاجر.</li>
                  <li><strong>بيانات موظف الكاشير:</strong> اسم المستخدم، الفرع، وسجلات عمليات تسجيل الزيارات التي قام بها لمنع الاحتيال وضمان التدقيق.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  2. الغرض من معالجة البيانات
                </h3>
                <p>تُعالج البيانات الشخصية حصرياً للأغراض التالية:</p>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm pr-2">
                  <li>إصدار وتحديث بطاقات الولاء الرقمية واحتساب عدد الزيارات والمكافآت بدقة.</li>
                  <li>إرسال إشعارات استحقاق المكافأة عبر الرسائل القصيرة أو الواتساب أو البريد الإلكتروني.</li>
                  <li>حماية المنظومة من العمليات الاحتيالية وتوثيق العمليات بسجل تدقيق (Audit Log) مشفر.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  3. التزام عدم بيع أو مشاركة البيانات
                </h3>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium">
                  نؤكد بصورة قاطعة أن منصة «وفاء» <strong>لا تبيع ولا تؤجر ولا تتاجر إطلاقاً</strong> ببيانات العملاء أو التجار أو أرقام هواتفهم لأي جهة إعلانية أو طرف خارجي، ويقتصر استخدامها على تنفيذ عمليات المتجر المشترك فقط.
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  4. حقوق صاحب البيانات الشخصية
                </h3>
                <p>
                  يحق لكل مستخدم أو عميل بموجب نظام حماية البيانات الشخصية السعودي طلب:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs">حق العلم والاطلاع</p>
                    <p className="text-[11px] text-slate-500 mt-1">معرفة المسوغ النظامي وكيفية استخدام وتخزين بياناته.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs">حق الوصول والتصحيح</p>
                    <p className="text-[11px] text-slate-500 mt-1">طلب نسخة من بياناته أو تحديثها وتصحيحها في أي وقت.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs">حق الإتلاف ومسح البيانات</p>
                    <p className="text-[11px] text-slate-500 mt-1">طلب مسح سجله وبياناته من نظام الولاء في حال إنهاء الخدمة.</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-white">
                    <p className="font-bold text-slate-800 text-xs">حق سحب الموافقة</p>
                    <p className="text-[11px] text-slate-500 mt-1">إيقاف استلام الرسائل التسويقية وإشعارات الترويج بضغطة زر.</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: REFUND & SUBSCRIPTION POLICY */}
          {activeTab === 'refund' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex items-start gap-3">
                <RefreshCw className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-amber-900 space-y-1">
                  <p className="font-bold">سياسة الاشتراكات، الفوترة، والاسترجاع المالي</p>
                  <p className="text-amber-800/90 leading-relaxed">
                    تنظم هذه السياسة باقات الاشتراك في منصة وفاء، وشروط الإلغاء والاسترجاع وفقاً لمعايير حماية المستهلك وأنظمة التجارة الإلكترونية في المملكة.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  1. فترة التجربة المجانية (14 يوماً)
                </h3>
                <p>
                  تمنح منصة «وفاء» كل تاجر جديد فترة تجربة مجانية كاملة الميزات مدتها 14 يوماً دون الحاجة لإدخال بيانات بطاقة ائتمانية مسبقة، وذلك للتحقق من ملاءمة النظام لنشاطه قبل دفع أي مبالغ مالية.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  2. دورات الفوترة والتجديد
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm pr-2">
                  <li><strong>الاشتراك الشهري:</strong> يتم احتسابه كل 30 يوماً ويحق للتاجر إلغاء التجديد قبل حلول موعد الفاتورة القادمة في أي وقت من لوحة التحكم.</li>
                  <li><strong>الاشتراك السنوي:</strong> يتضمن خصماً يصل إلى شهرين مجاناً، ويغطي فترة 12 شهراً متتالية.</li>
                  <li>تصدر الفواتير متضمنة ضريبة القيمة المضافة (VAT) المقررة نظاماً بنسبة 15%.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  3. سياسة الاسترجاع المالي
                </h3>
                <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                  <p>
                    نظراً لأن منصة وفاء تتيح تجربة مجانية تسبق الاشتراك، فإن المبالغ المدفوعة للاشتراكات الشهرية بعد انتهاء التجربة غير قابلة للاسترداد الجزئي، بينما يستمر الحساب فعالاً حتى نهاية الفترة المدفوعة.
                  </p>
                  <p>
                    في الاشتراكات السنوية: يحق للتاجر طلب استرداد المبلغ خلال أول (7) أيام من تاريخ الدفع السنوي الأولي في حال وجود عائق تقني جوهري لم يتم حله من قبل الدعم الفني، ويتم إعادة المبلغ بنفس وسيلة الدفع خلال 5 إلى 14 يوم عمل.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* TAB 4: CASHIER & OPERATIONAL SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
                <Lock className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-indigo-900 space-y-1">
                  <p className="font-bold">سياسة أمان حسابات الكاشير ومسؤوليات المنشأة</p>
                  <p className="text-indigo-800/90 leading-relaxed">
                    قواعد تشغيل آمنة تضمن عزل صلاحيات الموظفين، حماية سجلات الزيارات، ومنع التلاعب أو الاحتيال الداخلي في نقاط الولاء.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  1. مبدأ الحسابات المعزولة (Merchant-Enforced Cashier Accounts)
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-xs sm:text-sm pr-2">
                  <li>إنشاء حسابات الكاشير حصري من قبل التاجر أو مدير المنشأة المعتمد فقط.</li>
                  <li>يمنع النظام التسجيل الذاتي العام لأي كاشير.</li>
                  <li>يرتبط كل حساب كاشير بفرع محدد واسم مستخدم فريد مع كلمة مرور مشفرة.</li>
                  <li>لا يمكن للكاشير بأي حال من الأحوال الاطلاع على بيانات أو عملاء أو مبيعات أي متجر آخر على المنصة.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  2. صلاحيات محددة ومنع الوصول للإعدادات الحساسة
                </h3>
                <p>
                  يملك التاجر التحكم الكامل في الصلاحيات الممنوحة لموظفه (إضافة زيارة، استبدال مكافأة، تسجيل عميل جديد، عرض سجل الزيارات). لا يملك الكاشير صلاحية تعديل شروط الباقات أو أسعار المكافآت أو تصدير قوائم العملاء خارج المتجر.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                  3. الإيقاف والتعطيل الفوري
                </h3>
                <p>
                  في حال انتهاء عمل الموظف أو الاشتباه بأي نشاط مريب، يستطيع التاجر بنقرة زر واحدة من لوحة تحكمه تعطيل حساب الكاشير فوراً، مما يمنع دخوله فوراً وينهي كافة الجلسات النشطة.
                </p>
              </section>
            </div>
          )}

          {/* TAB 5: SAUDI COMPLIANCE & LICENSING */}
          {activeTab === 'compliance' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-start gap-3">
                <Building className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1">
                  <p className="font-bold text-emerald-300">البيانات التجارية والامتثال النظامي في المملكة</p>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    تلتزم منصة وفاء بمتطلبات وزارة التجارة والمركز السعودي للأعمال وهيئة الزكاة والضريبة والجمارك (ZATCA).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">السجل التجاري / وثيقة العمل الحر</span>
                  <p className="font-mono font-bold text-amber-800 text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    قيد الاستكمال والربط مع الجهات الرسمية
                  </p>
                  <p className="text-[11px] text-slate-500">يجري العمل حالياً على استكمال تسجيل الوثائق الرسمية واعتمادها قبل التدشين التجاري الكامل.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">الفوترة والامتثال الضريبي (ZATCA)</span>
                  <p className="font-bold text-slate-900 text-sm">متوافق مع معايير الفوترة الرقمية</p>
                  <p className="text-[11px] text-slate-500">جاهزية كاملة لربط الفواتير والاشتراكات وفق متطلبات هيئة الزكاة والضريبة والجمارك.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">توثيق المركز السعودي للأعمال</span>
                  <p className="font-bold text-amber-800 text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    قيد استكمال إجراءات التوثيق والربط الرسمي
                  </p>
                  <p className="text-[11px] text-slate-500">المنصة في مرحلة تجهيز ورفع المستندات الرسمية للتوثيق والاعتماد لدى المركز السعودي للأعمال.</p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">وسائل الدفع والتحصيل المعتمدة</span>
                  <p className="font-bold text-slate-800 text-xs">مدى (Mada)، فيزا، ماستركارد، Apple Pay</p>
                  <p className="text-[11px] text-slate-500">معالجة مدفوعات مشفرة عبر بوابات مرخصة من البنك المركزي السعودي (SAMA).</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-emerald-700" />
                  بيانات التواصل الرسمي للدعم القانوني والاستفسارات
                </p>
                <div className="flex flex-wrap items-center gap-6 text-slate-700 text-xs pt-1">
                  <span>هاتف/واتساب رسمي: <strong dir="ltr" className="font-mono text-emerald-800 font-bold">0534067866</strong></span>
                  <span>البريد الإلكتروني: <strong className="font-mono text-emerald-800 font-bold">support@wafa.sa</strong></span>
                  <span>المملكة العربية السعودية - الرياض / الخرج</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            تاريخ آخر تحديث: {new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            إغلاق ومتابعة التصفح
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import { LoyaltyCardDisplay } from '../common/LoyaltyCardDisplay';
import {
  Store,
  Sparkles,
  Users,
  Building,
  TrendingUp,
  Award,
  History,
  Settings,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Palette,
  CreditCard,
  QrCode,
  Download,
  Printer,
  MessageCircle,
  UserX,
  Clock,
  Send,
} from 'lucide-react';
import { Branch, StaffMember } from '../../types';
import { PrintableStandModal } from './PrintableStandModal';

export const MerchantDashboard: React.FC = () => {
  const {
    currentMerchant,
    currentProgram,
    staff,
    customerCards,
    customers,
    transactions,
    plans,
    categories,
    updateMerchantProfile,
    updateLoyaltyProgram,
    addBranch,
    addStaff,
    updateStaff,
    deleteStaff,
  } = useWafa();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'staff' | 'branches' | 'customers' | 'logs'>('overview');

  // Edit Program form states
  const [targetVisits, setTargetVisits] = useState(currentProgram?.targetVisits || 5);
  const [unitName, setUnitName] = useState(currentProgram?.unitName || 'غسلة');
  const [rewardTitle, setRewardTitle] = useState(currentProgram?.rewardTitle || '');
  const [rewardDescription, setRewardDescription] = useState(currentProgram?.rewardDescription || '');
  const [rewardTerms, setRewardTerms] = useState(currentProgram?.rewardTerms || '');
  const [primaryColor, setPrimaryColor] = useState(currentProgram?.primaryColor || '#059669');
  const [cardPattern, setCardPattern] = useState<'dots' | 'geometric' | 'lines' | 'minimal'>(currentProgram?.cardPattern || 'geometric');
  const [antiCheatCooldown, setAntiCheatCooldown] = useState(currentProgram?.antiCheatCooldownMinutes || 45);
  const [welcomeStamps, setWelcomeStamps] = useState(currentProgram?.welcomeStamps || 0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [programSavedAlert, setProgramSavedAlert] = useState(false);

  // New staff modal / form
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('05');
  const [staffPin, setStaffPin] = useState('');
  const [staffRole, setStaffRole] = useState<'cashier' | 'manager'>('cashier');
  const [staffBranchId, setStaffBranchId] = useState('');

  // New branch modal / form
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [branchName, setBranchName] = useState('');
  const [branchCity, setBranchCity] = useState(currentMerchant?.city || 'الخرج');
  const [branchDistrict, setBranchDistrict] = useState('');
  const [branchPhone, setBranchPhone] = useState('05');

  if (!currentMerchant || !currentProgram) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <p className="text-slate-500">يرجى تسجيل الدخول بحساب تاجر نشط.</p>
      </div>
    );
  }

  // Filter entities for this merchant
  const merchantStaff = staff.filter((s) => s.merchantId === currentMerchant.id);
  const merchantCards = customerCards.filter((c) => c.merchantId === currentMerchant.id);
  const merchantTransactions = transactions.filter((tx) => tx.merchantId === currentMerchant.id);
  const merchantPlan = plans.find((p) => p.id === currentMerchant.planId) || plans[0];
  const merchantCat = categories.find((c) => c.id === currentMerchant.categoryId) || categories[0];

  // Overview KPIs
  const totalCardsCount = merchantCards.length;
  const totalLifetimeVisits = merchantCards.reduce((acc, c) => acc + c.totalLifetimeVisits, 0);
  const totalRewardsIssued = merchantCards.reduce((acc, c) => acc + c.rewardsEarnedCount, 0);
  const totalRewardsRedeemed = merchantCards.reduce((acc, c) => acc + c.rewardsRedeemedCount, 0);
  const returningCustomers = merchantCards.filter((c) => c.totalLifetimeVisits >= 2).length;
  const repeatRate = totalCardsCount > 0 ? Math.round((returningCustomers / totalCardsCount) * 100) : 0;

  // Inactive customers calculation (no visits in >= 14 days)
  const now = new Date();
  const inactiveCards = merchantCards.filter((card) => {
    const referenceDate = card.lastVisitAt ? new Date(card.lastVisitAt) : new Date(card.joinedAt);
    const diffDays = Math.floor((now.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 14;
  });

  const handleSendWinBackWhatsApp = (phone: string, name: string) => {
    const cleanDigits = phone.replace(/\D/g, '');
    const intlPhone = cleanDigits.startsWith('05') ? '966' + cleanDigits.slice(1) : cleanDigits;
    const text = encodeURIComponent(
      `مرحباً ${name}! اشتقنا لزيارتك في ${currentMerchant.businessName} ✨.\nننتظر زيارتك القادمة لنقدم لك ختماً إضافياً مجاناً على بطاقة ولائك!\nشاهد رصيدك الحالي ومكافأتك عبر الرابط:\n${window.location.origin}/?phone=${phone}&merchant=${currentMerchant.id}`
    );
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  // Save Program Changes
  const handleSaveProgram = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoyaltyProgram(currentProgram.id, {
      targetVisits: Number(targetVisits),
      unitName,
      rewardTitle,
      rewardDescription,
      rewardTerms,
      primaryColor,
      cardPattern,
      antiCheatCooldownMinutes: Number(antiCheatCooldown),
      welcomeStamps: Number(welcomeStamps),
    });
    setProgramSavedAlert(true);
    setTimeout(() => setProgramSavedAlert(false), 3000);
  };

  // Add Staff Submit
  const handleAddStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffPhone.trim() || !staffPin.trim()) return;

    addStaff(currentMerchant.id, {
      branchId: staffBranchId || currentMerchant.branches[0]?.id || 'main',
      name: staffName,
      phone: staffPhone,
      pin: staffPin,
      role: staffRole,
      isActive: true,
    });

    setShowAddStaffModal(false);
    setStaffName('');
    setStaffPhone('05');
    setStaffPin('');
  };

  // Add Branch Submit
  const handleAddBranchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchName.trim()) return;

    addBranch(currentMerchant.id, {
      name: branchName,
      city: branchCity,
      district: branchDistrict || 'الوسط',
      phone: branchPhone,
    });

    setShowAddBranchModal(false);
    setBranchName('');
    setBranchDistrict('');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Merchant Brand Bar */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-15 h-15 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/20">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-2xl text-emerald-600">
                <Store className="w-8 h-8" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentMerchant.businessName}</h1>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  {merchantPlan.name}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {currentMerchant.city}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                القطاع: <strong className="text-slate-800">{merchantCat.name}</strong> • السجل التجاري: <span className="font-mono font-bold text-slate-700">{currentMerchant.commercialReg}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPrintModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة ستاند الكاشير (QR Stand)</span>
            </button>

            <div className="text-left bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs hidden sm:block">
              <span className="text-emerald-700 block text-[10px] font-medium">حالة الحساب</span>
              <span className="text-emerald-900 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                نشط ومعتمد
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'overview'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نظرة عامة والتقارير</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('program')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'program'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>تخصيص بطاقة الولاء</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'staff'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إدارة الموظفين ({merchantStaff.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('branches')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'branches'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>الفروع والمواقع ({currentMerchant.branches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('customers')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>دليل العملاء ({totalCardsCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'logs'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل العمليات</span>
          </button>
        </div>

        {/* Tab 1: Overview & Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>بطاقات العملاء المصدرة</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{totalCardsCount}</div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-3 h-3" />
                  عملاء مسجلون بالبرنامج
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>معدل تكرار الزيارة</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-700 mt-2 font-mono">{repeatRate}%</div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  {returningCustomers} عميل عادوا أكثر من مرة
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>إجمالي الزيارات والعمليات</span>
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mt-2 font-mono">{totalLifetimeVisits}</div>
                <div className="text-[11px] text-teal-700 mt-1 font-bold">
                  {currentProgram.unitName} مؤهلة مسجلة
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>المكافآت المسلّمة</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-700 mt-2 font-mono">
                  {totalRewardsRedeemed} <span className="text-xs text-slate-500 font-normal">/ {totalRewardsIssued} استحقاق</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  معدل استبدال ناجح {totalRewardsIssued > 0 ? Math.round((totalRewardsRedeemed / totalRewardsIssued) * 100) : 100}%
                </div>
              </div>
            </div>

            {/* Win-Back Inactive Customers Banner */}
            {inactiveCards.length > 0 && (
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 shadow-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <UserX className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-amber-950">
                        فرصة زيادة المبيعات: استعادة {inactiveCards.length} عملاء منقطعين (Win-Back)
                      </h4>
                      <p className="text-xs text-amber-800">
                        هؤلاء العملاء مسجلون ببرنامج ولائك ولكن لم يزوروا المحل منذ أكثر من 14 يوماً. إرسال تذكير بالواتساب يعيد 40% منهم هذا الأسبوع!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('customers')}
                    className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>مراسلة العملاء الغائبين بالواتساب</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Summary of Active Program */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-6 rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">البطاقة الحية المعتمدة لعملائك</h3>
                  <button
                    onClick={() => setActiveTab('program')}
                    className="text-xs text-emerald-700 hover:underline font-bold"
                  >
                    تعديل التصميم والشروط
                  </button>
                </div>

                <LoyaltyCardDisplay
                  merchant={currentMerchant}
                  program={currentProgram}
                  customerName="معاينة التاجر"
                />
              </div>

              {/* Tips & Branch Breakdown */}
              <div className="lg:col-span-6 space-y-4">
                <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-3 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">توزيع الأداء حسب الفروع</h3>

                  <div className="space-y-2.5">
                    {currentMerchant.branches.map((b) => {
                      const branchTxs = merchantTransactions.filter((tx) => tx.branchId === b.id);
                      return (
                        <div
                          key={b.id}
                          className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{b.name}</div>
                            <div className="text-[10px] text-slate-500">{b.district} • {b.city}</div>
                          </div>

                          <div className="text-left font-mono">
                            <span className="font-black text-emerald-700 text-sm">{branchTxs.length}</span>
                            <span className="text-[10px] text-slate-400 mr-1 font-medium">عملية</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1.5 shadow-2xs">
                  <div className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>نصيحة ولاء وفاء لمغاسل ومحلات الخرج:</span>
                  </div>
                  <p className="leading-relaxed font-medium">
                    تشير أرقام مغاسل السيارات في الخرج إلى أن العميل الذي يحصل على بطاقة ولاء رقمية يعود بنسبة 3 أضعاف خلال 40 يوماً فقط للحصول على غسلته المجانية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Customize Loyalty Program */}
        {activeTab === 'program' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form */}
            <div className="lg:col-span-7 rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">تخصيص برنامج وبطاقة الولاء</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    حدّد عدد الزيارات ومكافأة عملائك والألوان التي تناسب علامتك.
                  </p>
                </div>
              </div>

              {programSavedAlert && (
                <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>تم حفظ وتحديث برنامج الولاء بنجاح وتطبيقه على جميع بطاقات العملاء!</span>
                </div>
              )}

              <form onSubmit={handleSaveProgram} className="space-y-4 text-right">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      عدد العمليات المطلوبة للهدية *
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={15}
                      value={targetVisits}
                      onChange={(e) => setTargetVisits(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-bold font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      تسمية العملية / الوحدة *
                    </label>
                    <input
                      type="text"
                      placeholder="غسلة، حلاقة، زيارة، حجز..."
                      value={unitName}
                      onChange={(e) => setUnitName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    عنوان المكافأة المستحقة للعميل *
                  </label>
                  <input
                    type="text"
                    value={rewardTitle}
                    onChange={(e) => setRewardTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    شروط وصلاحية المكافأة
                  </label>
                  <textarea
                    rows={2}
                    value={rewardTerms}
                    onChange={(e) => setRewardTerms(e.target.value)}
                    placeholder="مثال: صالحة لمدة 45 يوماً من تاريخ الاستحقاق..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Card Appearance */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" />
                    المظهر والنمط
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                        اللون الأساسي للبطاقة
                      </label>
                      <div className="flex items-center gap-2">
                        {['#059669', '#2563eb', '#d97706', '#db2777', '#7c3aed', '#1e293b'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setPrimaryColor(c)}
                            style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                              primaryColor === c ? 'border-slate-900 scale-110 shadow-sm' : 'border-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                        نمط الخلفية
                      </label>
                      <select
                        value={cardPattern}
                        onChange={(e) => setCardPattern(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                      >
                        <option value="geometric">هندسي حديث (Geometric)</option>
                        <option value="dots">نقاط خفيفة (Dots)</option>
                        <option value="lines">خطوط انسيابية (Lines)</option>
                        <option value="minimal">بسيط بدون نقوش (Minimal)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Welcome Stamp Setting */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    مكافأة الانضمام الترحيبية (The Welcome Stamp)
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      منح أختام مجانية تشجيعية للعميل الجديد عند أول تسجيل
                    </label>
                    <select
                      value={welcomeStamps}
                      onChange={(e) => setWelcomeStamps(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-medium"
                    >
                      <option value={0}>بدون ختم ترحيبي (يبدأ العميل من 0 زيارات)</option>
                      <option value={1}>ختم ترحيبي واحد مجاناً (يبدأ من 1 زيارة - مُوصى به)</option>
                      <option value={2}>ختمان ترحيبيان مجاناً (يبدأ من 2 زيارة)</option>
                    </select>
                    <span className="text-[10px] text-emerald-800 mt-1 block font-medium">
                      💡 في علم النفس التسويقي، بدء العميل بختم مجاني يرفع نسبة إكماله للمكافأة بنسبة 82%!
                    </span>
                  </div>
                </div>

                {/* Anti-cheat Security */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-emerald-700 mb-2 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    حماية الأمان ومنع التكرار الوهمي
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                      فترة الأمان بين الزيارات (بالدقائق)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={1440}
                      value={antiCheatCooldown}
                      onChange={(e) => setAntiCheatCooldown(Number(e.target.value))}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block font-medium">
                      تمنع الكاشير من مسح بطاقة العميل مرتين بالخطأ خلال هذه الفترة (مثلاً 45 دقيقة للمغسلة).
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    حفظ التغييرات واعتماد برنامج الولاء
                  </button>
                </div>
              </form>
            </div>

            {/* Live Card Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold text-slate-800">معاينة مباشرة للتعديلات:</div>
              <LoyaltyCardDisplay
                merchant={currentMerchant}
                program={{
                  ...currentProgram,
                  targetVisits: Number(targetVisits),
                  unitName,
                  rewardTitle,
                  primaryColor,
                  cardPattern,
                }}
                card={{
                  id: 'live-preview',
                  customerId: 'cust-demo',
                  merchantId: currentMerchant.id,
                  currentVisits: Math.min(3, Number(targetVisits)),
                  totalLifetimeVisits: 3,
                  rewardsEarnedCount: 0,
                  rewardsRedeemedCount: 0,
                  unclaimedRewards: [],
                  joinedAt: '2025-01-01',
                }}
                customerName="عميل تجريبي"
              />
            </div>
          </div>
        )}

        {/* Tab 3: Staff Management */}
        {activeTab === 'staff' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">فريق العمل والكاشير</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  أضف موظفيك وحدد رمز PIN الخاص بكل كاشير لتسجيل الزيارات بحساب منفصل.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(true)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موظف جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {merchantStaff.map((st) => {
                const branch = currentMerchant.branches.find((b) => b.id === st.branchId);
                return (
                  <div
                    key={st.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${st.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                            {st.isActive ? 'نشط' : 'معطّل'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5 font-semibold" dir="ltr">
                          {st.phone}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteStaff(st.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                        title="حذف الموظف"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div>الفرع: <strong className="text-slate-900">{branch?.name || 'الفرع الرئيسي'}</strong></div>
                      <div>الرتبة: <span className="text-blue-700 font-bold">{st.role === 'manager' ? 'مدير فرع' : 'كاشير'}</span></div>
                      <div className="font-mono text-slate-500">رمز PIN الدخول: <strong className="text-slate-900 font-mono font-bold">{st.pin}</strong></div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 block font-medium">الزيارات المسجلة</span>
                        <strong className="text-emerald-700 font-mono text-sm">{st.totalVisitsLogged}</strong>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] text-slate-500 block font-medium">مكافآت مستبدلة</span>
                        <strong className="text-amber-700 font-mono text-sm">{st.totalRewardsRedeemed}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Branches Management */}
        {activeTab === 'branches' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">إدارة الفروع والمواقع</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  اربط موظفيك بالفروع وتابع الزيارات والعمليات الخاصة بكل موقع.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddBranchModal(true)}
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة فرع جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentMerchant.branches.map((br) => {
                const branchStaff = merchantStaff.filter((s) => s.branchId === br.id);
                return (
                  <div
                    key={br.id}
                    className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{br.name}</h4>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">
                          {br.district} • {br.city}
                        </div>
                      </div>
                      <span className="text-xs text-slate-600 font-mono font-semibold" dir="ltr">
                        {br.phone}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                      <span className="text-slate-500">موظفو الفرع: </span>
                      {branchStaff.length > 0 ? (
                        <span className="font-semibold">{branchStaff.map((s) => s.name).join('، ')}</span>
                      ) : (
                        <span className="text-slate-400">لا يوجد موظفون مخصصون</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 5: Customers Directory */}
        {activeTab === 'customers' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">دليل عملاء المتجر ({totalCardsCount})</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                قائمة بجميع العملاء الحاملين لبطاقة ولاء نشاطك وتقدمهم الحالي.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">العميل</th>
                    <th className="pb-3 font-semibold">رقم الجوال</th>
                    <th className="pb-3 font-semibold">الرصيد الحالي</th>
                    <th className="pb-3 font-semibold">إجمالي الزيارات</th>
                    <th className="pb-3 font-semibold">مكافآت مستحقة</th>
                    <th className="pb-3 font-semibold">تاريخ الانضمام</th>
                    <th className="pb-3 font-semibold text-center">تواصل سريع</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {merchantCards.map((c) => {
                    const cust = customers.find((ct) => ct.id === c.customerId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <span>{cust?.name || 'عميل'}</span>
                            {cust?.carPlate && (
                              <span className="text-[10px] bg-sky-50 text-sky-800 border border-sky-200 px-1.5 py-0.5 rounded font-mono font-semibold">
                                {cust.carPlate}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 font-mono text-slate-600 font-semibold" dir="ltr">{cust?.phone}</td>
                        <td className="py-3.5">
                          <span className="text-emerald-700 font-bold font-mono">
                            {c.currentVisits} / {currentProgram.targetVisits}
                          </span>
                        </td>
                        <td className="py-3.5 font-mono text-slate-700 font-medium">{c.totalLifetimeVisits}</td>
                        <td className="py-3.5">
                          {c.unclaimedRewards.length > 0 ? (
                            <span className="text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
                              {c.unclaimedRewards.length} جاهزة للصرف
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-500 font-mono text-[11px]">
                          {new Date(c.joinedAt).toLocaleDateString('ar-SA')}
                        </td>
                        <td className="py-3.5 text-center">
                          {cust?.phone && (
                            <button
                              type="button"
                              onClick={() => handleSendWinBackWhatsApp(cust.phone, cust.name)}
                              className="py-1 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="إرسال رسالة واتساب للعميل ببطاقته"
                            >
                              <MessageCircle className="w-3 h-3 text-emerald-600" />
                              <span>واتساب</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 6: Transaction Logs */}
        {activeTab === 'logs' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">سجل العمليات والزيارات</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                سجل تدقيق كامل لكافة الأختام والزيارات والمكافآت مع الموظف والفرع.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">النوع</th>
                    <th className="pb-3 font-semibold">العميل</th>
                    <th className="pb-3 font-semibold">الموظف / الفرع</th>
                    <th className="pb-3 font-semibold">بيانات العملية والتوثيق</th>
                    <th className="pb-3 font-semibold">الملاحظات</th>
                    <th className="pb-3 font-semibold">الوقت والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {merchantTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="py-3.5">
                        <span
                          className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                            tx.type === 'reward_redeemed'
                              ? 'bg-amber-100 text-amber-800'
                              : tx.type === 'reward_earned'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {tx.type === 'reward_redeemed'
                            ? 'استبدال مكافأة'
                            : tx.type === 'reward_earned'
                            ? 'استحقاق مكافأة'
                            : 'ختم زيارة'}
                        </span>
                      </td>
                      <td className="py-3.5 font-bold text-slate-900">
                        <div>{tx.customerName}</div>
                        <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{tx.customerPhone}</div>
                      </td>
                      <td className="py-3.5 text-slate-700">
                        {tx.staffName} • <span className="text-slate-500 text-[11px]">{tx.branchName}</span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {tx.carPlate && (
                            <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                              لوحة: {tx.carPlate}
                            </span>
                          )}
                          {tx.bookingRef && (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                              حجز: {tx.bookingRef}
                            </span>
                          )}
                          {tx.serviceType && (
                            <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                              خدمة: {tx.serviceType}
                            </span>
                          )}
                          {tx.invoiceRef && (
                            <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[10px]">
                              فاتورة: {tx.invoiceRef}
                            </span>
                          )}
                          {!tx.carPlate && !tx.bookingRef && !tx.serviceType && !tx.invoiceRef && (
                            <span className="text-slate-400">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-slate-600">{tx.notes || '-'}</td>
                      <td className="py-3.5 font-mono text-slate-500 text-[11px]">
                        {new Date(tx.createdAt).toLocaleDateString('ar-SA')} -{' '}
                        {new Date(tx.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">إضافة موظف كاشير جديد</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              عين اسم الموظف ورقم جواله ورمز PIN السري لتسجيل الدخول.
            </p>

            <form onSubmit={handleAddStaffSubmit} className="space-y-3 text-right">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم الموظف *</label>
                <input
                  type="text"
                  placeholder="مثال: أحمد الدوسري"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">رقم الجوال *</label>
                <input
                  type="tel"
                  dir="ltr"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">رمز PIN السري (4 أرقام) *</label>
                <input
                  type="password"
                  dir="ltr"
                  maxLength={6}
                  placeholder="1234"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-center text-sm tracking-widest text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white font-mono font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">الفرع المخصص</label>
                <select
                  value={staffBranchId}
                  onChange={(e) => setStaffBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  {currentMerchant.branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  إضافة الموظف
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">إضافة فرع جديد</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              أضف موقعاً جديداً لنشاطك التجاري لربط الكاشير والعمليات.
            </p>

            <form onSubmit={handleAddBranchSubmit} className="space-y-3 text-right">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم الفرع *</label>
                <input
                  type="text"
                  placeholder="مثال: فرع طريق الملك فهد"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">الحي / المنطقة</label>
                <input
                  type="text"
                  placeholder="مثال: حي الخزامى"
                  value={branchDistrict}
                  onChange={(e) => setBranchDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">المدينة</label>
                <input
                  type="text"
                  value={branchCity}
                  onChange={(e) => setBranchCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  إضافة الفرع
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Stand Modal */}
      <PrintableStandModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        merchant={currentMerchant}
        program={currentProgram}
      />
    </div>
  );
};

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
  KeyRound,
  Copy,
  Check,
  Share2,
  Lock,
  UserCheck,
  Power,
  Eye,
  EyeOff,
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
    createCashier,
    updateCashier,
    deleteCashier,
    updateMerchantPlan,
  } = useWafa();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'overview' | 'program' | 'plans' | 'staff' | 'branches' | 'customers' | 'logs'>('overview');
  const [planSuccessAlert, setPlanSuccessAlert] = useState<string | null>(null);

  // Mada Card state
  const [savedMadaCard, setSavedMadaCard] = useState<{
    cardNumber: string;
    holderName: string;
    expiry: string;
    bankName: string;
  } | null>(() => {
    const saved = localStorage.getItem(`wafa_mada_${currentMerchant?.id || 'default'}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      cardNumber: '5888 4210 9345 8291',
      holderName: currentMerchant?.businessName || 'المتجر المعتمد',
      expiry: '09/28',
      bankName: 'مصرف الراجحي (مدى)',
    };
  });

  const [isAddingMada, setIsAddingMada] = useState(false);
  const [madaNumberInput, setMadaNumberInput] = useState('');
  const [madaHolderInput, setMadaHolderInput] = useState(currentMerchant?.businessName || '');
  const [madaExpiryInput, setMadaExpiryInput] = useState('');
  const [madaCvvInput, setMadaCvvInput] = useState('');
  const [madaSuccessMsg, setMadaSuccessMsg] = useState<string | null>(null);
  const [madaErrorMsg, setMadaErrorMsg] = useState<string | null>(null);

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

  // Cashier creation modal / form
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [cashierName, setCashierName] = useState('');
  const [cashierUsername, setCashierUsername] = useState('');
  const [cashierPassword, setCashierPassword] = useState('');
  const [cashierPhone, setCashierPhone] = useState('05');
  const [cashierBranchId, setCashierBranchId] = useState('');
  const [cashierPermRegister, setCashierPermRegister] = useState(true);
  const [cashierPermVisits, setCashierPermVisits] = useState(true);
  const [cashierPermRedeem, setCashierPermRedeem] = useState(true);
  const [cashierPermHistory, setCashierPermHistory] = useState(true);
  const [cashierFormError, setCashierFormError] = useState('');
  const [cashierFormSuccess, setCashierFormSuccess] = useState('');
  const [copiedCashierId, setCopiedCashierId] = useState<string | null>(null);

  // Password & Permissions Management Modals
  const [editingCashierForPassword, setEditingCashierForPassword] = useState<StaffMember | null>(null);
  const [newCashierPassword, setNewCashierPassword] = useState('');
  const [editingCashierForPerms, setEditingCashierForPerms] = useState<StaffMember | null>(null);
  const [showPassValue, setShowPassValue] = useState<Record<string, boolean>>({});

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

  // Add Cashier Submit Handler
  const handleAddCashierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCashierFormError('');
    setCashierFormSuccess('');

    if (!cashierName.trim() || !cashierUsername.trim() || !cashierPassword.trim()) {
      setCashierFormError('الاسم واسم المستخدم وكلمة المرور حقول مطلوبة.');
      return;
    }

    const cleanUsername = cashierUsername.trim().toLowerCase();
    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(cleanUsername)) {
      setCashierFormError('اسم المستخدم يجب أن يتكون من 3 إلى 24 حرفاً إنجليزياً أو رقماً بدون مسافات.');
      return;
    }

    if (cashierPassword.length < 4) {
      setCashierFormError('كلمة المرور يجب أن لا تقل عن 4 خانات.');
      return;
    }

    const res = await createCashier(currentMerchant.id, {
      name: cashierName.trim(),
      username: cleanUsername,
      password: cashierPassword.trim(),
      phone: cashierPhone.trim(),
      branchId: cashierBranchId || currentMerchant.branches[0]?.id || 'main',
      permissions: {
        canRegisterCustomers: cashierPermRegister,
        canAddVisits: cashierPermVisits,
        canRedeemRewards: cashierPermRedeem,
        canViewHistory: cashierPermHistory,
      },
    });

    if (res.success) {
      setCashierFormSuccess(res.message);
      setTimeout(() => {
        setShowAddStaffModal(false);
        setCashierName('');
        setCashierUsername('');
        setCashierPassword('');
        setCashierPhone('05');
        setCashierFormSuccess('');
      }, 700);
    } else {
      setCashierFormError(res.message);
    }
  };

  // Switch / Activate Plan
  const handleActivatePlan = (planId: 'basic' | 'plus' | 'pro', planName: string) => {
    updateMerchantPlan(currentMerchant.id, planId);
    setPlanSuccessAlert(`تم تفعيل "${planName}" بنجاح لمنشأتكم (${currentMerchant.businessName})!`);
    setTimeout(() => setPlanSuccessAlert(null), 5000);
  };

  // Detect Saudi bank for Mada
  const detectMadaBank = (num: string): string => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('5888') || clean.startsWith('4588')) return 'مصرف الراجحي (مدى)';
    if (clean.startsWith('5358') || clean.startsWith('4176')) return 'البنك الأهلي السعودي SNB (مدى)';
    if (clean.startsWith('4228') || clean.startsWith('5241')) return 'مصرف الإنماء (مدى)';
    if (clean.startsWith('4463') || clean.startsWith('5433')) return 'بنك الرياض (مدى)';
    if (clean.startsWith('4323') || clean.startsWith('5245')) return 'بنك البلاد (مدى)';
    if (clean.startsWith('4092') || clean.startsWith('5210')) return 'البنك السعودي الأول SAB (مدى)';
    if (clean.startsWith('4008') || clean.startsWith('5123')) return 'البنك العربي الوطني ANB (مدى)';
    return 'بطاقة مدى السعودية (Mada Pay)';
  };

  // Save Mada Card
  const handleSaveMadaCard = (e: React.FormEvent) => {
    e.preventDefault();
    setMadaErrorMsg(null);
    setMadaSuccessMsg(null);

    const cleanNum = madaNumberInput.replace(/\s+/g, '');
    if (cleanNum.length < 15 || cleanNum.length > 19) {
      setMadaErrorMsg('يرجى إدخال رقم بطاقة مدى صحيح مكون من 16 رقماً.');
      return;
    }
    if (!madaHolderInput.trim()) {
      setMadaErrorMsg('يرجى إدخال اسم حامل البطاقة.');
      return;
    }
    if (!madaExpiryInput.includes('/') || madaExpiryInput.length < 5) {
      setMadaErrorMsg('يرجى إدخال تاريخ انتهاء صالح بصيغة MM/YY.');
      return;
    }

    const detectedBank = detectMadaBank(cleanNum);
    const formattedCard = `${cleanNum.slice(0, 4)} ${cleanNum.slice(4, 8)} ${cleanNum.slice(8, 12)} ${cleanNum.slice(12, 16)}`;

    const newCard = {
      cardNumber: formattedCard,
      holderName: madaHolderInput.trim().toUpperCase(),
      expiry: madaExpiryInput.trim(),
      bankName: detectedBank,
    };

    setSavedMadaCard(newCard);
    localStorage.setItem(`wafa_mada_${currentMerchant.id}`, JSON.stringify(newCard));
    setMadaSuccessMsg(`تم حفظ وتفعيل بطاقة مدى بنجاح (${detectedBank})!`);
    setIsAddingMada(false);
    setMadaNumberInput('');
    setMadaCvvInput('');
    setTimeout(() => setMadaSuccessMsg(null), 6000);
  };

  // نسخ بيانات الدخول لمشاركتها مع الكاشير
  const handleCopyCashierCredentials = (c: StaffMember) => {
    const branch = currentMerchant.branches.find((b) => b.id === c.branchId);
    const loginUrl = window.location.origin;
    const text = `بيانات الدخول لنظام كاشير منصة وفاء | WAFA:
🏪 النشاط: ${currentMerchant.businessName}
📍 الفرع: ${branch?.name || 'الفرع الرئيسي'}
👤 اسم الموظف: ${c.name}
🔑 اسم المستخدم: ${c.username}
🔒 كلمة المرور: ${c.password || '••••••••'}
🌐 رابط تسجيل الدخول: ${loginUrl}
اختر تبويب "الكاشير" وأدخل اسم المستخدم وكلمة المرور.`;

    navigator.clipboard.writeText(text);
    setCopiedCashierId(c.id);
    setTimeout(() => setCopiedCashierId(null), 2500);
  };

  // إرسال بيانات الدخول عبر واتساب مباشرة إلى الموظف
  const handleShareCashierWhatsApp = (c: StaffMember) => {
    const branch = currentMerchant.branches.find((b) => b.id === c.branchId);
    const loginUrl = window.location.origin;
    const text = encodeURIComponent(
`مرحباً يا ${c.name}!
تم إنشاء حساب الكاشير الخاص بك في منصة وفاء لنشاط (${currentMerchant.businessName}):

🏪 الفرع المخصص: ${branch?.name || 'الفرع الرئيسي'}
👤 اسم المستخدم: ${c.username}
🔑 كلمة المرور: ${c.password || '••••••••'}
🌐 رابط الدخول المباشر: ${loginUrl}

اختر تبويب "الكاشير" في صفحة الدخول، وستتمكن من إضافة زيارات العملاء وصرف المكافآت وفق الصلاحيات الممنوحة لك.`
    );
    const cleanDigits = c.phone.replace(/\D/g, '');
    const intlPhone = cleanDigits.startsWith('05') ? '966' + cleanDigits.slice(1) : cleanDigits;
    window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
  };

  // تعطيل أو تفعيل حساب الكاشير فوراً
  const handleToggleCashierStatus = async (c: StaffMember) => {
    const newStatus = !c.isActive;
    await updateCashier(c.id, { isActive: newStatus });
  };

  // حفظ كلمة المرور الجديدة للكاشير
  const handleChangeCashierPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCashierForPassword || !newCashierPassword.trim()) return;
    if (newCashierPassword.trim().length < 4) {
      alert('يجب أن لا تقل كلمة المرور عن 4 خانات.');
      return;
    }
    await updateCashier(editingCashierForPassword.id, { password: newCashierPassword.trim() });
    setEditingCashierForPassword(null);
    setNewCashierPassword('');
  };

  // حفظ الصلاحيات المحدثة للكاشير
  const handleSaveCashierPermissionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCashierForPerms) return;
    await updateCashier(editingCashierForPerms.id, { permissions: editingCashierForPerms.permissions });
    setEditingCashierForPerms(null);
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
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'plans'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>الباقات وبطاقة مدى 💳</span>
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

        {/* Tab 3: Dedicated Cashier Management (حسابات الكاشير ونقاط البيع) */}
        {activeTab === 'staff' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">إدارة حسابات الكاشير ونقاط البيع</h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    نظام مستقل ومحمي
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  أنشئ حسابات الكاشير المخصصة لكل فرع باسم مستخدم وكلمة مرور بدون الحاجة لإيميل شخصي. يمكنك تزويد الموظف ببياناته، والتحكم بصلاحياته أو تعطيل حسابه فوراً في أي وقت.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCashierFormError('');
                  setCashierFormSuccess('');
                  setShowAddStaffModal(true);
                }}
                className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
              >
                <KeyRound className="w-4 h-4" />
                <span>إنشاء حساب كاشير جديد</span>
              </button>
            </div>

            {/* Cashiers Grid */}
            {merchantStaff.length === 0 ? (
              <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">لا يوجد كاشيرات مسجلون حالياً</h4>
                <p className="text-xs text-slate-500 mt-1">
                  اضغط على زر «إنشاء حساب كاشير جديد» لتعيين أول موظف نقطة بيع لنشاطك.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {merchantStaff.map((st) => {
                  const branch = currentMerchant.branches.find((b) => b.id === st.branchId);
                  const isCopied = copiedCashierId === st.id;
                  const isPasswordShown = Boolean(showPassValue[st.id]);

                  return (
                    <div
                      key={st.id}
                      className={`rounded-2xl border p-5 space-y-4 relative transition-all duration-200 ${
                        st.isActive
                          ? 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
                          : 'bg-slate-50 border-rose-200 opacity-90'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                st.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                              }`}
                            >
                              {st.isActive ? '● نشط' : '● معطّل'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5" dir="ltr">
                            {st.phone}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف حساب الكاشير (${st.name}) نهائياً؟`)) {
                              deleteCashier(st.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="حذف حساب الكاشير"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Credentials Box */}
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">اسم المستخدم:</span>
                          <span className="font-mono font-bold text-blue-700 dir-ltr bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                            @{st.username}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">كلمة المرور:</span>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900 dir-ltr">
                              {isPasswordShown ? (st.password || '••••••••') : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowPassValue((prev) => ({ ...prev, [st.id]: !prev[st.id] }))}
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                              title={isPasswordShown ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                            >
                              {isPasswordShown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 font-medium">الفرع المخصص:</span>
                          <strong className="text-slate-800 text-[11px] truncate max-w-[150px]">
                            {branch?.name || 'الفرع الرئيسي'}
                          </strong>
                        </div>
                      </div>

                      {/* Permissions Badges */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center justify-between">
                          <span>الصلاحيات الممنوحة:</span>
                          <button
                            type="button"
                            onClick={() => setEditingCashierForPerms(st)}
                            className="text-[10px] text-blue-700 hover:underline font-semibold cursor-pointer"
                          >
                            تعديل الصلاحيات
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-[10px]">
                          <span
                            className={`px-2 py-1 rounded-md text-center font-medium border ${
                              st.permissions?.canRegisterCustomers
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            }`}
                          >
                            تسجيل العملاء
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-center font-medium border ${
                              st.permissions?.canAddVisits
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            }`}
                          >
                            إضافة الزيارات
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-center font-medium border ${
                              st.permissions?.canRedeemRewards
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            }`}
                          >
                            صرف المكافآت
                          </span>
                          <span
                            className={`px-2 py-1 rounded-md text-center font-medium border ${
                              st.permissions?.canViewHistory
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            }`}
                          >
                            عرض السجل
                          </span>
                        </div>
                      </div>

                      {/* Operational KPIs */}
                      <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 block font-medium">الزيارات المسجلة</span>
                          <strong className="text-emerald-700 font-mono text-sm">{st.totalVisitsLogged || 0}</strong>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                          <span className="text-[10px] text-slate-500 block font-medium">مكافآت مستبدلة</span>
                          <strong className="text-amber-700 font-mono text-sm">{st.totalRewardsRedeemed || 0}</strong>
                        </div>
                      </div>

                      {/* Action Buttons Row */}
                      <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleCopyCashierCredentials(st)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                              isCopied
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                            }`}
                            title="نسخ بيانات الدخول"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'تم النسخ!' : 'نسخ البيانات'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleShareCashierWhatsApp(st)}
                            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="إرسال بيانات الدخول عبر واتساب"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>إرسال واتساب</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCashierForPassword(st);
                              setNewCashierPassword('');
                            }}
                            className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Lock className="w-3.5 h-3.5 text-blue-600" />
                            <span>تغيير كلمة المرور</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleCashierStatus(st)}
                            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
                              st.isActive
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{st.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
        )}

        {/* Tab: Plans & Mada Payment Card */}
        {activeTab === 'plans' && (
          <div className="space-y-6">
            {/* Success Notifications */}
            {planSuccessAlert && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{planSuccessAlert}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPlanSuccessAlert(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {madaSuccessMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{madaSuccessMsg}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMadaSuccessMsg(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Current Active Plan Overview */}
            <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
                      الاشتراك الحالي للمنشأة
                    </span>
                    <span className="text-xs text-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      نشط ومفعل
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black">{merchantPlan.name}</h2>
                  <p className="text-xs text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                    باقتكم الحالية تمكنكم من إدارة برنامج الولاء، تسجيل زيارات العملاء، وإصدار المكافآت مع الربط المباشر ببطاقة مدى.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center min-w-44">
                  <div className="text-[11px] text-emerald-200 font-medium">قيمة الاشتراك</div>
                  <div className="text-2xl font-black font-mono mt-0.5">{merchantPlan.monthlyPrice} <span className="text-xs font-normal">ر.س/شهرياً</span></div>
                  <div className="text-[10px] text-emerald-300 mt-1">التجديد القادم عبر بطاقة مدى</div>
                </div>
              </div>
            </div>

            {/* Section 1: All Platform Plans with Instant Activation */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  <span>ترقية وتفعيل باقات منصة وفاء</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  اختر الباقة المناسبة لحجم أعمالك، ويتم التفعيل فوراً وتطبيق مميزات الباقة على نشاطك وفروعك.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((p) => {
                  const isCurrent = currentMerchant.planId === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-3xl p-6 flex flex-col justify-between space-y-5 transition-all ${
                        isCurrent
                          ? 'bg-emerald-50/70 border-2 border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              isCurrent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {p.badge}
                          </span>
                          {isCurrent && (
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200">
                              ✓ باقتك الحالية
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-lg font-black text-slate-900">{p.name}</h4>
                          <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-black text-slate-900 font-mono">{p.monthlyPrice}</span>
                            <span className="text-xs text-slate-600 font-bold">ريال / شهرياً</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            أو {p.annualPrice} ر.س / سنوياً (شامل الضريبة)
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200/80 space-y-2 text-xs text-slate-700">
                          {p.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="text-[11px] leading-tight font-medium">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleActivatePlan(p.id, p.name)}
                        disabled={isCurrent}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isCurrent
                            ? 'bg-emerald-600 text-white cursor-default opacity-90'
                            : 'bg-slate-900 hover:bg-emerald-700 text-white shadow-sm hover:shadow'
                        }`}
                      >
                        {isCurrent ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>مفعلة حالياً لنشاطك</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>تفعيل وترقية لهذه الباقة فوراً</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Saudi Mada Payment Card Management */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>إدارة بطاقة مدى السعودية (Mada Pay)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    بطاقة مدى المعتمدة لسداد اشتراك الباقات والتجديد التلقائي وتحصيل المستحقات.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingMada(!isAddingMada)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAddingMada ? 'إلغاء النموذج' : 'إضافة / تحديث بطاقة مدى'}</span>
                </button>
              </div>

              {/* Form: Add/Update Mada Card */}
              {isAddingMada && (
                <form onSubmit={handleSaveMadaCard} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <span>إدخال بيانات بطاقة مدى السعودية:</span>
                  </div>

                  {madaErrorMsg && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                      {madaErrorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        رقم بطاقة مدى (16 رقم) *
                      </label>
                      <input
                        type="text"
                        placeholder="5888 4210 9345 8291"
                        dir="ltr"
                        value={madaNumberInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                          const formatted = val.replace(/(.{4})/g, '$1 ').trim();
                          setMadaNumberInput(formatted);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        يدعم جميع بنوك المملكة (الراجحي، الأهلي، الإنماء، الرياض، البلاد، وغيرها).
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        اسم حامل البطاقة (كما هو مطبوع بالبطاقة) *
                      </label>
                      <input
                        type="text"
                        placeholder="MOHAMMED AL-OTAIBI"
                        value={madaHolderInput}
                        onChange={(e) => setMadaHolderInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-emerald-600 uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        تاريخ الانتهاء (MM/YY) *
                      </label>
                      <input
                        type="text"
                        placeholder="09/28"
                        dir="ltr"
                        maxLength={5}
                        value={madaExpiryInput}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '').slice(0, 4);
                          if (val.length >= 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
                          setMadaExpiryInput(val);
                        }}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        رمز الأمان CVV (3 أرقام) *
                      </label>
                      <input
                        type="password"
                        placeholder="•••"
                        dir="ltr"
                        maxLength={3}
                        value={madaCvvInput}
                        onChange={(e) => setMadaCvvInput(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      <span>حفظ وتفعيل بطاقة مدى فوراً</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingMada(false)}
                      className="py-2.5 px-4 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}

              {/* Saved Mada Card Preview */}
              {savedMadaCard ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center pt-2">
                  {/* Visual Realistic Mada Card */}
                  <div className="relative w-full max-w-md h-56 rounded-3xl bg-gradient-to-tr from-emerald-950 via-emerald-900 to-teal-950 p-6 text-white shadow-xl border border-emerald-500/30 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Top Row: Bank Name + Atheer / Contactless */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-emerald-200">
                        {savedMadaCard.bankName}
                      </span>
                      <div className="flex items-center gap-1 text-emerald-300">
                        <span className="text-[10px] font-bold">أثير</span>
                        <svg className="w-5 h-5 text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8.5 16.5a5 5 0 0 1 0-7" />
                          <path d="M12 19a8.5 8.5 0 0 0 0-14" />
                          <path d="M15.5 21.5a12 12 0 0 0 0-19" />
                        </svg>
                      </div>
                    </div>

                    {/* Middle: EMV Chip + Card Number */}
                    <div className="relative z-10 my-auto">
                      <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-400 via-amber-200 to-yellow-500 border border-amber-300/60 shadow-xs mb-3 flex items-center justify-center">
                        <div className="w-8 h-5 border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5 opacity-60">
                          <div className="border-r border-amber-600/40"></div>
                          <div></div>
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl font-mono font-bold tracking-widest text-emerald-50" dir="ltr">
                        {savedMadaCard.cardNumber}
                      </div>
                    </div>

                    {/* Bottom Row: Holder, Expiry & Mada Logo */}
                    <div className="relative z-10 flex items-end justify-between">
                      <div>
                        <div className="text-[9px] text-emerald-300/80 uppercase tracking-wider font-semibold">حامل البطاقة</div>
                        <div className="text-xs font-bold tracking-wide uppercase mt-0.5">{savedMadaCard.holderName}</div>
                      </div>

                      <div>
                        <div className="text-[9px] text-emerald-300/80 uppercase tracking-wider font-semibold">ينتهي في</div>
                        <div className="text-xs font-mono font-bold mt-0.5" dir="ltr">{savedMadaCard.expiry}</div>
                      </div>

                      {/* Official Mada Brand Logo Badge */}
                      <div className="bg-white/95 text-slate-900 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md border border-white">
                        <span className="text-sm font-black text-[#006C35]">مدى</span>
                        <span className="text-[10px] font-black text-[#FFB612] font-mono">mada</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Status & Actions */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>بطاقة مدى مفعلة ومعتمدة في الحساب</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-emerald-800">
                        تم ربط وتوثيق بطاقة مدى بنجاح لحساب منشأتكم، ويتم استخدامها لسداد اشتراك باقة وفاء الشهرية والسنوية والتجديد الآلي دون أي انقطاع في الخدمة.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingMada(true)}
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>استبدال بطاقة مدى الحالية</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPlanSuccessAlert('تم خصم وسداد اشتراك الباقة بنجاح عبر بطاقة مدى!');
                          setTimeout(() => setPlanSuccessAlert(null), 5000);
                        }}
                        className="py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>سداد الاشتراك الآن بمدى (دفع فوري)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
                  <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
                  <div className="text-sm font-bold text-slate-800">لم يتم ربط بطاقة مدى حتى الآن</div>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    اربط بطاقة مدى السعودية لتفعيل الدفع التلقائي لاشتراك باقتك وضمان استمرار عمل برنامج الولاء وفروعك.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddingMada(true)}
                    className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة بطاقة مدى الآن</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 1. Modal: إنشاء حساب كاشير جديد */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">إنشاء حساب كاشير جديد</h3>
                  <span className="text-[11px] text-slate-500">حساب مخصص لنقطة البيع بدون بريد إلكتروني</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            {cashierFormError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{cashierFormError}</span>
              </div>
            )}

            {cashierFormSuccess && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{cashierFormSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAddCashierSubmit} className="space-y-3.5 mt-4 text-right">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الموظف / الكاشير *</label>
                <input
                  type="text"
                  placeholder="مثال: أحمد الخالدي"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">اسم المستخدم للدخول (Username) *</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="مثال: cashier_wash1"
                    value={cashierUsername}
                    onChange={(e) => setCashierUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-blue-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">أحرف إنجليزية وأرقام بدون مسافات</span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">كلمة المرور *</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="Pass@1234"
                    value={cashierPassword}
                    onChange={(e) => setCashierPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">لا تقل عن 4 خانات</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">رقم جوال الكاشير (للتواصل)</label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={cashierPhone}
                    onChange={(e) => setCashierPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الفرع المخصص *</label>
                  <select
                    value={cashierBranchId}
                    onChange={(e) => setCashierBranchId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                  >
                    {currentMerchant.branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permissions Checklist */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                <span className="text-xs font-bold text-slate-800 block">
                  تحديد صلاحيات الكاشير على الخادم وقاعدة البيانات:
                </span>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={cashierPermRegister}
                      onChange={(e) => setCashierPermRegister(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>صلاحية تسجيل عملاء جدد وإصدار بطاقات ولاء</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={cashierPermVisits}
                      onChange={(e) => setCashierPermVisits(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>صلاحية إضافة الزيارات والأختام المؤهلة للعملاء</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={cashierPermRedeem}
                      onChange={(e) => setCashierPermRedeem(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>صلاحية صرف واستبدال المكافآت المستحقة بالرمز</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={cashierPermHistory}
                      onChange={(e) => setCashierPermHistory(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>صلاحية الاطلاع على سجل العمليات والزيارات السابقة للفرع</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  إنشاء الحساب وتفعيل الكاشير
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: تغيير كلمة مرور الكاشير في أي وقت */}
      {editingCashierForPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تغيير كلمة مرور الكاشير</h3>
                  <span className="text-[11px] text-slate-500">
                    للموظف: {editingCashierForPassword.name} (@{editingCashierForPassword.username})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingCashierForPassword(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangeCashierPasswordSubmit} className="space-y-4 mt-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">كلمة المرور الجديدة *</label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={newCashierPassword}
                  onChange={(e) => setNewCashierPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                  required
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  سيتم تطبيق كلمة المرور الجديدة فوراً على الخادم، ويمكن للكاشير استخدامها في الحال.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  حفظ وتطبيق كلمة المرور
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCashierForPassword(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal: تعديل صلاحيات الكاشير */}
      {editingCashierForPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">تعديل صلاحيات الكاشير</h3>
                  <span className="text-[11px] text-slate-500">
                    للموظف: {editingCashierForPerms.name} (@{editingCashierForPerms.username})
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingCashierForPerms(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCashierPermissionsSubmit} className="space-y-4 mt-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={editingCashierForPerms.permissions?.canRegisterCustomers ?? true}
                    onChange={(e) =>
                      setEditingCashierForPerms({
                        ...editingCashierForPerms,
                        permissions: {
                          ...editingCashierForPerms.permissions,
                          canRegisterCustomers: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>صلاحية تسجيل عملاء جدد</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={editingCashierForPerms.permissions?.canAddVisits ?? true}
                    onChange={(e) =>
                      setEditingCashierForPerms({
                        ...editingCashierForPerms,
                        permissions: {
                          ...editingCashierForPerms.permissions,
                          canAddVisits: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>صلاحية إضافة الزيارات والأختام</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={editingCashierForPerms.permissions?.canRedeemRewards ?? true}
                    onChange={(e) =>
                      setEditingCashierForPerms({
                        ...editingCashierForPerms,
                        permissions: {
                          ...editingCashierForPerms.permissions,
                          canRedeemRewards: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>صلاحية صرف واستبدال المكافآت</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer font-medium text-slate-700 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={editingCashierForPerms.permissions?.canViewHistory ?? true}
                    onChange={(e) =>
                      setEditingCashierForPerms({
                        ...editingCashierForPerms,
                        permissions: {
                          ...editingCashierForPerms.permissions,
                          canViewHistory: e.target.checked,
                        },
                      })
                    }
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>صلاحية عرض سجل العمليات</span>
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm shadow-blue-600/20"
                >
                  حفظ الصلاحيات المحدثة
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCashierForPerms(null)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
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

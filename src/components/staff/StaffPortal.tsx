import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useWafa } from '../../context/WafaContext';
import {
  Users,
  Search,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  Gift,
  Plus,
  Receipt,
  Car,
  Home,
  Scissors,
  Coffee,
  Sparkles,
  ShieldCheck,
  Building,
  KeyRound,
  Check,
  UserCheck,
  Phone,
  Clock,
  ChevronRight,
  RefreshCw,
  Award,
  Tag,
  MessageCircle,
} from 'lucide-react';
import { Customer, CustomerCard } from '../../types';

export const StaffPortal: React.FC = () => {
  const {
    currentStaff,
    currentMerchant,
    currentProgram,
    session,
    staff,
    merchants,
    setActiveStaffId,
    setActiveMerchantId,
    customers,
    customerCards,
    transactions,
    addCustomerVisit,
    redeemReward,
    findCustomerByQuery,
  } = useWafa();

  // Mode: 'quick-register' (Direct shop logging) vs 'search-qr'
  const [activeTab, setActiveTab] = useState<'direct-register' | 'search-qr' | 'rewards'>('direct-register');

  // Input states for direct shop registration & visit logging
  const [inputPhone, setInputPhone] = useState('');
  const [inputName, setInputName] = useState('');
  
  // Sector-specific inputs
  const [inputCarPlate, setInputCarPlate] = useState('');
  const [inputBookingRef, setInputBookingRef] = useState('');
  const [inputServiceType, setInputServiceType] = useState('');
  const [inputInvoiceRef, setInputInvoiceRef] = useState('');
  const [inputNotes, setInputNotes] = useState('');

  // Search input for Search/QR tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerCard, setSelectedCustomerCard] = useState<CustomerCard | null>(null);

  // Redemption form inputs
  const [redeemInputCode, setRedeemInputCode] = useState('');
  const [selectedRewardId, setSelectedRewardId] = useState('');

  // Bypass cooldown (manager only)
  const [bypassCooldown, setBypassCooldown] = useState(false);

  // Result / alert feedback
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error' | 'warning';
    title?: string;
    message: string;
  } | null>(null);

  // QR Camera scanner simulation
  const [scannerActive, setScannerActive] = useState(false);

  // Active branch
  const activeBranch =
    currentMerchant?.branches?.find((b) => b.id === currentStaff?.branchId) ||
    currentMerchant?.branches?.[0] || {
      id: currentStaff?.branchId || 'main',
      merchantId: currentMerchant?.id || '',
      name: 'الفرع الرئيسي',
      city: currentMerchant?.city || 'الخرج',
      district: 'الرئيسي',
      phone: currentMerchant?.phone || '0500000000',
    };

  // Detect merchant sector
  const sector = useMemo(() => {
    if (!currentMerchant) return 'general';
    const cat = currentMerchant.categoryId.toLowerCase();
    if (cat.includes('car-wash') || cat.includes('wash') || cat.includes('مغاسل')) return 'car-wash';
    if (cat.includes('chalet') || cat.includes('استراحات') || cat.includes('شاليه')) return 'chalets';
    if (
      cat.includes('barber') ||
      cat.includes('salon') ||
      cat.includes('حلاق') ||
      cat.includes('مشغل') ||
      cat.includes('personal-care')
    )
      return 'salon';
    if (cat.includes('cafe') || cat.includes('restaurant') || cat.includes('مطعم') || cat.includes('كافيه'))
      return 'cafe-restaurant';
    return 'general';
  }, [currentMerchant]);

  // Quick service presets for salon / barber
  const salonPresets = [
    'حلاقة شعر وذقن',
    'حلاقة ذقن + بخار',
    'قص وتسريح استشوار',
    'صبغة ومعالجة بروتين',
    'تنظيف وبدكير',
    'مكياج سهرة كامل',
  ];

  // Auto-lookup existing customer live as employee types 10-digit mobile number
  useEffect(() => {
    const cleaned = inputPhone.trim();
    if (cleaned.length >= 9) {
      const match = customers.find(
        (c) => c.phone.replace(/\D/g, '') === cleaned.replace(/\D/g, '')
      );
      if (match) {
        if (!inputName) setInputName(match.name);
        if (match.carPlate && !inputCarPlate) setInputCarPlate(match.carPlate);
        
        if (currentMerchant) {
          const card = customerCards.find(
            (c) => c.customerId === match.id && c.merchantId === currentMerchant.id
          );
          setSelectedCustomer(match);
          setSelectedCustomerCard(card || null);
        }
      } else {
        // If changing phone to something not found, clear selected
        if (selectedCustomer && selectedCustomer.phone !== cleaned) {
          setSelectedCustomer(null);
          setSelectedCustomerCard(null);
        }
      }
    }
  }, [inputPhone, customers, currentMerchant, customerCards]);

  // Keep selected customer card updated
  useEffect(() => {
    if (selectedCustomer && currentMerchant) {
      const card = customerCards.find(
        (c) => c.customerId === selectedCustomer.id && c.merchantId === currentMerchant.id
      );
      setSelectedCustomerCard(card || null);
    }
  }, [customerCards, selectedCustomer, currentMerchant]);

  // Handle direct registration & visit stamp from Cashier
  const handleDirectRegisterAndStamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMerchant || !currentStaff) return;

    setFeedback(null);

    const cleanPhone = inputPhone.trim();
    if (!cleanPhone || cleanPhone.length < 9) {
      setFeedback({
        type: 'error',
        title: 'رقم الجوال غير صحيح',
        message: 'يرجى إدخال رقم جوال العميل المكون من 10 أرقام (مثال: 05XXXXXXXX).',
      });
      return;
    }

    // Sector specific defaults if left empty
    const resolvedCarPlate = sector === 'car-wash' ? (inputCarPlate.trim() || undefined) : undefined;
    const resolvedBookingRef = sector === 'chalets' ? (inputBookingRef.trim() || undefined) : undefined;
    const resolvedServiceType = sector === 'salon' ? (inputServiceType.trim() || 'خدمة عامة') : undefined;

    // Cashier permission check
    if (currentStaff.permissions?.canAddVisits === false) {
      setFeedback({
        type: 'error',
        title: 'صلاحية غير مسموحة',
        message: 'ليس لديك صلاحية إضافة زيارات للعملاء. يرجى مراجعة التاجر لمنحك الصلاحية.',
      });
      return;
    }

    if (!selectedCustomer && currentStaff.permissions?.canRegisterCustomers === false) {
      setFeedback({
        type: 'error',
        title: 'صلاحية غير مسموحة',
        message: 'ليس لديك صلاحية تسجيل عملاء جدد في النظام. يرجى مراجعة التاجر لمنحك الصلاحية.',
      });
      return;
    }

    // Sync and validate on server
    fetch('/api/staff/record-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchantId: currentMerchant.id,
        staffId: currentStaff.id,
        branchId: activeBranch?.id || 'main',
        customerPhone: cleanPhone,
        customerName: inputName.trim() || undefined,
        carPlate: resolvedCarPlate,
        bookingRef: resolvedBookingRef,
        serviceType: resolvedServiceType,
        invoiceRef: sector === 'cafe-restaurant' || sector === 'general' ? inputInvoiceRef.trim() : undefined,
        cooldownMinutes: currentProgram?.antiCheatCooldownMinutes || 30,
        bypassCooldown,
      }),
    }).catch((e) => console.log('Server sync:', e));

    const res = addCustomerVisit({
      merchantId: currentMerchant.id,
      staffId: currentStaff.id,
      branchId: activeBranch?.id || 'main',
      customerPhone: cleanPhone,
      customerName: inputName.trim() || undefined,
      carPlate: resolvedCarPlate,
      bookingRef: resolvedBookingRef,
      serviceType: resolvedServiceType,
      invoiceRef: sector === 'cafe-restaurant' || sector === 'general' ? inputInvoiceRef.trim() : undefined,
      notes: inputNotes.trim() || undefined,
      bypassCooldown,
    });

    if (res.success) {
      if (res.rewardEarned) {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#059669', '#10b981', '#f59e0b', '#06b6d4'],
        });
      }
      setFeedback({
        type: 'success',
        title: res.rewardEarned ? '🎉 مبروك! استحق العميل مكافأة!' : 'تم تسجيل الزيارة بنجاح!',
        message: res.message,
      });

      // Clear non-persistent fields
      setInputInvoiceRef('');
      setInputBookingRef('');
      setInputNotes('');
      setBypassCooldown(false);

      // Select new/updated customer for quick viewing
      const refreshed = findCustomerByQuery(cleanPhone);
      if (refreshed) {
        setSelectedCustomer(refreshed.customer);
        setSelectedCustomerCard(refreshed.card || null);
      }
    } else {
      setFeedback({
        type: 'error',
        title: 'تعذر إتمام التسجيل',
        message: res.message,
      });
    }
  };

  // Search by query (code, phone, name)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (!searchQuery.trim()) return;

    const result = findCustomerByQuery(searchQuery);
    if (result) {
      setSelectedCustomer(result.customer);
      setSelectedCustomerCard(result.card || null);
      setInputPhone(result.customer.phone);
      setInputName(result.customer.name);
      if (result.customer.carPlate) setInputCarPlate(result.customer.carPlate);
      setSearchQuery('');
    } else {
      setFeedback({
        type: 'warning',
        title: 'عميل غير مسجل مسبقاً',
        message: `العميل (${searchQuery}) غير مسجل. يمكنك كتابة رقم جواله في تبويب "تسجيل فوري من المحل" وسيحصل على بطاقة ولاء فورية وزيارة مسجلة!`,
      });
    }
  };

  // Simulate QR Code scanning
  const handleScanSampleQr = (sampleCode: string) => {
    setScannerActive(false);
    const res = findCustomerByQuery(sampleCode);
    if (res) {
      setSelectedCustomer(res.customer);
      setSelectedCustomerCard(res.card || null);
      setInputPhone(res.customer.phone);
      setInputName(res.customer.name);
      if (res.customer.carPlate) setInputCarPlate(res.customer.carPlate);
      setFeedback({
        type: 'success',
        title: 'تم مسح رمز QR بنجاح',
        message: `تم التعرف على بطاقة العميل: ${res.customer.name} (${res.customer.phone})`,
      });
    }
  };

  // Process Reward Redemption
  const handleRedeemReward = (rewardId: string, expectedCode: string) => {
    if (!currentStaff || !selectedCustomerCard || !currentMerchant) return;

    // Check cashier permission
    if (currentStaff.permissions?.canRedeemRewards === false) {
      setFeedback({
        type: 'error',
        title: 'صلاحية غير مسموحة',
        message: 'ليس لديك صلاحية استبدال وصرف المكافآت. يرجى مراجعة التاجر لمنحك الصلاحية.',
      });
      return;
    }

    const codeToUse = redeemInputCode.trim() || expectedCode;

    // Sync with server
    fetch('/api/staff/redeem-reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        staffId: currentStaff.id,
        rewardId,
        redeemCode: codeToUse,
        merchantId: currentMerchant.id,
      }),
    }).catch((e) => console.log('Server redeem sync:', e));

    const res = redeemReward({
      cardId: selectedCustomerCard.id,
      rewardId,
      redeemCode: codeToUse,
      staffId: currentStaff.id,
      branchId: activeBranch?.id || 'main',
    });

    if (res.success) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });
      setFeedback({
        type: 'success',
        title: 'تم استبدال المكافأة بنجاح!',
        message: res.message,
      });
      setRedeemInputCode('');
      setSelectedRewardId('');
    } else {
      setFeedback({
        type: 'error',
        title: 'تعذر صرف المكافأة',
        message: res.message,
      });
    }
  };

  if (!currentStaff || !currentMerchant || !currentProgram) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
          <KeyRound className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-slate-800">بوابة كاشير المحل - منصة وفاء</h3>
        <p className="text-xs text-slate-500 mt-2">يرجى تسجيل الدخول بحساب موظف معتمد لنقطة البيع.</p>
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('wafa-open-login', { detail: { tab: 'staff' } }));
          }}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
        >
          <KeyRound className="w-4 h-4" />
          <span>تسجيل دخول الكاشير</span>
        </button>
      </div>
    );
  }

  // If cashier account is disabled by merchant
  if (currentStaff.isActive === false) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black mb-3">
          حساب الكاشير معطل حالياً
        </div>
        <h3 className="text-lg font-black text-slate-800">تم إيقاف صلاحيات الدخول لنقطة البيع</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">
          تم تعطيل حسابك ({currentStaff.name} - @{currentStaff.username || 'cashier'}) من قِبل إدارة متجر ({currentMerchant.businessName}).
        </p>
        <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
          يرجى التواصل مع التاجر المسؤول لإعادة تفعيل الحساب من لوحة تحكم التاجر.
        </div>
      </div>
    );
  }

  // Today's transactions for this cashier
  const shiftTxs = transactions.filter(
    (tx) => tx.staffId === currentStaff.id && tx.merchantId === currentMerchant.id
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28 pt-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        
        {/* Security & Multi-Tenant Isolation Banner or Preview Selector */}
        {session?.role === 'staff' ? (
          <div className="rounded-2xl bg-emerald-50/90 border border-emerald-200 p-3 px-4 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>نقطة بيع معتمدة ومحمية لنشاط: <strong>{currentMerchant.businessName}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-emerald-800 font-semibold">
              <span>الفرع: <strong>{activeBranch?.name || 'الفرع الرئيسي'}</strong></span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-2.5 px-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>تجربة شاشة الكاشير في الأنشطة المختلفة (معاينة):</span>
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {staff.map((st) => {
                const m = merchants.find((item) => item.id === st.merchantId);
                const isCurrent = st.id === currentStaff.id;
                let icon = Car;
                if (m?.categoryId.includes('chalet')) icon = Home;
                if (m?.categoryId.includes('barber') || m?.categoryId.includes('salon')) icon = Scissors;
                if (m?.categoryId.includes('cafe')) icon = Coffee;
                const IconComp = icon;

                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setActiveStaffId(st.id);
                      if (m) setActiveMerchantId(m.id);
                      setFeedback(null);
                      setSelectedCustomer(null);
                      setSelectedCustomerCard(null);
                      setInputPhone('');
                      setInputName('');
                      setInputCarPlate('');
                      setInputBookingRef('');
                      setInputServiceType('');
                      setInputInvoiceRef('');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      isCurrent
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                    <span>{m?.businessName.split(' ')[0]} ({st.name.split(' ')[0]})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Top Cashier Header & Permissions Notice */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-bold">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-slate-900">{currentStaff.name}</span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md" dir="ltr">
                  @{currentStaff.username || 'cashier'}
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {currentStaff.role === 'manager' ? 'مدير الفرع' : 'كاشير معتمد'}
                </span>
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{currentMerchant.businessName}</span>
                </div>
                <span>•</span>
                <span className="text-slate-600 font-medium">{activeBranch?.name}</span>
              </div>
              {/* Permissions summary pills */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] font-bold">
                <span className="text-slate-500 font-semibold">الصلاحيات:</span>
                <span className={`px-2 py-0.5 rounded-md ${currentStaff.permissions?.canAddVisits !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 line-through'}`}>
                  إضافة زيارات
                </span>
                <span className={`px-2 py-0.5 rounded-md ${currentStaff.permissions?.canRegisterCustomers !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-400 line-through'}`}>
                  تسجيل عملاء
                </span>
                <span className={`px-2 py-0.5 rounded-md ${currentStaff.permissions?.canRedeemRewards !== false ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-400 line-through'}`}>
                  صرف مكافآت
                </span>
                <span className={`px-2 py-0.5 rounded-md ${currentStaff.permissions?.canViewHistory !== false ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-slate-100 text-slate-400 line-through'}`}>
                  عرض السجل
                </span>
              </div>
            </div>
          </div>

          {/* Quick Shift Summary Stats */}
          <div className="flex items-center gap-4 text-xs bg-slate-50 p-2.5 px-4 rounded-2xl border border-slate-200">
            <div className="text-center px-1">
              <div className="text-[10px] text-slate-500 font-medium">عملياتك اليوم</div>
              <div className="text-base font-black text-emerald-700 font-mono">
                {shiftTxs.filter((t) => t.type === 'visit_added' || t.type === 'reward_earned').length}
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div className="text-center px-1">
              <div className="text-[10px] text-slate-500 font-medium">مكافآت معتمدة</div>
              <div className="text-base font-black text-amber-700 font-mono">
                {shiftTxs.filter((t) => t.type === 'reward_redeemed').length}
              </div>
            </div>
          </div>
        </div>

        {/* Sector Indicator Card */}
        <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white border border-emerald-300 text-emerald-700 flex items-center justify-center shrink-0">
              {sector === 'car-wash' && <Car className="w-4 h-4" />}
              {sector === 'chalets' && <Home className="w-4 h-4" />}
              {sector === 'salon' && <Scissors className="w-4 h-4" />}
              {sector === 'cafe-restaurant' && <Coffee className="w-4 h-4" />}
              {sector === 'general' && <Award className="w-4 h-4" />}
            </div>
            <div>
              <div className="font-bold text-emerald-950">
                {sector === 'car-wash' && 'نظام مغاسل السيارات: رقم الجوال + رقم لوحة السيارة'}
                {sector === 'chalets' && 'نظام الشاليهات والاستراحات: رقم الجوال + رقم الحجز'}
                {sector === 'salon' && 'نظام الصالونات والمشاغل: رقم الجوال + نوع الخدمة'}
                {sector === 'cafe-restaurant' && 'نظام المطاعم والمقاهي: رقم الجوال + رقم الفاتورة'}
                {sector === 'general' && 'نظام ولاء المحل: رقم الجوال + رقم الفاتورة'}
              </div>
              <div className="text-[11px] text-emerald-800">
                برنامج الولاء: كل {currentProgram.targetVisits} {currentProgram.unitName} تمنح مكافأة ({currentProgram.rewardTitle})
              </div>
            </div>
          </div>

          <div className="text-[11px] font-medium text-slate-600 bg-white/80 px-3 py-1 rounded-lg border border-emerald-200">
            فترة حماية التكرار: {currentProgram.antiCheatCooldownMinutes} دقيقة
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('direct-register')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'direct-register'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>تسجيل عميل وزيارة من المحل</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('search-qr')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'search-qr'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>البحث أو مسح QR كود</span>
          </button>

          {selectedCustomerCard && selectedCustomerCard.unclaimedRewards.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-colors cursor-pointer flex items-center gap-2 animate-bounce ${
                activeTab === 'rewards'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>مكافآت جاهزة للصرف ({selectedCustomerCard.unclaimedRewards.filter((r) => !r.isRedeemed).length})</span>
            </button>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-4 rounded-2xl text-xs flex items-start gap-3 shadow-xs animate-in fade-in ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                : feedback.type === 'error'
                ? 'bg-rose-50 border border-rose-300 text-rose-950'
                : 'bg-amber-50 border border-amber-300 text-amber-950'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            )}
            <div className="flex-1 space-y-1">
              {feedback.title && <div className="font-bold text-sm">{feedback.title}</div>}
              <div className="leading-relaxed font-medium">{feedback.message}</div>

              {feedback.type === 'success' && selectedCustomer && (
                <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    أرسل إشعار الزيارة وبطاقة الولاء لجوال العميل عبر الواتساب فوراً:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const clean = selectedCustomer.phone.replace(/\D/g, '');
                      const intlPhone = clean.startsWith('05') ? '966' + clean.slice(1) : clean;
                      const cardUrl = `${window.location.origin}/?phone=${selectedCustomer.phone}&merchant=${currentMerchant.id}`;
                      const currentV = selectedCustomerCard?.currentVisits || 1;
                      const text = encodeURIComponent(
                        `مرحباً ${selectedCustomer.name}! شرفتنا اليوم بزيارتك لـ ${currentMerchant.businessName} 🚗✨.\nرصيدك الحالي: ${currentV} من ${currentProgram.targetVisits} ${currentProgram.unitName}.\nالمكافأة القادمة: ${currentProgram.rewardTitle}.\n\nتفضل بمشاهدة بطاقتك ومكافآتك عبر الرابط:\n${cardUrl}`
                      );
                      window.open(`https://wa.me/${intlPhone}?text=${text}`, '_blank');
                    }}
                    className="py-1.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>إرسال إشعار للعميل بالواتساب 📲</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 1: Direct Shop Registration & Visit Stamping */}
        {activeTab === 'direct-register' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  <span>تسجيل الزيارة أو العميل مباشرة من المحل</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  أدخل رقم الجوال والبيانات الخاصة بالنشاط؛ إذا كان العميل جديداً سيتم إنشاء بطاقته فوراً، وإذا كان مسجلاً ستضاف الزيارة فوراً.
                </p>
              </div>

              {selectedCustomer && (
                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs text-emerald-900 font-bold">
                  عميل معروف: {selectedCustomer.name} ({selectedCustomerCard?.currentVisits || 0}/{currentProgram.targetVisits})
                </div>
              )}
            </div>

            <form onSubmit={handleDirectRegisterAndStamp} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Mobile Phone Input (Common to ALL categories) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                    <span>رقم جوال العميل *</span>
                    <span className="text-[11px] text-emerald-700 font-normal">الرقم هو مفتاح بطاقة الولاء</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={inputPhone}
                      onChange={(e) => setInputPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 pr-10 pl-4 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                </div>

                {/* Optional Customer Name */}
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between mb-1.5">
                    <span>اسم العميل</span>
                    <span className="text-[11px] text-slate-400 font-normal">اختياري (يظهر على البطاقة)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: سعود الشمري"
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>

                {/* 2. DYNAMIC FIELD: Car Wash -> Plate Number */}
                {sector === 'car-wash' && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-2">
                    <label className="text-xs font-black text-sky-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Car className="w-4 h-4 text-sky-700" />
                        <span>رقم لوحة السيارة * (خاص بمغاسل السيارات)</span>
                      </span>
                      <span className="text-[11px] text-sky-700 font-medium">لمنع تسجيل زيارات وهمية أو تغيير السيارات</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="مثال: أ ب ج 1234 أو 4521 د س ر"
                        value={inputCarPlate}
                        onChange={(e) => setInputCarPlate(e.target.value)}
                        className="w-full bg-white border border-sky-300 rounded-xl py-3 pr-4 pl-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-600 transition-colors shadow-2xs"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-sky-800 pt-1">
                      <span>لوحات شائعة للتجربة:</span>
                      <button
                        type="button"
                        onClick={() => setInputCarPlate('أ ب ج 1234')}
                        className="px-2 py-0.5 rounded-md bg-white border border-sky-200 font-mono hover:bg-sky-100 cursor-pointer"
                      >
                        أ ب ج 1234
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputCarPlate('د هـ و 7788')}
                        className="px-2 py-0.5 rounded-md bg-white border border-sky-200 font-mono hover:bg-sky-100 cursor-pointer"
                      >
                        د هـ و 7788
                      </button>
                    </div>
                  </div>
                )}

                {/* 3. DYNAMIC FIELD: Chalets -> Booking Ref */}
                {sector === 'chalets' && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <label className="text-xs font-black text-amber-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Home className="w-4 h-4 text-amber-700" />
                        <span>رقم الحجز المؤكد * (خاص بالشاليهات والاستراحات)</span>
                      </span>
                      <span className="text-[11px] text-amber-700 font-medium">ربط الزيارة بحجز حقيقي مسجل</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: CH-8821 أو رقم عقد الإيجار اليومي"
                      value={inputBookingRef}
                      onChange={(e) => setInputBookingRef(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded-xl py-3 px-4 text-sm font-bold font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 transition-colors shadow-2xs"
                    />
                    <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-800 pt-1">
                      <span>أرقام حجز سريعة:</span>
                      <button
                        type="button"
                        onClick={() => setInputBookingRef('CH-9021')}
                        className="px-2 py-0.5 rounded-md bg-white border border-amber-200 font-mono hover:bg-amber-100 cursor-pointer"
                      >
                        CH-9021
                      </button>
                      <button
                        type="button"
                        onClick={() => setInputBookingRef('RES-4432')}
                        className="px-2 py-0.5 rounded-md bg-white border border-amber-200 font-mono hover:bg-amber-100 cursor-pointer"
                      >
                        RES-4432
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. DYNAMIC FIELD: Barber & Salon -> Service Type */}
                {sector === 'salon' && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2.5">
                    <label className="text-xs font-black text-purple-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-purple-700" />
                        <span>نوع الخدمة المقدمة * (خاص بالحلاقين والمشاغل)</span>
                      </span>
                      <span className="text-[11px] text-purple-700 font-medium">لتحديد الخدمة التي استحق عليها الختم</span>
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="اكتب نوع الخدمة أو اختر من الخيارات السريعة أدناه"
                      value={inputServiceType}
                      onChange={(e) => setInputServiceType(e.target.value)}
                      className="w-full bg-white border border-purple-300 rounded-xl py-3 px-4 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 transition-colors shadow-2xs"
                    />

                    {/* Quick service selector buttons */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {salonPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setInputServiceType(preset)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                            inputServiceType === preset
                              ? 'bg-purple-600 text-white border-purple-600 font-bold'
                              : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. DYNAMIC FIELD: Cafe/Restaurant -> Invoice Number */}
                {(sector === 'cafe-restaurant' || sector === 'general') && (
                  <div className="md:col-span-2 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <label className="text-xs font-black text-emerald-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Coffee className="w-4 h-4 text-emerald-700" />
                        <span>رقم الفاتورة أو الإيصال (خاص بالمطاعم والمقاهي)</span>
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium">توثيق العملية المحاسبية</span>
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: INV-9041 أو رقم طلب الكاشير"
                      value={inputInvoiceRef}
                      onChange={(e) => setInputInvoiceRef(e.target.value)}
                      className="w-full bg-white border border-emerald-300 rounded-xl py-3 px-4 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 transition-colors shadow-2xs"
                    />
                  </div>
                )}

                {/* Extra Notes */}
                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    ملاحظات الموظف على الزيارة (اختياري)
                  </label>
                  <input
                    type="text"
                    placeholder="ملاحظة داخلية تفيد المحل..."
                    value={inputNotes}
                    onChange={(e) => setInputNotes(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl py-2 px-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Anti-cheat cooldown notice and manager override */}
              <div className="pt-2 pb-1 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>تطبيق نظام منع تكرار الزيارة والتلاعب (فترة انتظار {currentProgram.antiCheatCooldownMinutes} دقيقة)</span>
                </div>

                {currentStaff.role === 'manager' && (
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    <input
                      type="checkbox"
                      checked={bypassCooldown}
                      onChange={(e) => setBypassCooldown(e.target.checked)}
                      className="rounded bg-white border-slate-300 text-emerald-600"
                    />
                    <span>تجاوز فترة الأمان (صلاحية مدير)</span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              {currentStaff.permissions?.canAddVisits === false ? (
                <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-500 text-xs font-bold text-center border border-slate-200">
                  ⚠️ حساب الكاشير الحالي ليس لديه صلاحية تسجيل زيارات.
                </div>
              ) : !selectedCustomer && currentStaff.permissions?.canRegisterCustomers === false ? (
                <div className="p-3.5 rounded-2xl bg-slate-100 text-slate-500 text-xs font-bold text-center border border-slate-200">
                  ⚠️ حساب الكاشير الحالي ليس لديه صلاحية تسجيل عملاء جدد.
                </div>
              ) : (
                <button
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.005]"
                >
                  <Plus className="w-5 h-5" />
                  <span>
                    {selectedCustomer
                      ? `تسجيل الزيارة للعميل (${selectedCustomer.name}) +1 ${currentProgram.unitName}`
                      : `تسجيل العميل وإصدار بطاقة ولاء فوراً (+1 ${currentProgram.unitName})`}
                  </span>
                </button>
              )}
            </form>

            {/* If a customer is active, show their visual stamp card right away */}
            {selectedCustomer && selectedCustomerCard && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>بطاقة ولاء {selectedCustomer.name}:</span>
                  <span className="text-emerald-700 font-black">
                    {selectedCustomerCard.currentVisits} من {currentProgram.targetVisits} {currentProgram.unitName}
                  </span>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {Array.from({ length: currentProgram.targetVisits }).map((_, idx) => {
                    const currentCount = selectedCustomerCard.currentVisits;
                    const isDone = idx < currentCount;
                    const isReward = idx === currentProgram.targetVisits - 1;

                    return (
                      <div
                        key={idx}
                        className={`h-12 rounded-xl flex flex-col items-center justify-center border text-xs font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 text-white" /> : <span>{idx + 1}</span>}
                        <span className="text-[9px] font-normal mt-0.5">
                          {isReward ? 'المكافأة' : `${currentProgram.unitName}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Search or QR Code Scan */}
        {activeTab === 'search-qr' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>البحث عن العميل أو مسح بطاقته الرقمية</span>
              <span className="text-slate-500 text-[11px] font-medium">أدخل رقم الجوال أو كود العميل</span>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث برقم الجوال (05XXXXXXXX) أو كود WAFA-..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl py-3 pr-10 pl-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shrink-0 shadow-xs"
              >
                بحث
              </button>

              <button
                type="button"
                onClick={() => setScannerActive(!scannerActive)}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                title="محاكي كاميرا مسح QR"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">مسح QR</span>
              </button>
            </form>

            {/* Quick preset buttons */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-500">
              <span>عملاء تجريبيون جاهزون:</span>
              <button
                type="button"
                onClick={() => {
                  const res = findCustomerByQuery('0551234567');
                  if (res) {
                    setSelectedCustomer(res.customer);
                    setSelectedCustomerCard(res.card || null);
                    setInputPhone(res.customer.phone);
                    setInputName(res.customer.name);
                    if (res.customer.carPlate) setInputCarPlate(res.customer.carPlate);
                    setActiveTab('direct-register');
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-mono font-bold transition-colors cursor-pointer border border-emerald-200"
              >
                سعود (0551234567) - 4 زيارات
              </button>
              <button
                type="button"
                onClick={() => {
                  const res = findCustomerByQuery('0509876543');
                  if (res) {
                    setSelectedCustomer(res.customer);
                    setSelectedCustomerCard(res.card || null);
                    setInputPhone(res.customer.phone);
                    setInputName(res.customer.name);
                    setActiveTab('direct-register');
                  }
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors cursor-pointer border border-slate-200"
              >
                عبدالله (0509876543)
              </button>
            </div>

            {/* Scanner Drawer */}
            {scannerActive && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-emerald-300 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
                  <QrCode className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-900">محاكي ماسح QR Code السريع للكاشير</h5>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    انقر على أحد الأكواد التالية لمحاكاة قراءة كود بطاقة العميل الرقمية فوراً:
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleScanSampleQr('WAFA-7701')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-mono font-bold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    مسح كود: WAFA-7701 (سعود)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScanSampleQr('WAFA-7702')}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-mono font-bold border border-slate-200 transition-colors cursor-pointer shadow-2xs"
                  >
                    مسح كود: WAFA-7702 (عبدالله)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Reward Redemption Panel */}
        {selectedCustomerCard && selectedCustomerCard.unclaimedRewards.length > 0 && (
          <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50/70 border border-amber-300 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 text-amber-950 font-black text-sm">
                <Gift className="w-5 h-5 text-amber-600" />
                <span>مكافآت مستحقة للعميل ({selectedCustomer?.name}) جاهزة للصرف والتسليم</span>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-1 rounded-full">
                كود العميل: {selectedCustomer?.customerCode}
              </span>
            </div>

            <div className="space-y-3">
              {selectedCustomerCard.unclaimedRewards
                .filter((r) => !r.isRedeemed)
                .map((reward) => (
                  <div
                    key={reward.id}
                    className="p-4 rounded-2xl bg-white border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-2xs"
                  >
                    <div>
                      <div className="font-black text-slate-900 text-sm">{reward.title}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        كود المكافأة الرسمي: <strong className="text-amber-800 text-xs">{reward.redeemCode}</strong>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        استحقت بتاريخ: {new Date(reward.earnedAt).toLocaleDateString('ar-SA')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="كود المكافأة"
                        value={selectedRewardId === reward.id ? redeemInputCode : ''}
                        onChange={(e) => {
                          setSelectedRewardId(reward.id);
                          setRedeemInputCode(e.target.value);
                        }}
                        className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono uppercase focus:outline-none focus:border-amber-500 w-32 text-center font-bold"
                      />

                      {currentStaff.permissions?.canRedeemRewards === false ? (
                        <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-xl">
                          صلاحية صرف المكافآت مقيدة
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRedeemReward(reward.id, reward.redeemCode)}
                          className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>اعتماد وصرف المكافأة</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Shift Transaction History */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>سجل العمليات المسجلة في ورديتك اليوم ({currentMerchant.businessName})</span>
            </span>
            <span className="text-slate-500 text-[11px] font-mono font-medium">
              {currentStaff.permissions?.canViewHistory === false ? 'غير مصرح' : `${shiftTxs.length} عملية مسجلة`}
            </span>
          </div>

          {currentStaff.permissions?.canViewHistory === false ? (
            <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
              🔒 تم حجب سجل العمليات بناءً على صلاحيات حساب الكاشير المحددة من التاجر.
            </div>
          ) : shiftTxs.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              لم تسجل أي عمليات في هذه الوردية بعد. ابدأ بتسجيل أول عميل أو زيارة بالأعلى!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {shiftTxs.slice(0, 10).map((tx) => (
                <div
                  key={tx.id}
                  className="py-3 text-xs flex flex-wrap items-center justify-between gap-3 hover:bg-slate-50/50 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        tx.type === 'reward_redeemed'
                          ? 'bg-amber-500'
                          : tx.type === 'reward_earned'
                          ? 'bg-teal-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{tx.customerName}</span>
                        <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                          {tx.customerPhone}
                        </span>
                      </div>

                      {/* Display sector-specific tag: Plate, Booking, Service, or Invoice */}
                      <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 mt-0.5 font-medium">
                        <span className="font-semibold text-slate-700">
                          {tx.type === 'reward_redeemed'
                            ? 'صرف مكافأة'
                            : tx.type === 'reward_earned'
                            ? `استحقاق مكافأة (+${tx.visitIncrement})`
                            : `زيارة مؤهلة (+${tx.visitIncrement})`}
                        </span>

                        {tx.carPlate && (
                          <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                            <Car className="w-3 h-3" />
                            لوحة: {tx.carPlate}
                          </span>
                        )}

                        {tx.bookingRef && (
                          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                            <Home className="w-3 h-3" />
                            حجز: {tx.bookingRef}
                          </span>
                        )}

                        {tx.serviceType && (
                          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                            <Scissors className="w-3 h-3" />
                            خدمة: {tx.serviceType}
                          </span>
                        )}

                        {tx.invoiceRef && (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-md font-mono text-[10px]">
                            <Receipt className="w-3 h-3" />
                            فاتورة: {tx.invoiceRef}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 font-mono">
                      {new Date(tx.createdAt).toLocaleTimeString('ar-SA', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

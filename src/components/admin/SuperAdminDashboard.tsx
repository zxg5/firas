import React, { useState } from 'react';
import { useWafa } from '../../context/WafaContext';
import {
  ShieldAlert,
  Store,
  Users,
  CreditCard,
  Layers,
  Activity,
  CheckCircle2,
  XCircle,
  Edit2,
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Award,
  AlertTriangle,
  HelpCircle,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Mail,
  Check,
  UserPlus,
  ShieldCheck,
  Key,
  Lock,
  Trash2,
  Eye,
  Settings,
  Copy,
  ExternalLink,
  Rocket,
} from 'lucide-react';
import { PricingPlan, BusinessCategory, AdminPermissionSet, Merchant } from '../../types';
import { ProductionLaunchCenter } from './ProductionLaunchCenter';

export const SuperAdminDashboard: React.FC = () => {
  const {
    merchants,
    customers,
    customerCards,
    transactions,
    plans,
    categories,
    auditLogs,
    industrySuggestions,
    adminTeam,
    supportContact,
    session,
    approveMerchant,
    rejectMerchant,
    toggleMerchantStatus,
    updateMerchantPlan,
    updatePricingPlan,
    addCategory,
    updateCategory,
    deleteMerchant,
    createMerchantByAdmin,
    impersonateMerchant,
    updateSupportContact,
    addAdminTeamMember,
    updateAdminTeamMember,
    deleteAdminTeamMember,
    changeAdminPassword,
    updateIndustrySuggestionStatus,
    approveAndCreateCategoryFromSuggestion,
    resetAllData,
  } = useWafa();

  // Active view tab
  const [activeTab, setActiveTab] = useState<
    'merchants' | 'plans' | 'categories' | 'suggestions' | 'admin_team' | 'owner_settings' | 'stats' | 'audit' | 'launch_readiness'
  >('merchants');
  const [suggestionFilter, setSuggestionFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [approvedNotification, setApprovedNotification] = useState<string | null>(null);

  // Add Admin Staff State
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPhone, setNewAdminPhone] = useState('0534067866');
  const [newAdminPassword, setNewAdminPassword] = useState('Admin@123456');
  const [newAdminRoleTitle, setNewAdminRoleTitle] = useState('مشرف عمليات وتجار');
  const [newAdminPerms, setNewAdminPerms] = useState<AdminPermissionSet>({
    canManageMerchants: true,
    canManagePlans: false,
    canManageCategories: true,
    canManageSuggestions: true,
    canManageStaff: false,
    canViewAudit: true,
    canManageSettings: false,
  });

  // Add Merchant Direct State
  const [showAddMerchantModal, setShowAddMerchantModal] = useState(false);
  const [newMName, setNewMName] = useState('');
  const [newMCity, setNewMCity] = useState('الخرج');
  const [newMCat, setNewMCat] = useState('car-wash');
  const [newMPhone, setNewMPhone] = useState('0550000000');
  const [newMEmail, setNewMEmail] = useState('');
  const [newMPassword, setNewMPassword] = useState('Merchant@123456');
  const [newMPlan, setNewMPlan] = useState<'basic' | 'plus' | 'pro'>('plus');

  // Password & Settings State
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [passMessage, setPassMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedPass, setCopiedPass] = useState(false);

  // Support phone & contact form
  const [supportPhoneInput, setSupportPhoneInput] = useState(supportContact.phone);
  const [supportEmailInput, setSupportEmailInput] = useState(supportContact.email);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  // Search filter for merchants
  const [merchantSearch, setMerchantSearch] = useState('');
  const [selectedCityFilter, setSelectedCityFilter] = useState('all');

  // Editing Plan state
  const [editingPlanId, setEditingPlanId] = useState<'basic' | 'plus' | 'pro' | null>(null);
  const [editPriceMonthly, setEditPriceMonthly] = useState<number>(0);
  const [editPriceAnnual, setEditPriceAnnual] = useState<number>(0);
  const [editFeatures, setEditFeatures] = useState<string>('');

  // Add Category Modal / State
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatUnit, setNewCatUnit] = useState('زيارة');
  const [newCatTarget, setNewCatTarget] = useState(5);
  const [newCatReward, setNewCatReward] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Merchant Approval with Commercial Reg State (إضافة السجل التجاري / وثيقة العمل الحر عند الاعتماد)
  const [approvingMerchant, setApprovingMerchant] = useState<Merchant | null>(null);
  const [approvalCrNumber, setApprovalCrNumber] = useState('');
  const [cardCrInputs, setCardCrInputs] = useState<{ [id: string]: string }>({});

  const handleConfirmApproval = async (m: Merchant, crValue?: string) => {
    const finalCr = crValue !== undefined ? crValue : approvalCrNumber;
    const res = await approveMerchant(m.id, finalCr);
    if (res.success) {
      setApprovedNotification(
        `تم اعتماد وتفعيل متجر "${m.businessName}" بنجاح ${finalCr ? `وربط السجل/الوثيقة (${finalCr})` : ''}!`
      );
      setApprovingMerchant(null);
      setApprovalCrNumber('');
      setTimeout(() => setApprovedNotification(null), 6000);
    }
  };

  // Stats calculation
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.status === 'active').length;
  const suspendedMerchants = merchants.filter((m) => m.status === 'suspended').length;
  const pendingMerchants = merchants.filter((m) => m.status === 'pending_approval');
  const pendingMerchantsCount = pendingMerchants.length;
  const totalCustomers = customers.length;
  const totalCards = customerCards.length;
  const totalVisits = transactions.filter((t) => t.type === 'visit_added' || t.type === 'reward_earned').length;
  const totalRedemptions = transactions.filter((t) => t.type === 'reward_redeemed').length;

  // Suggestions stats & filters
  const pendingSuggestionsCount = industrySuggestions.filter((s) => s.status === 'pending').length;
  const filteredSuggestions = industrySuggestions.filter((s) => {
    if (suggestionFilter === 'all') return true;
    return s.status === suggestionFilter;
  });

  const handleApproveSuggestion = (suggestionId: string) => {
    const sug = industrySuggestions.find((s) => s.id === suggestionId);
    approveAndCreateCategoryFromSuggestion(suggestionId);
    setApprovedNotification(
      `تم بنجاح اعتماد نشاط "${sug?.categoryName || ''}" وأصبح متاحاً الآن في قائمة الأنشطة المعتمدة في منصة وفاء!`
    );
    setTimeout(() => {
      setApprovedNotification(null);
    }, 6000);
  };

  // Filtered merchants
  const filteredMerchants = merchants.filter((m) => {
    const matchSearch =
      m.businessName.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.city.toLowerCase().includes(merchantSearch.toLowerCase()) ||
      m.phone.includes(merchantSearch);
    const matchCity = selectedCityFilter === 'all' || m.city === selectedCityFilter;
    return matchSearch && matchCity;
  });

  const handleStartEditPlan = (plan: PricingPlan) => {
    setEditingPlanId(plan.id);
    setEditPriceMonthly(plan.monthlyPrice);
    setEditPriceAnnual(plan.annualPrice);
    setEditFeatures(plan.features.join('\n'));
  };

  const handleSavePlan = (planId: 'basic' | 'plus' | 'pro') => {
    const featuresList = editFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    updatePricingPlan(planId, {
      monthlyPrice: Number(editPriceMonthly),
      annualPrice: Number(editPriceAnnual),
      features: featuresList,
    });

    setEditingPlanId(null);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    addCategory({
      name: newCatName,
      iconName: 'Sparkles',
      defaultUnit: newCatUnit,
      defaultTarget: Number(newCatTarget),
      defaultReward: newCatReward || 'خدمة مجانية',
      description: newCatDesc || 'قطاع تجاري معتمد في منصة وفاء.',
    });

    setShowAddCatModal(false);
    setNewCatName('');
    setNewCatReward('');
    setNewCatDesc('');
  };

  // Handler for adding a new admin team member
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim() || !newAdminPassword.trim()) return;

    const res = await addAdminTeamMember({
      name: newAdminName,
      email: newAdminEmail,
      phone: newAdminPhone,
      password: newAdminPassword,
      roleTitle: newAdminRoleTitle,
      permissions: newAdminPerms,
    });

    if (res.success) {
      setApprovedNotification(`تمت إضافة (${newAdminName}) بنجاح إلى فريق إدارة المنصة وصلاحياته فعالة فوراً.`);
      setShowAddAdminModal(false);
      setNewAdminName('');
      setNewAdminEmail('');
      setNewAdminPhone('0534067866');
      setNewAdminPassword('Admin@123456');
      setTimeout(() => setApprovedNotification(null), 6000);
    }
  };

  // Handler for direct merchant creation by admin
  const handleAddMerchantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMName.trim() || !newMEmail.trim()) return;

    const created = createMerchantByAdmin({
      businessName: newMName,
      city: newMCity,
      categoryId: newMCat,
      phone: newMPhone,
      email: newMEmail,
      password: newMPassword,
      planId: newMPlan,
    });

    setApprovedNotification(`تم إنشاء متجر "${created.businessName}" بنجاح وتفعيله مباشرة.`);
    setShowAddMerchantModal(false);
    setNewMName('');
    setNewMEmail('');
    setTimeout(() => setApprovedNotification(null), 6000);
  };

  // Handler for owner changing password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassInput) return;
    if (newPassInput !== confirmPassInput) {
      setPassMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين.' });
      return;
    }
    const res = await changeAdminPassword(newPassInput, currentPassInput);
    if (res.success) {
      setPassMessage({ type: 'success', text: res.message });
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
      setTimeout(() => setPassMessage(null), 6000);
    } else {
      setPassMessage({ type: 'error', text: res.message });
    }
  };

  // Handler for updating support contact
  const handleSaveSupportContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupportContact({
      phone: supportPhoneInput,
      internationalPhone: supportPhoneInput.startsWith('0') ? `+966${supportPhoneInput.slice(1)}` : supportPhoneInput,
      whatsappUrl: `https://wa.me/966${supportPhoneInput.replace(/\D/g, '').replace(/^0+/, '')}`,
      email: supportEmailInput,
    });
    setSupportMessage('تم حفظ أرقام الدعم الفني وتحديثها في كامل المنصة بنجاح.');
    setTimeout(() => setSupportMessage(null), 5000);
  };

  const ownerAccount = adminTeam.find((m) => m.id === 'admin-fras') || {
    id: 'admin-fras',
    name: 'سعود بن فهد الفيفي (المالك والمدير العام)',
    email: 'frasalfyfy7@gmail.com',
    password: 'Admin@123456',
    phone: '0534067866',
    roleTitle: 'صاحب المنصة والمدير العام',
    permissions: {
      canManageMerchants: true,
      canManagePlans: true,
      canManageCategories: true,
      canManageSuggestions: true,
      canManageStaff: true,
      canViewAudit: true,
      canManageSettings: true,
    },
    isActive: true,
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'النظام الأساسي',
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Super Admin Brand Bar */}
        <div className="rounded-3xl bg-white border border-purple-200 p-6 sm:p-7 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-15 h-15 rounded-2xl bg-purple-100 border border-purple-200 text-purple-700 flex items-center justify-center font-black shadow-sm">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">إدارة منصة WAFA | وفاء المركزية</h1>
                <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full">
                  سوبر أدمن المنصة
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                التحكم الكامل بالتجار، الباقات، الأنشطة، وفترات الاشتراك وسجل التدقيق الأمني.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2.5 px-3.5 rounded-2xl border border-purple-200 text-xs text-right">
              <div className="text-[10px] text-purple-700 font-semibold">المالك وصاحب المنصة</div>
              <div className="text-xs font-black text-purple-950 font-mono mt-0.5">
                frasalfyfy7@gmail.com
              </div>
            </div>

            <div className="bg-purple-50 p-2.5 px-3.5 rounded-2xl border border-purple-200 text-xs text-right">
              <div className="text-[10px] text-purple-700 font-semibold">فريق موظفي الإدارة</div>
              <div className="text-xs font-black text-purple-900 mt-0.5">
                {adminTeam.length} أعضاء
              </div>
            </div>

            <div className="bg-purple-50 p-2.5 px-3.5 rounded-2xl border border-purple-200 text-xs text-right">
              <div className="text-[10px] text-purple-700 font-semibold">التجار النشطون</div>
              <div className="text-base font-black text-purple-900 font-mono mt-0.5">
                {activeMerchants} من {totalMerchants}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('launch_readiness')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'launch_readiness'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-emerald-800 hover:text-emerald-950 bg-emerald-50 border border-emerald-300'
            }`}
          >
            <Rocket className="w-4 h-4 text-emerald-500" />
            <span>مركز جاهزية الإطلاق 🚀</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('merchants')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'merchants'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>إدارة التجار ({totalMerchants})</span>
            {pendingMerchantsCount > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {pendingMerchantsCount} بانتظار الاعتماد
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin_team')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'admin_team'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>فريق الإدارة والموظفين ({adminTeam.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('owner_settings')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'owner_settings'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>تحكم المالك وكلمة المرور</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'plans'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>الباقات والأسعار</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'categories'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>أنواع الأنشطة ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'suggestions'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>اقتراحات الأنشطة (غير مدرج)</span>
            {pendingSuggestionsCount > 0 ? (
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                {pendingSuggestionsCount} جديد
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                {industrySuggestions.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stats')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'stats'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>إحصائيات المنصة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'audit'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>سجل الرقابة ({auditLogs.length})</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {approvedNotification && (
          <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-4 flex items-center justify-between gap-3 text-emerald-900 text-xs font-semibold animate-in slide-in-from-top-2 shadow-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{approvedNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setApprovedNotification(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold px-2 py-1 cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* Tab 1: Merchants Directory & Controls */}
        {activeTab === 'merchants' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">إدارة الأنشطة والتجار المسجلين</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  تفعيل الحسابات وإيقافها، وتعديل الباقات ومراقبة الفروع.
                </p>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMerchantModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة متجر جديد فوراً</span>
                </button>

                <input
                  type="text"
                  placeholder="ابحث باسم المتجر أو المدينة..."
                  value={merchantSearch}
                  onChange={(e) => setMerchantSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white w-44 sm:w-56"
                />

                <select
                  value={selectedCityFilter}
                  onChange={(e) => setSelectedCityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white font-medium"
                >
                  <option value="all">كل المدن</option>
                  <option value="الخرج">الخرج</option>
                  <option value="الرياض">الرياض</option>
                </select>
              </div>
            </div>

            {/* Pending Merchants Approval Section */}
            {pendingMerchants.length > 0 && (
              <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                      <Clock className="w-4 h-4 animate-spin text-amber-700" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        طلبات تسجيل التجار الجديدة (بانتظار الموافقة والاعتماد)
                      </h4>
                      <p className="text-xs text-slate-500">
                        تتطلب موافقة الإدارة الصريحة لتفعيل حساب التاجر وتمكينه من الدخول الفوري باليوزر وكلمة المرور.
                      </p>
                    </div>
                  </div>
                  <span className="bg-amber-600 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                    {pendingMerchants.length} طلب بانتظار الاعتماد
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {pendingMerchants.map((pm) => {
                    const cat = categories.find((c) => c.id === pm.categoryId);
                    return (
                      <div
                        key={pm.id}
                        className="bg-white rounded-xl border border-amber-200 p-4 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{pm.businessName}</div>
                            <div className="text-xs font-mono font-bold text-emerald-800" dir="ltr">
                              @{pm.username || pm.email?.split('@')[0]}
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            طلب جديد
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1 text-xs text-slate-600">
                          <div>المدينة: <strong className="text-slate-800">{pm.city}</strong></div>
                          <div>النشاط: <strong className="text-slate-800">{cat?.name || 'عام'}</strong></div>
                          <div className="font-mono text-[11px]" dir="ltr">الجوال: {pm.phone}</div>
                          <div className="font-mono text-[11px] truncate" dir="ltr" title={pm.email}>
                            {pm.email}
                          </div>
                        </div>

                        {/* إضافة وتوثيق رقم السجل التجاري أو وثيقة العمل الحر عند الاعتماد */}
                        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/90 space-y-1.5 text-right">
                          <label className="block text-[11px] font-bold text-slate-800">
                            📋 رقم السجل التجاري أو وثيقة العمل الحر (إضافة وتوثيق عند الاعتماد):
                          </label>
                          <input
                            type="text"
                            placeholder="مثال: 1010XXXXXX أو وثيقة العمل الحر FL-XXXX"
                            value={cardCrInputs[pm.id] ?? (pm.commercialReg || '')}
                            onChange={(e) =>
                              setCardCrInputs((prev) => ({ ...prev, [pm.id]: e.target.value }))
                            }
                            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-600"
                          />
                          <span className="text-[10px] text-slate-500 block">
                            يتم حفظ هذا الرقم في ملف المنشأة فور الاعتماد وإشعار التاجر به.
                          </span>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => handleConfirmApproval(pm, cardCrInputs[pm.id] ?? pm.commercialReg)}
                            className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>اعتماد وتفعيل المتجر مع السجل</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (window.confirm(`هل أنت متأكد من رفض طلب متجر "${pm.businessName}"؟`)) {
                                await rejectMerchant(pm.id, 'رفض من قِبل إدارة المنصة');
                              }
                            }}
                            className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                          >
                            رفض
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`هل أنت متأكد من حذف متجر "${pm.businessName}" نهائياً من النظام؟`)) {
                                deleteMerchant(pm.id);
                                setApprovedNotification(`تم حذف متجر "${pm.businessName}" نهائياً.`);
                                setTimeout(() => setApprovedNotification(null), 5000);
                              }
                            }}
                            className="py-2 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer transition-colors flex items-center gap-1"
                            title="حذف المتجر نهائياً"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">النشاط التجاري</th>
                    <th className="pb-3 font-semibold">المدينة</th>
                    <th className="pb-3 font-semibold">القطاع</th>
                    <th className="pb-3 font-semibold">الباقة الحالية</th>
                    <th className="pb-3 font-semibold">عدد الفروع</th>
                    <th className="pb-3 font-semibold">الحالة</th>
                    <th className="pb-3 font-semibold text-center">تحكم المالك</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMerchants.map((m) => {
                    const cat = categories.find((c) => c.id === m.categoryId);
                    const isActive = m.status === 'active';

                    return (
                      <tr key={m.id} className="hover:bg-slate-50">
                        <td className="py-3.5">
                          <div className="font-bold text-slate-900">{m.businessName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] font-mono font-bold text-emerald-800" dir="ltr">
                              @{m.username || '—'}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono font-semibold" dir="ltr">
                              {m.phone}
                            </span>
                          </div>
                          {m.commercialReg ? (
                            <div className="text-[10px] text-slate-700 font-mono font-semibold mt-1 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded w-fit">
                              <span>السجل/الوثيقة:</span>
                              <span className="text-emerald-800">{m.commercialReg}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                              {m.status === 'pending_approval' ? '⏳ يُضاف السجل عند الاعتماد' : 'بدون سجل مسجل'}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 text-slate-700 font-medium">{m.city}</td>
                        <td className="py-3.5 text-slate-700">{cat?.name || 'قطاع'}</td>
                        <td className="py-3.5">
                          <select
                            value={m.planId}
                            onChange={(e) => updateMerchantPlan(m.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs text-emerald-800 font-bold focus:outline-none"
                          >
                            <option value="basic">وفاء الأساسية (79)</option>
                            <option value="plus">وفاء بلس (119)</option>
                            <option value="pro">وفاء برو (179)</option>
                          </select>
                        </td>
                        <td className="py-3.5 font-mono text-slate-700">{m.branches.length} فرع</td>
                        <td className="py-3.5">
                          {m.status === 'pending_approval' ? (
                            <span className="font-bold px-2.5 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                              ⏳ بانتظار الاعتماد
                            </span>
                          ) : (
                            <span
                              className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isActive ? 'مفعل' : 'موقوف'}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center justify-center gap-1.5">
                            {m.status === 'pending_approval' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setApprovingMerchant(m);
                                    setApprovalCrNumber(m.commercialReg || '');
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>اعتماد وتوثيق السجل</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (window.confirm(`هل أنت متأكد من رفض طلب متجر "${m.businessName}"؟`)) {
                                      await rejectMerchant(m.id);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                                >
                                  رفض
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`هل أنت متأكد من حذف متجر "${m.businessName}" نهائياً من المنصة؟`)) {
                                      deleteMerchant(m.id);
                                      setApprovedNotification(`تم حذف متجر "${m.businessName}" نهائياً.`);
                                      setTimeout(() => setApprovedNotification(null), 5000);
                                    }
                                  }}
                                  className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 flex items-center gap-1 cursor-pointer"
                                  title="حذف نهائي"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => impersonateMerchant(m.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                                  title="الدخول للوحة تحكم هذا المتجر ومعاينتها"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>معاينة كتاجر</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => toggleMerchantStatus(m.id)}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    isActive
                                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                      : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  }`}
                                >
                                  {isActive ? 'إيقاف' : 'تفعيل'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    if (window.confirm(`هل أنت متأكد من حذف متجر "${m.businessName}" نهائياً من المنصة؟`)) {
                                      deleteMerchant(m.id);
                                      setApprovedNotification(`تم حذف متجر "${m.businessName}" وبياناته بالكامل.`);
                                      setTimeout(() => setApprovedNotification(null), 5000);
                                    }
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  title="حذف المتجر نهائياً"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Admin Team & Platform Staff Management */}
        {activeTab === 'admin_team' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    فريق موظفي إدارة المنصة
                  </h3>
                  <span className="bg-purple-100 text-purple-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-purple-200">
                    {adminTeam.length} موظفين ومسؤولين
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  بصفتك صاحب المنصة، يمكنك إضافة موظفين ومشرفين للعمل معك في إدارة المنصة، وتحديد صلاحيات كل موظف بدقة (تفعيل التجار، مراجعة الاقتراحات، وتعديل الباقات)، مع إمكانية إيقاف أو حذف أي حساب في أي وقت.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddAdminModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ إضافة موظف إدارة جديد</span>
              </button>
            </div>

            {/* Admin Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminTeam.map((member) => {
                const isOwner = member.id === 'admin-fras' || member.email === 'frasalfyfy7@gmail.com';

                return (
                  <div
                    key={member.id}
                    className={`rounded-2xl p-5 border space-y-4 transition-all ${
                      isOwner
                        ? 'bg-gradient-to-br from-purple-50/70 to-white border-purple-300 shadow-sm ring-1 ring-purple-100'
                        : member.isActive
                        ? 'bg-white border-slate-200 shadow-sm'
                        : 'bg-slate-50 border-slate-200 opacity-75'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black ${
                            isOwner
                              ? 'bg-purple-700 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-black text-slate-900">{member.name}</h4>
                            {isOwner && (
                              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-300">
                                المالك الرئيسي
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-purple-700 block mt-0.5">
                            {member.roleTitle}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div>
                        {member.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            نشط
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            موقوف
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">البريد الإلكتروني:</span>
                        <span className="font-mono font-bold text-slate-800" dir="ltr">{member.email}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">رقم الجوال:</span>
                        <a href={`tel:${member.phone}`} className="font-mono font-bold text-purple-700 hover:underline" dir="ltr">
                          {member.phone}
                        </a>
                      </div>
                      {member.password && (
                        <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3 text-slate-400" />
                            كلمة المرور:
                          </span>
                          <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-900 font-bold select-all">
                            {member.password}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Permissions Badges */}
                    <div>
                      <div className="text-[11px] font-bold text-slate-700 mb-1.5">الصلاحيات الممنوحة:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {member.permissions.canManageMerchants && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            إدارة وتفعيل التجار
                          </span>
                        )}
                        {member.permissions.canManagePlans && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            تعديل أسعار الباقات
                          </span>
                        )}
                        {member.permissions.canManageCategories && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            القطاعات والأنشطة
                          </span>
                        )}
                        {member.permissions.canManageSuggestions && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            اعتماد الأنشطة غير المدرجة
                          </span>
                        )}
                        {member.permissions.canManageStaff && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            إدارة موظفي الإدارة
                          </span>
                        )}
                        {member.permissions.canViewAudit && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            سجل الرقابة والعمليات
                          </span>
                        )}
                        {member.permissions.canManageSettings && (
                          <span className="bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                            إعدادات المنصة والدعم
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {!isOwner && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => updateAdminTeamMember(member.id, { isActive: !member.isActive })}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                            member.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {member.isActive ? 'إيقاف الصلاحيات' : 'تفعيل الحساب'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الموظف (${member.name}) من فريق الإدارة؟`)) {
                              deleteAdminTeamMember(member.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>حذف الموظف</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Owner Settings & Password Control */}
        {activeTab === 'owner_settings' && (
          <div className="space-y-6">
            {/* Owner Master Identity Card */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-500/30 text-purple-200 border border-purple-400/30 text-[11px] font-black px-3 py-0.5 rounded-full">
                      صاحب الموقع والمالك العام للمنصة
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      كامل الصلاحيات (Super Admin)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {ownerAccount.name}
                  </h3>
                  <p className="text-xs text-purple-200 mt-1 max-w-xl leading-relaxed">
                    هذا الحساب يملك أعلى سلطة في منصة WAFA | وفاء، ويمكنه التحكم بالتجار، إضافة موظفين في الإدارة، تعديل الأسعار، ومراقبة كافة العمليات بدقة.
                  </p>
                </div>

                {/* Password Direct Box */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl min-w-[280px]">
                  <div className="text-xs text-purple-200 font-semibold mb-1">بيانات الدخول الحالية لمالك المنصة:</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">البريد:</span>
                      <span className="font-mono font-bold text-white select-all">{ownerAccount.email}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-white/10">
                      <span className="text-purple-300 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-purple-300" />
                        كلمة المرور:
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-amber-300 bg-black/40 px-2.5 py-1 rounded border border-white/10 select-all tracking-wider">
                          {showCurrentPassword ? (ownerAccount.password || 'Admin@123456') : '••••••••••••'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-purple-200 hover:text-white p-1 rounded cursor-pointer transition-colors"
                          title={showCurrentPassword ? 'إخفاء' : 'إظهار'}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(ownerAccount.password || 'Admin@123456');
                            setCopiedPass(true);
                            setTimeout(() => setCopiedPass(false), 3000);
                          }}
                          className="text-purple-200 hover:text-white p-1 rounded cursor-pointer transition-colors"
                          title="نسخ كلمة المرور"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    {copiedPass && (
                      <div className="text-[10px] text-emerald-300 text-center font-bold">
                        تم نسخ كلمة المرور إلى الحافظة!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form 1: Change Owner Password */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">تغيير كلمة المرور لحساب الإدارة</h4>
                    <p className="text-[11px] text-slate-500">عيّن كلمة مرور جديدة لحسابك المعتمد.</p>
                  </div>
                </div>

                {passMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold ${
                      passMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {passMessage.text}
                  </div>
                )}

                <form onSubmit={handleChangePasswordSubmit} className="space-y-3 text-right">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      placeholder="أدخل كلمة المرور الحالية"
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">كلمة المرور الجديدة *</label>
                    <input
                      type="password"
                      placeholder="6 خانات أو أكثر..."
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">تأكيد كلمة المرور الجديدة *</label>
                    <input
                      type="password"
                      placeholder="أعد كتابة كلمة المرور الجديدة"
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    تحديث كلمة المرور فوراً
                  </button>
                </form>
              </div>

              {/* Form 2: Platform Support Contact Settings */}
              <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">هاتف الدعم الفني المعتمد للمنصة</h4>
                    <p className="text-[11px] text-slate-500">الرقم الذي يظهر لجميع الزوار والتجار للتواصل معك.</p>
                  </div>
                </div>

                {supportMessage && (
                  <div className="p-3 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {supportMessage}
                  </div>
                )}

                <form onSubmit={handleSaveSupportContact} className="space-y-3 text-right">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">رقم جوال الدعم المعتمد (اتصال وواتساب) *</label>
                    <input
                      type="text"
                      value={supportPhoneInput}
                      onChange={(e) => setSupportPhoneInput(e.target.value)}
                      placeholder="0534067866"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">البريد الإلكتروني للدعم الفني</label>
                    <input
                      type="email"
                      value={supportEmailInput}
                      onChange={(e) => setSupportEmailInput(e.target.value)}
                      placeholder="support@wafa.sa أو frasalfyfy7@gmail.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                      required
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 leading-relaxed">
                    💡 رقم الجوال الحالي <strong>{supportPhoneInput}</strong> مربوط مباشرة بجميع أزرار الاتصال الهاتفي والمحادثة الفورية عبر تطبيق واتساب في الصفحة الرئيسية وتذييل الموقع.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer"
                  >
                    حفظ وتحديث أرقام الدعم الفني
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Pricing Plans Management */}
        {activeTab === 'plans' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">إدارة الباقات والأسعار والمميزات</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  قابلة للتعديل والتحرير المباشر
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكن لمالك المنصة تعديل أسعار الباقات وقوائم المميزات وتطبيقها فوراً على المنصة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => {
                const isEditing = editingPlanId === p.id;
                return (
                  <div
                    key={p.id}
                    className="rounded-3xl bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between space-y-4 shadow-2xs"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-purple-800 bg-purple-100 px-3 py-0.5 rounded-full">
                          {p.badge}
                        </span>
                        {!isEditing && (
                          <button
                            onClick={() => handleStartEditPlan(p)}
                            className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            تعديل
                          </button>
                        )}
                      </div>

                      <h4 className="text-lg font-black text-slate-900">{p.name}</h4>

                      {isEditing ? (
                        <div className="space-y-3 pt-3">
                          <div>
                            <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                              السعر الشهري (ر.س)
                            </label>
                            <input
                              type="number"
                              value={editPriceMonthly}
                              onChange={(e) => setEditPriceMonthly(Number(e.target.value))}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                              السعر السنوي (ر.س)
                            </label>
                            <input
                              type="number"
                              value={editPriceAnnual}
                              onChange={(e) => setEditPriceAnnual(Number(e.target.value))}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono font-bold"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-600 font-semibold block mb-1">
                              المميزات (ميزة بكل سطر)
                            </label>
                            <textarea
                              rows={5}
                              value={editFeatures}
                              onChange={(e) => setEditFeatures(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => handleSavePlan(p.id)}
                              className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                            >
                              <Save className="w-3.5 h-3.5" />
                              حفظ
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingPlanId(null)}
                              className="flex-1 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                            >
                              إلغاء
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 pt-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-black text-slate-900 font-mono">{p.monthlyPrice}</span>
                            <span className="text-xs text-emerald-700 font-bold">ريال / شهرياً</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            السنوي: {p.annualPrice} ر.س
                          </div>

                          <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-700">
                            {p.features.map((f, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold">•</span>
                                <span className="text-[11px] leading-tight">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Business Categories Management */}
        {activeTab === 'categories' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">الأنشطة والقطاعات المدعومة ({categories.length})</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  إضافة قطاعات جديدة مع تحديد وحدات العد والمكافآت الافتراضية.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddCatModal(true)}
                className="py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة قطاع جديد</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl bg-slate-50 border border-slate-200 p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{cat.name}</h4>
                    <span className="text-[10px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      الوحدة: {cat.defaultUnit}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {cat.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200 text-xs">
                    <div className="text-slate-500 font-medium">الهدية الافتراضية بعد {cat.defaultTarget} {cat.defaultUnit}ات:</div>
                    <div className="text-emerald-700 font-bold mt-0.5">{cat.defaultReward}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Industry Suggestions from "هل نشاطك غير مدرج؟" */}
        {activeTab === 'suggestions' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    اقتراحات الأنشطة (غير مدرج)
                  </h3>
                  {pendingSuggestionsCount > 0 && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {pendingSuggestionsCount} طلب بحاجة للمراجعة
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  يصلك هنا كل نشاط كتبه زائر أو تاجر عند الضغط على "هل نشاطك غير مدرج؟". يمكنك التواصل المباشر مع مقدم الطلب عبر الهاتف أو الواتساب، واعتماد النشاط بضغطة زر واحدة لإضافته فوراً للأنشطة المعتمدة في منصة وفاء.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setSuggestionFilter('all')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    suggestionFilter === 'all'
                      ? 'bg-white text-purple-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  الكل ({industrySuggestions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestionFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    suggestionFilter === 'pending'
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  قيد المراجعة ({industrySuggestions.filter((s) => s.status === 'pending').length})
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestionFilter('approved')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    suggestionFilter === 'approved'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  تم الاعتماد ({industrySuggestions.filter((s) => s.status === 'approved').length})
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestionFilter('rejected')}
                  className={`px-3 py-1.5 rounded-xl cursor-pointer transition-all ${
                    suggestionFilter === 'rejected'
                      ? 'bg-slate-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  المرفوضة ({industrySuggestions.filter((s) => s.status === 'rejected').length})
                </button>
              </div>
            </div>

            {/* Suggestions List */}
            {filteredSuggestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
                <div className="w-12 h-12 rounded-2xl bg-slate-200 text-slate-500 flex items-center justify-center mx-auto mb-3">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">لا توجد اقتراحات ضمن هذا التصنيف</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  عندما يرسل زائر أو تاجر نشاطه من خلال نموذج "هل نشاطك غير مدرج؟" في الصفحة الرئيسية، سيظهر طلبه هنا فوراً مع تفاصيل التواصل.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredSuggestions.map((sug) => {
                  const isPending = sug.status === 'pending';
                  const isApproved = sug.status === 'approved';
                  const isRejected = sug.status === 'rejected';

                  // Format phone for WhatsApp
                  const phoneStr = sug.phone || '';
                  const rawPhone = phoneStr.replace(/[^0-9]/g, '');
                  const cleanPhone = rawPhone.startsWith('0') ? rawPhone.substring(1) : rawPhone;
                  const whatsappUrl = phoneStr
                    ? `https://wa.me/966${cleanPhone}?text=${encodeURIComponent(
                        `السلام عليكم ورحمة الله، مرحباً ${sug.proposerName}، نتواصل معك من منصة وفاء بخصوص اقتراحك لإضافة نشاط (${sug.categoryName}).`
                      )}`
                    : null;

                  return (
                    <div
                      key={sug.id}
                      className={`rounded-2xl p-5 border transition-all space-y-4 ${
                        isPending
                          ? 'bg-white border-amber-300 shadow-sm ring-1 ring-amber-100'
                          : isApproved
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-slate-50 border-slate-200 opacity-80'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                              isApproved
                                ? 'bg-emerald-100 text-emerald-700'
                                : isPending
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-slate-900">{sug.categoryName}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 font-medium">
                              <span>مقدم الطلب: <strong className="text-slate-800">{sug.proposerName}</strong></span>
                              <span>•</span>
                              <span className="flex items-center gap-1 font-mono text-[10px]">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {new Date(sug.createdAt).toLocaleDateString('ar-SA')}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              قيد المراجعة
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              معتمد ومدرج بالمنصة
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-300">
                              <XCircle className="w-3 h-3 text-slate-500" />
                              مرفوض
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Details Grid */}
                      <div className="grid grid-cols-2 gap-2.5 bg-slate-50/80 p-3 rounded-xl border border-slate-100 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-slate-500 font-medium">المدينة:</span>
                          <span className="font-bold text-slate-900">{sug.city || 'غير محدد'}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span className="text-slate-500 font-medium">وحدة العد:</span>
                          <span className="font-bold text-slate-900">{sug.suggestedUnit || 'زيارة'}</span>
                        </div>

                        {sug.suggestedReward && (
                          <div className="col-span-2 text-slate-700 pt-1 border-t border-slate-200/60">
                            <span className="text-slate-500 font-medium">المكافأة المقترحة: </span>
                            <span className="font-semibold text-emerald-800">{sug.suggestedReward}</span>
                          </div>
                        )}

                        {sug.notes && (
                          <div className="col-span-2 text-slate-700 pt-1 border-t border-slate-200/60">
                            <span className="text-slate-500 font-medium">ملاحظات إضافية: </span>
                            <span className="text-slate-800">{sug.notes}</span>
                          </div>
                        )}
                      </div>

                      {/* Contact & Communication Channel */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {sug.phone ? (
                            <>
                              <a
                                href={`tel:${sug.phone}`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl transition-colors"
                              >
                                <Phone className="w-3.5 h-3.5 text-purple-600" />
                                <span className="font-mono">{sug.phone}</span>
                              </a>

                              {whatsappUrl && (
                                <a
                                  href={whatsappUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl transition-colors"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>مراسلة واتساب</span>
                                </a>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-400">لا يوجد رقم هاتف</span>
                          )}

                          {sug.email && (
                            <a
                              href={`mailto:${sug.email}`}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-purple-700 bg-white border border-slate-200 px-2.5 py-1.5 rounded-xl transition-colors"
                              title={sug.email}
                            >
                              <Mail className="w-3.5 h-3.5 text-slate-500" />
                              <span className="hidden sm:inline font-mono text-[11px]">{sug.email}</span>
                            </a>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center gap-2">
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApproveSuggestion(sug.id)}
                                className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>اعتماد وإضافة للأنشطة فوراً</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => updateIndustrySuggestionStatus(sug.id, 'rejected')}
                                className="inline-flex items-center gap-1 text-slate-500 hover:text-red-700 hover:bg-red-50 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>رفض</span>
                              </button>
                            </>
                          )}

                          {isApproved && (
                            <div className="text-[11px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-100/60 px-3 py-1 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>متاح حالياً في الأنشطة الرسمية</span>
                            </div>
                          )}

                          {isRejected && (
                            <button
                              type="button"
                              onClick={() => updateIndustrySuggestionStatus(sug.id, 'pending')}
                              className="inline-flex items-center gap-1 text-slate-600 hover:text-purple-700 bg-white border border-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>إعادة للنظر</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Platform Comprehensive Stats */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold">إجمالي التجار</div>
                <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{totalMerchants}</div>
                <div className="text-[11px] text-emerald-700 mt-1 font-bold">{activeMerchants} حساب نشط</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold">العملاء المسجلون</div>
                <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{totalCustomers}</div>
                <div className="text-[11px] text-teal-700 mt-1 font-bold">يمتلكون {totalCards} بطاقة نشطة</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold">إجمالي الزيارات والعمليات</div>
                <div className="text-3xl font-black text-slate-900 mt-1 font-mono">{totalVisits}</div>
                <div className="text-[11px] text-slate-600 mt-1 font-medium">عملية موثقة في المنصة</div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-semibold">المكافآت المصروفة</div>
                <div className="text-3xl font-black text-amber-700 mt-1 font-mono">{totalRedemptions}</div>
                <div className="text-[11px] text-amber-800 mt-1 font-bold">استبدال آمن معتمد</div>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900">توزيع التجار جغرافياً وبحسب الباقات</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 mb-2.5">توزيع المدن:</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">الخرج (المرحلة التجريبية الأولى)</span>
                      <strong className="text-emerald-700 font-mono text-sm">
                        {merchants.filter((m) => m.city === 'الخرج').length} تجار
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">الرياض</span>
                      <strong className="text-emerald-700 font-mono text-sm">
                        {merchants.filter((m) => m.city === 'الرياض').length} تجار
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-xs font-bold text-slate-800 mb-2.5">توزيع الاشتراكات:</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">وفاء بلس (119 ر.س)</span>
                      <strong className="text-slate-900 font-mono text-sm">
                        {merchants.filter((m) => m.planId === 'plus').length}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">وفاء الأساسية (79 ر.س)</span>
                      <strong className="text-slate-900 font-mono text-sm">
                        {merchants.filter((m) => m.planId === 'basic').length}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600 font-medium">وفاء برو (179 ر.س)</span>
                      <strong className="text-slate-900 font-mono text-sm">
                        {merchants.filter((m) => m.planId === 'pro').length}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security & Platform Audit Log */}
        {activeTab === 'audit' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900">سجل التدقيق والرقابة الأمني المركزي</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                يسجل كل عملية حرجة: دخول الموظف، اعتماد المكافأة، تعديل الأسعار، وإيقاف الحسابات.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="pb-3 font-semibold">الدور والمنفذ</th>
                    <th className="pb-3 font-semibold">الإجراء</th>
                    <th className="pb-3 font-semibold">الهدف (المتجر / العميل)</th>
                    <th className="pb-3 font-semibold">التفاصيل</th>
                    <th className="pb-3 font-semibold">الوقت والتاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="py-3.5">
                        <span className="font-bold text-slate-900">{log.actorName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono">({log.actorRole})</span>
                      </td>
                      <td className="py-3.5 font-bold text-purple-800">{log.action}</td>
                      <td className="py-3.5 text-slate-700">
                        {log.targetMerchant || log.targetCustomer || '-'}
                      </td>
                      <td className="py-3.5 text-slate-600 text-[11px] max-w-xs">{log.details}</td>
                      <td className="py-3.5 font-mono text-slate-500 text-[10px]">
                        {new Date(log.timestamp).toLocaleDateString('ar-SA')} -{' '}
                        {new Date(log.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Production Launch & Integration Center */}
        {activeTab === 'launch_readiness' && <ProductionLaunchCenter />}
      </div>

      {/* Add Category Modal */}
      {showAddCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-slate-900">إضافة قطاع تجاري جديد</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              عرّف النشاط الجديد ليتمكن التجار من اختياره عند التسجيل.
            </p>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3 text-right">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم القطاع *</label>
                <input
                  type="text"
                  placeholder="مثال: مغاسل الملابس والمفارش"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">وحدة العد</label>
                  <input
                    type="text"
                    placeholder="قطعة، زيارة، كوي..."
                    value={newCatUnit}
                    onChange={(e) => setNewCatUnit(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">العدد المقترح</label>
                  <input
                    type="number"
                    min={2}
                    max={15}
                    value={newCatTarget}
                    onChange={(e) => setNewCatTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">المكافأة الافتراضية</label>
                <input
                  type="text"
                  placeholder="مثال: غسيل وكوي قطعتين مجاناً"
                  value={newCatReward}
                  onChange={(e) => setNewCatReward(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">وصف النشاط</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="وصف مختصر للقطاع..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  حفظ القطاع
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Staff Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">إضافة موظف إدارة جديد للمنصة</h3>
                <p className="text-xs text-slate-500">عيّن موظفاً للعمل معك وحدد صلاحياته بدقة.</p>
              </div>
            </div>

            <form onSubmit={handleAddAdminSubmit} className="space-y-3.5 text-right mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">اسم الموظف *</label>
                  <input
                    type="text"
                    placeholder="مثال: خالد العتيبي"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">المسمى الوظيفي الإداري</label>
                  <input
                    type="text"
                    placeholder="مشرف عمليات، دعم فني..."
                    value={newAdminRoleTitle}
                    onChange={(e) => setNewAdminRoleTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">البريد الإلكتروني (لتسجيل الدخول) *</label>
                  <input
                    type="email"
                    placeholder="employee@wafa.sa"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">رقم الجوال *</label>
                  <input
                    type="text"
                    placeholder="05XXXXXXXX"
                    value={newAdminPhone}
                    onChange={(e) => setNewAdminPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">كلمة المرور المبدئية *</label>
                <input
                  type="text"
                  placeholder="Admin@123456"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono font-bold"
                  required
                />
              </div>

              {/* Permissions Checkboxes */}
              <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-2">
                <div className="text-xs font-bold text-purple-950 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <span>تحديد الصلاحيات الممنوحة للموظف:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canManageMerchants}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageMerchants: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>إدارة وتفعيل التجار</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canManageSuggestions}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageSuggestions: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>اعتماد الأنشطة غير المدرجة</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canManageCategories}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageCategories: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>إضافة وتعديل القطاعات</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canManagePlans}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManagePlans: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>تعديل أسعار الباقات</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canViewAudit}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canViewAudit: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>عرض سجل الرقابة الأمني</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAdminPerms.canManageSettings}
                      onChange={(e) => setNewAdminPerms({ ...newAdminPerms, canManageSettings: e.target.checked })}
                      className="rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>تعديل إعدادات الدعم</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  إضافة الموظف واعتماده فوراً
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Merchant Direct Modal */}
      {showAddMerchantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">إضافة متجر جديد من الإدارة مباشرة</h3>
                <p className="text-xs text-slate-500">إنشاء وتفعيل حساب تاجر في المنصة دون الحاجة لانتظار تسجيله.</p>
              </div>
            </div>

            <form onSubmit={handleAddMerchantSubmit} className="space-y-3.5 text-right mt-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">اسم النشاط التجاري *</label>
                <input
                  type="text"
                  placeholder="مثال: شاليهات أريج الخرج"
                  value={newMName}
                  onChange={(e) => setNewMName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">القطاع التجاري *</label>
                  <select
                    value={newMCat}
                    onChange={(e) => setNewMCat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">المدينة *</label>
                  <select
                    value={newMCity}
                    onChange={(e) => setNewMCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    <option value="الخرج">الخرج</option>
                    <option value="الرياض">الرياض</option>
                    <option value="الدمام">الدمام</option>
                    <option value="جدة">جدة</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">البريد الإلكتروني للتاجر *</label>
                  <input
                    type="email"
                    placeholder="merchant@example.com"
                    value={newMEmail}
                    onChange={(e) => setNewMEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">رقم الجوال *</label>
                  <input
                    type="text"
                    placeholder="05XXXXXXXX"
                    value={newMPhone}
                    onChange={(e) => setNewMPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">الباقة المختارة</label>
                  <select
                    value={newMPlan}
                    onChange={(e) => setNewMPlan(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  >
                    <option value="basic">وفاء الأساسية (79 ر.س)</option>
                    <option value="plus">وفاء بلس (119 ر.س)</option>
                    <option value="pro">وفاء برو (179 ر.س)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">كلمة المرور للتاجر</label>
                  <input
                    type="text"
                    placeholder="Merchant@123456"
                    value={newMPassword}
                    onChange={(e) => setNewMPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                >
                  إنشاء وتفعيل المتجر
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMerchantModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Approve Merchant & Set Commercial Reg / Freelance Doc */}
      {approvingMerchant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 text-right space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">اعتماد حساب المنشأة وتوثيق السجل</h3>
                  <span className="text-[11px] text-slate-500">إضافة رقم السجل التجاري أو وثيقة العمل الحر</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setApprovingMerchant(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs space-y-1.5 text-emerald-950">
              <div className="flex justify-between">
                <span className="text-emerald-700">المنشأة:</span>
                <span className="font-bold">{approvingMerchant.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">اليوزر:</span>
                <span className="font-mono font-bold" dir="ltr">@{approvingMerchant.username || approvingMerchant.email.split('@')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700">المدينة / الجوال:</span>
                <span>{approvingMerchant.city} • <span dir="ltr">{approvingMerchant.phone}</span></span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                رقم السجل التجاري أو وثيقة العمل الحر *
              </label>
              <input
                type="text"
                placeholder="مثال: 1010XXXXXX أو وثيقة العمل الحر FL-XXXX"
                value={approvalCrNumber}
                onChange={(e) => setApprovalCrNumber(e.target.value)}
                autoFocus
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
              <span className="text-[11px] text-slate-500 block leading-relaxed">
                يتم ربط وتوثيق هذا الرقم بالمنشأة وتفعيله في ملف المتجر فور الموافقة وإشعار التاجر.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmApproval(approvingMerchant, approvalCrNumber)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد الاعتماد والتوثيق فوراً</span>
              </button>
              <button
                type="button"
                onClick={() => setApprovingMerchant(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer transition-colors"
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

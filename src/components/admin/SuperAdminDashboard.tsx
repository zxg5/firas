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
} from 'lucide-react';
import { PricingPlan, BusinessCategory } from '../../types';

export const SuperAdminDashboard: React.FC = () => {
  const {
    merchants,
    customers,
    customerCards,
    transactions,
    plans,
    categories,
    auditLogs,
    toggleMerchantStatus,
    updateMerchantPlan,
    updatePricingPlan,
    addCategory,
    updateCategory,
    resetAllData,
  } = useWafa();

  // Active view tab
  const [activeTab, setActiveTab] = useState<'merchants' | 'plans' | 'categories' | 'stats' | 'audit'>('merchants');

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

  // Stats calculation
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => m.status === 'active').length;
  const suspendedMerchants = merchants.filter((m) => m.status === 'suspended').length;
  const totalCustomers = customers.length;
  const totalCards = customerCards.length;
  const totalVisits = transactions.filter((t) => t.type === 'visit_added' || t.type === 'reward_earned').length;
  const totalRedemptions = transactions.filter((t) => t.type === 'reward_redeemed').length;

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
            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs text-right">
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
            onClick={() => setActiveTab('merchants')}
            className={`py-3 px-5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'merchants'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>إدارة التجار ({totalMerchants})</span>
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
            <span>الباقات والأسعار (قابلة للتعديل)</span>
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
            <span>أنواع الأنشطة والقطاعات ({categories.length})</span>
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
            <span>إحصائيات المنصة الشاملة</span>
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
            <span>سجل الرقابة والعمليات ({auditLogs.length})</span>
          </button>
        </div>

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

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="ابحث باسم المتجر أو المدينة..."
                  value={merchantSearch}
                  onChange={(e) => setMerchantSearch(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white w-48 sm:w-64"
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
                    <th className="pb-3 font-semibold text-center">الإجراءات</th>
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
                          <div className="text-[10px] text-slate-500 font-mono font-semibold" dir="ltr">{m.phone}</div>
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
                          <span
                            className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                              isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isActive ? 'مفعل' : 'موقوف'}
                          </span>
                        </td>
                        <td className="py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleMerchantStatus(m.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                              isActive
                                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
    </div>
  );
};

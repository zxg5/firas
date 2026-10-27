import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  BusinessCategory,
  PricingPlan,
  Merchant,
  StaffMember,
  LoyaltyProgram,
  Customer,
  CustomerCard,
  VisitTransaction,
  PlatformAuditLog,
  Branch,
  RewardItem,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PLANS,
  INITIAL_MERCHANTS,
  INITIAL_PROGRAMS,
  INITIAL_STAFF,
  INITIAL_CUSTOMERS,
  INITIAL_CUSTOMER_CARDS,
  INITIAL_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

const STORAGE_KEY = 'wafa_platform_data_v2';

interface WafaContextType {
  // State
  activeRole: UserRole;
  activeMerchantId: string;
  activeStaffId: string;
  activeCustomerId: string;
  categories: BusinessCategory[];
  plans: PricingPlan[];
  merchants: Merchant[];
  programs: LoyaltyProgram[];
  staff: StaffMember[];
  customers: Customer[];
  customerCards: CustomerCard[];
  transactions: VisitTransaction[];
  auditLogs: PlatformAuditLog[];

  // Current entity helpers
  currentMerchant: Merchant | undefined;
  currentProgram: LoyaltyProgram | undefined;
  currentStaff: StaffMember | undefined;
  currentCustomer: Customer | undefined;
  currentCustomerCards: CustomerCard[];

  // Role switching
  setRole: (role: UserRole) => void;
  setActiveMerchantId: (id: string) => void;
  setActiveStaffId: (id: string) => void;
  setActiveCustomerId: (id: string) => void;
  loginAsStaff: (phone: string, pin: string) => { success: boolean; message: string; staff?: StaffMember };
  loginAsMerchant: (emailOrPhone: string) => { success: boolean; message: string; merchant?: Merchant };
  loginOrRegisterCustomer: (phone: string, name?: string) => Customer;

  // Merchant operations
  updateMerchantProfile: (merchantId: string, data: Partial<Merchant>) => void;
  updateLoyaltyProgram: (programId: string, data: Partial<LoyaltyProgram>) => void;
  addBranch: (merchantId: string, branch: Omit<Branch, 'id' | 'merchantId'>) => Branch;
  updateBranch: (branchId: string, data: Partial<Branch>) => void;
  addStaff: (merchantId: string, staffData: Omit<StaffMember, 'id' | 'merchantId' | 'totalVisitsLogged' | 'totalRewardsRedeemed' | 'createdAt'>) => StaffMember;
  updateStaff: (staffId: string, data: Partial<StaffMember>) => void;
  deleteStaff: (staffId: string) => void;
  registerMerchant: (
    merchantData: Omit<Merchant, 'id' | 'status' | 'createdAt' | 'branches'>,
    firstBranchName: string,
    programData?: Partial<LoyaltyProgram>
  ) => { merchant: Merchant; staff: StaffMember };

  // Staff / Cashier operations
  findCustomerByQuery: (query: string) => { customer: Customer; card?: CustomerCard } | null;
  addCustomerVisit: (params: {
    merchantId: string;
    staffId: string;
    branchId: string;
    customerPhone: string;
    customerName?: string;
    invoiceRef?: string;
    carPlate?: string;
    bookingRef?: string;
    serviceType?: string;
    notes?: string;
    bypassCooldown?: boolean;
  }) => { success: boolean; message: string; rewardEarned?: boolean; newVisits?: number; targetVisits?: number; card?: CustomerCard };
  redeemReward: (params: {
    cardId: string;
    rewardId: string;
    redeemCode: string;
    staffId: string;
    branchId: string;
  }) => { success: boolean; message: string; reward?: RewardItem };

  // Customer operations
  joinMerchantCard: (customerId: string, merchantId: string) => CustomerCard;

  // Super Admin operations
  toggleMerchantStatus: (merchantId: string) => void;
  updateMerchantPlan: (merchantId: string, planId: 'basic' | 'plus' | 'pro') => void;
  updatePricingPlan: (planId: 'basic' | 'plus' | 'pro', data: Partial<PricingPlan>) => void;
  addCategory: (cat: Omit<BusinessCategory, 'id' | 'activeCount'>) => void;
  updateCategory: (id: string, data: Partial<BusinessCategory>) => void;

  // System
  resetAllData: () => void;
}

const WafaContext = createContext<WafaContextType | null>(null);

export const WafaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or defaults
  const [activeRole, setActiveRole] = useState<UserRole>('public');
  const [activeMerchantId, setActiveMerchantId] = useState<string>('m-kharj-wash');
  const [activeStaffId, setActiveStaffId] = useState<string>('staff-1');
  const [activeCustomerId, setActiveCustomerId] = useState<string>('cust-saud');

  const [categories, setCategories] = useState<BusinessCategory[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_categories`);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [plans, setPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : INITIAL_PLANS;
  });

  const [merchants, setMerchants] = useState<Merchant[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_merchants`);
    return saved ? JSON.parse(saved) : INITIAL_MERCHANTS;
  });

  const [programs, setPrograms] = useState<LoyaltyProgram[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_programs`);
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [staff, setStaff] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_customers`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [customerCards, setCustomerCards] = useState<CustomerCard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cards`);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER_CARDS;
  });

  const [transactions, setTransactions] = useState<VisitTransaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_txs`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<PlatformAuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_categories`, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_merchants`, JSON.stringify(merchants));
  }, [merchants]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_programs`, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cards`, JSON.stringify(customerCards));
  }, [customerCards]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txs`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helpers
  const currentMerchant = merchants.find((m) => m.id === activeMerchantId);
  const currentProgram = programs.find((p) => p.merchantId === activeMerchantId);
  const currentStaff = staff.find((s) => s.id === activeStaffId);
  const currentCustomer = customers.find((c) => c.id === activeCustomerId);
  const currentCustomerCards = customerCards.filter((card) => card.customerId === activeCustomerId);

  const setRole = (role: UserRole) => {
    setActiveRole(role);
  };

  const addAuditLog = (log: Omit<PlatformAuditLog, 'id' | 'timestamp'>) => {
    const newLog: PlatformAuditLog = {
      ...log,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Staff Login
  const loginAsStaff = (phone: string, pin: string) => {
    const normalizedPhone = phone.trim();
    const foundStaff = staff.find((s) => s.phone === normalizedPhone && s.pin === pin);
    if (!foundStaff) {
      return { success: false, message: 'رقم الجوال أو رمز PIN غير صحيح.' };
    }
    if (!foundStaff.isActive) {
      return { success: false, message: 'حساب الموظف معطّل، يرجى مراجعة إدارة المتجر.' };
    }

    const merchant = merchants.find((m) => m.id === foundStaff.merchantId);
    if (merchant && merchant.status === 'suspended') {
      return { success: false, message: 'حساب هذا التاجر موقوف مؤقتاً في المنصة.' };
    }

    setActiveStaffId(foundStaff.id);
    setActiveMerchantId(foundStaff.merchantId);
    setActiveRole('staff');

    addAuditLog({
      actorRole: 'staff',
      actorName: foundStaff.name,
      action: 'تسجيل دخول موظف',
      targetMerchant: merchant?.businessName,
      details: `تسجيل الدخول في نقطة بيع ${foundStaff.name}`,
    });

    return { success: true, message: `أهلاً بك يا ${foundStaff.name}`, staff: foundStaff };
  };

  // Merchant Login
  const loginAsMerchant = (emailOrPhone: string) => {
    const query = emailOrPhone.trim().toLowerCase();
    const found = merchants.find((m) => m.email.toLowerCase() === query || m.phone === query);
    if (!found) {
      return { success: false, message: 'لم يتم العثور على حساب تاجر بهذا البريد أو الجوال.' };
    }
    if (found.status === 'suspended') {
      return { success: false, message: 'تم إيقاف حساب هذا النشاط. تواصل مع إدارة وفاء للتفعيل.' };
    }

    setActiveMerchantId(found.id);
    setActiveRole('merchant');

    addAuditLog({
      actorRole: 'merchant',
      actorName: found.businessName,
      action: 'تسجيل دخول تاجر',
      targetMerchant: found.businessName,
      details: `تم الدخول إلى لوحة تحكم المتجر.`,
    });

    return { success: true, message: `مرحباً بك في لوحة تحكم ${found.businessName}`, merchant: found };
  };

  // Customer Login or Register
  const loginOrRegisterCustomer = (phone: string, name?: string) => {
    const cleanPhone = phone.trim();
    let existing = customers.find((c) => c.phone === cleanPhone);
    if (!existing) {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        name: name?.trim() || `عميل وفاء (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        customerCode: `WAFA-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, newCust]);
      existing = newCust;

      // Auto-assign sample car wash card with 1 welcome stamp
      const welcomeCard: CustomerCard = {
        id: `card-${newCust.id}-wash`,
        customerId: newCust.id,
        merchantId: 'm-kharj-wash',
        currentVisits: 1,
        totalLifetimeVisits: 1,
        rewardsEarnedCount: 0,
        rewardsRedeemedCount: 0,
        unclaimedRewards: [],
        lastVisitAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
      };
      setCustomerCards((prev) => [...prev, welcomeCard]);

      addAuditLog({
        actorRole: 'customer',
        actorName: newCust.name,
        action: 'تسجيل عميل جديد',
        details: `انضمام عميل جديد برقم جوال ${cleanPhone}`,
      });
    }

    setActiveCustomerId(existing.id);
    setActiveRole('customer');
    return existing;
  };

  // Update Merchant
  const updateMerchantProfile = (merchantId: string, data: Partial<Merchant>) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          return { ...m, ...data };
        }
        return m;
      })
    );
    addAuditLog({
      actorRole: 'merchant',
      actorName: currentMerchant?.businessName || 'تاجر',
      action: 'تحديث بيانات المتجر',
      targetMerchant: currentMerchant?.businessName,
      details: 'تم تعديل البيانات الأساسية للنشاط التجاري.',
    });
  };

  // Update Loyalty Program
  const updateLoyaltyProgram = (programId: string, data: Partial<LoyaltyProgram>) => {
    setPrograms((prev) =>
      prev.map((p) => {
        if (p.id === programId) {
          return { ...p, ...data };
        }
        return p;
      })
    );
    addAuditLog({
      actorRole: 'merchant',
      actorName: currentMerchant?.businessName || 'تاجر',
      action: 'تحديث برنامج الولاء',
      targetMerchant: currentMerchant?.businessName,
      details: `تم تحديث شروط ومكافأة برنامج الولاء (${data.rewardTitle || 'تعديل'}).`,
    });
  };

  // Add Branch
  const addBranch = (merchantId: string, branchData: Omit<Branch, 'id' | 'merchantId'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: `b-${Date.now()}`,
      merchantId,
    };
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          return { ...m, branches: [...m.branches, newBranch] };
        }
        return m;
      })
    );
    addAuditLog({
      actorRole: 'merchant',
      actorName: currentMerchant?.businessName || 'تاجر',
      action: 'إضافة فرع جديد',
      targetMerchant: currentMerchant?.businessName,
      details: `تمت إضافة فرع جديد: ${branchData.name}`,
    });
    return newBranch;
  };

  // Update Branch
  const updateBranch = (branchId: string, data: Partial<Branch>) => {
    setMerchants((prev) =>
      prev.map((m) => {
        const branchIndex = m.branches.findIndex((b) => b.id === branchId);
        if (branchIndex !== -1) {
          const updatedBranches = [...m.branches];
          updatedBranches[branchIndex] = { ...updatedBranches[branchIndex], ...data };
          return { ...m, branches: updatedBranches };
        }
        return m;
      })
    );
  };

  // Add Staff
  const addStaff = (
    merchantId: string,
    staffData: Omit<StaffMember, 'id' | 'merchantId' | 'totalVisitsLogged' | 'totalRewardsRedeemed' | 'createdAt'>
  ) => {
    const newStaff: StaffMember = {
      ...staffData,
      id: `staff-${Date.now()}`,
      merchantId,
      totalVisitsLogged: 0,
      totalRewardsRedeemed: 0,
      createdAt: new Date().toISOString(),
    };
    setStaff((prev) => [...prev, newStaff]);
    addAuditLog({
      actorRole: 'merchant',
      actorName: currentMerchant?.businessName || 'تاجر',
      action: 'إضافة موظف',
      targetMerchant: currentMerchant?.businessName,
      details: `تمت إضافة الموظف ${newStaff.name} برتبة ${newStaff.role}`,
    });
    return newStaff;
  };

  // Update Staff
  const updateStaff = (staffId: string, data: Partial<StaffMember>) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, ...data };
        }
        return s;
      })
    );
  };

  // Delete Staff
  const deleteStaff = (staffId: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== staffId));
  };

  // Register Merchant
  const registerMerchant = (
    merchantData: Omit<Merchant, 'id' | 'status' | 'createdAt' | 'branches'>,
    firstBranchName: string,
    programData?: Partial<LoyaltyProgram>
  ) => {
    const merchantId = `m-${Date.now()}`;
    const branchId = `b-${Date.now()}`;

    const branch: Branch = {
      id: branchId,
      merchantId,
      name: firstBranchName || 'الفرع الرئيسي',
      city: merchantData.city,
      district: 'الوسط',
      phone: merchantData.phone,
    };

    const newMerchant: Merchant = {
      ...merchantData,
      id: merchantId,
      status: 'active',
      createdAt: new Date().toISOString(),
      branches: [branch],
    };

    // Category default program template
    const cat = categories.find((c) => c.id === merchantData.categoryId) || categories[0];

    const newProgram: LoyaltyProgram = {
      id: `prog-${merchantId}`,
      merchantId,
      targetVisits: programData?.targetVisits || cat.defaultTarget,
      unitName: programData?.unitName || cat.defaultUnit,
      rewardTitle: programData?.rewardTitle || cat.defaultReward,
      rewardDescription: programData?.rewardDescription || `اجمع ${programData?.targetVisits || cat.defaultTarget} واحصل على مكافأتك الفورية.`,
      rewardTerms: programData?.rewardTerms || 'صالحة لمدة 30 يوماً من الاستحقاق.',
      primaryColor: programData?.primaryColor || '#059669',
      secondaryColor: programData?.secondaryColor || '#064e3b',
      cardPattern: programData?.cardPattern || 'geometric',
      cardIcon: cat.iconName,
      antiCheatCooldownMinutes: 45,
      requireInvoiceRef: true,
      welcomeStamps: 1,
    };

    const firstStaff: StaffMember = {
      id: `staff-${Date.now()}`,
      merchantId,
      branchId,
      name: 'كاشير الفرع الأول',
      phone: merchantData.phone,
      pin: '1234',
      role: 'manager',
      isActive: true,
      totalVisitsLogged: 0,
      totalRewardsRedeemed: 0,
      createdAt: new Date().toISOString(),
    };

    setMerchants((prev) => [...prev, newMerchant]);
    setPrograms((prev) => [...prev, newProgram]);
    setStaff((prev) => [...prev, firstStaff]);

    setActiveMerchantId(newMerchant.id);
    setActiveRole('merchant');

    addAuditLog({
      actorRole: 'merchant',
      actorName: newMerchant.businessName,
      action: 'تسجيل تاجر جديد',
      targetMerchant: newMerchant.businessName,
      details: `تم إنشاء متجر جديد في مدينة ${newMerchant.city} بنشاط ${cat.name}`,
    });

    return { merchant: newMerchant, staff: firstStaff };
  };

  // Find customer by phone or customerCode
  const findCustomerByQuery = (query: string) => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    const customer = customers.find(
      (c) => c.phone.includes(q) || c.customerCode.toLowerCase() === q || c.name.toLowerCase().includes(q)
    );
    if (!customer) return null;

    // Card for active merchant
    const card = customerCards.find(
      (cd) => cd.customerId === customer.id && cd.merchantId === activeMerchantId
    );

    return { customer, card };
  };

  // Add Customer Visit (Staff Only)
  const addCustomerVisit = ({
    merchantId,
    staffId,
    branchId,
    customerPhone,
    customerName,
    invoiceRef,
    carPlate,
    bookingRef,
    serviceType,
    notes,
    bypassCooldown,
  }: {
    merchantId: string;
    staffId: string;
    branchId: string;
    customerPhone: string;
    customerName?: string;
    invoiceRef?: string;
    carPlate?: string;
    bookingRef?: string;
    serviceType?: string;
    notes?: string;
    bypassCooldown?: boolean;
  }) => {
    const merchant = merchants.find((m) => m.id === merchantId);
    if (!merchant || merchant.status !== 'active') {
      return { success: false, message: 'حساب التاجر غير مفعل.' };
    }

    const program = programs.find((p) => p.merchantId === merchantId);
    if (!program) {
      return { success: false, message: 'لا يوجد برنامج ولاء مفعل لهذا المتجر.' };
    }

    const currentStaffMember = staff.find((s) => s.id === staffId);
    if (!currentStaffMember || !currentStaffMember.isActive) {
      return { success: false, message: 'الموظف غير مصرح له بتسجيل الزيارات.' };
    }

    const branch = merchant.branches.find((b) => b.id === branchId) || merchant.branches[0];

    // Find or create customer
    const cleanPhone = customerPhone.trim();
    let customer = customers.find((c) => c.phone === cleanPhone);
    if (!customer) {
      customer = {
        id: `cust-${Date.now()}`,
        name: customerName?.trim() || `عميل (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        customerCode: `WAFA-${Math.floor(1000 + Math.random() * 9000)}`,
        carPlate: carPlate?.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      setCustomers((prev) => [...prev, customer!]);
    } else {
      let changed = false;
      const updatedCustomer = { ...customer };
      if (carPlate?.trim() && customer.carPlate !== carPlate.trim()) {
        updatedCustomer.carPlate = carPlate.trim();
        changed = true;
      }
      if (customerName?.trim() && (customer.name.startsWith('عميل (') || !customer.name)) {
        updatedCustomer.name = customerName.trim();
        changed = true;
      }
      if (changed) {
        customer = updatedCustomer;
        setCustomers((prev) => prev.map((c) => (c.id === customer!.id ? updatedCustomer : c)));
      }
    }

    // Find or create card
    let card = customerCards.find(
      (cd) => cd.customerId === customer!.id && cd.merchantId === merchantId
    );

    const now = new Date();

    if (card) {
      // Check Anti-Cheat Cooldown
      if (!bypassCooldown && card.lastVisitAt && program.antiCheatCooldownMinutes > 0) {
        const lastVisit = new Date(card.lastVisitAt);
        const diffMinutes = Math.floor((now.getTime() - lastVisit.getTime()) / (1000 * 60));
        if (diffMinutes < program.antiCheatCooldownMinutes) {
          const remaining = program.antiCheatCooldownMinutes - diffMinutes;
          return {
            success: false,
            message: `تنبيه أمان وفاء: تم تسجيل زيارة لهذا العميل قبل ${diffMinutes} دقيقة. يجب مرور ${remaining} دقيقة قبل تسجيل الزيارة التالية لمنع التكرار غير المقصود.`,
          };
        }
      }
    }

    let currentVisits = card ? card.currentVisits + 1 : (program.welcomeStamps > 0 ? program.welcomeStamps : 1);
    let totalLifetime = card ? card.totalLifetimeVisits + 1 : 1;
    let rewardEarned = false;
    let updatedUnclaimedRewards: RewardItem[] = card ? [...card.unclaimedRewards] : [];

    // Check if customer reached target
    if (currentVisits >= program.targetVisits) {
      rewardEarned = true;
      const newReward: RewardItem = {
        id: `rwd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cardId: card ? card.id : `card-${customer.id}-${merchantId}`,
        merchantId,
        title: program.rewardTitle,
        earnedAt: now.toISOString(),
        redeemCode: `WFA-${Math.floor(1000 + Math.random() * 9000)}`,
        isRedeemed: false,
      };
      updatedUnclaimedRewards.push(newReward);
      // Reset current visits back to 0 (or remainder)
      currentVisits = currentVisits - program.targetVisits;
    }

    const updatedCard: CustomerCard = {
      id: card ? card.id : `card-${customer.id}-${merchantId}`,
      customerId: customer.id,
      merchantId,
      currentVisits,
      totalLifetimeVisits: totalLifetime,
      rewardsEarnedCount: card ? card.rewardsEarnedCount + (rewardEarned ? 1 : 0) : (rewardEarned ? 1 : 0),
      rewardsRedeemedCount: card ? card.rewardsRedeemedCount : 0,
      unclaimedRewards: updatedUnclaimedRewards,
      lastVisitAt: now.toISOString(),
      joinedAt: card ? card.joinedAt : now.toISOString(),
    };

    // Update state
    setCustomerCards((prev) => {
      const filtered = prev.filter((c) => c.id !== updatedCard.id);
      return [...filtered, updatedCard];
    });

    // Update staff count
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, totalVisitsLogged: s.totalVisitsLogged + 1 };
        }
        return s;
      })
    );

    // Record transaction
    const newTx: VisitTransaction = {
      id: `tx-${Date.now()}`,
      cardId: updatedCard.id,
      customerId: customer.id,
      merchantId,
      branchId: branch?.id || 'main',
      staffId,
      staffName: currentStaffMember.name,
      branchName: branch?.name || 'الفرع الرئيسي',
      customerName: customer.name,
      customerPhone: customer.phone,
      type: rewardEarned ? 'reward_earned' : 'visit_added',
      visitIncrement: 1,
      currentVisitsAfter: currentVisits,
      invoiceRef,
      carPlate: carPlate?.trim() || undefined,
      bookingRef: bookingRef?.trim() || undefined,
      serviceType: serviceType?.trim() || undefined,
      notes,
      createdAt: now.toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Format specific detail for audit and message
    const sectorDetail = carPlate
      ? `لوحة (${carPlate})`
      : bookingRef
      ? `حجز (${bookingRef})`
      : serviceType
      ? `خدمة (${serviceType})`
      : invoiceRef
      ? `فاتورة (${invoiceRef})`
      : 'بدون مرجع';

    // Record audit
    addAuditLog({
      actorRole: 'staff',
      actorName: currentStaffMember.name,
      action: rewardEarned ? 'استحقاق مكافأة ولاء' : 'تسجيل زيارة عميل',
      targetMerchant: merchant.businessName,
      targetCustomer: customer.name,
      details: rewardEarned
        ? `أكمل العميل ${program.targetVisits} ${program.unitName} وحصل على مكافأة (${program.rewardTitle}) - ${sectorDetail}`
        : `تسجيل ${program.unitName} للعميل ${customer.name} - ${sectorDetail}`,
    });

    return {
      success: true,
      message: rewardEarned
        ? `مبروك! تم إكمال ${program.targetVisits} ${program.unitName} واستحقاق المكافأة: ${program.rewardTitle}`
        : `تم تسجيل الـ ${program.unitName} بنجاح! الرصيد الحالي: ${currentVisits} من ${program.targetVisits}`,
      rewardEarned,
      newVisits: currentVisits,
      targetVisits: program.targetVisits,
      card: updatedCard,
    };
  };

  // Redeem Reward (Staff Only)
  const redeemReward = ({
    cardId,
    rewardId,
    redeemCode,
    staffId,
    branchId,
  }: {
    cardId: string;
    rewardId: string;
    redeemCode: string;
    staffId: string;
    branchId: string;
  }) => {
    const card = customerCards.find((c) => c.id === cardId);
    if (!card) return { success: false, message: 'بطاقة الولاء غير موجودة.' };

    const reward = card.unclaimedRewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'المكافأة غير موجودة أو تم استبدالها مسبقاً.' };

    if (reward.isRedeemed) {
      return { success: false, message: 'تنبيه أمان: تم استبدال هذه المكافأة من قبل ولا يمكن استخدامها مجدداً.' };
    }

    // Verify code
    if (redeemCode.trim().toUpperCase() !== reward.redeemCode.toUpperCase()) {
      return { success: false, message: 'رمز التحقق الخاص بالمكافأة غير مطابق.' };
    }

    const currentStaffMember = staff.find((s) => s.id === staffId);
    if (!currentStaffMember || !currentStaffMember.isActive) {
      return { success: false, message: 'الموظف غير مصرح له باعتماد الاستبدال.' };
    }

    const merchant = merchants.find((m) => m.id === card.merchantId);
    const branch = merchant?.branches.find((b) => b.id === branchId) || merchant?.branches[0];
    const customer = customers.find((c) => c.id === card.customerId);

    const now = new Date();

    // Mark reward as redeemed
    const updatedRewards = card.unclaimedRewards.filter((r) => r.id !== rewardId);

    const updatedCard: CustomerCard = {
      ...card,
      rewardsRedeemedCount: card.rewardsRedeemedCount + 1,
      unclaimedRewards: updatedRewards,
    };

    setCustomerCards((prev) => prev.map((c) => (c.id === card.id ? updatedCard : c)));

    // Update staff count
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          return { ...s, totalRewardsRedeemed: s.totalRewardsRedeemed + 1 };
        }
        return s;
      })
    );

    // Record transaction
    const newTx: VisitTransaction = {
      id: `tx-${Date.now()}`,
      cardId: card.id,
      customerId: card.customerId,
      merchantId: card.merchantId,
      branchId: branch?.id || 'main',
      staffId,
      staffName: currentStaffMember.name,
      branchName: branch?.name || 'الفرع الرئيسي',
      customerName: customer?.name || 'عميل وفاء',
      customerPhone: customer?.phone || '',
      type: 'reward_redeemed',
      visitIncrement: 0,
      currentVisitsAfter: card.currentVisits,
      notes: `تم تسليم المكافأة: ${reward.title} برمز ${reward.redeemCode}`,
      createdAt: now.toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Record audit
    addAuditLog({
      actorRole: 'staff',
      actorName: currentStaffMember.name,
      action: 'اعتماد استبدال مكافأة',
      targetMerchant: merchant?.businessName,
      targetCustomer: customer?.name,
      details: `تم اعتماد صرف (${reward.title}) بنجاح للمستهلك برمز ${reward.redeemCode}`,
    });

    return {
      success: true,
      message: `تم اعتماد استبدال المكافأة بنجاح: ${reward.title}`,
      reward: { ...reward, isRedeemed: true, redeemedAt: now.toISOString() },
    };
  };

  // Customer join merchant card
  const joinMerchantCard = (customerId: string, merchantId: string) => {
    const existing = customerCards.find(
      (c) => c.customerId === customerId && c.merchantId === merchantId
    );
    if (existing) return existing;

    const program = programs.find((p) => p.merchantId === merchantId);
    const welcome = program?.welcomeStamps || 0;

    const newCard: CustomerCard = {
      id: `card-${customerId}-${merchantId}`,
      customerId,
      merchantId,
      currentVisits: welcome,
      totalLifetimeVisits: welcome,
      rewardsEarnedCount: 0,
      rewardsRedeemedCount: 0,
      unclaimedRewards: [],
      joinedAt: new Date().toISOString(),
    };

    setCustomerCards((prev) => [...prev, newCard]);
    return newCard;
  };

  // Super Admin operations
  const toggleMerchantStatus = (merchantId: string) => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          const nextStatus = m.status === 'active' ? 'suspended' : 'active';
          addAuditLog({
            actorRole: 'super_admin',
            actorName: 'إدارة منصة وفاء',
            action: nextStatus === 'active' ? 'تفعيل حساب تاجر' : 'إيقاف حساب تاجر',
            targetMerchant: m.businessName,
            details: `تم تغيير حالة حساب التاجر إلى ${nextStatus === 'active' ? 'مفعل' : 'موقوف'}`,
          });
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  const updateMerchantPlan = (merchantId: string, planId: 'basic' | 'plus' | 'pro') => {
    setMerchants((prev) =>
      prev.map((m) => {
        if (m.id === merchantId) {
          const plan = plans.find((p) => p.id === planId);
          addAuditLog({
            actorRole: 'super_admin',
            actorName: 'إدارة منصة وفاء',
            action: 'تغيير باقة تاجر',
            targetMerchant: m.businessName,
            details: `تم تحديث اشتراك المتجر إلى باقة ${plan?.name}`,
          });
          return { ...m, planId };
        }
        return m;
      })
    );
  };

  const updatePricingPlan = (planId: 'basic' | 'plus' | 'pro', data: Partial<PricingPlan>) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id === planId) {
          return { ...p, ...data };
        }
        return p;
      })
    );
    addAuditLog({
      actorRole: 'super_admin',
      actorName: 'إدارة منصة وفاء',
      action: 'تعديل أسعار ومميزات الباقات',
      details: `تم تعديل بيانات باقة ${planId}`,
    });
  };

  const addCategory = (catData: Omit<BusinessCategory, 'id' | 'activeCount'>) => {
    const newCat: BusinessCategory = {
      ...catData,
      id: `cat-${Date.now()}`,
      activeCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
  };

  const updateCategory = (id: string, data: Partial<BusinessCategory>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_categories`);
    localStorage.removeItem(`${STORAGE_KEY}_plans`);
    localStorage.removeItem(`${STORAGE_KEY}_merchants`);
    localStorage.removeItem(`${STORAGE_KEY}_programs`);
    localStorage.removeItem(`${STORAGE_KEY}_staff`);
    localStorage.removeItem(`${STORAGE_KEY}_customers`);
    localStorage.removeItem(`${STORAGE_KEY}_cards`);
    localStorage.removeItem(`${STORAGE_KEY}_txs`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    setCategories(INITIAL_CATEGORIES);
    setPlans(INITIAL_PLANS);
    setMerchants(INITIAL_MERCHANTS);
    setPrograms(INITIAL_PROGRAMS);
    setStaff(INITIAL_STAFF);
    setCustomers(INITIAL_CUSTOMERS);
    setCustomerCards(INITIAL_CUSTOMER_CARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveMerchantId('m-kharj-wash');
    setActiveStaffId('staff-1');
    setActiveCustomerId('cust-saud');
    setActiveRole('public');
  };

  return (
    <WafaContext.Provider
      value={{
        activeRole,
        activeMerchantId,
        activeStaffId,
        activeCustomerId,
        categories,
        plans,
        merchants,
        programs,
        staff,
        customers,
        customerCards,
        transactions,
        auditLogs,
        currentMerchant,
        currentProgram,
        currentStaff,
        currentCustomer,
        currentCustomerCards,
        setRole,
        setActiveMerchantId,
        setActiveStaffId,
        setActiveCustomerId,
        loginAsStaff,
        loginAsMerchant,
        loginOrRegisterCustomer,
        updateMerchantProfile,
        updateLoyaltyProgram,
        addBranch,
        updateBranch,
        addStaff,
        updateStaff,
        deleteStaff,
        registerMerchant,
        findCustomerByQuery,
        addCustomerVisit,
        redeemReward,
        joinMerchantCard,
        toggleMerchantStatus,
        updateMerchantPlan,
        updatePricingPlan,
        addCategory,
        updateCategory,
        resetAllData,
      }}
    >
      {children}
    </WafaContext.Provider>
  );
};

export const useWafa = () => {
  const context = useContext(WafaContext);
  if (!context) {
    throw new Error('useWafa must be used within a WafaProvider');
  }
  return context;
};

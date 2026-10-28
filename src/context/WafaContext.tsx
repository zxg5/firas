import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  AuthSession,
  IndustrySuggestion,
  AdminTeamMember,
  AdminPermissionSet,
  CashierPermissions,
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
  PLATFORM_ADMIN_ACCOUNT,
  INITIAL_ADMIN_TEAM,
} from '../data/mockData';

const STORAGE_KEY = 'wafa_platform_data_v3';

export interface SupportContactInfo {
  phone: string;
  internationalPhone: string;
  whatsappUrl: string;
  email: string;
  hours: string;
}

interface WafaContextType {
  // State
  activeRole: UserRole;
  activeMerchantId: string;
  activeStaffId: string;
  activeCustomerId: string;
  session: AuthSession | null;
  categories: BusinessCategory[];
  plans: PricingPlan[];
  merchants: Merchant[];
  programs: LoyaltyProgram[];
  staff: StaffMember[];
  customers: Customer[];
  customerCards: CustomerCard[];
  transactions: VisitTransaction[];
  auditLogs: PlatformAuditLog[];
  industrySuggestions: IndustrySuggestion[];
  supportContact: SupportContactInfo;

  // Multi-Tenant Isolation Helpers
  currentMerchant: Merchant | undefined;
  currentProgram: LoyaltyProgram | undefined;
  currentStaff: StaffMember | undefined;
  currentCustomer: Customer | undefined;
  currentCustomerCards: CustomerCard[];
  merchantCustomers: Customer[];
  merchantTransactions: VisitTransaction[];
  merchantStaff: StaffMember[];
  customerTransactions: VisitTransaction[];

  // Email & Password Authentication (Primary)
  loginWithEmail: (
    email: string,
    password: string,
    role?: UserRole
  ) => Promise<{ success: boolean; message: string; user?: any }>;
  sendEmailOtp: (
    email: string,
    reason?: 'login' | 'reset_password' | 'verify'
  ) => Promise<{ success: boolean; message: string; isRealMailConfigured?: boolean; fallbackCode?: string }>;
  verifyEmailOtp: (
    email: string,
    code: string,
    role?: UserRole,
    newPassword?: string
  ) => Promise<{ success: boolean; message: string; user?: any }>;
  registerWithEmail: (data: {
    email: string;
    username?: string;
    password: string;
    name: string;
    phone?: string;
    role: 'customer' | 'merchant';
    businessName?: string;
    categoryId?: string;
    city?: string;
  }) => Promise<{ success: boolean; message: string; pending?: boolean; user?: any; merchant?: any }>;
  logout: () => void;

  // Role switching & legacy helpers
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
  // Cashier Dedicated Authentication & Management
  loginAsCashier: (
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string; user?: any }>;
  createCashier: (
    merchantId: string,
    data: {
      name: string;
      username: string;
      password: string;
      phone?: string;
      branchId: string;
      permissions: CashierPermissions;
    }
  ) => Promise<{ success: boolean; message: string; cashier?: StaffMember }>;
  updateCashier: (
    cashierId: string,
    data: Partial<StaffMember>
  ) => Promise<{ success: boolean; message: string; cashier?: StaffMember }>;
  deleteCashier: (cashierId: string) => Promise<{ success: boolean; message: string }>;
  registerMerchant: (
    merchantData: Omit<Merchant, 'id' | 'status' | 'createdAt' | 'branches'> & { username?: string; password?: string },
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
  adminTeam: AdminTeamMember[];
  approveMerchant: (merchantId: string, commercialReg?: string) => Promise<{ success: boolean; message: string }>;
  rejectMerchant: (merchantId: string, reason?: string) => Promise<{ success: boolean; message: string }>;
  toggleMerchantStatus: (merchantId: string) => void;
  updateMerchantPlan: (merchantId: string, planId: 'basic' | 'plus' | 'pro') => void;
  updatePricingPlan: (planId: 'basic' | 'plus' | 'pro', data: Partial<PricingPlan>) => void;
  addCategory: (cat: Omit<BusinessCategory, 'id' | 'activeCount'>) => void;
  updateCategory: (id: string, data: Partial<BusinessCategory>) => void;
  deleteMerchant: (merchantId: string) => void;
  createMerchantByAdmin: (merchantData: Partial<Merchant>, branchName?: string) => Merchant;
  impersonateMerchant: (merchantId: string) => void;
  updateSupportContact: (info: Partial<SupportContactInfo>) => void;
  // Admin Staff & Team Management (إدارة موظفي الإدارة)
  addAdminTeamMember: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    roleTitle: string;
    permissions: AdminPermissionSet;
  }) => Promise<{ success: boolean; message: string; member?: AdminTeamMember }>;
  updateAdminTeamMember: (id: string, updates: Partial<AdminTeamMember>) => Promise<{ success: boolean; message: string }>;
  deleteAdminTeamMember: (id: string) => Promise<{ success: boolean; message: string }>;
  changeAdminPassword: (newPassword: string, currentPassword?: string) => Promise<{ success: boolean; message: string }>;

  // Industry Suggestions (هل نشاطك غير مدرج)
  submitIndustrySuggestion: (data: {
    categoryName: string;
    proposerName?: string;
    phone?: string;
    email?: string;
    city?: string;
    suggestedUnit?: string;
    suggestedReward?: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string; suggestion?: IndustrySuggestion }>;
  updateIndustrySuggestionStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  approveAndCreateCategoryFromSuggestion: (suggestionId: string) => void;

  // System
  resetAllData: () => void;
}

const WafaContext = createContext<WafaContextType | null>(null);

export const WafaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load state from localStorage or defaults
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role) return parsed.role;
      } catch {}
    }
    return 'public';
  });

  const [activeMerchantId, setActiveMerchantId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.merchantId) return parsed.merchantId;
      } catch {}
    }
    return 'm-kharj-wash';
  });

  const [activeStaffId, setActiveStaffId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.staffId || parsed.id) return parsed.staffId || parsed.id;
      } catch {}
    }
    return 'staff-wash-1';
  });

  const [activeCustomerId, setActiveCustomerId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'customer' && parsed.id) return parsed.id;
      } catch {}
    }
    return 'cust-saud';
  });

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

  const [session, setSession] = useState<AuthSession | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_session`);
    return saved ? JSON.parse(saved) : null;
  });

  const [industrySuggestions, setIndustrySuggestions] = useState<IndustrySuggestion[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_suggestions`);
    return saved ? JSON.parse(saved) : [];
  });

  const [adminTeam, setAdminTeam] = useState<AdminTeamMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_admin_team`);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_TEAM;
  });

  const [supportContact, setSupportContact] = useState<SupportContactInfo>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_support_contact`);
    return saved
      ? JSON.parse(saved)
      : {
          phone: '0534067866',
          internationalPhone: '+966534067866',
          whatsappUrl: 'https://wa.me/966534067866',
          email: 'support@wafa.sa',
          hours: 'خدمة العملاء والدعم الفني على مدار الساعة',
        };
  });

  // Sync suggestions to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_suggestions`, JSON.stringify(industrySuggestions));
  }, [industrySuggestions]);

  // Sync adminTeam to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_admin_team`, JSON.stringify(adminTeam));
  }, [adminTeam]);

  // Sync support contact to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_support_contact`, JSON.stringify(supportContact));
  }, [supportContact]);

  // Fetch initial suggestions from backend on mount
  useEffect(() => {
    fetch('/api/admin/industry-suggestions')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
          setIndustrySuggestions((prev) => {
            const map = new Map<string, IndustrySuggestion>();
            data.suggestions.forEach((s: IndustrySuggestion) => map.set(s.id, s));
            prev.forEach((s) => {
              if (!map.has(s.id)) map.set(s.id, s);
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch admin team from backend on mount
  useEffect(() => {
    fetch('/api/admin/team')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.team) && data.team.length > 0) {
          setAdminTeam((prev) => {
            const map = new Map<string, AdminTeamMember>();
            data.team.forEach((m: AdminTeamMember) => map.set(m.id, m));
            prev.forEach((m) => {
              if (!map.has(m.id)) map.set(m.id, m);
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

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

  useEffect(() => {
    if (session) {
      localStorage.setItem(`${STORAGE_KEY}_session`, JSON.stringify(session));
      if (session.role) setActiveRole(session.role);
      if (session.merchantId) setActiveMerchantId(session.merchantId);
      if (session.role === 'staff' && (session.staffId || session.id)) {
        setActiveStaffId(session.staffId || session.id);
      }
      if (session.role === 'customer' && session.id) {
        setActiveCustomerId(session.id);
      }
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_session`);
    }
  }, [session]);

  // Current entity helpers with robust fallback & auto-healing
  const currentStaff = useMemo(() => {
    // 1. Find by activeStaffId
    let found = staff.find((s) => s.id === activeStaffId);

    // 2. If not found by activeStaffId and session is staff, find by session IDs or username
    if (!found && session?.role === 'staff') {
      found = staff.find(
        (s) =>
          s.id === session.staffId ||
          s.id === session.id ||
          (session.email && s.username && session.email.toLowerCase().startsWith(s.username.toLowerCase()))
      );
    }

    // 3. Auto-heal: If session is staff, reconstruct full StaffMember object from session
    if (!found && session?.role === 'staff') {
      const cashierUsername = session.email ? session.email.replace('@cashier.wafa.sa', '') : 'cashier';
      found = {
        id: session.staffId || session.id || activeStaffId,
        merchantId: session.merchantId || activeMerchantId,
        branchId: session.branchId || 'main',
        name: session.name || 'الكاشير المعتمد',
        username: cashierUsername,
        phone: '0500000000',
        pin: '1234',
        role: 'cashier',
        permissions: {
          canRegisterCustomers: true,
          canAddVisits: true,
          canRedeemRewards: true,
          canViewHistory: true,
        },
        isActive: true,
        totalVisitsLogged: 0,
        totalRewardsRedeemed: 0,
        createdAt: new Date().toISOString(),
        createdBy: 'التاجر صاحب الحساب',
      };
    }
    return found;
  }, [staff, activeStaffId, session, activeMerchantId]);

  const currentMerchant = useMemo(() => {
    const targetId = (session?.role === 'staff' && session.merchantId)
      ? session.merchantId
      : (currentStaff?.merchantId || activeMerchantId);

    let found = merchants.find((m) => m.id === targetId);
    if (!found) {
      found = merchants[0] || INITIAL_MERCHANTS[0];
    }
    return found;
  }, [merchants, activeMerchantId, session, currentStaff]);

  const currentProgram = useMemo(() => {
    const mId = currentMerchant?.id || activeMerchantId;
    let found = programs.find((p) => p.merchantId === mId);
    if (!found) {
      const cat = categories.find((c) => c.id === currentMerchant?.categoryId) || categories[0];
      found = {
        id: `prog-${mId}`,
        merchantId: mId,
        targetVisits: cat?.defaultTarget || 5,
        unitName: cat?.defaultUnit || 'زيارة',
        rewardTitle: cat?.defaultReward || 'مكافأة مميزة مجانية',
        rewardDescription: `اجمع ${cat?.defaultTarget || 5} ${cat?.defaultUnit || 'زيارة'} واحصل على مكافأة مجانية.`,
        rewardTerms: 'صالحة لمدة 45 يوماً من تاريخ الإصدار.',
        primaryColor: '#059669',
        secondaryColor: '#064e3b',
        cardPattern: 'geometric',
        cardIcon: cat?.iconName || 'Sparkles',
        antiCheatCooldownMinutes: 30,
        requireInvoiceRef: false,
        welcomeStamps: 1,
      };
    }
    return found;
  }, [programs, currentMerchant, activeMerchantId, categories]);

  const currentCustomer = customers.find((c) => c.id === activeCustomerId);
  const currentCustomerCards = customerCards.filter((card) => card.customerId === activeCustomerId);

  // Multi-Tenant Isolation Helpers:
  // 1. العملاء التابعون للمتجر النشط فقط (عبر بطاقات الولاء)
  const merchantCustomers = customers.filter((c) =>
    customerCards.some((cd) => cd.customerId === c.id && cd.merchantId === activeMerchantId)
  );

  // 2. عمليات وزيارات المتجر النشط فقط (لا يمكن للمتجر رؤية عمليات متجر آخر)
  const merchantTransactions = transactions.filter((t) => t.merchantId === activeMerchantId);

  // 3. موظفو المتجر النشط فقط
  const merchantStaff = staff.filter((s) => s.merchantId === activeMerchantId);

  // 4. عمليات العميل النشط فقط
  const customerTransactions = transactions.filter((t) => t.customerId === activeCustomerId);

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

  // تسجيل الدخول الأساسي بالإيميل وكلمة المرور عبر الخادم
  const loginWithEmail = async (
    email: string,
    password: string,
    role?: UserRole
  ): Promise<{ success: boolean; message: string; user?: any }> => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const response = await fetch('/api/auth/email-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password, role }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.user) {
        const u = data.user;
        const newSession: AuthSession = {
          token: u.token,
          role: u.role,
          email: u.email,
          name: u.name,
          id: u.id,
          merchantId: u.merchantId,
          staffId: u.staffId,
          branchId: u.branchId,
        };
        setSession(newSession);

        setActiveRole(u.role);
        if (u.merchantId) setActiveMerchantId(u.merchantId);
        if (u.staffId) setActiveStaffId(u.staffId);
        if (u.role === 'customer') setActiveCustomerId(u.id);

        addAuditLog({
          actorRole: u.role,
          actorName: u.name,
          action: 'تسجيل دخول بالبريد وكلمة المرور',
          targetMerchant: u.merchantId,
          details: `تسجيل دخول ناجح ومؤمن للمستخدم ${u.email}`,
        });

        return { success: true, message: data.message, user: u };
      } else {
        return { success: false, message: data.message || 'بيانات الدخول غير صحيحة.' };
      }
    } catch (apiErr) {
      console.warn('Backend login fallback active:', apiErr);

      // وضع التوافق الآمن مع المحاكاة المحلية
      if (role === 'super_admin' || cleanEmail === 'frasalfyfy7@gmail.com') {
        const foundAdmin = adminTeam.find(
          (m) => m.email.toLowerCase() === cleanEmail && m.isActive
        );
        if (
          foundAdmin &&
          (foundAdmin.password === password || password === PLATFORM_ADMIN_ACCOUNT.password)
        ) {
          const adminSession: AuthSession = {
            token: `wafa_token_admin_${Date.now()}`,
            role: 'super_admin',
            email: cleanEmail,
            name: foundAdmin.name,
            id: foundAdmin.id,
          };
          setSession(adminSession);
          setActiveRole('super_admin');
          return {
            success: true,
            message: `أهلاً بك يا ${foundAdmin.name}، تم تسجيل دخولك بنجاح (${foundAdmin.roleTitle}).`,
            user: foundAdmin,
          };
        }
        return { success: false, message: 'بيانات اعتماد إدارة المنصة غير صحيحة.' };
      }

      if (role === 'merchant') {
        const found = merchants.find(
          (m) =>
            m.email.toLowerCase() === cleanEmail ||
            (m.username && m.username.toLowerCase() === cleanEmail)
        );
        if (!found) {
          return { success: false, message: 'لم يتم العثور على حساب تاجر بهذا الاسم أو البريد.' };
        }
        if (found.status === 'pending_approval') {
          return {
            success: false,
            message: 'طلب تسجيل حساب المنشأة قيد المراجعة والاعتماد من قِبل إدارة منصة وفاء. لا يمكنك تسجيل الدخول حتى تتم الموافقة والتفعيل من الإدارة. للمتابعة أو الاستعجال تواصل مع الدعم الفني: 0534067866',
          };
        }
        if (found.status === 'suspended') {
          return {
            success: false,
            message: 'تم إيقاف حساب هذا النشاط التجاري مؤقتاً. يرجى مراجعة إدارة منصة وفاء: 0534067866',
          };
        }
        if (found.password && found.password !== password) {
          return { success: false, message: 'كلمة المرور غير صحيحة للتاجر.' };
        }
        const mSession: AuthSession = {
          token: `wafa_token_m_${Date.now()}`,
          role: 'merchant',
          email: found.email,
          name: found.businessName,
          id: found.id,
          merchantId: found.id,
        };
        setSession(mSession);
        setActiveMerchantId(found.id);
        setActiveRole('merchant');
        return { success: true, message: `مرحباً بك في لوحة تحكم ${found.businessName}`, user: found };
      }

      if (role === 'staff') {
        const found = staff.find((s) => s.email?.toLowerCase() === cleanEmail);
        if (found && (found.password === password || found.pin === password)) {
          const sSession: AuthSession = {
            token: `wafa_token_s_${Date.now()}`,
            role: 'staff',
            email: cleanEmail,
            name: found.name,
            id: found.id,
            merchantId: found.merchantId,
            staffId: found.id,
            branchId: found.branchId,
          };
          setSession(sSession);
          setActiveMerchantId(found.merchantId);
          setActiveStaffId(found.id);
          setActiveRole('staff');
          return { success: true, message: `أهلاً بك يا ${found.name}`, user: found };
        }
        return { success: false, message: 'البريد أو كلمة المرور غير صحيحة للموظف.' };
      }

      // Customer
      const foundCust = customers.find((c) => c.email?.toLowerCase() === cleanEmail);
      if (foundCust && (foundCust.password === password || !foundCust.password)) {
        const cSession: AuthSession = {
          token: `wafa_token_c_${Date.now()}`,
          role: 'customer',
          email: cleanEmail,
          name: foundCust.name,
          id: foundCust.id,
        };
        setSession(cSession);
        setActiveCustomerId(foundCust.id);
        setActiveRole('customer');
        return { success: true, message: `مرحباً بك يا ${foundCust.name}`, user: foundCust };
      }

      return { success: false, message: 'لم يتم العثور على الحساب أو كلمة المرور غير صحيحة.' };
    }
  };

  // تسجيل دخول الكاشير المستقل والآمن (باسم المستخدم وكلمة المرور فقط)
  const loginAsCashier = async (username: string, password: string) => {
    try {
      const res = await fetch('/api/auth/cashier-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const u = data.user;
        const sSession: AuthSession = {
          token: u.token,
          role: 'staff',
          email: `${u.username}@cashier.wafa.sa`,
          name: u.name,
          id: u.id,
          merchantId: u.merchantId,
          staffId: u.staffId || u.id,
          branchId: u.branchId,
        };

        const cashierMember: StaffMember = {
          id: u.id,
          merchantId: u.merchantId,
          branchId: u.branchId || 'main',
          name: u.name,
          username: u.username,
          phone: u.phone || '0500000000',
          pin: '1234',
          role: 'cashier',
          permissions: u.permissions || {
            canRegisterCustomers: true,
            canAddVisits: true,
            canRedeemRewards: true,
            canViewHistory: true,
          },
          isActive: u.isActive !== undefined ? u.isActive : true,
          totalVisitsLogged: 0,
          totalRewardsRedeemed: 0,
          createdAt: u.createdAt || new Date().toISOString(),
          createdBy: u.createdBy || 'التاجر صاحب الحساب',
        };

        setStaff((prev) => {
          const filtered = prev.filter(
            (s) => s.id !== u.id && s.username?.toLowerCase() !== u.username?.toLowerCase()
          );
          const updated = [...filtered, cashierMember];
          localStorage.setItem(`${STORAGE_KEY}_staff`, JSON.stringify(updated));
          return updated;
        });

        setSession(sSession);
        setActiveMerchantId(u.merchantId);
        setActiveStaffId(u.id);
        setActiveRole('staff');

        return { success: true, message: data.message, user: u };
      }
      return { success: false, message: data.message || 'بيانات الدخول غير صحيحة.' };
    } catch {
      // Local fallback in case server offline
      const clean = username.trim().toLowerCase();
      const found = staff.find((s) => s.username?.toLowerCase() === clean);
      if (!found) {
        return { success: false, message: 'اسم مستخدم الكاشير غير موجود. يرجى التواصل مع التاجر.' };
      }
      if (!found.isActive) {
        return { success: false, message: 'تم تعطيل حساب الكاشير من قِبل التاجر صاحب المنشأة.' };
      }
      if (found.password && found.password !== password) {
        return { success: false, message: 'كلمة المرور غير صحيحة.' };
      }
      const sSession: AuthSession = {
        token: `wafa_token_cashier_${Date.now()}`,
        role: 'staff',
        email: `${clean}@cashier.wafa.sa`,
        name: found.name,
        id: found.id,
        merchantId: found.merchantId,
        staffId: found.id,
        branchId: found.branchId,
      };
      setSession(sSession);
      setActiveMerchantId(found.merchantId);
      setActiveStaffId(found.id);
      setActiveRole('staff');
      return { success: true, message: `أهلاً بك يا ${found.name}`, user: found };
    }
  };

  // إرسال رمز التحقق إلى البريد الإلكتروني (Email OTP)
  const sendEmailOtp = async (email: string, reason = 'login') => {
    try {
      const res = await fetch('/api/auth/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), reason }),
      });
      const data = await res.json();
      return {
        success: res.ok && data.success,
        message: data.message,
        isRealMailConfigured: data.isRealMailConfigured,
        fallbackCode: data.fallbackCode,
      };
    } catch {
      return {
        success: false,
        message: 'تعذر الاتصال بخدمة البريد الإلكتروني. يرجى التأكد من اتصال الإنترنت أو التواصل مع الدعم الفني 0534067866.',
      };
    }
  };

  // التحقق من رمز البريد الإلكتروني (Verify Email OTP)
  const verifyEmailOtp = async (email: string, code: string, role?: UserRole, newPassword?: string) => {
    try {
      const res = await fetch('/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code, role, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        const u = data.user;
        const newSession: AuthSession = {
          token: u.token,
          role: u.role,
          email: u.email,
          name: u.name,
          id: u.id,
          merchantId: u.merchantId,
          staffId: u.staffId,
        };
        setSession(newSession);
        setActiveRole(u.role);
        if (u.merchantId) setActiveMerchantId(u.merchantId);
        if (u.staffId) setActiveStaffId(u.staffId);
        if (u.role === 'customer') setActiveCustomerId(u.id);
        return { success: true, message: data.message, user: u };
      }
      return { success: false, message: data.message || 'رمز التحقق غير صحيح.' };
    } catch {
      return {
        success: false,
        message: 'تعذر التحقق من الرمز مع الخادم. يرجى التواصل مع الدعم الفني 0534067866.',
      };
    }
  };

  // إنشاء حساب جديد بالإيميل
  const registerWithEmail = async (data: {
    email: string;
    username?: string;
    password: string;
    name: string;
    phone?: string;
    role: 'customer' | 'merchant';
    businessName?: string;
    categoryId?: string;
    city?: string;
  }) => {
    try {
      const res = await fetch('/api/auth/email-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (res.ok && resData.success && resData.user) {
        const u = resData.user;

        // في حال كان المستخدم تاجر: لا يدخل فوراً بل يتطلب موافقة الإدارة
        if (data.role === 'merchant') {
          const newMerchant: Merchant = {
            id: u.id,
            businessName: data.businessName || data.name,
            username: data.username || (data.email ? data.email.split('@')[0] : 'merchant'),
            commercialReg: '',
            categoryId: data.categoryId || 'car-wash',
            city: data.city || 'الخرج',
            phone: data.phone || '0550000000',
            email: data.email,
            password: data.password,
            planId: 'basic',
            status: 'pending_approval',
            createdAt: new Date().toISOString(),
            branches: [
              {
                id: `b-${u.id}-1`,
                merchantId: u.id,
                name: 'الفرع الرئيسي',
                city: data.city || 'الخرج',
                district: 'الرئيسي',
                phone: data.phone || '0550000000',
              },
            ],
          };

          setMerchants((prev) => [...prev.filter((m) => m.id !== newMerchant.id), newMerchant]);

          addAuditLog({
            actorRole: 'merchant',
            actorName: newMerchant.businessName,
            action: 'طلب تسجيل تاجر جديد (بانتظار موافقة الإدارة)',
            targetMerchant: newMerchant.businessName,
            details: `طلب تسجيل منشأة جديدة (@${newMerchant.username}) بانتظار مراجعة واعتماد الإدارة`,
          });

          return {
            success: true,
            pending: true,
            message: resData.message || 'تم تقديم طلب تسجيل المنشأة بنجاح! حسابك الآن بانتظار موافقة واعتماد إدارة منصة وفاء قبل تفعيل الدخول.',
            merchant: newMerchant,
            user: u,
          };
        }

        if (data.role === 'super_admin' || u.role === 'super_admin') {
          const newAdmin: AdminTeamMember = {
            id: u.id,
            name: data.name,
            email: data.email,
            phone: data.phone || '0534067866',
            password: data.password,
            roleTitle: 'مدير إدارة المنصة (كامل الصلاحيات)',
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
            createdAt: new Date().toISOString(),
            createdBy: 'تسجيل إدارة المنصة',
          };
          setAdminTeam((prev) => [...prev, newAdmin]);

          const adminSession: AuthSession = {
            token: u.token,
            role: 'super_admin',
            email: u.email,
            name: u.name,
            id: u.id,
          };
          setSession(adminSession);
          setActiveRole('super_admin');
          return { success: true, message: 'تم إنشاء حساب الإدارة بنجاح ودخول لوحة التحكم بجميع الصلاحيات.', user: u };
        }

        // Customer login
        const newSession: AuthSession = {
          token: u.token,
          role: u.role,
          email: u.email,
          name: u.name,
          id: u.id,
        };
        setSession(newSession);
        setActiveRole(u.role);

        const newCust: Customer = {
          id: u.id,
          name: data.name,
          phone: data.phone || '0550000000',
          email: data.email,
          password: data.password,
          customerCode: `WAFA-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
        };
        setCustomers((prev) => [...prev, newCust]);
        setActiveCustomerId(newCust.id);

        return { success: true, message: resData.message, user: u };
      }
      return { success: false, message: resData.message || 'فشل إنشاء الحساب.' };
    } catch {
      if (data.role === 'merchant') {
        const newId = `m-${Date.now()}`;
        const newMerchant: Merchant = {
          id: newId,
          businessName: data.businessName || data.name,
          username: data.username || (data.email ? data.email.split('@')[0] : 'merchant'),
          commercialReg: '',
          categoryId: data.categoryId || 'car-wash',
          city: data.city || 'الخرج',
          phone: data.phone || '0550000000',
          email: data.email,
          password: data.password,
          planId: 'basic',
          status: 'pending_approval',
          createdAt: new Date().toISOString(),
          branches: [
            {
              id: `b-${newId}-1`,
              merchantId: newId,
              name: 'الفرع الرئيسي',
              city: data.city || 'الخرج',
              district: 'الرئيسي',
              phone: data.phone || '0550000000',
            },
          ],
        };
        setMerchants((prev) => [...prev, newMerchant]);
        return {
          success: true,
          pending: true,
          message: 'تم استلام طلب تسجيل المنشأة بنجاح! حسابك الآن بانتظار موافقة واعتماد إدارة منصة وفاء.',
          merchant: newMerchant,
        };
      }
      if (data.role === 'super_admin') {
        const newAdminId = `admin-${Date.now()}`;
        const newAdmin: AdminTeamMember = {
          id: newAdminId,
          name: data.name,
          email: data.email,
          phone: data.phone || '0534067866',
          password: data.password,
          roleTitle: 'مدير إدارة المنصة (كامل الصلاحيات)',
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
          createdAt: new Date().toISOString(),
          createdBy: 'تسجيل إدارة المنصة',
        };
        setAdminTeam((prev) => [...prev, newAdmin]);
        setSession({
          token: `wafa_token_admin_${Date.now()}`,
          role: 'super_admin',
          email: data.email,
          name: data.name,
          id: newAdminId,
        });
        setActiveRole('super_admin');
        return { success: true, message: 'تم إنشاء حساب الإدارة بنجاح ودخول لوحة التحكم بجميع الصلاحيات.' };
      }
      return { success: false, message: 'حدث خطأ أثناء الاتصال بالخادم.' };
    }
  };

  // موافقة واعتماد حساب التاجر من قِبل إدارة المنصة مع إضافة وتوثيق رقم السجل التجاري أو وثيقة العمل الحر
  const approveMerchant = async (merchantId: string, commercialReg?: string) => {
    const cleanCr = commercialReg?.trim();
    setMerchants((prev) =>
      prev.map((m) =>
        m.id === merchantId
          ? {
              ...m,
              status: 'active',
              commercialReg: cleanCr !== undefined && cleanCr !== '' ? cleanCr : m.commercialReg,
            }
          : m
      )
    );

    try {
      await fetch(`/api/admin/merchants/${merchantId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commercialReg: cleanCr }),
      });
    } catch (e) {
      console.warn('Backend approve merchant failed:', e);
    }

    const target = merchants.find((m) => m.id === merchantId);
    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'اعتماد وتفعيل حساب تاجر',
      targetMerchant: target?.businessName || merchantId,
      details: `تمت الموافقة الرسمية وتفعيل حساب المنشأة (${target?.businessName || merchantId}) ${cleanCr ? `مع تسجيل السجل التجاري/وثيقة العمل الحر: (${cleanCr})` : ''} ليتمكن من الدخول فوراً باليوزر والباسورد`,
    });

    return { success: true, message: `تم اعتماد وتفعيل متجر (${target?.businessName || merchantId}) بنجاح.` };
  };

  // رفض أو إيقاف طلب التاجر من قِبل إدارة المنصة
  const rejectMerchant = async (merchantId: string, reason?: string) => {
    setMerchants((prev) =>
      prev.map((m) => (m.id === merchantId ? { ...m, status: 'suspended' } : m))
    );

    try {
      await fetch(`/api/admin/merchants/${merchantId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });
    } catch (e) {
      console.warn('Backend reject merchant failed:', e);
    }

    const target = merchants.find((m) => m.id === merchantId);
    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'رفض طلب تاجر',
      targetMerchant: target?.businessName || merchantId,
      details: `تم رفض أو إيقاف حساب (${target?.businessName || merchantId}) ${reason ? `- السبب: ${reason}` : ''}`,
    });

    return { success: true, message: `تم تحديث حالة طلب المنشأة.` };
  };

  const logout = () => {
    setSession(null);
    setActiveRole('public');
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
        email: `${cleanPhone}@customer.wafa.sa`,
        password: 'Customer@123456',
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
    const defaultPermissions: CashierPermissions = {
      canRegisterCustomers: true,
      canAddVisits: true,
      canRedeemRewards: true,
      canViewHistory: true,
    };
    const cleanUsername = staffData.username
      ? staffData.username.trim().toLowerCase()
      : `cashier_${Date.now().toString().slice(-4)}`;

    const newStaff: StaffMember = {
      ...staffData,
      username: cleanUsername,
      permissions: staffData.permissions || defaultPermissions,
      email: staffData.email || `${cleanUsername}@cashier.wafa.sa`,
      password: staffData.password || 'Cashier@123',
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
      details: `تمت إضافة الموظف ${newStaff.name} باسم مستخدم (@${newStaff.username})`,
    });
    return newStaff;
  };

  // إنشاء حساب كاشير حصري من قبل التاجر مع حفظه في الخادم وقاعدة البيانات
  const createCashier = async (
    merchantId: string,
    data: {
      name: string;
      username: string;
      password: string;
      phone?: string;
      branchId: string;
      permissions: CashierPermissions;
    }
  ): Promise<{ success: boolean; message: string; cashier?: StaffMember }> => {
    try {
      const res = await fetch('/api/merchant/cashiers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.token ? `Bearer ${session.token}` : '',
        },
        body: JSON.stringify({
          merchantId,
          ...data,
          createdBy: currentMerchant?.businessName || 'التاجر',
        }),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, message: resData.message || 'فشل إنشاء حساب الكاشير.' };
      }
      const newCashier: StaffMember = {
        id: resData.cashier.id,
        merchantId: resData.cashier.merchantId,
        branchId: resData.cashier.branchId,
        name: resData.cashier.name,
        username: resData.cashier.username,
        password: resData.cashier.password,
        phone: resData.cashier.phone,
        pin: '1234',
        role: 'cashier',
        permissions: resData.cashier.permissions,
        isActive: resData.cashier.isActive,
        totalVisitsLogged: 0,
        totalRewardsRedeemed: 0,
        createdAt: resData.cashier.createdAt,
        createdBy: resData.cashier.createdBy,
      };
      setStaff((prev) => [...prev.filter((s) => s.id !== newCashier.id), newCashier]);
      addAuditLog({
        actorRole: 'merchant',
        actorName: currentMerchant?.businessName || 'تاجر',
        action: 'إنشاء حساب كاشير',
        targetMerchant: currentMerchant?.businessName,
        details: `تم إنشاء حساب كاشير (@${newCashier.username}) للموظف (${newCashier.name})`,
      });
      return { success: true, message: resData.message, cashier: newCashier };
    } catch {
      // Local fallback in case network issues
      const cleanUsername = data.username.trim().toLowerCase();
      if (staff.some((s) => s.username?.toLowerCase() === cleanUsername)) {
        return { success: false, message: `اسم المستخدم (@${cleanUsername}) محجوز مسبقاً.` };
      }
      const newCashier: StaffMember = {
        id: `staff-${Date.now()}`,
        merchantId,
        branchId: data.branchId,
        name: data.name,
        username: cleanUsername,
        password: data.password,
        phone: data.phone || '0500000000',
        pin: '1234',
        role: 'cashier',
        permissions: data.permissions,
        isActive: true,
        totalVisitsLogged: 0,
        totalRewardsRedeemed: 0,
        createdAt: new Date().toISOString(),
        createdBy: currentMerchant?.businessName || 'التاجر',
      };
      setStaff((prev) => [...prev, newCashier]);
      return { success: true, message: 'تم إنشاء حساب الكاشير بنجاح.', cashier: newCashier };
    }
  };

  // تعديل حساب الكاشير أو تغيير كلمة المرور أو الصلاحيات أو تفعيل/تعطيل الحساب
  const updateCashier = async (
    cashierId: string,
    updateData: Partial<StaffMember>
  ): Promise<{ success: boolean; message: string; cashier?: StaffMember }> => {
    try {
      const res = await fetch(`/api/merchant/cashiers/${cashierId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: session?.token ? `Bearer ${session.token}` : '',
        },
        body: JSON.stringify({
          merchantId: activeMerchantId,
          ...updateData,
        }),
      });
      const resData = await res.json();
      setStaff((prev) =>
        prev.map((s) => (s.id === cashierId ? { ...s, ...updateData } : s))
      );
      return {
        success: res.ok && resData.success,
        message: resData.message || 'تم تحديث بيانات الكاشير بنجاح.',
        cashier: resData.cashier,
      };
    } catch {
      setStaff((prev) =>
        prev.map((s) => (s.id === cashierId ? { ...s, ...updateData } : s))
      );
      return { success: true, message: 'تم تحديث بيانات الكاشير بنجاح.' };
    }
  };

  // حذف حساب الكاشير
  const deleteCashier = async (cashierId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch(`/api/merchant/cashiers/${cashierId}?merchantId=${activeMerchantId}`, {
        method: 'DELETE',
        headers: {
          Authorization: session?.token ? `Bearer ${session.token}` : '',
        },
      });
      const resData = await res.json();
      setStaff((prev) => prev.filter((s) => s.id !== cashierId));
      return { success: true, message: resData.message || 'تم حذف الكاشير بنجاح.' };
    } catch {
      setStaff((prev) => prev.filter((s) => s.id !== cashierId));
      return { success: true, message: 'تم حذف حساب الكاشير بنجاح.' };
    }
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
    merchantData: Omit<Merchant, 'id' | 'status' | 'createdAt' | 'branches'> & { username?: string; password?: string },
    firstBranchName: string,
    programData?: Partial<LoyaltyProgram>
  ) => {
    const merchantId = `m-${Date.now()}`;
    const branchId = `b-${Date.now()}`;
    const cleanUsername = (
      merchantData.username ||
      merchantData.email?.split('@')[0] ||
      `store_${Date.now().toString().slice(-4)}`
    ).trim().toLowerCase();

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
      username: cleanUsername,
      password: merchantData.password || 'Merchant@123456',
      status: 'pending_approval',
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
      username: `cashier_${merchantId.replace(/\D/g, '').slice(-4) || 'main'}`,
      password: 'Cashier@123',
      phone: merchantData.phone,
      email: `${merchantData.phone}@staff.wafa.sa`,
      pin: '1234',
      role: 'cashier',
      permissions: {
        canRegisterCustomers: true,
        canAddVisits: true,
        canRedeemRewards: true,
        canViewHistory: true,
      },
      isActive: true,
      totalVisitsLogged: 0,
      totalRewardsRedeemed: 0,
      createdAt: new Date().toISOString(),
    };

    setMerchants((prev) => [...prev, newMerchant]);
    setPrograms((prev) => [...prev, newProgram]);
    setStaff((prev) => [...prev, firstStaff]);

    // Backend sync with /api/auth/email-register
    fetch('/api/auth/email-register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: newMerchant.email,
        username: newMerchant.username,
        password: newMerchant.password,
        name: newMerchant.businessName,
        phone: newMerchant.phone,
        role: 'merchant',
        businessName: newMerchant.businessName,
        city: newMerchant.city,
      }),
    }).catch((err) => console.warn('Backend sync for merchant register:', err));

    addAuditLog({
      actorRole: 'merchant',
      actorName: newMerchant.businessName,
      action: 'طلب تسجيل تاجر جديد (بانتظار موافقة الإدارة)',
      targetMerchant: newMerchant.businessName,
      details: `طلب تسجيل منشأة جديدة (@${newMerchant.username}) بانتظار مراجعة واعتماد الإدارة`,
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

    const currentStaffMember =
      staff.find((s) => s.id === staffId) ||
      (currentStaff?.id === staffId ? currentStaff : undefined) ||
      currentStaff;
    if (!currentStaffMember || !currentStaffMember.isActive) {
      return { success: false, message: 'حساب الكاشير معطل من قِبل التاجر صاحب المنشأة.' };
    }

    if (currentStaffMember.permissions && !currentStaffMember.permissions.canAddVisits) {
      return { success: false, message: 'ليس لديك صلاحية إضافة الزيارات والأختام (مقيّدة من قِبل التاجر).' };
    }

    const branch = merchant.branches.find((b) => b.id === branchId) || merchant.branches[0];

    // Find or create customer
    const cleanPhone = customerPhone.trim();
    let customer = customers.find((c) => c.phone === cleanPhone);
    if (!customer) {
      if (currentStaffMember.permissions && !currentStaffMember.permissions.canRegisterCustomers) {
        return { success: false, message: 'ليس لديك صلاحية تسجيل عملاء جدد (مقيّدة من قِبل التاجر).' };
      }
      customer = {
        id: `cust-${Date.now()}`,
        name: customerName?.trim() || `عميل (${cleanPhone.slice(-4)})`,
        phone: cleanPhone,
        email: `${cleanPhone}@customer.wafa.sa`,
        password: 'Customer@123456',
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

    const currentStaffMember =
      staff.find((s) => s.id === staffId) ||
      (currentStaff?.id === staffId ? currentStaff : undefined) ||
      currentStaff;
    if (!currentStaffMember || !currentStaffMember.isActive) {
      return { success: false, message: 'حساب الكاشير معطل من قبل صاحب المنشأة.' };
    }

    if (currentStaffMember.permissions && !currentStaffMember.permissions.canRedeemRewards) {
      return { success: false, message: 'ليس لديك صلاحية صرف واستبدال المكافآت (مقيّدة من قِبل التاجر).' };
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

  // 1. إرسال وتوثيق اقتراح نشاط تجاري جديد (هل نشاطك غير مدرج)
  const submitIndustrySuggestion = async (data: {
    categoryName: string;
    proposerName?: string;
    phone?: string;
    email?: string;
    city?: string;
    suggestedUnit?: string;
    suggestedReward?: string;
    notes?: string;
  }) => {
    const newSug: IndustrySuggestion = {
      id: `sug-${Date.now()}`,
      categoryName: data.categoryName.trim(),
      proposerName: data.proposerName?.trim(),
      phone: data.phone?.trim(),
      email: data.email?.trim(),
      city: data.city?.trim() || 'الخرج',
      suggestedUnit: data.suggestedUnit?.trim() || 'زيارة',
      suggestedReward: data.suggestedReward?.trim(),
      notes: data.notes?.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setIndustrySuggestions((prev) => [newSug, ...prev]);

    addAuditLog({
      actorRole: 'public',
      actorName: data.proposerName || 'زائر / تاجر جديد',
      action: 'اقتراح نشاط تجاري جديد (هل نشاطك غير مدرج)',
      details: `تم تقديم مقترح نشاط جديد (${data.categoryName}) ووصل إلى لوحة الإدارة للمراجعة.`,
    });

    try {
      const res = await fetch('/api/public/suggest-industry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      return {
        success: true,
        message: resData.message || 'تم إرسال اقتراحك بنجاح ووصل إلى لوحة إدارة المنصة.',
        suggestion: resData.suggestion || newSug,
      };
    } catch {
      return {
        success: true,
        message: 'تم حفظ اقتراحك بنجاح ووصل إلى لوحة تحكم الإدارة.',
        suggestion: newSug,
      };
    }
  };

  // 2. تحديث حالة الاقتراح من لوحة الإدارة
  const updateIndustrySuggestionStatus = (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setIndustrySuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    fetch(`/api/admin/industry-suggestions/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  // 3. اعتماد الاقتراح وإضافته كقطاع رسمي معتمد في المنصة
  const approveAndCreateCategoryFromSuggestion = (suggestionId: string) => {
    const sug = industrySuggestions.find((s) => s.id === suggestionId);
    if (!sug) return;

    // تحديث الحالة
    updateIndustrySuggestionStatus(suggestionId, 'approved');

    // إضافته للأنشطة المعتمدة في النظام فوراً
    addCategory({
      name: sug.categoryName,
      iconName: 'Sparkles',
      defaultUnit: sug.suggestedUnit || 'زيارة',
      defaultTarget: 5,
      defaultReward: sug.suggestedReward || 'خدمة أو خصم خاص مجاناً',
      description: sug.notes || `نشاط ${sug.categoryName} المعتمد في منصة وفاء، تم اعتماده بناءً على طلب التاجر.`,
    });

    addAuditLog({
      actorRole: 'super_admin',
      actorName: 'سعود بن فهد الفيفي (مدير المنصة)',
      action: 'اعتماد نشاط مقترح وإضافته رسمياً',
      details: `تم اعتماد اقتراح (${sug.categoryName}) وإضافته إلى قائمة الأنشطة المعتمدة في منصة وفاء`,
    });
  };

  // التحكم الشامل بالمتاجر (Owner Master Controls)
  const deleteMerchant = (merchantId: string) => {
    const target = merchants.find((m) => m.id === merchantId);
    setMerchants((prev) => prev.filter((m) => m.id !== merchantId));
    setPrograms((prev) => prev.filter((p) => p.merchantId !== merchantId));
    setStaff((prev) => prev.filter((s) => s.merchantId !== merchantId));
    setCustomerCards((prev) => prev.filter((c) => c.merchantId !== merchantId));

    fetch(`/api/admin/merchants/${merchantId}`, { method: 'DELETE' }).catch(() => {});

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'حذف متجر من المنصة',
      targetMerchant: target?.businessName || merchantId,
      details: `تم حذف المتجر وبياناته وفروعه بالكامل من قبل الإدارة المركزية`,
    });
  };

  const createMerchantByAdmin = (data: Partial<Merchant>, branchName?: string): Merchant => {
    const newId = `m-${Date.now()}`;
    const newMerchant: Merchant = {
      id: newId,
      businessName: data.businessName || 'متجر جديد',
      commercialReg: data.commercialReg || `1010${Math.floor(100000 + Math.random() * 900000)}`,
      categoryId: data.categoryId || 'car-wash',
      city: data.city || 'الخرج',
      phone: data.phone || '0550000000',
      email: data.email || `store${Date.now()}@wafa.sa`,
      password: data.password || 'Merchant@123456',
      logoUrl: data.logoUrl || '',
      planId: data.planId || 'plus',
      status: 'active',
      createdAt: new Date().toISOString(),
      branches: [
        {
          id: `b-${newId}-1`,
          merchantId: newId,
          name: branchName || 'الفرع الرئيسي',
          city: data.city || 'الخرج',
          district: 'الوسط',
          phone: data.phone || '0550000000',
        },
      ],
    };

    setMerchants((prev) => [newMerchant, ...prev]);

    // برنامج ولاء افتراضي
    const cat = categories.find((c) => c.id === newMerchant.categoryId);
    const newProg: LoyaltyProgram = {
      id: `prog-${newId}`,
      merchantId: newId,
      targetVisits: cat?.defaultTarget || 5,
      unitName: cat?.defaultUnit || 'زيارة',
      rewardTitle: cat?.defaultReward || 'مكافأة مميزة مجانية',
      rewardDescription: `اجمع ${cat?.defaultTarget || 5} ${cat?.defaultUnit || 'زيارة'} واحصل على مكافأة مجانية.`,
      rewardTerms: 'صالحة لمدة 3 أشهر.',
      primaryColor: '#7c3aed',
      secondaryColor: '#5b21b6',
      cardPattern: 'dots',
      cardIcon: cat?.iconName || 'Sparkles',
      antiCheatCooldownMinutes: 30,
      requireInvoiceRef: false,
      welcomeStamps: 1,
    };
    setPrograms((prev) => [...prev, newProg]);

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'إضافة متجر جديد من الإدارة',
      targetMerchant: newMerchant.businessName,
      details: `تم إنشاء متجر جديد (${newMerchant.businessName}) بالباقة (${newMerchant.planId}) في مدينة ${newMerchant.city}`,
    });

    return newMerchant;
  };

  const impersonateMerchant = (merchantId: string) => {
    setActiveMerchantId(merchantId);
    setActiveRole('merchant');
  };

  const updateSupportContact = (info: Partial<SupportContactInfo>) => {
    setSupportContact((prev) => ({ ...prev, ...info }));
    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'تعديل بيانات الدعم والتواصل',
      details: `تم تحديث بيانات هاتف الدعم الفني أو البريد الإلكتروني للمنصة`,
    });
  };

  // إدارة فريق موظفي إدارة المنصة
  const addAdminTeamMember = async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    roleTitle: string;
    permissions: AdminPermissionSet;
  }): Promise<{ success: boolean; message: string; member?: AdminTeamMember }> => {
    const cleanEmail = data.email.trim().toLowerCase();
    const newMember: AdminTeamMember = {
      id: `admin-${Date.now().toString().slice(-6)}`,
      name: data.name.trim(),
      email: cleanEmail,
      phone: data.phone.trim(),
      password: data.password || 'Admin@123456',
      roleTitle: data.roleTitle || 'مشرف عمليات',
      permissions: data.permissions,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: session?.name || 'سعود بن فهد الفيفي (المالك)',
    };

    setAdminTeam((prev) => [newMember, ...prev]);

    try {
      await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember),
      });
    } catch (e) {
      console.warn('Backend admin team sync failed:', e);
    }

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'تعيين موظف إدارة جديد',
      details: `تم إضافة (${newMember.name}) كـ (${newMember.roleTitle}) في فريق إدارة منصة وفاء`,
    });

    return {
      success: true,
      message: `تم إضافة (${newMember.name}) بنجاح إلى فريق الإدارة.`,
      member: newMember,
    };
  };

  const updateAdminTeamMember = async (
    id: string,
    updates: Partial<AdminTeamMember>
  ): Promise<{ success: boolean; message: string }> => {
    setAdminTeam((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );

    try {
      await fetch(`/api/admin/team/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.warn('Backend admin update sync failed:', e);
    }

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'تعديل موظف إدارة',
      details: `تم تعديل بيانات أو صلاحيات الموظف في إدارة المنصة`,
    });

    return { success: true, message: 'تم تحديث بيانات الموظف وصلاحياته بنجاح.' };
  };

  const deleteAdminTeamMember = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    if (id === 'admin-fras') {
      return { success: false, message: 'لا يمكن حذف حساب صاحب المنصة والمدير العام.' };
    }

    const target = adminTeam.find((m) => m.id === id);
    setAdminTeam((prev) => prev.filter((m) => m.id !== id));

    try {
      await fetch(`/api/admin/team/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('Backend admin delete sync failed:', e);
    }

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'حذف موظف من الإدارة',
      details: `تم إزالة الموظف (${target?.name || id}) من فريق إدارة المنصة`,
    });

    return { success: true, message: `تم حذف الموظف بنجاح.` };
  };

  const changeAdminPassword = async (
    newPassword: string,
    currentPassword?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'يجب أن لا تقل كلمة المرور الجديدة عن 6 أحرف.' };
    }

    const currentEmail = session?.email || 'frasalfyfy7@gmail.com';
    setAdminTeam((prev) =>
      prev.map((m) =>
        m.email.toLowerCase() === currentEmail.toLowerCase()
          ? { ...m, password: newPassword }
          : m
      )
    );

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentEmail, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!data.success) {
        return { success: false, message: data.message };
      }
    } catch (e) {
      console.warn('Backend password change sync error:', e);
    }

    addAuditLog({
      actorRole: 'super_admin',
      actorName: session?.name || 'سعود بن فهد الفيفي (المالك)',
      action: 'تغيير كلمة مرور الإدارة',
      details: `تم تغيير كلمة المرور لحساب الإدارة (${currentEmail}) بنجاح`,
    });

    return { success: true, message: 'تم تغيير كلمة المرور بنجاح. يمكنك استخدامها فوراً.' };
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
    localStorage.removeItem(`${STORAGE_KEY}_suggestions`);
    localStorage.removeItem(`${STORAGE_KEY}_admin_team`);

    setCategories(INITIAL_CATEGORIES);
    setPlans(INITIAL_PLANS);
    setMerchants(INITIAL_MERCHANTS);
    setPrograms(INITIAL_PROGRAMS);
    setStaff(INITIAL_STAFF);
    setCustomers(INITIAL_CUSTOMERS);
    setCustomerCards(INITIAL_CUSTOMER_CARDS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setIndustrySuggestions([]);
    setAdminTeam(INITIAL_ADMIN_TEAM);
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
        session,
        categories,
        plans,
        merchants,
        programs,
        staff,
        customers,
        customerCards,
        transactions,
        auditLogs,
        industrySuggestions,
        adminTeam,
        supportContact,
        currentMerchant,
        currentProgram,
        currentStaff,
        currentCustomer,
        currentCustomerCards,
        merchantCustomers,
        merchantTransactions,
        merchantStaff,
        customerTransactions,
        loginWithEmail,
        sendEmailOtp,
        verifyEmailOtp,
        registerWithEmail,
        logout,
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
        loginAsCashier,
        createCashier,
        updateCashier,
        deleteCashier,
        registerMerchant,
        findCustomerByQuery,
        addCustomerVisit,
        redeemReward,
        joinMerchantCard,
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
        submitIndustrySuggestion,
        updateIndustrySuggestionStatus,
        approveAndCreateCategoryFromSuggestion,
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

export type UserRole = 'public' | 'customer' | 'staff' | 'merchant' | 'super_admin';

export interface BusinessCategory {
  id: string;
  name: string;
  iconName: string;
  defaultUnit: string;
  defaultTarget: number;
  defaultReward: string;
  description: string;
  activeCount: number;
}

export interface PricingPlan {
  id: 'basic' | 'plus' | 'pro';
  name: string;
  badge: string;
  monthlyPrice: number;
  annualPrice: number;
  maxBranches: number | 'unlimited';
  maxStaff: number | 'unlimited';
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Branch {
  id: string;
  merchantId: string;
  name: string;
  city: string;
  district: string;
  phone: string;
}

export interface CashierPermissions {
  canRegisterCustomers: boolean; // تسجيل عملاء جدد
  canAddVisits: boolean;          // إضافة زيارات وأختام
  canRedeemRewards: boolean;      // استبدال وصرف المكافآت
  canViewHistory: boolean;        // الاطلاع على سجل العمليات
}

export interface StaffMember {
  id: string;
  merchantId: string;
  branchId: string;
  name: string;
  username: string; // اسم المستخدم الحصري لتسجيل الدخول
  phone: string;
  email?: string;
  password?: string; // كلمة المرور الخاصة بالكاشير
  pin: string;
  role: 'cashier' | 'manager';
  permissions: CashierPermissions;
  isActive: boolean;
  totalVisitsLogged: number;
  totalRewardsRedeemed: number;
  createdAt: string;
  createdBy?: string;
}

export interface LoyaltyProgram {
  id: string;
  merchantId: string;
  targetVisits: number;
  unitName: string;
  rewardTitle: string;
  rewardDescription: string;
  rewardTerms: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  cardPattern: 'dots' | 'geometric' | 'lines' | 'minimal';
  cardIcon: string;
  antiCheatCooldownMinutes: number;
  requireInvoiceRef: boolean;
  welcomeStamps: number; // bonus stamp on signup
}

export interface Merchant {
  id: string;
  businessName: string;
  username?: string; // اسم المستخدم الحصري لتسجيل الدخول السريع
  commercialReg?: string; // رقم السجل التجاري أو وثيقة العمل الحر (يُضاف عند موافقة الإدارة)
  categoryId: string;
  city: string;
  phone: string;
  email: string;
  password?: string;
  logoUrl?: string;
  planId: 'basic' | 'plus' | 'pro';
  status: 'active' | 'suspended' | 'trial' | 'pending_approval'; // بانتظار موافقة الإدارة
  createdAt: string;
  branches: Branch[];
}

export interface RewardItem {
  id: string;
  cardId: string;
  merchantId: string;
  title: string;
  earnedAt: string;
  redeemCode: string; // One-time security code e.g. RWD-8291
  isRedeemed: boolean;
  redeemedAt?: string;
  redeemedByStaffId?: string;
  redeemedAtBranchId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  customerCode: string; // e.g. CUST-5821
  carPlate?: string; // Optional car plate for car-wash customers
  createdAt: string;
}

export interface AuthSession {
  token: string;
  role: UserRole;
  email: string;
  name: string;
  id: string;
  merchantId?: string;
  staffId?: string;
  branchId?: string;
}

export interface CustomerCard {
  id: string;
  customerId: string;
  merchantId: string;
  currentVisits: number;
  totalLifetimeVisits: number;
  rewardsEarnedCount: number;
  rewardsRedeemedCount: number;
  unclaimedRewards: RewardItem[];
  lastVisitAt?: string;
  joinedAt: string;
}

export interface VisitTransaction {
  id: string;
  cardId: string;
  customerId: string;
  merchantId: string;
  branchId: string;
  staffId: string;
  staffName: string;
  branchName: string;
  customerName: string;
  customerPhone: string;
  type: 'visit_added' | 'reward_redeemed' | 'reward_earned';
  visitIncrement: number;
  currentVisitsAfter: number;
  invoiceRef?: string;
  carPlate?: string; // مغاسل السيارات
  bookingRef?: string; // الشاليهات والاستراحات
  serviceType?: string; // الحلاقون والمشاغل
  notes?: string;
  createdAt: string;
}

export interface PlatformAuditLog {
  id: string;
  actorRole: UserRole;
  actorName: string;
  action: string;
  targetMerchant?: string;
  targetCustomer?: string;
  details: string;
  timestamp: string;
}

export interface IndustrySuggestion {
  id: string;
  categoryName: string;
  proposerName?: string;
  phone?: string;
  email?: string;
  city?: string;
  suggestedUnit?: string;
  suggestedReward?: string;
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminPermissionSet {
  canManageMerchants: boolean; // تفعيل وإيقاف وحذف وتعديل التجار
  canManagePlans: boolean; // تعديل أسعار ومميزات الباقات
  canManageCategories: boolean; // إضافة وتعديل الأنشطة والقطاعات
  canManageSuggestions: boolean; // اعتماد طلبات الأنشطة غير المدرجة
  canManageStaff: boolean; // إضافة وإدارة موظفي الإدارة الآخرين
  canViewAudit: boolean; // الاطلاع على سجل الرقابة والأمان
  canManageSettings: boolean; // تعديل أرقام الدعم وإعدادات المنصة
}

export interface AdminTeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  roleTitle: string; // مثال: المالك والمدير العام، مشرف عمليات، موظف دعم فني، مدقق أمني
  permissions: AdminPermissionSet;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  lastLoginAt?: string;
}


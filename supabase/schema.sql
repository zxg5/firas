-- ========================================================
-- WAFA | وفاء - مخطط قاعدة بيانات Supabase وسياسات الحماية (RLS)
-- ========================================================
-- يشمل هذا الملف جميع الجداول، العلاقات، الفهارس، القيود،
-- وسياسات أمان مستوى الصفوف (Row Level Security - RLS)
-- لمنع أي مستخدم من الوصول إلى بيانات أو صلاحيات لا تخصه.
-- ========================================================

-- تفعيل ملحق توليد UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. جدول الحسابات والملفات الشخصية (Profiles / App Users)
-- يرتبط بالمستخدمين مع تحديد الأدوار بدقة (RBAC)
CREATE TYPE user_role_enum AS ENUM ('customer', 'staff', 'merchant', 'super_admin');

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(120) NOT NULL DEFAULT 'عميل وفاء',
    email VARCHAR(120),
    role user_role_enum NOT NULL DEFAULT 'customer',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- فهرس سريع للبحث برقم الجوال
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 2. جدول المتاجر والأنشطة التجارية (Merchants)
CREATE TABLE IF NOT EXISTS public.merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    business_name VARCHAR(150) NOT NULL,
    commercial_reg VARCHAR(50),
    category_id VARCHAR(50) NOT NULL DEFAULT 'car-wash',
    city VARCHAR(60) NOT NULL DEFAULT 'الرياض',
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(120),
    logo_url TEXT,
    plan_id VARCHAR(20) NOT NULL DEFAULT 'basic',
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'trial'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_merchants_category ON public.merchants(category_id);
CREATE INDEX IF NOT EXISTS idx_merchants_owner ON public.merchants(owner_profile_id);

-- 3. جدول فروع المتاجر (Branches)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    name VARCHAR(120) NOT NULL,
    city VARCHAR(60) NOT NULL,
    district VARCHAR(80),
    phone VARCHAR(20),
    is_main BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_branches_merchant ON public.branches(merchant_id);

-- 4. جدول إعدادات برنامج الولاء لكل متجر (Loyalty Programs)
CREATE TABLE IF NOT EXISTS public.loyalty_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL UNIQUE REFERENCES public.merchants(id) ON DELETE CASCADE,
    target_visits INT NOT NULL DEFAULT 5 CHECK (target_visits >= 2 AND target_visits <= 50),
    unit_name VARCHAR(40) NOT NULL DEFAULT 'زيارة',
    reward_title VARCHAR(150) NOT NULL DEFAULT 'مكافأة ولاء مجانية',
    reward_description TEXT,
    reward_terms TEXT,
    primary_color VARCHAR(20) NOT NULL DEFAULT '#059669',
    secondary_color VARCHAR(20) NOT NULL DEFAULT '#064e3b',
    card_pattern VARCHAR(30) NOT NULL DEFAULT 'geometric',
    card_icon VARCHAR(40) NOT NULL DEFAULT 'Sparkles',
    anti_cheat_cooldown_minutes INT NOT NULL DEFAULT 30 CHECK (anti_cheat_cooldown_minutes >= 0),
    require_invoice_ref BOOLEAN NOT NULL DEFAULT FALSE,
    welcome_stamps INT NOT NULL DEFAULT 0 CHECK (welcome_stamps >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. جدول الموظفين والكاشير (Staff Members)
CREATE TABLE IF NOT EXISTS public.staff_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pin_code VARCHAR(10) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'cashier', -- 'cashier' أو 'manager'
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    total_visits_logged INT NOT NULL DEFAULT 0,
    total_rewards_redeemed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_staff_merchant ON public.staff_members(merchant_id);
CREATE INDEX IF NOT EXISTS idx_staff_phone ON public.staff_members(phone);

-- 6. جدول بطاقات العملاء في المتاجر (Customer Cards)
CREATE TABLE IF NOT EXISTS public.customer_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    current_visits INT NOT NULL DEFAULT 0 CHECK (current_visits >= 0),
    total_lifetime_visits INT NOT NULL DEFAULT 0 CHECK (total_lifetime_visits >= 0),
    rewards_earned_count INT NOT NULL DEFAULT 0 CHECK (rewards_earned_count >= 0),
    rewards_redeemed_count INT NOT NULL DEFAULT 0 CHECK (rewards_redeemed_count >= 0),
    car_plate VARCHAR(30), -- خاص بمغاسل السيارات
    last_visit_at TIMESTAMPTZ,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_customer_merchant_card UNIQUE(customer_profile_id, merchant_id)
);

CREATE INDEX IF NOT EXISTS idx_cards_customer ON public.customer_cards(customer_profile_id);
CREATE INDEX IF NOT EXISTS idx_cards_merchant ON public.customer_cards(merchant_id);

-- 7. جدول سجل العمليات والزيارات الموثقة (Visit Transactions)
CREATE TABLE IF NOT EXISTS public.visit_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES public.customer_cards(id) ON DELETE CASCADE,
    customer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    staff_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
    staff_name VARCHAR(120) NOT NULL,
    branch_name VARCHAR(120) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'visit_added', -- 'visit_added', 'reward_earned', 'reward_redeemed'
    visit_increment INT NOT NULL DEFAULT 1,
    current_visits_after INT NOT NULL,
    invoice_ref VARCHAR(80), -- رقم الفاتورة للمطاعم والكافيهات
    car_plate VARCHAR(40),   -- لوحة السيارة للمغاسل
    booking_ref VARCHAR(80), -- رقم الحجز للشاليهات
    service_type VARCHAR(100), -- نوع الخدمة للحلاقين والمشاغل
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tx_merchant ON public.visit_transactions(merchant_id);
CREATE INDEX IF NOT EXISTS idx_tx_card ON public.visit_transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_tx_customer ON public.visit_transactions(customer_profile_id);
CREATE INDEX IF NOT EXISTS idx_tx_created ON public.visit_transactions(created_at);

-- 8. جدول المكافآت المستحقة ورموز الاستبدال وحيدة الاستخدام (Unclaimed Rewards)
CREATE TABLE IF NOT EXISTS public.unclaimed_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id UUID NOT NULL REFERENCES public.customer_cards(id) ON DELETE CASCADE,
    merchant_id UUID NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
    customer_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    redeem_code VARCHAR(20) UNIQUE NOT NULL, -- مثل RWD-7821
    is_redeemed BOOLEAN NOT NULL DEFAULT FALSE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    redeemed_at TIMESTAMPTZ,
    redeemed_by_staff_id UUID REFERENCES public.staff_members(id) ON DELETE SET NULL,
    redeemed_at_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_rewards_card ON public.unclaimed_rewards(card_id);
CREATE INDEX IF NOT EXISTS idx_rewards_code ON public.unclaimed_rewards(redeem_code);

-- 9. جدول رموز التحقق SMS المؤقتة (OTP Verifications)
CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL,
    otp_code VARCHAR(10) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON public.otp_verifications(phone);

-- 10. جدول سجل الرقابة والتدقيق الأمني (Audit Logs)
CREATE TABLE IF NOT EXISTS public.platform_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_role VARCHAR(30) NOT NULL,
    actor_name VARCHAR(120) NOT NULL,
    action VARCHAR(120) NOT NULL,
    target_merchant VARCHAR(150),
    target_customer VARCHAR(120),
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================================
-- سياسات الحماية على مستوى الصفوف (Row Level Security - RLS)
-- ========================================================

-- تفعيل RLS على جميع الجداول الحساسة
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unclaimed_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- حماية جدول الملفات الشخصية:
-- 1) منع المستخدم من إنشاء أو رفع نفسه لدور super_admin
CREATE POLICY "Prevent self-elevation to super_admin"
ON public.profiles
FOR INSERT
WITH CHECK (
    role != 'super_admin'
);

CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
USING (
    id = auth.uid() OR role = 'customer'
);

-- حماية المتاجر: التاجر فقط يقرأ ويعدل متجره، ومدير المنصة يرى الكل
CREATE POLICY "Merchants view own store"
ON public.merchants
FOR SELECT
USING (
    owner_profile_id = auth.uid() OR status = 'active'
);

CREATE POLICY "Merchants update own store"
ON public.merchants
FOR UPDATE
USING (
    owner_profile_id = auth.uid()
);

-- حماية بطاقات العملاء:
-- العميل يرى بطاقاته فقط
-- الكاشير والموظف يرى بطاقات متجره فقط
CREATE POLICY "Customers view own cards"
ON public.customer_cards
FOR SELECT
USING (
    customer_profile_id = auth.uid()
);

-- حماية سجل المعاملات:
CREATE POLICY "Customers view own transactions"
ON public.visit_transactions
FOR SELECT
USING (
    customer_profile_id = auth.uid()
);

-- حماية سجل الرقابة: مدير المنصة فقط يقرأ سجل التدقيق
CREATE POLICY "Only super_admin reads audit logs"
ON public.platform_audit_logs
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid() AND profiles.role = 'super_admin'
    )
);

-- ========================================================
-- دالة أمنية على الخادم لمنع التكرار والتلاعب في الزيارات
-- ========================================================
CREATE OR REPLACE FUNCTION public.check_visit_cooldown(
    p_card_id UUID,
    p_cooldown_minutes INT
)
RETURNS BOOLEAN AS $$
DECLARE
    last_tx_time TIMESTAMPTZ;
BEGIN
    SELECT created_at INTO last_tx_time
    FROM public.visit_transactions
    WHERE card_id = p_card_id AND type IN ('visit_added', 'reward_earned')
    ORDER BY created_at DESC
    LIMIT 1;

    IF last_tx_time IS NOT NULL AND (NOW() - last_tx_time) < (p_cooldown_minutes * INTERVAL '1 minute') THEN
        RETURN FALSE; -- لم تنقضِ فترة الأمان! تلاعب محتمل أو تكرار
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

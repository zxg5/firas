import React, { useState } from 'react';
import { WafaProvider, useWafa } from './context/WafaContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { SupportWidget } from './components/common/SupportWidget';
import { Hero } from './components/public/Hero';
import { HowItWorks } from './components/public/HowItWorks';
import { IndustriesSection } from './components/public/IndustriesSection';
import { RoiCalculator } from './components/public/RoiCalculator';
import { PricingSection } from './components/public/PricingSection';
import { FaqSection } from './components/public/FaqSection';
import { MerchantOnboardingModal } from './components/public/MerchantOnboardingModal';
import { LoginModal } from './components/common/LoginModal';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { StaffPortal } from './components/staff/StaffPortal';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { LegalModal, LegalTabType } from './components/legal/LegalModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PricingPlan } from './types';

const MainContent: React.FC = () => {
  const { activeRole } = useWafa();

  // Modals state
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [selectedPlanForRegister, setSelectedPlanForRegister] = useState<PricingPlan | undefined>(undefined);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginModalTab, setLoginModalTab] = useState<'customer' | 'staff' | 'merchant' | 'admin'>('customer');
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('terms');

  const handleOpenRegister = (plan?: PricingPlan) => {
    setSelectedPlanForRegister(plan);
    setRegisterModalOpen(true);
  };

  const handleOpenLogin = (tab: 'customer' | 'staff' | 'merchant' | 'admin') => {
    setLoginModalTab(tab);
    setLoginModalOpen(true);
  };

  const handleOpenLegal = (tab?: LegalTabType) => {
    setLegalModalTab(tab || 'terms');
    setLegalModalOpen(true);
  };

  React.useEffect(() => {
    const handleLoginEvent = (e: any) => {
      const tab = e.detail?.tab || 'customer';
      setLoginModalTab(tab);
      setLoginModalOpen(true);
    };
    window.addEventListener('wafa-open-login', handleLoginEvent);
    return () => window.removeEventListener('wafa-open-login', handleLoginEvent);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Universal Navigation */}
      <Navbar
        onOpenRegisterModal={() => handleOpenRegister()}
      />

      {/* Main View Router based on activeRole */}
      <main className="flex-1">
        {activeRole === 'public' && (
          <>
            <Hero
              onOpenRegisterModal={() => handleOpenRegister()}
              onOpenLoginModal={handleOpenLogin}
            />
            <HowItWorks />
            <IndustriesSection
              onOpenRegisterModal={() => handleOpenRegister()}
            />
            <RoiCalculator
              onOpenRegisterModal={() => handleOpenRegister()}
            />
            <PricingSection
              onSelectPlan={(plan) => handleOpenRegister(plan)}
            />
            <FaqSection />
          </>
        )}

        {activeRole === 'customer' && <CustomerPortal />}

        {activeRole === 'staff' && <StaffPortal />}

        {activeRole === 'merchant' && <MerchantDashboard />}

        {activeRole === 'super_admin' && <SuperAdminDashboard />}
      </main>

      {/* Footer with Legal & Regulatory links */}
      <Footer onOpenLegal={handleOpenLegal} />

      {/* Sleek 24/7 Technical Support Floating Widget (Call 0534067866, WhatsApp & Direct Email Tickets) */}
      <SupportWidget />

      {/* Offline Status Toast Indicator */}
      <OfflineIndicator />

      {/* Onboarding & Login Modals */}
      <MerchantOnboardingModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        selectedPlan={selectedPlanForRegister}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        defaultTab={loginModalTab}
      />

      {/* Saudi PDPL & E-Commerce Compliance Legal Modal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalModalTab}
      />
    </div>
  );
};

export default function App() {
  return (
    <WafaProvider>
      <MainContent />
    </WafaProvider>
  );
}

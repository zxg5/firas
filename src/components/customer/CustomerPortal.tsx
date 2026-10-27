import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { useWafa } from '../../context/WafaContext';
import { LoyaltyCardDisplay } from '../common/LoyaltyCardDisplay';
import {
  Smartphone,
  QrCode as QrIcon,
  Gift,
  Clock,
  Sparkles,
  ShieldAlert,
  Store,
  ChevronRight,
  ExternalLink,
  Award,
  CheckCircle,
  Copy,
  Check,
  X,
  MessageCircle,
} from 'lucide-react';
import { CustomerCard, RewardItem } from '../../types';
import { AppleWalletModal } from './AppleWalletModal';

export const CustomerPortal: React.FC = () => {
  const {
    currentCustomer,
    customerCards,
    merchants,
    programs,
    transactions,
    activeCustomerId,
    joinMerchantCard,
  } = useWafa();

  // Find cards belonging to currentCustomer
  const myCards = customerCards.filter((c) => c.customerId === activeCustomerId);
  const [selectedCardId, setSelectedCardId] = useState<string>(myCards[0]?.id || '');

  // Keep selectedCard valid
  useEffect(() => {
    if (!myCards.some((c) => c.id === selectedCardId) && myCards.length > 0) {
      setSelectedCardId(myCards[0].id);
    }
  }, [myCards, selectedCardId]);

  const activeCard = myCards.find((c) => c.id === selectedCardId) || myCards[0];
  const activeMerchant = merchants.find((m) => m.id === activeCard?.merchantId);
  const activeProgram = programs.find((p) => p.merchantId === activeCard?.merchantId);

  // Filter transactions for this customer & merchant
  const myTransactions = transactions.filter(
    (tx) => tx.customerId === activeCustomerId && (!activeMerchant || tx.merchantId === activeMerchant.id)
  );

  // QR Modal
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [selectedRewardForModal, setSelectedRewardForModal] = useState<RewardItem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [appleWalletOpen, setAppleWalletOpen] = useState(false);

  // Active view tab: 'card' | 'rewards' | 'history'
  const [activeTab, setActiveTab] = useState<'card' | 'rewards' | 'history'>('card');

  // Generate QR for customer identification
  useEffect(() => {
    if (currentCustomer) {
      QRCode.toDataURL(currentCustomer.customerCode || currentCustomer.phone, {
        width: 260,
        margin: 2,
        color: { dark: '#022c22', light: '#ffffff' },
      }).then(setQrDataUrl);
    }
  }, [currentCustomer]);

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!currentCustomer) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <p className="text-slate-500">يرجى تسجيل الدخول لعرض بطاقتك الرقمية.</p>
      </div>
    );
  }

  // All unclaimed rewards across all cards
  const allUnclaimedRewards = myCards.flatMap((c) => c.unclaimedRewards.filter((r) => !r.isRedeemed));

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-28 pt-6">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Customer Header Bar */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-black text-xl shadow-md shadow-emerald-500/20">
              {currentCustomer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{currentCustomer.name}</h2>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  عميل موثق
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5 font-semibold" dir="ltr">
                {currentCustomer.phone}
              </p>
            </div>
          </div>

          {/* Quick QR Button */}
          <button
            type="button"
            onClick={() => setQrModalOpen(true)}
            className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-emerald-700 border border-slate-200 transition-all hover:scale-105 cursor-pointer shadow-2xs"
            title="إظهار كود العميل للكاشير"
          >
            <QrIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold text-slate-700 mt-1">كود التعريف</span>
          </button>
        </div>

        {/* Unclaimed Rewards Banner Alert (if any) */}
        {allUnclaimedRewards.length > 0 && (
          <div className="rounded-3xl bg-gradient-to-l from-amber-500 via-amber-400 to-orange-400 text-slate-950 p-4.5 shadow-md flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/90 text-amber-700 flex items-center justify-center font-bold shrink-0 shadow-sm">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-950">
                  لديك {allUnclaimedRewards.length} مكافأة جاهزة للاستبدال!
                </div>
                <div className="text-[11px] text-slate-900/90 line-clamp-1 mt-0.5 font-medium">
                  {allUnclaimedRewards[0].title}
                </div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('rewards')}
              className="py-2 px-3.5 rounded-xl bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs shrink-0 transition-colors cursor-pointer shadow-sm"
            >
              عرض واستبدال
            </button>
          </div>
        )}

        {/* Multiple Cards Switcher Tabs */}
        {myCards.length > 1 && (
          <div>
            <label className="text-xs font-bold text-slate-600 block mb-2">
              بطاقاتك الرقمية ({myCards.length}):
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {myCards.map((card) => {
                const merch = merchants.find((m) => m.id === card.merchantId);
                const prog = programs.find((p) => p.merchantId === card.merchantId);
                const isSelected = card.id === selectedCardId;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setSelectedCardId(card.id)}
                    className={`shrink-0 py-2.5 px-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-emerald-500 text-slate-900 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white/80 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold">{merch?.businessName || 'متجر'}</div>
                    <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                      {card.currentVisits} من {prog?.targetVisits || 5} {prog?.unitName || 'زيارة'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white text-emerald-800 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بطاقة الولاء
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rewards')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer relative ${
              activeTab === 'rewards'
                ? 'bg-white text-emerald-800 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المكافآت ({allUnclaimedRewards.length})
            {allUnclaimedRewards.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-2 left-4 animate-ping" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-emerald-800 shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سجل العمليات
          </button>
        </div>

        {/* Tab 1: The Digital Loyalty Card */}
        {activeTab === 'card' && activeMerchant && activeProgram && (
          <div className="space-y-4">
            <LoyaltyCardDisplay
              merchant={activeMerchant}
              program={activeProgram}
              card={activeCard}
              customerName={currentCustomer.name}
              customerPhone={currentCustomer.phone}
              onOpenQr={() => setQrModalOpen(true)}
            />

            {/* Quick Wallet & WhatsApp Pass Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setAppleWalletOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span className="text-base font-bold leading-none"></span>
                <span>حفظ في Apple Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const cardUrl = `${window.location.origin}/?phone=${currentCustomer.phone}&merchant=${activeMerchant.id}`;
                  const text = encodeURIComponent(
                    `بطاقة ولائي في ${activeMerchant.businessName} عبر منصة وفاء ✨:\nالرصيد الحالي: ${activeCard?.currentVisits || 0}/${activeProgram.targetVisits} ${activeProgram.unitName}\nالمكافأة: ${activeProgram.rewardTitle}\nرابط البطاقة: ${cardUrl}`
                  );
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                className="py-2.5 px-3 rounded-2xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>إرسال للواتساب لحفظها</span>
              </button>
            </div>

            {/* Terms & Merchant Info Card */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4.5 text-xs space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span>شروط الاستحقاق والمكافأة:</span>
                <span className="text-emerald-700">{activeProgram.rewardTitle}</span>
              </div>
              <p className="text-slate-600 leading-relaxed font-normal">
                {activeProgram.rewardTerms || activeProgram.rewardDescription}
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>الفروع المعتمدة: {activeMerchant.branches.map((b) => b.name).join(' • ')}</span>
                <span className="text-emerald-700 font-bold">{activeMerchant.city}</span>
              </div>
            </div>

            {/* Anti-cheat disclaimer strictly required by brief */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2.5 font-medium">
              <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                لضمان النزاهة والموثوقية، لا يمكن للعميل ختم البطاقة بنفسه. يتم اعتماد الزيارة والمكافأة حصراً بواسطة كاشير المحل المعتمد.
              </span>
            </div>
          </div>
        )}

        {/* Tab 2: Rewards List & Single-Use Redeem Codes */}
        {activeTab === 'rewards' && (
          <div className="space-y-3">
            {allUnclaimedRewards.length === 0 ? (
              <div className="rounded-3xl bg-white border border-slate-200 p-10 text-center space-y-2 shadow-sm">
                <Gift className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-800">لا توجد مكافآت معلقة حالياً</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  واصل جمع أختام الزيارات في متاجرك المفضلة بالخرج والرياض للحصول على هدايا وخدمات مجانية!
                </p>
              </div>
            ) : (
              allUnclaimedRewards.map((reward) => {
                const merch = merchants.find((m) => m.id === reward.merchantId);
                return (
                  <div
                    key={reward.id}
                    className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-300 p-5 shadow-md relative overflow-hidden space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-200/70 px-2.5 py-0.5 rounded-full border border-amber-300">
                          {merch?.businessName || 'النشاط التجاري'}
                        </span>
                        <h4 className="text-base font-black text-slate-900 mt-1.5">
                          {reward.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-0.5 font-medium">
                          تاريخ الاستحقاق: {new Date(reward.earnedAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
                        <Gift className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Single-Use Redeem Code Box */}
                    <div className="p-4 rounded-2xl bg-white border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold">رمز الاستبدال الخاص بالكاشير</div>
                        <div className="text-xl font-black tracking-widest text-emerald-700 font-mono mt-0.5">
                          {reward.redeemCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(reward.redeemCode)}
                          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors cursor-pointer border border-slate-200"
                          title="نسخ الرمز"
                        >
                          {copiedCode ? <Check className="w-4 h-4 text-emerald-600 font-bold" /> : <Copy className="w-4 h-4" />}
                          <span className="text-[11px] font-bold">{copiedCode ? 'تم النسخ' : 'نسخ'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRewardForModal(reward)}
                          className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-sm"
                        >
                          إظهار الرمز للكاشير
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-900 font-medium flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        رمز أمان وحيد الاستخدام. يقوم الكاشير بإدخاله أو مسحه لاعتماد الهدية وحرق الرمز.
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: History of Visits & Redemptions */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700">سجل الزيارات والعمليات المؤهلة</h4>

            {myTransactions.length === 0 ? (
              <div className="rounded-2xl bg-white border border-slate-200 p-8 text-center text-xs text-slate-500 shadow-sm">
                لا توجد زيارات مسجلة حتى الآن.
              </div>
            ) : (
              myTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="rounded-2xl bg-white border border-slate-200 p-4 text-xs space-y-1.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          tx.type === 'reward_earned'
                            ? 'bg-amber-500'
                            : tx.type === 'reward_redeemed'
                            ? 'bg-purple-500'
                            : 'bg-emerald-500'
                        }`}
                      />
                      <span className="font-bold text-slate-900">
                        {tx.type === 'reward_earned'
                          ? 'استحقاق مكافأة ولاء'
                          : tx.type === 'reward_redeemed'
                          ? 'استبدال واستلام مكافأة'
                          : 'تسجيل زيارة مؤهلة'}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[10px]">
                      {new Date(tx.createdAt).toLocaleDateString('ar-SA')} -{' '}
                      {new Date(tx.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="text-slate-600 flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                    <span>{tx.branchName} • الموظف: {tx.staffName}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {tx.carPlate && (
                        <span className="text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          لوحة: {tx.carPlate}
                        </span>
                      )}
                      {tx.bookingRef && (
                        <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold">
                          حجز: {tx.bookingRef}
                        </span>
                      )}
                      {tx.serviceType && (
                        <span className="text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md text-[10px] font-bold">
                          خدمة: {tx.serviceType}
                        </span>
                      )}
                      {tx.invoiceRef && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono font-bold text-[10px]">
                          فاتورة: {tx.invoiceRef}
                        </span>
                      )}
                    </div>
                  </div>

                  {tx.notes && <div className="text-slate-500 text-[11px]">{tx.notes}</div>}
                </div>
              ))
            )}
          </div>
        )}

        {/* Explore other merchants */}
        <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span>متاجر أخرى تدعم بطاقات وفاء</span>
            <span className="text-emerald-700 text-[11px]">انضم بنقرة واحدة</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {merchants
              .filter((m) => !myCards.some((c) => c.merchantId === m.id))
              .map((merch) => {
                const prog = programs.find((p) => p.merchantId === merch.id);
                return (
                  <div
                    key={merch.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{merch.businessName}</div>
                      <div className="text-[10px] text-slate-500">{merch.city} • {prog?.rewardTitle}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => joinMerchantCard(currentCustomer.id, merch.id)}
                      className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer shrink-0 shadow-2xs"
                    >
                      إضافة البطاقة
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Customer QR Code Identification Modal */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-emerald-700">بطاقة التعريف بالكاشير</span>
              <button
                onClick={() => setQrModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white border border-slate-200 rounded-2xl inline-block shadow-sm mx-auto">
              <img src={qrDataUrl} alt="Customer QR" className="w-48 h-48 mx-auto" />
            </div>

            <div>
              <div className="text-lg font-black text-slate-900">{currentCustomer.name}</div>
              <div className="text-xs font-mono text-emerald-700 font-bold mt-0.5 tracking-wider">
                كود العميل: {currentCustomer.customerCode}
              </div>
              <div className="text-xs font-mono text-slate-500 mt-0.5" dir="ltr">
                {currentCustomer.phone}
              </div>
            </div>

            <p className="text-[11px] text-slate-600">
              أظهر هذا الرمز لموظف الكاشير عند المحاسبة لتسجيل الزيارة فوراً دون الحاجة لتكرار إملاء رقمك.
            </p>
          </div>
        </div>
      )}

      {/* Reward QR Modal for Redemption */}
      {selectedRewardForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-amber-300 p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-amber-800">استبدال المكافأة</span>
              <button
                onClick={() => setSelectedRewardForModal(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md">
              <Gift className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">{selectedRewardForModal.title}</h4>
              <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] text-slate-600 font-medium">أخبر الكاشير بهذا الرمز السري:</div>
                <div className="text-2xl font-black font-mono text-emerald-800 tracking-widest mt-1">
                  {selectedRewardForModal.redeemCode}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              سيقوم الموظف بالتحقق من الرمز في لوحة الكاشير واعتماده لتسليم هديتك مباشرة.
            </p>
          </div>
        </div>
      )}

      {/* Apple Wallet & Home Screen Guide Modal */}
      <AppleWalletModal
        isOpen={appleWalletOpen}
        onClose={() => setAppleWalletOpen(false)}
        customer={currentCustomer}
        card={activeCard}
        merchant={activeMerchant}
        program={activeProgram}
      />
    </div>
  );
};

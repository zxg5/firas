import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const PatrioticSection: React.FC = () => {
  return (
    <section 
      dir="rtl" 
      aria-label="وفاء لوطنٍ ما له مثيل"
      className="relative overflow-hidden py-24 sm:py-32 bg-gradient-to-b from-[#032316] via-[#04331f] to-[#01170d] text-white border-t border-b border-amber-500/20"
    >
      {/* Decorative Golden Ambient Glows */}
      <div 
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-gradient-to-b from-amber-500/15 via-emerald-600/10 to-transparent blur-3xl rounded-full"
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -bottom-24 right-10 w-96 h-96 bg-amber-400/10 blur-3xl rounded-full" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute -top-24 left-10 w-96 h-96 bg-emerald-500/15 blur-3xl rounded-full" 
        aria-hidden="true" 
      />

      {/* Subtle Islamic / Saudi Geometric Pattern Background */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Royal Emblem & Crest Badge */}
        <div className="inline-flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            {/* Outer Golden Glow Ring */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/40 via-yellow-400/50 to-amber-600/40 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#064227] via-[#032616] to-[#01170e] border-2 border-amber-400/60 flex items-center justify-center shadow-2xl shadow-emerald-950/80">
              {/* Detailed Saudi Emblem: Palm Tree and Crossed Curved Swords */}
              <svg 
                viewBox="0 0 100 100" 
                className="w-12 h-12 sm:w-14 sm:h-14 fill-current text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]" 
                aria-hidden="true"
              >
                {/* Palm Tree */}
                {/* Trunk */}
                <path d="M47 38 C47 50, 48 62, 45 68 L55 68 C52 62, 53 50, 53 38 Z" fill="currentColor" />
                {/* Trunk rings */}
                <path d="M46.5 45 L53.5 45 M46 51 L54 51 M45.5 57 L54.5 57 M45.2 63 L54.8 63" stroke="#032616" strokeWidth="1" strokeLinecap="round" />
                {/* Palm Fronds / Leaves */}
                {/* Center Top Fronds */}
                <path d="M50 38 C50 24, 48 14, 50 10 C52 14, 50 24, 50 38 Z" fill="currentColor" />
                {/* Left Fronds */}
                <path d="M49 35 C42 28, 30 20, 22 22 C30 28, 41 34, 48 37 Z" fill="currentColor" />
                <path d="M48 36 C38 34, 25 32, 18 38 C28 40, 39 39, 47 38 Z" fill="currentColor" />
                <path d="M49 34 C44 23, 35 15, 29 14 C35 22, 43 28, 48 34 Z" fill="currentColor" />
                {/* Right Fronds */}
                <path d="M51 35 C58 28, 70 20, 78 22 C70 28, 59 34, 52 37 Z" fill="currentColor" />
                <path d="M52 36 C62 34, 75 32, 82 38 C72 40, 61 39, 53 38 Z" fill="currentColor" />
                <path d="M51 34 C56 23, 65 15, 71 14 C65 22, 57 28, 52 34 Z" fill="currentColor" />
                
                {/* Crossed Curved Swords (Saifain) */}
                {/* Sword 1: Top-Right to Bottom-Left (curved scimitar) */}
                <path 
                  d="M78 66 C65 67, 45 74, 26 89 C32 84, 48 76, 74 72 L78 66 Z" 
                  fill="currentColor" 
                />
                {/* Hilt and pommel 1 */}
                <path d="M75 69 L84 75 L82 77 L73 71 Z" fill="currentColor" />
                <circle cx="83.5" cy="76.5" r="2" fill="currentColor" />
                <line x1="73" y1="74" x2="77" y2="68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

                {/* Sword 2: Top-Left to Bottom-Right (curved scimitar) */}
                <path 
                  d="M22 66 C35 67, 55 74, 74 89 C68 84, 52 76, 26 72 L22 66 Z" 
                  fill="currentColor" 
                />
                {/* Hilt and pommel 2 */}
                <path d="M25 69 L16 75 L18 77 L27 71 Z" fill="currentColor" />
                <circle cx="16.5" cy="76.5" r="2" fill="currentColor" />
                <line x1="27" y1="74" x2="23" y2="68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Golden Badge Label */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>المملكة العربية السعودية • دام عزك يا وطن</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-8">
          <span className="bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
            وفاء لوطنٍ ما له مثيل 🇸🇦
          </span>
        </h2>

        {/* Golden Ornamental Divider */}
        <div className="flex items-center justify-center gap-4 max-w-xs mx-auto mb-10 opacity-70">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
          <div className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-amber-400/30" />
          <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
          <div className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-amber-400/30" />
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
        </div>

        {/* Patriotic Body Statement Card */}
        <div className="relative max-w-4xl mx-auto">
          {/* Card Frame with Gold Border & Gradient Glass Effect */}
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 bg-gradient-to-br from-[#063b22]/90 via-[#042817]/95 to-[#02170d]/90 border border-amber-400/35 shadow-2xl shadow-black/60 backdrop-blur-md">
            
            {/* Subtle Corner Accents */}
            <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg pointer-events-none" />
            <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg pointer-events-none" />

            {/* Quotation Marks Accent */}
            <div className="text-amber-400/20 text-6xl sm:text-7xl font-serif leading-none select-none -mb-6 sm:-mb-8">
              ❝
            </div>

            {/* Exact Required Patriotic Text */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-medium leading-relaxed sm:leading-[2.2] text-emerald-50 text-justify sm:text-center">
              «هذي أرضنا، وهذي عزوتنا، وهذي دارنا اللي نفخر فيها. السعودية عزّنا وفخرنا وهويتنا، وأرض المجد والتاريخ، ورايتها فوق ما تنحني إلا لله. نفخر بوطننا، ونعتز بقيادتنا، ونسأل الله يديم علينا الأمن والأمان ويحفظ المملكة العربية السعودية من كل شر».
            </p>

            <div className="text-amber-400/20 text-6xl sm:text-7xl font-serif leading-none select-none mt-2 -mb-8">
              ❞
            </div>

            {/* Bottom Pillar Indicators */}
            <div className="mt-10 pt-8 border-t border-amber-400/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-semibold">
              <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>عز وفخر وهوية</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-amber-200">
                <Heart className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>ولاء لقيادتنا ووطننا</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-amber-200">
                <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>أرض المجد والتاريخ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Small footer brand note */}
        <p className="mt-8 text-xs sm:text-sm text-emerald-200/60 font-medium">
          منصة WAFA | وفاء تعتز بانتمائها إلى أرض الحرمين الشريفين والمملكة العربية السعودية
        </p>
      </div>
    </section>
  );
};

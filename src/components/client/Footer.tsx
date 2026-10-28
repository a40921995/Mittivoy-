import React from 'react';
import {
  Phone,
  MapPin,
  Clock,
  Send,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Heart,
  Sparkles,
  Lock
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface FooterProps {
  onNavigateToCatalog: (filter?: { category?: string; gender?: string; tag?: string }) => void;
  onNavigateToFavorites: () => void;
  onNavigateToCart: () => void;
  onOpenAdminPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateToCatalog,
  onNavigateToFavorites,
  onNavigateToCart,
  onOpenAdminPortal
}) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-[#00B8F5]/10 text-[#00B8F5] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Tezkor Yetkazish</h4>
              <p className="text-[11px] text-slate-400">O‘zbekiston bo‘ylab 1-2 kun</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-[#FF4FA3]/10 text-[#FF4FA3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">100% Paxta Sifati</h4>
              <p className="text-[11px] text-slate-400">Allergiyasiz xavfsiz mato</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-[#FFD76A]/10 text-[#FFD76A] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Oson Almashtirish</h4>
              <p className="text-[11px] text-slate-400">14 kunlik kafolat</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="w-10 h-10 rounded-xl bg-[#9BE7C4]/10 text-[#9BE7C4] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white">Xavfsiz To‘lov</h4>
              <p className="text-[11px] text-slate-400">Click, Paynet, Naqd</p>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Logo size="md" isLight={true} showSubtitle={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              1 yoshdan 15 yoshgacha bo‘lgan o‘g‘il va qiz bolalar uchun yuqori sifatli, qulay va zamonaviy bolalar kiyimlari do‘koni. Farzandingiz quvonchi — bizning baxtimiz!
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Har kuni: 09:00 — 21:00</span>
            </div>
          </div>

          {/* Column 2: Xaridorlar uchun */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Xaridorlar Uchun
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateToCatalog()}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  Barcha kiyimlar katalogi
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ tag: 'yangi' })}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  Yangi kelgan to‘plamlar 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ tag: 'chegirma' })}
                  className="hover:text-[#FF4FA3] transition-colors"
                >
                  Aksiyalar & Chegirmalar
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateToFavorites}
                  className="hover:text-[#FF4FA3] transition-colors"
                >
                  Sevimlilar ro‘yxati
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateToCart}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  Savatcha & Buyurtma
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Mashhur Kategoriyalar */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Kategoriyalar
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ category: 'Dvoykalar' })}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  Bolalar Dvoykalari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ category: 'Kurtkalar' })}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  Kurtka & Nimchalar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ category: 'Ko‘ylaklar' })}
                  className="hover:text-[#FF4FA3] transition-colors"
                >
                  Qizaloqlar Ko‘ylaklari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ gender: 'ogil' })}
                  className="hover:text-[#00B8F5] transition-colors"
                >
                  O‘g‘il Bolalar Kiyimlari
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToCatalog({ gender: 'qiz' })}
                  className="hover:text-[#FF4FA3] transition-colors"
                >
                  Qiz Bolalar Kiyimlari
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Aloqa va To'lov */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Bog‘lanish & To‘lov
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#00B8F5] shrink-0" />
                <a href="tel:+998901234567" className="hover:text-white font-bold text-slate-200">
                  +998 90 123-45-67
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FF4FA3] shrink-0 mt-0.5" />
                <span>Toshkent sh., Chilonzor tumani, Qatortol ko‘chasi, 24-uy</span>
              </div>
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00B8F5] shrink-0" />
                <span className="text-sky-300 font-bold">@mittivoy_shop</span>
              </div>
            </div>

            {/* Payment method pills */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-400 block mb-2">
                Qabul qilinadigan to‘lovlar:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-slate-800 text-sky-400 font-black text-[10px] rounded-lg border border-slate-700">
                  CLICK
                </span>
                <span className="px-2 py-1 bg-slate-800 text-emerald-400 font-black text-[10px] rounded-lg border border-slate-700">
                  PAYNET
                </span>
                <span className="px-2 py-1 bg-slate-800 text-purple-400 font-black text-[10px] rounded-lg border border-slate-700">
                  UZUM BANK
                </span>
                <span className="px-2 py-1 bg-slate-800 text-amber-400 font-black text-[10px] rounded-lg border border-slate-700">
                  NAQD TO‘LOV
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin link */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MITTIVOY — Bolalar kiyimlari internet-do‘koni. Barcha huquqlar himoyalangan.</p>

          <button
            onClick={onOpenAdminPortal}
            className="flex items-center gap-1.5 text-slate-400 hover:text-sky-400 transition-colors px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Panelga Kirish</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

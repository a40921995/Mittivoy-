import React, { useState } from 'react';
import {
  Search,
  Bell,
  Heart,
  ShoppingCart,
  User,
  Sparkles,
  X,
  Grid,
  Lock,
  Smartphone,
  Monitor,
  ChevronDown,
  Phone,
  Truck
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  favoritesCount: number;
  onNavigateToFavorites: () => void;
  cartCount?: number;
  cartTotal?: number;
  onNavigateToCart?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToHome?: () => void;
  onNavigateToCatalog?: (filter?: { category?: string; gender?: string; tag?: string }) => void;
  onQuickCategoryClick?: (cat: string) => void;
  onOpenAdmin?: () => void;
  activeTab?: string;
  isMobileFrameActive?: boolean;
  onToggleMobileFrame?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  unreadNotificationsCount,
  onOpenNotifications,
  favoritesCount,
  onNavigateToFavorites,
  cartCount = 0,
  cartTotal = 0,
  onNavigateToCart,
  onNavigateToProfile,
  onNavigateToHome,
  onNavigateToCatalog,
  onQuickCategoryClick,
  onOpenAdmin,
  activeTab = 'home',
  isMobileFrameActive = false,
  onToggleMobileFrame
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const quickTags = ['Dvoykalar', 'Kurtkalar', 'Ko‘ylaklar', 'Sport kiyimlari', 'Futbolkalar', 'Chegirma'];

  const categoryList = [
    { name: 'Dvoykalar', icon: '👕', gender: 'barchasi' },
    { name: 'Kurtkalar', icon: '🧥', gender: 'barchasi' },
    { name: 'Ko‘ylaklar', icon: '👗', gender: 'qiz' },
    { name: 'Futbolkalar', icon: '👚', gender: 'barchasi' },
    { name: 'Shimlar', icon: '👖', gender: 'barchasi' },
    { name: 'Sport kiyimlari', icon: '🏃', gender: 'barchasi' },
    { name: 'Kostyumlar', icon: '👔', gender: 'ogil' },
    { name: 'Qishki kiyimlar', icon: '❄️', gender: 'barchasi' },
    { name: 'Poyabzallar', icon: '👟', gender: 'barchasi' },
    { name: 'Aksessuarlar', icon: '🧢', gender: 'barchasi' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5F7FF] shadow-[0_4px_20px_rgba(0,184,245,0.06)] select-none transition-all">
      {/* 1. Top Announcement Bar (Desktop & Tablet) */}
      <div className="hidden md:block bg-gradient-to-r from-[#00B8F5] via-[#38BDF8] to-[#0284C7] text-white py-1.5 px-4 text-xs font-semibold">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              <span>O‘zbekiston bo‘ylab 1-2 kunda yetkazib beramiz!</span>
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
              🎁 300 000 so‘mdan yuqori xaridda yetkazish BEPUL
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" />
              <a href="tel:+998901234567" className="hover:underline">
                +998 90 123-45-67
              </a>
            </span>
            {onToggleMobileFrame && (
              <button
                onClick={onToggleMobileFrame}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                title="Mobil ilova simulyatorini yoqish/o‘chirish"
              >
                {isMobileFrameActive ? (
                  <>
                    <Monitor className="w-3 h-3" />
                    <span>Veb-sayt ko‘rinishi</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="w-3 h-3" />
                    <span>Mobil simulyator</span>
                  </>
                )}
              </button>
            )}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1 bg-slate-900/40 hover:bg-slate-900/60 px-2 py-0.5 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Panel</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar (Desktop & Mobile) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        {/* Top row: Logo, search on desktop, and action icons */}
        <div className="flex items-center justify-between gap-2 sm:gap-6">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div
              onClick={onNavigateToHome}
              className="cursor-pointer transition-transform hover:scale-102 active:scale-95"
            >
              <Logo size="md" showSubtitle={true} />
            </div>

            {/* Desktop Catalog Dropdown Button */}
            {onNavigateToCatalog && (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-2 bg-[#E5F7FF] hover:bg-[#d0f0ff] text-[#0096C7] font-extrabold text-xs px-3.5 py-2.5 rounded-2xl border border-[#00B8F5]/30 transition-all active:scale-95 cursor-pointer"
                >
                  <Grid className="w-4 h-4 text-[#00B8F5]" />
                  <span>Katalog</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoryDropdownOpen && (
                  <div
                    className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-pop"
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  >
                    <div className="p-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      Bo‘limlar (1-15 yosh)
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-80 overflow-y-auto no-scrollbar">
                      {categoryList.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() => {
                            onNavigateToCatalog({ category: cat.name });
                            setIsCategoryDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-[#E5F7FF] hover:text-[#0096C7] transition-all text-left cursor-pointer"
                        >
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Search Bar (Hidden on mobile top row, moved to full-width second row below) */}
          <div className="hidden sm:block flex-1 max-w-2xl relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#00B8F5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Bolalar kiyimlarini qidiring (dvoyka, kurtka, ko‘ylak, 100% paxta)..."
              className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200/90 focus:border-[#00B8F5] focus:ring-3 focus:ring-[#00B8F5]/20 transition-all outline-hidden shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-3 text-[10px] bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center text-slate-600 active:scale-90 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Right Action Icons Group */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E5F7FF] hover:bg-[#d0f0ff] text-[#00B8F5] flex items-center justify-center relative transition-all duration-200 active:scale-90 border border-[#00B8F5]/20 shadow-xs cursor-pointer"
              title="Bildirishnomalar"
            >
              <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#00B8F5] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pop">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Wishlist Shortcut */}
            <button
              onClick={onNavigateToFavorites}
              className={`h-9 sm:h-10 px-2 sm:px-3 rounded-2xl flex items-center gap-1.5 transition-all duration-200 active:scale-90 border shadow-xs cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#FF4FA3] text-white border-[#FF4FA3]'
                  : 'bg-[#FFE5F2]/80 hover:bg-[#FFE5F2] text-[#FF4FA3] border-[#FF4FA3]/20'
              }`}
              title="Sevimlilar"
            >
              <div className="relative">
                <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 ${favoritesCount > 0 ? 'fill-current' : ''}`} />
                {favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#FF4FA3] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pop">
                    {favoritesCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-extrabold">Sevimlilar</span>
            </button>

            {/* Desktop/Tablet Cart Button with Total Amount Preview */}
            {onNavigateToCart && (
              <button
                onClick={onNavigateToCart}
                className={`h-9 sm:h-10 px-2.5 sm:px-3.5 rounded-2xl flex items-center gap-2 transition-all duration-200 active:scale-95 border shadow-xs cursor-pointer ${
                  activeTab === 'cart'
                    ? 'bg-[#00B8F5] text-white border-[#00B8F5]'
                    : 'bg-[#E5F7FF] hover:bg-[#d0f0ff] text-[#0096C7] border-[#00B8F5]/30'
                }`}
                title="Savat"
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#00B8F5] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-pop">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-[10px] font-bold opacity-80">Savat</span>
                  <span className="text-xs font-black">
                    {cartTotal > 0 ? `${cartTotal.toLocaleString('uz-UZ')} UZS` : '0 UZS'}
                  </span>
                </div>
              </button>
            )}

            {/* Profile / Account (Desktop) */}
            {onNavigateToProfile && (
              <button
                onClick={onNavigateToProfile}
                className={`hidden sm:flex h-9 sm:h-10 px-2.5 sm:px-3 rounded-2xl items-center gap-1.5 transition-all duration-200 active:scale-95 border shadow-xs cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
                title="Mening profilim"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                <span className="hidden xl:inline text-xs font-extrabold">Profil</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Full-width Search Bar (Visible only on < sm) */}
        <div className="sm:hidden mt-2 relative">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#00B8F5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Bolalar kiyimlarini qidiring..."
            className="w-full bg-[#F8FAFC] hover:bg-[#F1F5F9] focus:bg-white text-slate-800 placeholder-slate-400 text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-200/90 focus:border-[#00B8F5] focus:ring-2 focus:ring-[#00B8F5]/20 transition-all outline-hidden shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-[10px] bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center text-slate-600 active:scale-90 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* 3. Secondary Quick Categories Navigation (Desktop & Mobile Scroll) */}
      <div className="border-t border-slate-100/90 bg-slate-50/70 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToHome && (
              <button
                onClick={onNavigateToHome}
                className={`text-xs font-extrabold px-3 py-1 rounded-xl transition-all ${
                  activeTab === 'home'
                    ? 'bg-[#00B8F5] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                Bosh sahifa
              </button>
            )}

            {onNavigateToCatalog && (
              <>
                <button
                  onClick={() => onNavigateToCatalog({ gender: 'ogil' })}
                  className="text-xs font-extrabold px-3 py-1 rounded-xl text-slate-600 hover:text-[#0096C7] hover:bg-[#E5F7FF] transition-all shrink-0 flex items-center gap-1"
                >
                  <span>👦</span>
                  <span>O‘g‘il bolalar</span>
                </button>

                <button
                  onClick={() => onNavigateToCatalog({ gender: 'qiz' })}
                  className="text-xs font-extrabold px-3 py-1 rounded-xl text-slate-600 hover:text-[#FF4FA3] hover:bg-[#FFE5F2] transition-all shrink-0 flex items-center gap-1"
                >
                  <span>👧</span>
                  <span>Qiz bolalar</span>
                </button>

                <button
                  onClick={() => onNavigateToCatalog({ tag: 'yangi' })}
                  className="text-xs font-extrabold px-3 py-1 rounded-xl text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-all shrink-0 flex items-center gap-1"
                >
                  <span>✨</span>
                  <span>Yangi to‘plam</span>
                </button>

                <button
                  onClick={() => onNavigateToCatalog({ tag: 'chegirma' })}
                  className="text-xs font-extrabold px-3 py-1 rounded-xl text-[#FF4FA3] hover:bg-[#FFE5F2] transition-all shrink-0 flex items-center gap-1 font-black"
                >
                  <span>🔥</span>
                  <span>Chegirmalar %</span>
                </button>
              </>
            )}
          </div>

          {/* Quick tags */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FFD76A]" /> Trend:
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onQuickCategoryClick && onQuickCategoryClick(tag)}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white hover:bg-[#00B8F5] text-slate-600 hover:text-white transition-all shrink-0 active:scale-95 border border-slate-200/60 shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

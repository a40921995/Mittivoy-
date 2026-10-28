import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Percent,
  Flame,
  ArrowRight,
  Heart,
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  Star,
  CheckCircle2,
  Smile,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Ruler
} from 'lucide-react';
import { Product, Banner, CategoryItem } from '../../types';

interface HomeScreenProps {
  banners: Banner[];
  categories: CategoryItem[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateToCatalog: (filter?: { category?: string; gender?: string; tag?: string }) => void;
  onToggleFavorite: (productId: string) => void;
  onQuickAddToCart?: (product: Product) => void;
  favorites: string[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  banners,
  categories,
  products,
  onSelectProduct,
  onNavigateToCatalog,
  onToggleFavorite,
  onQuickAddToCart,
  favorites
}) => {
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0);
  const [genderTab, setGenderTab] = useState<'barchasi' | 'ogil' | 'qiz' | 'uniseks'>('barchasi');
  const [likedAnimId, setLikedAnimId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const activeBanners = banners.filter((b) => b.isActive);

  // Auto slide carousel every 5 seconds (paused when user hovers)
  useEffect(() => {
    if (activeBanners.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length, isHovered]);

  const handleNextBanner = () => {
    setActiveBannerIdx((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrevBanner = () => {
    setActiveBannerIdx((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleLikeClick = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setLikedAnimId(productId);
    onToggleFavorite(productId);
    setTimeout(() => setLikedAnimId(null), 500);

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  // Filtered product collections
  const discounts = products.filter((p) => p.discountPrice && p.discountPrice < p.sellingPrice);
  const newArrivals = products.filter((p) => p.isNewArrival);
  const bestsellers = products.filter((p) => p.isBestseller);
  const recommended = products.filter((p) => p.isRecommended);

  // Gender filtered products
  const displayProducts =
    genderTab === 'ogil'
      ? products.filter((p) => p.gender === 'ogil' || p.gender === 'uniseks')
      : genderTab === 'qiz'
      ? products.filter((p) => p.gender === 'qiz' || p.gender === 'uniseks')
      : genderTab === 'uniseks'
      ? products.filter((p) => p.gender === 'uniseks')
      : products;

  // Category pastel accents
  const categoryPastels = [
    'bg-[#E5F7FF] text-[#0096C7] border-[#00B8F5]/30',
    'bg-[#FFE5F2] text-[#FF4FA3] border-[#FF4FA3]/30',
    'bg-[#FFF7D6] text-[#B45309] border-[#FFD76A]/40',
    'bg-[#EDE9FE] text-[#7C3AED] border-[#A78BFA]/30',
    'bg-[#E6FBF0] text-[#059669] border-[#9BE7C4]/40',
    'bg-[#F0F9FF] text-[#0284C7] border-[#38BDF8]/30'
  ];

  return (
    <div className="pb-20 space-y-8 select-none bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
        {/* 1. ASOSIY BANNER (Desktop & Mobile Optimized Hero) */}
        {activeBanners.length > 0 && (
          <div
            className="relative rounded-3xl overflow-hidden shadow-[0_12px_30px_-5px_rgba(0,184,245,0.2)] bg-gradient-to-r from-[#00B8F5] via-[#A78BFA] to-[#FF4FA3]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Banner aspect ratio: wide on desktop (21/9 or min 400px), 16/9 on mobile */}
            <div className="relative aspect-16/9 md:aspect-21/9 md:min-h-[380px] lg:min-h-[440px] w-full">
              {activeBanners.map((banner, index) => {
                const isActive = activeBannerIdx === index;
                const isGraphicBanner = banner.imageUrl.includes('file_00000000fd48820cb51afb6b30d35335');

                return (
                  <div
                    key={banner.id}
                    onClick={() =>
                      onNavigateToCatalog({
                        category: banner.linkCategory
                      })
                    }
                    className={`absolute inset-0 transition-all duration-700 ease-out cursor-pointer ${
                      isActive
                        ? 'opacity-100 scale-100 z-10'
                        : 'opacity-0 scale-105 z-0 pointer-events-none'
                    }`}
                  >
                    {/* Background Hero Image */}
                    <img
                      src={banner.imageUrl}
                      alt={banner.title}
                      className="w-full h-full object-cover object-center"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />

                    {/* If graphic banner (3-rasm), keep it clean and vivid, add touch-friendly CTA hover */}
                    {isGraphicBanner ? (
                      <div className="absolute inset-0 bg-transparent flex flex-col justify-end p-4 sm:p-8">
                        <div className="flex justify-between items-end">
                          <span className="hidden sm:inline-block bg-white/90 backdrop-blur-md text-[#0096C7] font-black text-xs px-3.5 py-1.5 rounded-full shadow-md">
                            ⭐ Rasmiy Mittivoy To‘plami
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToCatalog({ category: banner.linkCategory });
                            }}
                            className="bg-[#00B8F5] hover:bg-[#0096C7] text-white font-black text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-2xl shadow-xl flex items-center gap-1.5 transition-transform active:scale-95"
                          >
                            <span>Xarid qilish</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Gradient Overlay for regular photo banners */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent md:bg-gradient-to-r md:from-slate-950/90 md:via-slate-900/50 md:to-transparent" />

                        {/* Banner Content */}
                        <div className="relative z-10 max-w-xl space-y-2 sm:space-y-3 p-5 sm:p-8 lg:p-12 text-white flex flex-col justify-end h-full">
                          <span className="inline-block bg-[#FF4FA3] text-white font-black text-[11px] sm:text-xs px-3 py-1 rounded-full tracking-wider uppercase shadow-md">
                            {banner.tag}
                          </span>
                          <h2 className="font-black text-xl sm:text-3xl lg:text-4xl leading-tight drop-shadow-md text-white">
                            {banner.title}
                          </h2>
                          <p className="text-xs sm:text-sm lg:text-base text-slate-200 line-clamp-2 drop-shadow-sm font-medium">
                            {banner.subtitle}
                          </p>

                          {/* Xarid qilish Button */}
                          <div className="pt-2 sm:pt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToCatalog({
                                  category: banner.linkCategory
                                });
                              }}
                              className="bg-white hover:bg-[#E5F7FF] text-[#0096C7] font-black text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl shadow-lg inline-flex items-center gap-2 transition-all duration-200 active:scale-95 hover:shadow-xl cursor-pointer"
                            >
                              <span>Xarid qilish</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}

              {/* Desktop Next/Prev Arrow Controls */}
              {activeBanners.length > 1 && (
                <>
                  <button
                    onClick={handlePrevBanner}
                    className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center backdrop-blur-md transition-all active:scale-90"
                    title="Oldingisi"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextBanner}
                    className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white items-center justify-center backdrop-blur-md transition-all active:scale-90"
                    title="Keyingisi"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Carousel navigation indicator dots */}
              <div className="absolute bottom-4 right-4 sm:right-8 z-20 flex gap-2 items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                {activeBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBannerIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeBannerIdx === i
                        ? 'w-6 bg-white shadow-xs'
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. TRUST VALUE PROPOSITIONS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E5F7FF] text-[#00B8F5] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">Tezkor Yetkazish</h4>
              <p className="text-[11px] text-slate-500">1-2 kunda eshikkacha</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFE5F2] text-[#FF4FA3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">100% Organik Paxta</h4>
              <p className="text-[11px] text-slate-500">Bolalar terisi uchun xavfsiz</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFF7D6] text-[#B45309] flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">Oson Almashtirish</h4>
              <p className="text-[11px] text-slate-500">14 kun ichida kafolat</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#E6FBF0] text-[#059669] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-slate-800">Qulay To‘lovlar</h4>
              <p className="text-[11px] text-slate-500">Click, Paynet va Naqd</p>
            </div>
          </div>
        </div>

        {/* 3. GENDER & AGE SELECTION TABS */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                Kim uchun kiyim izlayapsiz?
              </h2>
              <p className="text-xs text-slate-500">
                1 yoshdan 15 yoshgacha bo‘lgan bolajonlar uchun saralangan to‘plamlar
              </p>
            </div>

            {/* Gender Switcher Pills */}
            <div className="grid grid-cols-4 sm:flex gap-1.5 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
              {[
                { id: 'barchasi', label: 'Barchasi', icon: '🌟' },
                { id: 'ogil', label: 'O‘g‘il', icon: '👦' },
                { id: 'qiz', label: 'Qiz', icon: '👧' },
                { id: 'uniseks', label: 'Uniseks', icon: '✨' }
              ].map((item) => {
                const isSelected = genderTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setGenderTab(item.id as any)}
                    className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${
                      isSelected
                        ? item.id === 'ogil'
                          ? 'bg-gradient-to-r from-[#00B8F5] to-[#0284C7] text-white shadow-md'
                          : item.id === 'qiz'
                          ? 'bg-gradient-to-r from-[#FF4FA3] to-[#E11D48] text-white shadow-md'
                          : item.id === 'uniseks'
                          ? 'bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] text-white shadow-md'
                          : 'bg-slate-900 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. ASOSIY TOIFALAR (3-rasmdagi rasmiy uslub: O'g'il bolalar, Qiz bolalar, Uniseks, Poyabzallar, Aksessuarlar, Qishki, Yozgi) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#00B8F5]" />
              <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                Asosiy Bo‘limlar
              </h2>
            </div>
            <button
              onClick={() => onNavigateToCatalog()}
              className="text-xs text-[#0096C7] font-bold hover:text-[#00B8F5] flex items-center gap-1 cursor-pointer"
            >
              <span>Barchasini ko‘rish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3-rasmdagi 7 ta asosiy pastel toifalar (Horizontal swipe on mobile, grid on desktop) */}
          <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3 overflow-x-auto no-scrollbar pb-2">
            {[
              {
                id: 'cat-ogil',
                name: "O'g'il bolalar",
                ageText: '1-15 yosh',
                filter: { gender: 'ogil' },
                image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#E5F7FF]',
                border: 'border-[#00B8F5]/30',
                textColor: 'text-[#0096C7]',
                arrowColor: 'text-[#00B8F5]'
              },
              {
                id: 'cat-qiz',
                name: 'Qiz bolalar',
                ageText: '1-15 yosh',
                filter: { gender: 'qiz' },
                image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#FFE5F2]',
                border: 'border-[#FF4FA3]/30',
                textColor: 'text-[#FF4FA3]',
                arrowColor: 'text-[#FF4FA3]'
              },
              {
                id: 'cat-uniseks',
                name: 'Uniseks',
                ageText: '1-15 yosh',
                filter: { gender: 'uniseks' },
                image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#FFF7E8]',
                border: 'border-amber-200',
                textColor: 'text-amber-800',
                arrowColor: 'text-amber-600'
              },
              {
                id: 'cat-poyabzal',
                name: 'Poyabzallar',
                ageText: 'Qulay & Yengil',
                filter: { category: 'Poyabzallar' },
                image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#E6FBF0]',
                border: 'border-[#9BE7C4]/40',
                textColor: 'text-[#059669]',
                arrowColor: 'text-emerald-500'
              },
              {
                id: 'cat-aksessuar',
                name: 'Aksessuarlar',
                ageText: 'Ryukzak & Bosh kiyim',
                filter: { category: 'Aksessuarlar' },
                image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#EDE9FE]',
                border: 'border-[#A78BFA]/30',
                textColor: 'text-[#7C3AED]',
                arrowColor: 'text-purple-500'
              },
              {
                id: 'cat-qishki',
                name: 'Qishki kiyimlar',
                ageText: 'Kurtka & Issiq to‘plam',
                filter: { category: 'Kurtkalar' },
                image: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#E0F2FE]',
                border: 'border-sky-200',
                textColor: 'text-sky-800',
                arrowColor: 'text-[#00B8F5]'
              },
              {
                id: 'cat-yozgi',
                name: 'Yozgi kiyimlar',
                ageText: 'Futbolka & Shortik',
                filter: { category: 'Futbolkalar' },
                image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=400&q=80',
                bg: 'bg-[#FFE8E8]',
                border: 'border-rose-200',
                textColor: 'text-rose-700',
                arrowColor: 'text-rose-500'
              }
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => onNavigateToCatalog(c.filter)}
                className={`min-w-[130px] sm:min-w-0 flex-1 p-3 rounded-2xl sm:rounded-3xl border ${c.bg} ${c.border} flex flex-col justify-between items-start text-left transition-all duration-200 hover:scale-102 active:scale-95 shadow-xs shrink-0 cursor-pointer group`}
              >
                <div className="w-full aspect-square rounded-xl sm:rounded-2xl overflow-hidden mb-2 bg-white/70 shadow-2xs">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="w-full flex items-end justify-between gap-1">
                  <div>
                    <h3 className={`text-xs font-black ${c.textColor} leading-tight truncate`}>
                      {c.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {c.ageText}
                    </p>
                  </div>
                  <div className={`w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0 shadow-2xs ${c.arrowColor}`}>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 5. FLASH SALE / KATTA CHEGIRMALAR (Hot Pink Theme) */}
        {discounts.length > 0 && (
          <section className="space-y-4">
            <div className="bg-gradient-to-r from-[#FFE5F2] via-pink-50 to-[#E5F7FF] p-4 sm:p-5 rounded-3xl border border-[#FF4FA3]/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-[#FF4FA3] text-white flex items-center justify-center shadow-md">
                  <Percent className="w-5 h-5 stroke-[3]" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                    Katta Chegirmalar — 40% gacha
                  </h2>
                  <p className="text-xs text-pink-600 font-bold">
                    Eng sevimli bolalar kiyimlari arzonlashtirilgan maxsus narxlarda
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToCatalog({ tag: 'chegirma' })}
                className="text-xs text-white font-black bg-[#FF4FA3] hover:bg-pink-600 px-4 py-2 rounded-xl shadow-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
              >
                <span>Barchasi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {discounts.slice(0, 4).map((product) => renderProductCard(product))}
            </div>
          </section>
        )}

        {/* 6. YANGI KELGANLAR 2026 (Sky Blue Theme) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#E5F7FF] text-[#00B8F5] flex items-center justify-center">
                <Sparkles className="w-4 h-4 fill-current" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                  Yangi Kelgan Kiyimlar 2026
                </h2>
                <p className="text-xs text-slate-500">
                  Bahor-yoz mavsumi uchun 100% paxtali yangi to‘plam
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToCatalog({ tag: 'yangi' })}
              className="text-xs text-[#0096C7] font-bold hover:text-[#00B8F5] flex items-center gap-1 cursor-pointer"
            >
              <span>Ko‘proq ko‘rish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {newArrivals.slice(0, 8).map((product) => renderProductCard(product))}
          </div>
        </section>

        {/* 7. SMART SIZE ADVISOR PROMO BANNER */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-sky-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#00B8F5] text-white flex items-center justify-center shadow-md shrink-0">
              <Ruler className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider bg-[#00B8F5]/10 text-[#0096C7] px-2.5 py-0.5 rounded-full border border-[#00B8F5]/20">
                AQLLI O‘LCHAM YORDAMCHISI
              </span>
              <h3 className="font-black text-base sm:text-lg text-slate-900">
                Farzandingizga qaysi o‘lcham mos kelishini bilmayapsizmi?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
                Farzandingizning yoshi, bo‘yi va vaznini kiriting — tizimimiz eng mos o‘lchamni aniqlab beradi!
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToCatalog()}
            className="bg-[#00B8F5] hover:bg-[#0096C7] text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <span>Katalogda Sinab Ko‘rish</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8. ENG KO‘P SOTILGANLAR (Flame Theme) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-[#FFF7D6] text-[#B45309] flex items-center justify-center">
                <Flame className="w-4 h-4 fill-[#FFD76A] text-[#B45309]" />
              </span>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                  Eng Ko‘p Sotilganlar (Hit Mahsulotlar)
                </h2>
                <p className="text-xs text-slate-500">
                  Ota-onalar tomonidan eng yuqori baholangan kiyimlar
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigateToCatalog({ tag: 'ommabop' })}
              className="text-xs text-[#B45309] font-bold hover:text-amber-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Ko‘rish</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {bestsellers.slice(0, 4).map((product) => renderProductCard(product))}
          </div>
        </section>

        {/* 9. 3-RASMDAGI RASMIY KAFOLAT VA BAXT LENTASI */}
        <section className="bg-gradient-to-r from-[#EBF7FF] via-[#F4FAFF] to-[#FFE5F2]/40 border border-[#00B8F5]/30 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 items-center">
            {/* Tez yetkazib berish */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#00B8F5] flex items-center justify-center shrink-0 shadow-2xs border border-sky-100">
                <Truck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">Tez yetkazib berish</h4>
                <p className="text-[10px] text-slate-500">Butun O‘zbekiston bo‘ylab</p>
              </div>
            </div>

            {/* Sifat kafolati */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#00B8F5] flex items-center justify-center shrink-0 shadow-2xs border border-sky-100">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">Sifat kafolati</h4>
                <p className="text-[10px] text-slate-500">Faqat original mahsulotlar</p>
              </div>
            </div>

            {/* Qulay to'lov */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#00B8F5] flex items-center justify-center shrink-0 shadow-2xs border border-sky-100">
                <CreditCard className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">Qulay to‘lov</h4>
                <p className="text-[10px] text-slate-500">Click va Paynet orqali</p>
              </div>
            </div>

            {/* Qo'llab-quvvatlash */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white text-[#00B8F5] flex items-center justify-center shrink-0 shadow-2xs border border-sky-100">
                <Smile className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-tight">Qo‘llab-quvvatlash</h4>
                <p className="text-[10px] text-slate-500">24/7 onlayn yordam</p>
              </div>
            </div>

            {/* Bolajonlaringizning baxti */}
            <div className="col-span-2 sm:col-span-1 flex items-center gap-2 bg-white/80 p-2.5 rounded-2xl border border-sky-100 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#FFE5F2] text-[#FF4FA3] flex items-center justify-center shrink-0">
                <Heart className="w-4 h-4 fill-current" />
              </div>
              <span className="text-xs font-black text-[#0096C7] leading-tight">
                Bolajonlaringizning baxti biz uchun muhim! ❤️
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  // Helper renderer for product card
  function renderProductCard(product: Product) {
    const isFav = favorites.includes(product.id);
    const isLikePopping = likedAnimId === product.id;
    const discountPct = product.discountPrice
      ? Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)
      : 0;

    return (
      <div
        key={product.id}
        onClick={() => onSelectProduct(product)}
        className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_30px_rgba(0,184,245,0.12)] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
      >
        {/* Product Image Box */}
        <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
          />

          {/* Discount Badge */}
          {discountPct > 0 && (
            <span className="absolute top-3 left-3 bg-[#FF4FA3] text-white font-black text-[10px] sm:text-xs px-2.5 py-1 rounded-full shadow-md tracking-wide">
              -{discountPct}%
            </span>
          )}

          {/* Age range badge */}
          {discountPct === 0 && (
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#0096C7] font-black text-[10px] px-2 py-0.5 rounded-lg shadow-xs">
              {product.ageGroup} yosh
            </span>
          )}

          {/* Animated Heart Button */}
          <button
            type="button"
            onClick={(e) => handleLikeClick(e, product.id)}
            className={`absolute top-3 right-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform duration-200 active:scale-75 ${
              isLikePopping ? 'animate-pop scale-125' : ''
            }`}
            title="Sevimlilarga saqlash"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav
                  ? 'fill-[#FF4FA3] text-[#FF4FA3]'
                  : 'text-slate-400 group-hover:text-[#FF4FA3]'
              }`}
            />
          </button>

          {/* Rating tag */}
          <div className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-slate-800 shadow-xs">
            <Star className="w-3 h-3 fill-[#FFD76A] text-[#FFD76A]" />
            <span>{product.rating}</span>
            <span className="text-slate-400">({product.reviewCount})</span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-3.5 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-[#0096C7] uppercase tracking-wider block">
              {product.category} • {product.gender === 'ogil' ? 'O‘g‘il' : product.gender === 'qiz' ? 'Qiz' : 'Uniseks'}
            </span>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug line-clamp-2 mt-1">
              {product.name}
            </h3>
          </div>

          <div className="pt-2 flex items-end justify-between gap-1 border-t border-slate-50">
            <div className="min-w-0">
              <div className="text-xs sm:text-base font-black text-slate-900 leading-tight">
                {(product.discountPrice || product.sellingPrice).toLocaleString('uz-UZ')} UZS
              </div>
              {product.discountPrice && (
                <div className="text-[10px] text-slate-400 line-through">
                  {product.sellingPrice.toLocaleString('uz-UZ')} UZS
                </div>
              )}
            </div>

            {/* Quick Add To Cart Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onQuickAddToCart) {
                  onQuickAddToCart(product);
                } else {
                  onSelectProduct(product);
                }
              }}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00B8F5] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B8F5] text-white flex items-center justify-center shrink-0 shadow-sm transition-transform active:scale-90 cursor-pointer"
              title="Savatga qo‘shish"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }
};

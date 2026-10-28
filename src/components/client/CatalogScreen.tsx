import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Heart,
  ShoppingCart,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { Product, CategoryItem } from '../../types';

interface CatalogScreenProps {
  products: Product[];
  categories: CategoryItem[];
  searchQuery: string;
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  favorites: string[];
  initialCategory?: string;
  initialGender?: string;
  onQuickAddToCart?: (product: Product) => void;
}

export const CatalogScreen: React.FC<CatalogScreenProps> = ({
  products,
  categories,
  searchQuery,
  onSelectProduct,
  onToggleFavorite,
  favorites,
  initialCategory,
  initialGender,
  onQuickAddToCart
}) => {
  const [selectedGender, setSelectedGender] = useState<string>(
    initialGender || 'barchasi'
  );
  const [selectedAge, setSelectedAge] = useState<string>('barchasi');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || 'barchasi'
  );
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [onlyDiscounts, setOnlyDiscounts] = useState<boolean>(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Age group list
  const ageGroups: { id: string; label: string }[] = [
    { id: 'barchasi', label: 'Barcha yoshlar' },
    { id: '1-3', label: '1–3 yosh' },
    { id: '4-6', label: '4–6 yosh' },
    { id: '7-9', label: '7–9 yosh' },
    { id: '10-12', label: '10–12 yosh' },
    { id: '13-15', label: '13–15 yosh' }
  ];

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCode = p.code.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          if (!matchName && !matchCode && !matchCat) return false;
        }

        // Gender filter
        if (selectedGender !== 'barchasi') {
          if (p.gender !== selectedGender && p.gender !== 'uniseks') {
            return false;
          }
        }

        // Age filter
        if (selectedAge !== 'barchasi' && p.ageGroup !== selectedAge) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'barchasi' && p.category !== selectedCategory) {
          return false;
        }

        // Discount filter
        if (onlyDiscounts && (!p.discountPrice || p.discountPrice >= p.sellingPrice)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice || a.sellingPrice;
        const priceB = b.discountPrice || b.sellingPrice;

        if (selectedSort === 'price_asc') return priceA - priceB;
        if (selectedSort === 'price_desc') return priceB - priceA;
        if (selectedSort === 'rating') return b.rating - a.rating;
        return 0;
      });
  }, [
    products,
    searchQuery,
    selectedGender,
    selectedAge,
    selectedCategory,
    selectedSort,
    onlyDiscounts
  ]);

  const resetFilters = () => {
    setSelectedGender('barchasi');
    setSelectedAge('barchasi');
    setSelectedCategory('barchasi');
    setOnlyDiscounts(false);
    setSelectedSort('newest');
  };

  const isFiltered =
    selectedGender !== 'barchasi' ||
    selectedAge !== 'barchasi' ||
    selectedCategory !== 'barchasi' ||
    onlyDiscounts;

  return (
    <div className="pb-24 pt-4 select-none min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Page Title & Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Bolalar Kiyimlari Katalogi
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              1 yoshdan 15 yoshgacha bo‘lgan barcha o‘g‘il va qiz bolalar to‘plamlari ({filteredProducts.length} ta mahsulot)
            </p>
          </div>

          {/* Mobile Filter toggle button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#00B8F5]" />
              <span>Filtrlar</span>
              {isFiltered && (
                <span className="w-2 h-2 rounded-full bg-[#FF4FA3]" />
              )}
            </button>

            {/* Sort Select */}
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-white border border-slate-200 rounded-2xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00B8F5]"
            >
              <option value="newest">Eng yangi</option>
              <option value="price_asc">Arzondan</option>
              <option value="price_desc">Qimmatdan</option>
              <option value="rating">Reyting</option>
            </select>
          </div>
        </div>

        {/* Desktop & Mobile Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Left Sidebar Filter (Visible on Desktop >= lg) */}
          <aside className="hidden lg:block bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#00B8F5]" />
                <h3 className="font-black text-sm text-slate-900">Filtrlar</h3>
              </div>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[#FF4FA3] hover:underline font-bold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tozalash</span>
                </button>
              )}
            </div>

            {/* Gender filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Jinsi
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'barchasi', label: 'Barchasi' },
                  { id: 'ogil', label: '👦 O‘g‘il' },
                  { id: 'qiz', label: '👧 Qiz' },
                  { id: 'uniseks', label: '✨ Uniseks' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      selectedGender === g.id
                        ? 'bg-[#00B8F5] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age group filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Yosh oralig‘i
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {ageGroups.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      selectedAge === age.id
                        ? 'bg-[#A78BFA] text-white shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                Kategoriya
              </label>
              <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar pr-1">
                <button
                  onClick={() => setSelectedCategory('barchasi')}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                    selectedCategory === 'barchasi'
                      ? 'bg-[#E5F7FF] text-[#0096C7] font-black'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>Barcha kategoriyalar</span>
                  <span className="text-[10px] text-slate-400">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                      selectedCategory === cat.name
                        ? 'bg-[#E5F7FF] text-[#0096C7] font-black'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-slate-400">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Only Discounts Toggle */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDiscounts}
                  onChange={(e) => setOnlyDiscounts(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#FF4FA3] focus:ring-[#FF4FA3]"
                />
                <span className="text-xs font-extrabold text-[#FF4FA3]">
                  Faqat chegirmadagi mahsulotlar 🔥
                </span>
              </label>
            </div>
          </aside>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Desktop Sorting bar */}
            <div className="hidden lg:flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs text-xs">
              <span className="font-bold text-slate-700">
                Topilgan mahsulotlar soni: <strong className="text-slate-900">{filteredProducts.length}</strong> dona
              </span>

              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">Saralash:</span>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#00B8F5]"
                >
                  <option value="newest">Eng yangi kelganlar</option>
                  <option value="price_asc">Narx: Arzondan qimmatga</option>
                  <option value="price_desc">Narx: Qimmatdan arzonga</option>
                  <option value="rating">Reytingi yuqorilar</option>
                </select>
              </div>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-[#00B8F5] mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-black text-base text-slate-900">
                  Hech qanday kiyim topilmadi
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Qidiruv so‘zini o‘zgartiring yoki filtrlarni qayta o‘rnating.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-[#00B8F5] hover:bg-[#0096C7] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Barcha kiyimlarni ko‘rsatish
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {filteredProducts.map((product) => {
                  const isFav = favorites.includes(product.id);
                  const discountPct = product.discountPrice
                    ? Math.round(((product.sellingPrice - product.discountPrice) / product.sellingPrice) * 100)
                    : 0;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onSelectProduct(product)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_28px_rgba(0,184,245,0.12)] transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                        <img
                          src={product.mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500"
                        />

                        {discountPct > 0 ? (
                          <span className="absolute top-2.5 left-2.5 bg-[#FF4FA3] text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                            -{discountPct}%
                          </span>
                        ) : (
                          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#0096C7] font-black text-[9px] px-2 py-0.5 rounded-md shadow-xs">
                            {product.ageGroup} yosh
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(product.id);
                          }}
                          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-slate-400 hover:text-[#FF4FA3] shadow-xs transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFav ? 'fill-[#FF4FA3] text-[#FF4FA3]' : ''
                            }`}
                          />
                        </button>

                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-lg flex items-center gap-1 text-[10px] font-bold text-slate-800 shadow-xs">
                          <Star className="w-3 h-3 fill-[#FFD76A] text-[#FFD76A]" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-[#0096C7] uppercase tracking-wider block">
                            {product.category}
                          </span>
                          <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug">
                            {product.name}
                          </h3>
                        </div>

                        <div className="pt-2 flex items-end justify-between gap-1 border-t border-slate-50">
                          <div>
                            <div className="text-xs sm:text-sm font-black text-slate-900">
                              {(product.discountPrice || product.sellingPrice).toLocaleString('uz-UZ')} UZS
                            </div>
                            {product.discountPrice && (
                              <div className="text-[10px] text-slate-400 line-through">
                                {product.sellingPrice.toLocaleString('uz-UZ')} UZS
                              </div>
                            )}
                          </div>

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
                            className="w-8 h-8 rounded-xl bg-[#00B8F5] hover:bg-[#0096C7] text-white flex items-center justify-center shrink-0 shadow-xs transition-transform active:scale-90"
                            title="Savatga qo‘shish"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-5 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900">Filtrlar</h3>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Gender filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase">Jinsi</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'barchasi', label: 'Barchasi' },
                  { id: 'ogil', label: '👦 O‘g‘il' },
                  { id: 'qiz', label: '👧 Qiz' },
                  { id: 'uniseks', label: '✨ Uniseks' }
                ].map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGender(g.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold ${
                      selectedGender === g.id
                        ? 'bg-[#00B8F5] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age filter */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-700 uppercase">Yosh oralig‘i</label>
              <div className="grid grid-cols-2 gap-1.5">
                {ageGroups.map((age) => (
                  <button
                    key={age.id}
                    onClick={() => setSelectedAge(age.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold ${
                      selectedAge === age.id
                        ? 'bg-[#A78BFA] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {age.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply button */}
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="w-full bg-[#00B8F5] text-white font-black py-3 rounded-2xl shadow-md"
            >
              Natijalarni ko‘rish ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

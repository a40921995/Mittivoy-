import React from 'react';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Product } from '../../types';

interface FavoritesScreenProps {
  products: Product[];
  favorites: string[];
  onSelectProduct: (product: Product) => void;
  onToggleFavorite: (productId: string) => void;
  onNavigateToCatalog: () => void;
  onQuickAddToCart?: (product: Product) => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  products,
  favorites,
  onSelectProduct,
  onToggleFavorite,
  onNavigateToCatalog,
  onQuickAddToCart
}) => {
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="pb-24 pt-4 select-none min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Sevimlilar Ro‘yxati
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Sizga yoqqan bolalar kiyimlari to‘plami ({favoriteProducts.length} ta)
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#FFE5F2] text-[#FF4FA3] flex items-center justify-center shadow-xs">
            <Heart className="w-5 h-5 fill-current" />
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-100 shadow-xs space-y-4 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-[#FFE5F2] text-[#FF4FA3] mx-auto flex items-center justify-center">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="font-black text-lg text-slate-900">
              Sevimlilar ro‘yxati bo‘sh
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              O‘zingizga ma’qul kelgan bolalar kiyimlarini yurakcha belgisi orqali saqlab qo‘ying.
            </p>
            <button
              onClick={onNavigateToCatalog}
              className="bg-gradient-to-r from-[#00B8F5] to-[#0096C7] hover:from-[#0096C7] hover:to-[#00B8F5] text-white font-black text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md inline-flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Katalogga o‘tish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-[#FF4FA3] hover:bg-pink-50 shadow-xs transition-colors cursor-pointer"
                    title="Sevimlilardan o‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <span className="absolute top-2.5 left-2.5 bg-slate-900/70 backdrop-blur-xs text-white text-[9px] font-black px-2 py-0.5 rounded-md">
                    {product.ageGroup} yosh
                  </span>
                </div>

                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-[#0096C7] uppercase">
                      {product.category}
                    </span>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 line-clamp-1 leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  <div className="pt-2 flex items-baseline justify-between border-t border-slate-50">
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {(product.discountPrice || product.sellingPrice).toLocaleString('uz-UZ')} UZS
                    </span>
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
                      className="w-8 h-8 rounded-xl bg-[#00B8F5] hover:bg-[#0096C7] text-white flex items-center justify-center shadow-xs cursor-pointer active:scale-90 transition-transform"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

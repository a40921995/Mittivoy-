import React, { useState } from 'react';
import {
  X,
  Heart,
  ShoppingCart,
  Ruler,
  Star,
  Check,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Layers,
  Bot,
  Zap
} from 'lucide-react';
import { Product, ProductReview } from '../../types';
import { SmartSizeAdvisorModal } from '../common/SmartSizeAdvisorModal';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, variantId: string, color: string, size: string, quantity: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  reviews: ProductReview[];
  onAddReview: (reviewData: { rating: number; comment: string; userName: string }) => void;
  onDirectBuy: (product: Product, variantId: string, color: string, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  reviews,
  onAddReview,
  onDirectBuy
}) => {
  if (!isOpen || !product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isSizeAdvisorOpen, setIsSizeAdvisorOpen] = useState<boolean>(false);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [isAddedSuccess, setIsAddedSuccess] = useState<boolean>(false);

  // New review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [newAuthor, setNewAuthor] = useState<string>('');

  const availableColors = Array.from(
    new Map(product.variants.map((v) => [v.color, v])).values()
  );

  const availableSizesForColor = product.variants.filter(
    (v) => v.color === selectedColor
  );

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const currentStock = currentVariant ? currentVariant.stock : 0;

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const firstSizeInColor = product.variants.find((v) => v.color === color);
    if (firstSizeInColor) {
      setSelectedSize(firstSizeInColor.size);
    }
  };

  const handleAddToCartClick = () => {
    if (!currentVariant) return;
    onAddToCart(product, currentVariant.id, selectedColor, selectedSize, quantity);
    setIsAddedSuccess(true);
    setTimeout(() => {
      setIsAddedSuccess(false);
      onClose();
    }, 600);
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !newAuthor.trim()) return;
    onAddReview({
      rating: newRating,
      comment: newComment,
      userName: newAuthor
    });
    setNewComment('');
    setNewAuthor('');
    setShowReviewForm(false);
  };

  const productReviews = reviews.filter((r) => r.productId === product.id);

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
        <div className="w-full max-w-2xl bg-white rounded-t-[36px] sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slideUp">
          {/* Header Bar */}
          <div className="p-3.5 px-4 flex items-center justify-between border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-[#0096C7] bg-[#E5F7FF] px-2.5 py-1 rounded-full border border-[#00B8F5]/30 uppercase tracking-wider">
                {product.code}
              </span>
              <span className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-full">
                {product.ageGroup} yosh
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(product.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 active:scale-75 ${
                  isFavorite
                    ? 'bg-[#FF4FA3] text-white shadow-md'
                    : 'bg-slate-100 hover:bg-[#FFE5F2] text-slate-600 hover:text-[#FF4FA3]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="overflow-y-auto p-4 space-y-4 text-xs">
            {/* Gallery Image Display */}
            <div className="space-y-2">
              <div className="relative aspect-4/3 w-full bg-slate-100 rounded-3xl overflow-hidden shadow-inner">
                <img
                  src={product.images[activeImageIndex] || product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Hot Pink Discount Tag */}
                {product.discountPrice && (
                  <div className="absolute top-3 left-3 bg-[#FF4FA3] text-white font-black text-[11px] px-3 py-1 rounded-full shadow-md tracking-wider">
                    -
                    {Math.round(
                      ((product.sellingPrice - product.discountPrice) /
                        product.sellingPrice) *
                        100
                    )}
                    % CHEGIRMA
                  </div>
                )}

                {/* Rating badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1 font-bold text-slate-800 text-[11px]">
                  <Star className="w-3.5 h-3.5 fill-[#FFD76A] text-[#FFD76A]" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 font-normal">
                    ({productReviews.length})
                  </span>
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#00B8F5] ring-2 ring-[#00B8F5]/30'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title and Pricing */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#0096C7] uppercase tracking-wider">
                {product.category}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 leading-snug">
                {product.name}
              </h2>
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="text-xl font-black text-[#0096C7]">
                  {(product.discountPrice || product.sellingPrice).toLocaleString('uz-UZ')} UZS
                </span>
                {product.discountPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {product.sellingPrice.toLocaleString('uz-UZ')} UZS
                  </span>
                )}
              </div>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Rang:</span>
                <span className="text-[#0096C7] font-black">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleColorChange(c.color)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                      selectedColor === c.color
                        ? 'border-[#00B8F5] bg-[#E5F7FF] text-[#0096C7] ring-2 ring-[#00B8F5]/30 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: c.colorHex }}
                    />
                    <span>{c.color}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector with Smart Size Button */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">O‘lcham:</span>
                <button
                  onClick={() => setIsSizeAdvisorOpen(true)}
                  className="text-white font-extrabold flex items-center gap-1.5 bg-gradient-to-r from-[#00B8F5] to-[#FF4FA3] px-3 py-1 rounded-xl shadow-xs transition-all active:scale-95 text-[11px]"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Aqlli O‘lcham Tanlash</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {availableSizesForColor.map((variant) => {
                  const isSelected = selectedSize === variant.size;
                  const inStock = variant.stock > 0;
                  return (
                    <button
                      key={variant.id}
                      disabled={!inStock}
                      onClick={() => setSelectedSize(variant.size)}
                      className={`p-2.5 rounded-2xl border text-left transition-all active:scale-95 ${
                        !inStock
                          ? 'border-dashed border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed'
                          : isSelected
                          ? 'border-[#00B8F5] bg-[#E5F7FF] text-[#0096C7] ring-2 ring-[#00B8F5]/30 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="font-black text-xs truncate">
                        {variant.size}
                      </div>
                      <div className="text-[10px] mt-0.5 font-bold">
                        {inStock ? (
                          <span
                            className={
                              variant.stock <= 3
                                ? 'text-amber-600'
                                : 'text-slate-500 font-medium'
                            }
                          >
                            {variant.stock <= 3
                              ? `Faqat ${variant.stock} dona qoldi!`
                              : `${variant.stock} dona mavjud`}
                          </span>
                        ) : (
                          <span className="text-red-400">Tugagan</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-slate-700">Soni:</span>
              <div className="flex items-center gap-3 bg-slate-100 rounded-2xl p-1 border border-slate-200">
                <button
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-xl bg-white shadow-xs font-black text-slate-700 disabled:opacity-40 flex items-center justify-center hover:bg-slate-50 active:scale-90"
                >
                  -
                </button>
                <span className="font-black text-xs text-slate-900 w-6 text-center">
                  {quantity}
                </span>
                <button
                  disabled={quantity >= currentStock}
                  onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                  className="w-8 h-8 rounded-xl bg-white shadow-xs font-black text-slate-700 disabled:opacity-40 flex items-center justify-center hover:bg-slate-50 active:scale-90"
                >
                  +
                </button>
              </div>
            </div>

            {/* Description & Fabric Specs */}
            <div className="bg-[#E5F7FF]/40 rounded-3xl p-3.5 border border-[#00B8F5]/20 space-y-2">
              <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#00B8F5]" />
                <span>Mahsulot Tavsifi & Matosi</span>
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                {product.description}
              </p>
              {product.fabric && (
                <div className="text-[11px] text-[#0096C7] bg-white px-3 py-1 rounded-xl font-bold inline-block border border-[#00B8F5]/20">
                  Mato tarkibi: {product.fabric}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-slate-800 text-xs">Mijozlar Sharhlari</h4>
                  <span className="text-[11px] text-slate-400 font-bold">
                    ({productReviews.length})
                  </span>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-[#0096C7] font-extrabold text-[11px] hover:text-[#00B8F5]"
                >
                  {showReviewForm ? 'Bekor qilish' : '+ Fikr bildirish'}
                </button>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReviewSubmit}
                  className="bg-[#FFE5F2]/40 p-3.5 rounded-2xl border border-[#FF4FA3]/20 space-y-2.5 animate-slideDown"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-700">
                      Baholash:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 active:scale-90"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              star <= newRating
                                ? 'fill-[#FFD76A] text-[#FFD76A]'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ismingiz (masalan, Zarina)"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-[#FF4FA3]"
                  />

                  <textarea
                    required
                    rows={2}
                    placeholder="Mahsulot sifati, o‘lchami haqida fikringiz..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#FF4FA3]"
                  />

                  <button
                    type="submit"
                    className="w-full bg-[#FF4FA3] hover:bg-pink-600 text-white font-extrabold py-2 rounded-xl text-xs transition-all active:scale-95 shadow-xs"
                  >
                    Izohni yuborish
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-2">
                {productReviews.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">
                    Hozircha izohlar mavjud emas. Birinchi bo‘lib baholang!
                  </p>
                ) : (
                  productReviews.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-slate-800">
                            {r.userName}
                          </span>
                          {r.isVerifiedPurchase && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-md font-bold">
                              ✓ Xarid qilingan
                            </span>
                          )}
                        </div>
                        <div className="flex text-[#FFD76A]">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 leading-relaxed">{r.comment}</p>
                      <span className="text-[9px] text-slate-400 font-mono">{r.date}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Bottom Action Footer with Gradient Buttons */}
          <div className="p-3.5 px-4 bg-white border-t border-slate-100 flex items-center gap-2.5 sticky bottom-0 z-20">
            <button
              disabled={currentStock <= 0}
              onClick={handleAddToCartClick}
              className={`flex-1 font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 border ${
                isAddedSuccess
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-md'
                  : 'bg-[#E5F7FF] hover:bg-[#d5f0ff] text-[#0096C7] border-[#00B8F5]/30 disabled:opacity-40'
              }`}
            >
              {isAddedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Qo‘shildi! 🎉</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-[#00B8F5]" />
                  <span>Savatga</span>
                </>
              )}
            </button>

            <button
              disabled={currentStock <= 0}
              onClick={() => {
                if (currentVariant) {
                  onDirectBuy(
                    product,
                    currentVariant.id,
                    selectedColor,
                    selectedSize,
                    quantity
                  );
                  onClose();
                }
              }}
              className="flex-1 bg-gradient-to-r from-[#00B8F5] to-[#0096C7] hover:opacity-95 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all duration-200 active:scale-95 disabled:opacity-40"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Tezkor Xarid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smart Size Advisor Modal */}
      <SmartSizeAdvisorModal
        product={product}
        isOpen={isSizeAdvisorOpen}
        onClose={() => setIsSizeAdvisorOpen(false)}
        onSelectSize={(sz) => setSelectedSize(sz)}
      />
    </>
  );
};

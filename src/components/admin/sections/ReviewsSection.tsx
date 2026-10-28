import React from 'react';
import { MessageSquare, Star, Trash2, CheckCircle, EyeOff, ShieldCheck } from 'lucide-react';
import { ProductReview, Product } from '../../../types';
import { storageService } from '../../../services/storageService';

interface ReviewsSectionProps {
  reviews: ProductReview[];
  products: Product[];
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  products
}) => {
  const handleToggle = (id: string) => {
    storageService.toggleReviewApproval(id);
  };

  const handleDelete = (id: string) => {
    if (confirm('Ushbu sharhni butunlay o‘chirmoqchimisiz?')) {
      storageService.deleteReview(id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-800">11. Izohlar va Reytinglar Moderatsiyasi</h2>
          <p className="text-xs text-slate-500">
            Xaridorlar sharhlari, yulduzli baholar, xarid tasdiqi va nomaqbul matnlarni moderatsiya qilish
          </p>
        </div>
        <span className="bg-sky-50 text-sky-700 border border-sky-200 text-xs px-3 py-1 rounded-xl font-bold">
          {reviews.length} ta sharh
        </span>
      </div>

      <div className="space-y-3">
        {reviews.map((r) => {
          const product = products.find((p) => p.id === r.productId);
          return (
            <div
              key={r.id}
              className={`p-4 rounded-3xl border transition-all space-y-3 ${
                r.approved
                  ? 'bg-white border-slate-200 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xs border border-sky-100">
                    {r.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-xs">{r.userName}</span>
                      {r.isVerifiedPurchase && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Haqiqiy Xaridor</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400">{r.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <button
                    onClick={() => handleToggle(r.id)}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors border ${
                      r.approved
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {r.approved ? 'Faol' : 'Yashirilgan'}
                  </button>

                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="O‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {product && (
                <div className="text-[11px] text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-xl inline-block font-medium">
                  Mahsulot: {product.code} - {product.name}
                </div>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">{r.comment}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

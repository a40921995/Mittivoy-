import React, { useState } from 'react';
import { Ruler, Sparkles, Check, AlertCircle, X, HelpCircle, Bot } from 'lucide-react';
import { Product } from '../../types';

interface SmartSizeAdvisorModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
}

export const SmartSizeAdvisorModal: React.FC<SmartSizeAdvisorModalProps> = ({
  product,
  isOpen,
  onClose,
  onSelectSize
}) => {
  const [age, setAge] = useState<number>(3);
  const [height, setHeight] = useState<number>(98);
  const [weight, setWeight] = useState<number>(14);
  const [bodyBuild, setBodyBuild] = useState<'ozgin' | 'ortacha' | 'toladan'>('ortacha');
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [recommendedSize, setRecommendedSize] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number>(95);
  const [adviceReason, setAdviceReason] = useState<string>('');
  const [askExtraDetails, setAskExtraDetails] = useState<boolean>(false);
  const [chestCircumference, setChestCircumference] = useState<number>(54);

  if (!isOpen) return null;

  const handleCalculate = () => {
    // Scientific sizing calculation for children (1-15 years)
    let targetCm = height;

    if (bodyBuild === 'toladan' || weight > (height - 100) * 0.9 + 15) {
      targetCm += 6;
    } else if (bodyBuild === 'ozgin') {
      targetCm -= 1;
    }

    const availableSizes = Array.from(new Set(product.variants.map((v) => v.size)));
    let bestMatch = availableSizes[0] || '98';
    let minDiff = 999;

    availableSizes.forEach((sz) => {
      const match = sz.match(/\d+/);
      if (match) {
        const num = parseInt(match[0], 10);
        if (num >= 20 && num <= 40) {
          const expectedFootSize = Math.round(15 + age * 1.2);
          const diff = Math.abs(num - expectedFootSize);
          if (diff < minDiff) {
            minDiff = diff;
            bestMatch = sz;
          }
        } else {
          const diff = Math.abs(num - targetCm);
          if (diff < minDiff) {
            minDiff = diff;
            bestMatch = sz;
          }
        }
      }
    });

    setRecommendedSize(bestMatch);
    setConfidenceScore(bodyBuild === 'ortacha' ? 96 : 92);

    const reason = `Farzandingizning bo‘yi (${height} sm), vazni (${weight} kg) va "${
      bodyBuild === 'toladan' ? 'To‘ladan' : bodyBuild === 'ozgin' ? 'Ozg‘in' : 'O‘rtacha'
    }" qomatiga asosan, ushbu model qulay va erkin turishi uchun eng mos o‘lcham hisoblanadi.`;

    setAdviceReason(reason);
    setHasCalculated(true);
  };

  const handleApply = () => {
    onSelectSize(recommendedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-[#E5F7FF] max-h-[92vh]">
        {/* Header with Friendly Robot Mascot */}
        <div className="bg-gradient-to-r from-[#00B8F5] via-[#38BDF8] to-[#FF4FA3] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Friendly Robot Mascot Icon */}
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40 shadow-inner">
              <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
                {/* Robot Antenna */}
                <rect x="17" y="2" width="2" height="5" fill="#FFD76A" />
                <circle cx="18" cy="2" r="2" fill="#FFD76A" />
                {/* Robot Head */}
                <rect x="6" y="7" width="24" height="20" rx="8" fill="white" />
                {/* Cheerful Eyes */}
                <circle cx="12" cy="15" r="2.5" fill="#00B8F5" />
                <circle cx="24" cy="15" r="2.5" fill="#00B8F5" />
                {/* Rosy Cheeks */}
                <circle cx="10" cy="19" r="1.5" fill="#FF4FA3" />
                <circle cx="26" cy="19" r="1.5" fill="#FF4FA3" />
                {/* Smile */}
                <path d="M14 20C15.5 22 20.5 22 22 20" stroke="#00B8F5" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-black text-sm tracking-tight">Mittivoy Maslahatchi</h3>
                <span className="bg-[#FFD76A] text-slate-900 text-[9px] font-black px-1.5 py-0.2 rounded-md">
                  AI BOT
                </span>
              </div>
              <p className="text-[11px] text-sky-100">Bolaning qomatiga mos o‘lcham hisoblash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all active:scale-95"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Target Product Summary Card */}
          <div className="bg-[#E5F7FF]/50 rounded-2xl p-3 border border-[#00B8F5]/20 flex items-center gap-2.5">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#0096C7] font-bold uppercase">{product.code}</span>
              <h4 className="font-extrabold text-slate-800 truncate">{product.name}</h4>
              <p className="text-[11px] text-slate-500 font-medium">
                Mavjud o‘lchamlar: {product.variants.map((v) => v.size).join(', ')}
              </p>
            </div>
          </div>

          {/* Input Controls */}
          <div className="space-y-3.5">
            {/* Age Slider with Visual Label */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <div className="flex justify-between items-center font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>🎂 Bolaning yoshi:</span>
                </span>
                <span className="text-white font-black bg-[#00B8F5] px-2.5 py-0.5 rounded-full text-xs shadow-xs">
                  {age} yosh
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={age}
                onChange={(e) => {
                  const a = parseInt(e.target.value);
                  setAge(a);
                  setHeight(Math.round(75 + a * 6));
                  setWeight(Math.round(9 + a * 2.5));
                }}
                className="w-full accent-[#00B8F5] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                <span>1 yosh</span>
                <span>7 yosh</span>
                <span>15 yosh</span>
              </div>
            </div>

            {/* Height & Weight Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                  📏 Bo‘yi (sm):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="60"
                    max="180"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:outline-hidden focus:border-[#00B8F5] shadow-xs"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-slate-400 font-bold">
                    sm
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                <label className="block font-bold text-slate-800 mb-1 text-[11px]">
                  ⚖️ Vazni (kg):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="5"
                    max="80"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-black text-slate-800 focus:outline-hidden focus:border-[#00B8F5] shadow-xs"
                  />
                  <span className="absolute right-3 top-2.5 text-[11px] text-slate-400 font-bold">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Body Build Selector */}
            <div>
              <label className="block font-bold text-slate-800 mb-1.5 text-[11px]">
                Bolaning gavdasi (Qomati):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'ozgin', label: 'Ozg‘in' },
                  { id: 'ortacha', label: 'O‘rtacha' },
                  { id: 'toladan', label: 'To‘ladan' }
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBodyBuild(b.id as any)}
                    className={`py-2 px-2 rounded-xl text-center font-bold text-xs transition-all border ${
                      bodyBuild === b.id
                        ? 'bg-gradient-to-r from-[#00B8F5] to-[#0284C7] text-white border-transparent shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional finer measurement toggle */}
            <div>
              <button
                type="button"
                onClick={() => setAskExtraDetails(!askExtraDetails)}
                className="text-[11px] text-[#0096C7] hover:text-[#00B8F5] flex items-center gap-1 font-bold"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#00B8F5]" />
                <span>
                  {askExtraDetails
                    ? 'Qo‘shimcha o‘lchamlarni yashirish'
                    : 'Qo‘shimcha o‘lcham kiritish (ko‘krak / bel)'}
                </span>
              </button>

              {askExtraDetails && (
                <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 animate-slideDown">
                  <label className="block font-medium text-slate-700 mb-1 text-[11px]">
                    Ko‘krak aylanasi (sm):
                  </label>
                  <input
                    type="number"
                    value={chestCircumference}
                    onChange={(e) => setChestCircumference(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
              )}
            </div>

            {/* Calculate Button with Gradient */}
            <button
              onClick={handleCalculate}
              className="w-full bg-gradient-to-r from-[#00B8F5] via-[#38BDF8] to-[#FF4FA3] hover:opacity-95 text-white font-extrabold py-3 rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Ruler className="w-4 h-4" />
              <span>Tavsiya Olish</span>
            </button>
          </div>

          {/* Results Card */}
          {hasCalculated && (
            <div className="bg-gradient-to-br from-[#E6FBF0] via-teal-50 to-[#E5F7FF] rounded-3xl p-4 border border-[#9BE7C4] space-y-3 animate-pop shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-800 uppercase tracking-wide">
                  Tavsiya Etilgan O‘lcham:
                </span>
                <span className="bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                  {confidenceScore}% mos keladi
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border-2 border-emerald-300 flex items-center justify-center shrink-0">
                  <span className="text-xl font-black text-emerald-600">{recommendedSize}</span>
                </div>
                <div className="flex-1">
                  <p className="text-slate-700 text-xs leading-relaxed font-medium">
                    {adviceReason}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[10px] text-amber-800 bg-amber-50/90 p-2.5 rounded-xl border border-amber-200/80">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                <span>
                  Eslatma: Ushbu tavsiya taxminiy hisoblanadi. Bolaning individual o‘sishiga qarab o‘zingiz mos deb bilgan o‘lchamni tasdiqlang.
                </span>
              </div>

              <button
                onClick={handleApply}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>"{recommendedSize}" O‘lchamini Tanlash</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

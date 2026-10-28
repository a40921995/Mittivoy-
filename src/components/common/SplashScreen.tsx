import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';
import { Sparkles, Heart, Cloud, Star } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2400
}) => {
  const [stage, setStage] = useState<'initial' | 'visible' | 'fading'>('initial');

  useEffect(() => {
    // Stage 1: Entrance
    const timer1 = setTimeout(() => {
      setStage('visible');
    }, 100);

    // Stage 2: Fade out
    const timer2 = setTimeout(() => {
      setStage('fading');
    }, durationMs - 400);

    // Stage 3: Finish
    const timer3 = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [durationMs, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col items-center justify-between p-6 select-none transition-opacity duration-400 bg-gradient-to-b from-[#E5F7FF] via-white to-[#FFE5F2] ${
        stage === 'fading' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Floating Whimsical Elements: Clouds, Stars, Hearts */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left cloud */}
        <div className="absolute top-12 left-6 text-sky-200/80 animate-float">
          <Cloud className="w-14 h-14 fill-current" />
        </div>
        {/* Top right star */}
        <div className="absolute top-20 right-8 text-[#FFD76A] animate-spin" style={{ animationDuration: '12s' }}>
          <Star className="w-8 h-8 fill-current" />
        </div>
        {/* Middle left heart */}
        <div className="absolute top-1/3 left-8 text-[#FF4FA3]/40 animate-pulse">
          <Heart className="w-7 h-7 fill-current" />
        </div>
        {/* Middle right floating sparkle */}
        <div className="absolute top-1/2 right-6 text-[#A78BFA]/50 animate-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-9 h-9" />
        </div>
        {/* Bottom left star */}
        <div className="absolute bottom-24 left-10 text-[#9BE7C4]/70">
          <Star className="w-6 h-6 fill-current" />
        </div>
        {/* Bottom right cute cloud */}
        <div className="absolute bottom-28 right-8 text-pink-200/80 animate-float" style={{ animationDelay: '2s' }}>
          <Cloud className="w-16 h-16 fill-current" />
        </div>
      </div>

      {/* Top Header spacer & Skip button */}
      <div className="w-full flex justify-end z-10 pt-2">
        <button
          onClick={onFinish}
          className="text-xs font-bold text-slate-400 hover:text-slate-700 bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs transition-all active:scale-95"
        >
          O‘tkazib yuborish ›
        </button>
      </div>

      {/* Main Center Animated Logo & Branding */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
        <div
          className={`transition-all duration-700 transform ${
            stage === 'visible'
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-75 opacity-0 translate-y-6'
          }`}
        >
          <Logo size="xl" showSubtitle={false} animated={true} />
        </div>

        {/* Brand Tagline */}
        <div
          className={`mt-4 transition-all duration-700 delay-200 transform ${
            stage === 'visible'
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-sm font-extrabold text-slate-800 tracking-wide">
            MITTIVOY — Bolalar kiyimlari
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            1 yoshdan 15 yoshgacha sifatli & nafis to‘plamlar
          </p>
        </div>

        {/* Loading Pill Dots */}
        <div className="flex items-center gap-2 mt-8">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00B8F5] animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF4FA3] animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFD76A] animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>

      {/* Bottom Footer Details */}
      <div className="text-[10px] text-slate-400 font-medium z-10 pb-4 text-center">
        O‘zbekiston bo‘ylab tezkor yetkazib berish
      </div>
    </div>
  );
};

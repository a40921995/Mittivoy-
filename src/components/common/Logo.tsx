import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  isLight?: boolean;
  animated?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = '',
  isLight = false,
  animated = false
}) => {
  // Height & width sizing for the official Mittivoy brand logo
  const logoDimensions = {
    xs: 'h-7',
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14',
    xl: 'h-20'
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm font-black',
    md: 'text-base font-black',
    lg: 'text-xl font-black',
    xl: 'text-2xl font-black'
  };

  const subSizes = {
    xs: 'text-[7px]',
    sm: 'text-[8px]',
    md: 'text-[9px]',
    lg: 'text-[11px]',
    xl: 'text-xs font-semibold'
  };

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* 2-rasm: Mittivoy rasmiy brend logotipi */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 ${
          animated ? 'animate-bounce-cart' : 'hover:scale-105'
        }`}
      >
        <img
          src="/assets/aistudio/IMG_20261028_135335_942_5decdc59.jpg"
          alt="MITTIVOY Bolalar Kiyimlari"
          className={`${logoDimensions[size]} w-auto object-contain rounded-xl drop-shadow-xs`}
          loading="eager"
        />
      </div>

      {showSubtitle && (
        <div className="flex flex-col justify-center leading-tight">
          <div className="flex items-center">
            <span
              className={`tracking-tight ${textSizes[size]} ${
                isLight ? 'text-white' : 'text-[#0096C7]'
              }`}
              style={{ fontFamily: "'Quicksand', 'Plus Jakarta Sans', sans-serif" }}
            >
              MITTI<span className="text-[#00B8F5]">VOY</span>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4FA3] ml-1 mb-0.5 animate-pulse" />
          </div>
          <span
            className={`tracking-wider uppercase font-bold ${subSizes[size]} ${
              isLight ? 'text-sky-100' : 'text-slate-400'
            }`}
          >
            Bolalar kiyimlari
          </span>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Smartphone, Monitor, Wifi, WifiOff, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';

export type DeviceMode = 'iphone' | 'android' | 'fullscreen';

interface DeviceFrameProps {
  children: React.ReactNode;
  activeMode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  onReplaySplash?: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  activeMode,
  onModeChange,
  isOffline,
  onToggleOffline,
  onOpenAdmin,
  isAdminOpen,
  onReplaySplash
}) => {
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start py-2 sm:py-4 px-2 select-none overflow-x-hidden">
      {/* Top Preview Bar */}
      <header className="w-full max-w-5xl mb-3 flex flex-wrap items-center justify-between gap-3 bg-slate-800/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700 shadow-xl text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00B8F5] animate-pulse" />
          <span className="font-extrabold text-white tracking-wide">MITTIVOY Mobil Applet</span>
          <span className="hidden sm:inline bg-[#00B8F5]/20 text-[#00B8F5] px-2 py-0.5 rounded-full text-[10px] font-black border border-[#00B8F5]/30">
            Expo React Native & Web
          </span>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onModeChange('iphone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              activeMode === 'iphone'
                ? 'bg-[#00B8F5] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 16 Pro</span>
          </button>

          <button
            onClick={() => onModeChange('android')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              activeMode === 'android'
                ? 'bg-[#00B8F5] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => onModeChange('fullscreen')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all active:scale-95 ${
              activeMode === 'fullscreen'
                ? 'bg-[#00B8F5] text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">To‘liq Ekran</span>
          </button>
        </div>

        {/* Utility Controls */}
        <div className="flex items-center gap-2">
          {/* Replay Splash Screen button */}
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              title="Splash Screen animatsiyasini qayta ko‘rish"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold bg-slate-700/80 hover:bg-slate-700 text-sky-300 border border-slate-600 transition-all active:scale-95"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden md:inline">Splash</span>
            </button>
          )}

          {/* Offline simulator toggle */}
          <button
            onClick={onToggleOffline}
            title="Oflayn kassa rejimini sinash"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all border ${
              isOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Oflayn' : 'Onlayn'}</span>
          </button>

          {/* Quick Admin Portal Button */}
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black transition-all border active:scale-95 ${
              isAdminOpen
                ? 'bg-gradient-to-r from-[#FF4FA3] to-pink-600 text-white border-pink-400 shadow-md'
                : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-pink-300" />
            <span>{isAdminOpen ? 'Do‘konga qaytish' : 'Admin Panel'}</span>
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <main className="w-full flex justify-center items-center flex-1">
        {activeMode === 'fullscreen' ? (
          <div className="w-full max-w-5xl min-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-700 overflow-hidden relative flex flex-col">
            {children}
          </div>
        ) : activeMode === 'iphone' ? (
          // Realistic iPhone 16 Pro Frame with Dynamic Island
          <div className="w-[393px] h-[852px] bg-black rounded-[52px] p-[10px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] border-[4px] border-slate-700 relative flex flex-col shrink-0 ring-1 ring-slate-600">
            {/* Screen Inner */}
            <div className="w-full h-full bg-white rounded-[44px] overflow-hidden relative flex flex-col">
              {/* Dynamic Island & iOS Status Bar */}
              <div className="w-full h-11 bg-white/95 backdrop-blur-md flex items-center justify-between px-7 shrink-0 z-50 select-none">
                <span className="text-[13px] font-bold text-slate-800 tracking-tight">
                  {currentTime}
                </span>

                {/* Dynamic Island pill */}
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-between px-2.5 mx-auto -mt-1 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                    <span className="w-1 h-1 rounded-full bg-indigo-900" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#00B8F5] animate-pulse" />
                </div>

                {/* Right Status Icons */}
                <div className="flex items-center gap-1.5 text-slate-700">
                  {isOffline ? (
                    <WifiOff className="w-3 h-3 text-amber-600" />
                  ) : (
                    <Wifi className="w-3 h-3 text-slate-800" />
                  )}
                  {/* Battery icon */}
                  <div className="w-5 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-slate-800 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Mobile Content Screen */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="w-full h-5 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0 z-50">
                <div className="w-32 h-1 bg-slate-300 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          // Realistic Android Samsung Galaxy Frame
          <div className="w-[390px] h-[844px] bg-slate-950 rounded-[44px] p-[8px] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.9)] border-[3px] border-slate-700 relative flex flex-col shrink-0 ring-1 ring-slate-600">
            {/* Screen Inner */}
            <div className="w-full h-full bg-white rounded-[38px] overflow-hidden relative flex flex-col">
              {/* Android Status Bar with Punch Hole */}
              <div className="w-full h-9 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 select-none">
                <span className="text-[12px] font-bold text-slate-800">{currentTime}</span>

                {/* Punch hole camera */}
                <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto ring-1 ring-slate-800" />

                <div className="flex items-center gap-2 text-slate-700 text-[11px] font-bold">
                  {isOffline ? (
                    <WifiOff className="w-3 h-3 text-amber-600" />
                  ) : (
                    <Wifi className="w-3 h-3" />
                  )}
                  <span>5G</span>
                  <div className="w-4 h-2.5 border border-slate-700 rounded-xs p-0.5 flex items-center">
                    <div className="w-3/4 h-full bg-slate-800" />
                  </div>
                </div>
              </div>

              {/* Mobile Content Screen */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col">
                {children}
              </div>

              {/* Android Bottom Nav Pill */}
              <div className="w-full h-5 bg-white/95 backdrop-blur-md flex items-center justify-center shrink-0 z-50">
                <div className="w-20 h-1 bg-slate-400 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

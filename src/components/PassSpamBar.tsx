import React, { useState } from 'react';
import { Flame, Zap, Sparkles, ChevronsDown, HandMetal } from 'lucide-react';

interface PassSpamBarProps {
  charge: number; // 0 to 100
  onTap: () => void;
  passKey: string;
}

interface FloatingPopup {
  id: number;
  text: string;
  x: number;
}

export const PassSpamBar: React.FC<PassSpamBarProps> = ({ charge, onTap, passKey }) => {
  const percent = Math.min(100, Math.max(0, charge));
  const isHigh = percent > 65;
  const isAlmostFull = percent > 85;

  const [popups, setPopups] = useState<FloatingPopup[]>([]);

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    onTap();

    // Spawn floating +bonus text
    const words = ['+20%', '+22%', '¡FUEGO! 🔥', '¡DALE! ⚡', '¡SPAM!'];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const newPopup: FloatingPopup = {
      id: Date.now() + Math.random(),
      text: randomWord,
      x: 30 + Math.random() * 40,
    };

    setPopups((prev) => [...prev.slice(-6), newPopup]);
    setTimeout(() => {
      setPopups((curr) => curr.filter((p) => p.id !== newPopup.id));
    }, 700);
  };

  return (
    <div className="w-full max-w-lg mx-auto select-none flex flex-col items-center z-40 px-3 pb-1">
      {/* Floating Popups */}
      <div className="relative w-full h-0 overflow-visible pointer-events-none">
        {popups.map((p) => (
          <div
            key={p.id}
            className="absolute -top-10 font-arcade text-sm sm:text-base font-black text-yellow-300 drop-shadow-[0_2px_8px_rgba(234,88,12,0.9)] animate-float-fade"
            style={{ left: `${p.x}%` }}
          >
            {p.text}
          </div>
        ))}
      </div>

      {/* Dynamic Dopaminic Header with glowing badges */}
      <div className="flex items-center justify-between w-full mb-1 px-1">
        <div className="flex items-center gap-1.5 text-xs font-arcade tracking-wider uppercase text-yellow-300 drop-shadow">
          <Flame
            className={`w-4 h-4 ${
              isAlmostFull ? 'text-yellow-200 animate-spin' : isHigh ? 'text-orange-400 animate-bounce' : 'text-red-500'
            }`}
          />
          <span>
            {isAlmostFull
              ? '¡A PUNTO DE ESTALLAR! ¡UN TOQUE MÁS!'
              : isHigh
              ? '¡MÁS RÁPIDO! ¡CARGANDO LANZAMIENTO!'
              : `¡SPAM [${passKey}] O CLICKS RÁPIDOS!`}
          </span>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-[10px] font-black text-red-400 animate-pulse">
          <ChevronsDown className="w-3 h-3 text-red-400" />
          <span>¡SE VACÍA!</span>
        </div>
      </div>

      {/* Main Bar Frame with Liquid Fire Fill */}
      <div
        onClick={handleTap}
        onTouchStart={handleTap}
        className={`w-full h-11 sm:h-13 rounded-2xl bg-slate-950/95 border-3 transition-all flex items-center relative overflow-hidden shadow-2xl cursor-pointer active:scale-98 ${
          isAlmostFull
            ? 'border-yellow-300 shadow-yellow-500/80 ring-4 ring-yellow-400/40'
            : isHigh
            ? 'border-orange-500 shadow-orange-600/70 ring-2 ring-orange-500/40'
            : 'border-red-600 shadow-red-950/90'
        }`}
      >
        {/* Animated Background Pulse Wave */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-orange-950/30 to-slate-950 pointer-events-none" />

        {/* Dynamic Molten Fluid Bar Fill */}
        <div
          className="h-full rounded-xl transition-all duration-75 ease-out flex items-center justify-end pr-3 relative overflow-hidden"
          style={{
            width: `${percent}%`,
            background:
              percent > 85
                ? 'linear-gradient(90deg, #dc2626, #ea580c, #facc15, #ffffff)'
                : percent > 45
                ? 'linear-gradient(90deg, #991b1b, #dc2626, #f97316, #facc15)'
                : 'linear-gradient(90deg, #7f1d1d, #b91c1c, #ea580c)',
            boxShadow: isHigh
              ? '0 0 25px rgba(250, 204, 21, 0.9), inset 0 0 15px rgba(255, 255, 255, 0.6)'
              : '0 0 12px rgba(239, 68, 68, 0.6)',
          }}
        >
          {/* Shimmer light beam traveling across the fill */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />

          {/* End cap indicator */}
          {percent > 15 && (
            <div className="relative z-10 flex items-center gap-0.5">
              <Zap className="w-5 h-5 text-slate-950 animate-bounce fill-yellow-300 stroke-yellow-950" />
            </div>
          )}
        </div>

        {/* Text inside Bar */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <div className="flex items-center gap-2 font-arcade text-xs sm:text-base tracking-widest text-white drop-shadow-[0_2px_6px_rgba(0,0,0,1)]">
            <span className="font-black text-yellow-300">{Math.round(percent)}%</span>
            <span>FUERZA DE PASE</span>
            {isAlmostFull && <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />}
          </div>
        </div>
      </div>

      {/* Big tactile button for Mobile Touch & Quick Mouse Clicks */}
      <button
        onClick={handleTap}
        onTouchStart={handleTap}
        className={`w-full mt-2 py-2.5 sm:py-3 rounded-2xl font-arcade text-xs sm:text-sm tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
          isAlmostFull
            ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-300 text-slate-950 border-2 border-white animate-bounce'
            : isHigh
            ? 'bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-400 text-slate-950 border-2 border-yellow-300'
            : 'bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white border-2 border-orange-400'
        }`}
      >
        <HandMetal className="w-4 h-4" />
        <span>¡DALE CLICK O ESPACIO REPETIDAMENTE PARA LLENAR!</span>
        <Flame className="w-4 h-4 animate-bounce" />
      </button>

      {/* Floating style animations */}
      <style>{`
        @keyframes floatFade {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(1.3);
            opacity: 0;
          }
        }
        .animate-float-fade {
          animation: floatFade 0.7s forwards ease-out;
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 1.8s infinite linear;
        }
      `}</style>
    </div>
  );
};

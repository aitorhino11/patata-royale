import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, Crown, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { Player } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface VictoryPodiumModalProps {
  isOpen: boolean;
  winner: Player | null;
  isUserWinner: boolean;
  userRank: number | null;
  coinsEarned: number;
  xpEarned: number;
  userLevel: number;
  didLevelUp?: boolean;
  onPlayAgain: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
}

export const VictoryPodiumModal: React.FC<VictoryPodiumModalProps> = ({
  isOpen,
  winner,
  isUserWinner,
  userRank,
  coinsEarned,
  xpEarned,
  userLevel,
  didLevelUp = false,
  onPlayAgain,
  onOpenShop,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (isUserWinner) {
        soundEngine.playVictoryFanfare();
        // High dopamine celebratory confetti blast sequence
        const end = Date.now() + 2500;
        const frame = () => {
          confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#facc15', '#ef4444', '#38bdf8', '#22c55e'],
          });
          confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#facc15', '#ef4444', '#38bdf8', '#22c55e'],
          });
          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        };
        frame();
      } else {
        soundEngine.playClick();
      }
    }
  }, [isOpen, isUserWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn select-none overflow-hidden">
      {/* Golden God Rays rotating background */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden opacity-30">
        <div
          className="w-[800px] h-[800px] rounded-full animate-spin"
          style={{
            animationDuration: '25s',
            background:
              'conic-gradient(from 0deg, transparent 0deg 20deg, rgba(250, 204, 21, 0.4) 20deg 40deg, transparent 40deg 60deg, rgba(249, 115, 22, 0.4) 60deg 80deg, transparent 80deg 100deg, rgba(250, 204, 21, 0.4) 100deg 120deg, transparent 120deg 140deg, rgba(249, 115, 22, 0.4) 140deg 160deg, transparent 160deg 180deg, rgba(250, 204, 21, 0.4) 180deg 200deg, transparent 200deg 220deg, rgba(249, 115, 22, 0.4) 220deg 240deg, transparent 240deg 260deg, rgba(250, 204, 21, 0.4) 260deg 280deg, transparent 280deg 300deg, rgba(249, 115, 22, 0.4) 300deg 320deg, transparent 320deg 340deg, rgba(250, 204, 21, 0.4) 340deg 360deg)',
          }}
        />
      </div>

      {/* Main Victory Card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/60 border-2 border-yellow-400/80 rounded-3xl shadow-2xl shadow-yellow-500/30 p-6 flex flex-col items-center text-center z-10">
        {/* Title Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 font-arcade text-xs mb-2 animate-bounce">
          <Crown className="w-4 h-4 text-yellow-400" />
          <span>{isUserWinner ? '¡CAMPEÓN SUPREMO!' : '¡FINAL DE PARTIDA!'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-arcade tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-100 drop-shadow">
          {isUserWinner ? '¡VICTORIA ROYALE!' : '¡HAS SIDO ELIMINADO!'}
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isUserWinner
            ? '¡Sobreviviste a las 10 minibombas y levantaste el gran trofeo!'
            : `Quedaste en el puesto #${userRank || 2} de 10 participantes`}
        </p>

        {/* --- 3D GOLDEN PODIUM & WINNER LIFTING TOY STORY POTATO TROPHY --- */}
        <div className="relative my-4 w-64 h-60 flex flex-col items-center justify-end">
          {/* Sparkles around trophy */}
          <div className="absolute top-2 left-6 text-yellow-300 text-lg animate-ping">✨</div>
          <div className="absolute top-4 right-6 text-yellow-300 text-lg animate-ping">✨</div>

          {/* SVG Composition: Mini-Bomb Winner raising the Golden Potato Trophy */}
          <svg viewBox="0 0 160 170" className="w-full h-full overflow-visible drop-shadow-2xl">
            <defs>
              <linearGradient id="podiumGold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="30%" stopColor="#facc15" />
                <stop offset="80%" stopColor="#ca8a04" />
                <stop offset="100%" stopColor="#713f12" />
              </linearGradient>

              <radialGradient id="potatoTrophyGrad" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fffbeb" />
                <stop offset="30%" stopColor="#fde047" />
                <stop offset="70%" stopColor="#eab308" />
                <stop offset="100%" stopColor="#854d0e" />
              </radialGradient>
            </defs>

            {/* 3D Gold Podium (#1) */}
            <g transform="translate(25, 110)">
              {/* Top Surface */}
              <polygon points="10,10 100,10 90,0 20,0" fill="#fde047" stroke="#ca8a04" strokeWidth="1.5" />
              {/* Front Face */}
              <rect x="10" y="10" width="90" height="45" fill="url(#podiumGold)" stroke="#854d0e" strokeWidth="1.5" />
              {/* Giant #1 Embossed on Podium */}
              <text x="55" y="42" fill="#78350f" fontSize="30" fontFamily="'Titan One', cursive" textAnchor="middle" fontWeight="bold">
                #1
              </text>
            </g>

            {/* Winner Minibomb Body */}
            <g transform="translate(56, 68)">
              {/* Boots */}
              <ellipse cx="14" cy="46" rx="7" ry="4" fill="#0f172a" />
              <ellipse cx="34" cy="46" rx="7" ry="4" fill="#0f172a" />

              {/* Bomb Sphere */}
              <circle cx="24" cy="24" r="22" fill={isUserWinner ? '#0284c7' : '#991b1b'} stroke="#facc15" strokeWidth="2.5" />
              {/* Gloss Highlight */}
              <ellipse cx="17" cy="14" rx="7" ry="4" fill="#ffffff" opacity="0.45" transform="rotate(-30 17 14)" />

              {/* Happy Big Eyes */}
              <ellipse cx="18" cy="22" rx="4" ry="5.5" fill="#ffffff" />
              <circle cx="19" cy="22" r="2.2" fill="#0f172a" />
              <ellipse cx="30" cy="22" rx="4" ry="5.5" fill="#ffffff" />
              <circle cx="29" cy="22" r="2.2" fill="#0f172a" />

              {/* Huge Joyful Smile */}
              <path d="M 18 30 Q 24 38 30 30" fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />

              {/* Both Arms raised UP high holding the trophy! */}
              <line x1="8" y1="20" x2="-2" y2="-6" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
              <line x1="40" y1="20" x2="50" y2="-6" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" />
            </g>

            {/* --- THE GOLDEN TOY STORY POTATO TROPHY HELD HIGH --- */}
            <g transform="translate(56, 12)">
              {/* Trophy Cup Base / Pedestal */}
              <ellipse cx="24" cy="52" rx="14" ry="4" fill="#ca8a04" stroke="#713f12" strokeWidth="1" />
              <rect x="20" y="44" width="8" height="8" fill="#eab308" />

              {/* The Golden Toy Story Potato Body */}
              <path
                d="M 14 16 C 30 10, 38 12, 42 22 C 46 34, 46 44, 38 48 C 30 52, 16 52, 10 46 C 4 38, 6 26, 8 20 Z"
                fill="url(#potatoTrophyGrad)"
                stroke="#a16207"
                strokeWidth="1.5"
              />

              {/* Golden Bowler Hat */}
              <ellipse cx="24" cy="16" rx="16" ry="4" fill="#713f12" />
              <path d="M 16 15 C 16 6, 32 6, 32 15 Z" fill="#854d0e" stroke="#713f12" strokeWidth="1" />

              {/* Trophy Pinkish/Golden Bulbous Nose */}
              <ellipse cx="24" cy="28" rx="6" ry="7" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />

              {/* Trophy Curved Mustache */}
              <path
                d="M 24 34 C 20 31, 12 31, 8 36 C 12 38, 18 36, 24 37 C 30 36, 36 38, 40 36 C 36 31, 28 31, 24 34 Z"
                fill="#78350f"
              />

              {/* Crown on the Potato Trophy */}
              <path d="M 14 4 L 18 -4 L 24 0 L 30 -4 L 34 4 Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1" />

              {/* Radiant Star Flares */}
              <circle cx="8" cy="14" r="2" fill="#ffffff" />
              <circle cx="40" cy="24" r="2" fill="#ffffff" />
            </g>
          </svg>
        </div>

        {/* Winner Name Banner */}
        <div className="px-4 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center gap-2 mb-4">
          <span className="text-slate-400 text-xs">Vencedor:</span>
          <span className="text-yellow-300 font-arcade text-sm">
            {winner ? `${winner.avatar} ${winner.name}` : 'Campeón'}
          </span>
        </div>

        {/* High Dopamine Rewards Grid */}
        <div className="w-full grid grid-cols-2 gap-3 my-2">
          <div className="p-3 rounded-2xl bg-slate-950/80 border-2 border-yellow-400/40 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-yellow-300 text-xl font-arcade">
              <Coins className="w-6 h-6 text-yellow-400" />
              <span>+{coinsEarned}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              Monedas Calientes
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/80 border-2 border-cyan-400/40 flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-cyan-300 text-xl font-arcade">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              <span>+{xpEarned} EXP</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
              {didLevelUp ? '¡SUBISTE DE NIVEL!' : `Nivel ${userLevel}`}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 mt-4">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 active:scale-95 text-slate-950 font-arcade text-base rounded-2xl shadow-xl shadow-orange-500/40 border-2 border-yellow-200 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>¡OTRA PARTIDA FRENÉTICA!</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onOpenShop}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-yellow-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              🛍️ Ir a la Tienda
            </button>
            <button
              onClick={onOpenLeaderboard}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              🏆 Clasificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

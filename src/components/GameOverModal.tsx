import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Coins, RotateCcw, Flame, Skull, Crown, ArrowRight } from 'lucide-react';
import { Player } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface GameOverModalProps {
  isOpen: boolean;
  winner: Player | null;
  userEliminatedRank: number | null;
  isUserWinner: boolean;
  coinsEarned: number;
  trophiesEarned: number;
  onPlayAgain: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  userEliminatedRank,
  isUserWinner,
  coinsEarned,
  trophiesEarned,
  onPlayAgain,
  onOpenShop,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    if (isOpen && isUserWinner) {
      soundEngine.playVictoryFanfare();
      // Confetti firework sequence
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
          });
        }, 350);
      } catch {
        // Fallback
      }
    }
  }, [isOpen, isUserWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-amber-500/50 rounded-3xl shadow-2xl shadow-orange-950/60 overflow-hidden text-center p-6 flex flex-col items-center">
        {/* Glowing badge */}
        <div className="relative mb-3">
          <div
            className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border-4 ${
              isUserWinner
                ? 'border-yellow-400 bg-yellow-950/60 ring-8 ring-yellow-400/30'
                : 'border-red-500 bg-red-950/60 ring-8 ring-red-500/30'
            }`}
          >
            {isUserWinner ? '👑' : '💥'}
          </div>
          {isUserWinner && (
            <div className="absolute -top-3 -right-2 bg-yellow-400 text-slate-950 rounded-full p-1 shadow-lg animate-bounce">
              <Crown className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-arcade tracking-wider text-white">
          {isUserWinner ? '¡VICTORIA CAMPAL!' : '¡EXPLOTASTE!'}
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isUserWinner
            ? '¡Fuiste el único superviviente de los 10 jugadores!'
            : `Quedaste en la posición #${userEliminatedRank || 2} de 10 jugadores`}
        </p>

        {/* Winner Tag if not user */}
        {!isUserWinner && winner && (
          <div className="mt-3 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Ganador final:</span>
            <span className="text-yellow-400 font-bold">{winner.avatar} {winner.name}</span>
          </div>
        )}

        {/* Rewards Breakdown Box */}
        <div className="w-full grid grid-cols-2 gap-3 my-5">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-yellow-400 text-lg font-arcade">
              <Coins className="w-5 h-5" />
              <span>+{coinsEarned}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-0.5">Monedas Ganadas</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-400 text-lg font-arcade">
              <Trophy className="w-5 h-5" />
              <span>{trophiesEarned >= 0 ? `+${trophiesEarned}` : trophiesEarned}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-bold mt-0.5">Copas de Rango</div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-2">
          <button
            onClick={onPlayAgain}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 active:scale-95 text-slate-950 font-arcade text-base rounded-2xl shadow-xl shadow-orange-500/30 border border-yellow-300 transition-all cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>JUGAR OTRA PARTIDA</span>
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
              🏆 Ver Clasificación
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

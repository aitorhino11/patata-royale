import React, { useEffect, useState } from 'react';
import {
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  Coins,
  Flame,
  Zap,
  ArrowLeftRight,
  Shield,
  Radio,
  ShoppingBag,
  Award,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { BotDifficulty, GameMode, MatchStats, Player } from '../types/game';
import { getRequiredXpForLevel } from '../services/storage';

interface GameHUDProps {
  stats: MatchStats;
  players: Player[];
  mode: GameMode;
  botDifficulty: BotDifficulty;
  coins: number;
  level: number;
  currentXp: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings: () => void;
  onOpenShop: () => void;
  onOpenBattlePass: () => void;
  onOpenAccount: () => void;
  onPassPotato: () => void;
  onPassDirection: (dir: 'left' | 'right') => void;
  canUserPass: boolean;
  passKey: string;
  isSuddenAcceleration: boolean;
  onLeaveMatch?: () => void;
  isGameActive?: boolean;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  players,
  mode,
  botDifficulty,
  coins,
  level,
  currentXp,
  isMuted,
  onToggleMute,
  onOpenSettings,
  onOpenShop,
  onOpenBattlePass,
  onOpenAccount,
  onPassPotato,
  onPassDirection,
  canUserPass,
  passKey,
  isSuddenAcceleration,
  onLeaveMatch,
  isGameActive = false,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const reqXp = getRequiredXpForLevel(level);
  const xpPercent = Math.min(100, Math.round((currentXp / reqXp) * 100));

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = !!(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement?: Element }).webkitFullscreenElement
      );
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const doc = document as unknown as {
        fullscreenElement?: Element;
        webkitFullscreenElement?: Element;
        exitFullscreen?: () => Promise<void>;
        webkitExitFullscreen?: () => void;
      };
      const docEl = document.documentElement as unknown as {
        requestFullscreen?: () => Promise<void>;
        webkitRequestFullscreen?: () => void;
      };

      if (!doc.fullscreenElement && !doc.webkitFullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          docEl.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not permitted or cancelled in iframe
    }
  };

  return (
    <header className="w-full flex flex-col gap-1.5 mb-1.5 select-none z-30">
      {/* Top Navigation & Status Bar */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl">
        {/* Left: App Logo & Mode Tag */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-orange-600/20 border border-orange-500/40 text-orange-400 font-arcade text-xs">
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-bounce" />
            <span className="hidden md:inline">PATATA ROYALE</span>
          </div>

          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-[10px] sm:text-[11px] font-bold text-slate-300">
            {mode === 'offline' ? (
              <Shield className="w-3 h-3 text-cyan-400" />
            ) : (
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            )}
            <span className="capitalize">{mode}</span>
          </div>
        </div>

        {/* Center: Level & Coins (No Trophies!) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level Badge with mini XP bar */}
          <button
            onClick={onOpenBattlePass}
            title="Pase de Batalla y Misiones"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all cursor-pointer"
          >
            <span className="font-arcade text-xs text-yellow-300">Nv.{level}</span>
            <div className="w-10 sm:w-14 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-yellow-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </button>

          {/* Hot Coins */}
          <button
            onClick={onOpenShop}
            title="Tienda de Cosméticos"
            className="flex items-center gap-1 px-2 py-1 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-xl transition-all cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs font-black text-yellow-200">{coins}</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Battle Pass */}
          <button
            onClick={onOpenBattlePass}
            title="Pase de Batalla y Misiones"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Award className="w-4 h-4 text-amber-400" />
          </button>

          {/* Shop */}
          <button
            onClick={onOpenShop}
            title="Tienda de Cosméticos"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-yellow-400 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Account */}
          <button
            onClick={onOpenAccount}
            title="Crear Cuenta / Iniciar Sesión"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Mute */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Activar Sonido' : 'Silenciar'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize className="w-4 h-4 text-cyan-400" />
            ) : (
              <Maximize className="w-4 h-4" />
            )}
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            title="Ajustes del Juego"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Leave Match button (when in battle) */}
          {isGameActive && onLeaveMatch && (
            <button
              onClick={onLeaveMatch}
              title="Salirse de la partida"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600/30 hover:bg-red-600 border border-red-500/50 text-red-200 hover:text-white text-xs font-bold transition-all cursor-pointer shadow ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>

      {/* Frantic Tension Sub-banner: Pure tension, BPM without fuse timer bar */}
      {isGameActive && (
        <div className="flex items-center justify-between gap-2 px-3 py-1 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-arcade text-amber-400">
              RONDA {stats.roundNumber}
            </span>
            <span className="text-slate-500">|</span>
            <span className="font-bold text-slate-300">
              {stats.aliveCount}/10 Vivos
            </span>
          </div>

          {/* Sudden Acceleration Alert */}
          {isSuddenAcceleration && (
            <div className="flex items-center gap-1.5 bg-red-600/90 text-white font-black px-2.5 py-0.5 rounded-full text-[10px] animate-bounce shadow-lg shadow-red-600/40">
              <Zap className="w-3 h-3 text-yellow-300 animate-spin" />
              <span>¡RITMO SÚBITO!</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400">Pip:</span>
            <span
              className={`font-mono font-black ${
                stats.accelerationBpm > 200
                  ? 'text-red-400 animate-pulse'
                  : stats.accelerationBpm > 140
                  ? 'text-orange-400'
                  : 'text-yellow-400'
              }`}
            >
              {stats.accelerationBpm} BPM
            </span>
          </div>
        </div>
      )}

      {/* Big Touch-Friendly Action Pass Button for Mobile & Desktop */}
      {canUserPass && (
        <div className="flex items-center justify-center gap-2 mt-1 animate-pulse">
          <button
            onClick={() => onPassDirection('left')}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold rounded-xl border border-slate-700 text-slate-200 transition-all cursor-pointer shadow-lg"
          >
            <ArrowLeftRight className="w-4 h-4 rotate-180" />
            <span className="hidden sm:inline">Izq</span>
          </button>

          <button
            onClick={onPassPotato}
            className="flex-1 max-w-sm flex items-center justify-center gap-2 py-3.5 px-6 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 hover:from-red-500 hover:to-orange-400 active:scale-95 text-white font-arcade text-base sm:text-lg rounded-2xl shadow-xl shadow-red-600/50 border-2 border-yellow-300 transition-all cursor-pointer touch-manipulation"
          >
            <Flame className="w-5 h-5 text-yellow-300 animate-bounce" />
            <span>¡PASAR PATATA!</span>
          </button>

          <button
            onClick={() => onPassDirection('right')}
            className="flex items-center gap-1 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-xs font-bold rounded-xl border border-slate-700 text-slate-200 transition-all cursor-pointer shadow-lg"
          >
            <span className="hidden sm:inline">Der</span>
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </header>
  );
};

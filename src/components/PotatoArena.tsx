import React, { useMemo } from 'react';
import { Player, PotatoPanicStage, CosmeticItem, PotatoSkin } from '../types/game';
import { ToyStoryPotato } from './ToyStoryPotato';
import { BombCharacter } from './BombCharacter';
import { ExplosionVfx } from './ExplosionVfx';
import { PassSpamBar } from './PassSpamBar';
import { ParticleVfx } from './ParticleVfx';
import { Flame } from 'lucide-react';

interface PotatoArenaProps {
  players: Player[];
  currentHolderIndex: number;
  targetHolderIndex: number | null;
  potatoProgress: number;
  isFlying: boolean;
  panicProgress: number;
  stage: PotatoPanicStage;
  skin: PotatoSkin;
  trailCosmetic: CosmeticItem | null;
  onPassToPlayer: (playerIndex: number) => void;
  canUserPass: boolean;
  screenShake: 'off' | 'subtle' | 'extreme';
  isExploding: boolean;
  explodedPlayerIndex: number | null;
  explosionId: string;
  passCharge: number;
  onTapPass: () => void;
  passKey: string;
  particlesEnabled: boolean;
}

export const PotatoArena: React.FC<PotatoArenaProps> = ({
  players,
  currentHolderIndex,
  targetHolderIndex,
  potatoProgress,
  isFlying,
  panicProgress,
  stage,
  skin,
  trailCosmetic,
  onPassToPlayer,
  canUserPass,
  screenShake,
  isExploding,
  explodedPlayerIndex,
  explosionId,
  passCharge,
  onTapPass,
  passKey,
  particlesEnabled,
}) => {
  // Precompute 10 positions around the circular stadium table
  // Index 0 (User) is at the bottom (90 degrees)
  const seatPositions = useMemo(() => {
    const total = 10;
    return Array.from({ length: total }).map((_, i) => {
      const angle = Math.PI / 2 + (i * 2 * Math.PI) / total;
      const cx = 50;
      const cy = 50;
      const rx = 39;
      const ry = 35;
      const x = cx + rx * Math.cos(angle);
      const y = cy + ry * Math.sin(angle);
      return { x, y, angle };
    });
  }, []);

  const potatoPos = useMemo(() => {
    const holder = seatPositions[currentHolderIndex] || { x: 50, y: 84 };
    if (!isFlying || targetHolderIndex === null) {
      return { x: holder.x, y: holder.y - 7 };
    }
    const target = seatPositions[targetHolderIndex] || { x: 50, y: 50 };
    const t = potatoProgress;
    const arc = Math.sin(t * Math.PI) * 18;
    const x = (1 - t) * holder.x + t * target.x;
    const y = (1 - t) * (holder.y - 7) + t * (target.y - 7) - arc;
    return { x, y };
  }, [currentHolderIndex, targetHolderIndex, isFlying, potatoProgress, seatPositions]);

  const currentHolder = players[currentHolderIndex];
  const isUserHolding = currentHolder && currentHolder.isUser && !isFlying;

  const getShakeClass = () => {
    if (screenShake === 'off') return '';
    if (isExploding) return 'animate-shake-intense';
    if (panicProgress > 0.8 && screenShake === 'extreme') return 'animate-shake-intense';
    if (panicProgress > 0.6) return 'animate-pulse';
    return '';
  };

  return (
    <div
      onClick={isUserHolding ? onTapPass : undefined}
      className={`relative w-full max-w-4xl aspect-[1.15/1] sm:aspect-[1.3/1] md:aspect-[1.42/1] mx-auto select-none overflow-hidden rounded-3xl border-2 border-orange-600/50 bg-gradient-to-b from-slate-950 via-slate-900 to-amber-950/50 shadow-2xl transition-all ${getShakeClass()} ${
        isUserHolding ? 'cursor-pointer' : ''
      }`}
    >
      {/* Ambient Floating Embers / Sparks (Settings controllable) */}
      <ParticleVfx enabled={particlesEnabled} intensity="epic" />

      {/* Intense dynamic heat vignette when holding or close to exploding */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-10"
        style={{
          boxShadow: isUserHolding
            ? 'inset 0 0 100px rgba(239, 68, 68, 0.85), inset 0 0 180px rgba(249, 115, 22, 0.55)'
            : panicProgress > 0.7
            ? `inset 0 0 ${panicProgress * 100}px rgba(239, 68, 68, ${panicProgress * 0.7})`
            : 'inset 0 0 50px rgba(0, 0, 0, 0.8)',
        }}
      />

      {/* Arena Center Floor: Round Wooden Battle Table & Lava Chasm */}
      <div className="absolute inset-8 sm:inset-12 md:inset-16 rounded-full border-2 border-amber-500/30 bg-radial from-amber-950/30 via-slate-900/80 to-slate-950 pointer-events-none flex items-center justify-center shadow-inner">
        <div
          className="w-48 h-48 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-orange-500/40 animate-spin"
          style={{ animationDuration: `${Math.max(2, 12 - panicProgress * 10)}s` }}
        />
        <div className="absolute w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-orange-500/10 blur-xl pointer-events-none" />

        {/* Center Stage Warning without countdown bar */}
        <div className="absolute flex flex-col items-center justify-center text-center px-4">
          <div className="flex items-center gap-1.5 text-xs font-arcade tracking-widest text-amber-400">
            <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
            <span>MESA DE BATALLA</span>
          </div>

          <div className="text-lg sm:text-xl md:text-2xl font-arcade tracking-wider text-white drop-shadow-md">
            {isFlying ? (
              <span className="text-yellow-300 animate-pulse">¡EN EL AIRE!</span>
            ) : currentHolder?.isUser ? (
              <span className="text-red-400 animate-bounce">¡PÁSALA YA!</span>
            ) : (
              <span className="text-slate-200">{currentHolder?.name || ''}</span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-orange-300/80">
            <span>Escucha el pip-pip</span>
            <span className="animate-ping text-red-400">🔊</span>
          </div>
        </div>
      </div>

      {/* Trajectory projectile line when flying */}
      {isFlying && targetHolderIndex !== null && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
          <defs>
            <linearGradient id="throwGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={trailCosmetic?.previewColor || '#f97316'} stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path
            d={`M ${seatPositions[currentHolderIndex].x}% ${seatPositions[currentHolderIndex].y}% Q ${
              (seatPositions[currentHolderIndex].x + seatPositions[targetHolderIndex].x) / 2
            }% ${
              Math.min(seatPositions[currentHolderIndex].y, seatPositions[targetHolderIndex].y) - 18
            }% ${seatPositions[targetHolderIndex].x}% ${seatPositions[targetHolderIndex].y}%`}
            fill="none"
            stroke="url(#throwGradient)"
            strokeWidth="4"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Render 10 Minibomb Players seated on their 3D Chairs */}
      {players.map((player, idx) => {
        const pos = seatPositions[idx];
        const isHolder = idx === currentHolderIndex && !isFlying;
        const isTarget = idx === targetHolderIndex && isFlying;
        const isExplodedHere = isExploding && idx === explodedPlayerIndex;

        return (
          <div
            key={player.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-20"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
            }}
          >
            {/* Speech Bubble */}
            {player.speechText && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-slate-950 text-xs font-black px-2.5 py-1 rounded-xl shadow-2xl border-2 border-slate-900 whitespace-nowrap animate-bounce z-40">
                {player.speechText}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-white" />
              </div>
            )}

            {/* Glowing spotlight under chair if holder */}
            {isHolder && (
              <div
                className="absolute -inset-6 rounded-full animate-ping pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(239, 68, 68, 0.9) 0%, transparent 70%)',
                  opacity: 0.8,
                }}
              />
            )}

            {/* Minibomb sitting on chair */}
            <BombCharacter
              player={player}
              isHolder={isHolder}
              isTarget={isTarget}
              isUser={player.isUser}
              panicProgress={panicProgress}
              canUserPass={canUserPass}
              onPassToPlayer={() => onPassToPlayer(idx)}
              index={idx}
            />

            {/* Custom Ultra-Detailed Equipped Explosion VFX */}
            {isExplodedHere && (
              <ExplosionVfx explosionId={explosionId} size={230} />
            )}
          </div>
        );
      })}

      {/* The Compact Toy Story Mr Potato Flying or in Holder's hands */}
      {!isExploding && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 transition-all duration-75"
          style={{
            left: `${potatoPos.x}%`,
            top: `${potatoPos.y}%`,
          }}
        >
          <ToyStoryPotato
            panicProgress={panicProgress}
            stage={stage}
            isFlying={isFlying}
            scale={isUserHolding ? 1.2 : 0.95}
          />
        </div>
      )}

      {/* Dopaminic Rapid-Tap Pass Spam Bar (replaces single-click pass!) */}
      {isUserHolding && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-full z-40">
          <PassSpamBar charge={passCharge} onTap={onTapPass} passKey={passKey} />
        </div>
      )}
    </div>
  );
};

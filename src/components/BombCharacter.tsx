import React from 'react';
import { Player } from '../types/game';
import { BOMB_SKINS, BOMB_ACCESSORIES } from '../services/storage';

interface BombCharacterProps {
  player: Player;
  isHolder: boolean;
  isTarget: boolean;
  isUser: boolean;
  panicProgress: number;
  canUserPass: boolean;
  onPassToPlayer?: () => void;
  index: number;
}

export const BombCharacter: React.FC<BombCharacterProps> = ({
  player,
  isHolder,
  isTarget,
  isUser,
  panicProgress,
  canUserPass,
  onPassToPlayer,
  index,
}) => {
  // Retrieve equipped skin and hat from player or fallback
  const skin =
    BOMB_SKINS.find((s) => s.id === player.bombSkinId) ||
    BOMB_SKINS[index % BOMB_SKINS.length] ||
    BOMB_SKINS[0];

  const hat =
    BOMB_ACCESSORIES.find((h) => h.id === player.bombHatId) ||
    BOMB_ACCESSORIES[index % BOMB_ACCESSORIES.length] ||
    BOMB_ACCESSORIES[0];

  const isDead = !player.isAlive;
  const isPanicking = isHolder && panicProgress > 0.45;
  const isExtremePanic = isHolder && panicProgress > 0.75;

  return (
    <div className="relative flex flex-col items-center select-none group">
      {/* Target touch button for mobile & desktop */}
      {canUserPass && !isDead && !isUser && (
        <button
          onClick={onPassToPlayer}
          title={`Pasar patata a ${player.name}`}
          className="absolute -inset-3 z-40 rounded-full border-2 border-yellow-400 bg-yellow-400/30 hover:bg-yellow-400/60 active:scale-95 transition-all cursor-pointer flex items-center justify-center animate-pulse"
        >
          <span className="opacity-0 group-hover:opacity-100 bg-yellow-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded shadow absolute -top-6 whitespace-nowrap">
            ¡PÁSALE!
          </span>
        </button>
      )}

      {/* SVG Container for the Chair + Minibomb */}
      <div
        className={`relative w-20 h-24 sm:w-22 sm:h-26 md:w-24 md:h-28 transition-transform duration-100 ${
          isExtremePanic
            ? 'animate-potato-stress scale-110'
            : isHolder
            ? 'animate-bounce scale-105'
            : isDead
            ? 'opacity-40 grayscale scale-90'
            : 'hover:scale-105'
        }`}
      >
        <svg viewBox="0 0 100 120" className="w-full h-full overflow-visible drop-shadow-xl">
          <defs>
            {/* Wooden Chair Gradients */}
            <linearGradient id={`chairWood_${player.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDead ? '#334155' : '#854d0e'} />
              <stop offset="50%" stopColor={isDead ? '#1e293b' : '#713f12'} />
              <stop offset="100%" stopColor={isDead ? '#0f172a' : '#451a03'} />
            </linearGradient>

            {/* Cushion Gradient */}
            <linearGradient id={`cushion_${player.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isDead ? '#475569' : isUser ? '#0284c7' : '#991b1b'} />
              <stop offset="100%" stopColor={isDead ? '#1e293b' : isUser ? '#075985' : '#450a0a'} />
            </linearGradient>

            {/* Bomb 3D Radial Sphere Gradient (Dynamically uses equipped skin colors!) */}
            <radialGradient id={`bombBody_${player.id}`} cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor={isDead ? '#475569' : isExtremePanic ? '#ef4444' : skin.bodyGrad[0]} />
              <stop offset="45%" stopColor={isDead ? '#334155' : isExtremePanic ? '#dc2626' : skin.bodyGrad[1]} />
              <stop offset="85%" stopColor={isDead ? '#1e293b' : isExtremePanic ? '#991b1b' : skin.bodyGrad[2]} />
              <stop offset="100%" stopColor={isDead ? '#0f172a' : skin.bodyGrad[3]} />
            </radialGradient>
          </defs>

          {/* --- THE DETAILED 3D WOODEN CHAIR --- */}
          <g>
            <ellipse cx="50" cy="115" rx="34" ry="7" fill="#000000" opacity="0.45" />

            {/* Chair Spindles */}
            <rect x="24" y="24" width="5" height="52" rx="2" fill={`url(#chairWood_${player.id})`} stroke="#1c1917" strokeWidth="0.8" />
            <rect x="36" y="22" width="5" height="54" rx="2" fill={`url(#chairWood_${player.id})`} stroke="#1c1917" strokeWidth="0.8" />
            <rect x="48" y="20" width="5" height="56" rx="2" fill={`url(#chairWood_${player.id})`} stroke="#1c1917" strokeWidth="0.8" />
            <rect x="60" y="22" width="5" height="54" rx="2" fill={`url(#chairWood_${player.id})`} stroke="#1c1917" strokeWidth="0.8" />
            <rect x="72" y="24" width="5" height="52" rx="2" fill={`url(#chairWood_${player.id})`} stroke="#1c1917" strokeWidth="0.8" />

            {/* Top Chair Arch */}
            <path
              d="M 20 30 C 35 15, 65 15, 80 30 C 76 34, 60 22, 24 34 Z"
              fill={`url(#chairWood_${player.id})`}
              stroke="#1c1917"
              strokeWidth="1.2"
            />

            {/* Armrests */}
            <path d="M 16 64 C 18 56, 26 56, 30 62" stroke="#713f12" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 84 64 C 82 56, 74 56, 70 62" stroke="#713f12" strokeWidth="3.5" strokeLinecap="round" fill="none" />

            {/* Legs */}
            <line x1="26" y1="84" x2="22" y2="114" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="74" y1="84" x2="78" y2="114" stroke="#451a03" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="30" y1="86" x2="28" y2="115" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" />
            <line x1="70" y1="86" x2="72" y2="115" stroke="#713f12" strokeWidth="4.5" strokeLinecap="round" />

            {/* Padded Cushion */}
            <ellipse cx="50" cy="82" rx="30" ry="10" fill={`url(#cushion_${player.id})`} stroke="#1c1917" strokeWidth="1.5" />
          </g>

          {/* --- THE DETAILED MINIBOMB --- */}
          <g transform="translate(0, 5)">
            {/* Little Bomb Boots */}
            <ellipse cx="40" cy="85" rx="5.5" ry="4" fill="#0f172a" stroke="#020617" strokeWidth="1" />
            <ellipse cx="60" cy="85" rx="5.5" ry="4" fill="#0f172a" stroke="#020617" strokeWidth="1" />

            {/* Fuse Metallic Cap */}
            <rect x="45" y="30" width="10" height="5" rx="1.5" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />

            {/* Fuse String with Burning Spark */}
            <path d="M 50 30 Q 56 18 64 20" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            {!isDead && (
              <g>
                <circle cx="64" cy="20" r={isHolder ? 5 : 3.5} fill="#facc15" className="animate-ping" />
                <circle cx="64" cy="20" r="2" fill="#ffffff" />
              </g>
            )}

            {/* Main Spherical Bomb Body */}
            <circle
              cx="50"
              cy="58"
              r="24"
              fill={`url(#bombBody_${player.id})`}
              stroke={isHolder ? '#ef4444' : skin.accent || '#0f172a'}
              strokeWidth={isHolder ? '2.5' : '1.8'}
            />

            {/* Specular Highlight */}
            <ellipse cx="42" cy="46" rx="9" ry="5.5" fill="#ffffff" opacity={isDead ? 0.1 : 0.35} transform="rotate(-30 42 46)" />

            {/* --- EQUIPPED ACCESSORIES (HATS, MASKS, ITEMS) --- */}
            {/* Crown */}
            {hat.renderKey === 'crown' && (
              <g transform="translate(34, 25)">
                <path d="M 2 12 L 6 2 L 16 7 L 26 2 L 30 12 Z" fill="#facc15" stroke="#a16207" strokeWidth="1.5" />
                <circle cx="6" cy="2" r="1.5" fill="#ef4444" />
                <circle cx="16" cy="7" r="1.5" fill="#3b82f6" />
                <circle cx="26" cy="2" r="1.5" fill="#22c55e" />
              </g>
            )}

            {/* Cowboy */}
            {hat.renderKey === 'cowboy' && (
              <g transform="translate(24, 22)">
                <ellipse cx="26" cy="12" rx="22" ry="5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <path d="M 14 11 C 14 2, 38 2, 38 11 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
              </g>
            )}

            {/* Headphones */}
            {hat.renderKey === 'headphones' && (
              <g>
                <path d="M 24 58 C 24 36, 76 36, 76 58" fill="none" stroke="#22d3ee" strokeWidth="3" />
                <rect x="22" y="50" width="6" height="15" rx="3" fill="#06b6d4" stroke="#083344" strokeWidth="1" />
                <rect x="72" y="50" width="6" height="15" rx="3" fill="#06b6d4" stroke="#083344" strokeWidth="1" />
              </g>
            )}

            {/* Mohawk */}
            {hat.renderKey === 'mohawk' && (
              <g transform="translate(42, 20)">
                <path d="M 4 14 L 8 0 L 12 14 Z" fill="#ef4444" />
                <path d="M 10 14 L 14 2 L 18 14 Z" fill="#f97316" />
              </g>
            )}

            {/* Pirate */}
            {hat.renderKey === 'pirate' && (
              <g>
                <path d="M 26 44 C 36 34, 64 34, 74 44 Z" fill="#dc2626" />
                <ellipse cx="43" cy="56" rx="5.5" ry="5.5" fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
                <line x1="30" y1="52" x2="56" y2="60" stroke="#0f172a" strokeWidth="1.2" />
              </g>
            )}

            {/* Cap */}
            {hat.renderKey === 'cap' && (
              <g transform="translate(30, 26)">
                <path d="M 5 12 C 5 2, 35 2, 35 12 Z" fill="#38bdf8" />
                <ellipse cx="42" cy="12" rx="7" ry="2.5" fill="#0284c7" />
              </g>
            )}

            {/* Sunglasses */}
            {hat.renderKey === 'sunglasses' && (
              <g transform="translate(32, 50)">
                <rect x="2" y="2" width="14" height="9" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
                <rect x="20" y="2" width="14" height="9" rx="2" fill="#020617" stroke="#334155" strokeWidth="1" />
                <line x1="16" y1="5" x2="20" y2="5" stroke="#020617" strokeWidth="1.5" />
              </g>
            )}

            {/* Ribbon */}
            {hat.renderKey === 'ribbon' && (
              <g transform="translate(56, 28)">
                <path d="M 0 6 L 8 0 L 8 12 Z" fill="#f43f5e" />
                <path d="M 16 6 L 8 0 L 8 12 Z" fill="#f43f5e" />
                <circle cx="8" cy="6" r="2.5" fill="#fbbf24" />
              </g>
            )}

            {/* Viking */}
            {hat.renderKey === 'viking' && (
              <g>
                <path d="M 30 38 Q 20 28 22 18 Q 28 26 32 34 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
                <path d="M 70 38 Q 80 28 78 18 Q 72 26 68 34 Z" fill="#e2e8f0" stroke="#475569" strokeWidth="1" />
              </g>
            )}

            {/* Beret */}
            {hat.renderKey === 'beret' && (
              <g>
                <ellipse cx="50" cy="34" rx="16" ry="6" fill="#1e293b" />
                <path d="M 44 68 Q 50 64 56 68" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
              </g>
            )}

            {/* Wizard */}
            {hat.renderKey === 'wizard' && (
              <g transform="translate(28, 14)">
                <ellipse cx="22" cy="22" rx="20" ry="4" fill="#312e81" />
                <polygon points="12,22 32,22 26,0" fill="#4338ca" stroke="#312e81" strokeWidth="1" />
                <circle cx="24" cy="8" r="1.5" fill="#facc15" />
              </g>
            )}

            {/* Tophat */}
            {hat.renderKey === 'tophat' && (
              <g transform="translate(30, 16)">
                <ellipse cx="20" cy="20" rx="18" ry="4" fill="#0f172a" />
                <rect x="10" y="2" width="20" height="18" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                <rect x="10" y="15" width="20" height="3" fill="#ca8a04" />
              </g>
            )}

            {/* Halo */}
            {hat.renderKey === 'halo' && (
              <ellipse cx="50" cy="24" rx="18" ry="5" fill="none" stroke="#facc15" strokeWidth="3" opacity="0.9" className="animate-pulse" />
            )}

            {/* Horns */}
            {hat.renderKey === 'horns' && (
              <g>
                <path d="M 32 38 Q 24 24 30 16 Q 36 26 38 36 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
                <path d="M 68 38 Q 76 24 70 16 Q 64 26 62 36 Z" fill="#dc2626" stroke="#7f1d1d" strokeWidth="1" />
              </g>
            )}

            {/* Astronaut */}
            {hat.renderKey === 'astronaut' && (
              <ellipse cx="50" cy="56" rx="20" ry="16" fill="#38bdf8" opacity="0.35" stroke="#ffffff" strokeWidth="2" />
            )}

            {/* Superhero Mask */}
            {hat.renderKey === 'superhero' && (
              <g transform="translate(30, 48)">
                <path d="M 2 8 C 8 0, 16 4, 20 8 C 24 4, 32 0, 38 8 C 30 14, 10 14, 2 8 Z" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
              </g>
            )}

            {/* Detective */}
            {hat.renderKey === 'detective' && (
              <g transform="translate(28, 22)">
                <ellipse cx="22" cy="14" rx="20" ry="5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                <path d="M 8 14 C 8 2, 36 2, 36 14 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
              </g>
            )}

            {/* Flower Wreath */}
            {hat.renderKey === 'flower' && (
              <g transform="translate(30, 30)">
                <circle cx="4" cy="6" r="3.5" fill="#f43f5e" />
                <circle cx="14" cy="2" r="3.5" fill="#facc15" />
                <circle cx="26" cy="2" r="3.5" fill="#38bdf8" />
                <circle cx="36" cy="6" r="3.5" fill="#ec4899" />
              </g>
            )}

            {/* Samurai */}
            {hat.renderKey === 'samurai' && (
              <g transform="translate(28, 18)">
                <polygon points="12,16 32,16 22,0" fill="#ca8a04" stroke="#854d0e" strokeWidth="1" />
                <ellipse cx="22" cy="16" rx="18" ry="4" fill="#0f172a" />
              </g>
            )}

            {/* Cyber Visor */}
            {hat.renderKey === 'visor' && (
              <g transform="translate(28, 52)">
                <rect x="0" y="0" width="44" height="10" rx="3" fill="#22d3ee" stroke="#0891b2" strokeWidth="1.5" opacity="0.85" />
                <line x1="4" y1="5" x2="40" y2="5" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            )}

            {/* Chef Toque */}
            {hat.renderKey === 'chef' && (
              <g transform="translate(32, 14)">
                <rect x="6" y="14" width="24" height="8" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="10" cy="10" r="7" fill="#ffffff" />
                <circle cx="18" cy="7" r="8" fill="#ffffff" />
                <circle cx="26" cy="10" r="7" fill="#ffffff" />
              </g>
            )}

            {/* Party Hat */}
            {hat.renderKey === 'party' && (
              <g transform="translate(36, 12)">
                <polygon points="4,22 24,22 14,0" fill="#f43f5e" stroke="#db2777" strokeWidth="1" />
                <circle cx="14" cy="0" r="3" fill="#facc15" />
              </g>
            )}

            {/* Cartoon Eyes */}
            {hat.renderKey !== 'sunglasses' && hat.renderKey !== 'visor' && (
              <g>
                {isDead ? (
                  <g stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="38" y1="52" x2="46" y2="60" />
                    <line x1="46" y1="52" x2="38" y2="60" />
                    <line x1="54" y1="52" x2="62" y2="60" />
                    <line x1="62" y1="52" x2="54" y2="60" />
                  </g>
                ) : (
                  <>
                    {hat.renderKey !== 'pirate' && (
                      <ellipse cx="42" cy="56" rx={isPanicking ? 6.5 : 5.5} ry={isPanicking ? 8 : 6.5} fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
                    )}
                    {hat.renderKey !== 'pirate' && (
                      <circle cx={isPanicking ? 42 : 43} cy={isPanicking ? 56 : 56} r={isExtremePanic ? 2 : 2.6} fill="#0f172a" />
                    )}

                    <ellipse cx="58" cy="56" rx={isPanicking ? 6.5 : 5.5} ry={isPanicking ? 8 : 6.5} fill="#ffffff" stroke="#0f172a" strokeWidth="1.2" />
                    <circle cx={isPanicking ? 58 : 57} cy={isPanicking ? 56 : 56} r={isExtremePanic ? 2 : 2.6} fill="#0f172a" />
                  </>
                )}
              </g>
            )}

            {/* Sweat Drops */}
            {isPanicking && !isDead && (
              <g>
                <circle cx="28" cy="46" r="2.5" fill="#38bdf8" className="animate-ping" />
                <circle cx="72" cy="48" r="2.5" fill="#38bdf8" className="animate-ping" />
              </g>
            )}

            {/* Little Hands on Armrests */}
            <ellipse cx="22" cy="62" rx="4.5" ry="3.5" fill="#0f172a" />
            <ellipse cx="78" cy="62" rx="4.5" ry="3.5" fill="#0f172a" />
          </g>
        </svg>
      </div>

      {/* Player Label: Level Badge & Name */}
      <div className="mt-0.5 flex flex-col items-center max-w-[85px] text-center">
        <div className="flex items-center gap-1">
          <span className="text-[9px] font-black px-1 rounded bg-amber-500/20 text-yellow-300 border border-yellow-500/40">
            Nv.{player.level || 1}
          </span>
          <span
            className={`text-[10px] md:text-[11px] font-black truncate max-w-[65px] ${
              isUser
                ? 'text-cyan-300 font-extrabold underline decoration-cyan-400'
                : isHolder
                ? 'text-yellow-300 font-extrabold'
                : 'text-slate-300'
            }`}
          >
            {isUser ? 'TÚ' : player.name}
          </span>
        </div>

        {/* State Badge */}
        {isDead ? (
          <span className="text-[9px] font-black text-red-500 uppercase">
            💥 #{player.eliminationRank || ''}
          </span>
        ) : isHolder ? (
          <span className="text-[9px] font-black text-amber-400 animate-pulse">
            ¡LA TIENE!
          </span>
        ) : null}
      </div>
    </div>
  );
};

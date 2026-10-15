import React from 'react';
import { PotatoPanicStage, PotatoSkin } from '../types/game';

interface ToyStoryPotatoProps {
  panicProgress: number; // 0 to 1
  stage: PotatoPanicStage;
  isFlying?: boolean;
  scale?: number;
}

export const ToyStoryPotato: React.FC<ToyStoryPotatoProps> = ({
  panicProgress,
  stage,
  isFlying = false,
  scale = 1,
}) => {
  const isExtremePanic = panicProgress > 0.78;
  const isHighPanic = panicProgress > 0.45;

  return (
    <div
      className={`relative inline-block select-none transition-transform duration-75 ${
        isExtremePanic
          ? 'animate-potato-stress'
          : isHighPanic
          ? 'animate-pulse'
          : ''
      }`}
      style={{
        transform: `scale(${scale * (isExtremePanic ? 1.15 : isHighPanic ? 1.08 : 1)}) rotate(${
          isFlying ? Math.sin(panicProgress * 20) * 15 : 0
        }deg)`,
        filter: isExtremePanic
          ? 'drop-shadow(0 0 16px rgba(239, 68, 68, 0.95)) drop-shadow(0 0 30px rgba(249, 115, 22, 0.9))'
          : isHighPanic
          ? 'drop-shadow(0 0 10px rgba(249, 115, 22, 0.8))'
          : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.6))',
      }}
    >
      {/* Fiery/Sparkling Aura when extreme */}
      {isExtremePanic && (
        <div className="absolute -inset-2.5 rounded-full bg-gradient-to-t from-red-600 via-orange-500 to-yellow-300 opacity-70 blur-md animate-fire-glow pointer-events-none" />
      )}

      {/* Mr Potato Toy Story SVG */}
      <svg
        viewBox="0 0 100 115"
        className="w-16 h-18 sm:w-18 sm:h-20 md:w-20 md:h-22 drop-shadow-2xl overflow-visible"
      >
        <defs>
          {/* Toy Story Potato Tuber Gradient */}
          <radialGradient id="spudBody" cx="38%" cy="30%" r="70%">
            <stop offset="0%" stopColor={isExtremePanic ? '#ef4444' : '#d97706'} />
            <stop offset="50%" stopColor={isExtremePanic ? '#b91c1c' : '#b45309'} />
            <stop offset="100%" stopColor={isExtremePanic ? '#7f1d1d' : '#78350f'} />
          </radialGradient>

          {/* Bowler Hat Gradient */}
          <linearGradient id="bowlerHat" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          {/* Nose 3D Gradient (Iconic big pink/magenta nose) */}
          <radialGradient id="spudNose" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="40%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#9f1239" />
          </radialGradient>

          {/* Ear Gradient */}
          <radialGradient id="spudEar" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="70%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#be185d" />
          </radialGradient>
        </defs>

        {/* Fuse & Sparks at the top (Bomb fuse attached to potato) */}
        <g>
          {/* Curved fuse rope */}
          <path
            d="M 50 18 Q 54 8 63 6"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Burning Spark */}
          <circle
            cx="63"
            cy="6"
            r={isExtremePanic ? '5' : '3.5'}
            fill="#facc15"
            className="animate-ping"
          />
          <circle cx="63" cy="6" r="2.5" fill="#ffffff" />
          <path
            d="M 63 6 L 68 2 M 63 6 L 65 11 M 63 6 L 58 3"
            stroke="#ef4444"
            strokeWidth="1.5"
          />
        </g>

        {/* Steam from ears when hot */}
        {isHighPanic && (
          <g className="animate-bounce opacity-85">
            <path
              d="M 12 45 Q 8 36 12 28 Q 16 20 12 14"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 88 45 Q 92 36 88 28 Q 84 20 88 14"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Left Ear */}
        <path
          d="M 18 52 C 10 48, 8 64, 18 68 Z"
          fill="url(#spudEar)"
          stroke="#9d174d"
          strokeWidth="1.2"
        />
        {/* Right Ear */}
        <path
          d="M 82 52 C 90 48, 92 64, 82 68 Z"
          fill="url(#spudEar)"
          stroke="#9d174d"
          strokeWidth="1.2"
        />

        {/* Main Potato Body (Organic Egg/Potato shape) */}
        <path
          d="M 34 22 C 60 16, 74 18, 82 36 C 90 56, 92 84, 80 100 C 68 114, 32 114, 20 100 C 8 84, 10 54, 18 36 C 24 24, 28 22, 34 22 Z"
          fill="url(#spudBody)"
          stroke="#451a03"
          strokeWidth="2.5"
        />

        {/* Potato Skin texture dimples */}
        <circle cx="28" cy="88" r="1.5" fill="#78350f" opacity="0.6" />
        <circle cx="72" cy="85" r="1.5" fill="#78350f" opacity="0.6" />
        <circle cx="68" cy="38" r="1.5" fill="#78350f" opacity="0.6" />

        {/* Iconic Bowler Hat (Sombrerito negro de Toy Story) */}
        <g transform="translate(0, -2)">
          {/* Hat Brim */}
          <ellipse cx="50" cy="22" rx="24" ry="5.5" fill="#0f172a" stroke="#020617" strokeWidth="1.2" />
          {/* Hat Ribbon */}
          <path d="M 36 21 C 36 17, 64 17, 64 21 Z" fill="#dc2626" />
          {/* Hat Crown */}
          <path
            d="M 37 20 C 37 8, 63 8, 63 20 Z"
            fill="url(#bowlerHat)"
            stroke="#020617"
            strokeWidth="1.2"
          />
        </g>

        {/* Expressive Toy Story Eyes (Plasticky round white balls with black pupils) */}
        <g>
          {/* Left Eye */}
          <ellipse
            cx="40"
            cy="40"
            rx={isExtremePanic ? 7.5 : 6.8}
            ry={isExtremePanic ? 9.5 : 7.8}
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <circle
            cx={isExtremePanic ? 40 : 41}
            cy={isExtremePanic ? 40 : 40}
            r={isExtremePanic ? 2.2 : 3}
            fill="#0f172a"
          />
          <circle cx="39" cy="38" r="1.2" fill="#ffffff" />

          {/* Right Eye */}
          <ellipse
            cx="60"
            cy="40"
            rx={isExtremePanic ? 7.5 : 6.8}
            ry={isExtremePanic ? 9.5 : 7.8}
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
          <circle
            cx={isExtremePanic ? 60 : 59}
            cy={isExtremePanic ? 40 : 40}
            r={isExtremePanic ? 2.2 : 3}
            fill="#0f172a"
          />
          <circle cx="58" cy="38" r="1.2" fill="#ffffff" />

          {/* Curved Eyebrows */}
          <path
            d={
              isExtremePanic
                ? 'M 32 30 L 46 34'
                : isHighPanic
                ? 'M 32 31 Q 40 33 46 34'
                : 'M 32 33 Q 40 28 46 33'
            }
            stroke="#0f172a"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
          <path
            d={
              isExtremePanic
                ? 'M 68 30 L 54 34'
                : isHighPanic
                ? 'M 68 31 Q 60 33 54 34'
                : 'M 68 33 Q 60 28 54 33'
            }
            stroke="#0f172a"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </g>

        {/* Iconic Big Pink Bulbous Nose (Toy Story) */}
        <ellipse
          cx="50"
          cy="52"
          rx="10"
          ry="12"
          fill="url(#spudNose)"
          stroke="#881337"
          strokeWidth="1.5"
          className={isExtremePanic ? 'animate-bounce' : ''}
        />
        {/* Nose 3D glint */}
        <ellipse cx="47" cy="48" rx="3.5" ry="4.5" fill="#ffffff" opacity="0.45" />

        {/* Iconic Curved Toy Story Mustache (Bigote negro pronunciado) */}
        <g
          className={isExtremePanic ? 'animate-potato-stress' : ''}
          style={{ transformOrigin: '50px 68px' }}
        >
          <path
            d="M 50 64 C 44 60, 30 60, 22 68 C 28 72, 38 68, 50 71 C 62 68, 72 72, 78 68 C 70 60, 56 60, 50 64 Z"
            fill="#0f172a"
            stroke="#020617"
            strokeWidth="1.2"
          />
        </g>

        {/* Mouth below mustache */}
        <g>
          {isExtremePanic ? (
            // Terrified screaming open mouth
            <ellipse
              cx="50"
              cy="80"
              rx="7"
              ry="9"
              fill="#7f1d1d"
              stroke="#0f172a"
              strokeWidth="2"
            />
          ) : isHighPanic ? (
            // Nervous wavy mouth
            <path
              d="M 43 78 Q 50 84 57 78"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ) : (
            // Classic cheeky toy grin
            <path
              d="M 44 76 Q 50 82 56 76"
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Blue Shoes/Feet at bottom */}
        <ellipse cx="36" cy="104" rx="10" ry="5.5" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
        <ellipse cx="64" cy="104" rx="10" ry="5.5" fill="#1e40af" stroke="#172554" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

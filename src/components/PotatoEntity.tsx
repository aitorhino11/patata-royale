import React from 'react';
import { PotatoPanicStage, PotatoSkin } from '../types/game';

interface PotatoEntityProps {
  skin: PotatoSkin;
  panicProgress: number; // 0 to 1
  stage: PotatoPanicStage;
  isFlying?: boolean;
  scale?: number;
}

export const PotatoEntity: React.FC<PotatoEntityProps> = ({
  skin,
  panicProgress,
  stage,
  isFlying = false,
  scale = 1,
}) => {
  // Determine facial expression and sweat based on panic
  const isExtremePanic = panicProgress > 0.75;
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
        transform: `scale(${scale * (isExtremePanic ? 1.15 : isHighPanic ? 1.08 : 1)})`,
        filter: isExtremePanic
          ? `drop-shadow(0 0 25px ${skin.colors.flame}) drop-shadow(0 0 45px rgba(239, 68, 68, 0.9))`
          : isHighPanic
          ? `drop-shadow(0 0 15px ${skin.colors.flame})`
          : `drop-shadow(0 0 8px ${skin.colors.glow})`,
      }}
    >
      {/* Dynamic fire aura when heating up */}
      {(isHighPanic || isExtremePanic) && (
        <div className="absolute -inset-4 pointer-events-none flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full opacity-70 blur-md ${
              isExtremePanic ? 'animate-fire-glow' : 'animate-ping'
            }`}
            style={{
              background: `radial-gradient(circle, ${skin.colors.flame} 0%, rgba(249, 115, 22, 0.4) 60%, transparent 80%)`,
            }}
          />
        </div>
      )}

      {/* SVG Spud Illustration */}
      <svg
        viewBox="0 0 120 140"
        className="w-24 h-28 md:w-28 md:h-32 drop-shadow-xl overflow-visible"
      >
        <defs>
          <radialGradient id={`potatoGrad_${skin.id}`} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor={isExtremePanic ? '#f87171' : skin.colors.primary} />
            <stop offset="80%" stopColor={isExtremePanic ? '#b91c1c' : skin.colors.secondary} />
            <stop offset="100%" stopColor={isExtremePanic ? '#7f1d1d' : skin.colors.secondary} />
          </radialGradient>

          {/* Golden shine filter */}
          {skin.id === 'golden' && (
            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.9" />
            </linearGradient>
          )}

          {/* Cyberpunk grid */}
          {skin.id === 'cyberpunk' && (
            <pattern id="cyberGrid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
          )}
        </defs>

        {/* Leaping Flames on top if hot */}
        {(stage === 'hot' || stage === 'critical') && (
          <g className="animate-bounce">
            <path
              d="M 45 25 Q 35 5 45 -12 Q 58 5 52 24 Z"
              fill={isExtremePanic ? '#ffffff' : '#fbbf24'}
              className="opacity-90"
            />
            <path
              d="M 55 24 Q 68 0 74 -18 Q 80 4 66 26 Z"
              fill={skin.colors.flame}
              className="opacity-95"
            />
            <path
              d="M 60 26 Q 52 8 58 -4 Q 68 8 64 26 Z"
              fill="#ef4444"
              className="opacity-90"
            />
          </g>
        )}

        {/* Flying Sweat drops */}
        {isHighPanic && !isFlying && (
          <g>
            <circle cx="20" cy="45" r="3.5" fill="#38bdf8" className="animate-ping opacity-80" />
            <circle cx="102" cy="50" r="3.5" fill="#38bdf8" className="animate-ping opacity-80" />
            <path
              d="M 18 35 Q 14 38 16 43 Q 19 45 22 42 Q 22 36 18 35 Z"
              fill="#60a5fa"
              className="opacity-90"
            />
          </g>
        )}

        {/* Main Potato Body (Organic Spud shape) */}
        <path
          d="M 38 18 C 65 10, 85 14, 98 32 C 114 55, 116 85, 104 110 C 92 135, 48 142, 28 126 C 8 110, 6 78, 14 50 C 20 28, 25 22, 38 18 Z"
          fill={`url(#potatoGrad_${skin.id})`}
          stroke={skin.colors.secondary}
          strokeWidth="3.5"
        />

        {/* Skin specific body textures */}
        {skin.id === 'golden' && (
          <>
            <path
              d="M 42 22 C 65 14, 82 18, 94 34 C 108 55, 110 82, 100 105 C 89 128, 50 135, 32 121 C 14 107, 12 78, 19 53 C 24 33, 29 26, 42 22 Z"
              fill="url(#goldShine)"
              opacity="0.4"
            />
            {/* Golden Crown */}
            <path
              d="M 42 12 L 48 0 L 58 8 L 68 -2 L 78 8 L 86 0 L 90 14 Z"
              fill="#fef08a"
              stroke="#ca8a04"
              strokeWidth="2"
            />
          </>
        )}

        {skin.id === 'cyberpunk' && (
          <>
            <path
              d="M 38 18 C 65 10, 85 14, 98 32 C 114 55, 116 85, 104 110 C 92 135, 48 142, 28 126 C 8 110, 6 78, 14 50 C 20 28, 25 22, 38 18 Z"
              fill="url(#cyberGrid)"
            />
            {/* Cyber Visor */}
            <rect
              x="25"
              y="52"
              width="70"
              height="18"
              rx="4"
              fill="#06b6d4"
              stroke="#67e8f9"
              strokeWidth="2"
              className="opacity-90"
            />
            <line x1="30" y1="61" x2="90" y2="61" stroke="#ec4899" strokeWidth="2" />
          </>
        )}

        {skin.id === 'magma' && (
          <g stroke="#ea580c" strokeWidth="3" strokeLinecap="round">
            <path d="M 28 65 Q 40 75 55 68 Q 70 78 88 72" />
            <path d="M 45 40 Q 52 50 48 60" />
            <path d="M 72 90 Q 60 102 75 115" />
          </g>
        )}

        {skin.id === 'toxic' && (
          <g fill="#bef264" opacity="0.8">
            <circle cx="35" cy="40" r="4" />
            <circle cx="85" cy="48" r="5" />
            <circle cx="48" cy="115" r="6" />
            <circle cx="90" cy="98" r="3" />
          </g>
        )}

        {skin.id === 'kawaii' && (
          <>
            {/* Blush */}
            <ellipse cx="32" cy="74" rx="7" ry="4" fill="#fb7185" opacity="0.8" />
            <ellipse cx="88" cy="74" rx="7" ry="4" fill="#fb7185" opacity="0.8" />
            {/* Bow on head */}
            <path
              d="M 36 22 Q 44 26 40 34 Q 44 26 48 30 Q 44 22 40 20 Z"
              fill="#f43f5e"
            />
          </>
        )}

        {/* Eyes (Panic state adapts eyes) */}
        {skin.id !== 'cyberpunk' && (
          <g>
            {/* Left Eye */}
            <ellipse
              cx="44"
              cy="58"
              rx={isExtremePanic ? 9 : 8}
              ry={isExtremePanic ? 11 : 8}
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Pupil */}
            <circle
              cx={isExtremePanic ? 44 : 45}
              cy={isExtremePanic ? 58 : 58}
              r={isExtremePanic ? 2.5 : 4}
              fill="#0f172a"
            />
            {/* Pupil Glint */}
            <circle cx="42" cy="55" r="1.5" fill="#ffffff" />

            {/* Right Eye */}
            <ellipse
              cx="76"
              cy="58"
              rx={isExtremePanic ? 9 : 8}
              ry={isExtremePanic ? 11 : 8}
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Pupil */}
            <circle
              cx={isExtremePanic ? 76 : 75}
              cy={isExtremePanic ? 58 : 58}
              r={isExtremePanic ? 2.5 : 4}
              fill="#0f172a"
            />
            {/* Pupil Glint */}
            <circle cx="74" cy="55" r="1.5" fill="#ffffff" />

            {/* Eyebrows angled according to stress */}
            <path
              d={
                isExtremePanic
                  ? 'M 35 44 L 52 48'
                  : isHighPanic
                  ? 'M 36 46 L 50 49'
                  : 'M 35 48 Q 44 44 52 48'
              }
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d={
                isExtremePanic
                  ? 'M 85 44 L 68 48'
                  : isHighPanic
                  ? 'M 84 46 L 70 49'
                  : 'M 85 48 Q 76 44 68 48'
              }
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>
        )}

        {/* Mouth Expression */}
        <g>
          {isExtremePanic ? (
            // Terrified screaming open mouth
            <path
              d="M 46 80 C 46 98, 74 98, 74 80 C 74 72, 46 72, 46 80 Z"
              fill="#7f1d1d"
              stroke="#0f172a"
              strokeWidth="3"
            >
              <animate
                attributeName="d"
                values="M 46 80 C 46 98, 74 98, 74 80 C 74 72, 46 72, 46 80 Z; M 48 78 C 48 102, 72 102, 72 78 C 72 74, 48 74, 48 78 Z; M 46 80 C 46 98, 74 98, 74 80 C 74 72, 46 72, 46 80 Z"
                dur="0.1s"
                repeatCount="indefinite"
              />
            </path>
          ) : isHighPanic ? (
            // Agitated wavy mouth
            <path
              d="M 46 82 Q 54 88 60 82 Q 68 76 74 82"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ) : (
            // Nervous smile
            <path
              d="M 48 82 Q 60 92 72 82"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* Glowing fuse or sparks */}
        {isExtremePanic && (
          <g>
            <circle cx="60" cy="10" r="8" fill="#fbbf24" className="animate-ping" />
            <circle cx="60" cy="10" r="4" fill="#ffffff" />
          </g>
        )}
      </svg>
    </div>
  );
};

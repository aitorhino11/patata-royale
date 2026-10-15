import React from 'react';
import { EXPLOSION_EFFECTS } from '../services/storage';

interface ExplosionVfxProps {
  explosionId: string;
  size?: number; // size in px
}

export const ExplosionVfx: React.FC<ExplosionVfxProps> = ({ explosionId, size = 200 }) => {
  const effect = EXPLOSION_EFFECTS.find((e) => e.id === explosionId) || EXPLOSION_EFFECTS[0];

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-50 flex items-center justify-center animate-shake-intense"
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible drop-shadow-2xl">
        <defs>
          {/* Radial shockwave gradient */}
          <radialGradient id={`expShock_${explosionId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={effect.previewColor} stopOpacity="0.85" />
            <stop offset="75%" stopColor={effect.previewColor} stopOpacity="0.3" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>

          {/* Atomic Mushroom Gradient */}
          <radialGradient id="nuclearGrad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#84cc16" />
            <stop offset="70%" stopColor="#15803d" />
            <stop offset="100%" stopColor="#052e16" />
          </radialGradient>

          {/* Supernova Cosmic Gradient */}
          <radialGradient id="supernovaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#f472b6" />
            <stop offset="60%" stopColor="#9333ea" />
            <stop offset="100%" stopColor="#1e1035" />
          </radialGradient>

          {/* Magma Gradient */}
          <radialGradient id="lavaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#f97316" />
            <stop offset="70%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#450a0a" />
          </radialGradient>

          {/* Ice Frost Gradient */}
          <radialGradient id="iceGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#bae6fd" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0c4a6e" />
          </radialGradient>

          {/* Divine Holy Gradient */}
          <radialGradient id="divineGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fef08a" />
            <stop offset="80%" stopColor="#eab308" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Global Expanding Shockwave Ring */}
        <circle
          cx="120"
          cy="120"
          r="95"
          fill={`url(#expShock_${explosionId})`}
          className="animate-ping opacity-75"
        />

        {/* 1. NUCLEAR ATOMIC MUSHROOM */}
        {explosionId === 'exp_nuclear' && (
          <g>
            <path d="M 105 200 Q 120 140 85 105 Q 120 100 120 200 Z" fill="url(#nuclearGrad)" />
            <path d="M 135 200 Q 120 140 155 105 Q 120 100 120 200 Z" fill="url(#nuclearGrad)" />
            <ellipse cx="120" cy="85" rx="75" ry="45" fill="url(#nuclearGrad)" stroke="#bef264" strokeWidth="2.5" />
            <ellipse cx="75" cy="90" rx="35" ry="25" fill="#84cc16" opacity="0.9" />
            <ellipse cx="165" cy="90" rx="35" ry="25" fill="#84cc16" opacity="0.9" />
            <ellipse cx="120" cy="60" rx="50" ry="30" fill="#fef08a" opacity="0.95" />
            <circle cx="120" cy="80" r="12" fill="#15803d" />
            <path d="M 110 80 L 95 60 L 115 60 Z" fill="#15803d" />
            <path d="M 130 80 L 145 60 L 125 60 Z" fill="#15803d" />
            <path d="M 120 90 L 120 110 L 110 102 Z" fill="#15803d" />
            <text x="120" y="85" fontSize="22" textAnchor="middle" fill="#facc15" fontWeight="bold">☢️</text>
          </g>
        )}

        {/* 2. CONFETTI PARTY BURST */}
        {explosionId === 'exp_confetti' && (
          <g>
            <circle cx="120" cy="120" r="55" fill="#fef08a" opacity="0.5" className="animate-ping" />
            <path d="M 120 120 Q 70 50 35 60" stroke="#f43f5e" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 120 120 Q 170 50 205 60" stroke="#06b6d4" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 120 120 Q 60 170 40 190" stroke="#eab308" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 120 120 Q 180 170 200 190" stroke="#a855f7" strokeWidth="6" fill="none" strokeLinecap="round" />
            <rect x="60" y="50" width="10" height="15" fill="#f43f5e" transform="rotate(25 60 50)" />
            <rect x="170" y="45" width="10" height="15" fill="#22c55e" transform="rotate(-35 170 45)" />
            <rect x="40" y="120" width="12" height="10" fill="#3b82f6" transform="rotate(45 40 120)" />
            <rect x="190" y="125" width="12" height="10" fill="#f97316" transform="rotate(-20 190 125)" />
            <rect x="85" y="180" width="10" height="15" fill="#eab308" transform="rotate(15 85 180)" />
            <rect x="155" y="180" width="10" height="15" fill="#ec4899" transform="rotate(-40 155 180)" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">🎉</text>
          </g>
        )}

        {/* 3. PLASMA ELECTROMAGNETIC BURST */}
        {explosionId === 'exp_plasma' && (
          <g>
            <circle cx="120" cy="120" r="65" fill="#3b82f6" opacity="0.6" className="animate-ping" />
            <circle cx="120" cy="120" r="40" fill="#60a5fa" opacity="0.9" />
            <circle cx="120" cy="120" r="18" fill="#ffffff" />
            <path d="M 120 120 L 80 45 L 60 50 L 35 20" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 160 45 L 180 50 L 205 20" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 60 145 L 35 170 L 25 205" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 180 145 L 205 170 L 215 205" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <text x="120" y="132" fontSize="42" textAnchor="middle">⚡</text>
          </g>
        )}

        {/* 4. SUPERNOVA COSMIC VORTEX */}
        {explosionId === 'exp_supernova' && (
          <g>
            <circle cx="120" cy="120" r="75" fill="url(#supernovaGrad)" className="animate-pulse" />
            <ellipse cx="120" cy="120" rx="110" ry="32" fill="none" stroke="#f472b6" strokeWidth="4" transform="rotate(30 120 120)" />
            <ellipse cx="120" cy="120" rx="110" ry="32" fill="none" stroke="#c084fc" strokeWidth="4" transform="rotate(-30 120 120)" />
            <circle cx="120" cy="120" r="22" fill="#ffffff" />
            <circle cx="55" cy="65" r="5" fill="#fef08a" />
            <circle cx="185" cy="55" r="5" fill="#fef08a" />
            <circle cx="60" cy="175" r="5" fill="#fef08a" />
            <circle cx="180" cy="185" r="5" fill="#fef08a" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">🌟</text>
          </g>
        )}

        {/* 5. BLACK HOLE SINGULARITY */}
        {explosionId === 'exp_blackhole' && (
          <g>
            <circle cx="120" cy="120" r="80" fill="#1e1b4b" opacity="0.8" className="animate-ping" />
            <ellipse cx="120" cy="120" rx="105" ry="38" fill="none" stroke="#f43f5e" strokeWidth="5" transform="rotate(20 120 120)" />
            <circle cx="120" cy="120" r="42" fill="#020617" stroke="#8b5cf6" strokeWidth="4" />
            <circle cx="120" cy="120" r="18" fill="#000000" />
            <path d="M 70 85 Q 120 115 120 120" stroke="#c084fc" strokeWidth="3" fill="none" />
            <path d="M 170 155 Q 120 125 120 120" stroke="#c084fc" strokeWidth="3" fill="none" />
            <text x="120" y="135" fontSize="44" textAnchor="middle">🕳️</text>
          </g>
        )}

        {/* 6. COINS PIÑATA */}
        {explosionId === 'exp_coins' && (
          <g>
            <circle cx="120" cy="120" r="55" fill="#facc15" opacity="0.6" className="animate-ping" />
            {[-50, -25, 0, 25, 50, -70, 70].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 120 120) translate(0, -75)`}>
                <circle cx="120" cy="120" r="11" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
                <text x="120" y="124" fontSize="11" fontWeight="black" textAnchor="middle" fill="#78350f">
                  $
                </text>
              </g>
            ))}
            <text x="120" y="135" fontSize="48" textAnchor="middle">💰</text>
          </g>
        )}

        {/* 7. VOLCANO LAVA ERUPTION */}
        {explosionId === 'exp_volcano' && (
          <g>
            <path d="M 85 200 Q 120 95 95 35 Q 120 70 120 200 Z" fill="#ea580c" />
            <path d="M 155 200 Q 120 95 145 35 Q 120 70 120 200 Z" fill="#ea580c" />
            <circle cx="120" cy="100" r="55" fill="#dc2626" opacity="0.8" className="animate-ping" />
            <circle cx="120" cy="65" r="20" fill="#facc15" />
            <circle cx="80" cy="45" r="9" fill="#451a03" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="160" cy="50" r="10" fill="#451a03" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="55" cy="100" r="8" fill="#451a03" stroke="#ea580c" strokeWidth="2.5" />
            <circle cx="185" cy="95" r="9" fill="#451a03" stroke="#ea580c" strokeWidth="2.5" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">🌋</text>
          </g>
        )}

        {/* 8. GLITCH MATRIX COLLAPSE */}
        {explosionId === 'exp_glitch' && (
          <g>
            <rect x="45" y="45" width="150" height="150" fill="#15803d" opacity="0.3" className="animate-pulse" />
            <rect x="60" y="70" width="50" height="24" fill="#22c55e" />
            <rect x="130" y="95" width="60" height="18" fill="#06b6d4" />
            <rect x="55" y="130" width="70" height="22" fill="#ef4444" />
            <rect x="145" y="150" width="45" height="26" fill="#facc15" />
            <text x="120" y="125" fill="#ffffff" fontFamily="monospace" fontWeight="900" fontSize="24" textAnchor="middle">
              ERROR 404
            </text>
            <text x="120" y="150" fill="#22c55e" fontFamily="monospace" fontWeight="bold" fontSize="14" textAnchor="middle">
              SYSTEM CRASH
            </text>
          </g>
        )}

        {/* 9. BIRTHDAY CAKE */}
        {explosionId === 'exp_birthday' && (
          <g>
            <circle cx="120" cy="120" r="60" fill="#f472b6" opacity="0.5" className="animate-ping" />
            <circle cx="70" cy="70" r="10" fill="#ffffff" stroke="#fb7185" strokeWidth="2.5" />
            <circle cx="170" cy="75" r="10" fill="#ffffff" stroke="#fb7185" strokeWidth="2.5" />
            <circle cx="80" cy="170" r="10" fill="#ffffff" stroke="#fb7185" strokeWidth="2.5" />
            <circle cx="160" cy="175" r="10" fill="#ffffff" stroke="#fb7185" strokeWidth="2.5" />
            <text x="120" y="140" fontSize="56" textAnchor="middle">🎂</text>
          </g>
        )}

        {/* 10. DIVINE HOLY RAY */}
        {explosionId === 'exp_divine' && (
          <g>
            <rect x="90" y="0" width="60" height="240" fill="url(#divineGrad)" opacity="0.75" className="animate-pulse" />
            <circle cx="120" cy="120" r="65" fill="#fef08a" opacity="0.8" className="animate-ping" />
            <circle cx="120" cy="120" r="30" fill="#ffffff" />
            <path d="M 50 85 Q 75 90 60 115" stroke="#ffffff" strokeWidth="4" fill="none" />
            <path d="M 190 85 Q 165 90 180 115" stroke="#ffffff" strokeWidth="4" fill="none" />
            <text x="120" y="135" fontSize="46" textAnchor="middle">🕊️</text>
          </g>
        )}

        {/* 11. BATS NIGHT SWARM */}
        {explosionId === 'exp_bats' && (
          <g>
            <circle cx="120" cy="120" r="60" fill="#334155" opacity="0.7" className="animate-ping" />
            <text x="80" y="70" fontSize="34">🦇</text>
            <text x="155" y="65" fontSize="38">🦇</text>
            <text x="60" y="145" fontSize="32">🦇</text>
            <text x="165" y="155" fontSize="36">🦇</text>
            <text x="120" y="135" fontSize="50" textAnchor="middle">💀</text>
          </g>
        )}

        {/* 12. FIREWORKS SPECTACLE */}
        {explosionId === 'exp_fireworks' && (
          <g>
            <circle cx="120" cy="120" r="65" fill="#f43f5e" opacity="0.5" className="animate-ping" />
            {/* Spark bursts */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 120 120)`}>
                <line x1="120" y1="120" x2="120" y2="40" stroke="#facc15" strokeWidth="3" strokeDasharray="6 3" />
                <circle cx="120" cy="35" r="4" fill="#38bdf8" />
              </g>
            ))}
            <text x="120" y="135" fontSize="52" textAnchor="middle">🎆</text>
          </g>
        )}

        {/* 13. TOXIC ACID GAS */}
        {explosionId === 'exp_toxic' && (
          <g>
            <circle cx="120" cy="120" r="70" fill="#84cc16" opacity="0.75" className="animate-ping" />
            <circle cx="85" cy="85" r="28" fill="#a3e635" opacity="0.8" />
            <circle cx="155" cy="85" r="32" fill="#65a30d" opacity="0.8" />
            <circle cx="120" cy="155" r="35" fill="#84cc16" opacity="0.85" />
            <text x="120" y="135" fontSize="52" textAnchor="middle">☣️</text>
          </g>
        )}

        {/* 14. SLIME CORROSIVE OOZE */}
        {explosionId === 'exp_slime' && (
          <g>
            <ellipse cx="120" cy="120" rx="75" ry="60" fill="#a3e635" opacity="0.85" className="animate-pulse" />
            <path d="M 75 140 Q 60 200 85 190 Q 95 150 95 140" fill="#65a30d" />
            <path d="M 145 140 Q 160 200 135 190 Q 125 150 125 140" fill="#65a30d" />
            <circle cx="95" cy="100" r="14" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
            <circle cx="95" cy="100" r="6" fill="#000000" />
            <circle cx="145" cy="100" r="14" fill="#ffffff" stroke="#15803d" strokeWidth="2" />
            <circle cx="145" cy="100" r="6" fill="#000000" />
            <text x="120" y="145" fontSize="48" textAnchor="middle">🟢</text>
          </g>
        )}

        {/* 15. ICE GLACIAL SHATTER */}
        {explosionId === 'exp_ice' && (
          <g>
            <circle cx="120" cy="120" r="70" fill="url(#iceGrad)" opacity="0.8" className="animate-ping" />
            {/* Ice Spikes */}
            <polygon points="120,30 130,100 110,100" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="210,120 140,130 140,110" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="120,210 110,140 130,140" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="30,120 100,110 100,130" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="2" />
            <polygon points="180,60 130,110 140,120" fill="#7dd3fc" />
            <polygon points="60,180 110,130 120,140" fill="#7dd3fc" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">🧊</text>
          </g>
        )}

        {/* 16. TESLA ELECTRIC STORM */}
        {explosionId === 'exp_electric' && (
          <g>
            <circle cx="120" cy="120" r="65" fill="#0ea5e9" opacity="0.6" className="animate-ping" />
            <path d="M 120 120 L 70 30 L 95 35 L 55 10" stroke="#facc15" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 170 30 L 145 35 L 185 10" stroke="#facc15" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 50 160 L 65 175 L 30 215" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <path d="M 120 120 L 190 160 L 175 175 L 210 215" stroke="#38bdf8" strokeWidth="4" fill="none" />
            <circle cx="120" cy="120" r="26" fill="#ffffff" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">🌩️</text>
          </g>
        )}

        {/* 17. ROSES PETAL TEMPEST */}
        {explosionId === 'exp_roses' && (
          <g>
            <circle cx="120" cy="120" r="60" fill="#e11d48" opacity="0.6" className="animate-ping" />
            {[-60, -30, 0, 30, 60, -90, 90, 180].map((deg, i) => (
              <g key={i} transform={`rotate(${deg} 120 120) translate(0, -65)`}>
                <ellipse cx="120" cy="120" rx="14" ry="8" fill="#f43f5e" stroke="#be123c" strokeWidth="1.5" />
              </g>
            ))}
            <text x="120" y="135" fontSize="52" textAnchor="middle">🌹</text>
          </g>
        )}

        {/* 18. PRISMATIC CRYSTALS */}
        {explosionId === 'exp_crystal' && (
          <g>
            <circle cx="120" cy="120" r="65" fill="#06b6d4" opacity="0.6" className="animate-ping" />
            <polygon points="120,40 150,90 135,140 105,140 90,90" fill="#a5f3fc" stroke="#0891b2" strokeWidth="2.5" />
            <polygon points="180,80 200,120 180,160 140,140" fill="#67e8f9" opacity="0.8" />
            <polygon points="60,80 40,120 60,160 100,140" fill="#67e8f9" opacity="0.8" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">💎</text>
          </g>
        )}

        {/* 19. METEOR ASTEROID IMPACT */}
        {explosionId === 'exp_meteor' && (
          <g>
            <circle cx="120" cy="120" r="75" fill="url(#lavaGrad)" className="animate-ping" />
            <path d="M 50 20 Q 90 80 120 120" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
            <circle cx="120" cy="120" r="35" fill="#431407" stroke="#ea580c" strokeWidth="3" />
            <circle cx="105" cy="110" r="6" fill="#1c1917" />
            <circle cx="135" cy="130" r="8" fill="#1c1917" />
            <text x="120" y="135" fontSize="48" textAnchor="middle">☄️</text>
          </g>
        )}

        {/* 20. BUBBLES MEGA BURST */}
        {explosionId === 'exp_bubbles' && (
          <g>
            <circle cx="120" cy="120" r="70" fill="#7dd3fc" opacity="0.4" className="animate-ping" />
            <circle cx="80" cy="80" r="16" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="160" cy="80" r="22" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="70" cy="150" r="20" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="165" cy="155" r="18" fill="none" stroke="#38bdf8" strokeWidth="3" />
            <text x="120" y="135" fontSize="56" textAnchor="middle">🫧</text>
          </g>
        )}

        {/* 21. 8-BIT RETRO PIXEL EXPLOSION */}
        {explosionId === 'exp_pixel' && (
          <g>
            <rect x="70" y="70" width="100" height="100" fill="#f59e0b" opacity="0.4" className="animate-pulse" />
            {/* Pixel Blocks */}
            <rect x="110" y="50" width="20" height="20" fill="#ef4444" />
            <rect x="50" y="110" width="20" height="20" fill="#facc15" />
            <rect x="170" y="110" width="20" height="20" fill="#ef4444" />
            <rect x="110" y="170" width="20" height="20" fill="#facc15" />
            <rect x="70" y="70" width="20" height="20" fill="#f97316" />
            <rect x="150" y="70" width="20" height="20" fill="#f97316" />
            <rect x="70" y="150" width="20" height="20" fill="#f97316" />
            <rect x="150" y="150" width="20" height="20" fill="#f97316" />
            <text x="120" y="125" fill="#ffffff" fontFamily="monospace" fontWeight="900" fontSize="20" textAnchor="middle">
              KABOOM!
            </text>
            <text x="120" y="145" fontSize="32" textAnchor="middle">🕹️</text>
          </g>
        )}

        {/* 22. DEFAULT / CLASSIC DYNAMITE POWDER BOOM */}
        {(explosionId === 'exp_classic' ||
          ![
            'exp_nuclear', 'exp_confetti', 'exp_plasma', 'exp_supernova', 'exp_blackhole',
            'exp_coins', 'exp_volcano', 'exp_glitch', 'exp_birthday', 'exp_divine',
            'exp_bats', 'exp_fireworks', 'exp_toxic', 'exp_slime', 'exp_ice',
            'exp_electric', 'exp_roses', 'exp_crystal', 'exp_meteor', 'exp_bubbles',
            'exp_pixel'
          ].includes(explosionId)) && (
          <g>
            <circle cx="120" cy="120" r="70" fill={effect.previewColor} opacity="0.8" className="animate-ping" />
            <circle cx="120" cy="120" r="48" fill="#f97316" />
            <circle cx="120" cy="120" r="28" fill="#fde047" />
            <circle cx="120" cy="120" r="14" fill="#ffffff" />
            {/* Spikes */}
            <polygon points="120,20 132,80 120,95 108,80" fill="#ef4444" />
            <polygon points="220,120 160,132 145,120 160,108" fill="#ef4444" />
            <polygon points="120,220 108,160 120,145 132,160" fill="#ef4444" />
            <polygon points="20,120 80,108 95,120 80,132" fill="#ef4444" />
            <polygon points="190,50 145,95 135,105 155,85" fill="#dc2626" />
            <polygon points="50,190 95,145 105,135 85,155" fill="#dc2626" />
            <text x="120" y="135" fontSize="56" textAnchor="middle">💥</text>
          </g>
        )}
      </svg>
    </div>
  );
};

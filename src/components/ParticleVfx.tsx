import React, { useMemo } from 'react';

interface ParticleVfxProps {
  enabled: boolean;
  intensity?: 'off' | 'low' | 'medium' | 'epic';
}

export const ParticleVfx: React.FC<ParticleVfxProps> = ({ enabled, intensity = 'epic' }) => {
  if (!enabled || intensity === 'off' || intensity === 'low') return null;

  const count = intensity === 'medium' ? 24 : 54;

  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // % left
      size: Math.random() * 5 + 2, // px
      duration: Math.random() * 3.5 + 2.5, // sec
      delay: Math.random() * 4, // sec
      driftX: (Math.random() - 0.5) * 60, // px horizontal sway
      color:
        Math.random() > 0.7
          ? '#fef08a' // intense white-yellow
          : Math.random() > 0.4
          ? '#facc15' // gold
          : Math.random() > 0.2
          ? '#f97316' // fire orange
          : '#ef4444', // fiery red
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-12px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 10px ${p.color}, 0 0 18px ${p.color}`,
            opacity: p.opacity,
            animation: `driftEmbers ${p.duration}s infinite linear`,
            animationDelay: `${p.delay}s`,
            ['--drift-x' as string]: `${p.driftX}px`,
          }}
        />
      ))}
      <style>{`
        @keyframes driftEmbers {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.9;
          }
          40% {
            transform: translateY(-220px) translateX(calc(var(--drift-x, 20px) * 0.5)) scale(1.3);
            opacity: 0.8;
          }
          80% {
            transform: translateY(-440px) translateX(var(--drift-x, 20px)) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-620px) translateX(calc(var(--drift-x, 20px) * 1.3)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

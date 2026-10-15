import React, { useEffect, useState, useRef } from 'react';
import { Mic, MicOff, Volume2, MessageSquare, Radio, Users, Sparkles } from 'lucide-react';
import { Player } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface VoiceChatPanelProps {
  players: Player[];
  isOnline: boolean;
  onSendQuickVoice: (text: string) => void;
  isMuted: boolean;
}

export const VoiceChatPanel: React.FC<VoiceChatPanelProps> = ({
  players,
  isOnline,
  onSendQuickVoice,
}) => {
  const [micActive, setMicActive] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  const toggleMic = async () => {
    if (!micActive) {
      const ok = await soundEngine.enableRealMic();
      setMicActive(true);
      if (ok) {
        // Start monitoring volume
        const checkLevel = () => {
          const lvl = soundEngine.getMicVolumeLevel();
          setMicLevel(lvl);
          if (lvl > 0.25) {
            // User speaking
            const user = players.find((p) => p.isUser);
            if (user) {
              user.isSpeaking = true;
            }
          }
          animFrameRef.current = requestAnimationFrame(checkLevel);
        };
        checkLevel();
      }
    } else {
      soundEngine.disableRealMic();
      setMicActive(false);
      setMicLevel(0);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      soundEngine.disableRealMic();
    };
  }, []);

  const quickQuotes = [
    '¡Pásala ya!',
    '¡Me quemo!',
    '¡A mí nooo!',
    '¡Va a explotar!',
    '¡Qué reflejos!',
    '¡No la sueltes!',
  ];

  const handleQuickShout = (quote: string) => {
    soundEngine.playVoiceBleep(1.2);
    onSendQuickVoice(quote);
  };

  return (
    <div className="w-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-2.5 shadow-xl transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Voice Chat status & Mic button */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
              micActive
                ? 'bg-emerald-600 text-white hover:bg-emerald-500 animate-pulse'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {micActive ? (
              <>
                <Mic className="w-3.5 h-3.5" />
                <span>Micro Activo</span>
                {/* Visualizer bars */}
                <div className="flex items-end gap-0.5 h-3 ml-1">
                  <div
                    className="w-1 bg-white rounded-full transition-all"
                    style={{ height: `${Math.max(3, micLevel * 14)}px` }}
                  />
                  <div
                    className="w-1 bg-white rounded-full transition-all"
                    style={{ height: `${Math.max(3, micLevel * 20)}px` }}
                  />
                  <div
                    className="w-1 bg-white rounded-full transition-all"
                    style={{ height: `${Math.max(3, micLevel * 12)}px` }}
                  />
                </div>
              </>
            ) : (
              <>
                <MicOff className="w-3.5 h-3.5 text-slate-400" />
                <span>Activar Micro</span>
              </>
            )}
          </button>

          {/* Active Speakers avatars */}
          <div className="flex items-center -space-x-1.5">
            {players
              .filter((p) => p.isSpeaking && p.isAlive)
              .map((p) => (
                <div
                  key={p.id}
                  className="w-6 h-6 rounded-full bg-slate-800 border-2 border-emerald-400 flex items-center justify-center text-xs animate-bounce shadow"
                  title={`${p.name} está hablando`}
                >
                  {p.avatar}
                </div>
              ))}
          </div>

          <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            <span>{isOnline ? 'Canal Global #042' : 'Chat de Sala Local'}</span>
          </div>
        </div>

        {/* Right: Quick Shout buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {quickQuotes.slice(0, 3).map((quote) => (
            <button
              key={quote}
              onClick={() => handleQuickShout(quote)}
              className="px-2 py-1 bg-slate-800 hover:bg-orange-500/20 hover:border-orange-500/40 border border-slate-700 rounded-lg text-[11px] font-semibold text-slate-200 transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              💬 {quote}
            </button>
          ))}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
            title="Más frases de voz"
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Expanded quick quotes tray */}
      {isExpanded && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2 mt-2 border-t border-slate-800 animate-fadeIn">
          {quickQuotes.map((quote) => (
            <button
              key={quote}
              onClick={() => handleQuickShout(quote)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-orange-600/30 border border-slate-700 hover:border-orange-500/60 rounded-xl text-xs font-semibold text-amber-200 transition-all cursor-pointer active:scale-95"
            >
              📢 {quote}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

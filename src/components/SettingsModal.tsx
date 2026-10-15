import React, { useState } from 'react';
import {
  X,
  Settings,
  Volume2,
  Sliders,
  Keyboard,
  Eye,
  Check,
  Maximize,
  Minimize,
  Bot,
  Zap,
  Sparkles,
} from 'lucide-react';
import { BotDifficulty, GameSettings } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  botDifficulty: BotDifficulty;
  onChangeBotDifficulty: (diff: BotDifficulty) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  botDifficulty,
  onChangeBotDifficulty,
}) => {
  const [current, setCurrent] = useState<GameSettings>(settings);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.setVolumes(current.masterVolume, current.sfxVolume, current.musicVolume);
    onUpdateSettings(current);
    onClose();
  };

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
      // Fullscreen failed or denied in iframe
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-600/40 rounded-3xl shadow-2xl shadow-amber-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-arcade text-white tracking-wide">
                Ajustes del Juego
              </h2>
              <p className="text-xs text-slate-400">
                Configura controles, sensibilidad, audio y gráficos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Pantalla Completa Quick Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </div>
              <div>
                <div className="text-xs font-bold text-white">Modo Pantalla Completa</div>
                <div className="text-[11px] text-slate-400">
                  {isFullscreen ? 'Pantalla completa activa' : 'Juega sin distracciones'}
                </div>
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow"
            >
              {isFullscreen ? 'Salir' : 'Activar'}
            </button>
          </div>

          {/* Dificultad de los Bots (Offline) */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
              <Bot className="w-4 h-4" />
              <span>Dificultad de los Bots (Modo Offline)</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['facil', 'normal', 'dificil', 'extrema'] as BotDifficulty[]).map((diff) => {
                const isSelected = botDifficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => {
                      soundEngine.playClick();
                      onChangeBotDifficulty(diff);
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      isSelected
                        ? diff === 'extrema'
                          ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg'
                          : 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              {botDifficulty === 'facil' && 'Bots lentos con pausas de hasta 2.5s antes de soltar la patata.'}
              {botDifficulty === 'normal' && 'Reacción balanceada de bots (aprox. 1 segundo).'}
              {botDifficulty === 'dificil' && 'Reflejos rápidos (0.5s), pasan a quien tenga menos vidas.'}
              {botDifficulty === 'extrema' && '¡Modo Pesadilla! Reacciones instantáneas inhumanas (0.2s) y pases cruzados.'}
            </p>
          </div>

          {/* Controles y Teclas */}
          <div>
            <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-amber-400">
              <Keyboard className="w-4 h-4" />
              <span>Controles de Pase</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Barra Espaciadora', key: 'Space' },
                { label: 'Tecla Intro (Enter)', key: 'Enter' },
                { label: 'Tecla E', key: 'KeyE' },
              ].map((opt) => {
                const isSelected = current.passKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => {
                      soundEngine.playClick();
                      setCurrent({ ...current, passKey: opt.key });
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                      isSelected
                        ? 'bg-orange-500 text-white ring-2 ring-orange-400'
                        : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <div>{opt.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">[{opt.key}]</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensibilidad */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Sensibilidad de Respuesta ({current.sensitivity}/5)
              </span>
              <span className="text-[11px] text-slate-400">
                {current.sensitivity <= 2 ? 'Suave' : current.sensitivity === 3 ? 'Media' : 'Instantánea'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={current.sensitivity}
              onChange={(e) => setCurrent({ ...current, sensitivity: Number(e.target.value) })}
              className="w-full accent-orange-500 cursor-pointer"
            />
          </div>

          {/* Audio Sliders */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Volume2 className="w-4 h-4" />
              <span>Audio y Sonidos Envolventes</span>
            </div>

            {/* Master */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Volumen General</span>
                <span>{Math.round(current.masterVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={current.masterVolume}
                onChange={(e) => setCurrent({ ...current, masterVolume: Number(e.target.value) })}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* SFX */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Efectos SFX (Explosiones, Pases, Tic-Tac)</span>
                <span>{Math.round(current.sfxVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={current.sfxVolume}
                onChange={(e) => setCurrent({ ...current, sfxVolume: Number(e.target.value) })}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Music */}
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Ritmo de Tensión Acelerado</span>
                <span>{Math.round(current.musicVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={current.musicVolume}
                onChange={(e) => setCurrent({ ...current, musicVolume: Number(e.target.value) })}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Gráficos e Intensidad */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-amber-400">
              <Eye className="w-4 h-4" />
              <span>Efectos Visuales e Intensidad</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-xs text-slate-200">Sacudida de Pantalla (Screen Shake)</span>
                <div className="flex items-center gap-1">
                  {(['off', 'subtle', 'extreme'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setCurrent({ ...current, screenShake: mode })}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg uppercase cursor-pointer ${
                        current.screenShake === mode
                          ? 'bg-orange-500 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {mode === 'off' ? 'No' : mode === 'subtle' ? 'Suave' : 'Extrema'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partículas / Modo Rendimiento */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 gap-2">
                <div>
                  <div className="text-xs text-white font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    <span>Eliminar Partículas (Modo Anti-Lag)</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {current.particles === 'off' || current.particles === 'low'
                      ? 'Partículas eliminadas por completo (0 Lag / Fluido en cualquier móvil)'
                      : current.particles === 'medium'
                      ? 'Partículas moderadas'
                      : 'Full partículas dopamínicas (Recomendado)'}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    onClick={() => setCurrent({ ...current, particles: 'off' })}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                      current.particles === 'off' || current.particles === 'low'
                        ? 'bg-red-600 text-white font-black shadow-lg ring-2 ring-red-400'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ❌ Eliminar Partículas
                  </button>
                  <button
                    onClick={() => setCurrent({ ...current, particles: 'epic' })}
                    className={`px-3 py-1.5 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                      current.particles === 'epic'
                        ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-slate-950 font-black shadow-lg ring-2 ring-yellow-300'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    🔥 Full Partículas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-arcade text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            GUARDAR Y APLICAR
          </button>
        </div>
      </div>
    </div>
  );
};

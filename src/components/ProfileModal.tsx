import React, { useState } from 'react';
import { X, User, Trophy, Flame, Award, Zap, Check, Edit2 } from 'lucide-react';
import { UserProfile } from '../types/game';
import { AVATAR_OPTIONS, TITLE_OPTIONS } from '../services/storage';
import { soundEngine } from '../services/soundEngine';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [selectedTitle, setSelectedTitle] = useState(profile.title);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEngine.playCoin();
    const updated: UserProfile = {
      ...profile,
      name: name.trim() || 'Patatero_Pro',
      avatar: selectedAvatar,
      title: selectedTitle,
    };
    onUpdateProfile(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 400);
  };

  const winRate =
    profile.matchesPlayed > 0
      ? Math.round((profile.victories / profile.matchesPlayed) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-amber-600/40 rounded-3xl shadow-2xl shadow-amber-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-arcade text-white tracking-wide">
                Perfil de Jugador
              </h2>
              <p className="text-xs text-slate-400">
                Personaliza tu identidad y consulta tus estadísticas
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
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Main User Card Preview */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/30 border border-cyan-500/30 shadow-inner">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border-2 border-cyan-400 flex items-center justify-center text-3xl shadow-lg ring-4 ring-cyan-500/20">
              {selectedAvatar}
            </div>
            <div className="flex-1">
              <div className="text-base font-arcade text-white">{name || 'Patatero_Pro'}</div>
              <div className="text-xs font-semibold text-amber-400 mt-0.5">{selectedTitle}</div>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 text-yellow-300 font-bold">
                  ⭐ Nivel {profile.level} ({profile.currentXp} EXP)
                </span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  🪙 {profile.coins} Monedas
                </span>
              </div>
            </div>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-1.5 block">
              Nombre de Jugador
            </label>
            <input
              type="text"
              maxLength={16}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 rounded-xl border border-slate-700 focus:border-cyan-400 text-white font-medium text-sm outline-none transition-colors"
              placeholder="Escribe tu apodo..."
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">
              Seleccionar Avatar Exclusivo
            </label>
            <div className="grid grid-cols-8 gap-2">
              {AVATAR_OPTIONS.map((avatar) => {
                const isSelected = selectedAvatar === avatar;
                return (
                  <button
                    key={avatar}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedAvatar(avatar);
                    }}
                    className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/30 border-2 border-cyan-400 scale-110 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800/80 border border-slate-700 hover:bg-slate-700/80'
                    }`}
                  >
                    {avatar}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Selector */}
          <div>
            <label className="text-xs font-bold text-slate-300 mb-2 block">
              Título Honorífico
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TITLE_OPTIONS.map((title) => {
                const isSelected = selectedTitle === title;
                return (
                  <button
                    key={title}
                    onClick={() => {
                      soundEngine.playClick();
                      setSelectedTitle(title);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-2 border-amber-400 text-amber-200'
                        : 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>{title}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Career Stats Grid */}
          <div className="border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
              Estadísticas de Carrera
            </h4>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-base font-arcade text-white">{profile.matchesPlayed}</div>
                <div className="text-[10px] text-slate-400">Partidas</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-base font-arcade text-emerald-400">{profile.victories}</div>
                <div className="text-[10px] text-slate-400">Victorias ({winRate}%)</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="text-base font-arcade text-orange-400">
                  {profile.explosionsSurvived}
                </div>
                <div className="text-[10px] text-slate-400">Pases Salvados</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 text-white font-arcade text-xs rounded-xl shadow-lg transition-all cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : null}
            <span>{isSaved ? '¡GUARDADO!' : 'GUARDAR CAMBIOS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

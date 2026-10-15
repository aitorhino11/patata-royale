import React, { useState } from 'react';
import { X, Sparkles, Trophy, Award, Check, Coins, Flame, Calendar, Gift, Lock } from 'lucide-react';
import { DailyMission, UserProfile } from '../types/game';
import { generateBattlePassTiers, getRequiredXpForLevel } from '../services/storage';
import { soundEngine } from '../services/soundEngine';

interface BattlePassModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  missions: DailyMission[];
  onClaimMission: (missionId: string) => void;
  onClaimPassTier: (tierLevel: number) => void;
}

export const BattlePassModal: React.FC<BattlePassModalProps> = ({
  isOpen,
  onClose,
  profile,
  missions,
  onClaimMission,
  onClaimPassTier,
}) => {
  const [activeTab, setActiveTab] = useState<'pass' | 'missions'>('pass');
  const tiers = generateBattlePassTiers();
  const currentReqXp = getRequiredXpForLevel(profile.level);
  const xpPercent = Math.min(100, Math.round((profile.currentXp / currentReqXp) * 100));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border-2 border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-950/70 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-amber-300 font-arcade text-lg shadow-lg">
                Nv.{profile.level}
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-arcade text-white tracking-wide flex items-center gap-2">
                  <span>Pase de Batalla & Misiones</span>
                  <span className="text-xs bg-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black">
                    TEMPORADA 1
                  </span>
                </h2>
                {/* Level Progress Bar */}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-36 sm:w-48 h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-300"
                      style={{ width: `${xpPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    {profile.currentXp} / {currentReqXp} EXP
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('pass');
              }}
              className={`py-2 text-xs font-arcade rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'pass'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-500 text-slate-950 font-black shadow-lg shadow-orange-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>PASE DE BATALLA (1 - 100)</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setActiveTab('missions');
              }}
              className={`py-2 text-xs font-arcade rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeTab === 'missions'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>MISIONES DIARIAS (3)</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: 100 BATTLE PASS TIERS */}
          {activeTab === 'pass' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/30 to-amber-950/30 border border-purple-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300">
                  🎁 Monedas cada 3 niveles y 1 skin exclusiva cada 25 niveles (Nv. 25, 50, 75 y 100).
                </span>
                <span className="text-yellow-300 font-bold hidden sm:inline">
                  ¡Sube de nivel jugando!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {tiers.map((tier) => {
                  const isUnlocked = profile.level >= tier.level;
                  const isClaimed = profile.claimedPassTiers.includes(tier.level);
                  const isMilestone = tier.level === 25 || tier.level === 50 || tier.level === 75 || tier.level === 100;

                  return (
                    <div
                      key={tier.level}
                      className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        isMilestone
                          ? 'border-yellow-400/80 bg-gradient-to-b from-yellow-950/40 to-slate-900 shadow-lg shadow-yellow-500/20'
                          : isUnlocked
                          ? 'border-amber-500/50 bg-slate-900/80'
                          : 'border-slate-800 bg-slate-950/50 opacity-60'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-arcade text-xs text-amber-300">
                          NIVEL {tier.level}
                        </span>
                        {isMilestone && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-yellow-500 text-slate-950 animate-bounce">
                            ★ RECOMPENSA ÉPICA ★
                          </span>
                        )}
                      </div>

                      {/* Reward Info */}
                      <div className="my-2 flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border ${
                            isMilestone
                              ? 'bg-yellow-500/20 border-yellow-400/50'
                              : 'bg-slate-800 border-slate-700'
                          }`}
                        >
                          {tier.rewardType === 'skin' ? '💣' : '🪙'}
                        </div>
                        <div>
                          <div className="text-xs font-arcade text-white">{tier.rewardName}</div>
                          <div className="text-[10px] text-slate-400">
                            {isUnlocked ? 'Nivel alcanzado' : `Requiere Nivel ${tier.level}`}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-2">
                        {isClaimed ? (
                          <div className="w-full py-1.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-center text-xs font-bold flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>RECLAMADO</span>
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => onClaimPassTier(tier.level)}
                            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 active:scale-95 text-slate-950 font-arcade text-xs shadow-md transition-all cursor-pointer"
                          >
                            RECLAMAR RECOMPENSA
                          </button>
                        ) : (
                          <div className="w-full py-1.5 rounded-xl bg-slate-800/60 text-slate-500 text-center text-xs font-bold flex items-center justify-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>BLOQUEADO</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: DAILY MISSIONS */}
          {activeTab === 'missions' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Completa las misiones para ganar EXP y subir de nivel rápidamente:</span>
                <span className="text-amber-400 font-bold">Se reinician cada 24h</span>
              </div>

              {missions.map((mission) => {
                const isComplete = mission.currentCount >= mission.targetCount;
                const percent = Math.min(100, Math.round((mission.currentCount / mission.targetCount) * 100));

                return (
                  <div
                    key={mission.id}
                    className="p-4 rounded-2xl bg-slate-950/80 border-2 border-slate-800 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-arcade text-white">{mission.title}</h4>
                        <span className="text-xs font-bold text-amber-400">
                          ({mission.currentCount}/{mission.targetCount})
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{mission.description}</p>

                      {/* Progress Bar */}
                      <div className="w-full max-w-sm h-2 bg-slate-800 rounded-full overflow-hidden mt-2 border border-slate-700/60">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Rewards & Button */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-cyan-300">
                          +{mission.rewardXp} EXP
                        </div>
                        <div className="text-xs font-mono font-bold text-yellow-300">
                          +{mission.rewardCoins} 🪙
                        </div>
                      </div>

                      <div>
                        {mission.isClaimed ? (
                          <div className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            <span>COMPLETADA</span>
                          </div>
                        ) : isComplete ? (
                          <button
                            onClick={() => onClaimMission(mission.id)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 active:scale-95 text-slate-950 font-arcade text-xs shadow-lg transition-all cursor-pointer animate-bounce"
                          >
                            RECLAMAR
                          </button>
                        ) : (
                          <div className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold">
                            EN PROGRESO
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

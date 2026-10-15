import React, { useState } from 'react';
import { X, Trophy, Medal, Flame, Globe, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import { LeaderboardEntry } from '../types/game';
import { soundEngine } from '../services/soundEngine';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: LeaderboardEntry[];
  userName: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  entries,
  userName,
}) => {
  const [filter, setFilter] = useState<'global' | 'weekly' | 'friends'>('global');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-slate-900 border-2 border-amber-600/40 rounded-3xl shadow-2xl shadow-amber-950/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-arcade text-white tracking-wide">
                Clasificación en Tiempo Real
              </h2>
              <p className="text-xs text-slate-400">
                Los mejores supervivientes de la patata caliente
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

        {/* Tab Filters */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => {
              soundEngine.playClick();
              setFilter('global');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'global'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Mundial Top 100</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setFilter('weekly');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'weekly'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Semanal</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setFilter('friends');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              filter === 'friends'
                ? 'bg-amber-500 text-slate-950 font-extrabold shadow'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Sala y Amigos</span>
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          <div className="space-y-2">
            {entries.map((entry) => {
              const isTop1 = entry.rank === 1;
              const isTop2 = entry.rank === 2;
              const isTop3 = entry.rank === 3;
              const isUser = entry.isUser || entry.name === userName;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                    isUser
                      ? 'border-cyan-400/80 bg-cyan-950/30 ring-2 ring-cyan-500/40 shadow-lg'
                      : isTop1
                      ? 'border-yellow-500/50 bg-yellow-950/20'
                      : isTop2
                      ? 'border-slate-400/40 bg-slate-800/30'
                      : isTop3
                      ? 'border-amber-700/40 bg-amber-950/20'
                      : 'border-slate-800/70 bg-slate-900/50 hover:bg-slate-800/40'
                  }`}
                >
                  {/* Left: Rank & Player info */}
                  <div className="flex items-center gap-3">
                    {/* Rank Badge */}
                    <div className="w-7 text-center font-arcade text-sm">
                      {isTop1 ? (
                        <span className="text-yellow-400 text-base">👑</span>
                      ) : isTop2 ? (
                        <span className="text-slate-300 text-base">🥈</span>
                      ) : isTop3 ? (
                        <span className="text-amber-500 text-base">🥉</span>
                      ) : (
                        <span className="text-slate-400 font-bold">#{entry.rank}</span>
                      )}
                    </div>

                    {/* Avatar & Flag */}
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow">
                        {entry.avatar}
                      </div>
                      <span className="absolute -bottom-1 -right-1 text-xs">
                        {entry.country}
                      </span>
                    </div>

                    {/* Nickname & Title */}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs md:text-sm font-bold ${
                            isUser ? 'text-cyan-300 font-extrabold' : 'text-white'
                          }`}
                        >
                          {entry.name}
                        </span>
                        {isUser && (
                          <span className="bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-black px-1.5 py-0.2 rounded">
                            TÚ
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-amber-400/90 font-medium">
                        {entry.title}
                      </div>
                    </div>
                  </div>

                  {/* Right: Stats (Level, Wins, Win Rate) */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="flex items-center justify-end gap-1 text-xs md:text-sm font-arcade text-yellow-300">
                        <span className="text-[10px] bg-amber-500/20 text-yellow-300 border border-yellow-500/40 px-1.5 py-0.5 rounded font-black">
                          NIVEL {entry.level || 1}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {entry.wins} victorias ({entry.winRate}%)
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

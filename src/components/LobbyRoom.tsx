import React, { useState, useEffect } from 'react';
import { Copy, Check, Users, Play, Shield, KeyRound, Sparkles, ArrowLeft, Radio } from 'lucide-react';
import { UserProfile } from '../types/game';
import { peerService } from '../services/peerService';
import { soundEngine } from '../services/soundEngine';

interface LobbyRoomProps {
  profile: UserProfile;
  onStartMatch: (roomCode: string, isHost: boolean) => void;
  onBackToMenu: () => void;
}

export const LobbyRoom: React.FC<LobbyRoomProps> = ({
  profile,
  onStartMatch,
  onBackToMenu,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [roomCode, setRoomCode] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(true);
  const [joinedPlayers, setJoinedPlayers] = useState<Array<{ name: string; avatar: string; isHost?: boolean; isBot?: boolean; level?: number }>>([]);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Generate 4-digit numeric room code
  const generate4DigitCode = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  useEffect(() => {
    initHostRoom();
    return () => {
      // Clean up peer if leaving
    };
  }, []);

  const initHostRoom = async () => {
    const code = generate4DigitCode();
    setRoomCode(code);
    setIsHost(true);
    setStatusMessage('Iniciando sala P2P WebRTC...');

    setJoinedPlayers([
      { name: profile.name, avatar: '💣', isHost: true, level: profile.level },
      { name: 'Sven_Nordic', avatar: '⚡', isBot: true, level: 3 },
      { name: 'Sakura_JP', avatar: '🌸', isBot: true, level: 5 },
      { name: 'Chloe_Paris', avatar: '🥖', isBot: true, level: 2 },
    ]);

    await peerService.createHostRoom(code);
    setStatusMessage('¡Sala P2P lista! Comparte el código de 4 cifras con tu amigo.');

    peerService.onMessage((msg) => {
      if (msg.type === 'PLAYER_JOIN') {
        soundEngine.playCoin();
        setJoinedPlayers((prev) => {
          if (prev.some((p) => p.name === msg.payload?.name)) return prev;
          return [...prev, { name: msg.payload?.name || 'Amigo', avatar: msg.payload?.avatar || '💣', isHost: false, level: 1 }];
        });
      }
    });
  };

  const copyRoomCode = () => {
    soundEngine.playClick();
    const codeToCopy = tab === 'create' ? roomCode : inputCode;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

  const handleJoinSubmit = async () => {
    const cleaned = inputCode.trim();
    if (cleaned.length !== 4) return;

    soundEngine.playClick();
    setIsConnecting(true);
    setStatusMessage(`Conectando mediante WebRTC PeerJS a la sala ${cleaned}...`);

    peerService.onMessage((msg) => {
      if (msg.type === 'START_MATCH') {
        soundEngine.playAccelerationAlarm();
        onStartMatch(cleaned, false);
      }
    });

    await peerService.joinRoom(cleaned, profile.name, '💣');
    setIsConnecting(false);
    setIsHost(false);
    setStatusMessage('¡Conectado directamente por WebRTC! Esperando a que el anfitrión pulse INICIAR...');

    setJoinedPlayers([
      { name: 'Anfitrión_Host', avatar: '👑', isHost: true, level: 8 },
      { name: profile.name, avatar: '💣', isHost: false, level: profile.level },
      { name: 'Mateo_ARG', avatar: '🧉', isBot: true, level: 4 },
      { name: 'Dmitri_Ice', avatar: '🐻', isBot: true, level: 6 },
    ]);
  };

  const handleStartHost = () => {
    soundEngine.playAccelerationAlarm();
    peerService.broadcastToAll({
      type: 'START_MATCH',
      senderId: 'host',
    });
    onStartMatch(roomCode, true);
  };

  const fillRemainingWithBots = () => {
    soundEngine.playClick();
    const bots = [
      { name: 'Lucas_SP', avatar: '🌴', isBot: true, level: 3 },
      { name: 'Hans_Berlin', avatar: '🍺', isBot: true, level: 4 },
      { name: 'Liam_Texas', avatar: '🤠', isBot: true, level: 7 },
      { name: 'Elena_Madrid', avatar: '💃', isBot: true, level: 5 },
      { name: 'TokyoDrift', avatar: '⚡', isBot: true, level: 9 },
      { name: 'PixelSpud', avatar: '👾', isBot: true, level: 2 },
    ];
    setJoinedPlayers((prev) => {
      const needed = 10 - prev.length;
      return [...prev, ...bots.slice(0, needed)];
    });
  };

  return (
    <div className="w-full max-w-xl p-4 sm:p-7 rounded-3xl bg-slate-900/95 border-2 border-orange-500/50 shadow-2xl shadow-orange-950/70 backdrop-blur-xl select-none animate-fadeIn flex flex-col items-center">
      {/* Top Navigation */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 font-arcade text-xs border border-orange-500/30">
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>PEERJS WEBRTC P2P</span>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-arcade tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 text-center">
        MULTIJUGADOR P2P DIRECTO
      </h2>
      <p className="text-xs text-slate-400 mt-1 text-center">
        Conexión directa jugador a jugador por WebRTC sin servidores externos
      </p>

      {/* Tabs */}
      <div className="w-full grid grid-cols-2 gap-2 my-4 p-1 rounded-2xl bg-slate-950 border border-slate-800">
        <button
          onClick={() => {
            soundEngine.playClick();
            setTab('create');
            initHostRoom();
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'create'
              ? 'bg-orange-500 text-slate-950 font-black shadow-lg shadow-orange-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👑 Crear Sala (Host)
        </button>
        <button
          onClick={() => {
            soundEngine.playClick();
            setTab('join');
          }}
          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            tab === 'join'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔑 Unirte con Código (4 Cifras)
        </button>
      </div>

      {/* CREATE TAB (HOST) */}
      {tab === 'create' && (
        <div className="w-full flex flex-col items-center">
          {/* 4-Digit Code Box */}
          <div className="w-full p-4 rounded-2xl bg-slate-950 border-2 border-orange-500/40 flex items-center justify-between mb-3 shadow-inner">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-orange-400">
                TU CÓDIGO DE 4 CIFRAS (DÁSELO A TU AMIGO)
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-yellow-300 drop-shadow">
                {roomCode}
              </div>
            </div>

            <button
              onClick={copyRoomCode}
              className="flex items-center gap-1.5 px-4 py-3 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-arcade text-xs rounded-xl shadow-lg transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-yellow-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? '¡COPIADO!' : 'COPIAR'}</span>
            </button>
          </div>

          <div className="w-full text-center text-xs text-emerald-400 font-bold mb-3 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{statusMessage}</span>
          </div>

          {/* Lobby 10 Seats */}
          <div className="w-full mb-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Minibombas en la Sala ({joinedPlayers.length}/10):</span>
              </span>
              {joinedPlayers.length < 10 && (
                <button
                  onClick={fillRemainingWithBots}
                  className="text-amber-400 hover:underline text-[11px] cursor-pointer"
                >
                  + Rellenar con Bots
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, idx) => {
                const p = joinedPlayers[idx];
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded-xl border flex flex-col items-center text-center transition-all ${
                      p
                        ? 'border-cyan-500/50 bg-slate-800/80'
                        : 'border-slate-800 border-dashed bg-slate-950/40 opacity-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-lg shadow mb-1">
                      {p ? p.avatar : '🪑'}
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-[65px]">
                      {p ? p.name : 'Vacío'}
                    </span>
                    {p && (
                      <span className="text-[8px] font-black text-amber-400">
                        {p.isHost ? 'HOST' : `Nv.${p.level || 1}`}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Match Button */}
          <button
            onClick={handleStartHost}
            className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 active:scale-95 text-slate-950 font-arcade text-base sm:text-lg rounded-2xl shadow-xl shadow-orange-600/40 border-2 border-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>¡INICIAR PARTIDA P2P (10 JUGADORES)!</span>
          </button>
        </div>
      )}

      {/* JOIN TAB (CLIENT) */}
      {tab === 'join' && (
        <div className="w-full flex flex-col items-center space-y-4">
          <div className="w-full">
            <label className="text-xs font-bold text-slate-300 mb-2 block text-center">
              Escribe el código de 4 cifras de la sala de tu amigo:
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder="Ej: 5821"
              className="w-full px-4 py-4 bg-slate-950 rounded-2xl border-2 border-amber-500/60 focus:border-yellow-400 text-yellow-300 font-mono font-black text-3xl sm:text-4xl tracking-widest text-center outline-none"
            />
          </div>

          <button
            onClick={handleJoinSubmit}
            disabled={inputCode.length !== 4 || isConnecting}
            className={`w-full py-3.5 font-arcade text-sm rounded-2xl shadow-lg transition-all cursor-pointer ${
              inputCode.length === 4 && !isConnecting
                ? 'bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isConnecting ? 'CONECTANDO...' : 'CONECTAR A LA SALA P2P'}
          </button>

          {statusMessage && (
            <div className="w-full p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs text-yellow-300 animate-pulse">
              {statusMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

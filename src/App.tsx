/**
 * Patata Caliente Royale - WebRTC P2P Direct Edition
 * 10 Players Battle Royale, PeerJS direct P2P hosting with 4-digit codes,
 * Leveling & XP system (No trophies), 100-tier Battle Pass, 3 Daily Missions,
 * Account System (Google / Username), and 80+ dynamic skins & accessories!
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  BombAccessory,
  BombSkin,
  BotDifficulty,
  DailyMission,
  ExplosionEffect,
  GameMode,
  GameSettings,
  LeaderboardEntry,
  MatchStats,
  Player,
  PotatoPanicStage,
  PotatoSkin,
  TrailEffect,
  UserAccount,
  UserProfile,
} from './types/game';
import {
  StorageService,
  getRequiredXpForLevel,
  BOMB_SKINS,
  BOMB_ACCESSORIES,
  TRAIL_EFFECTS,
  EXPLOSION_EFFECTS,
} from './services/storage';
import { soundEngine } from './services/soundEngine';
import { peerService } from './services/peerService';
import { PotatoArena } from './components/PotatoArena';
import { GameHUD } from './components/GameHUD';
import { VoiceChatPanel } from './components/VoiceChatPanel';
import { LobbyRoom } from './components/LobbyRoom';
import { VictoryPodiumModal } from './components/VictoryPodiumModal';
import { ShopModal } from './components/ShopModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { BattlePassModal } from './components/BattlePassModal';
import { AccountModal } from './components/AccountModal';
import {
  Flame,
  Radio,
  Shield,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  Users,
  KeyRound,
  User,
  ShoppingBag,
} from 'lucide-react';

const BOT_NAMES = [
  { name: 'Sven_Nordic', country: '🇸🇪' },
  { name: 'Sakura_JP', country: '🇯🇵' },
  { name: 'Mateo_ARG', country: '🇦🇷' },
  { name: 'Chloe_Paris', country: '🇫🇷' },
  { name: 'Dmitri_Ice', country: '🇷🇺' },
  { name: 'Lucas_SP', country: '🌴' },
  { name: 'Hans_Berlin', country: '🇩🇪' },
  { name: 'Elena_Madrid', country: '💃' },
  { name: 'Liam_Texas', country: '🤠' },
];

export default function App() {
  // Persistent State
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [account, setAccount] = useState<UserAccount>(() => StorageService.getAccount());
  const [settings, setSettings] = useState<GameSettings>(() => StorageService.getSettings());
  const [skins, setSkins] = useState<BombSkin[]>(() => StorageService.getSkins());
  const [accessories, setAccessories] = useState<BombAccessory[]>(() => StorageService.getAccessories());
  const [trails, setTrails] = useState<TrailEffect[]>(() => StorageService.getTrails());
  const [explosions, setExplosions] = useState<ExplosionEffect[]>(() => StorageService.getExplosions());
  const [missions, setMissions] = useState<DailyMission[]>(() => StorageService.getMissions());

  // Match & View State
  const [viewState, setViewState] = useState<'menu' | 'lobby' | 'battle'>('menu');
  const [gameMode, setGameMode] = useState<GameMode>('offline');
  const [botDifficulty, setBotDifficulty] = useState<BotDifficulty>('normal');
  const [currentRoomCode, setCurrentRoomCode] = useState<string>('');
  const [isMatchActive, setIsMatchActive] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBattlePassOpen, setIsBattlePassOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);

  // Rewards & Rank
  const [endCoins, setEndCoins] = useState(0);
  const [endXp, setEndXp] = useState(0);
  const [didLevelUp, setDidLevelUp] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);

  // Sudden acceleration alert state
  const [isSuddenAcceleration, setIsSuddenAcceleration] = useState(false);

  // 10 Players
  const [players, setPlayers] = useState<Player[]>([]);

  // Match Stats
  const [stats, setStats] = useState<MatchStats>({
    roundNumber: 1,
    aliveCount: 10,
    currentHolderIndex: 0,
    targetHolderIndex: null,
    potatoProgress: 0,
    isFlying: false,
    panicProgress: 0,
    accelerationBpm: 95,
    roundTimeRemaining: 15,
    totalRoundDuration: 15,
    isExploding: false,
    lastExplodedPlayerId: null,
    winnerPlayer: null,
  });

  // Dopaminic Rapid-Tap Pass Spam State & Decay Tracking
  const [passCharge, setPassCharge] = useState<number>(0);
  const passChargeRef = useRef<number>(0);
  const lastTapTimeRef = useRef<number>(0);
  const preferredTargetRef = useRef<number | null>(null);
  const [currentRoundExplosionId, setCurrentRoundExplosionId] = useState<string>('exp_classic');

  // Loop & Timer Refs
  const roundTimerRef = useRef<{
    remainingMs: number;
    totalMs: number;
    currentBpm: number;
    nextSuddenAccelMs: number;
  }>({
    remainingMs: 14000,
    totalMs: 14000,
    currentBpm: 95,
    nextSuddenAccelMs: 7000,
  });
  const botPassTimerRef = useRef<number | null>(null);
  const heartbeatIntervalRef = useRef<number | null>(null);

  // Equipped Skin & Trail for Arena rendering
  const equippedTrailItem = trails.find((t) => t.id === profile.equippedTrail) || trails[0];

  // Initialize 10 Minibomb Players with EXACT equipped skins and hats!
  const initPlayers = useCallback(
    (mode: GameMode, diff: BotDifficulty, userProf: UserProfile): Player[] => {
      // User Player (0)
      const userPlayer: Player = {
        id: 'player_0_user',
        name: userProf.name,
        avatar: '💣',
        title: userProf.title,
        isBot: false,
        isAlive: true,
        isUser: true,
        isSpeaking: false,
        country: '🇪🇸',
        ping: 15,
        bombSkinId: userProf.equippedSkin,
        bombHatId: userProf.equippedHat,
        level: userProf.level,
      };

      // 9 Other Rival Minibombs with randomized variety of hats and skins
      const others: Player[] = BOT_NAMES.map((bot, idx) => {
        const botSkin = BOMB_SKINS[(idx + 1) % BOMB_SKINS.length].id;
        const botHat = BOMB_ACCESSORIES[(idx + 1) % BOMB_ACCESSORIES.length].id;

        return {
          id: `player_${idx + 1}`,
          name: bot.name,
          avatar: '💣',
          title: 'Minibomba Rival',
          isBot: mode === 'offline',
          botDifficulty: diff,
          isAlive: true,
          isUser: false,
          isSpeaking: false,
          country: bot.country,
          ping: mode === 'online' ? Math.floor(20 + Math.random() * 40) : undefined,
          bombSkinId: botSkin,
          bombHatId: botHat,
          level: Math.max(1, (idx * 2) % 15 + 1),
        };
      });

      return [userPlayer, ...others];
    },
    []
  );

  // Add XP and handle Level Ups
  const addPlayerXpAndCoins = useCallback(
    (gainedXp: number, gainedCoins: number) => {
      setProfile((prev) => {
        let newLvl = prev.level;
        let newXp = prev.currentXp + gainedXp;
        let reqXp = getRequiredXpForLevel(newLvl);
        let leveledUp = false;

        while (newXp >= reqXp) {
          newXp -= reqXp;
          newLvl += 1;
          reqXp = getRequiredXpForLevel(newLvl);
          leveledUp = true;
        }

        if (leveledUp) {
          setDidLevelUp(true);
          soundEngine.playCoin();
          try {
            confetti({ particleCount: 80, spread: 60 });
          } catch {}
        } else {
          setDidLevelUp(false);
        }

        const updated: UserProfile = {
          ...prev,
          coins: prev.coins + gainedCoins,
          level: newLvl,
          currentXp: newXp,
        };
        StorageService.saveProfile(updated);
        return updated;
      });
    },
    []
  );

  // Update Daily Missions Progress
  const updateMissionProgress = useCallback(
    (type: 'play_matches' | 'pass_potato' | 'survive_top', count: number = 1) => {
      setMissions((prev) => {
        const updated = prev.map((m) => {
          if (m.type === type && !m.isClaimed) {
            return { ...m, currentCount: Math.min(m.targetCount, m.currentCount + count) };
          }
          return m;
        });
        StorageService.saveMissions(updated);
        return updated;
      });
    },
    []
  );

  // Claim Daily Mission Reward
  const handleClaimMission = (missionId: string) => {
    soundEngine.playCoin();
    const mission = missions.find((m) => m.id === missionId);
    if (!mission || mission.isClaimed || mission.currentCount < mission.targetCount) return;

    addPlayerXpAndCoins(mission.rewardXp, mission.rewardCoins);

    const updatedMissions = missions.map((m) => (m.id === missionId ? { ...m, isClaimed: true } : m));
    setMissions(updatedMissions);
    StorageService.saveMissions(updatedMissions);
  };

  // Claim Battle Pass Tier Reward
  const handleClaimPassTier = (tierLevel: number) => {
    if (profile.level < tierLevel || profile.claimedPassTiers.includes(tierLevel)) return;
    soundEngine.playCoin();

    let coinBonus = 0;
    if (tierLevel === 25) {
      // Unlock skin_cyberpunk
      setSkins((prev) => prev.map((s) => (s.id === 'skin_cyberpunk' ? { ...s, unlocked: true } : s)));
    } else if (tierLevel === 50) {
      setSkins((prev) => prev.map((s) => (s.id === 'skin_magma' ? { ...s, unlocked: true } : s)));
    } else if (tierLevel === 75) {
      setSkins((prev) => prev.map((s) => (s.id === 'skin_diamond' ? { ...s, unlocked: true } : s)));
    } else if (tierLevel === 100) {
      setSkins((prev) => prev.map((s) => (s.id === 'skin_phoenix' ? { ...s, unlocked: true } : s)));
    } else if (tierLevel % 3 === 0) {
      coinBonus = 150 + tierLevel * 20;
    } else {
      coinBonus = 80 + tierLevel * 10;
    }

    const updated: UserProfile = {
      ...profile,
      coins: profile.coins + coinBonus,
      claimedPassTiers: [...profile.claimedPassTiers, tierLevel],
    };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  // Start New Round (Frantic pacing)
  const startNewRound = useCallback(
    (roundNum: number, currentPlayers: Player[]) => {
      const alivePlayers = currentPlayers.filter((p) => p.isAlive);
      if (alivePlayers.length <= 1) {
        handleMatchEnd(alivePlayers[0] || currentPlayers[0]);
        return;
      }

      // 9s to 17s secret fuse
      const roundDurationMs = Math.floor(9500 + Math.random() * 8500);
      const startBpm = Math.floor(100 + (10 - alivePlayers.length) * 14);

      roundTimerRef.current = {
        remainingMs: roundDurationMs,
        totalMs: roundDurationMs,
        currentBpm: startBpm,
        nextSuddenAccelMs: Math.floor(roundDurationMs * (0.3 + Math.random() * 0.4)),
      };

      soundEngine.startTensionMusic(startBpm);

      const aliveIndices = currentPlayers
        .map((p, idx) => (p.isAlive ? idx : -1))
        .filter((idx) => idx !== -1);
      const startingIndex = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];

      setStats((prev) => ({
        ...prev,
        roundNumber: roundNum,
        aliveCount: alivePlayers.length,
        currentHolderIndex: startingIndex,
        targetHolderIndex: null,
        potatoProgress: 0,
        isFlying: false,
        panicProgress: 0,
        accelerationBpm: startBpm,
        roundTimeRemaining: Math.round(roundDurationMs / 1000),
        totalRoundDuration: Math.round(roundDurationMs / 1000),
        isExploding: false,
        winnerPlayer: null,
      }));

      if (currentPlayers[startingIndex]?.isBot) {
        scheduleBotPass(startingIndex, currentPlayers, diffReactionTime(botDifficulty));
      }
    },
    [botDifficulty]
  );

  const diffReactionTime = useCallback(
    (diff: BotDifficulty): number => {
      let baseMin = 1100;
      let baseMax = 2000;
      if (diff === 'normal') {
        baseMin = 650;
        baseMax = 1200;
      } else if (diff === 'dificil') {
        baseMin = 280;
        baseMax = 550;
      } else if (diff === 'extrema') {
        baseMin = 120;
        baseMax = 280;
      }
      return Math.floor(baseMin + Math.random() * (baseMax - baseMin));
    },
    []
  );

  const scheduleBotPass = useCallback(
    (botIndex: number, currentPlayers: Player[], delayMs: number) => {
      if (botPassTimerRef.current) clearTimeout(botPassTimerRef.current);

      botPassTimerRef.current = window.setTimeout(() => {
        const aliveIndices = currentPlayers
          .map((p, idx) => (p.isAlive && idx !== botIndex ? idx : -1))
          .filter((idx) => idx !== -1);

        if (aliveIndices.length === 0) return;

        const targetIdx = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];

        if (Math.random() > 0.6) {
          triggerPlayerSpeech(botIndex, '¡Quema!');
        }

        executeThrow(botIndex, targetIdx);
      }, delayMs);
    },
    []
  );

  // Parabolic Throw Animation
  const executeThrow = useCallback(
    (fromIdx: number, toIdx: number) => {
      if (stats.isExploding) return;

      soundEngine.playPassWhoosh();

      // If user was passing, update mission counter
      if (players[fromIdx]?.isUser) {
        updateMissionProgress('pass_potato', 1);
        setProfile((prev) => ({ ...prev, totalPasses: prev.totalPasses + 1 }));
      }

      setStats((prev) => ({
        ...prev,
        isFlying: true,
        currentHolderIndex: fromIdx,
        targetHolderIndex: toIdx,
        potatoProgress: 0,
      }));

      const startTime = performance.now();
      const throwDuration = Math.max(180, 420 - settings.sensitivity * 50);

      const stepFlight = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / throwDuration);

        setStats((prev) => ({
          ...prev,
          potatoProgress: progress,
        }));

        if (progress < 1) {
          requestAnimationFrame(stepFlight);
        } else {
          setStats((prev) => ({
            ...prev,
            isFlying: false,
            currentHolderIndex: toIdx,
            targetHolderIndex: null,
            potatoProgress: 0,
          }));

          setPlayers((curr) => {
            const receiver = curr[toIdx];
            if (receiver?.isUser) {
              soundEngine.startSizzle();
              soundEngine.playHeartbeatThump();
            } else {
              soundEngine.stopSizzle();
            }

            if (receiver?.isBot && receiver.isAlive) {
              scheduleBotPass(toIdx, curr, diffReactionTime(botDifficulty));
            }
            return curr;
          });
        }
      };

      requestAnimationFrame(stepFlight);
    },
    [stats.isExploding, settings.sensitivity, botDifficulty, diffReactionTime, scheduleBotPass, players, updateMissionProgress]
  );

  // Dopaminic Rapid-Tap Pass Spam Handler (Requires multiple frantic clicks/spaces to fill!)
  const handleTapPass = useCallback(
    (preferredTarget?: number) => {
      if (!isMatchActive || stats.isFlying || stats.isExploding) return;
      const currentHolder = players[stats.currentHolderIndex];
      if (!currentHolder || !currentHolder.isUser) return;

      if (
        preferredTarget !== undefined &&
        preferredTarget !== stats.currentHolderIndex &&
        players[preferredTarget]?.isAlive
      ) {
        preferredTargetRef.current = preferredTarget;
      }

      lastTapTimeRef.current = performance.now();

      // Tap adds boost based on sensitivity setting (approx 5-6 taps to 100%)
      const boost = 17 + (settings.sensitivity || 3) * 1.5;
      const nextCharge = Math.min(100, passChargeRef.current + boost);
      passChargeRef.current = nextCharge;
      setPassCharge(nextCharge);

      soundEngine.playTapCharge(nextCharge);

      // Once the bar is fully charged to 100%, execute the throw!
      if (nextCharge >= 100) {
        passChargeRef.current = 0;
        setPassCharge(0);
        soundEngine.stopSizzle();
        soundEngine.playPassWhoosh();

        const aliveIndices = players
          .map((p, idx) => (p.isAlive && !p.isUser ? idx : -1))
          .filter((idx) => idx !== -1);

        if (aliveIndices.length === 0) return;

        let targetIdx = aliveIndices[Math.floor(Math.random() * aliveIndices.length)];
        if (preferredTargetRef.current !== null && aliveIndices.includes(preferredTargetRef.current)) {
          targetIdx = preferredTargetRef.current;
        }
        preferredTargetRef.current = null;

        executeThrow(stats.currentHolderIndex, targetIdx);
      }
    },
    [isMatchActive, stats.isFlying, stats.isExploding, stats.currentHolderIndex, players, settings.sensitivity, executeThrow]
  );

  const handlePassDirection = useCallback(
    (direction: 'left' | 'right') => {
      if (!players[stats.currentHolderIndex]?.isUser) return;
      const total = players.length;
      const step = direction === 'right' ? 1 : -1;
      let nextIdx = (stats.currentHolderIndex + step + total) % total;

      while (!players[nextIdx].isAlive && nextIdx !== stats.currentHolderIndex) {
        nextIdx = (nextIdx + step + total) % total;
      }

      if (players[nextIdx].isAlive && nextIdx !== stats.currentHolderIndex) {
        preferredTargetRef.current = nextIdx;
        handleTapPass(nextIdx);
      } else {
        handleTapPass();
      }
    },
    [players, stats.currentHolderIndex, handleTapPass]
  );

  const triggerPlayerSpeech = (playerIndex: number, text: string) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === playerIndex ? { ...p, speechText: text, isSpeaking: true } : p))
    );
    setTimeout(() => {
      setPlayers((prev) =>
        prev.map((p, idx) =>
          idx === playerIndex ? { ...p, speechText: undefined, isSpeaking: false } : p
        )
      );
    }, 1500);
  };

  // Frantic Audio Loop with Pass Bar Rapid Decay
  useEffect(() => {
    if (!isMatchActive) return;

    let animId: number;
    let lastStamp = performance.now();

    const loop = (stamp: number) => {
      const delta = stamp - lastStamp;
      lastStamp = stamp;

      const r = roundTimerRef.current;
      r.remainingMs -= delta;

      // Handle Pass Bar Rapid Decay if user holds potato
      const currentHolder = players[stats.currentHolderIndex];
      if (currentHolder?.isUser && !stats.isFlying && !stats.isExploding) {
        const timeSinceTap = performance.now() - lastTapTimeRef.current;
        // If user stopped clicking for > 130ms, rapidly drain down (~48% per second)
        if (timeSinceTap > 130 && passChargeRef.current > 0) {
          const drain = (delta / 1000) * 48;
          passChargeRef.current = Math.max(0, passChargeRef.current - drain);
          setPassCharge(passChargeRef.current);
        }
      } else {
        if (passChargeRef.current > 0) {
          passChargeRef.current = 0;
          setPassCharge(0);
        }
      }

      const panic = Math.max(0, Math.min(1, 1 - r.remainingMs / r.totalMs));
      let targetBpm = Math.floor(100 + Math.pow(panic, 1.7) * 170);

      if (r.remainingMs <= r.nextSuddenAccelMs && r.remainingMs > 2000) {
        targetBpm += 55;
        r.nextSuddenAccelMs = -1;
        setIsSuddenAcceleration(true);
        soundEngine.playAccelerationAlarm();
        setTimeout(() => setIsSuddenAcceleration(false), 2000);
      }

      r.currentBpm = targetBpm;
      soundEngine.updateTensionBpm(targetBpm);

      setStats((prev) => ({
        ...prev,
        panicProgress: panic,
        accelerationBpm: targetBpm,
      }));

      if (r.remainingMs <= 0 && !stats.isExploding) {
        handleExplosion();
        return;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isMatchActive, stats.isExploding, stats.currentHolderIndex, stats.isFlying, players]);

  // Handle Explosion
  const handleExplosion = useCallback(() => {
    soundEngine.playExplosion();
    soundEngine.stopTensionMusic();

    const explodedIdx = stats.currentHolderIndex;
    const explodedPlayer = players[explodedIdx];

    // Select explosion effect:
    // If the user exploded, ALWAYS show the user's equipped explosion!
    // If a bot exploded, select a unique themed explosion from the 22 available
    let explosionToUse = profile.equippedExplosion || 'exp_classic';
    if (!explodedPlayer?.isUser) {
      const allExpIds = EXPLOSION_EFFECTS.map((e) => e.id);
      explosionToUse = allExpIds[(explodedIdx * 3) % allExpIds.length] || 'exp_classic';
    }
    setCurrentRoundExplosionId(explosionToUse);

    passChargeRef.current = 0;
    setPassCharge(0);

    setStats((prev) => ({
      ...prev,
      isExploding: true,
      lastExplodedPlayerId: explodedPlayer?.id || null,
    }));

    if (botPassTimerRef.current) clearTimeout(botPassTimerRef.current);

    setPlayers((prev) => {
      const currentAlive = prev.filter((p) => p.isAlive).length;
      const updated = prev.map((p, idx) =>
        idx === explodedIdx
          ? { ...p, isAlive: false, eliminationRank: currentAlive }
          : p
      );

      const remainingAlive = updated.filter((p) => p.isAlive);

      if (explodedPlayer?.isUser) {
        setUserRank(currentAlive);
      }

      setTimeout(() => {
        if (remainingAlive.length <= 1) {
          handleMatchEnd(remainingAlive[0] || null);
        } else {
          startNewRound(stats.roundNumber + 1, updated);
        }
      }, 2000);

      return updated;
    });
  }, [stats.currentHolderIndex, stats.roundNumber, players, profile.equippedExplosion, startNewRound]);

  // Handle Match End
  const handleMatchEnd = useCallback(
    (winner: Player | null) => {
      setIsMatchActive(false);
      soundEngine.stopTensionMusic();

      const isUserWin = winner ? winner.isUser : false;
      const gainedCoins = isUserWin ? 350 : 50 + stats.roundNumber * 15;
      const gainedXp = isUserWin ? 380 : 90 + stats.roundNumber * 30;

      setEndCoins(gainedCoins);
      setEndXp(gainedXp);

      addPlayerXpAndCoins(gainedXp, gainedCoins);
      updateMissionProgress('play_matches', 1);

      if (isUserWin || (userRank && userRank <= 3)) {
        updateMissionProgress('survive_top', 1);
      }

      setProfile((prev) => {
        const upd: UserProfile = {
          ...prev,
          matchesPlayed: prev.matchesPlayed + 1,
          victories: isUserWin ? prev.victories + 1 : prev.victories,
          explosionsSurvived: prev.explosionsSurvived + stats.roundNumber,
          winStreak: isUserWin ? prev.winStreak + 1 : 0,
          highestStreak: isUserWin ? Math.max(prev.highestStreak, prev.winStreak + 1) : prev.highestStreak,
        };
        StorageService.saveProfile(upd);
        return upd;
      });

      setStats((prev) => ({
        ...prev,
        winnerPlayer: winner,
      }));

      setIsVictoryModalOpen(true);
    },
    [stats.roundNumber, userRank, addPlayerXpAndCoins, updateMissionProgress]
  );

  const handleLeaveMatch = () => {
    soundEngine.stopTensionMusic();
    soundEngine.stopSizzle();
    if (botPassTimerRef.current) clearTimeout(botPassTimerRef.current);
    peerService.cleanup();
    setIsMatchActive(false);
    setViewState('menu');
  };

  const handleStartOfflineMatch = () => {
    const freshPlayers = initPlayers('offline', botDifficulty, profile);
    setPlayers(freshPlayers);
    setGameMode('offline');
    setViewState('battle');
    setIsMatchActive(true);
    setIsVictoryModalOpen(false);
    setUserRank(null);
    startNewRound(1, freshPlayers);
  };

  const handleStartLobbyMatch = (code: string) => {
    setCurrentRoomCode(code);
    const freshPlayers = initPlayers('online', botDifficulty, profile);
    setPlayers(freshPlayers);
    setGameMode('online');
    setViewState('battle');
    setIsMatchActive(true);
    setIsVictoryModalOpen(false);
    setUserRank(null);
    startNewRound(1, freshPlayers);
  };

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMatchActive) return;
      if (e.code === settings.passKey || (settings.passKey === 'Space' && e.code === 'Space')) {
        e.preventDefault();
        handleTapPass();
      } else if (e.code === 'ArrowLeft') {
        handlePassDirection('left');
      } else if (e.code === 'ArrowRight') {
        handlePassDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMatchActive, settings.passKey, handleTapPass, handlePassDirection]);

  // Periodic heartbeat sound if user holds potato
  useEffect(() => {
    const isUserHolding = players[stats.currentHolderIndex]?.isUser && !stats.isFlying && isMatchActive;
    if (isUserHolding) {
      soundEngine.playHeartbeatThump();
      heartbeatIntervalRef.current = window.setInterval(() => {
        soundEngine.playHeartbeatThump();
      }, 550);
    } else {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    }
    return () => {
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
    };
  }, [stats.currentHolderIndex, stats.isFlying, isMatchActive, players]);

  // Equipping Handlers (Instantly visually update!)
  const handleEquipSkin = (skinId: string) => {
    soundEngine.playClick();
    const updated = { ...profile, equippedSkin: skinId };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setPlayers((prev) =>
      prev.map((p) => (p.isUser ? { ...p, bombSkinId: skinId } : p))
    );
  };

  const handleEquipAccessory = (hatId: string) => {
    soundEngine.playClick();
    const updated = { ...profile, equippedHat: hatId };
    setProfile(updated);
    StorageService.saveProfile(updated);
    setPlayers((prev) =>
      prev.map((p) => (p.isUser ? { ...p, bombHatId: hatId } : p))
    );
  };

  const handleEquipTrail = (trailId: string) => {
    soundEngine.playClick();
    const updated = { ...profile, equippedTrail: trailId };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  const handleEquipExplosion = (expId: string) => {
    soundEngine.playClick();
    const updated = { ...profile, equippedExplosion: expId };
    setProfile(updated);
    StorageService.saveProfile(updated);
  };

  // Determine panic stage
  const getPanicStage = (progress: number): PotatoPanicStage => {
    if (progress < 0.35) return 'calm';
    if (progress < 0.65) return 'warm';
    if (progress < 0.85) return 'hot';
    return 'critical';
  };

  const currentHolder = players[stats.currentHolderIndex];
  const canUserPass = currentHolder?.isUser && !stats.isFlying && isMatchActive;

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-white flex flex-col items-center justify-between p-2 sm:p-4 md:p-6 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#ea580c_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-orange-600/15 blur-[140px] rounded-full pointer-events-none transition-all duration-500"
        style={{
          opacity: stats.panicProgress > 0.6 ? 0.45 : 0.2,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col flex-1 items-center justify-between">
        {/* Game HUD Top Bar */}
        <GameHUD
          stats={stats}
          players={players}
          mode={gameMode}
          botDifficulty={botDifficulty}
          coins={profile.coins}
          level={profile.level}
          currentXp={profile.currentXp}
          isMuted={isMuted}
          onToggleMute={() => {
            const muted = soundEngine.toggleMute();
            setIsMuted(muted);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenShop={() => setIsShopOpen(true)}
          onOpenBattlePass={() => setIsBattlePassOpen(true)}
          onOpenAccount={() => setIsAccountOpen(true)}
          onPassPotato={() => handleTapPass()}
          onPassDirection={handlePassDirection}
          canUserPass={canUserPass}
          passKey={settings.passKey}
          isSuddenAcceleration={isSuddenAcceleration}
          onLeaveMatch={handleLeaveMatch}
          isGameActive={viewState === 'battle'}
        />

        {/* 1. MAIN MENU VIEW */}
        {viewState === 'menu' && (
          <div className="my-auto w-full max-w-lg p-5 sm:p-8 rounded-3xl bg-slate-900/95 border-2 border-orange-500/50 shadow-2xl shadow-orange-950/70 backdrop-blur-xl text-center flex flex-col items-center animate-fadeIn">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-400 text-xs font-arcade tracking-wider uppercase mb-3">
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span>10 Minibombas • PeerJS WebRTC P2P</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-arcade tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 drop-shadow">
              PATATA ROYALE
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-sm">
              ¡Pásala antes de que estalle tu silla! Escucha el pip-pip acelerado y juega con amigos directamente por WebRTC con código de 4 cifras.
            </p>

            {/* Quick Actions Row */}
            <div className="w-full flex items-center justify-center gap-2 my-4">
              <button
                onClick={() => setIsBattlePassOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:bg-amber-500/30 border border-amber-400/40 rounded-xl text-xs font-bold text-yellow-300 transition-all cursor-pointer shadow"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Pase Nv.{profile.level}</span>
              </button>

              <button
                onClick={() => setIsShopOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 hover:bg-orange-500/30 border border-orange-400/40 rounded-xl text-xs font-bold text-orange-300 transition-all cursor-pointer shadow"
              >
                <ShoppingBag className="w-4 h-4 text-orange-400" />
                <span>Tienda (+80 Ítems)</span>
              </button>

              <button
                onClick={() => setIsAccountOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 rounded-xl text-xs font-bold text-cyan-300 transition-all cursor-pointer shadow"
              >
                <User className="w-4 h-4 text-cyan-400" />
                <span>{account.isLoggedIn ? 'Mi Cuenta' : 'Entrar'}</span>
              </button>
            </div>

            {/* Offline vs PeerJS P2P Rooms */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <button
                onClick={handleStartOfflineMatch}
                className="p-4 rounded-2xl bg-gradient-to-b from-amber-600/30 to-amber-950/40 border-2 border-amber-500/50 hover:border-amber-400 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-300 mb-2 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-sm font-arcade text-white">MODO OFFLINE</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Partida rápida contra 9 bots ({botDifficulty.toUpperCase()})
                </div>
              </button>

              <button
                onClick={() => {
                  soundEngine.playClick();
                  setViewState('lobby');
                }}
                className="p-4 rounded-2xl bg-gradient-to-b from-orange-600/30 to-red-950/40 border-2 border-orange-500/50 hover:border-orange-400 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-300 mb-2 group-hover:scale-110 transition-transform">
                  <KeyRound className="w-6 h-6" />
                </div>
                <div className="text-sm font-arcade text-white">SALA P2P (4 CIFRAS)</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Conexión directa WebRTC PeerJS con tu amigo
                </div>
              </button>
            </div>

            {/* Offline Bot Difficulty Selector */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                <span>Dificultad de los Bots:</span>
                <span className="text-amber-400 uppercase font-black">{botDifficulty}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {(['facil', 'normal', 'dificil', 'extrema'] as BotDifficulty[]).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => {
                      soundEngine.playClick();
                      setBotDifficulty(diff);
                    }}
                    className={`py-2 px-1 text-center rounded-xl text-xs font-bold uppercase transition-all cursor-pointer ${
                      botDifficulty === diff
                        ? diff === 'extrema'
                          ? 'bg-red-600 text-white ring-2 ring-red-400 shadow-lg'
                          : 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-lg'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartOfflineMatch}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hover:from-red-500 hover:to-yellow-300 active:scale-95 text-slate-950 font-arcade text-lg rounded-2xl shadow-xl shadow-orange-600/40 border-2 border-yellow-300 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>¡JUGAR PARTIDA FRENÉTICA!</span>
            </button>
          </div>
        )}

        {/* 2. PEERJS WEBRTC LOBBY VIEW */}
        {viewState === 'lobby' && (
          <LobbyRoom
            profile={profile}
            onStartMatch={handleStartLobbyMatch}
            onBackToMenu={() => setViewState('menu')}
          />
        )}

        {/* 3. ACTIVE BATTLE VIEW */}
        {viewState === 'battle' && (
          <main className="w-full my-auto flex flex-col items-center animate-fadeIn">
            <PotatoArena
              players={players}
              currentHolderIndex={stats.currentHolderIndex}
              targetHolderIndex={stats.targetHolderIndex}
              potatoProgress={stats.potatoProgress}
              isFlying={stats.isFlying}
              panicProgress={stats.panicProgress}
              stage={getPanicStage(stats.panicProgress)}
              skin={{
                id: 'spud_toy',
                name: 'Toy Story Potato',
                description: 'Classic Spud',
                price: 0,
                unlocked: true,
                rarity: 'comun',
                colors: { primary: '#d97706', secondary: '#b45309', flame: '#ef4444', glow: 'rgba(249, 115, 22, 0.8)' },
              }}
              trailCosmetic={{
                id: equippedTrailItem.id,
                name: equippedTrailItem.name,
                description: equippedTrailItem.description,
                price: equippedTrailItem.price,
                unlocked: equippedTrailItem.unlocked,
                rarity: equippedTrailItem.rarity,
                type: 'trail',
                previewColor: equippedTrailItem.previewColor,
              }}
              onPassToPlayer={(idx) => handleTapPass(idx)}
              canUserPass={canUserPass}
              screenShake={settings.screenShake}
              isExploding={stats.isExploding}
              explodedPlayerIndex={
                stats.lastExplodedPlayerId
                  ? players.findIndex((p) => p.id === stats.lastExplodedPlayerId)
                  : null
              }
              explosionId={
                stats.lastExplodedPlayerId === players[0]?.id
                  ? profile.equippedExplosion || 'exp_classic'
                  : currentRoundExplosionId || profile.equippedExplosion || 'exp_classic'
              }
              passCharge={passCharge}
              onTapPass={handleTapPass}
              passKey={settings.passKey}
              particlesEnabled={settings.particles !== 'off' && settings.particles !== 'low'}
            />
          </main>
        )}

        {/* Bottom Voice Chat & Reactions Panel */}
        <footer className="w-full mt-2">
          <VoiceChatPanel
            players={players}
            isOnline={gameMode === 'online'}
            onSendQuickVoice={(text) => {
              const userIdx = players.findIndex((p) => p.isUser);
              if (userIdx >= 0) {
                triggerPlayerSpeech(userIdx, text);
              }
            }}
            isMuted={isMuted}
          />
        </footer>
      </div>

      {/* MODALS */}
      {/* 1. Shop Modal with 22+ items per tab */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        profile={profile}
        skins={skins}
        accessories={accessories}
        trails={trails}
        explosions={explosions}
        onBuySkin={(skinId) => {
          const skin = skins.find((s) => s.id === skinId);
          if (!skin || profile.coins < skin.price) return;
          soundEngine.playCoin();
          const updProf = { ...profile, coins: profile.coins - skin.price };
          const updSkins = skins.map((s) => (s.id === skinId ? { ...s, unlocked: true } : s));
          setProfile(updProf);
          setSkins(updSkins);
          StorageService.saveProfile(updProf);
          StorageService.saveSkins(updSkins);
        }}
        onEquipSkin={handleEquipSkin}
        onBuyAccessory={(accId) => {
          const acc = accessories.find((a) => a.id === accId);
          if (!acc || profile.coins < acc.price) return;
          soundEngine.playCoin();
          const updProf = { ...profile, coins: profile.coins - acc.price };
          const updAccs = accessories.map((a) => (a.id === accId ? { ...a, unlocked: true } : a));
          setProfile(updProf);
          setAccessories(updAccs);
          StorageService.saveProfile(updProf);
          StorageService.saveAccessories(updAccs);
        }}
        onEquipAccessory={handleEquipAccessory}
        onBuyTrail={(trailId) => {
          const t = trails.find((x) => x.id === trailId);
          if (!t || profile.coins < t.price) return;
          soundEngine.playCoin();
          const updProf = { ...profile, coins: profile.coins - t.price };
          const updTrails = trails.map((x) => (x.id === trailId ? { ...x, unlocked: true } : x));
          setProfile(updProf);
          setTrails(updTrails);
          StorageService.saveProfile(updProf);
          StorageService.saveTrails(updTrails);
        }}
        onEquipTrail={handleEquipTrail}
        onBuyExplosion={(expId) => {
          const ex = explosions.find((x) => x.id === expId);
          if (!ex || profile.coins < ex.price) return;
          soundEngine.playCoin();
          const updProf = { ...profile, coins: profile.coins - ex.price, equippedExplosion: expId };
          const updExps = explosions.map((x) => (x.id === expId ? { ...x, unlocked: true } : x));
          setProfile(updProf);
          setExplosions(updExps);
          StorageService.saveProfile(updProf);
          StorageService.saveExplosions(updExps);
        }}
        onEquipExplosion={handleEquipExplosion}
      />

      {/* 2. Battle Pass & Daily Missions */}
      <BattlePassModal
        isOpen={isBattlePassOpen}
        onClose={() => setIsBattlePassOpen(false)}
        profile={profile}
        missions={missions}
        onClaimMission={handleClaimMission}
        onClaimPassTier={handleClaimPassTier}
      />

      {/* 3. Account Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        account={account}
        profile={profile}
        onUpdateAccount={(acc, newUsername) => {
          setAccount(acc);
          StorageService.saveAccount(acc);
          if (newUsername) {
            const updatedProfile = { ...profile, name: newUsername };
            setProfile(updatedProfile);
            StorageService.saveProfile(updatedProfile);
          }
        }}
      />

      {/* 4. Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        entries={[
          { rank: 1, id: '1', name: 'IgnisKing_ES', avatar: '👑', title: 'Sobreviviente Legendario', level: 98, wins: 182, winRate: 74, country: '🇪🇸' },
          { rank: 2, id: '2', name: 'TokyoDriftSpud', avatar: '⚡', title: 'Reflejos Ninja', level: 85, wins: 154, winRate: 69, country: '🇯🇵' },
          { rank: 3, id: '3', name: 'LavaMaster_MX', avatar: '🌶️', title: 'Pirotécnico Supremo', level: 76, wins: 138, winRate: 65, country: '🇲🇽' },
          { rank: 4, id: 'user', name: profile.name, avatar: '💣', title: profile.title, level: profile.level, wins: profile.victories, winRate: profile.matchesPlayed > 0 ? Math.round((profile.victories / profile.matchesPlayed) * 100) : 0, country: '🇪🇸', isUser: true },
          { rank: 5, id: '5', name: 'Bombastic_BR', avatar: '💣', title: 'Rey del Sartenazo', level: 64, wins: 110, winRate: 59, country: '🇧🇷' },
        ]}
        userName={profile.name}
      />

      {/* 5. Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onUpdateProfile={(updated) => {
          setProfile(updated);
          StorageService.saveProfile(updated);
        }}
      />

      {/* 6. Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => {
          setSettings(newSettings);
          StorageService.saveSettings(newSettings);
        }}
        botDifficulty={botDifficulty}
        onChangeBotDifficulty={(diff) => setBotDifficulty(diff)}
      />

      {/* 7. Victory Podium Modal */}
      <VictoryPodiumModal
        isOpen={isVictoryModalOpen}
        winner={stats.winnerPlayer}
        isUserWinner={stats.winnerPlayer?.isUser ?? false}
        userRank={userRank}
        coinsEarned={endCoins}
        xpEarned={endXp}
        userLevel={profile.level}
        didLevelUp={didLevelUp}
        onPlayAgain={gameMode === 'offline' ? handleStartOfflineMatch : () => setViewState('lobby')}
        onOpenShop={() => {
          setIsVictoryModalOpen(false);
          setIsShopOpen(true);
        }}
        onOpenLeaderboard={() => {
          setIsVictoryModalOpen(false);
          setIsLeaderboardOpen(true);
        }}
      />
    </div>
  );
}

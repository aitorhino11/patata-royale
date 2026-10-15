export type GameMode = 'offline' | 'online';

export type BotDifficulty = 'facil' | 'normal' | 'dificil' | 'extrema';

export type PotatoPanicStage = 'calm' | 'warm' | 'hot' | 'critical';

export interface PotatoSkin {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  colors: {
    primary: string;
    secondary: string;
    flame: string;
    glow: string;
  };
}

export interface CosmeticItem {
  id: string;
  type?: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  previewColor?: string;
}

export interface BombSkin {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  bodyGrad: [string, string, string, string];
  accent: string;
  glow?: string;
  battlePassLevel?: number; // If unlocked via Battle Pass
}

export interface BombAccessory {
  id: string;
  name: string;
  description: string;
  category: 'hat' | 'face' | 'ears';
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  renderKey: string;
  icon: string;
}

export interface TrailEffect {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  previewColor: string;
  icon: string;
}

export interface ExplosionEffect {
  id: string;
  name: string;
  description: string;
  price: number;
  unlocked: boolean;
  rarity: 'comun' | 'raro' | 'epico' | 'legendario';
  previewColor: string;
  icon: string;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  title: string;
  isBot: boolean;
  botDifficulty?: BotDifficulty;
  isAlive: boolean;
  isUser: boolean;
  isSpeaking: boolean;
  speechText?: string;
  country: string;
  ping?: number;
  eliminationRank?: number;
  bombSkinId: string;
  bombHatId: string;
  level: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  rewardXp: number;
  rewardCoins: number;
  isClaimed: boolean;
  type: 'play_matches' | 'pass_potato' | 'survive_top';
}

export interface BattlePassTier {
  level: number;
  requiredXp: number;
  rewardType: 'coins' | 'skin' | 'hat' | 'trail';
  rewardAmount?: number;
  rewardSkinId?: string;
  rewardName: string;
  isClaimed: boolean;
}

export interface UserAccount {
  id: string;
  username: string;
  email?: string;
  isGoogle: boolean;
  isLoggedIn: boolean;
}

export interface GameSettings {
  masterVolume: number;
  sfxVolume: number;
  musicVolume: number;
  screenShake: 'off' | 'subtle' | 'extreme';
  particles: 'off' | 'low' | 'medium' | 'epic';
  passKey: string;
  sensitivity: number; // 1 to 5
  voiceChatEnabled: boolean;
  micMuted: boolean;
  autoPassOnCatch: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  avatar: string;
  coins: number;
  level: number;
  currentXp: number;
  equippedSkin: string;
  equippedHat: string;
  equippedTrail: string;
  equippedExplosion: string;
  matchesPlayed: number;
  victories: number;
  explosionsSurvived: number;
  totalPasses: number;
  winStreak: number;
  highestStreak: number;
  claimedPassTiers: number[];
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  title: string;
  level: number;
  wins: number;
  winRate: number;
  country: string;
  isUser?: boolean;
}

export interface MatchStats {
  roundNumber: number;
  aliveCount: number;
  currentHolderIndex: number;
  targetHolderIndex: number | null;
  potatoProgress: number;
  isFlying: boolean;
  panicProgress: number;
  accelerationBpm: number;
  roundTimeRemaining: number;
  totalRoundDuration: number;
  isExploding: boolean;
  lastExplodedPlayerId: string | null;
  winnerPlayer: Player | null;
}

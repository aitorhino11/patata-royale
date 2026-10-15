import React, { useState } from 'react';
import { X, ShoppingBag, Check, Sparkles, Flame, Zap, ShieldCheck } from 'lucide-react';
import { BombAccessory, BombSkin, ExplosionEffect, TrailEffect, UserProfile } from '../types/game';
import { BombCharacter } from './BombCharacter';
import { ExplosionVfx } from './ExplosionVfx';
import { soundEngine } from '../services/soundEngine';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  skins: BombSkin[];
  accessories: BombAccessory[];
  trails: TrailEffect[];
  explosions: ExplosionEffect[];
  onBuySkin: (skinId: string) => void;
  onEquipSkin: (skinId: string) => void;
  onBuyAccessory: (accId: string) => void;
  onEquipAccessory: (accId: string) => void;
  onBuyTrail: (trailId: string) => void;
  onEquipTrail: (trailId: string) => void;
  onBuyExplosion: (expId: string) => void;
  onEquipExplosion: (expId: string) => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  profile,
  skins,
  accessories,
  trails,
  explosions,
  onBuySkin,
  onEquipSkin,
  onBuyAccessory,
  onEquipAccessory,
  onBuyTrail,
  onEquipTrail,
  onBuyExplosion,
  onEquipExplosion,
}) => {
  const [activeTab, setActiveTab] = useState<'skins' | 'hats' | 'trails' | 'explosions'>('skins');
  const [previewSkinId, setPreviewSkinId] = useState(profile.equippedSkin);
  const [previewHatId, setPreviewHatId] = useState(profile.equippedHat);
  const [previewExplosionId, setPreviewExplosionId] = useState(profile.equippedExplosion);
  const [isExplodingPreview, setIsExplodingPreview] = useState(false);

  if (!isOpen) return null;

  const currentPreviewSkin = skins.find((s) => s.id === previewSkinId) || skins[0];
  const currentPreviewHat = accessories.find((h) => h.id === previewHatId) || accessories[0];

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendario':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'epico':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'raro':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border-2 border-orange-500/50 rounded-3xl shadow-2xl shadow-orange-950/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-arcade text-white tracking-wide">
                Tienda de Cosméticos Exclusiva
              </h2>
              <p className="text-xs text-slate-400">
                Más de 80 artículos: aspecto de bomba, sombreros, estelas y explosiones
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/20 border border-yellow-400/40 rounded-2xl shadow-inner">
              <span className="text-base">🪙</span>
              <span className="font-arcade text-yellow-300 text-sm md:text-base">
                {profile.coins}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="px-5 pt-3 pb-2 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/30 border-b border-slate-800 flex items-center justify-between">
          {activeTab === 'explosions' ? (
            <div className="flex items-center gap-4 w-full justify-between">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-24 flex items-center justify-center p-1 rounded-2xl bg-slate-950/80 border border-orange-500/30 shadow-inner overflow-hidden">
                  {isExplodingPreview ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ExplosionVfx explosionId={previewExplosionId} size={140} />
                    </div>
                  ) : (
                    <div className="text-4xl animate-bounce">
                      {explosions.find((e) => e.id === previewExplosionId)?.icon || '💥'}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    EXPLOSIÓN SELECCIONADA
                  </div>
                  <div className="text-base font-arcade text-yellow-300">
                    {explosions.find((e) => e.id === previewExplosionId)?.name || 'Detonación'}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {explosions.find((e) => e.id === previewExplosionId)?.description}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEngine.playExplosion();
                    setIsExplodingPreview(true);
                    setTimeout(() => setIsExplodingPreview(false), 1400);
                  }}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-arcade text-xs rounded-xl shadow cursor-pointer active:scale-95"
                >
                  💥 PROBAR EXPLOSIÓN
                </button>
                {profile.equippedExplosion !== previewExplosionId && (
                  <button
                    onClick={() => onEquipExplosion(previewExplosionId)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-arcade text-xs rounded-xl shadow cursor-pointer active:scale-95"
                  >
                    EQUIPAR
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <div className="w-20 h-24 flex items-center justify-center p-1 rounded-2xl bg-slate-950/80 border border-orange-500/30 shadow-inner">
                  <BombCharacter
                    player={{
                      id: 'preview_player',
                      name: profile.name,
                      avatar: '💣',
                      title: profile.title,
                      isBot: false,
                      isAlive: true,
                      isUser: true,
                      isSpeaking: false,
                      country: '🇪🇸',
                      bombSkinId: previewSkinId,
                      bombHatId: previewHatId,
                      level: profile.level,
                    }}
                    isHolder={false}
                    isTarget={false}
                    isUser={true}
                    panicProgress={0.2}
                    canUserPass={false}
                    index={0}
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                    VISTA PREVIA EQUIPADA
                  </div>
                  <div className="text-base font-arcade text-yellow-300">
                    {currentPreviewSkin.name}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <span>Accesorio:</span>
                    <span className="font-bold text-amber-400">{currentPreviewHat.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {profile.equippedSkin !== previewSkinId && (
                  <button
                    onClick={() => onEquipSkin(previewSkinId)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-arcade text-xs rounded-xl shadow cursor-pointer"
                  >
                    EQUIPAR SKIN
                  </button>
                )}
                {profile.equippedHat !== previewHatId && (
                  <button
                    onClick={() => onEquipAccessory(previewHatId)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-arcade text-xs rounded-xl shadow cursor-pointer"
                  >
                    EQUIPAR SOMBRERO
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 pt-2 border-b border-slate-800 bg-slate-950/40 overflow-x-auto">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('skins');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'skins'
                ? 'border-orange-500 text-orange-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💣 Skins de Bomba ({skins.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('hats');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'hats'
                ? 'border-orange-500 text-orange-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            👑 Sombreros ({accessories.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('trails');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'trails'
                ? 'border-orange-500 text-orange-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ✨ Estelas ({trails.length})
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('explosions');
            }}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'explosions'
                ? 'border-orange-500 text-orange-400 font-extrabold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💥 Explosiones ({explosions.length})
          </button>
        </div>

        {/* Catalog Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* SKINS TAB */}
          {activeTab === 'skins' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {skins.map((skin) => {
                const isEquipped = profile.equippedSkin === skin.id;
                const isSelected = previewSkinId === skin.id;

                return (
                  <div
                    key={skin.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setPreviewSkinId(skin.id);
                    }}
                    className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-950/30 ring-2 ring-orange-500/40 shadow-lg'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${getRarityBadge(
                          skin.rarity
                        )}`}
                      >
                        {skin.rarity}
                      </span>
                      {isEquipped && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Usando
                        </span>
                      )}
                    </div>

                    <div className="my-2 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full border-2 shadow-inner"
                        style={{
                          background: `radial-gradient(circle at 35% 30%, ${skin.bodyGrad[0]}, ${skin.bodyGrad[1]}, ${skin.bodyGrad[2]}, ${skin.bodyGrad[3]})`,
                          borderColor: skin.accent,
                          boxShadow: skin.glow ? `0 0 14px ${skin.glow}` : undefined,
                        }}
                      />
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-arcade text-white truncate">{skin.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {skin.description}
                      </div>

                      <div className="mt-2">
                        {skin.unlocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEquipSkin(skin.id);
                              setPreviewSkinId(skin.id);
                            }}
                            className={`w-full py-1 text-[11px] font-bold rounded-lg transition-all ${
                              isEquipped
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-orange-600 hover:bg-orange-500 text-white'
                            }`}
                          >
                            {isEquipped ? 'Equipado' : 'Equipar'}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onBuySkin(skin.id);
                            }}
                            disabled={profile.coins < skin.price}
                            className={`w-full py-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                              profile.coins >= skin.price
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>Comprar</span>
                            <span>{skin.price} 🪙</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* HATS & ACCESSORIES TAB */}
          {activeTab === 'hats' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {accessories.map((item) => {
                const isEquipped = profile.equippedHat === item.id;
                const isSelected = previewHatId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setPreviewHatId(item.id);
                    }}
                    className={`relative p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-yellow-400 bg-amber-950/30 ring-2 ring-yellow-400/40 shadow-lg'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${getRarityBadge(
                          item.rarity
                        )}`}
                      >
                        {item.rarity}
                      </span>
                      {isEquipped && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Usando
                        </span>
                      )}
                    </div>

                    <div className="my-2 flex items-center justify-center text-3xl">
                      {item.icon}
                    </div>

                    <div className="text-center">
                      <div className="text-xs font-arcade text-white truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {item.description}
                      </div>

                      <div className="mt-2">
                        {item.unlocked ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEquipAccessory(item.id);
                              setPreviewHatId(item.id);
                            }}
                            className={`w-full py-1 text-[11px] font-bold rounded-lg transition-all ${
                              isEquipped
                                ? 'bg-slate-800 text-slate-400'
                                : 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                            }`}
                          >
                            {isEquipped ? 'Equipado' : 'Equipar'}
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onBuyAccessory(item.id);
                            }}
                            disabled={profile.coins < item.price}
                            className={`w-full py-1 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                              profile.coins >= item.price
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            <span>Comprar</span>
                            <span>{item.price} 🪙</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TRAILS TAB */}
          {activeTab === 'trails' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {trails.map((item) => {
                const isEquipped = profile.equippedTrail === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                        style={{
                          backgroundColor: `${item.previewColor}25`,
                          border: `2px solid ${item.previewColor}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-arcade text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.description}</div>
                      </div>
                    </div>

                    <div>
                      {item.unlocked ? (
                        <button
                          onClick={() => onEquipTrail(item.id)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                            isEquipped
                              ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
                              : 'bg-slate-800 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {isEquipped ? 'Equipado' : 'Equipar'}
                        </button>
                      ) : (
                        <button
                          onClick={() => onBuyTrail(item.id)}
                          disabled={profile.coins < item.price}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 ${
                            profile.coins >= item.price
                              ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>{item.price} 🪙</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* EXPLOSIONS TAB */}
          {activeTab === 'explosions' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {explosions.map((item) => {
                const isEquipped = profile.equippedExplosion === item.id;
                const isSelected = previewExplosionId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setPreviewExplosionId(item.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-yellow-400 bg-amber-950/40 ring-2 ring-yellow-400/40 shadow-lg'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow"
                        style={{
                          backgroundColor: `${item.previewColor}25`,
                          border: `2px solid ${item.previewColor}`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="text-xs font-arcade text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.description}</div>
                      </div>
                    </div>

                    <div>
                      {item.unlocked ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEquipExplosion(item.id);
                            setPreviewExplosionId(item.id);
                          }}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                            isEquipped
                              ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-500/50'
                              : 'bg-orange-600 hover:bg-orange-500 text-white'
                          }`}
                        >
                          {isEquipped ? 'Equipado' : 'Equipar'}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyExplosion(item.id);
                            setPreviewExplosionId(item.id);
                          }}
                          disabled={profile.coins < item.price}
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                            profile.coins >= item.price
                              ? 'bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <span>{item.price} 🪙</span>
                        </button>
                      )}
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

import React from 'react';
import { PlayerStats, VampireProfile, ScreenId } from '../types';
import {
  Compass,
  Users,
  Package,
  Moon,
  Sparkles,
  Bed,
  Sun,
  Gift,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface HomeScreenProps {
  stats: PlayerStats;
  profile: VampireProfile;
  onNavigate: (screen: ScreenId) => void;
  onSleep: () => void;
  onOpenMysteryBox: () => void;
  mysteryBoxAvailable: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  stats,
  profile,
  onNavigate,
  onSleep,
  onOpenMysteryBox,
  mysteryBoxAvailable
}) => {
  const isNight = stats.timeOfDay === 'night';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* Top Banner with Character Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#21163b] via-[#1a1130] to-[#140b24] border-2 border-purple-600/40 shadow-2xl flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-900 to-indigo-700 border-2 border-purple-400 flex items-center justify-center text-4xl shadow-lg">
              🧛
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-black/80 border border-purple-400 text-[10px] font-bold text-amber-300">
              🦇 {profile.petBatName || 'Pippin'}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">{profile.name}</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/50 text-purple-300 font-semibold">
                Screen #6
              </span>
            </div>
            <div className="text-xs text-purple-300 mt-0.5">
              Young Vampire Student • {profile.outfit}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-950 border border-purple-700 font-bold text-amber-300">
                Night {stats.night} of 100
              </span>
              <span className={`text-xs px-2.5 py-1 rounded-xl font-bold ${isNight ? 'bg-indigo-950 border border-indigo-700 text-indigo-300' : 'bg-amber-950 border border-amber-700 text-amber-300'}`}>
                {isNight ? '🌙 Night Explorer' : '☀️ School Day'}
              </span>
            </div>
          </div>
        </div>

        {/* Daily Mystery Box Reward */}
        <div>
          <button
            onClick={() => {
              sounds.playAchievement();
              onOpenMysteryBox();
            }}
            className={`px-4 py-3 rounded-2xl border flex items-center gap-2.5 shadow-lg transition-transform active:scale-95 ${
              mysteryBoxAvailable
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border-amber-300 text-white animate-pulse'
                : 'bg-purple-950/60 border-purple-800 text-purple-400 opacity-60'
            }`}
          >
            <Gift className="w-5 h-5 text-amber-200" />
            <div className="text-left">
              <div className="text-xs font-bold">Daily Mystery Box</div>
              <div className="text-[10px]">{mysteryBoxAvailable ? 'Tap to open!' : 'Opened today'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4 Simple Status Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Hunger */}
        <div className="p-3.5 rounded-2xl bg-[#1b142e] border border-purple-800/40">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-red-300 flex items-center gap-1">🩸 Hunger</span>
            <span className="text-xs font-mono">{stats.hunger}%</span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${stats.hunger > 60 ? 'bg-red-500 animate-pulse' : 'bg-pink-500'}`}
              style={{ width: `${stats.hunger}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400 mt-1">
            {stats.hunger < 30 ? 'Satisfied 😊' : stats.hunger < 70 ? 'Getting thirsty 🍓' : 'Needs sweet berry juice!'}
          </div>
        </div>

        {/* Secrecy */}
        <div className="p-3.5 rounded-2xl bg-[#1b142e] border border-purple-800/40">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-amber-300 flex items-center gap-1">🕵️ Secrecy</span>
            <span className="text-xs font-mono">{stats.secrecy}%</span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all"
              style={{ width: `${stats.secrecy}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400 mt-1">
            {stats.secrecy > 60 ? 'Identity completely safe 🕶️' : 'People are suspicious!'}
          </div>
        </div>

        {/* Energy */}
        <div className="p-3.5 rounded-2xl bg-[#1b142e] border border-purple-800/40">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-blue-300 flex items-center gap-1">⚡ Energy</span>
            <span className="text-xs font-mono">{stats.energy}%</span>
          </div>
          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
              style={{ width: `${stats.energy}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400 mt-1">
            Powers Bat Form & Speed
          </div>
        </div>

        {/* Coins */}
        <div className="p-3.5 rounded-2xl bg-[#1b142e] border border-purple-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs mb-1 font-bold">
            <span className="text-amber-300 flex items-center gap-1">🪙 Gold Coins</span>
            <span className="text-sm font-bold text-amber-300">{stats.coins}</span>
          </div>
          <div className="text-[10px] text-purple-400">
            For Luna's shop & school treats
          </div>
        </div>
      </div>

      {/* Primary 4 Action Buttons as requested: Explore | Friends | Inventory | Sleep */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Explore */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate(isNight ? 'night_map' : 'day_map');
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-purple-700 to-indigo-800 hover:from-purple-600 hover:to-indigo-700 border-2 border-purple-400 text-white shadow-xl flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🗺️
          </div>
          <span className="text-sm font-bold tracking-wide">
            {isNight ? 'Night Map' : 'Day Map'}
          </span>
          <span className="text-[10px] text-purple-200 opacity-80">Explore the Town</span>
        </button>

        {/* Friends */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('friendship');
          }}
          className="p-5 rounded-3xl bg-[#201538] hover:bg-[#2c1d4d] border border-purple-700 text-purple-200 shadow-xl flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-pink-950/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            ❤️
          </div>
          <span className="text-sm font-bold tracking-wide text-white">Friends</span>
          <span className="text-[10px] text-purple-300 opacity-80">Maya, Leo, Luna</span>
        </button>

        {/* Inventory */}
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('inventory');
          }}
          className="p-5 rounded-3xl bg-[#201538] hover:bg-[#2c1d4d] border border-purple-700 text-purple-200 shadow-xl flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue-950/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🎒
          </div>
          <span className="text-sm font-bold tracking-wide text-white">Inventory</span>
          <span className="text-[10px] text-purple-300 opacity-80">Crystals & Treats</span>
        </button>

        {/* Sleep / Rest */}
        <button
          onClick={() => {
            sounds.playDoor();
            onSleep();
          }}
          className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-950 hover:from-indigo-800 hover:to-purple-900 border border-indigo-500/50 text-indigo-200 shadow-xl flex flex-col items-center gap-2 group transition-transform active:scale-95 cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-indigo-900/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            🛌
          </div>
          <span className="text-sm font-bold tracking-wide text-white">
            {isNight ? 'Sleep till Dawn' : 'Rest for Night'}
          </span>
          <span className="text-[10px] text-indigo-300 opacity-80">Restore Energy</span>
        </button>
      </div>

      {/* Quick Access to Powers, Clues, and Mini-Games */}
      <div className="p-4 rounded-3xl bg-[#171029] border border-purple-800/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-purple-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Vampire Perks & Clues:</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('powers')}
            className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 flex items-center gap-1.5 font-bold"
          >
            <span>⚡ Powers</span>
          </button>
          <button
            onClick={() => onNavigate('mystery')}
            className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 flex items-center gap-1.5 font-bold"
          >
            <span>🔍 Mystery Board</span>
          </button>
          <button
            onClick={() => onNavigate('minigame')}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-pink-700 hover:from-purple-600 hover:to-pink-600 text-white border border-pink-400/50 flex items-center gap-1.5 font-bold"
          >
            <span>🎮 Mini-Games</span>
          </button>
        </div>
      </div>
    </div>
  );
};

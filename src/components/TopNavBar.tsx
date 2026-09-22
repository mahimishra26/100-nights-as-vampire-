import React from 'react';
import { PlayerStats, ScreenId, VampireProfile } from '../types';
import { Moon, Sun, Volume2, VolumeX, Sparkles, HelpCircle, ArrowLeft, Grid } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface TopNavBarProps {
  stats: PlayerStats;
  profile: VampireProfile;
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  muted: boolean;
  onToggleMute: () => void;
  onOpenQuickNavigator: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  stats,
  profile,
  currentScreen,
  onNavigate,
  muted,
  onToggleMute,
  onOpenQuickNavigator
}) => {
  const isNight = stats.timeOfDay === 'night';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#161226]/95 backdrop-blur-md border-b border-[#3b2a54] shadow-lg px-3 py-2 text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Night / Time Indicator & Back */}
        <div className="flex items-center gap-2">
          {currentScreen !== 'main_menu' && currentScreen !== 'splash' && currentScreen !== 'home' && (
            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('home');
              }}
              className="p-1.5 rounded-xl bg-[#281e3d] hover:bg-[#3d2c5e] text-purple-200 border border-purple-800/40 transition-all flex items-center gap-1 text-xs font-bold"
              title="Return Home"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          <div
            onClick={() => {
              sounds.playClick();
              onNavigate('game_progress');
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#231838] border border-purple-700/30 cursor-pointer hover:border-purple-500 transition-all"
            title="Click to view Game Progress"
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isNight ? 'bg-indigo-900/80 text-amber-300' : 'bg-amber-900/70 text-amber-300'}`}>
              {isNight ? <Moon className="w-4 h-4 fill-amber-300 animate-pulse" /> : <Sun className="w-4 h-4 fill-amber-400" />}
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1 text-xs font-bold text-purple-200 tracking-wide">
                <span>NIGHT {stats.night}</span>
                <span className="text-[10px] text-purple-400 font-normal">/ 100</span>
              </div>
              <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1">
                <span>{isNight ? '🌙 Midnight Phase' : '☀️ Day Phase'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center: Cozy Vital Stat Bars */}
        {currentScreen !== 'splash' && currentScreen !== 'main_menu' && (
          <div className="hidden md:flex items-center gap-3 text-xs">
            {/* Hunger */}
            <div className="flex items-center gap-1.5 bg-[#201533] px-2.5 py-1 rounded-xl border border-purple-800/30">
              <span className="text-sm">🩸</span>
              <div className="w-16">
                <div className="flex justify-between text-[10px] text-red-300 font-bold mb-0.5">
                  <span>Thirst</span>
                  <span>{stats.hunger < 30 ? 'Safe' : stats.hunger < 70 ? 'Thirsty' : 'Hungry!'}</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all rounded-full ${stats.hunger > 65 ? 'bg-red-500 animate-pulse' : 'bg-pink-500'}`}
                    style={{ width: `${Math.min(100, Math.max(5, stats.hunger))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Secrecy */}
            <div className="flex items-center gap-1.5 bg-[#201533] px-2.5 py-1 rounded-xl border border-purple-800/30">
              <span className="text-sm">🕵️</span>
              <div className="w-16">
                <div className="flex justify-between text-[10px] text-amber-300 font-bold mb-0.5">
                  <span>Secret</span>
                  <span>{stats.secrecy}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, stats.secrecy))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="flex items-center gap-1.5 bg-[#201533] px-2.5 py-1 rounded-xl border border-purple-800/30">
              <span className="text-sm">⚡</span>
              <div className="w-16">
                <div className="flex justify-between text-[10px] text-blue-300 font-bold mb-0.5">
                  <span>Energy</span>
                  <span>{stats.energy}%</span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, stats.energy))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-center gap-1 bg-[#2b1f42] px-2.5 py-1.5 rounded-xl border border-amber-600/40 font-bold text-amber-300 text-xs shadow-inner">
              <span>🪙</span>
              <span>{stats.coins}</span>
            </div>
          </div>
        )}

        {/* Right: Quick Screen Switcher & Audio */}
        <div className="flex items-center gap-2">
          {/* 30 Screens Master Selector */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenQuickNavigator();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md border border-purple-500/40 transition-transform active:scale-95"
            title="Open 30 Screens Explorer"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="text-xs">30 Screens</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="p-1.5 rounded-xl bg-[#281e3d] hover:bg-[#3d2c5e] text-purple-200 border border-purple-800/40 transition-colors"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};

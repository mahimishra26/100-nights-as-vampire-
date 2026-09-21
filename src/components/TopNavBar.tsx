import React from 'react';
import { PlayerStats, AppScreen, VampireProfile } from '../types';
import {
  Volume2,
  VolumeX,
  Code,
  Briefcase,
  Zap,
  Users,
  Moon,
  HelpCircle,
  Monitor,
  Terminal,
  Gamepad2,
  Compass,
  Sword,
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../audio/soundManager';

export type GameViewMode = 'web' | 'pygame' | 'terminal';

interface TopNavBarProps {
  stats: PlayerStats;
  profile?: VampireProfile;
  currentScreen: AppScreen;
  onNavigateScreen: (screen: AppScreen) => void;
  muted: boolean;
  activeMode: GameViewMode;
  onSelectMode: (mode: GameViewMode) => void;
  onOpenHowToPlay: () => void;
  onToggleMute: () => void;
  onOpenInventory: () => void;
  onOpenAbilities: () => void;
  onOpenRelationships: () => void;
  onOpenPythonHub: () => void;
}

export function TopNavBar({
  stats,
  profile,
  currentScreen,
  onNavigateScreen,
  muted,
  activeMode,
  onSelectMode,
  onOpenHowToPlay,
  onToggleMute,
  onOpenInventory,
  onOpenAbilities,
  onOpenRelationships,
  onOpenPythonHub
}: TopNavBarProps) {
  const isBloodMoon = stats.night >= 90 || stats.night === 25 || stats.night === 50 || stats.night === 75;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121118]/95 backdrop-blur-md border-b border-[#3d2331] shadow-2xl px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Night progress & Mode Switcher */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateScreen('dashboard');
            }}
            className="flex items-center gap-2 cursor-pointer text-left group"
            title="Return to Haven Dashboard"
          >
            <div className="relative">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-transform group-hover:scale-105 ${
                  isBloodMoon
                    ? 'border-red-600 bg-red-950/60 shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                    : 'border-[#d4af37] bg-[#1a1724]'
                }`}
              >
                <Moon className={`w-4 h-4 ${isBloodMoon ? 'text-red-500 animate-pulse' : 'text-[#e5c158]'}`} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-sm sm:text-base font-bold tracking-wider text-[#e6ded3]">
                  NIGHT {stats.night}
                </span>
                <span className="text-[10px] text-[#9d8d8f]">/ 100</span>
              </div>
              <div className="text-[10px] font-gothic tracking-wide text-[#b3a19b]">
                {isBloodMoon ? (
                  <span className="text-red-400 font-semibold tracking-wider animate-pulse">
                    ✦ BLOOD MOON ECLIPSE ✦
                  </span>
                ) : (
                  `${100 - stats.night} nights left`
                )}
              </div>
            </div>
          </button>

          {/* 7+ Screens Quick Switcher Pills (visible on medium+ screens) */}
          {currentScreen !== 'menu' && (
            <div className="hidden xl:flex items-center gap-1 bg-[#181324] p-1 rounded-xl border border-[#3b233a] text-xs font-cinzel">
              <button
                onClick={() => onNavigateScreen('dashboard')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'dashboard'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🌙 Haven
              </button>
              <button
                onClick={() => onNavigateScreen('map')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'map'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🗺️ Map
              </button>
              <button
                onClick={() => onNavigateScreen('hunting')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'hunting'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🩸 Hunt
              </button>
              <button
                onClick={() => onNavigateScreen('abilities')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'abilities'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚡ Disciplines
              </button>
              <button
                onClick={() => onNavigateScreen('relationships')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'relationships'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ❤️ Covens
              </button>
              <button
                onClick={() => onNavigateScreen('character_creation')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'character_creation'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🧛 Visage
              </button>
              <button
                onClick={() => onNavigateScreen('settings')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentScreen === 'settings'
                    ? 'bg-red-950 text-white font-bold border border-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ⚙️ Settings
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Vitals Bars */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-serif">
          {/* Health */}
          <div className="flex flex-col gap-0.5 min-w-[75px]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-[#a7d8a6]">❤️ HP</span>
              <span className="font-mono font-semibold text-[#e6ded3]">{stats.health}/{stats.maxHealth}</span>
            </div>
            <div className="w-18 h-1.5 rounded bg-black/60 border border-[#3b473a] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-700 to-green-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (stats.health / stats.maxHealth) * 100))}%` }}
              />
            </div>
          </div>

          {/* Hunger */}
          <div className="flex flex-col gap-0.5 min-w-[75px]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-red-400">🩸 Thirst</span>
              <span className={`font-mono font-semibold ${stats.hunger > 70 ? 'text-red-500 animate-pulse' : 'text-[#e6ded3]'}`}>
                {stats.hunger}%
              </span>
            </div>
            <div className="w-18 h-1.5 rounded bg-black/60 border border-[#521c25] overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  stats.hunger > 75
                    ? 'bg-gradient-to-r from-red-700 to-red-500'
                    : 'bg-gradient-to-r from-amber-800 to-red-800'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, stats.hunger))}%` }}
              />
            </div>
          </div>

          {/* Secrecy */}
          <div className="flex flex-col gap-0.5 min-w-[75px]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-amber-300">🕵️ Stealth</span>
              <span className={`font-mono font-semibold ${stats.secrecy < 35 ? 'text-amber-500' : 'text-[#e6ded3]'}`}>
                {stats.secrecy}%
              </span>
            </div>
            <div className="w-18 h-1.5 rounded bg-black/60 border border-[#4d3d24] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-yellow-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, stats.secrecy))}%` }}
              />
            </div>
          </div>

          {/* Energy */}
          <div className="flex flex-col gap-0.5 min-w-[75px]">
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-blue-400">⚡ Energy</span>
              <span className="font-mono font-semibold text-[#e6ded3]">{stats.energy}/{stats.maxEnergy}</span>
            </div>
            <div className="w-18 h-1.5 rounded bg-black/60 border border-[#23354d] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-indigo-400 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (stats.energy / stats.maxEnergy) * 100))}%` }}
              />
            </div>
          </div>

          {/* Money */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1f1b29] border border-[#54432a]">
            <span className="text-xs">💰</span>
            <span className="font-mono font-bold text-[#eac54f] text-xs">${stats.money}</span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Menu button */}
          <button
            onClick={() => onNavigateScreen('menu')}
            className="px-2.5 py-1.5 rounded bg-[#1f1629] hover:bg-[#342245] text-red-200 border border-[#4a294d] text-xs font-cinzel transition-all cursor-pointer"
            title="Main Menu"
          >
            🏰 Menu
          </button>

          {/* How to Play button */}
          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#271d36] hover:bg-[#3d2954] text-purple-200 border border-[#5d3b75] text-xs font-cinzel transition-all cursor-pointer shadow-md"
            title="All Ways to Play"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Python Code & Hub */}
          <button
            onClick={onOpenPythonHub}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-gradient-to-r from-red-950 to-[#2f1825] hover:from-red-900 text-red-200 border border-red-700/60 text-xs font-cinzel font-semibold transition-all cursor-pointer"
            title="Download Python Engine (.zip)"
          >
            <Code className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden md:inline">Python</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-[#1f1b29] hover:bg-[#2e2336] text-[#a89aa0] hover:text-[#f3eae8] border border-[#3b2b3b] transition-colors cursor-pointer"
            title={muted ? 'Unmute Gothic Audio' : 'Mute Audio'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}

import { PlayerStats } from '../types';
import { Volume2, VolumeX, Code, Briefcase, Zap, Users, Moon } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface TopNavBarProps {
  stats: PlayerStats;
  muted: boolean;
  onToggleMute: () => void;
  onOpenInventory: () => void;
  onOpenAbilities: () => void;
  onOpenRelationships: () => void;
  onOpenPythonHub: () => void;
}

export function TopNavBar({
  stats,
  muted,
  onToggleMute,
  onOpenInventory,
  onOpenAbilities,
  onOpenRelationships,
  onOpenPythonHub
}: TopNavBarProps) {
  const isBloodMoon = stats.night >= 90 || stats.night === 25 || stats.night === 50 || stats.night === 75;

  return (
    <header className="sticky top-0 z-30 w-full bg-[#121118]/90 backdrop-blur-md border-b border-[#3d2331] shadow-2xl px-4 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Night progress */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
              isBloodMoon ? 'border-red-600 bg-red-950/60 shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'border-[#d4af37] bg-[#1a1724]'
            }`}>
              <Moon className={`w-5 h-5 ${isBloodMoon ? 'text-red-500 animate-pulse' : 'text-[#e5c158]'}`} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg font-bold tracking-wider text-[#e6ded3]">
                NIGHT {stats.night}
              </span>
              <span className="text-xs text-[#9d8d8f]">/ 100</span>
            </div>
            <div className="text-[11px] font-gothic tracking-wide text-[#b3a19b]">
              {isBloodMoon ? (
                <span className="text-red-400 font-semibold tracking-wider animate-pulse">
                  ✦ BLOOD MOON ECLIPSE ACTIVE ✦
                </span>
              ) : (
                `${100 - stats.night} nights until Blood Moon`
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Vitals Bars */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-serif">
          {/* Health */}
          <div className="flex flex-col gap-0.5 min-w-[100px]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#a7d8a6] flex items-center gap-1">❤️ Health</span>
              <span className="font-mono font-semibold text-[#e6ded3]">{stats.health}/{stats.maxHealth}</span>
            </div>
            <div className="w-24 h-2 rounded bg-black/60 border border-[#3b473a] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-700 to-green-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (stats.health / stats.maxHealth) * 100))}%` }}
              />
            </div>
          </div>

          {/* Hunger */}
          <div className="flex flex-col gap-0.5 min-w-[100px]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-red-400 flex items-center gap-1">🩸 Thirst</span>
              <span className={`font-mono font-semibold ${stats.hunger > 70 ? 'text-red-500 animate-pulse' : 'text-[#e6ded3]'}`}>
                {stats.hunger}%
              </span>
            </div>
            <div className="w-24 h-2 rounded bg-black/60 border border-[#521c25] overflow-hidden">
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
          <div className="flex flex-col gap-0.5 min-w-[100px]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-amber-300 flex items-center gap-1">🕵️ Secrecy</span>
              <span className={`font-mono font-semibold ${stats.secrecy < 35 ? 'text-amber-500' : 'text-[#e6ded3]'}`}>
                {stats.secrecy}%
              </span>
            </div>
            <div className="w-24 h-2 rounded bg-black/60 border border-[#4d3d24] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-700 to-yellow-500 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, stats.secrecy))}%` }}
              />
            </div>
          </div>

          {/* Energy */}
          <div className="flex flex-col gap-0.5 min-w-[100px]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-blue-400 flex items-center gap-1">⚡ Energy</span>
              <span className="font-mono font-semibold text-[#e6ded3]">{stats.energy}/{stats.maxEnergy}</span>
            </div>
            <div className="w-24 h-2 rounded bg-black/60 border border-[#23354d] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-700 to-indigo-400 transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, (stats.energy / stats.maxEnergy) * 100))}%` }}
              />
            </div>
          </div>

          {/* Money */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#1f1b29] border border-[#54432a]">
            <span className="text-sm">💰</span>
            <span className="font-mono font-bold text-[#eac54f]">${stats.money}</span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playBite();
              onOpenInventory();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201d2a] hover:bg-[#342436] text-[#e0d6c9] border border-[#482c3c] text-xs font-cinzel transition-colors cursor-pointer"
            title="Open Satchel & Consumables"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-300" />
            <span>Satchel</span>
          </button>

          <button
            onClick={() => {
              sounds.playMagic();
              onOpenAbilities();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201d2a] hover:bg-[#342436] text-[#e0d6c9] border border-[#482c3c] text-xs font-cinzel transition-colors cursor-pointer"
            title="Vampire Disciplines"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span>Abilities</span>
          </button>

          <button
            onClick={() => {
              sounds.playOrganChord();
              onOpenRelationships();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201d2a] hover:bg-[#342436] text-[#e0d6c9] border border-[#482c3c] text-xs font-cinzel transition-colors cursor-pointer"
            title="NPCs & Covens"
          >
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span>Covens</span>
          </button>

          {/* Python Project Code & Download Hub */}
          <button
            onClick={onOpenPythonHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-red-950 to-[#2f1825] hover:from-red-900 hover:to-[#451f35] text-red-200 border border-red-700/60 text-xs font-cinzel font-semibold transition-all cursor-pointer shadow-lg shadow-red-950/40"
            title="Inspect Python Source Code & Download Zip"
          >
            <Code className="w-3.5 h-3.5 text-red-400" />
            <span>Python Source</span>
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

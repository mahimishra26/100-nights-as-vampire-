import React, { useState } from 'react';
import { PlayerStats, NPCCharacter, Ability, InventoryItem, LocationInfo } from '../types';
import { sounds } from '../audio/soundManager';
import { Droplet, Heart, Shield, Zap, Coins, Moon, Compass, Sparkles, Terminal, Swords, Package } from 'lucide-react';

interface PygameWindowViewProps {
  stats: PlayerStats;
  locations: Record<string, LocationInfo>;
  unlockedLocations: string[];
  characters: Record<string, NPCCharacter>;
  abilities: Record<string, Ability>;
  items: Record<string, InventoryItem>;
  onSelectLocation: (locId: string) => void;
  onQuickFeed: (method: 'rats' | 'bag' | 'stealth_mortal') => void;
  onOpenInventory: () => void;
  onOpenAbilities: () => void;
  onOpenRelationships: () => void;
  onOpenPythonHub: () => void;
  onOpenTerminal: () => void;
}

export function PygameWindowView({
  stats,
  locations,
  unlockedLocations,
  characters,
  abilities,
  items,
  onSelectLocation,
  onQuickFeed,
  onOpenInventory,
  onOpenAbilities,
  onOpenRelationships,
  onOpenPythonHub,
  onOpenTerminal
}: PygameWindowViewProps) {
  const [selectedLocKey, setSelectedLocKey] = useState<string>('downtown');
  const [crtFilter, setCrtFilter] = useState(true);

  const loc = locations[selectedLocKey] || locations['mansion'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      {/* Desktop OS Window Frame */}
      <div className="rounded-xl overflow-hidden border-2 border-[#522d46] bg-[#0c0a14] shadow-[0_0_80px_rgba(180,30,80,0.35)]">
        {/* Pygame OS Window Header */}
        <div className="h-9 px-4 bg-[#181326] border-b border-[#3b233a] flex items-center justify-between select-none text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600/80 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-amber-600/80 inline-block shadow-sm"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-600/80 inline-block shadow-sm"></span>
            <span className="ml-2 text-[#e2d5cb] font-bold">
              100 Nights as a Vampire — Pygame 2.6.0 Window [1280×720]
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-[#9f8d9b]">
            <span className="text-emerald-400 font-bold">● 60 FPS</span>
            <span>SDL 2.28</span>
            <button
              onClick={() => setCrtFilter(!crtFilter)}
              className={`px-2 py-0.5 rounded border text-[10px] cursor-pointer transition-colors ${
                crtFilter
                  ? 'bg-red-950/80 border-red-700 text-red-300'
                  : 'bg-[#20182c] border-[#432d43] text-gray-400'
              }`}
            >
              CRT Scanlines: {crtFilter ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Pygame Canvas Display (1280x720 Virtual Aspect Ratio) */}
        <div className={`relative p-5 bg-[#090810] text-[#e8ded3] font-mono ${crtFilter ? 'scanlines' : ''}`}>
          {/* Top Status Panel (Pygame UI Bar) */}
          <div className="p-3.5 rounded-lg bg-[#141020] border border-[#3b253b] grid grid-cols-2 md:grid-cols-6 gap-3 text-xs mb-4">
            {/* Night */}
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              <div>
                <div className="text-[10px] text-gray-400">CURRENT NIGHT</div>
                <div className="text-sm font-bold text-white font-cinzel">NIGHT {stats.night} / 100</div>
              </div>
            </div>

            {/* Health */}
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
              <div>
                <div className="text-[10px] text-gray-400">HEALTH (HP)</div>
                <div className="font-bold text-red-400">{stats.health} / {stats.maxHealth}</div>
              </div>
            </div>

            {/* Thirst / Hunger */}
            <div className="flex items-center gap-2">
              <Droplet className="w-4 h-4 text-red-400 fill-red-500" />
              <div>
                <div className="text-[10px] text-gray-400">THIRST / HUNGER</div>
                <div className="font-bold text-red-300">{stats.hunger} / 100 {stats.hunger > 75 ? '⚠️' : ''}</div>
              </div>
            </div>

            {/* Secrecy */}
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-[10px] text-gray-400">SECRECY</div>
                <div className="font-bold text-amber-300">{stats.secrecy}%</div>
              </div>
            </div>

            {/* Energy */}
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-[10px] text-gray-400">ENERGY</div>
                <div className="font-bold text-cyan-300">{stats.energy} / {stats.maxEnergy}⚡</div>
              </div>
            </div>

            {/* Money */}
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-yellow-400" />
              <div>
                <div className="text-[10px] text-gray-400">TREASURY</div>
                <div className="font-bold text-yellow-300">${stats.money}</div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Pygame Stage Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Column: District Navigator (Locations) */}
            <div className="md:col-span-4 bg-[#110e1c] border border-[#3b253b] rounded-lg p-3 flex flex-col gap-2">
              <div className="text-xs font-bold text-red-300 font-cinzel pb-1 border-b border-[#2d1b2c] flex items-center justify-between">
                <span>GOTHIC DISTRICTS</span>
                <span className="text-[10px] text-gray-400">KEYS [1-9]</span>
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[380px] pr-1">
                {Object.entries(locations).map(([key, l], index) => {
                  const isUnlocked = unlockedLocations.includes(key);
                  const isSelected = selectedLocKey === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        sounds.playOrganChord();
                        setSelectedLocKey(key);
                      }}
                      className={`w-full text-left p-2 rounded transition-all flex items-center justify-between text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-red-950/80 border border-red-600 text-white font-bold'
                          : isUnlocked
                          ? 'bg-[#181324] hover:bg-[#231a33] text-[#decbc0] border border-transparent'
                          : 'bg-[#100d18] text-gray-600 border border-transparent cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base">{l.icon}</span>
                        <div className="truncate">
                          <div className="truncate">
                            [{index + 1}] {l.name}
                          </div>
                          <div className="text-[10px] text-gray-400 truncate">{l.subtitle}</div>
                        </div>
                      </div>

                      <div className="text-[10px] flex-shrink-0 text-amber-400 ml-1">
                        {'★'.repeat(l.dangerLevel)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Active Scene & Stage Illustration */}
            <div className="md:col-span-8 bg-[#110e1c] border border-[#3b253b] rounded-lg p-4 flex flex-col justify-between">
              {/* Location Stage Header */}
              <div>
                <div className="flex items-center justify-between border-b border-[#2d1b2c] pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{loc.icon}</span>
                    <div>
                      <h3 className="font-cinzel text-base font-bold text-red-200">{loc.name}</h3>
                      <p className="text-xs text-gray-400">{loc.subtitle}</p>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded bg-[#201428] border border-[#482844] text-amber-300">
                    Danger: {'★'.repeat(loc.dangerLevel)}
                  </span>
                </div>

                {/* Narrative Description Canvas */}
                <div className="p-3.5 rounded bg-[#0b0a12] border border-[#261726] text-xs leading-relaxed text-[#d6c7b9] space-y-2 mb-4">
                  <p>{loc.description}</p>
                  <p className="text-purple-300 text-[11px]">
                    ✦ Notable Entities in Area: {loc.npcs.map((n) => characters[n]?.name || n).join(', ')}
                  </p>
                </div>
              </div>

              {/* Action Prompt Controls */}
              <div className="space-y-2 pt-2 border-t border-[#2d1b2c]">
                <div className="text-[11px] font-bold text-gray-400">CHOOSE NOCTURNAL ACTION:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectLocation(selectedLocKey)}
                    className="py-2.5 px-3 rounded bg-red-900/90 hover:bg-red-800 text-white font-cinzel font-bold text-xs flex items-center justify-center gap-2 border border-red-600 shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    <span>ENTER DISTRICT ENCOUNTER →</span>
                  </button>

                  <button
                    onClick={() => onQuickFeed('stealth_mortal')}
                    className="py-2.5 px-3 rounded bg-[#241730] hover:bg-[#38204c] text-red-200 font-bold text-xs flex items-center justify-center gap-2 border border-[#502c52] cursor-pointer transition-colors"
                  >
                    <Droplet className="w-3.5 h-3.5 text-red-400" />
                    <span>FEED ON LOCAL PREY (-50 Thirst)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Pygame Hotkey Bar */}
          <div className="mt-4 p-2.5 rounded bg-[#141020] border border-[#301c30] flex flex-wrap items-center justify-between gap-2 text-xs text-[#b8a7b3]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-amber-400 font-bold">Quick Panels:</span>
              <button
                onClick={onOpenAbilities}
                className="px-2 py-1 rounded bg-[#20182e] hover:bg-[#34244a] border border-[#432d43] text-purple-200 cursor-pointer"
              >
                [A] Disciplines
              </button>
              <button
                onClick={onOpenInventory}
                className="px-2 py-1 rounded bg-[#20182e] hover:bg-[#34244a] border border-[#432d43] text-yellow-200 cursor-pointer"
              >
                [S] Satchel
              </button>
              <button
                onClick={onOpenRelationships}
                className="px-2 py-1 rounded bg-[#20182e] hover:bg-[#34244a] border border-[#432d43] text-cyan-200 cursor-pointer"
              >
                [R] Alliances
              </button>
              <button
                onClick={onOpenTerminal}
                className="px-2 py-1 rounded bg-[#20182e] hover:bg-[#34244a] border border-[#432d43] text-emerald-300 cursor-pointer"
              >
                [T] Python CLI Terminal
              </button>
            </div>

            <button
              onClick={onOpenPythonHub}
              className="underline text-amber-300 hover:text-white cursor-pointer text-[11px]"
            >
              Inspect & Download Python Code (.zip)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

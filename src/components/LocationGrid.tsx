import { LocationInfo, NPCCharacter } from '../types';
import { Skull, ShieldAlert, Sparkles, Droplets } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface LocationGridProps {
  locations: Record<string, LocationInfo>;
  unlockedLocations: string[];
  characters: Record<string, NPCCharacter>;
  onSelectLocation: (locId: string) => void;
  onQuickFeed: (method: 'rats' | 'bag' | 'stealth_mortal') => void;
  hunger: number;
}

export function LocationGrid({
  locations,
  unlockedLocations,
  characters,
  onSelectLocation,
  onQuickFeed,
  hunger
}: LocationGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Quick Feeding & Nightly Needs Bar */}
      <div className="bg-[#181520]/85 border border-[#402636] rounded-xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-800/50 text-red-400">
            <Droplets className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-sm font-bold text-[#f0e6dc] flex items-center gap-2">
              <span>NOCTURNAL BLOOD SATING</span>
              {hunger > 70 && (
                <span className="text-[11px] font-sans px-2 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-700">
                  Starvation Frenzy Imminent!
                </span>
              )}
            </h3>
            <p className="text-xs text-[#a69599] font-serif">
              Quench the burning in your veins before selecting a city location, or risk losing control.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              sounds.playBite();
              onQuickFeed('rats');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#241a27] hover:bg-[#3d2136] text-[#e0d6c9] border border-[#522f46] text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🐀 Hunt Vermin</span>
            <span className="text-emerald-400 text-[11px]">(-20 🩸)</span>
          </button>

          <button
            onClick={() => {
              sounds.playBite();
              onQuickFeed('bag');
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-950 to-[#2c1324] hover:from-red-900 hover:to-[#421b36] text-red-200 border border-red-800/70 text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>🩸 Preserved Pack</span>
            <span className="text-emerald-300 text-[11px]">(-45 🩸, +15 HP)</span>
          </button>

          <button
            onClick={() => {
              sounds.playMagic();
              onQuickFeed('stealth_mortal');
            }}
            className="px-3 py-1.5 rounded-lg bg-[#1f1930] hover:bg-[#34244a] text-purple-200 border border-[#4d3869] text-xs font-cinzel transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>👁️ Mesmerize Prey</span>
            <span className="text-purple-300 text-[11px]">(-50 🩸, -Secrecy)</span>
          </button>
        </div>
      </div>

      {/* 9 Interactive Locations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.values(locations).map((loc) => {
          const isUnlocked = unlockedLocations.includes(loc.id);

          return (
            <div
              key={loc.id}
              className={`relative rounded-xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-[#15131e]/90 hover:bg-[#1f1a2c]/95 border-[#3b2434] hover:border-[#8f324c] shadow-lg hover:shadow-[0_0_20px_rgba(180,30,60,0.25)]'
                  : 'bg-[#0f0e15]/70 border-[#241f2a] opacity-60'
              }`}
            >
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{loc.icon}</span>
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#ebdcd0] tracking-wide">
                        {loc.name}
                      </h4>
                      <p className="text-[11px] text-[#9c8491] font-serif italic">
                        {loc.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Danger badge */}
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-black/50 border border-[#3b2b3b] text-[10px]">
                    <Skull className="w-3 h-3 text-red-400" />
                    <span className="text-[#c7b3be]">Danger {loc.dangerLevel}/5</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#b09da5] font-serif leading-relaxed line-clamp-3 mb-3">
                  {loc.description}
                </p>
              </div>

              {/* Footer info & action */}
              <div className="pt-3 border-t border-[#2d1e2a] flex items-center justify-between gap-2 mt-auto">
                {/* Associated NPCs */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-[#7d6c77]">Contacts:</span>
                  <div className="flex items-center -space-x-1">
                    {loc.npcs.map((nId) => {
                      const ch = characters[nId];
                      return ch ? (
                        <span
                          key={nId}
                          className="w-5 h-5 rounded-full bg-[#201824] border border-[#523348] flex items-center justify-center text-[10px]"
                          title={`${ch.name} (${ch.status})`}
                        >
                          {ch.portraitIcon}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Action button */}
                {isUnlocked ? (
                  <button
                    onClick={() => {
                      sounds.playOrganChord();
                      onSelectLocation(loc.id);
                    }}
                    className="px-3 py-1.5 rounded bg-gradient-to-r from-red-950 to-[#421b2d] hover:from-red-900 hover:to-[#632442] text-red-100 border border-red-700/70 text-xs font-cinzel font-semibold transition-all cursor-pointer shadow"
                  >
                    Enter Location →
                  </button>
                ) : (
                  <span className="text-[11px] text-[#6d5d67] italic font-serif flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-500/70" />
                    Locked (Advance Nights)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

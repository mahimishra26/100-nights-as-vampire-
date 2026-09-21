import React, { useState } from 'react';
import { LocationInfo, NPCCharacter } from '../../types';
import { Compass, Skull, MapPin, ShieldAlert, Users, Package, ArrowLeft, ArrowRight, Lock, Eye } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface CityMapScreenProps {
  locations: Record<string, LocationInfo>;
  unlockedLocations: string[];
  characters: Record<string, NPCCharacter>;
  night: number;
  onSelectLocation: (locationId: string) => void;
  onBack: () => void;
}

export const CityMapScreen: React.FC<CityMapScreenProps> = ({
  locations,
  unlockedLocations,
  characters,
  night,
  onSelectLocation,
  onBack
}) => {
  const [selectedId, setSelectedId] = useState<string>('mansion');

  const selectedLoc = locations[selectedId] || Object.values(locations)[0];
  const isSelectedUnlocked = unlockedLocations.includes(selectedId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#382333]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-amber-200 to-red-400">
            🗺️ GOTHIC METROPOLIS: OAKHAVEN
          </h2>
          <p className="text-xs text-[#decbc0] font-serif mt-0.5">
            Territories unlocked: {unlockedLocations.length} / 9 Districts (Night {night} / 100)
          </p>
        </div>

        <div className="text-xs font-mono text-amber-300 bg-black/45 px-3 py-1.5 rounded-lg border border-[#3e2439]">
          Gaslit Midnight
        </div>
      </div>

      {/* Main Grid: Interactive Map Nodes (8 cols) & District Tactical Brief (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Grid of 9 Locations */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {Object.values(locations).map((loc) => {
            const isUnlocked = unlockedLocations.includes(loc.id);
            const isSelected = selectedId === loc.id;

            return (
              <div
                key={loc.id}
                onClick={() => {
                  sounds.playClick();
                  setSelectedId(loc.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[170px] ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#30162a] to-[#1a0f1d] border-red-500 shadow-[0_0_20px_rgba(230,57,70,0.35)] scale-[1.02]'
                    : isUnlocked
                    ? 'bg-[#150f1a]/90 hover:bg-[#221528] border-[#382333] hover:border-[#5a2e4c]'
                    : 'bg-[#0f0c13]/80 border-[#221826] opacity-65'
                }`}
              >
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{loc.icon}</span>
                    {isUnlocked ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-amber-300 border border-amber-800/40">
                        {'★'.repeat(loc.dangerLevel)}{'☆'.repeat(5 - loc.dangerLevel)}
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" /> Locked
                      </span>
                    )}
                  </div>

                  <h4 className="font-cinzel font-bold text-sm text-white leading-tight">
                    {loc.name}
                  </h4>
                  <p className="text-[11px] font-serif text-[#decbc0] mt-0.5 line-clamp-2">
                    {loc.subtitle}
                  </p>
                </div>

                {/* Footer npcs indicator */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-[#8e7a88] font-mono">
                  <span>{loc.lootTypes.slice(0, 2).join(' • ')}</span>
                  {isSelected && <span className="text-amber-300 font-bold">Selected</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Tactical Briefing Panel */}
        <div className="lg:col-span-4 sticky top-6 space-y-4">
          <div className="p-5 rounded-2xl bg-[#150f1a]/95 border-2 border-[#522b46] shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{selectedLoc.icon}</span>
              <div>
                <h3 className="font-cinzel font-bold text-base text-white">
                  {selectedLoc.name}
                </h3>
                <p className="text-xs font-serif text-amber-300">
                  {selectedLoc.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs font-serif text-[#decbc0] leading-relaxed mb-4">
              {selectedLoc.description}
            </p>

            {/* Tactical Ratings */}
            <div className="space-y-2 text-xs font-serif p-3 rounded-xl bg-black/40 border border-[#382333] mb-4">
              <div className="flex justify-between">
                <span className="text-[#8e7a88]">Inquisitor Threat / Danger:</span>
                <span className="text-red-400 font-mono font-bold">
                  Level {selectedLoc.dangerLevel} ({'★'.repeat(selectedLoc.dangerLevel)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e7a88]">Frequent Loot / Yield:</span>
                <span className="text-amber-200 font-mono">
                  {selectedLoc.lootTypes.join(', ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e7a88]">Known Inhabitants:</span>
                <span className="text-purple-200 font-mono">
                  {selectedLoc.npcs
                    .map((id) => characters[id]?.name || id)
                    .join(', ') || 'Lone Stragglers'}
                </span>
              </div>
            </div>

            {/* Exploration Action Button */}
            {isSelectedUnlocked ? (
              <button
                onClick={() => {
                  sounds.playFootstep();
                  onSelectLocation(selectedLoc.id);
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#800f2f] to-[#a4133c] hover:from-[#a4133c] hover:to-[#ff4d6d] text-white font-cinzel font-bold text-xs tracking-wider border border-red-400/50 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all"
              >
                <span>EXPLORE {selectedLoc.name.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-center text-xs text-red-300 font-serif">
                🔒 District is shrouded in thick fog. Advance more nights to unlock access.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

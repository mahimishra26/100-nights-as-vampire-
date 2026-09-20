import { Ability } from '../types';
import { Zap, X, ChevronUp, Lock } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface AbilitiesModalProps {
  abilities: Record<string, Ability>;
  money: number;
  onClose: () => void;
  onUpgradeAbility: (abilityId: string) => void;
}

export function AbilitiesModal({
  abilities,
  money,
  onClose,
  onUpgradeAbility
}: AbilitiesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#14121b] border-2 border-[#543449] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1c1825] px-6 py-4 border-b border-[#3e2637] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-purple-400" />
            <h2 className="font-cinzel text-lg font-bold text-[#f5ebd8] tracking-wide">
              Vampiric Disciplines & Abilities
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono font-bold text-[#eac54f] px-3 py-1 rounded bg-black/50 border border-[#523e27]">
              Available Coin: ${money}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded bg-[#231b26] hover:bg-[#382637] text-gray-400 hover:text-white border border-[#442c3d] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Abilities Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.values(abilities).map((ability) => {
            const isMaxed = ability.level >= ability.maxLevel;
            const canAfford = money >= ability.upgradeCost;

            return (
              <div
                key={ability.id}
                className="p-4 rounded-xl bg-[#1a1624] border border-[#3b2b3a] hover:border-[#683f5a] flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-cinzel font-bold text-sm text-[#ebd9cd]">
                      {ability.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((lvl) => (
                        <div
                          key={lvl}
                          className={`w-3 h-3 rounded-full border ${
                            ability.level >= lvl
                              ? 'bg-purple-600 border-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]'
                              : 'bg-black/40 border-[#473b47]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#a893a0] mb-2">
                    <span>Base Energy: {ability.baseCost}⚡</span>
                    <span>•</span>
                    <span>Level: {ability.level}/{ability.maxLevel}</span>
                  </div>

                  <p className="text-xs text-[#baa7b1] font-serif leading-relaxed">
                    {ability.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#2a222f] flex items-center justify-between">
                  {isMaxed ? (
                    <span className="text-xs font-cinzel font-bold text-emerald-400">
                      ★ Mastered (Level 3)
                    </span>
                  ) : (
                    <button
                      disabled={!canAfford}
                      onClick={() => {
                        sounds.playMagic();
                        onUpgradeAbility(ability.id);
                      }}
                      className="w-full px-3 py-1.5 rounded bg-gradient-to-r from-purple-950 to-[#371942] hover:from-purple-900 hover:to-[#542168] disabled:opacity-40 disabled:cursor-not-allowed text-purple-200 border border-purple-700/60 text-xs font-cinzel font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5"
                    >
                      {ability.level === 0 ? <Lock className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                      <span>
                        {ability.level === 0 ? `Awaken Discipline ($${ability.upgradeCost})` : `Ascend to Lvl ${ability.level + 1} ($${ability.upgradeCost})`}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0f0e15] border-t border-[#31202e] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#241c2a] hover:bg-[#39283f] text-gray-200 border border-[#4a344d] text-xs font-cinzel cursor-pointer"
          >
            Return to Sanctuary
          </button>
        </div>
      </div>
    </div>
  );
}

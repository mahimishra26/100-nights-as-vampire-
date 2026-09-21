import React, { useState } from 'react';
import { Ability, InventoryItem } from '../../types';
import { Sparkles, Package, ArrowLeft, ArrowUpCircle, Check, Coins, ShieldAlert, Zap, Info } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface AbilitiesInventoryScreenProps {
  abilities: Record<string, Ability>;
  items: Record<string, InventoryItem>;
  money: number;
  onUpgradeAbility: (abilityId: string) => void;
  onUseItem: (itemId: string) => void;
  onBuyItem: (itemId: string) => void;
  onBack: () => void;
}

export const AbilitiesInventoryScreen: React.FC<AbilitiesInventoryScreenProps> = ({
  abilities,
  items,
  money,
  onUpgradeAbility,
  onUseItem,
  onBuyItem,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'abilities' | 'inventory'>('abilities');
  const [inspectItem, setInspectItem] = useState<InventoryItem | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#382333]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#120f17] p-1 rounded-xl border border-[#382333]">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('abilities');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              activeTab === 'abilities'
                ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⚡ VAMPIRE DISCIPLINES (7)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('inventory');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-red-950 to-[#800f2f] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎒 SATCHEL & ARTIFACTS
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-amber-300 bg-black/45 px-3 py-1.5 rounded-lg border border-[#3e2439]">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>Wealth: ${money}</span>
        </div>
      </div>

      {activeTab === 'abilities' ? (
        /* Vampire Disciplines Grid */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#decbc0] font-serif">
            <span>
              Unlock and refine your ancestral vampiric powers. Upgrades increase effectiveness in combat and narrative events.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(abilities).map((ability) => {
              const isUnlocked = ability.level > 0;
              const canUpgrade = money >= ability.upgradeCost && ability.level < ability.maxLevel;

              return (
                <div
                  key={ability.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-[#151121]/95 border-blue-900/40 shadow-lg'
                      : 'bg-[#0f0c14]/80 border-[#221826] opacity-75'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-cinzel font-bold text-base text-white">
                        {ability.name}
                      </h3>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/40">
                        {ability.level === 0 ? 'Locked' : `Rank ${ability.level} / ${ability.maxLevel}`}
                      </span>
                    </div>

                    <p className="text-xs font-serif text-[#decbc0] leading-relaxed mb-4">
                      {ability.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded bg-black/40 border border-[#271d36] mb-4">
                      <span className="text-blue-300">Energy Cost: {ability.baseCost}⚡</span>
                      <span className="text-amber-300">Upgrade: ${ability.upgradeCost}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (canUpgrade) {
                        sounds.playMagic();
                        onUpgradeAbility(ability.id);
                      }
                    }}
                    disabled={!canUpgrade}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-cinzel font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
                      ability.level >= ability.maxLevel
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 cursor-default'
                        : canUpgrade
                        ? 'bg-gradient-to-r from-blue-900 to-indigo-800 hover:from-blue-800 hover:to-indigo-700 text-white border border-blue-500/50 shadow-md cursor-pointer'
                        : 'bg-[#1a1524] text-gray-500 border-[#2b2238] cursor-not-allowed'
                    }`}
                  >
                    {ability.level >= ability.maxLevel ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>MASTERED TO MAXIMUM</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpCircle className="w-3.5 h-3.5" />
                        <span>
                          {ability.level === 0 ? `AWAKEN DISCIPLINE ($${ability.upgradeCost})` : `UPGRADE TO RANK ${ability.level + 1} ($${ability.upgradeCost})`}
                        </span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inventory & Relics Grid */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(items).map((item) => {
              const hasItem = item.quantity > 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    hasItem
                      ? 'bg-[#150f1a]/95 border-[#442840] shadow-md'
                      : 'bg-[#0f0c13]/70 border-[#221826] opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-cinzel font-bold text-sm text-white">{item.name}</h4>
                      <span className="text-xs font-mono text-amber-300 px-2 py-0.5 rounded bg-black/50">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950/60 text-red-300 uppercase">
                      {item.category}
                    </span>
                    <p className="text-xs font-serif text-[#decbc0] mt-2 line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                    {hasItem && (
                      <button
                        onClick={() => {
                          sounds.playBite();
                          onUseItem(item.id);
                        }}
                        className="flex-1 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/80 text-red-100 text-xs font-cinzel border border-red-600/50 cursor-pointer"
                      >
                        Use Item
                      </button>
                    )}

                    <button
                      onClick={() => {
                        sounds.playCoin();
                        onBuyItem(item.id);
                      }}
                      disabled={money < item.cost}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-cinzel border transition-all ${
                        money >= item.cost
                          ? 'bg-[#21162b] hover:bg-[#341e45] text-amber-300 border-amber-800/50 cursor-pointer'
                          : 'bg-black/30 text-gray-500 border-gray-800 cursor-not-allowed'
                      }`}
                    >
                      Buy (${item.cost})
                    </button>

                    <button
                      onClick={() => setInspectItem(item)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-gray-300 text-xs border border-[#382333] cursor-pointer"
                      title="Inspect Lore"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Inspect Modal / Box */}
          {inspectItem && (
            <div className="p-4 rounded-xl bg-black/60 border border-amber-700/50 text-xs font-serif text-[#decbc0] space-y-1">
              <div className="flex items-center justify-between text-amber-300 font-cinzel font-bold">
                <span>📜 Artifact Lore: {inspectItem.name}</span>
                <button
                  onClick={() => setInspectItem(null)}
                  className="text-gray-400 hover:text-white underline cursor-pointer"
                >
                  Close
                </button>
              </div>
              <p className="leading-relaxed">{inspectItem.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

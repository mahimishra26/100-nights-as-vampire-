import { InventoryItem } from '../types';
import { Briefcase, X, PlusCircle, Check } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface InventoryModalProps {
  items: Record<string, InventoryItem>;
  money: number;
  onClose: () => void;
  onUseItem: (itemId: string) => void;
  onBuyItem: (itemId: string) => void;
}

export function InventoryModal({
  items,
  money,
  onClose,
  onUseItem,
  onBuyItem
}: InventoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14121b] border-2 border-[#543449] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1c1825] px-6 py-4 border-b border-[#3e2637] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-amber-300" />
            <h2 className="font-cinzel text-lg font-bold text-[#f5ebd8] tracking-wide">
              Vampiric Satchel & Provisions
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

        {/* Items List */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-3">
          {Object.values(items).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-[#1a1624] border border-[#3b2b3a] hover:border-[#633e5a] flex items-center justify-between gap-4 transition-all"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-cinzel font-bold text-sm text-[#ebd9cd]">
                    {item.name}
                  </h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-black/50 border border-[#4d3b4b] text-amber-300">
                    Owned: {item.quantity}
                  </span>
                </div>
                <p className="text-xs text-[#a8959d] font-serif mt-1">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {item.quantity > 0 && item.usableInField && (
                  <button
                    onClick={() => {
                      sounds.playBite();
                      onUseItem(item.id);
                    }}
                    className="px-3 py-1.5 rounded bg-gradient-to-r from-red-950 to-[#3e1b2f] hover:from-red-900 hover:to-[#5c2443] text-red-200 border border-red-700/60 text-xs font-cinzel font-semibold cursor-pointer transition-all"
                  >
                    Consume
                  </button>
                )}

                <button
                  disabled={money < item.cost}
                  onClick={() => {
                    sounds.playOrganChord();
                    onBuyItem(item.id);
                  }}
                  className="px-3 py-1.5 rounded bg-[#1e2333] hover:bg-[#2e3752] disabled:opacity-40 disabled:cursor-not-allowed text-blue-200 border border-blue-800/60 text-xs font-cinzel cursor-pointer transition-all flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Buy (${item.cost})</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#0f0e15] border-t border-[#31202e] text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#241c2a] hover:bg-[#39283f] text-gray-200 border border-[#4a344d] text-xs font-cinzel cursor-pointer"
          >
            Close Satchel
          </button>
        </div>
      </div>
    </div>
  );
}

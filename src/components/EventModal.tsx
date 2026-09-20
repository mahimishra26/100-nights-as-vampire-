import { GameEvent, EventChoice, Ability, InventoryItem, NPCCharacter } from '../types';
import { Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface EventModalProps {
  event: GameEvent;
  characters: Record<string, NPCCharacter>;
  abilities: Record<string, Ability>;
  items: Record<string, InventoryItem>;
  money: number;
  energy: number;
  onChoose: (choice: EventChoice) => void;
}

export function EventModal({
  event,
  characters,
  abilities,
  items,
  money,
  energy,
  onChoose
}: EventModalProps) {
  const speakerChar = event.characterId ? characters[event.characterId] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#14121b] border-2 border-[#542436] shadow-[0_0_50px_rgba(180,24,43,0.35)] overflow-hidden flex flex-col">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#2c0e1b] via-[#1a1524] to-[#120f1c] px-6 py-4 border-b border-[#4d2438] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-lg bg-black/50 border border-[#4d2f44]">
              {speakerChar ? speakerChar.portraitIcon : '🌙'}
            </span>
            <div>
              <h2 className="font-cinzel text-lg font-bold text-[#f5e6d8] tracking-wide">
                {event.title}
              </h2>
              <p className="text-xs text-[#b89ca8] font-serif flex items-center gap-1.5">
                <span>✦</span>
                <span className="text-amber-300 font-semibold">{event.speaker}</span>
                {speakerChar && (
                  <span className="text-[11px] text-[#8e7a85]">({speakerChar.title})</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Dialogue narrative body */}
        <div className="p-6 overflow-y-auto max-h-[42vh] space-y-4">
          <div className="text-[#decbc0] text-sm md:text-base font-serif leading-relaxed whitespace-pre-line bg-[#0d0c13]/60 p-4 rounded-xl border border-[#2d2232]">
            {event.text}
          </div>
        </div>

        {/* Choice buttons */}
        <div className="p-6 bg-[#0f0e15] border-t border-[#3b2333] flex flex-col gap-2.5">
          <h4 className="text-[11px] font-cinzel font-bold text-[#9d8995] uppercase tracking-wider mb-1">
            Choose Your Course of Action:
          </h4>

          {event.choices.map((choice, idx) => {
            // Check requirement validity
            let isAvailable = true;
            let reqNotice = '';

            if (choice.energyCost && energy < choice.energyCost) {
              isAvailable = false;
              reqNotice = `(Requires ${choice.energyCost}⚡ Energy - you have ${energy}⚡)`;
            }

            if (choice.req) {
              const { type, target, value } = choice.req;
              if (type === 'ability') {
                const ab = abilities[target];
                if (!ab || ab.level < value) {
                  isAvailable = false;
                  reqNotice = `(Requires ${ab ? ab.name : target} Level ${value})`;
                }
              } else if (type === 'item') {
                const it = items[target];
                if (!it || it.quantity < value) {
                  isAvailable = false;
                  reqNotice = `(Requires item: ${it ? it.name : target})`;
                }
              } else if (type === 'money') {
                if (money < value) {
                  isAvailable = false;
                  reqNotice = `(Requires $${value} - you have $${money})`;
                }
              } else if (type === 'trust') {
                const ch = characters[target];
                if (!ch || ch.trust < value) {
                  isAvailable = false;
                  reqNotice = `(Requires ${ch ? ch.name : target} Trust ${value}%+)`;
                }
              }
            }

            return (
              <button
                key={idx}
                disabled={!isAvailable}
                onClick={() => {
                  if (choice.consequences.combat) {
                    sounds.playSlash();
                  } else if (choice.energyCost) {
                    sounds.playMagic();
                  } else {
                    sounds.playBite();
                  }
                  onChoose(choice);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 text-xs md:text-sm font-serif ${
                  isAvailable
                    ? 'bg-[#1b1725] hover:bg-[#2c1d2e] border-[#432d43] hover:border-red-600 text-[#f0e3db] cursor-pointer hover:translate-x-1'
                    : 'bg-[#100f16] border-[#221c27] text-[#6d616c] cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-xs font-bold text-red-400 mt-0.5">
                    [{idx + 1}]
                  </span>
                  <div>
                    <span className="font-medium leading-snug">{choice.text}</span>
                    {reqNotice && (
                      <span className="block text-[11px] text-amber-500 font-sans mt-0.5">
                        {reqNotice}
                      </span>
                    )}
                  </div>
                </div>

                {choice.energyCost && isAvailable && (
                  <span className="flex-shrink-0 flex items-center gap-1 text-xs text-blue-400 font-mono px-2 py-0.5 rounded bg-blue-950/40 border border-blue-900/60">
                    <Zap className="w-3 h-3" />
                    -{choice.energyCost}⚡
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { NPCCharacter } from '../types';
import { Users, X, Heart } from 'lucide-react';

interface RelationshipsModalProps {
  characters: Record<string, NPCCharacter>;
  onClose: () => void;
}

export function RelationshipsModal({
  characters,
  onClose
}: RelationshipsModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Devoted':
      case 'Allied':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800';
      case 'Friendly':
        return 'text-teal-300 bg-teal-950/60 border-teal-800';
      case 'Neutral':
        return 'text-blue-300 bg-blue-950/60 border-blue-800';
      case 'Distrustful':
        return 'text-amber-400 bg-amber-950/60 border-amber-800';
      case 'Hostile':
      default:
        return 'text-red-400 bg-red-950/60 border-red-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#14121b] border-2 border-[#543449] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#1c1825] px-6 py-4 border-b border-[#3e2637] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-rose-400" />
            <h2 className="font-cinzel text-lg font-bold text-[#f5ebd8] tracking-wide">
              Nocturnal Covens & Allegiances
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#231b26] hover:bg-[#382637] text-gray-400 hover:text-white border border-[#442c3d] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Characters Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {Object.values(characters).map((char) => (
            <div
              key={char.id}
              className="p-4 rounded-xl bg-[#1a1624] border border-[#3b2b3a] hover:border-[#633e5a] flex flex-col justify-between gap-3 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-lg bg-black/50 border border-[#4d3246]">
                      {char.portraitIcon}
                    </span>
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#ebd9cd]">
                        {char.name}
                      </h4>
                      <p className="text-[11px] text-[#9b8593] font-serif italic">
                        {char.title}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-cinzel font-bold px-2 py-0.5 rounded border ${getStatusColor(char.status)}`}>
                    {char.status}
                  </span>
                </div>

                <p className="text-xs text-[#b8a7b1] font-serif leading-relaxed line-clamp-3">
                  {char.description}
                </p>
              </div>

              {/* Trust bar */}
              <div className="pt-2 border-t border-[#2a222f]">
                <div className="flex justify-between text-[11px] font-mono text-[#a895a0] mb-1">
                  <span className="flex items-center gap-1 text-rose-300">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Trust Score
                  </span>
                  <span>{char.trust} / 100</span>
                </div>
                <div className="w-full h-2 rounded bg-black/60 border border-[#3d2c3b] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-800 to-red-500 transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(100, char.trust))}%` }}
                  />
                </div>
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
            Close Roster
          </button>
        </div>
      </div>
    </div>
  );
}

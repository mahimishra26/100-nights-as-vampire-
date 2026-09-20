import { EndingResult } from '../types';
import { Skull, Crown, Heart, Sun, Flame, RotateCcw } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface EndingModalProps {
  ending: EndingResult;
  night: number;
  onRestart: () => void;
}

export function EndingModal({ ending, night, onRestart }: EndingModalProps) {
  const getEndingIcon = () => {
    switch (ending.id) {
      case 'vampire_ruler':
        return <Crown className="w-12 h-12 text-amber-400" />;
      case 'human_love':
        return <Heart className="w-12 h-12 text-rose-400 fill-rose-500/40" />;
      case 'redemption':
        return <Sun className="w-12 h-12 text-yellow-400" />;
      case 'dark_lord':
        return <Flame className="w-12 h-12 text-red-500" />;
      case 'defeated':
      default:
        return <Skull className="w-12 h-12 text-red-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14101b] border-2 border-red-700/80 shadow-[0_0_80px_rgba(220,38,38,0.5)] overflow-hidden flex flex-col text-center p-8">
        {/* Glowing Icon */}
        <div className="mx-auto mb-4 p-4 rounded-full bg-black/60 border border-red-800/80 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
          {getEndingIcon()}
        </div>

        {/* Badge & Title */}
        <div className="mb-2">
          <span className="text-xs font-mono px-3 py-1 rounded bg-red-950/80 border border-red-800 text-red-300 uppercase tracking-widest">
            {ending.badge} • SURVIVED {night} NIGHTS
          </span>
        </div>

        <h2 className="font-cinzel text-2xl md:text-3xl font-bold text-red-100 mb-4 tracking-wide">
          {ending.title}
        </h2>

        {/* Epilogue Text */}
        <div className="bg-[#0b0912]/80 border border-[#3b2333] p-6 rounded-xl text-sm md:text-base font-serif text-[#decbc0] leading-relaxed whitespace-pre-line mb-6 max-h-60 overflow-y-auto">
          {ending.description}
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              sounds.playOrganChord();
              onRestart();
            }}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-red-900 to-[#4a1c32] hover:from-red-800 hover:to-[#632442] text-red-100 font-cinzel font-bold text-sm tracking-wider shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Awaken for a New 100 Nights</span>
          </button>
        </div>
      </div>
    </div>
  );
}

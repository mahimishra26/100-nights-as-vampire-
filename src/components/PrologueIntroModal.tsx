import { Droplet, Moon, ShieldAlert, Sparkles, Play } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface PrologueIntroModalProps {
  onStartGame: () => void;
}

export function PrologueIntroModal({ onStartGame }: PrologueIntroModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14111c] border-2 border-red-700/80 shadow-[0_0_80px_rgba(220,38,38,0.45)] overflow-hidden flex flex-col p-6 md:p-8 text-center">
        {/* Blood Moon Emblem */}
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-red-950/70 border-2 border-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.5)]">
          <Droplet className="w-8 h-8 text-red-500 fill-red-500 animate-pulse" />
        </div>

        {/* Title */}
        <span className="text-xs font-mono text-red-400 tracking-widest uppercase mb-1">
          ✦ Oakhaven Chronicles ✦
        </span>
        <h1 className="font-cinzel text-2xl md:text-3xl font-black text-red-100 tracking-wider mb-3">
          100 NIGHTS AS A VAMPIRE
        </h1>

        {/* Story Intro Text */}
        <div className="bg-[#0b0a12]/80 border border-[#3b2333] p-5 rounded-xl text-xs md:text-sm font-serif text-[#decbc0] leading-relaxed text-left space-y-2.5 mb-6">
          <p>
            You awaken on cold flagstones beneath the dripping gargoyles of <strong>Oakhaven</strong>.
            Your pulse is silent. Your skin is cold as marble. In your throat, a ravenous, burning thirst has taken root.
          </p>
          <p>
            Lord Valerius, your ancient sire, pulls back his black mantle:
            <em className="text-red-300 block mt-1">
              "You have been reborn, fledgling. In one hundred nights, the celestial Blood Moon will rise to either crown a new immortal sovereign or purge our kind forever. Maintain your secrecy from the mortal inquisitors, master your thirst, and choose your allegiances wisely."
            </em>
          </p>
        </div>

        {/* Core Rules Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-6 text-left">
          <div className="p-2.5 rounded-lg bg-[#1a1424] border border-[#432d43] text-xs">
            <span className="text-red-400 font-bold block">🩸 Thirst Management</span>
            <span className="text-[11px] text-[#a895a0]">Keep hunger below 75% or risk feral frenzy and HP damage.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#1a1424] border border-[#432d43] text-xs">
            <span className="text-amber-400 font-bold block">🕵️ Secrecy</span>
            <span className="text-[11px] text-[#a895a0]">Don't let secrecy reach 0%, or inquisitors will execute you at dawn.</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#1a1424] border border-[#432d43] text-xs">
            <span className="text-purple-400 font-bold block">⚡ 7 Disciplines</span>
            <span className="text-[11px] text-[#a895a0]">Unlock speed, hypnosis, bat form, and shadow steps with coin.</span>
          </div>
        </div>

        {/* Begin Journey Button */}
        <button
          onClick={() => {
            sounds.playOrganChord();
            onStartGame();
          }}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-900 to-[#501c34] hover:from-red-800 hover:to-[#6c2347] text-white font-cinzel font-bold text-sm tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>AWAKEN TO NIGHT 1 (BEGIN SURVIVAL)</span>
        </button>
      </div>
    </div>
  );
}

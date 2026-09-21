import React from 'react';
import { Play, RotateCcw, HelpCircle, Settings, Terminal, Monitor, Download, Moon, Skull, ShieldAlert, Sparkles } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface MainMenuScreenProps {
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
  onOpenTerminal: () => void;
  onOpenPygameWindow: () => void;
  onOpenPythonHub: () => void;
}

export const MainMenuScreen: React.FC<MainMenuScreenProps> = ({
  hasSavedGame,
  onNewGame,
  onContinueGame,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenTerminal,
  onOpenPygameWindow,
  onOpenPythonHub
}) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Ambient background gothic aura */}
      <div className="absolute inset-0 bg-radial from-red-950/20 via-transparent to-black pointer-events-none" />

      {/* Pulsing blood moon visual */}
      <div className="relative mb-6 flex items-center justify-center">
        <div className="absolute w-44 h-44 rounded-full bg-red-600/15 blur-3xl animate-pulse pointer-events-none" />
        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#3b0811] via-[#75111d] to-[#e63946] border-2 border-[#ff758f]/40 shadow-[0_0_50px_rgba(230,57,70,0.5)] flex items-center justify-center relative overflow-hidden">
          <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full bg-black/40 blur-sm" />
          <div className="absolute bottom-2 left-3 w-10 h-10 rounded-full bg-black/30 blur-sm" />
          <Moon className="w-12 h-12 text-red-100/90 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
        </div>
      </div>

      {/* Gothic Titles */}
      <div className="text-center max-w-2xl mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-cinzel mb-3 tracking-widest uppercase shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>A Gothic Nocturnal Survival RPG</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h1 className="text-4xl md:text-6xl font-cinzel font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#f8edeb] via-[#e5989b] to-[#b7094c] drop-shadow-[0_4px_16px_rgba(183,9,76,0.6)]">
          100 NIGHTS AS A VAMPIRE
        </h1>

        <p className="mt-3 text-sm md:text-base font-serif text-[#d8c3c8] max-w-xl mx-auto leading-relaxed">
          Awaken in the fog-drenched Victorian city of Oakhaven. Stalk through gaslit alleys, manage your burning bloodthirst, conceal your immortality from inquisitors, and unravel the dark mystery of your sire before the centennial Blood Moon.
        </p>
      </div>

      {/* Main Action Menu Buttons */}
      <div className="w-full max-w-md space-y-3 relative z-10">
        <button
          onClick={() => {
            sounds.playBite();
            onNewGame();
          }}
          className="w-full group py-4 px-6 rounded-xl bg-gradient-to-r from-[#590d22] via-[#800f2f] to-[#a4133c] hover:from-[#800f2f] hover:to-[#c9184a] text-white font-cinzel font-bold text-base tracking-wider border border-red-500/50 shadow-[0_0_24px_rgba(164,19,60,0.4)] hover:shadow-[0_0_35px_rgba(201,24,74,0.7)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <Play className="w-5 h-5 text-amber-300 fill-amber-300" />
            <span>AWAKEN ANEW (NEW GAME)</span>
          </span>
          <span className="text-xs font-mono text-red-200/80 group-hover:text-white transition-colors">Start Night 1 →</span>
        </button>

        {hasSavedGame && (
          <button
            onClick={() => {
              sounds.playMagic();
              onContinueGame();
            }}
            className="w-full group py-3.5 px-6 rounded-xl bg-[#1c1220] hover:bg-[#2e1933] text-[#e0aaff] font-cinzel font-bold text-sm tracking-wider border border-purple-800/60 shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between"
          >
            <span className="flex items-center gap-3">
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>CONTINUE SAVED NOCTURNE</span>
            </span>
            <span className="text-xs font-mono text-purple-300/80">Resume →</span>
          </button>
        )}

        <button
          onClick={() => {
            sounds.playClick();
            onOpenHowToPlay();
          }}
          className="w-full py-3 px-6 rounded-xl bg-[#130f18]/90 hover:bg-[#201826] text-[#decbc0] hover:text-white font-cinzel font-semibold text-sm tracking-wide border border-[#3e2439] shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>HOW TO SURVIVE 100 NIGHTS</span>
          </span>
          <span className="text-xs text-[#8a7a85]">Vampire Manual</span>
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onOpenSettings();
          }}
          className="w-full py-3 px-6 rounded-xl bg-[#130f18]/90 hover:bg-[#201826] text-[#decbc0] hover:text-white font-cinzel font-semibold text-sm tracking-wide border border-[#3e2439] shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <span className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-blue-400" />
            <span>SETTINGS & AUDIO PREFERENCES</span>
          </span>
          <span className="text-xs text-[#8a7a85]">Audio / Difficulty</span>
        </button>
      </div>

      {/* Alternative Play Engines row */}
      <div className="mt-8 pt-6 border-t border-[#382333]/80 w-full max-w-xl flex flex-wrap items-center justify-center gap-3 relative z-10 text-xs">
        <span className="text-[#8e7a88] font-serif">Play Modes:</span>

        <button
          onClick={onOpenPygameWindow}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1526] hover:bg-[#281f3b] text-purple-200 border border-purple-800/50 transition-colors cursor-pointer"
        >
          <Monitor className="w-3.5 h-3.5 text-purple-400" />
          <span>Pygame 1280×720 Window</span>
        </button>

        <button
          onClick={onOpenTerminal}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f1d17] hover:bg-[#152e22] text-emerald-200 border border-emerald-800/50 transition-colors cursor-pointer"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>In-Browser Python CLI</span>
        </button>

        <button
          onClick={onOpenPythonHub}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#261c16] hover:bg-[#3d2b21] text-amber-200 border border-amber-800/50 transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Python Source (.zip)</span>
        </button>
      </div>
    </div>
  );
};

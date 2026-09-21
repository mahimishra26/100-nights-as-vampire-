import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowLeft, RotateCcw, ShieldAlert, Monitor, Terminal, Download, Sliders, HelpCircle } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface SettingsScreenProps {
  onBack: () => void;
  onResetGame: () => void;
  onReturnToMainMenu: () => void;
  onOpenTerminal: () => void;
  onOpenPygameWindow: () => void;
  onOpenPythonHub: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onResetGame,
  onReturnToMainMenu,
  onOpenTerminal,
  onOpenPygameWindow,
  onOpenPythonHub
}) => {
  const [soundEnabled, setSoundEnabled] = useState(sounds.isSoundEnabled());
  const [difficulty, setDifficulty] = useState<'Story' | 'Standard' | 'Nightmare'>('Standard');

  const toggleAudio = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setSoundEnabled(next);
    if (next) sounds.playClick();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382333]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <h2 className="text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-purple-200 to-amber-200">
          ⚙️ GAME SETTINGS & PREFERENCES
        </h2>

        <div className="w-16" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Audio & Ambience */}
        <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-4">
          <div className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <span>Audio & Soundscapes</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-[#2d1b2a]">
            <div>
              <div className="text-sm font-cinzel font-semibold text-white">Synthesized Audio & SFX</div>
              <div className="text-xs font-serif text-[#8e7a88]">Bites, claws, spells, and footsteps</div>
            </div>
            <button
              onClick={toggleAudio}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                soundEnabled
                  ? 'bg-red-950/80 border-red-500 text-red-200 shadow-md'
                  : 'bg-gray-900 border-gray-700 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Difficulty Level */}
        <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-4">
          <div className="text-xs font-cinzel font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            <span>Vampiric Challenge & Difficulty</span>
          </div>

          <div className="space-y-2">
            {[
              { id: 'Story', title: 'Story (Fledgling Walk)', desc: 'Generous blood, slower hunger drain, lower hunter damage.' },
              { id: 'Standard', title: 'Standard (Gothic Night)', desc: 'Balanced survival against hunters, wolves, and thirst.' },
              { id: 'Nightmare', title: 'Blood Moon Nightmare', desc: 'Aggressive inquisitors, lethal starvation, scarce prey.' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  sounds.playClick();
                  setDifficulty(d.id as any);
                }}
                className={`w-full p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  difficulty === d.id
                    ? 'bg-red-950/70 border-red-500 text-white font-bold'
                    : 'bg-black/30 border-[#2d1b2a] text-[#8e7a88] hover:text-white'
                }`}
              >
                <div className="text-xs font-cinzel">{d.title}</div>
                <div className="text-[11px] font-serif text-[#b8a2ad] mt-0.5">{d.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Alternative Launchers */}
        <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-4">
          <div className="text-xs font-cinzel font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            <span>Alternate Play Environments</span>
          </div>

          <div className="space-y-2.5">
            <button
              onClick={onOpenPygameWindow}
              className="w-full p-3 rounded-xl bg-[#1a1426] hover:bg-[#281f3b] border border-purple-800/50 text-purple-200 text-xs font-cinzel flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-purple-400" />
                <span>Pygame 1280×720 Canvas Mode</span>
              </span>
              <span className="text-gray-400">Launch →</span>
            </button>

            <button
              onClick={onOpenTerminal}
              className="w-full p-3 rounded-xl bg-[#0f1d17] hover:bg-[#152e22] border border-emerald-800/50 text-emerald-200 text-xs font-cinzel flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Interactive Python CLI Console</span>
              </span>
              <span className="text-gray-400">Launch →</span>
            </button>

            <button
              onClick={onOpenPythonHub}
              className="w-full p-3 rounded-xl bg-[#261c16] hover:bg-[#3d2b21] border border-amber-800/50 text-amber-200 text-xs font-cinzel flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Python Game Engine (.zip)</span>
              </span>
              <span className="text-gray-400">Export →</span>
            </button>
          </div>
        </div>

        {/* Data & Session Controls */}
        <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-4">
          <div className="text-xs font-cinzel font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Chronicle Reset & Navigation</span>
          </div>

          <div className="space-y-3">
            <button
              onClick={onReturnToMainMenu}
              className="w-full py-3 px-4 rounded-xl bg-[#1e1526] hover:bg-[#321f42] text-purple-200 font-cinzel text-xs font-bold border border-purple-800/50 cursor-pointer transition-all"
            >
              RETURN TO MAIN LANDING SCREEN
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset current vampire profile and nocturnal progress?')) {
                  onResetGame();
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-red-950/60 hover:bg-red-900/80 text-red-200 font-cinzel text-xs font-bold border border-red-700/60 cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-red-400" />
              <span>RESET IMMORTAL PROGRESS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

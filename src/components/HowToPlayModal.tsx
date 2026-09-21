import React from 'react';
import { X, Play, Monitor, Terminal, Download, ExternalLink, ShieldCheck, Sparkles, Droplet } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface HowToPlayModalProps {
  onClose: () => void;
  onSelectMode: (mode: 'web' | 'pygame' | 'terminal') => void;
  onOpenPythonHub: () => void;
}

export function HowToPlayModal({ onClose, onSelectMode, onOpenPythonHub }: HowToPlayModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#120f1c] border-2 border-[#592c4d] shadow-[0_0_90px_rgba(200,30,80,0.4)] flex flex-col p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#3b233a] pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-600 flex items-center justify-center text-red-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-cinzel text-lg md:text-xl font-bold text-red-100">
                All Ways to Play “100 Nights as a Vampire”
              </h2>
              <p className="text-xs text-gray-400">
                Choose your preferred way to play — in browser, desktop window, or Python terminal!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-red-950/80 text-gray-400 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 In-Browser Play Options */}
        <div className="mb-6">
          <span className="text-xs font-mono text-amber-400 tracking-wider uppercase font-bold block mb-2">
            ✦ Play Directly in This Browser (No Setup Required)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Option 1: Modern Web RPG */}
            <div className="p-4 rounded-xl bg-[#191426] border border-[#432d43] hover:border-red-600 flex flex-col justify-between transition-all">
              <div>
                <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-700 flex items-center justify-center mb-2 text-red-400">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-white mb-1">Modern Gothic GUI</h4>
                <p className="text-[11px] text-[#decbc0] leading-relaxed mb-3">
                  Full atmospheric web interface with dynamic mist canvas, moon phases, cards, sound synthesizer, and combat dialogs.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playOrganChord();
                  onSelectMode('web');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-red-900 hover:bg-red-800 text-white text-xs font-bold font-cinzel cursor-pointer"
              >
                Play Modern View
              </button>
            </div>

            {/* Option 2: Pygame Desktop Window Simulator */}
            <div className="p-4 rounded-xl bg-[#191426] border border-[#432d43] hover:border-purple-600 flex flex-col justify-between transition-all">
              <div>
                <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700 flex items-center justify-center mb-2 text-purple-400">
                  <Monitor className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-white mb-1">Pygame 1280×720 View</h4>
                <p className="text-[11px] text-[#decbc0] leading-relaxed mb-3">
                  Simulates the exact 1280x720 desktop Pygame window with CRT scanlines, 60 FPS HUD, hotkeys, and district navigator.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playOrganChord();
                  onSelectMode('pygame');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-[#3b1f47] hover:bg-[#522963] text-purple-200 text-xs font-bold font-cinzel cursor-pointer"
              >
                Play Pygame Window
              </button>
            </div>

            {/* Option 3: Python Terminal CLI */}
            <div className="p-4 rounded-xl bg-[#191426] border border-[#432d43] hover:border-emerald-600 flex flex-col justify-between transition-all">
              <div>
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-700 flex items-center justify-center mb-2 text-emerald-400">
                  <Terminal className="w-4 h-4" />
                </div>
                <h4 className="font-cinzel text-sm font-bold text-white mb-1">In-Browser Python CLI</h4>
                <p className="text-[11px] text-[#decbc0] leading-relaxed mb-3">
                  Interactive retro terminal emulator. Type commands like <code>explore</code>, <code>feed</code>, <code>rest</code> with ANSI colors.
                </p>
              </div>
              <button
                onClick={() => {
                  sounds.playBite();
                  onSelectMode('terminal');
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-[#143324] hover:bg-[#1e4d36] text-emerald-200 text-xs font-bold font-cinzel cursor-pointer"
              >
                Launch CLI Terminal
              </button>
            </div>
          </div>
        </div>

        {/* 2 Local Desktop Execution Options */}
        <div>
          <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-bold block mb-2">
            ✦ Run on Your Computer (Local Terminal / Python)
          </span>

          <div className="space-y-3">
            {/* Way A: With Pygame (Graphical Desktop Window) */}
            <div className="p-3.5 rounded-xl bg-[#141020] border border-[#3b233a] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="text-purple-400 font-mono">1. Native Pygame Desktop GUI Window</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800">
                    Graphical Window
                  </span>
                </div>
                <p className="text-gray-400 mt-1">
                  Requires <code className="text-yellow-300">pip install pygame</code>. Launches an actual 1280x720 window on your PC.
                </p>
                <div className="mt-2 bg-black/60 p-2 rounded font-mono text-emerald-400 text-[11px]">
                  pip install pygame && python main.py
                </div>
              </div>

              <button
                onClick={onOpenPythonHub}
                className="px-3 py-2 rounded bg-purple-900/80 hover:bg-purple-800 text-purple-100 font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 self-start md:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Get Source (.zip)</span>
              </button>
            </div>

            {/* Way B: Zero-Dependency Pure Python CLI */}
            <div className="p-3.5 rounded-xl bg-[#141020] border border-[#3b233a] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span className="text-emerald-400 font-mono">2. Zero-Dependency Terminal Game (cli_game.py)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                    No Pygame Needed!
                  </span>
                </div>
                <p className="text-gray-400 mt-1">
                  Works on ANY computer with Python 3.8+ installed (no pip or C compiler required!).
                </p>
                <div className="mt-2 bg-black/60 p-2 rounded font-mono text-emerald-400 text-[11px]">
                  python3 100_nights_vampire/cli_game.py
                </div>
              </div>

              <button
                onClick={onOpenPythonHub}
                className="px-3 py-2 rounded bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-bold flex items-center gap-1.5 cursor-pointer flex-shrink-0 self-start md:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .zip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

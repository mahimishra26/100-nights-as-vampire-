import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Moon, Zap, Eye, Coins } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface TutorialProps {
  onStartGame: () => void;
}

export const TutorialScreen: React.FC<TutorialProps> = ({ onStartGame }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/50 text-purple-300 font-bold tracking-wider uppercase">
          Screen #5: How To Play
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-purple-100">
          How to Survive 100 Nights 🌙
        </h1>
        <p className="text-sm text-purple-300 max-w-lg mx-auto">
          “Survive 100 nights. Keep your secret. Make friends. Have fun.”
        </p>
      </div>

      {/* The 4 Main Simple Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Hunger */}
        <div className="p-4 rounded-3xl bg-[#1d1533] border-2 border-red-500/40 flex items-start gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-red-950 text-2xl border border-red-700/50">
            🩸
          </div>
          <div>
            <h3 className="text-base font-bold text-red-200">Hunger</h3>
            <p className="text-xs text-purple-300 mt-1">
              Drink berry juice, snacks, or animal nectar before this fills up! High hunger drains your energy.
            </p>
          </div>
        </div>

        {/* Secrecy */}
        <div className="p-4 rounded-3xl bg-[#1d1533] border-2 border-amber-500/40 flex items-start gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-amber-950 text-2xl border border-amber-700/50">
            🕵️
          </div>
          <div>
            <h3 className="text-base font-bold text-amber-200">Secrecy</h3>
            <p className="text-xs text-purple-300 mt-1">
              Shows how close humans and hunter Leo are to discovering you are a vampire. Keep excuses ready!
            </p>
          </div>
        </div>

        {/* Energy */}
        <div className="p-4 rounded-3xl bg-[#1d1533] border-2 border-blue-500/40 flex items-start gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-blue-950 text-2xl border border-blue-700/50">
            ⚡
          </div>
          <div>
            <h3 className="text-base font-bold text-blue-200">Energy</h3>
            <p className="text-xs text-purple-300 mt-1">
              Powers your vampire abilities like Bat Form 🦇 and Night Vision 🌙. Rest in bed or drink moon tea.
            </p>
          </div>
        </div>

        {/* Friendship & Coins */}
        <div className="p-4 rounded-3xl bg-[#1d1533] border-2 border-pink-500/40 flex items-start gap-3 shadow-lg">
          <div className="p-3 rounded-2xl bg-pink-950 text-2xl border border-pink-700/50">
            ❤️
          </div>
          <div>
            <h3 className="text-base font-bold text-pink-200">Friendship & Coins</h3>
            <p className="text-xs text-purple-300 mt-1">
              Bond with Maya, Alex, Luna, Leo, and Ruby. Spend coins 🪙 at the shop for cloaks, crystals, and treats.
            </p>
          </div>
        </div>
      </div>

      {/* Day vs Night Cycle */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-700/40 space-y-3">
        <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          The Two Phases of Every Day
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-purple-300">
          <div className="p-3 rounded-2xl bg-[#171129] border border-purple-800/40">
            <span className="text-amber-400 font-bold text-sm block mb-1">☀️ Daytime</span>
            Explore the town, chat with Maya at school, shop with Luna, uncover clues, and rest up.
          </div>
          <div className="p-3 rounded-2xl bg-[#171129] border border-purple-800/40">
            <span className="text-indigo-400 font-bold text-sm block mb-1">🌙 Nighttime</span>
            Manage hunger, choose nocturnal locations, use unlocked powers, solve mini-games, and return safely home!
          </div>
        </div>
      </div>

      {/* Ready Button */}
      <div className="text-center pt-2">
        <button
          onClick={() => {
            sounds.playAchievement();
            onStartGame();
          }}
          className="px-8 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 mx-auto transition-transform active:scale-95"
        >
          <span>I'm Ready! Enter Night 1</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { PlayerStats, VampireProfile, StoryJournal } from '../../types';
import {
  MapPin,
  Moon,
  Clock,
  Heart,
  Droplet,
  Eye,
  Zap,
  Coins,
  Compass,
  Sword,
  Sparkles,
  BookOpen,
  Users,
  Package,
  Settings,
  ChevronRight,
  Flame,
  AlertTriangle,
  Info
} from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface DashboardScreenProps {
  stats: PlayerStats;
  profile: VampireProfile;
  journal: StoryJournal;
  latestLog: string;
  dawnReport: string | null;
  onNavigate: (screenId: string) => void;
  onQuickFeed: (type: 'rats' | 'bag' | 'stealth_mortal') => void;
  onEndNight: () => void;
  onJumpNight: (night: number) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  stats,
  profile,
  journal,
  latestLog,
  dawnReport,
  onNavigate,
  onQuickFeed,
  onEndNight,
  onJumpNight
}) => {
  const nightsLeft = 100 - stats.night;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Night Progression & Blood Moon Notice */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#2a1325]/90 via-[#1c1221]/90 to-[#120f18]/90 border border-[#592b4a] shadow-xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-600/50 flex items-center justify-center text-red-300 shadow-[0_0_15px_rgba(230,57,70,0.3)]">
            <Moon className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-black text-lg text-white tracking-wider">
                NIGHT {stats.night} / 100
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-red-900/60 border border-red-700/60 text-red-200 font-mono">
                {nightsLeft} Nights to Blood Moon
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#decbc0] font-serif mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-400" /> Oakhaven Safehouse
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-purple-400" /> 11:45 PM (The Witching Hour)
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Fast-Forward Testing */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8e7a88] font-serif">Milestones:</span>
          {[25, 50, 75, 99].map((n) => (
            <button
              key={n}
              onClick={() => {
                sounds.playMagic();
                onJumpNight(n);
              }}
              className="px-2.5 py-1 rounded bg-[#1e1526] hover:bg-[#341e45] text-purple-200 border border-purple-800/60 font-mono cursor-pointer transition-colors"
            >
              N{n}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left 8 Cols (Chronicle & Quick Actions), Right 4 Cols (Persona & Nav Hub) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 space-y-6">
          {/* Dawn Report / Night Summary (if present) */}
          {dawnReport && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 via-[#261527]/80 to-[#120f18]/70 border border-red-800/60 shadow-lg flex items-center justify-between text-xs text-red-200 font-cinzel backdrop-blur-sm animate-fadeIn">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{dawnReport}</span>
              </div>
            </div>
          )}

          {/* Dedicated Event & Chronicle Story Stage */}
          <div className="p-6 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-xl relative overflow-hidden backdrop-blur-md space-y-4">
            <div className="flex items-center justify-between border-b border-[#2d1b2a] pb-3">
              <div className="flex items-center gap-2 text-red-400 font-cinzel font-bold text-sm tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>Active Objective & City Chronicle</span>
              </div>
              <span className="text-xs text-amber-300 font-mono">Chapter: Awakening</span>
            </div>

            {/* Main Objective */}
            <div className="p-3.5 rounded-xl bg-[#1d1425]/70 border border-[#482842]">
              <div className="text-xs text-amber-300 font-cinzel font-bold mb-1">
                Current Main Quest:
              </div>
              <p className="text-sm font-serif text-[#decbc0] leading-relaxed">
                {journal.currentObjective ||
                  'Uncover the identity of the ancient elder who sired you and maintain secrecy before detective Alexander Cross detects your presence.'}
              </p>
            </div>

            {/* Latest Event Narrative */}
            <div>
              <div className="text-xs text-[#8e7a88] font-cinzel uppercase tracking-wider mb-2">
                Latest Sanctuary Chronicle:
              </div>
              <div className="p-4 rounded-xl bg-black/40 border border-[#382333] text-sm font-serif text-white/90 leading-relaxed italic">
                "{latestLog}"
              </div>
            </div>

            {/* Quick Nocturnal Satiation / Feeding Actions */}
            <div className="pt-2 border-t border-[#2d1b2a]">
              <div className="text-xs font-cinzel font-bold text-red-400 mb-2 flex items-center justify-between">
                <span>🩸 Quick Blood Satiation (Haven Feeds)</span>
                <span className="text-[11px] font-serif text-[#b8a2ad]">Current Thirst: {stats.hunger}%</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={() => onQuickFeed('rats')}
                  className="p-2.5 rounded-lg bg-[#1a1422] hover:bg-[#2c1a3b] border border-[#382333] text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-cinzel font-bold text-gray-200">Alley Rats</div>
                  <div className="text-[10px] text-emerald-400 font-mono">-20 Thirst | 0 Risk</div>
                </button>
                <button
                  onClick={() => onQuickFeed('bag')}
                  className="p-2.5 rounded-lg bg-[#24111d] hover:bg-[#381628] border border-red-800/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-cinzel font-bold text-red-200">Refrigerated Pack</div>
                  <div className="text-[10px] text-red-300 font-mono">-45 Thirst | $30 Gold</div>
                </button>
                <button
                  onClick={() => onQuickFeed('stealth_mortal')}
                  className="p-2.5 rounded-lg bg-[#1e1124] hover:bg-[#32173d] border border-purple-800/40 text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-cinzel font-bold text-purple-200">Mesmerize Mortal</div>
                  <div className="text-[10px] text-purple-300 font-mono">-50 Thirst | -8 Secrecy</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right 4 Columns: Persona Card & Direct Screen Navigation */}
        <div className="lg:col-span-4 space-y-4">
          {/* Persona Card */}
          <div className="p-4 rounded-2xl bg-[#150f1a]/95 border border-[#442840] shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#3b0811] to-[#75111d] border border-red-500/50 flex items-center justify-center text-lg font-cinzel text-red-200 shadow-md">
                🧛
              </div>
              <div>
                <h3 className="font-cinzel font-bold text-white text-base">
                  {profile.name}
                </h3>
                <p className="text-xs text-amber-300 font-serif">
                  {profile.outfit} • {profile.personality}
                </p>
              </div>
            </div>

            {/* Quick Vitals Summary */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-black/40 border border-[#2d1b2a] flex items-center justify-between">
                <span className="text-emerald-400">❤️ HP:</span>
                <span className="text-white">{stats.health}/{stats.maxHealth}</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-[#2d1b2a] flex items-center justify-between">
                <span className="text-red-400">🩸 Thirst:</span>
                <span className="text-white">{stats.hunger}%</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-[#2d1b2a] flex items-center justify-between">
                <span className="text-purple-400">🕵️ Secrecy:</span>
                <span className="text-white">{stats.secrecy}%</span>
              </div>
              <div className="p-2 rounded bg-black/40 border border-[#2d1b2a] flex items-center justify-between">
                <span className="text-amber-400">💰 Gold:</span>
                <span className="text-white">${stats.money}</span>
              </div>
            </div>
          </div>

          {/* Primary Navigation Hub to 7+ Pages */}
          <div className="p-4 rounded-2xl bg-[#150f1a]/95 border border-[#442840] shadow-lg backdrop-blur-md space-y-2">
            <div className="text-xs font-cinzel font-bold text-red-300 uppercase tracking-wider mb-2">
              Nocturnal Navigation
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('map');
              }}
              className="w-full p-3 rounded-xl bg-[#1e1427] hover:bg-[#311c43] text-left border border-purple-800/40 text-white flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 text-xs font-cinzel font-bold">
                <Compass className="w-4 h-4 text-purple-400" />
                <span>🗺️ City Map / 9 Districts</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('hunting');
              }}
              className="w-full p-3 rounded-xl bg-[#29101b] hover:bg-[#401529] text-left border border-red-800/50 text-white flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 text-xs font-cinzel font-bold">
                <Sword className="w-4 h-4 text-red-400" />
                <span>🩸 Stalk Prey & Combat</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('abilities');
              }}
              className="w-full p-3 rounded-xl bg-[#191426] hover:bg-[#2b2045] text-left border border-blue-800/40 text-white flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 text-xs font-cinzel font-bold">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>⚡ Vampire Disciplines & Satchel</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('relationships');
              }}
              className="w-full p-3 rounded-xl bg-[#1f1322] hover:bg-[#341d3a] text-left border border-rose-800/40 text-white flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 text-xs font-cinzel font-bold">
                <Users className="w-4 h-4 text-rose-400" />
                <span>❤️ Relationships & Story Journal</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('settings');
              }}
              className="w-full p-3 rounded-xl bg-[#14121b] hover:bg-[#221c30] text-left border border-[#3e2439] text-white flex items-center justify-between cursor-pointer transition-all"
            >
              <div className="flex items-center gap-2.5 text-xs font-cinzel font-bold">
                <Settings className="w-4 h-4 text-gray-400" />
                <span>⚙️ Settings & Archives</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>

            {/* End Night Button */}
            <button
              onClick={() => {
                sounds.playBite();
                onEndNight();
              }}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#800f2f] to-[#a4133c] hover:from-[#a4133c] hover:to-[#c9184a] text-white font-cinzel font-bold text-xs tracking-wider border border-red-500/60 shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Moon className="w-4 h-4 text-amber-300" />
              <span>REST UNTIL NEXT DUSK (END NIGHT)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ScreenId, PlayerStats, VampireProfile, MysteryClue, Achievement, MemoryMoment } from '../types';
import {
  Trophy,
  Gift,
  CheckCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Calendar,
  Share2,
  Clock
} from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface RewardsEndingsProps {
  screenId: 'mystery' | 'daily_reward' | 'night_summary' | 'achievements' | 'game_progress' | 'ending' | 'replay';
  onNavigate: (screen: ScreenId) => void;
  stats: PlayerStats;
  profile: VampireProfile;
  clues: MysteryClue[];
  achievements: Achievement[];
  memories: MemoryMoment[];
  onClaimDaily?: () => void;
  onRestartStory?: () => void;
  onAdvanceNight?: () => void;
}

export const RewardsAndEndingsScreens: React.FC<RewardsEndingsProps> = ({
  screenId,
  onNavigate,
  stats,
  profile,
  clues,
  achievements,
  memories,
  onClaimDaily,
  onRestartStory,
  onAdvanceNight
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* SCREEN 24: MYSTERY CLUES BOARD */}
      {screenId === 'mystery' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-900 border border-indigo-500 text-indigo-300 font-bold uppercase">
                Screen #24: Mystery Board
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Secrets of Your Transformation 🔍</h1>
              <p className="text-xs text-purple-300">
                Collect all 5 ancient clues across the 100 nights to discover who turned you into a vampire!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clues.map((c) => (
              <div key={c.id} className="p-5 rounded-3xl bg-[#1c1433] border-2 border-purple-700/60 shadow-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{c.icon}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950 text-amber-300 font-mono">
                    Found Night {c.discoveredAtNight}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{c.title}</h3>
                <p className="text-xs text-purple-300 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 25: DAILY REWARD POPUP SCREEN */}
      {screenId === 'daily_reward' && (
        <div className="space-y-6 max-w-lg mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900 border border-amber-500 text-amber-300 font-bold uppercase">
              Screen #25: Daily Rewards
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Midnight Gift Box 🎁</h1>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#25173e] to-[#120a21] border-2 border-amber-400 shadow-2xl text-center space-y-6">
            <div className="w-24 h-24 rounded-3xl bg-amber-950 border-2 border-amber-400 mx-auto flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(251,191,36,0.3)] animate-bounce">
              📦
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-amber-200">You earned today's mystery bounty!</h2>
              <p className="text-xs text-purple-200">
                Pippin the bat discovered a shiny satchel under the town bell tower.
              </p>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/40 border border-amber-600/40 text-amber-300 font-bold text-sm mt-2">
                <span>🪙 +30 Gold Coins</span>
                <span>•</span>
                <span>⚡ +20 Energy</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playAchievement();
                if (onClaimDaily) onClaimDaily();
                onNavigate('home');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-sm shadow-xl transition-transform active:scale-95"
            >
              Claim & Return to Haven
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 26: NIGHT SUMMARY */}
      {screenId === 'night_summary' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
              Screen #26: Night Complete
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Night {stats.night} Completed 🌙</h1>
            <p className="text-xs text-purple-300">You survived the shadows and made it back safely!</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1a1230] border-2 border-purple-600 shadow-2xl space-y-4">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-black/40 border border-purple-800">
                <span className="text-purple-400 block text-[10px]">Hunger Status</span>
                <span className="text-sm font-bold text-pink-300">
                  {stats.hunger < 40 ? 'Well Fed (Safe)' : 'Thirsty'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-black/40 border border-purple-800">
                <span className="text-purple-400 block text-[10px]">Masquerade Secrecy</span>
                <span className="text-sm font-bold text-amber-300">{stats.secrecy}% Intact</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/60 border border-purple-700/50 text-xs text-purple-200">
              <span className="font-bold text-white">Night Note:</span> Pippin scouted the school roof and found ancient runes. Tomorrow brings new choices!
            </div>

            <button
              onClick={() => {
                sounds.playDoor();
                if (onAdvanceNight) onAdvanceNight();
                onNavigate('home');
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2"
            >
              <span>Awaken to Next Day</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 27: ACHIEVEMENTS */}
      {screenId === 'achievements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900 border border-amber-500 text-amber-300 font-bold uppercase">
                Screen #27: Achievements
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Trophies & Badges 🏆</h1>
              <p className="text-xs text-purple-300">Milestones achieved across your 100 nights!</p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-5 rounded-3xl border-2 flex items-start gap-4 transition-all ${
                  ach.unlocked
                    ? 'bg-[#1e1538] border-amber-400 shadow-xl'
                    : 'bg-[#150f24] border-purple-950 opacity-60'
                }`}
              >
                <div className="text-4xl p-2 rounded-2xl bg-black/40 border border-white/10">
                  {ach.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{ach.title}</h3>
                  <p className="text-xs text-purple-300 mt-0.5">{ach.description}</p>
                  <span className={`text-[10px] font-bold block mt-2 ${ach.unlocked ? 'text-emerald-400' : 'text-purple-500'}`}>
                    {ach.unlocked ? '✓ Unlocked' : 'Locked'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 28: GAME PROGRESS (100 NIGHTS ROADMAP) */}
      {screenId === 'game_progress' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-900 border border-indigo-500 text-indigo-300 font-bold uppercase">
                Screen #28: 100 Nights Progress
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Journey to Night 100 📈</h1>
              <p className="text-xs text-purple-300">
                You are currently at Night {stats.night} of 100!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          {/* Progress bar */}
          <div className="p-6 rounded-3xl bg-[#1c1433] border-2 border-purple-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-sm font-bold">
              <span className="text-purple-300">Centennial Blood Moon Progress</span>
              <span className="text-amber-400 font-mono">{stats.night} %</span>
            </div>
            <div className="w-full h-4 bg-black/60 rounded-full overflow-hidden p-0.5 border border-purple-800">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-amber-400 rounded-full transition-all"
                style={{ width: `${stats.night}%` }}
              />
            </div>

            {/* Key Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
              <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800">
                <span className="text-amber-400 font-bold block">Night 1-24</span>
                <span className="text-purple-300 text-[10px]">Beginner Fledgling</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800">
                <span className="text-amber-400 font-bold block">Night 25 🌕</span>
                <span className="text-purple-300 text-[10px]">First Blood Moon</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800">
                <span className="text-amber-400 font-bold block">Night 50 🌕</span>
                <span className="text-purple-300 text-[10px]">Halfway Elder</span>
              </div>
              <div className="p-3 rounded-2xl bg-purple-950 border border-purple-800">
                <span className="text-amber-400 font-bold block">Night 100 👑</span>
                <span className="text-purple-300 text-[10px]">Grand Finale</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 29: GRAND ENDING SCREEN */}
      {screenId === 'ending' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
              Screen #29: Finale
            </span>
            <h1 className="text-3xl font-bold text-purple-100 mt-2">
              Night 100: The Century Vampire 👑
            </h1>
            <p className="text-xs text-purple-300 mt-1">
              You survived 100 nights in Oakhaven! Your secret is safe and your friends stand by your side.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#281545] via-[#1a0f30] to-black border-2 border-purple-400 shadow-2xl text-center space-y-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-purple-900 to-indigo-600 border-4 border-amber-300 mx-auto flex items-center justify-center text-6xl shadow-[0_0_40px_rgba(251,191,36,0.4)]">
              👑
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">The Guardian Vampire Ending</h2>
              <p className="text-xs text-purple-200 max-w-md mx-auto leading-relaxed">
                You discovered the antique truth: your vampire gift was given to protect the town. Maya knows your secret and brings you midnight berry tea. Even Leo the hunter smiled and agreed to guard your sanctuary.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('replay')}
                className="px-6 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-xl transition-transform active:scale-95 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Story Journal & Memories</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 30: REPLAY STORY & MEMORIES */}
      {screenId === 'replay' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
                Screen #30: Story Memories & Replay
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Memory Photo Album 🔄</h1>
              <p className="text-xs text-purple-300">
                Look back at your favorite moments or restart with new choices!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((m) => (
              <div key={m.id} className="p-5 rounded-3xl bg-[#1c1433] border-2 border-purple-700/60 shadow-xl space-y-2">
                <div className={`h-24 rounded-2xl bg-gradient-to-br ${m.imageColor} flex items-center justify-center text-4xl shadow-inner border border-white/10`}>
                  {m.emoji}
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <span className="text-[10px] text-amber-300 font-mono">Night {m.night}</span>
                </div>
                <p className="text-xs text-purple-300 leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => {
                if (confirm('Start a fresh 100 Nights adventure? Your progress will reset.')) {
                  if (onRestartStory) onRestartStory();
                  onNavigate('char_creation');
                }
              }}
              className="px-6 py-2.5 rounded-2xl bg-[#2e1d4d] hover:bg-[#3f276b] text-purple-200 border border-purple-600 font-bold text-xs inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Begin a New 100 Nights Tale</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

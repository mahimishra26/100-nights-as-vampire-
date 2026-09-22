import React from 'react';
import { ScreenId } from '../types';
import { X, Sparkles, Compass } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface ScreenModalProps {
  currentScreen: ScreenId;
  onSelectScreen: (screenId: ScreenId) => void;
  onClose: () => void;
}

interface ScreenCategory {
  title: string;
  items: { id: ScreenId; num: number; name: string; icon: string }[];
}

const SCREEN_CATEGORIES: ScreenCategory[] = [
  {
    title: '🌟 Start & Onboarding (Screens 1–5)',
    items: [
      { id: 'splash', num: 1, name: 'Splash Screen', icon: '🌙' },
      { id: 'main_menu', num: 2, name: 'Main Menu', icon: '🏰' },
      { id: 'char_creation', num: 3, name: 'Character Creation', icon: '🎨' },
      { id: 'char_preview', num: 4, name: 'Character Preview', icon: '🧛' },
      { id: 'tutorial', num: 5, name: 'Tutorial Guide', icon: '📖' }
    ]
  },
  {
    title: '☀️ Daytime Exploration & Hubs (Screens 6–12)',
    items: [
      { id: 'home', num: 6, name: 'Home Screen', icon: '🏠' },
      { id: 'day_map', num: 7, name: 'Day Map', icon: '🗺️' },
      { id: 'school', num: 8, name: 'School Classroom', icon: '🏫' },
      { id: 'town', num: 9, name: 'Town Plaza', icon: '🏘️' },
      { id: 'forest', num: 10, name: 'Whispering Forest', icon: '🌲' },
      { id: 'shop', num: 11, name: 'Curio Shop', icon: '🏪' },
      { id: 'witch_house', num: 12, name: "Luna's Witch House", icon: '🔮' }
    ]
  },
  {
    title: '❤️ Relationships & Powers (Screens 13–17)',
    items: [
      { id: 'friendship', num: 13, name: 'Friendship Screen', icon: '❤️' },
      { id: 'dialogue', num: 14, name: 'Dialogue Screen', icon: '💬' },
      { id: 'choice', num: 15, name: 'Choice Decision', icon: '🎯' },
      { id: 'inventory', num: 16, name: 'Satchel Inventory', icon: '🎒' },
      { id: 'powers', num: 17, name: 'Vampire Powers', icon: '⚡' }
    ]
  },
  {
    title: '🌙 Night Survival & Encounters (Screens 18–23)',
    items: [
      { id: 'night_prep', num: 18, name: 'Night Preparation', icon: '🕯️' },
      { id: 'night_map', num: 19, name: 'Night Map', icon: '🌙' },
      { id: 'random_event', num: 20, name: 'Random Event', icon: '❓' },
      { id: 'enemy_encounter', num: 21, name: 'Hunter Encounter', icon: '🗡️' },
      { id: 'minigame', num: 22, name: 'Mini-Game Arena', icon: '🎮' },
      { id: 'blood_moon', num: 23, name: 'Blood Moon Event', icon: '🌕' }
    ]
  },
  {
    title: '🏆 Mystery, Rewards & Endings (Screens 24–30)',
    items: [
      { id: 'mystery', num: 24, name: 'Mystery Board', icon: '🔍' },
      { id: 'daily_reward', num: 25, name: 'Daily Reward', icon: '🎁' },
      { id: 'night_summary', num: 26, name: 'Night Summary', icon: '📊' },
      { id: 'achievements', num: 27, name: 'Achievements Screen', icon: '🏆' },
      { id: 'game_progress', num: 28, name: 'Game Progress (100 Nights)', icon: '📈' },
      { id: 'ending', num: 29, name: 'Grand Ending Screen', icon: '👑' },
      { id: 'replay', num: 30, name: 'Replay Story Screen', icon: '🔄' }
    ]
  }
];

export const AllScreensModal: React.FC<ScreenModalProps> = ({
  currentScreen,
  onSelectScreen,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] bg-[#1a142e] border-2 border-purple-500/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border-b border-purple-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧛‍♀️</span>
            <div>
              <h2 className="text-lg font-bold text-purple-100 flex items-center gap-2">
                All 30 Frontend Screens
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-600/60 text-purple-200">
                  Instant Navigator
                </span>
              </h2>
              <p className="text-xs text-purple-300">
                Click any screen to jump directly to it and inspect every requested view!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories list */}
        <div className="p-6 overflow-y-auto space-y-6">
          {SCREEN_CATEGORIES.map((cat, cIdx) => (
            <div key={cIdx} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                {cat.title}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {cat.items.map((item) => {
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sounds.playClick();
                        onSelectScreen(item.id);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-300 text-white shadow-lg ring-2 ring-purple-400 scale-[1.02]'
                          : 'bg-[#221a3b] hover:bg-[#2e234f] border-purple-800/40 text-purple-200 hover:border-purple-500'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xl">{item.icon}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isActive ? 'bg-white/20 text-white' : 'bg-purple-950/80 text-purple-400'}`}>
                          #{item.num}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{item.name}</div>
                        <div className="text-[10px] opacity-75 font-mono">{item.id}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#130e24] border-t border-purple-900/40 text-center text-xs text-purple-400">
          Survive 100 Nights • Cute & Cozy Gothic Adventure • Made for young players
        </div>
      </div>
    </div>
  );
};

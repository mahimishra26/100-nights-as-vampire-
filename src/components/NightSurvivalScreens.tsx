import React from 'react';
import { ScreenId, PlayerStats, VampireProfile } from '../types';
import { Moon, ShieldAlert, Sparkles, Flame, Eye, Compass, ArrowRight, Zap } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface NightSurvivalProps {
  screenId: 'night_prep' | 'night_map' | 'random_event' | 'enemy_encounter' | 'blood_moon';
  onNavigate: (screen: ScreenId) => void;
  stats: PlayerStats;
  profile: VampireProfile;
  onFeed?: () => void;
  onChoice?: (choice: string) => void;
}

export const NightSurvivalScreens: React.FC<NightSurvivalProps> = ({
  screenId,
  onNavigate,
  stats,
  profile,
  onFeed,
  onChoice
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* SCREEN 18: NIGHT PREPARATION */}
      {screenId === 'night_prep' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-[#1e1338] to-[#120a21] border border-purple-600 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
                Screen #18: Night Preparation
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Dusk Descends... 🕯️</h1>
              <p className="text-xs text-purple-300">
                Check your cloak, pack sweet berry juice, and prepare your night powers before stepping into the fog.
              </p>
            </div>
            <button
              onClick={() => onNavigate('night_map')}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5"
            >
              <span>Begin Night</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#1b142e] border border-purple-800/40 text-center space-y-2">
              <span className="text-3xl">🍓</span>
              <h3 className="text-sm font-bold text-white">Quench Thirst</h3>
              <p className="text-xs text-purple-300">Drink sweet berry nectar to keep Hunger at 0%.</p>
              <button
                onClick={() => {
                  sounds.playBite();
                  if (onFeed) onFeed();
                }}
                className="w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs"
              >
                Drink Juice (-30 Thirst)
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-[#1b142e] border border-purple-800/40 text-center space-y-2">
              <span className="text-3xl">🧥</span>
              <h3 className="text-sm font-bold text-white">Fasten Cloak</h3>
              <p className="text-xs text-purple-300">Wear the dark velvet hood to keep Secrecy high.</p>
              <button
                onClick={() => {
                  sounds.playAchievement();
                  alert('Cloak tightened! Secrecy protected (+10%).');
                }}
                className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs"
              >
                Adjust Cloak
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-[#1b142e] border border-purple-800/40 text-center space-y-2">
              <span className="text-3xl">🦇</span>
              <h3 className="text-sm font-bold text-white">Summon Pippin</h3>
              <p className="text-xs text-purple-300">Your fruit bat scout will alert you to hunters.</p>
              <button
                onClick={() => {
                  sounds.playBat();
                  alert('Pippin fluttered onto your shoulder and squeaked happily!');
                }}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Feed Pet Bat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 19: NIGHT MAP */}
      {screenId === 'night_map' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-black border-2 border-indigo-500/50 shadow-2xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-900 border border-indigo-500 text-indigo-300 font-bold uppercase">
                Screen #19: Night Map
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Midnight Oakhaven 🌙</h1>
              <p className="text-xs text-purple-300">
                Cobblestones glimmer with mist under the moon. Where will you explore tonight?
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Return Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Clock Tower Rooftops */}
            <div
              onClick={() => {
                sounds.playBat();
                onNavigate('random_event');
              }}
              className="p-5 rounded-3xl bg-[#1a1130] hover:bg-[#271a47] border border-purple-700/60 cursor-pointer transition-all space-y-2 shadow-lg"
            >
              <div className="text-3xl">🕰️</div>
              <h3 className="text-base font-bold text-white">Gothic Clock Tower</h3>
              <p className="text-xs text-purple-300">
                Flutter to the copper gargoyles in Bat Form. Uncover secret vampire diary pages!
              </p>
              <span className="text-[10px] text-amber-300 font-bold block pt-1">Event: Mysterious Sighting ➔</span>
            </div>

            {/* Foggy Cemetery */}
            <div
              onClick={() => {
                sounds.playMagic();
                onNavigate('minigame');
              }}
              className="p-5 rounded-3xl bg-[#1a1130] hover:bg-[#271a47] border border-purple-700/60 cursor-pointer transition-all space-y-2 shadow-lg"
            >
              <div className="text-3xl">🪦</div>
              <h3 className="text-base font-bold text-white">Misty Ivy Graveyard</h3>
              <p className="text-xs text-purple-300">
                Quiet crypts, glowing fireflies, and ancient silver runes.
              </p>
              <span className="text-[10px] text-indigo-300 font-bold block pt-1">Play: Mini-Game Challenge ➔</span>
            </div>

            {/* Alleyway Shadow */}
            <div
              onClick={() => {
                sounds.playFootstep();
                onNavigate('enemy_encounter');
              }}
              className="p-5 rounded-3xl bg-[#1a1130] hover:bg-[#271a47] border border-purple-700/60 cursor-pointer transition-all space-y-2 shadow-lg"
            >
              <div className="text-3xl">🔦</div>
              <h3 className="text-base font-bold text-white">Gaslit Back Alley</h3>
              <p className="text-xs text-purple-300">
                Someone is shining a silver flashlight! It looks like trainee hunter Leo!
              </p>
              <span className="text-[10px] text-rose-300 font-bold block pt-1">Encounter: Hunter Leo ➔</span>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 20: RANDOM EVENT */}
      {screenId === 'random_event' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
              Screen #20: Random Encounter
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">A Midnight Surprise! ❓</h1>
          </div>

          <div className="p-6 rounded-3xl bg-[#1c1433] border-2 border-purple-600 shadow-2xl space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-400 mx-auto flex items-center justify-center text-4xl">
              🐈‍⬛
            </div>
            <h3 className="text-lg font-bold text-purple-100 text-center">
              The Black Cat with Golden Eyes
            </h3>
            <p className="text-xs text-purple-300 leading-relaxed text-center">
              A fluffy black cat steps out from under a wooden barrel holding a folded parchment in its jaws. The letter is marked with your family's mooncrest.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sounds.playAchievement();
                  if (onChoice) onChoice('Read the family letter');
                  onNavigate('mystery');
                }}
                className="w-full p-3 rounded-2xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-between"
              >
                <span>Gently take the letter and pet the cat</span>
                <span className="text-amber-300 text-[11px]">+Clue Found 📜</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigate('night_map');
                }}
                className="w-full p-3 rounded-2xl bg-[#281d3d] hover:bg-[#382a52] text-purple-200 font-bold text-xs"
              >
                Leave the cat and keep moving quietly
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 21: ENEMY ENCOUNTER (LEO THE TRAINEE HUNTER) */}
      {screenId === 'enemy_encounter' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-900 border border-rose-500 text-rose-300 font-bold uppercase">
              Screen #21: Avoid Enemy
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Spotted by Hunter Leo! 🗡️</h1>
          </div>

          <div className="p-6 rounded-3xl bg-[#1f1530] border-2 border-rose-500/50 shadow-2xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-950 border border-rose-500 flex items-center justify-center text-4xl">
                🗡️
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Leo</h3>
                <div className="text-xs text-rose-300">"Halt! Who goes there in the dark?"</div>
              </div>
            </div>

            <p className="text-xs text-purple-300 leading-relaxed">
              Leo is holding his wooden flashlight. He looks determined, but he drops his notebook on the ground.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  sounds.playMagic();
                  alert('You smiled and said you were just stargazing! Leo blushed and let you pass (+10 Secrecy).');
                  onNavigate('night_map');
                }}
                className="w-full p-3 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-between shadow-md"
              >
                <span>Use Vampire Allure / Polite Excuse</span>
                <span className="text-pink-200 text-[11px]">+Secrecy 🕶️</span>
              </button>

              <button
                onClick={() => {
                  sounds.playBat();
                  onNavigate('minigame');
                }}
                className="w-full p-3 rounded-2xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-between"
              >
                <span>Transform into Bat Form & Flutter Away!</span>
                <span className="text-amber-300 text-[11px]">Play Mini-Game 🎮</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 23: BLOOD MOON EVENT */}
      {screenId === 'blood_moon' && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950 border border-red-600 text-red-300 font-bold uppercase animate-pulse">
              Screen #23: Major Story Event
            </span>
            <h1 className="text-3xl font-bold text-red-200 mt-2">
              The Blood Moon Rises! 🌕
            </h1>
            <p className="text-xs text-red-300 mt-1">
              Every 25th night, the crimson eclipse amplifies all vampire powers!
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-red-950/80 via-purple-950/80 to-black border-2 border-red-600/80 shadow-[0_0_50px_rgba(230,57,70,0.3)] text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-red-900 to-red-500 border-4 border-red-300 mx-auto shadow-[0_0_35px_rgba(239,68,68,0.7)] flex items-center justify-center text-5xl animate-pulse">
              🌕
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Your Power Surges!</h2>
              <p className="text-xs text-red-200 max-w-md mx-auto leading-relaxed">
                The ancient vampire blood in your veins sings with nocturnal energy. You can now unlock the ultimate memory of how you turned into an immortal fledgling!
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  sounds.playAchievement();
                  onNavigate('mystery');
                }}
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl transition-transform active:scale-95"
              >
                Unravel the Blood Moon Mystery 🔍
              </button>
              <button
                onClick={() => onNavigate('night_map')}
                className="px-6 py-2.5 rounded-2xl bg-[#281a38] text-purple-200 font-bold text-xs border border-purple-700"
              >
                Return to Night Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

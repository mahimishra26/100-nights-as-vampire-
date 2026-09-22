import React from 'react';
import { ScreenId } from '../types';
import { Sparkles, Sun, Moon, ArrowLeft, Store, BookOpen, Trees, Home, Shield } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface ExplorationProps {
  screenId: 'day_map' | 'school' | 'town' | 'forest' | 'shop' | 'witch_house';
  onNavigate: (screen: ScreenId) => void;
  onTalkToFriend?: (friendId: string) => void;
  onBuyItem?: (itemId: string) => void;
  coins: number;
}

export const DaytimeExplorationScreens: React.FC<ExplorationProps> = ({
  screenId,
  onNavigate,
  onTalkToFriend,
  onBuyItem,
  coins
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* SCREEN 7: DAY MAP */}
      {screenId === 'day_map' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/60 border border-amber-600/50 text-amber-300 font-bold uppercase">
                Screen #7: Daytime Map
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Explore the Sunlit Town ☀️
              </h1>
              <p className="text-xs text-purple-300">
                Put your umbrella up or wear your cloak! Choose a location to visit:
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* School */}
            <div
              onClick={() => {
                sounds.playDoor();
                onNavigate('school');
              }}
              className="p-5 rounded-3xl bg-[#1f1738] hover:bg-[#2c204f] border-2 border-purple-600/50 hover:border-purple-400 cursor-pointer shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-950/60 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                🏫
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">St. Jude's High School</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-300 font-bold">#8</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Meet Maya in the library, avoid the garlic garlic bread in the cafeteria, and find hidden notes.
              </p>
            </div>

            {/* Town Plaza */}
            <div
              onClick={() => {
                sounds.playFootstep();
                onNavigate('town');
              }}
              className="p-5 rounded-3xl bg-[#1f1738] hover:bg-[#2c204f] border-2 border-purple-600/50 hover:border-purple-400 cursor-pointer shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-950/60 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                🏘️
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Sunny Cobblestone Plaza</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-300 font-bold">#9</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Fountains, street performers, and Leo practicing with his toy wooden stakes.
              </p>
            </div>

            {/* Whispering Forest */}
            <div
              onClick={() => {
                sounds.playFootstep();
                onNavigate('forest');
              }}
              className="p-5 rounded-3xl bg-[#1f1738] hover:bg-[#2c204f] border-2 border-purple-600/50 hover:border-purple-400 cursor-pointer shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                🌲
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Whispering Woods</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-300 font-bold">#10</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Cool shadows under tall pine trees. Perfect place to walk safely during daytime without burning!
              </p>
            </div>

            {/* Shop */}
            <div
              onClick={() => {
                sounds.playDoor();
                onNavigate('shop');
              }}
              className="p-5 rounded-3xl bg-[#1f1738] hover:bg-[#2c204f] border-2 border-purple-600/50 hover:border-purple-400 cursor-pointer shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-pink-950/60 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                🏪
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Curio & Sweet Shop</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-300 font-bold">#11</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Buy berry juice, cozy cloaks, and antique keys with your gold coins.
              </p>
            </div>

            {/* Witch House */}
            <div
              onClick={() => {
                sounds.playDoor();
                onNavigate('witch_house');
              }}
              className="p-5 rounded-3xl bg-[#1f1738] hover:bg-[#2c204f] border-2 border-purple-600/50 hover:border-purple-400 cursor-pointer shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-950/60 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                🔮
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Luna's Cottage</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-900 text-purple-300 font-bold">#12</span>
              </div>
              <p className="text-xs text-purple-300 mt-1">
                Warm glowing candles, herbal teas, and secrets of ancient friendly vampires.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 8: SCHOOL CLASSROOM & ROOF */}
      {screenId === 'school' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/60 to-indigo-950/60 border border-purple-700 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-600 text-purple-300 font-bold uppercase">
                Screen #8: School
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">St. Jude's High School 🏫</h1>
              <p className="text-xs text-purple-300">
                You sit near the shady window so the sun doesn't sizzle your pale skin.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day_map')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back to Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#1c1433] border border-purple-800/40 space-y-3">
              <div className="text-2xl">🌸 Maya is waving at you!</div>
              <p className="text-xs text-purple-300">
                "Hey! Want to share these sweet strawberry tarts during study hall on the shaded roof?"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sounds.playAchievement();
                    if (onTalkToFriend) onTalkToFriend('maya');
                    onNavigate('dialogue');
                  }}
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-md"
                >
                  Talk & Study with Maya (+Friendship)
                </button>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#1c1433] border border-purple-800/40 space-y-3">
              <div className="text-2xl">📖 The Occult History Shelf</div>
              <p className="text-xs text-purple-300">
                A locked dusty section of the library. Requires an antique brass key found during your night adventures.
              </p>
              <button
                onClick={() => onNavigate('mystery')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
              >
                Inspect Clues on Mystery Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 9: TOWN PLAZA */}
      {screenId === 'town' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 to-purple-950/60 border border-purple-700 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900 border border-blue-600 text-blue-300 font-bold uppercase">
                Screen #9: Town Plaza
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Cobblestone Plaza 🏘️</h1>
              <p className="text-xs text-purple-300">
                People are laughing by the fountain. You spot Leo looking through binoculars.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day_map')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back to Map
            </button>
          </div>

          <div className="p-5 rounded-3xl bg-[#1c1433] border border-purple-800/40 flex flex-col md:flex-row items-center gap-4">
            <div className="text-5xl">🗡️</div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-amber-200">Leo (Trainee Hunter)</h3>
              <p className="text-xs text-purple-300">
                "Hmm, someone was seen fluttering around the town clock last night. Have you seen any giant bats around?"
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onNavigate('choice');
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
                >
                  Make Up an Innocent Excuse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 10: WHISPERING FOREST */}
      {screenId === 'forest' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 to-purple-950/60 border border-emerald-700/50 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-900 border border-emerald-600 text-emerald-300 font-bold uppercase">
                Screen #10: Whispering Forest
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Whispering Woods 🌲</h1>
              <p className="text-xs text-purple-300">
                The thick pine canopy blocks out the sun, keeping you nice and cool.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day_map')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back to Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#171329] border border-purple-800/40 space-y-2">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                <span>🫐 Wild Crimson Berries</span>
              </h3>
              <p className="text-xs text-purple-300">
                Juicy, sweet berries grow here that satisfy vampire cravings without harming anyone!
              </p>
              <button
                onClick={() => {
                  sounds.playBite();
                  alert('Picked a handful of sweet berries! Thirst satisfied.');
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs mt-2"
              >
                Forage Berries (-20 Hunger)
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-[#171329] border border-purple-800/40 space-y-2">
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                <span>🦇 Pet Bat Training Perch</span>
              </h3>
              <p className="text-xs text-purple-300">
                Practice flying and obstacle dodging in the mini-games arena.
              </p>
              <button
                onClick={() => onNavigate('minigame')}
                className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs mt-2"
              >
                Play Bat Escape Mini-Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 11: SHOP */}
      {screenId === 'shop' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-pink-950/60 to-purple-950/60 border border-pink-700/50 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-900 border border-pink-600 text-pink-300 font-bold uppercase">
                Screen #11: Shop
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Curio & Sweet Treats 🏪</h1>
              <p className="text-xs text-purple-300">
                Exchange coins earned from mini-games and nightly exploring!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-xl bg-amber-950 border border-amber-600 font-bold text-amber-300 text-xs">
                🪙 {coins} Coins
              </div>
              <button
                onClick={() => onNavigate('day_map')}
                className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
              >
                Back to Map
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: 'tea', name: 'Sparkling Moon Tea', icon: '🧃', cost: 15, desc: '+35 Energy' },
              { id: 'jelly', name: 'Berry Juice Jelly', icon: '🍓', cost: 20, desc: '-30 Hunger' },
              { id: 'cloak', name: 'Velvet Midnight Cloak', icon: '🧥', cost: 45, desc: '+25 Secrecy' },
              { id: 'crystal', name: 'Starlight Amethyst', icon: '🔮', cost: 35, desc: '+20 Energy & +15 Secrecy' },
              { id: 'box', name: 'Mystery Antique Box', icon: '📦', cost: 25, desc: 'Contains random surprises!' }
            ].map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#1c1433] border border-purple-800/40 flex flex-col justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{item.name}</div>
                    <div className="text-[11px] text-purple-300">{item.desc}</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (coins >= item.cost) {
                      sounds.playCoin();
                      if (onBuyItem) onBuyItem(item.id);
                    } else {
                      sounds.playGameOver();
                      alert('Not enough coins! Play a mini-game to earn more.');
                    }
                  }}
                  className="w-full py-2 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all active:scale-95"
                >
                  <span>Buy for {item.cost} 🪙</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 12: WITCH HOUSE */}
      {screenId === 'witch_house' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950 via-[#1e1338] to-[#120a21] border border-purple-600 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
                Screen #12: Witch House
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Luna's Witch Cottage 🔮</h1>
              <p className="text-xs text-purple-300">
                Enchanted teapots float in midair while Luna smiles warmly.
              </p>
            </div>
            <button
              onClick={() => onNavigate('day_map')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back to Map
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-[#1c1433] border border-purple-800/40 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🔮</span>
                <div>
                  <h3 className="text-base font-bold text-purple-100">Luna the Friendly Witch</h3>
                  <p className="text-xs text-purple-300">"Being a vampire is nothing to be ashamed of, little bat."</p>
                </div>
              </div>
              <button
                onClick={() => {
                  sounds.playMagic();
                  if (onTalkToFriend) onTalkToFriend('luna');
                  onNavigate('dialogue');
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                Have Tea & Ask for Advice
              </button>
            </div>

            <div className="p-5 rounded-3xl bg-[#1c1433] border border-purple-800/40 space-y-3">
              <h3 className="text-base font-bold text-purple-100 flex items-center gap-2">
                <span>🧪 Cauldron Brewing</span>
              </h3>
              <p className="text-xs text-purple-300">
                Help Luna stir her magical moonflower potion in the 30-second mini-game.
              </p>
              <button
                onClick={() => onNavigate('minigame')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Play Potion Mixing Mini-Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

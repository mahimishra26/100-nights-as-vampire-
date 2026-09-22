import React, { useState } from 'react';
import { CharacterFriendship, VampirePower, ScreenId } from '../types';
import { Heart, Sparkles, MessageCircle, Gift, Zap, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface FriendshipPowersProps {
  screenId: 'friendship' | 'dialogue' | 'choice' | 'inventory' | 'powers';
  onNavigate: (screen: ScreenId) => void;
  friends: Record<string, CharacterFriendship>;
  powers: VampirePower[];
  currentFriendId?: string;
  onSelectFriend?: (friendId: string) => void;
  onChoiceMade?: (choiceText: string, statImpact: string) => void;
  onUnlockPower?: (powerId: string) => void;
  energy: number;
}

export const FriendshipAndPowersScreens: React.FC<FriendshipPowersProps> = ({
  screenId,
  onNavigate,
  friends,
  powers,
  currentFriendId = 'maya',
  onSelectFriend,
  onChoiceMade,
  onUnlockPower,
  energy
}) => {
  const currentFriend = friends[currentFriendId] || friends['maya'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* SCREEN 13: FRIENDSHIP SCREEN */}
      {screenId === 'friendship' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-900/60 border border-pink-600/50 text-pink-300 font-bold uppercase">
                Screen #13: Friendships
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Your Friends & Allies ❤️
              </h1>
              <p className="text-xs text-purple-300">
                Building trust protects your secret identity and unlocks special story scenes!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(friends).map((f) => (
              <div
                key={f.id}
                className="p-5 rounded-3xl bg-[#1b142e] border-2 border-purple-800/40 hover:border-pink-500/50 shadow-xl space-y-3 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-950 flex items-center justify-center text-3xl shadow-inner border border-purple-700/50">
                      {f.avatar}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{f.name}</h3>
                      <div className="text-xs text-pink-300 font-semibold">{f.role}</div>
                      <div className="text-[10px] text-purple-300">{f.levelTitle}</div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-pink-400">{f.friendship}/100</span>
                </div>

                {/* Friendship Bar */}
                <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full transition-all"
                    style={{ width: `${f.friendship}%` }}
                  />
                </div>

                <p className="text-xs text-purple-300 leading-relaxed">{f.description}</p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      if (onSelectFriend) onSelectFriend(f.id);
                      onNavigate('dialogue');
                    }}
                    className="flex-1 py-2 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Talk</span>
                  </button>
                  <button
                    onClick={() => {
                      sounds.playCoin();
                      alert(`Gave sweet treat to ${f.name}! Friendship +5 ❤️`);
                    }}
                    className="py-2 px-3 rounded-xl bg-pink-900/60 hover:bg-pink-800 text-pink-200 font-bold text-xs flex items-center gap-1 border border-pink-700/40"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Gift</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 14: DIALOGUE SCREEN */}
      {screenId === 'dialogue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
              Screen #14: Conversation
            </span>
            <button
              onClick={() => onNavigate('friendship')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back to Friends
            </button>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1f1638] to-[#120a21] border-2 border-purple-600/50 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-950 border border-purple-400 flex items-center justify-center text-4xl shadow-md">
                {currentFriend.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{currentFriend.name}</h2>
                <div className="text-xs text-pink-300">{currentFriend.role}</div>
              </div>
            </div>

            {/* Speech bubble */}
            <div className="p-5 rounded-2xl bg-black/40 border border-purple-700/50 text-sm text-purple-100 leading-relaxed font-serif relative">
              <p>
                "You know, you're the first person who ever sat with me on the roof without complaining about the autumn breeze. Sometimes I feel like everyone else in town has a secret... but with you, I feel completely safe."
              </p>
            </div>

            {/* Response options */}
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  sounds.playAchievement();
                  if (onChoiceMade) onChoiceMade('Tell Maya she is your best friend', '+10 Friendship');
                  onNavigate('choice');
                }}
                className="w-full p-3.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 text-left text-xs font-bold text-purple-100 flex items-center justify-between transition-all"
              >
                <span>"You're my best friend too, Maya. I promise I'll always be there for you."</span>
                <span className="text-pink-400 font-mono text-[11px]">+Friendship ❤️</span>
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  if (onChoiceMade) onChoiceMade('Change subject to schoolwork', '+5 Secrecy');
                  onNavigate('choice');
                }}
                className="w-full p-3.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 border border-purple-600/50 text-left text-xs font-bold text-purple-100 flex items-center justify-between transition-all"
              >
                <span>"Speaking of secrets... do you have the notes for tomorrow's history test?"</span>
                <span className="text-amber-400 font-mono text-[11px]">+Secrecy 🕶️</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 15: CHOICE DECISION */}
      {screenId === 'choice' && (
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 border border-purple-500 text-purple-300 font-bold uppercase">
              Screen #15: Choice Result
            </span>
            <h1 className="text-2xl font-bold text-white mt-2">Decision Saved! 🎯</h1>
            <p className="text-xs text-purple-300 mt-1">
              Your actions shape your 100-night story and ending.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#1b142e] border-2 border-emerald-500/50 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-400 mx-auto flex items-center justify-center text-3xl">
              ✨
            </div>
            <h3 className="text-lg font-bold text-emerald-300">A Bond Strengthened</h3>
            <p className="text-xs text-purple-200">
              Maya smiled warmly and tucked a four-leaf clover into your satchel. Your bond grows deeper with each passing day.
            </p>

            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
            >
              Continue Adventure
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 16: INVENTORY SATCHEL */}
      {screenId === 'inventory' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-900 border border-blue-500 text-blue-300 font-bold uppercase">
                Screen #16: Inventory
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Your Velvet Satchel 🎒</h1>
              <p className="text-xs text-purple-300">
                Keep your snacks, cloaks, and mysterious keys safe from sunlight.
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { name: 'Berry Juice Jelly', icon: '🍓', qty: 3, desc: 'Delicious sweet snack. Satisfies vampire hunger (-30 Thirst).' },
              { name: 'Sparkling Moon Tea', icon: '🧃', qty: 2, desc: 'Herbal brew. Restores +35 Vampire Energy.' },
              { name: 'Antique Brass Key', icon: '🗝️', qty: 1, desc: 'Found in the attic. Unlocks the school rooftop library.' },
              { name: 'Velvet Midnight Cloak', icon: '🧥', qty: 1, desc: 'Equipped. Keeps your pale fangs safe from curious eyes.' },
              { name: 'Starlight Amethyst', icon: '🔮', qty: 1, desc: 'Gift from Luna. Calms mind and grants +20 Energy.' }
            ].map((it, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#1c1433] border border-purple-800/40 flex flex-col justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{it.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{it.name}</span>
                      <span className="text-xs text-amber-400 font-mono">x{it.qty}</span>
                    </div>
                    <p className="text-[11px] text-purple-300 mt-1">{it.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    sounds.playMagic();
                    alert(`Used ${it.name}!`);
                  }}
                  className="py-1.5 rounded-xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs"
                >
                  Use Item
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 17: VAMPIRE POWERS */}
      {screenId === 'powers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900 border border-amber-500 text-amber-300 font-bold uppercase">
                Screen #17: Vampire Powers
              </span>
              <h1 className="text-2xl font-bold text-white mt-1">Vampire Abilities ⚡</h1>
              <p className="text-xs text-purple-300">
                Unlock supernatural talents as you survive more nights!
              </p>
            </div>
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-xl bg-purple-950 text-purple-200 border border-purple-700 text-xs font-bold"
            >
              Back Home
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {powers.map((pow) => (
              <div
                key={pow.id}
                className={`p-5 rounded-3xl border-2 shadow-xl space-y-3 transition-all ${
                  pow.unlocked
                    ? 'bg-[#1b142e] border-amber-500/60'
                    : 'bg-[#150f24] border-purple-900/40 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{pow.icon}</span>
                    <div>
                      <h3 className="text-base font-bold text-white">{pow.name}</h3>
                      <div className="text-xs text-amber-300">
                        {pow.unlocked ? `Level ${pow.level} Active` : `Unlocks on Night ${pow.unlockNight}`}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900 text-purple-300 font-mono">
                    Cost: {pow.energyCost}⚡
                  </span>
                </div>

                <p className="text-xs text-purple-300 leading-relaxed">{pow.description}</p>

                {pow.unlocked ? (
                  <button
                    onClick={() => {
                      sounds.playMagic();
                      alert(`Activated ${pow.name}! Energy drained by ${pow.energyCost}⚡`);
                    }}
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                  >
                    Activate Power
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (onUnlockPower) onUnlockPower(pow.id);
                    }}
                    className="w-full py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-300 font-bold text-xs border border-purple-700/50"
                  >
                    Unlock Early (100 🪙)
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

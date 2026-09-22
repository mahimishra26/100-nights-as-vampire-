import React, { useState, useEffect } from 'react';
import { MiniGameType } from '../types';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle,
  XCircle,
  Clock,
  Compass
} from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface MiniGamesProps {
  selectedGame?: MiniGameType;
  onFinishGame: (success: boolean, rewardMsg: string) => void;
  onExit: () => void;
}

export const MiniGamesScreen: React.FC<MiniGamesProps> = ({
  selectedGame = 'bat_escape',
  onFinishGame,
  onExit
}) => {
  const [activeGame, setActiveGame] = useState<MiniGameType>(selectedGame);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  // 1. Bat Escape state (obstacles dodging)
  const [batY, setBatY] = useState(50); // percentage
  const [obstacles, setObstacles] = useState<{ id: number; x: number; gapY: number }[]>([
    { id: 1, x: 80, gapY: 40 },
    { id: 2, x: 130, gapY: 60 }
  ]);

  // 2. Potion Mixing state
  const [potionSteps, setPotionSteps] = useState<string[]>([]);
  const targetPotion = ['Lavender Dew', 'Crushed Moonflower', 'Sweet Berry Syrup'];

  // 3. Find Object state
  const [foundObjects, setFoundObjects] = useState<string[]>([]);
  const hiddenObjects = [
    { id: 'key', name: 'Brass Key', icon: '🗝️', x: 25, y: 35 },
    { id: 'crystal', name: 'Purple Crystal', icon: '🔮', x: 75, y: 25 },
    { id: 'diary', name: 'Old Note', icon: '📜', x: 45, y: 70 },
    { id: 'flower', name: 'Night Rose', icon: '🌹', x: 80, y: 80 }
  ];

  // 4. Moon Match (memory card symbols)
  const [cards, setCards] = useState([
    { id: 1, sym: '🌙', flipped: false, matched: false },
    { id: 2, sym: '⭐', flipped: false, matched: false },
    { id: 3, sym: '🦇', flipped: false, matched: false },
    { id: 4, sym: '🌙', flipped: false, matched: false },
    { id: 5, sym: '⭐', flipped: false, matched: false },
    { id: 6, sym: '🦇', flipped: false, matched: false }
  ]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);

  // 5. Escape the Hunter (path chooser)
  const [hunterStage, setHunterStage] = useState(1);

  // 6. Vampire Symbol Puzzle
  const [puzzleOrder, setPuzzleOrder] = useState<string[]>(['🩸', '🌙', '🦇', '✨']);
  const targetOrder = ['🌙', '🦇', '✨', '🩸'];

  // Universal timer
  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, activeGame]);

  const handleTimeUp = () => {
    setGameOver(true);
    if (activeGame === 'bat_escape' && score >= 3) {
      setWon(true);
      sounds.playAchievement();
    } else if (activeGame === 'find_object' && foundObjects.length >= 3) {
      setWon(true);
      sounds.playAchievement();
    } else {
      setWon(false);
      sounds.playGameOver();
    }
  };

  // Bat flap
  const handleFlap = () => {
    if (gameOver) return;
    sounds.playBat();
    setBatY((prev) => Math.max(10, prev - 18));
  };

  // Bat loop
  useEffect(() => {
    if (activeGame !== 'bat_escape' || gameOver) return;
    const interval = setInterval(() => {
      // Gravity
      setBatY((prev) => Math.min(85, prev + 3));

      // Move obstacles
      setObstacles((prev) =>
        prev.map((obs) => {
          let nextX = obs.x - 3;
          if (nextX < -15) {
            setScore((s) => s + 1);
            sounds.playCoin();
            return {
              id: obs.id + 2,
              x: 100,
              gapY: Math.floor(Math.random() * 50) + 25
            };
          }
          return { ...obs, x: nextX };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [activeGame, gameOver]);

  // Potion ingredient click
  const handleAddIngredient = (item: string) => {
    sounds.playMagic();
    const next = [...potionSteps, item];
    setPotionSteps(next);

    if (next.length === targetPotion.length) {
      const isMatch = next.every((val, idx) => val === targetPotion[idx]);
      setGameOver(true);
      if (isMatch) {
        setWon(true);
        sounds.playAchievement();
      } else {
        setWon(false);
        sounds.playGameOver();
      }
    }
  };

  // Object clicked
  const handleFoundItem = (id: string) => {
    if (foundObjects.includes(id)) return;
    sounds.playCoin();
    const next = [...foundObjects, id];
    setFoundObjects(next);
    if (next.length >= hiddenObjects.length) {
      setWon(true);
      setGameOver(true);
      sounds.playAchievement();
    }
  };

  // Card click (Moon match)
  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || selectedCards.length >= 2) return;
    sounds.playClick();
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      const [first, second] = newSelected;
      if (newCards[first].sym === newCards[second].sym) {
        sounds.playCoin();
        setTimeout(() => {
          newCards[first].matched = true;
          newCards[second].matched = true;
          setCards([...newCards]);
          setSelectedCards([]);
          if (newCards.every((c) => c.matched)) {
            setWon(true);
            setGameOver(true);
            sounds.playAchievement();
          }
        }, 500);
      } else {
        setTimeout(() => {
          newCards[first].flipped = false;
          newCards[second].flipped = false;
          setCards([...newCards]);
          setSelectedCards([]);
        }, 800);
      }
    }
  };

  // Reset current game
  const resetGame = (gameKey: MiniGameType) => {
    setActiveGame(gameKey);
    setTimeLeft(30);
    setGameOver(false);
    setWon(false);
    setScore(0);
    setBatY(50);
    setObstacles([
      { id: 1, x: 80, gapY: 40 },
      { id: 2, x: 130, gapY: 60 }
    ]);
    setPotionSteps([]);
    setFoundObjects([]);
    setCards(cards.map((c) => ({ ...c, flipped: false, matched: false })));
    setSelectedCards([]);
    setHunterStage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white space-y-6">
      {/* Header with Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-[#1d1633] border border-purple-800/50 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎮</span>
            <h1 className="text-xl font-bold text-purple-100">Cozy Vampire Mini-Games</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-900 text-purple-300 font-semibold">
              Screen #22
            </span>
          </div>
          <p className="text-xs text-purple-300 mt-1">
            Fun, 30-second challenges to earn coins, restore energy, and escape tricky situations!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 border border-purple-700/50 text-amber-300 font-mono text-sm font-bold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1.5 rounded-xl bg-[#2e234d] hover:bg-[#3c2f63] text-purple-200 border border-purple-700/40 text-xs font-bold transition-all"
          >
            Back to Map
          </button>
        </div>
      </div>

      {/* Mini-Game Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {[
          { id: 'bat_escape', name: 'Bat Escape', icon: '🦇' },
          { id: 'potion_mixing', name: 'Potion Mix', icon: '🧪' },
          { id: 'find_object', name: 'Find Object', icon: '🔍' },
          { id: 'moon_match', name: 'Moon Match', icon: '🌙' },
          { id: 'escape_hunter', name: 'Evade Hunter', icon: '🏃' },
          { id: 'vampire_puzzle', name: 'Rune Puzzle', icon: '🧩' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => resetGame(tab.id as MiniGameType)}
            className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1 ${
              activeGame === tab.id
                ? 'bg-purple-600 border-purple-300 text-white shadow-lg ring-2 ring-purple-400 font-bold'
                : 'bg-[#1c1530] hover:bg-[#281e42] border-purple-900/50 text-purple-300'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Active Game Canvas / View */}
      <div className="relative min-h-[380px] p-6 rounded-3xl bg-[#161026] border-2 border-purple-700/40 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* GAME 1: BAT ESCAPE */}
        {activeGame === 'bat_escape' && (
          <div className="relative w-full h-[320px] bg-gradient-to-b from-indigo-950/80 via-purple-950/80 to-[#120a1f] rounded-2xl border border-purple-800/40 overflow-hidden select-none">
            {/* Moon & Stars background */}
            <div className="absolute top-4 right-8 text-4xl opacity-80">🌕</div>
            <div className="absolute top-10 left-12 text-xs text-amber-200">✨</div>
            <div className="absolute top-20 right-32 text-xs text-amber-200">✨</div>

            {/* Score */}
            <div className="absolute top-3 left-4 px-3 py-1 rounded-lg bg-black/50 text-xs font-bold text-purple-200 z-20">
              Obstacles Cleared: {score}/3
            </div>

            {/* The Cute Bat */}
            <div
              className="absolute left-14 transition-all duration-75 text-3xl z-10"
              style={{ top: `${batY}%` }}
            >
              🦇
            </div>

            {/* Obstacles (Spooky Trees / Gothic spires) */}
            {obstacles.map((obs) => (
              <div key={obs.id}>
                {/* Upper pillar */}
                <div
                  className="absolute w-10 bg-gradient-to-b from-purple-950 to-indigo-900 border-x border-purple-600 rounded-b-xl"
                  style={{
                    left: `${obs.x}%`,
                    top: 0,
                    height: `${obs.gapY - 15}%`
                  }}
                />
                {/* Lower pillar */}
                <div
                  className="absolute w-10 bg-gradient-to-t from-purple-950 to-indigo-900 border-x border-purple-600 rounded-t-xl"
                  style={{
                    left: `${obs.x}%`,
                    bottom: 0,
                    height: `${100 - (obs.gapY + 15)}%`
                  }}
                />
              </div>
            ))}

            {/* Tap to flap overlay */}
            <div
              onClick={handleFlap}
              className="absolute inset-0 z-30 cursor-pointer flex items-end justify-center pb-4"
            >
              <button className="px-6 py-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg border border-purple-400 active:scale-95 transition-transform flex items-center gap-2">
                <span>🦇 TAP / CLICK TO FLAP WINGS</span>
              </button>
            </div>
          </div>
        )}

        {/* GAME 2: POTION MIXING */}
        {activeGame === 'potion_mixing' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-bold text-purple-100">
                Luna's Cauldron: Brew Midnight Dream Tea 🫖
              </h3>
              <p className="text-xs text-purple-300 mt-1">
                Add ingredients in the exact order: <span className="font-bold text-amber-300">1. Lavender Dew ➔ 2. Crushed Moonflower ➔ 3. Sweet Berry Syrup</span>
              </p>
            </div>

            <div className="flex items-center justify-center py-6">
              <div className="w-36 h-36 rounded-full bg-gradient-to-t from-purple-950 via-indigo-900 to-pink-900 border-4 border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center relative">
                <span className="text-4xl animate-bounce">🫧</span>
                <span className="text-xs font-bold text-pink-200 mt-1">
                  {potionSteps.length}/3 Ingredients
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Crushed Moonflower', icon: '🌸' },
                { name: 'Lavender Dew', icon: '💧' },
                { name: 'Sweet Berry Syrup', icon: '🍓' }
              ].map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => handleAddIngredient(ing.name)}
                  className="p-3 rounded-2xl bg-[#231a3b] hover:bg-[#342757] border border-purple-700/50 flex flex-col items-center gap-1.5 transition-transform active:scale-95"
                >
                  <span className="text-2xl">{ing.icon}</span>
                  <span className="text-xs font-bold text-purple-200">{ing.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 3: FIND THE OBJECT */}
        {activeGame === 'find_object' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-100">Search the Cozy Gothic Bedroom 🔍</h3>
                <p className="text-xs text-purple-300">Click hidden objects scattered in the room!</p>
              </div>
              <div className="text-xs font-bold text-amber-300 bg-purple-950 px-3 py-1 rounded-xl border border-purple-700">
                Found: {foundObjects.length} / {hiddenObjects.length}
              </div>
            </div>

            <div className="relative w-full h-[260px] bg-gradient-to-br from-[#231838] to-[#120b21] rounded-2xl border border-purple-800/40 overflow-hidden">
              {/* Furniture silhouettes */}
              <div className="absolute bottom-2 left-6 text-5xl opacity-40">🛏️</div>
              <div className="absolute bottom-2 right-8 text-5xl opacity-40">🪞</div>
              <div className="absolute top-4 left-8 text-4xl opacity-40">🖼️</div>

              {/* Clickable hidden objects */}
              {hiddenObjects.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => handleFoundItem(obj.id)}
                  style={{ top: `${obj.y}%`, left: `${obj.x}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-xl text-2xl transition-all cursor-pointer ${
                    foundObjects.includes(obj.id)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-400 scale-125'
                      : 'hover:scale-125 hover:bg-white/10'
                  }`}
                  title={obj.name}
                >
                  {obj.icon}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 4: MOON MATCH */}
        {activeGame === 'moon_match' && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-sm font-bold text-purple-100">Match the Pairs Before Dawn 🌙</h3>
              <p className="text-xs text-purple-300">Tap cards to flip and match twins!</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {cards.map((card, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCardClick(idx)}
                  className={`h-24 rounded-2xl border-2 flex items-center justify-center text-3xl font-bold transition-all ${
                    card.flipped || card.matched
                      ? 'bg-purple-900 border-purple-400 text-amber-300 shadow-md'
                      : 'bg-[#22183b] hover:bg-[#2f2152] border-purple-700/60 text-transparent cursor-pointer'
                  }`}
                >
                  {card.flipped || card.matched ? card.sym : '❓'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 5: ESCAPE THE HUNTER */}
        {activeGame === 'escape_hunter' && (
          <div className="space-y-4 text-center">
            <div>
              <h3 className="text-sm font-bold text-purple-100">Choose the Stealthy Path 🏃</h3>
              <p className="text-xs text-purple-300">
                Stage {hunterStage}/3 • Leo's flashlight is sweeping the alleyway!
              </p>
            </div>

            <div className="py-4 text-5xl">
              {hunterStage === 1 ? '🔦 🏃' : hunterStage === 2 ? '🌲 🏃' : '🏠 🚪'}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Rooftop Drainpipe', good: true },
                { label: 'Noisy Garbage Cans', good: false },
                { label: 'Dark Archway', good: true }
              ].map((path, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (path.good) {
                      sounds.playCoin();
                      if (hunterStage >= 3) {
                        setWon(true);
                        setGameOver(true);
                        sounds.playAchievement();
                      } else {
                        setHunterStage((s) => s + 1);
                      }
                    } else {
                      sounds.playGameOver();
                      setWon(false);
                      setGameOver(true);
                    }
                  }}
                  className="p-3 rounded-2xl bg-[#231a3b] hover:bg-[#342757] border border-purple-700 text-xs font-bold text-purple-200 transition-all"
                >
                  {path.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GAME 6: VAMPIRE PUZZLE */}
        {activeGame === 'vampire_puzzle' && (
          <div className="space-y-4 text-center">
            <div>
              <h3 className="text-sm font-bold text-purple-100">Align the Ancient Runes 🧩</h3>
              <p className="text-xs text-purple-300">
                Rearrange symbols into Target Order: <span className="font-bold text-amber-300">🌙 ➔ 🦇 ➔ ✨ ➔ 🩸</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-6">
              {puzzleOrder.map((sym, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sounds.playClick();
                    const next = [...puzzleOrder];
                    const nextIdx = (idx + 1) % next.length;
                    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
                    setPuzzleOrder(next);
                    if (next.every((s, i) => s === targetOrder[i])) {
                      setWon(true);
                      setGameOver(true);
                      sounds.playAchievement();
                    }
                  }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-800 to-indigo-900 border-2 border-purple-400 text-2xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                >
                  {sym}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-purple-400">Click any symbol to swap it with its neighbor!</p>
          </div>
        )}

        {/* GAME OVER / VICTORY OVERLAY */}
        {gameOver && (
          <div className="absolute inset-0 z-40 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            {won ? (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 mx-auto flex items-center justify-center text-3xl">
                  🏆
                </div>
                <h2 className="text-xl font-bold text-emerald-300">Challenge Cleared!</h2>
                <p className="text-xs text-purple-200 max-w-sm mx-auto">
                  You completed the mini-game safely! Rewarded with +25 Coins & +15 Energy.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onFinishGame(true, 'Mini-game victory! (+25 Coins, +15 Energy)')}
                    className="px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-transform active:scale-95"
                  >
                    Claim Reward & Return
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500 mx-auto flex items-center justify-center text-3xl">
                  ⏰
                </div>
                <h2 className="text-xl font-bold text-red-300">Time Ran Out!</h2>
                <p className="text-xs text-purple-200 max-w-sm mx-auto">
                  The morning rooster crowed or the path was lost, but you managed to slip away into the shadows.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => resetGame(activeGame)}
                    className="px-4 py-2 rounded-2xl bg-purple-800 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Try Again
                  </button>
                  <button
                    onClick={() => onFinishGame(false, 'Slipped away into the night.')}
                    className="px-4 py-2 rounded-2xl bg-[#2e234d] hover:bg-[#3c2f63] text-purple-200 font-bold text-xs"
                  >
                    Back to Story
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

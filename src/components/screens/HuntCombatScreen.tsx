import React, { useState } from 'react';
import { PlayerStats, VampireProfile, Enemy, Ability } from '../../types';
import { Sword, Droplet, Eye, Zap, Shield, Wind, Skull, ArrowLeft, Sparkles, AlertTriangle } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface HuntCombatScreenProps {
  stats: PlayerStats;
  profile: VampireProfile;
  abilities: Record<string, Ability>;
  onCombatEnd: (victory: boolean, summary: string, rewards?: { money: number; hunger: number; log: string }) => void;
  onBack: () => void;
}

const PRESET_ENEMIES: Array<{
  id: string;
  name: string;
  category: 'Human' | 'Hunter' | 'Werewolf' | 'Rival' | 'Supernatural';
  hp: number;
  attack: number;
  defense: number;
  rewardMoney: number;
  rewardBlood: number;
  desc: string;
  icon: string;
}> = [
  {
    id: 'mortal_thug',
    name: 'Alleyway Footpad',
    category: 'Human',
    hp: 45,
    attack: 8,
    defense: 2,
    rewardMoney: 35,
    rewardBlood: 35,
    desc: 'A cutpurse stalking late-night strollers in the foggy gaslit gutters.',
    icon: '🗡️'
  },
  {
    id: 'vampire_hunter',
    name: 'Silver Dawn Inquisitor',
    category: 'Hunter',
    hp: 85,
    attack: 16,
    defense: 8,
    rewardMoney: 80,
    rewardBlood: 20,
    desc: 'An armored hunter brandishing consecrated silver stakes and phosphorus flares.',
    icon: '✝️'
  },
  {
    id: 'ashwood_wolf',
    name: 'Ashwood Pack Stalker',
    category: 'Werewolf',
    hp: 110,
    attack: 20,
    defense: 10,
    rewardMoney: 50,
    rewardBlood: 25,
    desc: 'A massive lunar wolf with obsidian fur and razor-sharp jaws.',
    icon: '🐺'
  },
  {
    id: 'coven_rival',
    name: 'Aristocratic Duelist',
    category: 'Rival',
    hp: 95,
    attack: 18,
    defense: 12,
    rewardMoney: 110,
    rewardBlood: 40,
    desc: 'A haughty highborn vampire seeking to eliminate you before Queen Carmilla’s court.',
    icon: '🍷'
  },
  {
    id: 'gargoyle_stalker',
    name: 'Catacomb Shadow Fiend',
    category: 'Supernatural',
    hp: 125,
    attack: 22,
    defense: 14,
    rewardMoney: 130,
    rewardBlood: 50,
    desc: 'An ancient animated stone creature awakened beneath the crypts.',
    icon: '🗿'
  }
];

export const HuntCombatScreen: React.FC<HuntCombatScreenProps> = ({
  stats,
  profile,
  abilities,
  onCombatEnd,
  onBack
}) => {
  const [activeEnemy, setActiveEnemy] = useState<Enemy | null>(null);
  const [enemyHp, setEnemyHp] = useState<number>(100);
  const [playerHp, setPlayerHp] = useState<number>(stats.health);
  const [playerEnergy, setPlayerEnergy] = useState<number>(stats.energy);
  const [combatLog, setCombatLog] = useState<string[]>([
    'Stalked through the foggy cobblestone avenues. Choose a target to engage in battle.'
  ]);
  const [isDefending, setIsDefending] = useState<boolean>(false);
  const [isHypnotized, setIsHypnotized] = useState<boolean>(false);

  const startFight = (preset: (typeof PRESET_ENEMIES)[0]) => {
    sounds.playBite();
    const enemy: Enemy = {
      id: preset.id,
      name: preset.name,
      health: preset.hp,
      maxHealth: preset.hp,
      attackPower: preset.attack,
      defense: preset.defense,
      rewardMoney: preset.rewardMoney,
      rewardBlood: preset.rewardBlood,
      description: preset.desc,
      specialAbility: 'Frenzy Strike'
    };
    setActiveEnemy(enemy);
    setEnemyHp(enemy.health);
    setPlayerHp(stats.health);
    setPlayerEnergy(stats.energy);
    setIsDefending(false);
    setIsHypnotized(false);
    setCombatLog([`You ambushed ${enemy.name}! The shadows swirl as battle begins.`]);
  };

  const handlePlayerAction = (action: 'attack' | 'bite' | 'hypnotize' | 'ability' | 'defend' | 'escape') => {
    if (!activeEnemy) return;

    if (action === 'escape') {
      sounds.playFootstep();
      onCombatEnd(false, 'You dissolved into nocturnal mist and retreated to your safehouse.');
      return;
    }

    let pDamage = 0;
    let newEnemyHp = enemyHp;
    let newPlayerHp = playerHp;
    let newEnergy = playerEnergy;
    let logMsg = '';
    let nowHypnotized = false;
    let nowDefending = false;

    if (action === 'attack') {
      sounds.playClaw();
      const bonus = profile.personality === 'Ruthless' ? 10 : 0;
      pDamage = Math.max(8, 16 + bonus - activeEnemy.defense);
      newEnemyHp = Math.max(0, enemyHp - pDamage);
      logMsg = `You slashed ${activeEnemy.name} with razor claws for ${pDamage} damage!`;
    } else if (action === 'bite') {
      sounds.playBite();
      pDamage = Math.max(10, 20 - Math.floor(activeEnemy.defense / 2));
      const healAmt = 15;
      newEnemyHp = Math.max(0, enemyHp - pDamage);
      newPlayerHp = Math.min(stats.maxHealth, playerHp + healAmt);
      logMsg = `Fangs sank deep! Dealt ${pDamage} damage and drained warm blood (Healed +${healAmt} HP, -20 Thirst).`;
    } else if (action === 'hypnotize') {
      if (newEnergy < 15) {
        setCombatLog((prev) => ['Not enough Vampire Energy to mesmerize!', ...prev]);
        return;
      }
      sounds.playMagic();
      newEnergy -= 15;
      nowHypnotized = true;
      logMsg = `Your eyes ignited with hypnotic allure! ${activeEnemy.name} is mesmerized and cannot act this turn!`;
    } else if (action === 'ability') {
      if (newEnergy < 20) {
        setCombatLog((prev) => ['Not enough Energy to unleash Superhuman Speed!', ...prev]);
        return;
      }
      sounds.playMagic();
      newEnergy -= 20;
      pDamage = 28;
      newEnemyHp = Math.max(0, enemyHp - pDamage);
      logMsg = `Blurring with Superhuman Speed, you struck twice for ${pDamage} devastating damage!`;
    } else if (action === 'defend') {
      sounds.playClick();
      nowDefending = true;
      newEnergy = Math.min(stats.maxEnergy, newEnergy + 12);
      logMsg = 'You braced in vampiric guard: incoming damage will be halved, and you regained 12 Energy.';
    }

    setEnemyHp(newEnemyHp);
    setPlayerHp(newPlayerHp);
    setPlayerEnergy(newEnergy);
    setIsDefending(nowDefending);
    setIsHypnotized(nowHypnotized);

    // Check Enemy Defeat
    if (newEnemyHp <= 0) {
      sounds.playVictory();
      setCombatLog((prev) => [`✦ VICTORY! ${activeEnemy.name} was vanquished!`, logMsg, ...prev]);
      setTimeout(() => {
        onCombatEnd(
          true,
          `Vanquished ${activeEnemy.name}! Gained $${activeEnemy.rewardMoney} gold and satiated thirst.`,
          {
            money: activeEnemy.rewardMoney,
            hunger: -activeEnemy.rewardBlood,
            log: `Defeated ${activeEnemy.name} in combat.`
          }
        );
      }, 1200);
      return;
    }

    // Enemy Turn (if not hypnotized)
    if (!nowHypnotized) {
      let eDamage = Math.max(4, activeEnemy.attackPower);
      if (nowDefending) {
        eDamage = Math.floor(eDamage / 2);
      }
      const finalPlayerHp = Math.max(0, newPlayerHp - eDamage);
      setPlayerHp(finalPlayerHp);

      const enemyLog = `${activeEnemy.name} counter-attacked for ${eDamage} damage!`;
      setCombatLog((prev) => [enemyLog, logMsg, ...prev]);

      if (finalPlayerHp <= 0) {
        sounds.playGameOver();
        setTimeout(() => {
          onCombatEnd(false, `You were struck down by ${activeEnemy.name}! Your ash scatters into the wind.`);
        }, 1200);
      }
    } else {
      setCombatLog((prev) => [logMsg, ...prev]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#382333]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-500 to-amber-200">
            🩸 NOCTURNAL HUNTING & COMBAT ARENA
          </h2>
          <p className="text-xs text-[#decbc0] font-serif mt-0.5">
            Stalk prey or duel high-threat adversaries lurking in the gaslit shadows
          </p>
        </div>

        <div className="text-xs font-mono text-red-300 bg-red-950/60 px-3 py-1.5 rounded-lg border border-red-800/60">
          Night {stats.night} Stalker
        </div>
      </div>

      {!activeEnemy ? (
        /* Target Selection View */
        <div className="space-y-4">
          <div className="text-sm font-cinzel font-bold text-red-300">
            Choose Your Nocturnal Quarry:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRESET_ENEMIES.map((preset) => (
              <div
                key={preset.id}
                className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] hover:border-red-600/70 shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{preset.icon}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-red-300 border border-red-800/40">
                      {preset.category}
                    </span>
                  </div>
                  <h3 className="font-cinzel font-bold text-base text-white">
                    {preset.name}
                  </h3>
                  <p className="text-xs font-serif text-[#decbc0] mt-1 leading-relaxed">
                    {preset.desc}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded bg-black/40 border border-[#2d1b2a]">
                    <span className="text-emerald-400">Vitality: {preset.hp} HP</span>
                    <span className="text-red-400">Attack: {preset.attack}</span>
                    <span className="text-amber-400">Yield: ${preset.rewardMoney}</span>
                    <span className="text-purple-400">Blood: +{preset.rewardBlood}</span>
                  </div>
                </div>

                <button
                  onClick={() => startFight(preset)}
                  className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#800f2f] to-[#a4133c] hover:from-[#a4133c] hover:to-[#c9184a] text-white font-cinzel font-bold text-xs tracking-wider border border-red-500/60 shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sword className="w-3.5 h-3.5" />
                  <span>AMBUSH PREY</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Active Combat Arena */
        <div className="space-y-6">
          {/* Battle Cards Grid: Player (Left) vs Enemy (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player Battle Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#241323] to-[#120e17] border-2 border-[#800f2f] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🧛</span>
                  <div>
                    <h3 className="font-cinzel font-bold text-white text-base">{profile.name}</h3>
                    <p className="text-xs text-amber-300 font-serif">{profile.outfit}</p>
                  </div>
                </div>
                {isDefending && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 border border-blue-500/60 text-blue-200 font-mono">
                    Defending
                  </span>
                )}
              </div>

              {/* HP Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400">Health</span>
                  <span className="text-white">{playerHp} / {stats.maxHealth}</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-[#382333]">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, (playerHp / stats.maxHealth) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Energy Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-blue-400">Vampire Energy</span>
                  <span className="text-white">{playerEnergy} / {stats.maxEnergy}</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-[#382333]">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, (playerEnergy / stats.maxEnergy) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Enemy Battle Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2b1019] to-[#140b12] border-2 border-red-700/60 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">⚔️</span>
                  <div>
                    <h3 className="font-cinzel font-bold text-red-200 text-base">{activeEnemy.name}</h3>
                    <p className="text-xs text-[#decbc0] font-serif">{activeEnemy.description}</p>
                  </div>
                </div>
                {isHypnotized && (
                  <span className="text-xs px-2 py-0.5 rounded bg-purple-900/60 border border-purple-500/60 text-purple-200 font-mono">
                    Hypnotized!
                  </span>
                )}
              </div>

              {/* Enemy HP Bar */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-red-400">Adversary Vitality</span>
                  <span className="text-white">{enemyHp} / {activeEnemy.maxHealth}</span>
                </div>
                <div className="w-full h-3 bg-black/60 rounded-full overflow-hidden border border-[#382333]">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
                    style={{ width: `${Math.max(0, (enemyHp / activeEnemy.maxHealth) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="text-xs font-mono text-[#b8a2ad] flex items-center justify-between pt-1">
                <span>Attack Power: {activeEnemy.attackPower}</span>
                <span>Armor Defense: {activeEnemy.defense}</span>
              </div>
            </div>
          </div>

          {/* Combat Commands Grid */}
          <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-xl space-y-3">
            <div className="text-xs font-cinzel font-bold text-red-300 uppercase tracking-wider">
              Tactical Combat Commands:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <button
                onClick={() => handlePlayerAction('attack')}
                className="p-3 rounded-xl bg-[#2b1219] hover:bg-[#421724] border border-red-700/60 text-white font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Sword className="w-4 h-4 text-red-400" />
                <span>Claw Slash</span>
                <span className="text-[10px] text-gray-400 font-mono">0 Energy</span>
              </button>

              <button
                onClick={() => handlePlayerAction('bite')}
                className="p-3 rounded-xl bg-[#400d1e] hover:bg-[#5e122b] border border-red-500/70 text-white font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Droplet className="w-4 h-4 text-red-400" />
                <span>Fang Bite</span>
                <span className="text-[10px] text-red-300 font-mono">Drain Blood</span>
              </button>

              <button
                onClick={() => handlePlayerAction('hypnotize')}
                className="p-3 rounded-xl bg-[#251336] hover:bg-[#391b52] border border-purple-700/60 text-white font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Eye className="w-4 h-4 text-purple-400" />
                <span>Hypnotize</span>
                <span className="text-[10px] text-purple-300 font-mono">15 Energy</span>
              </button>

              <button
                onClick={() => handlePlayerAction('ability')}
                className="p-3 rounded-xl bg-[#131d36] hover:bg-[#1a2b4e] border border-blue-700/60 text-white font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Zap className="w-4 h-4 text-blue-400" />
                <span>Speed Blitz</span>
                <span className="text-[10px] text-blue-300 font-mono">20 Energy</span>
              </button>

              <button
                onClick={() => handlePlayerAction('defend')}
                className="p-3 rounded-xl bg-[#1d1a24] hover:bg-[#2d2838] border border-[#443852] text-white font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Shield className="w-4 h-4 text-gray-300" />
                <span>Guard Stance</span>
                <span className="text-[10px] text-emerald-400 font-mono">+12 Energy</span>
              </button>

              <button
                onClick={() => handlePlayerAction('escape')}
                className="p-3 rounded-xl bg-[#130f14] hover:bg-[#201822] border border-[#3e2439] text-gray-300 font-cinzel font-bold text-xs flex flex-col items-center gap-1.5 cursor-pointer transition-all"
              >
                <Wind className="w-4 h-4 text-gray-400" />
                <span>Mist Retreat</span>
                <span className="text-[10px] text-gray-500 font-mono">Escape</span>
              </button>
            </div>
          </div>

          {/* Combat Log Console */}
          <div className="p-4 rounded-xl bg-black/50 border border-[#382333] space-y-1 font-serif text-xs">
            <div className="text-red-400 font-cinzel font-bold mb-1">Battle Chronicle:</div>
            {combatLog.slice(0, 5).map((log, idx) => (
              <div key={idx} className="text-[#decbc0] leading-relaxed">
                • {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

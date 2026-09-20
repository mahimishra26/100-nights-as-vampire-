import { useState, useEffect } from 'react';
import { Enemy, PlayerStats, Ability, InventoryItem } from '../types';
import { Swords, Shield, Zap, Droplet, ArrowRightCircle, Sparkles, Wind } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface CombatModalProps {
  enemy: Enemy;
  stats: PlayerStats;
  abilities: Record<string, Ability>;
  items: Record<string, InventoryItem>;
  onFinishCombat: (result: { won: boolean; escaped: boolean; newStats: PlayerStats; log: string }) => void;
}

export function CombatModal({
  enemy,
  stats,
  abilities,
  items,
  onFinishCombat
}: CombatModalProps) {
  const [currentEnemyHealth, setCurrentEnemyHealth] = useState(enemy.health);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({ ...stats });
  const [combatLogs, setCombatLogs] = useState<string[]>([
    `Engaged in lethal combat with ${enemy.name}!`,
    enemy.description
  ]);
  const [isOver, setIsOver] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [escaped, setEscaped] = useState(false);
  const [enemyStunned, setEnemyStunned] = useState(false);
  const [isDefending, setIsDefending] = useState(false);

  // Attack Action
  const handleAttack = () => {
    if (isOver) return;
    sounds.playSlash();

    const speedBonus = abilities['superhuman_speed'] ? abilities['superhuman_speed'].level * 4 : 0;
    const isCrit = Math.random() < 0.2;
    let dmg = Math.floor(Math.random() * 12) + 20 + speedBonus;
    if (isCrit) dmg = Math.floor(dmg * 1.5);

    const actualDmg = Math.max(1, dmg - enemy.defense);
    const newEnemyHp = Math.max(0, currentEnemyHealth - actualDmg);
    setCurrentEnemyHealth(newEnemyHp);

    const logEntry = `You strike with supernatural fury for ${actualDmg} damage${isCrit ? ' (CRITICAL HIT!)' : ''}.`;
    
    if (newEnemyHp <= 0) {
      handleVictory(logEntry);
      return;
    }

    enemyTurn([logEntry]);
  };

  // Bite Drain Action
  const handleBite = () => {
    if (isOver) return;
    sounds.playBite();

    const hit = Math.random() < (currentEnemyHealth < enemy.maxHealth * 0.5 ? 0.75 : 0.5);
    if (hit) {
      const dmg = Math.floor(Math.random() * 14) + 22;
      const actualDmg = Math.max(1, dmg - enemy.defense);
      const newEnemyHp = Math.max(0, currentEnemyHealth - actualDmg);
      setCurrentEnemyHealth(newEnemyHp);

      const healAmt = 18;
      const hungerCut = 35;
      const updatedStats = {
        ...playerStats,
        health: Math.min(playerStats.maxHealth, playerStats.health + healAmt),
        hunger: Math.max(0, playerStats.hunger - hungerCut)
      };
      setPlayerStats(updatedStats);

      const logEntry = `You sink your fangs into ${enemy.name}'s throat! Dealt ${actualDmg} dmg, healed +${healAmt} HP, and relieved thirst (-${hungerCut}%).`;

      if (newEnemyHp <= 0) {
        handleVictory(logEntry, updatedStats);
        return;
      }
      enemyTurn([logEntry], updatedStats);
    } else {
      const missLog = `${enemy.name} deflected your biting lunge!`;
      enemyTurn([missLog]);
    }
  };

  // Defend Action
  const handleDefend = () => {
    if (isOver) return;
    sounds.playMagic();

    setIsDefending(true);
    const updatedStats = {
      ...playerStats,
      energy: Math.min(playerStats.maxEnergy, playerStats.energy + 15)
    };
    setPlayerStats(updatedStats);

    const logEntry = 'You assume an evasive guard, deflecting incoming blows and recovering focus (+15⚡).';
    enemyTurn([logEntry], updatedStats, true);
  };

  // Ability: Superhuman Speed
  const handleSpeedAbility = () => {
    const ab = abilities['superhuman_speed'];
    if (!ab || playerStats.energy < ab.baseCost || isOver) return;
    sounds.playSlash();

    const newEnergy = playerStats.energy - ab.baseCost;
    const dmg1 = Math.floor(Math.random() * 8) + 16;
    const dmg2 = Math.floor(Math.random() * 8) + 16;
    const totalDmg = Math.max(2, (dmg1 + dmg2) - enemy.defense);
    const newEnemyHp = Math.max(0, currentEnemyHealth - totalDmg);
    setCurrentEnemyHealth(newEnemyHp);

    const updatedStats = { ...playerStats, energy: newEnergy };
    setPlayerStats(updatedStats);

    const logEntry = `Superhuman Speed: You blur across the stone, unleashing a twin-strike for ${totalDmg} damage!`;

    if (newEnemyHp <= 0) {
      handleVictory(logEntry, updatedStats);
      return;
    }

    enemyTurn([logEntry], updatedStats);
  };

  // Ability: Hypnosis
  const handleHypnosisAbility = () => {
    const ab = abilities['hypnosis'];
    if (!ab || playerStats.energy < ab.baseCost || isOver) return;
    sounds.playMagic();

    const newEnergy = playerStats.energy - ab.baseCost;
    const updatedStats = { ...playerStats, energy: newEnergy };
    setPlayerStats(updatedStats);
    setEnemyStunned(true);

    const logEntry = `Hypnotic Gaze: Your eyes ignite with crimson spellfire! ${enemy.name} is mesmerized and loses their turn.`;
    setCombatLogs((prev) => [...prev, logEntry]);
  };

  // Flee / Escape Action
  const handleEscape = () => {
    if (isOver) return;

    if (items['smoke_bomb'] && items['smoke_bomb'].quantity > 0) {
      sounds.playMagic();
      setEscaped(true);
      setIsOver(true);
      setCombatLogs((prev) => [
        ...prev,
        'You shatter a Shadow Smoke Bomb! Pitch-black mist blinds the battlefield as you escape clean.'
      ]);
      return;
    }

    const success = Math.random() < 0.65;
    if (success) {
      sounds.playMagic();
      setEscaped(true);
      setIsOver(true);
      setCombatLogs((prev) => [...prev, 'You leapt into the moonlit fog and escaped the encounter!']);
    } else {
      const failLog = 'Failed to disengage! The enemy blocked your escape route.';
      enemyTurn([failLog]);
    }
  };

  // Enemy Turn Execution
  const enemyTurn = (pendingLogs: string[], currentPStats: PlayerStats = playerStats, defendingNow: boolean = false) => {
    if (enemyStunned) {
      setEnemyStunned(false);
      setCombatLogs((prev) => [...prev, ...pendingLogs, `${enemy.name} shakes their head, breaking free from hypnosis.`]);
      setIsDefending(false);
      return;
    }

    // Enemy attack calculation
    let rawDmg = Math.floor(Math.random() * 8) + enemy.attackPower;
    if (defendingNow || isDefending) {
      rawDmg = Math.max(2, Math.floor(rawDmg * 0.4));
    }
    const newPlayerHp = Math.max(0, currentPStats.health - rawDmg);
    const finalStats = { ...currentPStats, health: newPlayerHp };
    setPlayerStats(finalStats);

    const enemyLog = `${enemy.name} retaliates with ${enemy.specialAbility || 'a vicious blow'} for ${rawDmg} damage!`;
    const combined = [...pendingLogs, enemyLog];

    if (newPlayerHp <= 0) {
      setIsOver(true);
      setPlayerWon(false);
      combined.push('You have collapsed from lethal wounds in combat...');
      sounds.playBellToll();
    }

    setCombatLogs((prev) => [...prev, ...combined]);
    setIsDefending(false);
  };

  const handleVictory = (finalLog: string, finalStats: PlayerStats = playerStats) => {
    setIsOver(true);
    setPlayerWon(true);
    sounds.playOrganChord();

    const earnedMoney = enemy.rewardMoney;
    const earnedBlood = enemy.rewardBlood;
    const victStats = {
      ...finalStats,
      money: finalStats.money + earnedMoney,
      hunger: Math.max(0, finalStats.hunger - earnedBlood)
    };
    setPlayerStats(victStats);

    setCombatLogs((prev) => [
      ...prev,
      finalLog,
      `✦ VICTORY! ✦ ${enemy.name} was defeated. Claimed +$${earnedMoney} and sated +${earnedBlood} Blood!`
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#14111c] border-2 border-red-700/80 shadow-[0_0_60px_rgba(220,38,38,0.4)] overflow-hidden flex flex-col">
        {/* Combat Top Header */}
        <div className="bg-gradient-to-r from-red-950 via-[#231422] to-[#120f1c] px-6 py-3 border-b border-red-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-red-400 animate-pulse" />
            <h2 className="font-cinzel text-base md:text-lg font-bold text-red-100 tracking-wider">
              NIGHT ENCOUNTER COMBAT
            </h2>
          </div>
          <div className="text-xs text-red-300 font-mono font-semibold">
            {isOver ? (playerWon ? '★ VICTORY ★' : escaped ? '★ ESCAPED ★' : '💀 FALLEN 💀') : 'TURN IN PROGRESS'}
          </div>
        </div>

        {/* Center Arena: Enemy vs Player */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Enemy Card */}
          <div className="bg-[#1a1424] border border-red-900/60 rounded-xl p-4 flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-cinzel text-base font-bold text-red-200">
                    {enemy.name}
                  </h3>
                  <p className="text-[11px] text-[#a893a0] font-serif italic">
                    Specialty: {enemy.specialAbility || 'Brute Force'}
                  </p>
                </div>
                <div className="px-2 py-0.5 rounded bg-red-950/70 border border-red-800 text-[11px] font-mono text-red-300">
                  ATK {enemy.attackPower} | DEF {enemy.defense}
                </div>
              </div>

              {/* Enemy Health Bar */}
              <div className="mt-3 mb-4">
                <div className="flex justify-between text-xs font-mono mb-1 text-red-300">
                  <span>Enemy Health</span>
                  <span>{currentEnemyHealth} / {enemy.maxHealth} HP</span>
                </div>
                <div className="w-full h-3 rounded bg-black/60 border border-red-900/70 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 to-rose-500 transition-all duration-300"
                    style={{ width: `${Math.max(0, (currentEnemyHealth / enemy.maxHealth) * 100)}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-[#b8a7b1] font-serif leading-relaxed">
                {enemy.description}
              </p>
            </div>

            {enemyStunned && (
              <div className="mt-3 px-3 py-1.5 rounded bg-purple-950/60 border border-purple-800 text-xs text-purple-300 font-serif flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Mesmerized by Hypnosis (Skipping next turn!)</span>
              </div>
            )}
          </div>

          {/* Combat Log Box */}
          <div className="bg-[#0f0d16] border border-[#3b2a3a] rounded-xl p-4 flex flex-col justify-between">
            <h4 className="text-[11px] font-cinzel font-bold text-[#bcaab5] uppercase tracking-wider mb-2 border-b border-[#2b1f2b] pb-1">
              Battle Chronicle
            </h4>
            <div className="space-y-2 overflow-y-auto max-h-44 text-xs font-serif text-[#decbc0] pr-1">
              {combatLogs.slice(-7).map((log, idx) => (
                <div
                  key={idx}
                  className={`p-1.5 rounded ${
                    log.includes('VICTORY')
                      ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40'
                      : log.includes('strike') || log.includes('fangs')
                      ? 'bg-red-950/30 text-red-200'
                      : 'text-[#cdb9c5]'
                  }`}
                >
                  • {log}
                </div>
              ))}
            </div>

            {/* Player status mini bar */}
            <div className="mt-3 pt-2 border-t border-[#261d27] flex items-center justify-between text-xs font-serif">
              <span className="text-emerald-400">Your Vitality: {playerStats.health}/{playerStats.maxHealth} HP</span>
              <span className="text-blue-400">Energy: {playerStats.energy}⚡</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Panel */}
        <div className="p-6 bg-[#0c0a12] border-t border-[#3b2333]">
          {!isOver ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              <button
                onClick={handleAttack}
                className="px-3 py-3 rounded-xl bg-[#261522] hover:bg-red-900 text-red-100 border border-red-800 text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Swords className="w-4 h-4 text-red-400" />
                <span>Claw Strike</span>
              </button>

              <button
                onClick={handleBite}
                className="px-3 py-3 rounded-xl bg-[#2b111e] hover:bg-[#571635] text-rose-100 border border-rose-800 text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Droplet className="w-4 h-4 text-rose-400" />
                <span>Fang Drain</span>
              </button>

              <button
                onClick={handleDefend}
                className="px-3 py-3 rounded-xl bg-[#1b1e2a] hover:bg-[#2c344d] text-blue-100 border border-blue-800 text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Defend (+15⚡)</span>
              </button>

              <button
                disabled={playerStats.energy < (abilities['superhuman_speed']?.baseCost || 15)}
                onClick={handleSpeedAbility}
                className="px-3 py-3 rounded-xl bg-[#1c182d] hover:bg-[#342757] text-purple-100 border border-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Speed Blitz</span>
              </button>

              <button
                disabled={!abilities['hypnosis']?.level || playerStats.energy < abilities['hypnosis'].baseCost}
                onClick={handleHypnosisAbility}
                className="px-3 py-3 rounded-xl bg-[#20152b] hover:bg-[#431d61] text-purple-100 border border-purple-800 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Hypnotize</span>
              </button>

              <button
                onClick={handleEscape}
                className="px-3 py-3 rounded-xl bg-[#1d1b22] hover:bg-[#34303d] text-gray-200 border border-gray-700 text-xs font-cinzel font-semibold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all hover:scale-105"
              >
                <Wind className="w-4 h-4 text-gray-400" />
                <span>Escape / Flee</span>
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() =>
                  onFinishCombat({
                    won: playerWon,
                    escaped,
                    newStats: playerStats,
                    log: combatLogs[combatLogs.length - 1]
                  })
                }
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-900 to-[#4a1c32] hover:from-red-800 hover:to-[#632442] text-red-100 border border-red-600 text-sm font-cinzel font-bold tracking-wider cursor-pointer shadow-xl flex items-center gap-2"
              >
                <span>Proceed Into the Shadows</span>
                <ArrowRightCircle className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

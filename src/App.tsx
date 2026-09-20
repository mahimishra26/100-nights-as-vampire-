import { useState, useEffect } from 'react';
import {
  PlayerStats,
  LocationInfo,
  NPCCharacter,
  Ability,
  InventoryItem,
  GameEvent,
  EventChoice,
  Enemy,
  EndingResult
} from './types';
import {
  INITIAL_LOCATIONS,
  INITIAL_CHARACTERS,
  INITIAL_ABILITIES,
  INITIAL_ITEMS,
  MILESTONE_EVENTS
} from './data/gameData';
import { GothicCanvas } from './components/GothicCanvas';
import { TopNavBar } from './components/TopNavBar';
import { LocationGrid } from './components/LocationGrid';
import { EventModal } from './components/EventModal';
import { CombatModal } from './components/CombatModal';
import { InventoryModal } from './components/InventoryModal';
import { AbilitiesModal } from './components/AbilitiesModal';
import { RelationshipsModal } from './components/RelationshipsModal';
import { PythonHubModal } from './components/PythonHubModal';
import { EndingModal } from './components/EndingModal';
import { sounds } from './audio/soundManager';
import { Sparkles, Moon, FastForward, Info, RotateCcw } from 'lucide-react';

export function App() {
  // Game state
  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('vampire_100_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      health: 100,
      maxHealth: 100,
      hunger: 25,
      secrecy: 85,
      energy: 70,
      maxEnergy: 100,
      money: 120,
      night: 1
    };
  });

  const [unlockedLocations, setUnlockedLocations] = useState<string[]>([
    'mansion',
    'downtown',
    'graveyard',
    'academy',
    'nightclub'
  ]);
  const [characters, setCharacters] = useState<Record<string, NPCCharacter>>(INITIAL_CHARACTERS);
  const [abilities, setAbilities] = useState<Record<string, Ability>>(INITIAL_ABILITIES);
  const [items, setItems] = useState<Record<string, InventoryItem>>(INITIAL_ITEMS);

  // Active modals
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeCombatEnemy, setActiveCombatEnemy] = useState<Enemy | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showAbilities, setShowAbilities] = useState(false);
  const [showRelationships, setShowRelationships] = useState(false);
  const [showPythonHub, setShowPythonHub] = useState(false);
  const [activeEnding, setActiveEnding] = useState<EndingResult | null>(null);

  // Notifications & UI state
  const [muted, setMuted] = useState(false);
  const [activityLogs, setActivityLogs] = useState<string[]>([
    'Awakened as an immortal in Oakhaven. 100 nights remain until the Blood Moon.',
    'Select a gothic location or satiate your thirst before dawn.'
  ]);
  const [dawnReport, setDawnReport] = useState<string | null>(null);

  // Save on state change
  useEffect(() => {
    localStorage.setItem('vampire_100_stats', JSON.stringify(stats));
  }, [stats]);

  // Check Game Over Conditions
  useEffect(() => {
    if (activeEnding) return;

    if (stats.health <= 0) {
      sounds.playBellToll();
      setActiveEnding({
        id: 'defeated',
        title: 'Reduced to Ash',
        badge: 'MORTAL DISSOLUTION',
        description:
          'Your undead heart has ceased beating. The cold silver, blessed blade, or ravenous wounds were too grievous to endure. Your physical form dissolves into gray ash upon the Victorian cobblestones, forgotten by history.'
      });
    } else if (stats.secrecy <= 0) {
      sounds.playBellToll();
      setActiveEnding({
        id: 'defeated',
        title: 'Exposed & Executed',
        badge: 'INQUISITION SUNRISE',
        description:
          'The mortal authorities and Detective Cross discovered your coffin before twilight. Stripped of shelter, you awoke bound in chains of sanctified steel atop the cathedral bell tower. The rising sun was your swift executioner.'
      });
    } else if (stats.hunger >= 100) {
      sounds.playBellToll();
      setActiveEnding({
        id: 'defeated',
        title: 'The Beast Takes Over',
        badge: 'FERAL DEVOLUTION',
        description:
          'The crimson starvation shattered the remnants of your mortal mind. In a mindless frenzy, you slaughtered indiscriminately in the city square until the ancient vampire elders and werewolf packs united to put you down like a rabid hound.'
      });
    }
  }, [stats.health, stats.secrecy, stats.hunger, activeEnding]);

  // Check milestone on night update
  useEffect(() => {
    const milestone = MILESTONE_EVENTS[stats.night];
    if (milestone && !activeEvent && !activeCombatEnemy && !activeEnding) {
      sounds.playOrganChord();
      setActiveEvent(milestone);
    }
  }, [stats.night]);

  // Advance to next night
  const advanceNight = (logMsg: string) => {
    const nextNight = stats.night + 1;
    const nextHunger = Math.min(100, stats.hunger + 15);
    const nextEnergy = Math.min(stats.maxEnergy, stats.energy + 35);
    let hpDmg = 0;
    const consequences: string[] = [logMsg];

    if (nextHunger >= 90) {
      hpDmg = 20;
      consequences.push('STARVATION FRENZY: The burning thirst tore at your undead flesh (-20 HP).');
      sounds.playHeartbeat();
    } else if (nextHunger >= 75) {
      hpDmg = 10;
      consequences.push('Severe Thirst: Hunger weakened your focus (-10 HP).');
    }

    // Unlock locations progressively
    const newUnlocked = [...unlockedLocations];
    if (nextNight >= 5 && !newUnlocked.includes('forest')) newUnlocked.push('forest');
    if (nextNight >= 10 && !newUnlocked.includes('church')) newUnlocked.push('church');
    if (nextNight >= 15 && !newUnlocked.includes('hospital')) newUnlocked.push('hospital');
    if (nextNight >= 20 && !newUnlocked.includes('market')) newUnlocked.push('market');
    setUnlockedLocations(newUnlocked);

    setStats((prev) => ({
      ...prev,
      night: nextNight,
      hunger: nextHunger,
      energy: nextEnergy,
      health: Math.max(0, prev.health - hpDmg)
    }));

    setDawnReport(`Night ${stats.night} Concluded. Dawn approaches.`);
    setActivityLogs((prev) => [...consequences, ...prev.slice(0, 8)]);
  };

  // Quick Feeding
  const handleQuickFeed = (method: 'rats' | 'bag' | 'stealth_mortal') => {
    if (method === 'rats') {
      sounds.playBite();
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 20),
        energy: Math.min(prev.maxEnergy, prev.energy + 10)
      }));
      setActivityLogs((prev) => ['Hunted vermin in the damp alleys (-20 Thirst, +10⚡).', ...prev.slice(0, 8)]);
    } else if (method === 'bag') {
      if (items['preserved_blood'] && items['preserved_blood'].quantity > 0) {
        sounds.playBite();
        setItems((prev) => ({
          ...prev,
          preserved_blood: {
            ...prev['preserved_blood'],
            quantity: prev['preserved_blood'].quantity - 1
          }
        }));
        setStats((prev) => ({
          ...prev,
          hunger: Math.max(0, prev.hunger - 45),
          health: Math.min(prev.maxHealth, prev.health + 15),
          energy: Math.min(prev.maxEnergy, prev.energy + 25)
        }));
        setActivityLogs((prev) => [
          'Consumed a preserved blood pack (-45 Thirst, +15 HP, +25⚡).',
          ...prev.slice(0, 8)
        ]);
      } else if (items['rat_blood'] && items['rat_blood'].quantity > 0) {
        sounds.playBite();
        setItems((prev) => ({
          ...prev,
          rat_blood: { ...prev['rat_blood'], quantity: prev['rat_blood'].quantity - 1 }
        }));
        setStats((prev) => ({
          ...prev,
          hunger: Math.max(0, prev.hunger - 15)
        }));
        setActivityLogs((prev) => ['Consumed a vial of animal blood (-15 Thirst).', ...prev.slice(0, 8)]);
      } else {
        alert('You have no blood packs or vials in your satchel! Visit the Hospital or Market to acquire some.');
      }
    } else if (method === 'stealth_mortal') {
      sounds.playMagic();
      const charmBonus = abilities['vampire_charm'] ? abilities['vampire_charm'].level * 4 : 0;
      const secrecyLoss = Math.max(3, 10 - charmBonus);
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 50),
        energy: Math.min(prev.maxEnergy, prev.energy + 30),
        secrecy: Math.max(0, prev.secrecy - secrecyLoss)
      }));
      setActivityLogs((prev) => [
        `Gently mesmerized an alley reveller (-50 Thirst, +30⚡, -${secrecyLoss}% Secrecy).`,
        ...prev.slice(0, 8)
      ]);
    }
  };

  // Location Selection & Event Generation
  const handleSelectLocation = (locId: string) => {
    sounds.playOrganChord();
    const loc = INITIAL_LOCATIONS[locId];

    // Check if encounter triggers combat or narrative
    const roll = Math.random();
    if (roll < 0.35 && loc.dangerLevel >= 2) {
      // Trigger combat encounter
      const enemy: Enemy = {
        id: `${locId}_encounter`,
        name:
          locId === 'church'
            ? 'Inquisitor Vanguard'
            : locId === 'forest'
            ? 'Ashwood Alpha Werewolf'
            : locId === 'graveyard'
            ? 'Starved Crypt Ghoul'
            : 'Vampire Hunter Scout',
        health: 55 + loc.dangerLevel * 12,
        maxHealth: 55 + loc.dangerLevel * 12,
        attackPower: 14 + loc.dangerLevel * 3,
        defense: 2 + loc.dangerLevel,
        rewardMoney: 40 + loc.dangerLevel * 15,
        rewardBlood: 25 + loc.dangerLevel * 5,
        description: `Ambushed while exploring ${loc.name}! They stand between you and the shadows.`,
        specialAbility: locId === 'church' ? 'Holy Smite' : locId === 'forest' ? 'Lycan Roar' : 'Silver Dart'
      };
      setActiveCombatEnemy(enemy);
    } else {
      // Narrative Location Event
      const generatedEvent: GameEvent = {
        id: `event_${locId}_${Date.now()}`,
        title: `${loc.name} Exploration`,
        speaker: loc.name,
        locationId: locId,
        text: `You venture into ${loc.name}. The moon casts long shadows across ${loc.subtitle.toLowerCase()}. ${loc.description}\n\nA sudden opportunity presents itself in the nocturnal mist. How do you choose to act?`,
        choices: [
          {
            text: 'Investigate the shadowed perimeter for valuables and occult lore.',
            consequences: {
              money: 35 + loc.dangerLevel * 10,
              energy: -10,
              log: `Searched the grounds: unsealed hidden purse containing +$${35 + loc.dangerLevel * 10}.`
            }
          },
          {
            text: 'Mingle discretely to gather rumors and reinforce your cover (+Secrecy).',
            consequences: {
              secrecy: 12,
              energy: -10,
              log: 'You mingled with the shadows, covering your tracks (+12% Secrecy).'
            }
          },
          {
            text: 'Feed from an unsuspecting mortal or solitary predator.',
            consequences: {
              hunger: -35,
              secrecy: -6,
              log: 'Satisfied your nocturnal thirst from a prey in the darkness (-35% Thirst, -6% Secrecy).'
            }
          }
        ]
      };
      setActiveEvent(generatedEvent);
    }
  };

  // Event Choice Resolution
  const handleEventChoice = (choice: EventChoice) => {
    setActiveEvent(null);
    const { consequences } = choice;

    // Trigger endings if specified
    if (consequences.triggerEnding) {
      if (consequences.triggerEnding === 'vampire_ruler') {
        setActiveEnding({
          id: 'vampire_ruler',
          title: 'The New Vampire Monarch',
          badge: 'SOVEREIGN ASCENDANT',
          description:
            'You seized the Blood Sceptre under the weeping Blood Moon! Crowned beside Queen Morvath atop the Blackwood Spire, the covens of the world now bend the knee to you. You survived 100 nights and forged an empire of eternal shadows.'
        });
        return;
      } else if (consequences.triggerEnding === 'human_love') {
        setActiveEnding({
          id: 'human_love',
          title: 'Mortal Redemption & Escape',
          badge: 'HUMANITY PRESERVED',
          description:
            'Forsaking the cursed crown and ancient thrones, you took Sarah’s hand and slipped through the inquisitor cordons at dawn. Far from Oakhaven, you live in peaceful seclusion, keeping your thirst bounded and your humanity intact.'
        });
        return;
      } else if (consequences.triggerEnding === 'redemption') {
        setActiveEnding({
          id: 'redemption',
          title: 'The Cleansing Dawn',
          badge: 'CURSE SHATTERED',
          description:
            'Channelling Madam Morgana’s ancient lunar runes and partnering with Detective Cross, a wave of purifying golden dawn light washed over the metropolis. The Blood Moon curse was dispelled forever, freeing your soul.'
        });
        return;
      }
    }

    // Trigger combat if choice initiates battle
    if (consequences.combat) {
      const bossEnemy: Enemy = {
        id: 'boss_encounter',
        name:
          consequences.combat === 'eclipse_sovereign'
            ? 'The Eclipse Sovereign'
            : consequences.combat === 'inquisitor'
            ? 'Inquisitor Grandmaster'
            : 'Julian Blackwood',
        health: consequences.combat === 'eclipse_sovereign' ? 240 : 120,
        maxHealth: consequences.combat === 'eclipse_sovereign' ? 240 : 120,
        attackPower: consequences.combat === 'eclipse_sovereign' ? 30 : 22,
        defense: 6,
        rewardMoney: 300,
        rewardBlood: 80,
        description: 'The fateful battle has begun! Steel and blood clash in the storm.',
        specialAbility: 'Blood Tempest'
      };
      setActiveCombatEnemy(bossEnemy);
      return;
    }

    // Apply stat changes
    setStats((prev) => ({
      ...prev,
      health: Math.min(prev.maxHealth, Math.max(0, prev.health + (consequences.heal || 0) - (consequences.takeDamage || 0))),
      hunger: Math.max(0, Math.min(100, prev.hunger + (consequences.hunger || 0))),
      secrecy: Math.max(0, Math.min(100, prev.secrecy + (consequences.secrecy || 0))),
      energy: Math.max(0, Math.min(prev.maxEnergy, prev.energy + (consequences.energy || 0))),
      money: Math.max(0, prev.money + (consequences.money || 0))
    }));

    // Trust changes
    if (consequences.trustChange) {
      const { charId, delta } = consequences.trustChange;
      setCharacters((prev) => {
        const char = prev[charId];
        if (!char) return prev;
        const newTrust = Math.max(0, Math.min(100, char.trust + delta));
        let newStatus = char.status;
        if (newTrust >= 80) newStatus = 'Devoted';
        else if (newTrust >= 65) newStatus = 'Allied';
        else if (newTrust >= 50) newStatus = 'Friendly';
        else if (newTrust >= 30) newStatus = 'Neutral';
        else if (newTrust >= 15) newStatus = 'Distrustful';
        else newStatus = 'Hostile';

        return {
          ...prev,
          [charId]: { ...char, trust: newTrust, status: newStatus }
        };
      });
    }

    // Advance Night!
    advanceNight(consequences.log);
  };

  // Combat Finish
  const handleCombatFinish = (result: {
    won: boolean;
    escaped: boolean;
    newStats: PlayerStats;
    log: string;
  }) => {
    setActiveCombatEnemy(null);
    setStats(result.newStats);

    if (activeCombatEnemy?.id === 'boss_encounter' && result.won) {
      setActiveEnding({
        id: 'dark_lord',
        title: 'The Dark Lord of the Eclipse',
        badge: 'ANCIENT TRIUMPH',
        description:
          'You tore the Eclipse Sovereign asunder beneath the weeping celestial moon and drank the primordial bloodline! You are now the undisputed master of eternal night, immortal and all-powerful across the centuries.'
      });
      return;
    }

    if (result.won) {
      advanceNight(`Combat Victory: ${result.log}`);
    } else if (result.escaped) {
      advanceNight(`Escaped from battle into the moonlit fog.`);
    }
  };

  // Consume satchel item
  const handleUseItem = (itemId: string) => {
    const item = items[itemId];
    if (!item || item.quantity <= 0) return;

    if (itemId === 'preserved_blood') {
      sounds.playBite();
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 40),
        health: Math.min(prev.maxHealth, prev.health + 15)
      }));
    } else if (itemId === 'rat_blood') {
      sounds.playBite();
      setStats((prev) => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 15)
      }));
    } else if (itemId === 'energy_tonic') {
      sounds.playMagic();
      setStats((prev) => ({
        ...prev,
        energy: Math.min(prev.maxEnergy, prev.energy + 40)
      }));
    } else if (itemId === 'smoke_bomb') {
      sounds.playMagic();
      setStats((prev) => ({
        ...prev,
        secrecy: Math.min(100, prev.secrecy + 15)
      }));
    }

    setItems((prev) => ({
      ...prev,
      [itemId]: { ...item, quantity: item.quantity - 1 }
    }));
    setActivityLogs((prev) => [`Used ${item.name}.`, ...prev.slice(0, 8)]);
  };

  // Buy satchel item
  const handleBuyItem = (itemId: string) => {
    const item = items[itemId];
    if (!item || stats.money < item.cost) return;

    sounds.playOrganChord();
    setStats((prev) => ({ ...prev, money: prev.money - item.cost }));
    setItems((prev) => ({
      ...prev,
      [itemId]: { ...item, quantity: item.quantity + 1 }
    }));
  };

  // Upgrade ability
  const handleUpgradeAbility = (abId: string) => {
    const ab = abilities[abId];
    if (!ab || stats.money < ab.upgradeCost || ab.level >= ab.maxLevel) return;

    sounds.playMagic();
    setStats((prev) => ({ ...prev, money: prev.money - ab.upgradeCost }));
    setAbilities((prev) => ({
      ...prev,
      [abId]: {
        ...ab,
        level: ab.level + 1,
        upgradeCost: Math.floor(ab.upgradeCost * 1.5)
      }
    }));
    setActivityLogs((prev) => [`Upgraded ${ab.name} to Level ${ab.level + 1}!`, ...prev.slice(0, 8)]);
  };

  // Restart Game
  const handleRestart = () => {
    localStorage.removeItem('vampire_100_stats');
    setStats({
      health: 100,
      maxHealth: 100,
      hunger: 25,
      secrecy: 85,
      energy: 70,
      maxEnergy: 100,
      money: 120,
      night: 1
    });
    setUnlockedLocations(['mansion', 'downtown', 'graveyard', 'academy', 'nightclub']);
    setCharacters(INITIAL_CHARACTERS);
    setAbilities(INITIAL_ABILITIES);
    setItems(INITIAL_ITEMS);
    setActiveEvent(null);
    setActiveCombatEnemy(null);
    setActiveEnding(null);
    setDawnReport(null);
    setActivityLogs(['Reborn into the nocturnal shadows of Oakhaven.']);
    sounds.playOrganChord();
  };

  return (
    <div className="min-h-screen bg-[#09080e] text-[#e6ded3] font-serif selection:bg-red-950 selection:text-red-200 relative overflow-x-hidden">
      {/* Dynamic Animated Gothic Canvas */}
      <GothicCanvas night={stats.night} />

      {/* Main Top Navigation & Vitals Bar */}
      <TopNavBar
        stats={stats}
        muted={muted}
        onToggleMute={() => {
          sounds.muted = !muted;
          setMuted(!muted);
        }}
        onOpenInventory={() => setShowInventory(true)}
        onOpenAbilities={() => setShowAbilities(true)}
        onOpenRelationships={() => setShowRelationships(true)}
        onOpenPythonHub={() => setShowPythonHub(true)}
      />

      {/* Main Game Stage */}
      <main className="relative z-10 pb-16">
        {/* Night Banner & Chronicle Feed */}
        <div className="max-w-7xl mx-auto px-4 pt-4">
          {dawnReport && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-red-950/70 via-[#241724]/80 to-[#120f18]/70 border border-red-800/60 shadow-lg flex items-center justify-between backdrop-blur-sm animate-fadeIn">
              <div className="flex items-center gap-2.5 text-xs text-red-200 font-cinzel">
                <Moon className="w-4 h-4 text-red-400" />
                <span>{dawnReport}</span>
              </div>
              <button
                onClick={() => setDawnReport(null)}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Quick status feed */}
          <div className="p-3 rounded-xl bg-[#120f1a]/80 border border-[#382333] shadow-md flex items-center justify-between gap-4 text-xs font-serif text-[#bcaab3] backdrop-blur-sm">
            <div className="flex items-center gap-2 truncate">
              <span className="text-red-400 font-bold font-cinzel">Chronicle:</span>
              <span className="truncate">{activityLogs[0]}</span>
            </div>

            {/* Fast-forward helper for testing night milestones */}
            <div className="flex items-center gap-2 flex-shrink-0 text-[11px]">
              <span className="text-[#8a7a85]">Jump to Milestone:</span>
              {[25, 50, 75, 99].map((targetNight) => (
                <button
                  key={targetNight}
                  onClick={() => {
                    sounds.playMagic();
                    setStats((prev) => ({ ...prev, night: targetNight }));
                  }}
                  className="px-2 py-0.5 rounded bg-[#1e1929] hover:bg-[#342442] border border-[#48334a] text-purple-200 font-mono cursor-pointer transition-colors"
                >
                  N{targetNight}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 9 Interactive Gothic Locations */}
        <LocationGrid
          locations={INITIAL_LOCATIONS}
          unlockedLocations={unlockedLocations}
          characters={characters}
          onSelectLocation={handleSelectLocation}
          onQuickFeed={handleQuickFeed}
          hunger={stats.hunger}
        />
      </main>

      {/* Active Modals */}
      {activeEvent && (
        <EventModal
          event={activeEvent}
          characters={characters}
          abilities={abilities}
          items={items}
          money={stats.money}
          energy={stats.energy}
          onChoose={handleEventChoice}
        />
      )}

      {activeCombatEnemy && (
        <CombatModal
          enemy={activeCombatEnemy}
          stats={stats}
          abilities={abilities}
          items={items}
          onFinishCombat={handleCombatFinish}
        />
      )}

      {showInventory && (
        <InventoryModal
          items={items}
          money={stats.money}
          onClose={() => setShowInventory(false)}
          onUseItem={handleUseItem}
          onBuyItem={handleBuyItem}
        />
      )}

      {showAbilities && (
        <AbilitiesModal
          abilities={abilities}
          money={stats.money}
          onClose={() => setShowAbilities(false)}
          onUpgradeAbility={handleUpgradeAbility}
        />
      )}

      {showRelationships && (
        <RelationshipsModal
          characters={characters}
          onClose={() => setShowRelationships(false)}
        />
      )}

      {showPythonHub && (
        <PythonHubModal onClose={() => setShowPythonHub(false)} />
      )}

      {activeEnding && (
        <EndingModal
          ending={activeEnding}
          night={stats.night}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
export default App;

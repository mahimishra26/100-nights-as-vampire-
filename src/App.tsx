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
  EndingResult,
  VampireProfile,
  StoryJournal,
  AppScreen
} from './types';
import {
  INITIAL_LOCATIONS,
  INITIAL_CHARACTERS,
  INITIAL_ABILITIES,
  INITIAL_ITEMS,
  MILESTONE_EVENTS
} from './data/gameData';
import { LOCATION_EVENTS_POOL } from './data/locationEvents';
import { GothicCanvas } from './components/GothicCanvas';
import { TopNavBar, GameViewMode } from './components/TopNavBar';
import { EventModal } from './components/EventModal';
import { CombatModal } from './components/CombatModal';
import { PythonHubModal } from './components/PythonHubModal';
import { EndingModal } from './components/EndingModal';
import { PygameWindowView } from './components/PygameWindowView';
import { PythonTerminalModal } from './components/PythonTerminalModal';
import { HowToPlayModal } from './components/HowToPlayModal';

// Dedicated 7+ Screens
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { CharacterCreationScreen } from './components/screens/CharacterCreationScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { CityMapScreen } from './components/screens/CityMapScreen';
import { HuntCombatScreen } from './components/screens/HuntCombatScreen';
import { AbilitiesInventoryScreen } from './components/screens/AbilitiesInventoryScreen';
import { RelationshipsStoryScreen } from './components/screens/RelationshipsStoryScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { BloodMoonCinematicScreen } from './components/screens/BloodMoonCinematicScreen';

import { sounds } from './audio/soundManager';

const DEFAULT_PROFILE: VampireProfile = {
  name: 'Lucien Ravenscroft',
  genderStyle: 'Masculine',
  hairStyle: 'Victorian Waves',
  hairColor: 'Raven Black',
  eyeColor: 'Crimson Blood',
  outfit: 'Victorian Noble',
  personality: 'Charming'
};

const DEFAULT_JOURNAL: StoryJournal = {
  currentObjective:
    'Survive the 100 nights in Oakhaven, satiate your thirst without exposing your haven to detective Cross, and uncover your Sire.',
  completedQuests: ['Awakened in Oakhaven Sanctum'],
  discoveries: [
    'The Blood Moon eclipse converges once a century.',
    'Lord Valerius withholds your true sire’s identity.',
    'Detective Alexander Cross commands the Silver Dawn.'
  ],
  majorDecisions: ['Preserved the initial masquerade'],
  unlockedLore: ['Ancient Vampire Codex: Volume I']
};

export function App() {
  // Screen & View State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('menu');
  const [viewMode, setViewMode] = useState<GameViewMode>('web');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showTerminalModal, setShowTerminalModal] = useState(false);
  const [showPythonHub, setShowPythonHub] = useState(false);

  // Player Profile & Stats
  const [profile, setProfile] = useState<VampireProfile>(() => {
    const saved = localStorage.getItem('vampire_100_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

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

  const [journal, setJournal] = useState<StoryJournal>(() => {
    const saved = localStorage.getItem('vampire_100_journal');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_JOURNAL;
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

  // Active Modals / Combat
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeCombatEnemy, setActiveCombatEnemy] = useState<Enemy | null>(null);
  const [activeEnding, setActiveEnding] = useState<EndingResult | null>(null);

  // Logs & Notifications
  const [muted, setMuted] = useState(false);
  const [activityLogs, setActivityLogs] = useState<string[]>([
    'Awakened as an immortal fledgling in Oakhaven.',
    '100 nights of survival await in the gaslit shadows.'
  ]);
  const [dawnReport, setDawnReport] = useState<string | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vampire_100_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('vampire_100_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vampire_100_journal', JSON.stringify(journal));
  }, [journal]);

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
          'Your undead heart ceased beating. The cold silver, blessed blade, or grievous wounds were too grave to endure. Your physical form dissolves into gray ash upon the Victorian cobblestones.'
      });
      setCurrentScreen('ending');
    } else if (stats.secrecy <= 0) {
      sounds.playBellToll();
      setActiveEnding({
        id: 'defeated',
        title: 'Exposed & Executed',
        badge: 'INQUISITION SUNRISE',
        description:
          'The mortal authorities and Detective Cross discovered your haven before twilight. Bound in chains of sanctified steel atop the cathedral bell tower, the rising sun was your executioner.'
      });
      setCurrentScreen('ending');
    } else if (stats.hunger >= 100) {
      sounds.playBellToll();
      setActiveEnding({
        id: 'defeated',
        title: 'The Beast Takes Over',
        badge: 'FERAL DEVOLUTION',
        description:
          'The crimson starvation shattered the remnants of your mortal mind. In a mindless frenzy, you slaughtered indiscriminately until ancient elders and werewolf packs united to put you down like a rabid beast.'
      });
      setCurrentScreen('ending');
    } else if (stats.night >= 100 && currentScreen !== 'ending' && currentScreen !== 'blood_moon') {
      // Reached Night 100!
      setCurrentScreen('blood_moon');
    }
  }, [stats.health, stats.secrecy, stats.hunger, stats.night, activeEnding]);

  // Advance Night Logic
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

    setDawnReport(`Night ${stats.night} concluded as dawn approached. Night ${nextNight} begins.`);
    setActivityLogs((prev) => [...consequences, ...prev.slice(0, 8)]);

    // Check for major Blood Moon milestones (25, 50, 75, 100)
    if ([25, 50, 75, 100].includes(nextNight)) {
      sounds.playOrganChord();
      setCurrentScreen('blood_moon');
    }
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
      } else if (stats.money >= 30) {
        sounds.playBite();
        setStats((prev) => ({
          ...prev,
          money: prev.money - 30,
          hunger: Math.max(0, prev.hunger - 40),
          health: Math.min(prev.maxHealth, prev.health + 10)
        }));
        setActivityLogs((prev) => ['Purchased an emergency blood vial from black market (-$30, -40 Thirst).', ...prev.slice(0, 8)]);
      } else {
        alert('You have no blood packs and lack the $30 gold to purchase one!');
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
        `Mesmerized an alley pedestrian (-50 Thirst, +30⚡, -${secrecyLoss}% Secrecy).`,
        ...prev.slice(0, 8)
      ]);
    }
  };

  // Location Selection & Event Handling
  const handleSelectLocation = (locId: string) => {
    sounds.playOrganChord();
    const loc = INITIAL_LOCATIONS[locId];

    // Check ambush
    const isAmbush = (stats.secrecy <= 35 && Math.random() < 0.45) || (Math.random() < 0.25 && loc.dangerLevel >= 3);
    if (isAmbush) {
      const enemy: Enemy = {
        id: `${locId}_encounter`,
        name: loc.dangerLevel >= 4 ? 'Silver Dawn Inquisitor' : 'Alleyway Shadow Stalker',
        health: 50 + loc.dangerLevel * 12,
        maxHealth: 50 + loc.dangerLevel * 12,
        attackPower: 10 + loc.dangerLevel * 3,
        defense: 4 + loc.dangerLevel * 2,
        rewardMoney: 30 + loc.dangerLevel * 15,
        rewardBlood: 30,
        description: `Ambushed you while prowling through ${loc.name}!`,
        specialAbility: 'Vicious Lunge'
      };
      setActiveCombatEnemy(enemy);
      return;
    }

    // Trigger narrative location event
    const pool = LOCATION_EVENTS_POOL[locId] || LOCATION_EVENTS_POOL['downtown'];
    const selectedEvent = pool[Math.floor(Math.random() * pool.length)];
    setActiveEvent(selectedEvent);
  };

  // Event Choices Handling
  const handleEventChoice = (choice: EventChoice) => {
    const c = choice.consequences;
    sounds.playClick();

    let newHealth = stats.health;
    if (c.heal) newHealth = Math.min(stats.maxHealth, newHealth + c.heal);
    if (c.takeDamage) {
      newHealth = Math.max(0, newHealth - c.takeDamage);
      sounds.playClaw();
    }

    let newHunger = stats.hunger;
    if (c.hunger) newHunger = Math.max(0, Math.min(100, newHunger + c.hunger));

    let newSecrecy = stats.secrecy;
    if (c.secrecy) newSecrecy = Math.max(0, Math.min(100, newSecrecy + c.secrecy));

    let newEnergy = stats.energy;
    if (c.energy) newEnergy = Math.max(0, Math.min(stats.maxEnergy, newEnergy + c.energy));
    if (choice.energyCost) newEnergy = Math.max(0, newEnergy - choice.energyCost);

    let newMoney = stats.money;
    if (c.money) newMoney = Math.max(0, newMoney + c.money);

    // Apply Trust Change
    if (c.trustChange) {
      const { charId, delta } = c.trustChange;
      setCharacters((prev) => {
        const char = prev[charId];
        if (!char) return prev;
        const nextTrust = Math.max(0, Math.min(100, char.trust + delta));
        let nextStatus = char.status;
        if (nextTrust >= 80) nextStatus = 'Devoted';
        else if (nextTrust >= 60) nextStatus = 'Allied';
        else if (nextTrust >= 40) nextStatus = 'Friendly';
        else if (nextTrust >= 20) nextStatus = 'Neutral';
        else nextStatus = 'Hostile';
        return { ...prev, [charId]: { ...char, trust: nextTrust, status: nextStatus } };
      });
    }

    // Add Quest Discoveries to Journal
    if (c.log) {
      setJournal((prev) => ({
        ...prev,
        discoveries: [c.log, ...prev.discoveries.slice(0, 8)]
      }));
    }

    setStats({
      ...stats,
      health: newHealth,
      hunger: newHunger,
      secrecy: newSecrecy,
      energy: newEnergy,
      money: newMoney
    });

    setActivityLogs((prev) => [c.log, ...prev.slice(0, 8)]);
    setActiveEvent(null);

    // Combat trigger check
    if (c.combat) {
      const enemy: Enemy = {
        id: 'consequence_combat',
        name: c.combat,
        health: 75,
        maxHealth: 75,
        attackPower: 16,
        defense: 6,
        rewardMoney: 60,
        rewardBlood: 35,
        description: `Encountered as a result of your actions.`,
        specialAbility: 'Blood Frenzy'
      };
      setActiveCombatEnemy(enemy);
    }

    // Ending trigger check
    if (c.triggerEnding) {
      const endings: Record<string, EndingResult> = {
        ruler: {
          id: 'monarch',
          title: 'Vampire Monarch',
          badge: 'SOVEREIGN OF MIDNIGHT',
          description: 'You dethroned the elders and seized control of the Crimson Court. All Oakhaven bows to your immortal supremacy.'
        },
        redemption: {
          id: 'redemption',
          title: 'Mortal Redemption',
          badge: 'HUMANITY RESTORED',
          description: 'Through ancient alchemy and mortal devotion, you shattered the vampire curse. The 101st dawn warms your skin as a human once more.'
        },
        eternal: {
          id: 'eternal',
          title: 'The Wandering Phantom',
          badge: 'ETERNAL PHANTOM',
          description: 'You survived 100 nights in stealth, dissolving into the midnight mists as an untouchable legend across centuries.'
        }
      };
      setActiveEnding(endings[c.triggerEnding] || endings.eternal);
      setCurrentScreen('ending');
    }
  };

  // Upgrading Abilities
  const handleUpgradeAbility = (abilityId: string) => {
    const ability = abilities[abilityId];
    if (!ability) return;
    if (stats.money < ability.upgradeCost || ability.level >= ability.maxLevel) return;

    sounds.playMagic();
    setStats((prev) => ({ ...prev, money: prev.money - ability.upgradeCost }));
    setAbilities((prev) => ({
      ...prev,
      [abilityId]: {
        ...ability,
        level: ability.level + 1,
        upgradeCost: Math.floor(ability.upgradeCost * 1.5)
      }
    }));
    setActivityLogs((prev) => [
      `Upgraded discipline: ${ability.name} to Rank ${ability.level + 1}!`,
      ...prev.slice(0, 8)
    ]);
  };

  // Using Items
  const handleUseItem = (itemId: string) => {
    const item = items[itemId];
    if (!item || item.quantity <= 0) return;

    sounds.playBite();
    let newHealth = stats.health;
    let newHunger = stats.hunger;
    let newEnergy = stats.energy;
    let newSecrecy = stats.secrecy;
    let logMsg = `Used ${item.name}.`;

    if (itemId === 'rat_blood') {
      newHunger = Math.max(0, newHunger - 15);
      logMsg = 'Consumed vial of animal blood (-15 Thirst).';
    } else if (itemId === 'preserved_blood') {
      newHunger = Math.max(0, newHunger - 45);
      newHealth = Math.min(stats.maxHealth, newHealth + 20);
      newEnergy = Math.min(stats.maxEnergy, newEnergy + 25);
      logMsg = 'Consumed hospital blood pouch (-45 Thirst, +20 HP, +25⚡).';
    } else if (itemId === 'ancient_elixir') {
      newHealth = stats.maxHealth;
      newEnergy = stats.maxEnergy;
      newHunger = 0;
      logMsg = 'Drank the Ancient Crimson Elixir! Completely restored HP, Energy, and quenched all thirst!';
    } else if (itemId === 'holy_water') {
      newHealth = Math.max(1, newHealth - 15);
      newSecrecy = Math.min(100, newSecrecy + 25);
      logMsg = 'Used Consecrated Holy Water to cleanse haven runes (-15 HP, +25% Secrecy).';
    } else if (itemId === 'forged_pass') {
      newSecrecy = Math.min(100, newSecrecy + 30);
      logMsg = 'Presented forged diplomatic papers (+30% Secrecy).';
    }

    setItems((prev) => ({
      ...prev,
      [itemId]: { ...item, quantity: item.quantity - 1 }
    }));

    setStats((prev) => ({
      ...prev,
      health: newHealth,
      hunger: newHunger,
      energy: newEnergy,
      secrecy: newSecrecy
    }));

    setActivityLogs((prev) => [logMsg, ...prev.slice(0, 8)]);
  };

  // Buying Items
  const handleBuyItem = (itemId: string) => {
    const item = items[itemId];
    if (!item || stats.money < item.cost) return;

    sounds.playCoin();
    setStats((prev) => ({ ...prev, money: prev.money - item.cost }));
    setItems((prev) => ({
      ...prev,
      [itemId]: { ...item, quantity: item.quantity + 1 }
    }));
    setActivityLogs((prev) => [
      `Purchased ${item.name} for $${item.cost}.`,
      ...prev.slice(0, 8)
    ]);
  };

  // Restart / Reset Game
  const handleRestart = () => {
    sounds.playBite();
    localStorage.removeItem('vampire_100_stats');
    localStorage.removeItem('vampire_100_profile');
    localStorage.removeItem('vampire_100_journal');
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
    setProfile(DEFAULT_PROFILE);
    setJournal(DEFAULT_JOURNAL);
    setUnlockedLocations(['mansion', 'downtown', 'graveyard', 'academy', 'nightclub']);
    setCharacters(INITIAL_CHARACTERS);
    setAbilities(INITIAL_ABILITIES);
    setItems(INITIAL_ITEMS);
    setActiveEnding(null);
    setCurrentScreen('character_creation');
  };

  // Character Creation Completion
  const handleCharacterCreated = (newProfile: VampireProfile) => {
    setProfile(newProfile);

    // Apply starting personality perks
    let startingHp = 100;
    let startingEnergy = 70;
    let startingMoney = 120;
    let startingSecrecy = 85;

    if (newProfile.personality === 'Charming') {
      startingSecrecy += 10;
      setCharacters((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = { ...next[k], trust: next[k].trust + 10 };
        });
        return next;
      });
    } else if (newProfile.personality === 'Mysterious') {
      startingEnergy += 15;
      setAbilities((prev) => ({
        ...prev,
        night_vision: { ...prev.night_vision, level: 1 }
      }));
    } else if (newProfile.personality === 'Ruthless') {
      startingMoney += 40;
    } else if (newProfile.personality === 'Compassionate') {
      startingHp += 20;
      setCharacters((prev) => ({
        ...prev,
        human_friend: { ...prev.human_friend, trust: 85, status: 'Devoted' }
      }));
    }

    setStats((prev) => ({
      ...prev,
      health: startingHp,
      maxHealth: startingHp,
      energy: startingEnergy,
      maxEnergy: startingEnergy,
      money: startingMoney,
      secrecy: Math.min(100, startingSecrecy)
    }));

    setActivityLogs([
      `Awakened in Oakhaven as ${newProfile.name}, a ${newProfile.personality} ${newProfile.outfit}.`,
      'Night 1 begins. Manage your hunger, conceal your identity, and survive 100 nights.'
    ]);

    setCurrentScreen('dashboard');
  };

  // Blood Moon Milestone Decision
  const handleBloodMoonChoice = (outcome: string, effects?: Record<string, number>) => {
    if (effects) {
      setStats((prev) => {
        const next = { ...prev };
        if (effects.health) next.health = Math.max(0, Math.min(next.maxHealth, next.health + effects.health));
        if (effects.maxHealth) next.maxHealth += effects.maxHealth;
        if (effects.hunger) next.hunger = Math.max(0, Math.min(100, next.hunger + effects.hunger));
        if (effects.secrecy) next.secrecy = Math.max(0, Math.min(100, next.secrecy + effects.secrecy));
        if (effects.energy) next.energy = Math.max(0, Math.min(next.maxEnergy, next.energy + effects.energy));
        if (effects.money) next.money = Math.max(0, next.money + effects.money);
        return next;
      });
    }

    setJournal((prev) => ({
      ...prev,
      majorDecisions: [`Blood Moon Milestone (Night ${stats.night}): ${outcome}`, ...prev.majorDecisions]
    }));

    setActivityLogs((prev) => [outcome, ...prev.slice(0, 8)]);

    if (stats.night >= 100) {
      // Determine final ending
      const endingKey =
        profile.personality === 'Compassionate'
          ? 'redemption'
          : profile.personality === 'Ruthless'
          ? 'ruler'
          : 'eternal';
      const endings: Record<string, EndingResult> = {
        ruler: {
          id: 'monarch',
          title: 'Vampire Monarch',
          badge: 'SOVEREIGN OF MIDNIGHT',
          description: 'You dethroned the decadent elders and claimed the Obsidian Throne of Oakhaven.'
        },
        redemption: {
          id: 'redemption',
          title: 'Mortal Redemption',
          badge: 'SUNRISE OF HUMANITY',
          description: 'You shattered the blood seal and broke the curse. The 101st sunrise warms your mortal skin.'
        },
        eternal: {
          id: 'eternal',
          title: 'The Wandering Phantom',
          badge: 'ETERNAL PHANTOM',
          description: 'You survived the full 100 nights in absolute secrecy, fading into legend as an immortal wanderer.'
        }
      };
      setActiveEnding(endings[endingKey]);
      setCurrentScreen('ending');
    } else {
      setCurrentScreen('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0a12] text-[#f4edea] font-serif selection:bg-red-900 selection:text-white relative overflow-x-hidden">
      {/* Gothic Canvas Atmosphere (Particles, Bats, Crimson Fog) */}
      <GothicCanvas night={stats.night} />

      {/* Persistent Top Navigation Bar */}
      <TopNavBar
        stats={stats}
        profile={profile}
        currentScreen={currentScreen}
        onNavigateScreen={(scr) => {
          sounds.playClick();
          setCurrentScreen(scr);
        }}
        muted={muted}
        activeMode={viewMode}
        onSelectMode={(mode) => {
          if (mode === 'terminal') {
            setShowTerminalModal(true);
          } else {
            setViewMode(mode);
          }
        }}
        onOpenHowToPlay={() => setShowHowToPlay(true)}
        onToggleMute={() => {
          const nextMute = !muted;
          setMuted(nextMute);
          sounds.setSoundEnabled(!nextMute);
        }}
        onOpenInventory={() => setCurrentScreen('abilities')}
        onOpenAbilities={() => setCurrentScreen('abilities')}
        onOpenRelationships={() => setCurrentScreen('relationships')}
        onOpenPythonHub={() => setShowPythonHub(true)}
      />

      {/* Main Screen Renderer */}
      <main className="relative z-10 min-h-[calc(100vh-60px)] pb-12">
        {/* Alternate Pygame Canvas View Mode */}
        {viewMode === 'pygame' && (
          <div className="max-w-7xl mx-auto px-4 py-4">
            <PygameWindowView
              stats={stats}
              locations={INITIAL_LOCATIONS}
              unlockedLocations={unlockedLocations}
              characters={characters}
              abilities={abilities}
              items={items}
              onSelectLocation={handleSelectLocation}
              onQuickFeed={handleQuickFeed}
              onOpenInventory={() => setCurrentScreen('abilities')}
              onOpenAbilities={() => setCurrentScreen('abilities')}
              onOpenRelationships={() => setCurrentScreen('relationships')}
              onOpenPythonHub={() => setShowPythonHub(true)}
              onOpenTerminal={() => setShowTerminalModal(true)}
            />
          </div>
        )}

        {/* 7+ Functional Web Screens */}
        {viewMode === 'web' && (
          <>
            {currentScreen === 'menu' && (
              <MainMenuScreen
                hasSavedGame={!!localStorage.getItem('vampire_100_stats')}
                onNewGame={() => setCurrentScreen('character_creation')}
                onContinueGame={() => setCurrentScreen('dashboard')}
                onOpenHowToPlay={() => setShowHowToPlay(true)}
                onOpenSettings={() => setCurrentScreen('settings')}
                onOpenTerminal={() => setShowTerminalModal(true)}
                onOpenPygameWindow={() => setViewMode('pygame')}
                onOpenPythonHub={() => setShowPythonHub(true)}
              />
            )}

            {currentScreen === 'character_creation' && (
              <CharacterCreationScreen
                initialProfile={profile}
                onComplete={handleCharacterCreated}
                onBack={() => setCurrentScreen('menu')}
              />
            )}

            {currentScreen === 'dashboard' && (
              <DashboardScreen
                stats={stats}
                profile={profile}
                journal={journal}
                latestLog={activityLogs[0]}
                dawnReport={dawnReport}
                onNavigate={(scr) => setCurrentScreen(scr as AppScreen)}
                onQuickFeed={handleQuickFeed}
                onEndNight={() => advanceNight(`Rested through the daytime slumber. Awakened for Night ${stats.night + 1}.`)}
                onJumpNight={(n) => {
                  setStats((prev) => ({ ...prev, night: n }));
                  setDawnReport(`Fast-forwarded to Night ${n}.`);
                  if ([25, 50, 75, 100].includes(n)) {
                    setCurrentScreen('blood_moon');
                  }
                }}
              />
            )}

            {currentScreen === 'map' && (
              <CityMapScreen
                locations={INITIAL_LOCATIONS}
                unlockedLocations={unlockedLocations}
                characters={characters}
                night={stats.night}
                onSelectLocation={handleSelectLocation}
                onBack={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'hunting' && (
              <HuntCombatScreen
                stats={stats}
                profile={profile}
                abilities={abilities}
                onCombatEnd={(victory, summary, rewards) => {
                  if (rewards) {
                    setStats((prev) => ({
                      ...prev,
                      money: prev.money + rewards.money,
                      hunger: Math.max(0, prev.hunger + rewards.hunger)
                    }));
                  }
                  setActivityLogs((prev) => [summary, ...prev.slice(0, 8)]);
                  setCurrentScreen('dashboard');
                }}
                onBack={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'abilities' && (
              <AbilitiesInventoryScreen
                abilities={abilities}
                items={items}
                money={stats.money}
                onUpgradeAbility={handleUpgradeAbility}
                onUseItem={handleUseItem}
                onBuyItem={handleBuyItem}
                onBack={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'relationships' && (
              <RelationshipsStoryScreen
                characters={characters}
                journal={journal}
                night={stats.night}
                onBack={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'blood_moon' && (
              <BloodMoonCinematicScreen
                night={stats.night}
                onChoiceMade={handleBloodMoonChoice}
                onContinue={() => setCurrentScreen('dashboard')}
              />
            )}

            {currentScreen === 'settings' && (
              <SettingsScreen
                onBack={() => setCurrentScreen('dashboard')}
                onResetGame={handleRestart}
                onReturnToMainMenu={() => setCurrentScreen('menu')}
                onOpenTerminal={() => setShowTerminalModal(true)}
                onOpenPygameWindow={() => setViewMode('pygame')}
                onOpenPythonHub={() => setShowPythonHub(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Modals: Location Events */}
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

      {/* Modals: Combat Ambush Encounter */}
      {activeCombatEnemy && (
        <CombatModal
          enemy={activeCombatEnemy}
          stats={stats}
          abilities={abilities}
          items={items}
          onFinishCombat={(result) => {
            setActiveCombatEnemy(null);
            setStats(result.newStats);
            setActivityLogs((prev) => [result.log, ...prev.slice(0, 8)]);
            if (!result.won && !result.escaped) {
              sounds.playGameOver();
              setActiveEnding({
                id: 'defeated',
                title: 'Slain in Ambush',
                badge: 'FALLEN IN COMBAT',
                description: `You were overwhelmed by ${activeCombatEnemy.name} and your mortal body turned to ash.`
              });
              setCurrentScreen('ending');
            }
          }}
        />
      )}

      {/* Modals: How To Play Manual */}
      {showHowToPlay && (
        <HowToPlayModal
          onClose={() => setShowHowToPlay(false)}
          onSelectMode={(mode) => {
            if (mode === 'terminal') {
              setShowTerminalModal(true);
            } else {
              setViewMode(mode);
            }
          }}
          onOpenPythonHub={() => {
            setShowHowToPlay(false);
            setShowPythonHub(true);
          }}
        />
      )}

      {/* Modals: Python Source Code Hub */}
      {showPythonHub && (
        <PythonHubModal onClose={() => setShowPythonHub(false)} />
      )}

      {/* Modals: In-Browser Python CLI Console */}
      {showTerminalModal && (
        <PythonTerminalModal
          stats={stats}
          characters={characters}
          abilities={abilities}
          items={items}
          onClose={() => setShowTerminalModal(false)}
          onFeed={handleQuickFeed}
          onSelectLocation={handleSelectLocation}
          onUseItem={handleUseItem}
          onUpgradeAbility={handleUpgradeAbility}
          onAdvanceNight={advanceNight}
        />
      )}

      {/* Modals: Ending / Game Over */}
      {(activeEnding || currentScreen === 'ending') && (
        <EndingModal
          ending={
            activeEnding || {
              id: 'defeated',
              title: 'Slain in the Shadows',
              badge: 'EXTINGUISHED SOUL',
              description: 'Your vampire journey has reached its conclusion.'
            }
          }
          night={stats.night}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
export default App;

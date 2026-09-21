/**
 * 100 Nights as a Vampire - Shared TypeScript Types
 */

export interface PlayerStats {
  health: number;
  maxHealth: number;
  hunger: number;     // 0 = gorged, 100 = starving frenzy
  secrecy: number;    // 100 = undetected, 0 = exposed/executed
  energy: number;     // 0 - 100
  maxEnergy: number;
  money: number;
  night: number;      // 1 - 100
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'consumable' | 'equipment' | 'artifact';
  quantity: number;
  cost: number;
  usableInCombat: boolean;
  usableInField: boolean;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  level: number;       // 0 = locked, 1-3
  maxLevel: number;
  baseCost: number;
  upgradeCost: number;
}

export interface NPCCharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  trust: number;       // 0 - 100
  status: 'Hostile' | 'Distrustful' | 'Neutral' | 'Friendly' | 'Allied' | 'Devoted';
  portraitIcon: string;
}

export interface LocationInfo {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  dangerLevel: number; // 1 to 5
  npcs: string[];
  lootTypes: string[];
}

export interface EventChoice {
  text: string;
  req?: {
    type: 'ability' | 'item' | 'money' | 'trust';
    target: string;
    value: number;
  };
  energyCost?: number;
  consequences: {
    heal?: number;
    takeDamage?: number;
    hunger?: number;
    secrecy?: number;
    energy?: number;
    money?: number;
    addItem?: string;
    useItem?: string;
    trustChange?: { charId: string; delta: number };
    storyFlag?: { name: string; value: any };
    combat?: string;
    triggerEnding?: string;
    log: string;
  };
}

export interface GameEvent {
  id: string;
  title: string;
  speaker: string;
  characterId?: string;
  locationId?: string;
  text: string;
  choices: EventChoice[];
}

export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  defense: number;
  rewardMoney: number;
  rewardBlood: number;
  description: string;
  specialAbility: string;
}

export interface EndingResult {
  id: string;
  title: string;
  badge: string;
  description: string;
}

export type VampirePersonality = 'Charming' | 'Mysterious' | 'Ruthless' | 'Compassionate';
export type VampireOutfit = 'Victorian Noble' | 'Gothic Scholar' | 'Midnight Rogue' | 'Blood Aristocrat';

export interface VampireProfile {
  name: string;
  genderStyle: 'Masculine' | 'Feminine' | 'Androgynous';
  hairStyle: string;
  hairColor: string;
  eyeColor: string;
  outfit: VampireOutfit;
  personality: VampirePersonality;
}

export interface StoryJournal {
  completedQuests: string[];
  discoveries: string[];
  majorDecisions: string[];
  unlockedLore: string[];
  currentObjective: string;
}

export interface GameSettings {
  musicVolume: number;
  sfxVolume: number;
  fullscreen: boolean;
  difficulty: 'Story' | 'Normal' | 'Gothic Nightmare';
}

export type AppScreen =
  | 'menu'
  | 'character_creation'
  | 'dashboard'
  | 'map'
  | 'hunting'
  | 'abilities'
  | 'relationships'
  | 'blood_moon'
  | 'settings'
  | 'ending';

/**
 * 100 Nights as a Vampire - Comprehensive Types for 30 Screens & Cozy Gothic Gameplay
 */

export interface PlayerStats {
  hunger: number;    // 0 = Full/Quenched, 100 = Starving
  secrecy: number;   // 100 = Completely safe/hidden, 0 = Exposed
  energy: number;    // 0 - 100
  coins: number;     // Useful items & gifts
  night: number;     // 1 - 100
  timeOfDay: 'day' | 'night';
  // Backward compatibility fields
  health?: number;
  maxHealth?: number;
  maxEnergy?: number;
  money?: number;
}

export type VampirePersonality = 'Aristocratic' | 'Charming' | 'Scholarly' | 'Brooding' | 'Rebellious' | 'Kind' | 'Ruthless' | 'Compassionate' | string;
export type VampireOutfit = 'Victorian Noble' | 'Modern Trenchcoat' | 'Nightclub Velvet' | 'Dark Scholar' | 'School Uniform & Cloak' | string;

export interface VampireProfile {
  name: string;
  hair?: string;
  hairColor?: string;
  skinTone?: string;
  outfit?: string;
  petBatName?: string;
  // Backward compatibility
  genderStyle?: string;
  hairStyle?: string;
  eyeColor?: string;
  personality?: string;
}

export interface CharacterFriendship {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  friendship: number; // 0 - 100
  levelTitle: string; // Acquaintance, Friend, Close Friend, Best Friend, Soulmate
  notes: string;
}

export interface VampirePower {
  id: string;
  name: string;
  level: number;
  icon: string;
  unlockNight: number;
  unlocked: boolean;
  description: string;
  energyCost: number;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  category: 'energy' | 'magic' | 'outfit' | 'clue' | 'treat';
  description: string;
  effect: {
    hunger?: number;
    energy?: number;
    secrecy?: number;
    coins?: number;
  };
}

export interface MysteryClue {
  id: string;
  title: string;
  icon: string;
  description: string;
  discoveredAtNight: number;
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface MemoryMoment {
  id: string;
  title: string;
  night: number;
  emoji: string;
  imageColor: string;
  description: string;
}

export type MiniGameType =
  | 'bat_escape'
  | 'potion_mixing'
  | 'find_object'
  | 'vampire_puzzle'
  | 'escape_hunter'
  | 'moon_match';

// The 30 Explicit Frontend Screen Identifiers
export type ScreenId =
  | 'splash'             // 1
  | 'main_menu'          // 2
  | 'char_creation'      // 3
  | 'char_preview'       // 4
  | 'tutorial'           // 5
  | 'home'               // 6
  | 'day_map'            // 7
  | 'school'             // 8
  | 'town'               // 9
  | 'forest'             // 10
  | 'shop'               // 11
  | 'witch_house'        // 12
  | 'friendship'         // 13
  | 'dialogue'           // 14
  | 'choice'             // 15
  | 'inventory'          // 16
  | 'powers'             // 17
  | 'night_prep'         // 18
  | 'night_map'          // 19
  | 'random_event'       // 20
  | 'enemy_encounter'    // 21
  | 'minigame'           // 22
  | 'blood_moon'         // 23
  | 'mystery'            // 24
  | 'daily_reward'       // 25
  | 'night_summary'      // 26
  | 'achievements'       // 27
  | 'game_progress'      // 28
  | 'ending'             // 29
  | 'replay';            // 30

// Backward Compatibility Interfaces
export interface LocationInfo {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  description: string;
  dangerLevel: number;
  npcs: string[];
  lootTypes: string[];
}

export interface NPCCharacter {
  id: string;
  name: string;
  title: string;
  description: string;
  trust: number;
  status: string;
  portraitIcon: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  level: number;
  maxLevel: number;
  baseCost: number;
  upgradeCost: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  cost: number;
  usableInCombat?: boolean;
  usableInField?: boolean;
}

export interface EventChoice {
  text: string;
  energyCost?: number;
  requiredAbility?: string;
  minAbilityLevel?: number;
  requiredItem?: string;
  requiredSecrecy?: number;
  riskChance?: number;
  req?: any;
  consequences?: any;
  successOutcome?: {
    hunger?: number;
    health?: number;
    secrecy?: number;
    energy?: number;
    money?: number;
    itemReward?: string;
    logText: string;
  };
  failureOutcome?: {
    hunger?: number;
    health?: number;
    secrecy?: number;
    energy?: number;
    money?: number;
    logText: string;
  };
}

export interface GameEvent {
  id: string;
  title: string;
  description?: string;
  text?: string;
  speaker?: string;
  characterId?: string;
  locationId?: string;
  nightRequirement?: number;
  choices: EventChoice[];
}

export interface Enemy {
  id: string;
  name: string;
  type: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  defense: number;
  speed: number;
  icon: string;
  description: string;
  rewardMoney?: number;
  rewardBlood?: number;
  specialAbility?: string;
  drops?: {
    money: number;
    bloodEssence: number;
    rareItem?: string;
  };
}

export interface EndingResult {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  rating: string;
  epilogue: string;
  icon: string;
  badge?: string;
}

export interface StoryJournal {
  currentObjective: string;
  completedQuests: string[];
  discoveries: string[];
  majorDecisions: string[];
  unlockedLore: string[];
}

export type AppScreen =
  | 'menu'
  | 'character_creation'
  | 'dashboard'
  | 'city_map'
  | 'hunt_combat'
  | 'abilities_inventory'
  | 'relationships_story'
  | 'settings'
  | 'blood_moon_cinematic';

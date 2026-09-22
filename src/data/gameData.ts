import {
  CharacterFriendship,
  VampirePower,
  ShopItem,
  MysteryClue,
  Achievement,
  MemoryMoment,
  LocationInfo
} from '../types';

export const INITIAL_FRIENDS: Record<string, CharacterFriendship> = {
  maya: {
    id: 'maya',
    name: 'Maya',
    role: "Best Human Friend",
    description: 'Curious, cheerful, and loves stargazing. She is slowly noticing you never drink garlic soup or walk under noontime sun.',
    avatar: '🌸',
    color: '#ff758f',
    friendship: 65,
    levelTitle: 'Close Friend',
    notes: 'Shares lunch with you and invites you to school rooftop study sessions.'
  },
  alex: {
    id: 'alex',
    name: 'Alex',
    role: 'Mysterious New Student',
    description: 'Quiet, reads ancient folklore books in the library back corner. Seems to know far more about vampire clans than normal students.',
    avatar: '💜',
    color: '#c77dff',
    friendship: 35,
    levelTitle: 'Acquaintance',
    notes: 'Dropped an envelope with an old seal showing your family crest.'
  },
  luna: {
    id: 'luna',
    name: 'Luna',
    role: 'Friendly Witch',
    description: 'Brews sweet blackberry teas and sells helpful enchanted crystals from her cozy ivy-covered cottage in Whispering Woods.',
    avatar: '🔮',
    color: '#4cc9f0',
    friendship: 55,
    levelTitle: 'Friend',
    notes: 'Always reminds you that being a vampire is just another path of magic.'
  },
  leo: {
    id: 'leo',
    name: 'Leo',
    role: 'Vampire Hunter in Training',
    description: 'Wears a trench coat with silver badges. Looking for mischievous night creatures, but possesses a warm heart and loves strawberry snacks.',
    avatar: '🗡️',
    color: '#f77f00',
    friendship: 20,
    levelTitle: 'Wary',
    notes: 'Can be avoided, talked with, or turned into a protector ally if you show genuine kindness.'
  },
  ruby: {
    id: 'ruby',
    name: 'Ruby',
    role: 'Mentor Vampire Fledgling',
    description: 'A stylish vampire girl with crimson hair ribbons. Experienced in flying as a bat, avoiding sunlight, and finding yummy midnight berry juice.',
    avatar: '🦇',
    color: '#e63946',
    friendship: 75,
    levelTitle: 'Vampire Sister',
    notes: 'Taught you your first Night Vision ability and constantly checks your fangs!'
  }
};

export const INITIAL_POWERS: VampirePower[] = [
  {
    id: 'night_vision',
    name: 'Night Vision 🌙',
    level: 1,
    icon: '🌙',
    unlockNight: 1,
    unlocked: true,
    description: 'See hidden clues, glowing crystals, and secret paths in total darkness.',
    energyCost: 10
  },
  {
    id: 'bat_form',
    name: 'Bat Form 🦇',
    level: 2,
    icon: '🦇',
    unlockNight: 5,
    unlocked: false,
    description: 'Transform into a cute fluffy bat to flutter over obstacles and escape danger.',
    energyCost: 20
  },
  {
    id: 'super_speed',
    name: 'Super Speed ⚡',
    level: 3,
    icon: '⚡',
    unlockNight: 15,
    unlocked: false,
    description: 'Dash like a gust of midnight wind to slip away from chasing hunters or arrive home instantly.',
    energyCost: 25
  },
  {
    id: 'charm',
    name: 'Vampire Charm ✨',
    level: 4,
    icon: '✨',
    unlockNight: 30,
    unlocked: false,
    description: 'Smile with supernatural sparkle to make suspicious humans relax and trust your excuses.',
    energyCost: 20
  },
  {
    id: 'shadow_hide',
    name: 'Shadow Hide 🌑',
    level: 5,
    icon: '🌑',
    unlockNight: 50,
    unlocked: false,
    description: 'Blend softly into moonlit shadows, completely wiping human suspicion and restoring Secrecy.',
    energyCost: 30
  }
];

export const INITIAL_SHOP_ITEMS: ShopItem[] = [
  {
    id: 'moon_energy_drink',
    name: 'Sparkling Moon Tea',
    icon: '🧃',
    cost: 15,
    category: 'energy',
    description: 'A sweet chilled herbal brew crafted with lavender and night dew. Restores +35 Energy.',
    effect: { energy: 35 }
  },
  {
    id: 'crimson_snack',
    name: 'Berry Juice Jelly',
    icon: '🍓',
    cost: 20,
    category: 'treat',
    description: 'Sweet crimson berry gelatin that satisfies vampire hunger without hurting anyone. -30 Hunger.',
    effect: { hunger: -30 }
  },
  {
    id: 'shadow_cloak',
    name: 'Velvet Midnight Cloak',
    icon: '🧥',
    cost: 45,
    category: 'outfit',
    description: 'A cozy hooded cloak lined with silk. Protects your pale face from curious stares. +25 Secrecy.',
    effect: { secrecy: 25 }
  },
  {
    id: 'magic_crystal',
    name: 'Starlight Amethyst',
    icon: '🔮',
    cost: 35,
    category: 'magic',
    description: 'Luna’s glowing crystal that calms anxious minds. Grants +20 Energy & +15 Secrecy.',
    effect: { energy: 20, secrecy: 15 }
  },
  {
    id: 'mystery_box',
    name: 'Curious Antique Box',
    icon: '📦',
    cost: 25,
    category: 'clue',
    description: 'A wrapped box found in the attic. Might contain coins, rare treats, or ancient clues!',
    effect: { coins: 30, energy: 15 }
  }
];

export const INITIAL_CLUES: MysteryClue[] = [
  {
    id: 'old_key',
    title: 'Antique Brass Key',
    icon: '🗝️',
    description: 'Carved with moon engravings. Fits the forbidden study door on the school roof.',
    discoveredAtNight: 2
  },
  {
    id: 'strange_diary',
    title: 'Leatherbound Night Diary',
    icon: '📖',
    description: 'Written by a vampire student from 50 years ago who also hid among normal kids.',
    discoveredAtNight: 12
  },
  {
    id: 'hunter_note',
    title: "Leo's Dropped Notepad",
    icon: '📝',
    description: 'Notes saying: "Subject is very polite, loves apple juice... wait, are they actually dangerous?"',
    discoveredAtNight: 24
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_flight',
    title: 'First Flight 🦇',
    icon: '🦇',
    description: 'Unlocked the Bat Form power and flapped across the night sky.',
    unlocked: true,
    unlockedAt: 'Night 5'
  },
  {
    id: 'blood_moon_survivor',
    title: 'Blood Moon Survivor 🌕',
    icon: '🌕',
    description: 'Kept calm and made the right choice during a crimson lunar eclipse.',
    unlocked: false
  },
  {
    id: 'best_friend',
    title: 'Best Friend Forever ❤️',
    icon: '❤️',
    description: 'Reached 80+ friendship with Maya or Ruby.',
    unlocked: false
  },
  {
    id: 'witch_apprentice',
    title: "Witch's Apprentice 🔮",
    icon: '🔮',
    description: 'Helped Luna brew a magical moonflower potion without spilling.',
    unlocked: false
  },
  {
    id: 'century_immortal',
    title: '100 Nights Master 💯',
    icon: '💯',
    description: 'Successfully reached Night 100 with your secret safe and friends by your side!',
    unlocked: false
  }
];

export const INITIAL_MEMORIES: MemoryMoment[] = [
  {
    id: 'mem_1',
    title: 'The First Midnight Awakening',
    night: 1,
    emoji: '🌙',
    imageColor: 'from-purple-900 to-indigo-950',
    description: 'Waking up with pointy little fangs and wondering how you will survive school.'
  },
  {
    id: 'mem_2',
    title: 'Roof Whispers with Maya',
    night: 14,
    emoji: '🌸',
    imageColor: 'from-pink-900 to-purple-950',
    description: 'Watching sunset fireworks together while making sure your cloak covers your hands.'
  },
  {
    id: 'mem_3',
    title: 'Tea with Luna in Whispering Woods',
    night: 28,
    emoji: '🍵',
    imageColor: 'from-blue-900 to-teal-950',
    description: 'Luna told you that compassion makes a vampire stronger than any ancient elder.'
  }
];

export const INITIAL_LOCATIONS: Record<string, LocationInfo> = {
  mansion: {
    id: 'mansion',
    name: 'Ancestral Gothic Manor',
    icon: '🏰',
    subtitle: 'Crypt of Valerius & The Secret Library',
    description: 'A crumbling Victorian estate wrapped in mist and ivy.',
    dangerLevel: 1,
    npcs: ['mentor'],
    lootTypes: ['ancient_tome', 'blood_phial']
  },
  catacombs: {
    id: 'catacombs',
    name: 'Old Town Catacombs',
    icon: '⚰️',
    subtitle: 'Forgotten Tombs & Smuggler Warrens',
    description: 'Chilly stone passages beneath the city.',
    dangerLevel: 3,
    npcs: ['vampire_rebel'],
    lootTypes: ['silver_coin', 'shadow_crystal']
  },
  neon_district: {
    id: 'neon_district',
    name: 'Midnight Neon Quarter',
    icon: '🏙️',
    subtitle: 'Rave Clubs & Unsuspecting Prey',
    description: 'Vibrant alleys illuminated by glowing purple and red signs.',
    dangerLevel: 2,
    npcs: ['socialite'],
    lootTypes: ['cash_wad', 'glowing_pendant']
  }
};

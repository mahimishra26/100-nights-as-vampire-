import { LocationInfo, NPCCharacter, Ability, InventoryItem, GameEvent, EndingResult } from '../types';

export const INITIAL_LOCATIONS: Record<string, LocationInfo> = {
  mansion: {
    id: 'mansion',
    name: 'Vampire Mansion',
    icon: '🏰',
    subtitle: 'Sanctuary of the Obsidian Court',
    description: 'A sprawling gothic estate shrouded in perpetual fog and warded by ancient gargoyles. Rest in warded coffins and consult Lord Valerius.',
    dangerLevel: 1,
    npcs: ['mentor', 'rival'],
    lootTypes: ['lore', 'money', 'rest']
  },
  downtown: {
    id: 'downtown',
    name: 'Gothic Downtown',
    icon: '🌃',
    subtitle: 'Gaslit Alleys & Teeming Crowds',
    description: 'Cobblestone avenues where mortal revellers, street urchins, and patrolling police mingle under neon and lamplight. Abundant prey, watchful eyes.',
    dangerLevel: 2,
    npcs: ['human_friend', 'hunter'],
    lootTypes: ['blood', 'money']
  },
  graveyard: {
    id: 'graveyard',
    name: 'Blackwood Cemetery',
    icon: '🪦',
    subtitle: 'Ancient Crypts & Resting Spirits',
    description: 'Weathered mausoleums covered in ivy and wrought iron. Whispers of buried necromantic tomes, roaming ghouls, and grave robbers looking for quick coin.',
    dangerLevel: 2,
    npcs: ['witch'],
    lootTypes: ['relics', 'dark_mana', 'money']
  },
  academy: {
    id: 'academy',
    name: "St. Jude's Old Academy",
    icon: '🏫',
    subtitle: 'Scholarly Archives & Occult Libraries',
    description: 'A grand Victorian university containing forbidden grimoires, preserved alchemical specimens, and historical records of the city covenant.',
    dangerLevel: 2,
    npcs: ['mysterious_human'],
    lootTypes: ['lore', 'elixirs', 'clues']
  },
  nightclub: {
    id: 'nightclub',
    name: 'The Velvet Veil',
    icon: '🍷',
    subtitle: 'VIP Lounges & Decadent Shadows',
    description: 'A neon-drenched subterranean nightclub frequented by wealthy aristocrats, nocturnal socialites, and rival vampires looking for discrete feeding.',
    dangerLevel: 3,
    npcs: ['rival', 'queen'],
    lootTypes: ['blood', 'connections', 'money']
  },
  forest: {
    id: 'forest',
    name: 'Ashwood Forest',
    icon: '🌲',
    subtitle: 'Primal Woods & Wolf Territory',
    description: 'An ancient misty timberland ringing the city perimeter. Lunar wolves prowl between hemlocks and monoliths. Trespassers are rarely spared.',
    dangerLevel: 4,
    npcs: ['werewolf'],
    lootTypes: ['rare_herbs', 'wolfsbane', 'beast_essence']
  },
  church: {
    id: 'church',
    name: "St. Michael's Abandoned Chapel",
    icon: '⛪',
    subtitle: 'Hallowed Ground & Inquisitor Nest',
    description: 'A desecrated stone cathedral with cracked stained glass. Holy residue burns vampire flesh, and Detective Cross uses the bell tower as a forward post.',
    dangerLevel: 4,
    npcs: ['hunter'],
    lootTypes: ['holy_water', 'silver_amulet', 'inquisitor_notes']
  },
  hospital: {
    id: 'hospital',
    name: 'Mercy General Hospital',
    icon: '🏥',
    subtitle: 'Sterile Blood Banks & Silent Wards',
    description: 'A labyrinth of fluorescent corridors, locked hematology labs, and quiet terminal wards. High-grade refrigerated O-negative blood packs can be stolen.',
    dangerLevel: 3,
    npcs: ['mysterious_human', 'human_friend'],
    lootTypes: ['blood_packs', 'medicine', 'syringes']
  },
  market: {
    id: 'market',
    name: 'Catacomb Black Market',
    icon: '🕯️',
    subtitle: 'Forbidden Bazaar of the Damned',
    description: 'Located beneath the sewers in Roman aqueducts. Witches, dhampirs, and smugglers sell forbidden talismans, forged IDs, and enchanted weapons.',
    dangerLevel: 3,
    npcs: ['witch', 'queen'],
    lootTypes: ['enchanted_items', 'forged_papers', 'elixirs']
  }
};

export const INITIAL_CHARACTERS: Record<string, NPCCharacter> = {
  mentor: {
    id: 'mentor',
    name: 'Lord Valerius',
    title: 'The Ancient Sire & Mentor',
    description: 'An aristocratic elder of the obsidian court who pulled you from mortal death. Elegant, strict, but harboring deep guilt over the coming Blood Moon.',
    trust: 60,
    status: 'Friendly',
    portraitIcon: '🧛‍♂️'
  },
  rival: {
    id: 'rival',
    name: 'Julian Blackwood',
    title: 'The Ambitious Vampire Rival',
    description: 'A charismatic, ruthless young vampire aristocrat who views you as an untested upstart trespassing upon his feeding rights.',
    trust: 35,
    status: 'Distrustful',
    portraitIcon: '🍷'
  },
  hunter: {
    id: 'hunter',
    name: 'Detective Jonathan Cross',
    title: 'The Relentless Inquisitor',
    description: 'A scarred municipal detective armed with sanctified silver and ultraviolet bulbs. Searching for who slaughtered his partner.',
    trust: 15,
    status: 'Hostile',
    portraitIcon: '🕵️‍♂️'
  },
  queen: {
    id: 'queen',
    name: 'Queen Morvath',
    title: 'Sovereign of the Blood Throne',
    description: 'An immortal monarch ruling the shadowed alleys and high towers from her crystalline throne. Demands absolute elegance and obedience.',
    trust: 40,
    status: 'Neutral',
    portraitIcon: '👑'
  },
  mysterious_human: {
    id: 'mysterious_human',
    name: 'Elena Vance',
    title: 'The Occult Botanist',
    description: 'A brilliant, quiet scholar fascinated by night-blooming lunar flora and crimson alchemical elixirs. She suspects your true nature.',
    trust: 45,
    status: 'Neutral',
    portraitIcon: '🧪'
  },
  werewolf: {
    id: 'werewolf',
    name: 'Gerald the Gray Mane',
    title: 'Alpha of the Ashwood Pack',
    description: 'A massive, scarred werewolf guarding the deep outskirts. Despises vampire parasites, but respects genuine strength and honest pacts.',
    trust: 25,
    status: 'Distrustful',
    portraitIcon: '🐺'
  },
  witch: {
    id: 'witch',
    name: 'Madam Morgana',
    title: 'Keeper of Forgotten Runes',
    description: 'An eccentric crone residing in subterranean catacombs. Deals in forbidden talismans, tarot divination, and blood moon omens.',
    trust: 50,
    status: 'Neutral',
    portraitIcon: '🔮'
  },
  human_friend: {
    id: 'human_friend',
    name: 'Sarah Jenkins',
    title: 'Your Mortal Anchor',
    description: 'Your dearest friend from your previous life before you vanished into the night. She worries about your pale skin and strange nocturnal habits.',
    trust: 75,
    status: 'Allied',
    portraitIcon: '🌸'
  }
};

export const INITIAL_ABILITIES: Record<string, Ability> = {
  superhuman_speed: {
    id: 'superhuman_speed',
    name: 'Superhuman Speed',
    description: 'Accelerate perception and muscle twitches to a blur. Strike twice in combat and outrun pursuing hunter patrols.',
    level: 1,
    maxLevel: 3,
    baseCost: 15,
    upgradeCost: 160
  },
  hypnosis: {
    id: 'hypnosis',
    name: 'Hypnotic Gaze',
    description: 'Lock eyes with mortals to bend their wills, wipe suspicious memories (+Secrecy), or pacify enemies in battle.',
    level: 0,
    maxLevel: 3,
    baseCost: 20,
    upgradeCost: 80
  },
  night_vision: {
    id: 'night_vision',
    name: 'Night Vision & Blood Sight',
    description: 'Detect hidden passageways, uncover concealed contraband, and predict enemy ambushes before they strike.',
    level: 0,
    maxLevel: 3,
    baseCost: 10,
    upgradeCost: 80
  },
  shadow_teleportation: {
    id: 'shadow_teleportation',
    name: 'Shadow Step',
    description: 'Melt into one shadow and emerge from another. Bypass locks, pass holy barriers, or teleport behind targets in combat.',
    level: 0,
    maxLevel: 3,
    baseCost: 25,
    upgradeCost: 100
  },
  vampire_charm: {
    id: 'vampire_charm',
    name: 'Vampiric Allure',
    description: 'Radiate an irresistible aura of nocturnal elegance. Boosts relationship gains and lowers market prices.',
    level: 0,
    maxLevel: 3,
    baseCost: 15,
    upgradeCost: 80
  },
  regeneration: {
    id: 'regeneration',
    name: 'Blood Regeneration',
    description: 'Stir undead ichor in your veins to rapidly seal bullet wounds, burns, and slash marks into smooth skin.',
    level: 0,
    maxLevel: 3,
    baseCost: 20,
    upgradeCost: 100
  },
  bat_transformation: {
    id: 'bat_transformation',
    name: 'Bat Form',
    description: 'Shape-shift into a swift bat. Soar across gothic rooftops, survey the city from above, and evade deadly ambushes.',
    level: 0,
    maxLevel: 3,
    baseCost: 30,
    upgradeCost: 120
  }
};

export const INITIAL_ITEMS: Record<string, InventoryItem> = {
  rat_blood: {
    id: 'rat_blood',
    name: 'Vial of Vermin Blood',
    description: 'Bitter rodent blood. Quenches thirst slightly (-15 Hunger).',
    category: 'consumable',
    quantity: 2,
    cost: 15,
    usableInCombat: true,
    usableInField: true
  },
  preserved_blood: {
    id: 'preserved_blood',
    name: 'Preserved Blood Pack (O-)',
    description: 'Medical grade sterile blood. Quenches thirst (-40 Hunger) and heals +15 HP.',
    category: 'consumable',
    quantity: 1,
    cost: 60,
    usableInCombat: true,
    usableInField: true
  },
  energy_tonic: {
    id: 'energy_tonic',
    name: 'Moonlit Draught',
    description: 'A glowing vial that stirs vampire blood. Restores +40 Energy.',
    category: 'consumable',
    quantity: 1,
    cost: 40,
    usableInCombat: true,
    usableInField: true
  },
  smoke_bomb: {
    id: 'smoke_bomb',
    name: 'Shadow Smoke Bomb',
    description: 'Dense cloud of alchemical darkness. Guarantees 100% escape in combat or +15 Secrecy.',
    category: 'consumable',
    quantity: 1,
    cost: 45,
    usableInCombat: true,
    usableInField: true
  },
  silver_amulet: {
    id: 'silver_amulet',
    name: 'Silver Moon Amulet',
    description: 'Warded talisman that grants +10% damage resistance in battle.',
    category: 'equipment',
    quantity: 0,
    cost: 120,
    usableInCombat: false,
    usableInField: false
  }
};

export const MILESTONE_EVENTS: Record<number, GameEvent> = {
  25: {
    id: 'milestone_25',
    title: 'NIGHT 25: The Scent of Silver',
    speaker: 'Detective Jonathan Cross',
    characterId: 'hunter',
    text: "Rain hammers against chapel gargoyles. A blinding magnesium flare ignites! Detective Cross steps forward, clutching a silver revolver and a surveillance file with your mortal photograph.\n\n'I know what you are,' Cross growls. 'And I know who sired you. You were chosen because of your rare lunar bloodline. Walk away with me now and help me bring down the Obsidian Court, or die where you stand.'",
    choices: [
      {
        text: "Offer an uneasy truce: 'I don't kill innocents, Cross. We share common enemies.'",
        consequences: {
          trustChange: { charId: 'hunter', delta: 30 },
          secrecy: 15,
          storyFlag: { name: 'cross_allied', value: true },
          log: 'Cross lowers his revolver slightly. A secret pact between hunter and fledgling is struck.'
        }
      },
      {
        text: 'Use Hypnotic Gaze to disorient him and vanish into the storm.',
        req: { type: 'ability', target: 'hypnosis', value: 1 },
        energyCost: 20,
        consequences: {
          secrecy: 10,
          trustChange: { charId: 'hunter', delta: -10 },
          log: 'Your crimson gaze shatters his focus. You melt into the rainy alleys before he can fire.'
        }
      },
      {
        text: 'Draw your claws and fight for your immortal life!',
        consequences: {
          combat: 'inquisitor',
          trustChange: { charId: 'hunter', delta: -40 },
          log: 'Gunfire echoes through the gothic courtyard!'
        }
      }
    ]
  },
  50: {
    id: 'milestone_50',
    title: 'NIGHT 50: The Betrayal at the Velvet Veil',
    speaker: 'Julian Blackwood',
    characterId: 'rival',
    text: "Tonight marks half of your hundred nights. Inside the lavish VIP balcony of the Velvet Veil, Julian Blackwood raises a crystal goblet of blood-wine with a cold smirk. Four armed enforcers step out from velvet curtains.\n\n'Did you truly believe Lord Valerius took you in out of paternal charity?' Julian sneers. 'Your veins carry the Eclipse Key. On the 100th night of the Blood Moon, the Sovereign requires your heart to awaken. But I intend to claim that throne first. Hand over your blood, fledgling.'",
    choices: [
      {
        text: "Unleash Superhuman Speed and turn the tables on Julian's thugs!",
        req: { type: 'ability', target: 'superhuman_speed', value: 1 },
        energyCost: 20,
        consequences: {
          combat: 'rival_enforcer',
          trustChange: { charId: 'rival', delta: -50 },
          storyFlag: { name: 'knows_blood_moon_secret', value: true },
          log: 'You blitz through the guards, shattering the chandeliers in a hurricane of glass!'
        }
      },
      {
        text: 'Charm his bodyguard to switch allegiances with Vampiric Allure.',
        req: { type: 'ability', target: 'vampire_charm', value: 2 },
        energyCost: 25,
        consequences: {
          money: 150,
          trustChange: { charId: 'rival', delta: -30 },
          storyFlag: { name: 'knows_blood_moon_secret', value: true },
          log: "Julian's top lieutenant turns his weapon on Julian! Julian retreats in fury, leaving his purse."
        }
      },
      {
        text: 'Melt into the shadows and escape to warn Lord Valerius.',
        consequences: {
          trustChange: { charId: 'mentor', delta: 20 },
          storyFlag: { name: 'knows_blood_moon_secret', value: true },
          log: 'You leap off the balcony into the dark river below, surfacing to warn your mentor.'
        }
      }
    ]
  },
  75: {
    id: 'milestone_75',
    title: 'NIGHT 75: The Grand Inquisitor Crusade',
    speaker: 'Lord Valerius & Gerald the Werewolf',
    characterId: 'mentor',
    text: "Air sirens wail across the metropolitan skyline. The Inquisition has declared martial law. Ultraviolet spotlights sweep across rooftops while military search helicopters buzz like hornets. In the deep Ashwood glade, Lord Valerius and Gerald the Alpha stand back-to-back in an uneasy summit.\n\n'The purge has begun,' Valerius says grimly. 'If the supernatural covens cannot unite tonight, the inquisitors will burn every haven to ash before the Blood Moon rises.'\nGerald snarls, 'The wolves will fight, fledgling... but only if you prove your loyalty.'",
    choices: [
      {
        text: 'Broker an ancient Blood Alliance between the Werewolves and Vampires.',
        consequences: {
          trustChange: { charId: 'werewolf', delta: 40 },
          secrecy: 25,
          log: 'You cut your palms together over the runic altar. The wolf pack and vampire court unite!'
        }
      },
      {
        text: "Convince Detective Cross to sabotage the inquisitors' ultraviolet grid from within.",
        req: { type: 'trust', target: 'hunter', value: 40 },
        consequences: {
          trustChange: { charId: 'hunter', delta: 25 },
          secrecy: 40,
          money: 100,
          log: 'Cross cuts the city power transformers! The hunters are blinded in the darkness.'
        }
      },
      {
        text: 'Transform into a bat swarm and lead the hunters away on a diversion.',
        req: { type: 'ability', target: 'bat_transformation', value: 1 },
        energyCost: 30,
        consequences: {
          secrecy: 30,
          trustChange: { charId: 'mentor', delta: 35 },
          log: 'You lure three military squads into the winding sewers, buying the coven precious days.'
        }
      }
    ]
  },
  100: {
    id: 'milestone_100',
    title: 'NIGHT 100: The Blood Moon Ascendant',
    speaker: 'The Eclipse Sovereign & Queen Morvath',
    characterId: 'queen',
    text: "THE HUNDREDTH NIGHT HAS COME.\n\nThe moon has turned into a giant weeping eye of celestial blood. The clouds burn crimson. At the apex of the Blackwood Spire, the ancient seal has shattered, revealing the primordial Eclipse Sovereign. All your choices, your humanity, your alliances, and your survival across a hundred dark nights have converged here.\n\nThe Sovereign raises an obsidian sceptre: 'Bearer of the Eclipse Blood! You have survived the trials. Will you kneel and rule the world in eternal night, or will you defy the First Vampire?'",
    choices: [
      {
        text: 'Engage the Eclipse Sovereign in the Final Battle of Immortality!',
        consequences: {
          combat: 'eclipse_sovereign',
          log: 'You charge the ancient deity with all the fury of your 100 nights of survival!'
        }
      },
      {
        text: "Use Madam Morgana's Ancient Runes to cleanse the Blood Moon curse forever.",
        req: { type: 'trust', target: 'witch', value: 50 },
        consequences: {
          triggerEnding: 'redemption',
          log: 'Ancient lunar runes erupt in golden dawn light, dissolving the celestial curse!'
        }
      },
      {
        text: 'Seize the Eclipse Sceptre and claim dominion as the new Vampire Monarch!',
        req: { type: 'trust', target: 'queen', value: 55 },
        consequences: {
          triggerEnding: 'vampire_ruler',
          log: 'You take the blood throne beside the Queen, sovereign of all creatures of the night.'
        }
      },
      {
        text: 'Flee into the dawn with your mortal companion, forsaking the throne forever.',
        req: { type: 'trust', target: 'human_friend', value: 65 },
        consequences: {
          triggerEnding: 'human_love',
          log: "Turning your back on immortal glory, you take Sarah's hand and vanish into the sunrise."
        }
      }
    ]
  }
};

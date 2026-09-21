import { GameEvent } from '../types';

export const LOCATION_EVENTS_POOL: Record<string, GameEvent[]> = {
  mansion: [
    {
      id: 'mansion_valerius_lesson',
      title: "Lord Valerius's Private Study",
      speaker: 'Lord Valerius',
      characterId: 'mentor',
      locationId: 'mansion',
      text: "Fire crackles in the marble hearth. Lord Valerius looks up from an illuminated 14th-century codex.\n\n'Come, fledgling. A true vampire does not rely merely on beastly fangs; we wield the subtle arts of the mind and the blood. How do you find your thirst tonight?'",
      choices: [
        {
          text: 'Listen to his meditation lecture on taming the blood frenzy (+Energy, +Trust, -Thirst).',
          consequences: {
            energy: 30,
            hunger: -15,
            trustChange: { charId: 'mentor', delta: 15 },
            log: 'Valerius shares ancient discipline techniques, steadying your racing undead pulse.'
          }
        },
        {
          text: 'Inquire into the mysterious bloodline of your sire and the 100th Night.',
          consequences: {
            trustChange: { charId: 'mentor', delta: 10 },
            storyFlag: { name: 'knows_blood_moon_secret', value: true },
            log: 'Valerius reveals that the Blood Moon requires an ancient anchor—one carrying your lineage.'
          }
        },
        {
          text: 'Rest undisturbed in the warded obsidian coffin (+40 HP, +30⚡).',
          consequences: {
            heal: 40,
            energy: 30,
            secrecy: 5,
            log: 'Deep restorative slumber behind heavy wards completely revitalizes your body.'
          }
        }
      ]
    },
    {
      id: 'mansion_ancient_armory',
      title: 'The Ancestral Armory',
      speaker: 'Vampire Mansion Grounds',
      locationId: 'mansion',
      text: "Down the winding cellar steps lies the ancestral armory of the Obsidian Court. Silver-chased fencing foils, ancient chalices, and velvet cloaks hang in velvet cases.",
      choices: [
        {
          text: 'Study antique combat techniques (+Combat Focus, +15 Energy).',
          consequences: {
            energy: 25,
            log: 'You practice rapier forms in the candlelight, honing your supernatural reflexes.'
          }
        },
        {
          text: 'Search the ornamental chests for forgotten coinage.',
          consequences: {
            money: 65,
            secrecy: 5,
            log: 'You discover an ornate purse of vintage sovereign coins (+$65).'
          }
        }
      ]
    }
  ],
  downtown: [
    {
      id: 'downtown_alley_encounter',
      title: 'Gaslit Alleys & Velvet Fog',
      speaker: 'Gothic Downtown',
      locationId: 'downtown',
      text: "A thick river mist rolls off the harbor, muffling the laughter spilling from Victorian pubs. A drunken merchant stumbles down an unlit cobblestone alley, jingling a heavy purse.",
      choices: [
        {
          text: 'Lurk in the shadows and feed discretely with Hypnotic Gaze.',
          req: { type: 'ability', target: 'hypnosis', value: 1 },
          energyCost: 15,
          consequences: {
            hunger: -45,
            secrecy: 5,
            money: 40,
            log: 'Your crimson eyes lull the merchant into a dreamy daze. You feed cleanly and relieve him of $40.'
          }
        },
        {
          text: 'Pickpocket his purse without feeding (+Money, 0 risk to Secrecy).',
          consequences: {
            money: 70,
            log: 'With light fingers, you lift his velvet coin pouch without alerting him (+$70).'
          }
        },
        {
          text: 'Ambush him violently from behind to feed completely!',
          consequences: {
            hunger: -60,
            secrecy: -15,
            money: 50,
            log: 'You drain him in the dark. Thirst satisfied, but a patrolling constable blows a whistle (-15% Secrecy)!'
          }
        }
      ]
    },
    {
      id: 'downtown_police_checkpoint',
      title: 'Constabulary Checkpoint',
      speaker: 'Gothic Downtown',
      locationId: 'downtown',
      text: "Steam hisses from sewer grates. Ahead, two armed detectives in trench coats are inspecting identity papers under gas streetlamps.",
      choices: [
        {
          text: 'Slip past unseen along the gothic rooftops using Bat Form.',
          req: { type: 'ability', target: 'bat_transformation', value: 1 },
          energyCost: 20,
          consequences: {
            secrecy: 10,
            log: 'You dissolve into a shadow bat, gliding silently over their heads into the night.'
          }
        },
        {
          text: 'Project an aura of aristocratic elegance with Vampiric Allure.',
          req: { type: 'ability', target: 'vampire_charm', value: 1 },
          consequences: {
            secrecy: 8,
            log: "The constables are awed by your noble bearing, tipping their hats and letting you pass."
          }
        },
        {
          text: 'Bribe them with quick hush money ($45).',
          req: { type: 'money', target: '', value: 45 },
          consequences: {
            money: -45,
            secrecy: 5,
            log: 'A fat banknote persuades the officers to look the other way.'
          }
        }
      ]
    }
  ],
  graveyard: [
    {
      id: 'graveyard_grave_robbers',
      title: 'Midnight in Blackwood Cemetery',
      speaker: 'Blackwood Cemetery',
      locationId: 'graveyard',
      text: "Crows call from wrought-iron crypt gates. Lantern light flickers over a disturbed mausoleum—two scoundrels are exhuming an aristocratic vault with shovels and crowbars.",
      choices: [
        {
          text: 'Terrify the grave robbers into abandoning their loot with Night Vision.',
          consequences: {
            money: 85,
            secrecy: 5,
            log: 'Your glowing crimson eyes emerge from the tomb. The robbers flee in horror, leaving $85 in antique jewels!'
          }
        },
        {
          text: 'Slaughter them and feed on both (-50 Thirst, -10 Secrecy).',
          consequences: {
            hunger: -50,
            secrecy: -10,
            money: 50,
            log: 'No one mourns grave robbers. You gorge on their warm blood in the crypts.'
          }
        },
        {
          text: 'Sneak into the opened crypt to recover buried occult relics.',
          consequences: {
            money: 110,
            energy: -10,
            log: 'Inside the lead coffin, you discover a rare silver locket and ancestral coins (+$110).'
          }
        }
      ]
    },
    {
      id: 'graveyard_ghoul_ambush',
      title: 'Crypt Ghoul Encounter',
      speaker: 'Blackwood Cemetery',
      locationId: 'graveyard',
      text: "A sickening scrape echoes through the catacomb floor. A starved crypt ghoul—a former fledgling who succumbed to bestial hunger—lunges with blackened claws!",
      choices: [
        {
          text: 'Draw your claws and destroy the wretched creature!',
          consequences: {
            combat: 'feral_ghoul',
            log: 'You engage the ravenous ghoul in lethal close-quarters combat!'
          }
        },
        {
          text: 'Leap backward into the mist using Shadow Step (-15⚡).',
          req: { type: 'ability', target: 'shadow_teleportation', value: 1 },
          energyCost: 15,
          consequences: {
            log: 'You teleport atop a gothic obelisk, watching the blind beast wander into the gloom.'
          }
        }
      ]
    }
  ],
  academy: [
    {
      id: 'academy_elena_greenhouse',
      title: "Elena Vance's Botanical Sanctuary",
      speaker: 'Elena Vance',
      characterId: 'mysterious_human',
      locationId: 'academy',
      text: "Inside the glass Victorian conservatory of St. Jude's, moonlight filters over blooming lunar lilies and weeping silver ferns. Elena Vance adjusts her spectacles as you approach.\n\n'Your skin has no pulse,' she whispers softly, not in fear, but academic awe. 'Yet you move with such impossible grace.'",
      choices: [
        {
          text: 'Offer your cooperation and discuss rare nocturnal herbalism (+Trust).',
          consequences: {
            trustChange: { charId: 'mysterious_human', delta: 25 },
            energy: 25,
            log: 'Elena is captivated by your descriptions of the night. She gifts you an alchemical draught.'
          }
        },
        {
          text: 'Hypnotize her to erase her suspicions (+15% Secrecy).',
          req: { type: 'ability', target: 'hypnosis', value: 1 },
          energyCost: 15,
          consequences: {
            secrecy: 15,
            trustChange: { charId: 'mysterious_human', delta: -10 },
            log: 'Your crimson gaze wipes her immediate memories of your unnatural traits.'
          }
        },
        {
          text: 'Steal her experimental Moonlit Draught from the lab table.',
          consequences: {
            energy: 40,
            trustChange: { charId: 'mysterious_human', delta: -15 },
            log: 'You slip the glowing blue tonic into your coat while her back is turned (+40⚡).'
          }
        }
      ]
    }
  ],
  nightclub: [
    {
      id: 'nightclub_julian_lounge',
      title: 'The Velvet Veil VIP Lounge',
      speaker: 'Julian Blackwood',
      characterId: 'rival',
      locationId: 'nightclub',
      text: "Deep bass pulses through obsidian floors. Red neon illuminates leather banquettes where mortal socialites drink champagne unaware. Julian Blackwood swivels with a cold smile.\n\n'Look at them, fledgling. Cattle in designer clothes. Care to join me in the private booth, or are you still playing the pious monk?'",
      choices: [
        {
          text: 'Accept a glass of vintage O-negative blood-wine with Julian (+Trust).',
          consequences: {
            hunger: -40,
            trustChange: { charId: 'rival', delta: 20 },
            energy: 20,
            log: 'You clink glasses with Julian. Sated on high-society blood, an uneasy truce is held.'
          }
        },
        {
          text: 'Firmly decline his decadence and warn him about hunter surveillance.',
          consequences: {
            secrecy: 10,
            trustChange: { charId: 'rival', delta: -10 },
            log: "Julian scoffs, but quietly orders his bouncers to tighten the club's security."
          }
        },
        {
          text: 'Use Vampiric Allure to seduce a wealthy mortal patron in the lounge.',
          req: { type: 'ability', target: 'vampire_charm', value: 1 },
          consequences: {
            hunger: -45,
            money: 120,
            log: 'A wealthy heiress is spellbound. She willingly offers her neck and her platinum purse (+$120)!'
          }
        }
      ]
    }
  ],
  forest: [
    {
      id: 'forest_gerald_pack',
      title: 'The Howling Perimeter',
      speaker: 'Gerald the Gray Mane',
      characterId: 'werewolf',
      locationId: 'forest',
      text: "The pungent scent of pine and wet fur fills the mist. Massive lupine silhouettes emerge from behind hemlock trees. Gerald the Gray Mane steps forward in half-beast form, amber eyes burning.\n\n'Leaches don't walk Ashwood without paying tribute, leech. Speak your purpose or be ripped to shreds.'",
      choices: [
        {
          text: 'Offer silver coins and respect the pack boundaries ($50).',
          req: { type: 'money', target: '', value: 50 },
          consequences: {
            money: -50,
            trustChange: { charId: 'werewolf', delta: 25 },
            log: 'Gerald grunts in approval at your respect. The wolves let you roam unmolested.'
          }
        },
        {
          text: 'Hold your ground and display supernatural dominance with Superhuman Speed.',
          req: { type: 'ability', target: 'superhuman_speed', value: 2 },
          energyCost: 20,
          consequences: {
            trustChange: { charId: 'werewolf', delta: 20 },
            log: 'You move faster than eye can follow. Gerald nods with grudging respect: "Fast for a leech."'
          }
        },
        {
          text: 'Defend yourself against an aggressive wolf scout!',
          consequences: {
            combat: 'werewolf',
            trustChange: { charId: 'werewolf', delta: -25 },
            log: 'Teeth and claws clash in the moonlit clearing!'
          }
        }
      ]
    }
  ],
  church: [
    {
      id: 'church_cross_investigation',
      title: "Shadows in St. Michael's Chapel",
      speaker: 'Detective Jonathan Cross',
      characterId: 'hunter',
      locationId: 'church',
      text: "The scent of burned myrrh and melting wax hangs heavy in the ruined nave. In the shadows of the broken altar, Detective Cross examines a silver projectile with magnifying tweezers.\n\n'Every night, another anomalous exsanguination,' Cross murmurs without looking up. 'How long before you slip up, blood-drinker?'",
      choices: [
        {
          text: 'Leave an anonymous dossier framing Julian Blackwood (+Secrecy, +Hunter Trust).',
          consequences: {
            trustChange: { charId: 'hunter', delta: 20 },
            secrecy: 15,
            log: 'Cross takes the bait. The municipal task force will focus its attention away from you.'
          }
        },
        {
          text: 'Melt through the stained-glass window using Bat Form (-20 Energy).',
          req: { type: 'ability', target: 'bat_transformation', value: 1 },
          energyCost: 20,
          consequences: {
            secrecy: 10,
            log: 'You flutter out through the broken rosette window before Cross can turn his weapon.'
          }
        },
        {
          text: 'Engage the inquisitor in direct battle!',
          consequences: {
            combat: 'inquisitor',
            trustChange: { charId: 'hunter', delta: -40 },
            log: 'Sanctified silver bullets shatter the chapel pews!'
          }
        }
      ]
    }
  ],
  hospital: [
    {
      id: 'hospital_blood_bank_raid',
      title: 'Mercy General Hematology Storage',
      speaker: 'Mercy General Hospital',
      locationId: 'hospital',
      text: "The hum of heavy-duty refrigeration units fills the basement ward. Behind a locked security door sit crates of chilled, sterile O-negative blood packs—pure nectar without mortal blood-guilt.",
      choices: [
        {
          text: 'Pick the digital lock or slip through shadows with Shadow Step (-20⚡).',
          req: { type: 'ability', target: 'shadow_teleportation', value: 1 },
          energyCost: 20,
          consequences: {
            addItem: 'preserved_blood',
            hunger: -40,
            heal: 25,
            log: 'You teleport inside, gorge on fresh sterile plasma, and slip 2 packs into your satchel!'
          }
        },
        {
          text: 'Hypnotize the night-duty nurse to hand over keys (+Secrecy).',
          req: { type: 'ability', target: 'hypnosis', value: 1 },
          energyCost: 15,
          consequences: {
            addItem: 'preserved_blood',
            hunger: -35,
            secrecy: 5,
            log: 'The nurse willingly unlocks the cooler in a dreamy haze, handing you preserved blood.'
          }
        },
        {
          text: 'Force the lock manually (-10 Secrecy from tripped alarm).',
          consequences: {
            addItem: 'preserved_blood',
            hunger: -40,
            secrecy: -10,
            log: 'The alarm rings! You snatch three blood packs and sprint out the emergency fire exit.'
          }
        }
      ]
    }
  ],
  market: [
    {
      id: 'market_morgana_bazaar',
      title: 'Madam Morgana’s Occult Pavilion',
      speaker: 'Madam Morgana',
      characterId: 'witch',
      locationId: 'market',
      text: "Beneath the Roman aqueducts, purple lanterns sway over stalls of gargoyle talismans, jars of wolfsbane, and ancient papyri. Madam Morgana smiles with ancient purple-painted lips.\n\n'Welcome to the twilight bazaar, creature of the night. What does your fate seek—wealth, secrecy, or protection from the inquisitors?'",
      choices: [
        {
          text: 'Purchase rare Blood Moon Prophecy & Forged ID Papers ($75).',
          req: { type: 'money', target: '', value: 75 },
          consequences: {
            money: -75,
            secrecy: 25,
            trustChange: { charId: 'witch', delta: 20 },
            log: 'Morgana weaves protective glamour around your identity (+25% Secrecy).'
          }
        },
        {
          text: 'Buy an enchanted Shadow Smoke Bomb and Energy Elixir ($60).',
          req: { type: 'money', target: '', value: 60 },
          consequences: {
            money: -60,
            addItem: 'smoke_bomb',
            energy: 40,
            log: 'Morgana packages two forbidden alchemical items into your satchel.'
          }
        },
        {
          text: 'Consult her tarot deck on your chances of surviving Night 100.',
          consequences: {
            energy: 20,
            trustChange: { charId: 'witch', delta: 10 },
            log: 'Morgana draws The Tower and The Blood Monarch: "Great glory awaits you, if the hunger spares you."'
          }
        }
      ]
    }
  ]
};

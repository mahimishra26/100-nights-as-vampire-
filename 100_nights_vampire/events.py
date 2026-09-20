"""
100 Nights as a Vampire - Dynamic Events & Location Encounters
"""

import random
from typing import Dict, List, Any, Optional

def generate_location_event(loc_id: str, player) -> Dict[str, Any]:
    """Generates context-sensitive, dynamic events based on location, night, and player stats."""
    night = player.night
    secrecy = player.secrecy
    hunger = player.hunger

    # Check for critical danger events first if secrecy is blown
    if secrecy <= 30 and random.random() < 0.4:
        return {
            "event_id": f"hunter_ambush_{loc_id}",
            "title": "HUNTER RAID: The Dragnet Closes In",
            "speaker": "Inquisitor Strike Team",
            "character_id": "hunter",
            "location_id": loc_id,
            "text": (
                f"Your low secrecy ({secrecy}%) has borne bitter fruit! Armed vigilantes and inquisitors "
                f"burst through the perimeter of {loc_id.capitalize()}, blinding you with magnesium searchlights "
                "and chambering silver-tipped hollowpoints!"
            ),
            "choices": [
                {
                    "text": "Stand your ground and fight off the hunter ambush!",
                    "req": None,
                    "consequences": {
                        "combat": "hunter_patrol",
                        "log": "You bare your fangs and clash with the armed squad!"
                    }
                },
                {
                    "text": "Detonate a Shadow Smoke Bomb to escape cleanly.",
                    "req": ("item", "smoke_bomb", 1),
                    "consequences": {
                        "use_item": "smoke_bomb",
                        "secrecy": +15,
                        "log": "Shadow smoke blankets the avenue, allowing you to scale the rooftops undetected."
                    }
                },
                {
                    "text": "Dash through the crossfire using Superhuman Speed (-15 Energy).",
                    "req": ("ability", "superhuman_speed", 1),
                    "energy_cost": 15,
                    "consequences": {
                        "take_damage": 12,
                        "secrecy": +5,
                        "log": "A bullet grazes your arm (-12 HP), but you outrun the patrol into the subway."
                    }
                }
            ]
        }

    # Location specific event pools
    if loc_id == "mansion":
        events = [
            {
                "event_id": "mansion_valerius_lesson",
                "title": "Lord Valerius's Private Study",
                "speaker": "Lord Valerius",
                "character_id": "mentor",
                "text": (
                    "Fire crackles in the marble hearth. Lord Valerius looks up from an illuminated 14th-century codex. "
                    "'Come, fledgling. A true vampire does not rely merely on beastly fangs; we wield the subtle arts "
                    "of the mind and the blood. How do you find your thirst tonight?'"
                ),
                "choices": [
                    {
                        "text": "Listen to his lecture on controlling the blood frenzy (+Energy & Trust).",
                        "req": None,
                        "consequences": {
                            "energy": +30,
                            "trust_mentor": +15,
                            "hunger": -10,
                            "log": "Valerius shares refined meditation techniques, soothing your burning thirst."
                        }
                    },
                    {
                        "text": "Ask him about the origins of your sire and the coming Blood Moon.",
                        "req": None,
                        "consequences": {
                            "trust_mentor": +10,
                            "story_flag": ("knows_enemy_identity", True),
                            "log": "Valerius sighs, revealing that an ancient shadow coven manipulated your mortal lineage."
                        }
                    },
                    {
                        "text": "Rest undisturbed in the warded obsidian coffin (-Hunger penalty, +Full HP).",
                        "req": None,
                        "consequences": {
                            "heal": 50,
                            "energy": +40,
                            "secrecy": +5,
                            "log": "Deep restorative slumber behind heavy wards completely revitalizes your body."
                        }
                    }
                ]
            },
            {
                "event_id": "mansion_secret_vault",
                "title": "The Forgotten Wine Cellar",
                "speaker": "Mansion Echoes",
                "character_id": "mentor",
                "text": (
                    "Beneath the servant quarters, you discover a hidden flagstone door marked with ancient lunar crests. "
                    "Dusty vintage bottles and old jewel lockboxes rest in the alcoves."
                ),
                "choices": [
                    {
                        "text": "Use Night Vision to inspect the locked chest for booby-traps.",
                        "req": ("ability", "night_vision", 1),
                        "energy_cost": 10,
                        "consequences": {
                            "money": +120,
                            "add_item": "aristocrat_wine",
                            "log": "You bypass a silver spring-trap, acquiring vintage blood-wine and $120."
                        }
                    },
                    {
                        "text": "Force the lock with raw supernatural strength.",
                        "req": None,
                        "consequences": {
                            "money": +70,
                            "take_damage": 10,
                            "log": "The silver needle trap stings your hand (-10 HP), but you scavenge $70."
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "downtown":
        events = [
            {
                "event_id": "downtown_stranger_feed",
                "title": "Midnight In the Gaslit Alley",
                "speaker": "Drunk Gambler",
                "character_id": "mysterious_human",
                "text": (
                    "A wealthy gambler stumbles out of an illegal underground casino, counting a thick roll of hundred-dollar bills. "
                    "His pulse thrums loudly in his carotid artery, smelling sweet and intoxicating."
                ),
                "choices": [
                    {
                        "text": "Use Hypnotic Gaze to gently feed and erase his memories.",
                        "req": ("ability", "hypnosis", 1),
                        "energy_cost": 20,
                        "consequences": {
                            "hunger": -45,
                            "secrecy": +5,
                            "money": +80,
                            "log": "You drink peacefully and lift part of his winnings without alerting anyone."
                        }
                    },
                    {
                        "text": "Pickpocket his wallet discreetly from the shadows without feeding.",
                        "req": None,
                        "consequences": {
                            "money": +110,
                            "secrecy": +5,
                            "log": "Your cold fingers lift $110 from his jacket as he stumbles past."
                        }
                    },
                    {
                        "text": "Ambush him brutally in the dead end and gorge your thirst!",
                        "req": None,
                        "consequences": {
                            "hunger": -70,
                            "energy": +30,
                            "secrecy": -18,
                            "money": +150,
                            "log": "You feed ravenously! Sated, but the screams alert nearby street patrols."
                        }
                    }
                ]
            },
            {
                "event_id": "downtown_sarah_meeting",
                "title": "A Familiar Voice in the Rain",
                "speaker": "Sarah Jenkins",
                "character_id": "human_friend",
                "text": (
                    "You step under a street awning and nearly bump into Sarah, your closest friend from your human life. "
                    "She drops her umbrella, staring at your pale complexion and shaded eyes. "
                    "'It really is you... where have you been for all these weeks? People said you disappeared!'"
                ),
                "choices": [
                    {
                        "text": "Assure her you are safe, but must stay hidden to protect her.",
                        "req": None,
                        "consequences": {
                            "trust_human_friend": +25,
                            "secrecy": +10,
                            "log": "Sarah tears up and promises never to reveal your whereabouts to anyone."
                        }
                    },
                    {
                        "text": "Gift her a protective talisman and $50 for her medical debts.",
                        "req": ("money", 50),
                        "consequences": {
                            "money": -50,
                            "trust_human_friend": +35,
                            "log": "Sarah is deeply moved by your care, strengthening your anchor to mortal humanity."
                        }
                    },
                    {
                        "text": "Coldly push her away: 'The person you knew is dead. Never seek me out again.'",
                        "req": None,
                        "consequences": {
                            "trust_human_friend": -30,
                            "secrecy": +20,
                            "log": "Sarah weeps and flees into the rain. You preserve secrecy at the cost of your heart."
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "graveyard":
        events = [
            {
                "event_id": "graveyard_witch_altar",
                "title": "The Crypt of the Pale Maiden",
                "speaker": "Madam Morgana",
                "character_id": "witch",
                "text": (
                    "Candles burn with eerie blue flames atop an open sarcophagus. Madam Morgana is grinding raven feathers "
                    "and grave dust in a stone mortar. 'Ah, the fledgling child of the moon,' she murmurs without turning. "
                    "'The stars whisper of your hundredth night. The blood moon draws nigh. Shall we barter?'"
                ),
                "choices": [
                    {
                        "text": "Trade $60 for an occult Shadow Smoke Bomb and fortune reading.",
                        "req": ("money", 60),
                        "consequences": {
                            "money": -60,
                            "add_item": "smoke_bomb",
                            "trust_witch": +20,
                            "log": "Morgana hands you a smoke bomb and warns: 'Beware the silver in the church.'"
                        }
                    },
                    {
                        "text": "Use Night Vision to discover an ancient burial chest in the catacombs.",
                        "req": ("ability", "night_vision", 1),
                        "energy_cost": 10,
                        "consequences": {
                            "money": +95,
                            "add_item": "crypt_key",
                            "log": "You locate an Obsidian Crypt Key and $95 buried beneath mossy flagstones."
                        }
                    },
                    {
                        "text": "Confront a roaming feral ghoul that lunges from an open tomb!",
                        "req": None,
                        "consequences": {
                            "combat": "feral_ghoul",
                            "log": "A starving undead ghoul shrieks and attacks!"
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "academy":
        events = [
            {
                "event_id": "academy_elena_archives",
                "title": "The Restricted Occult Archives",
                "speaker": "Elena Vance",
                "character_id": "mysterious_human",
                "text": (
                    "Surrounded by towering oak bookshelves and brass astrolabes, Elena Vance is cross-referencing "
                    "an alchemical manuscript with lunar calendar charts. "
                    "'Look at these readings,' she whispers excitedly. 'Every 500 years, the Blood Moon aligns with "
                    "the eclipse. It can either grant immortal apotheosis... or purge the undead curse entirely.'"
                ),
                "choices": [
                    {
                        "text": "Help her translate the Latin runes using your vampire memories.",
                        "req": None,
                        "consequences": {
                            "trust_mysterious_human": +25,
                            "energy": +15,
                            "story_flag": ("knows_blood_moon_secret", True),
                            "log": "Elena smiles brightly, noting how your bloodline holds the cipher to the ritual."
                        }
                    },
                    {
                        "text": "Steal an alchemical Vitality Elixir from the laboratory cabinet.",
                        "req": None,
                        "consequences": {
                            "add_item": "energy_tonic",
                            "trust_mysterious_human": -10,
                            "log": "You pocket a glowing draught while Elena's back is turned."
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "nightclub":
        events = [
            {
                "event_id": "nightclub_velvet_encounter",
                "title": "Velvet Lounge Intrigues",
                "speaker": "Queen's Emissary",
                "character_id": "queen",
                "text": (
                    "Heavy bass vibrates the velvet-draped walls. Scent of perfume, alcohol, and warm blood fills the air. "
                    "A masked courtier approaches your booth with an engraved invitation sealed in black wax: "
                    "'Her Majesty Queen Morvath observes your progression. She expects a tribute of loyalty.'"
                ),
                "choices": [
                    {
                        "text": "Pledge $100 to the Queen's treasury to bolster your standing.",
                        "req": ("money", 100),
                        "consequences": {
                            "money": -100,
                            "trust_queen": +30,
                            "log": "The courtier bows deeply, granting you the Queen's favor in territorial disputes."
                        }
                    },
                    {
                        "text": "Charm a VIP mortal in the private lounge for a discreet feast.",
                        "req": ("ability", "vampire_charm", 1),
                        "energy_cost": 15,
                        "consequences": {
                            "hunger": -55,
                            "secrecy": +5,
                            "money": +75,
                            "log": "You seduce a wealthy patron, drinking your fill without a trace of suspicion."
                        }
                    },
                    {
                        "text": "Engage Julian's enforcers trying to intimidate your patrons.",
                        "req": None,
                        "consequences": {
                            "combat": "rival_enforcer",
                            "log": "You smash Julian's lieutenant across the mahogany bar!"
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "forest":
        events = [
            {
                "event_id": "forest_werewolf_alpha",
                "title": "The Ashwood Boundary Line",
                "speaker": "Gerald the Gray Mane",
                "character_id": "werewolf",
                "text": (
                    "Thick mist weaves through ancient hemlocks. A thunderous roar shakes the pine needles. "
                    "Gerald, seven feet of gray fur and scarred muscle, steps onto a granite boulder above you. "
                    "'Leech. You step into our hunting grounds. Give me one good reason not to rip your throat out.'"
                ),
                "choices": [
                    {
                        "text": "Speak with dignity and offer a mutual pact against the hunter inquisition.",
                        "req": None,
                        "consequences": {
                            "trust_werewolf": +25,
                            "secrecy": +10,
                            "log": "Gerald studies your eyes. 'Fair words. Keep the hunters out of my woods, and we won't hunt you.'"
                        }
                    },
                    {
                        "text": "Use Superhuman Speed to dodge his pounce and assert dominance!",
                        "req": ("ability", "superhuman_speed", 2),
                        "energy_cost": 20,
                        "consequences": {
                            "trust_werewolf": +35,
                            "log": "You flash behind Gerald with razor fangs at his jugular, then step back. The wolves howl with respect."
                        }
                    },
                    {
                        "text": "Fight for survival against the Ashwood Pack!",
                        "req": None,
                        "consequences": {
                            "combat": "werewolf",
                            "trust_werewolf": -40,
                            "log": "Claws clash with fangs in the misty grove!"
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "church":
        events = [
            {
                "event_id": "church_inquisitor_cache",
                "title": "The Desecrated Altar",
                "speaker": "Inquisitor Notes",
                "character_id": "hunter",
                "text": (
                    "Shafts of moonlight pierce broken stained-glass saints. In the crypt beneath the altar, "
                    "the hunters have stored weapon crates, holy vials, and surveillance manifests."
                ),
                "choices": [
                    {
                        "text": "Raid the weapons cache for a Silver Moon Amulet and burn their surveillance files.",
                        "req": None,
                        "consequences": {
                            "add_item": "silver_amulet",
                            "secrecy": +25,
                            "take_damage": 15,
                            "log": "Holy residue burns your flesh (-15 HP), but you claim a Silver Amulet and destroy evidence."
                        }
                    },
                    {
                        "text": "Use Shadow Step to slip past the holy wards without injury.",
                        "req": ("ability", "shadow_teleportation", 1),
                        "energy_cost": 25,
                        "consequences": {
                            "add_item": "silver_amulet",
                            "secrecy": +25,
                            "money": +80,
                            "log": "Shadow Step teleports you across the warded threshold, bypassing the holy burn completely!"
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "hospital":
        events = [
            {
                "event_id": "hospital_blood_vault",
                "title": "Cold Storage: Hematology Wing",
                "speaker": "Hospital Intercom",
                "character_id": "mysterious_human",
                "text": (
                    "The hum of industrial refrigeration echoes down the sterile corridor. "
                    "Behind a glass security keypad lie hundreds of sterile O-negative blood bags. "
                    "A night security guard is doing his rounds with a flashlight."
                ),
                "choices": [
                    {
                        "text": "Hypnotize the guard to unlock the refrigerated vault for you.",
                        "req": ("ability", "hypnosis", 1),
                        "energy_cost": 20,
                        "consequences": {
                            "add_item": "preserved_blood",
                            "hunger": -40,
                            "secrecy": +10,
                            "log": "The guard blinks drowsily, hands you chilled blood bags, and forgets you were ever here."
                        }
                    },
                    {
                        "text": "Bribe the orderly with $50 to turn a blind eye.",
                        "req": ("money", 50),
                        "consequences": {
                            "money": -50,
                            "add_item": "preserved_blood",
                            "hunger": -40,
                            "log": "The orderly takes your cash and leaves a cooler of sterile blood packs outside."
                        }
                    },
                    {
                        "text": "Shatter the glass door and make a smash-and-grab!",
                        "req": None,
                        "consequences": {
                            "add_item": "preserved_blood",
                            "hunger": -60,
                            "secrecy": -20,
                            "log": "Alarms scream! You grab blood packs and dive through a second-story window (-20 Secrecy)."
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    elif loc_id == "market":
        events = [
            {
                "event_id": "market_subterranean_bazaar",
                "title": "The Catacomb Bazaar of Shadows",
                "speaker": "Madam Morgana & Ghoul Merchant",
                "character_id": "witch",
                "text": (
                    "Torches soaked in pitch illuminate stalls carved from Roman sewer stone. "
                    "Merchants sell rare elixirs, smuggled blood, and stolen documents under the protection of the Witch coven."
                ),
                "choices": [
                    {
                        "text": "Purchase Preserved Blood Bags ($60).",
                        "req": ("money", 60),
                        "consequences": {
                            "money": -60,
                            "add_item": "preserved_blood",
                            "log": "You acquire clean, top-grade preserved blood packs."
                        }
                    },
                    {
                        "text": "Purchase a Moonlit Draught (+40 Energy) for $40.",
                        "req": ("money", 40),
                        "consequences": {
                            "money": -40,
                            "add_item": "energy_tonic",
                            "log": "You buy a glowing lunar draught."
                        }
                    },
                    {
                        "text": "Use Vampiric Allure to negotiate a 50% discount on rare goods.",
                        "req": ("ability", "vampire_charm", 1),
                        "energy_cost": 15,
                        "consequences": {
                            "add_item": "smoke_bomb",
                            "money": +30,
                            "trust_witch": +15,
                            "log": "Your supernatural charm enchants the shopkeeper into giving you free supplies!"
                        }
                    }
                ]
            }
        ]
        return random.choice(events)

    # Fallback generic event
    return {
        "event_id": "generic_night_roam",
        "title": f"Night Prowl in {loc_id.capitalize()}",
        "speaker": "Nocturnal Shadows",
        "character_id": "mentor",
        "text": f"You prowl through {loc_id.capitalize()}. The fog is thick and cold. Night {night} weighs heavily on your immortal shoulders.",
        "choices": [
            {
                "text": "Hunt for rodents and stray animals to quietly ease thirst.",
                "req": None,
                "consequences": {
                    "hunger": -20,
                    "energy": +15,
                    "log": "You catch vermin in the dark, curbing the worst of the thirst."
                }
            },
            {
                "text": "Scavenge abandoned alleys for dropped cash and discarded supplies.",
                "req": None,
                "consequences": {
                    "money": +45,
                    "log": "You find $45 in an abandoned coat behind a dumpster."
                }
            }
        ]
    }

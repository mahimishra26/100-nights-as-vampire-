"""
100 Nights as a Vampire - Story Arcs, Milestones & Endings
"""

from typing import Dict, Any, List, Optional

class StoryManager:
    @staticmethod
    def get_milestone_event(night: int) -> Optional[Dict[str, Any]]:
        """Returns major narrative event for milestone nights: 25, 50, 75, 100."""
        if night == 25:
            return {
                "event_id": "milestone_night_25",
                "title": "NIGHT 25: The Scent of Silver",
                "speaker": "Detective Jonathan Cross",
                "character_id": "hunter",
                "image_code": "church",
                "text": (
                    "Rain hammers against the chapel gargoyles. As you step out of the shadows, "
                    "a blinding magnesium flare ignites! Detective Cross steps forward, holding a silver revolver "
                    "and a dossier with your mortal photographs.\n\n"
                    "'I know what you are,' Cross growls, his voice rasping. 'And I know who sired you. "
                    "You didn't become a parasite by accident. You were chosen because of your rare lunar bloodline. "
                    "Walk away with me now and help me bring down the Obsidian Court, or die where you stand.'"
                ),
                "choices": [
                    {
                        "text": "Offer an uneasy truce: 'I don't kill innocents, Cross. We share enemies.'",
                        "req": None,
                        "consequences": {
                            "trust_hunter": +30,
                            "secrecy": +15,
                            "story_flag": ("cross_allied", True),
                            "log": "Cross lowers his revolver slightly. A secret pact between hunter and fledgling is forged."
                        }
                    },
                    {
                        "text": "Use Hypnotic Gaze to disorient him and vanish into the storm.",
                        "req": ("ability", "hypnosis", 1),
                        "energy_cost": 25,
                        "consequences": {
                            "secrecy": +10,
                            "trust_hunter": -10,
                            "log": "Your crimson gaze shatters his focus. You melt into the rainy alleys before he fires."
                        }
                    },
                    {
                        "text": "Draw your claws and fight for your immortal survival!",
                        "req": None,
                        "consequences": {
                            "combat": "inquisitor",
                            "trust_hunter": -40,
                            "log": "Gunfire echoes through the gothic courtyard!"
                        }
                    }
                ]
            }

        elif night == 50:
            return {
                "event_id": "milestone_night_50",
                "title": "NIGHT 50: The Betrayal at the Velvet Veil",
                "speaker": "Julian Blackwood",
                "character_id": "rival",
                "image_code": "nightclub",
                "text": (
                    "Tonight marks half of your hundred nights. Inside the lavish VIP balcony of the Velvet Veil, "
                    "Julian Blackwood raises a crystal goblet of blood-wine with a cold smirk. "
                    "Behind him stand four armored enforcers with silenced submachine guns.\n\n"
                    "'Did you truly believe Lord Valerius took you in out of paternal charity?' Julian sneers. "
                    "'Your veins carry the Eclipse Key. On the 100th night of the Blood Moon, the Sovereign requires "
                    "your heart to awaken. But I intend to claim that throne first. Hand over your blood, fledgling.'"
                ),
                "choices": [
                    {
                        "text": "Unleash Superhuman Speed and turn the tables on Julian's thugs!",
                        "req": ("ability", "superhuman_speed", 1),
                        "energy_cost": 20,
                        "consequences": {
                            "combat": "rival_enforcer",
                            "trust_rival": -50,
                            "story_flag": ("knows_blood_moon_secret", True),
                            "log": "You blitz through the guards, shattering the chandeliers in a hurricane of glass!"
                        }
                    },
                    {
                        "text": "Charm his bodyguard to switch allegiances with Vampiric Allure.",
                        "req": ("ability", "vampire_charm", 2),
                        "energy_cost": 25,
                        "consequences": {
                            "money": +150,
                            "trust_rival": -30,
                            "story_flag": ("knows_blood_moon_secret", True),
                            "log": "Julian's top lieutenant turns his weapon on Julian! Julian retreats in fury, leaving his purse."
                        }
                    },
                    {
                        "text": "Melt into the shadows and escape to warn Lord Valerius.",
                        "req": None,
                        "consequences": {
                            "trust_mentor": +20,
                            "trust_rival": -20,
                            "story_flag": ("knows_blood_moon_secret", True),
                            "log": "You leap off the balcony into the dark river below, surfacing to warn your mentor."
                        }
                    }
                ]
            }

        elif night == 75:
            return {
                "event_id": "milestone_night_75",
                "title": "NIGHT 75: The Grand Inquisitor Crusade",
                "speaker": "Lord Valerius & Gerald the Werewolf",
                "character_id": "mentor",
                "image_code": "forest",
                "text": (
                    "Air sirens wail across the metropolitan skyline. The Inquisition has declared martial law. "
                    "Ultraviolet spotlights sweep across rooftops while search helicopters buzz like metal hornets. "
                    "In the deep Ashwood glade, Lord Valerius and Gerald the Alpha stand back-to-back in an uneasy summit.\n\n"
                    "'The purge has begun,' Valerius says grimly. 'If the supernatural covens cannot unite tonight, "
                    "the inquisitors will burn every haven to ash before the Blood Moon rises.'\n"
                    "Gerald snarls, 'The wolves will fight, fledgling... but only if you prove your loyalty to the earth.'"
                ),
                "choices": [
                    {
                        "text": "Broker an ancient Blood Alliance between the Werewolves and Vampires.",
                        "req": None,
                        "consequences": {
                            "trust_werewolf": +40,
                            "trust_mentor": +30,
                            "secrecy": +25,
                            "log": "You cut your palms together over the runic altar. The wolf pack and vampire court unite!"
                        }
                    },
                    {
                        "text": "Convince Detective Cross to sabotage the inquisitors' ultraviolet grid from within.",
                        "req": ("trust", "hunter", 40),
                        "consequences": {
                            "trust_hunter": +25,
                            "secrecy": +40,
                            "money": +100,
                            "log": "Cross cuts the city power transformers! The hunters are blinded in the darkness."
                        }
                    },
                    {
                        "text": "Transform into a bat swarm and lead the hunters on a diversion away from the sanctuary.",
                        "req": ("ability", "bat_transformation", 1),
                        "energy_cost": 30,
                        "consequences": {
                            "secrecy": +30,
                            "trust_mentor": +35,
                            "log": "You lure three military squads into the winding sewers, buying the coven precious days."
                        }
                    }
                ]
            }

        elif night == 100:
            return {
                "event_id": "milestone_night_100",
                "title": "NIGHT 100: The Blood Moon Ascendant",
                "speaker": "The Eclipse Sovereign & Queen Morvath",
                "character_id": "queen",
                "image_code": "mansion",
                "text": (
                    "THE HUNDREDTH NIGHT HAS COME.\n\n"
                    "The moon has turned into a giant weeping eye of celestial blood. The clouds burn crimson. "
                    "At the apex of the Blackwood Spire, the ancient seal has shattered, revealing the primordial "
                    "Eclipse Sovereign. All your choices, your humanity, your alliances, and your survival across "
                    "a hundred dark nights have converged here.\n\n"
                    "The Sovereign raises an obsidian sceptre: 'Bear of the Eclipse Blood! You have survived the trials. "
                    "Will you kneel and rule the world in eternal night, or will you defy the First Vampire?'"
                ),
                "choices": [
                    {
                        "text": "Engage the Eclipse Sovereign in the Final Battle of Immortality!",
                        "req": None,
                        "consequences": {
                            "combat": "eclipse_sovereign",
                            "log": "You charge the ancient deity with all the fury of your 100 nights of survival!"
                        }
                    },
                    {
                        "text": "Use the Witch's Ancient Runes to cleanse the Blood Moon curse forever.",
                        "req": ("trust", "witch", 60),
                        "consequences": {
                            "trigger_ending": "redemption",
                            "log": "Ancient lunar runes erupt in golden dawn light, dissolving the celestial curse!"
                        }
                    },
                    {
                        "text": "Seize the Eclipse Sceptre and claim dominion as the new Vampire Monarch!",
                        "req": ("trust", "queen", 60),
                        "consequences": {
                            "trigger_ending": "vampire_ruler",
                            "log": "You take the blood throne beside the Queen, sovereign of all creatures of the night."
                        }
                    },
                    {
                        "text": "Flee into the night with your mortal companion, forsaking the throne forever.",
                        "req": ("trust", "human_friend", 70),
                        "consequences": {
                            "trigger_ending": "human_love",
                            "log": "Turning your back on immortal glory, you take Sarah's hand and vanish into the sunrise."
                        }
                    }
                ]
            }

        return None

    @staticmethod
    def evaluate_ending(player) -> Dict[str, str]:
        """Determine ending based on stats, story flags, and relationships."""
        # 1. Check if died or executed
        if player.health <= 0:
            return {
                "id": "death_in_battle",
                "title": "💀 Defeated Ending: Dust in the Wind",
                "badge": "DEAD",
                "description": (
                    "Your immortal life was extinguished before reaching the hundredth dawn. "
                    "The vampire court forgets the fallen, and your ashes were swept into the gutter by the autumn wind."
                )
            }
            
        if player.secrecy <= 0:
            return {
                "id": "inquisition_execution",
                "title": "💀 Defeated Ending: Ash at Sunrise",
                "badge": "EXPOSED",
                "description": (
                    "Your lack of discretion brought the full weight of the mortal inquisition upon your haven. "
                    "Bound in silver chains, you greeted the merciless light of the midday sun."
                )
            }
            
        if player.hunger >= 100:
            return {
                "id": "feral_beast",
                "title": "💀 Defeated Ending: Mindless Ghoul",
                "badge": "FERAL",
                "description": (
                    "The thirst overcame your human mind entirely. You surrendered reason to the beast, "
                    "roaming sewer tunnels as a ravenous monster until fellow vampires put you down like a rabid hound."
                )
            }

        # Successful 100 Night Survived Endings:
        # Check high dark lord status (many kills, low humanity, max power)
        if player.story_flags.get("innocents_killed", 0) >= 5 and player.abilities["superhuman_speed"].level >= 2:
            return {
                "id": "dark_lord",
                "title": "🌑 Dark Lord Ending: Sovereign of Eternal Night",
                "badge": "DARK LORD",
                "description": (
                    "Under the weeping Blood Moon, you slaughtered the Eclipse Sovereign and drank the ancient core dry. "
                    "Mortals and vampires alike now cower before your obsidian throne. The world enters a new epoch of shadow."
                )
            }

        # Check Human Love / Humanity ending
        human_trust = player.characters["human_friend"].trust
        elena_trust = player.characters["mysterious_human"].trust
        if human_trust >= 75 or elena_trust >= 75:
            return {
                "id": "human_love",
                "title": "❤️ Human Love Ending: The Twilight Refuge",
                "badge": "HUMAN LOVE",
                "description": (
                    "Despite becoming a creature of the dark, you guarded your mortal heart through all 100 nights. "
                    "Rejecting the bloody politics of the court, you retreated to a quiet coastal sanctuary, living "
                    "peacefully alongside those you cherish."
                )
            }

        # Check Redemption / Purge ending
        hunter_trust = player.characters["hunter"].trust
        if hunter_trust >= 65 and player.story_flags.get("cross_allied", False):
            return {
                "id": "redemption",
                "title": "🌅 Redemption Ending: The Dawn Cleanser",
                "badge": "REDEMPTION",
                "description": (
                    "Partnering with Detective Cross and the occult witches, you dismantled the tyrannical elder covens "
                    "and secured a modern truce between humanity and the nocturnal realm. You walk the line between both worlds."
                )
            }

        # Check Vampire Queen / King ending
        queen_trust = player.characters["queen"].trust
        mentor_trust = player.characters["mentor"].trust
        if queen_trust >= 65 or mentor_trust >= 80:
            return {
                "id": "vampire_ruler",
                "title": "👑 Vampire Monarch Ending: Master of the Court",
                "badge": "VAMPIRE MONARCH",
                "description": (
                    "Through cunning diplomacy, lethal grace, and ancient alliances, you climbed to the apex of the "
                    "Nocturnal Court. As the Blood Moon fades, lords and ladies of the night kneel to kiss your ring."
                )
            }

        # Default standard 100 night survival
        return {
            "id": "eternal_vampire",
            "title": "🦇 Eternal Vampire Ending: The Midnight Wanderer",
            "badge": "ETERNAL VAMPIRE",
            "description": (
                "You survived the hundred nights of trial, emerging as a seasoned predator of the urban shadows. "
                "Unbound by court oaths or human ties, you vanish into the fog of the century ahead, an eternal legend of the dark."
            )
        }

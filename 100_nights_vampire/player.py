"""
100 Nights as a Vampire - Player State & Vital Management
"""

from typing import Dict, Any, Optional
from settings import (
    DEFAULT_HEALTH, DEFAULT_HUNGER, DEFAULT_SECRECY, DEFAULT_ENERGY, DEFAULT_MONEY, MAX_NIGHTS
)
from inventory import Inventory
from abilities import create_default_abilities, Ability
from characters import create_default_characters, Character

class Player:
    def __init__(self):
        # Primary Vitals
        self.health: int = DEFAULT_HEALTH
        self.max_health: int = 100
        
        self.hunger: int = DEFAULT_HUNGER     # 0 = Gorged, 100 = Starving frenzy
        self.secrecy: int = DEFAULT_SECRECY   # 100 = Undetected shadow, 0 = Publicly hunted
        self.energy: int = DEFAULT_ENERGY     # Spent on abilities and nocturnal actions
        self.max_energy: int = 100
        
        self.money: int = DEFAULT_MONEY
        self.night: int = 1
        
        # Sub-systems
        self.inventory: Inventory = Inventory()
        self.abilities: Dict[str, Ability] = create_default_abilities()
        # Unlock initial superhuman speed level 1
        self.abilities["superhuman_speed"].level = 1
        
        self.characters: Dict[str, Character] = create_default_characters()
        
        # Narrative and World State
        self.story_flags: Dict[str, Any] = {
            "sire_revealed": False,
            "blood_pact_signed": False,
            "knows_enemy_identity": False,
            "knows_blood_moon_secret": False,
            "cross_allied": False,
            "rival_defeated": False,
            "humanity_saved": True,
            "unlocked_locations": [
                "mansion", "downtown", "graveyard", "academy", "nightclub"
            ],
            "feed_count": 0,
            "innocents_killed": 0,
            "milestones_completed": []
        }
        
        # Current turn log
        self.last_log: str = "Awakened as an immortal. You have 100 nights until the Blood Moon."

    def heal(self, amount: int) -> int:
        old = self.health
        self.health = min(self.max_health, self.health + amount)
        return self.health - old

    def take_damage(self, amount: int) -> int:
        # Silver amulet damage reduction
        if self.inventory.has_item("silver_amulet"):
            amount = max(1, int(amount * 0.9))
        self.health = max(0, self.health - amount)
        return amount

    def spend_energy(self, amount: int) -> bool:
        if self.energy >= amount:
            self.energy -= amount
            return True
        return False

    def restore_energy(self, amount: int) -> int:
        old = self.energy
        self.energy = min(self.max_energy, self.energy + amount)
        return self.energy - old

    def feed(self, method: str) -> str:
        """
        Feed using various methods:
        - 'rats': low hunger drop, 0 secrecy penalty
        - 'bag': moderate hunger drop, costs money/items
        - 'stealth_mortal': large hunger drop, small risk to secrecy
        - 'violent_drain': massive hunger drop + energy surge, high secrecy penalty
        """
        self.story_flags["feed_count"] += 1
        if method == "rats":
            self.hunger = max(0, self.hunger - 20)
            self.restore_energy(10)
            return "You hunt alleys for vermin. It tastes foul, but quenches the burning thirst somewhat (-20 Hunger)."
        
        elif method == "bag":
            if self.inventory.remove_item("preserved_blood", 1):
                self.hunger = max(0, self.hunger - 45)
                self.heal(15)
                self.restore_energy(25)
                return "You uncap a chilled bag of sterile blood. Clean, safe, and soothing (-45 Hunger, +15 HP)."
            elif self.inventory.remove_item("rat_blood", 1):
                self.hunger = max(0, self.hunger - 20)
                return "You drink a preserved vial of animal blood (-20 Hunger)."
            else:
                return "You have no blood bags in your satchel!"

        elif method == "stealth_mortal":
            charm_bonus = self.abilities["vampire_charm"].level * 5
            self.hunger = max(0, self.hunger - 50)
            self.restore_energy(35)
            # Secrecy risk reduced if charm or hypnosis
            penalty = max(2, 12 - charm_bonus)
            self.secrecy = max(0, self.secrecy - penalty)
            return f"You gently mesmerize a lone reveller in the alley and take a modest sip. (-50 Hunger, -{penalty} Secrecy)."

        elif method == "violent_drain":
            self.hunger = 0
            self.restore_energy(60)
            self.heal(30)
            self.secrecy = max(0, self.secrecy - 30)
            self.story_flags["innocents_killed"] += 1
            return "You succumb to bestial fury and completely drain your prey dry! Sated completely, but authorities find the corpse (-30 Secrecy!)."

        return "Unknown feeding method."

    def advance_night(self) -> Dict[str, Any]:
        """Progress to next night with hunger escalation, regen, and state checks."""
        self.night += 1
        
        # Natural nightly hunger increase
        hunger_tick = 15
        self.hunger = min(100, self.hunger + hunger_tick)
        
        # Natural energy rest
        self.energy = min(self.max_energy, self.energy + 35)

        consequences = []
        
        # Starvation penalties
        if self.hunger >= 90:
            dmg = 20
            self.take_damage(dmg)
            consequences.append(f"STARVATION FRENZY: Your throat burns like molten lead! Took {dmg} damage from starvation.")
        elif self.hunger >= 75:
            dmg = 10
            self.take_damage(dmg)
            consequences.append(f"Ravenous Thirst: High hunger drains your vitality (-{dmg} HP).")

        # Secrecy breakdown penalties
        if self.secrecy <= 15:
            consequences.append("CRITICAL EXPOSURE: Inquisitors and hunter kill-teams are actively scouring your known havens!")
        elif self.secrecy <= 35:
            consequences.append("High Exposure: Vigilantes and police sketches of you are circulating Downtown.")

        # Unlock new locations as nights advance
        if self.night >= 5 and "forest" not in self.story_flags["unlocked_locations"]:
            self.story_flags["unlocked_locations"].append("forest")
            consequences.append("Unlocked new location: The Dark Forest.")
            
        if self.night >= 10 and "church" not in self.story_flags["unlocked_locations"]:
            self.story_flags["unlocked_locations"].append("church")
            consequences.append("Unlocked new location: Abandoned Church.")
            
        if self.night >= 15 and "hospital" not in self.story_flags["unlocked_locations"]:
            self.story_flags["unlocked_locations"].append("hospital")
            consequences.append("Unlocked new location: City Hospital.")

        if self.night >= 20 and "market" not in self.story_flags["unlocked_locations"]:
            self.story_flags["unlocked_locations"].append("market")
            consequences.append("Unlocked new location: Underground Vampire Market.")

        return {
            "night": self.night,
            "consequences": consequences
        }

    def check_game_over(self) -> Optional[str]:
        """Returns game over reason string or None."""
        if self.health <= 0:
            return "DEAD: Your undead heart has ceased to beat. Reduced to ash and scattered into the night."
        if self.secrecy <= 0:
            return "EXPOSED & EXECUTED: An inquisitor strike force ambushed your haven at noon. The sun was your executioner."
        if self.hunger >= 100:
            return "LOST CONTROL (FERAL): The beast consumed your mind entirely. You are now a mindless rabid ghoul hunted down by your own kind."
        return None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "health": self.health,
            "max_health": self.max_health,
            "hunger": self.hunger,
            "secrecy": self.secrecy,
            "energy": self.energy,
            "max_energy": self.max_energy,
            "money": self.money,
            "night": self.night,
            "inventory": self.inventory.to_dict(),
            "abilities": {k: v.to_dict() for k, v in self.abilities.items()},
            "characters": {k: v.to_dict() for k, v in self.characters.items()},
            "story_flags": self.story_flags,
            "last_log": self.last_log
        }

    def load_from_dict(self, data: Dict[str, Any]):
        self.health = data.get("health", DEFAULT_HEALTH)
        self.max_health = data.get("max_health", 100)
        self.hunger = data.get("hunger", DEFAULT_HUNGER)
        self.secrecy = data.get("secrecy", DEFAULT_SECRECY)
        self.energy = data.get("energy", DEFAULT_ENERGY)
        self.max_energy = data.get("max_energy", 100)
        self.money = data.get("money", DEFAULT_MONEY)
        self.night = data.get("night", 1)
        self.last_log = data.get("last_log", "Welcome back into the darkness.")
        
        if "inventory" in data:
            self.inventory.load_from_dict(data["inventory"])
            
        if "abilities" in data:
            for k, v in data["abilities"].items():
                if k in self.abilities:
                    self.abilities[k].load_from_dict(v)
                    
        if "characters" in data:
            for k, v in data["characters"].items():
                if k in self.characters:
                    self.characters[k].load_from_dict(v)
                    
        if "story_flags" in data:
            self.story_flags = data["story_flags"]

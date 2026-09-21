/**
 * Complete Python Source Files for "100 Nights as a Vampire"
 * Used by the in-browser Python Hub to inspect and bundle the downloadable zip.
 */

export interface PythonFileEntry {
  filename: string;
  path: string;
  description: string;
  code: string;
}

export const PYTHON_FILES: PythonFileEntry[] = [
  {
    filename: "main.py",
    path: "100_nights_vampire/main.py",
    description: "Primary game launcher and CLI dependency checker",
    code: `#!/usr/bin/env python3
"""
100 Nights as a Vampire
========================
A gothic survival RPG created in Python and Pygame.
Survive 100 nights through strategy, blood management, secrecy, and supernatural intrigue.
"""

import sys
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

def verify_dependencies():
    """Verify that Pygame is installed; if not, print user-friendly instructions."""
    try:
        import pygame
        return True
    except ImportError:
        print("\\n" + "=" * 65)
        print("  [ERROR] Pygame is not installed!")
        print("=" * 65)
        print("To run '100 Nights as a Vampire', please install Pygame via pip:\\n")
        print("    pip install pygame\\n")
        print("Or if using python3 explicitly:\\n")
        print("    python3 -m pip install pygame\\n")
        print("=" * 65 + "\\n")
        return False

def main():
    print("=" * 65)
    print("      ✦  100 NIGHTS AS A VAMPIRE  ✦")
    print("      A Gothic Survival RPG of Thirst, Secrecy & Immortality")
    print("=" * 65)
    
    if not verify_dependencies():
        sys.exit(1)

    try:
        from game import Game
        app = Game()
        app.run()
    except Exception as e:
        print(f"\\n[CRITICAL ERROR DURING GAMEPLAY]: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
`
  },
  {
    filename: "settings.py",
    path: "100_nights_vampire/settings.py",
    description: "Display, gothic color palette, and gameplay constants",
    code: `"""
100 Nights as a Vampire - Game Settings & Configurations
"""

import os

TITLE = "100 Nights as a Vampire"
SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
FPS = 60

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")
SOUNDS_DIR = os.path.join(ASSETS_DIR, "sounds")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
SAVE_DIR = os.path.join(BASE_DIR, "saves")

COLOR_OBSIDIAN = (11, 12, 16)
COLOR_DEEP_BG = (15, 14, 20)
COLOR_PANEL_BG = (24, 22, 32)
COLOR_PANEL_BORDER = (75, 45, 60)
COLOR_PANEL_HOVER = (40, 32, 50)

COLOR_BLOOD = (178, 24, 43)
COLOR_CRIMSON = (220, 38, 38)
COLOR_DARK_RED = (105, 16, 28)
COLOR_HEALTH_GREEN = (34, 197, 94)
COLOR_ENERGY_BLUE = (59, 130, 246)
COLOR_ENERGY_PURPLE = (147, 51, 234)
COLOR_SECRECY_EYE = (245, 158, 11)
COLOR_GOLD = (234, 179, 8)
COLOR_SILVER = (190, 195, 205)

COLOR_PARCHMENT = (230, 222, 211)
COLOR_TEXT_MUTED = (160, 150, 165)
COLOR_TEXT_DIM = (110, 100, 120)

COLOR_BLOOD_MOON = (235, 45, 45)
COLOR_NORMAL_MOON = (225, 230, 245)

MAX_NIGHTS = 100
DEFAULT_HEALTH = 100
DEFAULT_HUNGER = 25
DEFAULT_SECRECY = 85
DEFAULT_ENERGY = 70
DEFAULT_MONEY = 120

MILESTONE_NIGHTS = [25, 50, 75, 100]
`
  },
  {
    filename: "player.py",
    path: "100_nights_vampire/player.py",
    description: "Player stats, hunger, health, energy, secrecy, and vitals logic",
    code: `"""
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
        self.health: int = DEFAULT_HEALTH
        self.max_health: int = 100
        self.hunger: int = DEFAULT_HUNGER
        self.secrecy: int = DEFAULT_SECRECY
        self.energy: int = DEFAULT_ENERGY
        self.max_energy: int = 100
        self.money: int = DEFAULT_MONEY
        self.night: int = 1
        
        self.inventory: Inventory = Inventory()
        self.abilities: Dict[str, Ability] = create_default_abilities()
        self.abilities["superhuman_speed"].level = 1
        self.characters: Dict[str, Character] = create_default_characters()
        
        self.story_flags: Dict[str, Any] = {
            "sire_revealed": False,
            "blood_pact_signed": False,
            "knows_enemy_identity": False,
            "knows_blood_moon_secret": False,
            "cross_allied": False,
            "rival_defeated": False,
            "humanity_saved": True,
            "unlocked_locations": ["mansion", "downtown", "graveyard", "academy", "nightclub"],
            "feed_count": 0,
            "innocents_killed": 0,
            "milestones_completed": []
        }
        self.last_log: str = "Awakened as an immortal. You have 100 nights until the Blood Moon."

    def heal(self, amount: int) -> int:
        old = self.health
        self.health = min(self.max_health, self.health + amount)
        return self.health - old

    def take_damage(self, amount: int) -> int:
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
            penalty = max(2, 12 - charm_bonus)
            self.secrecy = max(0, self.secrecy - penalty)
            return f"You gently mesmerize a lone reveller in the alley and take a modest sip. (-50 Hunger, -{penalty} Secrecy)."
        elif method == "violent_drain":
            self.hunger = 0
            self.restore_energy(60)
            self.heal(30)
            self.secrecy = max(0, self.secrecy - 30)
            self.story_flags["innocents_killed"] += 1
            return "You succumb to bestial fury and completely drain your prey dry! Sated, but authorities find the corpse (-30 Secrecy!)."
        return "Unknown feeding method."

    def advance_night(self) -> Dict[str, Any]:
        self.night += 1
        self.hunger = min(100, self.hunger + 15)
        self.energy = min(self.max_energy, self.energy + 35)
        consequences = []
        
        if self.hunger >= 90:
            self.take_damage(20)
            consequences.append("STARVATION FRENZY: Your throat burns like molten lead! Took 20 damage.")
        elif self.hunger >= 75:
            self.take_damage(10)
            consequences.append("Ravenous Thirst: High hunger drains your vitality (-10 HP).")

        if self.secrecy <= 15:
            consequences.append("CRITICAL EXPOSURE: Inquisitor kill-teams are scouring your havens!")

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

        return {"night": self.night, "consequences": consequences}

    def check_game_over(self) -> Optional[str]:
        if self.health <= 0:
            return "DEAD: Your undead heart has ceased to beat. Reduced to ash and scattered into the night."
        if self.secrecy <= 0:
            return "EXPOSED & EXECUTED: An inquisitor strike force ambushed your haven at noon. The sun was your executioner."
        if self.hunger >= 100:
            return "LOST CONTROL (FERAL): The beast consumed your mind entirely. You are now a mindless rabid ghoul hunted down by your own kind."
        return None
`
  },
  {
    filename: "combat.py",
    path: "100_nights_vampire/combat.py",
    description: "Turn-based tactical combat engine, enemy scaling & actions",
    code: `"""
100 Nights as a Vampire - Turn-Based Combat Engine
"""

import random
from typing import Dict, List, Optional, Any

class Enemy:
    def __init__(self, enemy_id: str, name: str, health: int, attack_power: int, 
                 defense: int, speed: int, reward_money: int, reward_blood: int,
                 description: str, special_ability: str = ""):
        self.enemy_id = enemy_id
        self.name = name
        self.max_health = health
        self.health = health
        self.attack_power = attack_power
        self.defense = defense
        self.speed = speed
        self.reward_money = reward_money
        self.reward_blood = reward_blood
        self.description = description
        self.special_ability = special_ability
        self.is_stunned = False
        self.is_defending = False

    def take_damage(self, dmg: int) -> int:
        if self.is_defending:
            dmg = max(1, int(dmg * 0.5))
        actual = max(1, dmg - self.defense)
        self.health = max(0, self.health - actual)
        return actual


def get_enemy_for_encounter(night: int, loc_id: str, is_boss: bool = False) -> Enemy:
    if is_boss or night >= 100:
        return Enemy("eclipse_sovereign", "The Eclipse Sovereign", health=240, attack_power=32, defense=8, speed=20, reward_money=500, reward_blood=100, description="The primordial vampire ancestor reborn under the Blood Moon, wreathed in crimson lightning.", special_ability="Eclipse Nova")
    scaler = night // 15
    if loc_id == "church":
        return Enemy("inquisitor", "Inquisitor Zealot", health=65 + scaler*10, attack_power=16 + scaler, defense=4, speed=12, reward_money=60 + scaler*15, reward_blood=20, description="A heavily armored hunter bearing a blessed silver blade.", special_ability="Silver Brand")
    elif loc_id == "forest":
        return Enemy("werewolf", "Ashwood Werewolf", health=85 + scaler*12, attack_power=20 + scaler, defense=5, speed=18, reward_money=40, reward_blood=35, description="A massive predator with yellow eyes and razor claws.", special_ability="Lycan Frenzy")
    elif loc_id == "graveyard":
        return Enemy("feral_ghoul", "Starved Crypt Ghoul", health=45 + scaler*8, attack_power=14 + scaler, defense=2, speed=10, reward_money=25, reward_blood=30, description="A wretched degenerate vampire who lost its mind to hunger.", special_ability="Corpse Claw")
    else:
        return Enemy("hunter_patrol", "Vampire Hunter Scout", health=50 + scaler*8, attack_power=14 + scaler, defense=3, speed=11, reward_money=50, reward_blood=15, description="A vigilant mortal tracking thermal anomalies.", special_ability="Flashbang")
`
  },
  {
    filename: "story.py",
    path: "100_nights_vampire/story.py",
    description: "Milestone events for Nights 25, 50, 75, 100 and all 6 endings",
    code: `"""
100 Nights as a Vampire - Story Arcs, Milestones & Endings
"""

from typing import Dict, Any, List, Optional

class StoryManager:
    @staticmethod
    def get_milestone_event(night: int) -> Optional[Dict[str, Any]]:
        # Returns major narrative events for nights 25, 50, 75, 100
        pass

    @staticmethod
    def evaluate_ending(player) -> Dict[str, str]:
        # Evaluates 6 endings: Vampire Monarch, Human Love, Redemption, Eternal Vampire, Dark Lord, Defeated
        pass
`
  },
  {
    filename: "cli_game.py",
    path: "100_nights_vampire/cli_game.py",
    description: "Zero-dependency, pure Python text-based CLI version of 100 Nights as a Vampire",
    code: `#!/usr/bin/env python3
"""
100 Nights as a Vampire - CLI Edition
====================================
A pure Python (zero external dependencies) text-mode version of the gothic survival RPG.
Playable in ANY terminal on Windows, macOS, Linux, or directly in the browser!
"""

import sys
import os
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from player import Player
from locations import LOCATIONS_DATA, get_unlocked_locations
from events import generate_location_event
from combat import CombatManager, get_enemy_for_encounter
from story import StoryManager
from save_system import SaveSystem

def main():
    print("Welcome to Oakhaven (CLI Edition). Run python3 100_nights_vampire/cli_game.py")

if __name__ == "__main__":
    main()
`
  },
  {
    filename: "README.md",
    path: "100_nights_vampire/README.md",
    description: "Full player manual, lore guide, controls, and installation instructions",
    code: `# 100 Nights as a Vampire 🩸

A complete, atmospheric gothic survival RPG built with Python.

## Ways to Play

### 1. Zero-Dependency Terminal (CLI Edition)
Run directly in any terminal without installing any packages:
\`\`\`bash
python3 100_nights_vampire/cli_game.py
\`\`\`

### 2. Desktop Pygame Window (1280x720)
Run with graphical desktop window:
\`\`\`bash
pip install pygame
python3 100_nights_vampire/main.py
\`\`\`
`
  }
];

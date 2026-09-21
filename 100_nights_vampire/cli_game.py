#!/usr/bin/env python3
"""
100 Nights as a Vampire - CLI Edition
====================================
A pure Python (zero external dependencies) text-mode version of the gothic survival RPG.
Playable in ANY terminal on Windows, macOS, Linux, or directly in the browser!
"""

import sys
import os
import random

# Ensure package path is on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from player import Player
from locations import LOCATIONS_DATA, get_unlocked_locations
from events import generate_location_event
from combat import CombatManager, get_enemy_for_encounter
from story import StoryManager
from save_system import SaveSystem

# Terminal ANSI color codes
CLR_RESET = "\033[0m"
CLR_BOLD = "\033[1m"
CLR_RED = "\033[31m"
CLR_BLOOD = "\033[38;5;196m"
CLR_GREEN = "\033[32m"
CLR_YELLOW = "\033[33m"
CLR_GOLD = "\033[38;5;220m"
CLR_BLUE = "\033[34m"
CLR_MAGENTA = "\033[35m"
CLR_CYAN = "\033[36m"
CLR_GRAY = "\033[90m"
CLR_WHITE = "\033[97m"

def print_banner():
    banner = f"""{CLR_BLOOD}
   ██╗  ██████╗  ██████╗     ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗███████╗
  ███║ ██╔═████╗██╔═████╗    ████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝
  ╚██║ ██║██╔██║██║██╔██║    ██╔██╗ ██║██║██║  ███╗███████║   ██║   ███████╗
   ██║ ████╔╝██║████╔╝██║    ██║╚██╗██║██║██║   ██║██╔══██║   ██║   ╚════██║
   ██║ ╚██████╔╝╚██████╔╝    ██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ███████║
   ╚═╝  ╚═════╝  ╚═════╝     ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                     {CLR_RED}✦  AS A VAMPIRE (CLI EDITION)  ✦{CLR_RESET}
          {CLR_GRAY}Survive 100 Nights in the Shadowed Victorian City of Oakhaven{CLR_RESET}
"""
    print(banner)

class CLIGame:
    def __init__(self):
        self.player = Player()
        self.save_system = SaveSystem()
        self.running = True
        self.logs = [
            "Awakened in Oakhaven as an immortal fledgling.",
            "Survive 100 nights through blood management and secrecy."
        ]

    def log(self, text: str):
        self.logs.insert(0, text)
        if len(self.logs) > 6:
            self.logs.pop()

    def print_status(self):
        p = self.player
        h_color = CLR_GREEN if p.health > 50 else (CLR_YELLOW if p.health > 25 else CLR_RED)
        t_color = CLR_GREEN if p.hunger < 50 else (CLR_YELLOW if p.hunger < 75 else CLR_RED)
        s_color = CLR_GREEN if p.secrecy > 60 else (CLR_YELLOW if p.secrecy > 30 else CLR_RED)
        
        moon_phase = "New Moon"
        if p.night == 100:
            moon_phase = f"{CLR_BLOOD}✦ BLOOD MOON ECLIPSE ✦{CLR_RESET}"
        elif p.night % 10 == 0:
            moon_phase = "Full Moon"
        elif p.night % 5 == 0:
            moon_phase = "Waxing Gibbous"
        else:
            moon_phase = "Crescent Moon"

        print(f"\n{CLR_BOLD}{CLR_MAGENTA}═════════════════════════════════════════════════════════════════════════════════{CLR_RESET}")
        print(f" {CLR_BOLD}{CLR_WHITE}NIGHT {p.night}/100{CLR_RESET}  |  Moon: {moon_phase}  |  Location: {CLR_CYAN}Safehouse Sanctuary{CLR_RESET}")
        print(f"{CLR_MAGENTA}─────────────────────────────────────────────────────────────────────────────────{CLR_RESET}")
        print(f"  ❤️  Health:  {h_color}{p.health}/{p.max_health}{CLR_RESET}   |  🩸 Thirst:  {t_color}{p.hunger}/100{CLR_RESET}   |  🕵️  Secrecy: {s_color}{p.secrecy}%{CLR_RESET}")
        print(f"  ⚡ Energy:  {CLR_CYAN}{p.energy}/{p.max_energy}{CLR_RESET}  |  💰 Money:   {CLR_GOLD}${p.money}{CLR_RESET}    |  Satchel:  {CLR_WHITE}{len(p.inventory.items)} item types{CLR_RESET}")
        print(f"{CLR_MAGENTA}═════════════════════════════════════════════════════════════════════════════════{CLR_RESET}")
        
        if self.logs:
            print(f"{CLR_GRAY}Latest Event: {self.logs[0]}{CLR_RESET}")

    def check_game_over(self) -> bool:
        if self.player.health <= 0:
            print(f"\n{CLR_BLOOD}{CLR_BOLD}[MORTAL DISSOLUTION - GAME OVER]{CLR_RESET}")
            print(f"{CLR_RED}Your undead flesh dissolves into gray ash upon the cobblestones. Forgotten forever.{CLR_RESET}")
            return True
        if self.player.secrecy <= 0:
            print(f"\n{CLR_BLOOD}{CLR_BOLD}[INQUISITION EXECUTION - GAME OVER]{CLR_RESET}")
            print(f"{CLR_RED}Detective Cross discovered your sanctuary at dawn. The morning sun burns you to cinder.{CLR_RESET}")
            return True
        if self.player.hunger >= 100:
            print(f"\n{CLR_BLOOD}{CLR_BOLD}[FERAL DEVOLUTION - GAME OVER]{CLR_RESET}")
            print(f"{CLR_RED}The ravenous thirst consumed your mind. You rampaged as a feral beast until put down.{CLR_RESET}")
            return True
        return False

    def handle_feed(self):
        print(f"\n{CLR_BOLD}{CLR_RED}🩸 NOCTURNAL FEEDING OPTIONS{CLR_RESET}")
        print(f"  [1] Hunt Vermin in Damp Alleys        (-20 Thirst, +10 Energy, 0 Secrecy Risk)")
        print(f"  [2] Drink from Chilled Blood Pack     (-45 Thirst, +15 HP, Requires Pack)")
        print(f"  [3] Mesmerize Solitary Reveller       (-50 Thirst, +35 Energy, -5-10% Secrecy)")
        print(f"  [4] Violent Exsanguination (Drain dry)(-100 Thirst, +60 Energy, -30% Secrecy)")
        print(f"  [0] Back to Sanctuary")
        
        choice = input(f"{CLR_BOLD}Select feeding method > {CLR_RESET}").strip()
        if choice == "1":
            res = self.player.feed("rats")
            self.log(res)
            print(f"\n{CLR_GREEN}{res}{CLR_RESET}")
        elif choice == "2":
            res = self.player.feed("bag")
            self.log(res)
            print(f"\n{CLR_GREEN}{res}{CLR_RESET}")
        elif choice == "3":
            res = self.player.feed("stealth_mortal")
            self.log(res)
            print(f"\n{CLR_GREEN}{res}{CLR_RESET}")
        elif choice == "4":
            res = self.player.feed("violent_drain")
            self.log(res)
            print(f"\n{CLR_RED}{res}{CLR_RESET}")

    def handle_explore(self):
        unlocked = get_unlocked_locations(self.player.night)
        print(f"\n{CLR_BOLD}{CLR_CYAN}🏰 SELECT A GOTHIC DESTINATION TO EXPLORE{CLR_RESET}")
        
        loc_keys = list(LOCATIONS_DATA.keys())
        for idx, key in enumerate(loc_keys, start=1):
            loc = LOCATIONS_DATA[key]
            is_unlocked = key in unlocked
            if is_unlocked:
                status = f"{CLR_GREEN}Unlocked (Danger: {'★'*loc.danger_level}){CLR_RESET}"
                print(f"  [{idx}] {CLR_BOLD}{loc.name}{CLR_RESET} - {loc.subtitle} [{status}]")
            else:
                print(f"  [{idx}] {CLR_GRAY}{loc.name} (Locked - Unlocks Night {idx*3}){CLR_RESET}")
        print("  [0] Return to Sanctuary")

        choice = input(f"{CLR_BOLD}Choose location number > {CLR_RESET}").strip()
        try:
            val = int(choice)
            if val == 0:
                return
            if 1 <= val <= len(loc_keys):
                chosen_key = loc_keys[val - 1]
                if chosen_key not in unlocked:
                    print(f"{CLR_RED}That district is currently locked.{CLR_RESET}")
                    return
                self.run_location_encounter(chosen_key)
        except ValueError:
            print(f"{CLR_RED}Invalid input.{CLR_RESET}")

    def run_location_encounter(self, loc_id: str):
        loc = LOCATIONS_DATA[loc_id]
        print(f"\n{CLR_BOLD}{CLR_MAGENTA}Travelling to {loc.name}...{CLR_RESET}")
        
        # Check ambush
        is_ambush = (self.player.secrecy <= 35 and random.random() < 0.45) or (random.random() < 0.25 and loc.danger_level >= 3)
        if is_ambush:
            enemy = get_enemy_for_encounter(self.player.night, loc_id)
            print(f"\n{CLR_BLOOD}{CLR_BOLD}⚠️  AMBUSHED BY {enemy.name.upper()}!{CLR_RESET}")
            print(f"{CLR_RED}{enemy.description}{CLR_RESET}")
            self.run_combat(enemy)
            self.end_night()
            return

        # Generate event
        event = generate_location_event(loc_id, self.player)
        print(f"\n{CLR_BOLD}{CLR_GOLD}✦ {event['title']} ✦{CLR_RESET}")
        print(f"{CLR_CYAN}Speaker: {event.get('speaker', loc.name)}{CLR_RESET}")
        print(f"\n{event['text']}\n")

        print(f"{CLR_BOLD}Your choices:{CLR_RESET}")
        choices = event.get("choices", [])
        for i, ch in enumerate(choices, start=1):
            req_text = ""
            if "req" in ch and ch["req"]:
                r = ch["req"]
                req_text = f" {CLR_YELLOW}(Requires {r['target']} Lv.{r['value']}){CLR_RESET}"
            cost_text = ""
            if "energy_cost" in ch and ch["energy_cost"] > 0:
                cost_text = f" {CLR_CYAN}(-{ch['energy_cost']}⚡){CLR_RESET}"
            print(f"  [{i}] {ch['text']}{req_text}{cost_text}")

        choice_input = input(f"{CLR_BOLD}What will you do? [1-{len(choices)}] > {CLR_RESET}").strip()
        try:
            c_idx = int(choice_input) - 1
            if 0 <= c_idx < len(choices):
                chosen = choices[c_idx]
                self.resolve_event_choice(chosen)
                self.end_night()
            else:
                print(f"{CLR_RED}Defaulting to cautious retreat.{CLR_RESET}")
                self.end_night()
        except ValueError:
            self.end_night()

    def resolve_event_choice(self, choice: dict):
        cons = choice.get("consequences", {})
        
        # Stat changes
        if "hunger" in cons:
            self.player.hunger = max(0, min(100, self.player.hunger + cons["hunger"]))
        if "secrecy" in cons:
            self.player.secrecy = max(0, min(100, self.player.secrecy + cons["secrecy"]))
        if "energy" in cons:
            self.player.energy = max(0, min(self.player.max_energy, self.player.energy + cons["energy"]))
        if "money" in cons:
            self.player.money = max(0, self.player.money + cons["money"])
        if "heal" in cons:
            self.player.health = min(self.player.max_health, self.player.health + cons["heal"])
        if "take_damage" in cons:
            self.player.health = max(0, self.player.health - cons["take_damage"])
        if "add_item" in cons:
            self.player.inventory.add_item(cons["add_item"], 1)

        # Trust
        if "trust_change" in cons:
            tc = cons["trust_change"]
            char = self.player.characters.get(tc["char_id"])
            if char:
                msg = char.modify_trust(tc["delta"], "Event Choice")
                print(f"{CLR_MAGENTA}{msg}{CLR_RESET}")

        # Combat trigger
        if "combat" in cons and cons["combat"]:
            enemy = get_enemy_for_encounter(self.player.night, "mansion")
            self.run_combat(enemy)

        # Log
        log_msg = cons.get("log", "Exploration concluded.")
        print(f"\n{CLR_GREEN}Outcome: {log_msg}{CLR_RESET}")
        self.log(log_msg)

    def run_combat(self, enemy):
        mgr = CombatManager(self.player, enemy)
        print(f"\n{CLR_BOLD}{CLR_RED}⚔️  BATTLE INITIATED vs {enemy.name}{CLR_RESET}")
        
        while not mgr.is_over:
            print(f"\n{CLR_CYAN}Player: {self.player.health}/{self.player.max_health} HP | Energy: {self.player.energy}⚡{CLR_RESET}")
            print(f"{CLR_RED}{enemy.name}: {enemy.health}/{enemy.max_health} HP{CLR_RESET}")
            print("  [1] Claw Slash        (Normal physical strike)")
            print("  [2] Fang Drain        (Suck blood: heals HP, satiates thirst)")
            print("  [3] Vampire Defense   (Reduce incoming damage by 50%)")
            print("  [4] Speed Blitz       (Fast strike with superhuman reflexes, -15⚡)")
            print("  [5] Flee into Mist    (Attempt escape)")

            act = input(f"{CLR_BOLD}Choose action > {CLR_RESET}").strip()
            if act == "1":
                mgr.player_attack()
            elif act == "2":
                mgr.player_drain()
            elif act == "3":
                mgr.player_defend()
            elif act == "4":
                mgr.player_speed_strike()
            elif act == "5":
                escaped = mgr.player_flee()
                if escaped:
                    print(f"{CLR_YELLOW}You dissolve into mist and escape!{CLR_RESET}")
                    break
            else:
                mgr.player_attack()

            # Print latest combat logs
            for l in mgr.combat_logs[-2:]:
                print(f"  {CLR_GRAY}{l}{CLR_RESET}")

        if mgr.player_won:
            print(f"\n{CLR_GREEN}{CLR_BOLD}🏆 VICTORY! You defeated {enemy.name}!{CLR_RESET}")
            print(f"{CLR_GOLD}+${enemy.reward_money} Looted  |  -20 Thirst from enemy blood{CLR_RESET}")
            self.player.money += enemy.reward_money
            self.player.hunger = max(0, self.player.hunger - 20)

    def handle_abilities(self):
        print(f"\n{CLR_BOLD}{CLR_MAGENTA}⚡ VAMPIRIC DISCIPLINES{CLR_RESET}")
        abs_list = list(self.player.abilities.values())
        for i, ab in enumerate(abs_list, start=1):
            cost_str = f"${ab.upgrade_cost}" if ab.level < ab.max_level else "MAXED"
            print(f"  [{i}] {CLR_BOLD}{ab.name}{CLR_RESET} (Lv.{ab.level}/{ab.max_level}) - Upgrade Cost: {CLR_GOLD}{cost_str}{CLR_RESET}")
            print(f"      {CLR_GRAY}{ab.description}{CLR_RESET}")
        print("  [0] Back")

        choice = input(f"{CLR_BOLD}Select ability to upgrade > {CLR_RESET}").strip()
        try:
            val = int(choice)
            if val == 0:
                return
            if 1 <= val <= len(abs_list):
                target_ab = abs_list[val - 1]
                if target_ab.upgrade(self.player):
                    print(f"{CLR_GREEN}Successfully upgraded {target_ab.name} to Level {target_ab.level}!{CLR_RESET}")
                else:
                    print(f"{CLR_RED}Cannot upgrade (insufficient funds or max level).{CLR_RESET}")
        except ValueError:
            pass

    def handle_inventory(self):
        print(f"\n{CLR_BOLD}{CLR_YELLOW}🎒 SATCHEL & INVENTORY{CLR_RESET}")
        items = list(self.player.inventory.items.values())
        if not items:
            print(f"{CLR_GRAY}Your satchel is empty.{CLR_RESET}")
        else:
            for i, it in enumerate(items, start=1):
                print(f"  [{i}] {CLR_BOLD}{it.name}{CLR_RESET} (Qty: {it.quantity}) - {it.description}")
        print("  [0] Back")

        choice = input(f"{CLR_BOLD}Select item number to consume > {CLR_RESET}").strip()
        try:
            val = int(choice)
            if val == 0:
                return
            if 1 <= val <= len(items):
                it = items[val - 1]
                res = self.player.inventory.use_item(it.item_id, self.player)
                print(f"{CLR_GREEN}{res}{CLR_RESET}")
                self.log(res)
        except ValueError:
            pass

    def handle_relationships(self):
        print(f"\n{CLR_BOLD}{CLR_CYAN}🤝 ALLIANCES & NPCS{CLR_RESET}")
        for char in self.player.characters.values():
            status_clr = CLR_GREEN if char.trust >= 60 else (CLR_YELLOW if char.trust >= 30 else CLR_RED)
            print(f"  • {CLR_BOLD}{char.name}{CLR_RESET} ({char.title})")
            print(f"    Trust: {status_clr}{char.trust}/100 ({char.status}){CLR_RESET} - {char.description[:65]}...")
        input(f"\n{CLR_GRAY}Press Enter to return...{CLR_RESET}")

    def end_night(self):
        self.player.night += 1
        self.player.hunger = min(100, self.player.hunger + 15)
        self.player.energy = min(self.player.max_energy, self.player.energy + 35)

        if self.player.hunger >= 90:
            self.player.health = max(0, self.player.health - 20)
            print(f"\n{CLR_BLOOD}⚠️  STARVATION FRENZY: The ravenous thirst tore at your undead body (-20 HP)!{CLR_RESET}")
        elif self.player.hunger >= 75:
            self.player.health = max(0, self.player.health - 10)
            print(f"\n{CLR_YELLOW}⚠️  Severe Hunger: Weakened focus (-10 HP).{CLR_RESET}")

        print(f"\n{CLR_GOLD}Dawn breaks over Oakhaven. You retreat into your sanctuary. Night {self.player.night} begins.{CLR_RESET}")
        
        # Check Milestones
        milestone = StoryManager.get_milestone_event(self.player.night)
        if milestone:
            print(f"\n{CLR_BLOOD}{CLR_BOLD}✦ MILESTONE CONFRONTATION: NIGHT {self.player.night} ✦{CLR_RESET}")
            print(f"{CLR_WHITE}{milestone['title']}{CLR_RESET}")
            print(f"{milestone['text']}\n")
            for i, c in enumerate(milestone['choices'], start=1):
                print(f"  [{i}] {c['text']}")
            m_input = input(f"{CLR_BOLD}Choose your path > {CLR_RESET}").strip()
            try:
                idx = int(m_input) - 1
                if 0 <= idx < len(milestone['choices']):
                    self.resolve_event_choice(milestone['choices'][idx])
            except ValueError:
                pass

    def run(self):
        print_banner()
        print(f"{CLR_CYAN}Welcome to Oakhaven. 100 nights of survival await.{CLR_RESET}")
        
        while self.running:
            if self.check_game_over():
                break

            if self.player.night > 100:
                print(f"\n{CLR_GOLD}{CLR_BOLD}👑 SURVIVED 100 NIGHTS AS A VAMPIRE!{CLR_RESET}")
                print(f"{CLR_GREEN}You have endured the trial of the Blood Moon and ascended as a master of the night.{CLR_RESET}")
                break

            self.print_status()
            print(f"\n{CLR_BOLD}Night Actions:{CLR_RESET}")
            print(f"  [1] 🏰 Explore a Gothic District       [4] 🎒 Open Satchel")
            print(f"  [2] 🩸 Nocturnal Feeding              [5] 🤝 Review Alliances")
            print(f"  [3] ⚡ Upgrade Disciplines            [6] 💾 Save / Load Game")
            print(f"  [7] 🌙 Rest until Dawn (End Night)    [0] ❌ Exit Game")

            cmd = input(f"\n{CLR_BOLD}Enter command [0-7] > {CLR_RESET}").strip()
            if cmd == "1":
                self.handle_explore()
            elif cmd == "2":
                self.handle_feed()
            elif cmd == "3":
                self.handle_abilities()
            elif cmd == "4":
                self.handle_inventory()
            elif cmd == "5":
                self.handle_relationships()
            elif cmd == "6":
                print("\n[1] Save Game  [2] Load Game")
                sl = input("Choice > ").strip()
                if sl == "1":
                    self.save_system.save_game(self.player, slot=1)
                    print(f"{CLR_GREEN}Game saved successfully to slot 1.{CLR_RESET}")
                elif sl == "2":
                    if self.save_system.load_game(self.player, slot=1):
                        print(f"{CLR_GREEN}Game loaded successfully.{CLR_RESET}")
                    else:
                        print(f"{CLR_RED}No save file found in slot 1.{CLR_RESET}")
            elif cmd == "7":
                self.end_night()
            elif cmd == "0":
                print(f"\n{CLR_GRAY}Retreating into the shadows... Farewell.{CLR_RESET}")
                self.running = False

def main():
    game = CLIGame()
    game.run()

if __name__ == "__main__":
    main()

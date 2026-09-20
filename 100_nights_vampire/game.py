"""
100 Nights as a Vampire - Core Game Engine & State Manager
"""

import sys
import math
import random
import pygame
from typing import Dict, List, Optional, Any

from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, FPS, TITLE,
    COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER, COLOR_PANEL_HOVER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED,
    COLOR_HEALTH_GREEN, COLOR_ENERGY_BLUE, COLOR_SECRECY_EYE
)
from player import Player
from locations import LOCATIONS_DATA, Location
from combat import CombatManager, get_enemy_for_encounter
from events import generate_location_event
from story import StoryManager
from save_system import SaveSystem
from ui import UIRenderer, Button

class Game:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption(TITLE)
        self.screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
        self.clock = pygame.time.Clock()
        self.is_running = True

        # Audio init with safe fallback
        self.audio_available = False
        try:
            pygame.mixer.init()
            self.audio_available = True
        except Exception:
            pass

        self.ui = UIRenderer()
        self.save_system = SaveSystem()
        self.player = Player()

        # States: 'MAIN_MENU', 'LOCATION_SELECT', 'EVENT_VIEW', 'COMBAT', 
        #         'INVENTORY', 'ABILITIES', 'RELATIONSHIPS', 'PAUSE', 'GAME_OVER', 'ENDING'
        self.state = "MAIN_MENU"

        # Current active event or combat
        self.current_event: Optional[Dict[str, Any]] = None
        self.combat_mgr: Optional[CombatManager] = None
        self.selected_location: str = "mansion"
        self.ending_data: Optional[Dict[str, str]] = None
        
        # Action buttons for current view
        self.buttons: List[Button] = []
        self._build_main_menu_buttons()

    def play_sound(self, sound_type: str):
        """Placeholder or procedural tone if audio mixer is active."""
        if not self.audio_available:
            return
        # Graceful no-op or procedural tone

    # --- Screen Builders ---
    def _build_main_menu_buttons(self):
        self.buttons.clear()
        cx = SCREEN_WIDTH // 2
        cy = 380
        btn_w = 320
        btn_h = 52
        
        self.buttons.append(Button(
            (cx - btn_w // 2, cy, btn_w, btn_h),
            "AWAKEN IN BLOOD (NEW GAME)",
            callback=self.start_new_game,
            hotkey="N"
        ))
        
        has_save = os_exists = len(self.save_system.list_saved_slots()) > 0
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + 70, btn_w, btn_h),
            "CONTINUE NOCTURNAL JOURNEY",
            callback=self.continue_saved_game,
            enabled=True,
            hotkey="C"
        ))
        
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + 140, btn_w, btn_h),
            "INSTRUCTIONS & LORE",
            callback=self.open_instructions,
            hotkey="I"
        ))
        
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + 210, btn_w, btn_h),
            "EXIT TO THE COFFIN",
            callback=self.exit_game,
            hotkey="Q"
        ))

    def _build_location_select_buttons(self):
        self.buttons.clear()
        
        # Navigation tabs (Top right)
        nav_y = 82
        self.buttons.append(Button((SCREEN_WIDTH - 440, nav_y, 100, 36), "🎒 Satchel", callback=self.open_inventory, hotkey="I"))
        self.buttons.append(Button((SCREEN_WIDTH - 330, nav_y, 100, 36), "⚡ Abilities", callback=self.open_abilities, hotkey="A"))
        self.buttons.append(Button((SCREEN_WIDTH - 220, nav_y, 100, 36), "🤝 Covens", callback=self.open_relationships, hotkey="R"))
        self.buttons.append(Button((SCREEN_WIDTH - 110, nav_y, 90, 36), "⚙️ Pause", callback=self.open_pause_menu, hotkey="P"))

        # Fast Feed actions
        feed_y = 660
        self.buttons.append(Button((30, feed_y, 180, 42), "🐀 Hunt Rats (-20 🩸)", callback=lambda: self.player_feed("rats"), hotkey="1"))
        self.buttons.append(Button((220, feed_y, 220, 42), "🩸 Preserved Pack (-45 🩸)", callback=lambda: self.player_feed("bag"), hotkey="2"))
        self.buttons.append(Button((450, feed_y, 230, 42), "👁️ Seduce Mortal (-50 🩸)", callback=lambda: self.player_feed("stealth_mortal"), hotkey="3"))

        # 9 Interactive Locations grid (3 rows x 3 columns)
        unlocked = self.player.story_flags.get("unlocked_locations", ["mansion", "downtown", "graveyard"])
        start_x = 40
        start_y = 135
        card_w = 380
        card_h = 160
        gap_x = 20
        gap_y = 15
        
        loc_keys = list(LOCATIONS_DATA.keys())
        for idx, key in enumerate(loc_keys):
            row = idx // 3
            col = idx % 3
            rx = start_x + col * (card_w + gap_x)
            ry = start_y + row * (card_h + gap_y)
            loc = LOCATIONS_DATA[key]
            is_unlocked = key in unlocked
            
            def make_loc_cb(loc_id=key):
                return lambda: self.travel_to_location(loc_id)
                
            self.buttons.append(Button(
                (rx, ry, card_w, card_h),
                f"{loc.icon} {loc.name}" if is_unlocked else f"🔒 {loc.name} (Locked)",
                callback=make_loc_cb(key),
                enabled=is_unlocked,
                tag=f"loc_{key}"
            ))

    def _build_event_buttons(self):
        self.buttons.clear()
        if not self.current_event:
            return
            
        choices = self.current_event.get("choices", [])
        start_y = 440
        btn_w = SCREEN_WIDTH - 120
        btn_h = 58
        gap = 14
        
        for idx, c in enumerate(choices):
            # Check requirements
            enabled = True
            req = c.get("req")
            cost_energy = c.get("energy_cost", 0)
            
            if cost_energy > 0 and self.player.energy < cost_energy:
                enabled = False
            if req:
                req_type = req[0]
                if req_type == "ability":
                    ab_id, lvl = req[1], req[2]
                    if self.player.abilities.get(ab_id, None) is None or self.player.abilities[ab_id].level < lvl:
                        enabled = False
                elif req_type == "item":
                    item_id, qty = req[1], req[2]
                    if not self.player.inventory.has_item(item_id, qty):
                        enabled = False
                elif req_type == "money":
                    amt = req[1]
                    if self.player.money < amt:
                        enabled = False
                elif req_type == "trust":
                    char_id, val = req[1], req[2]
                    if self.player.characters.get(char_id, None) is None or self.player.characters[char_id].trust < val:
                        enabled = False

            def make_choice_cb(choice_dict=c):
                return lambda: self.resolve_choice(choice_dict)

            text_display = f"{idx + 1}. {c['text']}"
            if cost_energy > 0:
                text_display += f"  [Cost: {cost_energy}⚡]"
                
            self.buttons.append(Button(
                (60, start_y + idx * (btn_h + gap), btn_w, btn_h),
                text_display,
                callback=make_choice_cb(c),
                enabled=enabled,
                hotkey=str(idx + 1)
            ))

    def _build_combat_buttons(self):
        self.buttons.clear()
        if not self.combat_mgr or self.combat_mgr.is_over:
            self.buttons.append(Button(
                (SCREEN_WIDTH // 2 - 140, 600, 280, 50),
                "CONTINUE INTO THE NIGHT",
                callback=self.finish_combat,
                hotkey=" "
            ))
            return

        cx = 60
        cy = 510
        bw = 280
        bh = 50
        gap_x = 24
        gap_y = 16
        
        # Row 1: Attack, Bite Drain, Defend
        self.buttons.append(Button((cx, cy, bw, bh), "⚔️ Strike with Claws", callback=self.combat_mgr.player_attack, hotkey="1"))
        self.buttons.append(Button((cx + bw + gap_x, cy, bw, bh), "🩸 Vampire Fang Drain", callback=self.combat_mgr.player_bite, hotkey="2"))
        self.buttons.append(Button((cx + (bw + gap_x) * 2, cy, bw, bh), "🛡️ Defend (+15⚡)", callback=self.combat_mgr.player_defend, hotkey="3"))

        # Row 2: Abilities & Items
        ab_speed = self.player.abilities["superhuman_speed"]
        self.buttons.append(Button(
            (cx, cy + bh + gap_y, bw, bh),
            f"⚡ Super Speed ({ab_speed.current_energy_cost}⚡)",
            callback=lambda: self.combat_mgr.player_use_ability("superhuman_speed"),
            enabled=ab_speed.is_unlocked and self.player.energy >= ab_speed.current_energy_cost,
            hotkey="4"
        ))
        
        ab_hyp = self.player.abilities["hypnosis"]
        self.buttons.append(Button(
            (cx + bw + gap_x, cy + bh + gap_y, bw, bh),
            f"👁️ Hypnotize Foe ({ab_hyp.current_energy_cost}⚡)",
            callback=lambda: self.combat_mgr.player_use_ability("hypnosis"),
            enabled=ab_hyp.is_unlocked and self.player.energy >= ab_hyp.current_energy_cost,
            hotkey="5"
        ))
        
        self.buttons.append(Button(
            (cx + (bw + gap_x) * 2, cy + bh + gap_y, bw, bh),
            "💨 Flee / Escape",
            callback=self.combat_mgr.player_escape,
            hotkey="6"
        ))

    # --- Gameplay Actions ---
    def start_new_game(self):
        self.player = Player()
        self.state = "LOCATION_SELECT"
        self._build_location_select_buttons()

    def continue_saved_game(self):
        if self.save_system.load_auto_save(self.player) or self.save_system.load_game(self.player, 1):
            self.state = "LOCATION_SELECT"
            self._build_location_select_buttons()
        else:
            self.start_new_game()

    def open_instructions(self):
        # Displays instructions
        pass

    def exit_game(self):
        self.is_running = False

    def open_inventory(self):
        self.state = "INVENTORY"
        self.buttons.clear()
        self.buttons.append(Button((40, 40, 140, 38), "← Return", callback=self.return_to_map, hotkey="ESC"))
        
        items = self.player.inventory.get_all_items()
        for idx, itm in enumerate(items):
            it_obj = itm["item"]
            qty = itm["quantity"]
            y = 120 + idx * 70
            
            def make_use_cb(item_id=it_obj.item_id):
                return lambda: self.use_satchel_item(item_id)
                
            self.buttons.append(Button(
                (SCREEN_WIDTH - 200, y + 10, 160, 42),
                f"Use ({qty})",
                callback=make_use_cb(it_obj.item_id),
                enabled=it_obj.usable_in_field
            ))

    def use_satchel_item(self, item_id: str):
        from inventory import ITEM_REGISTRY
        item = ITEM_REGISTRY.get(item_id)
        if item and self.player.inventory.has_item(item_id):
            self.player.inventory.remove_item(item_id, 1)
            msg = item.use(self.player)
            self.player.last_log = msg
            self.open_inventory()

    def open_abilities(self):
        self.state = "ABILITIES"
        self.buttons.clear()
        self.buttons.append(Button((40, 40, 140, 38), "← Return", callback=self.return_to_map, hotkey="ESC"))
        
        ab_list = list(self.player.abilities.values())
        for idx, ab in enumerate(ab_list):
            y = 110 + idx * 75
            can_up = (ab.level < ab.max_level) and (self.player.money >= ab.upgrade_cost)
            
            def make_up_cb(ability_obj=ab):
                return lambda: self.upgrade_ability(ability_obj)
                
            btn_txt = f"Upgrade (${ab.upgrade_cost})" if ab.level < ab.max_level else "MASTERED"
            self.buttons.append(Button(
                (SCREEN_WIDTH - 240, y + 12, 200, 45),
                btn_txt,
                callback=make_up_cb(ab),
                enabled=can_up
            ))

    def upgrade_ability(self, ab):
        if ab.upgrade(self.player):
            self.player.last_log = f"Upgraded {ab.name} to Level {ab.level}!"
            self.open_abilities()

    def open_relationships(self):
        self.state = "RELATIONSHIPS"
        self.buttons.clear()
        self.buttons.append(Button((40, 40, 140, 38), "← Return", callback=self.return_to_map, hotkey="ESC"))

    def open_pause_menu(self):
        self.state = "PAUSE"
        self.buttons.clear()
        cx = SCREEN_WIDTH // 2 - 150
        cy = 240
        self.buttons.append(Button((cx, cy, 300, 50), "RESUME NIGHT", callback=self.return_to_map, hotkey="ESC"))
        self.buttons.append(Button((cx, cy + 70, 300, 50), "SAVE GAME TO SLOT 1", callback=self.save_game_action, hotkey="S"))
        self.buttons.append(Button((cx, cy + 140, 300, 50), "MAIN MENU", callback=self.return_to_main_menu, hotkey="M"))

    def save_game_action(self):
        self.save_system.save_game(self.player, 1)
        self.player.last_log = "Game saved to Slot 1."
        self.return_to_map()

    def return_to_main_menu(self):
        self.state = "MAIN_MENU"
        self._build_main_menu_buttons()

    def return_to_map(self):
        self.state = "LOCATION_SELECT"
        self._build_location_select_buttons()

    def player_feed(self, method: str):
        msg = self.player.feed(method)
        self.player.last_log = msg
        self._build_location_select_buttons()

    def travel_to_location(self, loc_id: str):
        self.selected_location = loc_id
        
        # Check story milestones first (Night 25, 50, 75, 100)
        milestone = StoryManager.get_milestone_event(self.player.night)
        if milestone and self.player.night not in self.player.story_flags["milestones_completed"]:
            self.current_event = milestone
            self.player.story_flags["milestones_completed"].append(self.player.night)
        else:
            self.current_event = generate_location_event(loc_id, self.player)

        self.state = "EVENT_VIEW"
        self._build_event_buttons()

    def resolve_choice(self, choice: Dict[str, Any]):
        cons = choice.get("consequences", {})
        
        # Check combat trigger
        if "combat" in cons:
            enemy = get_enemy_for_encounter(self.player.night, self.selected_location, is_boss=(cons["combat"] == "eclipse_sovereign"))
            self.combat_mgr = CombatManager(self.player, enemy)
            self.state = "COMBAT"
            self._build_combat_buttons()
            return

        # Check ending trigger
        if "trigger_ending" in cons:
            self.ending_data = StoryManager.evaluate_ending(self.player)
            self.state = "ENDING"
            self.buttons.clear()
            self.buttons.append(Button((SCREEN_WIDTH // 2 - 140, 580, 280, 50), "PLAY AGAIN", callback=self.start_new_game, hotkey=" "))
            return

        # Apply stat changes
        if "heal" in cons:
            self.player.heal(cons["heal"])
        if "take_damage" in cons:
            self.player.take_damage(cons["take_damage"])
        if "hunger" in cons:
            self.player.hunger = max(0, min(100, self.player.hunger + cons["hunger"]))
        if "secrecy" in cons:
            self.player.secrecy = max(0, min(100, self.player.secrecy + cons["secrecy"]))
        if "energy" in cons:
            self.player.restore_energy(cons["energy"])
        if "money" in cons:
            self.player.money += cons["money"]
            
        # Add item
        if "add_item" in cons:
            self.player.inventory.add_item(cons["add_item"], 1)

        # Modify character trust
        for k, v in cons.items():
            if k.startswith("trust_"):
                char_id = k.replace("trust_", "")
                if char_id in self.player.characters:
                    self.player.characters[char_id].modify_trust(v)

        if "story_flag" in cons:
            flag_name, flag_val = cons["story_flag"]
            self.player.story_flags[flag_name] = flag_val

        if "log" in cons:
            self.player.last_log = cons["log"]

        # Advance night & check game over
        self.advance_to_next_night()

    def advance_to_next_night(self):
        # Auto save
        self.save_system.auto_save(self.player)

        # Check death or exposure
        game_over_reason = self.player.check_game_over()
        if game_over_reason:
            self.ending_data = {
                "id": "game_over",
                "title": "THE CURTAIN FALLS",
                "badge": "GAME OVER",
                "description": game_over_reason
            }
            self.state = "GAME_OVER"
            self.buttons.clear()
            self.buttons.append(Button((SCREEN_WIDTH // 2 - 140, 580, 280, 50), "RESTART FROM ASHES", callback=self.start_new_game, hotkey=" "))
            return

        # Check night 100 reached
        if self.player.night >= 100:
            self.ending_data = StoryManager.evaluate_ending(self.player)
            self.state = "ENDING"
            self.buttons.clear()
            self.buttons.append(Button((SCREEN_WIDTH // 2 - 140, 580, 280, 50), "PLAY AGAIN", callback=self.start_new_game, hotkey=" "))
            return

        # Progress night
        adv = self.player.advance_night()
        self.state = "LOCATION_SELECT"
        self._build_location_select_buttons()

    def finish_combat(self):
        if self.combat_mgr:
            if not self.combat_mgr.player_won and not self.combat_mgr.escaped and self.player.health <= 0:
                self.ending_data = StoryManager.evaluate_ending(self.player)
                self.state = "GAME_OVER"
                self.buttons.clear()
                self.buttons.append(Button((SCREEN_WIDTH // 2 - 140, 580, 280, 50), "RESTART", callback=self.start_new_game, hotkey=" "))
                return
                
        self.advance_to_next_night()

    # --- Main Loop ---
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.is_running = False
                return
                
            # Let active buttons process event
            handled = False
            for btn in self.buttons:
                if btn.handle_event(event):
                    handled = True
                    break
                    
            if not handled and event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    if self.state in ["INVENTORY", "ABILITIES", "RELATIONSHIPS", "PAUSE"]:
                        self.return_to_map()
                    elif self.state == "LOCATION_SELECT":
                        self.open_pause_menu()

    def draw(self):
        self.ui.update()
        
        if self.state == "MAIN_MENU":
            self.draw_main_menu()
        elif self.state == "LOCATION_SELECT":
            self.draw_location_select()
        elif self.state == "EVENT_VIEW":
            self.draw_event_view()
        elif self.state == "COMBAT":
            self.draw_combat_view()
        elif self.state == "INVENTORY":
            self.draw_inventory_view()
        elif self.state == "ABILITIES":
            self.draw_abilities_view()
        elif self.state == "RELATIONSHIPS":
            self.draw_relationships_view()
        elif self.state == "PAUSE":
            self.draw_pause_menu()
        elif self.state in ["GAME_OVER", "ENDING"]:
            self.draw_ending_view()

        # Draw active buttons
        for btn in self.buttons:
            btn.draw(self.screen, self.ui.font_body, self.ui.font_small)

        pygame.display.flip()

    def draw_main_menu(self):
        self.ui.draw_gothic_background(self.screen, 1)
        
        # Grand Gothic Title
        title_surf = self.ui.font_title.render("100 NIGHTS AS A VAMPIRE", True, COLOR_BLOOD)
        t_rect = title_surf.get_rect(center=(SCREEN_WIDTH // 2, 180))
        self.screen.blit(title_surf, t_rect)
        
        sub_surf = self.ui.font_subtitle.render("A Gothic Survival RPG of Thirst, Secrecy & Immortality", True, COLOR_PARCHMENT)
        s_rect = sub_surf.get_rect(center=(SCREEN_WIDTH // 2, 230))
        self.screen.blit(sub_surf, s_rect)

        lore_surf = self.ui.font_small.render("Survive 100 nights until the celestial Blood Moon without burning in the sun or becoming a mindless beast.", True, COLOR_TEXT_MUTED)
        l_rect = lore_surf.get_rect(center=(SCREEN_WIDTH // 2, 275))
        self.screen.blit(lore_surf, l_rect)

    def draw_location_select(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        # Recent Turn Log
        log_box = pygame.Rect(40, 80, SCREEN_WIDTH - 500, 42)
        pygame.draw.rect(self.screen, (16, 14, 20), log_box, border_radius=6)
        pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, log_box, width=1, border_radius=6)
        log_txt = self.ui.font_small.render(f"📜 {self.player.last_log}", True, COLOR_PARCHMENT)
        self.screen.blit(log_txt, (log_box.x + 12, log_box.y + 12))

    def draw_event_view(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        if self.current_event:
            self.ui.draw_dialogue_panel(
                self.screen,
                self.current_event.get("title", "Night Encounter"),
                self.current_event.get("speaker", "Unknown Presence"),
                self.current_event.get("text", "")
            )

    def draw_combat_view(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        if not self.combat_mgr:
            return

        # Enemy Card (Left)
        en_box = pygame.Rect(60, 90, 450, 390)
        pygame.draw.rect(self.screen, (22, 18, 26), en_box, border_radius=8)
        pygame.draw.rect(self.screen, COLOR_CRIMSON, en_box, width=2, border_radius=8)

        en_name = self.ui.font_subtitle.render(f"⚠️ {self.combat_mgr.enemy.name}", True, COLOR_CRIMSON)
        self.screen.blit(en_name, (en_box.x + 20, en_box.y + 20))

        # Enemy Health
        self.ui.draw_stat_bar(
            self.screen, en_box.x + 20, en_box.y + 70, 410, 20,
            self.combat_mgr.enemy.health, self.combat_mgr.enemy.max_health,
            COLOR_HEALTH_GREEN, "Enemy Health", "❤️"
        )

        desc_words = self.combat_mgr.enemy.description.split(" ")
        y_d = en_box.y + 115
        cur_l = []
        for w in desc_words:
            cur_l.append(w)
            if self.ui.font_body.render(" ".join(cur_l), True, COLOR_PARCHMENT).get_width() > 390:
                cur_l.pop()
                self.screen.blit(self.ui.font_body.render(" ".join(cur_l), True, COLOR_PARCHMENT), (en_box.x + 20, y_d))
                y_d += 24
                cur_l = [w]
        if cur_l:
            self.screen.blit(self.ui.font_body.render(" ".join(cur_l), True, COLOR_PARCHMENT), (en_box.x + 20, y_d))

        # Combat Combat Log (Right)
        log_box = pygame.Rect(540, 90, SCREEN_WIDTH - 600, 390)
        pygame.draw.rect(self.screen, (16, 14, 20), log_box, border_radius=8)
        pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, log_box, width=1, border_radius=8)

        l_title = self.ui.font_stats.render("⚔️ COMBAT MANIFEST", True, COLOR_GOLD)
        self.screen.blit(l_title, (log_box.x + 20, log_box.y + 15))
        pygame.draw.line(self.screen, COLOR_PANEL_BORDER, (log_box.x + 20, log_box.y + 40), (log_box.right - 20, log_box.y + 40), 1)

        log_y = log_box.y + 55
        for entry in self.combat_mgr.combat_logs[-11:]:
            col = COLOR_GOLD if "VICTORY" in entry else (COLOR_CRIMSON if "damage" in entry else COLOR_PARCHMENT)
            e_surf = self.ui.font_small.render(f"• {entry}", True, col)
            self.screen.blit(e_surf, (log_box.x + 20, log_y))
            log_y += 28

    def draw_inventory_view(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        title = self.ui.font_title.render("🎒 VAMPIRE SATCHEL & RELICS", True, COLOR_GOLD)
        self.screen.blit(title, (220, 38))

        items = self.player.inventory.get_all_items()
        if not items:
            empty_txt = self.ui.font_subtitle.render("Your satchel is empty.", True, COLOR_TEXT_MUTED)
            self.screen.blit(empty_txt, (SCREEN_WIDTH // 2 - 120, 300))
            return

        for idx, itm in enumerate(items):
            it = itm["item"]
            qty = itm["quantity"]
            y = 120 + idx * 70
            
            box = pygame.Rect(40, y, SCREEN_WIDTH - 80, 60)
            pygame.draw.rect(self.screen, COLOR_PANEL_BG, box, border_radius=6)
            pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, box, width=1, border_radius=6)

            name_txt = self.ui.font_subtitle.render(f"{it.name} (x{qty})", True, COLOR_PARCHMENT)
            self.screen.blit(name_txt, (box.x + 20, box.y + 8))
            
            desc_txt = self.ui.font_small.render(it.description, True, COLOR_TEXT_MUTED)
            self.screen.blit(desc_txt, (box.x + 20, box.y + 36))

    def draw_abilities_view(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        title = self.ui.font_title.render("⚡ VAMPIRE DISCIPLINES & ABILITIES", True, COLOR_GOLD)
        self.screen.blit(title, (220, 38))

        ab_list = list(self.player.abilities.values())
        for idx, ab in enumerate(ab_list):
            y = 110 + idx * 75
            box = pygame.Rect(40, y, SCREEN_WIDTH - 80, 68)
            pygame.draw.rect(self.screen, COLOR_PANEL_BG, box, border_radius=6)
            pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, box, width=1, border_radius=6)

            lvl_str = f"Level {ab.level}/{ab.max_level}" if ab.level > 0 else "LOCKED"
            lvl_col = COLOR_GOLD if ab.level > 0 else COLOR_TEXT_DIM
            name_txt = self.ui.font_stats.render(f"{ab.name}  [{lvl_str}]", True, lvl_col)
            self.screen.blit(name_txt, (box.x + 20, box.y + 10))

            desc_txt = self.ui.font_small.render(f"{ab.description} (Cost: {ab.current_energy_cost}⚡)", True, COLOR_TEXT_MUTED)
            self.screen.blit(desc_txt, (box.x + 20, box.y + 38))

    def draw_relationships_view(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        self.ui.draw_top_nav_bar(self.screen, self.player)

        title = self.ui.font_title.render("🤝 SUPERNATURAL & MORTAL TIES", True, COLOR_GOLD)
        self.screen.blit(title, (220, 38))

        char_list = list(self.player.characters.values())
        start_x = 40
        start_y = 105
        w = (SCREEN_WIDTH - 120) // 2
        h = 135
        
        for idx, ch in enumerate(char_list):
            row = idx // 2
            col = idx % 2
            rx = start_x + col * (w + 40)
            ry = start_y + row * (h + 16)

            box = pygame.Rect(rx, ry, w, h)
            pygame.draw.rect(self.screen, COLOR_PANEL_BG, box, border_radius=8)
            pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, box, width=1, border_radius=8)

            c_name = self.ui.font_stats.render(f"{ch.name} - {ch.title}", True, COLOR_GOLD)
            self.screen.blit(c_name, (box.x + 16, box.y + 12))

            # Status pill
            status_surf = self.ui.font_small.render(f"Status: {ch.status}", True, COLOR_CRIMSON if ch.status == "Hostile" else COLOR_HEALTH_GREEN)
            self.screen.blit(status_surf, (box.x + 16, box.y + 36))

            # Trust bar
            self.ui.draw_stat_bar(self.screen, box.x + 16, box.y + 80, w - 32, 14, ch.trust, 100, COLOR_GOLD, "Trust", "🤝")

    def draw_pause_menu(self):
        self.ui.draw_gothic_background(self.screen, self.player.night)
        
        box = pygame.Rect(SCREEN_WIDTH // 2 - 220, 160, 440, 320)
        pygame.draw.rect(self.screen, (18, 16, 24), box, border_radius=8)
        pygame.draw.rect(self.screen, COLOR_PANEL_BORDER, box, width=2, border_radius=8)

        t = self.ui.font_title.render("PAUSED", True, COLOR_GOLD)
        self.screen.blit(t, (box.x + 150, box.y + 25))

    def draw_ending_view(self):
        self.ui.draw_gothic_background(self.screen, 100)
        
        panel = pygame.Rect(100, 100, SCREEN_WIDTH - 200, 450)
        pygame.draw.rect(self.screen, (16, 14, 22), panel, border_radius=10)
        pygame.draw.rect(self.screen, COLOR_BLOOD, panel, width=2, border_radius=10)

        if not self.ending_data:
            return

        # Title
        t = self.ui.font_title.render(self.ending_data.get("title", "THE FINAL DAWN"), True, COLOR_BLOOD)
        t_r = t.get_rect(center=(SCREEN_WIDTH // 2, panel.y + 60))
        self.screen.blit(t, t_r)

        # Description
        words = self.ending_data.get("description", "").split(" ")
        lines = []
        cur = []
        for w in words:
            cur.append(w)
            if self.ui.font_subtitle.render(" ".join(cur), True, COLOR_PARCHMENT).get_width() > panel.width - 80:
                cur.pop()
                lines.append(" ".join(cur))
                cur = [w]
        if cur:
            lines.append(" ".join(cur))

        dy = panel.y + 140
        for l in lines:
            ls = self.ui.font_subtitle.render(l, True, COLOR_PARCHMENT)
            lr = ls.get_rect(center=(SCREEN_WIDTH // 2, dy))
            self.screen.blit(ls, lr)
            dy += 36

    def run(self):
        while self.is_running:
            self.handle_events()
            self.draw()
            self.clock.tick(FPS)
        pygame.quit()
        sys.exit()


if __name__ == "__main__":
    game = Game()
    game.run()

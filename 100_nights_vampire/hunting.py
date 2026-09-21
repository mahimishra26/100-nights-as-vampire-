"""
100 Nights as a Vampire - Dedicated Hunt & Combat Screen
========================================================
Interactive hunt and combat page featuring encounters with Humans,
Vampire Hunters, Werewolves, Rival Vampires, and Supernatural Creatures.
Commands: Attack, Bite, Hypnotize, Use Ability, Defend, Escape.
"""

import pygame
import random
from typing import List, Callable, Optional, Dict, Any
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED,
    COLOR_HEALTH_GREEN, COLOR_ENERGY_BLUE
)
from combat import CombatManager, Enemy, get_enemy_for_encounter
from ui import Button

class HuntingScreen:
    def __init__(self, player, on_combat_end: Callable[[bool, str], None]):
        self.player = player
        self.on_combat_end = on_combat_end
        self.combat_mgr: Optional[CombatManager] = None
        self.enemy: Optional[Enemy] = None
        self.is_hunting_selection = True

        self.buttons: List[Button] = []
        self._build_selection_buttons()

    def _build_selection_buttons(self):
        self.is_hunting_selection = True
        self.buttons.clear()

        cx = SCREEN_WIDTH // 2
        cy = 200
        btn_w = 420
        btn_h = 56
        gap = 72

        hunting_targets = [
            ("LONE MORTAL IN ALLEYWAY", "Easy prey. Plentiful blood, small money, low risk.", "thug"),
            ("PATROLLING VAMPIRE HUNTER", "Armored inquisitor with silver blade. High danger, high secrecy risk.", "hunter"),
            ("PROWLING ASHWOOD WEREWOLF", "Brutal beast with razor claws. Extreme danger, rich beast essence.", "werewolf"),
            ("ARROGANT RIVAL VAMPIRE", "Highborn duelist testing your coven claim. High prestige reward.", "rival_thrall"),
            ("RANDOM NIGHT HORROR", "Face whatever nocturnal entity lurks in the mist.", None)
        ]

        for i, (title, desc, enemy_id) in enumerate(hunting_targets):
            y = cy + i * gap
            cb = (lambda e=enemy_id: self._start_hunt(e))
            self.buttons.append(Button(
                (cx - btn_w // 2, y, btn_w, btn_h),
                f"🩸 {title}",
                callback=cb,
                hotkey=str(i + 1)
            ))

        self.buttons.append(Button(
            (cx - 160, cy + len(hunting_targets) * gap + 20, 320, 48),
            "← RETREAT TO HAVEN",
            callback=lambda: self.on_combat_end(False, "You slipped back into the safety of the Haven without stalking prey.")
        ))

    def _start_hunt(self, specific_enemy_id: Optional[str] = None):
        self.is_hunting_selection = False
        if specific_enemy_id:
            self.enemy = get_enemy_for_encounter("hunting_specific", self.player.night)
            # Override with specific enemy if available
            from combat import ENEMIES_POOL
            if specific_enemy_id in ENEMIES_POOL:
                e_data = ENEMIES_POOL[specific_enemy_id]
                self.enemy = Enemy(
                    id=e_data["id"],
                    name=e_data["name"],
                    health=e_data["health"],
                    max_health=e_data["health"],
                    attack_power=e_data["attack"],
                    defense=e_data["defense"],
                    reward_money=e_data["reward_money"],
                    reward_blood=e_data["reward_blood"],
                    description=e_data["description"],
                    special_ability=e_data["special"]
                )
        else:
            self.enemy = get_enemy_for_encounter("hunting", self.player.night)

        self.combat_mgr = CombatManager(self.player, self.enemy)
        self._build_combat_action_buttons()

    def _build_combat_action_buttons(self):
        self.buttons.clear()
        
        btn_w = 160
        btn_h = 44
        gap = 16
        start_x = 100
        start_y = 590

        actions = [
            ("ATTACK (CLAW)", "attack", COLOR_CRIMSON, "A"),
            ("BITE (DRAIN)", "bite", COLOR_BLOOD, "B"),
            ("HYPNOTIZE", "hypnotize", (70, 30, 90), "H"),
            ("USE ABILITY", "ability", (25, 45, 85), "U"),
            ("DEFEND", "defend", (50, 45, 60), "D"),
            ("ESCAPE MIST", "escape", (30, 25, 35), "E")
        ]

        for i, (label, act, col, hotkey) in enumerate(actions):
            x = start_x + i * (btn_w + gap)
            cb = (lambda a=act: self._handle_combat_action(a))
            self.buttons.append(Button(
                (x, start_y, btn_w, btn_h),
                label,
                callback=cb,
                color=col,
                hotkey=hotkey
            ))

    def _handle_combat_action(self, action: str):
        if not self.combat_mgr:
            return

        res = self.combat_mgr.player_action(action)
        if res.get("ended"):
            won = res.get("victory", False)
            summary = "\n".join(self.combat_mgr.log[-3:])
            self.on_combat_end(won, summary)

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)

        if self.is_hunting_selection:
            ui_renderer.draw_text_centered(surface, "🩸 NOCTURNAL HUNTING GROUNDS", 60, color=COLOR_BLOOD, font=ui_renderer.font_title)
            ui_renderer.draw_text_centered(surface, "Choose your prey or stalk high-value adversaries in the foggy alleys of Oakhaven", 115, color=COLOR_GOLD, font=ui_renderer.font_body)
            for btn in self.buttons:
                btn.draw(surface, ui_renderer)
            return

        # Active Combat Rendering
        if not self.combat_mgr or not self.enemy:
            return

        ui_renderer.draw_top_bar(surface, self.player)

        # Arena Panels: Player on left, Enemy on right
        panel_w = 480
        panel_h = 320
        p_x = 100
        p_y = 120
        e_x = 700
        e_y = 120

        # Player Battle Card
        pygame.draw.rect(surface, COLOR_PANEL_BG, (p_x, p_y, panel_w, panel_h), border_radius=12)
        pygame.draw.rect(surface, (85, 30, 45), (p_x, p_y, panel_w, panel_h), 2, border_radius=12)

        ui_renderer.draw_text(surface, f"🧛 {self.player.name}", (p_x + 20, p_y + 20), color=COLOR_GOLD, font=ui_renderer.font_bold)
        ui_renderer.draw_text(surface, f"{self.player.outfit} • {self.player.personality}", (p_x + 20, p_y + 48), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        ui_renderer.draw_bar(surface, p_x + 20, p_y + 85, 440, 20, self.player.health, self.player.max_health, COLOR_HEALTH_GREEN, "HEALTH")
        ui_renderer.draw_bar(surface, p_x + 20, p_y + 125, 440, 20, self.player.hunger, 100, COLOR_BLOOD, "HUNGER / THIRST")
        ui_renderer.draw_bar(surface, p_x + 20, p_y + 165, 440, 20, self.player.energy, self.player.max_energy, COLOR_ENERGY_BLUE, "ENERGY")

        # Enemy Battle Card
        pygame.draw.rect(surface, COLOR_PANEL_BG, (e_x, e_y, panel_w, panel_h), border_radius=12)
        pygame.draw.rect(surface, (95, 20, 25), (e_x, e_y, panel_w, panel_h), 2, border_radius=12)

        ui_renderer.draw_text(surface, f"⚔️ {self.enemy.name}", (e_x + 20, e_y + 20), color=COLOR_CRIMSON, font=ui_renderer.font_bold)
        ui_renderer.draw_text(surface, self.enemy.description[:55] + "...", (e_x + 20, e_y + 48), color=COLOR_TEXT_MUTED, font=ui_renderer.font_small)

        ui_renderer.draw_bar(surface, e_x + 20, e_y + 85, 440, 20, self.enemy.health, self.enemy.max_health, (200, 30, 45), "FOE VITALITY")
        ui_renderer.draw_text(surface, f"Attack: {self.enemy.attack_power} | Armor: {self.enemy.defense}", (e_x + 20, e_y + 125), color=COLOR_PARCHMENT, font=ui_renderer.font_small)
        ui_renderer.draw_text(surface, f"Special Attack: {self.enemy.special_ability}", (e_x + 20, e_y + 155), color=COLOR_GOLD, font=ui_renderer.font_small)

        # Center Combat Log Console
        log_x = 100
        log_y = 460
        log_w = 1080
        log_h = 110
        pygame.draw.rect(surface, (15, 10, 18), (log_x, log_y, log_w, log_h), border_radius=8)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (log_x, log_y, log_w, log_h), 1, border_radius=8)

        ui_renderer.draw_text(surface, "⚔️ BATTLE ACTION CHRONICLE:", (log_x + 16, log_y + 10), color=COLOR_BLOOD, font=ui_renderer.font_small)
        for i, entry in enumerate(self.combat_mgr.log[-4:]):
            ui_renderer.draw_text(surface, entry, (log_x + 16, log_y + 32 + i * 18), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Draw Action Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

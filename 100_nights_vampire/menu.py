"""
100 Nights as a Vampire - Main Menu Screen
===========================================
Gothic landing page with glowing animated buttons, moonlight effects,
and navigation to New Game, Continue, How to Play, Settings, and Exit.
"""

import pygame
import math
from typing import List, Callable, Optional
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_BLOOD, COLOR_CRIMSON,
    COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED
)
from ui import Button

class MenuScreen:
    def __init__(self, on_new_game: Callable, on_continue: Callable, on_how_to_play: Callable, on_settings: Callable, on_exit: Callable):
        self.on_new_game = on_new_game
        self.on_continue = on_continue
        self.on_how_to_play = on_how_to_play
        self.on_settings = on_settings
        self.on_exit = on_exit

        self.buttons: List[Button] = []
        self._build_buttons()
        self.anim_tick = 0

    def _build_buttons(self):
        self.buttons.clear()
        cx = SCREEN_WIDTH // 2
        cy = 380
        btn_w = 340
        btn_h = 48
        gap = 58

        self.buttons.append(Button(
            (cx - btn_w // 2, cy, btn_w, btn_h),
            "AWAKEN AS VAMPIRE (NEW GAME)",
            callback=self.on_new_game,
            hotkey="N"
        ))
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + gap, btn_w, btn_h),
            "CONTINUE NOCTURNAL JOURNEY",
            callback=self.on_continue,
            hotkey="C"
        ))
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + gap * 2, btn_w, btn_h),
            "HOW TO SURVIVE 100 NIGHTS",
            callback=self.on_how_to_play,
            hotkey="H"
        ))
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + gap * 3, btn_w, btn_h),
            "SETTINGS & AUDIO PREFERENCES",
            callback=self.on_settings,
            hotkey="S"
        ))
        self.buttons.append(Button(
            (cx - btn_w // 2, cy + gap * 4, btn_w, btn_h),
            "RETURN TO MORTAL DUST (EXIT)",
            callback=self.on_exit,
            hotkey="ESCAPE"
        ))

    def update(self, dt: float):
        self.anim_tick += dt * 2.0

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        self.anim_tick += 0.03
        surface.fill(COLOR_OBSIDIAN)

        # Draw procedural full moon with atmospheric crimson lunar halo
        moon_center = (SCREEN_WIDTH // 2, 170)
        pulse = math.sin(self.anim_tick) * 6
        for r in range(120, 50, -10):
            alpha = max(0, int(35 - r * 0.2 + pulse))
            halo_surf = pygame.Surface((r * 2, r * 2), pygame.SRCALPHA)
            pygame.draw.circle(halo_surf, (160, 20, 45, alpha), (r, r), r)
            surface.blit(halo_surf, (moon_center[0] - r, moon_center[1] - r))

        pygame.draw.circle(surface, (230, 225, 210), moon_center, 65)
        # Moon craters
        pygame.draw.circle(surface, (195, 190, 180), (moon_center[0] - 22, moon_center[1] - 12), 14)
        pygame.draw.circle(surface, (185, 180, 170), (moon_center[0] + 18, moon_center[1] + 16), 18)
        pygame.draw.circle(surface, (190, 185, 175), (moon_center[0] - 8, moon_center[1] + 28), 10)

        # Title
        ui_renderer.draw_text_centered(surface, "100 NIGHTS AS A VAMPIRE", 260, color=COLOR_BLOOD, font=ui_renderer.font_title)
        ui_renderer.draw_text_centered(surface, "A Gothic RPG of Thirst, Secrecy, Intrigue and Immortality", 310, color=COLOR_GOLD, font=ui_renderer.font_body)
        ui_renderer.draw_text_centered(surface, "Survive the trial of the Blood Moon in the gaslit city of Oakhaven", 335, color=COLOR_TEXT_MUTED, font=ui_renderer.font_small)

        # Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

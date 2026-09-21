"""
100 Nights as a Vampire - Character Creation Screen
===================================================
Allows players to customize their newly turned vampire before Night 1:
Name, Gender/Style, Hair Style/Color, Eye Color, Vampire Outfit, and Starting Personality.
"""

import pygame
from typing import List, Callable, Dict, Any
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED
)
from ui import Button

PERSONALITY_PERKS = {
    "Charming": "Eloquent & Mesmerizing. +10 Secrecy warding, +10 starting NPC trust bonus, and discounts at the Catacomb Market.",
    "Mysterious": "Enigmatic & Shadow-bound. +15 Max Energy, starts with Night Vision Lv.1, and reduced hunter ambush chance.",
    "Ruthless": "Fierce & Cold-blooded. +10 Claw damage in combat, +$30 starting gold, and +15 bonus health on lethal strikes.",
    "Compassionate": "Clings to humanity. +20 Starting Health, deep alliance with your mortal friend Sarah, and lower hunger penalties."
}

HAIR_STYLES = ["Victorian Waves", "Slicked Shadow", "Crimson Dreadlocks", "Silver Braids", "Messy Aristocrat"]
HAIR_COLORS = ["Raven Black", "Platinum Silver", "Crimson Wine", "Midnight Violet", "Pale Blonde"]
EYE_COLORS = ["Crimson Blood", "Luminescent Amber", "Amethyst Violet", "Emerald Glint", "Eclipse Obsidian"]
OUTFITS = ["Victorian Noble", "Gothic Scholar", "Midnight Rogue", "Blood Aristocrat"]
GENDERS = ["Masculine", "Feminine", "Androgynous"]
PERSONALITIES = ["Charming", "Mysterious", "Ruthless", "Compassionate"]

class CharacterCreationScreen:
    def __init__(self, on_complete: Callable[[Dict[str, str]], None], on_back: Callable[[], None]):
        self.on_complete = on_complete
        self.on_back = on_back

        self.name: str = "Lucien Ravenscroft"
        self.gender_idx: int = 0
        self.hair_style_idx: int = 0
        self.hair_color_idx: int = 0
        self.eye_color_idx: int = 0
        self.outfit_idx: int = 0
        self.personality_idx: int = 0

        self.buttons: List[Button] = []
        self._build_buttons()

    def _build_buttons(self):
        self.buttons.clear()
        
        # Navigation / Cycle buttons
        col_x = 240
        btn_w = 42
        btn_h = 32

        def make_cycle(y, cur_val_fn, list_len, attr_name):
            self.buttons.append(Button(
                (col_x + 280, y, btn_w, btn_h), "<",
                callback=lambda: self._cycle(attr_name, -1, list_len)
            ))
            self.buttons.append(Button(
                (col_x + 330, y, btn_w, btn_h), ">",
                callback=lambda: self._cycle(attr_name, 1, list_len)
            ))

        make_cycle(200, lambda: GENDERS[self.gender_idx], len(GENDERS), "gender_idx")
        make_cycle(250, lambda: HAIR_STYLES[self.hair_style_idx], len(HAIR_STYLES), "hair_style_idx")
        make_cycle(300, lambda: HAIR_COLORS[self.hair_color_idx], len(HAIR_COLORS), "hair_color_idx")
        make_cycle(350, lambda: EYE_COLORS[self.eye_color_idx], len(EYE_COLORS), "eye_color_idx")
        make_cycle(400, lambda: OUTFITS[self.outfit_idx], len(OUTFITS), "outfit_idx")
        make_cycle(450, lambda: PERSONALITIES[self.personality_idx], len(PERSONALITIES), "personality_idx")

        # Confirm & Back buttons
        self.buttons.append(Button(
            (SCREEN_WIDTH // 2 - 220, 640, 200, 48),
            "AWAKEN IN FLESH",
            callback=self._submit,
            color=COLOR_BLOOD
        ))
        self.buttons.append(Button(
            (SCREEN_WIDTH // 2 + 20, 640, 200, 48),
            "BACK TO MENU",
            callback=self.on_back
        ))

    def _cycle(self, attr: str, delta: int, length: int):
        val = getattr(self, attr)
        setattr(self, attr, (val + delta) % length)

    def _submit(self):
        data = {
            "name": self.name,
            "gender_style": GENDERS[self.gender_idx],
            "hair_style": HAIR_STYLES[self.hair_style_idx],
            "hair_color": HAIR_COLORS[self.hair_color_idx],
            "eye_color": EYE_COLORS[self.eye_color_idx],
            "outfit": OUTFITS[self.outfit_idx],
            "personality": PERSONALITIES[self.personality_idx]
        }
        self.on_complete(data)

    def handle_event(self, event: pygame.event.Event):
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_BACKSPACE:
                self.name = self.name[:-1]
            elif event.key == pygame.K_RETURN:
                self._submit()
            elif len(self.name) < 24 and event.unicode.isprintable():
                self.name += event.unicode

        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)

        # Header
        ui_renderer.draw_text_centered(surface, "VAMPIRE CHARACTER CUSTOMIZATION", 50, color=COLOR_BLOOD, font=ui_renderer.font_title)
        ui_renderer.draw_text_centered(surface, "Craft your immortal visage before the shadows claim your mortal soul", 95, color=COLOR_GOLD, font=ui_renderer.font_body)

        # Left Column: Configuration Panels
        col_x = 180
        y_start = 150

        # Name Field
        ui_renderer.draw_text(surface, "Vampire Name:", (col_x, y_start), color=COLOR_PARCHMENT, font=ui_renderer.font_bold)
        pygame.draw.rect(surface, COLOR_PANEL_BG, (col_x + 160, y_start - 6, 260, 36), border_radius=6)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (col_x + 160, y_start - 6, 260, 36), 1, border_radius=6)
        ui_renderer.draw_text(surface, self.name + "_", (col_x + 172, y_start + 2), color=COLOR_GOLD, font=ui_renderer.font_body)

        rows = [
            ("Gender / Presentation:", GENDERS[self.gender_idx], 200),
            ("Hair Style:", HAIR_STYLES[self.hair_style_idx], 250),
            ("Hair Color:", HAIR_COLORS[self.hair_color_idx], 300),
            ("Iris / Eye Glow:", EYE_COLORS[self.eye_color_idx], 350),
            ("Vampire Aesthetic:", OUTFITS[self.outfit_idx], 400),
            ("Starting Temperament:", PERSONALITIES[self.personality_idx], 450),
        ]

        for label, val, y in rows:
            ui_renderer.draw_text(surface, label, (col_x, y + 6), color=COLOR_PARCHMENT, font=ui_renderer.font_body)
            ui_renderer.draw_text(surface, val, (col_x + 230, y + 6), color=COLOR_GOLD, font=ui_renderer.font_bold)

        # Right Column: Visual Portrait Preview & Personality Perks
        preview_x = 720
        preview_y = 150
        pygame.draw.rect(surface, COLOR_PANEL_BG, (preview_x, preview_y, 380, 440), border_radius=12)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (preview_x, preview_y, 380, 440), 2, border_radius=12)

        # Procedural Vampire Portrait Silhouette
        p_cx = preview_x + 190
        p_cy = preview_y + 110
        pygame.draw.circle(surface, (20, 15, 25), (p_cx, p_cy), 55) # Head
        # Glowing eyes
        eye_rgb = (220, 20, 40) if "Crimson" in EYE_COLORS[self.eye_color_idx] else ((240, 180, 20) if "Amber" in EYE_COLORS[self.eye_color_idx] else (160, 50, 220))
        pygame.draw.circle(surface, eye_rgb, (p_cx - 16, p_cy - 2), 6)
        pygame.draw.circle(surface, eye_rgb, (p_cx + 16, p_cy - 2), 6)
        # Cloak / Collar
        pygame.draw.polygon(surface, (60, 15, 30), [(p_cx - 60, p_cy + 85), (p_cx + 60, p_cy + 85), (p_cx + 35, p_cy + 35), (p_cx - 35, p_cy + 35)])

        ui_renderer.draw_text_centered(surface, f"✦ {self.name} ✦", preview_y + 200, color=COLOR_GOLD, font=ui_renderer.font_bold)
        ui_renderer.draw_text_centered(surface, f"{OUTFITS[self.outfit_idx]} • {PERSONALITIES[self.personality_idx]}", preview_y + 225, color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Personality Perks Box
        pygame.draw.rect(surface, (25, 18, 30), (preview_x + 16, preview_y + 260, 348, 160), border_radius=8)
        pygame.draw.rect(surface, (85, 35, 60), (preview_x + 16, preview_y + 260, 348, 160), 1, border_radius=8)
        
        ui_renderer.draw_text(surface, f"Starting Trait: {PERSONALITIES[self.personality_idx]}", (preview_x + 28, preview_y + 272), color=COLOR_BLOOD, font=ui_renderer.font_bold)
        perk_text = PERSONALITY_PERKS[PERSONALITIES[self.personality_idx]]
        ui_renderer.draw_text_wrapped(surface, perk_text, (preview_x + 28, preview_y + 302), 324, color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Draw Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

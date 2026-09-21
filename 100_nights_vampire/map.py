"""
100 Nights as a Vampire - City Map Screen
=========================================
Interactive Gothic Map of Oakhaven with 9 clickable locations:
Vampire Mansion, Downtown, Graveyard, Old Academy, Nightclub,
Dark Forest, Abandoned Church, Hospital, and Underground Market.
"""

import pygame
from typing import List, Callable, Dict, Any, Optional
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED
)
from locations import LOCATIONS_DATA, get_unlocked_locations
from ui import Button

class MapScreen:
    def __init__(self, player, on_select_location: Callable[[str], None], on_back: Callable[[], None]):
        self.player = player
        self.on_select_location = on_select_location
        self.on_back = on_back

        self.selected_loc_id: str = "mansion"
        self.buttons: List[Button] = []
        self._build_buttons()

    def _build_buttons(self):
        self.buttons.clear()
        
        # Grid of 9 locations in 3 columns x 3 rows
        unlocked = get_unlocked_locations(self.player.night)
        
        start_x = 70
        start_y = 120
        col_w = 260
        row_h = 145
        gap_x = 20
        gap_y = 16

        loc_keys = [
            "mansion", "downtown", "graveyard",
            "academy", "nightclub", "forest",
            "church", "hospital", "market"
        ]

        for idx, key in enumerate(loc_keys):
            r = idx // 3
            c = idx % 3
            x = start_x + c * (col_w + gap_x)
            y = start_y + r * (row_h + gap_y)
            
            loc = LOCATIONS_DATA.get(key)
            is_unlocked = key in unlocked
            
            # Selection button
            btn_title = f"{loc.icon} {loc.name}" if is_unlocked else f"🔒 Locked (Night {loc.unlock_night}+)"
            cb = (lambda k=key: self._choose_loc(k)) if is_unlocked else None

            self.buttons.append(Button(
                (x, y, col_w, row_h),
                btn_title,
                callback=cb,
                enabled=is_unlocked,
                hotkey=str(idx + 1)
            ))

        # Bottom Bar: Action buttons
        self.buttons.append(Button(
            (930, 610, 240, 48),
            "EXPLORE CHOSEN DISTRICT",
            callback=lambda: self.on_select_location(self.selected_loc_id),
            color=COLOR_BLOOD,
            hotkey="SPACE"
        ))
        self.buttons.append(Button(
            (70, 610, 180, 48),
            "← HAVEN DASHBOARD",
            callback=self.on_back,
            hotkey="ESCAPE"
        ))

    def _choose_loc(self, key: str):
        self.selected_loc_id = key

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)

        # Header
        ui_renderer.draw_text_centered(surface, "🗺️ GOTHIC METROPOLIS: OAKHAVEN", 30, color=COLOR_BLOOD, font=ui_renderer.font_title)
        ui_renderer.draw_text_centered(surface, "Select a territory to stalk prey, bargain with covens, or investigate ancient relics", 75, color=COLOR_GOLD, font=ui_renderer.font_body)

        # Draw location card buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

        # Selected Location Detail Panel on the right / center bottom
        loc = LOCATIONS_DATA.get(self.selected_loc_id)
        if loc:
            panel_x = 270
            panel_y = 605
            pygame.draw.rect(surface, (25, 18, 28), (panel_x, panel_y, 640, 60), border_radius=8)
            pygame.draw.rect(surface, (80, 35, 55), (panel_x, panel_y, 640, 60), 1, border_radius=8)

            ui_renderer.draw_text(surface, f"Target: {loc.name} (Danger: {'★' * loc.danger_level}{'☆' * (5 - loc.danger_level)})", (panel_x + 16, panel_y + 8), color=COLOR_GOLD, font=ui_renderer.font_bold)
            ui_renderer.draw_text(surface, loc.description[:95] + "...", (panel_x + 16, panel_y + 32), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

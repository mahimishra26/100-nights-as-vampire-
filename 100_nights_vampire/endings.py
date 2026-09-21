"""
100 Nights as a Vampire - Ending & Game Over Screen
===================================================
Displays the conclusion of the 100 Nights odyssey:
Evaluates the 6 branching endings (Vampire Ruler, Human Love, Redemption,
Eternal Vampire, Dark Lord, Defeated), final stats, achievements, and restart/menu buttons.
"""

import pygame
from typing import List, Callable, Dict, Any, Optional
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED
)
from ui import Button

ENDINGS_DATA = {
    "monarch": {
        "title": "👑 CROWNED VAMPIRE MONARCH",
        "badge": "Ascendant Sovereign of the Crimson Court",
        "description": "Through calculated cunning, deep alliances, and unchallenged mastery, you dethroned the decadent elders. The entire nocturnal underworld bows to your majestic reign. You rule Oakhaven from the shadows as its undisputed Immortal Monarch."
    },
    "human_love": {
        "title": "❤️ MORTAL DEVOTION & HUMAN LOVE",
        "badge": "The Undying Guardian",
        "description": "Rejecting the cold nihilism of the coven, you preserved your mortal soul alongside Sarah. You walk between the sun and the moon, shielding the humans you cherish from the horrors of the shadows. A miracle of warmth in an immortal frost."
    },
    "redemption": {
        "title": "🌅 THE SUNRISE OF REDEMPTION",
        "badge": "Mortal Once More",
        "description": "Using Madam Morgana's ancient lunar elixir and the sacrifice of an elder's stone, you broke the immortal curse. As the 101st dawn breaks over Oakhaven, the sun kisses your skin without burning. You are human once more."
    },
    "eternal": {
        "title": "🦇 THE ETERNAL MIDNIGHT WANDERER",
        "badge": "Phantom of Centuries",
        "description": "You neither sought supreme power nor mortal cure. You mastered the rhythm of the eternal night—feeding discreetly, walking among centuries, an untraceable myth whispered in gaslit taverns for generations to come."
    },
    "dark_lord": {
        "title": "🌑 THE BLOOD LORD OF SHADOWS",
        "badge": "The Scourge of Oakhaven",
        "description": "You let the beast take total dominion. Oakhaven's streets ran red with the blood of inquisitors and innocents alike. An empire of terror, where mortal and monster tremble at the mere mention of your dreadful moniker."
    },
    "defeated": {
        "title": "💀 FALLEN IN THE MIDNIGHT DUST",
        "badge": "Extinguished Spark",
        "description": "Your haven was breached and the cold light of day or silver blades of the hunters extinguished your undead flame. You join the nameless ash scattered across the cobblestones of Oakhaven."
    }
}

class EndingScreen:
    def __init__(self, player, ending_key: str, on_restart: Callable[[], None], on_menu: Callable[[], None]):
        self.player = player
        self.ending_key = ending_key
        self.on_restart = on_restart
        self.on_menu = on_menu

        self.buttons: List[Button] = []
        self._build_buttons()

    def _build_buttons(self):
        self.buttons.clear()
        cx = SCREEN_WIDTH // 2
        cy = 620

        self.buttons.append(Button(
            (cx - 240, cy, 220, 48),
            "AWAKEN ANEW (RESTART)",
            callback=self.on_restart,
            color=COLOR_BLOOD,
            hotkey="R"
        ))
        self.buttons.append(Button(
            (cx + 20, cy, 220, 48),
            "MAIN MENU",
            callback=self.on_menu,
            hotkey="M"
        ))

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)

        data = ENDINGS_DATA.get(self.ending_key, ENDINGS_DATA["eternal"])

        # Main Ending Frame
        frame_x = 100
        frame_y = 50
        frame_w = 1080
        frame_h = 540

        pygame.draw.rect(surface, COLOR_PANEL_BG, (frame_x, frame_y, frame_w, frame_h), border_radius=14)
        pygame.draw.rect(surface, (90, 25, 45), (frame_x, frame_y, frame_w, frame_h), 2, border_radius=14)

        # Title and Badge
        ui_renderer.draw_text_centered(surface, data["title"], frame_y + 30, color=COLOR_BLOOD, font=ui_renderer.font_title)
        ui_renderer.draw_text_centered(surface, f"✦ {data['badge']} ✦", frame_y + 80, color=COLOR_GOLD, font=ui_renderer.font_bold)

        # Narrative Story Ending Text
        ui_renderer.draw_text_wrapped(surface, data["description"], (frame_x + 50, frame_y + 130), frame_w - 100, color=COLOR_PARCHMENT, font=ui_renderer.font_body)

        # Final Statistics Box
        stats_y = frame_y + 240
        pygame.draw.rect(surface, (20, 14, 25), (frame_x + 50, stats_y, frame_w - 100, 240), border_radius=10)
        pygame.draw.rect(surface, (70, 30, 50), (frame_x + 50, stats_y, frame_w - 100, 240), 1, border_radius=10)

        ui_renderer.draw_text(surface, "🏆 FINAL IMMORTALITY CHRONICLE & RECORDS", (frame_x + 70, stats_y + 20), color=COLOR_GOLD, font=ui_renderer.font_bold)

        col1_x = frame_x + 70
        col2_x = frame_x + 560
        y_off = stats_y + 60

        stat_lines_1 = [
            f"• Vampire Name: {self.player.name}",
            f"• Presentation: {self.player.gender_style} | {self.player.outfit}",
            f"• Starting Personality: {self.player.personality}",
            f"• Nights Survived: {self.player.night} / 100",
            f"• Remaining Health: {self.player.health} / {self.player.max_health}",
        ]

        stat_lines_2 = [
            f"• Final Secrecy Rating: {self.player.secrecy}%",
            f"• Accumulated Gold: ${self.player.money}",
            f"• Disciplines Mastered: {sum(1 for a in self.player.abilities.values() if a.level > 0)} / 7",
            f"• Satiations / Feeds: {self.player.story_flags.get('feed_count', 0)}",
            f"• Inquisitor Cross Encounter: {'Allied' if self.player.characters.get('hunter', None) and self.player.characters['hunter'].trust > 50 else 'Hostile'}"
        ]

        for i, line in enumerate(stat_lines_1):
            ui_renderer.draw_text(surface, line, (col1_x, y_off + i * 30), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        for i, line in enumerate(stat_lines_2):
            ui_renderer.draw_text(surface, line, (col2_x, y_off + i * 30), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

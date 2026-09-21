"""
100 Nights as a Vampire - Relationships & Story Screen
======================================================
Displays the 8 Major NPCs (Mentor, Rival, Queen, Hunter, Friend,
Mysterious Human, Werewolf, Witch) and the full Story Journal:
Objectives, Completed Quests, Discoveries, Decisions, and Lore.
"""

import pygame
from typing import List, Callable, Dict, Any
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED
)
from ui import Button

class RelationshipsScreen:
    def __init__(self, player, on_back: Callable[[], None]):
        self.player = player
        self.on_back = on_back

        self.current_tab: str = "covens"  # 'covens' or 'story_journal'
        self.buttons: List[Button] = []
        self._build_buttons()

    def _build_buttons(self):
        self.buttons.clear()

        # Tab switcher
        self.buttons.append(Button(
            (70, 70, 220, 40),
            "❤️ COVENS & ALLIANCES",
            callback=lambda: self._set_tab("covens"),
            color=COLOR_BLOOD if self.current_tab == "covens" else None,
            hotkey="1"
        ))
        self.buttons.append(Button(
            (310, 70, 220, 40),
            "📖 STORY JOURNAL & LORE",
            callback=lambda: self._set_tab("story_journal"),
            color=COLOR_BLOOD if self.current_tab == "story_journal" else None,
            hotkey="2"
        ))

        # Back Button
        self.buttons.append(Button(
            (SCREEN_WIDTH - 240, 70, 170, 40),
            "← BACK TO HAVEN",
            callback=self.on_back,
            hotkey="ESCAPE"
        ))

    def _set_tab(self, tab: str):
        self.current_tab = tab
        self._build_buttons()

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)

        # Draw Tab Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

        if self.current_tab == "covens":
            self._render_covens(surface, ui_renderer)
        else:
            self._render_journal(surface, ui_renderer)

    def _render_covens(self, surface: pygame.Surface, ui_renderer):
        # 8 Characters displayed in 2 rows of 4 columns
        char_keys = [
            "mentor", "rival", "queen", "hunter",
            "human_friend", "mysterious_human", "werewolf", "witch"
        ]

        start_x = 70
        start_y = 135
        card_w = 265
        card_h = 240
        gap_x = 22
        gap_y = 20

        for i, k in enumerate(char_keys):
            r = i // 4
            c = i % 4
            x = start_x + c * (card_w + gap_x)
            y = start_y + r * (card_h + gap_y)

            char = self.player.characters.get(k)
            if not char:
                continue

            pygame.draw.rect(surface, COLOR_PANEL_BG, (x, y, card_w, card_h), border_radius=10)
            pygame.draw.rect(surface, COLOR_PANEL_BORDER, (x, y, card_w, card_h), 1, border_radius=10)

            # Portrait & Title
            ui_renderer.draw_text(surface, f"{char.portrait} {char.name}", (x + 14, y + 14), color=COLOR_GOLD, font=ui_renderer.font_bold)
            ui_renderer.draw_text(surface, char.title, (x + 14, y + 38), color=COLOR_TEXT_MUTED, font=ui_renderer.font_small)

            # Trust bar
            ui_renderer.draw_bar(surface, x + 14, y + 65, card_w - 28, 14, char.trust, 100, (180, 40, 80), f"Trust: {char.trust}% ({char.status})")

            # Description
            ui_renderer.draw_text_wrapped(surface, char.description, (x + 14, y + 95), card_w - 28, color=COLOR_PARCHMENT, font=ui_renderer.font_small)

    def _render_journal(self, surface: pygame.Surface, ui_renderer):
        panel_x = 70
        panel_y = 135
        panel_w = 1140
        panel_h = 510

        pygame.draw.rect(surface, COLOR_PANEL_BG, (panel_x, panel_y, panel_w, panel_h), border_radius=12)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (panel_x, panel_y, panel_w, panel_h), 2, border_radius=12)

        ui_renderer.draw_text(surface, "📜 ANCIENT NOCTURNAL CHRONICLES & QUEST LOG", (panel_x + 28, panel_y + 24), color=COLOR_BLOOD, font=ui_renderer.font_title)

        # Section 1: Active Objective
        ui_renderer.draw_text(surface, "Active Main Objective:", (panel_x + 28, panel_y + 80), color=COLOR_GOLD, font=ui_renderer.font_bold)
        obj_text = (
            f"Night {self.player.night}/100: Survive and unlock the final truth before the Blood Moon arrives. "
            "Manage thirst without exposing your haven to detective Alexander Cross."
        )
        ui_renderer.draw_text(surface, obj_text, (panel_x + 28, panel_y + 106), color=COLOR_PARCHMENT, font=ui_renderer.font_body)

        # Section 2: Important Discoveries & Lore
        ui_renderer.draw_text(surface, "Important Discoveries & Vampire Lore:", (panel_x + 28, panel_y + 150), color=COLOR_GOLD, font=ui_renderer.font_bold)
        discoveries = [
            "• The Blood Moon occurs once every century, magnifying vampire potency while driving feral ghouls into a blood frenzy.",
            "• Lord Valerius has withheld the identity of your true sire. Dark alchemical runes point towards ancient high coven lineage.",
            "• Detective Alexander Cross leads the Silver Dawn Syndicate, an elite mortal faction hunting vampires with blessed phosphorus rounds.",
            "• Gerald's Ashwood werewolf pack guards an ancient lunar stone capable of curing vampiric thirst or sealing the haven."
        ]
        for idx, d in enumerate(discoveries):
            ui_renderer.draw_text(surface, d, (panel_x + 28, panel_y + 180 + idx * 26), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Section 3: Major Decisions & Milestones
        ui_renderer.draw_text(surface, "Milestones & Major Decisions Made:", (panel_x + 28, panel_y + 300), color=COLOR_GOLD, font=ui_renderer.font_bold)
        milestones = [
            f"• Nights Survived: {self.player.night - 1} / 100",
            f"• Mortal Innocents Satiated: {self.player.story_flags.get('feed_count', 0)} times",
            f"• Unlocked City Districts: {len(self.player.story_flags.get('unlocked_locations', []))} of 9 territories",
            f"• Current Secrecy Mask: {self.player.secrecy}% (Inquisitor tracking active if below 30%)"
        ]
        for idx, m in enumerate(milestones):
            ui_renderer.draw_text(surface, m, (panel_x + 28, panel_y + 330 + idx * 26), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

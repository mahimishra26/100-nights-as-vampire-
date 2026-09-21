"""
100 Nights as a Vampire - Night Dashboard Screen
================================================
The primary hub showing Night 1/100, Vitals, Time/Location, Story Chronicle Panel,
and prominent Navigation buttons to Explore, Hunt, Abilities, Inventory, Relationships, and End Night.
"""

import pygame
from typing import List, Callable, Dict, Any
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT, COLOR_OBSIDIAN, COLOR_PANEL_BG, COLOR_PANEL_BORDER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_GOLD, COLOR_PARCHMENT, COLOR_TEXT_MUTED,
    COLOR_HEALTH_GREEN, COLOR_ENERGY_BLUE, COLOR_SECRECY_EYE
)
from ui import Button

class DashboardScreen:
    def __init__(
        self,
        player,
        on_nav: Callable[[str], None],
        on_feed_quick: Callable[[str], None],
        on_end_night: Callable[[], None]
    ):
        self.player = player
        self.on_nav = on_nav
        self.on_feed_quick = on_feed_quick
        self.on_end_night = on_end_night

        self.buttons: List[Button] = []
        self._build_buttons()

    def _build_buttons(self):
        self.buttons.clear()
        
        # Navigation Bar across the bottom / sides
        nav_y = 640
        btn_w = 150
        btn_h = 44
        gap = 12
        start_x = 70

        navs = [
            ("🗺️ EXPLORE MAP", "map"),
            ("🩸 HUNT PREY", "hunting"),
            ("⚡ ABILITIES", "abilities"),
            ("🎒 SATCHEL", "inventory"),
            ("❤️ ALLIANCES", "relationships"),
            ("⚙️ SETTINGS", "settings"),
            ("🌙 END NIGHT", "end_night")
        ]

        for i, (label, target) in enumerate(navs):
            x = start_x + i * (btn_w + gap)
            cb = self.on_end_night if target == "end_night" else (lambda t=target: self.on_nav(t))
            btn_color = COLOR_BLOOD if target == "end_night" else None
            self.buttons.append(Button(
                (x, nav_y, btn_w, btn_h),
                label,
                callback=cb,
                color=btn_color,
                hotkey=str(i + 1)
            ))

        # Quick Feed Buttons on Dashboard
        q_x = 880
        self.buttons.append(Button(
            (q_x, 240, 260, 36),
            "Hunt Alley Rats (-20 Thirst, 0 Risk)",
            callback=lambda: self.on_feed_quick("rats"),
            color=(45, 30, 45)
        ))
        self.buttons.append(Button(
            (q_x, 286, 260, 36),
            "Drink Chilled Blood Pack (-45 Thirst)",
            callback=lambda: self.on_feed_quick("bag"),
            color=(80, 20, 35)
        ))
        self.buttons.append(Button(
            (q_x, 332, 260, 36),
            "Mesmerize Reveller (-50 Thirst, -8 Sec)",
            callback=lambda: self.on_feed_quick("stealth_mortal"),
            color=(60, 15, 40)
        ))

    def handle_event(self, event: pygame.event.Event):
        for btn in self.buttons:
            if btn.handle_event(event):
                return True
        return False

    def render(self, surface: pygame.Surface, ui_renderer):
        surface.fill(COLOR_OBSIDIAN)
        p = self.player

        # Top HUD Vitals Banner
        ui_renderer.draw_top_bar(surface, p)

        # Main Central Chronicle / Story Stage Panel
        stage_x = 70
        stage_y = 120
        stage_w = 780
        stage_h = 490

        pygame.draw.rect(surface, COLOR_PANEL_BG, (stage_x, stage_y, stage_w, stage_h), border_radius=12)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (stage_x, stage_y, stage_w, stage_h), 2, border_radius=12)

        # Header of Sanctuary
        ui_renderer.draw_text(surface, f"✦ NIGHT SANCTUARY: OBSIDIAN HAVEN ✦", (stage_x + 24, stage_y + 20), color=COLOR_BLOOD, font=ui_renderer.font_bold)
        ui_renderer.draw_text(surface, f"Current Persona: {p.name} ({p.outfit} • {p.personality})", (stage_x + 24, stage_y + 48), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Decorative Divider
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (stage_x + 24, stage_y + 75), (stage_x + stage_w - 24, stage_y + 75), 1)

        # Chronicle Narrative Box
        ui_renderer.draw_text(surface, "Active Story Objective & Chronicle:", (stage_x + 24, stage_y + 90), color=COLOR_GOLD, font=ui_renderer.font_body)
        
        objective = "Uncover the identity of the mysterious elder who sired you and survive until the Blood Moon."
        if p.night >= 75:
            objective = "The Blood Moon draws near. Rally your allies or embrace supreme solitary dominion."
        elif p.night >= 50:
            objective = "Investigate the Inquisitor headquarters and forge a pact with Queen Carmilla or the Ashwood Pack."
        elif p.night >= 25:
            objective = "Detective Alexander Cross has discovered blood traces in Downtown. Minimize exposure."

        ui_renderer.draw_text(surface, f"Objective: {objective}", (stage_x + 24, stage_y + 118), color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Narrative Event Log
        ui_renderer.draw_text(surface, "Latest Sanctuary Log:", (stage_x + 24, stage_y + 160), color=COLOR_GOLD, font=ui_renderer.font_body)
        ui_renderer.draw_text_wrapped(surface, p.last_log, (stage_x + 24, stage_y + 188), stage_w - 48, color=COLOR_PARCHMENT, font=ui_renderer.font_body)

        # Lore Excerpt Parchment
        lore_box_y = stage_y + 260
        pygame.draw.rect(surface, (20, 15, 25), (stage_x + 24, lore_box_y, stage_w - 48, 200), border_radius=8)
        pygame.draw.rect(surface, (65, 30, 45), (stage_x + 24, lore_box_y, stage_w - 48, 200), 1, border_radius=8)

        ui_renderer.draw_text(surface, "📜 Nocturnal Lore & World State", (stage_x + 40, lore_box_y + 16), color=COLOR_BLOOD, font=ui_renderer.font_bold)
        world_text = (
            f"Oakhaven is gripped by an eerie twilight mist. You have survived {p.night - 1} nights in darkness. "
            f"Your current hunger level is {p.hunger}%—feed regularly to avoid bestial frenzy. "
            f"Keep your Secrecy above 30% to prevent inquisitor raids. Unlocked locations: {len(p.story_flags.get('unlocked_locations', []))} districts. "
            f"Explore districts on the city map, hunt unsuspecting prey, or upgrade supernatural disciplines."
        )
        ui_renderer.draw_text_wrapped(surface, world_text, (stage_x + 40, lore_box_y + 46), stage_w - 80, color=COLOR_PARCHMENT, font=ui_renderer.font_small)

        # Right Side Panel: Quick Feeding & Status
        side_x = 880
        side_y = 120
        side_w = 320
        side_h = 490

        pygame.draw.rect(surface, COLOR_PANEL_BG, (side_x, side_y, side_w, side_h), border_radius=12)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, (side_x, side_y, side_w, side_h), 2, border_radius=12)

        ui_renderer.draw_text(surface, "🩸 QUICK BLOOD FEEDING", (side_x + 20, side_y + 20), color=COLOR_BLOOD, font=ui_renderer.font_bold)
        ui_renderer.draw_text(surface, "Satiate the burning thirst:", (side_x + 20, side_y + 48), color=COLOR_TEXT_MUTED, font=ui_renderer.font_small)

        # Blood Status gauge
        gauge_y = side_y + 80
        pygame.draw.rect(surface, (15, 10, 20), (side_x + 20, gauge_y, side_w - 40, 24), border_radius=4)
        pct = min(1.0, p.hunger / 100.0)
        bar_clr = COLOR_BLOOD if p.hunger > 75 else COLOR_CRIMSON
        pygame.draw.rect(surface, bar_clr, (side_x + 20, gauge_y, int((side_w - 40) * pct), 24), border_radius=4)
        ui_renderer.draw_text_centered(surface, f"Thirst: {p.hunger}/100", gauge_y + 4, color=COLOR_PARCHMENT, font=ui_renderer.font_bold)

        # Instructions
        ui_renderer.draw_text(surface, "Press numbers [1-7] for quick navigation.", (side_x + 20, side_y + 400), color=COLOR_GOLD, font=ui_renderer.font_small)
        ui_renderer.draw_text(surface, "Night advances only when resting or exploring.", (side_x + 20, side_y + 424), color=COLOR_TEXT_MUTED, font=ui_renderer.font_small)

        # Draw Buttons
        for btn in self.buttons:
            btn.draw(surface, ui_renderer)

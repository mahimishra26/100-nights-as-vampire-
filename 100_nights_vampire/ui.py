"""
100 Nights as a Vampire - Pygame UI System & Graphical Rendering
"""

import math
import random
import pygame
from typing import List, Tuple, Optional, Callable, Dict, Any
from settings import (
    SCREEN_WIDTH, SCREEN_HEIGHT,
    COLOR_OBSIDIAN, COLOR_DEEP_BG, COLOR_PANEL_BG, COLOR_PANEL_BORDER, COLOR_PANEL_HOVER,
    COLOR_BLOOD, COLOR_CRIMSON, COLOR_DARK_RED, COLOR_HEALTH_GREEN,
    COLOR_ENERGY_BLUE, COLOR_ENERGY_PURPLE, COLOR_SECRECY_EYE, COLOR_GOLD, COLOR_SILVER,
    COLOR_PARCHMENT, COLOR_TEXT_MUTED, COLOR_TEXT_DIM, COLOR_BLOOD_MOON, COLOR_NORMAL_MOON
)

class Button:
    def __init__(self, rect: Tuple[int, int, int, int], text: str, callback: Optional[Callable] = None, 
                 btn_id: str = "", enabled: bool = True, tag: str = "", hotkey: str = ""):
        self.rect = pygame.Rect(rect)
        self.text = text
        self.callback = callback
        self.btn_id = btn_id
        self.enabled = enabled
        self.tag = tag
        self.hotkey = hotkey
        self.is_hovered = False

    def handle_event(self, event: pygame.event.Event) -> bool:
        if not self.enabled:
            return False
            
        if event.type == pygame.MOUSEMOTION:
            self.is_hovered = self.rect.collidepoint(event.pos)
            
        elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
            if self.rect.collidepoint(event.pos):
                if self.callback:
                    self.callback()
                return True
                
        elif event.type == pygame.KEYDOWN and self.hotkey:
            if event.unicode.upper() == self.hotkey.upper():
                if self.callback:
                    self.callback()
                return True
                
        return False

    def draw(self, surface: pygame.Surface, font: pygame.font.Font, small_font: Optional[pygame.font.Font] = None):
        # Determine colors
        if not self.enabled:
            bg_col = (18, 16, 22)
            border_col = (45, 40, 50)
            text_col = (90, 80, 95)
        elif self.is_hovered:
            bg_col = (55, 20, 32)
            border_col = COLOR_CRIMSON
            text_col = (255, 240, 245)
        else:
            bg_col = COLOR_PANEL_BG
            border_col = COLOR_PANEL_BORDER
            text_col = COLOR_PARCHMENT

        # Shadow
        shadow_rect = self.rect.copy()
        shadow_rect.x += 3
        shadow_rect.y += 3
        pygame.draw.rect(surface, (5, 5, 8), shadow_rect, border_radius=6)

        # Background & Ornate Border
        pygame.draw.rect(surface, bg_col, self.rect, border_radius=6)
        pygame.draw.rect(surface, border_col, self.rect, width=2, border_radius=6)

        # Corner diamond accents
        if self.enabled:
            d_size = 3
            pygame.draw.polygon(surface, border_col, [
                (self.rect.left + 5, self.rect.top + 5 - d_size),
                (self.rect.left + 5 + d_size, self.rect.top + 5),
                (self.rect.left + 5, self.rect.top + 5 + d_size),
                (self.rect.left + 5 - d_size, self.rect.top + 5)
            ])
            pygame.draw.polygon(surface, border_col, [
                (self.rect.right - 6, self.rect.top + 5 - d_size),
                (self.rect.right - 6 + d_size, self.rect.top + 5),
                (self.rect.right - 6, self.rect.top + 5 + d_size),
                (self.rect.right - 6 - d_size, self.rect.top + 5)
            ])

        # Text rendering with wrap or truncation
        txt_surf = font.render(self.text, True, text_col)
        # Center horizontally and vertically
        txt_rect = txt_surf.get_rect(center=self.rect.center)
        if txt_rect.width > self.rect.width - 24:
            # If text is too wide and small font exists, fallback
            if small_font:
                txt_surf = small_font.render(self.text, True, text_col)
                txt_rect = txt_surf.get_rect(center=self.rect.center)
                
        surface.blit(txt_surf, txt_rect)

        # Hotkey badge
        if self.hotkey and small_font and self.enabled:
            hk_surf = small_font.render(f"[{self.hotkey}]", True, COLOR_GOLD if self.is_hovered else COLOR_TEXT_MUTED)
            surface.blit(hk_surf, (self.rect.left + 8, self.rect.top + 6))


class Particle:
    def __init__(self, x: float, y: float, vx: float, vy: float, color: Tuple[int, int, int], radius: float, lifetime: int):
        self.x = x
        self.y = y
        self.vx = vx
        self.vy = vy
        self.color = color
        self.radius = radius
        self.max_lifetime = lifetime
        self.lifetime = lifetime

    def update(self) -> bool:
        self.x += self.vx
        self.y += self.vy
        self.lifetime -= 1
        return self.lifetime > 0

    def draw(self, surface: pygame.Surface):
        alpha = int((self.lifetime / self.max_lifetime) * 255)
        color = (*self.color[:3], alpha)
        # Draw on temp surface for alpha if needed or circle
        pygame.draw.circle(surface, self.color, (int(self.x), int(self.y)), max(1, int(self.radius)))


class UIRenderer:
    def __init__(self):
        pygame.font.init()
        # Graceful fonts selection
        self.font_title = self._load_font("georgia", 36, bold=True)
        self.font_subtitle = self._load_font("georgia", 24, bold=True)
        self.font_body = self._load_font("georgia", 18)
        self.font_small = self._load_font("georgia", 14)
        self.font_stats = self._load_font("georgia", 16, bold=True)

        # Procedural mist particles
        self.particles: List[Particle] = []
        for _ in range(40):
            self.particles.append(Particle(
                random.uniform(0, SCREEN_WIDTH),
                random.uniform(0, SCREEN_HEIGHT),
                random.uniform(-0.3, 0.3),
                random.uniform(-0.15, -0.4),
                (140, 30, 45) if random.random() < 0.3 else (70, 75, 95),
                random.uniform(1.5, 3.5),
                random.randint(200, 500)
            ))

        self.anim_timer: float = 0.0

    def _load_font(self, font_name: str, size: int, bold: bool = False) -> pygame.font.Font:
        try:
            return pygame.font.SysFont(font_name, size, bold=bold)
        except Exception:
            return pygame.font.Font(None, size)

    def update(self):
        self.anim_timer += 0.03
        for p in self.particles:
            if not p.update():
                # Re-spawn at bottom
                p.x = random.uniform(0, SCREEN_WIDTH)
                p.y = SCREEN_HEIGHT + 10
                p.lifetime = p.max_lifetime
                p.vx = random.uniform(-0.3, 0.3)
                p.vy = random.uniform(-0.15, -0.4)

    def draw_gothic_background(self, surface: pygame.Surface, night: int):
        # Base deep gradient
        surface.fill(COLOR_OBSIDIAN)
        
        # Upper sky gradient
        is_blood_moon = (night >= 90) or (night in [25, 50, 75])
        sky_color = (40, 10, 18) if is_blood_moon else (14, 16, 26)
        
        for y in range(0, 300, 10):
            factor = 1.0 - (y / 300.0)
            c = (
                int(sky_color[0] * factor + COLOR_OBSIDIAN[0] * (1 - factor)),
                int(sky_color[1] * factor + COLOR_OBSIDIAN[1] * (1 - factor)),
                int(sky_color[2] * factor + COLOR_OBSIDIAN[2] * (1 - factor))
            )
            pygame.draw.rect(surface, c, (0, y, SCREEN_WIDTH, 10))

        # Moon
        moon_center = (SCREEN_WIDTH - 160, 120)
        moon_radius = 55
        moon_color = COLOR_BLOOD_MOON if is_blood_moon else COLOR_NORMAL_MOON
        
        # Outer glow
        glow_surf = pygame.Surface((moon_radius * 4, moon_radius * 4), pygame.SRCALPHA)
        glow_color = (200, 30, 40, 35) if is_blood_moon else (180, 200, 255, 30)
        pygame.draw.circle(glow_surf, glow_color, (moon_radius * 2, moon_radius * 2), moon_radius * 1.8)
        pygame.draw.circle(glow_surf, glow_color, (moon_radius * 2, moon_radius * 2), moon_radius * 1.4)
        surface.blit(glow_surf, (moon_center[0] - moon_radius * 2, moon_center[1] - moon_radius * 2))

        # Solid moon with subtle craters
        pygame.draw.circle(surface, moon_color, moon_center, moon_radius)
        crater_col = (170, 20, 30) if is_blood_moon else (190, 195, 215)
        pygame.draw.circle(surface, crater_col, (moon_center[0] - 14, moon_center[1] - 8), 12)
        pygame.draw.circle(surface, crater_col, (moon_center[0] + 16, moon_center[1] + 15), 9)
        pygame.draw.circle(surface, crater_col, (moon_center[0] - 8, moon_center[1] + 20), 7)

        # Distant cathedral / castle silhouettes
        skyline_pts = [
            (0, 340), (80, 310), (120, 220), (140, 310), (220, 330),
            (280, 260), (320, 330), (450, 340), (520, 270), (550, 200),
            (570, 270), (700, 330), (850, 280), (880, 190), (910, 280),
            (1050, 330), (1140, 250), (1180, 330), (SCREEN_WIDTH, 340),
            (SCREEN_WIDTH, SCREEN_HEIGHT), (0, SCREEN_HEIGHT)
        ]
        pygame.draw.polygon(surface, (12, 10, 16), skyline_pts)

        # Draw mist particles
        for p in self.particles:
            p.draw(surface)

    def draw_stat_bar(self, surface: pygame.Surface, x: int, y: int, width: int, height: int, 
                      current: int, maximum: int, fill_color: Tuple[int, int, int], 
                      label: str, icon_str: str = ""):
        # Background slot
        slot_rect = pygame.Rect(x, y, width, height)
        pygame.draw.rect(surface, (20, 18, 25), slot_rect, border_radius=4)
        pygame.draw.rect(surface, (60, 50, 65), slot_rect, width=1, border_radius=4)

        # Filled portion
        pct = max(0.0, min(1.0, current / maximum if maximum > 0 else 0))
        if pct > 0:
            fill_rect = pygame.Rect(x + 2, y + 2, int((width - 4) * pct), height - 4)
            pygame.draw.rect(surface, fill_color, fill_rect, border_radius=3)
            # Gloss highlight on top of bar
            highlight_rect = pygame.Rect(x + 2, y + 2, int((width - 4) * pct), (height - 4) // 2)
            gloss = pygame.Surface((highlight_rect.width, highlight_rect.height), pygame.SRCALPHA)
            gloss.fill((255, 255, 255, 40))
            surface.blit(gloss, highlight_rect)

        # Label & values
        txt_surf = self.font_small.render(f"{icon_str} {label}: {current}/{maximum}", True, COLOR_PARCHMENT)
        surface.blit(txt_surf, (x + 8, y - 18))

    def draw_top_nav_bar(self, surface: pygame.Surface, player):
        # Header strip
        header_rect = pygame.Rect(0, 0, SCREEN_WIDTH, 70)
        pygame.draw.rect(surface, COLOR_PANEL_BG, header_rect)
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (0, 70), (SCREEN_WIDTH, 70), 2)

        # Night & Blood Moon indicator
        is_blood_moon = (player.night >= 90) or (player.night in [25, 50, 75])
        night_col = COLOR_CRIMSON if is_blood_moon else COLOR_GOLD
        night_txt = self.font_title.render(f"NIGHT {player.night} / 100", True, night_col)
        surface.blit(night_txt, (24, 14))

        if is_blood_moon:
            bm_tag = self.font_small.render("✦ BLOOD MOON PROXIMITY ✦", True, COLOR_BLOOD_MOON)
            surface.blit(bm_tag, (26, 48))
        else:
            days_left = 100 - player.night
            rem_tag = self.font_small.render(f"{days_left} nights remain until the final eclipse", True, COLOR_TEXT_MUTED)
            surface.blit(rem_tag, (26, 48))

        # Stats bars: Health, Hunger, Secrecy, Energy, Money
        start_x = 340
        bar_w = 140
        h_bar = 14
        
        # Health ❤️
        self.draw_stat_bar(surface, start_x, 34, bar_w, h_bar, player.health, player.max_health, COLOR_HEALTH_GREEN, "Health", "❤️")
        
        # Hunger 🩸 (Inverted threat: red high)
        hunger_col = COLOR_BLOOD if player.hunger > 70 else (180, 80, 90)
        self.draw_stat_bar(surface, start_x + 160, 34, bar_w, h_bar, player.hunger, 100, hunger_col, "Hunger", "🩸")
        
        # Secrecy 🕵️
        sec_col = COLOR_CRIMSON if player.secrecy < 35 else COLOR_SECRECY_EYE
        self.draw_stat_bar(surface, start_x + 320, 34, bar_w, h_bar, player.secrecy, 100, sec_col, "Secrecy", "🕵️")
        
        # Energy ⚡
        self.draw_stat_bar(surface, start_x + 480, 34, bar_w, h_bar, player.energy, player.max_energy, COLOR_ENERGY_BLUE, "Energy", "⚡")

        # Money 💰
        gold_box = pygame.Rect(SCREEN_WIDTH - 150, 15, 126, 40)
        pygame.draw.rect(surface, (18, 16, 24), gold_box, border_radius=6)
        pygame.draw.rect(surface, (90, 75, 45), gold_box, width=1, border_radius=6)
        gold_txt = self.font_stats.render(f"💰 ${player.money}", True, COLOR_GOLD)
        surface.blit(gold_txt, (gold_box.x + 14, gold_box.y + 10))

    def draw_dialogue_panel(self, surface: pygame.Surface, title: str, speaker: str, 
                            text: str, portrait_char: str = ""):
        panel_rect = pygame.Rect(60, 100, SCREEN_WIDTH - 120, 320)
        
        # Ornate box
        pygame.draw.rect(surface, (18, 16, 24), panel_rect, border_radius=8)
        pygame.draw.rect(surface, COLOR_PANEL_BORDER, panel_rect, width=2, border_radius=8)

        # Title bar
        title_surf = self.font_subtitle.render(title, True, COLOR_CRIMSON)
        surface.blit(title_surf, (panel_rect.x + 24, panel_rect.y + 18))

        # Speaker label
        if speaker:
            spk_surf = self.font_stats.render(f"✦ {speaker} ✦", True, COLOR_GOLD)
            surface.blit(spk_surf, (panel_rect.x + 24, panel_rect.y + 52))

        # Divider line
        pygame.draw.line(surface, COLOR_PANEL_BORDER, (panel_rect.x + 24, panel_rect.y + 78), 
                         (panel_rect.right - 24, panel_rect.y + 78), 1)

        # Word wrap text
        words = text.split(" ")
        lines = []
        cur_line = []
        max_w = panel_rect.width - 60
        
        for w in words:
            if "\n\n" in w:
                parts = w.split("\n\n")
                cur_line.append(parts[0])
                lines.append(" ".join(cur_line))
                cur_line = [parts[1]]
                continue
            cur_line.append(w)
            test_surf = self.font_body.render(" ".join(cur_line), True, COLOR_PARCHMENT)
            if test_surf.get_width() > max_w:
                cur_line.pop()
                lines.append(" ".join(cur_line))
                cur_line = [w]
        if cur_line:
            lines.append(" ".join(cur_line))

        draw_y = panel_rect.y + 94
        for line in lines[:8]:
            l_surf = self.font_body.render(line, True, COLOR_PARCHMENT)
            surface.blit(l_surf, (panel_rect.x + 24, draw_y))
            draw_y += 26

"""
100 Nights as a Vampire - Game Settings & Configurations
"""

import os

# Window / Display
TITLE = "100 Nights as a Vampire"
SCREEN_WIDTH = 1280
SCREEN_HEIGHT = 720
FPS = 60

# Directory paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
IMAGES_DIR = os.path.join(ASSETS_DIR, "images")
SOUNDS_DIR = os.path.join(ASSETS_DIR, "sounds")
FONTS_DIR = os.path.join(ASSETS_DIR, "fonts")
SAVE_DIR = os.path.join(BASE_DIR, "saves")

# Gothic Color Palette
COLOR_OBSIDIAN = (11, 12, 16)
COLOR_DEEP_BG = (15, 14, 20)
COLOR_PANEL_BG = (24, 22, 32)
COLOR_PANEL_BORDER = (75, 45, 60)
COLOR_PANEL_HOVER = (40, 32, 50)

COLOR_BLOOD = (178, 24, 43)
COLOR_CRIMSON = (220, 38, 38)
COLOR_DARK_RED = (105, 16, 28)
COLOR_HEALTH_GREEN = (34, 197, 94)
COLOR_ENERGY_BLUE = (59, 130, 246)
COLOR_ENERGY_PURPLE = (147, 51, 234)
COLOR_SECRECY_EYE = (245, 158, 11)
COLOR_GOLD = (234, 179, 8)
COLOR_SILVER = (190, 195, 205)

COLOR_PARCHMENT = (230, 222, 211)
COLOR_TEXT_MUTED = (160, 150, 165)
COLOR_TEXT_DIM = (110, 100, 120)

COLOR_BLOOD_MOON = (235, 45, 45)
COLOR_NORMAL_MOON = (225, 230, 245)

# Game Rules
MAX_NIGHTS = 100
DEFAULT_HEALTH = 100
DEFAULT_HUNGER = 25  # 0 is sated, 100 is starving frenzy
DEFAULT_SECRECY = 85 # 100 is fully anonymous, 0 is fully exposed
DEFAULT_ENERGY = 70
DEFAULT_MONEY = 120

# Difficulty Scaling milestones
MILESTONE_NIGHTS = [25, 50, 75, 100]

# Sound Volumes
MUSIC_VOLUME = 0.6
SFX_VOLUME = 0.7

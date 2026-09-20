#!/usr/bin/env python3
"""
100 Nights as a Vampire
========================
A gothic survival RPG created in Python and Pygame.
Survive 100 nights through strategy, blood management, secrecy, and supernatural intrigue.
"""

import sys
import os

# Ensure package path is on sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

def verify_dependencies():
    """Verify that Pygame is installed; if not, print user-friendly instructions."""
    try:
        import pygame
        return True
    except ImportError:
        print("\n" + "=" * 65)
        print("  [ERROR] Pygame is not installed!")
        print("=" * 65)
        print("To run '100 Nights as a Vampire', please install Pygame via pip:\n")
        print("    pip install pygame\n")
        print("Or if using python3 explicitly:\n")
        print("    python3 -m pip install pygame\n")
        print("=" * 65 + "\n")
        return False

def main():
    print("=" * 65)
    print("      ✦  100 NIGHTS AS A VAMPIRE  ✦")
    print("      A Gothic Survival RPG of Thirst, Secrecy & Immortality")
    print("=" * 65)
    
    if not verify_dependencies():
        sys.exit(1)

    try:
        from game import Game
        app = Game()
        app.run()
    except Exception as e:
        print(f"\n[CRITICAL ERROR DURING GAMEPLAY]: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()

"""
100 Nights as a Vampire - JSON Save & Load System
"""

import os
import json
from typing import Dict, Any, Optional, List
from settings import SAVE_DIR

class SaveSystem:
    def __init__(self):
        if not os.path.exists(SAVE_DIR):
            os.makedirs(SAVE_DIR, exist_ok=True)

    def get_save_path(self, slot: int = 1) -> str:
        return os.path.join(SAVE_DIR, f"save_slot_{slot}.json")

    def get_auto_save_path(self) -> str:
        return os.path.join(SAVE_DIR, "auto_save.json")

    def save_game(self, player, slot: int = 1) -> bool:
        path = self.get_save_path(slot)
        try:
            data = {
                "version": "1.0",
                "slot": slot,
                "player_data": player.to_dict()
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error saving game to {path}: {e}")
            return False

    def auto_save(self, player) -> bool:
        path = self.get_auto_save_path()
        try:
            data = {
                "version": "1.0",
                "slot": "auto",
                "player_data": player.to_dict()
            }
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            return True
        except Exception as e:
            print(f"Error auto-saving game: {e}")
            return False

    def load_game(self, player, slot: int = 1) -> bool:
        path = self.get_save_path(slot)
        if not os.path.exists(path):
            return False
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            player_data = data.get("player_data", {})
            player.load_from_dict(player_data)
            return True
        except Exception as e:
            print(f"Error loading save from {path}: {e}")
            return False

    def load_auto_save(self, player) -> bool:
        path = self.get_auto_save_path()
        if not os.path.exists(path):
            return False
        try:
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
            player_data = data.get("player_data", {})
            player.load_from_dict(player_data)
            return True
        except Exception as e:
            print(f"Error loading auto save: {e}")
            return False

    def list_saved_slots(self) -> List[Dict[str, Any]]:
        slots = []
        for i in range(1, 4):
            path = self.get_save_path(i)
            if os.path.exists(path):
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    p = data.get("player_data", {})
                    slots.append({
                        "slot": i,
                        "exists": True,
                        "night": p.get("night", 1),
                        "health": p.get("health", 100),
                        "secrecy": p.get("secrecy", 85)
                    })
                except Exception:
                    slots.append({"slot": i, "exists": False})
            else:
                slots.append({"slot": i, "exists": False})
        return slots

"""
100 Nights as a Vampire - NPC Character & Relationship System
"""

from typing import Dict, Any, List

class Character:
    def __init__(self, char_id: str, name: str, title: str, description: str, base_trust: int = 50):
        self.char_id = char_id
        self.name = name
        self.title = title
        self.description = description
        self.trust = base_trust  # 0 to 100
        self.status = "Neutral"  # Hostile, Distrustful, Neutral, Friendly, Allied, Devoted, Romance
        self.notes: List[str] = []
        self.history: List[str] = []

    def modify_trust(self, delta: int, reason: str = "") -> str:
        old_trust = self.trust
        self.trust = max(0, min(100, self.trust + delta))
        actual_delta = self.trust - old_trust
        
        # Update status
        if self.trust >= 85:
            self.status = "Allied"
        elif self.trust >= 65:
            self.status = "Friendly"
        elif self.trust >= 40:
            self.status = "Neutral"
        elif self.trust >= 20:
            self.status = "Distrustful"
        else:
            self.status = "Hostile"

        msg = f"{self.name}'s trust {'+' if actual_delta >= 0 else ''}{actual_delta} (Now {self.trust}/100: {self.status})."
        if reason:
            self.history.append(f"{reason} ({'+' if actual_delta >= 0 else ''}{actual_delta})")
        return msg

    def to_dict(self) -> Dict[str, Any]:
        return {
            "char_id": self.char_id,
            "trust": self.trust,
            "status": self.status,
            "notes": self.notes,
            "history": self.history
        }

    def load_from_dict(self, data: Dict[str, Any]):
        self.trust = data.get("trust", 50)
        self.status = data.get("status", "Neutral")
        self.notes = data.get("notes", [])
        self.history = data.get("history", [])


def create_default_characters() -> Dict[str, Character]:
    return {
        "mentor": Character(
            "mentor",
            "Lord Valerius",
            "The Ancient Sire & Mentor",
            "An aristocratic elder of the obsidian court who pulled you from mortal death. Elegant, strict, but harboring deep guilt over the coming Blood Moon.",
            base_trust=60
        ),
        "rival": Character(
            "rival",
            "Julian Blackwood",
            "The Ambitious Vampire Rival",
            "A charismatic, ruthless young vampire aristocrat who views you as an untested upstart trespassing upon his feeding rights.",
            base_trust=35
        ),
        "hunter": Character(
            "hunter",
            "Detective Jonathan Cross",
            "The Relentless Inquisitor",
            "A scarred municipal detective armed with sanctified silver and ultraviolet bulbs. Searching for who slaughtered his partner.",
            base_trust=15
        ),
        "queen": Character(
            "queen",
            "Queen Morvath",
            "Sovereign of the Blood Throne",
            "An immortal monarch ruling the shadowed alleys and high towers from her crystalline throne. Demands absolute elegance and obedience.",
            base_trust=40
        ),
        "mysterious_human": Character(
            "mysterious_human",
            "Elena Vance",
            "The Occult Botanist",
            "A brilliant, quiet scholar fascinated by night-blooming lunar flora and crimson alchemical elixirs. She suspects your true nature.",
            base_trust=45
        ),
        "werewolf": Character(
            "werewolf",
            "Gerald the Gray Mane",
            "Alpha of the Ashwood Pack",
            "A massive, scarred werewolf guarding the deep outskirts. Despises vampire parasites, but respects genuine strength and honest pacts.",
            base_trust=25
        ),
        "witch": Character(
            "witch",
            "Madam Morgana",
            "Keeper of Forgotten Runes",
            "An eccentric crone residing in the subterranean catacombs. Deals in forbidden talismans, tarot divination, and blood moon omens.",
            base_trust=50
        ),
        "human_friend": Character(
            "human_friend",
            "Sarah Jenkins",
            "Your Mortal Anchor",
            "Your dearest friend from your previous life before you vanished into the night. She worries about your pale skin and late-night habits.",
            base_trust=75
        )
    }

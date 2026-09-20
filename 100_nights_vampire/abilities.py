"""
100 Nights as a Vampire - Vampire Abilities System
"""

from typing import Dict, Any

class Ability:
    def __init__(self, ability_id: str, name: str, description: str, base_cost: int, max_level: int = 3):
        self.ability_id = ability_id
        self.name = name
        self.description = description
        self.base_cost = base_cost
        self.level = 0  # 0 = Locked, 1 = Active, 2 = Adept, 3 = Master
        self.max_level = max_level

    @property
    def is_unlocked(self) -> bool:
        return self.level > 0

    @property
    def current_energy_cost(self) -> int:
        if self.level <= 0:
            return self.base_cost
        # Higher levels reduce energy consumption
        discount = (self.level - 1) * 4
        return max(5, self.base_cost - discount)

    @property
    def upgrade_cost(self) -> int:
        if self.level == 0:
            return 80
        elif self.level == 1:
            return 160
        elif self.level == 2:
            return 280
        return 999999

    def upgrade(self, player) -> bool:
        if self.level >= self.max_level:
            return False
        cost = self.upgrade_cost
        if player.money >= cost:
            player.money -= cost
            self.level += 1
            return True
        return False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "ability_id": self.ability_id,
            "level": self.level
        }

    def load_from_dict(self, data: Dict[str, Any]):
        self.level = data.get("level", 0)


def create_default_abilities() -> Dict[str, Ability]:
    return {
        "superhuman_speed": Ability(
            "superhuman_speed",
            "Superhuman Speed",
            "Accelerate your perception and muscle twitches to a blur. Strike twice in combat or outrun pursuing hunters.",
            base_cost=15
        ),
        "hypnosis": Ability(
            "hypnosis",
            "Hypnotic Gaze",
            "Lock eyes with mortals to bend their wills, wipe suspicious memories (+Secrecy), or pacify enemies in battle.",
            base_cost=20
        ),
        "night_vision": Ability(
            "night_vision",
            "Night Vision & Blood Sight",
            "Detect hidden passageways, uncover concealed contraband, and predict enemy ambushes before they strike.",
            base_cost=10
        ),
        "shadow_teleportation": Ability(
            "shadow_teleportation",
            "Shadow Step",
            "Melt into one shadow and emerge from another. Bypass locks, bypass barricades, or teleport behind targets.",
            base_cost=25
        ),
        "vampire_charm": Ability(
            "vampire_charm",
            "Vampiric Allure",
            "Radiate an irresistible aura of nocturnal elegance. Boosts relationship gains and lowers market prices.",
            base_cost=15
        ),
        "regeneration": Ability(
            "regeneration",
            "Blood Regeneration",
            "Stir the undead ichor in your veins to rapidly seal bullet wounds, burns, and slash marks into smooth skin.",
            base_cost=20
        ),
        "bat_transformation": Ability(
            "bat_transformation",
            "Bat Form",
            "Shape-shift into a swift bat. Soar across high gothic rooftops, survey the city from above, and evade traps.",
            base_cost=30
        )
    }

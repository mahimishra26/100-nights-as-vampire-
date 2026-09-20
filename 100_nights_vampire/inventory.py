"""
100 Nights as a Vampire - Inventory & Item System
"""

from typing import Dict, List, Optional, Any

class Item:
    def __init__(self, item_id: str, name: str, description: str, category: str, 
                 cost: int = 50, usable_in_combat: bool = True, usable_in_field: bool = True):
        self.item_id = item_id
        self.name = name
        self.description = description
        self.category = category  # 'consumable', 'equipment', 'artifact'
        self.cost = cost
        self.usable_in_combat = usable_in_combat
        self.usable_in_field = usable_in_field

    def to_dict(self) -> Dict[str, Any]:
        return {
            "item_id": self.item_id,
            "name": self.name,
            "description": self.description,
            "category": self.category,
            "cost": self.cost
        }

    def use(self, player, combat: Optional[Any] = None) -> str:
        """Apply item effects to player or in combat."""
        return f"Used {self.name}."


class BloodBagItem(Item):
    def __init__(self, item_id: str, name: str, desc: str, hunger_reduction: int, health_gain: int, cost: int):
        super().__init__(item_id, name, desc, "consumable", cost, usable_in_combat=True, usable_in_field=True)
        self.hunger_reduction = hunger_reduction
        self.health_gain = health_gain

    def use(self, player, combat: Optional[Any] = None) -> str:
        old_hunger = player.hunger
        player.hunger = max(0, player.hunger - self.hunger_reduction)
        if self.health_gain > 0:
            player.heal(self.health_gain)
        relieved = old_hunger - player.hunger
        return f"Drank {self.name}. Hunger reduced by {relieved} (now {player.hunger}%)."


class EnergyElixirItem(Item):
    def __init__(self, item_id: str, name: str, desc: str, energy_gain: int, cost: int):
        super().__init__(item_id, name, desc, "consumable", cost, usable_in_combat=True, usable_in_field=True)
        self.energy_gain = energy_gain

    def use(self, player, combat: Optional[Any] = None) -> str:
        player.energy = min(player.max_energy, player.energy + self.energy_gain)
        return f"Consumed {self.name}. Restored {self.energy_gain} vampire energy."


class SmokeBombItem(Item):
    def __init__(self):
        super().__init__("smoke_bomb", "Shadow Smoke Bomb", 
                         "A dense cloud of alchemical darkness. Guarantees 100% escape in combat or reduces exposure by 15.", 
                         "consumable", cost=45, usable_in_combat=True, usable_in_field=True)

    def use(self, player, combat: Optional[Any] = None) -> str:
        if combat:
            combat.escaped = True
            return "You shatter the smoke bomb! Thick black mist blinds your foes as you vanish into shadows."
        player.secrecy = min(100, player.secrecy + 15)
        return "You release shadow smoke to obscure your trail. Secrecy increased by +15."


class SilverAmuletItem(Item):
    def __init__(self):
        super().__init__("silver_amulet", "Silver Moon Amulet", 
                         "A warded talisman that shields the mind from holy inquisitor magic. Grants +10% damage resistance.", 
                         "equipment", cost=120, usable_in_combat=False, usable_in_field=False)


class CryptKeyItem(Item):
    def __init__(self):
        super().__init__("crypt_key", "Obsidian Crypt Key", 
                         "An ornate key engraved with the crest of the First Nocturnal Coven. Unlocks ancient vaults.", 
                         "artifact", cost=0, usable_in_combat=False, usable_in_field=False)


ITEM_REGISTRY: Dict[str, Item] = {
    "rat_blood": BloodBagItem("rat_blood", "Vial of Vermin Blood", "Bitter rodent blood. Quenches thirst slightly (-15 Hunger).", 15, 0, 15),
    "preserved_blood": BloodBagItem("preserved_blood", "Preserved Blood Pack (O-)", "Medical grade blood stolen from the clinic. Quenches thirst (-40 Hunger) and heals +15 HP.", 40, 15, 60),
    "aristocrat_wine": BloodBagItem("aristocrat_wine", "Aristocrat's Crimson Vintage", "Exquisite blood decanted with rare vintage wine. (-60 Hunger, +25 HP, +20 Energy).", 60, 25, 140),
    "energy_tonic": EnergyElixirItem("energy_tonic", "Moonlit Draught", "A glowing vial that stirs vampire blood. Restores +40 Energy.", 40, 40),
    "smoke_bomb": SmokeBombItem(),
    "silver_amulet": SilverAmuletItem(),
    "crypt_key": CryptKeyItem()
}


class Inventory:
    def __init__(self):
        # Dictionary of item_id -> quantity
        self.items: Dict[str, int] = {
            "rat_blood": 2,
            "energy_tonic": 1
        }

    def add_item(self, item_id: str, quantity: int = 1) -> None:
        if item_id in self.items:
            self.items[item_id] += quantity
        else:
            self.items[item_id] = quantity

    def remove_item(self, item_id: str, quantity: int = 1) -> bool:
        if item_id in self.items and self.items[item_id] >= quantity:
            self.items[item_id] -= quantity
            if self.items[item_id] <= 0:
                del self.items[item_id]
            return True
        return False

    def has_item(self, item_id: str, quantity: int = 1) -> bool:
        return self.items.get(item_id, 0) >= quantity

    def get_all_items(self) -> List[Dict[str, Any]]:
        result = []
        for item_id, qty in self.items.items():
            item_def = ITEM_REGISTRY.get(item_id)
            if item_def:
                result.append({
                    "item": item_def,
                    "quantity": qty
                })
        return result

    def to_dict(self) -> Dict[str, int]:
        return dict(self.items)

    def load_from_dict(self, data: Dict[str, int]) -> None:
        self.items = dict(data)

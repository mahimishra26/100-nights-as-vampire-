"""
100 Nights as a Vampire - Locations System
"""

from typing import Dict, List, Any

class Location:
    def __init__(self, loc_id: str, name: str, icon: str, subtitle: str, 
                 description: str, danger_level: int, npcs: List[str], 
                 loot_types: List[str]):
        self.loc_id = loc_id
        self.name = name
        self.icon = icon
        self.subtitle = subtitle
        self.description = description
        self.danger_level = danger_level  # 1 (Safe) to 5 (Lethal)
        self.npcs = npcs
        self.loot_types = loot_types

    def to_dict(self) -> Dict[str, Any]:
        return {
            "loc_id": self.loc_id,
            "name": self.name,
            "icon": self.icon,
            "subtitle": self.subtitle,
            "description": self.description,
            "danger_level": self.danger_level,
            "npcs": self.npcs,
            "loot_types": self.loot_types
        }


LOCATIONS_DATA: Dict[str, Location] = {
    "mansion": Location(
        "mansion",
        "Vampire Haven Mansion",
        "🏰",
        "Sanctuary of the Obsidian Court",
        "A sprawling gothic estate shrouded in perpetual fog and warded by ancient gargoyles. Here you can rest, consult Lord Valerius, and study family archives in safety.",
        danger_level=1,
        npcs=["mentor", "rival"],
        loot_types=["lore", "money", "rest"]
    ),
    "downtown": Location(
        "downtown",
        "Gothic Downtown",
        "🌃",
        "Gaslit Alleys & Teeming Crowds",
        "Cobblestone avenues where mortal revellers, street urchins, and patrolling police mingle under neon and lamplight. Abundant prey, but watchful eyes lurk in every corner.",
        danger_level=2,
        npcs=["human_friend", "hunter"],
        loot_types=["blood", "money"]
    ),
    "graveyard": Location(
        "graveyard",
        "Blackwood Cemetery",
        "🪦",
        "Ancient Crypts & Resting Spirits",
        "Weathered mausoleums covered in ivy and wrought iron. Whispers of buried necromantic tomes, roaming ghouls, and grave robbers looking for quick coin.",
        danger_level=2,
        npcs=["witch"],
        loot_types=["relics", "dark_mana", "money"]
    ),
    "academy": Location(
        "academy",
        "St. Jude's Old Academy",
        "🏫",
        "Scholarly Archives & Occult Libraries",
        "A grand Victorian university containing forbidden grimoires, preserved alchemical specimens, and historical records of the city's dark covenant.",
        danger_level=2,
        npcs=["mysterious_human"],
        loot_types=["lore", "elixirs", "clues"]
    ),
    "nightclub": Location(
        "nightclub",
        "The Velvet Veil",
        "🍷",
        "VIP Lounges & Decadent Shadows",
        "A neon-drenched subterranean nightclub frequented by wealthy aristocrats, nocturnal socialites, and rival vampires looking for discrete feeding or turf trades.",
        danger_level=3,
        npcs=["rival", "queen"],
        loot_types=["blood", "connections", "money"]
    ),
    "forest": Location(
        "forest",
        "Ashwood Forest",
        "🌲",
        "Primal Woods & Wolf Territory",
        "An ancient misty timberland ringing the city perimeter. Lunar wolves prowl between hemlocks and ancient monoliths. Trespassers are rarely shown mercy.",
        danger_level=4,
        npcs=["werewolf"],
        loot_types=["rare_herbs", "wolfsbane", "beast_essence"]
    ),
    "church": Location(
        "church",
        "St. Michael's Abandoned Chapel",
        "⛪",
        "Hallowed Ground & Inquisitor Nest",
        "A desecrated stone cathedral with cracked stained glass. Even abandoned, holy residue burns vampire flesh, and Detective Cross uses the bell tower as a forward post.",
        danger_level=4,
        npcs=["hunter"],
        loot_types=["holy_water", "silver_amulet", "inquisitor_notes"]
    ),
    "hospital": Location(
        "hospital",
        "Mercy General Hospital",
        "🏥",
        "Sterile Blood Banks & Silent Wards",
        "A labyrinth of fluorescent corridors, locked hematology labs, and quiet terminal wards. High-grade refrigerated O-negative blood packs can be stolen or bribed.",
        danger_level=3,
        npcs=["mysterious_human", "human_friend"],
        loot_types=["blood_packs", "medicine", "syringes"]
    ),
    "market": Location(
        "market",
        "Catacomb Black Market",
        "🕯️",
        "Forbidden Bazaar of the Damned",
        "Located beneath the sewers in Roman aqueducts. Witches, dhampirs, and smugglers sell forbidden talismans, forged human identities, and enchanted weapons.",
        danger_level=3,
        npcs=["witch", "queen"],
        loot_types=["enchanted_items", "forged_papers", "elixirs"]
    )
}

LOCATION_REGISTRY = LOCATIONS_DATA

def get_unlocked_locations(night: int) -> List[str]:
    """Returns list of unlocked location keys based on night progress."""
    unlocked = ["mansion", "downtown", "graveyard", "academy", "nightclub"]
    if night >= 5:
        unlocked.append("forest")
    if night >= 10:
        unlocked.append("church")
    if night >= 15:
        unlocked.append("hospital")
    if night >= 20:
        unlocked.append("market")
    return unlocked

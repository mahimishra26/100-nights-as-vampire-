# 100 Nights as a Vampire 🩸

A complete, atmospheric gothic survival RPG built with **Python** and **Pygame**.

Survive 100 nights in a rain-slicked Victorian metropolis ruled by nocturnal covens, inquisitor hunters, and ancient shadows. Manage your thirst, protect your mortal secrets, forge alliances, and prepare for the apocalyptic **Blood Moon**.

---

## 🎮 Core Concept & Objective

You are a newly turned vampire in the city of **Oakhaven**. The ancient elders whisper of the **Hundredth Night**—the celestial Blood Moon that will either crown a new immortal monarch or purge all darkness forever.

### Vital Parameters to Manage Every Night:
- 🩸 **Hunger (0–100%)**: Higher hunger risks starvation damage and violent loss of control.
- ❤️ **Health (0–100 HP)**: Your physical vitality. Reaching 0 turns you to ash.
- 🕵️ **Secrecy (0–100%)**: How well your vampire nature remains hidden from humans and inquisitors. Dropping below 20 triggers relentless hunter raids.
- ⚡ **Vampire Energy (0–100⚡)**: Spent to activate supernatural disciplines in exploration and battle.
- 💰 **Money ($)**: Used to purchase refrigerated blood packs, occult talismans, and ability upgrades.
- 🤝 **Relationships (0–100)**: Trust with 8 unique NPCs across vampires, humans, werewolves, and witches.
- 🌙 **Current Night (1–100)**: Tracks your survival progress toward the final confrontation.

---

## 🚀 Installation & Running

### Requirements:
- **Python 3.8+**
- **Pygame**

### 1. Install Dependencies
```bash
pip install pygame
```
*Or on macOS / Linux:*
```bash
python3 -m pip install pygame
```

### 2. Launch the Game
```bash
cd 100_nights_vampire
python main.py
```
*(Or `python3 main.py`)*

---

## 🏰 Interactive Locations

Explore 9 unique gothic locations each night:
1. 🏰 **Vampire Mansion** - Safe sanctuary, rest in warded coffins, study occult codices with Lord Valerius.
2. 🌃 **Gothic Downtown** - Crowded avenues, alleyway prey, pickpocketing, high surveillance.
3. 🪦 **Blackwood Cemetery** - Crypts, necromantic relics, grave robbers, and feral ghouls.
4. 🏫 **St. Jude's Old Academy** - Alchemical manuscripts, Elena Vance's research archives.
5. 🍷 **The Velvet Veil Nightclub** - VIP lounges, decadent aristocrats, territory trades with Julian.
6. 🌲 **Ashwood Forest** - Primal woods guarded by Gerald the Werewolf Alpha.
7. ⛪ **St. Michael's Abandoned Church** - Hallowed ground, holy relics, Detective Cross's surveillance nest.
8. 🏥 **Mercy General Hospital** - Cold storage hematology labs with sterile blood packs.
9. 🕯️ **Catacomb Black Market** - Subterranean bazaar of cursed artifacts, witches, and forged papers.

---

## ⚡ Vampire Abilities

Unlock and upgrade abilities up to Level 3:
- **Superhuman Speed**: Strike twice in combat, blitz through police lines, dodge ambushes.
- **Hypnotic Gaze**: Mesmerize mortals to erase suspicious memories (+Secrecy) or pacify combatants.
- **Night Vision**: Detect hidden passageways, spot ambushes, uncover buried relics.
- **Shadow Step**: Teleport through barriers, bypass locked doors, ambush foes.
- **Vampiric Allure**: Seduce mortals for discrete feeding, boost trust gains, obtain store discounts.
- **Blood Regeneration**: Stir undead blood to rapidly heal physical wounds (+HP).
- **Bat Form**: Transform into a bat swarm to scout the city or flee from lethal encounters.

---

## 🤝 The 8 NPCs & Relationship System

- **Lord Valerius**: The ancient Sire & mentor who saved you from death.
- **Julian Blackwood**: An ambitious rival vampire seeking to harvest your Eclipse Key.
- **Detective Jonathan Cross**: A scarred inquisitor tracking anomalous killings with silver and UV flares.
- **Queen Morvath**: Sovereign of the Blood Throne, ruler of the nocturnal court.
- **Elena Vance**: Brilliant occult botanist studying lunar alchemical flora.
- **Gerald the Gray Mane**: Massive werewolf Alpha guarding the outer woods.
- **Madam Morgana**: Mysterious subterranean witch trading in prophecies and smoke bombs.
- **Sarah Jenkins**: Your mortal best friend from before your transformation.

---

## ⚔️ Turn-Based Combat System

When ambushed by hunters or monsters, engage in tactical turn-based combat:
- **[1] Strike with Claws**: Basic high-power physical strike.
- **[2] Vampire Fang Drain**: High-risk attack that damages the enemy while healing and feeding you!
- **[3] Defend**: Reduce incoming damage by 60% and recover focus (+15 Energy).
- **[4] Super Speed Blitz**: Double-slash attack.
- **[5] Hypnotize Foe**: Stun the enemy, causing them to forfeit their turn.
- **[6] Flee / Escape**: Use agility or Shadow Smoke Bombs to escape unharmed.

---

## 📜 Story Milestones & Multiple Endings

- **Night 25**: Confrontation with Detective Cross — choose between truce, hypnosis, or silver gunfire.
- **Night 50**: Julian Blackwood's coup attempt at the Velvet Veil — uncovering the Eclipse Bloodline.
- **Night 75**: Inquisitor citywide crusade — uniting werewolves and vampires or disabling the grid.
- **Night 100**: The Blood Moon Ascendant — facing the Ancient Eclipse Sovereign.

### 6 Unique Endings:
1. 👑 **Vampire Monarch Ending**: Ascend the blood throne beside the Queen.
2. ❤️ **Human Love Ending**: Forsake the dark crown to live peacefully in hiding with your mortal anchor.
3. 🌅 **Redemption Ending**: Partner with Detective Cross and the witches to cleanse the dark curse.
4. 🦇 **Eternal Vampire Ending**: Wander the century ahead as a lone mythical shadow.
5. 🌑 **Dark Lord Ending**: Consume the Blood Moon's ancient core to plunge the earth into eternal night.
6. 💀 **Defeated Ending**: Perish from wounds, starvation frenzy, or inquisition execution.

---

## 💾 Save & Load System

The game automatically saves progress at the dawn of every night in `saves/auto_save.json`. Manual saving to multiple slots is accessible through the pause menu (`[P]` or `[ESC]`).

---

## 🎹 Controls Summary

| Key | Action |
| --- | --- |
| **Mouse Left Click** | Select locations, choices, and menu items |
| **1 – 6** | Select dialogue choices / Combat actions / Quick feed |
| **I** | Open Satchel / Inventory |
| **A** | Open Vampire Disciplines & Abilities |
| **R** | Open Covens & NPC Trust Roster |
| **P / ESC** | Pause Game / Return to Map |
| **Spacebar** | Advance / Continue |

May the night embrace you, fledgling.

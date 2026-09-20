"""
100 Nights as a Vampire - Turn-Based Combat Engine
"""

import random
from typing import Dict, List, Optional, Any

class Enemy:
    def __init__(self, enemy_id: str, name: str, health: int, attack_power: int, 
                 defense: int, speed: int, reward_money: int, reward_blood: int,
                 description: str, special_ability: str = ""):
        self.enemy_id = enemy_id
        self.name = name
        self.max_health = health
        self.health = health
        self.attack_power = attack_power
        self.defense = defense
        self.speed = speed
        self.reward_money = reward_money
        self.reward_blood = reward_blood
        self.description = description
        self.special_ability = special_ability
        self.is_stunned = False
        self.is_defending = False

    def take_damage(self, dmg: int) -> int:
        if self.is_defending:
            dmg = max(1, int(dmg * 0.5))
        actual = max(1, dmg - self.defense)
        self.health = max(0, self.health - actual)
        return actual


def get_enemy_for_encounter(night: int, loc_id: str, is_boss: bool = False) -> Enemy:
    if is_boss or night >= 100:
        return Enemy(
            "eclipse_sovereign",
            "The Eclipse Sovereign",
            health=220 + (night * 2),
            attack_power=32,
            defense=8,
            speed=20,
            reward_money=500,
            reward_blood=100,
            description="The primordial vampire ancestor reborn under the Blood Moon, wreathed in crimson lightning and ancient shadow blades.",
            special_ability="Eclipse Nova"
        )
    
    # Scale by night
    scaler = night // 15
    
    if loc_id == "church" or night in [24, 74]:
        return Enemy(
            "inquisitor",
            "Inquisitor Zealot",
            health=65 + (scaler * 10),
            attack_power=16 + scaler,
            defense=4,
            speed=12,
            reward_money=60 + (scaler * 15),
            reward_blood=20,
            description="A heavily armored hunter bearing a blessed silver blade and incendiary stakes.",
            special_ability="Silver Brand"
        )
    elif loc_id == "forest":
        return Enemy(
            "werewolf",
            "Ashwood Werewolf",
            health=85 + (scaler * 12),
            attack_power=20 + scaler,
            defense=5,
            speed=18,
            reward_money=40,
            reward_blood=35,
            description="A massive bipedal predator with yellow eyes and razor claws that rend through flesh.",
            special_ability="Lycan Frenzy"
        )
    elif loc_id == "graveyard":
        return Enemy(
            "feral_ghoul",
            "Starved Crypt Ghoul",
            health=45 + (scaler * 8),
            attack_power=14 + scaler,
            defense=2,
            speed=10,
            reward_money=25,
            reward_blood=30,
            description="A wretched degenerate vampire who lost its mind to hunger decades ago.",
            special_ability="Corpse Claw"
        )
    elif loc_id in ["nightclub", "mansion"]:
        return Enemy(
            "rival_enforcer",
            "Blackwood Syndicate Enforcer",
            health=60 + (scaler * 10),
            attack_power=18 + scaler,
            defense=4,
            speed=15,
            reward_money=80 + (scaler * 10),
            reward_blood=25,
            description="A dapper vampire thug armed with suppressed silver pistols and shadow darts.",
            special_ability="Shadow Dart"
        )
    else:
        return Enemy(
            "hunter_patrol",
            "Vampire Hunter Scout",
            health=50 + (scaler * 8),
            attack_power=14 + scaler,
            defense=3,
            speed=11,
            reward_money=50,
            reward_blood=15,
            description="A vigilant mortal vigilante tracking thermal anomalies with infrared goggles.",
            special_ability="Flashbang"
        )


class CombatManager:
    def __init__(self, player, enemy: Enemy):
        self.player = player
        self.enemy = enemy
        self.turn = 1
        self.combat_logs: List[str] = [
            f"Battle engaged with {enemy.name}!",
            f"{enemy.description}"
        ]
        self.is_over = False
        self.escaped = False
        self.player_won = False
        self.player_defending = False

    def player_attack(self) -> str:
        if self.is_over:
            return ""
        
        # Base attack calculation
        speed_bonus = self.player.abilities["superhuman_speed"].level * 3
        crit = random.random() < (0.15 + (speed_bonus * 0.02))
        dmg = random.randint(18, 28) + speed_bonus
        if crit:
            dmg = int(dmg * 1.5)
            
        dealt = self.enemy.take_damage(dmg)
        msg = f"You strike with supernatural force for {dealt} damage{' (CRITICAL HIT!)' if crit else ''}."
        self.combat_logs.append(msg)
        
        if self.enemy.health <= 0:
            self._handle_victory()
            return msg
            
        self._enemy_turn()
        return msg

    def player_bite(self) -> str:
        """High risk feeding attack in combat."""
        if self.is_over:
            return ""
        
        # Chance to hit depends on enemy health or speed
        hit_chance = 0.65 if self.enemy.health < self.enemy.max_health * 0.5 else 0.45
        if random.random() < hit_chance:
            dmg = random.randint(22, 35)
            dealt = self.enemy.take_damage(dmg)
            healed = self.player.heal(18)
            hunger_cut = 35
            self.player.hunger = max(0, self.player.hunger - hunger_cut)
            msg = f"You lunge and sink your fangs into {self.enemy.name}! Dealt {dealt} dmg, healed +{healed} HP, hunger -{hunger_cut}%."
            self.combat_logs.append(msg)
            if self.enemy.health <= 0:
                self._handle_victory()
                return msg
        else:
            msg = f"{self.enemy.name} parried your bite attempt!"
            self.combat_logs.append(msg)
            
        self._enemy_turn()
        return msg

    def player_use_ability(self, ability_id: str) -> str:
        if self.is_over:
            return ""
            
        ability = self.player.abilities.get(ability_id)
        if not ability or not ability.is_unlocked:
            return "Ability not unlocked."
            
        cost = ability.current_energy_cost
        if not self.player.spend_energy(cost):
            return f"Not enough energy! Needs {cost}⚡."

        msg = ""
        if ability_id == "superhuman_speed":
            # Swift double slash
            dmg1 = random.randint(15, 22)
            dmg2 = random.randint(15, 22)
            t1 = self.enemy.take_damage(dmg1)
            t2 = self.enemy.take_damage(dmg2)
            msg = f"Superhuman Speed: You blur forward, striking twice for {t1} + {t2} damage!"
            self.combat_logs.append(msg)
            if self.enemy.health <= 0:
                self._handle_victory()
                return msg
            self._enemy_turn()

        elif ability_id == "hypnosis":
            self.enemy.is_stunned = True
            msg = f"Hypnotic Gaze: Your eyes burn with crimson witch-fire! {self.enemy.name} is mesmerized and loses their turn!"
            self.combat_logs.append(msg)
            # Enemy stunned, skip enemy turn!

        elif ability_id == "regeneration":
            healed = self.player.heal(35 + (ability.level * 10))
            msg = f"Blood Regeneration: Wounds instantly knit shut! Restored +{healed} HP."
            self.combat_logs.append(msg)
            self._enemy_turn()

        elif ability_id == "shadow_teleportation":
            dmg = random.randint(28, 40)
            dealt = self.enemy.take_damage(dmg)
            msg = f"Shadow Step: You dissolve into mist and manifest behind your foe, dealing {dealt} ambush damage!"
            self.combat_logs.append(msg)
            if self.enemy.health <= 0:
                self._handle_victory()
                return msg
            self._enemy_turn()
            
        elif ability_id == "bat_transformation":
            self.escaped = True
            self.is_over = True
            msg = "Bat Form: You burst into a storm of bats and flutter into the night sky, escaping the battle unharmed!"
            self.combat_logs.append(msg)
            return msg

        else:
            msg = f"Used {ability.name}."
            self.combat_logs.append(msg)
            self._enemy_turn()

        return msg

    def player_defend(self) -> str:
        if self.is_over:
            return ""
        self.player_defending = True
        self.player.restore_energy(15)
        msg = "You enter a defensive stance, shielding vital arteries and gathering focus (+15⚡)."
        self.combat_logs.append(msg)
        self._enemy_turn()
        self.player_defending = False
        return msg

    def player_escape(self) -> str:
        if self.is_over:
            return ""
        
        # Smoke bomb item check
        if self.player.inventory.has_item("smoke_bomb"):
            self.player.inventory.remove_item("smoke_bomb", 1)
            self.escaped = True
            self.is_over = True
            msg = "You detonate a Shadow Smoke Bomb and vanish into the night fog! Escaped cleanly."
            self.combat_logs.append(msg)
            return msg

        escape_chance = 0.55 + (self.player.abilities["superhuman_speed"].level * 0.1)
        if random.random() < escape_chance:
            self.escaped = True
            self.is_over = True
            msg = "You successfully leaped over the rooftops and escaped into the dark alleys."
            self.combat_logs.append(msg)
            return msg
        else:
            msg = "Failed to escape! The enemy cut off your retreat."
            self.combat_logs.append(msg)
            self._enemy_turn()
            return msg

    def _enemy_turn(self):
        if self.is_over or self.enemy.health <= 0:
            return
            
        if self.enemy.is_stunned:
            self.combat_logs.append(f"{self.enemy.name} shakes their head, recovering from hypnosis.")
            self.enemy.is_stunned = False
            return

        # Enemy action
        raw_dmg = random.randint(self.enemy.attack_power - 4, self.enemy.attack_power + 4)
        if self.player_defending:
            raw_dmg = max(2, int(raw_dmg * 0.4))
            
        taken = self.player.take_damage(raw_dmg)
        msg = f"{self.enemy.name} attacks you for {taken} damage!"
        self.combat_logs.append(msg)
        
        if self.player.health <= 0:
            self.is_over = True
            self.player_won = False
            self.combat_logs.append("You have succumbed to mortal injuries in combat...")

    def _handle_victory(self):
        self.is_over = True
        self.player_won = True
        self.player.money += self.enemy.reward_money
        self.player.hunger = max(0, self.player.hunger - self.enemy.reward_blood)
        msg = f"VICTORY! Defeated {self.enemy.name}. Gained +${self.enemy.reward_money} and fed (+{self.enemy.reward_blood} Blood)."
        self.combat_logs.append(msg)

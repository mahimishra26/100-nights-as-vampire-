"""
Test suite for 100 Nights as a Vampire core game systems
"""

import unittest
from player import Player
from inventory import ITEM_REGISTRY
from combat import CombatManager, get_enemy_for_encounter
from story import StoryManager
from save_system import SaveSystem
from events import generate_location_event

class TestVampireGame(unittest.TestCase):
    def setUp(self):
        self.player = Player()

    def test_initial_stats(self):
        self.assertEqual(self.player.health, 100)
        self.assertEqual(self.player.hunger, 25)
        self.assertEqual(self.player.secrecy, 85)
        self.assertEqual(self.player.night, 1)

    def test_feeding_mechanisms(self):
        # Rat feeding
        self.player.hunger = 60
        res = self.player.feed("rats")
        self.assertEqual(self.player.hunger, 40)
        self.assertIn("vermin", res)

        # Bag feeding
        self.player.inventory.add_item("preserved_blood", 1)
        res_bag = self.player.feed("bag")
        self.assertIn("chilled bag", res_bag)

    def test_ability_upgrade(self):
        speed = self.player.abilities["superhuman_speed"]
        self.assertEqual(speed.level, 1)
        self.player.money = 300
        success = speed.upgrade(self.player)
        self.assertTrue(success)
        self.assertEqual(speed.level, 2)

    def test_combat_loop(self):
        enemy = get_enemy_for_encounter(10, "downtown")
        mgr = CombatManager(self.player, enemy)
        self.assertFalse(mgr.is_over)
        
        # Player attack
        mgr.player_attack()
        self.assertTrue(len(mgr.combat_logs) > 2)

    def test_story_milestones(self):
        m25 = StoryManager.get_milestone_event(25)
        self.assertIsNotNone(m25)
        self.assertEqual(m25["character_id"], "hunter")

        m50 = StoryManager.get_milestone_event(50)
        self.assertIsNotNone(m50)
        self.assertEqual(m50["character_id"], "rival")

        m100 = StoryManager.get_milestone_event(100)
        self.assertIsNotNone(m100)

    def test_save_load_system(self):
        save_sys = SaveSystem()
        self.player.money = 777
        self.player.night = 15
        saved = save_sys.save_game(self.player, slot=2)
        self.assertTrue(saved)

        new_player = Player()
        loaded = save_sys.load_game(new_player, slot=2)
        self.assertTrue(loaded)
        self.assertEqual(new_player.money, 777)
        self.assertEqual(new_player.night, 15)

    def test_location_events(self):
        event = generate_location_event("mansion", self.player)
        self.assertIn("title", event)
        self.assertTrue(len(event["choices"]) >= 2)

if __name__ == "__main__":
    unittest.main()

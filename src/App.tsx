import { useState, useEffect } from 'react';
import {
  ScreenId,
  PlayerStats,
  VampireProfile,
  CharacterFriendship,
  VampirePower,
  MysteryClue,
  Achievement,
  MemoryMoment,
  MiniGameType
} from './types';
import {
  INITIAL_FRIENDS,
  INITIAL_POWERS,
  INITIAL_CLUES,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MEMORIES
} from './data/gameData';
import { GothicCanvas } from './components/GothicCanvas';
import { TopNavBar } from './components/TopNavBar';
import { AllScreensModal } from './components/AllScreensModal';
import { SplashAndMenuScreens } from './components/SplashAndMenuScreens';
import { CharacterScreens } from './components/CharacterScreens';
import { TutorialScreen } from './components/TutorialScreen';
import { HomeScreen } from './components/HomeScreen';
import { DaytimeExplorationScreens } from './components/DaytimeScreens';
import { FriendshipAndPowersScreens } from './components/FriendshipAndPowersScreens';
import { NightSurvivalScreens } from './components/NightSurvivalScreens';
import { MiniGamesScreen } from './components/MiniGamesScreen';
import { RewardsAndEndingsScreens } from './components/RewardsAndEndingsScreens';
import { sounds } from './audio/soundManager';

const DEFAULT_PROFILE: VampireProfile = {
  name: 'Rowan',
  hair: 'Short Waves',
  hairColor: 'Raven Black',
  skinTone: 'Fair Ivory',
  outfit: 'School Uniform & Cloak',
  petBatName: 'Pippin'
};

const DEFAULT_STATS: PlayerStats = {
  hunger: 15,
  secrecy: 90,
  energy: 85,
  coins: 45,
  night: 1,
  timeOfDay: 'day'
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('main_menu');
  const [showScreenModal, setShowScreenModal] = useState(false);
  const [muted, setMuted] = useState(false);

  // Core Game State
  const [profile, setProfile] = useState<VampireProfile>(() => {
    const saved = localStorage.getItem('vampire_cozy_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

  const [stats, setStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('vampire_cozy_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_STATS;
  });

  const [friends, setFriends] = useState<Record<string, CharacterFriendship>>(INITIAL_FRIENDS);
  const [powers, setPowers] = useState<VampirePower[]>(INITIAL_POWERS);
  const [clues, setClues] = useState<MysteryClue[]>(INITIAL_CLUES);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [memories, setMemories] = useState<MemoryMoment[]>(INITIAL_MEMORIES);

  const [activeFriendId, setActiveFriendId] = useState<string>('maya');
  const [mysteryBoxClaimedNight, setMysteryBoxClaimedNight] = useState<number>(0);

  // Persistence
  useEffect(() => {
    localStorage.setItem('vampire_cozy_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('vampire_cozy_profile', JSON.stringify(profile));
  }, [profile]);

  // Advance Night / Day phase
  const handleSleepOrNextPhase = () => {
    sounds.playDoor();
    if (stats.timeOfDay === 'day') {
      setStats((prev) => ({
        ...prev,
        timeOfDay: 'night',
        hunger: Math.min(100, prev.hunger + 15),
        energy: Math.min(100, prev.energy + 20)
      }));
      setCurrentScreen('night_prep');
    } else {
      // Night over -> advance to next day!
      const nextNight = stats.night + 1;
      setStats((prev) => ({
        ...prev,
        night: nextNight,
        timeOfDay: 'day',
        hunger: Math.min(100, prev.hunger + 20),
        energy: 100
      }));

      // Check unlock milestones
      if (nextNight >= 5) {
        setPowers((prev) =>
          prev.map((p) => (p.id === 'bat_form' ? { ...p, unlocked: true } : p))
        );
      }
      if (nextNight >= 15) {
        setPowers((prev) =>
          prev.map((p) => (p.id === 'super_speed' ? { ...p, unlocked: true } : p))
        );
      }

      if (nextNight >= 100) {
        setCurrentScreen('ending');
      } else if (nextNight === 25 || nextNight === 50 || nextNight === 75) {
        setCurrentScreen('blood_moon');
      } else {
        setCurrentScreen('night_summary');
      }
    }
  };

  const handleMiniGameReward = (success: boolean, msg: string) => {
    if (success) {
      setStats((prev) => ({
        ...prev,
        coins: prev.coins + 25,
        energy: Math.min(100, prev.energy + 15)
      }));
      sounds.playAchievement();
    }
    setCurrentScreen('home');
  };

  const handleBuyShopItem = (itemId: string) => {
    if (itemId === 'tea') {
      setStats((p) => ({ ...p, coins: p.coins - 15, energy: Math.min(100, p.energy + 35) }));
    } else if (itemId === 'jelly') {
      setStats((p) => ({ ...p, coins: p.coins - 20, hunger: Math.max(0, p.hunger - 30) }));
    } else if (itemId === 'cloak') {
      setStats((p) => ({ ...p, coins: p.coins - 45, secrecy: Math.min(100, p.secrecy + 25) }));
    } else if (itemId === 'crystal') {
      setStats((p) => ({ ...p, coins: p.coins - 35, energy: Math.min(100, p.energy + 20), secrecy: Math.min(100, p.secrecy + 15) }));
    } else if (itemId === 'box') {
      setStats((p) => ({ ...p, coins: p.coins - 25 + 35, energy: Math.min(100, p.energy + 20) }));
    }
    sounds.playCoin();
  };

  const handleFeedQuick = () => {
    sounds.playBite();
    setStats((p) => ({ ...p, hunger: Math.max(0, p.hunger - 35) }));
  };

  const handleRestartStory = () => {
    setStats(DEFAULT_STATS);
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem('vampire_cozy_stats');
    localStorage.removeItem('vampire_cozy_profile');
    setCurrentScreen('char_creation');
  };

  return (
    <div className="relative min-h-screen bg-[#0e0a1a] text-purple-100 font-sans selection:bg-purple-600 selection:text-white pb-12 overflow-x-hidden">
      {/* Visual Canvas Fog & Moon */}
      <GothicCanvas night={stats.night} />

      {/* Persistent Top Navigation Bar */}
      <TopNavBar
        stats={stats}
        profile={profile}
        currentScreen={currentScreen}
        onNavigate={(s) => setCurrentScreen(s)}
        muted={muted}
        onToggleMute={() => {
          setMuted(!muted);
          sounds.setSoundEnabled(muted);
        }}
        onOpenQuickNavigator={() => setShowScreenModal(true)}
      />

      {/* Screen Render Router */}
      <main className="relative z-10">
        {/* 1. Splash Screen & 2. Main Menu */}
        {(currentScreen === 'splash' || currentScreen === 'main_menu') && (
          <SplashAndMenuScreens
            screenId={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            hasSavedGame={stats.night > 1}
            onNewGame={() => setCurrentScreen('char_creation')}
            onContinueGame={() => setCurrentScreen('home')}
            onOpenHowToPlay={() => setCurrentScreen('tutorial')}
          />
        )}

        {/* 3. Character Creation & 4. Character Preview */}
        {(currentScreen === 'char_creation' || currentScreen === 'char_preview') && (
          <CharacterScreens
            initialProfile={profile}
            isPreviewMode={currentScreen === 'char_preview'}
            onConfirm={(newProf) => {
              setProfile(newProf);
              setCurrentScreen('home');
            }}
            onCancel={() => setCurrentScreen('main_menu')}
          />
        )}

        {/* 5. Tutorial Screen */}
        {currentScreen === 'tutorial' && (
          <TutorialScreen onStartGame={() => setCurrentScreen('home')} />
        )}

        {/* 6. Home Screen */}
        {currentScreen === 'home' && (
          <HomeScreen
            stats={stats}
            profile={profile}
            onNavigate={(s) => setCurrentScreen(s)}
            onSleep={handleSleepOrNextPhase}
            onOpenMysteryBox={() => {
              setStats((p) => ({ ...p, coins: p.coins + 30, energy: Math.min(100, p.energy + 20) }));
              setMysteryBoxClaimedNight(stats.night);
              setCurrentScreen('daily_reward');
            }}
            mysteryBoxAvailable={mysteryBoxClaimedNight !== stats.night}
          />
        )}

        {/* 7-12: Daytime Exploration Screens */}
        {(currentScreen === 'day_map' ||
          currentScreen === 'school' ||
          currentScreen === 'town' ||
          currentScreen === 'forest' ||
          currentScreen === 'shop' ||
          currentScreen === 'witch_house') && (
          <DaytimeExplorationScreens
            screenId={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            onTalkToFriend={(fId) => {
              setActiveFriendId(fId);
              setFriends((prev) => ({
                ...prev,
                [fId]: { ...prev[fId], friendship: Math.min(100, prev[fId].friendship + 10) }
              }));
            }}
            onBuyItem={handleBuyShopItem}
            coins={stats.coins}
          />
        )}

        {/* 13-17: Relationships, Powers, Inventory & Dialogue */}
        {(currentScreen === 'friendship' ||
          currentScreen === 'dialogue' ||
          currentScreen === 'choice' ||
          currentScreen === 'inventory' ||
          currentScreen === 'powers') && (
          <FriendshipAndPowersScreens
            screenId={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            friends={friends}
            powers={powers}
            currentFriendId={activeFriendId}
            onSelectFriend={(fId) => setActiveFriendId(fId)}
            onChoiceMade={(text, impact) => {
              if (impact.includes('Friendship')) {
                setFriends((p) => ({
                  ...p,
                  [activeFriendId]: { ...p[activeFriendId], friendship: Math.min(100, p[activeFriendId].friendship + 10) }
                }));
              } else if (impact.includes('Secrecy')) {
                setStats((p) => ({ ...p, secrecy: Math.min(100, p.secrecy + 10) }));
              }
            }}
            onUnlockPower={(pId) => {
              if (stats.coins >= 100) {
                setStats((p) => ({ ...p, coins: p.coins - 100 }));
                setPowers((p) => p.map((item) => (item.id === pId ? { ...item, unlocked: true } : item)));
                sounds.playAchievement();
              } else {
                alert('You need 100 Coins to unlock early!');
              }
            }}
            energy={stats.energy}
          />
        )}

        {/* 18-21 & 23: Night Survival & Encounters */}
        {(currentScreen === 'night_prep' ||
          currentScreen === 'night_map' ||
          currentScreen === 'random_event' ||
          currentScreen === 'enemy_encounter' ||
          currentScreen === 'blood_moon') && (
          <NightSurvivalScreens
            screenId={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            stats={stats}
            profile={profile}
            onFeed={handleFeedQuick}
            onChoice={(c) => {
              setClues((prev) => [
                ...prev,
                {
                  id: `clue_${Date.now()}`,
                  title: 'Letter from Midnight Cat',
                  icon: '📜',
                  description: 'A message whispering that your vampire family is watching over you.',
                  discoveredAtNight: stats.night
                }
              ]);
            }}
          />
        )}

        {/* 22: Mini-Game Arena */}
        {currentScreen === 'minigame' && (
          <MiniGamesScreen
            onFinishGame={handleMiniGameReward}
            onExit={() => setCurrentScreen(stats.timeOfDay === 'night' ? 'night_map' : 'day_map')}
          />
        )}

        {/* 24-30: Mystery, Daily Reward, Summary, Achievements, Progress, Ending, Replay */}
        {(currentScreen === 'mystery' ||
          currentScreen === 'daily_reward' ||
          currentScreen === 'night_summary' ||
          currentScreen === 'achievements' ||
          currentScreen === 'game_progress' ||
          currentScreen === 'ending' ||
          currentScreen === 'replay') && (
          <RewardsAndEndingsScreens
            screenId={currentScreen}
            onNavigate={(s) => setCurrentScreen(s)}
            stats={stats}
            profile={profile}
            clues={clues}
            achievements={achievements}
            memories={memories}
            onClaimDaily={() => {
              setStats((p) => ({ ...p, coins: p.coins + 30, energy: Math.min(100, p.energy + 20) }));
            }}
            onRestartStory={handleRestartStory}
            onAdvanceNight={() => {
              // Awaken to new day
            }}
          />
        )}
      </main>

      {/* 30 Screens Quick Navigator Modal */}
      {showScreenModal && (
        <AllScreensModal
          currentScreen={currentScreen}
          onSelectScreen={(s) => setCurrentScreen(s)}
          onClose={() => setShowScreenModal(false)}
        />
      )}
    </div>
  );
}

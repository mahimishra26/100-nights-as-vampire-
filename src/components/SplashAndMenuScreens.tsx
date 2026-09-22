import React, { useState } from 'react';
import { ScreenId } from '../types';
import { Play, Sparkles, Moon, HelpCircle, Compass, RotateCcw, Volume2 } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface MenuProps {
  screenId: 'splash' | 'main_menu';
  onNavigate: (screen: ScreenId) => void;
  hasSavedGame: boolean;
  onNewGame: () => void;
  onContinueGame: () => void;
  onOpenHowToPlay: () => void;
}

export const SplashAndMenuScreens: React.FC<MenuProps> = ({
  screenId,
  onNavigate,
  hasSavedGame,
  onNewGame,
  onContinueGame,
  onOpenHowToPlay
}) => {
  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 text-center text-white overflow-hidden">
      {/* SCREEN 1: SPLASH SCREEN */}
      {screenId === 'splash' && (
        <div className="space-y-6 max-w-md mx-auto animate-fadeIn">
          {/* Animated Moon and Bat Visual */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-2xl animate-pulse" />
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-purple-950 via-indigo-900 to-pink-900 border-4 border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center text-6xl">
              🌕
            </div>
            <div className="absolute -top-1 -right-2 text-4xl animate-bounce">
              🦇
            </div>
          </div>

          <div>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/80 border border-purple-500/50 text-purple-300 font-bold tracking-widest uppercase">
              Screen #1: Studio Splash
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 mt-3">
              100 NIGHTS AS A VAMPIRE
            </h1>
            <p className="text-xs text-purple-300 mt-2 font-medium">
              A cute, cozy gothic story-survival adventure for everyone!
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => {
                sounds.playAchievement();
                onNavigate('main_menu');
              }}
              className="px-8 py-3.5 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 mx-auto transition-transform active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>TAP TO START SCREEN</span>
              <Sparkles className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 2: MAIN MENU */}
      {screenId === 'main_menu' && (
        <div className="space-y-6 max-w-md w-full mx-auto animate-fadeIn">
          {/* Header Title */}
          <div className="relative mb-2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-900 to-pink-800 border-2 border-purple-400 mx-auto flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
              🧛‍♀️
            </div>
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-950 border border-purple-700 text-purple-300 font-bold uppercase mt-3 inline-block">
              Screen #2: Main Menu
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white mt-1">
              100 Nights as a Vampire 🌙
            </h1>
            <p className="text-xs text-purple-300 mt-1">
              Survive 100 nights • Protect your secret • Make friends
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-3 pt-2">
            {hasSavedGame && (
              <button
                onClick={() => {
                  sounds.playAchievement();
                  onContinueGame();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue Night Tale</span>
              </button>
            )}

            <button
              onClick={() => {
                sounds.playDoor();
                onNewGame();
              }}
              className="w-full py-3.5 rounded-2xl bg-[#25193d] hover:bg-[#342454] border-2 border-purple-600/60 text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>New Game (Character Creation)</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenHowToPlay();
              }}
              className="w-full py-3 rounded-2xl bg-[#1b122e] hover:bg-[#281a42] border border-purple-800/60 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>How To Play (Tutorial Guide)</span>
            </button>
          </div>

          <div className="pt-4 text-xs text-purple-400 flex items-center justify-center gap-2">
            <span>✨ 30 Unique Screens • Cute & Spooky • Mobile-Ready</span>
          </div>
        </div>
      )}
    </div>
  );
};

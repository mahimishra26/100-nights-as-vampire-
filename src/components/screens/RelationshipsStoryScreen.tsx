import React, { useState } from 'react';
import { NPCCharacter, StoryJournal } from '../../types';
import { Users, BookOpen, ArrowLeft, Heart, Shield, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface RelationshipsStoryScreenProps {
  characters: Record<string, NPCCharacter>;
  journal: StoryJournal;
  night: number;
  onBack: () => void;
}

export const RelationshipsStoryScreen: React.FC<RelationshipsStoryScreenProps> = ({
  characters,
  journal,
  night,
  onBack
}) => {
  const [subTab, setSubTab] = useState<'relationships' | 'journal'>('relationships');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#382333]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sanctuary</span>
        </button>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#120f17] p-1 rounded-xl border border-[#382333]">
          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('relationships');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              subTab === 'relationships'
                ? 'bg-gradient-to-r from-rose-950 to-red-900 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ❤️ COVENS & ALLIANCES (8)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSubTab('journal');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold transition-all cursor-pointer ${
              subTab === 'journal'
                ? 'bg-gradient-to-r from-amber-950 to-amber-900 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            📖 STORY JOURNAL & LORE
          </button>
        </div>

        <div className="text-xs font-mono text-purple-300 bg-black/45 px-3 py-1.5 rounded-lg border border-[#3e2439]">
          Night {night} Chronicles
        </div>
      </div>

      {subTab === 'relationships' ? (
        /* Major NPCs Grid (8 characters) */
        <div className="space-y-4">
          <div className="text-xs text-[#decbc0] font-serif">
            Relationships with vampires, mortals, hunters, werewolves, and witches dictate survival, story forks, and final endings.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(characters).map((char) => {
              const statusColors: Record<string, string> = {
                Hostile: 'text-red-400 border-red-800/60 bg-red-950/60',
                Distrustful: 'text-amber-400 border-amber-800/60 bg-amber-950/60',
                Neutral: 'text-gray-300 border-gray-700 bg-gray-900/60',
                Friendly: 'text-blue-300 border-blue-800/60 bg-blue-950/60',
                Allied: 'text-purple-300 border-purple-800/60 bg-purple-950/60',
                Devoted: 'text-rose-300 border-rose-800/60 bg-rose-950/60'
              };

              return (
                <div
                  key={char.id}
                  className="p-4 rounded-2xl bg-[#150f1a]/95 border border-[#3e2439] hover:border-red-600/50 shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{char.portraitIcon}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                          statusColors[char.status] || 'text-gray-300'
                        }`}
                      >
                        {char.status}
                      </span>
                    </div>

                    <h3 className="font-cinzel font-bold text-sm text-white">{char.name}</h3>
                    <p className="text-[11px] font-serif text-amber-300 mb-2">{char.title}</p>

                    {/* Trust Gauge */}
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-[#decbc0]">
                        <span>Trust / Affinity</span>
                        <span>{char.trust}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-[#382333]">
                        <div
                          className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                          style={{ width: `${char.trust}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs font-serif text-[#decbc0] leading-relaxed line-clamp-3">
                      {char.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Story Journal & Chronicles */
        <div className="space-y-6">
          {/* Main Objective */}
          <div className="p-5 rounded-2xl bg-[#1a1122]/95 border border-[#482842] shadow-lg space-y-2">
            <div className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Current Main Objective</span>
            </div>
            <p className="text-sm font-serif text-white leading-relaxed">
              {journal.currentObjective ||
                'Survive the 100 nights, identify your Sire, and prepare for the Blood Moon convergence.'}
            </p>
          </div>

          {/* Completed Quests & Discoveries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Completed Quests */}
            <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-3">
              <div className="text-xs font-cinzel font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Completed Quests & Trials</span>
              </div>
              <ul className="space-y-2 text-xs font-serif text-[#decbc0]">
                {journal.completedQuests.length > 0 ? (
                  journal.completedQuests.map((q, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded bg-black/30 border border-[#2d1b2a]">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{q}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">No major quests completed yet. Explore districts to begin trials.</li>
                )}
              </ul>
            </div>

            {/* Important Discoveries & Lore */}
            <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-3">
              <div className="text-xs font-cinzel font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Important Discoveries & Ancient Lore</span>
              </div>
              <ul className="space-y-2 text-xs font-serif text-[#decbc0]">
                {journal.discoveries.length > 0 ? (
                  journal.discoveries.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2 rounded bg-black/30 border border-[#2d1b2a]">
                      <span className="text-purple-400 font-bold">✦</span>
                      <span>{d}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500 italic">Ancient lore scrolls will be transcribed as you uncover secrets.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Major Decisions Made */}
          <div className="p-5 rounded-2xl bg-[#140f1a]/95 border border-[#3e2439] shadow-lg space-y-3">
            <div className="text-xs font-cinzel font-bold text-red-300 uppercase tracking-wider">
              Major Decisions & Turning Points Made
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-serif text-[#decbc0]">
              {journal.majorDecisions.map((dec, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-black/40 border border-[#2d1b2a]">
                  • {dec}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

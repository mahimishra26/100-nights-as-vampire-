import React from 'react';
import { Moon, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface BloodMoonCinematicScreenProps {
  night: number;
  onChoiceMade: (choiceText: string, statEffects?: Record<string, number>) => void;
  onContinue: () => void;
}

const MILESTONES: Record<number, {
  title: string;
  subtitle: string;
  narrative: string;
  choices: Array<{ label: string; outcome: string; effects: Record<string, number> }>;
}> = {
  25: {
    title: 'BLOOD MOON CONVERGENCE: QUARTER NOCTURNE',
    subtitle: 'Night 25 / 100 — The First Crimson Eclipse',
    narrative: 'The heavens curdle into a bruised purple. Above Oakhaven, the moon bleeds red. Feral ghouls howl in the catacombs while the city watch bolsters silver barricades. Lord Valerius summons you to the high balcony of the vampire mansion to test your resolve.',
    choices: [
      {
        label: 'Pledge absolute fealty to Lord Valerius and drink elder blood',
        outcome: 'You imbibed elder essence! Max Health +15, Thirst reset to 0, but Secrecy dropped.',
        effects: { maxHealth: 15, hunger: -100, secrecy: -10 }
      },
      {
        label: 'Slip into the shadows to protect mortal friend Sarah Jenkins',
        outcome: 'You shielded Sarah from ravenous ghouls. Trust +25, Secrecy +10.',
        effects: { secrecy: 10, health: -10 }
      },
      {
        label: 'Feast upon rogue inquisitor scouts under the blood light',
        outcome: 'Apex predator instincts awakened! Money +$75, Claw Attack sharpened.',
        effects: { money: 75, hunger: -60 }
      }
    ]
  },
  50: {
    title: 'BLOOD MOON CONVERGENCE: THE MIDNIGHT DIVIDE',
    subtitle: 'Night 50 / 100 — The Hunter’s Crusade',
    narrative: 'Detective Alexander Cross unleashes the Silver Dawn across every gaslit district. Holy water vapor fills the sewers, and ancient runes are painted on tavern doors. At the same time, Marcus Vane proposes an assassination plot against Queen Carmilla.',
    choices: [
      {
        label: 'Confront Detective Cross directly in St. Michael’s Chapel',
        outcome: 'You faced Cross! Inquisitor activity neutralized, earned sacred cross relic.',
        effects: { secrecy: 20, health: -25 }
      },
      {
        label: 'Form a truce with Gerald and the Ashwood Werewolf Pack',
        outcome: 'Lupine-vampiric pact forged! Werewolves guard your safehouse perimeter.',
        effects: { energy: 30, secrecy: 15 }
      },
      {
        label: 'Betray Marcus Vane to Queen Carmilla for royal favor',
        outcome: 'Queen Carmilla bestows the Crimson Crest. Gold +$150, Court status Allied.',
        effects: { money: 150, secrecy: -5 }
      }
    ]
  },
  75: {
    title: 'BLOOD MOON CONVERGENCE: THE SIRE UNMASKED',
    subtitle: 'Night 75 / 100 — The Forbidden Altar',
    narrative: 'Beneath the catacombs in an obsidian vault, the identity of your Sire is revealed through an alchemical blood mirror. The ancient progenitor seeks to consume all fledgling souls in Oakhaven to achieve godhood during the centennial Blood Moon.',
    choices: [
      {
        label: 'Consult Madam Morgana to brew the counter-curse ritual',
        outcome: 'The witch reveals the Sire’s vulnerability. Gained lunar warding talisman.',
        effects: { energy: 35, secrecy: 10 }
      },
      {
        label: 'Rally all covens, werewolves, and mortals for the final war',
        outcome: 'United subterranean resistance created! Trust boosted across all factions.',
        effects: { maxHealth: 20, health: 20 }
      },
      {
        label: 'Absorb the forbidden dark tome and claim the dark throne',
        outcome: 'Dread power surges through your veins! Attack power +30, Humanity shattered.',
        effects: { hunger: -100, secrecy: -25 }
      }
    ]
  },
  100: {
    title: 'THE CENTENNIAL BLOOD MOON: NIGHT 100',
    subtitle: 'The Final Night — Destiny at the Eclipse',
    narrative: 'The centennial blood eclipse hangs suspended over the gothic spires of Oakhaven. The 100 nights of mortal struggle and immortal thirst culminate here. The final decision that determines your eternal fate awaits.',
    choices: [
      {
        label: 'Ascend the throne as the new Undisputed Vampire Monarch',
        outcome: 'You take the crown of Oakhaven! The eternal court kneels before you.',
        effects: { money: 500 }
      },
      {
        label: 'Shatter the blood seal to become human once more at dawn',
        outcome: 'The curse shatters! As dawn breaks, warmth returns to your heartbeat.',
        effects: { health: 100 }
      },
      {
        label: 'Fade into legend as the wandering shadow of centuries',
        outcome: 'You dissolve into the endless night, a myth across generations.',
        effects: { secrecy: 100 }
      }
    ]
  }
};

export const BloodMoonCinematicScreen: React.FC<BloodMoonCinematicScreenProps> = ({
  night,
  onChoiceMade,
  onContinue
}) => {
  const milestone = MILESTONES[night] || MILESTONES[25];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Dramatic Blood Moon Graphic */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-red-950 via-red-600 to-red-400 shadow-[0_0_80px_rgba(230,57,70,0.8)] border-4 border-red-400/80 animate-pulse flex items-center justify-center mx-auto">
            <Moon className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-700 text-red-200 text-xs font-cinzel tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Major Nocturnal Convergence Event</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        </div>

        <h2 className="text-3xl md:text-4xl font-cinzel font-black text-transparent bg-clip-text bg-gradient-to-b from-red-100 via-red-400 to-red-600 drop-shadow-lg">
          {milestone.title}
        </h2>
        <p className="text-xs font-mono text-amber-300">
          {milestone.subtitle}
        </p>
      </div>

      {/* Narrative Card */}
      <div className="p-6 rounded-2xl bg-[#180f1d]/95 border-2 border-red-700/60 shadow-2xl backdrop-blur-md">
        <p className="text-sm md:text-base font-serif text-[#decbc0] leading-relaxed italic text-center">
          "{milestone.narrative}"
        </p>
      </div>

      {/* Milestone Decisions */}
      <div className="space-y-3">
        <div className="text-xs font-cinzel font-bold text-red-300 uppercase tracking-wider text-center">
          Decide the Course of the Blood Moon:
        </div>
        <div className="grid grid-cols-1 gap-3">
          {milestone.choices.map((c, idx) => (
            <button
              key={idx}
              onClick={() => {
                sounds.playMagic();
                onChoiceMade(c.outcome, c.effects);
              }}
              className="p-4 rounded-xl bg-gradient-to-r from-[#29101b] to-[#1a0f18] hover:from-[#401227] hover:to-[#291325] border border-red-800/60 hover:border-red-500 text-left transition-all cursor-pointer group flex items-center justify-between"
            >
              <div>
                <div className="font-cinzel font-bold text-sm text-white group-hover:text-red-200">
                  {idx + 1}. {c.label}
                </div>
                <div className="text-xs font-serif text-[#b8a2ad] mt-1">
                  Outcome will alter story chronicles and character alliances.
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-red-400 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

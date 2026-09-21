import React, { useState } from 'react';
import { VampireProfile, VampirePersonality, VampireOutfit } from '../../types';
import { Sparkles, Dices, ArrowLeft, ArrowRight, Check, Eye, User, ShieldAlert, Heart, Zap, Award } from 'lucide-react';
import { sounds } from '../../audio/soundManager';

interface CharacterCreationScreenProps {
  initialProfile?: VampireProfile;
  onComplete: (profile: VampireProfile) => void;
  onBack: () => void;
}

const GENDERS: Array<'Masculine' | 'Feminine' | 'Androgynous'> = ['Masculine', 'Feminine', 'Androgynous'];

const HAIR_STYLES = [
  'Victorian Waves',
  'Slicked Shadow',
  'Crimson Dreadlocks',
  'Silver Braids',
  'Messy Aristocrat'
];

const HAIR_COLORS = [
  { name: 'Raven Black', colorHex: '#1a181b' },
  { name: 'Platinum Silver', colorHex: '#e2e8f0' },
  { name: 'Crimson Wine', colorHex: '#9b2226' },
  { name: 'Midnight Violet', colorHex: '#581c87' },
  { name: 'Pale Blonde', colorHex: '#fef08a' }
];

const EYE_COLORS = [
  { name: 'Crimson Blood', colorHex: '#e63946' },
  { name: 'Luminescent Amber', colorHex: '#f59e0b' },
  { name: 'Amethyst Violet', colorHex: '#a855f7' },
  { name: 'Emerald Glint', colorHex: '#10b981' },
  { name: 'Eclipse Obsidian', colorHex: '#3b0764' }
];

const OUTFITS: Array<{ id: VampireOutfit; name: string; desc: string }> = [
  {
    id: 'Victorian Noble',
    name: 'Victorian Noble',
    desc: 'Velvet tailcoat with silver embroidery, silk cravat, and dark pocketwatch.'
  },
  {
    id: 'Gothic Scholar',
    name: 'Gothic Scholar',
    desc: 'Frayed leather trenchcoat, arcane monocle, and satchel of forbidden manuscripts.'
  },
  {
    id: 'Midnight Rogue',
    name: 'Midnight Rogue',
    desc: 'Form-fitting dark cloak, leather bracers, and concealed throwing daggers.'
  },
  {
    id: 'Blood Aristocrat',
    name: 'Blood Aristocrat',
    desc: 'Regal crimson waistcoat, gold signet ring, and ornate heirloom walking cane.'
  }
];

const PERSONALITIES: Array<{
  id: VampirePersonality;
  title: string;
  icon: string;
  desc: string;
  perk: string;
  color: string;
}> = [
  {
    id: 'Charming',
    title: 'Charming',
    icon: '✨',
    desc: 'Silver-tongued and mesmerizing, masking the predatory beast behind disarming elegance.',
    perk: '+10 Secrecy warding, +10 starting Trust with all NPCs, and 15% discount at the Catacomb Market.',
    color: 'from-amber-950/40 to-amber-900/20 border-amber-600/40 text-amber-200'
  },
  {
    id: 'Mysterious',
    title: 'Mysterious',
    icon: '🔮',
    desc: 'Shadowy and taciturn. You keep ancient secrets and move unnoticed through foggy streets.',
    perk: '+15 Max Energy, starts with Night Vision Lv.1 unlocked, and -25% inquisitor ambush frequency.',
    color: 'from-purple-950/40 to-purple-900/20 border-purple-600/40 text-purple-200'
  },
  {
    id: 'Ruthless',
    title: 'Ruthless',
    icon: '⚔️',
    desc: 'Pragmatic and cold-blooded. You embrace immortality as absolute apex predator.',
    perk: '+10 Claw Attack in battle, +$40 starting gold, and +15 Health drained on lethal bites.',
    color: 'from-red-950/40 to-red-900/20 border-red-600/40 text-red-200'
  },
  {
    id: 'Compassionate',
    title: 'Compassionate',
    icon: '🌸',
    desc: 'You stubbornly cling to remnants of mortal empathy and refuse to let the darkness consume you.',
    perk: '+20 Starting Health, Sarah Jenkins begins as Devoted Ally, and lower starvation penalties.',
    color: 'from-rose-950/40 to-rose-900/20 border-rose-600/40 text-rose-200'
  }
];

const NAME_PRESETS = [
  'Lucien Ravenscroft',
  'Cassandra Nightshade',
  'Vladislav Dracul',
  'Carmilla Von Blood',
  'Dorian Grayling',
  'Lilith DeWinter',
  'Victor Ashmore',
  'Morrigan Blackwood'
];

export const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({
  initialProfile,
  onComplete,
  onBack
}) => {
  const [name, setName] = useState(initialProfile?.name || 'Lucien Ravenscroft');
  const [gender, setGender] = useState<'Masculine' | 'Feminine' | 'Androgynous'>(
    initialProfile?.genderStyle || 'Masculine'
  );
  const [hairStyle, setHairStyle] = useState(initialProfile?.hairStyle || HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(initialProfile?.hairColor || HAIR_COLORS[0].name);
  const [eyeColor, setEyeColor] = useState(initialProfile?.eyeColor || EYE_COLORS[0].name);
  const [outfit, setOutfit] = useState<VampireOutfit>(initialProfile?.outfit || 'Victorian Noble');
  const [personality, setPersonality] = useState<VampirePersonality>(
    initialProfile?.personality || 'Charming'
  );

  const activeEyeHex = EYE_COLORS.find((e) => e.name === eyeColor)?.colorHex || '#e63946';
  const activeHairHex = HAIR_COLORS.find((h) => h.name === hairColor)?.colorHex || '#1a181b';

  const randomizeAll = () => {
    sounds.playDice();
    setName(NAME_PRESETS[Math.floor(Math.random() * NAME_PRESETS.length)]);
    setGender(GENDERS[Math.floor(Math.random() * GENDERS.length)]);
    setHairStyle(HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)]);
    setHairColor(HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)].name);
    setEyeColor(EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)].name);
    setOutfit(OUTFITS[Math.floor(Math.random() * OUTFITS.length)].id);
    setPersonality(PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)].id);
  };

  const handleCreate = () => {
    sounds.playBite();
    onComplete({
      name: name.trim() || 'Nameless Immortal',
      genderStyle: gender,
      hairStyle,
      hairColor,
      eyeColor,
      outfit,
      personality
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#3e2439]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18121f] hover:bg-[#281b33] text-[#decbc0] text-xs font-cinzel border border-[#442840] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-red-400 to-amber-200">
            🧛 VAMPIRE CHARACTER CREATION
          </h2>
          <p className="text-xs text-[#b8a2ad] font-serif mt-1">
            Sculpt your newly turned immortal visage and temperament before Night 1
          </p>
        </div>

        <button
          onClick={randomizeAll}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 text-red-200 text-xs font-cinzel border border-red-700/60 transition-colors cursor-pointer"
        >
          <Dices className="w-3.5 h-3.5 text-amber-400" />
          <span>Randomize Visage</span>
        </button>
      </div>

      {/* Main Grid: Customizer Controls (Left) & Live Visage Portrait (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Form Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Character Name */}
          <div className="p-4 rounded-xl bg-[#130f18]/90 border border-[#3e2439] shadow-lg backdrop-blur-md">
            <label className="block text-xs font-cinzel font-bold text-red-300 uppercase mb-2 tracking-wider">
              1. Immortal Identity / Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={30}
                placeholder="Enter vampire name..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#1e1526] border border-[#522b46] text-white placeholder-gray-500 text-sm font-serif focus:outline-none focus:border-red-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setName(NAME_PRESETS[Math.floor(Math.random() * NAME_PRESETS.length)])}
                className="px-3 py-2 rounded-lg bg-[#251830] hover:bg-[#39224d] text-purple-200 border border-purple-800/60 text-xs font-cinzel cursor-pointer"
              >
                Reroll
              </button>
            </div>
          </div>

          {/* Gender & Hair Options */}
          <div className="p-4 rounded-xl bg-[#130f18]/90 border border-[#3e2439] shadow-lg backdrop-blur-md space-y-4">
            <div>
              <label className="block text-xs font-cinzel font-bold text-red-300 uppercase mb-2 tracking-wider">
                2. Presentation / Gender Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GENDERS.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      sounds.playClick();
                      setGender(g);
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-cinzel transition-all cursor-pointer border ${
                      gender === g
                        ? 'bg-red-900/60 text-red-100 border-red-500 shadow-md font-bold'
                        : 'bg-[#1a1422] text-[#9d8995] border-[#382333] hover:text-white'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#2d1b2a]">
              {/* Hair Style */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#decbc0] mb-2">
                  Hair Style
                </label>
                <select
                  value={hairStyle}
                  onChange={(e) => setHairStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1e1526] border border-[#522b46] text-sm text-gray-200 font-serif focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  {HAIR_STYLES.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-xs font-cinzel font-semibold text-[#decbc0] mb-2">
                  Hair Color
                </label>
                <div className="flex gap-2">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.name}
                      onClick={() => {
                        sounds.playClick();
                        setHairColor(hc.name);
                      }}
                      title={hc.name}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        hairColor === hc.name ? 'scale-125 border-amber-400 shadow-md' : 'border-black/60'
                      }`}
                      style={{ backgroundColor: hc.colorHex }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Iris Eye Glow */}
            <div className="pt-2 border-t border-[#2d1b2a]">
              <label className="block text-xs font-cinzel font-semibold text-[#decbc0] mb-2 flex items-center justify-between">
                <span>Vampiric Eye Glow</span>
                <span className="text-xs font-serif text-amber-300">{eyeColor}</span>
              </label>
              <div className="flex gap-2.5">
                {EYE_COLORS.map((ec) => (
                  <button
                    key={ec.name}
                    onClick={() => {
                      sounds.playMagic();
                      setEyeColor(ec.name);
                    }}
                    title={ec.name}
                    className={`flex-1 py-1.5 px-2 rounded-lg border text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                      eyeColor === ec.name
                        ? 'bg-red-950/80 border-red-500 text-white font-bold shadow-md'
                        : 'bg-[#1a1422] border-[#382333] text-[#a5919e] hover:text-white'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ec.colorHex }} />
                    <span className="hidden sm:inline truncate">{ec.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outfit Aesthetic */}
          <div className="p-4 rounded-xl bg-[#130f18]/90 border border-[#3e2439] shadow-lg backdrop-blur-md">
            <label className="block text-xs font-cinzel font-bold text-red-300 uppercase mb-2 tracking-wider">
              3. Vampire Aesthetic / Wardrobe
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {OUTFITS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => {
                    sounds.playClick();
                    setOutfit(o.id);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    outfit === o.id
                      ? 'bg-red-950/60 border-red-500 shadow-md text-red-100'
                      : 'bg-[#1a1422] border-[#382333] text-[#9d8995] hover:text-white hover:border-[#5a334f]'
                  }`}
                >
                  <div className="font-cinzel font-bold text-xs flex items-center justify-between">
                    <span>{o.name}</span>
                    {outfit === o.id && <Check className="w-3.5 h-3.5 text-red-400" />}
                  </div>
                  <div className="text-[11px] font-serif text-[#b8a2ad] mt-1 line-clamp-2">
                    {o.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Starting Personality Selection */}
          <div className="p-4 rounded-xl bg-[#130f18]/90 border border-[#3e2439] shadow-lg backdrop-blur-md">
            <label className="block text-xs font-cinzel font-bold text-red-300 uppercase mb-2 tracking-wider">
              4. Starting Personality & Dialogue Modifier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    sounds.playClick();
                    setPersonality(p.id);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    personality === p.id
                      ? `bg-gradient-to-br ${p.color} border-2 shadow-lg scale-[1.02]`
                      : 'bg-[#1a1422] border-[#382333] text-[#9d8995] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-cinzel font-bold text-xs flex items-center gap-1.5">
                      <span>{p.icon}</span>
                      <span>{p.title}</span>
                    </span>
                    {personality === p.id && <Check className="w-4 h-4 text-amber-300" />}
                  </div>
                  <p className="text-[11px] font-serif text-[#decbc0] mb-2 leading-tight">
                    {p.desc}
                  </p>
                  <div className="text-[10px] font-mono text-amber-300/90 bg-black/40 px-2 py-1 rounded">
                    <strong>Perk:</strong> {p.perk}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 Columns: Live Vampire Portrait & Summary Card */}
        <div className="lg:col-span-5 sticky top-6 space-y-5">
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#241323] via-[#1a111b] to-[#120e16] border-2 border-red-700/60 shadow-[0_0_35px_rgba(183,9,76,0.3)] text-center relative overflow-hidden">
            {/* Blood Moon Aura Glow behind portrait */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ backgroundColor: activeEyeHex }}
            />

            {/* Custom stylized vampire silhouette avatar */}
            <div className="relative mx-auto w-36 h-36 rounded-full bg-gradient-to-b from-[#301322] to-[#140b15] border-2 border-[#800f2f] shadow-inner flex flex-col items-center justify-center mb-4">
              {/* Vampire collar */}
              <div className="absolute bottom-1 w-24 h-12 bg-red-950 border-t border-red-600/40 rounded-t-full" />
              
              {/* Head Silhouette */}
              <div className="relative w-16 h-20 rounded-full bg-[#e8ded1] shadow-md flex flex-col items-center justify-center">
                {/* Hair representation */}
                <div
                  className="absolute -top-2 w-20 h-9 rounded-t-full"
                  style={{ backgroundColor: activeHairHex }}
                />
                
                {/* Glowing Vampire Eyes */}
                <div className="flex gap-4 mt-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse"
                    style={{ backgroundColor: activeEyeHex, color: activeEyeHex }}
                  />
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] animate-pulse"
                    style={{ backgroundColor: activeEyeHex, color: activeEyeHex }}
                  />
                </div>

                {/* Subtle fangs */}
                <div className="flex gap-2.5 mt-2.5">
                  <div className="w-0.5 h-1.5 bg-white rounded-b-sm" />
                  <div className="w-0.5 h-1.5 bg-white rounded-b-sm" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-cinzel font-bold text-white tracking-wide">
              {name || 'The Fledgling'}
            </h3>
            <p className="text-xs font-serif text-amber-300 mt-0.5">
              {outfit} • {personality}
            </p>

            {/* Visage Details List */}
            <div className="mt-5 text-left p-3.5 rounded-xl bg-black/40 border border-[#382333] space-y-1.5 text-xs font-serif">
              <div className="flex justify-between text-[#b8a2ad]">
                <span>Style & Hair:</span>
                <span className="text-white font-medium">{gender} ({hairStyle} / {hairColor})</span>
              </div>
              <div className="flex justify-between text-[#b8a2ad]">
                <span>Gaze / Eyes:</span>
                <span className="text-amber-200 font-medium">{eyeColor}</span>
              </div>
              <div className="flex justify-between text-[#b8a2ad]">
                <span>Temperament:</span>
                <span className="text-red-300 font-medium">{personality}</span>
              </div>
            </div>

            {/* Final Submission Button */}
            <button
              onClick={handleCreate}
              className="mt-6 w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#800f2f] via-[#a4133c] to-[#c9184a] hover:from-[#a4133c] hover:to-[#ff4d6d] text-white font-cinzel font-bold text-sm tracking-widest border border-red-400/60 shadow-[0_0_24px_rgba(201,24,74,0.6)] hover:shadow-[0_0_36px_rgba(255,77,109,0.8)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>AWAKEN AS AN IMMORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-[#8e7a88] mt-2 font-mono">
              Night 1 will commence in the gaslit streets of Oakhaven.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

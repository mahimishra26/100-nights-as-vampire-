import React, { useState } from 'react';
import { VampireProfile } from '../types';
import { Sparkles, Check, ArrowRight, ArrowLeft, Heart } from 'lucide-react';
import { sounds } from '../audio/soundManager';

interface CreationProps {
  initialProfile: VampireProfile;
  isPreviewMode?: boolean;
  onConfirm: (profile: VampireProfile) => void;
  onBackToEdit?: () => void;
  onCancel?: () => void;
}

const HAIR_STYLES = ['Short Waves', 'Twin Braids', 'Gothic Bangs', 'Fluffy Ponytail', 'Nocturne Curls'];
const HAIR_COLORS = [
  { name: 'Raven Black', hex: '#1a1a24' },
  { name: 'Moon White', hex: '#f0f4f8' },
  { name: 'Crimson Wine', hex: '#8b0000' },
  { name: 'Midnight Violet', hex: '#4a154b' },
  { name: 'Soft Chestnut', hex: '#5c4033' }
];
const SKIN_TONES = [
  { name: 'Porcelain White', hex: '#fbf8f5' },
  { name: 'Fair Ivory', hex: '#f5ebe0' },
  { name: 'Soft Warm', hex: '#e8d8c8' },
  { name: 'Tan Peach', hex: '#d4b296' },
  { name: 'Deep Bronze', hex: '#8d5b4c' }
];
const OUTFITS = [
  { name: 'School Uniform & Cloak', icon: '🏫', desc: 'Standard school blazer with a cute velvet hooded cloak.' },
  { name: 'Victorian Ribbon Dress', icon: '🎀', desc: 'Frilled lace collar, velvet vest, and crimson ribbons.' },
  { name: 'Midnight Adventurer', icon: '🧥', desc: 'Leather satchel, boots, and bat-wing silver brooches.' },
  { name: 'Gothic Cozy Sweater', icon: '🧶', desc: 'Oversized purple knit sweater with star patches.' }
];

export const CharacterScreens: React.FC<CreationProps> = ({
  initialProfile,
  isPreviewMode = false,
  onConfirm,
  onBackToEdit,
  onCancel
}) => {
  const [name, setName] = useState(initialProfile.name || 'Rowan');
  const [hair, setHair] = useState(initialProfile.hair || HAIR_STYLES[0]);
  const [hairColor, setHairColor] = useState(initialProfile.hairColor || HAIR_COLORS[0].name);
  const [skinTone, setSkinTone] = useState(initialProfile.skinTone || SKIN_TONES[0].name);
  const [outfit, setOutfit] = useState(initialProfile.outfit || OUTFITS[0].name);
  const [petBatName, setPetBatName] = useState(initialProfile.petBatName || 'Pippin');
  const [step, setStep] = useState<3 | 4>(isPreviewMode ? 4 : 3);

  const selectedOutfitObj = OUTFITS.find((o) => o.name === outfit) || OUTFITS[0];
  const selectedSkinHex = SKIN_TONES.find((s) => s.name === skinTone)?.hex || '#fbf8f5';
  const selectedHairHex = HAIR_COLORS.find((h) => h.name === hairColor)?.hex || '#1a1a24';

  const handleNextToPreview = () => {
    sounds.playClick();
    setStep(4);
  };

  const handleFinalConfirm = () => {
    sounds.playAchievement();
    onConfirm({
      name: name.trim() || 'Rowan',
      hair,
      hairColor,
      skinTone,
      outfit,
      petBatName
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-white">
      {/* SCREEN 3: CHARACTER CREATION */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/50 text-purple-300 font-bold tracking-wider uppercase">
              Screen #3: Character Creation
            </span>
            <h1 className="text-3xl font-bold text-purple-100 mt-2">
              Create Your Young Vampire 🧛
            </h1>
            <p className="text-xs text-purple-300 mt-1 max-w-md mx-auto">
              Design your student look! You will attend daytime classes and explore mystical moonlit secrets by night.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Live Character Visualizer */}
            <div className="p-6 rounded-3xl bg-[#1b142e] border-2 border-purple-700/50 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden">
              <div className="w-32 h-32 rounded-full border-4 border-purple-400/60 shadow-[0_0_30px_rgba(168,85,247,0.3)] flex flex-col items-center justify-center relative mb-4" style={{ backgroundColor: selectedSkinHex }}>
                {/* Hair simulation */}
                <div
                  className="w-24 h-12 rounded-t-full absolute -top-2"
                  style={{ backgroundColor: selectedHairHex }}
                />
                {/* Cute Eyes & Fangs */}
                <div className="flex items-center gap-4 text-purple-950 font-bold text-sm z-10 mt-3">
                  <span>●</span>
                  <span>●</span>
                </div>
                <div className="text-[10px] text-red-500 font-bold z-10 tracking-widest mt-1">
                  ▼▼
                </div>
              </div>

              <div className="text-lg font-bold text-purple-100">{name || 'Your Vampire'}</div>
              <div className="text-xs text-purple-300 mt-0.5">{outfit}</div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-950 border border-purple-800 text-[11px] text-amber-300 mt-3">
                <span>🦇 Pet Bat: {petBatName}</span>
              </div>
            </div>

            {/* Customization Options */}
            <div className="md:col-span-2 space-y-4 p-6 rounded-3xl bg-[#18112a] border border-purple-800/40">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Vampire Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={18}
                  placeholder="e.g. Rowan, Jasper, Mina..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#251a3d] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400 font-semibold"
                />
              </div>

              {/* Pet Bat Name */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1">Pet Bat Name 🦇</label>
                <input
                  type="text"
                  value={petBatName}
                  onChange={(e) => setPetBatName(e.target.value)}
                  maxLength={14}
                  placeholder="e.g. Pippin, Midnight, Bram..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#251a3d] border border-purple-700/60 text-white text-sm focus:outline-none focus:border-purple-400 font-semibold"
                />
              </div>

              {/* Hair Style */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5">Hair Style</label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_STYLES.map((h) => (
                    <button
                      key={h}
                      onClick={() => {
                        sounds.playClick();
                        setHair(h);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        hair === h
                          ? 'bg-purple-600 border-purple-300 text-white shadow-md'
                          : 'bg-[#221838] border-purple-800/50 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5">Hair Color</label>
                <div className="flex flex-wrap gap-2">
                  {HAIR_COLORS.map((hc) => (
                    <button
                      key={hc.name}
                      onClick={() => {
                        sounds.playClick();
                        setHairColor(hc.name);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                        hairColor === hc.name
                          ? 'bg-purple-700 border-purple-300 text-white'
                          : 'bg-[#221838] border-purple-800 text-purple-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-white/40" style={{ backgroundColor: hc.hex }} />
                      <span>{hc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5">Skin Tone</label>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((st) => (
                    <button
                      key={st.name}
                      onClick={() => {
                        sounds.playClick();
                        setSkinTone(st.name);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold border flex items-center gap-2 ${
                        skinTone === st.name
                          ? 'bg-purple-700 border-purple-300 text-white'
                          : 'bg-[#221838] border-purple-800 text-purple-300'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: st.hex }} />
                      <span>{st.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outfits */}
              <div>
                <label className="block text-xs font-bold text-purple-200 mb-1.5">Starting Outfit</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OUTFITS.map((o) => (
                    <button
                      key={o.name}
                      onClick={() => {
                        sounds.playClick();
                        setOutfit(o.name);
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                        outfit === o.name
                          ? 'bg-purple-600 border-purple-300 text-white shadow-md'
                          : 'bg-[#221838] border-purple-800/40 text-purple-300 hover:border-purple-600'
                      }`}
                    >
                      <span className="text-xl">{o.icon}</span>
                      <div>
                        <div className="text-xs font-bold">{o.name}</div>
                        <div className="text-[10px] opacity-80">{o.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-4">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 border border-purple-800 text-xs font-bold"
              >
                Back to Menu
              </button>
            )}
            <button
              onClick={handleNextToPreview}
              className="ml-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 active:scale-95 transition-transform"
            >
              <span>Preview Character</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SCREEN 4: CHARACTER PREVIEW */}
      {step === 4 && (
        <div className="space-y-6 max-w-2xl mx-auto">
          <div className="text-center">
            <span className="text-xs px-3 py-1 rounded-full bg-purple-900/60 border border-purple-600/50 text-purple-300 font-bold tracking-wider uppercase">
              Screen #4: Character Preview
            </span>
            <h1 className="text-3xl font-bold text-purple-100 mt-2">
              Ready for 100 Nights? 🌙
            </h1>
            <p className="text-xs text-purple-300 mt-1">
              Review your character card before awakening on Night 1!
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#201538] via-[#1a112e] to-[#120b24] border-2 border-purple-500/50 shadow-2xl flex flex-col items-center text-center space-y-4">
            <div className="w-36 h-36 rounded-full border-4 border-purple-300 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex flex-col items-center justify-center relative" style={{ backgroundColor: selectedSkinHex }}>
              <div
                className="w-28 h-14 rounded-t-full absolute -top-2"
                style={{ backgroundColor: selectedHairHex }}
              />
              <div className="flex items-center gap-5 text-purple-950 font-bold text-base z-10 mt-3">
                <span>●</span>
                <span>●</span>
              </div>
              <div className="text-xs text-red-500 font-bold z-10 tracking-widest mt-1">
                ▼▼
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <div className="text-xs text-purple-300 font-semibold mt-1">
                {hair} ({hairColor}) • {skinTone}
              </div>
              <div className="inline-block px-3 py-1 rounded-xl bg-purple-900/60 border border-purple-700 text-xs text-purple-200 mt-2 font-bold">
                {selectedOutfitObj.icon} {outfit}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-purple-800/40 text-xs text-purple-300 max-w-md">
              <span className="text-amber-400 font-bold">Loyal Companion:</span> You are accompanied by <span className="text-white font-bold">{petBatName} the Fruit Bat</span>, who watches your back when exploring late at night.
            </div>

            <div className="flex items-center justify-center gap-4 pt-4 w-full">
              <button
                onClick={() => {
                  sounds.playClick();
                  setStep(3);
                }}
                className="px-6 py-2.5 rounded-2xl bg-[#281d3d] hover:bg-[#392957] text-purple-200 border border-purple-700/50 font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Change Look
              </button>

              <button
                onClick={handleFinalConfirm}
                className="px-8 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" />
                Confirm & Begin Night 1
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

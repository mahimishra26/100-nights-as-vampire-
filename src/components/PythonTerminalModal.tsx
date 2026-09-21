import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Play, RotateCcw, CornerDownLeft, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { PlayerStats, NPCCharacter, Ability, InventoryItem, LocationInfo } from '../types';
import { INITIAL_LOCATIONS } from '../data/gameData';
import { sounds } from '../audio/soundManager';

interface PythonTerminalModalProps {
  stats: PlayerStats;
  characters: Record<string, NPCCharacter>;
  abilities: Record<string, Ability>;
  items: Record<string, InventoryItem>;
  onClose: () => void;
  onFeed: (method: 'rats' | 'bag' | 'stealth_mortal') => void;
  onSelectLocation: (locId: string) => void;
  onUseItem: (itemId: string) => void;
  onUpgradeAbility: (abId: string) => void;
  onAdvanceNight: (log: string) => void;
}

export function PythonTerminalModal({
  stats,
  characters,
  abilities,
  items,
  onClose,
  onFeed,
  onSelectLocation,
  onUseItem,
  onUpgradeAbility,
  onAdvanceNight
}: PythonTerminalModalProps) {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'banner' | 'system' | 'prompt' | 'output' | 'error' | 'status'; text: string }>>([]);
  const [copied, setCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize terminal output on mount
  useEffect(() => {
    const welcome = [
      {
        type: 'banner' as const,
        text: `
   ██╗  ██████╗  ██████╗     ███╗   ██╗██╗ ██████╗ ██╗  ██╗████████╗███████╗
  ███║ ██╔═████╗██╔═████╗    ████╗  ██║██║██╔════╝ ██║  ██║╚══██╔══╝██╔════╝
  ╚██║ ██║██╔██║██║██╔██║    ██╔██╗ ██║██║██║  ███╗███████║   ██║   ███████╗
   ██║ ████╔╝██║████╔╝██║    ██║╚██╗██║██║██║   ██║██╔══██║   ██║   ╚════██║
   ██║ ╚██████╔╝╚██████╔╝    ██║ ╚████║██║╚██████╔╝██║  ██║   ██║   ███████║
   ╚═╝  ╚═════╝  ╚═════╝     ╚═╝  ╚═══╝╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝
                     ✦  AS A VAMPIRE (CLI EDITION)  ✦
          Survive 100 Nights in the Shadowed Victorian City of Oakhaven
        `
      },
      {
        type: 'system' as const,
        text: 'Python 3.10.12 (standard execution environment). Zero external dependencies required.'
      },
      {
        type: 'system' as const,
        text: 'Type a number [1-7], or command name (e.g., "explore", "feed", "rest", "status", "help") below.'
      }
    ];
    setHistory(welcome);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const pushOutput = (type: 'system' | 'prompt' | 'output' | 'error' | 'status', text: string) => {
    setHistory((prev) => [...prev, { type, text }]);
  };

  const handleRunCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (!trimmed) return;

    pushOutput('prompt', `vampire@oakhaven:~$ ${cmd}`);
    setCommand('');
    sounds.playBite();

    if (trimmed === 'clear' || trimmed === 'cls') {
      setHistory([]);
      return;
    }

    if (trimmed === 'help') {
      pushOutput(
        'output',
        `Available Commands:
  1 or explore     : Travel to one of 9 gothic districts
  2 or feed        : Satiate your burning vampiric thirst
  3 or abilities   : Upgrade your supernatural disciplines
  4 or satchel     : Check your items and blood packs
  5 or alliances   : View trust levels with mortal and vampire NPCs
  6 or status      : Display your vitals and current night progress
  7 or rest        : Advance to the next night and retreat to sanctuary
  clear            : Clear the terminal console screen
  help             : Display this manual`
      );
      return;
    }

    if (trimmed === '6' || trimmed === 'status' || trimmed === 'stats') {
      pushOutput(
        'status',
        `═══════════════════════════════════════════════════════════════
NIGHT ${stats.night}/100  |  Sanctuary: Vampire Haven
───────────────────────────────────────────────────────────────
❤️  Health:  ${stats.health}/${stats.maxHealth} HP
🩸 Thirst:  ${stats.hunger}/100 (${stats.hunger > 75 ? 'STARVING FRENZY' : 'Under Control'})
🕵️  Secrecy: ${stats.secrecy}% (${stats.secrecy < 35 ? 'HIGHLY SUSPICIOUS' : 'Warded'})
⚡ Energy:  ${stats.energy}/${stats.maxEnergy}
💰 Money:   $${stats.money}
═══════════════════════════════════════════════════════════════`
      );
      return;
    }

    if (trimmed === '1' || trimmed === 'explore') {
      pushOutput(
        'output',
        `[GOTHIC DISTRICTS]:
  [1] Vampire Mansion   - Obsidian Court Sanctuary (Safe)
  [2] Gothic Downtown   - Gaslit Alleys & Teeming Crowds (Danger ★★)
  [3] Blackwood Cemetery- Ancient Crypts & Resting Spirits (Danger ★★)
  [4] St. Jude's Academy- Scholarly Archives & Occult Books (Danger ★★)
  [5] The Velvet Veil   - VIP Lounges & Decadent Shadows (Danger ★★★)
  [6] Ashwood Forest    - Primal Woods & Werewolf Pack (Danger ★★★★)
  [7] St. Michael's     - Abandoned Chapel & Hunter Post (Danger ★★★★)
  [8] Mercy Hospital    - Cold Storage Blood Banks (Danger ★★★)
  [9] Catacomb Market   - Forbidden Bazaar of the Damned (Danger ★★★)
Type "goto 1" to "goto 9" to explore a specific location.`
      );
      return;
    }

    if (trimmed.startsWith('goto ')) {
      const num = trimmed.replace('goto ', '').trim();
      const locKeys = ['mansion', 'downtown', 'graveyard', 'academy', 'nightclub', 'forest', 'church', 'hospital', 'market'];
      const idx = parseInt(num, 10) - 1;
      if (idx >= 0 && idx < locKeys.length) {
        const key = locKeys[idx];
        const loc = INITIAL_LOCATIONS[key];
        pushOutput('system', `Traveling through the shadows to ${loc.name}... Opening encounter.`);
        onSelectLocation(key);
      } else {
        pushOutput('error', 'Unknown location index. Choose 1 through 9.');
      }
      return;
    }

    if (trimmed === '2' || trimmed === 'feed') {
      pushOutput(
        'output',
        `[NOCTURNAL FEEDING OPTIONS]:
  Type "feed rats"    : Hunt vermin in damp alleys (-20 Thirst, +10⚡, 0 Secrecy Risk)
  Type "feed bag"     : Consume chilled sterile blood pack (-45 Thirst, +15 HP, Requires Pack)
  Type "feed mortal"  : Mesmerize solitary mortal (-50 Thirst, +30⚡, -5% Secrecy)`
      );
      return;
    }

    if (trimmed === 'feed rats') {
      onFeed('rats');
      pushOutput('output', 'You hunt the damp cobblestone alleys for vermin. Foul, but quenches your burning thirst (-20 Thirst, +10⚡).');
      return;
    }

    if (trimmed === 'feed bag') {
      onFeed('bag');
      pushOutput('output', 'You drink chilled blood from your inventory (-45 Thirst, +15 HP, +25⚡).');
      return;
    }

    if (trimmed === 'feed mortal') {
      onFeed('stealth_mortal');
      pushOutput('output', 'You cast hypnotic crimson gaze upon a solitary reveller and sip gracefully (-50 Thirst, +30⚡, -5% Secrecy).');
      return;
    }

    if (trimmed === '3' || trimmed === 'abilities') {
      const list = Object.values(abilities)
        .map((a, i) => `  [${i + 1}] ${a.name} (Lv.${a.level}/${a.maxLevel}) - Cost: $${a.upgradeCost}`)
        .join('\n');
      pushOutput('output', `[VAMPIRE DISCIPLINES]:\n${list}\nType "upgrade [name]" to enhance.`);
      return;
    }

    if (trimmed === '4' || trimmed === 'satchel' || trimmed === 'inventory') {
      const list = Object.values(items)
        .map((it) => `  • ${it.name} (x${it.quantity}) - ${it.description}`)
        .join('\n');
      pushOutput('output', `[SATCHEL INVENTORY]:\n${list}`);
      return;
    }

    if (trimmed === '5' || trimmed === 'alliances' || trimmed === 'relationships') {
      const list = Object.values(characters)
        .map((c) => `  • ${c.name} (${c.title}): Trust ${c.trust}/100 [${c.status}]`)
        .join('\n');
      pushOutput('output', `[ALLIANCES & TRUST]:\n${list}`);
      return;
    }

    if (trimmed === '7' || trimmed === 'rest' || trimmed === 'dawn') {
      pushOutput('system', `Retreating to sanctuary. Dawn breaks over Oakhaven. Night ${stats.night + 1} begins.`);
      onAdvanceNight('Rested in warded coffin until twilight.');
      return;
    }

    pushOutput('error', `Command not recognized: "${trimmed}". Type "help" for a list of valid commands.`);
  };

  const copyCodeSample = () => {
    navigator.clipboard.writeText('python3 100_nights_vampire/cli_game.py');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[85vh] rounded-2xl bg-[#0d0c14] border-2 border-[#552e4c] shadow-[0_0_90px_rgba(180,30,80,0.4)] flex flex-col overflow-hidden font-mono text-xs md:text-sm">
        {/* Terminal Title Bar */}
        <div className="h-10 px-4 bg-[#171424] border-b border-[#3b233a] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-600/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-600/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-600/80 inline-block"></span>
            <span className="ml-2 font-mono text-xs text-[#decbc0] flex items-center gap-1.5 font-bold">
              <TerminalIcon className="w-4 h-4 text-red-400" />
              100_nights_vampire/cli_game.py — Python 3.10 Interactive Terminal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCodeSample}
              className="text-[11px] px-2 py-0.5 rounded bg-[#241c30] hover:bg-[#382a4a] text-[#c9b7c3] flex items-center gap-1 cursor-pointer transition-colors"
              title="Copy terminal command"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy CLI Command'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-red-950/80 text-gray-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Toolbar for Touch/Click */}
        <div className="px-4 py-2 bg-[#120f1b] border-b border-[#2d1b2c] flex flex-wrap items-center gap-2 text-xs">
          <span className="text-gray-400 font-bold mr-1">Quick Action:</span>
          {[
            { label: '[1] 🏰 Explore', cmd: 'explore' },
            { label: '[2] 🩸 Feed', cmd: 'feed' },
            { label: '[3] ⚡ Disciplines', cmd: 'abilities' },
            { label: '[4] 🎒 Satchel', cmd: 'satchel' },
            { label: '[5] 🤝 Alliances', cmd: 'alliances' },
            { label: '[6] 📊 Status', cmd: 'status' },
            { label: '[7] 🌙 Rest to Dawn', cmd: 'rest' },
            { label: '❓ Help', cmd: 'help' }
          ].map((btn) => (
            <button
              key={btn.cmd}
              onClick={() => handleRunCommand(btn.cmd)}
              className="px-2.5 py-1 rounded bg-[#20182c] hover:bg-red-950/80 border border-[#432d43] hover:border-red-600 text-[#decbc0] hover:text-white cursor-pointer transition-all active:scale-95"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Terminal Screen Body */}
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[#d6c7b9] space-y-1 bg-[#090810] select-text">
          {history.map((h, i) => {
            if (h.type === 'banner') {
              return (
                <pre key={i} className="text-red-500 font-black text-[10px] md:text-xs leading-none overflow-x-auto py-2">
                  {h.text}
                </pre>
              );
            }
            if (h.type === 'system') {
              return (
                <div key={i} className="text-cyan-400">
                  {h.text}
                </div>
              );
            }
            if (h.type === 'prompt') {
              return (
                <div key={i} className="text-emerald-400 font-bold pt-1">
                  {h.text}
                </div>
              );
            }
            if (h.type === 'error') {
              return (
                <div key={i} className="text-red-400 font-semibold">
                  {h.text}
                </div>
              );
            }
            if (h.type === 'status') {
              return (
                <pre key={i} className="text-purple-300 font-bold whitespace-pre-wrap py-1">
                  {h.text}
                </pre>
              );
            }
            return (
              <pre key={i} className="text-[#decbc0] whitespace-pre-wrap py-0.5">
                {h.text}
              </pre>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* Interactive CLI Input Line */}
        <div className="p-3 bg-[#13101e] border-t border-[#3b233a] flex items-center gap-2">
          <span className="text-emerald-400 font-bold select-none whitespace-nowrap">vampire@oakhaven:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRunCommand(command);
              }
            }}
            placeholder="Type command or option number [1-7], e.g. explore, feed, rest..."
            className="flex-1 bg-transparent text-white font-mono text-xs md:text-sm focus:outline-none placeholder:text-gray-600"
            autoFocus
          />
          <button
            onClick={() => handleRunCommand(command)}
            className="px-3 py-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Execute</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

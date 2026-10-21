import React, { useState, useEffect } from 'react';
import { X, Volume2, Sparkles, Check, Heart, Palette, Type, Layers } from 'lucide-react';
import { KeyboardTheme } from '../types';

interface KeyboardDetailModalProps {
  theme: KeyboardTheme | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  t: (key: string) => string;
}

const fontOptions = [
  { label: 'Special Elite', value: "'Special Elite', cursive", desc: '1920s Typewriter' },
  { label: 'Press Start 2P', value: "'Press Start 2P', monospace", desc: '8-Bit Pixel Arcade' },
  { label: 'Orbitron', value: "'Orbitron', sans-serif", desc: 'Sci-Fi Neon HUD' },
  { label: 'Comfortaa', value: "'Comfortaa', cursive", desc: 'Kawaii Round Bubble' },
  { label: 'Audiowide', value: "'Audiowide', sans-serif", desc: 'Synthwave AMOLED' },
  { label: 'VT323', value: "'VT323', monospace", desc: 'Hacker CRT Terminal' },
  { label: 'Cinzel', value: "'Cinzel', serif", desc: 'Imperial Gold Serif' },
  { label: 'Permanent Marker', value: "'Permanent Marker', cursive", desc: 'Graffiti Street Punk' },
  { label: 'MedievalSharp', value: "'MedievalSharp', cursive", desc: 'Fantasy Tavern Runic' },
  { label: 'Rajdhani', value: "'Rajdhani', sans-serif", desc: 'Glacial Aero HUD' },
  { label: 'Bungee', value: "'Bungee', sans-serif", desc: 'Manga Comic Block' },
  { label: 'Caveat', value: "'Caveat', cursive", desc: 'Handwritten Script' },
  { label: 'Fira Code', value: "'Fira Code', monospace", desc: 'Hacker Monospace' },
  { label: 'Inter', value: "'Inter', sans-serif", desc: 'Modern Clean Sans' },
];

const shapeOptions: { label: string; value: KeyboardTheme['keyShape'] }[] = [
  { label: 'Round (Typewriter)', value: 'round' },
  { label: 'Pixel (8-Bit)', value: 'square' },
  { label: 'Bubble (Kawaii)', value: 'pill' },
  { label: 'Chamfer (Cyber)', value: 'chamfer' },
  { label: 'Glass (Frosted)', value: 'glass' },
  { label: 'Standard (Mech)', value: 'standard' },
];

export const KeyboardDetailModal: React.FC<KeyboardDetailModalProps> = ({
  theme,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  t,
}) => {
  const [typedText, setTypedText] = useState('');
  const [applied, setApplied] = useState(false);
  const [selectedFont, setSelectedFont] = useState(theme?.fontFamily || "'Orbitron', sans-serif");
  const [selectedShape, setSelectedShape] = useState<KeyboardTheme['keyShape']>(theme?.keyShape || 'standard');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync state when theme changes
  useEffect(() => {
    if (theme) {
      setSelectedFont(theme.fontFamily || "'Orbitron', sans-serif");
      setSelectedShape(theme.keyShape || 'standard');
    }
  }, [theme]);

  if (!isOpen || !theme) return null;

  // Realistic Web Audio API Sound Synthesizer
  const playKeySound = () => {
    if (!soundEnabled || theme.keySound === 'silent') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();

      if (theme.keySound === 'typewriter') {
        // Metallic typewriter striker clack
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);

        // Light metallic ping ring
        const bell = audioCtx.createOscillator();
        const bellGain = audioCtx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(2400, audioCtx.currentTime);
        bellGain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        bellGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
        bell.connect(bellGain);
        bellGain.connect(audioCtx.destination);
        bell.start(audioCtx.currentTime + 0.01);
        bell.stop(audioCtx.currentTime + 0.12);
      } else if (theme.keySound === 'laser') {
        // Sci-Fi laser blip
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, audioCtx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      } else if (theme.keySound === 'thock') {
        // Deep Holy Panda / Topre switch thock
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(160, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, audioCtx.currentTime + 0.09);

        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.09);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.09);
      } else if (theme.keySound === 'bubble') {
        // Kawaii water drop bubble pop
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.06);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.06);
      } else {
        // Standard mechanical click (Cherry Blue)
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(280, audioCtx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      }
    } catch {
      // AudioContext policy handled
    }
  };

  const handleKeyClick = (char: string) => {
    playKeySound();
    if (char === 'BKSP') {
      setTypedText((prev) => prev.slice(0, -1));
    } else if (char === 'SPACE') {
      setTypedText((prev) => prev + ' ');
    } else {
      setTypedText((prev) => prev + char);
    }
  };

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BKSP'],
    ['SPACE'],
  ];

  const getKeyClasses = () => {
    switch (selectedShape) {
      case 'round':
        return 'rounded-full';
      case 'square':
        return 'rounded-none';
      case 'pill':
        return 'rounded-2xl';
      case 'chamfer':
        return 'rounded-sm';
      case 'glass':
        return 'rounded-xl backdrop-blur-md';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shadow-md"
              style={{ backgroundColor: theme.accentColor }}
            ></div>
            <h2 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: selectedFont }}>
              {theme.name}
            </h2>
            <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
              {theme.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full border transition ${
                soundEnabled
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                  : 'bg-slate-800 border-slate-700 text-slate-500'
              }`}
              title={soundEnabled ? 'Key Sound On' : 'Key Sound Muted'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-7 overflow-y-auto space-y-6">
          {/* Customization Controls: Font Style & Keycap Shape */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Font Style Picker */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  Font Typography Style:
                </span>
                <span className="text-[11px] text-cyan-400 font-medium">
                  {fontOptions.find((f) => f.value === selectedFont)?.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                {fontOptions.map((font) => (
                  <button
                    key={font.label}
                    onClick={() => setSelectedFont(font.value)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition border ${
                      selectedFont === font.value
                        ? 'bg-cyan-500 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Keycap Shape Picker */}
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Keycap Shape & Profile:
                </span>
                <span className="text-[11px] text-cyan-400 font-medium capitalize">
                  {selectedShape}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {shapeOptions.map((shape) => (
                  <button
                    key={shape.value}
                    onClick={() => setSelectedShape(shape.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      selectedShape === shape.value
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    {shape.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Typing Test Preview Box */}
          <div
            className="p-5 md:p-7 rounded-3xl border shadow-2xl transition-all relative overflow-hidden"
            style={{
              background: theme.backgroundStyle,
              borderColor: theme.glowEffect ? theme.glowColor : 'rgba(255,255,255,0.12)',
              boxShadow: theme.glowEffect ? `0 0 35px ${theme.glowColor}33` : '0 12px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-semibold tracking-wider uppercase flex items-center gap-2"
                style={{ color: theme.textColor, fontFamily: selectedFont }}
              >
                <Palette className="w-4 h-4" />
                Live Interactive Typing Test ({theme.keySound.replace('_', ' ')} switch)
              </span>
              <button
                onClick={() => setTypedText('')}
                className="text-xs font-bold underline transition opacity-80 hover:opacity-100"
                style={{ color: theme.textColor }}
              >
                Clear Text
              </button>
            </div>

            {/* Display screen */}
            <div
              className="w-full min-h-[72px] bg-black/60 border border-white/15 rounded-2xl p-4 text-xl tracking-wide mb-6 flex items-center shadow-inner overflow-x-auto backdrop-blur-md"
              style={{ color: theme.textColor, fontFamily: selectedFont }}
            >
              {typedText || <span className="opacity-40 italic">Type on the keyboard below or click keys...</span>}
              <span
                className="inline-block w-2.5 h-6 ml-1.5 animate-pulse"
                style={{ backgroundColor: theme.accentColor }}
              ></span>
            </div>

            {/* Virtual Keyboard Keys */}
            <div className="space-y-2">
              {rows.map((row, rIdx) => (
                <div key={rIdx} className="flex justify-center gap-1.5 md:gap-2">
                  {row.map((key) => {
                    const isSpecial = key === 'SPACE' || key === 'BKSP';
                    return (
                      <button
                        key={key}
                        onClick={() => handleKeyClick(key === 'SPACE' ? ' ' : key === 'BKSP' ? 'BKSP' : key)}
                        className={`py-3 md:py-3.5 px-3 md:px-4 font-bold text-xs md:text-sm transition-all duration-150 transform active:scale-95 active:brightness-125 select-none ${getKeyClasses()} ${
                          key === 'SPACE'
                            ? 'w-64 md:w-80'
                            : key === 'BKSP'
                            ? 'px-4 md:px-6'
                            : 'min-w-[36px] md:min-w-[46px]'
                        }`}
                        style={{
                          backgroundColor: isSpecial ? theme.accentColor : theme.primaryColor,
                          color: isSpecial ? '#000000' : theme.textColor,
                          fontFamily: selectedFont,
                          border: theme.keyBorder || '1px solid rgba(255,255,255,0.18)',
                          boxShadow: theme.keyShadow || (theme.glowEffect ? `0 0 10px ${theme.glowColor}25` : '0 3px 0 rgba(0,0,0,0.3)'),
                        }}
                      >
                        {key === 'SPACE' ? 'SPACEBAR' : key}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={handleApply}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 group"
            >
              {applied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Theme, Font & Keycaps Applied Successfully!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>{t('applyTheme')} (Instant Sync)</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleFavorite(theme.id)}
              className={`py-4 px-6 rounded-2xl font-semibold transition flex items-center justify-center gap-2 border ${
                isFavorite
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Favorite'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

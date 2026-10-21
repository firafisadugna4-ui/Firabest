import React, { useState } from 'react';
import { KeyboardTheme } from '../types';
import { Search, Heart, Sparkles, Download, Volume2, Type } from 'lucide-react';

interface KeyboardGalleryProps {
  keyboards: KeyboardTheme[];
  savedFavorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectKeyboard: (keyboard: KeyboardTheme) => void;
  t: (key: string) => string;
}

const categories = ['All Categories', 'RGB Neon', 'Pastel Kawaii', 'Cyberpunk', 'Midnight AMOLED', 'Luxury Gold', 'Retro Mechanical', 'Anime'];

export const KeyboardGallery: React.FC<KeyboardGalleryProps> = ({
  keyboards,
  savedFavorites,
  onToggleFavorite,
  onSelectKeyboard,
  t,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = keyboards.filter((kb) => {
    const matchesCategory = selectedCategory === 'All Categories' || kb.category === selectedCategory;
    const matchesSearch =
      kb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kb.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (kb.fontDisplayName && kb.fontDisplayName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getKeyShapeClasses = (shape?: string) => {
    switch (shape) {
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
        return 'rounded-lg';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-4">
          <Type className="w-3.5 h-3.5" />
          <span>12+ Unique Keycap Shapes & Authentic Google Typography Styles</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Custom Mechanical & Font Keyboard Styles
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8">
          Explore completely distinct keyboard designs—from 1920s vintage round typewriters and 8-bit arcade pixels to cyberpunk HUDs and crystal glassmorphic keys, each paired with custom typography and audio profiles.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by theme name, category, or font style..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-white placeholder-slate-500 shadow-xl focus:outline-none focus:border-cyan-500 transition font-medium text-sm"
          />
        </div>
      </div>

      {/* Categories Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition shadow-sm ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-white shadow-cyan-500/25'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Keyboards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((kb) => {
          const isFav = savedFavorites.includes(kb.id);
          const keyShapeClass = getKeyShapeClasses(kb.keyShape);

          return (
            <div
              key={kb.id}
              onClick={() => onSelectKeyboard(kb)}
              className="group p-6 rounded-3xl border cursor-pointer shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between relative overflow-hidden"
              style={{
                background: kb.backgroundStyle,
                borderColor: kb.glowEffect ? kb.glowColor + '66' : 'rgba(255,255,255,0.12)',
                boxShadow: kb.glowEffect ? `0 0 25px ${kb.glowColor}25` : '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="px-3 py-1 text-xs font-semibold rounded-full shadow-md uppercase tracking-wider"
                    style={{ backgroundColor: kb.accentColor, color: '#000' }}
                  >
                    {kb.category}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(kb.id);
                    }}
                    className={`p-2 rounded-full backdrop-blur-md transition border ${
                      isFav
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-500'
                        : 'bg-slate-950/60 border-white/10 text-white hover:bg-slate-950'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
                  </button>
                </div>

                {/* Font Badge */}
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/40 border border-white/10 text-[11px] font-medium text-slate-300 flex items-center gap-1">
                    <Type className="w-3 h-3 text-cyan-400" />
                    <span>{kb.fontDisplayName || kb.fontFamily.split(',')[0].replace(/['"]/g, '')}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] uppercase font-semibold text-slate-400">
                    {kb.keyShape} keys
                  </span>
                </div>

                <h3
                  className="text-xl font-bold mb-1 tracking-tight"
                  style={{ color: kb.textColor, fontFamily: kb.fontFamily }}
                >
                  {kb.name}
                </h3>
                <p className="text-xs mb-5 opacity-80" style={{ color: kb.textColor }}>
                  By {kb.author} • {kb.keySound.replace('_', ' ')} switch
                </p>

                {/* Keyboard Miniature Preview with Real Key Shapes & Fonts */}
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-sm mb-5">
                  <div className="space-y-1.5">
                    <div className="flex justify-center gap-1.5">
                      {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I'].map((k) => (
                        <div
                          key={k}
                          className={`w-7 h-7 flex items-center justify-center font-bold text-xs transition shadow-sm ${keyShapeClass}`}
                          style={{
                            backgroundColor: kb.primaryColor,
                            color: kb.textColor,
                            fontFamily: kb.fontFamily,
                            border: kb.keyBorder || '1px solid rgba(255,255,255,0.15)',
                            boxShadow: kb.keyShadow || 'none',
                          }}
                        >
                          {k}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1.5">
                      {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'].map((k) => (
                        <div
                          key={k}
                          className={`w-7 h-7 flex items-center justify-center font-bold text-xs transition shadow-sm ${keyShapeClass}`}
                          style={{
                            backgroundColor: kb.primaryColor,
                            color: kb.textColor,
                            fontFamily: kb.fontFamily,
                            border: kb.keyBorder || '1px solid rgba(255,255,255,0.15)',
                            boxShadow: kb.keyShadow || 'none',
                          }}
                        >
                          {k}
                        </div>
                      ))}
                    </div>
                    {/* Spacebar preview */}
                    <div className="flex justify-center mt-1">
                      <div
                        className={`w-28 h-5 flex items-center justify-center font-bold text-[9px] uppercase tracking-widest ${keyShapeClass}`}
                        style={{
                          backgroundColor: kb.accentColor,
                          color: '#000000',
                          fontFamily: kb.fontFamily,
                          border: kb.keyBorder || 'none',
                        }}
                      >
                        Space
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-medium"
                style={{ color: kb.textColor, opacity: 0.85 }}
              >
                <span className="flex items-center gap-1 capitalize">
                  <Volume2 className="w-3.5 h-3.5" />
                  {kb.keySound.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {(kb.downloads / 1000).toFixed(1)}k
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400">
          No keyboard themes found matching your search.
        </div>
      )}
    </div>
  );
};

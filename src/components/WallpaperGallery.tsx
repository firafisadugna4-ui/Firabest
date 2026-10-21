import React, { useState } from 'react';
import { Wallpaper } from '../types';
import { Search, Heart, Download, Sparkles, Filter } from 'lucide-react';

interface WallpaperGalleryProps {
  wallpapers: Wallpaper[];
  savedFavorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  t: (key: string) => string;
}

const categories = [
  'All Categories',
  'Football Players',
  'Club Badges',
  'Football',
  'Cars',
  '4D Live',
  'Anime',
  'Cyberpunk',
  'Nature',
  'Minimalist',
  'Dark AMOLED',
  'Aesthetic',
  'Abstract',
];

export const WallpaperGallery: React.FC<WallpaperGalleryProps> = ({
  wallpapers,
  savedFavorites,
  onToggleFavorite,
  onSelectWallpaper,
  t,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = wallpapers.filter((wp) => {
    const matchesCategory =
      selectedCategory === 'All Categories' ||
      wp.category === selectedCategory ||
      (selectedCategory === 'Football' && (wp.category === 'Football Players' || wp.category === 'Club Badges'));
    const matchesSearch =
      wp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wp.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      wp.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search & Hero Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Discover Stunning HD & 4K Wallpapers
        </h1>
        <p className="text-slate-400 text-sm md:text-base mb-8">
          Elevate your phone and desktop screens with breathtaking live, anime, cyberpunk, and minimalist wallpapers.
        </p>

        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
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

      {/* Wallpapers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {filtered.map((wp) => {
          const isFav = savedFavorites.includes(wp.id);
          return (
            <div
              key={wp.id}
              className="group relative rounded-3xl overflow-hidden aspect-[9/16] bg-slate-950 border border-slate-800 shadow-xl hover:border-cyan-500/50 transition cursor-pointer flex flex-col justify-between"
              onClick={() => onSelectWallpaper(wp)}
            >
              <img
                src={wp.imageUrl}
                alt={wp.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop';
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              {/* Top badges */}
              <div className="relative z-10 p-4 flex justify-between items-start">
                <span className="px-2.5 py-1 bg-slate-950/70 backdrop-blur-md text-cyan-400 text-xs font-semibold rounded-full border border-white/10">
                  {wp.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(wp.id);
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

              {/* Bottom Info Overlay */}
              <div className="relative z-10 p-4 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent pt-12 flex flex-col justify-end">
                <h3 className="text-white font-bold text-sm truncate mb-1">{wp.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{wp.resolution}</span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    {(wp.downloads / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-400">
          <p className="mb-6">No wallpapers found matching "{searchQuery}".</p>
          <button
            onClick={() => window.location.hash = '#aistudio'}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl transition flex items-center gap-2 mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate "{searchQuery}" with AI</span>
          </button>
        </div>
      )}
    </div>
  );
};

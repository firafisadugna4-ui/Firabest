import React, { useState } from 'react';
import { X, Download, Heart, Smartphone, Monitor, Share2, Check } from 'lucide-react';
import { Wallpaper } from '../types';

interface WallpaperDetailModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  t: (key: string) => string;
}

export const WallpaperDetailModal: React.FC<WallpaperDetailModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  t,
}) => {
  const [previewMode, setPreviewMode] = useState<'phone' | 'desktop'>('phone');
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen || !wallpaper) return null;

  const handleDownload = () => {
    setDownloaded(true);
    const link = document.createElement('a');
    link.href = wallpaper.imageUrl;
    link.download = `${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white transition border border-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Preview Mockup Area */}
        <div className="w-full lg:w-3/5 bg-slate-950 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Mode switch */}
          <div className="absolute top-4 left-4 z-10 flex gap-2 bg-slate-900/80 backdrop-blur-md p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setPreviewMode('phone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                previewMode === 'phone' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Phone</span>
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                previewMode === 'desktop' ? 'bg-cyan-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
          </div>

          {/* Mockup Frame */}
          {previewMode === 'phone' ? (
            <div className="w-[240px] h-[480px] rounded-[38px] border-4 border-slate-700 bg-black shadow-2xl overflow-hidden relative mt-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-700 rounded-b-xl z-10"></div>
              <img
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.triedFallback) {
                    target.dataset.triedFallback = 'true';
                    target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop';
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/50 rounded-full"></div>
            </div>
          ) : (
            <div className="w-full max-w-[500px] h-[300px] rounded-xl border-4 border-slate-700 bg-black shadow-2xl overflow-hidden relative mt-8 flex flex-col">
              <div className="w-full h-5 bg-slate-800 flex items-center px-2 gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 relative overflow-hidden">
                <img
                  src={wallpaper.imageUrl}
                  alt={wallpaper.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop';
                    }
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="w-full lg:w-2/5 p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
                {wallpaper.category}
              </span>
              <span className="px-3 py-1 bg-white/5 text-slate-300 text-xs font-semibold rounded-full border border-white/10">
                {wallpaper.resolution}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{wallpaper.title}</h2>
            <p className="text-sm text-slate-400 mb-6">By {wallpaper.author} • Iskormee Studio</p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {wallpaper.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-800 mb-6">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloads</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {(wallpaper.downloads + (downloaded ? 1 : 0)).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Likes</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {(wallpaper.likes + (isFavorite ? 1 : 0)).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={handleDownload}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 group"
            >
              {downloaded ? (
                <>
                  <Check className="w-5 h-5 text-emerald-300" />
                  <span>Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                  <span>{t('downloadWallpaper')} (HD / 4K)</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleFavorite(wallpaper.id)}
              className={`w-full py-3.5 px-6 rounded-2xl font-semibold transition flex items-center justify-center gap-2 border ${
                isFavorite
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

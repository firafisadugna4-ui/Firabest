import React from 'react';
import { UserAccount, Wallpaper, KeyboardTheme } from '../types';
import { User, Coins, Heart, Upload, Sparkles, LogOut } from 'lucide-react';

interface UserProfileProps {
  user: UserAccount;
  wallpapers: Wallpaper[];
  keyboards: KeyboardTheme[];
  onLogout: () => void;
  onSelectWallpaper: (w: Wallpaper) => void;
  onSelectKeyboard: (k: KeyboardTheme) => void;
  t: (key: string) => string;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  wallpapers,
  keyboards,
  onLogout,
  onSelectWallpaper,
  onSelectKeyboard,
  t,
}) => {
  const savedWpList = wallpapers.filter((w) => user.savedWallpapers.includes(w.id));
  const savedKbList = keyboards.filter((k) => user.savedKeyboards.includes(k.id));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-24 h-24 rounded-2xl bg-slate-800 border-2 border-cyan-500 shadow-xl p-1"
          />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-extrabold text-white">{user.username}</h1>
              <span className="px-2.5 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/20">
                PRO Member
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-3">{user.email}</p>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-bold w-fit">
              <Coins className="w-4 h-4" />
              <span>{user.coins} Iskormee Coins</span>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('logout')}</span>
        </button>
      </div>

      {/* Saved Wallpapers Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          <span>Saved Wallpapers ({savedWpList.length})</span>
        </h2>
        {savedWpList.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
            No saved wallpapers yet. Explore the gallery and heart your favorites!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {savedWpList.map((wp) => (
              <div
                key={wp.id}
                onClick={() => onSelectWallpaper(wp)}
                className="group relative rounded-2xl overflow-hidden aspect-[9/16] bg-slate-950 border border-slate-800 cursor-pointer shadow-lg hover:border-cyan-500/50 transition"
              >
                <img
                  src={wp.imageUrl}
                  alt={wp.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition p-4 flex flex-col justify-end">
                  <p className="text-white font-bold text-sm truncate">{wp.title}</p>
                  <p className="text-xs text-slate-400">{wp.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Keyboard Themes Section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Saved Keyboard Themes ({savedKbList.length})</span>
        </h2>
        {savedKbList.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-400">
            No saved keyboard themes yet. Explore keyboards and save your favorites!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedKbList.map((kb) => (
              <div
                key={kb.id}
                onClick={() => onSelectKeyboard(kb)}
                className="p-6 rounded-2xl border cursor-pointer shadow-xl transition hover:scale-[1.02]"
                style={{
                  background: kb.backgroundStyle,
                  borderColor: kb.glowColor + '66',
                  boxShadow: kb.glowEffect ? `0 0 20px ${kb.glowColor}22` : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-lg" style={{ color: kb.textColor, fontFamily: kb.fontFamily }}>
                    {kb.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ backgroundColor: kb.accentColor, color: '#000' }}>
                    {kb.category}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {['Q', 'W', 'E', 'R'].map((k) => (
                    <div
                      key={k}
                      className={`w-8 h-8 flex items-center justify-center font-bold text-xs shadow-sm ${
                        kb.keyShape === 'round'
                          ? 'rounded-full'
                          : kb.keyShape === 'square'
                          ? 'rounded-none'
                          : kb.keyShape === 'pill'
                          ? 'rounded-2xl'
                          : kb.keyShape === 'chamfer'
                          ? 'rounded-sm'
                          : 'rounded-lg'
                      }`}
                      style={{
                        backgroundColor: kb.primaryColor,
                        color: kb.textColor,
                        fontFamily: kb.fontFamily,
                        border: kb.keyBorder || '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      {k}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

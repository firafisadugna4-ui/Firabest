import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { WallpaperGallery } from './components/WallpaperGallery';
import { KeyboardGallery } from './components/KeyboardGallery';
import { AiStudio } from './components/AiStudio';
import { UserProfile } from './components/UserProfile';
import { AuthModal } from './components/AuthModal';
import { WallpaperDetailModal } from './components/WallpaperDetailModal';
import { KeyboardDetailModal } from './components/KeyboardDetailModal';
import { initialWallpapers, initialKeyboards } from './data/mockData';
import { translations } from './utils/translations';
import { Wallpaper, KeyboardTheme, UserAccount, LanguageCode } from './types';
import { Sparkles, Heart, Shield, Globe, Award } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'wallpapers' | 'keyboards' | 'aistudio' | 'profile'>('wallpapers');
  const [currentLang, setCurrentLang] = useState<LanguageCode>('en');
  const [user, setUser] = useState<UserAccount | null>(null);

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(() => {
    const saved = localStorage.getItem('iskormee_wallpapers_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure Cars and Bruno Fernandes exist in the cached dataset
        const hasCars = parsed.some((w: Wallpaper) => w.category === 'Cars');
        const hasBruno = parsed.some((w: Wallpaper) => w.title?.includes('Bruno'));
        if (Array.isArray(parsed) && parsed.length >= initialWallpapers.length && hasCars && hasBruno) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('iskormee_wallpapers_v5', JSON.stringify(initialWallpapers));
    return initialWallpapers;
  });

  const [keyboards, setKeyboards] = useState<KeyboardTheme[]>(() => {
    const saved = localStorage.getItem('iskormee_keyboards_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= initialKeyboards.length) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('iskormee_keyboards_v2', JSON.stringify(initialKeyboards));
    return initialKeyboards;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [selectedKeyboard, setSelectedKeyboard] = useState<KeyboardTheme | null>(null);

  // Load current user session on mount
  useEffect(() => {
    const sessionUser = localStorage.getItem('iskormee_current_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }
    
    // Hash listener
    const handleHashChange = () => {
      if (window.location.hash === '#aistudio') {
        setActiveTab('aistudio');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // check on mount
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Save favorites & items to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('iskormee_current_user', JSON.stringify(user));
      // update in users array
      const usersStr = localStorage.getItem('iskormee_users');
      if (usersStr) {
        const users: UserAccount[] = JSON.parse(usersStr);
        const idx = users.findIndex((u) => u.email === user.email);
        if (idx !== -1) {
          users[idx] = user;
          localStorage.setItem('iskormee_users', JSON.stringify(users));
        }
      }
    }
  }, [user]);

  const t = (key: string): string => {
    return translations[currentLang]?.[key] || translations.en[key] || key;
  };

  const handleToggleWallpaperFavorite = (id: string) => {
    if (!user) {
      setAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    setUser((prev) => {
      if (!prev) return prev;
      const exists = prev.savedWallpapers.includes(id);
      return {
        ...prev,
        savedWallpapers: exists
          ? prev.savedWallpapers.filter((item) => item !== id)
          : [...prev.savedWallpapers, id],
      };
    });
  };

  const handleToggleKeyboardFavorite = (id: string) => {
    if (!user) {
      setAuthModalOpen(true);
      setAuthMode('login');
      return;
    }

    setUser((prev) => {
      if (!prev) return prev;
      const exists = prev.savedKeyboards.includes(id);
      return {
        ...prev,
        savedKeyboards: exists
          ? prev.savedKeyboards.filter((item) => item !== id)
          : [...prev.savedKeyboards, id],
      };
    });
  };

  const handleAddWallpaper = (w: Wallpaper) => {
    setWallpapers((prev) => [w, ...prev]);
  };

  const handleAddKeyboard = (k: KeyboardTheme) => {
    setKeyboards((prev) => [k, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Navbar with three-dot menu and auth */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setAuthModalOpen(true);
        }}
        currentLang={currentLang}
        onSelectLang={setCurrentLang}
        t={t}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {activeTab === 'wallpapers' && (
          <WallpaperGallery
            wallpapers={wallpapers}
            savedFavorites={user?.savedWallpapers || []}
            onToggleFavorite={handleToggleWallpaperFavorite}
            onSelectWallpaper={setSelectedWallpaper}
            t={t}
          />
        )}

        {activeTab === 'keyboards' && (
          <KeyboardGallery
            keyboards={keyboards}
            savedFavorites={user?.savedKeyboards || []}
            onToggleFavorite={handleToggleKeyboardFavorite}
            onSelectKeyboard={setSelectedKeyboard}
            t={t}
          />
        )}

        {activeTab === 'aistudio' && (
          <AiStudio
            user={user}
            onAddWallpaper={handleAddWallpaper}
            onAddKeyboard={handleAddKeyboard}
            t={t}
          />
        )}

        {activeTab === 'profile' && (
          user ? (
            <UserProfile
              user={user}
              wallpapers={wallpapers}
              keyboards={keyboards}
              onLogout={() => {
                localStorage.removeItem('iskormee_current_user');
                setUser(null);
                setActiveTab('wallpapers');
              }}
              onSelectWallpaper={setSelectedWallpaper}
              onSelectKeyboard={setSelectedKeyboard}
              t={t}
            />
          ) : (
            <div className="max-w-md mx-auto my-20 p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center shadow-2xl">
              <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 border border-cyan-500/20">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Access Iskormee Profile</h2>
              <p className="text-sm text-slate-400 mb-6">{t('loginPrompt')}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl shadow-lg transition"
                >
                  {t('login')}
                </button>
                <button
                  onClick={() => {
                    setAuthMode('register');
                    setAuthModalOpen(true);
                  }}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition border border-slate-700"
                >
                  {t('register')}
                </button>
              </div>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 px-4 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Iskormee.com</span>
          </div>
          <p>© {new Date().getFullYear()} Iskormee.com. All rights reserved. HD Wallpapers & Custom Keyboard Themes.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Support</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(loggedUser) => setUser(loggedUser)}
        initialMode={authMode}
        t={t}
      />

      <WallpaperDetailModal
        wallpaper={selectedWallpaper}
        isOpen={!!selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
        isFavorite={!!user?.savedWallpapers.includes(selectedWallpaper?.id || '')}
        onToggleFavorite={handleToggleWallpaperFavorite}
        t={t}
      />

      <KeyboardDetailModal
        theme={selectedKeyboard}
        isOpen={!!selectedKeyboard}
        onClose={() => setSelectedKeyboard(null)}
        isFavorite={!!user?.savedKeyboards.includes(selectedKeyboard?.id || '')}
        onToggleFavorite={handleToggleKeyboardFavorite}
        t={t}
      />
    </div>
  );
}

import React from 'react';
import { Sparkles, Image as ImageIcon, Keyboard, Wand2, User as UserIcon, LogIn } from 'lucide-react';
import { UserAccount, LanguageCode } from '../types';
import { LanguageMenu } from './LanguageMenu';

interface NavbarProps {
  activeTab: 'wallpapers' | 'keyboards' | 'aistudio' | 'profile';
  setActiveTab: (tab: 'wallpapers' | 'keyboards' | 'aistudio' | 'profile') => void;
  user: UserAccount | null;
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
  t: (key: string) => string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  currentLang,
  onSelectLang,
  t,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('wallpapers')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">
              Iskormee<span className="text-cyan-400">.com</span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest hidden sm:block">
              Wallpapers & Keyboards
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('wallpapers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'wallpapers'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('wallpapers')}</span>
          </button>

          <button
            onClick={() => setActiveTab('keyboards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'keyboards'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>{t('keyboards')}</span>
          </button>

          <button
            onClick={() => setActiveTab('aistudio')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
              activeTab === 'aistudio'
                ? 'bg-cyan-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wand2 className="w-4 h-4" />
            <span>{t('aiStudio')}</span>
          </button>
        </nav>

        {/* Right Actions: Language Menu (...) & Auth */}
        <div className="flex items-center gap-3">
          {/* Three-dot Language Selection Menu */}
          <LanguageMenu currentLang={currentLang} onSelectLang={onSelectLang} />

          {user ? (
            <button
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white transition shadow-sm"
            >
              <img src={user.avatar} alt={user.username} className="w-7 h-7 rounded-full bg-slate-800" />
              <span className="text-sm font-semibold hidden sm:inline">{user.username}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-sm font-semibold transition"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-cyan-500/25 transition"
              >
                <span>{t('register')}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bottom Sub-nav */}
      <div className="md:hidden flex justify-around bg-slate-900 border-t border-slate-800 py-2.5 px-2">
        <button
          onClick={() => setActiveTab('wallpapers')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            activeTab === 'wallpapers' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          <span>{t('wallpapers')}</span>
        </button>
        <button
          onClick={() => setActiveTab('keyboards')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            activeTab === 'keyboards' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Keyboard className="w-5 h-5" />
          <span>{t('keyboards')}</span>
        </button>
        <button
          onClick={() => setActiveTab('aistudio')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            activeTab === 'aistudio' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          <span>AI Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 text-xs font-semibold ${
            activeTab === 'profile' ? 'text-cyan-400' : 'text-slate-400'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{user ? 'Profile' : 'Login'}</span>
        </button>
      </div>
    </header>
  );
};

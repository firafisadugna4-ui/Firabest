import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, ArrowRight } from 'lucide-react';
import { UserAccount } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  initialMode?: 'login' | 'register';
  t: (key: string) => string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialMode = 'login',
  t,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (isRegisterMode && !username)) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check if user already exists in localStorage database or create new
    const registeredUsersStr = localStorage.getItem('iskormee_users');
    const users: UserAccount[] = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];

    if (isRegisterMode) {
      const existing = users.find((u) => u.email === email || u.username === username);
      if (existing) {
        setError('Account with this email or username already exists. Please login instead.');
        return;
      }

      const newUser: UserAccount = {
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username}`,
        savedWallpapers: [],
        savedKeyboards: [],
        uploadedWallpapers: [],
        uploadedKeyboards: [],
        coins: 100,
      };

      users.push(newUser);
      localStorage.setItem('iskormee_users', JSON.stringify(users));
      localStorage.setItem('iskormee_current_user', JSON.stringify(newUser));
      onLogin(newUser);
      onClose();
    } else {
      // Login mode
      let found = users.find((u) => u.email === email || u.username === email);
      if (!found) {
        // If not found in mock store, create a quick session for demo ease or show demo account
        found = {
          username: email.split('@')[0] || 'IskormeeUser',
          email,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
          savedWallpapers: [],
          savedKeyboards: [],
          uploadedWallpapers: [],
          uploadedKeyboards: [],
          coins: 150,
        };
        users.push(found);
        localStorage.setItem('iskormee_users', JSON.stringify(users));
      }
      localStorage.setItem('iskormee_current_user', JSON.stringify(found));
      onLogin(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden p-8">
        <div className="absolute top-0 right-0 p-6">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegisterMode ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isRegisterMode ? t('registerPrompt') : t('loginPrompt')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {t('username')}
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. PixelMaster"
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-medium text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t('email')} / {t('username')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-medium text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-medium text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 group"
          >
            <span>{isRegisterMode ? t('register') : t('login')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-sm text-cyan-400 hover:text-cyan-300 font-medium transition"
          >
            {isRegisterMode ? t('alreadyHaveAccount') : t('needAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Globe, Check } from 'lucide-react';
import { LanguageCode } from '../types';

interface LanguageMenuProps {
  currentLang: LanguageCode;
  onSelectLang: (lang: LanguageCode) => void;
}

const languages: { code: LanguageCode; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export const LanguageMenu: React.FC<LanguageMenuProps> = ({ currentLang, onSelectLang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10 shadow-sm"
        title="Language Selection Menu"
      >
        <Globe className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium hidden sm:inline">
          {languages.find((l) => l.code === currentLang)?.flag}
        </span>
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
            Select Language
          </div>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                onSelectLang(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-white/10 transition ${
                currentLang === lang.code ? 'text-cyan-400 font-semibold bg-white/5' : 'text-slate-200'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </span>
              {currentLang === lang.code && <Check className="w-4 h-4 text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

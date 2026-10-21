import React, { useState } from 'react';
import { Sparkles, Wand2, Image as ImageIcon, Keyboard, Loader2, Download, Check } from 'lucide-react';
import { Wallpaper, KeyboardTheme, UserAccount } from '../types';

interface AiStudioProps {
  user: UserAccount | null;
  onAddWallpaper: (w: Wallpaper) => void;
  onAddKeyboard: (k: KeyboardTheme) => void;
  t: (key: string) => string;
}

export const AiStudio: React.FC<AiStudioProps> = ({ user, onAddWallpaper, onAddKeyboard, t }) => {
  const [activeTab, setActiveTab] = useState<'wallpaper' | 'keyboard'>('wallpaper');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9' | '1:1'>('9:16');
  const [loading, setLoading] = useState(false);
  const [generatedWallpaper, setGeneratedWallpaper] = useState<Wallpaper | null>(null);
  const [generatedKeyboard, setGeneratedKeyboard] = useState<KeyboardTheme | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setGeneratedWallpaper(null);
    setGeneratedKeyboard(null);
    setSaved(false);

    try {
      if (activeTab === 'wallpaper') {
        const res = await fetch('/api/generate-wallpaper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, aspectRatio }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Generation failed');

        const newWp: Wallpaper = {
          id: `ai-wp-${Date.now()}`,
          title: prompt.slice(0, 35) + '...',
          category: 'Cyberpunk',
          imageUrl: data.imageUrl,
          author: user ? user.username : 'AI Generator',
          likes: 1,
          downloads: 1,
          resolution: '4K AI HD',
          tags: ['AI Generated', 'Custom', prompt.split(' ')[0]],
          isAI: true,
        };
        setGeneratedWallpaper(newWp);
        onAddWallpaper(newWp);
      } else {
        const res = await fetch('/api/generate-keyboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Generation failed');

        const theme = data.theme;
        const newKb: KeyboardTheme = {
          id: `ai-kb-${Date.now()}`,
          name: theme.name || prompt.slice(0, 25),
          category: 'RGB Neon',
          primaryColor: theme.primaryColor || '#1e1e2f',
          accentColor: theme.accentColor || '#00ffff',
          textColor: theme.textColor || '#ffffff',
          backgroundStyle: theme.backgroundStyle || 'linear-gradient(135deg, #1e1e2f 0%, #0f0c1b 100%)',
          keySound: theme.keySound || 'mechanical_click',
          glowEffect: theme.glowEffect ?? true,
          glowColor: theme.glowColor || '#00ffff',
          fontStyle: theme.fontStyle || 'monospace',
          fontFamily: theme.fontFamily || "'Orbitron', sans-serif",
          fontDisplayName: theme.fontDisplayName || 'Custom AI Font',
          keyShape: theme.keyShape || 'chamfer',
          keyBorder: '1px solid ' + (theme.accentColor || '#00ffff'),
          keyShadow: '0 0 15px ' + (theme.glowColor || '#00ffff') + '40',
          author: user ? user.username : 'AI Generator',
          likes: 1,
          downloads: 1,
          isAI: true,
        };
        setGeneratedKeyboard(newKb);
        onAddKeyboard(newKb);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong during generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-3 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <Wand2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
          Iskormee AI Creator Studio
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Transform your imagination into stunning HD wallpapers or custom mechanical keyboard themes instantly with advanced generative AI.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl">
          <button
            onClick={() => setActiveTab('wallpaper')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'wallpaper'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>AI Wallpaper Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('keyboard')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition ${
              activeTab === 'keyboard'
                ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>AI Keyboard Theme</span>
          </button>
        </div>
      </div>

      {/* Generator Form */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-xl mb-10">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              {activeTab === 'wallpaper' ? 'Describe your dream wallpaper' : 'Describe your custom keyboard vibe'}
            </label>
            <textarea
              rows={3}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'wallpaper'
                  ? 'e.g. Cyberpunk samurai standing under neon rain in Tokyo, 8k, cinematic lighting...'
                  : 'e.g. Pastel pink bunny keyboard with soft bubble sound and neon cyan RGB backlighting...'
              }
              className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition text-sm font-medium resize-none"
            />
          </div>

          {activeTab === 'wallpaper' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Aspect Ratio
              </label>
              <div className="flex gap-3">
                {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs border transition ${
                      aspectRatio === ratio
                        ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {ratio === '9:16' ? 'Phone (9:16)' : ratio === '16:9' ? 'Desktop (16:9)' : 'Square (1:1)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold rounded-2xl shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('generating')}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Result Preview */}
      {generatedWallpaper && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Your Generated Wallpaper</h3>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden border border-slate-800 shadow-xl max-h-[400px] flex items-center justify-center bg-black">
              <img
                src={generatedWallpaper.imageUrl}
                alt={generatedWallpaper.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop';
                }}
                className="max-h-[400px] object-contain"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-4 text-left">
              <h4 className="text-2xl font-bold text-white">{generatedWallpaper.title}</h4>
              <p className="text-sm text-slate-400">Created by AI Studio • {generatedWallpaper.resolution}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSaved(true);
                    const link = document.createElement('a');
                    link.href = generatedWallpaper.imageUrl;
                    link.download = 'iskormee-ai-wallpaper.jpg';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="py-3 px-6 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  {saved ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  <span>{saved ? 'Downloaded!' : 'Download Wallpaper'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {generatedKeyboard && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl animate-in fade-in">
          <h3 className="text-xl font-bold text-white mb-4 text-center">Your Generated Keyboard Theme</h3>
          <div
            className="p-8 rounded-2xl border shadow-xl max-w-xl mx-auto"
            style={{
              background: generatedKeyboard.backgroundStyle,
              borderColor: generatedKeyboard.glowColor,
              boxShadow: `0 0 30px ${generatedKeyboard.glowColor}33`,
            }}
          >
            <h4 className="text-2xl font-bold mb-2 text-white text-center" style={{ color: generatedKeyboard.textColor }}>
              {generatedKeyboard.name}
            </h4>
            <p className="text-sm text-center mb-6" style={{ color: generatedKeyboard.textColor, opacity: 0.8 }}>
              Sound: {generatedKeyboard.keySound} • Glow: {generatedKeyboard.glowEffect ? 'Active' : 'Off'}
            </p>
            <div className="flex justify-center gap-2">
              {['Q', 'W', 'E', 'R', 'T', 'Y'].map((k) => (
                <div
                  key={k}
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shadow-md"
                  style={{
                    backgroundColor: generatedKeyboard.primaryColor,
                    color: generatedKeyboard.textColor,
                    border: `1px solid ${generatedKeyboard.glowColor}66`,
                  }}
                >
                  {k}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

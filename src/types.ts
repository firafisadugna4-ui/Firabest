export type LanguageCode = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

export interface Wallpaper {
  id: string;
  title: string;
  category: 'Football' | 'Club Badges' | 'Football Players' | 'Cars' | '4D Live' | 'Anime' | 'Cyberpunk' | 'Nature' | 'Minimalist' | 'Aesthetic' | 'Dark AMOLED' | 'Abstract';
  imageUrl: string;
  author: string;
  likes: number;
  downloads: number;
  resolution: string;
  tags: string[];
  isAI?: boolean;
}

export interface KeyboardTheme {
  id: string;
  name: string;
  category: 'RGB Neon' | 'Pastel Kawaii' | 'Cyberpunk' | 'Midnight AMOLED' | 'Luxury Gold' | 'Retro Mechanical' | 'Anime';
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundStyle: string;
  keySound: 'mechanical_click' | 'thock' | 'bubble' | 'silent' | 'typewriter' | 'laser';
  glowEffect: boolean;
  glowColor: string;
  fontStyle: string;
  fontFamily: string;
  fontDisplayName?: string;
  keyShape: 'round' | 'pill' | 'square' | 'chamfer' | 'glass' | 'standard';
  keyBorder?: string;
  keyShadow?: string;
  author: string;
  likes: number;
  downloads: number;
  previewImage?: string;
  isAI?: boolean;
}

export interface UserAccount {
  username: string;
  email: string;
  avatar: string;
  savedWallpapers: string[];
  savedKeyboards: string[];
  uploadedWallpapers: Wallpaper[];
  uploadedKeyboards: KeyboardTheme[];
  coins: number;
}

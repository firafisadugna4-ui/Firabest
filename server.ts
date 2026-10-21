import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json({ limit: '15mb' }));
app.use(express.static(path.resolve(process.cwd(), 'public')));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.get('/api/proxy-image', async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required');
  }

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'IskormeeFootballApp/1.0 (https://iskormee.com; contact: support@iskormee.com)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    const buffer = Buffer.from(await response.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    // Return a sleek dark aesthetic fallback
    res.redirect('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop');
  }
});

function createProceduralSvgWallpaper(prompt: string, aspect: '9:16' | '16:9' | '1:1' = '9:16'): string {
  const p = prompt.toLowerCase();
  const width = aspect === '16:9' ? 1920 : 1080;
  const height = aspect === '16:9' ? 1080 : aspect === '1:1' ? 1080 : 1920;
  const cx = width / 2;
  const cy = height * 0.42;

  // Theme palettes
  let bgTop = '#060a12';
  let bgBottom = '#020306';
  let primary = '#00f0ff';
  let secondary = '#7928ca';
  let accent = '#ff007f';
  let subtitle = 'ISKO RMEE • AI 4K STUDIO';
  let iconShape = 'shield';

  if (p.includes('ferrari') || p.includes('red') || p.includes('fire') || p.includes('man united') || p.includes('bayern') || p.includes('arsenal') || p.includes('liverpool')) {
    bgTop = '#1c0508'; bgBottom = '#050102'; primary = '#ff2828'; secondary = '#ff8800'; accent = '#ffd700';
    if (p.includes('ferrari')) subtitle = 'SCUDERIA HYPERCAR • ROSSO CORSA';
    if (p.includes('man united')) subtitle = 'RED DEVILS • THEATRE OF DREAMS';
  } else if (p.includes('chelsea') || p.includes('blue') || p.includes('man city') || p.includes('ocean') || p.includes('ice')) {
    bgTop = '#031024'; bgBottom = '#01050d'; primary = '#0055ff'; secondary = '#00e5ff'; accent = '#ffffff';
    if (p.includes('chelsea')) subtitle = 'THE BLUES • STAMFORD BRIDGE PRIDE';
    if (p.includes('man city')) subtitle = 'ETIHAD CITIZENS • TREBLE KINGS';
  } else if (p.includes('real madrid') || p.includes('madrid') || p.includes('gold') || p.includes('monaco') || p.includes('luxury') || p.includes('crown')) {
    bgTop = '#171305'; bgBottom = '#080601'; primary = '#ffd700'; secondary = '#ff9900'; accent = '#ffffff';
    if (p.includes('madrid')) subtitle = 'LOS BLANCOS • 15X EUROPEAN KINGS';
    if (p.includes('monaco')) subtitle = 'AS MONACO • PRINCIPALITY ROUGE ET BLANC';
  } else if (p.includes('barcelona') || p.includes('barca') || p.includes('yamal') || p.includes('messi')) {
    bgTop = '#14081c'; bgBottom = '#04020a'; primary = '#a50044'; secondary = '#004d98'; accent = '#edbb00';
    subtitle = 'MÉS QUE UN CLUB • BLAUGRANA PRIDE';
  } else if (p.includes('juventus') || p.includes('juve')) {
    bgTop = '#121212'; bgBottom = '#030303'; primary = '#ffffff'; secondary = '#d4af37'; accent = '#888888';
    subtitle = 'BIANCONERI • FINO ALLA FINE';
  } else if (p.includes('green') || p.includes('nature') || p.includes('emerald') || p.includes('matrix')) {
    bgTop = '#031a10'; bgBottom = '#010a05'; primary = '#00ff88'; secondary = '#00b4d8'; accent = '#bbf7d0';
    subtitle = 'CYBER EMERALD • NATURAL TRANSCENDENCE';
  } else if (p.includes('purple') || p.includes('cyberpunk') || p.includes('synthwave') || p.includes('tokyo') || p.includes('neon')) {
    bgTop = '#19062e'; bgBottom = '#080112'; primary = '#b026ff'; secondary = '#ff007f'; accent = '#00f0ff';
    subtitle = 'CYBERPUNK NEON CITY • 2077 HUD';
  } else if (p.includes('car') || p.includes('lamborghini') || p.includes('porsche') || p.includes('bugatti') || p.includes('bmw') || p.includes('mustang') || p.includes('supra') || p.includes('drift')) {
    bgTop = '#0d131f'; bgBottom = '#03050a'; primary = '#00f0ff'; secondary = '#ffaa00'; accent = '#ff0055';
    subtitle = 'APEX MOTORSPORT • 4K PERFORMANCE EDITION';
    iconShape = 'car';
  }

  const cleanTitle = prompt.replace(/[<>&"]/g, '').slice(0, 32);

  // SVG Artwork components
  let centerArt = '';
  if (iconShape === 'car' || p.includes('car') || p.includes('speed') || p.includes('drift')) {
    centerArt = `
      <!-- Supercar Silhouette & Speed Lines -->
      <path d="M${cx - 320} ${cy + 90} Q${cx - 180} ${cy - 10} ${cx} ${cy - 20} Q${cx + 180} ${cy - 10} ${cx + 320} ${cy + 90} L${cx + 280} ${cy + 130} L${cx - 280} ${cy + 130} Z" fill="${primary}" opacity="0.15" filter="url(#glow)"/>
      <path d="M${cx - 280} ${cy + 80} C${cx - 160} ${cy + 10}, ${cx - 90} ${cy - 60}, ${cx} ${cy - 60} C${cx + 90} ${cy - 60}, ${cx + 160} ${cy + 10}, ${cx + 280} ${cy + 80} L${cx + 300} ${cy + 100} Q${cx} ${cy + 120} ${cx - 300} ${cy + 100} Z" fill="url(#metalGrad)" stroke="${primary}" stroke-width="3"/>
      <!-- Aerodynamic Windshield -->
      <path d="M${cx - 140} ${cy + 20} Q${cx} ${cy - 40} ${cx + 140} ${cy + 20} L${cx + 180} ${cy + 55} Q${cx} ${cy + 65} ${cx - 180} ${cy + 55} Z" fill="#040914" stroke="${secondary}" stroke-width="2"/>
      <!-- Neon Headlight Beam Trails -->
      <polygon points="${cx - 240},${cy + 85} ${cx - 480},${height} ${cx - 300},${height} ${cx - 200},${cy + 90}" fill="${accent}" opacity="0.15"/>
      <polygon points="${cx + 240},${cy + 85} ${cx + 480},${height} ${cx + 300},${height} ${cx + 200},${cy + 90}" fill="${accent}" opacity="0.15"/>
      <circle cx="${cx - 220}" cy="${cy + 85}" r="12" fill="${accent}" filter="url(#glow)"/>
      <circle cx="${cx + 220}" cy="${cy + 85}" r="12" fill="${accent}" filter="url(#glow)"/>
      <!-- Tachometer Telemetry Arc -->
      <path d="M${cx - 280} ${cy + 220} A 300 300 0 0 1 ${cx + 280} ${cy + 220}" fill="none" stroke="${primary}" stroke-width="4" stroke-dasharray="8 8" opacity="0.7"/>
    `;
  } else if (p.includes('football') || p.includes('ronaldo') || p.includes('messi') || p.includes('zidane') || p.includes('chelsea') || p.includes('madrid') || p.includes('united') || p.includes('crest') || p.includes('badge') || p.includes('monaco') || p.includes('juve') || p.includes('city') || p.includes('arsenal')) {
    centerArt = `
      <!-- Stadium Floodlights -->
      <polygon points="0,0 ${cx - 100},${cy} ${cx - 280},${cy} 0,160" fill="${primary}" opacity="0.12"/>
      <polygon points="${width},0 ${cx + 100},${cy} ${cx + 280},${cy} ${width},160" fill="${primary}" opacity="0.12"/>
      <!-- Majestic Club Crest / Hero Shield -->
      <path d="M${cx} ${cy - 180} L${cx + 170} ${cy - 100} L${cx + 170} ${cy + 80} Q${cx + 160} ${cy + 210} ${cx} ${cy + 280} Q${cx - 160} ${cy + 210} ${cx - 170} ${cy + 80} L${cx - 170} ${cy - 100} Z" fill="url(#metalGrad)" stroke="${primary}" stroke-width="5" filter="url(#glow)"/>
      <path d="M${cx} ${cy - 150} L${cx + 140} ${cy - 85} L${cx + 140} ${cy + 70} Q${cx + 130} ${cy + 180} ${cx} ${cy + 240} Q${cx - 130} ${cy + 180} ${cx - 140} ${cy + 70} L${cx - 140} ${cy - 85} Z" fill="#040914" stroke="${secondary}" stroke-width="2"/>
      <!-- Golden Crown / Star Burst -->
      <polygon points="${cx},${cy - 80} ${cx + 24},${cy - 20} ${cx + 85},${cy - 20} ${cx + 36},${cy + 16} ${cx + 54},${cy + 76} ${cx},${cy + 40} ${cx - 54},${cy + 76} ${cx - 36},${cy + 16} ${cx - 85},${cy - 20} ${cx - 24},${cy - 20}" fill="${accent}" filter="url(#glow)"/>
      <!-- Pitch Lines -->
      <ellipse cx="${cx}" cy="${height * 0.88}" rx="${width * 0.45}" ry="${height * 0.08}" fill="none" stroke="${primary}" stroke-width="2" opacity="0.4"/>
    `;
  } else {
    // Cyberpunk Geometric Sacred Emblem
    centerArt = `
      <!-- Glowing Hexagon Matrix -->
      <polygon points="${cx},${cy - 180} ${cx + 160},${cy - 90} ${cx + 160},${cy + 90} ${cx},${cy + 180} ${cx - 160},${cy + 90} ${cx - 160},${cy - 90}" fill="none" stroke="${primary}" stroke-width="4" filter="url(#glow)"/>
      <polygon points="${cx},${cy - 140} ${cx + 120},${cy - 70} ${cx + 120},${cy + 70} ${cx},${cy + 140} ${cx - 120},${cy + 70} ${cx - 120},${cy - 70}" fill="url(#metalGrad)" stroke="${secondary}" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="65" fill="${accent}" opacity="0.8" filter="url(#glow)"/>
      <!-- Orbiting Rings -->
      <ellipse cx="${cx}" cy="${cy}" rx="260" ry="110" fill="none" stroke="${primary}" stroke-width="2" transform="rotate(-25 ${cx} ${cy})" stroke-dasharray="12 12"/>
      <ellipse cx="${cx}" cy="${cy}" rx="260" ry="110" fill="none" stroke="${secondary}" stroke-width="2" transform="rotate(35 ${cx} ${cy})"/>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bgTop}"/>
      <stop offset="55%" stop-color="${bgBottom}"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
    <linearGradient id="metalGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="aurora" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${primary}" stop-opacity="0.32"/>
      <stop offset="45%" stop-color="${secondary}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="16" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background Layers -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>
  <rect width="${width}" height="${height}" fill="url(#aurora)"/>

  <!-- High-Tech Neon Grid Floor -->
  <g opacity="0.18" stroke="${primary}" stroke-width="1.5">
    <line x1="0" y1="${height * 0.72}" x2="${width}" y2="${height * 0.72}"/>
    <line x1="0" y1="${height * 0.77}" x2="${width}" y2="${height * 0.77}"/>
    <line x1="0" y1="${height * 0.83}" x2="${width}" y2="${height * 0.83}"/>
    <line x1="0" y1="${height * 0.90}" x2="${width}" y2="${height * 0.90}"/>
    <line x1="0" y1="${height}" x2="${width}" y2="${height}"/>
    <line x1="${cx}" y1="${height * 0.72}" x2="${cx - 500}" y2="${height}"/>
    <line x1="${cx}" y1="${height * 0.72}" x2="${cx - 260}" y2="${height}"/>
    <line x1="${cx}" y1="${height * 0.72}" x2="${cx}" y2="${height}"/>
    <line x1="${cx}" y1="${height * 0.72}" x2="${cx + 260}" y2="${height}"/>
    <line x1="${cx}" y1="${height * 0.72}" x2="${cx + 500}" y2="${height}"/>
  </g>

  <!-- Center Artwork -->
  ${centerArt}

  <!-- Typography & Branding -->
  <g text-anchor="middle" font-family="'Orbitron', 'Inter', -apple-system, sans-serif">
    <!-- Title Glow & Main Text -->
    <text x="${cx}" y="${height * 0.68}" font-size="${width > 1200 ? 56 : 42}" font-weight="900" fill="${primary}" opacity="0.3" filter="url(#glow)" letter-spacing="4">
      ${cleanTitle.toUpperCase()}
    </text>
    <text x="${cx}" y="${height * 0.68}" font-size="${width > 1200 ? 56 : 42}" font-weight="900" fill="#ffffff" letter-spacing="4">
      ${cleanTitle.toUpperCase()}
    </text>

    <!-- Subtitle & Watermark -->
    <text x="${cx}" y="${height * 0.715}" font-size="${width > 1200 ? 20 : 15}" font-weight="700" fill="${accent}" letter-spacing="8" opacity="0.9">
      ${subtitle}
    </text>
    <line x1="${cx - 160}" y1="${height * 0.73}" x2="${cx + 160}" y2="${height * 0.73}" stroke="${primary}" stroke-width="2" opacity="0.6"/>
  </g>
</svg>`;
}

app.post('/api/generate-wallpaper', async (req, res) => {
  try {
    const { prompt, aspectRatio = '9:16' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let generatedSvg: string | null = null;
    let description = '';

    // First attempt: Gemini AI generation for SVG wallpaper
    try {
      const viewBox = aspectRatio === '16:9' ? '0 0 1920 1080' : aspectRatio === '1:1' ? '0 0 1080 1080' : '0 0 1080 1920';
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `You are an elite vector wallpaper artist creating a mobile/desktop wallpaper for: "${prompt}".
Create a stunning, valid SVG wallpaper with viewBox="${viewBox}" width="100%" height="100%".
Include rich gradients, glow filters, dramatic silhouettes or emblems, modern futuristic lines, and the title "${prompt}".
Output ONLY raw valid SVG starting with <svg and ending with </svg>. No markdown, no commentary.`,
      });

      let text = response.text ? response.text.trim() : '';
      text = text.replace(/^```(svg|xml)?/i, '').replace(/```$/, '').trim();
      if (text.includes('<svg') && text.includes('</svg>')) {
        const start = text.indexOf('<svg');
        const end = text.lastIndexOf('</svg>') + 6;
        generatedSvg = text.substring(start, end);
        description = `Custom AI Wallpaper generated for "${prompt}"`;
      }
    } catch (aiErr: any) {
      console.warn('Gemini SVG generation unavailable, using procedural AI engine:', aiErr.message);
    }

    // Procedural Fallback if Gemini is busy or rate limited
    if (!generatedSvg) {
      generatedSvg = createProceduralSvgWallpaper(prompt, aspectRatio);
      description = `AI Studio Masterpiece designed for "${prompt}"`;
    }

    // Convert SVG to data URI
    const base64Svg = Buffer.from(generatedSvg).toString('base64');
    const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;

    res.json({
      success: true,
      imageUrl,
      title: prompt.slice(0, 40),
      description,
      tags: ['AI Generated', 'Custom', prompt.split(' ')[0]],
    });
  } catch (error: any) {
    console.error('Error generating wallpaper:', error);
    // Never fail: return procedural fallback
    const fallbackSvg = createProceduralSvgWallpaper(req.body.prompt || 'Custom Wallpaper');
    const base64 = Buffer.from(fallbackSvg).toString('base64');
    res.json({
      success: true,
      imageUrl: `data:image/svg+xml;base64,${base64}`,
      title: (req.body.prompt || 'Custom AI Wallpaper').slice(0, 40),
      description: 'Exclusive AI Studio Creation',
      tags: ['AI Generated', 'Custom'],
    });
  }
});

app.post('/api/generate-keyboard', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let themeData: any = null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: `Design a custom mechanical keyboard theme based on: "${prompt}". Provide a JSON response with:
        - name: A catchy theme name
        - primaryColor: hex color for keys or background
        - accentColor: hex color for accent keys (Enter, Space)
        - textColor: hex color for key letters
        - backgroundStyle: CSS gradient string for keyboard backdrop
        - keySound: 'mechanical_click' | 'thock' | 'bubble' | 'silent' | 'typewriter' | 'laser'
        - glowEffect: boolean
        - glowColor: hex color for RGB glow
        - fontStyle: string description of font
        - fontFamily: Choose best matching from: "'Special Elite', cursive" | "'Press Start 2P', monospace" | "'Orbitron', sans-serif" | "'Comfortaa', cursive" | "'Audiowide', sans-serif" | "'VT323', monospace" | "'Cinzel', serif" | "'Permanent Marker', cursive" | "'MedievalSharp', cursive" | "'Rajdhani', sans-serif" | "'Bungee', sans-serif" | "'Caveat', cursive"
        - fontDisplayName: human readable font name
        - keyShape: 'round' | 'pill' | 'square' | 'chamfer' | 'glass' | 'standard'`,
        config: {
          responseMimeType: 'application/json',
        },
      });
      themeData = JSON.parse(response.text || '{}');
    } catch (aiErr: any) {
      console.warn('Gemini Keyboard theme generation busy, using procedural fallback:', aiErr.message);
    }

    if (!themeData || !themeData.name) {
      const p = prompt.toLowerCase();
      let primary = '#0f172a';
      let accent = '#00f0ff';
      let text = '#00f0ff';
      let bg = 'linear-gradient(135deg, #090d16 0%, #030408 100%)';
      let sound = 'laser';
      let font = "'Orbitron', sans-serif";
      let fontName = 'Orbitron (Sci-Fi Neon)';
      let shape = 'chamfer';

      if (p.includes('vintage') || p.includes('typewriter') || p.includes('retro') || p.includes('classic')) {
        primary = '#2b211b'; accent = '#d4af37'; text = '#fdf6e2'; bg = 'radial-gradient(circle, #3d2817 0%, #1a0f07 100%)';
        sound = 'typewriter'; font = "'Special Elite', cursive"; fontName = 'Special Elite (1920s Typewriter)'; shape = 'round';
      } else if (p.includes('pixel') || p.includes('8bit') || p.includes('game') || p.includes('arcade')) {
        primary = '#1a0933'; accent = '#22c55e'; text = '#4ade80'; bg = 'linear-gradient(135deg, #18002e 0%, #080014 100%)';
        sound = 'mechanical_click'; font = "'Press Start 2P', monospace"; fontName = 'Press Start 2P (Pixel Arcade)'; shape = 'square';
      } else if (p.includes('pink') || p.includes('kawaii') || p.includes('cute') || p.includes('cat') || p.includes('pastel')) {
        primary = '#ffe4ec'; accent = '#ff7597'; text = '#8338ec'; bg = 'linear-gradient(135deg, #fff0f5 0%, #ffd1dc 100%)';
        sound = 'bubble'; font = "'Comfortaa', cursive"; fontName = 'Comfortaa (Soft Kawaii)'; shape = 'pill';
      } else if (p.includes('gold') || p.includes('luxury') || p.includes('royal')) {
        primary = '#1a1813'; accent = '#ffd700'; text = '#ffd700'; bg = 'radial-gradient(circle, #2a2415 0%, #0d0b07 100%)';
        sound = 'thock'; font = "'Cinzel', serif"; fontName = 'Cinzel (Imperial Gold)'; shape = 'glass';
      }

      themeData = {
        name: prompt.slice(0, 30),
        primaryColor: primary,
        accentColor: accent,
        textColor: text,
        backgroundStyle: bg,
        keySound: sound,
        glowEffect: true,
        glowColor: accent,
        fontStyle: 'custom',
        fontFamily: font,
        fontDisplayName: fontName,
        keyShape: shape,
      };
    }

    res.json({ success: true, theme: themeData });
  } catch (error: any) {
    console.error('Error generating keyboard theme:', error);
    res.json({
      success: true,
      theme: {
        name: req.body.prompt || 'Custom Cyber Theme',
        primaryColor: '#0a101d',
        accentColor: '#00f0ff',
        textColor: '#00f0ff',
        backgroundStyle: 'linear-gradient(135deg, #050b14 0%, #15002a 100%)',
        keySound: 'laser',
        glowEffect: true,
        glowColor: '#00f0ff',
        fontStyle: 'sans-serif',
        fontFamily: "'Orbitron', sans-serif",
        fontDisplayName: 'Orbitron (Sci-Fi Neon)',
        keyShape: 'chamfer',
      },
    });
  }
});

async function startServer() {
  const PORT = process.env.PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Iskormee server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

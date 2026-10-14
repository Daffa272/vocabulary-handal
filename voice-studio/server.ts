import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import {
  FallbackSynthTTSProvider,
  GoogleGenAITTSProvider,
  GEMINI_VOICES,
  TTSProvider,
} from './server/tts-adapter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '4mb' }));

// Providers initialization: Google Gemini is the official and exclusive TTS provider
const geminiProvider = new GoogleGenAITTSProvider();
const fallbackProvider = new FallbackSynthTTSProvider();

/**
 * Health & Config endpoint:
 * Confirms Google Gemini AI TTS status
 */
app.get('/api/health', (req: Request, res: Response) => {
  const isGeminiConfigured = geminiProvider.isConfigured();

  res.json({
    status: 'ok',
    provider: 'gemini',
    model: 'gemini-3.8-flash-lite-tts',
    geminiConfigured: isGeminiConfigured,
    message: isGeminiConfigured
      ? 'Google AI Studio (Gemini 3.8 TTS) aktif.'
      : 'Google Gemini offline fallback siap.',
  });
});

/**
 * Available voices endpoint:
 * Returns the 5 official Google Gemini voices
 */
app.get('/api/voices', async (req: Request, res: Response) => {
  res.json({ provider: 'gemini', voices: GEMINI_VOICES });
});

/**
 * Main TTS generation endpoint: /api/tts
 * Powered 100% by Google Gemini AI Speech
 */
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const requestApiKey = req.get('X-Gemini-Api-Key')?.trim();
    if (requestApiKey && requestApiKey.length > 4096) {
      res.status(400).json({ error: 'Gemini API key exceeds the maximum allowed length.' });
      return;
    }

    const {
      text,
      voice = 'Fenrir',
      emotion = 'neutral',
      speed = 1.0,
      voiceDescription = '',
    } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Dialogue text is required and must be a string.' });
      return;
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      res.status(400).json({ error: 'Dialogue text cannot be empty.' });
      return;
    }

    if (trimmedText.length > 1000) {
      res.status(400).json({
        error: `Dialogue text exceeds maximum allowed length of 1,000 characters (got ${trimmedText.length}).`,
      });
      return;
    }

    const geminiRequestProvider = requestApiKey
      ? new GoogleGenAITTSProvider(requestApiKey)
      : geminiProvider;
    let activeProvider: TTSProvider = geminiRequestProvider;
    let providerName = 'gemini';

    if (!geminiRequestProvider.isConfigured()) {
      activeProvider = fallbackProvider;
      providerName = 'local-synth';
    }

    let result;
    try {
      result = await activeProvider.generateSpeech({
        text: trimmedText,
        voice,
        speed: Number(speed) || 1.0,
        emotion: String(emotion || 'neutral'),
        voiceDescription,
      });
    } catch (geminiError: any) {
      console.warn('Gemini generation failed, falling back to local audio synthesis:', geminiError.message);
      result = await fallbackProvider.generateSpeech({
        text: trimmedText,
        voice,
        speed: Number(speed) || 1.0,
        emotion: String(emotion || 'neutral'),
      });
      providerName = 'local-synth-fallback';
    }

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Length', result.audioBuffer.length);
    res.setHeader('X-TTS-Provider', providerName);
    res.setHeader('X-Character-Count', result.characterCount.toString());
    res.send(result.audioBuffer);
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate audio speech',
    });
  }
});

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Voice Studio (100% Google Gemini) running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

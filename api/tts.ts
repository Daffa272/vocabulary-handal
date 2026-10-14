import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  FallbackSynthTTSProvider,
  GoogleGenAITTSProvider,
  TTSProvider,
} from '../voice-studio/server/tts-adapter.js';

interface TTSRequestBody {
  text?: unknown;
  voice?: unknown;
  emotion?: unknown;
  speed?: unknown;
  voiceDescription?: unknown;
}

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

const fallbackProvider = new FallbackSynthTTSProvider();

function sendJson(res: ServerResponse, status: number, body: object): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

export default async function handler(
  req: VercelRequest,
  res: ServerResponse
): Promise<void> {
  if (req.method !== 'POST') {
    res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  const headerApiKey = req.headers['x-gemini-api-key'];
  const requestApiKey = typeof headerApiKey === 'string' ? headerApiKey.trim() : '';
  if (requestApiKey.length > 4096) {
    sendJson(res, 400, { error: 'Gemini API key exceeds the maximum allowed length.' });
    return;
  }

  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body as TTSRequestBody
    : {};
  if (typeof body.text !== 'string') {
    sendJson(res, 400, { error: 'Dialogue text is required and must be a string.' });
    return;
  }

  const text = body.text.trim();
  if (!text) {
    sendJson(res, 400, { error: 'Dialogue text cannot be empty.' });
    return;
  }
  if (text.length > 1000) {
    sendJson(res, 400, {
      error: `Dialogue text exceeds maximum allowed length of 1,000 characters (got ${text.length}).`,
    });
    return;
  }

  const geminiProvider = requestApiKey
    ? new GoogleGenAITTSProvider(requestApiKey)
    : new GoogleGenAITTSProvider();
  let activeProvider: TTSProvider = geminiProvider;
  let providerName = 'gemini';

  if (!geminiProvider.isConfigured()) {
    activeProvider = fallbackProvider;
    providerName = 'local-synth';
  }

  try {
    let result;
    try {
      result = await activeProvider.generateSpeech({
        text,
        voice: typeof body.voice === 'string' ? body.voice : 'Fenrir',
        speed: Number(body.speed) || 1,
        emotion: typeof body.emotion === 'string' ? body.emotion : 'neutral',
        voiceDescription: typeof body.voiceDescription === 'string' ? body.voiceDescription : '',
      });
    } catch (error) {
      if (activeProvider !== geminiProvider) throw error;
      console.warn('Gemini generation failed; using local audio synthesis.', error);
      result = await fallbackProvider.generateSpeech({
        text,
        voice: typeof body.voice === 'string' ? body.voice : 'Fenrir',
        speed: Number(body.speed) || 1,
        emotion: typeof body.emotion === 'string' ? body.emotion : 'neutral',
      });
      providerName = 'local-synth-fallback';
    }

    res.writeHead(200, {
      'Content-Type': result.contentType,
      'Content-Length': result.audioBuffer.length,
      'X-TTS-Provider': providerName,
      'X-Character-Count': result.characterCount.toString(),
    });
    res.end(result.audioBuffer);
  } catch (error) {
    console.error('Error in /api/tts:', error);
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Failed to generate audio speech.',
    });
  }
}

import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAITTSProvider } from '../voice-studio/server/tts-adapter.js';

export default function handler(
  req: IncomingMessage,
  res: ServerResponse
): void {
  if (req.method !== 'GET') {
    res.writeHead(405, { Allow: 'GET', 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed.' }));
    return;
  }

  const geminiConfigured = new GoogleGenAITTSProvider().isConfigured();
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    provider: 'gemini',
    model: 'gemini-3.8-flash-lite-tts',
    geminiConfigured,
    message: geminiConfigured
      ? 'Google Gemini TTS aktif di Vercel.'
      : 'Gemini API Key belum dikonfigurasi; audio fallback lokal tersedia.',
  }));
}

import { AudioTake, Character, EmotionTag, ScriptLine } from '../types';
import { loadGeminiApiKey } from './storage';

let audioCtx: AudioContext | null = null;
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export interface GenerateLineRequest {
  line: ScriptLine;
  character: Character;
  provider?: 'gemini' | 'mock';
  outputFormat?: string;
}

export async function generateSpeechForLine(request: GenerateLineRequest): Promise<AudioTake> {
  const { line, character, outputFormat = 'wav' } = request;

  // Use character speed as base, multiplied by per-line speed
  const effectiveSpeed = (character.defaultSpeed || 1.0) * (line.speed || 1.0);

  const payload = {
    text: line.dialogue,
    voice: character.voice || 'Fenrir',
    speed: effectiveSpeed,
    emotion: line.emotion,
    outputFormat,
    voiceDescription: [character.voiceDescription, line.voiceActingDescription]
      .filter((description) => description?.trim())
      .join('. '),
  };
  const apiKey = loadGeminiApiKey();

  const response = await fetch('/api/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'X-Gemini-Api-Key': apiKey } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorMsg = `Server error ${response.status}`;
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errJson.message || errorMsg;
    } catch {
      errorMsg = await response.text();
    }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get('Content-Type') || 'audio/wav';
  const providerUsed = response.headers.get('X-TTS-Provider') || 'gemini';
  const format: 'mp3' | 'wav' = contentType.includes('wav') ? 'wav' : 'mp3';

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();

  // Calculate audio duration accurately with AudioContext
  let duration = 1.5;
  try {
    const ctx = getAudioContext();
    const decodedBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
    duration = decodedBuffer.duration;
  } catch (decodeErr) {
    console.warn('Could not decode audio duration with Web Audio API:', decodeErr);
    // Estimate based on text length
    duration = Math.max(1.0, (line.dialogue.split(' ').length * 0.4) / effectiveSpeed);
  }

  // Convert to base64 for persistent IndexedDB storage
  const base64 = await blobToBase64(blob);
  const blobUrl = URL.createObjectURL(blob);

  const nextTakeNumber = (line.takes?.length || 0) + 1;

  const take: AudioTake = {
    id: `take-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    takeNumber: nextTakeNumber,
    audioBase64: base64,
    audioBlobUrl: blobUrl,
    duration,
    format,
    createdAt: new Date().toISOString(),
    characterCount: line.dialogue.length,
    providerUsed,
  };

  return take;
}

/**
 * Converts a Blob to a base64 Data URL string
 */
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converts base64 Data URL to Blob
 */
export function base64ToBlob(base64: string, fallbackMime = 'audio/mpeg'): Blob {
  const parts = base64.split(';base64,');
  const mime = parts.length > 1 ? parts[0].replace('data:', '') : fallbackMime;
  const binaryStr = atob(parts.length > 1 ? parts[1] : parts[0]);
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

/**
 * Ensures an AudioTake has a usable Blob URL in memory
 */
export function ensureTakeBlobUrl(take: AudioTake): string {
  if (take.audioBlobUrl) return take.audioBlobUrl;
  if (take.audioBase64) {
    const blob = base64ToBlob(take.audioBase64, take.format === 'wav' ? 'audio/wav' : 'audio/mpeg');
    take.audioBlobUrl = URL.createObjectURL(blob);
    return take.audioBlobUrl;
  }
  return '';
}

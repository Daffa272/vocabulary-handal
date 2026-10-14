import { GoogleGenAI } from '@google/genai';

export type GeminiVoiceName =
  // 👨 Suara Pria (15 Suara)
  | 'Puck'
  | 'Charon'
  | 'Fenrir'
  | 'Orus'
  | 'Enceladus'
  | 'Iapetus'
  | 'Umbriel'
  | 'Algieba'
  | 'Algenib'
  | 'Rasalgethi'
  | 'Alnilam'
  | 'Schedar'
  | 'Pulcherrima'
  | 'Achird'
  | 'Zubenelgenubi'
  // 👩 Suara Wanita (15 Suara)
  | 'Zephyr'
  | 'Kore'
  | 'Leda'
  | 'Aoede'
  | 'Callirrhoe'
  | 'Autonoe'
  | 'Despina'
  | 'Erinome'
  | 'Laomedeia'
  | 'Achernar'
  | 'Gacrux'
  | 'Vindemiatrix'
  | 'Sulafat'
  | 'Sadachbia'
  | 'Sadaltager';

export interface TTSOptions {
  text: string;
  voice: GeminiVoiceName | string;
  speed?: number;
  emotion?: string;
  voiceDescription?: string;
}

export interface TTSProviderResult {
  audioBuffer: Buffer;
  contentType: string;
  characterCount: number;
  providerName: string;
}

export interface VoiceMetadata {
  id: GeminiVoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female';
}

export interface TTSProvider {
  name: string;
  generateSpeech(options: TTSOptions): Promise<TTSProviderResult>;
  getAvailableVoices(): Promise<VoiceMetadata[]>;
}

export const GEMINI_VOICES: VoiceMetadata[] = [
  // 👨 Suara Pria (15 Karakter Suara)
  { id: 'Puck', name: 'Puck', description: 'Upbeat & energetic', gender: 'Male' },
  { id: 'Charon', name: 'Charon', description: 'Calm, informative & professional', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Deep, resonant, calm & authoritative', gender: 'Male' },
  { id: 'Orus', name: 'Orus', description: 'Firm & calm', gender: 'Male' },
  { id: 'Enceladus', name: 'Enceladus', description: 'Soft & breathy', gender: 'Male' },
  { id: 'Iapetus', name: 'Iapetus', description: 'Clear & clean', gender: 'Male' },
  { id: 'Umbriel', name: 'Umbriel', description: 'Relaxed & easy-going', gender: 'Male' },
  { id: 'Algieba', name: 'Algieba', description: 'Smooth & flowing', gender: 'Male' },
  { id: 'Algenib', name: 'Algenib', description: 'Gravelly & textured (Sangat cocok karakter bapak / serak)', gender: 'Male' },
  { id: 'Rasalgethi', name: 'Rasalgethi', description: 'Professional narrator', gender: 'Male' },
  { id: 'Alnilam', name: 'Alnilam', description: 'Confident & firm', gender: 'Male' },
  { id: 'Schedar', name: 'Schedar', description: 'Even & steady', gender: 'Male' },
  { id: 'Pulcherrima', name: 'Pulcherrima', description: 'Forward & enterprising', gender: 'Male' },
  { id: 'Achird', name: 'Achird', description: 'Friendly & kind', gender: 'Male' },
  { id: 'Zubenelgenubi', name: 'Zubenelgenubi', description: 'Casual & relaxed', gender: 'Male' },

  // 👩 Suara Wanita (15 Karakter Suara)
  { id: 'Zephyr', name: 'Zephyr', description: 'Bright & clear', gender: 'Female' },
  { id: 'Kore', name: 'Kore', description: 'Strong & firm', gender: 'Female' },
  { id: 'Leda', name: 'Leda', description: 'Youthful & energetic', gender: 'Female' },
  { id: 'Aoede', name: 'Aoede', description: 'Relaxed & natural / breezy', gender: 'Female' },
  { id: 'Callirrhoe', name: 'Callirrhoe', description: 'Friendly & easy-going', gender: 'Female' },
  { id: 'Autonoe', name: 'Autonoe', description: 'Bright & cheerful', gender: 'Female' },
  { id: 'Despina', name: 'Despina', description: 'Smooth & gentle', gender: 'Female' },
  { id: 'Erinome', name: 'Erinome', description: 'Clear & articulate', gender: 'Female' },
  { id: 'Laomedeia', name: 'Laomedeia', description: 'Positive & upbeat', gender: 'Female' },
  { id: 'Achernar', name: 'Achernar', description: 'Soft & warm', gender: 'Female' },
  { id: 'Gacrux', name: 'Gacrux', description: 'Mature & steady', gender: 'Female' },
  { id: 'Vindemiatrix', name: 'Vindemiatrix', description: 'Gentle & delicate', gender: 'Female' },
  { id: 'Sulafat', name: 'Sulafat', description: 'Warm & approachable', gender: 'Female' },
  { id: 'Sadachbia', name: 'Sadachbia', description: 'Lively & vivid', gender: 'Female' },
  { id: 'Sadaltager', name: 'Sadaltager', description: 'Knowledgeable', gender: 'Female' },
];

/**
 * Google AI Studio (Gemini) TTS Provider
 * Uses native @google/genai SDK with gemini-3.8-flash-lite-tts
 */
export class GoogleGenAITTSProvider implements TTSProvider {
  name = 'gemini';
  private ai: GoogleGenAI | null = null;
  private apiKey: string;

  constructor(apiKey = process.env.GEMINI_API_KEY || '') {
    this.apiKey = apiKey.trim();
    this.initClient();
  }

  private initClient() {
    if (this.apiKey && !this.apiKey.includes('MY_GEMINI_API_KEY')) {
      this.ai = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && !this.apiKey.includes('MY_GEMINI_API_KEY'));
  }

  async generateSpeech(options: TTSOptions): Promise<TTSProviderResult> {
    if (!this.ai || !this.isConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured on the server.');
    }

    const { text, voice, emotion = 'neutral', voiceDescription = '' } = options;

    if (!text || text.trim().length === 0) {
      throw new Error('Dialogue text is required');
    }

    const voiceName = this.normalizeVoiceName(voice);

    let stylePrompt = voiceDescription || 'Natural comic dialogue';
    if (emotion && emotion !== 'neutral') {
      stylePrompt += `. Speaking with an intensely ${emotion} delivery.`;
    }

    const response = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.trim(),
              speechMetadata: {
                style: stylePrompt,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error('No audio returned from Google Gemini speech model.');
    }

    const wavBuffer = Buffer.from(base64Audio, 'base64');
    return {
      audioBuffer: wavBuffer,
      contentType: 'audio/wav',
      characterCount: text.length,
      providerName: 'gemini-3.8-flash-lite-tts',
    };
  }

  private normalizeVoiceName(v: string): string {
    const trimmed = (v || '').trim();
    const matched = GEMINI_VOICES.find(
      (gv) => gv.id.toLowerCase() === trimmed.toLowerCase() || gv.name.toLowerCase() === trimmed.toLowerCase()
    );
    return matched ? matched.id : 'Fenrir';
  }

  async getAvailableVoices() {
    return GEMINI_VOICES;
  }
}

/**
 * Fallback synthesizer that generates valid high-quality WAV audio
 * using pitch and harmonic synthesis if offline.
 */
export class FallbackSynthTTSProvider implements TTSProvider {
  name = 'mock';

  async generateSpeech(options: TTSOptions): Promise<TTSProviderResult> {
    const text = options.text || 'Dialogue';
    const speed = options.speed || 1.0;
    const emotion = options.emotion || 'neutral';
    const voice = options.voice || 'Fenrir';

    const sampleRate = 22050;
    const words = text.trim().split(/\s+/).length;
    const baseDuration = Math.max(1.2, (words * 0.35 + text.length * 0.035) / speed);
    const numSamples = Math.floor(sampleRate * baseDuration);

    // Calculate base pitch based on voice gender and character
    const foundVoice = GEMINI_VOICES.find((v) => v.id.toLowerCase() === voice.toLowerCase());
    let baseFreq = foundVoice?.gender === 'Female' ? 210 : 120;

    if (voice === 'Fenrir' || voice === 'Charon' || voice === 'Algenib') baseFreq = 95;
    else if (voice === 'Puck' || voice === 'Pulcherrima') baseFreq = 150;
    else if (voice === 'Kore' || voice === 'Zephyr' || voice === 'Leda') baseFreq = 230;

    if (emotion === 'excited' || emotion === 'shouting') baseFreq *= 1.25;
    if (emotion === 'sad' || emotion === 'sleepy') baseFreq *= 0.85;

    const pcmData = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const syllableMod = 0.5 + 0.5 * Math.sin(2 * Math.PI * 4.5 * t);
      const phraseProgress = t / baseDuration;
      const pitchContour = baseFreq * (1.0 + 0.15 * Math.sin(Math.PI * phraseProgress) - 0.1 * phraseProgress);

      const fundamental = Math.sin(2 * Math.PI * pitchContour * t);
      const h2 = 0.5 * Math.sin(2 * Math.PI * pitchContour * 2 * t);
      const h3 = 0.25 * Math.sin(2 * Math.PI * pitchContour * 3 * t);
      const h4 = 0.12 * Math.sin(2 * Math.PI * pitchContour * 4 * t);
      const noise = (Math.random() * 2 - 1) * 0.05;

      let env = 1.0;
      if (t < 0.08) env = t / 0.08;
      else if (t > baseDuration - 0.08) env = (baseDuration - t) / 0.08;

      let sample = (fundamental + h2 + h3 + h4 + noise) * syllableMod * env;
      if (emotion === 'whisper') sample *= 0.6;
      if (emotion === 'shouting') sample = Math.tanh(sample * 1.5) * 1.1;

      pcmData[i] = Math.max(-32768, Math.min(32767, Math.floor(sample * 14000)));
    }

    const wavBuffer = createWavFile(pcmData, sampleRate, 1);
    return {
      audioBuffer: wavBuffer,
      contentType: 'audio/wav',
      characterCount: text.length,
      providerName: 'local-synth',
    };
  }

  async getAvailableVoices() {
    return GEMINI_VOICES;
  }
}

function createWavFile(pcmSamples: Int16Array, sampleRate: number, numChannels: number): Buffer {
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const dataSize = pcmSamples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);

  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < pcmSamples.length; i++) {
    buffer.writeInt16LE(pcmSamples[i], 44 + i * 2);
  }

  return buffer;
}

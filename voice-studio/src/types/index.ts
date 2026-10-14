export type EmotionTag =
  | 'neutral'
  | 'excited'
  | 'angry'
  | 'sad'
  | 'sleepy'
  | 'sarcastic'
  | 'shouting'
  | 'whisper';

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

export interface VoiceOption {
  id: GeminiVoiceName;
  name: string;
  description: string;
  gender: 'Male' | 'Female';
}

export const GEMINI_VOICES_CATALOG: VoiceOption[] = [
  // 👨 Suara Pria (15 Karakter Suara)
  { id: 'Puck', name: 'Puck', description: 'Upbeat & energetic', gender: 'Male' },
  { id: 'Charon', name: 'Charon', description: 'Calm, informative & professional', gender: 'Male' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Deep, resonant, calm & authoritative', gender: 'Male' },
  { id: 'Orus', name: 'Orus', description: 'Firm & calm', gender: 'Male' },
  { id: 'Enceladus', name: 'Enceladus', description: 'Soft & breathy', gender: 'Male' },
  { id: 'Iapetus', name: 'Iapetus', description: 'Clear & clean', gender: 'Male' },
  { id: 'Umbriel', name: 'Umbriel', description: 'Relaxed & easy-going', gender: 'Male' },
  { id: 'Algieba', name: 'Algieba', description: 'Smooth & flowing', gender: 'Male' },
  { id: 'Algenib', name: 'Algenib', description: 'Gravelly & textured (Cocok untuk karakter bapak / serak)', gender: 'Male' },
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

export interface Character {
  id: string;
  name: string;
  role: string;
  age?: number | string;
  voiceDescription: string;
  voice: GeminiVoiceName;
  avatarColor: string;
  defaultSpeed: number;
  gender?: 'male' | 'female' | 'neutral';
}

export interface AudioTake {
  id: string;
  takeNumber: number;
  audioBase64: string; // Stored in IndexedDB for reliable playback and export
  audioBlobUrl?: string; // Runtime object URL for fast HTML5 audio decoding
  duration: number; // in seconds
  format: 'wav' | 'mp3';
  createdAt: string;
  characterCount: number;
  providerUsed: string;
}

export type LineStatus = 'idle' | 'queued' | 'generating' | 'done' | 'failed';

export interface ScriptLine {
  id: string;
  chapter: string; // e.g., "CH1", "CH2"
  page: number; // e.g., 1, 2
  panel: number; // e.g., 1, 2, 3
  characterId: string;
  dialogue: string;
  voiceActingDescription?: string;
  emotion: EmotionTag;
  speed: number; // 0.5 to 1.8
  takes: AudioTake[];
  selectedTakeId?: string;
  status: LineStatus;
  errorMessage?: string;
}

export interface ProjectSettings {
  provider: 'gemini' | 'mock';
  defaultOutputFormat: 'wav' | 'mp3';
  concurrencyLimit: number;
  mergeSilenceGap: number; // Default 0.4s
  autoPlayNext: boolean;
}

export interface ProjectStats {
  totalCharactersGenerated: number;
  totalGenerations: number;
  lastGeneratedAt?: string;
}

export interface ProjectData {
  id: string;
  name: string;
  subtitle: string;
  characters: Character[];
  lines: ScriptLine[];
  settings: ProjectSettings;
  stats: ProjectStats;
  currentChapter: string;
  currentPage: number;
  updatedAt: string;
}

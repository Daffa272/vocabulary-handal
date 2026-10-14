import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';

interface WaveformPlayerProps {
  audioUrl: string;
  onEnded?: () => void;
  className?: string;
  autoPlay?: boolean;
  compact?: boolean;
}

export const WaveformPlayer: React.FC<WaveformPlayerProps> = ({
  audioUrl,
  onEnded,
  className = '',
  autoPlay = false,
  compact = false,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [peaks, setPeaks] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Generate waveform peaks from audio
  useEffect(() => {
    let isCancelled = false;
    if (!audioUrl) return;

    setIsReady(false);
    setCurrentTime(0);
    setIsPlaying(false);

    async function extractPeaks() {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        const res = await fetch(audioUrl);
        const arrayBuf = await res.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuf);

        if (isCancelled) return;

        const rawData = audioBuffer.getChannelData(0);
        const samplesCount = compact ? 45 : 70;
        const blockSize = Math.floor(rawData.length / samplesCount);
        const extractedPeaks: number[] = [];

        for (let i = 0; i < samplesCount; i++) {
          const start = i * blockSize;
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[start + j] || 0);
          }
          extractedPeaks.push(sum / blockSize);
        }

        // Normalize
        const max = Math.max(...extractedPeaks, 0.01);
        const normalized = extractedPeaks.map((p) => Math.max(0.12, p / max));
        setPeaks(normalized);
        setDuration(audioBuffer.duration);
        setIsReady(true);
      } catch (err) {
        // Fallback procedural waveform peaks
        const fallbackCount = compact ? 45 : 70;
        const pseudoPeaks = Array.from({ length: fallbackCount }, (_, i) => {
          return 0.2 + 0.7 * Math.abs(Math.sin((i / 5) + Math.cos(i / 2)));
        });
        setPeaks(pseudoPeaks);
        setIsReady(true);
      }
    }

    extractPeaks();

    return () => {
      isCancelled = true;
    };
  }, [audioUrl, compact]);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onAudioEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onAudioEnd);

    if (autoPlay) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onAudioEnd);
    };
  }, [audioUrl, autoPlay, onEnded]);

  // Draw waveform on canvas
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || peaks.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const progress = duration > 0 ? currentTime / duration : 0;
    const barWidth = width / peaks.length - 2;
    const gap = 2;

    peaks.forEach((peak, i) => {
      const x = i * (barWidth + gap);
      const barHeight = Math.max(4, peak * (height - 8));
      const y = (height - barHeight) / 2;
      const barProgress = (i + 1) / peaks.length;

      const isPlayed = barProgress <= progress;

      if (isPlayed) {
        ctx.fillStyle = '#38bdf8'; // Sky-400
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 4;
      } else {
        ctx.fillStyle = '#334155'; // Slate-700
        ctx.shadowBlur = 0;
      }

      // Draw rounded bar
      const radius = 2;
      ctx.beginPath();
      ctx.roundRect(x, y, Math.max(2, barWidth), barHeight, radius);
      ctx.fill();
    });
  }, [peaks, currentTime, duration]);

  useEffect(() => {
    drawWaveform();
  }, [drawWaveform]);

  // Handle waveform click / seek
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    if (!canvas || !audio || duration <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = ratio * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextSpeed;
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audio.muted = newMuted;
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${mins}:${secs.toString().padStart(2, '0')}.${tenths}`;
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 shadow-inner flex flex-col gap-2 ${className}`}
    >
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      {/* Waveform Canvas */}
      <div className="relative group cursor-pointer" onClick={handleCanvasClick}>
        <canvas
          ref={canvasRef}
          width={compact ? 240 : 420}
          height={compact ? 36 : 48}
          className="w-full rounded bg-slate-950/60 transition-colors group-hover:bg-slate-950/80"
          title="Click to seek"
        />
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-sky-400 pointer-events-none transition-all shadow-[0_0_8px_#38bdf8]"
          style={{ left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-50 text-slate-950 font-bold flex items-center justify-center transition shadow-md cursor-pointer"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
              }
            }}
            className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title="Restart line"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="font-mono text-[11px] text-slate-400">
            <span className="text-sky-300 font-semibold">{formatTime(currentTime)}</span>
            {' / '}
            <span>{formatTime(duration)}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Playback speed toggle */}
          <button
            onClick={cycleSpeed}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 rounded text-[11px] font-mono text-sky-300 border border-slate-700/80 transition cursor-pointer flex items-center gap-1"
            title="Playback speed"
          >
            <FastForward className="w-3 h-3 text-sky-400" />
            <span>{playbackRate}x</span>
          </button>

          {/* Volume toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

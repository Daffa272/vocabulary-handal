import { AudioTake } from '../types';
import { base64ToBlob } from './ttsClient';

/**
 * Merges multiple AudioTakes into a single continuous audio file
 * with a customizable silence gap between each line using the Web Audio API.
 */
export async function mergeAudioTakes(
  takes: AudioTake[],
  gapSeconds = 0.4
): Promise<{ blob: Blob; url: string; duration: number; sampleRate: number }> {
  if (takes.length === 0) {
    throw new Error('No audio takes provided for merging');
  }

  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioContextClass();

  // 1. Decode each take into an AudioBuffer
  const decodedBuffers: AudioBuffer[] = [];
  for (const take of takes) {
    let arrayBuffer: ArrayBuffer;
    if (take.audioBase64) {
      const blob = base64ToBlob(take.audioBase64, take.format === 'wav' ? 'audio/wav' : 'audio/mpeg');
      arrayBuffer = await blob.arrayBuffer();
    } else if (take.audioBlobUrl) {
      const res = await fetch(take.audioBlobUrl);
      arrayBuffer = await res.arrayBuffer();
    } else {
      continue;
    }

    try {
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      decodedBuffers.push(audioBuffer);
    } catch (err) {
      console.warn('Failed to decode take for merge:', take.id, err);
    }
  }

  if (decodedBuffers.length === 0) {
    throw new Error('Could not decode any valid audio takes for merging');
  }

  // 2. Calculate total merged length and channels
  const targetSampleRate = decodedBuffers[0].sampleRate;
  const numChannels = Math.max(...decodedBuffers.map((b) => b.numberOfChannels));
  const gapSamples = Math.floor(gapSeconds * targetSampleRate);

  let totalLength = 0;
  for (let i = 0; i < decodedBuffers.length; i++) {
    totalLength += decodedBuffers[i].length;
    if (i < decodedBuffers.length - 1) {
      totalLength += gapSamples;
    }
  }

  // 3. Render concatenated audio buffer
  const mergedBuffer = audioCtx.createBuffer(numChannels, totalLength, targetSampleRate);

  let currentOffset = 0;
  for (let bIndex = 0; bIndex < decodedBuffers.length; bIndex++) {
    const srcBuf = decodedBuffers[bIndex];
    for (let channel = 0; channel < numChannels; channel++) {
      const srcChannel = channel < srcBuf.numberOfChannels ? channel : 0;
      const srcData = srcBuf.getChannelData(srcChannel);
      const destData = mergedBuffer.getChannelData(channel);
      destData.set(srcData, currentOffset);
    }
    currentOffset += srcBuf.length;
    if (bIndex < decodedBuffers.length - 1) {
      // Silence gap is zeroes, already initialized in createBuffer
      currentOffset += gapSamples;
    }
  }

  const totalDuration = totalLength / targetSampleRate;

  // 4. Encode to standard WAV Blob
  const wavBlob = audioBufferToWavBlob(mergedBuffer);
  const url = URL.createObjectURL(wavBlob);

  return {
    blob: wavBlob,
    url,
    duration: totalDuration,
    sampleRate: targetSampleRate,
  };
}

/**
 * Encodes an AudioBuffer into a RIFF WAV Blob.
 */
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const numSamples = buffer.length;
  const dataSize = numSamples * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  // RIFF Chunk
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt Subchunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data Subchunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Interleave channels & write 16-bit PCM
  let offset = 44;
  const channelData: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channelData.push(buffer.getChannelData(c));
  }

  for (let i = 0; i < numSamples; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, channelData[c][i]));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, Math.floor(intSample), true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

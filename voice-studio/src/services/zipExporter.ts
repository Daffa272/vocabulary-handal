import JSZip from 'jszip';
import { Character, ScriptLine } from '../types';
import { base64ToBlob } from './ttsClient';

/**
 * Generates the standardized filename according to specification:
 * e.g. ch2_p1_panel2_berg_001.mp3
 */
export function formatAudioFilename(
  line: ScriptLine,
  character: Character | undefined,
  index: number,
  format: 'mp3' | 'wav' = 'mp3'
): string {
  const chClean = line.chapter.toLowerCase().replace(/[^a-z0-9]/g, '');
  const pClean = `p${line.page}`;
  const panelClean = `panel${line.panel}`;

  let charClean = 'speaker';
  if (character?.name) {
    const parts = character.name.toLowerCase().split(' ');
    charClean = parts[parts.length - 1].replace(/[^a-z0-9]/g, '') || 'char';
  }

  const paddedIndex = String(index).padStart(3, '0');
  return `${chClean}_${pClean}_${panelClean}_${charClean}_${paddedIndex}.${format}`;
}

/**
 * Downloads a single Blob with a given filename
 */
export function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/**
 * Exports all active line audio takes for a page or chapter as a ZIP file.
 */
export async function exportLinesToZip(
  lines: ScriptLine[],
  characters: Character[],
  zipTitle: string,
  onProgress?: (progress: number, statusText: string) => void
): Promise<void> {
  const zip = new JSZip();
  const charMap = new Map<string, Character>();
  characters.forEach((c) => charMap.set(c.id, c));

  let addedFilesCount = 0;
  const manifestLines: string[] = ['Filename,Chapter,Page,Panel,Character,Emotion,Dialogue'];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const character = charMap.get(line.characterId);
    const activeTake =
      line.takes.find((t) => t.id === line.selectedTakeId) || line.takes[line.takes.length - 1];

    if (!activeTake) continue;

    const filename = formatAudioFilename(line, character, i + 1, activeTake.format);

    let blob: Blob;
    if (activeTake.audioBase64) {
      blob = base64ToBlob(activeTake.audioBase64, activeTake.format === 'wav' ? 'audio/wav' : 'audio/mpeg');
    } else if (activeTake.audioBlobUrl) {
      const res = await fetch(activeTake.audioBlobUrl);
      blob = await res.blob();
    } else {
      continue;
    }

    zip.file(filename, blob);
    manifestLines.push(
      `"${filename}","${line.chapter}",${line.page},${line.panel},"${character?.name || 'Unknown'}","${line.emotion}","${line.dialogue.replace(/"/g, '""')}"`
    );
    addedFilesCount++;

    if (onProgress) {
      onProgress(Math.round(((i + 1) / lines.length) * 80), `Packing ${filename}...`);
    }
  }

  if (addedFilesCount === 0) {
    throw new Error('No audio takes found to export. Please generate speech for at least one line first.');
  }

  // Include dialogue manifest inside ZIP
  zip.file('manifest.csv', manifestLines.join('\n'));
  zip.file(
    'README.txt',
    `Voice Studio Audio Export - ${zipTitle}\nTotal files: ${addedFilesCount}\nGenerated at: ${new Date().toISOString()}\n\nNote: All dialogue audio generated for comic project.`
  );

  if (onProgress) {
    onProgress(90, 'Compressing archive...');
  }

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) {
      onProgress(90 + Math.round(metadata.percent * 0.1), 'Finalizing ZIP...');
    }
  });

  triggerFileDownload(content, `${zipTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.zip`);

  if (onProgress) {
    onProgress(100, 'Complete!');
  }
}

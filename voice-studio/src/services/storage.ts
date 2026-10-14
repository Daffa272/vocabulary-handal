import { ProjectData } from '../types';
import { INITIAL_PROJECT } from '../data/sampleProject';

const DB_NAME = 'VoiceStudioDB';
const STORE_NAME = 'projects';
const PROJECT_KEY = 'active_project';
const LOCAL_STORAGE_BACKUP = 'voice_studio_project_backup';
const GEMINI_API_KEY_STORAGE = 'voice_studio_gemini_api_key';

export function loadGeminiApiKey(): string {
  return localStorage.getItem(GEMINI_API_KEY_STORAGE) || '';
}

export function saveGeminiApiKey(apiKey: string): void {
  localStorage.setItem(GEMINI_API_KEY_STORAGE, apiKey.trim());
}

export function clearGeminiApiKey(): void {
  localStorage.removeItem(GEMINI_API_KEY_STORAGE);
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadProject(): Promise<ProjectData> {
  try {
    const db = await openDatabase();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(PROJECT_KEY);
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result);
        } else {
          // Check localStorage fallback
          const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP);
          if (raw) {
            try {
              resolve(JSON.parse(raw));
              return;
            } catch {
              // Ignore parse error
            }
          }
          resolve(INITIAL_PROJECT);
        }
      };
      request.onerror = () => {
        resolve(INITIAL_PROJECT);
      };
    });
  } catch (err) {
    console.warn('IndexedDB unavailable, falling back to localStorage:', err);
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_BACKUP);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PROJECT;
  }
}

export async function saveProject(project: ProjectData): Promise<void> {
  const updatedProject = {
    ...project,
    updatedAt: new Date().toISOString(),
  };

  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(updatedProject, PROJECT_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Could not save to IndexedDB, saving to localStorage:', err);
  }

  // Also save lightweight metadata to localStorage
  try {
    // Strip heavy base64 for quick localStorage backup
    const shallowCopy = {
      ...updatedProject,
      lines: updatedProject.lines.map((l) => ({
        ...l,
        takes: l.takes.map((t) => ({ ...t, audioBase64: '' })),
      })),
    };
    localStorage.setItem(LOCAL_STORAGE_BACKUP, JSON.stringify(shallowCopy));
  } catch {
    // Ignore quota issues for backup
  }
}

export function exportProjectJson(project: ProjectData, includeAudio = true): string {
  const dataToExport = includeAudio
    ? project
    : {
        ...project,
        lines: project.lines.map((l) => ({
          ...l,
          takes: l.takes.map((t) => ({ ...t, audioBase64: '' })),
        })),
      };
  return JSON.stringify(dataToExport, null, 2);
}

export function importProjectJson(jsonStr: string): ProjectData {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.characters || !Array.isArray(parsed.characters) || !parsed.lines) {
    throw new Error('Invalid project JSON schema. Missing characters or script lines.');
  }
  return {
    ...INITIAL_PROJECT,
    ...parsed,
    id: parsed.id || `proj-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
}

export async function resetProject(): Promise<ProjectData> {
  try {
    const db = await openDatabase();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(PROJECT_KEY);
  } catch {
    // Ignore
  }
  localStorage.removeItem(LOCAL_STORAGE_BACKUP);
  return INITIAL_PROJECT;
}

import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'vercel-output');
const staticDirectories = [
  'ekonomi',
  'financial',
  'finmetrics',
  'images',
  'investment bank',
  'jejak-data',
  'pajak',
  'power-bi-academy-—-from-beginner-to-data-analyst (1)',
  'scrapping',
  'toefl',
];
const ignoredNames = new Set(['.git', '.vercel', 'node_modules']);

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isFile() && /\.(html|js)$/i.test(entry.name)) {
    await cp(path.join(root, entry.name), path.join(output, entry.name));
  }

  if (entry.isDirectory() && staticDirectories.includes(entry.name)) {
    await cp(path.join(root, entry.name), path.join(output, entry.name), {
      recursive: true,
      filter: (source) => {
        const relative = path.relative(root, source);
        return !relative.split(path.sep).some((part) =>
          ignoredNames.has(part) || part.startsWith('.env')
        );
      },
    });
  }
}

await cp(
  path.join(root, 'voice-studio', 'dist'),
  path.join(output, 'voice-studio'),
  { recursive: true }
);

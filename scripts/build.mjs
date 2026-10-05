import { mkdir, rm, cp } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
for (const name of ['index.html','404.html','robots.txt','sitemap.xml']) await cp(name, `dist/${name}`);
for (const name of ['chennai-ai','fonts']) await cp(`assets/${name}`, `dist/assets/${name}`, { recursive: true });
await cp('media-kit', 'dist/media-kit', { recursive: true });

import {readFile,writeFile,mkdir,cp,rm,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {renderHome,renderMediaKit,renderNotFound,boilerplate,validateSite} from './render.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const exists=async p=>access(p).then(()=>true,()=>false);
export async function buildSite(root=process.cwd()) {
  const s=validateSite(JSON.parse(await readFile(path.join(root,'config/site.json'),'utf8')));
  const dist=path.join(root,'dist');
  await rm(dist,{recursive:true,force:true}); await mkdir(path.join(dist,'media-kit/guide'),{recursive:true});
  await cp(path.join(root,'assets'),path.join(dist,'assets'),{recursive:true});
  if(await exists(path.join(root,'assets/brand/favicon.ico'))) await cp(path.join(root,'assets/brand/favicon.ico'),path.join(dist,'favicon.ico'));
  // Retain explicitly supplied legacy downloads, never mix historic files into the current kit.
  if(await exists(path.join(root,'downloads'))) await cp(path.join(root,'downloads'),path.join(dist,'downloads'),{recursive:true});
  await mkdir(path.join(dist,'assets/core'),{recursive:true});
  await cp(path.join(here,'site.css'),path.join(dist,'assets/core/site.css'));
  await writeFile(path.join(dist,'assets/brand/theme.css'),`:root{--ink:${s.colors.ink};--accent:${s.colors.accent};--paper:${s.colors.paper};--highlight:${s.colors.highlight};--rule:${s.colors.ink}35}`);
  await writeFile(path.join(dist,'index.html'),renderHome(s));
  await writeFile(path.join(dist,'404.html'),renderNotFound(s));
  await writeFile(path.join(dist,'media-kit/index.html'),renderMediaKit(s));
  await writeFile(path.join(dist,'media-kit/guide/index.html'),renderMediaKit(s,true));
  await writeFile(path.join(dist,'media-kit/boilerplate.txt'),boilerplate(s));
  if(await exists(path.join(root,'media-kit/brand-guide.pdf'))) await cp(path.join(root,'media-kit/brand-guide.pdf'),path.join(dist,'media-kit/brand-guide.pdf'));
  await writeFile(path.join(dist,'robots.txt'),s.publish?`User-agent: *\nAllow: /\nSitemap: https://${s.domain}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
  await writeFile(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${s.publish?`<url><loc>https://${s.domain}/</loc></url>`:''}</urlset>`);
  const policies=`/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: DENY\n  Permissions-Policy: camera=(), microphone=(), geolocation=()\n  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; font-src 'self'; script-src 'none'; connect-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'\n${!s.publish?'  X-Robots-Tag: noindex, nofollow\n':''}\n/media-kit/*\n  X-Robots-Tag: noindex\n\n/downloads/*\n  X-Robots-Tag: noindex\n`;
  await writeFile(path.join(dist,'_headers'),policies);
  execFileSync('python3',[path.join(here,'package-kit.py'),root],{stdio:'inherit'});
  console.log(`Built ${s.name} (${s.publish?'release eligible':'LOCAL ONLY'})`);
}

import {readFile,access} from 'node:fs/promises';
import {validateSite,renderHome,renderMediaKit} from '../vendor/tech-week-core/render.mjs';
import {verifyCore} from './verify-core.mjs';
await verifyCore();
const s=validateSite(JSON.parse(await readFile('config/site.json','utf8')));
for(const name of ['wordmark','mono','reverse','profile']) for(const ext of ['svg','png']) await access(`assets/brand/${name}.${ext}`);
for(const f of ['assets/brand/favicon.svg','assets/brand/apple-touch-icon.png','assets/brand/social-preview.png','media-kit/brand-guide.pdf']) await access(f);
for(const f of [s.art?.src,s.photo?.src].filter(Boolean)) await access('.'+f);
for(const html of [renderHome(s),renderMediaKit(s)]) {if(html.split('<footer')[1].includes('/media-kit')) throw Error('Media kit must not be in footer');}
if(!s.publish && s.domain) throw Error('Draft site must not claim domain');
console.log('Brand assets, publication policy and footer checks passed.');

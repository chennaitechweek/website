import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
const ignored=new Set(['.git','node_modules','dist','.wrangler','.playwright-cli']);
const forbidden=[new RegExp('/'+'Users/'),new RegExp('/'+'Volumes/'),new RegExp('file'+':/'),new RegExp('Documents/'+'Codex/')];
async function scan(dir) {for(const x of await readdir(dir,{withFileTypes:true})) {if(ignored.has(x.name)) continue;const f=path.join(dir,x.name);if(x.isDirectory()) await scan(f);else if(/\.(md|mjs|js|json|jsonc|html|css|svg|txt|yml|yaml)$/.test(f)) {const t=await readFile(f,'utf8');if(forbidden.some(re=>re.test(t))) throw Error('Machine-specific path in '+f);}}}
await scan('.');console.log('Portable paths verified.');

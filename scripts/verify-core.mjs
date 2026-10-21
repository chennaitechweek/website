import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export async function verifyCore({release=false}={}) {
 const lock=JSON.parse(await readFile('core.lock.json','utf8'));
 if(!/^[0-9a-f]{40}$/.test(lock.commit)) throw Error('Invalid Core pin');
 if(release && lock.dirty) throw Error('Release requires a clean, committed Core snapshot');
 const actual=(await readdir('vendor/tech-week-core')).sort();
 if(JSON.stringify(actual)!==JSON.stringify(Object.keys(lock.files).sort())) throw Error('Core file inventory changed');
 for(const [name,hash] of Object.entries(lock.files)) {
  if(!/^[a-zA-Z0-9.-]+$/.test(name)) throw Error('Invalid Core filename');
  const data=await readFile(`vendor/tech-week-core/${name}`);
  if(createHash('sha256').update(data).digest('hex')!==hash) throw Error(`Core checksum mismatch: ${name}. Update in the central repo, then sync.`);
 }
 console.log(`Core ${lock.version} verified (${lock.commit.slice(0,12)})`);
}
if(process.argv.includes('--release')) await verifyCore({release:true});

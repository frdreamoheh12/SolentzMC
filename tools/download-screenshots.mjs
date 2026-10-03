import {writeFile,readFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const screenshots=JSON.parse(await readFile(path.join(root,'assets/work-sources.json'),'utf8'));
let missing=0;
for(const shot of screenshots){
 const destination=path.join(root,shot.src);
 try{await access(destination);console.log(`${shot.title}: already present`);continue;}catch{}
 try{
  const response=await fetch(shot.source,{signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  if(!response.headers.get('content-type')?.startsWith('image/'))throw new Error('Source did not return an image');
  await writeFile(destination,Buffer.from(await response.arrayBuffer()));console.log(`${shot.title}: downloaded`);
 }catch(error){missing++;console.error(`${shot.title}: ${error.message}`);}
}
if(missing){console.error(`${missing} screenshots are still unavailable. Add the original JPGs as assets/work-01.jpg through assets/work-11.jpg in the supplied order, then run npm run build.`);process.exitCode=1;}

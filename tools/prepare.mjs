import {readFile,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const safe=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const screenshots=JSON.parse(await readFile(path.join(root,'assets/work-sources.json'),'utf8'));
const cards=[];
for(const [index,shot] of screenshots.entries()){
 let available=true;try{await access(path.join(root,shot.src));}catch{available=false;}
 cards.push(`<button class="gallery-item" data-index="${index}" data-image="${safe(shot.src)}" data-title="${safe(shot.title)}" data-alt="${safe(shot.alt)}" ${available?'':'disabled'} aria-label="${available?`Open ${shot.title} in fullscreen screenshot viewer`:`${shot.title}: source screenshot unavailable`}">${available?`<img src="${shot.src}" alt="${shot.alt}" loading="lazy" decoding="async">`:'<div class="asset-unavailable"><strong>Screenshot unavailable</strong><span>The original source could not be retrieved.</span></div>'}<span class="gallery-label"><span>${shot.title}</span><span>${available?'EXPAND ⛶':'SOURCE UNAVAILABLE'}</span></span></button>`);
}
const file=path.join(root,'work-preview.html');
let html=await readFile(file,'utf8');
const marker='<div class="gallery" id="gallery">';
const start=html.indexOf(marker),end=html.indexOf('</section>',start);
if(start<0||end<0)throw new Error('Work gallery markup not found');
html=html.slice(0,start)+marker+'\n'+cards.join('\n')+'\n</div>'+html.slice(end);
await writeFile(file,html);
console.log('Gallery prepared from actual local files. All pages remain directly editable HTML.');

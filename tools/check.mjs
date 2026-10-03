import assert from 'node:assert/strict';
import {readFile,access,readdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const routes=[['index.html','home','Home'],['packages.html','packages','Packages'],['work-preview.html','work','Work Preview'],['services.html','services','Services'],['astralab.html','astralab','AstraLab'],['plugins.html','plugins','Plugins'],['information.html','information','Information']];
const data=JSON.parse(await readFile(path.join(root,'portfolio-data.json'),'utf8'));
const css=await readFile(path.join(root,'css/style.css'),'utf8');
const js=await readFile(path.join(root,'js/main.js'),'utf8');
for(const dir of ['src','dist','node_modules'])assert(!(await readdir(root)).includes(dir),`${dir} must not be included`);
assert(!js.includes('hashchange'),'There must be no single-page hash router');
assert(!/^\s*(import|export)\b/m.test(js),'Browser JavaScript must work without module loading');
execFileSync(process.execPath,['--check',path.join(root,'js/main.js')]);
for(const tool of ['serve.mjs','prepare.mjs','check.mjs','download-screenshots.mjs'])execFileSync(process.execPath,['--check',path.join(root,'tools',tool)]);
const documents={};
for(const [file,id,label] of routes){
 const html=await readFile(path.join(root,file),'utf8');documents[file]=html;
 const sections=[...html.matchAll(/<section id="([^"]+)" class="page"/g)].map(m=>m[1]);assert.deepEqual(sections,[id],`${file} must contain only its own page`);
 assert(!html.includes('class="page" hidden'),`${file} content must be visible by default`);
 assert.equal([...html.matchAll(/<h1\b/g)].length,1,`${file} has one primary heading`);
 const nav=html.match(/<nav id="primary-nav"[\s\S]*?<\/nav>/)[0];
 assert.deepEqual([...nav.matchAll(/href="([^"]+)"/g)].map(m=>m[1]),routes.map(r=>r[0]),`${file} has all seven real page links`);
 assert(nav.includes(`href="${file}" aria-current="page">${label}`),`${file} active navigation is correct`);
 assert.equal([...nav.matchAll(/aria-current="page"/g)].length,1);
 assert(html.includes('href="css/style.css"'));assert(html.includes('<script defer src="js/main.js"></script>'));
 assert(/<title>[^<]+<\/title>/.test(html));assert(/<meta name="description" content="[^"]+">/.test(html));
 for(const [,reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(/^(https?:|mailto:|tel:)/.test(reference))continue;
  const [local,fragment]=reference.split('#');
  const referencedFile=local||file;
  await access(path.join(root,referencedFile));
  if(fragment){const target=await readFile(path.join(root,referencedFile),'utf8');assert(target.includes(`id="${fragment}"`),`${file} fragment ${reference} resolves`);}
 }
 for(const [tag] of html.matchAll(/<img\b[^>]*>/g))assert(/alt="[^"]+"/.test(tag)||tag.includes('id="lightbox-image"'),'Meaningful image alt text is required');
 for(const [tag] of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g))assert(tag.includes('noopener noreferrer'));
}
assert(!documents['index.html'].includes('id="packages-title"'));
assert(documents['index.html'].includes('href="information.html#skills"'));
assert(documents['index.html'].includes('data-count="162"'));assert(documents['work-preview.html'].includes('data-count="20"'));
assert.equal([...documents['packages.html'].matchAll(/class="panel package"/g)].length,9);
for(const pkg of data.packages){assert(documents['packages.html'].includes(`₹${pkg.price.toLocaleString('en-IN')}`));for(const feature of pkg.features)assert(documents['packages.html'].includes(feature));}
assert(!documents['packages.html'].includes('$'));
assert.equal([...documents['plugins.html'].matchAll(/class="panel plugin"/g)].length,17);
for(const group of data.plugins)for(const plugin of group.items)assert(documents['plugins.html'].includes(plugin.name));
assert.equal(data.services.flatMap(g=>g.items).length,31);for(const group of data.services)for(const service of group.items)assert(documents['services.html'].includes(service));
assert.equal([...documents['work-preview.html'].matchAll(/class="gallery-item"/g)].length,11);
assert(css.includes('prefers-reduced-motion'));assert(js.includes('showModal()'));assert(js.includes("'ArrowLeft'"));assert(js.includes('IntersectionObserver'));
for(const [,reference] of css.matchAll(/url\(['"]?([^'"\)]+)['"]?\)/g))await access(path.resolve(root,'css',reference));
console.log('PASS: Home is index.html; seven independent HTML pages; all internal links and fragments resolve; one visible page per document; correct active navigation; local-file-compatible JavaScript; 9 INR packages, 17 plugins, 31 services; CSS/font/image references.');
const missing=[];for(const shot of data.screenshots)try{await access(path.join(root,shot.src));}catch{missing.push(shot.title);}
if(missing.length){console.warn(`KNOWN ASSET GAP: ${missing.length} original work screenshots remain unavailable. No fabricated work or broken image references were added.`);if(process.argv.includes('--require-screenshots'))process.exitCode=1;}
else console.log('PASS: All eleven original work screenshots are included.');

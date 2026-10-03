/* DevSolentz portfolio: classic deferred script, compatible with directly opened HTML files. */
(()=>{
'use strict';
document.documentElement.classList.add('js-enabled');
const $ = selector => document.querySelector(selector);
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const nav = $('#primary-nav');
const toggle = $('.menu-toggle');
function closeMenu(){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');nav.classList.toggle('is-open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('is-open')){closeMenu();toggle.focus();}});
document.addEventListener('click',event=>{if(nav.classList.contains('is-open')&&!event.target.closest('.site-header'))closeMenu();});
window.addEventListener('pageshow',()=>closeMenu());

// Counters start only after their section enters the viewport.
const countFrames=new Map();
function countUp(element){
 if(element.dataset.started)return;
 element.dataset.started='true';const target=Number(element.dataset.count);
 if(reducedMotion.matches){element.textContent=target;return;}
 const start=performance.now(),duration=1800;
 function tick(now){const fraction=Math.min((now-start)/duration,1);const value=Math.floor(target*(1-Math.pow(1-fraction,3)));element.textContent=value;if(fraction<1)countFrames.set(element,requestAnimationFrame(tick));else countFrames.delete(element);}
 countFrames.set(element,requestAnimationFrame(tick));
}
const counters=document.querySelectorAll('[data-count]');
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){countUp(entry.target);observer.unobserve(entry.target);}}},{threshold:.35});counters.forEach(el=>observer.observe(el));}else counters.forEach(countUp);
reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches){for(const [el,frame] of countFrames){cancelAnimationFrame(frame);el.textContent=el.dataset.count;}countFrames.clear();document.documentElement.style.setProperty('--mx','0px');document.documentElement.style.setProperty('--my','0px');document.documentElement.style.setProperty('--ax','0px');document.documentElement.style.setProperty('--ay','0px');}});
// Geometry uses six CSS faces rather than a WebGL runtime.
const cubes=[{x:6,y:23,size:28},{x:93,y:15,size:44},{x:83,y:68,size:32},{x:3,y:80,size:55},{x:46,y:4,size:18},{x:64,y:92,size:22}];
$('#cube-field').innerHTML=cubes.map((c,i)=>`<div class="cube-wrap" style="left:${c.x}%;top:${c.y}%;--size:${c.size}px;animation-delay:-${i*5}s"><div class="cube" style="animation-delay:-${i*7}s">${'<span></span>'.repeat(6)}</div></div>`).join('');
$('#particles').innerHTML=Array.from({length:22},(_,i)=>`<i style="left:${(i*47+11)%100}%;top:${(i*29+7)%100}%;animation-delay:-${i}s;${i%3===0?'background:#e6c1db;':''}"></i>`).join('');
let parallaxFrame=null,mouseX=0,mouseY=0;
window.addEventListener('pointermove',event=>{
 if(reducedMotion.matches||!window.matchMedia('(min-width: 901px) and (pointer: fine)').matches||document.hidden)return;
 mouseX=(event.clientX/window.innerWidth-.5);mouseY=(event.clientY/window.innerHeight-.5);
 if(parallaxFrame)return;
 parallaxFrame=requestAnimationFrame(()=>{document.documentElement.style.setProperty('--mx',`${mouseX*12}px`);document.documentElement.style.setProperty('--my',`${mouseY*10}px`);document.documentElement.style.setProperty('--ax',`${mouseX*7}px`);document.documentElement.style.setProperty('--ay',`${mouseY*5}px`);parallaxFrame=null;});
},{passive:true});
document.addEventListener('visibilitychange',()=>{document.querySelectorAll('.cube,.cube-wrap,.particles i,.hero-character,.sitting-character,.full-character,.online i').forEach(el=>el.style.animationPlayState=document.hidden?'paused':'running');});

if($('#gallery') && $('#lightbox')){
const screenshots=[...document.querySelectorAll('.gallery-item')].map(button=>({title:button.dataset.title,src:button.dataset.image,alt:button.dataset.alt}));
const availableImages=new Set();
// Keep asset failures readable; never show a broken-image icon or invented screenshot.
document.querySelectorAll('.gallery-item img').forEach(img=>{
 const button=img.closest('button');
 const markAvailable=()=>availableImages.add(Number(button.dataset.index));
 const failed=()=>{button.disabled=true;button.setAttribute('aria-label',`${screenshots[button.dataset.index].title}: source screenshot unavailable`);const notice=document.createElement('div');notice.className='asset-unavailable';notice.innerHTML='<strong>Screenshot unavailable</strong><span>The original source could not be retrieved.</span>';img.replaceWith(notice);button.querySelector('.gallery-label span:last-child').textContent='SOURCE UNAVAILABLE';};
 img.addEventListener('load',markAvailable,{once:true});img.addEventListener('error',failed,{once:true});
 if(img.complete){if(img.naturalWidth)markAvailable();else failed();}
});

// Native dialog supplies focus trapping, inert background, and Escape dismissal.
const lightbox=$('#lightbox'),lightboxImage=$('#lightbox-image');let currentShot=0,opener=null;
function showShot(index){currentShot=(index+screenshots.length)%screenshots.length;const shot=screenshots[currentShot];lightboxImage.src=shot.src;lightboxImage.alt=shot.alt;$('#lightbox-caption').textContent=`${shot.title} / ${String(screenshots.length).padStart(2,'0')}`;}
function moveShot(direction){let next=currentShot;for(let n=0;n<screenshots.length;n++){next=(next+direction+screenshots.length)%screenshots.length;if(availableImages.has(next)){showShot(next);return;}}}
$('#gallery').addEventListener('click',event=>{const button=event.target.closest('.gallery-item');if(!button||button.disabled)return;opener=button;showShot(Number(button.dataset.index));lightbox.showModal();document.body.classList.add('modal-open');$('#close-lightbox').focus();});
$('#close-lightbox').addEventListener('click',()=>lightbox.close());
$('.lightbox-prev').addEventListener('click',()=>moveShot(-1));$('.lightbox-next').addEventListener('click',()=>moveShot(1));
lightbox.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();moveShot(-1);}if(event.key==='ArrowRight'){event.preventDefault();moveShot(1);}});
lightbox.addEventListener('click',event=>{if(event.target===lightbox){const r=lightbox.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)lightbox.close();}});
lightbox.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});opener?.focus();});
$('#fullscreen-button').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('.lightbox-stage').requestFullscreen)await $('.lightbox-stage').requestFullscreen();}catch{ /* Native dialog remains usable if the browser denies fullscreen. */ }});
if(!document.fullscreenEnabled)$('#fullscreen-button').hidden=true;
let touchStart=null;lightboxImage.addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});lightboxImage.addEventListener('touchend',event=>{if(touchStart!==null){const delta=event.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>60)moveShot(delta>0?-1:1);touchStart=null;}},{passive:true});

}
})();

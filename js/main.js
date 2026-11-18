const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.site-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false')}})}
const revealItems=document.querySelectorAll('.hero-content,.intro-grid>div,.section-heading,.pillar-card,.listen-inner>*,.closing-grid>div,.page-hero .container,.team-card,.axis-card,.initiative,.status-item,.contact-card,.faq-item,.form-panel,.news-empty,.empty-gallery,.impact-item,.quick-access-card');
revealItems.forEach((el,i)=>{el.classList.add('reveal');el.style.animationDelay=(i%4)*85+'ms'});
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.12,rootMargin:'0px 0px -35px 0px'});revealItems.forEach(el=>observer.observe(el))}else{revealItems.forEach(el=>el.classList.add('is-visible'))}
const header=document.querySelector('.site-header');
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span></span>';document.body.appendChild(progress);
const progressBar=progress.querySelector('span');
const topButton=document.createElement('button');topButton.className='back-to-top';topButton.type='button';topButton.setAttribute('aria-label','Volver al inicio de la página');topButton.innerHTML='↑';document.body.appendChild(topButton);
const updateScrollUI=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;const percent=max>0?(window.scrollY/max)*100:0;progressBar.style.width=percent+'%';if(header)header.classList.toggle('is-scrolled',window.scrollY>12);topButton.classList.toggle('visible',window.scrollY>420)};
window.addEventListener('scroll',updateScrollUI,{passive:true});updateScrollUI();
topButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));

/* ── LENIS smooth scroll ── */
const lenis = new Lenis({
  duration: 1.4,
  easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
});
function lenisRaf(time) { lenis.raf(time); requestAnimationFrame(lenisRaf); }
requestAnimationFrame(lenisRaf);

/* ── Cursor ── */
const cur=document.getElementById('cursor'), ring=document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function loop(){rx+=(mx-rx)*.15;ry+=(my-ry)*.15;cur.style.left=mx+'px';cur.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();

/* ── Filter ── */
const btns=document.querySelectorAll('.filters button');
const wraps=document.querySelectorAll('.card-wrap[data-soft]');
btns.forEach(btn=>{
  btn.addEventListener('click',()=>{
    btns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter; let i=0;
    wraps.forEach(w=>{
      const match=f==='all'||w.dataset.soft===f;
      if(match){
        w.style.display=''; w.style.animation='none'; w.offsetHeight;
        w.style.animation=`fadeIn .45s ease ${i++*0.07}s both`;
      } else { w.style.display='none'; }
    });
  });
});

/* ── Tilt ── */
document.querySelectorAll('.card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const dx=(e.clientX-r.left-r.width/2)/(r.width/2);
    const dy=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`rotateY(${dx*9}deg) rotateX(${-dy*9}deg) scale(1.035)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

/* ── Scroll reveal ── */
const obs=new IntersectionObserver(entries=>{
  entries.forEach(en=>{if(en.isIntersecting){en.target.style.animationPlayState='running';}});
},{threshold:.12});
document.querySelectorAll('.card-wrap').forEach(w=>{
  w.style.animationPlayState='paused';
  obs.observe(w);
});

/* ── Modal ── */
const overlay  = document.getElementById('modalOverlay');
const modalArt = document.getElementById('modalArt');
const modalTitle   = document.getElementById('modalTitle');
const modalSoft    = document.getElementById('modalSoft');
const modalDate    = document.getElementById('modalDate');
const modalCat     = document.getElementById('modalCat');
const modalBadge   = document.getElementById('modalBadge');

function openModal(wrap) {
  // Art background
  const artEl = wrap.querySelector('.card-art');
  const bg = artEl ? window.getComputedStyle(artEl).backgroundImage : 'none';
  modalArt.style.backgroundImage = bg;

  // Infos
  const titleEl = wrap.querySelector('.card-title');
  const softEl  = wrap.querySelector('.card-soft');
  const dateEl  = wrap.querySelector('.card-date');
  const badgeEl = wrap.querySelector('.card-badge');

  modalTitle.textContent  = titleEl ? titleEl.textContent : '—';
  modalSoft.textContent   = softEl  ? softEl.textContent  : '—';
  modalDate.textContent   = dateEl  ? dateEl.textContent  : '—';

  // Catégorie depuis data-soft
  const catMap = { original:'Original', fanart:'Fanart', chara:'Chara-Design' };
  const cat = catMap[wrap.dataset.soft] || wrap.dataset.soft || '';
  modalCat.textContent = cat;

  // Badge (visible seulement si présent dans la carte)
  if(badgeEl && badgeEl.textContent.trim()) {
    modalBadge.textContent = badgeEl.textContent.trim();
    modalBadge.style.display = 'inline-block';
  } else {
    modalBadge.style.display = 'none';
  }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  lenis.stop();
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
  lenis.start();
}

// Clic sur card-wrap → ouvrir
document.querySelectorAll('.card-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => openModal(wrap));
});

// Fermer via overlay / bouton
overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
document.getElementById('modalClose').addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });

// Curseur dans la modale
overlay.addEventListener('mousemove', e => { /* le curseur global suffit */ });

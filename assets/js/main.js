/* =========================================================
   Grupo Mais Saúde: interface e movimento
   Conteúdo (convênios, benefícios, lojas) fica em data.js.
   ========================================================= */
import { WHATSAPP, GROUPS, CONVENIOS, HERO, BENEFITS, LOJAS } from './data.js';

const root = document.documentElement;
root.classList.add('js');

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const icon = id => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
const EXT = 'target="_blank" rel="noopener noreferrer"';
const waLink = msg => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
const byId = Object.fromEntries(CONVENIOS.map(c => [c.id, c]));

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap = typeof window.gsap !== 'undefined';
const motionOK = hasGsap && !reduceMotion;
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!motionOK) root.classList.remove('motion');

/* ---------- WhatsApp com mensagem pronta ---------- */
const MSG = {
    cartao: 'Olá! Quero fazer o cartão Mais Saúde. Como funciona?',
    valor: 'Olá! Quero saber o valor do cartão Mais Saúde e como fazer o meu.',
    geral: 'Olá! Vim pelo site do Grupo Mais Saúde.',
    parceiro: 'Olá! Tenho comércio/consultório em Lorena e quero ser parceiro conveniado do Grupo Mais Saúde.',
};
const convMsg = c => `Olá! Vi o site do Grupo Mais Saúde e quero marcar ${c.name} pelo cartão. Como faço?`;
$$('[data-wa]').forEach(a => { a.href = waLink(MSG[a.dataset.wa] || MSG.geral); });

/* =========================================================
   Render
   ========================================================= */
$('#conv-count').textContent = CONVENIOS.length;

const GROUP_ICON = { medicos: 'stetho', exames: 'tube', terapias: 'hand' };
$('#conv-acc').innerHTML = GROUPS.filter(g => g.id !== 'todos').map((g, i) => {
    const list = CONVENIOS.filter(c => c.group === g.id);
    return `<details class="acc" name="convenios"${i === 0 ? ' open' : ''}>
        <summary>
            <span class="acc-ic">${icon(GROUP_ICON[g.id])}</span>
            <span class="acc-title">${esc(g.label)}</span>
            <span class="acc-count">${list.length}</span>
            <svg class="icon acc-chev" aria-hidden="true"><use href="#i-plus"/></svg>
        </summary>
        <div class="acc-body"><ul class="specs">${list.map(c => `
            <li><a class="spec" href="${waLink(convMsg(c))}" ${EXT} aria-label="Marcar ${esc(c.name)} pelo WhatsApp">
                <span class="spec-ic">${icon(c.icon)}</span><span class="spec-name">${esc(c.name)}</span>${icon('wa')}
            </a></li>`).join('')}
        </ul></div>
    </details>`;
}).join('');

$('#b-track').innerHTML = BENEFITS.map(b => `
    <article class="b-card">
        <span class="b-n" aria-hidden="true">${b.n}</span>
        <span class="b-ic">${icon(b.icon)}</span>
        <h3>${esc(b.title)}</h3>
        <p>${esc(b.text)}</p>
        ${b.href
            ? `<a class="b-link" href="${b.href}">${esc(b.cta)} ${icon('arrow')}</a>`
            : `<a class="b-link" href="${waLink(b.msg)}" ${EXT}>Saber mais no WhatsApp ${icon('arrow')}</a>`}
        <span class="b-bar" aria-hidden="true"></span>
    </article>`).join('');

$('#stores').innerHTML = LOJAS.map(l => `<li class="store"><span class="store-name" translate="no">${esc(l.name)}</span><span class="store-kind">${esc(l.kind)}</span></li>`).join('');

/* =========================================================
   HERO: os convênios passam pelo cartão
   ========================================================= */
const heroEl = $('#inicio');
const cardEl = $('#hero-card');
const tiltEl = $('#tilt');
const wordEl = $('#hero-word');
const specEl = $('#card-spec');
const icUse = $('#card-ic');
const askEl = $('#hero-ask');
const liveEl = $('#hero-live');
const picker = $('#picker');

picker.innerHTML = HERO.map((h, i) => {
    const c = byId[h.id];
    return `<li><button class="pick" type="button" data-index="${i}" aria-current="${i === 0}">
        <span class="pick-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
        <span class="pick-ic">${icon(c.icon)}</span>
        <span class="pick-name">${esc(c.name)}</span>
    </button></li>`;
}).join('');
const picks = $$('.pick', picker);

const charsHTML = text => [...text].map(ch => (ch === ' ' ? ' ' : `<span class="ch">${esc(ch)}</span>`)).join('');
wordEl.innerHTML = charsHTML(HERO[0].word);

let heroIndex = 0;
let spinning = false;
let hero3d = null;

function setAsk(i) {
    const c = byId[HERO[i].id];
    askEl.href = waLink(convMsg(c));
    $('span', askEl).textContent = `Marcar ${c.name}`;
}
setAsk(0);

function setCard(i) {
    const c = byId[HERO[i].id];
    specEl.textContent = c.name;
    icUse.setAttribute('href', `#i-${c.icon}`);
}

function setTheme(h, animate) {
    const vars = { '--bg-inner': h.theme[0], '--bg-mid': h.theme[1], '--bg-outer': h.theme[2], '--glow': h.glow };
    if (animate) gsap.to(heroEl, { ...vars, duration: 1.5, ease: 'power2.inOut' });
    else Object.entries(vars).forEach(([k, v]) => heroEl.style.setProperty(k, v));
}

function swapWord(i) {
    const text = HERO[i].word;
    const old = $$('.ch', wordEl);
    gsap.to(old, {
        yPercent: -70, opacity: 0, filter: 'blur(8px)', duration: 0.42, stagger: 0.018, ease: 'power2.in', overwrite: true,
        onComplete() {
            wordEl.innerHTML = charsHTML(text);
            gsap.fromTo($$('.ch', wordEl), { yPercent: 80, opacity: 0, filter: 'blur(10px)' },
                { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.035, ease: 'expo.out', clearProps: 'filter' });
        },
    });
}

function selectHero(i, { user = false, dir: forceDir = 0 } = {}) {
    i = (i + HERO.length) % HERO.length;
    if (i === heroIndex || spinning) return false;
    const from = heroIndex;
    heroIndex = i;
    picks.forEach((b, k) => b.setAttribute('aria-current', String(k === i)));
    setAsk(i);
    if (user) liveEl.textContent = `Convênio em destaque: ${byId[HERO[i].id].name}`;
    const h = HERO[i];

    if (!motionOK) {
        setTheme(h, false);
        setCard(i);
        wordEl.innerHTML = charsHTML(h.word);
        if (hero3d) hero3d.switchTo(h);
        return true;
    }

    setTheme(h, true);
    swapWord(i);
    if (hero3d) hero3d.switchTo(h);
    // giro de vitrine no eixo Y (mesma coreografia da garrafa do Milão): 0→360 com desfoque, troca, 360→720 assentando
    const dir = forceDir || (user && i === (from - 1 + HERO.length) % HERO.length ? -1 : 1);
    spinning = true;
    gsap.to(cardEl, {
        rotationY: 360 * dir, scale: 0.9, '--blur': '12px', duration: 0.6, ease: 'power2.in',
        onComplete() {
            setCard(i);
            gsap.fromTo(cardEl, { rotationY: 360 * dir }, {
                rotationY: 720 * dir, scale: 1, '--blur': '0px', duration: 1.5, ease: 'back.out(0.7)',
                onComplete() { gsap.set(cardEl, { rotationY: 0 }); spinning = false; },
            });
        },
    });
    return true;
}

/* autoplay: troca a cada 6 s com barra de tempo; pausa com mouse/foco/fora da tela
   e para de vez quando a pessoa assume (clique, setas ou arrastar o cartão) */
const DWELL = 6;
let auto = motionOK;
let hold = false;
let heroVisible = true;
let timer = null;

function syncTimer() {
    if (!timer) return;
    if (hold || !heroVisible || document.hidden) timer.pause();
    else timer.play();
}
function startTimer() {
    if (timer) timer.kill();
    timer = null;
    picks.forEach(p => p.style.setProperty('--p', '0'));
    if (!auto || !hasGsap) return;
    timer = gsap.fromTo(picks[heroIndex], { '--p': 0 }, {
        '--p': 1, duration: DWELL, ease: 'none',
        onComplete() { selectHero(heroIndex + 1); startTimer(); },
    });
    syncTimer();
}
function userGo(i, opts = {}) {
    auto = false;
    startTimer();
    return selectHero(i, { user: true, ...opts });
}

picker.addEventListener('click', e => {
    const b = e.target.closest('.pick');
    if (b) userGo(+b.dataset.index);
});
$('#hero-prev').addEventListener('click', () => userGo(heroIndex - 1, { dir: -1 }));
$('#hero-next').addEventListener('click', () => userGo(heroIndex + 1, { dir: 1 }));
const heroRight = $('.hero-right');
heroRight.addEventListener('pointerenter', () => { hold = true; syncTimer(); });
heroRight.addEventListener('pointerleave', () => { hold = false; syncTimer(); });
heroRight.addEventListener('focusin', () => { hold = true; syncTimer(); });
heroRight.addEventListener('focusout', e => { if (!heroRight.contains(e.relatedTarget)) { hold = false; syncTimer(); } });

/* arrastar o cartão para o lado: esquerda = próximo, direita = anterior.
   Enquanto arrasta, o cartão gira junto; se soltar antes do limite, volta com mola. */
(() => {
    const stage = $('.hero-stage');
    const hint = $('.drag-hint');
    let x0 = 0, y0 = 0, dx = 0, dragging = false, decided = false, id = null;
    const LIMIT = 60;
    stage.addEventListener('pointerdown', e => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; decided = false; dx = 0; id = e.pointerId;
        x0 = e.clientX; y0 = e.clientY;
    });
    stage.addEventListener('pointermove', e => {
        if (!dragging || e.pointerId !== id) return;
        dx = e.clientX - x0;
        const dy = e.clientY - y0;
        if (!decided) {
            if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
            decided = true;
            if (Math.abs(dy) > Math.abs(dx)) { dragging = false; return; } // rolagem vertical
            stage.setPointerCapture(id);
            stage.classList.add('dragging');
            auto = false; startTimer(); // pegou o cartão para o lado: a troca automática para
        }
        if (hasGsap && !spinning) gsap.set(cardEl, { rotationY: Math.max(-70, Math.min(70, -dx * 0.35)), x: dx * 0.25 });
    });
    const end = () => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('dragging');
        if (hint) hint.classList.add('used');
        if (decided && Math.abs(dx) > LIMIT) {
            const step = dx < 0 ? 1 : -1;
            // se pegou no meio de um giro, troca assim que ele terminar
            const go = () => (spinning ? gsap.delayedCall(0.1, go) : userGo(heroIndex + step, { dir: step }));
            if (hasGsap) { gsap.to(cardEl, { x: 0, duration: 0.6, ease: 'expo.out' }); go(); }
            else userGo(heroIndex + step, { dir: step });
        } else if (hasGsap && !spinning) {
            gsap.to(cardEl, { rotationY: 0, x: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
        }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', end);
    // teclado: setas esquerda/direita com o foco no seletor
    heroRight.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { e.preventDefault(); userGo(heroIndex + 1, { dir: 1 }); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); userGo(heroIndex - 1, { dir: -1 }); }
    });
})();

/* laço do topo: cartão inclina com o cursor e flutua; cubos 3D */
(() => {
    const floor = $('.card-floor');
    const mouse = { x: 0, y: 0, cx: -9999, cy: -9999 };
    const cm = { x: 0, y: 0 };
    if (canHover) {
        addEventListener('pointermove', e => {
            mouse.x = e.clientX / innerWidth - 0.5;
            mouse.y = e.clientY / innerHeight - 0.5;
            mouse.cx = e.clientX;
            mouse.cy = e.clientY;
        }, { passive: true });
    }
    let running = false;
    let raf = 0;
    function frame() {
        const t = performance.now() / 1000;
        if (!canHover) { mouse.x = Math.sin(t * 0.5) * 0.22; mouse.y = Math.cos(t * 0.4) * 0.12; }
        cm.x += (mouse.x - cm.x) * 0.06;
        cm.y += (mouse.y - cm.y) * 0.06;
        const fy = Math.sin(t * Math.PI * 2 / 6) * 12;
        tiltEl.style.transform = `translate3d(0, ${fy.toFixed(2)}px, 0) rotateY(${(cm.x * 30).toFixed(2)}deg) rotateX(${(-cm.y * 18).toFixed(2)}deg)`;
        cardEl.style.setProperty('--sheen', `${(cm.x * 70).toFixed(1)}%`);
        floor.style.transform = `scaleX(${(1 - fy / 70).toFixed(3)})`;
        if (hero3d) hero3d.render(t, cm, mouse);
        raf = running ? requestAnimationFrame(frame) : 0;
    }
    function setRunning(on) {
        running = on && !document.hidden && !reduceMotion;
        if (running && !raf) raf = requestAnimationFrame(frame);
    }
    new IntersectionObserver(([e]) => {
        heroVisible = e.isIntersecting;
        setRunning(heroVisible);
        syncTimer();
    }).observe(heroEl);
    document.addEventListener('visibilitychange', () => { setRunning(heroVisible); syncTimer(); });

    // cubos 3D (a cruz do logo) só depois da página pronta e com WebGL
    function load3D() {
        const probe = document.createElement('canvas');
        if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) return;
        import('./hero3d.js').then(({ initHero3D }) => {
            hero3d = initHero3D({ hero: heroEl, anchor: tiltEl, back: $('#hero-back'), front: $('#hero-front'), reduceMotion, theme: HERO[heroIndex] });
            let rt;
            addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { hero3d.resize(); if (!running) hero3d.render(0, cm, mouse); }, 150); });
            if (motionOK) hero3d.burst();
            if (!running) hero3d.render(0, cm, mouse);
        }).catch(err => console.warn('Cubos 3D indisponíveis', err));
    }
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 250));
    if (document.readyState === 'complete') idle(load3D, { timeout: 1500 });
    else addEventListener('load', () => idle(load3D, { timeout: 1500 }), { once: true });
})();

/* =========================================================
   Cabeçalho, navegação, botão flutuante
   ========================================================= */
(() => {
    const header = $('#header');
    const progress = $('#progress');
    const fab = $('.fab');
    let lastY = scrollY;
    let ticking = false;
    function update() {
        const y = scrollY;
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
        if (y > 500 && y > lastY + 6) header.classList.add('away');
        else if (y < lastY - 6 || y < 500) header.classList.remove('away');
        fab.classList.toggle('show', y > innerHeight * 0.7);
        lastY = y;
        ticking = false;
    }
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    header.addEventListener('focusin', () => header.classList.remove('away'));
    update();

    // vidro escuro sobre fundos escuros, claro sobre o papel
    const dark = new Set();
    const darkIO = new IntersectionObserver(entries => {
        entries.forEach(en => (en.isIntersecting ? dark.add(en.target) : dark.delete(en.target)));
        header.classList.toggle('light', dark.size === 0);
    }, { rootMargin: '-30px 0px -92% 0px' });
    ['#inicio', '#beneficios', '#contato', '.footer'].forEach(s => darkIO.observe($(s)));

    const links = $$('.nav-item');
    const navIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
            if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${en.target.id}`));
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'convenios', 'beneficios', 'cartao', 'como-funciona', 'lojas', 'duvidas', 'contato'].forEach(id => navIO.observe(document.getElementById(id)));
})();

/* ---------- acordeões (convênios e dúvidas): altura animada; nos convênios só um aberto ---------- */
function closeDetails(d, a) {
    gsap.to(a, { height: 0, duration: 0.45, ease: 'power3.inOut', onComplete() { d.open = false; gsap.set(a, { clearProps: 'height' }); } });
}
$$('.faq details, .acc').forEach(d => {
    const s = $('summary', d);
    const a = $('.faq-a, .acc-body', d);
    s.addEventListener('click', e => {
        if (!motionOK) return;
        e.preventDefault();
        if (d.open) { closeDetails(d, a); return; }
        if (d.matches('.acc')) $$('.acc[open]').forEach(o => { if (o !== d) closeDetails(o, $('.acc-body', o)); });
        d.open = true;
        gsap.fromTo(a, { height: 0 }, { height: 'auto', duration: 0.6, ease: 'expo.out', clearProps: 'height' });
        if (d.matches('.acc')) gsap.from($$('.spec', d), { y: 16, opacity: 0, duration: 0.6, stagger: 0.035, ease: 'expo.out', clearProps: 'transform,opacity' });
    });
});

/* ---------- botões magnéticos ---------- */
if (motionOK && canHover) {
    $$('.magnetic').forEach(el => {
        el.addEventListener('pointermove', e => {
            const r = el.getBoundingClientRect();
            gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.4, ease: 'power3.out' });
        });
        el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' }));
    });
}

/* =========================================================
   Movimento: entrada orquestrada e revelações na rolagem
   ========================================================= */
const ST = motionOK && window.ScrollTrigger ? window.ScrollTrigger : null;
const Split = motionOK && window.SplitText ? window.SplitText : null;
if (ST) gsap.registerPlugin(ST);
if (Split) gsap.registerPlugin(Split);

function showStatic() {
    $$('.intro').forEach(el => { el.style.opacity = '1'; });
    root.classList.add('intro-done');
    const loader = $('#loader');
    if (loader) loader.remove();
}

function playIntro() {
    if (!motionOK) { showStatic(); startTimer(); return; }
    const loader = $('#loader');
    const tl = gsap.timeline({
        defaults: { ease: 'expo.out' },
        onComplete() { root.classList.add('intro-done'); startTimer(); },
    });

    // 1. o coração do logo se desenha e a cruz monta, depois a cortina sobe
    if (loader) {
        const heart = $('.lm-heart', loader);
        const len = heart.getTotalLength();
        tl.fromTo(heart, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.inOut' }, 0)
          .fromTo('.lm-sq', { scale: 0, rotation: -90, transformOrigin: '50% 50%' }, { scale: 1, rotation: 0, duration: 0.55, stagger: 0.07, ease: 'back.out(2.6)' }, 0.42)
          .to('.loader-mark', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'power2.in' }, 1.15)
          .to(loader, { clipPath: 'inset(0 0 100% 0)', duration: 0.95, ease: 'expo.inOut' }, 1.2)
          .add(() => loader.remove());
    }
    const T = loader ? 1.45 : 0.1;

    // 2. topo
    const title = $('#hero-title');
    tl.set(title, { opacity: 1 }, T);
    if (Split) {
        const split = new Split(title, { type: 'lines,words', mask: 'lines' });
        tl.from(split.words, { yPercent: 115, rotation: 4, duration: 1.3, stagger: 0.07 }, T);
    } else {
        tl.from(title, { y: 60, opacity: 0, duration: 1.2 }, T);
    }
    tl.fromTo('.eyebrow', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, T - 0.05)
      .set(cardEl, { opacity: 1 }, T)
      .fromTo(cardEl, { rotationY: -200, y: 160, scale: 0.72, '--blur': '16px' }, { rotationY: 0, y: 0, scale: 1, '--blur': '0px', duration: 2.1, clearProps: 'transform' }, T)
      .add(() => { if (hero3d) hero3d.burst(); }, T + 0.15)
      .fromTo('.hw-top', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, T + 0.25)
      .set('.hw-main', { opacity: 1 }, T + 0.3)
      .from($$('.ch', wordEl), { yPercent: 90, opacity: 0, filter: 'blur(10px)', duration: 1.2, stagger: 0.04, clearProps: 'filter' }, T + 0.3)
      .fromTo(['.hero-lede', '.hero-actions'], { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.1, clearProps: 'transform' }, T + 0.45)
      .fromTo('.picker-label', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 1 }, T + 0.5)
      .set('#picker', { opacity: 1 }, T + 0.55)
      .from(picks, { x: 50, opacity: 0, duration: 1, stagger: 0.07, clearProps: 'transform,opacity' }, T + 0.55)
      .fromTo('.picker-nav', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, clearProps: 'transform' }, T + 0.9)
      .fromTo('.drag-hint', { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, T + 1.1)
      .fromTo('.scroll-cue', { opacity: 0 }, { opacity: 1, duration: 1 }, T + 1.2);
}

(() => {
    const fontsReady = document.fonts ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1200))]) : Promise.resolve();
    fontsReady.then(playIntro);
})();

/* ---------- faixa da marca: corre sozinha e acelera com a rolagem ---------- */
(() => {
    const track = $('#ticker-track');
    const group = $('.ticker-group', track);
    track.appendChild(group.cloneNode(true));
    if (reduceMotion) return;
    if (!hasGsap) { track.classList.add('css-run'); return; }
    const loop = gsap.to(track, { xPercent: -50, duration: 36, ease: 'none', repeat: -1 });
    if (!ST) return;
    ST.create({
        trigger: '.ticker', start: 'top bottom', end: 'bottom top',
        onToggle: self => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: self => {
            const dir = self.direction;
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
            gsap.to(loop, { timeScale: dir * boost, duration: 0.2, overwrite: true, onComplete: () => gsap.to(loop, { timeScale: dir, duration: 1.2, ease: 'power2.out' }) });
        },
    });
})();

/* ---------- revelações ---------- */
if (ST) {
    // o topo sai devagar: cartão sobe, palavra gigante desce
    gsap.to('.hero-word', { yPercent: 45, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-left', { y: -90, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-stage', { y: -140, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });

    // títulos: linhas sobem de dentro de uma máscara
    $$('.h2.split').forEach(h => {
        const head = h.parentElement;
        const kicker = $('.kicker', head);
        const lede = $('.lede', head);
        const parts = Split ? new Split(h, { type: 'lines', mask: 'lines', linesClass: 'line' }).lines : [h];
        gsap.set(parts, { yPercent: 110 });
        if (kicker) gsap.set(kicker, { x: -24, opacity: 0 });
        if (lede) gsap.set(lede, { y: 30, opacity: 0 });
        ST.create({
            trigger: h, start: 'top 86%', once: true,
            onEnter() {
                if (kicker) gsap.to(kicker, { x: 0, opacity: 1, duration: 1, ease: 'expo.out' });
                gsap.to(parts, { yPercent: 0, duration: 1.25, stagger: 0.1, ease: 'expo.out' });
                if (lede) gsap.to(lede, { y: 0, opacity: 1, duration: 1.1, delay: 0.2, ease: 'expo.out' });
            },
        });
    });

    // convênios
    gsap.set('.acc', { y: 40, opacity: 0 });
    ST.batch('.acc', { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out', clearProps: 'transform' }) });

    // benefícios: no desktop a seção fixa e os cartões correm na horizontal
    const mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', () => {
        const track = $('#b-track');
        const dist = () => Math.max(0, track.scrollWidth - track.clientWidth);
        const hTween = gsap.to(track, {
            x: () => -dist(), ease: 'none',
            scrollTrigger: {
                trigger: '#beneficios', start: 'top top', end: () => `+=${dist() + innerHeight * 0.4}`,
                pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: self => gsap.set('#b-meter', { scaleX: self.progress }),
            },
        });
        $$('.b-card').forEach(card => {
            const st = { trigger: card, containerAnimation: hTween };
            gsap.fromTo($('.b-bar', card), { scaleX: 0.18 }, { scaleX: 1, ease: 'none', scrollTrigger: { ...st, start: 'left 95%', end: 'center 50%', scrub: true } });
            gsap.fromTo($('.b-n', card), { xPercent: 40 }, { xPercent: -30, ease: 'none', scrollTrigger: { ...st, start: 'left right', end: 'right left', scrub: true } });
            gsap.fromTo($('.b-ic', card), { rotation: -30, scale: 0.6 }, { rotation: 0, scale: 1, duration: 0.9, ease: 'back.out(2.2)', scrollTrigger: { ...st, start: 'left 85%', toggleActions: 'play none none reverse' } });
        });
        gsap.from('.b-card', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '#beneficios', start: 'top 70%', once: true } });
        // teclado: ao focar um link de cartão fora da tela, rola até ele ficar visível
        const onFocus = e => {
            const card = e.target.closest('.b-card');
            const st = hTween.scrollTrigger;
            if (!card || !st || dist() <= 0) return;
            const p = Math.min(1, Math.max(0, (card.offsetLeft - track.clientWidth * 0.3) / dist()));
            window.scrollTo(0, st.start + (st.end - st.start) * p * (dist() / (dist() + innerHeight * 0.4)));
        };
        track.addEventListener('focusin', onFocus);
        return () => track.removeEventListener('focusin', onFocus);
    });
    mm.add('(max-width: 980px)', () => {
        gsap.set('.b-card', { y: 60, opacity: 0 });
        ST.batch('.b-card', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'expo.out' }) });
        $$('.b-bar').forEach(bar => gsap.fromTo(bar, { scaleX: 0.18 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: bar.parentElement, start: 'top 85%', end: 'bottom 60%', scrub: true } }));
    });

    // o cartão do plano gira com a rolagem até ficar de frente
    gsap.fromTo('#plan-card', { rotationY: -200, rotationX: 22, y: 80 }, {
        rotationY: 0, rotationX: 0, y: 0, ease: 'none',
        scrollTrigger: { trigger: '#cartao', start: 'top 90%', end: 'center 60%', scrub: 1 },
    });
    gsap.fromTo('.plan-orbit', { rotation: -60, scale: 0.85 }, { rotation: 120, scale: 1, ease: 'none', scrollTrigger: { trigger: '#cartao', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.set('.plan-list li', { x: -24, opacity: 0 });
    ST.batch('.plan-list li', { start: 'top 92%', once: true, onEnter: b => gsap.to(b, { x: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out' }) });
    gsap.from('.plan-actions, #cartao .fine', { y: 30, opacity: 0, duration: 1, stagger: 0.1, ease: 'expo.out', scrollTrigger: { trigger: '.plan-actions', start: 'top 92%', once: true } });

    // como funciona: a linha se desenha e os números saltam
    const path = $('#steps-path');
    const len = path.getTotalLength();
    gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.steps', start: 'top 80%', end: 'bottom 60%', scrub: true } });
    gsap.set('.step-n', { scale: 0, rotation: -40 });
    gsap.set('.step h3, .step p', { y: 26, opacity: 0 });
    ST.batch('.step', {
        start: 'top 85%', once: true,
        onEnter: b => {
            gsap.to(b.map(s => $('.step-n', s)), { scale: 1, rotation: 0, duration: 1, stagger: 0.18, ease: 'back.out(1.8)' });
            gsap.to(b.flatMap(s => $$('h3, p', s)), { y: 0, opacity: 1, duration: 1, stagger: 0.08, delay: 0.15, ease: 'expo.out' });
        },
    });

    // lojas: o nome sobe de dentro da linha
    gsap.set('.store-name', { yPercent: 105 });
    gsap.set('.store-kind', { opacity: 0, x: 20 });
    ST.batch('.store', {
        start: 'top 92%', once: true,
        onEnter: b => {
            gsap.to(b.map(s => $('.store-name', s)), { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'expo.out', clearProps: 'transform' });
            gsap.to(b.map(s => $('.store-kind', s)), { opacity: 1, x: 0, duration: 0.9, stagger: 0.09, delay: 0.2, ease: 'expo.out', clearProps: 'transform' });
        },
    });
    gsap.from('.partner', { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.partner', start: 'top 92%', once: true } });

    // dúvidas
    gsap.set('.faq details', { y: 30, opacity: 0 });
    ST.batch('.faq details', { start: 'top 94%', once: true, onEnter: b => gsap.to(b, { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'transform' }) });

    // contato: o mapa se desenrola
    gsap.set('.map-wrap', { clipPath: 'inset(0 0 100% 0 round 24px)' });
    gsap.set('.contact address, .contact-actions', { y: 30, opacity: 0 });
    ST.create({
        trigger: '.contact-grid', start: 'top 78%', once: true,
        onEnter() {
            gsap.to('.contact address, .contact-actions', { y: 0, opacity: 1, duration: 1, stagger: 0.1, delay: 0.2, ease: 'expo.out' });
            gsap.to('.map-wrap', { clipPath: 'inset(0 0 0% 0 round 24px)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' });
        },
    });

    // SplitText e fontes mudam alturas: recalcula depois que tudo carregar
    addEventListener('load', () => ST.refresh(), { once: true });
}

/* =========================================================
   Cubos 3D do topo (Three.js): a cruz do logo desmontada
   em cubos vermelhos, laranjas, amarelos e teal, flutuando
   em volta do cartão. Carregado só depois da página pronta.
   ========================================================= */
import * as THREE from '../vendor/three/three.module.min.js';
import { RoundedBoxGeometry } from '../vendor/three/RoundedBoxGeometry.js';
import { RoomEnvironment } from '../vendor/three/RoomEnvironment.js';

const RED = 0, ORANGE = 1, YELLOW = 2, TEAL = 3, WHITE = 4;
const COLORS = ['#d8312b', '#ec7a2a', '#f3c331', '#1f9a93', '#f4f1ea'];

// posições em "larguras de cartão" a partir do centro do cartão; z negativo = atrás
const BACK = [
    { p: [-0.72, 0.5, -2.5], s: 0.12, kind: 'plus' },
    { p: [0.78, 0.56, -3], s: 0.15, c: YELLOW },
    { p: [-0.78, -0.4, -2], s: 0.12, c: TEAL },
    { p: [0.86, -0.42, -2.6], s: 0.1, kind: 'plus' },
    { p: [0.1, 0.78, -3.6], s: 0.1, c: RED },
    { p: [-0.3, -0.76, -3], s: 0.12, c: ORANGE },
    { p: [0.98, -0.06, -4], s: 0.12, c: WHITE, wide: true },
    { p: [-0.95, 0.12, -4], s: 0.13, c: RED, wide: true },
    { p: [0.5, -0.8, -3.4], s: 0.09, c: YELLOW },
];
const FRONT = [
    { p: [-0.66, -0.52, 2.2], s: 0.07, c: YELLOW },
    { p: [0.7, 0.36, 2.6], s: 0.06, kind: 'plus' },
    { p: [-0.5, 0.62, 1.8], s: 0.055, c: ORANGE },
];

export function initHero3D({ hero, anchor, back, front, reduceMotion, theme }) {
    const small = innerWidth < 760;
    const make = canvas => {
        const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
        r.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 1.6));
        r.toneMapping = THREE.ACESFilmicToneMapping;
        r.toneMappingExposure = 1.05;
        return r;
    };
    const rimColor = new THREE.Color(theme.glow);
    const makeScene = r => {
        const s = new THREE.Scene();
        const pm = new THREE.PMREMGenerator(r);
        s.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
        s.environmentIntensity = 0.7;
        pm.dispose();
        const key = new THREE.DirectionalLight('#ffffff', 2.2); key.position.set(3, 5, 5);
        const rim = new THREE.DirectionalLight(rimColor, 2.4); rim.position.set(-4, 1, -2);
        s.add(key, rim, new THREE.AmbientLight('#ffffff', 0.25));
        s.userData.rim = rim;
        return s;
    };
    const rb = make(back), rf = make(front);
    const sb = makeScene(rb), sf = makeScene(rf);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 16);

    const geo = new RoundedBoxGeometry(1, 1, 1, 4, 0.14);
    const mats = COLORS.map(c => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15 }));
    // a cruz do logo: cima vermelho, esquerda laranja, centro laranja, direita vermelho, baixo amarelo
    function plus() {
        const g = new THREE.Group();
        [[0, 1, RED], [-1, 0, ORANGE], [0, 0, ORANGE], [1, 0, RED], [0, -1, YELLOW]].forEach(([x, y, m]) => {
            const mesh = new THREE.Mesh(geo, mats[m]);
            mesh.position.set(x * 1.03, y * 1.03, 0);
            g.add(mesh);
        });
        g.userData.scale = 1 / 3;
        return g;
    }

    const items = [];
    const add = (list, scene) => list.forEach((d, i) => {
        if (small && (d.wide || i % 3 === 2)) return;
        const obj = d.kind === 'plus' ? plus() : new THREE.Mesh(geo, mats[d.c]);
        scene.add(obj);
        items.push({
            obj, d,
            k: (obj.userData.scale || 1) * d.s,
            phase: Math.random() * Math.PI * 2,
            spin: new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.8, (Math.random() - 0.5) * 0.4),
            rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
            push: new THREE.Vector2(),
        });
    });
    add(BACK, sb);
    add(FRONT, sf);

    const st = { spread: 1, size: 1, twist: 0 };
    const view = { cx: 0, cy: 0, unit: 3, w: 1, h: 1 };
    const tmp = new THREE.Vector3();
    const dir = new THREE.Vector3();

    function resize() {
        const w = hero.clientWidth, h = hero.clientHeight;
        rb.setSize(w, h, false); rf.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        const hr = hero.getBoundingClientRect();
        const ar = anchor.getBoundingClientRect();
        const worldH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
        const worldW = worldH * camera.aspect;
        view.cx = ((ar.left + ar.width / 2 - hr.left) / hr.width - 0.5) * worldW;
        view.cy = -((ar.top + ar.height / 2 - hr.top) / hr.height - 0.5) * worldH;
        view.unit = (ar.width / hr.width) * worldW;
        view.w = worldW; view.h = worldH;
    }
    resize();

    // ponto do cursor no plano z = 0
    function mouseWorld(mouse) {
        if (mouse.cx < -9000) return null;
        const r = hero.getBoundingClientRect();
        tmp.set(((mouse.cx - r.left) / r.width) * 2 - 1, -((mouse.cy - r.top) / r.height) * 2 + 1, 0.5).unproject(camera);
        dir.copy(tmp).sub(camera.position).normalize();
        const dist = -camera.position.z / dir.z;
        return { x: camera.position.x + dir.x * dist, y: camera.position.y + dir.y * dist };
    }

    let last = 0;
    function render(t, cm, mouse) {
        const dt = Math.min(0.05, last ? t - last : 0.016);
        last = t;
        const m = reduceMotion ? null : mouseWorld(mouse);
        const R = view.unit * 0.55;
        for (const it of items) {
            const [hx, hy, hz] = it.d.p;
            const float = reduceMotion ? 0 : 1;
            const depth = hz < 0 ? 0.6 : 1.4; // os da frente andam mais com o cursor
            let x = view.cx + hx * view.unit * st.spread + Math.sin(t * 0.7 + it.phase) * 0.12 * float + cm.x * depth * 0.9;
            let y = view.cy + hy * view.unit * st.spread + Math.cos(t * 0.9 + it.phase) * 0.18 * float - cm.y * depth * 0.6;
            // fogem do cursor
            let px = 0, py = 0;
            if (m) {
                const dx = x - m.x, dy = y - m.y;
                const d = Math.hypot(dx, dy) || 1;
                if (d < R) { const f = (R - d) / R; px = (dx / d) * f * R * 0.7; py = (dy / d) * f * R * 0.7; }
            }
            it.push.x += (px - it.push.x) * 0.08;
            it.push.y += (py - it.push.y) * 0.08;
            it.obj.position.set(x + it.push.x, y + it.push.y, hz);
            if (!reduceMotion) {
                it.rot.x += it.spin.x * dt;
                it.rot.y += it.spin.y * dt;
                it.rot.z += it.spin.z * dt;
            }
            it.obj.rotation.set(it.rot.x + st.twist, it.rot.y + st.twist * 1.3, it.rot.z);
            it.obj.scale.setScalar(Math.max(0.0001, it.k * view.unit * st.size));
        }
        rb.render(sb, camera);
        rf.render(sf, camera);
    }

    let tl = null;
    // troca de convênio: tudo implode no cartão e explode de volta, girando; a luz de contorno troca de cor
    function switchTo(h) {
        const target = new THREE.Color(h.glow);
        if (reduceMotion || !window.gsap) { [sb, sf].forEach(s => s.userData.rim.color.copy(target)); return; }
        if (tl) tl.kill();
        tl = gsap.timeline()
            .to(st, { spread: 0.08, size: 0.4, twist: st.twist + Math.PI, duration: 0.55, ease: 'power3.in' })
            .to(st, { spread: 1, size: 1, twist: st.twist + Math.PI * 2, duration: 1.4, ease: 'back.out(1.5)' });
        [sb, sf].forEach(s => gsap.to(s.userData.rim.color, { r: target.r, g: target.g, b: target.b, duration: 1.4, ease: 'power2.inOut' }));
    }

    // entrada: os cubos saem de dentro do cartão
    function burst() {
        if (reduceMotion || !window.gsap) return;
        if (tl) tl.kill();
        tl = gsap.timeline().fromTo(st, { spread: 0, size: 0, twist: -Math.PI }, { spread: 1, size: 1, twist: 0, duration: 2, ease: 'expo.out' });
    }

    return { render, resize, switchTo, burst };
}

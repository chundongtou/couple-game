import fs from 'node:fs';
/* ---- textures.js：白骰 + 蓝点/红点图集 ---- */
let t = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(t, 'utf8');
const startA = s.indexOf('/* ------------------------------- 骰子图集（3×2） ------------------------------- */');
const endA = s.indexOf('/* ------------------------------- 舷窗景观 ------------------------------- */');
if (startA < 0 || endA < 0) { console.error('atlas markers', startA, endA); process.exit(1); }
const atlas = `/* ------------------------------- 骰子图集（3×2） -------------------------------
 * V9.7 参考实拍：白/象牙白底，2/3/5/6 蓝点、1/4 红点，圆点带高光；面边微阴影。 */
export function buildDieAtlas(size = 128) {
  const SZ = size;
  const { c, g } = canvas2d(SZ * 3, SZ * 2);
  const PIPS = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.24], [0.72, 0.24], [0.28, 0.5], [0.72, 0.5], [0.28, 0.76], [0.72, 0.76]]
  };
  const BLUE = ['#4A7BE8', '#1F4FBF'];
  const RED = ['#D95043', '#A62F26'];
  const rnd = rng(5150);
  for (let v = 1; v <= 6; v++) {
    const col = (v - 1) % 3, row = Math.floor((v - 1) / 3);
    const x = col * SZ, y = row * SZ;
    g.save();
    g.translate(x, y);
    /* 白骰底：暖白渐变 + 细噪点 */
    const gr = g.createLinearGradient(0, 0, SZ, SZ);
    gr.addColorStop(0, '#FFFDF9');
    gr.addColorStop(0.55, '#F7F3EC');
    gr.addColorStop(1, '#EDE7DD');
    g.fillStyle = gr;
    g.fillRect(0, 0, SZ, SZ);
    for (let i = 0; i < 90; i++) {
      const px = rnd() * SZ, py = rnd() * SZ;
      g.globalAlpha = 0.03 + rnd() * 0.05;
      g.fillStyle = rnd() > 0.5 ? '#FFFFFF' : '#C9C2B6';
      g.fillRect(px, py, 1 + rnd() * 1.6, 1 + rnd() * 1.6);
    }
    g.globalAlpha = 1;
    /* 面边微阴影（圆角倒角内缘） */
    g.strokeStyle = 'rgba(120,115,105,.18)';
    g.lineWidth = SZ * 0.030;
    g.strokeRect(SZ * 0.02, SZ * 0.02, SZ * 0.96, SZ * 0.96);
    g.strokeStyle = 'rgba(255,255,255,.55)';
    g.lineWidth = SZ * 0.012;
    g.strokeRect(SZ * 0.055, SZ * 0.055, SZ * 0.89, SZ * 0.89);
    /* 圆点：1/4 红，2/3/5/6 蓝；高光 + 细描边 */
    const isRed = (v === 1 || v === 4);
    const cols = isRed ? RED : BLUE;
    for (const [px, py] of PIPS[v]) {
      const cx = px * SZ, cy = py * SZ, pr = SZ * 0.082;
      const dg = g.createRadialGradient(cx - pr * 0.35, cy - pr * 0.35, pr * 0.1, cx, cy, pr);
      dg.addColorStop(0, cols[0]);
      dg.addColorStop(1, cols[1]);
      g.fillStyle = dg;
      g.beginPath(); g.arc(cx, cy, pr, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.10)';
      g.lineWidth = SZ * 0.010;
      g.beginPath(); g.arc(cx, cy, pr, 0, TAU); g.stroke();
      g.fillStyle = 'rgba(255,255,255,.38)';
      g.beginPath(); g.arc(cx - pr * 0.30, cy - pr * 0.30, pr * 0.26, 0, TAU); g.fill();
    }
    g.restore();
  }
  return { tex: texFromCanvas(c, { aniso: 8 }), cols: 3, rows: 2 };
}

`;
s = s.slice(0, startA) + atlas + s.slice(endA);
fs.writeFileSync(t, s, 'utf8');

/* ---- parts.js：圆角骰子几何 ---- */
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
const startB = b.indexOf('/* ============================ 骰子（单材质图集） ============================ */');
const endB = b.indexOf('/* ============================ 纸飞机');
if (startB < 0 || endB < 0) { console.error('die markers', startB, endB); process.exit(1); }
const dieFn = `/* ============================ 骰子（白骰 · 圆角 · 单材质图集） ============================
 * V9.7：BoxGeometry 细分后按「盒内缩 + 法向圆弧」倒角成圆角骰；
 * 保留 DIE_FACES 面序，按 6 个 group 逐面重映射图集 UV（支持细分网格）。 */
export function makeDieGeometry(size) {
  const SEG = 6;
  const geo = new THREE.BoxGeometry(size, size, size, SEG, SEG, SEG);
  const h = size / 2, rr = size * 0.13, inner = h - rr;
  const pos = geo.getAttribute('position');
  const nrm = geo.getAttribute('normal');
  const p = new THREE.Vector3(), q = new THREE.Vector3(), d = new THREE.Vector3();
  const cl = (x, a, b2) => (x < a ? a : x > b2 ? b2 : x);
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    q.set(cl(p.x, -inner, inner), cl(p.y, -inner, inner), cl(p.z, -inner, inner));
    d.copy(p).sub(q);
    if (d.lengthSq() > 1e-12) {
      d.normalize();
      p.copy(q).addScaledVector(d, rr);
      pos.setXYZ(i, p.x, p.y, p.z);
      nrm.setXYZ(i, d.x, d.y, d.z);
    }
  }
  pos.needsUpdate = true;
  nrm.needsUpdate = true;
  const uv = geo.getAttribute('uv');
  const idx = geo.index;
  for (let f = 0; f < 6; f++) {
    const value = DIE_FACES[f];
    const col = (value - 1) % 3;
    const row = Math.floor((value - 1) / 3);
    const gp = geo.groups[f];
    for (let k = gp.start; k < gp.start + gp.count; k++) {
      const vi = idx.getX(k);
      uv.setXY(vi, (col + uv.getX(vi)) / 3, (1 - row + uv.getY(vi)) / 2);
    }
  }
  uv.needsUpdate = true;
  geo.computeBoundingSphere();
  return geo;
}

`;
b = b.slice(0, startB) + dieFn + b.slice(endB);
fs.writeFileSync(p, b, 'utf8');
console.log('die patched');

/* ==========================================================================
 * V8 · 真 3D 主桌 · Canvas 纹理（无外部图片/字体/网络）
 * 全部用 CanvasTexture 程序化生成：格面图集、盘面、光斑、阴影、云、星、纸纹、骰面。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import {
  ATLAS_N, ATLAS_PX, SLOT_DARK, SLOT_BLANK, SLOT_HOME, SLOT_HANGAR,
  COLORS, HEX, HEX_SOFT, GLYPH, KINDS, HOME_ENTRY, ringPhi, slotOf, TAU, clamp
} from './constants.js';

export function canvas2d(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, g: c.getContext('2d') };
}

export function texFromCanvas(c, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = opts.aniso || 4;
  t.needsUpdate = true;
  if (opts.repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(opts.repeat[0], opts.repeat[1]);
  }
  return t;
}

export function roundRect(g, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.arcTo(x + w, y, x + w, y + h, rr);
  g.arcTo(x + w, y + h, x, y + h, rr);
  g.arcTo(x, y + h, x, y, rr);
  g.arcTo(x, y, x + w, y, rr);
  g.closePath();
}

export function hexToRgb(hex) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}
export function rgbCss(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return a === undefined ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}

function star(g, cx, cy, r1, r2) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath();
  g.fill();
}

/* --- 格面图集：8x8 @64px。slot0 暗色侧面；1..44 = 11 种 kind × 4 色；45..48 航线；49..52 机坪 --- */
export function buildAtlas() {
  const PX = ATLAS_PX;
  const SIZE = PX * ATLAS_N;
  const { c, g } = canvas2d(SIZE, SIZE);
  g.clearRect(0, 0, SIZE, SIZE);

  const at = (slot) => [(slot % ATLAS_N) * PX, Math.floor(slot / ATLAS_N) * PX];

  /* 暗色槽（格子侧面 UV 落点；真色由顶点色乘出来） */
  {
    const [x, y] = at(SLOT_DARK);
    g.fillStyle = '#2A2434';
    g.fillRect(x, y, PX, PX);
  }
  /* 白色空格槽 */
  {
    const [x, y] = at(SLOT_BLANK);
    g.fillStyle = '#FFFFFF';
    g.fillRect(x, y, PX, PX);
  }

  /* 环格 */
  KINDS.forEach((kind) => {
    COLORS.forEach((color) => {
      const [x, y] = at(slotOf(kind, color));
      const strong = HEX[color];
      const soft = HEX_SOFT[color];
      g.save();
      g.translate(x, y);
      const grad = g.createLinearGradient(0, 0, PX, PX);
      grad.addColorStop(0, soft);
      grad.addColorStop(0.55, '#FFFDF7');
      grad.addColorStop(1, soft);
      g.fillStyle = grad;
      roundRect(g, 2, 2, PX - 4, PX - 4, 11);
      g.fill();
      g.lineWidth = 2;
      g.strokeStyle = rgbCss(strong, 0.7);
      roundRect(g, 3.4, 3.4, PX - 6.8, PX - 6.8, 10);
      g.stroke();
      const gloss = g.createLinearGradient(0, 4, 0, PX * 0.5);
      gloss.addColorStop(0, 'rgba(255,255,255,.65)');
      gloss.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gloss;
      roundRect(g, 5, 4, PX - 10, PX * 0.46, 8);
      g.fill();
      g.fillStyle = '#2A1B16';
      g.font = `bold ${kind === 'ring' ? 30 : 29}px "PingFang SC","Microsoft YaHei",sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(GLYPH[kind] || '·', PX / 2, PX * 0.53);
      if (kind === 'fly') {
        g.fillStyle = rgbCss(strong, 0.95);
        g.beginPath(); g.moveTo(PX - 13, 11); g.lineTo(PX - 6, 17); g.lineTo(PX - 13, 23); g.closePath(); g.fill();
      } else if (kind === 'fate') {
        g.fillStyle = rgbCss(0xFFB74D, 0.95);
        star(g, PX - 11, 13, 5.4, 2.4);
      } else if (kind === 'forbid') {
        g.strokeStyle = 'rgba(60,32,28,.62)'; g.lineWidth = 2.6;
        g.beginPath(); g.arc(PX / 2, PX * 0.53, 19, -0.35, Math.PI + 0.35); g.stroke();
      }
      g.restore();
    });
  });

  /* 航线格（4 色，箭头指向板心） */
  COLORS.forEach((color, i) => {
    const [x, y] = at(SLOT_HOME + i);
    g.save();
    g.translate(x, y);
    const grad = g.createLinearGradient(0, 0, 0, PX);
    grad.addColorStop(0, '#FFFDF7');
    grad.addColorStop(1, HEX_SOFT[color]);
    g.fillStyle = grad;
    roundRect(g, 2, 2, PX - 4, PX - 4, 10);
    g.fill();
    g.lineWidth = 2; g.strokeStyle = rgbCss(HEX[color], 0.66);
    roundRect(g, 3.4, 3.4, PX - 6.8, PX - 6.8, 9);
    g.stroke();
    g.fillStyle = rgbCss(HEX[color], 0.92);
    g.beginPath();
    g.moveTo(PX / 2, 12); g.lineTo(PX / 2 + 13, 27); g.lineTo(PX / 2 + 5, 27);
    g.lineTo(PX / 2 + 5, 40); g.lineTo(PX / 2 - 5, 40); g.lineTo(PX / 2 - 5, 27);
    g.lineTo(PX / 2 - 13, 27); g.closePath(); g.fill();
    g.restore();
  });

  /* 机坪（4 色） */
  COLORS.forEach((color, i) => {
    const [x, y] = at(SLOT_HANGAR + i);
    g.save();
    g.translate(x, y);
    g.fillStyle = 'rgba(255,253,247,.92)';
    roundRect(g, 2, 2, PX - 4, PX - 4, 10); g.fill();
    g.strokeStyle = rgbCss(HEX[color], 0.75); g.lineWidth = 2.4;
    g.beginPath(); g.arc(PX / 2, PX / 2, 20, 0, TAU); g.stroke();
    g.fillStyle = rgbCss(HEX[color], 0.9);
    g.beginPath();
    g.moveTo(PX / 2, 17); g.lineTo(PX / 2 + 13, 45); g.lineTo(PX / 2, 39);
    g.lineTo(PX / 2 - 13, 45); g.closePath(); g.fill();
    g.restore();
  });

  return { canvas: c, tex: texFromCanvas(c, { aniso: 8 }) };
}

/* --- 棋盘底盘贴图 --- */
export function buildBoardFace() {
  const SZ = 768;
  const { c, g } = canvas2d(SZ, SZ);
  const r = SZ / 2;
  const grad = g.createRadialGradient(r, r * 0.86, r * 0.1, r, r, r);
  grad.addColorStop(0, '#2B3B52');
  grad.addColorStop(0.62, '#1B2839');
  grad.addColorStop(1, '#101A26');
  g.fillStyle = grad;
  g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(243,192,119,.30)'; g.lineWidth = 3;
  g.beginPath(); g.arc(r, r, r * 0.965, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(243,192,119,.14)'; g.lineWidth = 2;
  g.beginPath(); g.arc(r, r, r * 0.80, 0, TAU); g.stroke();
  for (const col of COLORS) {
    const a = ringPhi(HOME_ENTRY[col]) + Math.PI;
    g.strokeStyle = rgbCss(HEX[col], 0.2);
    g.lineWidth = 26;
    g.beginPath();
    g.moveTo(r + Math.cos(a) * r * 0.16, r + Math.sin(a) * r * 0.16);
    g.lineTo(r + Math.cos(a) * r * 0.72, r + Math.sin(a) * r * 0.72);
    g.stroke();
  }
  const cg = g.createRadialGradient(r, r, r * 0.02, r, r, r * 0.16);
  cg.addColorStop(0, 'rgba(255,240,214,.95)');
  cg.addColorStop(0.5, 'rgba(243,192,119,.55)');
  cg.addColorStop(1, 'rgba(243,192,119,0)');
  g.fillStyle = cg;
  g.beginPath(); g.arc(r, r, r * 0.16, 0, TAU); g.fill();
  g.fillStyle = '#F7E3BF';
  g.font = `bold ${SZ * 0.045}px "PingFang SC","Microsoft YaHei",sans-serif`;
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('终 点', r, r + 2);
  return texFromCanvas(c, { aniso: 8 });
}

/* --- 柔和光斑 / 阴影 / 云 / 星 / 涟漪 --- */
export function radialTexture(size, stops) {
  const { c, g } = canvas2d(size, size);
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([p, col]) => grad.addColorStop(p, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return texFromCanvas(c);
}

export function makeShadowTex() {
  return radialTexture(128, [[0, 'rgba(0,0,0,.55)'], [0.45, 'rgba(0,0,0,.32)'], [1, 'rgba(0,0,0,0)']]);
}
export function makeGlowTex() {
  return radialTexture(128, [[0, 'rgba(255,236,200,.95)'], [0.35, 'rgba(255,201,120,.5)'], [1, 'rgba(255,201,120,0)']]);
}
export function makeStarSprite() {
  return radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,.7)'], [1, 'rgba(255,255,255,0)']]);
}
export function makeStreakTex() {
  /* 速度线：横向椭圆光斑，沿 z 拉伸后看起来像风线 */
  return radialTexture(64, [[0, 'rgba(255,246,232,.9)'], [0.38, 'rgba(255,226,190,.38)'], [1, 'rgba(255,226,190,0)']]);
}
export function makeRippleTex() {
  const SZ = 128;
  const { c, g } = canvas2d(SZ, SZ);
  const r = SZ / 2;
  const grd = g.createRadialGradient(r, r, r * 0.45, r, r, r * 0.98);
  grd.addColorStop(0, 'rgba(255,214,150,0)');
  grd.addColorStop(0.62, 'rgba(255,222,168,.85)');
  grd.addColorStop(1, 'rgba(255,214,150,0)');
  g.fillStyle = grd;
  g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();
  return texFromCanvas(c);
}

export function makeCloudTex(seed) {
  const SZ = 256;
  const { c, g } = canvas2d(SZ, SZ);
  g.clearRect(0, 0, SZ, SZ);
  let s = seed || 1;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 9; i++) {
    const x = SZ * (0.3 + rnd() * 0.4);
    const y = SZ * (0.38 + rnd() * 0.28);
    const r = SZ * (0.1 + rnd() * 0.16);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,.62)');
    grd.addColorStop(0.6, 'rgba(226,240,255,.24)');
    grd.addColorStop(1, 'rgba(210,232,255,0)');
    g.fillStyle = grd;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  }
  g.globalCompositeOperation = 'destination-in';
  const mask = g.createRadialGradient(SZ / 2, SZ / 2, SZ * 0.12, SZ / 2, SZ / 2, SZ * 0.5);
  mask.addColorStop(0, 'rgba(0,0,0,1)');
  mask.addColorStop(0.72, 'rgba(0,0,0,.85)');
  mask.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = mask;
  g.fillRect(0, 0, SZ, SZ);
  g.globalCompositeOperation = 'source-over';
  return texFromCanvas(c);
}

export function makePaperTex() {
  const SZ = 128;
  const { c, g } = canvas2d(SZ, SZ);
  g.fillStyle = '#8A6A4A';
  g.fillRect(0, 0, SZ, SZ);
  const img = g.getImageData(0, 0, SZ, SZ);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 26;
    img.data[i] = clamp(img.data[i] + n, 0, 255);
    img.data[i + 1] = clamp(img.data[i + 1] + n, 0, 255);
    img.data[i + 2] = clamp(img.data[i + 2] + n, 0, 255);
  }
  g.putImageData(img, 0, 0);
  const t = texFromCanvas(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(6, 5);
  return t;
}

/* --- 骰面贴图（DIE_FACES 顺序） --- */
export function makeDieFaceTextures() {
  const SZ = 96;
  const PIPS = {
    1: [[0.5, 0.5]],
    2: [[0.28, 0.28], [0.72, 0.72]],
    3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.24], [0.72, 0.24], [0.28, 0.5], [0.72, 0.5], [0.28, 0.76], [0.72, 0.76]]
  };
  const textures = [];
  for (let v = 1; v <= 6; v++) {
    const { c, g } = canvas2d(SZ, SZ);
    const grad = g.createLinearGradient(0, 0, SZ, SZ);
    grad.addColorStop(0, '#FFF7E9');
    grad.addColorStop(1, '#E8D5BC');
    g.fillStyle = grad;
    roundRect(g, 2, 2, SZ - 4, SZ - 4, 18); g.fill();
    g.strokeStyle = 'rgba(120,86,52,.35)'; g.lineWidth = 3;
    roundRect(g, 3, 3, SZ - 6, SZ - 6, 17); g.stroke();
    g.fillStyle = '#2A1B16';
    for (const [px, py] of PIPS[v]) {
      g.beginPath(); g.arc(px * SZ, py * SZ, SZ * 0.072, 0, TAU); g.fill();
    }
    textures.push(texFromCanvas(c));
  }
  return textures;
}

/* --- 天空球贴图 --- */
export function buildSkyTexture(top, mid, bottom) {
  const { c, g } = canvas2d(64, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, top);
  grad.addColorStop(0.52, mid);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 512);
  return texFromCanvas(c);
}

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

/* --- 格面图集：8x8 @64px。slot0 暗色侧面；1..44 = 11 种 kind × 4 色；45..48 航线；49..52 机坪 ---
 * opts.glyph=false → 不画中文（fly 期间用，飞行中格面字会随棋盘旋转斜置，只留色块/图标）。
 * 两版图集只有"有没有中文"这一点差异，切换时格面色块/描边/图标完全一致，不会跳变。 */
export function buildAtlas(opts = {}) {
  const glyphs = opts.glyph !== false;
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
      if (glyphs) {
        g.fillStyle = '#2A1B16';
        g.font = `bold ${kind === 'ring' ? 30 : 31}px "PingFang SC","Microsoft YaHei",sans-serif`;
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        g.fillText(GLYPH[kind] || '·', PX / 2, PX * 0.53);
      }
      if (kind === 'fly') {
        g.fillStyle = rgbCss(strong, 0.95);
        g.beginPath(); g.moveTo(PX - 13, 11); g.lineTo(PX - 6, 17); g.lineTo(PX - 13, 23); g.closePath(); g.fill();
      } else if (kind === 'fate') {
        g.fillStyle = rgbCss(0xFFB74D, 0.95);
        star(g, PX - 11, 13, 5.4, 2.4);
      } else if (kind === 'forbid' && glyphs) {
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

/* ==========================================================================
 * V8.2 · 机舱小桌板：垫面织纹 + 暗角/灯池叠层（overview 空区不再是纯色天空）
 * ========================================================================== */

/* 平铺织纹（felt）/ 木纹（wood）：全部按格子周期绘制 → RepeatWrapping 无缝 */
export function buildWeaveTex(t, size) {
  const SZ = size || 128;
  const P = 8;                     /* 周期：128/8 = 16 格，整除 → 无缝 */
  const cells = Math.round(SZ / P);
  const { c, g } = canvas2d(SZ, SZ);
  g.fillStyle = t.base;
  g.fillRect(0, 0, SZ, SZ);
  let s = 20260119;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };

  if (t.grain === 'wood') {
    /* 木纹：横向纹理 + 周期性波浪（波长整除 SZ → 左右无缝） */
    for (let j = 0; j < cells; j++) {
      const y0 = j * P;
      g.globalAlpha = 0.10 + rnd() * 0.16;
      g.strokeStyle = t.weave;
      g.lineWidth = 1 + rnd() * 1.6;
      g.beginPath();
      for (let x = 0; x <= SZ; x += 4) {
        const y = y0 + Math.sin((x / SZ) * Math.PI * 2 * 2 + j * 0.7) * 2.2 + 0.5;
        if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
    /* 纵向细丝 */
    g.strokeStyle = t.weave;
    g.globalAlpha = 0.07;
    g.lineWidth = 1;
    for (let x = 0; x < SZ; x += 6) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, SZ); g.stroke(); }
    g.globalAlpha = 1;
  } else {
    /* 绒布：细密经纬 + 每格微亮度差（像编织的浮沉） */
    for (let j = 0; j < cells; j++) {
      for (let i = 0; i < cells; i++) {
        const v = rnd();
        g.globalAlpha = 0.03 + v * 0.075;
        g.fillStyle = v > 0.5 ? t.base : t.base2;
        g.fillRect(i * P, j * P, P, P);
      }
    }
    g.globalAlpha = 1;
    g.strokeStyle = t.weave;
    g.lineWidth = 1;
    for (let k = 0; k < cells; k++) {
      g.globalAlpha = 0.20;
      g.beginPath(); g.moveTo(0, k * P + 0.5); g.lineTo(SZ, k * P + 0.5); g.stroke();
      g.globalAlpha = 0.12;
      g.beginPath(); g.moveTo(k * P + 0.5, 0); g.lineTo(k * P + 0.5, SZ); g.stroke();
    }
    g.globalAlpha = 1;
    /* 纤维点（周期内随机 → 无缝；稀疏 + 低对比，避免远看像星空噪点） */
    for (let i = 0; i < 90; i++) {
      g.globalAlpha = 0.05 + rnd() * 0.06;
      g.fillStyle = rnd() > 0.45 ? '#FFFFFF' : t.base2;
      const bx = Math.floor(rnd() * cells) * P, by = Math.floor(rnd() * cells) * P;
      g.fillRect(bx, by, 2, 1);
    }
    g.globalAlpha = 1;
  }
  const tex = texFromCanvas(c, { aniso: 4 });
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* 叠层：世界空间圆形暗角 + 灯池 + 圆形嵌线；通道 alpha=0 处透明，压在垫面之上 */
export function buildMatOverlay(t, size) {
  const SZ = size || 512;
  const { c, g } = canvas2d(SZ, SZ);
  const R = SZ / 2;
  /* 世界半径 → 画布半径：垫面平面 25.1 x 21.1 世界；用 scale 把"世界圆"画成椭圆 */
  const kW = 25.1, kD = 21.1;
  const px = (world) => (world / kW) * SZ;

  /* 1) 圆形暗角（世界圆；只压边缘一圈，别把整块垫面压黑） */
  const vig = g.createRadialGradient(0, 0, px(4.6), 0, 0, px(10.6));
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.52, t.vig.replace(/[\d.]+\)$/, '0.34)'));
  vig.addColorStop(1, t.vig.replace(/[\d.]+\)$/, '0.78)'));
  g.save();
  g.translate(R, R);
  g.scale(1, kW / kD);
  g.fillStyle = vig;
  g.beginPath(); g.arc(0, 0, px(12.7), 0, TAU); g.fill();
  g.restore();

  /* 2) 灯池：棋盘外一圈暖光（机舱顶灯落在桌板上） */
  const pool = g.createRadialGradient(R, R, px(1.0), R, R, px(5.6));
  pool.addColorStop(0, t.pool);
  pool.addColorStop(0.55, t.pool.replace(/[\d.]+\)$/, '0.07)'));
  pool.addColorStop(1, 'rgba(255,180,110,0)');
  g.save();
  g.translate(R, R);
  g.scale(1, kW / kD);
  g.fillStyle = pool;
  g.beginPath(); g.arc(0, 0, px(5.8), 0, TAU); g.fill();
  g.restore();

  /* 3) 垫面圆形嵌线：让棋盘像"摆在一块圆垫上"（一条细线，别做成两道划痕） */
  g.save();
  g.translate(R, R);
  g.scale(1, kW / kD);
  g.strokeStyle = t.rim;
  g.lineWidth = 1.6;
  g.beginPath(); g.arc(0, 0, px(4.12), 0, TAU); g.stroke();
  g.restore();

  /* 4) 织面大块起伏（低频斑块，避免大面积死平） */
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * TAU + 0.4;
    const rad = px(3.2 + (i % 3) * 1.6);
    const x = R + Math.cos(a) * rad;
    const y = R + Math.sin(a) * rad * (kW / kD) * 0.82;
    const rr = px(2.2 + (i % 4) * 0.7);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, i % 2 ? 'rgba(255,255,255,.030)' : 'rgba(0,0,0,.055)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
  return texFromCanvas(c, { aniso: 4 });
}

/* 中心终点顶面：金盘 + 同心环 + 星徽（配立体 hub 用，替换纯色平面） */
export function buildHubTop(hub, size) {
  const SZ = size || 256;
  const { c, g } = canvas2d(SZ, SZ);
  const R = SZ / 2;
  const grad = g.createRadialGradient(R, R * 0.82, R * 0.06, R, R, R);
  grad.addColorStop(0, '#FFF6E2');
  grad.addColorStop(0.45, rgbCss(hub.top));
  grad.addColorStop(1, rgbCss(hub.side));
  g.fillStyle = grad;
  g.beginPath(); g.arc(R, R, R, 0, TAU); g.fill();
  /* 同心环 */
  g.strokeStyle = 'rgba(80,48,14,.30)';
  g.lineWidth = 2;
  g.beginPath(); g.arc(R, R, R * 0.86, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,250,235,.55)';
  g.lineWidth = 1.6;
  g.beginPath(); g.arc(R, R, R * 0.78, 0, TAU); g.stroke();
  /* 星徽 */
  g.save();
  g.translate(R, R);
  const sg = g.createLinearGradient(-R * 0.5, -R * 0.5, R * 0.5, R * 0.5);
  sg.addColorStop(0, '#FFFFFF');
  sg.addColorStop(1, rgbCss(hub.star));
  g.fillStyle = sg;
  star(g, 0, 0, R * 0.52, R * 0.22);
  g.strokeStyle = 'rgba(92,54,16,.45)';
  g.lineWidth = 1.4;
  g.stroke();
  /* 星心暖点 */
  const cg = g.createRadialGradient(0, 0, 0, 0, 0, R * 0.3);
  cg.addColorStop(0, 'rgba(255,255,255,.9)');
  cg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = cg;
  g.beginPath(); g.arc(0, 0, R * 0.3, 0, TAU); g.fill();
  g.restore();
  return texFromCanvas(c, { aniso: 8 });
}

/* 45° 舞台格专用贴图（256px）：格面字偏前中、小熊座位在左后 → 字与熊不再叠压。
 * kind/color 与环格图集同一套配色，观感连续；额外给一行类型名（320 下也读得出"真心话"）。 */
export function buildStagePlate(kind, color, label, size, textPos) {
  const SZ = size || 256;
  const { c, g } = canvas2d(SZ, SZ);
  const strong = HEX[color] || HEX.red;
  const soft = HEX_SOFT[color] || HEX_SOFT.red;
  const grad = g.createLinearGradient(0, 0, SZ, SZ);
  grad.addColorStop(0, soft);
  grad.addColorStop(0.55, '#FFFDF7');
  grad.addColorStop(1, soft);
  g.fillStyle = grad;
  roundRect(g, 4, 4, SZ - 8, SZ - 8, SZ * 0.17);
  g.fill();
  g.lineWidth = SZ * 0.028;
  g.strokeStyle = rgbCss(strong, 0.78);
  roundRect(g, SZ * 0.045, SZ * 0.045, SZ * 0.91, SZ * 0.91, SZ * 0.15);
  g.stroke();
  /* 高光 */
  const gloss = g.createLinearGradient(0, SZ * 0.05, 0, SZ * 0.45);
  gloss.addColorStop(0, 'rgba(255,255,255,.62)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gloss;
  roundRect(g, SZ * 0.08, SZ * 0.06, SZ * 0.84, SZ * 0.4, SZ * 0.12);
  g.fill();
  /* 小熊站位：软阴影（左后），像站在格背侧 */
  const gx = SZ * (textPos ? textPos.u : 0.58);
  const gy = SZ * (textPos ? textPos.v : 0.70);   /* v = canvas y 比例（大 = 靠前） */
  const sh = g.createRadialGradient(SZ * 0.3, SZ * 0.26, 0, SZ * 0.3, SZ * 0.26, SZ * 0.26);
  sh.addColorStop(0, 'rgba(40,24,14,.20)');
  sh.addColorStop(1, 'rgba(40,24,14,0)');
  g.fillStyle = sh;
  g.beginPath(); g.arc(SZ * 0.3, SZ * 0.26, SZ * 0.26, 0, TAU); g.fill();
  /* 格面字（大）+ 类型名（小） */
  g.fillStyle = '#2A1B16';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.font = `bold ${Math.round(SZ * 0.34)}px "PingFang SC","Microsoft YaHei",sans-serif`;
  g.fillText(GLYPH[kind] || '·', gx, gy);
  if (kind === 'fly') {
    g.fillStyle = rgbCss(strong, 0.95);
    g.beginPath();
    g.moveTo(SZ * 0.86, SZ * 0.12); g.lineTo(SZ * 0.95, SZ * 0.2); g.lineTo(SZ * 0.86, SZ * 0.28);
    g.closePath(); g.fill();
  } else if (kind === 'fate') {
    g.fillStyle = rgbCss(0xFFB74D, 0.95);
    star(g, SZ * 0.87, SZ * 0.15, SZ * 0.07, SZ * 0.03);
  }
  if (label) {
    g.fillStyle = 'rgba(70,44,28,.72)';
    g.font = `600 ${Math.round(SZ * 0.105)}px "PingFang SC","Microsoft YaHei",sans-serif`;
    g.fillText(label, gx, gy + SZ * 0.20);
  }
  return texFromCanvas(c, { aniso: 8 });
}


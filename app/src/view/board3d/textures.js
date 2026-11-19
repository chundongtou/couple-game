/* ==========================================================================
 * V9 · 真 3D 主桌 · 电影写实 · Canvas 程序化纹理（无外部图片 / 字体 / 网络）
 * 内容：胡桃木（color/normal/rough）、绒布（同上）、拉丝黄铜、象牙纸（折痕）、
 *       珐琅格面图集、棋盘木面（黄铜嵌线）、舷窗景观、舱壁、骰子图集、
 *       垫布暗角/灯池叠层、45° 舞台贴图、PMREM 程序化房间。
 * 所有贴图都按 PBR 三通道生成（color 走 SRGB，normal/rough 走线性）。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import {
  ATLAS_N, ATLAS_PX, SLOT_DARK, SLOT_BLANK, SLOT_HOME, SLOT_HANGAR,
  COLORS, HEX, GLYPH, KINDS, HOME_ENTRY, ringPhi, slotOf, TAU, clamp
} from './constants.js';

/* ------------------------------- 基础 ------------------------------- */
export function canvas2d(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return { c, g: c.getContext('2d') };
}

export function texFromCanvas(c, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = opts.srgb === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  t.anisotropy = opts.aniso || 4;
  t.needsUpdate = true;
  t.generateMipmaps = true;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
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
function mixCss(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB);
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * t)},${Math.round(a[1] + (b[1] - a[1]) * t)},${Math.round(a[2] + (b[2] - a[2]) * t)})`;
}
function rng(seed) {
  let s = seed || 1;
  return () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
}

/* 高度图 → 法线贴图（Sobel 近似；周期边界保证可平铺） */
export function heightToNormal(src, strength = 2) {
  const w = src.width, h = src.height;
  const sd = src.getContext('2d').getImageData(0, 0, w, h).data;
  const { c, g } = canvas2d(w, h);
  const out = g.createImageData(w, h);
  const at = (x, y) => sd[((((y % h) + h) % h) * w + (((x % w) + w) % w)) * 4];
  const k = Math.max(0.2, strength);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) / 255;
      const dy = (at(x, y + 1) - at(x, y - 1)) / 255;
      const nx = -dx * k, ny = dy * k, nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      const i = (y * w + x) * 4;
      out.data[i] = (nx / len * 0.5 + 0.5) * 255;
      out.data[i + 1] = (ny / len * 0.5 + 0.5) * 255;
      out.data[i + 2] = (nz / len * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  g.putImageData(out, 0, 0);
  return c;
}

/* 共享贴图缓存（多架飞机 / 多个阴影共用一个纹理） */
let _shadowTex = null, _glowTex = null, _streakTex = null, _paper = null;
let _dustTex = null;
let _steamTex = null, _flameTex = null;

/* ------------------------------- 图标（雕刻线性） -------------------------------
 * 用 100×100 归一化坐标画线稿图标；atlas / 舞台 / 机坪共用。
 * mode='engrave'：先画深色偏移（凹槽阴影），再画浅色主体（受光边）。 */
function iconPath(g, kind) {
  g.beginPath();
  if (kind === 'takeoff' || kind === 'fly') {
    /* 纸飞机（俯冲角度）+ 跑道短线 */
    g.moveTo(16, 64); g.lineTo(84, 20); g.lineTo(60, 82); g.lineTo(46, 56); g.closePath();
    g.moveTo(46, 56); g.lineTo(84, 20);
    if (kind === 'fly') { g.moveTo(8, 34); g.lineTo(30, 34); g.moveTo(4, 44); g.lineTo(24, 44); g.moveTo(10, 54); g.lineTo(26, 54); }
  } else if (kind === 'forbid') {
    g.arc(50, 50, 32, 0, TAU);
    g.moveTo(28, 72); g.lineTo(72, 28);
  } else if (kind === 'fate') {
    g.moveTo(50, 8); g.quadraticCurveTo(54, 44, 92, 50); g.quadraticCurveTo(54, 56, 50, 92);
    g.quadraticCurveTo(46, 56, 8, 50); g.quadraticCurveTo(46, 44, 50, 8); g.closePath();
  } else if (kind === 'entry') {
    g.moveTo(20, 18); g.lineTo(20, 82); g.moveTo(20, 18); g.lineTo(64, 18);
    g.moveTo(20, 82); g.lineTo(64, 82); g.moveTo(64, 18); g.lineTo(64, 82);
    g.moveTo(50, 50); g.lineTo(82, 50); g.moveTo(70, 38); g.lineTo(82, 50); g.lineTo(70, 62);
  } else if (kind === 'truth') {
    g.moveTo(18, 26); g.lineTo(82, 26); g.quadraticCurveTo(90, 26, 90, 34); g.lineTo(90, 62);
    g.quadraticCurveTo(90, 70, 82, 70); g.lineTo(48, 70); g.lineTo(30, 86); g.lineTo(32, 70);
    g.lineTo(18, 70); g.quadraticCurveTo(10, 70, 10, 62); g.lineTo(10, 34);
    g.quadraticCurveTo(10, 26, 18, 26); g.closePath();
    /* 心里一颗小心 */
    g.moveTo(50, 60); g.bezierCurveTo(50, 56, 44, 52, 40, 56); g.bezierCurveTo(36, 60, 40, 66, 50, 72);
    g.bezierCurveTo(60, 66, 64, 60, 60, 56); g.bezierCurveTo(56, 52, 50, 56, 50, 60); g.closePath();
  } else if (kind === 'dare') {
    g.moveTo(50, 8); g.bezierCurveTo(60, 30, 74, 34, 72, 54);
    g.bezierCurveTo(70, 76, 58, 90, 50, 92); g.bezierCurveTo(42, 90, 30, 78, 30, 60);
    g.bezierCurveTo(30, 48, 38, 44, 40, 54); g.bezierCurveTo(42, 62, 50, 46, 50, 8); g.closePath();
  } else if (kind === 'touch') {
    g.arc(38, 52, 18, 0, TAU);
    g.arc(62, 52, 18, 0, TAU);
    g.moveTo(50, 22); g.lineTo(50, 34); g.moveTo(38, 30); g.lineTo(44, 39); g.moveTo(62, 30); g.lineTo(56, 39);
  } else if (kind === 'thermo') {
    g.moveTo(44, 16); g.lineTo(44, 66); g.moveTo(56, 16); g.lineTo(56, 66);
    g.moveTo(44, 16); g.quadraticCurveTo(50, 8, 56, 16);
    g.arc(50, 74, 12, 0, TAU);
    g.moveTo(60, 30); g.lineTo(68, 30); g.moveTo(60, 44); g.lineTo(68, 44); g.moveTo(60, 58); g.lineTo(68, 58);
  } else if (kind === 'wheel') {
    g.arc(50, 50, 32, 0, TAU);
    g.arc(50, 50, 7, 0, TAU);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * TAU;
      g.moveTo(50 + Math.cos(a) * 9, 50 + Math.sin(a) * 9);
      g.lineTo(50 + Math.cos(a) * 30, 50 + Math.sin(a) * 30);
    }
  } else {
    /* ring：小同心环 */
    g.arc(50, 50, 26, 0, TAU);
    g.arc(50, 50, 10, 0, TAU);
  }
}

function drawIcon(g, kind, cx, cy, size, color, opts = {}) {
  const s = size / 100;
  g.save();
  g.translate(cx - size / 2, cy - size / 2);
  g.scale(s, s);
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const fill = opts.fill !== false;
  if (opts.engrave) {
    g.save();
    g.translate(0, 1.6);
    g.strokeStyle = 'rgba(4,6,9,.55)';
    g.fillStyle = 'rgba(4,6,9,.5)';
    g.lineWidth = (opts.lw || 5.2);
    iconPath(g, kind);
    if (fill) g.fill(); else g.stroke();
    g.restore();
  }
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineWidth = opts.lw || 4.6;
  iconPath(g, kind);
  if (fill) g.fill();
  g.stroke();
  g.restore();
}

/* ------------------------------- 格面图集 ------------------------------- */
/* 8x8 @64px：珐琅底 + 细彩色包边 + 雕刻线性图标；不再有大号中文/粉彩整块。
 * opts.glyph 保留兼容位（V9 环格本来就没有中文；fly 用同一贴图即可）。 */
export function buildAtlas(opts = {}) {
  const PX = ATLAS_PX;
  const SIZE = PX * ATLAS_N;
  const aniso = opts.aniso || 8;
  const { c, g } = canvas2d(SIZE, SIZE);
  g.clearRect(0, 0, SIZE, SIZE);
  const at = (slot) => [(slot % ATLAS_N) * PX, Math.floor(slot / ATLAS_N) * PX];
  const rnd = rng(90210);

  /* 暗色槽：格侧面（真色由顶点色乘出来） */
  {
    const [x, y] = at(SLOT_DARK);
    const gr = g.createLinearGradient(x, y, x, y + PX);
    gr.addColorStop(0, '#2C3138');
    gr.addColorStop(1, '#12151A');
    g.fillStyle = gr;
    g.fillRect(x, y, PX, PX);
  }
  {
    const [x, y] = at(SLOT_BLANK);
    g.fillStyle = '#FFFFFF';
    g.fillRect(x, y, PX, PX);
  }

  const enamelBase = (x, y, kind, color) => {
    const strong = HEX[color];
    /* 深珐琅底：中心略亮（灯下），四周压暗 */
    g.save();
    g.translate(x, y);
    const gr = g.createRadialGradient(PX * 0.42, PX * 0.36, PX * 0.06, PX * 0.5, PX * 0.55, PX * 0.78);
    gr.addColorStop(0, mixCss(0x232830, strong, 0.34));
    gr.addColorStop(0.55, mixCss(0x181D24, strong, 0.24));
    gr.addColorStop(1, '#101317');
    g.fillStyle = gr;
    roundRect(g, 1.5, 1.5, PX - 3, PX - 3, PX * 0.17);
    g.fill();
    /* 细彩色包边（珐琅线） */
    g.lineWidth = 1.7;
    g.strokeStyle = rgbCss(strong, 0.92);
    roundRect(g, 2.6, 2.6, PX - 5.2, PX - 5.2, PX * 0.15);
    g.stroke();
    /* 内侧黄铜发丝线 */
    g.lineWidth = 0.8;
    g.strokeStyle = 'rgba(226,196,146,.28)';
    roundRect(g, 5.2, 5.2, PX - 10.4, PX - 10.4, PX * 0.12);
    g.stroke();
    /* 四角铆点（很轻的手工细节） */
    g.fillStyle = 'rgba(236,206,158,.34)';
    for (const [cx, cy] of [[6.4, 6.4], [PX - 6.4, 6.4], [6.4, PX - 6.4], [PX - 6.4, PX - 6.4]]) {
      g.beginPath(); g.arc(cx, cy, 0.85, 0, TAU); g.fill();
    }
    /* 极轻的磨痕/尘埃，避免整块像塑料 */
    for (let i = 0; i < 7; i++) {
      g.globalAlpha = 0.03 + rnd() * 0.05;
      g.fillStyle = rnd() > 0.5 ? '#FFFFFF' : '#000000';
      const w = 2 + rnd() * 7, h = 0.5 + rnd() * 1.2;
      g.fillRect(6 + rnd() * (PX - 14), 6 + rnd() * (PX - 14), w, h);
    }
    g.globalAlpha = 1;
    /* 顶面柔和高光（从左上来的阅读灯） */
    const hl = g.createLinearGradient(2, 2, PX * 0.7, PX * 0.7);
    hl.addColorStop(0, 'rgba(255,238,210,.16)');
    hl.addColorStop(0.4, 'rgba(255,238,210,.03)');
    hl.addColorStop(1, 'rgba(255,238,210,0)');
    g.fillStyle = hl;
    roundRect(g, 3, 3, PX - 6, PX - 6, PX * 0.15);
    g.fill();
    g.restore();
  };

  KINDS.forEach((kind) => {
    COLORS.forEach((color) => {
      const [x, y] = at(slotOf(kind, color));
      enamelBase(x, y, kind, color);
      const tint = mixCss(HEX[color], 0xEFE2CC, 0.52);
      const solid = kind === 'takeoff' || kind === 'fly' || kind === 'fate' || kind === 'dare';
      drawIcon(g, kind, x + PX / 2, y + PX * 0.505, PX * 0.56, tint, { engrave: true, lw: 5.4, fill: solid });
    });
  });

  /* 航线格：象牙珐琅 + 黄铜箭头（指向板心） */
  COLORS.forEach((color, i) => {
    const [x, y] = at(SLOT_HOME + i);
    g.save();
    g.translate(x, y);
    const gr = g.createLinearGradient(0, 0, 0, PX);
    gr.addColorStop(0, '#B7A47C');
    gr.addColorStop(1, '#77613F');
    g.fillStyle = gr;
    roundRect(g, 1.5, 1.5, PX - 3, PX - 3, PX * 0.16);
    g.fill();
    g.lineWidth = 1.7;
    g.strokeStyle = rgbCss(HEX[color], 0.85);
    roundRect(g, 2.6, 2.6, PX - 5.2, PX - 5.2, PX * 0.15);
    g.stroke();
    g.strokeStyle = 'rgba(90,64,32,.42)';
    g.lineWidth = 0.9;
    roundRect(g, 5.2, 5.2, PX - 10.4, PX - 10.4, PX * 0.11);
    g.stroke();
    drawIcon(g, 'entry', PX / 2, PX * 0.5, PX * 0.54, mixCss(0xC8A66E, HEX[color], 0.30), { engrave: true, lw: 5.6, fill: false });
    g.restore();
  });

  /* 机坪：深色皮革 + 彩色环 + 纸飞机剪影 */
  COLORS.forEach((color, i) => {
    const [x, y] = at(SLOT_HANGAR + i);
    g.save();
    g.translate(x, y);
    const gr = g.createRadialGradient(PX * 0.45, PX * 0.4, 2, PX * 0.5, PX * 0.5, PX * 0.8);
    gr.addColorStop(0, '#242A31');
    gr.addColorStop(1, '#0D1014');
    g.fillStyle = gr;
    roundRect(g, 1.5, 1.5, PX - 3, PX - 3, PX * 0.2);
    g.fill();
    g.strokeStyle = rgbCss(HEX[color], 0.8);
    g.lineWidth = 1.8;
    g.beginPath(); g.arc(PX / 2, PX / 2, PX * 0.30, 0, TAU); g.stroke();
    drawIcon(g, 'fly', PX / 2, PX * 0.5, PX * 0.42, mixCss(HEX[color], 0xEFE2CC, 0.35), { engrave: true, lw: 6, fill: true });
    g.restore();
  });

  return { canvas: c, tex: texFromCanvas(c, { aniso }) };
}

/* ------------------------------- 木 / 绒布 / 黄铜 / 纸 ------------------------------- */
export function buildWoodTextures(tint, size = 512) {
  const SZ = size;
  const P = Math.round(SZ / 4);
  const { c, g } = canvas2d(SZ, SZ);
  const base = mixCss(0x2E1D12, tint, 0.22);
  g.fillStyle = base;
  g.fillRect(0, 0, SZ, SZ);
  const rnd = rng(4711);
  /* 年轮：围绕画布外一点的同心弧（平铺时读作长条木纹） */
  g.save();
  g.translate(SZ * 0.18, SZ * 0.42);
  for (let i = 0; i < 46; i++) {
    const rr = 20 + i * (SZ / 46) * 1.15;
    g.beginPath();
    for (let x = 0; x <= SZ * 1.4; x += 6) {
      const wob = Math.sin((x / SZ) * TAU * 1.5 + i * 0.7) * (2 + i * 0.12);
      const y = -rr + wob;
      if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.strokeStyle = i % 3 === 0 ? 'rgba(12,7,4,.42)' : 'rgba(86,58,36,.25)';
    g.lineWidth = i % 5 === 0 ? 2.4 : 1.1;
    g.stroke();
  }
  g.restore();
  /* 深色木孔 + 细颗粒（平铺周期内随机，边缘镜像保证接缝不突兀） */
  for (let i = 0; i < 260; i++) {
    const x = rnd() * SZ, y = rnd() * SZ;
    g.globalAlpha = 0.05 + rnd() * 0.12;
    g.fillStyle = rnd() > 0.55 ? 'rgba(10,6,3,.8)' : 'rgba(150,110,70,.6)';
    g.fillRect(x, y, 1 + rnd() * 2.4, 0.6 + rnd() * 1.1);
  }
  g.globalAlpha = 1;
  /* 交错的横向长纹（让 repeat 时不出现明显格子） */
  for (let j = 0; j < 18; j++) {
    const y0 = (j / 18) * SZ;
    g.globalAlpha = 0.06 + rnd() * 0.10;
    g.strokeStyle = rnd() > 0.5 ? '#0B0704' : '#7A5536';
    g.lineWidth = 0.8 + rnd() * 1.4;
    g.beginPath();
    for (let x = 0; x <= SZ; x += 8) {
      const yy = y0 + Math.sin((x / SZ) * TAU * 2 + j) * 2.0;
      if (x === 0) g.moveTo(x, yy); else g.lineTo(x, yy);
    }
    g.stroke();
  }
  g.globalAlpha = 1;

  /* 法线：把上面的纹理转灰度当高度 */
  const h = canvas2d(SZ, SZ);
  h.g.drawImage(c, 0, 0);
  const normal = heightToNormal(h.c, 5.0);

  /* 粗糙度：木纹略粗糙，年轮处更亮 */
  const r = canvas2d(Math.round(SZ / 2), Math.round(SZ / 2));
  r.g.drawImage(c, 0, 0, r.c.width, r.c.height);
  const rd = r.g.getImageData(0, 0, r.c.width, r.c.height);
  for (let i = 0; i < rd.data.length; i += 4) {
    const l = (rd.data[i] * 0.3 + rd.data[i + 1] * 0.6 + rd.data[i + 2] * 0.1) / 255;
    const v = 200 + (1 - l) * 55;              /* 暗纹更粗（≈.78–1.0 × 0.55） */
    rd.data[i] = rd.data[i + 1] = rd.data[i + 2] = v;
  }
  r.g.putImageData(rd, 0, 0);

  return {
    map: texFromCanvas(c, { aniso: 8 }),
    normal: texFromCanvas(normal, { srgb: false, aniso: 8 }),
    rough: texFromCanvas(r.c, { srgb: false, aniso: 4 })
  };
}

export function buildFeltTextures(tint, size = 256) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(1307);
  g.fillStyle = mixCss(0x4A4E52, tint, 0.42);
  g.fillRect(0, 0, SZ, SZ);
  /* 经纬织纹：8px 周期，整除 SZ，保证平铺无缝 */
  const P = 8, cells = SZ / P;
  for (let j = 0; j < cells; j++) {
    for (let i = 0; i < cells; i++) {
      g.globalAlpha = 0.05 + rnd() * 0.08;
      g.fillStyle = rnd() > 0.5 ? '#FFFFFF' : '#000000';
      g.fillRect(i * P, j * P, P, P);
    }
  }
  g.globalAlpha = 1;
  for (let k = 0; k < cells; k++) {
    g.globalAlpha = 0.20;
    g.strokeStyle = 'rgba(255,255,255,.35)';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(0, k * P + 0.5); g.lineTo(SZ, k * P + 0.5); g.stroke();
    g.globalAlpha = 0.14;
    g.strokeStyle = 'rgba(0,0,0,.5)';
    g.beginPath(); g.moveTo(k * P + 0.5, 0); g.lineTo(k * P + 0.5, SZ); g.stroke();
  }
  g.globalAlpha = 1;
  /* 绒毛纤维点 */
  for (let i = 0; i < 420; i++) {
    g.globalAlpha = 0.05 + rnd() * 0.09;
    g.strokeStyle = rnd() > 0.5 ? 'rgba(255,245,230,.8)' : 'rgba(0,0,0,.7)';
    g.lineWidth = 0.8;
    const x = rnd() * SZ, y = rnd() * SZ, a = rnd() * Math.PI;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 2.2, y + Math.sin(a) * 2.2); g.stroke();
  }
  g.globalAlpha = 1;
  /* 低频起伏（大块明暗，避免纯色板） */
  for (let i = 0; i < 6; i++) {
    const x = rnd() * SZ, y = rnd() * SZ, rr = SZ * (0.15 + rnd() * 0.25);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, i % 2 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.06)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }

  const h = canvas2d(SZ, SZ);
  h.g.drawImage(c, 0, 0);
  const normal = heightToNormal(h.c, 2.2);

  const r = canvas2d(64, 64);
  r.g.fillStyle = 'rgb(238,238,238)';
  r.g.fillRect(0, 0, 64, 64);
  r.g.globalAlpha = 0.25;
  for (let i = 0; i < 120; i++) {
    r.g.fillStyle = rnd() > 0.5 ? '#FFFFFF' : '#D8D8D8';
    r.g.fillRect(rnd() * 64, rnd() * 64, 1.5, 1.5);
  }
  r.g.globalAlpha = 1;
  return {
    map: texFromCanvas(c, { aniso: 8 }),
    normal: texFromCanvas(normal, { srgb: false, aniso: 8 }),
    rough: texFromCanvas(r.c, { srgb: false })
  };
}

export function buildBrushedBrass(size = 256) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(77003);
  const gr = g.createLinearGradient(0, 0, 0, SZ);
  gr.addColorStop(0, '#C79B63');
  gr.addColorStop(0.45, '#A87F4D');
  gr.addColorStop(1, '#7C5A32');
  g.fillStyle = gr;
  g.fillRect(0, 0, SZ, SZ);
  for (let i = 0; i < 900; i++) {
    const y = rnd() * SZ;
    g.globalAlpha = 0.04 + rnd() * 0.10;
    g.strokeStyle = rnd() > 0.45 ? 'rgba(255,240,210,.9)' : 'rgba(40,24,10,.9)';
    g.lineWidth = 0.6 + rnd() * 1.2;
    g.beginPath(); g.moveTo(0, y); g.lineTo(SZ, y + (rnd() - 0.5) * 1.5); g.stroke();
  }
  g.globalAlpha = 1;
  /* 指纹/氧化的斑 */
  for (let i = 0; i < 7; i++) {
    const x = rnd() * SZ, y = rnd() * SZ, rr = SZ * (0.05 + rnd() * 0.14);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, i % 2 ? 'rgba(50,30,12,.20)' : 'rgba(255,228,180,.10)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
  const h = canvas2d(SZ, SZ);
  h.g.drawImage(c, 0, 0);
  const normal = heightToNormal(h.c, 1.4);
  const r = canvas2d(128, 128);
  r.g.drawImage(c, 0, 0, 128, 128);
  const rd = r.g.getImageData(0, 0, 128, 128);
  for (let i = 0; i < rd.data.length; i += 4) {
    const v = 118 + (rd.data[i] / 255) * 40;      /* ≈ .42–.62 的粗糙度带 */
    rd.data[i] = rd.data[i + 1] = rd.data[i + 2] = v;
  }
  r.g.putImageData(rd, 0, 0);
  return {
    map: texFromCanvas(c, { aniso: 8 }),
    normal: texFromCanvas(normal, { srgb: false, aniso: 8 }),
    rough: texFromCanvas(r.c, { srgb: false })
  };
}

export function buildPaperTextures(size = 256) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(5150);
  const gr = g.createLinearGradient(0, 0, SZ, SZ);
  gr.addColorStop(0, '#F3E6D0');
  gr.addColorStop(0.55, '#EADCC2');
  gr.addColorStop(1, '#DCCBAB');
  g.fillStyle = gr;
  g.fillRect(0, 0, SZ, SZ);
  /* 纸纤维 */
  for (let i = 0; i < 900; i++) {
    g.globalAlpha = 0.03 + rnd() * 0.05;
    g.strokeStyle = rnd() > 0.5 ? 'rgba(255,255,255,.9)' : 'rgba(120,92,58,.8)';
    g.lineWidth = 0.6;
    const x = rnd() * SZ, y = rnd() * SZ, a = rnd() * Math.PI;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 3.4, y + Math.sin(a) * 3.4); g.stroke();
  }
  g.globalAlpha = 1;
  /* 中缝折痕（飞机机翼折线）：u=0.5 一条，轻微高光/暗边 */
  const crease = g.createLinearGradient(SZ * 0.47, 0, SZ * 0.53, 0);
  crease.addColorStop(0, 'rgba(130,100,64,0)');
  crease.addColorStop(0.45, 'rgba(130,100,64,.24)');
  crease.addColorStop(0.5, 'rgba(255,252,244,.55)');
  crease.addColorStop(0.56, 'rgba(130,100,64,.22)');
  crease.addColorStop(1, 'rgba(130,100,64,0)');
  g.fillStyle = crease;
  g.fillRect(SZ * 0.47, 0, SZ * 0.06, SZ);
  /* 前缘横折 */
  g.globalAlpha = 0.18;
  g.strokeStyle = 'rgba(120,92,58,.9)';
  g.lineWidth = 1.2;
  g.beginPath(); g.moveTo(0, SZ * 0.72); g.lineTo(SZ, SZ * 0.72); g.stroke();
  g.globalAlpha = 1;
  const h = canvas2d(SZ, SZ);
  h.g.drawImage(c, 0, 0);
  const normal = heightToNormal(h.c, 1.6);
  return { map: texFromCanvas(c, { aniso: 8 }), normal: texFromCanvas(normal, { srgb: false, aniso: 8 }) };
}

/* ------------------------------- 棋盘木面（黄铜嵌线） ------------------------------- */
export function buildBoardFace(tint) {
  const SZ = 768;
  const { c, g } = canvas2d(SZ, SZ);
  const r = SZ / 2;
  const rnd = rng(20260119);
  /* 胡桃木底色：从中心向外的年轮弧 */
  g.fillStyle = mixCss(0x2A1A10, tint, 0.16);
  g.fillRect(0, 0, SZ, SZ);
  g.save();
  g.translate(r, r);
  for (let i = 0; i < 70; i++) {
    const rr = 8 + i * (r / 70) * 1.18;
    g.beginPath();
    for (let a = 0; a <= TAU + 0.02; a += 0.03) {
      const wob = Math.sin(a * 7 + i * 0.8) * (1.6 + i * 0.08);
      const x = Math.cos(a) * (rr + wob), y = Math.sin(a) * (rr + wob);
      if (a === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.strokeStyle = i % 3 === 0 ? 'rgba(10,6,3,.34)' : 'rgba(96,66,42,.22)';
    g.lineWidth = i % 6 === 0 ? 2.2 : 1.0;
    g.stroke();
  }
  g.restore();
  /* 细颗粒 */
  for (let i = 0; i < 2400; i++) {
    const a = rnd() * TAU, rr = Math.sqrt(rnd()) * r;
    g.globalAlpha = 0.04 + rnd() * 0.09;
    g.fillStyle = rnd() > 0.5 ? 'rgba(0,0,0,.7)' : 'rgba(150,110,72,.55)';
    g.fillRect(r + Math.cos(a) * rr, r + Math.sin(a) * rr, 1 + rnd() * 2, 0.6 + rnd() * 1);
  }
  g.globalAlpha = 1;

  /* 外圈压暗 + 黄铜嵌线 */
  const rimShade = g.createRadialGradient(r, r, r * 0.78, r, r, r);
  rimShade.addColorStop(0, 'rgba(0,0,0,0)');
  rimShade.addColorStop(1, 'rgba(0,0,0,.55)');
  g.fillStyle = rimShade;
  g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();

  g.strokeStyle = 'rgba(200,160,102,.62)';
  g.lineWidth = 5;
  g.beginPath(); g.arc(r, r, r * 0.955, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(30,18,8,.55)';
  g.lineWidth = 2;
  g.beginPath(); g.arc(r, r, r * 0.935, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(214,176,116,.30)';
  g.lineWidth = 3;
  g.beginPath(); g.arc(r, r, r * 0.70, 0, TAU); g.stroke();

  /* 四条航线的黄铜细线（从中心到环） */
  for (const col of COLORS) {
    const a = ringPhi(HOME_ENTRY[col]) + Math.PI;
    g.strokeStyle = 'rgba(206,168,110,.26)';
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(r + Math.cos(a) * r * 0.12, r + Math.sin(a) * r * 0.12);
    g.lineTo(r + Math.cos(a) * r * 0.66, r + Math.sin(a) * r * 0.66);
    g.stroke();
  }

  /* 中心：黄铜嵌圆（hub 底盘） */
  const cg = g.createRadialGradient(r, r, 0, r, r, r * 0.20);
  cg.addColorStop(0, 'rgba(240,212,160,.85)');
  cg.addColorStop(0.55, 'rgba(190,146,86,.55)');
  cg.addColorStop(1, 'rgba(120,82,40,0)');
  g.fillStyle = cg;
  g.beginPath(); g.arc(r, r, r * 0.20, 0, TAU); g.fill();
  g.strokeStyle = 'rgba(238,206,152,.62)';
  g.lineWidth = 2.4;
  g.beginPath(); g.arc(r, r, r * 0.155, 0, TAU); g.stroke();

  return texFromCanvas(c, { aniso: 8 });
}

/* ------------------------------- 骰子图集（3×2） ------------------------------- */
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
  for (let v = 1; v <= 6; v++) {
    const col = (v - 1) % 3, row = Math.floor((v - 1) / 3);
    const x = col * SZ, y = row * SZ;
    g.save();
    g.translate(x, y);
    /* 象牙骨白 + 轻微色差 */
    const gr = g.createLinearGradient(0, 0, SZ, SZ);
    gr.addColorStop(0, '#F6ECD8');
    gr.addColorStop(0.5, '#E8D9C0');
    gr.addColorStop(1, '#D3BEA0');
    g.fillStyle = gr;
    g.fillRect(0, 0, SZ, SZ);
    /* 黄铜细边 */
    g.strokeStyle = 'rgba(160,120,64,.55)';
    g.lineWidth = SZ * 0.022;
    g.strokeRect(SZ * 0.035, SZ * 0.035, SZ * 0.93, SZ * 0.93);
    g.strokeStyle = 'rgba(255,250,238,.5)';
    g.lineWidth = SZ * 0.012;
    g.strokeRect(SZ * 0.065, SZ * 0.065, SZ * 0.87, SZ * 0.87);
    /* 凹陷点数：先暗影再亮点 */
    for (const [px, py] of PIPS[v]) {
      const cx = px * SZ, cy = py * SZ, rr = SZ * 0.071;
      const dg = g.createRadialGradient(cx - rr * 0.3, cy - rr * 0.3, 0, cx, cy, rr);
      dg.addColorStop(0, '#14100C');
      dg.addColorStop(0.7, '#2A2118');
      dg.addColorStop(1, '#4A3A28');
      g.fillStyle = dg;
      g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,246,228,.28)';
      g.lineWidth = SZ * 0.008;
      g.beginPath(); g.arc(cx, cy, rr * 1.05, 0.4, Math.PI * 1.1); g.stroke();
    }
    g.restore();
  }
  return { tex: texFromCanvas(c, { aniso: 8 }), cols: 3, rows: 2 };
}

/* ------------------------------- 舷窗景观 ------------------------------- */
export function buildWindowView(w) {
  const SZ = 512;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(881);
  /* 夜空/黄昏渐变 */
  const gr = g.createLinearGradient(0, 0, 0, SZ);
  gr.addColorStop(0, w.top);
  gr.addColorStop(0.45, w.mid);
  gr.addColorStop(0.68, w.low);
  gr.addColorStop(0.78, mixCss(0xD8C6A8, 0xFFE6C0, 0.3));
  gr.addColorStop(1, '#0A0F16');
  g.fillStyle = gr;
  g.fillRect(0, 0, SZ, SZ);

  /* 星点 */
  const ns = Math.round(240 * (w.stars || 0));
  if (ns > 0) {
    for (let i = 0; i < ns; i++) {
      const x = rnd() * SZ, y = rnd() * SZ * 0.55;
      const a = 0.25 + rnd() * 0.75;
      g.fillStyle = `rgba(235,236,255,${a})`;
      g.beginPath(); g.arc(x, y, rnd() > 0.92 ? 1.6 : 0.8, 0, TAU); g.fill();
    }
    /* 星轨弧线（长曝光感） */
    g.strokeStyle = 'rgba(190,200,255,.14)';
    g.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      g.beginPath(); g.arc(SZ * 0.72, SZ * 1.35, SZ * (0.55 + i * 0.07), -2.1, -1.25); g.stroke();
    }
  }

  /* 月亮 + 光晕 */
  const mx = w.moonX * SZ, my = w.moonY * SZ, mr = w.moonR * SZ;
  const halo = g.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 6);
  halo.addColorStop(0, rgbCss(0xFFEBC8, 0.55));
  halo.addColorStop(0.35, rgbCss(0xFFDCA8, 0.16));
  halo.addColorStop(1, 'rgba(255,220,168,0)');
  g.fillStyle = halo;
  g.beginPath(); g.arc(mx, my, mr * 6, 0, TAU); g.fill();
  g.fillStyle = w.moon;
  g.beginPath(); g.arc(mx, my, mr, 0, TAU); g.fill();
  g.globalAlpha = 0.18;
  g.fillStyle = '#B9A98C';
  g.beginPath(); g.arc(mx - mr * 0.3, my + mr * 0.2, mr * 0.22, 0, TAU); g.fill();
  g.beginPath(); g.arc(mx + mr * 0.35, my - mr * 0.25, mr * 0.16, 0, TAU); g.fill();
  g.globalAlpha = 1;

  /* 云海：多层柔和椭圆（下半部），云顶被月光描边 */
  const cloudCol = w.cloud;
  for (let i = 0; i < 40; i++) {
    const y = SZ * (0.60 + rnd() * 0.34);
    const x = rnd() * SZ * 1.2 - SZ * 0.1;
    const rr = SZ * (0.05 + rnd() * 0.13);
    const cg = g.createRadialGradient(x, y, 0, x, y, rr);
    cg.addColorStop(0, rgbCss(cloudCol, 0.42));
    cg.addColorStop(0.6, rgbCss(cloudCol, 0.18));
    cg.addColorStop(1, rgbCss(cloudCol, 0));
    g.fillStyle = cg;
    g.beginPath(); g.ellipse(x, y, rr * 1.9, rr * 0.62, 0, 0, TAU); g.fill();
  }
  /* 月亮在云上的倒光 */
  const beam = g.createLinearGradient(mx, my, mx, SZ * 0.9);
  beam.addColorStop(0, 'rgba(255,232,196,.22)');
  beam.addColorStop(1, 'rgba(255,232,196,0)');
  g.fillStyle = beam;
  g.beginPath();
  g.moveTo(mx - mr * 1.2, my); g.lineTo(mx + mr * 1.2, my);
  g.lineTo(mx + mr * 5, SZ * 0.9); g.lineTo(mx - mr * 5, SZ * 0.9);
  g.closePath(); g.fill();
  /* V9.1：远处地面灯火（云缝里的一串暖点）+ 机翼剪影 + 翼尖信标
   * 只加在窗外景观里，0 draw；让「夜航」有尺度参照。 */
  g.save();
  for (let i = 0; i < 26; i++) {
    const x = SZ * (0.03 + rnd() * 0.94);
    const y = SZ * (0.745 + rnd() * 0.055);
    const a = 0.18 + rnd() * 0.5;
    const rr = rnd() > 0.85 ? 2.4 : 1.3;
    const lg = g.createRadialGradient(x, y, 0, x, y, rr * 3.2);
    lg.addColorStop(0, `rgba(255,216,160,${a})`);
    lg.addColorStop(0.4, `rgba(255,190,120,${a * 0.32})`);
    lg.addColorStop(1, 'rgba(255,190,120,0)');
    g.fillStyle = lg;
    g.beginPath(); g.arc(x, y, rr * 3.2, 0, TAU); g.fill();
    g.fillStyle = `rgba(255,238,206,${Math.min(0.9, a + 0.15)})`;
    g.beginPath(); g.arc(x, y, rr * 0.55, 0, TAU); g.fill();
  }
  /* 机翼：从右下角伸向画面中心的一道暗剪影（月/云被它切开，读作舷窗外机翼） */
  g.beginPath();
  g.moveTo(SZ * 1.02, SZ * 0.86);
  g.lineTo(SZ * 0.30, SZ * 0.72);
  g.lineTo(SZ * 0.34, SZ * 0.685);
  g.lineTo(SZ * 1.02, SZ * 0.79);
  g.closePath();
  g.fillStyle = 'rgba(6,9,13,.86)';
  g.fill();
  g.strokeStyle = 'rgba(150,180,210,.22)';
  g.lineWidth = 1.6;
  g.beginPath(); g.moveTo(SZ * 0.30, SZ * 0.72); g.lineTo(SZ * 1.0, SZ * 0.86); g.stroke();
  /* 翼尖红色防撞灯（静态一点暖红） */
  const beacon = g.createRadialGradient(SZ * 0.33, SZ * 0.706, 0, SZ * 0.33, SZ * 0.706, SZ * 0.035);
  beacon.addColorStop(0, 'rgba(255,120,90,.95)');
  beacon.addColorStop(0.35, 'rgba(255,80,60,.40)');
  beacon.addColorStop(1, 'rgba(255,80,60,0)');
  g.fillStyle = beacon;
  g.beginPath(); g.arc(SZ * 0.33, SZ * 0.706, SZ * 0.035, 0, TAU); g.fill();
  g.restore();

  /* 玻璃反光 + 窗框压暗 */
  const glass = g.createLinearGradient(0, 0, SZ, SZ);
  glass.addColorStop(0, 'rgba(255,255,255,.10)');
  glass.addColorStop(0.32, 'rgba(255,255,255,0)');
  glass.addColorStop(1, 'rgba(0,0,0,.30)');
  g.fillStyle = glass;
  g.fillRect(0, 0, SZ, SZ);
  const vig = g.createRadialGradient(SZ * 0.5, SZ * 0.55, SZ * 0.2, SZ * 0.5, SZ * 0.55, SZ * 0.72);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,4,8,.55)');
  g.fillStyle = vig;
  g.fillRect(0, 0, SZ, SZ);
  return texFromCanvas(c, { aniso: 4 });
}

/* ------------------------------- 舱壁 / 地板 ------------------------------- */
export function buildWallTexture(tint, size = 512) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(31337);
  g.fillStyle = mixCss(0x1A222A, tint, 0.55);
  g.fillRect(0, 0, SZ, SZ);
  /* 竖向舱板缝（每 128px = 1 个面板，平铺无缝）+ V9.1 铆钉 */
  for (let i = 0; i < 4; i++) {
    const x = i * 128;
    g.fillStyle = 'rgba(0,0,0,.34)';
    g.fillRect(x, 0, 3, SZ);
    g.fillStyle = 'rgba(255,238,208,.075)';
    g.fillRect(x + 3, 0, 1.5, SZ);
    /* 铆钉：板缝两侧一列小圆点（暗边 + 左上高光） */
    for (let k = 0; k < 8; k++) {
      const ry = 18 + k * 64;
      for (const rx of [x - 9, x + 12]) {
        g.fillStyle = 'rgba(8,10,12,.42)';
        g.beginPath(); g.arc(rx, ry, 2.6, 0, TAU); g.fill();
        g.fillStyle = 'rgba(255,238,210,.20)';
        g.beginPath(); g.arc(rx - 0.7, ry - 0.8, 1.35, 0, TAU); g.fill();
      }
    }
  }
  /* 横向黄铜压条（平铺在 y=96 / 320） */
  for (const y of [96, 320]) {
    const gr = g.createLinearGradient(0, y, 0, y + 6);
    gr.addColorStop(0, 'rgba(196,156,100,.55)');
    gr.addColorStop(0.5, 'rgba(232,196,140,.30)');
    gr.addColorStop(1, 'rgba(20,14,8,.35)');
    g.fillStyle = gr;
    g.fillRect(0, y, SZ, 6);
    /* 压条下方一排小铆钉，读作结构性舱壁 */
    for (let k = 0; k < 16; k++) {
      const rx = 8 + k * 32;
      g.fillStyle = 'rgba(10,8,6,.30)';
      g.beginPath(); g.arc(rx, y + 10, 1.9, 0, TAU); g.fill();
      g.fillStyle = 'rgba(240,214,170,.16)';
      g.beginPath(); g.arc(rx - 0.5, y + 9.4, 0.9, 0, TAU); g.fill();
    }
  }
  /* 底部踢脚线（壁板下沿的一道暗带） */
  const kick = g.createLinearGradient(0, SZ - 26, 0, SZ);
  kick.addColorStop(0, 'rgba(4,6,9,0)');
  kick.addColorStop(1, 'rgba(4,6,9,.55)');
  g.fillStyle = kick;
  g.fillRect(0, SZ - 26, SZ, 26);
  /* 皮革/织物暗纹 */
  for (let i = 0; i < 2600; i++) {
    g.globalAlpha = 0.025 + rnd() * 0.05;
    g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,.8)' : 'rgba(0,0,0,.9)';
    g.fillRect(rnd() * SZ, rnd() * SZ, 1 + rnd() * 2, 1 + rnd());
  }
  g.globalAlpha = 1;
  /* 低频污渍/光晕 */
  for (let i = 0; i < 6; i++) {
    const x = rnd() * SZ, y = rnd() * SZ, rr = SZ * (0.1 + rnd() * 0.24);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, rnd() > 0.5 ? 'rgba(0,0,0,.16)' : 'rgba(255,220,170,.05)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
  return texFromCanvas(c, { aniso: 4, repeat: [3, 1] });
}

export function buildFloorTexture(tint) {
  const SZ = 256;
  const { c, g } = canvas2d(SZ, SZ);
  const rnd = rng(4242);
  g.fillStyle = mixCss(0x0A0C0F, tint, 0.35);
  g.fillRect(0, 0, SZ, SZ);
  /* V9.1：机舱地毯织纹（细密斜织 + 短绒噪点，读作地毯而不是纯色地板） */
  g.lineWidth = 1;
  for (let i = -SZ; i < SZ * 2; i += 7) {
    g.strokeStyle = i % 14 === 0 ? 'rgba(255,236,208,.030)' : 'rgba(0,0,0,.10)';
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + SZ, SZ); g.stroke();
    g.beginPath(); g.moveTo(i, SZ); g.lineTo(i + SZ, 0); g.stroke();
  }
  for (let i = 0; i < 1400; i++) {
    g.globalAlpha = 0.03 + rnd() * 0.06;
    g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,.7)' : 'rgba(0,0,0,.9)';
    g.fillRect(rnd() * SZ, rnd() * SZ, 1 + rnd() * 2, 1 + rnd() * 2);
  }
  g.globalAlpha = 1;
  return texFromCanvas(c, { aniso: 4, repeat: [6, 4] });
}

/* ------------------------------- 光斑 / 阴影 / 云 / 涟漪 ------------------------------- */
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
  if (!_shadowTex) {
    _shadowTex = radialTexture(128, [[0, 'rgba(0,0,0,.62)'], [0.42, 'rgba(0,0,0,.34)'], [0.78, 'rgba(0,0,0,.10)'], [1, 'rgba(0,0,0,0)']]);
  }
  return _shadowTex;
}
export function makeGlowTex() {
  if (!_glowTex) {
    _glowTex = radialTexture(128, [[0, 'rgba(255,240,214,.95)'], [0.3, 'rgba(255,204,136,.48)'], [0.65, 'rgba(255,186,110,.14)'], [1, 'rgba(255,186,110,0)']]);
  }
  return _glowTex;
}
export function makeStreakTex() {
  if (!_streakTex) {
    _streakTex = radialTexture(64, [[0, 'rgba(255,246,232,.9)'], [0.38, 'rgba(255,226,190,.38)'], [1, 'rgba(255,226,190,0)']]);
  }
  return _streakTex;
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
export function makeDustTex() {
  if (!_dustTex) _dustTex = radialTexture(32, [[0, 'rgba(255,244,220,.95)'], [0.4, 'rgba(255,220,170,.35)'], [1, 'rgba(255,220,170,0)']]);
  return _dustTex;
}

/* ------------------------------- 垫布叠层（暗角/灯池/嵌线/棋盘接触影） ------------------------------- */
export function buildMatOverlay(t, dims, size = 512) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const kW = dims.w, kD = dims.d;
  const px = (world) => (world / kW) * SZ;
  const rnd = rng(606);

  /* 1) 边缘暗角（椭圆，房间灯只照桌面中心） */
  const vig = g.createRadialGradient(0, 0, px(kW * 0.30), 0, 0, px(kW * 0.62));
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(0.45, t.vig.replace(/[\d.]+\)$/, '0.18)'));
  vig.addColorStop(1, t.vig.replace(/[\d.]+\)$/, '0.60)'));
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  g.fillStyle = vig;
  g.beginPath(); g.arc(0, 0, px(kW * 0.78), 0, TAU); g.fill();
  g.restore();

  /* 2) 阅读灯暖池：落在棋盘左侧（灯在左后上方） */
  const pool = g.createRadialGradient(SZ * 0.34, SZ * 0.42, px(0.3), SZ * 0.34, SZ * 0.42, px(4.0));
  pool.addColorStop(0, t.pool);
  pool.addColorStop(0.5, t.pool.replace(/[\d.]+\)$/, '0.10)'));
  pool.addColorStop(1, 'rgba(255,178,104,0)');
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  g.fillStyle = pool;
  g.beginPath(); g.arc(0, 0, px(4.4), 0, TAU); g.fill();
  g.restore();

  /* 3) 棋盘落在绒布上的接触阴影（环） */
  const ring = g.createRadialGradient(0, 0, px(3.20), 0, 0, px(3.62));
  ring.addColorStop(0, 'rgba(0,0,0,0)');
  ring.addColorStop(0.25, 'rgba(0,0,0,.34)');
  ring.addColorStop(0.62, 'rgba(0,0,0,.20)');
  ring.addColorStop(1, 'rgba(0,0,0,0)');
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  g.fillStyle = ring;
  g.beginPath(); g.arc(0, 0, px(3.62), 0, TAU); g.fill();
  g.restore();

  /* 4) 垫布包边细线（黄铜色） */
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  g.strokeStyle = t.rim;
  g.lineWidth = 2.0;
  g.beginPath(); g.arc(0, 0, px(3.92), 0, TAU); g.stroke();
  g.restore();

  /* 4b) V9.1 地毯式织边 + 四角纹样：让棋盘四周的大片绒布不再空白
   *     （纯叠层绘制，0 draw；只画在棋盘圆盘之外、垫布边缘之内） */
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  /* 织边：两圈断续的「手缝线」+ 一圈极淡的实线 */
  g.setLineDash([7, 6]);
  g.strokeStyle = 'rgba(224,190,140,.20)';
  g.lineWidth = 2.2;
  g.beginPath(); g.arc(0, 0, px(3.56), 0, TAU); g.stroke();
  g.setLineDash([3, 7]);
  g.strokeStyle = 'rgba(12,16,20,.30)';
  g.lineWidth = 1.4;
  g.beginPath(); g.arc(0, 0, px(3.72), 0, TAU); g.stroke();
  g.setLineDash([]);
  g.strokeStyle = 'rgba(232,200,150,.10)';
  g.lineWidth = 1.2;
  g.beginPath(); g.arc(0, 0, px(3.46), 0, TAU); g.stroke();
  g.restore();
  /* 四角黄铜小纹样（棋盘中心在叠层局部坐标 (0,-FELT.z)） */
  const cz = -0.6;
  const corners = [[3.36, cz - 3.28], [-3.36, cz - 3.28], [3.36, cz + 3.28], [-3.36, cz + 3.28]];
  for (const [mx, mz] of corners) {
    const cxp = SZ / 2 + (mx / kW) * SZ, cyp = SZ / 2 + (mz / kD) * SZ;
    const R = px(0.30);
    g.save();
    g.translate(cxp, cyp);
    g.strokeStyle = 'rgba(230,196,146,.22)';
    g.lineWidth = 1.6;
    g.beginPath(); g.arc(0, 0, R, 0, TAU); g.stroke();
    g.beginPath();
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * TAU + 0.4;
      g.moveTo(Math.cos(a) * R * 0.25, Math.sin(a) * R * 0.25);
      g.lineTo(Math.cos(a) * R * 1.22, Math.sin(a) * R * 1.22);
    }
    g.stroke();
    g.strokeStyle = 'rgba(16,20,24,.26)';
    g.lineWidth = 1.2;
    g.beginPath(); g.arc(0.8, 1.1, R * 0.86, 0, TAU); g.stroke();
    g.fillStyle = 'rgba(236,204,156,.26)';
    g.beginPath(); g.arc(0, 0, 2.6, 0, TAU); g.fill();
    g.restore();
  }
  /* 四角内侧一小段「磨损/翻毛」光照斑（真实绒布会有方向性亮带） */
  for (let i = 0; i < 4; i++) {
    const a = -0.7 + i * (Math.PI / 2);
    const mx = Math.cos(a) * 3.1, mz = cz + Math.sin(a) * 3.1;
    const cxp = SZ / 2 + (mx / kW) * SZ, cyp = SZ / 2 + (mz / kD) * SZ;
    const bl = g.createRadialGradient(cxp, cyp, 0, cxp, cyp, px(1.1));
    bl.addColorStop(0, 'rgba(255,236,206,.045)');
    bl.addColorStop(1, 'rgba(255,236,206,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(cxp, cyp, px(1.1), 0, TAU); g.fill();
  }

  /* 5) 斜向柔光（阅读灯扫过绒面） */
  const sh = g.createLinearGradient(SZ * 0.05, 0, SZ * 0.9, SZ);
  sh.addColorStop(0, 'rgba(255,238,210,.10)');
  sh.addColorStop(0.4, 'rgba(255,238,210,.035)');
  sh.addColorStop(1, 'rgba(255,238,210,0)');
  g.fillStyle = sh;
  g.fillRect(0, 0, SZ, SZ);

  /* 6) 远处（画布上方 = 舱壁方向）压暗；近端留一点灯池 */
  const far = g.createLinearGradient(0, 0, 0, SZ * 0.42);
  far.addColorStop(0, 'rgba(3,6,10,.55)');
  far.addColorStop(0.6, 'rgba(3,6,10,.18)');
  far.addColorStop(1, 'rgba(3,6,10,0)');
  g.fillStyle = far;
  g.fillRect(0, 0, SZ, SZ * 0.42);
  const near = g.createLinearGradient(0, SZ, 0, SZ * 0.70);
  near.addColorStop(0, 'rgba(255,196,132,.12)');
  near.addColorStop(1, 'rgba(255,196,132,0)');
  g.fillStyle = near;
  g.fillRect(0, SZ * 0.70, SZ, SZ * 0.30);

  /* 7) 零星绒面明暗斑 */
  for (let i = 0; i < 9; i++) {
    const x = rnd() * SZ, y = rnd() * SZ, rr = SZ * (0.03 + rnd() * 0.09);
    const bl = g.createRadialGradient(x, y, 0, x, y, rr);
    bl.addColorStop(0, i % 2 ? 'rgba(255,255,255,.020)' : 'rgba(0,0,0,.045)');
    bl.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = bl;
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
  /* 8) 边缘羽化：叠层用 PlaneGeometry，必须让画布四角透明，否则桌板上会露出一个暗矩形 */
  g.globalCompositeOperation = 'destination-in';
  g.save();
  g.translate(SZ / 2, SZ / 2);
  g.scale(1, kW / kD);
  const mask = g.createRadialGradient(0, 0, px(kW * 0.34), 0, 0, px(kW * 0.53));
  mask.addColorStop(0, 'rgba(0,0,0,1)');
  mask.addColorStop(0.82, 'rgba(0,0,0,.96)');
  mask.addColorStop(0.94, 'rgba(0,0,0,.55)');
  mask.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = mask;
  g.beginPath(); g.arc(0, 0, px(kW * 0.53), 0, TAU); g.fill();
  g.restore();
  g.globalCompositeOperation = 'source-over';
  return texFromCanvas(c, { aniso: 4 });
}

/* ------------------------------- 中心金盘（黄铜星徽顶面） ------------------------------- */
export function buildHubTop(hub, size = 256) {
  const SZ = size;
  const { c, g } = canvas2d(SZ, SZ);
  const R = SZ / 2;
  const grad = g.createRadialGradient(R * 0.85, R * 0.72, R * 0.05, R, R, R);
  grad.addColorStop(0, '#FFF4DC');
  grad.addColorStop(0.4, rgbCss(hub.top));
  grad.addColorStop(1, rgbCss(hub.side));
  g.fillStyle = grad;
  g.beginPath(); g.arc(R, R, R, 0, TAU); g.fill();
  /* 拉丝纹 */
  const rnd = rng(99);
  for (let i = 0; i < 260; i++) {
    g.globalAlpha = 0.04 + rnd() * 0.08;
    g.strokeStyle = rnd() > 0.5 ? 'rgba(255,248,230,.8)' : 'rgba(60,36,12,.7)';
    g.lineWidth = 0.7;
    const y = rnd() * SZ;
    g.beginPath(); g.moveTo(0, y); g.lineTo(SZ, y + (rnd() - 0.5) * 2); g.stroke();
  }
  g.globalAlpha = 1;
  g.strokeStyle = 'rgba(70,42,16,.40)';
  g.lineWidth = 2.4;
  g.beginPath(); g.arc(R, R, R * 0.86, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,250,236,.55)';
  g.lineWidth = 1.8;
  g.beginPath(); g.arc(R, R, R * 0.78, 0, TAU); g.stroke();
  /* 星徽（凹刻） */
  g.save();
  g.translate(R, R);
  const starPath = () => {
    g.beginPath();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? R * 0.52 : R * 0.22;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.closePath();
  };
  starPath();
  g.fillStyle = 'rgba(58,34,12,.32)';
  g.fill();
  g.translate(0, -1.6);
  starPath();
  const sg = g.createLinearGradient(-R * 0.5, -R * 0.5, R * 0.5, R * 0.5);
  sg.addColorStop(0, '#FFFFFF');
  sg.addColorStop(1, rgbCss(hub.star));
  g.fillStyle = sg;
  g.fill();
  g.strokeStyle = 'rgba(255,250,236,.55)';
  g.lineWidth = 1.4;
  g.stroke();
  g.restore();
  return texFromCanvas(c, { aniso: 8 });
}

/* ------------------------------- 45° 舞台格贴图 -------------------------------
 * V9：深珐琅 + 黄铜包边 + 雕刻图标 + 小号中文标签（≤9px 视觉留给界面图例；
 * 舞台上以 256px 贴图清晰呈现）。小熊站位阴影在左后。 */
export function buildStagePlate(kind, color, label, size, textPos) {
  const SZ = size || 256;
  const { c, g } = canvas2d(SZ, SZ);
  const strong = HEX[color] || HEX.red;
  const rnd = rng(7788);
  /* 珐琅底 */
  const gr = g.createRadialGradient(SZ * 0.44, SZ * 0.38, SZ * 0.04, SZ * 0.5, SZ * 0.55, SZ * 0.78);
  gr.addColorStop(0, mixCss(0x1B1F25, strong, 0.34));
  gr.addColorStop(0.55, mixCss(0x13171C, strong, 0.24));
  gr.addColorStop(1, '#0A0D11');
  g.fillStyle = gr;
  roundRect(g, 3, 3, SZ - 6, SZ - 6, SZ * 0.14);
  g.fill();
  /* 黄铜包边 + 彩线 */
  g.strokeStyle = 'rgba(214,180,124,.85)';
  g.lineWidth = SZ * 0.018;
  roundRect(g, SZ * 0.035, SZ * 0.035, SZ * 0.93, SZ * 0.93, SZ * 0.125);
  g.stroke();
  g.strokeStyle = rgbCss(strong, 0.9);
  g.lineWidth = SZ * 0.010;
  roundRect(g, SZ * 0.062, SZ * 0.062, SZ * 0.876, SZ * 0.876, SZ * 0.105);
  g.stroke();
  g.strokeStyle = 'rgba(226,196,146,.24)';
  g.lineWidth = SZ * 0.004;
  roundRect(g, SZ * 0.086, SZ * 0.086, SZ * 0.828, SZ * 0.828, SZ * 0.09);
  g.stroke();
  /* 磨痕 */
  for (let i = 0; i < 22; i++) {
    g.globalAlpha = 0.03 + rnd() * 0.05;
    g.fillStyle = rnd() > 0.5 ? '#FFFFFF' : '#000000';
    g.fillRect(SZ * (0.08 + rnd() * 0.8), SZ * (0.08 + rnd() * 0.8), 2 + rnd() * 7, 0.8 + rnd());
  }
  g.globalAlpha = 1;
  /* 小熊站位软阴影（左后） */
  const sh = g.createRadialGradient(SZ * 0.29, SZ * 0.26, 0, SZ * 0.29, SZ * 0.26, SZ * 0.25);
  sh.addColorStop(0, 'rgba(20,12,6,.30)');
  sh.addColorStop(1, 'rgba(20,12,6,0)');
  g.fillStyle = sh;
  g.beginPath(); g.arc(SZ * 0.29, SZ * 0.26, SZ * 0.25, 0, TAU); g.fill();

  const gx = SZ * (textPos ? textPos.u : 0.58);
  const gy = SZ * (textPos ? textPos.v : 0.70);
  /* 雕刻图标（大） */
  const solidIcon = kind === 'takeoff' || kind === 'fly' || kind === 'fate' || kind === 'dare';
  drawIcon(g, kind, gx, gy - SZ * 0.055, SZ * 0.30, mixCss(strong, 0xEFE2CC, 0.55), { engrave: true, lw: 5.2, fill: solidIcon });
  /* 小号标签（衬线，暖纸色） */
  if (label) {
    g.fillStyle = 'rgba(236,220,190,.86)';
    g.font = `600 ${Math.round(SZ * 0.082)}px "Songti SC","STSong","SimSun","PingFang SC",serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(label, gx, gy + SZ * 0.115);
    /* 标签下细黄铜线 */
    g.strokeStyle = 'rgba(212,176,120,.34)';
    g.lineWidth = 1.2;
    g.beginPath();
    g.moveTo(gx - SZ * 0.07, gy + SZ * 0.165);
    g.lineTo(gx + SZ * 0.07, gy + SZ * 0.165);
    g.stroke();
  }
  return texFromCanvas(c, { aniso: 8 });
}

/* ------------------------------- PMREM 程序化房间 -------------------------------
 * 冻结单要求 PMREM + 程序化 RoomEnvironment、无外链 HDR。
 * 这里手搭一个「夜航机舱」极小环境：暖阅读灯面 + 冷舷窗面 + 暗舱壁 + 木桌面，
 * 供 brass/felt/enamel 的反射与间接光使用（一次性烘焙，运行时零成本）。 */
export function buildEnvironmentScene() {
  const s = new THREE.Scene();
  s.background = new THREE.Color(0x05070A);
  const add = (geo, color, x, y, z, rx, ry) => {
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
    m.position.set(x, y, z);
    if (rx) m.rotation.x = rx;
    if (ry) m.rotation.y = ry;
    s.add(m);
    return m;
  };
  /* 舱壁盒（内表面） */
  add(new THREE.BoxGeometry(24, 14, 24), 0x141C24, 0, 0, 0).material.side = THREE.BackSide;
  /* 木桌面反射（暖棕） */
  add(new THREE.PlaneGeometry(18, 18), 0x3A2718, 0, -4.4, 0, -Math.PI / 2);
  /* 阅读灯：左后上方暖光面 */
  add(new THREE.PlaneGeometry(3.2, 3.2), 0xFFD49A, -4.6, 3.2, -2.2, 0, Math.PI / 2);
  add(new THREE.PlaneGeometry(1.4, 1.4), 0xFFF0D2, -4.4, 3.0, -2.4, 0, Math.PI / 2);
  /* 舷窗：右侧冷光面 */
  add(new THREE.PlaneGeometry(4.2, 2.6), 0x8FB6E8, 5.2, 1.4, -4.6, 0, -Math.PI / 2.2);
  add(new THREE.PlaneGeometry(5.0, 3.2), 0x3E5A80, 5.4, 1.2, -4.4, 0, -Math.PI / 2.2);
  /* 顶部极暗的舱顶反光 */
  add(new THREE.PlaneGeometry(10, 10), 0x2A3038, 0, 6.6, 0, Math.PI / 2);
  return s;
}

/* ==========================================================================
 * V9.1 · 生活感小物贴图（全部程序化，无外链）
 *   buildPropAtlas：4×2 小图集（杂志/报纸/车票/明信片/照片/磁带/音箱网/横线纸）
 *   buildCurtainTexture：窗帘竖向褶皱
 *   makeSteamTex / makeFlameTex：咖啡蒸汽 / 烛焰
 * ========================================================================== */
export function buildCurtainTexture(size = 128) {
  const W = size, H = size * 2;
  const { c, g } = canvas2d(W, H);
  const rnd = rng(9021);
  g.fillStyle = '#6E6257';
  g.fillRect(0, 0, W, H);
  /* 竖向褶皱：正弦明暗带（顶部褶密、底部垂坠散开） */
  for (let x = 0; x < W; x++) {
    const k = x / W;
    const fold = Math.sin(k * Math.PI * 9 + Math.sin(k * 5.1) * 0.6);
    const shade = 0.5 + fold * 0.28;
    const v = Math.round(70 + shade * 90);
    g.fillStyle = `rgb(${v + 14},${v + 4},${v - 10})`;
    g.fillRect(x, 0, 1, H);
  }
  /* 顶部褶皱压暗 + 底部落在桌面上的阴影 */
  const top = g.createLinearGradient(0, 0, 0, H * 0.16);
  top.addColorStop(0, 'rgba(10,8,6,.55)');
  top.addColorStop(1, 'rgba(10,8,6,0)');
  g.fillStyle = top;
  g.fillRect(0, 0, W, H * 0.16);
  const bot = g.createLinearGradient(0, H * 0.72, 0, H);
  bot.addColorStop(0, 'rgba(8,6,4,0)');
  bot.addColorStop(1, 'rgba(8,6,4,.45)');
  g.fillStyle = bot;
  g.fillRect(0, H * 0.72, W, H * 0.28);
  /* 织物噪点 */
  for (let i = 0; i < 900; i++) {
    g.globalAlpha = 0.02 + rnd() * 0.05;
    g.fillStyle = rnd() > 0.5 ? 'rgba(255,244,224,.9)' : 'rgba(0,0,0,.8)';
    g.fillRect(rnd() * W, rnd() * H, 1, 1 + rnd() * 2);
  }
  g.globalAlpha = 1;
  return texFromCanvas(c, { aniso: 4 });
}

export function buildPropAtlas(size = 128) {
  const S = size;
  const { c, g } = canvas2d(S * 4, S * 2);
  const rnd = rng(778899);
  const at = (i) => { g.save(); g.translate((i % 4) * S, Math.floor(i / 4) * S); };
  const end = () => { g.restore(); };
  const grain = (n, a) => {
    for (let k = 0; k < n; k++) {
      g.globalAlpha = a * (0.3 + rnd() * 0.7);
      g.fillStyle = rnd() > 0.5 ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,.8)';
      g.fillRect(rnd() * S, rnd() * S, 1, 1 + rnd() * 2);
    }
    g.globalAlpha = 1;
  };

  /* 0) 杂志封面：暗底 + 大标题条 + 图片块 + 黄铜细线 */
  at(0);
  let gr = g.createLinearGradient(0, 0, S, S);
  gr.addColorStop(0, '#232B3A'); gr.addColorStop(0.55, '#1A1F2A'); gr.addColorStop(1, '#3A2A22');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  g.fillStyle = '#F0E2C8'; g.fillRect(10, 12, S - 20, 5);      /* 刊名条 */
  g.fillStyle = 'rgba(240,226,200,.72)'; g.fillRect(10, 21, S - 44, 2);
  const ph = g.createLinearGradient(14, 34, S - 14, 92);
  ph.addColorStop(0, '#6E93A6'); ph.addColorStop(0.55, '#C8A46C'); ph.addColorStop(1, '#3A2A22');
  g.fillStyle = ph; g.fillRect(14, 34, S - 28, 58);
  g.fillStyle = 'rgba(8,12,18,.55)'; g.beginPath();
  g.moveTo(14, 92); g.lineTo(52, 58); g.lineTo(80, 92); g.closePath(); g.fill();
  g.fillStyle = 'rgba(250,242,226,.78)'; g.fillRect(14, 100, S - 46, 3);
  g.fillStyle = 'rgba(232,222,200,.42)'; g.fillRect(14, 108, S - 64, 2); g.fillRect(14, 114, S - 74, 2);
  g.strokeStyle = 'rgba(214,178,120,.50)'; g.lineWidth = 1.2;
  g.strokeRect(6.5, 6.5, S - 13, S - 13);
  grain(160, 0.05);
  end();

  /* 1) 报纸：象牙纸 + 报头 + 三栏小字 + 一张图 */
  at(1);
  g.fillStyle = '#E7DCC6'; g.fillRect(0, 0, S, S);
  g.fillStyle = 'rgba(36,30,24,.86)'; g.fillRect(8, 8, S - 16, 6);
  g.fillStyle = 'rgba(36,30,24,.30)'; g.fillRect(8, 17, S - 16, 1.6);
  for (let col = 0; col < 3; col++) {
    const x0 = 8 + col * ((S - 16) / 3);
    const w = (S - 16) / 3 - 5;
    for (let k = 0; k < (col === 1 ? 14 : 20); k++) {
      const y = 24 + k * 4.4;
      if (y > S - 14) break;
      g.fillStyle = 'rgba(50,44,36,.36)';
      g.fillRect(x0, y, w * (0.55 + rnd() * 0.45), 1.5);
    }
  }
  g.fillStyle = 'rgba(60,64,66,.80)'; g.fillRect(8, S - 34, S - 16, 22);
  g.fillStyle = 'rgba(228,214,190,.55)'; g.fillRect(10, S - 32, S - 20, 2);
  grain(120, 0.04);
  end();

  /* 2) 车票/入场券：米色 + 左侧色条 + 虚线撕口 + 条形码 */
  at(2);
  g.fillStyle = '#EBDCC0'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#7A2E36'; g.fillRect(0, 0, 22, S);
  g.fillStyle = 'rgba(30,20,16,.82)'; g.fillRect(32, 22, S - 44, 4);
  g.fillStyle = 'rgba(46,36,28,.42)'; g.fillRect(32, 32, S - 56, 2.4);
  g.fillRect(32, 40, S - 66, 2.4);
  g.strokeStyle = 'rgba(60,46,36,.55)'; g.lineWidth = 1.4; g.setLineDash([4, 4]);
  g.beginPath(); g.moveTo(S - 30, 8); g.lineTo(S - 30, S - 8); g.stroke();
  g.setLineDash([]);
  g.fillStyle = 'rgba(30,22,18,.86)';
  for (let k = 0; k < 12; k++) g.fillRect(S - 22 + (k % 6) * 2.4, 18 + Math.floor(k / 6) * 26, 1.2, 22);
  g.fillStyle = '#7A2E36'; g.fillRect(32, S - 34, S - 74, 3);
  g.fillStyle = 'rgba(40,30,24,.55)'; g.beginPath(); g.arc(S - 30, S * 0.52, 4, 0, TAU); g.fill();
  grain(90, 0.04);
  end();

  /* 3) 明信片：黄昏云海 + 纸飞机剪影 + 邮票 + 地址线 */
  at(3);
  gr = g.createLinearGradient(0, 0, 0, S);
  gr.addColorStop(0, '#2B4763'); gr.addColorStop(0.5, '#B07A4E'); gr.addColorStop(0.78, '#E8C08A'); gr.addColorStop(1, '#7A4A2C');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  g.fillStyle = 'rgba(255,236,208,.34)';
  for (let k = 0; k < 5; k++) {
    const yy = S * (0.62 + k * 0.06);
    g.beginPath(); g.ellipse(S * (0.2 + rnd() * 0.6), yy, S * (0.16 + rnd() * 0.14), S * 0.035, 0, 0, TAU); g.fill();
  }
  g.fillStyle = 'rgba(18,22,26,.88)';
  g.beginPath(); g.moveTo(28, 44); g.lineTo(72, 56); g.lineTo(40, 64); g.lineTo(36, 56); g.lineTo(28, 44); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(214,180,124,.75)'; g.lineWidth = 1.4;
  g.strokeRect(S - 42, 10, 30, 34);
  g.fillStyle = 'rgba(240,226,198,.85)'; g.fillRect(S - 39, 13, 24, 28);
  g.fillStyle = 'rgba(36,30,24,.55)'; g.fillRect(10, S - 30, 46, 2); g.fillRect(10, S - 22, 38, 2); g.fillRect(10, S - 14, 42, 2);
  g.strokeStyle = 'rgba(250,244,232,.55)'; g.lineWidth = 1.2;
  g.strokeRect(3.5, 3.5, S - 7, S - 7);
  grain(110, 0.05);
  end();

  /* 4) 相框照片：夜色散景 + 小纸飞机（不出现人物） */
  at(4);
  gr = g.createRadialGradient(S * 0.58, S * 0.44, 2, S * 0.5, S * 0.5, S * 0.85);
  gr.addColorStop(0, '#C08A50'); gr.addColorStop(0.34, '#7A5334');
  gr.addColorStop(0.66, '#3A3040'); gr.addColorStop(1, '#161C26');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  /* 一层暖光雾（照片被灯照着） */
  const warm = g.createLinearGradient(0, S, S, 0);
  warm.addColorStop(0, 'rgba(255,196,120,.30)');
  warm.addColorStop(0.55, 'rgba(255,196,120,.06)');
  warm.addColorStop(1, 'rgba(255,196,120,0)');
  g.fillStyle = warm; g.fillRect(0, 0, S, S);
  for (let k = 0; k < 30; k++) {
    const x = rnd() * S, y = rnd() * S, rr = 2 + rnd() * 9;
    const bg = g.createRadialGradient(x, y, 0, x, y, rr);
    bg.addColorStop(0, 'rgba(255,214,150,.85)');
    bg.addColorStop(0.45, 'rgba(255,186,110,.30)');
    bg.addColorStop(1, 'rgba(255,170,90,0)');
    g.fillStyle = bg; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
  g.fillStyle = 'rgba(250,242,228,.94)';
  g.beginPath(); g.moveTo(S * 0.42, S * 0.58); g.lineTo(S * 0.72, S * 0.44); g.lineTo(S * 0.56, S * 0.62); g.lineTo(S * 0.51, S * 0.58); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,248,232,.34)'; g.lineWidth = 3; g.strokeRect(4, 4, S - 8, S - 8);
  grain(120, 0.04);
  end();

  /* 5) 磁带标签：深壳 + 双卷轴 + 标签条 + 小螺丝 */
  at(5);
  g.fillStyle = '#2A2724'; g.fillRect(0, 0, S, S);
  g.fillStyle = '#171513'; g.fillRect(6, 6, S - 12, S - 12);
  g.fillStyle = 'rgba(226,214,190,.92)'; g.fillRect(14, 30, S - 28, 50);
  g.fillStyle = 'rgba(58,50,42,.8)'; g.fillRect(18, 34, S - 36, 4);
  g.fillStyle = 'rgba(58,50,42,.55)'; g.fillRect(18, 43, S - 52, 2.4); g.fillRect(18, 49, S - 62, 2.4);
  for (const rx of [S * 0.34, S * 0.66]) {
    g.fillStyle = '#0E0D0C'; g.beginPath(); g.arc(rx, 16, 10, 0, TAU); g.fill();
    g.fillStyle = '#5A5046'; g.beginPath(); g.arc(rx, 16, 5, 0, TAU); g.fill();
    g.fillStyle = '#C9BDA8'; g.beginPath(); g.arc(rx, 16, 2, 0, TAU); g.fill();
  }
  g.fillStyle = '#8E8476'; g.fillRect(14, 88, S - 28, 24);
  g.fillStyle = 'rgba(255,246,232,.30)'; g.fillRect(14, 88, S - 28, 2);
  for (const [sx, sy] of [[10, 10], [S - 10, 10], [10, S - 10], [S - 10, S - 10]]) {
    g.fillStyle = '#6E665A'; g.beginPath(); g.arc(sx, sy, 2.6, 0, TAU); g.fill();
  }
  grain(80, 0.05);
  end();

  /* 6) 小音箱网罩：靛黑织物 + 点阵网 + 黄铜环 */
  at(6);
  gr = g.createLinearGradient(0, 0, S, S);
  gr.addColorStop(0, '#22262B'); gr.addColorStop(1, '#111418');
  g.fillStyle = gr; g.fillRect(0, 0, S, S);
  for (let y = 8; y < S - 8; y += 6) {
    for (let x = 8 + ((y / 6) % 2) * 3; x < S - 8; x += 6) {
      g.fillStyle = 'rgba(4,6,8,.75)'; g.beginPath(); g.arc(x, y, 1.8, 0, TAU); g.fill();
      g.fillStyle = 'rgba(255,240,214,.10)'; g.beginPath(); g.arc(x - 0.6, y - 0.7, 1, 0, TAU); g.fill();
    }
  }
  g.strokeStyle = 'rgba(206,172,116,.82)'; g.lineWidth = 3;
  g.beginPath(); g.arc(S * 0.5, S * 0.5, S * 0.32, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(20,16,12,.55)'; g.lineWidth = 1.4;
  g.beginPath(); g.arc(S * 0.5, S * 0.5, S * 0.40, 0, TAU); g.stroke();
  grain(90, 0.04);
  end();

  /* 7) 横线纸（笔记本内页）：象牙 + 淡蓝横线 + 红边 + 页脚 */
  at(7);
  g.fillStyle = '#EFE3CC'; g.fillRect(0, 0, S, S);
  g.fillStyle = 'rgba(90,60,50,.95)'; g.fillRect(0, 0, S, 2);
  for (let y = 20; y < S - 8; y += 9) {
    g.fillStyle = 'rgba(78,112,140,.30)';
    g.fillRect(12, y, S - 22, 1);
  }
  g.fillStyle = 'rgba(150,60,60,.38)'; g.fillRect(0, 10, 1.6, S - 10);
  g.fillStyle = 'rgba(78,72,64,.42)'; g.fillRect(S * 0.55, S - 14, 12, 2);
  grain(100, 0.03);
  end();

  return texFromCanvas(c, { aniso: 8 });
}

export function makeSteamTex() {
  if (_steamTex) return _steamTex;
  const S = 64;
  const { c, g } = canvas2d(S, S);
  const r = S / 2;
  const gr = g.createRadialGradient(r, r, 0, r, r, r);
  gr.addColorStop(0, 'rgba(255,246,232,.55)');
  gr.addColorStop(0.45, 'rgba(255,238,216,.20)');
  gr.addColorStop(1, 'rgba(255,238,216,0)');
  g.fillStyle = gr;
  g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();
  _steamTex = texFromCanvas(c);
  return _steamTex;
}

export function makeFlameTex() {
  if (_flameTex) return _flameTex;
  const W = 32, H = 64;
  const { c, g } = canvas2d(W, H);
  const gr = g.createLinearGradient(0, H, 0, 0);
  gr.addColorStop(0, 'rgba(255,150,60,.95)');
  gr.addColorStop(0.45, 'rgba(255,206,120,.95)');
  gr.addColorStop(0.8, 'rgba(255,246,214,.95)');
  gr.addColorStop(1, 'rgba(255,246,214,0)');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(W * 0.5, 2);
  g.bezierCurveTo(W * 0.86, H * 0.34, W * 0.82, H * 0.82, W * 0.5, H * 0.96);
  g.bezierCurveTo(W * 0.18, H * 0.82, W * 0.14, H * 0.34, W * 0.5, 2);
  g.closePath();
  g.fill();
  _flameTex = texFromCanvas(c);
  return _flameTex;
}

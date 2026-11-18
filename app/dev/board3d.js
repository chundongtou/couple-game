/* ==========================================================================
 * V8 P0 · 真 3D 主桌原型（board3d.js）
 * 独立 demo，不进构建、不接生产、不改引擎。three.js r180（本地 vendor 单文件 ESM）。
 *
 * 主题：机舱小桌板 + 圆形棋盘（52 环格 / 4 机坪 / 4×5 步航线 / 中心终点）
 *      + 低模纸飞机（红/黄各 2 架）+ 3D 骰子 + 云海/星空/纸雕背景
 *      + 45° 格子小舞台（3D 格子 + 3D 小熊）+ 右侧 DOM 内容卡。
 *
 * 镜头链：overview → roll → focus → fly → cell(45°) → bear → return
 *   focus/fly 的核心：相机与飞机固定在屏幕中心，棋盘组旋转 + 平移（跑步机错觉）。
 *   实现：给定环格局部角 φ，求板组位姿（绕 Y 旋转 theta + XZ 平移），
 *   使该格落在「聚焦点」、且该格切线方向对齐 -Z（世界前方）。
 *   于是 fly 时逐帧把 φ 从 cur 推到 target，格子从前方涌向飞机下方：飞机不动、世界在动。
 *
 * 对外 API（给 Playwright/CDP 自测用）：
 *   window.__board3d = { ready, go(phase), play(), step(), reset(), setTheme(id),
 *                        phase(), perf(), probe(), state() }
 * URL 参数：?theme=cloud|star|paper  ?reduced=1  ?dpr=1|2  ?shadows=0|1
 *          ?adapt=0  ?debug=1  ?dice=4,5,3,6,2
 * ========================================================================== */
import * as THREE from './vendor/three.module.js';

/* ============================ 0. 常量 / 拓扑 ============================ */
const VERSION = 'v8-p0-3d-3';
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;

const RING_N = 52;
const RING_R = 3.06;          // 环格中心半径
const CELL = 0.34;            // 环格边长
const TILE_H = 0.075;         // 格厚度
const TILE_BOTTOM = 0.02;
const TILE_TOP = TILE_BOTTOM + TILE_H;   // 0.095
const HOME_STEPS = 5;
const HOME_R0 = 2.46;
const HOME_PITCH = 0.40;
const HOME_CELL = 0.30;
const HANGAR_R = 1.95;
const PLANE_HOVER = 0.095;
const PLANE_Y = TILE_TOP + PLANE_HOVER;  // 飞机中心高（0.19）
const DIE_SIZE = 0.34;
const STAGE_RISE = 1.50;     // 目标格升起高度
const STAGE_AZIM = 24;       // 45° 舞台方位角

/* 与 app/src/engine/flight-board.js 同源（只读，不修改引擎） */
const COLORS = ['red', 'yellow', 'blue', 'green'];
const TAKEOFF = { red: 0, yellow: 13, blue: 26, green: 39 };
const HOME_ENTRY = { red: 50, yellow: 11, blue: 24, green: 37 };
const APRON_DEG = { red: 31, yellow: 121, blue: 211, green: 301 };
const HEX = { red: 0xFF7A6B, yellow: 0xFFC857, blue: 0x7FA8FF, green: 0x63DDA0 };
const HEX_SOFT = { red: '#FFC6BA', yellow: '#FFE3AC', blue: '#C9D5FF', green: '#BFF0D8' };
const FATE_CELLS = [5, 29];
const CELL_KIND = {
  1: 'truth', 2: 'truth', 5: 'truth', 9: 'truth', 12: 'truth',
  16: 'truth', 17: 'truth', 23: 'truth', 25: 'truth', 28: 'truth',
  31: 'truth', 38: 'truth', 42: 'truth', 43: 'truth', 51: 'truth',
  4: 'dare', 6: 'dare', 15: 'dare', 18: 'dare', 19: 'dare',
  22: 'dare', 27: 'dare', 30: 'dare', 32: 'dare', 35: 'dare',
  41: 'dare', 44: 'dare', 45: 'dare', 48: 'dare', 49: 'dare',
  3: 'touch', 8: 'touch', 21: 'touch', 29: 'touch', 34: 'touch', 47: 'touch',
  10: 'thermo', 36: 'thermo',
  14: 'wheel', 40: 'wheel'
};
const GLYPH = {
  takeoff: '起', fly: '飞', forbid: '停', fate: '缘', entry: '归',
  truth: '真', dare: '敢', touch: '触', thermo: '温', wheel: '轮', ring: '·'
};
const KIND_LABEL = {
  takeoff: '起飞', fly: '飞点', forbid: '禁跳', fate: '命运', entry: '进航',
  truth: '真心话', dare: '敢做', touch: '触碰', thermo: '温度计', wheel: '转盘', ring: '普通'
};

const mod = (n) => ((n % RING_N) + RING_N) % RING_N;
const colorOfRing = (n) => COLORS[((n % 4) + 4) % 4];
const isTakeoff = (n) => TAKEOFF[colorOfRing(n)] === n;
const isFly = (n) => mod(TAKEOFF[colorOfRing(n)] + 20) === n;
const isForbidden = (n) => mod(TAKEOFF[colorOfRing(n)] + 48) === n;
const entryOf = (n) => COLORS.some((c) => HOME_ENTRY[c] === n);
function kindOf(n) {
  if (isTakeoff(n)) return 'takeoff';
  if (isFly(n)) return 'fly';
  if (isForbidden(n)) return 'forbid';
  if (FATE_CELLS.indexOf(n) >= 0) return 'fate';
  if (entryOf(n)) return 'entry';
  return CELL_KIND[n] || 'ring';
}
const ringPhi = (n) => (n * TAU) / RING_N;

/* ============================ 1. 工具 ============================ */
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const smoothstep = (a, b, t) => { const x = clamp((t - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
const byId = (id) => document.getElementById(id);

const urlParams = new URLSearchParams(location.search);
const urlFlag = (k, d) => (urlParams.has(k) ? urlParams.get(k) !== '0' : d);

const S = {
  phase: 'boot',
  theme: urlParams.get('theme') || 'cloud',
  reduced: urlFlag('reduced', false) || matchMedia('(prefers-reduced-motion: reduce)').matches,
  shadows: urlFlag('shadows', true),
  adapt: urlFlag('adapt', true),
  debug: urlFlag('debug', false),
  dprParam: urlParams.get('dpr') ? Number(urlParams.get('dpr')) : 0,
  ready: false,
  busy: false,
  quality: 'high',
  cardOpen: false
};

/* 动画队列：所有过渡都挂在这条 rAF 时间线上（可被 reduced/instant 跳过） */
const anims = [];
function animate(ms, fn) {
  return new Promise((resolve) => { anims.push({ t: 0, ms: Math.max(1, ms), fn, resolve }); });
}
function runAnim(ms, fn) {
  if (S.reduced) { fn(1); return Promise.resolve(); }
  return animate(ms, fn);
}
function tickAnims(dt) {
  for (let i = anims.length - 1; i >= 0; i--) {
    const a = anims[i];
    a.t += dt;
    const k = clamp(a.t / a.ms, 0, 1);
    try { a.fn(k, a.t); } catch (err) { console.error(err); }
    if (k >= 1) { anims.splice(i, 1); a.resolve(); }
  }
}

/* ============================ 2. 画布贴图（无外部图片） ============================ */
function canvas2d(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return { c, g: c.getContext('2d') };
}
function texFromCanvas(c, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = opts.aniso || 4;
  t.needsUpdate = true;
  if (opts.repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(opts.repeat[0], opts.repeat[1]); }
  return t;
}
function roundRect(g, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  g.beginPath();
  g.moveTo(x + rr, y);
  g.arcTo(x + w, y, x + w, y + h, rr);
  g.arcTo(x + w, y + h, x, y + h, rr);
  g.arcTo(x, y + h, x, y, rr);
  g.arcTo(x, y, x + w, y, rr);
  g.closePath();
}
function hexToRgb(hex) {
  return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255];
}
function rgbCss(hex, a) {
  const [r, g, b] = hexToRgb(hex);
  return a === undefined ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
}
function dimColor(hex, k) {
  const [r, g, b] = hexToRgb(hex);
  return new THREE.Color((r / 255) * k, (g / 255) * k, (b / 255) * k);
}

/* --- 格面图集：8x8 @64px。slot0 = 侧面暗色；1..44 = 11 种 kind × 4 色；45..48 航线；49..52 机坪 --- */
const KINDS = ['takeoff', 'fly', 'forbid', 'fate', 'entry', 'truth', 'dare', 'touch', 'thermo', 'wheel', 'ring'];
const SLOT_DARK = 0;
const SLOT_HOME = 45;
const SLOT_HANGAR = 49;
const SLOT_BLANK = 53;
const ATLAS_N = 8;
const slotOf = (kind, color) => 1 + Math.max(0, KINDS.indexOf(kind)) * 4 + Math.max(0, COLORS.indexOf(color));
const uvOfSlot = (slot) => {
  const col = slot % ATLAS_N;
  const row = Math.floor(slot / ATLAS_N);
  return [col / ATLAS_N, 1 - (row + 1) / ATLAS_N, (col + 1) / ATLAS_N, 1 - row / ATLAS_N];
};

function buildAtlas() {
  const PX = 64, SIZE = PX * ATLAS_N;
  const { c, g } = canvas2d(SIZE, SIZE);
  g.clearRect(0, 0, SIZE, SIZE);

  const at = (slot) => [(slot % ATLAS_N) * PX, Math.floor(slot / ATLAS_N) * PX];

  /* 暗色槽（格子侧面 UV 落点；真色由顶点色乘出来） */
  {
    const [x, y] = at(SLOT_DARK);
    g.fillStyle = '#2A2434';
    g.fillRect(x, y, PX, PX);
  }
  /* 空格槽 */
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
      /* 内描边 */
      g.lineWidth = 2;
      g.strokeStyle = rgbCss(strong, 0.7);
      roundRect(g, 3.4, 3.4, PX - 6.8, PX - 6.8, 10);
      g.stroke();
      /* 顶部高光 */
      const gloss = g.createLinearGradient(0, 4, 0, PX * 0.5);
      gloss.addColorStop(0, 'rgba(255,255,255,.65)');
      gloss.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gloss;
      roundRect(g, 5, 4, PX - 10, PX * 0.46, 8);
      g.fill();
      /* 字符 / 符号 */
      g.fillStyle = '#2A1B16';
      g.font = `bold ${kind === 'ring' ? 30 : 29}px "PingFang SC","Microsoft YaHei",sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(GLYPH[kind] || '·', PX / 2, PX * 0.53);
      /* 功能角标 */
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
    /* 朝板心的双箭头（贴图向上 = 局部 -Z = 指向板心） */
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
    /* 小纸飞机剪影 */
    g.beginPath();
    g.moveTo(PX / 2, 17); g.lineTo(PX / 2 + 13, 45); g.lineTo(PX / 2, 39);
    g.lineTo(PX / 2 - 13, 45); g.closePath(); g.fill();
    g.restore();
  });

  return { canvas: c, tex: texFromCanvas(c, { aniso: 8 }) };
}
function star(g, cx, cy, r1, r2) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? r1 : r2;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y); else g.lineTo(x, y);
  }
  g.closePath(); g.fill();
}

/* --- 棋盘底盘贴图 --- */
function buildBoardFace() {
  const SZ = 768;
  const { c, g } = canvas2d(SZ, SZ);
  const r = SZ / 2;
  const grad = g.createRadialGradient(r, r * 0.86, r * 0.1, r, r, r);
  grad.addColorStop(0, '#2B3B52');
  grad.addColorStop(0.62, '#1B2839');
  grad.addColorStop(1, '#101A26');
  g.fillStyle = grad;
  g.beginPath(); g.arc(r, r, r, 0, TAU); g.fill();
  /* 环导轨 */
  g.strokeStyle = 'rgba(243,192,119,.30)'; g.lineWidth = 3;
  g.beginPath(); g.arc(r, r, r * 0.965, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(243,192,119,.14)'; g.lineWidth = 2;
  g.beginPath(); g.arc(r, r, r * 0.80, 0, TAU); g.stroke();
  /* 四条航线导轨 */
  for (const col of COLORS) {
    const a = ringPhi(HOME_ENTRY[col]) + Math.PI;
    g.strokeStyle = rgbCss(HEX[col], 0.2);
    g.lineWidth = 26;
    g.beginPath();
    g.moveTo(r + Math.cos(a) * r * 0.16, r + Math.sin(a) * r * 0.16);
    g.lineTo(r + Math.cos(a) * r * 0.72, r + Math.sin(a) * r * 0.72);
    g.stroke();
  }
  /* 中心徽章 */
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

/* --- 柔和光斑 / 阴影 / 云 / 星 --- */
function radialTexture(size, stops) {
  const { c, g } = canvas2d(size, size);
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  stops.forEach(([p, col]) => grad.addColorStop(p, col));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return texFromCanvas(c);
}
function makeShadowTex() {
  return radialTexture(128, [[0, 'rgba(0,0,0,.55)'], [0.45, 'rgba(0,0,0,.32)'], [1, 'rgba(0,0,0,0)']]);
}
function makeGlowTex() {
  return radialTexture(128, [[0, 'rgba(255,236,200,.95)'], [0.35, 'rgba(255,201,120,.5)'], [1, 'rgba(255,201,120,0)']]);
}
function makeStarSprite() {
  return radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,.7)'], [1, 'rgba(255,255,255,0)']]);
}
function makeCloudTex(seed) {
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
  /* 圆形羽化：避免贴图矩形硬边 */
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
function makePaperTex() {
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

/* ============================ 3. 渲染器 / 场景 / 相机 ============================ */
const canvas = byId('scene');
/* dpr >= 2 时关 MSAA（像素已足够密，省移动端填充带宽） */
const useAA = (window.devicePixelRatio || 1) < 2;
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: useAA,
  alpha: false,
  powerPreference: 'high-performance',
  stencil: false,
  depth: true
});
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = S.shadows;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0A1622);

const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 240);

const camState = {
  center: new THREE.Vector3(0, 0.05, 0.24),
  nx: 0, ny: 0,
  radius: 12, elev: 58, azim: 0, fov: 42
};
let camLock = null;   // fly 时冻结相机

function viewport() {
  const app = byId('app');
  return { w: app.clientWidth, h: app.clientHeight };
}
function aspectNow() {
  const v = viewport();
  return v.w / Math.max(1, v.h);
}
function camPosFrom(look, radius, elevDeg, azimDeg) {
  const e = elevDeg * DEG, a = azimDeg * DEG;
  return new THREE.Vector3(
    look.x + radius * Math.cos(e) * Math.sin(a),
    look.y + radius * Math.sin(e),
    look.z + radius * Math.cos(e) * Math.cos(a)
  );
}
/* 让世界点 center 落在屏幕 NDC(nx,ny) 上：迭代解算 look 目标 */
const _right = new THREE.Vector3(), _up = new THREE.Vector3(), _proj = new THREE.Vector3();
function applyCamera() {
  if (camLock) {
    camera.position.copy(camLock.pos);
    camera.quaternion.copy(camLock.quat);
    if (camera.fov !== camLock.fov) { camera.fov = camLock.fov; camera.updateProjectionMatrix(); }
    camera.updateMatrixWorld(true);
    return;
  }
  const cs = camState;
  if (camera.fov !== cs.fov) { camera.fov = cs.fov; camera.updateProjectionMatrix(); }
  const look = cs.center.clone();
  for (let i = 0; i < 3; i++) {
    camera.position.copy(camPosFrom(look, cs.radius, cs.elev, cs.azim));
    camera.lookAt(look);
    camera.updateMatrixWorld(true);
    if (cs.nx === 0 && cs.ny === 0) break;
    _proj.copy(cs.center).project(camera);
    const d = camera.position.distanceTo(cs.center);
    const halfH = d * Math.tan((cs.fov * DEG) / 2);
    const halfW = halfH * aspectNow();
    _right.setFromMatrixColumn(camera.matrixWorld, 0);
    _up.setFromMatrixColumn(camera.matrixWorld, 1);
    look.addScaledVector(_right, (_proj.x - cs.nx) * halfW);
    look.addScaledVector(_up, (_proj.y - cs.ny) * halfH);
  }
  camera.position.copy(camPosFrom(look, cs.radius, cs.elev, cs.azim));
  camera.lookAt(look);
  camera.updateMatrixWorld(true);
}
/* 距离：让半径 radiusWorld 的球占屏幕横向 fill 比例 */
function distForCover(radiusWorld, fill, fovDeg) {
  const vfov = fovDeg * DEG;
  const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspectNow());
  return radiusWorld / Math.tan(hfov / 2) / clamp(fill, 0.1, 1);
}

function camSnap(target, centerFn) {
  const c = centerFn ? centerFn() : target.center;
  camState.center.copy(c);
  camState.nx = target.nx; camState.ny = target.ny;
  camState.radius = target.radius; camState.elev = target.elev;
  camState.azim = target.azim; camState.fov = target.fov;
  camLock = null;
  applyCamera();
}
function camAnimate(ms, target, centerFn) {
  const from = {
    center: camState.center.clone(), nx: camState.nx, ny: camState.ny,
    radius: camState.radius, elev: camState.elev, azim: camState.azim, fov: camState.fov
  };
  camLock = null;
  return runAnim(ms, (k) => {
    const e = easeInOut(k);
    camState.center.copy(centerFn ? centerFn(e) : target.center);
    camState.nx = lerp(from.nx, target.nx, e);
    camState.ny = lerp(from.ny, target.ny, e);
    camState.radius = lerp(from.radius, target.radius, e);
    camState.elev = lerp(from.elev, target.elev, e);
    camState.azim = lerp(from.azim, target.azim, e);
    camState.fov = lerp(from.fov, target.fov, e);
    applyCamera();
  });
}

/* ============================ 4. 灯光 ============================ */
const hemi = new THREE.HemisphereLight(0xBED8FF, 0x2A2038, 0.85);
scene.add(hemi);
const ambient = new THREE.AmbientLight(0xFFFFFF, 0.16);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xFFF1DC, 1.25);
sun.position.set(3.4, 6.4, 4.2);
sun.castShadow = S.shadows;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -4.6; sun.shadow.camera.right = 4.6;
sun.shadow.camera.top = 4.6; sun.shadow.camera.bottom = -4.6;
sun.shadow.camera.near = 0.5; sun.shadow.camera.far = 20;
sun.shadow.bias = -0.0008;
sun.shadow.normalBias = 0.02;
scene.add(sun);
const sunTarget = new THREE.Object3D();
sunTarget.position.set(0, 0, 0);
scene.add(sunTarget);
sun.target = sunTarget;

const lamp = new THREE.PointLight(0xFFC98A, 9, 12, 2);
lamp.position.set(-3.1, 2.6, -1.4);
scene.add(lamp);

/* ============================ 5. 背景（三主题） ============================ */
const envRoot = new THREE.Group();
scene.add(envRoot);

function buildSky(top, mid, bottom) {
  const { c, g } = canvas2d(64, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, top);
  grad.addColorStop(0.52, mid);
  grad.addColorStop(1, bottom);
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 512);
  const t = texFromCanvas(c);
  const geo = new THREE.SphereGeometry(60, 24, 16);
  const mat = new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, depthWrite: false, fog: false });
  return new THREE.Mesh(geo, mat);
}
const skyCloud = buildSky('#1E5A86', '#0E2B45', '#050D16');
const skyStar = buildSky('#2A1B4E', '#140F2A', '#05030C');
const skyPaper = buildSky('#4A3524', '#2A1D14', '#0C0806');
skyStar.visible = false; skyPaper.visible = false;
envRoot.add(skyCloud, skyStar, skyPaper);

/* 云（cloud / paper 都用，颜色不同） */
const cloudGroup = new THREE.Group();
const cloudTexes = [makeCloudTex(7), makeCloudTex(13), makeCloudTex(29)];
for (let i = 0; i < 10; i++) {
  const mat = new THREE.SpriteMaterial({
    map: cloudTexes[i % cloudTexes.length],
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    fog: false
  });
  const sp = new THREE.Sprite(mat);
  const a = (i / 10) * TAU + (i % 3) * 0.2;
  const rad = 8 + (i % 4) * 1.8;
  sp.position.set(Math.cos(a) * rad, -1.6 + (i % 5) * 0.62, Math.sin(a) * rad);
  const sc = 2.9 + (i % 3) * 1.2;
  sp.scale.set(sc * 1.6, sc, 1);
  cloudGroup.add(sp);
}
envRoot.add(cloudGroup);

/* 星空 */
const starGroup = new THREE.Group();
{
  const N = 520;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const u = Math.random(), v = Math.random() * 0.55 + 0.12;
    const theta = u * TAU, phi = Math.acos(2 * v - 1);
    const r = 26 + Math.random() * 12;
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 1.2;
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.8, map: makeStarSprite(), color: 0xE4DEFF, transparent: true,
    opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false
  });
  starGroup.add(new THREE.Points(geo, mat));
  /* 两片星云 */
  const neb = (hex, x, y, z, s) => {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: radialTexture(128, [[0, rgbCss(hex, 0.32)], [0.5, rgbCss(hex, 0.12)], [1, rgbCss(hex, 0)]]),
      transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending, fog: false
    }));
    sp.position.set(x, y, z); sp.scale.set(s * 1.6, s, 1);
    return sp;
  };
  starGroup.add(neb(0x8E7BD8, -9, 5.5, -14, 12), neb(0xD87BA8, 11, 6.5, -12, 10));
  starGroup.visible = false;
}
envRoot.add(starGroup);

/* ============================ 6. 桌子 / 棋盘 ============================ */
const TRAY = { w: 13.0, d: 11.0, r: 0.9 };
const DISC_R = 3.30;

const world = new THREE.Group();
scene.add(world);

/* --- 桌板 --- */
const trayMat = new THREE.MeshLambertMaterial({ color: 0x3A2A24 });
const matMat = new THREE.MeshLambertMaterial({ color: 0x1E4A63 });
const trayGroup = new THREE.Group();
{
  const shape = new THREE.Shape();
  const w = TRAY.w, d = TRAY.d, r = TRAY.r;
  shape.moveTo(-w / 2 + r, -d / 2);
  shape.lineTo(w / 2 - r, -d / 2);
  shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
  shape.lineTo(w / 2, d / 2 - r);
  shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
  shape.lineTo(-w / 2 + r, d / 2);
  shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
  shape.lineTo(-w / 2, -d / 2 + r);
  shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02,
    bevelSegments: 1, curveSegments: 6, steps: 1
  });
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const tray = new THREE.Mesh(geo, trayMat);
  tray.position.y = -geo.boundingBox.max.y;
  tray.receiveShadow = true;
  trayGroup.add(tray);

  /* 毡垫 / 纸面 */
  const mat = new THREE.Mesh(new THREE.PlaneGeometry(TRAY.w - 0.9, TRAY.d - 0.9, 1, 1), matMat);
  mat.rotation.x = -Math.PI / 2;
  mat.position.y = 0.002;
  mat.receiveShadow = true;
  trayGroup.add(mat);
}
world.add(trayGroup);

/* --- 棋盘组（fly 时整体旋转 + 平移） --- */
const boardGroup = new THREE.Group();
world.add(boardGroup);

const atlas = buildAtlas();
const boardFaceTex = buildBoardFace();
const tileMat = new THREE.MeshLambertMaterial({ map: atlas.tex, vertexColors: true });
const discSideMat = new THREE.MeshLambertMaterial({ color: 0x141C28 });
const discTopMat = new THREE.MeshLambertMaterial({ map: boardFaceTex, color: 0x9FB6D8 });

/* 盘底 */
{
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(DISC_R, DISC_R - 0.04, 0.03, 64, 1), [
    discSideMat, discTopMat, discSideMat
  ]);
  disc.position.y = 0.005 + 0.015;
  disc.receiveShadow = true;
  boardGroup.add(disc);
}

/* --- 合并格子几何：顶面图集 UV + 侧面顶点色 --- */
function buildTileGeometry(tiles) {
  const pos = [], uv = [], col = [];
  const e1 = new THREE.Vector3(), e2 = new THREE.Vector3(), nrm = new THREE.Vector3();
  const darkUV = uvOfSlot(SLOT_DARK);
  const darkCenterU = (darkUV[0] + darkUV[2]) / 2;
  const darkCenterV = (darkUV[1] + darkUV[3]) / 2;

  function pushQuad(p0, p1, p2, p3, uvs, color) {
    e1.subVectors(p1, p0); e2.subVectors(p2, p0);
    nrm.crossVectors(e1, e2).normalize();
    const idx = [0, 1, 2, 0, 2, 3];
    const pts = [p0, p1, p2, p3];
    for (const i of idx) {
      const p = pts[i];
      pos.push(p.x, p.y, p.z);
      const t = uvs[i];
      uv.push(t[0], t[1]);
      col.push(color[0], color[1], color[2]);
    }
  }

  for (const t of tiles) {
    const c = Math.cos(t.rot), s = Math.sin(t.rot);
    const hw = t.w / 2, hd = t.d / 2;
    const loc = (dx, dz, y) => new THREE.Vector3(t.x + dx * c + dz * s, y, t.z - dx * s + dz * c);
    /* 顶面：A(-w,+d) B(+w,+d) C(+w,-d) D(-w,-d) → UV (u0,v0)(u1,v0)(u1,v1)(u0,v1) */
    const A = loc(-hw, hd, t.top), B = loc(hw, hd, t.top), C = loc(hw, -hd, t.top), D = loc(-hw, -hd, t.top);
    const u0 = t.uv[0], v0 = t.uv[1], u1 = t.uv[2], v1 = t.uv[3];
    pushQuad(A, B, C, D, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]], [1, 1, 1]);
    /* 侧面 */
    const A2 = loc(-hw, hd, t.bottom), B2 = loc(hw, hd, t.bottom), C2 = loc(hw, -hd, t.bottom), D2 = loc(-hw, -hd, t.bottom);
    const cu = darkCenterU, cv = darkCenterV;
    pushQuad(A, A2, B2, B, [[cu, cv], [cu, cv], [cu, cv], [cu, cv]], t.side);
    pushQuad(B, B2, C2, C, [[cu, cv], [cu, cv], [cu, cv], [cu, cv]], t.side);
    pushQuad(C, C2, D2, D, [[cu, cv], [cu, cv], [cu, cv], [cu, cv]], t.side);
    pushQuad(D, D2, A2, A, [[cu, cv], [cu, cv], [cu, cv], [cu, cv]], t.side);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

/* --- 组装 52 环格 + 4×5 航线 + 4 机坪 --- */
const ringTiles = [];
const homeTiles = [];
const hangarPads = [];
{
  for (let n = 0; n < RING_N; n++) {
    const phi = ringPhi(n);
    const color = colorOfRing(n), kind = kindOf(n);
    const side = dimColor(HEX[color], 0.40);
    ringTiles.push({
      x: RING_R * Math.sin(phi), z: -RING_R * Math.cos(phi),
      rot: -Math.PI / 2 - phi, w: CELL, d: CELL,
      top: TILE_TOP, bottom: TILE_BOTTOM,
      uv: uvOfSlot(slotOf(kind, color)), side: [side.r, side.g, side.b],
      n, kind, color
    });
  }
  for (const color of COLORS) {
    const phi = ringPhi(HOME_ENTRY[color]);
    const side = dimColor(HEX[color], 0.34);
    for (let s = 0; s < HOME_STEPS; s++) {
      const r = HOME_R0 - s * HOME_PITCH;
      homeTiles.push({
        x: r * Math.sin(phi), z: -r * Math.cos(phi),
        rot: -phi - Math.PI, w: HOME_CELL, d: HOME_CELL,
        top: TILE_TOP - 0.006, bottom: TILE_BOTTOM,
        uv: uvOfSlot(SLOT_HOME + COLORS.indexOf(color)), side: [side.r, side.g, side.b],
        color, step: s
      });
    }
  }
  for (const color of COLORS) {
    const a = APRON_DEG[color] * DEG;
    const side = dimColor(HEX[color], 0.30);
    /* 机坪底板 */
    hangarPads.push({
      x: HANGAR_R * Math.sin(a), z: -HANGAR_R * Math.cos(a),
      rot: -a - Math.PI, w: 0.94, d: 0.94, top: TILE_BOTTOM + 0.024, bottom: TILE_BOTTOM,
      uv: uvOfSlot(SLOT_DARK), side: [side.r * 0.8, side.g * 0.8, side.b * 0.8], color, plate: true
    });
    /* 4 个停机位 */
    const side2 = dimColor(HEX[color], 0.36);
    for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
      hangarPads.push({
        x: HANGAR_R * Math.sin(a) + (dx * Math.cos(a) + dz * Math.sin(a)),
        z: -HANGAR_R * Math.cos(a) + (-dx * Math.sin(a) + dz * Math.cos(a)),
        rot: -a - Math.PI, w: 0.28, d: 0.28,
        top: TILE_BOTTOM + 0.05, bottom: TILE_BOTTOM + 0.024,
        uv: uvOfSlot(SLOT_HANGAR + COLORS.indexOf(color)), side: [side2.r, side2.g, side2.b],
        color, pad: true
      });
    }
  }
  const ringMesh = new THREE.Mesh(buildTileGeometry(ringTiles.concat(homeTiles)), tileMat);
  ringMesh.receiveShadow = true;
  boardGroup.add(ringMesh);

  const padMesh = new THREE.Mesh(buildTileGeometry(hangarPads), tileMat);
  padMesh.receiveShadow = true;
  boardGroup.add(padMesh);
}

/* --- 中心终点徽章 --- */
const goalMedal = new THREE.Group();
{
  const geo = new THREE.CylinderGeometry(0.46, 0.5, 0.09, 32, 1);
  const mat = new THREE.MeshLambertMaterial({ color: 0xF3C077, emissive: 0x3A2408 });
  const m = new THREE.Mesh(geo, mat);
  m.position.y = 0.045;
  m.castShadow = false;
  goalMedal.add(m);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.028, 8, 40),
    new THREE.MeshLambertMaterial({ color: 0xFFE6B4, emissive: 0x2A1A06 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.02;
  goalMedal.add(ring);
  goalMedal.position.y = TILE_BOTTOM + 0.02;
  boardGroup.add(goalMedal);
}

/* --- 目标格光晕 / 飞机脚下光晕 --- */
const glowTex = makeGlowTex();
function makeGlow(size, color) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: glowTex, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color, fog: false
    })
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}
const targetGlow = makeGlow(0.9, 0xFFC98A);
targetGlow.position.y = TILE_TOP + 0.012;
targetGlow.visible = false;
boardGroup.add(targetGlow);

const planeGlow = makeGlow(0.62, 0xFFC98A);
planeGlow.position.y = TILE_TOP + 0.014;
world.add(planeGlow);

/* ============================ 7. 纸飞机 ============================ */
function makePlane(colorHex, accentHex) {
  const g = new THREE.Group();
  const L = 0.46, W = 0.30, H = 0.075;
  const nose = [0, 0.022, -L / 2];
  const tail = [0, 0.05, L / 2];
  const wl = [-W / 2, 0.002, L / 2 - 0.07];
  const wr = [W / 2, 0.002, L / 2 - 0.07];
  const keel = [0, -H, L / 2 - 0.02];
  const finTop = [0, 0.18, L / 2 - 0.005];
  const mid = [0, 0.028, 0.02];

  const wingVerts = [];
  const tri = (arr, a, b, c) => arr.push(...a, ...b, ...c);
  tri(wingVerts, nose, wl, mid);        // 左翼
  tri(wingVerts, nose, mid, wr);        // 右翼
  tri(wingVerts, mid, wl, tail);        // 左后翼
  tri(wingVerts, mid, tail, wr);        // 右后翼
  const keelVerts = [];
  tri(keelVerts, nose, keel, mid);      // 龙骨前
  tri(keelVerts, mid, keel, tail);      // 龙骨后
  tri(keelVerts, tail, keel, finTop);   // 垂尾

  const mk = (verts, mat) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = S.shadows;
    return m;
  };
  const wingMat = new THREE.MeshLambertMaterial({
    color: colorHex, side: THREE.DoubleSide, emissive: 0x140A06
  });
  const foldMat = new THREE.MeshLambertMaterial({
    color: dimColor(colorHex, 0.68), side: THREE.DoubleSide, emissive: 0x0E0604
  });

  const inner = new THREE.Group();
  inner.rotation.set(-0.045, 0, 0.16);   // 轻微横滚/抬头：让机翼有明暗、读出立体感
  inner.add(mk(wingVerts, wingMat));
  inner.add(mk(keelVerts, foldMat));
  /* 机脊折线 */
  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.012, L * 0.62),
    new THREE.MeshLambertMaterial({ color: accentHex })
  );
  spine.position.set(0, 0.033, 0.03);
  inner.add(spine);
  g.add(inner);
  return g;
}

const planes = [];
function addPlane(color) {
  const accent = color === 'red' ? 0xFFE1D6 : 0xFFF1CF;
  const g = makePlane(HEX[color], accent);
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.6, 0.6),
    new THREE.MeshBasicMaterial({ map: makeShadowTex(), transparent: true, opacity: 0.5, depthWrite: false })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.006;
  const p = {
    color, group: g, shadow,
    localYaw: 0,
    local: new THREE.Vector3(),   // 在当前格上的局部位置（板坐标系）
    mode: 'board',                // board | fixed | stage | hidden
    fixed: new THREE.Vector3(),
    fixedQuat: new THREE.Quaternion()
  };
  scene.add(g);
  scene.add(shadow);
  planes.push(p);
  return p;
}
/* 红 2 架：1 架在起飞格 ring:0，1 架在红机坪；黄 2 架在黄机坪 */
const planeA = addPlane('red');
const planeB = addPlane('red');
const planeC = addPlane('yellow');
const planeD = addPlane('yellow');

function hangarLocal(color, idx) {
  const a = APRON_DEG[color] * DEG;
  const dx = idx % 2 === 0 ? -0.2 : 0.2;
  const dz = idx < 2 ? -0.2 : 0.2;
  return new THREE.Vector3(
    HANGAR_R * Math.sin(a) + (dx * Math.cos(a) + dz * Math.sin(a)),
    TILE_BOTTOM + 0.05 + PLANE_HOVER,
    -HANGAR_R * Math.cos(a) + (-dx * Math.sin(a) + dz * Math.cos(a))
  );
}
function ringLocal(n) {
  const phi = ringPhi(n);
  return new THREE.Vector3(RING_R * Math.sin(phi), PLANE_Y, -RING_R * Math.cos(phi));
}
function hangarYaw(color) {
  return -APRON_DEG[color] * DEG - Math.PI;
}
planeA.local.copy(ringLocal(0)); planeA.localYaw = -Math.PI / 2 - ringPhi(0);
planeB.local.copy(hangarLocal('red', 0)); planeB.localYaw = hangarYaw('red');
planeC.local.copy(hangarLocal('yellow', 1)); planeC.localYaw = hangarYaw('yellow');
planeD.local.copy(hangarLocal('yellow', 2)); planeD.localYaw = hangarYaw('yellow');

function applyPlaneLocal(p) {
  p.group.position.copy(p.local);
  p.group.rotation.set(0, p.localYaw, 0);
}

/* ============================ 8. 骰子 ============================ */
const DIE_FACES = [3, 4, 1, 6, 2, 5];  // +X -X +Y -Y +Z -Z
function dieFaceMat(v) {
  const SZ = 96;
  const { c, g } = canvas2d(SZ, SZ);
  const grad = g.createLinearGradient(0, 0, SZ, SZ);
  grad.addColorStop(0, '#FFF7E9');
  grad.addColorStop(1, '#E8D5BC');
  g.fillStyle = grad;
  roundRect(g, 2, 2, SZ - 4, SZ - 4, 18); g.fill();
  g.strokeStyle = 'rgba(120,86,52,.35)'; g.lineWidth = 3;
  roundRect(g, 3, 3, SZ - 6, SZ - 6, 17); g.stroke();
  const pips = {
    1: [[0.5, 0.5]], 2: [[0.28, 0.28], [0.72, 0.72]], 3: [[0.26, 0.26], [0.5, 0.5], [0.74, 0.74]],
    4: [[0.28, 0.28], [0.72, 0.28], [0.28, 0.72], [0.72, 0.72]],
    5: [[0.28, 0.28], [0.72, 0.28], [0.5, 0.5], [0.28, 0.72], [0.72, 0.72]],
    6: [[0.28, 0.24], [0.72, 0.24], [0.28, 0.5], [0.72, 0.5], [0.28, 0.76], [0.72, 0.76]]
  }[v];
  g.fillStyle = '#2A1B16';
  for (const [px, py] of pips) {
    g.beginPath(); g.arc(px * SZ, py * SZ, SZ * 0.072, 0, TAU); g.fill();
  }
  return new THREE.MeshLambertMaterial({ map: texFromCanvas(c) });
}
const die = new THREE.Mesh(
  new THREE.BoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE),
  DIE_FACES.map(dieFaceMat)
);
die.castShadow = S.shadows;
die.receiveShadow = true;
scene.add(die);
const dieShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(0.5, 0.5),
  new THREE.MeshBasicMaterial({ map: makeShadowTex(), transparent: true, opacity: 0.55, depthWrite: false })
);
dieShadow.rotation.x = -Math.PI / 2;
dieShadow.position.y = 0.005;
scene.add(dieShadow);

const DIE_HOME = new THREE.Vector3(1.62, DIE_SIZE / 2 + 0.002, 3.02);
const DIE_TOSS_FROM = new THREE.Vector3(0.9, 2.7, 2.2);
die.position.copy(DIE_HOME);
const _q1 = new THREE.Quaternion(), _q2 = new THREE.Quaternion(), _axis = new THREE.Vector3();
function dieFaceNormal(v) {
  const i = DIE_FACES.indexOf(v);
  const n = new THREE.Vector3();
  if (i === 0) n.set(1, 0, 0); else if (i === 1) n.set(-1, 0, 0);
  else if (i === 2) n.set(0, 1, 0); else if (i === 3) n.set(0, -1, 0);
  else if (i === 4) n.set(0, 0, 1); else n.set(0, 0, -1);
  return n;
}
function dieSettleQuat(v) {
  const target = new THREE.Vector3(0.34, 0.86, 0.38).normalize();  // 朝向镜头偏上
  const q = new THREE.Quaternion().setFromUnitVectors(dieFaceNormal(v), target);
  const spin = new THREE.Quaternion().setFromAxisAngle(target, 0.22);
  return q.multiply(spin);
}
function placeDieAtHome(v) {
  die.position.copy(DIE_HOME);
  die.quaternion.copy(dieSettleQuat(v));
  dieShadow.position.set(DIE_HOME.x, 0.005, DIE_HOME.z);
  dieShadow.scale.setScalar(1);
  dieShadow.material.opacity = 0.55;
}

/* ============================ 9. 45° 格子舞台 + 小熊 ============================ */
const stageGroup = new THREE.Group();
stageGroup.position.set(0, TILE_BOTTOM, 0);
stageGroup.visible = false;
scene.add(stageGroup);

let stageTile = null;
let stageGlow = null;
function buildStageTile(n) {
  if (stageTile) { stageGroup.remove(stageTile); stageTile.geometry.dispose(); stageTile = null; }
  if (stageGlow) { stageGroup.remove(stageGlow); stageGlow.geometry.dispose(); stageGlow.material.dispose(); stageGlow = null; }
  const color = colorOfRing(n), kind = kindOf(n);
  const side = dimColor(HEX[color], 0.42);
  const geo = buildTileGeometry([{
    x: 0, z: 0, rot: 0, w: CELL, d: CELL,
    top: TILE_H, bottom: 0,
    uv: uvOfSlot(slotOf(kind, color)), side: [side.r, side.g, side.b]
  }]);
  stageTile = new THREE.Mesh(geo, tileMat);
  stageTile.castShadow = S.shadows;
  stageTile.receiveShadow = true;
  stageGroup.add(stageTile);
  /* 格子光晕（柔和，不爆白） */
  stageGlow = makeGlow(0.8, 0xFFD9A0);
  stageGlow.position.y = TILE_H + 0.008;
  stageGlow.material.opacity = 0.16;
  stageGroup.add(stageGlow);
}

/* 小熊：球体/圆柱低模 + 机长帽 + 围巾（高约 0.62） */
const bear = new THREE.Group();
{
  const brown = new THREE.MeshLambertMaterial({ color: 0x9A6F4B });
  const brownDark = new THREE.MeshLambertMaterial({ color: 0x7A543A });
  const cream = new THREE.MeshLambertMaterial({ color: 0xF0D9B5 });
  const ink = new THREE.MeshLambertMaterial({ color: 0x2A1B16 });
  const navy = new THREE.MeshLambertMaterial({ color: 0x2C3E66 });
  const redM = new THREE.MeshLambertMaterial({ color: 0xD8564C });
  const gold = new THREE.MeshLambertMaterial({ color: 0xE8B65C });

  const add = (geo, mat, x, y, z, rot) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    m.castShadow = S.shadows;
    bear.add(m);
    return m;
  };
  /* 身体 / 头（帽子不压眼睛） */
  add(new THREE.SphereGeometry(0.135, 12, 9), brown, 0, 0.155, 0);
  add(new THREE.SphereGeometry(0.125, 12, 9), brown, 0, 0.375, 0);
  add(new THREE.SphereGeometry(0.062, 10, 8), cream, 0, 0.345, -0.100);    // 吻部
  add(new THREE.SphereGeometry(0.019, 8, 6), ink, 0, 0.365, -0.150);       // 鼻
  add(new THREE.SphereGeometry(0.016, 6, 5), ink, -0.05, 0.412, -0.108);   // 眼
  add(new THREE.SphereGeometry(0.016, 6, 5), ink, 0.05, 0.412, -0.108);
  /* 耳 */
  add(new THREE.SphereGeometry(0.047, 10, 8), brownDark, -0.082, 0.462, 0.004);
  add(new THREE.SphereGeometry(0.047, 10, 8), brownDark, 0.082, 0.462, 0.004);
  /* 手 / 脚 */
  add(new THREE.CapsuleGeometry(0.028, 0.085, 3, 7), brown, -0.128, 0.185, 0, [0, 0, 0.55]);
  add(new THREE.CapsuleGeometry(0.028, 0.085, 3, 7), brown, 0.128, 0.185, 0, [0, 0, -0.55]);
  add(new THREE.SphereGeometry(0.05, 9, 7), brownDark, -0.062, 0.042, -0.018);
  add(new THREE.SphereGeometry(0.05, 9, 7), brownDark, 0.062, 0.042, -0.018);
  /* 围巾 */
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.032, 6, 16), redM);
  scarf.position.set(0, 0.268, 0);
  scarf.rotation.set(Math.PI / 2, 0, 0);
  scarf.castShadow = S.shadows;
  bear.add(scarf);
  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.026), redM);
  scarfTail.position.set(0.095, 0.215, 0.05);
  scarfTail.rotation.set(0.2, 0.1, -0.2);
  bear.add(scarfTail);
  /* 机长帽：小帽体 + 前帽檐 */
  add(new THREE.CylinderGeometry(0.098, 0.106, 0.058, 14, 1), navy, 0, 0.468, 0.012);
  add(new THREE.CylinderGeometry(0.104, 0.104, 0.012, 16, 1), gold, 0, 0.443, 0.012);
  const visor = add(new THREE.SphereGeometry(0.062, 12, 8), navy, 0, 0.451, -0.088);
  visor.scale.set(1.12, 0.2, 0.8);
  /* 帽徽 */
  const badge = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.008, 5, 12), gold);
  badge.position.set(0, 0.468, -0.092);
  badge.rotation.set(-0.5, 0, 0);
  bear.add(badge);
}
bear.position.y = TILE_H;
bear.rotation.y = Math.PI + STAGE_AZIM * DEG;
bear.scale.setScalar(0.001);
bear.visible = false;
stageGroup.add(bear);

/* 舞台脚下的柔和投影（跟着升起） */
const stageShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({ map: makeShadowTex(), transparent: true, opacity: 0.0, depthWrite: false })
);
stageShadow.rotation.x = -Math.PI / 2;
stageShadow.position.y = 0.004;
stageShadow.visible = false;
scene.add(stageShadow);

/* ============================ 10. 主题 ============================ */
const THEMES = {
  cloud: {
    ink: 0x0A1622, fog: 0x0C2334, fogDensity: 0.016,
    hemiSky: 0xBED8FF, hemiGround: 0x2A2038, hemiInt: 0.9,
    sunColor: 0xFFF1DC, sunInt: 1.3,
    tray: 0x3A2A24, mat: 0x1E4A63, disc: 0x9FB6D8, discSide: 0x141C28,
    cloud: true, cloudOpacity: 0.42, cloudTint: 0xFFFFFF, stars: false, sky: 'cloud'
  },
  star: {
    ink: 0x05030C, fog: 0x080515, fogDensity: 0.012,
    hemiSky: 0x9C90E8, hemiGround: 0x1A1030, hemiInt: 0.72,
    sunColor: 0xE6DDFF, sunInt: 1.05,
    tray: 0x1E1832, mat: 0x241C42, disc: 0x8E86C8, discSide: 0x0F0A1C,
    cloud: false, cloudOpacity: 0.0, cloudTint: 0xC8C0FF, stars: true, sky: 'star'
  },
  paper: {
    ink: 0x120D0A, fog: 0x1A1109, fogDensity: 0.014,
    hemiSky: 0xFFE0B8, hemiGround: 0x3A2A1C, hemiInt: 0.95,
    sunColor: 0xFFE7C4, sunInt: 1.2,
    tray: 0x4A3428, mat: 0x6B4A2E, disc: 0xBFAE94, discSide: 0x2A1C12,
    cloud: true, cloudOpacity: 0.22, cloudTint: 0xFFE2B8, stars: false, sky: 'paper'
  }
};
let paperTex = null;

function applyTheme(id, instant) {
  const t = THEMES[id] || THEMES.cloud;
  S.theme = id;
  document.body.dataset.theme = id;
  scene.background.set(t.ink);
  scene.fog = new THREE.FogExp2(t.fog, t.fogDensity);
  hemi.color.set(t.hemiSky); hemi.groundColor.set(t.hemiGround); hemi.intensity = t.hemiInt;
  sun.color.set(t.sunColor); sun.intensity = t.sunInt;
  trayMat.color.set(t.tray);
  matMat.color.set(t.mat);
  discTopMat.color.set(t.disc);
  discSideMat.color.set(t.discSide);
  skyCloud.visible = t.sky === 'cloud';
  skyStar.visible = t.sky === 'star';
  skyPaper.visible = t.sky === 'paper';
  cloudGroup.visible = t.cloud;
  starGroup.visible = t.stars;
  cloudGroup.children.forEach((sp) => {
    sp.material.opacity = t.cloudOpacity;
    sp.material.color.set(t.cloudTint);
  });
  if (id === 'paper') {
    if (!paperTex) paperTex = makePaperTex();
    matMat.map = paperTex;
    matMat.color.set(0xFFFFFF);
    matMat.needsUpdate = true;
  } else if (matMat.map) {
    matMat.map = null;
    matMat.color.set(t.mat);
    matMat.needsUpdate = true;
  }
  document.querySelectorAll('[data-theme-btn]').forEach((b) => {
    b.setAttribute('aria-pressed', String(b.dataset.themeBtn === id));
  });
}

/* ============================ 11. 棋盘位姿（fly 的核心） ============================ */
/* 求板组位姿：把环格局部角 φ 送到聚焦点，且该格切线对齐世界 -Z */
function poseForArc(phi) {
  const theta = Math.PI / 2 + phi;
  const lx = RING_R * Math.sin(phi);
  const lz = -RING_R * Math.cos(phi);
  const ct = Math.cos(theta), st = Math.sin(theta);
  const wx = lx * ct + lz * st;
  const wz = -lx * st + lz * ct;
  return { theta, tx: -wx, tz: -wz };
}
function applyPose(p) {
  boardGroup.rotation.y = p.theta;
  boardGroup.position.set(p.tx, 0, p.tz);
  boardGroup.updateMatrixWorld(true);
  updatePlaneFromBoard();
}
function updatePlaneFromBoard() {
  for (const p of planes) {
    if (p.mode === 'board') {
      p.group.position.copy(boardGroup.localToWorld(p.local.clone()));
      p.group.rotation.set(0, boardGroup.rotation.y + p.localYaw, 0);
    }
  }
}
const FOCUS_WORLD = new THREE.Vector3(0, PLANE_Y, 0);   // focus/fly 期间飞机钉在这

function setStageVisibility(v) {
  stageGroup.visible = v;
  if (!v) stageShadow.visible = false;
}
function stageCenterWorld() {
  return new THREE.Vector3(stageGroup.position.x, stageGroup.position.y + 0.34, stageGroup.position.z);
}

/* ============================ 12. 阶段机 ============================ */
const phases = {};
let curCell = 0;
let targetCell = 4;
let diceValue = 4;
let curPhi = 0;
let stageRise = 0;
const diceQueue = (urlParams.get('dice') || '4,5,3,6,2').split(',').map(Number).filter((n) => n >= 1 && n <= 6);
let diceIdx = 0;

const statusEl = byId('status');
const cardEl = byId('card');
const debugEl = byId('debug');
function setStatus(main, sub) {
  statusEl.innerHTML = `${main}<small>${sub}</small>`;
}
function setPhase(p) {
  S.phase = p;
  document.body.dataset.phase = p;
}
function setCard(open) {
  S.cardOpen = open;
  document.body.dataset.card = open ? 'open' : 'closed';
  cardEl.setAttribute('aria-hidden', open ? 'false' : 'true');
}
function stageAimNdc() {
  const app = byId('app');
  const stageW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--stage-w')) || 40;
  return { nx: (stageW / 100) - 1, ny: 0.18 };
}

/* ---- 各阶段相机 ---- */
const CAM = {
  overview: () => ({
    center: new THREE.Vector3(0, 0.05, 0.24),
    nx: 0, ny: 0.035,
    radius: distForCover(3.70, 0.96, 42),
    elev: 58, azim: 0, fov: 42
  }),
  focus: () => ({
    center: FOCUS_WORLD.clone(),
    nx: 0, ny: 0,
    radius: 3.05, elev: 33, azim: 0, fov: 42
  }),
  roll: () => ({
    center: new THREE.Vector3(DIE_HOME.x, DIE_HOME.y, DIE_HOME.z),
    nx: 0, ny: -0.02,
    radius: 3.2, elev: 44, azim: 10, fov: 42
  }),
  stage: () => ({
    center: new THREE.Vector3(0, TILE_BOTTOM + STAGE_RISE + 0.34, 0),
    nx: stageAimNdc().nx, ny: stageAimNdc().ny,
    radius: distForCover(0.40, 0.52, 42),
    elev: 45, azim: STAGE_AZIM, fov: 42
  })
};

phases.overview = async function (instant) {
  setPhase('overview');
  setCard(false);
  setStageVisibility(false);
  bear.visible = false;
  bear.scale.setScalar(0.001);
  stageGroup.position.y = TILE_BOTTOM;
  stageRise = 0;
  targetGlow.visible = false;
  targetGlow.material.opacity = 0;
  planeGlow.material.opacity = 0.75;
  tileMat.color.setRGB(1, 1, 1);
  discTopMat.color.set(THEMES[S.theme].disc);
  trayMat.color.set(THEMES[S.theme].tray);
  matMat.color.set(THEMES[S.theme].mat);
  planeA.mode = 'board';
  planeA.local.copy(ringLocal(curCell));
  planeA.localYaw = -Math.PI / 2 - ringPhi(curCell);
  planeB.mode = 'board'; planeB.local.copy(hangarLocal('red', 0)); planeB.localYaw = hangarYaw('red');
  planeC.mode = 'board'; planeC.local.copy(hangarLocal('yellow', 1)); planeC.localYaw = hangarYaw('yellow');
  planeD.mode = 'board'; planeD.local.copy(hangarLocal('yellow', 2)); planeD.localYaw = hangarYaw('yellow');
  for (const p of planes) {
    p.group.scale.setScalar(1);
    p.group.visible = true;
    p.shadow.visible = true;
    applyPlaneLocal(p);
  }
  placeDieAtHome(diceValue);
  curPhi = 0;
  const cam = CAM.overview();
  if (instant) {
    applyPose({ theta: 0, tx: 0, tz: 0 });
    camSnap(cam);
  } else {
    await camAnimate(700, cam);
  }
  setStatus('俯瞰', '红方 · 第 ' + (curCell + 1) + ' 格');
  const rollBtn = byId('roll');
  if (rollBtn) rollBtn.disabled = false;
};

phases.roll = async function (instant) {
  setPhase('roll');
  setCard(false);
  const value = diceQueue[diceIdx % diceQueue.length];
  diceIdx++;
  diceValue = value;
  setStatus('摇骰', '骰子 · ' + value + ' 点');
  camAnimate(instant ? 1 : 700, CAM.roll());
  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.7, 1.9, 0.4));
  const qs = dieSettleQuat(value);
  _axis.set(0.42, 0.87, 0.26).normalize();
  const dur = instant ? 1 : 1150;
  await runAnim(dur, (k) => {
    const e = easeOut(Math.min(1, k / 0.62));
    const fall = 1 - e;
    const bounce = Math.abs(Math.sin(k * Math.PI * 3.1)) * (1 - k) * 0.36;
    die.position.set(
      lerp(DIE_TOSS_FROM.x, DIE_HOME.x, e),
      DIE_HOME.y + fall * 2.4 + bounce,
      lerp(DIE_TOSS_FROM.z, DIE_HOME.z, e)
    );
    _q1.copy(q0).multiply(_q2.setFromAxisAngle(_axis, (1 - smoothstep(0.5, 1, k)) * 7.5));
    die.quaternion.copy(_q1);
    die.quaternion.slerp(qs, smoothstep(0.58, 1, k));
    dieShadow.position.set(die.position.x, 0.005, die.position.z);
    dieShadow.scale.setScalar(clamp(1.15 - (die.position.y - DIE_HOME.y) * 0.4, 0.5, 1.2));
    dieShadow.material.opacity = clamp(0.55 - (die.position.y - DIE_HOME.y) * 0.18, 0.12, 0.55);
  });
  die.position.copy(DIE_HOME);
  die.quaternion.copy(qs);
  dieShadow.position.set(DIE_HOME.x, 0.005, DIE_HOME.z);
  dieShadow.scale.setScalar(1);
  dieShadow.material.opacity = 0.55;
  targetCell = mod(curCell + value);
  buildStageTile(targetCell);
};

phases.focus = async function (instant) {
  setPhase('focus');
  setCard(false);
  setStatus('聚焦', '镜头落到红方飞机 · 屏幕中心');
  const phi0 = ringPhi(curCell);
  const fromPose = {
    theta: boardGroup.rotation.y,
    tx: boardGroup.position.x,
    tz: boardGroup.position.z
  };
  const toPose = poseForArc(phi0);
  const target = CAM.focus();
  if (instant) {
    applyPose(toPose);
    camSnap(target);
    planeGlow.material.opacity = 0.8;
    return;
  }
  const camFrom = {
    center: camState.center.clone(), nx: camState.nx, ny: camState.ny,
    radius: camState.radius, elev: camState.elev, azim: camState.azim, fov: camState.fov
  };
  await runAnim(950, (k) => {
    const e = easeInOut(k);
    applyPose({
      theta: lerp(fromPose.theta, toPose.theta, e),
      tx: lerp(fromPose.tx, toPose.tx, e),
      tz: lerp(fromPose.tz, toPose.tz, e)
    });
    /* 镜头中心持续跟飞机：飞机始终在屏幕中心 */
    camState.center.copy(planeA.group.position);
    camState.nx = lerp(camFrom.nx, target.nx, e);
    camState.ny = lerp(camFrom.ny, target.ny, e);
    camState.radius = lerp(camFrom.radius, target.radius, e);
    camState.elev = lerp(camFrom.elev, target.elev, e);
    camState.azim = lerp(camFrom.azim, target.azim, e);
    camState.fov = lerp(camFrom.fov, target.fov, e);
    applyCamera();
  });
  planeGlow.material.opacity = 0.8;
};

/* fly：相机 / 飞机钉死，棋盘组旋转 + 平移（跑步机错觉） */
phases.fly = async function (instant, holdAt) {
  setPhase('fly');
  setCard(false);
  const steps = mod(targetCell - curCell) || 1;
  const phi0 = ringPhi(curCell);
  const phi1 = phi0 + steps * (TAU / RING_N);
  /* 飞机钉在聚焦点 */
  planeA.mode = 'fixed';
  planeA.fixed.copy(FOCUS_WORLD);
  planeA.fixedQuat.copy(planeA.group.quaternion);
  planeA.group.position.copy(FOCUS_WORLD);
  planeA.group.quaternion.copy(planeA.fixedQuat);
  /* 相机冻结 */
  if (!camLock) {
    camLock = { pos: camera.position.clone(), quat: camera.quaternion.clone(), fov: camera.fov };
  }
  targetGlow.visible = true;
  targetGlow.position.set(RING_R * Math.sin(phi1), TILE_TOP + 0.012, -RING_R * Math.cos(phi1));
  targetGlow.material.opacity = 0;
  planeGlow.material.opacity = 0.9;
  setStatus('飞行', '飞机不动 · 棋盘旋转平移 · ' + steps + ' 格');
  lockStats.reset();

  const from = curPhi;
  const to = phi1;
  const ms = instant ? 1 : 2050;
  const part = holdAt === undefined ? 1 : holdAt;
  await runAnim(ms, (k) => {
    const s = clamp(k, 0, 1) * part;
    curPhi = lerp(from, to, easeInOut(s));
    applyPose(poseForArc(curPhi));
    targetGlow.material.opacity = 0.3 + 0.5 * smoothstep(0.25, 1, s);
  });
  curPhi = holdAt === undefined ? to : lerp(from, to, easeInOut(holdAt));
  applyPose(poseForArc(curPhi));
  if (holdAt === undefined) {
    curCell = targetCell;
    targetGlow.material.opacity = 0.85;
  }
};

phases.cell = async function (instant, fromPartial) {
  setPhase('cell');
  setCard(false);
  setStatus('格子舞台', '45° 俯冲 · 目标格升起');
  if (fromPartial) {
    curPhi = ringPhi(targetCell);
    applyPose(poseForArc(curPhi));
    curCell = targetCell;
  }
  camLock = null;
  stageGroup.position.set(0, TILE_BOTTOM, 0);
  stageGroup.visible = true;
  stageShadow.visible = true;
  stageShadow.material.opacity = 0;
  const target = CAM.stage();
  const camFrom = {
    center: camState.center.clone(), nx: camState.nx, ny: camState.ny,
    radius: camState.radius, elev: camState.elev, azim: camState.azim, fov: camState.fov
  };
  const dur = instant ? 1 : 900;
  const planeStart = planeA.group.position.clone();
  await Promise.all([
    runAnim(dur, (k) => {
      const e = easeInOut(k);
      const dim = lerp(1, 0.18, smoothstep(0, 0.75, k));
      tileMat.color.setRGB(dim, dim, dim);
      discTopMat.color.copy(new THREE.Color(THEMES[S.theme].disc).multiplyScalar(lerp(1, 0.36, k)));
      trayMat.color.copy(new THREE.Color(THEMES[S.theme].tray).multiplyScalar(lerp(1, 0.5, k)));
      matMat.color.copy(new THREE.Color(THEMES[S.theme].mat).multiplyScalar(lerp(1, 0.5, k)));
      /* 舞台格升起 */
      stageRise = lerp(0, STAGE_RISE, e);
      stageGroup.position.y = TILE_BOTTOM + stageRise;
      stageShadow.position.set(0, 0.004, 0);
      stageShadow.material.opacity = lerp(0, 0.5, smoothstep(0.2, 1, k));
      stageShadow.scale.setScalar(lerp(1, 0.7, e));
      /* 相机俯冲到 45° + 瞄向左栏 */
      camState.center.copy(planeStart.clone().lerp(stageCenterWorld(), easeInOut(k)));
      camState.nx = lerp(camFrom.nx, target.nx, e);
      camState.ny = lerp(camFrom.ny, target.ny, e);
      camState.radius = lerp(camFrom.radius, target.radius, e);
      camState.elev = lerp(camFrom.elev, 45, e);
      camState.azim = lerp(camFrom.azim, target.azim, e);
      camState.fov = lerp(camFrom.fov, target.fov, e);
      applyCamera();
      /* 飞机落地淡出 */
      planeA.group.position.set(planeStart.x, planeStart.y + e * 0.5, planeStart.z);
      planeA.group.scale.setScalar(lerp(1, 0.001, smoothstep(0.15, 0.85, k)));
      planeA.group.visible = k < 0.92;
      planeA.shadow.visible = false;
      planeGlow.material.opacity = lerp(0.9, 0, smoothstep(0, 0.6, k));
    }),
    runAnim(dur, (k) => {
      targetGlow.material.opacity = lerp(0.85, 0, smoothstep(0, 0.5, k));
    })
  ]);
  stageRise = STAGE_RISE;
  stageGroup.position.y = TILE_BOTTOM + stageRise;
  stageShadow.material.opacity = 0.5;
  stageShadow.scale.setScalar(0.7);
  planeA.group.visible = false;
  planeA.mode = 'hidden';
  planeGlow.material.opacity = 0;
  curPhi = ringPhi(curCell);
  applyPose(poseForArc(curPhi));
  camSnap(CAM.stage());
};

phases.bear = async function (instant) {
  setPhase('bear');
  bear.visible = true;
  bear.scale.setScalar(0.001);
  const yaw = Math.PI + STAGE_AZIM * DEG;
  bear.rotation.set(0, yaw, 0);
  const ms = instant ? 1 : 620;
  await runAnim(ms, (k) => {
    const e = k < 0.6 ? easeOut(k / 0.6) * 1.14 : 1.14 - (k - 0.6) / 0.4 * 0.14;
    bear.scale.setScalar(clamp(e, 0.001, 1.15));
    bear.rotation.y = yaw + Math.sin(k * Math.PI * 2) * 0.06;
  });
  bear.scale.setScalar(1);
  bear.rotation.y = yaw;
  setCard(true);
  updateCardCopy();
  setStatus('小熊出现', '右侧内容卡 · 示意文案');
};

function updateCardCopy() {
  const kind = kindOf(targetCell);
  const c = colorOfRing(targetCell);
  const colorName = { red: '小红', yellow: '小黄', blue: '小蓝', green: '小绿' }[c];
  const kicker = document.querySelector('[data-test="prompt-kicker"]');
  if (kicker) kicker.textContent = `第 ${targetCell + 1} 格 · ${KIND_LABEL[kind] || '普通'}`;
  const title = document.querySelector('[data-test="prompt-title"]');
  if (title) title.textContent = CARD_COPY[kind] || '今晚最想一起做的一件小事？';
  const meta = document.querySelector('.card-meta');
  if (meta) meta.textContent = `${(KIND_LABEL[kind] || '普通').toUpperCase()} · 3★ · 归属：${colorName} · 今晚限定 · 示意文案`;
  const mark = document.querySelector('[data-test="card-mark"]');
  if (mark) mark.textContent = GLYPH[kind] || '·';
}
const CARD_COPY = {
  truth: '今晚最想一起做的一件小事？',
  dare: '今晚最想一起做的一件小事？',
  touch: '回想一次「被对方照顾到」的瞬间，说给我听？',
  thermo: '此刻的亲密温度，1 到 10 打几分？少的那几分差在哪？',
  wheel: '转盘转到什么，今晚就做什么？',
  fate: '命运格：两张卡二选一，今晚先不选也行。',
  takeoff: '起飞格：把今晚的第一句话说给对方听。',
  fly: '飞点：说说此刻心里飞过去的那个念头？',
  forbid: '禁跳格：停一下，抱一下再走。',
  entry: '进航格：快到终点了，说一句「想和你到终点」。',
  ring: '今晚最想一起做的一件小事？'
};

phases.ret = async function (instant) {
  setPhase('return');
  setCard(false);
  const camFrom = {
    center: camState.center.clone(), nx: camState.nx, ny: camState.ny,
    radius: camState.radius, elev: camState.elev, azim: camState.azim, fov: camState.fov
  };
  const poseFrom = {
    theta: boardGroup.rotation.y, tx: boardGroup.position.x, tz: boardGroup.position.z
  };
  /* 旋转取最短路径回 0 */
  const dTheta = ((0 - poseFrom.theta + Math.PI) % TAU + TAU) % TAU - Math.PI;
  const target = CAM.overview();
  const dur = instant ? 1 : 900;
  await runAnim(dur, (k) => {
    const e = easeInOut(k);
    const dim = lerp(0.18, 1, e);
    tileMat.color.setRGB(dim, dim, dim);
    discTopMat.color.copy(new THREE.Color(THEMES[S.theme].disc).multiplyScalar(lerp(0.36, 1, e)));
    trayMat.color.copy(new THREE.Color(THEMES[S.theme].tray).multiplyScalar(lerp(0.5, 1, e)));
    matMat.color.copy(new THREE.Color(THEMES[S.theme].mat).multiplyScalar(lerp(0.5, 1, e)));
    stageRise = lerp(STAGE_RISE, 0, e);
    stageGroup.position.y = TILE_BOTTOM + stageRise;
    stageShadow.material.opacity = lerp(0.5, 0, e);
    bear.scale.setScalar(clamp(lerp(1, 0.001, smoothstep(0.1, 0.7, k)), 0.001, 1));
    camState.center.copy(camFrom.center.clone().lerp(target.center, e));
    camState.nx = lerp(camFrom.nx, target.nx, e);
    camState.ny = lerp(camFrom.ny, target.ny, e);
    camState.radius = lerp(camFrom.radius, target.radius, e);
    camState.elev = lerp(camFrom.elev, target.elev, e);
    camState.azim = lerp(camFrom.azim, target.azim, e);
    camState.fov = lerp(camFrom.fov, target.fov, e);
    applyCamera();
    /* 棋盘位姿回正（回到 identity，不是 poseForArc(0)） */
    applyPose({
      theta: poseFrom.theta + dTheta * e,
      tx: poseFrom.tx * (1 - e),
      tz: poseFrom.tz * (1 - e)
    });
  });
  bear.visible = false;
  setStageVisibility(false);
  targetGlow.visible = false;
  stageGroup.position.y = TILE_BOTTOM;
  stageRise = 0;
  tileMat.color.setRGB(1, 1, 1);
  /* 板姿回正后，把飞机摆到目标格 */
  applyPose({ theta: 0, tx: 0, tz: 0 });
  planeA.mode = 'board';
  planeA.group.visible = true;
  planeA.group.scale.setScalar(1);
  planeA.shadow.visible = true;
  planeA.local.copy(ringLocal(curCell));
  planeA.localYaw = -Math.PI / 2 - ringPhi(curCell);
  applyPlaneLocal(planeA);
  planeGlow.material.opacity = 0.75;
  planeGlow.position.set(planeA.group.position.x, TILE_TOP + 0.014, planeA.group.position.z);
  camSnap(target);
  setStatus('俯瞰', '红方 · 第 ' + (curCell + 1) + ' 格');
  setPhase('overview');
};

/* ============================ 13. 对外操作 ============================ */
async function playChain() {
  if (S.busy) return false;
  S.busy = true;
  byId('roll').disabled = true;
  try {
    if (S.phase !== 'overview') await phases.overview(true);
    await phases.roll(false);
    await phases.focus(false);
    await phases.fly(false);
    await phases.cell(false, false);
    await phases.bear(false);
    await waitCardOr(5200);
    await phases.ret(false);
  } finally {
    S.busy = false;
    byId('roll').disabled = false;
  }
  return true;
}
let cardResolve = null;
function waitCardOr(ms) {
  return new Promise((res) => {
    cardResolve = res;
    const t = setTimeout(() => { cardResolve = null; res(); }, S.reduced ? 1200 : ms);
    const once = () => { clearTimeout(t); cardResolve = null; res(); };
    cardEl.querySelectorAll('[data-test="prompt-done"],[data-test="prompt-skip"],[data-test="prompt-back"]')
      .forEach((b) => b.addEventListener('click', once, { once: true }));
  });
}
async function stepOnce() {
  if (S.busy) return false;
  S.busy = true;
  try {
    const p = S.phase;
    if (p === 'overview') await phases.roll(false);
    else if (p === 'roll') await phases.focus(false);
    else if (p === 'focus') await phases.fly(false);
    else if (p === 'fly') await phases.cell(false, false);
    else if (p === 'cell') await phases.bear(false);
    else await phases.ret(false);
  } finally {
    S.busy = false;
  }
  return true;
}
async function resetAll() {
  anims.length = 0;
  camLock = null;
  diceIdx = 0;
  curCell = 0;
  targetCell = mod(curCell + diceQueue[0]);
  diceValue = diceQueue[0];
  bear.visible = false;
  bear.scale.setScalar(0.001);
  setCard(false);
  await phases.overview(true);
  return true;
}
/* 跳到某阶段落定态，供截图/自测 */
async function goPhase(name) {
  if (S.busy) return false;
  S.busy = true;
  try {
    diceIdx = 0;
    curCell = 0;
    targetCell = mod(0 + diceQueue[0]);
    diceValue = diceQueue[0];
    await phases.overview(true);
    if (name === 'overview') return true;
    await phases.roll(true);
    if (name === 'roll') return true;
    await phases.focus(true);
    if (name === 'focus') return true;
    if (name === 'fly') { await phases.fly(false, 0.55); return true; }
    await phases.fly(true);
    await phases.cell(true, false);
    if (name === 'cell') return true;
    await phases.bear(true);
    if (name === 'bear') return true;
    await phases.ret(true);
  } finally {
    S.busy = false;
  }
  return true;
}

/* ============================ 14. 帧率 / 探针 ============================ */
const perf = {
  phase: 'boot', frames: 0, sum: 0, max: 0, long25: 0, long50: 0, since: 0,
  updateSum: 0, renderSum: 0, phases: {}
};
const lockStats = {
  samples: 0, maxAbsX: 0, maxAbsY: 0,
  reset() { this.samples = 0; this.maxAbsX = 0; this.maxAbsY = 0; }
};
let lastCalls = 0, lastTris = 0;

function markPhase(name) {
  if (perf.frames > 0 && perf.phase) {
    perf.phases[perf.phase] = {
      frames: perf.frames,
      avgMs: +(perf.sum / perf.frames).toFixed(2),
      maxMs: +perf.max.toFixed(2),
      long25: perf.long25, long50: perf.long50,
      ms: +(performance.now() - perf.since).toFixed(0),
      calls: lastCalls, tris: lastTris,
      updateMs: +(perf.updateSum / perf.frames).toFixed(2),
      renderMs: +(perf.renderSum / perf.frames).toFixed(2)
    };
  }
  perf.phase = name;
  perf.frames = 0; perf.sum = 0; perf.max = 0; perf.long25 = 0; perf.long50 = 0;
  perf.updateSum = 0; perf.renderSum = 0;
  perf.since = performance.now();
}
/* 阶段切换统一打点 */
for (const key of Object.keys(phases)) {
  const fn = phases[key];
  phases[key] = async function (...args) {
    markPhase(key);
    return fn.apply(this, args);
  };
}

function perfSnapshot() {
  const cur = perf.frames > 0 ? {
    frames: perf.frames,
    avgMs: +(perf.sum / perf.frames).toFixed(2),
    maxMs: +perf.max.toFixed(2),
    long25: perf.long25, long50: perf.long50,
    fps: +((perf.frames * 1000) / Math.max(1, performance.now() - perf.since)).toFixed(1),
    updateMs: +(perf.updateSum / perf.frames).toFixed(2),
    renderMs: +(perf.renderSum / perf.frames).toFixed(2),
    ms: +(performance.now() - perf.since).toFixed(0)
  } : null;
  const vp = viewport();
  const dpr = renderer.getPixelRatio();
  return {
    phase: perf.phase, current: cur, phases: perf.phases,
    render: {
      calls: lastCalls, triangles: lastTris,
      cssPx: vp.w * vp.h, pixels: Math.round(vp.w * vp.h * dpr * dpr)
    },
    quality: S.quality, dpr, shadows: renderer.shadowMap.enabled,
    antialias: renderer.getContext().getContextAttributes().antialias
  };
}

function probe() {
  const p = planeA.group.position.clone();
  const ndc = p.clone().project(camera);
  return {
    phase: S.phase,
    camera: { pos: camera.position.toArray().map((v) => +v.toFixed(4)), fov: camera.fov, locked: !!camLock },
    plane: { world: p.toArray().map((v) => +v.toFixed(4)), ndc: [+ndc.x.toFixed(5), +ndc.y.toFixed(5)] },
    board: {
      theta: +boardGroup.rotation.y.toFixed(5),
      tx: +boardGroup.position.x.toFixed(5),
      tz: +boardGroup.position.z.toFixed(5)
    },
    lock: { ...lockStats },
    cell: { cur: curCell, target: targetCell, dice: diceValue },
    stage: { visible: stageGroup.visible, rise: +stageRise.toFixed(3), bear: +bear.scale.x.toFixed(3) },
    card: S.cardOpen
  };
}

/* ============================ 15. 尺寸 / 主题 / 交互 ============================ */
function resize() {
  const v = viewport();
  const dpr = S.dprParam || Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(S.quality === 'low' ? Math.min(1, dpr) : dpr);
  renderer.setSize(v.w, v.h, false);
  camera.aspect = v.w / Math.max(1, v.h);
  camera.updateProjectionMatrix();
  applyCamera();
}
window.addEventListener('resize', resize, { passive: true });
if (window.ResizeObserver) new ResizeObserver(() => resize()).observe(byId('app'));

document.querySelectorAll('[data-theme-btn]').forEach((b) => {
  b.addEventListener('click', () => { applyTheme(b.dataset.themeBtn, true); });
});
byId('roll').addEventListener('click', () => playChain());
byId('chain').addEventListener('click', () => playChain());
byId('step').addEventListener('click', () => stepOnce());
byId('reset').addEventListener('click', () => resetAll());
['prompt-done', 'prompt-skip', 'prompt-back'].forEach((t) => {
  const el = document.querySelector(`[data-test="${t}"]`);
  if (el) el.addEventListener('click', () => { if (cardResolve) cardResolve(); else phases.ret(false); });
});

/* 自适应降级：连续 2 个窗口 avg > 22ms → 先降 DPR，再关阴影 */
let adaptTimer = 0, badWindows = 0;
function adaptCheck(dt) {
  if (!S.adapt) return;
  adaptTimer += dt;
  if (adaptTimer < 1200) return;
  const avg = perf.sum / Math.max(1, perf.frames);
  adaptTimer = 0;
  const slow = avg > 22;
  badWindows = slow ? badWindows + 1 : 0;
  if (badWindows >= 2) {
    badWindows = 0;
    if (S.quality !== 'low') {
      S.quality = 'low';
      renderer.setPixelRatio(1);
      renderer.shadowMap.enabled = false;
      sun.castShadow = false;
      S.shadows = false;
      resize();
      console.info('[board3d] 自适应降级 → low（dpr=1 / 阴影关闭）');
    }
  }
}

/* ============================ 16. 主循环 ============================ */
let last = 0, running = true, fpsShown = 0;
function frame(now) {
  if (!running) return;
  requestAnimationFrame(frame);
  if (!last) { last = now; return; }
  const rawDt = now - last;
  let dt = rawDt;
  last = now;
  if (dt > 120) dt = 120;   /* 动画步进钳制；统计用 rawDt */
  const tA = performance.now();

  tickAnims(dt);

  if (cloudGroup.visible) {
    for (const sp of cloudGroup.children) {
      sp.position.x += Math.sin(now * 0.00012 + sp.position.z) * 0.0016;
      sp.position.z -= 0.0018;
      if (sp.position.z < -13) sp.position.z = 13;
    }
  }
  if (starGroup.visible) starGroup.rotation.y = now * 0.000018;

  updatePlaneFromBoard();

  if (planeA.group.visible) {
    planeGlow.position.set(planeA.group.position.x, TILE_TOP + 0.014, planeA.group.position.z);
  }
  if (bear.visible) {
    bear.position.y = TILE_H + Math.sin(now * 0.0032) * 0.012;
    bear.rotation.z = Math.sin(now * 0.0016) * 0.03;
  }

  if (S.phase !== 'fly' || !camLock) applyCamera();

  /* fly 探针：飞机是否钉在屏幕中心 */
  if (S.phase === 'fly') {
    const ndc = planeA.group.position.clone().project(camera);
    lockStats.samples++;
    lockStats.maxAbsX = Math.max(lockStats.maxAbsX, Math.abs(ndc.x));
    lockStats.maxAbsY = Math.max(lockStats.maxAbsY, Math.abs(ndc.y));
  }

  const tB = performance.now();
  renderer.render(scene, camera);
  const tC = performance.now();
  const tUpdate = tB - tA, tRender = tC - tB;
  lastCalls = renderer.info.render.calls;
  lastTris = renderer.info.render.triangles;

  perf.frames++;
  perf.sum += rawDt;
  perf.max = Math.max(perf.max, rawDt);
  if (rawDt > 25) perf.long25++;
  if (rawDt > 50) perf.long50++;
  perf.updateSum += tUpdate;
  perf.renderSum += tRender;
  adaptCheck(rawDt);

  if (S.debug) {
    fpsShown += rawDt;
    if (fpsShown > 300) {
      fpsShown = 0;
      const pr = probe();
      const avg = perf.sum / Math.max(1, perf.frames);
      debugEl.textContent = [
        'phase  ' + S.phase + '  dice ' + diceValue + '  cell ' + curCell + '→' + targetCell,
        'fps    ' + (1000 / Math.max(1, avg)).toFixed(0) + '  avg ' + avg.toFixed(0) + 'ms  max ' + perf.max.toFixed(0) + 'ms',
        'draw   ' + lastCalls + ' calls / ' + lastTris + ' tris  dpr ' + renderer.getPixelRatio() + '  ' + S.quality,
        'cam    r' + camState.radius.toFixed(2) + ' e' + camState.elev.toFixed(0) + '° a' + camState.azim.toFixed(0) + '° fov' + camState.fov.toFixed(0),
        'board  θ' + boardGroup.rotation.y.toFixed(3) + ' t(' + boardGroup.position.x.toFixed(2) + ',' + boardGroup.position.z.toFixed(2) + ')',
        'plane  ndc ' + pr.plane.ndc.join(', ') + '  lock ' + lockStats.maxAbsX.toFixed(4) + '/' + lockStats.maxAbsY.toFixed(4)
      ].join('\n');
    }
  }
}

/* ============================ 17. 启动 ============================ */
function boot() {
  resize();
  applyTheme(S.theme, false);
  document.body.dataset.reduced = S.reduced ? '1' : '0';
  if (S.debug) document.body.classList.add('ui-debug');
  curCell = 0;
  targetCell = mod(0 + diceQueue[0]);
  diceValue = diceQueue[0];
  placeDieAtHome(diceValue);
  applyPose({ theta: 0, tx: 0, tz: 0 });
  camSnap(CAM.overview());
  setStatus('俯瞰', '红方 · 第 1 格');
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  markPhase('overview');
  requestAnimationFrame(frame);
  S.ready = true;
  document.body.dataset.ready = '1';
  console.info(`[board3d] ${VERSION} ready · three r${THREE.REVISION} · theme=${S.theme} · reduced=${S.reduced}`);
}

document.addEventListener('visibilitychange', () => {
  running = !document.hidden;
  last = 0;
  if (running) requestAnimationFrame(frame);
});

window.__board3d = {
  version: VERSION,
  get ready() { return S.ready; },
  go: goPhase,
  play: playChain,
  step: stepOnce,
  reset: resetAll,
  setTheme: (id) => { applyTheme(id, true); },
  phase: () => S.phase,
  perf: perfSnapshot,
  probe,
  state: () => ({ ...S, curCell, targetCell, diceValue, curPhi, theme: S.theme })
};

boot();

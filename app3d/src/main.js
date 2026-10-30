import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import './style.css';

/* ------------------------------------------------------------------ */
/* 数据：纵切原型只用 12 格 + 12 张卡                                  */
/* ------------------------------------------------------------------ */
const TILES = [
  { type: 'start', icon: '🚩', label: '起航' },
  { type: 'truth', icon: '💜', label: '真心话' },
  { type: 'dare', icon: '🔥', label: '大冒险' },
  { type: 'truth', icon: '💜', label: '真心话' },
  { type: 'event', icon: '🎁', label: '事件' },
  { type: 'dare', icon: '🔥', label: '大冒险' },
  { type: 'safe', icon: '🛡', label: '安全屋' },
  { type: 'truth', icon: '💜', label: '真心话' },
  { type: 'duel', icon: '⚔️', label: '对撞' },
  { type: 'dare', icon: '🔥', label: '大冒险' },
  { type: 'truth', icon: '💜', label: '真心话' },
  { type: 'finale', icon: '🏁', label: '灯塔' }
];

const TRUTHS = [
  '你第一次见我时，最先注意到的是什么？',
  '你最喜欢我哪个瞬间？',
  '你偷偷收藏过我的什么东西？',
  '你最想和我一起去哪里？',
  '你最近一次心动，是因为我做了什么？',
  '你最想听我对你说哪句话？',
  '如果今晚只能问我一个问题，你会问什么？',
  '你手机里最舍不得删的一张照片是什么？'
];

const DARES = [
  '看着对方的眼睛，认真夸 3 个优点，不能重复。',
  '用一句话描述你心里的我，中间不能停顿。',
  '和对方十指相扣 10 秒，谁先松手谁喝一口水。',
  '模仿对方一个习惯动作，让 TA 猜是什么。',
  '给对方一个 5 秒的拥抱，然后说一句“今晚很好”。',
  '说一件你一直想为对方做、但还没做的事。',
  '用三个词形容你们现在的关系，并解释其中一个。',
  '把手机放下，和对方对视 15 秒，不许笑。'
];

const PLAYERS = [
  { name: '他', color: 0xf3c879, css: 'var(--gold)', emoji: '♂' },
  { name: '她', color: 0xff5f9e, css: 'var(--rose)', emoji: '♀' }
];

const TILE_COLORS = {
  start: 0x6d4bd8,
  truth: 0x9b6cff,
  dare: 0xff5f9e,
  event: 0xf3c879,
  safe: 0x3fd6c0,
  duel: 0xff8a3d,
  finale: 0xffd166
};

const ACT_NAMES = ['起航', '升温', '靠岸'];

/* ------------------------------------------------------------------ */
/* 状态                                                               */
/* ------------------------------------------------------------------ */
let forcedRoll = null;
const state = {
  started: false,
  phase: 'idle', // idle | rolling | moving | card | event | end
  turn: 0,
  heat: 0,
  act: 1,
  positions: [0, 0],
  winner: null,
  card: null
};

const $ = (id) => document.getElementById(id);
const dom = {
  canvas: $('scene'),
  rollBtn: $('rollBtn'),
  rollText: $('rollText'),
  hint: $('hint'),
  diceBadge: $('diceBadge'),
  turnPill: $('turnPill'),
  heatNum: $('heatNum'),
  heatBar: $('heatBar'),
  actPill: $('actPill'),
  players: $('players'),
  cardMask: $('cardMask'),
  cardKicker: $('cardKicker'),
  cardTitle: $('cardTitle'),
  cardText: $('cardText'),
  cardDone: $('cardDone'),
  cardSkip: $('cardSkip'),
  eventMask: $('eventMask'),
  eventKicker: $('eventKicker'),
  eventTitle: $('eventTitle'),
  eventText: $('eventText'),
  eventDone: $('eventDone'),
  endMask: $('endMask'),
  endTitle: $('endTitle'),
  endText: $('endText'),
  againBtn: $('againBtn'),
  intro: $('intro'),
  startBtn: $('startBtn'),
  toast: $('toast'),
  fatal: $('fatal')
};

/* ------------------------------------------------------------------ */
/* Three.js 场景                                                      */
/* ------------------------------------------------------------------ */
let renderer, scene, camera, clock;
let boardGroup, tileMeshes = [], tokens = [];
let diceGroup, diceCube, diceTargetBase;
let ringMesh, centerGlow;
let lookTarget = new THREE.Vector3(0, 0.1, 0);
let currentLook = new THREE.Vector3(0, 0.1, 0);
let elapsed = 0;
let diceBusy = false;

const TILE_COUNT = TILES.length;
const TILE_RX = 3.55;
const TILE_RZ = 2.25;
const DICE_BASE = new THREE.Vector3(1.55, 0.22, 0.8);

function init3D() {
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: dom.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    dom.fatal.hidden = false;
    throw err;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070411);
  scene.fog = new THREE.FogExp2(0x070411, 0.032);

  camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 90);
  camera.position.set(0, 17.0, 13.0);

  clock = new THREE.Clock();

  addLights();
  addStars();
  addOcean();
  buildBoard();
  buildTokens();
  buildDice();

  window.addEventListener('resize', onResize);
  animate();
}

function addLights() {
  scene.add(new THREE.HemisphereLight(0x9d7bff, 0x06030d, 1.45));

  const key = new THREE.DirectionalLight(0xffe6c0, 2.4);
  key.position.set(4.5, 8, 6);
  scene.add(key);

  const rim = new THREE.PointLight(0xff5f9e, 32, 16, 2);
  rim.position.set(-5, 3, -3);
  scene.add(rim);

  const gold = new THREE.PointLight(0xf3c879, 22, 14, 2);
  gold.position.set(4, 2.5, 3);
  scene.add(gold);

  const violet = new THREE.PointLight(0x7d4dff, 18, 14, 2);
  violet.position.set(0, 3, -5);
  scene.add(violet);
}

function addStars() {
  const geo = new THREE.BufferGeometry();
  const n = 700;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 18 + Math.random() * 26;
    const a = Math.random() * Math.PI * 2;
    const y = Math.random() * 18 - 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xcbb7ff,
    size: 0.045,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
    sizeAttenuation: true
  });
  scene.add(new THREE.Points(geo, mat));

  const near = new THREE.BufferGeometry();
  const m = 90;
  const p2 = new Float32Array(m * 3);
  for (let i = 0; i < m; i++) {
    p2[i * 3] = (Math.random() - 0.5) * 16;
    p2[i * 3 + 1] = Math.random() * 4;
    p2[i * 3 + 2] = (Math.random() - 0.5) * 12;
  }
  near.setAttribute('position', new THREE.BufferAttribute(p2, 3));
  scene.add(new THREE.Points(near, new THREE.PointsMaterial({
    color: 0xf3c879, size: 0.025, transparent: true, opacity: 0.5, depthWrite: false
  })));
}

function addOcean() {
  const geo = new THREE.PlaneGeometry(70, 70, 1, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x05030d,
    roughness: 0.22,
    metalness: 0.78
  });
  const sea = new THREE.Mesh(geo, mat);
  sea.rotation.x = -Math.PI / 2;
  sea.position.y = -1.15;
  scene.add(sea);

  const grid = new THREE.GridHelper(50, 50, 0x2b1648, 0x120a24);
  grid.position.y = -1.14;
  grid.material.transparent = true;
  grid.material.opacity = 0.17;
  scene.add(grid);

  const glowTex = radialTexture();
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 12),
    new THREE.MeshBasicMaterial({
      map: glowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.55;
  scene.add(glow);
}

function radialTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 256, 20, 256, 256, 250);
  g.addColorStop(0, 'rgba(255,95,158,.34)');
  g.addColorStop(0.35, 'rgba(124,77,255,.20)');
  g.addColorStop(0.7, 'rgba(80,36,140,.07)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function tilePosition(i) {
  const a = Math.PI / 2 + (i * Math.PI * 2) / TILE_COUNT;
  return new THREE.Vector3(Math.cos(a) * TILE_RX, 0.18, Math.sin(a) * TILE_RZ);
}

function tileAngle(i) {
  return Math.PI / 2 + (i * Math.PI * 2) / TILE_COUNT;
}

function buildBoard() {
  boardGroup = new THREE.Group();
  scene.add(boardGroup);

  const base = new THREE.Mesh(
    new RoundedBoxGeometry(8.0, 0.48, 9.8, 5, 0.24),
    new THREE.MeshPhysicalMaterial({
      color: 0x140b26,
      roughness: 0.28,
      metalness: 0.5,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.65,
      clearcoatRoughness: 0.2
    })
  );
  base.position.y = -0.35;
  boardGroup.add(base);

  const glass = new THREE.Mesh(
    new RoundedBoxGeometry(7.55, 0.08, 9.35, 4, 0.10),
    new THREE.MeshPhysicalMaterial({
      color: 0x5b2e9e,
      roughness: 0.08,
      metalness: 0.25,
      transparent: true,
      opacity: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08
    })
  );
  glass.position.y = -0.08;
  boardGroup.add(glass);

  const rim = new THREE.LineSegments(
    new THREE.EdgesGeometry(new RoundedBoxGeometry(8.02, 0.5, 9.82, 3, 0.24)),
    new THREE.LineBasicMaterial({ color: 0xf3c879, transparent: true, opacity: 0.28 })
  );
  rim.position.y = -0.35;
  boardGroup.add(rim);

  const center = new THREE.Mesh(
    new THREE.TorusGeometry(1.02, 0.018, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0xf3c879, transparent: true, opacity: 0.34 })
  );
  center.rotation.x = -Math.PI / 2;
  center.position.y = 0.015;
  boardGroup.add(center);

  const center2 = new THREE.Mesh(
    new THREE.TorusGeometry(1.26, 0.008, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0xff5f9e, transparent: true, opacity: 0.24 })
  );
  center2.rotation.x = -Math.PI / 2;
  center2.position.y = 0.014;
  boardGroup.add(center2);

  const label = textSprite('升温夜航 · 3D', {
    font: '700 26px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    color: '#e9d9ff',
    width: 340,
    height: 64
  });
  label.position.set(0, 0.42, 0);
  label.scale.set(2.25, 0.42, 1);
  label.material.opacity = 0.62;
  boardGroup.add(label);

  const sub = textSprite('NIGHT VOYAGE / 12 TILES', {
    font: '600 10px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    color: '#f3c879',
    width: 340,
    height: 36
  });
  sub.position.set(0, 0.40, 0.48);
  sub.scale.set(1.55, 0.18, 1);
  sub.material.opacity = 0.52;
  boardGroup.add(sub);

  for (let i = 0; i < TILE_COUNT; i++) {
    const t = TILES[i];
    const pos = tilePosition(i);
    const color = TILE_COLORS[t.type] || 0x6d4bd8;
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: t.type === 'finale' ? 0.55 : 0.20,
      roughness: 0.24,
      metalness: 0.42
    });
    const tile = new THREE.Mesh(new RoundedBoxGeometry(1.02, 0.16, 0.74, 3, 0.12), mat);
    tile.position.copy(pos);
    tile.position.y = 0.10;
    tile.rotation.y = -tileAngle(i) + Math.PI / 2;
    boardGroup.add(tile);
    tileMeshes.push(tile);

    const icon = textSprite(t.icon, {
      font: '64px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif',
      color: '#ffffff',
      width: 128,
      height: 128
    });
    icon.position.set(pos.x, 0.40, pos.z);
    icon.scale.set(0.55, 0.55, 1);
    boardGroup.add(icon);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.54, 0.62, 32),
      new THREE.MeshBasicMaterial({
        color: 0xf3c879,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(pos.x, 0.19, pos.z);
    ring.userData.baseOpacity = 0;
    boardGroup.add(ring);
    tile.userData.ring = ring;
    tile.userData.index = i;
  }
}

function buildTokens() {
  for (let i = 0; i < 2; i++) {
    const p = PLAYERS[i];
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      emissive: p.color,
      emissiveIntensity: 0.6,
      roughness: 0.25,
      metalness: 0.55
    });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.20, 0.10, 24), mat);
    base.position.y = 0.08;
    group.add(base);

    const body = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.42, 20), mat);
    body.position.y = 0.31;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 12), mat);
    head.position.y = 0.56;
    group.add(head);

    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.27, 28),
      new THREE.MeshBasicMaterial({
        color: p.color,
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
        depthWrite: false
      })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.02;
    group.add(halo);

    const o = i === 0 ? new THREE.Vector3(-0.19, 0, -0.03) : new THREE.Vector3(0.19, 0, 0.03);
    const pos = tilePosition(0).add(o);
    group.position.set(pos.x, 0.20, pos.z);
    group.userData.offset = o;
    group.userData.halo = halo;
    group.userData.baseY = 0.20;
    boardGroup.add(group);
    tokens.push(group);
  }
}

function pipTexture(value) {
  const size = 128;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, '#fffdf8');
  g.addColorStop(0.55, '#f3e8f8');
  g.addColorStop(1, '#dcc6ea');
  ctx.fillStyle = g;
  roundRect(ctx, 4, 4, size - 8, size - 8, 22);
  ctx.fill();

  const pips = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 3, 6, 1, 4, 7]
  }[value] || [4];
  const cell = size / 3;
  pips.forEach((n) => {
    const col = n % 3;
    const row = Math.floor(n / 3);
    const x = cell * (col + 0.5);
    const y = cell * (row + 0.5);
    ctx.beginPath();
    ctx.arc(x, y, size * 0.055, 0, Math.PI * 2);
    ctx.fillStyle = '#42124f';
    ctx.shadowColor = 'rgba(50,8,70,.45)';
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(x - 1.5, y - 1.5, size * 0.014, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,.55)';
    ctx.fill();
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function buildDice() {
  diceGroup = new THREE.Group();
  diceGroup.position.copy(DICE_BASE);
  boardGroup.add(diceGroup);

  const values = [1, 6, 2, 5, 3, 4]; // +x,-x,+y,-y,+z,-z
  const materials = values.map((v) => new THREE.MeshStandardMaterial({
    map: pipTexture(v),
    roughness: 0.32,
    metalness: 0.12,
    emissive: 0x1a0928,
    emissiveIntensity: 0.35
  }));
  diceCube = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), materials);
  diceCube.position.y = 0.31;
  diceGroup.add(diceCube);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.48, 32),
    new THREE.MeshBasicMaterial({
      map: radialTexture(),
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.set(0, 0.012, 0);
  shadow.scale.set(1.2, 0.7, 1);
  diceGroup.add(shadow);
  diceGroup.userData.shadow = shadow;

  const coaster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.6, 0.035, 40),
    new THREE.MeshPhysicalMaterial({
      color: 0x2a1648,
      roughness: 0.22,
      metalness: 0.55,
      transparent: true,
      opacity: 0.85
    })
  );
  coaster.position.y = 0.018;
  diceGroup.add(coaster);

  diceTargetBase = DICE_BASE.clone();
}

function textSprite(text, opts = {}) {
  const width = opts.width || 256;
  const height = opts.height || 128;
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, width, height);
  ctx.font = opts.font || '700 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = opts.color || '#fff';
  ctx.fillText(text, width / 2, height / 2 + 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    opacity: 1
  });
  const sp = new THREE.Sprite(mat);
  sp.renderOrder = 20;
  return sp;
}

/* ------------------------------------------------------------------ */
/* 骰子                                                               */
/* ------------------------------------------------------------------ */
function diceTargetQuat(value) {
  const base = new THREE.Quaternion();
  switch (value) {
    case 1: base.setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)); break;
    case 6: base.setFromEuler(new THREE.Euler(0, 0, -Math.PI / 2)); break;
    case 2: base.setFromEuler(new THREE.Euler(0, 0, 0)); break;
    case 5: base.setFromEuler(new THREE.Euler(Math.PI, 0, 0)); break;
    case 3: base.setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)); break;
    case 4: base.setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)); break;
    default: base.setFromEuler(new THREE.Euler(0, 0, 0));
  }
  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.75);
  return yaw.multiply(base);
}

function rollDice(value) {
  return new Promise((resolve) => {
    if (!diceGroup || !diceCube) { resolve(); return; }
    diceBusy = true;
    const start = performance.now();
    const dur = 1100;
    const startPos = diceGroup.position.clone();
    const startRot = diceCube.rotation.clone();
    const targetQuat = diceTargetQuat(value);
    const spinX = 7 + Math.random() * 4;
    const spinY = 9 + Math.random() * 4;
    const spinZ = 4 + Math.random() * 3;

    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const lift = Math.sin(Math.PI * t) * 1.15;
      diceGroup.position.set(
        startPos.x + Math.sin(t * Math.PI * 2) * 0.16 * (1 - t),
        startPos.y + lift,
        startPos.z + Math.cos(t * Math.PI * 1.7) * 0.10 * (1 - t)
      );
      const spin = new THREE.Quaternion().setFromEuler(new THREE.Euler(
        startRot.x + t * Math.PI * spinX,
        startRot.y + t * Math.PI * spinY,
        startRot.z + t * Math.PI * spinZ
      ));
      const settle = smooth(Math.max(0, (t - 0.62) / 0.38));
      diceCube.quaternion.copy(spin).slerp(targetQuat, settle);
      const sh = diceGroup.userData.shadow;
      if (sh) {
        sh.material.opacity = 0.55 * (1 - Math.min(1, lift) * 0.55);
        sh.scale.set(1.2 + lift * 0.35, 0.7 + lift * 0.18, 1);
      }
      if (t < 1) requestAnimationFrame(frame);
      else {
        diceGroup.position.copy(diceTargetBase);
        diceCube.quaternion.copy(targetQuat);
        if (sh) { sh.material.opacity = 0.55; sh.scale.set(1.2, 0.7, 1); }
        diceBusy = false;
        setTimeout(resolve, 160);
      }
    }
    requestAnimationFrame(frame);
  });
}

/* ------------------------------------------------------------------ */
/* 回合                                                               */
/* ------------------------------------------------------------------ */
function startGame() {
  state.started = true;
  state.phase = 'idle';
  state.turn = 0;
  state.heat = 0;
  state.act = 1;
  state.positions = [0, 0];
  state.winner = null;
  state.card = null;
  dom.intro.classList.add('off');
  resetTokens();
  updateUI();
  showToast('夜航开始 · 他 先摇');
}

function resetTokens() {
  tokens.forEach((token, i) => {
    const o = token.userData.offset;
    const p = tilePosition(0).add(o);
    token.position.set(p.x, token.userData.baseY, p.z);
    token.scale.set(1, 1, 1);
  });
  state.positions = [0, 0];
  updatePlayers();
}

function currentPlayer() {
  return PLAYERS[state.turn];
}

function roll() {
  if (!state.started || state.phase !== 'idle' || state.winner !== null) return;
  state.phase = 'rolling';
  updateUI();
  const value = forcedRoll || (Math.floor(Math.random() * 6) + 1);
  forcedRoll = null;
  rollDice(value).then(async () => {
    showToast(`${currentPlayer().name} 摇出 ${value} 点`);
    showDiceResult(`${currentPlayer().name} · ${value} 点`);
    await moveCurrent(value);
    resolveLanding();
  }).catch((err) => {
    console.error(err);
    state.phase = 'idle';
    updateUI();
  });
}

async function moveCurrent(value) {
  const i = state.turn;
  const from = state.positions[i];
  const to = Math.min(TILES.length - 1, from + value);
  state.phase = 'moving';
  updateUI();
  for (let p = from + 1; p <= to; p++) {
    await tweenToken(tokens[i], p, i, 210);
    state.positions[i] = p;
    updatePlayers();
    updateUI();
  }
  if (to === from) {
    // 已经在终点附近，原地震一下
    await tweenToken(tokens[i], to, i, 180);
  }
}

function tweenToken(token, tileIndex, playerIndex, duration) {
  return new Promise((resolve) => {
    const start = performance.now();
    const from = token.position.clone();
    const o = token.userData.offset;
    const dest = tilePosition(tileIndex).add(o);
    dest.y = token.userData.baseY;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      token.position.x = from.x + (dest.x - from.x) * e;
      token.position.z = from.z + (dest.z - from.z) * e;
      token.position.y = token.userData.baseY + Math.sin(Math.PI * t) * 0.20;
      token.scale.set(1 + Math.sin(Math.PI * t) * 0.12, 1 - Math.sin(Math.PI * t) * 0.06, 1 + Math.sin(Math.PI * t) * 0.12);
      if (t < 1) requestAnimationFrame(frame);
      else {
        token.position.copy(dest);
        token.scale.set(1, 1, 1);
        resolve();
      }
    }
    requestAnimationFrame(frame);
  });
}

function resolveLanding() {
  const tile = TILES[state.positions[state.turn]];
  if (!tile) { nextTurn(); return; }
  state.act = Math.max.apply(null, state.positions) < 4 ? 1 : Math.max.apply(null, state.positions) < 8 ? 2 : 3;
  updateUI();

  if (tile.type === 'truth' || tile.type === 'dare') {
    showCard(tile.type);
    return;
  }
  if (tile.type === 'event') {
    showEvent('海风', '一阵海风把你们吹近了一点。互相说一句「今天最想听的话」，温度 +1。', 1);
    return;
  }
  if (tile.type === 'duel') {
    showEvent('对撞', '两颗棋子撞在一起。石头剪刀布，赢的人获得 1 点温度；输的人负责倒一杯水。', 1);
    return;
  }
  if (tile.type === 'finale') {
    finish();
    return;
  }
  // safe / start
  showToast(tile.type === 'safe' ? '🛡 安全屋 · 这一格什么都不用做' : '🚩 起航');
  nextTurn();
}

function showCard(type) {
  state.phase = 'card';
  const isTruth = type === 'truth';
  const list = isTruth ? TRUTHS : DARES;
  const text = list[Math.floor(Math.random() * list.length)];
  state.card = { type, text };
  dom.cardKicker.textContent = isTruth ? '真心话' : '大冒险';
  dom.cardKicker.style.color = isTruth ? 'var(--violet)' : 'var(--rose)';
  dom.cardTitle.textContent = `轮到 ${currentPlayer().name}`;
  dom.cardText.textContent = text;
  dom.cardDone.textContent = isTruth ? '回答完了 · 温度 +1' : '做完了 · 温度 +1';
  dom.cardMask.classList.add('on');
  updateUI();
  saveState();
}

function closeCard(done) {
  if (!state.card) return;
  dom.cardMask.classList.remove('on');
  if (done) {
    state.heat += 1;
    showToast('温度 +1');
  } else {
    showToast('这轮跳过，温度不变');
  }
  state.card = null;
  nextTurn();
}

function showEvent(title, text, heat) {
  state.phase = 'event';
  dom.eventKicker.textContent = title === '对撞' ? '对撞' : '事件';
  dom.eventTitle.textContent = title;
  dom.eventText.textContent = text;
  dom.eventDone.textContent = heat ? '继续 · 温度 +1' : '继续';
  dom.eventMask.classList.add('on');
  state._eventHeat = heat || 0;
  updateUI();
}

function eventDone() {
  dom.eventMask.classList.remove('on');
  if (state._eventHeat) {
    state.heat += state._eventHeat;
    showToast('温度 +1');
  }
  state._eventHeat = 0;
  nextTurn();
}

function nextTurn() {
  state.turn = 1 - state.turn;
  state.phase = 'idle';
  state.act = Math.max.apply(null, state.positions) < 4 ? 1 : Math.max.apply(null, state.positions) < 8 ? 2 : 3;
  updateUI();
  saveState();
}

function finish() {
  state.phase = 'end';
  state.winner = state.turn;
  state.heat += 2;
  const name = PLAYERS[state.winner].name;
  dom.endTitle.textContent = `${name} 先靠岸`;
  dom.endText.textContent = `温度 ${state.heat} · 12 格走完。原型到灯塔为止；完整版这里会接三幕结局、心愿券和回忆册。`;
  dom.endMask.classList.add('on');
  updateUI();
}

function again() {
  dom.endMask.classList.remove('on');
  startGame();
}

/* ------------------------------------------------------------------ */
/* UI                                                                 */
/* ------------------------------------------------------------------ */
function updateUI() {
  const p = currentPlayer();
  dom.heatNum.textContent = state.heat;
  dom.heatBar.style.width = `${Math.min(100, (state.heat / 12) * 100)}%`;
  dom.actPill.textContent = `第 ${state.act} 幕 · ${ACT_NAMES[state.act - 1]}`;
  dom.turnPill.textContent = state.winner === null ? `轮到 ${p.name}` : `${PLAYERS[state.winner].name} 已抵达`;
  dom.rollText.textContent = state.phase === 'rolling' ? '骰子滚动中…' : `${p.name} 摇骰子`;
  dom.rollBtn.disabled = !state.started || state.phase !== 'idle' || state.winner !== null;
  dom.rollBtn.style.opacity = state.phase === 'rolling' ? '.72' : '';
  const chips = dom.players.querySelectorAll('.p-chip');
  chips.forEach((el, i) => {
    el.classList.toggle('active', i === state.turn && state.winner === null);
    const em = el.querySelector('em');
    if (em) em.textContent = `${state.positions[i]} 格`;
  });
  if (state.phase === 'rolling') dom.hint.textContent = '骰子落桌之前，先别急着走。';
  else if (state.phase === 'moving') dom.hint.textContent = '棋子正在沿航线前进…';
  else if (state.phase === 'card') dom.hint.textContent = '卡面已经翻开，完成后再交给下一位。';
  else if (state.phase === 'event') dom.hint.textContent = '这一格是你们共同的事件。';
  else if (state.phase === 'idle') dom.hint.textContent = state.heat > 0 ? `温度 ${state.heat} · 继续走，别让夜冷下来。` : '从「起航」出发，先到灯塔的人赢下这一晚。';

  // 当前格高亮
  tileMeshes.forEach((tile) => {
    const ring = tile.userData.ring;
    if (!ring) return;
    ring.material.opacity = 0;
  });
  const active = tileMeshes[state.positions[state.turn]];
  if (active && active.userData.ring) active.userData.ring.material.opacity = state.phase === 'idle' ? 0.75 : 0.35;

  lookTarget.set(
    tilePosition(state.positions[state.turn]).x * 0.22,
    0.1,
    tilePosition(state.positions[state.turn]).z * 0.14
  );
}

function updatePlayers() {
  const chips = dom.players.querySelectorAll('.p-chip');
  chips.forEach((el, i) => {
    const em = el.querySelector('em');
    if (em) em.textContent = `${state.positions[i]} 格`;
  });
}

function showDiceResult(text) {
  dom.diceBadge.textContent = text;
  dom.diceBadge.classList.add('on');
  clearTimeout(showDiceResult._t);
  showDiceResult._t = setTimeout(() => dom.diceBadge.classList.remove('on'), 1600);
}

function showToast(text) {
  dom.toast.textContent = text;
  dom.toast.classList.add('on');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => dom.toast.classList.remove('on'), 1900);
}

/* ------------------------------------------------------------------ */
/* 存档（原型仅记录）                                                  */
/* ------------------------------------------------------------------ */
function saveState() {
  try {
    localStorage.setItem('couple3d.proto', JSON.stringify({
      heat: state.heat,
      turn: state.turn,
      positions: state.positions,
      act: state.act,
      ts: Date.now()
    }));
  } catch (e) {}
}

/* ------------------------------------------------------------------ */
/* 渲染循环                                                           */
/* ------------------------------------------------------------------ */
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  elapsed += dt;

  if (diceCube) {
    diceCube.rotation.y += 0;
  }
  if (tokens.length) {
    tokens.forEach((token, i) => {
      const halo = token.userData.halo;
      if (halo) {
        const s = 1 + Math.sin(elapsed * 2.4 + i * 2) * 0.06;
        halo.scale.set(s, s, 1);
        halo.material.opacity = 0.36 + Math.sin(elapsed * 2.4 + i * 2) * 0.12;
      }
      if (i === state.turn && state.phase === 'idle') {
        token.position.y = token.userData.baseY + Math.sin(elapsed * 2.2) * 0.012;
      }
    });
  }

  if (camera) {
    const baseY = window.innerHeight < 700 ? 18.0 : 17.0;
    const baseZ = window.innerHeight < 700 ? 14.0 : 13.0;
    const tx = lookTarget.x * 0.12;
    const tz = lookTarget.z * 0.10;
    camera.position.x += (tx - camera.position.x) * 0.035;
    camera.position.y += (baseY + Math.sin(elapsed * 0.4) * 0.04 - camera.position.y) * 0.035;
    camera.position.z += (baseZ - camera.position.z) * 0.035;
    currentLook.lerp(lookTarget, 0.04);
    camera.lookAt(currentLook);
  }

  renderer.render(scene, camera);
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = window.innerWidth / window.innerHeight < 0.72 ? 52 : 46;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function smooth(x) {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

window.__proto3d = {
  state,
  forceRoll: (v) => { forcedRoll = Math.max(1, Math.min(6, Number(v) || 1)); }
};

/* ------------------------------------------------------------------ */
/* 启动                                                               */
/* ------------------------------------------------------------------ */
dom.startBtn.addEventListener('click', startGame);
dom.rollBtn.addEventListener('click', roll);
dom.cardDone.addEventListener('click', () => closeCard(true));
dom.cardSkip.addEventListener('click', () => closeCard(false));
dom.eventDone.addEventListener('click', eventDone);
dom.againBtn.addEventListener('click', again);

try {
  init3D();
  updateUI();
} catch (err) {
  console.error(err);
  dom.fatal.hidden = false;
}









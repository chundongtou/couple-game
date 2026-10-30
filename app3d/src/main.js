import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import './style.css';

/* ------------------------------------------------------------------ */
/* 80 格夜航公路                                                       */
/* ------------------------------------------------------------------ */
const TOTAL = 80;
const ACT_NAMES = ['起航', '升温', '靠岸'];
const ACT_CUT = [27, 54];

const TYPE_INFO = {
  start: { icon: '🚩', label: '起点', color: 0x6d4bd8 },
  truth: { icon: '💜', label: '真心话', color: 0x9b6cff },
  dare: { icon: '🔥', label: '大冒险', color: 0xff5f9e },
  event: { icon: '🎁', label: '事件', color: 0xf3c879 },
  safe: { icon: '🛡', label: '安全屋', color: 0x3fd6c0 },
  duel: { icon: '⚔️', label: '对撞', color: 0xff8a3d },
  finale: { icon: '🏁', label: '终点', color: 0xffd166 },
  diy: { icon: '✍️', label: '自定义', color: 0x66d9ff }
};

const TYPE_SEQ = [
  'truth', 'dare', 'truth', 'event', 'dare', 'safe', 'truth', 'duel',
  'dare', 'truth', 'event', 'dare', 'safe', 'truth', 'dare', 'truth', 'event'
];

const CONTROL_POINTS = [
  [0.0, 0.0], [-1.8, 2.8], [-3.8, 5.5], [-2.4, 8.4], [0.8, 9.7],
  [3.7, 12.0], [3.1, 15.2], [0.9, 17.6], [-2.6, 19.1], [-4.3, 22.0],
  [-2.7, 24.9], [0.5, 26.4], [3.5, 28.7], [4.1, 31.8], [1.9, 34.4],
  [-1.0, 36.0], [-3.0, 38.7], [-1.3, 41.6], [1.8, 43.2]
];

const curve = new THREE.CatmullRomCurve3(
  CONTROL_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  false,
  'catmullrom',
  0.5
);

function typeFor(i) {
  if (i === 0) return 'start';
  if (i === TOTAL - 1) return 'finale';
  return TYPE_SEQ[(i - 1) % TYPE_SEQ.length];
}

function makeTileData() {
  const data = [];
  for (let i = 0; i < TOTAL; i++) {
    const u = i / (TOTAL - 1);
    const pos = curve.getPointAt(u);
    pos.y = 0.13;
    const tangent = curve.getTangentAt(u).normalize();
    const normal = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
    const type = typeFor(i);
    data.push({ i, u, pos, tangent, normal, type, info: TYPE_INFO[type] });
  }
  return data;
}

const tileData = makeTileData();

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
  { name: '他', color: 0xf3c879 },
  { name: '她', color: 0xff5f9e }
];

const QS = new URLSearchParams(location.search);
const IS_ARCADE = QS.get('from') === 'arcade';
let LAUNCH = null;
try { LAUNCH = JSON.parse(localStorage.getItem('couple3d.flightLaunch') || 'null'); } catch (e) { LAUNCH = null; }
const MODE_LABEL = LAUNCH && LAUNCH.setup && ({ A: '对飞', B: '环岛', C: '双轨', D: '融合' }[LAUNCH.setup.mode] || '');
if (LAUNCH && LAUNCH.setup && LAUNCH.setup.names) {
  PLAYERS[0].name = LAUNCH.setup.names.m || PLAYERS[0].name;
  PLAYERS[1].name = LAUNCH.setup.names.f || PLAYERS[1].name;
}
const DIY = (LAUNCH && LAUNCH.diy) || null;
if (DIY && DIY.cards && DIY.cards.length) {
  const slots = [9, 21, 33, 45, 57, 69];
  DIY.cards.slice(0, slots.length).forEach((card, i) => {
    const d = tileData[slots[i]];
    if (!d) return;
    d.type = 'diy';
    d.info = TYPE_INFO.diy;
    d.diyText = String(card.text || '自定义任务');
  });
}

/* ------------------------------------------------------------------ */
/* 状态                                                               */
/* ------------------------------------------------------------------ */
let forcedRoll = null;
const state = {
  started: false,
  phase: 'idle',
  turn: 0,
  heat: 0,
  act: 1,
  positions: [0, 0],
  winner: null,
  card: null
};

const $ = (id) => document.getElementById(id);
const dom = {
  canvas: $('scene'), rollBtn: $('rollBtn'), rollText: $('rollText'), hint: $('hint'),
  turnPill: $('turnPill'), heatNum: $('heatNum'), heatBar: $('heatBar'), actPill: $('actPill'),
  players: $('players'), diceBadge: $('diceBadge'),
  cardMask: $('cardMask'), cardKicker: $('cardKicker'), cardTitle: $('cardTitle'),
  cardText: $('cardText'), cardDone: $('cardDone'), cardSkip: $('cardSkip'),
  eventMask: $('eventMask'), eventKicker: $('eventKicker'), eventTitle: $('eventTitle'),
  eventText: $('eventText'), eventDone: $('eventDone'),
  endMask: $('endMask'), endTitle: $('endTitle'), endText: $('endText'), againBtn: $('againBtn'),
  intro: $('intro'), startBtn: $('startBtn'), toast: $('toast'), fatal: $('fatal'), backBtn: $('backBtn')
};

/* ------------------------------------------------------------------ */
/* Three.js                                                           */
/* ------------------------------------------------------------------ */
let renderer, scene, camera, clock;
let roadGroup, tileMeshes = [], tokens = [], diceGroup, diceCube;
let cameraDesired = new THREE.Vector3(), lookDesired = new THREE.Vector3(0, 0.2, 3);
let currentLook = lookDesired.clone();
let elapsed = 0;
let diceTargetBase = new THREE.Vector3();

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
  scene.fog = new THREE.FogExp2(0x070411, 0.030);

  camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 140);
  clock = new THREE.Clock();

  addLights();
  addStars();
  addOcean();
  buildRoad();
  buildTokens();
  buildDice();
  aimCamera(true);

  window.addEventListener('resize', onResize);
  animate();
}

function addLights() {
  scene.add(new THREE.HemisphereLight(0x9d7bff, 0x06030d, 1.35));
  const key = new THREE.DirectionalLight(0xffe6c0, 2.2);
  key.position.set(3, 7, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0xff5f9e, 26, 16, 2);
  rim.position.set(-6, 3, 4);
  scene.add(rim);
  const gold = new THREE.PointLight(0xf3c879, 20, 14, 2);
  gold.position.set(5, 3, 10);
  scene.add(gold);
}

function addStars() {
  const geo = new THREE.BufferGeometry();
  const n = 800;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const r = 22 + Math.random() * 32;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * 22 - 2;
    pos[i * 3 + 2] = Math.sin(a) * r + 18;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xcbb7ff, size: 0.045, transparent: true, opacity: 0.7, depthWrite: false
  })));

  const near = new THREE.BufferGeometry();
  const m = 120;
  const p2 = new Float32Array(m * 3);
  for (let i = 0; i < m; i++) {
    p2[i * 3] = (Math.random() - 0.5) * 18;
    p2[i * 3 + 1] = Math.random() * 5;
    p2[i * 3 + 2] = Math.random() * 44;
  }
  near.setAttribute('position', new THREE.BufferAttribute(p2, 3));
  scene.add(new THREE.Points(near, new THREE.PointsMaterial({
    color: 0xf3c879, size: 0.025, transparent: true, opacity: 0.46, depthWrite: false
  })));
}

function addOcean() {
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0x05030d, roughness: 0.24, metalness: 0.72 })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, -1.15, 20);
  scene.add(sea);

  const grid = new THREE.GridHelper(100, 100, 0x2b1648, 0x120a24);
  grid.position.set(0, -1.14, 20);
  grid.material.transparent = true;
  grid.material.opacity = 0.14;
  scene.add(grid);
}

function radialTexture(alpha = 0.34) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(256, 256, 16, 256, 256, 250);
  g.addColorStop(0, `rgba(255,95,158,${alpha})`);
  g.addColorStop(0.34, 'rgba(124,77,255,.18)');
  g.addColorStop(0.7, 'rgba(80,36,140,.06)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildRoad() {
  roadGroup = new THREE.Group();
  scene.add(roadGroup);

  buildRibbon(0.74, 0x0a0614, 0.0, 0.82);
  buildRibbon(0.52, 0x160c28, 0.035, 0.94);
  addRoadEdges(0.58, 0xf3c879, 0.24);
  addRoadEdges(0.50, 0xff5f9e, 0.12);

  tileData.forEach((d) => buildTile(d));
  buildStartGate();
  buildLighthouse();
  buildRoadLamps();
}

function sampleCurve(n = 420) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1);
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u).normalize();
    const normal = new THREE.Vector3(-t.z, 0, t.x).normalize();
    pts.push({ p, t, normal });
  }
  return pts;
}

function buildRibbon(halfWidth, color, y, opacity) {
  const pts = sampleCurve();
  const verts = [];
  const idx = [];
  pts.forEach((s, i) => {
    const l = s.p.clone().add(s.normal.clone().multiplyScalar(halfWidth));
    const r = s.p.clone().add(s.normal.clone().multiplyScalar(-halfWidth));
    verts.push(l.x, y, l.z, r.x, y, r.z);
    if (i < pts.length - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.34,
    metalness: 0.3,
    transparent: true,
    opacity
  });
  const mesh = new THREE.Mesh(geo, mat);
  roadGroup.add(mesh);
  return mesh;
}

function addRoadEdges(halfWidth, color, opacity) {
  const pts = sampleCurve();
  [1, -1].forEach((sign) => {
    const arr = pts.map((s) => {
      const p = s.p.clone().add(s.normal.clone().multiplyScalar(halfWidth * sign));
      p.y = 0.07;
      return p;
    });
    const geo = new THREE.BufferGeometry().setFromPoints(arr);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({
      color, transparent: true, opacity
    }));
    roadGroup.add(line);
  });
}

function buildTile(d) {
  const { info } = d;
  const mat = new THREE.MeshStandardMaterial({
    color: info.color,
    emissive: info.color,
    emissiveIntensity: d.type === 'finale' ? 0.55 : 0.22,
    roughness: 0.25,
    metalness: 0.38
  });
  const tile = new THREE.Mesh(new RoundedBoxGeometry(0.92, 0.10, 0.60, 2, 0.08), mat);
  tile.position.copy(d.pos);
  tile.position.y = 0.12;
  tile.rotation.y = Math.atan2(d.tangent.x, d.tangent.z);
  roadGroup.add(tile);
  d.mesh = tile;
  tileMeshes.push(tile);

  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.40, 0.47, 28),
    new THREE.MeshBasicMaterial({
      color: 0xf3c879, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false
    })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(d.pos);
  ring.position.y = 0.205;
  roadGroup.add(ring);
  tile.userData.ring = ring;
  tile.userData.index = d.i;
  tile.userData.type = d.type;

  const label = makeTileLabel(d);
  label.position.copy(d.pos);
  label.position.y = 0.62;
  roadGroup.add(label);
  d.label = label;
}

function makeTileLabel(d) {
  const info = d.info;
  const w = 210, h = 156;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = '48px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  ctx.fillText(info.icon, w / 2, 47);
  ctx.font = '700 27px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif';
  ctx.fillStyle = '#f7efff';
  ctx.fillText(info.label, w / 2, 113);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    opacity: d.type === 'start' || d.type === 'finale' ? 1 : 0.92
  });
  const sp = new THREE.Sprite(mat);
  sp.scale.set(0.76, 0.56, 1);
  sp.renderOrder = 12;
  return sp;
}

function buildStartGate() {
  const d = tileData[0];
  const g = new THREE.Group();
  const gold = new THREE.MeshStandardMaterial({
    color: 0xf3c879, emissive: 0xf3c879, emissiveIntensity: 0.35, roughness: 0.25, metalness: 0.65
  });
  const postGeo = new THREE.CylinderGeometry(0.035, 0.05, 1.2, 8);
  [-0.62, 0.62].forEach((side) => {
    const p = new THREE.Mesh(postGeo, gold);
    p.position.copy(d.normal.clone().multiplyScalar(side));
    p.position.y = 0.6;
    g.add(p);
  });
  const bulbGeo = new THREE.SphereGeometry(0.045, 10, 8);
  [-0.62, 0.62].forEach((side) => {
    const bulb = new THREE.Mesh(bulbGeo, new THREE.MeshBasicMaterial({ color: 0xffd166 }));
    bulb.position.copy(d.normal.clone().multiplyScalar(side));
    bulb.position.y = 1.22;
    g.add(bulb);
  });
  g.scale.setScalar(0.58);
  g.position.copy(d.pos);
  roadGroup.add(g);
}

function buildLighthouse() {
  const d = tileData[TOTAL - 1];
  const g = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.22, 1.25, 12),
    new THREE.MeshStandardMaterial({ color: 0x28143e, roughness: 0.3, metalness: 0.5 })
  );
  base.position.y = 0.62;
  g.add(base);
  const stripe = new THREE.Mesh(
    new THREE.TorusGeometry(0.17, 0.018, 8, 24),
    new THREE.MeshBasicMaterial({ color: 0xf3c879 })
  );
  stripe.rotation.x = Math.PI / 2;
  stripe.position.y = 0.86;
  g.add(stripe);
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.11, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd166 })
  );
  lamp.position.y = 1.34;
  g.add(lamp);
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTexture(0.8), color: 0xffd166, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  glow.position.y = 1.34;
  glow.scale.set(1.4, 1.4, 1);
  g.add(glow);
  const label = textSprite('终点', {
    font: '700 34px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    color: '#ffd166', width: 160, height: 60
  });
  label.scale.set(0.8, 0.3, 1);
  label.position.y = 1.62;
  g.add(label);
  g.scale.setScalar(0.78);
  g.position.copy(d.pos).add(d.normal.clone().multiplyScalar(1.15));
  roadGroup.add(g);
}

function buildRoadLamps() {
  const postMat = new THREE.MeshStandardMaterial({ color: 0x2b1648, roughness: 0.4, metalness: 0.4 });
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xf3c879 });
  const postGeo = new THREE.CylinderGeometry(0.018, 0.028, 0.42, 6);
  const bulbGeo = new THREE.SphereGeometry(0.05, 10, 8);
  tileData.forEach((d, i) => {
    if (i % 7 !== 0 || i === 0 || i === TOTAL - 1) return;
    [-1, 1].forEach((side) => {
      const base = d.pos.clone().add(d.normal.clone().multiplyScalar(0.82 * side));
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.copy(base);
      post.position.y = 0.21;
      roadGroup.add(post);
      const bulb = new THREE.Mesh(bulbGeo, lightMat);
      bulb.position.copy(base);
      bulb.position.y = 0.45;
      roadGroup.add(bulb);
    });
  });
}

function textSprite(text, opts = {}) {
  const width = opts.width || 256;
  const height = opts.height || 128;
  const c = document.createElement('canvas');
  c.width = width; c.height = height;
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
    map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 1
  });
  const sp = new THREE.Sprite(mat);
  sp.renderOrder = 20;
  return sp;
}

/* ------------------------------------------------------------------ */
/* 棋子 / 骰子                                                        */
/* ------------------------------------------------------------------ */
function tokenOffset(i) {
  return new THREE.Vector3(i === 0 ? -0.18 : 0.18, 0, i === 0 ? -0.03 : 0.03);
}

function buildTokens() {
  for (let i = 0; i < 2; i++) {
    const p = PLAYERS[i];
    const group = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: p.color, emissive: p.color, emissiveIntensity: 0.62,
      roughness: 0.24, metalness: 0.55
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
        color: p.color, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false
      })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.02;
    group.add(halo);
    group.scale.setScalar(0.78);
    group.userData = { baseY: 0.20, offset: tokenOffset(i), halo };
    boardSetToken(group, 0, i);
    roadGroup.add(group);
    tokens.push(group);
  }
}

function boardSetToken(token, tileIndex, playerIndex) {
  const d = tileData[tileIndex];
  const target = d.pos.clone().add(tokenOffset(playerIndex));
  token.position.set(target.x, token.userData.baseY, target.z);
}

function buildDice() {
  diceGroup = new THREE.Group();
  roadGroup.add(diceGroup);

  const values = [1, 6, 2, 5, 3, 4];
  const mats = values.map((v) => new THREE.MeshStandardMaterial({
    map: pipTexture(v), roughness: 0.32, metalness: 0.12,
    emissive: 0x1a0928, emissiveIntensity: 0.35
  }));
  diceCube = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.62), mats);
  diceCube.position.y = 0.31;
  diceGroup.add(diceCube);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.48, 32),
    new THREE.MeshBasicMaterial({
      map: radialTexture(0.55), color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.012;
  shadow.scale.set(1.2, 0.7, 1);
  diceGroup.add(shadow);
  diceGroup.userData.shadow = shadow;

  const coaster = new THREE.Mesh(
    new THREE.CylinderGeometry(0.54, 0.58, 0.035, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x2a1648, roughness: 0.22, metalness: 0.55, transparent: true, opacity: 0.86
    })
  );
  coaster.position.y = 0.018;
  diceGroup.add(coaster);

  diceGroup.scale.setScalar(0.62);
  placeDice();
}

function placeDice() {
  if (!diceGroup) return;
  const d = tileData[state.positions[state.turn]] || tileData[0];
  const pos = d.pos.clone()
    .add(d.normal.clone().multiplyScalar(1.08))
    .add(d.tangent.clone().multiplyScalar(-0.08));
  pos.y = 0.22;
  diceGroup.position.copy(pos);
  diceTargetBase.copy(pos);
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
    1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8],
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

/* ------------------------------------------------------------------ */
/* 骰子动画                                                           */
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
  }
  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), (Math.random() - 0.5) * 0.7);
  return yaw.multiply(base);
}

function rollDice(value) {
  return new Promise((resolve) => {
    if (!diceGroup || !diceCube) { resolve(); return; }
    const start = performance.now();
    const dur = 1050;
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
        startPos.x + Math.sin(t * Math.PI * 2) * 0.15 * (1 - t),
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
  tokens.forEach((t, i) => boardSetToken(t, 0, i));
  placeDice();
  aimCamera(true);
  updateUI();
  showToast('80 格夜航开始 · 他 先摇');
  saveState();
}

function roll() {
  if (!state.started || state.phase !== 'idle' || state.winner !== null) return;
  state.phase = 'rolling';
  updateUI();
  const value = forcedRoll || (Math.floor(Math.random() * 6) + 1);
  forcedRoll = null;
  rollDice(value).then(async () => {
    showToast(`${PLAYERS[state.turn].name} 摇出 ${value} 点`);
    showDiceResult(`${PLAYERS[state.turn].name} · ${value} 点`);
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
  const to = Math.min(TOTAL - 1, from + value);
  state.phase = 'moving';
  updateUI();
  for (let p = from + 1; p <= to; p++) {
    await tweenToken(tokens[i], p, i, 185);
    state.positions[i] = p;
    updatePlayers();
    updateUI();
  }
  if (to === from) await tweenToken(tokens[i], to, i, 160);
}

function tweenToken(token, tileIndex, playerIndex, duration) {
  return new Promise((resolve) => {
    const start = performance.now();
    const from = token.position.clone();
    const d = tileData[tileIndex];
    const dest = d.pos.clone().add(tokenOffset(playerIndex));
    dest.y = token.userData.baseY;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      token.position.x = from.x + (dest.x - from.x) * e;
      token.position.z = from.z + (dest.z - from.z) * e;
      token.position.y = token.userData.baseY + Math.sin(Math.PI * t) * 0.16;
      if (t < 1) requestAnimationFrame(frame);
      else { token.position.copy(dest); resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

function resolveLanding() {
  const d = tileData[state.positions[state.turn]];
  if (!d) { nextTurn(); return; }
  state.act = actForProgress();
  updateUI();
  if (d.type === 'truth' || d.type === 'dare') { showCard(d.type); return; }
  if (d.type === 'diy') { showCard('diy', d.diyText); return; }
  if (d.type === 'event') {
    showEvent('海风', '一阵海风把你们吹近了一点。互相说一句「今天最想听的话」，温度 +1。', 1);
    return;
  }
  if (d.type === 'duel') {
    showEvent('对撞', '两颗棋子撞在一起。石头剪刀布，赢的人获得 1 点温度；输的人负责倒一杯水。', 1);
    return;
  }
  if (d.type === 'finale') { finish(); return; }
  showToast(d.type === 'safe' ? '🛡 安全屋 · 这一格什么都不用做' : '🚩 起点');
  nextTurn();
}

function showCard(type, customText) {
  state.phase = 'card';
  const isTruth = type === 'truth';
  const isDiy = type === 'diy';
  const list = isTruth ? TRUTHS : DARES;
  const text = customText || list[Math.floor(Math.random() * list.length)];
  state.card = { type, text };
  dom.cardKicker.textContent = isDiy ? '自定义格' : isTruth ? '真心话' : '大冒险';
  dom.cardKicker.style.color = isDiy ? 'var(--gold)' : isTruth ? 'var(--violet)' : 'var(--rose)';
  dom.cardTitle.textContent = `轮到 ${PLAYERS[state.turn].name}`;
  dom.cardText.textContent = text;
  dom.cardDone.textContent = isTruth ? '回答完了 · 温度 +1' : '做完了 · 温度 +1';
  dom.cardMask.classList.add('on');
  updateUI();
  saveState();
}

function closeCard(done) {
  if (!state.card) return;
  dom.cardMask.classList.remove('on');
  if (done) { state.heat += 1; showToast('温度 +1'); }
  else showToast('这轮跳过，温度不变');
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
  if (state._eventHeat) { state.heat += state._eventHeat; showToast('温度 +1'); }
  state._eventHeat = 0;
  nextTurn();
}

function nextTurn() {
  state.turn = 1 - state.turn;
  state.phase = 'idle';
  state.act = actForProgress();
  placeDice();
  updateUI();
  saveState();
}

function finish() {
  state.phase = 'end';
  state.winner = state.turn;
  state.heat += 2;
  dom.endTitle.textContent = `${PLAYERS[state.winner].name} 先到终点`;
  dom.endText.textContent = `温度 ${state.heat} · 80 格走完。原型到灯塔为止；完整版会接三幕结局、心愿券和回忆册。`;
  dom.endMask.classList.add('on');
  updateUI();
}

function again() {
  dom.endMask.classList.remove('on');
  startGame();
}

function actForProgress() {
  const max = Math.max(...state.positions);
  return max < ACT_CUT[0] ? 1 : max < ACT_CUT[1] ? 2 : 3;
}

/* ------------------------------------------------------------------ */
/* 镜头                                                               */
/* ------------------------------------------------------------------ */
function aimCamera(instant = false) {
  const d = tileData[state.positions[state.turn]] || tileData[0];
  const behind = d.tangent.clone().multiplyScalar(-4.8);
  const side = d.normal.clone().multiplyScalar(0.62);
  const up = new THREE.Vector3(0, 5.2, 0);
  cameraDesired.copy(d.pos).add(behind).add(side).add(up);
  lookDesired.copy(d.pos).add(d.tangent.clone().multiplyScalar(2.8)).add(new THREE.Vector3(0, 0.22, 0));
  if (instant) {
    camera.position.copy(cameraDesired);
    currentLook.copy(lookDesired);
    camera.lookAt(currentLook);
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(0.05, clock.getDelta());
  elapsed += dt;
  aimCamera(false);

  if (tokens.length) {
    tokens.forEach((token, i) => {
      const halo = token.userData.halo;
      if (halo) {
        const s = 1 + Math.sin(elapsed * 2.2 + i * 2) * 0.06;
        halo.scale.set(s, s, 1);
        halo.material.opacity = 0.34 + Math.sin(elapsed * 2.2 + i * 2) * 0.10;
      }
    });
  }

  camera.position.lerp(cameraDesired, 0.06);
  currentLook.lerp(lookDesired, 0.06);
  camera.lookAt(currentLook);
  renderer.render(scene, camera);
}

function onResize() {
  if (!renderer || !camera) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.fov = camera.aspect < 0.72 ? 54 : 46;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function smooth(x) {
  x = Math.max(0, Math.min(1, x));
  return x * x * (3 - 2 * x);
}

/* ------------------------------------------------------------------ */
/* UI                                                                 */
/* ------------------------------------------------------------------ */
function updateUI() {
  const p = PLAYERS[state.turn];
  dom.heatNum.textContent = state.heat;
  dom.heatBar.style.width = `${Math.min(100, (state.heat / 20) * 100)}%`;
  dom.actPill.textContent = `${MODE_LABEL ? MODE_LABEL + ' · ' : ''}第 ${state.act} 幕 · ${ACT_NAMES[state.act - 1]}`;
  dom.turnPill.textContent = state.winner === null
    ? `轮到 ${p.name} · 第 ${state.positions[state.turn]} 格`
    : `${PLAYERS[state.winner].name} 已到终点`;
  dom.rollText.textContent = state.phase === 'rolling' ? '骰子滚动中…' : `${p.name} 摇骰子`;
  dom.rollBtn.disabled = !state.started || state.phase !== 'idle' || state.winner !== null;
  const chips = dom.players.querySelectorAll('.p-chip');
  chips.forEach((el, i) => {
    el.classList.toggle('active', i === state.turn && state.winner === null);
    const em = el.querySelector('em');
    if (em) em.textContent = `${state.positions[i]} / ${TOTAL - 1} 格`;
  });
  if (state.phase === 'rolling') dom.hint.textContent = '骰子落桌之前，先别急着走。';
  else if (state.phase === 'moving') dom.hint.textContent = '棋子正在沿夜航公路前进…';
  else if (state.phase === 'card') dom.hint.textContent = '卡面已经翻开，完成后再交给下一位。';
  else if (state.phase === 'event') dom.hint.textContent = '这一格是你们共同的事件。';
  else if (state.phase === 'idle') dom.hint.textContent = state.heat > 0 ? `温度 ${state.heat} · 继续沿公路走。` : '80 格夜航公路，先到终点的人赢下这一晚。';

  tileMeshes.forEach((tile) => {
    const ring = tile.userData.ring;
    if (ring) ring.material.opacity = 0;
  });
  const active = tileMeshes[state.positions[state.turn]];
  if (active && active.userData.ring) {
    active.userData.ring.material.opacity = state.phase === 'idle' ? 0.8 : 0.35;
  }
}

function updatePlayers() {
  const chips = dom.players.querySelectorAll('.p-chip');
  chips.forEach((el, i) => {
    const em = el.querySelector('em');
    if (em) em.textContent = `${state.positions[i]} / ${TOTAL - 1} 格`;
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

function saveState() {
  try {
    localStorage.setItem('couple3d.proto', JSON.stringify({
      heat: state.heat, turn: state.turn, positions: state.positions, act: state.act, ts: Date.now()
    }));
  } catch (e) {}
}

/* ------------------------------------------------------------------ */
/* 启动                                                               */
/* ------------------------------------------------------------------ */
dom.startBtn.addEventListener('click', startGame);
dom.rollBtn.addEventListener('click', roll);
dom.cardDone.addEventListener('click', () => closeCard(true));
dom.cardSkip.addEventListener('click', () => closeCard(false));
dom.eventDone.addEventListener('click', eventDone);
dom.againBtn.addEventListener('click', again);

window.__proto3d = {
  state,
  players: PLAYERS,
  forceRoll: (v) => { forcedRoll = Math.max(1, Math.min(6, Number(v) || 1)); }
};

if (dom.backBtn) {
  dom.backBtn.addEventListener('click', () => {
    if (IS_ARCADE && window.parent !== window) {
      window.parent.postMessage({ type: 'arcade:back' }, '*');
    } else {
      location.href = '../arcade/?game=flight';
    }
  });
}

try {
  init3D();
  updateUI();
  if (IS_ARCADE) {
    dom.intro.classList.add('off');
    setTimeout(startGame, 120);
  }
} catch (err) {
  console.error(err);
  dom.fatal.hidden = false;
}



import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import './style.css';
import { TRUTHS, DARES } from './questions.js';
import { DUO_TASKS, FUTURES } from './extras.js';

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
  branch: { icon: '🌀', label: '支线', color: 0xff7a59 },
  diy: { icon: '✍️', label: '自定义', color: 0x66d9ff },
  star: { icon: '⭐', label: '星光', color: 0xffd166 },
  wave: { icon: '🌊', label: '暗流', color: 0x4da6ff },
  duo: { icon: '🤝', label: '双人任务', color: 0xff9f43 },
  future: { icon: '🌅', label: '未来', color: 0x7ee081 }
};

const EVENT_CARDS = [
  { title: '海风', text: '一阵海风把你们吹近了一点。互相说一句「今天最想听的话」，温度 +1。', heat: 1 },
  { title: '灯塔信号', text: '远处的灯塔闪了两下。说出一个你们还没一起做过、但想做的事，温度 +1。', heat: 1 },
  { title: '甲板舞', text: '船上放起一首慢歌。牵着手站十秒，谁先笑谁讲一个秘密；温度 +1。', heat: 1 },
  { title: '夜航广播', text: '广播里念到一个陌生地名。如果现在能下船，你们最想去哪里？温度 +1。', heat: 1 },
  { title: '潮汐', text: '浪把一颗玻璃珠推到你脚边。许一个只有今晚知道的愿望，温度 +1。', heat: 1 }
];

const TYPE_SEQ = [
  'truth', 'dare', 'truth', 'duo', 'truth', 'dare', 'event', 'truth',
  'dare', 'truth', 'duel', 'dare', 'truth', 'event', 'dare', 'truth',
  'duo', 'event', 'star', 'truth', 'dare', 'truth', 'wave', 'future',
  'truth', 'dare', 'safe', 'truth', 'dare', 'event'
];

const QS = new URLSearchParams(location.search);
const IS_ARCADE = QS.get('from') === 'arcade';
let LAUNCH = null;
try { LAUNCH = JSON.parse(localStorage.getItem('couple3d.flightLaunch') || 'null'); } catch (e) { LAUNCH = null; }
const MODE = (LAUNCH && LAUNCH.setup && LAUNCH.setup.mode) || 'A';
const LAPS = Math.max(1, Math.min(3, Number(LAUNCH && LAUNCH.setup && LAUNCH.setup.laps) || 1));
const IS_LOOP = MODE === 'B' || MODE === 'D';
const HAS_BRANCH = MODE === 'C' || MODE === 'D';
const MODE_LABEL = ({ A: '对飞', B: '环岛', C: '双轨', D: '融合' }[MODE] || '');
const BRANCH_SLOTS = [24, 48, 72];

const OPEN_POINTS = [
  // 从心形左下起航，沿左叶、心尖缺口、右叶，最后进入灯塔中心。
  [-4.2, 2.2], [-6.4, 5.2], [-7.6, 9.4], [-7.0, 13.8], [-5.2, 17.8],
  [-2.8, 20.6], [-0.8, 21.8], [0.0, 19.4], [0.8, 21.8], [2.8, 20.6],
  [5.2, 17.8], [7.0, 13.8], [7.6, 9.4], [6.4, 5.2], [4.2, 2.2],
  [2.2, 5.2], [0.0, 8.2]
];
const LOOP_POINTS = [
  // 环岛是一颗完整的心：从心尖出发，逆时针/顺时针都绕一圈回到心尖。
  [0.0, 0.0], [-4.0, 2.6], [-6.8, 6.2], [-7.8, 10.8], [-6.6, 15.8],
  [-3.8, 19.8], [-1.2, 21.4], [0.0, 18.8], [1.2, 21.4], [3.8, 19.8],
  [6.6, 15.8], [7.8, 10.8], [6.8, 6.2], [4.0, 2.6]
];
const CONTROL_POINTS = IS_LOOP ? LOOP_POINTS : OPEN_POINTS;

const curve = new THREE.CatmullRomCurve3(
  CONTROL_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
  IS_LOOP,
  'catmullrom',
  0.5
);

function typeFor(i) {
  if (i === 0) return 'start';
  if (!IS_LOOP && i === TOTAL - 1) return 'finale';
  if (HAS_BRANCH && BRANCH_SLOTS.indexOf(i) >= 0) return 'branch';
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


const PLAYER_COLORS = [0xf3c879, 0xff5f9e, 0x9b6cff, 0x3fd6c0];
const NPLAYERS = (LAUNCH && LAUNCH.setup && Number(LAUNCH.setup.n) === 4) ? 4 : 2;
const PLAYERS = [];
for (let pi = 0; pi < NPLAYERS; pi++) {
  let nm = pi === 0 ? '他' : pi === 1 ? '她' : '玩家' + (pi + 1);
  if (LAUNCH && LAUNCH.setup && LAUNCH.setup.names) {
    if (pi === 0) nm = LAUNCH.setup.names.m || nm;
    if (pi === 1) nm = LAUNCH.setup.names.f || nm;
    if (pi === 2) nm = LAUNCH.setup.names.p3 || nm;
    if (pi === 3) nm = LAUNCH.setup.names.p4 || nm;
  }
  PLAYERS.push({ name: nm, color: PLAYER_COLORS[pi] || 0xffffff });
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
  positions: PLAYERS.map(function(){ return 0; }),
  laps: PLAYERS.map(function(){ return 0; }),
  goalLaps: IS_LOOP ? LAPS : 1,
  winner: null,
  card: null,
  paused: false,
  dir: 1,
  dir: 1,
  flyUntil: 0,
  usedTruth: [],
  usedDare: []
};

const $ = (id) => document.getElementById(id);
const dom = {
  canvas: $('scene'), rollBtn: $('rollBtn'), rollText: $('rollText'), hint: $('hint'),
  turnPill: $('turnPill'), heatNum: $('heatNum'), heatBar: $('heatBar'), actPill: $('actPill'),
  players: $('players'), diceBadge: $('diceBadge'),
  cardMask: $('cardMask'), cardKicker: $('cardKicker'), cardTitle: $('cardTitle'),
  cardText: $('cardText'), cardDone: $('cardDone'), cardSkip: $('cardSkip'),
  eventMask: $('eventMask'), eventKicker: $('eventKicker'), eventTitle: $('eventTitle'),
  eventText: $('eventText'), eventDone: $('eventDone'), eventAlt: $('eventAlt'),
  endMask: $('endMask'), endKicker: $('endKicker'), endTitle: $('endTitle'), endText: $('endText'), againBtn: $('againBtn'),
  intro: $('intro'), startBtn: $('startBtn'), toast: $('toast'), fatal: $('fatal'),
  backBtn: $('backBtn'), pauseBtn: $('pauseBtn'), pauseMask: $('pauseMask'),
  dirMask: $('dirMask'), dirLeft: $('dirLeft'), dirRight: $('dirRight'),
  pauseText: $('pauseText'), resumeBtn: $('resumeBtn'), saveExitBtn: $('saveExitBtn'),
  wishInput: $('wishInput'), wishSave: $('wishSave'),
  voyageLog: $('voyageLog'), logDownload: $('logDownload')
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
const branchPaths = {};

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
    new THREE.MeshBasicMaterial({ color: 0x04020a })
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
  if (!IS_LOOP) buildLighthouse();
  if (IS_LOOP) buildLoopIsland();
  buildRoadLamps();
  if (HAS_BRANCH) buildBranchRoads();
  buildFinishPlaza();
  buildWorldDecor();
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
  if (d.i >= TOTAL - 8) label.visible = false;
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

function buildPathRibbon(points, halfWidth, color, y, opacity) {
  const verts = [];
  const idx = [];
  points.forEach((p, i) => {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const t = next.clone().sub(prev).normalize();
    const normal = new THREE.Vector3(-t.z, 0, t.x).normalize();
    const l = p.clone().add(normal.clone().multiplyScalar(halfWidth));
    const r = p.clone().add(normal.clone().multiplyScalar(-halfWidth));
    verts.push(l.x, y, l.z, r.x, y, r.z);
    if (i < points.length - 1) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    color, roughness: 0.4, metalness: 0.25, transparent: true, opacity
  }));
  roadGroup.add(mesh);
  return mesh;
}

function buildBranchRoads() {
  BRANCH_SLOTS.forEach(function(slot){
    const d = tileData[slot];
    const end = (slot + 4) % TOTAL;
    const e = tileData[end];
    const start = d.pos.clone().add(d.normal.clone().multiplyScalar(0.32));
    const stop = e.pos.clone().add(e.normal.clone().multiplyScalar(0.32));
    start.y = 0.06;
    stop.y = 0.06;
    const mid = start.clone().lerp(stop, 0.5).add(d.normal.clone().multiplyScalar(2.0));
    mid.y = 0.06;
    const curveB = new THREE.QuadraticBezierCurve3(start, mid, stop);
    const pts = curveB.getPoints(28);
    buildPathRibbon(pts, 0.34, 0x1a0d2c, 0.045, 0.92);
    const edgeGeo = new THREE.BufferGeometry().setFromPoints(pts.map(function(p){ return p.clone().setY(0.06); }));
    roadGroup.add(new THREE.Line(edgeGeo, new THREE.LineBasicMaterial({ color: 0xff7a59, transparent: true, opacity: 0.45 })));

    for (let k = 1; k <= 4; k++) {
      const u = k / 5;
      const p = curveB.getPointAt(u);
      const tan = curveB.getTangentAt(u).normalize();
      const mat = new THREE.MeshStandardMaterial({
        color: 0xff7a59, emissive: 0xff7a59, emissiveIntensity: 0.18,
        roughness: 0.3, metalness: 0.35
      });
      const tile = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.06, 0.40, 2, 0.07), mat);
      tile.position.set(p.x, 0.12, p.z);
      tile.rotation.y = Math.atan2(tan.x, tan.z);
      roadGroup.add(tile);
      const label = textSprite('支线', {
        font: '700 22px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
        color: '#ffd8c9', width: 140, height: 60
      });
      label.position.set(p.x, 0.36, p.z);
      label.scale.set(0.46, 0.20, 1);
      label.material.opacity = 0.85;
      roadGroup.add(label);
    }
    branchPaths[slot] = { curve: curveB, end: end };
  });
}

function buildLoopIsland() {
  let cx = 0, cz = 0;
  LOOP_POINTS.forEach(function(p){ cx += p[0]; cz += p[1]; });
  cx /= LOOP_POINTS.length;
  cz /= LOOP_POINTS.length;
  const island = new THREE.Mesh(
    new THREE.CylinderGeometry(4.5, 4.7, 0.30, 56),
    new THREE.MeshBasicMaterial({
      color: 0x0b0616, transparent: true, opacity: 0.96
    })
  );
  island.position.set(cx, -0.18, cz);
  roadGroup.add(island);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(3.1, 0.02, 8, 72),
    new THREE.MeshBasicMaterial({ color: 0xf3c879, transparent: true, opacity: 0.34 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.set(cx, 0.0, cz);
  roadGroup.add(ring);
  const label = textSprite('环岛 · NIGHT LOOP', {
    font: '700 24px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    color: '#e9d9ff', width: 340, height: 64
  });
  label.position.set(cx, 0.35, cz);
  label.scale.set(2.0, 0.38, 1);
  label.material.opacity = 0.6;
  roadGroup.add(label);
}

function buildFinishPlaza() {
  if (IS_LOOP) return;
  const d = tileData[TOTAL - 1];
  const plaza = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.16, 0.08, 48),
    new THREE.MeshStandardMaterial({ color: 0x1a0d2c, roughness: 0.32, metalness: 0.5 })
  );
  plaza.position.copy(d.pos);
  plaza.position.y = 0.02;
  roadGroup.add(plaza);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.025, 8, 64),
    new THREE.MeshBasicMaterial({ color: 0xffd166, transparent: true, opacity: 0.55 })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.copy(d.pos);
  ring.position.y = 0.075;
  roadGroup.add(ring);
  // 终点只用灯塔与广场，避免最后一个拱门和灯塔重复。

}

function buildCheckpointGate(i, labelText, color) {
  const d = tileData[i];
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.28, roughness: 0.3, metalness: 0.6 });
  [-0.92, 0.92].forEach(function(side){
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.045, 1.15, 8), mat);
    p.position.copy(d.normal.clone().multiplyScalar(side));
    p.position.y = 0.57;
    g.add(p);
  });
  const beam = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.028, 0.028), mat);
  beam.position.y = 1.12;
  g.add(beam);
  const label = textSprite(labelText, {
    font: '800 30px -apple-system,"PingFang SC","Microsoft YaHei",sans-serif',
    color: '#fff0cf', width: 240, height: 64
  });
  label.position.y = 1.38;
  label.scale.set(1.0, 0.28, 1);
  g.add(label);
  g.position.copy(d.pos);
  roadGroup.add(g);
}

function buildWorldDecor() {
  // 远月与浮岛：把公路两侧的空白填起来
  // 星空已由粒子层提供，不再放巨大月球，避免近距离只露出边缘弧。


  // 不再放大型浮岛：近距离会形成遮挡整个镜头的暗色锥体。
  // 沿途浮灯
  const lanternMat = new THREE.MeshBasicMaterial({ color: 0xffd166 });
  const lanternGeo = new THREE.SphereGeometry(0.045, 8, 6);
  for (let i = 4; i < TOTAL - 2; i += 9) {
    const d = tileData[i];
    [-1.65, 1.65].forEach(function(side, k){
      const lamp = new THREE.Mesh(lanternGeo, lanternMat);
      lamp.position.copy(d.pos).add(d.normal.clone().multiplyScalar(side));
      lamp.position.y = 0.55 + (i % 3) * 0.12;
      scene.add(lamp);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({
        map: radialTexture(0.22), color: 0xff9a5c, transparent: true,
        blending: THREE.AdditiveBlending, depthWrite: false
      }));
      halo.position.copy(lamp.position);
      halo.scale.set(0.55, 0.55, 1);
      scene.add(halo);
    });
  }

  buildCheckpointGate(ACT_CUT[0], '第 二 幕', 0xff5f9e);
  buildCheckpointGate(ACT_CUT[1], '第 三 幕', 0x9b6cff);
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

  g.scale.setScalar(0.92);
  g.position.copy(d.pos).add(d.normal.clone().multiplyScalar(1.75));
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
  if (PLAYERS.length <= 2) {
    return new THREE.Vector3(i === 0 ? -0.18 : 0.18, 0, i === 0 ? -0.03 : 0.03);
  }
  const offs = [[-0.17, -0.13], [0.17, -0.13], [-0.17, 0.13], [0.17, 0.13]];
  const o = offs[i] || [0, 0];
  return new THREE.Vector3(o[0], 0, o[1]);
}

function buildTokens() {
  for (let i = 0; i < PLAYERS.length; i++) {
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
  clearSave();
  state.started = true;
  state.phase = IS_LOOP ? 'choosing' : 'idle';
  state.turn = 0;
  state.heat = 0;
  state.act = 1;
  state.positions = PLAYERS.map(function(){ return 0; });
  state.laps = PLAYERS.map(function(){ return 0; });
  state.goalLaps = IS_LOOP ? LAPS : 1;
  state.winner = null;
  state.card = null;
  state.paused = false;
  state.dir = 1;
  state.usedTruth = [];
  state.usedDare = [];
  state.usedDuo = [];
  state.usedFuture = [];
  state.flyUntil = performance.now() + 2400;
  state.stats = { rounds: 0, stars: 0, waves: 0, tasks: 0, events: 0, duels: 0 };
  state.cardLog = [];
  state._checkpoints = [];
  dom.intro.classList.add('off');
  tokens.forEach((t, i) => boardSetToken(t, 0, i));
  placeDice();
  aimCamera(true);
  updateUI();
  if (IS_LOOP) { dom.dirMask.classList.add('on'); }
  else { showToast('♡ 心形航线 · ' + (MODE_LABEL || '夜航')); }
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
    if (IS_LOOP && state.laps[state.turn] >= state.goalLaps) { finish(); return; }
    resolveLanding();
  }).catch((err) => {
    console.error(err);
    state.phase = 'idle';
    updateUI();
  });
}

async function moveCurrent(value) {
  const i = state.turn;
  state.phase = 'moving';
  updateUI();
  if (!IS_LOOP) {
    const from = state.positions[i];
    const to = Math.min(TOTAL - 1, from + value);
    for (let p = from + 1; p <= to; p++) {
      await tweenToken(tokens[i], p, i, 185);
      state.positions[i] = p;
      updatePlayers();
      updateUI();
    }
    if (to === from) await tweenToken(tokens[i], to, i, 160);
    return;
  }
  let pos = state.positions[i];
  let lap = state.laps[i];
  for (let step = 0; step < value; step++) {
    const next = (pos + state.dir + TOTAL) % TOTAL;
    if (next === 0) lap += 1;
    await tweenToken(tokens[i], next, i, 165);
    pos = next;
    state.positions[i] = pos;
    state.laps[i] = lap;
    updatePlayers();
    updateUI();
    if (lap >= state.goalLaps) break;
  }
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

function animateBranch(playerIndex, slot) {
  return new Promise(function(resolve){
    const bp = branchPaths[slot];
    if (!bp) { resolve(); return; }
    const token = tokens[playerIndex];
    const start = performance.now();
    const dur = 920;
    function frame(now) {
      const t = Math.min(1, (now - start) / dur);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const p = bp.curve.getPointAt(e);
      const o = tokenOffset(playerIndex);
      token.position.x = p.x + o.x;
      token.position.z = p.z + o.z;
      token.position.y = token.userData.baseY + Math.sin(Math.PI * t) * 0.12;
      if (t < 1) requestAnimationFrame(frame);
      else { token.position.y = token.userData.baseY; resolve(); }
    }
    requestAnimationFrame(frame);
  });
}

async function moveBack(value) {
  const i = state.turn;
  state.phase = 'moving';
  updateUI();
  if (!IS_LOOP) {
    const from = state.positions[i];
    const to = Math.max(0, from - value);
    for (let p = from - 1; p >= to; p--) {
      await tweenToken(tokens[i], p, i, 170);
      state.positions[i] = p;
      updatePlayers();
      updateUI();
    }
  } else {
    let pos = state.positions[i];
    for (let step = 0; step < value; step++) {
      const next = (pos - state.dir + TOTAL) % TOTAL;
      await tweenToken(tokens[i], next, i, 170);
      pos = next;
      state.positions[i] = pos;
      updatePlayers();
      updateUI();
    }
  }
}

function resolveLanding() {
  const d = tileData[state.positions[state.turn]];
  if (!d) { nextTurn(); return; }
  state.act = actForProgress();
  updateUI();
  if (!IS_LOOP && (d.i === ACT_CUT[0] || d.i === ACT_CUT[1]) && !(state._checkpoints || []).includes(d.i)) {
    state._checkpoints = state._checkpoints || [];
    state._checkpoints.push(d.i);
    const n = d.i === ACT_CUT[0] ? '第二幕' : '第三幕';
    showEvent(n, d.i === ACT_CUT[0] ? '航线过半。接下来是更靠近彼此的「升温」段。温度 +1。' : '灯塔已经在视线里。最后一段「靠岸」，把今晚收进回忆。温度 +1。', 1);
    return;
  }
  if (d.type === 'truth' || d.type === 'dare' || d.type === 'duo' || d.type === 'future') { showCard(d.type); return; }
  if (d.type === 'diy') { showCard('diy', d.diyText); return; }
  if (d.type === 'star') {
    state.heat = Math.min(6, state.heat + 1);
    state.stats.stars += 1;
    state.phase = 'idle';
    updateUI();
    saveState();
    showToast('⭐ 星光落在你这边 · 温度 +1');
    nextTurn();
    return;
  }
  if (d.type === 'wave') {
    state.stats.waves += 1;
    state._waveMove = 2;
    showEvent('暗流', '海面下有一道暗流，把棋子往回推了 2 格。', 0, '退后 2 格');
    return;
  }
  if (d.type === 'event') {
    state.stats.events += 1;
    const ev = EVENT_CARDS[Math.floor(Math.random() * EVENT_CARDS.length)];
    showEvent(ev.title, ev.text, ev.heat);
    return;
  }
  if (d.type === 'duel') {
    state.stats.duels += 1;
    showEvent('对撞', '两颗棋子撞在一起。石头剪刀布，赢的人获得 1 点温度；输的人负责倒一杯水。', 1);
    return;
  }
  if (d.type === 'branch') {
    state._branchSlot = state.positions[state.turn];
    showEvent('支线入口', '这里有一条侧路。走支线可以抄近道，留主线则按原路继续。', 0, '走支线 +4', '留主线');
    if (dom.eventDone) dom.eventDone.textContent = '走支线 +4';
    return;
  }
  if (d.type === 'finale') { finish(); return; }
  showToast(d.type === 'safe' ? '🛡 安全屋 · 这一格什么都不用做' : '🚩 起点');
  nextTurn();
}

function pickQuestion(kind) {
  const pools = { truth: TRUTHS, dare: DARES, duo: DUO_TASKS, future: FUTURES };
  const pool = pools[kind] || DARES;
  const keys = { truth: 'usedTruth', dare: 'usedDare', duo: 'usedDuo', future: 'usedFuture' };
  const used = state[keys[kind]] || state.usedDare;
  if (!pool.length) return '今晚，问对方一个你一直想问的问题。';
  if (used.length >= pool.length) used.length = 0;
  let idx = Math.floor(Math.random() * pool.length);
  let guard = 0;
  while (used.indexOf(idx) >= 0 && guard < pool.length) {
    idx = (idx + 1) % pool.length;
    guard++;
  }
  used.push(idx);
  return pool[idx];
}

function showCard(type, customText) {
  state.phase = 'card';
  const meta = {
    truth: { label: '真心话', color: 'var(--violet)', done: '回答完了 · 温度 +1' },
    dare: { label: '大冒险', color: 'var(--rose)', done: '做完了 · 温度 +1' },
    duo: { label: '双人任务', color: '#ff9f43', done: '一起做完 · 温度 +1' },
    future: { label: '未来', color: '#7ee081', done: '写进未来 · 温度 +1' },
    diy: { label: '自定义格', color: 'var(--gold)', done: '做完了 · 温度 +1' }
  }[type] || { label: '任务', color: 'var(--gold)', done: '做完了 · 温度 +1' };
  const text = customText || pickQuestion(type);
  state.card = { type, text };
  state.stats.tasks += 1;
  state.cardLog.push({ type: type, text: text });
  if (state.cardLog.length > 12) state.cardLog.shift();
  dom.cardKicker.textContent = meta.label;
  dom.cardKicker.style.color = meta.color;
  dom.cardTitle.textContent = `轮到 ${PLAYERS[state.turn].name}`;
  dom.cardText.textContent = text;
  dom.cardDone.textContent = meta.done;
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

function showEvent(title, text, heat, primaryLabel, altLabel) {
  state.phase = 'event';
  dom.eventKicker.textContent = title === '对撞' ? '对撞' : title === '支线入口' ? '支线' : '事件';
  dom.eventTitle.textContent = title;
  dom.eventText.textContent = text;
  dom.eventDone.textContent = primaryLabel || (heat ? '继续 · 温度 +1' : '继续');
  dom.eventMask.classList.add('on');
  state._eventHeat = heat || 0;
  state._branchSlot = state._branchSlot || null;
  if (dom.eventAlt) {
    dom.eventAlt.style.display = altLabel ? '' : 'none';
    dom.eventAlt.textContent = altLabel || '留主线';
  }
  updateUI();
}

function eventDone() {
  dom.eventMask.classList.remove('on');
  if (state._eventHeat) { state.heat += state._eventHeat; showToast('温度 +1'); }
  state._eventHeat = 0;
  var back = state._waveMove || 0;
  state._waveMove = 0;
  if (back) {
    moveBack(back).then(function(){ resolveLanding(); });
    return;
  }
  var slot = state._branchSlot;
  state._branchSlot = null;
  if (slot != null && branchPaths[slot]) {
    animateBranch(state.turn, slot).then(function(){
      state.positions[state.turn] = branchPaths[slot].end;
      updatePlayers();
      updateUI();
      if (IS_LOOP && state.laps[state.turn] >= state.goalLaps) { finish(); return; }
      resolveLanding();
    });
    return;
  }
  nextTurn();
}

function nextTurn() {
  if (state.turn === PLAYERS.length - 1) state.stats.rounds += 1;
  state.turn = (state.turn + 1) % PLAYERS.length;
  state.phase = 'idle';
  state.act = actForProgress();
  placeDice();
  updateUI();
  saveState();
}

function logTypeName(type){
  return ({truth:'真心话', dare:'大冒险', diy:'自定义', duo:'双人任务', future:'未来'})[type] || '任务';
}

function renderVoyageLog(){
  if (!dom.voyageLog) return;
  const st = state.stats || {};
  const winner = state.winner === null ? '' : PLAYERS[state.winner].name;
  const cards = (state.cardLog || []).slice(-3);
  let route = '';
  const maxPos = Math.max.apply(null, state.positions.concat([0]));
  for (let i = 0; i < TOTAL; i++) {
    let cls = i <= maxPos ? 'done' : '';
    state.positions.forEach(function(pos, pi){ if (pos === i && pi < 4) cls += ' p' + pi; });
    route += '<i class="' + cls + '"></i>';
  }
  dom.voyageLog.innerHTML =
    '<div class="vlog-head"><b>今晚的航海日志</b><span>' + (MODE_LABEL || '80 格') + ' · ' + (st.rounds || 0) + ' 回合</span></div>' +
    '<div class="vlog-stats">' +
      '<div class="vlog-stat"><em>WINNER</em><b>' + winner + '</b></div>' +
      '<div class="vlog-stat"><em>温度</em><b>' + state.heat + '</b></div>' +
      '<div class="vlog-stat"><em>抽卡</em><b>' + (st.tasks || 0) + '</b></div>' +
      '<div class="vlog-stat"><em>星光</em><b>' + (st.stars || 0) + '</b></div>' +
      '<div class="vlog-stat"><em>暗流</em><b>' + (st.waves || 0) + '</b></div>' +
      '<div class="vlog-stat"><em>事件</em><b>' + ((st.events || 0) + (st.duels || 0)) + '</b></div>' +
    '</div>' +
    '<div class="vlog-route">' + route + '</div>' +
    '<div class="vlog-cards">' + (cards.length ? cards.map(function(c){ return '<div><b>' + logTypeName(c.type) + '</b> · ' + c.text + '</div>'; }).join('') : '这一局没有留下任务卡。') + '</div>';
}

function wrapCanvas(ctx, text, maxWidth){
  const words = String(text || '').split('');
  let line = '', lines = [];
  words.forEach(function(ch){
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = ch; }
    else line = test;
  });
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function downloadVoyageLog(){
  const c = document.createElement('canvas');
  c.width = 900; c.height = 1200;
  const ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 900, 1200);
  g.addColorStop(0, '#0b0617'); g.addColorStop(.55, '#160b2a'); g.addColorStop(1, '#070411');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 900, 1200);
  ctx.fillStyle = 'rgba(243,200,121,.08)';
  ctx.beginPath(); ctx.arc(740, 90, 220, 0, Math.PI * 2); ctx.fill();
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f3c879'; ctx.font = '800 22px "Microsoft YaHei",sans-serif';
  ctx.fillText('COUPLE NIGHT VOYAGE · 3D', 70, 86);
  ctx.fillStyle = '#f7efff'; ctx.font = '900 58px "Microsoft YaHei",sans-serif';
  ctx.fillText('今晚的航海日志', 70, 160);
  const win = state.winner === null ? '' : PLAYERS[state.winner].name;
  ctx.fillStyle = '#a99abf'; ctx.font = '400 22px "Microsoft YaHei",sans-serif';
  ctx.fillText((MODE_LABEL || '80 格') + ' · ' + (state.stats.rounds || 0) + ' 回合 · 温度 ' + state.heat, 72, 205);
  ctx.fillStyle = '#ffd166'; ctx.font = '900 40px "Microsoft YaHei",sans-serif';
  ctx.fillText(win + ' 先靠岸', 70, 285);

  // route
  const x0 = 70, y0 = 350, w = 760, gap = 4;
  for (let i = 0; i < TOTAL; i++) {
    ctx.fillStyle = i <= Math.max.apply(null, state.positions) ? '#ff5f9e' : 'rgba(255,255,255,.13)';
    const x = x0 + (w / TOTAL) * i;
    ctx.fillRect(x, y0, Math.max(2, w / TOTAL - gap), 10);
  }
  let markers = '';
  state.positions.forEach(function(pos, pi){ markers += PLAYERS[pi].name + ' ' + pos + ' 格  '; });
  ctx.fillStyle = '#a99abf'; ctx.font = '400 20px "Microsoft YaHei",sans-serif';
  ctx.fillText(markers, 70, 395);

  // stats
  const stats = [
    ['抽卡', state.stats.tasks || 0], ['星光', state.stats.stars || 0],
    ['暗流', state.stats.waves || 0], ['事件', (state.stats.events || 0) + (state.stats.duels || 0)]
  ];
  stats.forEach(function(pair, i){
    const x = 70 + (i % 4) * 190;
    ctx.fillStyle = 'rgba(255,255,255,.055)'; ctx.fillRect(x, 445, 170, 86);
    ctx.fillStyle = '#76678f'; ctx.font = '400 16px "Microsoft YaHei",sans-serif'; ctx.fillText(pair[0], x + 16, 475);
    ctx.fillStyle = '#f7efff'; ctx.font = '800 30px "Microsoft YaHei",sans-serif'; ctx.fillText(String(pair[1]), x + 16, 510);
  });

  // cards
  ctx.fillStyle = '#f3c879'; ctx.font = '800 22px "Microsoft YaHei",sans-serif';
  ctx.fillText('本局留下的话', 70, 600);
  const cards = (state.cardLog || []).slice(-3);
  ctx.fillStyle = '#c9badf'; ctx.font = '400 19px "Microsoft YaHei",sans-serif';
  let yy = 645;
  cards.forEach(function(card){
    ctx.fillStyle = '#f3c879'; ctx.font = '700 17px "Microsoft YaHei",sans-serif';
    ctx.fillText('· ' + logTypeName(card.type), 72, yy); yy += 26;
    ctx.fillStyle = '#c9badf'; ctx.font = '400 19px "Microsoft YaHei",sans-serif';
    wrapCanvas(ctx, card.text, 720).forEach(function(line){ ctx.fillText(line, 92, yy); yy += 27; });
    yy += 12;
  });
  if (!cards.length) { ctx.fillStyle = '#76678f'; ctx.fillText('这一局没有留下任务卡。', 72, yy); }

  ctx.fillStyle = 'rgba(243,200,121,.6)'; ctx.font = '400 16px "Microsoft YaHei",sans-serif';
  ctx.fillText('升温夜航 · 只属于你们的 80 格', 70, 1120);
  const a = document.createElement('a');
  a.download = 'couple-voyage-' + Date.now() + '.png';
  a.href = c.toDataURL('image/png');
  document.body.appendChild(a); a.click(); a.remove();
  showToast('航海日志已生成');
}

function finish() {
  clearSave();
  state.phase = 'end';
  state.winner = state.turn;
  state.heat += 2;
  const winner = PLAYERS[state.winner].name;
  if (dom.endKicker) dom.endKicker.textContent = IS_LOOP ? '完成环岛' : '抵达灯塔';
  if (IS_LOOP) {
    dom.endTitle.textContent = `${winner} 先跑完 ${state.goalLaps} 圈`;
    dom.endText.textContent = `温度 ${state.heat} · ${state.goalLaps} 圈环岛走完。把赢家的心愿写下来，存进「升温夜航」的回忆册。`;
  } else {
    dom.endTitle.textContent = `${winner} 先到终点`;
    dom.endText.textContent = `温度 ${state.heat} · 80 格走完。把赢家的心愿写下来，存进「升温夜航」的回忆册。`;
  }
  renderVoyageLog();
  try { localStorage.setItem('couple3d.lastVoyage', JSON.stringify({ winner: state.winner, names: PLAYERS.map(function(p){ return p.name; }), stats: state.stats, cards: state.cardLog.slice(-6), heat: state.heat, mode: MODE, ts: Date.now() })); } catch (e) {}
  dom.endMask.classList.add('on');
  updateUI();
}

function again() {
  dom.endMask.classList.remove('on');
  clearSave();
  startGame();
}

function actForProgress() {
  const total = IS_LOOP ? TOTAL * state.goalLaps : TOTAL - 1;
  const progress = state.positions.map(function(p, i){ return IS_LOOP ? p + state.laps[i] * TOTAL : p; });
  const pct = Math.max.apply(null, progress) / Math.max(1, total);
  return pct < 1 / 3 ? 1 : pct < 2 / 3 ? 2 : 3;
}

/* ------------------------------------------------------------------ */
/* 镜头                                                               */
/* ------------------------------------------------------------------ */
function aimCamera(instant = false) {
  if (state.flyUntil && performance.now() < state.flyUntil) {
    const center = tileData[Math.floor(TOTAL / 2)].pos;
    cameraDesired.set(center.x, 25, center.z - 15);
    lookDesired.set(center.x, 0, center.z);
    if (instant) { camera.position.copy(cameraDesired); currentLook.copy(lookDesired); camera.lookAt(currentLook); }
    return;
  }
  const d = tileData[state.positions[state.turn]] || tileData[0];
  const forward = d.tangent.clone().multiplyScalar(state.dir);
  const finishNear = !IS_LOOP && d.i >= TOTAL - 8 && d.i < TOTAL - 1;
  let behind, side, up, lookAt;
  if (finishNear) {
    const end = tileData[TOTAL - 1];
    const toEnd = end.pos.clone().sub(d.pos).setY(0);
    if (toEnd.lengthSq() < 0.01) toEnd.copy(forward);
    toEnd.normalize();
    behind = toEnd.clone().multiplyScalar(-4.0);
    side = d.normal.clone().multiplyScalar(0.30);
    up = new THREE.Vector3(0, 4.4, 0);
    lookAt = end.pos.clone().add(new THREE.Vector3(0, 0.28, 0));
    cameraDesired.copy(d.pos).add(behind).add(side).add(up);
    lookDesired.copy(lookAt);
  } else {
    behind = forward.clone().multiplyScalar(-4.8);
    side = d.normal.clone().multiplyScalar(0.62);
    up = new THREE.Vector3(0, 5.2, 0);
    cameraDesired.copy(d.pos).add(behind).add(side).add(up);
    lookDesired.copy(d.pos).add(forward.clone().multiplyScalar(2.8)).add(new THREE.Vector3(0, 0.22, 0));
  }
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
/* 暂停 / 心愿                                                       */
/* ------------------------------------------------------------------ */
function chooseDir(dir) {
  if (state.phase !== 'choosing') return;
  state.dir = dir < 0 ? -1 : 1;
  dom.dirMask.classList.remove('on');
  state.phase = 'idle';
  updateUI();
  saveState();
  showToast(state.dir > 0 ? '顺时针出发 · 走右边' : '逆时针出发 · 走左边');
}

function pauseGame() {
  if (!state.started || state.winner !== null) return;
  if (state.phase !== 'idle') { showToast('等这一轮落稳再暂停'); return; }
  saveState();
  state.paused = true;
  if (dom.pauseText) dom.pauseText.textContent =
    `第 ${state.act} 幕 · 温度 ${state.heat} · ${PLAYERS[state.turn].name} 在 ${state.positions[state.turn]} 格。进度已保存。`;
  dom.pauseMask.classList.add('on');
  updateUI();
}
function unpauseGame() {
  state.paused = false;
  dom.pauseMask.classList.remove('on');
  updateUI();
}
function goBackToSetup() {
  saveState();
  if (IS_ARCADE && window.parent !== window) {
    window.parent.postMessage({ type: 'arcade:back' }, '*');
  } else {
    location.href = '../arcade/?game=flight';
  }
}
function saveAndExit() {
  saveState();
  dom.pauseMask.classList.remove('on');
  goBackToSetup();
}
function saveWish() {
  var wish = dom.wishInput ? String(dom.wishInput.value || '').trim().slice(0, 80) : '';
  if (!wish) { showToast('先写一句心愿吧'); return; }
  var winner = state.winner === null ? '' : PLAYERS[state.winner].name;
  var payload = {
    type: 'arcade:flight-wish',
    wish: wish,
    winner: winner,
    names: { a: PLAYERS[0].name, b: PLAYERS[1].name },
    turn: TOTAL - 1,
    ts: Date.now()
  };
  if (window.parent !== window) {
    try { window.parent.postMessage(payload, '*'); } catch (e) {}
  } else {
    try { localStorage.setItem('couple3d.wish', JSON.stringify(payload)); } catch (e) {}
  }
  if (dom.wishSave) dom.wishSave.disabled = true;
  clearSave3D();
  showToast('心愿已存进回忆册');
}

/* ------------------------------------------------------------------ */
/* UI                                                                 */
/* ------------------------------------------------------------------ */
function renderPlayersUI() {
  if (!dom.players) return;
  dom.players.classList.toggle('four', PLAYERS.length > 2);
  dom.players.innerHTML = PLAYERS.map(function(p, i){
    return '<div class="p-chip p' + i + '"><span class="p-dot"></span><b>' +
      p.name + '</b><em>0 / 79 格</em></div>';
  }).join('');
}

function drawRouteMap() {
  const c = dom.routeMap;
  if (!c) return;
  const ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  ctx.clearRect(0, 0, W, H);
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  tileData.forEach(function(d){
    minX = Math.min(minX, d.pos.x); maxX = Math.max(maxX, d.pos.x);
    minZ = Math.min(minZ, d.pos.z); maxZ = Math.max(maxZ, d.pos.z);
  });
  const pad = 12;
  const sx = (W - pad * 2) / Math.max(0.001, maxX - minX);
  const sy = (H - pad * 2) / Math.max(0.001, maxZ - minZ);
  const sc = Math.min(sx, sy);
  const ox = (W - (maxX - minX) * sc) / 2;
  const oz = (H - (maxZ - minZ) * sc) / 2;
  const pt = function(d){ return { x: ox + (d.pos.x - minX) * sc, y: H - (oz + (d.pos.z - minZ) * sc) }; };
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'rgba(255,95,158,.45)';
  ctx.beginPath();
  tileData.forEach(function(d, i){ const p = pt(d); if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
  if (IS_LOOP) ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(243,200,121,.4)';
  ctx.stroke();
  tileData.forEach(function(d, i){
    if (i % 3 !== 0 && i !== TOTAL - 1 && i !== 0) return;
    const p = pt(d);
    ctx.fillStyle = i === TOTAL - 1 ? '#ffd166' : i === 0 ? '#f3c879' : 'rgba(255,255,255,.38)';
    ctx.beginPath(); ctx.arc(p.x, p.y, i === TOTAL - 1 || i === 0 ? 3 : 1.5, 0, Math.PI * 2); ctx.fill();
  });
  state.positions.forEach(function(pos, i){
    const p = pt(tileData[pos] || tileData[0]);
    ctx.fillStyle = PLAYERS[i].color || '#fff';
    ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(7,4,17,.8)'; ctx.lineWidth = 1.5; ctx.stroke();
  });
}

function updateUI() {
  const p = PLAYERS[state.turn];
  dom.heatNum.textContent = state.heat;
  dom.heatBar.style.width = `${Math.min(100, (state.heat / 20) * 100)}%`;
  dom.actPill.textContent = `${MODE_LABEL ? MODE_LABEL + ' · ' : ''}第 ${state.act} 幕 · ${ACT_NAMES[state.act - 1]}`;
  dom.turnPill.textContent = state.winner === null
    ? (IS_LOOP
      ? `轮到 ${p.name} · 圈 ${Math.min(state.laps[state.turn] + 1, state.goalLaps)}/${state.goalLaps} · 第 ${state.positions[state.turn]} 格`
      : `轮到 ${p.name} · 第 ${state.positions[state.turn]} 格`)
    : `${PLAYERS[state.winner].name} 已到终点`;
  dom.rollText.textContent = state.phase === 'rolling' ? '骰子滚动中…' : `${p.name} 摇骰子`;
  dom.rollBtn.disabled = !state.started || state.phase !== 'idle' || state.winner !== null || state.paused;
  if (dom.pauseBtn) dom.pauseBtn.disabled = !state.started || state.winner !== null;
  const chips = dom.players.querySelectorAll('.p-chip');
  chips.forEach((el, i) => {
    el.classList.toggle('active', i === state.turn && state.winner === null);
    const em = el.querySelector('em');
    if (em) em.textContent = `${state.positions[i]} / ${TOTAL - 1} 格`;
  });
  if (dom.routeFill) {
    const totalUnits = IS_LOOP ? TOTAL * state.goalLaps : TOTAL - 1;
    const doneUnits = IS_LOOP ? (state.laps[state.turn] * TOTAL + state.positions[state.turn]) : state.positions[state.turn];
    const pct = Math.max(0, Math.min(100, (doneUnits / totalUnits) * 100));
    dom.routeFill.style.width = pct.toFixed(1) + '%';
    dom.routeText.textContent = IS_LOOP ? ('圈 ' + Math.min(state.laps[state.turn] + 1, state.goalLaps) + '/' + state.goalLaps + ' · ' + state.positions[state.turn] + ' 格') : (state.positions[state.turn] + ' / ' + (TOTAL - 1));
    drawRouteMap();
  }
  if (state.phase === 'choosing') dom.hint.textContent = '先选环岛方向：顺时针走右边，逆时针走左边。';
  else if (state.paused) dom.hint.textContent = '棋局已暂停，进度已保存。';
  else if (state.phase === 'rolling') dom.hint.textContent = '骰子落桌之前，先别急着走。';
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
    if (em) em.textContent = IS_LOOP
      ? `圈 ${Math.min(state.laps[i] + 1, state.goalLaps)}/${state.goalLaps} · ${state.positions[i]} 格`
      : `${state.positions[i]} / ${TOTAL - 1} 格`;
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
      v: 1,
      heat: state.heat,
      turn: state.turn,
      positions: state.positions.slice(),
      laps: state.laps.slice(),
      dir: state.dir,
      goalLaps: state.goalLaps,
      act: state.act,
      started: state.started,
      ts: Date.now()
    }));
    if (state.started && state.winner === null) {
      localStorage.setItem('couple3d.flightSave', JSON.stringify({
        v: 1,
        heat: state.heat,
        turn: state.turn,
        positions: state.positions.slice(),
        laps: state.laps.slice(),
        dir: state.dir,
        goalLaps: state.goalLaps,
        act: state.act,
        ts: Date.now()
      }));
    }
  } catch (e) {}
}

function loadSave3D() {
  try {
    var s = JSON.parse(localStorage.getItem('couple3d.flightSave') || 'null');
    if (!s || s.v !== 1 || !(s.positions instanceof Array) || s.positions.length !== PLAYERS.length) return null;
    return s;
  } catch (e) { return null; }
}
function clearSave3D() {
  try { localStorage.removeItem('couple3d.flightSave'); } catch (e) {}
}
function clearSave() { clearSave3D(); }
function resumeGameFromSave(save) {
  state.started = true;
  state.phase = 'idle';
  state.paused = false;
  state.turn = Math.max(0, Math.min(PLAYERS.length - 1, Number(save.turn) || 0));
  state.heat = Math.max(0, Number(save.heat) || 0);
  state.positions = PLAYERS.map(function(_, i){ return Math.max(0, Math.min(79, Number(save.positions[i]) || 0)); });
  state.laps = PLAYERS.map(function(_, i){ return Math.max(0, Number(save.laps && save.laps[i]) || 0); });
  state.dir = Number(save.dir) === -1 ? -1 : 1;
  state.goalLaps = IS_LOOP ? LAPS : 1;
  state.act = actForProgress();
  state.winner = null;
  state.card = null;
  dom.intro.classList.add('off');
  tokens.forEach(function(t, i){ boardSetToken(t, state.positions[i], i); });
  placeDice();
  aimCamera(true);
  updateUI();
  showToast('继续 3D 棋局');
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
  tiles: tileData,
  forceRoll: (v) => { forcedRoll = Math.max(1, Math.min(6, Number(v) || 1)); }
};

if (dom.backBtn) {
  dom.backBtn.addEventListener('click', function(){
    if (state.started && state.winner === null) saveState();
    goBackToSetup();
  });
}
if (dom.dirLeft) dom.dirLeft.addEventListener('click', function(){ chooseDir(-1); });
if (dom.dirRight) dom.dirRight.addEventListener('click', function(){ chooseDir(1); });
if (dom.pauseBtn) dom.pauseBtn.addEventListener('click', pauseGame);
if (dom.resumeBtn) dom.resumeBtn.addEventListener('click', unpauseGame);
if (dom.saveExitBtn) dom.saveExitBtn.addEventListener('click', saveAndExit);
if (dom.logDownload) dom.logDownload.addEventListener('click', downloadVoyageLog);
if (dom.wishSave) dom.wishSave.addEventListener('click', saveWish);

try {
  init3D();
  renderPlayersUI();
  updateUI();
  if (IS_ARCADE) {
    dom.intro.classList.add('off');
    var saved = loadSave3D();
    setTimeout(function(){
      if (LAUNCH && LAUNCH.resume && saved) resumeGameFromSave(saved);
      else startGame();
    }, 120);
  }
} catch (err) {
  console.error(err);
  dom.fatal.hidden = false;
}







/* ==========================================================================
 * V9 · 真 3D 主桌 · 电影写实 · 零件几何
 *  - 格块：带倒角的实心块（顶面珐琅贴图 + 斜面受光 + 侧面顶点色），全部合并成 1 个 mesh
 *  - 纸飞机：象牙纸（折痕贴图/法线 + 顶点 UV）+ 黄铜配重；纸零件 1 draw + 黄铜 1 draw
 *  - 骰子：单材质图集（3×2，6 面 UV），1 draw（V8 是 6 个材质 = 6 draw）
 *  - 光斑 / 阴影 / 涟漪 / 速度线
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { SLOT_DARK, uvOfSlot, DIE_FACES, MAT } from './constants.js';
import {
  makeGlowTex, makeShadowTex, makeRippleTex, buildPaperTextures, buildBrushedBrass, buildLeatherTextures, buildSkinTextures
} from './textures.js';

/* 把若干 { geo, matrix } 合并成一个非索引几何（只保留 position/normal/uv） */
export function mergeGeoms(parts) {
  const pos = [], nrm = [], uv = [];
  const v = new THREE.Vector3();
  const nm = new THREE.Matrix3();
  for (const { geo, matrix } of parts) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    if (matrix) {
      g.applyMatrix4(matrix);
    }
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    const u = g.getAttribute('uv');
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      if (n) nrm.push(n.getX(i), n.getY(i), n.getZ(i));
      if (u) uv.push(u.getX(i), u.getY(i));
      else uv.push(0, 0);
    }
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (nrm.length) out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (!nrm.length) out.computeVertexNormals();
  return out;
}

/* 把若干 { geo, matrix, color:[r,g,b] } 合并成一个带顶点色的几何（V9.1 桌面小物）
 * 小物按「材质桶」合并：所有彩色哑光件（书皮/陶盆/磁带壳/蜡烛）1 draw，
 * 纸张/印刷/黄铜/布/叶子各自 1 draw，避免每个小物一个 draw。 */
export function mergePropGeoms(parts) {
  const pos = [], nrm = [], uv = [], col = [];
  const d = new THREE.Object3D();
  for (const p of parts) {
    let g = p.geo.index ? p.geo.toNonIndexed() : p.geo.clone();
    const m = p.matrix;
    if (m) g.applyMatrix4(m);
    const pa = g.getAttribute('position');
    const na = g.getAttribute('normal');
    const ua = g.getAttribute('uv');
    const c = p.color || [1, 1, 1];
    for (let i = 0; i < pa.count; i++) {
      pos.push(pa.getX(i), pa.getY(i), pa.getZ(i));
      if (na) nrm.push(na.getX(i), na.getY(i), na.getZ(i));
      else nrm.push(0, 1, 0);
      if (ua) uv.push(ua.getX(i), ua.getY(i)); else uv.push(0.5, 0.5);
      col.push(c[0], c[1], c[2]);
    }
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  d.position.set(0, 0, 0);
  return out;
}

/* ============================ 格块（带倒角） ============================
 * tiles: [{x,z,rot,w,d,top,bottom,uv,side,color,bevel}]
 * 顶面 = 内缩矩形；四周 4 条斜面；四周 4 个侧面。每格 18 三角形。 */
export function buildTileGeometry(tiles) {
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
    const bev = Math.max(0.006, Math.min(t.w, t.d) * (t.bevel === undefined ? 0.10 : t.bevel));
    const bH = bev * 0.95;
    const hwi = hw - bev, hdi = hd - bev;
    const y0 = t.top, y1 = t.top - bH;
    const u0 = t.uv[0], v0 = t.uv[1], u1 = t.uv[2], v1 = t.uv[3];
    const iu = (u1 - u0) * 0.012, iv = (v1 - v0) * 0.012;
    const topCol = [1, 1, 1];
    const bevCol = [0.84, 0.84, 0.84];

    /* 顶面 */
    pushQuad(
      loc(-hwi, hdi, y0), loc(hwi, hdi, y0), loc(hwi, -hdi, y0), loc(-hwi, -hdi, y0),
      [[u0 + iu, v0 + iv], [u1 - iu, v0 + iv], [u1 - iu, v1 - iv], [u0 + iu, v1 - iv]], topCol
    );
    /* 4 条倒角斜面：UV 用相邻顶边的 UV，颜色略压暗（假 AO） */
    pushQuad( // +z 边
      loc(-hw, hd, y1), loc(hw, hd, y1), loc(hwi, hdi, y0), loc(-hwi, hdi, y0),
      [[u0, v1], [u1, v1], [u1 - iu, v1 - iv], [u0 + iu, v1 - iv]], bevCol
    );
    pushQuad( // -z 边
      loc(-hwi, -hdi, y0), loc(hwi, -hdi, y0), loc(hw, -hd, y1), loc(-hw, -hd, y1),
      [[u0 + iu, v0 + iv], [u1 - iu, v0 + iv], [u1, v0], [u0, v0]], bevCol
    );
    pushQuad( // +x 边
      loc(hwi, -hdi, y0), loc(hwi, hdi, y0), loc(hw, hd, y1), loc(hw, -hd, y1),
      [[u1 - iu, v0 + iv], [u1 - iu, v1 - iv], [u1, v1], [u1, v0]], bevCol
    );
    pushQuad( // -x 边
      loc(-hw, -hd, y1), loc(-hw, hd, y1), loc(-hwi, hdi, y0), loc(-hwi, -hdi, y0),
      [[u0, v0], [u0, v1], [u0 + iu, v1 - iv], [u0 + iu, v0 + iv]], bevCol
    );
    /* 4 个侧面（顶点色 = 主题/格子色） */
    const cu = darkCenterU, cv = darkCenterV;
    const sideUV = [[cu, cv], [cu, cv], [cu, cv], [cu, cv]];
    pushQuad(loc(-hw, hd, y0), loc(-hw, hd, t.bottom), loc(hw, hd, t.bottom), loc(hw, hd, y0), sideUV, t.side);
    pushQuad(loc(hw, hd, y0), loc(hw, hd, t.bottom), loc(hw, -hd, t.bottom), loc(hw, -hd, y0), sideUV, t.side);
    pushQuad(loc(hw, -hd, y0), loc(hw, -hd, t.bottom), loc(-hw, -hd, t.bottom), loc(-hw, -hd, y0), sideUV, t.side);
    pushQuad(loc(-hw, -hd, y0), loc(-hw, -hd, t.bottom), loc(-hw, hd, t.bottom), loc(-hw, hd, y0), sideUV, t.side);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  return geo;
}

/* ============================ 骰子（单材质图集） ============================ */
export function makeDieGeometry(size) {
  const geo = new THREE.BoxGeometry(size, size, size);
  const uvAttr = geo.getAttribute('uv');
  /* BoxGeometry 面顺序：+X -X +Y -Y +Z -Z；每面 4 个顶点，uv = (0,1),(1,1),(0,0),(1,0) */
  for (let f = 0; f < 6; f++) {
    const value = DIE_FACES[f];
    const col = (value - 1) % 3;
    const row = Math.floor((value - 1) / 3);
    for (let k = 0; k < 4; k++) {
      const idx = f * 4 + k;
      const u = uvAttr.getX(idx) === 1 ? 1 : 0;
      const v = uvAttr.getY(idx) === 1 ? 1 : 0;
      uvAttr.setXY(idx, (col + u) / 3, (1 - row + v) / 2);
    }
  }
  uvAttr.needsUpdate = true;
  return geo;
}

/* ============================ 纸飞机 ============================
 * 返回 { group, setColor(colorHex, accentHex), dispose() }
 * 纸零件（机翼+龙骨）1 mesh；黄铜（脊梁+机头配重）1 mesh。
 * 纸/黄铜贴图按模块缓存，多架飞机共用（GPU 只上传一份）。 */
let _paperTex = null, _brassTex = null;
function paperTex() {
  if (!_paperTex) _paperTex = buildPaperTextures(256);
  return _paperTex;
}
function brassTex() {
  if (!_brassTex) _brassTex = buildBrushedBrass(128);
  return _brassTex;
}

export function makePlane(colorHex, accentHex) {
  const g = new THREE.Group();
  const L = 0.46, W = 0.30, H = 0.075;
  const nose = [0, 0.022, -L / 2];
  const tail = [0, 0.05, L / 2];
  const wl = [-W / 2, 0.002, L / 2 - 0.07];
  const wr = [W / 2, 0.002, L / 2 - 0.07];
  const keel = [0, -H, L / 2 - 0.02];
  const finTop = [0, 0.18, L / 2 - 0.005];
  const mid = [0, 0.028, 0.02];

  const pushTri = (arr, uvs, a, b, c) => {
    arr.push(...a, ...b, ...c);
    for (const p of [a, b, c]) {
      /* 纸纹 UV：u 横向（0..1），v 沿机身（0..1） */
      uvs.push(clamp01(0.5 + p[0] / (W * 1.45)), clamp01(0.5 + p[2] / (L * 1.2)));
    }
  };
  const wingV = [], wingU = [];
  pushTri(wingV, wingU, nose, wl, mid);
  pushTri(wingV, wingU, nose, mid, wr);
  pushTri(wingV, wingU, mid, wl, tail);
  pushTri(wingV, wingU, mid, tail, wr);
  const keelV = [], keelU = [];
  pushTri(keelV, keelU, nose, keel, mid);
  pushTri(keelV, keelU, mid, keel, tail);
  pushTri(keelV, keelU, tail, keel, finTop);

  const mkGeo = (verts, uvs) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geo.computeVertexNormals();
    return geo;
  };

  const paper = paperTex();
  const brass = brassTex();
  const paperMat = new THREE.MeshStandardMaterial({
    map: paper.map, normalMap: paper.normal, normalScale: new THREE.Vector2(MAT.paper.normalScale, MAT.paper.normalScale),
    color: colorHex, roughness: MAT.paper.roughness, metalness: MAT.paper.metalness,
    side: THREE.DoubleSide, envMapIntensity: MAT.paper.envMapIntensity
  });
  const brassMat = new THREE.MeshStandardMaterial({
    map: brass.map, normalMap: brass.normal, roughnessMap: brass.rough,
    normalScale: new THREE.Vector2(0.35, 0.35), color: accentHex,
    roughness: MAT.brass.roughness, metalness: MAT.brass.metalness, envMapIntensity: MAT.brass.envMapIntensity
  });

  const wingGeo = mkGeo(wingV, wingU);
  const keelGeo = mkGeo(keelV, keelU);
  /* 纸零件合并：机翼 + 龙骨（龙骨略暗，用第二材质会多一个 draw；这里合并成一张纸） */
  const paperGeo = mergeGeoms([{ geo: wingGeo }, { geo: keelGeo }]);
  wingGeo.dispose();
  keelGeo.dispose();
  const paperMesh = new THREE.Mesh(paperGeo, paperMat);
  paperMesh.castShadow = true;
  paperMesh.receiveShadow = true;

  /* 黄铜：脊梁 + 机头配重（合并 → 1 draw） */
  const spine = new THREE.BoxGeometry(0.016, 0.012, L * 0.62);
  const spineM = new THREE.Matrix4().makeTranslation(0, 0.033, 0.03);
  const bead = new THREE.SphereGeometry(0.020, 10, 7);
  const beadM = new THREE.Matrix4().makeTranslation(0, 0.005, -L / 2 + 0.022);
  const brassGeo = mergeGeoms([{ geo: spine, matrix: spineM }, { geo: bead, matrix: beadM }]);
  spine.dispose();
  bead.dispose();
  const brassMesh = new THREE.Mesh(brassGeo, brassMat);
  brassMesh.castShadow = true;

  const inner = new THREE.Group();
  inner.rotation.set(-0.045, 0, 0.16);
  inner.add(paperMesh);
  inner.add(brassMesh);
  g.add(inner);

  return {
    group: g,
    setColor(nextColor, nextAccent) {
      paperMat.color.set(nextColor);
      if (nextAccent !== undefined) brassMat.color.set(nextAccent);
    },
    dispose() {
      paperGeo.dispose();
      brassGeo.dispose();
      paperMat.dispose();
      brassMat.dispose();
      /* 贴图是模块级共享缓存，由 scene.dispose 统一管理，这里不释放 */
    }
  };
}
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

/* ============================ 手（V9.5 深色皮革飞行手套 · 3 节手指） ============================
 * 局部坐标：手指朝 -Z，掌面法线 +Y，腕口/前臂沿 +Z；group 整体 0.82×。
 * 每指 3 节（近/中/远节）+ 指根/PIP/DIP/指尖圆关节，InstancedMesh 按 per-finger 角度独立合拢；
 * 拇指 2 节 + 大鱼际；掌弓/掌垫/指根补强/双细缝线/腕带黄铜扣；皮质前臂自然收进画面。
 * draw：掌(1)+近节(1)+中节(1)+远节(1)+关节(1)+拇指近(1)+拇指远(1)+袖(1)+黄铜(1) = 9（≤12）。
 * ========================================================================== */
export function makeHand() {
  const group = new THREE.Group();
  group.name = 'hand';
  group.visible = false;
  group.scale.setScalar(0.82);   /* V9.5：0.68 → 0.82（lead 口径 0.78–0.85） */

  const skin = buildSkinTextures(256);
  const lt = buildLeatherTextures(128);
  const palmMat = new THREE.MeshStandardMaterial({
    vertexColors: true, map: skin.palm.map, color: 0xF6E3D3, roughness: 0.66, metalness: 0.0,
    normalMap: skin.palm.normal, normalScale: new THREE.Vector2(0.85, 0.85),
    roughnessMap: skin.palm.rough, envMapIntensity: 0.45
  });
  const fingerMat = new THREE.MeshStandardMaterial({
    map: skin.finger.map, color: 0xF6E3D3, roughness: 0.66, metalness: 0.0,
    normalMap: skin.finger.normal, normalScale: new THREE.Vector2(0.80, 0.80),
    roughnessMap: skin.finger.rough, envMapIntensity: 0.45
  });
  const nailMat = new THREE.MeshStandardMaterial({
    color: 0xF7E3DA, roughness: 0.28, metalness: 0.0, envMapIntensity: 1.2,
    transparent: true, opacity: 0.92
  });
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1D1B19, roughness: 0.88, metalness: 0.02,
    normalMap: lt.normal, normalScale: new THREE.Vector2(0.40, 0.40), envMapIntensity: 0.35
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xB08A57, roughness: 0.30, metalness: 0.88, envMapIntensity: 1.3
  });

  const up = new THREE.Vector3(0, 1, 0);
  const qTmp = new THREE.Quaternion();
  const pTmp = new THREE.Vector3();
  const sTmp = new THREE.Vector3();
  const mTmp = new THREE.Matrix4();
  const segM = (dir, cx, cy, cz, len, w) => {
    qTmp.setFromUnitVectors(up, dir);
    mTmp.compose(pTmp.set(cx, cy, cz), qTmp, sTmp.set(w, len, w));
    return mTmp.clone();
  };
  const ballM = (x, y, z, r) => {
    mTmp.compose(pTmp.set(x, y, z), qTmp.identity(), sTmp.set(r, r, r));
    return mTmp.clone();
  };
  const sphereUnit = new THREE.SphereGeometry(1, 12, 10);

  /* ---- 手掌（顶点色合并 1 draw）：掌体/掌根/大鱼际/小鱼际/掌弓/掌垫/指根补强/腕带/双缝线 ---- */
  const SKIN = [1.00, 0.99, 0.98], PAD = [1.00, 0.94, 0.90];
  const DARK = [0.90, 0.84, 0.80], BAND = [0.95, 0.90, 0.87];
  const palmParts = [];
  const ell = (x, y, z, rx, ry, rz, color) => {
    const mm = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(rx, ry, rz));
    palmParts.push({ geo: sphereUnit, matrix: mm, color });
  };
  /* 掌体（更厚）+ 掌根 + 鱼际垫 */
  ell(0, 0.006, 0.012, 0.134, 0.052, 0.132, SKIN);
  ell(0, -0.002, 0.112, 0.116, 0.046, 0.064, DARK);
  ell(0.084, -0.002, -0.045, 0.080, 0.050, 0.094, PAD);      /* 大鱼际（拇指侧） */
  ell(-0.086, -0.004, 0.012, 0.052, 0.040, 0.092, DARK);      /* 小鱼际 */
  ell(0, 0.028, -0.108, 0.134, 0.032, 0.046, DARK);           /* 指根垫 */
  ell(0, 0.047, -0.002, 0.056, 0.012, 0.104, PAD);            /* 掌弓 */
  ell(0, 0.051, -0.024, 0.090, 0.010, 0.082, PAD);            /* 掌垫 */
  /* 指根补强：4 个扁平小垫（随掌运动） */
  for (const x of [-0.096, -0.032, 0.032, 0.096]) {
    ell(x, 0.034, -0.130, 0.030, 0.013, 0.032, PAD);
  }
  /* 腕带 */
  const bandGeo = new THREE.CylinderGeometry(0.108, 0.114, 0.078, 16, 1);
  const bandM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  bandM.setPosition(0, -0.002, 0.214);
  palmParts.push({ geo: bandGeo, matrix: bandM, color: BAND });
  for (const z of [0.176, 0.252]) {
    const rg = new THREE.CylinderGeometry(0.114, 0.114, 0.010, 16, 1);
    const rm = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    rm.setPosition(0, -0.002, z);
    palmParts.push({ geo: rg, matrix: rm, color: BAND });
  }
  const palmGeo = mergePropGeoms(palmParts);
  palmParts.forEach((pp) => { if (pp.geo !== sphereUnit) pp.geo.dispose(); });
  const palmMesh = new THREE.Mesh(palmGeo, palmMat);
  palmMesh.castShadow = true;
  palmMesh.receiveShadow = true;
  group.add(palmMesh);

  /* ---- 四指：每指 3 节 + 4 圆关节（近/中/远/指尖），per-finger 独立 curl ---- */
  const segGeo = new THREE.CylinderGeometry(0.36, 0.50, 1, 8, 1, true);
  const FINGERS = [
    { x: -0.096, l0: 0.075, l1: 0.057, l2: 0.047, w: 0.060, sp: -0.05, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.080, l1: 0.060, l2: 0.051, w: 0.062, sp: -0.02, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.077, l1: 0.058, l2: 0.049, w: 0.060, sp: 0.02, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.067, l1: 0.051, l2: 0.042, w: 0.052, sp: 0.05, ph: 0.105, st: 0.86 }
  ];
  const prox = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const mid = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const dist = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const joints = new THREE.InstancedMesh(sphereUnit, fingerMat, 16);
  for (const mesh of [prox, mid, dist, joints]) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(mesh);
  }
  const nailGeo = new THREE.SphereGeometry(1, 8, 6);
  const nails = new THREE.InstancedMesh(nailGeo, nailMat, 4);
  nails.castShadow = true;
  nails.frustumCulled = false;
  nails.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(nails);
  const dummy = new THREE.Object3D();
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
  const KZ = -0.128, KY = 0.018;
  function setGripMatrices(k) {
    const kk = k < 0 ? 0 : k > 1 ? 1 : k;
    for (let i = 0; i < 4; i++) {
      const f = FINGERS[i];
      const ki = Math.max(0, Math.min(1, kk * f.st + (f.ph - 0.05)));
      /* 三节角度不同：近节抬、中节弯、远节再弯 → 指尖包住骰子侧/上缘 */
      const a0 = 0.10 + 0.40 * ki;
      const a1 = a0 + 0.20 + 0.62 * ki;
      const a2 = a1 + 0.16 + 0.72 * ki;
      const bx = f.x, by = KY, bz = KZ;
      const d0 = v1.set(Math.sin(f.sp), -Math.sin(a0), -Math.cos(a0)).normalize();
      const d1 = v2.set(Math.sin(f.sp) * 1.2, -Math.sin(a1), -Math.cos(a1)).normalize();
      const d2 = v0.set(Math.sin(f.sp) * 1.4, -Math.sin(a2), -Math.cos(a2)).normalize();
      /* 近节 */
      dummy.position.set(bx + d0.x * f.l0 / 2, by + d0.y * f.l0 / 2, bz + d0.z * f.l0 / 2);
      dummy.quaternion.setFromUnitVectors(up, d0);
      dummy.scale.set(f.w, f.l0, f.w);
      dummy.updateMatrix();
      prox.setMatrixAt(i, dummy.matrix);
      const px = bx + d0.x * f.l0, py = by + d0.y * f.l0, pz = bz + d0.z * f.l0;
      /* 中节 */
      dummy.position.set(px + d1.x * f.l1 / 2, py + d1.y * f.l1 / 2, pz + d1.z * f.l1 / 2);
      dummy.quaternion.setFromUnitVectors(up, d1);
      dummy.scale.set(f.w * 0.86, f.l1, f.w * 0.86);
      dummy.updateMatrix();
      mid.setMatrixAt(i, dummy.matrix);
      const mx = px + d1.x * f.l1, my = py + d1.y * f.l1, mz = pz + d1.z * f.l1;
      /* 远节 */
      dummy.position.set(mx + d2.x * f.l2 / 2, my + d2.y * f.l2 / 2, mz + d2.z * f.l2 / 2);
      dummy.quaternion.setFromUnitVectors(up, d2);
      dummy.scale.set(f.w * 0.70, f.l2, f.w * 0.70);
      dummy.updateMatrix();
      dist.setMatrixAt(i, dummy.matrix);
      const tx = mx + d2.x * f.l2, ty = my + d2.y * f.l2, tz = mz + d2.z * f.l2;
      /* 圆关节：MCP/PIP/DIP/指尖 */
      const rr = f.w * 0.54;
      const put = (idx, x, y, z, r) => {
        dummy.position.set(x, y, z);
        dummy.quaternion.identity();
        dummy.scale.set(r, r, r);
        dummy.updateMatrix();
        joints.setMatrixAt(idx, dummy.matrix);
      };
      put(i * 4, bx, by, bz, rr);
      put(i * 4 + 1, px, py, pz, rr * 0.88);
      put(i * 4 + 2, mx, my, mz, rr * 0.78);
      put(i * 4 + 3, tx, ty, tz, rr * 0.66);
      /* 指甲：远节可见面（+Y）扁平半透明椭圆，指尖处更明显 */
      dummy.position.set(
        mx + d2.x * f.l2 * 0.58,
        my + d2.y * f.l2 * 0.58 + f.w * 0.42,
        mz + d2.z * f.l2 * 0.58
      );
      dummy.quaternion.setFromUnitVectors(up, up);
      dummy.scale.set(f.w * 0.55, f.w * 0.12, f.l2 * 0.72);
      dummy.updateMatrix();
      nails.setMatrixAt(i, dummy.matrix);
    }
    prox.instanceMatrix.needsUpdate = true;
    mid.instanceMatrix.needsUpdate = true;
    dist.instanceMatrix.needsUpdate = true;
    joints.instanceMatrix.needsUpdate = true;
    nails.instanceMatrix.needsUpdate = true;
  }

  /* ---- 拇指：2 节 + 圆关节，从另一侧（掌内侧）压住骰子；近节 1 draw、远节 1 draw ---- */
  const thumbBase = new THREE.Group();
  thumbBase.position.set(-0.112, -0.006, -0.052);
  const TW = 0.064;
  const tdir = new THREE.Vector3(0, 0, -1);
  const tpParts = [];
  tpParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.053, 0.106, TW) });
  tpParts.push({ geo: sphereUnit, matrix: ballM(0, 0, 0.004, 0.034) });
  const tProxGeo = mergeGeoms(tpParts);
  const tProx = new THREE.Mesh(tProxGeo, fingerMat);
  tProx.castShadow = true; tProx.receiveShadow = true;
  thumbBase.add(tProx);
  const thumbMid = new THREE.Group();
  thumbMid.position.set(0, 0, -0.100);
  const tdParts = [];
  tdParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.044, 0.088, TW * 0.88) });
  tdParts.push({ geo: sphereUnit, matrix: ballM(0, 0, 0.0, 0.028) });
  tdParts.push({ geo: sphereUnit, matrix: ballM(0, 0, -0.084, 0.024) });
  const tDistGeo = mergeGeoms(tdParts);
  const tDist = new THREE.Mesh(tDistGeo, fingerMat);
  tDist.castShadow = true; tDist.receiveShadow = true;
  thumbMid.add(tDist);
  const tNailGeo = new THREE.SphereGeometry(1, 8, 6);
  const tNail = new THREE.Mesh(tNailGeo, nailMat);
  tNail.scale.set(TW * 0.52, TW * 0.11, 0.056);
  tNail.position.set(0, TW * 0.44, -0.050);
  thumbMid.add(tNail);
  thumbBase.add(thumbMid);
  group.add(thumbBase);

  /* ---- 前臂 / 袖：暖棕皮革 + 收口（1 draw） ---- */
  const sleeveParts = [];
  const armGeo = new THREE.CylinderGeometry(0.150, 0.108, 1.70, 14, 1);
  const armM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  armM.setPosition(0, -0.012, 1.14);
  sleeveParts.push({ geo: armGeo, matrix: armM });
  const cuffGeo = new THREE.CylinderGeometry(0.112, 0.118, 0.060, 14, 1);
  const cuffM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  cuffM.setPosition(0, -0.006, 0.295);
  sleeveParts.push({ geo: cuffGeo, matrix: cuffM });
  const sleeveGeo = mergeGeoms(sleeveParts);
  armGeo.dispose(); cuffGeo.dispose();
  const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
  sleeveMesh.castShadow = true; sleeveMesh.receiveShadow = true;
  group.add(sleeveMesh);

  /* ---- 黄铜扣件：腕带方扣（框+针）+ 铆钉 + 袖扣（1 draw） ---- */
  const brassParts = [];
  const frameW = 0.072, frameH = 0.011, frameD = 0.052, frameY = 0.116, frameZ = 0.300;
  for (const [dx, dz, w, d] of [[0, -frameD / 2, frameW, frameH], [0, frameD / 2, frameW, frameH], [-frameW / 2, 0, frameH, frameD], [frameW / 2, 0, frameH, frameD]]) {
    const g = new THREE.BoxGeometry(w, 0.010, d);
    brassParts.push({ geo: g, matrix: new THREE.Matrix4().makeTranslation(dx, frameY, frameZ + dz) });
  }
  const pin = new THREE.CylinderGeometry(0.0055, 0.0055, frameW * 0.82, 8);
  const pinM = new THREE.Matrix4().makeRotationZ(Math.PI / 2);
  pinM.setPosition(0, frameY + 0.006, frameZ);
  brassParts.push({ geo: pin, matrix: pinM });
  for (const x of [-0.062, 0.062]) {
    const rv = new THREE.SphereGeometry(0.011, 8, 6);
    brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.104, 0.300) });
  }
  const buckle = new THREE.BoxGeometry(0.085, 0.016, 0.060);
  brassParts.push({ geo: buckle, matrix: new THREE.Matrix4().makeTranslation(0, 0.122, 0.66) });
  const buckle2 = new THREE.BoxGeometry(0.030, 0.024, 0.070);
  brassParts.push({ geo: buckle2, matrix: new THREE.Matrix4().makeTranslation(0, 0.130, 0.66) });
  const brassGeo = mergeGeoms(brassParts);
  brassParts.forEach((bp) => bp.geo.dispose());
  const brassMesh = new THREE.Mesh(brassGeo, brassMat);
  brassMesh.castShadow = true;
  group.add(brassMesh);

  function setGrip(k) {
    const c = k < 0 ? 0 : k > 1 ? 1 : k;
    setGripMatrices(c);
    /* 拇指从掌内侧翻转压向骰子：yaw 向内、pitch 下压 */
    thumbBase.rotation.set(-0.15 - 0.55 * c, 2.55 - 0.35 * c, 0.10 + 0.30 * c);
    thumbMid.rotation.x = -0.25 - 0.80 * c;
  }
  setGrip(0);

  return {
    group,
    setGrip,
    gripLocal: new THREE.Vector3(0, -0.203, -0.128),
    textures: [skin.palm.map, skin.palm.normal, skin.palm.rough, skin.finger.map, skin.finger.normal, skin.finger.rough, lt.normal, lt.rough],
    dispose() {
      palmGeo.dispose(); segGeo.dispose(); sphereUnit.dispose(); nailGeo.dispose();
      tProxGeo.dispose(); tDistGeo.dispose(); tNailGeo.dispose(); sleeveGeo.dispose(); brassGeo.dispose();
      palmMat.dispose(); fingerMat.dispose(); nailMat.dispose(); sleeveMat.dispose(); brassMat.dispose();
      group.clear();
    }
  };
}


/* ============================ 光斑 / 阴影 / 涟漪 / 风线 ============================ */
export function makeShadowPlane(size, opacity) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: makeShadowTex(), transparent: true, opacity: opacity === undefined ? 0.5 : opacity,
      depthWrite: false, color: 0x000000
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.006;
  return m;
}

export function makeGlowPlane(size, color) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: makeGlowTex(), transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color, fog: false, toneMapped: false
    })
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

export function makeRippleMesh(size) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: makeRippleTex(), transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xFFD8A2, fog: false, toneMapped: false
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.01;
  return m;
}

export function makeStreakGroup(texture) {
  const group = new THREE.Group();
  group.visible = false;
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.36, depthWrite: false,
    blending: THREE.AdditiveBlending, color: 0xFFE8C8, fog: false, toneMapped: false
  });
  const items = [];
  for (let i = 0; i < 10; i++) {
    const geo = new THREE.PlaneGeometry(0.045, 2.4);
    const m = new THREE.Mesh(geo, mat);
    const a = (i / 10) * Math.PI * 2 + (i % 3) * 0.3;
    const rad = 0.55 + (i % 4) * 0.24;
    m.position.set(Math.cos(a) * rad, 0.45 + (i % 5) * 0.22, -2.2 + (i % 3) * 1.3);
    m.rotation.z = (i % 2 ? 1 : -1) * 0.06;
    group.add(m);
    items.push(m);
  }
  return {
    group,
    update(dt, active) {
      if (!active) return;
      for (const m of items) {
        m.position.z += dt * 0.0065;
        if (m.position.z > 3.4) m.position.z -= 6.2;
      }
    },
    dispose() {
      items.forEach((m) => m.geometry.dispose());
      mat.dispose();
    }
  };
}

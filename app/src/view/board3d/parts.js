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
  makeGlowTex, makeShadowTex, makeRippleTex, buildPaperTextures, buildBrushedBrass
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

/* ============================ 手（V9.3 程序化低模） ============================
 * 局部坐标：手指朝 -Z，掌面法线 +Y，腕口/前臂沿 +Z。
 * 手掌+腕口（皮革）1 draw + 4 指（合并）1 draw + 拇指 1 draw + 前臂/袖（布）1 draw = 4 draw。
 * 手指/拇指各挂 pivot：setGrip(0..1) = 张开 → 合拢托住骰子。
 * 尺寸相对骰子（0.34）刻意略大，保证 320–430 上轮廓可读。 */
export function makeHand() {
  const group = new THREE.Group();
  group.name = 'hand';
  group.visible = false;

  const leather = new THREE.MeshStandardMaterial({
    color: 0xB98A62, roughness: 0.56, metalness: 0.03, envMapIntensity: 0.7
  });
  const cloth = new THREE.MeshStandardMaterial({
    color: 0x1B2531, roughness: 0.88, metalness: 0.02, envMapIntensity: 0.3
  });
  const T = (x, y, z) => { const m = new THREE.Matrix4(); m.makeTranslation(x, y, z); return m; };
  const RX = (a) => { const m = new THREE.Matrix4(); m.makeRotationX(a); return m; };

  /* ---- 手掌：圆角掌垫 + 腕口 + 指根垫（合并；同一皮革材质） ---- */
  const palmParts = [];
  const palm = new THREE.BoxGeometry(0.196, 0.058, 0.190, 1, 1, 1);
  palmParts.push({ geo: palm, matrix: T(0, 0, 0) });
  const heel = new THREE.BoxGeometry(0.168, 0.066, 0.062, 1, 1, 1);
  palmParts.push({ geo: heel, matrix: T(0, -0.002, 0.082) });
  const knuckle = new THREE.BoxGeometry(0.176, 0.036, 0.052, 1, 1, 1);
  palmParts.push({ geo: knuckle, matrix: T(0, 0.022, -0.078) });
  /* 腕口：短圆柱，略向外扩（飞行手套的收口） */
  const cuff = new THREE.CylinderGeometry(0.086, 0.092, 0.052, 12, 1);
  const cuffM = RX(Math.PI / 2); cuffM.setPosition(0, -0.004, 0.212);
  palmParts.push({ geo: cuff, matrix: cuffM });
  const palmGeo = mergeGeoms(palmParts);
  palmParts.forEach((p) => p.geo.dispose());
  const palmMesh = new THREE.Mesh(palmGeo, leather);
  palmMesh.castShadow = true;
  palmMesh.receiveShadow = true;
  group.add(palmMesh);

  /* ---- 四指：两节 + 圆指尖，合并 1 draw，挂在指根 pivot 上 ---- */
  const fingers = new THREE.Group();
  fingers.position.set(0, 0.006, -0.090);
  const fParts = [];
  const FINGERS = [
    { x: -0.066, l0: 0.072, l1: 0.058, w: 0.034, sp: -0.010 },
    { x: -0.021, l0: 0.080, l1: 0.064, w: 0.036, sp: -0.003 },
    { x: 0.024, l0: 0.076, l1: 0.060, w: 0.035, sp: 0.003 },
    { x: 0.067, l0: 0.064, l1: 0.050, w: 0.032, sp: 0.010 }
  ];
  const A0 = 0.16, A1 = 0.46;
  for (const f of FINGERS) {
    const y1 = -0.004 - Math.sin(A0) * f.l0;
    const z1 = -Math.cos(A0) * f.l0;
    const m0 = RX(-A0);
    m0.setPosition(f.x, (-0.004 + y1) / 2, z1 / 2);
    fParts.push({ geo: new THREE.BoxGeometry(f.w, f.w * 0.92, f.l0), matrix: m0 });
    const x2 = f.x + f.sp;
    const y2 = y1 - Math.sin(A1) * f.l1;
    const z2 = z1 - Math.cos(A1) * f.l1;
    const m1 = RX(-A1);
    m1.setPosition(x2, (y1 + y2) / 2, (z1 + z2) / 2);
    fParts.push({ geo: new THREE.BoxGeometry(f.w * 0.88, f.w * 0.82, f.l1), matrix: m1 });
    fParts.push({ geo: new THREE.SphereGeometry(f.w * 0.42, 6, 4), matrix: T(x2, y2, z2) });
  }
  const fingerGeo = mergeGeoms(fParts);
  fParts.forEach((p) => p.geo.dispose());
  const fingerMesh = new THREE.Mesh(fingerGeo, leather);
  fingerMesh.castShadow = true;
  fingerMesh.receiveShadow = true;
  fingers.add(fingerMesh);
  group.add(fingers);

  /* ---- 拇指：两节 + 指尖，指向内前（-x -z），挂在掌侧 pivot ---- */
  const thumb = new THREE.Group();
  thumb.position.set(0.096, -0.008, -0.044);
  const thumbParts = [];
  const d0 = new THREE.Vector3(-0.44, -0.30, -0.84).normalize();
  const d1 = new THREE.Vector3(-0.74, -0.42, -0.52).normalize();
  const seg = (from, dir, len, w, h) => {
    const geo = new THREE.BoxGeometry(w, h, len);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, -1), dir);
    const m = new THREE.Matrix4().makeRotationFromQuaternion(q);
    m.setPosition(from.x + dir.x * len / 2, from.y + dir.y * len / 2, from.z + dir.z * len / 2);
    thumbParts.push({ geo, matrix: m });
  };
  seg(new THREE.Vector3(0, 0, 0), d0, 0.078, 0.046, 0.042);
  const j = d0.clone().multiplyScalar(0.078);
  seg(j, d1, 0.062, 0.040, 0.036);
  const tip = j.clone().addScaledVector(d1, 0.062);
  thumbParts.push({ geo: new THREE.SphereGeometry(0.017, 6, 4), matrix: T(tip.x, tip.y, tip.z) });
  const thumbGeo = mergeGeoms(thumbParts);
  thumbParts.forEach((p) => p.geo.dispose());
  const thumbMesh = new THREE.Mesh(thumbGeo, leather);
  thumbMesh.castShadow = true;
  thumbMesh.receiveShadow = true;
  thumb.add(thumbMesh);
  group.add(thumb);

  /* ---- 前臂 / 袖：布质锥筒，向画面外延伸 ---- */
  const sleeveParts = [];
  const arm = new THREE.CylinderGeometry(0.108, 0.076, 0.74, 12, 1);
  const armM = RX(Math.PI / 2); armM.setPosition(0, -0.018, 0.640);
  sleeveParts.push({ geo: arm, matrix: armM });
  const band = new THREE.CylinderGeometry(0.094, 0.100, 0.030, 12, 1);
  const bandM = RX(Math.PI / 2); bandM.setPosition(0, -0.008, 0.258);
  sleeveParts.push({ geo: band, matrix: bandM });
  const sleeveGeo = mergeGeoms(sleeveParts);
  sleeveParts.forEach((p) => p.geo.dispose());
  const sleeveMesh = new THREE.Mesh(sleeveGeo, cloth);
  sleeveMesh.castShadow = true;
  sleeveMesh.receiveShadow = true;
  group.add(sleeveMesh);

  function setGrip(k) {
    const c = k < 0 ? 0 : k > 1 ? 1 : k;
    fingers.rotation.x = -0.10 - c * 0.82;
    thumb.rotation.set(-0.10 - c * 0.34, 0.10 + c * 0.46, 0.02 + c * 0.16);
  }
  setGrip(0);

  return {
    group,
    setGrip,
    gripLocal: new THREE.Vector3(0, -0.202, -0.028),
    dispose() {
      palmGeo.dispose(); fingerGeo.dispose(); thumbGeo.dispose(); sleeveGeo.dispose();
      leather.dispose(); cloth.dispose();
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

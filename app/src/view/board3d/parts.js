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

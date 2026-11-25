/* ==========================================================================
 * V8 · 真 3D 主桌 · 低模零件：格几何 / 纸飞机 / 光斑 / 阴影
 * 几何与 P0 原型一致（已验证比例），生产侧只补 setColor / dispose 句柄。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { SLOT_DARK, uvOfSlot } from './constants.js';
import { makeGlowTex, makeShadowTex, makeRippleTex } from './textures.js';

/* 合并静态格：顶面用图集 UV，侧面用顶点色。tiles: [{x,z,rot,w,d,top,bottom,uv,side,color}] */
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
    const A = loc(-hw, hd, t.top), B = loc(hw, hd, t.top), C = loc(hw, -hd, t.top), D = loc(-hw, -hd, t.top);
    const u0 = t.uv[0], v0 = t.uv[1], u1 = t.uv[2], v1 = t.uv[3];
    pushQuad(A, B, C, D, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]], [1, 1, 1]);
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

/* 低模纸飞机：返回 { group, setColor(colorHex, accentHex), dispose() } */
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

  const wingVerts = [];
  const tri = (arr, a, b, c) => arr.push(...a, ...b, ...c);
  tri(wingVerts, nose, wl, mid);
  tri(wingVerts, nose, mid, wr);
  tri(wingVerts, mid, wl, tail);
  tri(wingVerts, mid, tail, wr);
  const keelVerts = [];
  tri(keelVerts, nose, keel, mid);
  tri(keelVerts, mid, keel, tail);
  tri(keelVerts, tail, keel, finTop);

  const mk = (verts, mat) => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = true;
    return m;
  };
  const wingMat = new THREE.MeshLambertMaterial({ color: colorHex, side: THREE.DoubleSide, emissive: 0x140A06 });
  const foldMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(colorHex).multiplyScalar(0.68), side: THREE.DoubleSide, emissive: 0x0E0604 });
  const spineMat = new THREE.MeshLambertMaterial({ color: accentHex });

  const inner = new THREE.Group();
  inner.rotation.set(-0.045, 0, 0.16);   // 轻微横滚/抬头：让机翼有明暗、读出立体感
  const wingMesh = mk(wingVerts, wingMat);
  const keelMesh = mk(keelVerts, foldMat);
  inner.add(wingMesh);
  inner.add(keelMesh);
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.012, L * 0.62), spineMat);
  spine.position.set(0, 0.033, 0.03);
  inner.add(spine);
  g.add(inner);

  const geos = [wingMesh.geometry, keelMesh.geometry, spine.geometry];
  const mats = [wingMat, foldMat, spineMat];
  return {
    group: g,
    setColor(nextColor, nextAccent) {
      wingMat.color.set(nextColor);
      foldMat.color.set(new THREE.Color(nextColor).multiplyScalar(0.68));
      if (nextAccent !== undefined) spineMat.color.set(nextAccent);
    },
    dispose() {
      geos.forEach((geo) => geo.dispose());
      mats.forEach((m) => m.dispose());
    }
  };
}

export function makeShadowPlane(size, opacity) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map: makeShadowTex(), transparent: true, opacity: opacity === undefined ? 0.5 : opacity, depthWrite: false })
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
      blending: THREE.AdditiveBlending, color, fog: false
    })
  );
  m.rotation.x = -Math.PI / 2;
  return m;
}

/* 落地涟漪：水平圆环，playRipple 时放大淡出 */
export function makeRippleMesh(size) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({
      map: makeRippleTex(), transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, color: 0xFFD8A2, fog: false
    })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.01;
  return m;
}

/* 速度线（fly 时的 3D 风线；reduced 不显示）：一簇沿 +Z 拉长的加色片 */
export function makeStreakGroup(texture) {
  const group = new THREE.Group();
  group.visible = false;
  const mat = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: 0.5, depthWrite: false,
    blending: THREE.AdditiveBlending, color: 0xFFF0D8, fog: false
  });
  const items = [];
  for (let i = 0; i < 12; i++) {
    const geo = new THREE.PlaneGeometry(0.05, 2.6);
    const m = new THREE.Mesh(geo, mat);
    const a = (i / 12) * Math.PI * 2 + (i % 3) * 0.3;
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

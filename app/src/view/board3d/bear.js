/* ==========================================================================
 * V9 · 真 3D 主桌 · 小熊（绒布 / 毛毡 PBR，无外部模型）
 *   - 球 / 胶囊基础体，按材质合并成 7 个 mesh（V8 是 ~20 个 draw）
 *   - 绒布：felt color/normal 贴图 + roughness 0.95；帽子/围巾毛毡；帽徽黄铜
 *   - 真实投影（castShadow），坐/站都在 45° 舞台格上
 * 三主题服装：cloud=机长 / star=星轨 / paper=纸月（只换颜色，几何不变）
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { TILE_H, STAGE_AZIM, DEG, MAT } from './constants.js';
import { buildFeltTextures, buildBrushedBrass } from './textures.js';

let _felt = null, _brass = null;
function felt() {
  if (!_felt) _felt = buildFeltTextures(0xCFC6BA, 128);
  return _felt;
}
function brass() {
  if (!_brass) _brass = buildBrushedBrass(96);
  return _brass;
}

export function createBear() {
  const group = new THREE.Group();
  const ft = felt();
  const bt = brass();

  const mats = {
    fur: new THREE.MeshStandardMaterial({
      map: ft.map, normalMap: ft.normal, normalScale: new THREE.Vector2(0.85, 0.85),
      color: 0x8A6A4C, roughness: MAT.felt.roughness, metalness: 0, envMapIntensity: 0.35
    }),
    furDark: new THREE.MeshStandardMaterial({
      map: ft.map, normalMap: ft.normal, normalScale: new THREE.Vector2(0.7, 0.7),
      color: 0x6C513A, roughness: 0.96, metalness: 0, envMapIntensity: 0.3
    }),
    cream: new THREE.MeshStandardMaterial({
      map: ft.map, color: 0xE8D6BB, roughness: 0.9, metalness: 0, envMapIntensity: 0.35
    }),
    ink: new THREE.MeshStandardMaterial({ color: 0x141010, roughness: 0.22, metalness: 0.15, envMapIntensity: 0.9 }),
    hat: new THREE.MeshStandardMaterial({
      map: ft.map, normalMap: ft.normal, color: 0x25344E, roughness: 0.86, metalness: 0.02, envMapIntensity: 0.4
    }),
    band: new THREE.MeshStandardMaterial({
      map: bt.map, normalMap: bt.normal, roughnessMap: bt.rough,
      color: 0xC9A063, roughness: MAT.brass.roughness, metalness: MAT.brass.metalness, envMapIntensity: MAT.brass.envMapIntensity
    }),
    scarf: new THREE.MeshStandardMaterial({
      map: ft.map, normalMap: ft.normal, color: 0x8E3B3B, roughness: 0.94, metalness: 0, envMapIntensity: 0.3
    })
  };

  /* 收集每个材质的几何（先各自摆位，再按材质合并） */
  const buckets = {};
  const _o = new THREE.Object3D();
  const add = (key, geo, x, y, z, rot, scale) => {
    _o.position.set(x, y, z);
    _o.rotation.set(rot ? rot[0] || 0 : 0, rot ? rot[1] || 0 : 0, rot ? rot[2] || 0 : 0);
    _o.scale.set(scale ? scale[0] : 1, scale ? scale[1] : 1, scale ? scale[2] : 1);
    _o.updateMatrix();
    (buckets[key] = buckets[key] || []).push({ geo, matrix: _o.matrix.clone() });
  };

  /* 身体 / 头（帽子不压眼睛） */
  add('fur', new THREE.SphereGeometry(0.135, 14, 10), 0, 0.155, 0);
  add('fur', new THREE.SphereGeometry(0.125, 14, 10), 0, 0.375, 0);
  add('cream', new THREE.SphereGeometry(0.062, 12, 9), 0, 0.345, -0.100);   // 吻部
  add('ink', new THREE.SphereGeometry(0.019, 10, 8), 0, 0.368, -0.152);     // 鼻
  add('ink', new THREE.SphereGeometry(0.017, 8, 6), -0.050, 0.420, -0.116); // 眼
  add('ink', new THREE.SphereGeometry(0.017, 8, 6), 0.050, 0.420, -0.116);
  /* 耳 */
  add('furDark', new THREE.SphereGeometry(0.047, 12, 9), -0.082, 0.462, 0.004);
  add('furDark', new THREE.SphereGeometry(0.047, 12, 9), 0.082, 0.462, 0.004);
  /* 手 / 脚 */
  add('fur', new THREE.CapsuleGeometry(0.028, 0.085, 3, 8), -0.128, 0.185, 0, [0, 0, 0.55]);
  add('fur', new THREE.CapsuleGeometry(0.028, 0.085, 3, 8), 0.128, 0.185, 0, [0, 0, -0.55]);
  add('furDark', new THREE.SphereGeometry(0.05, 10, 8), -0.062, 0.042, -0.018);
  add('furDark', new THREE.SphereGeometry(0.05, 10, 8), 0.062, 0.042, -0.018);
  /* 围巾 */
  add('scarf', new THREE.TorusGeometry(0.118, 0.032, 7, 18), 0, 0.268, 0, [Math.PI / 2, 0, 0]);
  add('scarf', new THREE.BoxGeometry(0.07, 0.1, 0.026), 0.095, 0.215, 0.05, [0.2, 0.1, -0.2]);
  /* 帽子（机长帽 / 星轨帽 / 纸帽共用结构） */
  add('hat', new THREE.CylinderGeometry(0.098, 0.106, 0.058, 16, 1), 0, 0.468, 0.012);
  add('band', new THREE.CylinderGeometry(0.104, 0.104, 0.012, 18, 1), 0, 0.443, 0.012);
  add('hat', new THREE.SphereGeometry(0.062, 14, 9), 0, 0.474, -0.062, null, [1.04, 0.17, 0.52]); // 帽檐（抬高，不挡眼睛）
  /* 帽徽 */
  add('band', new THREE.TorusGeometry(0.026, 0.008, 5, 14), 0, 0.468, -0.092, [-0.5, 0, 0]);

  const geos = [];
  for (const key of Object.keys(buckets)) {
    const parts = buckets[key];
    const merged = mergeParts(parts);
    const mesh = new THREE.Mesh(merged, mats[key]);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    geos.push(merged);
    parts.forEach((p) => p.geo.dispose());
  }

  group.position.y = TILE_H;
  group.rotation.y = Math.PI + STAGE_AZIM * DEG;
  group.scale.setScalar(0.001);
  group.visible = false;

  return {
    group,
    setOutfit(outfit) {
      if (!outfit) return;
      if (outfit.fur !== undefined) mats.fur.color.set(outfit.fur);
      if (outfit.furDark !== undefined) mats.furDark.color.set(outfit.furDark);
      if (outfit.hat !== undefined) mats.hat.color.set(outfit.hat);
      if (outfit.band !== undefined) mats.band.color.set(outfit.band);
      if (outfit.scarf !== undefined) mats.scarf.color.set(outfit.scarf);
    },
    setVisible(v) { group.visible = !!v; },
    dispose() {
      geos.forEach((g) => g.dispose());
      Object.keys(mats).forEach((k) => mats[k].dispose());
    }
  };
}

/* 按材质合并：position / normal / uv */
function mergeParts(parts) {
  const pos = [], nrm = [], uv = [];
  for (const { geo, matrix } of parts) {
    const g = geo.index ? geo.toNonIndexed() : geo.clone();
    g.applyMatrix4(matrix);
    const p = g.getAttribute('position');
    const n = g.getAttribute('normal');
    const u = g.getAttribute('uv');
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      if (n) nrm.push(n.getX(i), n.getY(i), n.getZ(i));
      if (u) uv.push(u.getX(i), u.getY(i)); else uv.push(0, 0);
    }
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  if (nrm.length) out.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
  else out.computeVertexNormals();
  out.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  return out;
}

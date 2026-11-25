/* ==========================================================================
 * V8 · 真 3D 主桌 · 低模小熊（球/圆柱/胶囊；无外部模型）
 * 三主题服装：cloud=pilot / star=starlight / paper=paper（只换帽/围巾/毛色材质）。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import { TILE_H, STAGE_AZIM, DEG } from './constants.js';

export function createBear() {
  const group = new THREE.Group();
  const mats = {
    fur: new THREE.MeshLambertMaterial({ color: 0x9A6F4B }),
    furDark: new THREE.MeshLambertMaterial({ color: 0x7A543A }),
    cream: new THREE.MeshLambertMaterial({ color: 0xF0D9B5 }),
    ink: new THREE.MeshLambertMaterial({ color: 0x2A1B16 }),
    hat: new THREE.MeshLambertMaterial({ color: 0x2C3E66 }),
    band: new THREE.MeshLambertMaterial({ color: 0xE8B65C }),
    scarf: new THREE.MeshLambertMaterial({ color: 0xD8564C })
  };

  const add = (geo, mat, x, y, z, rot) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    m.castShadow = false;
    group.add(m);
    return m;
  };

  /* 身体 / 头（帽子不压眼睛） */
  add(new THREE.SphereGeometry(0.135, 12, 9), mats.fur, 0, 0.155, 0);
  add(new THREE.SphereGeometry(0.125, 12, 9), mats.fur, 0, 0.375, 0);
  add(new THREE.SphereGeometry(0.062, 10, 8), mats.cream, 0, 0.345, -0.100);    // 吻部
  add(new THREE.SphereGeometry(0.019, 8, 6), mats.ink, 0, 0.365, -0.150);       // 鼻
  add(new THREE.SphereGeometry(0.016, 6, 5), mats.ink, -0.05, 0.412, -0.108);   // 眼
  add(new THREE.SphereGeometry(0.016, 6, 5), mats.ink, 0.05, 0.412, -0.108);
  /* 耳 */
  add(new THREE.SphereGeometry(0.047, 10, 8), mats.furDark, -0.082, 0.462, 0.004);
  add(new THREE.SphereGeometry(0.047, 10, 8), mats.furDark, 0.082, 0.462, 0.004);
  /* 手 / 脚 */
  add(new THREE.CapsuleGeometry(0.028, 0.085, 3, 7), mats.fur, -0.128, 0.185, 0, [0, 0, 0.55]);
  add(new THREE.CapsuleGeometry(0.028, 0.085, 3, 7), mats.fur, 0.128, 0.185, 0, [0, 0, -0.55]);
  add(new THREE.SphereGeometry(0.05, 9, 7), mats.furDark, -0.062, 0.042, -0.018);
  add(new THREE.SphereGeometry(0.05, 9, 7), mats.furDark, 0.062, 0.042, -0.018);
  /* 围巾 */
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.118, 0.032, 6, 16), mats.scarf);
  scarf.position.set(0, 0.268, 0);
  scarf.rotation.set(Math.PI / 2, 0, 0);
  group.add(scarf);
  const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.1, 0.026), mats.scarf);
  scarfTail.position.set(0.095, 0.215, 0.05);
  scarfTail.rotation.set(0.2, 0.1, -0.2);
  group.add(scarfTail);
  /* 帽子（机长帽 / 星轨帽 / 纸帽共用结构） */
  add(new THREE.CylinderGeometry(0.098, 0.106, 0.058, 14, 1), mats.hat, 0, 0.468, 0.012);
  add(new THREE.CylinderGeometry(0.104, 0.104, 0.012, 16, 1), mats.band, 0, 0.443, 0.012);
  const visor = add(new THREE.SphereGeometry(0.062, 12, 8), mats.hat, 0, 0.451, -0.088);
  visor.scale.set(1.12, 0.2, 0.8);
  /* 帽徽 */
  const badge = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.008, 5, 12), mats.band);
  badge.position.set(0, 0.468, -0.092);
  badge.rotation.set(-0.5, 0, 0);
  group.add(badge);

  group.position.y = TILE_H;
  group.rotation.y = Math.PI + STAGE_AZIM * DEG;
  group.scale.setScalar(0.001);
  group.visible = false;

  const geos = [];
  group.traverse((o) => { if (o.isMesh && o.geometry) geos.push(o.geometry); });

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

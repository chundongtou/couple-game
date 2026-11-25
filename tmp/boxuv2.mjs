import * as THREE from '../app/render/node_modules/three/build/three.module.js';
import { DIE_FACES } from '../app/src/view/board3d/constants.js';
const g = new THREE.BoxGeometry(0.34, 0.34, 0.34, 6, 6, 6);
const pos = g.getAttribute('position');
const uv = g.getAttribute('uv');
const idx = g.index;
let vi = -1;
for (let i = 0; i < pos.count; i++) {
  if (Math.abs(pos.getX(i)) < 1e-6 && Math.abs(pos.getY(i) - 0.17) < 1e-6 && Math.abs(pos.getZ(i)) < 1e-6) { vi = i; break; }
}
console.log('vertex', vi, 'uv before', uv.getX(vi), uv.getY(vi), 'group?', (() => {
  for (let f = 0; f < 6; f++) { const gp = g.groups[f]; for (let k = gp.start; k < gp.start + gp.count; k++) if (idx.getX(k) === vi) return f; }
  return -1;
})());
/* apply remap exactly as makeDieGeometry */
for (let f = 0; f < 6; f++) {
  const value = DIE_FACES[f];
  const col = (value - 1) % 3;
  const row = Math.floor((value - 1) / 3);
  const gp = g.groups[f];
  for (let k = gp.start; k < gp.start + gp.count; k++) {
    const v2 = idx.getX(k);
    uv.setXY(v2, (col + uv.getX(v2)) / 3, (1 - row + uv.getY(v2)) / 2);
  }
}
console.log('uv after', uv.getX(vi), uv.getY(vi));

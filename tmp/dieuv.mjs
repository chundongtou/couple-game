import * as THREE from '../app/render/node_modules/three/build/three.module.js';
import { makeDieGeometry } from '../app/src/view/board3d/parts.js';
const g = makeDieGeometry(0.34);
const uv = g.getAttribute('uv');
const idx = g.index;
console.log('groups', g.groups.length, 'verts', g.getAttribute('position').count, 'tris', idx.count / 3);
for (let f = 0; f < 6; f++) {
  const gp = g.groups[f];
  let u0 = 9, u1 = -9, v0 = 9, v1 = -9, n = 0;
  for (let k = gp.start; k < gp.start + gp.count; k++) {
    const vi = idx.getX(k);
    const u = uv.getX(vi), v = uv.getY(vi);
    u0 = Math.min(u0, u); u1 = Math.max(u1, u); v0 = Math.min(v0, v); v1 = Math.max(v1, v);
    n++;
  }
  console.log('face', f, 'verts', n, 'u', u0.toFixed(3), u1.toFixed(3), 'v', v0.toFixed(3), v1.toFixed(3));
}

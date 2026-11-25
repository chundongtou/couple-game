import * as THREE from '../app/render/node_modules/three/build/three.module.js';
const g = new THREE.BoxGeometry(0.34, 0.34, 0.34, 6, 6, 6);
const pos = g.getAttribute('position');
const uv = g.getAttribute('uv');
const idx = g.index;
console.log('verts', pos.count, 'tris', idx.count / 3, 'groups', g.groups.length);
for (let f = 0; f < 6; f++) {
  const gp = g.groups[f];
  let best = -1, bestd = 1e9;
  for (let k = gp.start; k < gp.start + gp.count; k++) {
    const vi = idx.getX(k);
    const d = Math.abs(pos.getX(vi)) + Math.abs(pos.getY(vi)) + Math.abs(pos.getZ(vi));
    // find the vertex nearest the face center for this face
  }
  // print first 4 vertices' pos/uv of the face
  console.log('face', f);
  for (let k = gp.start; k < gp.start + 24; k += 8) {
    const vi = idx.getX(k);
    console.log('  v', vi, 'p', pos.getX(vi).toFixed(2), pos.getY(vi).toFixed(2), pos.getZ(vi).toFixed(2), 'uv', uv.getX(vi).toFixed(2), uv.getY(vi).toFixed(2));
  }
}

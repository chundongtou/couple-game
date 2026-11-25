import * as THREE from '../app/render/node_modules/three/build/three.module.js';
import { makeDieGeometry } from '../app/src/view/board3d/parts.js';
const g = makeDieGeometry(0.34);
const pos = g.getAttribute('position');
const uv = g.getAttribute('uv');
const idx = g.index;
const nrm = g.getAttribute('normal');
for (let f = 0; f < 6; f++) {
  const gp = g.groups[f];
  console.log('=== face', f);
  let shown = 0;
  for (let k = gp.start; k < gp.start + gp.count && shown < 6; k += 7) {
    const vi = idx.getX(k);
    console.log('  v', vi, 'p', pos.getX(vi).toFixed(3), pos.getY(vi).toFixed(3), pos.getZ(vi).toFixed(3),
      'uv', uv.getX(vi).toFixed(3), uv.getY(vi).toFixed(3),
      'n', nrm.getX(vi).toFixed(2), nrm.getY(vi).toFixed(2), nrm.getZ(vi).toFixed(2));
    shown++;
  }
}

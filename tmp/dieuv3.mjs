import * as THREE from '../app/render/node_modules/three/build/three.module.js';
import { makeDieGeometry } from '../app/src/view/board3d/parts.js';
const g = makeDieGeometry(0.34);
const pos = g.getAttribute('position');
const uv = g.getAttribute('uv');
console.log('total verts', pos.count);
let found = 0;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
  if (Math.abs(x) < 0.03 && Math.abs(y - 0.17) < 0.03 && Math.abs(z) < 0.03) {
    console.log('top-center v', i, 'p', x.toFixed(3), y.toFixed(3), z.toFixed(3), 'uv', uv.getX(i).toFixed(4), uv.getY(i).toFixed(4));
    found++;
  }
}
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
  if (Math.abs(x) < 0.03 && Math.abs(y) < 0.03 && Math.abs(z - 0.17) < 0.03) {
    console.log('front-center v', i, 'uv', uv.getX(i).toFixed(4), uv.getY(i).toFixed(4));
    found++;
  }
}
console.log('found', found);

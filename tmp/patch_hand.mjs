import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 60).replace(/\n/g, '\\n')); return; }
  s = s.replace(a, b);
};
rep(`  const group = new THREE.Group();
  group.name = 'hand';
  group.visible = false;`, `  const group = new THREE.Group();
  group.name = 'hand';
  group.visible = false;
  group.scale.setScalar(0.68);   /* V9.4.1：整体缩到 0.68，避免巨大手套感 */`);
rep('const LEATHER = [0.54, 0.29, 0.145], PAD = [0.66, 0.42, 0.235];', 'const LEATHER = [0.105, 0.058, 0.032], PAD = [0.150, 0.088, 0.050];');
rep('const DARK = [0.36, 0.19, 0.09], BAND = [0.11, 0.075, 0.05], STITCH = [0.13, 0.085, 0.055];', 'const DARK = [0.070, 0.038, 0.021], BAND = [0.032, 0.020, 0.013], STITCH = [0.016, 0.010, 0.006];');
rep('color: 0xB98A62, roughness: 0.60, metalness: 0.02,', 'color: 0x5A4230, roughness: 0.80, metalness: 0.02,');
rep('color: 0x2C211A, roughness: 0.82, metalness: 0.02,', 'color: 0x241A14, roughness: 0.86, metalness: 0.02,');
rep(`  const dash = new THREE.BoxGeometry(0.010, 0.0035, 0.0035);
  for (let i = 0; i < 5; i++) {
    const z = -0.088 + i * 0.038;
    for (const x of [-0.088, 0.088]) {
      palmParts.push({ geo: dash, matrix: new THREE.Matrix4().makeTranslation(x, 0.049, z), color: STITCH });
    }
  }`, `  /* V9.4.1：缝线改成两条细暗线（不再是黑色圆点） */
  const seam = new THREE.BoxGeometry(0.0035, 0.0030, 0.150);
  for (const x of [-0.083, 0.083]) {
    palmParts.push({ geo: seam, matrix: new THREE.Matrix4().makeTranslation(x, 0.048, -0.012), color: STITCH });
  }`);
rep(`palmParts.forEach((pp) => { if (pp.geo !== sphereUnit && pp.geo !== dash) pp.geo.dispose(); });
  dash.dispose();`, `palmParts.forEach((pp) => { if (pp.geo !== sphereUnit && pp.geo !== seam) pp.geo.dispose(); });
  seam.dispose();`);
rep(`    { x: -0.096, l0: 0.098, l1: 0.080, w: 0.052, sp: -0.11, ph: 0.00 },
    { x: -0.033, l0: 0.106, l1: 0.088, w: 0.054, sp: -0.04, ph: 0.03 },
    { x: 0.033, l0: 0.102, l1: 0.084, w: 0.052, sp: 0.04, ph: 0.06 },
    { x: 0.098, l0: 0.088, l1: 0.072, w: 0.046, sp: 0.11, ph: 0.09 }`, `    { x: -0.096, l0: 0.090, l1: 0.074, w: 0.058, sp: -0.11, ph: 0.00 },
    { x: -0.033, l0: 0.098, l1: 0.082, w: 0.060, sp: -0.04, ph: 0.03 },
    { x: 0.033, l0: 0.094, l1: 0.078, w: 0.058, sp: 0.04, ph: 0.06 },
    { x: 0.098, l0: 0.080, l1: 0.066, w: 0.052, sp: 0.11, ph: 0.09 }`);
rep(`      const a0 = 0.16 + 0.48 * ki;
      const a1 = a0 + 0.40 + 0.98 * ki;`, `      const a0 = 0.14 + 0.56 * ki;
      const a1 = a0 + 0.38 + 1.12 * ki;`);
rep('const armGeo = new THREE.CylinderGeometry(0.158, 0.118, 0.80, 14, 1);', 'const armGeo = new THREE.CylinderGeometry(0.180, 0.130, 1.70, 14, 1);');
rep('armM.setPosition(0, -0.012, 0.665);', 'armM.setPosition(0, -0.012, 1.14);');
rep('const cuffGeo = new THREE.CylinderGeometry(0.128, 0.132, 0.055, 14, 1);', 'const cuffGeo = new THREE.CylinderGeometry(0.136, 0.140, 0.060, 14, 1);');
rep('gripLocal: new THREE.Vector3(0, -0.214, -0.045),', 'gripLocal: new THREE.Vector3(0, -0.2054, -0.0306),');
fs.writeFileSync(p, s, 'utf8');
console.log('done');

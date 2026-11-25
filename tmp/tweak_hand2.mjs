import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70).replace(/\n/g, '\\n')); return; }
  s = s.replace(a, b);
};
rep(`    { x: -0.096, l0: 0.082, l1: 0.062, l2: 0.052, w: 0.058, sp: -0.10, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.088, l1: 0.066, l2: 0.056, w: 0.060, sp: -0.035, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.085, l1: 0.064, l2: 0.054, w: 0.058, sp: 0.035, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.074, l1: 0.056, l2: 0.046, w: 0.050, sp: 0.10, ph: 0.105, st: 0.86 }`, `    { x: -0.096, l0: 0.087, l1: 0.066, l2: 0.055, w: 0.055, sp: -0.10, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.093, l1: 0.070, l2: 0.059, w: 0.056, sp: -0.035, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.090, l1: 0.068, l2: 0.057, w: 0.055, sp: 0.035, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.078, l1: 0.059, l2: 0.049, w: 0.047, sp: 0.10, ph: 0.105, st: 0.86 }`);
rep('const LEATHER = [0.100, 0.055, 0.030], PAD = [0.150, 0.088, 0.049];', 'const LEATHER = [0.100, 0.055, 0.030], PAD = [0.138, 0.080, 0.045];');
rep('ell(0, 0.047, -0.002, 0.060, 0.014, 0.112, PAD);', 'ell(0, 0.047, -0.002, 0.056, 0.012, 0.104, PAD);');
rep('ell(0, 0.051, -0.024, 0.096, 0.011, 0.090, PAD);', 'ell(0, 0.051, -0.024, 0.090, 0.010, 0.082, PAD);');
rep("tpParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.050, 0.100, TW) });", "tpParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.053, 0.106, TW) });");
rep("tdParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.042, 0.084, TW * 0.88) });", "tdParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.044, 0.088, TW * 0.88) });");
fs.writeFileSync(p, s, 'utf8');
console.log('tweaked');

import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70).replace(/\n/g, '\\n')); return; }
  s = s.replace(a, b);
};
rep('vertexColors: true, map: skin.palm.map, roughness: 0.62, metalness: 0.0,',
    'vertexColors: true, map: skin.palm.map, color: 0xE2CDBD, roughness: 0.62, metalness: 0.0,');
rep('map: skin.finger.map, roughness: 0.62, metalness: 0.0,',
    'map: skin.finger.map, color: 0xE2CDBD, roughness: 0.62, metalness: 0.0,');
rep('const SKIN = [1.00, 0.99, 0.98], PAD = [1.00, 0.90, 0.85];',
    'const SKIN = [1.00, 0.99, 0.98], PAD = [0.92, 0.82, 0.78];');
rep('DARK = [0.86, 0.78, 0.73], BAND = [0.97, 0.94, 0.92];',
    'DARK = [0.82, 0.72, 0.67], BAND = [0.88, 0.82, 0.78];');
fs.writeFileSync(p, s, 'utf8');
console.log('tinted');

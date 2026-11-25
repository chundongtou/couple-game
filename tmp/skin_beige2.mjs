import fs from 'node:fs';
let t = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(t, 'utf8');
s = s.split("'#E2C4A6'").join("'#C09274'")
     .split("'#D6B697'").join("'#B48668'")
     .split("'#C8A88A'").join("'#A67A5E'");
fs.writeFileSync(t, s, 'utf8');
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
b = b.split('color: 0xEADAC8, roughness: 0.61').join('color: 0xEFE2D6, roughness: 0.62');
b = b.replace('ell(0, 0.051, -0.024, 0.090, 0.011, 0.082, PAD);', 'ell(0, 0.051, -0.024, 0.078, 0.009, 0.072, PAD);');
fs.writeFileSync(p, b, 'utf8');
console.log('beige v2');

import fs from 'node:fs';
let t = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(t, 'utf8');
s = s.split("'#E6CBB2'").join("'#E2C4A6'")
     .split("'#DDBFA4'").join("'#D6B697'")
     .split("'#CEB096'").join("'#C8A88A'");
fs.writeFileSync(t, s, 'utf8');
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
b = b.split('color: 0xF6EDE4, roughness: 0.60').join('color: 0xEADAC8, roughness: 0.61');
b = b.replace('const SKIN = [1.00, 0.99, 0.98], PAD = [0.98, 0.93, 0.90];',
              'const SKIN = [1.00, 0.99, 0.98], PAD = [1.00, 0.94, 0.90];');
fs.writeFileSync(p, b, 'utf8');
console.log('skin warm beige');

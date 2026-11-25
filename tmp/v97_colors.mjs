import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
b = b.split('color: 0xF6E3D3, roughness: 0.66, metalness: 0.0,').join('color: 0xFFFFFF, roughness: 0.60, metalness: 0.0,');
b = b.split('color: 0xF7E3DA, roughness: 0.28, metalness: 0.0, envMapIntensity: 1.2,').join('color: 0xF8E3DE, roughness: 0.22, metalness: 0.0, envMapIntensity: 1.3,');
b = b.replace('transparent: true, opacity: 0.92\n  });', 'transparent: true, opacity: 0.95\n  });');
fs.writeFileSync(p, b, 'utf8');
console.log('colors patched');

import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const start = s.indexOf('/* ============================ 手（V9.4');
const end = s.indexOf('/* ============================ 光斑');
if (start < 0 || end < 0 || end < start) { console.error('markers not found', start, end); process.exit(1); }
const neu = fs.readFileSync('tmp/hand_new.js', 'utf8');
s = s.slice(0, start) + neu + '\n\n' + s.slice(end);
fs.writeFileSync(p, s, 'utf8');
console.log('spliced', start, end, '->', s.length);

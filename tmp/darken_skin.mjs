import fs from 'node:fs';
const p = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(p, 'utf8');
s = s.split("'#DCA98A'").join("'#C9967A'")
     .split("'#D09A7C'").join("'#BE8A70'")
     .split("'#C1896E'").join("'#B07E66'");
fs.writeFileSync(p, s, 'utf8');
console.log('skin albedo darkened', s.includes('#C9967A'));

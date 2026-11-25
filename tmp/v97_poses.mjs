import fs from 'node:fs';
const f = 'app/src/view/board3d/scene.js';
let s = fs.readFileSync(f, 'utf8');
const rep = (a, c) => { if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70)); return; } s = s.replace(a, c); };
rep('      hover: this._handPoseForDie(hoverDie, 1.95, -0.18, 0.82),', '      hover: this._handPoseForDie(hoverDie, 1.95, -0.12, 0.35),');
rep('      grip: this._handPoseForDie(DIE_HOME, 1.95, -0.12, 0.92),', '      grip: this._handPoseForDie(DIE_HOME, 1.95, -0.10, 0.40),');
rep('      lift: this._handPoseForDie(new THREE.Vector3(1.16, 0.88, 1.16), 1.90, -0.04, 0.90),',
    '      lift: this._handPoseForDie(new THREE.Vector3(0.76, 0.48, 0.78), 1.95, -0.05, 0.45),');
rep('      rel: this._handPoseForDie(RELEASE_DIE, 1.62, 0.12, 0.18)', '      rel: this._handPoseForDie(RELEASE_DIE, 1.90, -0.55, 0.55)');
fs.writeFileSync(f, s, 'utf8');
console.log('poses patched');

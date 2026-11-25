import fs from 'node:fs';
/* ---- textures.js：浅粉/中性肤色 ---- */
let t = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(t, 'utf8');
s = s.split("'#C09274'").join("'#EBCDBF'")
     .split("'#B48668'").join("'#E3C3B3'")
     .split("'#A67A5E'").join("'#D7B5A6'");
fs.writeFileSync(t, s, 'utf8');

/* ---- parts.js：肤色材质/纤细手指/指甲/捏握点 ---- */
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
const rep = (a, c) => {
  if (!b.includes(a)) { console.log('MISS:', a.slice(0, 70).replace(/\n/g, '\\n')); return; }
  b = b.replace(a, c);
};
rep('vertexColors: true, map: skin.palm.map, color: 0xEFE2D6, roughness: 0.62, metalness: 0.0,',
    'vertexColors: true, map: skin.palm.map, color: 0xFFFFFF, roughness: 0.60, metalness: 0.0,');
rep('map: skin.finger.map, color: 0xEFE2D6, roughness: 0.62, metalness: 0.0,',
    'map: skin.finger.map, color: 0xFFFFFF, roughness: 0.60, metalness: 0.0,');
/* 纤细：宽度 ×0.88，长度 ×1.03，减少外张；食指/中指略强、无名指/小指略弱 */
rep(`    { x: -0.096, l0: 0.075, l1: 0.057, l2: 0.047, w: 0.060, sp: -0.05, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.080, l1: 0.060, l2: 0.051, w: 0.062, sp: -0.02, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.077, l1: 0.058, l2: 0.049, w: 0.060, sp: 0.02, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.067, l1: 0.051, l2: 0.042, w: 0.052, sp: 0.05, ph: 0.105, st: 0.86 }`,
`    { x: -0.098, l0: 0.077, l1: 0.059, l2: 0.048, w: 0.052, sp: -0.04, ph: 0.00, st: 0.86 },
    { x: -0.033, l0: 0.082, l1: 0.062, l2: 0.053, w: 0.054, sp: -0.015, ph: 0.035, st: 1.04 },
    { x: 0.033, l0: 0.079, l1: 0.060, l2: 0.051, w: 0.053, sp: 0.015, ph: 0.07, st: 1.00 },
    { x: 0.098, l0: 0.069, l1: 0.053, l2: 0.043, w: 0.046, sp: 0.04, ph: 0.105, st: 0.82 }`);
/* 指甲更大更亮 */
rep("dummy.scale.set(f.w * 0.55, f.w * 0.12, f.l2 * 0.72);", "dummy.scale.set(f.w * 0.64, f.w * 0.13, f.l2 * 0.82);");
rep("color: 0xF4D8D2, roughness: 0.26, metalness: 0.0, envMapIntensity: 1.20,\n    transparent: true, opacity: 0.92",
    "color: 0xF8E3DE, roughness: 0.22, metalness: 0.0, envMapIntensity: 1.30,\n    transparent: true, opacity: 0.95");
/* 捏握点：骰子在手的前方指尖处（掌在侧后） */
rep("gripLocal: new THREE.Vector3(0, -0.203, -0.128),", "gripLocal: new THREE.Vector3(0.02, -0.215, -0.235),");
fs.writeFileSync(p, b, 'utf8');
console.log('hand v9.7 patched');

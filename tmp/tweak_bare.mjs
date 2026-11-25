import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 70).replace(/\n/g, '\\n')); return; }
  s = s.replace(a, b);
};
/* 皮肤更暗/更粗糙，少塑料高光 */
rep("gr.addColorStop(0, '#DCA98A');\n    gr.addColorStop(0.45, '#D09A7C');\n    gr.addColorStop(1, '#C1896E');",
    "gr.addColorStop(0, '#C9967A');\n    gr.addColorStop(0.45, '#BE8A70');\n    gr.addColorStop(1, '#B07E66');");
rep("vertexColors: true, map: skin.palm.map, roughness: 0.58, metalness: 0.0,\n    normalMap: skin.palm.normal, normalScale: new THREE.Vector2(0.75, 0.75),\n    roughnessMap: skin.palm.rough, envMapIntensity: 0.55",
    "vertexColors: true, map: skin.palm.map, roughness: 0.62, metalness: 0.0,\n    normalMap: skin.palm.normal, normalScale: new THREE.Vector2(0.85, 0.85),\n    roughnessMap: skin.palm.rough, envMapIntensity: 0.45");
rep("map: skin.finger.map, roughness: 0.58, metalness: 0.0,\n    normalMap: skin.finger.normal, normalScale: new THREE.Vector2(0.70, 0.70),\n    roughnessMap: skin.finger.rough, envMapIntensity: 0.55",
    "map: skin.finger.map, roughness: 0.62, metalness: 0.0,\n    normalMap: skin.finger.normal, normalScale: new THREE.Vector2(0.80, 0.80),\n    roughnessMap: skin.finger.rough, envMapIntensity: 0.45");
/* 更平滑的关节/掌体 */
rep("const sphereUnit = new THREE.SphereGeometry(1, 10, 8);", "const sphereUnit = new THREE.SphereGeometry(1, 12, 10);");
/* 黄铜扣移到夹克袖口（z≈0.298），不再在皮肤腕带上 */
rep("const frameW = 0.082, frameH = 0.012, frameD = 0.058, frameY = 0.112, frameZ = 0.214;",
    "const frameW = 0.082, frameH = 0.012, frameD = 0.058, frameY = 0.140, frameZ = 0.300;");
rep("brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.098, 0.214) });",
    "brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.124, 0.300) });");
fs.writeFileSync(p, s, 'utf8');
console.log('tweaked bare');

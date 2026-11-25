import fs from 'node:fs';
/* ---------- textures.js：肤色去橙（自然暖米色），轻红晕，褶皱更淡 ---------- */
let t = 'app/src/view/board3d/textures.js';
let s = fs.readFileSync(t, 'utf8');
s = s.split("'#C9967A'").join("'#E6CBB2'")
     .split("'#BE8A70'").join("'#DDBFA4'")
     .split("'#B07E66'").join("'#CEB096'");
s = s.replace('const a = 0.016 + rnd() * 0.05;', 'const a = 0.008 + rnd() * 0.028;');
s = s.replace('rgba(186,104,84,', 'rgba(190,120,100,');
s = s.replace("g.strokeStyle = `rgba(150,92,72,${0.12 + rnd() * 0.08})`;", "g.strokeStyle = `rgba(168,112,92,${0.08 + rnd() * 0.07})`;");
fs.writeFileSync(t, s, 'utf8');

/* ---------- parts.js：手指缩短加粗/收窄指尖、指甲更大更浅、夹克袖收窄、握点后移 ---------- */
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
const rep = (a, c) => {
  if (!b.includes(a)) { console.log('MISS:', a.slice(0, 70).replace(/\n/g, '\\n')); return; }
  b = b.replace(a, c);
};
rep("vertexColors: true, map: skin.palm.map, color: 0xE2CDBD, roughness: 0.62, metalness: 0.0,",
    "vertexColors: true, map: skin.palm.map, color: 0xF6EDE4, roughness: 0.60, metalness: 0.0,");
rep("map: skin.finger.map, color: 0xE2CDBD, roughness: 0.62, metalness: 0.0,",
    "map: skin.finger.map, color: 0xF6EDE4, roughness: 0.60, metalness: 0.0,");
rep("const SKIN = [1.00, 0.99, 0.98], PAD = [0.92, 0.82, 0.78];",
    "const SKIN = [1.00, 0.99, 0.98], PAD = [0.98, 0.93, 0.90];");
rep("DARK = [0.82, 0.72, 0.67], BAND = [0.88, 0.82, 0.78];",
    "DARK = [0.90, 0.84, 0.80], BAND = [0.95, 0.90, 0.87];");
/* 指甲：浅粉半透明、更大、放在可见面（+Y 侧） */
rep(`  const nailMat = new THREE.MeshStandardMaterial({
    color: 0xE9C9B2, roughness: 0.30, metalness: 0.0, envMapIntensity: 1.10
  });`, `  const nailMat = new THREE.MeshStandardMaterial({
    color: 0xF4D8D2, roughness: 0.26, metalness: 0.0, envMapIntensity: 1.20,
    transparent: true, opacity: 0.92
  });`);
rep(`      /* 指甲：远节背侧（+Y 侧）扁平椭球 */
      const dor = v0.set(0, Math.cos(a2), -Math.sin(a2)).normalize();
      dummy.position.set(
        mx + d2.x * f.l2 * 0.55 + dor.x * (f.w * 0.42),
        my + d2.y * f.l2 * 0.55 + dor.y * (f.w * 0.42),
        mz + d2.z * f.l2 * 0.55 + dor.z * (f.w * 0.42)
      );
      dummy.quaternion.setFromUnitVectors(up, dor);
      dummy.scale.set(f.w * 0.46, f.w * 0.09, f.l2 * 0.62);
      dummy.updateMatrix();
      nails.setMatrixAt(i, dummy.matrix);`,
`      /* 指甲：远节可见面（+Y）扁平半透明椭圆，指尖处更明显 */
      dummy.position.set(
        mx + d2.x * f.l2 * 0.58,
        my + d2.y * f.l2 * 0.58 + f.w * 0.42,
        mz + d2.z * f.l2 * 0.58
      );
      dummy.quaternion.setFromUnitVectors(up, up);
      dummy.scale.set(f.w * 0.55, f.w * 0.12, f.l2 * 0.72);
      dummy.updateMatrix();
      nails.setMatrixAt(i, dummy.matrix);`);
/* 手指：缩短 14%、加粗 8%、收窄指尖（远端两节宽度递减）、减少外张 */
rep(`    { x: -0.096, l0: 0.087, l1: 0.066, l2: 0.055, w: 0.055, sp: -0.10, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.093, l1: 0.070, l2: 0.059, w: 0.056, sp: -0.035, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.090, l1: 0.068, l2: 0.057, w: 0.055, sp: 0.035, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.078, l1: 0.059, l2: 0.049, w: 0.047, sp: 0.10, ph: 0.105, st: 0.86 }`,
`    { x: -0.096, l0: 0.075, l1: 0.057, l2: 0.047, w: 0.060, sp: -0.05, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.080, l1: 0.060, l2: 0.051, w: 0.062, sp: -0.02, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.077, l1: 0.058, l2: 0.049, w: 0.060, sp: 0.02, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.067, l1: 0.051, l2: 0.042, w: 0.052, sp: 0.05, ph: 0.105, st: 0.86 }`);
rep("dummy.scale.set(f.w * 0.92, f.l1, f.w * 0.92);", "dummy.scale.set(f.w * 0.86, f.l1, f.w * 0.86);");
rep("dummy.scale.set(f.w * 0.82, f.l2, f.w * 0.82);", "dummy.scale.set(f.w * 0.70, f.l2, f.w * 0.70);");
/* 握点后移：手掌退到侧后，四指绕到骰子前/下 */
rep("gripLocal: new THREE.Vector3(0, -0.2125, -0.090),", "gripLocal: new THREE.Vector3(0, -0.203, -0.128),");
/* 拇指指甲也放大、浅粉 */
rep("tNail.scale.set(TW * 0.40, TW * 0.09, 0.048);\n  tNail.position.set(0, TW * 0.40, -0.052);",
    "tNail.scale.set(TW * 0.52, TW * 0.11, 0.056);\n  tNail.position.set(0, TW * 0.44, -0.050);");
/* 夹克袖收窄/锥形 */
rep("const armGeo = new THREE.CylinderGeometry(0.182, 0.132, 1.70, 14, 1);",
    "const armGeo = new THREE.CylinderGeometry(0.150, 0.108, 1.70, 14, 1);");
rep("const cuffGeo = new THREE.CylinderGeometry(0.138, 0.142, 0.060, 14, 1);",
    "const cuffGeo = new THREE.CylinderGeometry(0.112, 0.118, 0.060, 14, 1);");
/* 黄铜扣跟随收窄袖口 */
rep("const frameW = 0.082, frameH = 0.012, frameD = 0.058, frameY = 0.140, frameZ = 0.300;",
    "const frameW = 0.072, frameH = 0.011, frameD = 0.052, frameY = 0.116, frameZ = 0.300;");
rep("brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.124, 0.300) });",
    "brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.104, 0.300) });");
rep("brassParts.push({ geo: buckle, matrix: new THREE.Matrix4().makeTranslation(0, 0.146, 0.66) });",
    "brassParts.push({ geo: buckle, matrix: new THREE.Matrix4().makeTranslation(0, 0.122, 0.66) });");
rep("brassParts.push({ geo: buckle2, matrix: new THREE.Matrix4().makeTranslation(0, 0.154, 0.66) });",
    "brassParts.push({ geo: buckle2, matrix: new THREE.Matrix4().makeTranslation(0, 0.130, 0.66) });");
fs.writeFileSync(p, b, 'utf8');
console.log('v9.6.1 patched');

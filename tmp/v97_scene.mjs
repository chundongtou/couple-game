import fs from 'node:fs';
/* ---- parts.js：捏握点与拇指 ---- */
const p = 'app/src/view/board3d/parts.js';
let b = fs.readFileSync(p, 'utf8');
b = b.replace('gripLocal: new THREE.Vector3(0.02, -0.215, -0.235),', 'gripLocal: new THREE.Vector3(0.02, -0.215, -0.165),');
b = b.replace("thumbBase.rotation.set(-0.15 - 0.55 * c, 2.55 - 0.35 * c, 0.10 + 0.30 * c);",
              "thumbBase.rotation.set(-0.32 - 0.55 * c, 0.55 + 0.42 * c, 0.10 + 0.18 * c);");
b = b.replace("thumbMid.rotation.x = -0.25 - 0.80 * c;", "thumbMid.rotation.x = -0.30 - 0.75 * c;");
fs.writeFileSync(p, b, 'utf8');

/* ---- scene.js：上挑抛出参数 + 捏握/抛出姿态 ---- */
const f = 'app/src/view/board3d/scene.js';
let s = fs.readFileSync(f, 'utf8');
const rep = (a, c) => { if (!s.includes(a)) { console.log('MISS:', a.slice(0, 60)); return; } s = s.replace(a, c); };
rep("const RELEASE_DIE = new THREE.Vector3(1.032, 0.80, 1.032);   /* 出手瞬间骰子中心（调参自 shots/v9.4-dice/sim3.mjs） */",
    "const RELEASE_DIE = new THREE.Vector3(0.834, 0.64, 0.863);   /* V9.7 手腕上挑出手点（shots/v9.7-dice/sim_up.mjs） */");
rep("    /* V9.4：从外侧 (1.03,1.03) 向棋盘中心抛（初速向内），落点 (0.63,0.63) */\n    let vx = -0.636, vy = -0.35, vz = -0.636;\n    let wx = 12.1, wy = 5.5, wz = -8.1;\n    let q = { x: q0.x, y: q0.y, z: q0.z, w: q0.w };\n    let rand = this._mulberry(5);",
    "    /* V9.7：手腕上挑（初速向上），骰子快速旋转，2–3 次弹跳后落 (0.63,0.63) */\n    let vx = -0.382, vy = 1.5, vz = -0.396;\n    let wx = 18.8, wy = 9.4, wz = -13.6;\n    let q = { x: q0.x, y: q0.y, z: q0.z, w: q0.w };\n    let rand = this._mulberry(11);");
rep(`      hover: this._handPoseForDie(hoverDie, 1.95, -0.12, 0.50),
      grip: this._handPoseForDie(DIE_HOME, 1.95, -0.05, 0.55),
      /* V9.4：托起到外侧高位，再向棋盘中心甩出；出手点/初速与刚体预演一致 */
      lift: this._handPoseForDie(new THREE.Vector3(1.16, 0.88, 1.16), 1.90, 0.0, 0.55),
      rel: this._handPoseForDie(RELEASE_DIE, 1.62, 0.12, 0.10)`,
`      hover: this._handPoseForDie(hoverDie, 1.95, -0.12, 0.35),
      grip: this._handPoseForDie(DIE_HOME, 1.95, -0.10, 0.40),
      /* V9.7：从低位捏起 → 手腕上挑 → 在出手点松开（初速向上） */
      lift: this._handPoseForDie(new THREE.Vector3(0.76, 0.48, 0.78), 1.95, -0.05, 0.45),
      rel: this._handPoseForDie(RELEASE_DIE, 1.90, -0.55, 0.55)`);
rep("S.follow = { p: S.rel.p.clone().add(new THREE.Vector3(-0.20, -0.10, -0.20)), q: this._handQuat(1.44, 0.28, -0.12) };",
    "S.follow = { p: S.rel.p.clone().add(new THREE.Vector3(0.06, 0.12, 0.02)), q: this._handQuat(1.78, -0.62, 0.50) };");
rep("S.exit = { p: S.rel.p.clone().add(new THREE.Vector3(1.30, 0.30, 0.60)), q: this._handQuat(1.20, 0.40, -0.16) };",
    "S.exit = { p: S.rel.p.clone().add(new THREE.Vector3(1.35, 0.55, 0.45)), q: this._handQuat(1.20, 0.40, -0.16) };");
fs.writeFileSync(f, s, 'utf8');
console.log('v97 scene patched');

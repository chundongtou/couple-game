/* ============================ 手（V9.5 深色皮革飞行手套 · 3 节手指） ============================
 * 局部坐标：手指朝 -Z，掌面法线 +Y，腕口/前臂沿 +Z；group 整体 0.82×。
 * 每指 3 节（近/中/远节）+ 指根/PIP/DIP/指尖圆关节，InstancedMesh 按 per-finger 角度独立合拢；
 * 拇指 2 节 + 大鱼际；掌弓/掌垫/指根补强/双细缝线/腕带黄铜扣；皮质前臂自然收进画面。
 * draw：掌(1)+近节(1)+中节(1)+远节(1)+关节(1)+拇指近(1)+拇指远(1)+袖(1)+黄铜(1) = 9（≤12）。
 * ========================================================================== */
export function makeHand() {
  const group = new THREE.Group();
  group.name = 'hand';
  group.visible = false;
  group.scale.setScalar(0.82);   /* V9.5：0.68 → 0.82（lead 口径 0.78–0.85） */

  const lt = buildLeatherTextures(128);
  const palmMat = new THREE.MeshStandardMaterial({
    vertexColors: true, roughness: 0.64, metalness: 0.02,
    normalMap: lt.normal, normalScale: new THREE.Vector2(0.60, 0.60),
    roughnessMap: lt.rough, envMapIntensity: 0.80
  });
  const fingerMat = new THREE.MeshStandardMaterial({
    color: 0x5A4230, roughness: 0.82, metalness: 0.02,
    normalMap: lt.normal, normalScale: new THREE.Vector2(0.55, 0.55),
    roughnessMap: lt.rough, envMapIntensity: 0.80
  });
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x241A14, roughness: 0.87, metalness: 0.02,
    normalMap: lt.normal, normalScale: new THREE.Vector2(0.38, 0.38), envMapIntensity: 0.40
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xB08A57, roughness: 0.30, metalness: 0.88, envMapIntensity: 1.3
  });

  const up = new THREE.Vector3(0, 1, 0);
  const qTmp = new THREE.Quaternion();
  const pTmp = new THREE.Vector3();
  const sTmp = new THREE.Vector3();
  const mTmp = new THREE.Matrix4();
  const segM = (dir, cx, cy, cz, len, w) => {
    qTmp.setFromUnitVectors(up, dir);
    mTmp.compose(pTmp.set(cx, cy, cz), qTmp, sTmp.set(w, len, w));
    return mTmp.clone();
  };
  const ballM = (x, y, z, r) => {
    mTmp.compose(pTmp.set(x, y, z), qTmp.identity(), sTmp.set(r, r, r));
    return mTmp.clone();
  };
  const sphereUnit = new THREE.SphereGeometry(1, 10, 8);

  /* ---- 手掌（顶点色合并 1 draw）：掌体/掌根/大鱼际/小鱼际/掌弓/掌垫/指根补强/腕带/双缝线 ---- */
  const LEATHER = [0.100, 0.055, 0.030], PAD = [0.150, 0.088, 0.049];
  const DARK = [0.060, 0.033, 0.018], BAND = [0.030, 0.019, 0.012], STITCH = [0.310, 0.205, 0.115];
  const palmParts = [];
  const ell = (x, y, z, rx, ry, rz, color) => {
    const mm = new THREE.Matrix4().compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(rx, ry, rz));
    palmParts.push({ geo: sphereUnit, matrix: mm, color });
  };
  /* 掌体（更厚）+ 掌根 + 鱼际垫 */
  ell(0, 0.006, 0.012, 0.134, 0.052, 0.132, LEATHER);
  ell(0, -0.002, 0.112, 0.116, 0.046, 0.064, DARK);
  ell(0.084, -0.002, -0.045, 0.080, 0.050, 0.094, PAD);      /* 大鱼际（拇指侧） */
  ell(-0.086, -0.004, 0.012, 0.052, 0.040, 0.092, DARK);      /* 小鱼际 */
  ell(0, 0.028, -0.108, 0.134, 0.032, 0.046, DARK);           /* 指根垫 */
  ell(0, 0.047, -0.002, 0.060, 0.014, 0.112, PAD);            /* 掌弓 */
  ell(0, 0.051, -0.024, 0.096, 0.011, 0.090, PAD);            /* 掌垫 */
  /* 指根补强：4 个扁平小垫（随掌运动） */
  for (const x of [-0.096, -0.032, 0.032, 0.096]) {
    ell(x, 0.034, -0.130, 0.030, 0.013, 0.032, PAD);
  }
  /* 腕带 */
  const bandGeo = new THREE.CylinderGeometry(0.108, 0.114, 0.078, 16, 1);
  const bandM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  bandM.setPosition(0, -0.002, 0.214);
  palmParts.push({ geo: bandGeo, matrix: bandM, color: BAND });
  for (const z of [0.176, 0.252]) {
    const rg = new THREE.CylinderGeometry(0.114, 0.114, 0.010, 16, 1);
    const rm = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    rm.setPosition(0, -0.002, z);
    palmParts.push({ geo: rg, matrix: rm, color: BAND });
  }
  /* 双细缝线：掌垫两侧各两条浅色蜡线（不是黑点） */
  const seam = new THREE.BoxGeometry(0.0024, 0.0022, 0.150);
  for (const x of [-0.092, -0.080, 0.080, 0.092]) {
    palmParts.push({ geo: seam, matrix: new THREE.Matrix4().makeTranslation(x, 0.0525, -0.022), color: STITCH });
  }
  const palmGeo = mergePropGeoms(palmParts);
  palmParts.forEach((pp) => { if (pp.geo !== sphereUnit && pp.geo !== seam) pp.geo.dispose(); });
  seam.dispose();
  const palmMesh = new THREE.Mesh(palmGeo, palmMat);
  palmMesh.castShadow = true;
  palmMesh.receiveShadow = true;
  group.add(palmMesh);

  /* ---- 四指：每指 3 节 + 4 圆关节（近/中/远/指尖），per-finger 独立 curl ---- */
  const segGeo = new THREE.CylinderGeometry(0.36, 0.50, 1, 8, 1, true);
  const FINGERS = [
    { x: -0.096, l0: 0.082, l1: 0.062, l2: 0.052, w: 0.058, sp: -0.10, ph: 0.00, st: 0.90 },
    { x: -0.032, l0: 0.088, l1: 0.066, l2: 0.056, w: 0.060, sp: -0.035, ph: 0.035, st: 1.00 },
    { x: 0.032, l0: 0.085, l1: 0.064, l2: 0.054, w: 0.058, sp: 0.035, ph: 0.07, st: 1.03 },
    { x: 0.096, l0: 0.074, l1: 0.056, l2: 0.046, w: 0.050, sp: 0.10, ph: 0.105, st: 0.86 }
  ];
  const prox = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const mid = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const dist = new THREE.InstancedMesh(segGeo, fingerMat, 4);
  const joints = new THREE.InstancedMesh(sphereUnit, fingerMat, 16);
  for (const mesh of [prox, mid, dist, joints]) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(mesh);
  }
  const dummy = new THREE.Object3D();
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();
  const KZ = -0.128, KY = 0.018;
  function setGripMatrices(k) {
    const kk = k < 0 ? 0 : k > 1 ? 1 : k;
    for (let i = 0; i < 4; i++) {
      const f = FINGERS[i];
      const ki = Math.max(0, Math.min(1, kk * f.st + (f.ph - 0.05)));
      /* 三节角度不同：近节抬、中节弯、远节再弯 → 指尖包住骰子侧/上缘 */
      const a0 = 0.10 + 0.40 * ki;
      const a1 = a0 + 0.20 + 0.62 * ki;
      const a2 = a1 + 0.16 + 0.72 * ki;
      const bx = f.x, by = KY, bz = KZ;
      const d0 = v1.set(Math.sin(f.sp), -Math.sin(a0), -Math.cos(a0)).normalize();
      const d1 = v2.set(Math.sin(f.sp) * 1.2, -Math.sin(a1), -Math.cos(a1)).normalize();
      const d2 = v0.set(Math.sin(f.sp) * 1.4, -Math.sin(a2), -Math.cos(a2)).normalize();
      /* 近节 */
      dummy.position.set(bx + d0.x * f.l0 / 2, by + d0.y * f.l0 / 2, bz + d0.z * f.l0 / 2);
      dummy.quaternion.setFromUnitVectors(up, d0);
      dummy.scale.set(f.w, f.l0, f.w);
      dummy.updateMatrix();
      prox.setMatrixAt(i, dummy.matrix);
      const px = bx + d0.x * f.l0, py = by + d0.y * f.l0, pz = bz + d0.z * f.l0;
      /* 中节 */
      dummy.position.set(px + d1.x * f.l1 / 2, py + d1.y * f.l1 / 2, pz + d1.z * f.l1 / 2);
      dummy.quaternion.setFromUnitVectors(up, d1);
      dummy.scale.set(f.w * 0.92, f.l1, f.w * 0.92);
      dummy.updateMatrix();
      mid.setMatrixAt(i, dummy.matrix);
      const mx = px + d1.x * f.l1, my = py + d1.y * f.l1, mz = pz + d1.z * f.l1;
      /* 远节 */
      dummy.position.set(mx + d2.x * f.l2 / 2, my + d2.y * f.l2 / 2, mz + d2.z * f.l2 / 2);
      dummy.quaternion.setFromUnitVectors(up, d2);
      dummy.scale.set(f.w * 0.82, f.l2, f.w * 0.82);
      dummy.updateMatrix();
      dist.setMatrixAt(i, dummy.matrix);
      const tx = mx + d2.x * f.l2, ty = my + d2.y * f.l2, tz = mz + d2.z * f.l2;
      /* 圆关节：MCP/PIP/DIP/指尖 */
      const rr = f.w * 0.54;
      const put = (idx, x, y, z, r) => {
        dummy.position.set(x, y, z);
        dummy.quaternion.identity();
        dummy.scale.set(r, r, r);
        dummy.updateMatrix();
        joints.setMatrixAt(idx, dummy.matrix);
      };
      put(i * 4, bx, by, bz, rr);
      put(i * 4 + 1, px, py, pz, rr * 0.88);
      put(i * 4 + 2, mx, my, mz, rr * 0.78);
      put(i * 4 + 3, tx, ty, tz, rr * 0.66);
    }
    prox.instanceMatrix.needsUpdate = true;
    mid.instanceMatrix.needsUpdate = true;
    dist.instanceMatrix.needsUpdate = true;
    joints.instanceMatrix.needsUpdate = true;
  }

  /* ---- 拇指：2 节 + 圆关节，从另一侧（掌内侧）压住骰子；近节 1 draw、远节 1 draw ---- */
  const thumbBase = new THREE.Group();
  thumbBase.position.set(-0.112, -0.006, -0.052);
  const TW = 0.064;
  const tdir = new THREE.Vector3(0, 0, -1);
  const tpParts = [];
  tpParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.050, 0.100, TW) });
  tpParts.push({ geo: sphereUnit, matrix: ballM(0, 0, 0.004, 0.034) });
  const tProxGeo = mergeGeoms(tpParts);
  const tProx = new THREE.Mesh(tProxGeo, fingerMat);
  tProx.castShadow = true; tProx.receiveShadow = true;
  thumbBase.add(tProx);
  const thumbMid = new THREE.Group();
  thumbMid.position.set(0, 0, -0.100);
  const tdParts = [];
  tdParts.push({ geo: segGeo, matrix: segM(tdir, 0, 0, -0.042, 0.084, TW * 0.88) });
  tdParts.push({ geo: sphereUnit, matrix: ballM(0, 0, 0.0, 0.028) });
  tdParts.push({ geo: sphereUnit, matrix: ballM(0, 0, -0.084, 0.024) });
  const tDistGeo = mergeGeoms(tdParts);
  const tDist = new THREE.Mesh(tDistGeo, fingerMat);
  tDist.castShadow = true; tDist.receiveShadow = true;
  thumbMid.add(tDist);
  thumbBase.add(thumbMid);
  group.add(thumbBase);

  /* ---- 前臂 / 袖：暖棕皮革 + 收口（1 draw） ---- */
  const sleeveParts = [];
  const armGeo = new THREE.CylinderGeometry(0.182, 0.132, 1.70, 14, 1);
  const armM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  armM.setPosition(0, -0.012, 1.14);
  sleeveParts.push({ geo: armGeo, matrix: armM });
  const cuffGeo = new THREE.CylinderGeometry(0.138, 0.142, 0.060, 14, 1);
  const cuffM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
  cuffM.setPosition(0, -0.006, 0.295);
  sleeveParts.push({ geo: cuffGeo, matrix: cuffM });
  const sleeveGeo = mergeGeoms(sleeveParts);
  armGeo.dispose(); cuffGeo.dispose();
  const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
  sleeveMesh.castShadow = true; sleeveMesh.receiveShadow = true;
  group.add(sleeveMesh);

  /* ---- 黄铜扣件：腕带方扣（框+针）+ 铆钉 + 袖扣（1 draw） ---- */
  const brassParts = [];
  const frameW = 0.082, frameH = 0.012, frameD = 0.058, frameY = 0.112, frameZ = 0.214;
  for (const [dx, dz, w, d] of [[0, -frameD / 2, frameW, frameH], [0, frameD / 2, frameW, frameH], [-frameW / 2, 0, frameH, frameD], [frameW / 2, 0, frameH, frameD]]) {
    const g = new THREE.BoxGeometry(w, 0.010, d);
    brassParts.push({ geo: g, matrix: new THREE.Matrix4().makeTranslation(dx, frameY, frameZ + dz) });
  }
  const pin = new THREE.CylinderGeometry(0.0055, 0.0055, frameW * 0.82, 8);
  const pinM = new THREE.Matrix4().makeRotationZ(Math.PI / 2);
  pinM.setPosition(0, frameY + 0.006, frameZ);
  brassParts.push({ geo: pin, matrix: pinM });
  for (const x of [-0.062, 0.062]) {
    const rv = new THREE.SphereGeometry(0.011, 8, 6);
    brassParts.push({ geo: rv, matrix: new THREE.Matrix4().makeTranslation(x, 0.098, 0.214) });
  }
  const buckle = new THREE.BoxGeometry(0.085, 0.016, 0.060);
  brassParts.push({ geo: buckle, matrix: new THREE.Matrix4().makeTranslation(0, 0.146, 0.66) });
  const buckle2 = new THREE.BoxGeometry(0.030, 0.024, 0.070);
  brassParts.push({ geo: buckle2, matrix: new THREE.Matrix4().makeTranslation(0, 0.154, 0.66) });
  const brassGeo = mergeGeoms(brassParts);
  brassParts.forEach((bp) => bp.geo.dispose());
  const brassMesh = new THREE.Mesh(brassGeo, brassMat);
  brassMesh.castShadow = true;
  group.add(brassMesh);

  function setGrip(k) {
    const c = k < 0 ? 0 : k > 1 ? 1 : k;
    setGripMatrices(c);
    /* 拇指从掌内侧翻转压向骰子：yaw 向内、pitch 下压 */
    thumbBase.rotation.set(-0.15 - 0.55 * c, 2.55 - 0.35 * c, 0.10 + 0.30 * c);
    thumbMid.rotation.x = -0.25 - 0.80 * c;
  }
  setGrip(0);

  return {
    group,
    setGrip,
    gripLocal: new THREE.Vector3(0, -0.2125, -0.090),
    textures: [lt.normal, lt.rough],
    dispose() {
      palmGeo.dispose(); segGeo.dispose(); sphereUnit.dispose();
      tProxGeo.dispose(); tDistGeo.dispose(); sleeveGeo.dispose(); brassGeo.dispose();
      palmMat.dispose(); fingerMat.dispose(); sleeveMat.dispose(); brassMat.dispose();
      group.clear();
    }
  };
}

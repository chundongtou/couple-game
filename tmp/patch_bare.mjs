import fs from 'node:fs';
const p = 'app/src/view/board3d/parts.js';
let s = fs.readFileSync(p, 'utf8');
const rep = (a, b) => {
  if (!s.includes(a)) { console.log('MISS:', a.slice(0, 80).replace(/\n/g, '\\n')); return; }
  s = s.replace(a, b);
};
/* import */
rep("  makeGlowTex, makeShadowTex, makeRippleTex, buildPaperTextures, buildBrushedBrass, buildLeatherTextures",
    "  makeGlowTex, makeShadowTex, makeRippleTex, buildPaperTextures, buildBrushedBrass, buildLeatherTextures, buildSkinTextures");
/* materials */
rep(`  const lt = buildLeatherTextures(128);
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
  });`, `  const skin = buildSkinTextures(256);
  const lt = buildLeatherTextures(128);
  const palmMat = new THREE.MeshStandardMaterial({
    vertexColors: true, map: skin.palm.map, roughness: 0.58, metalness: 0.0,
    normalMap: skin.palm.normal, normalScale: new THREE.Vector2(0.75, 0.75),
    roughnessMap: skin.palm.rough, envMapIntensity: 0.55
  });
  const fingerMat = new THREE.MeshStandardMaterial({
    map: skin.finger.map, roughness: 0.58, metalness: 0.0,
    normalMap: skin.finger.normal, normalScale: new THREE.Vector2(0.70, 0.70),
    roughnessMap: skin.finger.rough, envMapIntensity: 0.55
  });
  const nailMat = new THREE.MeshStandardMaterial({
    color: 0xE9C9B2, roughness: 0.30, metalness: 0.0, envMapIntensity: 1.10
  });
  const sleeveMat = new THREE.MeshStandardMaterial({
    color: 0x1D1B19, roughness: 0.88, metalness: 0.02,
    normalMap: lt.normal, normalScale: new THREE.Vector2(0.40, 0.40), envMapIntensity: 0.35
  });`);
/* palm skin tints */
rep('const LEATHER = [0.100, 0.055, 0.030], PAD = [0.138, 0.080, 0.045];',
    'const SKIN = [1.00, 0.99, 0.98], PAD = [1.00, 0.90, 0.85];');
rep('const DARK = [0.060, 0.033, 0.018], BAND = [0.030, 0.019, 0.012], STITCH = [0.310, 0.205, 0.115];',
    'const DARK = [0.86, 0.78, 0.73], BAND = [0.97, 0.94, 0.92];');
s = s.split('LEATHER)').join('SKIN)');
/* remove stitch seam block */
rep(`  /* 双细缝线：掌垫两侧各两条浅色蜡线（不是黑点） */
  const seam = new THREE.BoxGeometry(0.0024, 0.0022, 0.150);
  for (const x of [-0.092, -0.080, 0.080, 0.092]) {
    palmParts.push({ geo: seam, matrix: new THREE.Matrix4().makeTranslation(x, 0.0525, -0.022), color: STITCH });
  }
`, '');
rep('palmParts.forEach((pp) => { if (pp.geo !== sphereUnit && pp.geo !== seam) pp.geo.dispose(); });\n  seam.dispose();',
    'palmParts.forEach((pp) => { if (pp.geo !== sphereUnit) pp.geo.dispose(); });');
/* nails: instanced 4 + thumb nail mesh */
rep(`  const dummy = new THREE.Object3D();
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();`,
`  const nailGeo = new THREE.SphereGeometry(1, 8, 6);
  const nails = new THREE.InstancedMesh(nailGeo, nailMat, 4);
  nails.castShadow = true;
  nails.frustumCulled = false;
  nails.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  group.add(nails);
  const dummy = new THREE.Object3D();
  const v0 = new THREE.Vector3(), v1 = new THREE.Vector3(), v2 = new THREE.Vector3();`);
/* nail matrices after joints per finger */
rep(`      put(i * 4 + 2, mx, my, mz, rr * 0.78);
      put(i * 4 + 3, tx, ty, tz, rr * 0.66);`,
`      put(i * 4 + 2, mx, my, mz, rr * 0.78);
      put(i * 4 + 3, tx, ty, tz, rr * 0.66);
      /* 指甲：远节背侧（+Y 侧）扁平椭球 */
      const dor = v0.set(0, Math.cos(a2), -Math.sin(a2)).normalize();
      dummy.position.set(
        mx + d2.x * f.l2 * 0.55 + dor.x * (f.w * 0.42),
        my + d2.y * f.l2 * 0.55 + dor.y * (f.w * 0.42),
        mz + d2.z * f.l2 * 0.55 + dor.z * (f.w * 0.42)
      );
      dummy.quaternion.setFromUnitVectors(up, dor);
      dummy.scale.set(f.w * 0.46, f.w * 0.09, f.l2 * 0.62);
      dummy.updateMatrix();
      nails.setMatrixAt(i, dummy.matrix);`);
rep(`    prox.instanceMatrix.needsUpdate = true;
    mid.instanceMatrix.needsUpdate = true;
    dist.instanceMatrix.needsUpdate = true;
    joints.instanceMatrix.needsUpdate = true;`,
`    prox.instanceMatrix.needsUpdate = true;
    mid.instanceMatrix.needsUpdate = true;
    dist.instanceMatrix.needsUpdate = true;
    joints.instanceMatrix.needsUpdate = true;
    nails.instanceMatrix.needsUpdate = true;`);
/* thumb nail */
rep(`  const tDist = new THREE.Mesh(tDistGeo, fingerMat);
  tDist.castShadow = true; tDist.receiveShadow = true;
  thumbMid.add(tDist);`,
`  const tDist = new THREE.Mesh(tDistGeo, fingerMat);
  tDist.castShadow = true; tDist.receiveShadow = true;
  thumbMid.add(tDist);
  const tNailGeo = new THREE.SphereGeometry(1, 8, 6);
  const tNail = new THREE.Mesh(tNailGeo, nailMat);
  tNail.scale.set(TW * 0.40, TW * 0.09, 0.048);
  tNail.position.set(0, TW * 0.40, -0.052);
  thumbMid.add(tNail);`);
/* disposed additions + textures */
rep('      palmGeo.dispose(); segGeo.dispose(); sphereUnit.dispose();\n      tProxGeo.dispose(); tDistGeo.dispose(); sleeveGeo.dispose(); brassGeo.dispose();\n      palmMat.dispose(); fingerMat.dispose(); sleeveMat.dispose(); brassMat.dispose();',
    '      palmGeo.dispose(); segGeo.dispose(); sphereUnit.dispose(); nailGeo.dispose();\n      tProxGeo.dispose(); tDistGeo.dispose(); tNailGeo.dispose(); sleeveGeo.dispose(); brassGeo.dispose();\n      palmMat.dispose(); fingerMat.dispose(); nailMat.dispose(); sleeveMat.dispose(); brassMat.dispose();');
rep('    textures: [lt.normal, lt.rough],',
    '    textures: [skin.palm.map, skin.palm.normal, skin.palm.rough, skin.finger.map, skin.finger.normal, skin.finger.rough, lt.normal, lt.rough],');
fs.writeFileSync(p, s, 'utf8');
console.log('bare hand patched');

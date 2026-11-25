/* ==========================================================================
 * V8 · 真 3D 主桌 · 场景装配（生产）
 * 机舱小桌板 + 圆形棋盘(52 环格/4 机坪/4×5 航线/终点) + 低模纸飞机 + 3D 骰子
 * + 45° 格子舞台 + 低模小熊 + 三主题云海/星轨/纸雕。
 * 只渲染；不创建任何 HUD/卡片/按钮；canvas 由 entry 创建并 pointer-events:none。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import {
  DEG, TAU, RING_N, RING_R, CELL, TILE_H, TILE_BOTTOM, TILE_TOP, HOME_STEPS, HOME_R0,
  HOME_PITCH, HOME_CELL, HANGAR_R, PLANE_HOVER, PLANE_Y, DIE_SIZE, STAGE_RISE, STAGE_AZIM,
  STAGE_PLATE, STAGE_BEAR, STAGE_TEXT, HUB,
  COLORS, HOME_ENTRY, APRON_DEG, HEX, DIE_FACES, THEMES, themeOf, KIND_LABEL,
  colorOfRing, kindOf, ringPhi, slotOf, uvOfSlot, SLOT_DARK, SLOT_HOME, SLOT_HANGAR,
  clamp, lerp, easeOut, smoothstep
} from './constants.js';
import * as TX from './textures.js';
import {
  buildTileGeometry, makePlane, makeShadowPlane, makeGlowPlane, makeRippleMesh, makeStreakGroup
} from './parts.js';
import { createBear } from './bear.js';
import { CameraRig } from './camera.js';
import { localOfSquare, localOfPieceSquare, pieceLocals } from './mapping.js';

const DISC_R = 3.30;
/* 桌板做大，保证 320–430 的 overview 里桌沿不进入画面（否则天空会露出硬边界） */
const TRAY = { w: 26.0, d: 22.0, r: 0.9 };
const DIE_HOME = new THREE.Vector3(1.62, DIE_SIZE / 2 + 0.002, 3.02);
const DIE_TOSS_FROM = new THREE.Vector3(0.9, 2.7, 2.2);
const FOCUS_WORLD = new THREE.Vector3(0, PLANE_Y, 0);

export class BoardScene {
  constructor(host, canvas, opts = {}) {
    this.host = host;
    this.canvas = canvas;
    this.reduced = !!opts.reduced;
    this.shadows = opts.shadows !== false;
    this.adapt = opts.adapt !== false;
    this.quality = 'high';
    this.theme = opts.theme && THEMES[opts.theme] ? opts.theme : 'cloud';
    this.heat = 0;
    this.turn = 'a';
    this.colors = { a: 'red', b: 'yellow' };
    this.planes = new Map();
    this.pieces = [];
    this.anims = [];
    this.dimK = 1;
    this.dieValue = 1;
    this.stageRise = 0;
    this.stageId = null;
    this.viewport = { w: 0, h: 0 };
    this.ready = false;
    this.onReady = null;
    this.onResize = null;
    this._last = 0;
    this._raf = 0;
    this._paused = false;
    this._inFrame = false;
    this._v = new THREE.Vector3();
    this._axis = new THREE.Vector3();
    this._q1 = new THREE.Quaternion();
    this._q2 = new THREE.Quaternion();
    this._planesDirty = true;
    this.lockProbeId = null;
    this.perf = {
      phase: 'boot', frames: 0, sum: 0, max: 0, long25: 0, long50: 0, since: 0,
      updateSum: 0, renderSum: 0, phases: {}
    };
    this.lockStats = { samples: 0, maxAbsX: 0, maxAbsY: 0, reset() { this.samples = 0; this.maxAbsX = 0; this.maxAbsY = 0; } };
    this.lastCalls = 0;
    this.lastTris = 0;
    this._tex = [];
    this._buildRenderer();
    this._buildScene();
    this._buildLights();
    this._buildEnvironment();
    this._buildTable();
    this._buildBoard();
    this._buildStage();
    this._buildDie();
    this._buildPlanesLayer();
    this._bindResize();
    this._bindVisibility();
    this.applyTheme(this.theme, true);
    this.applyHeat(0);
    this.applyTurn('a', this.colors);
    this.resize();
    this.renderNow();
    this._startLoop();
  }

  /* ======================= 构建 ======================= */
  _buildRenderer() {
    const dpr = window.devicePixelRatio || 1;
    const useAA = dpr < 2;
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: useAA,
      alpha: false,
      powerPreference: 'high-performance',
      stencil: false,
      depth: true
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = this.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.useAA = useAA;
  }

  _buildScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0A1622);
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 240);
    this.rig = new CameraRig(this.camera, { runAnim: (ms, fn) => this.runAnim(ms, fn) });
  }

  _buildLights() {
    this.hemi = new THREE.HemisphereLight(0xBED8FF, 0x2A2038, 0.9);
    this.scene.add(this.hemi);
    this.ambient = new THREE.AmbientLight(0xFFFFFF, 0.16);
    this.scene.add(this.ambient);
    this.sun = new THREE.DirectionalLight(0xFFF1DC, 1.3);
    this.sun.position.set(3.4, 6.4, 4.2);
    this.sun.castShadow = this.shadows;
    this.sun.shadow.mapSize.set(2048, 2048);
    /* 必须覆盖整块可见桌板：否则阴影相机的矩形边界会在桌面上留下硬直线 */
    this.sun.shadow.camera.left = -12;
    this.sun.shadow.camera.right = 12;
    this.sun.shadow.camera.top = 12;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 40;
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.02;
    this.scene.add(this.sun);
    this.sunTarget = new THREE.Object3D();
    this.scene.add(this.sunTarget);
    this.sun.target = this.sunTarget;
    this.lamp = new THREE.PointLight(0xFFC98A, 9, 12, 2);
    this.lamp.position.set(-3.1, 2.6, -1.4);
    this.scene.add(this.lamp);
  }

  _buildEnvironment() {
    this.envRoot = new THREE.Group();
    this.scene.add(this.envRoot);

    const skyGeo = new THREE.SphereGeometry(60, 24, 16);
    const mkSky = (top, mid, bottom) => {
      const tex = TX.buildSkyTexture(top, mid, bottom);
      this._tex.push(tex);
      const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide, depthWrite: false, fog: false });
      return new THREE.Mesh(skyGeo.clone(), mat);
    };
    this.skyCloud = mkSky('#1E5A86', '#0E2B45', '#050D16');
    this.skyStar = mkSky('#2A1B4E', '#140F2A', '#05030C');
    this.skyPaper = mkSky('#4A3524', '#2A1D14', '#0C0806');
    this.skyStar.visible = false;
    this.skyPaper.visible = false;
    this.envRoot.add(this.skyCloud, this.skyStar, this.skyPaper);

    /* 云 */
    this.cloudGroup = new THREE.Group();
    this.cloudTexes = [TX.makeCloudTex(7), TX.makeCloudTex(13), TX.makeCloudTex(29)];
    this._tex.push.apply(this._tex, this.cloudTexes);
    for (let i = 0; i < 10; i++) {
      const mat = new THREE.SpriteMaterial({
        map: this.cloudTexes[i % this.cloudTexes.length],
        transparent: true, opacity: 0.42, depthWrite: false, fog: false
      });
      const sp = new THREE.Sprite(mat);
      const a = (i / 10) * TAU + (i % 3) * 0.2;
      const rad = 8 + (i % 4) * 1.8;
      /* 云必须全部低于桌面：高于 y=0 的云会从桌沿上方露出来，形成一条亮带/硬边 */
      sp.position.set(Math.cos(a) * rad, -2.4 + (i % 4) * 0.35, Math.sin(a) * rad);
      const sc = 2.9 + (i % 3) * 1.2;
      sp.scale.set(sc * 1.6, sc, 1);
      this.cloudGroup.add(sp);
    }
    this.envRoot.add(this.cloudGroup);

    /* 星空 */
    this.starGroup = new THREE.Group();
    const N = 520;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const u = Math.random(), v = Math.random() * 0.55 + 0.12;
      const theta = u * TAU, phi = Math.acos(2 * v - 1);
      const r = 26 + Math.random() * 12;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 + 1.2;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starTex = TX.makeStarSprite();
    this._tex.push(starTex);
    const starMat = new THREE.PointsMaterial({
      size: 0.8, map: starTex, color: 0xE4DEFF, transparent: true,
      opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true, fog: false
    });
    this.starGroup.add(new THREE.Points(starGeo, starMat));
    const neb = (hex, x, y, z, s) => {
      const tex = TX.radialTexture(128, [[0, TX.rgbCss(hex, 0.32)], [0.5, TX.rgbCss(hex, 0.12)], [1, TX.rgbCss(hex, 0)]]);
      this._tex.push(tex);
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: tex, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending, fog: false
      }));
      sp.position.set(x, y, z);
      sp.scale.set(s * 1.6, s, 1);
      return sp;
    };
    this.starGroup.add(neb(0x8E7BD8, -9, 5.5, -14, 12), neb(0xD87BA8, 11, 6.5, -12, 10));
    this.starGroup.visible = false;
    this.envRoot.add(this.starGroup);
  }

  _buildTable() {
    this.world = new THREE.Group();
    this.scene.add(this.world);
    this.trayMat = new THREE.MeshLambertMaterial({ color: 0x3A2A24 });
    this.matMat = new THREE.MeshLambertMaterial({ color: 0x1E4A63 });
    /* V8.2：垫面 = 织纹层（lambert，吃灯光）+ 暗角/灯池叠层（basic，纯样式）
     * 目的：overview 里棋盘四周的空区读作"机舱小桌板"，而不是一大片纯色天空。 */
    this.matOverMat = new THREE.MeshBasicMaterial({
      map: null, transparent: true, opacity: 1, depthWrite: false, fog: false
    });
    this._matTexCache = {};
    this.trayGroup = new THREE.Group();
    const shape = new THREE.Shape();
    const w = TRAY.w, d = TRAY.d, r = TRAY.r;
    shape.moveTo(-w / 2 + r, -d / 2);
    shape.lineTo(w / 2 - r, -d / 2);
    shape.quadraticCurveTo(w / 2, -d / 2, w / 2, -d / 2 + r);
    shape.lineTo(w / 2, d / 2 - r);
    shape.quadraticCurveTo(w / 2, d / 2, w / 2 - r, d / 2);
    shape.lineTo(-w / 2 + r, d / 2);
    shape.quadraticCurveTo(-w / 2, d / 2, -w / 2, d / 2 - r);
    shape.lineTo(-w / 2, -d / 2 + r);
    shape.quadraticCurveTo(-w / 2, -d / 2, -w / 2 + r, -d / 2);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.2, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02,
      bevelSegments: 1, curveSegments: 6, steps: 1
    });
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingBox();
    const tray = new THREE.Mesh(geo, this.trayMat);
    tray.position.y = -geo.boundingBox.max.y;
    tray.receiveShadow = true;
    this.trayGroup.add(tray);
    const mat = new THREE.Mesh(new THREE.PlaneGeometry(TRAY.w - 0.9, TRAY.d - 0.9, 1, 1), this.matMat);
    mat.rotation.x = -Math.PI / 2;
    mat.position.y = 0.002;
    mat.receiveShadow = true;
    this.trayGroup.add(mat);
    const over = new THREE.Mesh(new THREE.PlaneGeometry(TRAY.w - 0.9, TRAY.d - 0.9, 1, 1), this.matOverMat);
    over.rotation.x = -Math.PI / 2;
    over.position.y = 0.0035;
    this.trayGroup.add(over);
    this.world.add(this.trayGroup);

    this.boardGroup = new THREE.Group();
    this.world.add(this.boardGroup);
  }

  /* 垫面贴图按主题懒生成并缓存（每个主题只做一次） */
  _matTexFor(t) {
    let e = this._matTexCache[t.id];
    if (e) return e;
    const weave = TX.buildWeaveTex(t.matTex, 128);
    weave.repeat.set(20, 17);
    const over = TX.buildMatOverlay(t.matTex, 512);
    this._tex.push(weave, over);
    e = { weave, over };
    this._matTexCache[t.id] = e;
    return e;
  }

  _buildBoard() {
    const atlas = TX.buildAtlas();
    this._tex.push(atlas.tex);
    this.atlasTex = atlas.tex;
    /* fly 期间用"无中文"图集：飞行中棋盘旋转，格面中文会斜置/倒置；只留色块与图标，
     * land/cell45 再换回有字图集。两版图集除中文外像素一致，切换不跳色。 */
    this.atlasPlain = TX.buildAtlas({ glyph: false });
    this._tex.push(this.atlasPlain.tex);
    this.flyMode = false;
    this.boardFaceTex = TX.buildBoardFace();
    this._tex.push(this.boardFaceTex);
    this.tileMat = new THREE.MeshLambertMaterial({ map: atlas.tex, vertexColors: true });
    this.discSideMat = new THREE.MeshLambertMaterial({ color: 0x141C28 });
    this.discTopMat = new THREE.MeshLambertMaterial({ map: this.boardFaceTex, color: 0x9FB6D8 });

    const disc = new THREE.Mesh(new THREE.CylinderGeometry(DISC_R, DISC_R - 0.04, 0.03, 64, 1), [
      this.discSideMat, this.discTopMat, this.discSideMat
    ]);
    disc.position.y = 0.005 + 0.015;
    disc.receiveShadow = true;
    this.boardGroup.add(disc);
    this.disc = disc;

    const ringTiles = [];
    const homeTiles = [];
    const hangarPads = [];
    for (let n = 0; n < RING_N; n++) {
      const phi = ringPhi(n);
      const color = colorOfRing(n), kind = kindOf(n);
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.40);
      ringTiles.push({
        x: RING_R * Math.sin(phi), z: -RING_R * Math.cos(phi),
        rot: -Math.PI / 2 - phi, w: CELL, d: CELL,
        top: TILE_TOP, bottom: TILE_BOTTOM,
        uv: uvOfSlot(slotOf(kind, color)), side,
        n, kind, color
      });
    }
    for (const color of COLORS) {
      const phi = ringPhi(HOME_ENTRY[color]);
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.34);
      for (let s = 0; s < HOME_STEPS; s++) {
        const r = HOME_R0 - s * HOME_PITCH;
        homeTiles.push({
          x: r * Math.sin(phi), z: -r * Math.cos(phi),
          rot: -phi - Math.PI, w: HOME_CELL, d: HOME_CELL,
          top: TILE_TOP - 0.006, bottom: TILE_BOTTOM,
          uv: uvOfSlot(SLOT_HOME + COLORS.indexOf(color)), side,
          color, step: s
        });
      }
    }
    for (const color of COLORS) {
      const a = APRON_DEG[color] * DEG;
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.30);
      hangarPads.push({
        x: HANGAR_R * Math.sin(a), z: -HANGAR_R * Math.cos(a),
        rot: -a - Math.PI, w: 0.94, d: 0.94, top: TILE_BOTTOM + 0.024, bottom: TILE_BOTTOM,
        uv: uvOfSlot(SLOT_DARK), side: side.map((v) => v * 0.8), color, plate: true
      });
      const side2 = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.36);
      for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
        hangarPads.push({
          x: HANGAR_R * Math.sin(a) + (dx * Math.cos(a) + dz * Math.sin(a)),
          z: -HANGAR_R * Math.cos(a) + (-dx * Math.sin(a) + dz * Math.cos(a)),
          rot: -a - Math.PI, w: 0.28, d: 0.28,
          top: TILE_BOTTOM + 0.05, bottom: TILE_BOTTOM + 0.024,
          uv: uvOfSlot(SLOT_HANGAR + COLORS.indexOf(color)), side: side2,
          color, pad: true
        });
      }
    }
    this.ringMesh = new THREE.Mesh(buildTileGeometry(ringTiles.concat(homeTiles)), this.tileMat);
    this.ringMesh.receiveShadow = true;
    this.boardGroup.add(this.ringMesh);
    this.padMesh = new THREE.Mesh(buildTileGeometry(hangarPads), this.tileMat);
    this.padMesh.receiveShadow = true;
    this.boardGroup.add(this.padMesh);

    /* 中心终点：立体 hub（鼓形圆柱 + 底盘环 + 悬环 + 星徽 + 暖光晕），替代原平面金盘 */
    this.hubGroup = new THREE.Group();
    const hub = themeOf(this.theme).hub;
    this.hubTopMat = new THREE.MeshLambertMaterial({ map: null, color: 0xFFFFFF, emissive: 0x000000 });
    this.hubSideMat = new THREE.MeshLambertMaterial({ color: hub.side, emissive: 0x1A0E04 });
    this.hubStarMat = new THREE.MeshLambertMaterial({ color: hub.star, emissive: 0x3A2408 });
    this.hubRingMat = new THREE.MeshLambertMaterial({ color: hub.star, emissive: 0x2A1A06 });
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(HUB.r, HUB.r + 0.07, HUB.h, 40, 1),
      [this.hubSideMat, this.hubTopMat, this.hubSideMat]
    );
    drum.position.y = HUB.h / 2;
    drum.castShadow = this.shadows;
    drum.receiveShadow = true;
    this.hubGroup.add(drum);
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(HUB.ringR, 0.030, 8, 44), this.hubRingMat);
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.012;
    this.hubGroup.add(baseRing);
    /* 悬环：比鼓面高出一点，随呼吸微升降（立体感来源之一） */
    this.hubHalo = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.014, 6, 36), this.hubRingMat);
    this.hubHalo.rotation.x = -Math.PI / 2;
    this.hubHalo.position.y = HUB.h + 0.10;
    this.hubGroup.add(this.hubHalo);
    /* 星徽：挤出成有厚度的立体星，慢慢转 */
    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? HUB.starR : HUB.starR * 0.44;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.030, bevelEnabled: false, curveSegments: 1 });
    starGeo.rotateX(-Math.PI / 2);
    this.hubStar = new THREE.Mesh(starGeo, this.hubStarMat);
    this.hubStar.position.y = HUB.h + 0.014;
    this.hubStar.castShadow = this.shadows;
    this.hubGroup.add(this.hubStar);
    this.hubGlow = makeGlowPlane(0.92, hub.glow);
    this.hubGlow.position.y = HUB.h + 0.052;
    this.hubGlow.material.opacity = 0.26;
    this.hubGroup.add(this.hubGlow);
    this.hubGroup.position.y = 0.035;
    this.boardGroup.add(this.hubGroup);

    /* 目标格光晕 */
    this.targetGlow = makeGlowPlane(0.9, 0xFFC98A);
    this.targetGlow.position.y = TILE_TOP + 0.012;
    this.targetGlow.visible = false;
    this.boardGroup.add(this.targetGlow);

    /* 当前玩家信标（机坪上的小光环） */
    this.turnBeacon = new THREE.Group();
    const beaconRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.028, 8, 32),
      new THREE.MeshBasicMaterial({ color: HEX.red, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })
    );
    beaconRing.rotation.x = -Math.PI / 2;
    beaconRing.position.y = TILE_TOP + 0.02;
    this.turnBeacon.add(beaconRing);
    this._beaconRing = beaconRing;
    this.boardGroup.add(this.turnBeacon);
  }

  _buildStage() {
    this.stageGroup = new THREE.Group();
    this.stageGroup.position.set(0, TILE_BOTTOM, 0);
    this.stageGroup.visible = false;
    this.scene.add(this.stageGroup);
    this.stageGlow = makeGlowPlane(0.8, 0xFFD9A0);
    this.stageGlow.position.y = TILE_H + 0.008;
    this.stageGlow.material.opacity = 0.16;
    this.stageGroup.add(this.stageGlow);
    this.stageTile = null;

    this.bear = createBear();
    /* 小熊座位：偏向舞台格左后（格面字在右前），不再压在字上 */
    this.bearSeat = new THREE.Group();
    this.bearSeat.position.set(STAGE_BEAR.x, 0, STAGE_BEAR.z);
    this.bearSeat.scale.setScalar(STAGE_BEAR.s);
    this.bearSeat.add(this.bear.group);
    this.stageGroup.add(this.bearSeat);

    this.stageShadow = makeShadowPlane(1.5, 0);
    this.stageShadow.visible = false;
    this.scene.add(this.stageShadow);

    this.ripple = makeRippleMesh(1.1);
    this.scene.add(this.ripple);

    this.streaks = makeStreakGroup(TX.makeStreakTex());
    this.scene.add(this.streaks.group);
  }

  _buildDie() {
    const faces = TX.makeDieFaceTextures();
    this._tex.push.apply(this._tex, faces);
    /* V8.2.2：BoxGeometry 材质顺序是 +X/-X/+Y/-Y/+Z/-Z，而 DIE_FACES 定义了
     * 每个轴上的真实点数；必须按 DIE_FACES 取纹理，否则骰面会显示成另一个点数
     * （例：引擎 5 点、骰子显示 3 点）。 */
    this.dieMats = DIE_FACES.map((v) => new THREE.MeshLambertMaterial({ map: faces[v - 1] }));
    this.die = new THREE.Mesh(new THREE.BoxGeometry(DIE_SIZE, DIE_SIZE, DIE_SIZE), this.dieMats);
    this.die.castShadow = this.shadows;
    this.die.receiveShadow = true;
    this.scene.add(this.die);
    this.dieShadow = makeShadowPlane(0.5, 0.55);
    this.scene.add(this.dieShadow);
    this.placeDie(1);
  }

  _buildPlanesLayer() {
    this.planeLayer = new THREE.Group();
    this.scene.add(this.planeLayer);
  }

  /* ======================= 尺寸 / 循环 ======================= */
  _bindResize() {
    this._onWinResize = () => this.resize();
    window.addEventListener('resize', this._onWinResize, { passive: true });
    if (window.ResizeObserver) {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this.host);
    }
  }

  _bindVisibility() {
    this._onVis = () => {
      if (document.hidden) {
        this._paused = true;
        if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
      } else {
        this._paused = false;
        this._last = 0;
        if (this.reduced) this.requestRender();
        else this._startLoop();
      }
    };
    document.addEventListener('visibilitychange', this._onVis);
  }

  resize() {
    const w = Math.round(this.host.clientWidth || this.canvas.clientWidth || window.innerWidth || 0);
    const h = Math.round(this.host.clientHeight || this.canvas.clientHeight || window.innerHeight || 0);
    if (w < 2 || h < 2) return false;
    this.viewport = { w, h };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer.setPixelRatio(this.quality === 'low' ? Math.min(1, dpr) : dpr);
    this.renderer.setSize(w, h, false);
    this.rig.setAspect(w / h);
    if (this.onResize) {
      try { this.onResize(w, h); } catch (e) { console.warn('[board3d] onResize', e); }
    }
    this.requestRender();
    return true;
  }

  runAnim(ms, fn) {
    if (this.reduced) { fn(1); return Promise.resolve(); }
    return new Promise((resolve) => {
      this.anims.push({ t: 0, ms: Math.max(1, ms), fn, resolve });
    });
  }

  flushAnims() {
    const list = this.anims.slice();
    this.anims.length = 0;
    for (const a of list) {
      try { a.fn(1); } catch (e) { console.warn('[board3d] anim flush', e); }
      a.resolve();
    }
    this.requestRender();
  }

  _tickAnims(dt) {
    for (let i = this.anims.length - 1; i >= 0; i--) {
      const a = this.anims[i];
      a.t += dt;
      const k = clamp(a.t / a.ms, 0, 1);
      try { a.fn(k, a.t); } catch (e) { console.warn('[board3d] anim', e); }
      if (k >= 1) { this.anims.splice(i, 1); a.resolve(); }
    }
  }

  _startLoop() {
    if (this.reduced || this._paused || this._raf) return;
    const tick = (now) => {
      this._raf = 0;
      if (this._paused || this.reduced) return;
      try { this._frame(now); } catch (e) { console.warn('[board3d] frame error:', e && e.message ? e.message : e); }
      if (!this._paused && !this.reduced) this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }

  requestRender() {
    if (this._inFrame) return;
    if (this.reduced) {
      if (this._raf) return;
      this._raf = requestAnimationFrame((now) => {
        this._raf = 0;
        if (this._paused) return;
        this._frame(now, true);
      });
      return;
    }
    this._startLoop();
  }

  renderNow() {
    this._frame(performance.now(), true);
  }

  setReduced(flag) {
    this.reduced = !!flag;
    if (this.reduced) {
      this.flushAnims();
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
      this.renderNow();
    } else {
      this._last = 0;
      this._startLoop();
    }
  }

  _frame(now, oneShot) {
    this._inFrame = true;
    try {
      this._frameInner(now, oneShot);
    } finally {
      this._inFrame = false;
    }
  }

  _frameInner(now, oneShot) {
    if (!this._last) this._last = now;
    const rawDt = Math.max(0, now - this._last);
    this._last = now;
    const dt = Math.min(120, rawDt);
    const tA = performance.now();

    this._tickAnims(dt);

    if (!this.reduced) {
      if (this.cloudGroup.visible) {
        for (const sp of this.cloudGroup.children) {
          sp.position.x += Math.sin(now * 0.00012 + sp.position.z) * 0.0016;
          sp.position.z -= 0.0018;
          if (sp.position.z < -13) sp.position.z = 13;
        }
      }
      if (this.starGroup.visible) this.starGroup.rotation.y = now * 0.000018;
      if (this.bear.group.visible) {
        this.bear.group.position.y = TILE_H + Math.sin(now * 0.0032) * 0.012;
        this.bear.group.rotation.z = Math.sin(now * 0.0016) * 0.03;
      }
      if (this._beaconRing) {
        const s = 1 + Math.sin(now * 0.0024) * 0.08;
        this._beaconRing.scale.setScalar(s);
        this._beaconRing.material.opacity = 0.5 + Math.sin(now * 0.0024) * 0.18;
      }
      /* 中心 hub：星徽慢转 + 悬环呼吸（立体终点的动态线索） */
      if (this.hubStar) {
        this.hubStar.rotation.y = now * 0.00042;
        this.hubHalo.position.y = HUB.h + 0.10 + Math.sin(now * 0.0016) * 0.018;
        this.hubHalo.rotation.z = now * 0.0006;
        this.hubGlow.material.opacity = 0.22 + Math.sin(now * 0.0022) * 0.06;
      }
      this.streaks.update(dt, this.streaks.group.visible);
    }

    this.updatePlaneTransforms();
    this.rig.apply();
    this._updateLockProbe();

    const tB = performance.now();
    this.renderer.render(this.scene, this.camera);
    const tC = performance.now();
    this.lastCalls = this.renderer.info.render.calls;
    this.lastTris = this.renderer.info.render.triangles;

    this.perf.frames++;
    this.perf.sum += rawDt;
    this.perf.max = Math.max(this.perf.max, rawDt);
    if (rawDt > 25) this.perf.long25++;
    if (rawDt > 50) this.perf.long50++;
    this.perf.updateSum += tB - tA;
    this.perf.renderSum += tC - tB;
    if (!this.reduced && !oneShot) this._adaptCheck(rawDt);

    if (!this.ready && this.viewport.w > 0 && this.viewport.h > 0) {
      this.ready = true;
      if (this.onReady) this.onReady();
    }
  }

  _adaptCheck(dt) {
    if (!this.adapt || this.quality === 'low') return;
    this._adaptTimer = (this._adaptTimer || 0) + dt;
    if (this._adaptTimer < 1200) return;
    const avg = this.perf.sum / Math.max(1, this.perf.frames);
    this._adaptTimer = 0;
    this._slowWindows = avg > 24 ? (this._slowWindows || 0) + 1 : 0;
    if (this._slowWindows >= 3) {
      this._slowWindows = 0;
      this.quality = 'low';
      this.shadows = false;
      this.renderer.shadowMap.enabled = false;
      this.renderer.setPixelRatio(1);
      this.resize();
      this.renderer.render(this.scene, this.camera);
      console.info('[board3d] auto quality → low (dpr=1, shadows off)');
    }
  }

  /* 证据：fly 期间飞机是否钉在屏幕中心（NDC 变化范围） */
  _updateLockProbe() {
    if (!this.lockProbeId || this.perf.phase !== 'fly') return;
    const pm = this.planes.get(this.lockProbeId);
    if (!pm) return;
    const ndc = this.rig.ndcOf(pm.group.position);
    this.lockStats.samples++;
    this.lockStats.maxAbsX = Math.max(this.lockStats.maxAbsX, Math.abs(ndc.x));
    this.lockStats.maxAbsY = Math.max(this.lockStats.maxAbsY, Math.abs(ndc.y));
  }

  /* ======================= 主题 / 热度 / 玩家 ======================= */
  applyTheme(id, initial) {
    const t = themeOf(id);
    this.theme = t.id;
    this.host.setAttribute('data-3d-theme', t.id);
    this.scene.background.set(t.ink);
    this.scene.fog = new THREE.FogExp2(t.fog, t.fogDensity);
    if (this.hemi) {
      this.hemi.color.set(t.hemiSky);
      this.hemi.groundColor.set(t.hemiGround);
      this.hemi.intensity = t.hemiInt;
    }
    if (this.sun) {
      this.sun.color.set(t.sunColor);
      this.sun.intensity = t.sunInt;
    }
    this.trayMat.color.set(t.tray);
    this.discTopMat.color.set(t.disc);
    this.discSideMat.color.set(t.discSide);
    /* V8.2：垫面织纹 + 暗角叠层（按主题缓存）；垫面不再是纯色 */
    const mt = this._matTexFor(t);
    if (this.matMat.map !== mt.weave) {
      this.matMat.map = mt.weave;
      this.matMat.color.set(0xFFFFFF);
      this.matMat.needsUpdate = true;
    }
    if (this.matOverMat && this.matOverMat.map !== mt.over) {
      this.matOverMat.map = mt.over;
      this.matOverMat.needsUpdate = true;
    }
    /* 中心 hub 换色/换顶面贴图 */
    if (this.hubTopMat) {
      if (!this._hubTex) this._hubTex = {};
      if (!this._hubTex[t.id]) {
        this._hubTex[t.id] = TX.buildHubTop(t.hub, 256);
        this._tex.push(this._hubTex[t.id]);
      }
      this.hubTopMat.map = this._hubTex[t.id];
      this.hubTopMat.needsUpdate = true;
      this.hubSideMat.color.set(t.hub.side);
      this.hubStarMat.color.set(t.hub.star);
      this.hubRingMat.color.set(t.hub.star);
      if (this.hubGlow) this.hubGlow.material.color.set(t.hub.glow);
    }
    this.skyCloud.visible = t.sky === 'cloud';
    this.skyStar.visible = t.sky === 'star';
    this.skyPaper.visible = t.sky === 'paper';
    this.cloudGroup.visible = t.cloud;
    this.starGroup.visible = t.stars;
    this.cloudGroup.children.forEach((sp) => {
      sp.material.opacity = t.cloudOpacity;
      sp.material.color.set(t.cloudTint);
    });
    if (this.bear) this.bear.setOutfit(t.bear);
    this.setDim(this.dimK);
    this.applyHeat(this.heat);
    this.requestRender();
  }

  applyHeat(heat) {
    const h = clamp(Number(heat) || 0, 0, 100);
    this.heat = h;
    if (!this.lamp) return;
    const t = themeOf(this.theme);
    const k = h / 100;
    const col = new THREE.Color(t.heatCool).lerp(new THREE.Color(t.heatWarm), k);
    this.lamp.color.copy(col);
    this.lamp.intensity = 6 + k * 7;
    if (this.discTopMat) {
      this.discTopMat.emissive.copy(col).multiplyScalar(0.12 * k);
    }
    if (this.stageGlow) this.stageGlow.material.color.copy(new THREE.Color(t.heatWarm));
    this.requestRender();
  }

  applyTurn(turn, colors) {
    this.turn = turn === 'b' ? 'b' : 'a';
    if (colors) this.colors = { a: colors.a || 'red', b: colors.b || 'yellow' };
    const color = HEX[this.colors[this.turn]] || HEX.red;
    if (this._beaconRing) {
      this._beaconRing.material.color.set(color);
      const a = APRON_DEG[this.colors[this.turn]] * DEG;
      this.turnBeacon.position.set(
        HANGAR_R * Math.sin(a),
        0,
        -HANGAR_R * Math.cos(a)
      );
      this.turnBeacon.visible = true;
    }
    this.requestRender();
  }

  setDim(k) {
    const d = clamp(k, 0.1, 1);
    this.dimK = d;
    const t = themeOf(this.theme);
    this.tileMat.color.setRGB(d, d, d);
    const discF = lerp(0.36, 1, d);
    const trayF = lerp(0.5, 1, d);
    this.discTopMat.color.copy(new THREE.Color(t.disc).multiplyScalar(discF));
    this.trayMat.color.copy(new THREE.Color(t.tray).multiplyScalar(trayF));
    /* 垫面：贴图自带主题色，用灰度乘数压暗即可 */
    const matF = lerp(0.62, 1, d);
    this.matMat.color.setRGB(matF, matF, matF);
    if (this.matOverMat) this.matOverMat.opacity = lerp(0.85, 1, d);
    this.requestRender();
  }

  /* ======================= 飞机 ======================= */
  _accentFor(color) {
    return color === 'red' ? 0xFFE1D6 : color === 'yellow' ? 0xFFF1CF : 0xE8F0FF;
  }

  _createPlane(piece) {
    const color = piece.color || 'red';
    const p = makePlane(HEX[color] || HEX.red, this._accentFor(color));
    const shadow = makeShadowPlane(0.6, 0.5);
    const glow = makeGlowPlane(0.62, HEX[color] || HEX.red);
    glow.material.opacity = 0.1;
    this.planeLayer.add(p.group);
    this.planeLayer.add(shadow);
    this.planeLayer.add(glow);
    const pm = {
      id: piece.id,
      color,
      playerId: piece.playerId || String(piece.id).charAt(0),
      plane: p,
      group: p.group,
      shadow,
      glow,
      local: new THREE.Vector3(),
      localYaw: 0,
      fixedYaw: 0,
      mode: 'board',
      tileTopY: TILE_TOP,
      piece
    };
    return pm;
  }

  ensurePlane(id, color, playerId) {
    let pm = this.planes.get(id);
    if (pm) return pm;
    pm = this._createPlane({ id, color: color || 'red', playerId: playerId || String(id).charAt(0) });
    this.planes.set(id, pm);
    return pm;
  }

  _removePlane(id) {
    const pm = this.planes.get(id);
    if (!pm) return;
    this.planeLayer.remove(pm.group);
    this.planeLayer.remove(pm.shadow);
    this.planeLayer.remove(pm.glow);
    pm.plane.dispose();
    pm.shadow.geometry.dispose();
    if (pm.shadow.material.map) pm.shadow.material.map.dispose();
    pm.shadow.material.dispose();
    pm.glow.geometry.dispose();
    if (pm.glow.material.map) pm.glow.material.map.dispose();
    pm.glow.material.dispose();
    this.planes.delete(id);
  }

  setPieces(pieces, turn, colors) {
    const list = Array.isArray(pieces) ? pieces : [];
    this.pieces = list.map((p) => ({
      id: p.id,
      color: p.color || 'red',
      playerId: p.playerId || String(p.id).charAt(0),
      squareId: p.squareId || 'hangar:red:0',
      arrived: !!p.arrived,
      stackGroupId: p.stackGroupId || null
    }));
    const alive = {};
    for (const p of this.pieces) alive[p.id] = true;
    for (const id of Array.from(this.planes.keys())) {
      if (!alive[id]) this._removePlane(id);
    }
    const locals = pieceLocals(this.pieces);
    for (const p of this.pieces) {
      let pm = this.planes.get(p.id);
      if (!pm) {
        pm = this._createPlane(p);
        this.planes.set(p.id, pm);
      }
      if (pm.color !== p.color) {
        pm.color = p.color;
        pm.playerId = p.playerId;
        pm.plane.setColor(HEX[p.color] || HEX.red, this._accentFor(p.color));
        pm.glow.material.color.set(HEX[p.color] || HEX.red);
      }
      const loc = locals[p.id] || localOfSquare(p.squareId);
      pm.local.set(loc.x, loc.y, loc.z);
      pm.localYaw = loc.yaw;
      pm.tileTopY = loc.y - PLANE_HOVER;
      pm.mode = 'board';
      pm.piece = p;
      pm.group.visible = true;
      pm.group.scale.setScalar(1);
      pm.shadow.visible = true;
      this._applyPlaneLocal(pm);
    }
    if (turn) this.turn = turn === 'b' ? 'b' : 'a';
    if (colors) this.colors = { a: colors.a || 'red', b: colors.b || 'yellow' };
    this._planesDirty = true;
    this.updatePlaneTransforms();
    this.requestRender();
  }

  _applyPlaneLocal(pm) {
    pm.group.position.copy(pm.local);
    pm.group.rotation.set(0, pm.localYaw, 0);
  }

  setPlaneToSquare(id, squareId, opts = {}) {
    const pm = this.planes.get(id);
    if (!pm) return null;
    const loc = localOfSquare(squareId);
    pm.local.set(loc.x, loc.y, loc.z);
    pm.localYaw = loc.yaw;
    pm.tileTopY = loc.y - PLANE_HOVER;
    pm.mode = 'board';
    if (opts.visible !== false) {
      pm.group.visible = true;
      pm.group.scale.setScalar(1);
      pm.shadow.visible = true;
    }
    this._applyPlaneLocal(pm);
    this.updatePlaneTransforms();
    this.requestRender();
    return pm;
  }

  setPlaneLocal(id, loc) {
    const pm = this.planes.get(id);
    if (!pm) return null;
    pm.local.set(loc.x, loc.y, loc.z);
    pm.localYaw = loc.yaw;
    pm.mode = 'board';
    this._applyPlaneLocal(pm);
    this.updatePlaneTransforms();
    this.requestRender();
    return pm;
  }

  fixPlane(id) {
    const pm = this.planes.get(id);
    if (!pm) return null;
    pm.fixedYaw = this.boardGroup.rotation.y + pm.localYaw;
    pm.mode = 'fixed';
    pm.group.position.copy(FOCUS_WORLD);
    pm.group.rotation.set(0, pm.fixedYaw, 0);
    pm.group.visible = true;
    pm.group.scale.setScalar(1);
    pm.shadow.visible = true;
    this.updatePlaneTransforms();
    this.requestRender();
    return pm;
  }

  hidePlane(id) {
    const pm = this.planes.get(id);
    if (!pm) return;
    pm.mode = 'hidden';
    pm.group.visible = false;
    pm.shadow.visible = false;
    pm.glow.material.opacity = 0;
    this.requestRender();
  }

  updatePlaneTransforms() {
    if (!this.planes.size) return;
    for (const pm of this.planes.values()) {
      if (pm.mode === 'board') {
        this._v.copy(pm.local);
        this.boardGroup.localToWorld(this._v);
        pm.group.position.copy(this._v);
        pm.group.rotation.set(0, this.boardGroup.rotation.y + pm.localYaw, 0);
        pm.shadow.position.set(this._v.x, 0.006, this._v.z);
        pm.shadow.visible = pm.group.visible;
        pm.glow.position.set(this._v.x, pm.tileTopY + 0.012, this._v.z);
      } else if (pm.mode === 'fixed') {
        pm.group.position.copy(FOCUS_WORLD);
        pm.group.rotation.set(0, pm.fixedYaw, 0);
        pm.shadow.position.set(FOCUS_WORLD.x, 0.006, FOCUS_WORLD.z);
        pm.shadow.visible = true;
        pm.glow.position.set(FOCUS_WORLD.x, TILE_TOP + 0.012, FOCUS_WORLD.z);
      } else {
        pm.group.visible = false;
        pm.shadow.visible = false;
        pm.glow.material.opacity = 0;
        continue;
      }
      const active = pm.playerId === this.turn;
      const target = pm.mode === 'fixed' ? 0.95 : (active ? (this.reduced ? 0.5 : 0.55) : 0.08);
      pm.glow.material.opacity += (target - pm.glow.material.opacity) * 0.16;
    }
  }

  /* ======================= 棋盘位姿 / 目标 ======================= */
  boardPose() {
    return { theta: this.boardGroup.rotation.y, tx: this.boardGroup.position.x, tz: this.boardGroup.position.z };
  }

  applyPose(pose) {
    this.boardGroup.rotation.y = pose.theta;
    this.boardGroup.position.set(pose.tx, 0, pose.tz);
    this.boardGroup.updateMatrixWorld(true);
    this.updatePlaneTransforms();
    this.requestRender();
  }

  setTargetGlow(squareId, opacity) {
    if (!squareId) {
      this.targetGlow.visible = false;
      return;
    }
    const loc = localOfSquare(squareId);
    this.targetGlow.position.set(loc.x, loc.y - PLANE_HOVER + 0.012, loc.z);
    this.targetGlow.visible = true;
    this.targetGlow.material.opacity = opacity === undefined ? 0.75 : opacity;
    this.requestRender();
  }

  pulseTargetGlow(ms) {
    const start = performance.now();
    const run = (now) => {
      const k = clamp((now - start) / ms, 0, 1);
      this.targetGlow.material.opacity = 0.35 + 0.5 * Math.sin(k * Math.PI);
      if (k < 1) requestAnimationFrame(run);
      else this.targetGlow.material.opacity = 0.65;
    };
    requestAnimationFrame(run);
  }

  setStreaks(on) {
    this.streaks.group.visible = !!(on && !this.reduced);
    this.requestRender();
  }

  /* fly 期间隐藏格面中文（棋盘旋转时斜置的字会变成主视觉）；land/cell45 恢复 */
  setFlyMode(on) {
    const flag = !!on;
    if (flag === this.flyMode) return;
    this.flyMode = flag;
    const next = flag ? this.atlasPlain.tex : this.atlasTex;
    if (this.tileMat && this.tileMat.map !== next) {
      this.tileMat.map = next;
      this.tileMat.needsUpdate = true;
    }
    this.requestRender();
  }

  playRipple(instant) {
    this.ripple.position.set(0, 0.012, 0);
    this.ripple.visible = true;
    this.ripple.scale.setScalar(0.4);
    this.ripple.material.opacity = 0.55;
    if (this.reduced || instant) {
      this.ripple.material.opacity = 0.2;
      this.requestRender();
      return Promise.resolve();
    }
    const start = performance.now();
    return new Promise((resolve) => {
      const run = (now) => {
        const k = clamp((now - start) / 520, 0, 1);
        const e = easeOut(k);
        this.ripple.scale.setScalar(0.4 + e * 2.2);
        this.ripple.material.opacity = 0.55 * (1 - k);
        this.requestRender();
        if (k < 1) requestAnimationFrame(run);
        else { this.ripple.visible = false; resolve(); }
      };
      requestAnimationFrame(run);
    });
  }

  /* ======================= 格子舞台 / 小熊 ======================= */
  setStageSquare(squareId) {
    if (this.stageTile) {
      this.stageGroup.remove(this.stageTile);
      this.stageTile.geometry.dispose();
      this.stageTile = null;
    }
    this.stageId = squareId;
    if (this.stageTileMat) {
      if (this.stageTex) { this.stageTex.dispose(); this.stageTex = null; }
      this.stageTileMat.dispose();
    }
    const p = squareId ? /^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(squareId) : null;
    let sideColor, kind, color;
    if (p) {
      color = p[1];
      kind = 'entry';
      sideColor = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.42);
    } else if (squareId && /^ring:(\d+)$/.test(squareId)) {
      const n = Number(/^ring:(\d+)$/.exec(squareId)[1]);
      color = colorOfRing(n);
      kind = kindOf(n);
      sideColor = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.42);
    } else {
      color = 'red';
      kind = 'ring';
      sideColor = [0.16, 0.14, 0.18];
    }
    /* V8.2：舞台格自带 256px 贴图（格面字偏前中、小熊站位在左后），不再复用 64px 图集：
     * 字更大更清楚，且和小熊错开。 */
    this.stageTex = TX.buildStagePlate(kind, color, KIND_LABEL[kind] || '', 256, STAGE_TEXT);
    this._tex.push(this.stageTex);
    this.stageTileMat = new THREE.MeshLambertMaterial({ map: this.stageTex, vertexColors: true });
    const geo = buildTileGeometry([{
      x: 0, z: 0, rot: STAGE_AZIM * DEG, w: STAGE_PLATE, d: STAGE_PLATE,
      top: TILE_H, bottom: 0, uv: [0, 0, 1, 1], side: sideColor
    }]);
    this.stageTile = new THREE.Mesh(geo, this.stageTileMat);
    this.stageTile.castShadow = this.shadows;
    this.stageTile.receiveShadow = true;
    this.stageGroup.add(this.stageTile);
    if (this.bearSeat) {
      this.bearSeat.position.set(STAGE_BEAR.x, 0, STAGE_BEAR.z);
      this.bearSeat.scale.setScalar(STAGE_BEAR.s);
    }
  }

  setStageVisible(v) {
    this.stageGroup.visible = !!v;
    this.stageShadow.visible = !!v;
    if (!v) this.bear.setVisible(false);
    this.requestRender();
  }

  setStageRise(rise) {
    this.stageRise = rise;
    this.stageGroup.position.y = TILE_BOTTOM + rise;
    this.stageShadow.position.set(0, 0.004, 0);
    this.requestRender();
  }

  setBearVisible(v) {
    this.bear.setVisible(!!v);
    this.requestRender();
  }

  /* ======================= 骰子 ======================= */
  dieFaceNormal(v) {
    const i = DIE_FACES.indexOf(v);
    const n = new THREE.Vector3();
    if (i === 0) n.set(1, 0, 0);
    else if (i === 1) n.set(-1, 0, 0);
    else if (i === 2) n.set(0, 1, 0);
    else if (i === 3) n.set(0, -1, 0);
    else if (i === 4) n.set(0, 0, 1);
    else n.set(0, 0, -1);
    return n;
  }

  dieSettleQuat(v) {
    const target = new THREE.Vector3(0.34, 0.86, 0.38).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(this.dieFaceNormal(v), target);
    const spin = new THREE.Quaternion().setFromAxisAngle(target, 0.22);
    return q.multiply(spin);
  }

  placeDie(value) {
    const v = clamp(Number(value) || 1, 1, 6);
    this.dieValue = v;
    this.die.position.copy(DIE_HOME);
    this.die.quaternion.copy(this.dieSettleQuat(v));
    this.dieShadow.position.set(DIE_HOME.x, 0.005, DIE_HOME.z);
    this.dieShadow.scale.setScalar(1);
    this.dieShadow.material.opacity = 0.55;
    this.requestRender();
  }

  tossDie(value, instant) {
    const v = clamp(Number(value) || 1, 1, 6);
    this.dieValue = v;
    if (this.reduced || instant) {
      this.placeDie(v);
      return Promise.resolve();
    }
    const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.7, 1.9, 0.4));
    const qs = this.dieSettleQuat(v);
    const axis = this._axis.set(0.42, 0.87, 0.26).normalize();
    return this.runAnim(1080, (k) => {
      const e = easeOut(Math.min(1, k / 0.62));
      const fall = 1 - e;
      const bounce = Math.abs(Math.sin(k * Math.PI * 3.1)) * (1 - k) * 0.36;
      this.die.position.set(
        lerp(DIE_TOSS_FROM.x, DIE_HOME.x, e),
        DIE_HOME.y + fall * 2.4 + bounce,
        lerp(DIE_TOSS_FROM.z, DIE_HOME.z, e)
      );
      this._q1.copy(q0).multiply(this._q2.setFromAxisAngle(axis, (1 - smoothstep(0.5, 1, k)) * 7.5));
      this.die.quaternion.copy(this._q1);
      this.die.quaternion.slerp(qs, smoothstep(0.58, 1, k));
      this.dieShadow.position.set(this.die.position.x, 0.005, this.die.position.z);
      this.dieShadow.scale.setScalar(clamp(1.15 - (this.die.position.y - DIE_HOME.y) * 0.4, 0.5, 1.2));
      this.dieShadow.material.opacity = clamp(0.55 - (this.die.position.y - DIE_HOME.y) * 0.18, 0.12, 0.55);
    }).then(() => {
      this.placeDie(v);
    });
  }

  /* ======================= 性能 / 调试 ======================= */
  markPhase(name) {
    if (this.perf.frames > 0 && this.perf.phase) {
      this.perf.phases[this.perf.phase] = {
        frames: this.perf.frames,
        avgMs: +(this.perf.sum / this.perf.frames).toFixed(2),
        maxMs: +this.perf.max.toFixed(2),
        long25: this.perf.long25,
        long50: this.perf.long50,
        ms: +(performance.now() - this.perf.since).toFixed(0),
        calls: this.lastCalls, tris: this.lastTris,
        updateMs: +(this.perf.updateSum / this.perf.frames).toFixed(2),
        renderMs: +(this.perf.renderSum / this.perf.frames).toFixed(2)
      };
    }
    this.perf.phase = name;
    this.perf.frames = 0;
    this.perf.sum = 0;
    this.perf.max = 0;
    this.perf.long25 = 0;
    this.perf.long50 = 0;
    this.perf.updateSum = 0;
    this.perf.renderSum = 0;
    this.perf.since = performance.now();
  }

  debugSnapshot() {
    const cur = this.perf.frames > 0 ? {
      frames: this.perf.frames,
      avgMs: +(this.perf.sum / this.perf.frames).toFixed(2),
      maxMs: +this.perf.max.toFixed(2),
      long25: this.perf.long25,
      long50: this.perf.long50,
      long25Ratio: +(this.perf.long25 / this.perf.frames).toFixed(3),
      fps: +((this.perf.frames * 1000) / Math.max(1, performance.now() - this.perf.since)).toFixed(1),
      updateMs: +(this.perf.updateSum / this.perf.frames).toFixed(2),
      renderMs: +(this.perf.renderSum / this.perf.frames).toFixed(2),
      ms: +(performance.now() - this.perf.since).toFixed(0)
    } : null;
    const plane = this.planes.get('a:0') || this.planes.values().next().value;
    const probe = {
      camera: {
        pos: this.camera.position.toArray().map((v) => +v.toFixed(4)),
        fov: this.camera.fov,
        locked: this.rig.locked
      },
      board: {
        theta: +this.boardGroup.rotation.y.toFixed(5),
        tx: +this.boardGroup.position.x.toFixed(5),
        tz: +this.boardGroup.position.z.toFixed(5)
      },
      lock: {
        samples: this.lockStats.samples,
        maxAbsX: +this.lockStats.maxAbsX.toFixed(5),
        maxAbsY: +this.lockStats.maxAbsY.toFixed(5)
      },
      stage: { visible: this.stageGroup.visible, rise: +this.stageRise.toFixed(3), bear: +this.bear.group.scale.x.toFixed(3) },
      streaks: this.streaks.group.visible
    };
    if (plane) {
      const ndc = this.rig.ndcOf(plane.group.position);
      probe.plane = {
        id: plane.id,
        world: plane.group.position.toArray().map((v) => +v.toFixed(4)),
        ndc: [+ndc.x.toFixed(5), +ndc.y.toFixed(5)]
      };
    }
    const dpr = this.renderer.getPixelRatio();
    return {
      phase: this.perf.phase,
      current: cur,
      phases: this.perf.phases,
      render: {
        calls: this.lastCalls,
        triangles: this.lastTris,
        cssPx: this.viewport.w * this.viewport.h,
        pixels: Math.round(this.viewport.w * this.viewport.h * dpr * dpr)
      },
      quality: this.quality,
      dpr,
      shadows: this.renderer.shadowMap.enabled,
      antialias: this.useAA,
      viewport: this.viewport,
      probe
    };
  }

  /* ======================= 释放 ======================= */
  dispose() {
    if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    this._paused = true;
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this._onWinResize) window.removeEventListener('resize', this._onWinResize);
    if (this._onVis) document.removeEventListener('visibilitychange', this._onVis);
    const disposeMat = (m) => {
      if (!m) return;
      if (Array.isArray(m)) { m.forEach(disposeMat); return; }
      if (m.map) m.map.dispose();
      m.dispose();
    };
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) disposeMat(o.material);
    });
    this._tex.forEach((t) => { try { t.dispose(); } catch (e) { /* noop */ } });
    try { this.renderer.dispose(); } catch (e) { /* noop */ }
    try {
      const gl = this.renderer.getContext && this.renderer.getContext();
      const lose = gl && gl.getExtension('WEBGL_lose_context');
      if (lose) lose.loseContext();
    } catch (e) { /* noop */ }
    this.planes.clear();
    this.anims.length = 0;
  }
}

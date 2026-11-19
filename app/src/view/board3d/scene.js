/* ==========================================================================
 * V9 · 真 3D 主桌 · 电影写实场景装配
 * 午夜机舱：舱壁/舷窗云海/遮光板/阅读灯/胡桃木小桌板/绒布垫/灰尘/轻雾
 * 棋盘：胡桃木圆盘 + 黄铜包边 + 倒角珐琅格（雕刻图标）+ 立体黄铜星徽
 * 棋子：象牙纸折痕飞机 + 黄铜配重；小熊：绒布 PBR（按材质合并）
 * 光照：ACESFilmic + 暖 key（阅读灯）+ 冷 rim（舷窗）+ 低 fill + PMREM 程序化环境
 * 后处理：单 pass 暗角 + 胶片颗粒（high/medium），Bloom/DOF 用发光层/景深雾化降级方案
 * --------------------------------------------------------------------------
 * 只渲染；不创建任何 HUD/卡片/按钮；canvas 由 entry 创建并 pointer-events:none。
 * 不改 camera.js / entry.js / director.js：长焦重构、俯瞰降机位、idle 微漂移都在
 * 本文件的 _applyCineCamera() 内完成（director 的目标仍是 fov42/elev58）。
 * ========================================================================== */
import * as THREE from '../../../render/node_modules/three/build/three.module.js';
import {
  DEG, RING_N, RING_R, CELL, TILE_H, TILE_BOTTOM, TILE_TOP, HOME_STEPS, HOME_R0,
  HOME_PITCH, HOME_CELL, HANGAR_R, PLANE_HOVER, PLANE_Y, DIE_SIZE, STAGE_RISE, STAGE_AZIM,
  STAGE_PLATE, STAGE_BEAR, STAGE_TEXT, HUB, TABLE, FELT, CABIN, MAT, CINE, QUALITY,
  COLORS, HOME_ENTRY, APRON_DEG, HEX, DIE_FACES, THEMES, themeOf, KIND_LABEL,
  colorOfRing, kindOf, ringPhi, slotOf, uvOfSlot, SLOT_DARK, SLOT_HOME, SLOT_HANGAR,
  clamp, lerp, easeOut, smoothstep
} from './constants.js';
import * as TX from './textures.js';
import {
  buildTileGeometry, makePlane, makeShadowPlane, makeGlowPlane, makeRippleMesh,
  makeStreakGroup, makeDieGeometry, mergeGeoms
} from './parts.js';
import { createBear } from './bear.js';
import { CameraRig } from './camera.js';
import { localOfSquare, localOfPieceSquare, pieceLocals } from './mapping.js';

const DISC_R = 3.30;
const DIE_HOME = new THREE.Vector3(1.62, DIE_SIZE / 2 + 0.004, 3.02);
const DIE_TOSS_FROM = new THREE.Vector3(0.9, 2.7, 2.2);
const FOCUS_WORLD = new THREE.Vector3(0, PLANE_Y, 0);

function detectQuality() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const ua = nav.userAgent || '';
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return 'medium';
  const mem = nav.deviceMemory || 8;
  const cores = nav.hardwareConcurrency || 8;
  return (mem <= 4 || cores <= 4) ? 'medium' : 'high';
}

export class BoardScene {
  constructor(host, canvas, opts = {}) {
    this.host = host;
    this.canvas = canvas;
    this.reduced = !!opts.reduced;
    this._shadowOpt = opts.shadows !== false;
    this.adapt = opts.adapt !== false;
    this.quality = opts.quality && QUALITY[opts.quality] ? opts.quality : detectQuality();
    this.shadows = this._shadowOpt && QUALITY[this.quality].shadow > 0;
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
    this._v2 = new THREE.Vector3();
    this._right = new THREE.Vector3();
    this._up = new THREE.Vector3();
    this._axis = new THREE.Vector3();
    this._q1 = new THREE.Quaternion();
    this._q2 = new THREE.Quaternion();
    this._planesDirty = true;
    this._tex = [];
    this.lockProbeId = null;
    this.perf = {
      phase: 'boot', frames: 0, sum: 0, max: 0, long25: 0, long50: 0, since: 0,
      updateSum: 0, renderSum: 0, phases: {}
    };
    this.lockStats = { samples: 0, maxAbsX: 0, maxAbsY: 0, reset() { this.samples = 0; this.maxAbsX = 0; this.maxAbsY = 0; } };
    this.lastCalls = 0;
    this.lastTris = 0;
    this._elevK = 0;
    this._fxTime = 0;
    this._dustCount = QUALITY[this.quality].dust;
    this._dustBase = null;
    this._winTex = {};
    this._wallTex = {};
    this._overlayTex = {};
    this._hubTex = {};
    this._buildRenderer();
    this._buildScene();
    this._buildEnvironment();
    this._buildLights();
    this._buildCabin();
    this._buildTable();
    this._buildBoard();
    this._buildStage();
    this._buildDie();
    this._buildPlanesLayer();
    this._buildAtmosphere();
    this._buildFx();
    this._bindResize();
    this._bindVisibility();
    this.applyTheme(this.theme, true);
    this.applyHeat(0);
    this.applyTurn('a', this.colors);
    this._applyQuality();
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
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.shadowMap.enabled = this.shadows;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.useAA = useAA;
    this._aniso = Math.min(8, this.renderer.capabilities.getMaxAnisotropy());
    /* 共享材质贴图（一次生成；多主题只改 tint / 换景观图） */
    this._wood = TX.buildWoodTextures(0xE6D6C2, 512);
    this._felt = TX.buildFeltTextures(0xE8E0D2, 256);
    this._brass = TX.buildBrushedBrass(256);
    /* 木/绒布/黄铜要在桌板/垫布/嵌线上平铺：统一 RepeatWrapping（UV = 世界尺寸） */
    for (const set of [this._wood, this._felt, this._brass]) {
      for (const k of ['map', 'normal', 'rough']) {
        const tx = set[k];
        if (!tx) continue;
        tx.wrapS = tx.wrapT = THREE.RepeatWrapping;
        tx.needsUpdate = true;
      }
    }
    this._tex.push(this._wood.map, this._wood.normal, this._wood.rough,
      this._felt.map, this._felt.normal, this._felt.rough,
      this._brass.map, this._brass.normal, this._brass.rough);
  }

  _buildScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05080D);
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.05, 240);
    this.rig = new CameraRig(this.camera, { runAnim: (ms, fn) => this.runAnim(ms, fn) });
  }

  _buildEnvironment() {
    /* PMREM + 程序化机舱环境（无外链 HDR）：一次性烘焙，运行时零成本 */
    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const room = TX.buildEnvironmentScene();
      const rt = pmrem.fromScene(room, 0.04, 0.1, 100);
      this.envRT = rt;
      this.envTex = rt.texture;
      this.scene.environment = this.envTex;
      this.scene.environmentIntensity = 0.55;
      room.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
      pmrem.dispose();
    } catch (e) {
      console.warn('[board3d] PMREM failed:', e && e.message ? e.message : e);
      this.envTex = null;
    }
  }

  _buildLights() {
    const t = themeOf(this.theme);
    this.hemi = new THREE.HemisphereLight(t.light.hemiSky, t.light.hemiGround, t.light.hemiInt);
    this.scene.add(this.hemi);
    this.ambient = new THREE.AmbientLight(0xFFFFFF, 0.055);
    this.scene.add(this.ambient);

    /* 暖 key：阅读灯（3200K 左右）从左后上方打下来 → 棋子投影朝右前 */
    this.key = new THREE.DirectionalLight(t.light.key, t.light.keyInt);
    this.key.position.set(-3.4, 5.6, -2.2);
    this.key.castShadow = this.shadows;
    this.key.shadow.mapSize.set(QUALITY[this.quality].shadow, QUALITY[this.quality].shadow);
    this.key.shadow.camera.left = -6.5;
    this.key.shadow.camera.right = 6.5;
    this.key.shadow.camera.top = 6.5;
    this.key.shadow.camera.bottom = -6.5;
    this.key.shadow.camera.near = 0.5;
    this.key.shadow.camera.far = 26;
    this.key.shadow.bias = -0.0006;
    this.key.shadow.normalBias = 0.015;
    this.key.shadow.radius = 3;
    this.scene.add(this.key);
    this.keyTarget = new THREE.Object3D();
    this.scene.add(this.keyTarget);
    this.key.target = this.keyTarget;

    /* 冷 rim：舷窗（右后上方），不投影 */
    this.rim = new THREE.DirectionalLight(t.light.rim, t.light.rimInt);
    this.rim.position.set(4.6, 3.2, -3.4);
    this.scene.add(this.rim);

    /* 低 fill：观察者方向，只抬暗部 */
    this.fill = new THREE.DirectionalLight(t.light.fill, t.light.fillInt);
    this.fill.position.set(0.4, 2.4, 6.0);
    this.scene.add(this.fill);

    /* 舱壁 wash：从观众侧打向舱壁（normal +Z），否则两面墙只有环境光、读作黑幕 */
    this.wallWash = new THREE.DirectionalLight(t.light.rim, t.light.rimInt * 0.52);
    this.wallWash.position.set(0.8, 3.4, 3.2);
    this.wallWash.target.position.set(0.4, 1.0, CABIN.wallZ);
    this.scene.add(this.wallWash);
    this.scene.add(this.wallWash.target);

    /* 阅读灯本体点光（暖、无阴影，负责桌面近处衰减） */
    this.lamp = new THREE.PointLight(t.light.lamp, t.light.lampInt, t.light.lampDist, 2);
    this.lamp.position.set(CABIN.lamp.x, CABIN.lamp.y - 0.12, CABIN.lamp.z + 0.16);
    this.scene.add(this.lamp);
  }

  /* 机舱：舱壁 / 舷窗云海 / 遮光板 / 阅读灯 / 地板 */
  _buildCabin() {
    const g = new THREE.Group();
    this.scene.add(g);
    this.cabinGroup = g;

    /* 舱壁 */
    this.wallMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.88, metalness: 0.02, envMapIntensity: 0.25 });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(CABIN.wallW, CABIN.wallH), this.wallMat);
    wall.position.set(0, CABIN.wallBottom + CABIN.wallH / 2, CABIN.wallZ);
    wall.receiveShadow = false;
    g.add(wall);
    this.wallMesh = wall;

    /* 舱壁黄铜压条（舷窗上方一条，压住画面最上沿的单调） */
    const trim = new THREE.Mesh(new THREE.BoxGeometry(CABIN.wallW * 0.46, 0.030, 0.030), this._brassMat());
    trim.position.set(-1.2, CABIN.window.y + CABIN.window.h / 2 + 0.26, CABIN.wallZ + 0.035);
    g.add(trim);
    this.wallTrim = trim;

    /* 舷窗景观（程序化 canvas：云海/星轨/纸月） */
    this.windowMat = new THREE.MeshBasicMaterial({ map: null, fog: false, color: 0xE4EDF7 });
    const winR = Math.min(CABIN.window.w, CABIN.window.h) * 0.30;
    const winGeo = roundedPlaneGeometry(CABIN.window.w, CABIN.window.h, winR);
    const win = new THREE.Mesh(winGeo, this.windowMat);
    win.position.set(CABIN.window.x, CABIN.window.y, CABIN.window.z);
    g.add(win);
    this.windowMesh = win;
    this._winGeo = winGeo;

    /* 玻璃反光层（PBR 玻璃：低粗糙 + 环境反射） */
    this.glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xBFD4E4, roughness: MAT.glass.roughness, metalness: MAT.glass.metalness,
      transparent: true, opacity: 0.16, envMapIntensity: MAT.glass.envMapIntensity,
      depthWrite: false, side: THREE.DoubleSide, clearcoat: 1, clearcoatRoughness: 0.15
    });
    const glass = new THREE.Mesh(winGeo, this.glassMat);
    glass.position.set(CABIN.window.x, CABIN.window.y, CABIN.window.z + 0.012);
    g.add(glass);
    this.glassMesh = glass;

    /* 舷窗黄铜圆角框（Shape + 洞 = 真正的一圈金属；圆角半径与景观面一致） */
    const ow = CABIN.window.w + 0.26, oh = CABIN.window.h + 0.26;
    const rr = winR + 0.13;
    const outer = new THREE.Shape();
    outer.moveTo(-ow / 2 + rr, -oh / 2);
    outer.lineTo(ow / 2 - rr, -oh / 2);
    outer.quadraticCurveTo(ow / 2, -oh / 2, ow / 2, -oh / 2 + rr);
    outer.lineTo(ow / 2, oh / 2 - rr);
    outer.quadraticCurveTo(ow / 2, oh / 2, ow / 2 - rr, oh / 2);
    outer.lineTo(-ow / 2 + rr, oh / 2);
    outer.quadraticCurveTo(-ow / 2, oh / 2, -ow / 2, oh / 2 - rr);
    outer.lineTo(-ow / 2, -oh / 2 + rr);
    outer.quadraticCurveTo(-ow / 2, -oh / 2, -ow / 2 + rr, -oh / 2);
    const hole = new THREE.Path();
    const iw = CABIN.window.w, ih = CABIN.window.h, ir = winR;
    hole.moveTo(-iw / 2 + ir, -ih / 2);
    hole.lineTo(iw / 2 - ir, -ih / 2);
    hole.quadraticCurveTo(iw / 2, -ih / 2, iw / 2, -ih / 2 + ir);
    hole.lineTo(iw / 2, ih / 2 - ir);
    hole.quadraticCurveTo(iw / 2, ih / 2, iw / 2 - ir, ih / 2);
    hole.lineTo(-iw / 2 + ir, ih / 2);
    hole.quadraticCurveTo(-iw / 2, ih / 2, -iw / 2, ih / 2 - ir);
    hole.lineTo(-iw / 2, -ih / 2 + ir);
    hole.quadraticCurveTo(-iw / 2, -ih / 2, -iw / 2 + ir, -ih / 2);
    outer.holes.push(hole);
    const frameGeo = new THREE.ExtrudeGeometry(outer, {
      depth: 0.060, bevelEnabled: true, bevelThickness: 0.016, bevelSize: 0.016, bevelSegments: 2, curveSegments: 8, steps: 1
    });
    const frame = new THREE.Mesh(frameGeo, this._brassMat());
    frame.position.set(CABIN.window.x, CABIN.window.y, CABIN.window.z + 0.03);
    frame.castShadow = false;
    g.add(frame);
    this.windowFrame = frame;

    /* 遮光板（拉下一半的毛毡帘） */
    const shadeH = CABIN.window.h * CABIN.shade;
    this.shadeMat = new THREE.MeshStandardMaterial({
      map: this._felt.map, normalMap: this._felt.normal, color: 0x241E1A,
      roughness: MAT.felt.roughness, metalness: 0, envMapIntensity: 0.2
    });
    const shade = new THREE.Mesh(new THREE.PlaneGeometry(CABIN.window.w + 0.20, shadeH), this.shadeMat);
    shade.position.set(CABIN.window.x, CABIN.window.y + CABIN.window.h / 2 - shadeH / 2 + 0.02, CABIN.window.z + 0.02);
    g.add(shade);
    this.shadeMesh = shade;
    /* 遮光板下沿黄铜拉杆 */
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, CABIN.window.w + 0.22, 8, 1), this._brassMat());
    bar.rotation.z = Math.PI / 2;
    bar.position.set(CABIN.window.x, CABIN.window.y + CABIN.window.h / 2 - shadeH + 0.02, CABIN.window.z + 0.025);
    g.add(bar);

    /* 阅读灯：壁座 + 悬臂 + 锥形灯罩（合并 1 draw）+ 灯泡 + 光晕 */
    const brass = this._brassMat();
    const plate = new THREE.CylinderGeometry(0.055, 0.055, 0.022, 14);
    const plateM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    plateM.setPosition(CABIN.lamp.x, CABIN.lamp.y, CABIN.wallZ + 0.055);
    const arm = new THREE.CylinderGeometry(0.014, 0.014, 0.30, 8);
    const armM = new THREE.Matrix4().makeRotationX(Math.PI / 2);
    armM.setPosition(CABIN.lamp.x, CABIN.lamp.y, CABIN.wallZ + 0.20);
    const cone = new THREE.ConeGeometry(0.125, 0.16, 18, 1, true);
    const coneM = new THREE.Matrix4().makeTranslation(CABIN.lamp.x, CABIN.lamp.y + 0.01, CABIN.lamp.z);
    const lampGeo = mergeGeoms([{ geo: plate, matrix: plateM }, { geo: arm, matrix: armM }, { geo: cone, matrix: coneM }]);
    plate.dispose(); arm.dispose(); cone.dispose();
    const lampMesh = new THREE.Mesh(lampGeo, brass);
    lampMesh.castShadow = false;
    g.add(lampMesh);
    this.lampMesh = lampMesh;
    /* 灯泡（自发光，不参与 tone mapping 压缩，像真正的暖光点） */
    this.bulbMat = new THREE.MeshBasicMaterial({ color: 0xFFE3B4, toneMapped: false, fog: false });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 9), this.bulbMat);
    bulb.position.set(CABIN.lamp.x, CABIN.lamp.y - 0.055, CABIN.lamp.z);
    g.add(bulb);
    this.bulb = bulb;
    /* 灯光晕（轻量 bloom：加色 sprite） */
    this.lampGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeGlowTex(), color: 0xFFC98A, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, fog: false, toneMapped: false
    }));
    this.lampGlow.scale.set(1.9, 1.9, 1);
    this.lampGlow.position.set(CABIN.lamp.x, CABIN.lamp.y - 0.05, CABIN.lamp.z + 0.02);
    g.add(this.lampGlow);
    /* 舷窗光晕（冷光溢出，读作 bloom） */
    this.winGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeGlowTex(), color: 0x9FC6F0, transparent: true, opacity: 0.22,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false
    }));
    this.winGlow.scale.set(3.6, 2.6, 1);
    this.winGlow.position.set(CABIN.window.x, CABIN.window.y, CABIN.window.z + 0.16);
    g.add(this.winGlow);

    /* 机舱地板（只会在桌沿下方露出一条，但少了它就露空） */
    this.floorMat = new THREE.MeshStandardMaterial({ color: 0x0B0D10, roughness: 0.92, metalness: 0.02, envMapIntensity: 0.2 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 16), this.floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, CABIN.floorY, -2.0);
    floor.receiveShadow = true;
    g.add(floor);
    this.floor = floor;

    /* 舱壁贴图由 applyTheme 换（每主题一张，按需生成） */
  }

  _brassMat() {
    if (!this._brassMaterial) {
      this._brassMaterial = new THREE.MeshStandardMaterial({
        map: this._brass.map, normalMap: this._brass.normal, roughnessMap: this._brass.rough,
        color: 0xB08A57, roughness: MAT.brass.roughness, metalness: MAT.brass.metalness,
        envMapIntensity: MAT.brass.envMapIntensity
      });
    }
    return this._brassMaterial;
  }

  /* 胡桃木小桌板 + 绒布垫 + 暗角叠层 */
  _buildTable() {
    this.world = new THREE.Group();
    this.scene.add(this.world);

    this.woodMat = new THREE.MeshStandardMaterial({
      map: this._wood.map, normalMap: this._wood.normal, roughnessMap: this._wood.rough,
      normalScale: new THREE.Vector2(MAT.walnut.normalScale, MAT.walnut.normalScale),
      color: 0xEADCCB, roughness: MAT.walnut.roughness, metalness: MAT.walnut.metalness,
      envMapIntensity: MAT.walnut.envMapIntensity
    });
    /* 木纹平铺：ExtrudeGeometry 的 UV 是形状坐标，repeat 取小值 → 大板长纹 */
    this._wood.map.repeat.set(0.16, 0.16);
    this._wood.normal.repeat.set(0.16, 0.16);
    this._wood.rough.repeat.set(0.16, 0.16);

    const w = TABLE.w, d = TABLE.d, r = TABLE.r;
    const shape = new THREE.Shape();
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
      depth: TABLE.h, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03,
      bevelSegments: 2, curveSegments: 8, steps: 1
    });
    geo.rotateX(-Math.PI / 2);
    geo.computeBoundingBox();
    const table = new THREE.Mesh(geo, this.woodMat);
    table.position.set(0, -geo.boundingBox.max.y, TABLE.z);
    table.receiveShadow = true;
    this.tableMesh = table;
    this.world.add(table);

    /* 桌沿黄铜嵌线：远端桌沿上的一条细金属线（近镜头处几乎不可见，但远沿会反光） */
    const edgeShape = roundedShape(TABLE.w - 0.16, TABLE.d - 0.16, TABLE.r - 0.05);
    edgeShape.holes.push(roundedPath(TABLE.w - 0.22, TABLE.d - 0.22, TABLE.r - 0.07));
    const edgeLine = new THREE.Mesh(new THREE.ShapeGeometry(edgeShape, 10), this._brassMat());
    edgeLine.rotation.x = -Math.PI / 2;
    edgeLine.position.set(0, 0.0018, TABLE.z);
    this.world.add(edgeLine);
    this.tableEdge = edgeLine;

    /* 绒布垫（圆角矩形，ShapeGeometry 的 UV = 形状坐标 → 织纹按世界尺寸平铺） */
    const feltShape = roundedShape(FELT.w, FELT.d, FELT.r);
    this.feltMat = new THREE.MeshStandardMaterial({
      map: this._felt.map, normalMap: this._felt.normal, roughnessMap: this._felt.rough,
      normalScale: new THREE.Vector2(MAT.felt.normalScale, MAT.felt.normalScale),
      color: 0x46626C, roughness: MAT.felt.roughness, metalness: 0,
      envMapIntensity: MAT.felt.envMapIntensity
    });
    this._felt.map.repeat.set(1 / 1.35, 1 / 1.35);
    this._felt.normal.repeat.set(1 / 1.35, 1 / 1.35);
    this._felt.rough.repeat.set(1 / 1.35, 1 / 1.35);
    this.felt = new THREE.Mesh(new THREE.ShapeGeometry(feltShape, 12), this.feltMat);
    this.felt.rotation.x = -Math.PI / 2;
    this.felt.position.set(0, 0.0045, FELT.z);
    this.felt.receiveShadow = true;
    this.world.add(this.felt);

    /* 暗角/灯池/棋盘接触影叠层（每主题一张） */
    this.matOverMat = new THREE.MeshBasicMaterial({
      map: null, transparent: true, opacity: 1, depthWrite: false, fog: false
    });
    this.over = new THREE.Mesh(new THREE.PlaneGeometry(FELT.w, FELT.d), this.matOverMat);
    this.over.rotation.x = -Math.PI / 2;
    this.over.position.set(0, 0.0075, FELT.z);
    this.world.add(this.over);

    /* 绒布垫外一圈黄铜嵌线（桌板上的一道手工细节） */
    const inlayShape = roundedShape(FELT.w + 0.26, FELT.d + 0.26, FELT.r + 0.10);
    const inlayHole = roundedPath(FELT.w + 0.06, FELT.d + 0.06, FELT.r + 0.04);
    inlayShape.holes.push(inlayHole);
    const inlay = new THREE.Mesh(new THREE.ShapeGeometry(inlayShape, 10), this._brassMat());
    inlay.rotation.x = -Math.PI / 2;
    inlay.position.set(0, 0.0035, FELT.z);
    this.world.add(inlay);
    this.inlay = inlay;

    this.boardGroup = new THREE.Group();
    this.world.add(this.boardGroup);

    this._buildCup(this.world);
  }

  /* 小道具：珐琅茶杯 + 黄铜碟边（3 draw；给画面一个近景生活物件，也让绒布垫不空） */
  _buildCup(parent) {
    const ceramic = new THREE.MeshStandardMaterial({
      color: 0xE4D8C6, roughness: 0.24, metalness: 0.0, envMapIntensity: 1.15
    });
    const coffee = new THREE.MeshStandardMaterial({
      color: 0x241209, roughness: 0.20, metalness: 0.0, envMapIntensity: 0.9
    });
    const brass = this._brassMat();
    const parts = [];
    const put = (geo, x, y, z, rx) => {
      const m = new THREE.Matrix4().makeRotationX(rx || 0);
      m.setPosition(x, y, z);
      parts.push({ geo, matrix: m });
    };
    put(new THREE.CylinderGeometry(0.335, 0.315, 0.022, 32), 0, 0.012, 0);
    put(new THREE.CylinderGeometry(0.148, 0.112, 0.215, 26, 1, true), 0, 0.132, 0);
    const handle = new THREE.TorusGeometry(0.082, 0.017, 7, 16, Math.PI * 1.25);
    const hm = new THREE.Matrix4().makeRotationZ(-0.5);
    hm.setPosition(0.155, 0.145, 0);
    parts.push({ geo: handle, matrix: hm });
    const cupGeo = mergeGeoms(parts);
    parts.forEach((p) => p.geo.dispose());
    const cup = new THREE.Mesh(cupGeo, ceramic);
    cup.castShadow = true;
    cup.receiveShadow = true;
    const coffeeGeo = new THREE.CircleGeometry(0.13, 24);
    coffeeGeo.rotateX(-Math.PI / 2);
    const surface = new THREE.Mesh(coffeeGeo, coffee);
    surface.position.y = 0.212;
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.148, 0.011, 6, 26), brass);
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.240;
    const group = new THREE.Group();
    group.add(cup, surface, rim);
    group.position.set(-1.72, 0.0045, 4.28);
    group.rotation.y = 0.42;
    group.scale.setScalar(2.0);
    parent.add(group);
    this.cupGroup = group;
  }

  _buildBoard() {
    const t = themeOf(this.theme);
    const atlas = TX.buildAtlas();
    this._tex.push(atlas.tex);
    this.atlasTex = atlas.tex;
    this.atlasPlain = atlas;           /* V9：格面不再印中文，fly 无需换图集 */
    this.flyMode = false;

    /* --- 棋盘圆盘：胡桃木面 + 黄铜包边 --- */
    this.boardTopMat = new THREE.MeshStandardMaterial({
      map: TX.buildBoardFace(0xE8DCCB), roughness: MAT.walnut.roughness + 0.03, metalness: MAT.walnut.metalness,
      normalMap: this._wood.normal.clone(), normalScale: new THREE.Vector2(2.2, 2.2),
      color: 0xFFFFFF, envMapIntensity: 0.6
    });
    this._tex.push(this.boardTopMat.map, this.boardTopMat.normalMap);
    this.boardTopMat.normalMap.repeat.set(3, 3);
    this.boardTopMat.normalMap.wrapS = this.boardTopMat.normalMap.wrapT = THREE.RepeatWrapping;
    this.boardTopMat.normalMap.needsUpdate = true;
    this.boardSideMat = new THREE.MeshStandardMaterial({
      map: this._wood.map, normalMap: this._wood.normal, color: 0x6C4B33,
      roughness: 0.62, metalness: 0.04, envMapIntensity: 0.45
    });
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(DISC_R, DISC_R - 0.05, 0.035, 96, 1), [
      this.boardSideMat, this.boardTopMat, this.boardSideMat
    ]);
    disc.position.y = 0.0205;
    disc.receiveShadow = true;
    this.boardGroup.add(disc);
    this.disc = disc;

    /* 黄铜包边（真金属环，负责边缘高光） */
    const rim = new THREE.Mesh(new THREE.TorusGeometry(DISC_R - 0.012, 0.036, 8, 96), this._brassMat());
    rim.rotation.x = -Math.PI / 2;
    rim.position.y = 0.030;
    rim.castShadow = true;
    this.boardGroup.add(rim);
    this.discRim = rim;

    /* --- 格块（倒角珐琅） --- */
    this.tileMat = new THREE.MeshStandardMaterial({
      map: atlas.tex, vertexColors: true, roughness: MAT.enamel.roughness,
      metalness: MAT.enamel.metalness, envMapIntensity: MAT.enamel.envMapIntensity
    });
    const ringTiles = [];
    const homeTiles = [];
    const hangarPads = [];
    for (let n = 0; n < RING_N; n++) {
      const phi = ringPhi(n);
      const color = colorOfRing(n), kind = kindOf(n);
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.46);
      ringTiles.push({
        x: RING_R * Math.sin(phi), z: -RING_R * Math.cos(phi),
        rot: -Math.PI / 2 - phi, w: CELL, d: CELL,
        top: TILE_TOP, bottom: TILE_BOTTOM,
        uv: uvOfSlot(slotOf(kind, color)), side, n, kind, color
      });
    }
    for (const color of COLORS) {
      const phi = ringPhi(HOME_ENTRY[color]);
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.38);
      for (let s = 0; s < HOME_STEPS; s++) {
        const r = HOME_R0 - s * HOME_PITCH;
        homeTiles.push({
          x: r * Math.sin(phi), z: -r * Math.cos(phi),
          rot: -phi - Math.PI, w: HOME_CELL, d: HOME_CELL,
          top: TILE_TOP - 0.004, bottom: TILE_BOTTOM,
          uv: uvOfSlot(SLOT_HOME + COLORS.indexOf(color)), side, color, step: s
        });
      }
    }
    for (const color of COLORS) {
      const a = APRON_DEG[color] * DEG;
      const side = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.32);
      hangarPads.push({
        x: HANGAR_R * Math.sin(a), z: -HANGAR_R * Math.cos(a),
        rot: -a - Math.PI, w: 0.94, d: 0.94, top: TILE_BOTTOM + 0.030, bottom: TILE_BOTTOM,
        uv: uvOfSlot(SLOT_DARK), side: side.map((v) => v * 0.8), color, plate: true
      });
      const side2 = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.40);
      for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
        hangarPads.push({
          x: HANGAR_R * Math.sin(a) + (dx * Math.cos(a) + dz * Math.sin(a)),
          z: -HANGAR_R * Math.cos(a) + (-dx * Math.sin(a) + dz * Math.cos(a)),
          rot: -a - Math.PI, w: 0.28, d: 0.28,
          top: TILE_BOTTOM + 0.060, bottom: TILE_BOTTOM + 0.030,
          uv: uvOfSlot(SLOT_HANGAR + COLORS.indexOf(color)), side: side2,
          color, pad: true
        });
      }
    }
    this.ringMesh = new THREE.Mesh(buildTileGeometry(ringTiles.concat(homeTiles)), this.tileMat);
    this.ringMesh.receiveShadow = true;
    this.ringMesh.castShadow = true;
    this.boardGroup.add(this.ringMesh);
    this.padMesh = new THREE.Mesh(buildTileGeometry(hangarPads), this.tileMat);
    this.padMesh.receiveShadow = true;
    this.boardGroup.add(this.padMesh);

    /* --- 中心终点：胡桃木鼓 + 黄铜盘 + 立体星徽 --- */
    this.hubGroup = new THREE.Group();
    this.hubSideMat = new THREE.MeshStandardMaterial({
      map: this._wood.map, normalMap: this._wood.normal, color: 0x4A3220,
      roughness: 0.6, metalness: 0.04, envMapIntensity: 0.4
    });
    this.hubTopMat = new THREE.MeshStandardMaterial({
      map: null, roughness: 0.34, metalness: MAT.brass.metalness,
      color: t.hub.top, envMapIntensity: MAT.brass.envMapIntensity
    });
    this.hubStarMat = new THREE.MeshStandardMaterial({
      color: t.hub.star, roughness: 0.28, metalness: MAT.brass.metalness,
      envMapIntensity: MAT.brass.envMapIntensity
    });
    this.hubRingMat = this._brassMat();
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(HUB.r, HUB.r + 0.07, HUB.h, 48, 1),
      [this.hubSideMat, this.hubTopMat, this.hubSideMat]
    );
    drum.position.y = HUB.h / 2;
    drum.castShadow = this.shadows;
    drum.receiveShadow = true;
    this.hubGroup.add(drum);
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(HUB.ringR, 0.030, 8, 56), this.hubRingMat);
    baseRing.rotation.x = -Math.PI / 2;
    baseRing.position.y = 0.012;
    this.hubGroup.add(baseRing);
    this.hubHalo = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.014, 6, 44), this.hubRingMat);
    this.hubHalo.rotation.x = -Math.PI / 2;
    this.hubHalo.position.y = HUB.h + 0.10;
    this.hubGroup.add(this.hubHalo);
    const starShape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 === 0 ? HUB.starR : HUB.starR * 0.44;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(a) * rr, y = Math.sin(a) * rr;
      if (i === 0) starShape.moveTo(x, y); else starShape.lineTo(x, y);
    }
    starShape.closePath();
    const starGeo = new THREE.ExtrudeGeometry(starShape, { depth: 0.030, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 1, curveSegments: 1 });
    starGeo.rotateX(-Math.PI / 2);
    this.hubStar = new THREE.Mesh(starGeo, this.hubStarMat);
    this.hubStar.position.y = HUB.h + 0.014;
    this.hubStar.castShadow = this.shadows;
    this.hubGroup.add(this.hubStar);
    this.hubGlow = makeGlowPlane(0.96, t.hub.glow);
    this.hubGlow.position.y = HUB.h + 0.055;
    this.hubGlow.material.opacity = 0.22;
    this.hubGroup.add(this.hubGlow);
    this.hubGroup.position.y = 0.038;
    this.boardGroup.add(this.hubGroup);

    /* 目标格光晕 */
    this.targetGlow = makeGlowPlane(0.9, 0xFFC98A);
    this.targetGlow.position.y = TILE_TOP + 0.012;
    this.targetGlow.visible = false;
    this.boardGroup.add(this.targetGlow);

    /* 当前玩家信标 */
    this.turnBeacon = new THREE.Group();
    const beaconRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.026, 8, 40),
      new THREE.MeshBasicMaterial({ color: HEX.red, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false })
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
    this.stageGlow.material.opacity = 0.18;
    this.stageGroup.add(this.stageGlow);
    /* 舞台补光：45° 舞台升起时只照亮格子/小熊，避免正面全黑（1 个无阴影点光） */
    this.stageLight = new THREE.PointLight(0xFFCB94, 0, 6, 2);
    this.stageLight.position.set(0.06, 2.25, 0.28);
    this.scene.add(this.stageLight);
    this.stageTile = null;

    this.bear = createBear();
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
    const atlas = TX.buildDieAtlas(128);
    this._tex.push(atlas.tex);
    this.dieMat = new THREE.MeshStandardMaterial({
      map: atlas.tex, roughness: 0.38, metalness: 0.05, envMapIntensity: 0.9
    });
    this.die = new THREE.Mesh(makeDieGeometry(DIE_SIZE), this.dieMat);
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

  /* 灰尘粒子：一束在阅读灯光锥里飘（1 draw，按档位减少数量） */
  _buildAtmosphere() {
    const MAX = QUALITY.high.dust;
    const pos = new Float32Array(MAX * 3);
    const seed = [];
    for (let i = 0; i < MAX; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 0.6 + Math.random() * 4.6;
      pos[i * 3] = Math.cos(a) * rad * 0.9;
      pos[i * 3 + 1] = 0.25 + Math.random() * 3.1;
      pos[i * 3 + 2] = -2.4 + Math.sin(a) * rad * 0.7;
      seed.push(Math.random() * 1000, 0.3 + Math.random() * 0.9, Math.random() * Math.PI * 2);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this._dustBase = pos.slice();
    this.dustMat = new THREE.PointsMaterial({
      size: 0.042, map: TX.makeDustTex(), color: 0xFFD9A8, transparent: true,
      opacity: 0.62, depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true, fog: true, toneMapped: false
    });
    this.dust = new THREE.Points(geo, this.dustMat);
    this.dust.frustumCulled = false;
    this._dustSeed = seed;
    this.scene.add(this.dust);
    this._applyDustQuality();
  }

  _applyDustQuality() {
    if (!this.dust) return;
    const n = QUALITY[this.quality].dust;
    this._dustCount = Math.min(n, QUALITY.high.dust);
    this.dust.geometry.setDrawRange(0, this._dustCount);
    this.dust.visible = this._dustCount > 0;
  }

  _updateDust(now) {
    if (!this.dust.visible || !this._dustBase) return;
    const attr = this.dust.geometry.getAttribute('position');
    const n = this._dustCount;
    const base = this._dustBase, s = this._dustSeed;
    for (let i = 0; i < n; i++) {
      const sp = s[i * 3 + 1];
      const ph = s[i * 3 + 2];
      const t = now * 0.00008 * sp;
      attr.setX(i, base[i * 3] + Math.sin(t + ph) * 0.055);
      attr.setY(i, base[i * 3 + 1] + Math.sin(t * 0.8 + ph) * 0.045);
      attr.setZ(i, base[i * 3 + 2] + Math.cos(t * 0.7 + ph) * 0.035);
    }
    attr.needsUpdate = true;
  }

  /* 后处理：单 pass 暗角 + 胶片颗粒（high/medium；low 关闭）
   * 使用 premultipliedAlpha：r=0 处只压暗，g>0 处叠加颗粒白点（等价于一次 cheap grade）。 */
  _buildFx() {
    this.fxMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: 1 },
        uVig: { value: 0.55 },
        uGrain: { value: 0.055 }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: [
        'varying vec2 vUv;',
        'uniform float uTime; uniform float uAspect; uniform float uVig; uniform float uGrain;',
        'float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
        'void main(){',
        '  vec2 p = vUv - 0.5; p.x *= uAspect;',
        '  float r = length(p) * 1.5;',
        '  float v = smoothstep(0.40, 1.02, r) * uVig;',
        '  float n = hash(floor(vUv * vec2(1440.0, 2304.0)) + floor(uTime * 24.0));',
        '  float g = max(0.0, n - 0.70) * uGrain;',
        '  vec3 col = vec3(0.92, 0.90, 0.86) * g;',
        '  float a = clamp(v + g * 0.7, 0.0, 0.94);',
        '  gl_FragColor = vec4(col, a);',
        '}'
      ].join('\n'),
      transparent: true,
      depthTest: false,
      depthWrite: false,
      premultipliedAlpha: true,
      blending: THREE.NormalBlending
    });
    this.fxQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.fxMat);
    this.fxQuad.frustumCulled = false;
    this.fxQuad.renderOrder = 999;
    this.scene.add(this.fxQuad);
  }

  /* ======================= 画质档 / 尺寸 ======================= */
  setQuality(q) {
    if (!QUALITY[q] || q === this.quality) return this.quality;
    this.quality = q;
    this._applyQuality();
    this.resize();
    this.requestRender();
    return this.quality;
  }

  _applyQuality() {
    const tier = QUALITY[this.quality];
    this.shadows = this._shadowOpt && tier.shadow > 0;
    this.renderer.shadowMap.enabled = this.shadows;
    if (this.key) {
      this.key.castShadow = this.shadows;
      if (this.shadows && this.key.shadow.mapSize.x !== tier.shadow) {
        this.key.shadow.mapSize.set(tier.shadow, tier.shadow);
        if (this.key.shadow.map) { this.key.shadow.map.dispose(); this.key.shadow.map = null; }
      }
    }
    this._applyDustQuality();
    if (this.fxMat) {
      this.fxMat.uniforms.uGrain.value = tier.grain ? 0.055 : 0.0;
      this.fxMat.uniforms.uVig.value = tier.glow ? 0.58 : 0.42;
      this.fxQuad.visible = tier.grain || tier.glow;
    }
    if (this.lampGlow) this.lampGlow.visible = tier.bloom;
    if (this.winGlow) this.winGlow.visible = tier.bloom;
    if (this.hubGlow) this.hubGlow.visible = tier.glow;
    if (this.stageGlow) this.stageGlow.visible = tier.glow;
    if (this.scene) this.scene.environment = tier.env && this.envTex ? this.envTex : null;
  }

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
    const tier = QUALITY[this.quality];
    const dpr = Math.min(window.devicePixelRatio || 1, tier.dpr);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.rig.setAspect(w / h);
    if (this.fxMat) {
      this.fxMat.uniforms.uAspect.value = w / h;
      /* 暗角在窄屏上更收敛一点 */
      this._fxAspectBase = w / h;
    }
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
      this._updateDust(now);
      if (this.bear.group.visible) {
        this.bear.group.position.y = TILE_H + Math.sin(now * 0.0032) * 0.012;
        this.bear.group.rotation.z = Math.sin(now * 0.0016) * 0.03;
      }
      if (this._beaconRing) {
        const s = 1 + Math.sin(now * 0.0024) * 0.08;
        this._beaconRing.scale.setScalar(s);
        this._beaconRing.material.opacity = 0.5 + Math.sin(now * 0.0024) * 0.18;
      }
      if (this.hubStar) {
        this.hubStar.rotation.y = now * 0.00042;
        this.hubHalo.position.y = HUB.h + 0.10 + Math.sin(now * 0.0016) * 0.018;
        this.hubHalo.rotation.z = now * 0.0006;
        this.hubGlow.material.opacity = 0.20 + Math.sin(now * 0.0022) * 0.06;
      }
      if (this.lampGlow) this.lampGlow.material.opacity = 0.50 + Math.sin(now * 0.0011) * 0.07;
      this.streaks.update(dt, this.streaks.group.visible);
      if (this.fxMat && this.fxQuad.visible) {
        this._fxTime += dt;
        this.fxMat.uniforms.uTime.value = this._fxTime * 0.001;
      }
    }

    this.updatePlaneTransforms();
    this.rig.apply();
    this._applyCineCamera(now, rawDt);
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

  /* --- 电影镜头重构（scene 内部，不改 camera.js/director.js） ---
   * 1) fov 42 → 38 长焦：相机沿「中心点」后退 tan21/tan19 倍，取景不变、透视更平
   * 2) 俯瞰（elev≥56、azim≈0）时机位压到 50°：画面上方露出舱壁/舷窗
   * 3) idle 微漂移：极慢的正弦平移 + 微 yaw（reduced 静态） */
  _applyCineCamera(now, rawDt) {
    const rig = this.rig, cam = this.camera, cs = rig.state;
    if (Math.abs(cs.fov - 42) < 0.01) {
      cam.position.sub(cs.center).multiplyScalar(CINE.lensK).add(cs.center);
      cam.fov = CINE.fov;
      cam.updateProjectionMatrix();
    }
    const overview = !rig.locked && Math.abs(cs.azim) < 0.01 && cs.elev > CINE.overviewElevMin;
    const targetK = overview ? 1 : 0;
    /* 按真实帧间隔收敛（低帧率设备也能在 ~0.6s 内到位；reduced 直接到位） */
    const dtk = this.reduced ? 1 : clamp(1 - Math.exp(-(rawDt || 16) / 150), 0.05, 0.85);
    this._elevK += (targetK - this._elevK) * dtk;
    if (this._elevK > 0.002) {
      /* 绕相机右轴 +θ：把机位从 58° 压到 50°（俯角变小 = 机位更低） */
      const ang = (58 - CINE.elev) * DEG * this._elevK;
      this._right.setFromMatrixColumn(cam.matrixWorld, 0);
      this._v2.copy(cam.position).sub(cs.center).applyAxisAngle(this._right, ang);
      cam.position.copy(cs.center).add(this._v2);
      this._q1.setFromAxisAngle(this._right, ang);
      cam.quaternion.premultiply(this._q1);
    }
    if (!this.reduced && this._elevK > 0.02 &&
        (this.perf.phase === 'idle' || this.perf.phase === 'win' || this.perf.phase === 'boot')) {
      const dx = Math.sin(now * 0.00013) * CINE.drift.x + Math.sin(now * 0.000071 + 1.3) * CINE.drift.x * 0.45;
      const dy = Math.sin(now * 0.00019 + 1.7) * CINE.drift.y;
      this._right.setFromMatrixColumn(cam.matrixWorld, 0);
      this._up.setFromMatrixColumn(cam.matrixWorld, 1);
      cam.position.addScaledVector(this._right, dx).addScaledVector(this._up, dy);
      this._q1.setFromAxisAngle(this._up, Math.sin(now * 0.00011) * CINE.drift.yaw);
      cam.quaternion.premultiply(this._q1);
    }
    cam.updateMatrixWorld(true);
  }

  _adaptCheck(dt) {
    if (!this.adapt || this.quality === 'low') return;
    this._adaptTimer = (this._adaptTimer || 0) + dt;
    if (this._adaptTimer < 1500) return;
    const avg = this.perf.sum / Math.max(1, this.perf.frames);
    this._adaptTimer = 0;
    this._slowWindows = avg > 26 ? (this._slowWindows || 0) + 1 : 0;
    if (this._slowWindows >= 2) {
      this._slowWindows = 0;
      const next = this.quality === 'high' ? 'medium' : 'low';
      this.setQuality(next);
      console.info('[board3d] auto quality → ' + next);
    }
  }

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
  _themeAssets(t) {
    if (!this._winTex[t.id]) {
      this._winTex[t.id] = TX.buildWindowView(t.window);
      this._wallTex[t.id] = TX.buildWallTexture(t.wallTint, 512);
      this._overlayTex[t.id] = TX.buildMatOverlay(t.overlay, FELT, 512);
      this._hubTex[t.id] = TX.buildHubTop(t.hub, 256);
      this._tex.push(this._winTex[t.id], this._wallTex[t.id], this._overlayTex[t.id], this._hubTex[t.id]);
    }
    return {
      win: this._winTex[t.id], wall: this._wallTex[t.id],
      overlay: this._overlayTex[t.id], hub: this._hubTex[t.id]
    };
  }

  applyTheme(id, initial) {
    const t = themeOf(id);
    this.theme = t.id;
    this.host.setAttribute('data-3d-theme', t.id);
    const assets = this._themeAssets(t);

    this.scene.background.set(t.ink);
    this.scene.fog = new THREE.FogExp2(t.fog, t.fogDensity);
    this.renderer.toneMappingExposure = t.exposure;
    if (this.scene.environment) this.scene.environmentIntensity = t.light.env;

    if (this.hemi) {
      this.hemi.color.set(t.light.hemiSky);
      this.hemi.groundColor.set(t.light.hemiGround);
      this.hemi.intensity = t.light.hemiInt;
    }
    if (this.key) {
      this.key.color.set(t.light.key);
      this.key.intensity = t.light.keyInt;
    }
    if (this.rim) {
      this.rim.color.set(t.light.rim);
      this.rim.intensity = t.light.rimInt;
    }
    if (this.fill) {
      this.fill.color.set(t.light.fill);
      this.fill.intensity = t.light.fillInt;
    }
    if (this.wallWash) {
      this.wallWash.color.set(t.light.rim);
      this.wallWash.intensity = t.light.rimInt * 0.52;
    }
    if (this.lamp) {
      this.lamp.color.set(t.light.lamp);
      this.lamp.intensity = t.light.lampInt;
      this.lamp.distance = t.light.lampDist;
    }

    /* 木/绒布/棋盘 tint（贴图是中性程序化纹理，主题靠 color 相乘） */
    if (this.woodMat) this.woodMat.color.set(t.tableTint);
    if (this.feltMat) this.feltMat.color.set(t.feltTint);
    if (this.boardTopMat) this.boardTopMat.color.set(t.boardTint);
    if (this.boardSideMat) this.boardSideMat.color.set(t.brass).multiplyScalar(0.38);
    if (this._brassMaterial) {
      this._brassMaterial.color.set(t.brass);
      this._brassMaterial.roughness = t.brassRough;
    }
    if (this.hubTopMat) {
      this.hubTopMat.map = assets.hub;
      this.hubTopMat.color.set(0xFFFFFF);
      this.hubTopMat.needsUpdate = true;
    }
    if (this.hubStarMat) this.hubStarMat.color.set(t.hub.star);
    if (this.hubGlow) this.hubGlow.material.color.set(t.hub.glow);

    /* 机舱 */
    if (this.wallMat) {
      this.wallMat.map = assets.wall;
      this.wallMat.color.set(0xFFFFFF);
      this.wallMat.needsUpdate = true;
    }
    if (this.windowMat) {
      this.windowMat.map = assets.win;
      this.windowMat.needsUpdate = true;
    }
    if (this.glassMat) this.glassMat.color.set(t.light.rim);
    if (this.shadeMat) this.shadeMat.color.set(t.feltTint).multiplyScalar(0.42);
    if (this.floorMat) this.floorMat.color.set(t.floor);
    if (this.bulbMat) this.bulbMat.color.set(t.light.lamp);
    if (this.stageLight) this.stageLight.color.set(t.light.key);
    if (this.lampGlow) this.lampGlow.material.color.set(t.light.lamp);
    if (this.winGlow) this.winGlow.material.color.set(t.light.rim);

    /* 垫布叠层 */
    if (this.matOverMat && this.matOverMat.map !== assets.overlay) {
      this.matOverMat.map = assets.overlay;
      this.matOverMat.needsUpdate = true;
    }

    /* 灰尘 */
    if (this.dustMat) {
      this.dustMat.color.set(t.dust);
      this.dustMat.opacity = t.dustOpacity;
    }

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
    this.lamp.intensity = t.light.lampInt * (0.85 + k * 0.5);
    /* 黄铜在高热度下更暖一点（灯光本体颜色已经在变，这里只轻微染 hub） */
    if (this.hubGlow) this.hubGlow.material.color.copy(new THREE.Color(t.hub.glow).lerp(col, k * 0.6));
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
    const tileF = lerp(0.26, 1, d);
    if (this.tileMat) this.tileMat.color.setRGB(tileF, tileF, tileF);
    if (this.boardTopMat) this.boardTopMat.color.copy(new THREE.Color(t.boardTint).multiplyScalar(lerp(0.40, 1, d)));
    if (this.boardSideMat) this.boardSideMat.color.copy(new THREE.Color(t.boardTint).multiplyScalar(lerp(0.34, 0.85, d)));
    if (this.woodMat) this.woodMat.color.copy(new THREE.Color(t.tableTint).multiplyScalar(lerp(0.52, 1, d)));
    if (this.feltMat) this.feltMat.color.copy(new THREE.Color(t.feltTint).multiplyScalar(lerp(0.58, 1, d)));
    if (this.matOverMat) this.matOverMat.opacity = lerp(0.62, 1, d);
    this.requestRender();
  }

  /* ======================= 飞机 ======================= */
  _accentFor(color) {
    return color === 'red' ? 0xE8C9A8 : color === 'yellow' ? 0xE8D3A8 : color === 'blue' ? 0xC8D2E0 : 0xC8D8C8;
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
    return {
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
    pm.shadow.material.dispose();
    pm.glow.geometry.dispose();
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
        pm.shadow.position.set(this._v.x, 0.008, this._v.z);
        pm.shadow.visible = pm.group.visible;
        pm.glow.position.set(this._v.x, pm.tileTopY + 0.012, this._v.z);
      } else if (pm.mode === 'fixed') {
        pm.group.position.copy(FOCUS_WORLD);
        pm.group.rotation.set(0, pm.fixedYaw, 0);
        pm.shadow.position.set(FOCUS_WORLD.x, 0.008, FOCUS_WORLD.z);
        pm.shadow.visible = true;
        pm.glow.position.set(FOCUS_WORLD.x, TILE_TOP + 0.012, FOCUS_WORLD.z);
      } else {
        pm.group.visible = false;
        pm.shadow.visible = false;
        pm.glow.material.opacity = 0;
        continue;
      }
      const active = pm.playerId === this.turn;
      const target = pm.mode === 'fixed' ? 0.95 : (active ? (this.reduced ? 0.5 : 0.55) : 0.07);
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

  /* V9：格面不再有中文，fly 期间无需换图集；保留 API 兼容 director */
  setFlyMode(on) {
    this.flyMode = !!on;
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
      sideColor = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.46);
    } else if (squareId && /^ring:(\d+)$/.test(squareId)) {
      const n = Number(/^ring:(\d+)$/.exec(squareId)[1]);
      color = colorOfRing(n);
      kind = kindOf(n);
      sideColor = TX.hexToRgb(HEX[color]).map((v) => (v / 255) * 0.46);
    } else {
      color = 'red';
      kind = 'ring';
      sideColor = [0.14, 0.12, 0.16];
    }
    this.stageTex = TX.buildStagePlate(kind, color, KIND_LABEL[kind] || '', 256, STAGE_TEXT);
    this._tex.push(this.stageTex);
    this.stageTileMat = new THREE.MeshStandardMaterial({
      map: this.stageTex, vertexColors: true, roughness: MAT.enamel.roughness + 0.03,
      metalness: MAT.enamel.metalness, envMapIntensity: 0.9
    });
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
    if (this.stageLight) this.stageLight.intensity = v ? 8.5 : 0;
    if (!v) this.bear.setVisible(false);
    this.requestRender();
  }

  setStageRise(rise) {
    this.stageRise = rise;
    this.stageGroup.position.y = TILE_BOTTOM + rise;
    this.stageShadow.position.set(0, 0.006, 0);
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
    this.dieShadow.position.set(DIE_HOME.x, 0.008, DIE_HOME.z);
    this.dieShadow.scale.setScalar(1);
    this.dieShadow.material.opacity = 0.5;
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
      this.dieShadow.position.set(this.die.position.x, 0.008, this.die.position.z);
      this.dieShadow.scale.setScalar(clamp(1.15 - (this.die.position.y - DIE_HOME.y) * 0.4, 0.5, 1.2));
      this.dieShadow.material.opacity = clamp(0.5 - (this.die.position.y - DIE_HOME.y) * 0.18, 0.12, 0.5);
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
        fov: +this.camera.fov.toFixed(2),
        rigFov: +this.rig.state.fov.toFixed(2),
        elev: +this.rig.state.elev.toFixed(2),
        elevTuned: +this._elevK.toFixed(3),
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
      cinematic: {
        toneMapping: this.renderer.toneMapping,
        exposure: this.renderer.toneMappingExposure,
        env: this.scene.environment ? 'pmrem' : 'off',
        envIntensity: this.scene.environmentIntensity,
        dust: this._dustCount,
        fx: this.fxQuad ? { vignette: this.fxMat.uniforms.uVig.value, grain: this.fxMat.uniforms.uGrain.value } : null,
        lens: { fov: CINE.fov, elev: CINE.elev, lensK: +CINE.lensK.toFixed(4) }
      },
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
      m.dispose();
    };
    this.scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) disposeMat(o.material);
    });
    this._tex.forEach((t) => { try { t.dispose(); } catch (e) { /* noop */ } });
    if (this.envRT) { try { this.envRT.dispose(); } catch (e) { /* noop */ } }
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

/* 圆角矩形 Shape / Path（桌面、绒布垫、黄铜嵌线共用） */
function roundedShape(w, d, r) {  const s = new THREE.Shape();
  const hw = w / 2, hd = d / 2, rr = Math.min(r, hw, hd);
  s.moveTo(-hw + rr, -hd);
  s.lineTo(hw - rr, -hd);
  s.quadraticCurveTo(hw, -hd, hw, -hd + rr);
  s.lineTo(hw, hd - rr);
  s.quadraticCurveTo(hw, hd, hw - rr, hd);
  s.lineTo(-hw + rr, hd);
  s.quadraticCurveTo(-hw, hd, -hw, hd - rr);
  s.lineTo(-hw, -hd + rr);
  s.quadraticCurveTo(-hw, -hd, -hw + rr, -hd);
  return s;
}
function roundedPath(w, d, r) {
  const p = new THREE.Path();
  const hw = w / 2, hd = d / 2, rr = Math.min(r, hw, hd);
  p.moveTo(-hw + rr, -hd);
  p.lineTo(hw - rr, -hd);
  p.quadraticCurveTo(hw, -hd, hw, -hd + rr);
  p.lineTo(hw, hd - rr);
  p.quadraticCurveTo(hw, hd, hw - rr, hd);
  p.lineTo(-hw + rr, hd);
  p.quadraticCurveTo(-hw, hd, -hw, hd - rr);
  p.lineTo(-hw, -hd + rr);
  p.quadraticCurveTo(-hw, -hd, -hw + rr, -hd);
  return p;
}

/* 圆角矩形面片：ShapeGeometry 的 UV 是形状坐标，这里重映射到 0..1（舷窗景观/玻璃用） */
function roundedPlaneGeometry(w, h, r) {
  const geo = new THREE.ShapeGeometry(roundedShape(w, h, r), 12);
  const pos = geo.getAttribute('position');
  const uv = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uv[i * 2] = (pos.getX(i) + w / 2) / w;
    uv[i * 2 + 1] = (pos.getY(i) + h / 2) / h;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  return geo;
}

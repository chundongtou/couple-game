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
  HOME_PITCH, HOME_CELL, HANGAR_R, PLANE_HOVER, PLANE_Y, DIE_SIZE, DIE_FLOOR, DIE_HOME_POS,
  STAGE_RISE, STAGE_AZIM,
  STAGE_PLATE, STAGE_BEAR, STAGE_TEXT, HUB, TABLE, FELT, CABIN, MAT, CINE, QUALITY,
  COLORS, HOME_ENTRY, APRON_DEG, HEX, DIE_FACES, THEMES, themeOf, KIND_LABEL,
  colorOfRing, kindOf, ringPhi, slotOf, uvOfSlot, SLOT_DARK, SLOT_HOME, SLOT_HANGAR,
  clamp, lerp, easeOut, smoothstep, PROPS, CABIN_FX
} from './constants.js';
import * as TX from './textures.js';
import {
  buildTileGeometry, makePlane, makeShadowPlane, makeGlowPlane, makeRippleMesh,
  makeStreakGroup, makeDieGeometry, makeHand, mergeGeoms, mergePropGeoms
} from './parts.js';
import { createBear } from './bear.js';
import { CameraRig } from './camera.js';
import { localOfSquare, localOfPieceSquare, pieceLocals } from './mapping.js';

const DISC_R = 3.30;
const DIE_HOME = new THREE.Vector3(DIE_HOME_POS.x, DIE_HOME_POS.y, DIE_HOME_POS.z);
const RELEASE_DIE = new THREE.Vector3(0.834, 0.64, 0.863);   /* V9.7 手腕上挑出手点（shots/v9.7-dice/sim_up.mjs） */
const FOCUS_WORLD = new THREE.Vector3(0, PLANE_Y, 0);

/* V9.3 摇骰时间线（毫秒；全部相对 tossDie 起点）：
 * 手进入 260 → 下沉 80 → 合拢 110 → 托起 260 → 甩出 130（840ms 出手）→ 手退出 320
 * 骰子物理：重力/桌面碰撞/摩擦/角速度阻尼/圆形边界；再留 320ms 落定翻面。 */
const HAND = {
  enterMs: 260, descendMs: 80, closeMs: 110, liftMs: 260, throwMs: 130, exitMs: 330,
  releaseAt: 840,            // = enter+descend+close+lift+throw
  total: 2380               // 出手后 1540ms：物理≈1220 + 落定 320（上限 2.38s ≤ 2.5s）
};
const PHYS = {
  step: 1 / 240, g: 8.6, rest: [0.47, 0.42, 0.37], tan: [0.74, 0.70, 0.66],
  airDrag: 0.18, spinDamp: 0.45, rollFriction: 2.7, boundR: 2.78,
  maxActive: 1.54, settleMs: 320, restPad: 0.30, minEnd: 1.18
};

function detectQuality() {
  const nav = typeof navigator !== 'undefined' ? navigator : {};
  const ua = nav.userAgent || '';
  const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) {
    /* V9.2：高 DPR 手机默认 2K；低 DPR/老设备仍走标准。 */
    return dpr >= 2 ? 'high' : 'medium';
  }
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
    this._dieYaw = 0.22;
    this._toss = null;
    this._hand = null;
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
    this._upY = new THREE.Vector3(0, 1, 0);
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
    this._buildCabinDetail();
    this._buildBoard();
    this._buildStage();
    this._buildDie();
    this._buildHand();
    this._buildPlanesLayer();
    this._buildAtmosphere();
    this._buildProps();
    this._buildComfort();
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
    /* V9.2：2K 档不能关 AA；低画质才关。 */
    const useAA = this.quality !== 'low';
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

  /* ======================================================================
   * V9.1 · 机舱细节（用户反馈「画面太干净」）
   *   - 顶部行李舱 + 暖白灯带 + 行李舱黄铜锁扣（增加顶部层次）
   *   - 舷窗两侧窗帘（布褶贴图 + 顶部黄铜杆；轻微摆动）
   *   - 舱壁板缝/铆钉已烘进 buildWallTexture（0 draw）
   * 座椅不做：桌板 11.4 宽、棋盘占画面 89%，座椅只能落在桌板外→画框外；
   * 强行入画会压到棋盘/桌板，按「影响可读性就删掉」处理。
   * ====================================================================== */
  _buildCabinDetail() {
    const g = this.cabinGroup;
    if (!g) return;

    /* 顶部行李舱：一条横贯画面的圆角暗舱柜，把画面上沿从「空白墙」变成结构 */
    this.binMat = new THREE.MeshStandardMaterial({
      color: 0x18212B, roughness: 0.84, metalness: 0.04, envMapIntensity: 0.22
    });
    const bin = new THREE.Mesh(
      new THREE.BoxGeometry(CABIN_FX.bin.w, CABIN_FX.bin.h, CABIN_FX.bin.d),
      this.binMat
    );
    bin.position.set(0, CABIN_FX.bin.y, CABIN.wallZ + CABIN_FX.bin.inset);
    bin.receiveShadow = false;
    g.add(bin);
    this.bin = bin;
    /* 舱门分缝（细暗线）+ 黄铜锁扣条 */
    const latch = new THREE.Mesh(
      new THREE.BoxGeometry(CABIN_FX.bin.w * 0.985, 0.022, 0.02),
      this._brassMat()
    );
    latch.position.set(0, CABIN_FX.bin.y - CABIN_FX.bin.h / 2 + 0.026,
      CABIN.wallZ + CABIN_FX.bin.inset + CABIN_FX.bin.d / 2);
    g.add(latch);
    this.binLatch = latch;
    /* 灯带：行李舱下沿的一条暖白自发光（toneMapped:false → 读作光源） */
    this.stripMat = new THREE.MeshBasicMaterial({
      color: CABIN_FX.strip.color, transparent: true, opacity: 0.42,
      toneMapped: false, fog: false
    });
    this.strip = new THREE.Mesh(
      new THREE.BoxGeometry(CABIN_FX.strip.w, CABIN_FX.strip.h, CABIN_FX.strip.d),
      this.stripMat
    );
    this.strip.position.set(0, CABIN_FX.strip.y, CABIN.wallZ + 0.36);
    g.add(this.strip);
    /* 灯带在墙上的光晕（1 sprite，轻 bloom） */
    this.binGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeGlowTex(), color: 0xFFD2A0, transparent: true, opacity: 0.13,
      blending: THREE.AdditiveBlending, depthWrite: false, depthTest: true, fog: false, toneMapped: false
    }));
    this.binGlow.scale.set(10.5, 1.5, 1);
    this.binGlow.position.set(0, CABIN_FX.strip.y - 0.02, CABIN.wallZ + 0.42);
    g.add(this.binGlow);

    /* 舷窗窗帘：顶部黄铜杆 + 两片带竖向褶皱的布（各 1 draw，共 2） */
    this.curtainTex = TX.buildCurtainTexture(96);
    this._tex.push(this.curtainTex);
    this.curtainMat = new THREE.MeshStandardMaterial({
      map: this.curtainTex, color: 0x8A7A68, roughness: 0.96, metalness: 0,
      envMapIntensity: 0.25, side: THREE.DoubleSide
    });
    const cw = CABIN_FX.curtain.w, ch = CABIN_FX.curtain.h;
    this.curtains = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      const cx = CABIN.window.x + side * (CABIN.window.w / 2 + CABIN_FX.curtain.off);
      const cy = CABIN.window.y + CABIN.window.h / 2 + 0.10;
      pivot.position.set(cx, cy, CABIN.window.z + 0.055);
      const cloth = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch, 5, 1), this.curtainMat);
      cloth.position.y = -ch / 2;
      cloth.castShadow = false;
      pivot.add(cloth);
      pivot.userData.baseY = 0;
      g.add(pivot);
      this.curtains.push(pivot);
      this._tex.push(this.curtainTex);
    }
    /* 窗帘杆（黄铜，两端各一个球形端头） */
    const rod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, CABIN.window.w + 0.75, 8, 1),
      this._brassMat()
    );
    rod.rotation.z = Math.PI / 2;
    rod.position.set(CABIN.window.x, CABIN.window.y + CABIN.window.h / 2 + 0.115, CABIN.window.z + 0.06);
    g.add(rod);
    this.curtainRod = rod;
    for (const side of [-1, 1]) {
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), this._brassMat());
      cap.position.set(CABIN.window.x + side * (CABIN.window.w / 2 + 0.38),
        CABIN.window.y + CABIN.window.h / 2 + 0.115, CABIN.window.z + 0.06);
      g.add(cap);
    }
  }

  /* ======================================================================
   * V9.1 · 桌面小物（程序化低模；按材质合并成 7 个 mesh，draw 可控）
   *   左前：两只杯子（蒸汽）、报纸
   *   中间：摊开的笔记本 + 钢笔 + 眼镜、散落车票
   *   右前：骰子托盘、钥匙、毛毯、卡片
   *   左中：磁带 + 小音箱
   *   右后：书堆 + 杂志 + 明信片、绿植
   *   左后：铜台灯（暖光）、蜡烛（烛焰）、立式相框
   * 所有落点由 probe2 实测：都在棋盘圆盘之外，390/430 在画面内，320 后排可见。
   * ====================================================================== */
  _buildProps() {
    const P = PROPS;
    const paper = TX.buildPaperTextures(256);
    const atlas = TX.buildPropAtlas(128);
    this.propPaper = paper;
    this.propAtlas = atlas;
    this._tex.push(paper.map, paper.normal, atlas);

    const group = new THREE.Group();
    this.world.add(group);
    this.propGroup = group;
    this.propAnchors = {};

    /* --- 共享材质（一个材质桶 = 1 draw） --- */
    this.propMatteMat = new THREE.MeshStandardMaterial({
      map: paper.map, normalMap: paper.normal,
      normalScale: new THREE.Vector2(0.45, 0.45), vertexColors: true,
      roughness: 0.64, metalness: 0.03, envMapIntensity: 0.42
    });
    this.propPaperMat = new THREE.MeshStandardMaterial({
      map: paper.map, normalMap: paper.normal,
      normalScale: new THREE.Vector2(MAT.paper.normalScale, MAT.paper.normalScale),
      color: 0xF4E8D4, roughness: MAT.paper.roughness, metalness: 0,
      envMapIntensity: MAT.paper.envMapIntensity
    });
    this.propPrintMat = new THREE.MeshStandardMaterial({
      map: atlas, roughness: 0.78, metalness: 0.02, envMapIntensity: 0.38,
      side: THREE.DoubleSide
    });
    this.propClothMat = new THREE.MeshStandardMaterial({
      map: this._felt.map, normalMap: this._felt.normal,
      normalScale: new THREE.Vector2(1.1, 1.1),
      color: 0x73303A, roughness: MAT.felt.roughness, metalness: 0,
      envMapIntensity: MAT.felt.envMapIntensity
    });
    this.propLeafMat = new THREE.MeshStandardMaterial({
      color: 0x4E6B62, roughness: 0.72, metalness: 0.02,
      envMapIntensity: 0.4, side: THREE.DoubleSide
    });
    this.propDarkMat = new THREE.MeshStandardMaterial({
      map: this._felt.map, color: 0x2A211B, roughness: 0.72, metalness: 0.05,
      envMapIntensity: 0.35
    });
    this.ceramicMat = new THREE.MeshStandardMaterial({
      color: 0xE4D8C6, roughness: 0.24, metalness: 0, envMapIntensity: 1.15
    });
    this.teaMat = new THREE.MeshStandardMaterial({
      color: 0x7A3B18, roughness: 0.18, metalness: 0, envMapIntensity: 0.9
    });
    this.lampShadeMat = new THREE.MeshStandardMaterial({
      color: 0xD8A06A, emissive: 0xFF9A50, emissiveIntensity: 0.55,
      roughness: 0.52, metalness: 0.35, envMapIntensity: MAT.brass.envMapIntensity,
      side: THREE.DoubleSide
    });

    /* --- 合并工具 --- */
    const O = new THREE.Object3D();
    const buckets = { matte: [], paper: [], print: [], brass: [], cloth: [], leaf: [], dark: [] };
    const put = (bucket, geo, x, y, z, rot, color) => {
      O.position.set(x, y, z);
      O.rotation.set(rot ? rot[0] || 0 : 0, rot ? rot[1] || 0 : 0, rot ? rot[2] || 0 : 0);
      O.scale.set(1, 1, 1);
      O.updateMatrix();
      buckets[bucket].push({ geo, matrix: O.matrix.clone(), color });
    };
    /* 印刷面：把 plane 的 UV 映射到图集 4×2 的某个 tile（0..7） */
    const mapTile = (geo, tile) => {
      const col = tile % 4, row = Math.floor(tile / 4);
      const u0 = col / 4, u1 = (col + 1) / 4;
      const v0 = 1 - (row + 1) / 2, v1 = 1 - row / 2;
      const uv = geo.getAttribute('uv');
      for (let k = 0; k < uv.count; k++) {
        uv.setXY(k, u0 + uv.getX(k) * (u1 - u0), v0 + uv.getY(k) * (v1 - v0));
      }
      uv.needsUpdate = true;
      return geo;
    };
    const printPlane = (w, d, tile, x, y, z, rot) => {
      put('print', mapTile(new THREE.PlaneGeometry(w, d), tile), x, y, z, rot);
    };
    /* 书：两块封面薄板 + 中间纸页，纸页在书口露出 */
    const addBook = (x, z, rot, w, d, th, y, cover) => {
      const cr = [0, rot, 0];
      put('matte', new THREE.BoxGeometry(w, 0.009, d), x, y + 0.0045, z, cr, cover);
      put('paper', new THREE.BoxGeometry(w - 0.016, th - 0.018, d - 0.014), x, y + th / 2, z, cr);
      put('matte', new THREE.BoxGeometry(w, 0.009, d), x, y + th - 0.0045, z, cr, cover);
    };

    /* ---------- 右后：书堆（3 本）+ 杂志 + 明信片 ---------- */
    const B = P.books;
    addBook(B.x, B.z, B.rot, 0.58, 0.42, 0.078, 0.006, [0.30, 0.36, 0.30]);
    addBook(B.x + 0.01, B.z - 0.005, B.rot - 0.10, 0.53, 0.38, 0.062, 0.084, [0.46, 0.20, 0.22]);
    addBook(B.x - 0.008, B.z + 0.004, B.rot + 0.07, 0.46, 0.33, 0.050, 0.146, [0.21, 0.25, 0.34]);
    const magY = 0.196;
    put('matte', new THREE.BoxGeometry(0.32, 0.010, 0.40), B.x + 0.02, magY + 0.005, B.z + 0.01, [0, B.rot - 0.18, 0], [0.14, 0.13, 0.12]);
    printPlane(0.31, 0.39, 0, B.x + 0.02, magY + 0.011, B.z + 0.01, [-Math.PI / 2, B.rot - 0.18, 0]);
    /* 明信片斜靠在书堆前（斜立 66°） */
    printPlane(0.19, 0.13, 3, B.x - 0.18, 0.145, B.z + 0.205, [-1.16, B.rot - 0.5, 0]);

    /* ---------- 右后：小绿植 ---------- */
    const PL = P.plant;
    put('matte', new THREE.CylinderGeometry(0.112, 0.088, 0.17, 18, 1), PL.x, 0.091, PL.z, null, [0.42, 0.28, 0.21]);
    put('matte', new THREE.CylinderGeometry(0.118, 0.118, 0.020, 18, 1), PL.x, 0.183, PL.z, null, [0.36, 0.24, 0.18]);
    put('matte', new THREE.CylinderGeometry(0.100, 0.100, 0.012, 16, 1), PL.x, 0.189, PL.z, null, [0.12, 0.09, 0.06]);
    const leafShape = new THREE.Shape();
    leafShape.moveTo(0, 0);
    leafShape.bezierCurveTo(0.062, 0.05, 0.070, 0.20, 0, 0.33);
    leafShape.bezierCurveTo(-0.070, 0.20, -0.062, 0.05, 0, 0);
    const leafGeoBase = new THREE.ShapeGeometry(leafShape, 4);
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + 0.35;
      const s = 0.88 + (i % 4) * 0.16;
      O.position.set(PL.x + Math.cos(a) * 0.040, 0.20, PL.z + Math.sin(a) * 0.040);
      O.rotation.set(-1.16 + (i % 3) * 0.17, a + Math.PI / 2, 0);
      O.scale.set(s, s, s);
      O.updateMatrix();
      buckets.leaf.push({ geo: leafGeoBase.clone(), matrix: O.matrix.clone() });
    }
    put('leaf', leafGeoBase.clone(), PL.x, 0.215, PL.z, [-1.45, 0.4, 0]);
    leafGeoBase.dispose();
    this.propAnchors.plant = this._anchor(PL.x, 0.2, PL.z);

    /* ---------- 左后：黄铜小台灯（暖光 + 自发光灯罩 + 桌面光池） ---------- */
    const L = P.lamp;
    put('brass', new THREE.CylinderGeometry(0.120, 0.148, 0.030, 22, 1), L.x, 0.021, L.z);
    put('brass', new THREE.CylinderGeometry(0.017, 0.023, 0.40, 10, 1), L.x, 0.235, L.z);
    put('brass', new THREE.SphereGeometry(0.030, 10, 8), L.x, 0.445, L.z);
    put('brass', new THREE.CylinderGeometry(0.013, 0.015, 0.30, 8, 1), L.x + 0.055, 0.520, L.z + 0.115, [0.95, 0, -0.36]);
    put('brass', new THREE.CylinderGeometry(0.052, 0.070, 0.022, 14, 1), L.x + 0.135, 0.575, L.z + 0.225);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.152, 0.205, 22, 1, true), this.lampShadeMat);
    shade.position.set(L.x + 0.132, 0.472, L.z + 0.222);
    shade.rotation.z = -0.16;
    shade.rotation.x = 0.10;
    shade.castShadow = false;
    group.add(shade);
    this.deskShade = shade;
    this.deskGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeGlowTex(), color: 0xFFC888, transparent: true, opacity: 0.38,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false
    }));
    this.deskGlow.scale.set(0.85, 0.85, 1);
    this.deskGlow.position.set(L.x + 0.132, 0.435, L.z + 0.222);
    group.add(this.deskGlow);
    /* 灯下的暖光池（贴桌面，1 draw，读作真实光斑） */
    const t0 = themeOf(this.theme);
    this.deskPool = makeGlowPlane(2.2, t0.light.lamp);
    this.deskPool.position.set(L.x + 0.11, 0.0078, L.z + 0.24);
    this.deskPool.material.opacity = 0.16;
    this.deskPool.renderOrder = 1;
    group.add(this.deskPool);
    this.deskLight = new THREE.PointLight(0xFFB877, 2.8, 4.2, 2);
    this.deskLight.position.set(L.x + 0.12, 0.43, L.z + 0.20);
    this.scene.add(this.deskLight);
    this.propAnchors.lamp = this._anchor(L.x, 0.42, L.z);

    /* ---------- 左后：蜡烛（黄铜烛台 + 象牙蜡 + 烛焰） ---------- */
    const C = P.candle;
    put('brass', new THREE.CylinderGeometry(0.086, 0.10, 0.020, 16, 1), C.x, 0.016, C.z);
    put('brass', new THREE.CylinderGeometry(0.024, 0.032, 0.095, 10, 1), C.x, 0.072, C.z);
    put('brass', new THREE.CylinderGeometry(0.052, 0.035, 0.032, 14, 1), C.x, 0.132, C.z);
    put('matte', new THREE.CylinderGeometry(0.040, 0.042, 0.22, 14, 1), C.x, 0.258, C.z, null, [0.93, 0.86, 0.72]);
    put('matte', new THREE.CylinderGeometry(0.022, 0.026, 0.013, 10, 1), C.x, 0.373, C.z, null, [0.86, 0.78, 0.64]);
    put('dark', new THREE.CylinderGeometry(0.0038, 0.0038, 0.022, 6, 1), C.x, 0.388, C.z);
    this.flame = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeFlameTex(), color: 0xFFE2B0, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false
    }));
    this.flame.scale.set(0.055, 0.125, 1);
    this.flame.position.set(C.x, 0.435, C.z);
    group.add(this.flame);
    this.candleGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: TX.makeGlowTex(), color: 0xFFA860, transparent: true, opacity: 0.30,
      blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false
    }));
    this.candleGlow.scale.set(0.70, 0.70, 1);
    this.candleGlow.position.set(C.x, 0.41, C.z);
    group.add(this.candleGlow);
    this.candleLight = new THREE.PointLight(0xFF9A50, 1.35, 2.8, 2);
    this.candleLight.position.set(C.x, 0.46, C.z);
    this.scene.add(this.candleLight);
    this.propAnchors.candle = this._anchor(C.x, 0.36, C.z);

    /* ---------- 左后：立式黄铜相框（照片 = 夜色散景） ---------- */
    const F = P.photo;
    put('brass', new THREE.BoxGeometry(0.345, 0.405, 0.014), F.x, 0.215, F.z, [-0.15, F.rot, 0]);
    put('brass', new THREE.BoxGeometry(0.335, 0.030, 0.055), F.x, 0.020, F.z + 0.014, [0, F.rot, 0]);
    put('brass', new THREE.BoxGeometry(0.026, 0.285, 0.012), F.x, 0.175, F.z - 0.045, [0.30, F.rot, 0]);
    printPlane(0.278, 0.332, 4, F.x + Math.sin(F.rot) * 0.016, 0.218, F.z + Math.cos(F.rot) * 0.016, [-0.15, F.rot, 0]);
    this.propAnchors.photo = this._anchor(F.x, 0.2, F.z);

    /* ---------- 左中：小音箱（平放，顶面网罩）+ 磁带 ---------- */
    const SP = P.speaker;
    put('dark', new THREE.BoxGeometry(0.255, 0.072, 0.175), SP.x, 0.046, SP.z, [0, SP.rot, 0]);
    put('brass', new THREE.CylinderGeometry(0.017, 0.017, 0.016, 10, 1), SP.x, 0.036, SP.z + 0.10, [Math.PI / 2, 0, 0]);
    put('brass', new THREE.CylinderGeometry(0.040, 0.040, 0.008, 12, 1), SP.x - 0.085, 0.008, SP.z, [0, SP.rot, 0]);
    printPlane(0.225, 0.148, 6, SP.x, 0.083, SP.z, [-Math.PI / 2, SP.rot, 0]);
    const CA = P.cassette;
    put('dark', new THREE.BoxGeometry(0.335, 0.030, 0.215), CA.x, 0.021, CA.z, [0, CA.rot, 0]);
    printPlane(0.31, 0.19, 5, CA.x, 0.037, CA.z, [-Math.PI / 2, CA.rot, 0]);
    this.propAnchors.speaker = this._anchor(SP.x, 0.1, SP.z);

    /* ---------- 左前：报纸（压在一角，右侧被咖啡杯压住） ---------- */
    const NP = P.newspaper;
    put('paper', new THREE.BoxGeometry(0.56, 0.006, 0.40), NP.x, 0.009, NP.z, [0, NP.rot, 0]);
    printPlane(0.545, 0.385, 1, NP.x, 0.0125, NP.z, [-Math.PI / 2, NP.rot, 0]);

    /* ---------- 左前：第二只小茶杯（两个人） ---------- */
    if (this.cupGroup) {
      const cup2 = this.cupGroup.clone();
      cup2.position.set(P.cup2.x, 0.0045, P.cup2.z);
      cup2.rotation.set(0, -0.85, 0);
      cup2.scale.setScalar(P.cup2.s);
      if (cup2.children[1]) cup2.children[1].material = this.teaMat;
      this.world.add(cup2);
      this.cup2 = cup2;
    }

    /* ---------- 中间：摊开的笔记本 + 钢笔 + 眼镜 ---------- */
    const NB = P.notebook;
    put('dark', new THREE.BoxGeometry(0.84, 0.018, 0.56), NB.x, 0.015, NB.z, [0, NB.rot, 0]);
    put('paper', new THREE.BoxGeometry(0.80, 0.022, 0.53), NB.x, 0.033, NB.z, [0, NB.rot, 0]);
    /* 中缝暗槽：让两页之间有一条书脊，而不是一块白板 */
    put('dark', new THREE.BoxGeometry(0.026, 0.006, 0.50), NB.x, 0.0455, NB.z, [0, NB.rot, 0]);
    const pageGeo1 = mapTile(new THREE.PlaneGeometry(0.355, 0.487), 7);
    put('print', pageGeo1, NB.x - 0.195 * Math.cos(NB.rot), 0.0465, NB.z + 0.195 * Math.sin(NB.rot),
      [-Math.PI / 2, NB.rot - 0.03, 0]);
    const pageGeo2 = mapTile(new THREE.PlaneGeometry(0.355, 0.487), 7);
    put('print', pageGeo2, NB.x + 0.195 * Math.cos(NB.rot), 0.0465, NB.z - 0.195 * Math.sin(NB.rot),
      [-Math.PI / 2, NB.rot + 0.02, 0]);
    /* 书签缎带（酒红，从书脊底下露出来） */
    put('cloth', new THREE.BoxGeometry(0.022, 0.003, 0.16), NB.x + 0.01, 0.0485, NB.z + 0.32, [0, NB.rot + 0.12, 0]);
    /* 钢笔：黄铜笔杆 + 深色笔尖，斜放在右页 */
    const penAng = NB.rot - 0.62;
    put('brass', new THREE.CylinderGeometry(0.0085, 0.0085, 0.21, 8, 1),
      NB.x + 0.17, 0.056, NB.z + 0.02, [Math.PI / 2, penAng, 0]);
    put('dark', new THREE.ConeGeometry(0.0095, 0.038, 8, 1),
      NB.x + 0.17 + Math.sin(penAng) * 0.12, 0.056, NB.z + 0.02 + Math.cos(penAng) * 0.12,
      [Math.PI / 2, penAng, 0]);
    /* 眼镜：折起放在左页（黄铜细框；两片圆镜片 + 鼻梁 + 折起的镜腿） */
    const gl = P.glasses;
    const gx = NB.x - 0.20, gz = NB.z + 0.035;
    for (const sx of [-1, 1]) {
      put('brass', new THREE.TorusGeometry(0.045, 0.0042, 6, 14), gx + sx * 0.050, 0.056, gz, [-Math.PI / 2, NB.rot, 0]);
      put('brass', new THREE.BoxGeometry(0.095, 0.005, 0.006), gx + sx * 0.078, 0.056, gz - 0.048, [0, NB.rot, 0]);
    }
    put('brass', new THREE.BoxGeometry(0.022, 0.0045, 0.006), gx, 0.056, gz + 0.004, [0, NB.rot, 0]);
    this.propAnchors.glasses = this._anchor(gx, 0.06, gz);
    this.propAnchors.notebook = this._anchor(NB.x, 0.05, NB.z);

    /* ---------- 前中：散落车票/卡片 ---------- */
    const T = P.tickets;
    printPlane(0.20, 0.078, 2, T.x, 0.012, T.z, [-Math.PI / 2, T.rot, 0]);
    printPlane(0.20, 0.078, 2, T.x + 0.13, 0.0125, T.z + 0.075, [-Math.PI / 2, T.rot + 0.42, 0]);
    printPlane(0.20, 0.078, 2, T.x - 0.10, 0.0128, T.z + 0.10, [-Math.PI / 2, T.rot - 0.28, 0]);
    const CD = P.cards;
    printPlane(0.19, 0.074, 2, CD.x, 0.012, CD.z, [-Math.PI / 2, CD.rot, 0]);
    printPlane(0.19, 0.074, 2, CD.x - 0.11, 0.0126, CD.z + 0.09, [-Math.PI / 2, CD.rot + 0.5, 0]);

    /* ---------- 右前：钥匙（黄铜钥匙圈 + 两把钥匙） ---------- */
    const K = P.keys;
    put('brass', new THREE.TorusGeometry(0.052, 0.007, 6, 18), K.x, 0.016, K.z, [-Math.PI / 2, K.rot, 0]);
    for (const s of [-1, 1]) {
      const ang = K.rot + (s > 0 ? 0.34 : -0.42);
      const bx = K.x + Math.sin(ang) * 0.075, bz = K.z + Math.cos(ang) * 0.075;
      put('brass', new THREE.TorusGeometry(0.019, 0.0045, 5, 10), bx, 0.016, bz, [-Math.PI / 2, ang, 0]);
      const sx = K.x + Math.sin(ang) * 0.125, sz = K.z + Math.cos(ang) * 0.125;
      put('brass', new THREE.BoxGeometry(0.010, 0.007, 0.085), sx, 0.016, sz, [0, ang, 0]);
      put('brass', new THREE.BoxGeometry(0.026, 0.008, 0.016), sx + Math.sin(ang) * 0.048, 0.016, sz + Math.cos(ang) * 0.048, [0, ang, 0]);
      put('brass', new THREE.BoxGeometry(0.018, 0.008, 0.012), sx + Math.sin(ang) * 0.030, 0.016, sz + Math.cos(ang) * 0.030, [0, ang + 0.4, 0]);
    }
    this.propAnchors.keys = this._anchor(K.x, 0.05, K.z);

    /* ---------- 右前：骰子托盘（空盘：真骰子仍在 DIE_HOME） ---------- */
    const TR = P.tray;
    put('matte', new THREE.CylinderGeometry(0.345, 0.325, 0.038, 30, 1), TR.x, 0.025, TR.z, null, [0.26, 0.17, 0.11]);
    put('matte', new THREE.CylinderGeometry(0.300, 0.300, 0.012, 26, 1), TR.x, 0.046, TR.z, null, [0.15, 0.21, 0.18]);
    put('brass', new THREE.TorusGeometry(0.318, 0.020, 8, 34), TR.x, 0.052, TR.z, [-Math.PI / 2, 0, 0]);
    this.propAnchors.tray = this._anchor(TR.x, 0.05, TR.z);

    /* ---------- 右前：折好的毛毯（三层 + 卷边，读作织物而不是盒子） ---------- */
    const BL = P.blanket;
    put('cloth', new THREE.BoxGeometry(0.84, 0.085, 0.60), BL.x, 0.050, BL.z, [0, BL.rot, 0]);
    put('cloth', new THREE.BoxGeometry(0.76, 0.070, 0.53), BL.x + 0.035, 0.126, BL.z + 0.022, [0, BL.rot - 0.08, 0]);
    put('cloth', new THREE.BoxGeometry(0.66, 0.055, 0.46), BL.x + 0.055, 0.188, BL.z + 0.04, [0, BL.rot - 0.15, 0]);
    put('cloth', new THREE.CylinderGeometry(0.048, 0.048, 0.66, 10, 1), BL.x + 0.04, 0.23, BL.z + 0.20, [0, BL.rot - 0.1, Math.PI / 2]);
    this.propAnchors.blanket = this._anchor(BL.x, 0.14, BL.z);

    /* --- 合并成 mesh（7 个材质桶） --- */
    const build = (bucket, mat, cast) => {
      const parts = buckets[bucket];
      if (!parts.length) return null;
      const geo = mergePropGeoms(parts);
      parts.forEach((p) => p.geo.dispose());
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = !!cast;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };
    this.propMatteMesh = build('matte', this.propMatteMat, true);
    this.propPaperMesh = build('paper', this.propPaperMat, false);
    this.propPrintMesh = build('print', this.propPrintMat, false);
    this.propBrassMesh = build('brass', this._brassMat(), true);
    this.propClothMesh = build('cloth', this.propClothMat, true);
    this.propLeafMesh = build('leaf', this.propLeafMat, false);
    this.propDarkMesh = build('dark', this.propDarkMat, false);
  }

  _anchor(x, y, z) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    this.propGroup.add(g);
    return g;
  }

  /* ======================================================================
   * V9.1 · 氛围动画挂点：咖啡蒸汽 / 烛焰 / 台灯光晕 / 舷窗光尘
   *   reduced = 完全静态（不更新，只保留一次绘制）
   * ====================================================================== */
  _buildComfort() {
    /* 咖啡蒸汽：3 个 sprite 循环上升（1 draw/sprite，high/medium 开） */
    const cup = PROPS.cup;
    const cupTop = 0.50;
    this.steamBase = new THREE.Vector3(cup.x, cupTop, cup.z);
    this.steam = [];
    const steamTex = TX.makeSteamTex();
    for (let i = 0; i < 3; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({
        map: steamTex, color: 0xFFF2DE, transparent: true, opacity: 0.1,
        depthWrite: false, fog: false, toneMapped: false
      }));
      sp.scale.set(0.1, 0.16, 1);
      sp.position.copy(this.steamBase);
      sp.material.rotation = (i - 1) * 0.4;
      this.scene.add(sp);
      this.steam.push(sp);
    }
    /* 舷窗冷光尘（26 点，1 draw）：让空舱壁有飘浮粒子 */
    const n = CABIN_FX.motes;
    const pos = new Float32Array(n * 3);
    const seed = [];
    for (let i = 0; i < n; i++) {
      pos[i * 3] = CABIN.window.x + (Math.random() - 0.5) * 2.6;
      pos[i * 3 + 1] = 0.25 + Math.random() * 1.5;
      pos[i * 3 + 2] = CABIN.window.z + 0.25 + Math.random() * 0.5;
      seed.push(Math.random() * 6.28, 0.4 + Math.random() * 0.8);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.moteBase = pos.slice();
    this.moteSeed = seed;
    this.moteMat = new THREE.PointsMaterial({
      size: 0.030, map: TX.makeDustTex(), color: 0xBFD8F6, transparent: true,
      opacity: 0.42, depthWrite: false, blending: THREE.AdditiveBlending,
      sizeAttenuation: true, fog: true, toneMapped: false
    });
    this.motes = new THREE.Points(geo, this.moteMat);
    this.motes.frustumCulled = false;
    this.scene.add(this.motes);
    this._applyPropsQuality();
  }

  _applyPropsQuality() {
    const tier = QUALITY[this.quality];
    /* 低档保留小物（避免慢设备自适应降档后画面「回到 V9 的干净」），
     * 但关掉额外点光/粒子：灯罩自发光与光晕 sprite 仍在，小物靠 key/rim/lamp 照亮。 */
    const extraLights = !!tier.props && !!tier.env;
    if (this.propGroup) this.propGroup.visible = !!tier.props;
    if (this.steam) this.steam.forEach((s) => { s.visible = !!tier.steam; });
    if (this.motes) this.motes.visible = !!tier.motes;
    if (this.deskLight) this.deskLight.intensity = extraLights ? 2.2 : 0;
    if (this.candleLight) this.candleLight.intensity = extraLights ? 1.2 : 0;
    if (this.deskGlow) this.deskGlow.visible = !!tier.props;
    if (this.candleGlow) this.candleGlow.visible = !!tier.props;
    if (this.flame) this.flame.visible = !!tier.props;
  }

  /* 每帧氛围动画（reduced 不调用 → 静态画面） */
  _updateAmbient(now, dt) {
    const tier = QUALITY[this.quality];
    const extraLights = !!tier.props && !!tier.env;
    /* 咖啡蒸汽：循环上升 + 淡入淡出 */
    if (tier.steam && this.steam) {
      const N = this.steam.length;
      for (let i = 0; i < N; i++) {
        const sp = this.steam[i];
        const p = ((now * 0.00016 + i / N) % 1);
        const rise = p * 0.62;
        sp.position.set(
          this.steamBase.x + Math.sin(p * 6.2 + i * 2.1) * (0.02 + p * 0.05),
          this.steamBase.y + rise,
          this.steamBase.z + Math.cos(p * 5.1 + i * 1.7) * (0.015 + p * 0.04)
        );
        const sc = 0.09 + p * 0.30;
        sp.scale.set(sc, sc * 1.6, 1);
        sp.material.opacity = Math.sin(p * Math.PI) * 0.13;
        sp.material.rotation = (i - 1) * 0.4 + Math.sin(now * 0.0006 + i) * 0.12;
      }
    }
    /* 烛焰：缩放/透明度抖动 + 点光轻微呼吸 */
    if (tier.props && this.flame) {
      const f1 = 0.5 + 0.5 * Math.sin(now * 0.0125);
      const f2 = 0.5 + 0.5 * Math.sin(now * 0.021 + 1.7);
      this.flame.scale.set(0.046 + f1 * 0.012, 0.105 + f2 * 0.028, 1);
      this.flame.material.opacity = 0.82 + f1 * 0.16;
      if (this.candleGlow) {
        this.candleGlow.material.opacity = 0.24 + f2 * 0.10;
        this.candleGlow.scale.set(0.58 + f1 * 0.08, 0.58 + f1 * 0.08, 1);
      }
      if (this.candleLight && extraLights) this.candleLight.intensity = 1.05 + f1 * 0.35;
    }
    /* 铜台灯：灯罩自发光呼吸 + 光晕 + 点光 */
    if (tier.props && this.deskShade) {
      const b = 0.5 + 0.5 * Math.sin(now * 0.0013 + 0.6);
      this.lampShadeMat.emissiveIntensity = 0.34 + b * 0.14;
      if (this.deskGlow) this.deskGlow.material.opacity = 0.32 + b * 0.10;
      if (this.deskLight && extraLights) this.deskLight.intensity = 2.0 + b * 0.45;
    }
    /* 阅读灯呼吸（在 applyHeat 的基准亮度上做 ±3% + 极轻闪烁） */
    if (this.lamp && this._lampBase) {
      const br = 0.5 + 0.5 * Math.sin(now * 0.0009);
      const fl = Math.sin(now * 0.031) > 0.988 ? 0.94 : 1;
      this.lamp.intensity = this._lampBase * (0.965 + br * 0.045) * fl;
    }
    /* 窗帘轻摆（顶部为轴） */
    if (this.curtains) {
      for (let i = 0; i < this.curtains.length; i++) {
        const c = this.curtains[i];
        const s = i === 0 ? 1 : -1;
        c.rotation.z = Math.sin(now * 0.00055 + i * 1.9) * 0.012 * s;
        c.rotation.x = Math.sin(now * 0.00041 + i * 0.7) * 0.006;
      }
    }
    /* 舷窗光缓慢变化（贴图不动，只改颜色/光晕 → 0 重绘） */
    if (this.windowMat) {
      const k = 0.5 + 0.5 * Math.sin(now * 0.00021);
      this.windowMat.color.setRGB(0.90 + k * 0.06, 0.93 + k * 0.04, 1.0);
      if (this.winGlow) this.winGlow.material.opacity = 0.18 + k * 0.07;
    }
    /* 舷窗光尘缓慢上浮 */
    if (tier.motes && this.motes) {
      const attr = this.motes.geometry.getAttribute('position');
      const base = this.moteBase, sd = this.moteSeed;
      const n = Math.min(CABIN_FX.motes, attr.count);
      for (let i = 0; i < n; i++) {
        const ph = sd[i * 2], sp = sd[i * 2 + 1];
        attr.setX(i, base[i * 3] + Math.sin(now * 0.00022 * sp + ph) * 0.18);
        attr.setY(i, base[i * 3 + 1] + Math.sin(now * 0.00035 * sp + ph * 1.3) * 0.10);
        attr.setZ(i, base[i * 3 + 2] + Math.cos(now * 0.00026 * sp + ph) * 0.10);
      }
      attr.needsUpdate = true;
    }
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
    this.dieShadow.position.y = DIE_FLOOR + 0.004;   /* 阴影贴在圆盘面（0.038）上，不是桌面 */
    this.scene.add(this.dieShadow);
    this.placeDie(1);
  }

  _buildHand() {
    this._hand = makeHand();
    if (this._hand.textures) for (const tx of this._hand.textures) this._tex.push(tx);
    this.scene.add(this._hand.group);
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
    this._applyPropsQuality();
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
      this._updateAmbient(now, dt);
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
      this._floorTex = this._floorTex || {};
      this._floorTex[t.id] = TX.buildFloorTexture(t.floor);
      this._tex.push(this._winTex[t.id], this._wallTex[t.id], this._overlayTex[t.id], this._hubTex[t.id], this._floorTex[t.id]);
    }
    return {
      win: this._winTex[t.id], wall: this._wallTex[t.id],
      overlay: this._overlayTex[t.id], hub: this._hubTex[t.id],
      floor: this._floorTex[t.id]
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
    if (this.floorMat) {
      if (assets.floor) {
        this.floorMat.map = assets.floor;
        this.floorMat.color.set(0xFFFFFF);
        this.floorMat.needsUpdate = true;
      } else {
        this.floorMat.color.set(t.floor);
      }
    }
    if (this.bulbMat) this.bulbMat.color.set(t.light.lamp);

    /* V9.1 机舱细节 / 桌面小物按主题染色（贴图是中性程序化纹理） */
    if (this.binMat) this.binMat.color.set(t.wallTint).multiplyScalar(0.60);
    if (this.stripMat) this.stripMat.color.set(t.light.lamp);
    if (this.binGlow) this.binGlow.material.color.set(t.light.lamp);
    if (this.curtainMat) this.curtainMat.color.set(t.feltTint).multiplyScalar(1.25).lerp(new THREE.Color(0xE2D2B6), 0.25);
    if (this.binLatch && this._brassMaterial) this.binLatch.material = this._brassMaterial;
    if (this.propClothMat) this.propClothMat.color.set(t.bear.scarf).multiplyScalar(0.72);
    if (this.deskPool) this.deskPool.material.color.set(t.light.lamp);
    if (this.lampShadeMat) {
      this.lampShadeMat.color.set(t.light.lamp).multiplyScalar(0.62);
      this.lampShadeMat.emissive.set(t.light.lamp);
    }
    if (this.deskLight) this.deskLight.color.set(t.light.lamp);
    if (this.deskGlow) this.deskGlow.material.color.set(t.light.lamp);
    if (this.candleLight) this.candleLight.color.set(t.light.lamp);
    if (this.candleGlow) this.candleGlow.material.color.set(t.light.lamp);
    if (this.flame) this.flame.material.color.set(t.light.lamp).lerp(new THREE.Color(0xFFF2D8), 0.55);
    if (this.moteMat) this.moteMat.color.set(t.light.rim);
    if (this.propLeafMat) this.propLeafMat.color.set(t.id === 'paper' ? 0x5C6B4A : t.id === 'star' ? 0x4A5E62 : 0x4E6B62);
    if (this.steam) this.steam.forEach((s) => s.material.color.set(t.light.lamp).lerp(new THREE.Color(0xFFF4E6), 0.7));
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
    /* V9.1：呼吸动画以此为基准，避免每帧累积漂移 */
    this._lampBase = this.lamp.intensity;
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

  /* V9.3：平躺落定。面 v 的法向转到世界 +Y（顶面 = 引擎点数，正面读得清），
   * 再绕 Y 加一点 yaw 避免像贴图；此时骰子重心高度就是半边长，不会半沉进棋盘。 */
  dieSettleQuat(v, yaw) {
    const q = new THREE.Quaternion().setFromUnitVectors(this.dieFaceNormal(v), this._upY);
    const y = yaw === undefined ? this._dieYaw : yaw;
    return new THREE.Quaternion().setFromAxisAngle(this._upY, y).multiply(q);
  }

  /* 四元数下骰子的最低点：世界 Y 方向支撑半高（立方体 = 半边长 × Σ|R_y 行|）。
   * 用于落定翻面时保持「棱贴桌面」而不是穿进棋盘。 */
  _dieExtent(q) {
    const x = q.x, y = q.y, z = q.z, w = q.w;
    return DIE_SIZE * 0.5 * (
      Math.abs(2 * (x * y + w * z)) +
      Math.abs(1 - 2 * (x * x + z * z)) +
      Math.abs(2 * (y * z - w * x))
    );
  }

  _dieShadowAt() {
    const y = this.die.position.y;
    const h = Math.max(0, y - DIE_HOME.y);
    this.dieShadow.position.set(this.die.position.x, DIE_FLOOR + 0.004, this.die.position.z);
    this.dieShadow.scale.setScalar(clamp(1.02 - h * 0.30, 0.55, 1.08));
    this.dieShadow.material.opacity = clamp(0.52 - h * 0.20, 0.10, 0.52);
  }

  setDieVisible(flag) {
    const on = !!flag;
    this.die.visible = on;
    this.dieShadow.visible = on;
    this.requestRender();
  }

  placeDie(value) {
    const v = clamp(Number(value) || 1, 1, 6);
    this.dieValue = v;
    this.die.visible = true;
    this.dieShadow.visible = true;
    this.die.position.copy(DIE_HOME);
    this.die.quaternion.copy(this.dieSettleQuat(v));
    this._dieShadowAt();
    if (!this._toss && this._hand) this._hand.group.visible = false;
    this.requestRender();
  }

  dieDebug() {
    const m = new THREE.Matrix4().makeRotationFromQuaternion(this.die.quaternion);
    const e = m.elements;
    const axes = [
      [e[1], DIE_FACES[0]], [-e[1], DIE_FACES[1]],
      [e[5], DIE_FACES[2]], [-e[5], DIE_FACES[3]],
      [e[9], DIE_FACES[4]], [-e[9], DIE_FACES[5]]
    ];
    let top = axes[0];
    for (let i = 1; i < axes.length; i++) if (axes[i][0] > top[0]) top = axes[i];
    return {
      value: this.dieValue,
      top: top[1],
      up: +top[0].toFixed(4),
      pos: [+this.die.position.x.toFixed(4), +this.die.position.y.toFixed(4), +this.die.position.z.toFixed(4)],
      atHome: +this.die.position.distanceTo(DIE_HOME).toFixed(4),
      hand: !!(this._hand && this._hand.group.visible),
      tossing: !!this._toss,
      t: this._toss ? Math.round(this._toss.animT || 0) : null,
      wall: this._toss ? Math.round(performance.now() - this._toss.startedAt) : null,
      phase: this._toss ? this._toss.phase || '' : ''
    };
  }

  /* ======================= V9.3 手 → 抛 → 弹跳 → 落中间 ======================= */
  _handQuat(yaw, pitch, roll) {
    return new THREE.Quaternion().setFromEuler(new THREE.Euler(pitch, yaw, roll, 'YXZ'));
  }

  /* 给定「骰子应在的世界位置」和手腕姿态，解出手掌原点位置（骰子握在 gripLocal） */
  _handPoseForDie(diePos, yaw, pitch, roll) {
    const q = this._handQuat(yaw, pitch, roll);
    const off = this._hand.gripLocal.clone().applyQuaternion(q);
    return { p: diePos.clone().sub(off), q };
  }

  _poseLerp(a, b, e, out) {
    out = out || { p: new THREE.Vector3(), q: new THREE.Quaternion() };
    out.p.lerpVectors(a.p, b.p, e);
    out.q.copy(a.q).slerp(b.q, e);
    return out;
  }

  _handAt(t) {
    const T = this._toss;
    if (!T) return null;
    const S = T.poses;
    const eOut = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);
    const eInOut = (x) => { const c = clamp(x, 0, 1); return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2; };
    const eIn = (x) => Math.pow(clamp(x, 0, 1), 2.2);
    if (t <= T.enterMs) return this._poseLerp(S.start, S.hover, eOut(t / T.enterMs), T.hp);
    if (t <= T.enterMs + T.descendMs) return this._poseLerp(S.hover, S.grip, eInOut((t - T.enterMs) / T.descendMs), T.hp);
    const closeEnd = T.enterMs + T.descendMs + T.closeMs;
    if (t <= closeEnd) return this._poseLerp(S.grip, S.grip, 0, T.hp);
    if (t <= T.liftEnd) return this._poseLerp(S.grip, S.lift, eInOut((t - closeEnd) / T.liftMs), T.hp);
    if (t <= T.releaseAt) return this._poseLerp(S.lift, S.rel, eIn((t - T.liftEnd) / T.throwMs), T.hp);
    const followEnd = T.releaseAt + 120;
    if (t <= followEnd) return this._poseLerp(S.rel, S.follow, eOut((t - T.releaseAt) / 120), T.hp);
    if (t <= T.exitEnd) return this._poseLerp(S.follow, S.exit, eOut((t - followEnd) / Math.max(1, T.exitMs - 120)), T.hp);
    return null;
  }

  _gripAt(t) {
    const T = this._toss;
    const closeStart = T.enterMs + T.descendMs;
    if (t < closeStart) return 0;
    if (t < closeStart + T.closeMs) return (t - closeStart) / T.closeMs;
    if (t < T.releaseAt) return 1;
    const openK = clamp((t - T.releaseAt) / 150, 0, 1);
    return 1 - openK;
  }

  /* 轻量刚体预演：位置/速度/四元数/角速度；桌面碰撞 + 摩擦 + 角速度阻尼 + 圆形边界。
   * 出手姿态 q0 由「上一面平躺姿态 + 手腕旋转」决定；轨迹在 240Hz 上预计算，
   * 运行时只采样（0 物理开销）。 */
  _simulateToss(q0) {
    const step = PHYS.step;
    const maxSteps = Math.ceil((PHYS.maxActive + 0.02) / step);
    const posArr = new Float32Array(maxSteps * 3);
    const quatArr = new Float32Array(maxSteps * 4);
    const p = [RELEASE_DIE.x, RELEASE_DIE.y, RELEASE_DIE.z];
    /* V9.7：手腕上挑（初速向上），骰子快速旋转，2–3 次弹跳后落 (0.63,0.63) */
    let vx = -0.382, vy = 1.5, vz = -0.396;
    let wx = 18.8, wy = 9.4, wz = -13.6;
    let q = { x: q0.x, y: q0.y, z: q0.z, w: q0.w };
    let rand = this._mulberry(11);
    const impacts = [];
    let restAt = 0, contact = 0;
    let n = 0;
    const qTmp = new THREE.Quaternion();
    for (let i = 0; i <= maxSteps; i++) {
      const t = i * step;
      posArr[i * 3] = p[0]; posArr[i * 3 + 1] = p[1]; posArr[i * 3 + 2] = p[2];
      quatArr[i * 4] = q.x; quatArr[i * 4 + 1] = q.y; quatArr[i * 4 + 2] = q.z; quatArr[i * 4 + 3] = q.w;
      n = i + 1;
      /* 空气阻力 + 重力 */
      const ad = 1 - PHYS.airDrag * step;
      vx *= ad; vz *= ad; vy -= PHYS.g * step;
      p[0] += vx * step; p[1] += vy * step; p[2] += vz * step;
      /* 角速度积分 dq = 0.5 * (0,w) ⊗ q */
      const dx = 0.5 * (-wx * q.x - wy * q.y - wz * q.z) * step;
      const dy = 0.5 * (wx * q.w + wy * q.z - wz * q.y) * step;
      const dz = 0.5 * (-wx * q.y + wy * q.w + wz * q.x) * step;
      const dw = 0.5 * (wx * q.x + wy * q.y + wz * q.z) * step;
      q.x += dx; q.y += dy; q.z += dz; q.w += dw;
      const ql = Math.sqrt(q.x * q.x + q.y * q.y + q.z * q.z + q.w * q.w) || 1;
      q.x /= ql; q.y /= ql; q.z /= ql; q.w /= ql;
      const sd = 1 - PHYS.spinDamp * step;
      wx *= sd; wy *= sd; wz *= sd;
      qTmp.set(q.x, q.y, q.z, q.w);
      const extent = this._dieExtent(qTmp);
      const ground = DIE_FLOOR + extent;
      /* 棋盘圆形边界（黄铜包边内侧反弹） */
      const rr = Math.sqrt(p[0] * p[0] + p[2] * p[2]);
      if (rr > PHYS.boundR) {
        const nx = -p[0] / rr, nz = -p[2] / rr;
        const vn = vx * nx + vz * nz;
        if (vn < 0) {
          vx -= 1.7 * vn * nx; vz -= 1.7 * vn * nz;
          p[0] = nx * -PHYS.boundR; p[2] = nz * -PHYS.boundR;
          wx += (rand() - 0.5) * 4; wy += (rand() - 0.5) * 3; wz += (rand() - 0.5) * 4;
        }
      }
      if (p[1] <= ground) {
        p[1] = ground;
        if (vy < 0) {
          const speed = -vy;
          const bi = Math.min(impacts.length, 2);
          if (speed > 0.55) {
            vy = speed * (PHYS.rest[bi] + (rand() - 0.5) * 0.04);
            const tan = PHYS.tan[bi] + (rand() - 0.5) * 0.05;
            const defl = (rand() - 0.5) * 9 * DEG;
            const c = Math.cos(defl), s = Math.sin(defl);
            const tx = vx * c - vz * s, tz = vx * s + vz * c;
            vx = tx * tan; vz = tz * tan;
            wx = wx * 0.72 + (rand() - 0.5) * 7;
            wy = wy * 0.60 + (rand() - 0.5) * 5;
            wz = wz * 0.72 + (rand() - 0.5) * 7;
            impacts.push({ t: +t.toFixed(3), speed: +speed.toFixed(2) });
          } else { vy = 0; contact++; }
        } else { vy = 0; contact++; }
        if (contact > 0) {
          const vh = Math.sqrt(vx * vx + vz * vz);
          if (vh > 1e-4) {
            const dec = Math.min(vh, PHYS.rollFriction * step);
            vx -= vx / vh * dec; vz -= vz / vh * dec;
          }
          const sd2 = 1 - 2.2 * step;
          wx *= sd2; wy *= sd2; wz *= sd2;
          if (!restAt && vh < 0.05 && Math.abs(wx) + Math.abs(wy) + Math.abs(wz) < 1.6) {
            restAt = t;
          }
        }
      }
      if (restAt && t > restAt + 0.06) break;
    }
    /* 落定段：restAt 之后 0.30s 收尾（至少 320ms 翻面段，整体不超 maxActive） */
    const settleEnd = restAt ? clamp(restAt + PHYS.restPad, PHYS.minEnd, PHYS.maxActive) : PHYS.maxActive;
    const settleStart = Math.max(0, settleEnd - PHYS.settleMs / 1000);
    const si = Math.min(n - 1, Math.round(settleStart / step));
    const startQ = new THREE.Quaternion(quatArr[si * 4], quatArr[si * 4 + 1], quatArr[si * 4 + 2], quatArr[si * 4 + 3]);
    const startP = new THREE.Vector3(posArr[si * 3], posArr[si * 3 + 1], posArr[si * 3 + 2]);
    /* 落定翻面：从 4 个 yaw 里选离物理姿态最近的一个（视觉翻动量最小） */
    let targetQ = null, bestYaw = this._dieYaw, bestAng = 1e9;
    for (let k = 0; k < 4; k++) {
      const yaw = 0.22 + k * Math.PI / 2;
      const cand = this.dieSettleQuat(this.dieValue, yaw);
      const ang = startQ.angleTo(cand);
      if (ang < bestAng) { bestAng = ang; bestYaw = yaw; targetQ = cand; }
    }
    this._dieYaw = bestYaw;
    return {
      posArr, quatArr, n, impacts, restAt, settleStart, settleEnd,
      startP, startQ, targetQ, settleAngle: +(bestAng / DEG).toFixed(1)
    };
  }

  _mulberry(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  _beginToss(value) {
    const hand = this._hand;
    if (!hand) return null;
    this.die.visible = true;
    this.dieShadow.visible = true;
    hand.group.visible = true;
    hand.setGrip(0);
    const pickupQ = this.die.quaternion.clone();
    /* 先摆到落点（上一面朝上），手从画外右下进 */
    this.die.position.copy(DIE_HOME);
    this.die.quaternion.copy(pickupQ);
    const hoverDie = DIE_HOME.clone().add(new THREE.Vector3(0.02, 0.17, 0.04));
    const S = {
      hover: this._handPoseForDie(hoverDie, 1.95, -0.12, 0.35),
      grip: this._handPoseForDie(DIE_HOME, 1.95, -0.10, 0.40),
      /* V9.4：托起到外侧高位，再向棋盘中心甩出；出手点/初速与刚体预演一致 */
      lift: this._handPoseForDie(new THREE.Vector3(0.76, 0.48, 0.78), 1.95, -0.05, 0.45),
      rel: this._handPoseForDie(RELEASE_DIE, 1.90, -0.55, 0.55)
    };
    S.start = { p: S.hover.p.clone().add(new THREE.Vector3(1.95, 0.02, -0.62)), q: S.hover.q.clone() };
    /* 出手后先向内送一下（跟随），再从右上退出画面 */
    S.follow = { p: S.rel.p.clone().add(new THREE.Vector3(0.06, 0.12, 0.02)), q: this._handQuat(1.78, -0.62, 0.50) };
    S.exit = { p: S.rel.p.clone().add(new THREE.Vector3(1.35, 0.55, 0.45)), q: this._handQuat(1.20, 0.40, -0.16) };
    /* 骰子握在手里时相对手腕的固定姿态 */
    const dieLocalQ = S.grip.q.clone().invert().multiply(pickupQ);
    const relQ = S.rel.q.clone().multiply(dieLocalQ);
    const T = {
      enterMs: HAND.enterMs, descendMs: HAND.descendMs, closeMs: HAND.closeMs,
      liftMs: HAND.liftMs, throwMs: HAND.throwMs, exitMs: HAND.exitMs,
      liftEnd: HAND.enterMs + HAND.descendMs + HAND.closeMs + HAND.liftMs,
      releaseAt: HAND.releaseAt, exitEnd: HAND.releaseAt + HAND.exitMs,
      total: HAND.total, poses: S,
      dieLocalQ, hp: { p: new THREE.Vector3(), q: new THREE.Quaternion() },
      phase: 'enter', sndRelease: false, impactIdx: 0, startedAt: performance.now()
    };
    T.phys = this._simulateToss(relQ);
    T.settleStartAbs = T.releaseAt + T.phys.settleStart * 1000;
    T.settleEndAbs = T.releaseAt + T.phys.settleEnd * 1000;
    T.total = Math.max(HAND.total, Math.ceil(T.settleEndAbs) + 20);
    this._toss = T;
    this._tossFrame(0, null);
    return T;
  }

  _tossFrame(t, hooks) {
    const T = this._toss;
    if (!T) return;
    /* 手 */
    const pose = this._handAt(t);
    if (pose) {
      T.hp.p.copy(pose.p); T.hp.q.copy(pose.q);
      this._hand.group.position.copy(pose.p);
      this._hand.group.quaternion.copy(pose.q);
      this._hand.setGrip(this._gripAt(t));
      this._hand.group.visible = true;
    } else {
      this._hand.group.visible = false;
    }
    T.phase = t < T.liftEnd - T.liftMs ? 'enter' : t < T.releaseAt ? 'carry' : 'throw';
    T.animT = t;    /* 骰子 */
    if (t < T.releaseAt) {
      const closeStart = T.enterMs + T.descendMs + T.closeMs;
      if (t < closeStart) {
        this.die.position.copy(DIE_HOME);
        this.die.quaternion.copy(T.poses.grip.q).multiply(T.dieLocalQ);
      } else {
        /* 手里：位置/姿态跟手腕（含托起/甩出） */
        this.die.position.copy(T.hp.p);
        this._v.copy(this._hand.gripLocal).applyQuaternion(T.hp.q);
        this.die.position.add(this._v);
        this.die.quaternion.copy(T.hp.q).multiply(T.dieLocalQ);
      }
    } else {
      this._diePhysAt(t);
      if (hooks && !T.sndRelease) {
        T.sndRelease = true;
        if (hooks.onRelease) hooks.onRelease();
      }
      if (hooks) {
        const p = T.phys;
        while (T.impactIdx < p.impacts.length && t >= T.releaseAt + p.impacts[T.impactIdx].t * 1000) {
          const imp = p.impacts[T.impactIdx];
          T.impactIdx++;
          if (hooks.onImpact) hooks.onImpact(imp.t, imp.speed);
        }
      }
    }
    this._dieShadowAt();
  }

  _diePhysAt(tAbs) {
    const T = this._toss, ph = T.phys;
    const tRel = Math.max(0, tAbs - T.releaseAt) / 1000;
    const step = PHYS.step;
    if (tRel >= ph.settleEnd) {
      this.die.position.copy(DIE_HOME);
      this.die.quaternion.copy(ph.targetQ);
      return;
    }
    if (tRel >= ph.settleStart) {
      const k = clamp((tRel - ph.settleStart) / (ph.settleEnd - ph.settleStart), 0, 1);
      const e = smoothstep(0, 1, k);
      const qe = smoothstep(0.05, 1, k);
      this.die.quaternion.copy(ph.startQ).slerp(ph.targetQ, qe);
      this.die.position.x = lerp(ph.startP.x, DIE_HOME.x, e);
      this.die.position.z = lerp(ph.startP.z, DIE_HOME.z, e);
      this.die.position.y = DIE_FLOOR + this._dieExtent(this.die.quaternion);
      return;
    }
    const f = tRel / step;
    const i = Math.min(ph.n - 2, Math.max(0, Math.floor(f)));
    const a = clamp(f - i, 0, 1);
    const p = ph.posArr, q = ph.quatArr;
    this.die.position.set(
      lerp(p[i * 3], p[(i + 1) * 3], a),
      lerp(p[i * 3 + 1], p[(i + 1) * 3 + 1], a),
      lerp(p[i * 3 + 2], p[(i + 1) * 3 + 2], a)
    );
    this._q2.set(q[i * 4], q[i * 4 + 1], q[i * 4 + 2], q[i * 4 + 3]);
    this._q1.set(q[(i + 1) * 4], q[(i + 1) * 4 + 1], q[(i + 1) * 4 + 2], q[(i + 1) * 4 + 3]);
    this.die.quaternion.copy(this._q2).slerp(this._q1, a);
  }

  _endToss(v) {
    this._toss = null;
    if (this._hand) {
      this._hand.group.visible = false;
      this._hand.setGrip(0);
    }
    this.placeDie(v);
    this.requestRender();
  }

  /* 对外：手拿起 → 托起 → 抛出 → 物理弹跳 → 落定。instant/reduced 直接落位。
   * hooks: { onRelease(), onImpact(t, speed), onSettle() }（导演用来接 Sfx） */
  tossDie(value, instant, hooks) {
    const v = clamp(Number(value) || 1, 1, 6);
    this.dieValue = v;
    if (this.reduced || instant) {
      this._endToss(v);
      return Promise.resolve();
    }
    const T = this._beginToss(v);
    if (!T) { this._endToss(v); return Promise.resolve(); }
    const h = hooks || {};
    return this.runAnim(T.total, (k, t) => {
      const flush = !(typeof t === 'number' && isFinite(t));
      const tt = flush ? T.total : t;
      this._tossFrame(tt, flush ? null : h);
      if (tt >= T.settleEndAbs - 1 && h.onSettle) {
        if (!T.sndSettle) { T.sndSettle = true; h.onSettle(); }
      }
    }).then(() => this._endToss(v));
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
      die: this.dieDebug(),
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
    this._toss = null;
    this._hand = null;
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

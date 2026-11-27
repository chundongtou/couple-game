/* ==========================================================================
 * V9 · 真 3D 主桌 · 电影写实 · 常量与拓扑（生产模块，ESM）
 * 拓扑只读自 app/src/engine/flight-board.js（同源，不修改引擎）。
 * 这里只做渲染侧的几何/材质/主题常量，不含任何引擎规则。
 *
 * V9 口径（docs/v9/impl-freeze.md §1）：午夜机舱 · 电影写实
 *   - 材质：胡桃木 / 黄铜 / 绒布 / 象牙纸 / 珐琅 / 玻璃（MeshStandardMaterial PBR）
 *   - 光照：ACESFilmic + 暖阅读灯 key + 舷窗冷 rim + 低 fill（PMREM 程序化环境）
 *   - 场景：舱壁 / 舷窗 / 遮光板 / 阅读灯 / 小桌板 / 灰尘 / 轻雾 / 暗角颗粒
 * ========================================================================== */

export const VERSION = 'v9-cinematic-1';
export const DEG = Math.PI / 180;
export const TAU = Math.PI * 2;

/* --- 棋盘几何（P0 原型参数，V9 保持手感不变） --- */
export const RING_N = 52;
export const RING_R = 3.06;          // 环格中心半径
export const CELL = 0.34;            // 环格边长
export const TILE_H = 0.085;         // 格厚度（V9：略厚 + 倒角，读得出手工实木感）
export const TILE_BOTTOM = 0.02;
export const TILE_TOP = TILE_BOTTOM + TILE_H;   // 0.105
export const TILE_BEVEL = 0.10;      // 倒角比例（相对格宽，V9 新增）
export const HOME_STEPS = 5;
export const HOME_R0 = 2.46;
export const HOME_PITCH = 0.40;
export const HOME_CELL = 0.30;
export const HANGAR_R = 1.95;
export const PLANE_HOVER = 0.095;
export const PLANE_Y = TILE_TOP + PLANE_HOVER;
export const DIE_SIZE = 0.34;
export const STAGE_RISE = 1.50;      // 目标格升起高度
export const STAGE_AZIM = 24;        // 45° 舞台方位角
export const STAGE_PLATE = 0.42;
export const STAGE_BEAR = { x: -0.072, z: -0.100, s: 0.84 };
export const STAGE_TEXT = { u: 0.58, v: 0.70 };
export const OVERVIEW_FILL = 1.015;

/* --- 桌面 / 垫布（V9 重做：胡桃木小桌板 + 绒布垫，桌沿进入画面读作机舱小桌） ---
 * 桌板向观众方向加长（z 偏移），让近端桌沿在 320–430 都落在画面外/画面最底，
 * 避免俯瞰时下方出现一条黑色地板空带。 */
export const TABLE = { w: 11.4, d: 12.6, h: 0.20, r: 0.55, z: 1.8 };
export const FELT = { w: 9.6, d: 9.4, r: 0.30, z: 0.6 };
/* 舱壁 / 舷窗 / 灯：世界坐标（overview 上方 15–25% 画面读作机舱） */
export const CABIN = {
  wallZ: -4.66, wallW: 30, wallH: 12, wallBottom: -0.34,
  window: { x: 1.02, y: 0.78, w: 2.15, h: 1.18, z: -4.60 },
  shade: 0.34,
  lamp: { x: -2.10, y: 0.88, z: -4.30 },
  floorY: -0.34
};

/* --- 中心终点（立体 hub） --- */
export const HUB = { r: 0.44, h: 0.10, ringR: 0.60, starR: 0.20 };

/* --- 与 app/src/engine/flight-board.js 同源（只读） --- */
export const COLORS = ['red', 'yellow', 'blue', 'green'];
export const TAKEOFF = { red: 0, yellow: 13, blue: 26, green: 39 };
export const HOME_ENTRY = { red: 50, yellow: 11, blue: 24, green: 37 };
export const APRON_DEG = { red: 31, yellow: 121, blue: 211, green: 301 };
export const FATE_CELLS = [5, 29];
export const CELL_KIND = {
  1: 'truth', 2: 'truth', 5: 'truth', 9: 'truth', 12: 'truth',
  16: 'truth', 17: 'truth', 23: 'truth', 25: 'truth', 28: 'truth',
  31: 'truth', 38: 'truth', 42: 'truth', 43: 'truth', 51: 'truth',
  4: 'dare', 6: 'dare', 15: 'dare', 18: 'dare', 19: 'dare',
  22: 'dare', 27: 'dare', 30: 'dare', 32: 'dare', 35: 'dare',
  41: 'dare', 44: 'dare', 45: 'dare', 48: 'dare', 49: 'dare',
  3: 'touch', 8: 'touch', 21: 'touch', 29: 'touch', 34: 'touch', 47: 'touch',
  10: 'thermo', 36: 'thermo',
  14: 'wheel', 40: 'wheel'
};
FATE_CELLS.forEach((n) => { CELL_KIND[n] = 'fate'; });

/* 四色 = 玩家身份色。V9 去掉荧光粉彩，改成低饱和珐琅色（仍可一眼区分）。 */
export const HEX = { red: 0xC9544A, yellow: 0xD7A24A, blue: 0x5E7FB0, green: 0x5C8F72 };
export const HEX_SOFT = { red: '#8E3A34', yellow: '#9A7332', blue: '#3F587C', green: '#3F6551' };
export const COLOR_NAME = { red: '红', yellow: '黄', blue: '蓝', green: '绿' };

/* 图标化后仍保留单字，用于图例/舞台/降级文案（环格不再印大号中文）。 */
export const GLYPH = {
  takeoff: '起', fly: '飞', forbid: '停', fate: '缘', entry: '归',
  truth: '真', dare: '敢', touch: '触', thermo: '温', wheel: '轮', ring: '·'
};
export const KIND_LABEL = {
  takeoff: '起飞', fly: '飞点', forbid: '禁跳', fate: '命运', entry: '进航',
  truth: '真心话', dare: '敢做', touch: '触碰', thermo: '温度计', wheel: '转盘', ring: '普通'
};

/* --- 函数 --- */
export const mod = (n) => ((n % RING_N) + RING_N) % RING_N;
export const colorOfRing = (n) => COLORS[((n % 4) + 4) % 4];
export const isTakeoff = (n) => TAKEOFF[colorOfRing(n)] === n;
export const isFly = (n) => mod(TAKEOFF[colorOfRing(n)] + 20) === n;
export const isForbidden = (n) => mod(TAKEOFF[colorOfRing(n)] + 48) === n;
export const entryOf = (n) => COLORS.some((c) => HOME_ENTRY[c] === n);
export function kindOf(n) {
  if (isTakeoff(n)) return 'takeoff';
  if (isFly(n)) return 'fly';
  if (isForbidden(n)) return 'forbid';
  if (FATE_CELLS.indexOf(n) >= 0) return 'fate';
  if (entryOf(n)) return 'entry';
  return CELL_KIND[n] || 'ring';
}
export const ringPhi = (n) => (n * TAU) / RING_N;

/* --- 数学 / 缓动 --- */
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);
export const smoothstep = (a, b, t) => { const x = clamp((t - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };

export function shortestDelta(from, to) {
  return ((to - from + Math.PI) % TAU + TAU) % TAU - Math.PI;
}

/* --- 图集槽位（8x8 @64px）；槽位与 P0 原型一致 --- */
export const KINDS = ['takeoff', 'fly', 'forbid', 'fate', 'entry', 'truth', 'dare', 'touch', 'thermo', 'wheel', 'ring'];
export const SLOT_DARK = 0;
export const SLOT_HOME = 45;
export const SLOT_HANGAR = 49;
export const SLOT_BLANK = 53;
export const ATLAS_N = 8;
export const ATLAS_PX = 64;
export const slotOf = (kind, color) => 1 + Math.max(0, KINDS.indexOf(kind)) * 4 + Math.max(0, COLORS.indexOf(color));
export const uvOfSlot = (slot) => {
  const col = slot % ATLAS_N;
  const row = Math.floor(slot / ATLAS_N);
  return [col / ATLAS_N, 1 - (row + 1) / ATLAS_N, (col + 1) / ATLAS_N, 1 - row / ATLAS_N];
};

/* --- 骰子：BoxGeometry 面顺序 +X -X +Y -Y +Z -Z --- */
export const DIE_FACES = [3, 4, 1, 6, 2, 5];
/* V9.3：摇骰落点移到棋盘中心附近（黄/蓝进航格之间的空盘面，避开中心星徽与格块）。
 * y = 圆盘上表面 + 半边长；骰子平躺，顶面即引擎点数。
 * V9.4：再往中心挪。45° 空楔形上取「不压 hub/星徽/进航格/机库」的最近合法点：
 *   建议 (0.58,0.58) r=0.820 在扣骰子半对角 0.2404 后，hub 黄铜基环外沿 0.63 的 clearance
 *   = -0.050（会压环），蓝进航内格仅 +0.001；故取 (0.63,0.63) r=0.891：
 *   hub 基环 +0.021、蓝进航内格 +0.020、中心鼓 +0.141、黄机库 +0.210（V9.3 为 r=0.993）。 */
export const DIE_FLOOR = 0.038;                     // 棋盘圆盘上表面（CylinderGeometry top）
export const DIE_HOME_POS = { x: 0.63, y: DIE_FLOOR + DIE_SIZE / 2, z: 0.63 };

/* --- V9 材质规范（冻结单 §1.3 的 roughness/metalness 硬口径） --- */
export const MAT = {
  walnut: { roughness: 0.55, metalness: 0.05, normalScale: 0.65, envMapIntensity: 0.55 },
  brass: { roughness: 0.32, metalness: 0.85, envMapIntensity: 1.25 },
  felt: { roughness: 0.95, metalness: 0.00, normalScale: 1.15, envMapIntensity: 0.30 },
  paper: { roughness: 0.80, metalness: 0.00, normalScale: 0.45, envMapIntensity: 0.45 },
  enamel: { roughness: 0.42, metalness: 0.06, envMapIntensity: 0.80 },
  glass: { roughness: 0.12, metalness: 0.00, envMapIntensity: 1.40 }
};

/* --- V9 镜头（scene 内部实现，不改 camera.js/director.js） ---
 * director 的 overview 目标仍是 fov 42 / elev 58（其口径冻结）；
 * scene 在渲染前做「长焦重构」：fov 42→38 + 相机沿视线后退等效距离（取景几乎不变），
 * 并在俯瞰时把机位压到 50°，让画面上方露出舱壁/舷窗。 */
export const CINE = {
  fov: 38,
  elev: 50,
  overviewElevMin: 56,
  lensK: Math.tan(21 * Math.PI / 180) / Math.tan(19 * Math.PI / 180),
  drift: { x: 0.055, y: 0.038, yaw: 0.0011, fov: 0.10 }
};

/* --- 画质档：high / medium / low（Bloom/DOF 轻量层只在 high） ---
 * V9.1：props = 桌面小物/机舱细节；steam = 咖啡蒸汽/蜡烛火焰；motes = 舷窗光尘。
 * 低画质只关粒子/额外点光/阴影/Bloom；小物 **保留** —— 主桌实机在慢设备上会自适应降档，
 * 若低档连小物一起关掉，用户看到的又回到「画面太干净」（V9.1 follow-up 实机截图即此因）。 */
export const QUALITY = {
  /* V9.2：2K 档按设备原生 DPR（上限 3）渲染；标准 2x、流畅 1.5x。
   * 之前手机一律 medium(1.5x)，在 2K/3x 屏上会被浏览器放大，看起来像像素级。 */
  high: { dpr: 3.0, shadow: 2048, dust: 110, glow: true, grain: true, env: true, bloom: true, props: true, steam: true, motes: true },
  medium: { dpr: 2.0, shadow: 1536, dust: 72, glow: true, grain: false, env: true, bloom: false, props: true, steam: true, motes: false },
  low: { dpr: 1.5, shadow: 0, dust: 28, glow: false, grain: false, env: false, bloom: false, props: true, steam: false, motes: false }
};

/* --- V9.1 桌面小物布局（世界坐标：x 右、z 朝向观众；y=0 为桌布面） ---
 * 约束：都落在棋盘圆盘（R=3.30）之外；后排（z<-2.4）从棋盘上沿露出（320/390/430 都可见），
 * 前排收到 z≈3.6–4.3：390/430 落在棋盘下沿与底部行动区之间的可见带，并避开右下缩放按钮
 * （host 右下 44×3 竖列）。数值由真实主桌 shots/v9.1-cinematic/table_check.mjs 实测确定。 */
export const PROPS = {
  cup: { x: -1.72, z: 4.28, s: 2.0 },        /* V9 已有的珐琅咖啡杯（保留，加蒸汽） */
  cup2: { x: -2.42, z: 4.30, s: 1.25 },      /* 第二只小茶杯：两个人，收进可见带 */
  newspaper: { x: -2.65, z: 4.08, rot: 0.50 },
  notebook: { x: -0.10, z: 4.15, rot: 0.10 },/* 摊开的笔记本 + 钢笔 + 折叠眼镜 */
  glasses: { x: 0.74, z: 4.36, rot: -0.5 },
  tickets: { x: -1.05, z: 4.42, rot: 0.22 },
  cards: { x: 1.90, z: 4.35, rot: -0.16 },
  keys: { x: 0.55, z: 4.15, rot: 0.4 },
  tray: { x: 1.62, z: 3.62 },                /* 骰子托盘：在真骰子 DIE_HOME 正下方，避开缩放按钮 */
  blanket: { x: 1.15, z: 4.35, rot: 0.12 },
  speaker: { x: -2.72, z: 2.58, rot: 0.52 },
  cassette: { x: -2.52, z: 3.44, rot: -0.26 },
  lamp: { x: -2.55, z: -3.20 },              /* 铜质小台灯（点光 + 灯罩自发光） */
  candle: { x: -1.30, z: -3.85 },            /* 黄铜烛台 + 蜡烛 */
  plant: { x: 2.78, z: -3.18 },              /* 小绿植 */
  books: { x: 3.02, z: -2.52, rot: 0.14 },   /* 书 + 杂志 + 明信片 + 眼镜 */
  photo: { x: -3.18, z: -2.28, rot: 0.46 }   /* 黄铜相框（立式） */
};

/* --- V9.1 机舱细节（顶部行李舱/灯带/窗帘/座椅剪影） --- */
export const CABIN_FX = {
  bin: { y: 1.98, h: 0.42, d: 0.46, w: 22, inset: 0.30 },
  strip: { y: 1.72, h: 0.030, d: 0.07, w: 21.4, color: 0xFFD2A0 },
  curtain: { w: 0.42, h: 1.46, off: 0.15 },
  seat: { x: 4.55, z: -2.20, w: 0.62, h: 0.94, d: 0.36 },
  motes: 26
};

/* --- 主题：材质 / 灯光 / 背景 / 小熊服装 ---
 * V9 三主题都是「午夜机舱」的三个晚上，不再是粉彩/霓虹：
 *   cloud = 云海夜航（默认）  star = 星轨夜航  paper = 纸月夜航
 * 字段：
 *   light   = 三灯（key 暖阅读灯 / rim 舷窗冷光 / fill 低补光）+ 环境 + 曝光
 *   table   = 桌板/垫布/棋盘木色 tint（贴图是程序化中性木纹，靠 tint 分主题）
 *   window  = 舷窗景观配色（程序化 canvas，无外链 HDR/图片）
 *   hub/brass/felt/overlay/bear = 各主题材质口径
 */
export const THEMES = {
  cloud: {
    id: 'cloud', label: '云海机舱',
    exposure: 1.28,
    ink: 0x05080D, fog: 0x0A1620, fogDensity: 0.0155,
    light: {
      hemiSky: 0x6F90B4, hemiGround: 0x14100C, hemiInt: 0.58,
      key: 0xFFC080, keyInt: 4.1,
      rim: 0x8FB6E8, rimInt: 1.45,
      fill: 0xAEC2D6, fillInt: 0.46,
      lamp: 0xFFB066, lampInt: 18, lampDist: 11,
      env: 0.72
    },
    tableTint: 0xDCD2C6, feltTint: 0x4E6B78, boardTint: 0xD3C6B5,
    brass: 0xB08A57, brassRough: 0.30,
    felt: { base: '#3E5A64', base2: '#22343C', weave: '#6F8E96' },
    overlay: { vig: 'rgba(2,5,9,.92)', pool: 'rgba(255,178,104,.17)', rim: 'rgba(232,190,128,.26)' },
    hub: { top: 0xE0B26C, side: 0x5A3C22, star: 0xF6DFB6, glow: 0xFFC070 },
    window: {
      top: '#071422', mid: '#173E58', low: '#6E93A6', cloud: '#C8DCE6',
      moon: '#F6EAD2', moonX: 0.68, moonY: 0.26, moonR: 0.048, stars: 0.28, glare: 0.34
    },
    wallTint: 0x2E4257, floor: 0x0A0E12,
    dust: 0xFFD9A8, dustOpacity: 0.55,
    heatCool: 0x8FB6E8, heatWarm: 0xFFA860,
    bear: { fur: 0x9C7B5A, furDark: 0x7A5C42, hat: 0x2B3C58, band: 0xD2A769, scarf: 0x9A4242 }
  },
  star: {
    id: 'star', label: '星轨夜航',
    exposure: 1.16,
    ink: 0x04050B, fog: 0x070A16, fogDensity: 0.0145,
    light: {
      hemiSky: 0x6B74B4, hemiGround: 0x100D14, hemiInt: 0.52,
      key: 0xFFBE8A, keyInt: 3.8,
      rim: 0x93A8FF, rimInt: 1.65,
      fill: 0x9FA8D8, fillInt: 0.42,
      lamp: 0xFFAE73, lampInt: 16, lampDist: 10,
      env: 0.66
    },
    tableTint: 0xD2C8DE, feltTint: 0x3F4068, boardTint: 0xC4B2CB,
    brass: 0x9E8FA8, brassRough: 0.26,
    felt: { base: '#333A5A', base2: '#1B1E33', weave: '#5D6690' },
    overlay: { vig: 'rgba(1,2,7,.93)', pool: 'rgba(255,174,115,.15)', rim: 'rgba(214,196,150,.24)' },
    hub: { top: 0xD9B47C, side: 0x4A3550, star: 0xF4E3C6, glow: 0xFFB87A },
    window: {
      top: '#03030C', mid: '#0E1230', low: '#2A3560', cloud: '#5A6690',
      moon: '#F0E9FF', moonX: 0.70, moonY: 0.24, moonR: 0.05, stars: 1, glare: 0.22
    },
    wallTint: 0x262E48, floor: 0x07070C,
    dust: 0xDCD6FF, dustOpacity: 0.45,
    heatCool: 0x8FA8FF, heatWarm: 0xFFA0C0,
    bear: { fur: 0x8E7C9C, furDark: 0x6E5F7C, hat: 0x332D57, band: 0xC7D0EA, scarf: 0x8C649C }
  },
  paper: {
    id: 'paper', label: '纸月夜航',
    exposure: 1.26,
    ink: 0x0A0806, fog: 0x161009, fogDensity: 0.016,
    light: {
      hemiSky: 0xC8A98A, hemiGround: 0x1C140C, hemiInt: 0.62,
      key: 0xFFCB94, keyInt: 4.3,
      rim: 0xB8A894, rimInt: 1.05,
      fill: 0xD8C0A2, fillInt: 0.52,
      lamp: 0xFFB878, lampInt: 19, lampDist: 11,
      env: 0.72
    },
    tableTint: 0xF3DEBD, feltTint: 0x7A5A34, boardTint: 0xF0D2A2,
    brass: 0xC79C63, brassRough: 0.38,
    felt: { base: '#6A5334', base2: '#3C2C19', weave: '#9A7A4C' },
    overlay: { vig: 'rgba(8,5,2,.92)', pool: 'rgba(255,178,104,.22)', rim: 'rgba(240,206,150,.30)' },
    hub: { top: 0xE8BA72, side: 0x5C3A1E, star: 0xFFE9C0, glow: 0xFFBE72 },
    window: {
      top: '#2A1A10', mid: '#6E4326', low: '#D0A070', cloud: '#F0D2A8',
      moon: '#FFE6BE', moonX: 0.62, moonY: 0.30, moonR: 0.058, stars: 0.10, glare: 0.42
    },
    wallTint: 0x3A2C1E, floor: 0x0B0805,
    dust: 0xFFD3A0, dustOpacity: 0.5,
    heatCool: 0xC9A884, heatWarm: 0xFF9A4D,
    bear: { fur: 0x9E7C58, furDark: 0x7E6042, hat: 0x74543A, band: 0xF0D8AE, scarf: 0x9E4438 }
  }
};
export function themeOf(id) {
  return THEMES[id] || THEMES.cloud;
}

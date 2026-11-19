/* ==========================================================================
 * V8 · 真 3D 主桌 · 常量与拓扑（生产模块，ESM）
 * 拓扑只读自 app/src/engine/flight-board.js（同源，不修改引擎）。
 * 这里只做渲染侧的几何/纹理/主题常量，不含任何引擎规则。
 * ========================================================================== */

export const VERSION = 'v8-prod-3d-1';
export const DEG = Math.PI / 180;
export const TAU = Math.PI * 2;

/* --- 棋盘几何（P0 原型同参数，已验证手感） --- */
export const RING_N = 52;
export const RING_R = 3.06;          // 环格中心半径
export const CELL = 0.34;            // 环格边长
export const TILE_H = 0.075;         // 格厚度
export const TILE_BOTTOM = 0.02;
export const TILE_TOP = TILE_BOTTOM + TILE_H;   // 0.095
export const HOME_STEPS = 5;
export const HOME_R0 = 2.46;
export const HOME_PITCH = 0.40;
export const HOME_CELL = 0.30;
export const HANGAR_R = 1.95;
export const PLANE_HOVER = 0.095;
export const PLANE_Y = TILE_TOP + PLANE_HOVER;  // 飞机中心高（0.19）
export const DIE_SIZE = 0.34;
export const STAGE_RISE = 1.50;      // 目标格升起高度
export const STAGE_AZIM = 24;        // 45° 舞台方位角

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

export const HEX = { red: 0xFF7A6B, yellow: 0xFFC857, blue: 0x7FA8FF, green: 0x63DDA0 };
export const HEX_SOFT = { red: '#FFC6BA', yellow: '#FFE3AC', blue: '#C9D5FF', green: '#BFF0D8' };
export const COLOR_NAME = { red: '红', yellow: '黄', blue: '蓝', green: '绿' };

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

/* 角度差取最短（-PI..PI） */
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

/* --- 主题：材质 / 灯光 / 背景 / 小熊服装 --- */
export const THEMES = {
  cloud: {
    id: 'cloud', label: '云海机舱', sky: 'cloud',
    ink: 0x0A1622, fog: 0x0C2334, fogDensity: 0.016,
    hemiSky: 0xBED8FF, hemiGround: 0x2A2038, hemiInt: 0.9,
    sunColor: 0xFFF1DC, sunInt: 1.3,
    tray: 0x3A2A24, mat: 0x1E4A63, disc: 0x9FB6D8, discSide: 0x141C28,
    cloud: true, cloudOpacity: 0.42, cloudTint: 0xFFFFFF, stars: false,
    heatCool: 0x9FC7FF, heatWarm: 0xFFB060,
    bear: { fur: 0x9A6F4B, furDark: 0x7A543A, hat: 0x2C3E66, band: 0xE8B65C, scarf: 0xD8564C }
  },
  star: {
    id: 'star', label: '星轨夜航', sky: 'star',
    ink: 0x05030C, fog: 0x080515, fogDensity: 0.012,
    hemiSky: 0x9C90E8, hemiGround: 0x1A1030, hemiInt: 0.72,
    sunColor: 0xE6DDFF, sunInt: 1.05,
    tray: 0x1E1832, mat: 0x241C42, disc: 0x8E86C8, discSide: 0x0F0A1C,
    cloud: false, cloudOpacity: 0.0, cloudTint: 0xC8C0FF, stars: true,
    heatCool: 0x8FA8FF, heatWarm: 0xFF9FC8,
    bear: { fur: 0x8E7196, furDark: 0x6B527A, hat: 0x3B2B5C, band: 0xC9D5FF, scarf: 0xB9A7E8 }
  },
  paper: {
    id: 'paper', label: '纸雕童话', sky: 'paper',
    ink: 0x120D0A, fog: 0x1A1109, fogDensity: 0.014,
    hemiSky: 0xFFE0B8, hemiGround: 0x3A2A1C, hemiInt: 0.95,
    sunColor: 0xFFE7C4, sunInt: 1.2,
    tray: 0x4A3428, mat: 0x6B4A2E, disc: 0xBFAE94, discSide: 0x2A1C12,
    cloud: true, cloudOpacity: 0.22, cloudTint: 0xFFE2B8, stars: false,
    heatCool: 0xC9B08F, heatWarm: 0xFF9A4D,
    bear: { fur: 0x9C7A55, furDark: 0x7C5C3C, hat: 0x8A6A4A, band: 0xF0D9B5, scarf: 0xA6483E }
  }
};
export function themeOf(id) {
  return THEMES[id] || THEMES.cloud;
}

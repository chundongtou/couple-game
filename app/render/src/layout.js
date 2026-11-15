/* 视觉坐标。规则落点只播引擎事件，这里不重算跳和飞。
 * three 精确版本 0.180.0，与 app3d/package-lock.json 的 resolved 一致。
 * 不引用 app3d / 3d 作为运行时。
 */

export const COLORS = {
  red: 0xd64545,
  yellow: 0xe6b325,
  blue: 0x3a78d8,
  green: 0x2fa36a
};

const RING = [
  [1.3, 7.3], [1.3, 6.1], [1.3, 4.9], [1.3, 3.7], [1.3, 2.5],
  [2.5, 1.3], [3.7, 1.3], [4.9, 1.3], [6.1, 1.3], [7.3, 1.3],
  [8.6, 1.3], [8.6, 0], [8.6, -1.3],
  [7.3, -1.3], [6.1, -1.3], [4.9, -1.3], [3.7, -1.3], [2.5, -1.3],
  [1.3, -2.5], [1.3, -3.7], [1.3, -4.9], [1.3, -6.1], [1.3, -7.3],
  [1.3, -8.6], [0, -8.6], [-1.3, -8.6],
  [-1.3, -7.3], [-1.3, -6.1], [-1.3, -4.9], [-1.3, -3.7], [-1.3, -2.5],
  [-2.5, -1.3], [-3.7, -1.3], [-4.9, -1.3], [-6.1, -1.3], [-7.3, -1.3],
  [-8.6, -1.3], [-8.6, 0], [-8.6, 1.3],
  [-7.3, 1.3], [-6.1, 1.3], [-4.9, 1.3], [-3.7, 1.3], [-2.5, 1.3],
  [-1.3, 2.5], [-1.3, 3.7], [-1.3, 4.9], [-1.3, 6.1], [-1.3, 7.3],
  [-1.3, 8.6], [0, 8.6], [1.3, 8.6]
];

const HOME = {
  red: [[0, 7.3], [0, 6.1], [0, 4.9], [0, 3.7], [0, 2.5], [0, 0]],
  yellow: [[7.3, 0], [6.1, 0], [4.9, 0], [3.7, 0], [2.5, 0], [0, 0]],
  blue: [[0, -7.3], [0, -6.1], [0, -4.9], [0, -3.7], [0, -2.5], [0, 0]],
  green: [[-7.3, 0], [-6.1, 0], [-4.9, 0], [-3.7, 0], [-2.5, 0], [0, 0]]
};

const BASE = {
  red: [4.7, 5.0],
  yellow: [5.0, -4.7],
  blue: [-4.7, -5.0],
  green: [-5.0, 4.7]
};

export function squareXZ(id) {
  if (!id) return [0, 0];
  const ring = /^ring:(\d+)$/.exec(id);
  if (ring) return RING[Number(ring[1])] || [0, 0];
  const home = /^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(id);
  if (home) {
    const path = HOME[home[1]];
    if (home[2] == null) return path[5];
    return path[Number(home[2])] || path[0];
  }
  const hangar = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(id);
  if (hangar) {
    const c = BASE[hangar[1]];
    const slot = Number(hangar[2]);
    const ox = (slot % 2) * 1.15 - 0.55;
    const oz = Math.floor(slot / 2) * 1.05 - 0.45;
    return [c[0] + ox, c[1] + oz];
  }
  return [0, 0];
}

export function hangarCenter(color) {
  return BASE[color] || [0, 0];
}

export { RING, HOME, BASE };

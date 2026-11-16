/* 视觉坐标：把锁死的 ring:0..51 排成圆环。
 * 不重算跳、飞和进航格号。航线从各色进航格沿径向走入圆心。
 * 红起飞在近侧，四色机坪在环外，彼此隔开四分之一圈。
 */

export const COLORS = {
  red: 0xd64545,
  yellow: 0xe6b325,
  blue: 0x3a78d8,
  green: 0x2fa36a
};

export const RING_RADIUS = 8.15;
const HOME_RADIUS = [6.25, 4.85, 3.5, 2.2, 1.02];
const HANGAR_RADIUS = 10.15;

const TAKEOFF_N = { red: 0, yellow: 13, blue: 26, green: 39 };
const ENTRY_N = { red: 50, yellow: 11, blue: 24, green: 37 };

function polar(n, radius) {
  const theta = (n / 52) * Math.PI * 2;
  return [Math.sin(theta) * radius, Math.cos(theta) * radius];
}

export function squareXZ(id) {
  if (!id) return [0, 0];
  const ring = /^ring:(\d+)$/.exec(id);
  if (ring) return polar(Number(ring[1]), RING_RADIUS);
  const home = /^home:(red|yellow|blue|green):(?:(\d+)|goal)$/.exec(id);
  if (home) {
    if (home[2] == null) return [0, 0];
    return polar(ENTRY_N[home[1]], HOME_RADIUS[Number(home[2])] || HOME_RADIUS[0]);
  }
  const hangar = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(id);
  if (hangar) {
    const n = TAKEOFF_N[hangar[1]];
    const center = polar(n, HANGAR_RADIUS);
    const theta = (n / 52) * Math.PI * 2;
    const slot = Number(hangar[2]);
    const col = (slot % 2) - 0.5;
    const row = Math.floor(slot / 2) - 0.5;
    const tx = Math.cos(theta);
    const tz = -Math.sin(theta);
    const rx = Math.sin(theta);
    const rz = Math.cos(theta);
    return [
      center[0] + tx * col * 0.78 + rx * row * 0.58,
      center[1] + tz * col * 0.78 + rz * row * 0.58
    ];
  }
  return [0, 0];
}

export function hangarCenter(color) {
  return polar(TAKEOFF_N[color] || 0, HANGAR_RADIUS);
}

export function ringAngle(n) {
  return (n / 52) * Math.PI * 2;
}

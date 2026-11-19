/* ==========================================================================
 * V8 · 真 3D 主桌 · 引擎状态 → 3D 坐标 / 事件 → 运动段
 * 只读 App.Flight 的 squareId 约定：hangar:color:slot / ring:n / home:color:step / home:color:goal
 * 不改引擎、不重算规则；跳/飞/进航的目标只读事件里的 path/from/to。
 * ========================================================================== */
import {
  RING_R, RING_N, PLANE_Y, TILE_TOP, TILE_BOTTOM, HOME_R0, HOME_PITCH, HANGAR_R,
  HOME_ENTRY, APRON_DEG, DEG, TAU, PLANE_HOVER, mod, ringPhi, colorOfRing, kindOf,
  clamp, shortestDelta
} from './constants.js';

export function parseSquare(id) {
  const hangar = /^hangar:(red|yellow|blue|green):(\d+)$/.exec(id || '');
  if (hangar) return { type: 'hangar', color: hangar[1], slot: Number(hangar[2]) };
  const ring = /^ring:(\d+)$/.exec(id || '');
  if (ring) return { type: 'ring', n: Number(ring[1]) };
  const goal = /^home:(red|yellow|blue|green):goal$/.exec(id || '');
  if (goal) return { type: 'goal', color: goal[1] };
  const home = /^home:(red|yellow|blue|green):(\d+)$/.exec(id || '');
  if (home) return { type: 'home', color: home[1], step: Number(home[2]) };
  return null;
}

export function kindColorOf(id) {
  const p = parseSquare(id);
  if (!p) return { kind: 'ring', color: 'red' };
  if (p.type === 'ring') return { kind: kindOf(p.n), color: colorOfRing(p.n) };
  if (p.type === 'home') return { kind: 'entry', color: p.color };
  if (p.type === 'goal') return { kind: 'goal', color: p.color };
  return { kind: 'hangar', color: p.color };
}

/* 该格在板坐标系里的「本格中心」（不含叠机偏移） */
export function localOfSquare(id) {
  const p = parseSquare(id) || { type: 'ring', n: 0 };
  if (p.type === 'ring') {
    const phi = ringPhi(p.n);
    return { x: RING_R * Math.sin(phi), y: PLANE_Y, z: -RING_R * Math.cos(phi), yaw: -Math.PI / 2 - phi, parsed: p };
  }
  if (p.type === 'home') {
    const phi = ringPhi(HOME_ENTRY[p.color]);
    const r = HOME_R0 - p.step * HOME_PITCH;
    return { x: r * Math.sin(phi), y: TILE_TOP - 0.006 + PLANE_HOVER, z: -r * Math.cos(phi), yaw: Math.PI - phi, parsed: p };
  }
  if (p.type === 'goal') {
    return { x: 0, y: PLANE_Y + 0.045, z: 0, yaw: Math.PI, parsed: p };
  }
  /* hangar */
  const a = APRON_DEG[p.color] * DEG;
  const dx = p.slot % 2 === 0 ? -0.2 : 0.2;
  const dz = p.slot < 2 ? -0.2 : 0.2;
  return {
    x: HANGAR_R * Math.sin(a) + (dx * Math.cos(a) + dz * Math.sin(a)),
    y: TILE_BOTTOM + 0.05 + PLANE_HOVER,
    z: -HANGAR_R * Math.cos(a) + (-dx * Math.sin(a) + dz * Math.cos(a)),
    yaw: -a - Math.PI,
    parsed: p
  };
}

/* 同格多机：小范围错开，避免完全重叠（goal 在中心绕一圈） */
export function localOfPieceSquare(id, index, count) {
  const base = localOfSquare(id);
  const n = Math.max(1, count || 1);
  const i = clamp(index || 0, 0, n - 1);
  if (n <= 1) return base;
  if (base.parsed.type === 'goal') {
    const angle = (i / n) * TAU + 0.6;
    return {
      ...base,
      x: Math.cos(angle) * 0.16,
      z: Math.sin(angle) * 0.16,
      yaw: Math.PI + angle
    };
  }
  if (base.parsed.type === 'hangar') return base;
  const angle = (i / n) * TAU + 0.7;
  const rad = base.parsed.type === 'home' ? 0.052 : 0.062;
  return { ...base, x: base.x + Math.cos(angle) * rad, z: base.z + Math.sin(angle) * rad };
}

/* 行进方向（板坐标 xz 单位向量）：环格=切线；航线=向心；机坪=向外；终点=无 */
export function dirOfSquare(id) {
  const p = parseSquare(id);
  if (!p) return { x: 0, z: 0 };
  if (p.type === 'ring') {
    const phi = ringPhi(p.n);
    return { x: Math.cos(phi), z: Math.sin(phi) };
  }
  if (p.type === 'home') {
    const phi = ringPhi(HOME_ENTRY[p.color]);
    return { x: -Math.sin(phi), z: Math.cos(phi) };
  }
  if (p.type === 'hangar') {
    const a = APRON_DEG[p.color] * DEG;
    return { x: Math.sin(a), z: -Math.cos(a) };
  }
  return { x: 0, z: 0 };
}

/* 求板组位姿：把局部点 L 送到世界原点，且局部行进方向 d 对齐屏幕前方 -Z */
export function poseForLocal(x, z, dirX, dirZ) {
  let theta = 0;
  if (Math.abs(dirX) + Math.abs(dirZ) > 1e-6) {
    theta = Math.atan2(dirX, -dirZ);
  }
  const ct = Math.cos(theta), st = Math.sin(theta);
  const wx = x * ct + z * st;
  const wz = -x * st + z * ct;
  return { theta, tx: -wx, tz: -wz };
}

export function poseForSquare(id) {
  const base = localOfSquare(id);
  const d = dirOfSquare(id);
  return poseForLocal(base.x, base.z, d.x, d.z);
}

export function interpPose(from, to, t) {
  return {
    theta: from.theta + shortestDelta(from.theta, to.theta) * t,
    tx: from.tx + (to.tx - from.tx) * t,
    tz: from.tz + (to.tz - from.tz) * t
  };
}

export const MOTION_TYPES = { takeoff: 1, move: 1, jump: 1, fly: 1 };

export function isMotionEvent(ev) {
  return !!(ev && MOTION_TYPES[ev.type]);
}

/* 事件的起点格（用于 focus）：takeoff=path[0]；move=path[0] 的前一格；jump/fly=from */
export function motionOrigin(event) {
  if (!event) return null;
  if (event.type === 'takeoff') {
    return (event.path && event.path[0]) || null;
  }
  if (event.type === 'move') {
    const first = event.path && event.path[0];
    const p = parseSquare(first);
    if (!p) return null;
    if (p.type === 'ring') return 'ring:' + mod(p.n - 1);
    if (p.type === 'home') {
      if (p.step > 0) return 'home:' + p.color + ':' + (p.step - 1);
      return 'ring:' + HOME_ENTRY[p.color];
    }
    if (p.type === 'goal') return 'home:' + p.color + ':4';
    return null;
  }
  if (event.type === 'jump' || event.type === 'fly') return event.from || null;
  return null;
}

export function motionDest(event) {
  if (!event) return null;
  if (event.type === 'takeoff') {
    const path = event.path || [];
    return path[path.length - 1] || null;
  }
  if (event.type === 'move') {
    const path = event.path || [];
    return path[path.length - 1] || null;
  }
  return event.to || null;
}

/* 这批事件里，被移动棋子最终会停在哪一格（含进航结算后的 move） */
export function finalSquareOfMotions(events) {
  let at = null;
  for (const ev of events || []) {
    if (!isMotionEvent(ev)) continue;
    at = motionDest(ev) || at;
  }
  return at;
}

export function colorOfPiece(piece, state) {
  if (piece && piece.color) return piece.color;
  const id = piece && piece.id ? String(piece.id) : '';
  const pid = id.charAt(0);
  if (state && state.colors && state.colors[pid]) return state.colors[pid];
  return pid === 'b' ? 'yellow' : 'red';
}

/* 棋子在某格上做姿态时的局部坐标（含同格错开） */
export function pieceLocals(pieces) {
  const groups = {};
  for (const p of pieces || []) groups[p.squareId] = (groups[p.squareId] || 0) + 1;
  const seen = {};
  const out = {};
  for (const p of pieces || []) {
    const i = seen[p.squareId] || 0;
    seen[p.squareId] = i + 1;
    out[p.id] = localOfPieceSquare(p.squareId, i, groups[p.squareId]);
  }
  return out;
}

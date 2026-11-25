/* V9.3 骰子轻量刚体调参（Node，无依赖）
 * 目标：出手点/初速/角速度 → 2–3 次不规则弹跳+滑动 → 停在 DIE_HOME 附近空位。
 * 这里只做数值搜索；最终参数会原样移植到 app/src/view/board3d/scene.js。
 */
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const FLOOR = 0.038;          // 棋盘圆盘上表面
const HALF = 0.17;            // 骰子半边长
const G = 8.6;
const HOME_ENTRY = { red: 50, yellow: 11, blue: 24, green: 37 };
const lanePhi = Object.values(HOME_ENTRY).map((n) => (n * TAU) / 52);
const HUB_R = 0.51, HANGAR_R = 1.95, HANGAR_HALF = 0.47;
const BOARD_R = 3.30, BOUND_R = 2.78;
const DIE_HOME = { x: 0.98 * Math.sin(121 * DEG), z: -0.98 * Math.cos(121 * DEG) };

// ---- quat helpers (x,y,z,w) ----
const qMul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
];
const qNorm = (q) => { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; };
const qAxis = (ax, ay, az, ang) => { const s = Math.sin(ang / 2); return qNorm([ax * s, ay * s, az * s, Math.cos(ang / 2)]); };
function qMatrix(q) {
  const [x, y, z, w] = q;
  const xx = x * x, yy = y * y, zz = z * z, xy = x * y, xz = x * z, yz = y * z, wx = w * x, wy = w * y, wz = w * z;
  return [
    1 - 2 * (yy + zz), 2 * (xy - wz), 2 * (xz + wy),
    2 * (xy + wz), 1 - 2 * (xx + zz), 2 * (yz - wx),
    2 * (xz - wy), 2 * (yz + wx), 1 - 2 * (xx + yy)
  ]; // column-major like three
}
function supportExtent(q) {
  const m = qMatrix(q);
  // world-Y row = m[1], m[4], m[7] (column-major 3x3)
  return HALF * (Math.abs(m[1]) + Math.abs(m[4]) + Math.abs(m[7]));
}
const rnd32 = (seed) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

function simulate(rel, vel, spin, seed, opts = {}) {
  const h = 1 / 240;
  const maxT = opts.maxT || 2.0;
  let p = [rel[0], rel[1], rel[2]];
  let v = [vel[0], vel[1], vel[2]];
  let w = [spin[0], spin[1], spin[2]];
  let q = qNorm(opts.q0 || qAxis(0.35, 0.8, 0.45, 0.9));
  const rand = rnd32(seed);
  const impacts = [];
  const frames = [{ t: 0, p: p.slice(), q: q.slice() }];
  let restAt = -1, restP = null, contact = 0;
  const REST = [0.47, 0.42, 0.37], TAN = [0.74, 0.70, 0.66];
  for (let i = 1; i * h <= maxT; i++) {
    const t = i * h;
    // air drag
    v[0] *= 1 - 0.18 * h; v[2] *= 1 - 0.18 * h;
    v[1] -= G * h;
    p[0] += v[0] * h; p[1] += v[1] * h; p[2] += v[2] * h;
    // spin integration (world axis)
    const dq = qMul([w[0], w[1], w[2], 0], q);
    q = qNorm([q[0] + 0.5 * dq[0] * h, q[1] + 0.5 * dq[1] * h, q[2] + 0.5 * dq[2] * h, q[3] + 0.5 * dq[3] * h]);
    // angular damping
    const sd = 1 - 0.45 * h;
    w[0] *= sd; w[1] *= sd; w[2] *= sd;
    const ext = supportExtent(q);
    const ground = FLOOR + ext;
    // circular boundary
    const rr = Math.hypot(p[0], p[2]);
    if (rr > BOUND_R) {
      const nx = -p[0] / rr, nz = -p[2] / rr;
      const vn = v[0] * nx + v[2] * nz;
      if (vn < 0) {
        v[0] -= 1.7 * vn * nx; v[2] -= 1.7 * vn * nz;
        p[0] = nx * -BOUND_R; p[2] = nz * -BOUND_R;
        w[0] += (rand() - 0.5) * 4; w[1] += (rand() - 0.5) * 3; w[2] += (rand() - 0.5) * 4;
      }
    }
    if (p[1] <= ground) {
      p[1] = ground;
      if (v[1] < 0) {
        const impact = -v[1];
        const bi = Math.min(impacts.length, 2);
        if (impact > 0.55) {
          const rest = REST[bi] + (rand() - 0.5) * 0.04;
          v[1] = impact * rest;
          const tan = TAN[bi] + (rand() - 0.5) * 0.05;
          // 切向摩擦 + 小幅不规则偏转
          const defl = (rand() - 0.5) * 9 * DEG;
          const c = Math.cos(defl), s = Math.sin(defl);
          const vx = v[0] * c - v[2] * s, vz = v[0] * s + v[2] * c;
          v[0] = vx * tan; v[2] = vz * tan;
          w[0] = w[0] * 0.72 + (rand() - 0.5) * 7;
          w[1] = w[1] * 0.60 + (rand() - 0.5) * 5;
          w[2] = w[2] * 0.72 + (rand() - 0.5) * 7;
          impacts.push({ t, speed: impact });
        } else {
          v[1] = 0;
          contact++;
        }
      } else {
        v[1] = 0;
        contact++;
      }
      if (contact > 0 && Math.abs(v[1]) < 0.02) {
        // 滑动摩擦（贴地）
        const vh = Math.hypot(v[0], v[2]);
        if (vh > 1e-4) {
          const dec = Math.min(vh, 2.7 * h);
          v[0] -= (v[0] / vh) * dec; v[2] -= (v[2] / vh) * dec;
        }
        // 平躺趋势：角速度快速衰减
        const sd2 = 1 - 2.2 * h;
        w[0] *= sd2; w[1] *= sd2; w[2] *= sd2;
        if (Math.hypot(v[0], v[2]) < 0.05 && Math.hypot(w[0], w[1], w[2]) < 1.6 && restAt < 0) {
          restAt = t; restP = p.slice();
        }
      }
    }
    frames.push({ t, p: p.slice(), q: q.slice() });
    if (restAt > 0 && t > restAt + 0.18) break;
  }
  const last = frames[frames.length - 1];
  return { frames, impacts, restAt, restP: restP || last.p.slice(), endT: last.t, endQ: last.q };
}

// 安全区：棋盘内环楔形（121° 两侧），避开机坪/机库/中心星徽
function clearance(p) {
  const x = p[0], z = p[2];
  const r = Math.hypot(x, z);
  const phi = Math.atan2(x, -z);
  let worst = 1e9, where = '';
  // 机库/机坪：121° 方向半径 1.48–2.42
  const hangar = Math.hypot(x - HANGAR_R * Math.sin(121 * DEG), z + HANGAR_R * Math.cos(121 * DEG)) - HANGAR_HALF;
  if (hangar < worst) { worst = hangar; where = 'hangar'; }
  // 中心鼓
  const hub = r - (HUB_R);
  if (hub < worst) { worst = hub; where = 'hub'; }
  // 四条航线格（径向 0.71–2.46，半宽 0.15）
  for (const lp of lanePhi) {
    if (r < 0.55 || r > 2.61) continue;
    const ux = Math.sin(lp), uz = -Math.cos(lp);
    const t = Math.max(0, Math.min(1, (x * ux + z * uz) / 2.46));
    const qx = ux * t * 2.46, qz = uz * t * 2.46;
    const d = Math.hypot(x - qx, z - qz) - 0.15;
    if (d < worst) { worst = d; where = 'lane'; }
  }
  const edge = BOARD_R - 0.17 - r;
  if (edge < worst) { worst = edge; where = 'edge'; }
  return { d: worst, where, r, phi: (phi / DEG + 360) % 360 };
}

function evalCase(c, quiet) {
  const res = simulate(c.rel, c.vel, c.spin, c.seed || 5);
  let minClear = 1e9, minAt = null, maxR = 0;
  for (const f of res.frames) {
    if (f.p[1] < FLOOR + 0.30) {
      const cl = clearance(f.p);
      if (cl.d < minClear) { minClear = cl.d; minAt = { t: +f.t.toFixed(2), ...cl }; }
      maxR = Math.max(maxR, cl.r);
    }
  }
  const rest = res.restP;
  const dist = Math.hypot(rest[0] - DIE_HOME.x, rest[2] - DIE_HOME.z);
  const out = {
    release: c.rel.map((v) => +v.toFixed(2)), vel: c.vel.map((v) => +v.toFixed(2)), spin: c.spin.map((v) => +v.toFixed(1)),
    impacts: res.impacts.map((i) => ({ t: +i.t.toFixed(2), v: +i.speed.toFixed(2) })),
    restT: +res.restAt.toFixed(2), endT: +res.endT.toFixed(2),
    rest: rest.map((v) => +v.toFixed(3)), distHome: +dist.toFixed(3), minClear: +minClear.toFixed(3), minAt, maxR: +maxR.toFixed(2)
  };
  if (!quiet) console.log(JSON.stringify(out));
  return { out, res };
}

// ---- candidate batch ----
const base = { x: DIE_HOME.x, z: DIE_HOME.z };
const cases = [];
// 出生点在中心附近上方（手托起后向 121° 楔形外侧抛）
for (const rr of [0.42, 0.5, 0.58, 0.66]) {
  for (const dphi of [-14, 0, 14]) {
    const phi = (121 + dphi) * DEG, r = rr;
    const rel = [r * Math.sin(phi), 0.80, -r * Math.cos(phi)];
    // 抛向 +x/+z（大致沿楔形径向向外/前）
    for (const sp of [1.1, 1.4, 1.7, 2.0]) {
      for (const vy of [-0.2, -0.7, -1.2]) {
        const dir = (109 + dphi) * DEG; // 出手方向：比出生角更偏前（避免穿过中心）
        const vel = [sp * Math.sin(dir), vy, -sp * Math.cos(dir)];
        cases.push({ rel, vel, spin: [12, 6, -9], seed: 5 });
      }
    }
  }
}
// 先粗筛
const all = cases.map((c) => {
  const r = simulate(c.rel, c.vel, c.spin, c.seed);
  const rest = r.restP;
  const dist = Math.hypot(rest[0] - DIE_HOME.x, rest[2] - DIE_HOME.z);
  let minClear = 1e9, minAt = null;
  for (const f of r.frames) if (f.p[1] < FLOOR + 0.30) {
    const cl = clearance(f.p);
    if (cl.d < minClear) { minClear = cl.d; minAt = { t: +f.t.toFixed(2), ...cl }; }
  }
  return { c, r, dist, minClear, minAt };
});
console.log('total', all.length);
console.log('impactCounts', JSON.stringify(all.reduce((a, x) => { const k = x.r.impacts.length; a[k] = (a[k] || 0) + 1; return a; }, {})));
console.log('clear>0.18', all.filter((x) => x.minClear > 0.18).length, '| clear>0.05', all.filter((x) => x.minClear > 0.05).length);
console.log('t-range', Math.min(...all.map((x) => x.r.endT)).toFixed(2), Math.max(...all.map((x) => x.r.endT)).toFixed(2));
console.log('dist range', Math.min(...all.map((x) => x.dist)).toFixed(2), Math.max(...all.map((x) => x.dist)).toFixed(2));
const results = all.filter((x) => x.minClear > 0.10 && x.r.impacts.length >= 2 && x.r.impacts.length <= 4)
  .sort((a, b) => a.dist - b.dist);
console.log('candidates:', results.length);
for (const x of results.slice(0, 10)) {
  evalCase(x.c);
  console.log('  -> distHome', x.dist.toFixed(3), 'endT', x.r.endT.toFixed(2), 'impacts', x.r.impacts.length, 'minClear', x.minClear.toFixed(3), JSON.stringify(x.minAt));
}
// 也看看 minClear 最大 & dist 最小的折中
const near = all.slice().sort((a, b) => (a.dist + Math.max(0, 0.18 - a.minClear) * 2) - (b.dist + Math.max(0, 0.18 - b.minClear) * 2));
console.log('near best:');
for (const x of near.slice(0, 5)) console.log(JSON.stringify({ rel: x.c.rel.map((v) => +v.toFixed(2)), vel: x.c.vel.map((v) => +v.toFixed(2)), dist: +x.dist.toFixed(2), minClear: +x.minClear.toFixed(2), minAt: x.minAt, impacts: x.r.impacts.length, endT: +x.r.endT.toFixed(2), rest: x.r.restP.map((v) => +v.toFixed(2)) }));

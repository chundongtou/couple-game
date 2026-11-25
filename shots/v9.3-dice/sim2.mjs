/* V9.3 骰子轻量刚体调参 · 第二轮（固定 DIE_HOME=(0.80,0.60)，细网格 + 落定角评估） */
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const FLOOR = 0.038, HALF = 0.17, G = 8.6;
const HOME_ENTRY = { red: 50, yellow: 11, blue: 24, green: 37 };
const lanePhi = Object.values(HOME_ENTRY).map((n) => (n * TAU) / 52);
const HUB_R = 0.51, HANGAR_R = 1.95, HANGAR_HALF = 0.47, BOARD_R = 3.30, BOUND_R = 2.78;
const DIE_HOME = { x: 0.80, z: 0.60 };
const SETTLE_YAW = 0.22;

const qMul = (a, b) => [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1], a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0], a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3], a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const qNorm = (q) => { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0]/l, q[1]/l, q[2]/l, q[3]/l]; };
const qAxis = (ax, ay, az, ang) => { const s = Math.sin(ang/2); return qNorm([ax*s, ay*s, az*s, Math.cos(ang/2)]); };
const qInv = (q) => [-q[0], -q[1], -q[2], q[3]];
const qAng = (a, b) => { const d = Math.abs(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]); return 2*Math.acos(Math.min(1, d)) / DEG; };
function qMatrix(q) {
  const [x,y,z,w] = q; const xx=x*x, yy=y*y, zz=z*z, xy=x*y, xz=x*z, yz=y*z, wx=w*x, wy=w*y, wz=w*z;
  return [1-2*(yy+zz), 2*(xy+wz), 2*(xz-wy), 2*(xy-wz), 1-2*(xx+zz), 2*(yz+wx), 2*(xz+wy), 2*(yz-wx), 1-2*(xx+yy)];
}
const supportExtent = (q) => { const m = qMatrix(q); return HALF*(Math.abs(m[1])+Math.abs(m[4])+Math.abs(m[7])); };
const rnd32 = (seed) => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

/* 六面 → 法向（DIE_FACES = [3,4,1,6,2,5]，+X −X +Y −Y +Z −Z） */
const DIE_FACES = [3, 4, 1, 6, 2, 5];
const FACE_AXIS = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function faceNormal(v) { const i = DIE_FACES.indexOf(v); return FACE_AXIS[i]; }
function settleQuat(v) {
  // 把法向转到 +Y（平躺），再绕世界 Y 加一点 yaw
  const n = faceNormal(v);
  const dot = n[1];
  let axis, ang;
  if (dot > 0.99999) { axis = [0,1,0]; ang = 0; }
  else if (dot < -0.99999) { axis = [1,0,0]; ang = Math.PI; }
  else {
    const cr = [n[2]*1 - 0*0, 0*0 - n[0]*1, 0]; // cross(n, +Y) = (nz, 0, -nx)
    axis = [n[2], 0, -n[0]];
    ang = Math.acos(dot);
  }
  const q1 = axis[0] === 0 && axis[2] === 0 && ang === Math.PI ? qAxis(1,0,0,ang) : qAxis(axis[0], axis[1], axis[2], ang);
  return qNorm(qMul(qAxis(0,1,0,SETTLE_YAW), q1));
}

function simulate(rel, vel, spin, seed, q0) {
  const h = 1/240, maxT = 1.6;
  let p = rel.slice(), v = vel.slice(), w = spin.slice(), q = qNorm(q0);
  const rand = rnd32(seed);
  const impacts = []; const frames = [{ t: 0, p: p.slice(), q: q.slice(), v: v.slice() }];
  let restAt = -1, restP = null, contact = 0;
  const REST = [0.47, 0.42, 0.37], TAN = [0.74, 0.70, 0.66];
  for (let i = 1; i*h <= maxT; i++) {
    const t = i*h;
    v[0] *= 1-0.18*h; v[2] *= 1-0.18*h; v[1] -= G*h;
    p[0] += v[0]*h; p[1] += v[1]*h; p[2] += v[2]*h;
    const dq = qMul([w[0],w[1],w[2],0], q);
    q = qNorm([q[0]+0.5*dq[0]*h, q[1]+0.5*dq[1]*h, q[2]+0.5*dq[2]*h, q[3]+0.5*dq[3]*h]);
    const sd = 1-0.45*h; w[0]*=sd; w[1]*=sd; w[2]*=sd;
    const ground = FLOOR + supportExtent(q);
    const rr = Math.hypot(p[0], p[2]);
    if (rr > BOUND_R) {
      const nx = -p[0]/rr, nz = -p[2]/rr; const vn = v[0]*nx + v[2]*nz;
      if (vn < 0) { v[0] -= 1.7*vn*nx; v[2] -= 1.7*vn*nz; p[0] = nx*-BOUND_R; p[2] = nz*-BOUND_R; w[0] += (rand()-0.5)*4; w[1] += (rand()-0.5)*3; w[2] += (rand()-0.5)*4; }
    }
    if (p[1] <= ground) {
      p[1] = ground;
      if (v[1] < 0) {
        const impact = -v[1]; const bi = Math.min(impacts.length, 2);
        if (impact > 0.55) {
          v[1] = impact * (REST[bi] + (rand()-0.5)*0.04);
          const tan = TAN[bi] + (rand()-0.5)*0.05;
          const defl = (rand()-0.5)*9*DEG; const c = Math.cos(defl), s = Math.sin(defl);
          const vx = v[0]*c - v[2]*s, vz = v[0]*s + v[2]*c;
          v[0] = vx*tan; v[2] = vz*tan;
          w[0] = w[0]*0.72 + (rand()-0.5)*7; w[1] = w[1]*0.60 + (rand()-0.5)*5; w[2] = w[2]*0.72 + (rand()-0.5)*7;
          impacts.push({ t, speed: impact });
        } else { v[1] = 0; contact++; }
      } else { v[1] = 0; contact++; }
      if (contact > 0 && Math.abs(v[1]) < 0.02) {
        const vh = Math.hypot(v[0], v[2]);
        if (vh > 1e-4) { const dec = Math.min(vh, 2.7*h); v[0] -= v[0]/vh*dec; v[2] -= v[2]/vh*dec; }
        const sd2 = 1-2.2*h; w[0]*=sd2; w[1]*=sd2; w[2]*=sd2;
        if (Math.hypot(v[0],v[2]) < 0.05 && Math.hypot(w[0],w[1],w[2]) < 1.6 && restAt < 0) { restAt = t; restP = p.slice(); }
      }
    }
    frames.push({ t, p: p.slice(), q: q.slice(), v: v.slice() });
    if (restAt > 0 && t > restAt + 0.12) break;
  }
  const last = frames[frames.length-1];
  return { frames, impacts, restAt, restP: restP || last.p.slice(), endT: last.t, endQ: last.q };
}
function frameAt(res, t) {
  const h = 1/240; const i = Math.min(res.frames.length-1, Math.max(0, Math.round(t/h)));
  return res.frames[i];
}
function clearance(p) {
  const x = p[0], z = p[2], r = Math.hypot(x, z);
  let worst = 1e9, where = '';
  const hangar = Math.hypot(x - HANGAR_R*Math.sin(121*DEG), z + HANGAR_R*Math.cos(121*DEG)) - HANGAR_HALF;
  if (hangar < worst) { worst = hangar; where = 'hangar'; }
  const hub = r - HUB_R; if (hub < worst) { worst = hub; where = 'hub'; }
  for (const lp of lanePhi) {
    if (r < 0.55 || r > 2.61) continue;
    const ux = Math.sin(lp), uz = -Math.cos(lp);
    const tt = Math.max(0, Math.min(1, (x*ux+z*uz)/2.46));
    const d = Math.hypot(x-ux*tt*2.46, z-uz*tt*2.46) - 0.15;
    if (d < worst) { worst = d; where = 'lane'; }
  }
  const edge = BOARD_R-0.17-r; if (edge < worst) { worst = edge; where = 'edge'; }
  return { d: worst, where, r };
}
function metrics(c) {
  const res = simulate(c.rel, c.vel, c.spin, c.seed || 5, c.q0 || qAxis(0.35,0.8,0.45,0.9));
  let minClear = 1e9, minAt = null;
  for (const f of res.frames) if (f.p[1] < FLOOR + 0.30) { const cl = clearance(f.p); if (cl.d < minClear) { minClear = cl.d; minAt = { t:+f.t.toFixed(2), d:+cl.d.toFixed(3), where:cl.where, r:+cl.r.toFixed(2) }; } }
  const f110 = frameAt(res, 1.10);
  const tips = [1,2,3,4,5,6].map((v) => +qAng(f110.q, settleQuat(v)).toFixed(0));
  return { res, minClear, minAt, f110, tips };
}

// 细网格：release 角度/半径/高度、速度、seed
const cases = [];
for (const relR of [0.40, 0.45, 0.50, 0.55, 0.60]) for (const relPhi of [105, 110, 115, 120, 125]) for (const relY of [0.72, 0.80, 0.88])
for (const sp of [0.80, 0.95, 1.10, 1.25]) for (const vy of [-0.4, -0.7, -1.0]) for (const seed of [3, 5, 7]) {
  const a = relPhi*DEG;
  const rel = [relR*Math.sin(a), relY, -relR*Math.cos(a)];
  const dir = (relPhi - 8)*DEG;
  const vel = [sp*Math.sin(dir), vy, -sp*Math.cos(dir)];
  cases.push({ rel, vel, spin: [12, 6, -9], seed });
}
let best = [];
for (const c of cases) {
  const m = metrics(c);
  const rest = m.res.restP;
  const dHome = Math.hypot(rest[0]-DIE_HOME.x, rest[2]-DIE_HOME.z);
  const nImp = m.res.impacts.length;
  if (m.minClear < 0.24) continue;
  if (nImp < 2 || nImp > 4) continue;
  const t110 = 1.10;
  const d110 = Math.hypot(m.f110.p[0]-DIE_HOME.x, m.f110.p[2]-DIE_HOME.z);
  const score = dHome*3 + d110*1.5 + Math.max(0, 0.30-m.minClear)*2 + Math.abs(m.res.restAt-1.20)*0.4 + (nImp===3?-0.1:0);
  best.push({ c, m, dHome, d110, nImp, score });
}
best.sort((a,b) => a.score-b.score);
console.log('pass', best.length);
for (const b of best.slice(0, 12)) {
  console.log(JSON.stringify({
    rel: b.c.rel.map(v=>+v.toFixed(2)), vel: b.c.vel.map(v=>+v.toFixed(2)), seed: b.c.seed,
    impacts: b.m.res.impacts.map(i=>({t:+i.t.toFixed(2),v:+i.speed.toFixed(2)})), restAt: +b.m.res.restAt.toFixed(2),
    rest: b.m.res.restP.map(v=>+v.toFixed(3)), dHome: +b.dHome.toFixed(3), d110: +b.d110.toFixed(3),
    minClear: +b.m.minClear.toFixed(3), minAt: b.m.minAt, tips: b.m.tips, restY: +b.m.res.restP[1].toFixed(3)
  }));
}

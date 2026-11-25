/* V9.4 落点/clearance 计算 + 物理调参（Node，无依赖）
 * 目标：在「不压中心鼓/黄铜基环/进航格/机库/环格」前提下，取最靠近棋盘中心的合法落点，
 *      并给出手/抛掷的新 release 位置/初速，使物理自然停在落点附近。
 */
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const FLOOR = 0.038, HALF = 0.17, HALF_DIAG = HALF * Math.SQRT2;
const G = 8.6;
const HOME_ENTRY = { red: 50, yellow: 11, blue: 24, green: 37 };
const lanePhi = Object.values(HOME_ENTRY).map((n) => (n * TAU) / 52);
const HUB = { drumR: 0.51, ringR: 0.60, tube: 0.03 };
const HANGAR_R = 1.95, HANGAR_HALF = 0.47, BOARD_R = 3.30, BOUND_R = 2.78;
const TILE_TOP = 0.101;

/* ---------- 1) 落点 clearance ---------- */
function distPointSeg(px, pz, ax, az, bx, bz) {
  const dx = bx - ax, dz = bz - az;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (pz - az) * dz) / (dx * dx + dz * dz || 1)));
  return Math.hypot(px - (ax + t * dx), pz - (az + t * dz));
}
function homeTileClearance(x, z) {
  let best = 1e9;
  for (const lp of lanePhi) {
    const ux = Math.sin(lp), uz = -Math.cos(lp);
    for (const s of [0, 1, 2, 3, 4]) {
      const r = 2.46 - s * 0.40;
      const cx = r * ux, cz = r * uz;
      const rot = -lp - Math.PI;
      // 把点变换到格子局部坐标
      const dx = x - cx, dz = z - cz;
      const c = Math.cos(-rot), sn = Math.sin(-rot); // inverse rotation
      const lx = dx * c - dz * sn, lz = dx * sn + dz * c;
      const qx = Math.max(-0.15, Math.min(0.15, lx)), qz = Math.max(-0.15, Math.min(0.15, lz));
      best = Math.min(best, Math.hypot(lx - qx, lz - qz));
    }
  }
  return best;
}
function clearanceAt(x, z) {
  const r = Math.hypot(x, z);
  const out = {};
  out.hubDrum = r - HALF_DIAG - HUB.drumR;
  out.hubRing = r - HALF_DIAG - (HUB.ringR + HUB.tube);
  out.homeTiles = homeTileClearance(x, z) - HALF_DIAG;
  out.hangar = Math.hypot(x - HANGAR_R * Math.sin(APRON(121)), z + HANGAR_R * Math.cos(APRON(121))) - HANGAR_HALF - HALF_DIAG;
  out.board = BOARD_R - r - HALF_DIAG;
  out.min = Math.min(out.hubDrum, out.hubRing, out.homeTiles, out.hangar, out.board);
  out.r = r;
  return out;
}
function APRON(deg) { return deg * DEG; }
/* 更精确的机库：四个机坪方块（0.94×0.94，中心 1.95，APRON 31/121/211/301） */
function hangarClearance(x, z) {
  let best = 1e9;
  for (const a of [31, 121, 211, 301]) {
    const cx = HANGAR_R * Math.sin(a * DEG), cz = -HANGAR_R * Math.cos(a * DEG);
    const rot = -a * DEG - Math.PI;
    const dx = x - cx, dz = z - cz;
    const c = Math.cos(-rot), s = Math.sin(-rot);
    const lx = dx * c - dz * s, lz = dx * s + dz * c;
    const qx = Math.max(-HANGAR_HALF, Math.min(HANGAR_HALF, lx));
    const qz = Math.max(-HANGAR_HALF, Math.min(HANGAR_HALF, lz));
    best = Math.min(best, Math.hypot(lx - qx, lz - qz));
  }
  return best;
}
// 修正 clearanceAt 的机库
function clearance2(x, z) {
  const r = Math.hypot(x, z);
  const o = {
    hubDrum: r - HALF_DIAG - HUB.drumR,
    hubRing: r - HALF_DIAG - (HUB.ringR + HUB.tube),
    homeTiles: homeTileClearance(x, z) - HALF_DIAG,
    hangar: hangarClearance(x, z) - HALF_DIAG,
    board: BOARD_R - r - HALF_DIAG
  };
  o.min = Math.min(o.hubDrum, o.hubRing, o.homeTiles, o.hangar, o.board);
  o.r = r;
  o.phi = ((Math.atan2(x, -z) / DEG) + 360) % 360;
  return o;
}

/* 沿 45° 对角线 (x=z=t) 找最近合法点（含半对角 + margin） */
function searchAlong(angleDeg, margin) {
  const ux = Math.sin(angleDeg * DEG), uz = -Math.cos(angleDeg * DEG);
  let best = null;
  for (let r = 0.70; r <= 1.30; r += 0.001) {
    const x = r * ux, z = r * uz;
    const c = clearance2(x, z);
    if (c.min >= margin) { best = { r, x, z, c }; break; }
  }
  return best;
}
console.log('--- 落点搜索（含骰子半对角 %.4f）---'.replace('%.4f', HALF_DIAG.toFixed(4)));
for (const a of [121, 130, 135, 140]) {
  for (const m of [0.02, 0.01, 0.005]) {
    const b = searchAlong(a, m);
    if (b) console.log(`angle=${a} margin=${m} -> r=${b.r.toFixed(3)} (${b.x.toFixed(3)},${b.z.toFixed(3)}) min=${b.c.min.toFixed(4)} ring=${b.c.hubRing.toFixed(4)} lane=${b.c.homeTiles.toFixed(4)} drum=${b.c.hubDrum.toFixed(4)} hangar=${b.c.hangar.toFixed(4)}`);
  }
}
const SUG = { x: 0.58, z: 0.58 };
console.log('suggested (0.58,0.58) r=%.3f'.replace('%.3f', Math.hypot(SUG.x, SUG.z).toFixed(3)), JSON.stringify(clearance2(SUG.x, SUG.z), (k, v) => typeof v === 'number' ? +v.toFixed(4) : v));
const PICK = { x: 0.625, z: 0.625 };
console.log('pick (0.625,0.625) r=%.3f'.replace('%.3f', Math.hypot(PICK.x, PICK.z).toFixed(3)), JSON.stringify(clearance2(PICK.x, PICK.z), (k, v) => typeof v === 'number' ? +v.toFixed(4) : v));
console.log('V9.3 (0.84,0.53) r=%.3f'.replace('%.3f', Math.hypot(0.84, 0.53).toFixed(3)), JSON.stringify(clearance2(0.84, 0.53), (k, v) => typeof v === 'number' ? +v.toFixed(4) : v));

/* ---------- 2) 物理调参 ---------- */
const DIE_HOME = PICK;
const qMul = (a, b) => [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1], a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0], a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3], a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const qNorm = (q) => { const l = Math.hypot(q[0],q[1],q[2],q[3]) || 1; return [q[0]/l,q[1]/l,q[2]/l,q[3]/l]; };
const qAxis = (ax,ay,az,ang) => { const s = Math.sin(ang/2); return qNorm([ax*s,ay*s,az*s,Math.cos(ang/2)]); };
function qMatrix(q){const [x,y,z,w]=q;const xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;return[1-2*(yy+zz),2*(xy+wz),2*(xz-wy),2*(xy-wz),1-2*(xx+zz),2*(yz+wx),2*(xz+wy),2*(yz-wx),1-2*(xx+yy)];}
const supportExtent=(q)=>{const m=qMatrix(q);return HALF*(Math.abs(m[1])+Math.abs(m[4])+Math.abs(m[7]));};
const rnd32=(seed)=>()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};

function simulate(rel, vel, spin, seed, q0) {
  const h = 1/240, maxT = 1.6;
  let p = rel.slice(), v = vel.slice(), w = spin.slice(), q = qNorm(q0);
  const rand = rnd32(seed);
  const impacts = []; const frames = [{ t: 0, p: p.slice(), q: q.slice(), v: v.slice() }];
  let restAt = -1, restP = null, contact = 0;
  const REST = [0.47,0.42,0.37], TAN = [0.74,0.70,0.66];
  for (let i=1;i*h<=maxT;i++){
    const t=i*h;
    v[0]*=1-0.18*h; v[2]*=1-0.18*h; v[1]-=G*h;
    p[0]+=v[0]*h; p[1]+=v[1]*h; p[2]+=v[2]*h;
    const dq=qMul([w[0],w[1],w[2],0],q);
    q=qNorm([q[0]+0.5*dq[0]*h,q[1]+0.5*dq[1]*h,q[2]+0.5*dq[2]*h,q[3]+0.5*dq[3]*h]);
    const sd=1-0.45*h; w[0]*=sd; w[1]*=sd; w[2]*=sd;
    const ground=FLOOR+supportExtent(q);
    const rr=Math.hypot(p[0],p[2]);
    if(rr>BOUND_R){const nx=-p[0]/rr,nz=-p[2]/rr;const vn=v[0]*nx+v[2]*nz;if(vn<0){v[0]-=1.7*vn*nx;v[2]-=1.7*vn*nz;p[0]=nx*-BOUND_R;p[2]=nz*-BOUND_R;w[0]+=(rand()-0.5)*4;w[1]+=(rand()-0.5)*3;w[2]+=(rand()-0.5)*4;}}
    if(p[1]<=ground){
      p[1]=ground;
      if(v[1]<0){
        const sp=-v[1], bi=Math.min(impacts.length,2);
        if(sp>0.55){
          v[1]=sp*(REST[bi]+(rand()-0.5)*0.04);
          const tan=TAN[bi]+(rand()-0.5)*0.05;
          const defl=(rand()-0.5)*9*DEG;const c=Math.cos(defl),s=Math.sin(defl);
          const vx=v[0]*c-v[2]*s,vz=v[0]*s+v[2]*c;
          v[0]=vx*tan;v[2]=vz*tan;
          w[0]=w[0]*0.72+(rand()-0.5)*7;w[1]=w[1]*0.60+(rand()-0.5)*5;w[2]=w[2]*0.72+(rand()-0.5)*7;
          impacts.push({t,speed:sp});
        } else { v[1]=0; contact++; }
      } else { v[1]=0; contact++; }
      if(contact>0&&Math.abs(v[1])<0.02){
        const vh=Math.hypot(v[0],v[2]);
        if(vh>1e-4){const dec=Math.min(vh,2.7*h);v[0]-=v[0]/vh*dec;v[2]-=v[2]/vh*dec;}
        const sd2=1-2.2*h;w[0]*=sd2;w[1]*=sd2;w[2]*=sd2;
        if(Math.hypot(v[0],v[2])<0.05&&Math.hypot(w[0],w[1],w[2])<1.6&&restAt<0){restAt=t;restP=p.slice();}
      }
    }
    frames.push({t,p:p.slice(),q:q.slice(),v:v.slice()});
    if(restAt>0&&t>restAt+0.12)break;
  }
  const last=frames[frames.length-1];
  return { frames, impacts, restAt, restP: restP||last.p.slice(), endT: last.t };
}

let best = [];
for (const relR of [0.30,0.36,0.42,0.48,0.54]) for (const relPhi of [110,118,125,132]) for (const relY of [0.74,0.82,0.90])
for (const sp of [0.55,0.70,0.85,1.00]) for (const vy of [-0.3,-0.6,-0.9]) for (const seed of [3,5,7,11]) {
  const a = relPhi*DEG;
  const rel = [relR*Math.sin(a), relY, -relR*Math.cos(a)];
  const dir = (relPhi - 4)*DEG;
  const vel = [sp*Math.sin(dir), vy, -sp*Math.cos(dir)];
  const q0 = qAxis(0.36,0.82,0.44,0.9 + 0.35*Math.sin(seed));
  const r = simulate(rel, vel, [10,5,-8], seed, q0);
  const rest = r.restP;
  const dHome = Math.hypot(rest[0]-DIE_HOME.x, rest[2]-DIE_HOME.z);
  // 所有贴地帧的中心半径（避免压 hub ring/drum；含半对角 ~0.24，保守取 >=0.88）
  let minR = 1e9, minAt = null;
  for (const f of r.frames) if (f.p[1] < FLOOR + 0.30) { const rr = Math.hypot(f.p[0], f.p[2]); if (rr < minR) { minR = rr; minAt = { t:+f.t.toFixed(2), r:+rr.toFixed(2) }; } }
  if (r.impacts.length < 2 || r.impacts.length > 4) continue;
  if (minR < 0.88) continue;
  if (dHome > 0.10) continue;
  const score = dHome*4 + Math.abs(r.endT-1.25)*0.3 + Math.abs(r.impacts.length-3)*0.1 + Math.max(0, 0.95-minR)*1.5;
  best.push({ rel, vel, seed, r, dHome, minR, minAt, score });
}
best.sort((a,b)=>a.score-b.score);
console.log('--- physics candidates ---', best.length);
for (const b of best.slice(0, 10)) {
  console.log(JSON.stringify({
    rel: b.rel.map(v=>+v.toFixed(3)), vel: b.vel.map(v=>+v.toFixed(3)), seed: b.seed,
    impacts: b.r.impacts.map(i=>({t:+i.t.toFixed(2),v:+i.speed.toFixed(2)})),
    restAt: +b.r.restAt.toFixed(2), endT: +b.r.endT.toFixed(2), rest: b.r.restP.map(v=>+v.toFixed(3)),
    dHome: +b.dHome.toFixed(3), minR: +b.minR.toFixed(3), minAt: b.minAt
  }));
}

/* V9.7 上挑抛出（手腕 flick）物理调参：初速向上，2–3 次弹跳，落 (0.63,0.63) */
const DEG = Math.PI / 180, TAU = Math.PI * 2;
const FLOOR = 0.038, HALF = 0.17, G = 8.6, BOUND_R = 2.78;
const DIE_HOME = { x: 0.63, z: 0.63 };
const qMul = (a, b) => [a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1], a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0], a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3], a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const qNorm = (q) => { const l = Math.hypot(q[0],q[1],q[2],q[3]) || 1; return [q[0]/l,q[1]/l,q[2]/l,q[3]/l]; };
const qAxis = (ax,ay,az,ang) => { const s = Math.sin(ang/2); return qNorm([ax*s,ay*s,az*s,Math.cos(ang/2)]); };
function qMatrix(q){const[x,y,z,w]=q;const xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;return[1-2*(yy+zz),2*(xy+wz),2*(xz-wy),2*(xy-wz),1-2*(xx+zz),2*(yz+wx),2*(xz+wy),2*(yz-wx),1-2*(xx+yy)];}
const extent=(q)=>{const m=qMatrix(q);return HALF*(Math.abs(m[1])+Math.abs(m[4])+Math.abs(m[7]));};
const rnd32=(seed)=>()=>{seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};

function simulate(rel, vel, spin, seed, q0) {
  const h = 1/240, maxT = 1.7;
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
    const sd=1-0.45*h; w[0]*=sd;w[1]*=sd;w[2]*=sd;
    const ground=FLOOR+extent(q);
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
  return {frames,impacts,restAt,restP:restP||last.p.slice(),endT:last.t};
}

let best=[];
for (const relR of [1.10,1.20,1.30,1.40]) for (const relPhi of [132,136,140]) for (const relY of [0.48,0.56,0.64])
for (const sp of [0.25,0.40,0.55,0.70]) for (const vy of [0.6,0.9,1.2,1.5]) for (const seed of [3,5,7,11,13,17]) {
  const a=relPhi*DEG;
  const rel=[relR*Math.sin(a),relY,-relR*Math.cos(a)];
  const dir=(relPhi)*DEG;
  const vel=[-sp*Math.sin(dir), vy, sp*Math.cos(dir)];   // 向内（朝 135° 反向）
  const q0=qAxis(0.36,0.82,0.44,0.9+0.35*Math.sin(seed+relR*7));
  const spin=[14+relR*4, 5+seed*0.4, -(10+relR*3)];
  const r=simulate(rel,vel,spin,seed,q0);
  const rest=r.restP;
  const dHome=Math.hypot(rest[0]-DIE_HOME.x,rest[2]-DIE_HOME.z);
  if(r.impacts.length<2||r.impacts.length>4)continue;
  let minR=1e9,minAt=null;
  for(const f of r.frames){if(f.p[1]<FLOOR+0.30){const rr=Math.hypot(f.p[0],f.p[2]);if(rr<minR){minR=rr;minAt={t:+f.t.toFixed(2),r:+rr.toFixed(2)};}}}
  if(minR<0.865)continue;
  if(dHome>0.06)continue;
  if(r.endT>1.55)continue;
  const score=dHome*4+Math.abs(r.endT-1.35)*0.3+Math.abs(r.impacts.length-3)*0.12+Math.max(0,0.90-minR)*1.2;
  best.push({rel,vel,spin,seed,r,dHome,minR,minAt,score});
}
best.sort((a,b)=>a.score-b.score);
console.log('candidates',best.length);
for(const b of best.slice(0,12)){
  console.log(JSON.stringify({
    rel:b.rel.map(v=>+v.toFixed(3)),vel:b.vel.map(v=>+v.toFixed(3)),spin:b.spin.map(v=>+v.toFixed(1)),seed:b.seed,
    impacts:b.r.impacts.map(i=>({t:+i.t.toFixed(2),v:+i.speed.toFixed(2)})),
    restAt:+b.r.restAt.toFixed(2),endT:+b.r.endT.toFixed(2),rest:b.r.restP.map(v=>+v.toFixed(3)),
    dHome:+b.dHome.toFixed(3),minR:+b.minR.toFixed(3),minAt:b.minAt
  }));
}

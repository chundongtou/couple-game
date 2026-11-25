/* V9.4 最终证据：手更真实（深色皮手套/分节手指/侧握）+ 落点 (0.63,0.63) 更靠中心。
 * 抓帧用「冻结 + 手动把 toss 动画推进到目标时刻 + 结束相机动画」——headless SwiftShader 低帧也能
 * 精确得到真实时间轴上的 4 帧（hold/throw/bounce/settled），settled 帧 hand=false。
 * 覆盖：390/320/430 × 4 帧；真实主桌 forceDie(6)；320 low/medium；reduced；落点 clearance。
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIST = path.resolve(ROOT, process.argv[2] || 'dist/v94');
const OUT = path.resolve(ROOT, process.argv[3] || 'shots/v9.4-dice');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8937, CDP_PORT = 9357;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.wav': 'audio/wav', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP { constructor(ws){this.ws=ws;this.id=0;this.p=new Map();this.l=new Map();ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&this.p.has(m.id)){const{r,j}=this.p.get(m.id);this.p.delete(m.id);m.error?j(new Error(m.error.message)):r(m.result);return;}if(m.method)for(const f of this.l.get(m.method)||[])f(m.params||{});});}
 send(method,params={}){const id=++this.id;return new Promise((r,j)=>{this.p.set(id,{r,j});this.ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);j(new Error('timeout '+method));}},120000);});}
 on(m,f){const a=this.l.get(m)||[];a.push(f);this.l.set(m,a);} }
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',()=>j(new Error('ws')),{once:true});});return new CDP(ws);}

const CLEAR = `(() => {
  const sc = window.App.Board3D._current().scene;
  const V = sc.camera.position.constructor;
  const DEG = Math.PI / 180;
  const q = sc.die.quaternion, p = sc.die.position;
  const pts = [];
  for (const [sx, sz] of [[-1,-1],[1,-1],[1,1],[-1,1],[0,-1],[1,0],[0,1],[-1,0]]) {
    const v = new V(sx * 0.17, 0, sz * 0.17).applyQuaternion(q).add(p);
    pts.push([v.x, v.z]);
  }
  const lane = [50,11,24,37].map((n) => n * 2 * Math.PI / 52);
  const rectD = (x, z, cx, cz, rot, half) => {
    const dx = x - cx, dz = z - cz, c = Math.cos(-rot), s = Math.sin(-rot);
    const lx = dx * c - dz * s, lz = dx * s + dz * c;
    return Math.hypot(lx - Math.max(-half, Math.min(half, lx)), lz - Math.max(-half, Math.min(half, lz)));
  };
  const r = Math.hypot(p.x, p.z);
  let minRing = 1e9, minDrum = 1e9, minTile = 1e9, minHangar = 1e9, minEdge = 1e9;
  for (const [x, z] of pts) {
    const rr = Math.hypot(x, z);
    minRing = Math.min(minRing, rr > 0.63 ? rr - 0.63 : (rr < 0.57 ? 0.57 - rr : 0));
    minDrum = Math.min(minDrum, rr - 0.51);
    minEdge = Math.min(minEdge, 3.30 - rr);
    for (const lp of lane) for (let k = 0; k < 5; k++) {
      const rad = 2.46 - k * 0.40;
      minTile = Math.min(minTile, rectD(x, z, rad * Math.sin(lp), -rad * Math.cos(lp), -lp - Math.PI, 0.15));
    }
    for (const a of [31,121,211,301]) { const A = a * DEG; minHangar = Math.min(minHangar, rectD(x, z, 1.95 * Math.sin(A), -1.95 * Math.cos(A), -A - Math.PI, 0.47)); }
  }
  const semi = 0.17 * Math.SQRT2;
  return {
    center: [+p.x.toFixed(4), +p.z.toFixed(4)], r: +r.toFixed(4), phi: +(((Math.atan2(p.x, -p.z) / DEG) + 360) % 360).toFixed(2),
    footprint: { hubRing: +minRing.toFixed(4), hubDrum: +minDrum.toFixed(4), homeTiles: +minTile.toFixed(4), hangar: +minHangar.toFixed(4), boardEdge: +minEdge.toFixed(4) },
    conservative: { hubRing: +(r - semi - 0.63).toFixed(4), hubDrum: +(r - semi - 0.51).toFixed(4), boardEdge: +(3.30 - semi - r).toFixed(4) },
    min: +Math.min(minRing, minDrum, minTile, minHangar, minEdge).toFixed(4),
    value: sc.dieValue, top: sc.dieDebug().top, up: sc.dieDebug().up
  };
})()`;

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]); if (p === '/') p = '/index.html';
    const f = path.join(DIST, p);
    fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); res.end('404'); return; }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); res.end(b); });
  });
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  const profile = await fsp.mkdtemp(path.join(os.tmpdir(), 'edge-v94f-'));
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=430,932', 'about:blank'], { stdio: 'ignore', detached: true });
  edge.unref();
  let ver = null;
  for (let i = 0; i < 150; i++) { await sleep(150); try { const r = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version'); ver = await r.json(); if (ver.webSocketDebuggerUrl) break; } catch (e) { /* wait */ } }
  if (!ver) throw new Error('Edge CDP not ready');
  const browser = await connect(ver.webSocketDebuggerUrl);
  const tg = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/new?about:blank', { method: 'PUT' }).then((r) => r.json());
  const cdp = await connect(tg.webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  const errors = [];
  cdp.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error' || p.type === 'warning') errors.push([p.type, (p.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 300)]); });
  cdp.on('Runtime.exceptionThrown', (p) => errors.push(['pageerror', JSON.stringify(p.exceptionDetails).slice(0, 400)]));
  const ev = async (expr) => { const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return r.result && r.result.value; };
  const waitFor = async (expr, ms = 30000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await ev(`(() => { try { return (${expr}); } catch(e) { return null; } })()`)) return true; } catch (e) { /* retry */ } await sleep(120); } return false; };
  const shot = async (file, clip) => { const r = await cdp.send('Page.captureScreenshot', clip ? { format: 'png', clip: { x: clip.x, y: clip.y, width: clip.w, height: clip.h, scale: 1 }, captureBeyondViewport: false } : { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64')); return fs.statSync(file).size; };
  const hostClip = async () => ev(`(() => { const r = document.querySelector('.v6-board3d').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`);

  async function preparePage(w, h, reduced) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await waitFor("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))", 25000);
    await ev(`(() => { App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:${reduced ? 'true' : 'false'},board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}}); return true; })()`);
    await sleep(300);
    await ev(`(() => { const m=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(m.state); App.Router.reset('table'); return true; })()`);
    await sleep(1000);
    await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
    await sleep(300);
    await waitFor("!!(document.querySelector('.v6-table') && document.querySelector('.v6-table').getAttribute('data-board3d') && document.querySelector('.v6-table').getAttribute('data-board3d') !== 'pending' && window.App.Board3D && window.App.Board3D._current())", 40000);
    await sleep(2400);
  }
  const handStats = async () => ev(`(() => {
    const sc = App.Board3D._current().scene;
    let draws = 0, tris = 0;
    sc._hand.group.traverse((o) => { if (!o.isMesh || !o.geometry) return; draws++; const g = o.geometry; const n = g.index ? g.index.count : g.attributes.position.count; const inst = o.isInstancedMesh ? o.count : 1; tris += n / 3 * inst; });
    return { draws, tris, scale: +sc._hand.group.scale.x.toFixed(2), grip: sc._hand.gripLocal.toArray().map((v) => +v.toFixed(4)) };
  })()`);
  const freeze = async () => ev(`(() => { const sc=App.Board3D._current().scene; sc._paused = true; if (sc._raf) { cancelAnimationFrame(sc._raf); sc._raf = 0; } sc._last = performance.now(); return true; })()`);
  const resume = async () => ev(`(() => { const sc=App.Board3D._current().scene; sc._paused=false; sc._last=0; sc._startLoop(); return true; })()`);
  const jump = async (t) => ev(`(() => {
    const sc = App.Board3D._current().scene;
    sc._paused = true; if (sc._raf) { cancelAnimationFrame(sc._raf); sc._raf = 0; }
    let a = null; for (const x of sc.anims) { if (x.ms > 1500) a = x; else x.t = x.ms; }
    if (!a) return { ok:false, n: sc.anims.length, tossing: !!sc._toss };
    a.t = Math.min(${t}, a.ms);
    sc._last = performance.now();
    sc._tickAnims(0);
    sc.renderNow();
    const d = sc.dieDebug(); const dbg = App.Board3D._debug();
    return { ok:true, t:d.t, die:d, hand:d.hand, calls:dbg.drawCalls, tris:dbg.triangles, phase:dbg.phase, remaining: sc.anims.length };
  })()`);
  const waitToss = async () => { for (let i = 0; i < 400; i++) { const ok = await ev(`(() => { const sc=App.Board3D._current().scene; return !!(sc._toss && sc.anims.length); })()`); if (ok) return true; await sleep(50); } return false; };

  const report = { dist: DIST, sizes: {}, frames: {}, errors };
  const sizes = (process.argv[4] || '390x844,320x568,430x932').split(',').map((s) => s.split('x').map(Number));
  for (const [w, h] of sizes) {
    const label = w + 'x' + h;
    const size = { frames: {} };
    await preparePage(w, h, false);
    const base = await ev(`(() => { const d=App.Board3D._debug(); const sc=App.Board3D._current().scene; return { calls:d.drawCalls, tris:d.triangles, quality:d.quality, fps:d.fps, host:{x:+document.querySelector('.v6-board3d').getBoundingClientRect().x.toFixed(1), y:+document.querySelector('.v6-board3d').getBoundingClientRect().y.toFixed(1), w:+document.querySelector('.v6-board3d').getBoundingClientRect().width.toFixed(1), h:+document.querySelector('.v6-board3d').getBoundingClientRect().height.toFixed(1)}, viewport:[sc.viewport.w,sc.viewport.h], aspect:+(sc.viewport.w/sc.viewport.h).toFixed(3) }; })()`);
    size.base = base;
    size.hand = await handStats();
    /* 一次 play 内抓 4 帧（真实时间轴 730/960/1210/2400ms） */
    await ev(`(() => { App.Board3D.play([{ type:'dice', die:4 }]); return true; })()`);
    await waitToss();
    for (const [name, t] of [['hold',730],['throw',960],['bounce',1210],['settled',2400]]) {
      const info = await jump(t);
      await sleep(120);
      const bytes = await shot(path.join(OUT, `${label}-${name}.png`));
      size.frames[name] = { ...info, bytes };
      report.frames[`${label}-${name}`] = info;
    }
    await resume();
    await waitFor("!window.App.Board3D._debug().busy", 30000);
    await sleep(800);
    await freeze();
    const settled = await ev(`(() => { const sc=App.Board3D._current().scene; sc._last=performance.now(); sc.renderNow(); const d=sc.dieDebug(); const dbg=App.Board3D._debug(); return { die:d, calls:dbg.drawCalls, tris:dbg.triangles }; })()`);
    const settledClear = await ev(CLEAR);
    const settledBytes = await shot(path.join(OUT, `${label}-settled-overview.png`));
    await resume();
    size.settledOverview = { ...settled, clear: settledClear, bytes: settledBytes };
    /* 真实主桌联动：forceDie(6) → 点掷骰 → 抓 roll 帧 + 结束 */
    await ev(`window.__V6_TEST__.forceDie(6)`);
    await ev(`(() => { document.querySelector('[data-test=roll]').click(); return true; })()`);
    await waitToss();
    const tRoll = await jump(900);
    await sleep(120);
    const tableRollBytes = await shot(path.join(OUT, `${label}-table-roll.png`));
    await jump(2400);
    await resume();
    await waitFor("!window.App.Board3D._debug().busy", 40000);
    await sleep(900);
    const tableEnd = await ev(`(() => {
      const st = window.__V6_TEST__.getState(); const d = window.App.Board3D._debug();
      let logDie = null; const log = (st && st.log) || [];
      for (let i = log.length - 1; i >= 0; i--) if (log[i] && log[i].kind === 'roll') { logDie = log[i].die; break; }
      return { stateDie: st && st.rollContext && st.rollContext.die, logDie, awaiting: st && st.awaiting && st.awaiting.type, phase: d.phase, probeDie: d.probe && d.probe.die, calls: d.drawCalls, tris: d.triangles };
    })()`);
    const tableClear = await ev(CLEAR);
    const tableBytes = await shot(path.join(OUT, `${label}-table-settled.png`));
    size.table = { roll: tRoll, end: tableEnd, clear: tableClear, bytes: tableBytes };
    /* 320 额外：low / medium 也看得见手 */
    if (w === 320) {
      for (const q of ['low', 'medium']) {
        await ev(`window.App.Board3D._current().scene.setQuality('${q}')`);
        await sleep(500);
        await ev(`(() => { App.Board3D.play([{ type:'dice', die:4 }]); return true; })()`);
        await waitToss();
        const f = await jump(q === 'low' ? 700 : 730);
        await sleep(100);
        const bytes = await shot(path.join(OUT, `${label}-hold-${q}.png`));
        size[`hold_${q}`] = { ...f, bytes };
        await resume();
        await waitFor("!window.App.Board3D._debug().busy", 30000);
        await sleep(500);
      }
      await ev(`window.App.Board3D._current().scene.setQuality('high')`);
    }
    report.sizes[label] = size;
    console.log(label, JSON.stringify({
      base: size.base, hand: size.hand,
      frames: Object.fromEntries(Object.entries(size.frames).map(([k, v]) => [k, { t: v.t, hand: v.hand, top: v.die && v.die.top, value: v.die && v.die.value, pos: v.die && v.die.pos, calls: v.calls, tris: v.tris }])),
      settled: { die: size.settledOverview.die, clear: { r: settledClear.r, phi: settledClear.phi, min: settledClear.min, footprint: settledClear.footprint, conservative: settledClear.conservative }, bytes: settledBytes },
      table: { stateDie: tableEnd.stateDie, logDie: tableEnd.logDie, top: tableEnd.probeDie && tableEnd.probeDie.top, phase: tableEnd.phase, rollT: tRoll.t, rollHand: tRoll.hand, clearMin: tableClear.min, bytes: tableBytes },
      low: size.hold_low && { t: size.hold_low.t, hand: size.hold_low.hand, calls: size.hold_low.calls, tris: size.hold_low.tris },
      medium: size.hold_medium && { t: size.hold_medium.t, hand: size.hold_medium.hand, calls: size.hold_medium.calls, tris: size.hold_medium.tris }
    }));
  }
  /* reduced：静态落位（只比 3D 宿主区域） */
  {
    await preparePage(390, 844, true);
    const before = await ev(`(() => { const sc=App.Board3D._current().scene; return { die: sc.dieDebug(), reduced: sc.reduced, raf: sc._raf }; })()`);
    await ev(`App.Board3D.play([{ type: 'dice', die: 5 }])`);
    await sleep(800);
    await freeze();
    const a = await ev(`(() => { const sc=App.Board3D._current().scene; sc._last=performance.now(); sc.renderNow(); const d=sc.dieDebug(); return { die:d, hand:d.hand, tossing:d.tossing, raf: sc._raf, reduced: sc.reduced, clear: null }; })()`);
    const clip = await hostClip();
    const b1 = await shot(path.join(OUT, `reduced-390x844-a.png`), clip);
    await sleep(500);
    const b2 = await shot(path.join(OUT, `reduced-390x844-b.png`), clip);
    report.reduced = { before, a, sameBytes: b1 === b2, bytes1: b1, bytes2: b2 };
    await resume();
    console.log('reduced', JSON.stringify(report.reduced));
  }
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  console.log('errors', JSON.stringify(errors.slice(0, 10)));
  await browser.send('Browser.close').catch(() => {});
  await sleep(200); try { process.kill(-edge.pid); } catch (e) { try { edge.kill(); } catch (e2) { /* noop */ } }
  server.close(); await fsp.rm(profile, { recursive: true, force: true }).catch(() => {});
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

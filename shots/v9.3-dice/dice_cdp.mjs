/* V9.3 摇骰（手拿起→抛出→弹跳→落中间）真实产物自测
 * Node + Edge/CDP（无外部依赖）。用 dist/v93 生产产物挂真实主桌：
 *  1) App.Board3D.play([{type:'dice',die:4}]) 直接驱动导演/场景，按时间抓 4 帧；
 *  2) 真实主桌 __V6_TEST__.forceDie(6) + 点击「掷骰」，验证 table→entry→director 全链路与骰面；
 *  3) reduced 下静态落位、两帧一致；
 *  4) 记录 draw/tris、手/骰子 NDC、骰面 top=引擎点数。
 * 用法: node shots/v9.3-dice/dice_cdp.mjs [--dist=dist/v93] [--out=shots/v9.3-dice]
 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const args = {};
for (const a of process.argv.slice(2)) { const m = /^--([^=]+)=(.*)$/.exec(a); if (m) args[m[1]] = m[2]; }
const DIST = path.resolve(ROOT, args.dist || 'dist/v93');
const OUT = path.resolve(ROOT, args.out || 'shots/v9.3-dice');
const SIZES = (args.sizes || '390x844,320x568,430x932').split(',').map((s) => s.split('x').map(Number));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8931, CDP_PORT = 9351;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.wav': 'audio/wav' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.p = new Map(); this.l = new Map();
    ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && this.p.has(m.id)) { const { r, j } = this.p.get(m.id); this.p.delete(m.id); m.error ? j(new Error(m.error.message)) : r(m.result); return; } if (m.method) for (const f of this.l.get(m.method) || []) f(m.params || {}); });
  }
  send(method, params = {}) { const id = ++this.id; return new Promise((r, j) => { this.p.set(id, { r, j }); this.ws.send(JSON.stringify({ id, method, params })); setTimeout(() => { if (this.p.has(id)) { this.p.delete(id); j(new Error('timeout ' + method)); } }, 120000); }); }
  on(m, f) { const a = this.l.get(m) || []; a.push(f); this.l.set(m, a); }
}
async function connect(url) { const ws = new WebSocket(url); await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', () => j(new Error('ws')), { once: true }); }); return new CDP(ws); }

/* 页内度量：骰子/手的世界点 → page 像素；draw/tris；play 状态 */
const MEASURE = `(() => {
  const sc = window.App.Board3D._current().scene;
  const host = document.querySelector('.v6-board3d');
  const hr = host.getBoundingClientRect();
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera);
    return { x: +(hr.left + (q.x + 1) / 2 * hr.width).toFixed(1), y: +(hr.top + (1 - q.y) / 2 * hr.height).toFixed(1), ndc: [+q.x.toFixed(3), +q.y.toFixed(3)] }; };
  const die = sc.dieDebug();
  let hand = null;
  if (sc._hand && sc._hand.group.visible) {
    sc._hand.group.updateWorldMatrix(true, false);
    const p = proj(sc._hand.group.getWorldPosition(new V()));
    const q = sc._hand.group.quaternion;
    hand = { page: { x: p.x, y: p.y }, ndc: p.ndc, quat: [+q.x.toFixed(3), +q.y.toFixed(3), +q.z.toFixed(3), +q.w.toFixed(3)] };
  }
  const dbg = window.App.Board3D._debug();
  return { die, hand, phase: dbg.phase, busy: dbg.busy, calls: dbg.drawCalls, tris: dbg.triangles, dpr: dbg.dpr, quality: dbg.quality, reduced: dbg.reduced,
    host: { x: +hr.x.toFixed(1), y: +hr.y.toFixed(1), w: +hr.width.toFixed(1), h: +hr.height.toFixed(1) },
    viewport: [sc.viewport.w, sc.viewport.h], aspect: +(sc.viewport.w / sc.viewport.h).toFixed(3),
    cam: { pos: sc.camera.position.toArray().map((v) => +v.toFixed(3)), fov: +sc.camera.fov.toFixed(1) },
    fps: +((dbg.fps || 0)).toFixed(1) };
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
  const profile = await fsp.mkdtemp(path.join(os.tmpdir(), 'edge-v93dice-'));
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + profile,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-networking',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--window-size=430,932', 'about:blank'], { stdio: 'ignore', detached: true });
  edge.unref();
  let ver = null;
  for (let i = 0; i < 150; i++) { await sleep(150); try { const r = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version'); ver = await r.json(); if (ver.webSocketDebuggerUrl) break; } catch (e) { /* wait */ } }
  if (!ver) throw new Error('Edge CDP not ready');
  const browser = await connect(ver.webSocketDebuggerUrl);
  const t = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/new?about:blank', { method: 'PUT' }).then((r) => r.json());
  const cdp = await connect(t.webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Log.enable');
  const errors = [];
  cdp.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error' || p.type === 'warning') errors.push([p.type, (p.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 300)]); });
  cdp.on('Runtime.exceptionThrown', (p) => errors.push(['pageerror', JSON.stringify(p.exceptionDetails).slice(0, 400)]));
  const ev = async (expr) => { const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return r.result && r.result.value; };
  const waitFor = async (expr, ms = 30000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await ev(`(() => { try { return (${expr}); } catch(e) { return null; } })()`)) return true; } catch (e) { /* retry */ } await sleep(120); } return false; };
  const shot = async (file, clip) => { const r = await cdp.send('Page.captureScreenshot', clip ? { format: 'png', clip: { x: clip.x, y: clip.y, width: clip.w, height: clip.h, scale: 1 }, captureBeyondViewport: false } : { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64')); return fs.statSync(file).size; };
  /* Headless SwiftShader 只有 ~3fps；「冻结 + 同步 renderNow」保证抓到的就是目标时刻的动画帧 */
  const freeze = async () => ev(`(() => { const sc=App.Board3D._current().scene; sc._paused = true; if (sc._raf) { cancelAnimationFrame(sc._raf); sc._raf = 0; }
    sc._last = performance.now(); sc.renderNow(); return true; })()`);
  const thaw = async () => ev(`(() => { const sc=App.Board3D._current().scene; sc._paused = false; sc._last = 0; sc._startLoop(); return true; })()`);

  const report = { dist: DIST, sizes: {}, errors, frames: {} };
  async function preparePage(w, h, reduced) {
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await waitFor("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))", 25000);
    await ev(`(() => { App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:${reduced ? 'true' : 'false'},board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}}); return true; })()`);
    await sleep(300);
    await ev(`(() => { const made=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(made.state); App.Router.reset('table'); return true; })()`);
    await sleep(1000);
    await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
    await sleep(300);
    await waitFor("document.querySelector('.v6-table') && document.querySelector('.v6-table').getAttribute('data-board3d') && document.querySelector('.v6-table').getAttribute('data-board3d') !== 'pending'", 40000);
    await sleep(2400);
  }

  async function captureFrame(label, targetMs, dieValue) {
    /* 重新起一段 play（直接驱动导演，不改棋局状态），按动画时刻冻结抓帧 */
    await ev(`(() => { window.__v93 = { t0: performance.now() };
      App.Board3D.play([{ type: 'dice', die: ${dieValue} }]);
      return performance.now(); })()`);
    let info = null;
    const deadline = Date.now() + 9000;
    while (Date.now() < deadline) {
      info = await ev(MEASURE);
      if (info.die.t !== null && info.die.t >= targetMs) break;
      if (info.die.t === null && !info.busy) break;
      await sleep(25);
    }
    await freeze();
    await sleep(120);
    const frozen = await ev(MEASURE);
    const at = frozen ? frozen.die.t : null;
    const bytes = await shot(path.join(OUT, `${label}.png`));
    await thaw();
    await waitFor("!window.App.Board3D._debug().busy", 12000);
    await sleep(900);   // 回俯瞰
    return { target: targetMs, at, info: frozen, bytes };
  }

  for (const [w, h] of SIZES) {
    const label = w + 'x' + h;
    const size = { label, frames: {} };
    /* ---------- 正常模式 ---------- */
    await preparePage(w, h, false);
    const base = await ev(MEASURE);
    size.base = base;
    /* 4 帧：手拿起(lift) / 抛出 / 第一次弹跳 / 落定 */
    for (const [name, ms] of [['hold', 640], ['throw', 900], ['bounce', 1210]]) {
      const f = await captureFrame(`${label}-${name}`, ms, 4);
      size.frames[name] = { at: f.at, die: f.info.die, hand: f.info.hand, calls: f.info.calls, tris: f.info.tris, phase: f.info.phase, bytes: f.bytes };
      report.frames[`${label}-${name}`] = f.info;
    }
    /* 落定（play 完整结束 + 回俯瞰后） */
    await ev(`(() => { window.__v93 = { t0: performance.now() };
      App.Board3D.play([{ type: 'dice', die: 4 }]);
      return true; })()`);
    await waitFor("!window.App.Board3D._debug().busy", 15000);
    await sleep(1200);
    await freeze();
    await sleep(120);
    const settled = await ev(MEASURE);
    const settledBytes = await shot(path.join(OUT, `${label}-settled.png`));
    await thaw();
    size.frames.settled = { die: settled.die, calls: settled.calls, tris: settled.tris, phase: settled.phase, bytes: settledBytes };
    report.frames[`${label}-settled`] = settled;
    /* 5) 真实主桌联动：forceDie(6) → 点掷骰 → 等结束 → 引擎点数 vs 骰面 */
    await ev(`window.__V6_TEST__.forceDie(6)`);
    await ev(`(() => { window.__t0 = performance.now(); document.querySelector('[data-test=roll]').click(); return true; })()`);
    const seen = { rollPhase: false, mid: null };
    for (let i = 0; i < 60; i++) {
      const st = await ev(`(() => { const d = window.App.Board3D._debug(); return { phase: d.phase, busy: d.busy, t: d.probe && d.probe.die ? d.probe.die.t : null, die: d.probe && d.probe.die ? d.probe.die : null }; })()`);
      if (st.phase === 'roll') { seen.rollPhase = true; if (!seen.mid && st.t !== null && st.t > 300) { seen.mid = st; await shot(path.join(OUT, `${label}-table-roll.png`)); } }
      if (!st.busy && seen.rollPhase && st.die && !st.die.tossing) break;
      await sleep(120);
    }
    await waitFor("!window.App.Board3D._debug().busy", 8000);
    await sleep(900);
    const tableEnd = await ev(`(() => {
      const st = window.__V6_TEST__.getState();
      const d = window.App.Board3D._debug();
      const die = st && st.rollContext && st.rollContext.die;
      let logDie = null; const log = (st && st.log) || [];
      for (let i = log.length - 1; i >= 0; i--) if (log[i] && log[i].kind === 'roll') { logDie = log[i].die; break; }
      return { stateDie: die, logDie, awaiting: st && st.awaiting && st.awaiting.type, phase: d.phase, probeDie: d.probe && d.probe.die, calls: d.drawCalls, tris: d.triangles };
    })()`);
    const tableBytes = await shot(path.join(OUT, `${label}-table-settled.png`));
    size.table = { ...seen, end: tableEnd, bytes: tableBytes };
    /* 320 额外：low / medium 画质也要看得见手 + 骰子 */
    if (w === 320) {
      for (const q of ['low', 'medium']) {
        await ev(`window.App.Board3D._current().scene.setQuality('${q}')`);
        await sleep(600);
        const f = await captureFrame(`${label}-hold-${q}`, 640, 4);
        size[`hold_${q}`] = { at: f.at, die: f.info.die, hand: f.info.hand, calls: f.info.calls, tris: f.info.tris, quality: f.info.quality, bytes: f.bytes };
      }
      await ev(`window.App.Board3D._current().scene.setQuality('high')`);
    }
    report.sizes[label] = size;
    console.log(label, JSON.stringify({ base: { calls: base.calls, tris: base.tris, aspect: base.aspect, fps: base.fps, host: base.host },
      frames: Object.fromEntries(Object.entries(size.frames).map(([k, v]) => [k, { at: v.at, top: v.die.top, value: v.die.value, hand: v.die.hand, pos: v.die.pos, calls: v.calls, tris: v.tris }])),
      table: { stateDie: tableEnd.stateDie, logDie: tableEnd.logDie, top: tableEnd.probeDie && tableEnd.probeDie.top, phase: tableEnd.phase, rollPhaseSeen: seen.rollPhase, mid: seen.mid && { t: seen.mid.t, top: seen.mid.die && seen.mid.die.top } },
      holdLow: size.hold_low && { at: size.hold_low.at, hand: size.hold_low.hand, top: size.hold_low.die.top, value: size.hold_low.die.value, calls: size.hold_low.calls, tris: size.hold_low.tris },
      holdMedium: size.hold_medium && { at: size.hold_medium.at, hand: size.hold_medium.hand, top: size.hold_medium.die.top, value: size.hold_medium.die.value, calls: size.hold_medium.calls, tris: size.hold_medium.tris } }));
  }

  /* ---------- reduced：静态落位，两帧一致（只比 3D 宿主区域） ---------- */
  {
    const [w, h] = [390, 844];
    await preparePage(w, h, true);
    const before = await ev(MEASURE);
    await ev(`App.Board3D.play([{ type: 'dice', die: 5 }])`);
    await sleep(700);
    const a = await ev(MEASURE);
    const clip = before.host;
    const b1 = await shot(path.join(OUT, `reduced-390x844-a.png`), clip);
    await sleep(500);
    const b2 = await shot(path.join(OUT, `reduced-390x844-b.png`), clip);
    const b = await ev(MEASURE);
    const raf = await ev(`(() => { const sc = App.Board3D._current().scene; return { raf: sc._raf, reduced: sc.reduced, paused: sc._paused }; })()`);
    report.reduced = { before: before.die, a: a.die, b: b.die, sameBytes: b1 === b2, bytes1: b1, bytes2: b2, raf, reduced: a.reduced, phase: a.phase, hand: a.hand };
    console.log('reduced', JSON.stringify(report.reduced));
  }

  await browser.send('Browser.close').catch(() => {});
  await sleep(300); try { process.kill(-edge.pid); } catch (e) { try { edge.kill(); } catch (e2) { /* noop */ } }
  server.close(); await fsp.rm(profile, { recursive: true, force: true }).catch(() => {});
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 1));
  console.log('errors:', errors.length, errors.slice(0, 8));
  console.log('OK ->', OUT);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

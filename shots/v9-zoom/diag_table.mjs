/* 诊断：3D 主桌缩放后相机距离/半径/帧数（320/430 的异常复核） */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9336;
const BASE = 'http://127.0.0.1:8795/dist/v9-zoom/index.html';
const SIZE = process.argv[2] || '320x568';
const [W, H] = SIZE.split('x').map(Number);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.h = [];
    ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { const p = this.pending.get(m.id); this.pending.delete(m.id); if (m.error) p.reject(new Error(m.error.message)); else p.resolve(m.result); }
      else for (const f of this.h) f(m); }); }
  static async connect(url) { const ws = new WebSocket(url); await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', () => rej(new Error('ws')), { once: true }); }); return new CDP(ws); }
  send(method, params) { const id = ++this.id; return new Promise((resolve, reject) => { this.pending.set(id, { resolve, reject }); this.ws.send(JSON.stringify({ id, method, params: params || {} })); setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout ' + method)); } }, 90000); }); }
  on(f) { this.h.push(f); }
}
async function ev(cdp, expr) { const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true }); if (r.exceptionDetails) return { err: JSON.stringify(r.exceptionDetails).slice(0, 300) }; return r.result && r.result.value; }
const STATE = `(() => {
  const inst = window.App.Board3D._current();
  if (!inst || !inst.scene) return null;
  const sc = inst.scene, rig = sc.rig, z = window.App.Board3D.zoomInfo();
  const V = sc.camera.position.constructor;
  const proj = (p) => p.clone().project(sc.camera);
  const pts = [];
  for (let i = 0; i < 32; i++) { const a = i / 32 * Math.PI * 2; pts.push(proj(sc.boardGroup.localToWorld(new V(Math.cos(a) * 3.3, 0.035, Math.sin(a) * 3.3)))); }
  const xs = pts.map(p => p.x);
  const cp = sc.camera.position.clone(), ct = rig.state.center.clone();
  return {
    zoom: z, phase: (document.querySelector('[data-test=board3d]') || {}).getAttribute ? document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase') : '',
    radius: +rig.state.radius.toFixed(4), dist: +cp.distanceTo(ct).toFixed(4),
    ny: rig.state.ny, nx: rig.state.nx,
    center: [ +ct.x.toFixed(3), +ct.y.toFixed(3), +ct.z.toFixed(3) ],
    cam: [ +cp.x.toFixed(3), +cp.y.toFixed(3), +cp.z.toFixed(3) ],
    elev: rig.state.elev, azim: rig.state.azim, fov: rig.state.fov,
    boardNdcW: +(Math.max(...xs) - Math.min(...xs)).toFixed(4),
    aspect: +rig.aspect.toFixed(4), viewport: [sc.viewport.w, sc.viewport.h],
    frames: sc.perf.frames, reduced: sc.reduced, ready: inst.ready, can: inst.canZoom()
  };
})()`;
async function main() {
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + path.join(process.env.TEMP || '.', 'edge-diag-' + Date.now()),
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=460,940',
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let ws = null;
  for (let i = 0; i < 120; i++) { await sleep(150); try { const j = await fetch('http://127.0.0.1:' + PORT + '/json/version').then(r => r.json()); if (j.webSocketDebuggerUrl) { ws = j.webSocketDebuggerUrl; break; } } catch (e) {} }
  const browser = await CDP.connect(ws);
  const t = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await fetch('http://127.0.0.1:' + PORT + '/json/list').then(r => r.json());
  const cdp = await CDP.connect(list.find(x => x.id === t.targetId).webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  const logs = [];
  cdp.on((m) => { if (m.method === 'Runtime.exceptionThrown') logs.push('pageerror ' + ((m.params.exceptionDetails.exception || {}).description || '').slice(0, 300)); });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(1500);
  const tap = (s) => ev(cdp, `(() => { const el = document.querySelector(${JSON.stringify(s)}); if (!el) return false; el.click(); return true; })()`);
  if (await ev(cdp, `!!document.querySelector('[data-test=rules-sheet]')`)) { await tap('[data-test=rules-ok]'); await sleep(300); }
  console.log('start', await tap('[data-test=start]'));
  await sleep(6000);
  const out = {};
  out.initial = await ev(cdp, STATE);
  out.loop = await ev(cdp, `(() => { const sc = window.App.Board3D._current().scene; return { raf: !!sc._raf, paused: sc._paused, hidden: document.hidden, reduced: sc.reduced, quality: sc.quality, frames: sc.perf.frames }; })()`);
  await ev(cdp, 'window.App.Board3D._current().scene.rig.apply()');
  out.afterManualApply = await ev(cdp, STATE);
  const btn = await ev(cdp, `(() => { const el = document.querySelector('[data-test=board3d-zoom-in]'); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; })()`);
  out.btn = btn;
  await ev(cdp, 'window.App.Board3D.setZoom(1.5)');
  await sleep(3000);
  out.zoom15 = await ev(cdp, STATE);
  await ev(cdp, 'window.App.Board3D.setZoom(0.8)');
  await sleep(3000);
  out.zoom08 = await ev(cdp, STATE);
  await ev(cdp, 'window.App.Board3D.resetZoom()');
  await sleep(1500);
  out.reset = await ev(cdp, STATE);
  if (btn) {
    await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x: btn.x, y: btn.y, button: 'left', clickCount: 1 });
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: btn.x, y: btn.y, button: 'left', clickCount: 1 });
    await sleep(2500);
    out.afterClick = await ev(cdp, STATE);
  }
  console.log(JSON.stringify({ size: SIZE, out, logs }, null, 1));
  try { edge.kill(); } catch (e) {}
}
main().catch(e => { console.error('FATAL', e); process.exit(1); });


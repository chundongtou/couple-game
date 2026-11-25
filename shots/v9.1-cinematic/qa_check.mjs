/* V9.1 · 3D 场景丰富度自检（Node + Edge/CDP，无外部依赖）
 * 1) 桌面小物落点：投影到屏幕，算与棋盘轮廓（环格投影多边形）的距离，>0 = 不压棋盘
 *    （棋盘轮廓 = 环格 R=3.30 的 64 点投影；负值 = 落在棋盘画面内，需调位置）
 * 2) cell45/bear 期间：小物落点是否压到 3D 格子/小熊（题卡区为 DOM，canvas 永在 DOM 下）
 * 3) reduced：两帧截图字节相同 + _raf=0 → 静态
 * 4) low：propGroup/steam/motes 关闭、点光归零、draw 下降
 * 5) 0 console error/pageerror
 * 用法: node qa_check.mjs [--out=shots/v9.1-cinematic/qa]
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const SERVER_PORT = 8793;
const CDP_PORT = 9336;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const args = {};
for (const a of process.argv.slice(2)) { const m = /^--([^=]+)=(.*)$/.exec(a); if (m) args[m[1]] = m[2]; }
const OUT = path.isAbsolute(args.out || '') ? args.out : path.join(REPO, args.out || 'shots/v9.1-cinematic/qa');
const SIZES = { '390x844': [366, 552], '320x568': [296, 303], '430x932': [406, 640] };

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = [];
    ws.addEventListener('message', (ev) => { const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { const { resolve, reject } = this.pending.get(m.id); this.pending.delete(m.id);
        if (m.error) reject(new Error(m.error.message)); else resolve(m.result); } else for (const h of this.handlers) h(m); }); }
  static async connect(url) { const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', () => rej(new Error('ws')), { once: true }); });
    return new CDP(ws); }
  send(method, params) { const id = ++this.id;
    return new Promise((resolve, reject) => { this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout ' + method)); } }, 120000); }); }
  on(fn) { this.handlers.push(fn); }
  close() { try { this.ws.close(); } catch (e) { /* noop */ } }
}
async function evalJs(cdp, expression) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) throw new Error('EvalError: ' + JSON.stringify(r.exceptionDetails).slice(0, 800));
  return r.result && r.result.value;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PROP_CHECK = `(() => {
  const sc = window.App.Board3D._current().scene;
  const W = sc.viewport.w, H = sc.viewport.h;
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H }; };
  const ring = [];
  for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2; ring.push(proj(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30))); }
  const inside = (p, poly) => { let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if (((a.y > p.y) !== (b.y > p.y)) && (p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x)) c = !c;
    } return c; };
  const segDist = (p, a, b) => {
    const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  };
  const props = {};
  const anchors = sc.propAnchors || {};
  for (const [name, g] of Object.entries(anchors)) {
    g.updateWorldMatrix(true, false);
    const p = proj(g.getWorldPosition(new V()));
    let d = 1e9;
    for (let i = 0; i < ring.length; i++) d = Math.min(d, segDist(p, ring[i], ring[(i + 1) % ring.length]));
    props[name] = { x: +p.x.toFixed(1), y: +p.y.toFixed(1), clearancePx: +(inside(p, ring) ? -d : d).toFixed(1),
      onScreen: p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H };
  }
  const dbg = window.App.Board3D._debug();
  return { viewport: [W, H], props, calls: dbg.drawCalls, tris: dbg.triangles, quality: dbg.quality,
    propGroupVisible: !!(sc.propGroup && sc.propGroup.visible), reduced: sc.reduced };
})()`;

const STAGE_CHECK = `(() => {
  const sc = window.App.Board3D._current().scene;
  const W = sc.viewport.w, H = sc.viewport.h;
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H }; };
  const box = (pts) => { const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    return { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1), y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) }; };
  const r = 24 * Math.PI / 180, hw = 0.21;
  const plate = box([[-hw,-hw],[hw,-hw],[hw,hw],[-hw,hw]].map(([dx,dz]) =>
    proj(sc.stageGroup.localToWorld(new V(dx*Math.cos(r)+dz*Math.sin(r), 0.075, -dx*Math.sin(r)+dz*Math.cos(r))))));
  const bearPts = [];
  sc.bear.group.updateWorldMatrix(true, true);
  sc.bear.group.traverse((o) => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 3) bearPts.push(proj(new V().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld))); });
  const bear = bearPts.length ? box(bearPts) : null;
  const hit = (p, b, pad) => p && b && p.x > b.x0 - pad && p.x < b.x1 + pad && p.y > b.y0 - pad && p.y < b.y1 + pad;
  const props = {};
  for (const [name, g] of Object.entries(sc.propAnchors || {})) {
    g.updateWorldMatrix(true, false);
    const q = proj(g.getWorldPosition(new V()));
    props[name] = { x: +q.x.toFixed(1), y: +q.y.toFixed(1), onPlate: hit(q, plate, 10), onBear: hit(q, bear, 10) };
  }
  return { phase: window.__host.getAttribute('data-3d-phase'), plate, bear, props,
    hits: Object.entries(props).filter(([,v]) => v.onPlate || v.onBear).map(([k]) => k),
    cardLeftPx: +(0.40 * W).toFixed(1) };
})()`;

const SETUP = (w, h) => `(() => {
  window.App.Board3D.unmount();
  document.body.innerHTML = '';
  const h = document.createElement('div');
  h.id = 'host';
  h.setAttribute('aria-hidden', 'true');
  h.style.cssText = 'position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#05080d';
  document.body.style.cssText = 'margin:0;padding:0;background:#05080d;overflow:hidden';
  document.body.appendChild(h); window.__host = h; return true;
})()`;

const MOUNT = (reduced) => `(async () => {
  const st = window.__demo.state();
  const view = window.App.Flight.view(st, { reduced: ${reduced ? 'true' : 'false'} });
  const inst = await window.App.Board3D.mount(window.__host, {
    reduced: ${reduced ? 'true' : 'false'}, theme: 'cloud', state: st, view,
    mode: 'quick', sound: false, adapt: false, shadows: true, stageAim: { nx: -0.6, ny: 0.14 } });
  window.__inst = inst;
  await new Promise((r) => setTimeout(r, 600));
  return !!inst;
})()`;

const PLAY_PROMPT = `(() => {
  const st = JSON.parse(JSON.stringify(window.__demo.state()));
  const p = st.pieces.find((x) => x.id === 'a:0');
  if (p) { p.squareId = 'ring:23'; p.arrived = false; }
  window.App.Board3D.setState(st, window.App.Flight.view(st, { reduced: false }));
  window.App.Board3D.play([{ type: 'move', pieceId: 'a:0', path: ['ring:24', 'ring:25'] },
    { type: 'prompt', prompt: { kind: 'cell', type: 'dare' } }]);
  return true;
})()`;

const WAIT_PHASES = (list, ms) => `new Promise((resolve) => {
  const want = ${JSON.stringify(list)}, t0 = Date.now();
  const tick = () => { const ph = window.__host && window.__host.getAttribute('data-3d-phase');
    if (want.indexOf(ph) >= 0) return resolve(ph);
    if (Date.now() - t0 > ${ms}) return resolve(ph || 'timeout');
    setTimeout(tick, 40); };
  tick();
})`;

async function shot(cdp, file) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  return r.data.length;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const userDir = path.join(process.env.TEMP || '.', 'edge-v91qa-' + Date.now());
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=460,900',
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let wsUrl = null;
  for (let i = 0; i < 100; i++) { await sleep(150);
    try { const j = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version')).json(); wsUrl = j.webSocketDebuggerUrl; if (wsUrl) break; } catch (e) { /* wait */ } }
  if (!wsUrl) throw new Error('CDP not ready');
  const browser = await CDP.connect(wsUrl);
  const target = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await (await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list')).json();
  const page = list.find((t) => t.id === target.targetId);
  const cdp = await CDP.connect(page.webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable');
  const errors = [];
  cdp.on((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning'))
      errors.push([m.params.type, (m.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240)]);
    if (m.method === 'Runtime.exceptionThrown')
      errors.push(['pageerror', JSON.stringify(m.params.exceptionDetails).slice(0, 300)]);
  });
  const report = { generatedAt: new Date().toISOString(), sizes: {}, reduced: {}, low: {}, errors };
  for (const size of Object.keys(SIZES)) {
    const [w, h] = SIZES[size];
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: Math.max(w, 430), height: Math.max(h, 700), deviceScaleFactor: 2, mobile: false });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
    for (let i = 0; i < 200; i++) { await sleep(120); if (await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`)) break; }
    await sleep(300);
    await evalJs(cdp, SETUP(w, h));
    await evalJs(cdp, MOUNT(false));
    await sleep(900);
    const overview = await evalJs(cdp, PROP_CHECK);
    const bad = Object.entries(overview.props).filter(([, v]) => v.clearancePx < 4).map(([k]) => k);
    const off = Object.entries(overview.props).filter(([, v]) => !v.onScreen).map(([k]) => k);
    overview.propsOnBoard = bad;
    overview.propsOffScreen = off;
    /* cell45 / bear：小物是否压格子或小熊 */
    await evalJs(cdp, PLAY_PROMPT);
    const cellPhase = await evalJs(cdp, WAIT_PHASES(['cell45', 'bear'], 25000));
    await sleep(1800);
    const cell = await evalJs(cdp, STAGE_CHECK);
    await shot(cdp, path.join(OUT, `qa-${size}-cell45.png`));
    const bearPhase = await evalJs(cdp, WAIT_PHASES(['bear'], 12000));
    await sleep(2600);
    const bear = await evalJs(cdp, STAGE_CHECK);
    await shot(cdp, path.join(OUT, `qa-${size}-bear.png`));
    report.sizes[size] = { overview, cellPhase, cell, bearPhase, bear };
  }
  /* reduced 静态：同尺寸两帧字节一致 */
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 430, height: 700, deviceScaleFactor: 2, mobile: false });
  for (const size of ['390x844']) {
    const [w, h] = SIZES[size];
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
    for (let i = 0; i < 200; i++) { await sleep(120); if (await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`)) break; }
    await sleep(300);
    await evalJs(cdp, SETUP(w, h));
    await evalJs(cdp, MOUNT(true));
    await sleep(700);
    const a = await shot(cdp, path.join(OUT, `qa-${size}-reduced-a.png`));
    const state1 = await evalJs(cdp, `(() => { const sc = window.App.Board3D._current().scene;
      return { reduced: sc.reduced, raf: sc._raf, cam: sc.camera.position.toArray().map(v => +v.toFixed(5)),
        steamVisible: sc.steam ? sc.steam.map(s => s.visible) : null, frame0: sc.perf.frames }; })()`);
    await sleep(900);
    const b = await shot(cdp, path.join(OUT, `qa-${size}-reduced-b.png`));
    const state2 = await evalJs(cdp, `(() => { const sc = window.App.Board3D._current().scene;
      return { reduced: sc.reduced, raf: sc._raf, cam: sc.camera.position.toArray().map(v => +v.toFixed(5)),
        steamVisible: sc.steam ? sc.steam.map(s => s.visible) : null, frame0: sc.perf.frames }; })()`);
    report.reduced[size] = { bytesA: a, bytesB: b, identical: a === b, state1, state2 };
  }
  /* low 画质：小物/粒子关闭 */
  {
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
    for (let i = 0; i < 200; i++) { await sleep(120); if (await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`)) break; }
    await sleep(300);
    await evalJs(cdp, SETUP(366, 552));
    await evalJs(cdp, MOUNT(false));
    await sleep(600);
    const before = await evalJs(cdp, PROP_CHECK);
    await evalJs(cdp, `window.App.Board3D._current().scene.setQuality('low')`);
    await sleep(900);
    const low = await evalJs(cdp, `(() => { const sc = window.App.Board3D._current().scene;
      return { quality: sc.quality, propGroup: !!(sc.propGroup && sc.propGroup.visible),
        steam: sc.steam ? sc.steam.map(s => s.visible) : null, motes: sc.motes ? sc.motes.visible : null,
        deskLight: sc.deskLight ? sc.deskLight.intensity : null, candleLight: sc.candleLight ? sc.candleLight.intensity : null,
        fog: !!sc.scene.fog, calls: sc.lastCalls, tris: sc.lastTris,
        textures: sc._tex.length, env: !!sc.scene.environment, propsQuality: window.App.Board3D._current().scene.quality }; })()`);
    await shot(cdp, path.join(OUT, `qa-390x844-low.png`));
    report.low = { before, low };
  }
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
  fs.writeFileSync(path.join(OUT, 'qa-report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify({
    sizes: Object.fromEntries(Object.entries(report.sizes).map(([k, v]) => [k, {
      calls: v.overview.calls, tris: v.overview.tris,
      propsOnBoard: v.overview.propsOnBoard, propsOffScreen: v.overview.propsOffScreen,
      cellHits: v.cell.hits, bearHits: v.bear.hits, cellPhase: v.cellPhase, bearPhase: v.bearPhase
    }])),
    reduced: report.reduced['390x844'],
    low: { propGroup: report.low.low.propGroup, steam: report.low.low.steam, motes: report.low.low.motes,
      deskLight: report.low.low.deskLight, calls: report.low.low.calls, tris: report.low.low.tris },
    errors: errors.slice(0, 10)
  }, null, 1));
  console.log('OK ->', OUT);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

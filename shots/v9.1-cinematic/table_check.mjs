/* V9.1 follow-up · 真实主桌 3D 度量（Node + Edge/CDP，无外部依赖）
 * 用 dist 生产产物（非 demo）挂真实主桌：量 .v6-board3d 宿主、HUD/掷骰条/行动区/缩放按钮 DOM 矩形，
 * 再把 3D 小物锚点投影到 page 坐标：算与棋盘轮廓距离、是否压缩放按钮/落在宿主外。
 * 另用 App.Board3D.play 触发 cell45/bear（真宿主/真相机）检查小物是否压 3D 格子/小熊。
 * 用法: node table_check.mjs --dist=dist/rebuild-v91-cine --out=shots/v9.1-cinematic/table [--tag=real]
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
const DIST = path.resolve(ROOT, args.dist || 'dist/rebuild-v91-cine');
const OUT = path.resolve(ROOT, args.out || 'shots/v9.1-cinematic/table');
const TAG = args.tag || 'real';
const SIZES = (args.sizes || '390x844,320x568,430x932').split(',').map((s) => s.split('x').map(Number));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8927, CDP_PORT = 9347;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) { this.ws = ws; this.id = 0; this.p = new Map(); this.l = new Map();
    ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && this.p.has(m.id)) { const { r, j } = this.p.get(m.id); this.p.delete(m.id); m.error ? j(new Error(m.error.message)) : r(m.result); return; } if (m.method) for (const f of this.l.get(m.method) || []) f(m.params || {}); }); }
  send(method, params = {}) { const id = ++this.id; return new Promise((r, j) => { this.p.set(id, { r, j }); this.ws.send(JSON.stringify({ id, method, params })); setTimeout(() => { if (this.p.has(id)) { this.p.delete(id); j(new Error('timeout ' + method)); } }, 120000); }); }
  on(m, f) { const a = this.l.get(m) || []; a.push(f); this.l.set(m, a); }
}
async function connect(url) { const ws = new WebSocket(url); await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', () => j(new Error('ws')), { once: true }); }); return new CDP(ws); }

const MEASURE = `(() => {
  const host = document.querySelector('.v6-board3d');
  const sc = window.App.Board3D._current().scene;
  const hr = host.getBoundingClientRect();
  const W = sc.viewport.w, H = sc.viewport.h;
  const sx = hr.width / W, sy = hr.height / H;
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera);
    return { x: +(hr.left + (q.x + 1) / 2 * W * sx).toFixed(1), y: +(hr.top + (1 - q.y) / 2 * H * sy).toFixed(1) }; };
  const ring = [];
  for (let i = 0; i < 64; i++) { const a = i / 64 * Math.PI * 2; ring.push(proj(sc.boardGroup.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30)))); }
  const xs = ring.map(p => p.x), ys = ring.map(p => p.y);
  const board = { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1), y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) };
  const inside = (p) => { let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) { const a = ring[i], b = ring[j];
      if (((a.y > p.y) !== (b.y > p.y)) && (p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x)) c = !c; } return c; };
  const segDist = (p, a, b) => { const dx = b.x - a.x, dy = b.y - a.y;
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)); };
  const props = {};
  for (const [name, g] of Object.entries(sc.propAnchors || {})) {
    g.updateWorldMatrix(true, false);
    const p = proj(g.getWorldPosition(new V()));
    let d = 1e9;
    for (let i = 0; i < ring.length; i++) d = Math.min(d, segDist(p, ring[i], ring[(i + 1) % ring.length]));
    props[name] = { x: p.x, y: p.y, clearancePx: +(inside(p) ? -d : d).toFixed(1),
      inHost: p.x >= hr.left && p.x <= hr.right && p.y >= hr.top && p.y <= hr.bottom };
  }
  const rct = (sel) => { const el = typeof sel === 'string' ? document.querySelector(sel) : sel; if (!el || !el.getBoundingClientRect) return null;
    const r = el.getBoundingClientRect(); if (!r.width && !r.height) return null;
    return { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1), bottom: +r.bottom.toFixed(1), right: +r.right.toFixed(1) }; };
  const dom = {
    host: rct(host), wrap: rct('.v6-boardwrap'), hud: rct('.v6-hud'), status: rct('.v6-status'),
    turns: rct('.v6-turns'), rollstrip: rct('.v6-rollstrip'), action: rct('.v6-action'),
    rollBtn: rct('[data-test=roll]'), safe: rct('[data-test=safety-word]'),
    zoomIn: rct('[data-test=board3d-zoom-in]'), zoomOut: rct('[data-test=board3d-zoom-out]'), zoomReset: rct('[data-test=board3d-zoom-reset]'),
    cardhost: rct('.v6-cardhost')
  };
  /* 小物锚点（±16px）是否压缩放按钮（按钮下的小物会被按钮挡住/读不出） */
  const hitBox = (p, b, pad) => p && b && p.x > b.x - pad && p.x < b.right + pad && p.y > b.y - pad && p.y < b.bottom + pad;
  const zoomHits = [], underUi = [];
  for (const [name, p] of Object.entries(props)) {
    if (hitBox(p, dom.zoomIn, 16) || hitBox(p, dom.zoomOut, 16) || hitBox(p, dom.zoomReset, 16)) zoomHits.push(name);
    if (dom.action && p.y > dom.action.y - 8) underUi.push(name);
  }
  const outside = Object.entries(props).filter(([, v]) => !v.inHost).map(([k]) => k);
  return { size: [window.innerWidth, window.innerHeight], dpr: window.devicePixelRatio,
    hostRect: dom.host, sceneViewport: [W, H], viewportScale: [+sx.toFixed(3), +sy.toFixed(3)],
    quality: sc.quality, board, dom, props, boardHit: Object.entries(props).filter(([, v]) => v.clearancePx < 2).map(([k]) => k),
    zoomHits, underUi, outside,
    propsVisible: Object.entries(props).filter(([, v]) => v.inHost && v.clearancePx > 2 && v.y < (dom.action ? dom.action.y : 1e9)).map(([k]) => k) };
})()`;

const STAGE = `(() => {
  const host = document.querySelector('.v6-board3d');
  const sc = window.App.Board3D._current().scene;
  const hr = host.getBoundingClientRect();
  const W = sc.viewport.w, H = sc.viewport.h;
  const sx = hr.width / W, sy = hr.height / H;
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera);
    return { x: +(hr.left + (q.x + 1) / 2 * W * sx).toFixed(1), y: +(hr.top + (1 - q.y) / 2 * H * sy).toFixed(1) }; };
  const box = (pts) => { const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
    return { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1), y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) }; };
  const r = 24 * Math.PI / 180, hw = 0.21;
  const plate = box([[-hw,-hw],[hw,-hw],[hw,hw],[-hw,hw]].map(([dx,dz]) =>
    proj(sc.stageGroup.localToWorld(new V(dx*Math.cos(r)+dz*Math.sin(r), 0.075, -dx*Math.sin(r)+dz*Math.cos(r))))));
  const bp = [];
  sc.bear.group.updateWorldMatrix(true, true);
  sc.bear.group.traverse((o) => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    for (let i = 0; i < pos.count; i += 3) bp.push(proj(new V().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld))); });
  const bear = bp.length ? box(bp) : null;
  const hit = (p, b, pad) => p && b && p.x > b.x0 - pad && p.x < b.x1 + pad && p.y > b.y0 - pad && p.y < b.y1 + pad;
  const props = {};
  for (const [name, g] of Object.entries(sc.propAnchors || {})) {
    g.updateWorldMatrix(true, false);
    const p = proj(g.getWorldPosition(new V()));
    props[name] = { x: p.x, y: p.y, onPlate: hit(p, plate, 10), onBear: hit(p, bear, 10) };
  }
  return { phase: window.__host ? window.__host.getAttribute('data-3d-phase') : document.querySelector('.v6-board3d') && document.querySelector('.v6-board3d').getAttribute('data-3d-phase'),
    plate, bear, props, hits: Object.entries(props).filter(([, v]) => v.onPlate || v.onBear).map(([k]) => k),
    hostRect: { x: +hr.x.toFixed(1), y: +hr.y.toFixed(1), w: +hr.width.toFixed(1), h: +hr.height.toFixed(1) } };
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
  const profile = await fsp.mkdtemp(path.join(os.tmpdir(), 'edge-v91tbl-'));
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
  cdp.on('Runtime.consoleAPICalled', (p) => { if (p.type === 'error' || p.type === 'warning') errors.push([p.type, (p.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240)]); });
  cdp.on('Runtime.exceptionThrown', (p) => errors.push(['pageerror', JSON.stringify(p.exceptionDetails).slice(0, 300)]));
  const ev = async (expr) => { const r = await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true, userGesture: true });
    if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception || {}).description || r.exceptionDetails.text); return r.result && r.result.value; };
  const waitFor = async (expr, ms = 30000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { try { if (await ev(`(() => { try { return (${expr}); } catch(e) { return null; } })()`)) return true; } catch (e) { /* retry */ } await sleep(120); } return false; };
  const shot = async (file) => { const r = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(file, Buffer.from(r.data, 'base64')); };
  const report = { dist: DIST, tag: TAG, sizes: {}, errors };
  for (const [w, h] of SIZES) {
    const label = w + 'x' + h;
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });
    await waitFor("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))", 25000);
    await ev(`(() => { App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:false,board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}}); return true; })()`);
    await sleep(500);
    await ev(`(() => { const made=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(made.state); App.Router.reset('table'); return true; })()`);
    await sleep(1200);
    await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
    await sleep(400);
    await waitFor("document.querySelector('.v6-table') && document.querySelector('.v6-table').getAttribute('data-board3d') && document.querySelector('.v6-table').getAttribute('data-board3d') !== 'pending'", 40000);
    await sleep(2600);
    const m = await ev(MEASURE);
    report.sizes[label] = { measure: m, stage: null };
    await shot(path.join(OUT, `${TAG}-${label}-overview.png`));
    /* low 画质：慢设备自适应降档后小物仍应可见（V9.1 follow-up 的真实主因） */
    const q0 = m.quality;
    await ev(`window.App.Board3D._current().scene.setQuality('low')`);
    await sleep(900);
    report.sizes[label].low = await ev(`(() => { const sc = window.App.Board3D._current().scene; const dbg = window.App.Board3D._debug();
      return { quality: sc.quality, propGroup: !!(sc.propGroup && sc.propGroup.visible),
        steam: sc.steam ? sc.steam.map((s) => s.visible) : null, motes: sc.motes ? sc.motes.visible : null,
        deskLight: sc.deskLight ? sc.deskLight.intensity : null, calls: dbg.drawCalls, tris: dbg.triangles, shadows: dbg.shadows, dpr: dbg.dpr }; })()`);
    report.sizes[label].lowMeasure = await ev(MEASURE);
    await shot(path.join(OUT, `${TAG}-${label}-low.png`));
    await ev(`window.App.Board3D._current().scene.setQuality('${q0}')`);
    await sleep(500);
    /* 真宿主/真相机下触发 3D cell45 / bear（不改 table 流程，只驱动 App.Board3D） */
    await ev(`(() => { const g = App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'});
      const st = g.state; const p = st.pieces.find((x) => x.id === 'a:0'); if (p) { p.squareId = 'ring:23'; p.arrived = false; }
      App.Board3D.setState(st, App.Flight.view(st, { reduced: false }));
      App.Board3D.play([{ type: 'move', pieceId: 'a:0', path: ['ring:24', 'ring:25'] }, { type: 'prompt', prompt: { kind: 'cell', type: 'dare' } }]);
      return true; })()`);
    await waitFor("(window.App.Board3D._debug().phase === 'cell45' || window.App.Board3D._debug().phase === 'bear')", 25000);
    await sleep(1800);
    report.sizes[label].stage = await ev(STAGE);
    await shot(path.join(OUT, `${TAG}-${label}-cell45.png`));
    await waitFor("window.App.Board3D._debug().phase === 'bear'", 12000);
    await sleep(2800);
    report.sizes[label].bear = await ev(STAGE);
    await shot(path.join(OUT, `${TAG}-${label}-bear.png`));
    console.log(label, JSON.stringify({ host: m.hostRect, board: m.board, quality: m.quality,
      propsVisible: m.propsVisible, boardHit: m.boardHit, zoomHits: m.zoomHits, outside: m.outside,
      stageHits: report.sizes[label].stage && report.sizes[label].stage.hits,
      bearHits: report.sizes[label].bear && report.sizes[label].bear.hits }));
  }
  await browser.send('Browser.close').catch(() => {});
  await sleep(300); try { process.kill(-edge.pid); } catch (e) { try { edge.kill(); } catch (e2) { /* noop */ } }
  server.close(); await fsp.rm(profile, { recursive: true, force: true }).catch(() => {});
  fs.writeFileSync(path.join(OUT, `${TAG}-report.json`), JSON.stringify(report, null, 1));
  console.log('errors:', errors.length, errors.slice(0, 5));
  console.log('OK ->', OUT);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

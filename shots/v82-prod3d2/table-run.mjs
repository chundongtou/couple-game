/* V8.2 prod3d2 · 真实 table 集成自测（Node + Edge/CDP，不改产品代码）
 * 用法: node table-run.mjs --out=shots/v82-prod3d2/table --tag=after [--sizes=390x844,320x568,430x932]
 * 走真实引擎：rules-ok → board3d=on → start → 掷 6 起飞 → 掷 2 落到真心话格（cell45+bear 持卡）。
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const SERVER_PORT = 8793;
const CDP_PORT = 9334;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = {};
for (const a of process.argv.slice(2)) {
  const m = /^--([^=]+)=(.*)$/.exec(a);
  if (m) args[m[1]] = m[2];
}
const OUT = path.isAbsolute(args.out || '') ? args.out : path.join(REPO, args.out || 'shots/v82-prod3d2/table');
const TAG = args.tag || 'after';
const SIZES = { '390x844': [390, 844], '320x568': [320, 568], '430x932': [430, 932] };
const want = (args.sizes || '390x844,320x568,430x932').split(',');
const DIST = args.dist || 'dist/rebuild-v8-prod3d2/index.html';
/* --gpu：不强制 SwiftShader，用真 GPU（Intel Arc D3D11）量帧时间；默认软渲染仅作视觉基线 */
const GPU = !!args.gpu;
const GPU_FLAGS = GPU ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-gpu-sandbox']
  : ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'];

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      } else for (const h of this.handlers) h(msg);
    });
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', () => rej(new Error('ws error')), { once: true });
    });
    return new CDP(ws);
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout ' + method)); } }, 180000);
    });
  }
  on(fn) { this.handlers.push(fn); }
  close() { try { this.ws.close(); } catch (e) { /* noop */ } }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function evalJs(cdp, expression, awaitPromise = true) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) throw new Error('EvalError: ' + JSON.stringify(r.exceptionDetails).slice(0, 500));
  return r.result && r.result.value;
}
async function click(cdp, sel) {
  const ok = await evalJs(cdp, `(() => { const el = document.querySelector(${JSON.stringify(sel)}); if (!el) return false; el.click(); return true; })()`);
  if (!ok) throw new Error('click miss: ' + sel);
}
async function waitFor(cdp, expr, ms, label) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await evalJs(cdp, expr)) return true;
    await sleep(70);
  }
  throw new Error('waitFor timeout: ' + (label || expr));
}
async function shotPage(cdp, file) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

const GEOM = `(() => {
  window.__host = document.querySelector('[data-test=board3d]');
  const inst = window.App.Board3D._current();
  const sc = inst && inst.scene;
  const host = window.__host;
  if (!sc || !host) return null;
  const V = sc.camera.position.constructor;
  const W = sc.viewport.w, H = sc.viewport.h;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H }; };
  const box = (pts) => {
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1),
             y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) };
  };
  const b = sc.boardGroup;
  const ringPts = [], ring323 = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ringPts.push(proj(b.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30))));
    ring323.push(proj(b.localToWorld(new V(Math.cos(a) * 3.23, 0.095, Math.sin(a) * 3.23))));
  }
  const board = box(ringPts), ring = box(ring323);
  const hostR = host.getBoundingClientRect();
  const out = {
    viewport: [W, H], phase: host.getAttribute('data-3d-phase'),
    board, boardFracW: +((board.x1 - board.x0) / W).toFixed(4),
    ring323Box: ring, ringFracW: +((ring.x1 - ring.x0) / W).toFixed(4),
    gapTop: +board.y0.toFixed(1), gapBot: +(H - board.y1).toFixed(1),
    cardLeftPx: +(0.40 * W).toFixed(1),
    hostRect: { x: +hostR.x.toFixed(1), y: +hostR.y.toFixed(1), w: +hostR.width.toFixed(1), h: +hostR.height.toFixed(1) },
    flyMode: !!sc.flyMode
  };
  if (sc.stageGroup && sc.stageGroup.visible) {
    /* 舞台格：直接读真实几何顶点（版本无关，before/after 可比） */
    if (sc.stageTile && sc.stageTile.geometry) {
      /* 直接投真实顶点（格面 4 角 + 侧面），不用 bbox 8 角（旋转后的 AABB 会放大） */
      const g = sc.stageTile.geometry;
      const pos = g.attributes && g.attributes.position;
      const pts = [];
      if (pos) {
        sc.stageTile.updateWorldMatrix(true, false);
        for (let i = 0; i < pos.count; i++) {
          pts.push(proj(new V().fromBufferAttribute(pos, i).applyMatrix4(sc.stageTile.matrixWorld)));
        }
      }
      if (pts.length) out.plate = box(pts);
      out.plateVerts = pos ? pos.count : 0;
    }
    /* 格面字：按当前贴图布局（u=0.58 / v=0.70，字心距格心 +0.034/+0.084 世界）估算，
     * 文字框半宽 0.075、半高 0.080 —— after 代码的图是这么画的；before 图是居中的，
     * 所以 before 的 glyph 框只作参考，判读以截图为准。 */
    const r = 24 * Math.PI / 180;
    const gpts = [];
    for (const [dx, dz] of [[-0.075, -0.08], [0.075, -0.08], [0.075, 0.08], [-0.075, 0.08]]) {
      const x = 0.0336 + dx, z = 0.084 + dz;
      const rx = x * Math.cos(r) + z * Math.sin(r), rz = -x * Math.sin(r) + z * Math.cos(r);
      gpts.push(proj(sc.stageGroup.localToWorld(new V(rx, 0.076, rz))));
    }
    out.glyph = box(gpts);
    if (sc.bear && sc.bear.group) {
      const bb = [];
      sc.bear.group.updateWorldMatrix(true, true);
      sc.bear.group.traverse((o) => {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 2) {
          bb.push(proj(new V().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld)));
        }
      });
      if (bb.length) out.bear = box(bb);
    }
    if (out.bear && out.glyph) {
      const ox = Math.max(0, Math.min(out.bear.x1, out.glyph.x1) - Math.max(out.bear.x0, out.glyph.x0));
      const oy = Math.max(0, Math.min(out.bear.y1, out.glyph.y1) - Math.max(out.bear.y0, out.glyph.y0));
      out.overlapGlyph = { px: +ox.toFixed(1), py: +oy.toFixed(1) };
    }
    if (out.bear) out.margins = {
      plateLeft: +out.plate.x0.toFixed(1),
      plateToCard: +(out.cardLeftPx - out.plate.x1).toFixed(1),
      bearLeft: +out.bear.x0.toFixed(1),
      bearToCard: +(out.cardLeftPx - out.bear.x1).toFixed(1)
    };
  }
  const d = window.App.Board3D._debug();
  out.pieces = d.pieces && d.pieces.length;
  out.drawCalls = d.drawCalls;
  out.triangles = d.triangles;
  out.fps = d.fps;
  out.quality = d.quality;
  out.status = window.__V6_TEST__ && window.__V6_TEST__.board3d ? window.__V6_TEST__.board3d() : null;
  out.probe = d.probe;
  out.perf = (d.perf && d.perf.current) || null;
  out.perfAll = (d.perf && d.perf.phases) || null;
  return out;
})()`;

async function boot(cdp, w, h, dpr) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: dpr, mobile: false });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/${DIST}` });
  await sleep(900);
  await waitFor(cdp, `document.readyState === 'complete'`, 20000, 'load');
  await sleep(400);
  try {
    await waitFor(cdp, `!!document.querySelector('[data-test=rules-ok]')`, 2500, 'rules');
    await click(cdp, '[data-test=rules-ok]');
    await sleep(300);
  } catch (e) { /* 无首访弹层 */ }
  await evalJs(cdp, `(() => { try { window.App.Store.saveSettings({ board3d: 'on' }); } catch (e) {} return true; })()`);
  await click(cdp, '[data-test=start]');
  await waitFor(cdp, `!!document.querySelector('[data-test=board3d]')`, 30000, 'board3d host');
  await waitFor(cdp, `window.App && window.App.Board3D && window.App.Board3D.mounted`, 30000, 'mounted');
  await waitFor(cdp, `(() => { const h = document.querySelector('[data-test=board3d]'); return h && h.getAttribute('data-3d-ready') === '1'; })()`, 30000, 'ready');
  await sleep(2300);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const userDir = path.join(process.env.TEMP || '.', 'edge-tbl-' + Date.now());
  const edge = spawn(EDGE, [
    '--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    ...GPU_FLAGS, '--window-size=460,900',
    '--hide-scrollbars', 'about:blank'
  ], { stdio: 'ignore' });
  let wsUrl = null;
  for (let i = 0; i < 100; i++) {
    await sleep(150);
    try {
      const j = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version').then((r) => r.json());
      wsUrl = j.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) { /* not yet */ }
  }
  if (!wsUrl) throw new Error('CDP not ready');
  const browser = await CDP.connect(wsUrl);
  const target = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list').then((r) => r.json());
  const cdp = await CDP.connect(list.find((t) => t.id === target.targetId).webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const errs = [];
  cdp.on((m) => {
    if (m.method === 'Runtime.consoleAPICalled' && (m.params.type === 'error' || m.params.type === 'warning')) {
      errs.push([m.params.type, (m.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 200)]);
    }
    if (m.method === 'Runtime.exceptionThrown') {
      errs.push(['pageerror', ((m.params.exceptionDetails.exception || {}).description || m.params.exceptionDetails.text || '').slice(0, 200)]);
    }
  });

  const out = {};
  /* ---------- 390x844 完整链路 ---------- */
  errs.length = 0;
  const r390 = {};
  await boot(cdp, 390, 844, 2);
  r390.overview = await evalJs(cdp, GEOM);
  await shotPage(cdp, path.join(OUT, `${TAG}-R0-overview-390x844.png`));
  /* 稳态帧时间窗口（2.6s idle）：markPhase 归档上一阶段统计 */
  await evalJs(cdp, `(() => { window.App.Board3D._current().scene.markPhase('bench0'); return true; })()`);
  await sleep(2600);
  r390.bench = await evalJs(cdp, `(() => {
    const sc = window.App.Board3D._current().scene;
    sc.markPhase('bench1');
    const p = window.App.Board3D._debug().perf.phases;
    const gl = sc.renderer.getContext();
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { window: p.bench0 || null, renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a',
             drawCalls: sc.lastCalls, triangles: sc.lastTris, dpr: sc.renderer.getPixelRatio(),
             viewport: sc.viewport };
  })()`);
  await evalJs(cdp, `window.__V6_TEST__.forceDie(6)`);
  await click(cdp, '[data-test=roll]');
  await waitFor(cdp, `!!document.querySelector('[data-test=piece-choice]')`, 20000, 'piece-choice');
  await click(cdp, '[data-test=piece-choice]');
  await waitFor(cdp, `!window.__V6_TEST__.isBusy()`, 30000, 'takeoff done');
  await sleep(700);
  r390.afterTakeoff = await evalJs(cdp, GEOM);
  await evalJs(cdp, `window.__V6_TEST__.forceDie(2)`);
  await click(cdp, '[data-test=roll]');
  let flyShot = false, cellShot = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 40000) {
    const ph = await evalJs(cdp, `document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase')`);
    if (ph === 'fly' && !flyShot) {
      await sleep(220);
      r390.fly = await evalJs(cdp, GEOM);
      await shotPage(cdp, path.join(OUT, `${TAG}-R1-fly-390x844.png`));
      flyShot = true;
    }
    if ((ph === 'cell45' || ph === 'bear') && !cellShot) {
      await sleep(520);
      r390.cell45 = await evalJs(cdp, GEOM);
      await shotPage(cdp, path.join(OUT, `${TAG}-R2-cell45-390x844.png`));
      cellShot = true;
      break;
    }
    await sleep(60);
  }
  await waitFor(cdp, `!!document.querySelector('[data-test=prompt-done]')`, 30000, 'prompt');
  await sleep(900);
  r390.bearHeld = await evalJs(cdp, GEOM);
  r390.prompt = await evalJs(cdp, `(() => ({
    kicker: (document.querySelector('[data-test=prompt-kicker]') || {}).textContent || '',
    actor: (document.querySelector('[data-test=prompt-actor]') || {}).textContent || '',
    text: (document.querySelector('[data-test=prompt-text]') || {}).textContent || ''
  }))()`);
  await shotPage(cdp, path.join(OUT, `${TAG}-R3-bear-hold-card-390x844.png`));
  /* 小熊区放大（host 坐标 → 页面坐标） */
  const bb = r390.bearHeld && r390.bearHeld.plate;
  if (bb) {
    const hr = r390.bearHeld.hostRect;
    const pad = 18;
    const clip = {
      x: hr.x + Math.max(0, bb.x0 - pad), y: hr.y + Math.max(0, bb.y0 - pad),
      width: bb.x1 - bb.x0 + pad * 2, height: bb.y1 - bb.y0 + pad * 2.4
    };
    const r = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 2 } });
    fs.writeFileSync(path.join(OUT, `${TAG}-R3-bear-zoom-390x844.png`), Buffer.from(r.data, 'base64'));
  }
  await click(cdp, '[data-test=prompt-done]');
  await waitFor(cdp, `!window.__V6_TEST__.isBusy()`, 30000, 'prompt done');
  await sleep(2100);
  r390.afterDone = await evalJs(cdp, GEOM);
  await shotPage(cdp, path.join(OUT, `${TAG}-R4-after-done-390x844.png`));
  r390.errors = errs.slice(0, 20);

  /* ---------- 320 / 430 overview ---------- */
  for (const [size, [w, h]] of Object.entries(SIZES)) {
    if (size === '390x844') continue;
    errs.length = 0;
    await boot(cdp, w, h, 2);
    r390[size] = await evalJs(cdp, GEOM);
    await shotPage(cdp, path.join(OUT, `${TAG}-R5-overview-${size}.png`));
    r390[size].errors = errs.slice(0, 20);
  }
  out['390x844'] = r390;
  fs.writeFileSync(path.join(OUT, `${TAG}-table-report.json`), JSON.stringify(out, null, 1));
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
  console.log(JSON.stringify({
    overview: { boardFracW: r390.overview.boardFracW, ringFracW: r390.overview.ringFracW, gapTop: r390.overview.gapTop, gapBot: r390.overview.gapBot, host: r390.overview.hostRect, drawCalls: r390.overview.drawCalls, fps: r390.overview.fps, status: r390.overview.status },
    fly: r390.fly && { phase: r390.fly.phase, flyMode: r390.fly.flyMode, probe: r390.fly.probe },
    bear: r390.bearHeld && { plate: r390.bearHeld.plate, glyph: r390.bearHeld.glyph, bear: r390.bearHeld.bear, overlap: r390.bearHeld.overlapGlyph, margins: r390.bearHeld.margins, prompt: r390.prompt },
    afterDone: r390.afterDone && { phase: r390.afterDone.phase, pieces: r390.afterDone.pieces },
    sizes: { 320: r390['320x568'] && { boardFracW: r390['320x568'].boardFracW, gapTop: r390['320x568'].gapTop, gapBot: r390['320x568'].gapBot },
             430: r390['430x932'] && { boardFracW: r390['430x932'].boardFracW, gapTop: r390['430x932'].gapTop, gapBot: r390['430x932'].gapBot } },
    errors: { '390': r390.errors, '320': r390['320x568'].errors, '430': r390['430x932'].errors }
  }, null, 1));
  console.log('OK ->', OUT);
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

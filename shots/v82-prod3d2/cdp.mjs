/* V8.2 prod3d2 · 3D 视觉自测台（Node + Edge/CDP，无外部依赖）
 * 用法: node cdp.mjs --out=<dir> --tag=after [--sizes=390x844,320x568,430x932] [--themes=cloud,star,paper]
 * 复用 app/dev/board3d-prod-demo.html（真实 ESM 模块 + 真实 App.Board3D），把 body 换成
 * 指定尺寸 host（默认取真实 table 的 host 尺寸），stageAim 与 table.js 同口径（nx=-0.6/ny=0.14）。
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const SERVER_PORT = 8793;
const CDP_PORT = 9333;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = {};
for (const a of process.argv.slice(2)) {
  const m = /^--([^=]+)=(.*)$/.exec(a);
  if (m) args[m[1]] = m[2];
}
const OUT = path.isAbsolute(args.out || '') ? args.out : path.join(REPO, args.out || 'shots/v82-prod3d2/v82');
const TAG = args.tag || 'after';
const SIZES = {
  '390x844': [366, 552],
  '320x568': [296, 303],
  '430x932': [406, 640]
};
const want = (args.sizes || '390x844,320x568,430x932').split(',');
const THEMES = (args.themes || 'cloud,star,paper').split(',');


/* --gpu：不强制 SwiftShader，用真 GPU 量帧时间 */
const GPU = !!args.gpu;
const GPU_FLAGS = GPU ? ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist']
  : ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'];

/* ------------------------------- 极简 CDP client ------------------------------- */
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.handlers = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else {
        for (const h of this.handlers) h(msg);
      }
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
      setTimeout(() => {
        if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout ' + method)); }
      }, 120000);
    });
  }
  on(fn) { this.handlers.push(fn); }
  close() { try { this.ws.close(); } catch (e) { /* noop */ } }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function evalJs(cdp, expression, awaitPromise = true) {
  const r = await cdp.send('Runtime.evaluate', {
    expression, awaitPromise, returnByValue: true, userGesture: true
  });
  if (r.exceptionDetails) throw new Error('EvalError: ' + JSON.stringify(r.exceptionDetails).slice(0, 400));
  return r.result && r.result.value;
}

async function shotEl(cdp, selector, file) {
  const rect = await evalJs(cdp, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  })()`);
  if (!rect) throw new Error('no element ' + selector);
  const r = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 }
  });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  return rect;
}

async function shotClip(cdp, clip, file) {
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { ...clip, scale: 1 } });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
}

/* ------------------------------- 页面内脚本 ------------------------------- */
const GEOM = `(() => {
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
  const ringPts = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    ringPts.push(proj(b.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30))));
  }
  const board = box(ringPts);
  const out = {
    viewport: [W, H], phase: host.getAttribute('data-3d-phase'),
    board,
    boardFracW: +((board.x1 - board.x0) / W).toFixed(4),
    gapTop: +board.y0.toFixed(1), gapBot: +(H - board.y1).toFixed(1),
    cardLeftPx: +(0.40 * W).toFixed(1)
  };
  if (sc.stageGroup && sc.stageGroup.visible) {
    const r = 24 * Math.PI / 180, hw = 0.21;
    const plate = [[-hw, -hw], [hw, -hw], [hw, hw], [-hw, hw]].map(([dx, dz]) => {
      const x = dx * Math.cos(r) + dz * Math.sin(r), z = -dx * Math.sin(r) + dz * Math.cos(r);
      return proj(sc.stageGroup.localToWorld(new V(x, 0.075, z)));
    });
    out.plate = box(plate);
    const gpts = [];
    for (const [dx, dz] of [[-0.075, -0.08], [0.075, -0.08], [0.075, 0.08], [-0.075, 0.08]]) {
      const x = 0.0336 + dx, z = 0.084 + dz;
      const rx = x * Math.cos(r) + z * Math.sin(r), rz = -x * Math.sin(r) + z * Math.cos(r);
      gpts.push(proj(sc.stageGroup.localToWorld(new V(rx, 0.076, rz))));
    }
    out.glyph = box(gpts);
    if (sc.bear && sc.bear.group) {
      /* 用真实网格顶点（世界→NDC）求小熊投影轮廓，比拍脑袋的包围盒准确 */
      const bb = [];
      sc.bear.group.updateWorldMatrix(true, true);
      sc.bear.group.traverse((o) => {
        if (!o.isMesh || !o.geometry || !o.geometry.attributes || !o.geometry.attributes.position) return;
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i += 2) {
          const v = new V().fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld);
          bb.push(proj(v));
        }
      });
      if (bb.length) out.bear = box(bb);
      out.bearVerts = bb.length;
    }
    if (out.bear && out.glyph) {
      const ox = Math.max(0, Math.min(out.bear.x1, out.glyph.x1) - Math.max(out.bear.x0, out.glyph.x0));
      const oy = Math.max(0, Math.min(out.bear.y1, out.glyph.y1) - Math.max(out.bear.y0, out.glyph.y0));
      out.overlapGlyphPx = +Math.sqrt(ox * oy).toFixed(1);
      out.overlapGlyph = { px: +ox.toFixed(1), py: +oy.toFixed(1) };
    }
    if (out.bear) out.margins = {
      plateLeft: +out.plate.x0.toFixed(1),
      plateToCard: +(out.cardLeftPx - out.plate.x1).toFixed(1),
      bearLeft: +out.bear.x0.toFixed(1),
      bearToCard: +(out.cardLeftPx - out.bear.x1).toFixed(1),
      plateTop: +out.plate.y0.toFixed(1),
      bearTop: +out.bear.y0.toFixed(1)
    };
  }
  const dbg = window.App.Board3D._debug();
  out.perf = { fps: dbg.fps, drawCalls: dbg.drawCalls, triangles: dbg.triangles, quality: dbg.quality };
  out.flyMode = !!sc.flyMode;
  return out;
})()`;

const SETUP = (w, h) => `(() => {
  window.App.Board3D.unmount();
  document.body.innerHTML = '';
  const h = document.createElement('div');
  h.id = 'host';
  h.setAttribute('aria-hidden', 'true');
  h.style.cssText = 'position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#05080d';
  document.body.style.cssText = 'margin:0;padding:0;background:#05080d;overflow:hidden';
  document.body.appendChild(h);
  window.__host = h;
  return true;
})()`;

const MOUNT = (theme) => `(async () => {
  const st = window.__demo.state();
  const view = window.App.Flight.view(st, { reduced: false });
  const inst = await window.App.Board3D.mount(window.__host, {
    reduced: false, theme: '${theme}', state: st, view,
    mode: 'quick', sound: false, adapt: false, shadows: true,
    stageAim: { nx: -0.6, ny: 0.14 }
  });
  window.__inst = inst;
  await new Promise((r) => setTimeout(r, 320));
  return !!inst;
})()`;

const PLAY = (from, prompt) => `(() => {
  const st = JSON.parse(JSON.stringify(window.__demo.state()));
  const p = st.pieces.find((x) => x.id === 'a:0');
  if (p) { p.squareId = '${from}'; p.arrived = false; }
  window.App.Board3D.setState(st, window.App.Flight.view(st, { reduced: false }));
  const evs = [{ type: 'move', pieceId: 'a:0', path: ['ring:24', 'ring:25'] }];
  ${prompt ? "evs.push({ type: 'prompt', prompt: { kind: 'cell', type: 'dare' } });" : ''}
  window.__p = window.App.Board3D.play(evs);
  return true;
})()`;

const WAIT_PHASE = (phase, ms) => `new Promise((resolve) => {
  const t0 = Date.now();
  const tick = () => {
    const ph = window.__host && window.__host.getAttribute('data-3d-phase');
    if (ph === '${phase}') return resolve(ph);
    if (Date.now() - t0 > ${ms}) return resolve(ph || 'timeout');
    setTimeout(tick, 40);
  };
  tick();
})`;

const WAIT_PHASES = (list, ms) => `new Promise((resolve) => {
  const want = ${JSON.stringify(list)};
  const t0 = Date.now();
  const tick = () => {
    const ph = window.__host && window.__host.getAttribute('data-3d-phase');
    if (want.indexOf(ph) >= 0) return resolve(ph);
    if (Date.now() - t0 > ${ms}) return resolve(ph || 'timeout');
    setTimeout(tick, 40);
  };
  tick();
})`;

/* ------------------------------- 主流程 ------------------------------- */
async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const userDir = path.join(process.env.TEMP || '.', 'edge-v82-' + Date.now());
  const edge = spawn(EDGE, [
    '--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--window-size=460,900', ...GPU_FLAGS,
    '--hide-scrollbars', 'about:blank'
  ], { stdio: 'ignore', detached: false });
  let wsUrl = null;
  for (let i = 0; i < 100; i++) {
    await sleep(150);
    try {
      const r = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version');
      const j = await r.json();
      wsUrl = j.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (e) { /* not yet */ }
  }
  if (!wsUrl) throw new Error('Edge CDP not ready');
  const browser = await CDP.connect(wsUrl);
  const target = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list').then((r) => r.json());
  const page = list.find((t) => t.id === target.targetId);
  const cdp = await CDP.connect(page.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const consoleErrors = [];
  cdp.on((msg) => {
    if (msg.method === 'Runtime.consoleAPICalled' && (msg.params.type === 'error' || msg.params.type === 'warning')) {
      const txt = (msg.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240);
      consoleErrors.push([msg.params.type, txt]);
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(['pageerror', (msg.params.exceptionDetails.text || '') + ' ' +
        ((msg.params.exceptionDetails.exception || {}).description || '').slice(0, 200)]);
    }
  });

  const summary = {};
  for (const size of want) {
    const [w, h] = SIZES[size];
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: Math.max(w, 430), height: Math.max(h, 700), deviceScaleFactor: 2, mobile: false
    });
    consoleErrors.length = 0;
    const res = { size, viewport: [w, h] };
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
    await sleep(1200);
    for (let i = 0; i < 200; i++) {
      const ready = await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`);
      if (ready) break;
      await sleep(120);
    }
    await sleep(400);
    await evalJs(cdp, SETUP(w, h));
    res.mounted = await evalJs(cdp, MOUNT(THEMES[0]));
    await sleep(600);
    res.overview = await evalJs(cdp, GEOM);
    /* 稳态帧时间（2.6s idle overview）：markPhase 归档上一阶段 */
    await evalJs(cdp, `(() => { window.App.Board3D._current().scene.markPhase('bench0'); return true; })()`);
    await sleep(2600);
    res.bench = await evalJs(cdp, `(() => {
      const sc = window.App.Board3D._current().scene;
      sc.markPhase('bench1');
      const p = window.App.Board3D._debug().perf.phases;
      const gl = sc.renderer.getContext();
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return { window: p.bench0 || null, renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a',
               drawCalls: sc.lastCalls, triangles: sc.lastTris, dpr: sc.renderer.getPixelRatio(),
               quality: sc.quality, shadows: sc.shadows, viewport: sc.viewport };
    })()`);
    await shotEl(cdp, '#host', path.join(OUT, `${TAG}-${size}-overview.png`));
    for (const th of THEMES.slice(1)) {
      await evalJs(cdp, `window.App.Board3D.setTheme('${th}')`);
      await sleep(800);
      res['overview_' + th] = await evalJs(cdp, GEOM);
      await shotEl(cdp, '#host', path.join(OUT, `${TAG}-${size}-overview-${th}.png`));
      await evalJs(cdp, `window.App.Board3D.setTheme('${THEMES[0]}')`);
      await sleep(500);
    }

    /* fly */
    await evalJs(cdp, PLAY('ring:23', false));
    res.flyPhase = await evalJs(cdp, WAIT_PHASE('fly', 15000));
    if (res.flyPhase === 'fly') {
      await sleep(280);
      res.fly = await evalJs(cdp, GEOM);
      await shotEl(cdp, '#host', path.join(OUT, `${TAG}-${size}-fly.png`));
    }
    await evalJs(cdp, WAIT_PHASE('idle', 30000));
    await sleep(250);

    /* cell45 + bear */
    await evalJs(cdp, PLAY('ring:23', true));
    res.cellPhase = await evalJs(cdp, WAIT_PHASES(['cell45', 'bear'], 25000));
    await sleep(560);
    res.cell45 = await evalJs(cdp, GEOM);
    await shotEl(cdp, '#host', path.join(OUT, `${TAG}-${size}-cell45.png`));
    res.bearPhase = await evalJs(cdp, WAIT_PHASE('bear', 12000));
    await sleep(1100);
    res.bear = await evalJs(cdp, GEOM);
    await shotEl(cdp, '#host', path.join(OUT, `${TAG}-${size}-bear.png`));
    const bb = res.bear && res.bear.plate;
    if (bb) {
      const pad = 22;
      await shotClip(cdp, {
        x: Math.max(0, bb.x0 - pad), y: Math.max(0, bb.y0 - pad),
        width: Math.min(w - Math.max(0, bb.x0 - pad), bb.x1 - bb.x0 + pad * 2),
        height: Math.min(h - Math.max(0, bb.y0 - pad), bb.y1 - bb.y0 + pad * 3.2)
      }, path.join(OUT, `${TAG}-${size}-bear-zoom.png`));
    }
    await evalJs(cdp, 'window.App.Board3D.returnToOverview()');
    await sleep(1400);
    res.afterReturn = await evalJs(cdp, GEOM);
    res.errors = consoleErrors.slice(0, 20);
    fs.writeFileSync(path.join(OUT, `${TAG}-${size}.json`), JSON.stringify(res, null, 1));
    summary[size] = res;
  }
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
  console.log(JSON.stringify(Object.fromEntries(Object.entries(summary).map(([k, v]) => [k, {
    boardFracW: v.overview && v.overview.boardFracW,
    gapTop: v.overview && v.overview.gapTop,
    gapBot: v.overview && v.overview.gapBot,
    flyPhase: v.flyPhase,
    flyMode: v.fly && v.fly.flyMode,
    plate: v.bear && v.bear.plate,
    bear: v.bear && v.bear.bear,
    overlapGlyph: v.bear && v.bear.overlapGlyph,
    margins: v.bear && v.bear.margins,
    drawCalls: v.overview && v.overview.perf && v.overview.perf.drawCalls,
    errors: v.errors
  }])), null, 1));
  console.log('OK ->', OUT);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });

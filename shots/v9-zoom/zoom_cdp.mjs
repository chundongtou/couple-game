/* V9 fe-zoom · 3D 缩放模块级自测（Node + Edge/CDP，无外部依赖）
 * 用法: node zoom_cdp.mjs [--out=<dir>] [--sizes=390x844,320x568,430x932]
 * 页面：app/dev/board3d-prod-demo.html（真实 ESM 模块 + 真实 App.Board3D）
 * 覆盖：范围/夹取/阻尼/1×构图/镜头链锁定+恢复/reduced 即时/resize refit/0 console error
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const SERVER = 'http://127.0.0.1:8795';
const CDP_PORT = 9334;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = {};
for (const a of process.argv.slice(2)) {
  const m = /^--([^=]+)=(.*)$/.exec(a);
  if (m) args[m[1]] = m[2];
}
const OUT = path.isAbsolute(args.out || '') ? args.out : path.join(HERE, args.out || 'module');
/* --page：可指向干净快照（tmp/v9-zoom-clean），避免并行 owner 的未完成改动干扰本模块自测 */
const PAGE = args.page || '/app/dev/board3d-prod-demo.html';
const SIZES_ALL = { '390x844': [390, 844], '320x568': [320, 568], '430x932': [430, 932] };
const want = (args.sizes || '390x844,320x568,430x932').split(',');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function evalJs(cdp, expression, awaitPromise = true) {
  const r = await cdp.send('Runtime.evaluate', { expression, awaitPromise, returnByValue: true, userGesture: true });
  if (r.exceptionDetails) throw new Error('EvalError: ' + JSON.stringify(r.exceptionDetails).slice(0, 500));
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
    format: 'png', clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 }
  });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  return rect;
}

/* 页面内测量：棋盘投影占宽/上下留白/相机距离/zoom 状态 */
const GEOM = `(() => {
  const inst = window.App.Board3D._current();
  const sc = inst && inst.scene;
  if (!sc || !sc.rig) return null;
  const V = sc.camera.position.constructor;
  const W = sc.viewport.w, H = sc.viewport.h;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: (q.x + 1) / 2 * W, y: (1 - q.y) / 2 * H }; };
  const b = sc.boardGroup;
  const pts = [];
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    pts.push(proj(b.localToWorld(new V(Math.cos(a) * 3.30, 0.035, Math.sin(a) * 3.30))));
  }
  const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const d = sc.camera.position.distanceTo(sc.rig.state.center);
  const z = window.App.Board3D.zoomInfo();
  const host = document.querySelector('#stage');
  return {
    viewport: [W, H],
    boardFracW: +((x1 - x0) / W).toFixed(4),
    boardFracH: +((y1 - y0) / H).toFixed(4),
    gapTop: +y0.toFixed(1), gapBot: +(H - y1).toFixed(1),
    camDist: +d.toFixed(4),
    radiusState: +sc.rig.state.radius.toFixed(4),
    zoom: z,
    canZoom: inst.canZoom(),
    phase: host.getAttribute('data-3d-phase'),
    hostZoom: host.getAttribute('data-3d-zoom'),
    hostLock: host.getAttribute('data-3d-zoom-lock'),
    drawCalls: sc.lastCalls, tris: sc.lastTris, fps: (window.App.Board3D._debug().fps || 0)
  };
})()`;

const results = [];
function ck(id, name, ok, expected, actual, extra) {
  results.push({ id, name, ok: !!ok, expected, actual, extra: extra || null });
  console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + name + (ok ? '' : '  expected=' + JSON.stringify(expected) + ' actual=' + JSON.stringify(actual)));
}

async function waitReady(cdp, timeout = 45000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const ok = await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`);
    if (ok) return true;
    await sleep(150);
  }
  return false;
}

async function waitPhase(cdp, wantList, timeout = 25000) {
  const t0 = Date.now();
  let ph = '';
  while (Date.now() - t0 < timeout) {
    ph = await evalJs(cdp, `(() => { const el = document.querySelector('#stage'); return el ? (el.getAttribute('data-3d-phase') || '') : ''; })()`);
    if (wantList.indexOf(ph) >= 0) return ph;
    await sleep(50);
  }
  return ph || 'timeout';
}

/* SwiftShader 下帧率很低且 camera.apply 的 dt 有 80ms 上限，固定 sleep 会读到阻尼中间值；
 * 这里轮询 zoomInfo 直到阻尼到位（真实设备上 <200ms），把「最终态」与「有阻尼」分开断言。 */
async function waitZoom(cdp, target, timeout = 12000) {
  const t0 = Date.now();
  let info = null;
  while (Date.now() - t0 < timeout) {
    info = await evalJs(cdp, 'window.App.Board3D.zoomInfo()');
    if (info && Math.abs(info.value - target) <= 0.012) return info;
    await sleep(80);
  }
  return info;
}
async function waitZoomBelow(cdp, max, timeout = 3000) {
  const t0 = Date.now();
  let info = null;
  while (Date.now() - t0 < timeout) {
    info = await evalJs(cdp, 'window.App.Board3D.zoomInfo()');
    if (info && info.value <= max) return info;
    await sleep(60);
  }
  return info;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(EDGE)) throw new Error('Edge not found: ' + EDGE);
  const userDir = path.join(process.env.TEMP || '.', 'edge-zoom9-' + Date.now());
  const edge = spawn(EDGE, [
    '--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions',
    '--window-size=460,940', '--enable-unsafe-swiftshader', '--use-angle=swiftshader',
    '--hide-scrollbars', 'about:blank'
  ], { stdio: 'ignore', detached: false });
  let wsUrl = null;
  for (let i = 0; i < 120; i++) {
    await sleep(150);
    try {
      const j = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version').then((r) => r.json());
      if (j.webSocketDebuggerUrl) { wsUrl = j.webSocketDebuggerUrl; break; }
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
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push((msg.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push('pageerror: ' + ((msg.params.exceptionDetails.text || '') + ' ' +
        ((msg.params.exceptionDetails.exception || {}).description || '').slice(0, 200)));
    }
  });

  const summary = {};
  for (const size of want) {
    const [W, H] = SIZES_ALL[size];
    consoleErrors.length = 0;
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
    await cdp.send('Page.navigate', { url: SERVER + PAGE + '?adapt=0&sound=0' });
    await sleep(1200);
    if (!(await waitReady(cdp))) throw new Error('demo not ready ' + size);
    await sleep(600);
    const res = { size, viewport: [W, H] };

    /* 1× 基准：必须仍是 V8 的目标构图（棋盘占宽 86–88%） */
    await evalJs(cdp, 'window.App.Board3D.resetZoom()');
    await waitZoom(cdp, 1);
    const base = await evalJs(cdp, GEOM);
    if (!base || !base.zoom) throw new Error('GEOM failed at ' + size);
    res.base = base;
    ck('M-' + size + '-01', '1× 基准可用（棋盘占宽 0.86–0.88）', base && base.zoom.value === 1 && base.boardFracW >= 0.84 && base.boardFracW <= 0.90,
      'value=1, boardFracW≈0.86–0.88', base && { v: base.zoom.value, w: base.boardFracW });

    /* 放大 1.5：距离倍率 0.7（±0.02），阻尼后 value=1.5 */
    await evalJs(cdp, 'window.App.Board3D.setZoom(1.5)');
    await waitZoom(cdp, 1.5);
    const zin = await evalJs(cdp, GEOM);
    res.zoom15 = zin;
    const ratio15 = zin.camDist / base.camDist;
    ck('M-' + size + '-02', 'setZoom(1.5)：target/value=1.5，距离倍率 0.7', zin.zoom.target === 1.5 && Math.abs(zin.zoom.value - 1.5) < 0.02 && Math.abs(ratio15 - 0.7) < 0.02,
      'target=1.5 value≈1.5 ratio≈0.7', { target: zin.zoom.target, value: zin.zoom.value, ratio: +ratio15.toFixed(3) });
    ck('M-' + size + '-03', '放大后画面更大（boardFracW 变大约 1/0.7）', zin.boardFracW > base.boardFracW * 1.25,
      '>' + (base.boardFracW * 1.25).toFixed(3), zin.boardFracW);
    ck('M-' + size + '-04', 'host 属性可断言 data-3d-zoom / data-3d-zoom-lock', zin.hostZoom === '1.50' && zin.hostLock === '0',
      '1.50 / 0', { z: zin.hostZoom, l: zin.hostLock });
    await shotEl(cdp, '#stage', path.join(OUT, `${size}-zoom-1.5.png`));

    /* 缩小 0.8：距离倍率 1.25，整盘更小 */
    await evalJs(cdp, 'window.App.Board3D.setZoom(0.8)');
    await waitZoom(cdp, 0.8);
    const zout = await evalJs(cdp, GEOM);
    res.zoom08 = zout;
    const ratio08 = zout.camDist / base.camDist;
    ck('M-' + size + '-05', 'setZoom(0.8)：距离倍率 1.25，棋盘完整不裁切', zout.zoom.target === 0.8 && Math.abs(zout.zoom.value - 0.8) < 0.02 && Math.abs(ratio08 - 1.25) < 0.02 && zout.boardFracW <= 0.92,
      'target=0.8 ratio≈1.25 boardFracW≤0.92', { target: zout.zoom.target, ratio: +ratio08.toFixed(3), w: zout.boardFracW });
    await shotEl(cdp, '#stage', path.join(OUT, `${size}-zoom-0.8.png`));

    /* 夹取 / zoomBy / reset */
    const clampHi = await evalJs(cdp, 'window.App.Board3D.setZoom(9)');
    const clampLo = await evalJs(cdp, 'window.App.Board3D.setZoom(0.01)');
    const byUp = await evalJs(cdp, 'window.App.Board3D.zoomBy(2)');
    const byDown = await evalJs(cdp, 'window.App.Board3D.zoomBy(0.1)');
    ck('M-' + size + '-06', '范围夹取 [0.8,1.5]：setZoom(9)=1.5，setZoom(0.01)=0.8，zoomBy 同口径',
      clampHi === 1.5 && clampLo === 0.8 && byUp === 1.5 && byDown === 0.8,
      '1.5 / 0.8 / 1.5 / 0.8', [clampHi, clampLo, byUp, byDown]);
    const reset = await evalJs(cdp, 'window.App.Board3D.resetZoom()');
    await waitZoom(cdp, 1);
    const afterReset = await evalJs(cdp, GEOM);
    ck('M-' + size + '-07', 'resetZoom 回 1×（构图回到基准）', reset === 1 && Math.abs(afterReset.boardFracW - base.boardFracW) < 0.002,
      '1 / boardFracW≈' + base.boardFracW, { reset, w: afterReset.boardFracW });

    /* 镜头链锁定 + 结束后恢复用户缩放 */
    await evalJs(cdp, 'window.App.Board3D.setZoom(1.35)');
    await waitZoom(cdp, 1.35);
    const beforeChain = await evalJs(cdp, GEOM);
    await evalJs(cdp, `(() => {
      window.__lockP = window.__demo.injectEvents(
        [{ type: 'move', pieceId: 'a:0', path: ['ring:24', 'ring:25'] }],
        [{ id: 'a:0', squareId: 'ring:23' }]
      );
      return true;
    })()`);
    const lockPhaseEarly = await evalJs(cdp, `(() => {
      const i = window.App.Board3D._current();
      return { phase: i.director.phase, can: i.canZoom(), reject: i.setZoom(1.2) };
    })()`);
    ck('M-' + size + '-08', '镜头链中锁定：canZoom=false，setZoom 被拒（false）', lockPhaseEarly.can === false && lockPhaseEarly.reject === false,
      '{can:false, reject:false}', lockPhaseEarly);
    const lockPhase = await waitPhase(cdp, ['focus', 'fly'], 15000);
    await waitZoomBelow(cdp, 1.2, 2500);   /* 阻尼 110ms：等几帧，验证镜头链中视觉确实回到 1× */
    const during = await evalJs(cdp, GEOM);
    res.chain = { before: beforeChain, early: lockPhaseEarly, phase: lockPhase, during };
    ck('M-' + size + '-09', '镜头链中视觉先回 1×（260ms 后 value<1.12，active=false，can=false）',
      during.zoom.active === false && during.zoom.value < 1.12 && during.canZoom === false,
      'active=false, value<1.12', { active: during.zoom.active, value: during.zoom.value, phase: during.phase });
    const idlePhase = await waitPhase(cdp, ['idle'], 30000);
    await waitZoom(cdp, 1.35);
    const restored = await evalJs(cdp, GEOM);
    res.restored = restored;
    ck('M-' + size + '-10', '回到 idle 后恢复用户缩放 1.35（±0.03）',
      idlePhase === 'idle' && restored.canZoom === true && Math.abs(restored.zoom.value - 1.35) < 0.03 && restored.zoom.target === 1.35,
      'idle / can=true / value≈1.35', { phase: idlePhase, can: restored.canZoom, value: restored.zoom.value, target: restored.zoom.target });
    await shotEl(cdp, '#stage', path.join(OUT, `${size}-zoom-locked-restored.png`));

    /* reduced：即时缩放（同一帧到位，value===target） */
    await evalJs(cdp, "window.__demo.reduced(true)");
    await sleep(350);
    const reducedInfo = await evalJs(cdp, `(() => {
      window.App.Board3D.setZoom(1.5);
      return window.App.Board3D.zoomInfo();
    })()`);
    await sleep(120);
    const reducedShot = await evalJs(cdp, GEOM);
    res.reduced = { info: reducedInfo, geom: reducedShot };
    ck('M-' + size + '-11', 'reduced：缩放即时到位（instant=true，value=target=1.5，无阻尼）',
      reducedInfo && reducedInfo.instant === true && reducedInfo.value === 1.5 && reducedInfo.target === 1.5,
      'instant=true value=1.5 target=1.5', reducedInfo);
    ck('M-' + size + '-12', 'reduced 下画面确实放大（camDist 倍率 0.7）', Math.abs(reducedShot.camDist / base.camDist - 0.7) < 0.02,
      '0.7', +(reducedShot.camDist / base.camDist).toFixed(3));
    await shotEl(cdp, '#stage', path.join(OUT, `${size}-zoom-reduced-1.5.png`));
    await evalJs(cdp, "window.__demo.reduced(false)");
    await sleep(300);

    /* resize refit：缩放后改 host 尺寸，按新纵横比重新取景（上下留白仍均衡、距离倍率不变） */
    await evalJs(cdp, 'window.App.Board3D.setZoom(1.5)');
    await waitZoom(cdp, 1.5);
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: Math.max(420, H - 120), deviceScaleFactor: 2, mobile: true });
    await sleep(1100);
    const afterResize = await evalJs(cdp, GEOM);
    res.afterResize = afterResize;
    /* 新的 host 尺寸下取 1× 基准，再放大 1.5 比较（旧基准的基准距离本身已随纵横比变化） */
    await evalJs(cdp, 'window.App.Board3D.resetZoom()');
    await waitZoom(cdp, 1);
    const newBase = await evalJs(cdp, GEOM);
    await evalJs(cdp, 'window.App.Board3D.setZoom(1.5)');
    await waitZoom(cdp, 1.5);
    const zoomResized = await evalJs(cdp, GEOM);
    const resizeRatio = zoomResized.camDist / newBase.camDist;
    const gapTol = Math.max(14, Math.round((H - 120) * 0.025));   /* 上下留白差 ≤2.5% host 高（棋盘中心仍在画面中心附近） */
    ck('M-' + size + '-13', '缩放下 resize：按新 host refit（新基准距离倍率 0.7，上下留白差≤' + gapTol + 'px）',
      Math.abs(resizeRatio - 0.7) < 0.03 && Math.abs(zoomResized.gapTop - zoomResized.gapBot) <= gapTol && Math.abs(afterResize.gapTop - afterResize.gapBot) <= gapTol,
      'ratio≈0.7, |gapTop-gapBot|≤' + gapTol, { ratio: +resizeRatio.toFixed(3), gapTop: zoomResized.gapTop, gapBot: zoomResized.gapBot, newBaseDist: newBase.camDist });
    await shotEl(cdp, '#stage', path.join(OUT, `${size}-zoom-resized-1.5.png`));
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
    await sleep(700);

    /* 0 console error / pageerror */
    res.errors = consoleErrors.slice(0, 20);
    ck('M-' + size + '-14', '0 console error / pageerror', res.errors.length === 0, '0', res.errors.length);
    fs.writeFileSync(path.join(OUT, `module-${size}.json`), JSON.stringify(res, null, 1));
    summary[size] = res;
  }

  const pass = results.filter((r) => r.ok).length;
  const report = { tool: 'node-cdp', edge: EDGE, viewport: want, pass, fail: results.length - pass, total: results.length, results };
  fs.writeFileSync(path.join(OUT, 'module-report.json'), JSON.stringify(report, null, 1));
  console.log('\nRESULT ' + pass + '/' + results.length + ' pass, ' + (results.length - pass) + ' failed -> ' + OUT);
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
  if (pass !== results.length) process.exitCode = 1;
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });


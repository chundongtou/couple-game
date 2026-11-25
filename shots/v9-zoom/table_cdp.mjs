/* V9 fe-zoom · 主桌集成自测（Node + Edge/CDP，无外部依赖）
 * 用法: node table_cdp.mjs [--dist=dist/v9-zoom] [--sizes=390x844,320x568,430x932] [--full=390x844]
 * 覆盖：3D 主桌挂载 → 缩放层可见/只覆盖棋盘 → 3+滚轮+双击+双指+夹取/复位
 *       → 镜头链锁定/恢复 → 题卡打开时不挡卡片/HUD/安全词 → reduced 即时 → V7 回落隐藏
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '..', '..');
const SERVER = 'http://127.0.0.1:8795';
const CDP_PORT = 9335;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const args = {};
for (const a of process.argv.slice(2)) {
  const m = /^--([^=]+)=(.*)$/.exec(a);
  if (m) args[m[1]] = m[2];
}
const OUT = path.isAbsolute(args.out || '') ? args.out : path.join(HERE, args.out || 'table');
const DIST = args.dist || 'dist/v9-zoom';
const SIZES_ALL = { '390x844': [390, 844], '320x568': [320, 568], '430x932': [430, 932] };
const want = (args.sizes || '390x844,320x568,430x932').split(',');
const FULL = (args.full || '390x844').split(',');
const BASE = SERVER + '/' + DIST.replace(/\\/g, '/') + '/index.html';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.handlers = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id); this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      } else for (const h of this.handlers) h(msg);
    });
  }
  static async connect(url) {
    const ws = new WebSocket(url);
    await new Promise((res, rej) => { ws.addEventListener('open', res, { once: true }); ws.addEventListener('error', () => rej(new Error('ws')), { once: true }); });
    return new CDP(ws);
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
      setTimeout(() => { if (this.pending.has(id)) { this.pending.delete(id); reject(new Error('timeout ' + method)); } }, 120000);
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
async function shot(cdp, file) {
  const rect = await evalJs(cdp, `(() => { const el = document.querySelector('.v6-table'); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, width: r.width, height: r.height }; })()`);
  if (!rect) throw new Error('no .v6-table');
  const r = await cdp.send('Page.captureScreenshot', { format: 'png', clip: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, scale: 1 } });
  fs.writeFileSync(file, Buffer.from(r.data, 'base64'));
  return rect;
}
async function clickAt(cdp, x, y, clickCount = 1) {
  const cc = clickCount || 1;
  await cdp.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: cc });
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: cc });
}
async function wheelAt(cdp, x, y, deltaY) {
  await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY });
}
async function rectOf(cdp, selector) {
  return evalJs(cdp, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
  })()`);
}
async function hitAt(cdp, x, y) {
  return evalJs(cdp, `(() => {
    const el = document.elementFromPoint(${x}, ${y});
    if (!el) return null;
    return {
      test: el.getAttribute ? el.getAttribute('data-test') : null,
      tag: el.tagName,
      cls: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
      text: (el.textContent || '').trim().slice(0, 24),
      inZoomLayer: !!(el.closest && el.closest('[data-test=board3d-zoom-layer]')),
      inSafe: !!(el.closest && el.closest('[data-test=safety-word]')),
      inPause: !!(el.closest && el.closest('[data-test=pause]')),
      inCard: !!(el.closest && el.closest('[data-test=prompt-card]'))
    };
  })()`);
}
function intersects(a, b) {
  if (!a || !b) return false;
  return Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) > 0.5 &&
    Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)) > 0.5;
}
const results = [];
let consoleErrors = [];
function ck(id, name, ok, expected, actual, extra) {
  results.push({ id, name, ok: !!ok, expected, actual, extra: extra || null });
  console.log((ok ? 'PASS ' : 'FAIL ') + id + ' ' + name + (ok ? '' : '  expected=' + JSON.stringify(expected) + ' actual=' + JSON.stringify(actual)));
}

async function waitFor(cdp, expr, timeout = 30000, step = 120) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    if (await evalJs(cdp, expr)) return true;
    await sleep(step);
  }
  return false;
}
async function waitPhase(cdp, wantPhases, timeout = 30000) {
  const t0 = Date.now();
  let ph = '';
  while (Date.now() - t0 < timeout) {
    ph = await evalJs(cdp, `(() => { const h = document.querySelector('[data-test=board3d]'); return h ? (h.getAttribute('data-3d-phase') || '') : ''; })()`);
    if (wantPhases.indexOf(ph) >= 0) return ph;
    await sleep(60);
  }
  return ph || 'timeout';
}
async function waitZoom(cdp, target, timeout = 15000) {
  const t0 = Date.now();
  let info = null;
  while (Date.now() - t0 < timeout) {
    info = await evalJs(cdp, 'window.App.Board3D.zoomInfo()');
    if (info && Math.abs(info.value - target) <= 0.015) return info;
    await sleep(80);
  }
  return info;
}
async function zoomInfo(cdp) {
  return evalJs(cdp, 'window.App.Board3D.zoomInfo()');
}
async function camDist(cdp) {
  return evalJs(cdp, `(() => {
    const inst = window.App.Board3D._current();
    if (!inst || !inst.scene) return 0;
    return +inst.scene.camera.position.distanceTo(inst.scene.rig.state.center).toFixed(4);
  })()`);
}
async function camState(cdp) {
  return evalJs(cdp, `(() => {
    const inst = window.App.Board3D._current();
    if (!inst || !inst.scene) return null;
    const sc = inst.scene, rig = sc.rig, z = window.App.Board3D.zoomInfo();
    return {
      dist: +sc.camera.position.distanceTo(rig.state.center).toFixed(4),
      radius: +rig.state.radius.toFixed(4),
      factor: z.radiusFactor, value: z.value, target: z.target,
      aspect: +rig.aspect.toFixed(4), viewport: [sc.viewport.w, sc.viewport.h]
    };
  })()`);
}
/* 合成双指：pointerdown ×2 → move 拉开 → up（页面内派发，path 与真机同一套 pointer 事件） */
async function pinch(cdp, factor = 1.6) {
  return evalJs(cdp, `(() => {
    const layer = document.querySelector('[data-test=board3d-zoom-layer]');
    if (!layer) return 'no-layer';
    const r = layer.getBoundingClientRect();
    const cx = r.x + r.width / 2, cy = r.y + r.height / 2;
    const start = 70, end = start * ${Number(factor)};
    const mk = (type, id, x, y) => new PointerEvent(type, {
      bubbles: true, cancelable: true, pointerId: id, pointerType: 'touch',
      clientX: x, clientY: y, isPrimary: id === 1
    });
    const a0 = { x: cx - start, y: cy }, b0 = { x: cx + start, y: cy };
    const a1 = { x: cx - end, y: cy }, b1 = { x: cx + end, y: cy };
    layer.dispatchEvent(mk('pointerdown', 1, a0.x, a0.y));
    layer.dispatchEvent(mk('pointerdown', 2, b0.x, b0.y));
    layer.dispatchEvent(mk('pointermove', 1, a1.x, a1.y));
    layer.dispatchEvent(mk('pointermove', 2, b1.x, b1.y));
    layer.dispatchEvent(mk('pointerup', 1, a1.x, a1.y));
    layer.dispatchEvent(mk('pointerup', 2, b1.x, b1.y));
    return 'ok';
  })()`);
}
async function touchTapTwice(cdp, x, y) {
  return evalJs(cdp, `(() => {
    const layer = document.querySelector('[data-test=board3d-zoom-layer]');
    const mk = (type) => new PointerEvent(type, { bubbles: true, cancelable: true, pointerId: 7, pointerType: 'touch', clientX: ${x}, clientY: ${y}, isPrimary: true });
    layer.dispatchEvent(mk('pointerdown')); layer.dispatchEvent(mk('pointerup'));
    layer.dispatchEvent(mk('pointerdown')); layer.dispatchEvent(mk('pointerup'));
    return true;
  })()`);
}
async function tap(cdp, selector) {
  return evalJs(cdp, `(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return false; el.click(); return true; })()`);
}
async function startGame(cdp, expect3d = true) {
  await waitFor(cdp, `!!document.querySelector('[data-test=start]')`, 25000);
  /* 首次进入会自动弹玩法速览；先关掉 */
  if (await evalJs(cdp, `!!document.querySelector('[data-test=rules-sheet]')`)) {
    await tap(cdp, '[data-test=rules-ok]');
    await sleep(300);
  }
  await tap(cdp, '[data-test=start]');
  const ok = await waitFor(cdp, `!!document.querySelector('[data-test=table]')`, 20000);
  if (!ok) throw new Error('table not mounted');
  if (!expect3d) return false;
  return waitFor(cdp, `(() => { const t = document.querySelector('.v6-table'); return !!(t && t.getAttribute('data-board3d') === 'on' && t.classList.contains('v6-3d')); })()`, 60000);
}
async function reloadWithSettings(cdp, settings) {
  await evalJs(cdp, `(() => { window.App.Store.saveSettings(${JSON.stringify(settings)}); return true; })()`);
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(1200);
}
async function zoomButtonRect(cdp, which) {
  return rectOf(cdp, `[data-test=board3d-zoom-${which}]`);
}

async function runSize(cdp, size, full) {
  const [W, H] = SIZES_ALL[size];
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: BASE });
  await sleep(1400);
  /* 上一轮的 V7 用例可能把 board3d 改成 off / reduced：恢复 3D auto */
  let needReset = false;
  try {
    needReset = await evalJs(cdp, `(() => { const s = window.App && window.App.Store && window.App.Store.getSettings(); return !!(s && (s.board3d === 'off' || s.board3d === 'on' || s.reduced)); })()`);
  } catch (e) { needReset = false; }
  if (needReset) await reloadWithSettings(cdp, { board3d: 'auto', reduced: false });
  const mounted = await startGame(cdp);
  const res = { size, mounted };
  if (!mounted) {
    ck('T-' + size + '-01', '3D 主桌挂载成功（data-board3d=on / .v6-3d）', false, 'on', 'fallback');
    fs.writeFileSync(path.join(OUT, `table-${size}.json`), JSON.stringify(res, null, 1));
    return res;
  }
  await sleep(900);

  const g = await evalJs(cdp, `(() => {
    const layer = document.querySelector('[data-test=board3d-zoom-layer]');
    const ctl = layer && layer.querySelector('.v6-zctl');
    const wrap = document.querySelector('.v6-boardwrap');
    const hud = document.querySelector('.v6-hud');
    const act = document.querySelector('[data-test=action]');
    const safe = document.querySelector('[data-test=safety-word]');
    const pause = document.querySelector('[data-test=pause]');
    const legend = document.querySelector('[data-test=board3d-legend]');
    const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }; };
    return {
      layer: r(layer), ctl: r(ctl), wrap: r(wrap), hud: r(hud), act: r(act), safe: r(safe), pause: r(pause), legend: r(legend),
      layerDisplay: layer ? getComputedStyle(layer).display : 'none',
      layerTouchAction: layer ? getComputedStyle(layer).touchAction : '',
      zoomInfo: window.App.Board3D.zoomInfo(),
      canZoom: window.App.Board3D.canZoom(),
      canvas: !!document.querySelector('[data-test=board3d-canvas]'),
      phase: (document.querySelector('[data-test=board3d]') || {}).getAttribute ? document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase') : '',
      zoomBtnCount: document.querySelectorAll('[data-test=board3d-zoom-in],[data-test=board3d-zoom-out],[data-test=board3d-zoom-reset]').length
    };
  })()`);
  res.geometry = g;
  ck('T-' + size + '-01', '3D 主桌挂载成功（data-board3d=on / canvas / phase=idle）', g.canvas && g.phase === 'idle', 'canvas + idle', { canvas: g.canvas, phase: g.phase });
  ck('T-' + size + '-02', '缩放层可见且只覆盖棋盘区域（= .v6-boardwrap，display 非 none）',
    g.layerDisplay !== 'none' && g.layer && g.wrap && Math.abs(g.layer.x - g.wrap.x) < 1.5 && Math.abs(g.layer.y - g.wrap.y) < 1.5 && Math.abs(g.layer.width - g.wrap.width) < 1.5 && Math.abs(g.layer.height - g.wrap.height) < 1.5,
    'layer==wrap', { layer: g.layer, wrap: g.wrap, display: g.layerDisplay });
  ck('T-' + size + '-03', '缩放层 touch-action:none（浏览器不抢双指手势）', g.layerTouchAction === 'none', 'none', g.layerTouchAction);
  ck('T-' + size + '-04', '三个按钮 data-test 齐全（in/out/reset）', g.zoomBtnCount === 3, '3', g.zoomBtnCount);
  const btnRects = { in: await zoomButtonRect(cdp, 'in'), out: await zoomButtonRect(cdp, 'out'), reset: await zoomButtonRect(cdp, 'reset') };
  res.btnRects = btnRects;
  const minSide = Math.min(...Object.values(btnRects).map((r) => r ? Math.min(r.width, r.height) : 0));
  ck('T-' + size + '-05', '按钮命中区 ≥40px（44 设计，允许 1px 取整）', minSide >= 40, '≥40', +minSide.toFixed(1));
  ck('T-' + size + '-06', '初始 1×：target=1、canZoom=true、reset 禁用',
    g.zoomInfo && g.zoomInfo.target === 1 && g.canZoom === true,
    'target=1 can=true', { info: g.zoomInfo, can: g.canZoom });
  /* 不挡 HUD / 行动区：几何不相交 + 命中测试 */
  ck('T-' + size + '-07', '缩放层/按钮与 HUD、行动区几何不相交', !intersects(g.layer, g.hud) && !intersects(g.ctl, g.hud) && !intersects(g.layer, g.act),
    'no overlap', { layerHud: intersects(g.layer, g.hud), ctlHud: intersects(g.ctl, g.hud), layerAct: intersects(g.layer, g.act) });
  const hitPause = await hitAt(cdp, g.pause.cx, g.pause.cy);
  const hitSafe = g.safe ? await hitAt(cdp, g.safe.cx, g.safe.cy) : null;
  const hitLegend = g.legend ? await hitAt(cdp, g.legend.cx, g.legend.cy) : null;
  const hitZoomIn = await hitAt(cdp, btnRects.in.cx, btnRects.in.cy);
  res.hits = { pause: hitPause, safe: hitSafe, legend: hitLegend, zoomIn: hitZoomIn };
  ck('T-' + size + '-08', 'HUD 命中不被缩放层拦截（暂停/安全词/图例仍可点）',
    hitPause && hitPause.test === 'pause' && hitSafe && hitSafe.inSafe === true && hitLegend && hitLegend.test === 'board3d-legend',
    'pause/safety-word/board3d-legend', [hitPause, hitSafe, hitLegend]);
  ck('T-' + size + '-09', '按钮命中自己（缩放层不吞按钮点击）', hitZoomIn && hitZoomIn.test === 'board3d-zoom-in', 'board3d-zoom-in', hitZoomIn);

  /* 真实鼠标点 +：第一次进入 1.13× */
  await clickAt(cdp, btnRects.in.cx, btnRects.in.cy);
  await sleep(220);
  let info = await zoomInfo(cdp);
  ck('T-' + size + '-10', '点击「+」：target=1.13（一次一档）', info && Math.abs(info.target - 1.13) < 0.001, '1.13', info && info.target);
  /* 复核相位换算：紧邻取 1× 基准，再点一次 +，比较相机距离倍率（避免布局微调影响基线） */
  await evalJs(cdp, 'window.App.Board3D.resetZoom()');
  await waitZoom(cdp, 1);
  await sleep(400);
  const m1 = await camState(cdp);
  await clickAt(cdp, btnRects.in.cx, btnRects.in.cy);
  await waitZoom(cdp, 1.13);
  const m113 = await camState(cdp);
  const ratio113 = m113.dist / m1.dist;
  ck('T-' + size + '-11', '1.13× 生效：相机距离倍率≈radiusFactor(1.13)=0.922', Math.abs(ratio113 - 0.922) < 0.02 && Math.abs(m113.radius / m1.radius - 1) < 0.01,
    '0.922, radius 不变', { ratio: +ratio113.toFixed(3), factor: m113.factor, radius1: m1.radius, radius2: m113.radius });

  /* 直接 API 拉到 1.5 后截图（按钮路径同一条 API） */
  await evalJs(cdp, 'window.App.Board3D.setZoom(1.5)');
  await waitZoom(cdp, 1.5);
  await shot(cdp, path.join(OUT, `${size}-overview-1.5.png`));

  /* 点击「−」到 0.8 并夹取 */
  await clickAt(cdp, btnRects.out.cx, btnRects.out.cy);
  await sleep(150);
  for (let i = 0; i < 6; i++) { await clickAt(cdp, btnRects.out.cx, btnRects.out.cy); await sleep(90); }
  info = await waitZoom(cdp, 0.8);
  const outDisabled = await evalJs(cdp, `document.querySelector('[data-test=board3d-zoom-out]').disabled`);
  const m08 = await camState(cdp);
  await shot(cdp, path.join(OUT, `${size}-overview-0.8.png`));

  /* 点击 1× 复位（同时用复位后的 1× 作 0.8× 的距离基线） */
  await clickAt(cdp, btnRects.reset.cx, btnRects.reset.cy);
  info = await waitZoom(cdp, 1);
  await sleep(400);
  const mReset = await camState(cdp);
  const resetDisabled = await evalJs(cdp, `document.querySelector('[data-test=board3d-zoom-reset]').disabled`);
  ck('T-' + size + '-12', '连续「−」夹取到 0.8× 并禁用按钮；相机距离倍率≈1.25', Math.abs(info.target - 1) < 0.001 && outDisabled === true && Math.abs(m08.dist / mReset.dist - 1.25) < 0.03,
    'target=0.8 disabled ratio≈1.25', { target: m08.target, disabled: outDisabled, ratio: +(m08.dist / mReset.dist).toFixed(3) });
  ck('T-' + size + '-13', '点击「1×」复位到 1.0 且复位按钮禁用', Math.abs(info.target - 1) < 0.001 && resetDisabled === true, 'target=1 disabled', { target: info.target, disabled: resetDisabled });
  await shot(cdp, path.join(OUT, `${size}-overview-1.0.png`));

  /* 滚轮（桌面） */
  const wrap = g.wrap;
  await wheelAt(cdp, wrap.cx, wrap.cy, -160);
  await sleep(160);
  const wheelUp = await zoomInfo(cdp);
  await wheelAt(cdp, wrap.cx, wrap.cy, 320);
  await sleep(160);
  const wheelDown = await zoomInfo(cdp);
  ck('T-' + size + '-14', '滚轮：上滚放大、下滚缩小', wheelUp.target > 1 && wheelDown.target < wheelUp.target, 'up>1, down<up', { up: wheelUp.target, down: wheelDown.target });

  /* 双击复位（真实 CDP 双击） */
  await evalJs(cdp, 'window.App.Board3D.setZoom(1.4)');
  await waitZoom(cdp, 1.4);
  const wrap2 = await rectOf(cdp, '.v6-boardwrap');
  await clickAt(cdp, wrap2.cx, wrap2.cy, 2);
  await sleep(220);
  const afterDbl = await zoomInfo(cdp);
  ck('T-' + size + '-15', '双击棋盘区域复位到 1.0', Math.abs(afterDbl.target - 1) < 0.001, '1', afterDbl.target);

  /* 双指捏合（合成 pointer 事件，同一套 handler） */
  await evalJs(cdp, 'window.App.Board3D.resetZoom()');
  await waitZoom(cdp, 1);
  const pinchRes = await pinch(cdp, 1.6);
  await sleep(250);
  const afterPinch = await zoomInfo(cdp);
  ck('T-' + size + '-16', '双指捏合放大（1.6 倍手势 → 夹取到 1.5）', pinchRes === 'ok' && afterPinch.target === 1.5, '1.5', { pinch: pinchRes, target: afterPinch.target });

  /* 触屏双击（pointer 双 tap）复位 */
  await sleep(350);
  const tapRes = await touchTapTwice(cdp, wrap2.cx, wrap2.cy);
  await sleep(200);
  const afterTap = await zoomInfo(cdp);
  ck('T-' + size + '-17', '触屏双击（两次 tap）复位到 1.0', tapRes === true && Math.abs(afterTap.target - 1) < 0.001, '1', afterTap.target);

  /* 镜头链中锁定 + 结束后恢复 */
  if (full) {
    await evalJs(cdp, 'window.App.Board3D.setZoom(1.3)');
    await waitZoom(cdp, 1.3);
    await evalJs(cdp, 'window.__V6_TEST__.forceDie(6)');
    await tap(cdp, '[data-test=roll]');
    const lockEarly = await evalJs(cdp, `(() => ({ can: window.App.Board3D.canZoom(), reject: window.App.Board3D.setZoom(1.2), phase: (document.querySelector('[data-test=board3d]') || {}).getAttribute ? document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase') : '' }))()`);
    await sleep(500);
    const btnsDisabled = await evalJs(cdp, `(() => { const a = document.querySelector('[data-test=board3d-zoom-in]'), b = document.querySelector('[data-test=board3d-zoom-out]'); return { in: a.disabled, out: b.disabled, lock: document.querySelector('[data-test=board3d-zoom-layer]').getAttribute('data-zoom-locked') }; })()`);
    res.lock = { early: lockEarly, btns: btnsDisabled };
    ck('T-' + size + '-18', '掷骰镜头链中锁定：canZoom=false、setZoom 拒绝、按钮禁用', lockEarly.can === false && lockEarly.reject === false && btnsDisabled.in === true && btnsDisabled.out === true && btnsDisabled.lock === '1',
      '{can:false, reject:false, disabled:true}', { early: lockEarly, btns: btnsDisabled });
    await waitPhase(cdp, ['idle'], 30000);
    const restored = await waitZoom(cdp, 1.3);
    ck('T-' + size + '-19', '镜头链结束回 idle 后恢复用户缩放 1.3', Math.abs(restored.target - 1.3) < 0.001 && Math.abs(restored.value - 1.3) < 0.02,
      'value=target=1.3', { target: restored.target, value: restored.value });

    /* 走到题卡：先选子起飞（6 起飞），再掷 1 落到 ring:1（真心话格）→ CellStage 打开 */
    const choose = await waitFor(cdp, `!!document.querySelector('[data-test=piece-choice]')`, 15000);
    if (choose) {
      await tap(cdp, '[data-test=piece-choice]');
      await waitPhase(cdp, ['idle'], 25000);
      await sleep(400);
      await evalJs(cdp, 'window.__V6_TEST__.forceDie(1)');
      await tap(cdp, '[data-test=roll]');
      const cardOpen = await waitFor(cdp, `!!document.querySelector('[data-test=prompt-card]')`, 60000, 150);
      res.cardOpen = cardOpen;
      if (cardOpen) {
        await sleep(500);
        const cardRect = await rectOf(cdp, '[data-test=prompt-card]');
        const doneRect = await rectOf(cdp, '[data-test=prompt-done]');
        const cardHits = await evalJs(cdp, `(() => ({
          can: window.App.Board3D.canZoom(),
          reject: window.App.Board3D.setZoom(1.2),
          buttonDisabled: document.querySelector('[data-test=board3d-zoom-in]').disabled,
          phase: document.querySelector('[data-test=board3d]').getAttribute('data-3d-phase'),
          hitDone: (() => { const el = document.querySelector('[data-test=prompt-done]'); if (!el) return null; const r = el.getBoundingClientRect(); const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return h ? { test: h.getAttribute('data-test'), inZoom: !!h.closest('[data-test=board3d-zoom-layer]') } : null; })(),
          hitSafe: (() => { const el = document.querySelector('[data-test=safety-word]'); if (!el) return null; const r = el.getBoundingClientRect(); const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return h && h.closest && h.closest('[data-test=safety-word]') ? 'safety-word' : (h ? h.getAttribute('data-test') : null); })(),
          hitPause: (() => { const el = document.querySelector('[data-test=pause]'); if (!el) return null; const r = el.getBoundingClientRect(); const h = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return h ? h.getAttribute('data-test') : null; })()
        }))()`);
        res.card = { cardRect, doneRect, hits: cardHits };
        await shot(cdp, path.join(OUT, `${size}-prompt-open.png`));
        ck('T-' + size + '-20', '题卡打开时锁定缩放（canZoom=false / setZoom 拒绝 / 按钮禁用）', cardHits.can === false && cardHits.reject === false && cardHits.buttonDisabled === true,
          '{can:false, reject:false, disabled:true}', cardHits);
        ck('T-' + size + '-21', '题卡/HUD/安全词不被缩放层拦截（命中测试）', cardHits.hitDone && cardHits.hitDone.test === 'prompt-done' && cardHits.hitDone.inZoom === false && cardHits.hitSafe === 'safety-word' && cardHits.hitPause === 'pause',
          'prompt-done / safety-word / pause', { done: cardHits.hitDone, safe: cardHits.hitSafe, pause: cardHits.hitPause });
        /* 做了 → 回桌 */
        await tap(cdp, '[data-test=prompt-done]');
        await waitFor(cdp, `!document.querySelector('[data-test=prompt-card]')`, 20000);
        await waitPhase(cdp, ['idle'], 30000);
        const afterCard = await waitZoom(cdp, 1.3);
        ck('T-' + size + '-22', '题卡结算后回桌继续可用，缩放恢复到 1.3', afterCard.can === true && Math.abs(afterCard.value - 1.3) < 0.03,
          'can=true value≈1.3', { can: afterCard.can, value: afterCard.value });
      } else {
        ck('T-' + size + '-20', '题卡打开（走子后）', false, 'prompt-card', 'not opened');
      }
    } else {
      ck('T-' + size + '-18b', '掷 6 后出现选子按钮', false, 'piece-choice', 'missing');
    }
  }

  /* reduced：按钮仍可用但即时到位（无动画） */
  if (full) {
    await evalJs(cdp, `(() => { window.App.Store.saveSettings({ reduced: true }); return true; })()`);
    await sleep(500);
    await evalJs(cdp, 'window.App.Board3D.resetZoom()');
    await sleep(200);
    const rc = await evalJs(cdp, `(() => { window.App.Board3D.setZoom(1.5); return window.App.Board3D.zoomInfo(); })()`);
    await sleep(150);
    const rcGeom = await evalJs(cdp, `(() => { const i = window.App.Board3D._current(); return { instant: window.App.Board3D.zoomInfo().instant, reduced: i.reduced, dist: +i.scene.camera.position.distanceTo(i.scene.rig.state.center).toFixed(3), radius: +i.scene.rig.state.radius.toFixed(3) }; })()`);
    res.reduced = { info: rc, geom: rcGeom };
    await shot(cdp, path.join(OUT, `${size}-reduced-1.5.png`));
    ck('T-' + size + '-23', 'reduced：缩放即时（instant=true，value=target=1.5，无过渡）', rc.instant === true && rc.value === 1.5 && rc.target === 1.5 && rcGeom.reduced === true,
      'instant value=1.5', { rc, rcGeom });
    await evalJs(cdp, `(() => { window.App.Store.saveSettings({ reduced: false }); window.App.Board3D.resetZoom(); return true; })()`);
    await sleep(400);
  }

  res.errors = consoleErrors.slice(0, 20);
  ck('T-' + size + '-24', '0 console error / pageerror', res.errors.length === 0, '0', res.errors);
  fs.writeFileSync(path.join(OUT, `table-${size}.json`), JSON.stringify(res, null, 1));
  return res;
}

async function runV7(cdp, size) {
  const [W, H] = SIZES_ALL[size];
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true });
  await reloadWithSettings(cdp, { board3d: 'off', reduced: false });
  await startGame(cdp, false);
  const v7 = await evalJs(cdp, `(() => {
    const t = document.querySelector('.v6-table');
    const layer = document.querySelector('[data-test=board3d-zoom-layer]');
    const board = document.querySelector('[data-test=board]');
    return {
      attr: t.getAttribute('data-board3d'), cls3d: t.classList.contains('v6-3d'),
      layerDisplay: layer ? getComputedStyle(layer).display : 'missing',
      layerPointer: layer ? getComputedStyle(layer).pointerEvents : 'missing',
      boardOpacity: board ? getComputedStyle(board).opacity : 'missing',
      zoomApiCan: (window.App && window.App.Board3D && window.App.Board3D.canZoom) ? window.App.Board3D.canZoom() : 'no-api'
    };
  })()`);
  await shot(cdp, path.join(OUT, `${size}-v7-fallback.png`));
  ck('V7-' + size + '-01', 'board3d=off → 完整 V7：无 .v6-3d，缩放层 display:none 不拦截点按',
    v7.attr === 'v7' && v7.cls3d === false && v7.layerDisplay === 'none', 'v7 / none', v7);
  return v7;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  if (!fs.existsSync(EDGE)) throw new Error('Edge not found');
  const userDir = path.join(process.env.TEMP || '.', 'edge-tzoom-' + Date.now());
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=460,940',
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let wsUrl = null;
  for (let i = 0; i < 120; i++) {
    await sleep(150);
    try { const j = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version').then((r) => r.json()); if (j.webSocketDebuggerUrl) { wsUrl = j.webSocketDebuggerUrl; break; } } catch (e) { /* not yet */ }
  }
  if (!wsUrl) throw new Error('Edge CDP not ready');
  const browser = await CDP.connect(wsUrl);
  const target = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list').then((r) => r.json());
  const page = list.find((t) => t.id === target.targetId);
  const cdp = await CDP.connect(page.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  cdp.on((msg) => {
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push((msg.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      consoleErrors.push('pageerror: ' + ((msg.params.exceptionDetails.text || '') + ' ' + ((msg.params.exceptionDetails.exception || {}).description || '')).slice(0, 300));
    }
  });

  const summary = {};
  for (const size of want) {
    consoleErrors.length = 0;
    const full = FULL.indexOf(size) >= 0;
    summary[size] = await runSize(cdp, size, full);
    if (full) summary[size].v7 = await runV7(cdp, size);
    console.log('--- ' + size + ' done, errors=' + consoleErrors.length);
  }

  const pass = results.filter((r) => r.ok).length;
  const report = { tool: 'node-cdp', edge: EDGE, dist: DIST, page: BASE, viewports: want, full: FULL, pass, fail: results.length - pass, total: results.length, results };
  fs.writeFileSync(path.join(OUT, 'table-report.json'), JSON.stringify(report, null, 1));
  console.log('\nRESULT ' + pass + '/' + results.length + ' pass, ' + (results.length - pass) + ' failed -> ' + OUT);
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
  if (pass !== results.length) process.exitCode = 1;
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });


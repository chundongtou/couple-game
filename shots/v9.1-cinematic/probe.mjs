/* V9.1 · 3D 道具落点探针（Node + Edge/CDP，无外部依赖）
 * 用法: node probe.mjs [--sizes=390x844,320x568,430x932] [--server=8793]
 * 挂载真实 App.Board3D（同 cdp.mjs），把候选桌面坐标投影成 overview 屏幕坐标，
 * 并对每个候选点做「是否落在棋盘圆盘外 / 是否压在 DOM 卡区(右 60%)」判定。
 */
import { spawn } from 'node:child_process';
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
const SIZES = { '390x844': [366, 552], '320x568': [296, 303], '430x932': [406, 640] };
const want = (args.sizes || '390x844,320x568,430x932').split(',');

/* 候选落点（世界坐标 x,z；y 默认桌面 0.006） */
const PTS = {
  cup: [-1.72, 4.28], notebook: [-0.15, 4.62], tickets: [-0.95, 4.95], keys: [1.15, 4.70],
  blanket: [2.70, 4.40], diceTray: [2.95, 3.15], bookStack: [3.05, -3.05], magazine: [3.05, -3.05],
  plant: [-2.70, -3.45], candle: [2.55, -3.55], deskLamp: [-3.15, 2.55], photo: [-3.00, -2.10],
  speaker: [-3.45, 1.00], newspaper: [-2.85, 3.70], postcard: [2.15, -3.45],
  leftBook: [-4.10, -0.60], rightBook: [4.10, -0.60], frontLeftLamp: [-3.00, 3.60]
};

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

const PROJ = (pts) => `(() => {
  const sc = window.App.Board3D._current().scene;
  const W = sc.viewport.w, H = sc.viewport.h;
  const V = sc.camera.position.constructor;
  const proj = (p) => { const q = p.clone().project(sc.camera); return { x: +((q.x+1)/2*W).toFixed(1), y: +((1-q.y)/2*H).toFixed(1), z: +q.z.toFixed(3) }; };
  const b = sc.boardGroup;
  const pts = [];
  for (let i = 0; i < 64; i++) { const a = i/64*Math.PI*2; pts.push(proj(b.localToWorld(new V(Math.cos(a)*3.30, 0.035, Math.sin(a)*3.30)))); }
  const xs = pts.map(p=>p.x), ys = pts.map(p=>p.y);
  const board = { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1), y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) };
  const out = { viewport:[W,H], board, cardLeftX: +(0.40*W).toFixed(1), pts: {} };
  const cand = ${JSON.stringify(pts)};
  for (const [name, [x, z, y]] of Object.entries(cand)) {
    const p = proj(new V(x, y === undefined ? 0.006 : y, z));
    out.pts[name] = { x: p.x, y: p.y,
      insideBoard: p.x > board.x0 && p.x < board.x1 && p.y > board.y0 && p.y < board.y1,
      inCardZone: p.x > 0.40*W };
  }
  window.__proj = out;
  return out;
})()`;

async function main() {
  const userDir = path.join(process.env.TEMP || '.', 'edge-v91probe-' + Date.now());
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
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push((m.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 240));
    if (m.method === 'Runtime.exceptionThrown') errors.push('pageerror ' + JSON.stringify(m.params.exceptionDetails).slice(0, 300));
  });
  const summary = {};
  for (const size of want) {
    const [w, h] = SIZES[size];
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: Math.max(w, 430), height: Math.max(h, 700), deviceScaleFactor: 2, mobile: false });
    await cdp.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
    for (let i = 0; i < 200; i++) { await sleep(120); if (await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`)) break; }
    await sleep(300);
    await evalJs(cdp, `(() => { window.App.Board3D.unmount(); document.body.innerHTML=''; const h=document.createElement('div'); h.id='host';
      h.style.cssText='position:relative;width:${w}px;height:${h}px;overflow:hidden;background:#05080d';
      document.body.style.cssText='margin:0;padding:0;background:#05080d;overflow:hidden'; document.body.appendChild(h); window.__host=h; return true; })()`);
    await evalJs(cdp, `(async () => { const st=window.__demo.state(); const view=window.App.Flight.view(st,{reduced:false});
      const inst=await window.App.Board3D.mount(window.__host,{reduced:false,theme:'cloud',state:st,view,mode:'quick',sound:false,adapt:false,shadows:true,stageAim:{nx:-0.6,ny:0.14}});
      window.__inst=inst; await new Promise(r=>setTimeout(r,900)); return !!inst; })()`);
    await sleep(1200);
    summary[size] = await evalJs(cdp, PROJ(PTS));
  }
  summary.errors = errors.slice(0, 10);
  console.log(JSON.stringify(summary, null, 1));
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

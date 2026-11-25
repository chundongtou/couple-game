/* V9.1 · 3D 道具落点探针 v2：投影候选道具的「屏幕矩形」（底点/顶点/左右点）
 * 用法: node probe2.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const SERVER_PORT = 8793;
const CDP_PORT = 9335;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SIZES = { '390x844': [366, 552], '320x568': [296, 303], '430x932': [406, 640] };
const want = ['390x844', '320x568', '430x932'];

/* name: [x, z, w, h, d]  （w/h/d 世界尺寸；h=高度） */
const PTS = {
  lamp:      [-2.55, -3.20, 0.52, 0.62, 0.40],
  plant:     [2.75, -3.15, 0.42, 0.55, 0.42],
  candle:    [-1.45, -3.75, 0.20, 0.46, 0.20],
  books:     [3.02, -2.55, 0.55, 0.30, 0.42],
  photo:     [-3.15, -2.30, 0.30, 0.30, 0.10],
  cup:       [-1.72, 4.28, 0.70, 0.55, 0.70],
  notebook:  [-0.15, 4.62, 0.70, 0.06, 0.50],
  tickets:   [-0.95, 4.95, 0.34, 0.012, 0.16],
  keys:      [1.15, 4.70, 0.24, 0.03, 0.16],
  blanket:   [2.35, 4.55, 0.80, 0.20, 0.62],
  diceTray:  [2.75, 3.35, 0.62, 0.12, 0.62],
  speaker:   [-2.70, 2.60, 0.34, 0.22, 0.22],
  cassette:  [-2.90, 3.60, 0.36, 0.05, 0.24],
  glasses:   [0.30, 4.35, 0.30, 0.04, 0.16],
  mugs2:     [1.90, 4.90, 0.40, 0.28, 0.40],
  lampR:     [2.95, 1.95, 0.40, 0.45, 0.34],
  deck:      [-2.55, -1.80, 0.40, 0.05, 0.28]
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
  const proj = (x,y,z) => { const q = new V(x,y,z).project(sc.camera); return { x: +((q.x+1)/2*W).toFixed(1), y: +((1-q.y)/2*H).toFixed(1) }; };
  const b = sc.boardGroup;
  const ring = [];
  for (let i = 0; i < 64; i++) { const a = i/64*Math.PI*2; const p = proj((Math.cos(a)*3.30),0.035,(Math.sin(a)*3.30)); ring.push(p); }
  const xs = ring.map(p=>p.x), ys = ring.map(p=>p.y);
  const board = { x0: +Math.min(...xs).toFixed(1), x1: +Math.max(...xs).toFixed(1), y0: +Math.min(...ys).toFixed(1), y1: +Math.max(...ys).toFixed(1) };
  const out = { viewport:[W,H], board, pts: {} };
  const cand = ${JSON.stringify(pts)};
  for (const [name, [x, z, w, h, d]] of Object.entries(cand)) {
    const base = proj(x, 0.006, z), top = proj(x, h, z);
    const left = proj(x - w/2, h*0.5, z), right = proj(x + w/2, h*0.5, z);
    out.pts[name] = { base, top, left, right,
      x0: +Math.min(left.x, right.x).toFixed(1), x1: +Math.max(left.x, right.x).toFixed(1),
      y0: +Math.min(top.y, base.y).toFixed(1), y1: +Math.max(top.y, base.y).toFixed(1),
      onScreen: left.x > 0 && right.x < W && top.y > 0 && base.y < H };
  }
  return out;
})()`;

async function main() {
  const userDir = path.join(process.env.TEMP || '.', 'edge-v91probe2-' + Date.now());
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
  console.log(JSON.stringify(summary, null, 1));
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

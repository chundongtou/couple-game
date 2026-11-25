/* V9.1 路 3D 閬撳叿钀界偣鎺㈤拡 v2锛氭姇褰卞€欓€夐亾鍏风殑銆屽睆骞曠煩褰€嶏紙搴曠偣/椤剁偣/宸﹀彸鐐癸級
 * 鐢ㄦ硶: node probe2.mjs
 */
import { spawn } from 'node:child_process';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const SERVER_PORT = 8793;
const CDP_PORT = 9335;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const SIZES = { '390x844': [366, 552], '320x568': [296, 303], '430x932': [406, 640] };
const want = ['390x844', '320x568', '430x932'];

/* name: [x, z, w, h, d]  锛坵/h/d 涓栫晫灏哄锛沨=楂樺害锛?*/
const PTS = {
  cup2:      [-2.42, 4.30, 0.42, 0.30, 0.42],
  notebook:  [-0.10, 4.15, 0.84, 0.06, 0.56],
  glassesN:  [-0.30, 4.18, 0.20, 0.05, 0.16],
  tickets:   [-1.05, 4.42, 0.34, 0.02, 0.16],
  keys:      [1.05, 4.05, 0.30, 0.04, 0.20],
  cards:     [1.90, 4.35, 0.22, 0.02, 0.10],
  blanket:   [1.75, 4.05, 0.84, 0.16, 0.60],
  trayA:     [2.30, 3.60, 0.66, 0.12, 0.66],
  trayB:     [1.62, 3.62, 0.66, 0.12, 0.66],
  trayC:     [2.05, 3.52, 0.66, 0.12, 0.66],
  lamp:      [-2.55, -3.20, 0.52, 0.86, 0.40],
  candle:    [-1.30, -3.85, 0.20, 0.55, 0.20],
  plant:     [2.78, -3.18, 0.42, 0.62, 0.42],
  books:     [3.02, -2.52, 0.55, 0.30, 0.42],
  photo:     [-3.18, -2.28, 0.36, 0.44, 0.10]};

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


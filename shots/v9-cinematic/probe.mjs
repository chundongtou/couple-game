/* V9 运行时探针：挂载 3D 后打印 _debug()（相机/材质/画质），用于排查视觉差异 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REPO = path.resolve(import.meta.dirname, '..', '..');
const PORT = 8793, CDP_PORT = 9444;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

async function main() {
  const userDir = path.join(process.env.TEMP || '.', 'edge-v9probe-' + Date.now());
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
  const logs = [];
  cdp.on((m) => { if (m.method === 'Runtime.consoleAPICalled') logs.push([m.params.type, (m.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 300)]);
    if (m.method === 'Runtime.exceptionThrown') logs.push(['pageerror', JSON.stringify(m.params.exceptionDetails).slice(0, 400)]); });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 430, height: 700, deviceScaleFactor: 2, mobile: false });
  await cdp.send('Page.navigate', { url: `http://127.0.0.1:${PORT}/app/dev/board3d-prod-demo.html?sound=0&adapt=0` });
  for (let i = 0; i < 200; i++) { await sleep(120); if (await evalJs(cdp, `document.body && document.body.getAttribute('data-ready') === '1'`)) break; }
  await sleep(300);
  await evalJs(cdp, `(() => { window.App.Board3D.unmount(); document.body.innerHTML=''; const h=document.createElement('div'); h.id='host';
    h.style.cssText='position:relative;width:366px;height:552px;overflow:hidden;background:#05080d';
    document.body.style.cssText='margin:0;padding:0;background:#05080d;overflow:hidden'; document.body.appendChild(h); window.__host=h; return true; })()`);
  await evalJs(cdp, `(async () => { const st=window.__demo.state(); const view=window.App.Flight.view(st,{reduced:false});
    const inst=await window.App.Board3D.mount(window.__host,{reduced:false,theme:'cloud',state:st,view,mode:'quick',sound:false,adapt:false,shadows:true,stageAim:{nx:-0.6,ny:0.14}});
    window.__inst=inst; await new Promise(r=>setTimeout(r,1200)); return !!inst; })()`);
  await sleep(2500);
  const dbg = await evalJs(cdp, 'window.App.Board3D._debug()');
  const extra = await evalJs(cdp, `(() => { const sc=window.App.Board3D._current().scene; const c=sc.camera;
    return { elevK: sc._elevK, camFov: c.fov, camPos: c.position.toArray().map(v=>+v.toFixed(3)), rig: { elev: sc.rig.state.elev, fov: sc.rig.state.fov, radius: sc.rig.state.radius },
      env: !!sc.scene.environment, exposure: sc.renderer.toneMappingExposure, tone: sc.renderer.toneMapping,
      quality: sc.quality, dpr: sc.renderer.getPixelRatio(), dust: sc._dustCount,
      wallMap: !!sc.wallMat.map, overMap: !!sc.matOverMat.map, tileMap: !!sc.tileMat.map,
      lights: { key: sc.key.intensity, rim: sc.rim.intensity, lamp: sc.lamp.intensity, hemi: sc.hemi.intensity },
      woodRepeat: sc._wood.map.repeat.toArray(), matKeys: Object.keys(sc).filter(k=>/tex|mat/i.test(k)).length }; })()`);
  console.log(JSON.stringify({ dbg: dbg.probe, cinematic: dbg.cinematic, quality: dbg.quality, drawCalls: dbg.drawCalls, triangles: dbg.triangles, extra, logs: logs.slice(0, 20) }, null, 1));
  await browser.send('Target.closeTarget', { targetId: target.targetId });
  browser.close();
  try { edge.kill(); } catch (e) { /* noop */ }
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

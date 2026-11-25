/* 快速探针：headless Edge 里 WebGL2 用的是真 GPU 还是 SwiftShader。
 * 用法: node gpu-probe.mjs
 */
import { spawn } from 'node:child_process';
const CDP_PORT = 9335;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const flags = process.argv.includes('--swiftshader')
  ? ['--enable-unsafe-swiftshader', '--use-angle=swiftshader']
  : ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT,
  '--user-data-dir=' + (process.env.TEMP || '.') + '\\edge-gpu-' + Date.now(),
  '--no-first-run', ...flags, 'about:blank'], { stdio: 'ignore' });
let wsUrl = null;
for (let i = 0; i < 100; i++) {
  await sleep(150);
  try {
    const j = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version').then((r) => r.json());
    wsUrl = j.webSocketDebuggerUrl; if (wsUrl) break;
  } catch (e) { /* wait */ }
}
const ws = new WebSocket(wsUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
const send = (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); });
const t = await send('Target.createTarget', { url: 'about:blank' });
const list = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list').then((r) => r.json());
const page = list.find((x) => x.id === t.result.targetId);
const ws2 = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws2.addEventListener('open', r, { once: true }));
const pending2 = new Map();
ws2.addEventListener('message', (ev) => {
  const m = JSON.parse(ev.data);
  if (m.id && pending2.has(m.id)) { pending2.get(m.id)(m); pending2.delete(m.id); }
});
const send2 = (method, params) => new Promise((res) => { const i = ++id; pending2.set(i, res); ws2.send(JSON.stringify({ id: i, method, params: params || {} })); });
await send2('Runtime.enable');
const r = await send2('Runtime.evaluate', {
  expression: `(() => {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return { webgl2: false };
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    return { webgl2: true,
      renderer: ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'n/a',
      vendor: ext ? gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) : 'n/a' };
  })()`, returnByValue: true
});
console.log(JSON.stringify(r.result.result.value || r.result, null, 1));
try { edge.kill(); } catch (e) { /* noop */ }
process.exit(0);

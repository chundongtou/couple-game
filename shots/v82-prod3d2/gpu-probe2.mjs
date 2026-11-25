/* 探针 2：页面内按 App 的 WebGLRenderer 参数建 context，看拿到的是真 GPU 还是 SwiftShader。
 * 用法: node gpu-probe2.mjs [--swiftshader]
 */
import { spawn } from 'node:child_process';
const CDP_PORT = 9336;
const SERVER_PORT = 8793;
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const flags = process.argv.includes('--swiftshader')
  ? ['--enable-unsafe-swiftshader', '--use-angle=swiftshader']
  : ['--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--disable-gpu-sandbox'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + CDP_PORT,
  '--user-data-dir=' + (process.env.TEMP || '.') + '\\edge-gpu2-' + Date.now(),
  '--no-first-run', ...flags, 'about:blank'], { stdio: 'ignore' });
let wsUrl = null;
for (let i = 0; i < 100; i++) {
  await sleep(150);
  try {
    const j = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/version').then((r) => r.json());
    wsUrl = j.webSocketDebuggerUrl; if (wsUrl) break;
  } catch (e) { /* wait */ }
}
const conn = async (url) => {
  const ws = new WebSocket(url);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  return { send: (method, params) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params: params || {} })); }) };
};
const b = await conn(wsUrl);
const t = await b.send('Target.createTarget', { url: 'about:blank' });
const list = await fetch('http://127.0.0.1:' + CDP_PORT + '/json/list').then((r) => r.json());
const page = await conn(list.find((x) => x.id === t.result.targetId).webSocketDebuggerUrl);
await page.send('Runtime.enable');
await page.send('Page.navigate', { url: `http://127.0.0.1:${SERVER_PORT}/app/dev/board3d-prod-demo.html?sound=0` });
await sleep(2500);
const r = await page.send('Runtime.evaluate', {
  expression: `(() => {
    const probe = (opts) => {
      const c = document.createElement('canvas');
      const gl = c.getContext('webgl2', opts);
      if (!gl) return 'no-webgl2';
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'no-ext';
    };
    const inst = window.App.Board3D && window.App.Board3D._current();
    const sc = inst && inst.scene;
    const gl2 = sc ? sc.renderer.getContext() : null;
    const ext2 = gl2 && gl2.getExtension('WEBGL_debug_renderer_info');
    return {
      default: probe(undefined),
      appOpts: probe({ antialias: true, alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }),
      noAniso: probe({ alpha: false, powerPreference: 'high-performance', stencil: false, depth: true }),
      current: gl2 ? (ext2 ? gl2.getParameter(ext2.UNMASKED_RENDERER_WEBGL) : 'no-ext') : 'no-instance',
      quality: sc ? sc.quality : null, dpr: sc ? sc.renderer.getPixelRatio() : null
    };
  })()`, returnByValue: true
});
console.log(JSON.stringify(r.result.result.value || r.result, null, 1));
try { edge.kill(); } catch (e) { /* noop */ }
process.exit(0);

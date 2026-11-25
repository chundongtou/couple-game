/* 调试探针：打开 demo，打印 console / pageerror / loading 文案 / 挂载状态 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9334;
const URL = process.argv[2] || 'http://127.0.0.1:8795/app/dev/board3d-prod-demo.html?adapt=0&sound=0';
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
    return new Promise((res, rej) => { this.pending.set(id, { resolve: res, reject: rej }); this.ws.send(JSON.stringify({ id, method, params: params || {} })); });
  }
  on(f) { this.handlers.push(f); }
}

async function main() {
  const userDir = path.join(process.env.TEMP || '.', 'edge-probe-' + Date.now());
  const edge = spawn(EDGE, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDir,
    '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--window-size=460,940',
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
  let wsUrl = null;
  for (let i = 0; i < 120; i++) {
    await sleep(150);
    try { const j = await fetch('http://127.0.0.1:' + PORT + '/json/version').then((r) => r.json()); if (j.webSocketDebuggerUrl) { wsUrl = j.webSocketDebuggerUrl; break; } } catch (e) {}
  }
  const browser = await CDP.connect(wsUrl);
  const target = await browser.send('Target.createTarget', { url: 'about:blank' });
  const list = await fetch('http://127.0.0.1:' + PORT + '/json/list').then((r) => r.json());
  const page = list.find((t) => t.id === target.targetId);
  const cdp = await CDP.connect(page.webSocketDebuggerUrl);
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  const logs = [];
  cdp.on((msg) => {
    if (msg.method === 'Runtime.consoleAPICalled') logs.push('[console.' + msg.params.type + '] ' + (msg.params.args || []).map((a) => a.value || a.description || '').join(' ').slice(0, 300));
    if (msg.method === 'Runtime.exceptionThrown') logs.push('[pageerror] ' + ((msg.params.exceptionDetails.text || '') + ' ' + ((msg.params.exceptionDetails.exception || {}).description || '')).slice(0, 500));
    if (msg.method === 'Log.entryAdded') logs.push('[log] ' + msg.params.entry.level + ' ' + msg.params.entry.text.slice(0, 300));
  });
  await cdp.send('Log.enable').catch(() => {});
  await cdp.send('Network.enable').catch(() => {});
  cdp.on((msg) => {
    if (msg.method === 'Network.responseReceived' && msg.params.response && msg.params.response.status >= 400) {
      logs.push('[http ' + msg.params.response.status + '] ' + msg.params.response.url);
    }
    if (msg.method === 'Network.loadingFailed') {
      logs.push('[netfail] ' + msg.params.errorText + ' ' + (msg.params.requestId || ''));
    }
  });
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await cdp.send('Page.navigate', { url: URL });
  await sleep(12000);
  const ev = async (expr) => {
    const r = await cdp.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    return r.exceptionDetails ? { err: JSON.stringify(r.exceptionDetails).slice(0, 300) } : (r.result && r.result.value);
  };
  const state = await ev(`(() => ({
    ready: document.body && document.body.getAttribute('data-ready'),
    loading: (document.querySelector('#loading') || {}).textContent,
    hasApp: !!(window.App && window.App.Flight),
    hasB3D: !!(window.App && window.App.Board3D),
    webgl2: (() => { try { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); } catch (e) { return 'err:' + e.message; } })(),
    stageFallback: (document.querySelector('#stage') || {}).getAttribute ? document.querySelector('#stage').getAttribute('data-3d-fallback') : null
  }))()`);
  console.log(JSON.stringify({ logs, state }, null, 1));
  try { edge.kill(); } catch (e) {}
}
main().catch((e) => { console.error('FATAL', e); process.exit(1); });

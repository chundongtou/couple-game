/* 快速抓帧（V9.4）：一次 play 内用「冻结 + 手动把动画推进到目标时刻」抓 4 帧，
 * 避免 headless SwiftShader 低帧把墙钟拉长；同时验证 settled 帧 hand=false。 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIST = path.resolve(ROOT, process.argv[2] || 'dist/v94');
const OUT = path.resolve(ROOT, process.argv[3] || 'shots/v9.4-dice/quick');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8936, CDP_PORT = 9356;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.wav': 'audio/wav', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP { constructor(ws){this.ws=ws;this.id=0;this.p=new Map();this.l=new Map();ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&this.p.has(m.id)){const{r,j}=this.p.get(m.id);this.p.delete(m.id);m.error?j(new Error(m.error.message)):r(m.result);return;}if(m.method)for(const f of this.l.get(m.method)||[])f(m.params||{});});}
 send(method,params={}){const id=++this.id;return new Promise((r,j)=>{this.p.set(id,{r,j});this.ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);j(new Error('timeout '+method));}},120000);});}
 on(m,f){const a=this.l.get(m)||[];a.push(f);this.l.set(m,a);} }
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',()=>j(new Error('ws')),{once:true});});return new CDP(ws);}
async function main(){
  fs.mkdirSync(OUT,{recursive:true});
  const server=http.createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const f=path.join(DIST,p);fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);res.end('404');return;}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(b);});});
  await new Promise((r)=>server.listen(PORT,'127.0.0.1',r));
  const profile=await fsp.mkdtemp(path.join(os.tmpdir(),'edge-v94q-'));
  const edge=spawn(EDGE,['--headless=new','--remote-debugging-port='+CDP_PORT,'--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-extensions','--use-angle=swiftshader','--enable-unsafe-swiftshader','--window-size=390,844','about:blank'],{stdio:'ignore',detached:true});edge.unref();
  let ver=null;for(let i=0;i<150;i++){await sleep(150);try{const r=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/version');ver=await r.json();if(ver.webSocketDebuggerUrl)break;}catch(e){}}
  const browser=await connect(ver.webSocketDebuggerUrl);
  const tg=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
  const cdp=await connect(tg.webSocketDebuggerUrl);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  const logs=[];cdp.on('Runtime.consoleAPICalled',(p)=>{logs.push([p.type,(p.args||[]).map(a=>a.value||a.description||'').join(' ').slice(0,300)]);});
  cdp.on('Runtime.exceptionThrown',(p)=>logs.push(['pageerror',JSON.stringify(p.exceptionDetails).slice(0,400)]));
  const ev=async(expr)=>{const r=await cdp.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw new Error((r.exceptionDetails.exception||{}).description||r.exceptionDetails.text);return r.result&&r.result.value;};
  const shot=async(file)=>{const r=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(file,Buffer.from(r.data,'base64'));return fs.statSync(file).size;};
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await cdp.send('Page.navigate',{url:`http://127.0.0.1:${PORT}/`});
  for(let i=0;i<200;i++){await sleep(120);if(await ev("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))"))break;}
  await ev(`App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:false,board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}})`);
  await sleep(200);
  await ev(`(() => { const m=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(m.state); App.Router.reset('table'); return true; })()`);
  await sleep(1000);
  await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
  for(let i=0;i<400;i++){await sleep(150);const ok=await ev("!!(document.querySelector('.v6-table') && document.querySelector('.v6-table').getAttribute('data-board3d') && document.querySelector('.v6-table').getAttribute('data-board3d') !== 'pending' && window.App.Board3D && window.App.Board3D._current())");if(ok)break;}
  await sleep(2200);
  const hand = await ev(`(() => {
    const sc = App.Board3D._current().scene;
    let draws=0,tris=0;
    sc._hand.group.traverse((o)=>{ if(!o.isMesh||!o.geometry)return; draws++; const g=o.geometry; const n=g.index?g.index.count:g.attributes.position.count; let inst=o.isInstancedMesh?o.count:1; tris += n/3*inst; });
    return { draws, tris, scale: sc._hand.group.scale.x, grip: sc._hand.gripLocal.toArray() };
  })()`);
  await ev(`(() => { App.Board3D.play([{ type:'dice', die:4 }]); return true; })()`);
  for(let i=0;i<300;i++){await sleep(50);const ok=await ev(`(() => { const sc=App.Board3D._current().scene; return !!(sc._toss && sc.anims.length); })()`);if(ok)break;}
  const jump = async (t) => ev(`(() => {
    const sc = App.Board3D._current().scene;
    sc._paused = true; if (sc._raf) { cancelAnimationFrame(sc._raf); sc._raf = 0; }
    let a = null; for (const x of sc.anims) { if (x.ms > 1500) a = x; else x.t = x.ms; }
    if (!a) return { ok:false, n: sc.anims.length, tossing: !!sc._toss };
    a.t = Math.min(${t}, a.ms);
    sc._last = performance.now();
    sc._tickAnims(0);
    sc.renderNow();
    const d = sc.dieDebug();
    const dbg = App.Board3D._debug();
    return { ok:true, t:d.t, die:d, hand:d.hand, calls:dbg.drawCalls, tris:dbg.triangles, phase:dbg.phase, remaining: sc.anims.length };
  })()`);
  const resume = async () => ev(`(() => { const sc=App.Board3D._current().scene; sc._paused=false; sc._last=0; sc._startLoop(); return true; })()`);
  const frames = {};
  for (const [name, t] of [['hold',730],['throw',960],['bounce',1210],['settled',2400]]) {
    const info = await jump(t);
    await sleep(120);
    const bytes = await shot(path.join(OUT, `390x844-${name}.png`));
    frames[name] = { ...info, bytes };
    console.log(name, JSON.stringify({ t: info.t, hand: info.hand, die: info.die && { value: info.die.value, top: info.die.top, pos: info.die.pos }, calls: info.calls, tris: info.tris, bytes }));
  }
  await resume();
  for(let i=0;i<300;i++){await sleep(200);const busy=await ev("window.App.Board3D._debug().busy");if(!busy)break;}
  await sleep(600);
  const over = await ev(`(() => { const sc=App.Board3D._current().scene; sc._paused=true; if(sc._raf){cancelAnimationFrame(sc._raf);sc._raf=0;} sc._last=performance.now(); sc.renderNow(); const d=sc.dieDebug(); const dbg=App.Board3D._debug(); return { t:d.t, die:d, hand:d.hand, calls:dbg.drawCalls, tris:dbg.triangles }; })()`);
  const overBytes = await shot(path.join(OUT, '390x844-settled-overview.png'));
  console.log('overview', JSON.stringify({ die: over.die, calls: over.calls, tris: over.tris, bytes: overBytes }));
  fs.writeFileSync(path.join(OUT,'report.json'), JSON.stringify({ hand, frames, overview: { ...over, bytes: overBytes }, logs: logs.slice(0,10) }, null, 1));
  console.log('logs', JSON.stringify(logs.slice(0,10)));
  await browser.send('Browser.close').catch(()=>{});
  await sleep(200); try{process.kill(-edge.pid);}catch(e){try{edge.kill();}catch(e2){}}
  server.close(); await fsp.rm(profile,{recursive:true,force:true}).catch(()=>{});
}
main().catch(e=>{console.error('FATAL',e);process.exit(1);});

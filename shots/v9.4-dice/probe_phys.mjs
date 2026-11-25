/* 证据探针：手模型 draw/tris、物理弹跳时刻/落定角、toss 总时长、最终骰面 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import fsp from 'node:fs/promises';
import os from 'node:os';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIST = path.resolve(ROOT, 'dist/v94');
const OUT = path.resolve(ROOT, 'shots/v9.4-dice');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8934, CDP_PORT = 9354;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.wav': 'audio/wav', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP { constructor(ws){this.ws=ws;this.id=0;this.p=new Map();this.l=new Map();ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&this.p.has(m.id)){const{r,j}=this.p.get(m.id);this.p.delete(m.id);m.error?j(new Error(m.error.message)):r(m.result);return;}if(m.method)for(const f of this.l.get(m.method)||[])f(m.params||{});});}
 send(method,params={}){const id=++this.id;return new Promise((r,j)=>{this.p.set(id,{r,j});this.ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);j(new Error('timeout '+method));}},60000);});}
 on(m,f){const a=this.l.get(m)||[];a.push(f);this.l.set(m,a);} }
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',()=>j(new Error('ws')),{once:true});});return new CDP(ws);}
async function main(){
  const server=http.createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const f=path.join(DIST,p);fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);res.end('404');return;}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(b);});});
  await new Promise((r)=>server.listen(PORT,'127.0.0.1',r));
  const profile=await fsp.mkdtemp(path.join(os.tmpdir(),'edge-v93phys-'));
  const edge=spawn(EDGE,['--headless=new','--remote-debugging-port='+CDP_PORT,'--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-extensions','--use-angle=swiftshader','--enable-unsafe-swiftshader','--window-size=390,844','about:blank'],{stdio:'ignore',detached:true});edge.unref();
  let ver=null;for(let i=0;i<150;i++){await sleep(150);try{const r=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/version');ver=await r.json();if(ver.webSocketDebuggerUrl)break;}catch(e){}}
  const browser=await connect(ver.webSocketDebuggerUrl);
  const tg=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
  const cdp=await connect(tg.webSocketDebuggerUrl);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  const logs=[];cdp.on('Runtime.consoleAPICalled',(p)=>{logs.push([p.type,(p.args||[]).map(a=>a.value||a.description||'').join(' ').slice(0,300)]);});
  cdp.on('Runtime.exceptionThrown',(p)=>logs.push(['pageerror',JSON.stringify(p.exceptionDetails).slice(0,300)]));
  const ev=async(expr)=>{const r=await cdp.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)throw new Error((r.exceptionDetails.exception||{}).description||r.exceptionDetails.text);return r.result&&r.result.value;};
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await cdp.send('Page.navigate',{url:`http://127.0.0.1:${PORT}/`});
  for(let i=0;i<200;i++){await sleep(120);if(await ev("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))"))break;}
  await ev(`App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:false,board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}})`);
  await sleep(200);
  await ev(`(() => { const m=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(m.state); App.Router.reset('table'); return true; })()`);
  await sleep(1000);
  await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
  for(let i=0;i<400;i++){await sleep(150);const ok=await ev("!!(document.querySelector('.v6-table') && document.querySelector('.v6-table').getAttribute('data-board3d') && document.querySelector('.v6-table').getAttribute('data-board3d') !== 'pending' && window.App.Board3D && window.App.Board3D._current())");if(ok)break;}
  await sleep(2000);
  const hand = await ev(`(() => {
    const sc = App.Board3D._current().scene;
    let draws = 0, tris = 0, visible = sc._hand.group.visible;
    sc._hand.group.traverse((o) => { if (!o.isMesh || !o.geometry) return; draws++; const g = o.geometry; tris += (g.index ? g.index.count : g.attributes.position.count) / 3; });
    return { draws, tris, visible, meshes: sc._hand.group.children.length, grip: sc._hand.gripLocal.toArray() };
  })()`);
  const res = await ev(`(async () => {
    const sc = App.Board3D._current().scene;
    App.Board3D.play([{ type: 'dice', die: 4 }]);
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    for (let i = 0; i < 400; i++) {
      const d = sc.dieDebug();
      if (d.t !== null && d.t >= 900) break;
      await wait(15);
    }
    const T = sc._toss;
    const out = {
      total: T ? T.total : null, releaseAt: T ? T.releaseAt : null,
      settleStartAbs: T ? +T.settleStartAbs.toFixed(0) : null, settleEndAbs: T ? +T.settleEndAbs.toFixed(0) : null,
      impacts: T ? T.phys.impacts.map((x) => ({ t: x.t, at: +(x.t * 1000 + T.releaseAt).toFixed(0), speed: x.speed })) : null,
      restAt: T ? +T.phys.restAt.toFixed(3) : null, settleAngle: T ? T.phys.settleAngle : null,
      settleYaw: sc._dieYaw, die: sc.dieDebug(), dieValue: sc.dieValue
    };
    /* 冻结在落定前，避免继续跑 */
    sc._paused = true; if (sc._raf) { cancelAnimationFrame(sc._raf); sc._raf = 0; }
    out.dieAtFreeze = sc.dieDebug();
    sc._toss = null;  /* 丢弃进行中的动画（探针用；随后手动 placeDie） */
    sc._hand.group.visible = false;
    sc.placeDie(4);
    sc._paused = false; sc._last = 0; sc._startLoop();
    return out;
  })()`);
  await sleep(400);
  const after = await ev(`(async () => { await new Promise((r) => setTimeout(r, 300)); const sc = App.Board3D._current().scene; return { die: sc.dieDebug(), busy: App.Board3D._debug().busy }; })()`);
  const out = { hand, phys: res, after };
  fs.writeFileSync(path.join(OUT, 'phys-probe.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify(out, null, 1));
  console.log('logs', JSON.stringify(logs.slice(0, 10)));
  await browser.send('Browser.close').catch(()=>{});
  await sleep(200); try{process.kill(-edge.pid);}catch(e){try{edge.kill();}catch(e2){}}
  server.close(); await fsp.rm(profile,{recursive:true,force:true}).catch(()=>{});
}
main().catch(e=>{console.error('FATAL',e);process.exit(1);});

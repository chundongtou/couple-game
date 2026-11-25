/* 检查骰子图集是否生成、UV 是否生效 */
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
const ROOT = path.resolve(import.meta.dirname, '..', '..');
const DIST = path.resolve(ROOT, 'dist/v97');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 8939, CDP_PORT = 9359;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.json': 'application/json', '.wav': 'audio/wav', '.png': 'image/png' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class CDP { constructor(ws){this.ws=ws;this.id=0;this.p=new Map();this.l=new Map();ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data);if(m.id&&this.p.has(m.id)){const{r,j}=this.p.get(m.id);this.p.delete(m.id);m.error?j(new Error(m.error.message)):r(m.result);return;}if(m.method)for(const f of this.l.get(m.method)||[])f(m.params||{});});}
 send(method,params={}){const id=++this.id;return new Promise((r,j)=>{this.p.set(id,{r,j});this.ws.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(this.p.has(id)){this.p.delete(id);j(new Error('timeout '+method));}},60000);});}
 on(m,f){const a=this.l.get(m)||[];a.push(f);this.l.set(m,a);} }
async function connect(url){const ws=new WebSocket(url);await new Promise((r,j)=>{ws.addEventListener('open',r,{once:true});ws.addEventListener('error',()=>j(new Error('ws')),{once:true});});return new CDP(ws);}
async function main(){
  const server=http.createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const f=path.join(DIST,p);fs.readFile(f,(e,b)=>{if(e){res.writeHead(404);res.end('404');return;}res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});res.end(b);});});
  await new Promise((r)=>server.listen(PORT,'127.0.0.1',r));
  const profile=await fsp.mkdtemp(path.join(os.tmpdir(),'edge-v97die-'));
  const edge=spawn(EDGE,['--headless=new','--remote-debugging-port='+CDP_PORT,'--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-extensions','--use-angle=swiftshader','--enable-unsafe-swiftshader','--window-size=390,844','about:blank'],{stdio:'ignore',detached:true});edge.unref();
  let ver=null;for(let i=0;i<150;i++){await sleep(150);try{const r=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/version');ver=await r.json();if(ver.webSocketDebuggerUrl)break;}catch(e){}}
  const browser=await connect(ver.webSocketDebuggerUrl);
  const tg=await fetch('http://127.0.0.1:'+CDP_PORT+'/json/new?about:blank',{method:'PUT'}).then(r=>r.json());
  const cdp=await connect(tg.webSocketDebuggerUrl);
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');
  const ev=async(expr)=>{const r=await cdp.send('Runtime.evaluate',{expression:expr,returnByValue:true,awaitPromise:true,userGesture:true});if(r.exceptionDetails)return {err:JSON.stringify(r.exceptionDetails).slice(0,500)};return r.result&&r.result.value;};
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
  await cdp.send('Page.navigate',{url:`http://127.0.0.1:${PORT}/`});
  for(let i=0;i<200;i++){await sleep(120);if(await ev("!!(window.App && App.Store && App.Flight && document.querySelector('[data-test=boot]'))"))break;}
  await ev(`App.Store.saveSettings({rulesSeen:true,sound:false,haptics:false,reduced:false,board3d:'auto',theme:'cloud',names:{a:'阿岚',b:'阿策'}})`);
  await sleep(200);
  await ev(`(() => { const m=App.Flight.newGame({names:{a:'阿岚',b:'阿策'},colors:{a:'red',b:'yellow'},scale:'warm',boundaries:[],planeCount:2,mode:'quick'}); App.Store.saveSession(m.state); App.Router.reset('table'); return true; })()`);
  await sleep(1000);
  await ev(`(() => { const x=document.querySelector('.sheet-x'); if (x) x.click(); return true; })()`);
  for(let i=0;i<400;i++){await sleep(150);const ok=await ev("!!(document.querySelector('.v6-table[data-board3d]') && window.App.Board3D && window.App.Board3D._current())");if(ok)break;}
  await sleep(2000);
  const out = await ev(`(() => {
    const sc = App.Board3D._current().scene;
    const m = sc.dieMat;
    const g = sc.die.geometry;
    const uv = g.getAttribute('uv'); const idx = g.index;
    const faces = [];
    for (let f = 0; f < 6; f++) { const gp = g.groups[f]; let u0=9,u1=-9,v0=9,v1=-9;
      for (let k=gp.start;k<gp.start+gp.count;k++){const vi=idx.getX(k);const u=uv.getX(vi),v=uv.getY(vi);u0=Math.min(u0,u);u1=Math.max(u1,u);v0=Math.min(v0,v);v1=Math.max(v1,v);}
      faces.push([+u0.toFixed(3), +u1.toFixed(3), +v0.toFixed(3), +v1.toFixed(3)]); }
    const img = m.map && m.map.image;
    let dataUrl = null, sampled = null;
    if (img) {
      dataUrl = img.toDataURL ? img.toDataURL('image/png') : null;
      const cv = document.createElement('canvas'); cv.width = img.width; cv.height = img.height;
      const cx = cv.getContext('2d'); cx.drawImage(img, 0, 0);
      const px = cx.getImageData(0, 0, img.width, img.height).data;
      const at = (x, y) => { const i = (Math.round(y) * img.width + Math.round(x)) * 4; return [px[i], px[i+1], px[i+2]]; };
      sampled = { w: img.width, h: img.height, cell0: at(64, 64), cell1: at(192, 64), cell2: at(320, 64), cell4: at(64, 190) };
    }
    return { hasMap: !!(m && m.map), mapSize: img ? [img.width, img.height] : null, faces, sampled,
      matColor: m.color.getHexString(), vertexColors: m.vertexColors, uvCount: uv.count };
  })()`);
  console.log(JSON.stringify(out, null, 1).slice(0, 3000));
  const atlasUrl = await ev(`(() => { try { return App.Board3D._current().scene.dieMat.map.image.toDataURL('image/png'); } catch (e) { return 'ERR:' + e.message; } })()`);
  console.log('atlasUrl', typeof atlasUrl, atlasUrl && atlasUrl.length, String(atlasUrl).slice(0, 40));
  if (typeof atlasUrl === 'string' && atlasUrl.indexOf('data:image') === 0) {
    fs.writeFileSync(path.join(ROOT, 'shots/v9.7-dice', 'die-atlas.png'), Buffer.from(atlasUrl.split(',')[1], 'base64'));
    console.log('atlas saved');
  }
  await ev(`(() => { const sc=App.Board3D._current().scene; sc._paused=true; if(sc._raf){cancelAnimationFrame(sc._raf);sc._raf=0;}
    sc.rig.lockState=null; sc.rig.snap({center: sc.die.position.clone(), nx:0, ny:0, radius:1.15, elev:28, azim:12, fov:42}); sc.renderNow(); return true; })()`);
  const closeShot = await cdp.send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ROOT, 'shots/v9.7-dice', 'die-close.png'), Buffer.from(closeShot.data, 'base64'));
  console.log('close saved');
  await browser.send('Browser.close').catch(()=>{});
  await sleep(200); try{process.kill(-edge.pid);}catch(e){try{edge.kill();}catch(e2){}}
  server.close(); await fsp.rm(profile,{recursive:true,force:true}).catch(()=>{});
}
main().catch(e=>{console.error('FATAL',e);process.exit(1);});

/* ==========================================================================
 * 今晚飞行棋 V6.2 · view/cabin.js  「夜航机舱」场景 + 全动态相机
 * 唯一门面：App.CabinScene（impl-freeze-cabin §4.1）
 *
 * 依赖：无（不读 App.Flight.* / localStorage / 外部图片字体库）。
 * 集成：调用方在 .v6-table 内放一个全屏 .v6-cabin（position:absolute;inset:0;
 *       z-index:0;pointer-events:none），然后
 *         App.CabinScene.mount(cabinHost, { boardEl, reduced, sound, names })
 *       boardEl 传 .v6-board；相机只改 boardEl.style.transform，不动布局。
 *
 * API（冻结单 §4.1，返回值/入参见 HANDOFF）：
 *   mount(host, opts) -> instance|null
 *   unmount()
 *   setMood({ heat, stage, turn, winner, phase, overlay })
 *   play(events, opts) -> Promise（永不 reject；reduced 时立即 resolve）
 *   setReduced(flag) / setSound(flag)
 *   setCameraEnabled(flag)   // V7：false 时只做场景视差/灯光，不写 boardEl.transform（Cinema 接管）
 *   附加（非契约，仅自测）：_debug()
 *
 * QA / 自测钩子：
 *   [data-test="cabin-scene"]（.cabin-root，aria-hidden）
 *   [data-cabin-version="6.2.0"][data-cabin-reduced="0|1"][data-cabin-cam="rest|dice|move|..."]
 *   [data-cabin-mood="night|dawn"][data-cabin-dawn="0.00"][data-cabin-paused="0|1"]
 *   .cb-window / .cb-tray / .cb-flash / .cb-ripple / .cb-spot
 *
 * 性能：DPR≤2（窗），尘 DPR≤1.5；空闲 30fps；页面隐藏暂停；reduced 静态绘制；
 *       相机 rAF 只在动画期间跑，结束即释放；粒子数量随宽度 / reduced 调整。
 * ========================================================================== */
(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;
  var VERSION = '6.2.0';
  var TAU = Math.PI * 2;
  var RAF = global.requestAnimationFrame
    ? function (cb) { return global.requestAnimationFrame(cb); }
    : function (cb) { return global.setTimeout(function () { cb(nowMs()); }, 16); };
  var CAF = global.cancelAnimationFrame
    ? function (id) { global.cancelAnimationFrame(id); }
    : function (id) { global.clearTimeout(id); };
  var ZERO = { x: 0, y: 0, s: 1, r: 0, rx: 0 };

  /* ============================ 1. 小工具 ============================ */
  function nowMs() {
    return (global.performance && global.performance.now) ? global.performance.now() : Date.now();
  }
  function clamp(n, lo, hi) { n = Number(n); if (isNaN(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function r2(n) { return Math.round(n * 100) / 100; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function cloneVec(v) { return { x: v.x, y: v.y, s: v.s, r: v.r, rx: v.rx }; }
  function lerpVec(a, b, t) {
    return {
      x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t),
      s: lerp(a.s, b.s, t), r: lerp(a.r, b.r, t), rx: lerp(a.rx, b.rx, t)
    };
  }
  function hexRgb(hex) {
    hex = String(hex || '').replace('#', '');
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    var n = parseInt(hex, 16);
    if (isNaN(n)) return [255, 255, 255];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mixRgb(a, b, t) {
    var A = hexRgb(a), B = hexRgb(b);
    return [
      Math.round(lerp(A[0], B[0], t)),
      Math.round(lerp(A[1], B[1], t)),
      Math.round(lerp(A[2], B[2], t))
    ];
  }
  function rgba(rgb, a) { return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + a + ')'; }
  function stageOf(heat) {
    if (heat >= 80) return 'blazing';
    if (heat >= 60) return 'burning';
    if (heat >= 40) return 'charged';
    if (heat >= 20) return 'warm';
    return 'cold';
  }
  function makeRng(seed) {
    var s = seed || 1;
    return function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  }
  function el(tag, cls) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function setStyle(node, o) {
    if (!node || !o) return;
    Object.keys(o).forEach(function (k) { node.style[k] = typeof o[k] === 'number' ? o[k] + 'px' : o[k]; });
  }

  /* ============================ 2. CSS ============================ */
  var CSS = [
    /* ---- 根 ---- */
    '.cabin-root{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;contain:layout paint;',
    '--cb-amber:#F3C077;--cb-amber-deep:#E2965E;--cb-rose:#E9887A;--cb-ivory:#F6E7CE;',
    '--cb-cam-x:0px;--cb-cam-y:0px;--cb-cam-s:1;--cb-cam-r:0deg;--cb-warm:0;--cb-dawn:0;',
    'font-family:var(--font-body,"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif)}',
    '.cabin-root,.cabin-root *{pointer-events:none!important;box-sizing:border-box}',
    '.cabin-root canvas{display:block;width:100%;height:100%}',
    /* ---- 舱壁 ---- */
    '.cb-wall{position:absolute;inset:0;background:',
    'radial-gradient(130% 74% at 50% -16%,rgba(120,88,158,.24) 0%,rgba(60,36,84,.12) 38%,rgba(20,12,30,0) 66%),',
    'radial-gradient(92% 52% at 50% 110%,rgba(233,136,122,.12) 0%,rgba(20,12,30,0) 62%),',
    'linear-gradient(180deg,#090713 0%,#110C1D 24%,#1A1123 48%,#231424 74%,#2B1824 100%)}',
    '.cb-seams{position:absolute;inset:0;opacity:.95;background-image:repeating-linear-gradient(90deg,',
    'rgba(255,226,196,.075) 0 1px,rgba(0,0,0,0) 1px 82px);',
    '-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.95) 0%,rgba(0,0,0,.5) 46%,rgba(0,0,0,0) 88%);',
    'mask-image:linear-gradient(180deg,rgba(0,0,0,.95) 0%,rgba(0,0,0,.5) 46%,rgba(0,0,0,0) 88%)}',
    '.cb-curve{position:absolute;inset:0;background:',
    'radial-gradient(120% 92% at 50% 36%,rgba(0,0,0,0) 36%,rgba(3,2,10,.30) 76%,rgba(3,2,10,.72) 100%),',
    'linear-gradient(90deg,rgba(3,2,10,.62) 0%,rgba(3,2,10,0) 17%,rgba(3,2,10,0) 83%,rgba(3,2,10,.62) 100%)}',
    /* ---- 顶部行李舱 ---- */
    '.cb-bins{position:absolute;left:-6%;right:-6%;top:-34px;height:132px;',
    'border-radius:0 0 50% 50% / 0 0 62px 62px;',
    'background:linear-gradient(180deg,#241A33 0%,#1A1226 44%,#241731 80%,#2E1D33 100%);',
    'box-shadow:0 18px 30px rgba(3,2,10,.55),inset 0 -2px 0 rgba(255,226,196,.12),',
    'inset 0 16px 26px rgba(255,214,170,.05),inset 0 -20px 30px rgba(0,0,0,.36)}',
    '.cb-bins::after{content:"";position:absolute;left:7%;right:7%;bottom:30px;height:1px;',
    'background:linear-gradient(90deg,rgba(255,226,196,0),rgba(255,226,196,.30),rgba(255,214,170,.14) 50%,rgba(255,226,196,.30),rgba(255,226,196,0))}',
    '.cb-bin-latch{position:absolute;bottom:12px;width:46px;height:11px;border-radius:6px;',
    'background:linear-gradient(180deg,#3C2B47,#241831);opacity:.7;',
    'box-shadow:inset 0 1px 0 rgba(255,226,196,.18),0 1px 3px rgba(0,0,0,.5)}',
    '.cb-bin-latch.l{left:25%}.cb-bin-latch.r{right:25%}',
    '.cb-bin-light{position:absolute;bottom:5px;width:4px;height:4px;border-radius:50%;background:#FFD9A6;',
    'box-shadow:0 0 8px 3px rgba(255,206,150,.55),0 0 18px 6px rgba(255,206,150,.20);opacity:.85}',
    '.cb-bin-light.l{left:36%}.cb-bin-light.c{left:50%}.cb-bin-light.r{left:64%}',
    /* ---- 阅读灯光晕 ---- */
    '.cb-lampglow{position:absolute;width:300px;height:210px;border-radius:50%;filter:blur(24px);',
    'opacity:.55;mix-blend-mode:screen;background:radial-gradient(closest-side,',
    'rgba(255,206,150,.55),rgba(243,192,119,.18) 46%,rgba(243,192,119,0) 74%);',
    'animation:cb-breathe 4.5s ease-in-out infinite}',
    '.cb-lampglow.l{left:-52px;top:-30px}',
    '.cb-lampglow.r{right:-52px;top:-30px;animation-delay:-2.25s}',
    '@keyframes cb-breathe{0%,100%{opacity:.42}50%{opacity:.7}}',
    '.cabin-root.is-flicker .cb-lampglow{animation:cb-flicker .28s ease-out}',
    '@keyframes cb-flicker{0%{opacity:.9;filter:brightness(1.3)}100%{opacity:.5;filter:brightness(1)}}',
    /* ---- 舷窗 ---- */
    '.cb-window{position:absolute;border-radius:46px;padding:8px;',
    'background:linear-gradient(150deg,#4B3757 0%,#2B1F3A 44%,#16101F 100%);',
    'box-shadow:0 16px 32px rgba(3,2,10,.65),0 0 0 1px rgba(255,238,216,.16),',
    'inset 0 1px 0 rgba(255,244,226,.30),inset 0 -4px 10px rgba(0,0,0,.6),',
    '0 0 62px rgba(120,150,230,.22),0 0 20px rgba(160,190,255,.13);',
    'transform:translate3d(calc(var(--cb-cam-x) * -0.42),calc(var(--cb-cam-y) * -0.3),0) rotate(var(--cb-win-rot,0deg))}',
    '.cb-win-inner{position:absolute;inset:8px;border-radius:38px;overflow:hidden;background:#05070F;',
    'box-shadow:inset 0 0 24px rgba(0,0,0,.9),inset 0 0 0 3px rgba(6,5,12,.92),inset 0 14px 26px rgba(0,0,0,.55)}',
    '.cb-win-inner canvas{position:absolute;inset:0;width:100%;height:100%}',
    '.cb-win-shade{position:absolute;left:9%;right:9%;top:8px;height:12px;border-radius:0 0 7px 7px;',
    'background:linear-gradient(180deg,#4A3849,#241A2C);opacity:.92;',
    'box-shadow:0 2px 6px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,230,205,.18)}',
    '.cb-win-shade::after{content:"";position:absolute;left:50%;bottom:-3px;width:12px;height:4px;',
    'margin-left:-6px;border-radius:2px;background:#3A2A3C;box-shadow:0 1px 2px rgba(0,0,0,.5)}',
    '.cb-win-glass{position:absolute;inset:8px;border-radius:38px;',
    'background:linear-gradient(118deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,0) 24%,',
    'rgba(255,255,255,0) 62%,rgba(255,236,214,.05) 78%,rgba(255,255,255,0) 92%);',
    'box-shadow:inset 0 0 0 1px rgba(255,246,235,.10)}',
    '.cb-win-spill{position:absolute;left:-20%;right:-20%;top:68%;height:130px;border-radius:50%;',
    'filter:blur(18px);opacity:.62;mix-blend-mode:screen;background:radial-gradient(closest-side,',
    'rgba(243,192,119,.24),rgba(243,192,119,0))}',
    /* ---- 热度 / 晨光 ---- */
    '.cb-warm{position:absolute;inset:0;opacity:calc(var(--cb-warm) * .9);mix-blend-mode:screen;',
    'background:radial-gradient(120% 78% at 50% 24%,rgba(243,192,119,.34) 0%,rgba(233,136,122,.15) 44%,rgba(233,136,122,0) 74%)}',
    '.cb-dawn{position:absolute;inset:0;opacity:calc(var(--cb-dawn) * .92);mix-blend-mode:screen;',
    'background:radial-gradient(140% 92% at 50% 104%,rgba(255,196,132,.52) 0%,rgba(233,136,122,.20) 42%,rgba(233,136,122,0) 76%)}',
    /* ---- 座椅 / 侧灯 ---- */
    '.cb-seat{position:absolute;bottom:-34px;width:42%;height:152px;opacity:.96;',
    'border-radius:40% 40% 0 0 / 70% 70% 0 0;',
    'background:linear-gradient(180deg,rgba(34,23,48,.96),rgba(10,7,18,.99));',
    'box-shadow:inset 0 2px 0 rgba(255,226,196,.16),inset 0 12px 26px rgba(255,214,170,.04),',
    '0 -18px 40px rgba(3,2,10,.6)}',
    '.cb-seat.l{left:-15%}.cb-seat.r{right:-15%}',
    '.cb-lap{position:absolute;left:-8%;right:-8%;bottom:-64px;height:170px;opacity:.98;',
    'border-radius:50% 50% 0 0 / 64% 64% 0 0;',
    'background:linear-gradient(180deg,rgba(23,16,34,.96),rgba(6,4,11,.99));',
    'box-shadow:inset 0 2px 0 rgba(255,226,196,.10),inset 0 14px 30px rgba(255,214,170,.03),',
    '0 -16px 40px rgba(3,2,10,.55)}',
    '.cb-turnlamp{position:absolute;width:200px;height:150px;border-radius:50%;filter:blur(20px);',
    'opacity:0;mix-blend-mode:screen;transition:opacity .7s ease-out;background:radial-gradient(closest-side,',
    'rgba(255,206,150,.52),rgba(243,192,119,.16) 52%,rgba(243,192,119,0))}',
    '.cabin-root[data-turn="a"] .cb-turnlamp.l{opacity:.8}',
    '.cabin-root[data-turn="b"] .cb-turnlamp.r{opacity:.8}',
    /* ---- 小桌板 ---- */
    '.cb-tray{position:absolute;border-radius:26px;',
    'background:linear-gradient(178deg,#F5E9D6 0%,#EAD6B7 26%,#DDC29D 58%,#CBAA7E 86%,#B98F60 100%);',
    'box-shadow:inset 0 1px 0 rgba(255,250,240,.8),inset 0 -2px 0 rgba(120,84,44,.35),',
    '0 -14px 30px rgba(3,2,10,.42),0 26px 50px rgba(3,2,10,.6),0 6px 18px rgba(3,2,10,.4);',
    'transform:translate3d(calc(var(--cb-cam-x) * .22),calc(var(--cb-cam-y) * .22),0)}',
    '.cb-tray-latch{position:absolute;left:50%;bottom:5px;width:56px;height:8px;margin-left:-28px;',
    'border-radius:5px;background:linear-gradient(180deg,#A9814F,#7C5A32);opacity:.72;',
    'box-shadow:inset 0 1px 0 rgba(255,248,235,.38),0 1px 2px rgba(3,2,10,.45)}',
    '.cb-trayglow{position:absolute;left:6%;right:6%;bottom:0;height:30px;border-radius:50%;filter:blur(7px);',
    'background:radial-gradient(closest-side,rgba(255,226,180,.38),rgba(243,192,119,.10) 55%,rgba(243,192,119,0));',
    'mix-blend-mode:screen}',
    '.cb-tray::before{content:"";position:absolute;inset:0;border-radius:26px;opacity:.5;',
    'background:repeating-linear-gradient(96deg,rgba(120,80,40,.08) 0 1px,rgba(120,80,40,0) 1px 7px),',
    'repeating-linear-gradient(4deg,rgba(255,248,235,.10) 0 1px,rgba(255,248,235,0) 1px 27px)}',
    '.cb-tray::after{content:"";position:absolute;left:2px;right:2px;bottom:-11px;height:13px;',
    'border-radius:0 0 26px 26px;background:linear-gradient(180deg,#B98F60,#8A6338 55%,#5F4123);',
    'box-shadow:0 4px 10px rgba(3,2,10,.5),inset 0 1px 0 rgba(255,238,216,.3)}',
    '.cb-mat{position:absolute;border-radius:24px;background:',
    'radial-gradient(120% 96% at 50% 24%,#231736 0%,#150F26 54%,#0B0817 100%);',
    'box-shadow:inset 0 0 0 1px rgba(243,192,119,.16),inset 0 8px 22px rgba(0,0,0,.55),',
    'inset 0 -16px 30px rgba(0,0,0,.5),0 10px 22px rgba(3,2,10,.5)}',
    '.cb-mat::before{content:"";position:absolute;inset:7px;border-radius:18px;',
    'border:1px solid rgba(243,192,119,.10)}',
    /* ---- 灯光 / 特效 ---- */
    '.cb-lampcone{position:absolute;left:50%;transform:translateX(-50%);filter:blur(30px);',
    'mix-blend-mode:screen;opacity:.55;clip-path:polygon(32% 0%,68% 0%,96% 100%,4% 100%);',
    'background:linear-gradient(180deg,rgba(255,214,160,.26) 0%,rgba(255,206,150,.11) 40%,',
    'rgba(255,206,150,.03) 70%,rgba(255,206,150,0) 100%)}',
    '.cb-spot{position:absolute;width:224px;height:64px;margin:-32px 0 0 -112px;border-radius:50%;',
    'filter:blur(7px);opacity:0;mix-blend-mode:screen;transition:opacity .4s ease-out;',
    'background:radial-gradient(closest-side,rgba(255,226,180,.4),rgba(243,192,119,.17) 55%,rgba(243,192,119,0))}',
    '.cb-spot.is-on{opacity:1}',
    '.cb-heart{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;opacity:0;',
    'fill:rgba(233,136,122,.6);filter:drop-shadow(0 0 10px rgba(233,136,122,.65))}',
    '.cb-heart.is-on{animation:cb-heart 900ms ease-out forwards}',
    '@keyframes cb-heart{0%{opacity:0;transform:scale(.6)}18%{opacity:.95;transform:scale(1)}55%{opacity:.55;transform:scale(1.18)}100%{opacity:0;transform:scale(1.4)}}',
    '.cb-ripple{position:absolute;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;',
    'border:2px solid rgba(243,192,119,.85);opacity:0;transform:scale(.4);',
    'box-shadow:0 0 18px rgba(243,192,119,.55),inset 0 0 12px rgba(243,192,119,.35)}',
    '.cb-ripple.is-tray{width:88px;height:34px;margin:-17px 0 0 -44px}',
    '.cb-ripple.is-on{animation:cb-ripple .76s ease-out forwards}',
    '.cb-ripple.is-red{border-color:rgba(233,136,122,.92);',
    'box-shadow:0 0 24px rgba(233,136,122,.62),inset 0 0 14px rgba(233,136,122,.42)}',
    '@keyframes cb-ripple{0%{opacity:.9;transform:scale(.35)}100%{opacity:0;transform:scale(2.6)}}',
    '.cb-flash{position:absolute;inset:0;opacity:0;mix-blend-mode:screen;',
    'background:radial-gradient(120% 90% at 50% 42%,rgba(255,246,232,.92),',
    'rgba(255,236,214,.36) 55%,rgba(255,236,214,0) 86%)}',
    '.cb-dust{position:absolute;inset:0;width:100%;height:100%}',
    /* V7 性能：Cinema 镜头期间停画布 + 关掉最重的混合层，省 GPU/合成 */
    '.cabin-root[data-cabin-cinematic="1"] .cb-dust,',
    '.cabin-root[data-cabin-cinematic="1"] .cb-grain,',
    '.cabin-root[data-cabin-cinematic="1"] .cb-reflect{display:none}',
    '.cabin-root[data-cabin-cinematic="1"] *{animation-play-state:paused!important}',
    '.cb-vignette{position:absolute;inset:0;background:radial-gradient(120% 86% at 50% 42%,',
    'rgba(3,2,10,0) 48%,rgba(3,2,10,.35) 76%,rgba(3,2,10,.72) 100%)}',
    '.cb-reflect{position:absolute;inset:0;mix-blend-mode:screen;opacity:.7;background:',
    'linear-gradient(116deg,rgba(255,255,255,0) 18%,rgba(255,255,255,.05) 24%,rgba(255,255,255,0) 30%,',
    'rgba(255,236,214,0) 58%,rgba(255,236,214,.035) 64%,rgba(255,236,214,0) 70%)}',
    '.cb-grain{position:absolute;inset:0;opacity:.10;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'96\' height=\'96\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\'/%3E%3C/filter%3E%3Crect width=\'96\' height=\'96\' filter=\'url(%23n)\' opacity=\'.55\'/%3E%3C/svg%3E")}',
    '.cb-toplight{position:absolute;left:0;right:0;top:0;height:86px;opacity:0;mix-blend-mode:screen;',
    'transition:opacity 2.4s ease-out;background:linear-gradient(180deg,rgba(255,214,160,.55),',
    'rgba(255,206,150,.14) 42%,rgba(255,206,150,0))}',
    '.cabin-root.is-won .cb-toplight{opacity:1}',
    '.cb-dim{position:absolute;inset:0;opacity:0;transition:opacity .5s ease-out;background:',
    'radial-gradient(120% 82% at 50% 46%,rgba(4,2,10,.22),rgba(4,2,10,.64) 100%)}',
    '.cabin-root.is-overlay .cb-dim{opacity:1}',
    '.cabin-root.is-safe .cb-dim{opacity:.85}',
    '.cabin-root.is-ended .cb-dim{opacity:.45}',
    /* ---- reduced ---- */
    '.cabin-root.is-reduced .cb-lampglow,.cabin-root.is-reduced .cb-window{animation:none!important}',
    '.cabin-root.is-reduced .cb-tray{transform:none!important}',
    '.cabin-root.is-reduced .cb-lampcone,.cabin-root.is-reduced .cb-turnlamp,.cabin-root.is-reduced .cb-spot{transition-duration:120ms!important}',
    '.cabin-root.is-reduced .cb-dawn,.cabin-root.is-reduced .cb-warm{transition:none!important}',
    '@media (prefers-reduced-motion: reduce){',
    '.cabin-root .cb-lampglow{animation:none!important}',
    '.cabin-root .cb-window{transform:none!important}',
    '}'
  ].join('');

  function injectCss() {
    if (doc.getElementById && doc.getElementById('style-cabin-v6')) return;
    if (App.UI && typeof App.UI.injectStyle === 'function') {
      try { App.UI.injectStyle('cabin-v6', CSS); return; } catch (e) {}
    }
    var tag = doc.createElement('style');
    tag.id = 'style-cabin-v6';
    tag.textContent = CSS;
    (doc.head || doc.documentElement).appendChild(tag);
  }

  /* ============================ 3. 运行态 ============================ */
  var S = null;

  function createState(host, opts) {
    opts = opts || {};
    var reducedBySystem = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return {
      mounted: false, version: VERSION,
      host: host, root: null, boardEl: opts.boardEl || null,
      optReduced: !!opts.reduced, reduced: !!opts.reduced || reducedBySystem,
      sound: opts.sound !== false, names: opts.names || null,
      /* V7：Cinema 接管 boardEl 相机时置 false；场景视差/灯光仍由本模块驱动 */
      cameraEnabled: opts.cameraEnabled !== false,
      cinematic: false,
      vw: 0, vh: 0,
      board: { left: 0, top: 0, width: 0, height: 0 },
      el: {}, wins: { l: null, r: null },
      boardPrev: null, hostPrev: null,
      scene: {
        dawn: 0, dawnTarget: 0, dawnMs: 8000,
        warm: 0, warmTarget: 0, warmMs: 600,
        cloudPart: 0, boost: 0, streak: 0,
        t: 0, frames: 0, last: 0, raf: 0, hidden: false, paused: false,
        particles: [], nStars: 0
      },
      cam: {
        base: cloneVec(ZERO), off: cloneVec(ZERO),
        anim: null, baseAnim: null, shake: null, raf: 0, applied: false,
        lastX: 999, lastY: 999, lastS: 9
      },
      mood: { heat: 0, stage: 'cold', turn: 'a', winner: null, phase: '', overlay: false },
      playToken: 0, pendingPlay: null, timers: [], uiTimers: [],
      ro: null, onResize: null, onVis: null, onMq: null, mq: null,
      rafLayout: 0
    };
  }

  function rememberTimers(list, id) { if (S) S[list].push(id); }
  function clearTimers(list) {
    if (!S) return;
    var arr = S[list];
    for (var i = 0; i < arr.length; i++) { try { global.clearTimeout(arr[i]); } catch (e) {} }
    S[list] = [];
  }
  function later(fn, ms, list) {
    var id = global.setTimeout(fn, ms);
    rememberTimers(list || 'timers', id);
    return id;
  }

  /* ============================ 4. DOM ============================ */
  function buildDom() {
    var root = el('div', 'cabin-root');
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-test', 'cabin-scene');
    root.setAttribute('data-cabin-version', VERSION);
    root.setAttribute('data-cabin-reduced', S.reduced ? '1' : '0');
    root.setAttribute('data-cabin-mood', 'night');
    root.setAttribute('data-cabin-dawn', '0.00');
    root.setAttribute('data-cabin-cam', 'rest');
    root.setAttribute('data-cabin-paused', '0');
    root.setAttribute('data-turn', 'a');
    root.innerHTML =
      '<div class="cb-wall"></div>' +
      '<div class="cb-seams"></div>' +
      '<div class="cb-curve"></div>' +
      '<div class="cb-bins"><i class="cb-bin-latch l"></i><i class="cb-bin-latch r"></i>' +
        '<i class="cb-bin-light l"></i><i class="cb-bin-light c"></i><i class="cb-bin-light r"></i></div>' +
      '<div class="cb-lampglow l"></div><div class="cb-lampglow r"></div>' +
      '<div class="cb-window cb-win-l" data-cabin-part="window-l"><div class="cb-win-inner"><canvas></canvas></div>' +
        '<div class="cb-win-shade"></div><div class="cb-win-glass"></div></div>' +
      '<div class="cb-window cb-win-r" data-cabin-part="window-r"><div class="cb-win-inner"><canvas></canvas></div>' +
        '<div class="cb-win-shade"></div><div class="cb-win-glass"></div></div>' +
      '<div class="cb-win-spill cb-win-spill-l"></div><div class="cb-win-spill cb-win-spill-r"></div>' +
      '<div class="cb-warm"></div>' +
      '<div class="cb-dawn"></div>' +
      '<div class="cb-seat l"></div><div class="cb-seat r"></div>' +
      '<div class="cb-lap"></div>' +
      '<div class="cb-tray" data-cabin-part="tray"><div class="cb-mat"></div><i class="cb-trayglow"></i><i class="cb-tray-latch"></i></div>' +
      '<svg class="cb-heart" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.4-4.6-7.4-10A4.2 4.2 0 0 1 12 7.2 4.2 4.2 0 0 1 19.4 10c0 5.4-7.4 10-7.4 10z"/></svg>' +
      '<div class="cb-turnlamp l"></div><div class="cb-turnlamp r"></div>' +
      '<div class="cb-lampcone"></div>' +
      '<div class="cb-spot"></div>' +
      '<div class="cb-ripple"></div>' +
      '<div class="cb-flash"></div>' +
      '<canvas class="cb-dust" aria-hidden="true"></canvas>' +
      '<div class="cb-vignette"></div>' +
      '<div class="cb-grain"></div>' +
      '<div class="cb-reflect"></div>' +
      '<div class="cb-toplight"></div>' +
      '<div class="cb-dim"></div>';

    S.host.appendChild(root);
    S.root = root;

    var q = function (sel) { return root.querySelector(sel); };
    S.el = {
      wall: q('.cb-wall'), seams: q('.cb-seams'), bins: q('.cb-bins'),
      winL: q('.cb-win-l'), winR: q('.cb-win-r'),
      winCvL: q('.cb-win-l canvas'), winCvR: q('.cb-win-r canvas'),
      winInnerL: q('.cb-win-l .cb-win-inner'), winInnerR: q('.cb-win-r .cb-win-inner'),
      spillL: q('.cb-win-spill-l'), spillR: q('.cb-win-spill-r'),
      warm: q('.cb-warm'), dawn: q('.cb-dawn'),
      tray: q('.cb-tray'), mat: q('.cb-mat'),
      turnL: q('.cb-turnlamp.l'), turnR: q('.cb-turnlamp.r'),
      cone: q('.cb-lampcone'), spot: q('.cb-spot'), ripple: q('.cb-ripple'),
      heart: q('.cb-heart'),
      flash: q('.cb-flash'), dust: q('.cb-dust'),
      toplight: q('.cb-toplight'), dim: q('.cb-dim')
    };

    /* 窗口画布 + 尘埃粒子（每次 mount 重建；resize 只改尺寸） */
    S.wins.l = createWinScene(S.el.winCvL, S.el.winInnerL, 101);
    S.wins.r = createWinScene(S.el.winCvR, S.el.winInnerR, 877);
    S.scene.particles = createParticles();
  }

  function createWinScene(cv, inner, seed) {
    var rnd = makeRng(seed);
    var stars = [];
    var count = 22;
    for (var i = 0; i < count; i++) {
      stars.push({
        x: 0.06 + rnd() * 0.88, y: 0.05 + rnd() * 0.62,
        r: 0.4 + rnd() * 1.0, ph: rnd() * TAU, sp: 0.6 + rnd() * 1.6,
        a: 0.22 + rnd() * 0.58, big: rnd() > 0.82
      });
    }
    var clouds = [];
    for (var j = 0; j < 4; j++) {
      clouds.push({
        x: rnd(), y: 0.56 + rnd() * 0.36,
        rx: 0.22 + rnd() * 0.3, ry: 0.06 + rnd() * 0.08,
        sp: 6 + rnd() * 12, a: 0.16 + rnd() * 0.2, ph: rnd() * 10
      });
    }
    return { canvas: cv, inner: inner, stars: stars, clouds: clouds, ctx: null, w: 0, h: 0, dpr: 1 };
  }

  function createParticles() {
    var vw = (S && S.vw) || 390;
    var n = Math.round(clamp(vw / 14, 16, 32));
    if (S && S.reduced) n = Math.round(n / 2);
    var rnd = makeRng(4242);
    var out = [];
    for (var i = 0; i < n; i++) {
      out.push({
        x: rnd(), y: rnd(), r: 0.5 + rnd() * 1.7, a: 0.14 + rnd() * 0.46,
        vy: 0.012 + rnd() * 0.03, vx: (rnd() - 0.5) * 0.007,
        ph: rnd() * TAU, sp: 0.5 + rnd() * 1.4
      });
    }
    return out;
  }

  /* ============================ 5. 布局 ============================ */
  function measureBoardBox() {
    var fallback = function () {
      var vw = S.vw || 390, vh = S.vh || 844;
      var bw = Math.min(vw - 24, 430);
      var bh = bw * 750 / 720;
      if (bh > vh * 0.56) { bh = vh * 0.56; bw = bh * 720 / 750; }
      return {
        left: (vw - bw) / 2, top: Math.max(vh * 0.32, (vh - bh) * 0.44),
        width: bw, height: bh
      };
    };
    var b = S.boardEl;
    if (!b || !b.getBoundingClientRect) return fallback();
    try {
      var prev = b.style.transform;
      b.style.transform = 'none';
      var br = b.getBoundingClientRect();
      var hr = S.host.getBoundingClientRect();
      b.style.transform = prev;
      if (br.width > 40 && br.height > 40) {
        return {
          left: br.left - hr.left, top: br.top - hr.top,
          width: br.width, height: br.height
        };
      }
    } catch (e) {}
    return fallback();
  }

  function layout() {
    if (!S || !S.root) return;
    var vw = S.host.clientWidth || S.root.clientWidth || global.innerWidth || 390;
    var vh = S.host.clientHeight || S.root.clientHeight || global.innerHeight || 844;
    S.vw = vw; S.vh = vh;

    var board = measureBoardBox();
    S.board = board;

    /* 小桌板 = 棋盘布局盒向四周外扩；mat 精确对齐棋盘盒 */
    var tray = {
      left: board.left - 14, top: board.top - 14,
      width: board.width + 28, height: board.height + 36
    };
    if (tray.left < 0) { tray.width += tray.left; tray.left = 0; }
    if (tray.left + tray.width > vw) tray.width = vw - tray.left;
    setStyle(S.el.tray, { left: tray.left, top: tray.top, width: tray.width, height: tray.height });
    setStyle(S.el.mat, {
      left: board.left - tray.left, top: board.top - tray.top,
      width: board.width, height: board.height
    });

    /* 舷窗：放在棋盘上方的舱壁空档里，随屏幕自适应 */
    var wW = Math.round(clamp(vw * 0.265, 96, 118));
    var wH = Math.round(clamp(vh * 0.128, 84, 122));
    var wBottom = board.top - 20;
    var wTop = wBottom - wH;
    var minTop = Math.max(58, vh * 0.10);
    if (wTop < minTop) { wTop = minTop; wH = Math.max(66, wBottom - wTop); }
    if (wBottom - wTop < 64) { wTop = Math.max(10, vh * 0.12); wH = Math.max(64, Math.min(vh * 0.16, 120)); }
    var side = Math.round(Math.max(10, vw * 0.032));
    setStyle(S.el.winL, { left: side + 'px', top: wTop + 'px', width: wW + 'px', height: wH + 'px', '--cb-win-rot': '-1.1deg' });
    setStyle(S.el.winR, { left: (vw - side - wW) + 'px', top: (wTop + Math.round(wH * 0.07)) + 'px', width: wW + 'px', height: wH + 'px', '--cb-win-rot': '1.4deg' });
    setStyle(S.el.spillL, { left: (side - 26) + 'px', top: (wTop + wH + 2) + 'px', width: (wW + 52) + 'px' });
    setStyle(S.el.spillR, { left: (vw - side - wW - 26) + 'px', top: (wTop + Math.round(wH * 0.07) + wH + 2) + 'px', width: (wW + 52) + 'px' });
    /* 右窗遮光板拉下来一点（真实感；左窗留一条缝） */
    var shadeL = S.el.winL.querySelector('.cb-win-shade');
    var shadeR = S.el.winR.querySelector('.cb-win-shade');
    if (shadeL) shadeL.style.height = Math.round(Math.max(10, wH * 0.12)) + 'px';
    if (shadeR) shadeR.style.height = Math.round(Math.max(14, wH * 0.27)) + 'px';

    /* 阅读灯锥：从舱顶落到桌板 */
    setStyle(S.el.cone, {
      top: '0px', height: Math.round(board.top + Math.min(320, board.height * 0.55)) + 'px',
      width: Math.round(vw * 0.94) + 'px'
    });

    /* 左右阅读灯（换手时亮起的一侧） */
    var lampTop = Math.max(40, board.top - 74);
    setStyle(S.el.turnL, { left: (board.left - 66) + 'px', top: lampTop + 'px' });
    setStyle(S.el.turnR, { left: (board.left + board.width - 134) + 'px', top: lampTop + 'px' });

    /* 叠机的心形脉冲光：落在小桌板前沿（棋盘下方可见） */
    setStyle(S.el.heart, {
      left: (board.left + board.width / 2) + 'px',
      top: (board.top + board.height + 11) + 'px'
    });

    /* 换手侧灯光晕也落在桌板两侧（可见的窄边） */
    sizeCanvases();
    if (S.reduced) drawSceneOnce();
  }

  function sizeCanvases() {
    var dpr = clamp(global.devicePixelRatio || 1, 1, 2);
    [S.wins.l, S.wins.r].forEach(function (w) {
      if (!w || !w.canvas) return;
      var cw = Math.max(1, w.inner.clientWidth - 0);
      var ch = Math.max(1, w.inner.clientHeight - 0);
      w.w = cw; w.h = ch; w.dpr = dpr;
      w.canvas.width = Math.round(cw * dpr);
      w.canvas.height = Math.round(ch * dpr);
      w.ctx = w.canvas.getContext('2d');
      if (w.ctx) w.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    var dust = S.el.dust;
    if (dust) {
      var ddpr = clamp(global.devicePixelRatio || 1, 1, 1.5);
      S.scene.dustDpr = ddpr;
      dust.width = Math.round((S.vw || 390) * ddpr);
      dust.height = Math.round((S.vh || 844) * ddpr);
      S.scene.dustCtx = dust.getContext('2d');
      if (S.scene.dustCtx) S.scene.dustCtx.setTransform(ddpr, 0, 0, ddpr, 0, 0);
    }
  }

  /* ============================ 6. 场景绘制 ============================ */
  function stepScene(dt, ts) {
    var sc = S.scene;
    sc.t = ts;
    /* 暖度 / 晨光：线性趋近，reduced 时直接到位 */
    if (sc.warm !== sc.warmTarget) {
      var dW = sc.warmTarget - sc.warm;
      var stepW = dt / Math.max(120, sc.warmMs || 600);
      if (Math.abs(dW) <= stepW) sc.warm = sc.warmTarget;
      else sc.warm += dW > 0 ? stepW : -stepW;
    }
    if (sc.dawn !== sc.dawnTarget) {
      var dD = sc.dawnTarget - sc.dawn;
      var stepD = dt / Math.max(16, sc.dawnMs || 8000);
      if (Math.abs(dD) <= stepD) sc.dawn = sc.dawnTarget;
      else sc.dawn += dD > 0 ? stepD : -stepD;
    }
    if (sc.boost > 0) sc.boost = Math.max(0, sc.boost - dt / 420);
    if (sc.streak > 0) sc.streak = Math.max(0, sc.streak - dt / 760);
    if (sc.cloudPart > 0) sc.cloudPart = Math.max(0, sc.cloudPart - dt / 7000);

    S.root.style.setProperty('--cb-warm', r2(sc.warm));
    S.root.style.setProperty('--cb-dawn', r2(sc.dawn));
    S.root.setAttribute('data-cabin-dawn', sc.dawn.toFixed(2));
    var moodNow = sc.dawn > 0.5 ? 'dawn' : 'night';
    if (S.root.getAttribute('data-cabin-mood') !== moodNow) S.root.setAttribute('data-cabin-mood', moodNow);

    drawScene(ts);
    applyCamera(ts);
    sc.frames++;
  }

  function drawSceneOnce() {
    if (!S || !S.root) return;
    S.root.style.setProperty('--cb-warm', r2(S.scene.warm));
    S.root.style.setProperty('--cb-dawn', r2(S.scene.dawn));
    S.root.setAttribute('data-cabin-dawn', S.scene.dawn.toFixed(2));
    drawScene(S.scene.t || nowMs());
    applyCamera(S.scene.t || nowMs());
  }

  function drawScene(ts) {
    if (!S) return;
    var t = ts || nowMs();
    drawWindow(S.wins.l, t);
    drawWindow(S.wins.r, t);
    drawDust(t);
  }

  function drawWindow(w, t) {
    if (!w || !w.ctx) return;
    var ctx = w.ctx, W = w.w, H = w.h;
    if (!W || !H) return;
    var sc = S.scene, dawn = sc.dawn, warm = sc.warm;
    ctx.clearRect(0, 0, W, H);

    /* 夜空 / 晨光 */
    var top = mixRgb('#040812', '#232C56', dawn);
    var mid = mixRgb('#0A1730', '#8C5A72', dawn);
    var bot = mixRgb('#16294A', '#F2A473', dawn);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgba(top, 1));
    g.addColorStop(0.56, rgba(mid, 1));
    g.addColorStop(1, rgba(bot, 1));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* 地平线暖光 */
    if (dawn > 0.02) {
      var hg = ctx.createRadialGradient(W * 0.5, H * 1.04, 0, W * 0.5, H * 1.04, W * 0.95);
      hg.addColorStop(0, 'rgba(255,205,140,' + r2(0.72 * dawn) + ')');
      hg.addColorStop(0.45, 'rgba(255,170,120,' + r2(0.2 * dawn) + ')');
      hg.addColorStop(1, 'rgba(255,170,120,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, W, H);
    } else {
      /* 月晕 + 月牙 */
      var mg = ctx.createRadialGradient(W * 0.76, H * 0.16, 0, W * 0.76, H * 0.16, W * 0.4);
      mg.addColorStop(0, 'rgba(214,226,255,.10)');
      mg.addColorStop(1, 'rgba(214,226,255,0)');
      ctx.fillStyle = mg;
      ctx.fillRect(0, 0, W, H);
      var moonA = (1 - dawn / 0.35);
      if (moonA > 0.02) {
        ctx.globalAlpha = 0.09 * moonA;
        ctx.fillStyle = '#DCE6FF';
        ctx.beginPath();
        ctx.arc(W * 0.76, H * 0.16, 5, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 0.9 * moonA;
        ctx.fillStyle = '#EFF3FF';
        ctx.beginPath();
        ctx.arc(W * 0.76, H * 0.16, 2.9, 0, TAU);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    /* 星星（热度越高越多，晨光里淡出） */
    var starA = Math.pow(1 - dawn, 1.5);
    if (starA > 0.03) {
      var stars = w.stars;
      var extra = Math.round(clamp(warm, 0, 1) * 8);
      for (var i = 0; i < stars.length + extra; i++) {
        var s = stars[i % stars.length];
        var xx = s.x, yy = s.y;
        if (i >= stars.length) {
          xx = (xx + 0.37) % 0.94;
          yy = (yy + 0.21) % 0.6;
        }
        var tw = 0.55 + 0.45 * Math.sin(t / 1000 * s.sp + s.ph);
        var a = starA * s.a * tw * (i >= stars.length ? 0.7 : 1);
        if (a <= 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = warm > 0.55 ? '#FFE3B8' : '#EAF0FF';
        ctx.beginPath();
        ctx.arc(xx * W, yy * H, s.r, 0, TAU);
        ctx.fill();
        if (s.big) {
          ctx.globalAlpha = a * 0.22;
          ctx.beginPath();
          ctx.arc(xx * W, yy * H, s.r * 4.5, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    /* 云层：水平漂移受 boost（起飞）影响，热度跨档时散开一点 */
    var cloudA = (1 - S.scene.cloudPart * 0.45);
    var drift = 1 + S.scene.boost * 2.6;
    var cloudNight = '#5C5290', cloudDawn = '#FFB98C';
    for (var c = 0; c < w.clouds.length; c++) {
      var cl = w.clouds[c];
      var cx = ((cl.x + (t / 1000) * cl.sp * drift * 0.004) % 1.35) - 0.18;
      var cy = cl.y;
      var rx = W * cl.rx;
      var ry = H * cl.ry;
      var ca = cl.a * cloudA * (0.82 + 0.18 * Math.sin(t / 4000 + cl.ph));
      var rgb = mixRgb(cloudNight, cloudDawn, dawn);
      ctx.save();
      ctx.translate(cx * W, cy * H);
      ctx.scale(1, Math.max(0.24, ry / rx));
      var cg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      cg.addColorStop(0, rgba(rgb, r2(ca)));
      cg.addColorStop(0.5, rgba(rgb, r2(ca * 0.42)));
      cg.addColorStop(1, rgba(rgb, 0));
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.arc(0, 0, rx, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    /* 飞行星光拉线 */
    if (S.scene.streak > 0.02) {
      var sa = S.scene.streak;
      ctx.strokeStyle = 'rgba(226,236,255,' + r2(0.45 * sa) + ')';
      ctx.lineWidth = 1;
      for (var k = 0; k < 7; k++) {
        var sx = (k * 0.17 + 0.08) * W;
        var sy = (0.14 + (k % 3) * 0.16) * H;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx - 0.12 * W * sa, sy + 0.34 * H * sa);
        ctx.stroke();
      }
    }

    /* 地平线云带 + 远处地面灯火（夜航）/ 晨光 */
    var hzRgb = mixRgb('#182B52', '#FFC38C', dawn);
    var hz = ctx.createLinearGradient(0, H * 0.62, 0, H);
    hz.addColorStop(0, rgba(hzRgb, 0));
    hz.addColorStop(1, rgba(hzRgb, r2(0.22 + dawn * 0.42)));
    ctx.fillStyle = hz;
    ctx.fillRect(0, H * 0.62, W, H * 0.38);
    if (dawn < 0.6) {
      var lights = [
        [0.2, 0.85, 0.5], [0.3, 0.9, 0.34], [0.43, 0.82, 0.4],
        [0.57, 0.88, 0.3], [0.7, 0.83, 0.44], [0.83, 0.9, 0.3]
      ];
      var la = (1 - dawn / 0.6);
      for (var li = 0; li < lights.length; li++) {
        ctx.globalAlpha = lights[li][2] * (0.55 + 0.45 * Math.sin(t / 900 + li * 2.1)) * la;
        ctx.fillStyle = '#FFD09A';
        ctx.beginPath();
        ctx.arc(lights[li][0] * W, lights[li][1] * H, 1, 0, TAU);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    /* 机翼：薄薄一条从窗底左侧斜出去（避免读成山） */
    ctx.fillStyle = 'rgba(3,4,10,.94)';
    ctx.beginPath();
    ctx.moveTo(0, H * 1.02);
    ctx.lineTo(W * 0.1, H * 0.86);
    ctx.quadraticCurveTo(W * 0.34, H * 0.905, W * 0.6, H * 0.925);
    ctx.quadraticCurveTo(W * 0.72, H * 0.94, W * 0.78, H * 1.02);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,238,216,.16)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(W * 0.1, H * 0.862);
    ctx.quadraticCurveTo(W * 0.34, H * 0.905, W * 0.6, H * 0.925);
    ctx.stroke();

    /* 机翼灯（每 2.4s 亮一次） */
    var pulse = Math.pow(Math.max(0, Math.sin(t / 2400 * TAU)), 10);
    var lightX = W * 0.63, lightY = H * 0.928;
    ctx.globalAlpha = 0.2 + pulse * 0.8;
    var lg = ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, W * 0.18);
    lg.addColorStop(0, 'rgba(255,120,86,.9)');
    lg.addColorStop(0.35, 'rgba(255,110,80,.3)');
    lg.addColorStop(1, 'rgba(255,110,80,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.arc(lightX, lightY, W * 0.18, 0, TAU);
    ctx.fill();
    ctx.fillStyle = '#FF8A66';
    ctx.beginPath();
    ctx.arc(lightX, lightY, 1.2 + pulse * 1.4, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawDust(t) {
    var cv = S.el.dust, ctx = S.scene.dustCtx;
    if (!ctx) return;
    var W = S.vw, H = S.vh;
    var reduced = S.reduced;
    ctx.clearRect(0, 0, W, H);
    var ps = S.scene.particles;
    var falling = S.scene.dawn > 0.35;
    var warm = S.scene.dawn > 0.1 || S.scene.warm > 0.6;
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (!reduced) {
        var dt = 0.033;
        p.y += (falling ? p.vy * 1.6 : -p.vy) * (dt * 60) * 0.5;
        p.x += p.vx * (dt * 60) * 0.5;
        if (p.y < -0.06) { p.y = 1.06; p.x = Math.random(); }
        if (p.y > 1.06) { p.y = -0.06; p.x = Math.random(); }
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05) p.x = -0.05;
      }
      var tw = 0.55 + 0.45 * Math.sin(t / 1100 * p.sp + p.ph);
      var a = p.a * tw * (falling ? 0.9 : 0.75);
      if (a <= 0.012) continue;
      var x = p.x * W, y = p.y * H;
      ctx.globalAlpha = a;
      var col = warm ? 'rgba(255,214,170,' : 'rgba(255,236,214,';
      ctx.fillStyle = col + '1)';
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, TAU);
      ctx.fill();
      if (p.r > 1.4) {
        ctx.globalAlpha = a * 0.22;
        ctx.beginPath();
        ctx.arc(x, y, p.r * 4, 0, TAU);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ============================ 7. 相机 ============================ */
  function camStart() {
    if (!S || S.reduced || S.scene.hidden) return;
    if (!S.cam.raf) S.cam.raf = RAF(camTick);
  }

  function camTick(ts) {
    if (!S || !S.mounted) return;
    S.cam.raf = 0;
    var t = ts || nowMs();
    var active = false;
    var cam = S.cam;

    if (cam.baseAnim) {
      var ba = cam.baseAnim;
      var bp = clamp((t - ba.t0) / Math.max(16, ba.ms), 0, 1);
      cam.base = lerpVec(ba.from, ba.to, easeInOut(bp));
      if (bp >= 1) { cam.base = cloneVec(ba.to); cam.baseAnim = null; }
      else active = true;
    }

    if (cam.anim) {
      var a = cam.anim;
      var elapsed = t - a.t0;
      if (a.phase === 'in') {
        var p = clamp(elapsed / Math.max(16, a.in), 0, 1);
        cam.off = lerpVec(a.from, a.to, easeOut(p));
        if (p >= 1) {
          cam.off = cloneVec(a.to);
          a.phase = 'hold';
          a.holdUntil = t + Math.max(0, a.hold);
        }
        active = true;
      } else if (a.phase === 'hold') {
        cam.off = cloneVec(a.to);
        if (t >= a.holdUntil) {
          a.phase = 'out';
          a.t0 = t;
          a.fromOut = cloneVec(cam.off);
        }
        active = true;
      } else {
        var po = clamp((t - a.t0) / Math.max(16, a.out), 0, 1);
        cam.off = lerpVec(a.fromOut, ZERO, easeInOut(po));
        if (po >= 1) {
          cam.off = cloneVec(ZERO);
          cam.anim = null;
          S.root.setAttribute('data-cabin-cam', 'rest');
        }
        active = true;
      }
    }

    if (cam.shake) {
      if (t - cam.shake.t0 >= cam.shake.ms) cam.shake = null;
      else active = true;
    }

    applyCamera(t);
    if (active) camStart();
  }

  function applyCamera(ts) {
    if (!S || !S.boardEl) return;
    var t = ts || nowMs();
    if (S.reduced) {
      if (S.cam.applied) {
        if (S.cameraEnabled) {
          S.boardEl.style.transform = '';
          S.boardEl.style.willChange = '';
        }
        S.cam.applied = false;
        setCamVars(0, 0, 1, 0);
      }
      return;
    }
    var cam = S.cam;
    var fx = cam.base.x + cam.off.x;
    var fy = cam.base.y + cam.off.y;
    var fs = cam.base.s * cam.off.s;
    var fr = cam.base.r + cam.off.r;
    var frx = cam.base.rx + cam.off.rx;
    /* 待机极轻浮动（±0.7px，仅非 reduced） */
    fy += Math.sin(t / 3200 * TAU) * 0.7;
    if (cam.shake) {
      var sp = clamp((t - cam.shake.t0) / Math.max(16, cam.shake.ms), 0, 1);
      var k = (1 - sp) * (1 - sp);
      fx += (Math.sin(t * 0.113) * cam.shake.amp + Math.sin(t * 0.271) * cam.shake.amp * 0.55) * k;
      fy += (Math.cos(t * 0.157) * cam.shake.amp * 0.8 + Math.cos(t * 0.337) * cam.shake.amp * 0.4) * k;
      fr += Math.sin(t * 0.19) * cam.shake.rot * k;
    }
    /* V7：cameraEnabled=false 时 boardEl 归 App.Cinema，只有场景变量继续跑（视差/灯光）。 */
    if (S.cameraEnabled) {
      var tr = 'translate3d(' + r2(fx) + 'px,' + r2(fy) + 'px,0) scale(' + fs.toFixed(4) + ') rotate(' + r2(fr) + 'deg)';
      if (Math.abs(frx) > 0.001) tr = 'perspective(1200px) ' + tr + ' rotateX(' + r2(frx) + 'deg)';
      if (S.boardEl.style.transform !== tr) S.boardEl.style.transform = tr;
      if (S.boardEl.style.willChange !== 'transform') S.boardEl.style.willChange = 'transform';
      cam.applied = true;
    } else {
      setCamVars(fx, fy, fs, fr);
      return;
    }
    setCamVars(fx, fy, fs, fr);
  }

  function setCamVars(x, y, s, r) {
    if (!S || !S.root) return;
    var c = S.cam;
    if (Math.abs(c.lastX - x) > 0.05) { S.root.style.setProperty('--cb-cam-x', r2(x) + 'px'); c.lastX = x; }
    if (Math.abs(c.lastY - y) > 0.05) { S.root.style.setProperty('--cb-cam-y', r2(y) + 'px'); c.lastY = y; }
    if (Math.abs(c.lastS - s) > 0.0005) { S.root.style.setProperty('--cb-cam-s', s.toFixed(4)); c.lastS = s; }
    S.root.style.setProperty('--cb-cam-r', r2(r) + 'deg');
  }

  function camBump(to, inMs, holdMs, outMs, tag) {
    if (!S || S.reduced) return;
    var off = S.cam.off;
    S.cam.anim = {
      phase: 'in', t0: nowMs(),
      from: cloneVec(off),
      to: {
        x: to.x || 0, y: to.y || 0,
        s: to.s == null ? 1 : to.s,
        r: to.r || 0, rx: to.rx || 0
      },
      in: inMs || 240, hold: holdMs == null ? 0 : holdMs, out: outMs || 380
    };
    S.root.setAttribute('data-cabin-cam', tag || 'bump');
    camStart();
  }

  function camBaseTo(to, ms) {
    if (!S || S.reduced) return;
    S.cam.baseAnim = {
      from: cloneVec(S.cam.base),
      to: {
        x: to.x || 0, y: to.y || 0,
        s: to.s == null ? 1 : to.s,
        r: to.r || 0, rx: to.rx || 0
      },
      t0: nowMs(), ms: ms || 520
    };
    camStart();
  }

  function camShake(amp, rot, ms) {
    if (!S || S.reduced) return;
    S.cam.shake = { t0: nowMs(), ms: ms || 320, amp: amp || 6, rot: rot || 0.4 };
    S.root.setAttribute('data-cabin-cam', 'shake');
    camStart();
  }

  function resetCamera() {
    if (!S) return;
    S.cam.anim = null; S.cam.baseAnim = null; S.cam.shake = null;
    S.cam.base = cloneVec(ZERO); S.cam.off = cloneVec(ZERO);
    if (S.cam.raf) { CAF(S.cam.raf); S.cam.raf = 0; }
    /* V7：cameraEnabled=false 时 boardEl 可能正被 Cinema 驱动，不能清掉它的 transform */
    if (S.boardEl && S.cameraEnabled) { S.boardEl.style.transform = ''; S.boardEl.style.willChange = ''; }
    S.cam.applied = false;
    setCamVars(0, 0, 1, 0);
    if (S.root) S.root.setAttribute('data-cabin-cam', 'rest');
  }

  /* ============================ 8. 目标格 / 特效 ============================ */
  function squareCenter(id) {
    if (!S || !S.boardEl || !id) return null;
    var target = null;
    try { target = S.boardEl.querySelector('[data-square="' + String(id).replace(/"/g, '\\"') + '"]'); } catch (e) { target = null; }
    if (!target || !target.getBoundingClientRect) return null;
    try {
      var prev = S.boardEl.style.transform;
      S.boardEl.style.transform = 'none';
      var br = target.getBoundingClientRect();
      var hr = S.host.getBoundingClientRect();
      S.boardEl.style.transform = prev;
      if (!br || !br.width) return null;
      return { x: br.left + br.width / 2 - hr.left, y: br.top + br.height / 2 - hr.top };
    } catch (e) { return null; }
  }

  function targetDir(id) {
    var c = squareCenter(id);
    var b = S.board;
    if (!c || !b || !b.width) {
      var m = /^ring:(\d+)$/.exec(String(id || ''));
      if (m) {
        var a = (Number(m[1]) % 52) / 52 * TAU;
        return { x: Math.cos(a), y: Math.sin(a) };
      }
      return { x: 0, y: 0 };
    }
    var dx = (c.x - (b.left + b.width / 2)) / (b.width / 2);
    var dy = (c.y - (b.top + b.height / 2)) / (b.height / 2);
    var len = Math.sqrt(dx * dx + dy * dy) || 1;
    if (len > 1) { dx /= len; dy /= len; }
    return { x: dx, y: dy };
  }

  function followTo(squareId, scale, inMs, holdMs, outMs, tag, rx) {
    var dir = targetDir(squareId);
    var len = Math.min(1, Math.sqrt(dir.x * dir.x + dir.y * dir.y));
    var mag = 6 + 6 * len;
    camBump({
      x: dir.x * mag, y: dir.y * mag * 0.8,
      s: scale || 1.02, r: 0, rx: rx || 0
    }, inMs || 500, holdMs == null ? 280 : holdMs, outMs || 700, tag || 'follow');
  }

  function flashScreen() {
    if (!S || S.reduced) return;
    var f = S.el.flash;
    if (!f) return;
    f.style.transition = 'none';
    f.style.opacity = '0.62';
    RAF(function () {
      if (!S || !S.el.flash) return;
      S.el.flash.style.transition = 'opacity 520ms ease-out';
      S.el.flash.style.opacity = '0';
    });
  }

  function flickerLamp() {
    if (!S || S.reduced) return;
    var root = S.root;
    root.classList.remove('is-flicker');
    void root.offsetWidth;
    root.classList.add('is-flicker');
    later(function () { if (S && S.root) S.root.classList.remove('is-flicker'); }, 300, 'uiTimers');
  }

  function rippleAt(squareId, red) {
    if (!S || S.reduced) return;
    var c = squareCenter(squareId) || {
      x: S.board.left + S.board.width / 2,
      y: S.board.top + S.board.height / 2
    };
    var rp = S.el.ripple;
    if (!rp) return;
    rp.classList.remove('is-on');
    void rp.offsetWidth;
    /* 波纹落在小桌板前沿（棋盘下方可见的桌板边），不会被棋盘盖住 */
    rp.style.left = r2(clamp(c.x, 52, S.vw - 52)) + 'px';
    rp.style.top = r2(S.board.top + S.board.height + 11) + 'px';
    rp.classList.add('is-tray');
    rp.classList.toggle('is-red', !!red);
    rp.classList.add('is-on');
    later(function () { if (S && S.el.ripple) S.el.ripple.classList.remove('is-on'); }, 800, 'uiTimers');
  }

  function spotAt(squareId) {
    if (!S || !S.el.spot) return;
    var c = squareCenter(squareId);
    if (!c) return;
    S.el.spot.style.left = r2(clamp(c.x, 112, S.vw - 112)) + 'px';
    S.el.spot.style.top = r2(S.board.top + S.board.height + 12) + 'px';
    S.el.spot.classList.add('is-on');
  }

  function spotOff() {
    if (S && S.el.spot) S.el.spot.classList.remove('is-on');
  }

  function pulseHeart() {
    if (!S || S.reduced || !S.el.heart) return;
    S.el.heart.classList.remove('is-on');
    void S.el.heart.offsetWidth;
    S.el.heart.classList.add('is-on');
    later(function () { if (S && S.el.heart) S.el.heart.classList.remove('is-on'); }, 950, 'uiTimers');
  }

  /* ============================ 9. mood ============================ */
  function setWarm(target, ms) {
    if (!S) return;
    target = clamp(target, 0, 1);
    S.scene.warmTarget = target;
    S.scene.warmMs = ms || 600;
    if (S.reduced) { S.scene.warm = target; drawSceneOnce(); }
  }

  function setDawn(target, ms) {
    if (!S) return;
    target = clamp(target, 0, 1);
    S.scene.dawnTarget = target;
    S.scene.dawnMs = ms || 8000;
    if (S.reduced) {
      S.scene.dawn = target;
      drawSceneOnce();
    }
    S.root.setAttribute('data-cabin-mood', target > 0.5 ? 'dawn' : (S.scene.dawn > 0.5 ? 'dawn' : 'night'));
  }

  function setMood(mood) {
    if (!S || !S.mounted) return;
    mood = mood || {};
    try {
      var m = S.mood;
      if (typeof mood.heat === 'number' && isFinite(mood.heat)) {
        m.heat = clamp(mood.heat, 0, 100);
        setWarm(m.heat / 100, 700);
      }
      var stage = (typeof mood.stage === 'string' && mood.stage) ? mood.stage : stageOf(m.heat);
      if (stage !== m.stage) {
        var was = m.stage;
        m.stage = stage;
        S.root.setAttribute('data-stage', stage);
        if (was && was !== stage && stage !== 'cold') {
          S.scene.cloudPart = Math.min(1, S.scene.cloudPart + 0.32);
          flickerLamp();
        }
      }
      S.root.classList.toggle('is-hot', m.heat >= 40 || stage === 'burning' || stage === 'blazing');
      S.root.classList.toggle('is-blazing', stage === 'burning' || stage === 'blazing');

      if (mood.turn === 'a' || mood.turn === 'b') {
        m.turn = mood.turn;
        S.root.setAttribute('data-turn', mood.turn);
      }

      if (mood.winner === 'a' || mood.winner === 'b') {
        if (m.winner !== mood.winner) {
          m.winner = mood.winner;
          S.root.classList.add('is-won');
          setDawn(1, 8000);
          camBaseTo({ s: 0.97 }, 900);
        }
      } else if (mood.winner === null) {
        if (m.winner) {
          m.winner = null;
          S.root.classList.remove('is-won');
          setDawn(0, 600);
          camBaseTo(ZERO, 700);
        }
      }

      if (typeof mood.phase === 'string') {
        m.phase = mood.phase;
        var ended = mood.phase === 'ended' || mood.phase === 'safe-ended';
        S.root.classList.toggle('is-ended', ended);
        S.root.classList.toggle('is-safe', mood.phase === 'safe-ended');
        if (ended && !m.winner) camBaseTo({ s: 0.99 }, 700);
      }

      if (typeof mood.overlay === 'boolean') {
        m.overlay = mood.overlay;
        S.root.classList.toggle('is-overlay', mood.overlay);
        if (mood.overlay) {
          camBaseTo({ s: 0.99 }, 520);
        } else {
          spotOff();
          if (!m.winner) camBaseTo(ZERO, 520);
        }
      }
      if (S.reduced) drawSceneOnce();
    } catch (e) { /* mood 失败不影响棋局 */ }
  }

  /* ============================ 10. play 编排 ============================ */
  function durationOf(ev) {
    if (!ev || !ev.type) return 220;
    switch (ev.type) {
      case 'dice': return 1550;
      case 'takeoff': return 950;
      case 'move': return Math.min(2100, Math.max(1000, ((ev.path || []).length * 100) + 360));
      case 'jump': return 760;
      case 'fly': return 920;
      case 'capture': return 900;
      case 'stack': return 520;
      case 'prompt': return 300;
      case 'minigame': return 300;
      case 'turn': return 340;
      case 'heat': return 560;
      case 'win': return 980;
      case 'ledger': return 480;
      case 'safe': return 380;
      case 'ending-start': return 700;
      case 'streak': return 200;
      case 'milestone': return 560;
      default: return 220;
    }
  }

  function moveMs(ev) {
    var len = ((ev && ev.path) || []).length;
    if (!len) return 0;
    var step = Math.max(90, Math.min(200, Math.round(1500 / len)));
    return len * step;
  }

  function planEvent(ev, at, token) {
    if (!ev || !ev.type) return;
    var run = function (fn) {
      later(function () {
        if (!S || !S.mounted || S.playToken !== token) return;
        try { fn(); } catch (e) {}
      }, Math.max(0, Math.round(at)), 'timers');
    };
    switch (ev.type) {
      case 'dice':
        run(function () {
          camBump({ x: 0, y: -4, s: 1.03 }, 260, 900, 420, 'dice');
          flickerLamp();
        });
        break;

      case 'takeoff':
        run(function () {
          S.scene.boost = 1;
          followTo(S.landing, 1.02, 360, 460, 560, 'takeoff', 0);
        });
        run(function () { rippleAt(S.landing, false); });
        break;

      case 'move': {
        var path = ev.path || [];
        var land = path.length ? path[path.length - 1] : S.landing;
        run(function () { followTo(land, 1.02, 500, 280, 700, 'move', 0); });
        var ms = moveMs(ev);
        later(function () {
          if (!S || !S.mounted || S.playToken !== token) return;
          rippleAt(land, false);
        }, Math.max(0, Math.round(at + Math.max(260, ms - 60))), 'timers');
        break;
      }

      case 'jump':
        run(function () {
          followTo(S.landing, 1.02, 420, 260, 560, 'jump', 0.6);
        });
        run(function () { rippleAt(S.landing, false); });
        break;

      case 'fly':
        run(function () {
          followTo(S.landing, 1.02, 420, 280, 600, 'fly', 0.6);
          S.scene.streak = 1;
        });
        run(function () { rippleAt(S.landing, false); });
        break;

      case 'capture':
        run(function () {
          camShake(6, 0.4, 320);
          flashScreen();
          flickerLamp();
          rippleAt(S.landing, true);
        });
        break;

      case 'stack':
        run(function () {
          camBump({ s: 1.012 }, 240, 240, 420, 'stack');
          pulseHeart();
          rippleAt(ev.at || S.landing, false);
        });
        break;

      case 'turn':
        run(function () {
          var side = ev.playerId === 'b' ? 1 : (ev.playerId === 'a' ? -1 : (S.mood.turn === 'b' ? 1 : -1));
          if (ev.playerId === 'a' || ev.playerId === 'b') {
            S.mood.turn = ev.playerId;
            S.root.setAttribute('data-turn', ev.playerId);
          }
          camBump({ x: side * 8 }, 600, 240, 520, 'turn');
        });
        break;

      case 'prompt':
      case 'minigame':
        run(function () {
          S.root.classList.add('is-overlay');
          camBaseTo({ s: 0.99 }, 520);
          spotAt((ev.prompt && ev.prompt.squareId) || S.landing);
          /* 防御：60s 内没有收到 overlay=false 时自己恢复，避免卡在压暗态 */
          later(function () {
            if (!S || !S.mounted) return;
            if (S.mood.overlay) return;
            S.root.classList.remove('is-overlay');
            spotOff();
            if (!S.mood.winner) camBaseTo(ZERO, 520);
          }, 60000, 'timers');
        });
        break;

      case 'heat':
        run(function () {
          var heat = clamp(Number(ev.heat) || 0, 0, 100);
          setWarm(heat / 100, 600);
          S.mood.heat = heat;
          if (ev.stage && ev.stage !== S.mood.stage) {
            S.scene.cloudPart = Math.min(1, S.scene.cloudPart + 0.32);
            flickerLamp();
          }
          if (ev.stage) S.mood.stage = ev.stage;
          camBump({ s: 1.01 }, 300, 200, 420, 'heat');
        });
        break;

      case 'win':
        run(function () {
          S.root.classList.add('is-won');
          if (ev.playerId === 'a' || ev.playerId === 'b') S.mood.winner = ev.playerId;
          setDawn(1, 8000);
          camBaseTo({ s: 0.97 }, 900);
        });
        break;

      case 'ledger':
        run(function () {
          S.root.classList.add('is-ended');
          if (!S.mood.winner) camBaseTo({ s: 0.99 }, 700);
        });
        break;

      case 'safe':
        run(function () {
          S.root.classList.add('is-safe');
          camBaseTo(ZERO, 800);
        });
        break;

      case 'ending-start':
        run(function () {
          S.root.classList.add('is-ended');
          if (!S.mood.winner) camBaseTo({ s: 0.99 }, 600);
        });
        break;

      case 'streak':
      case 'milestone':
        run(function () { flickerLamp(); });
        break;

      default:
        break;
    }
  }

  function resolvePendingPlay(value) {
    if (!S || !S.pendingPlay) return;
    var p = S.pendingPlay;
    S.pendingPlay = null;
    try { p.resolve(value); } catch (e) {}
  }

  function play(events, opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    var list = Array.isArray(events) ? events.slice() : [];
    if (!list.length) return Promise.resolve(null);
    if (S.reduced) return Promise.resolve({ reduced: true, planned: 0 });

    /* 新一批事件：取消上一批尚未执行的镜头计划（保留 base 状态，避免 prompt 压暗被误恢复）；
     * 上一批的 Promise 以 null 结束（契约：永不 reject、不悬挂）。 */
    clearTimers('timers');
    resolvePendingPlay(null);
    S.playToken++;
    var token = S.playToken;
    var t = 0;

    for (var i = 0; i < list.length; i++) {
      var ev = list[i];
      if (!ev || typeof ev !== 'object') continue;
      if (ev.type === 'takeoff') {
        var p1 = ev.path || [];
        if (p1.length) S.landing = p1[p1.length - 1];
      } else if (ev.type === 'move') {
        var p2 = ev.path || [];
        if (p2.length) S.landing = p2[p2.length - 1];
      } else if (ev.type === 'jump' || ev.type === 'fly') {
        S.landing = ev.to || ev.from || S.landing;
      }
      planEvent(ev, t, token);
      t += durationOf(ev);
    }

    return new Promise(function (resolve) {
      var wait = Math.min(14000, t + 120);
      S.pendingPlay = { token: token, resolve: resolve };
      later(function () {
        if (!S || S.playToken !== token) return resolvePendingPlay(null);
        resolvePendingPlay({ planned: list.length, ms: wait });
      }, wait, 'timers');
    });
  }

  /* ============================ 11. 循环 / 生命周期 ============================ */
  function sceneTick(ts) {
    if (!S || !S.mounted) return;
    S.scene.raf = 0;
    if (S.reduced || S.scene.hidden || S.cinematic) return;
    /* 首帧：没有 last 时强制画一帧（否则 0 - ts 恒 < 31 会永远空转） */
    var last = S.scene.last;
    var dt = last ? Math.min(90, ts - last) : 16;
    if (last && dt < 31) { S.scene.raf = RAF(sceneTick); return; }
    S.scene.last = ts;
    stepScene(dt, ts);
    S.scene.raf = RAF(sceneTick);
  }

  function startScene() {
    if (!S || S.reduced || S.scene.hidden || S.cinematic) return;
    if (S.scene.raf) return;
    S.scene.last = 0;
    S.scene.raf = RAF(sceneTick);
    S.root.setAttribute('data-cabin-paused', '0');
  }

  function stopScene() {
    if (!S) return;
    if (S.scene.raf) { CAF(S.scene.raf); S.scene.raf = 0; }
  }

  function applyReducedMode() {
    if (!S) return;
    var r = !!S.optReduced || !!(S.mq && S.mq.matches);
    S.reduced = r;
    S.root.classList.toggle('is-reduced', r);
    S.root.setAttribute('data-cabin-reduced', r ? '1' : '0');
    if (r) {
      stopScene();
      resetCamera();
      S.scene.warm = S.scene.warmTarget;
      S.scene.dawn = S.scene.dawnTarget;
      S.scene.streak = 0; S.scene.boost = 0;
      drawSceneOnce();
    } else {
      startScene();
    }
  }

  function onVisibility() {
    if (!S) return;
    var hidden = !!doc.hidden;
    S.scene.hidden = hidden;
    S.root.setAttribute('data-cabin-paused', hidden ? '1' : '0');
    if (hidden) {
      stopScene();
      if (S.cam.raf) { CAF(S.cam.raf); S.cam.raf = 0; }
      S.cam.anim = null; S.cam.baseAnim = null; S.cam.shake = null;
      S.cam.base = cloneVec(ZERO); S.cam.off = cloneVec(ZERO);
      if (S.boardEl && S.cameraEnabled) { S.boardEl.style.transform = ''; S.boardEl.style.willChange = ''; }
      S.cam.applied = false;
      setCamVars(0, 0, 1, 0);
    } else {
      startScene();
    }
  }

  function onResize() {
    if (!S) return;
    if (S.rafLayout) return;
    S.rafLayout = RAF(function () {
      if (!S) return;
      S.rafLayout = 0;
      layout();
      drawSceneOnce();
    });
  }

  /* ============================ 12. 门面 ============================ */
  function mount(host, opts) {
    opts = opts || {};
    try {
      if (!host || host.nodeType !== 1) return null;
      injectCss();
      if (S && S.mounted) unmount();
      S = createState(host, opts);

      var cs = global.getComputedStyle ? global.getComputedStyle(host) : null;
      if (cs && cs.position === 'static') host.style.position = 'relative';
      S.hostPrev = {
        pointerEvents: host.style.pointerEvents,
        position: host.style.position
      };
      host.style.pointerEvents = 'none';
      host.setAttribute('data-cabin-mount', '1');

      if (S.boardEl) {
        S.boardPrev = {
          transform: S.boardEl.style.transform || '',
          willChange: S.boardEl.style.willChange || '',
          transformOrigin: S.boardEl.style.transformOrigin || '',
          backface: S.boardEl.style.backfaceVisibility || ''
        };
        S.boardEl.style.transformOrigin = '50% 50%';
        S.boardEl.style.backfaceVisibility = 'hidden';
      }

      buildDom();
      S.mounted = true;
      S.root.setAttribute('data-cabin-camera', S.cameraEnabled ? 'on' : 'off');

      /* 尺寸 -> 画布 -> 初始绘制 */
      layout();
      S.root.classList.toggle('is-reduced', S.reduced);
      S.root.setAttribute('data-cabin-reduced', S.reduced ? '1' : '0');
      if (S.reduced) drawSceneOnce();
      else startScene();

      /* 监听 */
      if (doc.addEventListener) {
        S.onVis = onVisibility;
        doc.addEventListener('visibilitychange', S.onVis);
      }
      if (typeof global.ResizeObserver === 'function') {
        S.ro = new global.ResizeObserver(onResize);
        try { S.ro.observe(host); } catch (e) {}
      } else {
        S.onResize = onResize;
        global.addEventListener('resize', S.onResize);
      }
      if (global.matchMedia) {
        S.mq = global.matchMedia('(prefers-reduced-motion: reduce)');
        S.onMq = function () { applyReducedMode(); };
        if (S.mq.addEventListener) S.mq.addEventListener('change', S.onMq);
        else if (S.mq.addListener) S.mq.addListener(S.onMq);
      }

      return {
        version: VERSION,
        host: host,
        root: S.root,
        boardEl: S.boardEl,
        mount: mount,
        unmount: unmount,
        setMood: setMood,
        play: play,
        setReduced: setReduced,
        setSound: setSound,
        setCameraEnabled: setCameraEnabled,
        setCinematic: setCinematic,
        _debug: debugState
      };
    } catch (e) {
      try {
        if (S && S.root && S.root.parentNode) S.root.parentNode.removeChild(S.root);
        if (host) {
          host.removeAttribute('data-cabin-mount');
          host.innerHTML = '';
        }
      } catch (e2) {}
      S = null;
      return null;
    }
  }

  function unmount() {
    var st = S;
    if (!st) return;
    try {
      st.mounted = false;
      st.playToken++;
      resolvePendingPlay(null);
      clearTimers('timers');
      clearTimers('uiTimers');
      stopScene();
      if (st.cam.raf) { CAF(st.cam.raf); st.cam.raf = 0; }
      if (st.rafLayout) { CAF(st.rafLayout); st.rafLayout = 0; }
      if (st.ro && st.ro.disconnect) { try { st.ro.disconnect(); } catch (e) {} }
      if (doc.removeEventListener && st.onVis) doc.removeEventListener('visibilitychange', st.onVis);
      if (st.onResize && global.removeEventListener) global.removeEventListener('resize', st.onResize);
      if (st.mq && st.onMq) {
        if (st.mq.removeEventListener) st.mq.removeEventListener('change', st.onMq);
        else if (st.mq.removeListener) st.mq.removeListener(st.onMq);
      }
      /* V7：Cinema 接管时不还原 boardEl（否则会把 Cinema 的镜头 transform 擦掉）；
       * 约定 table.cleanup 先 Cinema.unmount() 再 CabinScene.unmount()。 */
      if (st.boardEl && st.boardPrev && st.cameraEnabled) {
        st.boardEl.style.transform = st.boardPrev.transform;
        st.boardEl.style.willChange = st.boardPrev.willChange;
        st.boardEl.style.transformOrigin = st.boardPrev.transformOrigin;
        st.boardEl.style.backfaceVisibility = st.boardPrev.backface;
      }
      if (st.hostPrev) {
        st.host.style.pointerEvents = st.hostPrev.pointerEvents;
        st.host.style.position = st.hostPrev.position;
      }
      if (st.root && st.root.parentNode) st.root.parentNode.removeChild(st.root);
      if (st.host) st.host.removeAttribute('data-cabin-mount');
    } catch (e) {
      /* 卸载失败也要保持可再次 mount */
    }
    S = null;
  }

  /* V7 性能：Cinema 的 POV/跟拍期间停止场景画布刷新 + 关掉重混合层。
   * 只影响场景绘制，不动布局/相机/棋盘；land 结束后 table 会恢复。 */
  function setCinematic(flag) {
    if (!S) return;
    var on = !!flag;
    if (S.cinematic === on) {
      if (S.root) S.root.setAttribute('data-cabin-cinematic', on ? '1' : '0');
      return;
    }
    S.cinematic = on;
    if (S.root) S.root.setAttribute('data-cabin-cinematic', on ? '1' : '0');
    if (on) stopScene();
    else startScene();
  }

  function setReduced(flag) {
    if (!S) return;
    S.optReduced = !!flag;
    applyReducedMode();
  }

  function setSound(flag) {
    if (!S) return;
    S.sound = flag !== false;
  }

  /* V7：Cinema 接管 boardEl 相机开关。false = 本模块只保留场景视差/灯光回调（--cb-cam-*），
   * 不写 boardEl.transform；true = 恢复 V6.2 相机。切换时清掉自己的动画，避免和 Cinema 抢帧。 */
  function setCameraEnabled(flag) {
    if (!S) return;
    var on = flag !== false;
    if (S.cameraEnabled === on) {
      if (S.root) S.root.setAttribute('data-cabin-camera', on ? 'on' : 'off');
      return;
    }
    S.cameraEnabled = on;
    S.cam.anim = null; S.cam.baseAnim = null; S.cam.shake = null;
    if (S.cam.raf) { CAF(S.cam.raf); S.cam.raf = 0; }
    if (!on && S.boardEl && S.cam.applied) {
      S.boardEl.style.transform = '';
      S.boardEl.style.willChange = '';
    }
    S.cam.applied = false;
    S.cam.base = cloneVec(ZERO); S.cam.off = cloneVec(ZERO);
    setCamVars(0, 0, 1, 0);
    if (S.root) S.root.setAttribute('data-cabin-camera', on ? 'on' : 'off');
  }

  function debugState() {
    if (!S) return null;
    return {
      version: VERSION,
      mounted: !!S.mounted,
      reduced: !!S.reduced,
      hidden: !!S.scene.hidden,
      sceneFrames: S.scene.frames,
      sceneRaf: !!S.scene.raf,
      camRaf: !!S.cam.raf,
      camActive: !!S.cam.anim || !!S.cam.baseAnim || !!S.cam.shake,
      camTransform: S.boardEl ? S.boardEl.style.transform : '',
      dawn: S.scene.dawn,
      dawnTarget: S.scene.dawnTarget,
      warm: S.scene.warm,
      overlay: !!S.mood.overlay,
      winner: S.mood.winner,
      turn: S.mood.turn,
      board: S.board,
      tray: S.el.tray ? {
        left: S.el.tray.offsetLeft, top: S.el.tray.offsetTop,
        width: S.el.tray.offsetWidth, height: S.el.tray.offsetHeight
      } : null,
      particleCount: S.scene.particles.length,
      cameraEnabled: !!S.cameraEnabled,
      cinematic: !!S.cinematic,
      camVars: {
        x: S.root ? S.root.style.getPropertyValue('--cb-cam-x') : '',
        y: S.root ? S.root.style.getPropertyValue('--cb-cam-y') : '',
        s: S.root ? S.root.style.getPropertyValue('--cb-cam-s') : ''
      },
      dpr: global.devicePixelRatio || 1,
      vw: S.vw, vh: S.vh
    };
  }

  App.CabinScene = {
    version: VERSION,
    mount: mount,
    unmount: unmount,
    setMood: setMood,
    play: play,
    setReduced: setReduced,
    setSound: setSound,
    setCameraEnabled: setCameraEnabled,
    setCinematic: setCinematic,
    _debug: debugState
  };
})(typeof window !== 'undefined' ? window : this);

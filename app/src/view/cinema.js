/* ==========================================================================
 * 今晚飞行棋 V7 · view/cinema.js  「云海机舱 · 电影镜头导演」
 * 唯一门面：App.Cinema（docs/v7/impl-freeze.md §1/§4.1）
 *
 * 职责：每回合镜头链（overview → roll → pov → chase → land → cell45/bear → return）
 *      + 第一人称 POV 前景（机头/机翼/速度线/云） + 第三人称跟拍 + 落地反馈。
 * 边界：只改 `boardEl.style.transform` 与 host 上的 `--cv7-*` CSS 变量；
 *      不改布局、不拦截点击（overlay pointer-events:none，只有「快进」按钮可点）；
 *      不调引擎、不读写 localStorage、不读写棋盘 DOM 结构。
 * 相机接管：table 在 mount CabinScene 时传 cameraEnabled:false（或调 setCameraEnabled(false)），
 *          CabinScene 继续做场景视差/灯光，boardEl 的 transform 由本模块独占。
 *
 * API（冻结单 §4.1；方法均返回 Promise，永不 reject，可被新阶段/ skip / unmount 提前 resolve）：
 *   App.Cinema.mount(host, opts) -> inst | null
 *     host: .v6-table；opts: { boardEl, cabinHost, reduced, sound, theme, onSkip }
 *   App.Cinema.unmount()
 *   App.Cinema.overview(opts) / roll(events, opts) / pov(opts) / chase(events, opts) /
 *   land(events, opts) / returnToOverview(opts)
 *   App.Cinema.setTheme(theme) / setReduced(flag) / setSound(flag) / skip()
 *   附加（非契约，供主桌/QA）：stage('cell45'|'bear')、_debug()
 *
 * QA 钩子（host = .v6-table）：
 *   [data-cinema-state="overview|roll|pov|chase|land|cell45|bear|return"]
 *   [data-cinema-version="7.0.0"][data-cinema-reduced="0|1"][data-cinema-theme="cloud|star|paper"]
 *   [data-cinema-skip="1"]（可快进时）
 *   [data-test="cinema-pov"] / "cinema-skip" / "cinema-dust" / "cinema-ripple" / "cinema-glow"
 *
 * 时长（不含用户答题）：roll 1.0s / POV 1.1s / chase 1.5–2.3s / land 0.52s / return 0.8s。
 * 性能：全部 transform/opacity；单一 rAF 只在过渡期间跑，结束即释放；reduced 零 rAF 零 transform。
 * ========================================================================== */
(function (global) {
  'use strict';

  var App = (global.App = global.App || {});
  var doc = global.document;
  var VERSION = '7.0.0';

  var RAF = global.requestAnimationFrame
    ? function (cb) { return global.requestAnimationFrame(cb); }
    : function (cb) { return global.setTimeout(function () { cb(nowMs()); }, 16); };
  var CAF = global.cancelAnimationFrame
    ? function (id) { global.cancelAnimationFrame(id); }
    : function (id) { global.clearTimeout(id); };

  var ROLL_MS = 1000;
  var POV_MS = 1100;
  var LAND_MS = 520;
  var RETURN_MS = 800;
  var REDUCED_MS = 160;

  var THEMES = {
    cloud: {
      accent: '#8FA6E8', accentSoft: 'rgba(143,166,232,.72)',
      sky: 'rgba(96,132,204,.30)', wing: '#101a30', instrument: '#F3C077'
    },
    star: {
      accent: '#B79CFF', accentSoft: 'rgba(183,156,255,.72)',
      sky: 'rgba(126,96,214,.28)', wing: '#120f2c', instrument: '#F0C877'
    },
    paper: {
      accent: '#E2B37C', accentSoft: 'rgba(226,179,124,.72)',
      sky: 'rgba(214,156,96,.24)', wing: '#2a1c14', instrument: '#F3C077'
    }
  };

  var S = null;

  /* ---------- 小工具 ---------- */
  function nowMs() {
    return (global.performance && global.performance.now) ? global.performance.now() : Date.now();
  }
  function clamp(n, lo, hi) { n = Number(n); if (isNaN(n)) n = lo; return Math.max(lo, Math.min(hi, n)); }
  function r2(n) { return Math.round(n * 100) / 100; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function pose(x, y, s, rz, rx) { return { x: x || 0, y: y || 0, s: s == null ? 1 : s, rz: rz || 0, rx: rx || 0 }; }
  function clonePose(p) { return { x: p.x, y: p.y, s: p.s, rz: p.rz, rx: p.rx }; }
  function lerpPose(a, b, t) {
    return {
      x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t,
      s: a.s + (b.s - a.s) * t, rz: a.rz + (b.rz - a.rz) * t,
      rx: a.rx + (b.rx - a.rx) * t
    };
  }
  function el(tag, cls) {
    var e = doc.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }
  function sfx(name) {
    if (!S || !S.sound) return;
    try { if (App.Audio && typeof App.Audio.play === 'function') App.Audio.play(name); } catch (e) {}
  }
  function delay(ms) {
    return new Promise(function (resolve) { global.setTimeout(resolve, Math.max(0, ms)); });
  }

  /* ---------- CSS ---------- */
  var CSS = [
    /* 根：棋盘之上、HUD 之下（1 与 boardwrap 同层但 DOM 在后），不吃点按 */
    '.cv7{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden;',
    'opacity:1;transition:opacity .18s ease;contain:layout paint}',
    '.cv7 *,.cv7 *:before,.cv7 *:after{pointer-events:none}',

    /* 压暗层（cell45/bear 时把棋盘压暗；CellStage 自己也会压暗，这里是双保险） */
    '.cv7-scrim{position:absolute;inset:0;opacity:0;transition:opacity .32s ease;',
    'background:radial-gradient(120% 90% at 50% 46%,rgba(6,5,14,.18),rgba(6,5,14,.62))}',
    '.cv7-scrim.on{opacity:1}',

    /* 目标格光晕 */
    '.cv7-glow{position:absolute;left:var(--cv7-tx,50%);top:var(--cv7-ty,50%);width:132px;height:132px;',
    'margin:-66px 0 0 -66px;border-radius:50%;opacity:0;transition:opacity .28s ease;',
    'background:radial-gradient(circle,var(--cv7-accent-soft,rgba(143,166,232,.72)) 0%,',
    'rgba(255,240,215,.18) 38%,rgba(255,240,215,0) 68%)}',
    '.cv7-glow.on{opacity:.95;animation:cv7-glow-pulse 1.4s ease-in-out infinite}',
    '.cv7-glow:after{content:"";position:absolute;inset:37%;border-radius:50%;',
    'border:1.5px solid rgba(255,244,224,.72);box-shadow:0 0 20px var(--cv7-accent,rgba(143,166,232,.8))}',
    '@keyframes cv7-glow-pulse{0%,100%{transform:scale(.86);opacity:.7}50%{transform:scale(1.12);opacity:1}}',

    /* 落地尘土 / 涟漪（位置用 --cv7-tx/ty，落在目标格中心） */
    '.cv7-land{position:absolute;left:var(--cv7-tx,50%);top:var(--cv7-ty,50%);width:0;height:0}',
    '.cv7-dust,.cv7-ripple{position:absolute;left:0;top:0;border-radius:50%;opacity:0}',
    '.cv7-dust{width:104px;height:104px;margin:-52px 0 0 -52px;',
    'background:radial-gradient(circle,rgba(255,241,214,.66) 0%,rgba(233,214,185,.26) 40%,rgba(233,214,185,0) 70%)}',
    '.cv7-ripple{width:124px;height:124px;margin:-62px 0 0 -62px;border:2.5px solid rgba(255,244,224,.75);',
    'box-shadow:0 0 22px var(--cv7-accent-soft,rgba(143,166,232,.72))}',
    '.cv7-dust.on{animation:cv7-dust .62s ease-out both}',
    '.cv7-ripple.on{animation:cv7-ripple .68s ease-out both}',
    '@keyframes cv7-dust{0%{opacity:.0;transform:scale(.32)}22%{opacity:.85}100%{opacity:0;transform:scale(1.5)}}',
    '@keyframes cv7-ripple{0%{opacity:.9;transform:scale(.3)}100%{opacity:0;transform:scale(1.7)}}',

    /* ---------- 第一人称 POV 前景 ---------- */
    '.cv7-pov{position:absolute;inset:0;opacity:0;transition:opacity .22s ease;',
    'background:radial-gradient(140% 80% at 50% 12%,var(--cv7-sky,rgba(96,132,204,.3)) 0%,rgba(96,132,204,0) 58%)}',
    '.cv7-pov.on{opacity:1}',
    /* 非 POV 时前景动画必须停：否则云/速度线在整局里空转，是 V7 长帧的主要来源 */
    '.cv7-pov:not(.on) *{animation-play-state:paused!important}',
    /* 座舱盖顶框 + 两侧窗框：让 POV 有「坐在驾驶舱里」的边界感 */
    '.cv7-pov:before{content:"";position:absolute;left:-6%;right:-6%;top:-2%;height:13%;',
    'background:linear-gradient(180deg,rgba(8,9,18,.96) 0%,rgba(10,12,24,.9) 58%,rgba(10,12,24,0) 100%);',
    'border-radius:0 0 42% 42%/0 0 100% 100%;box-shadow:0 10px 26px rgba(2,2,8,.55)}',
    '.cv7-pov:after{content:"";position:absolute;inset:0;',
    'background:linear-gradient(118deg,rgba(150,180,235,.10) 0%,rgba(150,180,235,0) 26%,rgba(150,180,235,0) 70%,rgba(150,180,235,.08) 88%),',
    'linear-gradient(90deg,rgba(4,5,12,.5) 0,rgba(4,5,12,0) 13%,rgba(4,5,12,0) 87%,rgba(4,5,12,.5) 100%)}',
    /* 云：从右向左掠（纯渐变，不用 filter:blur —— 大层 blur 在低端机是主要长帧源） */
    '.cv7-clouds i{position:absolute;width:46%;height:15%;border-radius:50%;opacity:0;',
    'background:radial-gradient(closest-side,rgba(228,238,255,.62),rgba(228,238,255,0));',
    'animation:cv7-cloud 1.9s linear infinite}',
    '.cv7-clouds i:nth-child(1){top:15%;left:70%;animation-delay:0s}',
    '.cv7-clouds i:nth-child(2){top:29%;left:26%;width:62%;height:20%;animation-delay:-.55s}',
    '.cv7-clouds i:nth-child(3){top:51%;left:88%;animation-delay:-1.1s}',
    '.cv7-clouds i:nth-child(4){top:62%;left:4%;width:42%;height:13%;animation-delay:-1.5s}',
    '.cv7-clouds i:nth-child(5){display:none}',
    '@keyframes cv7-cloud{0%{opacity:0;transform:translate3d(22%,0,0) scale(.88)}',
    '16%{opacity:.95}70%{opacity:.6}100%{opacity:0;transform:translate3d(-104%,7%,0) scale(1.3)}}',
    /* 速度线：单层渐变，不用 mask/blend（省一次全屏合成）；透明度已足够示意 */
    '.cv7-speed{position:absolute;inset:-14%;opacity:.5;',
    'background:repeating-linear-gradient(90deg,rgba(214,230,255,0) 0 24px,rgba(214,230,255,.2) 24px 26px,rgba(214,230,255,0) 26px 58px);',
    'animation:cv7-speed .26s linear infinite}',
    '@keyframes cv7-speed{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(-78px,0,0)}}',
    /* 机翼（左右前景剪影 + 顶部一道反光边） */
    '.cv7-wing{position:absolute;bottom:12%;width:38%;height:28%;',
    'background:linear-gradient(178deg,rgba(150,176,228,.62) 0%,rgba(22,30,52,.96) 9%,var(--cv7-wing,#101a30) 34%,#06050c 100%);',
    'box-shadow:0 -12px 30px rgba(2,2,8,.55)}',
    '.cv7-wing.l{left:-8%;transform:rotate(9deg);clip-path:polygon(0 100%,100% 46%,100% 100%)}',
    '.cv7-wing.r{right:-8%;transform:rotate(-9deg);clip-path:polygon(0 46%,100% 100%,0 100%)}',
    /* 机舱罩 + 机头 */
    '.cv7-cockpit{position:absolute;left:-5%;right:-5%;bottom:-3%;height:30%;',
    'border-radius:46% 46% 0 0/36% 36% 0 0;background:linear-gradient(180deg,rgba(34,38,62,.97),#0a0912 54%,#07060d 100%);',
    'box-shadow:0 -22px 48px rgba(2,2,8,.62),inset 0 3px 0 rgba(196,214,248,.42),inset 0 14px 30px rgba(120,150,210,.12)}',
    '.cv7-nose{position:absolute;left:50%;bottom:24%;width:32%;height:58%;transform:translateX(-50%);',
    'background:linear-gradient(180deg,#3a3f5e 0%,#222741 34%,#0c0b16 100%);',
    'clip-path:polygon(14% 0,86% 0,100% 100%,0 100%);border-radius:30% 30% 0 0;',
    'box-shadow:inset 0 0 0 1px rgba(190,210,250,.26),inset 0 10px 22px rgba(120,150,210,.18)}',
    '.cv7-nose:after{content:"";position:absolute;left:50%;top:8%;width:2px;height:72%;transform:translateX(-50%);',
    'background:linear-gradient(180deg,rgba(210,226,255,.55),rgba(210,226,255,0))}',
    '.cv7-instr{position:absolute;left:50%;bottom:47%;width:150px;height:44px;transform:translateX(-50%);',
    'display:flex;align-items:center;justify-content:center;gap:9px}',
    '.cv7-instr i{width:14px;height:14px;border-radius:50%;background:rgba(243,192,119,.16);',
    'box-shadow:inset 0 0 0 1px rgba(243,192,119,.55),0 0 12px rgba(243,192,119,.28)}',
    '.cv7-instr i:first-child{background:var(--cv7-instrument,#F3C077);box-shadow:0 0 16px rgba(243,192,119,.8)}',
    '.cv7-instr b{width:40px;height:5px;border-radius:3px;background:rgba(143,166,232,.55);box-shadow:0 0 10px rgba(143,166,232,.45)}',
    /* 暗角 */
    '.cv7-vignette{position:absolute;inset:0;',
    'background:radial-gradient(120% 84% at 50% 44%,transparent 48%,rgba(3,2,8,.42) 82%,rgba(3,2,8,.72) 100%)}',

    /* 快进按钮：唯一可点元素；动画中才出现，不压住棋盘点击 */
    '.cv7-skip{position:absolute;right:12px;top:41%;z-index:26;min-width:44px;min-height:44px;padding:0 12px;',
    'border-radius:999px;border:1px solid rgba(243,192,119,.3);background:rgba(12,9,24,.74);',
    'color:#F0D6B4;font-family:inherit;font-size:12px;letter-spacing:.08em;cursor:pointer;',
    'opacity:0;pointer-events:none;transition:opacity .16s ease}',
    '.cv7-skip.on{opacity:1;pointer-events:auto}',
    '.cv7-skip:active{transform:scale(.96)}',

    /* reduced：不动 transform，也不跑 CSS 动画 */
    '[data-cinema-reduced="1"] .cv7-pov,[data-cinema-reduced="1"] .cv7-glow,[data-cinema-reduced="1"] .cv7-dust,',
    '[data-cinema-reduced="1"] .cv7-ripple{animation:none!important;transition:opacity .12s linear}',
    /* 页面隐藏：镜头/前景/舱内所有 CSS 动画与 transition 一起冻结（不 finalize 阶段） */
    '.cv7.is-paused,.cv7.is-paused *{animation-play-state:paused!important;transition:none!important}',
    '[data-cinema-paused="1"],[data-cinema-paused="1"] *,[data-cinema-paused="1"] *:before,[data-cinema-paused="1"] *:after{',
    'animation-play-state:paused!important;transition:none!important}',
    '@media (prefers-reduced-motion: reduce){.cv7 *{animation:none!important}}'
  ].join('');

  function injectCss() {
    try {
      if (App.UI && typeof App.UI.injectStyle === 'function') { App.UI.injectStyle('v7-cinema', CSS); return; }
    } catch (e) {}
    if (doc.getElementById && doc.getElementById('style-v7-cinema')) return;
    var tag = doc.createElement('style');
    tag.id = 'style-v7-cinema';
    tag.textContent = CSS;
    (doc.head || doc.documentElement).appendChild(tag);
  }

  /* ---------- 状态 ---------- */
  function createState(host, opts) {
    opts = opts || {};
    return {
      mounted: false, version: VERSION,
      host: host, root: null, boardEl: opts.boardEl || null, cabinHost: opts.cabinHost || null,
      reduced: !!opts.reduced, sound: opts.sound !== false,
      theme: normalizeTheme(opts.theme),
      onSkip: typeof opts.onSkip === 'function' ? opts.onSkip : null,
      state: 'idle', chain: [], targetSquare: '', targetDir: { x: 0, y: 0 },
      skipAll: false,
      pos: pose(0, 0, 1, 0, 0),
      from: null, to: null, anim: null, raf: 0, shake: null,
      phaseTimer: 0, phaseEndsAt: 0, phaseRemain: null, impactTimer: 0, pending: null,
      paused: false, pauseAt: 0, pausedAnims: [],
      prevBoard: null,
      el: {}, skipBtn: null, onVis: null,
      stats: { phases: 0, skipped: 0, lastMs: 0, log: [] }
    };
  }

  function normalizeTheme(theme) {
    var id = '';
    if (theme && typeof theme === 'object') id = theme.id || theme.name || '';
    else if (typeof theme === 'string') id = theme;
    if (App.Themes && typeof App.Themes.get === 'function') {
      try {
        var t = App.Themes.get(id || undefined);
        if (t && t.id) id = t.id;
      } catch (e) {}
    }
    id = String(id || 'cloud');
    return THEMES[id] ? id : 'cloud';
  }

  /* ---------- DOM ---------- */
  function buildDom() {
    var host = S.host;
    var root = el('div', 'cv7');
    root.setAttribute('data-test', 'cinema');
    root.setAttribute('aria-hidden', 'true');
    root.setAttribute('data-cinema-version', VERSION);

    root.innerHTML =
      '<div class="cv7-scrim"></div>' +
      '<div class="cv7-glow" data-test="cinema-glow"></div>' +
      '<div class="cv7-land"><i class="cv7-dust" data-test="cinema-dust"></i>' +
        '<i class="cv7-ripple" data-test="cinema-ripple"></i></div>' +
      '<div class="cv7-pov" data-test="cinema-pov">' +
        '<div class="cv7-clouds"><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="cv7-speed"></div>' +
        '<div class="cv7-wing l"></div>' +
        '<div class="cv7-wing r"></div>' +
        '<div class="cv7-cockpit"><div class="cv7-nose"></div>' +
          '<div class="cv7-instr"><i></i><i></i><i></i><b></b></div></div>' +
        '<div class="cv7-vignette"></div>' +
      '</div>';

    host.appendChild(root);
    S.root = root;
    S.el = {
      scrim: root.querySelector('.cv7-scrim'),
      glow: root.querySelector('.cv7-glow'),
      land: root.querySelector('.cv7-land'),
      dust: root.querySelector('.cv7-dust'),
      ripple: root.querySelector('.cv7-ripple'),
      pov: root.querySelector('.cv7-pov'),
      clouds: root.querySelector('.cv7-clouds')
    };

    /* 快进按钮独立挂在 host 上：z-index 26 才能盖过 HUD(z2)，且不吃棋盘点击 */
    var btn = el('button', 'cv7-skip');
    btn.type = 'button';
    btn.setAttribute('data-test', 'cinema-skip');
    btn.setAttribute('aria-label', '快进这段镜头');
    btn.textContent = '快进';
    btn.addEventListener('click', function (e) {
      if (e && e.preventDefault) e.preventDefault();
      if (e && e.stopPropagation) e.stopPropagation();
      skip();
    });
    host.appendChild(btn);
    S.skipBtn = btn;
  }

  /* ---------- 主题 / reduced / sound ---------- */
  function palette() {
    return THEMES[S.theme] || THEMES.cloud;
  }
  function applyThemeVars() {
    if (!S || !S.host) return;
    var p = palette();
    var st = S.host.style;
    st.setProperty('--cv7-accent', p.accent);
    st.setProperty('--cv7-accent-soft', p.accentSoft);
    st.setProperty('--cv7-sky', p.sky);
    st.setProperty('--cv7-wing', p.wing);
    st.setProperty('--cv7-instrument', p.instrument);
    S.host.setAttribute('data-cinema-theme', S.theme);
  }
  function setTheme(theme) {
    if (!S) return;
    S.theme = normalizeTheme(theme);
    applyThemeVars();
  }
  function setReduced(flag) {
    if (!S) return;
    S.reduced = !!flag;
    if (S.root) S.root.setAttribute('data-cinema-reduced', S.reduced ? '1' : '0');
    if (S.host) S.host.setAttribute('data-cinema-reduced', S.reduced ? '1' : '0');
    if (S.reduced) {
      /* 立刻收束：不跑 rAF、不写 transform、POV 前景收起 */
      S.skipAll = false;
      clearPausedState();
      cancelAnim();
      clearImpact();
      if (S.pending) finishPending(true);
      if (S.el.pov) S.el.pov.classList.remove('on');
      if (S.el.glow) S.el.glow.classList.remove('on');
      if (S.el.scrim) S.el.scrim.classList.remove('on');
      setSkipVisible(false);
      resetPose(true);
    } else {
      applyThemeVars();
    }
  }
  function setSound(flag) { if (S) S.sound = flag !== false; }

  /* ---------- 镜头 pose ---------- */
  function boardBox() {
    if (!S || !S.boardEl) return { left: 0, top: 0, width: 390, height: 406 };
    var b = S.boardEl;
    var prev = b.style.transform;
    var box;
    try {
      b.style.transform = 'none';
      var br = b.getBoundingClientRect();
      var hr = S.host.getBoundingClientRect();
      box = {
        left: br.left - hr.left, top: br.top - hr.top,
        width: br.width || 390, height: br.height || 406
      };
    } catch (e) {
      box = { left: 0, top: 0, width: 390, height: 406 };
    }
    try { b.style.transform = prev; } catch (e) {}
    return box;
  }

  function squareCenter(id) {
    if (!S || !S.boardEl || !id) return null;
    var target = null;
    try {
      target = S.boardEl.querySelector('[data-square="' + String(id).replace(/"/g, '\\"') + '"]');
    } catch (e) { target = null; }
    if (!target || !target.getBoundingClientRect) return null;
    var b = S.boardEl;
    var prev = b.style.transform;
    try {
      b.style.transform = 'none';
      var br = target.getBoundingClientRect();
      var hr = S.host.getBoundingClientRect();
      return {
        x: br.left + br.width / 2 - hr.left,
        y: br.top + br.height / 2 - hr.top,
        w: br.width || 0
      };
    } catch (e) {
      return null;
    } finally {
      try { b.style.transform = prev; } catch (e2) {}
    }
  }

  function squareDir(id) {
    var c = squareCenter(id);
    var box = boardBox();
    if (!c || !box.width) return { x: 0, y: 0 };
    var dx = (c.x - (box.left + box.width / 2)) / Math.max(1, box.width / 2);
    var dy = (c.y - (box.top + box.height / 2)) / Math.max(1, box.height / 2);
    var len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1) { dx /= len; dy /= len; }
    return { x: dx, y: dy };
  }

  function endpointOf(events) {
    var list = Array.isArray(events) ? events : [];
    var last = '';
    for (var i = 0; i < list.length; i++) {
      var ev = list[i];
      if (!ev || typeof ev !== 'object') continue;
      var path = ev.path || [];
      if (ev.type === 'takeoff' || ev.type === 'move') {
        if (path.length) last = path[path.length - 1];
      } else if (ev.type === 'jump' || ev.type === 'fly') {
        last = ev.to || ev.from || last;
      } else if (ev.type === 'stack' && ev.at) {
        last = ev.at;
      }
    }
    return last;
  }

  function rollPose() {
    var b = boardBox();
    return pose(0, -Math.round(b.height * 0.006), 1.025, 0, 0);
  }
  function povPose() {
    var b = boardBox();
    return pose(0, Math.round(b.height * 0.052), 1.13, -2.4, 21);
  }
  function chasePose(dir) {
    var b = boardBox();
    dir = dir || { x: 0, y: 0 };
    return pose(
      -dir.x * Math.min(86, b.width * 0.2),
      -dir.y * Math.min(68, b.height * 0.175),
      1.095, dir.x * 2.2, -4.2
    );
  }
  function landPose(dir) {
    var b = boardBox();
    dir = dir || { x: 0, y: 0 };
    return pose(
      -dir.x * Math.min(108, b.width * 0.245),
      -dir.y * Math.min(86, b.height * 0.215),
      1.115, dir.x * 1.8, 0
    );
  }
  function zeroPose() { return pose(0, 0, 1, 0, 0); }

  function transformOf(p) {
    var tr = 'translate3d(' + r2(p.x) + 'px,' + r2(p.y) + 'px,0) scale(' + p.s.toFixed(4) + ') rotate(' + r2(p.rz) + 'deg)';
    if (Math.abs(p.rx) > 0.01) tr = 'perspective(1000px) ' + tr + ' rotateX(' + r2(p.rx) + 'deg)';
    return tr;
  }

  function writePose(p) {
    if (!S || !S.boardEl || S.reduced) return;
    var tr = transformOf(p);
    if (S.boardEl.style.transform !== tr) S.boardEl.style.transform = tr;
    if (S.boardEl.style.willChange !== 'transform') S.boardEl.style.willChange = 'transform';
    try {
      S.host.style.setProperty('--cv7-cam-x', r2(p.x) + 'px');
      S.host.style.setProperty('--cv7-cam-y', r2(p.y) + 'px');
      S.host.style.setProperty('--cv7-cam-s', p.s.toFixed(4));
    } catch (e) {}
  }

  function shakeOffset(t) {
    if (!S.shake) return { x: 0, y: 0, rz: 0 };
    var sp = clamp((t - S.shake.t0) / Math.max(16, S.shake.ms), 0, 1);
    if (sp >= 1) { S.shake = null; return { x: 0, y: 0, rz: 0 }; }
    var k = (1 - sp) * (1 - sp);
    return {
      x: (Math.sin(t * 0.113) * S.shake.amp + Math.sin(t * 0.271) * S.shake.amp * 0.5) * k,
      y: (Math.cos(t * 0.157) * S.shake.amp * 0.8 + Math.cos(t * 0.337) * S.shake.amp * 0.35) * k,
      rz: Math.sin(t * 0.19) * S.shake.rot * k
    };
  }

  function tick(ts) {
    if (!S || !S.mounted) return;
    S.raf = 0;
    var t = ts || nowMs();
    var p = clonePose(S.pos);
    if (S.anim) {
      var sp = clamp((t - S.anim.t0) / Math.max(16, S.anim.ms), 0, 1);
      var eased = S.anim.ease ? S.anim.ease(sp) : easeInOut(sp);
      p = lerpPose(S.anim.from, S.anim.to, eased);
      if (sp >= 1) {
        p = clonePose(S.anim.to);
        S.anim = null;
      }
    }
    S.pos = clonePose(p);
    var sh = shakeOffset(t);
    var out = { x: p.x + sh.x, y: p.y + sh.y, s: p.s, rz: p.rz + sh.rz, rx: p.rx };
    writePose(out);
    if (S.anim || S.shake) S.raf = RAF(tick);
  }

  function startRaf() {
    if (!S || S.reduced || S.paused || S.raf) return;
    S.raf = RAF(tick);
  }
  function cancelAnim() {
    if (!S) return;
    if (S.raf) { CAF(S.raf); S.raf = 0; }
    S.anim = null;
  }
  /* 页面隐藏：镜头/舱内所有 CSS/WAAPI 动画也显式 pause（QA 会数 getAnimations） */
  function pauseAllAnimations() {
    if (!S || !S.host || !S.host.getAnimations) return;
    S.pausedAnims = [];
    try {
      var list = S.host.getAnimations({ subtree: true }) || [];
      for (var i = 0; i < list.length; i++) {
        var a = list[i];
        try {
          if (a.playState === 'running' || a.playState === 'pending') {
            a.pause();
            S.pausedAnims.push(a);
          }
        } catch (e) {}
      }
    } catch (e2) {}
  }
  function resumeAllAnimations() {
    if (!S) return;
    var list = S.pausedAnims || [];
    S.pausedAnims = [];
    for (var i = 0; i < list.length; i++) {
      try { list[i].play(); } catch (e) {}
    }
  }
  /* 页面隐藏：冻结当前 pose / rAF / 阶段计时，绝不 finalize pending。
   * 恢复后从冻结进度继续；table 的编排也因为 pending 未 resolve 而不会启动下一段。 */
  function freezeForHidden() {
    if (!S || S.paused) return;
    pauseAllAnimations();
    S.paused = true;
    S.pauseAt = nowMs();
    if (S.raf) { CAF(S.raf); S.raf = 0; }
    S.phaseRemain = null;
    if (S.phaseTimer) {
      S.phaseRemain = Math.max(0, (S.phaseEndsAt || S.pauseAt) - S.pauseAt);
      global.clearTimeout(S.phaseTimer);
      S.phaseTimer = 0;
    }
    S.phaseEndsAt = 0;
    if (S.impactTimer) { global.clearTimeout(S.impactTimer); S.impactTimer = 0; }
    if (S.root) S.root.classList.add('is-paused');
    try { S.host.setAttribute('data-cinema-paused', '1'); } catch (e) {}
  }
  function resumeFromHidden() {
    if (!S || !S.paused) return;
    var delta = Math.max(0, nowMs() - S.pauseAt);
    S.paused = false;
    S.pauseAt = 0;
    if (S.anim) S.anim.t0 += delta;
    if (S.shake) S.shake.t0 += delta;
    if (S.pending && S.phaseRemain != null) armPhase(Math.max(16, S.phaseRemain));
    S.phaseRemain = null;
    if (S.root) S.root.classList.remove('is-paused');
    try { S.host.setAttribute('data-cinema-paused', '0'); } catch (e) {}
    resumeAllAnimations();
    if (S.anim || S.shake) startRaf();
  }
  function clearPausedState() {
    if (!S) return;
    S.paused = false;
    S.pauseAt = 0;
    S.phaseRemain = null;
    S.pausedAnims = [];
    if (S.root) S.root.classList.remove('is-paused');
    try { S.host.setAttribute('data-cinema-paused', '0'); } catch (e) {}
  }
  function tweenTo(to, ms, ease) {
    if (!S || S.reduced) { if (S) S.pos = clonePose(to); return; }
    S.from = clonePose(S.pos);
    S.to = clonePose(to);
    S.anim = { from: S.from, to: S.to, t0: nowMs(), ms: Math.max(16, ms), ease: ease || easeOut };
    startRaf();
  }
  function setPoseNow(p) {
    if (!S) return;
    S.pos = clonePose(p);
    writePose(S.pos);
  }
  function resetPose(hard) {
    if (!S) return;
    cancelAnim();
    S.shake = null;
    S.pos = zeroPose();
    if (S.boardEl) {
      /* reduced 与普通回俯瞰都不保留 transform */
      S.boardEl.style.transform = '';
      S.boardEl.style.willChange = '';
    }
    try {
      S.host.style.setProperty('--cv7-cam-x', '0px');
      S.host.style.setProperty('--cv7-cam-y', '0px');
      S.host.style.setProperty('--cv7-cam-s', '1');
    } catch (e) {}
  }

  function shake(amp, rot, ms) {
    if (!S || S.reduced) return;
    S.shake = { t0: nowMs(), ms: ms || 300, amp: amp || 4, rot: rot || 0.35 };
    startRaf();
  }

  /* ---------- 阶段机 ---------- */
  function setState(name) {
    if (!S || !S.root) return;
    S.state = name;
    S.chain.push(name);
    if (S.chain.length > 40) S.chain.shift();
    try {
      S.host.setAttribute('data-cinema-state', name);
      S.root.setAttribute('data-cinema-state', name);
    } catch (e) {}
  }

  function setSkipVisible(on) {
    if (!S) return;
    if (S.skipBtn) S.skipBtn.classList.toggle('on', !!on && !S.reduced && S.state !== 'overview');
    try { S.host.setAttribute('data-cinema-skip', (on && !S.reduced) ? '1' : '0'); } catch (e) {}
  }

  function clearPhaseTimer() {
    if (!S) return;
    if (S.phaseTimer) { global.clearTimeout(S.phaseTimer); S.phaseTimer = 0; }
    S.phaseEndsAt = 0;
    S.phaseRemain = null;
  }
  function clearImpact() {
    if (S && S.impactTimer) { global.clearTimeout(S.impactTimer); S.impactTimer = 0; }
  }
  /* 阶段计时的唯一入口：记录 deadline，隐藏时才能算出剩余时间 */
  function armPhase(ms) {
    if (!S) return;
    if (S.phaseTimer) { global.clearTimeout(S.phaseTimer); S.phaseTimer = 0; }
    ms = Math.max(0, Number(ms) || 0);
    S.phaseRemain = null;
    S.phaseEndsAt = nowMs() + ms;
    S.phaseTimer = global.setTimeout(onPhaseTimeout, ms);
  }
  function onPhaseTimeout() {
    if (!S || !S.pending) return;
    /* 计时器到点时页面仍隐藏（visibilitychange 没赶上）：冻结，恢复后补完 */
    if (doc.hidden) { S.phaseEndsAt = nowMs(); freezeForHidden(); return; }
    var p = S.pending;
    try { if (p.final) p.final(); } catch (e) {}
    finishPending(false);
  }

  function finishPending(skipped) {
    if (!S || !S.pending) return;
    var p = S.pending;
    S.pending = null;
    clearPhaseTimer();
    setSkipVisible(false);
    S.stats.phases++;
    S.stats.lastMs = Math.round(nowMs() - p.t0);
    S.stats.log.push({ name: p.state, ms: S.stats.lastMs, skipped: !!skipped });
    if (S.stats.log.length > 40) S.stats.log.shift();
    try { p.resolve({ state: p.state, skipped: !!skipped, ms: S.stats.lastMs }); } catch (e) {}
  }

  function beginPhase(name, ms, opts) {
    opts = opts || {};
    if (!S || !S.mounted) return Promise.resolve(null);
    /* 上一个阶段还没结束：直接收束它的终态，绝不悬挂 Promise */
    if (S.pending) {
      var prev = S.pending;
      S.pending = null;
      clearPhaseTimer();
      try { if (prev.final) prev.final(); } catch (e) {}
      try { prev.resolve({ state: prev.state, skipped: true, superseded: true }); } catch (e2) {}
    }
    cancelAnim();
    setState(name);
    var p = new Promise(function (resolve) {
      S.pending = { resolve: resolve, final: opts.final || null, state: name, t0: nowMs() };
    });
    /* 快进已按下：后续每个阶段直接到终态（只留 ~130ms 让终态可见），直到回俯瞰 */
    if (S.skipAll && name !== 'overview') {
      if (opts.onStart) { try { opts.onStart(); } catch (e0) {} }
      try { if (opts.final) opts.final(); } catch (e1) {}
      setSkipVisible(false);
      armPhase(130);
      return p;
    }
    if (opts.animate && !S.reduced) tweenTo(opts.animate.to, opts.animate.ms, opts.animate.ease);
    else if (opts.hold && !S.reduced) setPoseNow(opts.hold);
    setSkipVisible(true);
    if (opts.onStart) { try { opts.onStart(); } catch (e) {} }
    if (ms > 0) {
      armPhase(ms);
    } else {
      try { if (opts.final) opts.final(); } catch (e3) {}
      finishPending(false);
    }
    return p;
  }

  /* ---------- 公共镜头方法 ---------- */
  function overview(opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    S.skipAll = false;
    setSkipVisible(false);
    if (S.reduced) {
      resetPose(true);
      setState('overview');
      return Promise.resolve({ state: 'overview', reduced: true });
    }
    if (S.state === 'overview' && !S.pending) return Promise.resolve({ state: 'overview' });
    if (S.el.glow) S.el.glow.classList.remove('on');
    if (S.el.scrim) S.el.scrim.classList.remove('on');
    if (S.el.pov) S.el.pov.classList.remove('on');
    return beginPhase('overview', opts.ms == null ? 320 : opts.ms, {
      final: function () { resetPose(); },
      animate: { to: zeroPose(), ms: opts.ms == null ? 300 : opts.ms }
    });
  }

  function roll(events, opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    if (S.reduced) {
      resetPose(true);
      return beginPhase('roll', REDUCED_MS, { final: function () {} });
    }
    var to = rollPose();
    var p = beginPhase('roll', opts.ms == null ? ROLL_MS : opts.ms, {
      final: function () { setPoseNow(to); },
      animate: { to: to, ms: 260 },
      onStart: function () { sfx('diceShake'); }
    });
    /* 骰子落桌那一下：极轻震动（reduced 不注册） */
    clearImpact();
    S.impactTimer = global.setTimeout(function () {
      S.impactTimer = 0;
      if (!S || !S.pending || S.reduced) return;
      shake(2.2, 0.18, 180);
    }, 560);
    return p;
  }

  function pov(opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    if (S.reduced) return Promise.resolve({ state: S.state, skipped: true, reduced: true });
    if (S.el.pov) S.el.pov.classList.add('on');    if (S.el.scrim) S.el.scrim.classList.remove('on');
    var to = povPose();
    return beginPhase('pov', opts.ms == null ? POV_MS : opts.ms, {
      final: function () { setPoseNow(to); },
      animate: { to: to, ms: 300 },
      onStart: function () { sfx('fly'); }
    });
  }

  function chaseMs(events) {
    var len = 0;
    (Array.isArray(events) ? events : []).forEach(function (ev) {
      if (!ev) return;
      if (ev.path) len += ev.path.length;
      if (ev.type === 'jump' || ev.type === 'fly') len += 3;
    });
    return clamp(1420 + len * 26, 1500, 2300);
  }

  function chase(events, opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    if (S.reduced) return Promise.resolve({ state: S.state, skipped: true, reduced: true });
    var end = endpointOf(events) || S.targetSquare;
    if (end) {
      S.targetSquare = end;
      S.targetDir = squareDir(end);
      var c = squareCenter(end);
      if (c) {
        try {
          S.host.style.setProperty('--cv7-tx', r2(c.x) + 'px');
          S.host.style.setProperty('--cv7-ty', r2(c.y) + 'px');
        } catch (e) {}
      }
      if (S.el.glow) S.el.glow.classList.add('on');
    }
    if (S.el.pov) S.el.pov.classList.remove('on');
    if (S.el.scrim) S.el.scrim.classList.remove('on');
    var to = chasePose(S.targetDir);
    var ms = opts.ms == null ? chaseMs(events) : opts.ms;
    return beginPhase('chase', ms, {
      final: function () { setPoseNow(to); },
      animate: { to: to, ms: Math.max(300, ms - 120), ease: easeInOut },
      onStart: function () { sfx('takeoff'); }
    });
  }

  function pulseLand(sq) {
    if (!S || S.reduced) return;
    var c = squareCenter(sq) || null;
    if (c) {
      try {
        S.host.style.setProperty('--cv7-tx', r2(c.x) + 'px');
        S.host.style.setProperty('--cv7-ty', r2(c.y) + 'px');
      } catch (e) {}
    }
    [S.el.dust, S.el.ripple].forEach(function (node) {
      if (!node) return;
      node.classList.remove('on');
      void node.offsetWidth;
      node.classList.add('on');
    });
    global.setTimeout(function () {
      if (!S) return;
      if (S.el.dust) S.el.dust.classList.remove('on');
      if (S.el.ripple) S.el.ripple.classList.remove('on');
    }, 760);
  }

  function land(events, opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    var end = endpointOf(events) || S.targetSquare;
    if (end) {
      S.targetSquare = end;
      S.targetDir = squareDir(end);
    }
    if (S.reduced) {
      if (S.el.glow && S.targetSquare) S.el.glow.classList.add('on');
      return beginPhase('land', REDUCED_MS, {
        final: function () { if (S.el.glow) S.el.glow.classList.remove('on'); }
      });
    }
    pulseLand(end);
    if (!S.skipAll) shake(4.5, 0.42, 260);   /* 快进到终态时不再补震动 */
    sfx('diceLand');
    var to = landPose(S.targetDir);
    return beginPhase('land', opts.ms == null ? LAND_MS : opts.ms, {
      final: function () { setPoseNow(to); },
      animate: { to: to, ms: 360 }
    });
  }

  function returnToOverview(opts) {
    if (!S || !S.mounted) return Promise.resolve(null);
    opts = opts || {};
    var ms = opts.ms == null ? RETURN_MS : opts.ms;
    if (S.el.scrim) S.el.scrim.classList.remove('on');
    if (S.el.pov) S.el.pov.classList.remove('on');
    if (S.el.glow) S.el.glow.classList.remove('on');
    if (S.reduced) {
      resetPose(true);
      return delay(REDUCED_MS).then(function () {
        S.skipAll = false;
        setState('overview');
        return { state: 'return', reduced: true };
      });
    }
    return beginPhase('return', ms, {
      final: function () { resetPose(); },
      animate: { to: zeroPose(), ms: Math.max(300, ms - 80), ease: easeInOut }
    }).then(function (res) {
      S.skipAll = false;
      setState('overview');
      return res;
    });
  }

  /* 45° 格子舞台 / 小熊：Cinema 只负责状态链与棋盘压暗；舞台本体由 CellStage 画 */
  function stage(name, opts) {
    if (!S || !S.mounted) return;
    name = String(name || '');
    if (name !== 'cell45' && name !== 'bear') return;
    opts = opts || {};
    if (S.el.glow) S.el.glow.classList.add('on');
    if (S.el.scrim) S.el.scrim.classList.add('on');
    setState(name);
    /* cell45 保持棋盘压暗；bear 时目标格/小熊继续亮着（stage 由 CellStage 画） */
    if (name === 'bear' && S.el.glow) S.el.glow.classList.add('on');
  }

  function skip() {
    if (!S || !S.pending) return false;
    S.skipAll = true;
    var p = S.pending;
    S.pending = null;
    clearPhaseTimer();
    cancelAnim();
    try { if (p.final) p.final(); } catch (e) {}
    S.stats.phases++;
    S.stats.skipped++;
    S.stats.lastMs = Math.round(nowMs() - p.t0);
    S.stats.log.push({ name: p.state, ms: S.stats.lastMs, skipped: true });
    if (S.stats.log.length > 40) S.stats.log.shift();
    setSkipVisible(false);
    try { p.resolve({ state: p.state, skipped: true, ms: S.stats.lastMs }); } catch (e2) {}
    /* 让 board 也立刻到终态（BoardView 的 abort 由主桌处理；这里只通知） */
    if (S.onSkip) {
      try { S.onSkip(p.state); } catch (e3) {}
    }
    return true;
  }

  /* ---------- 生命周期 ---------- */
  function mount(host, opts) {
    opts = opts || {};
    try {
      if (!host || host.nodeType !== 1) return null;
      if (S && S.mounted) unmount();
      injectCss();
      S = createState(host, opts);
      if (S.boardEl) {
        S.prevBoard = {
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
      applyThemeVars();
      S.root.setAttribute('data-cinema-reduced', S.reduced ? '1' : '0');
      host.setAttribute('data-cinema-reduced', S.reduced ? '1' : '0');
      host.setAttribute('data-cinema-version', VERSION);
      host.setAttribute('data-cinema-skip', '0');
      host.setAttribute('data-cinema-paused', '0');
      setState('overview');
      if (doc.addEventListener) {
        S.onVis = function () {
          if (!S || !S.mounted) return;
          /* 隐藏 = 冻结（保留 pose / pending / 阶段计时），可见 = 从冻结处继续。
           * 绝不在这里 finalize：否则 table 会在用户看不见时启动下一段镜头。 */
          if (doc.hidden) freezeForHidden();
          else resumeFromHidden();
        };
        doc.addEventListener('visibilitychange', S.onVis);
      }
      return {
        version: VERSION,
        host: host,
        root: S.root,
        boardEl: S.boardEl,
        mount: mount,
        unmount: unmount,
        overview: overview,
        roll: roll,
        pov: pov,
        chase: chase,
        land: land,
        returnToOverview: returnToOverview,
        stage: stage,
        setTheme: setTheme,
        setReduced: setReduced,
        setSound: setSound,
        skip: skip,
        _debug: debugState
      };
    } catch (e) {
      try {
        if (S && S.root && S.root.parentNode) S.root.parentNode.removeChild(S.root);
        if (S && S.skipBtn && S.skipBtn.parentNode) S.skipBtn.parentNode.removeChild(S.skipBtn);
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
      if (st.pending) {
        var p = st.pending;
        st.pending = null;
        try { p.resolve({ state: p.state, unmounted: true, skipped: true }); } catch (e) {}
      }
      clearPhaseTimer();
      clearImpact();
      cancelAnim();
      clearPausedState();
      if (st.shake) st.shake = null;
      if (doc.removeEventListener && st.onVis) doc.removeEventListener('visibilitychange', st.onVis);
      if (st.boardEl && st.prevBoard) {
        st.boardEl.style.transform = st.prevBoard.transform;
        st.boardEl.style.willChange = st.prevBoard.willChange;
        st.boardEl.style.transformOrigin = st.prevBoard.transformOrigin;
        st.boardEl.style.backfaceVisibility = st.prevBoard.backface;
      }
      if (st.root && st.root.parentNode) st.root.parentNode.removeChild(st.root);
      if (st.skipBtn && st.skipBtn.parentNode) st.skipBtn.parentNode.removeChild(st.skipBtn);
      if (st.host) {
        st.host.removeAttribute('data-cinema-state');
        st.host.removeAttribute('data-cinema-version');
        st.host.removeAttribute('data-cinema-reduced');
        st.host.removeAttribute('data-cinema-theme');
        st.host.removeAttribute('data-cinema-skip');
        st.host.removeAttribute('data-cinema-paused');
        try {
          st.host.style.removeProperty('--cv7-cam-x');
          st.host.style.removeProperty('--cv7-cam-y');
          st.host.style.removeProperty('--cv7-cam-s');
          st.host.style.removeProperty('--cv7-tx');
          st.host.style.removeProperty('--cv7-ty');
        } catch (e2) {}
      }
    } catch (e) {
      /* 卸载失败也要保持可再次 mount */
    }
    S = null;
  }

  function debugState() {
    if (!S) return null;
    return {
      version: VERSION,
      mounted: !!S.mounted,
      state: S.state,
      chain: S.chain.slice(),
      reduced: !!S.reduced,
      theme: S.theme,
      targetSquare: S.targetSquare,
      dir: { x: r2(S.targetDir.x), y: r2(S.targetDir.y) },
      pose: { x: r2(S.pos.x), y: r2(S.pos.y), s: +S.pos.s.toFixed(3), rz: r2(S.pos.rz), rx: r2(S.pos.rx) },
      boardTransform: S.boardEl ? S.boardEl.style.transform : '',
      camVars: {
        x: S.host ? S.host.style.getPropertyValue('--cv7-cam-x') : '',
        y: S.host ? S.host.style.getPropertyValue('--cv7-cam-y') : '',
        s: S.host ? S.host.style.getPropertyValue('--cv7-cam-s') : ''
      },
      raf: !!S.raf,
      paused: !!S.paused,
      phaseTimer: !!S.phaseTimer,
      phaseRemain: S.phaseRemain,
      animating: !!S.anim && !S.paused,
      pausedAnims: (S.pausedAnims || []).length,
      shaking: !!S.shake,
      pending: !!S.pending,
      skipAll: !!S.skipAll,
      skipVisible: !!(S.skipBtn && S.skipBtn.classList.contains('on')),
      stats: { phases: S.stats.phases, skipped: S.stats.skipped, lastMs: S.stats.lastMs, log: S.stats.log.slice() },
      host: {
        state: S.host ? S.host.getAttribute('data-cinema-state') : '',
        reduced: S.host ? S.host.getAttribute('data-cinema-reduced') : '',
        theme: S.host ? S.host.getAttribute('data-cinema-theme') : '',
        skip: S.host ? S.host.getAttribute('data-cinema-skip') : ''
      }
    };
  }

  App.Cinema = {
    version: VERSION,
    mount: mount,
    unmount: unmount,
    overview: overview,
    roll: roll,
    pov: pov,
    chase: chase,
    land: land,
    returnToOverview: returnToOverview,
    stage: stage,
    setTheme: setTheme,
    setReduced: setReduced,
    setSound: setSound,
    skip: skip,
    _debug: debugState
  };
})(typeof window !== 'undefined' ? window : this);

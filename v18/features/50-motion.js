/* ============================================================================
 * V18 · 50-motion —— 动效 / 反馈 / 手感增强（impl-motion）
 *
 * 只做「增量反馈」，不改任何玩法数值（数值归 60-pace）：
 *   A3  toast 队列：普通 lane 1.5s×最多 3 条；成就/解锁独立 lane（错开 400ms，可见 ≥1.6s）；
 *       位置移到顶部安全区（header 下方，动态避让 HUD / 底部抽屉）；180ms 淡出入。
 *   A5  window.v18OnHudSync(info)   —— HUD 数字变化（由 v12SyncHud 调用）：
 *       热度/金币浮字、金币飞行、连击牌脉冲、连击 ≥5/10 中央大字。
 *       window.v18HookTaskDone(info) —— 60-pace 结算末尾钩子（PLAN 跨片段接口）：
 *       阶段升级检测（以 heatStage() 变化为准，每阶段每晚一次）+ HUD 未同步时的浮字兜底。
 *       window.v18HookSkip(info)     —— 60-pace 跳过钩子：轻 shake + 灰色粒子。
 *   附加：`.modal .m-item` 依次 30ms stagger 入场（纯 CSS，无需覆写 openModal）。
 *
 * 纪律：ES5、无外部依赖；SET.fx / SET.sound / SET.quiet / reduce 全部尊重；
 *       覆盖 toast 时保留原调用契约（window.toast(msg) 文案不变）。
 * ========================================================================== */
(function () {
  'use strict';

  var M = window.__v18m = {
    toasts: [],        // {t, lane, msg, visible}
    normal: 0, ach: 0,
    floats: 0, coinFly: 0, comboPulse: 0, bigCombo: 0,
    stageUp: 0, lastStage: null,
    hudSync: 0, hookDone: 0, hookSkip: 0,
    errors: []
  };

  function now() { try { return performance.now(); } catch (e) { return Date.now(); } }
  function err(e) { try { M.errors.push(String(e)); if (M.errors.length > 20) M.errors.shift(); } catch (x) {} }
  function hasReduce() {
    try { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); } catch (e) { return false; }
  }
  function fxOff() { try { return !!(typeof SET !== 'undefined' && SET && SET.fx === 'off'); } catch (e) { return false; } }
  function motionBlocked() { return fxOff() || hasReduce(); }
  function soundOn() { try { return !!(typeof SET !== 'undefined' && SET && SET.sound && !SET.quiet); } catch (e) { return false; } }
  function todayKey() { try { return new Date().toDateString(); } catch (e) { return ''; } }

  /* ========================================================================
   * 0. 注入 CSS
   * ===================================================================== */
  function injectCss() {
    if (document.getElementById('v18MotionStyle')) return;
    var css = [
      /* ---- toast：顶部安全区双 lane ---- */
      '.toast.v18-toast{',
      '  position:fixed;left:50%;top:72px;bottom:auto;right:auto;transform:translateX(-50%);',
      '  min-width:88px;max-width:86vw;padding:11px 20px;border-radius:14px;',
      '  font-size:14px;font-weight:600;line-height:1.45;text-align:center;',
      '  color:#fff;background:linear-gradient(135deg,rgba(255,45,149,.97),rgba(139,92,246,.97));',
      '  border:1px solid rgba(255,255,255,.28);box-shadow:0 10px 34px rgba(10,4,24,.45);',
      '  z-index:240;display:none;pointer-events:none;animation:none;',
      '}',
      'body.light .toast.v18-toast,body.sketch .toast.v18-toast{color:#3a1128;border-color:rgba(214,69,110,.35)}',
      '.toast.v18-toast.v18-ach{',
      '  top:124px;z-index:241;color:#2a1200;',
      '  background:linear-gradient(135deg,rgba(255,209,102,.98),rgba(255,150,60,.97));',
      '  border-color:rgba(255,255,255,.55);box-shadow:0 10px 34px rgba(255,140,40,.35);',
      '}',
      '.toast.v18-toast .v18-t-x{display:inline-block;max-width:100%;overflow-wrap:break-word}',
      '.toast.v18-toast.v18-in{display:block;animation:v18ToastIn .18s ease both}',
      '.toast.v18-toast.v18-out{display:block;animation:v18ToastOut .18s ease both}',
      '@keyframes v18ToastIn{from{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.97)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}',
      '@keyframes v18ToastOut{from{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}to{opacity:0;transform:translateX(-50%) translateY(-8px) scale(.98)}}',

      /* ---- HUD：紧凑化 + 金币/连击 badge ---- */
      '.v12-hud.v18-hud{flex-wrap:nowrap;gap:6px;padding:6px 10px}',
      '.v12-hud.v18-hud .hud-item{gap:3px;min-width:0;font-size:9px;letter-spacing:0}',
      '.v12-hud.v18-hud .hud-item span{letter-spacing:0;font-size:9.5px;opacity:.9}',
      '.v12-hud.v18-hud .hud-badge{padding:2px 6px;font-size:9.5px;letter-spacing:0;white-space:nowrap;text-align:center}',
      '.v12-hud.v18-hud .hud-coin{color:var(--v12-g,#ffd166);border-color:rgba(255,209,102,.42);background:rgba(255,209,102,.09);min-width:47px}',
      '.v12-hud.v18-hud .hud-combo{color:#ff9ecb;border-color:rgba(255,45,149,.45);background:rgba(255,45,149,.10);min-width:44px}',
      '.v12-hud.v18-hud [data-v18="hud-mood"]{min-width:42px}',
      '.v12-hud.v18-hud .hud-combo.v18-hide-combo{display:none}',
      '.v12-hud.v18-hud .hud-combo.v18-pulse{animation:v18ComboPulse .42s cubic-bezier(.2,.8,.2,1)}',
      '.v12-hud.v18-hud .hud-coin.v18-pulse{animation:v18ComboPulse .42s cubic-bezier(.2,.8,.2,1)}',
      '@keyframes v18ComboPulse{0%{transform:scale(1)}38%{transform:scale(1.22)}100%{transform:scale(1)}}',

      /* ---- 浮字 ---- */
      '.v18-float{position:fixed;z-index:245;pointer-events:none;font-size:13px;font-weight:800;',
      '  color:#ffd166;text-shadow:0 1px 8px rgba(0,0,0,.6),0 0 18px rgba(255,209,102,.45);',
      '  animation:v18FloatUp .44s cubic-bezier(.2,.8,.2,1) forwards;white-space:nowrap}',
      '.v18-float.v18-float-coin{color:#ffe08a}',
      '@keyframes v18FloatUp{0%{opacity:0;transform:translateY(4px) scale(.9)}22%{opacity:1;transform:translateY(-2px) scale(1.06)}100%{opacity:0;transform:translateY(-16px) scale(1)}}',

      /* ---- 金币飞行 ---- */
      '.v18-coin{position:fixed;left:0;top:0;width:13px;height:13px;margin:-6px 0 0 -6px;border-radius:50%;',
      '  z-index:244;pointer-events:none;will-change:transform;',
      '  background:radial-gradient(circle at 34% 30%,#fff6c4 0%,#ffd166 42%,#e8a021 100%);',
      '  box-shadow:0 0 10px rgba(255,209,102,.75)}',

      /* ---- 阶段升级轻仪式 ---- */
      '#v18StageUp{position:fixed;inset:0;z-index:250;display:flex;align-items:center;justify-content:center;',
      '  pointer-events:none;background:radial-gradient(circle at 50% 44%,rgba(255,45,149,.30),rgba(139,92,246,.18) 40%,transparent 72%);',
      '  animation:v18StageGlow 2s ease-out forwards}',
      '#v18StageUp .v18-su-inner{text-align:center;position:relative;transform:translateY(-6%)}',
      '#v18StageUp .v18-su-ring{position:absolute;left:50%;top:50%;width:180px;height:180px;margin:-90px 0 0 -90px;',
      '  border-radius:50%;border:1px solid rgba(255,209,102,.65);animation:v18StageRing 1.6s cubic-bezier(.2,.8,.2,1) forwards}',
      '#v18StageUp .v18-su-name{font-size:30px;font-weight:900;letter-spacing:.02em;color:#fff;',
      '  text-shadow:0 0 26px rgba(255,45,149,.95),0 0 70px rgba(139,92,246,.7)}',
      '#v18StageUp .v18-su-sub{margin-top:8px;font-size:12px;letter-spacing:.32em;color:#ffd166;opacity:.95}',
      '@keyframes v18StageGlow{0%{opacity:0}12%{opacity:1}78%{opacity:1}100%{opacity:0}}',
      '@keyframes v18StageRing{0%{transform:scale(.35);opacity:0}22%{opacity:1}100%{transform:scale(1.7);opacity:0}}',

      /* ---- 连击 ≥5/10 中央大字（比默认 .v12-combo 更明显） ---- */
      '#v18ComboBig{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:243;pointer-events:none;',
      '  font-size:46px;font-weight:900;letter-spacing:.02em;white-space:nowrap;',
      '  color:#fff;text-shadow:0 0 30px rgba(255,45,149,1),0 0 90px rgba(139,92,246,.85);',
      '  animation:v18BigCombo 1.1s cubic-bezier(.2,.8,.2,1) forwards}',
      '@keyframes v18BigCombo{0%{opacity:0;transform:translate(-50%,-50%) scale(.5)}20%{opacity:1;transform:translate(-50%,-50%) scale(1.16)}62%{opacity:1;transform:translate(-50%,-56%) scale(1)}100%{opacity:0;transform:translate(-50%,-74%) scale(.96)}}',

      /* ---- 弹窗 .m-item 依次 30ms 入场（纯 CSS；v12CardIn 已有，这里只加延迟+backwards 防闪） ---- */
      '.modal .m-item{animation-fill-mode:backwards}',
      '.modal .m-item:nth-child(1){animation-delay:0ms}',
      '.modal .m-item:nth-child(2){animation-delay:30ms}',
      '.modal .m-item:nth-child(3){animation-delay:60ms}',
      '.modal .m-item:nth-child(4){animation-delay:90ms}',
      '.modal .m-item:nth-child(5){animation-delay:120ms}',
      '.modal .m-item:nth-child(6){animation-delay:150ms}',
      '.modal .m-item:nth-child(7){animation-delay:180ms}',
      '.modal .m-item:nth-child(8){animation-delay:210ms}',
      '.modal .m-item:nth-child(9){animation-delay:240ms}',
      '.modal .m-item:nth-child(10){animation-delay:270ms}',
      '.modal .m-item:nth-child(n+11){animation-delay:300ms}',

      /* ---- fx 档位：toast/浮字不依赖 backdrop-filter ---- */
      'body.fx-lite .toast.v18-toast,body.fx-off .toast.v18-toast{backdrop-filter:none;-webkit-backdrop-filter:none}',

      /* ---- 无障碍：reduce 下我们的 toast/浮字只保留极短过渡 ---- */
      '@media (prefers-reduced-motion: reduce){',
      '  .toast.v18-toast.v18-in,.toast.v18-toast.v18-out{animation-duration:1ms}',
      '  .v18-float{animation-duration:1ms}',
      '  .modal .m-item{animation-delay:0ms!important}',
      '}'
    ].join('');
    var style = document.createElement('style');
    style.id = 'v18MotionStyle';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  /* ========================================================================
   * A3. toast 队列（普通 lane + 成就 lane）
   * ===================================================================== */
  var NORMAL_DUR = 1500, EXIT_MS = 180, NORMAL_MAX_Q = 3, NORMAL_MAX_SHOW = 3;
  var ACH_DUR = 1600, ACH_STAGGER = 400;

  var normalQ = [], achQ = [];
  var normalCur = null, normalTimer = null;
  var achSlots = [null, null];   // 两个成就槽位：允许 400ms 错开的第二条同时可见

  function isAchMsg(msg) { return /🏅|成就|解锁/.test(String(msg || '')); }

  function baseTop() {
    var top = 72;
    try {
      var gp = document.getElementById('gamePage');
      if (gp && gp.classList.contains('active')) {
        var hud = document.getElementById('v12Hud');
        if (hud && hud.offsetHeight) top = Math.max(top, hud.getBoundingClientRect().bottom + 8);
        var sb = document.getElementById('v12StoryBar');
        if (sb && sb.style.display !== 'none' && sb.offsetHeight) top = Math.max(top, sb.getBoundingClientRect().bottom + 8);
      }
      var mask = document.getElementById('modalMask');
      if (mask && mask.classList.contains('show')) {
        var mb = document.getElementById('modalBox');
        if (mb) {
          var mtop = mb.getBoundingClientRect().top;
          var h = 46;
          if (top + h > mtop - 10) top = Math.max(64, mtop - h - 10);
        }
      }
    } catch (e) { err(e); }
    return Math.round(top);
  }

  function makeEl(id, extraCls) {
    var el = document.getElementById(id);
    if (el) {  /* 复用页面里已有的 #toast：必须补上 v18-toast，才能覆盖旧的居中 9999 样式 */
      try { el.classList.add('toast'); el.classList.add('v18-toast'); } catch (e) {}
      if (extraCls) { try { el.classList.add(extraCls); } catch (e) {} }
      return el;
    }
    el = document.createElement('div');
    el.id = id;
    el.className = 'toast v18-toast' + (extraCls ? ' ' + extraCls : '');
    document.body.appendChild(el);
    return el;
  }

  function placeAch(slot) {
    var st = achSlots[slot];
    if (!st || !st.el || st.el.style.display === 'none') return;
    var el = st.el;
    var top = baseTop() + 54;
    try {
      var nEl = document.getElementById('toast');
      if (nEl && nEl.style.display !== 'none') {
        var nb = nEl.getBoundingClientRect().bottom;
        if (nb > 0) top = Math.max(top, nb + 8);   // 成就 lane 永远在普通 toast 下方
      }
      if (slot === 1 && achSlots[0] && achSlots[0].el && achSlots[0].el.style.display !== 'none') {
        var pb = achSlots[0].el.getBoundingClientRect().bottom;
        if (pb > 0) top = Math.max(top, pb + 8);   // 第二条成就再往下错开
      }
      var mask = document.getElementById('modalMask');
      if (mask && mask.classList.contains('show')) {
        var mb = document.getElementById('modalBox');
        if (mb) {
          var mtop = mb.getBoundingClientRect().top;
          var h = el.offsetHeight || 46;
          if (top + h > mtop - 10) top = Math.max(64, mtop - h - 10);
        }
      }
    } catch (e) { err(e); }
    el.style.top = Math.round(top) + 'px';
  }

  function restackAch() { placeAch(0); placeAch(1); }

  function showToastEl(el, msg, lane, slot) {
    el.innerHTML = '<span class="v18-t-x"></span>';
    el.firstChild.textContent = String(msg == null ? '' : msg);
    el.style.display = 'block';
    el.classList.remove('v18-out');
    el.classList.add('v18-in');
    if (lane === 'ach') {
      placeAch(slot || 0);
    } else {
      el.style.top = baseTop() + 'px';
      restackAch();   // 普通 toast 出现后，把仍在下方的成就 lane 重新排到它下面，避免互相遮挡
    }
    M.toasts.push({ t: Math.round(now()), lane: lane === 'ach' ? 'ach' : 'normal', msg: String(msg || ''), visible: true });
    if (M.toasts.length > 40) M.toasts.shift();
  }

  function hideToastEl(el) {
    el.classList.remove('v18-in');
    el.classList.add('v18-out');
    return window.setTimeout(function () {
      try { el.style.display = 'none'; el.classList.remove('v18-out'); } catch (e) {}
    }, EXIT_MS);
  }

  function pumpNormal() {
    if (normalCur || !normalQ.length) return;
    normalCur = normalQ.shift();
    M.normal++;
    var el = makeEl('toast', '');
    el.classList.add('v18-normal-lane');
    showToastEl(el, normalCur, 'normal', 0);
    normalTimer = window.setTimeout(function () {
      if (el) hideToastEl(el);
      normalTimer = window.setTimeout(function () {
        normalCur = null; normalTimer = null; pumpNormal();
      }, EXIT_MS);
    }, NORMAL_DUR);
  }

  function pumpAch(delay) {
    if (!achQ.length) return;
    var slot = -1;
    if (!achSlots[0] || !achSlots[0].busy) slot = 0;
    else if (!achSlots[1] || !achSlots[1].busy) slot = 1;
    else return; // 两个成就槽都忙：消息留在队列里，等槽位释放自动续播
    if (!achSlots[slot]) {
      var el = makeEl('v18ToastAch' + (slot === 1 ? '2' : ''), 'v18-ach');
      achSlots[slot] = { el: el, busy: false };
    }
    var st = achSlots[slot];
    st.busy = true;              // 先占槽，避免 400ms 错开窗口内被第二条抢走
    var msg = achQ.shift();
    var wait = Math.max(0, delay || 0);
    window.setTimeout(function () {
      try {
        if (!st.el || !document.body.contains(st.el)) {
          st.el = makeEl('v18ToastAch' + (slot === 1 ? '2' : ''), 'v18-ach');
        }
        M.ach++;
        showToastEl(st.el, msg, 'ach', slot);
      } catch (e) { err(e); }
      window.setTimeout(function () {
        hideToastEl(st.el);
        window.setTimeout(function () {
          st.busy = false;
          pumpAch(ACH_STAGGER);
        }, EXIT_MS);
      }, ACH_DUR);
    }, wait);
  }

  /* 覆盖 window.toast：所有旧调用方（toast(msg)）无需改动 */
  var origToast = window.toast;
  window.toast = function (msg) {
    try {
      if (isAchMsg(msg)) {
        if (achQ.length >= 2) achQ.shift();
        achQ.push(String(msg == null ? '' : msg));
        // 与普通 lane 错开 400ms：让「✅ 完成」与「🏅 成就」都能看见
        var lastNormalAt = 0;
        for (var i = M.toasts.length - 1; i >= 0; i--) {
          if (M.toasts[i].lane === 'normal') { lastNormalAt = M.toasts[i].t; break; }
        }
        var gap = 0;
        try { gap = Math.max(0, ACH_STAGGER - (now() - lastNormalAt)); } catch (e) {}
        pumpAch(gap);
      } else {
        if (normalQ.length >= NORMAL_MAX_Q) normalQ.shift(); // 最多排 3 条，超出丢最旧
        normalQ.push(String(msg == null ? '' : msg));
        pumpNormal();
      }
    } catch (e) {
      err(e);
      try { if (typeof origToast === 'function') origToast.call(window, msg); } catch (x) {}
    }
  };

  /* ========================================================================
   * A5-1/2/4. HUD 变化 → 浮字 / 金币飞行 / 连击
   * ===================================================================== */
  var COIN_FLY_MIN = 5, COIN_FLY_MAX = 8;

  function hudEl(kind) {
    var sel = kind === 'coin' ? '[data-v18="hud-coin"]' : (kind === 'heat' ? '[data-v18="hud-heat"]' : '[data-v18="hud-combo"]');
    try { return document.querySelector(sel); } catch (e) { return null; }
  }

  function anchorRect(kind) {
    var el = hudEl(kind);
    if (el) return el.getBoundingClientRect();
    var hud = document.getElementById('v12Hud');
    if (hud) return hud.getBoundingClientRect();
    return { left: innerWidth - 120, right: innerWidth - 12, top: 96, bottom: 118, width: 100, height: 20 };
  }

  function floatText(txt, kind) {
    try {
      var r = anchorRect(kind);
      var d = document.createElement('div');
      d.className = 'v18-float' + (kind === 'coin' ? ' v18-float-coin' : '');
      d.setAttribute('data-v18', 'float');
      d.textContent = txt;
      var left = Math.min(innerWidth - 70, Math.max(8, r.left + r.width * 0.4));
      d.style.left = Math.round(left) + 'px';
      d.style.top = Math.round(r.bottom + 2) + 'px';
      document.body.appendChild(d);
      M.floats++;
      window.setTimeout(function () { try { d.remove(); } catch (e) {} }, 480);
    } catch (e) { err(e); }
  }

  function pulseEl(el) {
    if (!el) return;
    try {
      el.classList.remove('v18-pulse');
      void el.offsetWidth;
      el.classList.add('v18-pulse');
      window.setTimeout(function () { try { el.classList.remove('v18-pulse'); } catch (e) {} }, 460);
    } catch (e) {}
  }

  function pulseCombo() { pulseEl(hudEl('combo')); M.comboPulse++; }
  function pulseCoin() { pulseEl(hudEl('coin')); }

  function bigCombo(n) {
    if (motionBlocked()) return;
    try {
      var old = document.getElementById('v18ComboBig'); if (old) old.remove();
      var d = document.createElement('div');
      d.id = 'v18ComboBig';
      d.setAttribute('data-v18', 'combo-big');
      d.textContent = '🔥 连击 ×' + n;
      document.body.appendChild(d);
      M.bigCombo++;
      window.setTimeout(function () { try { d.remove(); } catch (e) {} }, 1160);
    } catch (e) { err(e); }
  }

  function coinFly(gain) {
    if (motionBlocked()) return; // fx=off / reduce：只保留数字变化
    try {
      var tr = anchorRect('coin');
      var tx = tr.left + tr.width / 2, ty = tr.top + tr.height / 2;
      var n = Math.max(COIN_FLY_MIN, Math.min(COIN_FLY_MAX, Math.abs(Number(gain) || COIN_FLY_MIN)));
      for (var i = 0; i < n; i++) {
        (function (i) {
          window.setTimeout(function () {
            try {
              var c = document.createElement('div');
              c.className = 'v18-coin';
              c.setAttribute('data-v18', 'coin-fly');
              document.body.appendChild(c);
              var sx = innerWidth / 2 + (Math.random() * 44 - 22);
              var sy = innerHeight * 0.62 + (Math.random() * 36 - 18);
              var cx = (sx + tx) / 2 + (Math.random() * 90 - 45);
              var cy = Math.min(sy, ty) - 70 - Math.random() * 50;
              var t0 = now(), dur = 400 + Math.random() * 80;
              function step() {
                var t = Math.min(1, (now() - t0) / dur), mt = 1 - t;
                var x = mt * mt * sx + 2 * mt * t * cx + t * t * tx;
                var y = mt * mt * sy + 2 * mt * t * cy + t * t * ty;
                c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + (1 + 0.22 * Math.sin(t * Math.PI)).toFixed(3) + ')';
                c.style.opacity = String(t > 0.86 ? (1 - (t - 0.86) / 0.14) : 1);
                if (t < 1) requestAnimationFrame(step);
                else { try { c.remove(); } catch (e) {} M.coinFly++; pulseCoin(); }
              }
              requestAnimationFrame(step);
            } catch (e) { err(e); }
          }, i * 40);
        })(i);
      }
    } catch (e) { err(e); }
  }

  var _lastHudFxAt = -1e9;
  var _lastCombo = 0, _lastCoin = 0, _lastHeat = 0;

  /* 由 index.html v12SyncHud() 在每次刷新后调用；prev* 为刷新前缓存值 */
  window.v18OnHudSync = function (info) {
    try {
      info = info || {};
      M.hudSync++;
      var heat = Number(info.heat) || 0, coin = Number(info.coin) || 0, combo = Number(info.combo) || 0;
      var dh = heat - (Number(info.prevHeat) || 0);
      var dc = coin - (Number(info.prevCoin) || 0);
      var dcb = combo - (Number(info.prevCombo) || 0);
      if (dh > 0) { floatText('+' + dh + ' 热度', 'heat'); _lastHudFxAt = now(); }
      if (dc > 0) { floatText('+' + dc + ' 亲密币', 'coin'); coinFly(dc); _lastHudFxAt = now(); }
      if (dcb > 0) {
        var badge = hudEl('combo');
        if (badge) {
          badge.classList.remove('v18-hide-combo');
          pulseCombo();
          if (combo >= 5 && (combo === 5 || combo === 10 || combo % 10 === 0)) bigCombo(combo);
        }
      } else if (combo <= 0) {
        var badge2 = hudEl('combo');
        if (badge2) badge2.classList.add('v18-hide-combo');
      }
      _lastHeat = heat; _lastCoin = coin; _lastCombo = combo;
    } catch (e) { err(e); }
  };

  /* ========================================================================
   * A5-3. 阶段升级轻仪式（heatStage() 变化检测，每阶段每晚一次）
   * ===================================================================== */
  var _stageObserved = null;

  function stageMaskGet() {
    try {
      var o = JSON.parse(localStorage.getItem('couple-v18stage') || 'null');
      if (!o || o.d !== todayKey()) o = { d: todayKey(), mask: 0 };
      return o;
    } catch (e) { return { d: todayKey(), mask: 0 }; }
  }
  function stageMaskSave(o) { try { localStorage.setItem('couple-v18stage', JSON.stringify(o)); } catch (e) {} }

  function stageName(st) {
    try { if (typeof HEATLINE !== 'undefined' && HEATLINE[st]) return HEATLINE[st]; } catch (e) {}
    return '🌡 阶段 ' + st;
  }

  function celebrateStage(st) {
    var nm = stageName(st);
    M.stageUp++;
    M.lastStage = { st: st, name: nm };
    if (motionBlocked()) { // fx=off / reduce：降级为 toast
      try { window.toast('🎉 升温到新阶段：' + nm); } catch (e) {}
      return;
    }
    try {
      var d = document.createElement('div');
      d.id = 'v18StageUp';
      d.setAttribute('data-v18', 'stage-up');
      d.innerHTML = '<div class="v18-su-inner"><div class="v18-su-ring"></div>'
        + '<div class="v18-su-name">' + nm + '</div>'
        + '<div class="v18-su-sub">升 温 新 阶 段</div></div>';
      document.body.appendChild(d);
      try { if (window.v12Fx && v12Fx.burst) v12Fx.burst(innerWidth / 2, innerHeight * 0.42, 48, ['#ffd166', '#ff2d95', '#8b5cf6', '#ffffff']); } catch (e) {}
      try { if (typeof sndDing === 'function') sndDing(); } catch (e) {}
      window.setTimeout(function () { try { if (typeof playBeep === 'function' && soundOn()) playBeep(1320, 0.16, 'sine', 0.1); } catch (e) {} }, 180);
      try { if (typeof vibrate === 'function') vibrate([18, 40, 18]); } catch (e) {}
      window.setTimeout(function () { try { d.remove(); } catch (e) {} }, 2100);
    } catch (e) { err(e); }
  }

  function checkStage() {
    try {
      var st = 0;
      try { st = (typeof window.heatStage === 'function') ? Number(window.heatStage()) || 0 : 0; } catch (e) { return; }
      if (_stageObserved === null) { _stageObserved = st; return; }
      if (st === _stageObserved) return;
      var up = st > _stageObserved;
      _stageObserved = st;
      if (!up || st < 1) return;
      var o = stageMaskGet();
      var bit = 1 << st;
      if (o.mask & bit) return;
      o.mask = (o.mask || 0) | bit;
      stageMaskSave(o);
      celebrateStage(st);
    } catch (e) { err(e); }
  }
  window.v18CheckHeatStage = checkStage;

  /* 兜底轮询：即使 60-pace 没调用钩子，heatStage() 变化也能被感知（每阶段仅一次） */
  var stageTv = null;
  function startStageWatch() {
    if (stageTv) return;
    stageTv = window.setInterval(function () { checkStage(); }, 2000);
    try { window.addEventListener('pagehide', function () { if (stageTv) { clearInterval(stageTv); stageTv = null; } }); } catch (e) {}
  }

  /* ========================================================================
   * A5 跨片段钩子（PLAN 接口；60-pace 在结算末尾调用）
   * ===================================================================== */
  window.v18HookTaskDone = function (info) {
    try {
      info = info || {};
      M.hookDone++;
      var sinceHud = now() - _lastHudFxAt;
      if (sinceHud > 700) { // HUD 未同步（或不是 HUD 路径）时兜底浮字
        var dh = Number(info.heat) || 0, dc = Number(info.coins) || 0;
        if (dh > 0) floatText('+' + dh + ' 热度', 'heat');
        if (dc > 0) { floatText('+' + dc + ' 亲密币', 'coin'); coinFly(dc); }
      }
      checkStage();
    } catch (e) { err(e); }
  };

  window.v18HookSkip = function (info) {
    try {
      info = info || {};
      M.hookSkip++;
      var el = null;
      try {
        var c = document.getElementById('gContent');
        if (c) el = c.querySelector('.wheel-result, .fl-task, .cmd-card') || c;
      } catch (e) {}
      if (el && !motionBlocked()) {
        try {
          el.classList.remove('shake');
          void el.offsetWidth;
          el.classList.add('shake');
          window.setTimeout(function () { try { el.classList.remove('shake'); } catch (e) {} }, 520);
        } catch (e) {}
      }
      try { if (window.v12Fx && v12Fx.burst) v12Fx.burst(innerWidth / 2, innerHeight * 0.6, 18, ['#9ca3af', '#6b7280', '#d1d5db', '#4b5563']); } catch (e) {}
      try { if (typeof sndBuzz === 'function') sndBuzz(); } catch (e) {}
      try { if (typeof vibrate === 'function') vibrate(15); } catch (e) {}
    } catch (e) { err(e); }
  };

  /* ========================================================================
   * 启动
   * ===================================================================== */
  function init() {
    try { injectCss(); } catch (e) { err(e); }
    try {
      var h = document.getElementById('v12Hud');
      if (h) h.classList.add('v18-hud');
    } catch (e) {}
    try {
      _stageObserved = (typeof window.heatStage === 'function') ? Number(window.heatStage()) || 0 : 0;
    } catch (e) { _stageObserved = 0; }
    startStageWatch();
    M.ready = true;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

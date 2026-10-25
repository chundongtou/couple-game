/* ===== V18 FEATURE: 60-pace · 玩法数值/节奏（impl-pace 唯一写者） =====
 * 内容：B1 强度加权奖励 / B2 热度阈值 / B3 续章降噪 / B4 跳过兜底 / B5 首页 CTA
 * 约束：ES5；自包含 IIFE；运行时注入 CSS；覆盖均先保留原函数语义（v12TaskComplete /
 *       v12PanelDone 仅去掉硬编码旧文案 toast，其余逐行保留）；不改 index.html。
 * 跨片段接口（50-motion 提供）：
 *   window.v18HookTaskDone({lv,heat,coins,heatBefore,heatAfter,stage,doneCount})
 *   window.v18HookSkip({free,freebies,source})
 * 说明：B6（V15 章节目标）经评估不改，原因见 reports/v18/impl-pace.md。
 */
(function () {
  'use strict';

  /* ---------------- 常量（与 PLAN §B 一一对应） ---------------- */
  var LV_HEAT = [0, 1, 1, 2, 3, 4];      /* B1: lv→heatUp 次数 */
  var LV_COIN = [0, 3, 4, 6, 8, 10];     /* B1: lv→亲密币 */
  var HEAT_LINE = [10, 22, 38, 58];      /* B2: 阶段阈值 */
  var STAGE_COIN_BONUS = 2;              /* 阶段≥2 时亲密币加成（沿用旧规则） */
  var FREE_SKIP_MAX = 2;                 /* B4: 每晚免费跳过次数 */
  var FREE_SKIP_KEY = 'couple-v18freeskip';
  var DONE_KEY = 'couple-v18done';

  /* ---------------- 小工具 ---------------- */
  function today() { try { return new Date().toDateString(); } catch (e) { return ''; } }

  function toastSafe(msg) {
    try { if (typeof window.toast === 'function') window.toast(msg); } catch (e) {}
  }

  function hasFn(name) { return typeof window[name] === 'function'; }

  function injectCss() {
    try {
      if (document.getElementById('v18PaceCss')) return;
      var st = document.createElement('style');
      st.id = 'v18PaceCss';
      st.textContent =
        '.v18-cta-item{display:block;width:100%;min-height:46px;margin:0 0 9px;padding:11px 14px;' +
        'text-align:left;font-size:14.5px;line-height:1.3;border-radius:14px;box-sizing:border-box}' +
        '.v18-cta-item small{display:block;margin-top:3px;font-size:11.5px;font-weight:600;opacity:.82}' +
        '.v18-cta-item:last-child{margin-bottom:0}' +
        'body.light .v18-cta-item.back,body.sketch .v18-cta-item.back{background:rgba(255,255,255,.7);' +
        'color:#6d4a5c;border:1px solid rgba(150,80,110,.2)}';
      (document.head || document.body).appendChild(st);
    } catch (e) {}
  }

  /* ============================================================
   * B2. 热度阈值：10 / 22 / 38 / 58，保留 gentGetV()*4 的温柔减速
   * ============================================================ */
  function heatStageV18() {
    var heat = 0, gent = 0;
    try { heat = getHeat(); } catch (e) { heat = 0; }
    try { gent = gentGetV(); } catch (e) { gent = 0; }
    heat = heat - gent * 4;
    if (heat >= HEAT_LINE[3]) return 4;
    if (heat >= HEAT_LINE[2]) return 3;
    if (heat >= HEAT_LINE[1]) return 2;
    if (heat >= HEAT_LINE[0]) return 1;
    return 0;
  }
  window.heatStage = heatStageV18;

  /* ============================================================
   * B1 + B3 计数：强度加权奖励 / 任务完成计数（每天重置）
   * ============================================================ */
  function doneCountGet() {
    var n = 0;
    try {
      var D = JSON.parse(localStorage.getItem(DONE_KEY) || 'null');
      if (D && D.d === today() && typeof D.n === 'number' && D.n >= 0) n = D.n;
    } catch (e) { n = 0; }
    window._v18DoneCount = n;
    return n;
  }
  function doneCountInc() {
    var n = doneCountGet() + 1;
    try { localStorage.setItem(DONE_KEY, JSON.stringify({ d: today(), n: n })); } catch (e) {}
    window._v18DoneCount = n;
    return n;
  }

  /* 任务强度：优先 window._lastTask（PLAN 指定），其次 v12LastText()；无文本时缺省 3 */
  function taskLv(txt) {
    var t = txt;
    if (!t) { try { t = window._lastTask || (hasFn('v12LastText') ? v12LastText() : ''); } catch (e) { t = ''; } }
    if (!t) return 3;
    try {
      var m = v12TaskMeta(t, window._v12LastType || '');
      var lv = m && m.lv ? Math.round(m.lv) : 3;
      if (!(lv >= 1 && lv <= 5)) lv = 3;
      return lv;
    } catch (e) { return 3; }
  }

  function taskDoneV18() {
    var lv = taskLv();
    var heatBefore = 0, heatAfter = 0, stage = 0;
    try { heatBefore = getHeat(); } catch (e) {}
    var heatGain = LV_HEAT[lv] || 0;

    /* 原副作用：统计/双轨/秘密券 */
    try { v12TaskDone(); } catch (e) {}

    /* 热度：heatUp() × 权重 */
    for (var i = 0; i < heatGain; i++) { try { heatUp(); } catch (e) {} }
    try { stage = heatStage(); } catch (e) { stage = 0; }

    /* 亲密币：权重 + 阶段加成（阶段取 heatUp 之后，与旧实现顺序一致） */
    var coinGain = (LV_COIN[lv] || 0) + (stage >= 2 ? STAGE_COIN_BONUS : 0);
    try { coinAdd(coinGain); } catch (e) {}

    /* 连击 / 连胜 / 每 5 连免罚卡（原逻辑） */
    var cb = 0;
    try {
      cb = getCombo() + 1;
      setCombo(cb);
      setStreak(0);
    } catch (e) { cb = 0; }
    if (cb > 0 && cb % 5 === 0) {
      try {
        ITEMS.pardon = Math.min(ITEMS.pardon + 1, 99);
        saveItems();
        toastSafe('🎁 连过' + cb + '关！奖励免罚卡+1');
        logEvent('🎁 连胜奖励：免罚卡+1');
      } catch (e) {}
    }

    try { gentTick(); } catch (e) {}
    try { v12SyncHome(); v12SyncHud(); } catch (e) {}
    try {
      v12Fx.burst(innerWidth / 2, innerHeight * 0.6, 30);
      var _cb = getCombo();
      if (_cb >= 3 && _cb % 3 === 0) v12Fx.combo('连击 ×' + _cb);
    } catch (e) {}
    try { v12StoryOnTask(); v12CheckAch(); } catch (e) {}

    /* B3: 每日完成计数（供 v12ChainOffer 降频） */
    var doneCount = doneCountInc();

    /* B1: 动态文案（替代 v12TaskComplete / v12PanelDone 里硬编码的旧字符串） */
    toastSafe('✅ 完成！热度+' + heatGain + ' · 亲密币+' + coinGain);

    try { heatAfter = getHeat(); } catch (e) { heatAfter = heatBefore + heatGain; }

    /* 跨片段接口：50-motion 的浮字/金币飞行/阶段升级检测 */
    try {
      if (typeof window.v18HookTaskDone === 'function') {
        window.v18HookTaskDone({
          lv: lv, heat: heatGain, coins: coinGain,
          heatBefore: heatBefore, heatAfter: heatAfter,
          stage: stage, doneCount: doneCount
        });
      }
    } catch (e) {}
  }
  window.taskDone = taskDoneV18;

  /* 完成按钮入口：原始实现 = taskDone + burst + vibrate + 旧文案 toast + 按钮置灰 + 450ms 续章。
     这里逐行保留，仅去掉与真实增量不符的旧 toast（现在由 taskDone 统一输出动态文案）。 */
  function bindComplete(origFn, burstY, burstN) {
    return function (btn) {
      try { window.taskDone(); } catch (e) {}
      try { v12Fx.burst(innerWidth / 2, innerHeight * burstY, burstN); } catch (e) {}
      try { vibrate([18, 30, 26]); } catch (e) {}
      try {
        if (btn && btn.tagName === 'BUTTON') {
          btn.disabled = true; btn.textContent = '✅ 已完成'; btn.style.opacity = '.55';
        }
      } catch (e) {}
      (function () {
        var _t = window._v12ChainTok = (window._v12ChainTok || 0) + 1;
        setTimeout(function () {
          if (window._v12ChainTok === _t && typeof window.v12ChainOffer === 'function') {
            try { window.v12ChainOffer(); } catch (e) {}
          }
        }, 450);
      })();
    };
  }
  try { window.v12TaskComplete = bindComplete(window.v12TaskComplete, 0.55, 34); } catch (e) {}
  try { window.v12PanelDone = bindComplete(window.v12PanelDone, 0.62, 26); } catch (e) {}

  /* ============================================================
   * B3. 续章降噪：无进行中链条时每 3 条才弹一次
   * ============================================================ */
  var origChainOffer = window.v12ChainOffer;
  window.v12ChainOffer = function () {
    try {
      var C = window._v12Chain;
      if (C && C.lv > 0) { return origChainOffer.apply(this, arguments); } /* 链条进行中：原逻辑 */
      var n = (typeof window._v18DoneCount === 'number') ? window._v18DoneCount : doneCountGet();
      if (n % 3 !== 0) return; /* 未到 3 的倍数：静默 */
      return origChainOffer.apply(this, arguments);
    } catch (e) {
      try { return origChainOffer.apply(this, arguments); } catch (e2) {}
    }
  };

  /* ============================================================
   * B4. 跳过兜底：免罚卡 / 3 精力 / 每晚 2 次免费跳过
   * ============================================================ */
  function freeSkipGet() {
    var F = null;
    try { F = JSON.parse(localStorage.getItem(FREE_SKIP_KEY) || 'null'); } catch (e) { F = null; }
    if (!F || F.d !== today() || typeof F.n !== 'number' || F.n < 0 || F.n > FREE_SKIP_MAX) {
      F = { d: today(), n: FREE_SKIP_MAX };
    }
    return F;
  }
  function freeSkipSave(F) {
    try { localStorage.setItem(FREE_SKIP_KEY, JSON.stringify(F)); } catch (e) {}
  }

  function hookSkip(info) {
    try {
      if (typeof window.v18HookSkip === 'function') window.v18HookSkip(info);
    } catch (e) {}
  }

  var origPanelSkip = window.panelSkip;
  window.panelSkip = function () {
    try {
      /* 原逻辑第一条：本环节不支持跳过 */
      if (!window._pardonHandler) { toastSafe('本环节不支持跳过'); return; }

      var hasPardon = false, energy = 0;
      try { hasPardon = !!(ITEMS && ITEMS.pardon > 0); } catch (e) { hasPardon = false; }
      try { energy = energyGet().v || 0; } catch (e) { energy = 0; }

      /* 无卡且精力 < 3：进入兜底 */
      if (!hasPardon && energy < 3) {
        var fs = freeSkipGet();
        if (fs.n > 0) {
          fs.n = fs.n - 1;
          freeSkipSave(fs);
          toastSafe('🎫 免费跳过（今晚剩 ' + fs.n + ' 次）');
          var h = window._pardonHandler;
          window._pardonHandler = null;
          try { if (typeof h === 'function') h(); } catch (e) {}
          try { renderCtrl(); } catch (e) {}
          hookSkip({ free: true, freebies: fs.n, source: 'freeskip' });
          return;
        }
        toastSafe('⚡ 精力不够：完成一条任务会回精力');
        return; /* 不弹无解 energyAsk */
      }

      /* 原路径：免罚卡优先，否则 3 精力 */
      var p0 = 0, e0 = 0, h0 = window._pardonHandler;
      try { p0 = ITEMS.pardon; } catch (e) { p0 = 0; }
      try { e0 = energyGet().v || 0; } catch (e) { e0 = 0; }
      var ret = origPanelSkip.apply(this, arguments);
      if (window._pardonHandler !== h0) { /* 成功执行了跳过 */
        var p1 = 0, e1 = 0;
        try { p1 = ITEMS.pardon; } catch (e) { p1 = 0; }
        try { e1 = energyGet().v || 0; } catch (e) { e1 = 0; }
        var source = (p1 < p0) ? 'pardon' : (e1 < e0 ? 'energy' : 'unknown');
        var left = 0;
        try { left = freeSkipGet().n; } catch (e) { left = 0; }
        hookSkip({ free: source === 'pardon', freebies: left, source: source });
      }
      return ret;
    } catch (e) {
      try { return origPanelSkip.apply(this, arguments); } catch (e2) {}
    }
  };

  /* ============================================================
   * B5. 首页 CTA：地图进行中走 v15Show；否则弹「今晚怎么玩」四入口
   * ============================================================ */
  var THEME_NAMES = { dark: '暗夜夜灯', light: '浅色浪漫', sketch: '手绘情书' };

  function diffLabel() {
    try { return DIFF_NAMES[(SET.diff || 3) - 1] || DIFF_NAMES[2]; } catch (e) { return '热辣升温'; }
  }
  function themeLabel() {
    try { return THEME_NAMES[SET.theme || 'dark'] || '暗夜夜灯'; } catch (e) { return '暗夜夜灯'; }
  }

  function bindTap(id, fn) {
    try {
      var el = document.getElementById(id);
      if (el) el.onclick = fn;
    } catch (e) {}
  }

  function openTonightPicker() {
    var line = '当前：' + diffLabel() + ' · 🌓 ' + themeLabel();
    var html = '<h3 data-v18="tonight">🌙 今晚怎么玩</h3>'
      + '<div class="m-item" data-v18="cta-line" style="font-size:12px;color:var(--v12-dim);text-align:center;justify-content:center">'
      + line + '</div>'
      + '<div class="wheel-btns" style="display:block">'
      + '<button class="wheel-btn spin v18-cta-item" id="v18CtaQuick" data-v18="cta-quick" style="min-height:46px">'
      + '⚡ 经典抽题<small>从全部玩法随机开一局，随时能停</small></button>'
      + '<button class="wheel-btn back v18-cta-item" id="v18CtaMap" data-v18="cta-map" style="min-height:46px">'
      + '🗺️ 今夜地图<small>3 章 × 6 节点 · 自由选路 · 有收束</small></button>'
      + '<button class="wheel-btn back v18-cta-item" id="v18CtaNight" data-v18="cta-night" style="min-height:46px">'
      + '🕯️ 主题之夜<small>酒店 / 角色 / 蒙眼 · 四幕剧情</small></button>'
      + '<button class="wheel-btn back v18-cta-item" id="v18CtaScript" data-v18="cta-script" style="min-height:46px">'
      + '🕵️ 剧本之夜<small>三本剧本 · 每本约 45 分钟</small></button>'
      + '</div>'
      + '<div class="wheel-btns" style="display:block;margin-top:4px">'
      + '<button class="wheel-btn back v18-cta-item" style="min-height:46px;text-align:center" onclick="closeModal()">先不玩</button></div>';
    openModal(html);
    bindTap('v18CtaQuick', function () {
      closeModal();
      try { v12QuickStart(); } catch (e) { toastSafe('快速开始失败，可直接选游戏'); }
    });
    bindTap('v18CtaMap', function () {
      closeModal();
      try { v15Intro(); } catch (e) { toastSafe('今夜地图暂时打不开'); }
    });
    bindTap('v18CtaNight', function () {
      closeModal();
      try { startGame('night'); } catch (e) { toastSafe('主题之夜暂时打不开'); }
    });
    bindTap('v18CtaScript', function () {
      closeModal();
      try { v16Intro(); } catch (e) { toastSafe('剧本之夜暂时打不开'); }
    });
  }

  var origMainCta = window.v12MainCta;
  window.v12MainCta = function () {
    try {
      if (typeof v15RunActive === 'function' && v15RunActive()) { v15Show(); return; }
    } catch (e) {}
    try {
      openTonightPicker();
    } catch (e) {
      try { return origMainCta.apply(this, arguments); } catch (e2) {}
    }
  };

  /* ---------------- 初始化 ---------------- */
  injectCss();
  doneCountGet(); /* 同步 window._v18DoneCount */
})();

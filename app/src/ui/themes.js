/* ===== V7 ui/themes.js：今晚的桌面（云海机舱 / 星轨夜航 / 纸雕童话） =====
   口径：docs/v7/impl-freeze.md §2.1（三主题）与 §4.3（App.Themes 契约）。
   只改视觉：背景 / 机舱色调 / 棋盘外圈 / 格位光晕 / 粒子 / 小熊 outfit / 内容卡配色；
   不改 52 格拓扑、题卡内容、规则与安全词（冻结单 §2.1）。主题与玩家预设（名字/颜色/尺度）独立，可组合。

   API（table / Cinema / CellStage / Bear 读这里）：
     App.Themes.list                -> [{id,name,desc,hint,outfit,swatch,particles,board,...}]（cloud 在首位）
     App.Themes.get(id?)            -> 主题对象；无参读 Store.getSettings().theme，未知值/low 值回落 cloud
     App.Themes.apply(rootEl, id?)  -> 主题对象；注入主题样式 + 在 html/body/rootEl 上设 data-theme + 同步 theme-color
     App.Themes.set(id, rootEl?)    -> 同 apply，并写 Store.saveSettings({theme:id})（门厅/设置页用）
     App.Themes.bearOutfit(id?)     -> 'pilot' | 'starlight' | 'paper'
     App.Themes.tokens(id?)         -> 扁平 CSS 变量表（含 --v7-*），JS 侧想自己设变量时用
     App.Themes.varsText(id?)       -> "--v7-board-rim:#8FC7E8;..."（可直接塞进 style 属性）
     App.Themes.particles(id?)      -> { kind, count, speed, colors }（副本，可安全改）
     App.Themes.ids                 -> ['cloud','star','paper']
     App.Themes.version             -> 'v7'

   约定（给 Cinema / CellStage 的对接口径）：
     · Boot 选择时 `set()` 落盘；table mount 时直接 `apply(rootEl)` 即可（apply 不写盘）。
     · data-theme 同时写在 <html>、<body> 与传入的 rootEl 上；所有令牌用 [data-theme="x"] 选择器下发，
       因此只拿到 rootEl 的子层（.v6-table / overlay / cell-stage）也能继承同一套变量。
     · 每个主题都同时下发 V6 旧令牌（--bg0/--amber/--ink/--line…）与 V7 新令牌（--v7-*），
       旧组件不改代码就跟着换色；Cinema 取 --v7-particle* / --v7-scene-tint，CellStage 取 --v7-card-* / --v7-square-glow。
     · 任何函数都不抛错：App.Themes 缺失、Store 缺失、rootEl 为空都退回 cloud。
     · 主题切换只在 id 变化时 emit Bus 'theme'（幂等重复 apply 不刷屏）。 */
(function () {
  var App = (window.App = window.App || {});
  if (App.Themes) return;

  var DEFAULT_ID = "cloud";
  var STYLE_ID = "style-v7-themes";
  var VERSION = "v7";
  var ids = ["cloud", "star", "paper"];

  /* ---------- 主题表：只描述视觉（冻结单 §2.1） ---------- */
  var THEMES = [
    {
      id: "cloud",
      name: "云海机舱",
      desc: "舷窗外是一片云海，桌板上亮着一盏阅读灯。",
      hint: "云海 · 暖灯",
      outfit: "pilot",
      outfitName: "机长小熊",
      cap: "帽子 · 围巾 · 护目镜",
      swatch: "linear-gradient(135deg,#0C1E2E 0%,#2E6A8C 44%,#8FC7E8 68%,#F2C98A 100%)",
      particles: {
        kind: "cloud",
        count: 20,
        speed: 0.55,
        colors: ["rgba(233,244,252,.52)", "rgba(180,214,238,.32)", "rgba(242,201,138,.20)"]
      },
      board: {
        rim: "#8FC7E8",
        rim2: "#F2C98A",
        rimGlow: "rgba(143,199,232,.42)",
        squareGlow: "rgba(255,217,160,.9)",
        squareGlowSoft: "rgba(255,217,160,.16)"
      },
      vars: {
        "--bg0": "#071320", "--bg1": "#0C1E2E", "--bg2": "#102534",
        "--nebula": "#14324A", "--nebula-glow": "#7FB6D9",
        "--amber": "#F2C98A", "--amber-deep": "#D99A5C", "--rose": "#E9968A",
        "--ink": "#F6F1E6", "--ink-soft": "#EADFCB", "--dim": "#BFD2DA", "--dim2": "#7F9AA8",
        "--glass": "rgba(18,44,60,.44)", "--glass2": "rgba(38,74,96,.30)",
        "--line": "rgba(198,232,246,.14)", "--line2": "rgba(198,232,246,.24)",
        "--card": "rgba(12,32,44,.68)",
        "--paper": "#F4EEE1", "--paper2": "#E9DFCC", "--paper-ink": "#1B2B33",
        "--v7-scene-tint": "rgba(46,106,140,.20)",
        "--v7-glass-tint": "rgba(233,244,252,.07)",
        "--v7-cta": "linear-gradient(100deg,#CBE6F6 0%,#8FC7E8 44%,#F2C98A 100%)",
        "--v7-cta-ink": "#0E2434",
        "--v7-grad": "linear-gradient(96deg,#EAF6FF 4%,#9FD3F0 42%,#F2C98A 92%)"
      },
      bg: "radial-gradient(120% 62% at 50% -8%,#14324A 0%,#0C1E2E 42%,#071320 100%)," +
          "radial-gradient(120% 84% at 50% 44%,transparent 52%,rgba(3,10,16,.55) 100%)," +
          "linear-gradient(180deg,#071320,#0A1826)",
      nebula: "radial-gradient(44% 30% at 84% 4%,rgba(242,201,138,.22),transparent 70%)," +
              "radial-gradient(56% 42% at 10% 14%,rgba(127,182,217,.30),transparent 72%)," +
              "radial-gradient(76% 42% at 50% 104%,rgba(233,244,252,.20),transparent 74%)," +
              "radial-gradient(42% 26% at 72% 64%,rgba(143,199,232,.12),transparent 76%)",
      skyOpacity: 0.52,
      grainOpacity: 0.13
    },
    {
      id: "star",
      name: "星轨夜航",
      desc: "深紫夜空，星图环和流星就在舷窗外。",
      hint: "星空 · 流星",
      outfit: "starlight",
      outfitName: "星轨小熊",
      cap: "披风 · 星星别针",
      swatch: "linear-gradient(135deg,#08060F 0%,#241540 44%,#8E7BD8 68%,#F3C077 100%)",
      particles: {
        kind: "star",
        count: 34,
        speed: 0.42,
        colors: ["#FFE9D2", "#C9B6CE", "#8E7BD8"]
      },
      board: {
        rim: "#B9A4F0",
        rim2: "#F3C077",
        rimGlow: "rgba(142,123,216,.50)",
        squareGlow: "rgba(243,192,119,.9)",
        squareGlowSoft: "rgba(243,192,119,.18)"
      },
      vars: {
        "--bg0": "#08060F", "--bg1": "#120D24", "--bg2": "#150F2A",
        "--nebula": "#241540", "--nebula-glow": "#8E7BD8",
        "--amber": "#F3C077", "--amber-deep": "#E2965E", "--rose": "#E9887A",
        "--ink": "#FBF3E7", "--ink-soft": "#F0DCC8", "--dim": "#C9B6CE", "--dim2": "#8E7C9E",
        "--glass": "rgba(38,27,58,.42)", "--glass2": "rgba(86,60,120,.28)",
        "--line": "rgba(255,226,196,.13)", "--line2": "rgba(255,226,196,.22)",
        "--card": "rgba(28,19,46,.66)",
        "--paper": "#F7EAD6", "--paper2": "#F1DFC4", "--paper-ink": "#2C1C15",
        "--v7-scene-tint": "rgba(130,96,224,.20)",
        "--v7-glass-tint": "rgba(255,236,214,.07)",
        "--v7-cta": "linear-gradient(100deg,#F8D29A 0%,#F2B77C 42%,#E98D7F 100%)",
        "--v7-cta-ink": "#2B1710",
        "--v7-grad": "linear-gradient(96deg,#FFE7BE 4%,#F3B57A 42%,#EE8E83 92%)"
      },
      bg: "radial-gradient(120% 62% at 50% -8%,#241540 0%,#150E29 42%,#0A0717 100%)," +
          "radial-gradient(120% 84% at 50% 44%,transparent 52%,rgba(4,3,10,.55) 100%)," +
          "linear-gradient(180deg,#0A0717,#08060F)",
      nebula: "radial-gradient(46% 34% at 82% 6%,rgba(233,136,122,.24),transparent 70%)," +
              "radial-gradient(52% 40% at 12% 16%,rgba(130,96,224,.28),transparent 72%)," +
              "radial-gradient(70% 40% at 50% 104%,rgba(243,192,119,.2),transparent 74%)," +
              "radial-gradient(40% 26% at 74% 62%,rgba(180,96,180,.1),transparent 76%)",
      skyOpacity: 1,
      grainOpacity: 0.15
    },
    {
      id: "paper",
      name: "纸雕童话",
      desc: "纸片一层层叠起来，像一本会飞的书。",
      hint: "纸页 · 台灯",
      outfit: "paper",
      outfitName: "纸雕小熊",
      cap: "纸围巾 · 圆眼镜",
      swatch: "linear-gradient(135deg,#140F0B 0%,#33241A 44%,#D8A46A 70%,#FBF3E4 100%)",
      particles: {
        kind: "paper",
        count: 16,
        speed: 0.68,
        colors: ["rgba(255,238,208,.48)", "rgba(216,180,133,.34)", "rgba(201,138,118,.24)"]
      },
      board: {
        rim: "#E3C79A",
        rim2: "#C98A76",
        rimGlow: "rgba(216,164,106,.42)",
        squareGlow: "rgba(255,231,190,.9)",
        squareGlowSoft: "rgba(255,231,190,.16)"
      },
      vars: {
        "--bg0": "#140F0B", "--bg1": "#1D150F", "--bg2": "#241A12",
        "--nebula": "#33241A", "--nebula-glow": "#D8A46A",
        "--amber": "#D8A46A", "--amber-deep": "#B87F4B", "--rose": "#C98A76",
        "--ink": "#F7EEDD", "--ink-soft": "#EBDCC2", "--dim": "#D8C6AE", "--dim2": "#9C8770",
        "--glass": "rgba(48,34,24,.44)", "--glass2": "rgba(84,60,40,.28)",
        "--line": "rgba(255,236,205,.14)", "--line2": "rgba(255,236,205,.24)",
        "--card": "rgba(36,25,17,.70)",
        "--paper": "#FBF3E4", "--paper2": "#EFE0C9", "--paper-ink": "#3A2A1C",
        "--v7-scene-tint": "rgba(216,164,106,.22)",
        "--v7-glass-tint": "rgba(255,244,224,.07)",
        "--v7-cta": "linear-gradient(100deg,#FBF0D8 0%,#E3C79A 44%,#C98A76 100%)",
        "--v7-cta-ink": "#2A1C12",
        "--v7-grad": "linear-gradient(96deg,#FFF6E4 4%,#E7C89C 46%,#C98A76 94%)"
      },
      bg: "radial-gradient(120% 62% at 50% -8%,#33241A 0%,#1D150F 42%,#140F0B 100%)," +
          "radial-gradient(120% 84% at 50% 44%,transparent 52%,rgba(10,7,4,.58) 100%)," +
          "linear-gradient(180deg,#140F0B,#1A120C)",
      nebula: "radial-gradient(46% 32% at 82% 5%,rgba(255,231,190,.22),transparent 70%)," +
              "radial-gradient(54% 40% at 10% 15%,rgba(216,164,106,.26),transparent 72%)," +
              "radial-gradient(72% 40% at 50% 104%,rgba(201,138,118,.18),transparent 74%)," +
              "radial-gradient(40% 26% at 76% 62%,rgba(255,238,208,.10),transparent 76%)",
      skyOpacity: 0.34,
      grainOpacity: 0.22
    }
  ];

  var byId = {};
  for (var i = 0; i < THEMES.length; i++) byId[THEMES[i].id] = THEMES[i];

  /* ---------- 变量派生（V6 旧令牌 + V7 新令牌，一份真相） ---------- */
  function palette(t) {
    var out = {}, k;
    for (k in t.vars) if (Object.prototype.hasOwnProperty.call(t.vars, k)) out[k] = t.vars[k];
    var pc = t.particles.colors || [];
    out["--v7-board-rim"] = t.board.rim;
    out["--v7-board-rim-2"] = t.board.rim2;
    out["--v7-board-rim-glow"] = t.board.rimGlow;
    out["--v7-square-glow"] = t.board.squareGlow;
    out["--v7-square-glow-soft"] = t.board.squareGlowSoft;
    out["--v7-particle"] = pc[0] || t.board.rim;
    out["--v7-particle-2"] = pc[1] || pc[0] || t.board.rim2;
    out["--v7-particle-kind"] = t.particles.kind;
    out["--v7-particle-count"] = String(t.particles.count);
    out["--v7-card-paper"] = t.vars["--paper"];
    out["--v7-card-paper-2"] = t.vars["--paper2"];
    out["--v7-card-ink"] = t.vars["--paper-ink"];
    return out;
  }

  function cssVars(pal) {
    var out = [];
    for (var k in pal) if (Object.prototype.hasOwnProperty.call(pal, k)) out.push(k + ":" + pal[k]);
    return out.join(";");
  }

  /* 主题选择组件样式：base.css 不在本任务写作用域（冻结单 §7 fe-theme 仅 3 个文件），
     所以门厅的三选一卡片样式随本模块注入；类名统一 .v7-theme-* 前缀，避免和其它屏冲突。 */
  var COMPONENT_CSS = [
    ".v7-theme-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:9px}",
    ".v7-theme-card{position:relative;display:flex;flex-direction:column;gap:6px;align-items:stretch;",
    "padding:8px 8px 9px;border-radius:16px;border:1px solid var(--line);background:rgba(255,236,214,.04);",
    "color:var(--dim);text-align:left;transition:border-color 160ms var(--ease-out),background 160ms var(--ease-out),box-shadow 160ms}",
    ".v7-theme-card .v7-tv{display:block;height:34px;border-radius:10px;border:1px solid rgba(255,255,255,.16);",
    "box-shadow:inset 0 1px 6px rgba(255,255,255,.18),inset 0 -8px 16px rgba(0,0,0,.28)}",
    ".v7-theme-card b{display:block;font-size:12.5px;font-weight:700;color:var(--ink);letter-spacing:.04em;line-height:1.25}",
    ".v7-theme-card em{display:block;font-style:normal;font-size:10px;color:var(--dim2);letter-spacing:.04em;line-height:1.35}",
    ".v7-theme-card.on{border-color:rgba(243,192,119,.6);",
    "background:radial-gradient(120% 90% at 12% 0%,rgba(243,192,119,.18),rgba(38,27,58,.5));box-shadow:0 8px 22px rgba(0,0,0,.3)}",
    ".v7-theme-card.on b{color:#FFF3E2}",
    ".v7-theme-card.on::after{content:\"\\2713\";position:absolute;right:7px;top:6px;width:16px;height:16px;",
    "display:flex;align-items:center;justify-content:center;border-radius:999px;font-size:10px;font-weight:700;color:#2B1710;",
    "background:linear-gradient(100deg,#F8D29A,#EE8E83)}",
    ".v7-theme-card:active{transform:scale(.985)}",
    "@media (max-width:360px){.v7-theme-grid{gap:6px}.v7-theme-card{padding:7px 7px 8px}",
    ".v7-theme-card .v7-tv{height:30px}.v7-theme-card b{font-size:11.5px}}"
  ].join("");

  /* ---------- 主题样式（data-theme 覆盖变量，不重写 base.css） ---------- */
  function buildCss() {
    var out = [];
    out.push("/* v7 themes：只覆盖变量与背景层，base.css 本体不动 */");
    for (var i = 0; i < THEMES.length; i++) {
      var t = THEMES[i];
      var sel = '[data-theme="' + t.id + '"]';
      out.push(sel + "{" + cssVars(palette(t)) + "}");
      out.push(sel + " #bg{background:" + t.bg + "}");
      out.push(sel + " .v6-nebula{background:" + t.nebula + "}");
      out.push(sel + " .v6-sky{opacity:" + t.skyOpacity + "}");
      out.push(sel + " .v6-grain{opacity:" + t.grainOpacity + "}");
      /* 注意：base.css 的 .grad-text 用 background-clip:text 做渐变字，
         这里必须只覆盖 background-image（用 background 简写会把 background-clip 重置回 border-box，
         渐变就会变成一条实心色块盖住「飞行棋」）。 */
      out.push(sel + " .grad-text{background-image:var(--v7-grad)}");
      out.push(sel + " .btn.primary{background-image:var(--v7-cta);color:var(--v7-cta-ink)}");
      out.push(sel + " .v6-orbit{opacity:" + (t.id === "paper" ? "0.28" : t.id === "cloud" ? "0.34" : "0.5") + "}");
    }
    out.push("html[data-theme] body{background-color:var(--bg0)}");
    out.push(COMPONENT_CSS);
    return out.join("\n");
  }

  var styleEl = null;
  function ensureStyle() {
    if (styleEl && styleEl.parentNode) return styleEl;
    var doc = document;
    var old = doc.getElementById(STYLE_ID);
    if (old && old.parentNode) { styleEl = old; return styleEl; }
    var el = doc.createElement("style");
    el.id = STYLE_ID;
    el.textContent = buildCss();
    (doc.head || doc.documentElement).appendChild(el);
    styleEl = el;
    return el;
  }

  /* ---------- 读盘（未知值一律回落 cloud） ---------- */
  function savedId() {
    try {
      if (App.Store && App.Store.getSettings) {
        var s = App.Store.getSettings();
        if (s && typeof s.theme === "string") return s.theme;
      }
    } catch (e) {}
    return null;
  }

  function resolve(themeId) {
    if (themeId && typeof themeId === "object" && themeId.id) themeId = themeId.id;
    if (typeof themeId === "string" && byId[themeId]) return byId[themeId];
    var saved = savedId();
    if (saved && byId[saved]) return byId[saved];
    return byId[DEFAULT_ID];
  }

  var lastApplied = null;

  function apply(rootEl, themeId) {
    /* 容错：apply("star") / apply() 也认 */
    if (typeof rootEl === "string" && themeId === undefined) { themeId = rootEl; rootEl = null; }
    var t = resolve(themeId);
    try { ensureStyle(); } catch (e) {}
    var targets = [];
    if (rootEl && rootEl.setAttribute) targets.push(rootEl);
    if (document.documentElement) targets.push(document.documentElement);
    if (document.body) targets.push(document.body);
    for (var i = 0; i < targets.length; i++) {
      try {
        targets[i].setAttribute("data-theme", t.id);
        if (targets[i].dataset) targets[i].dataset.themeId = t.id;
      } catch (e) {}
    }
    try {
      var meta = document.querySelector ? document.querySelector('meta[name="theme-color"]') : null;
      if (meta) meta.setAttribute("content", t.vars["--bg0"]);
    } catch (e) {}
    if (lastApplied !== t.id) {
      lastApplied = t.id;
      try { if (App.Bus && App.Bus.emit) App.Bus.emit("theme", t); } catch (e) {}
    }
    return t;
  }

  function set(themeId, rootEl) {
    if (typeof themeId === "object" && themeId && themeId.id) themeId = themeId.id;
    var t = resolve(themeId);
    try {
      if (App.Store && App.Store.saveSettings) App.Store.saveSettings({ theme: t.id });
    } catch (e) {}
    return apply(rootEl, t.id);
  }

  function get(themeId) { return resolve(themeId); }

  function tokens(themeId) {
    var pal = palette(resolve(themeId)), out = {};
    for (var k in pal) if (Object.prototype.hasOwnProperty.call(pal, k)) out[k] = pal[k];
    return out;
  }

  function particles(themeId) {
    var p = resolve(themeId).particles;
    return { kind: p.kind, count: p.count, speed: p.speed, colors: (p.colors || []).slice() };
  }

  function bearOutfit(themeId) {
    var t = resolve(themeId);
    return t.outfit || "pilot";
  }

  /* 冻结主题表：调用方只读，避免被 UI 就地改坏 */
  for (var j = 0; j < THEMES.length; j++) {
    try { if (Object.freeze) Object.freeze(THEMES[j].vars); Object.freeze(THEMES[j]); } catch (e) {}
  }

  App.Themes = {
    version: VERSION,
    ids: ids.slice(),
    defaultId: DEFAULT_ID,
    list: THEMES,
    get: get,
    apply: apply,
    set: set,
    bearOutfit: bearOutfit,
    tokens: tokens,
    varsText: function (themeId) { return cssVars(tokens(themeId)); },
    particles: particles,
    paletteCss: function () { return buildCss(); }
  };

  /* 模块一加载就先按存储值套一次主题：这样直接进 #door/…（小游戏）、#settings 之类的入口
     也不会漏掉主题（apply 幂等、不写盘；本模块在 body 末尾执行，html/body 必然存在）。 */
  try { apply(); } catch (e) {}
})();

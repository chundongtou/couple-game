/* =============================================================================
 * V3 ui/screens/journey.js —— 航程屏（视觉门面）
 * -----------------------------------------------------------------------------
 * 结构：顶栏（幕标 + 菜单） → 资源 HUD（心动/张力/默契/星屑 + 连击）
 *        → 幕标题与回合进度点 → 领航员提示 → 3 张扇形手牌 → 换牌券/安全提示
 * 契约：App.Screens.journey = { mount(root, params), unmount() }
 * 依赖：App.Store / App.Engine / App.Router / App.UI / App.Motion / App.Audio / App.Balance
 * 只读 state；动作后 App.Store.saveSession(state)。
 * ========================================================================== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;
  var UI = App.UI;
  var B = App.Balance;

  var POOLS = {
    truth: { icon: "💬", name: "真心话", accent: "#9a7cff", glow: "rgba(154,124,255,.34)" },
    dare: { icon: "⚡", name: "大冒险", accent: "#ff9e5e", glow: "rgba(255,158,94,.34)" },
    touch: { icon: "🫧", name: "触碰", accent: "#ff5f9e", glow: "rgba(255,95,158,.34)" },
    sync: { icon: "🪢", name: "共鸣", accent: "#4fd6c8", glow: "rgba(79,214,200,.30)" },
    spark: { icon: "🌟", name: "心跳", accent: "#f3c879", glow: "rgba(243,200,121,.34)" },
    punish: { icon: "🚫", name: "惩罚", accent: "#ff5f6d", glow: "rgba(255,95,109,.30)" }
  };
  var NUMERALS = ["壹", "贰", "叁"];
  var RES = [
    { k: "heart", icon: "♥", label: "心动" },
    { k: "tension", icon: "✦", label: "张力" },
    { k: "sync", icon: "⌁", label: "默契" },
    { k: "coins", icon: "◈", label: "星屑" }
  ];

  var lastRes = null;     // 上一次挂载时的资源快照（用于浮字）
  var lastCombo = null;
  var handCardsRef = [];  // 当前手牌（换牌后更新，点击时读它，避免闭包过期）
  var cleanupFns = [];

  UI.injectStyle("journey", [
    /* ---------- 屏幕骨架 ---------- */
    ".jr { position: relative; isolation: isolate; overflow: hidden;",
    "  --cw: clamp(112px, 31.5vw, 126px); --ch: calc(var(--cw) * 1.66); }",
    "@media (min-width: 700px) { .jr { --cw: 150px; } }",
    "@media (max-height: 721px) { .jr { --cw: clamp(104px, 29vw, 116px); } }",
    "@media (min-height: 762px) { .jr { --cw: clamp(116px, 33vw, 132px); } }",
    ".jr-atmos { position: absolute; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }",
    ".jr-atmos::before { content: ''; position: absolute; left: 50%; top: 6%; width: 150vw; height: 72vw; transform: translateX(-50%);",
    "  background: radial-gradient(closest-side, var(--accent-glow, rgba(243,200,121,.16)), transparent 72%); filter: blur(10px); opacity: .9; }",
    ".jr-atmos::after { content: ''; position: absolute; left: 50%; top: 61%; width: 118vw; height: 1px; transform: translateX(-50%);",
    "  background: linear-gradient(90deg, transparent, rgba(255,255,255,.14), transparent); opacity: .7; }",
    ".jr-speck { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #fff; opacity: .38;",
    "  box-shadow: 0 0 8px rgba(255,255,255,.6); animation: jrDrift 11s ease-in-out infinite alternate; }",
    "@keyframes jrDrift { from { transform: translate3d(0,0,0); opacity: .18; } to { transform: translate3d(10px,-16px,0); opacity: .52; } }",

    /* ---------- 入场 ---------- */
    ".jr-rise { opacity: 0; animation: jrRise .62s var(--ease-out) both; animation-delay: var(--d, 0ms); }",
    "@keyframes jrRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }",

    /* ---------- 顶栏 ---------- */
    ".jr-top { display: flex; align-items: center; justify-content: space-between; min-height: 48px; }",
    ".jr-actmark { display: flex; align-items: center; gap: 9px; min-width: 0; }",
    ".jr-actmark .dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent, var(--gold)); box-shadow: 0 0 12px var(--accent, var(--gold)); flex: 0 0 auto; }",
    ".jr-actmark .k { font-size: 10.5px; letter-spacing: .30em; color: var(--dim2); font-weight: 700; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }",
    ".jr-menu { width: 48px; height: 48px; flex: 0 0 auto; }",
    ".jr-menu i { font-style: normal; font-size: 16px; letter-spacing: 0; }",
    /* 减少动效：不做位移/旋转，只留一次极短淡入（DESIGN §2） */
    "body.reduce .jr-rise, body.reduce .jr-pos { animation-name: jrFadeIn !important; animation-duration: .2s !important; animation-delay: 0ms !important; }",
    "@keyframes jrFadeIn { from { opacity: 0; } to { opacity: 1; } }",

    /* ---------- 资源 HUD ---------- */
    ".jr-hud { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }",
    ".jr-res { position: relative; flex: 1 1 0; min-width: 56px; display: flex; align-items: center; justify-content: center; gap: 5px;",
    "  padding: 9px 4px 8px; border-radius: 13px; background: var(--glass); border: 1px solid var(--line);",
    "  transition: border-color var(--t-fast), background var(--t-fast), transform var(--t-fast) var(--ease); }",
    ".jr-res i { font-style: normal; font-size: 12px; opacity: .92; }",
    ".jr-res b { font-size: 14.5px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: .02em; }",
    ".jr-res[data-kind=heart] i, .jr-res[data-kind=heart] b { color: var(--heart); }",
    ".jr-res[data-kind=tension] i, .jr-res[data-kind=tension] b { color: var(--tension); }",
    ".jr-res[data-kind=sync] i, .jr-res[data-kind=sync] b { color: var(--sync); }",
    ".jr-res[data-kind=coins] i, .jr-res[data-kind=coins] b { color: var(--coins); }",
    ".jr-res.up { border-color: rgba(243,200,121,.55); background: rgba(243,200,121,.10); }",
    ".jr-combo { flex: 0 0 auto; display: inline-flex; align-items: center; gap: 4px; padding: 9px 11px; border-radius: 13px;",
    "  border: 1px solid var(--line); background: var(--glass); color: var(--dim2); font-size: 12px; font-weight: 800; letter-spacing: .04em; }",
    ".jr-combo i { font-style: normal; font-size: 12px; }",
    ".jr-combo.hot { color: var(--gold); border-color: rgba(243,200,121,.5); background: rgba(243,200,121,.10); box-shadow: 0 0 22px rgba(243,200,121,.16); }",
    ".jr-combo.hot b { color: var(--gold); }",
    ".jr-combo b { font-variant-numeric: tabular-nums; }",

    /* ---------- 幕标题 ---------- */
    ".jr-head { position: relative; margin-top: 20px; }",
    ".jr-numeral { position: absolute; right: -14px; top: -18px; font-family: Georgia, 'Songti SC', 'SimSun', serif;",
    "  font-size: 124px; font-weight: 600; line-height: .9; color: rgba(255,255,255,.05); pointer-events: none; }",
    ".jr-kicker { display: flex; align-items: center; gap: 8px; }",
    ".jr-kicker .ln { width: 22px; height: 1px; background: var(--accent, var(--gold)); opacity: .8; }",
    ".jr-title { margin-top: 7px; font-size: 34px; line-height: 1.06; letter-spacing: .10em; font-weight: 800; }",
    ".jr-title .grad { background: linear-gradient(100deg, #fff 6%, var(--accent, var(--gold)) 58%, var(--rose) 130%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }",
    ".jr-sub { margin-top: 8px; color: var(--dim); font-size: 12.5px; letter-spacing: .05em; line-height: 1.6; }",

    /* ---------- 回合进度 ---------- */
    ".jr-progress { margin-top: 14px; }",
    ".jr-dots { display: flex; align-items: center; gap: 5px; }",
    ".jr-dot { width: 7px; height: 7px; border-radius: 50%; background: rgba(255,255,255,.14); transition: all var(--t-mid) var(--ease); }",
    ".jr-dot.done { background: var(--accent, var(--gold)); box-shadow: 0 0 10px var(--accent, var(--gold)); }",
    ".jr-dot.now { width: 18px; border-radius: 99px; background: linear-gradient(90deg, var(--accent, var(--gold)), #fff); box-shadow: 0 0 14px var(--accent, var(--gold)); }",
    ".jr-bar { position: relative; height: 3px; margin-top: 9px; border-radius: 99px; background: rgba(255,255,255,.08); overflow: hidden; }",
    ".jr-bar i { position: absolute; inset: 0 auto 0 0; border-radius: 99px; background: linear-gradient(90deg, var(--accent, var(--gold)), rgba(255,255,255,.9));",
    "  box-shadow: 0 0 12px var(--accent, var(--gold)); transition: width .7s var(--ease-out); }",
    ".jr-ptext { display: flex; justify-content: space-between; margin-top: 7px; font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; }",
    ".jr-ptext b { color: var(--dim); font-weight: 700; }",

    /* ---------- 领航员提示 ---------- */
    ".jr-guide { display: flex; align-items: flex-start; gap: 10px; margin-top: 16px; padding: 11px 13px; border-radius: 16px;",
    "  background: linear-gradient(120deg, rgba(255,255,255,.065), rgba(255,255,255,.02)); border: 1px solid var(--line); }",
    ".jr-guide .orb { flex: 0 0 auto; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center;",
    "  font-size: 11px; color: #23112a; background: linear-gradient(135deg, var(--accent, var(--gold)), #ffb08c);",
    "  box-shadow: 0 0 16px var(--accent-glow, rgba(243,200,121,.3)); }",
    ".jr-guide p { font-size: 12.5px; line-height: 1.62; color: var(--dim); letter-spacing: .02em; }",
    ".jr-guide b { color: var(--ink); font-weight: 800; }",
    ".jr-guide .who { color: var(--accent, var(--gold)); font-weight: 800; }",
    ".jr-guide .hint { display: block; margin-top: 2px; color: var(--dim2); font-size: 11px; }",

    /* ---------- 手牌 ---------- */
    ".jr-hand { position: relative; margin: 14px -10px 0; padding-bottom: 2px; }",
    ".jr-scene { position: relative; height: calc(var(--ch) + 34px); display: block; }",
    ".jr-pos { position: absolute; left: 50%; top: 10px; width: var(--cw); height: var(--ch); margin-left: calc(var(--cw) / -2);",
    "  transform-origin: 50% 96%; transform: var(--fan); transition: transform .32s var(--ease-out), opacity .26s var(--ease);",
    "  opacity: 0; isolation: isolate; animation: jrCardIn .6s var(--ease-out) both; animation-delay: calc(var(--i) * 90ms + 210ms); }",
    ".jr-pos[data-i='0'] { z-index: 1; }",
    ".jr-pos[data-i='1'] { z-index: 3; }",
    ".jr-pos[data-i='2'] { z-index: 2; }",
    "@keyframes jrCardIn {",
    "  from { opacity: 0; transform: var(--fan) translateY(30px) scale(.92); }",
    "  to { opacity: 1; transform: var(--fan); }",
    "}",
    ".jr-pos::before { content: ''; position: absolute; inset: 4px -3px -6px 3px; border-radius: 18px; z-index: -1;",
    "  background: linear-gradient(170deg, rgba(46,32,78,.9), rgba(12,7,24,.95)); border: 1px solid rgba(255,255,255,.07);",
    "  transform: translate(3px,4px); box-shadow: 0 12px 26px rgba(0,0,0,.42); }",
    ".jr-pos:hover { transform: var(--fan) translateY(-9px); }",
    ".jr-pos.picked { transform: var(--fan) translateY(-22px) scale(1.05); z-index: 9; }",
    ".jr-pos.dim { opacity: .16; transform: var(--fan) scale(.94); }",
    ".jr-card { position: absolute; inset: 0; width: 100%; height: 100%; text-align: left; border-radius: 18px; overflow: hidden;",
    "  background: radial-gradient(120% 78% at 22% 0%, rgba(255,255,255,.12), transparent 54%),",
    "              linear-gradient(168deg, rgba(41,29,70,.97), rgba(15,9,28,.99));",
    "  border: 1px solid rgba(255,255,255,.15); color: var(--ink);",
    "  box-shadow: 0 1px 0 rgba(255,255,255,.16) inset, 0 2px 0 rgba(23,15,40,.9), 0 4px 0 rgba(15,10,28,.85),",
    "              0 18px 34px rgba(0,0,0,.42), 0 0 26px var(--card-glow, rgba(255,255,255,.05));",
    "  display: flex; flex-direction: column; padding: 11px 10px 10px;",
    "  transition: box-shadow .3s var(--ease), border-color .3s var(--ease); }",
    ".jr-pos.picked .jr-card { border-color: rgba(255,255,255,.5); box-shadow: 0 0 0 1px rgba(255,255,255,.28), 0 22px 44px rgba(0,0,0,.5), 0 0 52px var(--card-glow, rgba(243,200,121,.3)); }",
    ".jr-card::before { content: ''; position: absolute; inset: 6px; border-radius: 14px; border: 1px solid rgba(255,255,255,.08); pointer-events: none; }",
    ".jr-card::after { content: ''; position: absolute; left: -30%; top: -46%; width: 90%; height: 90%; border-radius: 50%;",
    "  background: radial-gradient(closest-side, var(--card-glow, rgba(255,255,255,.16)), transparent 70%); opacity: .55; pointer-events: none; }",
    ".jr-card-top { display: flex; align-items: center; justify-content: space-between; gap: 4px; position: relative; z-index: 1; }",
    ".jr-kind { display: inline-flex; align-items: center; gap: 4px; font-size: 10.5px; font-weight: 700; letter-spacing: .1em;",
    "  color: var(--card-accent, var(--gold)); text-transform: uppercase; white-space: nowrap; }",
    ".jr-kind i { font-style: normal; font-size: 12px; filter: saturate(1.1); }",
    ".jr-stars { font-size: 9.5px; letter-spacing: .08em; color: var(--gold); white-space: nowrap; }",
    ".jr-stars .e { color: rgba(255,255,255,.16); }",
    ".jr-card-text { position: relative; z-index: 1; margin-top: 8px; flex: 1 1 auto; overflow: hidden;",
    "  font-size: 12px; line-height: 1.62; letter-spacing: .01em; color: #efe7ff;",
    "  display: -webkit-box; -webkit-line-clamp: 6; -webkit-box-orient: vertical; }",
    ".jr-card-text.long { font-size: 11px; line-height: 1.58; -webkit-line-clamp: 6; }",
    ".jr-yields { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 2px; margin-top: 6px; }",
    ".jr-yield { display: inline-flex; align-items: center; gap: 1px; padding: 1px 4px; border-radius: 99px; font-size: 9px;",
    "  font-weight: 700; color: var(--dim); background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.08); }",
    ".jr-yield i { font-style: normal; font-size: 10px; }",
    ".jr-yield.h i, .jr-yield.h b { color: var(--heart); }",
    ".jr-yield.t i, .jr-yield.t b { color: var(--tension); }",
    ".jr-yield.s i, .jr-yield.s b { color: var(--sync); }",
    ".jr-yield.c i, .jr-yield.c b { color: var(--coins); }",
    ".jr-card-foot { position: relative; z-index: 1; display: flex; align-items: center; justify-content: space-between;",
    "  margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,.09); }",
    ".jr-card-no { font-size: 9px; letter-spacing: .16em; color: var(--dim2); font-weight: 700; }",
    ".jr-card-pick { display: inline-flex; align-items: center; gap: 3px; font-size: 9.5px; font-weight: 800; letter-spacing: .04em; color: var(--card-accent, var(--gold)); }",
    ".jr-pos.picked .jr-card-pick { color: #fff; }",
    ".jr-hand-hint { text-align: center; margin-top: 6px; font-size: 10.5px; color: var(--dim2); letter-spacing: .08em; }",
    ".jr-hand-hint b { color: var(--dim); }",
    ".jr-quote { display: none; margin: 22px 8px 0; text-align: center; font-size: 12.5px; line-height: 1.9; color: var(--dim2); letter-spacing: .10em; }",
    ".jr-quote .ln { display: block; width: 34px; height: 1px; margin: 0 auto 10px; background: linear-gradient(90deg, transparent, var(--accent, var(--gold)), transparent); opacity: .7; }",
    "@media (min-height: 762px) { .jr-quote { display: block; } }",

    /* ---------- 底部 ---------- */
    ".jr-spacer { flex: 1 1 auto; min-height: 10px; }",
    ".jr-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-top: 6px;",
    "  /* 左下角留给全局「停」安全词胶囊（core/safe.js 固定 left:16 bottom:16 56x44） */",
    "  padding-left: 62px; }",
    ".jr-reroll { min-height: 46px; padding: 0 14px; border-radius: 999px; background: var(--glass2); border: 1px solid var(--line2);",
    "  color: var(--ink); font-size: 13px; font-weight: 700; letter-spacing: .04em; display: inline-flex; align-items: center; gap: 8px;",
    "  transition: transform var(--t-fast) var(--ease), box-shadow var(--t-fast), border-color var(--t-fast); }",
    ".jr-reroll:active { transform: scale(.965); }",
    ".jr-reroll .n { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 5px;",
    "  border-radius: 999px; background: linear-gradient(135deg, var(--gold), #ff9f6b); color: #2a0f1c; font-size: 11px; font-weight: 900; }",
    ".jr-reroll.empty { opacity: .58; }",
    ".jr-reroll.empty .n { background: rgba(255,255,255,.16); color: var(--dim); }",
    ".jr-safety { min-height: 48px; padding: 6px 8px; font-size: 10.5px; color: var(--dim2); letter-spacing: .04em; text-align: right; line-height: 1.5; }",
    ".jr-safety b { color: #ffb3b8; font-weight: 700; }",

    /* ---------- 菜单 sheet ---------- */
    ".jr-menu-list { display: flex; flex-direction: column; gap: 9px; }",
    ".jr-mi { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 54px; padding: 11px 14px; border-radius: 16px;",
    "  background: var(--glass); border: 1px solid var(--line); text-align: left; color: var(--ink);",
    "  transition: transform var(--t-fast) var(--ease), background var(--t-fast), border-color var(--t-fast); }",
    ".jr-mi:active { transform: scale(.985); background: var(--glass2); }",
    ".jr-mi .ic { flex: 0 0 auto; width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center;",
    "  background: rgba(255,255,255,.06); border: 1px solid var(--line); font-size: 15px; }",
    ".jr-mi .tx { flex: 1 1 auto; min-width: 0; }",
    ".jr-mi .tx b { display: block; font-size: 13.5px; font-weight: 700; letter-spacing: .02em; }",
    ".jr-mi .tx span { display: block; font-size: 11px; color: var(--dim2); margin-top: 2px; line-height: 1.5; }",
    ".jr-mi .ar { color: var(--dim2); font-size: 13px; }",
    ".jr-mi.danger .ic { color: #ffb3b8; border-color: rgba(255,95,109,.35); background: rgba(255,95,109,.09); }",
    ".jr-mi.danger .tx b { color: #ffc3c7; }",
    ".jr-sheet-note { margin-top: 14px; font-size: 10.5px; color: var(--dim2); text-align: center; letter-spacing: .06em; line-height: 1.7; }",
    ".jr-safe-list { display: flex; flex-direction: column; gap: 10px; }",
    ".jr-safe-item { display: flex; gap: 10px; font-size: 12.5px; line-height: 1.7; color: var(--dim); }",
    ".jr-safe-item .b { flex: 0 0 6px; height: 6px; margin-top: 8px; border-radius: 50%; background: var(--rose); box-shadow: 0 0 10px var(--rose); }",
    ".jr-safe-item b { color: var(--ink); }",

    /* ---------- 窄屏 / 矮屏 ---------- */
    "@media (max-height: 730px) {",
    "  .jr-title { font-size: 29px; }",
    "  .jr-head { margin-top: 14px; }",
    "  .jr-guide { margin-top: 12px; padding: 9px 12px; }",
    "  .jr-hand { margin-top: 8px; }",
    "  .jr-ptext { margin-top: 5px; }",
    "  .jr-progress { margin-top: 10px; }",
    "}",
    "@media (max-width: 360px) {",
    "  .jr-numeral { font-size: 88px; right: -6px; top: -20px; }",
    "  .jr-res b { font-size: 13.5px; }",
    "}"
  ].join("\n"));

  /* ---------------------------- 小工具 ---------------------------- */
  function clearTimers() {
    while (cleanupFns.length) {
      try { cleanupFns.pop()(); } catch (e) {}
    }
  }
  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    cleanupFns.push(function () { clearTimeout(id); });
    return id;
  }
  function poolMeta(pool) { return POOLS[pool] || { icon: "✧", name: pool || "卡牌", accent: "#f3c879", glow: "rgba(243,200,121,.3)" }; }
  function stars(star) {
    var n = U.clamp(parseInt(star, 10) || 1, 1, 5), out = "";
    for (var i = 1; i <= 5; i++) out += (i <= n ? "★" : '<span class="e">☆</span>');
    return out;
  }
  function yieldChips(card) {
    var y = {};
    try { y = B.yieldFor(card.pool, card.star) || {}; } catch (e) {}
    var map = [["heart", "h", "♥"], ["tension", "t", "✦"], ["sync", "s", "⌁"]];
    var out = "";
    for (var i = 0; i < map.length; i++) {
      var k = map[i][0];
      if (y[k]) out += '<span class="jr-yield ' + map[i][1] + '"><i>' + map[i][2] + '</i><b>+' + y[k] + "</b></span>";
    }
    out += '<span class="jr-yield c"><i>◈</i><b>+' + (parseInt(card.star, 10) || 1) + "</b></span>";
    return out;
  }
  function actMeta(st) {
    try { return App.Engine.actInfo(st); } catch (e) {
      return { act: st.act || 1, name: "第 " + (st.act || 1) + " 幕", sub: "", accent: "", rounds: 5, intro: [] };
    }
  }
  function actAccent(meta) {
    var a = meta && meta.accent;
    if (!a) a = ["#e9b872", "#8d7cf6", "#6fd3c7"][U.clamp((meta && meta.act ? meta.act : 1) - 1, 0, 2)];
    return a;
  }
  function accentGlow(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length !== 6) return "rgba(243,200,121,.18)";
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + ",.20)";
  }
  function hostName(st) {
    var names = (st && st.names) || { a: "你", b: "TA" };
    return st.host === "b" ? (names.b || "TA") : (names.a || "你");
  }
  function otherName(st) {
    var names = (st && st.names) || { a: "你", b: "TA" };
    return st.host === "b" ? (names.a || "你") : (names.b || "TA");
  }
  function save(st) { try { App.Store.saveSession(st); } catch (e) {} }

  /* ---------------------------- 资源 HUD ---------------------------- */
  function hudHtml(st) {
    var r = st.resources || {};
    var out = "";
    for (var i = 0; i < RES.length; i++) {
      var m = RES[i];
      out += '<div class="jr-res" data-kind="' + m.k + '" title="' + m.label + '">' +
        '<i aria-hidden="true">' + m.icon + "</i>" +
        '<b data-test="hud-' + m.k + '" data-res="' + m.k + '">' + U.round(r[m.k] || 0) + "</b></div>";
    }
    var combo = Math.max(0, U.round(st.combo || 0));
    out += '<div class="jr-combo' + (combo > 0 ? " hot" : "") + '" data-kind="combo" title="连击">' +
      '<i aria-hidden="true">⚡</i><span>×</span><b data-test="hud-combo">' + combo + "</b></div>";
    return out;
  }

  function animateHud(st) {
    var root = document.querySelector(".jr");
    if (!root) return;
    var prev = lastRes || {};
    RES.forEach(function (m) {
      var el = U.qs('[data-res="' + m.k + '"]', root);
      if (!el) return;
      var to = U.round((st.resources || {})[m.k] || 0);
      var from = prev[m.k] === undefined ? 0 : U.round(prev[m.k]);
      try {
        if (M && M.count) M.count(el, to, { from: from, dur: 520 });
        else el.textContent = String(to);
      } catch (e) { el.textContent = String(to); }
      if (prev[m.k] !== undefined && to !== from) {
        var d = to - from;
        var wrap = el.parentNode;
        try {
          M.floatText(wrap, (d > 0 ? "+" : "") + d, d > 0 ? "" : "rose");
          M.pulse(wrap, "pulse-once");
          if (d > 0) {
            wrap.classList.add("up");
            later(function () { wrap.classList.remove("up"); }, 900);
          }
        } catch (e) {}
      }
    });
    // 连击涨了：脉冲 + 飘字
    var cb = Math.max(0, U.round(st.combo || 0));
    var comboEl = U.qs(".jr-combo", root);
    if (comboEl) {
      if (lastCombo !== null && cb > lastCombo) {
        try { M.pulse(comboEl); M.floatText(comboEl, "连击 +" + (cb - lastCombo), ""); } catch (e) {}
      }
      comboEl.classList.toggle("hot", cb > 0);
    }
    lastRes = { heart: U.round((st.resources || {}).heart || 0), tension: U.round((st.resources || {}).tension || 0), sync: U.round((st.resources || {}).sync || 0), coins: U.round((st.resources || {}).coins || 0) };
    lastCombo = cb;
  }

  /* ---------------------------- 手牌 ---------------------------- */
  function cardHtml(card, idx) {
    var meta = poolMeta(card.pool);
    var text = String(card.text || "");
    var long = text.length > 74;
    return '<div class="jr-pos" data-i="' + idx + '" style="--i:' + idx + ";--fan:" + fanOf(idx) + ";--card-accent:" + meta.accent + ";--card-glow:" + meta.glow + '">' +
      '<button class="jr-card" type="button" data-test="journey-card-' + U.escape(card.id) + '" data-card-key="' + U.escape(card.key || "") + '" data-card-id="' + U.escape(card.id) + '" data-star="' + (parseInt(card.star, 10) || 1) + '" data-pool="' + U.escape(card.pool || "") + '" data-index="' + idx + '"' +
      ' aria-label="' + U.escape(meta.name + " " + card.star + " 星：" + text) + '">' +
      '<div class="jr-card-top">' +
      '<span class="jr-kind" style="--card-accent:' + meta.accent + '"><i aria-hidden="true">' + meta.icon + "</i>" + U.escape(meta.name) + "</span>" +
      '<span class="jr-stars" data-star="' + (parseInt(card.star, 10) || 1) + '" aria-label="' + (parseInt(card.star, 10) || 1) + ' 星" aria-hidden="true">' + stars(card.star) + "</span>" +
      "</div>" +
      '<p class="jr-card-text' + (long ? " long" : "") + '">' + U.escape(text) + "</p>" +
      '<div class="jr-yields">' + yieldChips(card) + "</div>" +
      '<div class="jr-card-foot"><span class="jr-card-no">NO.0' + (idx + 1) + '</span><span class="jr-card-pick">选择 <span aria-hidden="true">→</span></span></div>' +
      "</button></div>";
  }
  function fanOf(i) {
    /* 位置用 CSS 变量 --fan 控制：中间略高，两侧向内收 4°，只有少量叠压 */
    if (i === 0) return "translate(calc(var(--cw) * -0.92), 15px) rotate(-4deg) scale(.975)";
    if (i === 2) return "translate(calc(var(--cw) * 0.92), 15px) rotate(4deg) scale(.975)";
    return "translateY(-3px)";
  }

  /* 只绑一次（挂到 .jr-hand 容器上，换牌只换 .jr-scene 内容，监听不丢）；
   * 点击时读 handCardsRef，避免闭包持有换牌前的旧手牌。 */
  function bindHand(root) {
    var hand = U.qs(".jr-hand", root);
    if (!hand) return;
    hand.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest(".jr-card") : null;
      if (!btn) return;
      var scene = U.qs(".jr-scene", root);
      if (!scene || scene.getAttribute("data-busy") === "1") return;
      var idx = parseInt(btn.getAttribute("data-index"), 10) || 0;
      var card = handCardsRef[idx] || handCardsRef[0];
      if (!card) { UI.toast("这张卡还没到手", { kind: "gold" }); return; }
      scene.setAttribute("data-busy", "1");
      var pos = btn.parentNode;
      App.Audio.play("select");
      UI.haptic("light");
      try { M.pulse(btn); } catch (e) {}
      U.qsa(".jr-pos", scene).forEach(function (p) { if (p !== pos) p.classList.add("dim"); });
      pos.classList.add("picked");
      var reduced = M.reduced();
      later(function () {
        /* 引擎主键是复合 key（pool:id）；chooseCard / play 屏都能直接吃 key */
        App.Router.go("play", { cardId: card.key || card.id, cardKey: card.key, index: idx });
      }, reduced ? 30 : 280);
    });
  }

  function rerenderHand(root, st) {
    var cards = [];
    try { cards = App.Engine.handCards(st) || []; } catch (e) { cards = []; }
    var scene = U.qs(".jr-scene", root);
    if (!scene) return cards;
    scene.classList.remove("deal");
    scene.innerHTML = cards.map(cardHtml).join("");
    scene.setAttribute("data-busy", "0");
    handCardsRef = cards;
    var count = U.qs(".jr-hand-hint b", root);
    if (count) count.textContent = String(cards.length);
    return cards;
  }

  /* ---------------------------- 菜单 / 安全词 ---------------------------- */
  function openSafetySheet() {
    UI.sheet({
      title: "安全词与边界",
      subtitle: "任何时候都可以喊停。这不是失败。",
      html: '<div class="jr-safe-list">' +
        '<div class="jr-safe-item"><span class="b"></span><div><b>安全词</b>：说出口即生效。当前设置支持长按「停」<b>2 秒</b>触发温和收尾，不扣资源、不记失败。</div></div>' +
        '<div class="jr-safe-item"><span class="b"></span><div><b>缓一缓</b>：跳过一张太快的卡。累计温柔值，会改变结局走向。</div></div>' +
        '<div class="jr-safe-item"><span class="b"></span><div><b>黑名单</b>：在设置里写好不想出现的词，抽卡时自动过滤。</div></div>' +
        '<div class="jr-safe-item"><span class="b"></span><div>船会记住你们怎么选择——<b>不玩完，也可以被好好接住</b>。</div></div>' +
        "</div>",
      onMount: function () { App.Audio.play("tap"); }
    });
  }

  function openMenu() {
    var st = App.Store.getSession();
    if (!st) return;
    App.Audio.play("tap");
    UI.sheet({
      title: "航行菜单",
      subtitle: "进度会自动存档，随时可以回来",
      html: '<div class="jr-menu-list">' +
        '<button class="jr-mi" data-act="resume"><span class="ic">▶</span><span class="tx"><b>继续航行</b><span>回到这一回合的三张手牌</span></span><span class="ar">›</span></button>' +
        '<button class="jr-mi" data-act="settings"><span class="ic">⚙</span><span class="tx"><b>设置</b><span>声音 / 触感 / 减少动效 / 尺度</span></span><span class="ar">›</span></button>' +
        '<button class="jr-mi" data-act="safe"><span class="ic">☾</span><span class="tx"><b>安全词说明</b><span>长按「停」两秒，立刻温柔收尾</span></span><span class="ar">›</span></button>' +
        '<button class="jr-mi" data-act="pause"><span class="ic">⏸</span><span class="tx"><b>暂停，回到标题</b><span>存档并离开这艘船（可继续）</span></span><span class="ar">›</span></button>' +
        '<button class="jr-mi danger" data-act="home"><span class="ic">⌂</span><span class="tx"><b>回大厅</b><span>存档后返回标题屏</span></span><span class="ar">›</span></button>' +
        "</div>" +
        '<div class="jr-sheet-note">本局 · 第 ' + (st.round || 1) + " 回合 · 星屑 " + U.round((st.resources || {}).coins || 0) + " · 连击 " + U.round(st.combo || 0) + "</div>",
      onMount: function (panel, close) {
        U.qsa(".jr-mi", panel).forEach(function (btn) {
          btn.addEventListener("click", function () {
            var act = btn.getAttribute("data-act");
            if (act === "resume") { close(); return; }
            if (act === "safe") { close(); later(function () { openSafetySheet(); }, 60); return; }
            if (act === "settings") {
              close();
              if (App.Screens && App.Screens.settings) { App.Router.go("settings"); }
              else { UI.toast("设置页还在路上，先把这一夜走完吧", { kind: "gold" }); }
              return;
            }
            if (act === "pause" || act === "home") {
              close();
              save(st);
              App.Audio.play("soft");
              later(function () {
                if (App.Screens && App.Screens.boot) App.Router.reset("boot");
                else UI.toast("已存档");
              }, 120);
            }
          });
        });
      }
    });
  }

  /* ---------------------------- 渲染 ---------------------------- */
  function render(root, st) {
    var meta = actMeta(st);
    var accent = actAccent(meta);
    var progress = {};
    try { progress = App.Engine.progress(st) || {}; } catch (e) {}
    var actLength = Math.max(1, progress.actLength || meta.rounds || 5);
    var actRound = U.clamp(progress.actRound || 1, 1, actLength);
    var totalRounds = progress.total || actLength;
    var globalRound = progress.round || st.round || 1;
    var dots = "";
    for (var i = 1; i <= actLength; i++) {
      var cls = "jr-dot";
      if (i < actRound) cls += " done";
      else if (i === actRound) cls += " now";
      dots += '<span class="' + cls + '" aria-hidden="true"></span>';
    }
    var cards = [];
    try { cards = App.Engine.handCards(st) || []; } catch (e) { cards = []; }
    var host = hostName(st), other = otherName(st);
    var reroll = Math.max(0, U.round((st.tokens || {}).reroll || 0));
    var actNo = U.clamp(meta.act || 1, 1, 3);
    var specks = "";
    for (var s = 0; s < 9; s++) {
      specks += '<i class="jr-speck" style="left:' + (7 + s * 10.6) + "%;top:" + (12 + ((s * 37) % 62)) + "%;animation-delay:" + (s * -1.3) + 's"></i>';
    }

    var quote = "";
    try { quote = (meta.intro && meta.intro[2]) || (meta.intro && meta.intro[meta.intro.length - 1]) || ""; } catch (e) { quote = ""; }

    root.innerHTML =
      '<div class="page jr" style="--accent:' + accent + ";--accent-glow:" + accentGlow(accent) + '">' +
      '<div class="jr-atmos" aria-hidden="true">' + specks + "</div>" +

      /* 顶栏 */
      '<header class="jr-top jr-rise" style="--d:0ms">' +
      '<div class="jr-actmark"><span class="dot"></span><span class="k">ACT ' + actNo + " · " + U.escape(meta.name) + " · ROUND " + globalRound + "/" + totalRounds + "</span></div>" +
      '<button class="icon-btn jr-menu" type="button" data-test="journey-menu" aria-label="打开菜单"><i aria-hidden="true">☰</i></button>' +
      "</header>" +

      /* HUD */
      '<div class="jr-hud jr-rise" style="--d:60ms" role="group" aria-label="今晚资源">' + hudHtml(st) + "</div>" +

      /* 幕标题 + 进度 */
      '<section class="jr-head jr-rise" style="--d:110ms">' +
      '<div class="jr-numeral" aria-hidden="true">' + NUMERALS[actNo - 1] + "</div>" +
      '<div class="jr-kicker"><span class="ln"></span><span class="kicker">第 ' + actNo + " 幕 / 共 3 幕</span></div>" +
      '<h1 class="jr-title"><span class="grad">' + U.escape(meta.name) + "</span></h1>" +
      (meta.sub ? '<p class="jr-sub">' + U.escape(meta.sub) + "</p>" : "") +
      '<div class="jr-progress" role="group" aria-label="幕内进度">' +
      '<div class="jr-dots">' + dots + "</div>" +
      '<div class="jr-bar"><i style="width:' + U.clamp(progress.actPercent || 0, 3, 100) + '%"></i></div>' +
      '<div class="jr-ptext"><span>第 <b>' + actRound + "</b> / " + actLength + " 回合</span><span>全程 <b>" + globalRound + "</b> / " + totalRounds + "</span></div>" +
      "</div></section>" +

      /* 领航员 */
      '<section class="jr-guide jr-rise" style="--d:160ms" aria-live="polite">' +
      '<span class="orb" aria-hidden="true">✧</span>' +
      '<p>这一回合由 <span class="who">' + U.escape(host) + "</span> 领航，把一张卡递给 <b>" + U.escape(other) + "</b>。" +
      '<span class="hint">选一张——另外两张会退回去，船记得这次选择。</span></p>' +
      "</section>" +

      /* 手牌 */
      '<section class="jr-hand jr-rise" style="--d:210ms" data-test="journey-hand" aria-label="三张手牌">' +
      '<div class="jr-scene" data-busy="0">' + cards.map(cardHtml).join("") + "</div>" +
      '<div class="jr-hand-hint">共 <b>' + cards.length + "</b> 张 · 选一张递过去</div>" +
      "</section>" +

      '<div class="jr-quote" aria-hidden="true"><span class="ln"></span>' + (quote ? U.escape(quote) : "") + "</div>" +
      '<div class="jr-spacer"></div>' +

      /* 底部 */
      '<footer class="jr-foot jr-rise" style="--d:280ms">' +
      '<button class="jr-reroll' + (reroll <= 0 ? " empty" : "") + '" type="button" data-test="journey-reroll" aria-label="换手牌，剩余 ' + reroll + ' 张换牌券">' +
      '<span aria-hidden="true">🔄</span><span>换手牌</span><span class="n" data-reroll-count>' + reroll + "</span></button>" +
      '<button class="jr-safety" type="button" data-safety aria-label="安全词说明">安全词随时可用<br><b>长按「停」</b> 温柔收尾</button>' +
      "</footer>" +
      "</div>";

    /* 换牌 */
    var rerollBtn = U.qs(".jr-reroll", root);
    if (rerollBtn) {
      rerollBtn.addEventListener("click", function () {
        var cur = App.Store.getSession() || st;
        var res;
        try { res = App.Engine.reroll(cur); } catch (e) { res = null; }
        /* reroll 是状态型动作：返回 state，动作事件挂在 state.outEvents */
        var evs = (res && (res.outEvents || res.events)) || [];
        var blocked = evs.some(function (e) { return e && e.blocked; });
        if (!res || blocked) {
          App.Audio.play("warn");
          UI.haptic("warn");
          UI.toast("换牌券用完了 · 完成卡牌会攒回来", { kind: "rose" });
          try { M.shake(rerollBtn); } catch (e) {}
          return;
        }
        App.Audio.play("flip");
        UI.haptic("light");
        var next = res.state || res;
        save(next);
        var countEl = U.qs("[data-reroll-count]", root);
        if (countEl) countEl.textContent = String(Math.max(0, U.round((next.tokens || {}).reroll || 0)));
        rerollBtn.classList.toggle("empty", ((next.tokens || {}).reroll || 0) <= 0);
        try { M.burst(window.innerWidth / 2, window.innerWidth * 0.5, { count: 12, radius: 90, colors: ["#f3c879", "#ff5f9e", "#ffffff"] }); } catch (e) {}
        var scene = U.qs(".jr-scene", root);
        if (scene) {
          scene.style.transition = "opacity .12s ease";
          scene.style.opacity = "0";
        }
        later(function () {
          if (scene) { scene.style.opacity = "1"; }
          rerenderHand(root, next);
          animateHud(next);
        }, M.reduced() ? 10 : 130);
      });
    }
    var safetyBtn = U.qs("[data-safety]", root);
    if (safetyBtn) safetyBtn.addEventListener("click", function () { App.Audio.play("tap"); openSafetySheet(); });

    var menuBtn = U.qs(".jr-menu", root);
    if (menuBtn) menuBtn.addEventListener("click", openMenu);

    handCardsRef = cards;
    bindHand(root);
    animateHud(st);
    if (cards.length === 0) {
      UI.toast("手牌是空的，重新抽一次", { kind: "gold" });
    }
  }

  /* ---------------------------- 生命周期 ---------------------------- */
  function redirectIfNeeded(st) {
    if (!st) return "boot";
    if (st.phase === "play" || st.phase === "escalate" || st.phase === "resolve") return "play";
    if (st.phase === "event") return "event";
    if (st.phase === "act") return "act";
    if (st.phase === "shop") return "shop";
    if (st.phase === "finale") return "finale";
    return null;
  }

  App.Screens = App.Screens || {};
  App.Screens.journey = {
    mount: function (root, params) {
      clearTimers();
      var st = App.Store.getSession();
      var target = redirectIfNeeded(st);
      if (target) {
        later(function () {
          if (target === "boot") { App.Router.reset("boot"); return; }
          if (App.Screens && App.Screens[target]) App.Router.go(target, {});
          else { UI.toast("这段航程还没有准备好", { kind: "gold" }); App.Router.reset("boot"); }
        }, 0);
        return;
      }
      if (!st.hand || !st.hand.length) {
        try { st = App.Engine.startRound(st); save(st); } catch (e) {}
      }
      App.Audio.play("tap");
      UI.haptic("light");
      render(root, st);
    },
    unmount: function () {
      clearTimers();
    }
  };
})();

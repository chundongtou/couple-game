/* ===== 主桌（V6）：HUD / 回合条 / 掷骰条 / 棋盘容器 / 行动区 / 题卡与小游戏宿主 =====
 * 依据：docs/v6/impl-freeze.md §3.1-§3.4 + api-contract.md §7/§8 + docs/v6/copy.md §2
 * 分工：棋盘画法=App.BoardView（fe-board）；题卡=App.PromptCard、小游戏=App.MiniGame（fe-cards）；
 *      暂停=App.Pause、安全词=App.Safe（fe-shell）。本文件只做编排 + 宿主 + 文案。
 * 时序铁律（api-contract §8）：busy 单飞锁 → 调引擎 → 先 Store.saveSession → await BoardView.play → setState 纠偏 → 重画。
 * 布局约定：骰子结果/落点/提示放「掷骰条」（回合条下方、棋盘上方），题卡是 fixed 底部 dock，
 *          因此题卡打开时落点与回合名仍然可读（AC-C4-1 / AC-B7-3）。
 */
(function () {
  "use strict";
  var App = window.App;
  if (!App) return;
  var U = App.util;

  /* ---------- 常量 ---------- */
  var INK = { red: "#F08C80", yellow: "#F0C877", blue: "#8FA6E8", green: "#7FC9A8" };
  var CN = { red: "红", yellow: "黄", blue: "蓝", green: "绿" };
  var CARD_KINDS = { "cell-truth": 1, "cell-dare": 1, "cell-touch": 1, capture: 1, "stack-duo": 1, "home-entry": 1 };
  /* 阶段：0-19 / 20-39 / 40-59 / 60-79 / 80-100（copy §2.8） */
  var STAGES = [
    { id: "cold", name: "灯刚亮", min: 0 },
    { id: "warm", name: "有点热", min: 20 },
    { id: "charged", name: "靠近了", min: 40 },
    { id: "burning", name: "很近了", min: 60 },
    { id: "blazing", name: "今晚可以更近", min: 80 }
  ];
  var PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] };
  var MINI_NAME = { thermo: "温度计", "truth-wheel": "真心话转盘", "dare-wheel": "大冒险转盘" };
  /* 图例（copy §2.6 + §2.5 的格名说明；V6.1：起飞规则补保底） */
  var LEGEND = [
    ["起飞格", "从这里起飞：掷出 6；连续两次没起飞，这一掷任意点数保底起飞"],
    ["真心话格", "抽一张真心话"],
    ["大冒险格", "抽一张大冒险"],
    ["靠近格", "抽一张靠近的题"],
    ["温度计格 / 转盘格", "小游戏：温度计 / 转盘"],
    ["飞格 / 跳格", "向前 12 格 / 4 格；停格不跳"],
    ["进航格", "转进自己的航线"],
    ["命运格", "两张里挑一张"],
    ["普通格", "不抽题，走过去"]
  ];

  /* 单屏实例共享的对局状态（mount 时赋值；同一时刻只有一个主桌） */
  var state = null;
  /* 当前主桌的 owner：BoardView 是单例，快速连开两局时上一屏的延迟 cleanup
   * 不能把新主桌刚挂好的棋盘拆掉（否则棋盘空白）。 */
  var tableOwner = null;

  var CSS = [
    ".v6-table{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;",
    "padding:calc(8px + var(--safe-t,0px)) 12px calc(8px + var(--safe-b,0px));",
    "color:var(--ink,#FBF3E7);font-family:var(--sans,-apple-system,'PingFang SC','Microsoft YaHei',sans-serif);",
    /* V6.2：背景交给机舱场景层；场景缺席时用暗色兜底（不再是紫色渐变） */
    "background:#08060F;}",
    ".v6-table *{box-sizing:border-box}",
    /* V6.2 机舱场景层（cabin.js）：全屏、只做背景，不吃点按。
     * 层级：机舱 z0 < 棋盘 wrap z1 < HUD/状态/回合/掷骰条/行动区 z2 < 题卡/小游戏宿主 z30+。
     * cabin.js 自己也会设 pointer-events:none；这里再兜一层，保证任何情况下都不拦截棋盘点击。 */
    ".v6-cabin{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}",
    ".v6-cabin,.v6-cabin *{pointer-events:none!important}",
    /* HUD：暂停/图例在左，右上 96×56 留给全局安全词（禁止重叠） */
    ".v6-hud{position:relative;z-index:2;flex:none;display:flex;align-items:flex-start;gap:8px}",
    ".v6-hud-tools{display:flex;gap:6px;flex:1;min-width:0}",
    ".v6-safe-slot{width:96px;height:56px;flex:none}",
    ".v6-icon-btn{min-width:44px;min-height:44px;padding:0 10px;border-radius:14px;cursor:pointer;",
    "border:1px solid var(--line,rgba(255,226,196,.13));background:var(--glass,rgba(38,27,58,.42));",
    "color:var(--dim,#C9B6CE);font-size:12px;letter-spacing:.08em;font-family:inherit;",
    "display:inline-flex;align-items:center;justify-content:center}",
    ".v6-icon-btn:active{transform:scale(.97)}",
    /* 状态条 */
    ".v6-status{position:relative;z-index:2;flex:none;padding:6px 2px 0;display:flex;flex-direction:column;gap:2px;min-width:0}",
    ".v6-status-line{font-size:11px;letter-spacing:.06em;color:var(--dim2,#8E7C9E);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}",
    ".v6-status-main{font-size:12.5px;font-weight:600;letter-spacing:.02em;color:var(--ink,#FBF3E7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-variant-numeric:tabular-nums}",
    ".v6-stage{margin-left:6px;font-size:11px;font-weight:700;color:var(--amber,#F3C077)}",
    /* 回合条 */
    ".v6-turns{position:relative;z-index:2;flex:none;display:flex;align-items:center;gap:6px;margin-top:6px;padding:5px;border-radius:20px;",
    "background:var(--glass,rgba(38,27,58,.42));border:1px solid var(--line,rgba(255,226,196,.13))}",
    ".v6-turn{flex:1;min-width:0;display:flex;align-items:center;gap:7px;padding:7px 10px;border-radius:15px}",
    ".v6-turn .v6-tdot{width:10px;height:10px;border-radius:50%;flex:none}",
    ".v6-turn .v6-tnm{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".v6-turn .v6-tclr{font-size:10px;letter-spacing:.08em;color:var(--dim2,#8E7C9E);flex:none}",
    ".v6-turn .v6-tstate{margin-left:auto;font-size:10px;letter-spacing:.1em;color:var(--dim2,#8E7C9E);flex:none}",
    ".v6-turn.on .v6-tstate{color:var(--amber,#F3C077)}",
    ".v6-turn-sep{width:1px;height:22px;background:var(--line,rgba(255,226,196,.16));flex:none}",
    /* 掷骰条（点数 / 落点 / 提示 / 收尾横幅）：题卡是 fixed 底部 dock，这一条不会被遮住 */
    ".v6-rollstrip{position:relative;z-index:2;flex:none;display:flex;align-items:flex-start;gap:9px;margin-top:6px;padding:7px 9px;border-radius:16px;",
    "background:var(--glass,rgba(38,27,58,.42));border:1px solid var(--line,rgba(255,226,196,.13))}",
    ".v6-die{position:relative;width:38px;height:38px;flex:none;border-radius:10px;display:grid;padding:6px;gap:2px;",
    "grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);",
    "background:linear-gradient(160deg,#3A2418,#24150E);box-shadow:0 1px 0 rgba(255,226,196,.25) inset}",
    ".v6-die[data-value=\"0\"] i{opacity:0}",
    ".v6-die[data-value=\"0\"]{background:rgba(24,16,34,.85);box-shadow:inset 0 0 0 1px rgba(255,226,196,.14)}",
    ".v6-die[data-value=\"0\"]::after{content:\"\";position:absolute;left:50%;top:50%;width:11px;height:11px;",
    "margin:-6px 0 0 -6px;border-radius:50%;background:rgba(251,235,210,.20)}",
    ".v6-die i{width:6px;height:6px;border-radius:50%;background:transparent;align-self:center;justify-self:center}",
    ".v6-die i.on{background:#FBEBD2;box-shadow:0 0 6px rgba(251,235,210,.45)}",
    ".v6-rollinfo{min-width:0;flex:1;display:flex;flex-direction:column;gap:2px}",
    ".v6-roll-line{display:flex;align-items:baseline;gap:6px;min-width:0;flex-wrap:wrap}",
    ".v6-dietext{font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--ink,#FBF3E7);white-space:nowrap}",
    ".v6-lsep{color:var(--dim2,#8E7C9E);font-size:11px}",
    ".v6-llabel{font-size:10.5px;letter-spacing:.1em;color:var(--dim2,#8E7C9E);flex:none}",
    ".v6-roll-line.v6-empty .v6-lsep,.v6-roll-line.v6-empty .v6-llabel,.v6-roll-line.v6-empty .v6-landing-btn{display:none}",
    ".v6-landing-btn{min-height:26px;padding:1px 0;border:0;background:transparent;cursor:pointer;font-family:inherit;",
    "font-size:12px;font-weight:600;letter-spacing:.02em;color:var(--amber,#F3C077);text-align:left;",
    "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}",
    ".v6-hint{font-size:12px;line-height:1.35;color:var(--rose,#E9887A)}",
    ".v6-hint .v6-reason{display:block;color:var(--dim2,#8E7C9E);font-size:11px}",
    /* V6.1：胜者行（「{姓名} 先到家」）与起飞保底提示（掷骰前，不覆盖「掷出 N」） */
    ".v6-winner{font-size:12.5px;font-weight:700;letter-spacing:.06em;color:#FFD9CE}",
    ".v6-pity{font-size:11.5px;line-height:1.35;color:var(--amber,#F3C077)}",
    ".v6-winner[hidden],.v6-pity[hidden]{display:none}",
    ".v6-ending{display:flex;flex-direction:column;gap:1px}",
    ".v6-ending b{font-size:12.5px;font-weight:700;letter-spacing:.08em;color:#FFD9CE}",
    ".v6-ending span{font-size:11px;color:var(--dim,#C9B6CE)}",
    /* 棋盘容器：棋盘（fe-board）按 720×750 设计稿等比缩放，宿主给定宽高即可。
     * V6.2：wrap 提到 z-index:1，压在机舱场景层（z0）之上；相机只改 .v6-board 的 transform。 */
    ".v6-boardwrap{z-index:1;flex:1;min-height:0;position:relative;margin:4px 0 0;display:flex;align-items:center;justify-content:center}",
    /* 桌面光晕 + 几粒星尘：只做背景，不吃点按，边缘不外露 */
    ".v6-boardwrap::before{content:\"\";position:absolute;left:-12%;right:-12%;top:-6%;bottom:-6%;pointer-events:none;z-index:0;",
    "background:",
    "radial-gradient(52% 44% at 50% 44%,rgba(126,90,196,.30) 0%,rgba(88,60,150,.13) 46%,rgba(88,60,150,0) 74%),",
    "radial-gradient(34% 22% at 50% 90%,rgba(243,192,119,.13) 0%,rgba(243,192,119,0) 78%),",
    "radial-gradient(1.6px 1.6px at 13% 24%,rgba(255,233,210,.55),rgba(255,233,210,0)),",
    "radial-gradient(1.2px 1.2px at 86% 17%,rgba(255,233,210,.45),rgba(255,233,210,0)),",
    "radial-gradient(1.8px 1.8px at 79% 86%,rgba(255,233,210,.40),rgba(255,233,210,0)),",
    "radial-gradient(1.2px 1.2px at 20% 80%,rgba(255,233,210,.35),rgba(255,233,210,0)),",
    "radial-gradient(1px 1px at 48% 5%,rgba(255,233,210,.35),rgba(255,233,210,0))}",
    ".v6-board{position:relative;z-index:1;width:100%;aspect-ratio:720/750;max-height:100%;min-height:0;margin-top:-26px}",
    ".v6-fb{position:absolute;inset:0;overflow:auto;border-radius:18px;padding:10px 12px;",
    "background:rgba(18,12,32,.62);border:1px solid var(--line,rgba(255,226,196,.13))}",
    ".v6-fb h3{margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:.1em;color:var(--dim,#C9B6CE)}",
    ".v6-fb .v6-fb-turn{font-size:12px;color:var(--amber,#F3C077);margin-bottom:6px}",
    ".v6-fb ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}",
    ".v6-fb li{font-size:12px;color:var(--ink,#FBF3E7);display:flex;gap:6px;align-items:center}",
    ".v6-fb li b{font-weight:600}",
    /* 底部行动区：主按钮 / 选子 / 走子状态 + 记下了回执 */
    ".v6-action{position:relative;z-index:2;flex:none;display:flex;flex-direction:column;gap:6px;padding-top:2px}",
    /* 题卡/小游戏层（fixed 底部 dock）打开时，底部行动区让位：避免文字从卡边露出、也防误触 */
    ".v6-table.v6-overlay .v6-action{opacity:0;pointer-events:none}",
    ".v6-actions{display:flex;flex-direction:column;gap:8px}",
    ".v6-choice{display:flex;flex-direction:column;gap:8px}",
    ".v6-btn{min-height:48px;border-radius:999px;border:0;cursor:pointer;font-family:inherit;",
    "font-size:15px;font-weight:700;letter-spacing:.1em}",
    ".v6-btn:active{transform:scale(.99)}",
    ".v6-btn-primary{background:linear-gradient(180deg,var(--amber,#F3C077),var(--amber-deep,#E2965E));color:#2C1C15;",
    "box-shadow:0 8px 20px rgba(226,150,94,.22)}",
    ".v6-btn-soft{background:rgba(255,236,214,.1);color:var(--ink,#FBF3E7);border:1px solid var(--line,rgba(255,226,196,.13))}",
    ".v6-working{min-height:48px;display:flex;align-items:center;justify-content:center;",
    "font-size:13px;letter-spacing:.1em;color:var(--dim2,#8E7C9E)}",
    ".v6-tiny{font-size:10.5px;letter-spacing:.02em;color:var(--dim2,#8E7C9E);text-align:center}",
    ".v6-receipt{font-size:12px;letter-spacing:.04em;color:var(--amber,#F3C077);min-height:0}",
    ".v6-receipt .v6-note{color:var(--dim,#C9B6CE);margin-left:6px;font-size:11.5px}",
    ".v6-finish{min-height:48px;display:flex;align-items:center;justify-content:center;",
    "font-size:18px;font-weight:700;letter-spacing:.16em;color:var(--amber,#F3C077)}",
    /* 宿主层（题卡/小游戏自身是 fixed，宿主只负责挂载点与层级） */
    ".v6-cardhost{position:absolute;inset:0;z-index:30;pointer-events:none}",
    ".v6-cardhost>*{pointer-events:auto}",
    ".v6-cardwrap{position:absolute;inset:0;pointer-events:none}",
    ".v6-cardwrap>*{pointer-events:auto}",
    ".v6-minihost{position:absolute;inset:0;z-index:34;pointer-events:none}",
    ".v6-minihost>*{pointer-events:auto}",
    ".v6-miniwrap{position:absolute;inset:0;pointer-events:none}",
    ".v6-miniwrap>*{pointer-events:auto}",
    /* 组件缺席时的最小兜底面板（不复制题卡/小游戏样式；落地后不会被用到） */
    ".v6-fallback{position:absolute;left:10px;right:10px;bottom:calc(10px + var(--safe-b,0px));z-index:31;",
    "border-radius:22px;padding:16px;pointer-events:auto;",
    "background:linear-gradient(180deg,var(--paper,#F7EAD6),var(--paper2,#F1DFC4));color:var(--paper-ink,#2C1C15)}",
    ".v6-fallback h3{margin:0 0 6px;font-size:17px}",
    ".v6-fallback p{margin:0 0 12px;font-size:14px;line-height:1.55;color:#5c4130}",
    ".v6-fallback .v6-mactions{display:flex;gap:8px}",
    ".v6-fallback .v6-mbtn{flex:1;min-height:46px;border-radius:999px;font-size:15px;font-weight:700;",
    "font-family:inherit;border:0;cursor:pointer}",
    ".v6-fallback .v6-mbtn.done{background:#2C1C15;color:#FFF4E4}",
    ".v6-fallback .v6-mbtn.skip{background:transparent;border:1px solid rgba(60,35,24,.28);color:#6E4A33}",
    ".v6-legend{margin:0;padding:0 0 0 2px;list-style:none;display:flex;flex-direction:column;gap:8px}",
    ".v6-legend li{font-size:13px;line-height:1.5;color:var(--dim,#C9B6CE)}",
    ".v6-legend b{color:var(--ink,#FBF3E7)}",
    "@media (max-height:720px){",
    ".v6-table{padding-top:calc(6px + var(--safe-t,0px));padding-bottom:calc(6px + var(--safe-b,0px))}",
    ".v6-status-line{font-size:10px}",
    ".v6-status-main{font-size:11.5px}",
    ".v6-turns{margin-top:4px;padding:4px}",
    ".v6-turn{padding:5px 8px}",
    ".v6-turn .v6-tnm{font-size:13px}",
    ".v6-rollstrip{margin-top:4px;padding:6px 8px}",
    ".v6-boardwrap{margin:4px 0}",
    ".v6-die{width:32px;height:32px;padding:5px}",
    ".v6-btn{min-height:44px}",
    "}"
  ].join("");

  /* ---------- 小工具 ---------- */
  function now() { return Date.now(); }
  function settings() { try { return App.Store.getSettings() || {}; } catch (e) { return {}; } }
  function reduced() { return !!settings().reduced; }
  function soundOn() { return settings().sound !== false; }
  function sfx(name) { try { if (App.Audio && App.Audio.play) App.Audio.play(name); } catch (e) {} }
  function haptic(kind) { try { if (App.UI && App.UI.haptic) App.UI.haptic(kind); } catch (e) {} }
  function toast(text, kind) { try { App.UI.toast(text, kind ? { kind: kind } : undefined); } catch (e) {} }
  function clone(o) { try { return JSON.parse(JSON.stringify(o)); } catch (e) { return null; } }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function num(v, d) { var n = Number(v); return isNaN(n) ? (d || 0) : n; }
  function pieceById(s, id) {
    var list = (s && s.pieces) || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function slotOf(piece) {
    if (!piece || !piece.id) return 0;
    var n = Number(String(piece.id).split(":")[1]);
    return isNaN(n) ? 0 : n;
  }
  function inHangar(piece) { return !!(piece && String(piece.squareId || "").indexOf("hangar:") === 0); }
  function colorOf(pid) { return (state && state.colors && state.colors[pid]) || "red"; }
  function nameOf(pid) { return (state && state.names && state.names[pid]) || "对方"; }
  function colorName(c) { return CN[c] || "红"; }

  /* ---------- 状态读取（V6 字段优先，旧存档兜底；视图只读这些） ---------- */
  function metaOf(s) { return (s && s.meta) || {}; }
  function heatOf(s) { return clamp(num(metaOf(s).heat, 0), 0, 100); }
  function streakOf(s) { return Math.max(0, Math.round(num(metaOf(s).streak, 0))); }
  function stageOf(s) {
    var m = metaOf(s), h = heatOf(s), out = STAGES[0], i = 0;
    /* 阶段名以 fe-shell 的 App.UI.HEAT_STAGES 为准，避免两套文案 */
    try {
      if (App.UI && typeof App.UI.heatStage === "function") {
        var st = App.UI.heatStage(h);
        if (st && st.name) return st;
      }
    } catch (e) {}
    if (m.stage) for (i = 0; i < STAGES.length; i++) if (STAGES[i].id === m.stage) return STAGES[i];
    for (i = 0; i < STAGES.length; i++) if (h >= STAGES[i].min) out = STAGES[i];
    return out;
  }
  /* ---------- V6.1 规则投影：已到家数 / 起飞保底 / 胜者 ----------
   * 依据 impl-freeze-v6.1 §3.2：状态条读双方「已到家」，掷骰前读起飞保底，胜者读 win 事件 / winnerId。
   * 新字段优先（view.planesHome / view.takeoff / state.winnerId），缺失时用 pieces / takeoffMiss 兜底，
   * 保证 BE 未就绪的旧档也能渲染（不报错、不出现目标暗示）。 */
  function viewOf(s) {
    try {
      if (App.Flight && typeof App.Flight.view === "function") return App.Flight.view(s, { reduced: reduced() }) || {};
    } catch (e) {}
    return {};
  }
  function piecePlayerId(p, s) {
    if (!p) return "";
    if (p.playerId) return String(p.playerId);
    var colors = (s && s.colors) || {}, ids = Object.keys(colors), i = 0;
    for (i = 0; i < ids.length; i++) if (colors[ids[i]] === p.color) return ids[i];
    return String(p.id || "").split(":")[0] || "";
  }
  /* 每人本局飞机数（快局 2 / 长夜 4）：按 pieces 实测，缺 pieces 时退回 planeCount */
  function planeTotalsOf(s) {
    var out = { a: 0, b: 0 };
    ((s && s.pieces) || []).forEach(function (p) {
      var pid = piecePlayerId(p, s);
      if (out[pid] != null) out[pid]++;
    });
    var fallback = num(s && s.planeCount, 0);
    ["a", "b"].forEach(function (pid) { if (!out[pid] && fallback > 0) out[pid] = fallback; });
    return out;
  }
  function planesHomeOf(s) {
    var total = planeTotalsOf(s), out = { a: 0, b: 0 };
    var v = viewOf(s), raw = v && v.planesHome;
    if (raw && typeof raw.a === "number" && typeof raw.b === "number") {
      return { a: clamp(Math.round(raw.a), 0, total.a), b: clamp(Math.round(raw.b), 0, total.b), total: total };
    }
    ((s && s.pieces) || []).forEach(function (p) {
      if (!p || !p.arrived) return;
      var pid = piecePlayerId(p, s);
      if (out[pid] != null) out[pid]++;
    });
    return { a: out.a, b: out.b, total: total };
  }
  /* 该玩家所有「未到家」飞机都在机坪（已全部到家时不算——避免把赢家当成「可保底起飞」） */
  function allUnarrivedInHangar(s, pid) {
    var list = ((s && s.pieces) || []).filter(function (p) { return piecePlayerId(p, s) === pid && !p.arrived; });
    if (!list.length) return false;
    for (var i = 0; i < list.length; i++) if (!inHangar(list[i])) return false;
    return true;
  }
  function takeoffOf(s) {
    var v = viewOf(s), t = v && v.takeoff;
    if (t && typeof t === "object" && typeof t.pity === "boolean") return { pity: t.pity, misses: t.misses || null };
    /* 旧引擎：takeoffMiss 达 2 且都在机坪 → 本回合保底 */
    var pid = (s && s.turn) || "a";
    var misses = (s && s.takeoffMiss) || {};
    return { pity: clamp(num(misses[pid], 0), 0, 2) >= 2 && allUnarrivedInHangar(s, pid), misses: misses };
  }
  /* 胜者：win 事件 / state.winnerId 优先；都缺失时按「一方全部到家」兜底（V6.1 结束条件）。
   * 安全词结束（safe-ended）不是胜负收尾，不显示胜者。 */
  function winnerOf(s, hint) {
    if (!s || s.phase === "safe-ended") return "";
    var pid = (hint === "a" || hint === "b") ? hint : (s && (s.winnerId === "a" || s.winnerId === "b") ? s.winnerId : "");
    if (pid !== "a" && pid !== "b") {
      pid = "";
      var home = planesHomeOf(s);
      ["a", "b"].forEach(function (x) { if (!pid && home.total[x] > 0 && home[x] >= home.total[x]) pid = x; });
    }
    return (pid === "a" || pid === "b") ? pid : "";
  }
  function cardsProcessedOf(s) {
    if (s && typeof s.cardsProcessed === "number") return Math.max(0, s.cardsProcessed);
    var n = 0, log = (s && s.log) || [];
    for (var i = 0; i < log.length; i++) {
      var e = log[i];
      if (!e || !e.outcome || !CARD_KINDS[e.kind]) continue;
      n++;
    }
    return n;
  }
  function flyingOf(s) {
    var n = 0;
    ((s && s.pieces) || []).forEach(function (p) { if (!p.arrived && !inHangar(p)) n++; });
    return n;
  }
  /* 回合数：log 里出手顺序换手两次算一回合（6 点额外掷骰不换手，不计） */
  function roundOf(s) {
    var log = (s && s.log) || [], last = null, changes = 0, rolls = 0;
    for (var i = 0; i < log.length; i++) {
      var e = log[i];
      if (!e || e.kind !== "roll") continue;
      rolls++;
      if (last !== null && e.actorId !== last) changes++;
      last = e.actorId;
    }
    return rolls ? 1 + Math.floor(changes / 2) : 1;
  }
  function isEnding(s) { return !!s && !!s.awaiting && s.awaiting.type === "ending-prompt"; }
  function endingIndex(s) { return Math.max(0, Math.round(num(s && s.endingIndex, 0))); }

  /* ---------- 格名（copy §2.5：{grid} · 第 {n} 格） ---------- */
  function boardApi() { return App.FlightBoard || null; }
  function gridName(squareId, moverColor) {
    var B = boardApi();
    if (!B || !squareId) return "—";
    var loc = null;
    try { loc = B.parseSquare(squareId); } catch (e) { return "—"; }
    if (!loc) return "—";
    if (loc.type === "hangar") return "机坪";
    if (loc.type === "goal") return "终点";
    if (loc.type === "home") return "回家第 " + (loc.step + 1) + " 格";
    var sq = null;
    try { sq = B.square(squareId); } catch (e) { sq = null; }
    if (!sq) return "第 " + loc.n + " 格";
    var color = sq.color;
    if (loc.n === B.TAKEOFF[color]) return "起飞格";
    if (sq.isFly) return "飞格";
    if (B.homeEntryOf && B.homeEntryOf[color] === squareId) return "进航格";
    if (loc.n === B.mod(B.TAKEOFF[color] + 48)) return "停格";
    if (sq.kind === "truth") return "真心话格";
    if (sq.kind === "dare") return "大冒险格";
    if (sq.kind === "touch") return "靠近格";
    if (sq.kind === "thermo") return "温度计格";
    if (sq.kind === "wheel") return "转盘格";
    if (moverColor && color === moverColor) return "跳格";
    return "普通格";
  }
  function landingText(squareId, moverColor) {
    var B = boardApi(), loc = null;
    var grid = gridName(squareId, moverColor);
    if (!B || !squareId) return { text: grid, square: "" };
    try { loc = B.parseSquare(squareId); } catch (e) { loc = null; }
    if (loc && loc.type === "ring") return { text: grid + " · 第 " + loc.n + " 格", square: squareId };
    if (loc && loc.type === "hangar") return { text: "机坪", square: squareId };
    return { text: grid, square: squareId };
  }

  /* ---------- 屏幕 ---------- */
  App.Screens = App.Screens || {};
  App.Screens.table = {
    mount: function (root) {
      state = null;
      try { state = App.Store.getSession(); } catch (e) { state = null; }
      if (!state || state.kind !== "flight") { App.Router.reset("boot"); return; }

      App.UI.injectStyle("v6-table", CSS);

      var alive = true;
      var busy = false;
      var forcedDie = null;
      var workText = "";
      var dieText = "还没掷骰";
      var dieValue = 0;
      var landing = { text: "—", square: "" };
      var hintText = "";
      var hintReason = "";
      var winnerId = (state.winnerId === "a" || state.winnerId === "b") ? state.winnerId : null;
                                  /* V6.1：win 事件 / state.winnerId 记住的胜者（"a"|"b"|null） */
      var receiptText = "";
      var receiptNote = "";
      var heatDeltaText = "";
      var finishText = "";
      var finishing = false;
      var pauseAccum = 0;
      var tickAt = now();
      var startedAt = num(state.startedAt || state.ts, now());
      var cardClose = null;
      var miniClose = null;
      var openKey = null;
      var boardReady = false;
      var ticker = null;
      var finishTimer = null;
      var owner = U.uid();
      tableOwner = owner;

      root.innerHTML =
        '<div class="v6-table" data-test="table">' +
          /* V6.2：机舱场景宿主（cabin.js 挂进来；缺席时这层是空的，主桌照常） */
          '<div class="v6-cabin" data-test="cabin"></div>' +
          '<div class="v6-hud">' +
            '<div class="v6-hud-tools">' +
              '<button type="button" class="v6-icon-btn" data-act="pause" data-test="pause" aria-label="先停一下">暂停</button>' +
              '<button type="button" class="v6-icon-btn" data-act="rules" data-test="rules" aria-label="玩法速览">规则</button>' +
            '</div>' +
            '<div class="v6-safe-slot" data-test="safe-slot" aria-hidden="true"></div>' +
          '</div>' +
          '<div class="v6-status" data-test="status">' +
            '<div class="v6-status-line">' +
              '<span data-test="round">第 1 回合</span> · ' +
              '<span data-test="duration">今晚 0:00</span> · ' +
              '<span data-test="flying">在飞 0 架</span> · ' +
              '<span data-test="status-cards">第 0 张</span>' +
            '</div>' +
            '<div class="v6-status-main">' +
              '<span data-test="status-home">' +
                '<span data-test="status-home-a">红 0/2</span><span> · </span>' +
                '<span data-test="status-home-b">黄 0/2</span>' +
              '</span><span> · </span>' +
              '<span data-test="status-heat">心动值 0</span><span> · </span>' +
              '<span data-test="status-streak">连击 0</span>' +
              '<i class="v6-stage" data-test="heat-stage">灯刚亮</i>' +
            '</div>' +
          '</div>' +
          '<div class="v6-turns" data-test="turns">' +
            '<div class="v6-turn" data-test="turn-a"><i class="v6-tdot"></i><span class="v6-tnm"></span><span class="v6-tclr"></span><span class="v6-tstate"></span></div>' +
            '<span class="v6-turn-sep"></span>' +
            '<div class="v6-turn" data-test="turn-b"><i class="v6-tdot"></i><span class="v6-tnm"></span><span class="v6-tclr"></span><span class="v6-tstate"></span></div>' +
          '</div>' +
          '<div class="v6-rollstrip">' +
            '<div class="v6-die" data-test="die-face" data-value="0" aria-hidden="true">' +
              "<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>" +
            '<div class="v6-rollinfo">' +
              '<div class="v6-roll-line">' +
                '<span class="v6-dietext" data-test="die-text">还没掷骰</span>' +
                '<span class="v6-lsep">·</span>' +
                '<span class="v6-llabel">落点</span>' +
                '<button type="button" class="v6-landing-btn" data-act="legend" data-test="landing">—</button>' +
              "</div>" +
              '<div class="v6-winner" data-test="winner-text" hidden></div>' +
              '<div class="v6-pity" data-test="takeoff-pity" hidden></div>' +
              '<div class="v6-hint" data-test="hint"></div>' +
            "</div>" +
          "</div>" +
          '<div class="v6-boardwrap"><div class="v6-board" data-board data-test="board"></div></div>' +
          '<div class="v6-action" data-test="action">' +
            '<div class="v6-actions" data-test="actions"></div>' +
            '<div class="v6-receipt" data-test="receipt"></div>' +
          "</div>" +
          '<div class="v6-cardhost" data-test="prompt-host"></div>' +
          '<div class="v6-minihost" data-test="minigame-host"></div>' +
        "</div>";

      var rootEl = root.querySelector(".v6-table");
      var cabinHost = root.querySelector("[data-test=cabin]");
      var boardEl = root.querySelector("[data-board]");
      var rollInfoEl = root.querySelector(".v6-rollinfo");
      var actionsEl = root.querySelector("[data-test=actions]");
      var hintEl = root.querySelector("[data-test=hint]");
      var receiptEl = root.querySelector("[data-test=receipt]");
      var cardHost = root.querySelector("[data-test=prompt-host]");
      var miniHost = root.querySelector("[data-test=minigame-host]");
      var dieEl = root.querySelector("[data-test=die-face]");
      var dieTextEl = root.querySelector("[data-test=die-text]");
      var landingEl = root.querySelector("[data-test=landing]");

      /* ---------- 存储：状态先于动画（api-contract §8 ⑤） ---------- */
      function saveSession() {
        try {
          if (!state) return;
          if (state.phase !== "playing" && state.phase !== "setup") return;
          App.Store.saveSession(state);
        } catch (e) { if (window.console) console.error("[table] save", e); }
      }

      /* ---------- 棋盘门面（App.BoardView 的 6 个方法，全部防御式） ---------- */
      function snapshot() {
        var v = {};
        try {
          if (App.Flight && typeof App.Flight.view === "function") v = App.Flight.view(state, { reduced: reduced() }) || {};
        } catch (e) { v = {}; }
        if (!v.pieces) v.pieces = (state.pieces || []).map(function (p) {
          return { id: p.id, color: p.color, squareId: p.squareId, arrived: !!p.arrived, stackGroupId: p.stackGroupId || null };
        });
        if (!v.turn) v.turn = state.turn;
        if (!v.colors) v.colors = state.colors;
        if (!v.names) v.names = state.names;
        if (!v.awaiting) v.awaiting = state.awaiting;
        if (!v.meta) { var st = stageOf(state); v.meta = { heat: heatOf(state), stage: st.id, stageName: st.name, streak: streakOf(state) }; }
        v.choices = (state.awaiting && state.awaiting.type === "choose-piece") ? (state.awaiting.pieceIds || []) : [];
        v.reduced = reduced();
        return v;
      }

      function syncBoard() {
        var bv = App.BoardView;
        if (!boardReady) { paintFallbackBoard(); return; }
        if (!bv) return;
        try {
          if (typeof bv.setState === "function") bv.setState(snapshot());
          if (typeof bv.setChoices === "function") {
            var wait = state.awaiting || {};
            bv.setChoices((wait.type === "choose-piece" && !busy) ? (wait.pieceIds || []) : []);
          }
        } catch (e) { if (window.console) console.error("[table] board", e); }
      }

      function mountBoard() {
        var bv = App.BoardView;
        boardReady = false;
        if (bv && typeof bv.mount === "function") {
          try {
            bv.mount(boardEl, { reduced: reduced(), sound: soundOn(), mode: settings().boardView });
            if (typeof bv.setReduced === "function") bv.setReduced(reduced());
            if (typeof bv.setSound === "function") bv.setSound(soundOn());
            boardReady = true;
          } catch (e) {
            if (window.console) console.error("[table] board mount", e);
            toast("棋盘换成列表了，一样能走完。");
          }
        }
        if (!boardReady) paintFallbackBoard();
        syncBoard();
      }

      /* ---------- V6.2 机舱场景（App.CabinScene，并行开发；缺席/抛错都不阻塞主桌） ----------
       * 契约（docs/v6/impl-freeze-cabin.md §4.1/§4.2）：
       *   mount(host,{boardEl,reduced,sound,names?}) -> instance|null / unmount / setMood(mood) /
       *   play(events,{state}) -> Promise（永不 reject）/ setReduced / setSound。
       * 这里所有调用都防御：模块没落地、mount 返回 null、play 抛错，主桌都照常走。 */
      function cabinApi() {
        try { return (App && App.CabinScene) || null; } catch (e) { return null; }
      }
      function cabinHas(fn) {
        var c = cabinApi();
        return !!(c && typeof c[fn] === "function");
      }
      function mountCabin() {
        if (!cabinHost) return;
        var c = cabinApi();
        if (!c || typeof c.mount !== "function") return;     /* 场景未就绪：空宿主即可 */
        try {
          c.mount(cabinHost, {
            boardEl: boardEl,
            reduced: reduced(),
            sound: soundOn(),
            names: (state && state.names) || null
          });
        } catch (e) {
          if (window.console) console.warn("[table] cabin mount 失败，主桌继续", e);
        }
      }
      /* 镜头遮罩位：true = 题卡/小游戏打开（cabin 会拉远压暗），其余 false（fe-cabin 2026-11-18 对齐） */
      function overlayOf() {
        if (!state) return false;
        var wait = state.awaiting || {};
        return wait.type === "prompt" || wait.type === "ending-prompt" || wait.type === "minigame";
      }
      function syncCabinMood() {
        if (!cabinHas("setMood") || !state) return;
        try {
          var st = stageOf(state);
          cabinApi().setMood({
            heat: heatOf(state),
            stage: st.id,
            turn: state.turn || null,
            winner: winnerOf(state, winnerId) || null,
            phase: state.phase || "",
            overlay: overlayOf()
          });
        } catch (e) {
          if (window.console) console.warn("[table] cabin setMood 失败", e);
        }
      }
      /* 与 playBoard(events) 并行：不 await；场景失败（含异常/拒绝）不影响棋局 */
      function playCabin(events) {
        if (!cabinHas("play") || !events || !events.length || !state) return;
        try {
          var p = cabinApi().play(events, { state: state });
          if (p && typeof p.then === "function") {
            p.then(null, function (e) {
              if (window.console) console.warn("[table] cabin play 失败（已忽略）", e);
            });
          }
        } catch (e) {
          if (window.console) console.warn("[table] cabin play 失败（已忽略）", e);
        }
      }

      /* 降级棋盘（copy §2.7；B9）：列表也能走完主路径 */
      function paintFallbackBoard() {
        if (!boardEl) return;
        var box = boardEl.querySelector("[data-test=board-fallback]");
        if (!box) {
          boardEl.innerHTML =
            '<div class="v6-fb" data-test="board-fallback">' +
              "<h3>今晚的飞机</h3><div class=\"v6-fb-turn\"></div><ul></ul>" +
            "</div>";
          box = boardEl.querySelector("[data-test=board-fallback]");
        }
        var turnEl = box.querySelector(".v6-fb-turn");
        if (turnEl) turnEl.textContent = "现在轮到 " + nameOf(state.turn);
        var rows = "";
        (state.pieces || []).forEach(function (p) {
          rows += "<li><b>" + U.escape(colorName(p.color) + " · 第 " + (slotOf(p) + 1) + " 架") + "</b> · " +
            U.escape(p.arrived ? "终点" : gridName(p.squareId, p.color)) + "</li>";
        });
        var ul = box.querySelector("ul");
        if (ul) ul.innerHTML = rows;
      }

      /* ---------- 绘制 ---------- */
      function setText(el, text) { if (el && el.textContent !== text) el.textContent = text; }

      function hexA(hex, a) {
        var m = /^#([0-9a-f]{6})$/i.exec(hex || "");
        if (!m) return "rgba(255,255,255," + a + ")";
        var n = parseInt(m[1], 16);
        return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
      }

      function durationText() {
        var ms = Math.max(0, now() - startedAt - pauseAccum);
        if (App.UI && typeof App.UI.fmtDuration === "function") {
          try { return App.UI.fmtDuration(ms); } catch (e) {}
        }
        var sec = Math.floor(ms / 1000);
        return Math.floor(sec / 60) + ":" + pad2(sec % 60);
      }
      function paintDuration() { setText(root.querySelector("[data-test=duration]"), "今晚 " + durationText()); }

      function paintHud() {
        var st = stageOf(state);
        setText(root.querySelector("[data-test=round]"), "第 " + roundOf(state) + " 回合");
        paintDuration();
        setText(root.querySelector("[data-test=flying]"), "在飞 " + flyingOf(state) + " 架");
        /* V6.1：状态条改读「已到家」；「第 N 张」只作过程计数，不再和目标数比较（不暗示结束） */
        setText(root.querySelector("[data-test=status-cards]"), "第 " + cardsProcessedOf(state) + " 张");
        var home = planesHomeOf(state);
        ["a", "b"].forEach(function (pid) {
          setText(root.querySelector("[data-test=status-home-" + pid + "]"),
            colorName(colorOf(pid)) + " " + home[pid] + "/" + home.total[pid]);
        });
        setText(root.querySelector("[data-test=status-heat]"), "心动值 " + heatOf(state));
        setText(root.querySelector("[data-test=status-streak]"), "连击 " + streakOf(state));
        setText(root.querySelector("[data-test=heat-stage]"), st.name);
        paintTurns();
      }

      /* 起飞保底（impl-freeze §3.2）：只在「本回合还没掷骰」时提示；掷骰结果文本仍是「掷出 N」 */
      function paintPity() {
        var el = root.querySelector("[data-test=takeoff-pity]");
        if (!el) return;
        var wait = (state && state.awaiting) || {};
        var show = !finishing && wait.type === "roll" && takeoffOf(state).pity;
        el.hidden = !show;
        setText(el, show ? "连续两次没起飞 · 这一掷任意点数保底起飞" : "");
      }

      /* 胜者（impl-freeze §3.2）：win 事件 / state.winnerId → 「{姓名} 先到家」；不出现输/赢/胜/负 */
      function paintWinner() {
        var el = root.querySelector("[data-test=winner-text]");
        if (!el) return;
        var pid = winnerOf(state, winnerId);
        el.hidden = !pid;
        setText(el, pid ? (nameOf(pid) + " 先到家") : "");
      }

      function paintTurns() {
        ["a", "b"].forEach(function (pid) {
          var el = root.querySelector("[data-test=turn-" + pid + "]");
          if (!el) return;
          var on = state.turn === pid, color = colorOf(pid);
          el.classList.toggle("on", on);
          var dot = el.querySelector(".v6-tdot");
          if (dot) {
            dot.style.background = INK[color] || "#fff";
            dot.style.boxShadow = on ? ("0 0 12px 2px " + hexA(INK[color], 0.5)) : "none";
            dot.style.opacity = on ? "1" : ".7";
          }
          /* 选中方的主文本就是「{name} 的回合」（AC-B6-1）；data-test 只挂在当前回合这一侧 */
          var nm = el.querySelector(".v6-tnm");
          var stt = el.querySelector(".v6-tstate");
          if (nm) {
            nm.textContent = on ? (nameOf(pid) + " 的回合") : nameOf(pid);
            nm.setAttribute("data-test", on ? "turn-name" : "turn-name-off");
          }
          if (stt) {
            stt.textContent = on ? "" : "下一手";
            stt.style.display = on ? "none" : "";
          }
          setText(el.querySelector(".v6-tclr"), colorName(color) + "方");
          el.style.background = on ? ("linear-gradient(180deg," + hexA(INK[color], 0.16) + "," + hexA(INK[color], 0.04) + ")") : "transparent";
          el.style.boxShadow = on ? ("inset 0 0 0 1px " + hexA(INK[color], 0.3)) : "none";
        });
      }

      function paintDie() {
        if (!dieEl) return;
        dieEl.setAttribute("data-value", String(dieValue || 0));
        var pips = PIPS[dieValue] || [], cells = dieEl.querySelectorAll("i");
        for (var i = 0; i < cells.length; i++) cells[i].className = (pips.indexOf(i) >= 0 ? "on" : "");
        setText(dieTextEl, dieText);
      }

      function paintTexts() {
        var lineEl = root.querySelector(".v6-roll-line");
        if (lineEl) lineEl.classList.toggle("v6-empty", !landing.square);
        if (landingEl) {
          landingEl.textContent = landing.text || "—";
          if (landing.square) landingEl.setAttribute("data-landing-square", landing.square);
          else landingEl.removeAttribute("data-landing-square");
        }
        if (hintEl) {
          hintEl.innerHTML = hintText
            ? U.escape(hintText) + (hintReason ? '<span class="v6-reason">' + U.escape(hintReason) + "</span>" : "")
            : "";
        }
        if (receiptEl) {
          receiptEl.innerHTML =
            (receiptText ? '<span data-test="receipt-text">' + U.escape(receiptText) + "</span>" : "") +
            (heatDeltaText ? '<span class="v6-note" data-test="heat-delta">' + U.escape(heatDeltaText) + "</span>" : "") +
            (receiptNote ? '<span class="v6-note" data-test="receipt-note">' + U.escape(receiptNote) + "</span>" : "");
        }
        var banner = rollInfoEl && rollInfoEl.querySelector("[data-test=ending-start]");
        if (rollInfoEl) {
          if (isEnding(state)) {
            if (!banner) {
              banner = document.createElement("div");
              banner.className = "v6-ending";
              banner.setAttribute("data-test", "ending-start");
              rollInfoEl.appendChild(banner);
            }
            banner.innerHTML = "<b>今晚最后一段</b>" +
              '<span data-test="ending-card-label">收尾卡 · 第 ' + (endingIndex(state) + 1) + "/2 张</span>";
          } else if (banner) {
            banner.remove();
          }
        }
      }

      function paint() {
        paintHud();
        paintTexts();
        paintPity();
        paintWinner();
        paintDie();
        syncBoard();
      }

      /* ---------- 底部行动区 ---------- */
      function renderActions() {
        if (!actionsEl) return;
        var wait = state.awaiting || {};
        var html = "";
        if (finishing) {
          html = '<div class="v6-finish" data-test="finish-text">' + U.escape(finishText || "今晚完成了") + "</div>" +
            '<div class="v6-tiny">今晚的记录都留在这儿。</div>' +
            '<button type="button" class="v6-btn v6-btn-primary" data-act="to-ledger" data-test="finish-review">看今晚回顾</button>';
        } else if (busy) {
          html = '<div class="v6-working" data-test="working">' + U.escape(workText || "骰子转着呢…") + "</div>";
        } else if (wait.type === "roll") {
          html = '<button type="button" class="v6-btn v6-btn-primary" data-act="roll" data-test="roll">掷骰</button>';
        } else if (wait.type === "choose-piece") {
          var ids = wait.pieceIds || [], i = 0;
          html += '<div class="v6-choice">';
          for (i = 0; i < ids.length; i++) {
            var p = pieceById(state, ids[i]);
            var label = colorName(p && p.color) + " · 第 " + (slotOf(p) + 1) + " 架 · " + (inHangar(p) ? "从机坪起飞" : "沿航线走");
            html += '<button type="button" class="v6-btn v6-btn-soft" data-act="piece" data-action-piece="' +
              U.escape(ids[i]) + '" data-test="piece-choice">' + U.escape(label) + "</button>";
          }
          html += "</div>";
          html += '<div class="v6-tiny">这步可以走这几架 · 也可以直接点棋盘上亮着的飞机</div>';
        }
        actionsEl.innerHTML = html;
      }

      function render() {
        paint();
        renderActions();
        if (!busy && !finishing) syncHosts();
        syncCabinMood();          /* V6.2：机舱读当前热度/阶段/回合/胜者/遮罩 */
      }

      /* ---------- 交互层宿主（题卡/小游戏组件自己是 fixed 层） ---------- */
      function closeHosts() {
        try { if (typeof cardClose === "function") cardClose(); } catch (e) {}
        cardClose = null;
        try { if (typeof miniClose === "function") miniClose(); } catch (e) {}
        miniClose = null;
        openKey = null;
        if (cardHost) cardHost.innerHTML = "";
        if (miniHost) miniHost.innerHTML = "";
        if (rootEl) rootEl.classList.remove("v6-overlay");
      }

      function syncHosts() {
        var wait = state.awaiting || {};
        if (finishing || state.phase === "ended" || state.phase === "safe-ended") {
          closeHosts();
          if (rootEl) rootEl.classList.remove("v6-overlay");
          return;
        }
        if (wait.type === "prompt" || wait.type === "ending-prompt") openPrompt(wait);
        else if (wait.type === "minigame") openMinigame(wait);
        else if (openKey) closeHosts();
        if (rootEl) {
          rootEl.classList.toggle("v6-overlay",
            !!(cardHost && cardHost.firstChild) || !!(miniHost && miniHost.firstChild));
        }
      }

      function openPrompt(wait) {
        var prompt = wait.prompt || {};
        var ending = wait.type === "ending-prompt";
        var key = wait.type + ":" + (prompt.id || "x") + ":" + endingIndex(state);
        if (openKey === key && cardHost.firstChild) return;
        closeHosts();
        openKey = key;
        var wrap = document.createElement("div");
        wrap.className = "v6-cardwrap";
        cardHost.appendChild(wrap);
        var handlers = {
          done: function () { resolvePrompt("done"); },
          skipped: function () { resolvePrompt("skipped"); },
          /* 命运格（P1）：prompt.options 二选一，另一张放回 */
          choose: function (cardIndex) { resolvePrompt("done", { cardIndex: cardIndex }); }
        };
        if (App.PromptCard && typeof App.PromptCard.open === "function") {
          try { cardClose = App.PromptCard.open(wrap, prompt, state, handlers); }
          catch (e) {
            if (window.console) console.error("[table] prompt", e);
            promptFallback(wrap, prompt, handlers);
          }
        } else {
          promptFallback(wrap, prompt, handlers);
        }
        if (ending) wrap.setAttribute("data-test", "ending-card");
      }

      /* 题卡组件缺席时的最小宿主（只有做了/放过；样式与内容不复制） */
      function promptFallback(wrap, prompt, handlers) {
        var card = (prompt && prompt.card) || {};
        wrap.innerHTML =
          '<div class="v6-fallback" data-test="prompt-fallback">' +
            "<h3>题目</h3><p>" + U.escape(card.text || "这张没有文字，先跳过也没关系。") + "</p>" +
            '<div class="v6-mactions">' +
              '<button type="button" class="v6-mbtn done" data-act="fb-done" data-test="prompt-done">做了</button>' +
              '<button type="button" class="v6-mbtn skip" data-act="fb-skip" data-test="prompt-skip">放过</button>' +
            "</div>" +
          "</div>";
        wrap.addEventListener("click", function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          if (b.getAttribute("data-act") === "fb-done") handlers.done();
          if (b.getAttribute("data-act") === "fb-skip") handlers.skipped();
        });
      }

      function openMinigame(wait) {
        var kind = wait.kind || "thermo";
        var key = "minigame:" + kind + ":" + (state.turn || "") + ":" + num(state.seq, 0);
        if (openKey === key && miniHost.firstChild) return;
        closeHosts();
        openKey = key;
        var wrap = document.createElement("div");
        wrap.className = "v6-miniwrap";
        miniHost.appendChild(wrap);
        var handlers = {
          done: function (result) { resolveMinigame("done", result); },
          skipped: function () { resolveMinigame("skipped"); }
        };
        if (App.MiniGame && typeof App.MiniGame.open === "function") {
          try { miniClose = App.MiniGame.open(wrap, kind, state, handlers); }
          catch (e) {
            if (window.console) console.error("[table] minigame", e);
            minigameFallback(wrap, kind, handlers);
          }
        } else {
          minigameFallback(wrap, kind, handlers);
        }
      }

      function minigameFallback(wrap, kind, handlers) {
        wrap.innerHTML =
          '<div class="v6-fallback" data-test="minigame-fallback">' +
            "<h3>" + U.escape(MINI_NAME[kind] || "小游戏") + "</h3>" +
            "<p>这一格是小游戏（" + U.escape(MINI_NAME[kind] || kind) + "）。面板由 App.MiniGame.open 提供，这里先记一笔。</p>" +
            '<div class="v6-mactions">' +
              '<button type="button" class="v6-mbtn done" data-act="fb-done" data-test="mini-done">算我完成</button>' +
              '<button type="button" class="v6-mbtn skip" data-act="fb-skip" data-test="mini-skip">跳过</button>' +
            "</div>" +
          "</div>";
        wrap.addEventListener("click", function (e) {
          var b = e.target.closest("[data-act]");
          if (!b) return;
          if (b.getAttribute("data-act") === "fb-done") handlers.done({});
          if (b.getAttribute("data-act") === "fb-skip") handlers.skipped();
        });
      }

      /* ---------- 引擎编排（busy 单飞 + 先落盘后动画） ---------- */
      /* 胜者：win 事件优先，其次 state.winnerId；都没有时 winnerOf 按「一方全部到家」兜底。
       * 只用于文案与回顾（不加分、不惩罚另一方）。 */
      function pickWinner(events) {
        var i = 0, e = null;
        for (i = 0; i < (events || []).length; i++) {
          e = events[i];
          if (e && e.type === "win" && (e.playerId === "a" || e.playerId === "b")) winnerId = e.playerId;
        }
        if (state && (state.winnerId === "a" || state.winnerId === "b")) winnerId = state.winnerId;
        return winnerId;
      }

      function playBoard(events) {
        var bv = App.BoardView;
        if (!boardReady || !bv || typeof bv.play !== "function" || !events || !events.length) return Promise.resolve(null);
        var done = false;
        return new Promise(function (resolve) {
          var watchdog = setTimeout(function () {
            if (done) return;
            done = true;
            if (window.console) console.warn("[table] BoardView.play 超时，先纠偏");
            resolve(null);
          }, 6000);
          function finish() {
            if (done) return;
            done = true;
            clearTimeout(watchdog);
            resolve(null);
          }
          try {
            var p = bv.play(events);
            if (p && typeof p.then === "function") {
              p.then(finish, function (e) {
                if (window.console) console.error("[table] play", e);
                finish();
              });
            } else finish();
          } catch (e) {
            if (window.console) console.error("[table] play", e);
            finish();
          }
        });
      }

      function commit(opts) {
        if (busy || finishing) return Promise.resolve(null);
        closeHosts();
        busy = true;
        workText = opts.work || "正在走…";
        hintText = "";
        hintReason = "";
        render();
        var prev = state;
        var prevHeat = heatOf(prev);
        var ret = null;
        try {
          ret = opts.call();
        } catch (e) {
          if (window.console) console.error("[table] " + (opts.kind || "op"), e);
          ret = { ok: false, error: { message: "这步没有走成" } };
        }
        if (!ret || !ret.ok) {
          toast((ret && ret.error && ret.error.message) || "这步没有走成", "rose");
          sfx("error");
          busy = false;
          workText = "";
          render();
          return Promise.resolve(null);
        }
        state = ret.state;
        var events = ret.events || [];
        pickWinner(events);                                /* ⑥ V6.1：win 事件 → 胜者文案 */
        var ended = (state.phase === "ended" || state.phase === "safe-ended");
        saveSession();                                    /* ⑤ 先落盘，再动画 */
        readResult(opts, prev, ret, events, prevHeat);     /* 文本即时更新（≤500ms） */
        if (ended) armFinish();                           /* ⑥ 结束态：完成文本立刻出，不等演出 */
        render();
        var boardP = playBoard(events);   /* 棋盘演出与机舱镜头并行：场景慢/失败都不拖棋局 */
        playCabin(events);
        return boardP.then(function () {
          if (!alive) return null;
          busy = false;
          workText = "";
          if (ended || state.phase === "ended" || state.phase === "safe-ended") {
            finish();                                     /* 演出已播完：停留后离场 */
            return ret;
          }
          render();                                       /* ⑨ setState 纠偏 + 按 awaiting 重画 */
          return ret;
        });
      }

      /* 一次结算里真正动过的棋子 → 落点文本（roll 也可能自动走子：规则只允许一架时引擎直接走） */
      function movementLanding(events) {
        var moved = null, e = null;
        for (var i = events.length - 1; i >= 0; i--) {
          e = events[i];
          if (e && (e.type === "takeoff" || e.type === "move" || e.type === "jump" || e.type === "fly")) { moved = e.pieceId; break; }
        }
        if (!moved) return null;
        var piece = pieceById(state, moved);
        return piece ? landingText(piece.squareId, piece.color) : null;
      }

      function readResult(opts, prev, ret, events, prevHeat) {
        var kind = opts.kind, i = 0, e = null;
        if (kind === "roll") {
          var die = 0, extra = false;
          for (i = 0; i < events.length; i++) {
            e = events[i];
            if (e && e.type === "dice") { die = num(e.die, 0); extra = !!e.extraRoll; }
          }
          if (die) {
            dieValue = die;
            dieText = "掷出 " + die + (extra ? " · 再掷一次" : "");
          }
          var autoLand = movementLanding(events);
          landing = autoLand || { text: "—", square: "" };
          var legal = null;
          try { legal = App.Flight.legalMoves(prev, die); } catch (err) { legal = null; }
          if (legal && legal.pieceIds && legal.pieceIds.length === 0) {
            hintText = state.turn !== prev.turn
              ? "没有飞机能动，换 " + nameOf(state.turn) + " 掷骰"
              : "没有飞机能动，" + nameOf(state.turn) + " 再掷一次";
            /* 保底提示已经写明起飞规则，这里不再重复一整行（避免三行叠在一起） */
            hintReason = takeoffOf(state).pity ? "" : reasonOf(legal, prev);
            sfx("warn");
          }
          receiptText = "";
          receiptNote = "";
          heatDeltaText = "";
          return;
        }
        if (kind === "move") {
          var land = movementLanding(events);
          if (land) landing = land;
          receiptText = "";
          receiptNote = "";
          heatDeltaText = "";
          return;
        }
        if (kind === "prompt") {
          var stats = heatStats(heatOf(state) - prevHeat);
          heatDeltaText = stats;
          if (opts.ending) {
            receiptText = "";
            receiptNote = "";
            return;
          }
          receiptText = "记下了 · 今晚第 " + cardsProcessedOf(state) + " 张";
          receiptNote = opts.outcome === "skipped" ? "这张先放过 · 连击还在" : "";
          toast(receiptText);
          sfx(opts.outcome === "skipped" ? "soft" : "stamp");
          haptic(opts.outcome === "skipped" ? "light" : "success");
          return;
        }
        if (kind === "minigame") {
          var st = heatStats(heatOf(state) - prevHeat);
          heatDeltaText = st;
          receiptText = opts.outcome === "skipped" ? "这一格先跳过，记下了" : ("这一格记下了" + (st ? " · " + st : ""));
          receiptNote = "";
          toast(receiptText);
          sfx("chime");
          return;
        }
      }

      function heatStats(delta) {
        return (delta && delta > 0) ? ("心动值 +" + delta) : "";
      }

      /* 无合法走子时的具体原因（AC-B2-3） */
      function reasonOf(legal, prev) {
        var blocked = (legal && legal.blocked) || {};
        var needSix = 0, exact = 0, other = 0;
        Object.keys(blocked).forEach(function (id) {
          var p = pieceById(prev, id);
          if (!p || p.playerId !== prev.turn) return;
          var r = blocked[id] && blocked[id].blockedReason;
          if (r === "NEED_SIX_TO_TAKEOFF") needSix++;
          else if (r === "EXACT_COUNT_REQUIRED") exact++;
          else if (r && r !== "NONE") other++;
        });
        if (exact) return "进终点要刚好，这步先停";
        if (needSix) return "都还在机坪：掷出 6 起飞；连续两次没起飞后，这一掷任意点数保底起飞";
        if (other) return "这步走不了";
        return "";
      }

      /* ---------- 动作 ---------- */
      function doRoll() {
        if (busy || finishing) return;
        var wait = state.awaiting || {};
        if (wait.type !== "roll") return;
        var die = forcedDie;
        forcedDie = null;
        commit({
          kind: "roll",
          work: "骰子转着呢…",
          call: function () {
            if (typeof App.Flight.roll !== "function") return { ok: false, error: { message: "引擎没载入" } };
            return die != null ? App.Flight.roll(state, die) : App.Flight.roll(state);
          }
        });
      }

      function doMove(pieceId) {
        if (busy || finishing) return;
        var wait = state.awaiting || {};
        if (wait.type !== "choose-piece") return;
        if ((wait.pieceIds || []).indexOf(pieceId) < 0) { toast("这架这步走不了"); return; }
        commit({
          kind: "move",
          work: "正在走…",
          call: function () {
            if (typeof App.Flight.move !== "function") return { ok: false, error: { message: "引擎没载入" } };
            return App.Flight.move(state, pieceId);
          }
        });
      }

      function resolvePrompt(outcome, opts) {
        if (busy || finishing) return;
        var wait = state.awaiting || {};
        if (wait.type !== "prompt" && wait.type !== "ending-prompt") return;
        var ending = wait.type === "ending-prompt";
        commit({
          kind: "prompt",
          outcome: outcome,
          ending: ending,
          work: "记一笔…",
          call: function () {
            var fn = App.Flight && App.Flight.resolvePrompt;
            if (typeof fn !== "function") return { ok: false, error: { message: "引擎没载入" } };
            return opts ? fn(state, outcome, opts) : fn(state, outcome);
          }
        });
      }

      function resolveMinigame(outcome, result) {
        if (busy || finishing) return;
        var wait = state.awaiting || {};
        if (wait.type !== "minigame") return;
        commit({
          kind: "minigame",
          outcome: outcome,
          work: "记一笔…",
          call: function () {
            var fn = App.Flight && App.Flight.resolveMinigame;
            if (typeof fn !== "function") return { ok: false, error: { message: "引擎没载入" } };
            return fn(state, outcome, result);
          }
        });
      }

      /* ---------- 收尾（无输赢）----------
       * AC-F1-1：一旦 phase 结束，「今晚完成了」必须 ≤500ms 出现。
       * 所以把「完成反馈」与「棋盘演出」解耦：armFinish() 立刻出文本（底部行动区，不挡棋盘），
       * finish() 只负责在演出播完后停留 900ms 再离场。 */
      var finishedEntry = null;

      function armFinish() {
        if (finishing) return;
        finishing = true;
        var safeEnd = state.phase === "safe-ended";
        finishText = safeEnd ? "先收好了" : "今晚完成了";
        receiptText = "";
        receiptNote = "";
        heatDeltaText = "";
        hintText = "";
        hintReason = "";
        render();                       /* finish-text 立即进 DOM（不等 BoardView.play） */
        sfx(safeEnd ? "safe" : "ending");
        haptic(safeEnd ? "heavy" : "success");
        toast(finishText);
        try {
          if (App.Store && App.Store.makeHistoryEntry) finishedEntry = App.Store.makeHistoryEntry(state);
          if (finishedEntry && App.Store.addHistory) App.Store.addHistory(finishedEntry);
        } catch (e) {
          if (window.console) console.error("[table] history", e);
        }
      }

      function finish() {
        armFinish();
        busy = false;
        workText = "";
        if (finishTimer) clearTimeout(finishTimer);
        finishTimer = setTimeout(toLedger, 900);   /* 留一小段时间让玩家看到完成态 */
      }

      /* 结束离场：清 session → 进回顾（「看今晚回顾」按钮走同一条路） */
      function toLedger() {
        if (!alive) return;
        if (finishTimer) { clearTimeout(finishTimer); finishTimer = null; }
        try { if (App.Store && App.Store.clearSession) App.Store.clearSession(); } catch (e) {}
        try { App.Router.reset("ledger", finishedEntry ? { id: finishedEntry.id } : {}); }
        catch (e) { if (window.console) console.error("[table] ledger", e); }
      }

      /* ---------- 暂停 / 安全词：只调 fe-shell 的实现，不重复造 ---------- */
      function openPause() {
        try {
          if (App.Pause && typeof App.Pause.open === "function") { App.Pause.open("table"); return; }
          if (App.Screens && App.Screens.pause && App.Router) { App.Router.go("pause"); return; }
          toast("暂停面板还没载入");
        } catch (e) { if (window.console) console.error("[table] pause", e); }
      }

      function pausedNow() {
        try {
          if (App.Pause && typeof App.Pause.isOpen === "function") return !!App.Pause.isOpen();
          if (document.querySelector('[data-screen="pause"]')) return true;
        } catch (e) {}
        return false;
      }

      /* 规则速览（A5-3）：fe-shell 的 App.UI.rulesSheet；未就绪时 toast 兜底 */
      function openRules() {
        try {
          if (App.UI && typeof App.UI.rulesSheet === "function") { App.UI.rulesSheet(); return; }
          toast("长按右上「先收棋」可以随时停；掷出 6 起飞、6 可再掷");
        } catch (e) { if (window.console) console.error("[table] rules", e); }
      }

      function openLegend() {
        try {
          var html = '<ul class="v6-legend">' + LEGEND.map(function (row) {
            return "<li><b>" + U.escape(row[0]) + "</b> · " + U.escape(row[1]) + "</li>";
          }).join("") + "</ul>";
          if (App.UI && App.UI.sheet) {
            App.UI.sheet({ title: "棋盘上的格子", html: html, label: "棋盘上的格子" });
          } else {
            toast("棋盘上的格子：起飞 / 真心话 / 大冒险 / 靠近 / 小游戏 / 飞跳 / 进航 / 命运");
          }
        } catch (e) { if (window.console) console.error("[table] legend", e); }
      }

      /* ---------- 事件 ---------- */
      function onRootClick(e) {
        var el = e.target && e.target.closest ? e.target.closest("[data-act]") : null;
        if (!el || !rootEl.contains(el)) return;
        var act = el.getAttribute("data-act");
        if (act === "roll") { doRoll(); return; }
        if (act === "piece") { doMove(el.getAttribute("data-action-piece")); return; }
        if (act === "pause") { openPause(); return; }
        if (act === "legend") { openLegend(); return; }
        if (act === "rules") { openRules(); return; }
        if (act === "to-ledger") { toLedger(); return; }
      }

      function onBoardPick(e) {
        if (busy || finishing) return;
        var id = e.detail && e.detail.pieceId;
        if (id) doMove(id);
      }

      function onBoardEvent(e) {
        var ev = (e.detail && e.detail.event) || e.detail;
        if (!ev || !ev.type) return;
        if (ev.type === "jump" || ev.type === "fly") {
          landing = landingText(ev.to, null);
          paintTexts();
        }
      }

      function onResize() { paint(); }

      function onBusSettings(s) {
        s = s || settings();
        try {
          if (App.BoardView && App.BoardView.setReduced) App.BoardView.setReduced(!!s.reduced);
          if (App.BoardView && App.BoardView.setSound) App.BoardView.setSound(s.sound !== false);
        } catch (e) {}
        /* V6.2：设置变化转发给机舱（减少动画 / 音效） */
        try {
          if (cabinHas("setReduced")) cabinApi().setReduced(!!s.reduced);
          if (cabinHas("setSound")) cabinApi().setSound(s.sound !== false);
        } catch (e) {
          if (window.console) console.warn("[table] cabin settings 失败", e);
        }
      }

      rootEl.addEventListener("click", onRootClick);
      boardEl.addEventListener("board-pick", onBoardPick);
      boardEl.addEventListener("board-event", onBoardEvent);
      window.addEventListener("resize", onResize);
      var offSettings = null;
      try { if (App.Bus && App.Bus.on) offSettings = App.Bus.on("settings", onBusSettings); } catch (e) {}

      mountBoard();
      mountCabin();
      if (state.phase === "ended" || state.phase === "safe-ended") finish();
      else render();
      paintDuration();
      ticker = setInterval(function () {
        if (!alive) return;
        var t = now();
        if (pausedNow()) pauseAccum += Math.max(0, t - tickAt);
        tickAt = t;
        paintDuration();
      }, 1000);

      /* ---------- QA 钩子（只用于测试；不影响正常流程） ---------- */
      try {
        window.__V6_TEST__ = {
          __owner: owner,
          forceDie: function (n) {
            var v = Number(n);
            forcedDie = (v === (v | 0) && v >= 1 && v <= 6) ? v : null;
            return forcedDie;
          },
          getState: function () { return clone(state); },
          isBusy: function () { return !!busy; }
        };
      } catch (e) {}

      return function cleanup() {
        alive = false;
        if (ticker) { clearInterval(ticker); ticker = null; }
        if (finishTimer) { clearTimeout(finishTimer); finishTimer = null; }
        try { if (offSettings) offSettings(); } catch (e) {}
        try { rootEl.removeEventListener("click", onRootClick); } catch (e) {}
        try { boardEl.removeEventListener("board-pick", onBoardPick); } catch (e) {}
        try { boardEl.removeEventListener("board-event", onBoardEvent); } catch (e) {}
        try { window.removeEventListener("resize", onResize); } catch (e) {}
        closeHosts();
        /* 只有仍是「当前主桌」时才拆棋盘/机舱（单例）：换屏/重开时上一屏的延迟 cleanup 直接跳过。 */
        if (tableOwner === owner) {
          tableOwner = null;
          if (cabinHas("unmount")) {
            try { cabinApi().unmount(); } catch (e) {}
          }
          if (App.BoardView && typeof App.BoardView.unmount === "function") {
            try { App.BoardView.unmount(); } catch (e) {}
          }
        }
        try {
          if (window.__V6_TEST__ && window.__V6_TEST__.__owner === owner) delete window.__V6_TEST__;
        } catch (e) {}
      };
    }
  };
})();

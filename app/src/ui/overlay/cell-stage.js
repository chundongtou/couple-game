/* ===== V7 CellStage：45° 格子舞台 + 向导小熊 + 右侧内容卡 =====
 * 契约（docs/v7/impl-freeze.md §3 / §4.2）：
 *   App.CellStage.open(host, prompt, state, handlers) -> close()
 *   handlers: { done(), skipped(), choose(cardIndex), minigame?(), continue?(), reroll?(), close?() }
 *   - host：题卡宿主（table 传 .v6-cardhost）；本模块自建 fixed 覆盖层根节点，只读 prompt/state，不调引擎。
 *   - 主题：App.Themes.get() / bearOutfit()（缺失或抛错 → cloud + pilot）；小熊：App.Bear（缺失 → 无熊布局）。
 *   - data-test 与旧 PromptCard 对齐：prompt-card/prompt-kicker/prompt-actor/prompt-meta/prompt-stars/
 *     prompt-source/prompt-reroll/prompt-stars-help/prompt-text/prompt-attrib/prompt-done/prompt-skip/
 *     prompt-fate-option/prompt-fate-skip/prompt-collapse/prompt-restore/prompt-foot；
 *     新增 cell-stage/cell-stage-cell/cell-type/cell-index/cell-theme/cell-stage-bear。
 *   - z-index 320：高于棋盘/题卡（30），低于暂停（340）与安全词（380）；根节点 pointer-events:none，
 *     舞台卡面 auto —— 不拦截棋盘点击，安全词/暂停保持可点。
 * 约束：不新增露骨文案；卡片长文本内部滚动、按钮固定；reduced 下淡入且无 3D 动画。
 */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util || {};

  function esc(s) {
    if (U && U.escape) return U.escape(s);
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  /* ---------- 文案字典（与旧 PromptCard 对齐，不新增露骨内容） ---------- */
  var TYPE_LABEL = {
    "cell-truth": "真心话", "cell-dare": "大冒险", "cell-touch": "靠近",
    capture: "击落", "stack-duo": "叠机", "home-entry": "进航",
    ending: "收尾", fate: "命运", "minigame-thermo": "温度计", "minigame-wheel": "转盘"
  };
  var GRID_LABEL = {
    "cell-truth": "真心话格", "cell-dare": "大冒险格", "cell-touch": "靠近格",
    capture: "击落格", "stack-duo": "叠机格", "home-entry": "进航格",
    ending: "收尾卡", fate: "命运格"
  };
  var POOL_LABEL = {
    truth: "真心话", dare: "大冒险", touch: "靠近", sync: "默契", spark: "火花", punish: "罚"
  };
  var MINI_LABEL = {
    thermo: "温度计", "truth-wheel": "真心话转盘", "dare-wheel": "大冒险转盘",
    wheel: "转盘", truth: "真心话转盘", dare: "大冒险转盘", minigame: "小游戏",
    "minigame-thermo": "温度计", "minigame-wheel": "转盘"
  };
  var FUNC_LABEL = { jump: "跳格", fly: "飞点", "home-entry": "进航格", function: "功能格" };
  var FUNC_TEXT = {
    jump: "落在跳格 · 沿航线向前 4 格。",
    fly: "落在飞点 · 直接向前 12 格。",
    "home-entry": "进航格 · 转进自己的航线。"
  };
  var THEME_NAME = { cloud: "云海机舱", star: "星轨夜航", paper: "纸雕童话" };
  var FALLBACK_TEXT = "这一张没抽出来。先记一笔，换一张也可以。";
  var FALLBACK_NAME = { a: "他", b: "她" };

  /* ---------- 主题 ---------- */
  var THEME_ALIAS = {
    cloud: "cloud", pilot: "cloud", star: "star", starlight: "star",
    paper: "paper", sky: "cloud"
  };

  function themeInfo(host) {
    var id = "", name = "", outfit = "";
    var hasThemes = !!(App.Themes && typeof App.Themes.get === "function");
    if (hasThemes) {
      try {
        var t = App.Themes.get();
        if (t) {
          if (t.id) id = String(t.id);
          if (t.name) name = String(t.name);
          if (t.outfit) outfit = String(t.outfit);
        }
      } catch (e) {
        /* get() 抛错：这是「主题模块异常」，按冻结单回落 cloud/pilot，不读 DOM 属性兜底 */
        id = "";
        name = "";
        outfit = "";
      }
    } else if (host && host.closest) {
      /* App.Themes 整个缺失时，才读 table 写在祖先上的 data-theme（防御式降级） */
      try {
        var scope = host.closest("[data-theme]") || (document.documentElement.getAttribute("data-theme") ? document.documentElement : null);
        if (scope && scope.getAttribute) id = scope.getAttribute("data-theme") || "";
      } catch (e2) {}
    }
    id = THEME_ALIAS[String(id).toLowerCase()] || "cloud";
    if (!name) name = THEME_NAME[id] || THEME_NAME.cloud;
    if (!outfit) {
      try {
        if (App.Themes && typeof App.Themes.bearOutfit === "function") outfit = String(App.Themes.bearOutfit(id) || "");
      } catch (e3) {}
    }
    outfit = String(outfit || "").toLowerCase();
    if (["pilot", "starlight", "paper"].indexOf(outfit) < 0) {
      outfit = id === "star" ? "starlight" : (id === "paper" ? "paper" : "pilot");
    }
    return { id: id, name: name, outfit: outfit };
  }

  /* ---------- 工具 ---------- */
  function reduced() {
    try { if (App.Motion && App.Motion.reduced) return !!App.Motion.reduced(); } catch (e) {}
    return document.body.classList.contains("reduce");
  }

  function nameOf(state, id) {
    if (id === "both") return "两人一起";
    var names = (state && state.names) || {};
    var raw = names[id];
    if (raw !== undefined && raw !== null && String(raw).trim()) return String(raw).trim();
    return FALLBACK_NAME[id] || "你们";
  }

  function starsOf(card) {
    var n = Number(card && card.star);
    if (!n) n = 1;
    return Math.max(1, Math.min(5, Math.round(n)));
  }

  function starText(n) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += i <= n ? "★" : "☆";
    return out;
  }

  function cardText(card) {
    return card && card.text ? String(card.text) : FALLBACK_TEXT;
  }

  function readOption(opt) {
    if (opt === null || opt === undefined) return { card: null, kind: "", pool: "", text: FALLBACK_TEXT, star: 1 };
    if (typeof opt === "string") return { card: null, kind: "", pool: "", text: opt, star: 1 };
    var card = opt.card || opt;
    var pool = card.pool || card.type || opt.pool || "";
    return { card: card, kind: opt.kind || card.kind || "", pool: pool, text: cardText(card), star: starsOf(card) };
  }

  function optionTypeLabel(o) {
    if (o.kind && TYPE_LABEL[o.kind]) return TYPE_LABEL[o.kind];
    if (o.pool && POOL_LABEL[o.pool]) return POOL_LABEL[o.pool];
    return "这一张";
  }

  function attribOf(prompt, state) {
    var actor = nameOf(state, (prompt && prompt.actorId) || (state && state.turn));
    var target = nameOf(state, (prompt && prompt.targetId) || (prompt && prompt.actorId) || (state && state.turn));
    return {
      actor: actor,
      target: target,
      who: prompt && (prompt.kind === "stack-duo" || prompt.targetId === "both") ? "两人一起"
        : (prompt && prompt.kind === "ending" ? target : actor)
    };
  }

  function kickerHtml(prompt, state, attrs) {
    var kind = prompt.kind || "";
    var type = TYPE_LABEL[kind] || "这一格";
    if (kind === "fate") {
      return '<div class="cs-kicker" data-test="prompt-kicker">' +
        '<span class="cs-type">命运</span><span class="cs-sep"> · </span>' +
        '<span class="cs-tail">两张里挑一张</span><span class="cs-sep"> · </span>' +
        '<span class="cs-tail">挑中的给 </span>' +
        '<span class="cs-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span></div>";
    }
    if (kind === "ending") {
      var n = state && state.endingIndex !== undefined ? Number(state.endingIndex) + 1 : 1;
      return '<div class="cs-kicker" data-test="prompt-kicker">' +
        '<span class="cs-type">收尾</span><span class="cs-sep"> · </span>' +
        '<span class="cs-tail">今晚最后一段</span><span class="cs-sep"> · </span>' +
        '<span class="cs-nowrap">第 ' + n + '/2 张</span><span class="cs-sep"> · </span>' +
        '<span class="cs-tail">给 </span>' +
        '<span class="cs-actor" data-test="prompt-actor">' + esc(attrs.target) + "</span></div>";
    }
    if (kind === "capture") {
      return '<div class="cs-kicker" data-test="prompt-kicker">' +
        '<span class="cs-type">击落</span><span class="cs-sep"> · </span>' +
        '<span class="cs-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span>" +
        '<span class="cs-tail"> 的飞机回机坪了 · 这张给 ' + esc(attrs.actor) + "</span></div>";
    }
    if (kind === "stack-duo" || prompt.targetId === "both") {
      return '<div class="cs-kicker" data-test="prompt-kicker">' +
        '<span class="cs-type">叠机</span><span class="cs-sep"> · </span>' +
        '<span class="cs-actor" data-test="prompt-actor">两人一起</span>' +
        '<span class="cs-tail"> · 这张给你们俩</span></div>';
    }
    if (FUNC_LABEL[kind] && !prompt.card) {
      return '<div class="cs-kicker" data-test="prompt-kicker">' +
        '<span class="cs-type">功能格</span><span class="cs-sep"> · </span>' +
        '<span class="cs-actor">' + esc(FUNC_LABEL[kind]) + "</span>" +
        '<span class="cs-tail"> · 落点说明</span></div>';
    }
    return '<div class="cs-kicker" data-test="prompt-kicker">' +
      '<span class="cs-type">' + esc(type) + "</span><span class=\"cs-sep\"> · </span>" +
      '<span class="cs-tail">这张给 </span>' +
      '<span class="cs-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span></div>";
  }

  function miniKickerHtml(prompt, attrs) {
    var label = MINI_LABEL[prompt.game || prompt.kind] || "小游戏";
    return '<div class="cs-kicker" data-test="prompt-kicker">' +
      '<span class="cs-type">小游戏</span><span class="cs-sep"> · </span>' +
      '<span class="cs-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span>" +
      '<span class="cs-tail"> · ' + esc(label) + "</span></div>";
  }

  function attribLine(prompt, state) {
    var kind = prompt && prompt.kind;
    if (kind === "capture") return "飞机先回机坪 · 这张由被击落的人来答";
    if (kind === "stack-duo" || (prompt && prompt.targetId === "both")) return "两张飞机叠在一起了 · 你们俩一起做";
    if (kind === "ending") return "两张收尾卡，一人一张，也可以先放过";
    if (kind === "home-entry") return "转进自己的航线之前，停在格子上的一张";
    if (kind === "fate") return "选中的这张进入流程；另一张放回池子";
    var who = nameOf(state, (prompt && prompt.actorId) || (state && state.turn));
    return "走到这一格的 <b>" + esc(who) + "</b> 来答";
  }

  function footLine(prompt) {
    var kind = prompt && prompt.kind;
    if (kind === "ending") return "两张收尾卡，一人一张，也可以先放过";
    if (kind === "fate") return "选哪张都由你 · 都不会少任何东西";
    if (FUNC_LABEL[kind] && !prompt.card) return "落在这一格的小说明 · 继续走棋就好";
    return "放过也算数 · 长按「先收棋」随时可停";
  }

  function squareIndexOf(prompt) {
    if (!prompt) return null;
    if (prompt.squareIndex !== undefined && prompt.squareIndex !== null && !isNaN(Number(prompt.squareIndex))) return Number(prompt.squareIndex);
    if (prompt.cellIndex !== undefined && prompt.cellIndex !== null && !isNaN(Number(prompt.cellIndex))) return Number(prompt.cellIndex) + 1;
    if (prompt.preSquareId !== undefined) {
      var m = /:(\d+)/.exec(String(prompt.preSquareId));
      if (m) return Number(m[1]) + 1;
    }
    return null;
  }

  function gridLine(prompt) {
    var kind = (prompt && prompt.kind) || "";
    var grid = GRID_LABEL[kind] || (MINI_LABEL[kind] ? "小游戏格" : (FUNC_LABEL[kind] ? "功能格" : ""));
    if (!grid) return "";
    var n = squareIndexOf(prompt);
    return n ? "来自 " + grid + " · 第 " + n + " 格" : "来自 " + grid;
  }

  function rerollValue(prompt, state) {
    if (prompt && prompt.rerollLeft !== undefined) return Number(prompt.rerollLeft);
    if (state && state.rerollLeft !== undefined) return Number(state.rerollLeft);
    if (state && state.rerollsLeft !== undefined) return Number(state.rerollsLeft);
    return null;
  }

  function miniLabel(prompt) {
    var kind = (prompt && (prompt.kind || prompt.game || prompt.type)) || "minigame";
    return MINI_LABEL[kind] || "小游戏";
  }

  function isMiniPrompt(prompt) {
    if (!prompt) return false;
    if (prompt.type === "minigame") return true;
    var k = String(prompt.kind || "");
    if (k.indexOf("minigame") === 0) return true;
    return ["thermo", "truth-wheel", "dare-wheel", "wheel", "truth", "dare"].indexOf(k) >= 0 && !prompt.card;
  }

  function isFuncPrompt(prompt) {
    if (!prompt) return false;
    if (prompt.type === "function") return true;
    var k = String(prompt.kind || "");
    return ["jump", "fly", "home-entry", "function"].indexOf(k) >= 0 && !prompt.card;
  }

  function stageKind(prompt) {
    if (isMiniPrompt(prompt)) return "minigame";
    if (isFuncPrompt(prompt)) return String(prompt.kind || "function");
    return String((prompt && prompt.kind) || "cell-truth");
  }

  function stageGridLabel(prompt) {
    if (isMiniPrompt(prompt)) return "小游戏格";
    if (isFuncPrompt(prompt)) return FUNC_LABEL[String(prompt.kind || "function")] || "功能格";
    return GRID_LABEL[prompt && prompt.kind] || "这一格";
  }

  /* ---------- 图标（程序化 SVG，不引外部素材） ---------- */
  function iconMarkup(kind) {
    var k = String(kind || "");
    var body;
    if (k === "cell-truth" || k === "truth") {
      body = '<path d="M4 5.5h16v10H9.8L5 19.2v-3.7H4z"/><circle cx="9" cy="10.5" r="1"/><circle cx="12.4" cy="10.5" r="1"/><circle cx="15.8" cy="10.5" r="1"/>';
    } else if (k === "cell-dare" || k === "dare") {
      body = '<path d="M12.5 3c3.4 3.6 5.3 6.1 5.3 9.1a5.7 5.7 0 0 1-11.4 0c0-2 1.2-3.7 2.6-5.3.2 1.5 1 2.3 2 2.7.6-2.4.4-4.4 1.5-6.5Z"/>';
    } else if (k === "cell-touch" || k === "touch") {
      body = '<path d="M12 20.2s-7.3-4.6-7.3-9.3A4.2 4.2 0 0 1 12 8.2a4.2 4.2 0 0 1 7.3 2.7c0 4.7-7.3 9.3-7.3 9.3Z"/>';
    } else if (k === "capture") {
      body = '<circle cx="12" cy="12" r="7.4"/><path d="M12 2.6v3.2M12 18.2v3.2M2.6 12h3.2M18.2 12h3.2"/><circle cx="12" cy="12" r="2.2"/>';
    } else if (k === "stack-duo") {
      body = '<path d="M3 8.4 12 4l9 4.4-9 4.4z"/><path d="M3 13.2 12 17.6l9-4.4"/><path d="M3 17.2 12 21.6l9-4.4"/>';
    } else if (k === "home-entry") {
      body = '<path d="M4 11.2 12 4l8 7.2V20H4z"/><path d="M9.2 20v-5.6h5.6V20"/>';
    } else if (k === "fate") {
      body = '<rect x="4.2" y="4" width="9.4" height="14.4" rx="2" transform="rotate(-9 8.9 11.2)"/><rect x="10.4" y="6.2" width="9.4" height="14.4" rx="2"/><path d="M13.4 10.4h3.4M13.4 13.4h3.4"/>';
    } else if (k === "ending") {
      body = '<rect x="3.4" y="6" width="17.2" height="12" rx="2"/><path d="m4 7 8 6 8-6"/><path d="m4 17 5.4-4.6M20 17l-5.4-4.6"/>';
    } else if (k === "minigame") {
      body = '<rect x="3" y="8" width="18" height="9.4" rx="4.7"/><path d="M8 12.7h2.2M9.1 11.6v2.2M15.6 12h.01M18 12h.01"/>';
    } else if (k === "jump") {
      body = '<path d="M5 19 19 5"/><path d="M11 5h8v8"/>';
    } else if (k === "fly") {
      body = '<path d="m3 13 18-8.4-5.8 16-3.6-6.2z"/><path d="m11.6 14.4 2.6-2.6"/>';
    } else {
      body = '<path d="M12 3.4 14.2 10l6.6 2.2-6.6 2.2L12 21l-2.2-6.6L3.2 12.2 9.8 10z"/>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + body + "</svg>";
  }

  /* ---------- 样式 ---------- */
  var CSS = `
.cs-root{position:fixed;inset:0;z-index:320;display:flex;align-items:center;justify-content:center;padding:calc(64px + var(--safe-t,0px)) 8px calc(10px + var(--safe-b,0px));pointer-events:none;font-family:var(--font-body,var(--sans,sans-serif));--ease-out:cubic-bezier(.16,1,.3,1);--cs-paper:#F1E4CE!important;--cs-paper2:#E7D6B8!important;--cs-paper-ink:#2A1D14!important;--cs-accent:#B08A57!important;--cs-accent-2:#E0A45E!important;--cs-glow:rgba(224,164,94,.26)!important;--cs-paper-kicker:#7A5A38;--cs-paper-type:#732A35;--cs-paper-dim:#7C6A55;--cs-paper-line:rgba(176,138,87,.36);--cs-paper-soft:rgba(255,255,255,.24);--cs-cell-side:#3A2519;--cs-cell-side2:#1A120C;--cs-cell-line:rgba(176,138,87,.3);--cs-cell-ink:#EFE2CB;--cs-cell-a:#263845;--cs-cell-b:#0C1722}
.cs-scrim{position:absolute;left:0;right:0;top:calc(56px + var(--safe-t,0px));bottom:0;pointer-events:none;background:radial-gradient(120% 86% at 34% 42%,rgba(4,6,10,.5),rgba(4,6,10,.9) 72%),linear-gradient(180deg,rgba(4,6,10,.7),rgba(4,6,10,.9))}
.cs-stage{position:relative;z-index:1;display:grid;grid-template-columns:28% minmax(0,1fr);gap:4%;width:100%;max-width:520px;height:min(520px,calc(100vh - 104px));max-height:100%;pointer-events:none;transform-origin:50% 60%;animation:csStageIn .32s var(--ease-out) both}
@supports (height:100dvh){.cs-stage{height:min(520px,calc(100dvh - 104px))}}
@keyframes csStageIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.cs-left{position:relative;min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;pointer-events:none}
.cs-left::before{content:"";position:absolute;left:50%;top:40%;width:170%;height:64%;transform:translate(-50%,-50%);background:radial-gradient(50% 50% at 50% 50%,var(--cs-glow),transparent 72%);pointer-events:none}
.cs-cell{position:relative;width:110%;max-width:150px;aspect-ratio:1/1;z-index:2;flex:none}
.cs-cell-ring{position:absolute;left:50%;top:50%;width:92%;height:92%;margin:-46% 0 0 -46%;border-radius:50%;border:1px dashed var(--cs-accent);opacity:.22;animation:csRingSpin 56s linear infinite;pointer-events:none}
@keyframes csRingSpin{to{transform:rotate(360deg)}}
.cs-cell-persp{position:absolute;inset:10%;perspective:560px;perspective-origin:50% 32%;z-index:1;animation:csCellFloat 6.4s ease-in-out infinite;transform-origin:50% 70%}
@keyframes csCellFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
.cs-cell-floor{position:absolute;inset:0;border-radius:14%;transform:rotateX(52deg) rotateZ(-45deg);transform-style:preserve-3d;overflow:hidden;background:linear-gradient(148deg,var(--cs-cell-a) 0%,var(--cs-cell-b) 100%);box-shadow:0 5px 0 var(--cs-cell-side),0 10px 0 var(--cs-cell-side2),0 16px 26px rgba(0,0,0,.6),inset 0 0 0 1px rgba(176,138,87,.55),inset 0 0 34px rgba(0,0,0,.4)}
.cs-cell-floor::before{content:"";position:absolute;inset:0;border-radius:inherit;opacity:.7;pointer-events:none;background:radial-gradient(80% 60% at 50% 0%,rgba(255,240,215,.12),transparent 70%)}
.cs-cell-floor::after{content:"";position:absolute;inset:0;border-radius:inherit;opacity:.38;pointer-events:none;background-image:linear-gradient(var(--cs-cell-line) 1px,transparent 1px),linear-gradient(90deg,var(--cs-cell-line) 1px,transparent 1px);background-size:25% 25%;background-position:center}
.cs-cell-stamp{position:absolute;inset:26%;color:var(--cs-cell-ink);opacity:.62;display:grid;place-items:center}
.cs-cell-stamp svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.3;stroke-linecap:round;stroke-linejoin:round}
.cs-cell-glow{position:absolute;left:50%;top:50%;width:120%;height:120%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(50% 50% at 50% 50%,var(--cs-glow),transparent 68%);filter:blur(2px);z-index:0;pointer-events:none}
.cs-cell-badge{position:absolute;left:50%;top:-2%;transform:translateX(-50%);width:34px;height:34px;border-radius:50%;z-index:4;display:grid;place-items:center;color:var(--cs-accent-2);background:rgba(8,12,18,.88);border:1px solid var(--cs-accent);box-shadow:0 6px 16px rgba(0,0,0,.52),0 0 0 3px rgba(8,12,18,.32)}
.cs-cell-badge svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.cs-cell-tag{position:absolute;left:50%;top:-40px;transform:translateX(-50%);z-index:4;min-width:0;max-width:110%;display:flex;flex-direction:column;align-items:center;gap:1px;padding:3px 8px;border-radius:4px;background:rgba(8,12,18,.86);border:1px solid rgba(176,138,87,.45)}
.cs-cell-tag b{font-family:var(--font-display,serif);font-size:10px;letter-spacing:.06em;color:#F1E4CE;font-weight:600;white-space:nowrap}
.cs-cell-tag span{font-size:8.5px;letter-spacing:.1em;color:rgba(241,228,206,.6);white-space:nowrap}
.cs-bearhost{position:relative;width:100%;z-index:1;flex:none;display:flex;justify-content:center;align-items:flex-end;margin-top:-14%;min-height:0}
.cs-bearhost .cs-bear{width:100%;max-width:158px}
.cs-nobear .cs-bearhost{display:none}
.cs-nobear .cs-left{justify-content:center}
.cs-nobear .cs-cell{margin-bottom:0}
.cs-card{position:relative;z-index:3;min-width:0;height:100%;display:flex;flex-direction:column;pointer-events:auto;border-radius:12px;padding:14px 14px 10px;color:#2A1D14;background:linear-gradient(160deg,#F6EBD8,#E7D5B6);border:1px solid rgba(176,138,87,.55);box-shadow:0 22px 52px rgba(0,0,0,.62),inset 0 0 0 1px rgba(255,255,255,.24);overflow:hidden;transform-origin:100% 60%;animation:csCardIn .36s .04s var(--ease-out) both}
.cs-card::before{content:"";position:absolute;left:14px;right:14px;top:6px;height:1px;background:linear-gradient(90deg,transparent,rgba(176,138,87,.75),transparent);pointer-events:none;z-index:2}
@keyframes csCardIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:none}}
.cs-card-top{position:relative;z-index:1;display:flex;align-items:flex-start;gap:7px;flex:none;padding-top:4px}
.cs-kicker{flex:1;min-width:0;font-size:11px;letter-spacing:.08em;font-weight:700;line-height:1.55;color:var(--cs-paper-kicker);word-break:break-word}
.cs-kicker .cs-type{color:var(--cs-paper-type)}
.cs-kicker .cs-sep{opacity:.5}
.cs-kicker .cs-actor{color:#4A2E1C;font-weight:700}
.cs-kicker .cs-tail{color:var(--cs-paper-kicker);font-weight:500}
.cs-kicker .cs-nowrap{white-space:nowrap}
.cs-collapse{flex:none;min-height:30px;padding:0 8px;border-radius:5px;border:1px solid rgba(90,50,30,.28);background:rgba(255,255,255,.22);color:#6E4A33;font-size:10px;font-weight:600;letter-spacing:.02em;font-family:inherit}
.cs-collapse:active{background:rgba(255,255,255,.4)}
.cs-meta{position:relative;z-index:1;flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:5px 8px;margin-top:5px;min-height:20px;font-size:10px;letter-spacing:.03em;color:var(--cs-paper-dim)}
.cs-stars{color:#A9793A;font-size:11px;letter-spacing:.12em;white-space:nowrap}
.cs-meta .cs-dot{opacity:.5}
.cs-meta .cs-theme{display:inline-flex;align-items:center;gap:4px;padding:1px 6px;border-radius:4px;border:1px solid var(--cs-paper-line);color:var(--cs-paper-kicker);font-size:9px;letter-spacing:.06em}
.cs-meta .cs-theme i{width:4px;height:4px;background:var(--cs-accent-2);transform:rotate(45deg)}
.cs-reroll{min-height:28px;padding:0 9px;border-radius:5px;border:1px solid var(--cs-paper-line);background:rgba(255,255,255,.22);color:#6E4A33;font-size:10px;font-weight:600;font-family:inherit}
.cs-reroll[disabled]{opacity:.42}
.cs-legend-btn{min-height:26px;padding:0 7px;border-radius:5px;border:1px solid rgba(90,50,30,.22);color:var(--cs-paper-dim);font-size:9.5px;line-height:1;background:transparent;font-family:inherit;letter-spacing:.02em}
.cs-legend{display:none;position:relative;z-index:1;flex:none;margin-top:5px;font-size:10px;line-height:1.5;color:#6E4A33;background:rgba(255,255,255,.24);border:1px solid rgba(90,50,30,.16);border-radius:5px;padding:6px 8px}
.cs-legend.on{display:block}
.cs-scroll{position:relative;z-index:1;flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;margin:7px -4px 0;padding:0 4px 2px;touch-action:pan-y}
.cs-text{margin:0;font-family:var(--font-display,serif);font-weight:600;font-size:clamp(16px,4.6vw,20px);line-height:1.62;letter-spacing:.01em;color:#2A1D14;overflow-wrap:anywhere;word-break:break-word}
.cs-attrib{margin-top:8px;font-size:11px;line-height:1.55;color:#7C4A30;letter-spacing:.03em}
.cs-attrib b{color:#4A2E1C}
.cs-lead{margin:0 0 8px;font-size:12px;line-height:1.6;color:#6E4A33}
.cs-lead:last-child{margin-bottom:0}
.cs-fate{display:flex;flex-direction:column;gap:8px;margin-top:2px}
.cs-opt{display:block;width:100%;text-align:left;min-height:62px;padding:9px 10px;border-radius:8px;border:1px solid var(--cs-paper-line);background:rgba(255,255,255,.24);color:#2A1D14;font-family:inherit;transition:transform .16s var(--ease-out)}
.cs-opt:active{transform:scale(.99)}
.cs-opt-tag{display:block;font-size:10px;font-weight:700;letter-spacing:.07em;color:var(--cs-paper-type)}
.cs-opt-text{display:block;margin-top:3px;font-family:var(--font-display,serif);font-size:13.5px;line-height:1.5;font-weight:600;color:#2A1D14;overflow-wrap:anywhere}
.cs-acts{position:relative;z-index:1;flex:none;display:flex;gap:8px;margin-top:10px}
.cs-btn{flex:1;min-height:44px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:.1em;font-family:inherit;transition:transform .16s var(--ease-out)}
.cs-btn:active{transform:scale(.985)}
.cs-btn.ink{background:linear-gradient(180deg,#3A2519,#241610);color:#F6EBD8;border:1px solid rgba(176,138,87,.5);box-shadow:inset 0 1px 0 rgba(255,226,196,.16)}
.cs-btn.line{background:rgba(255,255,255,.2);border:1px solid rgba(90,50,30,.32);color:#4A2A1A}
.cs-btn.wide{width:100%;flex:none}
.cs-btn[disabled]{opacity:.5;pointer-events:none}
.cs-foot{position:relative;z-index:1;flex:none;margin-top:8px;font-size:8.8px;letter-spacing:.04em;color:#A0896C;text-align:center;line-height:1.45}
.cs-restore{position:fixed;left:50%;bottom:calc(14px + var(--safe-b,0px));transform:translateX(-50%);z-index:2;pointer-events:auto;min-height:42px;padding:0 18px;border-radius:8px;border:1px solid rgba(176,138,87,.6);background:rgba(8,12,18,.92);color:#F1E4CE;font-size:12px;font-weight:600;letter-spacing:.1em;font-family:inherit;box-shadow:0 12px 30px rgba(0,0,0,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.cs-restore[hidden]{display:none}
.cs-root.cs-collapsed .cs-stage{animation:none;opacity:0;pointer-events:none;transform:translateY(10px) scale(.99);transition:opacity .18s var(--ease-out),transform .18s var(--ease-out)}
.cs-root.cs-collapsed .cs-scrim{opacity:0}
.cs-root.cs-exit .cs-stage{animation:none;opacity:0;transform:translateY(12px) scale(.995);transition:opacity .2s var(--ease-out),transform .2s var(--ease-out)}
.cs-root.cs-exit{pointer-events:none}
@media (max-width:360px){
.cs-stage{grid-template-columns:22% minmax(0,1fr);gap:4%}
.cs-card{padding:12px 12px 9px;border-radius:10px}
.cs-kicker{font-size:10.5px}
.cs-text{font-size:clamp(15px,4.9vw,18px)}
.cs-btn{min-height:44px;font-size:13px;letter-spacing:.05em}
.cs-cell{width:112%;max-width:104px}
.cs-bearhost{max-width:100%;margin-top:-12%}
.cs-cell-badge{width:30px;height:30px}
.cs-cell-tag{top:-34px;padding:2px 6px;max-width:118%}
.cs-collapse{min-height:28px;padding:0 7px;font-size:9.5px}
.cs-foot{font-size:8.5px}
.cs-left{justify-content:center}
}
@media (min-width:400px){.cs-card{padding:16px 16px 12px}}
body.reduce .cs-root *,body.reduce .cs-root,.cs-root[data-reduced="1"] *,.cs-root[data-reduced="1"]{animation-duration:1ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}
@media (prefers-reduced-motion:reduce){.cs-root *,.cs-root{animation-duration:1ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:1ms!important}}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("cell-stage-v7", CSS); return; }
    if (document.getElementById("style-cell-stage-v7")) return;
    var el = document.createElement("style");
    el.id = "style-cell-stage-v7";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  /* ---------- 内容拼装 ---------- */
  function metaHtml(theme, prompt, state, handlers, isFate, isMini, isFunc) {
    var themeChip = '<span class="cs-theme" data-test="cell-theme"><i aria-hidden="true"></i>' + esc(theme.name) + "</span>";
    if (isFunc) {
      return '<div class="cs-meta" data-test="prompt-meta">' +
        '<span class="cs-theme"><i aria-hidden="true"></i>落点说明</span>' + themeChip + "</div>";
    }
    if (isMini) {
      return '<div class="cs-meta" data-test="prompt-meta">' +
        '<span class="cs-theme"><i aria-hidden="true"></i>小游戏格</span>' + themeChip + "</div>";
    }
    var card = prompt.card || (isFate && prompt.options ? prompt.options[0] : null);
    var star = starsOf(card);
    var left = rerollValue(prompt, state);
    var rerollHtml = "";
    if (typeof handlers.reroll === "function") {
      rerollHtml = '<button class="cs-reroll" data-act="reroll" data-test="prompt-reroll" type="button"' +
        (left !== null && left <= 0 ? " disabled" : "") + ">换一张" +
        (left === null ? "" : " · 还有 " + Math.max(0, left) + " 次") + "</button>";
    }
    return '<div class="cs-meta" data-test="prompt-meta">' +
      (isFate
        ? '<span class="cs-stars" data-test="prompt-stars" aria-label="两张牌">两张牌</span>'
        : '<span class="cs-stars" data-test="prompt-stars" aria-label="' + star + '\u2009星尺度">' + starText(star) + "</span>") +
      (gridLine(prompt) ? '<span class="cs-dot">·</span><span data-test="prompt-source">' + esc(gridLine(prompt)) + "</span>" : "") +
      rerollHtml +
      '<button class="cs-legend-btn" data-act="legend" type="button" data-test="prompt-stars-help">星数怎么看</button>' +
      themeChip +
      "</div>" +
      '<div class="cs-legend" data-legend>★ 是这张的尺度：星越多，越靠近你们今晚选的上限。</div>';
  }

  function bodyHtml(prompt, state, isFate, isEnding, isMini, isFunc) {
    if (isFate) {
      var opts = (prompt.options || []).slice(0, 2).map(function (raw, i) {
        var o = readOption(raw);
        return '<button class="cs-opt" type="button" data-test="prompt-fate-option" data-index="' + i + '" data-choose="' + i + '">' +
          '<span class="cs-opt-tag">要这张 · ' + esc(optionTypeLabel(o)) + " " + o.star + "★</span>" +
          '<span class="cs-opt-text">' + esc(o.text) + "</span></button>";
      }).join("");
      return '<p class="cs-lead">两张里挑一张。另一张会放回池子。</p><div class="cs-fate">' + opts + "</div>";
    }
    if (isMini) {
      var miniText = prompt.text || ("这一格是小游戏（" + miniLabel(prompt) + "）。手机放中间，一起玩。");
      return '<p class="cs-text" data-test="prompt-text">' + esc(miniText) + "</p>" +
        '<div class="cs-attrib" data-test="prompt-attrib">完成或跳过都会回到棋盘 · 记录会留着</div>';
    }
    if (isFunc) {
      var kind = prompt.kind || "function";
      var text = prompt.text || FUNC_TEXT[kind] || "落在这一格 · 继续走棋就好。";
      return '<p class="cs-text" data-test="prompt-text">' + esc(text) + "</p>" +
        '<div class="cs-attrib" data-test="prompt-attrib">' + esc(stageGridLabel(prompt)) + " · 只是一句说明</div>";
    }
    return '<p class="cs-text" data-test="prompt-text">' + esc(cardText(prompt.card)) + "</p>" +
      '<div class="cs-attrib" data-test="prompt-attrib">' + attribLine(prompt, state) + "</div>";
  }

  function actsHtml(prompt, isFate, isMini, isFunc) {
    if (isFate) {
      return '<button class="cs-btn line wide" type="button" data-act="fate-skip" data-test="prompt-fate-skip">今晚先不选</button>';
    }
    if (isMini) {
      return '<button class="cs-btn ink" type="button" data-act="minigame" data-test="prompt-minigame">开始小游戏</button>' +
        '<button class="cs-btn line" type="button" data-act="skipped" data-test="prompt-skip">这次先跳过</button>';
    }
    if (isFunc) {
      return '<button class="cs-btn ink wide" type="button" data-act="continue" data-test="prompt-continue">继续</button>';
    }
    return '<button class="cs-btn ink" type="button" data-act="done" data-test="prompt-done">做了</button>' +
      '<button class="cs-btn line" type="button" data-act="skipped" data-test="prompt-skip">放过</button>';
  }

  function buildMarkup(theme, prompt, state, handlers) {
    var isFate = prompt.kind === "fate" && Array.isArray(prompt.options) && prompt.options.length > 0;
    var isEnding = prompt.kind === "ending";
    var isMini = isMiniPrompt(prompt);
    var isFunc = !isMini && isFuncPrompt(prompt);
    var attrs = attribOf(prompt, state);
    var kind = stageKind(prompt);
    var typeLabel = isMini ? "小游戏格" : (isFunc ? (FUNC_LABEL[prompt.kind] || "功能格") : (GRID_LABEL[prompt.kind] || "这一格"));
    var n = squareIndexOf(prompt);
    var indexLabel = n ? "第 " + n + " 格" : "";
    var icon = iconMarkup(kind);
    var aria = isMini
      ? typeLabel + " · " + miniLabel(prompt) + " · 给 " + (attrs.who || attrs.actor)
      : (isFunc ? typeLabel + " · 落点说明" : typeLabel + " · 给 " + (attrs.who || attrs.actor));

    var cardCls = "cs-card" + (isEnding ? " cs-card--ending" : "");
    return '<div class="cs-stage">' +
        '<div class="cs-left">' +
          '<div class="cs-cell" data-test="cell-stage-cell" data-kind="' + esc(kind) + '">' +
            '<span class="cs-cell-glow" aria-hidden="true"></span>' +
            '<span class="cs-cell-ring" aria-hidden="true"></span>' +
            '<div class="cs-cell-persp" aria-hidden="true">' +
              '<div class="cs-cell-floor"><span class="cs-cell-stamp">' + icon + '</span><span class="cs-cell-sheen"></span></div>' +
            "</div>" +
            '<span class="cs-cell-badge" data-test="cell-icon" aria-hidden="true">' + icon + "</span>" +
            '<div class="cs-cell-tag"><b data-test="cell-type">' + esc(typeLabel) + "</b>" +
              (indexLabel ? '<span data-test="cell-index">' + esc(indexLabel) + "</span>" : "") + "</div>" +
          "</div>" +
          '<div class="cs-bearhost" data-test="bear-host"></div>' +
        "</div>" +
        '<section class="' + cardCls + '" data-test="prompt-card" role="dialog" aria-modal="true" aria-label="' + esc(aria) + '">' +
          '<div class="cs-card-top">' + (isMini ? miniKickerHtml(prompt, attrs) : kickerHtml(prompt, state, attrs)) +
            '<button class="cs-collapse" data-act="collapse" type="button" data-test="prompt-collapse">先看棋盘</button>' +
          "</div>" +
          metaHtml(theme, prompt, state, handlers, isFate, isMini, isFunc) +
          '<div class="cs-scroll" data-test="prompt-scroll">' + bodyHtml(prompt, state, isFate, isEnding, isMini, isFunc) + "</div>" +
          '<div class="cs-acts">' + actsHtml(prompt, isFate, isMini, isFunc) + "</div>" +
          '<div class="cs-foot" data-test="prompt-foot">' + esc(footLine(prompt)) + "</div>" +
        "</section>" +
      "</div>" +
      '<button class="cs-restore" data-act="restore" data-test="prompt-restore" type="button" hidden>回到这张</button>';
  }

  /* ---------- 实例 ---------- */
  var current = null;

  function open(host, prompt, state, handlers) {
    handlers = handlers || {};
    if (!host || !prompt) return function () {};
    injectStyle();
    if (current && typeof current.close === "function") {
      try { current.close(); } catch (e) {}
    }
    current = null;
    var strays = document.querySelectorAll(".cs-root");
    for (var si = 0; si < strays.length; si++) {
      if (strays[si] && strays[si].parentNode) strays[si].parentNode.removeChild(strays[si]);
    }
    state = state || {};
    var theme = themeInfo(host);
    var isReduced = reduced();

    var root = document.createElement("div");
    root.className = "cs-root";
    root.setAttribute("data-test", "cell-stage");
    root.setAttribute("data-theme", theme.id);
    root.setAttribute("data-kind", stageKind(prompt));
    root.setAttribute("data-outfit", theme.outfit);
    root.setAttribute("data-reduced", isReduced ? "1" : "0");
    root.setAttribute("data-bear", "off");
    if (prompt.actorId) root.setAttribute("data-actor", String(prompt.actorId));
    if (prompt.kind === "fate") root.setAttribute("data-fate", "1");
    root.style.pointerEvents = "none";
    root.innerHTML = buildMarkup(theme, prompt, state, handlers);
    host.appendChild(root);

    var stageEl = root.querySelector(".cs-stage");
    var cardEl = root.querySelector(".cs-card");
    var scrollEl = root.querySelector(".cs-scroll");
    var bearHost = root.querySelector("[data-test=bear-host]");
    var restoreEl = root.querySelector("[data-test=prompt-restore]");
    var restoreTimer = null;
    var closed = false;
    var fired = false;

    /* 主题令牌 → 舞台 CSS 变量：优先读 App.Themes.tokens()（云端暖纸/星轨紫纸/纸雕奶白纸），
       缺失时用本模块 data-theme 内置值；只写本 root，不碰全局。 */
    try {
      if (App.Themes && typeof App.Themes.tokens === "function") {
        var tk = App.Themes.tokens(theme.id) || {};
        var tokenMap = {
          "--cs-paper": "--v7-card-paper",
          "--cs-paper2": "--v7-card-paper-2",
          "--cs-paper-ink": "--v7-card-ink",
          "--cs-accent": "--v7-board-rim",
          "--cs-accent-2": "--v7-board-rim-2",
          "--cs-glow": "--v7-board-rim-glow"
        };
        for (var vk in tokenMap) {
          if (Object.prototype.hasOwnProperty.call(tokenMap, vk)) {
            var tv = tk[tokenMap[vk]];
            if (tv) root.style.setProperty(vk, tv);
          }
        }
      }
    } catch (eTok) { /* 主题模块缺失/抛错 → 用内置配色 */ }

    /* 小熊：模块缺席/抛错时降级为无熊布局，主桌照常 */
    var bearEl = null;
    try {
      if (App.Bear && typeof App.Bear.render === "function") {
        bearEl = App.Bear.render({
          outfit: theme.outfit,
          mood: "peek",
          glyph: typeof App.Bear.glyphForKind === "function" ? App.Bear.glyphForKind(stageKind(prompt)) : "heart",
          reduced: isReduced
        });
        if (bearEl && bearHost) {
          bearHost.appendChild(bearEl);
          root.setAttribute("data-bear", "on");
          root.classList.remove("cs-nobear");
        }
      }
    } catch (eBear) {
      if (window.console) console.warn("[cell-stage] bear 降级", eBear);
      bearEl = null;
    }
    if (!bearEl) {
      root.setAttribute("data-bear", "off");
      root.classList.add("cs-nobear");
    }

    function setDisabled(on) {
      var btns = root.querySelectorAll("button");
      for (var i = 0; i < btns.length; i++) {
        if (on) btns[i].setAttribute("disabled", "disabled");
        else btns[i].removeAttribute("disabled");
      }
    }

    function fire(name, arg) {
      if (closed || fired) return;
      var fn = handlers[name];
      if (name === "minigame" && typeof fn !== "function") fn = handlers.start;
      if ((name === "minigame" || name === "continue") && typeof fn !== "function") fn = handlers.done;
      if (name === "choose" && typeof fn !== "function") fn = handlers.done;
      if (typeof fn !== "function") {
        /* 没有回调也收起舞台，避免把玩家困在覆盖层里 */
        fired = true;
        setDisabled(true);
        exitAndClose(name);
        return;
      }
      fired = true;
      setDisabled(true);
      try {
        fn(arg);
      } catch (e) {
        fired = false;
        setDisabled(false);
        if (window.console) console.error("[cell-stage]", e);
        if (App.UI && App.UI.toast) App.UI.toast("这张刚才没记上，再点一次");
        return;
      }
      /* 换一张：旧 PromptCard 也是先禁用旧卡，等 table 换新卡；这里不主动收起 */
      if (name === "reroll") return;
      exitAndClose(name);
    }

    function exitAndClose(action) {
      try { if (App.Audio) App.Audio.play(action === "skipped" ? "tap" : "chime"); } catch (e) {}
      try {
        if (bearEl && App.Bear && typeof App.Bear.play === "function") {
          var mood = "nod";
          if (action === "skipped") mood = "put";
          else if (action === "choose" || action === "minigame") mood = "happy";
          else if (action === "continue") mood = "wave";
          App.Bear.play(bearEl, mood);
        }
      } catch (eBear) {}
      root.classList.add("cs-exit");
      restoreTimer = setTimeout(function () { close(); }, 220);
    }

    function collapse(on) {
      root.classList.toggle("cs-collapsed", !!on);
      if (restoreEl) {
        if (on) restoreEl.removeAttribute("hidden");
        else restoreEl.setAttribute("hidden", "hidden");
      }
      var btn = root.querySelector(".cs-collapse");
      if (btn) btn.textContent = on ? "回到这张" : "先看棋盘";
      try { if (App.Audio) App.Audio.play("tap"); } catch (e) {}
    }

    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var opt = t.closest("[data-choose]");
      if (opt && root.contains(opt)) {
        var idx = Number(opt.getAttribute("data-choose"));
        fire("choose", isNaN(idx) ? 0 : idx);
        return;
      }
      var btn = t.closest("[data-act]");
      if (!btn || btn.hasAttribute("disabled")) return;
      var act = btn.getAttribute("data-act");
      if (act === "collapse") { collapse(true); return; }
      if (act === "restore") { collapse(false); return; }
      if (act === "legend") {
        btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true");
        var legend = root.querySelector("[data-legend]");
        if (legend) legend.classList.toggle("on");
        fitStage();
        try { if (App.Audio) App.Audio.play("tap"); } catch (e2) {}
        return;
      }
      if (act === "done") fire("done");
      else if (act === "skipped" || act === "fate-skip") fire("skipped");
      else if (act === "reroll") fire("reroll");
      else if (act === "minigame") fire("minigame");
      else if (act === "continue") fire("continue");
    });

    /* 键盘：Esc 先收成「看棋盘」，不打断等待 */
    root.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { collapse(!root.classList.contains("cs-collapsed")); }
    });

    try { if (cardEl) cardEl.setAttribute("tabindex", "-1"); } catch (e3) {}
    try {
      if (App.Audio) App.Audio.play("cardIn");
      if (isReduced && App.Motion && App.Motion.syncBodyClass) App.Motion.syncBodyClass();
    } catch (e4) {}

    function close() {
      if (closed) return;
      closed = true;
      if (restoreTimer) { clearTimeout(restoreTimer); restoreTimer = null; }
      try { if (bearEl && App.Bear && typeof App.Bear.destroy === "function") App.Bear.destroy(bearEl); } catch (e) {}
      if (root.parentNode) root.parentNode.removeChild(root);
      if (current === inst) current = null;
    }

    var inst = {
      root: root,
      close: close,
      isClosed: function () { return closed; },
      scrollEl: scrollEl,
      stageEl: stageEl,
      fit: fitStage
    };
    current = inst;

    /* 卡片高度自适应：短内容不撑满整屏；长内容到上限后在卡内滚动（按钮始终固定）。
       先按初始 520px 布局量一次自然高度，再钳在 [360, 可视上限]。 */
    function naturalHeightOf(el) {
      var st = window.getComputedStyle(el);
      var sum = (parseFloat(st.paddingTop) || 0) + (parseFloat(st.paddingBottom) || 0);
      for (var i = 0; i < el.children.length; i++) {
        var c = el.children[i];
        var cst = window.getComputedStyle(c);
        if (cst.display === "none") continue;
        sum += c.getBoundingClientRect().height + (parseFloat(cst.marginTop) || 0) + (parseFloat(cst.marginBottom) || 0);
      }
      return sum;
    }

    function fitStage() {
      if (closed || !stageEl || !cardEl) return;
      try {
        var cs = window.getComputedStyle(cardEl);
        var h = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
        var kids = cardEl.children;
        for (var i = 0; i < kids.length; i++) {
          var k = kids[i];
          var ks = window.getComputedStyle(k);
          if (ks.display === "none") continue;
          var mt = parseFloat(ks.marginTop) || 0;
          var mb = parseFloat(ks.marginBottom) || 0;
          h += (k === scrollEl ? naturalHeightOf(scrollEl) : k.getBoundingClientRect().height) + mt + mb;
        }
        var viewportH = window.innerHeight || 800;
        var maxH = Math.min(520, viewportH - 104);
        var minH = Math.min(330, maxH);
        var next = Math.max(minH, Math.min(maxH, Math.ceil(h + 2)));
        if (Math.abs((parseFloat(stageEl.style.height) || 0) - next) > 1) stageEl.style.height = next + "px";
        root.setAttribute("data-stage-h", String(next));
        requestAnimationFrame(function () {
          if (closed) return;
          root.setAttribute("data-scrollable", scrollEl && scrollEl.scrollHeight > scrollEl.clientHeight + 1 ? "1" : "0");
        });
      } catch (eFit) { /* 测量失败也不挡答题 */ }
    }

    fitStage();
    requestAnimationFrame(fitStage);
    try {
      if (document.fonts && document.fonts.ready && document.fonts.ready.then) document.fonts.ready.then(function () { fitStage(); }, function () {});
    } catch (eFonts) {}
    var resizeTimer = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeTimer = null;
        root.removeAttribute("data-scrollable");
        stageEl.style.height = "";
        requestAnimationFrame(fitStage);
      }, 120);
    }
    window.addEventListener("resize", onResize);
    var origClose = close;
    close = function () {
      window.removeEventListener("resize", onResize);
      if (resizeTimer) { clearTimeout(resizeTimer); resizeTimer = null; }
      origClose();
    };
    inst.close = close;

    /* 供 QA/导演判断：是否已关闭、滚动区是否可滚 */
    try { root.__cellStage = inst; } catch (e5) {}

    return function () { inst.close(); };
  }

  App.CellStage = {
    version: "7.0.0",
    open: open,
    close: function () { if (current && typeof current.close === "function") current.close(); },
    isOpen: function () { return !!(current && current.root && current.root.parentNode && !current.isClosed()); },
    current: function () { return current; },
    themeInfo: themeInfo
  };
})();

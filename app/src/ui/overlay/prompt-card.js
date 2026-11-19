/* ===== V6 桌边题卡：暖纸卡 · 归属姓名 · 命运二选一 · 收尾 =====
 * 契约：App.PromptCard.open(host, prompt, state, handlers) -> close()
 * handlers: { done(), skipped(), choose?(cardIndex), reroll?(), close?() }
 * 冻结单 §3.2：打开期间安全词/暂停仍可点（本层 z-index 低于安全词层 380）。
 * 归属：cell-* = 走到的人(actorId)；capture = 被击落的人(actorId)；stack-duo = 两人一起；
 *       ending = 指定人(targetId)；fate = 落到命运格的人(actorId)。
 * 文案：docs/v6/copy.md §3 / §6.1（D2 击落、D3 两人一起 · 这张给你们俩、D4 先看棋盘）。
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

  var TYPE_LABEL = {
    "cell-truth": "真心话",
    "cell-dare": "大冒险",
    "cell-touch": "靠近",
    capture: "击落",
    "stack-duo": "叠机",
    "home-entry": "进终点",
    ending: "收尾",
    fate: "命运",
    "minigame-thermo": "温度计",
    "minigame-wheel": "转盘"
  };
  var GRID_LABEL = {
    "cell-truth": "真心话格",
    "cell-dare": "大冒险格",
    "cell-touch": "靠近格",
    capture: "击落格",
    "stack-duo": "叠机格",
    "home-entry": "进终点格",
    ending: "收尾卡",
    fate: "命运格"
  };
  var POOL_LABEL = {
    truth: "真心话", dare: "大冒险", touch: "靠近", sync: "默契",
    spark: "火花", punish: "罚"
  };
  var FALLBACK_TEXT = "这一张没抽出来。先记一笔，换一张也可以。";
  var FALLBACK_NAME = { a: "他", b: "她" };

  var CSS = `
.pc-root{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;padding:0 10px calc(10px + var(--safe-b,0px));pointer-events:none;font-family:var(--font-body,var(--sans,sans-serif))}
.pc-dock{position:relative;pointer-events:auto;width:100%;max-width:520px;border-radius:12px;padding:15px 16px 13px;color:#2A1D14;background:linear-gradient(160deg,#F6EBD8,#E7D5B6);border:1px solid rgba(176,138,87,.55);box-shadow:0 18px 44px rgba(0,0,0,.6),inset 0 0 0 1px rgba(255,255,255,.24);overflow:hidden;transform-origin:50% 100%;animation:pcIn .26s var(--ease-out,cubic-bezier(.16,1,.3,1)) both}
.pc-dock::before{content:"";position:absolute;left:16px;right:16px;top:7px;height:1px;background:linear-gradient(90deg,transparent,rgba(176,138,87,.75),transparent)}
@keyframes pcIn{from{opacity:0;transform:translateY(16px) scale(.99)}to{opacity:1;transform:none}}
body.reduce .pc-dock{animation-duration:80ms!important}
@media (prefers-reduced-motion: reduce){.pc-dock{animation-duration:80ms!important}}
.pc-inner{position:relative;z-index:1}
.pc-top{display:flex;align-items:flex-start;gap:8px}
.pc-kicker{flex:1;min-width:0;font-size:11px;letter-spacing:.1em;font-weight:700;color:#7A5A38;line-height:1.55;word-break:break-word}
.pc-kicker .pc-type{color:#732A35}
.pc-kicker .pc-sep{opacity:.5}
.pc-kicker .pc-actor{color:#4A2E1C}
.pc-kicker .pc-tail{color:#7A5A38;font-weight:500}
.pc-collapse{flex:none;min-height:30px;padding:0 9px;border-radius:5px;border:1px solid rgba(90,50,30,.28);background:rgba(255,255,255,.22);color:#6E4A33;font-size:10.5px;font-weight:600;letter-spacing:.04em;font-family:inherit}
.pc-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:5px;font-size:10.5px;letter-spacing:.04em;color:#8A6A50;min-height:22px}
.pc-stars{color:#A9793A;font-size:11px;letter-spacing:.14em}
.pc-meta .pc-dot{opacity:.5}
.pc-reroll,.pc-legend-btn{min-height:28px;padding:0 9px;border-radius:5px;border:1px solid rgba(90,50,30,.24);background:rgba(255,255,255,.22);color:#6E4A33;font-size:10.5px;font-weight:600;letter-spacing:.03em;font-family:inherit}
.pc-reroll[disabled]{opacity:.42}
.pc-legend-btn{padding:0 7px;background:transparent;color:#8A6A50;font-size:10px}
.pc-legend{display:none;margin-top:6px;font-size:10.5px;line-height:1.5;color:#6E4A33;background:rgba(255,255,255,.24);border:1px solid rgba(90,50,30,.16);border-radius:5px;padding:6px 8px}
.pc-legend.on{display:block}
.pc-text{position:relative;z-index:1;margin:10px 0 0;font-family:var(--font-display,serif);font-weight:600;font-size:clamp(17px,4.7vw,21px);line-height:1.6;letter-spacing:.01em;color:#2A1D14}
.pc-attrib{position:relative;z-index:1;margin-top:9px;font-size:11.5px;color:#7C4A30;letter-spacing:.03em;line-height:1.5}
.pc-attrib b{color:#4A2E1C}
.pc-acts{position:relative;z-index:1;display:flex;gap:9px;margin-top:13px}
.pc-btn{flex:1;min-height:46px;border-radius:8px;font-size:14.5px;font-weight:600;letter-spacing:.14em;font-family:inherit;transition:transform var(--t-fast,150ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.pc-btn.ink{background:linear-gradient(180deg,#3A2519,#241610);color:#F6EBD8;border:1px solid rgba(176,138,87,.5);box-shadow:inset 0 1px 0 rgba(255,226,196,.16)}
.pc-btn.line{background:rgba(255,255,255,.2);border:1px solid rgba(90,50,30,.34);color:#4A2A1A}
.pc-btn.wide{width:100%}
.pc-btn[disabled]{opacity:.5}
.pc-foot{position:relative;z-index:1;margin-top:10px;font-size:9.5px;letter-spacing:.04em;color:#A0896C;text-align:center;line-height:1.5}
.pc-fate{display:flex;flex-direction:column;gap:8px;margin-top:10px}
.pc-opt{display:block;width:100%;text-align:left;min-height:74px;padding:11px 12px;border-radius:8px;border:1px solid rgba(90,50,30,.26);background:rgba(255,255,255,.28);color:#2A1D14;font-family:inherit;transition:transform var(--t-fast,150ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.pc-opt-tag{display:block;font-size:10.5px;font-weight:700;letter-spacing:.1em;color:#732A35}
.pc-opt-text{display:block;margin-top:4px;font-family:var(--font-display,serif);font-size:14.5px;line-height:1.5;font-weight:600;color:#2A1D14}
.pc-lead{position:relative;z-index:1;margin:9px 0 0;font-size:12.5px;line-height:1.6;color:#6E4A33}
.pc-restore{display:none;margin-top:10px}
.pc-dock.pc-collapsed .pc-meta,.pc-dock.pc-collapsed .pc-text,.pc-dock.pc-collapsed .pc-attrib,.pc-dock.pc-collapsed .pc-acts,.pc-dock.pc-collapsed .pc-foot,.pc-dock.pc-collapsed .pc-fate,.pc-dock.pc-collapsed .pc-lead,.pc-dock.pc-collapsed .pc-legend{display:none!important}
.pc-dock.pc-collapsed .pc-restore{display:block}
.pc-dock.pc-collapsed .pc-collapse{display:none}
@media (max-width:360px){.pc-dock{padding:13px 13px 11px}.pc-text{font-size:17px}}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("prompt-card-v6", CSS); return; }
    if (document.getElementById("style-prompt-card-v6")) return;
    var el = document.createElement("style");
    el.id = "style-prompt-card-v6";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  function nameOf(state, id) {
    if (id === "both") return "两人一起";
    var names = (state && state.names) || {};
    var raw = names[id];
    if (raw !== undefined && raw !== null && String(raw).trim()) return String(raw).trim();
    return FALLBACK_NAME[id] || "你们";
  }

  function kindLabel(kind) { return TYPE_LABEL[kind] || "题目"; }

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
    return {
      card: card,
      kind: opt.kind || card.kind || "",
      pool: pool,
      text: cardText(card),
      star: starsOf(card)
    };
  }

  function optionTypeLabel(o) {
    if (o.kind && TYPE_LABEL[o.kind]) return TYPE_LABEL[o.kind];
    if (o.pool && POOL_LABEL[o.pool]) return POOL_LABEL[o.pool];
    return "这一张";
  }

  function attribOf(prompt, state) {
    var kind = prompt && prompt.kind;
    var actor = nameOf(state, (prompt && prompt.actorId) || (state && state.turn));
    var target = nameOf(state, (prompt && prompt.targetId) || (prompt && prompt.actorId) || (state && state.turn));
    return {
      kind: kind,
      actor: actor,
      target: target,
      who: kind === "stack-duo" || (prompt && prompt.targetId === "both")
        ? "两人一起"
        : (kind === "ending" ? target : actor)
    };
  }

  function kickerHtml(prompt, state, attrs) {
    var kind = prompt.kind;
    var type = kindLabel(kind);
    if (kind === "fate") {
      return '<div class="pc-kicker" data-test="prompt-kicker">' +
        '<span class="pc-type">命运</span><span class="pc-sep"> · </span>' +
        '<span class="pc-tail">两张里挑一张 · 挑中的给 </span>' +
        '<span class="pc-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span>" +
        "</div>";
    }
    if (kind === "ending") {
      var n = state && state.endingIndex !== undefined ? Number(state.endingIndex) + 1 : 1;
      return '<div class="pc-kicker" data-test="prompt-kicker">' +
        '<span class="pc-type">收尾</span><span class="pc-sep"> · </span>' +
        '<span class="pc-tail">今晚最后一段 · 第 ' + n + '/2 张 · 给 </span>' +
        '<span class="pc-actor" data-test="prompt-actor">' + esc(attrs.target) + "</span>" +
        "</div>";
    }
    if (kind === "capture") {
      return '<div class="pc-kicker" data-test="prompt-kicker">' +
        '<span class="pc-type">击落</span><span class="pc-sep"> · </span>' +
        '<span class="pc-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span>" +
        '<span class="pc-tail"> 的飞机回机坪了 · 这张给 ' + esc(attrs.actor) + "</span>" +
        "</div>";
    }
    if (kind === "stack-duo" || prompt.targetId === "both") {
      return '<div class="pc-kicker" data-test="prompt-kicker">' +
        '<span class="pc-type">叠机</span><span class="pc-sep"> · </span>' +
        '<span class="pc-actor" data-test="prompt-actor">两人一起</span>' +
        '<span class="pc-tail"> · 这张给你们俩</span>' +
        "</div>";
    }
    return '<div class="pc-kicker" data-test="prompt-kicker">' +
      '<span class="pc-type">' + esc(type) + '</span><span class="pc-sep"> · </span>' +
      '<span class="pc-tail">这张给 </span>' +
      '<span class="pc-actor" data-test="prompt-actor">' + esc(attrs.actor) + "</span>" +
      "</div>";
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
    return "放过也算数 · 心动值不会少 · 长按右上「先收棋」随时可以停";
  }

  function reduced() {
    try { if (App.Motion && App.Motion.reduced) return !!App.Motion.reduced(); } catch (e) {}
    return document.body.classList.contains("reduce");
  }

  function clearPrevious() {
    var old = document.querySelectorAll(".pc-root");
    for (var i = 0; i < old.length; i++) {
      if (old[i] && old[i].parentNode) old[i].parentNode.removeChild(old[i]);
    }
  }

  function squareLine(prompt) {
    var kind = prompt && prompt.kind;
    var grid = GRID_LABEL[kind] || "";
    if (!grid) return "";
    var label = "来自 " + grid;
    if (prompt.squareIndex !== undefined && !isNaN(Number(prompt.squareIndex))) {
      return label + " · 第 " + Number(prompt.squareIndex) + " 格";
    }
    var n = prompt.cellIndex !== undefined ? prompt.cellIndex : prompt.index;
    if (n !== undefined && !isNaN(Number(n))) return label + " · 第 " + (Number(n) + 1) + " 格";
    if (prompt.preSquareId !== undefined) {
      var m = /:(\d+)/.exec(String(prompt.preSquareId));
      if (m) return label + " · 第 " + (Number(m[1]) + 1) + " 格";
    }
    return label;
  }

  function rerollValue(prompt, state) {
    if (prompt && prompt.rerollLeft !== undefined) return Number(prompt.rerollLeft);
    if (state && state.rerollLeft !== undefined) return Number(state.rerollLeft);
    if (state && state.rerollsLeft !== undefined) return Number(state.rerollsLeft);
    return null;
  }

  App.PromptCard = {
    KIND_LABEL: TYPE_LABEL,
    classify: function (prompt, state) { return attribOf(prompt || {}, state || {}).who; },
    open: function (host, prompt, state, handlers) {
      handlers = handlers || {};
      if (!host || !prompt) return function () {};
      injectStyle();
      clearPrevious();
      state = state || {};

      var root = document.createElement("div");
      root.className = "pc-root";
      root.setAttribute("data-test", "prompt-card");
      var kind = prompt.kind || "";
      root.setAttribute("data-kind", kind);
      if (prompt.actorId) root.setAttribute("data-actor", prompt.actorId);

      var attrs = attribOf(prompt, state);
      var isFate = kind === "fate" && Array.isArray(prompt.options) && prompt.options.length > 0;
      var star = starsOf(prompt.card);
      var left = rerollValue(prompt, state);

      var rerollHtml = "";
      if (typeof handlers.reroll === "function") {
        rerollHtml = '<button class="pc-reroll" data-act="reroll" data-test="prompt-reroll" type="button"' +
          (left !== null && left <= 0 ? " disabled" : "") + ">换一张" +
          (left === null ? "" : " · 还有 " + Math.max(0, left) + " 次") + "</button>";
      }

      var meta =
        '<div class="pc-meta" data-test="prompt-meta">' +
          (isFate
            ? '<span class="pc-stars" data-test="prompt-stars" aria-label="两张牌">两张牌</span>'
            : '<span class="pc-stars" data-test="prompt-stars" aria-label="' + star + ' 星尺度">' + starText(star) + "</span>") +
          (squareLine(prompt) ? '<span class="pc-dot">·</span><span data-test="prompt-source">' + esc(squareLine(prompt)) + "</span>" : "") +
          rerollHtml +
          '<button class="pc-legend-btn" data-act="legend" type="button" data-test="prompt-stars-help">星数怎么看</button>' +
        "</div>" +
        '<div class="pc-legend" data-legend>★ 是这张的尺度：星越多，越靠近你们今晚选的上限。</div>';

      var body = "";
      if (isFate) {
        var opts = prompt.options.slice(0, 2).map(function (raw, i) {
          var o = readOption(raw);
          return '<button class="pc-opt" type="button" data-test="prompt-fate-option" data-index="' + i + '"' +
            ' data-choose="' + i + '">' +
            '<span class="pc-opt-tag">要这张 · ' + esc(optionTypeLabel(o)) + " " + o.star + "★</span>" +
            '<span class="pc-opt-text">' + esc(o.text) + "</span>" +
            "</button>";
        }).join("");
        body =
          '<p class="pc-lead">两张里挑一张。另一张会放回池子。</p>' +
          '<div class="pc-fate">' + opts + "</div>" +
          '<div class="pc-acts"><button class="pc-btn line wide" type="button" data-act="fate-skip" data-test="prompt-fate-skip">今晚先不选</button></div>';
      } else {
        body =
          '<p class="pc-text" data-test="prompt-text">' + esc(cardText(prompt.card)) + "</p>" +
          '<div class="pc-attrib" data-test="prompt-attrib">' + attribLine(prompt, state) + "</div>" +
          '<div class="pc-acts">' +
            '<button class="pc-btn ink" type="button" data-act="done" data-test="prompt-done">做了</button>' +
            '<button class="pc-btn line" type="button" data-act="skipped" data-test="prompt-skip">放过</button>' +
          "</div>";
      }

      var top =
        '<div class="pc-top">' + kickerHtml(prompt, state, attrs) +
          '<button class="pc-collapse" data-act="collapse" type="button" data-test="prompt-collapse">先看棋盘</button>' +
        "</div>";

      root.innerHTML =
        '<div class="pc-dock' + (kind === "ending" ? " pc-ending" : "") + '">' +
          '<div class="pc-inner">' +
            top + meta + body +
            '<div class="pc-restore"><button class="pc-btn ink wide" data-act="collapse" type="button" data-test="prompt-restore">回到这张</button></div>' +
            '<div class="pc-foot">' + esc(footLine(prompt)) + "</div>" +
          "</div>" +
        "</div>";

      host.appendChild(root);

      var fired = false;
      var closed = false;

      function setAllDisabled(on) {
        var btns = root.querySelectorAll("button");
        for (var i = 0; i < btns.length; i++) {
          if (on) btns[i].setAttribute("disabled", "disabled");
          else btns[i].removeAttribute("disabled");
        }
      }

      function fire(name, arg) {
        if (closed || fired) return;
        if (typeof handlers[name] !== "function") {
          if (name === "choose" && typeof handlers.done === "function") handlers.done();
          return;
        }
        fired = true;
        setAllDisabled(true);
        try {
          handlers[name](arg);
        } catch (e) {
          fired = false;
          setAllDisabled(false);
          if (window.console) console.error("[prompt-card]", e);
          if (App.UI && App.UI.toast) App.UI.toast("这张刚才没记上，再点一次");
        }
      }

      root.addEventListener("click", function (e) {
        var t = e.target;
        if (!t || !t.closest) return;
        var opt = t.closest("[data-choose]");
        if (opt) {
          var idx = Number(opt.getAttribute("data-choose"));
          fire("choose", isNaN(idx) ? 0 : idx);
          return;
        }
        var btn = t.closest("[data-act]");
        if (!btn || btn.hasAttribute("disabled")) return;
        var act = btn.getAttribute("data-act");
        if (act === "legend") { btn.setAttribute("aria-expanded", btn.getAttribute("aria-expanded") === "true" ? "false" : "true"); var legend = root.querySelector("[data-legend]"); if (legend) legend.classList.toggle("on"); if (App.Audio) App.Audio.play("tap"); return; }
        if (act === "collapse") {
          var dock = root.querySelector(".pc-dock");
          var collapsed = dock.classList.toggle("pc-collapsed");
          var topBtn = root.querySelector(".pc-collapse");
          if (topBtn) topBtn.textContent = collapsed ? "回到这张" : "先看棋盘";
          if (App.Audio) App.Audio.play("tap");
          return;
        }
        if (act === "done") fire("done");
        else if (act === "skipped") fire("skipped");
        else if (act === "fate-skip") fire("skipped");
        else if (act === "reroll") fire("reroll");
      });

      if (App.Audio) App.Audio.play("cardIn");
      if (reduced() && App.Motion && App.Motion.syncBodyClass) App.Motion.syncBodyClass();

      function close() {
        if (closed) return;
        closed = true;
        if (root.parentNode) root.parentNode.removeChild(root);
        if (typeof handlers.close === "function") {
          try { handlers.close(); } catch (e) {}
        }
      }

      return close;
    }
  };
})();

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
.pc-root{position:fixed;left:0;right:0;bottom:0;z-index:30;display:flex;justify-content:center;
  padding:0 10px calc(10px + var(--safe-b,0px));pointer-events:none;
  font-family:var(--font-body,var(--sans,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif));}
.pc-dock{position:relative;pointer-events:auto;width:100%;max-width:520px;border-radius:var(--r-lg,26px);
  padding:15px 16px 13px;color:var(--paper-ink,#2C1C15);
  background:radial-gradient(120% 90% at 18% 0%,#FDF5E7 0%,var(--paper,#F7EAD6) 52%,var(--paper2,var(--paper-2,#F1DFC4)) 100%);
  box-shadow:0 18px 44px rgba(3,2,10,.5),0 0 0 1px rgba(255,226,196,.28) inset;
  overflow:hidden;transform-origin:50% 100%;
  animation:pcIn 300ms var(--ease-out,cubic-bezier(.16,1,.3,1)) both;}
.pc-dock::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23p)' opacity='0.22'/%3E%3C/svg%3E");}
@keyframes pcIn{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}
body.reduce .pc-dock{animation-duration:80ms!important}
@media (prefers-reduced-motion: reduce){.pc-dock{animation-duration:80ms!important}}
.pc-inner{position:relative;z-index:1}
.pc-top{display:flex;align-items:flex-start;gap:8px}
.pc-kicker{flex:1;min-width:0;font-size:12px;letter-spacing:.14em;font-weight:800;color:#8A5A32;line-height:1.55;word-break:break-word}
.pc-kicker .pc-type{color:#7C2A3A}
.pc-kicker .pc-sep{opacity:.55}
.pc-kicker .pc-actor{color:#5A2E1C}
.pc-kicker .pc-tail{color:#8A5A32;font-weight:650}
.pc-collapse{flex:none;min-height:32px;padding:0 10px;border-radius:999px;border:1px solid rgba(90,50,30,.22);
  background:rgba(255,255,255,.35);color:#6E4A33;font-size:11px;font-weight:700;letter-spacing:.04em;font-family:inherit}
.pc-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:5px;font-size:11px;letter-spacing:.04em;color:#8A6A50;min-height:22px}
.pc-stars{color:#C8902F;font-size:13px;letter-spacing:.14em}
.pc-meta .pc-dot{opacity:.5}
.pc-reroll{min-height:30px;padding:0 10px;border-radius:999px;border:1px solid rgba(90,50,30,.22);
  background:rgba(255,255,255,.35);color:#6E4A33;font-size:11px;font-weight:700;letter-spacing:.04em;font-family:inherit}
.pc-reroll[disabled]{opacity:.42}
.pc-legend-btn{min-height:30px;padding:0 8px;border-radius:999px;border:1px solid rgba(90,50,30,.24);
  color:#8A6A50;font-size:10.5px;line-height:1;background:transparent;font-family:inherit;letter-spacing:.02em}
.pc-legend{display:none;margin-top:6px;font-size:11px;line-height:1.5;color:#6E4A33;background:rgba(255,255,255,.35);
  border-radius:10px;padding:7px 9px}
.pc-legend.on{display:block}
.pc-text{position:relative;z-index:1;margin:10px 0 0;font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC","STSong",serif));
  font-weight:600;font-size:clamp(17px,4.7vw,21px);line-height:1.58;letter-spacing:.01em;color:#2B1A12}
.pc-attrib{position:relative;z-index:1;margin-top:9px;font-size:12px;color:#7C4A30;letter-spacing:.04em;line-height:1.5}
.pc-attrib b{color:#5A2E1C}
.pc-acts{position:relative;z-index:1;display:flex;gap:10px;margin-top:13px}
.pc-btn{flex:1;min-height:48px;border-radius:999px;font-size:15px;font-weight:800;letter-spacing:.14em;
  font-family:inherit;transition:transform var(--t-fast,160ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.pc-btn:active{transform:scale(.98)}
.pc-btn.ink{background:linear-gradient(180deg,#362117,#241410);color:#FFF4E4;
  box-shadow:0 1px 0 rgba(255,226,196,.2) inset,0 8px 18px rgba(60,30,20,.3)}
.pc-btn.line{background:rgba(255,255,255,.28);border:1px solid rgba(60,35,24,.34);color:#4A2A1A}
.pc-btn.wide{width:100%}
.pc-btn[disabled]{opacity:.5}
.pc-foot{position:relative;z-index:1;margin-top:10px;font-size:9.5px;letter-spacing:.05em;color:#A98A6C;text-align:center;line-height:1.5}
.pc-fate{display:flex;flex-direction:column;gap:9px;margin-top:10px}
.pc-opt{display:block;width:100%;text-align:left;min-height:76px;padding:11px 12px;border-radius:16px;
  border:1px solid rgba(90,50,30,.22);background:rgba(255,255,255,.42);color:#2B1A12;
  box-shadow:0 2px 0 rgba(90,50,30,.06);font-family:inherit;
  transition:transform var(--t-fast,160ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.pc-opt:active{transform:scale(.99)}
.pc-opt-tag{display:block;font-size:11.5px;font-weight:800;letter-spacing:.1em;color:#7C2A3A}
.pc-opt-text{display:block;margin-top:4px;font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:15px;line-height:1.5;font-weight:600;color:#2B1A12}
.pc-lead{position:relative;z-index:1;margin:9px 0 0;font-size:13px;line-height:1.6;color:#6E4A33}
.pc-restore{display:none;margin-top:10px}
.pc-dock.pc-collapsed .pc-meta,
.pc-dock.pc-collapsed .pc-text,
.pc-dock.pc-collapsed .pc-attrib,
.pc-dock.pc-collapsed .pc-acts,
.pc-dock.pc-collapsed .pc-foot,
.pc-dock.pc-collapsed .pc-fate,
.pc-dock.pc-collapsed .pc-lead,
.pc-dock.pc-collapsed .pc-legend{display:none!important}
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

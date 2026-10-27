/* ===== V3 ui/screens/event.js：幕末事件屏（叙事 + 2–3 选项 + 结果反馈 + 继续） =====
 * 契约：App.Screens.event = { mount(root, params), unmount() }
 * 事件来源：window.CONTENT.events（优先 state.pendingEventId，否则按 afterAct=state.act 且未选过）。
 * 选项 → App.Engine.chooseEvent → 结果（outcome + 资源变化）→ 继续 → act / leaveAct 路由。
 * ========================================================================== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  App.UI.injectStyle("event", [
    ".ev-screen{padding-top:calc(12px + var(--safe-t));justify-content:flex-start;}",
    ".ev-top{display:flex;align-items:center;gap:10px;min-height:40px;margin-bottom:8px;}",
    ".ev-kicker{flex:1;font-size:10.5px;letter-spacing:.3em;color:var(--dim2);text-transform:uppercase;}",
    ".ev-act{font-size:11px;color:var(--dim);letter-spacing:.12em;padding:5px 11px;border:1px solid var(--line);border-radius:999px;background:var(--glass);white-space:nowrap;}",
    ".ev-hud{display:flex;align-items:center;gap:12px;padding:9px 12px;border-radius:14px;background:var(--glass);border:1px solid var(--line);margin:0 0 16px;}",
    ".ev-hud .res{font-size:12px;gap:4px;}",
    ".ev-hud .res b{font-size:13px;}",
    ".ev-stage{position:relative;perspective:1000px;}",
    ".ev-card{position:relative;overflow:hidden;padding:24px 20px 20px;border-radius:var(--r-lg);animation:evCardIn .62s var(--ease) both;background:linear-gradient(170deg,rgba(46,32,78,.92),rgba(15,10,30,.98));}",
    "body.reduce .ev-card{animation:none;}",
    "@keyframes evCardIn{from{opacity:0;transform:translateY(26px) rotateX(10deg) scale(.965);}to{opacity:1;transform:none;}}",
    ".ev-glow{position:absolute;left:50%;top:-30%;width:320px;height:320px;transform:translateX(-50%);border-radius:50%;pointer-events:none;background:radial-gradient(circle,rgba(154,124,255,.22),rgba(255,95,158,.10) 48%,transparent 70%);filter:blur(16px);}",
    ".ev-stars{position:absolute;inset:0;pointer-events:none;opacity:.5;background-image:radial-gradient(1px 1px at 18% 22%,rgba(255,255,255,.8),transparent 60%),radial-gradient(1px 1px at 76% 16%,rgba(255,255,255,.6),transparent 60%),radial-gradient(1.5px 1.5px at 62% 64%,rgba(255,255,255,.55),transparent 60%),radial-gradient(1px 1px at 30% 78%,rgba(255,255,255,.5),transparent 60%);}",
    ".ev-head{position:relative;}",
    ".ev-label{font-size:10.5px;letter-spacing:.28em;color:var(--gold);margin-bottom:10px;font-weight:700;}",
    ".ev-title{font-size:clamp(24px,7.2vw,30px);line-height:1.28;font-weight:800;letter-spacing:.04em;}",
    ".ev-title::after{content:'';display:block;width:38px;height:2px;border-radius:99px;margin-top:12px;background:linear-gradient(90deg,var(--gold),transparent);}",
    ".ev-text{position:relative;margin-top:16px;display:flex;flex-direction:column;gap:10px;}",
    ".ev-p{font-size:14.5px;line-height:1.9;color:var(--dim);letter-spacing:.015em;}",
    ".ev-p:first-child{color:var(--ink);opacity:.94;}",
    ".ev-p{animation:evP .55s var(--ease) both;}",
    ".ev-p:nth-child(1){animation-delay:.05s;}",
    ".ev-p:nth-child(2){animation-delay:.16s;}",
    ".ev-p:nth-child(3){animation-delay:.27s;}",
    "body.reduce .ev-p{animation:none;}",
    "@keyframes evP{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}",
    /* 选项 */
    ".ev-options{position:relative;display:flex;flex-direction:column;gap:10px;margin-top:22px;}",
    ".ev-option{display:flex;align-items:center;gap:12px;width:100%;min-height:56px;padding:12px 14px;border-radius:16px;text-align:left;background:var(--glass);border:1px solid var(--line2);transition:transform var(--t-fast) var(--ease),background var(--t-fast),border-color var(--t-fast);}",
    ".ev-option:active{transform:scale(.98);}",
    ".ev-option.on{border-color:rgba(243,200,121,.6);background:rgba(243,200,121,.10);}",
    ".ev-option[disabled]{opacity:.45;pointer-events:none;}",
    ".ev-key{flex:0 0 auto;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11.5px;font-weight:800;color:var(--gold);border:1px solid rgba(243,200,121,.4);background:rgba(243,200,121,.08);}",
    ".ev-option-main{flex:1;min-width:0;}",
    ".ev-option-label{font-size:14.5px;font-weight:700;line-height:1.45;letter-spacing:.01em;}",
    ".ev-effects{display:flex;flex-wrap:wrap;gap:8px;margin-top:5px;}",
    ".ev-effects .res{font-size:11px;gap:4px;color:var(--dim);}",
    ".ev-effects .res b{font-size:12px;}",
    ".ev-arrow{flex:0 0 auto;color:var(--dim2);font-size:15px;}",
    ".ev-tip{margin-top:16px;text-align:center;font-size:10.5px;letter-spacing:.08em;color:var(--dim2);}",
    /* 结果 */
    ".ev-result{position:relative;margin-top:4px;animation:evCardIn .5s var(--ease) both;}",
    "body.reduce .ev-result{animation:none;}",
    ".ev-result .ev-card{padding-bottom:22px;}",
    ".ev-outcome{margin-top:18px;padding:16px;border-radius:var(--r-md);background:rgba(255,255,255,.05);border:1px solid var(--line);}",
    ".ev-outcome-label{font-size:10.5px;letter-spacing:.26em;color:var(--gold);margin-bottom:8px;font-weight:700;}",
    ".ev-outcome-text{font-size:14.5px;line-height:1.9;color:var(--ink);}",
    ".ev-gain{display:flex;flex-wrap:wrap;gap:12px;margin-top:14px;}",
    ".ev-gain .res{font-size:14px;font-weight:800;}",
    ".ev-gain .res b{font-size:15px;}",
    ".ev-flag{display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:11px;color:var(--teal);letter-spacing:.04em;}",
    ".ev-actions{margin-top:18px;display:flex;flex-direction:column;gap:10px;}",
    ".ev-actions .btn{min-height:52px;}",
    ".ev-continue .sub{display:block;font-size:10.5px;margin-top:1px;}",
    "@media (max-width:360px){.ev-card{padding:20px 15px 17px;}.ev-option{padding:11px 12px;}.ev-title{font-size:23px;}}"
  ].join("\n"));

  var RES_ORDER = ["heart", "tension", "sync", "coins"];
  var TYPE_COLORS = ["#9a7cff", "#ff5f9e", "#f3c879", "#4fd6c8", "#ffffff"];

  var state = null;
  var root = null;
  var alive = false;
  var busy = false;
  var currentEvent = null;
  var chosenOption = null;
  var view = "choose"; /* choose | result */

  function B() { return App.Balance || {}; }
  function resMeta(k) { return App.UI.RES[k] || { icon: "", label: k, cls: "" }; }
  function intOr(n, d) { n = Math.round(Number(n)); return isFinite(n) ? n : d; }
  function reasonText(reason) {
    var map = {
      wrong_phase: "现在不是事件阶段",
      event_not_found: "这个事件已经结束了",
      event_already_chosen: "这个事件已经选过了",
      option_not_found: "选项不存在"
    };
    return map[reason] || "这一步现在做不了";
  }

  function contentEvents() {
    var c = window.CONTENT;
    return (c && c.events instanceof Array) ? c.events : [];
  }

  function resolveEvent(st) {
    var list = contentEvents();
    if (!list.length) return null;
    if (st && st.pendingEventId) {
      for (var p = 0; p < list.length; p++) if (list[p] && list[p].id === st.pendingEventId) return list[p];
    }
    var act = intOr(st && st.act, 1);
    var chosen = (st && st.events) || {};
    var flags = (st && st.flags) || {};
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (!e || !e.id) continue;
      if (intOr(e.afterAct, act) !== act) continue;
      if (chosen[e.id] !== undefined) continue;
      if (flags["event_" + e.id]) continue;
      return e;
    }
    /* 引擎没有标记已选时的兜底：取同幕第一个 */
    for (var j = 0; j < list.length; j++) {
      if (list[j] && intOr(list[j].afterAct, act) === act) return list[j];
    }
    return null;
  }

  function loadState(params) {
    var st = (params && params.state) ? params.state : App.Store.getSession();
    if (!st) return null;
    try { st = App.Engine.validate(st) || st; } catch (e) {}
    return st;
  }

  /* ---------------- 视图片段 ---------------- */
  function hudHtml(st) {
    var r = st.resources || {};
    return '<div class="ev-hud" data-test="event-hud">' + RES_ORDER.map(function (k) {
      var m = resMeta(k);
      return '<span class="res ' + m.cls + '" data-res="' + k + '" title="' + m.label + '"><i>' + m.icon + "</i>" +
        '<b data-res-val="' + k + '">' + U.round(r[k] || 0) + "</b></span>";
    }).join("") + "</div>";
  }

  function effectsHtml(option) {
    var ef = (option && option.effects) || {};
    var parts = [];
    RES_ORDER.forEach(function (k) {
      var v = U.round(ef[k] || 0);
      if (!v) return;
      var m = resMeta(k);
      parts.push('<span class="res ' + m.cls + '"><i>' + m.icon + "</i>" + (v > 0 ? "+" : "") + v + " " + m.label + "</span>");
    });
    return parts.length ? '<div class="ev-effects">' + parts.join("") + "</div>" : "";
  }

  function optionHtml(option, index) {
    var letter = String.fromCharCode(65 + index);
    var id = option && option.id ? String(option.id) : ("opt" + index);
    return '<button class="ev-option" data-test="event-option-' + U.escape(id) + '" data-option-id="' + U.escape(id) + '" aria-label="' + U.escape(option.label || "") + '">' +
      '<span class="ev-key" aria-hidden="true">' + letter + "</span>" +
      '<span class="ev-option-main">' +
      '<span class="ev-option-label">' + U.escape(option.label || "") + "</span>" +
      effectsHtml(option) +
      "</span>" +
      '<span class="ev-arrow" aria-hidden="true">→</span>' +
      "</button>";
  }

  function shellHtml(st, ev) {
    var actInfo = {};
    try { actInfo = App.Engine.actInfo(st) || {}; } catch (e) {}
    var paragraphs = (ev && ev.text instanceof Array ? ev.text : [ev && ev.text ? ev.text : ""]).filter(function (p) { return p !== null && p !== undefined && p !== ""; });
    var options = (ev && ev.options instanceof Array) ? ev.options : [];
    return '<div class="page ev-screen" data-test="event-screen" data-phase="' + U.escape(st.phase) + '">' +
      '<div class="ev-top">' +
      '<div class="ev-kicker" data-test="event-kicker">EVENT · ' + (view === "result" ? "已选择" : "幕末事件") + "</div>" +
      '<div class="ev-act">第 ' + (actInfo.act || st.act || 1) + " 幕 · " + U.escape(actInfo.name || "航线") + "</div>" +
      "</div>" +
      hudHtml(st) +
      '<div class="ev-stage">' +
      '<article class="ev-card card-face" data-test="event-card">' +
      '<span class="ev-glow" aria-hidden="true"></span>' +
      '<span class="ev-stars" aria-hidden="true"></span>' +
      '<div class="ev-head">' +
      '<div class="ev-label">' + (view === "result" ? "海面记住了这个选择" : "第 " + (st.act || 1) + " 幕末 · 航线事件") + "</div>" +
      '<h1 class="ev-title" data-test="event-title">' + U.escape(ev.title || "航线上的一刻") + "</h1>" +
      '<div class="ev-text">' + paragraphs.map(function (p) { return '<p class="ev-p">' + U.escape(p) + "</p>"; }).join("") + "</div>" +
      "</div>" +
      (view === "choose"
        ? '<div class="ev-options" data-test="event-options">' + options.map(optionHtml).join("") + "</div>" +
          '<div class="ev-tip">你们怎么选，这一夜就怎么走</div>'
        : "") +
      "</article>" +
      (view === "result" ? resultHtml(st) : "") +
      "</div></div>";
  }

  function resultHtml(st) {
    var opt = chosenOption || {};
    var lastGain = null;
    var log = st.log || [];
    for (var i = log.length - 1; i >= 0; i--) {
      if (log[i] && log[i].type === "event") { lastGain = log[i]; break; }
    }
    var deltas = (lastGain && lastGain.deltas) || {};
    var outcome = (opt.outcome instanceof Array ? opt.outcome : (opt.outcome ? [opt.outcome] : [])).filter(Boolean).join(" ");
    var gainParts = [];
    RES_ORDER.forEach(function (k) {
      var v = U.round(deltas[k] || 0);
      if (!v) return;
      var m = resMeta(k);
      gainParts.push('<span class="res ' + m.cls + '"><i>' + m.icon + "</i>" + (v > 0 ? "+" : "") + v + " " + m.label + "</span>");
    });
    return '<section class="ev-result" data-test="event-result">' +
      '<div class="ev-outcome">' +
      '<div class="ev-outcome-label">这一刻</div>' +
      '<div class="ev-outcome-text" data-test="event-outcome">' + U.escape(outcome || "海面安静了一瞬。") + "</div>" +
      (gainParts.length ? '<div class="ev-gain" data-test="event-gain">' + gainParts.join("") + "</div>" : "") +
      (opt.flag ? '<div class="ev-flag" data-test="event-flag">✧ 选择已被记住</div>' : "") +
      "</div>" +
      '<div class="ev-actions">' +
      '<button class="btn primary xl wide ev-continue" data-test="event-continue" aria-label="继续航程">继续航程<span class="sub">' + (st.lastAct ? "驶向结局" : "下一幕") + "</span></button>" +
      "</div>" +
      "</section>";
  }

  /* ---------------- 动画 ---------------- */
  function animateChoice(events, prevRes) {
    if (!alive) return;
    var gainEv = null;
    for (var i = 0; i < (events || []).length; i++) if (events[i] && events[i].type === "gain") gainEv = events[i];
    var deltas = (gainEv && gainEv.res) || {};
    var keys = Object.keys(deltas);
    keys.forEach(function (k) {
      var el = root && root.querySelector('[data-res-val="' + k + '"]');
      if (el) {
        el.textContent = String(U.round((prevRes && prevRes[k]) || 0));
        M.count(el, U.round((state.resources && state.resources[k]) || 0), { dur: 520 });
      }
      var anchor = root && root.querySelector('[data-res="' + k + '"]');
      var m = resMeta(k);
      var cls = k === "coins" ? "" : (k === "heart" ? "rose" : (k === "sync" ? "teal" : ""));
      var v = U.round(deltas[k]);
      setTimeout(function () { if (alive) M.floatText(anchor, (v > 0 ? "+" : "") + v + " " + m.label, cls); }, 120);
    });
    var card = root && root.querySelector('[data-test="event-card"]');
    if (card) {
      var r = card.getBoundingClientRect();
      setTimeout(function () {
        if (!alive) return;
        M.burst(r.left + r.width / 2, r.top + r.height * 0.4, { count: 26, colors: TYPE_COLORS, radius: 170 });
      }, 120);
    }
    App.Audio.play("chime");
    App.UI.haptic("success");
  }

  /* ---------------- 动作 ---------------- */
  function chooseOption(option) {
    if (!alive || !state || busy || !currentEvent || view !== "choose") return;
    if (!option || !option.id) return;
    busy = true;
    var prevRes = U.copy(state.resources || {});
    var result = null;
    try {
      result = App.Engine.chooseEvent(state, currentEvent.id, option.id);
    } catch (e) {
      busy = false;
      App.UI.toast("选择记录失败，请重试", { kind: "rose" });
      if (window.console) console.error("[event]", e);
      return;
    }
    busy = false;
    var next = (result && result.state) ? result.state : result;
    var events = (result && result.events) ? result.events : [];
    var blocked = null;
    for (var i = 0; i < events.length; i++) if (events[i] && events[i].type === "stage" && events[i].blocked) blocked = events[i];
    if (blocked) {
      App.Audio.play("error");
      App.UI.toast(reasonText(blocked.reason), { kind: "rose" });
      return;
    }
    state = next;
    chosenOption = option;
    view = "result";
    try { App.Store.saveSession(state); } catch (e) {}
    render();
    animateChoice(events, prevRes);
  }

  function continueNext() {
    if (!alive || !state || busy) return;
    var ph = state.phase;
    if (ph === "event") { render(); return; }
    if (ph === "act" || ph === "shop") {
      if (App.Screens && App.Screens.act && typeof App.Screens.act.mount === "function" && ph === "act") {
        App.Router.go("act", { state: state }, { replace: true });
        return;
      }
      if (App.Screens && App.Screens.shop && typeof App.Screens.shop.mount === "function" && ph === "shop") {
        App.Router.go("shop", { state: state }, { replace: true });
        return;
      }
      /* act/shop 屏尚未就绪（自测场景）：leaveAct 直接推进 */
      busy = true;
      var next = null;
      try { next = App.Engine.leaveAct(state); } catch (e) {}
      busy = false;
      if (!next) { App.UI.toast("推进失败，请重试", { kind: "rose" }); return; }
      state = next;
      try { App.Store.saveSession(state); } catch (e) {}
      App.Audio.play("select");
      routeAfterLeave(state);
      return;
    }
    routeAfterLeave(state);
  }

  function routeAfterLeave(st) {
    var ph = st.phase;
    if (ph === "finale") {
      /* 兜底：finale 前若尚未生成 result，先 finish()（否则 finale 屏 result===null） */
      if (st && !st.result) {
        try {
          var r = App.Engine.finish(st);
          var next = (r && r.state) ? r.state : r;
          if (next) {
            st = next;
            try { App.Store.saveSession(st); } catch (e) {}
          }
        } catch (e) {
          if (window.console) console.error("[event] finish fallback", e);
        }
      }
      return App.Router.go("finale", { state: st }, { replace: true });
    }
    if (ph === "shop") return App.Router.go("shop", { state: st }, { replace: true });
    if (ph === "play" || ph === "resolve" || ph === "escalate") return App.Router.go("play", { state: st }, { replace: true });
    return App.Router.go("journey", { state: st }, { replace: true });
  }

  /* ---------------- 渲染 ---------------- */
  function render() {
    if (!alive || !root || !state || !currentEvent) return;
    root.innerHTML = shellHtml(state, currentEvent);
    if (view === "choose") {
      var opts = U.qsa('[data-option-id]', root);
      opts.forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (busy) return;
          App.Audio.play("select");
          var id = btn.getAttribute("data-option-id");
          var list = currentEvent.options || [];
          for (var i = 0; i < list.length; i++) {
            if (list[i] && String(list[i].id) === String(id)) { chooseOption(list[i]); return; }
          }
        });
      });
      if (!M.reduced()) {
        var optionEls = U.qsa(".ev-option", root);
        M.stagger(optionEls, 70);
      }
    } else {
      var cont = root && root.querySelector('[data-test="event-continue"]');
      if (cont) cont.addEventListener("click", function () { App.Audio.play("tap"); continueNext(); });
    }
  }

  /* ---------------- 屏幕契约 ---------------- */
  App.Screens = App.Screens || {};
  App.Screens.event = {
    mount: function (el, params) {
      root = el;
      alive = true;
      busy = false;
      view = "choose";
      chosenOption = null;
      state = loadState(params || {});
      if (!state) {
        App.UI.toast("没有进行中的夜晚", { kind: "rose" });
        setTimeout(function () { if (alive) App.Router.reset("boot"); }, 0);
        return;
      }
      if (state.phase !== "event") {
        var st = state;
        setTimeout(function () { if (alive) routeAfterLeave(st); }, 0);
        return;
      }
      currentEvent = resolveEvent(state);
      if (!currentEvent) {
        App.UI.toast("这一夜的事件已经结束了", { kind: "rose" });
        var s = state;
        setTimeout(function () { if (alive) continueNextFromEmpty(s); }, 0);
        return;
      }
      render();
    },
    unmount: function () {
      /* 同一屏重挂时，旧实例的延迟 unmount 不能清掉新实例状态 */
      var el = root;
      try {
        if (el && document.body.getAttribute("data-screen") === "event" && document.documentElement.contains(el)) return;
      } catch (e) {}
      alive = false;
      busy = false;
      state = null;
      root = null;
      currentEvent = null;
      chosenOption = null;
    }
  };

  function continueNextFromEmpty(st) {
    state = st;
    if (st.phase === "event") {
      /* 引擎认为是事件阶段但内容缺失：直接推进 */
      busy = true;
      var next = null;
      try { next = App.Engine.leaveAct(st); } catch (e) {}
      busy = false;
      if (next) { try { App.Store.saveSession(next); } catch (e) {} routeAfterLeave(next); return; }
    }
    routeAfterLeave(st);
  }
})();

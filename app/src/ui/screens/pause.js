/* ===== V6 ui/screens/pause.js：暂停层（安全词到达；覆盖当前屏，不卸载） =====
   · App.Pause.open(reason) → 全屏层 data-screen=pause（z-index 340，低于安全词 380）
   · 四个动作：继续 / 今晚就到这 / 看今晚记录 / 加一条今晚不做的（spec G1）
   · 只有「今晚就到这」（确认后）才 Flight.safeWord → 历史 → ledger；继续/记录/边界都不归档
   · 打开时 body[data-screen]=pause，关闭时恢复原屏名；当前屏 DOM 不卸载，状态不丢 */
(function () {
  var App = window.App;
  var U = App.util;

  var KIND = {
    "cell-truth": "真心话", "cell-dare": "大冒险", "cell-touch": "靠近",
    capture: "击落", "stack-duo": "叠机", "home-entry": "进航", ending: "收尾",
    fate: "命运", "minigame-thermo": "温度计", "minigame-wheel": "转盘",
    "minigame-truth-wheel": "真心话转盘", "minigame-dare-wheel": "大冒险转盘"
  };
  var SCALE = { gentle: "温柔", warm: "暧昧", hot: "热烈", open: "不设限" };

  var state = { el: null, open: false, prevScreen: null, view: "actions", reason: "button", cleanup: null };

  function session() {
    try { return App.Store.getSession(); } catch (e) { return null; }
  }

  function scaleName(id) { return SCALE[id] || "暧昧"; }

  function targetCards(s) {
    if (s && s.targetCards) return s.targetCards;
    if (s && s.mode) return s.mode === "long" ? 8 : 4;
    return s && s.planeCount === 2 ? 4 : 8;
  }

  function doneCount(s) {
    if (s && typeof s.cardsProcessed === "number") return s.cardsProcessed;
    var n = 0;
    ((s && s.log) || []).forEach(function (e) { if (e && e.outcome) n += 1; });
    return n;
  }

  function heatOf(s) {
    if (s && s.meta && typeof s.meta.heat === "number") return s.meta.heat;
    return 0;
  }

  function streakOf(s) {
    if (s && s.meta && typeof s.meta.streak === "number") return s.meta.streak;
    return 0;
  }

  function startedAt(s) {
    return (s && (s.startedAt || s.ts)) || Date.now();
  }

  function statLine(s) {
    if (!s) return "今晚还没有摆上棋盘。";
    return U.escape(s.names.a) + " 和 " + U.escape(s.names.b) + " · " + scaleName(s.scale) +
      " · 第 " + doneCount(s) + "/" + targetCards(s) + " 张 · 心动值 " + heatOf(s);
  }

  function promptsOf(s) {
    var out = [];
    ((s && s.log) || []).forEach(function (e) {
      if (!e || !e.outcome) return;
      var kind = KIND[e.kind] || e.kind || "一张卡";
      var who = "";
      if (e.actorId === "both") who = "两人一起";
      else if (e.actorId && s.names && s.names[e.actorId]) who = s.names[e.actorId];
      var said = e.outcome === "skipped" ? "今晚先放过" : (e.outcome === "done" ? "做了" : String(e.outcome));
      out.push({
        kind: kind,
        who: who,
        said: said,
        text: e.card && e.card.text ? String(e.card.text) : ""
      });
    });
    return out;
  }

  function recapHTML(s) {
    var items = promptsOf(s);
    var rows = items.slice(-40).map(function (it) {
      return '<div class="recap-row">' +
        '<div class="rk">' + U.escape(it.kind) + (it.who ? " · " + U.escape(it.who) : "") + " · " + U.escape(it.said) + "</div>" +
        (it.text ? '<div class="rt said clamp-2">' + U.escape(it.text) + "</div>" : "") +
        "</div>";
    }).join("");
    return '<button class="btn ghost sm pause-back" data-act="recap-back" data-test="pause-recap-back" type="button">← 回到暂停</button>' +
      '<div class="pause-kick"><span class="spark"></span><span>TONIGHT · 只读</span></div>' +
      '<div class="pause-h1">今晚的记录</div>' +
      '<div class="pause-sub">' + (s ? "现在还在这里，不会因为停一下就少了什么。" : "今晚还没有摆上棋盘。") + "</div>" +
      (s ? '<div class="glass pause-status" data-test="pause-recap-stats">' +
        '<div class="ps-line"><span><b>' + U.escape(s.names.a) + "</b> 和 <b>" + U.escape(s.names.b) + "</b></span>" +
        "<span>" + scaleName(s.scale) + "</span>" +
        "<span>第 <b>" + doneCount(s) + "/" + targetCards(s) + "</b> 张</span></div>" +
        '<div class="ps-heat">' + App.UI.heatPill(heatOf(s)) +
        '<span class="small dim">连击 <b class="gold">' + streakOf(s) + "</b></span></div>" +
        '<div class="ps-time">今晚 ' + App.UI.fmtDuration(Date.now() - startedAt(s)) + "</div>" +
        "</div>" : "") +
      '<div class="recap-list" data-test="pause-recap-list">' +
      (rows || '<div class="recap-empty">今晚还没有落下任何一张。这一晚仍然算数。</div>') +
      "</div>" +
      '<button class="btn primary wide mt-16" data-act="resume" data-test="pause-continue" type="button">继续</button>';
  }

  function actionsHTML(s) {
    var has = !!s;
    return '<div class="pause-kick"><span class="spark"></span><span>' + (state.reason === "safe" ? "先收好了。我们停一下。" : "PAUSE · 先停一下") + '</span></div>' +
      '<div class="pause-h1">先停一下</div>' +
      '<div class="pause-sub" data-test="pause-note-sub">今晚的记录会留着，不会少一条。</div>' +
      (has
        ? '<div class="glass pause-status" data-test="pause-status">' +
          '<div class="ps-line">' + statLine(s) + "</div>" +
          '<div class="ps-heat">' + App.UI.heatPill(heatOf(s)) +
          '<span class="small dim">连击 <b class="gold">' + streakOf(s) + "</b></span></div>" +
          '<div class="ps-time">今晚 ' + App.UI.fmtDuration(Date.now() - startedAt(s)) + "</div>" +
          "</div>"
        : '<div class="glass pause-status"><div class="ps-line">今晚还没有摆上棋盘，先歇一会儿。</div></div>') +
      '<div class="pause-actions" data-test="pause-actions">' +
      '<button class="btn primary" data-act="resume" data-test="pause-continue" type="button"><span class="lbl">继续</span><span class="hint">回到刚才那一页</span></button>' +
      '<button class="btn soft" data-act="end" data-test="pause-end" type="button"' + (has ? "" : ' aria-disabled="true"') + '><span class="lbl">今晚就到这</span><span class="hint">' + (has ? "收进以前的夜" : "还没有在走的棋") + "</span></button>" +
      '<button class="btn soft" data-act="record" data-test="pause-record" type="button"><span class="lbl">看今晚记录</span><span class="hint">只读，不结束</span></button>' +
      '<button class="btn ghost" data-act="boundary" data-test="pause-boundary" type="button"><span class="lbl">加一条今晚不做的</span><span class="hint">从下一张起生效</span></button>' +
      "</div>" +
      '<div class="pause-note">安全词只负责先停一下，不会把今晚收走。</div>';
  }

  function renderActions() {
    if (!state.el) return;
    state.view = "actions";
    var body = state.el.querySelector("[data-body]");
    body.innerHTML = actionsHTML(session());
  }

  function renderRecap() {
    if (!state.el) return;
    state.view = "recap";
    state.el.querySelector("[data-body]").innerHTML = recapHTML(session());
    state.el.scrollTop = 0;
  }

  function renderEndConfirm() {
    if (!state.el) return;
    state.view = "end";
    var s = session();
    var body = state.el.querySelector("[data-body]");
    body.innerHTML = '<div class="pause-kick"><span class="spark"></span><span>PAUSE · 今晚就到这</span></div>' +
      '<div class="pause-h1">今晚就到这？</div>' +
      '<div class="pause-sub">已经记下的记录会留着。下次打开还能看到。</div>' +
      '<div class="glass pause-panel pause-status" data-test="pause-end-confirm">' +
      '<div class="ps-line">' + statLine(s) + "</div>" +
      '<div class="ps-heat">' + App.UI.heatPill(heatOf(s)) + "</div>" +
      "</div>" +
      '<div class="pause-actions">' +
      '<button class="btn ghost" data-act="end-cancel" data-test="pause-end-cancel" type="button">再待一会儿</button>' +
      '<button class="btn primary" data-act="end-ok" data-test="pause-end-ok" type="button">就到这</button>' +
      "</div>" +
      '<div class="pause-note">今晚的记录会留着，不会少一条。</div>';
  }

  function renderBoundary() {
    if (!state.el) return;
    state.view = "boundary";
    bodyBoundary();
  }

  function bodyBoundary() {
    var s = session();
    var list = (s && Array.isArray(s.boundaries) ? s.boundaries : []).slice();
    var chips = list.map(function (b, i) {
      return '<button class="chip on" data-bdel="' + i + '" type="button">' + U.escape(b) + '<span class="x">✕</span></button>';
    }).join("");
    state.el.querySelector("[data-body]").innerHTML =
      '<div class="pause-kick"><span class="spark"></span><span>PAUSE · 边界</span></div>' +
      '<div class="pause-h1">再加一条</div>' +
      '<div class="pause-sub">加上以后，从下一张题卡起都不会出现。</div>' +
      '<div class="glass pause-panel">' +
      '<div class="field-row">' +
      '<input class="field" data-bound-input data-test="pause-boundary-input" maxlength="40" placeholder="一个词、一句话，或一个不想被问的方向" />' +
      "</div>" +
      (chips ? '<div class="chips bound-chips" data-test="pause-boundary-list">' + chips + "</div>" : "") +
      '<div class="pp-actions">' +
      '<button class="btn ghost" data-act="boundary-cancel" data-test="pause-boundary-cancel" type="button">先不加</button>' +
      '<button class="btn primary" data-act="boundary-save" data-test="pause-boundary-save" type="button">加上</button>' +
      "</div></div>" +
      '<div class="pause-note">写在这儿的，整晚都不会出现。划掉就作数。</div>';
    var input = state.el.querySelector("[data-bound-input]");
    if (input) setTimeout(function () { try { input.focus(); } catch (e) {} }, 60);
  }

  function saveBoundary() {
    var input = state.el.querySelector("[data-bound-input]");
    var text = input ? String(input.value || "").trim() : "";
    if (!text) {
      if (input) input.classList.add("err");
      if (App.UI) App.UI.toast("先写一条");
      return;
    }
    var s = session();
    if (!s) { App.UI.toast("现在没有在走的棋"); return; }
    if (!Array.isArray(s.boundaries)) s.boundaries = [];
    if (s.boundaries.indexOf(text) >= 0) {
      App.UI.toast("这条已经在里面了");
      return;
    }
    if (s.boundaries.length >= 20) { App.UI.toast("边界已经够多了"); return; }
    s.boundaries.push(text);
    var saved = App.Store.saveSession(s);
    var patch = { blacklist: (App.Store.getSettings().blacklist || []).slice() };
    if (patch.blacklist.indexOf(text) < 0) patch.blacklist.push(text);
    App.Store.saveSettings(patch);
    if (!saved || saved.ok === false) {
      App.UI.toast("这台手机没能记下这条");
      return;
    }
    if (App.Audio) App.Audio.play("stamp");
    App.UI.haptic("success");
    App.UI.toast("加上了，从下一张起生效");
    renderActions();
  }

  function removeBoundary(idx) {
    var s = session();
    if (!s || !Array.isArray(s.boundaries)) return;
    var text = s.boundaries[idx];
    if (text === undefined) return;
    s.boundaries.splice(idx, 1);
    App.Store.saveSession(s);
    var patch = { blacklist: (App.Store.getSettings().blacklist || []).filter(function (x) { return x !== text; }) };
    App.Store.saveSettings(patch);
    App.UI.toast("划掉了");
    bodyBoundary();
  }

  function close(silent) {
    if (!state.el || !state.open) return;
    var el = state.el;
    state.open = false;
    state.el = null;
    el.classList.remove("on");
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    if (state.prevScreen) document.body.setAttribute("data-screen", state.prevScreen);
    else document.body.removeAttribute("data-screen");
    state.prevScreen = null;
    if (App.Safe && App.Safe.sync) App.Safe.sync();
    if (!silent && App.Bus) App.Bus.emit("pause", false);
  }

  function endNight() {
    var s = session();
    if (!s) { App.UI.toast("现在没有在走的棋"); renderActions(); return; }
    try {
      if (App.Audio) App.Audio.play("safe");
      if (App.UI) App.UI.haptic("heavy");
      var ret = App.Flight.safeWord(s);
      if (!ret || !ret.ok) { App.UI.toast((ret && ret.error && ret.error.message) || "这一局先收不起来"); return; }
      var entry = App.Store.makeHistoryEntry(ret.state);
      App.Store.addHistory(entry);
      App.Store.clearSession();
      close(true);
      App.Router.reset("ledger", { id: entry.id });
    } catch (e) {
      if (window.console) console.error("[pause] endNight", e);
      App.UI.toast("没能收棋，可以先退出页面");
    }
  }

  function onAct(e, el) {
    var act = el.getAttribute("data-act");
    if (act === "resume") {
      if (App.Audio) App.Audio.play("tap");
      close();
      return;
    }
    if (act === "end") {
      renderEndConfirm();
      return;
    }
    if (act === "end-cancel") { renderActions(); return; }
    if (act === "end-ok") { endNight(); return; }
    if (act === "record") { renderRecap(); return; }
    if (act === "recap-back") { renderActions(); return; }
    if (act === "boundary") { renderBoundary(); return; }
    if (act === "boundary-cancel") { renderActions(); return; }
    if (act === "boundary-save") { saveBoundary(); return; }
    var del = el.getAttribute("data-bdel");
    if (del !== null) { removeBoundary(Number(del)); return; }
  }

  function open(reason) {
    if (state.open) {
      if (reason === "safe" && state.view !== "actions") renderActions();
      return api;
    }
    state.open = true;
    state.reason = reason || "button";
    state.prevScreen = document.body.getAttribute("data-screen");
    state.view = "actions";
    document.body.setAttribute("data-screen", "pause");

    var layer = document.createElement("div");
    layer.className = "pause-layer";
    layer.setAttribute("data-screen", "pause");
    layer.setAttribute("data-test", "pause-layer");
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.setAttribute("aria-label", "先停一下");
    layer.innerHTML = '<div class="pause-inner" data-body>' + actionsHTML(session()) + "</div>";
    (document.getElementById("app") || document.body).appendChild(layer);
    state.el = layer;
    requestAnimationFrame(function () { if (state.el === layer) layer.classList.add("on"); });

    layer.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("[data-act]") : null;
      if (t) { onAct(e, t); return; }
      var del = e.target.closest ? e.target.closest("[data-bdel]") : null;
      if (del) removeBoundary(Number(del.getAttribute("data-bdel")));
    });
    layer.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(); }
    });
    document.addEventListener("keydown", escClose);
    if (App.Audio) App.Audio.play("soft");
    if (App.UI) App.UI.haptic("light");
    if (App.Bus) App.Bus.emit("pause", true);
    var first = layer.querySelector("[data-test=pause-continue]");
    if (first) setTimeout(function () { try { first.focus(); } catch (e) {} }, 120);
    return api;
  }

  function escClose(e) {
    if (e.key === "Escape" && state.open) { e.preventDefault(); close(); }
  }

  var api = { open: open, close: close, isOpen: function () { return state.open; }, el: function () { return state.el; } };
  App.Pause = api;
  /* 路由切换时关掉暂停层（避免盖住新屏）；路由自己会重设 data-screen */
  if (App.Bus) {
    App.Bus.on("route", function () {
      if (state.open) close(true);
    });
    App.Bus.on("session", function (s) {
      if (state.open && !s) close(true);
    });
  }
})();

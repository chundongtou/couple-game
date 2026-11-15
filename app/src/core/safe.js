/* ===== 安全词：长按「先回去关灯」 ===== */
(function () {
  var App = (window.App = window.App || {});
  var el = null;
  var pressing = false;
  var rafId = null;
  var HOLD = 1600;
  var SHOW = { plan: 1, room: 1, door: 1 };

  var CSS = [
    ".global-safe{position:fixed;top:calc(8px + var(--safe-t));right:10px;z-index:380;",
    "display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 12px 0 10px;",
    "border-radius:999px;border:1px solid rgba(224,112,112,.45);",
    "background:rgba(36,16,12,.82);color:#f3d2c8;font-size:12px;font-weight:700;letter-spacing:.08em;",
    "backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);",
    "opacity:0;transform:translateY(-8px);pointer-events:none;",
    "transition:opacity .25s var(--ease),transform .25s var(--ease);",
    "user-select:none;-webkit-user-select:none;touch-action:none;}",
    ".global-safe.show{opacity:1;transform:none;pointer-events:auto;}",
    ".global-safe .gs-dot{width:8px;height:8px;border-radius:50%;background:#e07070;box-shadow:0 0 10px rgba(224,112,112,.8);}",
    ".global-safe .gs-ring{position:absolute;inset:-3px;border-radius:999px;pointer-events:none;",
    "background:conic-gradient(rgba(224,112,112,.9) calc(var(--p,0) * 1%), transparent 0);",
    "-webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));",
    "mask:radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px));opacity:0;}",
    ".global-safe.pressing .gs-ring{opacity:1;}",
    ".global-safe.pressing{color:#fff;background:rgba(90,28,24,.92);}"
  ].join("\n");

  function nightOn() {
    try {
      var s = App.Store.getSession();
      return !!(s && s.phase && s.phase !== "done" && s.mode !== "standalone");
    } catch (e) { return false; }
  }

  function visible() {
    var scr = document.body.getAttribute("data-screen");
    return !!(SHOW[scr] && nightOn());
  }

  function sync() {
    if (!el) return;
    el.classList.toggle("show", visible());
  }

  function setProgress(p) {
    if (el) el.style.setProperty("--p", String(Math.max(0, Math.min(100, p * 100))));
  }

  function stopPress() {
    pressing = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (el) { el.classList.remove("pressing"); setProgress(0); }
  }

  function archive(state) {
    if (!state || state.archived) return state;
    try {
      App.Store.addHistory(App.Store.makeHistoryEntry(state));
      state.archived = true;
      App.Store.saveSession(state);
    } catch (e) {}
    return state;
  }

  function trigger() {
    stopPress();
    var s = null;
    try { s = App.Store.getSession(); } catch (e) {}
    if (!s || s.mode === "standalone" || s.phase === "done") {
      App.UI.toast("现在没有进行中的夜晚");
      return;
    }
    try {
      var ret = App.Engine.safeWord(s);
      var next = archive(ret.state);
      if (App.Audio) App.Audio.play("soft");
      App.UI.haptic("heavy");
      App.Night.paint(null);
      App.UI.toast("灯先关了。做过的都还在。");
      App.Router.reset("close", { state: next });
    } catch (e) {
      App.UI.toast("没能关灯，可以先退出页面");
    }
  }

  function startPress(e) {
    if (!visible() || pressing) return;
    if (e && e.preventDefault) e.preventDefault();
    pressing = true;
    if (el) el.classList.add("pressing");
    var t0 = performance.now();
    function step() {
      if (!pressing) return;
      var now = performance.now();
      setProgress((now - t0) / HOLD);
      if (now - t0 >= HOLD) { trigger(); return; }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    if (App.Audio && App.Audio.play) App.Audio.play("tick");
  }

  function mount() {
    if (el) return;
    App.UI.injectStyle("safe", CSS);
    el = document.createElement("button");
    el.type = "button";
    el.className = "global-safe";
    el.setAttribute("data-test", "safety-word");
    el.setAttribute("aria-label", "安全词：按住「先回去关灯」，灯会自己暗下去，已经发生的都留着");
    el.innerHTML = '<span class="gs-ring"></span><span class="gs-dot"></span><span>先回去关灯</span>';
    document.getElementById("app").appendChild(el);
    el.addEventListener("pointerdown", startPress);
    el.addEventListener("pointerup", stopPress);
    el.addEventListener("pointercancel", stopPress);
    el.addEventListener("pointerleave", stopPress);
    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    App.Bus.on("route", sync);
    App.Bus.on("session", sync);
    sync();
  }

  App.Safe = { init: mount, sync: sync, trigger: trigger };
})();

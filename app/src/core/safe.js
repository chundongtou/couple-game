/* ===== 页角安全词：长按「合上本子」温柔收尾 ===== */
(function () {
  var App = (window.App = window.App || {});
  var el = null;
  var pressTimer = null;
  var rafId = null;
  var pressing = false;
  var fired = false;
  var HOLD = 1500;
  var HIDE = { boot: 1, setup: 1, finale: 1, memory: 1, settings: 1 };

  var CSS = [
    ".global-safe { position: fixed; right: 14px; top: calc(12px + var(--safe-t)); z-index: 380;",
    "  height: 40px; padding: 0 12px; border-radius: 4px 0 0 4px;",
    "  border: 1px solid #e4d3b0; border-right: 0; background: var(--tape, #e8d39a); color: #2a241c;",
    "  font-size: 12px; font-weight: 800; letter-spacing: .12em;",
    "  box-shadow: 0 6px 14px rgba(80,50,20,.08); transform: rotate(2deg);",
    "  opacity: 0; pointer-events: none; transition: opacity .25s ease;",
    "  user-select: none; -webkit-user-select: none; touch-action: none; }",
    ".global-safe.show { opacity: 1; pointer-events: auto; }",
    ".global-safe .gs-ring { position: absolute; left: 0; bottom: 0; height: 3px; width: calc(var(--p, 0) * 1%); background: var(--coral, #c45c4a); }",
    ".global-safe.pressing { transform: rotate(0deg) scale(1.03); }"
  ].join("\n");

  function active() {
    try {
      var s = App.Store.getSession();
      return !!(s && s.phase && s.phase !== "poster" && s.phase !== "done");
    } catch (e) { return false; }
  }

  function visible() {
    var scr = document.body.getAttribute("data-screen");
    if (!scr || HIDE[scr]) return false;
    return active();
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
    if (pressTimer) { clearTimeout(pressTimer); pressTimer = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (el) { el.classList.remove("pressing"); setProgress(0); }
  }

  function trigger() {
    if (fired) return;
    if (!pressing && !pressTimer) return;
    fired = true;
    stopPress();
    var s = null;
    try { s = App.Store.getSession(); } catch (e) {}
    if (!s) { App.UI.toast("现在没有翻开的手帐"); return; }
    try {
      var ret = App.Engine.safeWord(s);
      var next = ret && ret.state ? ret.state : ret;
      App.Store.saveSession(next);
      try { App.Audio.play("soft"); } catch (err) {}
      App.UI.haptic("heavy");
      App.UI.toast("本子合上了。已经贴上的都还在。");
      App.Router.go("finale", {}, { replace: true });
    } catch (e) {
      App.UI.toast("没能合上，可以先回到封面", { kind: "rose" });
    }
  }

  function startPress(e) {
    if (!visible() || pressing) return;
    if (e && e.preventDefault) e.preventDefault();
    fired = false;
    pressing = true;
    if (el) el.classList.add("pressing");
    var t0 = 0;
    try { t0 = performance.now(); } catch (err) { t0 = Date.now(); }
    function step() {
      if (!pressing) return;
      var now = 0;
      try { now = performance.now(); } catch (err) { now = Date.now(); }
      setProgress((now - t0) / HOLD);
      if (now - t0 >= HOLD) { trigger(); return; }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
    pressTimer = setTimeout(trigger, HOLD + 40);
  }

  function mount() {
    if (el) return;
    App.UI.injectStyle("safe", CSS);
    el = document.createElement("button");
    el.type = "button";
    el.className = "global-safe";
    el.setAttribute("data-test", "safe-close");
    el.setAttribute("aria-label", "合上本子：长按约 1.5 秒，温柔收尾");
    el.innerHTML = '<span class="gs-ring"></span><span>合上本子</span>';
    document.getElementById("app").appendChild(el);
    el.addEventListener("pointerdown", startPress);
    el.addEventListener("pointerup", stopPress);
    el.addEventListener("pointercancel", stopPress);
    el.addEventListener("pointerleave", stopPress);
    el.addEventListener("contextmenu", function (ev) { ev.preventDefault(); });
    App.Bus.on("route", sync);
    App.Bus.on("session", sync);
    sync();
  }

  App.Safe = { init: mount, sync: sync, trigger: trigger };
})();

/* ===== V3 core/safe.js：全局安全词（长按 1.5s 温柔收尾） ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var el = null;
  var pressTimer = null;
  var rafId = null;
  var pressing = false;
  var HOLD = 1500;

  var CSS = [
    ".global-safe { position: fixed; left: 16px; bottom: calc(16px + var(--safe-b)); z-index: 380;",
    "  display: inline-flex; align-items: center; gap: 8px; height: 44px; padding: 0 14px 0 10px;",
    "  border-radius: 999px; border: 1px solid rgba(255,95,109,.38);",
    "  background: rgba(24,10,22,.72); color: #ffc9cf; font-size: 12.5px; font-weight: 700; letter-spacing: .14em;",
    "  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);",
    "  opacity: 0; transform: translateY(14px); pointer-events: none; transition: opacity .3s var(--ease), transform .3s var(--ease);",
    "  user-select: none; -webkit-user-select: none; touch-action: none; }",
    ".global-safe.show { opacity: .92; transform: none; pointer-events: auto; }",
    "body[data-screen='play'] .global-safe, body[data-screen='setup'] .global-safe, body[data-screen='boot'] .global-safe,",
    "body[data-screen='finale'] .global-safe, body[data-screen='memory'] .global-safe, body[data-screen='settings'] .global-safe { display: none; }",
    ".global-safe .gs-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--danger); box-shadow: 0 0 12px rgba(255,95,109,.7); }",
    ".global-safe .gs-ring { position: absolute; inset: -3px; border-radius: 999px; pointer-events: none;",
    "  background: conic-gradient(rgba(255,95,109,.85) calc(var(--p, 0) * 1%), transparent 0);",
    "  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px));",
    "  mask: radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px)); opacity: 0; }",
    ".global-safe.pressing .gs-ring { opacity: 1; }",
    ".global-safe.pressing { color: #fff; border-color: rgba(255,95,109,.85); background: rgba(60,12,24,.9); }"
  ].join("\n");

  function active() {
    try {
      var s = App.Store.getSession();
      return !!(s && s.phase && s.phase !== "finale" && s.phase !== "done");
    } catch (e) { return false; }
  }

  function visible() {
    var scr = document.body.getAttribute("data-screen");
    if (!scr) return false;
    if (["play", "setup", "boot", "finale", "memory", "settings"].indexOf(scr) >= 0) return false;
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
    stopPress();
    var s = null;
    try { s = App.Store.getSession(); } catch (e) {}
    if (!s) { App.UI.toast("现在没有进行中的夜晚", { kind: "rose" }); return; }
    try {
      var ret = App.Engine.safeWord(s);
      var next = ret && ret.state ? ret.state : ret;
      App.Store.saveSession(next);
      App.Audio.play("soft");
      App.UI.haptic("heavy");
      App.UI.toast("🚩 已温柔收尾", { kind: "rose" });
      App.Router.go("finale", { state: next }, { replace: true });
    } catch (e) {
      App.UI.toast("安全词触发失败，请直接退出游戏", { kind: "rose" });
    }
  }

  function startPress(e) {
    if (!visible() || pressing) return;
    if (e && e.preventDefault) e.preventDefault();
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
    pressTimer = setTimeout(trigger, HOLD + 30);
    if (App.Audio && App.Audio.play) App.Audio.play("tick");
  }

  function mount() {
    if (el) return;
    App.UI.injectStyle("safe", CSS);
    el = document.createElement("button");
    el.type = "button";
    el.className = "global-safe";
    el.setAttribute("aria-label", "安全词：长按 1.5 秒，立刻温柔收尾");
    el.innerHTML = '<span class="gs-ring"></span><span class="gs-dot"></span><span class="gs-txt">停</span>';
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

/* ===== V6 core/safe.js：全局安全词「先收棋」=====
   · 所有屏幕常驻，右上角固定（z-index:380，高于弹层、低于 toast）
   · 长按 1.6s（进度环 data-test=safe-progress）→ App.Pause.open('safe')，不归档、不动 session
   · 短按不触发（只给一次「按住 1.6 秒」提示）
   · 触发后 session 仍在，首页仍能「继续今晚飞行棋」（spec AC-G2-2） */
(function () {
  var App = (window.App = window.App || {});
  var HOLD = 1600;
  var el = null;
  var labelEl = null;
  var pressing = false;
  var rafId = null;
  var startAt = 0;
  var labelTimer = null;

  function setProgress(p) {
    if (!el) return;
    el.style.setProperty("--p", String(Math.max(0, Math.min(100, p * 100))));
  }

  function stopPress() {
    pressing = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    if (el) { el.classList.remove("pressing"); setProgress(0); }
  }

  function showHint(text, ms) {
    if (!labelEl) return;
    labelEl.textContent = text;
    if (labelTimer) clearTimeout(labelTimer);
    labelTimer = setTimeout(function () { if (labelEl) labelEl.textContent = "先收棋"; }, ms || 1600);
  }

  function trigger() {
    stopPress();
    if (!el) return;
    if (App.Audio) App.Audio.play("safe");
    if (App.UI) App.UI.haptic("heavy");
    /* 暂停层本身就是「先停一下」的反馈；不再叠 toast，避免盖住暂停页标题（copy §5.1 的提示句在层顶部） */
    if (App.Pause && App.Pause.open) App.Pause.open("safe");
    else if (App.UI) App.UI.toast("暂停层还没载入");
  }

  function startPress(e) {
    if (pressing) return;
    if (e && e.button !== undefined && e.button !== 0) return;
    if (e && e.preventDefault) e.preventDefault();
    pressing = true;
    startAt = performance.now();
    if (el) {
      el.classList.add("pressing");
      try { if (el.setPointerCapture && e && e.pointerId !== undefined) el.setPointerCapture(e.pointerId); } catch (err) {}
    }
    if (App.Audio) App.Audio.play("tick");
    function step() {
      if (!pressing) return;
      var now = performance.now();
      var p = (now - startAt) / HOLD;
      setProgress(p);
      if (p >= 1) { trigger(); return; }
      rafId = requestAnimationFrame(step);
    }
    rafId = requestAnimationFrame(step);
  }

  function endPress() {
    var held = startAt ? performance.now() - startAt : 0;
    var was = pressing;
    stopPress();
    if (was && held > 120 && held < HOLD) showHint("按住 1.6 秒", 1800);
  }

  function mount() {
    if (el) return el;
    if (!document.getElementById("app")) return null;
    el = document.createElement("button");
    el.type = "button";
    el.className = "global-safe";
    el.setAttribute("data-test", "safety-word");
    el.setAttribute("aria-label", "安全词：按住约一秒半，先停一下");
    el.innerHTML = '<span class="gs-ring" data-test="safe-progress" aria-hidden="true"></span>' +
      '<span class="gs-dot" aria-hidden="true"></span><span data-label>先收棋</span>';
    labelEl = el.querySelector("[data-label]");
    (document.getElementById("app") || document.body).appendChild(el);
    el.addEventListener("pointerdown", startPress);
    el.addEventListener("pointerup", endPress);
    el.addEventListener("pointercancel", endPress);
    el.addEventListener("pointerleave", function () { if (pressing) endPress(); });
    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(); }
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) stopPress(); });
    sync();
    return el;
  }

  /* 所有屏幕常驻（含 boot）；保留接口供 router/session 事件调用 */
  function sync() {
    if (!el) mount();
    if (!el) return;
    el.classList.add("shown");
    el.style.display = "";
  }

  App.Safe = {
    init: mount,
    sync: sync,
    trigger: trigger,
    isPressing: function () { return pressing; },
    holdMs: HOLD,
    el: function () { return el; }
  };
  if (App.Bus) {
    App.Bus.on("route", sync);
    App.Bus.on("session", sync);
  }
})();

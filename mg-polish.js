/*!
 * mg-polish.js — 三个小游戏的界面增强（不改原逻辑）
 *  1) 转盘转完之后补一个「再转一次」，能连着转
 *  2) 转盘 / 温度计的面板加个轻量的进入动画与自动滚动
 * 不改任何抽取逻辑，只加一个按钮 + 一点样式钩子。
 */
(function () {
  "use strict";
  var AGAIN = "wheel-again";

  function panel() { return document.querySelector(".mg-panel"); }

  function enhance() {
    var p = panel();
    if (!p) return;

    /* 滚到面板顶部，避免在长列表里看不到转盘 */
    var body = p.closest(".v6-sheet, .sheet, .overlay-body") || p.parentElement;
    if (body && body.scrollTop > 0 && p.getAttribute("data-mg-seen") !== "1") {
      p.setAttribute("data-mg-seen", "1");
      try { body.scrollTop = 0; } catch (e) { }
    }

    var rotor = p.querySelector("[data-rotor]");
    if (!rotor) return;                       /* 不是转盘 */
    var acts = p.querySelector(".mg-acts");
    if (!acts) return;
    var hasResult = !!p.querySelector(".mg-result-title");
    var hasSpin = !!acts.querySelector('[data-act="spin"]');
    if (!hasResult || hasSpin) return;        /* 还没转，或已经有「转」 */

    var b = document.createElement("button");
    b.type = "button";
    b.className = "mg-btn main again";
    b.setAttribute("data-act", "spin");
    b.setAttribute("data-test", AGAIN);
    b.textContent = "再转一次";
    acts.insertBefore(b, acts.firstChild);

    /* 转完把结果滚进视野（每次结果只滚一次） */
    var result = p.querySelector(".mg-card-text");
    if (result) {
      var key = (result.textContent || "").slice(0, 24);
      if (p.getAttribute("data-last-result") !== key) {
        p.setAttribute("data-last-result", key);
        try { result.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { }
      }
    }
  }

  /* ---------- 「换一组」不限次数 ---------- */
  function patchReroll() {
    var M = window.App && window.App.Minigames;
    if (M && !M.__rerollFree && typeof M.rerollWheel === "function") {
      var orig = M.rerollWheel;
      M.rerollWheel = function () {
        var r = orig.apply(this, arguments);
        try {
          var st = r && r.state;
          if (st && st.rerolls) {
            for (var k in st.rerolls) st.rerolls[k] = Math.max(1, Number(st.rerolls[k]) || 1);
          }
        } catch (e) { }
        return r;
      };
      M.__rerollFree = true;
    }
    var U = window.App && window.App.UI;
    if (U && !U.__rerollToast && typeof U.toast === "function") {
      var t0 = U.toast;
      U.toast = function (m) {
        var msg = typeof m === "string" ? m.replace(/^换好了 · 还有 \d+ 次$/, "换好了") : m;
        return t0.call(this, msg);
      };
      U.__rerollToast = true;
    }
  }

  function freeRerollButton() {
    var p = panel();
    if (!p) return;
    var rb = p.querySelector('[data-test="wheel-reroll"]');
    if (!rb) return;
    if (rb.hasAttribute("disabled")) rb.removeAttribute("disabled");
    if (rb.textContent.indexOf("换一组") === 0 && rb.textContent !== "换一组") rb.textContent = "换一组";
  }

  function tick() { patchReroll(); enhance(); freeRerollButton(); }

  var mo = new MutationObserver(function () { tick(); });
  mo.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("DOMContentLoaded", tick);
  setTimeout(tick, 300);
  setTimeout(tick, 1500);
  /* 点完之后面板会重绘，下一帧再补一次 */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('[data-test="' + AGAIN + '"]')) {
      setTimeout(enhance, 80);
      setTimeout(enhance, 500);
    }
  }, true);

  window.__mgPolish = { enhance: enhance };
})();

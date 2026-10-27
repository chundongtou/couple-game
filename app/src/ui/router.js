/* ===== V3 ui/router.js：屏幕路由（栈 + 转场） ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  var M = App.Motion;
  var root = null;
  var stack = [];
  var current = null;

  function unmountCurrent() {
    if (!current) return;
    try {
      if (typeof current.cleanup === "function") current.cleanup();
      if (current.screen && typeof current.screen.unmount === "function") current.screen.unmount();
    } catch (e) { if (window.console) console.error("[router] unmount", e); }
  }

  function render(name, params, opts) {
    opts = opts || {};
    var screen = App.Screens && App.Screens[name];
    if (!screen || typeof screen.mount !== "function") {
      if (window.console) console.error("[router] 未注册屏幕: " + name);
      return;
    }
    var prev = current;
    var wrap = document.createElement("div");
    wrap.className = "screen";
    wrap.setAttribute("data-screen", name);
    root.appendChild(wrap);
    var cleanup = null;
    try {
      cleanup = screen.mount(wrap, params || {});
    } catch (e) {
      if (window.console) console.error("[router] mount " + name, e);
      App.UI.toast("页面加载失败：" + (e && e.message ? e.message : e), { kind: "rose" });
    }
    current = { name: name, params: params || {}, el: wrap, screen: screen, cleanup: cleanup };
    if (prev) {
      var prevEl = prev.el;
      prevEl.style.pointerEvents = "none";
      M.leave(prevEl, { dur: 200 }).then(function () { try { prevEl.remove(); } catch (e) {} });
    }
    // 离场动画结束后再卸载旧屏，避免它依赖的 DOM 被提前拆掉
    var toUnmount = prev;
    setTimeout(function () {
      if (toUnmount) {
        try {
          if (typeof toUnmount.cleanup === "function") toUnmount.cleanup();
          if (toUnmount.screen && typeof toUnmount.screen.unmount === "function") toUnmount.screen.unmount();
        } catch (e) {}
      }
    }, 210);
    M.enter(wrap, { dur: 340, y: opts.back ? -12 : 18 });
    document.body.setAttribute("data-screen", name);
    App.Bus.emit("route", { name: name, params: current.params, back: !!opts.back });
  }

  App.Router = {
    init: function (el) { root = el; },
    go: function (name, params, opts) {
      opts = opts || {};
      if (opts.replace && stack.length) stack[stack.length - 1] = { name: name, params: params || {} };
      else stack.push({ name: name, params: params || {} });
      render(name, params, opts);
    },
    reset: function (name, params) {
      stack = [{ name: name, params: params || {} }];
      render(name, params, {});
    },
    back: function () {
      if (stack.length <= 1) { App.Router.reset("boot"); return; }
      stack.pop();
      var p = stack[stack.length - 1];
      render(p.name, p.params, { back: true });
    },
    current: function () { return current ? current.name : null; },
    depth: function () { return stack.length; }
  };
})();

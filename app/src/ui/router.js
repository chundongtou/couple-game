/* ===== V6 ui/router.js：屏幕路由（栈 + 视觉 A 转场；reduced 兼容 ≤100ms） ===== */
(function () {
  var App = (window.App = window.App || {});
  var M = App.Motion;
  var root = null;
  var stack = [];
  var current = null;

  function unmount(rec, reason) {
    if (!rec) return;
    try {
      if (typeof rec.cleanup === "function") rec.cleanup();
      if (rec.screen && typeof rec.screen.unmount === "function") rec.screen.unmount();
    } catch (e) {
      if (window.console) console.error("[router] unmount " + (rec.name || "?") + " (" + (reason || "") + ")", e);
    }
  }

  function render(name, params, opts) {
    opts = opts || {};
    var screen = App.Screens && App.Screens[name];
    if (!screen || typeof screen.mount !== "function") {
      if (window.console) console.error("[router] 未注册屏幕: " + name);
      if (name !== "boot" && App.Screens && App.Screens.boot) {
        App.Router.reset("boot");
        App.UI.toast("这一页没加载出来，回门口再试一次", { kind: "rose" });
      }
      return;
    }
    /* 暂停层不卸载当前屏；路由要换屏时先收起它（静默） */
    try { if (App.Pause && App.Pause.isOpen && App.Pause.isOpen()) App.Pause.close(true); } catch (e) {}

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
      App.UI.toast("这一页没加载出来，回门口再试一次", { kind: "rose" });
    }
    current = { name: name, params: params || {}, el: wrap, screen: screen, cleanup: cleanup };

    if (prev) {
      prev.el.style.pointerEvents = "none";
      M.leave(prev.el, { dur: 180, y: opts.back ? 8 : -8 });
      setTimeout(function () { if (prev.el.parentNode) prev.el.parentNode.removeChild(prev.el); }, 240);
      setTimeout(function () { unmount(prev, "leave"); }, 220);
    }
    M.enter(wrap, { dur: opts.back ? 260 : 320, y: opts.back ? -12 : 16 });
    document.body.setAttribute("data-screen", name);
    if (App.Safe && App.Safe.sync) App.Safe.sync();
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
    depth: function () { return stack.length; },
    root: function () { return root; }
  };
})();

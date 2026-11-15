/* ===== V3 app.js：启动入口 ===== */
(function () {
  var App = (window.App = window.App || {});
  App.version = "4.0.0";

  function hashRoute() {
    var h = String(location.hash || "").replace(/^#\/?/, "");
    var m = /^door(?:\/(thermo|truth|dare|stroll))?$/.exec(h);
    if (!m) return null;
    return { name: "door", params: { game: m[1] || null } };
  }

  function boot() {
    App.UI.syncSettings();
    App.Router.init(document.getElementById("screen"));

    // 路由联动
    App.Bus.on("route", function (e) {
      document.body.setAttribute("data-screen", e.name);
      document.getElementById("screen").scrollTop = 0;
      var s = App.Store.getSettings();
      App.Audio.setEnabled(s.sound !== false);
    });
    App.Bus.on("settings", function (s) {
      App.Audio.setEnabled(s.sound !== false);
      App.Motion.syncBodyClass();
    });
    App.Bus.on("session", function () {
      App.Motion.syncBodyClass();
    });

    // 首次交互解锁音频
    var unlocked = false;
    function unlock() {
      if (unlocked) return;
      unlocked = true;
      App.Audio.unlock();
      document.removeEventListener("pointerdown", unlock, true);
    }
    document.addEventListener("pointerdown", unlock, true);

    // 全局错误：不静默
    window.addEventListener("error", function (e) {
      if (window.console) console.error("[app]", e.message);
    });
    window.addEventListener("unhandledrejection", function (e) {
      if (window.console) console.warn("[app] promise", e.reason);
    });

    // 全局安全词（长按 1.5s 温柔收尾；play 屏由 play.js 自带的安全词代替）
    try { if (App.Safe && App.Safe.init) App.Safe.init(); } catch (e) {}

    // PWA（可选模块）
    try { if (App.PWA && App.PWA.register) App.PWA.register(); } catch (e) {}

    try { App.Store.getSession(); } catch (e) {}
    var note = App.Store.takeLegacyNote && App.Store.takeLegacyNote();
    var route = hashRoute();
    if (route) App.Router.reset(route.name, route.params);
    else App.Router.reset("boot");
    if (note) App.UI.toast("上一趟夜航已收进以前的夜");
    try {
      var live = App.Store.getSession();
      if (App.Night && live) App.Night.paint(live);
    } catch (e2) {}
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

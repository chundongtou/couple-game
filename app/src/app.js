/* ===== V3 app.js：启动入口 ===== */
(function () {
  var App = (window.App = window.App || {});
  App.version = "3.0.0";

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

    App.Router.reset("boot");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

/* ===== 今晚飞行棋 V6.1 · 启动装配 ===== */
(function () {
  var App = (window.App = window.App || {});
  App.version = "9.2.0";

  function hashRoute() {
    var h = String(location.hash || "").replace(/^#\/?/, "");
    var door = /^door(?:\/(thermo|truth|dare|stroll|flight))?$/.exec(h);
    if (door) {
      var g = door[1] || "";
      if (g === "stroll" || g === "flight") return { name: "boot", params: { resumeFlight: true } };
      if (!g) return { name: "minigame", params: { hall: true } };
      return { name: "minigame", params: { game: g } };
    }
    return null;
  }

  function boot() {
    var screenHost = document.getElementById("screen");
    if (!screenHost) {
      if (window.console) console.error("[app] #screen 缺失");
      return;
    }
    App.UI.syncSettings();
    try { App.UI.mountBackdrop(); } catch (e) { if (window.console) console.error("[app] backdrop", e); }
    App.Router.init(screenHost);

    App.Bus.on("route", function (e) {
      document.body.setAttribute("data-screen", e.name);
      screenHost.scrollTop = 0;
      var s = App.Store.getSettings();
      App.Audio.setEnabled(s.sound !== false);
      if (App.BoardView && App.BoardView.setSound) App.BoardView.setSound(s.sound !== false);
      if (App.Safe && App.Safe.sync) App.Safe.sync();
    });
    App.Bus.on("settings", function (s) {
      App.Audio.setEnabled(s.sound !== false);
      App.Motion.syncBodyClass();
      if (App.BoardView && App.BoardView.setReduced) App.BoardView.setReduced(!!s.reduced);
      if (App.BoardView && App.BoardView.setSound) App.BoardView.setSound(s.sound !== false);
    });

    /* 首次用户手势后解锁 WebAudio（iOS/Chrome 都需要） */
    var unlocked = false;
    function unlock() {
      if (unlocked) return;
      unlocked = true;
      App.Audio.unlock();
      document.removeEventListener("pointerdown", unlock, true);
    }
    document.addEventListener("pointerdown", unlock, true);

    window.addEventListener("error", function (e) {
      if (window.console) console.error("[app]", e.message);
    });
    window.addEventListener("unhandledrejection", function (e) {
      if (window.console) console.error("[app] unhandledrejection", e.reason);
    });

    try { if (App.Safe && App.Safe.init) App.Safe.init(); } catch (e) { if (window.console) console.error("[app] safe", e); }
    try { if (App.PWA && App.PWA.register) App.PWA.register(); } catch (e) {}

    try { App.Store.getSession(); } catch (e) {}
    /* V9：3D chunk 在门厅先预热，进主桌时不用等 650KB 下载 */
    setTimeout(function () {
      try {
        if (window.__BOARD3D_URL && window.fetch) {
          fetch(window.__BOARD3D_URL, { cache: "force-cache" })["catch"](function () {});
        }
      } catch (e) {}
    }, 900);
    var note = App.Store.takeLegacyNote && App.Store.takeLegacyNote();
    var route = hashRoute();
    if (route) App.Router.reset(route.name, route.params);
    else App.Router.reset("boot");
    if (note) App.UI.toast("以前的一局已收进以前的夜");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

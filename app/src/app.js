/* ===== 今晚飞行棋 · 启动 ===== */
(function () {
  var App = (window.App = window.App || {});
  App.version = "5.0.0";

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
    App.UI.syncSettings();
    App.Router.init(document.getElementById("screen"));
    App.Bus.on("route", function (e) {
      document.body.setAttribute("data-screen", e.name);
      document.getElementById("screen").scrollTop = 0;
      var s = App.Store.getSettings();
      App.Audio.setEnabled(s.sound !== false);
      if (App.BoardView && App.BoardView.setSound) App.BoardView.setSound(s.sound !== false);
    });
    App.Bus.on("settings", function (s) {
      App.Audio.setEnabled(s.sound !== false);
      App.Motion.syncBodyClass();
      if (App.BoardView && App.BoardView.setReduced) App.BoardView.setReduced(!!s.reduced);
    });

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
    try { if (App.Safe && App.Safe.init) App.Safe.init(); } catch (e) {}
    try { if (App.PWA && App.PWA.register) App.PWA.register(); } catch (e) {}

    try { App.Store.getSession(); } catch (e) {}
    var note = App.Store.takeLegacyNote && App.Store.takeLegacyNote();
    var route = hashRoute();
    if (route) App.Router.reset(route.name, route.params);
    else App.Router.reset("boot");
    if (note) App.UI.toast("以前的一局已收进以前的夜");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

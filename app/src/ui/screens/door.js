/* ===== 游戏门：四款可以单独玩，也可以带回今晚 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var GAMES = [
    { id: "thermo", name: "温度", where: "阳台", text: "各自猜对方会把热放在哪一格。" },
    { id: "truth", name: "真话", where: "浴室", text: "转盘停下。自己说，或交到对方手里。" },
    { id: "dare", name: "动作", where: "厨房", text: "转到的事跟着今晚的热度走。" },
    { id: "stroll", name: "走一走", where: "整间公寓", text: "一枚「我们」，走到哪间做哪间的事。" }
  ];

  function menu(root) {
    root.innerHTML =
      '<div class="page">' +
        '<div class="topbar"><button class="back" data-act="back" aria-label="返回">←</button><div class="tb-title">游戏门</div><div class="tb-right"></div></div>' +
        '<p class="kicker">单独玩，或收进今晚</p>' +
        '<h1 class="title-lg mt-8">门后的四样</h1>' +
        '<div class="door-grid mt-16">' +
          GAMES.map(function (g) {
            return '<button class="door-card" data-test="game-' + g.id + '" data-game="' + g.id + '"><span class="tiny">' + g.where + '</span><b>' + g.name + '</b><span>' + g.text + '</span></button>';
          }).join("") +
        "</div></div>";
    U.delegate(root, "[data-act=back]", "click", function () { App.Router.back(); });
    U.delegate(root, "[data-game]", "click", function (e, el) {
      App.Router.go("door", { game: el.getAttribute("data-game") });
    });
  }

  function startGame(game) {
    var settings = App.Store.getSettings();
    var cur = App.Store.getStandalone();
    if (cur && cur.game === game && cur.phase !== "done" && ((cur.log && cur.log.length) || (cur.wheel && cur.wheel.spun) || (cur.thermo && (cur.thermo.a || cur.thermo.revealed)) || (cur.stroll && cur.stroll.turns))) {
      return cur;
    }
    var s = App.Engine.newStandalone(game, settings, Date.now() % 1000000);
    App.Store.saveStandalone(s);
    return s;
  }

  App.Screens.door = {
    mount: function (root, params) {
      params = params || {};
      var game = params.game || null;
      if (!game) { menu(root); return; }
      startGame(game);
      return App.Kit.open(root, {
        night: false,
        get: function () { return App.Store.getStandalone(); },
        save: function (s) { App.Store.saveStandalone(s); if (s) App.Night.paint(s); },
        onLeave: function () { App.Router.back(); },
        onPaste: function (pack) {
          if (!pack) return;
          var night = App.Store.getSession();
          if (night && night.phase !== "done" && night.mode !== "standalone") {
            var ret = App.Engine.pasteStandalone(night, pack);
            App.Store.saveSession(ret.state);
            App.Night.paint(ret.state);
            App.UI.toast(ret.events[0] && ret.events[0].already ? "这场已经在今晚里了" : "带回今晚了");
            App.Router.reset("plan");
            return;
          }
          App.Store.setPending(pack);
          App.UI.toast("先在门厅把名字和尺度定下来");
          App.Router.reset("foyer");
        }
      });
    }
  };
})();

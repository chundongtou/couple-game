/* ===== 游戏厅：四款都可以单独打开，结果能贴进今晚的手帐 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  var GAMES = ["thermo", "truth", "dare", "map"];

  function mount(root) {
    var meta = App.Balance.GAMES;
    var cards = GAMES.map(function (id) {
      var g = meta[id];
      return '<button class="stk" style="--tilt:0deg" data-game="' + id + '" data-test="arcade-game-' + id + '">' +
        '<span class="stk-kicker">手帐里的一格</span>' +
        '<span class="stk-text">' + U.escape(g.name) + "</span>" +
        '<span class="small muted">' + U.escape(g.hall) + "</span></button>";
    }).join("");
    root.innerHTML =
      '<div class="page book">' +
      '<div class="book-top"><button class="icon-btn" data-act="back" aria-label="返回">←</button><div class="book-kicker">游戏厅</div></div>' +
      '<h1 class="spread-name">夹页</h1>' +
      '<p class="spread-sub">四款都可以单独玩。玩完仍可以贴进今晚的手帐；主线里，它们也会作为某一页的特殊格出现。</p>' +
      '<div class="stk-list mt-8">' + cards + "</div></div>";
    root.addEventListener("click", function (e) {
      var back = e.target.closest && e.target.closest('[data-act="back"]');
      if (back) { App.Router.back(); return; }
      var btn = e.target.closest && e.target.closest("[data-game]");
      if (!btn) return;
      App.Router.go("game", { standalone: true, kind: btn.getAttribute("data-game") });
    });
  }

  App.Screens = App.Screens || {};
  App.Screens.arcade = { mount: mount, unmount: function () {} };
})();

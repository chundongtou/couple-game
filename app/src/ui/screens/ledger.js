/* ===== 今晚棋谱 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var KIND = {
    "cell-truth": "真心话", "cell-dare": "大冒险", "cell-touch": "靠近",
    capture: "击落", "stack-duo": "叠机", "home-entry": "进终点", ending: "收尾",
    "minigame-thermo": "温度计", "minigame-wheel": "转盘"
  };
  var SCALE = { gentle: "温柔", warm: "暧昧", hot: "热烈", open: "不设限" };
  var COLOR = { red: "红", yellow: "黄", blue: "蓝", green: "绿" };

  function find(id) {
    var list = App.Store.getHistory();
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
    return list[0] || null;
  }

  App.Screens = App.Screens || {};
  App.Screens.ledger = {
    mount: function (root, params) {
      params = params || {};
      var entry = find(params.id);
      var ledger = entry && entry.ledger;
      var ending = "这页记下了今晚。";
      if (entry && entry.safe) ending = "安全词收棋。做过的都留在这里。";
      else if (ledger && ledger.ending === "win-a") ending = (ledger.names.a || "") + " 先把飞机送回家。";
      else if (ledger && ledger.ending === "win-b") ending = (ledger.names.b || "") + " 先把飞机送回家。";
      else if (entry && entry.note) ending = entry.note;
      var prompts = (ledger && ledger.prompts) || [];
      var lines = prompts.map(function (p) {
        return '<li class="glass pad-16" style="margin-top:8px"><div class="small dim">' +
          U.escape(KIND[p.kind] || p.kind || "") + " · " + (p.outcome === "skipped" ? "放过" : "做了") +
          "</div><div>" + U.escape(p.text || "（这一笔没有句子）") + "</div></li>";
      }).join("");
      var moves = "";
      if (ledger && ledger.moves && ledger.moves.length) {
        moves = '<div class="small dim mt-16">走子</div><ul>' + ledger.moves.map(function (m) {
          return "<li class='tiny dim'>" + U.escape((m.kind || "") + " " + (m.die || "") + " " + (m.from || "") + " " + (m.to || "")) + "</li>";
        }).join("") + "</ul>";
      }
      root.innerHTML =
        '<div class="page" data-test="ledger">' +
          '<div class="topbar"><button class="back" data-go="boot">←</button><div class="tb-title">今晚棋谱</div></div>' +
          '<h1 class="title-xl mt-12">' + U.escape(ending) + "</h1>" +
          (ledger
            ? '<p class="muted mt-12">' + U.escape(ledger.date || "") + " · " +
              U.escape((ledger.names && ledger.names.a) || "") + " " + COLOR[(ledger.colors && ledger.colors.a) || ""] +
              " / " + U.escape((ledger.names && ledger.names.b) || "") + " " + COLOR[(ledger.colors && ledger.colors.b) || ""] +
              "<br>" + (SCALE[ledger.scale] || "") + " · " + (ledger.planeCount === 2 ? "快局两架" : "每人四架") +
              (ledger.boundaries && ledger.boundaries.length ? "<br>今晚不做的：" + U.escape(ledger.boundaries.join("、")) : "") +
              "</p>"
            : '<p class="muted mt-12">' + U.escape((entry && entry.title) || "以前的一夜") + "</p>") +
          '<ul>' + (lines || '<li class="small dim mt-16">这一页没有题目。</li>') + "</ul>" +
          moves +
          '<button class="btn primary wide mt-16" data-go="boot">回到开场</button>' +
        "</div>";
      U.delegate(root, "[data-go]", "click", function (e, el) { App.Router.reset(el.getAttribute("data-go")); });
    }
  };
})();

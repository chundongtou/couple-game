/* ===== 关灯之后的一页 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var OUT = { done: "做了", hold: "停在这里", pass: "先放下", deeper: "又往下问", reveal: "对过温度" };
  var ROOM = {};

  App.Screens.close = {
    mount: function (root) {
      App.Balance.ROOMS.forEach(function (id) { ROOM[id] = App.Balance.ROOM_META[id].name; });
      var state = App.Store.getSession();
      if (!state || !state.result) { App.Router.reset("boot"); return; }
      if (!state.archived) {
        App.Store.addHistory(App.Store.makeHistoryEntry(state));
        state.archived = true;
        App.Store.saveSession(state);
      }
      var mem = state.result;
      var rooms = (mem.rooms || []).map(function (r) {
        return '<div class="memory-room"><span>' + U.escape(r.name) + '</span><span class="dim">亮过' + (r.visits ? " · " + r.visits + " 次" : "") + "</span></div>";
      }).join("") || '<p class="dim">还没有房间被点亮。这一页仍然算数。</p>';
      var moments = (mem.moments || []).slice(-12).map(function (m) {
        return '<div class="moment"><b>' + U.escape(ROOM[m.room] || "公寓") + " · " + U.escape(OUT[m.outcome] || "记下了") +
          (m.via === "door" ? " · 游戏门" : "") + "</b><p>" + U.escape(m.text) + "</p></div>";
      }).join("");
      root.innerHTML =
        '<div class="page">' +
          '<p class="kicker">' + U.escape(mem.clock || "") + " · " + U.escape(mem.intensityName || "") + "</p>" +
          '<h1 class="title-xl mt-12" data-test="memory-title">' + U.escape(mem.title) + "</h1>" +
          '<p class="muted mt-12" data-test="memory-line">' + U.escape(mem.line) + "</p>" +
          '<div class="glass pad-16 mt-16"><div class="tiny dim">温度 ' + (mem.heat || 0) + " · " + U.escape(App.Balance.stageLabel(mem.heat || 0)) + "</div>" +
            '<div class="mt-8">' + rooms + "</div></div>" +
          (moments ? '<div class="mt-16">' + moments + "</div>" : "") +
          '<div class="actions mt-20">' +
            '<button class="btn primary wide" data-test="again" data-act="again">再开一夜</button>' +
            '<button class="btn soft wide" data-test="to-nights" data-act="nights">以前的夜</button>' +
            '<button class="btn ghost wide" data-act="boot">回到门口</button>' +
          "</div></div>";
      U.delegate(root, "[data-act]", "click", function (e, el) {
        var act = el.getAttribute("data-act");
        if (act === "again") {
          App.Store.clearSession();
          App.Router.reset("foyer");
        } else if (act === "nights") App.Router.go("nights");
        else App.Router.reset("boot");
      });
    }
  };
})();

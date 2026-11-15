/* ===== 平面图 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var ROOMS = [
    { id: "balcony", cls: "room-balcony", illu: '<i class="rail"></i><i class="rainbit"></i><i class="bulb"></i>' },
    { id: "bedroom", cls: "room-bed", illu: '<i class="bedshape"></i><i class="bulb"></i>' },
    { id: "bathroom", cls: "room-bath", illu: '<i class="tub"></i><i class="bulb"></i>' },
    { id: "living", cls: "room-living", illu: '<i class="sofa"></i><i class="glasscup"></i><i class="bulb"></i>' },
    { id: "kitchen", cls: "room-kitchen", illu: '<i class="counter"></i><i class="bulb"></i>' }
  ];

  function meta(id) { return App.Balance.ROOM_META[id]; }

  App.Screens.plan = {
    mount: function (root) {
      var state = App.Store.getSession();
      if (!state || state.phase === "done") { App.Router.reset("boot"); return; }
      if (state.phase !== "plan") {
        var back = App.Engine.leaveRoom(state);
        App.Store.saveSession(back.state);
        state = back.state;
      }
      App.Night.paint(state);
      function paint() {
        state = App.Store.getSession();
        if (!state) { App.Router.reset("boot"); return; }
        var cap = App.Engine.capOf(state);
        var name = (App.Balance.INTENSITY[cap] && App.Balance.INTENSITY[cap].name) || "";
        var at = state.at || "foyer";
        root.innerHTML =
          '<div class="page">' +
            '<div class="night-bar">' +
              '<div><div class="kicker">' + U.escape(state.names.a) + " · " + U.escape(state.names.b) + "</div>" +
              '<div class="clock" data-test="clock">' + U.escape(App.Engine.clockLabel(state)) + " · " + U.escape(name) + "</div></div>" +
              '<div class="wine" aria-hidden="true"><i style="height:' + Math.max(8, state.heat) + '%"></i></div>' +
            '</div>' +
            '<div class="meter" data-test="heat" data-heat="' + state.heat + '"><div class="meter-track"><div class="meter-fill" style="width:' + state.heat + '%"></div></div>' +
            '<div class="tiny dim mt-8">' + U.escape(App.Balance.stageLabel(state.heat)) + " · " + state.heat + "</div></div>" +
            '<div class="apt mt-12" data-test="floor">' +
              ROOMS.map(function (r) {
                var m = meta(r.id);
                var lit = state.lit && state.lit[r.id];
                return '<button class="room ' + r.cls + (lit ? " lit" : "") + '" data-room="' + r.id + '" data-test="room-' + r.id + '" aria-label="走进' + m.name + '">' +
                  '<span class="illu">' + r.illu + "</span>" +
                  '<span class="room-name">' + m.name + "</span>" +
                  '<span class="room-hint">' + m.hint + (lit ? " · 亮着" : "") + "</span>" +
                  (at === r.id ? '<span class="we" data-test="token">我们</span>' : "") +
                "</button>";
              }).join("") +
              '<div class="foyer-cell"><span><b style="letter-spacing:.16em">门厅</b><span class="room-hint">从这里开始</span></span>' +
              (at === "foyer" || !at ? '<span class="we" data-test="token">我们</span>' : "") +
              "</div></div>" +
            '<div class="actions">' +
              '<button class="btn soft wide" data-test="stroll" data-act="stroll">在公寓里走一走</button>' +
              '<div class="choice-row">' +
                '<button class="btn soft" data-test="to-door" data-act="door">游戏门</button>' +
                '<button class="btn soft" data-test="close-night" data-act="close">关灯</button>' +
              "</div></div>" +
          "</div>";
        U.delegate(root, "[data-room]", "click", function (e, el) {
          var id = el.getAttribute("data-room");
          var ret = App.Engine.enterRoom(App.Store.getSession(), id);
          App.Store.saveSession(ret.state);
          App.Night.paint(ret.state);
          if (App.Audio) App.Audio.play("tick");
          App.Router.go("room");
        });
        U.delegate(root, "[data-act]", "click", function (e, el) {
          var act = el.getAttribute("data-act");
          if (act === "door") App.Router.go("door");
          else if (act === "stroll") {
            var ret = App.Engine.strollStart(App.Store.getSession());
            App.Store.saveSession(ret.state);
            App.Router.go("room");
          } else if (act === "close") {
            App.UI.confirm({ title: "把灯关掉", text: "已经走过的房间和做过的事会留在这一页上。", ok: "关灯", cancel: "再待一会儿" }).then(function (yes) {
              if (!yes) return;
              var fin = App.Engine.closeNight(App.Store.getSession());
              App.Store.addHistory(App.Store.makeHistoryEntry(fin.state));
              fin.state.archived = true;
              App.Store.saveSession(fin.state);
              App.Night.paint(null);
              App.Router.reset("close");
            });
          }
        });
      }
      paint();
    }
  };
})();

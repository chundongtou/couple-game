/* ===== 走进当前这间房 ===== */
(function () {
  var App = window.App;
  App.Screens.room = {
    mount: function (root) {
      var state = App.Store.getSession();
      if (!state || state.phase === "done") { App.Router.reset("boot"); return; }
      return App.Kit.open(root, {
        night: true,
        get: function () { return App.Store.getSession(); },
        save: function (s) { App.Store.saveSession(s); App.Night.paint(s); },
        onLeave: function () {
          var s = App.Store.getSession();
          if (s && s.phase !== "done" && s.phase !== "plan") {
            var left = App.Engine.leaveRoom(s);
            App.Store.saveSession(left.state);
            App.Night.paint(left.state);
          }
          App.Router.back();
        }
      });
    }
  };
})();

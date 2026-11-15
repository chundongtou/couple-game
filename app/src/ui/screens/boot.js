/* ===== 门口 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.Screens = App.Screens || {};
  App.Screens.boot = {
    mount: function (root) {
      var has = App.Store.hasSession();
      var note = App.Store.takeLegacyNote();
      root.innerHTML =
        '<div class="page">' +
          '<div class="kicker">NIGHT APARTMENT</div>' +
          '<div class="mt-20">' +
            '<h1 class="title-xl">今晚<br>在这间公寓</h1>' +
            '<p class="muted mt-12" style="max-width:18em">两个人，一部手机，一枚「我们」。灯开着的房间，可以再走进去。</p>' +
          '</div>' +
          '<div class="grow"></div>' +
          '<div class="actions">' +
            (has
              ? '<button class="btn primary wide" data-test="continue-night" data-go="plan">回到这间公寓</button>' +
                '<button class="btn soft wide" data-test="new-night" data-go="fresh">另开一夜</button>'
              : '<button class="btn primary wide" data-test="enter-night" data-go="foyer">推门进去</button>') +
            '<div class="choice-row">' +
              '<button class="btn soft" data-test="open-nights" data-go="nights">以前的夜</button>' +
              '<button class="btn soft" data-test="open-door" data-go="door">游戏门</button>' +
            '</div>' +
            '<button class="btn ghost wide" data-test="open-settings" data-go="settings">设置</button>' +
          '</div>' +
          '<p class="tiny dim center mt-12">长按「先回去关灯」可以随时结束。做过的都留着。</p>' +
        '</div>';
      if (note) App.UI.toast("上一趟夜航已收进以前的夜");
      function go(name) {
        if (name === "plan") {
          var s = App.Store.getSession();
          App.Night.paint(s);
          App.Router.reset("plan");
          return;
        }
        if (name === "fresh") {
          var cur = App.Store.getSession();
          if (cur && cur.phase !== "done") {
            var fin = App.Engine.closeNight(cur);
            fin.state.archived = true;
            App.Store.addHistory(App.Store.makeHistoryEntry(fin.state));
            App.Store.clearSession();
          }
          App.Router.go("foyer");
          return;
        }
        if (name === "foyer") App.Router.go("foyer");
        else App.Router.go(name);
      }
      U.delegate(root, "[data-go]", "click", function (e, el) { go(el.getAttribute("data-go")); });
    }
  };
})();

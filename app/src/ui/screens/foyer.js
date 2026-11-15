/* ===== 门厅：大衣名牌、壁灯、桌上的纸条 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var BOUNDS = [
    { id: "束缚", name: "束缚" },
    { id: "露出", name: "露出" },
    { id: "道具", name: "道具" },
    { id: "喝酒", name: "喝酒" },
    { id: "蒙眼", name: "蒙眼" },
    { id: "角色", name: "角色" }
  ];

  function line(cap) {
    var I = (App.CONTENT && App.CONTENT.intensities && App.CONTENT.intensities[cap]) || {};
    return I.line || "";
  }

  App.Screens.foyer = {
    mount: function (root) {
      var settings = App.Store.getSettings();
      var cap = settings.maxStar || 3;
      var picked = {};
      (settings.blacklist || []).forEach(function (b) { picked[b] = true; });
      var custom = (settings.blacklist || []).filter(function (b) {
        return !BOUNDS.some(function (x) { return x.id === b; });
      }).join(" ");

      function paint() {
        root.innerHTML =
          '<div class="page">' +
            '<div class="topbar"><button class="back" data-go="boot" aria-label="回到门口">←</button><div class="tb-title">门厅</div><div class="tb-right"></div></div>' +
            '<p class="kicker">把外套挂上</p>' +
            '<h1 class="title-lg mt-8">今晚怎么称呼</h1>' +
            '<div class="coat-rail">' +
              '<div class="coat"><label for="name-a">左边这件</label><input id="name-a" data-test="name-a" maxlength="12" value="' + U.escape(settings.names.a) + '"></div>' +
              '<div class="coat"><label for="name-b">右边这件</label><input id="name-b" data-test="name-b" maxlength="12" value="' + U.escape(settings.names.b) + '"></div>' +
            '</div>' +
            '<p class="kicker mt-20">壁灯拨到哪一档</p>' +
            '<div class="lamp-row" data-test="intensity">' +
              [1, 2, 3, 4].map(function (n) {
                var name = ["", "温柔", "暧昧", "热烈", "不设限"][n];
                return '<button type="button" class="lamp-btn' + (cap === n ? " on" : "") + '" data-cap="' + n + '" data-test="intensity-' + n + '" aria-pressed="' + (cap === n) + '"><b>' + name + '</b><span>' + U.escape(line(n)) + '</span></button>';
              }).join("") +
            '</div>' +
            '<div class="table-note">' +
              '<h3>今晚不做的</h3>' +
              '<p>写在这张纸条上的，整晚都不会出现。划掉就作数。</p>' +
              BOUNDS.map(function (b) {
                var on = !!picked[b.id];
                return '<button type="button" class="bound-line' + (on ? " on" : "") + '" data-bound="' + b.id + '" data-test="boundary-' + b.id + '" aria-pressed="' + on + '"><i>' + (on ? "✕" : "·") + '</i>' + b.name + '</button>';
              }).join("") +
              '<input data-test="boundary-custom" maxlength="40" placeholder="再写一条，比如某个词" value="' + U.escape(custom) + '">' +
            '</div>' +
            '<button class="btn primary wide mt-20" data-test="start-night">把灯拧开</button>' +
          '</div>';
      }

      function snapshot() {
        var a = root.querySelector("#name-a");
        var b = root.querySelector("#name-b");
        var c = root.querySelector("[data-test=boundary-custom]");
        if (a) settings.names.a = a.value;
        if (b) settings.names.b = b.value;
        if (c) custom = c.value;
      }

      function begin() {
        var a = (root.querySelector("#name-a").value || "").trim() || "他";
        var b = (root.querySelector("#name-b").value || "").trim() || "她";
        var extra = (root.querySelector("[data-test=boundary-custom]").value || "").trim();
        var blacklist = BOUNDS.filter(function (b) { return picked[b.id]; }).map(function (b) { return b.id; });
        if (extra) blacklist.push(extra);
        var prev = App.Store.getSettings();
        var settings = App.Store.saveSettings({
          maxStar: cap,
          blacklist: blacklist,
          names: { a: a, b: b },
          sound: prev.sound,
          haptics: prev.haptics,
          reduced: prev.reduced,
          gentleOnly: prev.gentleOnly
        });
        var session = App.Engine.newSession(settings, { a: a, b: b }, Date.now() % 1000000);
        var pending = App.Store.takePending();
        if (pending && pending.id) {
          var pasted = App.Engine.pasteStandalone(session, pending);
          if (pasted.state) session = pasted.state;
          App.UI.toast("游戏门的结果已经收进今晚");
        }
        App.Store.saveSession(session);
        App.Night.paint(session);
        if (App.Audio) App.Audio.play("soft");
        App.Router.reset("plan");
      }

      paint();
      U.delegate(root, "[data-cap]", "click", function (e, el) {
        snapshot();
        cap = parseInt(el.getAttribute("data-cap"), 10);
        paint();
      });
      U.delegate(root, "[data-bound]", "click", function (e, el) {
        snapshot();
        var id = el.getAttribute("data-bound");
        picked[id] = !picked[id];
        paint();
      });
      U.delegate(root, "[data-go]", "click", function () { App.Router.reset("boot"); });
      U.delegate(root, "[data-test=start-night]", "click", function () { begin(); });
    }
  };
})();

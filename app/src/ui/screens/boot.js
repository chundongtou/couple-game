/* ===== 开场 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var COLORS = [
    { id: "red", name: "红" },
    { id: "yellow", name: "黄" },
    { id: "blue", name: "蓝" },
    { id: "green", name: "绿" }
  ];
  var SCALES = [
    { id: "gentle", name: "温柔" },
    { id: "warm", name: "暧昧" },
    { id: "hot", name: "热烈" },
    { id: "open", name: "不设限" }
  ];
  var CHIPS = ["束缚", "露出", "道具", "蒙眼", "喝酒", "角色"];

  App.Screens = App.Screens || {};
  App.Screens.boot = {
    mount: function (root, params) {
      params = params || {};
      var settings = App.Store.getSettings();
      var has = App.Store.hasSession();
      if (params.resumeFlight) {
        if (has) { App.Router.reset("table"); return; }
      }
      var picked = {
        a: (settings.colors && settings.colors.a) || "red",
        b: (settings.colors && settings.colors.b) || "yellow"
      };
      if (picked.a === picked.b) picked.b = "yellow";
      var scale = settings.scale || settings.suggestScale || "warm";
      var boundaries = (settings.blacklist || []).slice();
      var planes = settings.lastPlaneCount === 2 ? 2 : 4;
      var note = App.Store.takeLegacyNote();

      function chip(name) {
        var on = boundaries.indexOf(name) >= 0;
        return '<button type="button" class="btn sm' + (on ? " primary" : " soft") + '" data-bound="' + name + '">' + name + "</button>";
      }
      function colorBtn(pid, c) {
        var on = picked[pid] === c.id;
        return '<button type="button" class="btn sm' + (on ? " primary" : " soft") + '" data-color="' + pid + ":" + c.id + '">' + c.name + "</button>";
      }

      root.innerHTML =
        '<div class="page">' +
          '<div class="kicker">TONIGHT</div>' +
          '<h1 class="title-xl mt-12">今晚<br>飞行棋</h1>' +
          '<p class="muted mt-12">两个人，一部手机，一盘桌上的棋。</p>' +
          (has ? '<button class="btn primary wide mt-16" data-go="table" data-test="continue-flight">继续今晚飞行棋</button>' : "") +
          '<div class="glass pad-16 mt-16">' +
            '<label class="small dim">名字</label>' +
            '<div class="choice-row mt-8">' +
              '<input class="field" data-name="a" data-test="name-a" value="' + U.escape(settings.names.a || "他") + '" maxlength="12" />' +
              '<input class="field" data-name="b" data-test="name-b" value="' + U.escape(settings.names.b || "她") + '" maxlength="12" />' +
            "</div>" +
            '<div class="small dim mt-12">第一位的飞机</div>' +
            '<div class="choice-row mt-8" data-test="colors-a">' + COLORS.map(function (c) { return colorBtn("a", c); }).join("") + "</div>" +
            '<div class="small dim mt-12">第二位的飞机</div>' +
            '<div class="choice-row mt-8" data-test="colors-b">' + COLORS.map(function (c) { return colorBtn("b", c); }).join("") + "</div>" +
            '<div class="small dim mt-12">尺度</div>' +
            '<div class="choice-row mt-8" data-test="scales">' + SCALES.map(function (s) {
              return '<button type="button" class="btn sm' + (scale === s.id ? " primary" : " soft") + '" data-scale="' + s.id + '">' + s.name + "</button>";
            }).join("") + "</div>" +
            '<div class="small dim mt-12">今晚不做的</div>' +
            '<div class="choice-row mt-8" data-test="bounds">' + CHIPS.map(chip).join("") + "</div>" +
            '<input class="field mt-8" data-test="bound-custom" placeholder="再写一条，回车加上" />' +
            '<div class="small dim mt-12">飞机</div>' +
            '<div class="choice-row mt-8">' +
              '<button type="button" class="btn sm' + (planes === 4 ? " primary" : " soft") + '" data-planes="4" data-test="planes-4">每人四架</button>' +
              '<button type="button" class="btn sm' + (planes === 2 ? " primary" : " soft") + '" data-planes="2" data-test="planes-2">每人两架 · 快局</button>' +
            "</div>" +
          "</div>" +
          '<div class="actions mt-16">' +
            '<button class="btn primary wide" data-go="start" data-test="start-flight">摆上棋盘</button>' +
            '<div class="choice-row">' +
              '<button class="btn soft" data-go="nights">以前的夜</button>' +
              '<button class="btn soft" data-go="minigame" data-test="open-minigames">小游戏</button>' +
            "</div>" +
            '<button class="btn ghost wide" data-go="settings">设置</button>' +
          "</div>" +
          '<p class="tiny dim center mt-12">长按「先收棋」可以随时停。做过的都留着。</p>' +
        "</div>";

      if (note) App.UI.toast("以前的一局已收进以前的夜");

      function paintScale() {
        U.qsa("[data-scale]", root).forEach(function (el) {
          el.className = "btn sm " + (el.getAttribute("data-scale") === scale ? "primary" : "soft");
        });
      }
      function paintColors() {
        U.qsa("[data-color]", root).forEach(function (el) {
          var parts = el.getAttribute("data-color").split(":");
          el.className = "btn sm " + (picked[parts[0]] === parts[1] ? "primary" : "soft");
        });
      }
      function paintPlanes() {
        U.qsa("[data-planes]", root).forEach(function (el) {
          el.className = "btn sm " + (Number(el.getAttribute("data-planes")) === planes ? "primary" : "soft");
        });
      }
      function paintBounds() {
        var box = root.querySelector("[data-test=bounds]");
        if (box) box.innerHTML = CHIPS.concat(boundaries.filter(function (b) { return CHIPS.indexOf(b) < 0; })).map(chip).join("");
      }

      U.delegate(root, "[data-scale]", "click", function (e, el) { scale = el.getAttribute("data-scale"); paintScale(); });
      U.delegate(root, "[data-color]", "click", function (e, el) {
        var parts = el.getAttribute("data-color").split(":");
        picked[parts[0]] = parts[1];
        if (picked.a === picked.b) {
          picked[parts[0] === "a" ? "b" : "a"] = COLORS.filter(function (c) { return c.id !== parts[1]; })[0].id;
        }
        paintColors();
      });
      U.delegate(root, "[data-planes]", "click", function (e, el) { planes = Number(el.getAttribute("data-planes")); paintPlanes(); });
      U.delegate(root, "[data-bound]", "click", function (e, el) {
        var name = el.getAttribute("data-bound");
        var i = boundaries.indexOf(name);
        if (i >= 0) boundaries.splice(i, 1); else boundaries.push(name);
        paintBounds();
      });
      var custom = root.querySelector("[data-test=bound-custom]");
      if (custom) custom.addEventListener("keydown", function (e) {
        if (e.key !== "Enter") return;
        var t = custom.value.trim();
        if (t && boundaries.indexOf(t) < 0) boundaries.push(t);
        custom.value = "";
        paintBounds();
      });

      function start() {
        var names = {
          a: root.querySelector("[data-name=a]").value.trim(),
          b: root.querySelector("[data-name=b]").value.trim()
        };
        var made = App.Flight.newGame({
          names: names,
          colors: { a: picked.a, b: picked.b },
          scale: scale,
          boundaries: boundaries,
          planeCount: planes
        });
        if (!made.ok) { App.UI.toast(made.error.message || "还没法开局"); return; }
        App.Store.saveSettings({
          names: names,
          colors: { a: picked.a, b: picked.b },
          scale: scale,
          blacklist: boundaries,
          lastPlaneCount: planes
        });
        var saved = App.Store.saveSession(made.state);
        if (!saved.ok) { App.UI.toast("这台手机没能记下这局"); return; }
        App.Router.reset("table");
      }

      U.delegate(root, "[data-go]", "click", function (e, el) {
        var go = el.getAttribute("data-go");
        if (go === "start") start();
        else if (go === "table") App.Router.reset("table");
        else App.Router.go(go);
      });
    }
  };
})();

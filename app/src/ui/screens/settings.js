/* ===== V6 ui/screens/settings.js：设置 =====
   口径：spec G4（声音/震动/减少动画 · 尺度与边界「下次开局生效」· 数据导出/导入/清除 · 版本号）
   文案：copy.md §0.4 / §7.3。 */
(function () {
  var App = window.App;
  var U = App.util;

  var SCALES = [
    { id: "gentle", name: "温柔" },
    { id: "warm", name: "暧昧" },
    { id: "hot", name: "热烈" },
    { id: "open", name: "不设限" }
  ];
  var CHIPS = ["束缚", "露出", "道具", "喝酒", "蒙眼", "角色"];

  function sw(key, label, hint, on) {
    return '<div class="switch"><span class="lb">' + U.escape(label) +
      (hint ? "<em>" + U.escape(hint) + "</em>" : "") + "</span>" +
      '<button class="toggle' + (on ? " on" : "") + '" data-toggle="' + key + '" data-test="toggle-' + key + '" type="button" aria-pressed="' + (on ? "true" : "false") + '">' +
      (on ? "开" : "关") + "</button></div>";
  }

  App.Screens = App.Screens || {};
  App.Screens.settings = {
    mount: function (root) {
      function paint() {
        var s = App.Store.getSettings();
        var hist = 0;
        try { hist = App.Store.getHistory().length; } catch (e) {}
        var scale = s.scale || "warm";
        var bounds = (s.blacklist || []).slice();
        var scaleChips = SCALES.map(function (sc) {
          return '<button class="chip' + (sc.id === scale ? " on" : "") + '" data-scale="' + sc.id + '" data-test="settings-scale-' + sc.id + '" type="button">' + sc.name + "</button>";
        }).join("");
        var boundChips = CHIPS.concat(bounds.filter(function (b) { return CHIPS.indexOf(b) < 0; })).map(function (b, i) {
          var on = bounds.indexOf(b) >= 0;
          return '<button class="chip' + (on ? " on" : "") + '" data-bound="' + U.escape(b) + '" data-test="settings-bound-' + i + '" type="button">' + U.escape(b) + "</button>";
        }).join("");

        root.innerHTML =
          '<div class="page" data-test="settings">' +
            App.UI.topbar("设置") +
            '<div class="set-group"><div class="glabel">今晚的手感</div>' +
              '<div class="glass set-card" data-test="settings-toggles">' +
                sw("sound", "声音", "关掉后所有提示都不响", s.sound !== false) +
                sw("haptics", "震动", "轻按时给一点反馈", s.haptics !== false) +
                sw("reduced", "减少动画", "关键反馈还在，动画更短", !!s.reduced) +
              "</div>" +
            "</div>" +
            '<div class="set-group"><div class="glabel">尺度与边界</div>' +
              '<div class="glass set-card">' +
                '<div style="padding:12px 0 4px">' +
                  '<div class="small dim">灯拨到哪一档 · <b class="gold">下次开局生效</b></div>' +
                  '<div class="chips mt-8" data-test="settings-scales">' + scaleChips + "</div>" +
                "</div>" +
                '<div style="padding:10px 0 14px;border-top:1px solid var(--line)">' +
                  '<div class="small dim">今晚不做的 · 开局与暂停里都能改</div>' +
                  '<div class="chips mt-8" data-test="settings-bounds">' + boundChips + "</div>" +
                  '<div class="bound-row">' +
                    '<input class="field" data-test="settings-bound-custom" maxlength="40" placeholder="再写一条：一个词、一句话，或一个不想被问的方向" autocomplete="off" />' +
                    '<button class="btn soft sm" data-act="bound-add" data-test="settings-bound-add" type="button">加上</button>' +
                  "</div>" +
                "</div>" +
              "</div>" +
              '<div class="set-note">尺度和边界改的是「下一局」；这一局怎么走完，还是按开局时定下的来。</div>' +
            "</div>" +
            '<div class="set-group"><div class="glabel">数据</div>' +
              '<div class="actions">' +
                '<button class="btn soft wide" data-act="install" data-test="pwa" type="button">装到主屏幕</button>' +
                '<button class="btn soft wide" data-act="export" data-test="export" type="button">导出以前的夜（' + hist + " 条）</button>" +
                '<label class="btn ghost wide" data-test="import" style="position:relative">导入' +
                  '<input type="file" accept="application/json" data-file hidden style="position:absolute;inset:0;opacity:0" /></label>' +
                '<button class="btn ghost wide" data-act="clear" data-test="clear" type="button">清除这台手机上的棋</button>' +
              "</div>" +
              '<div class="set-note">数据只在这台手机里，不上传。导出的 JSON 可以自己留着。</div>' +
            "</div>" +
            '<div class="set-group"><div class="glabel">关于</div>' +
              '<div class="glass set-card">' +
                '<div class="switch"><span class="lb">玩法速览<em>六条规则，随时再看</em></span>' +
                  '<button class="btn soft sm" data-act="rules" data-test="rules-open" type="button">翻开</button></div>' +
                '<div class="switch"><span class="lb">版本<em>今晚飞行棋 V6</em></span>' +
                  '<span class="small dim" data-test="version">' + U.escape(App.version || "6.0.0") + "</span></div>" +
              "</div>" +
            "</div>" +
            '<div class="ver-line">今晚飞行棋 V6 · 午夜星轨 · 暖光纸感<br>这一页只在本机生效</div>' +
          "</div>";
      }

      /* 事件只绑一次（root 常驻，delegate 对新 DOM 生效） */
      U.delegate(root, "[data-toggle]", "click", function (e, el) {
        var key = el.getAttribute("data-toggle");
        var cur = App.Store.getSettings();
        var patch = {};
        patch[key] = !cur[key];
        App.Store.saveSettings(patch);
        App.UI.syncSettings();
        App.UI.haptic("select");
        paint();
        App.UI.toast(key === "reduced" ? (patch[key] ? "动画更短了" : "动画回来了") : (patch[key] ? "打开了" : "关掉了"), { dur: 1300 });
      });
      U.delegate(root, "[data-scale]", "click", function (e, el) {
        App.Store.saveSettings({ scale: el.getAttribute("data-scale") });
        App.UI.haptic("select");
        paint();
      });
      U.delegate(root, "[data-bound]", "click", function (e, el) {
        var name = el.getAttribute("data-bound");
        var bounds = (App.Store.getSettings().blacklist || []).slice();
        var i = bounds.indexOf(name);
        if (i >= 0) bounds.splice(i, 1); else bounds.push(name);
        App.Store.saveSettings({ blacklist: bounds });
        paint();
      });
      U.delegate(root, "[data-act=bound-add]", "click", function () {
        var input = root.querySelector("[data-test=settings-bound-custom]");
        var text = input ? String(input.value || "").trim() : "";
        if (!text) { if (input) input.classList.add("err"); return; }
        var bounds = (App.Store.getSettings().blacklist || []).slice();
        if (bounds.indexOf(text) < 0) bounds.push(text);
        App.Store.saveSettings({ blacklist: bounds });
        App.UI.toast("加上了，从下一张起生效");
        paint();
      });
      U.delegate(root, "[data-go]", "click", function () { App.Router.back(); });
      U.delegate(root, "[data-act=rules]", "click", function () { App.UI.rulesSheet(); });
      U.delegate(root, "[data-act=install]", "click", function () {
        if (App.PWA && App.PWA.showInstall) App.PWA.showInstall();
      });
      U.delegate(root, "[data-act=export]", "click", function () {
        var blob = new Blob([JSON.stringify(App.Store.exportAll(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "tonight-flight.json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        App.UI.toast("导出了，在这台手机上");
      });
      U.delegate(root, "[data-act=clear]", "click", function () {
        App.UI.confirm({ title: "清除", text: "这台手机上的棋局和以前的夜会清掉。已经导出的文件还在。", ok: "清除" }).then(function (yes) {
          if (!yes) return;
          App.Store.resetAll();
          App.UI.syncSettings();
          App.UI.toast("清掉了");
          paint();
        });
      });
      root.addEventListener("change", function (e) {
        var input = e.target.closest ? e.target.closest("[data-file]") : null;
        if (!input || !input.files || !input.files[0]) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var res = App.Store.importAll(JSON.parse(String(reader.result || "")));
            App.UI.toast(res.ok ? "已恢复" : (res.msg || "文件读不出来"), { kind: res.ok ? "gold" : "rose" });
          } catch (err) { App.UI.toast("文件读不出来", { kind: "rose" }); }
          paint();
        };
        reader.readAsText(input.files[0]);
      });

      paint();
    }
  };
})();

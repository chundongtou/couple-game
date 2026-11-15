/* ===== 设置 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function row(key, label, on) {
    return '<div class="switch"><span>' + label + '</span><button class="btn sm" data-key="' + key + '" data-test="toggle-' + key + '" aria-pressed="' + (on ? "true" : "false") + '">' + (on ? "开" : "关") + "</button></div>";
  }

  App.Screens = App.Screens || {};
  App.Screens.settings = {
    mount: function (root) {
      function paint() {
        var s = App.Store.getSettings();
        root.innerHTML =
          '<div class="page" data-test="settings">' +
            '<div class="topbar"><button class="back" data-go="boot">←</button><div class="tb-title">设置</div></div>' +
            '<div class="glass pad-16">' +
              row("sound", "声音", s.sound) +
              row("haptics", "震动", s.haptics) +
              row("reduced", "减弱动画", s.reduced) +
            "</div>" +
            '<div class="actions mt-16">' +
              '<button class="btn soft wide" data-act="install" data-test="pwa">装到主屏幕</button>' +
              '<button class="btn soft wide" data-act="export" data-test="export">导出以前的夜</button>' +
              '<label class="btn ghost wide" data-test="import">导入<input type="file" accept="application/json" data-file hidden style="display:none"></label>' +
              '<button class="btn ghost wide" data-act="clear" data-test="clear">清除这台手机上的棋</button>' +
            "</div>" +
            '<p class="small dim mt-16">安全词在棋局右上角，按住约一秒半。已经做过的都留着，不扣、不评判。</p>' +
            '<p class="tiny dim mt-12">数据只在这台手机里。尺度和「今晚不做的」，开局时写进这一盘。</p>' +
          "</div>";
      }
      paint();
      U.delegate(root, "[data-go]", "click", function () { App.Router.back(); });
      U.delegate(root, "[data-key]", "click", function (e, el) {
        var key = el.getAttribute("data-key");
        var cur = App.Store.getSettings();
        var patch = {};
        patch[key] = !cur[key];
        App.Store.saveSettings(patch);
        App.UI.syncSettings();
        paint();
      });
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
      });
      U.delegate(root, "[data-act=clear]", "click", function () {
        App.UI.confirm({ title: "清除", text: "这台手机上的棋局和以前的夜会清掉。已经导出的文件还在。", ok: "清除" }).then(function (yes) {
          if (!yes) return;
          App.Store.resetAll();
          App.UI.toast("清掉了");
          paint();
        });
      });
      root.addEventListener("change", function (e) {
        var input = e.target.closest("[data-file]");
        if (!input || !input.files || !input.files[0]) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var res = App.Store.importAll(JSON.parse(String(reader.result || "")));
            App.UI.toast(res.ok ? "已恢复" : (res.msg || "没能恢复"));
          } catch (err) { App.UI.toast("文件读不出来"); }
          paint();
        };
        reader.readAsText(input.files[0]);
      });
    }
  };
})();

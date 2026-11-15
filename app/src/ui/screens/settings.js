/* ===== 设置：声音、备份、关于 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function row(key, label, on) {
    return '<div class="switch"><span>' + label + '</span><button class="btn sm" data-key="' + key + '" data-test="toggle-' + key + '" aria-pressed="' + (on ? "true" : "false") + '">' + (on ? "开" : "关") + "</button></div>";
  }

  App.Screens.settings = {
    mount: function (root) {
      function paint() {
        var s = App.Store.getSettings();
        root.innerHTML =
          '<div class="page">' +
            '<div class="topbar"><button class="back" data-act="back" aria-label="返回">←</button><div class="tb-title">设置</div><div class="tb-right"></div></div>' +
            '<div class="glass pad-16">' +
              row("sound", "声音", s.sound) +
              row("haptics", "震动", s.haptics) +
              row("reduced", "减少动效", s.reduced) +
              row("gentleOnly", "再柔一点（最高到暧昧）", s.gentleOnly) +
            "</div>" +
            '<div class="actions mt-16">' +
              '<button class="btn soft wide" data-act="install" data-test="pwa">装到主屏幕</button>' +
              '<button class="btn ghost wide" data-act="clear" data-test="clear">清除这台手机上的夜</button>' +
            "</div>" +
            '<p class="small dim mt-16">安全词是右上角的「先回去关灯」。按住约两秒，灯会自己暗下去。已经做过的都留在记忆页上，不扣、不评判。</p>' +
            '<p class="tiny dim mt-12">数据只在这台手机里。尺度和纸条上的边界，整晚都生效。</p>' +
          "</div>";
      }
      paint();
      U.delegate(root, "[data-act=back]", "click", function () { App.Router.back(); });
      U.delegate(root, "[data-key]", "click", function (e, el) {
        var key = el.getAttribute("data-key");
        var cur = App.Store.getSettings();
        var patch = {};
        patch[key] = !cur[key];
        App.Store.saveSettings(patch);
        if (key === "gentleOnly") {
          var live = App.Store.getSession();
          if (live && live.settings) {
            live.settings.gentleOnly = patch.gentleOnly;
            App.Store.saveSession(live);
          }
        }
        App.UI.syncSettings();
        paint();
      });
      U.delegate(root, "[data-act=install]", "click", function () {
        if (App.PWA && App.PWA.showInstall) App.PWA.showInstall();
        else App.UI.toast("用浏览器的「添加到主屏幕」");
      });
      U.delegate(root, "[data-act=clear]", "click", function () {
        App.UI.confirm({ title: "清除全部", text: "这台手机上的夜晚、设置和备份索引都会清掉。", ok: "清除", cancel: "留下" }).then(function (yes) {
          if (!yes) return;
          App.Store.resetAll();
          App.Night.paint(null);
          App.Router.reset("boot");
        });
      });
    }
  };
})();

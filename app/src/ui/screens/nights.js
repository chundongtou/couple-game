/* ===== 以前的夜 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function roomsOf(item) {
    if (!item.rooms || !item.rooms.length) return item.kind === "voyage" ? "升温夜航" : "没有点亮的房间";
    return item.rooms.map(function (r) { return r.name || r; }).join("、");
  }

  App.Screens.nights = {
    mount: function (root) {
      function paint() {
        var list = App.Store.getHistory();
        root.innerHTML =
          '<div class="page">' +
            '<div class="topbar"><button class="back" data-act="back" aria-label="返回">←</button><div class="tb-title">以前的夜</div><div class="tb-right"></div></div>' +
            (list.length ? list.map(function (item) {
              var title = item.kind === "voyage" ? "以前的夜航" : "今晚在这间公寓";
              return '<article class="glass pad-16 mt-12" data-test="night">' +
                '<div class="tiny dim">' + U.escape(U.fmtDate(item.ts)) + "</div>" +
                '<h2 class="title-md mt-8">' + U.escape(item.endingName || title) + "</h2>" +
                '<p class="small muted mt-8">' + U.escape(roomsOf(item)) + (item.heat != null && item.kind !== "voyage" ? " · 温度 " + item.heat : "") + "</p>" +
                (item.note ? '<p class="small mt-8">' + U.escape(item.note) + "</p>" : "") +
                (item.line ? '<p class="small dim mt-8">' + U.escape(item.line) + "</p>" : "") +
                '<button class="btn ghost sm mt-8" data-del="' + U.escape(item.id) + '">从这一页拿掉</button></article>';
            }).join("") : '<p class="muted mt-20">还没有收起来的夜。</p>') +
            '<div class="actions mt-20"><button class="btn soft wide" data-act="export" data-test="export">导出备份</button>' +
            '<button class="btn ghost wide" data-act="import" data-test="import">导入备份</button></div>' +
            '<input class="hidden" type="file" accept="application/json" data-file>' +
          "</div>";
      }
      paint();
      U.delegate(root, "[data-act=back]", "click", function () { App.Router.back(); });
      U.delegate(root, "[data-del]", "click", function (e, el) {
        App.Store.removeHistory(el.getAttribute("data-del"));
        paint();
      });
      U.delegate(root, "[data-act=export]", "click", function () {
        var blob = new Blob([JSON.stringify(App.Store.exportAll(), null, 2)], { type: "application/json" });
        var a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "apartment-nights.json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      });
      U.delegate(root, "[data-act=import]", "click", function () {
        var file = root.querySelector("[data-file]");
        if (file) file.click();
      });
      U.delegate(root, "[data-file]", "change", function (e, el) {
        var f = el.files && el.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          try {
            var res = App.Store.importAll(JSON.parse(reader.result));
            App.UI.toast(res.ok ? "已恢复" : res.msg);
            paint();
          } catch (err) { App.UI.toast("这个文件读不了"); }
        };
        reader.readAsText(f);
      });
    }
  };
})();

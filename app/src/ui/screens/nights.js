/* ===== 以前的夜 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.Screens = App.Screens || {};
  App.Screens.nights = {
    mount: function (root) {
      var list = App.Store.getHistory();
      var html = list.map(function (item) {
        return '<button class="glass pad-16 wide" style="text-align:left;margin-top:8px" data-id="' + U.escape(item.id) + '">' +
          '<div class="small dim">' + U.escape(item.title || "一夜") + "</div>" +
          '<div>' + U.escape(item.endingName || "") + "</div>" +
          (item.note ? '<div class="tiny dim">' + U.escape(item.note) + "</div>" : "") +
          "</button>";
      }).join("");
      root.innerHTML =
        '<div class="page" data-test="nights">' +
          '<div class="topbar"><button class="back" data-go="boot">←</button><div class="tb-title">以前的夜</div></div>' +
          (html || '<p class="muted mt-16">还没有收起来的夜。</p>') +
        "</div>";
      U.delegate(root, "[data-go]", "click", function () { App.Router.reset("boot"); });
      U.delegate(root, "[data-id]", "click", function (e, el) {
        App.Router.go("ledger", { id: el.getAttribute("data-id") });
      });
    }
  };
})();

/* ===== 贴纸店 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  function render(root) {
    var s = App.Store.getSession();
    if (!s || s.phase !== "shop") { App.Journal.route(s); return; }
    var offers = App.Engine.shopOffers(s);
    var cards = offers.map(function (item) {
      return '<button class="stk" style="--tilt:0deg" data-act="buy" data-id="' + item.id + '" data-test="shop-' + item.id + '"' +
        (item.affordable ? "" : " disabled") + ">" +
        '<span class="stk-kicker">' + item.price + " 段胶带</span>" +
        '<span class="stk-text">' + U.escape(item.name) + "</span>" +
        '<span class="small muted">' + U.escape(item.desc) + (item.soldOut ? " · 已经降到底了" : "") + "</span></button>";
    }).join("");
    root.innerHTML =
      '<div class="page book">' +
      '<div class="book-top"><div class="book-kicker">页间</div></div>' +
      App.Journal.flowHtml(s.spread + 0.5) +
      '<h1 class="spread-name">贴纸店</h1>' +
      '<p class="spread-sub">用胶带段换一小件。不买也可以直接翻页。</p>' +
      App.Journal.marginHtml(s) +
      '<div class="stk-list mt-8">' + cards + "</div>" +
      '<button class="btn primary xl wide mt-20" data-act="leave" data-test="shop-leave">翻到下一页</button>' +
      "</div>";
  }

  function onClick(e) {
    var t = e.target.closest && e.target.closest("[data-act]");
    if (!t) return;
    var s = App.Store.getSession();
    if (!s) return;
    var act = t.getAttribute("data-act");
    if (act === "leave") {
      var left = App.Engine.leaveShop(s);
      App.Store.saveSession(left.state);
      App.Journal.toastEvents(left.events);
      App.Router.go("journey", {}, { replace: true });
    } else if (act === "buy") {
      var bought = App.Engine.shopBuy(s, t.getAttribute("data-id"));
      App.Store.saveSession(bought.state);
      App.Journal.toastEvents(bought.events);
      if (!(bought.events || []).some(function (ev) { return ev.blocked; })) App.UI.toast("收下了");
      render(e.currentTarget);
    }
  }

  App.Screens = App.Screens || {};
  App.Screens.shop = {
    mount: function (root) {
      render(root);
      root.addEventListener("click", onClick);
      return function () { root.removeEventListener("click", onClick); };
    },
    unmount: function () {}
  };
})();

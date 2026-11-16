/* ===== V6 ui/screens/nights.js：以前的夜（暖纸卡片列表） =====
   文案：copy.md §6.3（列表项、空状态、状态标签）。数据：Store.getHistory()。 */
(function () {
  var App = window.App;
  var U = App.util;

  function statusOf(entry) {
    var ledger = entry && entry.ledger;
    if (ledger && ledger.ending === "safe") return ledger.v === 2 ? "今晚就到这" : "安全词收棋";
    if (entry && entry.safe) return "安全词收棋";
    if (ledger && ledger.ending === "shared") return "今晚完成";
    if (ledger && (ledger.ending === "win-a" || ledger.ending === "win-b")) return "今晚完成";
    return (entry && entry.endingName) || "今晚完成";
  }

  function cardOf(entry) {
    var ledger = entry.ledger || {};
    var date = ledger.date || (entry.ts ? U.fmtDate(entry.ts) : "");
    var names = ledger.names || entry.names || {};
    var prompts = Array.isArray(ledger.prompts) ? ledger.prompts.length : 0;
    var stats = ledger.stats || {};
    var cards = stats.cardsDone != null ? (Number(stats.cardsDone) + Number(stats.cardsSkipped || 0)) : prompts;
    var heat = stats.heat != null ? stats.heat : ledger.heat;
    var dur = ledger.durationMs ? App.UI.fmtDuration(ledger.durationMs) : "";
    var minis = stats.minigames;
    var meta = [];
    if (names.a || names.b) meta.push("<span>" + U.escape(names.a || "") + " 和 " + U.escape(names.b || "") + "</span>");
    if (cards) meta.push("<span>题卡 <b>" + cards + "</b> 张</span>");
    if (heat != null) meta.push("<span>心动值 <b>" + U.round(heat) + "</b></span>");
    if (dur) meta.push("<span>今晚 <b>" + U.escape(dur) + "</b></span>");
    if (minis) meta.push("<span>小游戏 <b>" + minis + "</b> 次</span>");
    return '<button class="night-item" data-id="' + U.escape(entry.id) + '" data-test="night-item-' + U.escape(entry.id) + '" type="button">' +
      '<div class="ni-top">今晚飞行棋 · ' + U.escape(date || "以前的夜") + "</div>" +
      '<div class="ni-sub">' + U.escape(statusOf(entry)) + "</div>" +
      (meta.length ? '<div class="ni-meta">' + meta.join("") + "</div>" : "") +
      "</button>";
  }

  App.Screens = App.Screens || {};
  App.Screens.nights = {
    mount: function (root) {
      var list = [];
      try { list = App.Store.getHistory(); } catch (e) { list = []; }
      list = list.filter(function (x) { return x && x.kind !== "apartment"; });
      root.innerHTML =
        '<div class="page" data-test="nights">' +
          App.UI.topbar("以前的夜") +
          (list.length
            ? '<div class="small dim" data-test="nights-count">收起来 ' + list.length + " 夜 · 都在这台手机里</div>" +
              '<div class="nights-list">' + list.map(cardOf).join("") + "</div>"
            : '<div class="empty-card" data-test="nights-empty">' +
                '<div class="big">还没有收起来的夜。</div>' +
                '<div class="small">摆上棋盘，走完一晚，这里就会多一张卡片。</div>' +
                '<button class="btn soft mt-16" data-go="boot" type="button">回开场</button>' +
              "</div>") +
          '<div class="tiny dim center mt-16">数据只在这台手机里</div>' +
        "</div>";
      U.delegate(root, "[data-id]", "click", function (e, el) {
        App.Router.go("ledger", { id: el.getAttribute("data-id") });
      });
      U.delegate(root, "[data-go]", "click", function () { App.Router.back(); });
    }
  };
})();

/* ===== 今晚这一页 · 封面 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.UI.injectStyle("boot", [
    ".boot { justify-content: space-between; }",
    ".boot-brand { font-size: 11px; letter-spacing: .28em; color: var(--dim2); font-weight: 700; }",
    ".boot-hero { padding: 6vh 0 4vh; }",
    ".tape-title { display: inline-block; background: var(--tape); padding: 4px 10px; transform: rotate(-2deg); font-size: 12px; letter-spacing: .18em; font-weight: 800; }",
    ".boot-title { margin-top: 18px; font-size: clamp(40px, 12vw, 58px); font-weight: 800; letter-spacing: .14em; line-height: 1.05; }",
    ".boot-sub { margin-top: 16px; color: var(--dim); font-size: 14.5px; line-height: 1.85; max-width: 320px; }",
    ".boot-meta { margin-top: 18px; display: flex; gap: 16px; color: var(--dim2); font-size: 12px; letter-spacing: .08em; }",
    ".boot-meta b { color: var(--coral); }",
    ".boot-actions { display: flex; flex-direction: column; gap: 10px; }",
    ".boot-row { display: flex; gap: 8px; }",
    ".boot-row .btn { flex: 1; }",
    ".boot-foot { margin-top: 14px; text-align: center; font-size: 11.5px; color: var(--dim2); line-height: 1.7; }"
  ].join("\n"));

  function cardCount() {
    var n = 0;
    try {
      if (window.CARDS) Object.keys(window.CARDS).forEach(function (k) { n += (window.CARDS[k] || []).length; });
    } catch (e) {}
    return n;
  }

  function render(root) {
    var has = false;
    var session = null;
    try { session = App.Store.getSession(); has = App.Store.hasSession(); } catch (e) {}
    var nights = 0;
    try { nights = App.Store.getHistory().length; } catch (e) {}
    var cont = "";
    if (has && session) {
      var label = session.phase === "poster" ? "看今晚的封底" : "继续今晚";
      var who = session.names ? (session.names.a + " · " + session.names.b) : "";
      cont = '<button class="btn primary xl wide" id="btnContinue" data-test="boot-continue">' + label + '<span class="sub">' + U.escape(who) + "</span></button>";
    }
    root.innerHTML =
      '<div class="page boot">' +
      '<div class="boot-brand">TONIGHT · ONE PAGE</div>' +
      '<div class="boot-hero">' +
      '<div class="tape-title">两人一本</div>' +
      '<h1 class="boot-title">今晚这一页</h1>' +
      '<p class="boot-sub">手机就是打开的那本本子。三页贴纸：热身、升温、靠近。贴满之后，封底是今晚的海报。</p>' +
      '<div class="boot-meta"><span>往期 <b>' + nights + '</b> 页</span><span>题库 <b>' + cardCount() + "</b> 张</span></div>" +
      "</div>" +
      '<div class="boot-actions">' +
      cont +
      '<button class="btn ' + (has ? "soft" : "primary xl") + ' wide" id="btnNew" data-test="boot-new">' + (has ? "翻开新的一页" : "翻开今晚") + "</button>" +
      '<div class="boot-row">' +
      '<button class="btn ghost sm" id="btnMemory" data-test="boot-memory">往期</button>' +
      '<button class="btn ghost sm" id="btnArcade" data-test="boot-arcade">游戏厅</button>' +
      '<button class="btn ghost sm" id="btnSettings" data-test="boot-settings">设置</button>' +
      "</div>" +
      '<div class="boot-foot">页角的「合上本子」随时都在<br>长按就会温柔收尾，已经贴上的都留着</div>' +
      "</div></div>";

    U.qs("#btnNew", root).addEventListener("click", function () {
      if (App.Store.hasSession()) {
        App.UI.confirm({ title: "翻开新的一页？", text: "今晚还没写完的进度会被盖住。往期里已经收下的页面还在。", ok: "翻开", cancel: "先不了" })
          .then(function (yes) {
            if (!yes) return;
            App.Store.clearSession();
            App.Router.go("setup");
          });
      } else App.Router.go("setup");
    });
    var c = U.qs("#btnContinue", root);
    if (c) c.addEventListener("click", function () {
      var s = App.Store.getSession();
      if (!s) { App.Router.go("setup"); return; }
      App.Journal.route(s);
    });
    U.qs("#btnMemory", root).addEventListener("click", function () { App.Router.go("memory"); });
    U.qs("#btnArcade", root).addEventListener("click", function () { App.Router.go("arcade"); });
    U.qs("#btnSettings", root).addEventListener("click", function () { App.Router.go("settings"); });
  }

  App.Screens = App.Screens || {};
  App.Screens.boot = {
    mount: function (root) { render(root); },
    unmount: function () {}
  };
})();

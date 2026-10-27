/* ===== V3 ui/screens/arcade.js：游戏厅（温度计 + 经典三款，内嵌在同一个 App 里） ===== */
(function () {
  var App = window.App;
  var U = App.util;

  var GAMES = [
    {
      id: "thermo",
      icon: "🌡️",
      name: "温度计",
      tag: "NEW",
      desc: "12 格慢慢升温：掷骰子前进，完成落点那一格，随时可以停。",
      meta: "2 人 · 15–25 分钟",
      url: "arcade/thermometer.html?embed=1"
    },
    {
      id: "truth",
      icon: "🎡",
      name: "真心话转盘",
      tag: "",
      desc: "转盘决定谁来回答；答不上来，就领一条惩罚。",
      meta: "2–4 人 · 10–20 分钟",
      url: "arcade/?game=truth&embed=1"
    },
    {
      id: "dare",
      icon: "🔥",
      name: "大冒险转盘",
      tag: "",
      desc: "转盘决定谁去执行；做完才算过关。",
      meta: "2–4 人 · 10–20 分钟",
      url: "arcade/?game=dare&embed=1"
    },
    {
      id: "flight",
      icon: "✈️",
      name: "飞行棋",
      tag: "",
      desc: "对飞 / 环岛 / 双轨 / 融合，骰子决定今晚的走向。",
      meta: "2–4 人 · 20–40 分钟",
      url: "arcade/?game=flight&embed=1"
    }
  ];

  App.UI.injectStyle("arcade", [
    ".arc-hall { padding-top: calc(26px + var(--safe-t)); }",
    ".arc-top { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 46px; }",
    ".arc-kicker { font-size: 10px; letter-spacing: .30em; color: var(--dim2); font-weight: 700; text-align: center; flex: 1; }",
    ".arc-top-sp { width: 46px; height: 46px; flex: 0 0 auto; }",
    ".arc-title { margin-top: 22px; font-size: clamp(32px, 9.4vw, 40px); line-height: 1.14; letter-spacing: .03em; font-weight: 800;",
    "  background: linear-gradient(102deg,#fff 0%,#f3c879 44%,#ff5f9e 76%,#9a7cff 100%);",
    "  -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }",
    ".arc-sub { margin-top: 12px; font-size: 13px; line-height: 1.85; color: var(--dim); letter-spacing: .02em; }",
    ".arc-sub b { color: var(--gold); font-weight: 700; }",
    ".arc-list { margin-top: 26px; display: flex; flex-direction: column; gap: 11px; }",
    ".arc-card { display: flex; align-items: center; gap: 14px; width: 100%; min-height: 96px; padding: 15px 16px;",
    "  text-align: left; border-radius: 20px; border: 1px solid var(--line);",
    "  background: linear-gradient(155deg, rgba(255,255,255,.075), rgba(255,255,255,.025));",
    "  color: var(--ink); transition: transform .14s var(--ease), border-color .2s, background .2s; }",
    ".arc-card:active { transform: scale(.977); }",
    ".arc-card-ic { width: 52px; height: 52px; flex: 0 0 auto; border-radius: 16px; display: flex; align-items: center; justify-content: center;",
    "  font-size: 25px; background: rgba(255,255,255,.06); border: 1px solid var(--line); }",
    ".arc-card-tx { flex: 1; min-width: 0; }",
    ".arc-card-name { display: flex; align-items: center; gap: 7px; font-size: 16px; font-weight: 800; letter-spacing: .04em; }",
    ".arc-card-name em { font-style: normal; font-size: 8.5px; letter-spacing: .14em; padding: 2px 6px; border-radius: 6px;",
    "  background: linear-gradient(135deg,#ff5f9e,#9a7cff); color: #fff; font-weight: 800; }",
    ".arc-card-desc { display: block; margin-top: 5px; font-size: 11.5px; line-height: 1.62; color: var(--dim); }",
    ".arc-card-meta { display: block; margin-top: 5px; font-size: 10px; letter-spacing: .08em; color: var(--dim2); }",
    ".arc-card-go { flex: 0 0 auto; color: var(--gold); font-size: 18px; opacity: .8; }",
    ".arc-foot { margin-top: 22px; font-size: 10.5px; line-height: 1.85; color: var(--dim2); letter-spacing: .03em; }",
    ".arc-foot b { color: #e6d7f5; font-weight: 600; }",
    /* 内嵌游戏：全屏 iframe，顶部只留一条返回栏 */
    ".arc-embed { height: 100%; display: flex; flex-direction: column; background: var(--bg0); }",
    ".arc-embed-top { flex: 0 0 auto; display: flex; align-items: center; gap: 10px; min-height: 54px;",
    "  padding: calc(5px + var(--safe-t)) 14px 5px; border-bottom: 1px solid var(--line);",
    "  background: rgba(7,4,17,.92); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); }",
    ".arc-embed-title { flex: 1; text-align: center; font-size: 13px; font-weight: 700; letter-spacing: .12em; color: var(--ink);",
    "  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }",
    ".arc-embed-open { flex: 0 0 auto; width: 44px; height: 44px; display: inline-flex; align-items: center; justify-content: center;",
    "  border-radius: 50%; color: var(--dim2); border: 1px solid var(--line); background: var(--glass); text-decoration: none; font-size: 15px; }",
    ".arc-frame-wrap { position: relative; flex: 1 1 auto; min-height: 0; background: var(--bg0); }",
    ".arc-frame { display: block; width: 100%; height: 100%; border: 0; background: var(--bg0); }",
    ".arc-loading { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;",
    "  color: var(--dim2); font-size: 11.5px; letter-spacing: .16em; pointer-events: none; transition: opacity .3s var(--ease); }",
    ".arc-loading.off { opacity: 0; }",
    ".arc-fail { position: absolute; left: 50%; top: 50%; transform: translate(-50%,-50%); width: min(300px, 80vw);",
    "  text-align: center; font-size: 12px; line-height: 1.8; color: var(--dim); padding: 18px; border-radius: 16px;",
    "  border: 1px solid var(--line); background: rgba(20,12,36,.9); }",
    ".arc-fail a { color: var(--gold); }"
  ].join("\n"));

  function gameOf(id) {
    for (var i = 0; i < GAMES.length; i++) if (GAMES[i].id === id) return GAMES[i];
    return null;
  }

  function mount(root, params) {
    var inst = {
      root: root,
      game: params && params.game ? gameOf(params.game) : null,
      iframe: null,
      loadTimer: null,
      onMsg: null
    };

    function goBack() {
      try { App.Audio.play("tap"); } catch (e) {}
      if (App.Router.depth() > 1) App.Router.back();
      else App.Router.reset("arcade");
    }

    function hall() {
      var cards = GAMES.map(function (g) {
        return '<button class="arc-card" type="button" data-game="' + g.id + '" data-test="arcade-game-' + g.id + '" aria-label="打开' + U.escape(g.name) + '">' +
          '<span class="arc-card-ic" aria-hidden="true">' + g.icon + "</span>" +
          '<span class="arc-card-tx">' +
          '<span class="arc-card-name">' + U.escape(g.name) + (g.tag ? "<em>" + U.escape(g.tag) + "</em>" : "") + "</span>" +
          '<span class="arc-card-desc">' + U.escape(g.desc) + "</span>" +
          '<span class="arc-card-meta">' + U.escape(g.meta) + "</span>" +
          "</span>" +
          '<span class="arc-card-go" aria-hidden="true">→</span>' +
          "</button>";
      }).join("");

      root.innerHTML = '<div class="page arc-hall" data-test="arcade-hall">' +
        '<div class="arc-top">' +
        '<button class="icon-btn" type="button" data-back aria-label="返回">←</button>' +
        '<div class="arc-kicker">ARCADE · 游戏厅</div>' +
        '<span class="arc-top-sp"></span>' +
        "</div>" +
        '<h1 class="arc-title">换一种玩法</h1>' +
        '<p class="arc-sub">四款独立小游戏，随时进出。<br>它们<b>不会影响</b>「升温夜航」的存档和进度。</p>' +
        '<div class="arc-list">' + cards + "</div>" +
        '<div class="arc-foot">经典三款来自旧版，温度计是为你们新做的。<br>所有页面都只在本机运行，数据各自独立。</div>' +
        "</div>";

      var back = root.querySelector("[data-back]");
      if (back) back.addEventListener("click", goBack);
      U.qsa("[data-game]", root).forEach(function (btn) {
        btn.addEventListener("click", function () {
          try { App.Audio.play("tap"); } catch (e) {}
          App.Router.go("arcade", { game: btn.getAttribute("data-game") });
        });
      });
    }

    function embed() {
      var g = inst.game;
      var src = g.url;
      root.innerHTML = '<div class="arc-embed" data-test="arcade-embed" data-game="' + g.id + '">' +
        '<div class="arc-embed-top">' +
        '<button class="icon-btn" type="button" data-close aria-label="返回游戏厅">←</button>' +
        '<div class="arc-embed-title">' + U.escape(g.name) + "</div>" +
        '<a class="arc-embed-open" href="' + U.escape(src.replace("?embed=1", "")) + '" target="_blank" rel="noopener" aria-label="在新窗口打开">↗</a>' +
        "</div>" +
        '<div class="arc-frame-wrap">' +
        '<div class="arc-loading" data-loading>载入中…</div>' +
        '<iframe class="arc-frame" data-frame title="' + U.escape(g.name) + '" src="' + U.escape(src) + '"></iframe>' +
        "</div>" +
        "</div>";

      var frame = root.querySelector("[data-frame]");
      var loading = root.querySelector("[data-loading]");
      inst.iframe = frame;
      var loaded = false;
      frame.addEventListener("load", function () {
        loaded = true;
        if (loading) loading.classList.add("off");
        clearTimeout(inst.loadTimer);
      });
      // 超时仍没加载出来：给一个兜底入口，而不是一直“载入中”
      inst.loadTimer = setTimeout(function () {
        if (loaded || !loading) return;
        loading.classList.remove("off");
        loading.innerHTML = '<div class="arc-fail">这一页没有加载出来。<br><a href="' + U.escape(src.replace("?embed=1", "")) + '" target="_blank" rel="noopener">在新窗口打开</a> 或返回游戏厅。</div>';
      }, 9000);

      var close = root.querySelector("[data-close]");
      if (close) close.addEventListener("click", goBack);
    }

    inst.onMsg = function (e) {
      if (!e || !e.data || e.data.type !== "arcade:back") return;
      goBack();
    };
    window.addEventListener("message", inst.onMsg);

    if (inst.game) embed(); else hall();

    return function cleanup() {
      window.removeEventListener("message", inst.onMsg);
      clearTimeout(inst.loadTimer);
      if (inst.iframe) {
        try { inst.iframe.src = "about:blank"; } catch (e) {}
      }
    };
  }

  App.Screens = App.Screens || {};
  App.Screens.arcade = { mount: mount, unmount: function () {} };
})();

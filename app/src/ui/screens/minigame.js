/* ===== V6 小游戏门厅 / 单独玩：温度计 · 真心话转盘 · 大冒险转盘 =====
 * 门厅保留三个入口（task-8 §5）；单独玩复用 App.MiniGame 面板。
 * 文案沿用 copy.md 的类型名；面板内文案由 App.MiniGame 负责。
 */
(function () {
  var App = window.App || {};
  var U = App.util || {};

  function esc(s) {
    if (U.escape) return U.escape(s);
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  var CSS = `
.mg-hall-page{background:radial-gradient(120% 55% at 50% 0%,rgba(36,21,64,.55) 0%,rgba(8,6,15,.92) 62%,var(--bg0,#08060F) 100%);
  color:var(--ink,#FBF3E7)}
.mg-hall-title{margin-top:8px;font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:clamp(30px,9vw,42px);line-height:1.15;font-weight:700;letter-spacing:.06em}
.mg-hall-sub{margin-top:10px;font-size:13px;line-height:1.7;color:var(--dim,#C9B6CE)}
.mg-hall-list{margin-top:18px;display:flex;flex-direction:column;gap:10px}
.mg-hall-card{display:flex;align-items:center;gap:12px;width:100%;min-height:76px;padding:12px 14px;border-radius:var(--r-md,18px);
  text-align:left;font-family:inherit;color:var(--ink,#FBF3E7);
  background:linear-gradient(180deg,rgba(255,236,214,.075),rgba(255,236,214,.03));
  border:1px solid var(--line,rgba(255,226,196,.13));
  box-shadow:0 10px 28px rgba(3,2,10,.28);transition:transform var(--t-fast,160ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.mg-hall-card:active{transform:scale(.99)}
.mg-hall-ico{flex:none;width:46px;height:46px;border-radius:15px;display:flex;align-items:center;justify-content:center;
  font-family:var(--font-display,var(--font,serif));font-size:20px;font-weight:700;color:#2A140E;
  background:radial-gradient(circle at 36% 30%,#FFE6BE,var(--amber,#F3C077) 56%,var(--amber-deep,#E2965E));
  box-shadow:0 6px 16px rgba(243,192,119,.22)}
.mg-hall-card.t2 .mg-hall-ico{background:radial-gradient(circle at 36% 30%,#FFD9D1,var(--rose,#E9887A) 58%,#B8554C)}
.mg-hall-card.t3 .mg-hall-ico{background:radial-gradient(circle at 36% 30%,#DCD3FF,#8E7BD8 58%,#5E42A0);color:#F6F0FF}
.mg-hall-body{flex:1;min-width:0}
.mg-hall-body b{display:block;font-size:16px;font-weight:700;letter-spacing:.04em}
.mg-hall-body span{display:block;margin-top:3px;font-size:11.5px;line-height:1.5;color:var(--dim2,#8E7C9E)}
.mg-hall-arrow{flex:none;color:var(--dim2,#8E7C9E);font-size:18px}
.mg-hall-acts{margin-top:18px;display:flex;flex-direction:column;gap:9px}
.mg-play-host{position:static}
.mg-result-card{margin-top:18px;padding:18px 16px;border-radius:var(--r-lg,26px);
  background:radial-gradient(120% 100% at 30% 0%,rgba(243,192,119,.16),rgba(38,27,58,.42));
  border:1px solid rgba(243,192,119,.24)}
.mg-result-big{font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:38px;line-height:1.15;font-weight:700;color:var(--amber,#F3C077)}
.mg-result-body{margin-top:8px;font-size:14px;line-height:1.65;color:var(--dim,#C9B6CE)}
.mg-result-text{margin-top:10px;font-family:var(--font-display,var(--font,"Noto Serif SC","Songti SC",serif));
  font-size:18px;line-height:1.55;color:var(--ink,#FBF3E7)}
.mg-actions{margin-top:16px;display:flex;flex-direction:column;gap:9px}
.mg-act-btn{width:100%;min-height:50px;border-radius:999px;font-size:15px;font-weight:800;letter-spacing:.1em;font-family:inherit}
.mg-act-btn.main{background:linear-gradient(180deg,var(--amber,#F3C077),var(--amber-deep,#E2965E));color:#2A140E;
  box-shadow:0 10px 26px rgba(243,192,119,.2)}
.mg-act-btn.soft{background:rgba(255,236,214,.08);border:1px solid var(--line,rgba(255,226,196,.16));color:var(--ink,#FBF3E7)}
.mg-act-btn.ghost{background:transparent;border:1px solid var(--line,rgba(255,226,196,.12));color:var(--dim,#C9B6CE);min-height:44px;font-size:13px}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("minigame-hall-v6", CSS); return; }
    if (document.getElementById("style-minigame-hall-v6")) return;
    var el = document.createElement("style");
    el.id = "style-minigame-hall-v6";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  var GAMES = {
    thermo: {
      cls: "",
      icon: "热",
      name: "温度计",
      desc: "两个人各自标一格，再看猜近多少",
      resultTitle: "温度计"
    },
    truth: {
      cls: "t2",
      icon: "真",
      name: "真心话转盘",
      desc: "六张真心话，转到哪张聊哪张",
      resultTitle: "真心话转盘"
    },
    dare: {
      cls: "t3",
      icon: "冒",
      name: "大冒险转盘",
      desc: "六张大冒险，转到哪张做哪张",
      resultTitle: "大冒险转盘"
    }
  };

  function settings() {
    try { return App.Store.getSettings(); } catch (e) { return {}; }
  }

  function pageShell(title, body, backTo) {
    return '<div class="page mg-hall-page" data-test="minigame">' +
      '<div class="topbar"><button class="back" type="button" data-go="' + (backTo || "boot") + '" aria-label="返回">←</button>' +
      '<div class="tb-title">' + esc(title || "小游戏") + "</div>" +
      '<div style="width:44px"></div></div>' +
      body + "</div>";
  }

  function hallHtml() {
    var cards = Object.keys(GAMES).map(function (key) {
      var g = GAMES[key];
      return '<button class="mg-hall-card ' + g.cls + '" type="button" data-game="' + key + '" data-test="play-' + key + '">' +
        '<span class="mg-hall-ico" aria-hidden="true">' + g.icon + "</span>" +
        '<span class="mg-hall-body"><b>' + g.name + "</b><span>" + g.desc + "</span></span>" +
        '<span class="mg-hall-arrow" aria-hidden="true">→</span>' +
        "</button>";
    }).join("");
    return pageShell("小游戏",
      '<h1 class="mg-hall-title">小游戏</h1>' +
      '<p class="mg-hall-sub">温度计、真心话转盘、大冒险转盘可以单独玩。飞行棋只有桌上这一盘。</p>' +
      '<div class="mg-hall-list">' + cards + "</div>" +
      '<div class="mg-hall-acts"><button class="mg-act-btn ghost" type="button" data-go="boot">回飞行棋</button></div>', "boot");
  }

  function miniState() {
    var s = settings();
    return {
      names: s.names || { a: "他", b: "她" },
      colors: s.colors || { a: "red", b: "yellow" },
      scale: s.scale || "warm",
      boundaries: s.blacklist || [],
      turn: "a"
    };
  }

  function resultHtml(game, result) {
    var g = GAMES[game] || GAMES.thermo;
    var body = "";
    if (game === "thermo" && result && result.closeness !== undefined) {
      body = '<div class="mg-result-big">猜近了 ' + esc(result.closeness) + "%</div>" +
        '<p class="mg-result-body">这一页只记你们标过。没有要扣的。</p>';
    } else if (result && result.card && result.card.text) {
      body = '<div class="mg-result-big">转盘停在这一张</div>' +
        '<p class="mg-result-text">' + esc(result.card.text) + "</p>";
    } else {
      body = '<div class="mg-result-big">完成了</div>' +
        '<p class="mg-result-body">这一格记下了。</p>';
    }
    return pageShell(g.resultTitle,
      '<div class="mg-result-card" data-test="minigame-result">' + body + "</div>" +
      '<div class="mg-actions">' +
        '<button class="mg-act-btn main" type="button" data-act="again" data-game="' + game + '" data-test="minigame-again">再玩一次</button>' +
        '<button class="mg-act-btn soft" type="button" data-go="hall" data-test="minigame-back-hall">回小游戏</button>' +
        '<button class="mg-act-btn ghost" type="button" data-go="boot">回飞行棋</button>' +
      "</div>", "hall");
  }

  App.Screens = App.Screens || {};
  App.Screens.minigame = {
    mount: function (root, params) {
      params = params || {};
      injectStyle();
      var game = params.game || "";
      if (!game || params.hall) { root.innerHTML = hallHtml(); bind(root, null); return; }

      if (!App.MiniGame || typeof App.MiniGame.open !== "function") {
        root.innerHTML = pageShell(GAMES[game] ? GAMES[game].resultTitle : "小游戏",
          '<div class="mg-result-card"><div class="mg-result-big">这一页还没准备好</div>' +
          '<p class="mg-result-body">小游戏面板没有载入。</p></div>' +
          '<div class="mg-actions"><button class="mg-act-btn main" type="button" data-go="hall">回小游戏</button></div>', "hall");
        bind(root, null);
        return;
      }

      var maker = game === "truth" ? "truth-wheel" : (game === "dare" ? "dare-wheel" : "thermo");
      var title = GAMES[game] ? GAMES[game].resultTitle : "小游戏";
      root.innerHTML = pageShell(title,
        '<div class="mg-play-host" data-test="minigame-screen-host"></div>', "hall");
      var host = root.querySelector("[data-test=minigame-screen-host]");
      var closeFn = null;
      var finished = false;

      function openPanel() {
        if (!host) return;
        closeFn = App.MiniGame.open(host, maker, miniState(), {
          done: function (result) {
            finished = true;
            closeFn = null;
            root.innerHTML = resultHtml(game, result || {});
            bind(root, null);
            if (App.Audio) App.Audio.play("chime");
          },
          skipped: function () {
            finished = true;
            closeFn = null;
            if (App.Router) App.Router.reset("minigame", { hall: true });
          }
        });
      }
      openPanel();
      bind(root, { openPanel: openPanel });

      return function () {
        if (typeof closeFn === "function") { try { closeFn(); } catch (e) {} }
        closeFn = null;
      };
    }
  };

  function bind(root, ctl) {
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var go = t.closest("[data-go]");
      if (go) {
        var where = go.getAttribute("data-go");
        if (where === "hall") {
          if (App.Router) App.Router.reset("minigame", { hall: true });
        } else if (App.Router) {
          App.Router.reset("boot");
        }
        return;
      }
      var card = t.closest("[data-game]");
      if (card) {
        if (App.Router) App.Router.go("minigame", { game: card.getAttribute("data-game") });
        return;
      }
      var again = t.closest('[data-act="again"]');
      if (again && ctl && ctl.openPanel) {
        var game = again.getAttribute("data-game") || "thermo";
        if (App.Router) App.Router.reset("minigame", { game: game });
      }
    });
  }
})();

/* ===== V3 ui/screens/boot.js：标题屏 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  App.UI.injectStyle("boot", [
    ".boot { justify-content: space-between; overflow: hidden; }",
    ".boot-glow { position: absolute; left: 50%; top: 16%; width: 320px; height: 320px; transform: translateX(-50%); border-radius: 50%;",
    "  background: radial-gradient(circle, rgba(255,95,158,.20), rgba(154,124,255,.10) 45%, transparent 70%); filter: blur(18px); pointer-events: none; }",
    ".boot-top { display: flex; justify-content: space-between; align-items: center; }",
    ".boot-brand { letter-spacing: .36em; font-size: 10.5px; color: var(--dim2); font-weight: 700; }",
    ".boot-hero { position: relative; margin: auto 0; padding: 8vh 0 6vh; text-align: left; }",
    ".boot-moon { font-size: 26px; color: var(--gold); letter-spacing: .2em; margin-bottom: 18px; opacity: .9; }",
    ".boot-title { font-size: clamp(46px, 15vw, 68px); font-weight: 800; line-height: 1.02; letter-spacing: .06em; }",
    ".boot-title span { display: block; }",
    ".boot-title .line2 { margin-left: 1.1em; }",
    ".boot-sub { margin-top: 20px; color: var(--dim); font-size: 14px; line-height: 1.9; letter-spacing: .04em; max-width: 300px; }",
    ".boot-meta { margin-top: 26px; display: flex; gap: 18px; color: var(--dim2); font-size: 11px; letter-spacing: .12em; }",
    ".boot-meta b { color: var(--gold); font-weight: 700; }",
    ".boot-actions { display: flex; flex-direction: column; gap: 12px; padding-bottom: 6px; }",
    ".boot-row { display: flex; gap: 12px; }",
    ".boot-row .btn { flex: 1; }",
    ".boot-foot { margin-top: 18px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; line-height: 1.8; }",
    ".boot-tag { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 11px; color: var(--dim2); }",
    ".boot-tag i { width: 5px; height: 5px; border-radius: 50%; background: var(--teal); display: inline-block; }"
  ].join("\n"));

  function render(root) {
    var settings = App.Store.getSettings();
    var hasSession = App.Store.hasSession();
    var screen = App.Store.getSession();
    root.innerHTML =
      '<div class="page boot">' +
      '<div class="boot-glow"></div>' +
      '<div class="boot-top">' +
      '<div class="boot-brand">COUPLE VOYAGE</div>' +
      '<div class="boot-brand" style="letter-spacing:.18em">夜间航线 · Ⅴ３</div>' +
      "</div>" +
      '<div class="boot-hero">' +
      '<div class="boot-moon">☾ ✧</div>' +
      '<h1 class="boot-title"><span class="grad-text">升温</span><span class="line2 grad-text">夜航</span></h1>' +
      '<p class="boot-sub">今晚，你们登上了一艘只在夜里出现的船。<br>三幕航线，一张一张地，靠近。</p>' +
      '<div class="boot-meta"><span>已航行 <b id="bootNights">' + App.Store.getHistory().length + '</b> 晚</span><span>题库 <b id="bootCards">' + (window.CARDS ? (window.CARDS.truth.length + window.CARDS.dare.length + window.CARDS.touch.length + window.CARDS.sync.length + window.CARDS.spark.length) : 0) + '</b> 张</span></div>' +
      "</div>" +
      '<div class="boot-actions">' +
      (hasSession ? '<button class="btn primary xl wide" id="btnContinue" data-test="boot-continue">继续今晚<span class="sub">' + U.escape(screen && screen.names ? screen.names.a + " ❤ " + screen.names.b : "") + "</span></button>" : "") +
      '<button class="btn ' + (hasSession ? "soft" : "primary xl") + ' wide" id="btnNew" data-test="boot-new">' + (hasSession ? "开始新的一夜" : "开始今晚") + "</button>" +
      '<div class="boot-row">' +
      '<button class="btn ghost sm" id="btnMemory" data-test="boot-memory">回忆册</button>' +
      '<button class="btn ghost sm" id="btnArcade" data-test="boot-arcade">游戏厅</button>' +
      '<button class="btn ghost sm" id="btnSettings" data-test="boot-settings">设置</button>' +
      "</div>" +
      '<div class="boot-foot">安全词随时可用 · 长按「停」即可温柔收尾<br>数据只保存在这台手机上</div>' +
      "</div>" +
      "</div>";

    var els = U.qsa(".boot-hero, .boot-actions, .boot-top", root);
    if (!M.reduced()) {
      els.forEach(function (el) { el.classList.add("fade-up"); });
      M.stagger(els, 90);
    }

    U.qs("#btnNew", root).addEventListener("click", function () {
      App.Audio.play("tap");
      if (App.Store.hasSession()) {
        App.UI.confirm({ title: "重开一夜？", text: "今晚的进度会留在存档里，新的一夜会覆盖它。", ok: "开始新的", cancel: "先不了" })
          .then(function (yes) {
            if (!yes) return;
            App.Store.clearSession();
            App.Router.go("setup");
          });
      } else {
        App.Router.go("setup");
      }
    });
    var cont = U.qs("#btnContinue", root);
    if (cont) {
      cont.addEventListener("click", function () {
        App.Audio.play("tap");
        var s = App.Store.getSession();
        if (!s) { App.Router.go("setup"); return; }
        if (s.phase === "finale" || s.phase === "done") App.Router.go("finale", { state: s });
        else if (s.phase === "play" || s.phase === "resolve" || s.phase === "escalate") App.Router.go("play");
        else if (s.phase === "event") App.Router.go("event");
        else if (s.phase === "act") App.Router.go("act");
        else App.Router.go("journey");
      });
    }
    U.qs("#btnMemory", root).addEventListener("click", function () {
      App.Audio.play("tap");
      App.Router.go("memory");
    });
    U.qs("#btnArcade", root).addEventListener("click", function () {
      App.Audio.play("tap");
      App.Router.go("arcade");
    });
    U.qs("#btnSettings", root).addEventListener("click", function () {
      App.Audio.play("tap");
      App.Router.go("settings");
    });
  }

  App.Screens = App.Screens || {};
  var firstBoot = true;   // 只在整页首次加载时做「结局直达」，SPA 内回大厅不重定向
  App.Screens.boot = {
    mount: function (root) {
      var s = null;
      try { s = App.Store.getSession(); } catch (e) {}
      if (firstBoot) {
        firstBoot = false;
        // 结局阶段刷新：直接回到结局屏（未保存的结局不会丢；保存后 phase=done 不再直达）
        if (s && s.phase === "finale") {
          root.innerHTML = "";
          var target = s;
          setTimeout(function () { App.Router.reset("finale", { state: target }); }, 0);
          return;
        }
      }
      render(root);
    },
    unmount: function () {}
  };
})();

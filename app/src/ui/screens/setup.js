/* ===== 今晚这一页 · 封面标签（称呼、尺度、边界） ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.UI.injectStyle("setup", [
    ".setup-top { display: flex; align-items: center; justify-content: space-between; min-height: 44px; }",
    ".setup-brand { font-size: 11px; letter-spacing: .2em; color: var(--dim2); font-weight: 700; }",
    ".ms-card { width: 100%; text-align: left; padding: 12px 14px; margin-bottom: 8px; border-radius: 14px; border: 1px solid var(--line); background: rgba(255,253,248,.75); }",
    ".ms-card.on { border-color: var(--coral); background: #fff; box-shadow: 0 6px 16px rgba(196,92,74,.08); }",
    ".ms-name { font-size: 16px; font-weight: 800; letter-spacing: .08em; }",
    ".ms-sub { font-size: 12px; color: var(--dim); }",
    ".setup-input { width: 100%; min-height: 52px; border-radius: 12px; border: 1px solid var(--line2); background: #fffdf8; padding: 0 14px; font-size: 18px; font-weight: 700; letter-spacing: .08em; outline: none; }",
    ".setup-input:focus { border-color: var(--coral); }",
    ".setup-chips { display: flex; flex-wrap: wrap; gap: 8px; }",
    ".setup-switch { width: 52px; height: 32px; border-radius: 99px; border: 1px solid var(--line2); background: #efe6da; position: relative; }",
    ".setup-switch::after { content: ''; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; transition: transform .2s; }",
    ".setup-switch.on { background: var(--coral); border-color: transparent; }",
    ".setup-switch.on::after { transform: translateX(20px); }",
    ".setup-foot { margin-top: auto; padding-top: 16px; }"
  ].join("\n"));

  var SCALES = [
    { n: 1, name: "温柔", sub: "轻一点的贴纸" },
    { n: 2, name: "暧昧", sub: "有一点电流" },
    { n: 3, name: "热烈", sub: "热，但还留着余地" },
    { n: 4, name: "不设限", sub: "边界交给你们，随时可以合上" }
  ];
  var TAGS = ["喝酒", "蒙眼", "束缚", "道具", "露出", "角色"];
  var S = null;

  function names() {
    return {
      a: (S.a || "").trim().slice(0, 10) || "他",
      b: (S.b || "").trim().slice(0, 10) || "她"
    };
  }

  function render() {
    var step = S.step;
    var body = "";
    if (step === 1) {
      body =
        '<h2 class="title-lg">封面写上称呼</h2>' +
        '<p class="muted small mt-8">两个名字会变成贴在封面上的标签。</p>' +
        '<label class="setup-field mt-20"><span class="small dim">一个人</span>' +
        '<input class="setup-input mt-8" data-test="setup-name-a" maxlength="10" value="' + U.escape(S.a) + '" placeholder="他"></label>' +
        '<label class="setup-field mt-12"><span class="small dim">另一个人</span>' +
        '<input class="setup-input mt-8" data-test="setup-name-b" maxlength="10" value="' + U.escape(S.b) + '" placeholder="她"></label>';
    } else {
      var cards = SCALES.map(function (sc) {
        var on = S.maxStar === sc.n;
        return '<button type="button" class="ms-card' + (on ? " on" : "") + '" data-act="scale" data-n="' + sc.n + '" data-test="maxstar-' + sc.n + '">' +
          '<div class="ms-name">' + sc.name + "</div><div class=\"ms-sub\">" + sc.sub + "</div></button>";
      }).join("");
      var chips = TAGS.map(function (t) {
        var on = S.blacklist.indexOf(t) >= 0;
        return '<button type="button" class="chip' + (on ? " on" : "") + '" data-act="tag" data-tag="' + t + '" data-test="blacklist-' + t + '">' + t + "</button>";
      }).join("");
      var custom = S.blacklist.filter(function (t) { return TAGS.indexOf(t) < 0; }).map(function (t) {
        return '<button type="button" class="chip on" data-act="tag" data-tag="' + U.escape(t) + '">' + U.escape(t) + " ✕</button>";
      }).join("");
      body =
        '<h2 class="title-lg">尺度和边界</h2>' +
        '<p class="muted small mt-8">贴在封面里。越过上限的句子不会出现。</p>' +
        '<div class="mt-16">' + cards + "</div>" +
        '<div class="mt-8 small dim">不想抽到的话题</div>' +
        '<div class="setup-chips mt-8">' + chips + custom + "</div>" +
        '<div class="row gap-8 mt-12">' +
        '<input class="setup-input" id="kw" data-test="blacklist-input" maxlength="16" placeholder="自定义，比如某个词" style="min-height:44px;font-size:14px">' +
        '<button class="btn soft sm" data-act="add" data-test="blacklist-add">添加</button></div>' +
        '<div class="row gap-12 mt-16" style="align-items:center">' +
        '<div class="grow"><b>柔和模式</b><div class="small muted">只留 2 星以内，并避开束缚、露出、道具、喝酒、蒙眼。</div></div>' +
        '<button type="button" class="setup-switch' + (S.gentle ? " on" : "") + '" data-act="gentle" data-test="setup-gentle" aria-label="柔和模式"></button></div>';
    }
    var foot = step === 1
      ? '<button class="btn primary xl wide" data-act="next" data-test="setup-next">贴上尺度</button>'
      : '<button class="btn primary xl wide" data-act="start" data-test="setup-start">翻开第一页</button>';
    S.root.innerHTML =
      '<div class="page setup">' +
      '<div class="setup-top"><button class="icon-btn" data-act="back" aria-label="返回">←</button>' +
      '<div class="setup-brand">封面 · 0' + step + " / 02</div><div style=\"width:46px\"></div></div>" +
      '<div class="mt-12">' + body + "</div>" +
      '<div class="setup-foot">' + foot + "</div></div>";
  }

  function persistNames() {
    var a = S.root.querySelector('[data-test="setup-name-a"]');
    var b = S.root.querySelector('[data-test="setup-name-b"]');
    if (a) S.a = a.value;
    if (b) S.b = b.value;
  }

  function start() {
    persistNames();
    var n = names();
    var settings = App.Store.saveSettings({
      names: n,
      maxStar: S.maxStar,
      blacklist: S.blacklist.slice(),
      gentleOnly: !!S.gentle
    });
    var session = App.Engine.newSession({
      maxStar: settings.maxStar,
      blacklist: settings.blacklist,
      gentleOnly: !!settings.gentleOnly,
      sound: settings.sound !== false,
      haptics: settings.haptics !== false,
      reduced: !!settings.reduced
    }, n, Date.now() % 1000003);
    var pending = [];
    try { pending = App.Store.consumePending() || []; } catch (e) {}
    pending.forEach(function (p) {
      try { session = App.Engine.pasteExtra(session, p).state; } catch (err) {}
    });
    App.Store.saveSession(session);
    App.Router.reset("journey");
  }

  function onClick(e) {
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t || !S) return;
    var act = t.getAttribute("data-act");
    if (act === "back") {
      if (S.step === 2) { persistNames(); S.step = 1; render(); }
      else App.Router.back();
    } else if (act === "next") {
      persistNames();
      S.step = 2;
      render();
    } else if (act === "scale") {
      S.maxStar = parseInt(t.getAttribute("data-n"), 10) || 3;
      render();
    } else if (act === "tag") {
      var tag = t.getAttribute("data-tag");
      var i = S.blacklist.indexOf(tag);
      if (i >= 0) S.blacklist.splice(i, 1); else S.blacklist.push(tag);
      render();
    } else if (act === "add") {
      var input = S.root.querySelector("#kw");
      var v = input ? String(input.value || "").trim().slice(0, 16) : "";
      if (v && S.blacklist.indexOf(v) < 0) S.blacklist.push(v);
      render();
    } else if (act === "gentle") {
      S.gentle = !S.gentle;
      render();
    } else if (act === "start") start();
  }

  App.Screens = App.Screens || {};
  App.Screens.setup = {
    mount: function (root) {
      var saved = App.Store.getSettings();
      S = {
        root: root,
        step: 1,
        a: saved.names && saved.names.a || "",
        b: saved.names && saved.names.b || "",
        maxStar: saved.maxStar || 3,
        blacklist: (saved.blacklist || []).slice(),
        gentle: !!saved.gentleOnly
      };
      render();
      root.addEventListener("click", onClick);
      return function () { root.removeEventListener("click", onClick); S = null; };
    },
    unmount: function () {}
  };
})();

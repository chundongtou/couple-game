/* ===== 四款手帐小游戏：页内特殊格，也可以从游戏厅单独打开 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.UI.injectStyle("games", [
    ".g-top { display: flex; align-items: center; gap: 8px; min-height: 44px; }",
    ".bands { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }",
    ".band { text-align: left; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--line); background: rgba(255,253,248,.8); font-weight: 700; letter-spacing: .08em; }",
    ".band.on { background: var(--tape); border-color: #d7c48a; }",
    ".dial { position: relative; height: 220px; margin: 12px auto; width: 220px; }",
    ".dial-rotor { position: absolute; inset: 0; border-radius: 50%; border: 10px solid #fffdf8; background: conic-gradient(#f6efe4 0 12.5%, #e8d39a 0 25%, #f6efe4 0 37.5%, #f3d7cf 0 50%, #f6efe4 0 62.5%, #e8d39a 0 75%, #f6efe4 0 87.5%, #f3d7cf 0 100%);",
    "  box-shadow: 0 10px 24px rgba(80,50,20,.08); transition: transform 1s cubic-bezier(.15,.7,.1,1); }",
    ".dial-hub { position: absolute; left: 50%; top: 50%; width: 74px; height: 74px; margin: -37px 0 0 -37px; border-radius: 50%; background: var(--coral); color: #fffdf8; font-weight: 800; letter-spacing: .12em; }",
    ".needle { position: absolute; left: 50%; top: 8px; width: 4px; height: 46px; margin-left: -2px; background: var(--ink); border-radius: 4px; }",
    ".seg-list { display: flex; flex-direction: column; gap: 6px; }",
    ".seg { font-size: 13px; line-height: 1.45; padding: 8px 10px; border-radius: 10px; background: rgba(255,253,248,.65); color: var(--dim); }",
    ".seg.on { background: #fff; color: var(--ink); border: 1px solid var(--coral); }",
    ".map-path { display: flex; flex-direction: column; gap: 6px; }",
    ".tile { display: flex; gap: 8px; align-items: flex-start; padding: 8px 10px; border-radius: 12px; background: rgba(255,253,248,.7); border: 1px dashed var(--line); }",
    ".tile.on { border-style: solid; background: #fff; box-shadow: 0 6px 12px rgba(80,50,20,.05); }",
    ".token { flex: 0 0 auto; width: 36px; height: 36px; border-radius: 50%; background: var(--coral); color: #fffdf8; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }",
    ".token.empty { background: transparent; color: transparent; }"
  ].join("\n"));

  var ctx = null;

  function night() {
    try { return App.Store.getSession(); } catch (e) { return null; }
  }

  function state() { return ctx.standalone ? ctx.local : night(); }

  function save(s) {
    if (ctx.standalone) ctx.local = s;
    else App.Store.saveSession(s);
  }

  function leaveNight(s) {
    save(s);
    if (App.Router.depth() > 1) App.Router.back();
    else App.Router.reset("journey");
  }

  function spinDeg(index, n) {
    var slice = 360 / (n || 8);
    return 360 * 4 + index * slice;
  }

  function thermoHtml(s) {
    var g = s.game;
    var step = g.step;
    if (ctx.draftKey !== s.turn + ":" + step) {
      ctx.draftKey = s.turn + ":" + step;
      ctx.place = null;
      ctx.guess = null;
    }
    if (step === "result") {
      var la = g.bands[g.a.place].label;
      var lb = g.bands[g.b.place].label;
      return '<h1 class="spread-name" style="font-size:32px">揭晓</h1>' +
        '<p class="spread-sub">' + U.escape(s.names.a) + " 贴在「" + U.escape(la) + "」，" + U.escape(s.names.b) + " 贴在「" + U.escape(lb) + "」。</p>" +
        '<p>相差 ' + g.dist + " 档 · 升温 +" + g.gain + (g.imprint ? " · 对页印 +1" : "") + "</p>" +
        (g.exact ? '<p class="small muted mt-8">有人猜中了对方的那一档。</p>' : "") +
        '<button class="btn primary wide mt-16" data-act="thermo-keep" data-test="thermo-keep">贴上这一页</button>';
    }
    var who = step === "a" ? s.names.a : s.names.b;
    function bands(role, current) {
      return '<div class="bands">' + g.bands.map(function (b) {
        var on = current === b.id;
        return '<button type="button" class="band' + (on ? " on" : "") + '" data-act="band" data-role="' + role + '" data-i="' + b.id + '" data-test="band-' + role + "-" + b.id + '">' + U.escape(b.label) + "</button>";
      }).join("") + "</div>";
    }
    return '<h1 class="spread-name" style="font-size:32px">温度贴</h1>' +
      '<p class="spread-sub">递给 ' + U.escape(who) + "。先把自己的温度贴上，再猜对方会贴在哪一档。</p>" +
      '<div class="small dim mt-8">我贴在</div>' + bands("place", ctx.place) +
      '<div class="small dim mt-12">我猜对方贴在</div>' + bands("guess", ctx.guess) +
      '<button class="btn primary wide mt-16" data-act="thermo-commit" data-test="thermo-commit">扣下</button>';
  }

  function wheelHtml(s) {
    var g = s.game;
    var title = g.kind === "dare" ? "印章轮" : "贴纸轮";
    var deg = g.index >= 0 ? spinDeg(g.index, g.segments.length) : 0;
    var segs = g.segments.map(function (c, i) {
      return '<div class="seg' + (i === g.index ? " on" : "") + '">' + (i + 1) + " · " + U.escape(c.text) + "</div>";
    }).join("");
    var result = "";
    if (g.step === "spun" && g.segments[g.index]) {
      var card = g.segments[g.index];
      var who = g.who === "other" ? App.Journal.otherName(s, s.host) : App.Journal.nameOf(s, s.host);
      result = '<div class="' + (g.kind === "dare" ? "stamp-seal" : "stk") + '" style="--tilt:-1deg;margin:12px auto">' +
        (g.kind === "dare" ? U.escape(card.typeName) : '<span class="stk-kicker">给 ' + U.escape(who) + "</span>" + '<span class="stk-text">' + U.escape(card.text) + "</span>") +
        "</div>" +
        (g.kind === "dare" ? '<p class="mt-12" style="text-align:center">' + U.escape(card.text) + "</p>" : "") +
        '<div class="row gap-8 mt-12">' +
        '<button class="btn primary grow" data-act="wheel-keep" data-test="wheel-keep">' + (g.kind === "dare" ? "盖上印章" : "贴上") + "</button>" +
        '<button class="btn ghost" data-act="wheel-reroll" data-test="wheel-reroll">重拨 · 1 胶带</button></div>' +
        '<p class="tiny dim mt-8">重拨最多两次。现在还剩 ' + (s.tape || 0) + " 段，已重拨 " + (g.rerolls || 0) + " 次。</p>";
    }
    var spinBtns = g.step === "ready"
      ? '<div class="row gap-8 mt-8"><button class="btn primary grow" data-act="wheel-spin" data-who="self" data-test="wheel-self">自己拨</button>' +
        '<button class="btn soft grow" data-act="wheel-spin" data-who="other" data-test="wheel-other">递给对方</button></div>'
      : "";
    return '<h1 class="spread-name" style="font-size:32px">' + title + "</h1>" +
      (g.kind === "dare" ? '<p class="spread-sub">强度跟着今晚的温度走，目标大约 ' + (g.targetStar || 1) + " 星，不会一下跳很远。</p>" : '<p class="spread-sub">纸轮夹在本子上。自己拨，或让对方拨给你。</p>') +
      '<div class="dial"><div class="needle"></div><div class="dial-rotor" style="transform:rotate(' + deg + 'deg)"></div>' +
      '<button class="dial-hub" data-act="wheel-spin" data-who="self" type="button">拨</button></div>' +
      spinBtns + result +
      '<div class="seg-list mt-12">' + segs + "</div>";
  }

  function mapHtml(s) {
    var g = s.game;
    var seen = {};
    (g.log || []).forEach(function (row) { seen[row.pos] = row.card; });
    var tiles = g.tiles.map(function (card, i) {
      var on = g.pos === i;
      var known = seen[i];
      var text = known ? known.text : "走到这里再揭开";
      return '<div class="tile' + (on ? " on" : "") + '"><div class="token' + (on ? "" : " empty") + '">我们</div><div><b>第 ' + (i + 1) + " 格</b><div class=\"small\">" + U.escape(text) + "</div></div></div>";
    }).join("");
    var btn = g.step === "walk"
      ? '<button class="btn primary wide mt-12" data-act="map-roll" data-test="map-roll">一起走一步</button>'
      : '<button class="btn primary wide mt-12" data-act="map-keep" data-test="map-keep">把走过的格子贴上</button>';
    var last = g.log && g.log.length ? g.log[g.log.length - 1] : null;
    return '<h1 class="spread-name" style="font-size:32px">地图贴</h1>' +
      '<p class="spread-sub">一枚「我们」。走到哪一格，就把那一格的事贴进今晚。</p>' +
      (last ? '<p class="small mt-8">这一步走了 ' + last.step + " 格。</p>" : "") +
      '<div class="map-path mt-12">' + tiles + "</div>" + btn;
  }

  function doneHtml(s) {
    var p = s.arcadePaste || {};
    var face = p.game === "dare"
      ? '<div style="text-align:center"><div class="stamp-seal">' + U.escape(p.title || "印章") + '</div><p class="mt-16" style="text-align:left">' + U.escape(p.text || "") + "</p></div>"
      : '<div class="stk" style="--tilt:-1deg"><span class="stk-kicker">' + U.escape(p.title || "") + '</span><span class="stk-text">' + U.escape(p.text || "") + "</span></div>";
    return '<h1 class="spread-name" style="font-size:32px">可以贴上了</h1>' +
      face +
      '<button class="btn primary wide mt-16" data-act="paste-night" data-test="paste-night"' + (ctx.pasted ? " disabled" : "") + ">" + (ctx.pasted ? "已经贴上" : "贴进今晚的手帐") + "</button>" +
      '<button class="btn ghost wide mt-8" data-act="replay" data-test="game-replay">再玩一次</button>';
  }

  function render() {
    var s = state();
    if (!s) { App.Router.reset("arcade"); return; }
    var body = "";
    if (s.phase === "arcadeDone") body = doneHtml(s);
    else if (!s.game) body = "<p>这一格已经贴好了。</p>";
    else if (s.game.kind === "thermo") body = thermoHtml(s);
    else if (s.game.kind === "truth" || s.game.kind === "dare") body = wheelHtml(s);
    else if (s.game.kind === "map") body = mapHtml(s);
    var back = ctx.standalone ? "游戏厅" : "回到这一页";
    ctx.root.innerHTML =
      '<div class="page book">' +
      '<div class="g-top"><button class="icon-btn" data-act="back" aria-label="返回">←</button>' +
      '<div class="book-kicker">' + (ctx.standalone ? "游戏厅" : "这一页里") + "</div></div>" +
      body +
      '<button class="btn ghost wide mt-16" data-act="back">' + back + "</button></div>";
  }

  function apply(ret, done) {
    if (!ret || !ret.state) return;
    App.Journal.toastEvents(ret.events);
    if (!ctx.standalone && ret.state.phase !== "minigame" && ret.state.phase !== "arcadeDone") {
      leaveNight(ret.state);
      return;
    }
    save(ret.state);
    if (done && !ctx.standalone) leaveNight(ret.state);
    else render();
  }

  function onClick(e) {
    var t = e.target.closest && e.target.closest("[data-act]");
    if (!t || !ctx) return;
    var act = t.getAttribute("data-act");
    var s = state();
    if (act === "back") {
      if (ctx.standalone) {
        if (App.Router.depth() > 1) App.Router.back();
        else App.Router.reset("arcade");
      } else if (App.Router.depth() > 1) App.Router.back();
      else App.Router.reset("journey");
      return;
    }
    if (!s) return;
    if (act === "band") {
      var role = t.getAttribute("data-role");
      var i = parseInt(t.getAttribute("data-i"), 10);
      if (role === "place") ctx.place = i; else ctx.guess = i;
      render();
      return;
    }
    if (act === "thermo-commit") {
      if (ctx.place === null || ctx.guess === null) { App.UI.toast("先选自己的档，再猜对方", { kind: "rose" }); return; }
      apply(App.Engine.thermoCommit(s, { place: ctx.place, guess: ctx.guess }));
      return;
    }
    if (act === "thermo-keep") { apply(App.Engine.thermoKeep(s), true); return; }
    if (act === "wheel-spin") { apply(App.Engine.wheelSpin(s, { who: t.getAttribute("data-who") || "self" })); return; }
    if (act === "wheel-reroll") { apply(App.Engine.wheelSpin(s, { who: (s.game && s.game.who) || "self", reroll: true })); return; }
    if (act === "wheel-keep") { apply(App.Engine.wheelKeep(s), true); return; }
    if (act === "map-roll") { apply(App.Engine.mapRoll(s)); return; }
    if (act === "map-keep") { apply(App.Engine.mapKeep(s), true); return; }
    if (act === "paste-night") {
      var paste = s.arcadePaste;
      if (!paste || ctx.pasted) return;
      var open = night();
      if (open && open.pages) {
        var r = App.Engine.pasteExtra(open, paste);
        App.Store.saveSession(r.state);
        App.UI.toast("贴进今晚的页边了");
      } else {
        App.Store.addPending(paste);
        App.UI.toast("先夹在书里。翻开手帐时会贴到页边");
      }
      ctx.pasted = true;
      render();
      return;
    }
    if (act === "replay") {
      var kind = (s.game && s.game.kind) || (s.arcadePaste && s.arcadePaste.game) || ctx.kind;
      var settings = App.Store.getSettings();
      var heat = 0;
      var openNight = night();
      if (openNight && typeof openNight.heat === "number" && openNight.phase !== "poster") heat = openNight.heat;
      ctx.local = App.Engine.openArcade(kind, settings, settings.names, Date.now() % 1000003, { heat: heat });
      ctx.pasted = false;
      ctx.draftKey = "";
      render();
    }
  }

  App.Screens = App.Screens || {};
  App.Screens.game = {
    mount: function (root, params) {
      params = params || {};
      ctx = { root: root, standalone: !!params.standalone, kind: params.kind || "thermo", local: null, pasted: false, place: null, guess: null, draftKey: "" };
      if (ctx.standalone) {
        var settings = App.Store.getSettings();
        var open = night();
        var heat = open && open.pages && open.phase !== "poster" ? (open.heat || 0) : 0;
        ctx.local = App.Engine.openArcade(ctx.kind, settings, settings.names, Date.now() % 1000003, { heat: heat });
      } else {
        var s = night();
        if (!s || s.phase !== "minigame") {
          setTimeout(function () { App.Router.go("journey", {}, { replace: true }); }, 0);
          return;
        }
      }
      root.addEventListener("click", onClick);
      render();
      return function () { root.removeEventListener("click", onClick); ctx = null; };
    },
    unmount: function () {}
  };
})();

/* ===== 今晚这一页 · 对页 ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var J = function () { return App.Journal; };

  var armedKey = "";
  var pairTurn = -1;
  var pairChoice = { a: "paste", b: "paste" };

  function keyOf(s) {
    return [s.phase, s.turn, s.secretWho || "", s.slot].join(":");
  }

  function session() {
    try { return App.Store.getSession(); } catch (e) { return null; }
  }

  function apply(ret) {
    var state = J().commit(ret);
    if (!state) return;
    var phase = state.phase;
    if (phase === "poster" || phase === "shop" || phase === "minigame") return;
    armedKey = "";
    render();
  }

  var rootEl = null;

  function handOf(s) {
    if (s.phase === "secret1" || s.phase === "secret2") {
      var who = s.secretWho;
      return (s.hands && s.hands[who]) || [];
    }
    return s.hand || [];
  }

  function passHtml(title, sub) {
    return '<div class="pass-card">' +
      '<div class="kicker">把手机递过去</div>' +
      "<h3>" + U.escape(title) + "</h3>" +
      '<p class="muted small">' + sub + "</p>" +
      '<button class="btn primary wide mt-16" data-act="arm" data-test="pass-ready">翻开贴纸</button></div>';
  }

  function actionHtml(s) {
    var phase = s.phase;
    var host = J().nameOf(s, s.host);
    var mate = J().otherName(s, s.host);
    if (phase === "minigame") {
      var g = (s.game && App.Balance.GAMES && App.Balance.GAMES[s.game.kind]) || { name: "这一格", hall: "这一格是手帐里的小游戏。" };
      return '<div class="pass-card"><div class="kicker">特殊格</div><h3>' + U.escape(g.name) + "</h3>" +
        '<p class="muted small">' + U.escape(g.hall || "这一格是手帐里的小游戏。") + "</p>" +
        '<button class="btn primary wide mt-16" data-act="open-game" data-test="open-game">打开这一格</button></div>';
    }
    if (phase === "choose" || phase === "secret1" || phase === "secret2" || phase === "do") {
      if (armedKey !== keyOf(s)) {
        if (phase === "choose") return passHtml(host, "从三张贴纸里挑一张，递给 " + mate + "。");
        if (phase === "do") return passHtml(mate, host + " 挑好了一张。看完可以贴上，也可以撕掉。");
        var who = J().nameOf(s, s.secretWho);
        return passHtml(who, "这一格是对贴。你自己的三张，先别给对方看。");
      }
    }
    if (phase === "choose" || phase === "secret1" || phase === "secret2") {
      var list = handOf(s).map(function (card, i) {
        return J().stickerButton(card, i, "sticker-" + i);
      }).join("");
      var hint = phase === "choose"
        ? host + " 挑一张递给 " + mate + "。"
        : J().nameOf(s, s.secretWho) + " 扣下一张。";
      return '<div class="kicker">' + (phase === "choose" ? "自选贴" : "对贴") + '</div>' +
        '<p class="small muted mt-8 mb-12">' + U.escape(hint) + "</p>" +
        '<div class="stk-list">' + list + "</div>";
    }
    if (phase === "do" && s.current) {
      return '<div class="stk" style="--tilt:-1deg"><i class="stk-tape"></i>' +
        '<span class="stk-kicker">' + U.escape(s.current.typeName || "贴纸") + " · " + s.current.star + " 星</span>" +
        '<span class="stk-text">' + U.escape(s.current.text) + "</span></div>" +
        '<input class="note-input" id="note" maxlength="40" placeholder="想的话，盖一句短注" data-test="note">' +
        '<div class="row gap-8 mt-12">' +
        '<button class="btn primary grow" data-act="paste" data-test="play-paste">贴上</button>' +
        '<button class="btn ghost" data-act="peel" data-test="play-peel">撕掉</button></div>' +
        '<p class="tiny dim mt-8">撕掉会留下胶痕，不扣升温，也不会卡住这一页。</p>';
    }
    if (phase === "reveal") {
      if (s.turn !== pairTurn) {
        pairTurn = s.turn;
        pairChoice = { a: "paste", b: "paste" };
      }
      var mark = (App.Balance.MARKS && App.Balance.MARKS[s.pairMark]) || { name: "揭晓", note: "" };
      function side(who) {
        var card = s.picks[who];
        var choice = pairChoice[who];
        return '<div class="stk" style="--tilt:' + (who === "a" ? -1.5 : 1.5) + 'deg">' +
          '<span class="stk-kicker">' + U.escape(J().nameOf(s, who)) + "</span>" +
          '<span class="stk-text">' + U.escape(card.text) + "</span>" +
          '<button class="btn sm ' + (choice === "peel" ? "danger" : "soft") + ' mt-8" data-act="toggle" data-who="' + who + '" data-test="pair-' + who + '">' +
          (choice === "peel" ? "这张撕掉" : "这张贴上") + "</button></div>";
      }
      return '<div class="kicker">对贴揭晓</div>' +
        '<div class="mark-flag" data-test="pair-mark">' + U.escape(mark.name) + "</div>" +
        '<p class="small muted">' + U.escape(mark.note) + "</p>" +
        '<div class="pair-board mt-12">' + side("a") + side("b") + "</div>" +
        '<input class="note-input" id="note" maxlength="40" placeholder="给这一对盖一句短注">' +
        '<button class="btn primary wide mt-12" data-act="resolve" data-test="pair-resolve">就这样贴上</button>';
    }
    if (phase === "stackOffer") {
      return '<div class="pass-card"><div class="kicker">叠贴</div><h3>要不要再叠一张</h3>' +
        '<p class="muted small">更深的一层，不是每格都有。不叠也完全可以。</p>' +
        '<div class="row gap-8 mt-16">' +
        '<button class="btn primary grow" data-act="stack-yes" data-test="stack-yes">叠一张</button>' +
        '<button class="btn ghost" data-act="stack-no" data-test="stack-no">先不叠</button></div></div>';
    }
    if (phase === "stackDo" && s.stackCard) {
      return '<div class="stk" style="--tilt:1.2deg"><i class="stk-tape"></i>' +
        '<span class="stk-kicker">更深一层 · ' + s.stackCard.star + " 星</span>" +
        '<span class="stk-text">' + U.escape(s.stackCard.text) + "</span></div>" +
        '<div class="row gap-8 mt-12">' +
        '<button class="btn primary grow" data-act="stack-paste" data-test="stack-paste">叠上</button>' +
        '<button class="btn ghost" data-act="stack-peel" data-test="stack-peel">揭走</button></div>' +
        '<p class="tiny dim mt-8">揭走只留下一点胶，底下那张还在。</p>';
    }
    return '<p class="muted">这一页先停在这里。</p>';
  }

  function render() {
    if (!rootEl) return;
    var s = session();
    if (!s) { App.Router.reset("boot"); return; }
    if (s.phase === "poster" || s.phase === "shop") { J().route(s); return; }
    var sp = J().spread(s);
    var mode = s.mode === "pair" ? "对贴" : s.mode === "game" ? "特殊格" : s.mode === "pick" ? "自选贴" : "";
    rootEl.innerHTML =
      '<div class="page book">' +
      '<div class="book-top">' +
      '<button class="icon-btn" data-act="cover" aria-label="回封面">←</button>' +
      '<div class="book-kicker">今晚这一页</div>' +
      '<div class="book-step" data-test="spread-index">' + s.spread + " / 3</div></div>" +
      J().flowHtml(s.spread) +
      '<h1 class="spread-name">' + U.escape(sp.name) + "</h1>" +
      '<p class="spread-sub">' + U.escape(sp.sub) + (mode ? " · " + mode : "") + "</p>" +
      J().marginHtml(s) +
      J().gridHtml(s) +
      '<section class="act" data-test="play-panel">' + actionHtml(s) + "</section>" +
      "</div>";
  }

  function onClick(e) {
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) return;
    var s = session();
    if (!s) return;
    var act = t.getAttribute("data-act");
    if (act === "cover") { App.Router.reset("boot"); return; }
    if (act === "arm") { armedKey = keyOf(s); render(); return; }
    if (act === "open-game") { App.Router.go("game"); return; }
    if (act === "pick") {
      var i = parseInt(t.getAttribute("data-i"), 10) || 0;
      if (s.phase === "choose") apply(App.Engine.chooseSticker(s, i));
      else apply(App.Engine.lockSecret(s, i));
      return;
    }
    if (act === "paste") {
      var note = (rootEl.querySelector("#note") || {}).value || "";
      apply(App.Engine.paste(s, note));
      return;
    }
    if (act === "peel") { apply(App.Engine.peel(s)); return; }
    if (act === "toggle") {
      var who = t.getAttribute("data-who");
      if (pairChoice[who]) pairChoice[who] = pairChoice[who] === "peel" ? "paste" : "peel";
      render();
      return;
    }
    if (act === "resolve") {
      var note2 = (rootEl.querySelector("#note") || {}).value || "";
      apply(App.Engine.resolvePair(s, { a: pairChoice.a, b: pairChoice.b, note: note2 }));
      return;
    }
    if (act === "stack-yes") { apply(App.Engine.acceptStack(s)); return; }
    if (act === "stack-no") { apply(App.Engine.declineStack(s)); return; }
    if (act === "stack-paste") { apply(App.Engine.pasteStack(s)); return; }
    if (act === "stack-peel") { apply(App.Engine.peelStack(s)); return; }
  }

  App.Screens = App.Screens || {};
  App.Screens.journey = {
    mount: function (root) {
      rootEl = root;
      armedKey = "";
      root.addEventListener("click", onClick);
      render();
      return function () { root.removeEventListener("click", onClick); if (rootEl === root) rootEl = null; };
    },
    unmount: function () {}
  };
})();

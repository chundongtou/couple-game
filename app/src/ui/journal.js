/* ===== 今晚这一页 · 手帐共用壳 ===== */
(function () {
  var App = window.App;
  var U = App.util;

  App.UI.injectStyle("journal", [
    ".tape-title { display: inline-block; background: var(--tape); padding: 4px 10px; transform: rotate(-2deg); font-size: 12px; letter-spacing: .18em; font-weight: 800; }",
    ".book-top { display: flex; align-items: center; gap: 10px; min-height: 44px; }",
    ".book-kicker { flex: 1; text-align: center; font-size: 12px; letter-spacing: .22em; color: var(--dim); font-weight: 700; }",
    ".book-step { font-size: 12px; color: var(--dim2); letter-spacing: .08em; min-width: 44px; text-align: right; }",
    ".spread-name { margin: 14px 0 4px; font-size: clamp(32px, 9vw, 42px); font-weight: 800; letter-spacing: .12em; line-height: 1.05; }",
    ".spread-sub { color: var(--dim); font-size: 13px; letter-spacing: .04em; margin-bottom: 14px; }",
    ".margin-row { display: grid; grid-template-columns: 1.4fr .8fr .8fr; gap: 8px; margin: 8px 0 14px; }",
    ".margin-card { background: rgba(255,253,248,.7); border: 1px dashed var(--line2); border-radius: 12px; padding: 8px 10px; }",
    ".margin-card em { display: block; font-style: normal; font-size: 11px; letter-spacing: .16em; color: var(--dim2); }",
    ".margin-card b { display: block; margin-top: 2px; font-size: 20px; letter-spacing: .04em; font-variant-numeric: tabular-nums; }",
    ".heat-tape { margin-top: 6px; height: 8px; border-radius: 99px; background: rgba(42,36,28,.06); overflow: hidden; }",
    ".heat-tape i { display: block; height: 100%; width: 0; background: linear-gradient(90deg, var(--tape), var(--coral)); border-radius: inherit; }",
    ".slot-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }",
    ".cell { min-height: 86px; border-radius: 12px; padding: 8px; position: relative; overflow: hidden;",
    "  background: rgba(255,253,248,.45); border: 1px dashed #e4d7c6; color: var(--dim2); }",
    ".cell.empty span { position: absolute; right: 8px; bottom: 6px; font-size: 11px; letter-spacing: .08em; }",
    ".cell.filled, .cell.pair, .cell.sticker, .cell.stamp, .cell.thermo, .cell.map {",
    "  background: #fffdf8; border: 1px solid #eadfce; color: var(--ink); box-shadow: 0 6px 14px rgba(80,50,20,.06);",
    "  transform: rotate(var(--tilt, -1.5deg)); animation: stkIn .42s var(--ease-out); }",
    ".cell b { display: block; font-size: 11px; letter-spacing: .08em; color: var(--coral); font-weight: 800; }",
    ".cell span { display: block; margin-top: 4px; font-size: 11.5px; line-height: 1.45; color: var(--ink); }",
    ".cell.residue { background: repeating-linear-gradient(-45deg, rgba(232,211,154,.35), rgba(232,211,154,.35) 6px, rgba(255,253,248,.2) 6px, rgba(255,253,248,.2) 12px);",
    "  border-style: dashed; color: var(--dim); transform: none; }",
    ".cell.residue span { color: var(--dim); font-size: 12px; letter-spacing: .12em; }",
    ".cell.stamp { border: 2px solid var(--coral); color: var(--coral); border-radius: 50%; }",
    ".cell.stamp b, .cell.stamp span { color: var(--coral); }",
    ".extras { margin-top: 10px; display: flex; flex-direction: column; gap: 6px; }",
    ".extra { font-size: 12px; line-height: 1.5; padding: 8px 10px; background: rgba(255,253,248,.8); border-left: 3px solid var(--mustard); color: var(--ink); }",
    ".act { margin-top: 16px; }",
    ".pass-card { padding: 22px 18px; text-align: center; background: #fffdf8; border: 1px solid var(--line); border-radius: 18px; box-shadow: var(--sh-1); }",
    ".pass-card h3 { font-size: 22px; letter-spacing: .08em; margin: 8px 0; }",
    ".stk-list { display: flex; flex-direction: column; gap: 10px; }",
    ".stk { position: relative; text-align: left; width: 100%; padding: 16px 14px 14px; border-radius: 14px; background: #fffdf8;",
    "  border: 1px solid #eadfce; box-shadow: 0 8px 16px rgba(80,50,20,.06); transform: rotate(var(--tilt, -1deg));",
    "  animation: stkIn .45s var(--ease-out); }",
    ".stk:active { transform: rotate(var(--tilt, -1deg)) scale(.985); }",
    ".stk-tape { position: absolute; left: 18px; top: -7px; width: 54px; height: 16px; background: var(--tape); opacity: .9; transform: rotate(-2deg); border-radius: 2px; }",
    ".stk-kicker { display: block; font-size: 11px; letter-spacing: .14em; color: var(--coral); font-weight: 800; }",
    ".stk-text { display: block; margin-top: 6px; font-size: 15.5px; line-height: 1.55; color: var(--ink); white-space: pre-wrap; }",
    ".note-input { width: 100%; margin-top: 10px; min-height: 46px; border-radius: 12px; border: 1px dashed var(--line2); background: rgba(255,253,248,.8); padding: 0 12px; font-size: 14px; outline: none; }",
    ".note-input:focus { border-color: var(--coral); }",
    ".pair-board { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }",
    ".mark-flag { display: inline-block; margin: 8px 0; padding: 4px 10px; border: 1.5px solid var(--coral); color: var(--coral); border-radius: 99px; letter-spacing: .14em; font-size: 12px; font-weight: 800; transform: rotate(-2deg); }",
    "@keyframes stkIn { from { opacity: 0; transform: translateY(-12px) rotate(calc(var(--tilt, 0deg) - 6deg)); } to { opacity: 1; transform: translateY(0) rotate(var(--tilt, 0deg)); } }",
    "@keyframes stampIn { 0% { transform: rotate(-8deg) scale(1.4); opacity: .2; } 100% { transform: rotate(-6deg) scale(1); opacity: 1; } }",
    ".stamp-seal { display: inline-flex; align-items: center; justify-content: center; width: 148px; height: 148px; border-radius: 50%; border: 3px solid var(--coral); color: var(--coral);",
    "  font-weight: 800; letter-spacing: .14em; text-align: center; line-height: 1.35; transform: rotate(-8deg); animation: stampIn .35s var(--ease-out); }",
    ".poster { background: #fffdf8; border: 1px solid #eadfce; border-radius: 18px; padding: 22px 18px 18px; box-shadow: 0 16px 36px rgba(80,50,20,.1); }",
    ".mini-row { display: flex; gap: 4px; margin-top: 6px; }",
    ".mini-dot { width: 14px; height: 18px; border-radius: 3px; background: #efe4d4; }",
    ".mini-dot.on { background: var(--tape); }",
    ".mini-dot.glue { background: repeating-linear-gradient(-45deg, #e8d39a, #e8d39a 2px, #f6efe4 2px, #f6efe4 4px); }",
    ".flow { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0 12px; color: var(--dim2); font-size: 11px; letter-spacing: .06em; }",
    ".flow i { font-style: normal; padding: 3px 6px; border-radius: 6px; background: rgba(255,253,248,.7); border: 1px solid var(--line); }",
    ".flow i.on { color: var(--coral); border-color: rgba(196,92,74,.45); background: #fff; }",
    "body.reduce .cell.filled, body.reduce .stk, body.reduce .stamp-seal { animation: none; }"
  ].join("\n"));

  function esc(s) { return U.escape(s); }

  function nameOf(state, who) {
    var names = (state && state.names) || {};
    return names[who] || (who === "b" ? "她" : "他");
  }

  function other(who) { return who === "a" ? "b" : "a"; }

  function toastEvents(events) {
    if (!events) return;
    for (var i = 0; i < events.length; i++) {
      var e = events[i];
      if (e.blocked) {
        var why = e.reason === "tape" ? "胶带不够" : e.reason === "reroll-max" ? "这一轮不能再重拨了" : "这一步还不能做";
        App.UI.toast(why, { kind: "rose" });
      } else if (e.type === "heat" && e.delta) {
        App.UI.toast("升温 " + (e.delta > 0 ? "+" : "") + e.delta, { kind: "gold" });
      } else if (e.type === "imprint" && e.delta) {
        App.UI.toast("对页印 +" + e.delta, { kind: "gold" });
      }
    }
  }

  function route(state) {
    var phase = state && state.phase;
    if (!state) { App.Router.reset("boot"); return; }
    if (phase === "poster") App.Router.go("finale", {}, { replace: App.Router.current() === "finale" });
    else if (phase === "shop") App.Router.go("shop", {}, { replace: App.Router.current() === "shop" });
    else if (phase === "minigame") App.Router.go("game");
    else App.Router.go("journey", {}, { replace: App.Router.current() === "journey" });
  }

  function commit(ret) {
    var state = ret && ret.state ? ret.state : ret;
    try { App.Store.saveSession(state); } catch (e) {}
    toastEvents(ret && ret.events);
    var phase = state && state.phase;
    if (phase === "poster" || phase === "shop" || phase === "minigame") route(state);
    return state;
  }

  function heatWidth(heat) {
    if (!heat) return 0;
    return Math.max(8, Math.min(100, Math.round(heat / 32 * 100)));
  }

  function marginHtml(state) {
    return '<div class="margin-row">' +
      '<div class="margin-card"><em>升温</em><b data-test="heat">' + (state.heat || 0) + '</b><div class="heat-tape"><i style="width:' + heatWidth(state.heat) + '%"></i></div></div>' +
      '<div class="margin-card"><em>对页印</em><b data-test="imprint">' + (state.imprint || 0) + "</b></div>" +
      '<div class="margin-card"><em>胶带</em><b data-test="tape">' + (state.tape || 0) + "</b></div>" +
      "</div>";
  }

  function slotHtml(slot, i) {
    if (!slot || slot.kind === "empty") {
      return '<div class="cell empty" data-test="slot-' + i + '"><span>' + (i + 1) + "</span></div>";
    }
    if (slot.kind === "residue") {
      return '<div class="cell residue" data-test="slot-' + i + '"><span>胶痕</span></div>';
    }
    var text = String(slot.text || "").split("\n")[0];
    if (text.length > 26) text = text.slice(0, 26) + "…";
    var tilt = slot.tilt || (i % 2 ? 1.4 : -1.6);
    return '<div class="cell filled ' + esc(slot.kind) + '" style="--tilt:' + tilt + 'deg" data-test="slot-' + i + '"><b>' +
      esc(slot.title || "贴纸") + "</b><span>" + esc(text) + "</span></div>";
  }

  function gridHtml(state) {
    var page = state.pages[state.spread - 1];
    var cells = "";
    for (var i = 0; i < page.slots.length; i++) cells += slotHtml(page.slots[i], i);
    var extras = (page.extras || []).map(function (ex) {
      var line = String(ex.text || "").split("\n")[0];
      return '<div class="extra"><b>' + esc(ex.title || "页边") + "</b> " + esc(line) + "</div>";
    }).join("");
    return '<div class="slot-grid" data-test="slot-grid">' + cells + "</div>" +
      (extras ? '<div class="extras">' + extras + "</div>" : "");
  }

  function stickerButton(card, i, test) {
    var tilt = i % 2 === 0 ? -1.4 : 1.5;
    return '<button type="button" class="stk" style="--tilt:' + tilt + 'deg" data-act="pick" data-i="' + i + '" data-test="' + test + '">' +
      '<i class="stk-tape"></i>' +
      '<span class="stk-kicker">' + esc(card.typeName || "贴纸") + " · " + card.star + " 星</span>" +
      '<span class="stk-text">' + esc(card.text) + "</span></button>";
  }

  function flowHtml(spread) {
    var bits = [
      ["封面", 0],
      ["热身", 1],
      ["店", 1.5],
      ["升温", 2],
      ["店", 2.5],
      ["靠近", 3],
      ["封底", 4]
    ];
    return '<div class="flow">' + bits.map(function (b) {
      var on = (b[1] === spread) || (spread > 3 && b[1] === 4);
      return "<i" + (on ? ' class="on"' : "") + ">" + b[0] + "</i>";
    }).join('<span class="arrow">→</span>') + "</div>";
  }

  App.Journal = {
    esc: esc,
    nameOf: nameOf,
    otherName: function (state, who) { return nameOf(state, other(who)); },
    toastEvents: toastEvents,
    route: route,
    commit: commit,
    marginHtml: marginHtml,
    gridHtml: gridHtml,
    stickerButton: stickerButton,
    flowHtml: flowHtml,
    spread: function (state) {
      var list = (App.Balance && App.Balance.SPREADS) || [];
      for (var i = 0; i < list.length; i++) if (list[i].id === state.spread) return list[i];
      return { name: "这一页", sub: "" };
    }
  };
})();

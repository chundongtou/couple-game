/* =============================================================================
 * V3 ui/screens/shop.js —— 幕间星屑商店
 * -----------------------------------------------------------------------------
 * 契约：App.Screens.shop = { mount(root, params), unmount() }
 * 数据：App.Engine.shopOffers(st) / shopBuy(st, id)；价格与效果权威在 App.Balance
 * 出口：shop-leave → 回 act（或 journey）
 * ========================================================================== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;
  var UI = App.UI;
  var B = App.Balance;

  var cleanups = [];
  var lastRes = null;

  var ITEM_UI = {
    shield: { tint: "#7ce0cf", glow: "rgba(124,224,207,.22)", tag: "挡一次负面结算", unit: "张" },
    reroll: { tint: "#9a7cff", glow: "rgba(154,124,255,.22)", tag: "重抽整手三张", unit: "张" },
    escalate: { tint: "#ff9e5e", glow: "rgba(255,158,94,.22)", tag: "满星也能深潜一次", unit: "张" },
    heart: { tint: "#ff5f9e", glow: "rgba(255,95,158,.22)", tag: "立刻 +1 心动", unit: "颗" }
  };

  UI.injectStyle("shop", [
    ".shp { position: relative; isolation: isolate; overflow: hidden; }",
    ".shp-atmos { position: absolute; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }",
    ".shp-atmos::before { content: ''; position: absolute; left: 50%; top: -8%; width: 150vw; height: 76vw; transform: translateX(-50%);",
    "  background: radial-gradient(closest-side, rgba(243,200,121,.16), transparent 72%); filter: blur(16px); }",
    ".shp-atmos::after { content: ''; position: absolute; left: 50%; bottom: -6%; width: 130vw; height: 60vw; transform: translateX(-50%);",
    "  background: radial-gradient(closest-side, rgba(154,124,255,.14), transparent 72%); filter: blur(18px); }",
    ".shp-speck { position: absolute; width: 2px; height: 2px; border-radius: 50%; background: #fff; opacity: .3;",
    "  box-shadow: 0 0 8px rgba(255,255,255,.5); animation: shpTwinkle 8s ease-in-out infinite alternate; }",
    "@keyframes shpTwinkle { from { opacity: .12; } to { opacity: .5; } }",

    ".shp-rise { opacity: 0; animation: shpRise .62s var(--ease-out) both; animation-delay: var(--d, 0ms); }",
    "@keyframes shpRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }",
    "body.reduce .shp-rise { animation-name: shpFadeIn !important; animation-duration: .2s !important; animation-delay: 0ms !important; }",
    "@keyframes shpFadeIn { from { opacity: 0; } to { opacity: 1; } }",

    /* 顶栏 */
    ".shp-top { display: flex; align-items: center; justify-content: space-between; min-height: 44px; }",
    ".shp-back { width: 44px; height: 44px; border-radius: 50%; background: var(--glass); border: 1px solid var(--line);",
    "  color: var(--dim); font-size: 17px; display: grid; place-items: center; transition: transform var(--t-fast); }",
    ".shp-back:active { transform: scale(.9); }",
    ".shp-top .k { font-size: 10.5px; letter-spacing: .30em; color: var(--dim2); font-weight: 700; }",
    ".shp-hold { min-width: 42px; text-align: right; }",

    /* 标题 + 余额 */
    ".shp-hero { margin-top: 14px; text-align: center; }",
    ".shp-kicker { display: inline-flex; align-items: center; gap: 8px; }",
    ".shp-kicker .ln { width: 20px; height: 1px; background: var(--gold); opacity: .8; }",
    ".shp-title { margin-top: 10px; font-size: 30px; font-weight: 900; letter-spacing: .12em; }",
    ".shp-title .g { background: linear-gradient(100deg, #fff 8%, var(--gold) 56%, #ff9f6b 120%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }",
    ".shp-sub { margin-top: 8px; font-size: 12px; color: var(--dim2); letter-spacing: .06em; line-height: 1.7; }",
    ".shp-wallet { display: inline-flex; align-items: center; gap: 9px; margin-top: 16px; padding: 10px 20px 10px 16px; border-radius: 999px;",
    "  background: linear-gradient(135deg, rgba(243,200,121,.16), rgba(243,200,121,.05)); border: 1px solid rgba(243,200,121,.36);",
    "  box-shadow: 0 0 30px rgba(243,200,121,.12); }",
    ".shp-wallet i { font-style: normal; font-size: 16px; color: var(--gold); }",
    ".shp-wallet b { font-size: 24px; font-weight: 900; color: var(--gold); font-variant-numeric: tabular-nums; letter-spacing: .01em; line-height: 1; }",
    ".shp-wallet span { font-size: 10.5px; color: rgba(243,200,121,.75); letter-spacing: .14em; }",

    /* 行囊 */
    ".shp-bag { display: flex; align-items: center; gap: 8px; margin-top: 16px; padding: 10px 12px; border-radius: 16px;",
    "  background: var(--glass); border: 1px solid var(--line); }",
    ".shp-bag .k { flex: 0 0 auto; font-size: 10px; letter-spacing: .18em; color: var(--dim2); font-weight: 700; }",
    ".shp-bag .it { display: inline-flex; align-items: center; gap: 3px; font-size: 11.5px; color: var(--dim); font-variant-numeric: tabular-nums; }",
    ".shp-bag .it b { color: var(--ink); font-weight: 800; }",
    ".shp-bag .sp { flex: 1; }",

    /* 商品列表 */
    ".shp-list { display: flex; flex-direction: column; gap: 9px; margin-top: 14px; }",
    ".shp-item { position: relative; display: flex; align-items: center; gap: 13px; padding: 13px 13px 13px 12px; border-radius: 20px;",
    "  background: linear-gradient(150deg, rgba(255,255,255,.075), rgba(255,255,255,.02)); border: 1px solid var(--line);",
    "  transition: transform var(--t-fast) var(--ease), border-color var(--t-fast), background var(--t-fast); }",
    ".shp-item:active { transform: scale(.99); }",
    ".shp-item.afford { border-color: rgba(255,255,255,.16); }",
    ".shp-item.bought { animation: shpBought .5s var(--ease-out); }",
    "@keyframes shpBought { 0% { transform: scale(1); } 32% { transform: scale(1.022); } 100% { transform: scale(1); } }",
    ".shp-ico { position: relative; flex: 0 0 auto; width: 54px; height: 54px; border-radius: 17px; display: grid; place-items: center;",
    "  font-size: 24px; background: radial-gradient(circle at 32% 26%, var(--tint-soft, rgba(255,255,255,.12)), rgba(255,255,255,.02) 70%);",
    "  border: 1px solid rgba(255,255,255,.14); box-shadow: inset 0 1px 0 rgba(255,255,255,.14), 0 8px 20px rgba(0,0,0,.32); }",
    ".shp-ico::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; box-shadow: 0 0 22px var(--tint-glow, rgba(255,255,255,.08)); pointer-events: none; }",
    ".shp-body { flex: 1 1 auto; min-width: 0; }",
    ".shp-name { display: flex; align-items: center; gap: 7px; font-size: 14.5px; font-weight: 800; letter-spacing: .03em; }",
    ".shp-name .own { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 99px; font-size: 9.5px; font-weight: 800;",
    "  color: var(--dim); background: rgba(255,255,255,.07); border: 1px solid var(--line); letter-spacing: .04em; }",
    ".shp-desc { margin-top: 4px; font-size: 11.5px; color: var(--dim2); line-height: 1.55; letter-spacing: .01em; }",
    ".shp-buy { flex: 0 0 auto; display: flex; flex-direction: column; align-items: stretch; gap: 5px; min-width: 78px; }",
    ".shp-price { display: inline-flex; align-items: center; justify-content: center; gap: 3px; font-size: 12px; font-weight: 800;",
    "  color: var(--gold); font-variant-numeric: tabular-nums; }",
    ".shp-price i { font-style: normal; font-size: 11px; }",
    ".shp-buybtn { min-height: 44px; padding: 0 14px; border-radius: 999px; font-size: 12.5px; font-weight: 800; letter-spacing: .06em;",
    "  color: #2a0f1c; background: linear-gradient(135deg, var(--gold), #ffb27a); border: 0;",
    "  box-shadow: 0 6px 16px rgba(243,200,121,.22), inset 0 1px 0 rgba(255,255,255,.4);",
    "  transition: transform var(--t-fast) var(--ease), filter var(--t-fast), opacity var(--t-fast); }",
    ".shp-buybtn:active { transform: scale(.95); }",
    ".shp-buybtn.off { color: var(--dim2); background: rgba(255,255,255,.06); border: 1px solid var(--line); box-shadow: none; }",
    ".shp-buybtn.done { color: var(--gold); background: rgba(243,200,121,.10); border: 1px solid rgba(243,200,121,.4); box-shadow: none; }",

    /* 底部 */
    ".shp-spacer { flex: 1 1 auto; min-height: 16px; }",
    ".shp-note { margin-bottom: 10px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; line-height: 1.7; }",
    ".shp-note b { color: var(--dim); }",
    ".shp-foot { display: flex; flex-direction: column; gap: 9px;",
    "  /* 左下角留给全局「停」安全词胶囊（core/safe.js） */",
    "  padding-left: 58px; }",

    "@media (max-height: 730px) {",
    "  .shp-hero { margin-top: 6px; }",
    "  .shp-kicker .kicker { font-size: 9.5px; }",
    "  .shp-title { margin-top: 6px; font-size: 24px; letter-spacing: .10em; }",
    "  .shp-sub { display: none; }",
    "  .shp-wallet { margin-top: 8px; padding: 6px 16px 6px 13px; }",
    "  .shp-wallet b { font-size: 19px; }",
    "  .shp-wallet i { font-size: 13px; }",
    "  .shp-bag { margin-top: 8px; padding: 7px 10px; border-radius: 13px; }",
    "  .shp-list { margin-top: 8px; gap: 6px; }",
    "  .shp-item { padding: 7px 9px; gap: 9px; border-radius: 16px; }",
    "  .shp-ico { width: 42px; height: 42px; font-size: 19px; border-radius: 12px; }",
    "  .shp-name { font-size: 13px; }",
    "  .shp-desc { margin-top: 1px; font-size: 10.5px; line-height: 1.45; }",
    "  .shp-price { font-size: 10.5px; }",
    "  .shp-buybtn { min-height: 44px; padding: 0 12px; font-size: 12px; }",
    "  .shp-buy { min-width: 64px; gap: 3px; }",
    "  .shp-note { display: none; }",
    "  .shp-spacer { min-height: 8px; }",
    "}",
    "@media (max-height: 668px) {",
    "  .shp { padding-bottom: calc(12px + var(--safe-b)); }",
    "  .shp-hero { margin-top: 2px; }",
    "  .shp-wallet { margin-top: 6px; }",
    "  .shp-bag { display: none; }",
    "  .shp-list { margin-top: 8px; gap: 5px; }",
    "  .shp-item { padding: 6px 9px; }",
    "  .shp-buybtn { min-height: 44px; }",
    "  .shp-top { min-height: 38px; }",
    "}",
    "@media (max-width: 360px) {",
    "  .shp-item { gap: 10px; padding: 11px 10px; }",
    "  .shp-ico { width: 48px; height: 48px; }",
    "  .shp-buy { min-width: 70px; }",
    "}"
  ].join("\n"));

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    cleanups.push(function () { clearTimeout(id); });
    return id;
  }
  function clearTimers() {
    while (cleanups.length) { try { cleanups.pop()(); } catch (e) {} }
  }
  function save(st) { try { App.Store.saveSession(st); } catch (e) {} }
  function tokensOf(st) { return st.tokens || {}; }
  function ownedCount(st, id) {
    if (id === "heart") return U.round((st.resources || {}).heart || 0);
    return U.round(tokensOf(st)[id] || 0);
  }
  function itemMeta(id) {
    for (var i = 0; i < (B.SHOP || []).length; i++) if (B.SHOP[i].id === id) return B.SHOP[i];
    var ui = ITEM_UI[id] || {};
    return { id: id, name: id, icon: "✧", price: 0, desc: ui.tag || "" };
  }
  function offers(st) {
    var list = [];
    try { list = App.Engine.shopOffers(st) || []; } catch (e) { list = []; }
    if (!list.length) {
      list = (B.SHOP || []).map(function (it) {
        return { id: it.id, name: it.name, icon: it.icon, price: it.price, desc: it.desc, affordable: U.round((st.resources || {}).coins || 0) >= it.price };
      });
    }
    return list;
  }
  function bagHtml(st) {
    var t = tokensOf(st);
    return '<div class="shp-bag shp-rise" style="--d:240ms">' +
      '<span class="k">行囊</span>' +
      '<span class="it">🛡️ <b data-bag="shield">' + U.round(t.shield || 0) + "</b></span>" +
      '<span class="it">🔄 <b data-bag="reroll">' + U.round(t.reroll || 0) + "</b></span>" +
      '<span class="it">🌊 <b data-bag="escalate">' + U.round(t.escalate || 0) + "</b></span>" +
      '<span class="sp"></span>' +
      '<span class="it">♥ <b data-bag="heart">' + U.round((st.resources || {}).heart || 0) + "</b></span>" +
      "</div>";
  }
  function rowHtml(st, it, idx) {
    var ui = ITEM_UI[it.id] || {};
    var afford = U.round((st.resources || {}).coins || 0) >= it.price;
    var own = ownedCount(st, it.id);
    var boughtOut = it.id === "heart" ? false : (own >= 99);
    return '<div class="shp-item shp-rise' + (afford ? " afford" : "") + '" data-row="' + it.id + '" style="--d:' + (300 + idx * 60) + "ms;--tint-soft:" + (ui.glow || "rgba(255,255,255,.12)") + ";--tint-glow:" + (ui.glow || "rgba(255,255,255,.08)") + '">' +
      '<span class="shp-ico" aria-hidden="true">' + (it.icon || "✧") + "</span>" +
      '<div class="shp-body">' +
      '<div class="shp-name"><span>' + U.escape(it.name) + '</span><span class="own" data-own="' + it.id + '">持有 ' + own + "</span></div>" +
      '<div class="shp-desc">' + U.escape(it.desc || ui.tag || "") + "</div>" +
      "</div>" +
      '<div class="shp-buy">' +
      '<span class="shp-price"><i aria-hidden="true">◈</i>' + U.round(it.price) + "</span>" +
      '<button class="shp-buybtn' + (boughtOut ? " done" : (afford ? "" : " off")) + '" type="button" data-test="shop-buy-' + U.escape(it.id) + '" data-buy="' + U.escape(it.id) + '"' +
      (afford ? "" : ' aria-disabled="true"') + ' aria-label="购买' + U.escape(it.name) + "，价格 " + U.round(it.price) + ' 星屑">' +
      (boughtOut ? "已满" : "购买") + "</button>" +
      "</div></div>";
  }

  function refresh(st, root) {
    var coins = U.round((st.resources || {}).coins || 0);
    var walletEl = U.qs("[data-wallet]", root);
    if (walletEl) {
      var from = lastRes === null ? 0 : U.round(lastRes.coins || 0);
      try { if (M && M.count) M.count(walletEl, coins, { from: from, dur: 560 }); else walletEl.textContent = String(coins); } catch (e) { walletEl.textContent = String(coins); }
    }
    var offersList = offers(st);
    offersList.forEach(function (it) {
      var row = U.qs('[data-row="' + it.id + '"]', root);
      if (!row) return;
      var afford = coins >= it.price;
      var own = ownedCount(st, it.id);
      var boughtOut = it.id === "heart" ? false : (own >= 99);
      row.classList.toggle("afford", afford);
      var ownEl = U.qs('[data-own="' + it.id + '"]', root);
      if (ownEl) ownEl.textContent = "持有 " + own;
      var btn = U.qs('[data-buy="' + it.id + '"]', root);
      if (btn) {
        btn.classList.toggle("off", !afford && !boughtOut);
        btn.classList.toggle("done", boughtOut);
        btn.textContent = boughtOut ? "已满" : "购买";
        if (afford && !boughtOut) btn.removeAttribute("aria-disabled");
        else btn.setAttribute("aria-disabled", "true");
      }
    });
    /* 行囊同步 */
    var t = tokensOf(st);
    [["shield", t.shield], ["reroll", t.reroll], ["escalate", t.escalate], ["heart", (st.resources || {}).heart]].forEach(function (pair) {
      var el = U.qs('[data-bag="' + pair[0] + '"]', root);
      if (el) el.textContent = String(U.round(pair[1] || 0));
    });
    var hint = U.qs("[data-lowhint]", root);
    if (hint) hint.classList.toggle("hidden", coins >= 4);
    lastRes = { coins: coins };
  }

  function buy(id, root) {
    var st = App.Store.getSession();
    if (!st) return;
    var res = null;
    try { res = App.Engine.shopBuy(st, id); } catch (e) { res = null; }
    var evs = (res && res.events) || [];
    var blocked = null;
    for (var i = 0; i < evs.length; i++) if (evs[i] && evs[i].blocked) { blocked = evs[i]; break; }
    if (!res || blocked) {
      var reason = blocked && blocked.reason === "not_enough_coins" ? "星屑不够，再完成几张卡" : "现在还不能买";
      App.Audio.play("warn");
      UI.haptic("warn");
      UI.toast(reason, { kind: "rose" });
      var row = U.qs('[data-row="' + id + '"]', root);
      if (row) { try { M.shake(row); } catch (e) {} }
      return;
    }
    var next = res.state || res;
    save(next);
    App.Audio.play("coin");
    UI.haptic("success");
    var meta = itemMeta(id);
    var rowEl = U.qs('[data-row="' + id + '"]', root);
    if (rowEl) {
      rowEl.classList.remove("bought");
      void rowEl.offsetWidth;
      rowEl.classList.add("bought");
      var ico = U.qs(".shp-ico", rowEl);
      if (ico) {
        try { M.burst(ico.getBoundingClientRect().left + 27, ico.getBoundingClientRect().top + 27, { count: 14, radius: 74, colors: [ITEM_UI[id] ? ITEM_UI[id].tint : "#f3c879", "#ffffff", "#ff5f9e"] }); } catch (e) {}
      }
    }
    var wallet = U.qs("[data-wallet]", root);
    if (wallet) {
      try { M.floatText(wallet, "-" + U.round(meta.price), "rose"); } catch (e) {}
    }
    refresh(next, root);
    var effect = id === "heart" ? "心动 +1" : meta.name + " +1";
    UI.toast("已购入 · " + (meta.icon || "") + " " + meta.name + "（" + effect + "）", { kind: "gold" });
  }

  function leave(root) {
    App.Audio.play("tap");
    var st = App.Store.getSession();
    var phase = st && st.phase;
    if (App.Screens && App.Screens.act && (phase === "act" || phase === "shop")) {
      /* 商店是从 act 推入的：优先 back 回幕转场，保留 act 屏的上下文 */
      if (App.Router.depth && App.Router.depth() > 1 && App.Router.current && App.Router.current() === "shop") {
        App.Router.back();
        return;
      }
      App.Router.go("act");
      return;
    }
    if (App.Screens && App.Screens.journey) { App.Router.go("journey"); return; }
    App.Router.reset("boot");
  }

  function render(root, st) {
    var coins = U.round((st.resources || {}).coins || 0);
    var list = offers(st);
    var specks = "";
    for (var i = 0; i < 7; i++) specks += '<i class="shp-speck" style="left:' + (10 + i * 13) + "%;top:" + (8 + ((i * 41) % 70)) + "%;animation-delay:" + (i * -0.9) + 's"></i>';
    root.innerHTML =
      '<div class="page shp">' +
      '<div class="shp-atmos" aria-hidden="true">' + specks + "</div>" +

      '<div class="shp-top shp-rise" style="--d:0ms">' +
      '<button class="shp-back" type="button" data-test="shop-leave" aria-label="离开商店，回到幕间"><span aria-hidden="true">←</span></button>' +
      '<span class="k">幕间 · 补给</span>' +
      '<span class="shp-hold"></span>' +
      "</div>" +

      '<div class="shp-hero shp-rise" style="--d:60ms">' +
      '<div class="shp-kicker"><span class="ln"></span><span class="kicker">STARLIGHT SHOP</span><span class="ln"></span></div>' +
      '<h1 class="shp-title"><span class="g">星屑商店</span></h1>' +
      '<p class="shp-sub">潮水退下去的一小会儿，<br>船尾的灯亮着，摊子就摆在那里。</p>' +
      '<div class="shp-wallet" role="group" aria-label="星屑余额"><i aria-hidden="true">◈</i><b data-test="hud-coins" data-wallet>' + coins + '</b><span>星屑</span></div>' +
      "</div>" +

      bagHtml(st) +

      '<div class="shp-list" role="list">' + list.map(function (it, idx) { return rowHtml(st, it, idx); }).join("") + "</div>" +

      '<div class="shp-spacer"></div>' +
      '<div class="shp-note" data-lowhint' + (coins >= 4 ? ' class="hidden"' : "") + ">星屑不够？回到航程<b>完成任意一张卡</b>就能攒到。</div>" +
      '<div class="shp-foot shp-rise" style="--d:520ms">' +
      '<button class="btn primary xl wide" type="button" data-test="shop-leave-cta" data-leave>' +
      "离开商店 · 回到航程 <span aria-hidden=\"true\">→</span></button>" +
      "</div>" +
      '<div class="shp-note">星屑与券只在这一夜有效 · 每一幕结束都会再开一次市</div>' +
      "</div>";

    lastRes = { coins: coins };
    refresh(st, root);

    U.qsa("[data-buy]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (btn.getAttribute("aria-disabled") === "true") {
          App.Audio.play("warn");
          UI.haptic("warn");
          UI.toast("星屑不够，再完成几张卡", { kind: "rose" });
          var row = btn.closest(".shp-item");
          if (row) { try { M.shake(row); } catch (e) {} }
          return;
        }
        buy(btn.getAttribute("data-buy"), root);
      });
    });
    U.qsa("[data-leave]", root).forEach(function (btn) {
      btn.addEventListener("click", function () { leave(root); });
    });
    var back = U.qs('[data-test="shop-leave"]', root);
    if (back) back.addEventListener("click", function () { leave(root); });

    /* 开场时给一次「市集亮灯」的轻反馈 */
    if (!M.reduced()) {
      later(function () {
        try { M.burst(window.innerWidth / 2, window.innerHeight * 0.22, { count: 10, radius: 90, colors: ["#f3c879", "#ffffff"] }); } catch (e) {}
      }, 260);
    }
  }

  App.Screens = App.Screens || {};
  App.Screens.shop = {
    mount: function (root, params) {
      clearTimers();
      var st = App.Store.getSession();
      if (!st) {
        later(function () { App.Router.reset("boot"); }, 0);
        return;
      }
      if (st.phase !== "act" && st.phase !== "shop") {
        later(function () {
          var map = { draft: "journey", play: "play", resolve: "play", escalate: "play", event: "event", finale: "finale" };
          var target = map[st.phase];
          if (target && App.Screens && App.Screens[target]) App.Router.go(target, {});
          else App.Router.reset("boot");
        }, 0);
        return;
      }
      App.Audio.play("tap");
      UI.haptic("light");
      render(root, st);
    },
    unmount: function () { clearTimers(); }
  };
})();

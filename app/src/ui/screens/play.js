/* ===== V3 ui/screens/play.js：卡牌执行屏（完成 / 跳过 / 加码 / 缓一缓 / 安全词） =====
 * 契约：App.Screens.play = { mount(root, params), unmount() }
 * 只通过 App.Engine 派发动作 → {state, events} → App.Store.saveSession → 按 state.phase 路由。
 * 视觉：大卡面（类型/星级/正文/标签/预计收益）、3D 入场、资源 count-up + 浮字 + 粒子、
 *      连击提示、完成/跳过的正负反馈、深潜卡、安全词长按 2s。
 * ========================================================================== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  /* ---------------- scoped CSS ---------------- */
  App.UI.injectStyle("play", [
    /* 布局 */
    ".play-screen{padding-top:calc(10px + var(--safe-t));}",
    ".play-top{display:flex;align-items:center;gap:10px;min-height:44px;margin-bottom:4px;}",
    ".play-round{flex:1;text-align:center;font-size:11.5px;letter-spacing:.12em;color:var(--dim2);line-height:1.4;}",
    ".play-round b{color:var(--gold);margin-left:7px;font-variant-numeric:tabular-nums;font-weight:700;}",
    ".play-round .play-act{display:block;color:var(--dim);font-size:11px;letter-spacing:.2em;}",
    ".play-host{font-size:11px;color:var(--dim);letter-spacing:.06em;padding:6px 11px;border:1px solid var(--line);border-radius:999px;background:var(--glass);white-space:nowrap;}",
    /* 资源 HUD */
    ".play-hud{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:16px;background:var(--glass);border:1px solid var(--line);margin:8px 0 14px;}",
    ".play-res{display:flex;align-items:center;gap:13px;flex:1;min-width:0;}",
    ".play-res .res{gap:4px;font-size:12.5px;}",
    ".play-res .res b{font-size:14px;}",
    ".play-combo{font-size:12px;font-weight:800;color:var(--dim2);border:1px solid var(--line);padding:4px 9px;border-radius:999px;white-space:nowrap;transition:all var(--t-mid) var(--ease);}",
    ".play-combo i{font-style:normal;margin-right:2px;}",
    ".play-combo.on{color:var(--gold);border-color:rgba(243,200,121,.45);background:rgba(243,200,121,.08);box-shadow:var(--glow-gold);}",
    ".play-tokens{display:flex;flex-wrap:wrap;gap:7px;margin:-7px 0 12px;min-height:0;}",
    ".play-tokens:empty{display:none;}",
    ".play-token{font-size:10.5px;font-weight:700;letter-spacing:.04em;color:var(--dim);border:1px solid var(--line);border-radius:999px;padding:3px 9px;background:rgba(255,255,255,.03);}",
    ".play-token b{color:var(--gold);font-variant-numeric:tabular-nums;}",
    /* 卡面 */
    ".play-stage{position:relative;perspective:1100px;margin:2px 0 14px;}",
    ".play-card{position:relative;display:flex;flex-direction:column;padding:18px 18px 15px;min-height:300px;overflow:hidden;transform-origin:50% 92%;animation:playDeal .52s var(--ease) both;}",
    ".play-card.deep{animation:playDeep .62s var(--ease) both;}",
    ".play-card.is-done{opacity:.72;filter:saturate(.8);}",
    "body.reduce .play-card,body.reduce .play-card.deep{animation:none;}",
    "@keyframes playDeal{from{opacity:0;transform:translateY(30px) rotateX(13deg) rotateY(-9deg) scale(.93);}to{opacity:1;transform:none;}}",
    "@keyframes playDeep{from{opacity:0;transform:translateY(18px) rotateY(20deg) scale(.9);}to{opacity:1;transform:none;}}",
    ".play-card-glow{position:absolute;inset:0;border-radius:inherit;pointer-events:none;border:1px solid var(--accent,var(--violet));opacity:.32;box-shadow:inset 0 0 60px -18px var(--accent,var(--violet));}",
    ".play-card[data-type='truth']{--accent:var(--violet);}",
    ".play-card[data-type='dare']{--accent:var(--tension);}",
    ".play-card[data-type='touch']{--accent:var(--rose);}",
    ".play-card[data-type='sync']{--accent:var(--teal);}",
    ".play-card[data-type='spark']{--accent:var(--gold);}",
    ".play-card[data-type='punish']{--accent:var(--danger);}",
    ".play-watermark{position:absolute;right:8px;bottom:-16px;font-size:104px;line-height:1;opacity:.055;pointer-events:none;filter:blur(.4px);}",
    ".play-card-head{position:relative;display:flex;align-items:center;justify-content:space-between;gap:10px;}",
    ".play-type{display:inline-flex;align-items:center;gap:7px;font-size:12px;font-weight:800;letter-spacing:.14em;color:var(--accent,var(--violet));padding:5px 11px;border-radius:999px;border:1px solid currentColor;background:rgba(255,255,255,.03);}",
    ".play-type em{font-style:normal;font-size:15px;letter-spacing:0;}",
    ".play-stars{font-size:15px;letter-spacing:.16em;color:var(--gold);text-shadow:0 0 14px rgba(243,200,121,.35);white-space:nowrap;}",
    ".play-stars .empty{color:rgba(255,255,255,.16);text-shadow:none;}",
    ".play-deep-tag{align-self:flex-start;margin-top:10px;font-size:11px;font-weight:800;letter-spacing:.16em;color:#2a0f1c;background:linear-gradient(135deg,var(--gold),#ff9f6b);padding:4px 10px;border-radius:999px;box-shadow:0 4px 16px rgba(243,200,121,.25);}",
    ".play-card-body{position:relative;flex:1;display:flex;align-items:center;margin:12px 2px 10px;min-height:120px;}",
    ".play-text{width:100%;font-size:var(--card-fs,19px);line-height:1.72;font-weight:600;letter-spacing:.01em;color:var(--ink);max-height:min(42vh,330px);overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;padding-right:4px;scrollbar-width:none;}",
    ".play-text::-webkit-scrollbar{display:none;}",
    ".play-text.long{font-weight:500;}",
    ".play-text.scrollable{mask-image:linear-gradient(180deg,#000 86%,transparent 100%);-webkit-mask-image:linear-gradient(180deg,#000 86%,transparent 100%);}",
    ".play-card-foot{position:relative;border-top:1px dashed var(--line);padding-top:11px;display:flex;flex-direction:column;gap:9px;}",
    ".play-tags{display:flex;flex-wrap:wrap;gap:6px;}",
    ".play-tag{font-size:10.5px;color:var(--dim);border:1px solid var(--line);border-radius:999px;padding:3px 9px;letter-spacing:.04em;background:rgba(255,255,255,.03);}",
    ".play-yield{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}",
    ".play-yield-label{font-size:10.5px;letter-spacing:.18em;color:var(--dim2);}",
    ".play-yield .res{font-size:12px;font-weight:700;}",
    ".play-yield .res b{font-size:13px;}",
    ".play-mult{font-size:11px;font-weight:800;color:var(--gold);letter-spacing:.06em;}",
    /* 结果面板 */
    ".play-result{margin-top:12px;padding:16px;border-radius:var(--r-md);background:linear-gradient(165deg,rgba(255,255,255,.09),rgba(255,255,255,.035));border:1px solid var(--line2);animation:playResult .4s var(--ease) both;box-shadow:var(--sh-1);}",
    "body.reduce .play-result{animation:none;}",
    "@keyframes playResult{from{opacity:0;transform:translateY(16px) scale(.985);}to{opacity:1;transform:none;}}",
    ".play-result-head{display:flex;align-items:center;gap:12px;}",
    ".play-result-ico{width:42px;height:42px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;background:rgba(255,255,255,.06);border:1px solid var(--line2);}",
    ".play-result.ok .play-result-ico{background:rgba(243,200,121,.14);border-color:rgba(243,200,121,.4);}",
    ".play-result.skip .play-result-ico{background:rgba(154,124,255,.12);border-color:rgba(154,124,255,.35);}",
    ".play-result-title{font-size:19px;font-weight:800;letter-spacing:.03em;}",
    ".play-result-sub{font-size:11.5px;color:var(--dim);margin-top:2px;letter-spacing:.03em;}",
    ".play-gain{display:flex;flex-wrap:wrap;gap:11px;margin-top:13px;}",
    ".play-gain .res{font-size:14px;font-weight:800;}",
    ".play-gain .res b{font-size:15px;}",
    ".play-result-combo{display:flex;align-items:center;gap:8px;margin-top:12px;font-size:11.5px;color:var(--dim);}",
    ".play-result-combo b{color:var(--gold);font-variant-numeric:tabular-nums;}",
    ".play-hint{font-size:11.5px;color:var(--dim2);text-align:center;margin:6px 0 2px;letter-spacing:.03em;}",
    /* 动作区 */
    ".play-actions{display:flex;flex-direction:column;gap:10px;margin-top:2px;}",
    ".play-actions-row{display:flex;gap:10px;}",
    ".play-actions-row .btn{flex:1;}",
    ".play-actions .btn{min-height:52px;}",
    ".play-actions .btn .sub{display:block;font-size:10.5px;margin-top:1px;}",
    ".play-actions .btn.primary{flex-direction:column;gap:1px;}",
    /* 底部安全条 */
    ".play-safe .btn{min-height:46px;padding:0 14px;font-size:12.5px;white-space:nowrap;}",
    ".play-safe .play-gentle .sub{font-size:10px;opacity:.75;margin-left:2px;}",
    ".play-safe .safe-stop{position:relative;overflow:hidden;touch-action:none;min-width:96px;min-height:46px;justify-content:center;}",
    ".play-safe .safe-stop .hold-fill{position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,95,109,.55),rgba(255,95,109,.28));transform:scaleX(var(--p,0));transform-origin:left center;pointer-events:none;transition:none;}",
    ".play-safe .safe-stop .safe-stop-label{position:relative;z-index:1;display:inline-flex;align-items:center;gap:6px;}",
    ".play-safe .safe-stop.on{border-color:rgba(255,95,109,.9);color:#fff;}",
    /* 连击大字 */
    ".play-combo-big{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:9997;font-size:clamp(30px,9vw,42px);font-weight:900;letter-spacing:.04em;color:#fff;white-space:nowrap;pointer-events:none;text-shadow:0 0 26px var(--rose),0 0 70px var(--violet);animation:playComboPop 1.05s var(--ease-out) both;}",
    `@keyframes playComboPop{0%{opacity:0;transform:translate(-50%,-50%) scale(.55);}22%{opacity:1;transform:translate(-50%,-45%) scale(1.13);}68%{opacity:1;transform:translate(-50%,-52%) scale(1);}100%{opacity:0;transform:translate(-50%,-72%) scale(.96);}}`,
    "@media (max-width:400px){.play-safe .safe-note{display:none;}.play-safe .safe-stop{min-width:84px;padding:0 12px;}}",
    /* 窄屏 */
    "@media (max-width:360px){.play-hud{gap:8px;padding:9px 10px;}.play-res{gap:10px;}.play-card{padding:15px 14px 13px;min-height:270px;}.play-actions .btn{min-height:48px;}.play-safe{gap:6px;padding-left:10px;padding-right:10px;}}"
  ].join("\n"));

  var TYPE_RES = { truth: "sync", dare: "tension", touch: "heart", sync: "sync", spark: "tension", punish: "heart" };
  var TYPE_COLORS = {
    truth: ["#9a7cff", "#6f52e8", "#f3c879"],
    dare: ["#ff9e5e", "#ff5f9e", "#f3c879"],
    touch: ["#ff5f9e", "#ff9f6b", "#9a7cff"],
    sync: ["#4fd6c8", "#9a7cff", "#f3c879"],
    spark: ["#f3c879", "#ff5f9e", "#9a7cff"],
    punish: ["#ff5f6d", "#9a7cff", "#ffffff"]
  };
  var REASON_TEXT = {
    wrong_phase: "现在还不能这么做",
    not_allowed: "这张卡不能再深潜了",
    no_uses_left: "今晚的「缓一缓」已经用完",
    no_token: "没有可用的券",
    no_card: "题库暂时没有合适的卡",
    no_current_card: "卡牌信息丢失，请重试",
    card_not_in_hand: "这张卡不在手牌里",
    not_enough_coins: "星屑不够",
    event_not_found: "事件已结束",
    event_already_chosen: "这个事件已经选过了",
    option_not_found: "选项不存在"
  };

  var state = null;
  var root = null;
  var alive = false;
  var busy = false;

  function B() { return App.Balance || {}; }
  function resMeta(k) { return App.UI.RES[k] || { icon: "", label: k, cls: "" }; }
  function typeMeta(pool) { return (B().TYPE_META && B().TYPE_META[pool]) || { icon: "✦", name: pool || "卡牌" }; }
  function reasonText(reason) { return REASON_TEXT[reason] || "这一步现在做不了"; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function loadState(params) {
    var st = null;
    if (params && params.state) st = params.state;
    else st = App.Store.getSession();
    if (!st) return null;
    try { st = App.Engine.validate(st) || st; } catch (e) {}
    if (params && params.cardId && st.phase === "draft") {
      var r = App.Engine.chooseCard(st, params.cardId);
      var next = (r && r.state) ? r.state : r;
      if (next && next.phase === "play") {
        try { App.Store.saveSession(next); } catch (e) {}
        st = next;
      }
    }
    return st;
  }

  /* ---------------- 视图片段 ---------------- */
  function starsHtml(n) {
    var out = "";
    for (var i = 1; i <= 5; i++) out += i <= n ? "★" : '<span class="empty">☆</span>';
    return out;
  }

  function fontSizeFor(text) {
    var len = String(text || "").length;
    if (len <= 34) return 20;
    if (len <= 58) return 19;
    if (len <= 90) return 17.5;
    if (len <= 140) return 16.5;
    return 15.5;
  }

  function hudResHtml(st) {
    var r = st.resources || {};
    var order = ["heart", "tension", "sync", "coins"];
    return order.map(function (k) {
      var m = resMeta(k);
      return '<span class="res ' + m.cls + '" data-res="' + k + '" title="' + m.label + '"><i>' + m.icon + "</i>" +
        '<b data-res-val="' + k + '">' + U.round(r[k] || 0) + "</b></span>";
    }).join("");
  }

  function tokenHtml(st) {
    var t = st.tokens || {};
    var parts = [];
    var meta = (B().TOKEN_META) || {};
    ["shield", "reroll", "escalate"].forEach(function (k) {
      var n = U.round(t[k] || 0);
      if (n <= 0) return;
      var m = meta[k] || { icon: "🎟️", name: k };
      parts.push('<span class="play-token" data-test="play-token-' + k + '" title="' + U.escape(m.name || k) + '">' +
        (m.icon || "🎟️") + " " + U.escape(m.name || k) + " ×<b>" + n + "</b></span>");
    });
    return parts.length ? '<div class="play-tokens" data-test="play-tokens">' + parts.join("") + "</div>" : '<div class="play-tokens" data-test="play-tokens"></div>';
  }

  function hudHtml(st) {
    var combo = st.combo || 0;
    return '<div class="play-hud" data-test="play-hud">' +
      '<div class="play-res">' + hudResHtml(st) + "</div>" +
      '<div class="play-combo' + (combo > 0 ? " on" : "") + '" data-test="play-combo" aria-label="连击 ' + combo + '"><i>⚡</i>×<b data-combo-val>' + combo + "</b></div>" +
      "</div>" + tokenHtml(st);
  }

  function yieldHtml(st, info, deep) {
    var y = {};
    try { y = B().yieldFor(info.pool, info.star) || {}; } catch (e) {}
    var coins = 0;
    try { coins = B().coinsFor(info.star, (st.combo || 0) + (deep ? 1 : 1)); } catch (e) {}
    var parts = [];
    ["heart", "tension", "sync"].forEach(function (k) {
      if (!y[k]) return;
      var m = resMeta(k);
      parts.push('<span class="res ' + m.cls + '"><i>' + m.icon + "</i>+" + (deep ? y[k] * 2 : y[k]) + "</span>");
    });
    if (coins) parts.push('<span class="res res-coins"><i>' + resMeta("coins").icon + "</i>+" + (deep ? coins * 2 : coins) + "</span>");
    if (!parts.length) parts.push('<span class="res"><i>✦</i>风险结算</span>');
    return '<div class="play-yield">' +
      (deep ? '<span class="play-mult">深潜 ×2</span>' : '<span class="play-yield-label">预计</span>') +
      parts.join("") + "</div>";
  }

  function cardHtml(st, info, mode) {
    var deep = mode === "escalate";
    var ty = typeMeta(info.pool);
    var fs = fontSizeFor(info.text);
    var longCls = String(info.text || "").length > 90 ? " long" : "";
    var tags = (info.tags || []).slice(0, 5).map(function (t) {
      return '<span class="play-tag">#' + U.escape(t) + "</span>";
    }).join("");
    return '<article class="play-card card-face' + (deep ? " deep" : "") + '" data-test="play-card" data-type="' + U.escape(info.pool) + '" style="--card-fs:' + fs + 'px" aria-label="' + U.escape(ty.name + " " + info.star + " 星") + '">' +
      '<div class="play-card-glow"></div>' +
      '<span class="play-watermark" aria-hidden="true">' + ty.icon + "</span>" +
      '<div class="play-card-head">' +
      '<span class="play-type" data-test="play-type"><em>' + ty.icon + "</em>" + ty.name + "</span>" +
      '<span class="play-stars" data-test="play-star" aria-label="强度 ' + info.star + ' 星">' + starsHtml(info.star) + "</span>" +
      "</div>" +
      (deep ? '<div class="play-deep-tag" data-test="play-deep-tag">🌊 深潜 · 收益 ×2</div>' : "") +
      '<div class="play-card-body"><p class="play-text' + longCls + '" data-test="play-card-text">' + U.escape(info.text) + "</p></div>" +
      '<div class="play-card-foot">' +
      (tags ? '<div class="play-tags">' + tags + "</div>" : "") +
      yieldHtml(st, info, deep) +
      "</div></article>";
  }

  function lastLog(st) {
    var log = st.log || [];
    for (var i = log.length - 1; i >= 0; i--) {
      var e = log[i];
      if (e && (e.type === "complete" || e.type === "skip" || e.type === "escalate" || e.type === "escalateComplete" || e.type === "escalateSkip" || e.type === "gentleSkip")) return e;
    }
    return null;
  }

  function resultHtml(st) {
    var last = lastLog(st) || {};
    var skipped = last.type === "skip" || last.type === "escalateSkip" || last.type === "gentleSkip";
    var deep = last.type === "escalateComplete" || last.type === "escalateSkip";
    var deltas = last.deltas || {};
    var gain = [];
    ["heart", "tension", "sync", "coins"].forEach(function (k) {
      var v = U.round(deltas[k] || 0);
      if (!v) return;
      var m = resMeta(k);
      gain.push('<span class="res ' + m.cls + '"><i>' + m.icon + "</i>" + (v > 0 ? "+" : "") + v + " " + m.label + "</span>");
    });
    var title, sub, ico, cls;
    if (skipped) {
      cls = "skip";
      title = deep ? "深潜已跳过" : "已跳过";
      sub = last.type === "escalateSkip"
        ? "心动 -1 · 连击归零 · 不抽惩罚卡"
        : (last.type === "gentleSkip" ? "温柔值 +1 · 连击归零" : "温柔值 +1 · 连击归零 · 张力 -1");
    } else {
      cls = "ok";
      title = deep ? "深潜完成" : "完成";
      sub = deep ? "深潜收益已翻倍 · 连击 +1" : "连击 +1 · 记录已写下";
    }
    var combo = st.combo || 0;
    return '<section class="play-result ' + cls + '" data-test="play-result" data-result="' + cls + '">' +
      '<div class="play-result-head">' +
      '<div class="play-result-ico" aria-hidden="true">' + (skipped ? "🌙" : (deep ? "🌊" : "✓")) + "</div>" +
      "<div><div class=\"play-result-title\">" + title + "</div>" +
      '<div class="play-result-sub">' + sub + "</div></div>" +
      "</div>" +
      (gain.length ? '<div class="play-gain" data-test="play-result-gain">' + gain.join("") + "</div>" : "") +
      '<div class="play-result-combo">⚡ 本局连击 <b data-combo-val>' + combo + "</b>" +
      (st.maxCombo ? '<span>· 最高 ' + st.maxCombo + "</span>" : "") +
      '<span style="margin-left:auto">' + (B().RES_LABEL ? "" : "") + "</span></div>" +
      "</section>";
  }

  function escalateReason(st, info) {
    var maxStar = 3;
    try { maxStar = st.settings && st.settings.gentleOnly ? 2 : (st.settings ? st.settings.maxStar : 3); } catch (e) {}
    if (st.escalated) return "本回合已经深潜过了";
    if (!info) return "当前没有可深潜的卡";
    if (info.star >= maxStar && (U.round((st.tokens || {}).escalate || 0) <= 0)) return "已到最高星 · 需要「🌊 加码券」";
    return "当前不能深潜";
  }

  function actionsHtml(st) {
    var info = App.Engine.currentCard(st);
    var phase = st.phase;
    if (phase === "escalate") {
      return '<div class="play-actions">' +
        '<button class="btn primary xl wide" data-test="play-complete" aria-label="完成深潜">完成深潜 · 收益 ×2</button>' +
        '<button class="btn ghost wide" data-test="play-skip" aria-label="跳过深潜">跳过深潜 · 心动 -1</button>' +
        "</div>";
    }
    if (phase === "resolve") {
      var can = false;
      try { can = App.Engine.canEscalate(st); } catch (e) {}
      var reason = can ? "再抽一张 ★+1 深潜卡 · 收益 ×2" : escalateReason(st, info);
      var html = '<div class="play-actions">';
      html += '<button class="btn ' + (can ? "primary" : "soft") + ' xl wide" data-test="play-escalate"' +
        (can ? "" : " disabled") + ' aria-label="加码深潜" aria-disabled="' + (can ? "false" : "true") + '">' +
        "🌊 加码深潜<span class=\"sub\">" + reason + "</span></button>";
      html += '<button class="btn ' + (can ? "soft" : "primary") + ' xl wide" data-test="play-next" aria-label="下一回合">下一回合 <span style="margin-left:6px">→</span></button>';
      html += "</div>";
      return html;
    }
    return '<div class="play-actions">' +
      '<button class="btn primary xl wide" data-test="play-complete" aria-label="完成这张卡">完成 · 领取收益</button>' +
      '<button class="btn ghost wide" data-test="play-skip" aria-label="跳过这张卡">跳过 · 温柔值 +1</button>' +
      "</div>";
  }

  function gentleLeft(st) {
    var max = (B().GENTLE && B().GENTLE.maxUses) || 2;
    return Math.max(0, max - (st.gentleUsed || 0));
  }

  function safeBarHtml(st, phase) {
    var left = gentleLeft(st);
    var canGentle = phase === "play" && left > 0;
    return '<div class="safe-bar play-safe">' +
      '<button class="btn ghost sm play-gentle" data-test="play-gentle" ' + (canGentle ? "" : "disabled") +
      ' aria-label="缓一缓：对当前卡降一星，今晚剩 ' + left + ' 次"><span>缓一缓</span><span class="sub" data-test="play-gentle-left">剩 ' + left + "</span></button>" +
      '<div class="safe-note">喊停随时可以 · 不扣数据</div>' +
      '<button class="safe-stop" data-test="safe-stop" aria-label="长按两秒使用安全词，温柔收尾">' +
      '<span class="hold-fill" aria-hidden="true"></span>' +
      '<span class="safe-stop-label">🚩 停</span>' +
      "</button></div>";
  }

  function shellHtml(st) {
    var info = App.Engine.currentCard(st);
    var actInfo = {};
    try { actInfo = App.Engine.actInfo(st) || {}; } catch (e) {}
    var pr = {};
    try { pr = App.Engine.progress(st) || {}; } catch (e) {}
    var hostName = st.host === "b" ? ((st.names && st.names.b) || "TA") : ((st.names && st.names.a) || "你");
    var phase = st.phase;
    var mode = phase === "escalate" ? "escalate" : "play";
    return '<div class="page play-screen" data-test="play-screen" data-phase="' + phase + '">' +
      '<div class="play-top">' +
      '<button class="icon-btn play-back" data-test="play-back" aria-label="返回航程">←</button>' +
      '<div class="play-round"><span class="play-act">第 ' + (actInfo.act || 1) + " 幕 · " + U.escape(actInfo.name || "航线") + "</span>" +
      "第 <b>" + (pr.round || st.round || 1) + " / " + (pr.total || "?") + "</b> 回合</div>" +
      '<div class="play-host">' + U.escape(hostName) + " 领航</div>" +
      "</div>" +
      hudHtml(st) +
      '<div class="play-stage">' +
      (info ? cardHtml(st, info, mode) : "") +
      (phase === "resolve" ? resultHtml(st) : "") +
      "</div>" +
      actionsHtml(st) +
      safeBarHtml(st, phase) +
      "</div>";
  }

  /* ---------------- 动画 / 音效 ---------------- */
  function cardCenter() {
    var el = root && root.querySelector('[data-test="play-card"]');
    if (!el) return { x: window.innerWidth / 2, y: window.innerHeight * 0.42 };
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + Math.min(r.height * 0.55, window.innerHeight * 0.6) };
  }

  function floatDelta(k, v) {
    if (!v) return;
    var m = resMeta(k);
    var anchor = root && root.querySelector('[data-res="' + k + '"]');
    var cls = k === "coins" ? "" : (k === "heart" ? "rose" : (k === "sync" ? "teal" : ""));
    M.floatText(anchor, (v > 0 ? "+" : "") + v + " " + m.label, cls);
  }

  function comboFx(n) {
    if (!n) return;
    App.Audio.play("combo");
    App.UI.haptic("success");
    var el = root && root.querySelector('[data-test="play-combo"]');
    if (el) M.pulse(el);
    if (n >= 3) {
      var d = document.createElement("div");
      d.className = "play-combo-big";
      d.setAttribute("data-test", "play-combo-big");
      d.textContent = "连击 ×" + n;
      var host = document.getElementById("overlay") || document.body;
      host.appendChild(d);
      setTimeout(function () { try { d.remove(); } catch (e) {} }, 1120);
    }
  }

  function tokenFx(ev) {
    var name = ev.name || "券";
    if (ev.delta > 0) {
      App.Audio.play("coin");
      App.UI.toast("获得 " + name + " ×1", { kind: "gold" });
    } else if (ev.delta < 0) {
      App.Audio.play("select");
    }
  }

  function animateEvents(events, prevRes, prevCombo) {
    if (!events || !events.length || !alive) return;
    var bursted = false;
    events.forEach(function (ev) {
      if (!ev || !ev.type) return;
      if (ev.type === "gain" && ev.res) {
        var keys = Object.keys(ev.res);
        keys.forEach(function (k) {
          var to = state && state.resources ? state.resources[k] : ev.res[k];
          var valEl = root && root.querySelector('[data-res-val="' + k + '"]');
          if (valEl) {
            valEl.textContent = String(U.round((prevRes && prevRes[k]) || 0));
            M.count(valEl, U.round(to || 0), { dur: 520 });
          }
          floatDelta(k, U.round(ev.res[k]));
        });
        var hasPositive = keys.some(function (k) { return ev.res[k] > 0; });
        if (hasPositive && !bursted) {
          bursted = true;
          var c = cardCenter();
          var info = App.Engine.currentCard(state);
          var colors = TYPE_COLORS[(info && info.pool) || "truth"] || null;
          setTimeout(function () {
            if (!alive) return;
            M.burst(c.x, c.y, { count: 22, colors: colors, radius: 150 });
          }, 120);
        }
        if (ev.res.coins > 0) setTimeout(function () { if (alive) App.Audio.play("coin"); }, 140);
        else App.Audio.play(ev.reason === "escalateComplete" ? "reveal" : "chime");
        if (ev.reason === "escalateComplete") App.UI.haptic("heavy");
        else App.UI.haptic("success");
      } else if (ev.type === "skip") {
        App.Audio.play("soft");
        App.UI.haptic("warn");
        var cardEl = root && root.querySelector('[data-test="play-card"]');
        M.shake(cardEl);
        if (ev.res) {
          Object.keys(ev.res).forEach(function (k) { floatDelta(k, U.round(ev.res[k])); });
        }
        if (typeof ev.gentle === "number" && ev.gentle > 0) {
          var gentleAnchor = root && root.querySelector('[data-test="play-gentle"]');
          M.floatText(gentleAnchor, "+1 温柔", "teal");
        }
      } else if (ev.type === "combo") {
        comboFx(ev.n);
      } else if (ev.type === "token") {
        tokenFx(ev);
      } else if (ev.type === "actEnd") {
        App.UI.toast(ev.good ? "幕末共鸣检定通过 · 奖励已入账" : "幕末检定未达标 · 下一幕会更温柔", { kind: ev.good ? "gold" : "rose" });
        App.Audio.play(ev.good ? "chime" : "soft");
      } else if (ev.type === "stage") {
        if (ev.blocked) {
          App.Audio.play("error");
          App.UI.toast(reasonText(ev.reason), { kind: "rose" });
        } else if (ev.gentleDown) {
          App.Audio.play("soft");
          App.UI.haptic("tap");
          var ok = root && root.querySelector('[data-test="play-card"]');
          if (ok) M.pulse(ok);
          M.floatText(ok, "温柔 -1 星 · 剩 " + (ev.usesLeft === undefined ? "" : ev.usesLeft) + " 次", "teal");
          App.UI.toast("已降一星 · 慢慢来", { kind: "teal" });
        } else if (ev.adaptive) {
          App.UI.toast("海面放轻了 · 下一幕会更温柔", { kind: "teal" });
        }
      }
    });
    if (prevCombo !== undefined && state && (state.phase === "resolve") && state.combo > 0 && state.combo !== prevCombo) {
      /* 连击在 gain 同帧展示，这里不重复 */
    }
  }

  /* ---------------- 动作派发 ---------------- */
  function findBlocked(events) {
    var list = events || [];
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].type === "stage" && list[i].blocked) return list[i];
    return null;
  }

  function dispatch(fnName, opts) {
    if (!alive || !state || busy) return null;
    busy = true;
    var prev = state;
    var result = null;
    try {
      result = App.Engine[fnName](prev);
    } catch (e) {
      busy = false;
      App.UI.toast("这一步出错了，请重试", { kind: "rose" });
      if (window.console) console.error("[play]", fnName, e);
      return null;
    }
    busy = false;
    var next = (result && result.state) ? result.state : result;
    var events = (result && result.events) ? result.events
      : ((next && next.outEvents) ? next.outEvents : ((next && next.actionEvents) ? next.actionEvents : []));
    if (!(events instanceof Array)) events = [];
    var blocked = findBlocked(events);
    if (blocked) {
      App.Audio.play("error");
      App.UI.toast(reasonText(blocked.reason), { kind: "rose" });
      return null;
    }
    var prevRes = U.copy((prev && prev.resources) || {});
    var prevCombo = prev ? (prev.combo || 0) : 0;
    state = next;
    try { App.Store.saveSession(state); } catch (e) {}
    if (opts && opts.route) {
      routeByPhase(state);
      return state;
    }
    render();
    animateEvents(events, prevRes, prevCombo);
    return state;
  }

  function doComplete() {
    if (!state) return;
    if (state.phase === "escalate") dispatch("escalateComplete");
    else if (state.phase === "play") dispatch("complete");
    else if (state.phase === "resolve") goNext();
  }
  function doSkip() {
    if (!state) return;
    if (state.phase === "escalate") dispatch("escalateSkip");
    else if (state.phase === "play") dispatch("skip");
  }
  function doEscalate() {
    if (!state || state.phase !== "resolve") return;
    dispatch("escalate");
  }
  function doGentle() {
    if (!state || state.phase !== "play") return;
    dispatch("gentleDown");
  }
  function goNext() {
    if (!alive || !state || busy) return;
    if (state.phase !== "resolve") return;
    busy = true;
    var result = null;
    try { result = App.Engine.nextRound(state); } catch (e) {
      busy = false;
      App.UI.toast("推进回合失败，请重试", { kind: "rose" });
      return;
    }
    busy = false;
    var next = (result && result.state) ? result.state : result;
    var events = (result && result.events) ? result.events
      : ((next && next.outEvents) ? next.outEvents : ((next && next.actionEvents) ? next.actionEvents : []));
    if (!(events instanceof Array)) events = [];
    var blocked = findBlocked(events);
    if (blocked) {
      App.Audio.play("error");
      App.UI.toast(reasonText(blocked.reason), { kind: "rose" });
      return;
    }
    state = next;
    try { App.Store.saveSession(state); } catch (e) {}
    var actEnd = null;
    for (var i = 0; i < events.length; i++) if (events[i] && events[i].type === "actEnd") actEnd = events[i];
    if (actEnd) {
      App.Audio.play(actEnd.good ? "chime" : "soft");
      App.UI.toast(actEnd.good ? "幕末共鸣检定通过 · 星星落进海里" : "幕末检定未达标 · 下一幕更温柔", { kind: actEnd.good ? "gold" : "rose" });
    } else {
      App.Audio.play("select");
    }
    routeByPhase(state);
  }

  /* ---------------- 路由 ---------------- */
  function redirect(name, st) {
    App.Router.go(name, { state: st }, { replace: true });
  }
  function gotoFinale(st) {
    /* 兜底：任何"下一回合/幕末"路径若已进入 finale 但还没生成 result，先 finish() 再跳转，
       否则 finale 屏拿到的 session.result === null（集成 bug）。安全词路径自带 result，不受影响。 */
    if (st && !st.result) {
      try {
        var r = App.Engine.finish(st);
        var next = (r && r.state) ? r.state : r;
        if (next) {
          st = next;
          try { App.Store.saveSession(st); } catch (e) {}
        }
      } catch (e) {
        if (window.console) console.error("[play] finish fallback", e);
      }
    }
    return redirect("finale", st);
  }
  function routeByPhase(st) {
    if (!st) return;
    var ph = st.phase;
    if (ph === "event") return redirect("event", st);
    if (ph === "finale") return gotoFinale(st);
    if (ph === "shop") return redirect("shop", st);
    if (ph === "draft") return redirect("journey", st);
    if (ph === "act") return gotoAct(st);
    if (ph === "play" || ph === "resolve" || ph === "escalate") {
      state = st;
      render();
      return;
    }
    redirect("journey", st);
  }
  function gotoAct(st) {
    if (App.Screens && App.Screens.act && typeof App.Screens.act.mount === "function") {
      return redirect("act", st);
    }
    /* act 屏尚未就绪（自测场景）：直接 leaveAct 推进，避免卡死 */
    var next = null;
    try { next = App.Engine.leaveAct(st); } catch (e) {}
    if (!next) return redirect("journey", st);
    try { App.Store.saveSession(next); } catch (e) {}
    var ph = next.phase;
    if (ph === "finale") return gotoFinale(next);
    if (ph === "shop") return redirect("shop", next);
    redirect("journey", next);
  }

  /* ---------------- 安全词长按 ---------------- */
  function triggerSafeWord() {
    App.UI.haptic("heavy");
    App.Audio.play("soft");
    App.UI.vibrate(30);
    App.UI.confirm({
      title: "现在就停吗？",
      text: "会立刻进入温柔收尾，不扣任何数据。",
      ok: "温柔收尾",
      cancel: "继续今晚"
    }).then(function (yes) {
      if (!yes || !alive || !state) return;
      var r = null;
      try { r = App.Engine.safeWord(state); } catch (e) {}
      var next = (r && r.state) ? r.state : r;
      if (!next) return;
      state = next;
      try { App.Store.saveSession(state); } catch (e) {}
      App.Audio.play("ending");
      redirect("finale", state);
    });
  }

  function bindSafeStop(el) {
    if (!el) return;
    var holdMs = 2000;
    try { holdMs = clamp(Number(state.settings && state.settings.safeHold) || 2, 1, 10) * 1000; } catch (e) {}
    var t0 = 0, raf = 0, active = false;
    var fill = el.querySelector(".hold-fill");
    function paint(p) {
      if (fill) fill.style.transform = "scaleX(" + p.toFixed(3) + ")";
      el.style.setProperty("--p", p.toFixed(3));
    }
    function tick() {
      if (!active) return;
      var p = clamp((Date.now() - t0) / holdMs, 0, 1);
      paint(p);
      if (p >= 1) { stop(true); return; }
      raf = requestAnimationFrame(tick);
    }
    function start(e) {
      if (active || busy) return;
      if (e && e.preventDefault) e.preventDefault();
      active = true;
      t0 = Date.now();
      el.classList.add("on");
      try { if (e && e.pointerId !== undefined && el.setPointerCapture) el.setPointerCapture(e.pointerId); } catch (err) {}
      App.Audio.play("tick");
      App.UI.vibrate(8);
      raf = requestAnimationFrame(tick);
    }
    function stop(complete) {
      if (!active) return;
      active = false;
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      el.classList.remove("on");
      paint(0);
      if (complete) { triggerSafeWord(); return; }
      if (Date.now() - t0 < 500) {
        App.UI.toast("长按 2 秒启用安全词 · 随时可以喊停", { kind: "rose" });
        App.Audio.play("tap");
      }
    }
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointerup", function () { stop(false); });
    el.addEventListener("pointercancel", function () { stop(false); });
    el.addEventListener("pointerleave", function () { stop(false); });
    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    el.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); start(e); }
    });
    el.addEventListener("keyup", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); stop(false); }
    });
    el.addEventListener("click", function (e) { e.preventDefault(); });
  }

  /* ---------------- 渲染 ---------------- */
  function bindActions() {
    var back = root && root.querySelector('[data-test="play-back"]');
    if (back) back.addEventListener("click", function () { App.Audio.play("tap"); App.Router.back(); });
    var complete = root && root.querySelector('[data-test="play-complete"]');
    if (complete) complete.addEventListener("click", function () { App.Audio.play("tick"); doComplete(); });
    var skip = root && root.querySelector('[data-test="play-skip"]');
    if (skip) skip.addEventListener("click", function () { App.Audio.play("tick"); doSkip(); });
    var esc = root && root.querySelector('[data-test="play-escalate"]');
    if (esc) esc.addEventListener("click", function () { App.Audio.play("tick"); doEscalate(); });
    var next = root && root.querySelector('[data-test="play-next"]');
    if (next) next.addEventListener("click", function () { App.Audio.play("tick"); goNext(); });
    var gentle = root && root.querySelector('[data-test="play-gentle"]');
    if (gentle) gentle.addEventListener("click", function () { App.Audio.play("tap"); doGentle(); });
    bindSafeStop(root && root.querySelector('[data-test="safe-stop"]'));
  }

  function render() {
    if (!alive || !root || !state) return;
    root.innerHTML = shellHtml(state);
    bindActions();
    var txt = root.querySelector('[data-test="play-card-text"]');
    if (txt && txt.scrollHeight > txt.clientHeight + 4) txt.classList.add("scrollable");
    if (state.phase === "escalate") {
      M.pulse(root.querySelector('[data-test="play-card"]'));
      App.Audio.play("reveal");
    }
    if (state.phase === "resolve") {
      var res = root.querySelector('[data-test="play-result"]');
      if (res && !M.reduced()) {
        setTimeout(function () {
          try { res.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {}
        }, 220);
      }
    }
  }

  /* ---------------- 屏幕契约 ---------------- */
  App.Screens = App.Screens || {};
  App.Screens.play = {
    mount: function (el, params) {
      root = el;
      alive = true;
      busy = false;
      state = loadState(params || {});
      if (!state) {
        App.UI.toast("没有进行中的夜晚", { kind: "rose" });
        setTimeout(function () { if (alive) App.Router.reset("boot"); }, 0);
        return;
      }
      var ph = state.phase;
      if (ph === "draft" || ph === "event" || ph === "act" || ph === "shop" || ph === "finale") {
        setTimeout(function () {
          if (alive && state) routeByPhase(state);
        }, 0);
        return;
      }
      render();
    },
    unmount: function () {
      /* 路由在同一屏上重挂（如 boot→play→play）时，旧实例的延迟 unmount 不能清掉新实例的状态 */
      var el = root;
      try {
        if (el && document.body.getAttribute("data-screen") === "play" && document.documentElement.contains(el)) return;
      } catch (e) {}
      alive = false;
      busy = false;
      state = null;
      root = null;
    }
  };
})();

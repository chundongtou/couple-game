/* =============================================================================
 * V3 ui/screens/act.js —— 幕转场（幕名 / 副标题 / 评语 / 共鸣检定 / 资源结算）
 * -----------------------------------------------------------------------------
 * 契约：App.Screens.act = { mount(root, params), unmount() }
 * 数据：App.Engine.actInfo(st)、App.Balance.actScore / actThreshold、st.actScores
 * 出口：act-continue → App.Engine.leaveAct → journey（末幕 → finale）
 *       act-shop     → App.Router.go('shop')
 * ========================================================================== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;
  var UI = App.UI;
  var B = App.Balance;

  var NUMERALS = ["壹", "贰", "叁"];
  var nexts = ["暗涌", "靠岸", "天亮"];
  var cleanups = [];
  var ringRaf = null;

  UI.injectStyle("act", [
    ".act { position: relative; isolation: isolate; overflow: hidden; justify-content: flex-start;",
    "  padding-top: calc(66px + var(--safe-t)); }",
    ".act-atmos { position: absolute; inset: 0; pointer-events: none; z-index: -1; overflow: hidden; }",
    ".act-atmos::before { content: ''; position: absolute; left: 50%; top: 24%; width: 160vw; height: 90vw; transform: translate(-50%, -30%);",
    "  background: radial-gradient(closest-side, var(--accent-glow, rgba(243,200,121,.2)), transparent 70%); filter: blur(14px); opacity: .9; }",
    ".act-atmos::after { content: ''; position: absolute; left: 50%; bottom: 8%; width: 130vw; height: 46vw; transform: translateX(-50%);",
    "  background: radial-gradient(closest-side, rgba(154,124,255,.14), transparent 72%); filter: blur(18px); }",
    ".act-numeral { position: absolute; right: -16px; top: 40px; font-family: Georgia, 'Songti SC', 'SimSun', serif;",
    "  font-size: 168px; line-height: .9; font-weight: 600; color: rgba(255,255,255,.045); pointer-events: none;",
    "  animation: actNumeral 1.1s var(--ease-out) both; }",
    "@keyframes actNumeral { from { opacity: 0; transform: translateY(18px) scale(.94); } to { opacity: 1; transform: none; } }",

    /* 入场 */
    ".act-rise { opacity: 0; animation: actRise .66s var(--ease-out) both; animation-delay: var(--d, 0ms); }",
    "@keyframes actRise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }",
    /* 减少动效：只淡入 */
    "body.reduce .act-rise { animation-name: actFadeIn !important; animation-duration: .2s !important; animation-delay: 0ms !important; }",
    "body.reduce .act-numeral { animation-name: actFadeIn !important; animation-duration: .2s !important; }",
    "@keyframes actFadeIn { from { opacity: 0; } to { opacity: 1; } }",

    /* 头部 */
    ".act-top { position: absolute; left: 20px; right: 20px; top: calc(18px + var(--safe-t)); display: flex; align-items: center; justify-content: space-between; }",
    ".act-top .k { font-size: 10.5px; letter-spacing: .32em; color: var(--dim2); font-weight: 700; text-transform: uppercase; }",
    ".act-top .tag { display: inline-flex; align-items: center; gap: 6px; font-size: 10.5px; letter-spacing: .12em; color: var(--dim2); }",
    ".act-top .tag i { width: 5px; height: 5px; border-radius: 50%; background: var(--accent, var(--gold)); box-shadow: 0 0 10px var(--accent, var(--gold)); display: inline-block; }",

    /* 标题 */
    ".act-hero { position: relative; margin-top: 8px; }",
    ".act-kicker { display: flex; align-items: center; gap: 9px; }",
    ".act-kicker .ln { width: 26px; height: 1px; background: var(--accent, var(--gold)); opacity: .85; }",
    ".act-title { margin-top: 12px; font-size: clamp(46px, 15vw, 64px); line-height: 1.02; font-weight: 900; letter-spacing: .10em; }",
    ".act-title .g { background: linear-gradient(100deg, #fff 4%, var(--accent, var(--gold)) 52%, var(--rose) 118%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }",
    ".act-sub { margin-top: 12px; font-size: 13px; color: var(--dim); letter-spacing: .06em; line-height: 1.7; }",
    ".act-lines { margin-top: 18px; display: flex; flex-direction: column; gap: 9px; }",
    ".act-line { display: flex; gap: 9px; font-size: 13.5px; line-height: 1.8; color: #ded4f2; letter-spacing: .02em; }",
    ".act-line .b { flex: 0 0 5px; height: 5px; margin-top: 10px; border-radius: 50%; background: var(--accent, var(--gold)); opacity: .85; box-shadow: 0 0 10px var(--accent, var(--gold)); }",

    /* 共鸣检定 */
    ".act-verdict { position: relative; margin-top: 20px; padding: 16px; border-radius: 24px;",
    "  background: linear-gradient(155deg, rgba(255,255,255,.085), rgba(255,255,255,.025));",
    "  border: 1px solid var(--line2); box-shadow: var(--sh-1); display: flex; align-items: center; gap: 16px; }",
    ".act-ring { position: relative; flex: 0 0 auto; width: 92px; height: 92px; border-radius: 50%;",
    "  background: conic-gradient(var(--accent, var(--gold)) calc(var(--p, 0) * 1%), rgba(255,255,255,.09) 0);",
    "  display: grid; place-items: center; box-shadow: 0 0 30px var(--accent-glow, rgba(243,200,121,.2)); }",
    ".act-ring::before { content: ''; position: absolute; inset: 7px; border-radius: 50%; background: #150e27; box-shadow: inset 0 0 18px rgba(0,0,0,.55); }",
    ".act-ring .val { position: relative; text-align: center; line-height: 1; }",
    ".act-ring .val b { display: inline-block; font-size: 23px; font-weight: 900; font-variant-numeric: tabular-nums; letter-spacing: -.02em; }",
    ".act-ring .val em { font-style: normal; font-size: 11px; font-weight: 800; color: var(--dim); margin-left: 1px; vertical-align: 2px; }",
    ".act-ring .val span { display: block; margin-top: 4px; font-size: 9.5px; letter-spacing: .08em; color: var(--dim2); font-variant-numeric: tabular-nums; }",
    ".act-vbody { flex: 1 1 auto; min-width: 0; }",
    ".act-vtitle { display: flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 800; letter-spacing: .03em; }",
    ".act-badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 9px; border-radius: 99px; font-size: 10.5px; font-weight: 800; letter-spacing: .08em; }",
    ".act-badge.good { color: #23170a; background: linear-gradient(135deg, var(--gold), #ffb27a); }",
    ".act-badge.soft { color: #ffd7dc; background: rgba(255,95,109,.16); border: 1px solid rgba(255,95,109,.38); }",
    ".act-vtext { margin-top: 7px; font-size: 12px; line-height: 1.65; color: var(--dim); letter-spacing: .01em; }",
    ".act-vtext b { color: var(--ink); font-weight: 700; }",
    ".act-reward { margin-top: 9px; display: flex; flex-wrap: wrap; gap: 6px; }",
    ".act-rchip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 9px; border-radius: 99px; font-size: 10.5px; font-weight: 700;",
    "  color: var(--gold); background: rgba(243,200,121,.10); border: 1px solid rgba(243,200,121,.32); }",
    ".act-rchip.soft { color: var(--dim); background: rgba(255,255,255,.05); border-color: var(--line); }",

    /* 资源结算 */
    ".act-res { margin-top: 14px; }",
    ".act-res-h { display: flex; align-items: center; justify-content: space-between; margin-bottom: 9px; }",
    ".act-res-h .k { font-size: 10.5px; letter-spacing: .22em; color: var(--dim2); font-weight: 700; }",
    ".act-res-h .n { font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; }",
    ".act-res-row { display: flex; gap: 8px; }",
    ".act-res-cell { flex: 1 1 0; min-width: 0; padding: 10px 6px 9px; border-radius: 15px; text-align: center;",
    "  background: var(--glass); border: 1px solid var(--line); }",
    ".act-res-cell i { display: block; font-style: normal; font-size: 12px; opacity: .9; }",
    ".act-res-cell b { display: block; margin-top: 2px; font-size: 17px; font-weight: 800; font-variant-numeric: tabular-nums; letter-spacing: .01em; }",
    ".act-res-cell span { display: block; margin-top: 1px; font-size: 9.5px; color: var(--dim2); letter-spacing: .08em; }",
    ".act-res-cell.heart i, .act-res-cell.heart b { color: var(--heart); }",
    ".act-res-cell.tension i, .act-res-cell.tension b { color: var(--tension); }",
    ".act-res-cell.sync i, .act-res-cell.sync b { color: var(--sync); }",
    ".act-res-cell.coins i, .act-res-cell.coins b { color: var(--coins); }",

    /* 自适应提示 */
    ".act-adapt { display: flex; align-items: flex-start; gap: 10px; margin-top: 12px; padding: 11px 13px; border-radius: 16px;",
    "  background: rgba(255,255,255,.04); border: 1px dashed var(--line2); }",
    ".act-adapt .ic { flex: 0 0 auto; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center;",
    "  background: rgba(255,255,255,.06); font-size: 13px; }",
    ".act-adapt p { font-size: 11.5px; line-height: 1.7; color: var(--dim); letter-spacing: .01em; }",
    ".act-adapt b { color: var(--ink); font-weight: 700; }",

    /* 底部按钮 */
    ".act-spacer { flex: 1 1 auto; min-height: 18px; }",
    ".act-actions { display: flex; flex-direction: column; gap: 10px;",
    "  /* 左下角留给全局「停」安全词胶囊（core/safe.js） */",
    "  padding-left: 58px; }",
    ".act-actions .row2 { display: flex; gap: 10px; }",
    ".act-actions .row2 .btn { flex: 1; min-height: 48px; padding: 0 12px; font-size: 13.5px; letter-spacing: .04em; white-space: nowrap; }",
    ".act-next { margin-top: 12px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .12em; }",
    ".act-next b { color: var(--dim); font-weight: 700; letter-spacing: .18em; }",
    ".act-finale-note { margin-top: 12px; text-align: center; font-size: 10.5px; color: rgba(243,200,121,.72); letter-spacing: .12em; }",

    "@media (max-height: 730px) {",
    "  .act { padding-top: calc(54px + var(--safe-t)); }",
    "  .act-title { font-size: clamp(36px, 11vw, 46px); }",
    "  .act-sub { margin-top: 8px; }",
    "  .act-lines { margin-top: 10px; gap: 5px; }",
    "  .act-line { font-size: 12px; line-height: 1.65; }",
    "  .act-verdict { margin-top: 12px; padding: 12px; gap: 11px; }",
    "  .act-ring { width: 72px; height: 72px; }",
    "  .act-ring .val b { font-size: 19px; }",
    "  .act-vtext { margin-top: 5px; font-size: 11.5px; }",
    "  .act-reward { margin-top: 7px; }",
    "  .act-res { margin-top: 9px; }",
    "  .act-res-cell { padding: 8px 4px 7px; }",
    "  .act-res-cell b { font-size: 14.5px; }",
    "  .act-adapt { margin-top: 9px; padding: 9px 11px; }",
    "  .act-actions .btn { min-height: 50px; }",
    "  .act-next { margin-top: 7px; }",
    "  .act-numeral { font-size: 130px; top: 26px; }",
    "}",
    "@media (max-width: 360px) {",
    "  .act-numeral { font-size: 168px; top: -22px; }",
    "  .act-res-cell b { font-size: 15px; }",
    "}"
  ].join("\n"));

  function later(fn, ms) {
    var id = setTimeout(fn, ms);
    cleanups.push(function () { clearTimeout(id); });
    return id;
  }
  function clearTimers() {
    while (cleanups.length) { try { cleanups.pop()(); } catch (e) {} }
    if (ringRaf) { try { cancelAnimationFrame(ringRaf); } catch (e) {} ringRaf = null; }
  }
  function save(st) { try { App.Store.saveSession(st); } catch (e) {} }
  function accentGlow(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length !== 6) return "rgba(243,200,121,.20)";
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + ",.22)";
  }
  function actMeta(st) {
    try { return App.Engine.actInfo(st); } catch (e) {
      return { act: st.act || 1, name: "第 " + (st.act || 1) + " 幕", sub: "", accent: "", outtro: null, rounds: 5, threshold: 12 };
    }
  }
  function lastScore(st, meta) {
    var list = st.actScores || [];
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i] && list[i].act === meta.act) return list[i];
    }
    var score = 0;
    try { score = B.actScore(st); } catch (e) { score = 0; }
    var threshold = meta.threshold || 12;
    return { act: meta.act, score: score, threshold: threshold, good: score >= threshold };
  }
  function outtroLines(meta, good) {
    var o = meta && meta.outtro;
    var lines = [];
    if (o && good && o.good && o.good.length) lines = o.good;
    else if (o && !good && o.soft && o.soft.length) lines = o.soft;
    else lines = good ? ["潮水把船托起来一点。", "你们比出发时更靠近。"] : ["水面很安静。", "不急着靠岸，也是一种靠近。"];
    return lines.slice(0, 2);
  }
  function chipsHtml(meta, good, st) {
    var out = "";
    if (good) {
      out += '<span class="act-rchip">◈ +' + U.round((B.ACT_REWARD && B.ACT_REWARD.coins) || 5) + " 星屑</span>";
      var last = (st.actScores || []).slice(-1)[0] || {};
      if (last.reward && last.reward.token) {
        var tm = (B.TOKEN_META || {})[last.reward.token] || { name: "券" };
        out += '<span class="act-rchip">🎟 ' + U.escape(tm.name) + " ×1</span>";
      } else {
        out += '<span class="act-rchip soft">🎟 下一幕的抽卡变得更勇敢</span>';
      }
    } else {
      out += '<span class="act-rchip soft">↓ 下一幕手牌温柔一档</span>';
    }
    return out;
  }
  function animateRing(el, valueEl, target, reduced) {
    var to = U.clamp(Math.round(target), 0, 100);
    if (reduced) {
      if (el) el.style.setProperty("--p", String(to));
      if (valueEl) valueEl.textContent = String(to);
      return;
    }
    var t0 = null;
    var dur = 900;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var v = Math.round(to * e);
      if (el) el.style.setProperty("--p", String(v));
      if (valueEl) valueEl.textContent = String(v);
      if (p < 1) ringRaf = requestAnimationFrame(step);
      else ringRaf = null;
    }
    ringRaf = requestAnimationFrame(step);
  }

  function render(root, st) {
    var meta = actMeta(st);
    var accent = meta.accent || ["#e9b872", "#8d7cf6", "#6fd3c7"][U.clamp((meta.act || 1) - 1, 0, 2)];
    var info = lastScore(st, meta);
    var good = !!info.good;
    var score = Number(info.score) || 0;
    var threshold = Math.max(1, Number(info.threshold) || 12);
    var pct = U.clamp(Math.round(score / threshold * 100), 0, 100);
    var lastAct = !!st.lastAct || (meta.act || 1) >= 3;
    var nextName = lastAct ? "天亮" : (nexts[U.clamp(meta.act || 1, 0, 2)] || "下一幕");
    var lines = outtroLines(meta, good);
    var res = st.resources || {};
    var reduced = M.reduced();
    var actNo = U.clamp(meta.act || 1, 1, 3);

    root.innerHTML =
      '<div class="page act" style="--accent:' + accent + ";--accent-glow:" + accentGlow(accent) + '">' +
      '<div class="act-atmos" aria-hidden="true"></div>' +
      '<div class="act-numeral" aria-hidden="true">' + NUMERALS[actNo - 1] + "</div>" +

      '<div class="act-top">' +
      '<span class="k">ACT ' + actNo + " / 3 · 幕间</span>" +
      '<span class="tag"><i></i>' + (lastAct ? "最后一程" : "夜还长") + "</span>" +
      "</div>" +

      '<section class="act-hero act-rise" style="--d:40ms">' +
      '<div class="act-kicker"><span class="ln"></span><span class="kicker">第 ' + actNo + " 幕 · 结束</span></div>" +
      '<h1 class="act-title"><span class="g">' + U.escape(meta.name || "潮汐") + "</span></h1>" +
      (meta.sub ? '<p class="act-sub">' + U.escape(meta.sub) + "</p>" : "") +
      '<div class="act-lines">' +
      lines.map(function (ln, i) {
        return '<div class="act-line act-rise" style="--d:' + (180 + i * 90) + 'ms"><span class="b"></span><div>' + U.escape(ln) + "</div></div>";
      }).join("") +
      "</div>" +
      "</section>" +

      /* 共鸣检定 */
      '<section class="act-verdict act-rise" style="--d:360ms">' +
      '<div class="act-ring" data-ring aria-hidden="true"><div class="val"><b data-ring-val>0</b><em>%</em><span data-ring-ratio>' +
      (Math.round(score * 10) / 10) + " / " + threshold + "</span></div></div>" +
      '<div class="act-vbody">' +
      '<div class="act-vtitle"><span>共鸣检定</span><span class="act-badge ' + (good ? "good" : "soft") + '">' + (good ? "达成" : "未达成") + "</span></div>" +
      '<div class="act-vtext">本幕共鸣 <b>' + (Math.round(score * 10) / 10) + "</b> / 目标 <b>" + threshold + "</b> · " +
      (good ? "你们在同一段浪里。" : "船把下一段浪调低了一点。") + "</div>" +
      '<div class="act-reward">' + chipsHtml(meta, good, st) + "</div>" +      "</div></section>" +

      /* 资源结算 */
      '<section class="act-res act-rise" style="--d:440ms">' +
      '<div class="act-res-h"><span class="k">此刻的资源</span><span class="n">本幕结束结算</span></div>' +
      '<div class="act-res-row">' +
      '<div class="act-res-cell heart"><i aria-hidden="true">♥</i><b data-c="heart">0</b><span>心动</span></div>' +
      '<div class="act-res-cell tension"><i aria-hidden="true">✦</i><b data-c="tension">0</b><span>张力</span></div>' +
      '<div class="act-res-cell sync"><i aria-hidden="true">⌁</i><b data-c="sync">0</b><span>默契</span></div>' +
      '<div class="act-res-cell coins"><i aria-hidden="true">◈</i><b data-c="coins">0</b><span>星屑</span></div>' +
      "</div></section>" +

      /* 自适应/提示 */
      (good
        ? '<div class="act-adapt act-rise" style="--d:500ms"><span class="ic" aria-hidden="true">🕯️</span><p>共鸣达成，船走得更稳。<b>下一幕的卡会更勇敢一点</b>——你们已经证明接得住。</p></div>'
        : '<div class="act-adapt act-rise" style="--d:500ms"><span class="ic" aria-hidden="true">🌤️</span><p>共鸣没到目标，船自己降了速。<b>下一幕手牌整体降 1 星</b>，这不是退步，是船在照顾你们。</p></div>') +

      '<div class="act-spacer"></div>' +

      '<div class="act-actions act-rise" style="--d:560ms">' +
      '<button class="btn primary xl wide" type="button" data-test="act-continue">' +
      (lastAct ? "迎接结局" : "继续航行") + ' <span aria-hidden="true">→</span></button>' +
      (lastAct
        ? '<div class="act-finale-note">天亮之前，还有最后几句话</div>'
        : '<button class="btn soft wide" type="button" data-test="act-shop" aria-label="进入星屑商店，当前 ' +
          U.round((res.coins || 0)) + ' 星屑">◈ 星屑商店 · ' + U.round((res.coins || 0)) + ' 星屑</button>') +
      "</div>" +
      '<div class="act-next">下一幕 · <b>' + U.escape(nextName) + "</b></div>" +
      "</div>";

    /* 数字动画 */
    var ring = U.qs("[data-ring]", root);
    var ringVal = U.qs("[data-ring-val]", root);
    later(function () { animateRing(ring, ringVal, pct, reduced); }, reduced ? 0 : 380);
    ["heart", "tension", "sync", "coins"].forEach(function (k, i) {
      var el = U.qs('[data-c="' + k + '"]', root);
      if (!el) return;
      var to = U.round(res[k] || 0);
      later(function () {
        try { if (M && M.count) M.count(el, to, { from: 0, dur: 700 }); else el.textContent = String(to); } catch (e) { el.textContent = String(to); }
      }, reduced ? 0 : 460 + i * 70);
    });

    /* 按钮 */
    var cont = U.qs('[data-test="act-continue"]', root);
    if (cont) {
      cont.addEventListener("click", function () {
        if (cont.getAttribute("data-busy") === "1") return;
        cont.setAttribute("data-busy", "1");
        App.Audio.play("tap");
        UI.haptic("light");
        var cur = App.Store.getSession() || st;
        var out = null;
        try { out = App.Engine.leaveAct(cur); } catch (e) { out = null; }
        /* leaveAct 是状态型动作：返回 state，动作事件挂在 state.outEvents */
        var evs = (out && (out.outEvents || out.events)) || [];
        var blocked = evs.some(function (e) { return e && e.blocked; });
        if (!out || blocked) {
          UI.toast("这艘船卡住了，回标题再试试", { kind: "rose" });
          cont.removeAttribute("data-busy");
          return;
        }
        var next = out.state || out;
        save(next);
        /* 末幕：leaveAct 只把 phase 切到 finale，不会生成结局。
         * finale 屏依赖 state.result；这里补一次 Engine.finish() 再进结局屏。 */
        if (next.phase === "finale" && !next.result) {
          try {
            var fin = App.Engine.finish(next);
            if (fin && fin.state) { next = fin.state; save(next); }
          } catch (e) {}
        }
        var reducedNow = M.reduced();
        later(function () {
          if (next.phase === "finale") {
            if (App.Screens && App.Screens.finale) App.Router.go("finale", { state: next });
            else { UI.toast("结局正在写，先回标题", { kind: "gold" }); App.Router.reset("boot"); }
            return;
          }
          App.Audio.play("act");
          if (App.Screens && App.Screens.journey) App.Router.go("journey");
          else App.Router.reset("boot");
        }, reducedNow ? 40 : 340);
      });
    }
    var shop = U.qs('[data-test="act-shop"]', root);
    if (shop) {
      shop.addEventListener("click", function () {
        App.Audio.play("tap");
        if (App.Screens && App.Screens.shop) App.Router.go("shop");
        else UI.toast("商店还没靠岸", { kind: "gold" });
      });
    }

    /* 喜悦粒子 */
    if (good) {
      later(function () {
        try {
          M.burst(window.innerWidth / 2, window.innerHeight * 0.34, { count: 26, radius: 150, colors: [accent, "#ffffff", "#f3c879", "#ff5f9e"] });
        } catch (e) {}
      }, reduced ? 0 : 520);
    }
  }

  App.Screens = App.Screens || {};
  App.Screens.act = {
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
      App.Audio.play("act");
      UI.haptic("light");
      render(root, st);
    },
    unmount: function () { clearTimers(); }
  };
})();

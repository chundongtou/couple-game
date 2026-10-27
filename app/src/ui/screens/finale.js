/* ===== V3 ui/screens/finale.js：终章 · 结局屏（结局揭晓 / 资源 / 奖项 / 海报 / 存回忆册） ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  /* ---------- 自包含样式（只用 base.css 令牌） ---------- */
  App.UI.injectStyle("finale", [
    ".finale { padding-top: calc(30px + var(--safe-t)); }",
    ".fn-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }",
    ".fn-night { font-size: 11px; color: var(--dim2); letter-spacing: .14em; }",
    ".fn-night b { color: var(--gold); font-weight: 700; }",
    ".fn-hero { position: relative; margin: 22px 0 0; padding: 6px 0 2px; }",
    ".fn-sweep { position: absolute; left: -24%; right: -24%; top: 4%; height: 160px; pointer-events: none;",
    "  background: linear-gradient(100deg, transparent 26%, rgba(243,200,121,.30) 46%, rgba(255,95,158,.28) 55%, transparent 74%);",
    "  filter: blur(16px); opacity: .0; transform: translateX(-110%); }",
    ".fn-hero.play .fn-sweep { animation: fnSweep 2.1s var(--ease-out) .1s forwards; }",
    "@keyframes fnSweep { 0% { opacity: 0; transform: translateX(-110%); } 18% { opacity: 1; } 100% { opacity: 0; transform: translateX(110%); } }",
    ".fn-vinyl { position: absolute; right: -76px; top: -66px; width: 260px; height: 260px; border-radius: 50%;",
    "  border: 1px solid var(--line); opacity: .5; pointer-events: none; }",
    ".fn-vinyl::before, .fn-vinyl::after { content: ''; position: absolute; border-radius: 50%; border: 1px solid var(--line); }",
    ".fn-vinyl::before { inset: 26px; } .fn-vinyl::after { inset: 62px; }",
    ".fn-kicker { font-size: 10.5px; letter-spacing: .38em; color: var(--fn-accent, var(--gold)); font-weight: 700; }",
    ".fn-title { margin: 14px 0 0; font-size: clamp(38px, 11.6vw, 54px); line-height: 1.08; font-weight: 800; letter-spacing: .04em;",
    "  opacity: 0; transform: translateY(16px); }",
    ".fn-hero.on .fn-title { opacity: 1; transform: none; transition: opacity .7s var(--ease-out), transform .7s var(--ease-out); }",
    ".fn-quote { margin-top: 16px; color: var(--dim); font-size: 14px; line-height: 1.9; max-width: 300px; opacity: 0; }",
    ".fn-hero.on .fn-quote { opacity: 1; transition: opacity .8s var(--ease-out) .24s; }",
    ".fn-rule { display: flex; align-items: center; gap: 10px; margin: 22px 0 0; opacity: 0; }",
    ".fn-rule::before { content: ''; width: 46px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }",
    ".fn-rule i { width: 5px; height: 5px; border-radius: 50%; background: var(--gold); box-shadow: var(--glow-gold); }",
    ".fn-rule::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, var(--line2), transparent); }",
    ".fn-hero.on .fn-rule { opacity: 1; transition: opacity .6s var(--ease) .4s; }",
    ".fn-who { margin-top: 14px; font-size: 12px; color: var(--dim2); letter-spacing: .06em; opacity: 0; }",
    ".fn-who b { color: var(--ink); font-weight: 700; }",
    ".fn-who span { color: var(--rose); padding: 0 3px; }",
    ".fn-hero.on .fn-who { opacity: 1; transition: opacity .6s var(--ease) .5s; }",
    ".fn-lines { margin-top: 26px; display: flex; flex-direction: column; gap: 13px; }",
    ".fn-line { color: var(--ink); font-size: 15px; line-height: 1.95; letter-spacing: .015em; opacity: 0; transform: translateY(10px); }",
    ".fn-line.on { opacity: .92; transform: none; transition: opacity .62s var(--ease-out), transform .62s var(--ease-out); }",
    ".fn-stats { margin-top: 30px; padding: 18px 16px 14px; }",
    ".fn-stats-top { display: flex; align-items: flex-end; gap: 8px; }",
    ".fn-stat { flex: 1; text-align: center; }",
    ".fn-stat i { font-style: normal; font-size: 15px; display: block; line-height: 1; }",
    ".fn-stat b { display: block; margin-top: 8px; font-size: 27px; font-weight: 800; letter-spacing: .02em; font-variant-numeric: tabular-nums; line-height: 1; }",
    ".fn-stat span { display: block; margin-top: 7px; font-size: 10.5px; color: var(--dim2); letter-spacing: .18em; }",
    ".fn-split { width: 1px; height: 44px; background: var(--line); align-self: center; }",
    ".fn-stat.heart b { color: var(--heart); } .fn-stat.tension b { color: var(--tension); } .fn-stat.sync b { color: var(--sync); }",
    ".fn-stat.heart i { color: var(--heart); } .fn-stat.tension i { color: var(--tension); } .fn-stat.sync i { color: var(--sync); }",
    ".fn-meta { margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 11px; color: var(--dim2); letter-spacing: .04em; }",
    ".fn-meta b { color: var(--dim); font-weight: 700; }",
    ".fn-awards { margin-top: 26px; }",
    ".fn-sec-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }",
    ".fn-sec-head .kicker { color: var(--dim2); }",
    ".fn-sec-head::after { content: ''; flex: 1; height: 1px; background: var(--line); }",
    ".fn-award-list { display: flex; flex-direction: column; gap: 8px; }",
    ".fn-award { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--r-md);",
    "  background: linear-gradient(140deg, rgba(255,255,255,.075), rgba(255,255,255,.028)); border: 1px solid var(--line);",
    "  opacity: 0; transform: translateY(8px); }",
    ".fn-award.on { opacity: 1; transform: none; transition: opacity .5s var(--ease-out), transform .5s var(--ease-out); }",
    ".fn-award .ic { width: 38px; height: 38px; flex: 0 0 auto; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center;",
    "  font-size: 19px; background: rgba(243,200,121,.10); border: 1px solid rgba(243,200,121,.22); }",
    ".fn-award b { display: block; font-size: 14px; font-weight: 700; letter-spacing: .02em; }",
    ".fn-award span { display: block; margin-top: 2px; font-size: 11px; color: var(--dim2); }",
    ".fn-poster-wrap { margin-top: 30px; }",
    ".fn-poster-frame { position: relative; border-radius: var(--r-md); overflow: hidden;",
    "  border: 1px solid var(--line2); box-shadow: var(--sh-2); background: var(--bg1); }",
    ".fn-poster { display: block; width: 100%; height: auto; }",
    ".fn-poster-cap { margin-top: 8px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .08em; }",
    ".fn-actions { margin-top: 26px; display: flex; flex-direction: column; gap: 10px; }",
    ".fn-row { display: flex; gap: 10px; }",
    ".fn-row .btn { flex: 1; }",
    ".fn-foot { margin: 26px 0 4px; text-align: center; font-size: 10.5px; color: var(--dim2); letter-spacing: .06em; line-height: 1.9; }",
    ".fn-empty { margin-top: 26px; padding: 22px 18px; text-align: center; }",
    ".fn-empty .ic { font-size: 30px; opacity: .8; }",
    ".fn-empty h2 { margin-top: 10px; font-size: 17px; font-weight: 700; }",
    ".fn-empty p { margin-top: 6px; color: var(--dim); font-size: 12.5px; line-height: 1.8; }",
    "@media (max-width: 360px) {",
    "  .fn-stat b { font-size: 24px; }",
    "  .fn-title { font-size: 34px; }",
    "}"
  ].join("\n"));

  /* ---------- 数据整理 ---------- */
  function num(v, d) { var n = Number(v); return isFinite(n) ? n : (d || 0); }

  function contentEndings() {
    var c = window.CONTENT;
    return c && c.endings instanceof Array ? c.endings : [];
  }

  function findContentEnding(id) {
    var list = contentEndings();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && (list[i].id === id || list[i].kind === id)) return list[i];
    }
    return null;
  }

  function fmtStamp(ts) {
    var d = new Date(ts || Date.now());
    return U.fmtDate(ts) + " · " + U.fmtTime(ts);
  }

  function ymd(ts) {
    var d = new Date(ts || Date.now());
    return d.getFullYear() + "-" + U.pad2(d.getMonth() + 1) + "-" + U.pad2(d.getDate());
  }

  /* 兜底：act→finale 等路径可能没有调用 Engine.finish（state.result 为空）。
     进入 finale 时补一次结算并落盘，保证刷新/继续进入 finale 也是同一个结局。 */
  function settleState(params) {
    var state = (params && params.state) || null;
    if (!state || typeof state !== "object") {
      try { state = App.Store.getSession(); } catch (e) { state = null; }
    }
    if (!state || typeof state !== "object") return null;
    var missing = !state.result || !state.result.endingId;
    if (!missing) return state;
    try {
      var Eng = App.Engine;
      var done = null;
      if (Eng) {
        if (state.flags && state.flags.safeWord && typeof Eng.safeWord === "function") done = Eng.safeWord(state);
        else if (typeof Eng.finish === "function") done = Eng.finish(state);
      }
      if (done && done.state) state = done.state;
      else if (done && done.endingId) state.result = done;
      try { App.Store.saveSession(state); } catch (e2) {}
    } catch (e3) {}
    return state;
  }

  function resolveData(state) {
    if (!state || typeof state !== "object") return null;
    var result = state.result || {};
    var meta = findContentEnding(result.endingId);
    var text = [];
    if (result.text instanceof Array && result.text.length) text = result.text.slice();
    else if (meta && meta.text instanceof Array) text = meta.text.slice();
    if (!text.length) {
      text = [result.quote || "船靠岸了。这一晚没有变成什么故事，但它发生过。"];
    }
    var settings = state.settings || {};
    var stats = result.stats || {};
    var res = state.resources || {};
    var rounds = num(stats.rounds || state.round, 0);
    var norm = {
      endingId: result.endingId || (meta && meta.id) || "fallback",
      endingName: result.endingName || (meta && meta.name) || "一段夜航",
      quote: result.quote || (meta && meta.quote) || "",
      accent: result.accent || (meta && meta.accent) || "#f3c879",
      text: text,
      names: state.names || { a: "他", b: "她" },
      ts: state.ts || result.ts || Date.now(),
      length: stats.length || settings.length || "classic",
      heart: num(stats.heart, num(res.heart, 0)),
      tension: num(stats.tension, num(res.tension, 0)),
      sync: num(stats.sync, num(res.sync, 0)),
      coins: num(stats.coins, num(res.coins, 0)),
      completes: num(stats.completes, num(state.completes, 0)),
      skips: num(stats.skips, num(state.skips, 0)),
      maxCombo: num(stats.maxCombo, num(state.maxCombo, 0)),
      maxStar: num(stats.maxStar, num(stats.maxStarSeen, num(state.maxStarSeen, 0))),
      rounds: rounds,
      round: num(stats.round, num(state.round, rounds)),
      gentle: num(stats.gentle, num(state.gentle, 0)),
      safeWord: !!(stats.safeWord || (state.flags && state.flags.safeWord)),
      stateId: state.id || "",
      awards: normalizeAwards(result.awards)
    };
    return norm;
  }

  var FALLBACK_AWARDS = [
    { id: "aboard", name: "登船", icon: "⚓", desc: "今晚，你们真的出发了" },
    { id: "sea-listener", name: "听海的人", icon: "🎧", desc: "听见了对方的频率" }
  ];

  function normalizeAwards(list) {
    var out = [];
    if (list instanceof Array) {
      for (var i = 0; i < list.length && out.length < 3; i++) {
        var a = list[i];
        if (!a) continue;
        if (typeof a === "string") out.push({ id: "aw" + i, name: a, icon: "✧", desc: "" });
        else out.push({ id: a.id || ("aw" + i), name: a.name || "奖项", icon: a.icon || "✧", desc: a.desc || "" });
      }
    }
    for (var j = 0; out.length < 2 && j < FALLBACK_AWARDS.length; j++) out.push(FALLBACK_AWARDS[j]);
    return out.slice(0, 3);
  }

  /* ---------- 海报绘制（720×1080，纯 canvas，无外部资源） ---------- */
  var FONT_FAMILY = '"PingFang SC","Microsoft YaHei","Hiragino Sans GB",sans-serif';

  function font(size, weight) {
    return (weight || "600") + " " + size + "px " + FONT_FAMILY;
  }

  function hashStr(s) {
    var h = 2166136261;
    s = String(s || "");
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function wrapText(ctx, text, maxW) {
    var chars = String(text || "").split("");
    var lines = [];
    var line = "";
    for (var i = 0; i < chars.length; i++) {
      var next = line + chars[i];
      if (ctx.measureText(next).width > maxW && line) {
        lines.push(line);
        line = chars[i];
      } else {
        line = next;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function spacedText(ctx, text, cx, y, gap) {
    var chars = String(text || "").split("");
    var total = 0;
    var i;
    for (i = 0; i < chars.length; i++) total += ctx.measureText(chars[i]).width + gap;
    total -= gap;
    var x = cx - total / 2;
    ctx.textAlign = "left";
    for (i = 0; i < chars.length; i++) {
      ctx.fillText(chars[i], x, y);
      x += ctx.measureText(chars[i]).width + gap;
    }
    ctx.textAlign = "center";
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  var POSTER_W = 720;
  var POSTER_H = 1080;

  function drawPoster(canvas, d) {
    if (!canvas || !canvas.getContext) return false;
    var ctx = canvas.getContext("2d");
    canvas.width = POSTER_W;
    canvas.height = POSTER_H;
    var W = POSTER_W, H = POSTER_H;

    /* 底：深夜海域渐变 */
    var g = ctx.createLinearGradient(0, 0, W * 0.6, H);
    g.addColorStop(0, "#090512");
    g.addColorStop(0.52, "#1b1233");
    g.addColorStop(1, "#070310");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    /* 极光晕 */
    function glow(x, y, r, color) {
      var rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, color);
      rg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    glow(574, 208, 350, "rgba(255,95,158,.26)");
    glow(118, 672, 400, "rgba(154,124,255,.20)");
    glow(500, 1004, 300, "rgba(243,200,121,.10)");

    /* 星点（按结局+日期固定，重绘稳定） */
    var rnd = U.mulberry32(hashStr(d.endingId + "|" + ymd(d.ts) + "|" + d.endingName));
    for (var i = 0; i < 130; i++) {
      var sx = rnd() * W;
      var sy = rnd() * H;
      var sr = 0.4 + rnd() * 1.7;
      ctx.fillStyle = "rgba(255,255,255," + (0.22 + rnd() * 0.6).toFixed(2) + ")";
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, 7);
      ctx.fill();
    }

    /* 唱片环（右上） */
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,.055)";
    ctx.lineWidth = 1.2;
    [118, 152, 190, 232].forEach(function (r) {
      ctx.beginPath(); ctx.arc(W - 6, 300, r, 0, 7); ctx.stroke();
    });
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    /* 品牌 */
    ctx.fillStyle = "rgba(243,200,121,.82)";
    ctx.font = font(19, "700");
    spacedText(ctx, "COUPLE VOYAGE", W / 2, 92, 7);
    ctx.fillStyle = "rgba(179,166,201,.62)";
    ctx.font = font(15, "600");
    spacedText(ctx, "升温夜航", W / 2, 126, 6);

    /* ENDING 分割线 */
    ctx.strokeStyle = "rgba(243,200,121,.45)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 104, 168); ctx.lineTo(W / 2 - 48, 168);
    ctx.moveTo(W / 2 + 48, 168); ctx.lineTo(W / 2 + 104, 168);
    ctx.stroke();
    ctx.fillStyle = "rgba(243,200,121,.9)";
    ctx.font = font(15, "700");
    spacedText(ctx, "ENDING", W / 2, 173, 5);

    /* 结局名 */
    var titleSize = d.endingName.length >= 8 ? 54 : (d.endingName.length >= 7 ? 60 : 66);
    ctx.font = font(titleSize, "800");
    var titleLines = wrapText(ctx, d.endingName, 606);
    var tg = ctx.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0);
    tg.addColorStop(0, "rgba(255,255,255,.96)");
    tg.addColorStop(0.42, "#f3c879");
    tg.addColorStop(1, "#ff5f9e");
    ctx.fillStyle = tg;
    var y = 274;
    for (var t = 0; t < titleLines.length; t++) {
      ctx.fillText(titleLines[t], W / 2, y);
      y += Math.round(titleSize * 1.16);
    }

    /* 细分割线 */
    y += 4;
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 64, y); ctx.lineTo(W / 2 + 64, y);
    ctx.stroke();
    ctx.fillStyle = "rgba(243,200,121,.85)";
    ctx.beginPath(); ctx.arc(W / 2, y, 2.4, 0, 7); ctx.fill();
    y += 14;

    /* 引言 */
    if (d.quote) {
      ctx.font = font(25, "500");
      ctx.fillStyle = "rgba(226,217,243,.86)";
      var qLines = wrapText(ctx, "“" + d.quote + "”", 540).slice(0, 3);
      for (var q = 0; q < qLines.length; q++) {
        ctx.fillText(qLines[q], W / 2, y + 42 + q * 40);
      }
      y += 42 + (qLines.length - 1) * 40 + 34;
    }

    /* 三资源 */
    y += 16;
    var cols = [
      { k: "heart", label: "心动", icon: "♥", color: "#ff5f9e", v: d.heart },
      { k: "tension", label: "张力", icon: "✦", color: "#ff9e5e", v: d.tension },
      { k: "sync", label: "默契", icon: "⌁", color: "#7ce0cf", v: d.sync }
    ];
    var colW = 168;
    var startX = W / 2 - colW;
    for (var c = 0; c < cols.length; c++) {
      var cx = startX + c * colW;
      ctx.textAlign = "center";
      ctx.fillStyle = cols[c].color;
      ctx.font = font(21, "700");
      ctx.fillText(cols[c].icon, cx, y + 24);
      ctx.font = font(46, "800");
      ctx.fillText(String(cols[c].v), cx, y + 78);
      ctx.fillStyle = "rgba(179,166,201,.66)";
      ctx.font = font(15, "600");
      spacedText(ctx, cols[c].label, cx, y + 106, 5);
    }
    y += 136;

    /* 奖项 */
    var aws = d.awards || [];
    if (aws.length) {
      var awFont = font(20, "600");
      ctx.font = awFont;
      var items = aws.map(function (a) { return a.icon + " " + a.name; });
      var widths = items.map(function (s) { return ctx.measureText(s).width; });
      var gap = 30;
      var totalW = widths.reduce(function (a, b) { return a + b; }, 0) + gap * (items.length - 1);
      var rows = totalW > 620 ? 2 : 1;
      ctx.fillStyle = "rgba(243,200,121,.92)";
      if (rows === 1) {
        var ax = W / 2 - totalW / 2;
        ctx.textAlign = "left";
        for (var a1 = 0; a1 < items.length; a1++) {
          ctx.fillText(items[a1], ax, y);
          ax += widths[a1] + gap;
        }
        ctx.textAlign = "center";
        y += 42;
      } else {
        ctx.textAlign = "center";
        ctx.fillText(items[0], W / 2, y);
        var rest = items.slice(1).join("    ");
        ctx.fillText(rest, W / 2, y + 36);
        y += 74;
      }
    }

    /* 名字 + 日期 */
    y += 6;
    ctx.fillStyle = "rgba(247,241,255,.95)";
    ctx.font = font(31, "700");
    ctx.fillText(d.names.a + "  ❤  " + d.names.b, W / 2, y);
    y += 36;
    ctx.fillStyle = "rgba(179,166,201,.7)";
    ctx.font = font(17, "500");
    ctx.fillText(fmtStamp(d.ts), W / 2, y);

    /* 底部信息（贴底） */
    ctx.strokeStyle = "rgba(255,255,255,.10)";
    ctx.beginPath();
    ctx.moveTo(W / 2 - 150, H - 128); ctx.lineTo(W / 2 + 150, H - 128);
    ctx.stroke();
    ctx.fillStyle = "rgba(179,166,201,.55)";
    ctx.font = font(15, "500");
    ctx.fillText("完成 " + d.completes + " · 跳过 " + d.skips + " · 共 " + d.rounds + " 回合", W / 2, H - 94);
    ctx.fillStyle = "rgba(243,200,121,.6)";
    ctx.font = font(14, "600");
    spacedText(ctx, "升温夜航 · 只在夜里出现", W / 2, H - 56, 3);

    return true;
  }

  /* ---------- 文件下载 / 分享 ---------- */
  function downloadBlob(blob, filename) {
    try {
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.rel = "noopener";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { a.remove(); } catch (e) {}
        try { URL.revokeObjectURL(url); } catch (e) {}
      }, 1500);
      return true;
    } catch (e) {
      return false;
    }
  }

  function canvasToBlob(canvas, cb) {
    try {
      if (canvas.toBlob) {
        canvas.toBlob(function (blob) { cb(blob || null); }, "image/png");
      } else {
        cb(null);
      }
    } catch (e) { cb(null); }
  }

  /* ---------- 屏幕实例 ---------- */
  var current = null;

  function clearTimers(inst) {
    if (!inst) return;
    (inst.timers || []).forEach(function (t) { clearTimeout(t); });
    inst.timers = [];
  }

  function addTimer(inst, fn, ms) {
    var t = setTimeout(function () {
      if (current !== inst) return;
      fn();
    }, ms);
    inst.timers.push(t);
    return t;
  }

  function renderFinale(root, d) {
    var dateTxt = fmtStamp(d.ts);
    var html =
      '<div class="page finale" style="--fn-accent:' + U.escape(d.accent) + '">' +
        '<div class="fn-top">' +
          '<div class="kicker">VOYAGE · 终章</div>' +
          '<div class="fn-night">第 <b>' + d.rounds + '</b> 回合的夜</div>' +
        "</div>" +
        '<section class="fn-hero' + (M.reduced() ? " on" : "") + '">' +
          '<div class="fn-sweep"></div>' +
          '<div class="fn-vinyl"></div>' +
          '<div class="fn-kicker">ENDING</div>' +
          '<h1 class="fn-title grad-text" data-test="finale-ending">' + U.escape(d.endingName) + "</h1>" +
          (d.quote ? '<p class="fn-quote">' + U.escape(d.quote) + "</p>" : "") +
          '<div class="fn-rule"><i></i></div>' +
          '<div class="fn-who"><b>' + U.escape(d.names.a) + "</b><span>❤</span><b>" + U.escape(d.names.b) + "</b> · " + U.escape(dateTxt) + "</div>" +
        "</section>" +
        '<section class="fn-lines" data-test="finale-text">' +
          d.text.map(function (p) { return '<p class="fn-line">' + U.escape(p) + "</p>"; }).join("") +
        "</section>" +
        '<section class="fn-stats glass" data-test="finale-stats">' +
          '<div class="fn-stats-top">' +
            '<div class="fn-stat heart"><i>♥</i><b data-stat="heart">0</b><span>心动</span></div>' +
            '<div class="fn-split"></div>' +
            '<div class="fn-stat tension"><i>✦</i><b data-stat="tension">0</b><span>张力</span></div>' +
            '<div class="fn-split"></div>' +
            '<div class="fn-stat sync"><i>⌁</i><b data-stat="sync">0</b><span>默契</span></div>' +
          "</div>" +
          '<div class="fn-meta">' +
            "<span>完成 <b>" + d.completes + "</b></span>" +
            "<span>跳过 <b>" + d.skips + "</b></span>" +
            "<span>最高连击 <b>" + d.maxCombo + "</b></span>" +
            "<span>最高星级 <b>★" + d.maxStar + "</b></span>" +
            "<span>共 <b>" + d.rounds + "</b> 回合</span>" +
            (d.safeWord ? "<span>温柔收尾 <b>已启用</b></span>" : "") +
          "</div>" +
        "</section>" +
        '<section class="fn-awards" data-test="finale-awards">' +
          '<div class="fn-sec-head"><span class="kicker">今晚的奖项</span></div>' +
          '<div class="fn-award-list">' +
            d.awards.map(function (a) {
              return '<div class="fn-award" data-award="' + U.escape(a.id) + '">' +
                '<span class="ic">' + U.escape(a.icon) + "</span>" +
                "<div><b>" + U.escape(a.name) + "</b>" + (a.desc ? "<span>" + U.escape(a.desc) + "</span>" : "") + "</div>" +
                "</div>";
            }).join("") +
          "</div>" +
        "</section>" +
        '<section class="fn-poster-wrap">' +
          '<div class="fn-poster-frame">' +
            '<canvas class="fn-poster" data-test="finale-poster" width="' + POSTER_W + '" height="' + POSTER_H + '" role="img" aria-label="' + U.escape("结局海报：" + d.endingName) + '"></canvas>' +
          "</div>" +
          '<div class="fn-poster-cap">720 × 1080 · 可保存相册 / 直接分享</div>' +
        "</section>" +
        '<section class="fn-actions">' +
          '<button class="btn primary wide" data-test="finale-poster-save">保存海报</button>' +
          '<button class="btn soft wide" data-test="finale-save">保存进回忆册</button>' +
          '<div class="fn-row">' +
            '<button class="btn ghost" data-test="finale-again">再来一夜</button>' +
            '<button class="btn ghost" data-test="finale-home">回大厅</button>' +
          "</div>" +
          '<button class="btn ghost sm" data-test="finale-memory">去回忆册看看 →</button>' +
        "</section>" +
        '<footer class="fn-foot">数据只保存在这台手机上 · 安全词随时可用</footer>' +
      "</div>";
    root.innerHTML = html;
  }

  function revealSequence(inst, root) {
    var hero = root.querySelector(".fn-hero");
    var lines = U.qsa(".fn-line", root);
    var awards = U.qsa(".fn-award", root);
    if (!M.reduced()) requestAnimationFrame(function () { if (current === inst) hero.classList.add("on", "play"); });
    else hero.classList.add("on");

    if (M.reduced()) {
      lines.forEach(function (el) { el.classList.add("on"); });
      awards.forEach(function (el) { el.classList.add("on"); });
      animateStats(inst, root);
      return;
    }
    addTimer(inst, function () { hero.classList.add("play"); }, 60);
    lines.forEach(function (el, i) {
      addTimer(inst, function () { el.classList.add("on"); }, 520 + i * 430);
      addTimer(inst, function () {
        try { App.Audio.play("tick"); } catch (e) {}
      }, 500 + i * 430);
    });
    var base = 560 + lines.length * 430;
    addTimer(inst, function () {
      awards.forEach(function (el, i) {
        addTimer(inst, function () {
          el.classList.add("on");
          el.classList.remove("pulse-once");
          void el.offsetWidth;
          el.classList.add("pulse-once");
        }, i * 140);
      });
      try { App.Audio.play("chime"); } catch (e) {}
    }, base);
    addTimer(inst, function () { animateStats(inst, root); }, Math.max(320, base - 260));
    addTimer(inst, function () {
      try { M.burst(innerWidth / 2, innerHeight * 0.34, { count: 22, radius: 120 }); } catch (e) {}
    }, base);
  }

  function animateStats(inst, root) {
    var keys = ["heart", "tension", "sync"];
    keys.forEach(function (k) {
      var el = root.querySelector('[data-stat="' + k + '"]');
      if (!el) return;
      var to = inst.data[k] || 0;
      if (M.reduced()) { el.textContent = String(to); return; }
      M.count(el, to, { from: 0, dur: 620 });
    });
  }

  function savePoster(inst, root) {
    var canvas = root.querySelector('[data-test="finale-poster"]');
    if (!canvas) return;
    var filename = "升温夜航-" + ymd(inst.data.ts) + ".png";
    canvasToBlob(canvas, function (blob) {
      if (!blob) {
        try {
          var dataUrl = canvas.toDataURL("image/png");
          var a = document.createElement("a");
          a.href = dataUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          setTimeout(function () { try { a.remove(); } catch (e) {} }, 900);
        } catch (e) { App.UI.toast("海报生成失败", { kind: "rose" }); }
        return;
      }
      var file = null;
      try { file = new File([blob], filename, { type: "image/png" }); } catch (e) { file = null; }
      var canShare = false;
      try { canShare = !!(file && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share); } catch (e) { canShare = false; }
      if (canShare) {
        try {
          navigator.share({ files: [file], title: "升温夜航 · " + inst.data.endingName }).then(function () {
            App.UI.toast("已分享", { kind: "gold" });
          }).catch(function () {
            downloadBlob(blob, filename);
          });
          return;
        } catch (e) {}
      }
      if (downloadBlob(blob, filename)) App.UI.toast("海报已保存：" + filename, { kind: "gold" });
      else App.UI.toast("海报保存失败", { kind: "rose" });
    });
    try { App.Audio.play("coin"); } catch (e) {}
    try { App.UI.haptic("success"); } catch (e) {}
  }

  function historyEntryExists(entryId) {
    try {
      var list = App.Store.getHistory();
      for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === entryId) return true;
      return false;
    } catch (e) { return false; }
  }

  function wire(inst, root) {
    var saveBtn = root.querySelector('[data-test="finale-save"]');
    var markSaved = function () {
      if (!saveBtn) return;
      saveBtn.disabled = true;
      saveBtn.textContent = "已存进回忆册 ✓";
    };
    if (saveBtn) {
      if (historyEntryExists(inst.entry.id)) markSaved();
      saveBtn.addEventListener("click", function () {
        if (saveBtn.disabled) return;
        if (historyEntryExists(inst.entry.id)) { markSaved(); App.UI.toast("这一晚已经在回忆册里了"); return; }
        App.Store.addHistory(inst.entry);
        markSaved();
        App.UI.toast("已存进回忆册", { kind: "gold" });
        // 已归档 → 标记为 done：刷新/回大厅不再被自动带回结局屏
        try {
          var st = App.Store.getSession();
          if (st && (st.phase === "finale" || st.phase === "done")) {
            st.phase = "done";
            App.Store.saveSession(st);
          }
        } catch (e) {}
        try { App.Audio.play("chime"); } catch (e) {}
        try { App.UI.haptic("success"); } catch (e) {}
      });
    }

    var posterBtn = root.querySelector('[data-test="finale-poster-save"]');
    if (posterBtn) posterBtn.addEventListener("click", function () { savePoster(inst, root); });

    var again = root.querySelector('[data-test="finale-again"]');
    if (again) again.addEventListener("click", function () {
      try { App.Audio.play("tap"); } catch (e) {}
      try { App.Store.clearSession(); } catch (e) {}
      App.Router.go("setup");
    });

    var home = root.querySelector('[data-test="finale-home"]');
    if (home) home.addEventListener("click", function () {
      try { App.Audio.play("tap"); } catch (e) {}
      App.Router.go("boot");
    });

    var mem = root.querySelector('[data-test="finale-memory"]');
    if (mem) mem.addEventListener("click", function () {
      try { App.Audio.play("tap"); } catch (e) {}
      App.Router.go("memory");
    });
  }

  function renderEmpty(root) {
    root.innerHTML =
      '<div class="page finale">' +
        '<div class="fn-top"><div class="kicker">VOYAGE · 终章</div><div class="fn-night">还没有航程</div></div>' +
        '<div class="fn-empty glass">' +
          '<div class="ic">☾</div>' +
          '<h2>还没有可以收下的夜</h2>' +
          '<p>先出一次海，回来这里就会有一张结局。<br>数据只保存在这台手机上。</p>' +
          '<button class="btn primary wide mt-20" data-test="finale-home">回大厅</button>' +
        "</div>" +
      "</div>";
    var home = root.querySelector('[data-test="finale-home"]');
    if (home) home.addEventListener("click", function () { App.Router.go("boot"); });
  }

  function entryStateFor(state, data) {
    if (state && typeof state === "object" && state.result) return state;
    return {
      id: data.stateId || undefined,
      ts: data.ts,
      names: data.names,
      resources: { heart: data.heart, tension: data.tension, sync: data.sync, coins: data.coins },
      round: data.round,
      completes: data.completes,
      skips: data.skips,
      maxCombo: data.maxCombo,
      maxStarSeen: data.maxStar,
      result: { endingId: data.endingId, endingName: data.endingName, awards: data.awards }
    };
  }

  function mount(root, params) {
    params = params || {};
    var state = settleState(params);
    var data = resolveData(state);
    if (!data) { renderEmpty(root); return function () {}; }
    var inst = { data: data, timers: [] };
    current = inst;
    inst.entry = App.Store.makeHistoryEntry(entryStateFor(state, data));
    renderFinale(root, data);
    drawPoster(root.querySelector('[data-test="finale-poster"]'), data);
    wire(inst, root);
    revealSequence(inst, root);
    try { App.Audio.play("ending"); } catch (e) {}
    try { App.UI.haptic("success"); } catch (e) {}
    return function () {
      clearTimers(inst);
      if (current === inst) current = null;
    };
  }

  function unmount() {
    if (current) { clearTimers(current); current = null; }
  }

  App.Screens = App.Screens || {};
  App.Screens.finale = { mount: mount, unmount: unmount };
})();

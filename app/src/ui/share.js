/* ===== V6 分享图：Canvas 1080×1350 · 暗夜星轨 + 暖光纸卡 =====
 * 契约：App.Share = { exportLedger(input, opts?) -> Promise<{ok,filename,width,height,bytes}>, ledgerCanvas, ledgerDataUrl }
 * 隐私（spec §4 F4）：只在本地生成并触发浏览器下载；不请求网络、不上传、不生成外链。
 * 默认不把题卡原文画进图里（opts.includeText=true 才画，且最多 4 条）。
 */
(function () {
  var App = (window.App = window.App || {});

  var W = 1080;
  var H = 1350;
  var SCALE = { gentle: "温柔", warm: "暧昧", hot: "热烈", open: "不设限" };
  var STAGE = {
    cold: "灯刚亮", warm: "有点热", charged: "靠近了",
    burning: "很近了", blazing: "今晚可以更近"
  };
  var TYPE = {
    "cell-truth": "真心话", "cell-dare": "大冒险", "cell-touch": "靠近",
    capture: "击落", "stack-duo": "叠机", "home-entry": "进终点",
    ending: "收尾", fate: "命运"
  };
  var MINI = { "minigame-thermo": 1, "minigame-wheel": 1 };
  var SERIF = '"Noto Serif SC","Songti SC","STSong",serif';
  var SANS = '"Noto Sans SC","Microsoft YaHei","PingFang SC",sans-serif';

  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function rngOf(seed) {
    var a = (Number(seed) >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function normalize(input) {
    if (!input) return null;
    if (input.ledger) return input.ledger;
    if (input.prompts || input.names) return input;
    return null;
  }

  function dateText(ledger) {
    if (ledger && /^\d{4}-\d{2}-\d{2}$/.test(String(ledger.date || ""))) return String(ledger.date);
    var d = new Date(num(ledger && (ledger.endedAt || ledger.startedAt)) || Date.now());
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function durationText(ledger) {
    /* 与回顾页同口径：优先 ledger.durationMs；<1 分钟显示秒，≥1 分钟显示「m 分 s 秒」。 */
    var raw = ledger ? ledger.durationMs : null;
    if (raw === undefined || raw === null || raw === "") {
      if (ledger && ledger.endedAt && ledger.startedAt) raw = num(ledger.endedAt) - num(ledger.startedAt);
    }
    if (raw === undefined || raw === null) return "—";
    var ms = Number(raw);
    if (!isFinite(ms) || ms < 0) return "—";
    var total = Math.max(0, Math.round(ms / 1000));
    if (total < 60) return total + " 秒";
    var min = Math.floor(total / 60);
    var sec = total % 60;
    if (min < 60) return min + " 分 " + (sec < 10 ? "0" : "") + sec + " 秒";
    var hr = Math.floor(min / 60);
    return hr + " 小时 " + ((min % 60) < 10 ? "0" : "") + (min % 60) + " 分 " + (sec < 10 ? "0" : "") + sec + " 秒";
  }

  function stageOf(heat) {
    var h = num(heat);
    if (h < 20) return STAGE.cold;
    if (h < 40) return STAGE.warm;
    if (h < 60) return STAGE.charged;
    if (h < 80) return STAGE.burning;
    return STAGE.blazing;
  }

  function nameOf(ledger, id) {
    var names = (ledger && ledger.names) || {};
    if (id === "both") return "两人一起";
    var raw = names[id];
    if (raw !== undefined && raw !== null && String(raw).trim()) return String(raw).trim();
    return id === "b" ? "她" : "他";
  }

  function modelOf(ledger) {
    var prompts = Array.isArray(ledger.prompts) ? ledger.prompts.filter(Boolean) : [];
    var cards = [];
    var minis = Array.isArray(ledger.minigames) ? ledger.minigames.slice() : [];
    var hasMiniArray = minis.length > 0;
    prompts.forEach(function (p) {
      if (MINI[p.kind]) {
        if (!hasMiniArray) minis.push(p);
      } else cards.push(p);
    });
    var stats = ledger.stats || {};
    var done = 0, skipped = 0;
    cards.forEach(function (p) { if (p.outcome === "skipped") skipped += 1; else done += 1; });
    if (!cards.length) {
      done = num(stats.cardsDone);
      skipped = num(stats.cardsSkipped);
    }
    var heat = stats.heat !== undefined && stats.heat !== null
      ? clamp(num(stats.heat), 0, 100)
      : (ledger.meta && ledger.meta.heat !== undefined ? clamp(num(ledger.meta.heat), 0, 100) : -1);
    var curve = [];
    var running = 0;
    prompts.forEach(function (p) {
      if (p.outcome === "skipped") {
        if (!MINI[p.kind]) running += 3;
      } else if (p.kind === "ending") running += 10;
      else if (MINI[p.kind]) running += 5;
      else running += 8;
      curve.push(clamp(running, 0, 100));
    });
    if (heat < 0) heat = curve.length ? curve[curve.length - 1] : 0;
    if (curve.length < 2) curve = [0, heat];
    else if (heat > curve[curve.length - 1]) curve.push(heat);

    var best = stats.bestStreak !== undefined ? num(stats.bestStreak)
      : (ledger.meta && ledger.meta.streakBest !== undefined ? num(ledger.meta.streakBest) : 0);
    if (!best) {
      var run = 0;
      cards.forEach(function (p) {
        if (p.outcome !== "skipped") { run += 1; if (run > best) best = run; } else run = 0;
      });
    }
    var miniDone = 0, miniSkipped = 0;
    minis.forEach(function (m) {
      if (m.outcome === "skipped" || m.outcome === "skip") miniSkipped += 1; else miniDone += 1;
    });
    var lines = cards.slice(0, 4).map(function (p) {
      var who = p.kind === "stack-duo" || p.targetId === "both" ? "两人一起" : nameOf(ledger, p.actorId);
      return {
        who: who,
        type: TYPE[p.kind] || "题目",
        result: p.outcome === "skipped" ? "今晚先放过" : "做了",
        star: clamp(Math.round(num(p.star || (p.card && p.card.star))), 0, 5),
        text: p.text || (p.card && p.card.text) || ""
      };
    });
    return {
      date: dateText(ledger),
      names: nameOf(ledger, "a") + " & " + nameOf(ledger, "b"),
      scale: SCALE[ledger.scale] || "暧昧",
      duration: durationText(ledger),
      done: done,
      skipped: skipped,
      total: done + skipped,
      heat: heat,
      stage: stageOf(heat),
      best: best,
      miniCount: minis.length,
      miniDone: miniDone,
      miniSkipped: miniSkipped,
      curve: curve,
      lines: lines
    };
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function fontStr(size, family, weight) {
    return (weight || "400") + " " + size + "px " + (family || SANS);
  }

  function drawText(ctx, text, x, y, opt) {
    opt = opt || {};
    ctx.save();
    ctx.font = fontStr(opt.size || 24, opt.family, opt.weight);
    ctx.fillStyle = opt.color || "#FBF3E7";
    ctx.textAlign = opt.align || "left";
    ctx.textBaseline = opt.baseline || "alphabetic";
    try { if (opt.spacing !== undefined) ctx.letterSpacing = opt.spacing + "px"; } catch (e) {}
    ctx.fillText(String(text === undefined || text === null ? "" : text), x, y);
    ctx.restore();
  }

  function drawBackground(ctx, m, rnd) {
    var bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#07050E");
    bg.addColorStop(0.4, "#150F2A");
    bg.addColorStop(0.78, "#120D24");
    bg.addColorStop(1, "#08060F");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    function neb(x, y, rx, ry, color) {
      var g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(rx, ry));
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, ry / Math.max(rx, ry));
      ctx.translate(-x, -y);
      ctx.beginPath();
      ctx.arc(x, y, Math.max(rx, ry), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    neb(880, 90, 420, 300, "rgba(233,136,122,.20)");
    neb(120, 210, 520, 360, "rgba(130,96,224,.24)");
    neb(560, 1180, 660, 320, "rgba(243,192,119,.16)");

    for (var i = 0; i < 230; i++) {
      var x = rnd() * W;
      var y = rnd() * H;
      var r = rnd() * 1.7 + 0.35;
      var a = 0.15 + rnd() * 0.65;
      ctx.fillStyle = "rgba(255,240,220," + a.toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      if (r > 1.6) {
        ctx.strokeStyle = "rgba(255,240,220,.35)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(x - r * 4, y); ctx.lineTo(x + r * 4, y);
        ctx.moveTo(x, y - r * 4); ctx.lineTo(x, y + r * 4);
        ctx.stroke();
      }
    }
    var vg = ctx.createRadialGradient(W / 2, H * 0.42, 240, W / 2, H * 0.42, 900);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(4,3,10,.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);
    return m;
  }

  function drawPaper(ctx, m, rnd, opt) {
    var x = 90, y = 330, w = 900, h = 800;
    ctx.save();
    ctx.shadowColor = "rgba(3,2,10,.55)";
    ctx.shadowBlur = 60;
    ctx.shadowOffsetY = 24;
    roundRect(ctx, x, y, w, h, 38);
    var paper = ctx.createRadialGradient(x + 120, y - 40, 40, x + w / 2, y + h / 2, w * 0.95);
    paper.addColorStop(0, "#FDF5E7");
    paper.addColorStop(0.55, "#F7EAD6");
    paper.addColorStop(1, "#F1DFC4");
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.restore();
    ctx.save();
    roundRect(ctx, x, y, w, h, 38);
    ctx.strokeStyle = "rgba(255,246,230,.5)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.clip();
    for (var i = 0; i < 900; i++) {
      ctx.fillStyle = "rgba(90,60,40," + (0.012 + rnd() * 0.022).toFixed(3) + ")";
      var gx = x + rnd() * w;
      var gy = y + rnd() * h;
      ctx.fillRect(gx, gy, 1.5 + rnd() * 2, 1.5 + rnd() * 2);
    }
    ctx.restore();

    var innerX = x + 54;
    var innerW = w - 108;
    var cy = y + 74;

    drawText(ctx, "今晚的回顾", innerX, cy, { size: 22, family: SANS, color: "#8A5A32", spacing: 6, weight: "700" });
    drawText(ctx, m.date + " · " + m.scale, x + w - 54, cy, { size: 22, family: SANS, color: "#A98A6C", align: "right", spacing: 2 });
    cy += 34;
    ctx.strokeStyle = "rgba(90,50,30,.22)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(innerX, cy);
    ctx.lineTo(innerX + innerW, cy);
    ctx.stroke();

    var colW = innerW / 2;
    var rowY = cy + 56;
    function cell(label, value, cx, yy, accent, valueSize) {
      drawText(ctx, label, cx, yy, { size: 22, family: SANS, color: "#8A6A50", spacing: 3 });
      drawText(ctx, value, cx, yy + 48, { size: valueSize || 42, family: SERIF, color: accent || "#2C1C15", weight: "700" });
    }
    cell("时长", m.duration, innerX, rowY);
    cell("题卡", "共 " + m.total + " 张 · 做了 " + m.done + " · 放过 " + m.skipped, innerX + colW, rowY, null, 28);
    var rowY2 = rowY + 108;
    cell("心动值", m.heat + " · " + m.stage, innerX, rowY2, "#7C2A3A");
    cell("最高连击", String(m.best), innerX + colW, rowY2);
    var rowY3 = rowY2 + 96;
    drawText(ctx, "小游戏", innerX, rowY3, { size: 22, family: SANS, color: "#8A6A50", spacing: 3 });
    drawText(ctx,
      m.miniCount ? m.miniCount + " 次 · 完成 " + m.miniDone + " · 跳过 " + m.miniSkipped : "今晚没有小游戏。",
      innerX + colW, rowY3, { size: 26, family: SANS, color: "#4A2A1A" });

    /* 心动值曲线（纸上的暖色线） */
    var curveY = rowY3 + 34;
    var curveH = 96;
    var curveW = innerW;
    drawText(ctx, "心动值", innerX, curveY + 16, { size: 18, family: SANS, color: "#A98A6C", spacing: 2 });
    var pts = m.curve;
    if (pts.length < 2) pts = [0, m.heat];
    var cx0 = innerX + 100;
    var cw = curveW - 120;
    var top = curveY + 8;
    var bottom = curveY + curveH - 8;
    ctx.save();
    ctx.strokeStyle = "rgba(90,50,30,.16)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx0, bottom);
    ctx.lineTo(cx0 + cw, bottom);
    ctx.stroke();
    var pathPts = pts.map(function (v, i) {
      var px = cx0 + cw * (i / (pts.length - 1));
      var py = bottom - (bottom - top) * (clamp(v, 0, 100) / 100);
      return [px, py];
    });
    ctx.beginPath();
    ctx.moveTo(pathPts[0][0], pathPts[0][1]);
    for (var pi = 1; pi < pathPts.length; pi++) ctx.lineTo(pathPts[pi][0], pathPts[pi][1]);
    ctx.strokeStyle = "#C8902F";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.stroke();
    var lastP = pathPts[pathPts.length - 1];
    ctx.beginPath();
    ctx.arc(lastP[0], lastP[1], 6, 0, Math.PI * 2);
    ctx.fillStyle = "#B8554C";
    ctx.fill();
    ctx.restore();

    /* 明细（默认只画归属/类型/结果/星级，不画原文） */
    var listY = curveY + curveH + 26;
    drawText(ctx, "今晚的每一张", innerX, listY, { size: 18, family: SANS, color: "#A98A6C", spacing: 2 });
    var ly = listY + 30;
    var lines = opt && opt.includeText ? m.lines.slice(0, 3) : m.lines;
    if (!lines.length) {
      drawText(ctx, "今晚还没有落下任何一张。这一晚仍然算数。", innerX, ly, { size: 24, family: SERIF, color: "#6E4A33" });
    } else {
      lines.forEach(function (line) {
        drawText(ctx, line.who + " · " + line.type + " · " + (line.star ? line.star + "★ · " : "") + line.result,
          innerX, ly, { size: 24, family: SERIF, color: "#4A2A1A" });
        ly += 36;
        if (opt && opt.includeText && line.text) {
          drawText(ctx, line.text.length > 34 ? line.text.slice(0, 34) + "…" : line.text,
            innerX + 20, ly, { size: 20, family: SERIF, color: "#6E4A33" });
          ly += 30;
        }
      });
      if (m.total > lines.length) {
        drawText(ctx, "还有 " + (m.total - lines.length) + " 张在回顾里。", innerX, ly, { size: 20, family: SANS, color: "#A98A6C" });
      }
    }

    drawText(ctx, "只在这台手机上 · 不上传", x + w - 54, y + h - 34,
      { size: 18, family: SANS, color: "#A98A6C", align: "right", spacing: 2 });
    return { x: x, y: y, w: w, h: h, bottom: y + h };
  }

  function draw(ledger, opts) {
    opts = opts || {};
    var m = modelOf(ledger);
    var canvas = opts.canvas || document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext("2d");
    var rnd = rngOf(opts.seed || (num(ledger.endedAt) || 771126));
    drawBackground(ctx, m, rnd);

    drawText(ctx, "今晚飞行棋 · 今晚回顾", W / 2, 108, { size: 24, family: SANS, color: "#C9B6CE", align: "center", spacing: 8, weight: "700" });
    drawText(ctx, "今晚完成了", W / 2, 218, { size: 86, family: SERIF, color: "#FBF3E7", align: "center", weight: "700", spacing: 6 });
    drawText(ctx, m.date + " · " + m.names + " · " + m.scale, W / 2, 274, { size: 30, family: SANS, color: "#E8D8C2", align: "center", spacing: 2 });

    var paper = drawPaper(ctx, m, rnd, opts);

    drawText(ctx, "今晚飞行棋", W / 2, paper.bottom + 78, { size: 30, family: SERIF, color: "#C9B6CE", align: "center", spacing: 6 });
    drawText(ctx, "两个人，一部手机，一盘桌上的棋", W / 2, paper.bottom + 116, { size: 22, family: SANS, color: "#8E7C9E", align: "center", spacing: 2 });
    return canvas;
  }

  function filenameFor(ledger) {
    var d = dateText(ledger).replace(/-/g, "");
    return "今晚回顾-" + d + ".png";
  }

  App.Share = {
    size: { width: W, height: H },
    ledgerCanvas: function (input, opts) {
      var ledger = normalize(input);
      if (!ledger) throw new Error("no ledger");
      return draw(ledger, opts || {});
    },
    ledgerDataUrl: function (input, opts) {
      return App.Share.ledgerCanvas(input, opts).toDataURL("image/png");
    },
    exportLedger: function (input, opts) {
      var ledger = normalize(input);
      if (!ledger) return Promise.resolve({ ok: false, error: "no ledger" });
      var canvas;
      try { canvas = draw(ledger, opts || {}); } catch (e) {
        if (window.console) console.error("[share]", e);
        return Promise.resolve({ ok: false, error: String(e && e.message || e) });
      }
      var filename = filenameFor(ledger);
      return new Promise(function (resolve) {
        function done(res) {
          if (!res || !res.ok) return resolve(res || { ok: false });
          resolve(res);
        }
        function trigger(url, revoke) {
          try {
            var a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.rel = "noopener";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
              try { if (a.parentNode) a.parentNode.removeChild(a); } catch (e) {}
              if (revoke) { try { URL.revokeObjectURL(url); } catch (e) {} }
            }, 4000);
            done({ ok: true, filename: filename, width: W, height: H });
          } catch (e) {
            if (window.console) console.error("[share] download", e);
            done({ ok: false, error: String(e && e.message || e) });
          }
        }
        if (canvas.toBlob) {
          canvas.toBlob(function (blob) {
            if (!blob) {
              try { trigger(canvas.toDataURL("image/png"), false); } catch (e) { done({ ok: false }); }
              return;
            }
            var url;
            try { url = URL.createObjectURL(blob); } catch (e) { trigger(canvas.toDataURL("image/png"), false); return; }
            trigger(url, true);
          }, "image/png");
        } else {
          try { trigger(canvas.toDataURL("image/png"), false); } catch (e) { done({ ok: false }); }
        }
      });
    }
  };
})();

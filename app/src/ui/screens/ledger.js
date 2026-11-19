/* ===== V6 今晚回顾：无输赢 · 6 类信息 · 心动值曲线 · 题卡明细可展开 =====
 * 数据：history entry.ledger（冻结单 §2.5）；兼容旧 V5 ledger（缺字段时推算/兜底）。
 * 文案：docs/v6/copy.md §6.2 / §6.3 / §6.4。
 */
(function () {
  var App = window.App || {};
  var U = App.util || {};

  function esc(s) {
    if (U.escape) return U.escape(s);
    return String(s === undefined || s === null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

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
  var MINI_TYPES = { "minigame-thermo": 1, "minigame-wheel": 1 };
  var FALLBACK_NAME = { a: "他", b: "她" };

  var CSS = `
.lg-page{background:radial-gradient(120% 60% at 50% 0%,rgba(12,23,34,.85),rgba(7,8,13,.96) 62%,#07080D);color:var(--ink,#F2E8D8);padding-top:calc(64px + var(--safe-t,0px));padding-bottom:calc(28px + var(--safe-b,0px))}
.lg-done{position:relative;margin-top:6px;padding:18px 16px;border-radius:10px;background:linear-gradient(160deg,#F6EBD8,#E7D5B6);color:var(--paper-ink,#2A1D14);border:1px solid rgba(176,138,87,.55);box-shadow:0 18px 40px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.26);overflow:hidden}
.lg-done::before{content:"";position:absolute;left:14px;right:14px;top:8px;height:1px;background:linear-gradient(90deg,transparent,rgba(176,138,87,.8),transparent)}
.lg-done-title{position:relative;font-family:var(--font-display,var(--font,serif));font-size:clamp(26px,7.8vw,34px);line-height:1.16;font-weight:700;letter-spacing:.04em;color:#2A1D14}
.lg-done-sub{position:relative;margin-top:8px;font-size:12.5px;color:#6E5544;letter-spacing:.04em}
.lg-done-sub b{color:var(--wine,#732A35);font-weight:700;font-variant-numeric:tabular-nums}
.lg-title{margin-top:22px;font-family:var(--font-display,var(--font,serif));font-size:clamp(24px,7vw,32px);line-height:1.2;font-weight:700;letter-spacing:.05em;color:var(--ink,#F2E8D8)}
.lg-sub{margin-top:6px;font-size:12.5px;color:var(--dim2,#7E705C);letter-spacing:.04em}
.lg-stats{margin-top:14px;border-radius:10px;overflow:hidden;background:rgba(8,12,18,.72);border:1px solid var(--line,rgba(176,138,87,.24))}
.lg-stat{display:flex;align-items:baseline;gap:12px;padding:12px 14px;border-bottom:1px solid var(--line,rgba(176,138,87,.16))}
.lg-stat:last-child{border-bottom:0}
.lg-stat-label{flex:none;width:62px;font-size:10.5px;letter-spacing:.14em;color:var(--dim2,#7E705C);font-weight:600}
.lg-stat-val{flex:1;min-width:0;font-size:13.5px;line-height:1.55;color:var(--ink,#F2E8D8);word-break:break-word}
.lg-stat-val b{color:var(--amber,#E0A45E);font-variant-numeric:tabular-nums}
.lg-curve{margin-top:12px;padding:12px 14px 10px;border-radius:10px;background:rgba(8,12,18,.72);border:1px solid var(--line,rgba(176,138,87,.24))}
.lg-curve svg{display:block;width:100%;height:64px}
.lg-curve-cap{display:flex;justify-content:space-between;gap:10px;margin-top:4px;font-size:10.5px;color:var(--dim2,#7E705C);letter-spacing:.08em}
.lg-curve-cap b{color:var(--amber,#E0A45E);font-weight:600}
.lg-sec-title{margin-top:22px;font-size:10.5px;letter-spacing:.2em;color:var(--dim,#B7A88F);font-weight:600}
.lg-list{margin-top:8px;display:flex;flex-direction:column;gap:7px}
.lg-item{border-radius:8px;background:rgba(8,12,18,.6);border:1px solid var(--line,rgba(176,138,87,.24));overflow:hidden}
.lg-row{display:flex;align-items:center;gap:10px;width:100%;min-height:50px;padding:11px 12px;text-align:left;font-family:inherit;color:var(--ink,#F2E8D8);background:transparent}
.lg-row-main{flex:1;min-width:0;font-size:12.5px;line-height:1.5}
.lg-row-main .lg-who{color:var(--amber,#E0A45E);font-weight:600}
.lg-row-main .lg-res{color:var(--dim,#B7A88F)}
.lg-row-main .lg-res.skipped{color:var(--dim2,#7E705C)}
.lg-row-toggle{flex:none;font-size:10px;letter-spacing:.06em;color:var(--dim2,#7E705C);padding:5px 7px;border-radius:4px;border:1px solid var(--line2,rgba(176,138,87,.4))}
.lg-row-text{display:none;margin:0 8px 8px;padding:11px 12px;border-radius:6px;font-size:13.5px;line-height:1.75;color:#2A1D14;background:linear-gradient(160deg,#F6EBD8,#E9D8BB);border:1px solid rgba(176,138,87,.45);box-shadow:0 6px 16px rgba(0,0,0,.28)}
.lg-item.open .lg-row-text{display:block}
.lg-item.open .lg-row-toggle{color:var(--amber,#E0A45E);border-color:rgba(176,138,87,.55)}
.lg-mini{margin-top:8px;display:flex;flex-direction:column;gap:6px}
.lg-mini-row{display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:8px;font-size:12.5px;color:var(--dim,#B7A88F);background:rgba(8,12,18,.6);border:1px solid var(--line,rgba(176,138,87,.24))}
.lg-mini-row .lg-mini-dot{width:5px;height:5px;background:var(--amber,#E0A45E);transform:rotate(45deg);flex:none}
.lg-empty{margin-top:10px;padding:14px;border-radius:8px;border:1px dashed rgba(176,138,87,.4);font-size:12.5px;line-height:1.65;color:var(--dim2,#7E705C)}
.lg-bound{margin-top:14px;font-size:10.5px;line-height:1.7;color:var(--dim2,#7E705C);letter-spacing:.03em}
.lg-actions{margin-top:20px;display:flex;flex-direction:column;gap:9px}
.lg-btn{width:100%;min-height:50px;border-radius:10px;font-size:14.5px;font-weight:600;letter-spacing:.12em;font-family:inherit;transition:transform var(--t-fast,150ms) var(--ease-out,cubic-bezier(.16,1,.3,1))}
.lg-btn:active{transform:scale(.985)}
.lg-btn.main{background:linear-gradient(180deg,#DDB273,#B08A57 58%,#96703F);color:#1A120B;border:1px solid rgba(255,232,196,.26);box-shadow:inset 0 1px 0 rgba(255,240,215,.42),0 8px 20px rgba(0,0,0,.36)}
.lg-btn.soft{background:rgba(241,228,206,.06);border:1px solid var(--line2,rgba(176,138,87,.4));color:var(--ink,#F2E8D8)}
.lg-btn.ghost{background:transparent;border:1px solid var(--line,rgba(176,138,87,.22));color:var(--dim,#B7A88F);min-height:44px;font-size:12.5px}
.lg-btn.small{min-height:40px;font-size:11px;letter-spacing:.06em}
.lg-foot{margin-top:14px;text-align:center;font-size:10px;color:var(--dim2,#7E705C);letter-spacing:.08em}
`;

  function injectStyle() {
    if (App.UI && App.UI.injectStyle) { App.UI.injectStyle("ledger-v6", CSS); return; }
    if (document.getElementById("style-ledger-v6")) return;
    var el = document.createElement("style");
    el.id = "style-ledger-v6";
    el.textContent = CSS;
    document.head.appendChild(el);
  }

  function num(v) { var n = Number(v); return isFinite(n) ? n : 0; }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  /* ===== V6.1 先到家（冻结单 §3.3）=====
   * 读 ledger.ending（win-a/win-b/safe）+ 旧档 shared；winnerId 兜底；stats.planesHome 兼容 {a,b} 与旧的总数。
   * 文案只用「先到家 / 已到家 / 一起走到这里」，不出现输了/失败/惩罚。
   */
  function readEnding(ledger) {
    var raw = ledger && ledger.ending !== undefined && ledger.ending !== null ? String(ledger.ending) : "";
    if (raw === "win-a" || raw === "win-b" || raw === "safe" || raw === "shared") return raw;
    /* 旧档没有 ending（或值不认识）时按 winnerId 兜底，还没有就按旧合作收尾。 */
    var w = ledger && ledger.winnerId;
    if (w === "a" || w === "b") return "win-" + w;
    return "shared";
  }

  function readWinnerId(ledger, ending) {
    if (ending === "win-a") return "a";
    if (ending === "win-b") return "b";
    var w = ledger && ledger.winnerId;
    return (w === "a" || w === "b") ? w : null;
  }

  /* stats.planesHome：新契约 {a,b}；旧引擎只给过总数（number）；旧 V5 档没有该字段。 */
  function readPlanesHome(ledger) {
    var raw = ledger && ledger.stats ? ledger.stats.planesHome : null;
    var out = { a: null, b: null, total: null };
    if (raw && typeof raw === "object") {
      if (raw.a !== undefined && raw.a !== null) out.a = Math.max(0, Math.round(num(raw.a)));
      if (raw.b !== undefined && raw.b !== null) out.b = Math.max(0, Math.round(num(raw.b)));
      if (out.a !== null || out.b !== null) out.total = (out.a || 0) + (out.b || 0);
    } else if (raw !== undefined && raw !== null && raw !== "") {
      out.total = Math.max(0, Math.round(num(raw)));
    }
    return out;
  }

  function readPlaneCount(ledger, home) {
    var n = Number(ledger && ledger.planeCount);
    if (n === 2 || n === 4) return n;
    if ((home.a || 0) > 2 || (home.b || 0) > 2) return 4;
    return 2;
  }

  function doneCopy(model) {
    var ending = model.ending;
    var planes = model.planeCount;
    if (ending === "win-a" || ending === "win-b") {
      var x = model.winnerHome === null || model.winnerHome === undefined ? planes : model.winnerHome;
      return {
        title: (model.winnerName || "你们中的一位") + " 先到家",
        sub: "已到家 <b>" + x + "</b>/" + planes + " 架 · 今晚的记录都留在这儿。",
        note: "今晚完成了"
      };
    }
    if (ending === "safe") {
      return { title: "安全词收棋", sub: "今晚就到这 · 也算数", note: "安全词收棋" };
    }
    return { title: "今晚一起走到这里", sub: "今晚的记录都留在这儿。", note: "今晚一起走到这里" };
  }

  function homeStatHtml(model) {
    var home = model.home;
    var planes = model.planeCount;
    var parts = [];
    function side(pid, name) {
      var v = home[pid];
      return esc(name) + " <b>" + (v === null ? "—" : v) + "</b>/" + planes;
    }
    if (home.a !== null || home.b !== null) {
      parts.push(side("a", model.nameA), side("b", model.nameB));
      if (home.total !== null) parts.push("共 <b>" + home.total + "</b>/" + (planes * 2) + " 架");
    } else if (home.total !== null) {
      parts.push("共 <b>" + home.total + "</b>/" + (planes * 2) + " 架");
    } else {
      return "—";
    }
    return parts.join(" · ");
  }

  function findEntry(id) {
    var list = (App.Store && App.Store.getHistory) ? App.Store.getHistory() : [];
    if (id) {
      for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return list[i];
      return null;
    }
    return list[0] || null;
  }

  function entryFromSession() {
    var s = null;
    try { s = App.Store.getSession(); } catch (e) { s = null; }
    if (!s || !s.result) return null;
    return {
      id: s.id || ("flight-" + (s.ts || Date.now())),
      ts: (s.result.endedAt) || s.ts || Date.now(),
      kind: "flight",
      title: "今晚飞行棋",
      names: s.names,
      ledger: s.result
    };
  }

  function dateText(ledger, entry) {
    var d = ledger && ledger.date ? String(ledger.date) : "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    var ts = (ledger && (ledger.endedAt || ledger.startedAt)) || (entry && entry.ts) || Date.now();
    if (U.fmtDate) return U.fmtDate(ts);
    var dt = new Date(ts);
    return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
  }

  function durationText(ledger) {
    /* AC-E7-3：优先用引擎落盘的 ledger.durationMs（不拿展示时的估算）；缺失才回退起止时间。 */
    var raw = ledger ? ledger.durationMs : null;
    if (raw === undefined || raw === null || raw === "") {
      if (ledger && ledger.endedAt && ledger.startedAt) raw = num(ledger.endedAt) - num(ledger.startedAt);
      else if (ledger && ledger.stats && ledger.stats.durationMs !== undefined) raw = ledger.stats.durationMs;
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

  function scaleText(scale) { return SCALE[scale] || "暧昧"; }

  function stageOf(heat) {
    var h = num(heat);
    if (h < 20) return STAGE.cold;
    if (h < 40) return STAGE.warm;
    if (h < 60) return STAGE.charged;
    if (h < 80) return STAGE.burning;
    return STAGE.blazing;
  }

  function miniLabel(kind) {
    var k = String(kind || "");
    if (k === "thermo" || k === "minigame-thermo") return "温度计";
    if (k === "truth" || k === "truth-wheel" || k === "truth-wheel-mini") return "真心话转盘";
    if (k === "dare" || k === "dare-wheel") return "大冒险转盘";
    if (k === "minigame-wheel" || k === "wheel") return "转盘";
    return "小游戏";
  }

  function miniOutcome(m) {
    var o = m && (m.outcome || m.result);
    if (o === "skipped" || o === "skip") return "跳过";
    return "完成";
  }

  function actorName(p, names) {
    if (!p) return "你们俩";
    if (p.kind === "stack-duo" || p.targetId === "both") return "两人一起";
    var id = p.actorId;
    if (p.kind === "ending") id = p.targetId || p.actorId;
    if (!id) return "你们俩";
    names = names || {};
    var raw = names[id];
    if (raw !== undefined && raw !== null && String(raw).trim()) return String(raw).trim();
    return FALLBACK_NAME[id] || "你们俩";
  }

  function buildModel(entry) {
    var ledger = (entry && entry.ledger) || null;
    if (!ledger) return null;
    var names = ledger.names || (entry && entry.names) || {};
    var prompts = Array.isArray(ledger.prompts) ? ledger.prompts.filter(Boolean) : [];
    var cards = [];
    var minis = [];
    var hasMiniArray = Array.isArray(ledger.minigames) && ledger.minigames.length > 0;
    if (Array.isArray(ledger.minigames)) {
      ledger.minigames.forEach(function (m) { if (m) minis.push(m); });
    }
    prompts.forEach(function (p) {
      if (MINI_TYPES[p.kind]) {
        /* V6 ledger 的 prompts 不含小游戏；旧档把 minigame-* 混在 prompts 里。有独立数组时去重。 */
        if (!hasMiniArray) minis.push(p);
      } else cards.push(p);
    });

    var stats = ledger.stats || {};
    var done = 0, skipped = 0;
    cards.forEach(function (p) {
      if (p.outcome === "skipped") skipped += 1;
      else done += 1;
    });
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
        if (p.kind !== "minigame-thermo" && p.kind !== "minigame-wheel") running += 3;
      } else if (p.kind === "ending") running += 10;
      else if (p.kind === "minigame-thermo" || p.kind === "minigame-wheel") running += 5;
      else running += 8;
      curve.push(clamp(running, 0, 100));
    });
    if (heat < 0) heat = curve.length ? curve[curve.length - 1] : 0;
    if (curve.length < 2) {
      curve = [0, heat];
      if (curve[1] < curve[0]) curve[1] = curve[0];
    } else if (heat > curve[curve.length - 1]) {
      curve.push(heat);
    }

    var best = 0;
    if (stats.bestStreak !== undefined) best = num(stats.bestStreak);
    else if (ledger.meta && ledger.meta.streakBest !== undefined) best = num(ledger.meta.streakBest);
    if (!best) {
      var run = 0;
      cards.forEach(function (p) {
        if (p.outcome !== "skipped") { run += 1; if (run > best) best = run; }
        else run = 0;
      });
    }

    var miniDone = 0, miniSkipped = 0;
    minis.forEach(function (m) { if (miniOutcome(m) === "跳过") miniSkipped += 1; else miniDone += 1; });

    /* V6.1：结局/赢家/到家数（缺字段按旧档兜底，见 readEnding 等） */
    var ending = readEnding(ledger);
    var winnerId = readWinnerId(ledger, ending);
    var home = readPlanesHome(ledger);
    var planeCount = readPlaneCount(ledger, home);
    var winnerHome = null;
    var winnerName = "";
    if (winnerId) {
      /* 「先到家」意味着赢家全部飞机到家：旧档没有 planesHome 时按满员补齐这一侧，另一侧留 —，不臆造。 */
      if (home[winnerId] === null) home[winnerId] = planeCount;
      winnerHome = home[winnerId];
      var wn = names[winnerId];
      winnerName = wn !== undefined && wn !== null && String(wn).trim()
        ? String(wn).trim()
        : (FALLBACK_NAME[winnerId] || "你们中的一位");
    }

    return {
      ledger: ledger,
      entry: entry,
      names: names,
      nameA: names.a || "他",
      nameB: names.b || "她",
      ending: ending,
      winnerId: winnerId,
      winnerName: winnerName,
      winnerHome: winnerHome,
      home: home,
      planeCount: planeCount,
      date: dateText(ledger, entry),
      scale: scaleText(ledger.scale),
      duration: durationText(ledger),
      cards: cards,
      minis: minis,
      done: done,
      skipped: skipped,
      total: done + skipped,
      heat: heat,
      stage: stageOf(heat),
      best: best,
      miniDone: miniDone,
      miniSkipped: miniSkipped,
      curve: curve
    };
  }

  function curveSvg(points, heat) {
    var W = 320, H = 64, pad = 5;
    var max = 100;
    var n = points.length;
    var coords = points.map(function (v, i) {
      var x = n <= 1 ? pad : pad + (W - pad * 2) * (i / (n - 1));
      var y = H - pad - (H - pad * 2) * (clamp(v, 0, max) / max);
      return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
    });
    var line = coords.map(function (c, i) { return (i ? "L" : "M") + c[0] + " " + c[1]; }).join(" ");
    var area = line + " L" + coords[coords.length - 1][0] + " " + (H - pad) + " L" + coords[0][0] + " " + (H - pad) + " Z";
    var last = coords[coords.length - 1];
    return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="心动值曲线" data-test="heat-curve">' +
      '<defs><linearGradient id="lgHeatV6" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#E0A45E" stop-opacity=".4"/>' +
      '<stop offset="1" stop-color="#E0A45E" stop-opacity="0"/>' +
      "</linearGradient></defs>" +
      '<path d="' + area + '" fill="url(#lgHeatV6)"/>' +
      '<path d="' + line + '" fill="none" stroke="#E0A45E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="3" fill="#9B4A52"/>' +
      '<text x="' + Math.min(W - 6, last[0] + 5) + '" y="' + Math.max(11, last[1] - 6) + '" fill="#B7A88F" font-size="9" text-anchor="end">' + num(heat) + "</text>" +
      "</svg>";
  }

  function renderRows(model) {
    if (!model.cards.length) {
      return '<div class="lg-empty" data-test="ledger-empty">今晚还没有落下任何一张。这一晚仍然算数。</div>';
    }
    return '<div class="lg-list">' + model.cards.map(function (p, i) {
      var who = actorName(p, model.names);
      var type = TYPE[p.kind] || "题目";
      var star = clamp(Math.round(num(p.star || (p.card && p.card.star))), 0, 5);
      var result = p.outcome === "skipped" ? "今晚先放过" : "做了";
      var text = p.text || (p.card && p.card.text) || "这一张只记了类型和结果。";
      return '<div class="lg-item" data-test="ledger-prompt">' +
        '<button class="lg-row" type="button" data-act="expand" aria-expanded="false" data-test="ledger-prompt-toggle">' +
          '<span class="lg-row-main"><span class="lg-who">' + esc(who) + "</span> · " + esc(type) + " · " + star + "★ · " +
            '<span class="lg-res' + (p.outcome === "skipped" ? " skipped" : "") + '">' + esc(result) + "</span></span>" +
          '<span class="lg-row-toggle" data-test="ledger-prompt-expand">展开原文</span>' +
        "</button>" +
        '<div class="lg-row-text" hidden>' + esc(text) + "</div>" +
        "</div>";
    }).join("") + "</div>";
  }

  function renderMinis(model) {
    if (!model.minis.length) {
      return '<div class="lg-empty" data-test="ledger-minigame-empty">今晚没有小游戏。</div>';
    }
    return '<div class="lg-mini" data-test="ledger-minigames">' + model.minis.map(function (m) {
      var label = miniLabel(m.kind || m.minigame);
      return '<div class="lg-mini-row" data-test="ledger-minigame">' +
        '<span class="lg-mini-dot" aria-hidden="true"></span>' +
        esc(label) + " · " + esc(miniOutcome(m)) +
        "</div>";
    }).join("") + "</div>";
  }

  function emptyPage() {
    return '<div class="page lg-page" data-test="ledger">' +
      '<h1 class="lg-title" data-test="ledger-title">今晚回顾</h1>' +
      '<p class="lg-sub">这一页还空着。</p>' +
      '<div class="lg-empty" data-test="ledger-empty">今晚还没有落下任何一张。这一晚仍然算数。</div>' +
      '<div class="lg-actions"><button class="lg-btn main" type="button" data-go="boot">回到开场</button></div>' +
      "</div>";
  }

  function errorPage() {
    return '<div class="page lg-page" data-test="ledger">' +
      '<h1 class="lg-title">今晚回顾</h1>' +
      '<div class="lg-empty" data-test="ledger-error">这一页读不出来，先回开场。</div>' +
      '<div class="lg-actions"><button class="lg-btn main" type="button" data-go="boot">回到开场</button></div>' +
      "</div>";
  }

  App.Screens = App.Screens || {};
  App.Screens.ledger = {
    mount: function (root, params) {
      params = params || {};
      injectStyle();
      var entry = findEntry(params.id);
      if (!entry && !params.id) entry = entryFromSession();
      var model = entry ? buildModel(entry) : null;
      if (!model) {
        if (params.id || entry) { root.innerHTML = errorPage(); bind(root, null); return; }
        root.innerHTML = emptyPage(); bind(root, null); return;
      }

      var ledger = model.ledger;
      var copy = doneCopy(model);
      var endingNote = copy.note;
      root.innerHTML =
        '<div class="page lg-page" data-test="ledger">' +
          '<div class="lg-done" data-test="ledger-done" data-ending="' + esc(model.ending) + '">' +
            '<div class="lg-done-title" data-test="ledger-done-title">' + esc(copy.title) + '</div>' +
            '<div class="lg-done-sub" data-test="ledger-done-sub">' + copy.sub + '</div>' +
          "</div>" +
          '<h1 class="lg-title" data-test="ledger-title">今晚回顾</h1>' +
          '<p class="lg-sub" data-test="ledger-subtitle">' + esc(model.date) + " · " + esc(model.nameA) + " &amp; " + esc(model.nameB) + "</p>" +
          '<div class="lg-stats" data-test="ledger-stats">' +
            '<div class="lg-stat"><div class="lg-stat-label">今晚</div><div class="lg-stat-val">' +
              esc(model.date) + " · " + esc(model.nameA) + " &amp; " + esc(model.nameB) + " · " + esc(model.scale) + "</div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">时长</div><div class="lg-stat-val" data-test="ledger-duration">' + esc(model.duration) + "</div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">题卡</div><div class="lg-stat-val" data-test="ledger-cards">共 <b>' + model.total + "</b> 张 · 做了 <b>" + model.done + "</b> · 放过 <b>" + model.skipped + "</b></div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">已到家</div><div class="lg-stat-val" data-test="ledger-home">' + homeStatHtml(model) + "</div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">心动值</div><div class="lg-stat-val" data-test="ledger-heat"><b>' + model.heat + "</b> · " + esc(model.stage) + "</div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">最高连击</div><div class="lg-stat-val" data-test="ledger-streak">' + model.best + "</div></div>" +
            '<div class="lg-stat"><div class="lg-stat-label">小游戏</div><div class="lg-stat-val" data-test="ledger-minigame-count">' +
              (model.minis.length
                ? model.minis.length + " 次 · 完成 " + model.miniDone + " · 跳过 " + model.miniSkipped
                : "今晚没有小游戏。") +
            "</div></div>" +
          "</div>" +
          '<div class="lg-curve" data-test="ledger-timeline">' + curveSvg(model.curve, model.heat) +
            '<div class="lg-curve-cap"><span>心动值</span><span><b>' + model.heat + "</b> · " + esc(model.stage) + "</span></div>" +
          "</div>" +
          '<div class="lg-sec-title">今晚的每一张</div>' +
          (renderRows(model)) +
          '<div class="lg-sec-title">小游戏</div>' +
          (renderMinis(model)) +
          (ledger.boundaries && ledger.boundaries.length
            ? '<div class="lg-bound" data-test="ledger-boundaries">今晚不做的：' + esc(ledger.boundaries.join("、")) + "</div>"
            : "") +
          '<div class="lg-actions">' +
            '<button class="lg-btn main" type="button" data-act="save" data-test="ledger-save">保存到以前的夜</button>' +
            '<button class="lg-btn soft" type="button" data-act="again" data-test="again-night">再开一夜</button>' +
            '<button class="lg-btn ghost" type="button" data-act="home" data-test="ledger-back">回到开场</button>' +
            (App.Share ? '<button class="lg-btn ghost small" type="button" data-act="share" data-test="ledger-share">存成图片</button>' : "") +
          "</div>" +
          '<div class="lg-foot">' + esc(endingNote) + " · 记录只在这台手机上</div>" +
        "</div>";

      bind(root, model);
    }
  };

  function bind(root, model) {
    root.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var go = t.closest("[data-go]");
      if (go) {
        if (App.Router) App.Router.reset("boot");
        return;
      }
      var row = t.closest('[data-act="expand"]');
      if (row) {
        var item = row.closest(".lg-item");
        if (!item) return;
        var open = item.classList.toggle("open");
        row.setAttribute("aria-expanded", open ? "true" : "false");
        var textEl = item.querySelector(".lg-row-text");
        if (textEl) { if (open) textEl.removeAttribute("hidden"); else textEl.setAttribute("hidden", "hidden"); }
        var toggle = item.querySelector(".lg-row-toggle");
        if (toggle) toggle.textContent = open ? "收起原文" : "展开原文";
        return;
      }
      var btn = t.closest("[data-act]");
      if (!btn || !model) return;
      var act = btn.getAttribute("data-act");
      if (act === "save") {
        saveEntry(model);
        if (App.Audio) App.Audio.play("chime");
        if (App.UI && App.UI.toast) App.UI.toast("收进以前的夜了");
        return;
      }
      if (act === "again") {
        rememberConfig(model.ledger);
        if (App.Router) App.Router.reset("boot");
        return;
      }
      if (act === "home") {
        if (App.Router) App.Router.reset("boot");
        return;
      }
      if (act === "share") {
        share(model);
      }
    });
  }

  function saveEntry(model) {
    if (!App.Store || !App.Store.addHistory) return;
    var ledger = model.ledger;
    var entry = model.entry || {};
    var id = entry.id || ("flight-" + (ledger.endedAt || Date.now()));
    var list = App.Store.getHistory();
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].id === id) return;
    }
    App.Store.addHistory({
      id: id,
      ts: ledger.endedAt || entry.ts || Date.now(),
      kind: "flight",
      title: "今晚飞行棋",
      names: ledger.names || entry.names || { a: model.nameA, b: model.nameB },
      endingName: model.ending === "safe"
        ? "安全词收棋"
        : (model.winnerId ? (model.winnerName || "你们中的一位") + " 先到家" : "今晚一起走到这里"),
      note: "",
      safe: model.ending === "safe",
      ledger: ledger
    });
  }

  function rememberConfig(ledger) {
    try {
      if (!App.Store || !App.Store.saveSettings || !ledger) return;
      var patch = {};
      if (ledger.names && ledger.names.a && ledger.names.b) patch.names = { a: ledger.names.a, b: ledger.names.b };
      if (ledger.colors && ledger.colors.a && ledger.colors.b) patch.colors = { a: ledger.colors.a, b: ledger.colors.b };
      if (ledger.scale) patch.scale = ledger.scale;
      if (ledger.planeCount === 2 || ledger.planeCount === 4) patch.lastPlaneCount = ledger.planeCount;
      if (ledger.mode === "quick" || ledger.mode === "long") patch.mode = ledger.mode;
      if (Object.keys(patch).length) App.Store.saveSettings(patch);
    } catch (e) {
      if (window.console) console.error("[ledger] rememberConfig", e);
    }
  }

  function share(model) {
    if (!App.Share || !App.Share.exportLedger) return;
    try {
      var ret = App.Share.exportLedger(model.ledger);
      if (App.UI && App.UI.toast) {
        if (ret && ret.then) ret.then(function (r) { if (r && r.ok) App.UI.toast("存成图片了"); }).catch(function () { App.UI.toast("图片没存下来"); });
        else if (ret && ret.ok) App.UI.toast("存成图片了");
      }
    } catch (e) {
      if (window.console) console.error("[ledger] share", e);
      if (App.UI && App.UI.toast) App.UI.toast("图片没存下来");
    }
  }
})();

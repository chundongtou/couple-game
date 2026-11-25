/*  ui.js — 屏幕、卡片面板、计时、暂停、记录
 *  依赖：Data / Game / Board / V10Media / V10_CLIPS / V10_CLIPS_X
 */
(function (w) {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var st = null;          // 当前棋局
  var media = null;       // 视频面板控制器
  var timer = null, left = 90, TOTAL = 90;
  var night = 1;
  var screen = "home";
  var lastLedger = null;
  var ledgerView = null;
  var historyIndex = 0;

  /* ---------------- 小工具 ---------------- */
  function toast(msg, ms) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("on");
    clearTimeout(t._h);
    t._h = setTimeout(function () { t.classList.remove("on"); }, ms || 1600);
  }
  function show(id) {
    ["s-home", "s-setup", "s-board", "s-card", "s-ledger"].forEach(function (k) {
      $(k).classList.toggle("on", k === id);
    });
    screen = id.replace("s-", "");
    if (screen === "board") { Board.resize(); Board.render(st); }
  }
  function heatWord(h) {
    if (h >= 76) return "今晚可以更近";
    if (h >= 51) return "很近了";
    if (h >= 26) return "靠近了";
    if (h >= 11) return "有点热";
    return "灯刚亮";
  }
  function name(p) { return st ? st.names[p] : (p === "a" ? "他" : "她"); }

  /* ---------------- 首页 ---------------- */
  function boot() {
    night = Number(localStorage.getItem("v10.night") || 1);
    $("homeNight").textContent = "第 " + night + " 夜";
    $("homeFoot").textContent = Data.count() + " 张题卡 · " + countClips() + " 段镜头";

    var saved = Game.load();
    if (saved && saved.phase !== "done") {
      $("btnResume").style.display = "";
      $("btnResume").textContent = "继续今晚 · 第 " + (saved.cardsDone) + " 张";
      st = saved;
    }
    var last = localStorage.getItem("v10.last");
    if (last) { $("btnLast").style.display = ""; }

    $("btnStart").onclick = function () {
      $("setupFoot").textContent = Data.count() + " 张题卡，棋盘 36 格，掷 6 起飞";
      show("s-setup");
    };
    $("btnResume").onclick = function () {
      if (!st) return;
      Board.resize();
      show("s-board");
      refreshBoard();
      /* 上次停在卡片上：直接回到那张卡 */
      if (st.phase === "card" && st.card) openCard();
    };
    $("btnLast").onclick = function () {
      var h = readHistory();
      if (h.length) { historyIndex = 0; renderLedger(h[0], true); return; }
      try { lastLedger = JSON.parse(localStorage.getItem("v10.last")); } catch (e) { lastLedger = null; }
      renderLedger(lastLedger, true);
    };
  }
  function countClips() {
    var n = 0, m = w.V10_CLIPS || {}, x = w.V10_CLIPS_X || {};
    Object.keys(m).forEach(function (k) { n += m[k].length; });
    Object.keys(x).forEach(function (k) { n += x[k].length; });
    return n;
  }

  /* ---------------- 设置 ---------------- */
  function bindSetup() {
    var mode = "quick", level = "soft";
    $("segMode").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      mode = b.dataset.v;
      Array.prototype.forEach.call(this.children, function (c) { c.classList.toggle("on", c === b); });
    });
    $("segLevel").addEventListener("click", function (e) {
      var b = e.target.closest("button"); if (!b) return;
      level = b.dataset.v;
      Array.prototype.forEach.call(this.children, function (c) { c.classList.toggle("on", c === b); });
      $("levelHint").textContent = level === "explicit"
        ? "露骨档是单人向的成人镜头，尺度更大。"
        : "含蓄档用实拍感镜头，适合刚开始。";
    });
    $("btnBack").onclick = function () { show("s-home"); };
    $("btnGo").onclick = function () {
      st = Game.create({
        names: { a: ($("nameA").value || "他").trim(), b: ($("nameB").value || "她").trim() },
        mode: mode, level: level
      });
      Game.save(st);
      Board.resize();
      show("s-board");
      refreshBoard();
      toast("第 " + night + " 夜 · " + (mode === "long" ? "长夜" : "快局"));
    };
  }

  /* ---------------- 棋盘 ---------------- */
  function refreshBoard() {
    if (!st) return;
    $("bNight").textContent = "第 " + night + " 夜";
    $("bHeat").textContent = st.heat + "°";
    $("bHeat").parentNode.lastChild.textContent = " " + heatWord(st.heat);
    $("bTurn").textContent = name(st.turn);
    $("bDot").style.background = st.colors[st.turn];
    $("bDie").textContent = st.die || "–";
    $("bHint").textContent = st.phase === "move" ? "选一架飞机走 " + st.awaiting.die + " 格" : "的回合 · 掷骰";
    $("btnRoll").textContent = st.phase === "move" ? "走这架" : "掷骰";
    $("btnRoll").disabled = false;
    Board.render(st);
  }

  function bindBoard() {
    $("btnRoll").onclick = function () {
      if (!st) return;
      if (st.phase === "move") {
        var list = Game.movablePlanes(st, st.turn);
        if (!list.length) { toast("没有能动的飞机"); return; }
        if (list.length > 1) { openPicker(list); return; }
        doMove(list[0].i);
        return;
      }
      var r = Game.roll(st);
      if (!r.ok) { toast(r.err || "不能掷骰"); return; }
      $("bDie").textContent = r.die;
      if (r.pass) {
        toast("这轮没得走，换 " + name(st.turn));
        Game.save(st);
        refreshBoard();
        return;
      }
      if (r.auto === "takeoff") {
        toast(r.pity ? "保底起飞 · 该走了" : "起飞 · 再掷一次");
        Game.save(st);
        Board.render(st);
        refreshBoard();
        return;
      }
      Game.save(st);
      refreshBoard();
    };
    $("btnSafe").onclick = function () { openPause(); };
    $("pickClose").onclick = function () { $("pick").classList.remove("on"); };
  }

  /* 多架飞机时让玩家自己选 */
  function openPicker(list) {
    var box = $("pickList");
    box.innerHTML = "";
    $("pickTitle").textContent = name(st.turn) + "走哪一架";
    list.forEach(function (pl) {
      var b = document.createElement("button");
      b.className = "plane";
      var lap = Math.floor(pl.steps / Game.TRACK) + 1;
      var cellIn = pl.steps % Game.TRACK;
      var where = pl.home > 0 ? "归航道第 " + pl.home + " 格" : "第 " + lap + " 圈 · " + (cellIn + 1) + " 格";
      b.innerHTML = '<span class="pi">' + (pl.i + 1) + "</span>" +
        '<span class="pt">第 ' + (pl.i + 1) + " 架<small>" + where + "</small></span>" +
        '<span class="pz">走 ' + st.awaiting.die + " 格</span>";
      b.onclick = function () {
        $("pick").classList.remove("on");
        doMove(pl.i);
      };
      box.appendChild(b);
    });
    $("pick").classList.add("on");
  }

  function doMove(planeIndex, quiet) {
    var res = Game.move(st, planeIndex);
    if (!res || !res.ok) { toast((res && res.err) || "走不了"); return; }
    if (res.captured && !quiet) toast("击落 " + name(res.captured.player) + " 的飞机");
    if (res.finished && !quiet) toast("到家了");
    Game.save(st);
    openCard();
  }

  /* ---------------- 卡片 ---------------- */
  var BEAT_DEF = [
    ["01", "起手", "怎么摆、谁在哪"],
    ["02", "台词", "必须说出口的一句话"],
    ["03", "加压", "中途怎么加压"],
    ["04", "回应", "对方必须回一句"]
  ];

  function beatText(card, i) {
    var t = card.text || "";
    switch (i) {
      case 0: return t;
      case 1: return "把要求说完整：你想要什么，具体到动作、位置、多久。说不清就重来一次。";
      case 2: return "别停在刚才那一下：把同一件事做得更慢一点，再撑十秒。撑不住就开口。";
      case 3: return "对方必须回一句：刚才哪一下最受不了。说不出就再做一遍。";
      default: return "";
    }
  }

  function openCard() {
    var card = st.card;
    if (!card) { backToBoard(); return; }
    $("cKind").textContent = kindLabel(card.pool);
    $("cStars").textContent = "★".repeat(card.star || 1) + "☆".repeat(Math.max(0, 5 - (card.star || 1)));
    $("cTitle").textContent = card.text || "";
    $("cTags").innerHTML = (card.tags || []).map(function (t) { return '<span class="tag">' + t + "</span>"; }).join("");

    /* 五段 */
    var box = $("cBeats");
    box.innerHTML = "";
    BEAT_DEF.forEach(function (b, i) {
      var node = document.createElement("div");
      node.className = "beat" + (i === 0 ? " open" : "");
      node.innerHTML = '<div class="hd"><span class="no">' + b[0] + " " + b[1] + '</span><span class="tt">' + b[2] +
        '</span><span class="chev">▶</span></div><div class="bd">' + escapeHtml(beatText(card, i)) + "</div>";
      node.querySelector(".hd").onclick = function () {
        var open = node.classList.contains("open");
        Array.prototype.forEach.call(box.children, function (x) { x.classList.remove("open"); });
        if (!open) node.classList.add("open");
      };
      box.appendChild(node);
    });
    $("cSafeBlock").innerHTML = '<b>05 停的规则 · 一直在</b><span>任何一方说「停」，就停在原处，不许离开，十秒后再说要不要继续。这不扣分，也不算跳过。</span>';

    /* 视频 */
    mountMedia(card);

    /* 计时 */
    resetTimer();

    /* 状态 */
    $("mA1").textContent = name("a");
    $("mB1").textContent = name("b");
    $("mA2").textContent = st.arousal.a + "/10";
    $("mB2").textContent = st.arousal.b + "/10";
    $("barA").style.width = st.arousal.a * 10 + "%";
    $("barB").style.width = st.arousal.b * 10 + "%";

    show("s-card");
  }

  var POSE_CN = { kneel: "跪姿", wall: "抵墙", behind: "背后", straddle: "骑坐", ontop: "压身", spoon: "侧躺", face: "对坐", stand: "相拥", rest: "依偎" };

  function kindLabel(pool) {
    return ({ truth: "真心话", dare: "大冒险", touch: "靠近", sync: "同步", spark: "越界", punish: "惩罚" })[pool] || "题卡";
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  function mountMedia(card) {
    var canvas = $("media");
    if (!media) media = V10Media.mount(canvas, card, { chrome: false });
    else { media.clearVideo(); media.setCard(card); }

    var clip = Data.clipFor(card, st.level);
    if (clip) {
      media.setVideo(clip.src);
      $("mSrc").textContent = "当前展示 · " + (POSE_CN[clip.pose] || clip.pose);
    } else {
      $("mSrc").textContent = "当前展示 · 分镜";
    }
    $("mLv").textContent = st.level === "explicit" ? "露骨" : "含蓄";

    /* 本地绑定 */
    V10Media.getLocal(card.id).then(function (url) {
      if (url) { media.setVideo(url); $("mSrc").textContent = "当前展示 · 你的片子"; }
    }).catch(function () { });

    /* 时间码 */
    var t0 = Date.now();
    clearInterval(mountMedia._tc);
    mountMedia._tc = setInterval(function () {
      var s = Math.floor((Date.now() - t0) / 1000);
      $("mTc").textContent = String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
    }, 500);
  }

  function bindCard() {
    $("mLv").onclick = function () {
      st.level = st.level === "explicit" ? "soft" : "explicit";
      Game.save(st);
      mountMedia(st.card);
    };
    $("mBind").onclick = function () { $("mFile").click(); };
    $("mFile").onchange = function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      var url = URL.createObjectURL(f);
      media.setVideo(url);
      $("mSrc").textContent = "当前展示 · 你的片子";
      V10Media.bindLocal(f, st.card.id).catch(function () { });
    };
    $("cSafe").onclick = function () { openPause(); };

    $("btnTimer").onclick = function () { toggleTimer(); };

    $("cSkip").onclick = function () {
      Game.resolveCard(st, { skip: true });
      Game.save(st);
      afterCard();
    };
    $("cDone").onclick = function () { openSheet(); };

    Array.prototype.forEach.call(document.querySelectorAll("#scores .score"), function (b) {
      b.onclick = function () {
        var s = Number(b.dataset.s);
        Game.resolveCard(st, { reaction: s });
        Game.save(st);
        $("sheet").classList.remove("on");
        afterCard();
      };
    });
    $("sheetClose").onclick = function () { $("sheet").classList.remove("on"); };
  }

  function openSheet() {
    $("sheetTitle").textContent = name(other(st.turn)) + "刚才是什么反应";
    $("sheet").classList.add("on");
  }
  function other(p) { return p === "a" ? "b" : "a"; }

  function afterCard() {
    clearInterval(mountMedia._tc);
    if (media) media.pause();
    if (st.phase === "ending" || st.phase === "done") { finishNight(); return; }
    show("s-board");
    refreshBoard();
  }
  function backToBoard() { show("s-board"); refreshBoard(); }

  /* ---------------- 计时 ---------------- */
  function resetTimer() {
    clearInterval(timer); timer = null; left = TOTAL;
    $("ringT").textContent = String(left);
    $("ringArc").setAttribute("stroke-dashoffset", "113.1");
    $("btnTimer").textContent = "开始";
  }
  function toggleTimer() {
    if (timer) { clearInterval(timer); timer = null; $("btnTimer").textContent = "继续"; return; }
    $("btnTimer").textContent = "暂停";
    timer = setInterval(function () {
      left = Math.max(0, left - 1);
      $("ringT").textContent = String(left);
      $("ringArc").setAttribute("stroke-dashoffset", String(113.1 * (1 - left / TOTAL)));
      if (left === 0) { clearInterval(timer); timer = null; $("btnTimer").textContent = "重来"; }
    }, 1000);
  }

  /* ---------------- 暂停 / 呼吸 ---------------- */
  var breathT = null;
  function openPause() {
    $("pause").classList.add("on");
    if (media) media.pause();
    clearInterval(timer); timer = null;
    startBreath();
  }
  function closePause() {
    $("pause").classList.remove("on");
    clearTimeout(breathT);
    $("breathC").classList.remove("up");
  }
  function startBreath() {
    var seq = [["吸气", 4000, true], ["停", 7000, false], ["呼气", 8000, false]];
    var i = 0;
    $("breathC").textContent = seq[0][0];
    $("breathC").classList.add("up");
    function step() {
      i = (i + 1) % seq.length;
      $("breathC").textContent = seq[i][0];
      $("breathC").classList.toggle("up", seq[i][2]);
      breathT = setTimeout(step, seq[i][1]);
    }
    breathT = setTimeout(step, seq[0][1]);
  }
  function bindPause() {
    $("btnResumeSafe").onclick = function () { closePause(); if (screen === "card" && media) media.play(); };
    $("btnToLedger").onclick = function () { closePause(); finishNight(); };
  }

  /* ---------------- 收尾 / 记录 ---------------- */
  function finishNight() {
    if (!st) return;
    st.phase = "done";
    var payload = {
      night: night, ts: Date.now(), names: st.names, mode: st.mode, level: st.level,
      heat: st.heat, cardsDone: st.cardsDone, cardsSkipped: st.cardsSkipped,
      bestStreak: st.bestStreak, ledger: st.ledger, winner: st.winner
    };
    try {
      localStorage.setItem("v10.last", JSON.stringify(payload));
      localStorage.setItem("v10.night", String(night + 1));
      pushHistory(payload);
    } catch (e) { }
    Game.clear();
    st = null;
    night = Number(localStorage.getItem("v10.night") || 1);
    renderLedger(payload, false);
    $("homeNight").textContent = "第 " + night + " 夜";
    $("btnResume").style.display = "none";
    $("btnLast").style.display = "";
  }

  /* ---------------- 夜晚历史 ---------------- */
  function readHistory() {
    try { return JSON.parse(localStorage.getItem("v10.history") || "[]"); } catch (e) { return []; }
  }
  function pushHistory(payload) {
    var h = readHistory();
    h.unshift(payload);
    if (h.length > 20) h.length = 20;
    localStorage.setItem("v10.history", JSON.stringify(h));
  }

  /* ---------------- 存成图片 ---------------- */
  function exportPng(payload) {
    var W = 1080, H = 1500;
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var g = c.getContext("2d");

    var bg = g.createLinearGradient(0, 0, W * 0.4, H);
    bg.addColorStop(0, "#0d1720");
    bg.addColorStop(0.6, "#080b10");
    bg.addColorStop(1, "#05070a");
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);

    var glow = g.createRadialGradient(W * 0.8, -H * 0.05, 0, W * 0.8, -H * 0.05, H * 0.8);
    glow.addColorStop(0, "rgba(224,164,94,0.22)");
    glow.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = glow;
    g.fillRect(0, 0, W, H);

    g.fillStyle = "#e0a45e";
    g.font = "600 30px Georgia, serif";
    g.fillText("TONIGHT", 80, 120);

    g.fillStyle = "#f3e6d6";
    g.font = "700 68px Georgia, 'Songti SC', serif";
    g.fillText("第 " + payload.night + " 夜", 80, 210);

    g.fillStyle = "#9d8a7a";
    g.font = "400 30px system-ui, sans-serif";
    g.fillText((payload.names.a || "他") + " 与 " + (payload.names.b || "她") + " · " +
      (payload.mode === "long" ? "长夜" : "快局") + " · " + (payload.level === "explicit" ? "露骨" : "含蓄"), 80, 262);

    var stats = [
      [String(payload.cardsDone), "卡片"],
      [payload.heat + "°", "温度"],
      [String(payload.bestStreak), "最长连击"]
    ];
    stats.forEach(function (s, i) {
      var x = 80 + i * 320;
      g.fillStyle = "#e0a45e";
      g.font = "700 54px Georgia, serif";
      g.fillText(s[0], x, 372);
      g.fillStyle = "#6d5f55";
      g.font = "400 24px system-ui, sans-serif";
      g.fillText(s[1], x, 408);
    });

    g.strokeStyle = "#1d2631";
    g.beginPath(); g.moveTo(80, 450); g.lineTo(W - 80, 450); g.stroke();

    var list = (payload.ledger || []).slice(-8).reverse();
    var y = 520;
    list.forEach(function (e) {
      g.fillStyle = e.done ? "#f3e6d6" : "#5c5057";
      g.font = "600 26px system-ui, sans-serif";
      var who = payload.names[e.player] || "他";
      var head = who + " · " + (e.done ? "完成" : "放过");
      g.fillText(head, 80, y);
      g.fillStyle = e.done ? "#cbbbaa" : "#4b4448";
      g.font = "400 27px system-ui, sans-serif";
      var txt = String(e.card.text || "");
      if (txt.length > 22) txt = txt.slice(0, 22) + "…";
      g.fillText(txt, 80, y + 40);
      y += 108;
    });

    g.fillStyle = "#3a3a42";
    g.font = "400 22px system-ui, sans-serif";
    g.fillText("今晚飞行棋 · V10", 80, H - 70);

    try {
      var a = document.createElement("a");
      a.download = "今晚飞行棋-第" + payload.night + "夜.png";
      a.href = c.toDataURL("image/png");
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast("已存成图片");
    } catch (e) {
      toast("这张没存下来，再点一次");
    }
  }

  function renderLedger(payload, isPast) {
    if (!payload) { toast("还没有记录"); return; }
    ledgerView = payload;
    $("lTitle").textContent = isPast ? "第 " + payload.night + " 夜 · 回顾" : "今晚走到这里";
    $("lCards").textContent = payload.cardsDone;
    $("lHeat").textContent = payload.heat + "°";
    $("lStreak").textContent = payload.bestStreak;

    /* 历史翻页 */
    var h = readHistory();
    var showNav = h.length > 1 && isPast;
    $("lNav").style.display = showNav ? "" : "none";
    if (showNav) {
      $("lOlder").disabled = historyIndex + 1 >= h.length;
      $("lNewer").disabled = historyIndex <= 0;
      $("lOlder").style.opacity = $("lOlder").disabled ? .4 : 1;
      $("lNewer").style.opacity = $("lNewer").disabled ? .4 : 1;
    }

    var list = $("lList");
    list.innerHTML = "";
    (payload.ledger || []).slice().reverse().forEach(function (e) {
      var d = document.createElement("div");
      d.className = "entry" + (e.done ? "" : " skipped");
      var who = payload.names[e.player] || (e.player === "a" ? "他" : "她");
      var stars = "★".repeat(e.card.star || 1);
      d.innerHTML = '<div class="top"><b>' + escapeHtml(who) + "</b><span>" + kindLabel(e.card.pool) +
        "</span><span>" + stars + "</span><span style='margin-left:auto'>" + (e.done ? "完成" : "放过") + "</span></div>" +
        '<div class="txt">' + escapeHtml(e.card.text || "") + "</div>";
      list.appendChild(d);
    });
    show("s-ledger");
  }

  function bindLedger() {
    $("lBack").onclick = function () {
      if (st) { show("s-board"); refreshBoard(); }
      else { show("s-home"); }
    };
    $("lNew").onclick = function () { show("s-home"); };
    $("lShot").onclick = function () {
      if (ledgerView) exportPng(ledgerView);
      else toast("还没有记录");
    };
    $("lOlder").onclick = function () {
      var h = readHistory();
      if (historyIndex + 1 < h.length) {
        historyIndex++;
        ledgerView = h[historyIndex];
        renderLedger(ledgerView, true, true);
      }
    };
    $("lNewer").onclick = function () {
      var h = readHistory();
      if (historyIndex > 0) {
        historyIndex--;
        ledgerView = h[historyIndex];
        renderLedger(ledgerView, true, true);
      }
    };
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    window.__errors = [];
    window.addEventListener("error", function (e) { window.__errors.push(String(e.message)); });
    Board.mount($("board"));
    bindSetup(); bindBoard(); bindCard(); bindPause(); bindLedger();
    boot();
    window.addEventListener("resize", function () { if (screen === "board") { Board.resize(); Board.render(st); } });
    /* 每帧轻刷棋盘上的呼吸感 */
    setInterval(function () {
      if (screen === "board" && st) Board.render(st);
    }, 500);
  }

  /* QA 钩子：只在 ?qa=1 时暴露，生产环境不存在 */
  if (location.search.indexOf("qa") >= 0) {
    w.V10 = {
      newGame: function (mode, level) {
        st = Game.create({ names: { a: "他", b: "她" }, mode: mode || "quick", level: level || "soft" });
        Board.resize(); show("s-board"); refreshBoard(); return st;
      },
      card: function (pool) {
        if (!st) this.newGame();
        st.card = Game.drawCard(st, pool || "touch");
        st.phase = "card";
        openCard();
        return st.card.id;
      },
      ledger: function () {
        if (!st) this.newGame();
        st.cardsDone = 6; st.heat = 42; st.bestStreak = 3;
        for (var i = 0; i < 6; i++) {
          var c = Game.drawCard(st, i % 2 ? "dare" : "touch");
          st.ledger.push({ ts: Date.now(), player: i % 2 ? "b" : "a", card: c, done: i !== 4, reaction: 2 });
        }
        finishNight();
      },
      picker: function () {
        if (!st) this.newGame('long');
        st.p.a[0].steps = 8; st.p.a[1].steps = 14;
        st.phase = 'move'; st.awaiting = { type: 'move', die: 4 }; st.die = 4;
        refreshBoard(); openPicker(Game.movablePlanes(st, 'a'));
      },
      save: function () { if (st) Game.save(st); return true; },
      exportPng: function () { return document.querySelector('#lShot') ? 1 : 0; },
      pause: function () { openPause(); },
      level: function (v) { st.level = v; if (st.card) mountMedia(st.card); },
      state: function () { return st; }
    };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window);

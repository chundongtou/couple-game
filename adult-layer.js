/*!
 * adult-layer.js — 今晚飞行棋 V9.7 成人层（零改源码叠加）
 *
 * 接管 App.FlightDraw.take（抽卡）与卡片展示，新增：
 *   台词层 / 五段式 / 90 秒计时与振动节拍 / 对方反应分 /
 *   规则与惩罚债 / 收尾 aftercare / 跨夜存档
 *
 * 用法：在 index.html 的 </body> 前加
 *   <link rel="stylesheet" href="adult-layer.css">
 *   <script src="adult-layer.js"></script>
 */
(function () {
  "use strict";

  var A = window.App;
  if (!A || !A.FlightDraw) { console.warn("[adult] 需要 App.FlightDraw"); return; }
  var FD = A.FlightDraw;
  var CARDS = window.CARDS || {};
  var POOLS = ["truth", "dare", "touch", "sync", "spark", "punish"];

  /* ================= 1. 向量化 ================= */
  var ZONES = [
    [/口|含|舔|吞|深喉|嘴|唇|舌|吮/, "mouth"],
    [/胸|乳|奶/, "chest"],
    [/臀|腰|大腿|内侧|胯/, "waist"],
    [/手|指尖|手腕|手心|掌/, "hands"],
    [/颈|脖|锁骨|耳|后颈/, "neck"],
    [/下面|私处|里面|进入|插入|顶|骑|坐上去|后入|磨蹭/, "genital"]
  ];
  var VERBS = [
    [/舔|吻|亲|含|吮|吞/, "oral"],
    [/绑|缚|按住|压住|不许动|捆/, "restrain"],
    [/看|盯着|对视|露|展示|看着/, "watch"],
    [/说|问|答|叫|求|告诉我|说出/, "talk"],
    [/进入|插|顶|骑|坐上去|后入|抽/, "penetrate"],
    [/摸|抚|揉|捏|蹭|磨|按/, "touch"]
  ];
  var PROPS = [
    [/丝巾|领带|绳|眼罩|蒙眼|手铐/, "silk"],
    [/冰|冰块|蜡/, "ice"],
    [/玩具|跳蛋|道具/, "toy"],
    [/酒|杯/, "drink"]
  ];
  var PACE_HINTS = [
    [/慢|一点一点|停|撑着|数到/, "slow"],
    [/快|狠|重|用力|不许停/, "fast"],
    [/边缘|忍住|快到|不许结束/, "edge"],
    [/保持|不动/, "hold"]
  ];

  function pick(text, table, dflt) {
    for (var i = 0; i < table.length; i++) if (table[i][0].test(text)) return table[i][1];
    return dflt;
  }

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  function vecOf(card) {
    if (card.__v) return card.__v;
    var t = String(card.text || "");
    var star = Number(card.star) || 1;
    var tags = card.tags || [];
    var v = {
      intensity: Math.max(0, Math.min(4, star - 1)),
      zone: pick(t, ZONES, "hands"),
      verb: pick(t, VERBS, "touch"),
      comp: pick(t, PACE_HINTS, "build"),
      prop: null,
      verbal: /说|问|答|叫|求|告诉我/.test(t) ? 2 : 0,
      exposure: tags.indexOf("露出") >= 0 ? 2 : 0,
      restraint: tags.indexOf("束缚") >= 0 ? 2 : 0,
      star: star,
      tags: tags,
      pool: card.pool || card.type || "truth"
    };
    for (var i = 0; i < PROPS.length; i++) if (PROPS[i][0].test(t)) { v.prop = PROPS[i][1]; break; }
    card.__v = v;
    return v;
  }

  /* ================= 2. 台词池 ================= */
  var LINES = {
    0: ["看着我。", "别躲。", "再说一遍。", "你要什么，说出来。"],
    1: ["再近一点。", "手别停。", "看着我做。", "别急着。"],
    2: ["说你要什么。", "叫我的名字。", "别让我猜。", "你要多久，说清楚。"],
    3: ["不许动。", "求我。", "说出来，我就给你。", "看着我，别闭眼。"],
    4: ["不许自己碰，等我。", "说你想要什么，说完整。", "再撑十秒。", "说，你是谁的。"]
  };
  var LINES_VERB = {
    oral: ["看着我做。", "抬起头，别闭眼。", "慢一点，我说慢。"],
    restrain: ["不许动。", "手腕放好。", "挣一下试试。"],
    watch: ["看着我。", "别移开眼。", "看清楚了。"],
    talk: ["说完整。", "再说一遍，慢一点。", "我要听你亲口说。"],
    penetrate: ["说你想要。", "别忍着，出声。", "数三下。"],
    touch: ["手别停。", "慢一点。", "就是这里。"]
  };

  function lineFor(card) {
    var v = vecOf(card);
    var pool = (LINES_VERB[v.verb] || []).concat(LINES[v.intensity] || LINES[2]);
    return pool[hash(card.id || "x") % pool.length];
  }

  /* ================= 3. 节拍与加压 ================= */
  var PACE = {
    slow: { label: "慢", hint: "慢到对方开口要你快", seconds: 120 },
    fast: { label: "重", hint: "别留手，但听她的声音", seconds: 60 },
    edge: { label: "悬", hint: "快到时候就停，停十秒再来", seconds: 150 },
    hold: { label: "撑", hint: "保持不动，先动的人输", seconds: 90 },
    build: { label: "推", hint: "一点一点加压，别一次给完", seconds: 90 }
  };

  function escalateFor(card) {
    var v = vecOf(card);
    var p = PACE[v.comp] || PACE.build;
    var extra = v.intensity >= 3
      ? "撑不住就开口说「停」，但不许躲开。"
      : "做不到就说出来，换一种做法，不许跳过。";
    return p.hint + "。" + extra;
  }

  /* ================= 4. 抽卡引擎接管 ================= */
  var STATE_KEY = "v97.adult";

  function loadS() {
    try {
      var s = JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
      s.used = s.used || {};
      s.debt = s.debt || 0;
      s.count = s.count || 0;
      s.lastIntensity = typeof s.lastIntensity === "number" ? s.lastIntensity : 0;
      s.arousal = s.arousal || { a: 4, b: 5 };
      s.rules = s.rules || [];
      s.series = s.series || [];
      return s;
    } catch (e) {
      return { used: {}, debt: 0, count: 0, lastIntensity: 0, arousal: { a: 4, b: 5 }, rules: [], series: [] };
    }
  }
  var S = loadS();
  function saveS() { try { localStorage.setItem(STATE_KEY, JSON.stringify(S)); } catch (e) { } }

  function scaleOf(state) {
    return (state && state.scale) || "warm";
  }

  /* 每档的强度上限（阶梯式：不超过上一张 +1） */
  var CAP = { gentle: 2, warm: 3, hot: 4, open: 4 };
  var BLOCK_AT_GENTLE = ["道具", "露出", "束缚", "蒙眼"];

  function allowed(card, state) {
    var v = vecOf(card);
    var scale = scaleOf(state);
    var cap = CAP[scale] == null ? 3 : CAP[scale];

    /* 阶梯：不许一上来就最狠 */
    if (S.lastIntensity >= 0) cap = Math.min(cap, S.lastIntensity + 1);
    if (v.intensity > cap) return false;

    /* 温柔档按 tag 过滤，而不是把 2-3 星全砍掉 */
    if (scale === "gentle") {
      for (var i = 0; i < BLOCK_AT_GENTLE.length; i++) {
        if (v.tags.indexOf(BLOCK_AT_GENTLE[i]) >= 0) return false;
      }
      if (v.exposure > 0) return false;
    }
    /* punish 不再是死内容 */
    return true;
  }

  function poolsFor(kind, cap) {
    switch (kind) {
      case "cell-truth": return ["truth"];
      case "cell-dare": return ["dare"];
      case "cell-touch": return ["touch"];
      case "capture": return ["punish", "dare", "touch"];
      case "stack-duo": return ["sync", "touch"];
      case "home-entry":
      case "ending": return ["spark", "touch", "truth"];
      case "fate": return cap >= 4 ? ["spark", "touch"] : ["touch", "truth"];
      default: return ["truth"];
    }
  }

  /* 与原版一致的 xorshift，保持存档可复现 */
  function makeRng(seed) {
    var x = (seed >>> 0) || 1;
    return {
      next: function () {
        x |= 0; x = x + 1831565813 | 0;
        var t = Math.imul(x ^ x >>> 15, 1 | x);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      },
      state: function () { return x >>> 0; }
    };
  }

  var FALLBACK = [
    { id: "al-f1", text: "看着对方的眼睛，说一件你一直记得的小事。", star: 1, tags: [], pool: "truth" },
    { id: "al-f2", text: "把手放在对方手背上，停十秒，再说一句实话。", star: 1, tags: [], pool: "sync" }
  ];

  function weightOf(card) {
    var v = vecOf(card);
    var w = 4;
    if (v.intensity >= 2) w += 6;
    if (v.intensity >= 3) w += 6;
    if (v.verbal >= 2) w += 3;
    /* 每三拍必须有一拍慢或说话 */
    if (S.count > 0 && S.count % 3 === 2) {
      w += (v.comp === "slow" || v.verb === "talk" || v.verbal >= 2) ? 18 : 0;
    }
    return w;
  }

  var lastCard = null;

  FD.take = function (state, kind) {
    var st = JSON.parse(JSON.stringify(state || {}));
    st.usedCards = st.usedCards || {};
    POOLS.forEach(function (p) { st.usedCards[p] = st.usedCards[p] || {}; });

    var rng = makeRng(st.rng || 1);
    var scale = scaleOf(st);
    var cap = CAP[scale] == null ? 3 : CAP[scale];

    /* 惩罚债：上一拍违令了，这一拍先还 */
    var forcePool = null;
    if (S.debt > 0) { forcePool = "punish"; S.debt--; saveS(); }
    if (S.aftercareNext && kind !== "ending") { forcePool = "sync"; }

    var pools = forcePool ? [forcePool] : poolsFor(kind, cap);
    var cands = [];

    pools.forEach(function (p) {
      (CARDS[p] || []).forEach(function (c) {
        if (st.usedCards[p][c.id]) return;
        var card = { id: c.id, text: c.text, star: c.star, tags: c.tags || [], pool: p, type: p, src: c.src || "" };
        if (!allowed(card, st)) return;
        cands.push(card);
      });
    });

    /* 池子空了就重置这一池 */
    if (!cands.length) {
      pools.forEach(function (p) { st.usedCards[p] = {}; });
      pools.forEach(function (p) {
        (CARDS[p] || []).forEach(function (c) {
          var card = { id: c.id, text: c.text, star: c.star, tags: c.tags || [], pool: p, type: p };
          if (allowed(card, st)) cands.push(card);
        });
      });
    }
    if (!cands.length) {
      var fb = FALLBACK[Math.floor(rng.next() * FALLBACK.length)];
      return { state: st, card: Object.assign({}, fb) };
    }

    var total = cands.reduce(function (a, c) { return a + weightOf(c); }, 0);
    var r = rng.next() * total, pickd = cands[cands.length - 1];
    for (var i = 0; i < cands.length; i++) { r -= weightOf(cands[i]); if (r < 0) { pickd = cands[i]; break; } }

    st.usedCards[pickd.pool][pickd.id] = true;
    st.rng = rng.state();

    /* 记录节奏与强度 */
    var v = vecOf(pickd);
    S.lastIntensity = v.intensity;
    S.count++;
    lastCard = pickd;
    saveS();

    return { state: st, card: pickd };
  };

    /* ================= 5. 面板（就地插入原生卡片） ================= */
  var stage = { open: false, card: null, left: 0, timer: null, vibrate: false, timers: [] };

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function buildPanel(card, inline) {
    var v = vecOf(card);
    var p = PACE[v.comp] || PACE.build;
    var wrap = el("div", inline ? "al-inline" : "al-layer");

    var head =
      '<div class="al-head">' +
        (inline ? "" : '<span class="al-kind">' + kindLabel(card.pool) + '</span><span class="al-stars">' + stars(v.star) + '</span>') +
        '<span class="al-pace">' + p.label + ' · ' + Math.round(p.seconds) + 's</span>' +
        '<span class="al-sp"></span>' +
        '<button class="al-x" aria-label="收起">收起</button>' +
      '</div>';

    var say = '<section class="al-say"><b>台词 · 说出口</b><p>' + esc(lineFor(card)) + '</p></section>';

    var timer =
      '<div class="al-timer">' +
        '<div class="al-ring"><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" class="tr"/><circle cx="22" cy="22" r="18" class="pg" id="al-arc"/></svg><span id="al-left"></span></div>' +
        '<div class="al-time-txt"><b>这一拍别急着结束</b><span>先看呼吸，再决定加压</span></div>' +
        '<button class="al-btn small" id="al-start">开始</button>' +
        '<button class="al-btn small ghost" id="al-vib">震动</button>' +
      '</div>';

    var react =
      '<div class="al-react">' +
        '<span>她的反应</span>' +
        '<button data-r="0">0<small>没进去</small></button>' +
        '<button data-r="1">1<small>还行</small></button>' +
        '<button data-r="2">2<small>很投入</small></button>' +
        '<button data-r="3">3<small>快失控</small></button>' +
        '<button class="al-rule" id="al-rule">违令</button>' +
      '</div>';

    var detail =
      '<div class="al-body" id="al-detail" hidden>' +
        '<section class="al-beat"><b>01 起手</b><p>' + esc(card.text) + '</p></section>' +
        '<section class="al-beat"><b>02 加压</b><p>' + esc(escalateFor(card)) + '</p></section>' +
        '<section class="al-beat"><b>03 回应</b><p>对方必须回一句：刚才哪一下最受不了。说不出就再做一遍。</p></section>' +
        '<section class="al-stop"><b>04 停的规则</b><p>任何一方说「停」就停在原处，不许离开，十秒后再说要不要继续。停不扣分，也不算跳过。</p></section>' +
      '</div>' +
      '<button class="al-more" id="al-more">展开细则 · 起手 / 加压 / 回应 / 停</button>';

    var foot = inline ? "" :
      '<div class="al-foot">' +
        '<button class="al-btn ghost" id="al-skip">放过</button>' +
        '<button class="al-btn primary" id="al-done">做了</button>' +
      '</div>';

    wrap.innerHTML =
      '<div class="al-sheet">' + head + say +
        '<div class="al-quick">' + timer + react + '</div>' +
        detail + foot +
      '</div>';
    return wrap;
  }

  function kindLabel(pool) {
    return ({ truth: "真心话", dare: "大冒险", touch: "靠近", sync: "同步", spark: "越界", punish: "惩罚" })[pool] || "题卡";
  }
  function stars(n) {
    n = Math.max(1, Math.min(5, n || 1));
    return "★".repeat(n) + "☆".repeat(5 - n);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }

  /* 等原生卡片渲染出来再插进去 */
  function waitNative(card, tries) {
    tries = tries || 0;
    var host = document.querySelector('[data-test="prompt-host"]');
    if (host && host.innerHTML.length > 100) { mount(card, host); return; }
    if (tries > 45) { mount(card, null); return; }
    setTimeout(function () { waitNative(card, tries + 1); }, 120);
  }

  /* 原生卡片是否已经展示出这张卡（用于决定什么时候盖上去） */
  function cardVisible(card) {
    var host = document.querySelector('[data-test="prompt-host"]');
    if (!host) return false;
    var t = host.textContent || "";
    if (t.length < 40) return false;
    if (/两张里挑一张|今晚先不选|转盘|换个角度|掷骰子/.test(t)) return false;
    var key = String(card.text || "").slice(0, 6);
    return key.length > 3 && t.indexOf(key) >= 0;
  }

  function mount(card) {
    if (stage.open && stage.card && stage.card.id === card.id) return;
    unmount();
    stage.card = card;
    stage.open = true;
    var node = buildPanel(card, false);
    document.body.appendChild(node);
    void node.offsetWidth;
    node.classList.add("on");
    bind(node, card, false);
    startTimer(node, vecOf(card).comp);
  }
  function unmount() {
    clearInterval(stage.timer);
    stage.timer = null;
    stage.timers.forEach(function (t) { clearTimeout(t); });
    stage.timers = [];
    if (navigator.vibrate) navigator.vibrate(0);
    var n = document.querySelector(".al-inline") || document.querySelector(".al-layer");
    if (n) {
      n.classList.remove("on");
      if (n.parentNode) n.parentNode.removeChild(n);
    }
    /* 关掉后短时间内不要立刻又盖上来 */
    if (stage.card) stage.suppress = { id: stage.card.id, until: Date.now() + 2500 };
    stage.open = false;
    stage.card = null;
  }

  function startTimer(node, comp) {
    var total = (PACE[comp] || PACE.build).seconds;
    stage.left = total;
    var arc = node.querySelector("#al-arc");
    var left = node.querySelector("#al-left");
    var btn = node.querySelector("#al-start");
    if (!arc || !left || !btn) return;
    var C = 2 * Math.PI * 18;
    arc.style.strokeDasharray = String(C);
    arc.style.strokeDashoffset = "0";
    left.textContent = String(total);
    btn.textContent = "暂停";

    clearInterval(stage.timer);
    stage.timer = setInterval(function () {
      stage.left = Math.max(0, stage.left - 1);
      left.textContent = String(stage.left);
      arc.style.strokeDashoffset = String(C * (1 - stage.left / total));
      if (stage.vibrate && navigator.vibrate && stage.left % 4 === 0) navigator.vibrate(18);
      if (stage.left === 0) { clearInterval(stage.timer); stage.timer = null; btn.textContent = "重来"; }
    }, 1000);

    btn.onclick = function () {
      if (stage.timer) { clearInterval(stage.timer); stage.timer = null; btn.textContent = "继续"; return; }
      btn.textContent = "暂停";
      stage.timer = setInterval(function () {
        stage.left = Math.max(0, stage.left - 1);
        left.textContent = String(stage.left);
        arc.style.strokeDashoffset = String(C * (1 - stage.left / total));
        if (stage.left === 0) { clearInterval(stage.timer); stage.timer = null; btn.textContent = "重来"; }
      }, 1000);
    };
  }

  function bind(node, card, inline) {
    var x = node.querySelector(".al-x");
    if (x) x.onclick = function () { unmount(); };
    var vib = node.querySelector("#al-vib");
    if (vib) vib.onclick = function () {
      stage.vibrate = !stage.vibrate;
      vib.classList.toggle("on", stage.vibrate);
      if (navigator.vibrate) navigator.vibrate(stage.vibrate ? 40 : 0);
    };
    var done = node.querySelector("#al-done");
    if (done) done.onclick = function () { closeAndAdvance(false); };
    var skip = node.querySelector("#al-skip");
    if (skip) skip.onclick = function () { closeAndAdvance(true); };
    var more = node.querySelector("#al-more");
    if (more) more.onclick = function () {
      var d = node.querySelector("#al-detail");
      d.hidden = !d.hidden;
      more.textContent = d.hidden ? "展开细则 · 起手 / 加压 / 回应 / 停" : "收起细则";
    };
    var rule = node.querySelector("#al-rule");
    if (rule) rule.onclick = function () {
      S.debt = (S.debt || 0) + 1;
      saveS();
      rule.textContent = "违令 +" + (S.debt + 1);
      ruleFlash(node);
    };
    Array.prototype.forEach.call(node.querySelectorAll(".al-react button[data-r]"), function (b) {
      b.onclick = function () {
        var r = Number(b.dataset.r);
        S.arousal.b = Math.max(0, Math.min(10, (S.arousal.b || 5) + (r - 1)));
        S.arousal.a = Math.max(0, Math.min(10, (S.arousal.a || 4) + (r >= 2 ? 1 : 0)));
        saveS();
        node.querySelectorAll(".al-react button[data-r]").forEach(function (y) { y.classList.remove("on"); });
        b.classList.add("on");
        ruleFlash(node, "记下了 · 她 " + S.arousal.b + "/10");
      };
    });
  }

  function ruleFlash(node, text) {
    var f = el("div", "al-toast", text || "记一次 · 下一张从惩罚池里抽");
    node.appendChild(f);
    stage.timers.push(setTimeout(function () { f.classList.add("on"); }, 10));
    stage.timers.push(setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); }, 1600));
  }

  function closeAndAdvance(skip) {
    var host = document.querySelector('[data-test="prompt-host"]');
    var btns = host ? Array.prototype.slice.call(host.querySelectorAll("button")) : [];
    var target = null;
    for (var i = 0; i < btns.length; i++) {
      var tx = (btns[i].textContent || "").trim();
      if (skip ? /放过|跳过|先不选|换一张/.test(tx) : /做了|完成|要这张|收下/.test(tx)) { target = btns[i]; break; }
    }
    unmount();
    if (target) setTimeout(function () { target.click(); }, 120);
  }

/* ================= 6. 收尾 aftercare ================= */
  var AFTERCARE = [
    { k: "清理", t: "一个人去拿毛巾，另一个人先别说话。回来的时候手要碰到。" },
    { k: "覆盖", t: "把被子拉上来，盖住两个人的肩。谁先开口都行。" },
    { k: "说话", t: "一人说一句：今晚最好的那一下是什么。不许说「都很好」。" },
    { k: "记一句", t: "写一句留给下一次。下一夜开场会念出来。" }
  ];

  function showAftercare() {
    unmount();
    var wrap = el("div", "al-layer on al-after");
    wrap.innerHTML =
      '<div class="al-scrim"></div>' +
      '<div class="al-sheet">' +
        '<div class="al-head"><span class="al-kind">收尾</span><span class="al-stars">aftercare</span></div>' +
        '<h2 class="al-title">今晚最后一段</h2>' +
        '<div class="al-body" id="al-steps"></div>' +
        '<div class="al-foot"><button class="al-btn primary" id="al-finish">记下了</button></div>' +
      '</div>';
    document.body.appendChild(wrap);
    var steps = wrap.querySelector("#al-steps");
    AFTERCARE.slice(0, 3).forEach(function (s, i) {
      steps.appendChild(el("section", "al-beat", "<b>0" + (i + 1) + " " + s.k + "</b><p>" + s.t + "</p>"));
    });
    var note = el("section", "al-stop", "<b>04 记一句</b><p>写一句留给下一次。</p>");
    var input = el("input", "al-input");
    input.maxLength = 40;
    input.placeholder = "比如：她抓我背的那一下";
    note.appendChild(input);
    steps.appendChild(note);

    wrap.querySelector("#al-finish").onclick = function () {
      var txt = (input.value || "").trim();
      if (txt) {
        S.series.unshift({ ts: Date.now(), note: txt });
        S.series = S.series.slice(0, 20);
        saveS();
      }
      wrap.remove();
    };
  }

  /* ================= 7. 侦测卡片出现 / 收尾 ================= */
  var origTake = FD.take;
  FD.take = function (state, kind) {
    var r = origTake.call(FD, state, kind);
    if (r && r.card) {
      r.card.__adultLine = lineFor(r.card);
      lastCard = r.card;
      if (window.__adultNoMount) return r;
      if (kind === "ending") {
        stage.timers.push(setTimeout(showAftercare, 600));
      }
    }
    return r;
  };

  /* 原生卡片一出现就盖上去；选牌 / 转盘这类不插 */
  var observer = new MutationObserver(function () {
    if (window.__adultNoMount) return;
    if (document.querySelector(".al-layer")) return;
    if (!lastCard || !cardVisible(lastCard)) return;
    if (stage.suppress && stage.suppress.id === lastCard.id && Date.now() < stage.suppress.until) return;
    mount(lastCard);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  /* 首页加一行：上次停在哪 + 今晚规则 */
  function decorateHome() {
    var home = document.querySelector("#screen .page") || document.querySelector(".page");
    if (!home || document.querySelector(".al-home-note")) return;
    var note = el("div", "al-home-note");
    var last = S.series[0];
    note.innerHTML =
      '<div class="al-note-line">台词 · 计时 · 反应分 · 惩罚债 已开启</div>' +
      (last ? '<div class="al-note-sub">上一夜记了一句：' + esc(last.note) + '</div>' : "");
    home.insertBefore(note, home.firstChild);
  }

  var boot = setInterval(function () {
    if (document.querySelector("#screen .page") || document.querySelector(".page")) {
      decorateHome();
      clearInterval(boot);
    }
  }, 600);

  window.__adult = { state: S, take: FD.take, mount: mount, after: showAftercare, reload: function () { S = loadS(); },
    api: { allowed: allowed, vecOf: vecOf, poolsFor: poolsFor, cards: CARDS, get S() { return S; } } };
  console.log("[adult] layer ready · pools=" + POOLS.length + " · punish unlocked");
})();

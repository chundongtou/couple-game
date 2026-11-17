/* ===== V6 core/ui.js：通用 UI 组件（toast / sheet / confirm / 心动值 / 星级 / 规则速览 / 触感 / 夜空背景） ===== */
(function () {
  var App = (window.App = window.App || {});
  var U = App.util;
  if (!U) return;

  var toastQueue = [];
  var toastBusy = false;
  var styles = {};

  var ICONS = {
    heart: "♥", spark: "✦", star: "★", starEmpty: "☆",
    back: "←", close: "✕", arrow: "→", check: "✓", warn: "!", moon: "☾", play: "▶", pause: "❚❚"
  };

  /* 心动值阶段（impl-freeze §2.3 / spec §5.1） */
  var HEAT_STAGES = [
    { max: 19, id: "cold", name: "灯刚亮" },
    { max: 39, id: "warm", name: "有点热" },
    { max: 59, id: "charged", name: "靠近了" },
    { max: 79, id: "burning", name: "很近了" },
    { max: 100, id: "blazing", name: "今晚可以更近" }
  ];

  /* 玩法速览 6 条（copy.md §1.6；AC-A5-1 断言这 6 条标题）
     V6.1（impl-freeze-v6.1 §3.1 / spec AC-A5-1）：①「6 起飞 · 6 可再掷」合为一条并补
     「连续两次没掷出 6，第三次任意点数保底起飞」；新增 ④「先到家就收尾」（一方把全部飞机送进终点
     → 今晚收尾，题卡数/心动值不再触发结束）。数量仍是 6 条，六个标题文本全在。 */
  var RULES = [
    { t: "6 起飞 · 6 可再掷", d: "掷出 6，才有一架飞机从机坪起飞，走完还能再掷一次；连续两次没掷出 6，第三次任意点数保底起飞。" },
    { t: "跳/飞/进航", d: "落在跳格向前 4 格，飞点向前 12 格；进航格转进自己的航线。" },
    { t: "击落回机坪", d: "落在对方飞机所在的格子，对方的飞机回机坪。" },
    { t: "先到家就收尾", d: "一方把全部飞机送进终点 → 今晚收尾；快局 2 架、长夜 4 架。题卡数与心动值只作过程记录。", end: true },
    { t: "放过不惩罚", d: "题卡可以放过：心动值不减少、不挡路、连击不清零。" },
    { t: "安全词随时可停", d: "按住右上角「先收棋」1.6 秒，任何屏幕都能先停一下。" }
  ];

  function settings() { try { return App.Store.getSettings(); } catch (e) { return {}; } }

  function injectStyle(id, css) {
    if (styles[id]) return;
    var el = document.createElement("style");
    el.id = "style-" + id;
    el.textContent = css;
    document.head.appendChild(el);
    styles[id] = true;
  }

  function toastHost() {
    var host = document.getElementById("toasts");
    if (!host) {
      host = document.createElement("div");
      host.id = "toasts";
      host.setAttribute("aria-live", "assertive");
      (document.getElementById("app") || document.body).appendChild(host);
    }
    return host;
  }

  function toast(msg, opts) {
    opts = opts || {};
    if (!msg) return;
    toastQueue.push({ msg: String(msg), kind: opts.kind || "default", dur: opts.dur || 1900 });
    if (toastQueue.length > 3) toastQueue.shift();
    if (!toastBusy) nextToast();
  }

  function nextToast() {
    var t = toastQueue.shift();
    if (!t) { toastBusy = false; return; }
    toastBusy = true;
    var host = toastHost();
    var el = document.createElement("div");
    el.className = "toast " + t.kind;
    el.setAttribute("role", "status");
    el.textContent = t.msg;
    host.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("on"); });
    setTimeout(function () {
      el.classList.remove("on");
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); nextToast(); }, 260);
    }, t.dur);
  }

  /* ---------- 触感 ---------- */
  var userTapped = false;
  try {
    document.addEventListener("pointerdown", function () { userTapped = true; }, true);
  } catch (e) {}

  function vibrate(pattern) {
    if (!userTapped) return; /* 无用户手势时 Chrome 会拒绝 vibrate 并打 console error */
    if (settings().haptics === false) return;
    try { if (navigator.vibrate) navigator.vibrate(pattern || 12); } catch (e) {}
  }

  function haptic(kind) {
    if (kind === "success") vibrate([14, 30, 18]);
    else if (kind === "warn") vibrate([24, 40, 24]);
    else if (kind === "heavy") vibrate(38);
    else if (kind === "error") vibrate([30, 50, 30]);
    else if (kind === "select") vibrate(8);
    else vibrate(10);
  }

  /* ---------- 底部 sheet ---------- */
  function sheet(opts) {
    opts = opts || {};
    var overlay = document.getElementById("overlay") || document.body;
    var mask = document.createElement("div");
    mask.className = "sheet-mask";
    var panel = document.createElement("div");
    panel.className = "sheet " + (opts.cls || "");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    if (opts.label) panel.setAttribute("aria-label", opts.label);
    var head = "";
    if (opts.title) {
      head += '<div class="sheet-head"><div class="sheet-title">' + U.escape(opts.title) + "</div>" +
        (opts.subtitle ? '<div class="sheet-sub">' + U.escape(opts.subtitle) + "</div>" : "") +
        (opts.dismissible === false ? "" : '<button class="icon-btn sheet-x" data-close aria-label="关闭">' + ICONS.close + "</button>") +
        "</div>";
    }
    panel.innerHTML = head + '<div class="sheet-body">' + (opts.html || "") + "</div>";
    mask.appendChild(panel);
    overlay.appendChild(mask);
    requestAnimationFrame(function () {
      mask.classList.add("on");
      panel.classList.add("on");
    });
    var closed = false;
    function close(val) {
      if (closed) return;
      closed = true;
      mask.classList.remove("on");
      panel.classList.remove("on");
      setTimeout(function () { if (mask.parentNode) mask.parentNode.removeChild(mask); }, 340);
      if (opts.onClose) opts.onClose(val);
    }
    if (opts.dismissible !== false) {
      mask.addEventListener("click", function (e) { if (e.target === mask) close(); });
      panel.addEventListener("click", function (e) {
        var t = e.target.closest ? e.target.closest("[data-close]") : null;
        if (t) close();
      });
      mask.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.stopPropagation(); close(); }
      });
    }
    /* 安全词层在 sheet 之上，所以这里不需要抢焦点，只把可点内容标出来 */
    panel.querySelectorAll(".btn").forEach(function (b) { b.setAttribute("type", "button"); });
    if (opts.onMount) opts.onMount(panel, close);
    return { close: close, panel: panel, mask: mask };
  }

  function confirm(opts) {
    opts = typeof opts === "string" ? { text: opts } : (opts || {});
    return new Promise(function (resolve) {
      var answered = false;
      var ref = sheet({
        title: opts.title || "确认",
        html: '<p class="sheet-text">' + U.escape(opts.text || "") + "</p>" +
          '<div class="sheet-actions">' +
          '<button class="btn ghost" data-no type="button">' + U.escape(opts.cancel || "取消") + "</button>" +
          '<button class="btn primary" data-yes type="button">' + U.escape(opts.ok || "确定") + "</button></div>",
        dismissible: true,
        onClose: function () { if (!answered) { answered = true; resolve(false); } },
        onMount: function (panel) {
          panel.querySelector("[data-no]").addEventListener("click", function () { answered = true; ref.close(); resolve(false); });
          panel.querySelector("[data-yes]").addEventListener("click", function () { answered = true; ref.close(); resolve(true); });
        }
      });
    });
  }

  /* ---------- 规则速览（首次进局 + 主桌「规则」共用） ---------- */
  /* V6.1：「先到家就收尾」这一条用暖色描边强调（样式随 ui.js 注入，不改 base.css） */
  var RULES_END_CSS =
    ".recap-row.end{border-color:rgba(243,192,119,.34);" +
    "background:linear-gradient(100deg,rgba(243,192,119,.12),rgba(255,236,214,.03))}" +
    ".recap-row.end .rk{color:#F3C077}";

  function rulesSheet() {
    injectStyle("rules-end", RULES_END_CSS);
    var items = RULES.map(function (r, i) {
      return '<div class="recap-row' + (r.end ? " end" : "") + '"' + (r.end ? ' data-test="rules-end"' : "") + ">" +
        '<div class="rk">' + (i + 1) + " · " + U.escape(r.t) + "</div>" +
        '<div class="rt">' + U.escape(r.d) + "</div></div>";
    }).join("");
    var ref = sheet({
      title: "玩法速览",
      subtitle: "第一次玩，看这六条就够了。",
      cls: "rules-sheet",
      dismissible: true,
      html: '<div class="recap-list" data-test="rules-list">' + items + "</div>" +
        '<button class="btn primary wide mt-16" data-test="rules-ok" type="button">知道了</button>',
      onMount: function (panel, close) {
        panel.querySelector("[data-test=rules-ok]").addEventListener("click", function () {
          close("ok");
          if (App.Bus) App.Bus.emit("rules-seen", true);
        });
      }
    });
    /* QA/fe-table 统一钩子：App.UI.rulesSheet() 打开的面板 */
    if (ref && ref.panel) ref.panel.setAttribute("data-test", "rules-sheet");
    return ref;
  }

  /* ---------- 心动值 / 星级 ---------- */
  function heatStage(heat) {
    var v = Math.max(0, Math.min(100, Math.round(Number(heat) || 0)));
    for (var i = 0; i < HEAT_STAGES.length; i++) if (v <= HEAT_STAGES[i].max) return HEAT_STAGES[i];
    return HEAT_STAGES[HEAT_STAGES.length - 1];
  }

  function heatPill(heat) {
    var stage = heatStage(heat);
    var hot = stage.id === "burning" || stage.id === "blazing";
    return '<span class="heat-pill' + (hot ? " hot" : "") + '" data-test="heat-pill">' +
      '<i aria-hidden="true"></i>心动值 ' + U.round(heat) + " · " + U.escape(stage.name) + "</span>";
  }

  function stars(n, max) {
    max = max || 5;
    var out = "";
    for (var i = 1; i <= max; i++) out += i <= n ? ICONS.star : ICONS.starEmpty;
    return out;
  }

  function starsHTML(n, max) {
    max = max || 5;
    var out = "";
    for (var i = 1; i <= max; i++) out += i <= n ? ICONS.star : '<span class="off">' + ICONS.star + "</span>";
    return '<span class="stars" aria-label="' + (Number(n) || 0) + ' 星">' + out + "</span>";
  }

  function fmtDuration(ms) {
    var s = Math.max(0, Math.round((Number(ms) || 0) / 1000));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return (h ? h + ":" + (m < 10 ? "0" : "") + m : m) + ":" + (sec < 10 ? "0" : "") + sec;
  }

  /* ---------- 夜空背景（app.js 启动时调用一次；幂等） ---------- */
  function mountBackdrop() {
    var bg = document.getElementById("bg");
    if (!bg || bg.getAttribute("data-v6") === "1") return;
    bg.setAttribute("data-v6", "1");
    var neb = document.createElement("div");
    neb.className = "v6-nebula";
    bg.appendChild(neb);

    /* 星点：固定种子，避免每次刷新闪烁 */
    var seed = 20261116;
    function rnd() { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; }
    var w = 430, h = 932, frag = "";
    for (var i = 0; i < 96; i++) {
      var x = (rnd() * w).toFixed(1), y = (rnd() * h).toFixed(1);
      var r = (0.35 + rnd() * 1.05).toFixed(2), o = (0.14 + rnd() * 0.62).toFixed(2);
      frag += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#FFE9D2" opacity="' + o + '"/>';
    }
    for (var j = 0; j < 7; j++) {
      var x2 = (rnd() * w).toFixed(1), y2 = (rnd() * h * 0.66).toFixed(1);
      frag += '<circle cx="' + x2 + '" cy="' + y2 + '" r="1.5" fill="#FFF3DF" opacity=".9"/>' +
        '<circle cx="' + x2 + '" cy="' + y2 + '" r="5" fill="none" stroke="rgba(255,233,210,.18)" stroke-width=".7"/>';
    }
    var sky = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    sky.setAttribute("class", "v6-sky");
    sky.setAttribute("viewBox", "0 0 430 932");
    sky.setAttribute("aria-hidden", "true");
    sky.setAttribute("preserveAspectRatio", "xMidYMid slice");
    sky.innerHTML = frag;
    bg.appendChild(sky);

    var orbit = document.createElement("div");
    orbit.className = "v6-orbit";
    orbit.setAttribute("aria-hidden", "true");
    orbit.innerHTML =
      '<svg viewBox="0 0 600 600">' +
      '<defs><linearGradient id="v6og" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#F3C077" stop-opacity="0"/>' +
      '<stop offset=".55" stop-color="#F3C077" stop-opacity=".55"/>' +
      '<stop offset="1" stop-color="#E9887A" stop-opacity="0"/></linearGradient></defs>' +
      '<circle cx="300" cy="300" r="268" fill="none" stroke="rgba(243,192,119,.13)" stroke-width="1" stroke-dasharray="1 10" stroke-linecap="round"/>' +
      '<path d="M 300 32 A 268 268 0 0 1 568 300" fill="none" stroke="url(#v6og)" stroke-width="1.5" stroke-linecap="round" opacity=".85"/>' +
      "</svg>";
    bg.appendChild(orbit);

    var grain = document.createElement("div");
    grain.className = "v6-grain";
    bg.appendChild(grain);
  }

  function syncSettings() {
    var s = settings();
    if (App.Audio && App.Audio.setEnabled) App.Audio.setEnabled(s.sound !== false);
    if (App.Motion && App.Motion.syncBodyClass) App.Motion.syncBodyClass();
    document.body.classList.toggle("sound-off", s.sound === false);
  }

  function topbar(title, opts) {
    opts = opts || {};
    return '<div class="topbar">' +
      '<button class="back" data-go="' + (opts.back || "boot") + '" data-test="back" aria-label="返回">' + ICONS.back + "</button>" +
      '<div class="tb-title">' + U.escape(title) + "</div>" +
      '<div class="tb-right"></div></div>';
  }

  App.UI = {
    ICONS: ICONS,
    RULES: RULES,
    HEAT_STAGES: HEAT_STAGES,
    injectStyle: injectStyle,
    toast: toast,
    sheet: sheet,
    confirm: confirm,
    rulesSheet: rulesSheet,
    vibrate: vibrate,
    haptic: haptic,
    heatStage: heatStage,
    heatPill: heatPill,
    stars: stars,
    starsHTML: starsHTML,
    fmtDuration: fmtDuration,
    topbar: topbar,
    mountBackdrop: mountBackdrop,
    icon: function (name) { return ICONS[name] || ""; },
    syncSettings: syncSettings,
    overlay: function () { return document.getElementById("overlay"); },
    screenRoot: function () { return document.getElementById("screen"); }
  };
})();

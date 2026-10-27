/* ===== V3 ui/screens/settings.js：设置（体验 / 默认尺度 / 安全词 / 数据 / 关于） ===== */
(function () {
  var App = window.App;
  var U = App.util;
  var M = App.Motion;

  App.UI.injectStyle("settings", [
    '.settings-head { margin-bottom: 18px; }',
    '.settings-head .kicker { display: block; margin-bottom: 8px; }',
    '.settings-head .title-lg { margin-bottom: 6px; }',
    '.settings-head .small { line-height: 1.7; max-width: 330px; }',
    '.st-card { padding: 16px 18px; margin-bottom: 14px; }',
    '.st-card-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; font-size: 11px; letter-spacing: .2em; color: var(--gold); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; }',
    '.st-card-head .hint { font-size: 10.5px; letter-spacing: .04em; color: var(--dim2); font-weight: 500; text-transform: none; }',
    '.st-row { display: flex; align-items: center; gap: 14px; padding: 13px 0; border-bottom: 1px solid var(--line); }',
    '.st-row:last-child { border-bottom: 0; padding-bottom: 2px; }',
    '.st-row-tx { flex: 1; min-width: 0; }',
    '.st-row-tx b { display: block; font-size: 14.5px; letter-spacing: .05em; }',
    '.st-row-tx .small { display: block; margin-top: 2px; line-height: 1.55; }',
    '.st-switch { width: 52px; height: 32px; flex: 0 0 auto; border-radius: 999px; border: 1px solid var(--line2); background: rgba(255,255,255,.12); position: relative; transition: background .22s var(--ease), border-color .22s; }',
    '.st-switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; border-radius: 50%; background: #fff; opacity: .75; transition: transform .22s var(--ease), opacity .22s; }',
    '.st-switch.on { background: linear-gradient(135deg, var(--gold), var(--rose)); border-color: transparent; }',
    '.st-switch.on::after { transform: translateX(20px); opacity: 1; }',
    '.st-scales { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; margin-top: 8px; }',
    '.st-scale { display: flex; flex-direction: column; align-items: flex-start; gap: 2px; padding: 12px 14px; min-height: 66px; border-radius: var(--r-md); border: 1px solid var(--line); background: var(--glass); transition: border-color .2s var(--ease), background .2s var(--ease), box-shadow .2s var(--ease), transform .14s var(--ease); }',
    '.st-scale:active { transform: scale(.98); }',
    '.st-scale.on { border-color: rgba(243,200,121,.6); background: linear-gradient(135deg, rgba(243,200,121,.15), rgba(255,95,158,.09)); box-shadow: var(--glow-gold); }',
    '.st-scale .st-scale-stars { font-size: 10.5px; letter-spacing: .14em; color: var(--gold); }',
    '.st-scale .st-scale-name { font-size: 14.5px; font-weight: 800; letter-spacing: .08em; }',
    '.st-scale .st-scale-sub { font-size: 10.5px; color: var(--dim2); line-height: 1.45; }',
    '.st-scale-desc { margin-top: 10px; font-size: 12px; color: var(--dim); line-height: 1.7; min-height: 20px; }',
    '.st-safe { border-color: rgba(255,95,109,.24); background: linear-gradient(160deg, rgba(255,95,109,.08), rgba(255,255,255,.02)); }',
    '.st-safe .st-safe-text { font-size: 13px; color: var(--dim); line-height: 1.85; margin-top: 4px; }',
    '.st-safe .st-safe-text b { color: #ffc3c7; }',
    '.st-safe .st-safe-line { margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,95,109,.28); font-size: 11.5px; color: var(--dim2); letter-spacing: .05em; }',
    '.st-data-actions { display: flex; flex-direction: column; gap: 9px; margin-top: 8px; }',
    '.st-data-actions .btn { min-height: 48px; font-size: 14px; }',
    '.st-note { margin-top: 10px; font-size: 11px; color: var(--dim2); line-height: 1.7; }',
    '.st-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 7px 0; font-size: 13px; color: var(--dim); border-bottom: 1px dashed var(--line); }',
    '.st-meta:last-of-type { border-bottom: 0; }',
    '.st-meta b { color: var(--ink); font-weight: 700; font-variant-numeric: tabular-nums; }',
    '.st-toggles .st-row { padding: 12px 0; }',
    '.settings-foot { margin-top: auto; padding: 18px 0 calc(6px + var(--safe-b)); }',
    '.settings-enter { opacity: 0; animation: settingsIn .44s var(--ease-out) forwards; }',
    '@keyframes settingsIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }',
    'body.reduce .settings-enter { opacity: 1; animation: none; }'
  ].join("\n"));

  var SCALES = [
    { n: 1, name: "温柔", sub: "慢一点也很好", desc: "只出现轻缓的卡：靠近、拥抱、说一句真心话。" },
    { n: 2, name: "暧昧", sub: "点到为止的撩", desc: "有点电流，但都留有余地。" },
    { n: 3, name: "热烈", sub: "现在这样的浓度", desc: "热，但仍然在可停下的范围里。" },
    { n: 4, name: "不设限", sub: "边界交给你们", desc: "不提前设限，觉得过界随时喊停。" }
  ];

  var S = null;

  function qs(sel) { return U.qs(sel, S.root); }
  function qsa(sel) { return U.qsa(sel, S.root); }

  function scaleMeta(n) {
    for (var i = 0; i < SCALES.length; i++) if (SCALES[i].n === n) return SCALES[i];
    return SCALES[2];
  }
  function cardCount() {
    var total = 0;
    try {
      if (window.CARDS) Object.keys(window.CARDS).forEach(function (k) { total += (window.CARDS[k] || []).length; });
    } catch (e) {}
    return total;
  }
  function endingCount() {
    try { if (window.CONTENT && window.CONTENT.endings instanceof Array) return window.CONTENT.endings.length; } catch (e) {}
    return 6;
  }
  function versionText() {
    return (App.version || "3.0.0") + (App.Engine && App.Engine.version ? " · engine " + App.Engine.version : "");
  }

  function exportFileName() {
    var d = new Date();
    return "升温夜航备份-" + d.getFullYear() + "-" + U.pad2(d.getMonth() + 1) + "-" + U.pad2(d.getDate()) + ".json";
  }

  /* ---------------- 视图 ---------------- */
  function toggleRow(key, title, sub, testId) {
    var on = S.settings[key] !== false;
    return '<div class="st-row"><div class="st-row-tx"><b>' + title + '</b><span class="small muted">' + sub + "</span></div>" +
      '<button class="st-switch' + (on ? " on" : "") + '" data-act="toggle" data-key="' + key + '" data-test="' + testId + '" role="switch" aria-checked="' + (on ? "true" : "false") + '" aria-label="' + title + '"></button></div>';
  }

  function scaleCards() {
    return SCALES.map(function (s) {
      var on = S.settings.maxStar === s.n;
      return '<button class="st-scale' + (on ? " on" : "") + '" data-act="scale" data-n="' + s.n + '" data-test="settings-maxstar-' + s.n + '" role="radio" aria-checked="' + (on ? "true" : "false") + '">' +
        '<span class="st-scale-stars">' + App.UI.stars(s.n, 4) + "</span>" +
        '<span class="st-scale-name">' + s.name + "</span>" +
        '<span class="st-scale-sub">' + s.sub + "</span>" +
        "</button>";
    }).join("");
  }

  function bodyHtml() {
    var s = S.settings;
    return '<div class="page settings">' +
      '<div class="topbar">' +
      '<button class="back" data-act="back" data-test="settings-back" aria-label="返回">←</button>' +
      '<div class="tb-title">设置</div>' +
      '<div class="tb-right"></div>' +
      "</div>" +

      '<div class="settings-head settings-enter">' +
      '<div class="kicker">SETTINGS</div>' +
      '<h2 class="title-lg">你们的口味与边界</h2>' +
      '<p class="muted small">改完立刻生效，也会留给下一晚。</p>' +
      "</div>" +

      '<div class="glass st-card settings-enter">' +
      '<div class="st-card-head">体验</div>' +
      toggleRow("sound", "声音", "WebAudio 合成音效，没有外部资源", "settings-sound") +
      toggleRow("haptics", "触感", "支持的设备上会有轻微震动", "settings-haptics") +
      toggleRow("reduced", "减少动效", "关闭粒子与长动画，只保留淡入", "settings-reduced") +
      "</div>" +

      '<div class="glass st-card settings-enter">' +
      '<div class="st-card-head"><span>默认尺度</span><span class="hint">越过上限的卡不会出现</span></div>' +
      '<div class="st-scales" role="radiogroup" aria-label="默认尺度">' + scaleCards() + "</div>" +
      '<div class="st-scale-desc" id="stScaleDesc">' + scaleMeta(s.maxStar).desc + "</div>" +
      "</div>" +

      '<div class="glass st-card st-safe settings-enter">' +
      '<div class="st-card-head">安全词</div>' +
      '<p class="st-safe-text">任何时候说「<b>停</b>」，或长按屏幕上的「停」按钮 <b>2 秒</b>——今晚会直接温柔收尾。不扣数据，也不需要解释理由。</p>' +
      '<div class="st-safe-line">⌁ 可以随时反悔，这不算扫兴。</div>' +
      "</div>" +

      '<div class="glass st-card settings-enter">' +
      '<div class="st-card-head"><span>数据</span><span class="hint">只存在这台手机里</span></div>' +
      '<div class="st-data-actions">' +
      '<button class="btn soft wide" data-act="export" data-test="settings-export">⬇ 导出备份</button>' +
      '<button class="btn soft wide" data-act="import" data-test="settings-import">⬆ 导入备份</button>' +
      '<input type="file" accept="application/json,.json" data-test="settings-file" class="hidden" id="stFile">' +
      '<button class="btn danger wide" data-act="reset" data-test="settings-reset">清除所有数据</button>' +
      "</div>" +
      '<p class="st-note">换手机、清缓存、无痕模式都会丢掉记录。建议偶尔导出一次，文件名会带上日期。</p>' +
      "</div>" +

      '<div class="glass st-card settings-enter">' +
      '<div class="st-card-head">关于</div>' +
      '<div class="st-meta"><span>版本</span><b data-test="settings-version">' + U.escape(versionText()) + "</b></div>" +
      '<div class="st-meta"><span>题库</span><b>' + cardCount() + " 张卡</b></div>" +
      '<div class="st-meta"><span>结局</span><b>' + endingCount() + " 种</b></div>" +
      '<p class="st-note">升温夜航 · 一台手机，三幕夜航，六种结局。没有账号，不联网，数据归你们。</p>' +
      "</div>" +

      '<div class="settings-foot">' +
      '<button class="btn primary wide" data-act="back">返回</button>' +
      "</div>" +
      "</div>";
  }

  function render() {
    if (!S) return;
    S.root.innerHTML = bodyHtml();
    if (!M.reduced()) {
      U.qsa(".settings-enter", S.root).forEach(function (el, i) {
        el.style.animationDelay = (i * 55) + "ms";
      });
    }
  }

  /* ---------------- 交互 ---------------- */
  function syncToggleDom(key) {
    var btn = qs('[data-act="toggle"][data-key="' + key + '"]');
    if (!btn) return;
    var on = S.settings[key] !== false;
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-checked", on ? "true" : "false");
  }

  function toggle(key) {
    var patch = {};
    patch[key] = !(S.settings[key] !== false);
    S.settings = App.Store.saveSettings(patch);
    try { App.UI.syncSettings(); } catch (e) {}
    syncToggleDom(key);
    App.Audio.play("select");
    if (key === "haptics" && S.settings.haptics) App.UI.haptic("success");
    var names = { sound: "声音", haptics: "触感", reduced: "减少动效" };
    App.UI.toast((names[key] || key) + "：" + (S.settings[key] ? "开" : "关"));
  }

  function selectScale(n) {
    n = U.clamp(parseInt(n, 10) || 3, 1, 4);
    if (S.settings.maxStar === n) return;
    S.settings = App.Store.saveSettings({ maxStar: n });
    qsa('[data-act="scale"]').forEach(function (el) {
      var on = parseInt(el.getAttribute("data-n"), 10) === n;
      el.classList.toggle("on", on);
      el.setAttribute("aria-checked", on ? "true" : "false");
    });
    var desc = qs("#stScaleDesc");
    if (desc) desc.textContent = scaleMeta(n).desc;
    App.Audio.play("select");
    App.UI.haptic();
    App.UI.toast("默认尺度：" + scaleMeta(n).name);
  }

  function exportBackup() {
    try {
      var data = App.Store.exportAll();
      var text = JSON.stringify(data, null, 2);
      var fname = exportFileName();
      var blob = new Blob([text], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = fname;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        try { URL.revokeObjectURL(url); } catch (e) {}
        try { a.remove(); } catch (e) {}
      }, 800);
      App.Audio.play("chime");
      App.UI.haptic("success");
      App.UI.toast("备份已导出 · " + fname);
    } catch (e) {
      App.UI.toast("导出没有成功，再试一次？", { kind: "rose" });
    }
  }

  function pickFile() {
    var input = qs('[data-test="settings-file"]');
    if (input) input.click();
  }

  function onFile(e) {
    var input = e.target;
    if (!input || !input.files || !input.files[0]) return;
    var file = input.files[0];
    var reader = new FileReader();
    reader.onload = function () {
      var obj = null;
      try { obj = JSON.parse(String(reader.result || "")); } catch (err) { obj = null; }
      if (!obj || typeof obj !== "object") {
        App.UI.toast("备份文件格式不对", { kind: "rose" });
        input.value = "";
        return;
      }
      var res = null;
      try { res = App.Store.importAll(obj); } catch (err) { res = { ok: false, msg: "恢复失败" }; }
      input.value = "";
      if (!res || !res.ok) {
        App.UI.toast((res && res.msg) || "导入失败", { kind: "rose" });
        return;
      }
      try { App.UI.syncSettings(); } catch (err) {}
      S.settings = App.Store.getSettings();
      render();
      App.Audio.play("chime");
      App.UI.haptic("success");
      var when = obj && obj.exportedAt ? "（" + String(obj.exportedAt).slice(0, 10) + " 的备份）" : "";
      App.UI.toast("已恢复" + when);
    };
    reader.onerror = function () { App.UI.toast("读取文件失败", { kind: "rose" }); };
    reader.readAsText(file);
  }

  function resetAll() {
    App.UI.confirm({
      title: "清除所有数据？",
      text: "今晚的存档、回忆册和设置都会被删掉，无法恢复。",
      ok: "清除",
      cancel: "再想想"
    }).then(function (yes) {
      if (!yes) return;
      try { App.Store.resetAll(); } catch (e) {}
      try { App.UI.syncSettings(); } catch (e) {}
      App.Audio.play("warn");
      App.UI.haptic("heavy");
      App.UI.toast("已清除，回到首页");
      if (App.Router.reset) App.Router.reset("boot");
      else App.Router.go("boot");
    });
  }

  function goBack() {
    App.Audio.play("tap");
    App.Router.back();
  }

  function onClick(e) {
    if (!S) return;
    var t = e.target.closest ? e.target.closest("[data-act]") : null;
    if (!t) return;
    var act = t.getAttribute("data-act");
    if (act === "back") { e.preventDefault(); goBack(); }
    else if (act === "toggle") { e.preventDefault(); toggle(t.getAttribute("data-key")); }
    else if (act === "scale") { e.preventDefault(); selectScale(t.getAttribute("data-n")); }
    else if (act === "export") { e.preventDefault(); exportBackup(); }
    else if (act === "import") { e.preventDefault(); pickFile(); }
    else if (act === "reset") { e.preventDefault(); resetAll(); }
  }

  function onChange(e) {
    if (!e.target) return;
    if (e.target.getAttribute && e.target.getAttribute("data-test") === "settings-file") onFile(e);
  }

  function onKey(e) {
    if (e.key === "Escape") { e.preventDefault(); goBack(); }
  }

  App.Screens = App.Screens || {};
  App.Screens.settings = {
    mount: function (root) {
      S = { root: root, settings: App.Store.getSettings() };
      render();
      root.addEventListener("click", onClick);
      root.addEventListener("change", onChange);
      root.addEventListener("keydown", onKey);
      return function cleanup() {
        try {
          root.removeEventListener("click", onClick);
          root.removeEventListener("change", onChange);
          root.removeEventListener("keydown", onKey);
        } catch (e) {}
        S = null;
      };
    },
    unmount: function () {}
  };
})();
